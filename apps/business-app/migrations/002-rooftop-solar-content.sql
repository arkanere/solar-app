-- Rooftop Solar Content: pillar + 2 cluster pages (cost, how-it-works)
-- Run: psql $POSTGRES_URL < 002-rooftop-solar-content.sql

BEGIN;

-- 1. PILLAR: rooftop-solar
UPDATE seo_pages SET
  h1 = 'Rooftop Solar in India: The Complete Guide for Homeowners',
  meta_title = 'Rooftop Solar India: Cost, Types & Installation Guide | Solar Vipani',
  meta_description = 'Everything about rooftop solar — costs, types, installation, and subsidies. Based on data from verified installers across India. Fill one form, get 2–3 quotes.',
  content = '[
    {
      "heading": "Why Rooftop Solar Is Transforming Indian Homes",
      "body": "<p>India receives over 300 sunny days a year in most regions — making rooftop solar one of the smartest investments a homeowner can make. With electricity tariffs rising 5–8% annually and the central government offering subsidies up to ₹78,000 under PM Surya Ghar, the economics have never been stronger. Solar Vipani connects you with verified installers across 500+ cities so you can compare quotes and go solar with confidence.</p>"
    },
    {
      "heading": "What Is Rooftop Solar?",
      "body": "<p>A rooftop solar system converts sunlight into electricity using photovoltaic (PV) panels mounted on your roof. The panels generate DC electricity, which a solar inverter converts to AC power for your home appliances.</p><p>A typical residential system in India ranges from 1kW to 10kW. A 3kW system — the most popular size for Indian households — generates roughly 12–15 units (kWh) per day, enough to power a 2–3 BHK home with standard appliances.</p><p>There are three main system types: <strong>on-grid</strong> (connected to DISCOM, earns net metering credits), <strong>off-grid</strong> (fully independent with battery storage), and <strong>hybrid</strong> (grid-connected with battery backup). Most Indian homeowners choose on-grid systems because they qualify for government subsidies and net metering benefits.</p>"
    },
    {
      "heading": "Rooftop Solar Cost in India",
      "body": "<p>The cost of a rooftop solar system in India ranges from ₹60,000 to ₹6,00,000+ depending on system size, panel type, and inverter quality. After central government subsidies, a 3kW system typically costs ₹1,15,000–₹1,40,000 out of pocket.</p><p>Key cost factors include panel technology (mono vs poly), inverter type, mounting structure, wiring, and installation labour. Prices have dropped over 80% in the last decade, making solar more affordable than ever.</p><p>→ <a href=\"/in/rooftop-solar/cost/\">Full guide: Rooftop Solar Cost in India — Complete Breakdown</a></p>"
    },
    {
      "heading": "How Rooftop Solar Works",
      "body": "<p>Solar panels use the photovoltaic effect to convert sunlight into DC electricity. An inverter converts this to AC power, which flows to your switchboard and powers your appliances. Any surplus feeds back to the grid through net metering, spinning your meter backwards and earning you credits on your electricity bill.</p><p>Modern systems require minimal maintenance — occasional panel cleaning and an annual inverter check. Most panels carry a 25-year performance warranty.</p><p>→ <a href=\"/in/rooftop-solar/how-it-works/\">Full guide: How Rooftop Solar Works — Step by Step</a></p>"
    },
    {
      "heading": "Types of Rooftop Solar Systems",
      "body": "<p>Choosing the right system type is one of the most important decisions. Here is how they compare:</p><table><thead><tr><th>Feature</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>Grid connection</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>Battery storage</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>Net metering</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>Subsidy eligible</td><td>Yes</td><td>No</td><td>Partial</td></tr><tr><td>Best for</td><td>Most homes</td><td>Remote areas</td><td>Backup needs</td></tr></tbody></table><p>For most urban and semi-urban homes, an <a href=\"/in/rooftop-solar/on-grid/\">on-grid system</a> offers the best value. If you face frequent power cuts, a <a href=\"/in/rooftop-solar/hybrid/\">hybrid system</a> gives you grid savings plus battery backup.</p><p>→ <a href=\"/in/rooftop-solar/on-grid-vs-off-grid/\">Detailed comparison: On-Grid vs Off-Grid Solar</a></p>"
    },
    {
      "heading": "Rooftop Solar by System Size",
      "body": "<table><thead><tr><th>System Size</th><th>Daily Output</th><th>Roof Space</th><th>Best For</th><th>Price Range (before subsidy)</th></tr></thead><tbody><tr><td>1kW</td><td>4–5 units</td><td>~100 sq ft</td><td>1 BHK, low usage</td><td>₹60,000–₹80,000</td></tr><tr><td>2kW</td><td>8–10 units</td><td>~200 sq ft</td><td>2 BHK, moderate usage</td><td>₹1,10,000–₹1,40,000</td></tr><tr><td>3kW</td><td>12–15 units</td><td>~300 sq ft</td><td>2–3 BHK, popular choice</td><td>₹1,50,000–₹1,90,000</td></tr><tr><td>5kW</td><td>20–25 units</td><td>~500 sq ft</td><td>Large homes, high AC usage</td><td>₹2,50,000–₹3,20,000</td></tr><tr><td>10kW</td><td>40–50 units</td><td>~1000 sq ft</td><td>Villas, small businesses</td><td>₹5,00,000–₹6,50,000</td></tr></tbody></table><p>Explore detailed guides for each size: <a href=\"/in/rooftop-solar/1kw-system/\">1kW</a> · <a href=\"/in/rooftop-solar/2kw-system/\">2kW</a> · <a href=\"/in/rooftop-solar/3kw-system/\">3kW</a> · <a href=\"/in/rooftop-solar/5kw-system/\">5kW</a> · <a href=\"/in/rooftop-solar/10kw-system/\">10kW</a></p>"
    },
    {
      "heading": "Solar Inverters for Rooftop Systems",
      "body": "<p>The inverter is the brain of your solar system — it converts DC power from panels into AC power for your home. Choosing the right inverter type matters as much as choosing the right panels.</p><ul><li><strong><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverters</a></strong> — feed excess power to the grid, most affordable option</li><li><strong><a href=\"/in/rooftop-solar/off-grid-inverter/\">Off-grid inverters</a></strong> — work with batteries for complete grid independence</li><li><strong><a href=\"/in/rooftop-solar/hybrid-inverter/\">Hybrid inverters</a></strong> — combine grid-tie and battery functionality</li></ul><p>→ <a href=\"/in/rooftop-solar/inverter/\">Full guide: Solar Inverters for Home</a></p>"
    },
    {
      "heading": "Rooftop Solar for Apartments",
      "body": "<p>Installing solar in apartments comes with unique challenges — shared rooftop space, housing society approvals, and metering arrangements. However, many Indian housing societies are now adopting solar for common areas and individual flats.</p><p>Under PM Surya Ghar, individual flat owners in apartments can apply for subsidy on their share of a rooftop system. The key is getting a resolution passed by the housing society and coordinating with your DISCOM for group net metering.</p><p>→ <a href=\"/in/rooftop-solar/for-apartments/\">Full guide: Solar Panels for Apartments</a></p>"
    },
    {
      "heading": "Our Installer Network",
      "body": "<p>Solar Vipani maintains a verified network of solar installers across India. Every installer on our platform is vetted for licensing, insurance, and installation quality.</p><ul><li>Verified installers across 500+ districts</li><li>Coverage in 28 states and 8 union territories</li><li>Average system size: 3.2kW for residential installations</li><li>All installers carry valid MNRE channel partner certification</li></ul><p>Fill one form and receive 2–3 competitive quotes from installers in your city — free, with no obligation.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How much does rooftop solar cost in India?",
      "answer": "A rooftop solar system costs ₹60,000–₹6,00,000+ before subsidies depending on size. The most popular 3kW system costs ₹1,50,000–₹1,90,000 before subsidy and ₹1,15,000–₹1,40,000 after applying the PM Surya Ghar central subsidy. Prices vary by panel type, inverter brand, and your city."
    },
    {
      "question": "Is rooftop solar worth it in India?",
      "answer": "Yes. A typical rooftop solar system pays for itself in 4–6 years through electricity savings and net metering credits, then generates free power for 20+ more years. With rising tariffs and government subsidies covering 30–60% of the cost for systems up to 3kW, the ROI is strong for most Indian homeowners."
    },
    {
      "question": "How long do solar panels last?",
      "answer": "Quality solar panels last 25–30 years. Most manufacturers provide a 25-year linear performance warranty guaranteeing at least 80% output at end of life. Inverters typically last 10–15 years. With proper maintenance — occasional cleaning and annual checkups — your system will perform reliably for decades."
    },
    {
      "question": "What government subsidies are available for rooftop solar?",
      "answer": "Under PM Surya Ghar (2024–2027), homeowners get a central subsidy of ₹30,000/kW for the first 2kW and ₹18,000/kW for the next 1kW, up to a maximum of ₹78,000 for a 3kW system. Some states offer additional top-up subsidies. Only on-grid systems installed by MNRE-registered vendors qualify."
    },
    {
      "question": "How much electricity can a rooftop solar system generate?",
      "answer": "Output depends on system size and your location. As a rule of thumb, 1kW generates 4–5 units (kWh) per day in most Indian cities. A 3kW system produces 12–15 units daily — enough for a typical 2–3 BHK household. Southern and western India get slightly higher output due to more solar radiation."
    },
    {
      "question": "Do I need permission to install rooftop solar panels?",
      "answer": "For on-grid systems, you need approval from your local DISCOM (electricity distribution company) for net metering. Your installer typically handles this paperwork. No municipal building permission is needed for residential systems up to 10kW in most states. Housing society approval is required for apartments."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'rooftop-solar' AND page_type = 'pillar';


-- 2. CLUSTER: cost
UPDATE seo_pages SET
  h1 = 'How Much Does Rooftop Solar Cost in India in 2026?',
  meta_title = 'Rooftop Solar Cost India 2026: Real Prices by System Size | Solar Vipani',
  meta_description = 'Rooftop solar costs ₹60,000–₹6,00,000 before subsidy. See price breakdown by system size (1kW–10kW), panel type, and state. Based on quotes from verified installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A rooftop solar system in India costs <strong>₹55–₹75 per watt</strong> before subsidy, or roughly <strong>₹60,000 for a 1kW system to ₹6,50,000 for 10kW</strong>. After the PM Surya Ghar central subsidy, a popular 3kW system costs most homeowners <strong>₹1,15,000–₹1,40,000</strong> out of pocket. Actual pricing depends on panel type, inverter brand, roof structure, and your city.</p>"
    },
    {
      "heading": "Rooftop Solar Cost by System Size",
      "body": "<p>System size is the biggest cost driver. Here are current market prices based on quotes from our installer network:</p><table><thead><tr><th>System Size</th><th>Price (before subsidy)</th><th>PM Surya Ghar Subsidy</th><th>Net Cost (after subsidy)</th></tr></thead><tbody><tr><td>1kW</td><td>₹60,000–₹80,000</td><td>₹30,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2kW</td><td>₹1,10,000–₹1,40,000</td><td>₹60,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3kW</td><td>₹1,50,000–₹1,90,000</td><td>₹78,000</td><td>₹72,000–₹1,12,000</td></tr><tr><td>5kW</td><td>₹2,50,000–₹3,20,000</td><td>₹78,000</td><td>₹1,72,000–₹2,42,000</td></tr><tr><td>10kW</td><td>₹5,00,000–₹6,50,000</td><td>₹78,000</td><td>₹4,22,000–₹5,72,000</td></tr></tbody></table><p><em>Prices based on on-grid systems with monocrystalline panels. Prices vary by location and installer.</em></p><p>For detailed guides: <a href=\"/in/rooftop-solar/1kw-system/\">1kW</a> · <a href=\"/in/rooftop-solar/2kw-system/\">2kW</a> · <a href=\"/in/rooftop-solar/3kw-system/\">3kW</a> · <a href=\"/in/rooftop-solar/5kw-system/\">5kW</a> · <a href=\"/in/rooftop-solar/10kw-system/\">10kW</a></p>"
    },
    {
      "heading": "What Determines Rooftop Solar Cost?",
      "body": "<p>Six factors drive the total cost of a rooftop solar installation:</p><ol><li><strong>Solar panels (40–50% of cost)</strong> — Monocrystalline panels cost more than polycrystalline but deliver 15–20% higher efficiency per square foot. Bifacial panels cost even more but can generate 10–15% extra power. <a href=\"/in/solar-panels/price/\">Compare panel prices →</a></li><li><strong>Inverter (20–25% of cost)</strong> — On-grid string inverters are most affordable. Micro-inverters cost 30–50% more but optimise output per panel. <a href=\"/in/rooftop-solar/inverter/\">Inverter guide →</a></li><li><strong>Mounting structure (10–15%)</strong> — Flush mounts for flat roofs cost less. Elevated tilt structures for sloped or shaded roofs add ₹3,000–₹5,000 per kW.</li><li><strong>Wiring and electrical (5–8%)</strong> — DC cables, AC distribution board, earthing, and lightning arrestor.</li><li><strong>Installation labour (5–10%)</strong> — Varies by city and roof complexity. Multi-storey buildings cost more.</li><li><strong>Net metering and approvals (2–5%)</strong> — DISCOM application fees, meter cost, and inspection charges.</li></ol>"
    },
    {
      "heading": "Solar Panel Cost Breakdown by Type",
      "body": "<p>Panel technology has the biggest impact on per-watt pricing. Here is how the main types compare:</p><table><thead><tr><th>Panel Type</th><th>Cost per Watt</th><th>Efficiency</th><th>Best For</th></tr></thead><tbody><tr><td>Polycrystalline</td><td>₹22–₹28/W</td><td>15–17%</td><td>Budget installations, large roofs</td></tr><tr><td>Monocrystalline</td><td>₹28–₹35/W</td><td>19–22%</td><td>Most homes, space-efficient</td></tr><tr><td>Mono PERC</td><td>₹30–₹38/W</td><td>20–23%</td><td>Premium efficiency</td></tr><tr><td>Bifacial</td><td>₹35–₹45/W</td><td>20–24%</td><td>Elevated mounts, reflective surfaces</td></tr></tbody></table><p>Monocrystalline panels now dominate 80% of residential installations in India due to their superior efficiency-to-cost ratio. <a href=\"/in/solar-panels/monocrystalline-vs-polycrystalline/\">Mono vs Poly detailed comparison →</a></p>"
    },
    {
      "heading": "What Does Installation Cost Include?",
      "body": "<p>A complete rooftop solar installation quote from a verified installer typically includes:</p><ul><li><strong>Solar panels</strong> with 25-year performance warranty</li><li><strong>Solar inverter</strong> with 5–10 year warranty</li><li><strong>Mounting structure</strong> — galvanised iron or aluminium, designed for your roof type</li><li><strong>Electrical components</strong> — DC/AC cables, junction box, distribution board, earthing kit</li><li><strong>Installation labour</strong> — typically completed in 1–3 days for residential systems</li><li><strong>DISCOM paperwork</strong> — net metering application and liaison</li><li><strong>Commissioning</strong> — system testing, grid synchronisation, and handover</li></ul><p>Always confirm whether the quote includes net metering fees and GST (currently 13.8% for solar systems with both panels and inverter).</p><p><a href=\"/in/solar-installation/cost/\">Detailed installation cost breakdown →</a></p>"
    },
    {
      "heading": "How Subsidies Reduce Your Cost",
      "body": "<p>The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> (2024–2027) offers direct subsidy to residential consumers:</p><table><thead><tr><th>System Capacity</th><th>Subsidy Rate</th><th>Total Subsidy</th></tr></thead><tbody><tr><td>Up to 2kW</td><td>₹30,000 per kW</td><td>Up to ₹60,000</td></tr><tr><td>2kW to 3kW</td><td>₹18,000 per kW (additional)</td><td>Up to ₹78,000</td></tr><tr><td>Above 3kW</td><td>No additional subsidy</td><td>Capped at ₹78,000</td></tr></tbody></table><p><strong>Key eligibility rules:</strong></p><ul><li>Only for grid-connected (on-grid) residential systems</li><li>Must be installed by an MNRE-empanelled vendor</li><li>Subsidy is credited directly to your bank account after installation and DISCOM inspection</li><li>One subsidy per household (linked to electricity consumer number)</li></ul><p>Some states offer additional top-up subsidies. <a href=\"/in/solar-subsidy/state-wise/\">Check your state subsidy →</a></p>"
    },
    {
      "heading": "Cost Per Watt: The Real Comparison Metric",
      "body": "<p>Cost per watt is the best way to compare solar quotes across different system sizes and brands. It normalises the price to a standard unit, making apples-to-apples comparison possible.</p><p><strong>Current market range:</strong> ₹55–₹75 per watt (installed, before subsidy)</p><p>A quote of ₹1,80,000 for a 3kW system equals ₹60/W — competitive pricing. A quote of ₹2,25,000 for the same 3kW system is ₹75/W — ask what premium components justify the higher rate.</p><p>When comparing quotes, ensure all are at the same scope (including GST, net metering fees, and mounting). A low per-watt price with excluded costs is misleading.</p><p><a href=\"/in/rooftop-solar/cost-per-watt/\">Full guide: Solar Cost Per Watt in India →</a></p>"
    },
    {
      "heading": "ROI and Payback Period",
      "body": "<p>Rooftop solar delivers strong financial returns in India thanks to high electricity tariffs and generous subsidies:</p><ul><li><strong>Payback period:</strong> 3–6 years (after subsidy) depending on your tariff slab and system size</li><li><strong>25-year savings:</strong> ₹4,00,000–₹15,00,000+ depending on system size and tariff escalation</li><li><strong>Annual return:</strong> 15–25% IRR — better than most fixed-income investments</li></ul><p>The higher your current electricity bill, the faster the payback. Homes paying ₹8+/unit see payback in under 4 years. Those in lower tariff slabs (₹4–₹5/unit) still break even in 5–6 years.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your personalised ROI with our solar calculator</a></p>"
    },
    {
      "heading": "Get an Accurate Quote for Your Roof",
      "body": "<p>Online price estimates give you a range. For an accurate number, you need quotes specific to your roof type, location, shading conditions, and energy consumption.</p><p>Solar Vipani connects you with 2–3 verified local installers who will assess your roof and provide detailed, comparable quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the cost of a 1kW solar system in India?",
      "answer": "A 1kW rooftop solar system costs ₹60,000–₹80,000 before subsidy. After the PM Surya Ghar subsidy of ₹30,000, your out-of-pocket cost is ₹30,000–₹50,000. This size suits small homes or 1 BHK flats with basic electrical loads."
    },
    {
      "question": "Are solar panels worth the investment in India?",
      "answer": "Yes. With a payback period of 3–6 years and system life of 25+ years, rooftop solar delivers 15–25% annual returns. Government subsidies cover up to ₹78,000 of upfront cost. After payback, you essentially get free electricity for two decades."
    },
    {
      "question": "How much subsidy can I get on rooftop solar panels?",
      "answer": "Under PM Surya Ghar, residential consumers get ₹30,000/kW for the first 2kW and ₹18,000/kW for the 3rd kW — a maximum of ₹78,000 for a 3kW system. Subsidy is available only for on-grid systems installed by MNRE-registered vendors."
    },
    {
      "question": "What is the payback period for rooftop solar in India?",
      "answer": "Most homeowners recover their investment in 3–6 years. Homes with high electricity bills (₹3,000+/month) and full subsidy utilisation see payback in as little as 3 years. After payback, electricity savings go directly into your pocket for the remaining 20+ years of system life."
    },
    {
      "question": "Does rooftop solar increase property value?",
      "answer": "Yes. Homes with solar installations command a premium because buyers value reduced electricity costs and energy independence. While Indian real estate data is limited, the combination of lower bills and a modern amenity makes solar-equipped homes more attractive to buyers."
    },
    {
      "question": "Is there GST on rooftop solar systems?",
      "answer": "Solar systems sold as a package (panels + inverter + installation) attract 13.8% GST under the composite supply rule. If you buy panels separately, they attract 12% GST, while inverters attract 12% GST separately. The quoted price from most installers includes GST."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'cost' AND pillar_slug = 'rooftop-solar';


-- 3. CLUSTER: how-it-works
UPDATE seo_pages SET
  h1 = 'How Does Rooftop Solar Work? A Simple Guide for Indian Homeowners',
  meta_title = 'How Rooftop Solar Works: Panels, Inverters & Net Metering Explained | Solar Vipani',
  meta_description = 'Learn how rooftop solar panels generate electricity, how net metering works, and what happens on cloudy days. Simple explanation for Indian homeowners.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Rooftop solar panels convert sunlight into DC electricity using the photovoltaic effect. A <a href=\"/in/rooftop-solar/inverter/\">solar inverter</a> converts this into AC power for your home. In an <a href=\"/in/rooftop-solar/on-grid/\">on-grid system</a>, surplus electricity flows to the grid and earns you credits on your bill through net metering. The entire process is automatic, silent, and requires almost no maintenance.</p>"
    },
    {
      "heading": "The Photovoltaic Effect: How Solar Cells Generate Power",
      "body": "<p>Every solar panel is made of photovoltaic (PV) cells — typically silicon wafers treated to create a positive and negative layer. When sunlight hits these cells, photons knock electrons loose from silicon atoms. This movement of electrons creates a flow of direct current (DC) electricity.</p><p>A single solar cell produces about 0.5 volts. Cells are wired together into a panel (module) that typically produces 40–50 volts DC. Multiple panels are then wired in series or parallel to form an array that matches your inverter specifications.</p><p>Modern <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline panels</a> convert 19–22% of incoming sunlight into electricity. While that may sound low, it is more than enough — a 3kW system with just 6–8 panels generates 12–15 units daily, sufficient for most Indian households.</p>"
    },
    {
      "heading": "Key Components of a Rooftop Solar System",
      "body": "<p>A complete rooftop solar system has five main components:</p><ol><li><strong>Solar panels</strong> — Mounted on your roof facing south (in India) at a 10–15° tilt angle for optimal year-round output. <a href=\"/in/solar-panels/types/\">Types of solar panels →</a></li><li><strong>Solar inverter</strong> — Converts DC from panels to 230V AC for your appliances. This is the most maintenance-sensitive component with a 10–15 year lifespan. <a href=\"/in/rooftop-solar/inverter/\">Choosing the right inverter →</a></li><li><strong>Mounting structure</strong> — Galvanised iron or aluminium frames that secure panels to your roof without penetrating the waterproofing.</li><li><strong>Net meter (bi-directional)</strong> — Replaces your existing meter. Records both import (from grid) and export (to grid) of electricity.</li><li><strong>Electrical protections</strong> — DC/AC isolators, surge protection devices, earthing, and a distribution board to safely connect the system to your home wiring.</li></ol>"
    },
    {
      "heading": "How Electricity Flows Through Your System",
      "body": "<p>Here is the step-by-step flow from sunlight to savings:</p><ol><li><strong>Sunlight hits panels</strong> — PV cells generate DC electricity proportional to sunlight intensity.</li><li><strong>DC flows to inverter</strong> — The inverter converts DC to 230V AC power at 50 Hz (Indian grid standard).</li><li><strong>AC powers your home</strong> — The inverter feeds AC to your home switchboard. Your appliances consume solar power first.</li><li><strong>Surplus goes to grid</strong> — Any power your home does not consume instantly flows out through the net meter to the grid.</li><li><strong>Grid supplies the deficit</strong> — At night or on heavily overcast days, you draw power from the grid as usual.</li><li><strong>Net meter tracks the balance</strong> — At billing time, your DISCOM calculates: <em>units imported − units exported = net consumption</em>. You pay only for the net.</li></ol><p>This entire cycle is automatic. There are no switches to flip, no schedules to manage.</p>"
    },
    {
      "heading": "On-Grid vs Off-Grid: How Each System Works",
      "body": "<p>The two main system architectures work differently:</p><p><strong><a href=\"/in/rooftop-solar/on-grid/\">On-grid systems</a></strong> stay connected to your DISCOM grid. They have no batteries. When panels produce more than you need, excess flows to the grid. When panels produce less (evenings, cloudy days), you draw from the grid. Net metering ensures you only pay for the difference. This is the most cost-effective option and qualifies for government subsidy.</p><p><strong><a href=\"/in/rooftop-solar/off-grid/\">Off-grid systems</a></strong> are completely independent. They include battery banks that store excess daytime generation for use at night. These cost 40–60% more due to batteries but are essential where grid connectivity is unreliable or unavailable.</p><p><strong><a href=\"/in/rooftop-solar/hybrid/\">Hybrid systems</a></strong> combine both approaches — they stay grid-connected for net metering benefits but include a battery for backup during power cuts. Increasingly popular in Indian cities with frequent load-shedding.</p><p><a href=\"/in/rooftop-solar/on-grid-vs-off-grid/\">Detailed comparison: On-Grid vs Off-Grid →</a></p>"
    },
    {
      "heading": "Net Metering: How You Earn Credits",
      "body": "<p>Net metering is the mechanism that makes on-grid solar financially viable. Here is how it works in India:</p><ol><li>Your DISCOM installs a <strong>bi-directional meter</strong> that records electricity flowing both ways.</li><li>During the day, your solar panels generate power. What your home does not use is <strong>exported to the grid</strong>.</li><li>At night and on cloudy days, you <strong>import power from the grid</strong> normally.</li><li>At the end of the billing cycle, the DISCOM calculates the <strong>net</strong>: <em>import − export</em>.</li><li>If you exported more than you imported, the surplus <strong>carries forward as credit</strong> to the next billing cycle.</li></ol><p>Most Indian DISCOMs settle credits annually. Some states (Maharashtra, Karnataka, Gujarat) allow credits to accumulate for 12 months before settlement.</p><p>The net metering policy varies by state and DISCOM. Your installer handles the application and meter replacement as part of the installation process.</p><p><a href=\"/in/solar-subsidy/net-metering/\">Complete net metering guide →</a></p>"
    },
    {
      "heading": "What Happens on Cloudy Days and at Night?",
      "body": "<p>A common concern — and the answer is straightforward:</p><p><strong>Cloudy days:</strong> Solar panels still generate electricity, but at reduced capacity. On a heavily overcast day, output drops to 10–30% of peak capacity. Light cloud cover reduces output by only 20–30%. India averages 250–300 clear sunny days per year, so cloudy days have minimal impact on annual output.</p><p><strong>Night:</strong> Panels produce zero electricity at night. In an on-grid system, you simply draw power from the grid. The net metering credits you built during the day offset your nighttime consumption. In an off-grid or hybrid system, your battery bank powers your home overnight.</p><p><strong>Rain:</strong> Rain actually helps — it cleans dust off your panels. Output during rain is low, but panels can generate some power even in diffused light.</p><p><strong>Annual impact:</strong> System sizing accounts for seasonal and weather variations. A well-designed system generates enough over the year to cover your average consumption, including cloudy periods.</p>"
    },
    {
      "heading": "From Sunlight to Savings: How Much Can You Generate?",
      "body": "<p>Solar output varies by location, season, and panel orientation. Here is a practical guide for Indian conditions:</p><table><thead><tr><th>System Size</th><th>Daily Output (avg)</th><th>Monthly Output</th><th>Monthly Bill Offset</th></tr></thead><tbody><tr><td>1kW</td><td>4–5 units</td><td>120–150 units</td><td>₹600–₹1,200</td></tr><tr><td>2kW</td><td>8–10 units</td><td>240–300 units</td><td>₹1,200–₹2,400</td></tr><tr><td>3kW</td><td>12–15 units</td><td>360–450 units</td><td>₹2,000–₹4,000</td></tr><tr><td>5kW</td><td>20–25 units</td><td>600–750 units</td><td>₹3,500–₹7,000</td></tr><tr><td>10kW</td><td>40–50 units</td><td>1200–1500 units</td><td>₹7,000–₹14,000</td></tr></tbody></table><p><em>Bill offset calculated at ₹5–₹10/unit average tariff. Higher tariff slabs mean greater savings.</em></p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your exact savings with our solar calculator</a></p>"
    },
    {
      "heading": "Ready to Go Solar?",
      "body": "<p>Now that you understand how rooftop solar works, the next step is understanding <a href=\"/in/rooftop-solar/cost/\">what it costs</a> and getting quotes specific to your roof and location.</p><p>Solar Vipani connects you with 2–3 verified installers in your city who will assess your roof, design the system, and provide detailed quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Do solar panels work on cloudy days?",
      "answer": "Yes, but at reduced capacity. On overcast days, panels generate 10–30% of their peak output. Light cloud cover reduces output by about 20–30%. Since India averages 250–300 clear days per year, cloudy days have minimal impact on your annual energy production and savings."
    },
    {
      "question": "What is net metering and how does it work?",
      "answer": "Net metering is a billing arrangement where your DISCOM installs a bi-directional meter that tracks electricity flowing both ways. When your solar panels produce more than you use, the excess goes to the grid and earns you credits. You pay only for the net consumption (import minus export) at billing time."
    },
    {
      "question": "How much electricity can one solar panel generate per day?",
      "answer": "A standard 540W monocrystalline panel generates approximately 2.0–2.5 units (kWh) per day in Indian conditions. Output depends on hours of peak sunlight (typically 4.5–5.5 hours in India), panel orientation, tilt angle, and shading."
    },
    {
      "question": "Do I need batteries with a rooftop solar system?",
      "answer": "Not necessarily. Most Indian homeowners install on-grid systems without batteries — net metering with the grid acts as a virtual battery. You only need physical batteries if you want backup during power cuts (hybrid system) or if your area has no grid connection (off-grid system)."
    },
    {
      "question": "How long do rooftop solar systems last?",
      "answer": "Solar panels last 25–30 years with a manufacturer warranty of 25 years guaranteeing at least 80% output. Inverters typically last 10–15 years and may need one replacement over the system lifetime. Mounting structures and wiring last the full 25+ years with minimal maintenance."
    },
    {
      "question": "Can I run my entire home on solar power?",
      "answer": "With the right system size, yes. A 3kW system covers most 2–3 BHK homes. For homes with heavy AC usage or electric vehicles, a 5kW–10kW system can offset your entire bill. In on-grid setups, the grid supplements your power at night, so you are never without electricity."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'how-it-works' AND pillar_slug = 'rooftop-solar';

COMMIT;
