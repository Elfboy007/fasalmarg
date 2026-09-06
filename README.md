# Fasalmarg: Unified Credit-to-Market Platform for Farmers

Fasalmarg bridges two systemic vulnerabilities faced by Indian smallholder farmers:
1. **Market Access & Transparency Problem:** Inability to find verified institutional buyers, lack of clear price discovery, fragmented quantities, and asymmetric bargaining power.
2. **Predatory Debt & Distress Selling:** Urgent liquidity pressure (seeds, fertilizer, health emergency) forces farmers to take informal moneylender loans at 36%–60% APR in exchange for selling their crops at deeply depressed prices.

Fasalmarg solves both challenges simultaneously through a unified digital architecture.

---

## Key Modules & Features

### 1. Dynamic Supply Aggregation & Smart Marketplace
- **Multi-Smallholder Pooling Solver:** Combines smallholder outputs (e.g. Farmer A: 10q, Farmer B: 15q, Farmer C: 20q, Farmer D: 25q = 70 quintals) into certified corporate truckloads.
- **Fair Price Discovery:** Evaluates APMC mandi modal prices, quality grade premiums, logistics savings, and corporate buyer bid depth.
- **End-to-End 8-Stage Transaction Pipeline:**
  `AI Matching` → `Digital Bid Lock` → `Mobile Spectrometry Assay` → `Escrow Funding` → `Pooled Logistics` → `Digital Weighbridge` → `Escrow Settlement` → `Reputation Ledger`.

### 2. Pre-Harvest Bridge Credit & Anti-Distress Financing
- **Crop Valuation as Collateral:** Calculates future crop worth (e.g. 80 Quintals Wheat @ ₹2,500 = ₹2,00,000 crop valuation).
- **Subsidized Formal Credit Discovery:** Connects farmers to 4% Kisan Credit Card (KCC) bridge facilities from regulated banks (SBI, NABARD, PNB).
- **Escrow-Linked Auto Repayment:** Corporate buyer pays ₹2,03,200 into escrow upon harvest delivery. The platform automatically settles the ₹50,500 bank loan + interest, and deposits the remaining ₹1,52,700 directly into the farmer's bank account—eliminating loan default risk and middleman harassment.

### 3. AI Distress-Selling Risk Detection Engine
- Calculates a multi-signal **Distress Risk Score (0 - 100)** based on:
  - Financial Urgency Ratio (Urgent cash needed vs total crop value)
  - Time Pressure (Days remaining until harvest pickup)
  - Market Certainty (Uncommitted inventory ratio)
  - Local Mandi Price Trajectory (Downward trend vs stability)
  - Existing Informal Debt Burden
- **Preventive Alert System:** Flags high-risk farmers 3 weeks prior to harvest and automatically triggers formal bridge credit and forward contracts before middlemen exploit distress.

### 4. Government Market Intelligence & Policy Surveillance
- Macro dashboard for agricultural ministries and state bodies.
- District-level vulnerability heatmaps (monitoring districts like Sehore, Mansa, Solapur, Alwar).
- Real-time Mandi Price vs MSP Baseline surveillance with early warning triggers.

---

## How to Run Locally

Fasalmarg runs with zero external package dependencies using Python's built-in web server:

```powershell
# Navigate to the project directory
cd "C:\Users\HP\.gemini\antigravity-ide\scratch\fasalmarg"

# Start Python HTTP Server
python -m http.server 8080
```

Open your browser and navigate to:
```
http://localhost:8080
```

---

## Build & Deployment (Vercel / Netlify / Cloudflare)

Fasalmarg includes an automated packaging pipeline that minifies CSS, bundles JavaScript, and outputs ready-to-deploy static files:

```bash
# Build production bundle into public/ (default for Vercel):
python build.py --output public

# Or run via npm:
npm run build
```

- **Vercel**: Preconfigured with `vercel.json`. Set Output Directory to `public` (or leave default).
- **Netlify**: Set Publish Directory to `public` (or `dist`).
- **Local Preview**: Run `npm run serve:public` to test the minified bundle.

---

## Project Structure

```
fasalmarg/
├── assets/
│   ├── hero-banner.jpg       # High-resolution photorealistic visual banner
│   └── logo.jpg              # Fasalmarg brand emblem
├── css/
│   ├── design-system.css     # HSL color tokens, typography, glassmorphism, responsive grid
│   └── components.css        # Persona switcher, gauge, sliders, tables, timeline tracker, modals
├── js/
│   ├── data.js               # Indian APMC mandi prices, MSP baselines, farmers, buyers, schemes
│   ├── distress-ai.js        # AI distress-selling risk scoring engine & SVG gauge renderer
│   ├── marketplace.js        # Smallholder aggregation solver & 8-stage transaction pipeline
│   ├── finance.js            # Pre-harvest crop valuation, LTV calculator & credit schemes
│   ├── gov-dashboard.js      # Government policy surveillance, heatmaps & MSP intervention
│   └── app.js                # App orchestrator, persona navigation, theme toggler, toasts
├── index.html                # Semantic single-page application
└── README.md                 # System documentation
```
