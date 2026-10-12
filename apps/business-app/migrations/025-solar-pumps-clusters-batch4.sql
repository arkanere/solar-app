-- Solar Pumps Clusters Batch 4: 10hp, borewell, bldc, controller
-- Run: psql $POSTGRES_URL < 025-solar-pumps-clusters-batch4.sql

BEGIN;

-- 1. CLUSTER: 10hp
UPDATE seo_pages SET
  h1 = '10 HP Solar Pump in India: Price, Output & Large Farm Guide',
  meta_title = '10 HP Solar Pump Price India 2026: Specs, Output & Applications | Solar Vipani',
  meta_description = '10 HP solar pump price ₹3,50,000–₹4,50,000. Delivers 4,00,000–6,00,000 litres/day for 15–20 acre farms and 600+ foot borewells. Estate and community irrigation guide.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 10 HP solar pump costs <strong>₹3,50,000–₹4,50,000</strong> and is designed for large farms (15–20+ acres), very deep borewells (500–600+ feet), and community irrigation projects. It delivers 4,00,000–6,00,000 litres per day. <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> subsidises up to the 7.5 HP benchmark — the incremental cost above 7.5 HP is borne by the farmer.</p>"
    },
    {
      "heading": "10 HP Solar Pump Specifications",
      "body": "<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Motor power</td><td>10 HP (7.5 kW)</td></tr><tr><td>Solar panels required</td><td>12–15 kW (22–28 panels of 540W)</td></tr><tr><td>Daily water output</td><td>4,00,000–6,00,000 litres (at 30m TDH)</td></tr><tr><td>Max head (submersible)</td><td>500–600+ feet</td></tr><tr><td>Operating hours</td><td>6–8 hours/day</td></tr><tr><td>Borewell size needed</td><td>6–8 inch minimum</td></tr><tr><td>Panel area needed</td><td>500–700 sq ft</td></tr><tr><td>Motor type</td><td>AC induction (3-phase)</td></tr></tbody></table>"
    },
    {
      "heading": "10 HP Solar Pump Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (12–15 kW)</td><td>₹2,20,000–₹3,00,000</td></tr><tr><td>Submersible pump + motor</td><td>₹60,000–₹80,000</td></tr><tr><td>VFD/Controller (10–15 kW)</td><td>₹35,000–₹50,000</td></tr><tr><td>Mounting + wiring + installation</td><td>₹40,000–₹60,000</td></tr><tr><td><strong>Total system</strong></td><td><strong>₹3,50,000–₹4,50,000</strong></td></tr></tbody></table><p>KUSUM subsidy applies up to the <a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a> benchmark cost (~₹3,20,000). The additional ₹30,000–₹1,30,000 above 7.5 HP benchmark is paid by the farmer. <a href=\"/in/solar-pumps/price/\">Full price guide →</a></p>"
    },
    {
      "heading": "Who Needs a 10 HP Solar Pump?",
      "body": "<ul><li><strong>Large and estate farms (15–20+ acres)</strong> — sugarcane, banana, paddy, and multi-crop operations</li><li><strong>Very deep borewells (500–600+ feet)</strong> — common in Rajasthan, Telangana, and hard-rock regions of Karnataka and Maharashtra</li><li><strong>Community irrigation</strong> — a single 10 HP pump serving 5–8 smallholder farmers through a shared borewell</li><li><strong>Dairy farms</strong> — large water demand for animals plus fodder <a href=\"/in/solar-pumps/irrigation/\">irrigation</a></li><li><strong>Commercial nurseries and horticulture estates</strong> — needing 5+ lakh litres daily</li></ul><p>If your borewell is under 400 feet and farm under 10 acres, a <a href=\"/in/solar-pumps/5hp/\">5 HP</a> or <a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a> pump is more cost-effective.</p>"
    },
    {
      "heading": "Performance at Various Depths",
      "body": "<table><thead><tr><th>Borewell Depth</th><th>Daily Output</th><th>Suitable Acreage (drip)</th></tr></thead><tbody><tr><td>100 feet (30m)</td><td>5,00,000–6,00,000 L</td><td>18–20+ acres</td></tr><tr><td>200 feet (60m)</td><td>4,00,000–5,00,000 L</td><td>12–15 acres</td></tr><tr><td>300 feet (90m)</td><td>2,50,000–3,50,000 L</td><td>8–12 acres</td></tr><tr><td>400 feet (120m)</td><td>1,80,000–2,50,000 L</td><td>6–8 acres</td></tr><tr><td>600 feet (180m)</td><td>1,00,000–1,50,000 L</td><td>4–5 acres</td></tr></tbody></table><p>At extreme depths (500–600+ feet), the 10 HP pump requires a high-stage submersible unit with 30+ impeller stages. These specialised deep-well models cost more but are engineered for sustained performance at high total dynamic head.</p>"
    },
    {
      "heading": "Panel Array and Infrastructure Planning",
      "body": "<p>A 10 HP pump needs 12–15 kW of <a href=\"/in/solar-panels/\">solar panels</a> — 22 to 28 panels arranged in 3–4 rows:</p><ul><li><strong>Ground space</strong>: 500–700 sq ft (approximately 20m × 3.5m)</li><li><strong>Structure</strong>: heavy-duty hot-dip galvanised steel ground mount with concrete foundations</li><li><strong>Cabling</strong>: 10mm² DC cables, proper cable trays and conduit for the longer runs</li><li><strong>Controller</strong>: industrial 10–15 kW VFD with MPPT, weatherproof IP65 enclosure</li><li><strong>Earthing</strong>: multiple earth pits for panel array, controller, and motor</li></ul><p>Plan the panel location carefully. At 500–700 sq ft, the array is roughly the size of a small room. Many farmers install it as a shade structure for parking or cattle.</p>"
    },
    {
      "heading": "KUSUM Subsidy for 10 HP: What to Know",
      "body": "<p><a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Component B</a> caps standalone pump subsidy at 7.5 HP. For a 10 HP system:</p><ul><li>Subsidy applies on the 7.5 HP benchmark cost (~₹3,20,000) → 60% = ₹1,92,000 subsidy</li><li>The farmer pays 40% of 7.5 HP benchmark (₹1,28,000) <strong>plus</strong> the full differential cost to 10 HP (₹30,000–₹1,30,000)</li><li>Net farmer cost: approximately ₹1,58,000–₹2,58,000</li></ul><p><strong>Alternative:</strong> Some state schemes and NABARD-funded programmes offer full subsidy for pumps up to 10 HP. Check with your state agriculture department or DISCOM for state-specific schemes.</p>"
    },
    {
      "heading": "Get Quotes for a 10 HP Solar Pump",
      "body": "<p>A 10 HP installation requires expert site assessment — borewell yield testing, pump stage selection, and infrastructure planning. Solar Vipani connects you with experienced dealers who specialise in large solar pump systems.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the cost of a 10 HP solar pump in India?",
      "answer": "A 10 HP solar pump costs ₹3,50,000–₹4,50,000 for a complete system. KUSUM subsidy covers up to the 7.5 HP benchmark, so the farmer effectively pays ₹1,58,000–₹2,58,000 depending on state top-ups and the vendor quote."
    },
    {
      "question": "How many solar panels does a 10 HP pump need?",
      "answer": "A 10 HP pump needs 12–15 kW of panels — 22 to 28 panels of 540W each. Ground-mount space required: 500–700 sq ft. The array is arranged in 3–4 rows on a heavy-duty steel structure with concrete foundations."
    },
    {
      "question": "Is KUSUM subsidy available for 10 HP solar pumps?",
      "answer": "KUSUM Component B subsidises pumps up to 7.5 HP. For 10 HP, subsidy applies only on the 7.5 HP benchmark cost (about ₹3,20,000). The cost above 7.5 HP benchmark is paid by the farmer. Some states offer separate schemes that cover 10 HP fully."
    },
    {
      "question": "How much water does a 10 HP solar pump deliver per day?",
      "answer": "A 10 HP pump delivers 4,00,000–6,00,000 litres per day at 30m total dynamic head. At 200 feet depth, expect 4,00,000–5,00,000 litres. At 600 feet, output drops to 1,00,000–1,50,000 litres per day."
    },
    {
      "question": "Can a 10 HP pump serve multiple farms?",
      "answer": "Yes. A 10 HP pump is commonly used for community irrigation — serving 5–8 smallholder farmers through a shared borewell. The high daily output (4–6 lakh litres) is distributed through a pipeline network or shared farm pond. KUSUM allows farmer group applications."
    }
  ]',
  updated_at = NOW()
WHERE slug = '10hp' AND pillar_slug = 'solar-pumps';


-- 2. CLUSTER: borewell
UPDATE seo_pages SET
  h1 = 'Solar Pump for Borewell in India: Complete Sizing & Selection Guide',
  meta_title = 'Solar Pump for Borewell India: HP Sizing, Depth Guide & Prices | Solar Vipani',
  meta_description = 'Choose the right solar pump for your borewell — 1 HP to 10 HP for depths from 50 to 600+ feet. Sizing calculator, price comparison, and KUSUM subsidy guide.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The right solar pump for your borewell depends on <strong>depth to water level</strong> and <strong>daily water requirement</strong>. A 100-foot borewell needs a <a href=\"/in/solar-pumps/3hp/\">3 HP pump</a>, a 300-foot borewell needs <a href=\"/in/solar-pumps/5hp/\">5 HP</a>, and a 500-foot borewell needs <a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a> or more. All are <a href=\"/in/solar-pumps/submersible/\">submersible pumps</a> — the only type that works for borewells. <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> subsidises up to 60% of the cost.</p>"
    },
    {
      "heading": "How to Size a Solar Pump for Your Borewell",
      "body": "<p>Two measurements determine your pump size:</p><ol><li><strong>Total Dynamic Head (TDH)</strong> = static water level + delivery height + friction losses (typically add 15% to account for pipe friction). Measured in feet or metres.</li><li><strong>Daily water requirement</strong> = farm area × crop water need. Measured in litres per day.</li></ol><p>With these two numbers, use this sizing table:</p><table><thead><tr><th>Water Level (feet)</th><th>Up to 60,000 L/day</th><th>Up to 1,80,000 L/day</th><th>Up to 3,00,000 L/day</th><th>Up to 5,00,000 L/day</th></tr></thead><tbody><tr><td>Up to 100 ft</td><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td></tr><tr><td>100–200 ft</td><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td></tr><tr><td>200–350 ft</td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td></tr><tr><td>350–500 ft</td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>10+ HP</td></tr><tr><td>500+ ft</td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>10+ HP</td><td>15+ HP</td></tr></tbody></table>"
    },
    {
      "heading": "Understanding Total Dynamic Head (TDH)",
      "body": "<p>TDH is the single most important number for pump sizing. It measures the total effort the pump must make:</p><p><strong>TDH = Static Water Level + Delivery Head + Friction Losses</strong></p><ul><li><strong>Static Water Level (SWL)</strong> — depth from ground to the water surface in your borewell when the pump is NOT running. This varies seasonally — use the lowest level (typically pre-monsoon) for sizing.</li><li><strong>Drawdown</strong> — how much the water level drops when the pump is running. Typically 10–30 feet depending on aquifer yield.</li><li><strong>Delivery Head</strong> — height from ground level to where the water is delivered (overhead tank, hilltop field, etc.)</li><li><strong>Friction Losses</strong> — resistance from pipe bends, length, and diameter. Add 10–15% of total head as a rule of thumb.</li></ul><p>Example: Borewell SWL 200 feet + drawdown 30 feet + delivery to tank 20 feet above ground + friction (25 feet) = TDH of 275 feet. A <a href=\"/in/solar-pumps/5hp/\">5 HP pump</a> is appropriate.</p>"
    },
    {
      "heading": "Borewell Diameter and Pump Compatibility",
      "body": "<table><thead><tr><th>Borewell Diameter</th><th>Compatible HP Range</th><th>Pump Motor OD</th></tr></thead><tbody><tr><td>4 inch (100 mm)</td><td>1–3 HP</td><td>95 mm</td></tr><tr><td>4.5 inch (115 mm)</td><td>1–5 HP</td><td>95–100 mm</td></tr><tr><td>5 inch (125 mm)</td><td>3–5 HP</td><td>100–115 mm</td></tr><tr><td>6 inch (150 mm)</td><td>5–10 HP</td><td>115–140 mm</td></tr><tr><td>8 inch (200 mm)</td><td>7.5–15+ HP</td><td>140–175 mm</td></tr></tbody></table><p><strong>Critical:</strong> Measure the inner diameter of your borewell casing. The pump motor OD must be at least 10 mm smaller than the casing ID for safe installation and water flow around the motor (which needs water flow for cooling).</p>"
    },
    {
      "heading": "Borewell Solar Pump Prices",
      "body": "<table><thead><tr><th>Borewell Depth</th><th>Recommended HP</th><th>System Price</th><th>After KUSUM</th></tr></thead><tbody><tr><td>50–100 ft</td><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>₹60,000–₹90,000</td><td>₹18,000–₹36,000</td></tr><tr><td>100–200 ft</td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>₹1,40,000–₹1,80,000</td><td>₹42,000–₹72,000</td></tr><tr><td>200–350 ft</td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>₹2,00,000–₹2,80,000</td><td>₹60,000–₹1,12,000</td></tr><tr><td>350–500 ft</td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>₹2,80,000–₹3,60,000</td><td>₹84,000–₹1,44,000</td></tr><tr><td>500+ ft</td><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>₹3,50,000–₹4,50,000</td><td>₹1,05,000–₹1,80,000</td></tr></tbody></table><p>These are guide prices. Actual cost depends on pump stages, brand, and <a href=\"/in/solar-pumps/controller/\">controller</a> type. <a href=\"/in/solar-pumps/price/\">Complete price guide →</a></p>"
    },
    {
      "heading": "Common Borewell Problems and Solutions",
      "body": "<ul><li><strong>Low yield borewell</strong> — if your borewell yields less than expected, the pump may run dry during peak hours. Solution: install a pump with <strong>dry-run protection</strong> (standard in modern solar controllers) and use a smaller pump that matches your borewell yield rather than depth.</li><li><strong>Sandy water</strong> — sand particles erode pump impellers rapidly. Solution: use pumps with <strong>stainless steel (SS 304/316) impellers</strong> rather than noryl (plastic). CRI and Kirloskar offer SS impeller variants.</li><li><strong>Hard water (high TDS)</strong> — causes mineral deposits on impellers. Solution: SS impellers resist scaling better. Plan annual descaling maintenance.</li><li><strong>Seasonal water level fluctuation</strong> — water table drops 50–100 feet in summer vs monsoon. Solution: size the pump for the <strong>lowest pre-monsoon water level</strong> to ensure year-round operation.</li></ul>"
    },
    {
      "heading": "Installation Best Practices",
      "body": "<ol><li><strong>Borewell yield test</strong> — pump the borewell for 4–6 hours using a hired diesel pump and measure sustained flow rate. This determines the maximum pump size your borewell can support.</li><li><strong>Pump setting depth</strong> — set the pump at least 30 feet below the lowest expected water level to prevent dry running during peak summer.</li><li><strong>Delivery pipe selection</strong> — GI pipes for depths up to 300 feet, HDPE pipes for deeper installations (lighter, easier to handle).</li><li><strong>Safety cable</strong> — always attach a stainless steel safety cable to the pump assembly to prevent it from falling into the borewell.</li><li><strong>Panel placement</strong> — mount panels within 30–50 metres of the borewell to minimise cable losses.</li></ol>"
    },
    {
      "heading": "Get Your Borewell Assessed",
      "body": "<p>Every borewell is unique. Your dealer should conduct a site visit to measure casing diameter, static water level, and yield before recommending a pump. Solar Vipani connects you with verified dealers who provide free assessments.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which HP solar pump is best for a 200-foot borewell?",
      "answer": "A 3 HP solar submersible pump is optimal for a 200-foot borewell. It delivers 80,000–1,20,000 litres per day at this depth and costs ₹1,40,000–₹1,80,000 before KUSUM subsidy. If your daily water demand exceeds 1,50,000 litres, consider stepping up to 5 HP."
    },
    {
      "question": "Can a solar pump work with a low-yield borewell?",
      "answer": "Yes, but you must match the pump to the borewell yield, not just its depth. If your borewell yields only 500 litres per hour, a smaller pump (1–2 HP) with dry-run protection is better than a large pump that outpaces the aquifer and runs dry repeatedly."
    },
    {
      "question": "How do I know my borewell depth?",
      "answer": "Check your borewell drilling report if available. Otherwise, lower a weighted string or measuring tape into the borewell until it hits water (static water level) and then until it hits bottom (total depth). Your solar pump dealer can also perform this measurement during the site survey."
    },
    {
      "question": "Should I use GI or HDPE pipes for the borewell delivery?",
      "answer": "GI (galvanised iron) pipes are standard for borewells up to 300 feet — they are rigid and durable. HDPE pipes are lighter, cheaper, and corrosion-resistant, making them preferred for deeper installations (300+ feet) where the weight of GI pipe becomes difficult to manage."
    },
    {
      "question": "What happens if the water level in my borewell drops below the pump?",
      "answer": "Modern solar pump controllers include dry-run protection — they detect when the pump is no longer submerged and shut it down automatically to prevent motor damage. The pump restarts once the water level recovers. This is a standard feature in all KUSUM-approved solar pump systems."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'borewell' AND pillar_slug = 'solar-pumps';


-- 3. CLUSTER: bldc
UPDATE seo_pages SET
  h1 = 'BLDC Solar Pumps in India: Price, Benefits & When to Choose DC',
  meta_title = 'BLDC Solar Pump India: Price, Efficiency & AC vs DC Guide | Solar Vipani',
  meta_description = 'BLDC solar pumps are 10–20% more efficient than AC. Prices from ₹45,000 (1 HP) to ₹1,60,000 (3 HP). Compare BLDC vs AC, top brands, and best use cases.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>BLDC (Brushless DC) solar pumps use permanent magnet motors that run directly on DC power from <a href=\"/in/solar-panels/\">solar panels</a> — no AC conversion needed. They are <strong>10–20% more efficient</strong> than AC induction pumps, start pumping in lower sunlight, and cost 10–15% less in the 1–3 HP range. BLDC pumps are ideal for small farms, <a href=\"/in/solar-pumps/for-home/\">home water supply</a>, and shallow to medium <a href=\"/in/solar-pumps/borewell/\">borewells</a> (up to 200 feet).</p>"
    },
    {
      "heading": "How BLDC Solar Pumps Work",
      "body": "<p>In a conventional AC solar pump, panels generate DC → controller converts DC to AC → AC motor runs the pump. Each conversion step loses energy.</p><p>A BLDC pump eliminates the DC-to-AC conversion entirely:</p><ol><li>Solar panels generate DC power</li><li>A simple DC <a href=\"/in/solar-pumps/controller/\">controller</a> with MPPT regulates the voltage</li><li>The BLDC motor runs directly on DC — permanent magnets replace the electromagnetic field of AC motors</li><li>An electronic commutator (built into the controller) switches current to the motor coils in sequence, creating smooth rotation</li></ol><p>This direct-drive architecture delivers 85–92% overall efficiency vs 75–85% for AC pump systems. The practical benefit: <strong>10–15% more water per day from the same solar panels</strong>.</p>"
    },
    {
      "heading": "BLDC vs AC Solar Pump: Detailed Comparison",
      "body": "<table><thead><tr><th>Feature</th><th>BLDC (DC) Pump</th><th>AC Induction Pump</th></tr></thead><tbody><tr><td>Motor efficiency</td><td>85–92%</td><td>75–85%</td></tr><tr><td>Panels needed (3 HP)</td><td>3.0–3.6 kW</td><td>3.6–4.5 kW</td></tr><tr><td>Morning start time</td><td>~7:00 AM (30–40% light)</td><td>~8:30 AM (50–60% light)</td></tr><tr><td>Evening run</td><td>Until ~5:30 PM</td><td>Until ~4:30 PM</td></tr><tr><td>Extra daily output</td><td>10–15% more</td><td>Baseline</td></tr><tr><td>HP range available</td><td>0.5–3 HP (some 5 HP)</td><td>1–10+ HP</td></tr><tr><td>Price (3 HP system)</td><td>₹1,30,000–₹1,60,000</td><td>₹1,50,000–₹1,80,000</td></tr><tr><td>Service availability</td><td>Authorised centres</td><td>Any motor workshop</td></tr><tr><td>Motor life expectancy</td><td>10–15 years (no brushes)</td><td>8–12 years</td></tr></tbody></table>"
    },
    {
      "heading": "BLDC Solar Pump Prices",
      "body": "<table><thead><tr><th>HP</th><th>BLDC System Price</th><th>Equivalent AC Price</th><th>Savings</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>₹45,000–₹70,000</td><td>₹65,000–₹90,000</td><td>₹15,000–₹20,000</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>₹85,000–₹1,15,000</td><td>₹1,00,000–₹1,40,000</td><td>₹15,000–₹25,000</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>₹1,30,000–₹1,60,000</td><td>₹1,50,000–₹1,80,000</td><td>₹15,000–₹25,000</td></tr></tbody></table><p>BLDC pumps are available in both <a href=\"/in/solar-pumps/submersible/\">submersible</a> and <a href=\"/in/solar-pumps/surface/\">surface</a> variants. The price advantage narrows as HP increases; above 3 HP, AC pumps are usually the only option. <a href=\"/in/solar-pumps/price/\">Full price guide →</a></p>"
    },
    {
      "heading": "When to Choose BLDC over AC",
      "body": "<p><strong>Choose BLDC when:</strong></p><ul><li>Your pump needs are 1–3 HP (small to medium farms up to 6 acres)</li><li>Your borewell is shallow to medium depth (up to 200 feet)</li><li>You want maximum water output from limited panel space</li><li>You are in a region with variable cloud cover — BLDC performs better in low light</li><li>Budget is a concern — BLDC systems cost less and need fewer panels</li><li>You need a <a href=\"/in/solar-pumps/for-home/\">home water supply</a> pump — 1 HP BLDC is the ideal choice</li></ul><p><strong>Choose AC when:</strong></p><ul><li>Your pump needs exceed 3 HP (large farms, deep borewells)</li><li>Your borewell is deeper than 200 feet</li><li>You want easy local servicing — any motor rewinding shop can fix AC motors</li><li>You already have an AC pump and want to solarise it (KUSUM Component C)</li></ul>"
    },
    {
      "heading": "BLDC Motor Technology Explained",
      "body": "<p>BLDC stands for Brushless Direct Current. Here is what makes these motors superior for solar applications:</p><ul><li><strong>Permanent magnets</strong> — the rotor uses rare-earth magnets instead of electromagnets. No energy is wasted creating the magnetic field, hence higher efficiency.</li><li><strong>No brushes</strong> — traditional DC motors use carbon brushes that wear out. BLDC uses electronic commutation — no physical contact, no wear, longer life.</li><li><strong>Variable speed</strong> — BLDC motors naturally adjust speed with available power. As sunlight intensity changes, the motor speeds up or slows down smoothly.</li><li><strong>Low starting torque requirement</strong> — BLDC motors start at lower voltage, which is why they begin pumping at 30–40% sunlight while AC motors need 50–60%.</li></ul><p>The trade-off: BLDC motors use specialised controllers and if the motor fails, it cannot be rewound at a local shop — it needs to go back to the manufacturer or authorised service centre.</p>"
    },
    {
      "heading": "Top BLDC Solar Pump Brands",
      "body": "<table><thead><tr><th>Brand</th><th>HP Range</th><th>Type</th><th>Notable Feature</th></tr></thead><tbody><tr><td>Shakti</td><td>0.5–3 HP</td><td>Submersible + Surface</td><td>Widest BLDC range, KUSUM-approved</td></tr><tr><td>CRI</td><td>1–3 HP</td><td>Submersible</td><td>SS impellers, good for hard water</td></tr><tr><td>Lubi</td><td>1–3 HP</td><td>Submersible + Surface</td><td>Competitive pricing</td></tr><tr><td>Oswal</td><td>1–2 HP</td><td>Submersible</td><td>Value segment</td></tr><tr><td>Tata Power Solar</td><td>1–3 HP</td><td>Submersible</td><td>Integrated panel + pump package</td></tr></tbody></table><p>All brands listed are MNRE-approved and <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM</a>-empanelled. Choose based on local service availability and dealer reputation.</p>"
    },
    {
      "heading": "Get Quotes for a BLDC Solar Pump",
      "body": "<p>Not sure whether BLDC or AC is right for your borewell? Solar Vipani connects you with dealers who stock both types and will recommend the optimal motor technology based on your specific site conditions.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is BLDC solar pump better than AC?",
      "answer": "BLDC is better for 1–3 HP applications — it is 10–20% more efficient, costs less, needs fewer panels, and runs longer hours each day. However, AC is better above 3 HP (more choices, wider service network) and for deep borewells over 200 feet. Each technology has its ideal use case."
    },
    {
      "question": "How long does a BLDC solar pump motor last?",
      "answer": "BLDC motors last 10–15 years because they have no brushes or mechanical contact points that wear. Compare this to AC induction motors at 8–12 years. The trade-off is that BLDC repairs require authorised service centres — a local motor shop cannot rewind them."
    },
    {
      "question": "Can I convert my AC solar pump to BLDC?",
      "answer": "No. BLDC pumps use fundamentally different motors and controllers. You would need to replace the entire pump-motor-controller assembly. However, you can keep your existing solar panels — BLDC controllers accept the same DC input."
    },
    {
      "question": "What HP range is available in BLDC solar pumps?",
      "answer": "Most manufacturers offer BLDC solar pumps from 0.5 HP to 3 HP. A few brands (Shakti, CRI) have introduced 5 HP BLDC models, but availability is limited. Above 5 HP, AC induction motors are the only practical option."
    },
    {
      "question": "Do BLDC pumps work on cloudy days?",
      "answer": "Yes, and they perform better than AC pumps on cloudy days. BLDC motors start at 30–40% of rated sunlight intensity versus 50–60% for AC. This means a BLDC pump starts pumping earlier in the morning, runs later in the evening, and maintains operation during partial cloud cover."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'bldc' AND pillar_slug = 'solar-pumps';


-- 4. CLUSTER: controller
UPDATE seo_pages SET
  h1 = 'Solar Pump Controller in India: Types, Price & How to Choose',
  meta_title = 'Solar Pump Controller India: MPPT, VFD Types & Buying Guide | Solar Vipani',
  meta_description = 'Solar pump controller prices from ₹5,000 (DC driver) to ₹50,000 (10 HP VFD). MPPT vs PWM, AC vs DC controllers, key features, and top brands explained.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar pump controller is the brain of your <a href=\"/in/solar-pumps/\">solar pump</a> system — it regulates power from <a href=\"/in/solar-panels/\">solar panels</a>, protects the motor, and in AC systems converts DC to three-phase AC. Prices range from ₹5,000 for a basic DC driver to ₹50,000 for a 10 HP VFD. Always choose a controller with <strong>MPPT</strong> (Maximum Power Point Tracking) — it extracts 15–20% more water than PWM controllers.</p>"
    },
    {
      "heading": "What Does a Solar Pump Controller Do?",
      "body": "<p>The controller performs four critical functions:</p><ol><li><strong>MPPT (Maximum Power Point Tracking)</strong> — continuously adjusts voltage and current to extract maximum power from the solar panels as sunlight varies. This alone increases daily water output by 15–20% compared to controllers without MPPT.</li><li><strong>DC to AC conversion (VFD)</strong> — for AC pump motors, the controller converts panel DC power to three-phase AC at variable frequency. The frequency adjusts automatically with available power.</li><li><strong>Motor protection</strong> — prevents damage from:<ul><li>Dry run (pump running without water)</li><li>Over-voltage / under-voltage</li><li>Overload / overcurrent</li><li>Reverse polarity</li></ul></li><li><strong>Soft start</strong> — ramps motor speed gradually instead of a sudden start, reducing mechanical stress on the pump and pipes.</li></ol>"
    },
    {
      "heading": "Types of Solar Pump Controllers",
      "body": "<table><thead><tr><th>Controller Type</th><th>Used With</th><th>HP Range</th><th>Price Range</th></tr></thead><tbody><tr><td>DC MPPT Driver</td><td><a href=\"/in/solar-pumps/bldc/\">BLDC pumps</a></td><td>0.5–3 HP</td><td>₹5,000–₹15,000</td></tr><tr><td>Solar VFD (AC)</td><td>AC induction pumps</td><td>1–10+ HP</td><td>₹12,000–₹50,000</td></tr><tr><td>Hybrid Controller</td><td>AC pumps (solar + grid)</td><td>1–10 HP</td><td>₹18,000–₹55,000</td></tr></tbody></table><p><strong>DC MPPT drivers</strong> are simpler and cheaper — they regulate DC power directly to <a href=\"/in/solar-pumps/bldc/\">BLDC motors</a>. No frequency conversion is needed.</p><p><strong>Solar VFDs</strong> (Variable Frequency Drives) handle the DC-to-AC conversion needed for standard induction motors. They are the most common controller type in Indian solar pump installations.</p><p><strong>Hybrid controllers</strong> can switch between solar and grid power, useful for pumps that need to run after sunset occasionally.</p>"
    },
    {
      "heading": "MPPT vs PWM Controllers",
      "body": "<p>The tracking algorithm makes a significant difference in daily water output:</p><table><thead><tr><th>Feature</th><th>MPPT Controller</th><th>PWM Controller</th></tr></thead><tbody><tr><td>Tracking efficiency</td><td>97–99%</td><td>70–80%</td></tr><tr><td>Extra water output</td><td>15–20% more</td><td>Baseline</td></tr><tr><td>Low-light performance</td><td>Starts at 30–40% light</td><td>Needs 50–60% light</td></tr><tr><td>Cost (3 HP)</td><td>₹15,000–₹25,000</td><td>₹8,000–₹12,000</td></tr><tr><td>Availability</td><td>Standard in new systems</td><td>Older/budget systems</td></tr></tbody></table><p><strong>Always choose MPPT.</strong> The ₹5,000–₹10,000 premium pays for itself in extra water output within months. All <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> approved systems must have MPPT controllers.</p>"
    },
    {
      "heading": "Controller Price by Pump HP",
      "body": "<table><thead><tr><th>Pump HP</th><th>DC MPPT Driver</th><th>Solar VFD (AC MPPT)</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>₹5,000–₹8,000</td><td>₹8,000–₹15,000</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>₹8,000–₹12,000</td><td>₹12,000–₹18,000</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>₹10,000–₹15,000</td><td>₹15,000–₹25,000</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>N/A</td><td>₹25,000–₹35,000</td></tr><tr><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>N/A</td><td>₹30,000–₹40,000</td></tr><tr><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>N/A</td><td>₹35,000–₹50,000</td></tr></tbody></table><p>Controllers are always sold as part of a complete pump system. If replacing a failed controller, ensure the replacement matches your motor specifications exactly.</p>"
    },
    {
      "heading": "Key Features to Look For",
      "body": "<ul><li><strong>MPPT tracking</strong> — non-negotiable for any new installation</li><li><strong>Dry-run protection</strong> — automatic shutdown when pump runs out of water. Essential for <a href=\"/in/solar-pumps/borewell/\">borewell</a> installations.</li><li><strong>LCD display</strong> — shows real-time data: panel voltage, motor current, flow rate, fault codes. Helps diagnose issues without a technician.</li><li><strong>Data logging</strong> — stores daily pumping data (litres pumped, hours run). Useful for monitoring system health and reporting to KUSUM inspectors.</li><li><strong>Remote monitoring (optional)</strong> — GSM/IoT-enabled controllers send data to a mobile app. Premium feature, adds ₹3,000–₹5,000 to cost.</li><li><strong>IP65 enclosure</strong> — weatherproof rating for outdoor installation. The controller is typically mounted on a wall or pole near the panels.</li><li><strong>Wide MPPT voltage window</strong> — controllers with wider input voltage range (150–500V) offer more flexibility in panel string configuration.</li></ul>"
    },
    {
      "heading": "Top Solar Pump Controller Brands",
      "body": "<ul><li><strong>Delta</strong> — industrial-grade VFDs adapted for solar, excellent reliability</li><li><strong>ABB</strong> — premium solar pump drives, wide HP range</li><li><strong>Shakti</strong> — in-house controllers matched to Shakti motors, good value</li><li><strong>Schneider Electric</strong> — Altivar series with solar MPPT, industrial build quality</li><li><strong>INVT</strong> — cost-effective Chinese brand with growing Indian service network</li><li><strong>Havells</strong> — domestic brand with 1–10 HP solar VFDs</li></ul><p>Most solar pump system vendors supply controllers pre-matched to their motors. If buying a controller separately (e.g., for an existing motor), ensure compatibility with motor voltage, current rating, and phase configuration.</p>"
    },
    {
      "heading": "Get a Complete Solar Pump System",
      "body": "<p>Controllers are best purchased as part of a matched system — panels, controller, and motor tested together for optimal performance. Solar Vipani connects you with verified dealers who supply pre-tested, warranty-backed systems.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the difference between a solar pump controller and a regular VFD?",
      "answer": "A solar pump controller is a specialised VFD that includes MPPT tracking for solar panels, soft-start for gradual motor ramp-up, and pump-specific protections (dry run, over-voltage). A regular industrial VFD runs on fixed grid power and lacks these solar-specific features."
    },
    {
      "question": "Can I use one controller for two pumps?",
      "answer": "No. Each controller drives one motor. If you have two pumps, you need two controllers and two separate panel arrays. Some controllers support dual-motor switching (morning pump A, afternoon pump B), but this is a specialised feature not common in standard solar pump controllers."
    },
    {
      "question": "How long does a solar pump controller last?",
      "answer": "A quality solar pump controller lasts 10–15 years. It has no moving parts — failures are typically due to power surges or moisture ingress. Using a controller with IP65 weatherproofing and proper earthing extends its life. Most brands offer 2–5 year warranties."
    },
    {
      "question": "Can I replace my controller with a different brand?",
      "answer": "Yes, as long as the replacement matches your motor specifications: HP rating, voltage (single-phase or three-phase), and current rating. However, matched controller-motor pairs from the same brand perform better because they are factory-tuned together."
    },
    {
      "question": "Why is MPPT important in a solar pump controller?",
      "answer": "MPPT extracts 15–20% more energy from solar panels by continuously tracking the optimal voltage-current operating point. Without MPPT, the controller operates at a fixed voltage — wasting power when conditions change. Over a year, MPPT delivers 15–20% more water from the same panels."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'controller' AND pillar_slug = 'solar-pumps';

COMMIT;
