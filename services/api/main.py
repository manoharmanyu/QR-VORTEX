import os
import base64
import hashlib
import json
import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI(title="QRShield API", version="1.0.0")

# Enable CORS for local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VT_API_KEY = os.getenv("VIRUSTOTAL_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
GSB_API_KEY = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY")

if OPENAI_API_KEY:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
else:
    openai_client = None

class ScanRequest(BaseModel):
    payload: str

class ScanResponse(BaseModel):
    scan_id: str
    risk_score: int
    status: str
    classification: str
    redirects: List[str] = []
    signals: List[str] = []
    recommendation: str

def check_google_safe_browsing(url: str):
    if not GSB_API_KEY:
        return []
        
    endpoint = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GSB_API_KEY}"
    payload = {
        "client": {
            "clientId": "qrshield",
            "clientVersion": "1.0.0"
        },
        "threatInfo": {
            "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
            "platformTypes": ["ANY_PLATFORM"],
            "threatEntryTypes": ["URL"],
            "threatEntries": [{"url": url}]
        }
    }
    
    try:
        res = requests.post(endpoint, json=payload, timeout=5)
        if res.status_code == 200:
            data = res.json()
            matches = data.get("matches", [])
            signals = []
            for match in matches:
                threat_type = match.get("threatType", "THREAT")
                signals.append(f"Google Safe Browsing: {threat_type}")
            return signals
    except Exception as e:
        print(f"GSB Error: {e}")
        pass
    
    return []

def check_virustotal(url: str):
    if not VT_API_KEY:
        return {"malicious": 0, "suspicious": 0, "signals": []}
        
    url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
    headers = {"x-apikey": VT_API_KEY}
    
    try:
        res = requests.get(f"https://www.virustotal.com/api/v3/urls/{url_id}", headers=headers, timeout=5)
        if res.status_code == 200:
            data = res.json().get("data", {}).get("attributes", {}).get("last_analysis_stats", {})
            
            malicious_count = data.get("malicious", 0)
            suspicious_count = data.get("suspicious", 0)
            
            signals = []
            if malicious_count > 0:
                signals.append(f"VirusTotal flagged as malicious by {malicious_count} engines")
            if suspicious_count > 0:
                signals.append(f"VirusTotal flagged as suspicious by {suspicious_count} engines")
                
            return {"malicious": malicious_count, "suspicious": suspicious_count, "signals": signals}
    except Exception as e:
        print(f"VT Error: {e}")
        pass
    
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
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return None

@app.post("/api/v1/scan", response_model=ScanResponse)
def scan_qr(req: ScanRequest):
    url = req.payload.lower()
    
    # Base heuristic signals
    signals = []
    risk_score = 0
    
    # 1. Threat Intel: Google Safe Browsing
    gsb_signals = check_google_safe_browsing(url)
    if gsb_signals:
        signals.extend(gsb_signals)
        risk_score += 90  # Extremely high risk if Google flags it
    
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
        ai_signals = ai_result.get("signals", [])
        for sig in ai_signals:
            if sig not in signals:
                signals.append(sig)
    
    # Fallback heuristics
    if risk_score == 0:
        if "http://" in url:
            risk_score += 15
            signals.append("Insecure HTTP protocol")
        if "@" in url:
            risk_score += 40
            signals.append("Credential harvesting pattern (@ symbol)")
        
    # Final Classification
    risk_score = min(risk_score, 100)
    
    if risk_score <= 20:
        status = "safe"
        classification = "benign"
        recommendation = "allow"
    elif risk_score <= 60:
        status = "warning"
        classification = "suspicious"
        recommendation = "warn"
    else:
        status = "blocked"
        classification = "phishing"
        recommendation = "block"

    # Generate Scan ID
    hash_object = hashlib.md5(url.encode())
    scan_id = f"QR-{hash_object.hexdigest()[:6].upper()}"

    return ScanResponse(
        scan_id=scan_id,
        risk_score=risk_score,
        status=status,
        classification=classification,
        signals=signals,
        recommendation=recommendation,
        redirects=[]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
