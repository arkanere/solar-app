-- Rooftop Solar Clusters Batch 2: on-grid, off-grid, hybrid, for-apartments
-- Run: psql $POSTGRES_URL < 003-rooftop-solar-clusters-batch2.sql

BEGIN;

-- 1. CLUSTER: on-grid
UPDATE seo_pages SET
  h1 = 'On-Grid Solar System in India: How It Works, Cost & Benefits',
  meta_title = 'On-Grid Solar System India: Price, Net Metering & Subsidy Guide | Solar Vipani',
  meta_description = 'On-grid solar systems cost ₹50,000–₹5,50,000 after subsidy. Learn how grid-tied solar works, net metering benefits, and why 85% of Indian homes choose on-grid.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>An on-grid (grid-tied) solar system connects to your local DISCOM grid and feeds surplus electricity back through <a href=\"/in/solar-subsidy/net-metering/\">net metering</a>. It is the <strong>most popular and affordable</strong> rooftop solar option in India — chosen by 85% of residential installations. On-grid systems qualify for the full PM Surya Ghar subsidy of up to ₹78,000, have no batteries to maintain, and pay for themselves in 3–5 years.</p>"
    },
    {
      "heading": "How an On-Grid Solar System Works",
      "body": "<p>An on-grid system operates in sync with the DISCOM grid. Here is the step-by-step flow:</p><ol><li><strong>Solar panels generate DC electricity</strong> from sunlight during the day.</li><li><strong>An <a href=\"/in/rooftop-solar/on-grid-inverter/\">on-grid inverter</a></strong> converts DC to 230V AC power matching the grid frequency (50 Hz).</li><li><strong>Your home consumes solar power first.</strong> Appliances draw from solar before touching the grid.</li><li><strong>Surplus power exports to the grid</strong> through a bi-directional net meter.</li><li><strong>At night or on cloudy days,</strong> you draw from the grid as usual.</li><li><strong>Your DISCOM bills the net:</strong> units imported − units exported. You pay only the difference.</li></ol><p>There are no batteries in this system. The grid itself acts as your storage — you push power in during the day and pull it back at night.</p><p><strong>Important safety feature:</strong> On-grid inverters include anti-islanding protection. If the grid goes down, your system automatically shuts off to protect line workers. This means on-grid systems <strong>do not work during power cuts</strong> — a key tradeoff to understand.</p>"
    },
    {
      "heading": "On-Grid Solar System Cost",
      "body": "<p>On-grid systems are the most affordable option because they have no battery cost:</p><table><thead><tr><th>System Size</th><th>Price (before subsidy)</th><th>Subsidy</th><th>Net Cost</th></tr></thead><tbody><tr><td>1kW</td><td>₹60,000–₹80,000</td><td>₹30,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2kW</td><td>₹1,10,000–₹1,40,000</td><td>₹60,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3kW</td><td>₹1,50,000–₹1,90,000</td><td>₹78,000</td><td>₹72,000–₹1,12,000</td></tr><tr><td>5kW</td><td>₹2,50,000–₹3,20,000</td><td>₹78,000</td><td>₹1,72,000–₹2,42,000</td></tr><tr><td>10kW</td><td>₹5,00,000–₹6,50,000</td><td>₹78,000</td><td>₹4,22,000–₹5,72,000</td></tr></tbody></table><p><em>Prices based on monocrystalline panels with string inverter. Actual quotes vary by location and brand.</em></p><p><a href=\"/in/rooftop-solar/cost/\">Full cost breakdown with all factors →</a></p>"
    },
    {
      "heading": "Components of an On-Grid System",
      "body": "<p>An on-grid installation is simpler than off-grid or hybrid because there are no batteries or charge controllers:</p><ul><li><strong>Solar panels</strong> — <a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline</a> (most common) or <a href=\"/in/solar-panels/polycrystalline/\">polycrystalline</a>. 25-year warranty standard.</li><li><strong><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverter</a></strong> — Converts DC to grid-synchronised AC. Includes MPPT tracking for maximum output. 5–10 year warranty.</li><li><strong>Mounting structure</strong> — Galvanised iron or aluminium rails. Flush-mount for flat roofs, tilt frames for sloped roofs.</li><li><strong>Bi-directional meter</strong> — Replaces your existing meter. Records import and export separately.</li><li><strong>AC/DC protection</strong> — Isolators, surge protection devices, MCBs, earthing kit.</li><li><strong>Cabling</strong> — DC solar cables (panel to inverter), AC cables (inverter to distribution board).</li></ul><p>No batteries, no charge controller, no battery management system — which is why on-grid systems cost 30–40% less than <a href=\"/in/rooftop-solar/off-grid/\">off-grid</a> or <a href=\"/in/rooftop-solar/hybrid/\">hybrid</a> equivalents.</p>"
    },
    {
      "heading": "Net Metering: The On-Grid Advantage",
      "body": "<p>Net metering is what makes on-grid solar financially powerful. Instead of storing surplus energy in expensive batteries, you bank it with the grid for free.</p><p><strong>How it works in practice:</strong></p><ul><li>A 3kW system generates ~13 units/day. If your home uses 8 units during daylight, 5 units export to the grid.</li><li>At night you consume ~5 units from the grid.</li><li>Your net consumption: 0 units. Your bill: just the fixed charges (₹50–₹200/month).</li></ul><p><strong>Settlement rules vary by state:</strong></p><ul><li><strong>Annual rollover</strong> (Maharashtra, Karnataka, Gujarat) — credits accumulate for 12 months before settlement.</li><li><strong>Monthly adjustment</strong> (Delhi, UP) — credits applied each billing cycle.</li><li><strong>Feed-in tariff</strong> (some states) — DISCOM pays you a fixed rate per exported unit instead of credits.</li></ul><p>Your installer handles the net metering application, meter replacement, and DISCOM liaison. Timeline: 2–6 weeks after installation.</p><p><a href=\"/in/solar-subsidy/net-metering/\">Complete net metering guide by state →</a></p>"
    },
    {
      "heading": "Subsidy Benefits for On-Grid Systems",
      "body": "<p>Only on-grid systems qualify for the full <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a> central subsidy. This is one of the biggest reasons homeowners choose grid-tied:</p><table><thead><tr><th>Capacity</th><th>Subsidy Rate</th><th>Total Subsidy</th></tr></thead><tbody><tr><td>Up to 2kW</td><td>₹30,000/kW</td><td>Up to ₹60,000</td></tr><tr><td>2kW–3kW</td><td>₹18,000/kW (additional)</td><td>Up to ₹78,000</td></tr><tr><td>Above 3kW</td><td>No additional</td><td>Capped at ₹78,000</td></tr></tbody></table><p><strong>Eligibility requirements:</strong></p><ul><li>Residential consumer with a valid electricity connection</li><li>System installed by MNRE-empanelled vendor</li><li>On-grid configuration with net metering</li><li>One subsidy per household (linked to consumer number)</li></ul><p>Subsidy is credited directly to your bank account after DISCOM inspection and commissioning. <a href=\"/in/solar-subsidy/how-to-apply/\">How to apply for solar subsidy →</a></p>"
    },
    {
      "heading": "On-Grid vs Off-Grid vs Hybrid",
      "body": "<table><thead><tr><th>Feature</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>Cost (3kW)</td><td>₹1,50,000–₹1,90,000</td><td>₹2,50,000–₹3,50,000</td><td>₹2,80,000–₹3,80,000</td></tr><tr><td>Battery required</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Works during power cut</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Net metering</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>Govt subsidy</td><td>Full</td><td>None</td><td>Partial</td></tr><tr><td>Maintenance</td><td>Minimal</td><td>Battery replacement every 5–7 yrs</td><td>Battery replacement every 5–7 yrs</td></tr><tr><td>Payback period</td><td>3–5 years</td><td>7–10 years</td><td>5–7 years</td></tr><tr><td>Best for</td><td>Urban/semi-urban homes with reliable grid</td><td>Remote areas, no grid access</td><td>Areas with frequent power cuts</td></tr></tbody></table><p>For a deeper comparison: <a href=\"/in/rooftop-solar/on-grid-vs-off-grid/\">On-Grid vs Off-Grid — detailed guide →</a></p>"
    },
    {
      "heading": "Who Should Choose On-Grid?",
      "body": "<p>On-grid is the right choice if:</p><ul><li><strong>Your area has reliable grid power</strong> — fewer than 2–3 hours of outage per day</li><li><strong>You want the lowest upfront cost</strong> — no battery expense</li><li><strong>You want government subsidy</strong> — only on-grid qualifies for PM Surya Ghar</li><li><strong>You want the fastest payback</strong> — 3–5 years vs 7–10 for off-grid</li><li><strong>You prefer low maintenance</strong> — no battery replacements</li></ul><p>If power cuts are a concern, consider a <a href=\"/in/rooftop-solar/hybrid/\">hybrid system</a> instead — it gives you grid-tie benefits plus battery backup, though at a higher cost.</p>"
    },
    {
      "heading": "Get On-Grid Solar Quotes",
      "body": "<p>On-grid solar is the most straightforward path to cutting your electricity bill. Solar Vipani connects you with 2–3 verified local installers who will design a grid-tied system for your roof and provide comparable quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free on-grid solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Does an on-grid solar system work during power cuts?",
      "answer": "No. On-grid inverters have anti-islanding protection that shuts the system down when the grid goes off. This is a safety feature to protect utility line workers. If you need power during outages, consider a hybrid system that includes battery backup."
    },
    {
      "question": "What is net metering in an on-grid system?",
      "answer": "Net metering lets you export surplus solar power to the grid and receive credits on your electricity bill. A bi-directional meter records both import and export. You pay only for the net consumption (import minus export). Most Indian states settle credits annually."
    },
    {
      "question": "How much does a 3kW on-grid solar system cost?",
      "answer": "A 3kW on-grid system costs ₹1,50,000–₹1,90,000 before subsidy. After the PM Surya Ghar subsidy of ₹78,000, your out-of-pocket cost is ₹72,000–₹1,12,000. This includes panels, inverter, mounting, wiring, and installation."
    },
    {
      "question": "Can I add batteries to an on-grid system later?",
      "answer": "Not directly. On-grid inverters are not designed to manage batteries. To add battery backup later, you would need to replace the inverter with a hybrid inverter. It is more cost-effective to install a hybrid system from the start if you anticipate needing backup."
    },
    {
      "question": "Is on-grid solar eligible for government subsidy?",
      "answer": "Yes. On-grid is the only system type that qualifies for the full PM Surya Ghar central subsidy — up to ₹78,000 for a 3kW system. The system must be installed by an MNRE-empanelled vendor and connected to the grid with net metering."
    },
    {
      "question": "What is the payback period for an on-grid solar system?",
      "answer": "Most on-grid systems pay back in 3–5 years depending on your electricity tariff and system size. Homes paying ₹8+/unit see payback in under 3.5 years. After payback, you get essentially free electricity for 20+ more years."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'on-grid' AND pillar_slug = 'rooftop-solar';


-- 2. CLUSTER: off-grid
UPDATE seo_pages SET
  h1 = 'Off-Grid Solar System in India: Cost, Batteries & Complete Setup Guide',
  meta_title = 'Off-Grid Solar System India: Price, Battery Sizing & Setup | Solar Vipani',
  meta_description = 'Off-grid solar systems cost ₹1,20,000–₹9,00,000 with batteries. Learn how off-grid works, battery sizing, and when it makes sense over on-grid in India.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>An off-grid solar system operates <strong>completely independent of the DISCOM grid</strong>. It generates electricity during the day, stores surplus in a battery bank, and powers your home at night from stored energy. Off-grid costs 40–60% more than <a href=\"/in/rooftop-solar/on-grid/\">on-grid</a> due to batteries, but is essential where grid connectivity is unreliable or unavailable — common in rural India, farmhouses, and remote locations.</p>"
    },
    {
      "heading": "How an Off-Grid Solar System Works",
      "body": "<p>Unlike on-grid systems, off-grid has no connection to the electricity grid. The energy cycle works like this:</p><ol><li><strong>Solar panels generate DC electricity</strong> during daylight hours.</li><li><strong>A charge controller</strong> regulates the flow of power to the battery bank, preventing overcharging and deep discharge.</li><li><strong>Batteries store surplus energy</strong> generated during peak sunlight hours.</li><li><strong>An <a href=\"/in/rooftop-solar/off-grid-inverter/\">off-grid inverter</a></strong> converts stored DC battery power to 230V AC for your appliances.</li><li><strong>At night and on cloudy days,</strong> your home runs entirely on battery power.</li></ol><p>The system is sized so that daytime generation exceeds your daily consumption, leaving enough surplus to charge batteries for overnight use. Proper battery sizing is critical — undersized batteries mean running out of power before sunrise.</p>"
    },
    {
      "heading": "Off-Grid Solar System Cost",
      "body": "<p>Batteries add significant cost. Here is how off-grid pricing compares across system sizes:</p><table><thead><tr><th>System Size</th><th>Off-Grid Cost (with batteries)</th><th>On-Grid Cost (no batteries)</th><th>Difference</th></tr></thead><tbody><tr><td>1kW</td><td>₹1,20,000–₹1,60,000</td><td>₹60,000–₹80,000</td><td>+₹60,000–₹80,000</td></tr><tr><td>2kW</td><td>₹2,00,000–₹2,60,000</td><td>₹1,10,000–₹1,40,000</td><td>+₹90,000–₹1,20,000</td></tr><tr><td>3kW</td><td>₹2,50,000–₹3,50,000</td><td>₹1,50,000–₹1,90,000</td><td>+₹1,00,000–₹1,60,000</td></tr><tr><td>5kW</td><td>₹4,00,000–₹5,50,000</td><td>₹2,50,000–₹3,20,000</td><td>+₹1,50,000–₹2,30,000</td></tr><tr><td>10kW</td><td>₹7,50,000–₹10,00,000</td><td>₹5,00,000–₹6,50,000</td><td>+₹2,50,000–₹3,50,000</td></tr></tbody></table><p><strong>Important:</strong> Off-grid systems do <em>not</em> qualify for the PM Surya Ghar subsidy — that is exclusively for on-grid installations. This makes the effective price gap even larger.</p><p><a href=\"/in/rooftop-solar/cost/\">Complete solar cost breakdown →</a></p>"
    },
    {
      "heading": "Battery Options for Off-Grid Solar",
      "body": "<p>The battery bank is the most critical and expensive component of an off-grid system. Three main battery technologies are used in India:</p><table><thead><tr><th>Battery Type</th><th>Cost per kWh</th><th>Lifespan</th><th>Depth of Discharge</th><th>Best For</th></tr></thead><tbody><tr><td>Lead-acid (tubular)</td><td>₹6,000–₹8,000</td><td>3–5 years</td><td>50%</td><td>Budget systems</td></tr><tr><td>Gel/AGM</td><td>₹8,000–₹12,000</td><td>4–6 years</td><td>60%</td><td>Low-maintenance needs</td></tr><tr><td>Lithium-ion (LFP)</td><td>₹15,000–₹22,000</td><td>8–12 years</td><td>80–90%</td><td>Long-term value, compact spaces</td></tr></tbody></table><p><strong>Sizing rule of thumb:</strong> For overnight backup of a 3kW system, you need approximately 7–10 kWh of battery storage. With lead-acid batteries (50% DoD), that means 15–20 kWh of nominal capacity — typically a bank of 8–10 tall tubular batteries.</p><p>Lithium-ion batteries cost more upfront but last 2–3× longer and use 40% less space. Over a 20-year system life, lithium typically costs less than lead-acid due to fewer replacements.</p>"
    },
    {
      "heading": "Key Components of an Off-Grid System",
      "body": "<p>An off-grid installation has more components than on-grid:</p><ul><li><strong>Solar panels</strong> — Same <a href=\"/in/solar-panels/types/\">panel types</a> as on-grid. Often slightly oversized (by 20–30%) to ensure battery charging even on cloudy days.</li><li><strong>Charge controller</strong> — MPPT (preferred) or PWM. Regulates panel-to-battery charging. Prevents overcharge, deep discharge, and reverse current flow.</li><li><strong><a href=\"/in/rooftop-solar/off-grid-inverter/\">Off-grid inverter</a></strong> — Converts battery DC to household AC. Often combined with the charge controller in an integrated unit.</li><li><strong>Battery bank</strong> — Lead-acid or lithium-ion. Sized for 1–3 days of autonomy depending on location and criticality.</li><li><strong>Mounting structure, cabling, earthing</strong> — Same as on-grid.</li></ul><p>No net meter or DISCOM connection is involved — making off-grid simpler from a paperwork standpoint but more complex in hardware design.</p>"
    },
    {
      "heading": "When Does Off-Grid Make Sense?",
      "body": "<p>Off-grid is the right choice in specific scenarios:</p><ul><li><strong>No grid access</strong> — Farmhouses, rural properties, hill stations, or construction sites where DISCOM connection is unavailable or prohibitively expensive to obtain.</li><li><strong>Extremely unreliable grid</strong> — Areas with 8+ hours of daily load-shedding where even a hybrid system cannot bridge the gap.</li><li><strong>Remote commercial use</strong> — Telecom towers, bore well pumps, poultry farms, or warehouses in off-grid locations.</li><li><strong>Full energy independence</strong> — When you want zero reliance on the grid as a matter of principle or long-term planning.</li></ul><p>If your area has even moderate grid availability (16+ hours/day), an <a href=\"/in/rooftop-solar/on-grid/\">on-grid</a> or <a href=\"/in/rooftop-solar/hybrid/\">hybrid</a> system will be significantly more cost-effective.</p>"
    },
    {
      "heading": "Off-Grid System Sizing: Getting It Right",
      "body": "<p>Undersizing an off-grid system means running out of power. Oversizing wastes money. Here is how to size correctly:</p><ol><li><strong>Calculate daily consumption</strong> — List every appliance, its wattage, and hours of use. Total = daily kWh need.</li><li><strong>Add 20–30% buffer</strong> — For cloudy days, seasonal variation, and system losses.</li><li><strong>Size panels</strong> — Divide buffered daily need by 4.5 (average peak sun hours in India) to get required kW capacity.</li><li><strong>Size batteries</strong> — Multiply daily need by days of autonomy (typically 1.5–2 for India). Divide by battery depth of discharge (50% for lead-acid, 80% for lithium).</li></ol><p><strong>Example:</strong> A home consuming 10 kWh/day needs ~3kW of panels and ~25 kWh of lead-acid battery capacity (10 × 1.5 ÷ 0.5) or ~19 kWh of lithium (10 × 1.5 ÷ 0.8).</p><p>→ <a href=\"/in/tools/solar-calculator/\">Use our solar calculator to size your system</a></p>"
    },
    {
      "heading": "Maintenance Requirements",
      "body": "<p>Off-grid systems need more maintenance than on-grid due to batteries:</p><ul><li><strong>Battery maintenance</strong> — Lead-acid batteries need distilled water top-up every 2–3 months and terminal cleaning. Lithium batteries are maintenance-free.</li><li><strong>Battery replacement</strong> — Lead-acid: every 3–5 years. Lithium: every 8–12 years. Budget for this recurring cost.</li><li><strong>Panel cleaning</strong> — Same as on-grid. Monthly water rinse or after dust storms.</li><li><strong>Inverter/controller check</strong> — Annual inspection of connections, ventilation, and error logs.</li></ul><p>Factor in battery replacement costs when comparing off-grid vs on-grid economics. A lead-acid bank for a 3kW system costs ₹60,000–₹80,000 to replace every 4–5 years.</p>"
    },
    {
      "heading": "Get Off-Grid Solar Quotes",
      "body": "<p>Off-grid design requires careful sizing by an experienced installer. Solar Vipani connects you with verified installers who specialise in off-grid solutions — they will assess your consumption, location, and backup needs to design the right system.</p><p><a href=\"/in/get-quotes/\">Get your free off-grid solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How much does an off-grid solar system cost in India?",
      "answer": "An off-grid system costs ₹1,20,000–₹10,00,000 depending on size and battery type. A 3kW off-grid system with lead-acid batteries costs ₹2,50,000–₹3,50,000. Lithium batteries add ₹50,000–₹1,00,000 more but last 2–3× longer. Off-grid does not qualify for government subsidy."
    },
    {
      "question": "Can I get government subsidy for an off-grid solar system?",
      "answer": "No. The PM Surya Ghar subsidy is exclusively for on-grid (grid-connected) systems with net metering. Off-grid systems are not eligible. Some state agricultural schemes subsidise off-grid solar pumps, but residential off-grid systems have no central subsidy."
    },
    {
      "question": "How long do off-grid solar batteries last?",
      "answer": "Lead-acid tubular batteries last 3–5 years with proper maintenance (distilled water top-up, terminal cleaning). Lithium-ion (LFP) batteries last 8–12 years and are maintenance-free. Over a 20-year system life, lithium typically costs less despite the higher upfront price."
    },
    {
      "question": "What size off-grid system do I need for my home?",
      "answer": "Calculate your daily kWh consumption by listing all appliances and usage hours. A typical 2–3 BHK home consuming 10 kWh/day needs a 3kW panel array and 20–25 kWh of battery storage (lead-acid) or 15–19 kWh (lithium). Add 20–30% buffer for cloudy days."
    },
    {
      "question": "Is off-grid solar better than on-grid?",
      "answer": "Not for most Indian homes. On-grid is 40–60% cheaper, qualifies for subsidy, has lower maintenance, and pays back in 3–5 years vs 7–10 for off-grid. Off-grid is better only when you have no grid access or extremely unreliable power (8+ hours of daily outage)."
    },
    {
      "question": "Can I run AC and heavy appliances on off-grid solar?",
      "answer": "Yes, with proper sizing. A 1.5-ton AC draws about 1.5kW. To run it for 8 hours, you need 12 kWh of daily generation plus battery capacity. A 5kW off-grid system with adequate batteries can handle AC, refrigerator, and other heavy loads simultaneously."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'off-grid' AND pillar_slug = 'rooftop-solar';


-- 3. CLUSTER: hybrid
UPDATE seo_pages SET
  h1 = 'Hybrid Solar System in India: Grid + Battery for Uninterrupted Power',
  meta_title = 'Hybrid Solar System India: Cost, Battery Backup & How It Works | Solar Vipani',
  meta_description = 'Hybrid solar systems combine grid-tie savings with battery backup. Cost ₹2,00,000–₹8,50,000. Learn how hybrid works, when to choose it, and subsidy eligibility.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A hybrid solar system combines the best of <a href=\"/in/rooftop-solar/on-grid/\">on-grid</a> and <a href=\"/in/rooftop-solar/off-grid/\">off-grid</a> — it connects to the DISCOM grid for net metering savings <strong>and</strong> includes a battery bank for backup during power cuts. It costs 20–40% more than on-grid but gives you uninterrupted power without full off-grid expense. Hybrid is the fastest-growing segment in Indian residential solar, especially in cities with frequent load-shedding.</p>"
    },
    {
      "heading": "How a Hybrid Solar System Works",
      "body": "<p>A hybrid system manages three power sources — solar, battery, and grid — through intelligent switching:</p><ol><li><strong>During sunny hours:</strong> Solar panels power your home. Surplus charges the battery first.</li><li><strong>Battery full, surplus remains:</strong> Excess power exports to the grid via net metering, earning you credits.</li><li><strong>During power cuts:</strong> The system seamlessly switches to battery backup in under 20 milliseconds — your appliances do not even flicker.</li><li><strong>At night (grid available):</strong> You draw from the grid. Battery stays charged as reserve for the next outage.</li><li><strong>At night (grid down):</strong> Battery powers essential loads until grid returns or sunrise.</li></ol><p>The <a href=\"/in/rooftop-solar/hybrid-inverter/\">hybrid inverter</a> is the brain — it decides the optimal power source at every moment based on solar availability, battery state, grid status, and your consumption.</p>"
    },
    {
      "heading": "Hybrid Solar System Cost",
      "body": "<p>Hybrid sits between on-grid and full off-grid in pricing:</p><table><thead><tr><th>System Size</th><th>Hybrid Cost</th><th>On-Grid Cost</th><th>Premium for Hybrid</th></tr></thead><tbody><tr><td>1kW</td><td>₹1,00,000–₹1,30,000</td><td>₹60,000–₹80,000</td><td>+₹40,000–₹50,000</td></tr><tr><td>2kW</td><td>₹1,70,000–₹2,20,000</td><td>₹1,10,000–₹1,40,000</td><td>+₹60,000–₹80,000</td></tr><tr><td>3kW</td><td>₹2,30,000–₹3,00,000</td><td>₹1,50,000–₹1,90,000</td><td>+₹80,000–₹1,10,000</td></tr><tr><td>5kW</td><td>₹3,50,000–₹4,80,000</td><td>₹2,50,000–₹3,20,000</td><td>+₹1,00,000–₹1,60,000</td></tr><tr><td>10kW</td><td>₹6,50,000–₹9,00,000</td><td>₹5,00,000–₹6,50,000</td><td>+₹1,50,000–₹2,50,000</td></tr></tbody></table><p>The premium is primarily the battery cost (₹40,000–₹1,50,000 depending on capacity and type) plus the higher-cost hybrid inverter (10–20% more than an on-grid inverter).</p><p><a href=\"/in/rooftop-solar/cost/\">Full cost comparison across all system types →</a></p>"
    },
    {
      "heading": "Battery Sizing for Hybrid Systems",
      "body": "<p>Unlike off-grid where batteries must cover overnight consumption, hybrid batteries only need to bridge <strong>power cuts</strong>. This means smaller, cheaper battery banks:</p><table><thead><tr><th>Backup Need</th><th>Battery Capacity</th><th>Lead-Acid Cost</th><th>Lithium Cost</th></tr></thead><tbody><tr><td>2–3 hours (essentials: lights, fans, WiFi)</td><td>1.5–2 kWh</td><td>₹15,000–₹20,000</td><td>₹25,000–₹35,000</td></tr><tr><td>4–6 hours (+ fridge, TV)</td><td>3–5 kWh</td><td>₹30,000–₹50,000</td><td>₹50,000–₹80,000</td></tr><tr><td>8+ hours (full home including AC)</td><td>8–12 kWh</td><td>₹60,000–₹1,00,000</td><td>₹1,00,000–₹1,80,000</td></tr></tbody></table><p><strong>Practical tip:</strong> Most hybrid users in Indian cities size batteries for 3–5 hours of essential-load backup. This keeps costs reasonable while covering typical 1–3 hour outages with margin.</p>"
    },
    {
      "heading": "Hybrid vs On-Grid vs Off-Grid",
      "body": "<table><thead><tr><th>Feature</th><th>On-Grid</th><th>Hybrid</th><th>Off-Grid</th></tr></thead><tbody><tr><td>Grid connection</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>Battery backup</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Works during power cut</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Net metering</td><td>Yes</td><td>Yes</td><td>No</td></tr><tr><td>Cost (3kW)</td><td>₹1.5–1.9L</td><td>₹2.3–3.0L</td><td>₹2.5–3.5L</td></tr><tr><td>Subsidy</td><td>Full (₹78K)</td><td>Partial*</td><td>None</td></tr><tr><td>Payback</td><td>3–5 years</td><td>5–7 years</td><td>7–10 years</td></tr><tr><td>Maintenance</td><td>Minimal</td><td>Moderate (battery)</td><td>High (battery)</td></tr></tbody></table><p><em>*Subsidy eligibility for hybrid depends on state policy. Some DISCOMs allow subsidy on the grid-tied portion; others exclude hybrid entirely. Confirm with your local DISCOM.</em></p><p><a href=\"/in/rooftop-solar/on-grid-vs-off-grid/\">Detailed system type comparison →</a></p>"
    },
    {
      "heading": "Who Should Choose Hybrid?",
      "body": "<p>Hybrid is the right choice if:</p><ul><li><strong>You face regular power cuts</strong> (1–4 hours daily) and want seamless backup without a separate inverter + battery setup.</li><li><strong>You want net metering savings</strong> but cannot tolerate the on-grid limitation of no backup.</li><li><strong>You already plan to buy a home inverter</strong> — a hybrid solar system replaces both your solar setup and home inverter/UPS in one integrated unit.</li><li><strong>You want future flexibility</strong> — hybrid inverters can operate in on-grid mode (without battery) initially, and you can add batteries later.</li></ul><p><strong>Skip hybrid if:</strong> Your grid is reliable (under 1 hour of outage per week) — an <a href=\"/in/rooftop-solar/on-grid/\">on-grid system</a> saves you ₹80,000–₹1,50,000. Or if you have zero grid access — go <a href=\"/in/rooftop-solar/off-grid/\">fully off-grid</a> instead.</p>"
    },
    {
      "heading": "The Hybrid Inverter: How It Differs",
      "body": "<p>A <a href=\"/in/rooftop-solar/hybrid-inverter/\">hybrid inverter</a> is more sophisticated than standard on-grid or off-grid inverters. It handles:</p><ul><li><strong>MPPT solar tracking</strong> — maximises panel output like an on-grid inverter</li><li><strong>Battery charge management</strong> — prevents overcharge/deep discharge like an off-grid charge controller</li><li><strong>Grid synchronisation</strong> — feeds surplus to grid for net metering like an on-grid inverter</li><li><strong>Automatic transfer switch</strong> — switches to battery within 20ms when grid fails</li><li><strong>Load prioritisation</strong> — during battery mode, powers essential circuits first</li></ul><p>Popular hybrid inverter brands in India include Growatt, Goodwe, Solis, and Deye. Prices range from ₹35,000–₹80,000 for 3kW–5kW capacity.</p>"
    },
    {
      "heading": "Subsidy Rules for Hybrid Systems",
      "body": "<p>Subsidy eligibility for hybrid is a grey area in Indian policy:</p><ul><li><strong>Central subsidy (PM Surya Ghar)</strong> — The scheme subsidises grid-connected systems. Some states allow hybrid systems to claim subsidy on the solar + inverter component (excluding battery cost). Others require pure on-grid configuration.</li><li><strong>DISCOM-level variation</strong> — Each DISCOM interprets the policy differently. MSEDCL (Maharashtra) generally allows hybrid with net metering. BESCOM (Karnataka) has been more restrictive.</li><li><strong>Practical approach</strong> — Install a hybrid inverter, apply for net metering as a grid-connected system, and clarify battery eligibility with your DISCOM. Your installer should guide you through local rules.</li></ul><p><a href=\"/in/solar-subsidy/how-to-apply/\">How to apply for solar subsidy →</a></p>"
    },
    {
      "heading": "Get Hybrid Solar Quotes",
      "body": "<p>Hybrid system design requires balancing grid-tie efficiency with backup needs — not every installer does this well. Solar Vipani connects you with verified installers experienced in hybrid configurations who will size your battery, design load prioritisation, and handle DISCOM approvals.</p><p><a href=\"/in/get-quotes/\">Get your free hybrid solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is a hybrid solar system?",
      "answer": "A hybrid solar system is grid-connected (like on-grid) but also includes a battery bank for backup during power cuts. It gives you net metering savings when the grid is available and seamless battery backup when the grid goes down — combining the advantages of both on-grid and off-grid."
    },
    {
      "question": "How much does a hybrid solar system cost in India?",
      "answer": "A 3kW hybrid system costs ₹2,30,000–₹3,00,000 — roughly ₹80,000–₹1,10,000 more than an equivalent on-grid system. The premium covers the battery bank and the more sophisticated hybrid inverter. Battery type (lead-acid vs lithium) significantly affects the total price."
    },
    {
      "question": "Does a hybrid system qualify for PM Surya Ghar subsidy?",
      "answer": "It depends on your state and DISCOM. Some allow subsidy on the grid-tied portion of a hybrid system (excluding battery). Others require pure on-grid configuration. Confirm eligibility with your local DISCOM before installation. Your installer can guide you."
    },
    {
      "question": "How long does hybrid battery backup last during a power cut?",
      "answer": "It depends on battery capacity and the load you run. A 3–5 kWh battery bank powers essential loads (lights, fans, WiFi, fridge) for 4–6 hours. For full-home backup including AC, you need 8–12 kWh of battery capacity. Most homeowners size for 3–5 hours of essential backup."
    },
    {
      "question": "Can I start with on-grid and upgrade to hybrid later?",
      "answer": "Only if you install a hybrid inverter from the start. A hybrid inverter can operate in pure on-grid mode (without batteries) and you can add batteries later. If you install an on-grid inverter, upgrading to hybrid means replacing the entire inverter."
    },
    {
      "question": "Is hybrid better than a separate solar system plus home inverter?",
      "answer": "Yes, for most cases. A hybrid solar system replaces both your solar setup and home UPS/inverter in one integrated system. It is more efficient (solar charges the battery directly instead of going through two conversion stages), takes less space, and the single hybrid inverter costs less than buying an on-grid solar inverter plus a separate home inverter."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'hybrid' AND pillar_slug = 'rooftop-solar';


-- 4. CLUSTER: for-apartments
UPDATE seo_pages SET
  h1 = 'Solar Panels for Apartments in India: Complete Guide for Flat Owners',
  meta_title = 'Solar for Apartments India: Society Approval, Subsidy & Setup Guide | Solar Vipani',
  meta_description = 'Install solar in your apartment or housing society. Learn about society approval, individual vs common area setups, group net metering, and PM Surya Ghar subsidy.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Yes, apartment flat owners in India can install rooftop solar — but it requires <strong>housing society approval</strong> and coordination with your DISCOM for group or virtual net metering. Under PM Surya Ghar, individual flat owners can claim subsidy for their share of a rooftop system. The most common approach is a <strong>society-level installation</strong> on the shared terrace, with capacity allocated per flat or used for common area electricity.</p>"
    },
    {
      "heading": "Two Models: Individual vs Society Installation",
      "body": "<p>Apartment solar installations follow one of two models:</p><h3>1. Society-Level Installation (Most Common)</h3><p>The housing society installs a solar system on the common terrace. Power is used for:</p><ul><li><strong>Common areas</strong> — lifts, corridor lights, water pumps, CCTV, clubhouse — reducing the maintenance bill for all residents.</li><li><strong>Individual allocation</strong> — Some societies allocate kW capacity per flat. Each flat owner gets net metering credits proportional to their share.</li></ul><h3>2. Individual Flat Owner Installation</h3><p>A single flat owner can install panels on their allocated terrace space (if the society permits). This is simpler from a metering standpoint but faces space constraints — most flats get 100–200 sq ft of rooftop allocation, enough for a 1–2kW system.</p><p>The society-level model is more practical and cost-effective because it uses shared infrastructure (inverter, wiring, net meter) and avoids per-flat space limitations.</p>"
    },
    {
      "heading": "Getting Housing Society Approval",
      "body": "<p>This is often the biggest hurdle. Here is a practical roadmap:</p><ol><li><strong>Build awareness</strong> — Share electricity savings data with committee members. A common-area solar system can cut society maintenance charges by ₹2–₹5 per sq ft per month.</li><li><strong>Pass a general body resolution</strong> — Most states require a resolution passed by the society AGM or special general meeting. In Maharashtra, a simple majority suffices.</li><li><strong>Get a structural assessment</strong> — Ensure the terrace can bear panel load (~15 kg/sq m). Most RCC roofs handle this easily. An installer can certify this.</li><li><strong>Choose the model</strong> — Common area only, or allocated per flat? This affects metering, billing, and subsidy eligibility.</li><li><strong>Select an installer</strong> — Get 2–3 quotes from MNRE-empanelled installers who have apartment experience.</li></ol><p>The entire process — from first committee meeting to operational system — typically takes 3–6 months for apartments.</p>"
    },
    {
      "heading": "Cost for Apartment Solar Systems",
      "body": "<p>Apartment solar costs follow the same per-kW pricing as standalone homes, but with some differences:</p><table><thead><tr><th>Setup Type</th><th>Typical Size</th><th>Cost (before subsidy)</th><th>Monthly Savings</th></tr></thead><tbody><tr><td>Common area only</td><td>5–20kW</td><td>₹2,50,000–₹12,00,000</td><td>₹5,000–₹25,000 (society bill)</td></tr><tr><td>Individual flat (small terrace)</td><td>1–2kW</td><td>₹60,000–₹1,40,000</td><td>₹500–₹1,500 (flat bill)</td></tr><tr><td>Society-wide with per-flat allocation</td><td>10–50kW</td><td>₹5,00,000–₹30,00,000</td><td>₹15,000–₹60,000 (total)</td></tr></tbody></table><p><strong>Cost advantage at scale:</strong> Larger society installations get better per-watt pricing (₹45–₹55/W vs ₹55–₹75/W for small residential) because of volume discounts on panels, shared inverter capacity, and single-point installation labour.</p><p><a href=\"/in/rooftop-solar/cost/\">Detailed cost breakdown →</a></p>"
    },
    {
      "heading": "Net Metering for Apartments",
      "body": "<p>Net metering in apartments works differently from standalone homes:</p><h3>Group Net Metering</h3><p>A single bi-directional meter is installed at the society level. Surplus solar power offsets the society common area electricity bill. Credits reduce the maintenance charges for all residents.</p><h3>Virtual Net Metering (VNM)</h3><p>Available in some states (Maharashtra, Gujarat, Andhra Pradesh). VNM allows a single rooftop system to distribute credits across multiple individual flat electricity meters. Each flat owner sees reduced bills proportional to their allocated share.</p><h3>Individual Net Metering</h3><p>If a flat owner installs panels on their allocated space, they can apply for an individual net meter — same as a standalone home. Only practical if you have sufficient dedicated rooftop area.</p><p><strong>State-level rules vary significantly.</strong> Your installer should confirm which metering option your DISCOM supports. <a href=\"/in/solar-subsidy/net-metering/\">Net metering rules by state →</a></p>"
    },
    {
      "heading": "PM Surya Ghar Subsidy for Apartments",
      "body": "<p>The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a> scheme explicitly includes apartment flat owners. Key rules:</p><ul><li><strong>Individual flat owners can apply</strong> — Each flat owner applies separately using their individual electricity consumer number.</li><li><strong>Subsidy is per consumer</strong> — Each flat can claim up to ₹78,000 subsidy (for 3kW allocation).</li><li><strong>Society common area</strong> — The society can apply as a single entity for the common area system. Subsidy applies to the first 3kW.</li><li><strong>On-grid only</strong> — The system must be grid-connected with net metering. <a href=\"/in/rooftop-solar/on-grid/\">On-grid systems explained →</a></li><li><strong>MNRE vendor required</strong> — Must be installed by an empanelled installer.</li></ul><p>In practice, the most subsidy-efficient approach is a society-level installation with virtual net metering, where each participating flat owner claims their individual subsidy.</p><p><a href=\"/in/solar-subsidy/eligibility/\">Check your subsidy eligibility →</a></p>"
    },
    {
      "heading": "Common Challenges and Solutions",
      "body": "<ul><li><strong>Limited rooftop space</strong> — Use high-efficiency <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline</a> or <a href=\"/in/solar-panels/bifacial/\">bifacial panels</a> to maximise output per sq ft. A 3kW system with modern 540W panels needs just 6 panels (~180 sq ft).</li><li><strong>Shadow from water tanks, lift rooms</strong> — Installers use micro-inverters or power optimisers to mitigate partial shading. These cost more but prevent one shaded panel from dragging down the entire string.</li><li><strong>Multiple flat owners, single system</strong> — Draft a solar agreement specifying each flat capacity allocation, maintenance responsibility, and exit terms (if a flat is sold).</li><li><strong>Maintenance access</strong> — Designate a society member or the installer for quarterly panel cleaning and annual system checks.</li><li><strong>Tenant vs owner</strong> — Only the owner (named on the electricity bill) can apply for subsidy and net metering. Tenants benefit from reduced bills but cannot claim subsidy.</li></ul>"
    },
    {
      "heading": "Step-by-Step: Installing Solar in Your Apartment",
      "body": "<ol><li><strong>Propose to your society committee</strong> — Present the financial case: savings estimates, subsidy benefits, and maintenance bill reduction.</li><li><strong>Pass a resolution</strong> — Get it on the AGM agenda. Need simple majority in most states.</li><li><strong>Get quotes</strong> — <a href=\"/in/get-quotes/\">Request 2–3 quotes</a> from installers experienced with apartment projects.</li><li><strong>Choose capacity and model</strong> — Common area only, or per-flat allocation? Your installer will recommend based on rooftop area and DISCOM rules.</li><li><strong>Apply for net metering</strong> — Installer handles DISCOM paperwork (group/virtual/individual metering).</li><li><strong>Installation</strong> — Typically 2–5 days for a society system. Minimal disruption to residents.</li><li><strong>DISCOM inspection</strong> — Inspector verifies installation, activates net meter.</li><li><strong>Apply for subsidy</strong> — Each eligible flat owner applies through the PM Surya Ghar portal post-commissioning.</li></ol><p><a href=\"/in/solar-installation/process/\">Detailed installation process →</a></p>"
    },
    {
      "heading": "Get Apartment Solar Quotes",
      "body": "<p>Apartment solar projects need installers who understand society dynamics, group metering, and multi-owner coordination. Solar Vipani connects your housing society with verified installers experienced in apartment installations.</p><p><a href=\"/in/get-quotes/\">Get your free apartment solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Can I install solar panels on my apartment in India?",
      "answer": "Yes. You need housing society approval (a general body resolution), adequate rooftop space, and DISCOM coordination for net metering. Both individual flat installations and society-level installations are possible. PM Surya Ghar subsidy is available for apartment flat owners."
    },
    {
      "question": "How much does apartment solar cost?",
      "answer": "For common area systems: ₹2,50,000–₹12,00,000 (5–20kW). For individual flat allocation: ₹60,000–₹1,40,000 (1–2kW). Society-level installations get better per-watt pricing (₹45–₹55/W) due to volume discounts vs ₹55–₹75/W for small standalone systems."
    },
    {
      "question": "Can apartment flat owners get PM Surya Ghar subsidy?",
      "answer": "Yes. Each flat owner applies individually using their electricity consumer number and can claim up to ₹78,000 subsidy for a 3kW allocation. The system must be on-grid with net metering and installed by an MNRE-empanelled vendor."
    },
    {
      "question": "What is virtual net metering for apartments?",
      "answer": "Virtual net metering (VNM) allows a single rooftop solar system to distribute credits across multiple electricity meters (individual flats). Each flat sees reduced bills proportional to their allocated share. Available in Maharashtra, Gujarat, Andhra Pradesh, and a few other states."
    },
    {
      "question": "How much rooftop space do I need per flat for solar?",
      "answer": "About 100 sq ft per kW. A 1kW system (enough to offset ₹500–₹1,000/month) needs just 2 modern 540W panels taking ~60 sq ft. For a 20-flat society with 3,000 sq ft of usable terrace, a 15–20kW shared system is typical."
    },
    {
      "question": "What if some flat owners do not want solar?",
      "answer": "The society can still install solar for common areas (lifts, lights, pumps) with a majority resolution. For per-flat allocation, only participating owners need to opt in. Non-participating flats are not affected — they continue with their regular electricity bills."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-apartments' AND pillar_slug = 'rooftop-solar';

COMMIT;
