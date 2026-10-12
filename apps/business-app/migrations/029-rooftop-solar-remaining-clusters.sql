-- Rooftop Solar remaining clusters: benefits, maintenance, net-metering, residential
-- Run: psql $POSTGRES_URL < src/lib/server/migrations/029-rooftop-solar-remaining-clusters.sql

BEGIN;

-- 1. CLUSTER: benefits
UPDATE seo_pages SET
  h1 = 'Benefits of Rooftop Solar in India: Why Homeowners Are Switching',
  meta_title = 'Benefits of Rooftop Solar in India: 10 Reasons to Go Solar | Solar Vipani',
  meta_description = 'Rooftop solar cuts electricity bills by 70–90%, earns net metering credits, and pays for itself in 3–6 years. See the full list of benefits for Indian homeowners.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Rooftop solar delivers <strong>70–90% electricity bill reduction</strong>, a payback period of <strong>3–6 years</strong>, and 20+ years of virtually free power after that. With PM Surya Ghar subsidies covering up to ₹78,000 and net metering earning you credits for surplus generation, <a href=\"/in/rooftop-solar/\">rooftop solar</a> is one of the highest-returning investments an Indian homeowner can make today.</p>"
    },
    {
      "heading": "Slash Your Electricity Bill by 70–90%",
      "body": "<p>The most immediate benefit of rooftop solar is a dramatic reduction in your monthly electricity bill. A <a href=\"/in/rooftop-solar/3kw-system/\">3kW system</a> generates 360–450 units per month — enough to offset the consumption of a typical 2–3 BHK home.</p><p>The savings compound as tariffs rise. Indian electricity tariffs have been increasing 5–8% annually. Solar locks in your generation cost at ₹0 per unit for 25 years. The more tariffs rise, the more you save.</p><table><thead><tr><th>Monthly Bill (Pre-Solar)</th><th>System Size</th><th>Monthly Savings</th><th>Annual Savings</th></tr></thead><tbody><tr><td>₹1,500–₹2,000</td><td>2kW</td><td>₹1,200–₹1,800</td><td>₹14,400–₹21,600</td></tr><tr><td>₹2,500–₹4,000</td><td>3kW</td><td>₹2,000–₹3,500</td><td>₹24,000–₹42,000</td></tr><tr><td>₹5,000–₹8,000</td><td>5kW</td><td>₹4,000–₹7,000</td><td>₹48,000–₹84,000</td></tr><tr><td>₹10,000+</td><td>10kW</td><td>₹8,000–₹14,000</td><td>₹96,000–₹1,68,000</td></tr></tbody></table><p>Homes in higher tariff slabs see the greatest savings because solar offsets the most expensive units first.</p>"
    },
    {
      "heading": "Earn Net Metering Credits on Surplus Power",
      "body": "<p>With an <a href=\"/in/rooftop-solar/on-grid/\">on-grid system</a>, any electricity your home does not consume flows back to the grid through a bi-directional meter. Your DISCOM credits you for every exported unit, effectively spinning your meter backwards.</p><p>Most Indian DISCOMs settle net metering credits on an annual cycle. During sunny months (March–June), you typically export more than you import, building a credit bank that offsets monsoon and winter months when generation dips.</p><p>This makes on-grid solar the most cost-effective setup — the grid acts as a free, infinite battery. No maintenance, no degradation, no replacement costs.</p><p><a href=\"/in/rooftop-solar/net-metering/\">Full guide: How Net Metering Works in India →</a></p>"
    },
    {
      "heading": "Payback in 3–6 Years, Free Power for 20+ Years",
      "body": "<p>A rooftop solar system pays for itself faster than almost any home investment. After applying the PM Surya Ghar subsidy:</p><ul><li><strong>High-tariff homes (₹8+/unit):</strong> Payback in 3–4 years</li><li><strong>Medium-tariff homes (₹5–₹7/unit):</strong> Payback in 4–5 years</li><li><strong>Low-tariff homes (₹3–₹4/unit):</strong> Payback in 5–6 years</li></ul><p>After payback, your system generates free electricity for the remaining 20+ years of its lifespan. The <strong>lifetime savings range from ₹4,00,000 to ₹15,00,000+</strong> depending on system size and local tariff rates.</p><p>At a 15–25% internal rate of return (IRR), rooftop solar outperforms most fixed-income instruments including FDs, PPF, and debt mutual funds.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your personalised payback with our solar calculator</a></p>"
    },
    {
      "heading": "Government Subsidies Reduce Upfront Cost",
      "body": "<p>The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> (2024–2027) directly reduces your investment:</p><table><thead><tr><th>System Size</th><th>Before Subsidy</th><th>Subsidy Amount</th><th>Your Cost</th></tr></thead><tbody><tr><td>1kW</td><td>₹60,000–₹80,000</td><td>₹30,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2kW</td><td>₹1,10,000–₹1,40,000</td><td>₹60,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3kW</td><td>₹1,50,000–₹1,90,000</td><td>₹78,000</td><td>₹72,000–₹1,12,000</td></tr></tbody></table><p>Some states offer additional top-up subsidies. The subsidy is credited directly to your bank account after installation and DISCOM verification — no intermediaries.</p><p><a href=\"/in/solar-subsidy/state-wise/\">Check your state subsidy →</a></p>"
    },
    {
      "heading": "Protection Against Rising Electricity Tariffs",
      "body": "<p>Electricity tariffs in India have risen consistently at 5–8% per year. Over 25 years, a unit that costs ₹7 today could cost ₹24–₹40 at that rate of increase.</p><p>Solar eliminates this risk. Your generation cost is fixed at the time of installation — effectively ₹0 per unit once the system is paid off. Every tariff hike after installation increases your savings without any action on your part.</p><p>For homeowners planning to stay in their property long-term, this inflation hedge is one of the most valuable but overlooked benefits of going solar.</p>"
    },
    {
      "heading": "Low Maintenance, High Reliability",
      "body": "<p>Modern rooftop solar systems require remarkably little upkeep:</p><ul><li><strong>Panel cleaning:</strong> 2–4 times per year, or after heavy dust/bird droppings</li><li><strong>Inverter check:</strong> Annual inspection by your installer (most offer AMC plans)</li><li><strong>No moving parts:</strong> Panels are solid-state devices — nothing wears out mechanically</li><li><strong>Warranty coverage:</strong> 25-year panel performance warranty, 5–10 year inverter warranty</li></ul><p>Annual maintenance costs run ₹2,000–₹5,000 for a typical 3kW–5kW residential system. That is less than a single month''s electricity bill for most homes.</p><p><a href=\"/in/rooftop-solar/maintenance/\">Full guide: Rooftop Solar Maintenance →</a></p>"
    },
    {
      "heading": "Environmental Impact: Reduce Your Carbon Footprint",
      "body": "<p>A 3kW rooftop solar system offsets approximately <strong>3.5–4.5 tonnes of CO₂ per year</strong> — equivalent to planting 150–200 trees annually. Over 25 years, a single residential system prevents 90–110 tonnes of carbon emissions.</p><p>India''s electricity grid is still 70%+ coal-dependent. Every unit generated by your rooftop panels directly displaces coal-fired generation. By going solar, you contribute to India''s target of 500 GW renewable energy capacity by 2030.</p>"
    },
    {
      "heading": "Increase Your Property Value",
      "body": "<p>Solar-equipped homes are increasingly attractive in the Indian real estate market. Buyers value reduced electricity costs, energy independence, and the modern amenity factor. While formal Indian studies are limited, the combination of a ₹0 electricity bill and a transferable subsidy makes solar homes stand out.</p><p>For apartment owners, a housing society with rooftop solar on common areas reduces maintenance charges — a direct selling point for resale.</p>"
    },
    {
      "heading": "Ready to Start Saving?",
      "body": "<p>The benefits of rooftop solar are clear — bill savings, government subsidies, inflation protection, and environmental impact. The next step is getting quotes specific to your roof and location.</p><p>Solar Vipani connects you with 2–3 verified installers in your city who assess your roof and provide detailed, comparable quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is rooftop solar worth it in India in 2026?",
      "answer": "Yes. With PM Surya Ghar subsidies covering up to ₹78,000, net metering credits, and rising electricity tariffs, a rooftop solar system pays for itself in 3–6 years and generates free electricity for 20+ more years. The internal rate of return (15–25%) beats most traditional investments."
    },
    {
      "question": "How much can I save on my electricity bill with solar?",
      "answer": "A 3kW rooftop solar system saves ₹2,000–₹3,500 per month on electricity bills, depending on your tariff slab and consumption pattern. Homes paying ₹8+/unit see the highest savings. Annual savings range from ₹24,000 to ₹42,000 for a 3kW system."
    },
    {
      "question": "Do solar panels increase property value in India?",
      "answer": "Yes. Homes with solar installations attract buyers who value lower electricity costs and energy independence. The transferable subsidy benefit and near-zero electricity bills make solar-equipped properties more competitive in the resale market."
    },
    {
      "question": "What are the environmental benefits of rooftop solar?",
      "answer": "A 3kW system offsets 3.5–4.5 tonnes of CO₂ annually — equivalent to planting 150–200 trees per year. Over 25 years, one residential system prevents 90–110 tonnes of carbon emissions by displacing coal-fired grid electricity."
    },
    {
      "question": "How long do the benefits of solar panels last?",
      "answer": "Solar panels carry a 25-year performance warranty and typically last 25–30 years. After the 3–6 year payback period, you get free electricity for the remaining 20+ years. Inverters last 10–15 years and may need one replacement over the system lifetime."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'benefits' AND pillar_slug = 'rooftop-solar';


-- 2. CLUSTER: maintenance
UPDATE seo_pages SET
  h1 = 'Rooftop Solar Maintenance in India: What You Actually Need to Do',
  meta_title = 'Rooftop Solar Maintenance Guide: Cleaning, Costs & Schedule | Solar Vipani',
  meta_description = 'Rooftop solar needs just 2–4 cleanings per year and an annual inverter check. See the full maintenance schedule, costs, and common issues for Indian conditions.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p><a href=\"/in/rooftop-solar/\">Rooftop solar systems</a> need surprisingly little maintenance — <strong>2–4 panel cleanings per year</strong> and an <strong>annual inverter inspection</strong>. There are no moving parts to wear out. Annual maintenance costs run <strong>₹2,000–₹5,000</strong> for a typical 3kW–5kW residential system. Most issues are preventable with a basic schedule, and major component warranties cover you for 10–25 years.</p>"
    },
    {
      "heading": "Why Solar Panels Need So Little Maintenance",
      "body": "<p>Solar panels are solid-state devices — silicon wafers sealed behind tempered glass with no moving components. Unlike generators, AC systems, or water heaters, there is nothing to lubricate, replace, or mechanically service.</p><p>The main enemies of solar output in Indian conditions are:</p><ul><li><strong>Dust and pollution</strong> — accumulates on panel surface, reducing light absorption</li><li><strong>Bird droppings</strong> — can create hot spots if not cleaned</li><li><strong>Shading from new construction</strong> — trees or neighbouring buildings growing into your sun path</li><li><strong>Monsoon debris</strong> — leaves and dirt deposits after heavy rains</li></ul><p>All of these affect the glass surface, not the panel itself. Regular cleaning is the single most important maintenance activity.</p>"
    },
    {
      "heading": "Panel Cleaning: Schedule, Method, and Cost",
      "body": "<p>Clean panels produce more power. Dust accumulation can reduce output by <strong>15–25% in Indian cities</strong> and up to 30% in high-pollution or construction-adjacent areas.</p><p><strong>Cleaning frequency by region:</strong></p><table><thead><tr><th>Condition</th><th>Frequency</th><th>Examples</th></tr></thead><tbody><tr><td>Low dust, low pollution</td><td>2× per year</td><td>Coastal areas, hill stations</td></tr><tr><td>Moderate dust</td><td>3–4× per year</td><td>Most Indian cities</td></tr><tr><td>High dust / construction nearby</td><td>Monthly</td><td>Industrial areas, construction zones, desert regions</td></tr></tbody></table><p><strong>How to clean:</strong></p><ol><li>Clean early morning or late evening when panels are cool — cold water on hot glass can crack it</li><li>Use a soft cloth or sponge with plain water — no detergents, abrasives, or pressure washers</li><li>Rinse from top to bottom with a garden hose</li><li>For stubborn bird droppings, soak with water for 10 minutes before wiping</li></ol><p><strong>Cost:</strong> ₹500–₹1,500 per cleaning session if hiring a professional. Many installers offer annual maintenance contracts (AMC) that include 3–4 cleanings for ₹2,000–₹4,000 per year.</p>"
    },
    {
      "heading": "Inverter Maintenance and Monitoring",
      "body": "<p>The <a href=\"/in/rooftop-solar/inverter/\">solar inverter</a> is the most maintenance-sensitive component. Unlike panels that last 25+ years, inverters have a lifespan of <strong>10–15 years</strong> and contain electronic components that can degrade.</p><p><strong>Annual inverter checklist:</strong></p><ul><li>Check for error codes or warning lights on the display</li><li>Verify output readings match expected generation for the season</li><li>Ensure ventilation around the inverter is unobstructed — overheating reduces lifespan</li><li>Inspect DC/AC cable connections for corrosion or loosening</li><li>Clean air intake vents if the inverter has a fan</li></ul><p><strong>Monitoring apps:</strong> Most modern inverters (Growatt, Fronius, Havells, Microtek) come with WiFi-enabled monitoring apps. Check the app weekly to spot output drops early — a sudden decline often signals a wiring issue or panel fault before it becomes visible.</p><p>Budget ₹500–₹1,000 per year for inverter inspection by a qualified technician.</p>"
    },
    {
      "heading": "Annual Maintenance Schedule",
      "body": "<p>A simple yearly schedule keeps your system performing at peak efficiency:</p><table><thead><tr><th>Month</th><th>Task</th><th>Estimated Cost</th></tr></thead><tbody><tr><td>March (Pre-summer)</td><td>Full panel cleaning + inverter check + cable inspection</td><td>₹1,000–₹2,000</td></tr><tr><td>June (Pre-monsoon)</td><td>Panel cleaning + check earthing and lightning protection</td><td>₹500–₹1,000</td></tr><tr><td>October (Post-monsoon)</td><td>Full panel cleaning + remove debris + check for water ingress</td><td>₹1,000–₹2,000</td></tr><tr><td>December</td><td>Optional cleaning if dust buildup is visible</td><td>₹500–₹1,000</td></tr></tbody></table><p><strong>Total annual maintenance cost: ₹2,000–₹5,000</strong> for a typical residential 3kW–5kW system. This is less than a single month''s pre-solar electricity bill for most homes.</p>"
    },
    {
      "heading": "Common Issues and How to Handle Them",
      "body": "<p>Most rooftop solar issues are minor and easily resolved:</p><ul><li><strong>Output drop (gradual):</strong> Usually dust buildup. Clean panels and check if output recovers. If not, check inverter monitoring for panel-level faults.</li><li><strong>Output drop (sudden):</strong> Check inverter display for error codes. Common causes: tripped DC isolator, grid outage (on-grid systems shut down during grid failure for safety), or a blown fuse.</li><li><strong>Inverter error/shutdown:</strong> Power cycle the inverter (switch off, wait 2 minutes, switch on). If the error persists, contact your installer — most inverter warranties cover this.</li><li><strong>Hot spots on panels:</strong> Caused by persistent shading or bird dropping on one cell. Clean the panel. If the hot spot persists, the panel may need warranty replacement.</li><li><strong>Water leakage at mounting points:</strong> If roof mounting was done with penetrations, sealant may degrade over time. Contact your installer for re-sealing.</li></ul><p>For any issue that persists after basic troubleshooting, contact your installer. Attempting electrical repairs yourself is dangerous and can void warranties.</p>"
    },
    {
      "heading": "AMC Plans: Are They Worth It?",
      "body": "<p>Most installers offer Annual Maintenance Contracts (AMC) covering:</p><ul><li>3–4 scheduled panel cleaning visits</li><li>1–2 inverter inspections</li><li>Priority response for fault calls</li><li>Cable and earthing checks</li></ul><p><strong>Typical AMC pricing:</strong></p><table><thead><tr><th>System Size</th><th>AMC Cost (Annual)</th></tr></thead><tbody><tr><td>1–3kW</td><td>₹2,000–₹4,000</td></tr><tr><td>3–5kW</td><td>₹3,000–₹5,000</td></tr><tr><td>5–10kW</td><td>₹5,000–₹8,000</td></tr></tbody></table><p>AMCs are worth it for most homeowners — you get scheduled cleaning, professional inspections, and peace of mind. The cost difference between DIY and AMC is marginal when you factor in safety, roof access equipment, and time.</p>"
    },
    {
      "heading": "What Warranties Cover",
      "body": "<p>Understanding your warranty coverage reduces maintenance anxiety:</p><ul><li><strong>Solar panels (25-year performance warranty):</strong> Guarantees at least 80% output at year 25. Covers manufacturing defects, delamination, and cell degradation beyond specified limits.</li><li><strong>Inverter (5–10 year warranty):</strong> Covers electronic failures, display issues, and power conversion faults. Extended warranties available from some brands.</li><li><strong>Mounting structure (5–10 year warranty):</strong> Covers corrosion and structural defects. Galvanised iron and aluminium structures typically outlast the warranty.</li><li><strong>Workmanship (1–2 year warranty):</strong> Covers installation defects — wiring, mounting, waterproofing. Report issues within this window.</li></ul><p>Always keep your installation documents, warranty cards, and installer contact details in a safe place.</p>"
    },
    {
      "heading": "Keep Your System Running at Peak Performance",
      "body": "<p>Rooftop solar is a set-and-mostly-forget investment. A few hours of attention per year — cleaning, a quick inverter check, and monitoring your app — keeps your system generating at full capacity for decades.</p><p>If you are considering going solar and want an installer who offers reliable after-sales service, Solar Vipani connects you with verified installers who provide AMC plans and warranty support.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How often do solar panels need cleaning in India?",
      "answer": "Most Indian cities require 3–4 cleanings per year. Coastal and hill areas with less dust can manage with 2 cleanings. Areas near construction sites or industrial zones may need monthly cleaning. Dust can reduce output by 15–25%, so regular cleaning directly impacts your savings."
    },
    {
      "question": "What is the annual maintenance cost for rooftop solar?",
      "answer": "Annual maintenance costs ₹2,000–₹5,000 for a typical 3kW–5kW residential system. This covers 3–4 panel cleanings and an inverter inspection. Many installers offer AMC plans in this range that include scheduled visits and priority fault response."
    },
    {
      "question": "Can I clean solar panels myself?",
      "answer": "Yes, if you have safe roof access. Use plain water and a soft cloth or sponge. Clean early morning or late evening when panels are cool. Never use detergents, abrasives, or pressure washers. For multi-storey buildings, hire a professional for safety reasons."
    },
    {
      "question": "How long does a solar inverter last?",
      "answer": "Solar inverters last 10–15 years, compared to 25–30 years for panels. Most come with a 5–10 year warranty. You may need one inverter replacement over the system lifetime, costing ₹20,000–₹60,000 depending on capacity and type."
    },
    {
      "question": "What should I do if my solar system output drops suddenly?",
      "answer": "First, check if panels are dirty and clean them. Then check the inverter display for error codes. Try power-cycling the inverter (off for 2 minutes, then on). If the issue persists, contact your installer. Do not attempt electrical repairs yourself as it can be dangerous and void warranties."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'maintenance' AND pillar_slug = 'rooftop-solar';


-- 3. CLUSTER: net-metering
UPDATE seo_pages SET
  h1 = 'Net Metering for Rooftop Solar in India: How It Works and How to Apply',
  meta_title = 'Net Metering for Rooftop Solar India: Rules, Process & Benefits | Solar Vipani',
  meta_description = 'Net metering lets you earn credits for surplus solar power sent to the grid. Learn how it works, eligibility rules, and the application process for Indian homeowners.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Net metering is a billing arrangement where your DISCOM installs a <strong>bi-directional meter</strong> that tracks electricity flowing both ways — from the grid to your home, and from your <a href=\"/in/rooftop-solar/\">rooftop solar system</a> to the grid. You pay only for the <strong>net consumption</strong> (import minus export). Surplus credits carry forward monthly and settle annually. It is available in all Indian states for <a href=\"/in/rooftop-solar/on-grid/\">on-grid residential systems</a> and is the primary mechanism that makes rooftop solar financially viable.</p>"
    },
    {
      "heading": "How Net Metering Works: Step by Step",
      "body": "<p>Understanding the flow of electricity and credits is straightforward:</p><ol><li><strong>Daytime generation:</strong> Your solar panels produce electricity. Your home consumes what it needs first — lights, fans, fridge, AC, etc.</li><li><strong>Surplus export:</strong> Any electricity your home does not consume instantly flows out through the bi-directional meter to the DISCOM grid.</li><li><strong>Nighttime import:</strong> After sunset, your panels stop generating. You draw power from the grid as usual, and the meter records this import.</li><li><strong>Monthly netting:</strong> At the end of each billing cycle, your DISCOM calculates: <em>units imported − units exported = net consumption</em>.</li><li><strong>Credit carry-forward:</strong> If you exported more than you imported in a given month, the surplus carries forward as credit to the next billing cycle.</li><li><strong>Annual settlement:</strong> At the end of the settlement period (typically 12 months), any remaining credit is settled per your state''s policy — either paid out at a predetermined rate or lapsed.</li></ol><p>The entire process is automatic. Your bi-directional meter handles the tracking. You simply read your bill to see the net consumption.</p>"
    },
    {
      "heading": "Net Metering vs Gross Metering vs Net Billing",
      "body": "<p>Three metering mechanisms exist in India. Understanding the difference matters for your economics:</p><table><thead><tr><th>Mechanism</th><th>How It Works</th><th>Your Benefit</th><th>States Using It</th></tr></thead><tbody><tr><td><strong>Net Metering</strong></td><td>Import minus export = net consumption. Pay for the net.</td><td>Highest savings — exported units offset imported units at full retail tariff</td><td>Most states for systems ≤10kW</td></tr><tr><td><strong>Net Billing</strong></td><td>Export and import tracked separately. Exports credited at a feed-in tariff (lower than retail).</td><td>Lower savings than net metering because feed-in tariff is typically 50–70% of retail</td><td>Some states for systems &gt;10kW</td></tr><tr><td><strong>Gross Metering</strong></td><td>All generation goes to grid. You buy all consumption from grid.</td><td>Lowest benefit for homeowners — only worthwhile if feed-in tariff is high</td><td>Rare for residential</td></tr></tbody></table><p>For residential systems up to 10kW, <strong>net metering is available in all major states</strong> and delivers the best economics. Your installer will confirm which mechanism applies to your DISCOM and system size.</p>"
    },
    {
      "heading": "Eligibility and Requirements",
      "body": "<p>Net metering eligibility is straightforward for most Indian homeowners:</p><ul><li><strong>System type:</strong> Must be an on-grid (grid-connected) solar system. <a href=\"/in/rooftop-solar/off-grid/\">Off-grid systems</a> with no grid connection cannot use net metering.</li><li><strong>System size limit:</strong> Most states allow net metering for systems up to the sanctioned load of your electricity connection (typically up to 10kW for residential). Some states cap at a percentage of sanctioned load (e.g., 100% in Maharashtra, 80% in some others).</li><li><strong>Installer requirement:</strong> System must be installed by an MNRE-empanelled or DISCOM-approved vendor for the net meter application to be accepted.</li><li><strong>Roof ownership:</strong> You must own the roof or have documented permission from the building owner/housing society.</li><li><strong>Existing connection:</strong> You need an active electricity connection with the local DISCOM in your name.</li></ul><p>For apartments, the housing society must pass a resolution approving the installation. Individual flat owners can apply for net metering on their share of the rooftop system.</p>"
    },
    {
      "heading": "Net Metering Application Process",
      "body": "<p>Your solar installer handles most of the paperwork. Here is the typical process:</p><ol><li><strong>Apply to DISCOM (Day 1):</strong> Submit an online or offline application to your DISCOM with system design, installer details, and roof ownership proof. Many DISCOMs now have online portals (e.g., MSEDCL''s solar rooftop portal for Maharashtra).</li><li><strong>Technical feasibility check (7–15 days):</strong> DISCOM verifies your distribution transformer has capacity for additional solar injection. Rarely rejected for residential systems.</li><li><strong>Approval and installation (15–30 days):</strong> Once approved, your installer completes the system installation and wiring to the grid interconnection point.</li><li><strong>Meter installation (7–15 days post-installation):</strong> DISCOM replaces your existing meter with a bi-directional (import/export) meter. Some DISCOMs provide the meter; others require you to purchase an approved model.</li><li><strong>Commissioning and inspection (1–7 days):</bold> DISCOM inspects the installation, verifies safety compliance, and commissions the net meter.</li><li><strong>Start generating (from commissioning date):</strong> Your system is live. Exported units start earning credits from day one.</li></ol><p><strong>Total timeline:</strong> 30–60 days from application to commissioning in most states. Some DISCOMs (BESCOM, MSEDCL) are faster; others take longer.</p><p><a href=\"/in/solar-subsidy/application-process/\">Detailed DISCOM application guide →</a></p>"
    },
    {
      "heading": "How Much Can You Earn Through Net Metering?",
      "body": "<p>Net metering savings depend on your system size, consumption pattern, and tariff slab:</p><table><thead><tr><th>System Size</th><th>Monthly Export (avg)</th><th>Credit Value at ₹7/unit</th><th>Annual Credit Value</th></tr></thead><tbody><tr><td>1kW</td><td>40–60 units</td><td>₹280–₹420</td><td>₹3,360–₹5,040</td></tr><tr><td>2kW</td><td>80–120 units</td><td>₹560–₹840</td><td>₹6,720–₹10,080</td></tr><tr><td>3kW</td><td>120–200 units</td><td>₹840–₹1,400</td><td>₹10,080–₹16,800</td></tr><tr><td>5kW</td><td>200–350 units</td><td>₹1,400–₹2,450</td><td>₹16,800–₹29,400</td></tr></tbody></table><p><em>Export volumes assume 30–50% of generation is consumed on-site. Homes with higher daytime consumption export less but save more on direct consumption.</em></p><p>The real value of net metering is not the export credits alone — it is the combination of <strong>direct consumption savings + export credits</strong> that delivers the full <a href=\"/in/rooftop-solar/benefits/\">financial benefit</a>.</p>"
    },
    {
      "heading": "State-Wise Net Metering Policies",
      "body": "<p>While net metering is available nationwide, specific rules vary by state:</p><table><thead><tr><th>State</th><th>Max System Size</th><th>Settlement Period</th><th>Credit Carry-Forward</th></tr></thead><tbody><tr><td>Maharashtra</td><td>Up to sanctioned load</td><td>Annual (April–March)</td><td>Monthly carry-forward, annual settlement</td></tr><tr><td>Karnataka</td><td>Up to sanctioned load</td><td>Annual</td><td>Credits at feed-in tariff for excess</td></tr><tr><td>Gujarat</td><td>Up to sanctioned load</td><td>Annual</td><td>Monthly carry-forward</td></tr><tr><td>Tamil Nadu</td><td>Up to 90% of sanctioned load</td><td>Annual</td><td>Credits carry forward</td></tr><tr><td>Delhi</td><td>Up to sanctioned load</td><td>Annual</td><td>Paid at APPC rate for excess</td></tr><tr><td>Rajasthan</td><td>Up to sanctioned load</td><td>Annual</td><td>Monthly carry-forward</td></tr></tbody></table><p>Your installer will be familiar with your local DISCOM''s specific rules and will configure your system accordingly.</p><p><a href=\"/in/solar-subsidy/state-wise/\">Full state-wise solar policy guide →</a></p>"
    },
    {
      "heading": "Tips to Maximise Net Metering Benefits",
      "body": "<p>Smart usage patterns can significantly increase your net metering savings:</p><ul><li><strong>Shift heavy loads to daytime:</strong> Run washing machines, water heaters, and dishwashers during peak solar hours (10am–3pm) to consume your own generation directly instead of importing at night.</li><li><strong>Right-size your system:</strong> A system that generates 100–120% of your annual consumption maximises net metering without excessive uncompensated export. Use our <a href=\"/in/tools/solar-calculator/\">solar calculator</a> to find the right size.</li><li><strong>Monitor generation regularly:</strong> Use your inverter''s monitoring app to spot output drops early. A 20% drop in generation means 20% fewer credits.</li><li><strong>Understand your settlement period:</strong> Know when your DISCOM settles credits. Plan large electricity usage (e.g., summer AC) within the settlement window to use your credit bank.</li></ul>"
    },
    {
      "heading": "Get Started with Net Metering",
      "body": "<p>Net metering is the backbone of residential solar economics in India. With the right system size and an on-grid setup, your DISCOM effectively becomes a free battery — storing your surplus during the day and returning it at night.</p><p>Solar Vipani connects you with verified installers who handle the entire net metering application process as part of your installation. Fill one form, get 2–3 quotes.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is net metering for rooftop solar?",
      "answer": "Net metering is a billing arrangement where a bi-directional meter tracks electricity flowing both ways between your solar system and the grid. You pay only for the net consumption — units imported minus units exported. Surplus credits carry forward monthly and settle annually."
    },
    {
      "question": "How do I apply for net metering in India?",
      "answer": "Your solar installer typically handles the application. The process involves submitting an application to your DISCOM, getting technical feasibility approval, completing installation, and having the DISCOM install a bi-directional meter. Total timeline is 30–60 days in most states."
    },
    {
      "question": "Is net metering available for apartments?",
      "answer": "Yes. The housing society must pass a resolution approving the solar installation. Individual flat owners can apply for net metering on their share of the rooftop system. Some DISCOMs offer group net metering for housing societies. Your installer will guide the documentation."
    },
    {
      "question": "What happens to unused net metering credits?",
      "answer": "Credits carry forward monthly within the settlement period (typically 12 months). At annual settlement, excess credits are either paid out at a feed-in tariff (lower than retail rate), carried to the next year, or lapsed — depending on your state policy. Right-sizing your system to match annual consumption avoids excess credits."
    },
    {
      "question": "Can I use net metering with a hybrid solar system?",
      "answer": "Yes. Hybrid systems are grid-connected and qualify for net metering in most states. The battery charges from solar during the day, and any surplus beyond battery and home consumption is exported to the grid for net metering credits. This gives you both backup power and bill savings."
    },
    {
      "question": "What is the difference between net metering and net billing?",
      "answer": "In net metering, exported units offset imported units at the full retail tariff. In net billing, exports are credited at a lower feed-in tariff set by the state regulator. Net metering gives higher savings. Most Indian states use net metering for residential systems up to 10kW."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'net-metering' AND pillar_slug = 'rooftop-solar';


-- 4. CLUSTER: residential
UPDATE seo_pages SET
  h1 = 'Residential Rooftop Solar in India: A Homeowner''s Complete Guide',
  meta_title = 'Residential Rooftop Solar India: Cost, Size & Installation Guide | Solar Vipani',
  meta_description = 'Plan your home solar system — find the right size, cost, and installer. Covers 1kW–10kW systems, subsidies, and net metering for Indian residential properties.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Residential <a href=\"/in/rooftop-solar/\">rooftop solar</a> in India typically ranges from <strong>1kW to 10kW</strong>, costs <strong>₹60,000–₹6,50,000 before subsidy</strong>, and pays for itself in <strong>3–6 years</strong>. The most popular residential size is 3kW, which generates 12–15 units daily and covers a 2–3 BHK home''s electricity needs. With PM Surya Ghar subsidies up to ₹78,000 and <a href=\"/in/rooftop-solar/net-metering/\">net metering</a> in all states, going solar at home has never been more accessible.</p>"
    },
    {
      "heading": "What Size Solar System Does Your Home Need?",
      "body": "<p>System size depends on your monthly electricity consumption and available roof space. Here is a practical sizing guide:</p><table><thead><tr><th>Monthly Bill</th><th>Monthly Units</th><th>Recommended Size</th><th>Roof Space Needed</th></tr></thead><tbody><tr><td>₹800–₹1,500</td><td>80–150 units</td><td><a href=\"/in/rooftop-solar/1kw-system/\">1kW</a></td><td>~100 sq ft</td></tr><tr><td>₹1,500–₹2,500</td><td>150–250 units</td><td><a href=\"/in/rooftop-solar/2kw-system/\">2kW</a></td><td>~200 sq ft</td></tr><tr><td>₹2,500–₹4,000</td><td>250–400 units</td><td><a href=\"/in/rooftop-solar/3kw-system/\">3kW</a></td><td>~300 sq ft</td></tr><tr><td>₹4,000–₹7,000</td><td>400–600 units</td><td><a href=\"/in/rooftop-solar/5kw-system/\">5kW</a></td><td>~500 sq ft</td></tr><tr><td>₹8,000+</td><td>600+ units</td><td><a href=\"/in/rooftop-solar/10kw-system/\">10kW</a></td><td>~1000 sq ft</td></tr></tbody></table><p>The rule of thumb: <strong>1kW of solar per 120–150 units of monthly consumption</strong>. Size for 100–120% of your average annual consumption to maximise net metering benefits without excessive oversizing.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Use our solar calculator for a personalised recommendation</a></p>"
    },
    {
      "heading": "Residential Solar Cost After Subsidy",
      "body": "<p>The <a href=\"/in/rooftop-solar/cost/\">cost of residential solar</a> has dropped over 80% in the last decade. After the PM Surya Ghar subsidy, out-of-pocket costs are remarkably affordable:</p><table><thead><tr><th>System Size</th><th>Cost (Before Subsidy)</th><th>PM Surya Ghar Subsidy</th><th>Your Cost</th></tr></thead><tbody><tr><td>1kW</td><td>₹60,000–₹80,000</td><td>₹30,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2kW</td><td>₹1,10,000–₹1,40,000</td><td>₹60,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3kW</td><td>₹1,50,000–₹1,90,000</td><td>₹78,000</td><td>₹72,000–₹1,12,000</td></tr><tr><td>5kW</td><td>₹2,50,000–₹3,20,000</td><td>₹78,000</td><td>₹1,72,000–₹2,42,000</td></tr><tr><td>10kW</td><td>₹5,00,000–₹6,50,000</td><td>₹78,000</td><td>₹4,22,000–₹5,72,000</td></tr></tbody></table><p>The subsidy is capped at ₹78,000 for systems up to 3kW. For larger systems, the subsidy amount remains the same but covers a smaller percentage of the total cost.</p><p>If upfront cost is a concern, <a href=\"/in/solar-financing/solar-loan/\">solar loans</a> from banks like SBI and HDFC offer EMIs that are often lower than your current electricity bill.</p>"
    },
    {
      "heading": "Choosing the Right System Type for Your Home",
      "body": "<p>Three system types serve residential needs differently:</p><p><strong><a href=\"/in/rooftop-solar/on-grid/\">On-grid (grid-tied)</a> — Best for most homes</strong></p><ul><li>Connected to DISCOM grid, earns net metering credits</li><li>Most affordable option (no battery cost)</li><li>Qualifies for full PM Surya Ghar subsidy</li><li>Only limitation: shuts down during grid outages (safety requirement)</li></ul><p><strong><a href=\"/in/rooftop-solar/hybrid/\">Hybrid</a> — Best for homes with frequent power cuts</strong></p><ul><li>Grid-connected with battery backup</li><li>Provides power during outages (unlike on-grid)</li><li>Costs 30–50% more than on-grid due to batteries</li><li>Qualifies for partial subsidy in some states</li></ul><p><strong><a href=\"/in/rooftop-solar/off-grid/\">Off-grid</a> — Best for remote locations</strong></p><ul><li>Fully independent, not connected to grid</li><li>Requires large battery bank for nighttime power</li><li>Most expensive option, does not qualify for subsidy</li><li>Only necessary where grid connectivity is absent</li></ul><p>For 90% of Indian homes, an <strong>on-grid system</strong> offers the best value. If you face daily power cuts of 2+ hours, consider a hybrid system.</p><p><a href=\"/in/rooftop-solar/on-grid-vs-off-grid/\">Detailed comparison: On-Grid vs Off-Grid →</a></p>"
    },
    {
      "heading": "The Residential Solar Installation Process",
      "body": "<p>From decision to generating power, here is the typical timeline for a residential installation:</p><ol><li><strong>Site survey (Day 1–3):</strong> Installer visits your home, inspects roof structure, measures available space, checks shading, and assesses electrical panel capacity.</li><li><strong>System design and quote (Day 3–7):</strong> Installer provides a detailed proposal with panel layout, inverter selection, expected generation, and pricing.</li><li><strong>DISCOM application (Day 7–14):</strong> Installer submits net metering application to your DISCOM on your behalf.</li><li><strong>Installation (Day 15–20):</strong> Physical installation takes 1–3 days for residential systems. Includes mounting structure, panels, inverter, wiring, and earthing.</li><li><strong>DISCOM inspection and meter (Day 20–45):</strong> DISCOM inspects the installation, installs bi-directional meter, and commissions the system.</li><li><strong>System live (Day 45–60):</strong> Your system starts generating and earning net metering credits.</li></ol><p>Total timeline: <strong>45–60 days</strong> from booking to going live. The installation itself takes just 1–3 days; most of the timeline is DISCOM processing.</p><p><a href=\"/in/solar-installation/process/\">Detailed installation process guide →</a></p>"
    },
    {
      "heading": "Roof Requirements for Residential Solar",
      "body": "<p>Not every roof is identical, but most Indian residential roofs work well for solar:</p><ul><li><strong>Shadow-free area:</strong> You need unobstructed sunlight from 9am to 4pm on the portion of roof used for panels. Nearby buildings, trees, and water tanks can create problematic shading.</li><li><strong>Roof condition:</strong> The roof should be structurally sound and not due for major repairs within the next 5 years. Solar mounting adds 15–20 kg/sq metre of load.</li><li><strong>Orientation:</strong> South-facing roofs are ideal in India. East and west-facing roofs still work but with 10–15% lower output.</li><li><strong>Flat vs sloped:</strong> Both work. Flat roofs (common in India) use tilted mounting structures. Sloped roofs use flush mounts if the slope angle is suitable.</li></ul><p>During the site survey, your installer will assess all these factors and design the optimal panel layout for your specific roof.</p><p><a href=\"/in/solar-installation/roof-assessment/\">Full roof assessment guide →</a></p>"
    },
    {
      "heading": "Residential Solar for Apartments and Housing Societies",
      "body": "<p>Installing solar in apartments has unique considerations but is increasingly common:</p><ul><li><strong>Housing society approval:</strong> Requires a resolution passed in a general body meeting. Most societies are receptive given the maintenance charge savings on common area electricity.</li><li><strong>Shared rooftop allocation:</strong> Roof space is divided among participating flat owners proportional to flat size or agreed formula.</li><li><strong>Individual vs common area:</strong> You can install solar for your individual flat''s consumption or for the society''s common area loads (lifts, water pumps, corridor lights).</li><li><strong>Group net metering:</strong> Some DISCOMs offer group net metering where the society installs one system and credits are distributed across participating meters.</li></ul><p>Under PM Surya Ghar, individual flat owners in apartments are eligible for subsidy on their share of the rooftop system.</p><p><a href=\"/in/rooftop-solar/for-apartments/\">Full guide: Solar for Apartments →</a></p>"
    },
    {
      "heading": "Financing Your Residential Solar System",
      "body": "<p>If paying the full amount upfront is not convenient, several financing options make solar accessible:</p><ul><li><strong><a href=\"/in/solar-financing/solar-loan/\">Solar loans:</a></strong> Banks like SBI, HDFC, and Canara Bank offer dedicated solar loans at 7–9% interest for 5–7 year tenures. EMIs are often lower than your current electricity bill.</li><li><strong><a href=\"/in/solar-financing/emi-options/\">Installer EMI plans:</a></strong> Many installers partner with NBFCs to offer 0% or low-interest EMI at the point of sale.</li><li><strong>PM Surya Ghar subsidy:</strong> Reduces your loan principal. The subsidy is credited after installation, which you can use to prepay the loan.</li></ul><p>A ₹1,50,000 system after subsidy (₹72,000 net) on a 5-year loan at 8% works out to roughly ₹1,460/month EMI — likely less than your current electricity bill.</p><p><a href=\"/in/solar-financing/\">Full financing guide →</a></p>"
    },
    {
      "heading": "Get Quotes for Your Home",
      "body": "<p>Every home is different — roof size, orientation, shading, and consumption all affect the ideal system. The best way to get an accurate picture is a site survey and customised quote from a verified installer.</p><p>Solar Vipani connects you with 2–3 verified installers in your city who will assess your roof and provide detailed, comparable quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What size solar system do I need for my home?",
      "answer": "Size depends on your monthly consumption. As a rule of thumb, 1kW of solar covers 120–150 units monthly. A 2–3 BHK home using 300–400 units per month typically needs a 3kW system. Check your electricity bill for average monthly units and use our solar calculator for a precise recommendation."
    },
    {
      "question": "How much does residential solar cost in India after subsidy?",
      "answer": "After the PM Surya Ghar subsidy, a 3kW system (most popular for homes) costs ₹72,000–₹1,12,000 out of pocket. A 2kW system costs ₹50,000–₹80,000 after subsidy. Prices vary by panel type, inverter brand, and city. Get quotes from 2–3 installers to compare."
    },
    {
      "question": "Can I install solar on my apartment?",
      "answer": "Yes. You need housing society approval via a resolution passed in a general body meeting. Roof space is shared among participating flat owners. Individual flat owners can apply for PM Surya Ghar subsidy on their share. Some DISCOMs offer group net metering for societies."
    },
    {
      "question": "How long does residential solar installation take?",
      "answer": "Physical installation takes 1–3 days. The full process from site survey to system going live takes 45–60 days, mostly due to DISCOM net metering approval and meter installation. Your installer handles all the paperwork and DISCOM coordination."
    },
    {
      "question": "Is my roof suitable for solar panels?",
      "answer": "Most Indian residential roofs work for solar. You need a shadow-free area with sunlight from 9am to 4pm, a structurally sound roof, and roughly 100 sq ft per kW. South-facing roofs are ideal. Your installer will conduct a free site survey to confirm suitability before you commit."
    },
    {
      "question": "Should I get an on-grid or hybrid solar system for my home?",
      "answer": "On-grid is best for most homes — it is the most affordable, qualifies for full subsidy, and earns net metering credits. Choose hybrid only if you face frequent power cuts (2+ hours daily) and need backup. Hybrid costs 30–50% more due to batteries but provides energy during outages."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'residential' AND pillar_slug = 'rooftop-solar';

COMMIT;