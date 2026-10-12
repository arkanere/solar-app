-- Solar Pumps Clusters Batch 2: submersible, surface, irrigation, 1hp
-- Run: psql $POSTGRES_URL < 023-solar-pumps-clusters-batch2.sql

BEGIN;

-- 1. CLUSTER: submersible
UPDATE seo_pages SET
  h1 = 'Solar Submersible Pumps in India: Prices, Sizes & Best Brands',
  meta_title = 'Solar Submersible Pump India: Price, HP Sizes & Borewell Guide | Solar Vipani',
  meta_description = 'Solar submersible pump prices from ₹65,000 (1 HP) to ₹4,50,000 (10 HP). Compare AC vs DC, borewell depth ratings, and top brands like Shakti, Kirloskar, CRI.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar submersible pump is a sealed motor-pump unit lowered inside a <a href=\"/in/solar-pumps/borewell/\">borewell</a> and powered entirely by <a href=\"/in/solar-panels/\">solar panels</a> on the surface. It is the most common solar pump type in Indian agriculture — over 70% of solar pumps installed under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> are submersibles. Prices range from ₹65,000 (1 HP) to ₹4,50,000 (10 HP) before subsidy.</p>"
    },
    {
      "heading": "How Solar Submersible Pumps Work",
      "body": "<p>A submersible pump sits below the water level inside a borewell. Solar panels on the surface generate DC electricity, which flows through a <a href=\"/in/solar-pumps/controller/\">controller</a> to the motor submerged in the well. The motor drives multi-stage impellers that push water up through delivery pipes to a storage tank or irrigation outlet.</p><p>Key advantages of submersible design:</p><ul><li><strong>No priming needed</strong> — the pump is already underwater, eliminating air-lock issues</li><li><strong>Handles deep borewells</strong> — can push water from 30 feet to 1,000+ feet depth</li><li><strong>Silent operation</strong> — no noise since the motor is underground</li><li><strong>Low maintenance</strong> — sealed construction protects against dust and weather</li></ul><p>The <a href=\"/in/solar-pumps/how-it-works/\">controller</a> performs MPPT tracking, converts DC to AC (for AC motors), and provides dry-run protection to prevent damage when the water level drops below the pump intake.</p>"
    },
    {
      "heading": "Solar Submersible Pump Prices by HP",
      "body": "<table><thead><tr><th>HP</th><th>Borewell Depth Range</th><th>System Price (before subsidy)</th><th>Daily Water Output</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>Up to 150 ft</td><td>₹65,000–₹90,000</td><td>40,000–60,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>Up to 200 ft</td><td>₹1,10,000–₹1,40,000</td><td>80,000–1,20,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>Up to 300 ft</td><td>₹1,50,000–₹1,80,000</td><td>1,20,000–1,80,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>Up to 400 ft</td><td>₹2,20,000–₹2,80,000</td><td>2,00,000–3,00,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>Up to 500 ft</td><td>₹2,80,000–₹3,60,000</td><td>3,00,000–4,50,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>Up to 600+ ft</td><td>₹3,50,000–₹4,50,000</td><td>4,00,000–6,00,000 L</td></tr></tbody></table><p><em>Output varies with actual borewell depth and total dynamic head. Deeper borewells yield less water per day at the same HP. <a href=\"/in/solar-pumps/price/\">Complete price guide →</a></em></p>"
    },
    {
      "heading": "AC vs DC Submersible Pumps",
      "body": "<p>Both motor technologies are available in submersible form:</p><table><thead><tr><th>Feature</th><th>DC (<a href=\"/in/solar-pumps/bldc/\">BLDC</a>) Submersible</th><th>AC Submersible</th></tr></thead><tbody><tr><td>HP range</td><td>0.5–3 HP</td><td>1–10+ HP</td></tr><tr><td>Efficiency</td><td>85–92%</td><td>75–85%</td></tr><tr><td>Starts at</td><td>30–40% sunlight</td><td>50–60% sunlight</td></tr><tr><td>Controller</td><td>Simple DC driver</td><td>VFD (DC→AC)</td></tr><tr><td>Service availability</td><td>Limited to authorised centres</td><td>Any motor rewinding shop</td></tr><tr><td>Price (3 HP)</td><td>₹1,30,000–₹1,60,000</td><td>₹1,50,000–₹1,80,000</td></tr></tbody></table><p>For borewells up to 200 feet and farms under 4 acres, <a href=\"/in/solar-pumps/bldc/\">BLDC submersibles</a> offer better value. For deeper borewells and larger farms, AC submersibles are the proven choice.</p>"
    },
    {
      "heading": "Choosing the Right Borewell Size",
      "body": "<p>The borewell pipe diameter determines which submersible pump can fit inside:</p><table><thead><tr><th>Borewell Diameter</th><th>Suitable Pump HP</th><th>Motor Diameter</th></tr></thead><tbody><tr><td>4 inch (100 mm)</td><td>1–3 HP</td><td>95 mm</td></tr><tr><td>5 inch (125 mm)</td><td>3–5 HP</td><td>100–115 mm</td></tr><tr><td>6 inch (150 mm)</td><td>5–10 HP</td><td>115–140 mm</td></tr><tr><td>8 inch (200 mm)</td><td>7.5–15 HP</td><td>140–175 mm</td></tr></tbody></table><p>Most Indian borewells are 4.5–6 inches in diameter. Before purchasing, measure your borewell casing diameter and depth. Your dealer will recommend a pump model that fits your specific borewell.</p>"
    },
    {
      "heading": "Installation Process for Submersible Solar Pumps",
      "body": "<p>Installation typically takes 1–2 days and involves:</p><ol><li><strong>Site survey</strong> — measure borewell depth, static water level, casing diameter, and delivery head requirement</li><li><strong>Panel mounting</strong> — install ground-mount or elevated structure for solar panels near the borewell. Panels face south at 15–20° tilt for year-round optimisation.</li><li><strong>Pump lowering</strong> — the submersible motor-pump assembly is lowered into the borewell using GI (galvanised iron) or HDPE delivery pipes. Safety cable attached to prevent accidental drop.</li><li><strong>Controller installation</strong> — wall-mounted near the panels, connected to both the panel array and the pump motor via submersible cable</li><li><strong>Testing and commissioning</strong> — verify water flow rate, check protections (dry run, over-voltage), and hand over to the farmer</li></ol><p>A qualified dealer handles the entire process. For <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM</a> installations, the empanelled vendor also manages government inspection and subsidy paperwork.</p>"
    },
    {
      "heading": "Top Brands for Solar Submersible Pumps",
      "body": "<p>Leading solar submersible pump brands available in India:</p><ul><li><strong>Shakti Pumps</strong> — India''s largest solar pump manufacturer; wide range from 1–25 HP, MNRE-empanelled</li><li><strong>Kirloskar Solar</strong> — trusted motor brand; strong after-sales network across India</li><li><strong>CRI Pumps</strong> — popular in South India; known for durable stainless steel impellers</li><li><strong>Lubi Solar</strong> — good value in the 1–5 HP range; strong presence in Gujarat and Rajasthan</li><li><strong>Tata Solar / Tata Power</strong> — premium build quality; integrated with Tata panel offerings</li><li><strong>Oswal Pumps</strong> — competitive pricing in the 3–7.5 HP submersible segment</li></ul><p>All these brands are empanelled under KUSUM Yojana. Choose based on local service availability — after-sales support matters more than brand premium for agricultural equipment.</p>"
    },
    {
      "heading": "Get Quotes for Your Borewell",
      "body": "<p>The right submersible pump depends on your borewell depth, water level, and irrigation needs. Solar Vipani connects you with verified dealers who will survey your borewell and recommend the optimal HP and brand.</p><p>Fill one form and receive 2–3 competitive quotes from verified solar pump dealers near you — free, with no obligation.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How deep can a solar submersible pump go?",
      "answer": "Solar submersible pumps can draw water from depths of 30 feet to over 1,000 feet depending on HP rating. A 3 HP pump handles up to 300 feet, a 5 HP up to 400 feet, and a 10 HP up to 600+ feet. For extreme depths, multi-stage pumps with 15+ HP are available."
    },
    {
      "question": "Can I use a submersible solar pump without a borewell?",
      "answer": "Yes, but it is not common. Submersible pumps can be used in open wells that are deep enough to submerge the motor (minimum 3–5 feet of water above the motor). However, for open wells a surface pump is usually more practical and cheaper."
    },
    {
      "question": "How long does a solar submersible pump last?",
      "answer": "A quality submersible motor lasts 8–12 years with no maintenance since it is sealed. Solar panels last 25+ years. The controller lasts 10–15 years. The main wearable parts are pump impellers, which may need replacement after 7–10 years depending on water quality and sand content."
    },
    {
      "question": "What size borewell do I need for a solar submersible pump?",
      "answer": "A 4-inch borewell fits 1–3 HP pumps, 5-inch fits 3–5 HP, and 6-inch or larger fits 5–10 HP. Most Indian borewells are 4.5–6 inches. Always verify your borewell casing diameter before buying — installing a pump in a too-small borewell can cause jamming and motor damage."
    },
    {
      "question": "Is it better to buy AC or DC submersible solar pump?",
      "answer": "DC (BLDC) submersibles are better for small borewells (up to 200 feet) and 1–3 HP applications — they are more efficient and start pumping in lower light. AC submersibles are better for deep borewells (200+ feet), higher HP (5–10 HP), and areas where local motor rewinding shops can service them."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'submersible' AND pillar_slug = 'solar-pumps';


-- 2. CLUSTER: surface
UPDATE seo_pages SET
  h1 = 'Solar Surface Pumps in India: Price, Types & Best Uses',
  meta_title = 'Solar Surface Pump India: Price, HP Sizes & Open Well Guide | Solar Vipani',
  meta_description = 'Solar surface pump prices from ₹45,000 (1 HP) to ₹2,20,000 (5 HP). Ideal for open wells, ponds, and canals. Compare self-priming, centrifugal, and monoblock types.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar surface pump sits above ground and draws water from open wells, ponds, canals, or tanks using suction. It costs <strong>20–30% less</strong> than a <a href=\"/in/solar-pumps/submersible/\">submersible pump</a> at the same HP but is limited to water sources within 15–20 feet of the pump location. Prices range from ₹45,000 (1 HP) to ₹2,20,000 (5 HP) before <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM subsidy</a>.</p>"
    },
    {
      "heading": "How Solar Surface Pumps Work",
      "body": "<p>A surface pump is mounted on the ground near the water source. A suction pipe dips into the water, and the pump creates a vacuum to draw water up and push it through a delivery pipe to a tank or <a href=\"/in/solar-pumps/irrigation/\">irrigation system</a>.</p><p>Solar panels power the motor through a <a href=\"/in/solar-pumps/controller/\">controller</a>. The key limitation is <strong>suction lift</strong> — physics limits how high a pump can suck water to about 20–25 feet (6–7.5 metres) at sea level. For deeper water sources, a <a href=\"/in/solar-pumps/submersible/\">submersible pump</a> is required.</p><p>Surface pumps are self-priming or require manual priming (filling the suction pipe with water before starting). Most modern solar surface pumps are self-priming for convenience.</p>"
    },
    {
      "heading": "Solar Surface Pump Prices",
      "body": "<table><thead><tr><th>HP</th><th>Max Suction Lift</th><th>System Price (before subsidy)</th><th>Daily Output</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>15–20 ft</td><td>₹45,000–₹65,000</td><td>30,000–50,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>15–20 ft</td><td>₹80,000–₹1,10,000</td><td>60,000–1,00,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>15–20 ft</td><td>₹1,10,000–₹1,40,000</td><td>1,00,000–1,50,000 L</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>20–25 ft</td><td>₹1,60,000–₹2,20,000</td><td>1,80,000–2,50,000 L</td></tr></tbody></table><p>Surface pumps are cost-effective when the water source is shallow and accessible. For <a href=\"/in/solar-pumps/borewell/\">borewell</a> applications, submersible pumps are the only option. <a href=\"/in/solar-pumps/price/\">Full price comparison →</a></p>"
    },
    {
      "heading": "Types of Solar Surface Pumps",
      "body": "<p>Three main types of surface pumps are used with solar:</p><ol><li><strong>Self-priming centrifugal</strong> — most popular for solar. Can prime itself (draw water without manual filling). Good for suction lifts up to 15–20 feet. Handles small solids in water.</li><li><strong>Monoblock pump</strong> — motor and pump in one compact unit. Cost-effective but typically not self-priming. Common in the 1–3 HP range.</li><li><strong>Jet pump</strong> — uses a venturi nozzle to increase suction lift up to 25–30 feet. Sacrifices flow rate for extra lift. Useful for deeper open wells at the edge of surface pump capability.</li></ol><p>For most farm applications with open wells, a self-priming centrifugal pump paired with a solar <a href=\"/in/solar-pumps/controller/\">MPPT controller</a> is the standard recommendation.</p>"
    },
    {
      "heading": "When to Choose a Surface Pump vs Submersible",
      "body": "<table><thead><tr><th>Factor</th><th>Surface Pump</th><th><a href=\"/in/solar-pumps/submersible/\">Submersible Pump</a></th></tr></thead><tbody><tr><td>Water source</td><td>Open well, pond, canal, river</td><td>Borewell, deep open well</td></tr><tr><td>Max depth</td><td>15–25 feet</td><td>30–1,000+ feet</td></tr><tr><td>Cost</td><td>20–30% lower</td><td>Higher</td></tr><tr><td>Maintenance</td><td>Easy — accessible above ground</td><td>Requires pullout for service</td></tr><tr><td>Noise</td><td>Audible motor noise</td><td>Silent (motor underground)</td></tr><tr><td>Priming</td><td>Required (unless self-priming)</td><td>Not needed</td></tr></tbody></table><p>If your water source is an open well within 15 feet of the surface, a surface pump saves money and is easier to maintain. If you have a <a href=\"/in/solar-pumps/borewell/\">borewell</a> or deep well, go submersible.</p>"
    },
    {
      "heading": "Best Applications for Solar Surface Pumps",
      "body": "<ul><li><strong>Open well irrigation</strong> — drawing from traditional open wells with water tables within 20 feet of the surface</li><li><strong>Pond and canal lifting</strong> — transferring water from farm ponds, canals, or reservoirs to fields</li><li><strong>Drip irrigation feeding</strong> — surface pumps pair well with drip systems as they deliver consistent pressure at moderate flow rates</li><li><strong><a href=\"/in/solar-pumps/for-home/\">Home water supply</a></strong> — drawing from ground-level tanks or shallow wells to overhead tanks</li><li><strong>Fish farming</strong> — circulating water in aquaculture ponds</li><li><strong>Livestock watering</strong> — pumping from nearby streams or ponds to animal drinking troughs</li></ul><p>Surface pumps are ideal for regions like coastal Maharashtra, West Bengal, and Kerala where open wells and high water tables are common. For dry regions with deep borewells (Rajasthan, Karnataka), <a href=\"/in/solar-pumps/submersible/\">submersible pumps</a> are the better fit.</p>"
    },
    {
      "heading": "Installation and Maintenance",
      "body": "<p><strong>Installation:</strong> Simpler than submersible systems. The pump sits on a concrete base near the water source. Solar panels mount on a ground frame or nearby rooftop. A suction pipe (with foot valve) goes into the water, and a delivery pipe runs to the storage tank or field.</p><p><strong>Maintenance advantages:</strong></p><ul><li>Accessible above ground — no borewell pullout required for servicing</li><li>Mechanical seal and bearings can be replaced locally</li><li>Suction and delivery pipes are visible and easy to inspect</li><li>Standard motors — any local motor shop can rewind or repair</li></ul><p><strong>Routine maintenance:</strong></p><ul><li>Check foot valve and suction pipe joints monthly for air leaks</li><li>Clean pump strainer/filter weekly if water has debris</li><li>Grease motor bearings every 6 months</li><li>Clean solar panels every 2–4 weeks</li></ul>"
    },
    {
      "heading": "Get Quotes for Your Open Well or Pond",
      "body": "<p>Solar Vipani connects you with verified dealers who stock all major surface pump brands — Kirloskar, CRI, Lubi, Shakti, and more. A dealer will assess your water source and recommend the right HP and pump type.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the maximum suction depth for a solar surface pump?",
      "answer": "Standard surface pumps can draw water from up to 15–20 feet (5–6 metres) below the pump level. Jet-type surface pumps can reach 25–30 feet. Beyond that, physics prevents a suction pump from working — you need a submersible pump for deeper water sources."
    },
    {
      "question": "Can I use a solar surface pump for a borewell?",
      "answer": "Only if the water level in the borewell is within 15–20 feet of the ground surface. Most borewells in India have water levels deeper than 50 feet, which is beyond surface pump capability. For borewells, a submersible pump is the correct choice."
    },
    {
      "question": "How much does a 2 HP solar surface pump cost?",
      "answer": "A 2 HP solar surface pump costs ₹80,000–₹1,10,000 for a complete system with panels, controller, and pump before subsidy. Under KUSUM Yojana, farmers pay ₹24,000–₹44,000. The system delivers 60,000–1,00,000 litres per day from open wells."
    },
    {
      "question": "Do solar surface pumps need priming?",
      "answer": "Standard centrifugal surface pumps require priming — filling the suction pipe with water before starting. Self-priming models automatically draw water after initial priming. For solar setups that start and stop with sunlight, self-priming pumps are recommended as they restart without manual intervention."
    },
    {
      "question": "Which is better for farming — surface pump or submersible?",
      "answer": "It depends on your water source. Surface pumps are cheaper and easier to maintain, ideal for open wells with water within 20 feet. Submersible pumps are necessary for borewells and deeper sources. If you have both options, a surface pump on an open well is more cost-effective."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'surface' AND pillar_slug = 'solar-pumps';


-- 3. CLUSTER: irrigation
UPDATE seo_pages SET
  h1 = 'Solar Pumps for Irrigation in India: Complete Farmer''s Guide',
  meta_title = 'Solar Pump for Irrigation India: Sizing, Cost & KUSUM Subsidy | Solar Vipani',
  meta_description = 'Solar irrigation pumps from 1 HP to 10 HP for farms 1–20 acres. Drip, sprinkler, and flood irrigation compatibility. KUSUM Yojana covers up to 90% of pump cost.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar-powered irrigation eliminates fuel costs and grid dependency for Indian farmers. A solar pump system sized correctly for your farm can deliver 40,000–6,00,000 litres of water per day — enough for 1 to 20+ acres depending on crop type and irrigation method. The <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> subsidises up to 90% of the system cost, making solar irrigation affordable for small and marginal farmers.</p>"
    },
    {
      "heading": "Why Solar Irrigation Makes Sense for Indian Farms",
      "body": "<p>Indian agriculture depends heavily on groundwater — over 60% of irrigated land uses tube wells and borewells. Most of these pumps run on diesel or erratic grid supply. Solar irrigation solves three critical problems:</p><ul><li><strong>Zero fuel cost</strong> — diesel pumps cost ₹30,000–₹80,000 per year in fuel alone. Solar pumps run on free sunlight.</li><li><strong>No grid dependency</strong> — rural electricity supply averages 12–16 hours per day with voltage fluctuations. Solar pumps work independently.</li><li><strong>Reduced carbon footprint</strong> — a single 5 HP diesel pump replaced by solar saves 3–5 tonnes of CO₂ emissions annually.</li></ul><p>When you factor in government subsidies covering 60–90% of the cost, the payback period drops to 1–3 years even without subsidy on fuel savings alone.</p>"
    },
    {
      "heading": "Sizing Your Solar Pump for Irrigation",
      "body": "<p>Pump sizing depends on three factors: farm size, water source depth, and irrigation method.</p><table><thead><tr><th>Farm Size</th><th>Daily Water Need</th><th>Recommended HP</th><th>Best Irrigation Method</th></tr></thead><tbody><tr><td>1–2 acres</td><td>30,000–60,000 L</td><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>Drip / micro-sprinkler</td></tr><tr><td>2–4 acres</td><td>60,000–1,20,000 L</td><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a> – <a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>Drip / sprinkler</td></tr><tr><td>4–8 acres</td><td>1,20,000–2,50,000 L</td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a> – <a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>Sprinkler / flood</td></tr><tr><td>8–15 acres</td><td>2,50,000–4,50,000 L</td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a> – <a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>Sprinkler / flood</td></tr><tr><td>15–20+ acres</td><td>4,50,000–6,00,000+ L</td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a> – <a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>Flood / sprinkler</td></tr></tbody></table><p><em>Water needs vary by crop: vegetables need 4–6 mm/day, sugarcane 6–8 mm/day, paddy 8–10 mm/day. Drip irrigation cuts water use by 40–60% compared to flood.</em></p>"
    },
    {
      "heading": "Solar Pump Compatible Irrigation Methods",
      "body": "<p>Solar pumps work with all irrigation systems. The choice depends on crop type, water availability, and farm layout:</p><p><strong>Drip irrigation</strong></p><ul><li>Most water-efficient method — 90–95% efficiency vs 40–50% for flood</li><li>Low pressure requirement (1–2 kg/cm²) — ideal for solar pumps with variable output</li><li>A <a href=\"/in/solar-pumps/1hp/\">1 HP solar pump</a> can feed drip lines for 2–3 acres</li><li>Best for: vegetables, fruits, orchard crops, cash crops</li></ul><p><strong>Sprinkler irrigation</strong></p><ul><li>Good efficiency (70–80%) with even coverage over large areas</li><li>Requires moderate pressure (2–3 kg/cm²) — 3+ HP pumps recommended</li><li>Works well with farm ponds as buffer storage</li><li>Best for: wheat, pulses, groundnut, cotton, fodder crops</li></ul><p><strong>Flood irrigation</strong></p><ul><li>Traditional method — lowest efficiency (40–50%) but familiar to most farmers</li><li>Requires high flow rates — <a href=\"/in/solar-pumps/5hp/\">5 HP</a> or higher pumps</li><li>Works best with solar when water is stored in a pond during the day and released at once</li><li>Best for: paddy, sugarcane, large grain farms</li></ul>"
    },
    {
      "heading": "Water Storage for Solar Irrigation",
      "body": "<p>Since solar pumps only operate during daylight, water storage is essential for flexible irrigation scheduling:</p><ul><li><strong>Farm ponds</strong> — excavated ponds lined with HDPE sheets. Cost: ₹20,000–₹50,000 for 50,000-litre capacity. Government subsidy available under MGNREGA and state schemes.</li><li><strong>Overhead tanks</strong> — concrete or PVC tanks elevated for gravity-fed drip/sprinkler. Cost: ₹10,000–₹30,000 for 5,000–10,000 litres.</li><li><strong>Underground sumps</strong> — brick-and-cement tanks for large storage. Cost: ₹30,000–₹80,000 for 1,00,000+ litres.</li></ul><p>Strategy: pump water into storage throughout the day, then irrigate by gravity in the evening or early morning when evaporation losses are lowest.</p>"
    },
    {
      "heading": "Cost of Solar Irrigation Systems",
      "body": "<p>Total cost includes the solar pump system plus irrigation infrastructure:</p><table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar pump system (3 HP)</td><td>₹1,40,000–₹1,80,000</td></tr><tr><td>KUSUM subsidy (60%)</td><td>-₹84,000–₹1,08,000</td></tr><tr><td>Farmer''s pump cost</td><td>₹42,000–₹72,000</td></tr><tr><td>Drip system (2 acres)</td><td>₹25,000–₹40,000</td></tr><tr><td>Farm pond (50,000 L)</td><td>₹20,000–₹40,000</td></tr><tr><td><strong>Total farmer investment</strong></td><td><strong>₹87,000–₹1,52,000</strong></td></tr></tbody></table><p>This replaces annual diesel costs of ₹30,000–₹60,000 — so the entire system pays for itself in 2–4 years. <a href=\"/in/solar-pumps/price/\">Detailed pump pricing →</a></p>"
    },
    {
      "heading": "Government Support for Solar Irrigation",
      "body": "<p>Multiple government schemes support solar irrigation adoption:</p><ul><li><strong><a href=\"/in/solar-pumps/kusum-yojana/\">PM-KUSUM Yojana</a></strong> — 60% subsidy on standalone solar pumps up to 7.5 HP (Component B)</li><li><strong>PMKSY (Pradhan Mantri Krishi Sinchayee Yojana)</strong> — 55–90% subsidy on micro-irrigation (drip, sprinkler) systems</li><li><strong>MGNREGA</strong> — farm pond construction covered under MGNREGA in most states</li><li><strong>State schemes</strong> — additional subsidies vary by state. Rajasthan, Maharashtra, MP, and UP offer the most generous combined benefits.</li></ul><p>By combining KUSUM (pump) + PMKSY (drip/sprinkler) + MGNREGA (farm pond), a farmer can build a complete solar irrigation system for under ₹30,000 out of pocket.</p>"
    },
    {
      "heading": "Get Your Farm Assessed",
      "body": "<p>Every farm is different — your borewell depth, water table, crop mix, and acreage determine the right pump size and irrigation system. Solar Vipani connects you with verified dealers who will conduct a free site assessment and recommend an optimised solar irrigation solution.</p><p><a href=\"/in/get-quotes/\">Get free solar irrigation quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How many acres can a solar pump irrigate?",
      "answer": "A 1 HP pump covers 1–2 acres, 3 HP covers 4–6 acres, 5 HP covers 6–10 acres, and 7.5–10 HP covers 10–20 acres. Actual coverage depends on crop type, irrigation method (drip is most efficient), and water availability. Using drip irrigation can nearly double the area covered by the same pump."
    },
    {
      "question": "Can I use a solar pump with drip irrigation?",
      "answer": "Yes, and it is the ideal combination. Drip irrigation needs low pressure (1–2 kg/cm²) which solar pumps deliver easily, even during partial sunlight. A 1 HP solar pump can feed drip lines for 2–3 acres. The pump fills a header tank during the day, and drip lines distribute water evenly to each plant."
    },
    {
      "question": "Is solar irrigation profitable for small farmers?",
      "answer": "Yes. A 2-acre farmer spending ₹20,000–₹40,000/year on diesel can switch to solar for ₹15,000–₹40,000 out of pocket (after KUSUM + state subsidies). The system pays for itself in 1–2 years. After that, irrigation is essentially free for 20+ years."
    },
    {
      "question": "What crops benefit most from solar irrigation?",
      "answer": "High-value crops like vegetables, fruits, and floriculture benefit most because they need precise water management that solar + drip delivers efficiently. However, all crops benefit — even traditional crops like wheat, cotton, and pulses see 20–40% yield improvement with reliable irrigation compared to rain-fed farming."
    },
    {
      "question": "How do I irrigate at night if the solar pump stops at sunset?",
      "answer": "Store water in a farm pond or overhead tank during the day and release it at night using gravity. This is standard practice for solar irrigation. A 50,000-litre farm pond costs ₹20,000–₹40,000 and stores enough water for one night''s irrigation of 2–4 acres under drip."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'irrigation' AND pillar_slug = 'solar-pumps';


-- 4. CLUSTER: 1hp
UPDATE seo_pages SET
  h1 = '1 HP Solar Pump in India: Price, Specifications & Best Models',
  meta_title = '1 HP Solar Pump Price India 2026: Specs, Output & Subsidy | Solar Vipani',
  meta_description = '1 HP solar pump price ₹60,000–₹90,000 before KUSUM subsidy. Delivers 40,000–60,000 litres/day. Compare AC vs DC, submersible vs surface, and top brands.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 1 HP solar pump in India costs <strong>₹60,000–₹90,000</strong> for a <a href=\"/in/solar-pumps/submersible/\">submersible</a> system and <strong>₹45,000–₹65,000</strong> for a <a href=\"/in/solar-pumps/surface/\">surface</a> system before subsidy. Under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a>, farmers pay only ₹18,000–₹36,000. It delivers 40,000–60,000 litres per day — enough to irrigate 1–2 acres with drip <a href=\"/in/solar-pumps/irrigation/\">irrigation</a> or fill a 1,000-litre overhead tank for <a href=\"/in/solar-pumps/for-home/\">home use</a>.</p>"
    },
    {
      "heading": "1 HP Solar Pump Specifications",
      "body": "<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody><tr><td>Motor power</td><td>1 HP (0.75 kW)</td></tr><tr><td>Solar panel required</td><td>1.2–1.5 kW (2–3 panels of 540W)</td></tr><tr><td>Daily water output</td><td>40,000–60,000 litres (at 30m TDH)</td></tr><tr><td>Max head (submersible)</td><td>100–150 feet</td></tr><tr><td>Max suction (surface)</td><td>15–20 feet</td></tr><tr><td>Operating hours</td><td>6–8 hours/day (sunny conditions)</td></tr><tr><td>Controller type</td><td>MPPT (DC or AC VFD)</td></tr></tbody></table><p><em>Output decreases with depth. At 150 feet, a 1 HP submersible delivers about 30,000 litres/day. At 50 feet, output exceeds 60,000 litres/day.</em></p>"
    },
    {
      "heading": "1 HP Solar Pump Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Submersible System</th><th>Surface System</th></tr></thead><tbody><tr><td>Solar panels (1.2–1.5 kW)</td><td>₹28,000–₹38,000</td><td>₹28,000–₹38,000</td></tr><tr><td>Pump + motor</td><td>₹15,000–₹25,000</td><td>₹8,000–₹12,000</td></tr><tr><td>Controller</td><td>₹8,000–₹15,000</td><td>₹5,000–₹10,000</td></tr><tr><td>Mounting + wiring</td><td>₹5,000–₹8,000</td><td>₹3,000–₹5,000</td></tr><tr><td>Installation</td><td>₹4,000–₹6,000</td><td>₹2,000–₹3,000</td></tr><tr><td><strong>Total</strong></td><td><strong>₹60,000–₹90,000</strong></td><td><strong>₹45,000–₹65,000</strong></td></tr></tbody></table><p>After KUSUM (60% subsidy): submersible ₹18,000–₹36,000, surface ₹14,000–₹26,000. <a href=\"/in/solar-pumps/price/\">Full price guide →</a></p>"
    },
    {
      "heading": "AC vs DC: Which 1 HP Pump to Choose?",
      "body": "<p>At 1 HP, both AC and <a href=\"/in/solar-pumps/bldc/\">DC BLDC</a> options are available:</p><table><thead><tr><th>Feature</th><th>DC BLDC (1 HP)</th><th>AC Induction (1 HP)</th></tr></thead><tbody><tr><td>Price</td><td>₹55,000–₹80,000</td><td>₹65,000–₹90,000</td></tr><tr><td>Efficiency</td><td>85–92%</td><td>75–85%</td></tr><tr><td>Starts at</td><td>30–40% sunlight</td><td>50–60% sunlight</td></tr><tr><td>Panels needed</td><td>1.0–1.2 kW</td><td>1.2–1.5 kW</td></tr><tr><td>Extra daily output</td><td>10–15% more</td><td>Baseline</td></tr><tr><td>Service</td><td>Authorised centres only</td><td>Any motor shop</td></tr></tbody></table><p><strong>Recommendation:</strong> For 1 HP, DC BLDC pumps are the better choice — lower cost, higher efficiency, and they start pumping earlier in the morning. The limited service network is less of a concern since BLDC motors rarely need repair.</p>"
    },
    {
      "heading": "Best Uses for a 1 HP Solar Pump",
      "body": "<ul><li><strong>Small farm irrigation (1–2 acres)</strong> — combined with drip or micro-sprinkler for vegetables, flowers, or fruit saplings</li><li><strong><a href=\"/in/solar-pumps/for-home/\">Home water supply</a></strong> — filling overhead tank from shallow borewell or open well. 1 HP fills a 1,000-litre tank in 20–30 minutes.</li><li><strong>Kitchen garden / nursery</strong> — precision watering for small plots and plant nurseries</li><li><strong>Livestock watering</strong> — supplying water to animal sheds from nearby wells</li><li><strong>Fishpond circulation</strong> — aerating and circulating water in small aquaculture ponds</li></ul><p>For farms larger than 2 acres or borewells deeper than 150 feet, consider a <a href=\"/in/solar-pumps/2hp/\">2 HP</a> or <a href=\"/in/solar-pumps/3hp/\">3 HP</a> pump.</p>"
    },
    {
      "heading": "Panel and Mounting Requirements",
      "body": "<p>A 1 HP solar pump needs 1.2–1.5 kW of solar panels — typically 2–3 panels of 540W each.</p><p><strong>Panel placement:</strong></p><ul><li>Ground mount is standard — panels installed on a steel frame near the pump site</li><li>Panels face south (in India) at 15–20° tilt for year-round optimal output</li><li>Space needed: approximately 50–75 sq ft of shadow-free area</li><li>Distance from controller: keep within 30 metres to minimise cable losses</li></ul><p><strong>Panel type:</strong></p><ul><li><a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline</a> panels are recommended for space-constrained installations</li><li><a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a> panels work fine if space is not a constraint — they cost 10–15% less</li></ul>"
    },
    {
      "heading": "Top 1 HP Solar Pump Models",
      "body": "<table><thead><tr><th>Brand</th><th>Model Type</th><th>Motor</th><th>Price Range</th></tr></thead><tbody><tr><td>Shakti</td><td>Submersible DC</td><td>BLDC</td><td>₹55,000–₹70,000</td></tr><tr><td>Kirloskar</td><td>Submersible AC</td><td>Induction</td><td>₹70,000–₹90,000</td></tr><tr><td>CRI</td><td>Submersible DC</td><td>BLDC</td><td>₹60,000–₹75,000</td></tr><tr><td>Lubi</td><td>Submersible AC</td><td>Induction</td><td>₹60,000–₹80,000</td></tr><tr><td>Kirloskar</td><td>Surface AC</td><td>Induction</td><td>₹50,000–₹65,000</td></tr></tbody></table><p>All prices include panels, controller, and motor. Warranty: 25 years on panels, 5 years on motor and controller.</p>"
    },
    {
      "heading": "Get Quotes for a 1 HP Solar Pump",
      "body": "<p>The right 1 HP pump depends on your water source type and depth. Solar Vipani connects you with verified dealers who will assess your needs and provide detailed quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How much water can a 1 HP solar pump deliver per day?",
      "answer": "A 1 HP solar pump delivers 40,000–60,000 litres per day at 30 metres total dynamic head in good sunlight. Output decreases with depth — at 50 metres, expect about 30,000 litres/day. The pump operates 6–8 hours daily depending on season and cloud cover."
    },
    {
      "question": "How many solar panels are needed for a 1 HP pump?",
      "answer": "A 1 HP solar pump needs 1.2–1.5 kW of solar panels — typically 2–3 panels of 540W each. DC BLDC pumps can work with slightly fewer panels (1.0–1.2 kW) due to their higher efficiency."
    },
    {
      "question": "Can a 1 HP solar pump be used for home water supply?",
      "answer": "Yes. A 1 HP solar pump is ideal for home water supply — it fills a 1,000-litre overhead tank in 20–30 minutes. It works well for drawing water from shallow borewells (up to 150 feet) or open wells. Many homeowners pair it with a rooftop-mounted panel for a compact setup."
    },
    {
      "question": "What is the KUSUM subsidy for a 1 HP solar pump?",
      "answer": "Under KUSUM Component B, a 1 HP solar pump with benchmark cost around ₹75,000 gets 60% subsidy (30% central + 30% state), bringing the farmer''s share to about ₹30,000. Some states reduce this further to ₹7,500–₹15,000 through additional top-up subsidies."
    },
    {
      "question": "Is 1 HP enough for irrigation?",
      "answer": "A 1 HP pump is sufficient for 1–2 acres with drip or micro-sprinkler irrigation. For larger farms, step up to 2 HP (2–4 acres) or 3 HP (4–6 acres). The key is matching pump capacity to your irrigation method — drip uses 40–60% less water than flood, so 1 HP goes further."
    }
  ]',
  updated_at = NOW()
WHERE slug = '1hp' AND pillar_slug = 'solar-pumps';

COMMIT;
