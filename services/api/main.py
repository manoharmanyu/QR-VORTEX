import os
import base64
import hashlib
import json
import logging
import re
import time
from collections import defaultdict
from typing import List, Optional

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator
from openai import OpenAI

load_dotenv()

# Configure internal logging (never leak internal exceptions to client)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("qrshield.security")

ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
IS_PROD = ENVIRONMENT == "production"

# Disable interactive docs in production to prevent surface reconnaissance
app = FastAPI(
    title="QRShield API",
    version="1.0.0",
    docs_url=None if IS_PROD else "/docs",
    redoc_url=None if IS_PROD else "/redoc",
    openapi_url=None if IS_PROD else "/openapi.json",
)

# 1. CORS Configuration (Restricted)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    # Safe defaults for local/mobile dev
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
        "exp://127.0.0.1:8081",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if IS_PROD else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-API-Key"],
)

# 2. Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none';"
    response.headers["Referrer-Policy"] = "no-referrer"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Cache-Control"] = "no-store, max-age=0"
    return response

# 3. Server-side Rate Limiting (In-memory Sliding Window)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = int(os.getenv("RATE_LIMIT_PER_MIN", "60"))
client_request_counts = defaultdict(list)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Only rate-limit API scan route
    if request.url.path.startswith("/api/v1/scan"):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean timestamps older than window
        timestamps = [t for t in client_request_counts[client_ip] if now - t < RATE_LIMIT_WINDOW]
        if len(timestamps) >= RATE_LIMIT_MAX:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded. Please try again later."},
                headers={"Retry-After": str(RATE_LIMIT_WINDOW)},
            )
        timestamps.append(now)
        client_request_counts[client_ip] = timestamps

    return await call_next(request)

# 4. API Key / Secrets Management
VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GSB_API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")
REQUIRED_API_SECRET = os.getenv("API_SECRET_KEY", "")

openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

# 5. Input Validation & Sanitization Schema
DANGEROUS_SCHEMES = ("javascript:", "data:", "vbscript:", "file:", "blob:", "about:")

class ScanRequest(BaseModel):
    payload: str = Field(
        ...,
        min_length=1,
        max_length=2048,
        description="Scanned QR payload or target URL"
    )

    @field_validator("payload")
    @classmethod
    def sanitize_and_validate(cls, v: str) -> str:
        cleaned = v.strip()
        
        # Strip null bytes and control chars (prevent injection attacks)
        if "\x00" in cleaned or any(ord(c) < 32 for c in cleaned):
            raise ValueError("Invalid characters detected in payload")
        
        lower_val = cleaned.lower()
        if lower_val.startswith(DANGEROUS_SCHEMES):
            raise ValueError("Prohibited URL scheme detected")
        
        return cleaned

class ScanResponse(BaseModel):
    scan_id: str
    risk_score: int
    status: str
    classification: str
    redirects: List[str] = []
    signals: List[str] = []
    recommendation: str

# 6. Global Exception Handler (No sensitive leak)
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal processing error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred during security evaluation."},
    )

def check_google_safe_browsing(url: str) -> List[str]:
    if not GSB_API_KEY:
        return []
        
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GSB_API_KEY}"
    payload = {
        "client": {"clientId": "qrshield", "clientVersion": "1.0.0"},
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}],
        },
    }
    
    try:
        res = requests.post(endpoint, json=payload, timeout=4)
        if res.status_code == 200:
            data = res.json()
            matches = data.get("matches", [])
            return [f"Google Safe Browsing: {m.get('threatType', 'THREAT')}" for m in matches]
    except Exception as e:
        logger.warning(f"Google Safe Browsing query failed: {e}")
    
    return []

def check_virustotal(url: str):
    if not VT_API_KEY:
        return {"malicious": 0, "suspicious": 0, "signals": []}
        
    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
    headers = {"x-apikey": VT_API_KEY}
    
    try:
        res = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers, timeout=4)
        if res.status_code == 200:
            attrs = res.json().get("data", {}).get("attributes", {})
            stats = attrs.get("last_analysis_stats", {})
            
            malicious_count = stats.get("malicious", 0)
            suspicious_count = stats.get("suspicious", 0)
            
            signals = []
            if malicious_count > 0:
                signals.append(f"VirusTotal flagged as malicious by {malicious_count} engines")
            if suspicious_count > 0:
                signals.append(f"VirusTotal flagged as suspicious by {suspicious_count} engines")
                
            return {"malicious": malicious_count, "suspicious": suspicious_count, "signals": signals}
    except Exception as e:
        logger.warning(f"VirusTotal query failed: {e}")
    
    return {"malicious": 0, "suspicious": 0, "signals": []}

def check_openai(url: str):
    if not openai_client:
        return None
        
    prompt = f"""
    You are a cybersecurity AI analyst. Analyze the following URL for phishing, malicious intent, or suspicious features.
    URL: {url}
    
    Consider:
    - Look-alike domains (typosquatting)
    - Suspicious TLDs
    - Credential harvesting keywords (login, secure, verify, auth)
    - URL structure anomalies
    
    Respond STRICTLY in JSON format with exactly these fields:
    {{
      "risk_score": <int between 0 and 100>,
      "classification": "<safe | suspicious | phishing>",
      "signals": ["<list of 1-3 short threat indicators, or empty if safe>"]
    }}
    """
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            timeout=5,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        logger.warning(f"OpenAI analysis query failed: {e}")
        return None

@app.post("/api/v1/scan", response_model=ScanResponse)
def scan_qr(req: ScanRequest, request: Request):
    # Optional server-side API key check if configured
    if REQUIRED_API_SECRET:
        client_key = request.headers.get("X-API-Key")
        if client_key != REQUIRED_API_SECRET:
            raise HTTPException(status_code=401, detail="Unauthorized API access")

    url = req.payload.lower()
    
    signals: List[str] = []
    risk_score = 0
    
    # 1. Threat Intel: Google Safe Browsing
    gsb_signals = check_google_safe_browsing(url)
    if gsb_signals:
        signals.extend(gsb_signals)
        risk_score += 90
    
    # 2. Threat Intel: VirusTotal
    vt_result = check_virustotal(url)
    signals.extend(vt_result.get("signals", []))
    if vt_result["malicious"] > 0:
        risk_score += 80
    elif vt_result["suspicious"] > 0:
        risk_score += 40
        
    # 3. AI Analysis: OpenAI
    ai_result = check_openai(url)
    if ai_result:
        ai_score = ai_result.get("risk_score", 0)
        risk_score = max(risk_score, ai_score)
        for sig in ai_result.get("signals", []):
            if sig not in signals:
                signals.append(sig)
    
    # 4. Fallback Heuristics
    if risk_score == 0:
        if url.startswith("http://"):
            risk_score += 15
            signals.append("Insecure HTTP protocol")
        if "@" in url:
            risk_score += 40
            signals.append("Credential harvesting pattern (@ symbol)")
        
    # Final Classification & Risk Caps
    risk_score = min(max(risk_score, 0), 100)
    
    if risk_score <= 20:
        status_val = "safe"
        classification = "benign"
        recommendation = "allow"
    elif risk_score <= 60:
        status_val = "warning"
        classification = "suspicious"
        recommendation = "warn"
    else:
        status_val = "blocked"
        classification = "phishing"
        recommendation = "block"

    # Privacy-conscious Scan ID generation
    scan_id = f"QR-{hashlib.sha256(url.encode()).hexdigest()[:8].upper()}"

    return ScanResponse(
        scan_id=scan_id,
        risk_score=risk_score,
        status=status_val,
        classification=classification,
        signals=signals,
        recommendation=recommendation,
        redirects=[],
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=not IS_PROD)
