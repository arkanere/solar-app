-- Solar Installation Clusters Batch 4: diy-vs-professional, site-survey, wiring, commissioning
-- Run: psql $POSTGRES_URL < 028-solar-installation-clusters-batch4.sql

BEGIN;

-- 1. CLUSTER: diy-vs-professional
UPDATE seo_pages SET
  h1 = 'DIY vs Professional Solar Installation in India: What You Need to Know',
  meta_title = 'DIY vs Professional Solar Installation India: Cost, Risk & Verdict | Solar Vipani',
  meta_description = 'Should you install solar panels yourself or hire a professional? Compare cost savings, safety risks, warranty implications and subsidy eligibility for DIY vs professional solar.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>For grid-connected residential solar in India, <strong>professional installation is strongly recommended</strong>. DIY saves 10–15% on installation labour but costs you the PM Surya Ghar subsidy (up to ₹78,000), voids manufacturer warranties, and creates electrical <a href=\"/in/solar-installation/safety/\">safety risks</a>. The math is clear: professional installation through an MNRE-empanelled vendor is cheaper, safer, and qualifies for government benefits.</p>"
    },
    {
      "heading": "The True Cost Comparison",
      "body": "<p>DIY sounds cheaper until you account for what you lose:</p><table><thead><tr><th>Factor</th><th>DIY Installation</th><th>Professional Installation</th></tr></thead><tbody><tr><td>Equipment cost</td><td>₹1,20,000–₹1,60,000 (3kW)</td><td>₹1,50,000–₹1,90,000 (3kW)</td></tr><tr><td>Installation labour</td><td>₹0 (your time)</td><td>Included in price</td></tr><tr><td>PM Surya Ghar subsidy</td><td>Not eligible</td><td>Up to ₹78,000</td></tr><tr><td>Net metering</td><td>Difficult to obtain</td><td>Handled by installer</td></tr><tr><td>Warranty</td><td>Often voided</td><td>Full 25-year panel + 5–10 year inverter</td></tr><tr><td>Effective cost (3kW)</td><td>₹1,20,000–₹1,60,000</td><td>₹72,000–₹1,12,000 (after subsidy)</td></tr></tbody></table><p>Professional installation with subsidy is <strong>₹30,000–₹50,000 cheaper</strong> than DIY for a typical 3kW system. The DIY ''savings'' on labour are wiped out many times over by the lost subsidy.</p>"
    },
    {
      "heading": "Subsidy and Net Metering: The Deal-Breaker",
      "body": "<p>The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a> is available only for systems installed by MNRE-empanelled vendors. DIY installations are ineligible — period. This is the single biggest financial argument against DIY.</p><p>Similarly, DISCOM net metering applications require an installer''s MNRE channel partner certificate, system design signed by a licensed electrical engineer, and equipment datasheets from BIS-certified manufacturers. While technically possible to submit these yourself, DISCOMs routinely reject applications not backed by a registered installer.</p><p>Without net metering, your on-grid system cannot export surplus electricity. You waste 40–60% of your daytime generation — destroying the financial case for solar entirely.</p>"
    },
    {
      "heading": "Safety Risks of DIY Solar",
      "body": "<p>Solar installation involves working with high-voltage DC electricity on a rooftop. The risks are real:</p><ul><li><strong>DC shock hazard</strong> — Solar panels generate 400–600V DC in series strings. DC shock is more dangerous than AC at the same voltage because there is no zero-crossing point that allows muscle release.</li><li><strong>Fall risk</strong> — Working on a roof with heavy panels and mounting structures without proper harnesses is hazardous.</li><li><strong>Fire risk from poor connections</strong> — Incorrectly crimped MC4 connectors or undersized cables cause DC arcs that generate intense localised heat. <a href=\"/in/solar-installation/safety/\">Safety guide →</a></li><li><strong>Roof damage</strong> — Incorrect mounting can compromise waterproofing and structural integrity.</li><li><strong>No anti-islanding verification</strong> — Without proper testing, your system may not shut down during grid outages, endangering utility workers.</li></ul><p>Professional installers carry insurance, use proper safety equipment, and have trained teams who handle rooftop electrical work daily.</p>"
    },
    {
      "heading": "Warranty Implications",
      "body": "<p>Most solar panel and inverter manufacturers explicitly require professional installation by authorised dealers for warranty validity. A DIY installation typically means:</p><ul><li><strong>Panel warranty voided</strong> — If a panel fails or underperforms, the manufacturer will not honour the 25-year performance warranty if installation was not done by an authorised channel partner.</li><li><strong>Inverter warranty voided</strong> — Inverter manufacturers require commissioning by certified installers. Configuration errors from DIY setup are not covered.</li><li><strong>No workmanship guarantee</strong> — Professional installers provide 1–5 year workmanship warranties covering mounting, wiring, and connections. DIY has no such safety net.</li></ul><p>Over a 25-year system life, the value of these warranties far exceeds any short-term labour savings.</p>"
    },
    {
      "heading": "When DIY Might Make Sense",
      "body": "<p>There are limited scenarios where DIY solar is reasonable:</p><ul><li><strong>Off-grid systems in remote areas</strong> — Where DISCOM grid does not reach and subsidy is irrelevant (off-grid does not qualify anyway).</li><li><strong>Small portable systems</strong> — 100–500W systems for sheds, farm fencing, or RV/camping use that do not connect to building wiring.</li><li><strong>Learning and hobby projects</strong> — Small-scale setups to understand solar technology, not meant as primary power systems.</li></ul><p>For any grid-connected residential system meant to reduce your electricity bill, professional installation is the clear winner on cost, safety, and long-term value.</p>"
    },
    {
      "heading": "What Professional Installation Includes",
      "body": "<p>When you hire a verified installer through Solar Vipani, the <a href=\"/in/solar-installation/process/\">installation package</a> covers:</p><ul><li><a href=\"/in/solar-installation/site-survey/\">Site survey</a> and <a href=\"/in/solar-installation/roof-assessment/\">roof assessment</a></li><li>System design optimised for your roof and consumption pattern</li><li>Procurement of BIS-certified panels and inverters with full manufacturer warranty</li><li>Mounting structure design and fabrication for your specific roof</li><li>Complete <a href=\"/in/solar-installation/wiring/\">electrical wiring</a> with safety devices</li><li><a href=\"/in/solar-installation/permits/\">DISCOM application</a> and net metering liaison</li><li>PM Surya Ghar subsidy processing</li><li><a href=\"/in/solar-installation/commissioning/\">System commissioning</a> and handover</li><li>Post-installation monitoring and maintenance support</li></ul><p>All of this is included in the quoted price — there are no hidden charges for permits or paperwork.</p>"
    },
    {
      "heading": "Get Professional Quotes — Free",
      "body": "<p>The verdict is clear: professional installation saves more money (through subsidy), eliminates safety risk, preserves warranties, and includes everything from survey to commissioning.</p><p>Solar Vipani connects you with 2–3 verified MNRE-empanelled installers in your city. Compare quotes, check credentials, and go solar with confidence.</p><p><a href=\"/in/get-quotes/\">Get your free professional solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is it cheaper to install solar panels yourself?",
      "answer": "No. While DIY saves 10–15% on installation labour, you lose the PM Surya Ghar subsidy of up to ₹78,000. For a 3kW system, professional installation with subsidy costs ₹72,000–₹1,12,000 versus ₹1,20,000–₹1,60,000 for DIY. Professional installation is actually ₹30,000–₹50,000 cheaper."
    },
    {
      "question": "Can I get government subsidy on DIY solar installation?",
      "answer": "No. The PM Surya Ghar subsidy requires installation by an MNRE-empanelled vendor. DIY installations do not qualify for any central or state government subsidies. The installer must also submit the commissioning report to the subsidy portal for disbursement."
    },
    {
      "question": "Will solar panel warranty be valid if I install them myself?",
      "answer": "Most manufacturers void warranties for non-professional installations. Panel manufacturers require installation by authorised channel partners for the 25-year warranty. Inverter manufacturers require certified commissioning. Without valid warranties, you bear the full cost of any equipment failure over the 25-year system life."
    },
    {
      "question": "Is it legal to install solar panels yourself in India?",
      "answer": "There is no law explicitly prohibiting DIY solar installation. However, connecting to the grid without DISCOM approval is illegal and dangerous. DISCOMs require applications through registered installers for net metering approval, making fully independent DIY grid-connected installations practically impossible."
    },
    {
      "question": "What skills do you need for DIY solar installation?",
      "answer": "DIY solar requires knowledge of DC electrical systems, ability to work safely at heights, structural understanding for mounting, and familiarity with inverter configuration and grid synchronisation. It also requires tools for cable crimping, torque wrenches for mounting bolts, and electrical testing equipment. Most homeowners lack this specialised expertise."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'diy-vs-professional' AND pillar_slug = 'solar-installation';


-- 2. CLUSTER: site-survey
UPDATE seo_pages SET
  h1 = 'Solar Site Survey in India: What Installers Assess Before Your Installation',
  meta_title = 'Solar Site Survey India: What Installers Check & Why It Matters | Solar Vipani',
  meta_description = 'A solar site survey covers roof measurement, shadow analysis, electrical load assessment and structural evaluation. Learn what happens during a survey and how it shapes your system design.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar site survey is a physical visit by your installer to evaluate your rooftop, electrical system, and energy consumption before designing your solar system. It covers <strong>roof measurement, shadow mapping, structural assessment, electrical load review, and inverter placement</strong>. The survey takes 1–2 hours and is typically free when you request quotes through Solar Vipani. It is the foundation of an accurate system design and <a href=\"/in/solar-installation/cost/\">cost estimate</a>.</p>"
    },
    {
      "heading": "Why the Site Survey Matters",
      "body": "<p>An online solar calculator gives you a rough estimate. A site survey gives you a precise design. The difference can be significant:</p><ul><li>A shadow from a nearby water tank might reduce usable area by 30%</li><li>Your roof may face east-west instead of south, requiring a different panel layout</li><li>Your electrical panel may need upgrading to handle the inverter''s output</li><li>Structural limitations might cap your system at 2kW instead of the 3kW you planned</li></ul><p>Every verified installer on Solar Vipani conducts a site survey before finalising their quote. This is what separates an accurate, deliverable proposal from a generic estimate that disappoints after installation.</p>"
    },
    {
      "heading": "What Happens During a Site Survey",
      "body": "<p>A complete solar site survey follows this sequence:</p><ol><li><strong>Roof access and measurement</strong> — The installer measures total roof area using a tape or laser measure. They note the roof shape, existing structures (tanks, staircase rooms), and access points.</li><li><strong>Shadow analysis</strong> — Using a solar pathfinder or smartphone app, the installer maps shadows across your roof for different times of day and seasons. This determines shadow-free zones for panel placement. <a href=\"/in/solar-installation/roof-assessment/\">Detailed roof assessment →</a></li><li><strong>Structural inspection</strong> — Check roof type (RCC, metal, tile), slab condition, parapet height, and load-bearing capacity for mounting structures.</li><li><strong>Compass reading and orientation</strong> — Determine roof orientation relative to south. Note any tilt or slope that affects panel mounting angle.</li><li><strong>Electrical panel review</strong> — Inspect your existing DB (distribution board), main switch rating, earthing, and available space for solar AC protection devices.</li><li><strong>Electricity bill analysis</strong> — Review 6–12 months of bills to understand your consumption pattern, peak usage, tariff slab, and sanctioned load.</li><li><strong>Inverter location</strong> — Identify a cool, ventilated, accessible location near the DB for inverter mounting — ideally within 10 metres of the panel array to minimise DC cable losses.</li><li><strong>Photography and documentation</strong> — Detailed photos of the roof, electrical panel, meter, and surroundings for the design team to reference.</li></ol>"
    },
    {
      "heading": "From Survey to System Design",
      "body": "<p>After the site survey, your installer''s design team creates a detailed system proposal:</p><table><thead><tr><th>Survey Input</th><th>Design Output</th></tr></thead><tbody><tr><td>Usable roof area</td><td>Maximum system capacity (kW)</td></tr><tr><td>Shadow map</td><td>Panel layout drawing</td></tr><tr><td>Roof orientation</td><td>Tilt structure angle and type</td></tr><tr><td>Structural condition</td><td>Mounting method (bolted vs ballasted)</td></tr><tr><td>Electricity bills</td><td>Recommended system size for your consumption</td></tr><tr><td>Electrical panel</td><td>Protection devices and wiring specifications</td></tr><tr><td>Inverter location</td><td>DC/AC cable routing plan</td></tr></tbody></table><p>This design is what drives the final quote. Two installers surveying the same roof may propose different system sizes based on their <a href=\"/in/solar-installation/roof-assessment/\">assessment</a> methodology — which is why getting 2–3 quotes is valuable.</p>"
    },
    {
      "heading": "Site Survey vs Roof Assessment",
      "body": "<p>These terms are often used interchangeably, but they serve different purposes:</p><ul><li><strong>Site survey</strong> — The complete on-site evaluation covering roof, electrical, consumption, and environmental factors. It is the full input for system design.</li><li><strong><a href=\"/in/solar-installation/roof-assessment/\">Roof assessment</a></strong> — The structural and spatial subset focused specifically on whether your roof can physically support solar panels.</li></ul><p>A site survey includes a roof assessment, plus electrical and consumption analysis. Think of the roof assessment as one component of the broader site survey.</p><p>Both happen during the same visit — your installer does not need to come twice.</p>"
    },
    {
      "heading": "How to Prepare for Your Site Survey",
      "body": "<p>Make the survey efficient by having these ready:</p><ul><li><strong>Roof access</strong> — Ensure the installer can safely reach the rooftop. Unlock any access hatches or stairway doors.</li><li><strong>Electricity bills</strong> — Last 6–12 months of bills (digital or paper). These show your consumption pattern and tariff slab.</li><li><strong>Electrical panel access</strong> — The installer needs to see your main distribution board, meter, and existing earthing.</li><li><strong>Usage plans</strong> — Tell the installer about planned changes: adding an AC, buying an EV, or expecting higher consumption. This affects system sizing.</li><li><strong>Budget range</strong> — Sharing your budget helps the installer design a system that maximises value within your range, rather than over-specifying.</li></ul><p>A well-prepared survey takes about 1 hour. Without preparation, it may require a follow-up visit.</p>"
    },
    {
      "heading": "Red Flags: When a Survey Is Skipped",
      "body": "<p>Be cautious of any installer who quotes without a site survey. Common shortcuts and their consequences:</p><ul><li><strong>Satellite-only assessment</strong> — Google Maps gives roof area but misses shadows, structural issues, and electrical compatibility. Acceptable for initial estimates only.</li><li><strong>Phone-based sizing</strong> — Recommending a system size based only on your electricity bill ignores roof limitations that may reduce achievable capacity.</li><li><strong>Template quotes</strong> — Standard price-per-kW quotes without site-specific design lead to installation problems and underperformance.</li></ul><p>A genuine installer invests time in the survey because it protects both parties. It prevents cost overruns, design changes mid-installation, and customer disappointment.</p>"
    },
    {
      "heading": "Get a Free Site Survey from Verified Installers",
      "body": "<p>Solar Vipani''s verified installers conduct thorough site surveys as part of the quotation process — at no cost and no obligation. Request quotes and 2–3 local installers will visit your site, assess your roof, and deliver competing proposals based on real measurements.</p><p><a href=\"/in/get-quotes/\">Schedule your free site survey →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is a solar site survey free?",
      "answer": "Yes, most reputable installers offer free site surveys as part of the quotation process. When you request quotes through Solar Vipani, 2–3 verified installers visit your site at no cost. The survey is an investment the installer makes to provide an accurate quote and win your business."
    },
    {
      "question": "How long does a solar site survey take?",
      "answer": "A typical residential site survey takes 1–2 hours. The installer measures the roof, checks for shadows, inspects the electrical panel, reviews your bills, and takes photos. They then prepare a system design proposal within 2–3 days based on the survey data."
    },
    {
      "question": "What should I prepare before a solar site survey?",
      "answer": "Have your roof access ready, gather your last 6–12 months of electricity bills, ensure the installer can access your electrical distribution board, and share any future consumption plans (new AC, EV charger). Also mention your budget range so the installer can optimise the design within it."
    },
    {
      "question": "Can a solar company give an accurate quote without visiting my roof?",
      "answer": "No. Remote estimates based on satellite images or phone conversations miss critical factors like shadows, structural condition, electrical compatibility, and precise measurements. A site survey is essential for an accurate, deliverable quote. Be cautious of any installer who quotes without visiting your site."
    },
    {
      "question": "What is the difference between a site survey and a roof assessment?",
      "answer": "A site survey is the complete on-site evaluation covering your roof, electrical system, energy consumption, and environment. A roof assessment is the structural and spatial subset focused on whether your roof can support panels. The site survey includes the roof assessment plus electrical and consumption analysis — both happen during the same visit."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'site-survey' AND pillar_slug = 'solar-installation';


-- 3. CLUSTER: wiring
UPDATE seo_pages SET
  h1 = 'Solar Panel Wiring in India: Complete Guide to DC/AC Electrical Connections',
  meta_title = 'Solar Panel Wiring India: DC/AC Connections, Cable Sizing & Safety | Solar Vipani',
  meta_description = 'Understand solar panel wiring — DC connections from panels to inverter, AC connections to your home, cable sizing, earthing and safety devices. What your installer should get right.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar wiring connects your panels to the inverter (DC side) and the inverter to your home''s electrical system (AC side). It includes <strong>DC cables, MC4 connectors, DC isolator, inverter, AC isolator, distribution board, earthing, and surge protection</strong>. Proper wiring is critical for <a href=\"/in/solar-installation/safety/\">safety</a> and system performance — undersized cables or loose connections can cause power loss, overheating, or fire. This is always handled by your <a href=\"/in/solar-installation/choosing-installer/\">professional installer</a>.</p>"
    },
    {
      "heading": "Solar Wiring Overview: The Two Sides",
      "body": "<p>Every solar installation has two distinct electrical circuits:</p><ul><li><strong>DC side</strong> — From solar panels to inverter. Carries high-voltage direct current (300–600V DC for typical residential systems). Requires specialised DC-rated cables, connectors, and protection devices.</li><li><strong>AC side</strong> — From inverter output to your home''s distribution board and the grid meter. Carries standard 230V AC at 50 Hz — same as your existing home wiring, but with additional protection devices.</li></ul><p>The inverter sits between these two circuits, converting DC from panels into AC for your home. Each side has different cable types, connectors, and safety requirements.</p>"
    },
    {
      "heading": "DC Wiring: Panels to Inverter",
      "body": "<p>The DC circuit is the most safety-critical part of the wiring because solar panels generate voltage whenever light hits them — there is no way to fully ''switch off'' panels during daylight.</p><p>Key DC wiring components:</p><ul><li><strong>Solar DC cables</strong> — Specialised cables rated for outdoor UV exposure, temperature extremes (−40°C to +90°C), and DC voltage. Standard sizes are 4mm² for systems up to 3kW and 6mm² for larger systems.</li><li><strong>MC4 connectors</strong> — Waterproof, locking connectors that join panel-to-panel and panel-to-cable connections. Must be properly crimped with a dedicated MC4 crimping tool — hand-tightened connections are a fire hazard.</li><li><strong>Series strings</strong> — Panels are wired in series (positive to negative) to build up voltage to the inverter''s input range. A typical 3kW system has 6 panels in one string producing ~240V DC.</li><li><strong>DC junction box</strong> — Consolidates multiple panel strings before the DC cable run to the inverter. Contains string fuses for overcurrent protection.</li><li><strong>DC isolator</strong> — A manual disconnect switch between panels and inverter, mounted near the inverter. Allows safe isolation during maintenance.</li></ul>"
    },
    {
      "heading": "AC Wiring: Inverter to Home",
      "body": "<p>The AC side connects your inverter''s output to your home''s electrical system:</p><ul><li><strong>AC output cable</strong> — Standard copper cable from inverter to your distribution board. Sized for the inverter''s maximum output current (typically 4mm² for up to 5kW single-phase).</li><li><strong>AC isolator</strong> — A disconnect switch on the inverter''s AC output. Allows disconnection from the grid and home wiring during maintenance.</li><li><strong>MCB/MCCB</strong> — A dedicated miniature circuit breaker in your distribution board for the solar feed. Sized for the inverter''s maximum current output plus a 25% safety margin.</li><li><strong>Net meter connection</strong> — The AC output feeds through your existing distribution board to the bi-directional net meter installed by your DISCOM. <a href=\"/in/solar-installation/grid-connection/\">Grid connection details →</a></li></ul><p>The AC wiring is relatively straightforward — it uses the same cable types and protection devices as standard home electrical installations.</p>"
    },
    {
      "heading": "Cable Sizing: Getting It Right",
      "body": "<p>Undersized cables are the most common wiring error in budget installations. Consequences include power loss (heat), voltage drop (reduced output), and in extreme cases, cable fires.</p><p>Cable sizing guidelines for residential systems:</p><table><thead><tr><th>System Size</th><th>DC Cable</th><th>AC Cable</th><th>Earth Cable</th></tr></thead><tbody><tr><td>1–2 kW</td><td>4mm² DC solar cable</td><td>2.5mm² copper</td><td>4mm² green/yellow</td></tr><tr><td>3–5 kW</td><td>4–6mm² DC solar cable</td><td>4mm² copper</td><td>6mm² green/yellow</td></tr><tr><td>5–10 kW</td><td>6mm² DC solar cable</td><td>6–10mm² copper</td><td>6–10mm² green/yellow</td></tr></tbody></table><p>The rule of thumb: cables should be rated for at least <strong>1.25x the maximum current</strong> the circuit can carry. Your installer calculates exact sizing based on cable length (longer runs need thicker cables to compensate for voltage drop) and ambient temperature.</p>"
    },
    {
      "heading": "Earthing: The Safety Foundation",
      "body": "<p>Proper earthing (grounding) protects you from electric shock and equipment from surge damage. Solar installations require dedicated earthing beyond your home''s existing earth:</p><ul><li><strong>Equipment earth</strong> — All metal components (panel frames, mounting structure, inverter body, junction boxes) are bonded together and connected to a dedicated earth pit. This ensures no exposed metal can carry voltage if insulation fails.</li><li><strong>System earth</strong> — The inverter''s earthing terminal connects to a separate earth pit for functional grounding of the AC circuit.</li><li><strong>Lightning/surge earth</strong> — If a lightning arrestor is installed, it connects to its own dedicated earth pit to dissipate strike energy.</li></ul><p>Earth pit resistance should be <strong>below 5 ohms</strong>, measured with an earth resistance tester. In rocky or sandy soil, achieving low resistance may require chemical earthing compounds or deeper pits.</p><p>Your installer should provide earth resistance test results as part of the <a href=\"/in/solar-installation/commissioning/\">commissioning documentation</a>.</p>"
    },
    {
      "heading": "Cable Routing Best Practices",
      "body": "<p>How cables are routed matters as much as their sizing. Proper routing prevents degradation, damage, and safety hazards over the 25-year system life:</p><ul><li><strong>UV protection</strong> — DC cables running outdoors must be UV-rated. If not, they must be enclosed in UV-resistant conduit.</li><li><strong>Conduit and cable trays</strong> — All cables should run in conduit (PVC or metal) or cable trays. Loose cables draped across the roof degrade faster and pose tripping hazards.</li><li><strong>No sharp bends</strong> — Cables must have a minimum bend radius (typically 6x the cable diameter) to prevent insulation damage.</li><li><strong>Separation of DC and AC</strong> — DC and AC cables must run in separate conduits to prevent electromagnetic interference and simplify fault isolation.</li><li><strong>Drip loops</strong> — Where cables enter the building from outside, a drip loop (U-shaped dip) prevents rainwater from following the cable indoors.</li><li><strong>Labelling</strong> — All cables, isolators, and junction boxes should be labelled (''Solar DC'', ''Solar AC'', voltage ratings) for safe identification during future maintenance.</li></ul>"
    },
    {
      "heading": "Wiring Is a Professional Job",
      "body": "<p>Solar wiring involves DC voltages that can be lethal and connections that must last 25 years through extreme temperatures, monsoon humidity, and UV exposure. This is not a task for general electricians or <a href=\"/in/solar-installation/diy-vs-professional/\">DIY attempts</a>.</p><p>Every installer on Solar Vipani''s network uses certified solar cables, proper MC4 crimping tools, and follows IEC 62446 standards for solar electrical installations. Their wiring work is inspected by the DISCOM during the <a href=\"/in/solar-installation/grid-connection/\">grid connection</a> process.</p><p><a href=\"/in/get-quotes/\">Get quotes from wiring-certified solar installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What type of wire is used for solar panels?",
      "answer": "Solar panels use specialised DC solar cables (also called PV cables) rated for UV exposure, temperature extremes, and DC voltage. Standard sizes are 4mm² for systems up to 3kW and 6mm² for larger systems. These are different from regular household wiring and must be specifically rated for solar applications."
    },
    {
      "question": "Can I use regular electrical wire for solar panels?",
      "answer": "No. Regular household wires are not rated for the DC voltages, UV exposure, and temperature extremes that solar DC circuits experience. Using regular wire voids warranties, fails safety inspections, and creates fire risk. The AC side from inverter to distribution board uses standard copper cables but with proper solar-rated protection devices."
    },
    {
      "question": "How many earth pits are needed for a solar system?",
      "answer": "A residential solar system needs minimum two earth pits — one for equipment earthing (panel frames, mounting structure, inverter body) and one for system earthing (AC circuit). If a lightning arrestor is installed, a third dedicated earth pit is recommended. Each earth pit should have resistance below 5 ohms."
    },
    {
      "question": "What is an MC4 connector and why does it matter?",
      "answer": "MC4 connectors are waterproof, UV-resistant, locking connectors specifically designed for solar panel DC connections. They must be crimped with a dedicated MC4 crimping tool — hand-tightened connections are the leading cause of solar system fires. Quality MC4 connectors are rated for 25+ years of outdoor use."
    },
    {
      "question": "What causes power loss in solar wiring?",
      "answer": "The main causes are undersized cables (creating resistance and heat), long cable runs between panels and inverter (causing voltage drop), loose connections (creating hot spots), and corroded connectors. Proper cable sizing, short DC cable runs, professionally crimped connections, and UV-rated outdoor cables minimise losses to under 2%."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'wiring' AND pillar_slug = 'solar-installation';


-- 4. CLUSTER: commissioning
UPDATE seo_pages SET
  h1 = 'Solar System Commissioning in India: Final Steps Before Your System Goes Live',
  meta_title = 'Solar System Commissioning India: Testing, Verification & Handover | Solar Vipani',
  meta_description = 'Solar commissioning is the final step — system testing, grid synchronisation, safety verification and documentation handover. Learn what happens and what to verify before sign-off.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Commissioning is the final phase of <a href=\"/in/solar-installation/\">solar installation</a> where your system is tested, verified, and officially activated. It includes <strong>electrical testing, inverter configuration, grid synchronisation, safety device verification, performance measurement, and documentation handover</strong>. This typically takes half a day and is performed by your installer in coordination with the DISCOM. Do not sign off until every item on the commissioning checklist is verified.</p>"
    },
    {
      "heading": "What Is Solar Commissioning?",
      "body": "<p>Commissioning is the bridge between a physically installed system and a working power plant. It confirms that every component is correctly connected, safely configured, and performing as designed.</p><p>Think of it as the final inspection before your builder hands over a new home — you would not accept the keys without verifying that plumbing, electrical, and fixtures all work. Solar commissioning is the same principle applied to your rooftop power plant.</p><p>Commissioning happens after physical installation is complete and typically coincides with or follows the <a href=\"/in/solar-installation/grid-connection/\">DISCOM inspection</a>. Your installer conducts internal commissioning tests, and the DISCOM engineer verifies grid-connection compliance.</p>"
    },
    {
      "heading": "The Commissioning Checklist",
      "body": "<p>A thorough commissioning process covers these checks:</p><table><thead><tr><th>Category</th><th>What Is Checked</th><th>Pass Criteria</th></tr></thead><tbody><tr><td>DC circuit</td><td>Open-circuit voltage of each string</td><td>Within ±5% of expected value</td></tr><tr><td>DC circuit</td><td>Short-circuit current of each string</td><td>Within ±5% of panel datasheet rating</td></tr><tr><td>DC circuit</td><td>Insulation resistance</td><td>> 1 MΩ (megaohm) per string</td></tr><tr><td>AC circuit</td><td>Inverter output voltage and frequency</td><td>230V ±10%, 50 Hz ±0.5 Hz</td></tr><tr><td>Safety</td><td>Earth resistance</td><td>< 5 ohms per earth pit</td></tr><tr><td>Safety</td><td>DC and AC isolator function</td><td>Clean disconnect, no arcing</td></tr><tr><td>Safety</td><td>Anti-islanding test</td><td>Inverter shuts down within 2 seconds of grid loss</td></tr><tr><td>Safety</td><td>Surge protection devices</td><td>Installed and indicator showing ''healthy''</td></tr><tr><td>Performance</td><td>Real-time generation vs expected</td><td>Within 80–100% of design estimate (weather-dependent)</td></tr><tr><td>Monitoring</td><td>Inverter WiFi/app connectivity</td><td>Real-time data visible on monitoring app</td></tr></tbody></table><p>Your installer should walk you through each check and document the results. <a href=\"/in/solar-installation/checklist/\">Full installation checklist →</a></p>"
    },
    {
      "heading": "Inverter Configuration and Grid Sync",
      "body": "<p>The inverter requires precise configuration to work correctly with your DISCOM''s grid:</p><ul><li><strong>Grid parameters</strong> — Voltage range (typically 180–270V), frequency range (49.5–50.5 Hz), and reconnection delay (5 minutes after grid restoration) are set per DISCOM specifications.</li><li><strong>Power factor</strong> — Set to unity (1.0) for most Indian DISCOMs. Some states require adjustable reactive power support for larger systems.</li><li><strong>Export limit</strong> — If your DISCOM caps export capacity, the inverter is configured to limit AC output to the approved level.</li><li><strong>Monitoring setup</strong> — WiFi credentials are entered, and the inverter is registered on the manufacturer''s monitoring platform (Growatt ShineServer, Fronius Solar.web, etc.).</li><li><strong>Grid synchronisation</strong> — The inverter matches its output to the grid''s voltage and frequency before connecting. This happens automatically but is verified during commissioning.</li></ul><p>Incorrect inverter settings are a common cause of post-installation issues. Your installer configures these based on local DISCOM requirements — another reason <a href=\"/in/solar-installation/diy-vs-professional/\">professional installation</a> matters.</p>"
    },
    {
      "heading": "DISCOM Inspection and Approval",
      "body": "<p>The DISCOM sends an engineer to inspect your installation before activating net metering. This inspection verifies:</p><ul><li>Installed capacity matches the approved application</li><li>Panel and inverter specifications match the submitted datasheets</li><li>Anti-islanding protection is functional</li><li><a href=\"/in/solar-installation/safety/\">Safety devices</a> (isolators, SPDs, earthing) are installed and operational</li><li><a href=\"/in/solar-installation/wiring/\">Wiring</a> meets electrical safety standards</li><li>The system is physically installed as per the submitted layout</li></ul><p>After successful inspection, the DISCOM installs the bi-directional net meter and issues a commissioning certificate. This certificate is also required for <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a> disbursement.</p><p>Your installer coordinates the DISCOM visit and is present during the inspection to address any technical queries.</p>"
    },
    {
      "heading": "Documentation You Should Receive",
      "body": "<p>At handover, your installer should provide a complete documentation package:</p><ul><li><strong>Commissioning report</strong> — Test results for all checklist items with pass/fail status</li><li><strong>System design document</strong> — Panel layout, single-line diagram, cable sizing calculations</li><li><strong>Equipment warranties</strong> — Panel manufacturer warranty card (25 years), inverter warranty card (5–10 years), mounting structure warranty</li><li><strong>Datasheets</strong> — Technical specifications for panels, inverter, and key components</li><li><strong>DISCOM approvals</strong> — Copy of net metering application, feasibility approval, and commissioning certificate</li><li><strong>Monitoring credentials</strong> — Login details for the inverter''s monitoring app/portal</li><li><strong>Maintenance guide</strong> — Panel cleaning schedule, annual inspection checklist, emergency shutdown procedure</li><li><strong>Contact information</strong> — Installer''s service contact for warranty claims and maintenance</li></ul><p>Keep these documents safe — you will need the warranty cards for any future claims, and the commissioning certificate for subsidy processing.</p>"
    },
    {
      "heading": "What to Verify Before Signing Off",
      "body": "<p>Before you accept the system handover, personally verify these items:</p><ol><li><strong>Check the monitoring app</strong> — Confirm you can see real-time generation data on your phone. If the app shows zero generation during daytime, something is wrong.</li><li><strong>Verify all panels are generating</strong> — On the inverter display or app, check that each string shows voltage. A dead string means a panel or connection issue.</li><li><strong>Test the isolators</strong> — Ask the installer to demonstrate DC and AC isolator operation. You should know how to shut down the system in an emergency.</li><li><strong>Check physical installation</strong> — Walk around and visually inspect: panels secured firmly, cables in conduit (not loose), no exposed connections, inverter mounted level with ventilation space.</li><li><strong>Review the commissioning report</strong> — Ensure all test results are documented with actual measured values, not just ''pass'' checkmarks.</li><li><strong>Confirm net meter is active</strong> — Verify with your DISCOM or on the meter display that it is recording both import and export readings.</li></ol><p>If anything is incomplete, do not sign the handover until it is resolved. Your installer''s final payment and your subsidy disbursement are typically linked to successful commissioning.</p>"
    },
    {
      "heading": "Your System Is Now Live",
      "body": "<p>Once commissioning is complete, your rooftop solar system is officially generating clean energy and saving you money. The system runs automatically — the inverter starts at sunrise and shuts down at sunset with zero intervention needed.</p><p>Monitor your system''s performance weekly through the app for the first month, then monthly thereafter. If generation drops significantly without weather changes, contact your installer for a service check.</p><p>Ready to start your solar journey? Solar Vipani connects you with verified installers who handle everything — from <a href=\"/in/solar-installation/site-survey/\">site survey</a> to commissioning and beyond.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is solar system commissioning?",
      "answer": "Commissioning is the final phase of solar installation where the system is tested, verified, and activated. It includes electrical testing of DC and AC circuits, inverter configuration, grid synchronisation, safety device verification, and DISCOM inspection. It confirms everything works correctly before you start generating power."
    },
    {
      "question": "How long does solar commissioning take?",
      "answer": "The installer''s commissioning tests take 2–4 hours. The DISCOM inspection is a separate visit that takes 1–2 hours. Including net meter installation and paperwork, the entire commissioning phase typically completes within 1–3 days, though DISCOM scheduling may add waiting time."
    },
    {
      "question": "What documents should I receive after solar installation?",
      "answer": "You should receive a commissioning report with test results, system design documents, panel and inverter warranty cards, equipment datasheets, DISCOM approval copies, monitoring app credentials, a maintenance guide, and the installer''s service contact information. Keep these safe for warranty claims and subsidy processing."
    },
    {
      "question": "Can I reject the installation during commissioning?",
      "answer": "Yes. If commissioning tests reveal issues — underperformance, missing safety devices, incorrect wiring, or deviations from the agreed design — you should withhold sign-off until the installer resolves them. Final payment is typically linked to successful commissioning, giving you leverage to ensure quality."
    },
    {
      "question": "How do I know if my solar system is working correctly after commissioning?",
      "answer": "Check your inverter''s monitoring app — it should show real-time generation during daytime hours. For a 3kW system, expect 12–15 units per day in clear weather. If daily generation drops below 80% of expected without weather changes, contact your installer for a diagnostic check. Monthly DISCOM bills should also reflect reduced net consumption."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'commissioning' AND pillar_slug = 'solar-installation';

COMMIT;
