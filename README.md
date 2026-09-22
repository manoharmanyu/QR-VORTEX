# QRShield — Real-Time QR Phishing Detection & Quishing Prevention Platform

![Detection Engine](https://img.shields.io/badge/Detection%20Engine-Multi--Layer%20Heuristics-emerald.svg)
![Security](https://img.shields.io/badge/Security-OWASP%20Top%2010%20Hardened-blue.svg)
![Response Time](https://img.shields.io/badge/Scan%20Latency-%3C300ms-red.svg)
![Mobile Support](https://img.shields.io/badge/Client-React%20Native%20%2F%20Expo-green.svg)

**QRShield (QR-Vortex)** is an intelligent, multi-layered cybersecurity platform designed to detect and prevent **QR phishing (Quishing)**, malicious redirects, deceptive URLs, credential-harvesting attacks, and other QR-based threats.

QRShield intercepts QR destinations before navigation, analyzes multiple security signals, calculates a **0–100 composite risk score**, and determines whether the destination should be **allowed, warned, or blocked**.

---

## 🚀 Core Workflow

```text
                    ┌─────────────────────┐
                    │   SCANNED QR CODE   │
                    └──────────┬──────────┘
                               │
                               ▼
                 ┌──────────────────────────┐
                 │ URL NORMALIZER & PARSER  │
                 │ Protocol + Input Checks  │
                 └────────────┬─────────────┘
                              │
                              ▼
              ┌────────────────────────────────┐
              │      PARALLEL RISK ENGINE      │
              └───────────────┬────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
 ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
 │ Threat Intel    │  │ AI Heuristics   │  │ Rule Engine     │
 │                 │  │                 │  │                 │
 │ VirusTotal v3   │  │ Typosquatting   │  │ URL Structure   │
 │ Google Safe     │  │ Brand Imperson. │  │ @-Harvesting    │
 │ Browsing /      │  │ Entropy         │  │ TLD Analysis    │
 │ Web Risk        │  │ Anomaly         │  │ Shorteners      │
 └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ▼
                  ┌────────────────────────┐
                  │   COMPOSITE RISK SCORE │
                  │        0 — 100         │
                  └────────────┬───────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
       ┌───────────┐     ┌────────────┐     ┌────────────┐
       │  0 – 20   │     │   21 – 60  │     │  61 – 100  │
       │   SAFE    │     │  WARNING   │     │ MALICIOUS  │
       └─────┬─────┘     └─────┬──────┘     └─────┬──────┘
             │                 │                  │
             ▼                 ▼                  ▼
       Automatic Pass    User Confirmation     HARD BLOCK
```

---

## 🔍 Detection Pipeline

### 1. QR Input

QRShield supports:

* 📷 Camera-based QR scanning
* 🖼️ QR/image upload
* 🔗 Direct URL analysis
* 📱 Mobile QR scanning
* 🌐 Web-based QR analysis

---

### 2. URL Normalization

Every QR payload passes through a server-side normalization and validation layer before external analysis.

The normalizer:

* Removes dangerous input
* Detects prohibited URI schemes
* Removes null bytes
* Normalizes character encoding
* Parses URL components
* Validates URI structure
* Enforces a maximum URL length of **2048 characters**

### Blocked Protocol Schemes

```text
javascript:
data:
vbscript:
file:
blob:
```

---

## 🛡️ Multi-Layer Threat Detection

### Layer A — Global Threat Intelligence

QRShield can query external threat-intelligence services such as:

* VirusTotal API v3
* Google Safe Browsing / Web Risk

These services provide reputation and threat information for URLs and domains.

---

### Layer B — AI Heuristics

The AI analysis layer evaluates characteristics including:

* Typosquatting
* Brand impersonation
* Domain similarity
* URL entropy
* Suspicious naming patterns
* Anomalous URL structures
* Potential phishing indicators

---

### Layer C — Deterministic Rule Engine

The rule engine detects structural indicators such as:

* Credential-harvesting patterns
* Suspicious URL parameters
* Excessive URL length
* Suspicious redirects
* URL shorteners
* Dangerous protocols
* `@`-based URL obfuscation
* Suspicious TLDs
* Encoded or malformed URLs

---

# 📊 Risk Classification

| Risk Score | Classification       | Status     | Action                     |
| :--------: | -------------------- | ---------- | -------------------------- |
|  **0–20**  | `BENIGN`             | 🟢 SAFE    | Automatic pass-through     |
|  **21–60** | `SUSPICIOUS`         | 🟡 WARNING | User confirmation required |
| **61–100** | `PHISHING / MALWARE` | 🔴 BLOCKED | Active block               |

### 🟢 Safe — 0–20

```text
Scan → Analyze → SAFE → Continue
```

The destination is considered low-risk based on the available detection signals.

### 🟡 Warning — 21–60

```text
Scan → Analyze → WARNING → Risk Breakdown → Confirmation
```

The user receives a detailed explanation of suspicious indicators before continuing.

### 🔴 Malicious — 61–100

```text
Scan → Analyze → MALICIOUS → HARD BLOCK
```

Navigation is prevented and the destination is isolated from the user.

---

# 🔐 Production Security Hardening

| Security Constraint      | Implementation                                     |
| ------------------------ | -------------------------------------------------- |
| **API Keys & Secrets**   | Environment variables using `load_dotenv`          |
| **`.env` Protection**    | `.gitignore` + `.env.example`                      |
| **Git Secret Hygiene**   | Repository history checked for exposed credentials |
| **Input Validation**     | Pydantic URI validation                            |
| **Null Byte Protection** | `\x00` sanitization                                |
| **URL Length Limit**     | Maximum 2048 characters                            |
| **Protocol Protection**  | Blocks dangerous URI schemes                       |
| **Rate Limiting**        | Sliding-window IP limiter                          |
| **Security Headers**     | CSP, HSTS, X-Frame-Options, X-Content-Type-Options |
| **CORS**                 | Explicit origin allowlist                          |
| **Error Handling**       | Generic production responses                       |
| **API Documentation**    | Disabled in production when required               |
| **Privacy**              | SHA-256 based scan identifiers                     |
| **Client Security**      | No third-party API secrets stored in clients       |
| **API Gateway**          | Centralized backend security layer                 |

---

# 🏗️ Security Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                  │
│                                                         │
│       React Web App       React Native / Expo           │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    QRSHIELD API                         │
│                    FastAPI Backend                      │
│                                                         │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ Rate Limiter │  │ Input         │  │ Security    │ │
│  │              │  │ Validation    │  │ Middleware  │ │
│  └──────────────┘  └───────────────┘  └─────────────┘ │
│                                                         │
│              ┌───────────────────────┐                  │
│              │      Risk Engine      │                  │
│              └───────────┬───────────┘                  │
└──────────────────────────┼──────────────────────────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       VirusTotal    Google Web Risk   AI Engine
```

---

# 🔑 API Security Model

Third-party API credentials are **never exposed to the mobile or web clients**.

```text
Client
  │
  │ HTTPS
  ▼
QRShield API
  │
  ├──► VirusTotal
  │
  ├──► Google Safe Browsing / Web Risk
  │
  └──► AI Analysis Service
```

This provides centralized control over:

* Authentication
* Input validation
* Rate limiting
* Security policies
* Threat analysis
* API orchestration
* Secret management

---

# 🔒 Privacy Model

QRShield follows a privacy-oriented architecture.

### Principles

* No unnecessary permanent storage of scanned URLs
* Privacy-preserving SHA-256 identifiers
* API credentials remain server-side
* Clients do not directly access threat-intelligence services
* Scan information can be minimized after analysis
* Security telemetry is processed only when required

---

# ⚙️ Technology Stack

### Frontend

```text
React
React Native
Expo
Expo Camera
```

### Backend

```text
Python
FastAPI
Pydantic
Uvicorn
```

### Security Intelligence

```text
VirusTotal API v3
Google Safe Browsing / Web Risk
AI-based URL analysis
Custom deterministic rule engine
```

### Security

```text
HTTPS
CORS
CSP
HSTS
Rate Limiting
Input Validation
Environment Variables
SHA-256
OWASP Security Practices
```

---

# 📁 Project Structure

```text
QR-VORTEX/
│
├── apps/
│   ├── mobile/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   ├── assets/
│   │   └── package.json
│   │
│   └── web/
│       ├── src/
│       ├── components/
│       ├── services/
│       └── package.json
│
├── services/
│   └── api/
│       ├── main.py
│       ├── requirements.txt
│       ├── .env.example
│       └── ...
│
├── .gitignore
├── README.md
└── package.json
```

---

# 🚀 Quick Start

## Prerequisites

Install:

* Python 3.10+
* Node.js
* npm
* Git
* Expo tooling

---

## 🐍 Start the FastAPI Backend

```bash
cd services/api
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it:

### macOS / Linux

```bash
source venv/bin/activate
```

### Windows

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file:

```bash
cp .env.example .env
```

Configure your API credentials in `.env`.

Start the server:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend:

```text
http://localhost:8000
```

---

# 📱 Run the Mobile Application

```bash
cd apps/mobile
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start -c
```

Supported development targets:

```text
Android Emulator
iOS Simulator
Expo Go
Physical Device
```

---

# 🌐 Run the Web Application

```bash
cd apps/web
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

---

# 🔧 Environment Configuration

Create the environment file:

```bash
cp .env.example .env
```

Example:

```env
ENVIRONMENT=development

VIRUSTOTAL_API_KEY=your_api_key_here
GOOGLE_SAFE_BROWSING_API_KEY=your_api_key_here

AI_API_KEY=your_api_key_here

ALLOWED_ORIGINS=http://localhost:3000
```

> ⚠️ **Never commit `.env` or real API credentials to GitHub.**

Commit:

```text
.env.example
```

Do not commit:

```text
.env
```

---

# 🔄 Example Scan Flow

```text
User scans QR code
        │
        ▼
QR payload extracted
        │
        ▼
URL normalization
        │
        ▼
Protocol validation
        │
        ▼
Threat intelligence lookup
        │
        ▼
AI heuristic analysis
        │
        ▼
Deterministic security rules
        │
        ▼
Composite risk score
        │
        ├───────────────┬────────────────┐
        ▼               ▼                ▼
      0–20            21–60            61–100
      SAFE           WARNING           BLOCKED
        │               │                │
        ▼               ▼                ▼
     Allow          Confirm          Prevent
```

---

# 📋 Example Security Analysis

```text
QRShield Security Analysis
──────────────────────────────

Risk Score: 78 / 100

Verdict: BLOCKED

Detected Indicators:

✓ Suspicious domain similarity
✓ Credential-harvesting pattern
✓ High URL entropy
✓ Suspicious redirect
✓ Threat intelligence match

Action:

🚫 Navigation blocked
```

---

# 🧠 Defense-in-Depth Approach

QRShield does not depend on a single detection mechanism.

```text
Threat Intelligence
        +
AI Heuristics
        +
Deterministic Rules
        +
Input Validation
        +
Secure API Architecture
        +
Privacy Controls
        =
Multi-Layer QR Security
```

This approach allows QRShield to combine known threat intelligence with structural and behavioral indicators.

---

# 🗺️ Roadmap

* [ ] Browser extension for QR destination interception
* [ ] Android system-level QR protection
* [ ] iOS Share Sheet URL analysis
* [ ] Real-time domain reputation monitoring
* [ ] Machine-learning URL classification
* [ ] Federated threat intelligence
* [ ] Enterprise security dashboard
* [ ] Security event analytics
* [ ] Organization-level threat policies
* [ ] Offline QR risk analysis
* [ ] SIEM integration
* [ ] Automated incident reporting
* [ ] Threat intelligence feed aggregation

---

# ⚠️ Security Disclaimer

QRShield is a defensive cybersecurity platform intended to assist users in identifying potentially malicious QR destinations.

A **SAFE** classification does not guarantee that a destination is completely harmless, while a **MALICIOUS** classification represents a security warning based on the signals available to the system at scan time.

Users should avoid entering credentials, payment information, or sensitive data into unfamiliar websites even when a QR destination receives a low risk score.

---

# 🎯 Project Goal

> **Scan. Analyze. Understand. Protect.**

QRShield places a security inspection layer **between the QR scan and the destination**, helping protect users from QR phishing, malicious redirects, credential harvesting, and other QR-based threats.

---

## ⭐ QRShield

**Real-time QR security. Multi-layer detection. Proactive protection.**
