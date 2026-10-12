-- Rooftop Solar Clusters Batch 4: inverter, on-grid-inverter, off-grid-inverter, hybrid-inverter, on-grid-vs-off-grid
-- Run: psql $POSTGRES_URL < 005-rooftop-solar-inverters-comparison.sql

BEGIN;

-- 1. CLUSTER: inverter
UPDATE seo_pages SET
  h1 = 'Solar Inverter for Home in India: Types, Price & How to Choose (2026)',
  meta_title = 'Solar Inverter for Home India: Types, Price & Buying Guide | Solar Vipani',
  meta_description = 'Solar inverters cost ₹15,000–₹80,000 for homes. Compare on-grid, off-grid, and hybrid inverters. Learn sizing, brands, and how to choose the right one.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar inverter converts DC electricity from your panels into 230V AC power for home appliances. It is the <strong>most critical component</strong> after panels — it determines system efficiency, monitoring capability, and whether you can use net metering or battery backup. Prices range from <strong>₹15,000 for a 1kW on-grid inverter to ₹80,000+ for a 10kW hybrid inverter</strong>. The right choice depends on your system type: <a href=\"/in/rooftop-solar/on-grid/\">on-grid</a>, <a href=\"/in/rooftop-solar/off-grid/\">off-grid</a>, or <a href=\"/in/rooftop-solar/hybrid/\">hybrid</a>.</p>"
    },
    {
      "heading": "Types of Solar Inverters",
      "body": "<p>Three main inverter types serve different system architectures:</p><table><thead><tr><th>Type</th><th>Grid Connection</th><th>Battery Support</th><th>Price Range (3kW)</th><th>Best For</th></tr></thead><tbody><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid</a></td><td>Yes</td><td>No</td><td>₹25,000–₹35,000</td><td>Most homes, net metering</td></tr><tr><td><a href=\"/in/rooftop-solar/off-grid-inverter/\">Off-grid</a></td><td>No</td><td>Yes</td><td>₹20,000–₹30,000</td><td>Remote areas, no grid</td></tr><tr><td><a href=\"/in/rooftop-solar/hybrid-inverter/\">Hybrid</a></td><td>Yes</td><td>Yes</td><td>₹35,000–₹55,000</td><td>Grid + battery backup</td></tr></tbody></table><p>A fourth category — <strong>micro-inverters</strong> — attaches one small inverter per panel. They cost 30–50% more but optimise output when panels face different directions or experience partial shading. Rarely used in Indian residential due to cost.</p>"
    },
    {
      "heading": "Solar Inverter Price by Size",
      "body": "<p>Inverter pricing scales with capacity and type:</p><table><thead><tr><th>Capacity</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>1kW</td><td>₹15,000–₹22,000</td><td>₹12,000–₹18,000</td><td>₹20,000–₹30,000</td></tr><tr><td>2kW</td><td>₹20,000–₹28,000</td><td>₹16,000–₹24,000</td><td>₹28,000–₹40,000</td></tr><tr><td>3kW</td><td>₹25,000–₹35,000</td><td>₹20,000–₹30,000</td><td>₹35,000–₹55,000</td></tr><tr><td>5kW</td><td>₹35,000–₹50,000</td><td>₹28,000–₹40,000</td><td>₹50,000–₹70,000</td></tr><tr><td>10kW</td><td>₹55,000–₹80,000</td><td>₹45,000–₹65,000</td><td>₹70,000–₹1,00,000</td></tr></tbody></table><p>The inverter typically accounts for 20–25% of total system cost. Premium brands cost more but offer better efficiency, longer warranties, and superior monitoring apps.</p><p><a href=\"/in/rooftop-solar/cost/\">Full system cost breakdown →</a></p>"
    },
    {
      "heading": "Key Specifications to Compare",
      "body": "<p>When evaluating inverters, these specs matter most:</p><ul><li><strong>Efficiency (%):</strong> Measures DC-to-AC conversion. Top inverters achieve 97–98.5%. A 1% difference on a 5kW system means ~75 extra units/year.</li><li><strong>MPPT channels:</strong> Maximum Power Point Tracking optimises output. Systems with panels on multiple roof faces need 2 MPPT channels. Single-face roofs work fine with 1 MPPT.</li><li><strong>IP rating:</strong> IP65 or higher is needed for outdoor installation. IP20 inverters must be installed indoors.</li><li><strong>Warranty:</strong> Standard is 5 years; premium brands offer 10 years. Extended warranties add ₹2,000–₹5,000.</li><li><strong>Monitoring:</strong> WiFi/app-based monitoring lets you track generation, consumption, and export in real time. Essential for verifying system performance.</li><li><strong>Surge capacity:</strong> Off-grid and hybrid inverters should handle 2× rated capacity for motor startup loads (pumps, compressors).</li></ul>"
    },
    {
      "heading": "Popular Solar Inverter Brands in India",
      "body": "<table><thead><tr><th>Brand</th><th>Origin</th><th>Types Available</th><th>Warranty</th><th>Price Tier</th></tr></thead><tbody><tr><td>Growatt</td><td>China</td><td>On-grid, Hybrid</td><td>5–10 years</td><td>Mid-range</td></tr><tr><td>Goodwe</td><td>China</td><td>On-grid, Hybrid</td><td>5–10 years</td><td>Mid-range</td></tr><tr><td>Solis</td><td>China</td><td>On-grid, Hybrid</td><td>5–10 years</td><td>Budget to mid</td></tr><tr><td>Fronius</td><td>Austria</td><td>On-grid</td><td>5–10 years</td><td>Premium</td></tr><tr><td>SMA</td><td>Germany</td><td>On-grid, Hybrid</td><td>5–10 years</td><td>Premium</td></tr><tr><td>Deye</td><td>China</td><td>Hybrid</td><td>5–10 years</td><td>Mid-range</td></tr><tr><td>Microtek</td><td>India</td><td>Off-grid, Hybrid</td><td>2–5 years</td><td>Budget</td></tr><tr><td>Luminous</td><td>India</td><td>Off-grid, Hybrid</td><td>2–5 years</td><td>Budget</td></tr></tbody></table><p>For on-grid residential systems, Growatt, Goodwe, and Solis dominate the Indian market with the best price-to-quality ratio. For premium installs, Fronius and SMA offer superior efficiency and monitoring.</p>"
    },
    {
      "heading": "How to Size Your Solar Inverter",
      "body": "<p>Inverter sizing depends on your panel array capacity:</p><ul><li><strong>On-grid:</strong> Inverter capacity should be 90–100% of panel capacity. A 3.2kW panel array pairs with a 3kW inverter (slight undersizing is acceptable and common).</li><li><strong>Off-grid:</strong> Size for peak load, not panel capacity. If your maximum simultaneous load is 2.5kW, use a 3kW inverter (add 20% headroom for motor startup surges).</li><li><strong>Hybrid:</strong> Size for the larger of panel capacity or peak load. A 3kW panel array with 2.5kW peak load uses a 3kW hybrid inverter.</li></ul><p><strong>Oversizing penalty:</strong> An inverter running far below rated capacity operates less efficiently. A 10kW inverter on a 3kW panel array wastes money and efficiency.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Use our calculator to size your system</a></p>"
    },
    {
      "heading": "Inverter Lifespan and Maintenance",
      "body": "<p>Inverters are the component most likely to need replacement during your system lifetime:</p><ul><li><strong>Lifespan:</strong> 10–15 years (vs 25+ years for panels)</li><li><strong>Warranty:</strong> 5 years standard, 10 years for premium brands or with extended warranty</li><li><strong>Maintenance:</strong> Keep ventilated, dust-free, and away from direct rain. Check error logs annually. No moving parts means minimal wear.</li><li><strong>Replacement cost:</strong> Plan for one inverter replacement over the 25-year system life. Budget ₹20,000–₹60,000 depending on type and size.</li></ul><p>Choosing a reputable brand with local service support matters more for inverters than for panels — if your inverter fails, your entire system stops producing.</p>"
    },
    {
      "heading": "On-Grid vs Off-Grid vs Hybrid: Which Inverter?",
      "body": "<p>Your inverter type should match your system architecture:</p><ul><li><strong>Choose <a href=\"/in/rooftop-solar/on-grid-inverter/\">on-grid</a></strong> if your area has reliable power and you want the lowest cost + net metering + government subsidy.</li><li><strong>Choose <a href=\"/in/rooftop-solar/off-grid-inverter/\">off-grid</a></strong> if you have no grid connection or need complete energy independence.</li><li><strong>Choose <a href=\"/in/rooftop-solar/hybrid-inverter/\">hybrid</a></strong> if you want net metering savings plus battery backup during power cuts.</li></ul><p>Switching inverter types later means replacing the entire unit. Choose based on your long-term needs, not just current situation.</p><p><a href=\"/in/rooftop-solar/on-grid-vs-off-grid/\">Detailed system comparison →</a></p>"
    },
    {
      "heading": "Get Solar Inverter Quotes",
      "body": "<p>Your installer will recommend an inverter based on your panel configuration, roof layout, and system type. Solar Vipani connects you with verified installers who use quality inverter brands and provide complete system quotes.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is the price of a solar inverter for home in India?",
      "answer": "Solar inverter prices range from ₹15,000 for a 1kW on-grid unit to ₹1,00,000 for a 10kW hybrid inverter. A 3kW on-grid inverter (most common residential size) costs ₹25,000–₹35,000. Hybrid inverters cost 40–60% more than on-grid equivalents."
    },
    {
      "question": "Which type of solar inverter is best for home use?",
      "answer": "For most Indian homes with reliable grid, an on-grid inverter is best — it is cheapest, qualifies for subsidy, and supports net metering. If you face frequent power cuts, a hybrid inverter adds battery backup. Off-grid inverters are only for locations without grid access."
    },
    {
      "question": "How long does a solar inverter last?",
      "answer": "A quality solar inverter lasts 10–15 years. Standard warranty is 5 years; premium brands offer 10 years. Plan for one inverter replacement over your 25-year system life. Keep it ventilated and dust-free to maximise lifespan."
    },
    {
      "question": "Can I use a regular home inverter with solar panels?",
      "answer": "Not directly. Regular home inverters (UPS) are designed for grid-to-battery-to-load operation. Solar inverters have MPPT technology to optimise panel output and (for on-grid) anti-islanding for safe grid synchronisation. Some hybrid solar inverters can replace your home UPS entirely."
    },
    {
      "question": "What size solar inverter do I need?",
      "answer": "Match inverter capacity to your panel array: a 3kW panel system needs a 3kW inverter. For off-grid, size based on peak simultaneous load plus 20% headroom. Oversizing wastes money; undersizing clips output during peak hours."
    },
    {
      "question": "Which solar inverter brand is best in India?",
      "answer": "Growatt, Goodwe, and Solis offer the best price-to-quality for residential on-grid and hybrid systems. Fronius and SMA are premium options with superior efficiency. For budget off-grid, Microtek and Luminous are popular Indian brands with wide service networks."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'inverter' AND pillar_slug = 'rooftop-solar';


-- 2. CLUSTER: on-grid-inverter
UPDATE seo_pages SET
  h1 = 'On-Grid Solar Inverter: Price, Working & Best Brands India (2026)',
  meta_title = 'On-Grid Solar Inverter India: Price, How It Works & Top Brands | Solar Vipani',
  meta_description = 'On-grid solar inverters cost ₹15,000–₹80,000. Learn how grid-tied inverters work, MPPT tracking, anti-islanding, and which brands to choose for your home.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>An on-grid (grid-tied) solar inverter converts DC from your panels into grid-synchronised AC power and enables <a href=\"/in/solar-subsidy/net-metering/\">net metering</a> — feeding surplus electricity to the DISCOM grid. It is the <strong>most affordable inverter type</strong>, costing ₹15,000–₹80,000 depending on capacity. On-grid inverters are required for <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a> eligibility and are used in 85% of Indian residential solar installations.</p>"
    },
    {
      "heading": "How an On-Grid Inverter Works",
      "body": "<p>An on-grid inverter performs three critical functions simultaneously:</p><ol><li><strong>MPPT (Maximum Power Point Tracking)</strong> — Continuously adjusts voltage and current to extract maximum power from your panels, even as sunlight intensity changes throughout the day.</li><li><strong>DC-to-AC conversion</strong> — Converts variable DC from panels into clean 230V, 50Hz AC that matches the grid waveform exactly.</li><li><strong>Grid synchronisation</strong> — Locks output frequency and phase to the DISCOM grid, enabling seamless power flow in both directions through the net meter.</li></ol><p><strong>Anti-islanding protection:</strong> If the grid goes down, the inverter shuts off within milliseconds. This is a mandatory safety feature that prevents your system from energising dead power lines and endangering utility workers. It also means <strong>on-grid inverters do not provide power during outages</strong>.</p>"
    },
    {
      "heading": "On-Grid Inverter Price",
      "body": "<table><thead><tr><th>Capacity</th><th>Price Range</th><th>Typical System Size</th></tr></thead><tbody><tr><td>1kW</td><td>₹15,000–₹22,000</td><td><a href=\"/in/rooftop-solar/1kw-system/\">1kW system</a></td></tr><tr><td>2kW</td><td>₹20,000–₹28,000</td><td><a href=\"/in/rooftop-solar/2kw-system/\">2kW system</a></td></tr><tr><td>3kW</td><td>₹25,000–₹35,000</td><td><a href=\"/in/rooftop-solar/3kw-system/\">3kW system</a></td></tr><tr><td>5kW</td><td>₹35,000–₹50,000</td><td><a href=\"/in/rooftop-solar/5kw-system/\">5kW system</a></td></tr><tr><td>10kW</td><td>₹55,000–₹80,000</td><td><a href=\"/in/rooftop-solar/10kw-system/\">10kW system</a></td></tr></tbody></table><p>On-grid inverters cost 30–40% less than <a href=\"/in/rooftop-solar/hybrid-inverter/\">hybrid inverters</a> because they lack battery management circuitry and transfer switching.</p>"
    },
    {
      "heading": "Key Specifications",
      "body": "<p>Specifications that matter when choosing an on-grid inverter:</p><table><thead><tr><th>Spec</th><th>What It Means</th><th>Good Value</th></tr></thead><tbody><tr><td>Peak efficiency</td><td>Max DC-to-AC conversion rate</td><td>97% or higher</td></tr><tr><td>European efficiency</td><td>Weighted average across conditions</td><td>96% or higher</td></tr><tr><td>MPPT channels</td><td>Independent panel string inputs</td><td>1 for single-face roof, 2 for multi-face</td></tr><tr><td>MPPT voltage range</td><td>DC input range the tracker handles</td><td>Wide range = better shade tolerance</td></tr><tr><td>IP rating</td><td>Dust/water ingress protection</td><td>IP65 for outdoor, IP20 for indoor</td></tr><tr><td>WiFi monitoring</td><td>App-based real-time tracking</td><td>Essential — avoid models without it</td></tr><tr><td>Warranty</td><td>Manufacturer coverage</td><td>5 years standard, 10 years preferred</td></tr></tbody></table>"
    },
    {
      "heading": "Best On-Grid Inverter Brands",
      "body": "<table><thead><tr><th>Brand</th><th>Model Range</th><th>Efficiency</th><th>Warranty</th><th>Strengths</th></tr></thead><tbody><tr><td>Growatt</td><td>MIN series (1–10kW)</td><td>97.5%</td><td>5–10 yr</td><td>Best value, excellent app, wide service network in India</td></tr><tr><td>Goodwe</td><td>DNS/GW series</td><td>97.6%</td><td>5–10 yr</td><td>Reliable, compact design, good monitoring</td></tr><tr><td>Solis</td><td>S6 mini series</td><td>97.3%</td><td>5–10 yr</td><td>Budget-friendly, lightweight</td></tr><tr><td>Fronius</td><td>Primo/Symo</td><td>98.1%</td><td>5–10 yr</td><td>Premium efficiency, Austrian quality</td></tr><tr><td>SMA</td><td>Sunny Boy</td><td>98.0%</td><td>5–10 yr</td><td>Industry gold standard, German engineering</td></tr></tbody></table><p>For most Indian homes, Growatt and Goodwe offer the best balance of price, efficiency, and after-sales support. Fronius and SMA are worth the premium for larger systems (5kW+) where the efficiency gain compounds.</p>"
    },
    {
      "heading": "Single MPPT vs Dual MPPT",
      "body": "<p>MPPT channels determine how your panels connect to the inverter:</p><ul><li><strong>Single MPPT:</strong> All panels connect in one string. Works perfectly when all panels face the same direction with no shading. Most cost-effective for simple roofs.</li><li><strong>Dual MPPT:</strong> Panels can be split into two independent strings. Essential when panels face different directions (e.g., east and west roof faces) or when part of the array gets shaded at certain times. Each string is optimised independently.</li></ul><p><strong>Rule of thumb:</strong> If all your panels face south on a single unobstructed roof face, single MPPT is fine. If your roof has multiple faces, nearby trees, or water tanks causing partial shade, choose dual MPPT — it can recover 10–25% of output that single MPPT would lose.</p>"
    },
    {
      "heading": "On-Grid Inverter vs Hybrid: Should You Upgrade?",
      "body": "<table><thead><tr><th>Feature</th><th>On-Grid Inverter</th><th><a href=\"/in/rooftop-solar/hybrid-inverter/\">Hybrid Inverter</a></th></tr></thead><tbody><tr><td>Cost (3kW)</td><td>₹25,000–₹35,000</td><td>₹35,000–₹55,000</td></tr><tr><td>Net metering</td><td>Yes</td><td>Yes</td></tr><tr><td>Battery backup</td><td>No</td><td>Yes</td></tr><tr><td>Works in power cut</td><td>No</td><td>Yes (battery mode)</td></tr><tr><td>Can add battery later</td><td>No (need inverter swap)</td><td>Yes</td></tr><tr><td>Efficiency</td><td>97–98.5%</td><td>95–97.5%</td></tr></tbody></table><p><strong>Choose on-grid if:</strong> Grid is reliable (under 2 hours outage/week) and you want lowest cost. <strong>Choose hybrid if:</strong> Power cuts are frequent or you plan to add battery backup within 2–3 years.</p>"
    },
    {
      "heading": "Installation and Placement",
      "body": "<ul><li><strong>Location:</strong> Near the main distribution board, as close to panels as practical to minimise DC cable runs.</li><li><strong>Ventilation:</strong> Inverters generate heat during operation. Ensure 20cm clearance on all sides. Avoid enclosed cabinets without ventilation.</li><li><strong>Indoor vs outdoor:</strong> IP65-rated inverters can be wall-mounted outdoors under a shade. IP20 units must be installed indoors or in a weatherproof enclosure.</li><li><strong>Noise:</strong> Modern on-grid inverters are near-silent (under 35 dB). No concerns for bedroom-adjacent installation.</li><li><strong>Monitoring setup:</strong> Connect to home WiFi during commissioning. Most brands have a free app for real-time generation tracking.</li></ul>"
    },
    {
      "heading": "Get On-Grid Inverter Quotes",
      "body": "<p>Your inverter choice is part of a complete system design. Solar Vipani connects you with verified installers who recommend the right inverter for your panel configuration, roof layout, and budget.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is the price of an on-grid solar inverter in India?",
      "answer": "On-grid inverters cost ₹15,000–₹22,000 (1kW), ₹25,000–₹35,000 (3kW), ₹35,000–₹50,000 (5kW), and ₹55,000–₹80,000 (10kW). They are 30–40% cheaper than hybrid inverters since they lack battery management hardware."
    },
    {
      "question": "Does an on-grid inverter work during power cuts?",
      "answer": "No. On-grid inverters have mandatory anti-islanding protection that shuts the system off when the grid goes down. This is a safety requirement, not a defect. For power during outages, you need a hybrid inverter with battery."
    },
    {
      "question": "Can I add batteries to an on-grid inverter later?",
      "answer": "No. On-grid inverters lack battery charge management circuitry and cannot be retrofitted. To add batteries later, you need to replace the entire inverter with a hybrid model. If future battery backup is likely, install a hybrid inverter from the start."
    },
    {
      "question": "What is MPPT in a solar inverter?",
      "answer": "MPPT (Maximum Power Point Tracking) is an algorithm that continuously adjusts the inverter input to extract maximum power from panels as sunlight conditions change. Dual MPPT inverters can optimise two independent panel strings separately — useful when panels face different directions or experience partial shading."
    },
    {
      "question": "Which on-grid inverter brand is best for home in India?",
      "answer": "Growatt and Goodwe offer the best price-to-quality ratio for Indian homes, with 97%+ efficiency, WiFi monitoring, and growing service networks. Fronius and SMA are premium choices with marginally better efficiency (98%+) and longer track records."
    },
    {
      "question": "How long does an on-grid solar inverter last?",
      "answer": "10–15 years with proper ventilation and minimal dust exposure. Standard warranty is 5 years; most brands offer 10-year extended warranty for ₹2,000–₹5,000 extra. Plan for one replacement during your 25-year system life."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'on-grid-inverter' AND pillar_slug = 'rooftop-solar';


-- 3. CLUSTER: off-grid-inverter
UPDATE seo_pages SET
  h1 = 'Off-Grid Solar Inverter: Price, Battery Compatibility & Setup India (2026)',
  meta_title = 'Off-Grid Solar Inverter India: Price, Sizing & Battery Setup | Solar Vipani',
  meta_description = 'Off-grid solar inverters cost ₹12,000–₹65,000. Learn how they work with batteries, PWM vs MPPT charge controllers, sizing, and best brands for Indian homes.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>An off-grid solar inverter converts DC battery power into 230V AC for your appliances — independent of the DISCOM grid. Unlike <a href=\"/in/rooftop-solar/on-grid-inverter/\">on-grid inverters</a>, it manages battery charging from panels and discharging to loads. Prices range from <strong>₹12,000 to ₹65,000</strong> depending on capacity. Most off-grid inverters in India come as integrated units with a built-in charge controller, combining two functions in one box.</p>"
    },
    {
      "heading": "How an Off-Grid Inverter Works",
      "body": "<p>An off-grid inverter manages the entire energy cycle without grid support:</p><ol><li><strong>Solar charging:</strong> During the day, the built-in charge controller regulates power flow from panels to batteries, preventing overcharge.</li><li><strong>Battery-to-AC conversion:</strong> Converts stored DC battery power (12V/24V/48V) into 230V AC for your home appliances.</li><li><strong>Load management:</strong> Powers connected loads while simultaneously charging batteries from solar panels.</li><li><strong>Low-battery protection:</strong> Automatically disconnects loads when battery voltage drops below a safe threshold, preventing deep discharge damage.</li></ol><p>Unlike on-grid inverters, off-grid models have <strong>no anti-islanding</strong> because there is no grid connection. They operate 24/7, drawing from batteries whenever solar is insufficient.</p>"
    },
    {
      "heading": "Off-Grid Inverter Price",
      "body": "<table><thead><tr><th>Capacity</th><th>Price Range</th><th>Battery Voltage</th><th>Best For</th></tr></thead><tbody><tr><td>1kW</td><td>₹12,000–₹18,000</td><td>12V or 24V</td><td>Small homes, basic loads</td></tr><tr><td>2kW</td><td>₹16,000–₹24,000</td><td>24V</td><td>2 BHK, moderate loads</td></tr><tr><td>3kW</td><td>₹20,000–₹30,000</td><td>24V or 48V</td><td>Full home, no AC</td></tr><tr><td>5kW</td><td>₹28,000–₹40,000</td><td>48V</td><td>Large home, AC capable</td></tr><tr><td>10kW</td><td>₹45,000–₹65,000</td><td>48V (parallel units)</td><td>Farmhouse, commercial</td></tr></tbody></table><p>Off-grid inverters are cheaper than <a href=\"/in/rooftop-solar/on-grid-inverter/\">on-grid</a> equivalents because they lack grid synchronisation hardware. However, the total <a href=\"/in/rooftop-solar/off-grid/\">off-grid system cost</a> is higher due to batteries.</p>"
    },
    {
      "heading": "PWM vs MPPT Charge Controller",
      "body": "<p>The charge controller inside an off-grid inverter comes in two types:</p><table><thead><tr><th>Feature</th><th>PWM</th><th>MPPT</th></tr></thead><tbody><tr><td>Full form</td><td>Pulse Width Modulation</td><td>Maximum Power Point Tracking</td></tr><tr><td>Efficiency</td><td>75–80%</td><td>95–99%</td></tr><tr><td>Cost</td><td>Lower (₹1,000–₹3,000 less)</td><td>Higher</td></tr><tr><td>Panel-battery voltage match</td><td>Must be matched (12V panels for 12V battery)</td><td>Flexible (higher voltage panels work)</td></tr><tr><td>Best for</td><td>Small systems (under 500W)</td><td>All systems 1kW+</td></tr></tbody></table><p><strong>Recommendation:</strong> Always choose MPPT for systems 1kW and above. The 15–20% efficiency gain over PWM pays for the small price premium within months through higher charging output.</p>"
    },
    {
      "heading": "Battery Compatibility",
      "body": "<p>Off-grid inverters work with specific battery types and voltages:</p><ul><li><strong>Lead-acid (tubular):</strong> Most common in India. 12V batteries wired in series for 24V or 48V systems. Compatible with virtually all off-grid inverters. 3–5 year lifespan.</li><li><strong>Gel/AGM:</strong> Sealed, maintenance-free. Same voltage configurations. Slightly higher cost but no water top-up needed. 4–6 year lifespan.</li><li><strong>Lithium-ion (LFP):</strong> Requires inverter with lithium-compatible charge profile. Not all off-grid inverters support lithium — check specifications. 8–12 year lifespan, 80–90% depth of discharge.</li></ul><p><strong>Battery voltage matching:</strong> Inverter battery input voltage (12V, 24V, or 48V) must match your battery bank configuration. Higher voltage systems (48V) are more efficient and recommended for 3kW+ systems.</p>"
    },
    {
      "heading": "Sizing an Off-Grid Inverter",
      "body": "<p>Off-grid inverter sizing differs from on-grid — size for <strong>peak load</strong>, not panel capacity:</p><ol><li><strong>List peak simultaneous loads:</strong> Add up all appliances that may run at the same time. Include motor startup surges (pumps, compressors draw 3–5× rated wattage on startup).</li><li><strong>Add 20–30% headroom:</strong> For surge protection and future load additions.</li><li><strong>Choose inverter capacity:</strong> Must exceed your peak load + headroom.</li></ol><p><strong>Example:</strong> Lights (100W) + fans (280W) + fridge (180W startup: 540W) + TV (100W) = 1,020W peak. With 25% headroom = 1,275W. A 1.5kW or 2kW inverter is appropriate.</p><p>Panel array and battery bank are sized separately based on daily consumption. <a href=\"/in/rooftop-solar/off-grid/\">Full off-grid sizing guide →</a></p>"
    },
    {
      "heading": "Pure Sine Wave vs Modified Sine Wave",
      "body": "<p>Off-grid inverters produce two types of AC output:</p><ul><li><strong>Pure sine wave:</strong> Clean, grid-quality AC. Required for sensitive electronics (computers, LED TVs, medical equipment), motors (fridges, pumps), and inverter ACs. Costs 20–40% more.</li><li><strong>Modified sine wave:</strong> Rough approximation of AC. Works for basic resistive loads (incandescent lights, heaters, basic fans). Can damage or reduce lifespan of motors and electronics.</li></ul><p><strong>Always choose pure sine wave</strong> for home use. The cost difference is small (₹2,000–₹5,000) and modified sine wave creates noise in audio equipment, overheats motors, and can damage sensitive appliances.</p>"
    },
    {
      "heading": "Popular Off-Grid Inverter Brands",
      "body": "<table><thead><tr><th>Brand</th><th>Range</th><th>Charge Controller</th><th>Warranty</th><th>Strengths</th></tr></thead><tbody><tr><td>Luminous</td><td>1–5kW</td><td>PWM and MPPT</td><td>2 years</td><td>Widest service network in India, affordable</td></tr><tr><td>Microtek</td><td>1–5kW</td><td>PWM and MPPT</td><td>2 years</td><td>Popular budget choice, good availability</td></tr><tr><td>Su-Kam (now Luminous)</td><td>1–10kW</td><td>MPPT</td><td>2 years</td><td>Strong off-grid heritage</td></tr><tr><td>UTL Solar</td><td>1–10kW</td><td>MPPT</td><td>2 years</td><td>Good value, range of sizes</td></tr><tr><td>Growatt</td><td>3–10kW</td><td>MPPT</td><td>5 years</td><td>Higher efficiency, better monitoring</td></tr></tbody></table><p>For off-grid, Indian brands (Luminous, Microtek) dominate due to widespread service centres — critical for remote locations where off-grid systems are most common.</p>"
    },
    {
      "heading": "Get Off-Grid Inverter Quotes",
      "body": "<p>Off-grid inverter selection depends on your battery bank, load profile, and site conditions. Solar Vipani connects you with installers experienced in off-grid design for remote and rural applications.</p><p><a href=\"/in/get-quotes/\">Get your free off-grid solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is the price of an off-grid solar inverter in India?",
      "answer": "Off-grid inverters cost ₹12,000–₹65,000 depending on capacity. A 3kW unit costs ₹20,000–₹30,000. They are cheaper than on-grid inverters but the total off-grid system cost is higher because of battery expenses (₹40,000–₹1,50,000 additional)."
    },
    {
      "question": "What is the difference between off-grid and on-grid inverter?",
      "answer": "An on-grid inverter synchronises with the DISCOM grid and enables net metering but cannot work during power cuts. An off-grid inverter works independently with batteries, providing power 24/7 without grid connection. Off-grid inverters include charge controllers for battery management."
    },
    {
      "question": "Should I choose PWM or MPPT for my off-grid inverter?",
      "answer": "Choose MPPT for any system 1kW or larger. MPPT is 95–99% efficient vs 75–80% for PWM — the 15–20% extra output pays for the small price premium within months. PWM is only acceptable for very small systems under 500W."
    },
    {
      "question": "Can an off-grid inverter work with lithium batteries?",
      "answer": "Only if the inverter has a lithium-compatible charge profile. Not all off-grid inverters support lithium — check the specifications. Lithium batteries require different charge voltages and current limits than lead-acid. Using an incompatible inverter can damage lithium batteries."
    },
    {
      "question": "What size off-grid inverter do I need?",
      "answer": "Size based on peak simultaneous load plus 20–30% headroom, not panel capacity. If your maximum load is 2kW (fans + fridge + lights + TV), choose a 2.5kW–3kW inverter to handle motor startup surges from the fridge compressor."
    },
    {
      "question": "Pure sine wave or modified sine wave inverter?",
      "answer": "Always pure sine wave for home use. Modified sine wave can damage sensitive electronics (LED TVs, computers), overheat motors (fridge, pump), and create audio noise. The ₹2,000–₹5,000 price difference is negligible compared to the risk of appliance damage."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'off-grid-inverter' AND pillar_slug = 'rooftop-solar';


-- 4. CLUSTER: hybrid-inverter
UPDATE seo_pages SET
  h1 = 'Hybrid Solar Inverter: Price, How It Works & Best Brands India (2026)',
  meta_title = 'Hybrid Solar Inverter India: Price, Features & Top Brands | Solar Vipani',
  meta_description = 'Hybrid solar inverters cost ₹20,000–₹1,00,000. Combines grid-tie + battery backup in one unit. Learn how hybrid inverters work, key features, and top brands.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p>A hybrid solar inverter combines <a href=\"/in/rooftop-solar/on-grid-inverter/\">on-grid</a> and <a href=\"/in/rooftop-solar/off-grid-inverter/\">off-grid</a> capabilities in one unit — it synchronises with the grid for net metering <strong>and</strong> manages battery charging for backup during power cuts. Prices range from <strong>₹20,000 to ₹1,00,000</strong> depending on capacity. Hybrid inverters are the fastest-growing category in Indian residential solar, replacing the need for a separate home UPS/inverter system.</p>"
    },
    {
      "heading": "How a Hybrid Inverter Works",
      "body": "<p>A hybrid inverter manages three power sources through intelligent, automatic switching:</p><ol><li><strong>Solar priority:</strong> During sunny hours, solar powers your home first. Surplus charges the battery.</li><li><strong>Grid export:</strong> Once the battery is full, remaining surplus feeds to the grid via net metering — earning you credits.</li><li><strong>Grid failure:</strong> When power cuts occur, the inverter switches to battery within <strong>10–20 milliseconds</strong> — fast enough that your appliances do not even register the outage.</li><li><strong>Night (grid on):</strong> The inverter draws from the grid. Battery stays fully charged as reserve for the next outage.</li><li><strong>Night (grid off):</strong> Battery powers your essential loads until grid returns or sunrise.</li></ol><p>All switching is fully automatic — no manual intervention needed. The inverter prioritises: solar → battery → grid, optimising for maximum self-consumption and minimum grid dependence.</p>"
    },
    {
      "heading": "Hybrid Inverter Price",
      "body": "<table><thead><tr><th>Capacity</th><th>Hybrid Price</th><th>On-Grid Price</th><th>Premium</th></tr></thead><tbody><tr><td>1kW</td><td>₹20,000–₹30,000</td><td>₹15,000–₹22,000</td><td>+₹5,000–₹8,000</td></tr><tr><td>3kW</td><td>₹35,000–₹55,000</td><td>₹25,000–₹35,000</td><td>+₹10,000–₹20,000</td></tr><tr><td>5kW</td><td>₹50,000–₹70,000</td><td>₹35,000–₹50,000</td><td>+₹15,000–₹20,000</td></tr><tr><td>8kW</td><td>₹65,000–₹85,000</td><td>₹50,000–₹70,000</td><td>+₹15,000</td></tr><tr><td>10kW</td><td>₹70,000–₹1,00,000</td><td>₹55,000–₹80,000</td><td>+₹15,000–₹20,000</td></tr></tbody></table><p>The hybrid premium (₹10,000–₹20,000 over on-grid) covers battery charge management circuitry, automatic transfer switch, and dual-mode operation firmware. <strong>This premium is far less than buying a separate home inverter</strong> (₹8,000–₹15,000) on top of an on-grid solar inverter.</p>"
    },
    {
      "heading": "Key Features to Compare",
      "body": "<table><thead><tr><th>Feature</th><th>What to Look For</th><th>Why It Matters</th></tr></thead><tbody><tr><td>Switchover time</td><td>Under 20ms</td><td>Faster = no appliance restart. Under 10ms is best.</td></tr><tr><td>Battery voltage</td><td>48V (high voltage options 100–400V)</td><td>Higher voltage = more efficient battery charging</td></tr><tr><td>Lithium compatibility</td><td>CAN/RS485 communication</td><td>Required for lithium BMS integration</td></tr><tr><td>Backup output</td><td>Separate backup output terminal</td><td>Lets you select which circuits get backup power</td></tr><tr><td>Grid charging</td><td>Enable/disable grid-to-battery</td><td>Prevents grid-charging (saves money) or allows it (ensures full battery)</td></tr><tr><td>Time-of-use programming</td><td>Charge/discharge scheduling</td><td>Charge battery during off-peak, discharge during peak tariff hours</td></tr><tr><td>Parallel capability</td><td>Multiple units in parallel</td><td>Scale from 5kW to 15kW+ without replacing inverter</td></tr></tbody></table>"
    },
    {
      "heading": "Best Hybrid Inverter Brands",
      "body": "<table><thead><tr><th>Brand</th><th>Popular Models</th><th>Capacity</th><th>Switchover</th><th>Strengths</th></tr></thead><tbody><tr><td>Growatt</td><td>SPH series</td><td>3–10kW</td><td>Under 10ms</td><td>Best value in India, excellent app, wide support</td></tr><tr><td>Goodwe</td><td>ET/BT series</td><td>3–10kW</td><td>Under 10ms</td><td>Compact, reliable, good lithium compatibility</td></tr><tr><td>Deye</td><td>SUN series</td><td>3–12kW</td><td>Under 10ms</td><td>Strong hybrid features, competitive pricing</td></tr><tr><td>Solis</td><td>RHI series</td><td>3–10kW</td><td>Under 20ms</td><td>Budget hybrid option</td></tr><tr><td>SMA</td><td>Sunny Boy Storage</td><td>3–6kW</td><td>Under 20ms</td><td>Premium quality, German engineering</td></tr><tr><td>Fronius</td><td>Gen24 Plus</td><td>3–10kW</td><td>Under 20ms</td><td>Highest efficiency, premium tier</td></tr></tbody></table><p>Growatt SPH and Goodwe ET series dominate the Indian residential hybrid market. Both offer sub-10ms switchover, lithium compatibility, and smartphone monitoring at mid-range pricing.</p>"
    },
    {
      "heading": "Hybrid Inverter with Lithium vs Lead-Acid",
      "body": "<p>Hybrid inverters work with both battery types, but performance differs:</p><table><thead><tr><th></th><th>Lead-Acid (Tubular)</th><th>Lithium-Ion (LFP)</th></tr></thead><tbody><tr><td>Compatibility</td><td>All hybrid inverters</td><td>Only lithium-compatible models</td></tr><tr><td>Communication</td><td>Basic voltage sensing</td><td>CAN/RS485 BMS integration</td></tr><tr><td>Charge efficiency</td><td>80–85%</td><td>95–98%</td></tr><tr><td>Usable capacity</td><td>50% DoD</td><td>80–90% DoD</td></tr><tr><td>Lifespan</td><td>3–5 years</td><td>8–12 years</td></tr><tr><td>Space needed</td><td>Large (battery bank)</td><td>Compact (wall-mount options)</td></tr></tbody></table><p>If choosing lithium batteries, ensure your hybrid inverter has <strong>CAN or RS485 communication</strong> for BMS (Battery Management System) integration. Without BMS communication, the inverter cannot properly manage lithium charge/discharge cycles.</p>"
    },
    {
      "heading": "Hybrid vs On-Grid + Separate Home Inverter",
      "body": "<p>Many Indian homes already have a separate home inverter/UPS for power cut backup. A hybrid solar inverter <strong>replaces both</strong>:</p><table><thead><tr><th></th><th>On-Grid Solar + Home UPS</th><th>Hybrid Solar (single unit)</th></tr></thead><tbody><tr><td>Equipment</td><td>2 devices + 2 battery banks</td><td>1 device + 1 battery bank</td></tr><tr><td>Cost</td><td>₹35,000 + ₹12,000 = ₹47,000</td><td>₹45,000 (3kW hybrid)</td></tr><tr><td>Efficiency</td><td>Solar → grid → UPS battery (double conversion loss)</td><td>Solar → battery directly (single conversion)</td></tr><tr><td>Space</td><td>2 mounting locations</td><td>1 wall mount</td></tr><tr><td>Monitoring</td><td>Separate apps (if any)</td><td>Single app for everything</td></tr></tbody></table><p>If you already plan to buy or replace a home inverter, going hybrid solar is almost cost-neutral and far more efficient.</p>"
    },
    {
      "heading": "Can I Start On-Grid and Add Battery Later?",
      "body": "<p>Yes — <strong>if you install a hybrid inverter from day one</strong>. A hybrid inverter operates perfectly in pure on-grid mode (no battery connected). When you are ready, you add a battery bank and activate backup mode. No inverter replacement needed.</p><p>This is the most cost-effective future-proofing strategy: pay the small hybrid premium now (₹10,000–₹20,000 over on-grid) and defer the battery cost (₹40,000–₹1,50,000) until you need it or until lithium prices drop further.</p><p><strong>Important:</strong> If you install an <a href=\"/in/rooftop-solar/on-grid-inverter/\">on-grid inverter</a>, adding batteries later requires a full inverter swap — wasting the original investment.</p>"
    },
    {
      "heading": "Get Hybrid Inverter Quotes",
      "body": "<p>Hybrid inverter selection depends on your battery plans, backup load requirements, and budget. Solar Vipani connects you with verified installers experienced in hybrid system design.</p><p><a href=\"/in/get-quotes/\">Get your free hybrid solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "What is a hybrid solar inverter?",
      "answer": "A hybrid solar inverter combines grid-tie and battery management in one unit. It feeds surplus solar to the grid via net metering (like on-grid) and charges/discharges batteries for backup during power cuts (like off-grid). It replaces both a solar inverter and a home UPS system."
    },
    {
      "question": "How much does a hybrid solar inverter cost in India?",
      "answer": "Hybrid inverters cost ₹20,000–₹1,00,000 depending on capacity. A 3kW hybrid inverter costs ₹35,000–₹55,000 — roughly ₹10,000–₹20,000 more than an equivalent on-grid inverter. Popular brands include Growatt SPH, Goodwe ET, and Deye SUN series."
    },
    {
      "question": "Can a hybrid inverter work without batteries?",
      "answer": "Yes. A hybrid inverter operates in pure on-grid mode without batteries — functioning identically to an on-grid inverter with net metering. You can add batteries at any time later. This makes it a smart future-proofing choice."
    },
    {
      "question": "How fast does a hybrid inverter switch to battery during power cuts?",
      "answer": "Quality hybrid inverters switch within 10–20 milliseconds — fast enough that appliances do not restart or flicker. Models from Growatt and Goodwe achieve sub-10ms switchover, which is unnoticeable for all household equipment."
    },
    {
      "question": "Is a hybrid inverter better than a separate on-grid inverter plus home UPS?",
      "answer": "Yes. A hybrid inverter is more efficient (solar charges battery directly vs double conversion through grid), costs about the same as buying both separately, uses less space (one unit instead of two), and provides unified monitoring through a single app."
    },
    {
      "question": "Does a hybrid inverter support both lithium and lead-acid batteries?",
      "answer": "Most hybrid inverters support lead-acid out of the box. For lithium, the inverter must have CAN or RS485 communication for BMS integration. Check the specification sheet for lithium compatibility before purchasing — not all models support it."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'hybrid-inverter' AND pillar_slug = 'rooftop-solar';


-- 5. CLUSTER: on-grid-vs-off-grid
UPDATE seo_pages SET
  h1 = 'On-Grid vs Off-Grid Solar System: Which Is Better for Your Home? (2026)',
  meta_title = 'On-Grid vs Off-Grid Solar: Cost, Pros & Cons Compared | Solar Vipani',
  meta_description = 'On-grid vs off-grid solar compared across cost, subsidy, backup, maintenance, and ROI. Find which system type is right for your Indian home in 2026.',
  content = $$[
    {
      "heading": "The Short Answer",
      "body": "<p><a href=\"/in/rooftop-solar/on-grid/\">On-grid</a> is better for <strong>85% of Indian homes</strong> — it costs 40–60% less, qualifies for government subsidy, requires no batteries, and pays back in 3–5 years. Choose <a href=\"/in/rooftop-solar/off-grid/\">off-grid</a> only if you have no grid connection or face 8+ hours of daily power cuts. For most homes with moderate power cuts, a <a href=\"/in/rooftop-solar/hybrid/\">hybrid system</a> is the best middle ground — grid-tie savings with battery backup.</p>"
    },
    {
      "heading": "Complete Comparison Table",
      "body": "<table><thead><tr><th>Feature</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>Grid connection</td><td>Required</td><td>None</td><td>Required</td></tr><tr><td>Battery</td><td>No</td><td>Yes (mandatory)</td><td>Yes (optional)</td></tr><tr><td>Net metering</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>Works in power cut</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>PM Surya Ghar subsidy</td><td>Full (up to ₹78,000)</td><td>None</td><td>Partial (varies by state)</td></tr><tr><td>Cost (3kW)</td><td>₹1.5L–₹1.9L</td><td>₹2.5L–₹3.5L</td><td>₹2.3L–₹3.0L</td></tr><tr><td>After subsidy (3kW)</td><td>₹72K–₹1.12L</td><td>₹2.5L–₹3.5L</td><td>₹1.5L–₹2.2L</td></tr><tr><td>Payback period</td><td>3–5 years</td><td>7–10 years</td><td>5–7 years</td></tr><tr><td>Maintenance</td><td>Minimal (panel cleaning)</td><td>High (battery + panel)</td><td>Moderate (battery + panel)</td></tr><tr><td>Lifespan</td><td>25+ years</td><td>Panels 25 yrs, batteries 3–5 yrs</td><td>Panels 25 yrs, batteries 5–10 yrs</td></tr><tr><td>Electricity bill</td><td>Near zero (net metered)</td><td>Zero (no connection)</td><td>Near zero + backup</td></tr></tbody></table>"
    },
    {
      "heading": "Cost Comparison: The Biggest Differentiator",
      "body": "<p>Cost is where on-grid wins decisively:</p><table><thead><tr><th>System Size</th><th>On-Grid (after subsidy)</th><th>Off-Grid (with batteries)</th><th>Difference</th></tr></thead><tbody><tr><td>1kW</td><td>₹30,000–₹50,000</td><td>₹1,20,000–₹1,60,000</td><td>3–4× more</td></tr><tr><td>3kW</td><td>₹72,000–₹1,12,000</td><td>₹2,50,000–₹3,50,000</td><td>2.5–3.5× more</td></tr><tr><td>5kW</td><td>₹1,72,000–₹2,42,000</td><td>₹4,00,000–₹5,50,000</td><td>2–2.5× more</td></tr></tbody></table><p>The gap comes from three factors: batteries (₹40,000–₹1,50,000), no subsidy for off-grid, and battery replacement costs every 3–5 years (lead-acid) or 8–12 years (lithium).</p><p>Over 25 years, an on-grid system costs ₹1,00,000–₹2,50,000 total (one inverter replacement). An off-grid system costs ₹4,00,000–₹8,00,000 total (3–5 battery replacements + inverter replacement). <a href=\"/in/rooftop-solar/cost/\">Detailed cost guide →</a></p>"
    },
    {
      "heading": "How Each System Handles Power",
      "body": "<h3>On-Grid: The Grid as Your Battery</h3><p>During the day, solar powers your home and surplus flows to the grid. At night, you draw from the grid. Net metering ensures you pay only for the difference. The grid effectively acts as a free, maintenance-free, infinite-capacity battery.</p><p><strong>Limitation:</strong> When the grid goes down, your system shuts off (anti-islanding safety). No power during outages.</p><h3>Off-Grid: Complete Independence</h3><p>Solar charges batteries during the day. Your home runs on battery power 24/7. No grid connection means no DISCOM bill and no dependency — but also no safety net if batteries run low during extended cloudy weather.</p><p><strong>Limitation:</strong> Batteries are expensive, require maintenance, and need replacement every 3–12 years depending on type.</p><p><a href=\"/in/rooftop-solar/how-it-works/\">How rooftop solar works — detailed guide →</a></p>"
    },
    {
      "heading": "Subsidy: On-Grid Only",
      "body": "<p>The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> explicitly requires grid-connected systems with net metering. Off-grid systems do not qualify:</p><table><thead><tr><th></th><th>On-Grid</th><th>Off-Grid</th></tr></thead><tbody><tr><td>Central subsidy (up to 3kW)</td><td>Up to ₹78,000</td><td>₹0</td></tr><tr><td>State top-up subsidy</td><td>Varies by state</td><td>₹0</td></tr><tr><td>KUSUM (agricultural pumps)</td><td>Not applicable</td><td>Available for solar pumps</td></tr></tbody></table><p>This subsidy gap makes on-grid dramatically more affordable. A 3kW on-grid system after subsidy (₹72,000–₹1,12,000) costs less than the battery bank alone for a comparable off-grid system. <a href=\"/in/solar-subsidy/eligibility/\">Check your eligibility →</a></p>"
    },
    {
      "heading": "ROI and Payback Compared",
      "body": "<p>For a 3kW system at ₹7/unit electricity tariff:</p><table><thead><tr><th>Metric</th><th>On-Grid</th><th>Off-Grid</th></tr></thead><tbody><tr><td>Net investment</td><td>₹92,000</td><td>₹3,00,000</td></tr><tr><td>Annual electricity savings</td><td>₹31,500</td><td>₹31,500 (equivalent)</td></tr><tr><td>Annual maintenance cost</td><td>₹1,000</td><td>₹5,000–₹8,000</td></tr><tr><td>Battery replacement (year 5)</td><td>₹0</td><td>₹60,000–₹80,000</td></tr><tr><td>Payback period</td><td>~3 years</td><td>~10 years</td></tr><tr><td>25-year net savings</td><td>₹6,50,000+</td><td>₹2,00,000–₹3,00,000</td></tr></tbody></table><p>On-grid delivers 2–3× more lifetime savings because no money goes to batteries and the subsidy cuts upfront cost by half.</p>"
    },
    {
      "heading": "When to Choose On-Grid",
      "body": "<ul><li><strong>Your area has reliable grid</strong> — fewer than 2–3 hours of outage per day</li><li><strong>You want maximum savings</strong> — lowest upfront cost and fastest payback</li><li><strong>You want government subsidy</strong> — only on-grid qualifies</li><li><strong>You prefer zero maintenance</strong> — no batteries to replace</li><li><strong>Your primary goal is cutting electricity bills</strong> — net metering does this most efficiently</li></ul><p>On-grid is right for: urban homes, semi-urban homes with stable grid, apartments, and anyone optimising for financial returns.</p><p><a href=\"/in/rooftop-solar/on-grid/\">Full on-grid guide →</a></p>"
    },
    {
      "heading": "When to Choose Off-Grid",
      "body": "<ul><li><strong>No grid connection available</strong> — farmhouses, rural properties, hill stations, construction sites</li><li><strong>Grid is extremely unreliable</strong> — 8+ hours daily load-shedding where even hybrid cannot bridge the gap</li><li><strong>Remote commercial use</strong> — telecom towers, bore well pumps, poultry farms</li><li><strong>Energy independence is a priority</strong> — you want zero dependence on any utility</li></ul><p>Off-grid is right for: rural areas without DISCOM connection, remote agricultural land, and off-grid commercial applications.</p><p>For areas with moderate outages (1–4 hours/day), a <a href=\"/in/rooftop-solar/hybrid/\">hybrid system</a> gives you on-grid economics with battery backup — the best of both worlds.</p><p><a href=\"/in/rooftop-solar/off-grid/\">Full off-grid guide →</a></p>"
    },
    {
      "heading": "Get Quotes for Your Home",
      "body": "<p>Not sure which system type suits your situation? Solar Vipani connects you with verified installers who will assess your grid reliability, consumption, and backup needs to recommend the right system.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]$$,
  faq = $$[
    {
      "question": "Which is better: on-grid or off-grid solar?",
      "answer": "On-grid is better for most Indian homes — it is 40–60% cheaper, qualifies for ₹78,000 subsidy, requires no batteries, and pays back in 3–5 years vs 7–10 for off-grid. Choose off-grid only if you have no grid connection or face extreme power cuts (8+ hours daily)."
    },
    {
      "question": "Can an on-grid system work during power cuts?",
      "answer": "No. On-grid inverters shut off when the grid goes down (anti-islanding safety). For power during outages, you need either a hybrid system (grid + battery backup) or a fully off-grid system. A hybrid system is the most practical choice for areas with moderate outages."
    },
    {
      "question": "Is off-grid solar eligible for government subsidy?",
      "answer": "No. PM Surya Ghar subsidy (up to ₹78,000) is exclusively for grid-connected on-grid systems with net metering. Off-grid residential systems receive no central subsidy. Some state agricultural schemes subsidise off-grid solar pumps under KUSUM, but that is a separate programme."
    },
    {
      "question": "What is the cost difference between on-grid and off-grid?",
      "answer": "A 3kW on-grid system costs ₹72,000–₹1,12,000 after subsidy. A comparable 3kW off-grid system costs ₹2,50,000–₹3,50,000 with no subsidy. Over 25 years, off-grid costs 2–3× more due to battery replacements every 3–5 years (₹60,000–₹80,000 each time)."
    },
    {
      "question": "What about hybrid — is it a good middle ground?",
      "answer": "Yes. A hybrid system gives you on-grid net metering savings with battery backup during power cuts. It costs 20–40% more than pure on-grid but far less than off-grid. Ideal for areas with 1–4 hours of daily outage — which describes most Indian cities and towns."
    },
    {
      "question": "Can I convert an on-grid system to off-grid later?",
      "answer": "You would need to replace the on-grid inverter with an off-grid or hybrid inverter and add a battery bank — essentially rebuilding the electrical side. It is more cost-effective to install a hybrid inverter from the start if you anticipate needing battery backup in the future."
    }
  ]$$,
  updated_at = NOW()
WHERE slug = 'on-grid-vs-off-grid' AND pillar_slug = 'rooftop-solar';

COMMIT;
