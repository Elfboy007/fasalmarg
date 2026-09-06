// Fasalmarg Main Application Orchestrator
// Controls routing, state management, modal interactions, and feature workflows

window.FasalmargApp = (function() {
  let currentView = "onboarding"; // Default first page is dedicated multi-role login & gateway
  let activeCropSelection = "Tomato";
  let activeOrderFilter = "all";

  function init() {
    setupEventListeners();
    setupPriceTicker();
    setupI18n();
    renderAllViews();
    switchLoginRole("farmer");
    updateHeaderRoleBadge("Role Gateway");
    console.log("Fasalmarg Agricultural Platform initialized successfully on Role Gateway.");
  }

  function setupEventListeners() {
    // Brand home click -> go to onboarding gateway
    const brandHome = document.getElementById("fasalmarg-brand-home");
    if (brandHome) {
      brandHome.addEventListener("click", (e) => {
        e.preventDefault();
        navigateTo("onboarding");
      });
    }

    // Role switcher dropdown or buttons
    document.querySelectorAll("[data-nav-view]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const view = btn.getAttribute("data-nav-view");
        navigateTo(view);
      });
    });

    // Language dropdown toggle
    const langBtn = document.getElementById("lang-select-btn");
    const langMenu = document.getElementById("lang-dropdown-menu");
    if (langBtn && langMenu) {
      langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenu.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        langMenu.classList.remove("show");
      });

      langMenu.querySelectorAll(".lang-option").forEach(opt => {
        opt.addEventListener("click", () => {
          const lang = opt.getAttribute("data-lang");
          if (window.FasalmargI18n) {
            window.FasalmargI18n.setLang(lang);
          }
          langMenu.querySelectorAll(".lang-option").forEach(o => o.classList.remove("active"));
          opt.classList.add("active");
          showToast(`Language updated to ${opt.textContent.trim()}`);
        });
      });
    }

    // Voice assistant triggers
    document.querySelectorAll(".trigger-voice-assistant").forEach(btn => {
      btn.addEventListener("click", () => {
        if (window.VoiceAssistant) {
          window.VoiceAssistant.openModal();
        }
      });
    });

    // Notifications trigger
    const notifBtn = document.getElementById("btn-notifications-trigger");
    if (notifBtn) {
      notifBtn.addEventListener("click", () => {
        openModal("notifications-modal");
      });
    }

    // Profile trigger
    const profileBtn = document.getElementById("btn-profile-trigger");
    if (profileBtn) {
      profileBtn.addEventListener("click", () => {
        openModal("profile-modal");
      });
    }
  }

  function setupPriceTicker() {
    const track = document.getElementById("ticker-track-content");
    if (!track || !window.FasalmargData) return;

    const itemsHtml = window.FasalmargData.mandiPrices.map(p => {
      const arrow = p.trend === "up" ? "↑" : p.trend === "down" ? "↓" : "→";
      const trendClass = `trend-${p.trend}`;
      return `
        <span class="ticker-item">
          <strong>${p.crop}</strong> (${p.mandi}): 
          <span class="${trendClass}">₹${p.price.toLocaleString("en-IN")}/Q ${arrow} (${p.change})</span>
        </span>
      `;
    }).join("&nbsp;&nbsp;·&nbsp;&nbsp;");

    track.innerHTML = itemsHtml;
  }

  function setupI18n() {
    if (window.FasalmargI18n) {
      window.FasalmargI18n.applyTranslations();
    }
  }

  // Master Navigation Router
  function navigateTo(viewId) {
    currentView = viewId;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Hide all view sections
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.style.display = "none";
    });

    // Update bottom nav active state
    document.querySelectorAll(".bottom-nav-item").forEach(item => {
      item.classList.remove("active");
    });

    if (viewId === "landing") {
      const landing = document.getElementById("view-landing");
      if (landing) landing.style.display = "block";
      updateHeaderRoleBadge("Visitor");
      return;
    }

    if (viewId === "onboarding") {
      const onboarding = document.getElementById("view-onboarding");
      if (onboarding) onboarding.style.display = "block";
      updateHeaderRoleBadge("Onboarding");
      return;
    }

    if (viewId === "dashboard") {
      const dashboard = document.getElementById("view-dashboard");
      if (dashboard) dashboard.style.display = "block";
      updateHeaderRoleBadge("Farmer: Ramesh");
      const navHome = document.getElementById("bnav-home");
      if (navHome) navHome.classList.add("active");
      return;
    }

    if (viewId === "customer-care") viewId = "customer-care-portal";
    if (viewId === "grievance-support") viewId = "grievance-farmer";

    // Subpage views
    const subpage = document.getElementById(`view-${viewId}`);
    if (subpage) {
      subpage.style.display = "block";
      subpage.classList.add("active");

      // Custom header role badge per view
      if (viewId === "federation-portal") {
        updateHeaderRoleBadge("Federation: MH State");
      } else if (viewId === "customer-care-portal") {
        updateHeaderRoleBadge("Support: Priya (Lead)");
      } else if (viewId === "buyer-portal") {
        updateHeaderRoleBadge("Buyer: ABC Agro");
      } else if (viewId === "mandi-registration") {
        updateHeaderRoleBadge("APMC Mandi");
      } else {
        updateHeaderRoleBadge("Farmer: Ramesh");
      }

      // Specific page initializations
      if (viewId === "price-insights") {
        renderPriceChart(activeCropSelection);
        renderKaggleExplorer();
      } else if (viewId === "my-crops") {
        renderMyCrops();
      } else if (viewId === "marketplace") {
        renderMarketplace();
      } else if (viewId === "smart-matching") {
        renderSmartMatches();
      } else if (viewId === "my-orders") {
        renderOrdersList();
      } else if (viewId === "quality-verification") {
        setupQualityScanner();
      } else if (viewId === "distress-risk") {
        renderDistressRiskEngine();
      } else if (viewId === "supply-aggregation") {
        renderSupplyAggregation();
      }

      // Highlight bottom nav if matching
      const navTarget = document.getElementById(`bnav-${viewId}`);
      if (navTarget) navTarget.classList.add("active");
    } else {
      console.warn(`View view-${viewId} not found, defaulting to dashboard.`);
      navigateTo("dashboard");
    }
  }

  function updateHeaderRoleBadge(roleText) {
    const badge = document.getElementById("header-role-badge");
    if (badge) {
      badge.textContent = roleText;
    }
  }

  // Render All Dynamic Views
  function renderAllViews() {
    renderMyCrops();
    renderMarketplace();
    renderSmartMatches();
    renderPriceChart("Tomato");
    renderOrdersList();
    renderDistressRiskEngine();
    renderSupplyAggregation();
    renderKaggleExplorer();
  }

  // 1. My Crops View
  function renderMyCrops() {
    const container = document.getElementById("my-crops-list-container");
    if (!container || !window.FasalmargData) return;

    container.innerHTML = window.FasalmargData.myCrops.map(crop => {
      return `
        <div class="crop-card">
          <div class="crop-card-header">
            <div class="crop-card-title">
              <span>${crop.icon}</span>
              <span>${crop.name}</span>
            </div>
            <span class="badge badge-green">${crop.qualityGrade}</span>
          </div>
          <div class="crop-card-body">
            <div class="crop-detail-row">
              <span>Quantity:</span>
              <strong>${crop.quantityQuintals} Quintals</strong>
            </div>
            <div class="crop-detail-row">
              <span>Harvest Date:</span>
              <strong>${crop.harvestDate}</strong>
            </div>
            <div class="crop-detail-row">
              <span>Min Reservation Price:</span>
              <strong style="color: var(--green-primary);">₹${crop.minPricePerQuintal.toLocaleString("en-IN")}/Q</strong>
            </div>
            <div class="crop-detail-row">
              <span>Current Market Offer:</span>
              <strong style="color: var(--accent-orange);">₹${crop.bestBuyerOffer.toLocaleString("en-IN")}/Q ↑</strong>
            </div>
            <div class="crop-detail-row">
              <span>Status:</span>
              <span class="badge badge-blue">${crop.status}</span>
            </div>
          </div>
          <div class="crop-card-actions">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.FasalmargApp.openEditCropModal('${crop.id}')">
              ✏️ Edit
            </button>
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.FasalmargApp.listCropForSale('${crop.id}')">
              🌾 List for Sale
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Add New Crop
  function handleAddNewCropSubmit(e) {
    e.preventDefault();
    const name = document.getElementById("new-crop-name").value;
    const qty = parseInt(document.getElementById("new-crop-qty").value) || 10;
    const grade = document.getElementById("new-crop-grade").value;
    const harvest = document.getElementById("new-crop-harvest").value || "25 Oct 2026";
    const minPrice = parseInt(document.getElementById("new-crop-min-price").value) || 2000;

    const iconMap = {
      Tomato: "🍅",
      Onion: "🧅",
      Potato: "🥔",
      Wheat: "🌾",
      Soybean: "🌱",
      Cotton: "☁️"
    };

    const newCrop = {
      id: "CROP-" + Date.now().toString().slice(-4),
      name: name,
      variety: "Hybrid Standard",
      icon: iconMap[name] || "🌱",
      quantityQuintals: qty,
      qualityGrade: grade,
      harvestDate: harvest,
      location: "Dindori, Nashik",
      minPricePerQuintal: minPrice,
      currentMarketPrice: minPrice + 200,
      bestBuyerOffer: minPrice + 350,
      status: "Ready for Pickup",
      listedForSale: true,
      qualityMetrics: { colorScore: 95, sizeScore: 92, freshness: 96, defects: 0 }
    };

    window.FasalmargData.myCrops.unshift(newCrop);
    renderMyCrops();
    closeModal("add-crop-modal");
    showToast(`✓ ${name} (${qty} Quintals) registered and listed on Fasalmarg Marketplace!`);
  }

  // 2. Marketplace View
  function renderMarketplace() {
    const container = document.getElementById("marketplace-buyers-container");
    if (!container || !window.FasalmargData) return;

    const filterCrop = document.getElementById("market-filter-crop") ? document.getElementById("market-filter-crop").value : "all";

    const filtered = window.FasalmargData.buyers.filter(b => {
      if (filterCrop !== "all" && b.lookingFor !== filterCrop) return false;
      return true;
    });

    container.innerHTML = filtered.map(b => {
      return `
        <div class="card" style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <h3 style="font-size: 1.25rem; color: var(--green-dark);">${b.name}</h3>
                <span class="badge badge-green">✓ Verified Buyer</span>
              </div>
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">
                📍 ${b.location} (${b.distanceKm} km) · ⭐ ${b.reputationScore} (${b.tradesCompleted} Trades)
              </div>
            </div>
            <span class="badge badge-orange" style="font-size: 0.9rem; padding: 0.4rem 0.9rem;">
              Offer: ${b.offerRange}
            </span>
          </div>

          <div class="grid-2" style="background: var(--green-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; font-size: 0.92rem;">
            <div>
              <span style="color: var(--text-muted);">Looking for:</span>
              <strong style="color: var(--green-dark); margin-left: 0.3rem;">${b.lookingFor}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Required Quantity:</span>
              <strong style="margin-left: 0.3rem;">${b.quantityRequired} Quintals</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Target Delivery:</span>
              <strong style="margin-left: 0.3rem;">${b.deliveryDate}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Payment Terms:</span>
              <strong style="margin-left: 0.3rem; color: var(--green-primary);">${b.paymentTerms}</strong>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
            <button class="btn btn-secondary btn-sm" onclick="window.FasalmargApp.viewBuyerProfile('${b.id}')">
              🏢 View Buyer
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.FasalmargApp.openSendOfferModal('${b.id}')">
              🤝 Send Offer
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 3. Smart Matching View
  function renderSmartMatches() {
    const container = document.getElementById("smart-matches-container");
    if (!container || !window.FasalmargData) return;

    container.innerHTML = window.FasalmargData.smartMatches.map(m => {
      const factorsHtml = m.factors.map(f => {
        const icon = f.matched ? "✓" : "•";
        const color = f.matched ? "var(--green-primary)" : "var(--text-muted)";
        return `<div style="font-size: 0.9rem; color: ${color}; margin-bottom: 0.3rem;">${icon} ${f.label}</div>`;
      }).join("");

      return `
        <div class="card" style="border-left: 6px solid var(--green-primary); margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div>
              <h3 style="font-size: 1.25rem; color: var(--green-dark);">${m.buyer}</h3>
              <div style="font-size: 0.85rem; color: var(--text-muted);">📍 ${m.location} · Produce: ${m.crop}</div>
            </div>
            <div style="text-align: right;">
              <span class="badge badge-green" style="font-size: 1.1rem; padding: 0.4rem 0.9rem;">
                ${m.matchScore}% Match ⭐
              </span>
              <div style="font-size: 0.8rem; color: var(--green-primary); font-weight: 700; margin-top: 0.2rem;">
                Best Offer: ₹${m.offerPrice.toLocaleString("en-IN")}/Q
              </div>
            </div>
          </div>

          <div style="background: var(--bg-card-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem;">
            <div style="font-size: 0.85rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">
              AI Match Criteria:
            </div>
            ${factorsHtml}
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn btn-primary" onclick="window.FasalmargApp.openSendOfferModal('${m.buyer}')">
              🤝 View & Accept Offer
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 4. Price Insights Interactive SVG Chart
  function renderPriceChart(cropName) {
    activeCropSelection = cropName;
    const chartContainer = document.getElementById("price-chart-svg-container");
    if (!chartContainer) return;

    // Data points for historical 10 days + 4 days forecast
    const pricesByCrop = {
      Tomato: [2400, 2450, 2520, 2480, 2600, 2680, 2750, 2810, 2850, 2920, 2980, 3050],
      Onion: [2100, 2150, 2200, 2250, 2300, 2350, 2380, 2400, 2420, 2450, 2500, 2550],
      Potato: [1750, 1780, 1800, 1820, 1850, 1880, 1900, 1920, 1940, 1960, 1980, 2000],
      Wheat: [2500, 2520, 2540, 2580, 2600, 2620, 2650, 2670, 2690, 2710, 2730, 2750]
    };

    const series = pricesByCrop[cropName] || pricesByCrop.Tomato;
    const minVal = Math.min(...series) - 100;
    const maxVal = Math.max(...series) + 100;
    const range = maxVal - minVal;

    const width = 680;
    const height = 240;
    const padding = 40;

    const points = series.map((val, idx) => {
      const x = padding + (idx / (series.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - minVal) / range) * (height - padding * 2);
      return { x, y, val, isForecast: idx >= 8 };
    });

    const pathD = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    const dotsSvg = points.map(pt => {
      const fill = pt.isForecast ? "var(--accent-purple)" : "var(--green-primary)";
      return `<circle cx="${pt.x}" cy="${pt.y}" r="5" fill="${fill}" stroke="#ffffff" stroke-width="2">
                <title>₹${pt.val}/Q</title>
              </circle>`;
    }).join("");

    chartContainer.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: auto; display: block; overflow: visible;">
        <!-- Grid lines -->
        <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="#e2ece3" stroke-width="1.5" />
        <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="#e2ece3" stroke-dasharray="4 4" stroke-width="1" />
        <line x1="${padding + (8 / (series.length - 1)) * (width - padding * 2)}" y1="${padding}" x2="${padding + (8 / (series.length - 1)) * (width - padding * 2)}" y2="${height - padding}" stroke="var(--accent-purple)" stroke-dasharray="3 3" stroke-width="1.5" />

        <!-- Area Gradient -->
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#22c55e" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#22c55e" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Area fill -->
        <path d="${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z" fill="url(#priceGrad)" />

        <!-- Line graph -->
        <path d="${pathD}" fill="none" stroke="var(--green-primary)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Points -->
        ${dotsSvg}

        <!-- Labels -->
        <text x="${padding}" y="${height - 12}" font-size="12" font-weight="700" fill="#5e7a69">10 Days Ago</text>
        <text x="${padding + (8 / (series.length - 1)) * (width - padding * 2)}" y="${height - 12}" text-anchor="middle" font-size="12" font-weight="800" fill="var(--green-dark)">Today (₹${series[8]})</text>
        <text x="${width - padding}" y="${height - 12}" text-anchor="end" font-size="12" font-weight="800" fill="var(--accent-purple)">7-Day AI Forecast (₹${series[series.length - 1]})</text>
      </svg>
    `;

    // Update current & expected range text
    const currentPriceEl = document.getElementById("price-current-value");
    const expectedRangeEl = document.getElementById("price-expected-range");
    if (currentPriceEl) currentPriceEl.textContent = `₹${series[8].toLocaleString("en-IN")}/Q`;
    if (expectedRangeEl) expectedRangeEl.textContent = `₹${minVal + 100} – ₹${maxVal - 50}/Q`;
  }

  // Kaggle Live Mandi Dataset Explorer Engine
  function renderKaggleExplorer() {
    filterKaggleDataset();
  }

  function filterKaggleDataset() {
    if (!window.KaggleMandiDataset) return;

    const commEl = document.getElementById("kaggle-filter-commodity");
    const stateEl = document.getElementById("kaggle-filter-state");
    const searchEl = document.getElementById("kaggle-search-input");

    const commodity = commEl ? commEl.value : "Tomato";
    const state = stateEl ? stateEl.value : "all";
    const query = searchEl ? searchEl.value : "";

    const filtered = window.KaggleMandiDataset.filterRecords({ commodity, state, query });
    const tbody = document.getElementById("kaggle-dataset-table-body");
    const countEl = document.getElementById("kaggle-record-count");

    if (countEl) countEl.textContent = filtered.length;

    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" style="padding: 2rem; text-align: center; color: var(--text-muted);">
              🔍 No matching mandi records found in Kaggle dataset. Try clearing your search query.
            </td>
          </tr>
        `;
      } else {
        tbody.innerHTML = filtered.map(r => {
          const arrow = r.trend === "up" ? "↑" : r.trend === "down" ? "↓" : "→";
          const trendClass = `trend-${r.trend}`;
          return `
            <tr style="border-bottom: 1px solid var(--border-light); transition: background 0.1s ease;" onmouseover="this.style.background='var(--green-surface)'" onmouseout="this.style.background='transparent'">
              <td style="padding: 0.65rem; font-size: 0.85rem; color: var(--text-muted); white-space: nowrap;">${r.date}</td>
              <td style="padding: 0.65rem; font-weight: 800; color: var(--green-dark);">${r.market}</td>
              <td style="padding: 0.65rem; font-size: 0.88rem;">${r.district}, <span style="color: var(--text-muted);">${r.state}</span></td>
              <td style="padding: 0.65rem;">
                <span style="font-weight: 700;">${r.commodity}</span>
                <span style="font-size: 0.78rem; color: var(--text-muted); display: block;">${r.variety}</span>
              </td>
              <td style="padding: 0.65rem; font-weight: 600;">${r.arrivalsQtl.toLocaleString("en-IN")} Q</td>
              <td style="padding: 0.65rem; font-size: 0.85rem; color: var(--text-muted);">₹${r.minPrice.toLocaleString("en-IN")} – ₹${r.maxPrice.toLocaleString("en-IN")}</td>
              <td style="padding: 0.65rem; font-weight: 900; color: var(--green-primary); font-size: 1.05rem;">₹${r.modalPrice.toLocaleString("en-IN")}/Q</td>
              <td style="padding: 0.65rem;">
                <span class="${trendClass}" style="font-weight: 700; font-size: 0.85rem;">${arrow} ${r.change}</span>
              </td>
            </tr>
          `;
        }).join("");
      }
    }

    renderKaggleArbitrage(commodity === "all" ? "Tomato" : commodity);
  }

  function renderKaggleArbitrage(commodity) {
    const container = document.getElementById("kaggle-arbitrage-container");
    if (!container || !window.KaggleMandiDataset) return;

    const opportunities = window.KaggleMandiDataset.getArbitrageOpportunities(commodity, "Nashik");
    if (opportunities.length === 0) {
      container.innerHTML = "";
      return;
    }

    const topOpportunities = opportunities.slice(0, 3);
    const topHtml = topOpportunities.map(opp => {
      const isPositive = opp.priceDiff > 0;
      const diffColor = isPositive ? "var(--green-primary)" : opp.isLocal ? "var(--text-main)" : "var(--accent-orange)";
      const diffText = opp.isLocal ? "HOME MANDI BASELINE" : isPositive ? `+₹${opp.priceDiff}/Q HIGHER` : `-₹${Math.abs(opp.priceDiff)}/Q LOWER`;

      return `
        <div style="background: var(--bg-card); border: 1.5px solid ${opp.isLocal ? 'var(--green-primary)' : 'var(--border-card)'}; border-radius: var(--radius-md); padding: 0.85rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <div style="font-size: 0.78rem; font-weight: 800; color: ${diffColor}; text-transform: uppercase;">
              ${diffText}
            </div>
            <strong style="font-size: 1.05rem; color: var(--green-dark);">${opp.market}</strong>
            <div style="font-size: 0.82rem; color: var(--text-muted);">${opp.district}, ${opp.state} · ${opp.variety}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.3rem; font-weight: 900; color: var(--green-primary);">
              ₹${opp.modalPrice.toLocaleString("en-IN")}/Q
            </div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Daily Arrival: ${opp.arrivalsQtl} Q</div>
          </div>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div style="background: linear-gradient(135deg, var(--green-surface), #ffffff); border: 1.5px solid var(--green-soft); border-radius: var(--radius-lg); padding: 1.1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <span class="badge badge-purple" style="font-size: 0.75rem;">AI Price Arbitrage Radar</span>
            <h4 style="font-size: 1.1rem; color: var(--green-dark); margin-top: 0.2rem;">
              Highest Paying Mandis for ${commodity}
            </h4>
          </div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">Benchmarked vs Nashik APMC</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${topHtml}
        </div>
      </div>
    `;
  }

  function refreshKaggleLiveTick() {
    if (!window.KaggleMandiDataset) return;
    const updated = window.KaggleMandiDataset.simulateLiveTick();
    filterKaggleDataset();
    setupPriceTicker();
    showToast(`✓ Kaggle Live Feed Synced! ${updated.market} updated: ${updated.commodity} @ ₹${updated.modalPrice}/Q (${updated.change})`);
  }

  function downloadKaggleCSV() {
    if (!window.KaggleMandiDataset) return;
    const csvContent = window.KaggleMandiDataset.exportToCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kaggle_agmarknet_mandi_prices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("✓ Kaggle Live APMC Mandi Dataset (CSV) downloaded successfully!");
  }

  // 5. Orders List View
  function renderOrdersList() {
    const container = document.getElementById("orders-list-container");
    if (!container || !window.FasalmargData) return;

    container.innerHTML = window.FasalmargData.orders.map(o => {
      return `
        <div class="card" style="margin-bottom: 1.25rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted);">${o.id}</span>
              <h3 style="font-size: 1.3rem; color: var(--green-dark);">${o.crop} → ${o.buyer}</h3>
            </div>
            <span class="badge badge-orange" style="font-size: 0.9rem;">${o.statusBadge}</span>
          </div>

          <div class="grid-3" style="background: var(--green-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; font-size: 0.92rem;">
            <div>
              <span style="color: var(--text-muted);">Quantity:</span>
              <strong style="margin-left: 0.3rem;">${o.quantity} Quintals</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Agreed Price:</span>
              <strong style="margin-left: 0.3rem; color: var(--green-primary);">₹${o.pricePerQ.toLocaleString("en-IN")}/Q</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Gross Trade Value:</span>
              <strong style="margin-left: 0.3rem; color: var(--green-dark);">₹${o.totalAmount.toLocaleString("en-IN")}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Delivery Date:</span>
              <strong style="margin-left: 0.3rem;">${o.deliveryDate}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Transport Fleet:</span>
              <strong style="margin-left: 0.3rem;">${o.transportPartner || "Assigned by Fasalmarg"}</strong>
            </div>
            <div>
              <span style="color: var(--text-muted);">Escrow Security:</span>
              <strong style="margin-left: 0.3rem; color: #16a34a;">100% Protected Hold</strong>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: flex-end; flex-wrap: wrap;">
            <button class="btn btn-secondary btn-sm" onclick="window.FasalmargApp.openAgreementModal('${o.id}')">
              📜 Digital Trade Agreement
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.FasalmargApp.openOrderTrackingModal('${o.id}')">
              🚚 Track Order
            </button>
          </div>
        </div>
      `;
    }).join("");
  }

  // 6. Quality Scanner Simulation
  function setupQualityScanner() {
    const resultBox = document.getElementById("scanner-result-box");
    if (resultBox) resultBox.style.display = "block";
  }

  function simulateCropAnalysis(cropName) {
    const scanStatus = document.getElementById("scanner-status-text");
    const scanBtn = document.getElementById("btn-start-ai-scan");

    if (scanBtn) scanBtn.disabled = true;
    if (scanStatus) scanStatus.textContent = "AI Computer Vision Analyzing Color, Size, Surface & Defects... 🔬";

    setTimeout(() => {
      if (scanStatus) scanStatus.textContent = "✓ Optical Assay Completed: Indicative Grade A Certified!";
      if (scanBtn) scanBtn.disabled = false;
      showToast("✓ Crop Assay Complete: Grade A (Indicative). Market Value: +₹250/Q premium!");
    }, 1200);
  }

  // 7. Distress Selling Risk Engine
  function renderDistressRiskEngine() {
    const container = document.getElementById("distress-risk-factors-container");
    if (!container || !window.FasalmargData) return;

    container.innerHTML = window.FasalmargData.distressRisk.analysisFactors.map(f => {
      return `
        <div style="display: flex; justify-content: space-between; padding: 0.65rem 0; border-bottom: 1px solid var(--border-light); font-size: 0.95rem;">
          <span style="color: var(--text-main); font-weight: 600;">${f.name}</span>
          <strong style="color: var(--green-dark);">${f.status}</strong>
        </div>
      `;
    }).join("");
  }

  // 8. Supply Aggregation Hub
  function renderSupplyAggregation() {
    const container = document.getElementById("pool-participants-list");
    if (!container || !window.FasalmargData) return;

    container.innerHTML = window.FasalmargData.supplyAggregation.participants.map(p => {
      const badge = p.isUser ? '<span class="badge badge-green">YOU</span>' : '<span class="badge badge-blue">Neighbor Farmer</span>';
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border: 1px solid var(--border-light); margin-bottom: 0.5rem;">
          <div>
            <strong style="color: var(--green-dark);">${p.name}</strong>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${p.village}</div>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 1.05rem; color: var(--text-main);">${p.quantity} Quintals</strong>
            <div>${badge}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Modals Management
  function openModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.add("active");
  }

  function closeModal(modalId) {
    const m = document.getElementById(modalId);
    if (m) m.classList.remove("active");
  }

  // Action Helpers
  function openSendOfferModal(buyerIdentifier) {
    const buyerNameInput = document.getElementById("offer-modal-buyer-name");
    if (buyerNameInput) buyerNameInput.value = buyerIdentifier;
    openModal("send-offer-modal");
  }

  function handleSendOfferSubmit(e) {
    e.preventDefault();
    const buyer = document.getElementById("offer-modal-buyer-name").value;
    const crop = document.getElementById("offer-modal-crop").value;
    const qty = document.getElementById("offer-modal-qty").value;
    const price = document.getElementById("offer-modal-price").value;

    closeModal("send-offer-modal");
    showToast(`✓ Formal bid of ₹${price}/Q for ${qty}Q ${crop} sent to ${buyer}!`);
    setTimeout(() => {
      navigateTo("my-orders");
    }, 1000);
  }

  function openAgreementModal(orderId) {
    openModal("agreement-modal");
  }

  function acceptAgreement() {
    closeModal("agreement-modal");
    showToast("✓ Digital Trade Agreement signed & locked into Fasalmarg Escrow!");
  }

  function downloadAgreementReceipt() {
    window.print();
  }

  function openOrderTrackingModal(orderId) {
    openModal("order-tracking-modal");
  }

  function openPaymentSimulation() {
    openModal("razorpay-simulation-modal");
  }

  function completeRazorpaySimulation() {
    closeModal("razorpay-simulation-modal");
    showToast("✓ Payment of ₹56,000 released from Escrow into Ramesh's SBI Account via Instant UPI!");
    const pendingEl = document.getElementById("dash-pending-payments-stat");
    if (pendingEl) pendingEl.textContent = "₹0 (Settled)";
  }

  function openEditCropModal(cropId) {
    showToast("Edit Crop modal opened. Updating crop parameters.");
    openModal("add-crop-modal");
  }

  function listCropForSale(cropId) {
    showToast("✓ Crop listed on verified marketplace! 5 buyers notified.");
    navigateTo("marketplace");
  }

  function viewBuyerProfile(buyerId) {
    navigateTo("marketplace");
    showToast(`Viewing Verified Buyer details for ${buyerId}`);
  }

  function requestPickupDispatch() {
    showToast("✓ Farm-gate pickup scheduled! Kisan Rath vehicle MH-15-EG-4820 assigned.");
    closeModal("order-tracking-modal");
  }

  // Toast Notification System
  function showToast(message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>🌿</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // 10-Step Onboarding Navigation Engine
  let currentOnboardStep = 1;

  function goToOnboardingStep(stepNum) {
    if (stepNum < 1 || stepNum > 10) return;
    currentOnboardStep = stepNum;

    // Hide all steps
    for (let i = 1; i <= 10; i++) {
      const el = document.getElementById(`onboard-step-${i}`);
      if (el) el.style.display = "none";
    }

    // Show target step
    const target = document.getElementById(`onboard-step-${stepNum}`);
    if (target) target.style.display = "block";

    // Update progress bar & text
    const indicator = document.getElementById("onboarding-step-indicator");
    if (indicator) indicator.textContent = `Step ${stepNum} of 10`;

    const fillBar = document.getElementById("onboarding-progress-fill");
    if (fillBar) fillBar.style.width = `${stepNum * 10}%`;

    // If step 10, update summary details from inputs
    if (stepNum === 10) {
      updateOnboardingSummaryCard();
    }
  }

  function selectOnboardingChip(type, element, value) {
    const parent = element.parentElement;
    if (parent) {
      parent.querySelectorAll(".selectable-chip").forEach(c => c.classList.remove("selected"));
    }
    element.classList.add("selected");
    const hiddenInput = document.getElementById(`onboard-farmer-${type}`);
    if (hiddenInput) hiddenInput.value = value;
  }

  function selectFarmSize(element, acresVal) {
    const parent = element.parentElement;
    if (parent) {
      parent.querySelectorAll(".selectable-chip").forEach(c => c.classList.remove("selected"));
    }
    element.classList.add("selected");
    const acreageInput = document.getElementById("onboard-farmer-farmsize");
    if (acreageInput) acreageInput.value = acresVal;
  }

  function quickFillDemoOnboarding() {
    const nameInput = document.getElementById("onboard-farmer-name");
    if (nameInput) nameInput.value = "Ramesh Patel";

    const stateInput = document.getElementById("onboard-farmer-state");
    if (stateInput) stateInput.value = "Maharashtra";

    const distInput = document.getElementById("onboard-farmer-district");
    if (distInput) distInput.value = "Nashik";

    const villInput = document.getElementById("onboard-farmer-village");
    if (villInput) villInput.value = "Dindori";

    const farmInput = document.getElementById("onboard-farmer-farmsize");
    if (farmInput) farmInput.value = "4.5";

    const aadhaarInput = document.getElementById("onboard-farmer-aadhaar");
    if (aadhaarInput) aadhaarInput.value = "XXXX-XXXX-8841";

    showToast("✓ Demo profile filled! Jumped to Review & Verification.");
    goToOnboardingStep(10);
  }

  function updateOnboardingSummaryCard() {
    const name = document.getElementById("onboard-farmer-name") ? document.getElementById("onboard-farmer-name").value : "Ramesh Patel";
    const state = document.getElementById("onboard-farmer-state") ? document.getElementById("onboard-farmer-state").value : "Maharashtra";
    const dist = document.getElementById("onboard-farmer-district") ? document.getElementById("onboard-farmer-district").value : "Nashik";
    const vill = document.getElementById("onboard-farmer-village") ? document.getElementById("onboard-farmer-village").value : "Dindori";
    const farm = document.getElementById("onboard-farmer-farmsize") ? document.getElementById("onboard-farmer-farmsize").value : "4.5";

    const sumName = document.getElementById("sum-name");
    const sumLoc = document.getElementById("sum-loc");
    const sumLand = document.getElementById("sum-land");
    const sumHead = document.getElementById("onboard-summary-name");

    if (sumName) sumName.textContent = name;
    if (sumHead) sumHead.textContent = name;
    if (sumLoc) sumLoc.textContent = `${vill}, ${dist}, ${state}`;
    if (sumLand) sumLand.textContent = `${farm} Acres`;
  }

  function completeOnboarding() {
    const name = document.getElementById("onboard-farmer-name") ? document.getElementById("onboard-farmer-name").value : "Ramesh Patel";
    const dist = document.getElementById("onboard-farmer-district") ? document.getElementById("onboard-farmer-district").value : "Nashik";
    const state = document.getElementById("onboard-farmer-state") ? document.getElementById("onboard-farmer-state").value : "Maharashtra";

    // Update greeting on dashboard
    const greetingEl = document.querySelector("#view-dashboard h1");
    if (greetingEl) {
      greetingEl.innerHTML = `Namaste, ${name.split(" ")[0]} 👋`;
    }

    const locEl = document.querySelector("#view-dashboard [data-i18n='location']");
    if (locEl) {
      locEl.textContent = `${dist}, ${state}`;
    }

    showToast(`✓ Welcome to Fasalmarg, ${name}! Your control center is ready.`);
    navigateTo("dashboard");
  }

  // Ultra-Simple Mobile OTP & Google Login Handlers
  function sendMobileOtp() {
    const phoneInput = document.getElementById("simple-login-phone");
    const phone = phoneInput ? phoneInput.value.trim() : "+91 98224 51092";

    goToOnboardingStep(2);

    const targetPhoneDisplay = document.getElementById("otp-sent-to-phone");
    if (targetPhoneDisplay) targetPhoneDisplay.textContent = phone;

    showToast(`✓ 4-Digit OTP sent to ${phone}! Demo code auto-filled: 9421`);
    if (window.VoiceAssistant) {
      const curLang = window.FasalmargI18n ? window.FasalmargI18n.getLang() : "en";
      const voiceText = {
        en: "OTP has been sent to your mobile phone. Code is 9421.",
        hi: "आपके मोबाइल पर 4 अंकों का OTP भेजा गया है। कोड है 9421.",
        mr: "आपल्या मोबाईलवर ४ अंकी OTP पाठवला आहे. कोड आहे ९४२१."
      }[curLang] || "OTP code is 9421.";
      window.VoiceAssistant.speak(voiceText, curLang);
    }
  }

  function verifyMobileOtp() {
    showToast("✓ OTP Verified! Welcome to Fasalmarg, Ramesh Patel 👋");
    navigateTo("dashboard");
  }

  function loginWithGoogle(role = "farmer") {
    if (role === "buyer") {
      showToast("✓ Signed in with Corporate Google (procurement@abcagrofoods.com)");
      setTimeout(() => {
        navigateTo("buyer-portal");
        updateHeaderRoleBadge("Buyer: ABC Agro");
      }, 350);
    } else if (role === "mandi") {
      showToast("✓ Signed in with Government APMC Google (sec.nashik@agrimark.gov.in)");
      setTimeout(() => {
        navigateTo("mandi-registration");
        updateHeaderRoleBadge("Mandi: Nashik APMC");
      }, 350);
    } else if (role === "fpo") {
      showToast("✓ Signed in with FPO Google (director@nashikvalleyfpo.org)");
      setTimeout(() => {
        switchFedPortalView("fpo");
        navigateTo("federation-portal");
        updateHeaderRoleBadge("FPO: Nashik Agro");
      }, 350);
    } else {
      // Default Farmer
      showToast("✓ Signed in with Google (ramesh.farmer@gmail.com)");
      setTimeout(() => {
        quickFillDemoOnboarding();
        completeOnboarding();
      }, 400);
    }
  }

  function quickDemoBuyerLogin() {
    loginWithGoogle("buyer");
  }

  function quickDemoMandiLogin() {
    loginWithGoogle("mandi");
  }

  function quickDemoFpoLogin() {
    loginWithGoogle("fpo");
  }

  function speakAudio(text) {
    if (window.VoiceAssistant) {
      const curLang = window.FasalmargI18n ? window.FasalmargI18n.getLang() : "en";
      window.VoiceAssistant.speak(text, curLang);
    }
  }

  function switchLoginRole(role) {
    const farmerBox = document.getElementById("login-role-farmer");
    const buyerBox = document.getElementById("login-role-buyer");
    const mandiBox = document.getElementById("login-role-mandi");
    const fpoBox = document.getElementById("login-role-fpo");

    document.querySelectorAll(".login-tab-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`tab-role-${role}`);
    if (activeBtn) activeBtn.classList.add("active");

    if (farmerBox) farmerBox.style.display = role === "farmer" ? "block" : "none";
    if (buyerBox) buyerBox.style.display = role === "buyer" ? "block" : "none";
    if (mandiBox) mandiBox.style.display = role === "mandi" ? "block" : "none";
    if (fpoBox) fpoBox.style.display = role === "fpo" ? "block" : "none";
  }

  // Distress Selling Sensitivity Simulator
  function updateDistressSimulation() {
    const daysSlider = document.getElementById("sim-harvest-days");
    const priceSlider = document.getElementById("sim-mandi-price");
    if (!daysSlider || !priceSlider) return;

    const days = parseInt(daysSlider.value);
    const price = parseInt(priceSlider.value);

    const daysVal = document.getElementById("sim-days-val");
    const priceVal = document.getElementById("sim-price-val");
    if (daysVal) daysVal.textContent = `${days} Days`;
    if (priceVal) priceVal.textContent = `₹${price.toLocaleString("en-IN")} / Q`;

    const badge = document.getElementById("distress-risk-badge");
    const scoreEl = document.getElementById("distress-risk-score");
    const card = document.getElementById("distress-risk-card");
    const title = document.getElementById("distress-risk-title");
    const desc = document.getElementById("distress-risk-desc");

    // Dynamic scoring formula
    let score = Math.round(100 - (days * 1.5 + (price / 3500) * 55));
    if (score < 10) score = 10;
    if (score > 95) score = 95;

    if (score >= 60 || (days <= 5 && price < 2300)) {
      // High Risk
      if (badge) {
        badge.className = "badge badge-orange";
        badge.style.background = "#dc2626";
        badge.style.color = "#ffffff";
        badge.textContent = "🔴 High Risk Alert";
      }
      if (scoreEl) {
        scoreEl.style.color = "#dc2626";
        scoreEl.textContent = `Score: ${score} / 100`;
      }
      if (card) card.style.borderLeftColor = "#dc2626";
      if (title) title.textContent = `"Urgent Liquidity Warning: Extreme risk of distress selling below cost!"`;
      if (desc) desc.textContent = `Only ${days} days remain until harvest while mandi rates (₹${price}/Q) are significantly below your cost of production. Immediate intervention required: Do NOT sell to local middlemen! Tap below to draw down 4% KCC advance or lock pooled corporate bids.`;
    } else if (score >= 35) {
      // Medium Risk
      if (badge) {
        badge.className = "badge badge-orange";
        badge.style.background = "#ea580c";
        badge.style.color = "#ffffff";
        badge.textContent = "🟡 Medium Risk Alert";
      }
      if (scoreEl) {
        scoreEl.style.color = "#ea580c";
        scoreEl.textContent = `Score: ${score} / 100`;
      }
      if (card) card.style.borderLeftColor = "var(--accent-orange)";
      if (title) title.textContent = `"Your harvest is approaching while current prices are below the historical average."`;
      if (desc) desc.textContent = `Your harvest is due in ${days} days with spot mandi prices at ₹${price}/Q. Corporate contracts on Fasalmarg currently offer ₹3,050/Q. We recommend locking in a verified buyer or aggregating with neighbors.`;
    } else {
      // Low Risk
      if (badge) {
        badge.className = "badge badge-green";
        badge.style.background = "#16a34a";
        badge.style.color = "#ffffff";
        badge.textContent = "🟢 Low Risk (Safe)";
      }
      if (scoreEl) {
        scoreEl.style.color = "#16a34a";
        scoreEl.textContent = `Score: ${score} / 100`;
      }
      if (card) card.style.borderLeftColor = "#16a34a";
      if (title) title.textContent = `"Market Position Favorable: Farmer has strong bargaining leverage."`;
      if (desc) desc.textContent = `With ${days} days cushion and strong market demand (₹${price}/Q), you are not under distress pressure. You can comfortably hold for peak corporate contract pricing.`;
    }
  }

  // Quality Scanner Sample & Photo Upload
  function selectScanSample(crop) {
    document.querySelectorAll("[id^='btn-crop-sample-']").forEach(b => b.classList.remove("active"));
    const btn = document.getElementById(`btn-crop-sample-${crop.toLowerCase()}`);
    if (btn) btn.classList.add("active");

    const scanStatus = document.getElementById("scanner-status-text");
    if (scanStatus) scanStatus.textContent = `Selected ${crop} sample. Ready to scan.`;

    simulateCropAnalysis(crop);
  }

  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      const img = document.getElementById("scanner-target-img");
      if (img) img.src = evt.target.result;
      simulateCropAnalysis();
    };
    reader.readAsDataURL(file);
    showToast(`✓ Photo ${file.name} loaded into AI assay viewfinder.`);
  }

  // =========================================================================
  // SECTION 19, 20, 21, 22 FUNCTIONS
  // =========================================================================

  // Portal Switcher Handler
  function handlePortalSelect(portalKey) {
    if (portalKey === "onboarding") navigateTo("onboarding");
    else if (portalKey === "landing") navigateTo("landing");
    else if (portalKey === "dashboard") navigateTo("dashboard");
    else if (portalKey === "buyer-portal") navigateTo("buyer-portal");
    else if (portalKey === "mandi-registration") navigateTo("mandi-registration");
    else if (portalKey === "federation-portal") navigateTo("federation-portal");
    else if (portalKey === "customer-care") navigateTo("customer-care-portal");
  }

  // Section 20: Federation Portal Switcher (Apex vs FPO Desk)
  function switchFedPortalView(viewType) {
    const btnApex = document.getElementById("btn-fed-role-apex");
    const btnFpo = document.getElementById("btn-fed-role-fpo");
    const title = document.getElementById("fed-view-title");
    const roleLabel = document.getElementById("fed-sidebar-role-label");
    const userName = document.getElementById("fed-user-name");
    const userRole = document.getElementById("fed-user-role");

    if (viewType === "fpo") {
      if (btnApex) btnApex.className = "btn btn-sm btn-secondary";
      if (btnFpo) btnFpo.className = "btn btn-sm btn-primary";
      if (title) title.textContent = "🏢 Nashik Agro Producers Ltd. — FPO Management Desk";
      if (roleLabel) roleLabel.textContent = "FPO ADMIN DESK";
      if (userName) userName.textContent = "Sanjay Jadhav";
      if (userRole) userRole.textContent = "FPO Managing Director";

      // Update KPI numbers for FPO scope
      const k1 = document.getElementById("kpi-fed-fpos"); if (k1) k1.textContent = "1 (Local)";
      const k2 = document.getElementById("kpi-fed-farmers"); if (k2) k2.textContent = "128";
      const k3 = document.getElementById("kpi-fed-volume"); if (k3) k3.textContent = "1,450 Q";
      const k4 = document.getElementById("kpi-fed-value"); if (k4) k4.textContent = "₹44.2 L";
      const k5 = document.getElementById("kpi-fed-grievances"); if (k5) k5.textContent = "1 Open";

      // Switch to Aggregated Lots tab directly
      switchFedTab("aggregated-lots");
      showToast("Switched to FPO Admin Desk: Nashik Agro Producers Ltd.");
    } else {
      if (btnApex) btnApex.className = "btn btn-sm btn-primary";
      if (btnFpo) btnFpo.className = "btn btn-sm btn-secondary";
      if (title) title.textContent = "Maharashtra State Agri Federation — Executive Dashboard";
      if (roleLabel) roleLabel.textContent = "FEDERATION DESK";
      if (userName) userName.textContent = "Dr. A. K. Patil";
      if (userRole) userRole.textContent = "Apex Federation Admin";

      // Restore Apex KPI numbers
      const k1 = document.getElementById("kpi-fed-fpos"); if (k1) k1.textContent = "24";
      const k2 = document.getElementById("kpi-fed-farmers"); if (k2) k2.textContent = "8,420";
      const k3 = document.getElementById("kpi-fed-volume"); if (k3) k3.textContent = "12,400 Q";
      const k4 = document.getElementById("kpi-fed-value"); if (k4) k4.textContent = "₹3.4 Cr";
      const k5 = document.getElementById("kpi-fed-grievances"); if (k5) k5.textContent = "6";

      switchFedTab("affiliated-fpos");
      showToast("Switched to Apex Federation Admin Desk.");
    }
  }

  function switchFedTab(tabId, el) {
    document.querySelectorAll(".fed-tab-content").forEach(tc => tc.style.display = "none");
    const target = document.getElementById(`fed-tab-${tabId}`);
    if (target) target.style.display = "block";

    if (el) {
      document.querySelectorAll("#fed-sidebar-nav .portal-nav-item").forEach(item => item.classList.remove("active"));
      el.classList.add("active");
    }
  }

  function openRoleMatrixModal() {
    openModal("role-matrix-modal");
  }

  function openFpoOnboardingModal() {
    openModal("fpo-onboarding-modal");
  }

  function submitFpoOnboarding(e) {
    e.preventDefault();
    closeModal("fpo-onboarding-modal");
    showToast("✓ FPO Onboarding Complete! Nashik Agro Producers Ltd. verified and linked to Maharashtra State Federation.");
  }

  function verifyFpoAction(btn) {
    btn.parentElement.innerHTML = '<span class="badge badge-green">🟢 Verified FPO</span>';
    showToast("✓ FPO verified & endorsed by Federation!");
  }

  function promoteGroupToFpoLot(groupName, qty) {
    showToast(`✓ "${groupName}" (${qty} Q) successfully promoted to Official FPO-Managed Master Lot!`);
    navigateTo("federation-portal");
    switchFedPortalView("fpo");
    switchFedTab("aggregated-lots");
  }

  // Section 19: Supply Aggregation Modals
  function joinAggregationGroupModal() {
    showToast("✓ Ramesh Patel's 20 Quintals Tomato successfully added to Nashik Tomato Growers Pool!");
  }

  function createNewAggregationGroupModal() {
    showToast("Created new aggregation pool for Dindori cluster. Nearby farmers notified via SMS!");
  }

  // Section 21: Grievance & Complaints Functions
  let isVoiceRecordingGrievance = false;

  function toggleVoiceGrievanceRecording() {
    const btn = document.getElementById("btn-grievance-voice-rec");
    const lbl = document.getElementById("voice-rec-label");
    const textarea = document.getElementById("grievance-description-input");

    if (!isVoiceRecordingGrievance) {
      isVoiceRecordingGrievance = true;
      if (btn) btn.classList.add("recording");
      if (lbl) lbl.textContent = "Listening... Tap to Stop";
      showToast("🎤 Recording voice complaint in Marathi / Hindi...");

      setTimeout(() => {
        if (isVoiceRecordingGrievance) {
          isVoiceRecordingGrievance = false;
          if (btn) btn.classList.remove("recording");
          if (lbl) lbl.textContent = "Voice Note Attached ✓";
          if (textarea) {
            textarea.value = "[Voice Recording 0:42s in Marathi] \"ABC Agro ने 20 क्विंटल माल घेतला, पण SBI खात्यात ₹61,000 अद्याप जमा झाले नाहीत.\" (Auto-translated to English: Buyer ABC Agro collected 20Q produce, but ₹61,000 has not been deposited in SBI account.)";
          }
          showToast("✓ Voice note recorded and transcribed into description!");
        }
      }, 3500);
    } else {
      isVoiceRecordingGrievance = false;
      if (btn) btn.classList.remove("recording");
      if (lbl) lbl.textContent = "Record Voice Note";
    }
  }

  function prefillGrievance(type) {
    const cat = document.getElementById("grievance-category-select");
    const ord = document.getElementById("grievance-order-id");
    const desc = document.getElementById("grievance-description-input");

    if (type === "order") {
      if (cat) cat.value = "payment";
      if (ord) ord.value = "ORD-8941";
      if (desc) desc.value = "Payment delay on Order #ORD-8941 for 20 Quintals Tomato delivered to ABC Agro Foods.";
    } else if (type === "payment") {
      if (cat) cat.value = "payment";
      if (ord) ord.value = "TXN-UPI-9014";
      if (desc) desc.value = "Escrow release status shows pending past 48 hours for Bank Account ending 4109.";
    } else if (type === "finance") {
      if (cat) cat.value = "finance";
      if (ord) ord.value = "KCC-APP-9041";
      if (desc) desc.value = "Kisan Credit Card (KCC) loan application under review for 5 days. Request expedited field inspection.";
    } else if (type === "quality") {
      if (cat) cat.value = "quality";
      if (ord) ord.value = "ORD-8941";
      if (desc) desc.value = "Dispute over tomato firmness assay reduction from Grade A to Grade B at buyer destination.";
    }
    showToast(`Form pre-filled for ${type} issue.`);
  }

  function submitGrievanceForm(e) {
    e.preventDefault();
    const ticketId = "MRK-CMP-" + Math.floor(100000 + Math.random() * 900000);
    showToast(`✓ Ticket Raised! ID: ${ticketId}. Response guaranteed within 24 hours.`);

    const statusBadge = document.getElementById("farmer-ticket-status-badge");
    if (statusBadge) {
      statusBadge.textContent = "🟡 Submitted (" + ticketId + ")";
      statusBadge.className = "badge badge-orange";
    }

    // Scroll to tracking section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function escalateFarmerTicket(ticketId) {
    showToast(`⚡ Ticket ${ticketId} escalated to Level 2 (Customer Care Team Lead) under urgent SLA!`);
    const statusBadge = document.getElementById("farmer-ticket-status-badge");
    if (statusBadge) {
      statusBadge.textContent = "🟠 Escalated (Level 2)";
      statusBadge.className = "badge badge-orange";
    }
  }

  function lookupPublicTicket() {
    const input = document.getElementById("public-ticket-search-input");
    const val = (input ? input.value : "").trim();
    const resultBox = document.getElementById("public-ticket-result-box");

    if (!val) {
      showToast("Please enter a Ticket ID (e.g. MRK-CMP-238491)");
      return;
    }

    if (resultBox) {
      resultBox.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
          <strong style="color: var(--green-dark);">Ticket #${val}</strong>
          <span class="badge badge-purple">🟣 Assigned to Agent</span>
        </div>
        <div style="color: var(--text-body);"><strong>Agent:</strong> Priya (Customer Care Lead) · <strong>SLA Timer:</strong> 18h Left</div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.25rem;">
          "Buyer bank transfer delayed, active escrow escalation in progress with Razorpay Agri Desk."
        </div>
      `;
    }
    showToast(`✓ Found active ticket ${val}. SLA status displayed.`);
  }

  // Section 21.4: Agent Workdesk Handlers
  function filterAgentTickets() {
    const search = (document.getElementById("agent-ticket-search")?.value || "").toLowerCase();
    const prio = document.getElementById("agent-filter-priority")?.value || "all";
    const cat = document.getElementById("agent-filter-category")?.value || "all";

    const rows = document.querySelectorAll("#agent-tickets-tbody tr");
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesPrio = prio === "all" || text.includes(prio);
      const matchesCat = cat === "all" || text.includes(cat);

      row.style.display = (matchesSearch && matchesPrio && matchesCat) ? "" : "none";
    });
  }

  function selectAgentTicket(ticketId) {
    const detailId = document.getElementById("detail-ticket-id");
    if (detailId) detailId.textContent = ticketId;
    showToast(`Loaded ticket ${ticketId} into agent resolution console.`);
  }

  function clickToCallFarmer(tel) {
    showToast(`📞 Connecting outbound telephony bridge to Ramesh Patel (${tel})... IVR Language: Marathi.`);
  }

  function autoTranslateGrievance() {
    const textEl = document.getElementById("agent-response-text");
    if (textEl) {
      if (textEl.value.includes("Namaste Ramesh ji")) {
        textEl.value = "नमस्ते रमेश जी. आम्ही रेझरपे एस्क्रो डेस्कशी पडताळणी केली आहे. तुमच्या SBI खात्यात (शेवटचे 4109) जमा होणारी ₹61,000 ची रक्कम प्रक्रियाधीन असून UTR SBIN0091827 अंतर्गत 2 तासांत जमा होईल.";
        showToast("🌐 Translated to Marathi for farmer callback/SMS!");
      } else {
        textEl.value = "Namaste Ramesh ji. We verified with Razorpay Escrow desk. The ₹61,000 transfer to your SBI account ending 4109 was queued and is clearing now under UTR SBIN0091827. Expect credit notification within 2 hours.";
        showToast("🌐 Translated back to English!");
      }
    }
  }

  function applyCannedResponse() {
    const textEl = document.getElementById("agent-response-text");
    if (textEl) {
      textEl.value = "Dear Ramesh ji, your escrow dispute #MRK-CMP-238491 has been verified with ABC Agro Foods. The full balance of ₹61,000 has been initiated directly to your bank account with UTR SBIN0091827.";
      showToast("Template inserted into response.");
    }
  }

  function escalateToLevel2() {
    showToast("⚡ Ticket escalated to Level 2 (Customer Care Team Lead)!");
  }

  function resolveAgentTicket(ticketId) {
    showToast(`✓ Ticket ${ticketId} marked as RESOLVED! Notification sent to farmer via SMS, WhatsApp and App.`);
    const row = document.querySelector("#agent-tickets-tbody tr");
    if (row) {
      row.style.background = "#dcfce7";
      const statusPill = row.querySelector(".badge");
      if (statusPill) {
        statusPill.className = "badge badge-green";
        statusPill.textContent = "🟢 Resolved";
      }
    }
  }

  return {
    init,
    navigateTo,
    renderPriceChart,
    handleAddNewCropSubmit,
    openSendOfferModal,
    handleSendOfferSubmit,
    openAgreementModal,
    acceptAgreement,
    downloadAgreementReceipt,
    openOrderTrackingModal,
    openPaymentSimulation,
    completeRazorpaySimulation,
    simulateCropAnalysis,
    openEditCropModal,
    listCropForSale,
    viewBuyerProfile,
    requestPickupDispatch,
    openModal,
    closeModal,
    showToast,
    goToOnboardingStep,
    selectOnboardingChip,
    selectFarmSize,
    quickFillDemoOnboarding,
    completeOnboarding,
    sendMobileOtp,
    verifyMobileOtp,
    loginWithGoogle,
    quickDemoBuyerLogin,
    quickDemoMandiLogin,
    quickDemoFpoLogin,
    speakAudio,
    switchLoginRole,
    updateDistressSimulation,
    selectScanSample,
    handlePhotoUpload,
    renderKaggleExplorer,
    filterKaggleDataset,
    refreshKaggleLiveTick,
    downloadKaggleCSV,
    handlePortalSelect,
    switchFedPortalView,
    switchFedTab,
    openRoleMatrixModal,
    openFpoOnboardingModal,
    submitFpoOnboarding,
    verifyFpoAction,
    promoteGroupToFpoLot,
    joinAggregationGroupModal,
    createNewAggregationGroupModal,
    toggleVoiceGrievanceRecording,
    prefillGrievance,
    submitGrievanceForm,
    escalateFarmerTicket,
    lookupPublicTicket,
    filterAgentTickets,
    selectAgentTicket,
    clickToCallFarmer,
    autoTranslateGrievance,
    applyCannedResponse,
    escalateToLevel2,
    resolveAgentTicket
  };
})();

// Launch application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.FasalmargApp.init();
});


// Backward compatibility alias
window.MerakiApp = window.FasalmargApp;
