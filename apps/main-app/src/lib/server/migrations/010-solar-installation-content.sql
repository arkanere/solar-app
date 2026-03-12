-- Solar Installation Content: pillar + 2 cluster pages (cost, process)
-- Run: psql $POSTGRES_URL < 010-solar-installation-content.sql

BEGIN;

-- 1. PILLAR: solar-installation
UPDATE seo_pages SET
  h1 = 'Solar Installation in India: A Complete Guide for Homeowners',
  meta_title = 'Solar Installation India: Process, Cost & Checklist Guide | Solar Vipani',
  meta_description = 'Everything about solar panel installation — process, costs, timeline, and how to choose the right installer. Based on data from verified installers across India.',
  content = '[
    {
      "heading": "Why Getting Installation Right Matters",
      "body": "<p>A solar system is only as good as its installation. Poorly mounted panels, incorrect wiring, or sloppy DISCOM paperwork can slash your output by 20–30% and void your warranty. Solar Vipani''s network of verified installers across 500+ cities ensures every installation meets MNRE standards — from site survey to grid commissioning. Fill one form and get 2–3 quotes from vetted local professionals.</p>"
    },
    {
      "heading": "What Does Solar Installation Involve?",
      "body": "<p>Solar installation is the end-to-end process of converting your rooftop into a power plant. It covers site assessment, system design, procurement, physical mounting of panels and inverters, electrical wiring, DISCOM approvals, and grid synchronisation.</p><p>For a typical residential system (1kW–10kW), the entire process takes <strong>3–8 weeks</strong> from first enquiry to power generation — with the actual rooftop work completed in <strong>1–3 days</strong>. The bulk of the timeline is DISCOM paperwork and approvals, not physical installation.</p><p>A good installer handles everything: system sizing based on your bill, panel and inverter procurement, mounting structure design for your roof type, complete electrical work, DISCOM liaison for net metering, and post-commissioning support.</p>"
    },
    {
      "heading": "Solar Installation Cost in India",
      "body": "<p>Installation cost is bundled into your total system price — it is not a separate line item in most quotes. The all-inclusive cost for a residential rooftop solar system ranges from <strong>₹60,000 for 1kW to ₹6,50,000 for 10kW</strong> before subsidies.</p><p>Within this, installation labour and mounting structure account for roughly <strong>15–25%</strong> of the total cost. Complex roofs (multi-storey buildings, sloped tiles, parapet constraints) can push labour costs higher.</p><p>After PM Surya Ghar subsidy (up to ₹78,000 for 3kW), a typical 3kW system costs ₹1,15,000–₹1,40,000 out of pocket, fully installed.</p><p>→ <a href=\"/in/solar-installation/cost/\">Full guide: Solar Installation Cost Breakdown</a></p>"
    },
    {
      "heading": "The Solar Installation Process",
      "body": "<p>A professional solar installation follows six clear steps:</p><ol><li><strong>Site survey</strong> — Installer inspects your roof, measures available area, checks shading, assesses structural load capacity, and reviews your electricity bill.</li><li><strong>System design</strong> — Based on the survey, the installer designs array layout, selects panel/inverter combination, and specifies mounting structure.</li><li><strong>Procurement</strong> — Panels, inverter, mounting hardware, and electrical components are sourced. 3–7 day lead time.</li><li><strong>Physical installation</strong> — Mounting structure erected, panels mounted, inverter installed, wiring completed. Takes 1–3 days for residential systems.</li><li><strong>DISCOM approvals</strong> — Net metering application, inspection, bi-directional meter installation. This is the longest phase: 2–6 weeks depending on your DISCOM.</li><li><strong>Commissioning</strong> — System switched on, grid synchronisation verified, performance tested, handover to homeowner.</li></ol><p>→ <a href=\"/in/solar-installation/process/\">Full guide: Solar Installation Process Step by Step</a></p>"
    },
    {
      "heading": "Installation Timeline",
      "body": "<p>Understanding what takes how long helps you plan:</p><table><thead><tr><th>Phase</th><th>Duration</th><th>Who Handles It</th></tr></thead><tbody><tr><td>Site survey + design</td><td>1–3 days</td><td>Installer</td></tr><tr><td>Procurement</td><td>3–7 days</td><td>Installer</td></tr><tr><td>Physical installation</td><td>1–3 days</td><td>Installer crew</td></tr><tr><td>DISCOM application + approval</td><td>2–6 weeks</td><td>Installer (liaison)</td></tr><tr><td>Meter installation + commissioning</td><td>1–3 days</td><td>DISCOM + Installer</td></tr></tbody></table><p>Total: <strong>3–8 weeks</strong> from signing to generation. The physical rooftop work is the shortest part — DISCOM processing is the bottleneck.</p><p>→ <a href=\"/in/solar-installation/timeline/\">Full guide: Solar Installation Timeline</a></p>"
    },
    {
      "heading": "Pre-Installation Checklist",
      "body": "<p>Before signing with an installer, make sure these are sorted:</p><ul><li><strong>Roof ownership or society NOC</strong> — You need clear authority over your rooftop. Apartment dwellers need a housing society resolution.</li><li><strong>Electricity bill history</strong> — Last 6–12 months of bills help size the system correctly.</li><li><strong>Roof condition</strong> — Fix any leaks or structural issues before panels go up. Panels last 25 years; your roof should too.</li><li><strong>Shadow analysis</strong> — Note water tanks, taller buildings, trees that could shade your roof during peak hours (9 AM–3 PM).</li><li><strong>Budget clarity</strong> — Know your total budget including or excluding subsidy, and whether you want financing.</li></ul><p>→ <a href=\"/in/solar-installation/checklist/\">Full guide: Pre-Installation Checklist</a></p>"
    },
    {
      "heading": "How to Choose the Right Installer",
      "body": "<p>The installer you choose determines everything — system quality, warranty enforcement, after-sales support, and DISCOM paperwork speed. Here is what to look for:</p><ul><li><strong>MNRE empanelment</strong> — Only MNRE-registered channel partners can process government subsidy applications.</li><li><strong>Track record</strong> — Ask for 5+ recent installations in your area with customer references.</li><li><strong>Warranty clarity</strong> — Written warranty terms for panels (25 years), inverter (5–10 years), and workmanship (1–5 years).</li><li><strong>After-sales support</strong> — Maintenance contracts, monitoring setup, and response time for issues.</li><li><strong>Transparent quoting</strong> — Itemised quote including GST, net metering fees, and all components.</li></ul><p>Solar Vipani vets every installer for licensing, insurance, and installation quality before they join our platform.</p><p>→ <a href=\"/in/solar-installation/choosing-installer/\">Full guide: How to Choose a Solar Installer</a></p>"
    },
    {
      "heading": "Our Verified Installer Network",
      "body": "<p>Solar Vipani maintains a verified network of solar installers across India. Every installer is vetted for MNRE empanelment, valid licensing, insurance, and a track record of quality installations.</p><ul><li>Verified installers across 500+ districts</li><li>Coverage in 28 states and 8 union territories</li><li>Average residential system size: 3.2kW</li><li>All installers carry MNRE channel partner certification</li></ul><p>Fill one form and receive 2–3 competitive, comparable quotes from installers in your city — free, with no obligation.</p><p><a href=\"/in/get-quotes/\">Get free solar installation quotes →</a></p>"
    },
    {
      "heading": "Get Started with Your Solar Installation",
      "body": "<p>The best time to install solar was yesterday. The second-best time is now. With PM Surya Ghar subsidies, falling panel prices, and rising electricity tariffs, every month you delay costs you money in foregone savings.</p><p>Solar Vipani connects you with 2–3 verified local installers who will assess your roof, design the right system, and handle everything from procurement to commissioning.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How long does it take to install solar panels on a rooftop?",
      "answer": "The physical installation takes 1–3 days for a typical residential system (1kW–10kW). However, the complete process — from site survey to grid commissioning — takes 3–8 weeks. The longest phase is DISCOM approval for net metering, which can take 2–6 weeks depending on your state."
    },
    {
      "question": "Do I need permission to install solar panels in India?",
      "answer": "For on-grid systems, you need approval from your local DISCOM for net metering. Your installer typically handles this paperwork. No municipal building permission is needed for residential systems up to 10kW in most states. Apartment dwellers need a housing society resolution or NOC."
    },
    {
      "question": "How much does solar panel installation cost in India?",
      "answer": "Installation cost is included in the total system price: ₹60,000–₹6,50,000 before subsidy depending on system size (1kW–10kW). After PM Surya Ghar subsidy, a popular 3kW system costs ₹1,15,000–₹1,40,000 fully installed. Labour and mounting account for 15–25% of the total."
    },
    {
      "question": "What should I look for in a solar installer?",
      "answer": "Key criteria: MNRE empanelment (required for subsidy), 5+ recent local installations with references, written warranties for panels, inverter and workmanship, transparent itemised quoting including GST and net metering fees, and reliable after-sales support with a maintenance contract."
    },
    {
      "question": "Can solar panels be installed on any roof type?",
      "answer": "Yes — flat concrete (RCC), sloped tile, metal sheet, and tin roofs all support solar installation. Flat roofs use elevated tilt structures; sloped roofs use flush mounts. The roof must bear 15–20 kg per square metre of load. Very old or damaged roofs should be repaired first."
    },
    {
      "question": "What maintenance is needed after solar installation?",
      "answer": "Minimal maintenance is required. Clean panels with water every 2–4 weeks to remove dust. Have your installer do an annual check of wiring, earthing, and inverter performance. Most panels have a 25-year warranty and inverters last 10–15 years. <a href=\"/in/rooftop-solar/maintenance/\">Maintenance guide →</a>"
    }
  ]',
  updated_at = NOW()
WHERE slug = 'solar-installation' AND page_type = 'pillar';


-- 2. CLUSTER: cost
UPDATE seo_pages SET
  h1 = 'Solar Installation Cost in India 2026: Complete Price Breakdown',
  meta_title = 'Solar Installation Cost India 2026: Prices by Size, Component & State | Solar Vipani',
  meta_description = 'Solar installation costs ₹60,000–₹6,50,000 before subsidy. See detailed cost breakdown by system size, components, roof type, and state. Based on real installer quotes.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A complete <a href=\"/in/solar-installation/\">solar installation</a> in India costs <strong>₹55–₹75 per watt</strong> all-inclusive before subsidy — or <strong>₹60,000 for a 1kW system to ₹6,50,000 for 10kW</strong>. After the PM Surya Ghar central subsidy (up to ₹78,000 for 3kW), a popular 3kW residential system costs <strong>₹1,15,000–₹1,40,000</strong> out of pocket. This includes panels, inverter, mounting, wiring, labour, and DISCOM paperwork.</p>"
    },
    {
      "heading": "Solar Installation Cost by System Size",
      "body": "<p>System size is the biggest cost driver. Here are current market prices based on quotes from verified installers:</p><table><thead><tr><th>System Size</th><th>Total Cost (before subsidy)</th><th>PM Surya Ghar Subsidy</th><th>Your Cost (after subsidy)</th></tr></thead><tbody><tr><td>1kW</td><td>₹60,000–₹80,000</td><td>₹30,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2kW</td><td>₹1,10,000–₹1,40,000</td><td>₹60,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3kW</td><td>₹1,50,000–₹1,90,000</td><td>₹78,000</td><td>₹72,000–₹1,12,000</td></tr><tr><td>5kW</td><td>₹2,50,000–₹3,20,000</td><td>₹78,000</td><td>₹1,72,000–₹2,42,000</td></tr><tr><td>10kW</td><td>₹5,00,000–₹6,50,000</td><td>₹78,000</td><td>₹4,22,000–₹5,72,000</td></tr></tbody></table><p><em>Prices for on-grid systems with monocrystalline panels. Includes GST, installation, and net metering. Vary by location and installer.</em></p><p>For system-specific guides: <a href=\"/in/rooftop-solar/1kw-system/\">1kW</a> · <a href=\"/in/rooftop-solar/2kw-system/\">2kW</a> · <a href=\"/in/rooftop-solar/3kw-system/\">3kW</a> · <a href=\"/in/rooftop-solar/5kw-system/\">5kW</a> · <a href=\"/in/rooftop-solar/10kw-system/\">10kW</a></p>"
    },
    {
      "heading": "Cost Breakdown by Component",
      "body": "<p>Here is where your money goes in a typical 3kW residential installation:</p><table><thead><tr><th>Component</th><th>Share of Total Cost</th><th>Approx. Amount (3kW)</th></tr></thead><tbody><tr><td>Solar panels</td><td>40–50%</td><td>₹60,000–₹85,000</td></tr><tr><td>Inverter</td><td>20–25%</td><td>₹30,000–₹45,000</td></tr><tr><td>Mounting structure</td><td>10–15%</td><td>₹15,000–₹25,000</td></tr><tr><td>Wiring &amp; electrical</td><td>5–8%</td><td>₹8,000–₹15,000</td></tr><tr><td>Installation labour</td><td>5–10%</td><td>₹8,000–₹18,000</td></tr><tr><td>Net metering &amp; approvals</td><td>2–5%</td><td>₹3,000–₹8,000</td></tr></tbody></table><p>The two biggest cost decisions are <a href=\"/in/solar-panels/price/\">panel type</a> (mono vs poly vs bifacial) and <a href=\"/in/rooftop-solar/inverter/\">inverter type</a> (string vs micro vs hybrid). Choosing monocrystalline panels with a reliable string inverter offers the best cost-to-performance ratio for most homes.</p>"
    },
    {
      "heading": "What Affects Installation Labour Cost?",
      "body": "<p>Labour cost varies based on several factors specific to your property:</p><ul><li><strong>Roof type</strong> — Flat RCC roofs are simplest and cheapest. Sloped tile roofs need specialised clamps. Metal sheet roofs require specific fasteners. Each adds ₹2,000–₹5,000 per kW.</li><li><strong>Building height</strong> — Multi-storey buildings require more cable, additional safety equipment, and longer installation time. Expect 10–20% premium over single-storey.</li><li><strong>Roof condition</strong> — If the mounting area needs waterproofing repair or structural reinforcement, that is an additional cost before solar work begins.</li><li><strong>Shadow obstacles</strong> — Water tanks, parapet walls, or adjacent buildings requiring creative panel placement increase design and labour time.</li><li><strong>City tier</strong> — Metro cities (Delhi, Mumbai, Bangalore) have higher labour rates than Tier 2–3 cities. Difference can be 10–15%.</li></ul><p>A <a href=\"/in/solar-installation/checklist/\">pre-installation checklist</a> helps identify these factors early so there are no surprises in the final quote.</p>"
    },
    {
      "heading": "Hidden Costs to Watch For",
      "body": "<p>A transparent installer will itemise everything. But if you are comparing quotes, check for these commonly excluded items:</p><ol><li><strong>GST (13.8%)</strong> — Composite supply of panels + inverter + installation attracts 13.8% GST. Some quotes show pre-GST pricing to appear cheaper.</li><li><strong>Net metering fees</strong> — DISCOM application fees and bi-directional meter cost range from ₹2,000–₹8,000 depending on your state. Not always included.</li><li><strong>Elevated mounting</strong> — If your roof is flat, standard tilt structures are included. But if you need elevated mounting (for parapet walls or waterproofing access), it costs extra.</li><li><strong>Earthing and lightning arrestor</strong> — Basic earthing is standard. Full lightning protection for larger systems (5kW+) may cost ₹3,000–₹5,000 additional.</li><li><strong>Cable length</strong> — Standard quotes assume the inverter is near the panels. If your meter room is far from the roof, additional DC/AC cabling adds ₹1,000–₹3,000.</li></ol><p>Always ask: <em>Is this quote all-inclusive with GST, net metering, and mounting for my specific roof type?</em></p>"
    },
    {
      "heading": "How Subsidies Reduce Installation Cost",
      "body": "<p>The <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> (2024–2027) provides direct financial assistance to residential consumers:</p><table><thead><tr><th>System Capacity</th><th>Subsidy Rate</th><th>Total Subsidy</th></tr></thead><tbody><tr><td>Up to 2kW</td><td>₹30,000 per kW</td><td>Up to ₹60,000</td></tr><tr><td>2kW to 3kW</td><td>₹18,000 per kW (additional)</td><td>Up to ₹78,000</td></tr><tr><td>Above 3kW</td><td>No additional subsidy</td><td>Capped at ₹78,000</td></tr></tbody></table><p><strong>Eligibility conditions:</strong> On-grid system only. Installed by MNRE-empanelled vendor. One subsidy per household. Credited to your bank account after DISCOM inspection and commissioning.</p><p>Some states provide additional top-up subsidies. <a href=\"/in/solar-subsidy/state-wise/\">Check your state subsidy →</a></p>"
    },
    {
      "heading": "Cost Comparison: DIY vs Professional Installation",
      "body": "<p>Can you save by sourcing components and hiring labour yourself?</p><table><thead><tr><th>Factor</th><th>Professional Installer</th><th>DIY / Self-Procured</th></tr></thead><tbody><tr><td>Total cost</td><td>₹55–₹75/W</td><td>₹45–₹60/W</td></tr><tr><td>Subsidy eligibility</td><td>Yes (MNRE empanelled)</td><td>Usually no</td></tr><tr><td>Warranty enforcement</td><td>Single point of contact</td><td>You manage each vendor</td></tr><tr><td>DISCOM paperwork</td><td>Handled by installer</td><td>You handle it</td></tr><tr><td>After-sales support</td><td>Included</td><td>None</td></tr></tbody></table><p>The apparent 15–20% saving from DIY vanishes once you lose the ₹78,000 subsidy. For most homeowners, a verified professional installer is the better choice. <a href=\"/in/solar-installation/choosing-installer/\">How to choose the right installer →</a></p>"
    },
    {
      "heading": "Financing Your Solar Installation",
      "body": "<p>If the upfront cost is a barrier, several financing options make solar accessible:</p><ul><li><strong><a href=\"/in/solar-financing/solar-loan/\">Solar loans</a></strong> — Banks like SBI, HDFC, and Canara Bank offer dedicated solar loans at 7–10% interest with tenures of 3–7 years.</li><li><strong><a href=\"/in/solar-financing/emi/\">EMI plans</a></strong> — Many installers offer zero-cost or low-cost EMI through NBFC partnerships. Monthly payments of ₹2,000–₹5,000 for a 3kW system.</li><li><strong>Subsidy + loan combination</strong> — You can use PM Surya Ghar subsidy along with a bank loan. The subsidy reduces your loan principal once disbursed.</li></ul><p>→ <a href=\"/in/tools/emi-calculator/\">Calculate your EMI with our solar EMI calculator</a></p>"
    },
    {
      "heading": "Get an Accurate Installation Quote",
      "body": "<p>Online estimates give you a range. For an accurate cost specific to your roof, location, and energy needs, you need quotes from local installers.</p><p>Solar Vipani connects you with 2–3 verified installers in your city who will survey your roof and provide detailed, comparable quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free solar installation quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the total cost of a 3kW solar installation in India?",
      "answer": "A complete 3kW solar installation costs ₹1,50,000–₹1,90,000 before subsidy. After the PM Surya Ghar subsidy of ₹78,000, your out-of-pocket cost is ₹72,000–₹1,12,000. This includes panels, inverter, mounting, wiring, labour, DISCOM paperwork, and GST."
    },
    {
      "question": "Is solar installation cost separate from panel cost?",
      "answer": "No. Most solar installers provide an all-inclusive quote that bundles panels, inverter, mounting structure, wiring, labour, and DISCOM approvals. Installation labour and mounting typically account for 15–25% of the total system cost."
    },
    {
      "question": "How much does solar installation labour cost in India?",
      "answer": "Installation labour ranges from ₹5,000–₹18,000 depending on system size, roof type, and building height. For a typical 3kW system on a flat RCC roof, labour costs ₹8,000–₹12,000. Multi-storey buildings and complex roof types cost more."
    },
    {
      "question": "Does the quoted price include GST and net metering?",
      "answer": "It depends on the installer. Always confirm. A transparent quote includes 13.8% GST (composite supply) and DISCOM net metering fees (₹2,000–₹8,000). Some installers show pre-GST prices to appear cheaper. Ask: Is this all-inclusive?"
    },
    {
      "question": "Can I reduce solar installation cost with a subsidy?",
      "answer": "Yes. Under PM Surya Ghar, homeowners get up to ₹78,000 subsidy for systems up to 3kW. The subsidy is credited to your bank account after installation and DISCOM inspection. Only on-grid systems installed by MNRE-registered vendors qualify."
    },
    {
      "question": "Is DIY solar installation cheaper than hiring a professional?",
      "answer": "DIY can save 15–20% on component costs but you lose the ₹78,000 government subsidy (requires MNRE-empanelled installer), warranty enforcement becomes fragmented, and you must handle DISCOM paperwork yourself. For most homeowners, professional installation offers better overall value."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'cost' AND pillar_slug = 'solar-installation';


-- 3. CLUSTER: process
UPDATE seo_pages SET
  h1 = 'Solar Panel Installation Process: Step-by-Step Guide for Indian Homes',
  meta_title = 'Solar Installation Process India: 6-Step Guide from Survey to Commissioning | Solar Vipani',
  meta_description = 'Complete step-by-step guide to solar panel installation in India — site survey, design, mounting, wiring, DISCOM approval, and commissioning. Know what to expect at each stage.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The <a href=\"/in/solar-installation/\">solar installation</a> process follows six stages: site survey, system design, procurement, physical installation, DISCOM approval, and commissioning. The physical rooftop work takes <strong>1–3 days</strong>. The full process from first enquiry to power generation takes <strong>3–8 weeks</strong>, with DISCOM paperwork being the longest phase.</p>"
    },
    {
      "heading": "Step 1: Site Survey and Roof Assessment",
      "body": "<p>Every professional installation starts with an on-site survey. The installer visits your home to assess:</p><ul><li><strong>Roof area</strong> — Usable space after excluding water tanks, lift rooms, satellite dishes, and setback areas. You need roughly 100 sq ft per kW.</li><li><strong>Roof type and condition</strong> — RCC flat, sloped tiles, metal sheet — each needs a different mounting approach. The roof must be structurally sound for 25+ years.</li><li><strong>Shadow analysis</strong> — Trees, adjacent buildings, parapet walls, and water tanks that cast shadows during peak hours (9 AM–3 PM) reduce output. The installer maps shadow-free zones.</li><li><strong>Structural load</strong> — Solar systems add 15–20 kg per sq metre. The installer confirms your roof can handle this load, especially for older buildings.</li><li><strong>Electrical infrastructure</strong> — Existing meter location, main switchboard position, earthing quality, and cable routing path from roof to meter.</li></ul><p>A thorough survey takes 30–60 minutes. Based on this, the installer designs your system. Avoid installers who quote without visiting your roof — they cannot account for site-specific factors.</p>"
    },
    {
      "heading": "Step 2: System Design and Quotation",
      "body": "<p>Using survey data and your electricity bill, the installer creates a system design:</p><ul><li><strong>System sizing</strong> — Matched to your average monthly consumption. A 3kW system suits homes using 300–450 units/month. <a href=\"/in/tools/solar-calculator/\">Calculate your ideal size →</a></li><li><strong>Panel layout</strong> — Orientation (south-facing in India for maximum output), tilt angle (10–15° for most locations), and row spacing to avoid inter-row shading.</li><li><strong>Component selection</strong> — Panel brand and wattage, inverter type and capacity, mounting structure material (GI or aluminium), cable specifications.</li><li><strong>Electrical design</strong> — String configuration (panels in series/parallel), DC/AC cable sizing, protection devices, and earthing scheme.</li></ul><p>You receive an itemised quotation covering all components, labour, GST, DISCOM fees, and warranties. Compare at least 2–3 quotes before deciding. The <a href=\"/in/solar-installation/cost/\">installation cost guide</a> explains what each line item should include.</p>"
    },
    {
      "heading": "Step 3: Procurement and Scheduling",
      "body": "<p>Once you approve the quote and make an advance payment (typically 30–50%), the installer procures components:</p><ul><li><strong>Solar panels</strong> — Delivered from distributor or manufacturer. Verify the brand and wattage match your quote. Check for physical damage on delivery.</li><li><strong>Inverter</strong> — Sourced from brand distributor. Confirm model matches specifications in your quote.</li><li><strong>Mounting structure</strong> — Fabricated or sourced based on your roof type. Hot-dip galvanised iron (GI) structures resist corrosion better than painted steel.</li><li><strong>Electrical components</strong> — DC/AC cables, junction box, MCBs, SPDs, earthing kit, distribution board.</li></ul><p>Procurement takes <strong>3–7 days</strong> for standard components. Premium or less common brands may take longer. The installer schedules a specific installation date once materials arrive.</p>"
    },
    {
      "heading": "Step 4: Physical Installation (Day 1–3)",
      "body": "<p>This is when your roof transforms into a power plant. Here is the typical day-by-day sequence for a 3kW system:</p><p><strong>Day 1 — Mounting structure:</strong></p><ul><li>Mark drill points on roof based on panel layout</li><li>Drill and fix base plates or channel frames</li><li>Erect tilt structures at the designed angle</li><li>Level and align all rails for uniform panel seating</li></ul><p><strong>Day 1–2 — Panel mounting and wiring:</strong></p><ul><li>Mount panels onto rails using mid and end clamps</li><li>Connect panel MC4 connectors in the designed string configuration</li><li>Route DC cables from panel array to inverter location</li><li>Install DC junction box and isolator near the array</li></ul><p><strong>Day 2–3 — Inverter and electrical:</strong></p><ul><li>Mount inverter on wall (shaded, ventilated location)</li><li>Connect DC input from panels to inverter</li><li>Connect AC output from inverter to distribution board</li><li>Install earthing for panels, mounting structure, and inverter</li><li>Install surge protection devices (SPDs) on both DC and AC side</li><li>Run AC cable from distribution board to meter point</li></ul><p>The installation crew is typically 3–5 people. They should leave your roof clean, with cable management tidy and all penetrations sealed.</p>"
    },
    {
      "heading": "Step 5: DISCOM Approval and Net Metering",
      "body": "<p>This is the paperwork-heavy phase and the longest part of the process:</p><ol><li><strong>Application submission</strong> — Your installer submits the net metering application to your DISCOM (e.g., MSEDCL, BESCOM, TPDDL) along with required documents: ID proof, electricity bill, roof ownership proof, system specifications, and installer MNRE registration.</li><li><strong>Technical feasibility check</strong> — DISCOM verifies that your local transformer and feeder can handle the additional solar capacity. Most residential systems (up to 10kW) clear this easily.</li><li><strong>DISCOM inspection</strong> — An inspector visits to verify the installation matches the application. They check panel capacity, inverter specifications, earthing, and safety compliance.</li><li><strong>Meter replacement</strong> — DISCOM installs a bi-directional (import-export) meter, replacing your existing meter. The meter records both grid consumption and solar export.</li></ol><p>Timeline: <strong>2–6 weeks</strong> depending on DISCOM efficiency. Maharashtra (MSEDCL) averages 3–4 weeks. Karnataka (BESCOM) averages 2–3 weeks. Delhi DISCOMs average 4–6 weeks.</p><p>Your installer should handle all DISCOM liaison as part of their scope. If they charge extra for this, factor it into your <a href=\"/in/solar-installation/cost/\">cost comparison</a>.</p>"
    },
    {
      "heading": "Step 6: Commissioning and Handover",
      "body": "<p>The final step before your system starts generating:</p><ul><li><strong>System switch-on</strong> — After the bi-directional meter is installed, the installer energises the system and verifies grid synchronisation.</li><li><strong>Performance verification</strong> — Check that output matches expected generation for the time of day and weather conditions. A 3kW system should show 2–2.5kW peak output around noon on a clear day.</li><li><strong>Monitoring setup</strong> — Most modern inverters come with WiFi-based monitoring. The installer configures the app so you can track daily generation, consumption, and export in real time.</li><li><strong>Documentation handover</strong> — You should receive: panel and inverter warranty cards, DISCOM approval letter, commissioning certificate, system design document, and maintenance guide.</li><li><strong>Final payment</strong> — Remaining balance (50–70%) is typically due at commissioning. Some installers link final payment to subsidy disbursement.</li></ul><p>After commissioning, apply for your <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a> through the national portal. The subsidy is credited to your bank account within 30–60 days of approved commissioning.</p>"
    },
    {
      "heading": "Common Installation Mistakes to Avoid",
      "body": "<p>Learn from others'' experience — these mistakes are common and costly:</p><ol><li><strong>Skipping the site survey</strong> — Accepting a phone-based quote without a physical visit leads to sizing errors and unexpected costs.</li><li><strong>Ignoring shadow analysis</strong> — Even partial shading on one panel can reduce output of the entire string by 30–50%. Proper shadow mapping is non-negotiable.</li><li><strong>Choosing on price alone</strong> — The cheapest quote often uses lower-grade components. Ask for brand specifications and verify warranty terms. <a href=\"/in/solar-installation/choosing-installer/\">How to vet an installer →</a></li><li><strong>Poor cable management</strong> — Exposed, unsecured cables degrade faster and create fire risk. Insist on conduit protection and proper cable ties.</li><li><strong>Not confirming DISCOM scope</strong> — Ensure your installer handles DISCOM paperwork end-to-end. If you have to do it yourself, the timeline can double.</li></ol>"
    },
    {
      "heading": "Ready to Start Your Installation?",
      "body": "<p>Understanding the process is the first step. The next step is getting quotes from verified professionals who will manage every phase — from survey to commissioning.</p><p>Solar Vipani connects you with 2–3 verified local installers. Fill one form, compare transparent quotes, and go solar with confidence.</p><p><a href=\"/in/get-quotes/\">Get your free solar installation quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How many days does solar panel installation take?",
      "answer": "Physical installation on your rooftop takes 1–3 days for a typical residential system (1kW–10kW). A 3kW system is usually completed in 2 days. The installation crew (3–5 people) handles mounting, panel placement, wiring, and inverter setup during this time."
    },
    {
      "question": "What is the complete solar installation timeline from start to finish?",
      "answer": "The full process takes 3–8 weeks: site survey (1–3 days), procurement (3–7 days), physical installation (1–3 days), DISCOM approval and meter installation (2–6 weeks). DISCOM processing is the longest phase and varies by state."
    },
    {
      "question": "Do I need to be home during solar installation?",
      "answer": "Yes, it is recommended to be present on the first day (for mounting and access coordination) and the final day (for system handover and testing). During intermediate work, you can designate a family member to provide roof access to the installation crew."
    },
    {
      "question": "What documents are needed for solar installation and net metering?",
      "answer": "You typically need: recent electricity bill, ID and address proof, roof ownership proof or housing society NOC (for apartments), passport-size photos, and a cancelled cheque for subsidy disbursement. Your installer prepares the technical documents."
    },
    {
      "question": "Can solar be installed on a rented property?",
      "answer": "Technically yes, but you need the property owner''s written consent and their electricity consumer details for net metering. The subsidy is linked to the consumer number, not the property owner. Most tenants find it impractical due to the 4–6 year payback period."
    },
    {
      "question": "What happens after solar installation is complete?",
      "answer": "After DISCOM installs the bi-directional meter, your system starts generating and exporting surplus to the grid. Apply for your PM Surya Ghar subsidy through the national portal. Set up inverter monitoring via the manufacturer app. Schedule your first panel cleaning after 4–6 weeks."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'process' AND pillar_slug = 'solar-installation';

COMMIT;
