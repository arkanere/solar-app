-- Solar Pumps Content: pillar + 2 cluster pages (price, how-it-works)
-- Run: psql $POSTGRES_URL < 022-solar-pumps-content.sql

BEGIN;

-- 1. PILLAR: solar-pumps
UPDATE seo_pages SET
  h1 = 'Solar Pumps in India: Complete Guide for Farmers & Homeowners',
  meta_title = 'Solar Pumps India: Price, Types & KUSUM Subsidy Guide | Solar Vipani',
  meta_description = 'Everything about solar water pumps — prices from ₹25,000 to ₹4,50,000, types (submersible, surface, BLDC), HP sizes, and KUSUM Yojana subsidies. Compare quotes from verified dealers.',
  content = '[
    {
      "heading": "Why Solar Pumps Are Replacing Diesel and Grid Pumps Across India",
      "body": "<p>India has over 30 million agricultural pump sets, and diesel and erratic grid supply still power most of them. Solar water pumps eliminate fuel costs entirely — once installed, they run on free sunlight for 25 years with near-zero operating expense. The Government of India''s KUSUM Yojana subsidises up to 60% of solar pump costs for farmers, making the switch financially compelling. Solar Vipani connects you with verified solar pump dealers and installers so you can compare quotes and find the right pump for your land or home.</p>"
    },
    {
      "heading": "What Is a Solar Water Pump?",
      "body": "<p>A solar water pump uses photovoltaic (PV) panels to power an electric motor that drives a water pump — no grid connection, no diesel, no recurring fuel bills. The system has three core components:</p><ul><li><strong>Solar panels</strong> — generate DC electricity from sunlight</li><li><strong>Controller/drive</strong> — regulates voltage and protects the motor from voltage fluctuations; in AC systems, it converts DC to AC</li><li><strong>Pump motor</strong> — either a submersible unit placed inside a borewell or a surface-mounted pump for open wells and tanks</li></ul><p>Solar pumps operate during daylight hours. For extended operation, you can add a battery bank or a water storage tank (more common and cost-effective in agriculture). Most farmers size their tank to store a full day''s pumped water for evening and night irrigation.</p>"
    },
    {
      "heading": "Solar Pump Price in India",
      "body": "<p>Solar pump prices range from <strong>₹25,000 for a 0.5 HP DC pump to ₹4,50,000+ for a 10 HP AC submersible system</strong> before subsidy. Under KUSUM Yojana, farmers pay only 10–40% of the total cost depending on their state.</p><table><thead><tr><th>HP Rating</th><th>Price (before subsidy)</th><th>After KUSUM Subsidy</th></tr></thead><tbody><tr><td>1 HP</td><td>₹60,000–₹90,000</td><td>₹18,000–₹36,000</td></tr><tr><td>2 HP</td><td>₹1,00,000–₹1,40,000</td><td>₹30,000–₹56,000</td></tr><tr><td>3 HP</td><td>₹1,40,000–₹1,80,000</td><td>₹42,000–₹72,000</td></tr><tr><td>5 HP</td><td>₹2,00,000–₹2,80,000</td><td>₹60,000–₹1,12,000</td></tr><tr><td>7.5 HP</td><td>₹2,80,000–₹3,60,000</td><td>₹84,000–₹1,44,000</td></tr><tr><td>10 HP</td><td>₹3,50,000–₹4,50,000</td><td>₹1,05,000–₹1,80,000</td></tr></tbody></table><p>→ <a href=\"/in/solar-pumps/price/\">Full guide: Solar Pump Prices — Detailed Breakdown by HP and Type</a></p>"
    },
    {
      "heading": "How Solar Pumps Work",
      "body": "<p>Solar panels generate DC electricity during daylight. A <a href=\"/in/solar-pumps/controller/\">pump controller</a> regulates voltage and current to match motor requirements. In DC pump systems, power goes directly to the motor. In AC systems, the controller includes a variable frequency drive (VFD) that converts DC to three-phase AC.</p><p>Water discharge increases with sunlight intensity — peak pumping happens between 10 AM and 3 PM. On cloudy days, output drops proportionally but the pump still operates at reduced capacity. No batteries are needed; most agricultural setups use overhead tanks or farm ponds to store water for use outside solar hours.</p><p>→ <a href=\"/in/solar-pumps/how-it-works/\">Full guide: How Solar Pumps Work — Step by Step</a></p>"
    },
    {
      "heading": "Types of Solar Pumps",
      "body": "<p>Solar pumps are classified by mounting type and motor technology:</p><p><strong>By mounting:</strong></p><ul><li><a href=\"/in/solar-pumps/submersible/\"><strong>Submersible pumps</strong></a> — installed inside borewells, ideal for depths of 30–300+ feet. Most common in Indian agriculture.</li><li><a href=\"/in/solar-pumps/surface/\"><strong>Surface pumps</strong></a> — placed above ground near open wells, ponds, or canals. Suitable for suction depths up to 15–20 feet.</li></ul><p><strong>By motor technology:</strong></p><ul><li><a href=\"/in/solar-pumps/bldc/\"><strong>BLDC (Brushless DC)</strong></a> — high-efficiency motors that run directly on DC power, no VFD needed. Best for small systems (1–3 HP).</li><li><strong>AC induction motors</strong> — standard three-phase motors powered through a VFD/controller. Available in all sizes (1–10 HP).</li></ul><p>For <a href=\"/in/solar-pumps/borewell/\">borewell applications</a>, submersible pumps with AC motors dominate in the 5–10 HP range, while BLDC submersibles are popular for smaller borewells.</p>"
    },
    {
      "heading": "Solar Pumps by HP Rating",
      "body": "<table><thead><tr><th>HP</th><th>Water Output/Day</th><th>Panel Requirement</th><th>Best For</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>40,000–60,000 litres</td><td>1.2–1.5 kW</td><td>Kitchen gardens, small farms up to 2 acres</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>80,000–1,20,000 litres</td><td>2.4–3.0 kW</td><td>Small to medium farms, 2–4 acres</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>1,20,000–1,80,000 litres</td><td>3.6–4.5 kW</td><td>Medium farms, 4–6 acres</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>2,00,000–3,00,000 litres</td><td>6.0–7.5 kW</td><td>Large farms, 6–10 acres</td></tr><tr><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>3,00,000–4,50,000 litres</td><td>9.0–11 kW</td><td>Large farms, deep borewells</td></tr><tr><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>4,00,000–6,00,000 litres</td><td>12–15 kW</td><td>Estate farming, community irrigation</td></tr></tbody></table><p><em>Water output assumes 6–8 hours of pumping in good sunlight. Actual output varies with total dynamic head (depth + distance).</em></p>"
    },
    {
      "heading": "KUSUM Yojana: Government Subsidy for Solar Pumps",
      "body": "<p>The <a href=\"/in/solar-pumps/kusum-yojana/\">PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan)</a> scheme is the central government''s flagship programme for solarising agricultural pumps. It has three components:</p><ul><li><strong>Component A</strong> — set up solar power plants on barren/fallow land (not relevant for individual pumps)</li><li><strong>Component B</strong> — install standalone solar pumps up to 7.5 HP. Central subsidy: 30%, state subsidy: 30%, farmer pays: 40% (only 10% in some states)</li><li><strong>Component C</strong> — solarise existing grid-connected pumps. Farmer sells surplus power to the DISCOM</li></ul><p>Under Component B, a farmer can get a 3 HP solar pump worth ₹1,60,000 for as little as ₹16,000–₹64,000 depending on the state top-up subsidy.</p><p>→ <a href=\"/in/solar-pumps/kusum-yojana/\">Full guide: KUSUM Yojana — Eligibility, Application & Subsidy Rates</a></p>"
    },
    {
      "heading": "Solar Pumps for Home Use",
      "body": "<p>Solar pumps are not just for farms. Homeowners increasingly use small solar pumps (0.5–2 HP) for overhead tank filling, garden irrigation, and rainwater harvesting systems. A <a href=\"/in/solar-pumps/for-home/\">solar pump for home</a> eliminates dependence on grid electricity for water supply — especially valuable in areas with scheduled water supply or frequent power cuts.</p><p>A 1 HP solar pump with 1.2 kW panels can fill a 1,000-litre overhead tank in 20–30 minutes, enough for a typical household''s daily needs. These compact systems cost ₹60,000–₹90,000 and require minimal roof or ground space for the panels.</p>"
    },
    {
      "heading": "Our Verified Dealer Network",
      "body": "<p>Solar Vipani connects you with verified solar pump dealers and installers across India. Every dealer on our platform is vetted for product quality, after-sales service, and KUSUM empanelment.</p><ul><li>Verified dealers across major agricultural states</li><li>Brands: Shakti, Kirloskar, Tata Solar, Lubi, CRI, Oswal, and more</li><li>Support with KUSUM Yojana application and subsidy processing</li><li>On-site survey and customised pump sizing for your borewell or open well</li></ul><p>Fill one form and receive 2–3 competitive quotes from verified pump dealers near you — free, with no obligation.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How much does a solar water pump cost in India?",
      "answer": "Solar pump prices range from ₹60,000 for a 1 HP system to ₹4,50,000+ for a 10 HP submersible pump before subsidy. Under the KUSUM Yojana, farmers pay only 10–40% of the total cost — so a 3 HP pump worth ₹1,60,000 can cost as little as ₹16,000–₹64,000 out of pocket depending on state subsidies."
    },
    {
      "question": "Can solar pumps work on cloudy days?",
      "answer": "Yes, but at reduced capacity. On heavily overcast days, water output drops to 20–40% of peak. Most farmers compensate by using a storage tank or farm pond to buffer water from sunny days. In most Indian regions with 250+ sunny days per year, seasonal cloud cover has minimal impact on overall water availability."
    },
    {
      "question": "What is the KUSUM Yojana subsidy for solar pumps?",
      "answer": "Under PM-KUSUM Component B, the central government provides 30% subsidy and the state government adds another 30% for standalone solar pumps up to 7.5 HP. The farmer''s share is 40%, but several states reduce this to as low as 10% through additional state schemes. Only MNRE-empanelled vendors qualify."
    },
    {
      "question": "Which is better — AC or DC solar pump?",
      "answer": "DC pumps (especially BLDC) are more efficient at low power ratings (1–3 HP) and work well in low-light conditions. AC pumps are available in larger sizes (5–10 HP), have wider service networks, and use standard motors that are easy to replace. For borewells over 200 feet deep, AC submersible pumps are the standard choice."
    },
    {
      "question": "How do I choose the right HP for my solar pump?",
      "answer": "The right HP depends on your total dynamic head (borewell depth + delivery distance + vertical rise) and daily water requirement. As a rough guide: 1 HP for up to 2 acres, 3 HP for 4–6 acres, 5 HP for 6–10 acres, and 7.5–10 HP for larger holdings or deep borewells (300+ feet). A site survey by a qualified dealer gives the most accurate sizing."
    },
    {
      "question": "Do solar pumps need batteries?",
      "answer": "No. Most solar pump installations run directly on solar power during the day and do not use batteries. Water is stored in overhead tanks or farm ponds for use after sunset. Adding batteries increases cost by 30–50% and is rarely justified for agricultural or domestic water pumping applications."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'solar-pumps' AND page_type = 'pillar';


-- 2. CLUSTER: price
UPDATE seo_pages SET
  h1 = 'Solar Pump Price in India 2026: Complete Price List by HP & Type',
  meta_title = 'Solar Pump Price India 2026: 1HP to 10HP Price List with Subsidy | Solar Vipani',
  meta_description = 'Solar pump prices from ₹25,000 (0.5 HP) to ₹4,50,000 (10 HP) before subsidy. See prices by HP, type (submersible/surface), and motor (AC/DC). KUSUM subsidy saves 60%.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar water pump in India costs <strong>₹60,000 for a 1 HP system to ₹4,50,000+ for a 10 HP submersible pump</strong> before subsidy. Under the <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a>, farmers pay only 10–40% of the total cost. The most common agricultural pump — a <a href=\"/in/solar-pumps/3hp/\">3 HP submersible</a> — costs ₹1,40,000–₹1,80,000 before subsidy and ₹42,000–₹72,000 after.</p>"
    },
    {
      "heading": "Solar Pump Price by HP Rating",
      "body": "<p>HP (horsepower) is the primary factor determining solar pump price. Higher HP means more panels, a larger controller, and a more powerful motor:</p><table><thead><tr><th>HP Rating</th><th>Solar Panel (kW)</th><th>Pump + Controller</th><th>Total System Price</th><th>After KUSUM (farmer share)</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>1.2–1.5 kW</td><td>₹25,000–₹40,000</td><td>₹60,000–₹90,000</td><td>₹18,000–₹36,000</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>2.4–3.0 kW</td><td>₹35,000–₹55,000</td><td>₹1,00,000–₹1,40,000</td><td>₹30,000–₹56,000</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>3.6–4.5 kW</td><td>₹50,000–₹70,000</td><td>₹1,40,000–₹1,80,000</td><td>₹42,000–₹72,000</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>6.0–7.5 kW</td><td>₹70,000–₹1,00,000</td><td>₹2,00,000–₹2,80,000</td><td>₹60,000–₹1,12,000</td></tr><tr><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>9.0–11 kW</td><td>₹1,00,000–₹1,40,000</td><td>₹2,80,000–₹3,60,000</td><td>₹84,000–₹1,44,000</td></tr><tr><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>12–15 kW</td><td>₹1,40,000–₹1,80,000</td><td>₹3,50,000–₹4,50,000</td><td>₹1,05,000–₹1,80,000</td></tr></tbody></table><p><em>Prices for AC submersible pumps with monocrystalline panels. DC BLDC pumps cost 10–15% less in the 1–3 HP range.</em></p>"
    },
    {
      "heading": "Submersible vs Surface Pump Prices",
      "body": "<p><a href=\"/in/solar-pumps/submersible/\">Submersible pumps</a> cost more than <a href=\"/in/solar-pumps/surface/\">surface pumps</a> at the same HP because the motor and pump assembly must be sealed for underwater operation and handle higher pressures.</p><table><thead><tr><th>HP</th><th>Submersible Price</th><th>Surface Price</th><th>Difference</th></tr></thead><tbody><tr><td>1 HP</td><td>₹65,000–₹90,000</td><td>₹45,000–₹65,000</td><td>~30% more</td></tr><tr><td>2 HP</td><td>₹1,10,000–₹1,40,000</td><td>₹80,000–₹1,10,000</td><td>~25% more</td></tr><tr><td>3 HP</td><td>₹1,50,000–₹1,80,000</td><td>₹1,10,000–₹1,40,000</td><td>~25% more</td></tr><tr><td>5 HP</td><td>₹2,20,000–₹2,80,000</td><td>₹1,60,000–₹2,20,000</td><td>~20% more</td></tr></tbody></table><p>Surface pumps are suitable only when the water source is within 15–20 feet of the pump. For <a href=\"/in/solar-pumps/borewell/\">borewells</a> deeper than 20 feet, submersible pumps are the only option.</p>"
    },
    {
      "heading": "AC vs DC Solar Pump Prices",
      "body": "<p>Motor technology affects both price and performance:</p><p><strong>DC pumps (<a href=\"/in/solar-pumps/bldc/\">BLDC motors</a>):</strong></p><ul><li>Price: 10–15% lower than AC equivalents in the 1–3 HP range</li><li>No VFD/inverter needed — <a href=\"/in/solar-pumps/controller/\">simpler controller</a></li><li>Higher efficiency at low irradiance (starts earlier, runs later)</li><li>Limited availability above 3 HP</li></ul><p><strong>AC pumps (induction motors):</strong></p><ul><li>Available in all HP ratings up to 10+ HP</li><li>Standard motors — easy to find replacements anywhere in India</li><li>Require a VFD/solar pump controller to convert DC to AC</li><li>Wider service network for repairs</li></ul><p>For farms needing 5+ HP, AC pumps are the default choice. For smaller gardens and <a href=\"/in/solar-pumps/for-home/\">home use</a>, BLDC pumps offer better value.</p>"
    },
    {
      "heading": "What Drives Solar Pump Costs?",
      "body": "<p>Five factors determine your total system cost:</p><ol><li><strong>Solar panels (50–60% of cost)</strong> — higher HP needs more panels. <a href=\"/in/solar-panels/price/\">Panel prices</a> are currently ₹22–₹35 per watt depending on type. Monocrystalline panels dominate due to higher efficiency per square metre.</li><li><strong>Pump motor (15–25%)</strong> — submersible motors cost more than surface motors. Stainless steel impellers cost more than noryl but last longer in hard water.</li><li><strong>Controller/VFD (10–15%)</strong> — AC systems need a VFD; DC/BLDC systems use simpler controllers. MPPT-based controllers cost more but extract 15–20% more power from panels.</li><li><strong>Mounting and wiring (5–10%)</strong> — ground-mount structures, DC cables, and earthing. Distance between panels and pump adds cable cost.</li><li><strong>Installation and commissioning (5–8%)</strong> — pump lowering into borewell, panel mounting, and controller setup.</li></ol>"
    },
    {
      "heading": "KUSUM Subsidy: How Much Do Farmers Actually Pay?",
      "body": "<p>Under <a href=\"/in/solar-pumps/kusum-yojana/\">PM-KUSUM Component B</a>, the cost-sharing for standalone solar pumps (up to 7.5 HP) works as follows:</p><table><thead><tr><th>Component</th><th>Share</th></tr></thead><tbody><tr><td>Central government subsidy</td><td>30%</td></tr><tr><td>State government subsidy</td><td>30%</td></tr><tr><td>Farmer''s share</td><td>40%</td></tr></tbody></table><p>Several states (Rajasthan, Maharashtra, Madhya Pradesh, Uttar Pradesh) offer additional top-ups that reduce the farmer''s share to as low as <strong>10% of the benchmark cost</strong>. Bank loans are available for the farmer''s share at subsidised interest rates.</p><p>Example: A 5 HP solar pump with benchmark cost ₹2,50,000 → central subsidy ₹75,000 + state subsidy ₹75,000 → farmer pays ₹1,00,000 (or ₹25,000 in states with extra top-up).</p>"
    },
    {
      "heading": "Solar Pump Price by Popular Brands",
      "body": "<p>Prices vary across brands based on motor quality, controller technology, and warranty terms:</p><table><thead><tr><th>Brand</th><th>1 HP Range</th><th>3 HP Range</th><th>5 HP Range</th><th>Warranty</th></tr></thead><tbody><tr><td>Shakti</td><td>₹65,000–₹85,000</td><td>₹1,50,000–₹1,75,000</td><td>₹2,20,000–₹2,70,000</td><td>5 years</td></tr><tr><td>Kirloskar</td><td>₹70,000–₹90,000</td><td>₹1,55,000–₹1,80,000</td><td>₹2,30,000–₹2,80,000</td><td>5 years</td></tr><tr><td>Lubi</td><td>₹60,000–₹80,000</td><td>₹1,40,000–₹1,70,000</td><td>₹2,10,000–₹2,60,000</td><td>5 years</td></tr><tr><td>CRI</td><td>₹65,000–₹85,000</td><td>₹1,45,000–₹1,75,000</td><td>₹2,20,000–₹2,70,000</td><td>5 years</td></tr><tr><td>Tata Solar</td><td>₹70,000–₹90,000</td><td>₹1,55,000–₹1,80,000</td><td>₹2,35,000–₹2,80,000</td><td>5 years</td></tr></tbody></table><p>All prices are for complete systems including panels, controller, and motor. Panel warranty is typically 25 years; motor and controller warranty is 5 years.</p>"
    },
    {
      "heading": "How to Compare Quotes and Get the Best Price",
      "body": "<p>When comparing solar pump quotes, check these items:</p><ul><li><strong>Panel wattage and brand</strong> — ensure panels are from a MNRE/BIS-approved manufacturer</li><li><strong>Pump and motor brand</strong> — check if the motor is BIS-certified</li><li><strong>Controller type</strong> — MPPT controllers extract 15–20% more energy than PWM types</li><li><strong>Installation scope</strong> — does the quote include borewell pipe, wiring, and ground mount?</li><li><strong>KUSUM empanelment</strong> — the dealer must be empanelled under KUSUM for subsidy eligibility</li><li><strong>Warranty terms</strong> — 25 years for panels, 5 years minimum for motor and controller</li></ul><p>Solar Vipani connects you with 2–3 verified dealers who provide comparable, transparent quotes.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 1 HP solar pump in India?",
      "answer": "A 1 HP solar pump costs ₹60,000–₹90,000 before subsidy for a complete system including panels, controller, and motor. Under KUSUM Yojana, farmers pay only ₹18,000–₹36,000. DC BLDC models are at the lower end, while AC submersible systems cost more."
    },
    {
      "question": "Which is cheaper — submersible or surface solar pump?",
      "answer": "Surface pumps are 20–30% cheaper than submersible pumps at the same HP rating. A 3 HP surface pump costs ₹1,10,000–₹1,40,000 vs ₹1,50,000–₹1,80,000 for a submersible. However, surface pumps only work for open wells and shallow water sources up to 15–20 feet depth."
    },
    {
      "question": "Does KUSUM Yojana cover the full cost of a solar pump?",
      "answer": "KUSUM covers up to 60% (30% central + 30% state) of the benchmark cost. The farmer pays the remaining 40%, which can be further reduced to 10% in some states through additional state subsidies. Bank loans at subsidised rates are available for the farmer''s share."
    },
    {
      "question": "Are solar pump prices going down?",
      "answer": "Yes. Solar panel prices have dropped over 80% in the last decade, which directly reduces solar pump system costs. Controller and motor costs have also decreased as manufacturing has scaled up in India. Current prices are 30–40% lower than they were five years ago."
    },
    {
      "question": "What is the maintenance cost of a solar pump?",
      "answer": "Annual maintenance costs are minimal — ₹2,000–₹5,000 per year for panel cleaning, controller checks, and occasional borewell pipe inspection. There are no fuel costs, no electricity bills, and no engine oil changes like diesel pumps require. The main replacement expense is the motor bearing, which typically lasts 8–10 years."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'price' AND pillar_slug = 'solar-pumps';


-- 3. CLUSTER: how-it-works
UPDATE seo_pages SET
  h1 = 'How Do Solar Water Pumps Work? Simple Explanation for Indian Farmers',
  meta_title = 'How Solar Pumps Work: Panels, Controller & Motor Explained | Solar Vipani',
  meta_description = 'Learn how solar water pumps convert sunlight to water flow — panels, controllers, motors, and why no battery is needed. Simple guide for Indian farmers and homeowners.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar water pump converts sunlight into electricity using <a href=\"/in/solar-panels/\">solar panels</a>, which powers an electric motor to drive a pump. A <a href=\"/in/solar-pumps/controller/\">controller</a> sits between the panels and motor to regulate power. The pump runs automatically during daylight — no switches, no fuel, no grid connection. Water is stored in a tank or farm pond for use after sunset.</p>"
    },
    {
      "heading": "The Three Core Components",
      "body": "<p>Every solar pump system has three main parts:</p><ol><li><strong>Solar panels (PV array)</strong> — mounted on the ground or a rooftop near the pump site. Panels generate DC electricity proportional to sunlight intensity. A <a href=\"/in/solar-pumps/3hp/\">3 HP pump</a> typically needs 3.6–4.5 kW of panels (8–10 panels of 540W each).</li><li><strong>Pump controller</strong> — the brain of the system. It performs three critical jobs: (a) Maximum Power Point Tracking (MPPT) to extract peak energy from panels, (b) motor protection against dry run, over-voltage, and under-voltage, (c) DC-to-AC conversion in AC pump systems (acts as a solar VFD).</li><li><strong>Pump motor</strong> — either a <a href=\"/in/solar-pumps/submersible/\">submersible unit</a> lowered into a borewell or a <a href=\"/in/solar-pumps/surface/\">surface pump</a> placed near an open well. The motor converts electrical energy into mechanical rotation that drives the pump impellers to push water.</li></ol>"
    },
    {
      "heading": "Step-by-Step: Sunlight to Water",
      "body": "<ol><li><strong>Sunrise — panels start generating</strong>: As sunlight hits the PV panels, photovoltaic cells generate DC electricity. Even early morning light produces some power, though not enough for full-speed pumping.</li><li><strong>Controller activates the motor</strong>: Once panel output crosses the minimum threshold (typically 40–50% of rated power), the controller starts the motor. MPPT algorithms continuously adjust voltage to extract maximum power as light intensity changes.</li><li><strong>Pump pushes water</strong>: The motor drives pump impellers that create pressure to lift water from the source (borewell, open well, pond, or river) and push it through delivery pipes to a storage tank or irrigation system.</li><li><strong>Peak pumping (10 AM–3 PM)</strong>: Water discharge is highest when sunlight is strongest. A <a href=\"/in/solar-pumps/5hp/\">5 HP pump</a> can deliver 2,00,000–3,00,000 litres in a full sunny day.</li><li><strong>Cloudy periods — reduced output</strong>: The controller automatically reduces motor speed to match available power. The pump runs slower but continues to operate.</li><li><strong>Sunset — pump stops</strong>: As light drops below the minimum threshold, the controller safely shuts down the motor. No manual intervention needed.</li></ol>"
    },
    {
      "heading": "DC Pumps vs AC Pumps: How Each Works",
      "body": "<p>The motor technology determines how power flows through the system:</p><p><strong><a href=\"/in/solar-pumps/bldc/\">DC (BLDC) pumps</a>:</strong></p><ul><li>Panels → simple DC controller → BLDC motor → pump</li><li>No DC-to-AC conversion needed — higher overall efficiency (85–92%)</li><li>Start pumping at lower light levels (earlier morning, later evening)</li><li>Available in 1–3 HP; limited options above 3 HP</li><li>Best for: small farms, <a href=\"/in/solar-pumps/for-home/\">home water supply</a>, shallow borewells</li></ul><p><strong>AC (induction motor) pumps:</strong></p><ul><li>Panels → VFD/solar controller (DC→AC) → 3-phase AC motor → pump</li><li>DC-to-AC conversion costs 5–8% efficiency, but standard motors are rugged and widely serviceable</li><li>Available in all HP ratings from 1 HP to 10+ HP</li><li>Best for: large farms, deep <a href=\"/in/solar-pumps/borewell/\">borewells</a> (200+ feet), commercial <a href=\"/in/solar-pumps/irrigation/\">irrigation</a></li></ul>"
    },
    {
      "heading": "Why No Battery Is Needed",
      "body": "<p>Unlike rooftop solar for homes, solar pump systems almost never use batteries. The reason is simple: <strong>water itself is the storage medium</strong>.</p><p>During the day, the pump fills an overhead tank, farm pond, or reservoir. Farmers use this stored water for evening and nighttime irrigation through gravity-fed drip or flood systems. This approach is:</p><ul><li><strong>Cheaper</strong> — a 5,000-litre tank costs ₹5,000–₹15,000 vs ₹50,000+ for a battery bank</li><li><strong>Longer-lasting</strong> — tanks last 20+ years; batteries need replacement every 5–7 years</li><li><strong>Maintenance-free</strong> — no charge cycles, no degradation, no thermal management</li></ul><p>The only scenario where batteries make sense is when you need to pump at night (e.g., for livestock watering systems that run 24/7). Even then, a larger tank is usually more economical.</p>"
    },
    {
      "heading": "How Total Dynamic Head Affects Performance",
      "body": "<p>Total Dynamic Head (TDH) is the most critical factor in pump sizing. It measures the total effort the pump must make to deliver water, expressed in metres or feet:</p><p><strong>TDH = Static Water Level + Delivery Head + Friction Losses</strong></p><ul><li><strong>Static water level</strong> — depth from ground to water surface in the borewell or well (e.g., 150 feet)</li><li><strong>Delivery head</strong> — height from ground level to the delivery point (e.g., 20 feet to overhead tank)</li><li><strong>Friction losses</strong> — resistance in pipes, bends, and valves (typically 10–15% of total head)</li></ul><p>Higher TDH requires more HP. A borewell with a 300-foot water level needs at least a <a href=\"/in/solar-pumps/7-5hp/\">7.5 HP pump</a>, while a 100-foot borewell works fine with <a href=\"/in/solar-pumps/3hp/\">3 HP</a>. Your dealer should conduct a site survey to measure actual TDH before recommending a pump size.</p>"
    },
    {
      "heading": "How Solar Pumps Handle Variable Weather",
      "body": "<p>Solar pumps are designed to work with fluctuating power input — unlike grid-connected pumps that receive constant voltage:</p><ul><li><strong>MPPT tracking</strong> — the controller continuously adjusts voltage and current to extract maximum power from panels as cloud cover changes</li><li><strong>Soft start</strong> — instead of a sudden start that can damage the motor, the controller ramps up speed gradually as sunlight increases</li><li><strong>Dry-run protection</strong> — sensors detect when the borewell water level drops below the pump intake and shut down the motor automatically to prevent damage</li><li><strong>Under-voltage protection</strong> — if cloud cover reduces panel output below the safe operating threshold, the controller stops the motor rather than running it at damaging low speeds</li></ul><p>These protections are built into modern MPPT controllers. Always ensure your system uses an MPPT controller rather than a basic on/off controller — it extracts 15–20% more water over a day.</p>"
    },
    {
      "heading": "Maintenance: What Keeps a Solar Pump Running",
      "body": "<p>Solar pumps require far less maintenance than diesel or electric pumps:</p><ul><li><strong>Panel cleaning</strong> — wash with water every 2–4 weeks to remove dust. Dirty panels can reduce output by 15–25%.</li><li><strong>Controller check</strong> — inspect connections and LED indicators quarterly. No moving parts, so failures are rare.</li><li><strong>Motor service</strong> — submersible motors are sealed and maintenance-free for 5–8 years. Surface pump bearings may need greasing annually.</li><li><strong>Pipe inspection</strong> — check borewell delivery pipe for leaks or blockages once a year during pump pullout.</li></ul><p>Total annual maintenance cost: ₹2,000–₹5,000. Compare that to ₹30,000–₹80,000 per year for diesel pump fuel and servicing.</p>"
    },
    {
      "heading": "Ready to Switch to Solar Pumping?",
      "body": "<p>Now that you understand how solar pumps work, check <a href=\"/in/solar-pumps/price/\">current prices</a> or learn about the <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana subsidy</a> that can cover up to 90% of your system cost.</p><p>Solar Vipani connects you with verified pump dealers who will survey your site, recommend the right HP and type, and handle KUSUM paperwork — all free of charge.</p><p><a href=\"/in/get-quotes/\">Get your free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How many solar panels are needed for a solar pump?",
      "answer": "The number of panels depends on pump HP. A 1 HP pump needs 1.2–1.5 kW (2–3 panels of 540W), a 3 HP needs 3.6–4.5 kW (7–9 panels), and a 5 HP needs 6–7.5 kW (12–14 panels). Panels are sized at 1.2–1.5x the motor rating to ensure adequate power even in partially cloudy conditions."
    },
    {
      "question": "Can a solar pump work without a controller?",
      "answer": "No. The controller is essential — it regulates voltage, performs MPPT to maximise output, protects the motor from dry run and voltage fluctuations, and in AC systems converts DC to AC. Running a motor directly from panels without a controller will damage it within minutes."
    },
    {
      "question": "How many hours does a solar pump run per day?",
      "answer": "A solar pump typically runs 6–8 hours per day depending on season and cloud cover. Peak output occurs between 10 AM and 3 PM. In summer, pumps may run 8–9 hours; in monsoon season, 4–6 hours. Annual average is about 6.5–7 hours per day across most Indian regions."
    },
    {
      "question": "Can I run a solar pump at night using batteries?",
      "answer": "Technically yes, but it is not recommended for most applications. Adding batteries increases system cost by 30–50% and adds maintenance complexity. A more practical approach is to pump water into a storage tank during the day and use gravity to distribute it at night."
    },
    {
      "question": "What happens to the solar pump during monsoon season?",
      "answer": "Solar pumps continue to operate during monsoon but at reduced capacity — typically 40–60% of peak output due to cloud cover. Since monsoon also means natural rainfall, irrigation water demand is usually lower, so the reduced pumping capacity is generally sufficient."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'how-it-works' AND pillar_slug = 'solar-pumps';

COMMIT;
