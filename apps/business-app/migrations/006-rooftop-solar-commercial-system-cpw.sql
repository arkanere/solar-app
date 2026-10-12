-- Rooftop Solar Clusters Batch 5: commercial, complete-system, cost-per-watt
-- Run: psql $POSTGRES_URL < 006-rooftop-solar-commercial-system-cpw.sql

BEGIN;

-- 1. CLUSTER: commercial
UPDATE seo_pages SET
  h1 = 'Commercial Rooftop Solar in India: Cost, Benefits & ROI for Businesses (2026)',
  meta_title = 'Commercial Rooftop Solar India: Cost, ROI & Tax Benefits for Business | Solar Vipani',
  meta_description = 'Commercial solar costs ₹45–₹55/watt for 10kW–500kW systems. 40% accelerated depreciation, 25%+ ROI, 3–4 year payback. Guide for factories, offices, and warehouses.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>Commercial rooftop solar systems (10kW–500kW+) cost <strong>₹45–₹55 per watt installed</strong> — 15–25% less per watt than residential due to economies of scale. Businesses benefit from <strong>40% accelerated depreciation</strong> (a tax advantage unavailable to homeowners), commercial electricity tariffs of ₹8–₹14/unit (making savings larger), and payback periods of just <strong>3–4 years</strong>. With 25-year panel life, commercial solar delivers 25–30% annual ROI — outperforming most capital investments.</p>"
    },
    {
      "heading": "Commercial Solar Cost by System Size",
      "body": "<table><thead><tr><th>System Size</th><th>Cost Range</th><th>Cost per Watt</th><th>Typical Application</th></tr></thead><tbody><tr><td>10–25kW</td><td>₹4,50,000–₹13,00,000</td><td>₹45–₹55/W</td><td>Small shops, clinics, offices</td></tr><tr><td>25–50kW</td><td>₹11,00,000–₹25,00,000</td><td>₹42–₹50/W</td><td>Medium offices, showrooms, restaurants</td></tr><tr><td>50–100kW</td><td>₹22,00,000–₹48,00,000</td><td>₹40–₹48/W</td><td>Factories, warehouses, hospitals</td></tr><tr><td>100–500kW</td><td>₹40,00,000–₹2,00,00,000</td><td>₹38–₹45/W</td><td>Large factories, campuses, malls</td></tr></tbody></table><p><strong>Commercial systems do not qualify for PM Surya Ghar subsidy</strong> (residential only). However, the tax benefits and lower per-watt pricing more than compensate.</p><p><a href=\"/in/rooftop-solar/cost/\">Residential cost comparison →</a> · <a href=\"/in/rooftop-solar/cost-per-watt/\">Cost per watt explained →</a></p>"
    },
    {
      "heading": "Tax Benefits: The Commercial Advantage",
      "body": "<p>Businesses get tax advantages unavailable to residential consumers:</p><ul><li><strong>40% Accelerated Depreciation:</strong> Deduct 40% of system cost from taxable income in Year 1. For a ₹50,00,000 system, this means ₹20,00,000 deduction — saving ₹5,00,000–₹6,00,000 in taxes (at 25–30% corporate tax rate).</li><li><strong>GST Input Tax Credit:</strong> Businesses registered under GST can claim input credit on the 13.8% GST paid on the solar system. This effectively reduces cost by ~12%.</li><li><strong>Remaining depreciation:</strong> After the 40% Year 1 claim, the balance is depreciated over subsequent years under normal WDV method.</li></ul><p><strong>Effective cost after tax benefits:</strong> A ₹50,00,000 system effectively costs ₹30,00,000–₹35,00,000 after accelerated depreciation and GST credit — comparable to subsidised residential pricing on a per-watt basis.</p>"
    },
    {
      "heading": "ROI and Payback for Commercial Systems",
      "body": "<p>Commercial electricity tariffs are higher than residential, making solar ROI stronger:</p><table><thead><tr><th>System Size</th><th>Cost</th><th>Annual Savings</th><th>Tax Benefit (Year 1)</th><th>Effective Payback</th></tr></thead><tbody><tr><td>25kW</td><td>₹12,00,000</td><td>₹3,60,000</td><td>₹1,44,000</td><td>~3 years</td></tr><tr><td>50kW</td><td>₹23,00,000</td><td>₹7,20,000</td><td>₹2,76,000</td><td>~2.8 years</td></tr><tr><td>100kW</td><td>₹44,00,000</td><td>₹14,40,000</td><td>₹5,28,000</td><td>~2.7 years</td></tr></tbody></table><p><em>Savings calculated at ₹10/unit commercial tariff, 4.5 peak sun hours. Tax benefit at 30% corporate rate on 40% depreciation.</em></p><p>After payback, 20+ years of near-free electricity directly improves margins. For energy-intensive businesses (cold storage, manufacturing, data centres), solar can reduce operating costs by 15–30%.</p>"
    },
    {
      "heading": "Commercial vs Residential Solar: Key Differences",
      "body": "<table><thead><tr><th>Feature</th><th>Residential (1–10kW)</th><th>Commercial (10–500kW)</th></tr></thead><tbody><tr><td>Cost per watt</td><td>₹55–₹75/W</td><td>₹38–₹55/W</td></tr><tr><td>Government subsidy</td><td>Up to ₹78,000</td><td>None (PM Surya Ghar is residential only)</td></tr><tr><td>Tax benefit</td><td>None</td><td>40% accelerated depreciation + GST credit</td></tr><tr><td>Electricity tariff</td><td>₹4–₹10/unit</td><td>₹8–₹14/unit</td></tr><tr><td>Payback</td><td>3–5 years</td><td>2.5–4 years</td></tr><tr><td>Net metering cap</td><td>Up to 10kW in most states</td><td>Up to sanctioned load (varies by DISCOM)</td></tr><tr><td>Financing</td><td>Solar loans, EMI</td><td>CAPEX, OPEX/PPA, lease</td></tr></tbody></table>"
    },
    {
      "heading": "Financing Models for Commercial Solar",
      "body": "<p>Businesses have multiple financing options beyond outright purchase:</p><ul><li><strong>CAPEX (outright purchase):</strong> You own the system, keep all savings and tax benefits. Best ROI. Requires upfront capital.</li><li><strong>OPEX / PPA (Power Purchase Agreement):</strong> A solar developer installs and owns the system on your roof. You buy power at a fixed rate (₹3–₹5/unit) — lower than grid tariff. No upfront cost, but no depreciation benefit.</li><li><strong>Solar lease:</strong> Fixed monthly rental for the system. Predictable costs, no maintenance responsibility. Less common in India.</li><li><strong>Loan financing:</strong> <a href=\"/in/solar-financing/solar-loan/\">Solar loans</a> at 8–12% interest with EMI structured to be less than current electricity bill savings — cash-flow positive from month one.</li></ul><p>For businesses with taxable profits, CAPEX is typically the best option due to the 40% depreciation benefit. For businesses with limited capital or tax losses, OPEX/PPA provides savings with zero investment.</p>"
    },
    {
      "heading": "System Design for Commercial Rooftops",
      "body": "<p>Commercial installations differ from residential in several ways:</p><ul><li><strong>Three-phase connection:</strong> Standard for commercial. Inverters must be 3-phase compatible (most commercial inverters are).</li><li><strong>Higher voltage strings:</strong> Commercial inverters operate at 600V–1000V DC, allowing longer panel strings and fewer cables.</li><li><strong>Central vs string inverters:</strong> Systems under 100kW typically use multiple string inverters. Above 100kW, central inverters or string inverter arrays are common.</li><li><strong>Structural assessment:</strong> Commercial roofs (RCC, metal sheet, truss) need structural certification for the additional load (15–20 kg/sq m).</li><li><strong>Shadow analysis:</strong> Critical for large arrays. Parapet walls, HVAC units, and cooling towers cause shading. Installers use drone surveys and software modelling.</li><li><strong>Safety systems:</strong> Commercial systems require AC/DC isolators, rapid shutdown (for metal roofs), fire safety compliance, and lightning protection.</li></ul>"
    },
    {
      "heading": "Industries That Benefit Most",
      "body": "<ul><li><strong>Manufacturing:</strong> Factories with large roof areas and daytime-heavy loads. Solar offsets the most expensive commercial tariff units.</li><li><strong>Cold storage and food processing:</strong> Continuous refrigeration loads align with solar generation hours. 50–100kW systems are common.</li><li><strong>IT parks and offices:</strong> Daytime occupancy matches solar generation perfectly. Rooftop or carport mounting.</li><li><strong>Hotels and hospitals:</strong> High tariff consumers with predictable daytime loads. Solar improves ESG metrics for hotels.</li><li><strong>Retail and malls:</strong> Large flat roofs, high AC loads during business hours. PPA models popular.</li><li><strong>Educational institutions:</strong> Schools and colleges with large campuses and daytime usage.</li></ul><p><a href=\"/in/get-quotes/\">Get a commercial solar assessment →</a></p>"
    },
    {
      "heading": "Get Commercial Solar Quotes",
      "body": "<p>Commercial solar requires detailed site assessment — roof structural analysis, shadow mapping, load profiling, and DISCOM coordination. Solar Vipani connects businesses with verified installers experienced in commercial-scale projects across India.</p><p><a href=\"/in/get-quotes/\">Get your free commercial solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is the cost of commercial rooftop solar in India?",
      "answer": "Commercial solar costs ₹38–₹55 per watt installed, depending on system size. A 50kW system costs ₹22,00,000–₹25,00,000. Larger systems (100kW+) get better per-watt pricing. After 40% accelerated depreciation and GST input credit, the effective cost drops by 35–45%."
    },
    {
      "question": "Is there a subsidy for commercial solar?",
      "answer": "No. PM Surya Ghar subsidy is for residential consumers only. However, businesses get 40% accelerated depreciation (saving ₹10–₹12 per watt in taxes) and GST input credit (~12% cost recovery). These tax benefits often exceed the residential subsidy value."
    },
    {
      "question": "What is the payback period for commercial solar?",
      "answer": "2.5–4 years for most businesses, depending on tariff and system size. At ₹10/unit commercial tariff with 40% depreciation benefit, payback is typically under 3 years. After payback, 20+ years of near-free electricity directly improves profit margins."
    },
    {
      "question": "What is accelerated depreciation for solar?",
      "answer": "Businesses can deduct 40% of the solar system cost from taxable income in the first year. For a ₹50 lakh system at 30% tax rate, this saves ₹6 lakh in taxes immediately. The remaining value is depreciated over subsequent years under normal rates."
    },
    {
      "question": "What is a solar PPA for businesses?",
      "answer": "A Power Purchase Agreement (PPA) means a solar developer installs and owns the system on your roof at no cost to you. You buy the generated power at a fixed rate (₹3–₹5/unit) — lower than grid tariff. The developer maintains the system for the contract period (15–25 years)."
    },
    {
      "question": "What size commercial solar system do I need?",
      "answer": "Size based on your average daytime electricity consumption and available roof area. As a rule of thumb, 100 sq ft of roof supports ~1kW. A factory consuming 200 units/day needs approximately a 50kW system. Your installer will do a detailed load analysis and shadow study."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'commercial' AND pillar_slug = 'rooftop-solar';


-- 2. CLUSTER: complete-system
UPDATE seo_pages SET
  h1 = 'Complete Solar System for Home in India: Every Component Explained (2026)',
  meta_title = 'Complete Home Solar System India: All Components & What You Need | Solar Vipani',
  meta_description = 'Everything in a complete home solar system — panels, inverter, mounting, wiring, meter, and protection. Learn what each component does and how they work together.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>A complete home solar system has <strong>six core components</strong>: solar panels, inverter, mounting structure, wiring and protection devices, net meter, and (for off-grid/hybrid) batteries. A typical <a href=\"/in/rooftop-solar/3kw-system/\">3kW on-grid system</a> includes 6 panels, 1 inverter, mounting rails, DC/AC cabling, and a bi-directional meter — all installed in 1–2 days. Total cost: ₹1,50,000–₹1,90,000 before <a href=\"/in/solar-subsidy/pm-surya-ghar/\">subsidy</a>.</p>"
    },
    {
      "heading": "Component 1: Solar Panels",
      "body": "<p>Solar panels are the power generators — they convert sunlight into DC electricity.</p><table><thead><tr><th>Specification</th><th>Typical Value</th></tr></thead><tbody><tr><td>Wattage per panel</td><td>540W (standard residential)</td></tr><tr><td>Technology</td><td><a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline</a> (most common)</td></tr><tr><td>Efficiency</td><td>19–22%</td></tr><tr><td>Dimensions</td><td>~2.3m × 1.1m</td></tr><tr><td>Weight</td><td>~27 kg per panel</td></tr><tr><td>Warranty</td><td>25 years (performance), 10–12 years (product)</td></tr></tbody></table><p><strong>How many panels?</strong> Divide your system size by panel wattage. A 3kW system with 540W panels needs 6 panels. A 5kW system needs 10 panels.</p><p><a href=\"/in/solar-panels/types/\">Compare panel types →</a> · <a href=\"/in/solar-panels/brands/\">Top panel brands →</a></p>"
    },
    {
      "heading": "Component 2: Solar Inverter",
      "body": "<p>The inverter converts DC from panels into 230V AC for your home and manages power flow.</p><table><thead><tr><th>Type</th><th>Function</th><th>Price (3kW)</th></tr></thead><tbody><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid</a></td><td>Grid sync + net metering</td><td>₹25,000–₹35,000</td></tr><tr><td><a href=\"/in/rooftop-solar/off-grid-inverter/\">Off-grid</a></td><td>Battery management + AC output</td><td>₹20,000–₹30,000</td></tr><tr><td><a href=\"/in/rooftop-solar/hybrid-inverter/\">Hybrid</a></td><td>Grid sync + battery + backup</td><td>₹35,000–₹55,000</td></tr></tbody></table><p>The inverter is the brain of the system. It has the shortest lifespan of any component (10–15 years), so brand quality and warranty matter more here than for panels.</p><p><a href=\"/in/rooftop-solar/inverter/\">Full inverter guide →</a></p>"
    },
    {
      "heading": "Component 3: Mounting Structure",
      "body": "<p>The mounting structure secures panels to your roof at the correct angle.</p><ul><li><strong>Material:</strong> Hot-dip galvanised iron (most common) or anodised aluminium (lighter, corrosion-resistant, costs 20–30% more).</li><li><strong>Types:</strong><ul><li><strong>Flush mount</strong> — panels sit flat on an RCC roof with minimal tilt. Simplest and cheapest.</li><li><strong>Elevated tilt</strong> — raises panels 1–2 feet with 10–15° south-facing tilt for optimal annual output.</li><li><strong>Ballasted mount</strong> — weighted frames that sit on the roof without drilling. Used when waterproofing cannot be penetrated.</li></ul></li><li><strong>Cost:</strong> ₹3,000–₹8,000 per kW depending on type and material.</li><li><strong>Lifespan:</strong> 25+ years. Galvanised iron may need anti-rust treatment in coastal areas.</li></ul>"
    },
    {
      "heading": "Component 4: Wiring and Electrical Protection",
      "body": "<p>Electrical components connect everything safely:</p><ul><li><strong>DC solar cables:</strong> UV-resistant, double-insulated cables from panels to inverter. 4mm² for small systems, 6mm² for 5kW+.</li><li><strong>AC cables:</strong> From inverter to distribution board and net meter. Standard electrical cables.</li><li><strong>DC isolator:</strong> A switch between panels and inverter for safe maintenance disconnect.</li><li><strong>AC isolator:</strong> A switch between inverter and the grid connection.</li><li><strong>Surge protection device (SPD):</strong> Protects the inverter from lightning-induced voltage spikes. Critical in lightning-prone areas.</li><li><strong>MCB/MCCB:</strong> Circuit breakers sized for the system capacity.</li><li><strong>Earthing:</strong> Dedicated earth pit with copper earthing strip for panel frames and inverter body. Mandatory safety requirement.</li></ul><p><strong>Cost:</strong> ₹4,000–₹14,000 total depending on system size and cable run length.</p>"
    },
    {
      "heading": "Component 5: Net Meter (On-Grid Systems)",
      "body": "<p>A bi-directional (net) meter replaces your existing electricity meter for <a href=\"/in/rooftop-solar/on-grid/\">on-grid</a> and <a href=\"/in/rooftop-solar/hybrid/\">hybrid</a> systems.</p><ul><li><strong>Function:</strong> Records electricity flowing both ways — import (grid to home) and export (home to grid).</li><li><strong>Supplied by:</strong> Your DISCOM, after the net metering application is approved.</li><li><strong>Cost:</strong> ₹1,500–₹4,000 (paid to DISCOM as part of the application fee). Some states provide the meter free.</li><li><strong>Installation:</strong> DISCOM technician replaces your existing meter. Takes 1–2 hours.</li><li><strong>Timeline:</strong> 2–6 weeks from application to meter installation, depending on your DISCOM backlog.</li></ul><p><a href=\"/in/solar-subsidy/net-metering/\">How net metering works →</a></p>"
    },
    {
      "heading": "Component 6: Batteries (Off-Grid and Hybrid Only)",
      "body": "<p>Batteries are required for <a href=\"/in/rooftop-solar/off-grid/\">off-grid</a> systems and optional for <a href=\"/in/rooftop-solar/hybrid/\">hybrid</a>.</p><table><thead><tr><th>Battery Type</th><th>Cost/kWh</th><th>Lifespan</th><th>Maintenance</th></tr></thead><tbody><tr><td>Lead-acid tubular</td><td>₹6,000–₹8,000</td><td>3–5 years</td><td>Water top-up every 2–3 months</td></tr><tr><td>Gel/AGM</td><td>₹8,000–₹12,000</td><td>4–6 years</td><td>Maintenance-free</td></tr><tr><td>Lithium-ion (LFP)</td><td>₹15,000–₹22,000</td><td>8–12 years</td><td>Maintenance-free</td></tr></tbody></table><p><strong>On-grid systems do not need batteries</strong> — the grid acts as virtual storage through net metering. This is why on-grid is 40–60% cheaper.</p>"
    },
    {
      "heading": "How All Components Work Together",
      "body": "<p>The complete energy flow in a home solar system:</p><ol><li><strong>Sunlight → Panels:</strong> Photovoltaic cells convert light to DC electricity.</li><li><strong>Panels → Inverter (via DC cables):</strong> DC flows through the isolator to the inverter.</li><li><strong>Inverter → Home (via AC cables):</strong> Inverter outputs 230V AC to your distribution board.</li><li><strong>Home → Appliances:</strong> Your switchboard distributes solar AC to all circuits normally.</li><li><strong>Surplus → Grid (via net meter):</strong> Unconsumed power flows out through the bi-directional meter.</li><li><strong>Grid → Home (at night):</strong> When solar is unavailable, the grid supplies power as usual.</li></ol><p>For off-grid: step 5–6 replace with battery charge/discharge cycles. For hybrid: steps 5–6 happen through the battery with grid as secondary backup.</p><p><a href=\"/in/rooftop-solar/how-it-works/\">Detailed working explanation →</a></p>"
    },
    {
      "heading": "Get a Complete System Quote",
      "body": "<p>A properly designed system balances all components for optimal performance. Solar Vipani connects you with verified installers who provide itemised quotes — you see exactly what panels, inverter, and components are included.</p><p><a href=\"/in/get-quotes/\">Get your free complete system quote →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is included in a complete home solar system?",
      "answer": "A complete on-grid system includes solar panels, an on-grid inverter, mounting structure, DC and AC cabling, protection devices (isolators, SPD, MCB), earthing, and a bi-directional net meter. Off-grid and hybrid systems add batteries and a charge controller."
    },
    {
      "question": "How many solar panels do I need for my home?",
      "answer": "Divide your desired system size by panel wattage. With standard 540W panels: 1kW needs 2 panels, 3kW needs 6 panels, 5kW needs 10 panels, 10kW needs 19 panels. Each panel requires about 50 sq ft of roof space."
    },
    {
      "question": "Do I need batteries for a home solar system?",
      "answer": "Not for on-grid systems — the grid acts as virtual storage through net metering. Batteries are mandatory for off-grid systems and optional for hybrid (for power cut backup). Skipping batteries reduces cost by 40–60%."
    },
    {
      "question": "What is the lifespan of each component?",
      "answer": "Solar panels: 25–30 years. Mounting structure: 25+ years. Inverter: 10–15 years (plan for one replacement). Wiring: 25+ years. Lead-acid batteries: 3–5 years. Lithium batteries: 8–12 years. Net meter: 15–20 years (DISCOM property)."
    },
    {
      "question": "Can I buy components separately and install myself?",
      "answer": "Technically possible but not recommended. DIY installations do not qualify for net metering, government subsidy, or manufacturer warranties. DISCOM approval requires installation by an MNRE-empanelled vendor. Professional installation also ensures electrical safety compliance."
    },
    {
      "question": "What maintenance does a complete solar system need?",
      "answer": "On-grid: panel cleaning (monthly water rinse), annual inverter check, and visual cable inspection. Off-grid/hybrid: add battery water top-up (lead-acid every 2–3 months) or no extra maintenance (lithium). Total annual maintenance cost: ₹1,000–₹3,000 for on-grid, ₹5,000–₹8,000 with batteries."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'complete-system' AND pillar_slug = 'rooftop-solar';


-- 3. CLUSTER: cost-per-watt
UPDATE seo_pages SET
  h1 = 'Solar Panel Cost Per Watt in India: How to Compare Quotes (2026)',
  meta_title = 'Solar Cost Per Watt India 2026: Current Rates & Quote Comparison | Solar Vipani',
  meta_description = 'Solar costs ₹38–₹75 per watt in India depending on system size and type. Learn how to calculate cost per watt, what affects it, and how to compare installer quotes.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>The cost per watt (₹/W) is the <strong>single best metric to compare solar quotes</strong>. Current rates in India: <strong>₹55–₹75/W for residential (1–10kW)</strong> and <strong>₹38–₹55/W for commercial (10–500kW)</strong>, before subsidy. A competitive 3kW residential quote at ₹1,80,000 works out to ₹60/W. If another installer quotes ₹2,10,000 for the same size, that is ₹70/W — ask what premium components justify the difference.</p>"
    },
    {
      "heading": "Current Cost Per Watt by System Size",
      "body": "<table><thead><tr><th>System Size</th><th>Total Cost</th><th>Cost Per Watt</th><th>After Subsidy (per watt)</th></tr></thead><tbody><tr><td><a href=\"/in/rooftop-solar/1kw-system/\">1kW</a></td><td>₹60,000–₹80,000</td><td>₹60–₹80/W</td><td>₹30–₹50/W</td></tr><tr><td><a href=\"/in/rooftop-solar/2kw-system/\">2kW</a></td><td>₹1,10,000–₹1,40,000</td><td>₹55–₹70/W</td><td>₹25–₹40/W</td></tr><tr><td><a href=\"/in/rooftop-solar/3kw-system/\">3kW</a></td><td>₹1,50,000–₹1,90,000</td><td>₹50–₹63/W</td><td>₹24–₹37/W</td></tr><tr><td><a href=\"/in/rooftop-solar/5kw-system/\">5kW</a></td><td>₹2,50,000–₹3,20,000</td><td>₹50–₹64/W</td><td>₹34–₹48/W</td></tr><tr><td><a href=\"/in/rooftop-solar/10kw-system/\">10kW</a></td><td>₹5,00,000–₹6,50,000</td><td>₹50–₹65/W</td><td>₹42–₹57/W</td></tr><tr><td><a href=\"/in/rooftop-solar/commercial/\">50kW (commercial)</a></td><td>₹22,00,000–₹25,00,000</td><td>₹44–₹50/W</td><td>N/A (no subsidy)</td></tr><tr><td>100kW (commercial)</td><td>₹40,00,000–₹48,00,000</td><td>₹40–₹48/W</td><td>N/A</td></tr></tbody></table><p><strong>Key insight:</strong> Cost per watt drops as system size increases. A 1kW system at ₹70/W seems expensive, but a 5kW system at ₹55/W delivers better value per watt because fixed costs (inverter, wiring, installation labour) are spread over more capacity.</p>"
    },
    {
      "heading": "How to Calculate Cost Per Watt",
      "body": "<p>The formula is simple:</p><p><strong>Cost per Watt = Total System Price ÷ System Capacity in Watts</strong></p><p>Examples:</p><ul><li>Quote: ₹1,80,000 for 3kW → ₹1,80,000 ÷ 3,000W = <strong>₹60/W</strong></li><li>Quote: ₹3,00,000 for 5kW → ₹3,00,000 ÷ 5,000W = <strong>₹60/W</strong></li><li>Quote: ₹5,50,000 for 10kW → ₹5,50,000 ÷ 10,000W = <strong>₹55/W</strong></li></ul><p><strong>Critical:</strong> Ensure the total price includes GST, net metering fees, and all components. A low ₹/W with excluded costs is misleading. Always compare all-inclusive quotes.</p>"
    },
    {
      "heading": "What Affects Cost Per Watt?",
      "body": "<p>Seven factors drive ₹/W variation:</p><ol><li><strong>System size (biggest factor):</strong> Larger systems have lower ₹/W because fixed costs (inverter, wiring, labour) are amortised over more watts. Going from 1kW to 5kW can drop ₹/W by 15–25%.</li><li><strong>Panel type:</strong> <a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a> (₹22–₹28/W panel cost) vs <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline</a> (₹28–₹35/W) vs <a href=\"/in/solar-panels/bifacial/\">bifacial</a> (₹35–₹45/W).</li><li><strong>Inverter brand:</strong> Budget brands (₹12–₹18/W of system) vs premium (₹18–₹25/W). <a href=\"/in/rooftop-solar/inverter/\">Inverter comparison →</a></li><li><strong>System type:</strong> <a href=\"/in/rooftop-solar/on-grid/\">On-grid</a> is cheapest. <a href=\"/in/rooftop-solar/hybrid/\">Hybrid</a> adds ₹5–₹10/W. <a href=\"/in/rooftop-solar/off-grid/\">Off-grid</a> adds ₹15–₹30/W (batteries).</li><li><strong>Mounting complexity:</strong> Flat RCC roof (standard) vs tiled/sloped roof (₹3–₹5/W extra) vs ground mount (₹5–₹8/W extra).</li><li><strong>Location:</strong> Tier-1 cities have higher labour costs. Remote locations add transport charges.</li><li><strong>GST structure:</strong> Combined system supply at 13.8%. Separate component purchase may attract different rates.</li></ol>"
    },
    {
      "heading": "Cost Per Watt: Panel vs System",
      "body": "<p>An important distinction many buyers miss:</p><table><thead><tr><th>Metric</th><th>What It Includes</th><th>Current Range</th></tr></thead><tbody><tr><td>Panel cost per watt</td><td>Only the solar panel</td><td>₹22–₹45/W</td></tr><tr><td>System cost per watt</td><td>Panels + inverter + mounting + wiring + installation + GST</td><td>₹55–₹75/W (residential)</td></tr></tbody></table><p>When comparing quotes, always use <strong>system cost per watt</strong> (all-inclusive). Panel-only ₹/W is useful when comparing panel brands but misleading for total project cost.</p><p>Panels account for 35–45% of total system cost. The remaining 55–65% is inverter, mounting, wiring, labour, and taxes.</p>"
    },
    {
      "heading": "How ₹/W Has Changed Over Time",
      "body": "<p>Solar costs have declined dramatically:</p><table><thead><tr><th>Year</th><th>System Cost Per Watt</th><th>Decline</th></tr></thead><tbody><tr><td>2010</td><td>₹250–₹300/W</td><td>—</td></tr><tr><td>2015</td><td>₹120–₹150/W</td><td>−55%</td></tr><tr><td>2020</td><td>₹55–₹75/W</td><td>−55%</td></tr><tr><td>2024</td><td>₹50–₹70/W</td><td>−8%</td></tr><tr><td>2026</td><td>₹45–₹65/W</td><td>−7%</td></tr></tbody></table><p>The steepest drops are behind us — panel manufacturing has matured. Future reductions will come from higher-wattage panels (reducing installation labour per watt) and supply chain efficiencies rather than dramatic material cost drops. Waiting for significantly lower prices is unlikely to outweigh the savings lost by delaying installation.</p>"
    },
    {
      "heading": "Red Flags in Low ₹/W Quotes",
      "body": "<p>A suspiciously low cost per watt often hides compromises:</p><ul><li><strong>GST excluded:</strong> Adds 13.8% to the quoted price. Always confirm if the quote is inclusive.</li><li><strong>Net metering fees excluded:</strong> DISCOM application, meter cost, and inspection fees add ₹2,000–₹6,000.</li><li><strong>Unknown panel brands:</strong> Tier-3 panels cost less but may have unreliable warranties and faster degradation.</li><li><strong>Undersized inverter:</strong> A 2.5kW inverter on a 3kW panel array clips peak output to save ₹5,000.</li><li><strong>Minimal wiring and protection:</strong> Skipping surge protection, using thinner cables, or omitting proper earthing.</li><li><strong>No after-sales support:</strong> Cheap installs from unregistered vendors with no warranty follow-through.</li></ul><p><strong>Benchmark:</strong> For a 3kW on-grid system with monocrystalline panels and a quality inverter (Growatt/Goodwe), ₹55–₹65/W all-inclusive is competitive. Below ₹50/W warrants scrutiny. Above ₹70/W, ask what premium justifies the price.</p>"
    },
    {
      "heading": "How to Use ₹/W to Compare Quotes",
      "body": "<p>When you receive 2–3 quotes from installers, follow this process:</p><ol><li><strong>Normalise to ₹/W:</strong> Divide each total by system wattage.</li><li><strong>Confirm scope:</strong> All quotes must include the same items — panels, inverter, mounting, wiring, installation, GST, and net metering.</li><li><strong>Compare panel brands:</strong> A ₹5/W difference may reflect Tier-1 vs Tier-2 panels — worth paying for if the warranty is meaningful.</li><li><strong>Compare inverter brands:</strong> A ₹3–₹5/W premium for Growatt/Goodwe over an unknown brand is justified by reliability and monitoring.</li><li><strong>Check warranty terms:</strong> Lower ₹/W with a 1-year workmanship warranty is riskier than higher ₹/W with 5 years.</li></ol><p><a href=\"/in/get-quotes/\">Get 2–3 comparable quotes from verified installers →</a></p>"
    },
    {
      "heading": "Get Competitive Quotes",
      "body": "<p>Solar Vipani provides 2–3 quotes from verified installers in your city — making ₹/W comparison easy. All quotes follow a standard format so you can compare apples to apples.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is the current solar cost per watt in India?",
      "answer": "For residential on-grid systems: ₹55–₹75 per watt (all-inclusive, before subsidy). After PM Surya Ghar subsidy, effective cost drops to ₹24–₹57/W depending on system size. Commercial systems (10kW+) cost ₹38–₹55/W due to volume pricing."
    },
    {
      "question": "How do I calculate solar cost per watt?",
      "answer": "Divide the total all-inclusive system price by the system capacity in watts. Example: ₹1,80,000 for a 3kW system = ₹1,80,000 ÷ 3,000W = ₹60/W. Always use the total price including GST, net metering fees, and installation — not just panel or equipment cost."
    },
    {
      "question": "Why does cost per watt decrease with larger systems?",
      "answer": "Fixed costs (inverter, wiring, labour, DISCOM fees) are spread over more watts. A 1kW system and a 5kW system need the same net metering application, similar wiring work, and comparable installation time — but the 5kW system generates 5× the power from that shared cost base."
    },
    {
      "question": "Is a lower cost per watt always better?",
      "answer": "Not necessarily. Very low ₹/W may indicate excluded costs (GST, net metering), unknown panel brands, undersized inverter, or poor workmanship. Compare quotes at the same scope and check component brands. For 3kW on-grid, ₹55–₹65/W all-inclusive is competitive; below ₹50/W warrants scrutiny."
    },
    {
      "question": "What is the difference between panel cost per watt and system cost per watt?",
      "answer": "Panel cost per watt (₹22–₹45/W) covers only the solar panel. System cost per watt (₹55–₹75/W) includes panels, inverter, mounting, wiring, installation, and GST. Always use system ₹/W when comparing installer quotes — panel ₹/W alone is misleading."
    },
    {
      "question": "Will solar cost per watt keep dropping?",
      "answer": "Modest declines of 5–8% per year are expected, driven by higher-wattage panels and manufacturing efficiency. The dramatic 80%+ drops of the 2010s are over. Delaying installation to wait for lower prices typically costs more in lost electricity savings than the future price reduction."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'cost-per-watt' AND pillar_slug = 'rooftop-solar';

COMMIT;
