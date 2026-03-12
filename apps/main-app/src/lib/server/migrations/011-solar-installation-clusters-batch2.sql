-- Solar Installation Clusters Batch 2: timeline, checklist, choosing-installer
-- Run: psql $POSTGRES_URL < 011-solar-installation-clusters-batch2.sql

BEGIN;

-- 1. CLUSTER: timeline
UPDATE seo_pages SET
  h1 = 'Solar Installation Timeline in India: How Long Does It Really Take?',
  meta_title = 'Solar Installation Timeline India: Phase-by-Phase Duration Guide | Solar Vipani',
  meta_description = 'Solar installation takes 3–8 weeks total but only 1–3 days of rooftop work. See the realistic timeline for each phase — survey, procurement, installation, and DISCOM approval.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A complete <a href=\"/in/solar-installation/\">solar installation</a> takes <strong>3–8 weeks</strong> from first enquiry to power generation. The physical rooftop work is done in <strong>1–3 days</strong>. The longest phase is DISCOM approval for net metering, which takes <strong>2–6 weeks</strong> depending on your state. Here is the full phase-by-phase breakdown.</p>"
    },
    {
      "heading": "Phase-by-Phase Timeline Overview",
      "body": "<table><thead><tr><th>Phase</th><th>Duration</th><th>What Happens</th></tr></thead><tbody><tr><td>1. Site survey</td><td>1–2 days</td><td>Installer visits roof, measures area, checks shadows, reviews your bill</td></tr><tr><td>2. Quote and approval</td><td>2–5 days</td><td>Receive quote, compare with other installers, confirm order</td></tr><tr><td>3. Procurement</td><td>3–7 days</td><td>Panels, inverter, mounting structure, and electrical components sourced</td></tr><tr><td>4. Physical installation</td><td>1–3 days</td><td>Mounting, panel placement, wiring, inverter setup</td></tr><tr><td>5. DISCOM application</td><td>1–3 days</td><td>Net metering application submitted with documents</td></tr><tr><td>6. DISCOM processing</td><td>2–6 weeks</td><td>Feasibility check, inspection, meter replacement</td></tr><tr><td>7. Commissioning</td><td>1 day</td><td>System switched on, grid sync verified, monitoring configured</td></tr></tbody></table><p><strong>Total: 3–8 weeks</strong>. The wide range is almost entirely due to DISCOM processing speed, which varies dramatically by state.</p>"
    },
    {
      "heading": "Site Survey: Days 1–2",
      "body": "<p>The installer visits your home to assess the roof and design the system. This typically happens within 1–2 days of your enquiry. The survey itself takes 30–60 minutes.</p><p>What the installer evaluates:</p><ul><li>Usable roof area (after excluding tanks, lift rooms, setbacks)</li><li>Shadow patterns from nearby structures and trees</li><li>Roof type, age, and structural condition</li><li>Electrical infrastructure: meter location, switchboard, earthing</li><li>Your electricity consumption pattern from recent bills</li></ul><p>After the survey, expect a detailed quotation within 1–3 days. A good practice is to get 2–3 quotes for comparison. <a href=\"/in/solar-installation/choosing-installer/\">How to compare installer quotes →</a></p>"
    },
    {
      "heading": "Procurement: Days 5–12",
      "body": "<p>Once you approve a quote and pay the advance (typically 30–50%), the installer procures components. Standard timeline:</p><ul><li><strong>Solar panels</strong> — 2–5 days from distributor. Popular brands like Tata, Waaree, and Adani are usually available ex-stock.</li><li><strong>Inverter</strong> — 2–4 days. Growatt, Havells, and ABB models are widely stocked.</li><li><strong>Mounting structure</strong> — 3–7 days. Often fabricated to order for your specific roof type and panel count.</li><li><strong>Electrical components</strong> — 1–2 days. Standard items available at electrical distributors.</li></ul><p>Delays can occur with premium or less common brands — confirm lead times before placing your order. Tier 1 panel brands generally have better supply chain reliability.</p>"
    },
    {
      "heading": "Physical Installation: Days 12–15",
      "body": "<p>This is the most visible phase — when panels actually go up on your roof. For a typical 3kW residential system:</p><p><strong>Day 1:</strong> Mounting structure erected. Base plates drilled and fixed, tilt rails assembled, levelling completed. Cable conduit path prepared from roof to inverter location.</p><p><strong>Day 2:</strong> Panels mounted on rails. DC wiring completed (panel strings to junction box to inverter). Inverter mounted and connected. AC wiring from inverter to distribution board.</p><p><strong>Day 3 (if needed):</strong> Earthing installed. Surge protection devices fitted. Cable management tidied. System tested in standalone mode. Site cleanup.</p><p>Larger systems (5kW–10kW) may take an extra day. The installation crew is typically 3–5 people. You should be present on Day 1 (for access coordination) and the final day (for verification).</p><p>Learn the detailed <a href=\"/in/solar-installation/process/\">installation process step by step →</a></p>"
    },
    {
      "heading": "DISCOM Approval: The Bottleneck (Weeks 3–8)",
      "body": "<p>Net metering approval is the longest and most variable phase. Here is what happens and how long it takes by major DISCOM:</p><table><thead><tr><th>DISCOM</th><th>State</th><th>Typical Timeline</th></tr></thead><tbody><tr><td>BESCOM</td><td>Karnataka</td><td>2–3 weeks</td></tr><tr><td>MSEDCL</td><td>Maharashtra</td><td>3–4 weeks</td></tr><tr><td>TPDDL / BSES</td><td>Delhi</td><td>4–6 weeks</td></tr><tr><td>UGVCL / MGVCL</td><td>Gujarat</td><td>2–4 weeks</td></tr><tr><td>TANGEDCO</td><td>Tamil Nadu</td><td>3–5 weeks</td></tr><tr><td>APSPDCL</td><td>Andhra Pradesh</td><td>3–4 weeks</td></tr></tbody></table><p>The process involves: application submission → feasibility check → physical inspection → meter procurement → meter installation. Your installer handles the liaison, but you may need to be present for the DISCOM inspection (30-minute visit).</p><p><strong>Tip:</strong> Ask your installer about their average DISCOM processing time in your area. Experienced installers with good DISCOM relationships get approvals faster.</p>"
    },
    {
      "heading": "Commissioning: The Final Day",
      "body": "<p>Once the bi-directional meter is installed by DISCOM, commissioning happens immediately or within 1–2 days:</p><ol><li><strong>System energisation</strong> — Installer switches on the system and verifies grid synchronisation. The inverter display should show active power generation.</li><li><strong>Output verification</strong> — Check real-time output against expected values. A 3kW system should show 2–2.5kW around noon on a clear day.</li><li><strong>Monitoring setup</strong> — Configure the inverter''s WiFi monitoring app on your phone. This lets you track daily generation, consumption, and grid export.</li><li><strong>Documentation</strong> — Receive warranty cards, commissioning certificate, DISCOM approval letter, and maintenance guide.</li><li><strong>Subsidy application</strong> — Your installer helps you apply for <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a> through the national portal. Subsidy is credited within 30–60 days.</li></ol><p>From this day forward, your panels generate power and your meter tracks the savings.</p>"
    },
    {
      "heading": "How to Speed Up Your Installation Timeline",
      "body": "<p>Several factors are within your control:</p><ul><li><strong>Have documents ready</strong> — Electricity bill, ID proof, roof ownership proof, society NOC (if apartment). Missing documents delay DISCOM application. See our <a href=\"/in/solar-installation/checklist/\">pre-installation checklist →</a></li><li><strong>Choose an experienced local installer</strong> — Installers with strong DISCOM relationships and a track record in your area navigate approvals faster.</li><li><strong>Decide quickly on quotes</strong> — The comparison phase is in your hands. Two weeks of indecision adds two weeks to your timeline.</li><li><strong>Fix roof issues in advance</strong> — Waterproofing, structural repairs, or removing obstacles should happen before the installation date, not during it.</li><li><strong>Be available for the DISCOM inspection</strong> — Missed inspection dates can push your timeline by another 1–2 weeks.</li></ul>"
    },
    {
      "heading": "Start Your Solar Journey Today",
      "body": "<p>The sooner you start, the sooner you save. Every month of delay is a month of electricity bills you could have offset with solar.</p><p>Solar Vipani connects you with 2–3 verified local installers who manage the entire timeline — from survey to commissioning — so you can focus on your savings.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How long does solar panel installation take in India?",
      "answer": "The physical rooftop installation takes 1–3 days for residential systems (1kW–10kW). The complete process from enquiry to power generation takes 3–8 weeks, with DISCOM net metering approval being the longest phase at 2–6 weeks depending on your state."
    },
    {
      "question": "Why does DISCOM approval take so long?",
      "answer": "DISCOM approval involves multiple steps: application review, technical feasibility check, physical inspection, meter procurement, and meter installation. Each step involves different teams within the DISCOM. Processing efficiency varies by state — Karnataka averages 2–3 weeks while Delhi can take 4–6 weeks."
    },
    {
      "question": "Can I use solar power before DISCOM approval?",
      "answer": "Technically, your system can generate power once physically installed. However, without the bi-directional meter, any surplus exported to the grid will not earn credits. Most installers advise waiting for commissioning to avoid metering disputes. Off-grid systems with batteries can be used immediately."
    },
    {
      "question": "How can I speed up my solar installation?",
      "answer": "Keep documents ready (bill, ID, roof proof, society NOC), choose an installer with strong local DISCOM relationships, decide on quotes within a few days, fix any roof issues before the installation date, and be available for the DISCOM inspection to avoid rescheduling delays."
    },
    {
      "question": "What is the best time of year to install solar panels?",
      "answer": "Solar panels can be installed any time of year. However, the dry season (October–March) is preferred because installation crews work more efficiently without rain delays. Systems installed before summer (March–June) maximise first-year generation during peak solar months."
    },
    {
      "question": "How long does the PM Surya Ghar subsidy take to arrive?",
      "answer": "After successful commissioning and application through the national portal, the PM Surya Ghar subsidy is typically credited to your bank account within 30–60 days. Processing times may vary by state nodal agency efficiency."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'timeline' AND pillar_slug = 'solar-installation';


-- 2. CLUSTER: checklist
UPDATE seo_pages SET
  h1 = 'Solar Installation Checklist: 15 Things to Verify Before Going Solar',
  meta_title = 'Solar Installation Checklist India: Pre-Installation Verification Guide | Solar Vipani',
  meta_description = 'Complete pre-installation checklist for rooftop solar in India. 15 items to verify — from roof assessment to documents to installer vetting. Avoid costly mistakes.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Before your <a href=\"/in/solar-installation/\">solar installation</a> begins, verify three things: your roof is ready (structurally sound, shadow-free, adequate area), your documents are complete (electricity bill, ID, roof ownership proof), and your installer is qualified (MNRE-empanelled, transparent quoting, strong references). This checklist covers every item in detail.</p>"
    },
    {
      "heading": "Roof Readiness Checklist",
      "body": "<p>Your roof will carry solar panels for 25+ years. Make sure it is ready:</p><ol><li><strong>Structural integrity</strong> — Roof must support 15–20 kg per sq metre additional load. For older buildings (20+ years), get a structural assessment. Repair cracks, leaks, or spalling concrete before installation.</li><li><strong>Waterproofing</strong> — If your roof needs waterproofing treatment, do it before panels go up. Removing panels later for waterproofing is expensive and voids mounting warranty.</li><li><strong>Available area</strong> — You need approximately 100 sq ft per kW. A 3kW system needs ~300 sq ft of shadow-free space. Measure your usable area after excluding water tanks, lift rooms, staircase heads, and DISCOM-mandated setbacks.</li><li><strong>Shadow analysis</strong> — Check for shadows from water tanks, taller adjacent buildings, trees, and parapet walls between 9 AM and 3 PM. Even partial shading on one panel reduces the output of the entire string.</li><li><strong>Roof access</strong> — Ensure safe access to the roof for installation crews and future maintenance. If the only access is through a narrow hatch, discuss logistics with the installer beforehand.</li></ol>"
    },
    {
      "heading": "Electrical Infrastructure Checklist",
      "body": "<p>Your existing electrical setup must support the solar system:</p><ol><li><strong>Electricity connection type</strong> — Confirm you have a single-phase or three-phase connection. Systems above 5kW typically require three-phase. If you need an upgrade, apply to your DISCOM before solar installation — this can take 2–4 weeks.</li><li><strong>Meter location</strong> — The bi-directional meter replaces your existing meter. Note the distance from your rooftop to the meter — longer cable runs increase cost and signal loss.</li><li><strong>Earthing quality</strong> — Good earthing is essential for safety and inverter performance. If your existing earthing is poor (common in older buildings), budget for a new earth pit. Cost: ₹3,000–₹5,000.</li><li><strong>Main switchboard capacity</strong> — Your switchboard must have space for additional MCBs (miniature circuit breakers) for the solar circuit. Older boards may need upgrading.</li></ol><p>A professional installer assesses all of this during the <a href=\"/in/solar-installation/process/\">site survey</a>. But knowing what to expect helps you prepare.</p>"
    },
    {
      "heading": "Documents Checklist",
      "body": "<p>Gather these before your installer submits the DISCOM application:</p><table><thead><tr><th>Document</th><th>Purpose</th><th>Where to Get It</th></tr></thead><tbody><tr><td>Latest electricity bill</td><td>Consumer number, sanctioned load, DISCOM identification</td><td>Your DISCOM portal or physical bill</td></tr><tr><td>Aadhaar card / PAN card</td><td>Identity verification for subsidy</td><td>—</td></tr><tr><td>Address proof</td><td>Matches electricity bill address</td><td>Aadhaar, passport, or utility bill</td></tr><tr><td>Roof ownership proof</td><td>Confirms right to install</td><td>Property tax receipt, sale deed, or society NOC</td></tr><tr><td>Passport-size photos (2)</td><td>DISCOM application form</td><td>—</td></tr><tr><td>Cancelled cheque / bank passbook</td><td>Subsidy disbursement account</td><td>Your bank</td></tr><tr><td>Housing society NOC (apartments only)</td><td>Society approval for rooftop use</td><td>Society secretary/chairman</td></tr></tbody></table><p>Missing documents are the most common cause of DISCOM application delays. Having everything ready before installation day can save 1–2 weeks on your <a href=\"/in/solar-installation/timeline/\">overall timeline</a>.</p>"
    },
    {
      "heading": "Installer Verification Checklist",
      "body": "<p>The installer you choose determines your system''s performance for the next 25 years. Verify these before signing:</p><ol><li><strong>MNRE empanelment</strong> — Ask for their MNRE channel partner registration number. Without this, you cannot claim the <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a>.</li><li><strong>Company registration</strong> — Verify GST registration, company incorporation (at least 2–3 years), and valid trade licence.</li><li><strong>Local track record</strong> — Request 5+ references from recent installations in your area. Visit one if possible. Check panel alignment, cable management, and talk to the homeowner about their experience.</li><li><strong>Warranty documentation</strong> — Get written warranty terms covering panels (25 years performance), inverter (5–10 years), mounting (5–10 years), and workmanship (minimum 1 year, ideally 3–5 years).</li><li><strong>After-sales commitment</strong> — Confirm response time for issues, whether they offer annual maintenance contracts, and how they handle inverter replacements under warranty.</li><li><strong>Insurance</strong> — Check if the installer has workmen''s compensation insurance. Installation involves rooftop work — liability matters.</li></ol><p>→ <a href=\"/in/solar-installation/choosing-installer/\">Detailed guide: How to Choose a Solar Installer</a></p>"
    },
    {
      "heading": "Quote Verification Checklist",
      "body": "<p>Before signing, verify every line in the quotation:</p><ul><li><strong>Panel brand, model, and wattage</strong> — Confirm the exact model. Substitutions at installation time (a common complaint) should be pre-approved in writing.</li><li><strong>Inverter brand, model, and capacity</strong> — Match capacity to your system size. An undersized inverter clips your output.</li><li><strong>Mounting structure material</strong> — Hot-dip galvanised iron (HDGI) or aluminium. Painted steel rusts within 5–7 years.</li><li><strong>All-inclusive pricing</strong> — Confirm the quote includes GST (13.8%), net metering application fees, bi-directional meter cost, and all electrical components. <a href=\"/in/solar-installation/cost/\">What your quote should include →</a></li><li><strong>Payment schedule</strong> — Standard: 30–50% advance, balance at commissioning. Never pay 100% upfront.</li><li><strong>Delivery and installation timeline</strong> — Written commitment on installation date and completion timeline.</li></ul>"
    },
    {
      "heading": "Subsidy Eligibility Checklist",
      "body": "<p>To qualify for the PM Surya Ghar subsidy (up to ₹78,000 for 3kW):</p><ul><li>System must be <strong>on-grid</strong> (grid-connected with net metering)</li><li>Installed by an <strong>MNRE-empanelled vendor</strong></li><li><strong>One subsidy per household</strong> — linked to your electricity consumer number</li><li>Must be a <strong>residential connection</strong> — commercial, industrial, and agricultural connections do not qualify</li><li>System capacity must not exceed your <strong>sanctioned load</strong></li><li>Application submitted through the <strong>national portal</strong> after DISCOM commissioning</li></ul><p>Some states offer additional top-up subsidies with their own eligibility criteria. <a href=\"/in/solar-subsidy/eligibility/\">Check full eligibility requirements →</a></p>"
    },
    {
      "heading": "Post-Installation Verification",
      "body": "<p>After installation is complete, verify before making final payment:</p><ul><li><strong>Panel count and brand match quote</strong> — Physically count panels on roof and check labels against your order.</li><li><strong>Inverter model matches quote</strong> — Verify the serial number and register it with the manufacturer for warranty.</li><li><strong>Cable management is clean</strong> — No loose wires, all cables in conduit or properly tied, no sharp bends.</li><li><strong>Earthing is installed and tested</strong> — Ask for earth resistance test results. Should be under 5 ohms.</li><li><strong>System generates expected output</strong> — At noon on a clear day, your system should produce 70–80% of its rated capacity.</li><li><strong>Monitoring app works</strong> — Verify you can see real-time generation data on your phone.</li><li><strong>All documentation received</strong> — Warranty cards, commissioning certificate, design document, maintenance guide.</li></ul>"
    },
    {
      "heading": "Get Verified Installer Quotes",
      "body": "<p>Going through this checklist is much easier when you work with a verified installer who follows professional standards from the start.</p><p>Solar Vipani pre-vets every installer for MNRE empanelment, insurance, track record, and warranty compliance. Fill one form and receive 2–3 transparent, comparable quotes.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What documents do I need for solar installation in India?",
      "answer": "You need: latest electricity bill, Aadhaar or PAN card, address proof, roof ownership proof (property tax receipt or sale deed), passport-size photos, cancelled cheque for subsidy, and housing society NOC if you live in an apartment. Having these ready before installation saves 1–2 weeks."
    },
    {
      "question": "How do I check if my roof is suitable for solar panels?",
      "answer": "Your roof needs approximately 100 sq ft per kW of shadow-free space, must be structurally sound to bear 15–20 kg per sq metre, and should have no major waterproofing issues. Check for shadows from water tanks and adjacent buildings between 9 AM and 3 PM. A professional site survey confirms suitability."
    },
    {
      "question": "What should I verify in a solar installation quote?",
      "answer": "Verify exact panel and inverter brand/model, mounting structure material (HDGI or aluminium — not painted steel), all-inclusive pricing with GST and net metering fees, payment schedule (never 100% upfront), warranty terms for each component, and a written installation timeline commitment."
    },
    {
      "question": "How do I verify if a solar installer is MNRE registered?",
      "answer": "Ask the installer for their MNRE channel partner registration number. You can verify this on the MNRE or PM Surya Ghar national portal. Only MNRE-empanelled installers can process government subsidy applications — choosing an unregistered installer means losing up to ₹78,000 in subsidy."
    },
    {
      "question": "Can I install solar panels in an apartment or housing society?",
      "answer": "Yes, but you need a housing society NOC (no-objection certificate) or resolution approving rooftop solar installation. Individual flat owners can apply for subsidy on their share of a common rooftop system. Coordinate with your society secretary and DISCOM for group net metering arrangements."
    },
    {
      "question": "What happens if the installed components don''t match the quote?",
      "answer": "Never accept substitutions without prior written approval. Before final payment, physically verify panel brand, model, and count on the roof, and check the inverter serial number. If components differ from the quote, document the discrepancy and withhold payment until the installer corrects it or provides a written explanation with adjusted pricing."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'checklist' AND pillar_slug = 'solar-installation';


-- 3. CLUSTER: choosing-installer
UPDATE seo_pages SET
  h1 = 'How to Choose a Solar Installer in India: A Homeowner''s Guide',
  meta_title = 'How to Choose a Solar Installer India: 8 Criteria That Matter | Solar Vipani',
  meta_description = 'Choose the right solar installer with this 8-point evaluation framework — MNRE registration, track record, warranty terms, pricing transparency, and after-sales support.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The right <a href=\"/in/solar-installation/\">solar installer</a> is MNRE-empanelled (mandatory for subsidy), has 5+ verifiable local installations, provides a written warranty on all components and workmanship, quotes transparently with GST and net metering included, and offers reliable after-sales support. The installer you choose determines your system''s performance, warranty enforcement, and savings for the next 25 years.</p>"
    },
    {
      "heading": "Why the Installer Matters More Than the Panels",
      "body": "<p>Homeowners spend weeks comparing panel brands but minutes evaluating installers. This is backwards. Here is why:</p><ul><li><strong>Installation quality determines output</strong> — Poorly angled panels, incorrect string configuration, or inadequate earthing can reduce your system''s output by 15–30%. The same panels installed by different teams will produce different results.</li><li><strong>Warranty enforcement depends on the installer</strong> — Panel manufacturers honour warranty claims only when installation meets their guidelines. A poor installation can void your 25-year panel warranty.</li><li><strong>DISCOM paperwork speed varies</strong> — Experienced installers with established DISCOM relationships get net metering approvals in 2–3 weeks. New or inefficient installers may take 6–8 weeks for the same DISCOM.</li><li><strong>After-sales is a 25-year relationship</strong> — Inverters fail, monitoring apps need setup, panels need cleaning guidance. Your installer is your first point of contact for all of this.</li></ul><p>Bottom line: a good installer with decent panels beats a bad installer with premium panels every time.</p>"
    },
    {
      "heading": "Criterion 1: MNRE Empanelment",
      "body": "<p>This is the non-negotiable first filter. MNRE (Ministry of New and Renewable Energy) empanelment means the installer is registered as an official channel partner under the PM Surya Ghar scheme.</p><p><strong>Why it matters:</strong></p><ul><li>Without MNRE empanelment, you <strong>cannot claim the government subsidy</strong> (up to ₹78,000 for 3kW)</li><li>MNRE registration requires minimum qualifications, infrastructure, and financial standing</li><li>It signals the installer meets baseline professional standards</li></ul><p><strong>How to verify:</strong> Ask for their registration number and cross-check on the PM Surya Ghar national portal. Every empanelled installer has a unique registration ID linked to their company and geography.</p><p>→ <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy details</a></p>"
    },
    {
      "heading": "Criterion 2: Local Track Record",
      "body": "<p>National reputation means less than local execution. What to check:</p><ul><li><strong>Number of installations in your city/district</strong> — An installer with 50+ installations in your area understands local roof types, DISCOM processes, and weather patterns better than one doing their first project in your city.</li><li><strong>References you can contact</strong> — Ask for 5+ recent customer references. Call at least 2–3. Ask about: installation quality, timeline adherence, post-installation support, and any issues faced.</li><li><strong>Site visit to a completed project</strong> — If possible, visit a recent installation. Look at panel alignment, cable management, mounting quality, and overall tidiness. Poor workmanship is visible.</li><li><strong>Online reviews</strong> — Check Google Business reviews, but weight recent reviews more heavily. A company with 50 five-star reviews from 3 years ago and recent complaints is a red flag.</li></ul>"
    },
    {
      "heading": "Criterion 3: Warranty Terms",
      "body": "<p>Solar is a 25-year investment. Warranty terms must be in writing and unambiguous:</p><table><thead><tr><th>Component</th><th>Industry Standard</th><th>What to Accept</th></tr></thead><tbody><tr><td>Solar panels — performance</td><td>25 years (≥80% output at year 25)</td><td>25 years linear warranty from Tier 1 brand</td></tr><tr><td>Solar panels — product</td><td>10–12 years</td><td>Minimum 10 years</td></tr><tr><td>Inverter</td><td>5–10 years</td><td>Minimum 5 years, 10 preferred</td></tr><tr><td>Mounting structure</td><td>5–10 years</td><td>Minimum 5 years, HDGI or aluminium only</td></tr><tr><td>Workmanship</td><td>1–5 years</td><td>Minimum 2 years, ideally 5</td></tr></tbody></table><p><strong>Key questions to ask:</strong></p><ul><li>Who handles warranty claims — the installer or the manufacturer directly?</li><li>Is there an annual maintenance contract (AMC) available?</li><li>What is the response time for issues — 24 hours, 48 hours, or 1 week?</li><li>If the installer company shuts down, how are manufacturer warranties honoured?</li></ul>"
    },
    {
      "heading": "Criterion 4: Transparent Quoting",
      "body": "<p>A trustworthy installer provides an itemised quote. Here is what a transparent quote includes:</p><ul><li><strong>Panel details</strong> — Brand, model, wattage, quantity, and unit price</li><li><strong>Inverter details</strong> — Brand, model, capacity, and price</li><li><strong>Mounting structure</strong> — Material type (HDGI/aluminium), design type (flush/tilt), and price</li><li><strong>Electrical components</strong> — DC/AC cables, junction box, MCBs, SPDs, earthing kit — itemised</li><li><strong>Labour cost</strong> — Installation charges broken out</li><li><strong>DISCOM fees</strong> — Net metering application fee and meter cost</li><li><strong>GST</strong> — 13.8% on composite supply, clearly shown</li><li><strong>Total all-inclusive price</strong> — No surprises after signing</li></ul><p>Compare at least 2–3 quotes on a like-for-like basis. The <a href=\"/in/solar-installation/cost/\">installation cost guide</a> explains what each component should cost, so you can identify overpriced quotes.</p>"
    },
    {
      "heading": "Criterion 5: After-Sales Support",
      "body": "<p>The sale does not end at commissioning. For the next 25 years, you need a responsive support partner:</p><ul><li><strong>Monitoring setup</strong> — The installer should configure your inverter''s WiFi monitoring app and show you how to read daily generation data.</li><li><strong>Annual maintenance contract (AMC)</strong> — Covers inverter inspection, connection checks, and performance audit. Typical cost: ₹2,000–₹5,000 per year.</li><li><strong>Emergency response</strong> — What is their SLA for system-down situations? A good installer responds within 24–48 hours.</li><li><strong>Cleaning guidance</strong> — Panels need cleaning every 2–4 weeks in dusty Indian conditions. The installer should guide you on safe cleaning methods or offer a cleaning service.</li><li><strong>Component replacement</strong> — If your inverter fails under warranty, the installer should handle the replacement process with the manufacturer.</li></ul>"
    },
    {
      "heading": "Criterion 6: Company Stability",
      "body": "<p>Solar is a long-term relationship. Assess the installer''s business viability:</p><ul><li><strong>Years in operation</strong> — Prefer companies with 3+ years in the solar business. The Indian solar market has seen many fly-by-night operators.</li><li><strong>Team size</strong> — A company with dedicated installation crews, a project manager, and office support is more reliable than a one-person operation.</li><li><strong>GST registration</strong> — Valid GST registration confirms they are a legitimate, tax-compliant business.</li><li><strong>Physical office</strong> — An installer with a physical office in your city is easier to reach for after-sales support than a remote operator.</li><li><strong>Financial health</strong> — If they are an authorised dealer for major brands, it indicates the manufacturer trusts their financial stability.</li></ul>"
    },
    {
      "heading": "Red Flags to Watch For",
      "body": "<p>Walk away if you see any of these:</p><ol><li><strong>No MNRE registration</strong> — You lose the ₹78,000 subsidy. Non-negotiable.</li><li><strong>Quoting without a site visit</strong> — Accurate pricing requires seeing your roof. Phone-based quotes indicate either inexperience or intent to surprise you later with extras.</li><li><strong>100% advance payment</strong> — Industry standard is 30–50% advance, balance at commissioning. Full prepayment removes your leverage.</li><li><strong>Vague component specifications</strong> — If the quote says \"540W panel\" without specifying brand and model, the installer reserves the right to substitute cheaper alternatives at installation.</li><li><strong>No written warranty</strong> — Verbal warranty promises are unenforceable. If they will not put it in writing, there is a reason.</li><li><strong>Pressure tactics</strong> — \"This price is only valid today\" or \"Subsidy is ending next month\" are sales tactics, not facts. Take your time to evaluate properly.</li></ol>"
    },
    {
      "heading": "Let Solar Vipani Match You with Verified Installers",
      "body": "<p>Evaluating installers across all these criteria takes time. Solar Vipani does this for you.</p><p>Every installer on our platform is verified for MNRE empanelment, valid licensing and insurance, local track record, warranty compliance, and after-sales capability. We vet them so you do not have to.</p><p>Fill one form. Receive 2–3 competitive, comparable quotes from verified installers in your city. Compare transparently and choose with confidence.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How do I verify if a solar installer is genuine?",
      "answer": "Check their MNRE empanelment number on the PM Surya Ghar portal, verify GST registration, look for Google Business reviews, ask for 5+ recent customer references in your area, and confirm they have a physical office. Avoid installers who cannot provide any of these."
    },
    {
      "question": "What is the most important thing to check before choosing a solar installer?",
      "answer": "MNRE empanelment is the non-negotiable first filter — without it, you cannot claim the government subsidy of up to ₹78,000. After that, prioritise local track record (5+ installations in your area with verifiable references) and written warranty terms for all components."
    },
    {
      "question": "Should I choose the cheapest solar installer?",
      "answer": "No. The cheapest quote often uses lower-grade components, skips proper earthing or cable management, and may not include GST or net metering fees. Compare quotes on an all-inclusive, like-for-like basis. A slightly higher quote from a reputable installer delivers better long-term value and warranty enforcement."
    },
    {
      "question": "What warranty should a solar installer provide?",
      "answer": "Expect: 25-year panel performance warranty, 10-year panel product warranty, 5–10 year inverter warranty, 5–10 year mounting structure warranty, and minimum 2-year workmanship warranty. All terms must be in writing. Clarify who handles claims — the installer or manufacturer."
    },
    {
      "question": "How many solar installer quotes should I compare?",
      "answer": "Compare at least 2–3 quotes. This gives you a realistic price range for your area and system size, and lets you evaluate each installer''s transparency and professionalism. Ensure all quotes are for the same system specifications (panel brand, inverter type, mounting material) for a valid comparison."
    },
    {
      "question": "What if my solar installer goes out of business?",
      "answer": "Panel and inverter warranties are with the manufacturer, not the installer — so product warranties survive. Workmanship warranty and after-sales support are lost. This is why choosing a stable company (3+ years, physical office, brand authorisations) reduces risk. You can hire another installer for maintenance."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'choosing-installer' AND pillar_slug = 'solar-installation';

COMMIT;
