# CyberShield SOC - Enterprise Cybersecurity Operations & Threat Intelligence

A modern, high-tech Security Operations Center (SOC) platform featuring:
- **Global Threat Monitor**: Live interactive world threat map with real-time attack arcs, regional sensor bastions, and telemetry.
- **Cyber Threat Intelligence & Anomaly Detection**: Real-time canvas waveform anomaly detection, protocol inspection breakdown, and MITRE ATT&CK threat actor signatures.
- **Incident Dispatch & Mitigation Command**: Open investigation triage with automated SOAR playbooks (Isolate Host, Block ASN, Invalidate Kerberos TGTs).
- **SOC Command Staff Console**: Shift roster, MTTD/MTTR analytics, and compliance frameworks.
- **News Veracity & Correctness Analyzer**: AI-powered fact-checking engine to verify claims, technical feasibility, and disinformation flags in breaking news.
- **SOC Multi-Screen Wall View**: Panoramic multi-display control room layout.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
npm start
```
