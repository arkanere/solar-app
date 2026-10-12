-- Solar Pumps Clusters Batch 3: 2hp, 3hp, 5hp, 7-5hp
-- Run: psql $POSTGRES_URL < 024-solar-pumps-clusters-batch3.sql

BEGIN;

-- 1. CLUSTER: 2hp
UPDATE seo_pages SET
  h1 = '2 HP Solar Pump in India: Price, Output & Best Models',
  meta_title = '2 HP Solar Pump Price India 2026: Specs, Output & Subsidy | Solar Vipani',
  meta_description = '2 HP solar pump price ₹1,00,000–₹1,40,000 before subsidy. Delivers 80,000–1,20,000 litres/day. Ideal for 2–4 acre farms. KUSUM subsidy covers up to 60%.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 2 HP solar pump in India costs <strong>₹1,00,000–₹1,40,000</strong> for a <a href=\"/in/solar-pumps/submersible/\">submersible</a> system and <strong>₹80,000–₹1,10,000</strong> for a <a href=\"/in/solar-pumps/surface/\">surface</a> system before subsidy. Under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a>, farmers pay ₹30,000–₹56,000. It delivers 80,000–1,20,000 litres per day — suitable for 2–4 acre farms with drip or sprinkler <a href=\"/in/solar-pumps/irrigation/\">irrigation</a>.</p>"
    },
    {
      "heading": "2 HP Solar Pump Specifications",
      "body": "<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Motor power</td><td>2 HP (1.5 kW)</td></tr><tr><td>Solar panels required</td><td>2.4–3.0 kW (5–6 panels of 540W)</td></tr><tr><td>Daily water output</td><td>80,000–1,20,000 litres (at 30m TDH)</td></tr><tr><td>Max head (submersible)</td><td>150–200 feet</td></tr><tr><td>Max suction (surface)</td><td>15–20 feet</td></tr><tr><td>Operating hours</td><td>6–8 hours/day</td></tr><tr><td>Controller type</td><td>MPPT (DC or AC VFD)</td></tr></tbody></table><p><em>At 200 feet depth, output drops to approximately 50,000–70,000 litres/day. At 100 feet, expect 1,00,000–1,20,000 litres/day.</em></p>"
    },
    {
      "heading": "2 HP Solar Pump Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (2.4–3.0 kW)</td><td>₹55,000–₹75,000</td></tr><tr><td>Pump + motor (submersible)</td><td>₹20,000–₹30,000</td></tr><tr><td>Controller/VFD</td><td>₹12,000–₹18,000</td></tr><tr><td>Mounting + wiring</td><td>₹7,000–₹10,000</td></tr><tr><td>Installation</td><td>₹5,000–₹8,000</td></tr><tr><td><strong>Total (submersible)</strong></td><td><strong>₹1,00,000–₹1,40,000</strong></td></tr></tbody></table><p>After KUSUM (60% subsidy): ₹30,000–₹56,000 farmer share. Surface pumps cost ₹80,000–₹1,10,000 before subsidy. <a href=\"/in/solar-pumps/price/\">Full price comparison →</a></p>"
    },
    {
      "heading": "Who Should Buy a 2 HP Solar Pump?",
      "body": "<ul><li><strong>Small to medium farmers (2–4 acres)</strong> — irrigating vegetables, pulses, or cash crops with drip or sprinkler systems</li><li><strong>Orchards</strong> — young orchards with 200–500 trees needing regular watering</li><li><strong>Shallow to medium borewells</strong> — water tables at 100–200 feet depth</li><li><strong>Open well farms</strong> — surface 2 HP pump is perfect for open wells with good water yield</li><li><strong>Homeowners with large gardens</strong> — landscaping, lawns, and <a href=\"/in/solar-pumps/for-home/\">domestic water supply</a> for large bungalows</li></ul><p>If your borewell is deeper than 200 feet or your farm is larger than 4 acres, consider a <a href=\"/in/solar-pumps/3hp/\">3 HP</a> pump. For farms under 2 acres, a <a href=\"/in/solar-pumps/1hp/\">1 HP</a> is more cost-effective.</p>"
    },
    {
      "heading": "2 HP: AC vs DC Comparison",
      "body": "<p>At 2 HP, both motor types remain viable:</p><table><thead><tr><th>Feature</th><th><a href=\"/in/solar-pumps/bldc/\">DC BLDC</a></th><th>AC Induction</th></tr></thead><tbody><tr><td>Price</td><td>₹90,000–₹1,20,000</td><td>₹1,00,000–₹1,40,000</td></tr><tr><td>Panels needed</td><td>2.0–2.4 kW</td><td>2.4–3.0 kW</td></tr><tr><td>Daily output (bonus)</td><td>10–15% more</td><td>Baseline</td></tr><tr><td>Low-light performance</td><td>Superior (starts earlier)</td><td>Standard</td></tr><tr><td>HP range availability</td><td>Up to 3 HP max</td><td>All sizes</td></tr></tbody></table><p>BLDC models remain competitive at 2 HP. If your borewell is under 150 feet and you want maximum efficiency, DC BLDC is the better choice. For borewells 150–200 feet deep, AC is the safer bet.</p>"
    },
    {
      "heading": "Panel and Space Requirements",
      "body": "<p>A 2 HP pump needs 2.4–3.0 kW of <a href=\"/in/solar-panels/\">solar panels</a> — typically 5–6 panels of 540W each.</p><ul><li><strong>Ground mount area</strong>: 100–150 sq ft of shadow-free space</li><li><strong>Panel orientation</strong>: south-facing, 15–20° tilt</li><li><strong>Distance from pump</strong>: keep controller within 30 metres of panel array</li></ul><p>For rural farms, ground-mounted panels on steel frames are standard. The panel structure can also double as shade for farm equipment or cattle resting area.</p>"
    },
    {
      "heading": "Diesel vs Solar: Running Cost Comparison for 2 HP",
      "body": "<table><thead><tr><th>Cost Factor</th><th>Diesel 2 HP</th><th>Solar 2 HP</th></tr></thead><tbody><tr><td>Upfront cost</td><td>₹15,000–₹25,000</td><td>₹30,000–₹56,000 (after KUSUM)</td></tr><tr><td>Annual fuel/energy</td><td>₹25,000–₹40,000</td><td>₹0</td></tr><tr><td>Annual maintenance</td><td>₹5,000–₹10,000</td><td>₹2,000–₹4,000</td></tr><tr><td>5-year total cost</td><td>₹1,65,000–₹2,75,000</td><td>₹40,000–₹76,000</td></tr><tr><td>Lifespan</td><td>5–8 years</td><td>20–25 years</td></tr></tbody></table><p>Solar breaks even within 1–2 years compared to diesel. Over 10 years, a solar pump saves <strong>₹2,50,000–₹4,00,000</strong> in fuel and maintenance costs.</p>"
    },
    {
      "heading": "Get Quotes for a 2 HP Solar Pump",
      "body": "<p>Solar Vipani connects you with verified solar pump dealers who will survey your farm and recommend the optimal 2 HP system for your water source and crops.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How many acres can a 2 HP solar pump irrigate?",
      "answer": "A 2 HP solar pump irrigates 2–4 acres using drip or sprinkler irrigation. With flood irrigation, coverage drops to 1–2 acres due to higher water consumption. For maximum coverage, pair the pump with drip lines and a storage tank."
    },
    {
      "question": "What is the price of a 2 HP solar pump after KUSUM subsidy?",
      "answer": "After KUSUM Yojana subsidy (60% of benchmark cost), a 2 HP solar submersible pump costs ₹30,000–₹56,000 out of pocket for farmers. In states with additional top-up subsidies, the farmer share can drop to as low as ₹10,000–₹15,000."
    },
    {
      "question": "How deep can a 2 HP submersible solar pump go?",
      "answer": "A 2 HP submersible pump handles borewells up to 150–200 feet deep. Water output decreases with depth — at 100 feet expect 1,00,000+ litres/day, at 200 feet expect 50,000–70,000 litres/day. For borewells deeper than 200 feet, a 3 HP or larger pump is recommended."
    },
    {
      "question": "How many solar panels are needed for a 2 HP pump?",
      "answer": "A 2 HP solar pump needs 2.4–3.0 kW of panels — typically 5–6 panels of 540W each. DC BLDC models need slightly fewer panels (2.0–2.4 kW, or 4–5 panels). Ground-mount space required: 100–150 sq ft."
    },
    {
      "question": "Can a 2 HP solar pump fill an overhead tank?",
      "answer": "Yes. A 2 HP pump can fill a 5,000-litre overhead tank in 15–20 minutes from a shallow source. For borewell applications at 100 feet depth, it fills the same tank in about 25–35 minutes. It is well-suited for large homes and small commercial buildings."
    }
  ]',
  updated_at = NOW()
WHERE slug = '2hp' AND pillar_slug = 'solar-pumps';


-- 2. CLUSTER: 3hp
UPDATE seo_pages SET
  h1 = '3 HP Solar Pump in India: Price, Specifications & Buying Guide',
  meta_title = '3 HP Solar Pump Price India 2026: Specs, Brands & KUSUM Subsidy | Solar Vipani',
  meta_description = '3 HP solar pump price ₹1,40,000–₹1,80,000 before subsidy. India''s most popular agricultural solar pump. Delivers 1,20,000–1,80,000 litres/day for 4–6 acre farms.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The 3 HP solar pump is <strong>India''s most popular agricultural solar pump size</strong>. It costs ₹1,40,000–₹1,80,000 before subsidy and delivers 1,20,000–1,80,000 litres per day — enough to irrigate 4–6 acres with drip or sprinkler <a href=\"/in/solar-pumps/irrigation/\">irrigation</a>. Under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a>, farmers pay ₹42,000–₹72,000.</p>"
    },
    {
      "heading": "3 HP Solar Pump Specifications",
      "body": "<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Motor power</td><td>3 HP (2.2 kW)</td></tr><tr><td>Solar panels required</td><td>3.6–4.5 kW (7–9 panels of 540W)</td></tr><tr><td>Daily water output</td><td>1,20,000–1,80,000 litres (at 30m TDH)</td></tr><tr><td>Max head (submersible)</td><td>200–300 feet</td></tr><tr><td>Max suction (surface)</td><td>15–20 feet</td></tr><tr><td>Operating hours</td><td>6–8 hours/day</td></tr><tr><td>Panel area needed</td><td>150–200 sq ft</td></tr></tbody></table><p><em>At 300 feet depth, daily output drops to approximately 60,000–80,000 litres. The sweet spot for 3 HP is borewells at 100–250 feet depth.</em></p>"
    },
    {
      "heading": "Why 3 HP Is the Most Popular Choice",
      "body": "<p>Over 40% of solar pumps installed under KUSUM are 3 HP. Here is why:</p><ul><li><strong>Sweet spot for Indian farm sizes</strong> — India''s average farm holding is 1.08 hectares (2.67 acres). A 3 HP pump comfortably serves 4–6 acres — enough for most smallholder farmers with some headroom.</li><li><strong>Matches common borewell depths</strong> — most Indian borewells are 100–300 feet deep. 3 HP handles this range efficiently.</li><li><strong>Best subsidy value</strong> — KUSUM covers up to 7.5 HP, but the cost-benefit ratio peaks at 3–5 HP. You get maximum water per rupee of farmer investment.</li><li><strong>Both AC and DC options available</strong> — at 3 HP, you can still choose <a href=\"/in/solar-pumps/bldc/\">BLDC</a> motors (the upper limit for most DC pumps) or go with standard AC induction.</li></ul>"
    },
    {
      "heading": "3 HP Price: AC vs DC vs Surface",
      "body": "<table><thead><tr><th>Type</th><th>Price (before subsidy)</th><th>After KUSUM (farmer share)</th></tr></thead><tbody><tr><td>AC Submersible</td><td>₹1,50,000–₹1,80,000</td><td>₹45,000–₹72,000</td></tr><tr><td><a href=\"/in/solar-pumps/bldc/\">DC BLDC</a> Submersible</td><td>₹1,30,000–₹1,60,000</td><td>₹39,000–₹64,000</td></tr><tr><td><a href=\"/in/solar-pumps/surface/\">Surface</a> Pump</td><td>₹1,10,000–₹1,40,000</td><td>₹33,000–₹56,000</td></tr></tbody></table><p>For new installations, AC submersibles are the standard recommendation for borewells 150–300 feet deep. BLDC offers better value for shallower borewells. <a href=\"/in/solar-pumps/price/\">Full price comparison →</a></p>"
    },
    {
      "heading": "What Can a 3 HP Solar Pump Irrigate?",
      "body": "<table><thead><tr><th>Crop Type</th><th>Acreage with Drip</th><th>Acreage with Sprinkler</th><th>Acreage with Flood</th></tr></thead><tbody><tr><td>Vegetables</td><td>5–6 acres</td><td>3–4 acres</td><td>1.5–2 acres</td></tr><tr><td>Cotton / Pulses</td><td>6–8 acres</td><td>4–5 acres</td><td>2–3 acres</td></tr><tr><td>Sugarcane</td><td>4–5 acres</td><td>3–4 acres</td><td>1–1.5 acres</td></tr><tr><td>Orchard</td><td>6–8 acres</td><td>4–5 acres</td><td>N/A</td></tr></tbody></table><p>Pairing a 3 HP pump with drip <a href=\"/in/solar-pumps/irrigation/\">irrigation</a> maximises farm coverage and water efficiency.</p>"
    },
    {
      "heading": "Installation and Panel Layout",
      "body": "<p>A 3 HP system needs 3.6–4.5 kW of <a href=\"/in/solar-panels/\">solar panels</a> (7–9 panels of 540W). Installation typically takes 1–2 days:</p><ol><li><strong>Panel ground mount</strong> — 7–9 panels on a steel frame, south-facing at 15–20° tilt. Space: 150–200 sq ft.</li><li><strong>Controller installation</strong> — wall-mounted or pole-mounted near the panel array</li><li><strong>Pump lowering</strong> (submersible) — motor-pump lowered into borewell using GI or HDPE pipes</li><li><strong>Wiring and earthing</strong> — DC cables from panels to controller, submersible cable to pump</li><li><strong>Testing</strong> — verify flow rate, check all protections, commission system</li></ol><p>For KUSUM installations, the empanelled dealer handles everything including government inspection and subsidy paperwork.</p>"
    },
    {
      "heading": "Top 3 HP Solar Pump Brands",
      "body": "<table><thead><tr><th>Brand</th><th>Motor Type</th><th>Price Range</th><th>Strengths</th></tr></thead><tbody><tr><td>Shakti</td><td>AC + BLDC</td><td>₹1,30,000–₹1,75,000</td><td>Widest range, strong KUSUM track record</td></tr><tr><td>Kirloskar</td><td>AC</td><td>₹1,55,000–₹1,80,000</td><td>Best after-sales network</td></tr><tr><td>CRI</td><td>AC + BLDC</td><td>₹1,40,000–₹1,70,000</td><td>Durable SS impellers for hard water</td></tr><tr><td>Lubi</td><td>AC + BLDC</td><td>₹1,30,000–₹1,65,000</td><td>Value pricing, strong in West India</td></tr><tr><td>Tata Power</td><td>AC</td><td>₹1,55,000–₹1,80,000</td><td>Integrated panel + pump offering</td></tr></tbody></table>"
    },
    {
      "heading": "Get Quotes for a 3 HP Solar Pump",
      "body": "<p>Solar Vipani connects you with KUSUM-empanelled dealers who will survey your farm, measure your borewell, and recommend the best 3 HP system — free of charge.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 3 HP solar pump in India?",
      "answer": "A 3 HP solar pump costs ₹1,40,000–₹1,80,000 before subsidy. Under KUSUM Yojana (60% subsidy), the farmer pays ₹42,000–₹72,000. In states like Rajasthan and UP with extra top-ups, farmer cost can drop to ₹16,000–₹30,000."
    },
    {
      "question": "How many solar panels are needed for a 3 HP pump?",
      "answer": "A 3 HP solar pump needs 3.6–4.5 kW of panels — 7 to 9 panels of 540W each. BLDC models need slightly fewer (6–7 panels). Total ground-mount area: 150–200 sq ft of shadow-free space, south-facing."
    },
    {
      "question": "How much water does a 3 HP solar pump produce per day?",
      "answer": "A 3 HP pump delivers 1,20,000–1,80,000 litres per day at 30 metres total dynamic head. At 100 metres (330 feet), output drops to about 60,000–80,000 litres per day. Output depends on borewell depth, water table, and sunlight hours."
    },
    {
      "question": "Can I replace my diesel pump with a 3 HP solar pump?",
      "answer": "Yes. A 3 HP solar pump replaces a 3 HP diesel pump set used for the same borewell. You save ₹30,000–₹60,000 per year in diesel costs. The solar system pays for itself (after subsidy) in 1–2 years through fuel savings alone."
    },
    {
      "question": "Is 3 HP or 5 HP better for my farm?",
      "answer": "3 HP suits farms up to 6 acres with borewells up to 300 feet. If your farm is 6–10 acres or your borewell is deeper than 300 feet, go for 5 HP. The 3 HP has a better cost-per-litre ratio for medium-depth borewells, while 5 HP is necessary for high-demand applications."
    }
  ]',
  updated_at = NOW()
WHERE slug = '3hp' AND pillar_slug = 'solar-pumps';


-- 3. CLUSTER: 5hp
UPDATE seo_pages SET
  h1 = '5 HP Solar Pump in India: Price, Specifications & Farm Guide',
  meta_title = '5 HP Solar Pump Price India 2026: Specs, Brands & KUSUM Subsidy | Solar Vipani',
  meta_description = '5 HP solar pump price ₹2,00,000–₹2,80,000 before subsidy. Delivers 2,00,000–3,00,000 litres/day for 6–10 acre farms. Deep borewell capable up to 400 feet.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 5 HP solar pump costs <strong>₹2,00,000–₹2,80,000</strong> before subsidy and delivers <strong>2,00,000–3,00,000 litres per day</strong> — enough to irrigate 6–10 acres. It handles borewells up to 400 feet deep, making it the workhorse for medium to large Indian farms. Under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a>, farmers pay ₹60,000–₹1,12,000.</p>"
    },
    {
      "heading": "5 HP Solar Pump Specifications",
      "body": "<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Motor power</td><td>5 HP (3.7 kW)</td></tr><tr><td>Solar panels required</td><td>6.0–7.5 kW (12–14 panels of 540W)</td></tr><tr><td>Daily water output</td><td>2,00,000–3,00,000 litres (at 30m TDH)</td></tr><tr><td>Max head (submersible)</td><td>300–400 feet</td></tr><tr><td>Operating hours</td><td>6–8 hours/day</td></tr><tr><td>Borewell size needed</td><td>5–6 inch minimum</td></tr><tr><td>Panel area needed</td><td>250–350 sq ft</td></tr></tbody></table><p><em>At 400 feet depth, output drops to approximately 80,000–1,20,000 litres/day. The 5 HP sweet spot is borewells at 150–350 feet.</em></p>"
    },
    {
      "heading": "5 HP Solar Pump Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (6.0–7.5 kW)</td><td>₹1,10,000–₹1,50,000</td></tr><tr><td>Submersible pump + motor</td><td>₹40,000–₹60,000</td></tr><tr><td>VFD/Controller</td><td>₹25,000–₹35,000</td></tr><tr><td>Mounting structure</td><td>₹12,000–₹18,000</td></tr><tr><td>Wiring + installation</td><td>₹13,000–₹20,000</td></tr><tr><td><strong>Total system</strong></td><td><strong>₹2,00,000–₹2,80,000</strong></td></tr></tbody></table><p>After KUSUM (60% subsidy): ₹60,000–₹1,12,000 farmer share. <a href=\"/in/solar-pumps/price/\">Full price comparison →</a></p>"
    },
    {
      "heading": "Who Should Buy a 5 HP Solar Pump?",
      "body": "<ul><li><strong>Medium to large farmers (6–10 acres)</strong> — the primary audience for 5 HP pumps</li><li><strong>Deep borewell owners</strong> — water tables at 200–400 feet where <a href=\"/in/solar-pumps/3hp/\">3 HP</a> pumps struggle</li><li><strong>Multiple crop cycles</strong> — farms growing 2–3 crops per year needing consistent water supply</li><li><strong>Commercial nurseries and orchards</strong> — large-scale irrigation for 500+ trees</li><li><strong>Community irrigation</strong> — shared pump serving 2–3 adjacent smallholdings</li></ul><p>If your farm is under 6 acres with a shallow-medium borewell, a <a href=\"/in/solar-pumps/3hp/\">3 HP pump</a> offers better value. For farms over 10 acres or borewells deeper than 400 feet, consider <a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a>.</p>"
    },
    {
      "heading": "5 HP Pump for Deep Borewells",
      "body": "<p>The 5 HP is the entry point for serious deep <a href=\"/in/solar-pumps/borewell/\">borewell</a> pumping. Performance at various depths:</p><table><thead><tr><th>Borewell Depth</th><th>Daily Water Output</th><th>Flow Rate</th></tr></thead><tbody><tr><td>100 feet (30m)</td><td>2,50,000–3,00,000 L</td><td>600–700 LPH</td></tr><tr><td>200 feet (60m)</td><td>1,80,000–2,50,000 L</td><td>450–550 LPH</td></tr><tr><td>300 feet (90m)</td><td>1,20,000–1,60,000 L</td><td>300–400 LPH</td></tr><tr><td>400 feet (120m)</td><td>80,000–1,20,000 L</td><td>200–300 LPH</td></tr></tbody></table><p>For borewells in the 250–400 feet range that are common in Karnataka, Rajasthan, and Maharashtra plateau regions, 5 HP is the optimal size. The <a href=\"/in/solar-pumps/controller/\">controller</a> automatically adjusts motor speed to match available sunlight.</p>"
    },
    {
      "heading": "Diesel Replacement Economics",
      "body": "<p>Replacing a 5 HP diesel pump with solar yields the highest absolute savings:</p><table><thead><tr><th>Cost Category</th><th>Diesel 5 HP (annual)</th><th>Solar 5 HP (annual)</th></tr></thead><tbody><tr><td>Fuel/electricity</td><td>₹50,000–₹80,000</td><td>₹0</td></tr><tr><td>Maintenance</td><td>₹8,000–₹15,000</td><td>₹3,000–₹5,000</td></tr><tr><td>Downtime cost</td><td>Variable (breakdowns)</td><td>Minimal</td></tr><tr><td><strong>Annual savings</strong></td><td colspan=\"2\"><strong>₹55,000–₹90,000 per year</strong></td></tr></tbody></table><p>After KUSUM subsidy, the farmer invests ₹60,000–₹1,12,000. With annual savings of ₹55,000–₹90,000, the <strong>payback period is just 1–2 years</strong>. The system then delivers free irrigation for 20+ more years.</p>"
    },
    {
      "heading": "Panel Layout and Space Planning",
      "body": "<p>A 5 HP pump requires 6.0–7.5 kW of <a href=\"/in/solar-panels/\">solar panels</a> — typically 12–14 panels of 540W arranged in two rows on a ground-mount structure.</p><ul><li><strong>Space required</strong>: 250–350 sq ft of shadow-free land</li><li><strong>Orientation</strong>: south-facing, 15–20° tilt, minimum 3 feet gap between rows</li><li><strong>Location</strong>: as close to the borewell/controller as practical (within 50 metres)</li><li><strong>Foundation</strong>: concrete footings or driven piles depending on soil type</li></ul><p>The panel array for 5 HP is significant. Many farmers install it along a field boundary or on unused land near the borewell. The area under panels can be used for shade-tolerant crops or equipment storage.</p>"
    },
    {
      "heading": "Get Quotes for a 5 HP Solar Pump",
      "body": "<p>A 5 HP system requires proper site assessment for borewell depth, yield testing, and TDH calculation. Solar Vipani connects you with verified dealers who handle everything from survey to KUSUM paperwork.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the cost of a 5 HP solar pump after subsidy?",
      "answer": "After KUSUM Yojana subsidy (60% of benchmark cost), a 5 HP solar pump costs ₹60,000–₹1,12,000 to the farmer. States like Rajasthan, UP, and Madhya Pradesh offer additional top-ups that can reduce the farmer share to ₹20,000–₹50,000."
    },
    {
      "question": "How many acres can a 5 HP solar pump irrigate?",
      "answer": "A 5 HP pump irrigates 6–10 acres with drip irrigation, 4–6 acres with sprinkler, and 2–4 acres with flood irrigation. Actual coverage depends on crop water requirement, soil type, and borewell yield."
    },
    {
      "question": "How deep can a 5 HP solar pump go?",
      "answer": "A 5 HP submersible pump handles borewells up to 400 feet (120 metres) deep. Optimal performance is at 150–350 feet. For borewells deeper than 400 feet, upgrade to 7.5 HP or 10 HP."
    },
    {
      "question": "How many solar panels does a 5 HP pump need?",
      "answer": "A 5 HP solar pump needs 6.0–7.5 kW of panels — typically 12–14 panels of 540W each. This requires 250–350 sq ft of shadow-free ground space for mounting."
    },
    {
      "question": "Can I use a 5 HP solar pump for a shared borewell?",
      "answer": "Yes. A 5 HP pump can serve 2–3 adjacent small farms through a shared borewell arrangement. This is common in community irrigation projects. KUSUM also allows farmer groups to apply together, and the subsidy applies per pump system."
    }
  ]',
  updated_at = NOW()
WHERE slug = '5hp' AND pillar_slug = 'solar-pumps';


-- 4. CLUSTER: 7-5hp
UPDATE seo_pages SET
  h1 = '7.5 HP Solar Pump in India: Price, Specs & Deep Borewell Guide',
  meta_title = '7.5 HP Solar Pump Price India 2026: Specs, Output & Subsidy | Solar Vipani',
  meta_description = '7.5 HP solar pump price ₹2,80,000–₹3,60,000 before subsidy. Handles 500-foot borewells. Delivers 3,00,000–4,50,000 litres/day. Maximum HP under KUSUM Yojana.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 7.5 HP solar pump costs <strong>₹2,80,000–₹3,60,000</strong> before subsidy and is the <strong>largest pump size eligible for KUSUM Yojana Component B</strong>. It delivers 3,00,000–4,50,000 litres per day and handles deep borewells up to 500 feet — making it ideal for large farms (8–15 acres) and regions with deep water tables. After KUSUM subsidy, farmers pay ₹84,000–₹1,44,000.</p>"
    },
    {
      "heading": "7.5 HP Solar Pump Specifications",
      "body": "<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Motor power</td><td>7.5 HP (5.5 kW)</td></tr><tr><td>Solar panels required</td><td>9.0–11 kW (17–20 panels of 540W)</td></tr><tr><td>Daily water output</td><td>3,00,000–4,50,000 litres (at 30m TDH)</td></tr><tr><td>Max head (submersible)</td><td>400–500 feet</td></tr><tr><td>Operating hours</td><td>6–8 hours/day</td></tr><tr><td>Borewell size needed</td><td>6 inch minimum</td></tr><tr><td>Panel area needed</td><td>350–500 sq ft</td></tr><tr><td>Motor type</td><td>AC induction (3-phase)</td></tr></tbody></table>"
    },
    {
      "heading": "7.5 HP Solar Pump Price",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (9.0–11 kW)</td><td>₹1,60,000–₹2,20,000</td></tr><tr><td>Submersible pump + motor</td><td>₹55,000–₹75,000</td></tr><tr><td>VFD/Controller</td><td>₹30,000–₹40,000</td></tr><tr><td>Mounting + wiring + installation</td><td>₹35,000–₹50,000</td></tr><tr><td><strong>Total system</strong></td><td><strong>₹2,80,000–₹3,60,000</strong></td></tr></tbody></table><p>After KUSUM (60% subsidy): ₹84,000–₹1,44,000 farmer share. 7.5 HP is the maximum HP covered under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Component B</a>. <a href=\"/in/solar-pumps/price/\">Full price comparison →</a></p>"
    },
    {
      "heading": "Who Needs a 7.5 HP Solar Pump?",
      "body": "<ul><li><strong>Large farmers (8–15 acres)</strong> — growing water-intensive crops like sugarcane, paddy, or banana</li><li><strong>Very deep borewells (400–500 feet)</strong> — common in Rajasthan, Karnataka plateau, Vidarbha, and parts of Tamil Nadu</li><li><strong>High daily water demand</strong> — farms with multiple crop zones needing 3+ lakh litres per day</li><li><strong>Farmer cooperatives</strong> — shared pump serving a village community borewell</li><li><strong>KUSUM maximum benefit</strong> — since 7.5 HP is the subsidy ceiling, it offers the highest absolute subsidy value</li></ul><p>If your borewell is under 300 feet and farm under 8 acres, a <a href=\"/in/solar-pumps/5hp/\">5 HP pump</a> is more cost-efficient. For borewells deeper than 500 feet or farms over 15 acres, a <a href=\"/in/solar-pumps/10hp/\">10 HP pump</a> is needed (though subsidy is capped at 7.5 HP).</p>"
    },
    {
      "heading": "Performance at Different Borewell Depths",
      "body": "<table><thead><tr><th>Borewell Depth</th><th>Daily Output</th><th>Suitable Acreage (drip)</th></tr></thead><tbody><tr><td>150 feet (45m)</td><td>4,00,000–4,50,000 L</td><td>12–15 acres</td></tr><tr><td>250 feet (75m)</td><td>2,80,000–3,50,000 L</td><td>8–12 acres</td></tr><tr><td>350 feet (105m)</td><td>1,80,000–2,50,000 L</td><td>6–8 acres</td></tr><tr><td>500 feet (150m)</td><td>1,00,000–1,50,000 L</td><td>4–5 acres</td></tr></tbody></table><p>At extreme depths (400–500 feet), the 7.5 HP pump still delivers usable volumes. Multi-stage impellers designed for high-head applications maintain efficiency even at these depths. Work with your dealer to select the right number of pump stages for your specific borewell depth.</p>"
    },
    {
      "heading": "Panel Array and Infrastructure",
      "body": "<p>A 7.5 HP system needs 9.0–11 kW of <a href=\"/in/solar-panels/\">solar panels</a> — 17 to 20 panels arranged in 2–3 rows on a ground-mount structure.</p><ul><li><strong>Ground space</strong>: 350–500 sq ft (roughly 15m × 3m)</li><li><strong>Structure</strong>: heavy-duty galvanised steel ground mount with concrete foundations</li><li><strong>Cabling</strong>: thicker DC cables (6mm² or 10mm²) to handle higher current</li><li><strong>Controller</strong>: industrial-grade VFD with MPPT, typically 7.5–10 kW rated</li></ul><p>The panel area is significant — plan the location carefully to avoid shading from trees, buildings, or other structures. Many farmers dedicate a corner of the field or use boundary land for the panel array.</p>"
    },
    {
      "heading": "KUSUM Subsidy: Maximum Benefit at 7.5 HP",
      "body": "<p>7.5 HP is the ceiling for <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Component B</a> standalone solar pumps. This means:</p><ul><li><strong>Central subsidy</strong>: 30% of benchmark cost ≈ ₹84,000–₹1,08,000</li><li><strong>State subsidy</strong>: 30% ≈ ₹84,000–₹1,08,000</li><li><strong>Farmer share</strong>: 40% ≈ ₹1,12,000–₹1,44,000</li></ul><p>At 7.5 HP, you get the <strong>highest absolute subsidy amount</strong> under KUSUM — over ₹2,00,000 in combined subsidies. If you need more than 7.5 HP, a <a href=\"/in/solar-pumps/10hp/\">10 HP pump</a> is available but the additional cost above 7.5 HP is unsubsidised under Component B.</p>"
    },
    {
      "heading": "Get Quotes for a 7.5 HP Solar Pump",
      "body": "<p>A 7.5 HP system is a significant investment. Get it right with a professional site survey — borewell depth test, yield assessment, and TDH calculation. Solar Vipani connects you with verified, KUSUM-empanelled dealers.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 7.5 HP solar pump after KUSUM subsidy?",
      "answer": "After KUSUM Yojana subsidy (60%), a 7.5 HP solar pump costs ₹84,000–₹1,44,000 to the farmer. In states with additional top-ups, cost can drop to ₹28,000–₹72,000. This is the maximum HP covered under KUSUM Component B."
    },
    {
      "question": "Is 7.5 HP the maximum solar pump under KUSUM?",
      "answer": "Yes. KUSUM Component B covers standalone solar pumps up to 7.5 HP. Larger pumps (10 HP, 15 HP) can be installed but the subsidy applies only up to the 7.5 HP benchmark cost. Component C (solarisation of existing grid pumps) has different limits."
    },
    {
      "question": "How many panels are needed for a 7.5 HP solar pump?",
      "answer": "A 7.5 HP pump needs 9.0–11 kW of solar panels — 17 to 20 panels of 540W each. Ground-mount space required: 350–500 sq ft. The panels are typically arranged in 2–3 rows on a steel structure."
    },
    {
      "question": "Can a 7.5 HP pump handle a 500-foot borewell?",
      "answer": "Yes, but output at 500 feet (150m TDH) drops to about 1,00,000–1,50,000 litres per day. For optimal performance at 500 feet, a high-stage pump model (20+ stages) is recommended. The dealer will select the right model based on your exact borewell depth and required flow rate."
    },
    {
      "question": "7.5 HP vs 10 HP: Which should I choose?",
      "answer": "Choose 7.5 HP if your borewell is under 500 feet and farm under 15 acres — you get maximum KUSUM subsidy. Choose 10 HP only if you need more than 4,50,000 litres/day or your borewell is deeper than 500 feet. The cost difference is ₹70,000–₹1,00,000, and 10 HP doesn''t get additional subsidy beyond the 7.5 HP benchmark."
    }
  ]',
  updated_at = NOW()
WHERE slug = '7-5hp' AND pillar_slug = 'solar-pumps';

COMMIT;
