/**
 * Fasalmarg Financial Solution & Pre-Harvest Bridge Credit Engine (Pillars 2 & 3)
 * Calculates pre-harvest crop valuation, safe LTV, formal credit discovery, and escrow repayment.
 */

window.FinanceEngine = {
  // Current state of financial simulator
  state: {
    cropYield: 80, // Quintals
    pricePerQtl: 2500, // INR
    urgentNeed: 50000, // INR
    cropType: 'wheat',
    daysToHarvest: 18,
    hasConfirmedBuyer: false
  },

  init: function() {
    this.bindInputs();
    this.recalculate();
    this.renderSchemes();
  },

  bindInputs: function() {
    const yieldInput = document.getElementById('finance-yield-slider');
    const needInput = document.getElementById('finance-need-slider');
    const priceInput = document.getElementById('finance-price-input');
    const daysInput = document.getElementById('finance-days-slider');

    if (yieldInput) {
      yieldInput.addEventListener('input', (e) => {
        this.state.cropYield = parseInt(e.target.value, 10);
        document.getElementById('finance-yield-val').innerText = `${this.state.cropYield} Qtl`;
        this.recalculate();
      });
    }

    if (needInput) {
      needInput.addEventListener('input', (e) => {
        this.state.urgentNeed = parseInt(e.target.value, 10);
        document.getElementById('finance-need-val').innerText = `₹${this.state.urgentNeed.toLocaleString('en-IN')}`;
        this.recalculate();
      });
    }

    if (priceInput) {
      priceInput.addEventListener('input', (e) => {
        this.state.pricePerQtl = parseInt(e.target.value, 10) || 2000;
        this.recalculate();
      });
    }

    if (daysInput) {
      daysInput.addEventListener('input', (e) => {
        this.state.daysToHarvest = parseInt(e.target.value, 10);
        document.getElementById('finance-days-val').innerText = `${this.state.daysToHarvest} Days`;
        this.recalculate();
      });
    }
  },

  recalculate: function() {
    const { cropYield, pricePerQtl, urgentNeed, daysToHarvest, hasConfirmedBuyer } = this.state;
    const totalCropValue = cropYield * pricePerQtl;
    const ltvRatio = Math.round((urgentNeed / Math.max(1, totalCropValue)) * 100);

    // Call Distress AI Engine to compute risk score
    const riskResult = window.DistressAIEngine.computeRiskScore({
      urgentNeed,
      cropYield,
      pricePerQtl,
      daysToHarvest,
      hasConfirmedBuyer,
      priceTrend: -2.0,
      hasInformalDebt: true
    });

    // Update Metric Displays
    const cropValueEl = document.getElementById('sim-total-crop-value');
    if (cropValueEl) cropValueEl.innerText = `₹${totalCropValue.toLocaleString('en-IN')}`;

    const ltvRatioEl = document.getElementById('sim-ltv-ratio');
    if (ltvRatioEl) {
      ltvRatioEl.innerText = `${ltvRatio}% LTV`;
      ltvRatioEl.className = ltvRatio <= 35 ? 'badge badge-emerald' : ltvRatio <= 60 ? 'badge badge-gold' : 'badge badge-risk-critical';
    }

    // Update Comparison Side-by-Side
    // 1. Traditional Middleman Trap
    const middlemanDisasterPrice = Math.round(pricePerQtl * 0.72); // ₹1,800
    const middlemanGrossSales = middlemanDisasterPrice * cropYield; // 80 * 1800 = 1,44,000
    const middlemanInterest = Math.round(urgentNeed * 0.12); // ~₹6,000 for 3 months informal credit
    const middlemanNetInHand = middlemanGrossSales - urgentNeed - middlemanInterest; // 1,44,000 - 50k - 6k = 88,000
    const middlemanTotalLoss = (pricePerQtl - middlemanDisasterPrice) * cropYield + middlemanInterest;

    const trapGrossEl = document.getElementById('trap-gross-sale');
    const trapPriceEl = document.getElementById('trap-crop-price');
    const trapInterestEl = document.getElementById('trap-interest');
    const trapNetEl = document.getElementById('trap-net-in-hand');
    const trapLossEl = document.getElementById('trap-total-loss');

    if (trapGrossEl) trapGrossEl.innerText = `₹${middlemanGrossSales.toLocaleString('en-IN')}`;
    if (trapPriceEl) trapPriceEl.innerText = `₹${middlemanDisasterPrice.toLocaleString('en-IN')} / Qtl (-28% distress)`;
    if (trapInterestEl) trapInterestEl.innerText = `₹${middlemanInterest.toLocaleString('en-IN')} (48% APR)`;
    if (trapNetEl) trapNetEl.innerText = `₹${middlemanNetInHand.toLocaleString('en-IN')}`;
    if (trapLossEl) trapLossEl.innerText = `-₹${middlemanTotalLoss.toLocaleString('en-IN')}`;

    // 2. Fasalmarg Credit-to-Market Solution
    const fasalmargFairPrice = pricePerQtl + 40; // ₹2,540 with buyer match
    const fasalmargGrossSales = fasalmargFairPrice * cropYield; // 80 * 2540 = 2,03,200
    const formalInterest = Math.round(urgentNeed * (0.04 / 4)); // ₹500 for 3 months @ 4% p.a.
    const fasalmargNetInHand = fasalmargGrossSales - urgentNeed - formalInterest; // 2,03,200 - 50k - 500 = 1,52,700
    const extraEarnings = fasalmargNetInHand - middlemanNetInHand;

    const fasalmargGrossEl = document.getElementById('fasalmarg-gross-sale');
    const fasalmargPriceEl = document.getElementById('fasalmarg-crop-price');
    const fasalmargInterestEl = document.getElementById('fasalmarg-interest');
    const fasalmargNetEl = document.getElementById('fasalmarg-net-in-hand');
    const fasalmargGainEl = document.getElementById('fasalmarg-total-gain');

    if (fasalmargGrossEl) fasalmargGrossEl.innerText = `₹${fasalmargGrossSales.toLocaleString('en-IN')}`;
    if (fasalmargPriceEl) fasalmargPriceEl.innerText = `₹${fasalmargFairPrice.toLocaleString('en-IN')} / Qtl (Fair Market)`;
    if (fasalmargInterestEl) fasalmargInterestEl.innerText = `₹${formalInterest.toLocaleString('en-IN')} (4% KCC Subvention)`;
    if (fasalmargNetEl) fasalmargNetEl.innerText = `₹${fasalmargNetInHand.toLocaleString('en-IN')}`;
    if (fasalmargGainEl) fasalmargGainEl.innerText = `+₹${extraEarnings.toLocaleString('en-IN')} Extra Profit!`;

    // Update SVG Distress Risk Gauge
    window.DistressAIEngine.updateGaugeDisplay('distress-risk-gauge-container', riskResult.score, riskResult.riskColor);

    // Update Risk Alert Box
    const alertBox = document.getElementById('distress-risk-alert-box');
    if (alertBox) {
      alertBox.innerHTML = `
        <div class="risk-alert-title" style="color: ${riskResult.riskColor};">
          <span>⚠️</span> ${riskResult.diagnosis}
        </div>
        <div class="risk-alert-text">
          <strong>Urgent Need: ₹${urgentNeed.toLocaleString('en-IN')}</strong> against expected crop valuation of <strong>₹${totalCropValue.toLocaleString('en-IN')}</strong> (${ltvRatio}% LTV). 
          ${riskResult.interventionHeadline}
        </div>
        <div style="margin-top: 0.85rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-sm btn-primary" onclick="window.FinanceEngine.openCreditApplicationModal()">
            ⚡ Apply for 4% KCC Bridge Credit (₹${urgentNeed.toLocaleString('en-IN')})
          </button>
          <button class="btn btn-sm btn-gold" onclick="window.MarketplaceEngine.lockAggregatedLot()">
            🤝 Match Pre-Harvest Forward Contract
          </button>
        </div>
      `;
    }
  },

  renderSchemes: function() {
    const container = document.getElementById('formal-credit-schemes-container');
    if (!container) return;

    container.innerHTML = window.FasalmargData.formalCreditSchemes.map(s => `
      <div class="glass-card" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <span class="badge badge-emerald" style="margin-bottom: 0.35rem;">${s.badge}</span>
            <h4 style="font-size: 1.05rem;">${s.name}</h4>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${s.institution}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: #34d399;">${s.interestRate}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">TAT: ${s.processingTime}</div>
          </div>
        </div>

        <ul style="list-style: none; margin: 0.75rem 0; font-size: 0.825rem; color: var(--text-secondary);">
          ${s.features.map(f => `<li style="margin-bottom: 0.25rem;">✓ ${f}</li>`).join('')}
        </ul>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; margin-top: 0.5rem;">
          <span style="font-size: 0.8rem; color: var(--text-secondary);">Max LTV: <strong>${s.maxLTV}</strong></span>
          <button class="btn btn-sm btn-primary" onclick="window.FinanceEngine.openCreditApplicationModal('${s.name}')">Instant e-KYC Apply</button>
        </div>
      </div>
    `).join('');
  },

  openCreditApplicationModal: function(schemeName = 'Kisan Credit Card (KCC) Harvest Bridge') {
    const modal = document.getElementById('credit-apply-modal');
    const schemeTitle = document.getElementById('modal-scheme-title');
    const amountVal = document.getElementById('modal-credit-amount');

    if (schemeTitle) schemeTitle.innerText = schemeName;
    if (amountVal) amountVal.innerText = `₹${this.state.urgentNeed.toLocaleString('en-IN')}`;
    if (modal) modal.classList.add('active');
  },

  submitCreditApplication: function() {
    const modal = document.getElementById('credit-apply-modal');
    if (modal) modal.classList.remove('active');

    window.FasalmargApp.showToast(`Digital Loan Application of ₹${this.state.urgentNeed.toLocaleString('en-IN')} successfully submitted to State Bank of India partner desk! Pre-approved via Aadhaar e-KYC.`, 'success');
  }
};
