/**
 * Fasalmarg Marketplace & Supply Aggregation Engine (Pillar 1)
 * Manages smallholder pooling, dynamic price discovery, and the 8-stage transaction lifecycle.
 */

window.MarketplaceEngine = {
  // Currently selected farmers in the supply aggregation pool
  selectedFarmerIds: new Set(['FARM-A', 'FARM-B', 'FARM-C', 'FARM-D']),
  activeTransactionStage: 1,

  /**
   * Initializes the Marketplace and Supply Aggregation workspace
   */
  init: function() {
    this.renderFarmerPool();
    this.updateAggregationMath();
    this.renderBuyerDemands();
    this.renderTransactionPipeline();
  },

  /**
   * Render the interactive cards for smallholders in the pooling grid
   */
  renderFarmerPool: function() {
    const container = document.getElementById('farmer-pool-container');
    if (!container) return;

    container.innerHTML = window.FasalmargData.smallholderPool.map(f => {
      const isChecked = this.selectedFarmerIds.has(f.id);
      return `
        <div class="farmer-pool-card ${isChecked ? 'selected' : ''}" id="card-${f.id}" onclick="window.MarketplaceEngine.toggleFarmer('${f.id}')">
          <input type="checkbox" class="farmer-pool-checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); window.MarketplaceEngine.toggleFarmer('${f.id}')" />
          <div style="font-size: 1.8rem; margin-bottom: 0.35rem;">${f.avatar}</div>
          <div class="farmer-name">${f.name}</div>
          <div style="font-size: 0.775rem; color: var(--text-muted); margin-bottom: 0.5rem;">📍 ${f.location}</div>
          <div style="display: flex; align-items: baseline; justify-content: space-between; margin-top: 0.5rem;">
            <span class="farmer-qty">${f.quantity} <span style="font-size: 0.85rem; color: var(--text-secondary);">Qtl</span></span>
            <span class="badge ${f.distressRisk > 40 ? 'badge-risk-high' : 'badge-emerald'}">${f.riskLevel} RISK</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.5rem;">
            Harvest: <strong style="color: var(--text-primary);">${f.harvestDate}</strong>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Toggle a farmer into/out of the aggregation pool
   */
  toggleFarmer: function(farmerId) {
    if (this.selectedFarmerIds.has(farmerId)) {
      if (this.selectedFarmerIds.size <= 1) {
        window.FasalmargApp.showToast('At least one farmer must remain in the lot', 'warning');
        return;
      }
      this.selectedFarmerIds.delete(farmerId);
    } else {
      this.selectedFarmerIds.add(farmerId);
    }
    this.renderFarmerPool();
    this.updateAggregationMath();
  },

  /**
   * Calculates dynamic aggregation total and checks match against buyer orders
   */
  updateAggregationMath: function() {
    const selectedList = window.FasalmargData.smallholderPool.filter(f => this.selectedFarmerIds.has(f.id));
    const totalQty = selectedList.reduce((sum, f) => sum + f.quantity, 0);
    const formulaStr = selectedList.map(f => `${f.quantity}q`).join(' + ');

    const mathDisplay = document.getElementById('aggregation-math-display');
    const aggregateBtn = document.getElementById('aggregate-btn');
    const targetMatchAlert = document.getElementById('aggregation-match-alert');

    if (mathDisplay) {
      mathDisplay.innerHTML = `
        <span style="color: var(--text-secondary);">Pooled Supply:</span>
        <span style="color: var(--gold-400);">${formulaStr} = </span>
        <span style="font-size: 1.4rem; color: #34d399;">${totalQty} Quintals</span>
      `;
    }

    // Check if exactly 70 Quintals (matching ITC demand)
    const itcDemand = 70;
    if (totalQty === itcDemand) {
      if (targetMatchAlert) {
        targetMatchAlert.innerHTML = `
          <div class="badge badge-emerald" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
            ✨ Perfect Match: Exactly meets ITC e-Choupal 70-Quintal Procurement Order!
          </div>
        `;
      }
      if (aggregateBtn) {
        aggregateBtn.disabled = false;
        aggregateBtn.className = 'btn btn-primary';
        aggregateBtn.innerHTML = '⚡ Lock Aggregated Lot & Match with ITC (₹2,540/Qtl)';
      }
    } else {
      if (targetMatchAlert) {
        targetMatchAlert.innerHTML = `
          <div class="badge badge-gold" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
            Current Pool: ${totalQty} Qtl | Target Buyer Lot: ${itcDemand} Qtl (${itcDemand - totalQty > 0 ? (itcDemand - totalQty) + 'q needed' : Math.abs(itcDemand - totalQty) + 'q surplus'})
          </div>
        `;
      }
      if (aggregateBtn) {
        aggregateBtn.className = 'btn btn-secondary';
        aggregateBtn.innerHTML = `Create Custom Lot (${totalQty} Qtl)`;
      }
    }
  },

  /**
   * Lock aggregated lot and launch smart matching
   */
  lockAggregatedLot: function() {
    const selectedList = window.FasalmargData.smallholderPool.filter(f => this.selectedFarmerIds.has(f.id));
    const totalQty = selectedList.reduce((sum, f) => sum + f.quantity, 0);
    const totalVal = totalQty * 2540;

    window.FasalmargApp.showToast(`Aggregated Lot created! ${totalQty} Quintals pooled across ${selectedList.length} smallholders. Total Value: ₹${totalVal.toLocaleString('en-IN')}`, 'success');

    // Switch to Transaction Pipeline Stage 2
    this.setTransactionStage(2);
    const trackerEl = document.getElementById('transaction-lifecycle-section');
    if (trackerEl) {
      trackerEl.scrollIntoView({ behavior: 'smooth' });
    }
  },

  /**
   * Render Buyer Demands list
   */
  renderBuyerDemands: function() {
    const container = document.getElementById('buyer-demands-container');
    if (!container) return;

    container.innerHTML = window.FasalmargData.buyerDemands.map(b => `
      <div class="glass-card" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h4 style="font-size: 1.05rem;">${b.buyerName}</h4>
              ${b.isVerified ? '<span class="badge badge-emerald">✓ Verified Corporate</span>' : ''}
            </div>
            <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">Delivery: ${b.deliveryLocation} · ${b.deliveryDeadline}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.25rem; font-weight: 800; color: var(--gold-400);">₹${b.offerPrice.toLocaleString('en-IN')} <span style="font-size: 0.75rem; color: var(--text-secondary);">/ Qtl</span></div>
            <span class="badge badge-blue">${b.paymentTerms}</span>
          </div>
        </div>

        <div style="background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-sm); padding: 0.65rem 0.85rem; font-size: 0.825rem; margin-bottom: 1rem;">
          <div><strong>Requirement:</strong> ${b.quantityRequired} Quintals of ${b.cropRequired}</div>
          <div style="color: var(--text-secondary); margin-top: 0.25rem;"><strong>Specs:</strong> ${b.qualitySpec}</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 0.8rem; color: var(--text-secondary);">Aggregated Lots Eligible: <strong style="color: #34d399;">Active Pool Ready</strong></span>
          <button class="btn btn-sm btn-primary" onclick="window.MarketplaceEngine.lockAggregatedLot()">Match Aggregated Pool</button>
        </div>
      </div>
    `).join('');
  },

  /**
   * 8-Stage Transaction Pipeline Tracker
   */
  setTransactionStage: function(stageNum) {
    this.activeTransactionStage = stageNum;
    this.renderTransactionPipeline();
  },

  renderTransactionPipeline: function() {
    const stages = [
      { num: 1, name: '1. Matching', desc: 'AI Smart Match' },
      { num: 2, name: '2. Bidding', desc: 'Price & Contract Lock' },
      { num: 3, name: '3. Assay', desc: 'Quality Verification' },
      { num: 4, name: '4. Escrow', desc: '100% Funds Deposited' },
      { num: 5, name: '5. Logistics', desc: 'Pooled Fleet Dispatch' },
      { num: 6, name: '6. Delivery', desc: 'Digital Weighbridge' },
      { num: 7, name: '7. Settlement', desc: 'Escrow Auto-Disburse' },
      { num: 8, name: '8. Rating', desc: 'Reputation Score' }
    ];

    const pipelineContainer = document.getElementById('pipeline-stepper');
    if (!pipelineContainer) return;

    const progressPct = ((this.activeTransactionStage - 1) / (stages.length - 1)) * 90;

    pipelineContainer.innerHTML = `
      <div class="pipeline-progress-line" style="width: ${progressPct}%;"></div>
      ${stages.map(s => {
        let statusClass = '';
        if (s.num < this.activeTransactionStage) statusClass = 'completed';
        else if (s.num === this.activeTransactionStage) statusClass = 'active';

        return `
          <div class="pipeline-step ${statusClass}" onclick="window.MarketplaceEngine.setTransactionStage(${s.num})">
            <div class="step-node">${s.num < this.activeTransactionStage ? '✓' : s.num}</div>
            <div class="step-label">${s.name}</div>
          </div>
        `;
      }).join('')}
    `;

    // Render Stage Detail Panel
    const detailPanel = document.getElementById('pipeline-detail-content');
    if (detailPanel) {
      detailPanel.innerHTML = this.getStageDetailHTML(this.activeTransactionStage);
    }
  },

  getStageDetailHTML: function(stage) {
    switch (stage) {
      case 1:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: #34d399;">Stage 1: AI Smart Matching & Discovery</h4>
              <span class="badge badge-emerald">Status: Auto-Matched</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              The Fasalmarg Matching Algorithm evaluated 4 smallholder farmers in Sehore/Hoshangabad and aggregated a cohesive lot of <strong>70 Quintals</strong> of Grade A Sharbati Wheat, perfectly matching ITC e-Choupal's procurement demand.
            </p>
            <div style="display: flex; gap: 1rem;">
              <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(2)">Proceed to Digital Bidding & Lock →</button>
            </div>
          </div>
        `;
      case 2:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: var(--gold-400);">Stage 2: Price Discovery & Bid Lock</h4>
              <span class="badge badge-gold">Agreed Price: ₹2,540 / Quintal</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Mandi benchmark was ₹2,450. Corporate buyer offered ₹2,540 (+₹90 premium for unified bulk pickup). Both parties electronically agreed to the bilateral trade contract with zero brokerage fees.
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(3)">Proceed to Mobile Assay Verification →</button>
          </div>
        `;
      case 3:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: #60a5fa;">Stage 3: Digital Quality & Moisture Assay</h4>
              <span class="badge badge-blue">Passed: Grade A (10.4% Moisture)</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Fasalmarg village assay partner verified sample parameters using portable NIR spectrometer: Foreign matter 0.6%, grain luster 98%, gluten index optimal. Digital assay certificate linked to Smart Lot #AGR-709.
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(4)">Proceed to Escrow Deposit →</button>
          </div>
        `;
      case 4:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: #34d399;">Stage 4: 100% Buyer Escrow Lock</h4>
              <span class="badge badge-emerald">Escrow Funded: ₹1,77,800 INR</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Buyer ITC e-Choupal deposited ₹1,77,800 into the RBI-regulated Fasalmarg Escrow Vault (ICICI Bank Custody). Funds are legally guaranteed and locked for immediate farmer payout upon delivery.
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(5)">Schedule Aggregated Logistics Dispatch →</button>
          </div>
        `;
      case 5:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: var(--gold-400);">Stage 5: Aggregated Logistics & GPS Dispatch</h4>
              <span class="badge badge-gold">Truck #MP-04-HE-8192 Dispatched</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Instead of 4 separate tractors traveling to the mandi, a unified 10-wheeler was dispatched across Sehore collection points. Saved 68% in transportation carbon and ₹4,900 in freight expenses.
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(6)">Confirm Warehouse Delivery →</button>
          </div>
        `;
      case 6:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: #34d399;">Stage 6: Digital Weighbridge & Inspection</h4>
              <span class="badge badge-emerald">Gross Weight: 70.15 Quintals</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Automated weighbridge gross weight receipt verified at ITC Bhopal Central Hub. Zero deduction for spurious weight loss. Buyer warehouse manager signed digital proof of delivery (e-POD).
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(7)">Execute Automated Escrow Settlement →</button>
          </div>
        `;
      case 7:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: #34d399;">Stage 7: Automated Escrow & Bridge Loan Settlement</h4>
              <span class="badge badge-emerald">Disbursed via RBI RTGS / UPI</span>
            </div>
            <div class="settlement-sheet" style="margin-bottom: 1rem;">
              <div class="settlement-row">
                <span>Total Escrow Inflow (70 Qtl @ ₹2,540)</span>
                <strong>₹1,77,800</strong>
              </div>
              <div class="settlement-row" style="color: var(--gold-400);">
                <span>Auto-deduct Farmer B Bridge Credit (KCC Repayment)</span>
                <strong>-₹15,150</strong>
              </div>
              <div class="settlement-row" style="color: var(--gold-400);">
                <span>Auto-deduct Farmer D Bridge Credit (KCC Repayment)</span>
                <strong>-₹20,200</strong>
              </div>
              <div class="settlement-row" style="color: #94a3b8;">
                <span>Shared Logistics Freight (Deducted at source)</span>
                <strong>-₹4,200</strong>
              </div>
              <div class="settlement-row">
                <span>Net Direct Credit to Smallholder Bank Accounts</span>
                <strong style="color: #34d399; font-size: 1.25rem;">₹1,38,250</strong>
              </div>
            </div>
            <p style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 1rem;">
              Loans settled automatically with participating bank. Zero risk of default. Remaining balance instantly credited to Farmer A, B, C, D accounts!
            </p>
            <button class="btn btn-primary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(8)">Complete & View Ratings →</button>
          </div>
        `;
      case 8:
        return `
          <div class="glass-card" style="padding: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <h4 style="color: var(--gold-400);">Stage 8: Mutual Rating & Immutable Ledger Record</h4>
              <span class="badge badge-gold">Transaction Completed ⭐⭐⭐⭐⭐</span>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 1rem;">
              Farmers rated ITC e-Choupal 5/5 for on-time payment release. ITC rated the Aggregated Pool 4.9/5 for high purity and consistent grade. Smallholder credit profiles upgraded with institutional lenders.
            </p>
            <button class="btn btn-secondary btn-sm" onclick="window.MarketplaceEngine.setTransactionStage(1)">Reset Transaction Demo ↺</button>
          </div>
        `;
      default:
        return '';
    }
  }
};
