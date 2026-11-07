# QRSHIELD (QR-VORTEX) — Real-Time QR Phishing Detection & Quishing Prevention Platform

[![Detection Engine](https://img.shields.io/badge/Detection%20Engine-Multi--Layer%20Heuristics-emerald.svg)](#)
[![Security Hardened](https://img.shields.io/badge/Security-OWASP%20Top%2010%20Hardened-blue.svg)](#)
[![Response Time](https://img.shields.io/badge/Scan%20Latency-%3C300ms-red.svg)](#)
[![Mobile Support](https://img.shields.io/badge/Client-React%20Native%20%2F%20Expo-green.svg)](#)
[![Web Platform](https://img.shields.io/badge/Web-Next.js%2014%20%2F%20Three.js-cyan.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2F%20Python-yellow.svg)](#)

QRShield is a multi-layered cybersecurity platform engineered to protect users from QR code phishing ("Quishing"), deceptive URL redirects, credential-harvesting patterns, and malicious payload executions before any target link can open.

---

## 1. Core Workflow & Multi-Layer Detection Engine

```
[ SCANNED QR PAYLOAD ] ──> (Normalizer & Protocol Check) ──> [ PARALLEL RISK ENGINE ]
                                                                       │
             ┌─────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┐
             ▼                                                         ▼                                                         ▼
[ THREAT INTEL TELEMETRY ]                                  [ AI HEURISTICS LAYER ]                                   [ DETERMINISTIC RULE ENGINE ]
(VirusTotal v3 + Google Safe Browsing)                      (OpenAI Anomaly & Typosquatting)                          (Scheme, @-Harvesting, Length, TLD)
             │                                                         │                                                         │
             └─────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────┘
                                                                       ▼
                                                       [ COMPOSITE RISK SCORE (0–100) ]
                                                                       │
                                     ┌─────────────────────────────────┴─────────────────────────────────┐
                                     ▼                                                                   ▼
                          [ VERDICT: SAFE (0–20) ]                                           [ VERDICT: MALICIOUS (61–100) ]
                          (Instant Non-Intrusive Pass)                                       (Hard Block & Threat Indicators Screen)
```

1. **Input:** Camera QR capture via Expo Camera or drag-and-drop web dropzone.
2. **URL Normalizer:** Strips dangerous schemes (`javascript:`, `data:`, `vbscript:`, `file:`, null bytes), standardizes character sets, and parses structural telemetry.
3. **Multi-Layer Threat Inspection:**
   - **Layer A (Global Threat Intel):** Queries VirusTotal v3 and Google Safe Browsing in parallel.
   - **Layer B (AI Feature Extraction):** Evaluates typosquatting, deceptive brand impersonation, and entropy.
   - **Layer C (Deterministic Rules):** Identifies credential harvesting patterns, suspicious shorteners, and protocol anomalies.
4. **Action Dispatch:**
   - **Safe (0–20):** Seamlessly navigates straight to destination without interrupting user flow.
   - **Warning (21–60):** Presents intermediate risk breakdown and requires deliberate user confirmation.
   - **Malicious (61–100):** **Hard block** prevents automated execution and isolates all threat signals.

---

## 2. Production Security Hardening Matrix

| Security Constraint | Implementation Detail |
| :--- | :--- |
| **Secure API Keys & Secrets** | Loaded strictly via environment variables (`load_dotenv`); zero hardcoded credentials. |
| **Hide all `.env` files** | Protected via `.gitignore`; strictly documented through `.env.example`. |
| **Check Git History for Secrets** | Verified clean commit tree with zero leaked keys or bearer tokens. |
| **Input Sanitization & Validation** | Server-side Pydantic models validate URI RFC 3986 compliance, strip null bytes (`\x00`), and enforce a 2048-character maximum. |
| **Prohibited Protocol Schemes** | Strict blocking of `javascript:`, `data:`, `vbscript:`, `file:`, and `blob:` injection vectors. |
| **Server-Side Rate Limiting** | Sliding-window IP rate limiter protecting `/api/v1/scan` against denial of service and API credit exhaustion. |
| **Security Headers & Strict CORS** | Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `HSTS`, `CSP: default-src 'none'`, and explicit origin whitelists. |
| **Disable Debug & Hide Errors** | Generic client error responses prevent internal stack trace leakage; interactive API docs disabled when `ENVIRONMENT=production`. |
| **Privacy & Data Isolation** | No user browsing logs or URLs permanently hoarded; scan records identified by privacy-preserving SHA-256 hashes. |
| **Client Separation** | Mobile and web clients hold zero third-party API credentials, communicating exclusively through the hardened API gateway. |

---

## 3. Risk Engine & Deterministic Classification

| Risk Score | Classification | Status | Interception Policy |
| :---: | :---: | :---: | :--- |
| **0 – 20** | `BENIGN` | `SAFE` | Automatic pass-through navigation. |
| **21 – 60** | `SUSPICIOUS` | `WARNING` | User advisory screen with detailed telemetry indicators. |
| **61 – 100** | `PHISHING / MALWARE` | `BLOCKED` | **Active Block.** Target URL quarantined with override prevention. |

---

## 4. API Specification

### `POST /api/v1/scan`

Scans and analyzes a given URL or QR code text payload.

#### Request Headers:
```http
Content-Type: application/json
X-API-Key: <OPTIONAL_API_SECRET_KEY>
```

#### Request Body:
```json
{
  "payload": "https://example.com"
}
```

#### Response (Clean / Safe):
```json
{
  "scan_id": "QR-C984D0",
  "risk_score": 0,
  "status": "safe",
  "classification": "benign",
  "redirects": [],
  "signals": [],
  "recommendation": "allow"
}
```

#### Response (Malicious / Blocked):
```json
{
  "scan_id": "QR-99999E",
  "risk_score": 80,
  "status": "blocked",
  "classification": "phishing",
  "redirects": [],
  "signals": [
    "VirusTotal flagged as malicious by 3 engines",
    "Credential harvesting pattern (@ symbol)"
  ],
  "recommendation": "block"
}
```

---

## 5. Repository Structure

```
qrshield/
├── apps/
│   └── mobile/                  # React Native / Expo Mobile App
│       ├── src/
│       │   ├── components/      # GlassCard, NeuButton (Neumorphic UI)
│       │   ├── context/         # HistoryContext (AsyncStorage persistent tracking)
│       │   ├── navigation/      # Stack & Bottom Tabs Navigator
│       │   ├── screens/         # HomeScreen, ScannerScreen, AnalyzingScreen, ResultScreen, HistoryScreen
│       │   └── theme/           # Emerald green & glassmorphism theme tokens
│       ├── App.tsx
│       ├── package.json
│       └── app.json
├── services/
│   └── api/                     # Python FastAPI Risk Engine
│       ├── main.py              # Scan endpoint, threat intel clients, security middleware
│       ├── requirements.txt
│       ├── .env.example
│       └── venv/
├── src/                         # Next.js 3D Web Application
│   ├── app/                     # Next.js App Router (pages & layout)
│   ├── components/              # 3D Canvas, Scanner Modal, Dashboard widgets
│   └── lib/                     # Client security engine & types
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 6. Local Deployment & Setup Guide

### 1. Prerequisites
- **Node.js** v18+ and `npm`
- **Python** 3.9+
- **Expo Go** app installed on your physical device (iOS or Android), or an iOS/Android simulator.

---

### 2. Backend Service (FastAPI)

```bash
cd services/api

# Create & activate Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env
```

Edit `.env` with your API keys:
```ini
GOOGLE_SAFE_BROWSING_API_KEY=your_key_here
VIRUSTOTAL_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
ENVIRONMENT=development
RATE_LIMIT_PER_MIN=60
```

Start the API server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* Interactive API Documentation: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/`

---

### 3. Mobile Client (React Native + Expo)

```bash
cd apps/mobile

# Install dependencies
npm install

# Start Metro Bundler with cleared cache
npx expo start -c
```

Open the **Expo Go** app on your phone:
- If your phone is on the same local Wi-Fi network, tap the project under **Development servers**.
- Or scan the terminal QR code using your phone's camera.

---

### 4. 3D Web Platform (Next.js)

```bash
# In the root repository directory
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Troubleshooting Local Deployment

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| **Port already in use (`EADDRINUSE: 8000` or `8081`)** | Previous background process didn't terminate cleanly. | Run `kill -9 $(lsof -t -i:8000) $(lsof -t -i:8081)` to clear occupied ports. |
| **Mobile app cannot reach backend (`Could not reach backend analysis server`)** | Phone and computer are on different Wi-Fi subnets, or Mac Firewall is blocking incoming connections to port 8000. | 1. Ensure phone & Mac are connected to the same Wi-Fi.<br>2. Run `npx expo start --tunnel` in `apps/mobile`.<br>3. In Mac System Settings > Network > Firewall, allow incoming connections for Python. |
| **`Native module is null (AsyncStorage)`** | Native dependencies were updated while Metro bundler was active. | Stop the bundler and restart with a clean cache: `npx expo start -c`. Force-close and re-open Expo Go on your device. |
| **OpenAI `429 Insufficient Quota`** | Missing billing credits on the configured OpenAI API key. | The backend automatically catches this error and falls back gracefully to VirusTotal, Google Safe Browsing, and local heuristics without crashing. |
| **`urllib3 LibreSSL` warning** | macOS bundled LibreSSL version notice. | Informational only; does not affect API functionality. |

---

## 8. Technology Stack

- **Mobile Client:** React Native, Expo SDK 57, React Navigation v6, Lucide Icons, AsyncStorage.
- **Web Client:** Next.js 14, Three.js, React Three Fiber, Tailwind CSS, Framer Motion.
- **Backend Service:** FastAPI, Python 3.9+, Pydantic v2, Uvicorn, Requests.
- **Threat Intelligence Feeds:** VirusTotal v3 REST API, Google Safe Browsing v4 API, OpenAI API (`gpt-4o-mini`).

---

## 9. License

Distributed under the MIT License. See `LICENSE` for details.
