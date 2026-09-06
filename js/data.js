// Fasalmarg Unified Agriculture Data Store
// Comprehensive Indian agricultural records, mandi prices, buyers, logistics, finance schemes & orders

window.FasalmargData = {
  // Current Farmer Profile (Ramesh Patel)
  farmer: {
    id: "FMR-MH-2024-8841",
    name: "Ramesh Patel",
    nameRegional: "रमेश पटेल",
    phone: "+91 98224 51092",
    state: "Maharashtra",
    district: "Nashik",
    village: "Dindori",
    farmSizeAcres: 4.5,
    soilType: "Black Cotton Soil",
    irrigation: "Drip Irrigation & Well",
    kycStatus: "VERIFIED",
    aadhaarLinked: true,
    pmKisanId: "MH9823481",
    kccCardNumber: "KCC-SBI-6632-XXXX",
    bankAccount: "State Bank of India — A/C ending in 4109",
    upiId: "ramesh.farmer@oksbi",
    trustScore: 98.4,
    successfulDeliveries: 24,
    rating: 4.9
  },

  // Active Crops in Ramesh's Farm
  myCrops: [
    {
      id: "CROP-001",
      name: "Tomato",
      variety: "Abhinav Hybrid (Table & Processing)",
      icon: "🍅",
      quantityQuintals: 20,
      qualityGrade: "Grade A",
      harvestDate: "15 Oct 2026",
      location: "Dindori, Nashik",
      minPricePerQuintal: 2500,
      currentMarketPrice: 2850,
      bestBuyerOffer: 3050,
      status: "Ready for Pickup",
      listedForSale: true,
      image: "assets/hero-banner.jpg",
      qualityMetrics: {
        colorScore: 96,
        sizeScore: 94,
        freshness: 98,
        defects: 0
      }
    },
    {
      id: "CROP-002",
      name: "Onion",
      variety: "Nashik Red (Garwa)",
      icon: "🧅",
      quantityQuintals: 35,
      qualityGrade: "Grade A",
      harvestDate: "28 Oct 2026",
      location: "Dindori, Nashik",
      minPricePerQuintal: 2200,
      currentMarketPrice: 2400,
      bestBuyerOffer: 2550,
      status: "Harvest in 2 Weeks",
      listedForSale: true,
      image: "assets/hero-banner.jpg",
      qualityMetrics: {
        colorScore: 92,
        sizeScore: 90,
        freshness: 95,
        defects: 1
      }
    },
    {
      id: "CROP-003",
      name: "Potato",
      variety: "Kufri Jyoti",
      icon: "🥔",
      quantityQuintals: 50,
      qualityGrade: "Grade B+",
      harvestDate: "10 Nov 2026",
      location: "Dindori, Nashik",
      minPricePerQuintal: 1750,
      currentMarketPrice: 1900,
      bestBuyerOffer: 1950,
      status: "Growing / Pre-Harvest",
      listedForSale: false,
      image: "assets/hero-banner.jpg",
      qualityMetrics: {
        colorScore: 88,
        sizeScore: 86,
        freshness: 92,
        defects: 2
      }
    }
  ],

  // Today's Live Market Ticker & Mandi Benchmarks
  mandiPrices: [
    { crop: "Tomato", mandi: "Nashik APMC", price: 2850, trend: "up", change: "+₹220", unit: "₹/Q" },
    { crop: "Onion", mandi: "Lasalgaon Mandi", price: 2400, trend: "stable", change: "₹0", unit: "₹/Q" },
    { crop: "Potato", mandi: "Pune APMC", price: 1900, trend: "up", change: "+₹80", unit: "₹/Q" },
    { crop: "Wheat", mandi: "Indore Mandi", price: 2650, trend: "up", change: "+₹45", unit: "₹/Q" },
    { crop: "Soybean", mandi: "Nagpur APMC", price: 4750, trend: "down", change: "-₹60", unit: "₹/Q" },
    { crop: "Cotton", mandi: "Rajkot APMC", price: 7200, trend: "up", change: "+₹150", unit: "₹/Q" }
  ],

  // High Buyer Demand Feed
  buyerDemands: [
    {
      crop: "Tomato",
      badge: "🔥 HIGH DEMAND",
      growth: "+24%",
      requiredQuintals: 500,
      avgOfferPrice: 3000,
      location: "Maharashtra & Gujarat",
      urgency: "Immediate Pickup",
      topBuyers: ["ABC Agro Foods", "Sahyadri Farms FPC", "Reliance Retail"]
    },
    {
      crop: "Onion",
      badge: "⚡ FAST MOVING",
      growth: "+18%",
      requiredQuintals: 1200,
      avgOfferPrice: 2500,
      location: "Nashik & Mumbai",
      urgency: "Next 5 Days",
      topBuyers: ["BigBasket Wholesale", "ITC Agri-Business"]
    },
    {
      crop: "Soybean",
      badge: "📈 RISING DEMAND",
      growth: "+12%",
      requiredQuintals: 800,
      avgOfferPrice: 4850,
      location: "Vidarbha & MP",
      urgency: "Next 10 Days",
      topBuyers: ["Adani Wilmar", "Ruchi Soya"]
    }
  ],

  // Verified Institutional Buyers
  buyers: [
    {
      id: "BUYER-001",
      name: "ABC Agro Foods Pvt Ltd",
      verified: true,
      lookingFor: "Tomato",
      quantityRequired: 100,
      offerRange: "₹2,800 – ₹3,100/Q",
      bestOffer: 3050,
      location: "Nagpur, Maharashtra",
      deliveryDate: "16-18 Oct 2026",
      paymentTerms: "100% Escrow Hold, Instant Settlement upon delivery",
      gstin: "27AABCA1234F1Z8",
      fssaiLicense: "10019022009876",
      reputationScore: 4.9,
      tradesCompleted: 340,
      distanceKm: 420
    },
    {
      id: "BUYER-002",
      name: "Sahyadri Farmers Producer Co.",
      verified: true,
      lookingFor: "Tomato",
      quantityRequired: 150,
      offerRange: "₹2,900 – ₹3,080/Q",
      bestOffer: 3020,
      location: "Mohadi, Nashik",
      deliveryDate: "15-17 Oct 2026",
      paymentTerms: "Direct Bank Transfer within 12 hours",
      gstin: "27AAACS4590K1ZP",
      fssaiLicense: "10018022008432",
      reputationScore: 4.95,
      tradesCompleted: 890,
      distanceKm: 28
    },
    {
      id: "BUYER-003",
      name: "Reliance Fresh Distribution Hub",
      verified: true,
      lookingFor: "Tomato",
      quantityRequired: 200,
      offerRange: "₹2,850 – ₹3,000/Q",
      bestOffer: 2980,
      location: "Bhiwandi, Thane",
      deliveryDate: "18 Oct 2026",
      paymentTerms: "T+1 Settlement via Fasalmarg Escrow",
      gstin: "27AAACR7145P1ZX",
      fssaiLicense: "10014022003112",
      reputationScore: 4.8,
      tradesCompleted: 1250,
      distanceKm: 145
    },
    {
      id: "BUYER-004",
      name: "ITC Agri-Business Division",
      verified: true,
      lookingFor: "Onion",
      quantityRequired: 300,
      offerRange: "₹2,350 – ₹2,550/Q",
      bestOffer: 2520,
      location: "Pune, Maharashtra",
      deliveryDate: "30 Oct 2026",
      paymentTerms: "Direct Escrow Settlement",
      gstin: "27AAACI1029D1Z4",
      fssaiLicense: "10012022001456",
      reputationScore: 4.9,
      tradesCompleted: 620,
      distanceKm: 210
    },
    {
      id: "BUYER-005",
      name: "BigBasket Wholesale Hub",
      verified: true,
      lookingFor: "Potato",
      quantityRequired: 250,
      offerRange: "₹1,850 – ₹2,000/Q",
      bestOffer: 1950,
      location: "Mumbai Central Yard",
      deliveryDate: "12 Nov 2026",
      paymentTerms: "Instant UPI Settlement",
      gstin: "27AAACB9021N1ZM",
      fssaiLicense: "10016022005921",
      reputationScore: 4.75,
      tradesCompleted: 780,
      distanceKm: 165
    }
  ],

  // AI Smart Matching Engine Results
  smartMatches: [
    {
      buyer: "ABC Agro Foods Pvt Ltd",
      matchScore: 95,
      crop: "Tomato",
      quantity: "20 Quintals matched (of 100 Q demand)",
      offerPrice: 3050,
      location: "Nagpur, Maharashtra",
      factors: [
        { label: "Same crop & hybrid variety (Abhinav)", matched: true },
        { label: "Required quantity matches your 20 Q harvest", matched: true },
        { label: "Competitive price (₹200 above Mandi modal)", matched: true },
        { label: "Verified logistics route available", matched: true },
        { label: "Delivery timeline aligns with 15 Oct harvest", matched: true }
      ]
    },
    {
      buyer: "Sahyadri Farmers Producer Co.",
      matchScore: 92,
      crop: "Tomato",
      quantity: "20 Quintals matched",
      offerPrice: 3020,
      location: "Mohadi, Nashik (28 km away)",
      factors: [
        { label: "Local cooperative pickup at farmgate", matched: true },
        { label: "Zero middleman brokerage fee", matched: true },
        { label: "Same day assay and weighing", matched: true },
        { label: "Price slightly below ABC Foods offer", matched: false }
      ]
    },
    {
      buyer: "Reliance Fresh Distribution Hub",
      matchScore: 87,
      crop: "Tomato",
      quantity: "20 Quintals matched",
      offerPrice: 2980,
      location: "Bhiwandi, Thane",
      factors: [
        { label: "Bulk buyer with weekly recurring orders", matched: true },
        { label: "Cold chain truck pickup guaranteed", matched: true },
        { label: "Requires 2 days extended delivery window", matched: false }
      ]
    },
    {
      buyer: "Deccan Food Processors",
      matchScore: 81,
      crop: "Tomato",
      quantity: "20 Quintals matched",
      offerPrice: 2900,
      location: "Aurangabad",
      factors: [
        { label: "Accepts both Grade A and Grade B produce", matched: true },
        { label: "Standard 48-hour payment cycle", matched: true },
        { label: "Offer price ₹150 lower than top match", matched: false }
      ]
    }
  ],

  // Orders across all 7 Lifecycle Stages
  orders: [
    {
      id: "ORD-9481",
      crop: "Tomato",
      buyer: "ABC Agro Foods",
      quantity: 20,
      pricePerQ: 3050,
      totalAmount: 61000,
      escrowHold: 61000,
      deliveryDate: "16 Oct 2026",
      status: "Ready for Pickup",
      statusCode: 4, // 1: Offer Received, 2: Confirmed, 3: Quality Verification, 4: Ready for Pickup, 5: In Transit, 6: Delivered, 7: Payment Settled
      statusBadge: "🟠 Ready for Pickup",
      pickupAddress: "Plot 14, Gat No. 218, Dindori, Nashik",
      deliveryAddress: "ABC Agro Processing Unit 2, MIDC Butibori, Nagpur",
      transportPartner: "Kisan Rath Fleet",
      vehicleNumber: "MH-15-EG-4820",
      driverName: "Dnyaneshwar Shinde",
      driverPhone: "+91 94231 88401",
      agreementAccepted: true
    },
    {
      id: "ORD-9210",
      crop: "Onion",
      buyer: "ITC Agri-Business",
      quantity: 35,
      pricePerQ: 2520,
      totalAmount: 88200,
      escrowHold: 88200,
      deliveryDate: "30 Oct 2026",
      status: "Quality Verification",
      statusCode: 3,
      statusBadge: "🟣 Quality Verification",
      pickupAddress: "Plot 14, Gat No. 218, Dindori, Nashik",
      deliveryAddress: "ITC Hub, Chakan, Pune",
      transportPartner: "AgriLogix Transport",
      agreementAccepted: true
    },
    {
      id: "ORD-8802",
      crop: "Potato",
      buyer: "BigBasket Wholesale Hub",
      quantity: 50,
      pricePerQ: 1950,
      totalAmount: 97500,
      escrowHold: 97500,
      deliveryDate: "12 Nov 2026",
      status: "Confirmed",
      statusCode: 2,
      statusBadge: "🔵 Confirmed",
      pickupAddress: "Plot 14, Gat No. 218, Dindori, Nashik",
      deliveryAddress: "BigBasket Central Yard, Navi Mumbai",
      transportPartner: "Assigned upon harvest",
      agreementAccepted: true
    },
    {
      id: "ORD-8511",
      crop: "Pomegranate",
      buyer: "FreshTrop Fruits India",
      quantity: 15,
      pricePerQ: 7800,
      totalAmount: 117000,
      escrowHold: 117000,
      deliveryDate: "05 Oct 2026",
      status: "In Transit",
      statusCode: 5,
      statusBadge: "🚚 In Transit",
      pickupAddress: "Plot 14, Dindori",
      deliveryAddress: "JNPT Port Cold Storage, Navi Mumbai",
      transportPartner: "Gramin Cold Chain Express",
      vehicleNumber: "MH-12-RN-9012",
      agreementAccepted: true
    },
    {
      id: "ORD-7992",
      crop: "Grapes (Thompson Seedless)",
      buyer: "Mahagrapes Export Consortium",
      quantity: 25,
      pricePerQ: 7380,
      totalAmount: 184500,
      escrowHold: 0,
      deliveryDate: "14 Sep 2026",
      status: "Payment Settled",
      statusCode: 7,
      statusBadge: "💰 Payment Settled",
      pickupAddress: "Plot 14, Dindori",
      deliveryAddress: "Mahagrapes Export Facility, Nashik",
      settledDate: "15 Sep 2026",
      utrNumber: "SBI-UTR-891048291047",
      agreementAccepted: true
    }
  ],

  // Digital Trade Agreement Template (for Tomato ORD-9481)
  tradeAgreement: {
    agreementNumber: "MRA-2026-MH-9481",
    date: "06 October 2026",
    farmer: {
      name: "Ramesh Patel",
      phone: "+91 98224 51092",
      address: "Gat No. 218, Village Dindori, District Nashik, Maharashtra",
      aadhaarLast4: "8841",
      bankAccount: "State Bank of India — A/C ending 4109"
    },
    buyer: {
      name: "ABC Agro Foods Pvt Ltd",
      authorizedSignatory: "Sanjay Deshmukh (Procurement Head)",
      gstin: "27AABCA1234F1Z8",
      fssai: "10019022009876",
      address: "MIDC Butibori Industrial Zone, Nagpur, Maharashtra"
    },
    cropDetails: {
      crop: "Tomato (Abhinav Hybrid)",
      quantity: "20 Quintals (2,000 kg)",
      grade: "Grade A (Certified via Fasalmarg Optical Assay)",
      unitPrice: "₹3,050 per Quintal",
      grossAmount: "₹61,000",
      fasalmargPlatformFacilitationFee: "₹0 (Subsidized for Farmer)",
      netPayableToFarmer: "₹61,000"
    },
    logisticsAndTerms: {
      pickupLocation: "Farm Gate, Dindori, Nashik",
      deliveryLocation: "ABC Agro Processing Unit 2, Butibori, Nagpur",
      deliveryDate: "16 October 2026",
      transportPaidBy: "Buyer (ABC Agro Foods)",
      paymentTerms: "100% funds locked in Fasalmarg Escrow. Automated release to Farmer bank account within 24 hours of digital weighbridge receipt."
    }
  },

  // Logistics Options
  logistics: {
    pickup: "Dindori Farm Gate, Nashik",
    delivery: "ABC Agro Foods, MIDC Butibori, Nagpur",
    distanceKm: 420,
    estimatedTransitHours: "9 Hours 30 Mins",
    routeRecommendation: "NH-53 via Dhule & Jalgaon (Smoothest asphalt, minimal vibration for perishable produce)",
    transportPartners: [
      {
        id: "TP-01",
        name: "Kisan Rath National Agri-Fleet",
        vehicleType: "Tata 407 (3.5 Ton) Ventilated",
        capacity: "35 Quintals",
        rating: 4.8,
        estimatedCost: "₹4,200 (Paid by Buyer)",
        status: "Vehicle Assigned (MH-15-EG-4820)",
        driverName: "Dnyaneshwar Shinde",
        driverPhone: "+91 94231 88401",
        isRecommended: true
      },
      {
        id: "TP-02",
        name: "Gramin Express Logistics",
        vehicleType: "Mahindra Bolero Maxi Truck",
        capacity: "25 Quintals",
        rating: 4.7,
        estimatedCost: "₹3,900 (Paid by Buyer)",
        status: "Available on 2 Hours Notice",
        driverName: "Kishore Gaikwad",
        driverPhone: "+91 98902 44102",
        isRecommended: false
      },
      {
        id: "TP-03",
        name: "Sahyadri Agro Reefer Cold Chain",
        vehicleType: "Reefer Temperature Controlled (+8°C)",
        capacity: "50 Quintals",
        rating: 4.95,
        estimatedCost: "₹5,600",
        status: "Available for Premium Shipments",
        driverName: "Sunil Wagh",
        driverPhone: "+91 91580 23419",
        isRecommended: false
      }
    ],
    trackingMilestones: [
      { stage: "Pickup Scheduled", time: "16 Oct, 06:00 AM", done: true },
      { stage: "Vehicle Assigned", time: "16 Oct, 06:30 AM", done: true },
      { stage: "Picked Up & Weighed", time: "16 Oct, 07:15 AM", done: false },
      { stage: "In Transit (GPS Live)", time: "16 Oct, 01:00 PM", done: false },
      { stage: "Delivered & Escrow Settled", time: "16 Oct, 05:30 PM", done: false }
    ]
  },

  // Payments Ledger
  payments: {
    pendingAmount: 56000,
    completedAmount: 184500,
    escrowAccount: "Fasalmarg-ICICI Protected Farmer Escrow",
    transactions: [
      {
        id: "TXN-8819",
        orderId: "ORD-9481",
        crop: "Tomato (20 Qtl)",
        buyer: "ABC Agro Foods",
        amount: 56000,
        type: "Escrow Hold (Delivery Pending)",
        date: "Expected 16 Oct 2026",
        status: "PENDING",
        method: "Direct Bank Transfer (IMPS/NEFT)"
      },
      {
        id: "TXN-7992",
        orderId: "ORD-7992",
        crop: "Grapes (25 Qtl)",
        buyer: "Mahagrapes Export Consortium",
        amount: 184500,
        type: "Final Settlement",
        date: "15 Sep 2026",
        status: "COMPLETED",
        method: "UPI (ramesh.farmer@oksbi)",
        utr: "SBI-UTR-891048291047"
      },
      {
        id: "TXN-6120",
        orderId: "ORD-7104",
        crop: "Onion (40 Qtl)",
        buyer: "Sahyadri Farmers Co.",
        amount: 92000,
        type: "Final Settlement",
        date: "28 Aug 2026",
        status: "COMPLETED",
        method: "Direct Bank Transfer",
        utr: "SBI-UTR-710928419201"
      }
    ]
  },

  // Finance Support & Credit Facility (Facilitator)
  finance: {
    disclaimer: "IMPORTANT: Fasalmarg is a technology facilitator connecting farmers with RBI-regulated financial institutions, state cooperatives, and official government credit schemes. Fasalmarg does not itself act as a lender or deposit-taking entity.",
    schemes: [
      {
        id: "SCH-01",
        title: "Kisan Credit Card (KCC) Subsidized Crop Loan",
        institution: "State Bank of India / NABARD",
        type: "Crop Input Finance",
        interestRate: "4.0% p.a. (with 3% prompt repayment subvention)",
        maxAmount: "₹1,50,000",
        eligibility: "Farmers with verified 7/12 land records & active sowing",
        documents: "Aadhaar Card, Land Record 7/12 & 8A, Sowing Certificate",
        processingTime: "24 - 48 Hours via Jan Samarth Portal",
        preApproved: true
      },
      {
        id: "SCH-02",
        title: "Agriculture Infrastructure Fund (AIF)",
        institution: "Central Government / Public Sector Banks",
        type: "Equipment & Irrigation Finance",
        interestRate: "3.0% Interest Subvention (Net ~6% p.a.)",
        maxAmount: "₹5,00,000",
        eligibility: "Individual farmers, FPOs & SHGs setting up post-harvest infra",
        documents: "Project Quotation, Land ownership, Bank statement 6 months",
        processingTime: "5 - 7 Working Days",
        preApproved: false
      },
      {
        id: "SCH-03",
        title: "Pre-Harvest Working Capital Facility",
        institution: "Maharashtra State Cooperative Bank",
        type: "Working Capital & Harvesting Advance",
        interestRate: "7.5% p.a.",
        maxAmount: "Up to 70% of confirmed corporate trade contract",
        eligibility: "Farmers with active Fasalmarg digital purchase agreements",
        documents: "Fasalmarg Digital Purchase Contract, Aadhaar, Bank Passbook",
        processingTime: "Instant digital sanction within 4 hours",
        preApproved: true
      }
    ],
    currentApplication: {
      id: "KCC-APP-2026-9041",
      scheme: "Kisan Credit Card (KCC) 4% Crop Loan",
      amount: "₹75,000",
      institution: "State Bank of India (Dindori Branch)",
      currentStep: 4, // 1: Eligibility Checked, 2: Documents Submitted, 3: Application Sent, 4: Under Review, 5: Decision, 6: Disbursement
      statusText: "Under Bank Officer Verification",
      timeline: [
        { label: "Eligibility Checked", date: "02 Oct, 10:30 AM", completed: true },
        { label: "Documents Submitted", date: "02 Oct, 11:15 AM", completed: true },
        { label: "Application Sent to SBI", date: "03 Oct, 09:00 AM", completed: true },
        { label: "Under Review by Field Officer", date: "05 Oct, 02:00 PM", completed: true, active: true },
        { label: "Bank Approval Decision", date: "Expected 07 Oct", completed: false },
        { label: "Direct Loan Disbursement", date: "Expected 08 Oct", completed: false }
      ]
    }
  },

  // Distress Selling Risk Diagnostic Engine
  distressRisk: {
    crop: "Tomato",
    riskLevel: "MEDIUM_RISK", // LOW_RISK, MEDIUM_RISK, HIGH_RISK
    riskScore: 48, // 0 - 100
    badge: "🟡 Medium Risk",
    summary: "Your harvest is approaching (9 days remaining) while local mandi modal prices have shown high intra-day volatility.",
    alertMessage: "Harvest date: 15 Oct. If you sell individually at local mandi gate, you risk receiving ₹2,400/Q due to afternoon arrivals glut. However, verified corporate contracts through Fasalmarg currently offer ₹3,050/Q.",
    analysisFactors: [
      { name: "Market Price Trajectory", status: "Volatile (₹2,400 to ₹2,850/Q)" },
      { name: "Harvest Date Proximity", status: "9 Days remaining (High perishability)" },
      { name: "Crop Quantity", status: "20 Quintals (Below full truckload threshold)" },
      { name: "Demand Density", status: "High corporate demand, low local mandi capacity" },
      { name: "Financial Urgency", status: "Moderate working capital requirement" }
    ],
    recommendations: [
      { icon: "🤝", text: "Compare verified buyers on Fasalmarg instead of taking spot mandi gate rates." },
      { icon: "🌾", text: "Pool your 20 Q with neighbors Suresh & Balu to hit the 100 Q corporate bonus bracket (+₹250/Q)." },
      { icon: "🏦", text: "Access the pre-approved 4% KCC advance if urgent cash is required for harvesting labor." },
      { icon: "📊", text: "Lock a forward agreement before peak arrival week begins." }
    ]
  },

  // Supply Aggregation Hub (Pooling with Neighbor Farmers)
  supplyAggregation: {
    poolName: "Dindori Tomato Bulk Aggregation Pool",
    targetCrop: "Tomato (Abhinav)",
    poolTarget: 100, // Quintals
    currentPooled: 75,
    participants: [
      { name: "Ramesh Patel (You)", village: "Dindori", quantity: 20, isUser: true },
      { name: "Suresh Shinde", village: "Dindori (0.8 km)", quantity: 30, isUser: false },
      { name: "Balu Jadhav", village: "Janori (2.1 km)", quantity: 25, isUser: false }
    ],
    individualRate: 2750,
    bulkPooledRate: 3050,
    priceAdvantage: "+₹300 per Quintal (+10.9%)",
    logisticsSavings: "35% freight cost reduction via single shared 10-wheel truckload",
    bonusEarnings: "₹6,000 extra net income for Ramesh's 20 Quintals",
    status: "Open — 25 Quintals needed to complete 100 Q corporate truckload"
  },

  // Mandi Directory for Mandi Registration
  mandis: [
    {
      mandiCode: "MH-NSK-APMC-01",
      name: "Nashik Agricultural Produce Market Committee (APMC)",
      state: "Maharashtra",
      district: "Nashik",
      commodities: ["Tomato", "Onion", "Grapes", "Pomegranate", "Vegetables"],
      dailyArrivalCapacity: "15,000 Quintals",
      eNamIntegrated: true,
      secretaryName: "Dilip Bankar",
      contact: "+91 253 251 2345"
    },
    {
      mandiCode: "MH-LAS-APMC-02",
      name: "Lasalgaon APMC (Asia's Largest Onion Market)",
      state: "Maharashtra",
      district: "Nashik",
      commodities: ["Onion", "Garlic", "Maize"],
      dailyArrivalCapacity: "40,000 Quintals",
      eNamIntegrated: true,
      secretaryName: "Narendra Wadhavane",
      contact: "+91 255 026 6120"
    }
  ]
};

// Backward compatibility alias
window.MerakiData = window.FasalmargData;
