-- Solar Inverters Clusters Batch 2: on-grid, off-grid, hybrid, micro-inverter
-- Run: psql $POSTGRES_URL < 017-solar-inverters-clusters-batch2.sql

BEGIN;

-- 1. CLUSTER: on-grid
UPDATE seo_pages SET
  h1 = 'On-Grid Solar Inverters in India: How They Work, Prices & Best Brands',
  meta_title = 'On-Grid Solar Inverter: Price, Working & Best Brands India 2026 | Solar Vipani',
  meta_description = 'On-grid solar inverters cost ₹8,000–₹90,000. Learn how grid-tie inverters work with net metering, compare brands, and find out if on-grid is right for your home.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>An on-grid (grid-tie) <a href=\"/in/solar-inverters/\">solar inverter</a> connects your solar panels directly to the electricity grid. It converts DC power from panels to AC, feeds your home first, and exports surplus to the grid through <a href=\"/in/solar-subsidy/net-metering/\">net metering</a>. On-grid inverters are the <strong>most affordable</strong> type (₹18,000–₹35,000 for 3kW), <strong>most efficient</strong> (96–98%), and the <strong>only type that fully qualifies</strong> for <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a>. They do not provide backup during power cuts.</p>"
    },
    {
      "heading": "How an On-Grid Inverter Works",
      "body": "<p>The on-grid inverter performs three core functions simultaneously:</p><ol><li><strong>DC-to-AC conversion</strong> — Converts variable DC voltage from panels (200–600V DC) into stable 230V AC at 50Hz, matching the Indian grid standard.</li><li><strong>Maximum Power Point Tracking (MPPT)</strong> — Continuously adjusts the electrical load on panels to extract maximum possible power as sunlight intensity changes throughout the day.</li><li><strong>Grid synchronisation</strong> — Matches the output waveform precisely to the grid''s voltage, frequency, and phase. This allows seamless power flow between your system and the DISCOM grid.</li></ol><p><strong>Anti-islanding protection:</strong> If the grid goes down, the on-grid inverter shuts off within milliseconds. This is a safety requirement — it prevents your system from back-feeding electricity to the grid and endangering utility workers. This also means your solar system does not generate power during outages.</p>"
    },
    {
      "heading": "On-Grid Inverter Price by Capacity",
      "body": "<p>On-grid inverters are the most affordable solar inverter type. Here are current prices from our installer network:</p><table><thead><tr><th>Capacity</th><th>Price Range</th><th>Typical Use</th></tr></thead><tbody><tr><td>1kW</td><td>₹8,000–₹14,000</td><td>1 BHK, basic loads</td></tr><tr><td>2kW</td><td>₹14,000–₹25,000</td><td>2 BHK, moderate usage</td></tr><tr><td>3kW</td><td>₹18,000–₹35,000</td><td>2–3 BHK, most popular</td></tr><tr><td>5kW</td><td>₹28,000–₹50,000</td><td>Large homes, AC heavy</td></tr><tr><td>10kW</td><td>₹50,000–₹90,000</td><td>Villas, small commercial</td></tr></tbody></table><p>Budget brands (Growatt, UTL) sit at the lower end. Premium European brands (Fronius, SMA) at the higher end. Indian brands (Havells, Polycab) fall in the mid-range.</p><p>→ <a href=\"/in/solar-inverters/price/\">Complete solar inverter price list</a></p>"
    },
    {
      "heading": "Best On-Grid Inverter Brands in India",
      "body": "<p>Here are the top on-grid inverter brands used by our installer network, ranked by popularity:</p><table><thead><tr><th>Brand</th><th>Origin</th><th>Strengths</th><th>Warranty</th></tr></thead><tbody><tr><td>Growatt</td><td>China</td><td>Best value, excellent ShinePhone app, wide range</td><td>5 yr (ext. 10)</td></tr><tr><td>Goodwe</td><td>China</td><td>Wide MPPT range, compact design, SEMS portal</td><td>5 yr (ext. 10)</td></tr><tr><td>Havells</td><td>India</td><td>Strong service network, BIS certified, trusted brand</td><td>5 yr</td></tr><tr><td>Polycab</td><td>India</td><td>Competitive pricing, growing solar range</td><td>5 yr</td></tr><tr><td>Fronius</td><td>Austria</td><td>Premium efficiency, Fronius Solar.web monitoring</td><td>5 yr (ext. 10)</td></tr><tr><td>SMA</td><td>Germany</td><td>Industry benchmark, Sunny Portal</td><td>5 yr (ext. 10)</td></tr></tbody></table><p>For most residential installations, <strong>Growatt and Goodwe</strong> deliver the best performance-to-price ratio. For commercial or premium residential setups, <strong>Fronius</strong> justifies its premium.</p>"
    },
    {
      "heading": "On-Grid vs Hybrid: Should You Pay More for Backup?",
      "body": "<p>This is the most common decision point for urban Indian homeowners. Here is a direct comparison:</p><table><thead><tr><th>Feature</th><th>On-Grid</th><th><a href=\"/in/solar-inverters/hybrid/\">Hybrid</a></th></tr></thead><tbody><tr><td>Price (3kW)</td><td>₹18,000–₹35,000</td><td>₹40,000–₹70,000</td></tr><tr><td>Battery cost</td><td>None</td><td>₹40,000–₹1,50,000 extra</td></tr><tr><td>Net metering</td><td>Yes</td><td>Yes</td></tr><tr><td>Power during outages</td><td>No</td><td>Yes</td></tr><tr><td>Subsidy eligible</td><td>Yes (full)</td><td>Partial</td></tr><tr><td>Efficiency</td><td>96–98%</td><td>94–97%</td></tr></tbody></table><p><strong>Choose on-grid if:</strong> Your grid supply is reliable (fewer than 2–3 hours of outage per month). You want maximum ROI. You qualify for full government subsidy.</p><p><strong>Choose hybrid if:</strong> Power cuts are frequent or prolonged. You need to run critical appliances (fridge, Wi-Fi, lights) during outages. You are willing to pay 2–3x more for the inverter plus batteries.</p>"
    },
    {
      "heading": "MPPT Channels: Single vs Dual",
      "body": "<p>MPPT (Maximum Power Point Tracking) is the algorithm that extracts maximum power from your panels. The number of MPPT channels determines how flexibly you can lay out your panels:</p><ul><li><strong>Single MPPT</strong> — All panels must face the same direction and have similar shading conditions. Cheapest option, works perfectly for uniform south-facing roofs.</li><li><strong>Dual MPPT</strong> — Panels can be split into two groups (strings) on different roof faces (e.g., east + west). Each string is optimised independently. Adds ₹2,000–₹5,000 to inverter cost but delivers 5–15% more energy on roofs with two orientations.</li></ul><p>If your roof has a single unshaded south-facing area, single MPPT is fine. If panels will face two directions or have different shading, dual MPPT is worth the premium.</p>"
    },
    {
      "heading": "Net Metering and On-Grid Inverters",
      "body": "<p>Net metering is what makes on-grid solar financially powerful. Here is the process:</p><ol><li>Your installer applies to the DISCOM for a net meter connection.</li><li>DISCOM installs a bi-directional meter that tracks import and export.</li><li>During peak sun hours, your panels generate more than your home uses — the surplus flows to the grid.</li><li>At night and on cloudy days, you draw from the grid normally.</li><li>Monthly or annually, the DISCOM bills you for the <em>net</em> (import minus export).</li></ol><p>In most Indian states, excess credits carry forward for up to 12 months. Some states settle annually, others allow indefinite banking. Your installer will handle the net metering application as part of the installation process.</p><p>→ <a href=\"/in/solar-subsidy/net-metering/\">Complete net metering guide</a></p>"
    },
    {
      "heading": "Installation and Maintenance",
      "body": "<p>On-grid inverters are the easiest to install and maintain:</p><ul><li><strong>Installation:</strong> Wall-mounted unit near your distribution board. Requires DC input from panels and AC output to switchboard. Most installers complete the inverter setup in 2–4 hours.</li><li><strong>Ventilation:</strong> Install in a shaded, well-ventilated area. Inverters generate heat during operation — poor ventilation reduces efficiency and lifespan.</li><li><strong>Monitoring:</strong> Most modern on-grid inverters include Wi-Fi and a mobile app. Check daily generation, compare to expected output, and receive alerts for faults.</li><li><strong>Maintenance:</strong> No moving parts. Annual inspection of connections and firmware updates. Clean dust from ventilation grilles every few months.</li></ul>"
    },
    {
      "heading": "Get On-Grid Inverter Quotes",
      "body": "<p>The right on-grid inverter depends on your system size, roof layout, and preferred brand. Solar Vipani''s verified installers will recommend the optimal inverter for your setup — with itemised quotes that break down the inverter cost separately.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Can an on-grid solar inverter work during power cuts?",
      "answer": "No. On-grid inverters have anti-islanding protection that automatically shuts them down when the grid goes down. This is a safety requirement to prevent back-feeding electricity to the grid. If you need power during outages, you need a hybrid inverter with battery backup or a separate UPS/inverter for critical loads."
    },
    {
      "question": "What is the best on-grid solar inverter brand in India?",
      "answer": "Growatt and Goodwe are the most popular on-grid brands for residential installations — offering reliable performance, good monitoring apps, and competitive pricing. Fronius (Austria) and SMA (Germany) are premium options with higher efficiency. Indian brands Havells and Polycab offer strong local service support."
    },
    {
      "question": "How much does a 3kW on-grid solar inverter cost?",
      "answer": "A 3kW on-grid solar inverter costs ₹18,000–₹35,000 in India depending on brand and features. Growatt and Goodwe start around ₹18,000–₹24,000. Indian brands like Havells cost ₹22,000–₹30,000. Premium brands like Fronius cost ₹32,000–₹45,000. These prices include GST."
    },
    {
      "question": "Do on-grid solar inverters qualify for government subsidy?",
      "answer": "Yes. On-grid solar systems with grid-tie inverters fully qualify for the PM Surya Ghar subsidy of up to ₹78,000. The system must be installed by an MNRE-empanelled vendor and connected to the grid with a net meter. This is a key advantage of on-grid over off-grid systems."
    },
    {
      "question": "How long does an on-grid solar inverter last?",
      "answer": "On-grid inverters typically last 10–15 years. Most brands offer a standard 5-year warranty with an option to extend to 10 years for ₹3,000–₹8,000. Since solar panels last 25+ years, plan for one inverter replacement during your system lifetime. Proper ventilation and surge protection extend inverter life."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'on-grid' AND pillar_slug = 'solar-inverters';


-- 2. CLUSTER: off-grid
UPDATE seo_pages SET
  h1 = 'Off-Grid Solar Inverters in India: How They Work, Prices & When to Choose',
  meta_title = 'Off-Grid Solar Inverter: Price, Battery Setup & Best Brands India | Solar Vipani',
  meta_description = 'Off-grid solar inverters cost ₹12,000–₹1,20,000. Learn how they work with batteries, compare with on-grid and hybrid, and find the right setup for grid-independent power.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>An off-grid <a href=\"/in/solar-inverters/\">solar inverter</a> works independently of the electricity grid, using battery banks to store solar energy for use at night and on cloudy days. Off-grid inverters cost <strong>₹25,000–₹45,000 for a 3kW unit</strong> — 30–50% more than <a href=\"/in/solar-inverters/on-grid/\">on-grid inverters</a> — and require batteries (₹40,000–₹1,50,000 extra). They are the right choice for locations with no grid access or extremely unreliable power supply. They do not qualify for PM Surya Ghar subsidy and do not support net metering.</p>"
    },
    {
      "heading": "How an Off-Grid Solar Inverter Works",
      "body": "<p>An off-grid inverter has a more complex job than an on-grid unit because it must manage both energy conversion and energy storage:</p><ol><li><strong>Daytime — panels generating:</strong> Solar panels produce DC electricity. The inverter''s built-in charge controller routes power to (a) charge the battery bank and (b) convert DC to AC for your immediate loads.</li><li><strong>Battery full, excess generation:</strong> Once batteries are fully charged, the inverter limits panel output to match current consumption only. Excess solar energy is wasted (unlike on-grid, where it goes to the DISCOM grid).</li><li><strong>Night / low generation:</strong> The inverter draws DC from the battery bank, converts it to 230V AC, and powers your home. Battery capacity determines how many hours you can run your loads.</li></ol><p>The charge controller built into the inverter protects batteries from overcharging and deep discharge — both of which shorten battery life significantly.</p>"
    },
    {
      "heading": "Off-Grid Inverter Price by Capacity",
      "body": "<p>Off-grid inverters cost more than on-grid because they include battery management electronics and charge controllers. Here are current prices:</p><table><thead><tr><th>Capacity</th><th>Inverter Price</th><th>Battery Cost (Lead-Acid)</th><th>Battery Cost (Lithium)</th><th>Total System Add-On</th></tr></thead><tbody><tr><td>1kW</td><td>₹12,000–₹18,000</td><td>₹20,000–₹35,000</td><td>₹50,000–₹80,000</td><td>₹32,000–₹98,000</td></tr><tr><td>3kW</td><td>₹25,000–₹45,000</td><td>₹40,000–₹80,000</td><td>₹1,00,000–₹1,80,000</td><td>₹65,000–₹2,25,000</td></tr><tr><td>5kW</td><td>₹40,000–₹65,000</td><td>₹60,000–₹1,20,000</td><td>₹1,50,000–₹2,80,000</td><td>₹1,00,000–₹3,45,000</td></tr><tr><td>10kW</td><td>₹70,000–₹1,20,000</td><td>₹1,00,000–₹2,00,000</td><td>₹3,00,000–₹5,00,000</td><td>₹1,70,000–₹6,20,000</td></tr></tbody></table><p><em>Battery cost depends on capacity (kWh), type (lead-acid vs lithium), and brand. Lithium batteries cost 2–3x more upfront but last 2–3x longer.</em></p><p>→ <a href=\"/in/solar-inverters/price/\">Complete inverter price comparison</a></p>"
    },
    {
      "heading": "Lead-Acid vs Lithium Batteries for Off-Grid",
      "body": "<p>Battery choice defines the long-term cost and performance of your off-grid system:</p><table><thead><tr><th>Feature</th><th>Lead-Acid (Tubular)</th><th>Lithium (LiFePO4)</th></tr></thead><tbody><tr><td>Upfront cost</td><td>₹8,000–₹12,000/kWh</td><td>₹18,000–₹30,000/kWh</td></tr><tr><td>Cycle life</td><td>1,200–1,800 cycles</td><td>4,000–6,000 cycles</td></tr><tr><td>Lifespan</td><td>4–6 years</td><td>10–15 years</td></tr><tr><td>Usable capacity</td><td>50% (don''t discharge below 50%)</td><td>80–90%</td></tr><tr><td>Weight</td><td>Heavy (40–60 kg per battery)</td><td>Light (10–15 kg per kWh)</td></tr><tr><td>Maintenance</td><td>Water top-up every 3–6 months</td><td>Maintenance-free</td></tr></tbody></table><p>For new off-grid installations, <strong>lithium (LiFePO4) batteries are recommended</strong> despite higher upfront cost. Their longer life (10–15 years vs 4–6 years), deeper discharge capability, and zero maintenance make the total cost of ownership lower over a 15-year period.</p>"
    },
    {
      "heading": "Best Off-Grid Inverter Brands in India",
      "body": "<p>The off-grid inverter market in India is dominated by brands with strong battery-management expertise:</p><ul><li><strong>Luminous</strong> — Market leader in Indian off-grid inverters. Wide range from 1kW to 10kW. Strong service network across rural and urban India. Known for reliable PWM and MPPT charge controllers.</li><li><strong>Microtek</strong> — Second-largest player. Competitive pricing and good availability. Popular in Tier-2 and Tier-3 cities.</li><li><strong>UTL Solar</strong> — Strong in the agricultural and rural segment. Known for robust build quality suited to Indian conditions.</li><li><strong>Exide</strong> — Primarily a battery manufacturer that also offers inverter-battery combos. Good option for integrated packages.</li><li><strong>Su-Kam (now part of Luminous)</strong> — Legacy brand with established installations across India.</li></ul>"
    },
    {
      "heading": "When to Choose Off-Grid Over On-Grid",
      "body": "<p>Off-grid makes sense in specific situations:</p><ul><li><strong>No grid access</strong> — Farmhouses, remote properties, agricultural land, and hill stations without DISCOM connection.</li><li><strong>Grid unreliable (&gt;8 hours outage/day)</strong> — Where the grid is available but outages make it practically useless for consistent power.</li><li><strong>Agricultural pumping</strong> — <a href=\"/in/solar-pumps/\">Solar water pumps</a> in fields far from grid lines.</li><li><strong>Temporary setups</strong> — Construction sites, event venues, or seasonal use where grid connection is impractical.</li></ul><p>If grid supply is available and reasonably reliable (even with occasional outages), a <a href=\"/in/solar-inverters/hybrid/\">hybrid inverter</a> is almost always a better choice than off-grid — you get battery backup <em>and</em> net metering savings.</p>"
    },
    {
      "heading": "Sizing an Off-Grid System",
      "body": "<p>Off-grid sizing is more critical than on-grid because there is no grid to fall back on. Here is the approach:</p><ol><li><strong>Calculate daily consumption</strong> — List every appliance, its wattage, and hours of use. Total = daily kWh needed.</li><li><strong>Size the battery bank</strong> — Battery capacity (kWh) = daily consumption ÷ usable depth of discharge (50% for lead-acid, 80% for lithium) × days of autonomy (typically 1–2 days).</li><li><strong>Size the inverter</strong> — Inverter capacity (kVA) ≥ peak load (all appliances that might run simultaneously). Add 20% headroom.</li><li><strong>Size the panel array</strong> — Panel capacity (kW) = daily consumption ÷ peak sun hours (4.5–5.5 in India) × 1.3 (system losses).</li></ol><p>Get this wrong and you either overspend or face power shortages at night. A verified installer will do a proper load assessment before recommending off-grid sizing.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Use our solar calculator for a preliminary estimate</a></p>"
    },
    {
      "heading": "Get Off-Grid Solar Quotes",
      "body": "<p>Off-grid systems require careful sizing and component matching. Solar Vipani''s verified installers will assess your location, power needs, and budget to design the right off-grid setup — with itemised quotes covering inverter, batteries, panels, and installation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Can I get government subsidy for an off-grid solar system?",
      "answer": "No. The PM Surya Ghar subsidy is available only for on-grid (grid-connected) residential solar systems. Off-grid systems do not qualify because they are not connected to the DISCOM grid and cannot be net-metered. However, agricultural off-grid systems may qualify under the PM-KUSUM scheme."
    },
    {
      "question": "How many batteries do I need for an off-grid solar system?",
      "answer": "Battery count depends on your daily consumption and desired backup hours. For a 3kW system powering a typical home for 8–10 hours overnight, you need approximately 7–10 kWh of battery capacity — that is 4 × 150Ah lead-acid batteries (48V) or 1–2 lithium battery modules. An installer will calculate the exact requirement based on your loads."
    },
    {
      "question": "What happens when off-grid batteries are fully charged?",
      "answer": "When batteries reach full charge, the inverter''s charge controller reduces the charging current to a float/trickle level. Excess solar generation beyond your immediate load is essentially wasted — unlike on-grid systems where surplus goes to the grid. This is why off-grid systems should be sized to match consumption, not oversized."
    },
    {
      "question": "How often do off-grid batteries need replacement?",
      "answer": "Lead-acid tubular batteries last 4–6 years with proper maintenance (water top-up, avoiding deep discharge). Lithium LiFePO4 batteries last 10–15 years and are maintenance-free. Given the replacement cost, lithium batteries are increasingly the better long-term investment despite higher upfront cost."
    },
    {
      "question": "Can I add an off-grid system to my existing grid connection?",
      "answer": "Technically yes, but it is not recommended. Running an off-grid inverter alongside a grid connection without proper integration is unsafe and violates DISCOM regulations. If you want both grid and battery, install a hybrid inverter instead — it is designed to manage grid, solar, and battery safely and legally."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'off-grid' AND pillar_slug = 'solar-inverters';


-- 3. CLUSTER: hybrid
UPDATE seo_pages SET
  h1 = 'Hybrid Solar Inverters in India: Price, How They Work & Best Brands',
  meta_title = 'Hybrid Solar Inverter: Price, Battery Backup & Brands India 2026 | Solar Vipani',
  meta_description = 'Hybrid solar inverters combine grid-tie with battery backup. Compare prices (₹40,000–₹1,80,000), learn how they work, and find the best hybrid inverter for your home.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A hybrid <a href=\"/in/solar-inverters/\">solar inverter</a> combines the functionality of an <a href=\"/in/solar-inverters/on-grid/\">on-grid inverter</a> (grid connection + net metering) with battery management for backup during power cuts. A 3kW hybrid inverter costs <strong>₹40,000–₹70,000</strong> — about 2–3 times more than on-grid — plus battery cost (₹40,000–₹1,50,000). It is the best choice for Indian homes that want both <strong>bill savings through net metering</strong> and <strong>uninterrupted power during outages</strong>.</p>"
    },
    {
      "heading": "How a Hybrid Inverter Works",
      "body": "<p>A hybrid inverter manages three power sources — solar, grid, and battery — using intelligent priority logic:</p><ol><li><strong>Daytime (sunny):</strong> Solar powers your home first. Surplus charges the battery. Once the battery is full, remaining surplus is exported to the grid for net metering credits.</li><li><strong>Daytime (cloudy):</strong> Solar + battery supplement each other. Grid fills any shortfall.</li><li><strong>Night (grid available):</strong> You draw from the grid. Battery stays charged as reserve for outages.</li><li><strong>Power cut:</strong> The inverter switches to battery within 10–20 milliseconds — fast enough that lights do not flicker and routers do not reboot. It continues supplying AC power from the battery until grid returns or battery reaches minimum charge.</li></ol><p>You get the financial benefits of on-grid (net metering) with the security of off-grid (battery backup) in a single unit.</p>"
    },
    {
      "heading": "Hybrid Inverter Price by Capacity",
      "body": "<p>Hybrid inverters cost more due to integrated battery management, charger, and transfer switch:</p><table><thead><tr><th>Capacity</th><th>Inverter Price</th><th>Battery (Lithium)</th><th>Total Battery + Inverter</th></tr></thead><tbody><tr><td>3kW</td><td>₹40,000–₹70,000</td><td>₹50,000–₹1,00,000</td><td>₹90,000–₹1,70,000</td></tr><tr><td>5kW</td><td>₹60,000–₹1,00,000</td><td>₹80,000–₹1,50,000</td><td>₹1,40,000–₹2,50,000</td></tr><tr><td>10kW</td><td>₹1,00,000–₹1,80,000</td><td>₹1,50,000–₹3,00,000</td><td>₹2,50,000–₹4,80,000</td></tr></tbody></table><p>The premium over <a href=\"/in/solar-inverters/on-grid/\">on-grid</a> is ₹20,000–₹40,000 for the inverter alone. Add battery cost and the total premium is ₹70,000–₹1,50,000. This buys you power continuity during outages — a decision that depends on your area''s grid reliability.</p><p>→ <a href=\"/in/solar-inverters/price/\">Full solar inverter price comparison</a></p>"
    },
    {
      "heading": "Best Hybrid Inverter Brands in India",
      "body": "<p>The hybrid inverter market in India is led by brands with strong battery integration:</p><table><thead><tr><th>Brand</th><th>Origin</th><th>3kW Price</th><th>Key Strength</th></tr></thead><tbody><tr><td>Growatt</td><td>China</td><td>₹40,000–₹55,000</td><td>Best value, ShinePhone app, wide range</td></tr><tr><td>Goodwe</td><td>China</td><td>₹45,000–₹60,000</td><td>ET/BT series, strong MPPT performance</td></tr><tr><td>Deye</td><td>China</td><td>₹42,000–₹58,000</td><td>Competitive pricing, growing Indian presence</td></tr><tr><td>Solis</td><td>China</td><td>₹48,000–₹65,000</td><td>Global hybrid experience, SolisCloud</td></tr><tr><td>Fronius</td><td>Austria</td><td>₹65,000–₹90,000</td><td>Premium build, Fronius Solar.web</td></tr></tbody></table><p>For most Indian residential installations, <strong>Growatt and Goodwe hybrid inverters</strong> offer the best balance of features, reliability, and price. Both support major lithium battery brands and have established service networks in India.</p>"
    },
    {
      "heading": "Hybrid vs On-Grid: Is the Premium Worth It?",
      "body": "<p>The core tradeoff is cost vs power continuity:</p><table><thead><tr><th>Factor</th><th>On-Grid (3kW)</th><th>Hybrid (3kW)</th></tr></thead><tbody><tr><td>Inverter cost</td><td>₹18,000–₹35,000</td><td>₹40,000–₹70,000</td></tr><tr><td>Battery cost</td><td>₹0</td><td>₹50,000–₹1,00,000</td></tr><tr><td>Total premium</td><td>—</td><td>₹70,000–₹1,35,000 more</td></tr><tr><td>Power during outages</td><td>No</td><td>Yes (4–8 hours typical)</td></tr><tr><td>Net metering</td><td>Yes</td><td>Yes</td></tr><tr><td>Subsidy</td><td>Full</td><td>Partial (on solar component)</td></tr></tbody></table><p><strong>Choose on-grid</strong> if your grid supply is reliable and you want maximum ROI. <strong>Choose hybrid</strong> if you face frequent power cuts and need essential loads (lights, fans, fridge, Wi-Fi) running during outages.</p><p>Many homeowners install hybrid inverters <em>without batteries initially</em> (using them as on-grid) and add batteries later when budget allows or power cuts increase.</p>"
    },
    {
      "heading": "Battery Sizing for Hybrid Systems",
      "body": "<p>Hybrid battery sizing depends on what you want to power during outages and for how long:</p><table><thead><tr><th>Backup Need</th><th>Typical Loads</th><th>Battery Size</th><th>Approx. Cost (Lithium)</th></tr></thead><tbody><tr><td>Essential (4–6 hours)</td><td>Lights, fans, Wi-Fi, phone charging</td><td>2–3 kWh</td><td>₹40,000–₹70,000</td></tr><tr><td>Moderate (6–8 hours)</td><td>Above + fridge + laptop</td><td>4–5 kWh</td><td>₹70,000–₹1,20,000</td></tr><tr><td>Full home (8–12 hours)</td><td>Most appliances except AC/geyser</td><td>7–10 kWh</td><td>₹1,30,000–₹2,50,000</td></tr></tbody></table><p>Start with essential backup and expand later. Most hybrid inverters support adding more battery modules as your needs (or budget) grow.</p>"
    },
    {
      "heading": "Installation Considerations",
      "body": "<p>Hybrid systems have a few additional installation requirements compared to on-grid:</p><ul><li><strong>Battery space</strong> — Lithium batteries are compact (a 5kWh wall-mounted unit is about the size of a small suitcase). Lead-acid batteries need a ventilated room. Plan for battery placement during the design phase.</li><li><strong>Wiring</strong> — Hybrid inverters have more connections: DC input from panels, AC output to home, AC input from grid, and DC connections to batteries. Professional installation is essential.</li><li><strong>Essential load panel</strong> — During outages, the hybrid inverter powers only loads connected to the designated backup circuit. Your installer will set up a sub-panel for essential loads.</li><li><strong>DISCOM approval</strong> — Some DISCOMs require additional documentation for hybrid systems. Your installer handles this as part of the net metering application.</li></ul>"
    },
    {
      "heading": "Get Hybrid Inverter Quotes",
      "body": "<p>Hybrid system design requires matching the inverter, battery, and panel array to your specific consumption pattern and backup needs. Solar Vipani''s verified installers will assess your power usage, outage frequency, and budget to design the optimal hybrid setup.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Can a hybrid inverter work without batteries?",
      "answer": "Yes. Most hybrid inverters can operate in on-grid mode without batteries — they simply function as a grid-tie inverter with net metering. You can add batteries later. This is a common strategy: install the hybrid inverter now (paying the small premium over on-grid) and add batteries when needed or when battery prices drop further."
    },
    {
      "question": "How long can a hybrid inverter provide backup during a power cut?",
      "answer": "Backup duration depends on battery size and load. A 5kWh lithium battery running essential loads (lights, fans, Wi-Fi, fridge) typically provides 6–8 hours of backup. Running heavier loads (AC, washing machine) drains the battery much faster. Most homeowners size batteries for 4–8 hours of essential backup."
    },
    {
      "question": "Is a hybrid solar inverter eligible for government subsidy?",
      "answer": "Partially. The solar panel and grid-tie component of a hybrid system may qualify for PM Surya Ghar subsidy, but the battery component typically does not. Subsidy eligibility depends on your DISCOM and state policy. Consult your installer about subsidy applicability for hybrid setups in your area."
    },
    {
      "question": "Which is better: hybrid inverter or on-grid inverter with separate UPS?",
      "answer": "A hybrid inverter is better in most cases. It charges the battery from solar (free energy), manages the grid-battery-solar interaction intelligently, and provides seamless switchover. A separate UPS charges from the grid (paid electricity) and does not integrate with solar. The only advantage of a separate UPS is lower upfront cost if you already own one."
    },
    {
      "question": "What battery type is best for hybrid solar inverters?",
      "answer": "Lithium iron phosphate (LiFePO4) batteries are the best choice for hybrid systems. They last 10–15 years (vs 4–6 years for lead-acid), discharge to 80–90% depth safely, require no maintenance, and are compact. Despite costing 2–3x more upfront, their longer lifespan makes the total cost of ownership lower."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'hybrid' AND pillar_slug = 'solar-inverters';


-- 4. CLUSTER: micro-inverter
UPDATE seo_pages SET
  h1 = 'Micro Inverters for Solar: How They Work, Prices & When to Choose Them',
  meta_title = 'Micro Inverter for Solar: Price, Benefits & Enphase in India 2026 | Solar Vipani',
  meta_description = 'Micro inverters cost ₹8,000–₹12,000 per panel. Learn how panel-level optimisation works, compare with string inverters, and find out if micro inverters suit your roof.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A micro inverter is a small DC-to-AC converter attached to each individual <a href=\"/in/solar-panels/\">solar panel</a>. Unlike string inverters where one shaded panel drags down the entire string, each panel with a micro inverter operates independently — delivering <strong>5–25% more energy</strong> on shaded or multi-orientation roofs. Micro inverters cost <strong>₹8,000–₹12,000 per panel</strong> (₹48,000–₹72,000 for a 6-panel/3kW system), carry <strong>25-year warranties</strong>, and offer panel-level monitoring. They are the premium choice for complex roofs.</p>"
    },
    {
      "heading": "How Micro Inverters Work",
      "body": "<p>In a traditional string inverter system, panels are wired in series — like a chain. If one panel underperforms (due to shade, dirt, or a defect), it drags down the output of the entire string. Micro inverters eliminate this problem:</p><ol><li><strong>Each panel gets its own inverter</strong> — A micro inverter is mounted on the racking beneath each panel. It converts that panel''s DC output to AC independently.</li><li><strong>AC output combines at the junction box</strong> — All micro inverter AC outputs are wired in parallel to a combiner box, then to your switchboard.</li><li><strong>Panel-level MPPT</strong> — Each micro inverter runs its own Maximum Power Point Tracking. If one panel is shaded, only that panel''s output drops — all others continue at full capacity.</li><li><strong>Panel-level monitoring</strong> — You can see the output of each individual panel on a monitoring app, making it easy to spot issues like dirt, shade, or a failing panel.</li></ol>"
    },
    {
      "heading": "Micro Inverter Price in India",
      "body": "<p>Micro inverters cost more per watt than string inverters. Here is the comparison for typical system sizes:</p><table><thead><tr><th>System Size</th><th>Panels</th><th>Micro Inverter Cost (Total)</th><th>On-Grid String Inverter</th><th>Premium</th></tr></thead><tbody><tr><td>2kW</td><td>4</td><td>₹32,000–₹48,000</td><td>₹14,000–₹25,000</td><td>₹18,000–₹23,000</td></tr><tr><td>3kW</td><td>6</td><td>₹48,000–₹72,000</td><td>₹18,000–₹35,000</td><td>₹30,000–₹37,000</td></tr><tr><td>5kW</td><td>10</td><td>₹80,000–₹1,20,000</td><td>₹28,000–₹50,000</td><td>₹52,000–₹70,000</td></tr><tr><td>10kW</td><td>18–20</td><td>₹1,44,000–₹2,40,000</td><td>₹50,000–₹90,000</td><td>₹94,000–₹1,50,000</td></tr></tbody></table><p>The 30–50% per-watt premium is significant but is offset by higher energy harvest (5–25% depending on shading) and 25-year warranty (eliminating the inverter replacement cost that string inverter owners face at year 10–15).</p><p>→ <a href=\"/in/solar-inverters/price/\">Full inverter price comparison</a></p>"
    },
    {
      "heading": "When Micro Inverters Make Sense",
      "body": "<p>Micro inverters justify their premium in these scenarios:</p><ul><li><strong>Partial shading</strong> — Trees, chimneys, water tanks, or neighbouring buildings cast shadows on part of your roof at certain times of day. With string inverters, one shaded panel reduces the entire string''s output. Micro inverters isolate the impact to just the shaded panel.</li><li><strong>Multiple roof orientations</strong> — Panels on east-facing and west-facing sections need different MPPT. A dual-MPPT string inverter handles two orientations; micro inverters handle any number.</li><li><strong>Complex roof geometry</strong> — L-shaped, multi-level, or dormer roofs where panels cannot all face the same direction and tilt.</li><li><strong>Small or expandable systems</strong> — Start with 2–3 panels and add more over time. Each new panel just needs its own micro inverter, no system redesign.</li><li><strong>Long-term cost priority</strong> — The 25-year micro inverter warranty eliminates the ₹18,000–₹50,000 string inverter replacement cost at year 10–15.</li></ul>"
    },
    {
      "heading": "Micro Inverter vs String Inverter: Full Comparison",
      "body": "<p>Here is a detailed comparison to help you decide:</p><table><thead><tr><th>Feature</th><th>String Inverter</th><th>Micro Inverter</th></tr></thead><tbody><tr><td>Architecture</td><td>1 inverter for all panels</td><td>1 inverter per panel</td></tr><tr><td>Cost (3kW)</td><td>₹18,000–₹35,000</td><td>₹48,000–₹72,000</td></tr><tr><td>Shading tolerance</td><td>Poor — one panel affects entire string</td><td>Excellent — each panel independent</td></tr><tr><td>Energy harvest (no shade)</td><td>Baseline</td><td>+2–5% (panel-level MPPT)</td></tr><tr><td>Energy harvest (partial shade)</td><td>Baseline</td><td>+10–25%</td></tr><tr><td>Monitoring</td><td>System-level only</td><td>Panel-level (diagnose issues per panel)</td></tr><tr><td>Warranty</td><td>5–10 years</td><td>25 years</td></tr><tr><td>Lifespan</td><td>10–15 years (1 replacement likely)</td><td>25+ years (no replacement)</td></tr><tr><td>Maintenance</td><td>Easy access (wall-mounted)</td><td>Roof-mounted (harder access, but rare issues)</td></tr><tr><td>Expandability</td><td>Limited by inverter capacity</td><td>Add panels + micro inverters freely</td></tr></tbody></table>"
    },
    {
      "heading": "Enphase: The Leading Micro Inverter Brand",
      "body": "<p>Enphase Energy (USA) dominates the global and Indian micro inverter market. Their IQ series is the standard for residential micro inverters:</p><ul><li><strong>Enphase IQ7+</strong> — The most common model for Indian installations. 295W AC output. Pairs well with 400–540W panels.</li><li><strong>Enphase IQ8+</strong> — Latest generation. Higher output (300W AC). Sunlight Backup feature allows limited power generation even during grid outages without batteries.</li><li><strong>Enphase Envoy</strong> — The communication gateway. Connects all micro inverters to the Enphase Enlighten monitoring platform via your home Wi-Fi.</li><li><strong>Enphase Enlighten app</strong> — Industry-leading monitoring. See per-panel output in real-time. Automatic alerts for underperforming panels.</li></ul><p>Other micro inverter brands available in India include <strong>APsystems</strong> (budget alternative) and <strong>Hoymiles</strong> (mid-range), but Enphase has the largest installer network and longest track record in India.</p>"
    },
    {
      "heading": "Installation and Reliability",
      "body": "<p>Micro inverters are installed differently from string inverters:</p><ul><li><strong>Mounting:</strong> Each micro inverter is attached to the panel racking, beneath the panel. This protects it from direct sun and rain while maintaining ventilation.</li><li><strong>Wiring:</strong> Micro inverters output AC, so the cabling from roof to switchboard is all AC — simpler and safer than the high-voltage DC cabling in string inverter systems.</li><li><strong>No single point of failure:</strong> If one micro inverter fails, only that panel stops producing. The rest of the system continues at full output. With a string inverter, any inverter fault shuts down the entire system.</li><li><strong>Replacement:</strong> A failed micro inverter can be swapped in 15–20 minutes by your installer — covered under the 25-year warranty.</li></ul><p>The main practical concern is roof access for servicing. Since micro inverters are on the roof, any repair requires climbing up. However, with a 25-year warranty and no moving parts, failures are rare.</p>"
    },
    {
      "heading": "Get Micro Inverter Quotes",
      "body": "<p>Not every installer offers micro inverters — they require Enphase certification and specific design expertise. Solar Vipani''s network includes Enphase-certified installers who can assess whether micro inverters are the right choice for your roof and provide itemised quotes.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Are micro inverters better than string inverters?",
      "answer": "Micro inverters are better for shaded, multi-orientation, or complex roofs — they deliver 5–25% more energy in these conditions and offer 25-year warranties. For simple, shade-free roofs with uniform south-facing panels, a string inverter offers similar performance at 30–50% lower cost. The best choice depends on your specific roof conditions."
    },
    {
      "question": "How much do micro inverters cost in India?",
      "answer": "Micro inverters cost ₹8,000–₹12,000 per panel in India. For a typical 3kW system with 6 panels, the total micro inverter cost is ₹48,000–₹72,000 — compared to ₹18,000–₹35,000 for an equivalent on-grid string inverter. The premium is offset by higher energy harvest and the 25-year warranty."
    },
    {
      "question": "Do micro inverters work during power cuts?",
      "answer": "Standard micro inverters (like Enphase IQ7) shut down during grid outages, just like on-grid string inverters — this is an anti-islanding safety requirement. The newer Enphase IQ8 series has a Sunlight Backup feature that can provide limited power during outages without batteries, but this requires additional equipment."
    },
    {
      "question": "How long do micro inverters last?",
      "answer": "Micro inverters carry a 25-year warranty from Enphase — matching the lifespan of solar panels. They have no fans or moving parts and are designed to operate for the full life of your solar system. This eliminates the inverter replacement cost (₹18,000–₹50,000) that string inverter owners typically face at year 10–15."
    },
    {
      "question": "Can I mix micro inverters with a string inverter?",
      "answer": "No. A solar system should use either string inverters or micro inverters — not both. The two architectures are fundamentally different (DC vs AC wiring, different monitoring systems, different design approaches). Choose one technology based on your roof conditions and stick with it."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'micro-inverter' AND pillar_slug = 'solar-inverters';

COMMIT;
