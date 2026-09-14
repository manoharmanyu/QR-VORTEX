# QRShield – QR Phishing Detection & Prevention Platform

> A cybersecurity platform that analyzes QR-code destinations, detects phishing and malicious indicators, calculates risk, and warns or blocks users before they access potentially dangerous websites.

## Overview

QRShield is a cybersecurity-focused QR code security platform designed to protect users from **QR-based phishing attacks, commonly known as Quishing**.

QR codes can redirect users to phishing websites, fraudulent payment pages, fake login portals, malicious downloads, and other unsafe destinations. QRShield adds a security layer between scanning a QR code and accessing its destination.

Instead of immediately opening the decoded URL, QRShield analyzes it first and provides a security decision:

```text
SCAN QR
   ↓
DECODE QR
   ↓
EXTRACT DESTINATION
   ↓
ANALYZE URL
   ↓
CHECK THREAT INTELLIGENCE
   ↓
CALCULATE RISK
   ↓
SAFE / WARNING / BLOCK
   ↓
OPEN OR TERMINATE

QRShield is designed for Android, iOS, Web, and CLI applications, with n8n used for workflow automation and external threat-intelligence services used for security analysis.

Features
📷 QR Scanner

Scan QR codes using a device camera or upload a QR-code image.

QRShield extracts the QR payload without automatically opening the destination.

🛡️ QR Phishing Detection

Detect potential:

Phishing URLs
Suspicious domains
Look-alike domains
IP-based URLs
Punycode / homograph indicators
Suspicious redirects
Credential-harvesting indicators
Fraudulent payment destinations
Suspicious URL structures
Malicious reputation
Malware indicators
🔍 URL Security Analysis

Analyze the destination before allowing access.

Checks include:

HTTPS
Domain
IP address
URL length
Subdomains
Ports
URL parameters
Encoding
Suspicious keywords
Domain similarity
Redirect behavior
🌐 Threat Intelligence

QRShield supports integrations with security intelligence providers such as:

Google Safe Browsing
VirusTotal
Cloudflare URL Scanner

These services provide additional reputation and threat signals.

📊 Risk Scoring

Each analyzed destination receives a risk score from:

0 – 100

Default classification:

Risk Score	Classification	Action
0–20	SAFE	ALLOW
21–40	LOW RISK	ALLOW WITH NOTICE
41–60	SUSPICIOUS	WARN
61–80	HIGH RISK	BLOCK
81–100	MALICIOUS	BLOCK
—	UNKNOWN	WARN

UNKNOWN is never automatically treated as SAFE.

🚨 Threat Prevention

If a destination is considered dangerous, QRShield warns the user before access.

Example:

⚠ THREAT DETECTED

Risk Score: 87/100

HIGH RISK

Reasons:
• Suspicious domain
• Phishing indicator
• Redirect detected

ACTION: BLOCK
🔐 Safe Redirection

If the destination passes the configured security checks, QRShield can allow the user to continue to the intended website or application.

SCAN
 ↓
ANALYZE
 ↓
SAFE
 ↓
OPEN DESTINATION

For dangerous destinations:

SCAN
 ↓
ANALYZE
 ↓
MALICIOUS
 ↓
BLOCK / TERMINATE
🤖 AI Security Explanation

An optional AI layer explains why a QR destination was classified as safe, suspicious, or dangerous.

The AI is not the final security authority.

The deterministic security engine and threat-intelligence results control the final security decision.

Architecture
                    QRShield Mobile / Web App
                              │
                              ▼
                         QR Scanner
                              │
                              ▼
                        QR Decoder
                              │
                              ▼
                     Payload Extraction
                              │
                              ▼
                       QRShield API
                              │
                              ▼
                             n8n
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        URL Analysis     Domain Analysis   Threat Intel
             │                │                │
             │          ┌─────┴─────┐          │
             │          ▼           ▼          │
             │     VirusTotal   Cloudflare    │
             │                              Google
             │                         Safe Browsing
             │                │
             └────────────────┼────────────────┘
                              ▼
                       Signal Aggregation
                              │
                              ▼
                        Risk Engine
                              │
                              ▼
                     Security Decision
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
              SAFE          WARN          BLOCK
                │             │             │
                └─────────────┼─────────────┘
                              ▼
                         API Response
                              │
                              ▼
                     Android / iOS / Web
Quick Start
Prerequisites

Install:

Node.js LTS
Bun
Git
VS Code
Modern web browser

For the complete backend:

Python 3.11+
PostgreSQL
Redis
n8n
Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_QRSHIELD_REPOSITORY.git
cd YOUR_QRSHIELD_REPOSITORY
2. Install dependencies

Using Bun:

bun install

Or using npm:

npm install
3. Start the development server

Using Bun:

bun run dev

Or:

npm run dev

Open the local URL displayed in your terminal, usually:

http://localhost:3000
Environment Variables

Create a .env file in the project root:

NODE_ENV=development

# Backend
API_URL=

# Database
DATABASE_URL=

# Redis
REDIS_URL=

# Threat Intelligence
VIRUSTOTAL_API_KEY=
GOOGLE_SAFE_BROWSING_API_KEY=
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ACCOUNT_ID=

# Optional AI
OPENAI_API_KEY=

# Risk Engine
SAFE_THRESHOLD=20
LOW_RISK_THRESHOLD=40
SUSPICIOUS_THRESHOLD=60
HIGH_RISK_THRESHOLD=80

# Rate Limiting
RATE_LIMIT=
Security

Never commit .env or API keys to GitHub.

Add the following to .gitignore:

.env
.env.local
.env.production
node_modules/
.venv/
n8n Workflow

QRShield uses n8n to orchestrate the security-analysis pipeline.

Recommended workflow:

Webhook
   ↓
Validate Input
   ↓
Detect Payload
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
Save Result
   ↓
Alert
   ↓
Return Response

Main endpoint:

POST /qrshield/scan

Example request:

{
  "payload": "https://example.com",
  "source": "mobile"
}

Example response:

{
  "success": true,
  "scan_id": "QR-A81F92C4",
  "classification": "HIGH_RISK",
  "risk_score": 78,
  "action": "BLOCK",
  "signals": [
    "Suspicious domain",
    "Credential harvesting indicator"
  ]
}
Backend

If the backend is included:

cd backend

Create a Python virtual environment:

python -m venv .venv

Activate it on macOS/Linux:

source .venv/bin/activate

Install dependencies:

pip install -r requirements.txt

Run FastAPI:

uvicorn main:app --reload

The backend will normally run at:

http://localhost:8000
Mobile Application

QRShield is designed using React Native + Expo for Android and iOS.

cd apps/mobile

Install dependencies:

bun install

Start the application:

bun run start

The application can be tested using:

Android Emulator
iOS Simulator
Expo Go
Physical Android device
Physical iPhone
Mobile Security Flow
HOME
  ↓
SCAN QR
  ↓
QR DETECTED
  ↓
ANALYZING
  ↓
SECURITY RESULT
Safe
✓ SAFE

Risk: 08/100

Destination verified.

[ OPEN WEBSITE ]
Suspicious
⚠ WARNING

Risk: 54/100

Suspicious indicators detected.

[ REVIEW ] [ GO BACK ]
Malicious
⛔ BLOCKED

Risk: 94/100

Malicious destination detected.

[ TERMINATE ]
Project Structure
QRShield/
│
├── apps/
│   ├── mobile/
│   │   ├── android/
│   │   ├── ios/
│   │   └── src/
│   │
│   └── web/
│       └── src/
│
├── backend/
│   ├── app/
│   ├── api/
│   ├── models/
│   └── services/
│
├── security-engine/
│   ├── analyzers/
│   ├── risk_engine/
│   ├── threat_intelligence/
│   └── tests/
│
├── n8n/
│   ├── workflows/
│   └── README.md
│
├── database/
│   ├── migrations/
│   └── schema.sql
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── mobile/
│   └── security/
│
├── tests/
│
├── .env.example
├── .gitignore
├── LICENSE
└── README.md
Technology Stack
Frontend
React
Next.js
TypeScript
Tailwind CSS
Mobile
React Native
Expo
React Navigation
Expo Camera
TypeScript
Backend
Python
FastAPI
Pydantic
Security Engine
URL parsing
Domain analysis
Domain similarity detection
SHA-256 hashing
Risk-based classification
Threat intelligence
Automation
n8n
Database
PostgreSQL
Cache
Redis
Threat Intelligence APIs
Google Safe Browsing API
VirusTotal API
Cloudflare URL Scanner API
AI
OpenAI API / Anthropic API
Development Tools
Git
GitHub
VS Code
Postman
Docker
API Endpoints
Method	Endpoint	Description
POST	/qrshield/scan	Analyze QR payload
GET	/qrshield/scan/:id	Retrieve scan result
GET	/qrshield/stats	Security statistics
GET	/qrshield/health	System health
Security Analysis

QRShield analyzes a destination using multiple layers:

Layer 1 → QR Payload Validation
Layer 2 → URL Analysis
Layer 3 → Domain Analysis
Layer 4 → Threat Intelligence
Layer 5 → Redirect Analysis
Layer 6 → Risk Engine
Layer 7 → Security Decision
Layer 8 → User Warning / Blocking

The system should never automatically open an unknown URL before analysis.

Example Analysis

Input:

{
  "payload": "https://example.com"
}

QRShield performs:

✓ Decode QR
✓ Extract URL
✓ Normalize URL
✓ Analyze URL structure
✓ Analyze domain
✓ Check reputation
✓ Check redirects
✓ Calculate risk
✓ Generate classification

Example result:

Risk Score: 87/100

Classification: HIGH RISK

Action: BLOCK

Indicators:
• Look-alike domain
• Credential harvesting indicator
• Suspicious redirect
Testing

Run:

bun test

or:

npm test

Test cases should include:

Safe HTTPS URL
HTTP URL
IP-based URL
Long URL
Suspicious URL
Look-alike domain
Punycode domain
URL shortener
Unknown domain
Invalid payload
Empty payload
API timeout
API failure
Cache hit
Cache miss
Confirmed malicious test indicator

Use only authorized and benign security-testing indicators.

Do not download or execute real malware.

Development

Create a feature branch:

git checkout -b feature/qr-scanner

Make your changes:

git add .
git commit -m "Add QR scanner"

Push:

git push origin feature/qr-scanner

Then create a Pull Request.

Roadmap
 QRShield concept
 QR phishing detection architecture
 URL risk analysis
 Risk classification
 Threat intelligence architecture
 Android application
 iOS application
 Real-time QR camera scanning
 n8n production workflow
 PostgreSQL scan history
 Redis caching
 Browser extension
 CLI scanner
 Machine-learning threat detection
 Advanced domain impersonation detection
 Security analytics dashboard
 Offline analysis
 Enterprise API
 Production deployment
Contributing

Contributions are welcome.

Fork the repository.
Create a feature branch.
Make your changes.
Test your changes.
Commit your changes.
Push the branch.
Open a Pull Request.

Example:

git checkout -b feature/new-security-check
git add .
git commit -m "Add new security check"
git push origin feature/new-security-check

Please include testing details and any security implications in your Pull Request.

License

This project is licensed under the MIT License.

See the LICENSE file for details.

Security & Privacy

QRShield follows a security-first and data-minimization approach.

The project aims to:

Avoid unnecessary storage of complete URLs.
Hash URLs where appropriate.
Avoid storing passwords or authentication tokens.
Protect API credentials.
Keep secrets on backend infrastructure.
Avoid exposing credentials to mobile clients.
Avoid automatically opening untrusted URLs.
Fail securely when threat-intelligence providers are unavailable.
Disclaimer

QRShield is a cybersecurity research and educational project.

No security system can guarantee detection of every phishing campaign, malware payload, malicious QR code, or zero-day attack.

The risk score is a risk-based assessment and should not be interpreted as absolute proof that a destination is safe or malicious.

Users should continue to exercise caution when interacting with unknown QR codes and websites.

Author

Manyu

GitHub: @manoharmanyu

QRShield Philosophy
        DON'T TRUST THE QR
                 ↓
            DECODE FIRST
                 ↓
          ANALYZE SAFELY
                 ↓
       VERIFY THE DESTINATION
                 ↓
           CALCULATE RISK
                 ↓
       ┌─────────┼─────────┐
       ↓         ↓         ↓
     SAFE      WARN      BLOCK
       ↓         ↓         ↓
     OPEN      REVIEW   TERMINATE
QRShield

SCAN → ANALYZE → VERIFY → SCORE → PROTECT
