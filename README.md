# 🛡️ QRShield

### AI-Powered QR Phishing Detection & Prevention Platform

> **Scan. Analyze. Detect. Protect.**

QRShield is a cybersecurity platform designed to detect and prevent malicious QR-code-based attacks, including **Quishing (QR phishing)**, malicious redirects, credential harvesting, impersonation domains, suspicious payment links, and other URL-based threats.

Instead of blindly opening a QR destination, QRShield follows a **Scan → Decode → Analyze → Score → Decide → Protect** security pipeline.

---

## 🚀 Overview

QR codes are increasingly used for payments, authentication, websites, promotions, Wi-Fi access, and digital services.

Attackers can abuse the same technology by replacing legitimate QR codes with malicious ones that redirect users to:

- Phishing websites
- Fake login pages
- Credential harvesting portals
- Fake payment pages
- Malware distribution sites
- Look-alike domains
- URL shorteners hiding malicious destinations
- Redirect chains
- Impersonated brands
- Social engineering pages

QRShield introduces a security layer between the QR code and the destination.

### Core Security Principle

```text
UNKNOWN ≠ SAFE   

```
A destination is not considered safe simply because no malicious evidence was found.




⚙️ Core Features
📷 QR Scanner
* Camera-based QR scanning
* QR payload extraction
* URL detection
* Non-URL payload detection
* Safe scanning workflow
* No automatic navigation before analysis

🔎 URL Security Analysis
QRShield analyzes multiple URL characteristics:
* URL structure
* Protocol
* Domain
* Subdomain
* TLD
* URL length
* Query parameters
* Suspicious keywords
* IP-based URLs
* URL encoding
* Punycode
* Unicode characters
* Suspicious ports
* URL shorteners
* Credential-related paths
* Payment-related paths

🌐 Domain Intelligence
QRShield can evaluate:
* Domain reputation
* Domain age
* Registration information
* DNS characteristics
* SSL/TLS information
* IP reputation
* Brand impersonation
* Look-alike domains
* Suspicious TLDs
* Homograph attacks

🔀 Redirect Analysis

QRShield can inspect redirect behavior before allowing navigation.

Example:
QR
 ↓
short-url.com
 ↓
redirect-domain.com
 ↓
fake-login.example
 ↓
malicious destination

🧬 Threat Intelligence
QRShield can integrate multiple security intelligence providers.
Supported/planned providers include:
* Google Safe Browsing
* VirusTotal
* Cloudflare URL Scanner
* Domain/DNS intelligence
* Internal threat database
* Custom security feeds
Threat intelligence is treated as one signal within the overall decision engine.

🧮 Risk Scoring Engine
QRShield uses a weighted security scoring model.
Example signals:
Indicator	Score
Known malicious URL	+60
Known phishing URL	+55
Known malware	+60
Look-alike domain	+20
Credential harvesting indicators	+20
Punycode / homograph	+15
IP-based URL	+15
Suspicious redirect	+15
Suspicious payment/login terms	+10
URL shortener	+8
Suspicious TLD	+8
Excessive URL length	+5
Excessive subdomains	+5
HTTP instead of HTTPS	+5
Suspicious port	+5

Final score:

0 ─────────────────────────────── 100
│        │         │        │       │
SAFE   LOW RISK  SUSPICIOUS HIGH   MALICIOUS
Classification
0 - 20     → SAFE
21 - 40    → LOW_RISK
41 - 60    → SUSPICIOUS
61 - 80    → HIGH_RISK
81 - 100   → MALICIOUS

If there is insufficient evidence or a critical analysis failure:

UNKNOWN

🛑 Security Decision Engine

The final decision is not based solely on an AI model.

QRShield uses deterministic security rules and threat intelligence as the primary decision layer.

SAFE
 ↓
ALLOW

LOW_RISK
 ↓
ALLOW_WITH_NOTICE

SUSPICIOUS
 ↓
WARN

HIGH_RISK
 ↓
BLOCK

MALICIOUS
 ↓
BLOCK

UNKNOWN
 ↓
WARN / RESTRICT

🤖 AI Security Analyst
AI is used as an explanation layer, not as the sole security authority.
The AI Security Analyst can explain:
* Why the URL was flagged
* Which indicators were detected
* What makes the domain suspicious
* Whether impersonation indicators exist
* Why a redirect is risky
* What the user should do

Example:

Risk Level: HIGH RISK

Risk Score: 74/100

Reasons:
• Domain resembles a known brand
• Login page detected
• Multiple redirects detected
• Domain reputation is uncertain
• URL contains credential-related parameters

Recommendation:
Do not enter credentials or payment information.
📱 Mobile Application

QRShield is designed for Android and iOS.

Planned application flow

Splash
   ↓
Onboarding
   ↓
Home Dashboard
   ↓
QR Scanner
   ↓
Security Analysis
   ↓
Risk Result
   ↓
┌───────────────┬────────────────┐
│ SAFE          │ DANGEROUS      │
│               │                │
│ Continue      │ Warn / Block   │
│ Open URL      │ User Protected │
└───────────────┴────────────────┘

Mobile Screens
* Splash Screen
* Onboarding
* Home Dashboard
* QR Scanner
* Scan Processing
* Security Result
* Detailed Scan Report
* Scan History
* Threat Intelligence
* Security Education
* Notifications
* Profile
* Settings

🎨 UI / UX
QRShield follows a premium cybersecurity visual language.
Design Direction
* Professional
* Minimal
* Royal color palette
* Glassmorphism
* Neumorphism
* Dark and light themes
* Security-focused visual hierarchy
* Subtle animations
* Clear risk indicators
Security Status

SAFE
LOW RISK
SUSPICIOUS
HIGH RISK
MALICIOUS
UNKNOWN

The UI should clearly distinguish between these states without relying only on color.

🌐 Web Dashboard
The web interface provides a security intelligence dashboard.
Dashboard Components
* Total scans
* Safe scans
* Suspicious scans
* Blocked threats
* Risk distribution
* Recent scans
* Threat statistics
* Detection trends
* Domain intelligence
* Threat reports
* System status

🖥️ CLI
A command-line interface can be used for security testing and automation.
Example:

qrshield scan "https://example.com"

Example output:

QRShield Security Analysis

URL        : https://example.com
Domain     : example.com
Risk Score : 12/100
Risk Level : SAFE
Decision   : ALLOW

Threat Intelligence:
✓ No known malicious indicators

Domain Analysis:
✓ Valid HTTPS
✓ No obvious impersonation
✓ No suspicious redirect

Recommendation:
Safe to continue with normal caution.


🔌 API
Health Check

GET /health


Scan QR Payload

POST /api/v1/scan

Example:

{
  "payload": "https://example.com",
  "source": "mobile"
}

Response:

{
  "scan_id": "qr_123456",
  "risk_score": 12,
  "classification": "SAFE",
  "decision": "ALLOW",
  "confidence": 0.94,
  "reasons": [],
  "redirect_allowed": true
}


Scan History

GET /api/v1/scans


Scan Details

GET /api/v1/scans/{scan_id}


Statistics

GET /api/v1/stats


Threat Intelligence

GET /api/v1/threat-intelligence/{domain}


🔄 n8n Automation
n8n acts as the workflow orchestration layer.
Main Workflow

Webhook
   ↓
Validate Input
   ↓
Detect Payload Type
   ↓
Extract URL
   ↓
Normalize URL
   ↓
Generate URL Hash
   ↓
Rate Limit
   ↓
Cache Lookup
   ↓
Local URL Analyzer
   ↓
Domain Analyzer
   ↓
Threat Intelligence
   ↓
Redirect Analysis
   ↓
Aggregate Signals
   ↓
Risk Engine
   ↓
Security Override
   ↓
Classification
   ↓
AI Explanation
   ↓
Final Decision
   ↓
Database
   ↓
Statistics
   ↓
Alerts
   ↓
API Response


🧰 Technology Stack
Frontend
* React
* React Native
* Expo
* TypeScript
* JavaScript
* React Navigation
* Tailwind CSS
Web
* Next.js
* React
* Tailwind CSS
* Three.js
* React Three Fiber
* Framer Motion / GSAP
Backend
* Python
* FastAPI
* Pydantic
* REST API
Security Engine
* Python
* URL parsing
* Domain analysis
* Hashing
* Risk scoring
* Threat intelligence
* Security rules
Automation
* n8n
Database
* PostgreSQL
* Redis
Development
* VS Code
* Git
* GitHub
* Docker
* Postman
Design
* Figma
* Notion

📁 Project Structure

QRShield/
│
├── apps/
│   ├── mobile/
│   ├── web/
│   └── cli/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── security/
│   │   └── main.py
│   │
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── security/
│   ├── url_analyzer/
│   ├── domain_analyzer/
│   ├── redirect_analyzer/
│   ├── threat_intelligence/
│   ├── risk_engine/
│   └── classifiers/
│
├── n8n/
│   ├── workflows/
│   └── README.md
│
├── database/
│   ├── migrations/
│   └── schemas/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── security/
│   └── deployment/
│
├── tests/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── LICENSE
└── README.md


⚡ Installation
1. Clone Repository

git clone https://github.com/YOUR_USERNAME/QRShield.git
cd QRShield


2. Install Dependencies
Frontend

npm install

or

bun install


3. Backend Setup

cd backend

Create virtual environment:

python3 -m venv venv

Activate:
macOS / Linux

source venv/bin/activate

Windows

venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt


4. Start FastAPI

uvicorn app.main:app --reload

API:

http://localhost:8000

Swagger:

http://localhost:8000/docs


5. Start Frontend

npm run dev


6. Mobile Development
Install Expo:

npx expo start

Then run using:

Android Emulator
iOS Simulator
Expo Go


🔑 Environment Variables
Create:

.env

Example:

NODE_ENV=development

API_URL=http://localhost:8000

DATABASE_URL=
REDIS_URL=

VIRUSTOTAL_API_KEY=
GOOGLE_SAFE_BROWSING_API_KEY=

CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=

OPENAI_API_KEY=

SAFE_THRESHOLD=20
LOW_RISK_THRESHOLD=40
SUSPICIOUS_THRESHOLD=60
HIGH_RISK_THRESHOLD=80

RATE_LIMIT=

Important
Never commit API keys.
Add .env to:

.gitignore

Use:

.env.example

for documentation.

🧪 Testing
QRShield should be tested against:
Safe URLs

https://google.com
https://github.com
https://microsoft.com

Suspicious URLs
Test:
* URL shorteners
* Long URLs
* Suspicious TLDs
* IP-based URLs
* Unicode domains
* Punycode domains
* Excessive subdomains
* Credential-related URLs
Malicious Test Data
Use authorized security-testing datasets and sandbox environments.
Never test malicious URLs against systems you do not own or have permission to test.

🔒 Security Principles
QRShield follows these principles:
1. Analyze Before Navigate
Never automatically open an unknown QR destination.
2. Least Trust
Treat external QR payloads as untrusted input.
3. Unknown Is Not Safe
Insufficient intelligence must not automatically result in an ALLOW decision.
4. Defense in Depth
Use multiple independent security signals.
5. Deterministic Security Decisions
AI should not be the sole authority for blocking or allowing destinations.
6. Secure Secrets
API keys must remain server-side.
7. Fail Safely
Security-service failures should not silently bypass protection.
8. Explainable Results
Users should understand why a destination was blocked or warned.

🛡️ Threat Detection Categories
QRShield targets:
* Quishing
* Phishing
* Credential harvesting
* Brand impersonation
* Typosquatting
* Homograph attacks
* Malicious redirects
* Suspicious URL shorteners
* Fake payment pages
* Fake authentication pages
* Malware distribution links
* Suspicious domains
* Malicious URLs
* Social engineering destinations

📊 Example Security Report

╔══════════════════════════════════════════════╗
║              QRSHIELD REPORT                 ║
╠══════════════════════════════════════════════╣
║ Risk Score       : 78/100                    ║
║ Classification   : HIGH_RISK                 ║
║ Decision         : BLOCK                     ║
╠══════════════════════════════════════════════╣
║ DETECTIONS                                    ║
║                                              ║
║ ⚠ Look-alike domain                          ║
║ ⚠ Suspicious redirect chain                  ║
║ ⚠ Credential harvesting indicators           ║
║ ⚠ Domain reputation unavailable              ║
╠══════════════════════════════════════════════╣
║ RECOMMENDATION                               ║
║                                              ║
║ Do not continue to this destination.         ║
║ Do not enter passwords or payment details.   ║
╚══════════════════════════════════════════════╝


📈 Future Roadmap
Phase 1 — Foundation
* Project architecture
* QRShield concept
* Security pipeline
* Repository setup
* Backend foundation
* QR decoder
Phase 2 — Detection
* URL analyzer
* Domain analyzer
* Risk engine
* Threat intelligence
* Redirect analyzer
Phase 3 — Mobile
* Android application
* iOS application
* QR scanner
* Security results
* Scan history
* Notifications
Phase 4 — Intelligence
* Threat intelligence aggregation
* Advanced domain similarity
* Brand impersonation detection
* Behavioral analysis
* AI security explanations
Phase 5 — Platform
* Web dashboard
* CLI
* Security analytics
* Admin dashboard
* API authentication
* Enterprise integrations
Phase 6 — Advanced Protection
* Browser extension
* Real-time URL protection
* Enterprise API
* Threat feed ingestion
* Security research dashboard
* Automated incident reporting

📜 API Provider Notes
QRShield can integrate external security intelligence services.
Provider availability, quotas, rate limits, licensing, and commercial-use restrictions must be reviewed against the provider's current terms before production deployment.
Do not use leaked, shared, or unauthorized API credentials.

⚠️ Disclaimer
QRShield is a security-assistance and threat-analysis platform.
No automated detection system can guarantee detection of every malicious QR code, URL, domain, phishing campaign, or zero-day attack.
QRShield should be treated as a defense-in-depth security layer and not as a replacement for security awareness, endpoint protection, browser security, or enterprise security controls.

🤝 Contributing
Contributions are welcome.

git checkout -b feature/your-feature

Make your changes, test them, and create a pull request.
Contribution Areas
* Detection algorithms
* URL analysis
* Domain intelligence
* Threat intelligence integrations
* Mobile development
* Web development
* UI/UX
* Security research
* Documentation
* Testing

🧑‍💻 Development Workflow

Issue
  ↓
Research
  ↓
Design
  ↓
Implementation
  ↓
Security Review
  ↓
Testing
  ↓
Pull Request
  ↓
Review
  ↓
Merge
  ↓
Deployment


🏗️ Engineering Philosophy
QRShield is built around a simple principle:
Do not trust the QR code. Verify the destination.
The platform should prioritize:

Security
   ↓
Reliability
   ↓
Explainability
   ↓
Performance
   ↓
User Experience


📄 License
This project is licensed under the MIT License.
See:

LICENSE

for details.

👨‍💻 Author
Manyu Gaddam
Cybersecurity • AI • FinTech • Software Engineering

⭐ QRShield
Scan less blindly. Verify more intelligently.

SCAN
  ↓
DECODE
  ↓
ANALYZE
  ↓
INTELLIGENCE
  ↓
RISK SCORE
  ↓
DECISION
  ↓
PROTECT

QRShield — Security before navigation.
