-- Solar Inverters Clusters Batch 3: string-inverter, hybrid-inverter, on-grid-inverter, off-grid-inverter
-- Run: psql $POSTGRES_URL < 032-solar-inverters-clusters-batch3.sql

BEGIN;

-- 1. CLUSTER: string-inverter
UPDATE seo_pages SET
  h1 = 'String Inverters for Solar: How They Work, Pros & Cons',
  meta_title = 'String Inverter for Solar: Working, Price & When to Choose | Solar Vipani',
  meta_description = 'String inverters cost ₹8,000–₹1,20,000 and are the most common solar inverter type. Learn how they work, compare with micro-inverters, and find the right size.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A string inverter is a centralised solar inverter that converts DC power from an entire <strong>string</strong> (series-connected group) of solar panels into AC power. It is the most widely used inverter type in India, handling 85%+ of residential and commercial installations. String inverters cost <strong>₹8,000–₹1,20,000</strong> depending on capacity, making them the most cost-effective option for most rooftop solar systems.</p>"
    },
    {
      "heading": "How String Inverters Work",
      "body": "<p>In a string inverter system, solar panels are wired together in series to form a ''string.'' A typical residential system has one or two strings, each containing 6–12 panels. The panels in a string produce DC voltage that adds up — for example, 8 panels at 40V each create a 320V DC string.</p><p>The string inverter receives this combined DC input and converts it to 230V AC at 50 Hz (Indian grid standard) using a process called DC-AC inversion. This AC power then feeds into your home switchboard or back to the grid through <a href=\"/in/solar-subsidy/net-metering/\">net metering</a>.</p><p>The inverter continuously performs Maximum Power Point Tracking (MPPT) to extract the optimal power from the string under varying sunlight conditions. Most modern string inverters have 1–2 MPPT inputs, allowing separate tracking for different panel orientations.</p>"
    },
    {
      "heading": "String Inverter vs Micro-Inverter: Key Differences",
      "body": "<p>The choice between string and micro-inverters depends on your roof conditions and budget:</p><table><thead><tr><th>Feature</th><th>String Inverter</th><th>Micro-Inverter</th></tr></thead><tbody><tr><td>Architecture</td><td>One inverter for all panels</td><td>One inverter per panel</td></tr><tr><td>Cost (3kW system)</td><td>₹15,000–₹35,000</td><td>₹45,000–₹75,000</td></tr><tr><td>Shading impact</td><td>Entire string affected</td><td>Only shaded panel affected</td></tr><tr><td>Monitoring</td><td>System-level</td><td>Panel-level</td></tr><tr><td>Maintenance</td><td>Single point of failure</td><td>Distributed, more resilient</td></tr><tr><td>Warranty</td><td>5–10 years</td><td>15–25 years</td></tr><tr><td>Best for</td><td>Unshaded, uniform roofs</td><td>Shaded or complex roofs</td></tr></tbody></table><p>For most Indian homes with unobstructed roofs, string inverters deliver the best value. Choose <a href=\"/in/solar-inverters/micro-inverter/\">micro-inverters</a> only if your roof has significant shading from trees, water tanks, or adjacent buildings.</p>"
    },
    {
      "heading": "String Inverter Prices in India",
      "body": "<p>String inverter prices depend on capacity and whether the inverter is on-grid, off-grid, or hybrid:</p><table><thead><tr><th>Capacity</th><th>On-Grid Price</th><th>Hybrid Price</th></tr></thead><tbody><tr><td>1kW</td><td>₹8,000–₹15,000</td><td>₹18,000–₹28,000</td></tr><tr><td>3kW</td><td>₹15,000–₹35,000</td><td>₹35,000–₹55,000</td></tr><tr><td>5kW</td><td>₹25,000–₹50,000</td><td>₹50,000–₹80,000</td></tr><tr><td>10kW</td><td>₹45,000–₹90,000</td><td>₹80,000–₹1,20,000</td></tr></tbody></table><p>On-grid string inverters are the most affordable option. If you need battery backup, a <a href=\"/in/solar-inverters/hybrid-inverter/\">hybrid inverter</a> combines grid-tie and battery charging in one unit.</p><p><a href=\"/in/solar-inverters/price/\">Complete solar inverter price guide →</a></p>"
    },
    {
      "heading": "Top String Inverter Brands in India",
      "body": "<p>The Indian market offers both domestic and international string inverter brands:</p><ul><li><strong>Growatt</strong> — Chinese brand, dominant in the Indian residential market. Good value with reliable MPPT performance.</li><li><strong>Solis</strong> — Chinese brand, competitive pricing with Wi-Fi monitoring built in.</li><li><strong>Goodwe</strong> — Strong hybrid inverter range, popular for systems needing battery backup.</li><li><strong>ABB / FIMER</strong> — European quality, premium pricing, excellent for commercial installations.</li><li><strong>Havells</strong> — Indian brand, good after-sales service network across India.</li><li><strong>Microtek</strong> — Indian brand with strong distribution, popular in the off-grid segment.</li></ul><p>When choosing a brand, prioritise warranty terms, local service network, and monitoring app quality over small price differences.</p>"
    },
    {
      "heading": "When to Choose a String Inverter",
      "body": "<p>A string inverter is the right choice when:</p><ul><li><strong>Your roof is unshaded</strong> — No trees, water tanks, or buildings cast shadows on your panels during peak hours (9 AM – 4 PM).</li><li><strong>Panels face the same direction</strong> — All panels have the same orientation and tilt angle, so they produce power uniformly.</li><li><strong>Budget matters</strong> — String inverters cost 40–60% less than micro-inverter setups for the same system size.</li><li><strong>System is standard size</strong> — For typical 1kW–10kW residential systems, string inverters are well-suited.</li></ul><p>Avoid string inverters if your roof has partial shading, multiple orientations (east + west panels), or if you plan to expand the system incrementally — in these cases, consider <a href=\"/in/solar-inverters/micro-inverter/\">micro-inverters</a> or power optimisers.</p>"
    },
    {
      "heading": "Installation and Maintenance",
      "body": "<p>String inverters are mounted on a wall near your electrical panel, typically in a shaded, ventilated location. They are <strong>IP65-rated</strong> (weather-resistant) but perform better when protected from direct sun and rain.</p><p><strong>Maintenance requirements:</strong></p><ul><li>Keep ventilation slots clear of dust and debris</li><li>Check indicator lights and monitoring app weekly</li><li>Annual professional inspection of connections and wiring</li><li>Replace after 10–15 years (most panels outlast the inverter)</li></ul><p>Modern string inverters include Wi-Fi or cellular monitoring, allowing you to track daily generation, detect faults, and monitor performance from your phone.</p>"
    },
    {
      "heading": "Get the Right Inverter for Your Solar System",
      "body": "<p>The inverter is the brain of your solar system — getting the right type and size matters as much as choosing good panels. Solar Vipani connects you with verified installers who will recommend the optimal inverter for your roof, budget, and energy needs.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is a string inverter in a solar system?",
      "answer": "A string inverter is a centralised device that converts DC electricity from a series-connected group (string) of solar panels into AC power for your home. It is the most common and affordable inverter type, handling all panels through a single unit mounted on your wall."
    },
    {
      "question": "How long do string inverters last?",
      "answer": "String inverters typically last 10–15 years. Most manufacturers offer 5–10 year warranties, with extended warranties available. Since solar panels last 25+ years, you may need to replace the string inverter once during the system''s lifetime."
    },
    {
      "question": "Is a string inverter better than a micro-inverter?",
      "answer": "For unshaded roofs with panels facing the same direction, string inverters offer better value — they cost 40–60% less than micro-inverter setups. Micro-inverters are better for shaded or complex roofs because shading on one panel does not affect others."
    },
    {
      "question": "Can I use a string inverter with different panel types?",
      "answer": "Panels in the same string should be identical — same brand, model, wattage, and orientation. Mixing panels reduces output because the string performs at the level of the weakest panel. If you have different panel types, use an inverter with multiple MPPT inputs and connect each type to a separate string."
    },
    {
      "question": "What size string inverter do I need?",
      "answer": "Your string inverter capacity should match or slightly exceed your total panel capacity. For a 3kW panel array, use a 3kW or 3.6kW inverter. Oversizing by 10–20% provides headroom for peak generation. Your installer will calculate the exact size based on your panel configuration and local conditions."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'string-inverter' AND pillar_slug = 'solar-inverters';


-- 2. CLUSTER: hybrid-inverter
UPDATE seo_pages SET
  h1 = 'Hybrid Solar Inverters in India: Price, Working & Should You Buy One?',
  meta_title = 'Hybrid Solar Inverter: Price, Brands & Benefits India 2026 | Solar Vipani',
  meta_description = 'Hybrid solar inverters cost ₹18,000–₹1,50,000. Learn how they combine grid-tie and battery backup, compare brands, and decide if hybrid is right for your home.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A hybrid solar inverter combines <a href=\"/in/solar-inverters/on-grid-inverter/\">on-grid</a> and <a href=\"/in/solar-inverters/off-grid-inverter/\">off-grid</a> functionality in a single unit. It connects to the grid for net metering while also charging batteries for backup during power cuts. Hybrid inverters cost <strong>₹18,000–₹1,50,000</strong> depending on capacity. They are the best choice for Indian homes that want grid savings <em>plus</em> power backup — especially in areas with frequent load-shedding.</p>"
    },
    {
      "heading": "How Hybrid Inverters Work",
      "body": "<p>A hybrid inverter manages three power sources simultaneously — solar panels, battery bank, and the utility grid. Here is the priority logic:</p><ol><li><strong>Solar powers your home first</strong> — During the day, solar energy feeds your appliances directly.</li><li><strong>Excess charges the battery</strong> — Once home loads are met, surplus solar energy charges the connected battery bank.</li><li><strong>Remaining surplus goes to grid</strong> — After the battery is full, any additional solar power is exported to the grid through <a href=\"/in/solar-subsidy/net-metering/\">net metering</a>.</li><li><strong>Battery kicks in during outages</strong> — When the grid fails, the inverter seamlessly switches to battery power in under 20 milliseconds. Your lights stay on.</li><li><strong>Grid fills the gap at night</strong> — When solar is unavailable and the battery is depleted, the grid supplies your home as usual.</li></ol><p>This intelligent switching happens automatically — no manual intervention needed.</p>"
    },
    {
      "heading": "Hybrid vs On-Grid vs Off-Grid Inverters",
      "body": "<p>Understanding the differences helps you choose the right type:</p><table><thead><tr><th>Feature</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>Grid connection</td><td>Required</td><td>Not needed</td><td>Optional</td></tr><tr><td>Battery support</td><td>No</td><td>Yes (required)</td><td>Yes (optional)</td></tr><tr><td>Net metering</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>Power during outage</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Subsidy eligible</td><td>Yes</td><td>No</td><td>Partial</td></tr><tr><td>Cost (3kW)</td><td>₹15,000–₹35,000</td><td>₹20,000–₹40,000</td><td>₹35,000–₹55,000</td></tr><tr><td>Best for</td><td>Reliable grid areas</td><td>No-grid locations</td><td>Frequent power cuts</td></tr></tbody></table><p>If you have reliable power supply, an <a href=\"/in/solar-inverters/on-grid-inverter/\">on-grid inverter</a> saves more money. If you face 2+ hours of daily power cuts, hybrid is worth the premium.</p>"
    },
    {
      "heading": "Hybrid Inverter Prices in India",
      "body": "<p>Hybrid inverters cost 40–80% more than on-grid inverters due to the added battery charging circuitry and transfer switch:</p><table><thead><tr><th>Capacity</th><th>Price Range</th><th>Battery Cost (additional)</th><th>Total System Premium</th></tr></thead><tbody><tr><td>1kW</td><td>₹18,000–₹28,000</td><td>₹30,000–₹50,000</td><td>₹40,000–₹65,000 over on-grid</td></tr><tr><td>3kW</td><td>₹35,000–₹55,000</td><td>₹60,000–₹1,20,000</td><td>₹80,000–₹1,40,000 over on-grid</td></tr><tr><td>5kW</td><td>₹50,000–₹80,000</td><td>₹1,00,000–₹2,00,000</td><td>₹1,25,000–₹2,30,000 over on-grid</td></tr><tr><td>10kW</td><td>₹80,000–₹1,50,000</td><td>₹2,00,000–₹4,00,000</td><td>₹2,35,000–₹4,60,000 over on-grid</td></tr></tbody></table><p><strong>Note:</strong> Battery cost is separate from the inverter. Lithium-ion batteries (longer life, lighter) cost more than lead-acid but offer better value over 10 years.</p><p><a href=\"/in/solar-inverters/price/\">Complete inverter price comparison →</a></p>"
    },
    {
      "heading": "Best Hybrid Inverter Brands in India",
      "body": "<p>Top hybrid inverter brands available in the Indian market:</p><ul><li><strong>Goodwe</strong> — Excellent hybrid range (ES/ET series). Built-in EMS for smart load management. Strong after-sales via Indian distributors.</li><li><strong>Growatt</strong> — SPH series popular for residential hybrid setups. Competitive pricing with reliable performance.</li><li><strong>Deye</strong> — Chinese brand gaining market share. Aggressive pricing on 5kW–10kW hybrid units.</li><li><strong>Solis</strong> — RHI series supports both lithium and lead-acid batteries. Good monitoring app.</li><li><strong>Havells</strong> — Indian brand with nationwide service. Hybrid models available in 3kW–10kW range.</li></ul><p>When selecting a hybrid inverter, check battery compatibility — some brands lock you into proprietary battery systems, while others work with any standard lithium or lead-acid bank.</p>"
    },
    {
      "heading": "Battery Options for Hybrid Systems",
      "body": "<p>The battery is the most expensive component after panels in a hybrid system. Two main technologies:</p><table><thead><tr><th>Feature</th><th>Lead-Acid</th><th>Lithium-Ion (LFP)</th></tr></thead><tbody><tr><td>Cost per kWh</td><td>₹8,000–₹12,000</td><td>₹15,000–₹25,000</td></tr><tr><td>Cycle life</td><td>1,200–1,500 cycles</td><td>4,000–6,000 cycles</td></tr><tr><td>Lifespan</td><td>3–5 years</td><td>10–15 years</td></tr><tr><td>Depth of discharge</td><td>50%</td><td>80–90%</td></tr><tr><td>Weight (5kWh)</td><td>~150 kg</td><td>~45 kg</td></tr><tr><td>Maintenance</td><td>Water topping, ventilation</td><td>Maintenance-free</td></tr></tbody></table><p>Lithium-ion (LiFePO4/LFP) batteries are recommended despite higher upfront cost — their 3x longer lifespan and deeper discharge make them more economical over the system''s life.</p>"
    },
    {
      "heading": "Is a Hybrid Inverter Worth the Extra Cost?",
      "body": "<p>A hybrid system adds ₹80,000–₹2,00,000+ to a 3kW–5kW installation. It is worth it if:</p><ul><li><strong>You face frequent power cuts</strong> — 2+ hours daily of load-shedding disrupts work or comfort</li><li><strong>You work from home</strong> — Uninterrupted power is essential for your livelihood</li><li><strong>You want energy independence</strong> — Reduce grid dependency and store solar for evening use</li><li><strong>Time-of-use tariffs exist</strong> — Store cheap solar energy and avoid expensive peak-hour grid rates</li></ul><p>If your area has reliable 24/7 power, an <a href=\"/in/solar-inverters/on-grid-inverter/\">on-grid inverter</a> delivers better ROI since you save the entire battery cost.</p><p>Want to explore your options? <a href=\"/in/get-quotes/\">Get free quotes from verified installers</a> who will recommend the best inverter type for your situation.</p>"
    },
    {
      "heading": "Get Expert Advice on Hybrid Inverters",
      "body": "<p>Choosing between on-grid, off-grid, and hybrid requires understanding your local grid reliability, power consumption patterns, and budget. Solar Vipani connects you with verified installers who assess your needs and recommend the right setup.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the difference between a hybrid inverter and a normal inverter?",
      "answer": "A normal (on-grid) inverter only converts solar DC to AC and feeds it to the grid. A hybrid inverter does this plus charges batteries and provides seamless backup during power cuts. It manages three sources — solar, battery, and grid — automatically prioritising solar first."
    },
    {
      "question": "Can I add batteries to a hybrid inverter later?",
      "answer": "Yes. Most hybrid inverters are ''battery-ready'' — you can install the inverter now with grid-tie operation and add batteries later when budget allows. This makes hybrid inverters a future-proof choice even if you do not need backup immediately."
    },
    {
      "question": "Does a hybrid solar system qualify for government subsidy?",
      "answer": "Partially. The PM Surya Ghar subsidy applies to the grid-connected solar component. The battery storage portion does not qualify for subsidy. Your installer can structure the system so the on-grid solar part claims the subsidy while the battery is added separately."
    },
    {
      "question": "How long can a hybrid system power my home during a power cut?",
      "answer": "It depends on battery capacity and your load. A 5kWh lithium battery can power essential loads (lights, fans, Wi-Fi, fridge) for 4–8 hours. A 10kWh battery extends this to 8–16 hours. Your installer will size the battery based on your critical load requirements."
    },
    {
      "question": "Is a hybrid inverter better than a separate inverter and UPS?",
      "answer": "Yes. A hybrid inverter is more efficient because it manages solar, battery, and grid in one unit without conversion losses. A separate UPS adds extra conversion steps (AC→DC→AC) and cannot leverage solar energy directly. Hybrid systems also qualify for partial net metering benefits."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'hybrid-inverter' AND pillar_slug = 'solar-inverters';


-- 3. CLUSTER: on-grid-inverter
UPDATE seo_pages SET
  h1 = 'On-Grid Solar Inverters: Price, Working & Why Most Homes Choose Them',
  meta_title = 'On-Grid Solar Inverter: Price, Working & Best Brands India 2026 | Solar Vipani',
  meta_description = 'On-grid solar inverters cost ₹8,000–₹90,000. Learn how grid-tie inverters work with net metering, why they are the most affordable option, and which brand to choose.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>An on-grid solar inverter (also called a grid-tie inverter) converts DC power from solar panels into AC power and feeds it to the electricity grid. It is the simplest, most affordable, and most popular inverter type in India — used in <strong>80%+ of residential installations</strong>. On-grid inverters cost <strong>₹8,000–₹90,000</strong> depending on capacity and enable <a href=\"/in/solar-subsidy/net-metering/\">net metering</a>, where surplus power earns you credits on your electricity bill.</p>"
    },
    {
      "heading": "How On-Grid Inverters Work",
      "body": "<p>An on-grid inverter operates in sync with the utility grid. Here is the step-by-step process:</p><ol><li><strong>Solar panels generate DC</strong> — Panels produce DC electricity proportional to sunlight intensity.</li><li><strong>Inverter converts DC to AC</strong> — The on-grid inverter converts DC to 230V, 50 Hz AC power that matches the grid frequency and voltage exactly.</li><li><strong>Home uses solar first</strong> — AC power flows to your switchboard, powering your appliances.</li><li><strong>Surplus exports to grid</strong> — When panels produce more than you consume, excess power flows to the grid through your bi-directional meter.</li><li><strong>Grid supplies at night</strong> — When solar is unavailable, you draw power from the grid normally.</li></ol><p><strong>Critical feature: anti-islanding.</strong> On-grid inverters automatically shut down during grid outages to protect utility workers from backfeed. This means <strong>you have no power during outages</strong> — even if the sun is shining. If backup is important, consider a <a href=\"/in/solar-inverters/hybrid-inverter/\">hybrid inverter</a>.</p>"
    },
    {
      "heading": "On-Grid Inverter Prices by Capacity",
      "body": "<p>On-grid inverters are the most affordable solar inverter category:</p><table><thead><tr><th>Capacity</th><th>Price Range</th><th>Best For</th></tr></thead><tbody><tr><td>1kW</td><td>₹8,000–₹15,000</td><td>Small homes, 1 BHK</td></tr><tr><td>2kW</td><td>₹12,000–₹22,000</td><td>2 BHK, moderate usage</td></tr><tr><td>3kW</td><td>₹15,000–₹35,000</td><td>Most popular for 2–3 BHK</td></tr><tr><td>5kW</td><td>₹25,000–₹50,000</td><td>Large homes, high AC usage</td></tr><tr><td>10kW</td><td>₹45,000–₹90,000</td><td>Villas, small commercial</td></tr></tbody></table><p>The inverter typically represents 20–25% of total system cost. For a 3kW system costing ₹1,50,000–₹1,90,000, the inverter portion is ₹15,000–₹35,000.</p><p><a href=\"/in/solar-inverters/price/\">Full inverter price comparison across all types →</a></p>"
    },
    {
      "heading": "Why On-Grid Inverters Are the Most Popular Choice",
      "body": "<p>On-grid inverters dominate the Indian residential solar market for four reasons:</p><ul><li><strong>Lowest cost</strong> — No battery charging circuitry means 40–60% lower price than hybrid inverters. No battery cost at all.</li><li><strong>Highest efficiency</strong> — Modern on-grid inverters achieve 97–98% conversion efficiency. No energy losses from battery charging/discharging.</li><li><strong>Full subsidy eligibility</strong> — The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> requires on-grid systems. Only on-grid inverters qualify for the full ₹78,000 central subsidy.</li><li><strong>Net metering savings</strong> — The grid acts as a virtual battery at zero cost. Export surplus during the day, import at night, and pay only the net difference.</li></ul><p>The only downside: no power during grid outages. If your area has reliable 22+ hours of daily power, this is rarely an issue.</p>"
    },
    {
      "heading": "Top On-Grid Inverter Brands in India",
      "body": "<p>Leading on-grid inverter brands available in India:</p><ul><li><strong>Growatt</strong> — MIC and MIN series. Best-selling residential on-grid inverters in India. Competitive pricing, reliable MPPT, and good monitoring app.</li><li><strong>Solis</strong> — S6 mini series popular for small systems. Built-in Wi-Fi monitoring, compact design.</li><li><strong>Goodwe</strong> — GW-MS series. Strong quality with responsive Indian support.</li><li><strong>ABB / FIMER</strong> — UNO series. Premium European engineering, preferred for commercial projects.</li><li><strong>Havells</strong> — Enviro series. Indian brand with nationwide service centres. Good for after-sales peace of mind.</li><li><strong>Fronius</strong> — Premium Austrian brand. Industry-leading efficiency (98.1%). Popular in large commercial installations.</li></ul><p>For residential 3kW–5kW systems, Growatt and Solis offer the best value. For commercial 10kW+ systems, consider ABB or Fronius for their durability record.</p>"
    },
    {
      "heading": "On-Grid Inverter Sizing Guide",
      "body": "<p>Correct inverter sizing ensures maximum output and compliance with DISCOM regulations:</p><ul><li><strong>Match or slightly oversize</strong> — Your inverter capacity should be 100–120% of your total panel capacity. A 3.3kW panel array pairs well with a 3kW or 3.6kW inverter.</li><li><strong>Check MPPT voltage range</strong> — Your panel string voltage must fall within the inverter''s MPPT range. Below the minimum, the inverter won''t start. Above the maximum, you risk damage.</li><li><strong>DISCOM limits</strong> — Most Indian DISCOMs cap residential net metering at the sanctioned load (typically 3kW–10kW). Your inverter size cannot exceed this limit.</li><li><strong>Single vs three-phase</strong> — Homes with single-phase connection use single-phase inverters (up to 5kW). Three-phase connections can use single or three-phase inverters.</li></ul><p>Your installer will calculate the exact sizing based on panel specifications, string configuration, and your DISCOM''s technical requirements.</p><p><a href=\"/in/solar-inverters/sizing/\">Detailed inverter sizing guide →</a></p>"
    },
    {
      "heading": "Installation and Monitoring",
      "body": "<p>On-grid inverters are wall-mounted near your main electrical panel. Installation takes 30–60 minutes as part of the overall system setup.</p><p><strong>Monitoring features:</strong></p><ul><li>Real-time generation tracking via mobile app</li><li>Daily, monthly, and annual energy reports</li><li>Fault alerts and diagnostic codes</li><li>Export/import tracking for net metering verification</li></ul><p>Most modern on-grid inverters include Wi-Fi connectivity for cloud-based monitoring. Some brands (Growatt, Solis) offer free lifetime monitoring through their apps.</p>"
    },
    {
      "heading": "Get the Best On-Grid Inverter for Your Home",
      "body": "<p>An on-grid inverter paired with quality panels and proper net metering delivers the fastest payback on your solar investment. Solar Vipani connects you with verified installers who will recommend the right inverter brand and size for your specific setup.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Can an on-grid inverter work without the grid?",
      "answer": "No. On-grid inverters require an active grid connection to function. They include anti-islanding protection that shuts down the inverter during grid outages — this is a safety requirement to protect utility workers. If you need power during outages, choose a hybrid inverter instead."
    },
    {
      "question": "Can I add batteries to an on-grid inverter later?",
      "answer": "No. On-grid inverters do not have battery charging capability. To add batteries, you would need to replace the inverter with a hybrid inverter. If future battery backup is a possibility, install a hybrid inverter upfront — it works as on-grid until you add batteries."
    },
    {
      "question": "What is the efficiency of an on-grid solar inverter?",
      "answer": "Modern on-grid inverters achieve 96–98% conversion efficiency, meaning only 2–4% of solar energy is lost during DC-to-AC conversion. This is higher than hybrid (94–96%) and off-grid (90–95%) inverters because there are no battery charging losses."
    },
    {
      "question": "How long does an on-grid inverter last?",
      "answer": "On-grid inverters typically last 10–15 years. Most manufacturers offer 5–10 year warranties, with some brands offering extended warranties up to 15 years. Since solar panels last 25+ years, budget for one inverter replacement during the system lifetime."
    },
    {
      "question": "Does an on-grid inverter qualify for government subsidy?",
      "answer": "Yes. On-grid systems are required for the PM Surya Ghar subsidy. The central government subsidy of up to ₹78,000 is available only for grid-connected solar systems with on-grid inverters installed by MNRE-empanelled vendors."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'on-grid-inverter' AND pillar_slug = 'solar-inverters';


-- 4. CLUSTER: off-grid-inverter
UPDATE seo_pages SET
  h1 = 'Off-Grid Solar Inverters: Price, Working & When You Need One',
  meta_title = 'Off-Grid Solar Inverter: Price, Battery Setup & Guide India 2026 | Solar Vipani',
  meta_description = 'Off-grid solar inverters cost ₹12,000–₹1,00,000. Learn how they work with batteries for complete grid independence, sizing, and best brands for Indian conditions.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>An off-grid solar inverter converts DC power from solar panels and batteries into AC power for your home — <strong>without any grid connection</strong>. It works entirely independently, using battery storage to power your home when solar is unavailable. Off-grid inverters cost <strong>₹12,000–₹1,00,000</strong> depending on capacity. They are essential for locations without reliable grid connectivity — farmhouses, remote homes, telecom towers, and agricultural installations.</p>"
    },
    {
      "heading": "How Off-Grid Inverters Work",
      "body": "<p>An off-grid inverter manages two power sources — solar panels and battery bank — to provide 24/7 electricity without the grid:</p><ol><li><strong>Solar panels charge batteries</strong> — During daylight, solar DC charges the battery bank through the inverter''s built-in charge controller (or a separate MPPT controller).</li><li><strong>Inverter converts battery DC to AC</strong> — The inverter draws DC from batteries and converts it to 230V AC for your appliances.</li><li><strong>Loads are powered continuously</strong> — Your home runs on battery-supplied AC power around the clock. Solar replenishes the batteries during the day.</li><li><strong>Battery management</strong> — The inverter monitors battery voltage and state of charge. It disconnects loads if batteries drop below a safe threshold (typically 50% for lead-acid, 20% for lithium) to prevent damage.</li></ol><p>Unlike <a href=\"/in/solar-inverters/on-grid-inverter/\">on-grid inverters</a>, off-grid inverters have no anti-islanding — they are designed to operate independently. There is no net metering since there is no grid export.</p>"
    },
    {
      "heading": "Off-Grid vs On-Grid vs Hybrid Inverters",
      "body": "<p>Understanding the differences helps you make the right choice:</p><table><thead><tr><th>Feature</th><th>Off-Grid</th><th>On-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>Grid connection</td><td>Not needed</td><td>Required</td><td>Optional</td></tr><tr><td>Battery</td><td>Required</td><td>Not used</td><td>Optional</td></tr><tr><td>Power during outage</td><td>Yes (always)</td><td>No</td><td>Yes</td></tr><tr><td>Net metering</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Government subsidy</td><td>No</td><td>Yes</td><td>Partial</td></tr><tr><td>System cost (3kW)</td><td>₹2,50,000–₹4,00,000</td><td>₹1,50,000–₹1,90,000</td><td>₹2,30,000–₹3,50,000</td></tr><tr><td>Best for</td><td>No-grid areas</td><td>Reliable grid areas</td><td>Unreliable grid areas</td></tr></tbody></table><p>Off-grid systems cost 60–100% more than on-grid due to batteries. Choose off-grid <strong>only</strong> if grid connection is unavailable or extremely unreliable. If you have a grid connection but want backup, a <a href=\"/in/solar-inverters/hybrid-inverter/\">hybrid inverter</a> is more cost-effective.</p>"
    },
    {
      "heading": "Off-Grid Inverter Prices in India",
      "body": "<p>Off-grid inverter prices by capacity (inverter only, batteries separate):</p><table><thead><tr><th>Capacity</th><th>Inverter Price</th><th>Battery Cost (lead-acid)</th><th>Battery Cost (lithium)</th></tr></thead><tbody><tr><td>1kW</td><td>₹12,000–₹20,000</td><td>₹25,000–₹40,000</td><td>₹45,000–₹70,000</td></tr><tr><td>2kW</td><td>₹18,000–₹30,000</td><td>₹40,000–₹65,000</td><td>₹70,000–₹1,20,000</td></tr><tr><td>3kW</td><td>₹25,000–₹45,000</td><td>₹60,000–₹1,00,000</td><td>₹1,00,000–₹1,80,000</td></tr><tr><td>5kW</td><td>₹40,000–₹70,000</td><td>₹1,00,000–₹1,60,000</td><td>₹1,60,000–₹2,80,000</td></tr><tr><td>10kW</td><td>₹70,000–₹1,00,000</td><td>₹2,00,000–₹3,20,000</td><td>₹3,00,000–₹5,00,000</td></tr></tbody></table><p>Batteries are the largest cost component in off-grid systems — often exceeding the cost of panels and inverter combined. Lithium-ion (LFP) batteries cost more upfront but last 3x longer than lead-acid.</p><p><a href=\"/in/solar-inverters/price/\">Compare all inverter type prices →</a></p>"
    },
    {
      "heading": "Sizing an Off-Grid System",
      "body": "<p>Off-grid sizing is more complex than on-grid because you must account for battery storage and days of autonomy (cloudy days):</p><ul><li><strong>Step 1: Calculate daily load</strong> — List every appliance, its wattage, and daily usage hours. Example: 5 lights (50W × 6h = 300Wh), 3 fans (225W × 10h = 2,250Wh), fridge (150W × 12h = 1,800Wh). Total: ~4.3 kWh/day.</li><li><strong>Step 2: Size the panel array</strong> — Divide daily load by peak sun hours (4.5h average in India) and account for system losses (25%). For 4.3 kWh: 4,300 ÷ 4.5 ÷ 0.75 = ~1.3kW panel array.</li><li><strong>Step 3: Size the battery bank</strong> — Multiply daily load by days of autonomy (typically 2 days for India). Factor in depth of discharge: lead-acid (50%) or lithium (80%). For 4.3 kWh × 2 days ÷ 0.5 = 17.2 kWh battery bank (lead-acid).</li><li><strong>Step 4: Size the inverter</strong> — Must handle peak load (all appliances running simultaneously) plus 20% safety margin.</li></ul><p><a href=\"/in/solar-inverters/sizing/\">Complete inverter sizing guide →</a></p>"
    },
    {
      "heading": "Best Off-Grid Inverter Brands in India",
      "body": "<p>Popular off-grid inverter brands in the Indian market:</p><ul><li><strong>Microtek</strong> — M-SUN series. India''s most recognised off-grid solar inverter brand with strong service network in tier-2/3 cities and rural areas.</li><li><strong>Luminous</strong> — NXG series. Trusted Indian brand, wide range from 850VA to 10kVA. Excellent for home and small commercial use.</li><li><strong>Su-Kam / Nexus</strong> — Brainy Eco series. Known for pure sine wave output and solar charge controller integration.</li><li><strong>V-Guard</strong> — Smart Pro series. Good build quality with comprehensive after-sales support across India.</li><li><strong>Exide</strong> — Known primarily for batteries but offers integrated solar inverter-battery combos for off-grid use.</li></ul><p>For off-grid systems, prioritise brands with strong rural service networks — when the grid is not available as backup, inverter downtime means no electricity at all.</p>"
    },
    {
      "heading": "Key Considerations for Off-Grid Systems",
      "body": "<p>Before going off-grid, understand these realities:</p><ul><li><strong>Higher cost</strong> — Off-grid systems cost 60–100% more than on-grid due to batteries and oversized panels for autonomy.</li><li><strong>Battery replacement</strong> — Lead-acid batteries need replacement every 3–5 years. Budget ₹40,000–₹1,60,000 for replacements. Lithium batteries last 10–15 years.</li><li><strong>Load management</strong> — You cannot run unlimited loads like on-grid. Heavy appliances (AC, water heater, oven) may require a very large (and expensive) system.</li><li><strong>No subsidy</strong> — Off-grid systems do not qualify for PM Surya Ghar or state subsidies. Only on-grid systems get government support.</li><li><strong>Maintenance</strong> — Lead-acid batteries need regular water topping and terminal cleaning. Lithium batteries are maintenance-free.</li></ul><p>If you have any grid access, a <a href=\"/in/solar-inverters/hybrid-inverter/\">hybrid system</a> is almost always a better choice — it costs less and provides both grid savings and backup.</p>"
    },
    {
      "heading": "Get Expert Guidance on Off-Grid Solar",
      "body": "<p>Off-grid system design requires careful load analysis and battery sizing. Solar Vipani connects you with verified installers experienced in off-grid installations who will design a system matched to your specific energy needs and location.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Can I run AC (air conditioner) on an off-grid solar system?",
      "answer": "Yes, but it requires a large system. A 1.5-ton AC draws about 1.5kW. Running it for 8 hours daily needs a 3kW–5kW system with a substantial battery bank (10kWh+). The cost for an off-grid setup to run AC can exceed ₹4,00,000–₹6,00,000. Consider a hybrid system if grid is available."
    },
    {
      "question": "How many batteries do I need for an off-grid solar system?",
      "answer": "It depends on your daily energy consumption and desired backup duration. For a typical household using 5 kWh/day with 2 days of autonomy using lead-acid batteries (50% DoD): you need 20 kWh of battery capacity, roughly 8 batteries of 150Ah, 12V. Your installer will calculate the exact requirement."
    },
    {
      "question": "What is the lifespan of an off-grid solar inverter?",
      "answer": "Off-grid inverters last 8–12 years with proper maintenance. Lead-acid batteries last 3–5 years, while lithium-ion batteries last 10–15 years. Budget for 2–3 battery replacements (lead-acid) or 1 replacement (lithium) over the system''s 25-year life."
    },
    {
      "question": "Can I convert an off-grid system to on-grid later?",
      "answer": "Not directly. Off-grid inverters lack grid synchronisation and anti-islanding features required for on-grid operation. You would need to replace the inverter with an on-grid or hybrid model and apply for net metering with your DISCOM. If future grid connection is likely, install a hybrid inverter from the start."
    },
    {
      "question": "Is off-grid solar eligible for government subsidy in India?",
      "answer": "No. The PM Surya Ghar Yojana and most state subsidies apply only to on-grid (grid-connected) solar systems. Off-grid systems do not qualify. However, the PM-KUSUM scheme provides subsidies for solar pumps which can include off-grid setups for agricultural use."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'off-grid-inverter' AND pillar_slug = 'solar-inverters';

COMMIT;
