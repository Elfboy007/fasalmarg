/**
 * Fasalmarg Government Market Intelligence & Policy Surveillance Module (Pillar 6)
 * Real-time aggregated macro indicators, distress-selling vulnerability heatmaps, and MSP surveillance.
 */

window.GovDashboardModule = {
  init: function() {
    this.renderDistrictVulnerability();
    this.renderPriceSurveillance();
  },

  renderDistrictVulnerability: function() {
    const tableBody = document.getElementById('gov-distress-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = window.FasalmargData.govVulnerabilityDistricts.map(d => {
      let badgeClass = 'badge-risk-safe';
      if (d.riskLevel === 'CRITICAL') badgeClass = 'badge-risk-critical';
      else if (d.riskLevel === 'HIGH') badgeClass = 'badge-risk-high';
      else if (d.riskLevel === 'MODERATE') badgeClass = 'badge-gold';

      return `
        <tr>
          <td>
            <strong>${d.district}</strong>, <span style="color: var(--text-muted);">${d.state}</span>
            <div style="font-size: 0.75rem; color: var(--primary-400);">${d.crop}</div>
          </td>
          <td>
            <div style="font-size: 1.1rem; font-weight: 800; color: ${d.distressScore >= 75 ? 'var(--risk-critical)' : 'var(--gold-400)'};">${d.distressScore} / 100</div>
            <span class="badge ${badgeClass}">${d.riskLevel}</span>
          </td>
          <td>
            <div style="font-size: 0.85rem; font-weight: 600;">${d.mandiArrivalSurge}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Informal Debt: ${d.informalCreditDependency}</div>
          </td>
          <td>
            <div style="font-size: 0.825rem; color: #cbd5e1; margin-bottom: 0.4rem;">${d.recommendedAction}</div>
            <button class="btn btn-sm btn-gold" onclick="window.GovDashboardModule.triggerIntervention('${d.district}')">
              ⚡ Execute Policy Intervention
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  renderPriceSurveillance: function() {
    const container = document.getElementById('gov-mandi-surveillance-container');
    if (!container) return;

    container.innerHTML = window.FasalmargData.mandiPrices.map(p => {
      const isMspBreached = p.mandiModal < p.msp;
      const spread = p.mandiModal - p.msp;
      return `
        <div class="glass-card" style="padding: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <strong style="font-size: 0.95rem;">${p.name}</strong>
            ${isMspBreached ? '<span class="badge badge-risk-critical">⚠️ MSP Breached</span>' : '<span class="badge badge-emerald">✓ Above MSP Floor</span>'}
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.825rem; margin-bottom: 0.75rem;">
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">Mandi Modal</div>
              <div style="font-weight: 700; color: var(--text-primary);">₹${p.mandiModal}</div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">MSP Baseline</div>
              <div style="font-weight: 700; color: var(--gold-400);">₹${p.msp}</div>
            </div>
            <div>
              <div style="color: var(--text-muted); font-size: 0.7rem;">Spread</div>
              <div style="font-weight: 700; color: ${spread >= 0 ? '#34d399' : '#f87171'};">${spread >= 0 ? '+' : ''}₹${spread}</div>
            </div>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary);">
            24h Mandi Arrivals: <strong>${p.arrivals}</strong> (${p.trend})
          </div>
        </div>
      `;
    }).join('');
  },

  triggerIntervention: function(districtName) {
    window.FasalmargApp.showToast(`Government Directive Executed for ${districtName}: Direct procurement desk sanctioned & formal bridge credit facility dispatched. Mandi market stabilized!`, 'success');
  }
};
