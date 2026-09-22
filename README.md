# QRSHIELD — Real-Time QR Phishing Detection & Quishing Prevention Platform

[![Detection Engine](https://img.shields.io/badge/Detection%20Engine-Multi--Layer%20Heuristics-emerald.svg)](#)
[![Security Hardened](https://img.shields.io/badge/Security-OWASP%20Top%2010%20Hardened-blue.svg)](#)
[![Response Time](https://img.shields.io/badge/Scan%20Latency-%3C300ms-red.svg)](#)
[![Mobile Support](https://img.shields.io/badge/Client-React%20Native%20%2F%20Expo-green.svg)](#)

QRShield (QR-Vortex) is an intelligent, multi-layered cybersecurity platform engineered to eliminate QR Phishing ("Quishing"), deceptive URL redirects, and credential-harvesting attacks by intercepting destinations and analyzing risk telemetry before links can open.

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
   - **Layer A (Global Threat Intel):** Queries VirusTotal v3 and Google Safe Browsing / Web Risk in parallel.
   - **Layer B (AI Feature Extraction):** Evaluates typosquatting, deceptive brand impersonation, and entropy.
   - **Layer C (Deterministic Rules):** Identifies credential harvesting patterns, suspicious shorteners, and protocol anomalies.
4. **Action Dispatch:**
   - **Safe (0–20):** Seamlessly navigates straight to destination without interrupting user flow.
   - **Warning (21–60):** Presents intermediate risk breakdown and requires deliberate confirmation.
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

## 4. Quick Start & Execution

### Running the Python FastAPI Backend:
```bash
cd services/api

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
* API Health Check: `http://localhost:8000/docs`
* Scan Endpoint: `POST http://localhost:8000/api/v1/scan`

### Running the React Native (Expo) Mobile App:
```bash
cd apps/mobile

# Install dependencies
npm install

# Start Metro Bundler
npx expo start -c
```
* Scan the displayed QR code with the **Expo Go** app on iOS / Android.

### Running the 3D Web Dashboard (Next.js):
```bash
# In the repository root
npm install
npm run dev
```
* Access 3D Platform: `http://localhost:3000`

---

## 5. Technology Stack

- **Mobile Client:** React Native, Expo SDK, Glassmorphic / Neumorphic UI Design, Expo Camera.
- **Web Client:** Next.js 14, Three.js, React Three Fiber, Tailwind CSS, Framer Motion.
- **Backend Service:** FastAPI, Python 3.9+, Pydantic v2, Uvicorn, Requests.
- **Threat Intelligence Integrations:** VirusTotal v3 API, Google Safe Browsing API, OpenAI (`gpt-4o-mini`).

---

## 6. License

MIT License. See `LICENSE` for details.
