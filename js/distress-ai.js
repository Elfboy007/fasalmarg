/**
 * Fasalmarg AI Distress-Selling Risk Engine (Pillar 4)
 * Evaluates multi-signal vulnerability to prevent predatory debt and forced liquidation.
 */

window.DistressAIEngine = {
  /**
   * Calculates the Distress Risk Score (0 - 100)
   * Signals:
   * 1. Financial Need vs Crop Value (Urgency Ratio)
   * 2. Days to Harvest (Time Pressure)
   * 3. Confirmed Buyer Status (Market Certainty)
   * 4. Mandi Price Trajectory (Market Fragility)
   * 5. Informal Debt Factor
   */
  computeRiskScore: function(params) {
    const {
      urgentNeed = 50000,
      cropYield = 80,
      pricePerQtl = 2500,
      daysToHarvest = 18,
      hasConfirmedBuyer = false,
      priceTrend = -2.5, // % change in last 14 days
      hasInformalDebt = true
    } = params;

    const totalCropValue = Math.max(1000, cropYield * pricePerQtl);
    const needRatio = Math.min(1.0, urgentNeed / totalCropValue);

    // Component 1: Financial Urgency Weight (Max 40 points)
    let financialScore = needRatio * 40;

    // Component 2: Time to Harvest Pressure (Max 25 points)
    // Fewer days to harvest with unmet cash needs creates extreme panic
    let harvestPressureScore = 0;
    if (daysToHarvest <= 7) {
      harvestPressureScore = 25;
    } else if (daysToHarvest <= 20) {
      harvestPressureScore = 18;
    } else if (daysToHarvest <= 35) {
      harvestPressureScore = 10;
    } else {
      harvestPressureScore = 4;
    }

    // Component 3: Market Certainty (Max 20 points)
    // No verified buyer means spot mandi panic
    let buyerUncertaintyScore = hasConfirmedBuyer ? 2 : 20;

    // Component 4: Price Trend Trajectory (Max 10 points)
    // Falling mandi prices cause farmers to rush into panic sales
    let priceRiskScore = 0;
    if (priceTrend < -5) priceRiskScore = 10;
    else if (priceTrend < 0) priceRiskScore = 6;
    else priceRiskScore = 2;

    // Component 5: Existing Informal Middleman Debt (Max 15 points)
    let informalDebtScore = hasInformalDebt ? 15 : 0;

    const compositeScore = Math.min(100, Math.round(
      financialScore + harvestPressureScore + buyerUncertaintyScore + priceRiskScore + informalDebtScore
    ));

    let riskTier = 'LOW';
    let riskColor = 'var(--risk-safe)';
    let badgeClass = 'badge-risk-safe';
    let diagnosis = 'Healthy Financial & Market Position';
    let interventionHeadline = 'Optimal Timing for Forward Contracts';

    if (compositeScore >= 70) {
      riskTier = 'CRITICAL';
      riskColor = 'var(--risk-critical)';
      badgeClass = 'badge-risk-critical';
      diagnosis = 'Imminent Distress-Selling & Predatory Middleman Trap Detected!';
      interventionHeadline = 'Action Required: Activate Escrow Bridge Credit & Lock Verified Forward Buyer';
    } else if (compositeScore >= 45) {
      riskTier = 'MODERATE';
      riskColor = 'var(--risk-high)';
      badgeClass = 'badge-risk-high';
      diagnosis = 'Vulnerable to Spot Market Discounting & Cash Flow Strain';
      interventionHeadline = 'Recommended: Pre-qualify for KCC Bridge and Aggregation Pool';
    }

    // Calculate Middleman Loss vs Fasalmarg Protection
    const predatoryPrice = Math.round(pricePerQtl * 0.72); // Middlemen usually force 25-30% discount
    const totalLostToMiddleman = (pricePerQtl - predatoryPrice) * cropYield;
    const informalInterestEst = Math.round(urgentNeed * 0.12); // ~12% quarterly informal interest
    const formalInterestEst = Math.round(urgentNeed * (0.04 / 4)); // ~1% quarterly formal KCC interest
    const interestSaved = informalInterestEst - formalInterestEst;
    const totalFarmerSavings = totalLostToMiddleman + interestSaved;

    return {
      score: compositeScore,
      riskTier,
      riskColor,
      badgeClass,
      diagnosis,
      interventionHeadline,
      totalCropValue,
      safeLTVRatio: Math.round((urgentNeed / totalCropValue) * 100),
      predatoryPrice,
      totalLostToMiddleman,
      informalInterestEst,
      formalInterestEst,
      interestSaved,
      totalFarmerSavings,
      factors: {
        financialScore: Math.round(financialScore),
        harvestPressureScore,
        buyerUncertaintyScore,
        priceRiskScore,
        informalDebtScore
      }
    };
  },

  /**
   * Updates the visual SVG Gauge in the UI
   */
  updateGaugeDisplay: function(containerId, score, riskColor) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // SVG Radial Arc representation
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    // We only use 75% of circle for gauge (270 degrees)
    const arcLength = circumference * 0.75;
    const offset = arcLength - (arcLength * (score / 100));

    container.innerHTML = `
      <svg width="160" height="160" viewBox="0 0 160 160" style="transform: rotate(135deg);">
        <circle cx="80" cy="80" r="${radius}" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="12"
          stroke-dasharray="${arcLength} ${circumference}" stroke-linecap="round" />
        <circle cx="80" cy="80" r="${radius}" fill="none" stroke="${riskColor}" stroke-width="12"
          stroke-dasharray="${arcLength} ${circumference}" stroke-dashoffset="${offset}"
          stroke-linecap="round" style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.4s ease;" />
      </svg>
      <div class="gauge-score-center">
        <div class="gauge-score-value" style="color: ${riskColor};">${score}</div>
        <div class="gauge-score-label" style="color: ${riskColor};">/ 100 RISK</div>
      </div>
    `;
  }
};
