-- Solar Pumps Clusters Batch 5: for-home, kusum-yojana
-- Run: psql $POSTGRES_URL < 026-solar-pumps-clusters-batch5.sql

BEGIN;

-- 1. CLUSTER: for-home
UPDATE seo_pages SET
  h1 = 'Solar Pump for Home in India: Best Models for Overhead Tank Filling',
  meta_title = 'Solar Pump for Home India: Price, HP Guide & Best Models | Solar Vipani',
  meta_description = 'Solar pump for home water supply from ₹25,000. Fill overhead tanks, garden irrigation, and domestic use. 0.5–2 HP BLDC pumps need no electricity. Compare models.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A solar pump for home use costs <strong>₹25,000–₹1,10,000</strong> depending on HP and type. A <a href=\"/in/solar-pumps/1hp/\">1 HP</a> <a href=\"/in/solar-pumps/bldc/\">BLDC pump</a> is the most popular choice — it fills a 1,000-litre overhead tank in 20–30 minutes, runs on just 2–3 solar panels, and costs ₹45,000–₹70,000. Zero electricity bills for water pumping, zero noise, and minimal maintenance.</p>"
    },
    {
      "heading": "Why Solar Pumps Make Sense for Homes",
      "body": "<p>Indian homes face two persistent water challenges: <strong>unreliable municipal supply timing</strong> and <strong>high electricity costs</strong> for running pumps during peak hours. A solar pump solves both:</p><ul><li><strong>Runs during the day</strong> — perfectly aligned with municipal supply timing in most cities (morning fill, evening use)</li><li><strong>Zero electricity cost</strong> — a 1 HP pump running 2 hours daily costs ₹1,500–₹2,500 per year in electricity. Solar eliminates this permanently.</li><li><strong>Works during power cuts</strong> — solar pumps operate independently of the grid, ensuring water supply even during load-shedding</li><li><strong>Silent operation</strong> — <a href=\"/in/solar-pumps/bldc/\">BLDC submersible</a> pumps are virtually silent compared to noisy conventional pumps</li></ul>"
    },
    {
      "heading": "Sizing: Which HP for Your Home?",
      "body": "<table><thead><tr><th>Home Type</th><th>Tank Size</th><th>Water Source</th><th>Recommended HP</th><th>Price Range</th></tr></thead><tbody><tr><td>1–2 BHK flat</td><td>500–1,000 L</td><td>Ground-level sump</td><td>0.5 HP</td><td>₹25,000–₹40,000</td></tr><tr><td>2–3 BHK house</td><td>1,000–2,000 L</td><td>Sump or borewell (50–100 ft)</td><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>₹45,000–₹70,000</td></tr><tr><td>Large bungalow</td><td>2,000–5,000 L</td><td>Borewell (100–200 ft)</td><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>₹80,000–₹1,10,000</td></tr><tr><td>Farmhouse / villa</td><td>5,000–10,000 L</td><td>Borewell (150–250 ft)</td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>₹1,30,000–₹1,80,000</td></tr></tbody></table><p>For most urban homes, a <a href=\"/in/solar-pumps/1hp/\">1 HP BLDC pump</a> covers all domestic needs — overhead tank filling, garden watering, and car washing.</p>"
    },
    {
      "heading": "Best Pump Types for Home Use",
      "body": "<p><strong>1. <a href=\"/in/solar-pumps/bldc/\">BLDC submersible</a> (most popular for homes)</strong></p><ul><li>Runs silently inside the borewell or sump</li><li>Highest efficiency — extracts maximum water from 2–3 panels</li><li>Auto start/stop with sunlight — no manual operation</li><li>Ideal for homes with borewells up to 150 feet or underground sumps</li></ul><p><strong>2. <a href=\"/in/solar-pumps/surface/\">Surface pump</a> (for sump-to-tank transfer)</strong></p><ul><li>Sits next to the ground-level sump or well</li><li>Self-priming models eliminate manual priming hassle</li><li>Easier to access and maintain</li><li>Slightly noisier than submersible — not ideal for bedrooms nearby</li></ul><p><strong>3. Booster pump (for high-rise buildings)</strong></p><ul><li>Increases water pressure for upper floors</li><li>Typically 0.5 HP, compact solar-powered unit</li><li>Solves low-pressure issues in 3–4 storey buildings</li></ul>"
    },
    {
      "heading": "Panel Placement for Homes",
      "body": "<p>A home solar pump needs just 2–4 panels — far less than a <a href=\"/in/rooftop-solar/\">rooftop solar system</a> for electricity:</p><ul><li><strong>Rooftop mounting</strong> — ideal for urban homes. 2–3 panels fit on any terrace or flat roof. Use the same mounting structure as a small rooftop solar system.</li><li><strong>Balcony or wall mounting</strong> — for flats without roof access, panels can be mounted vertically on south-facing walls or balcony railings (reduced output by 20–30%).</li><li><strong>Ground mounting</strong> — for independent houses with garden space. Panels can be placed near the borewell or sump.</li></ul><p>Space needed: just 50–100 sq ft for a 1 HP system. If you already have a <a href=\"/in/rooftop-solar/\">rooftop solar system</a>, some inverters can power a pump directly — consult your installer.</p>"
    },
    {
      "heading": "Cost and Savings for Home Solar Pumps",
      "body": "<table><thead><tr><th>Cost Factor</th><th>Electric Pump</th><th>Solar Pump (1 HP BLDC)</th></tr></thead><tbody><tr><td>Pump cost</td><td>₹5,000–₹15,000</td><td>₹45,000–₹70,000</td></tr><tr><td>Annual electricity</td><td>₹1,500–₹2,500</td><td>₹0</td></tr><tr><td>Annual maintenance</td><td>₹500–₹1,000</td><td>₹500–₹1,000</td></tr><tr><td>Lifespan</td><td>5–8 years</td><td>15–20 years</td></tr><tr><td>10-year total cost</td><td>₹25,000–₹45,000</td><td>₹46,000–₹71,000</td></tr><tr><td>20-year total cost</td><td>₹55,000–₹85,000</td><td>₹46,000–₹71,000</td></tr></tbody></table><p>Solar pumps break even with electric pumps in 10–15 years. The real value is <strong>independence from grid</strong> — your water supply works during power cuts, voltage fluctuations, and scheduled outages.</p><p>Note: <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> is for agricultural pumps only. Home solar pumps are not eligible for KUSUM subsidy, but some state governments offer separate schemes for domestic solar water pumps.</p>"
    },
    {
      "heading": "Installation for Homes",
      "body": "<p>Home solar pump installation is simple — typically done in half a day:</p><ol><li><strong>Mount 2–3 panels</strong> on the rooftop or ground frame</li><li><strong>Install controller</strong> in a protected location (covered wall, utility room)</li><li><strong>Connect pump</strong> — submersible into borewell/sump, or surface pump near the water source</li><li><strong>Run delivery pipe</strong> to the overhead tank</li><li><strong>Test and commission</strong> — verify flow rate and tank filling time</li></ol><p>No permits or DISCOM approvals are needed (unlike grid-connected <a href=\"/in/rooftop-solar/\">rooftop solar</a>). The system is completely standalone.</p>"
    },
    {
      "heading": "Get Quotes for a Home Solar Pump",
      "body": "<p>Tell us about your water source and tank setup — Solar Vipani will connect you with dealers who can recommend the right solar pump for your home.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which is the best solar pump for home use?",
      "answer": "A 1 HP BLDC submersible pump is the best all-round choice for most Indian homes. It is efficient, silent, maintenance-free, and costs ₹45,000–₹70,000. For homes with shallow sumps (under 20 feet), a 0.5–1 HP surface pump is a cheaper alternative at ₹25,000–₹50,000."
    },
    {
      "question": "Can a solar pump fill an overhead tank automatically?",
      "answer": "Yes. Solar pumps start automatically when sunlight is sufficient and stop when a float valve in the tank signals it is full (or when sunlight drops). No manual switching is needed. Add a simple float valve to the tank for automatic shutoff when full."
    },
    {
      "question": "How many panels does a home solar pump need?",
      "answer": "A 1 HP home solar pump needs 2–3 panels of 540W each (1.0–1.5 kW total). A 0.5 HP pump needs just 1–2 panels. The panels fit easily on any rooftop, taking up only 50–100 sq ft of space."
    },
    {
      "question": "Is there a government subsidy for home solar pumps?",
      "answer": "KUSUM Yojana covers only agricultural pumps, not domestic. However, some states (Rajasthan, Gujarat, Maharashtra) offer separate subsidies for solar water heaters and domestic solar devices that occasionally include small pumps. Check with your local DISCOM or state renewable energy department."
    },
    {
      "question": "Can I use a solar pump with my existing borewell?",
      "answer": "Yes. A solar submersible pump can replace your existing electric submersible pump in the same borewell. Ensure the solar pump motor OD is compatible with your borewell casing diameter. Your dealer can check compatibility during the site visit."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-home' AND pillar_slug = 'solar-pumps';


-- 2. CLUSTER: kusum-yojana
UPDATE seo_pages SET
  h1 = 'KUSUM Yojana 2026: Solar Pump Subsidy, Eligibility & Application Guide',
  meta_title = 'KUSUM Yojana 2026: Solar Pump Subsidy Up to 90% — How to Apply | Solar Vipani',
  meta_description = 'PM-KUSUM Yojana provides 60–90% subsidy on solar pumps up to 7.5 HP. Eligibility, documents, application process, state-wise subsidy rates, and approved vendor list.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan) is the central government''s flagship scheme to solarise Indian agriculture. Under <strong>Component B</strong>, farmers get <strong>60% subsidy</strong> (30% central + 30% state) on standalone <a href=\"/in/solar-pumps/\">solar pumps</a> up to 7.5 HP. Several states add top-ups that bring the farmer''s share down to just <strong>10%</strong>. The scheme targets 35 lakh solar pumps across India by 2026.</p>"
    },
    {
      "heading": "Three Components of PM-KUSUM",
      "body": "<p>KUSUM has three distinct components targeting different aspects of agricultural solar adoption:</p><table><thead><tr><th>Component</th><th>What It Does</th><th>For Whom</th></tr></thead><tbody><tr><td><strong>A</strong></td><td>10 GW solar power plants on barren/fallow land (0.5–2 MW each)</td><td>Farmers/cooperatives selling power to DISCOM</td></tr><tr><td><strong>B</strong></td><td>Standalone solar pumps up to 7.5 HP</td><td>Individual farmers replacing diesel/grid pumps</td></tr><tr><td><strong>C</strong></td><td>Solarise existing grid-connected pumps</td><td>Farmers with existing grid pumps; sell surplus solar to DISCOM</td></tr></tbody></table><p><strong>Component B is the most relevant for farmers looking to buy a new solar pump.</strong> Component C is for those who already have a grid-connected pump and want to add solar panels to reduce their electricity bill and earn income from surplus power.</p>"
    },
    {
      "heading": "Component B: Standalone Solar Pump Subsidy",
      "body": "<p>This is the primary subsidy path for farmers buying a new solar pump:</p><table><thead><tr><th>Detail</th><th>Value</th></tr></thead><tbody><tr><td>Eligible pump size</td><td>Up to 7.5 HP</td></tr><tr><td>Central subsidy</td><td>30% of benchmark cost</td></tr><tr><td>State subsidy</td><td>30% of benchmark cost</td></tr><tr><td>Farmer share</td><td>40% (can be financed via bank loan)</td></tr><tr><td>Eligible pump types</td><td><a href=\"/in/solar-pumps/submersible/\">Submersible</a>, <a href=\"/in/solar-pumps/surface/\">surface</a>, <a href=\"/in/solar-pumps/bldc/\">BLDC</a>, AC</td></tr><tr><td>Must use</td><td>MNRE-empanelled vendor and BIS-approved components</td></tr></tbody></table><p>Example: A <a href=\"/in/solar-pumps/5hp/\">5 HP pump</a> with benchmark cost ₹2,50,000 → central subsidy ₹75,000 + state subsidy ₹75,000 = farmer pays ₹1,00,000. In states with extra top-ups, farmer pays ₹25,000–₹50,000.</p>"
    },
    {
      "heading": "State-Wise KUSUM Subsidy Rates",
      "body": "<p>State governments set their own top-up subsidies above the 30% central share. Here are the effective farmer shares in major states:</p><table><thead><tr><th>State</th><th>Farmer Share</th><th>Notes</th></tr></thead><tbody><tr><td>Rajasthan</td><td>10–40%</td><td>Most generous — SC/ST farmers pay 10%</td></tr><tr><td>Madhya Pradesh</td><td>10–40%</td><td>Extra subsidy for small/marginal farmers</td></tr><tr><td>Uttar Pradesh</td><td>15–40%</td><td>UP Solar Pump scheme adds to KUSUM</td></tr><tr><td>Maharashtra</td><td>20–40%</td><td>Mukhyamantri Saur Krushi Pump adds top-up</td></tr><tr><td>Gujarat</td><td>20–40%</td><td>Strong implementation, fast processing</td></tr><tr><td>Karnataka</td><td>30–40%</td><td>Standard 30% state + 30% central</td></tr><tr><td>Punjab / Haryana</td><td>25–40%</td><td>State top-ups for paddy regions</td></tr><tr><td>Tamil Nadu</td><td>30–40%</td><td>TEDA scheme complements KUSUM</td></tr></tbody></table><p><em>Rates as of 2025–26. SC/ST and small/marginal farmers get extra concessions in most states.</em></p>"
    },
    {
      "heading": "Eligibility Criteria",
      "body": "<ul><li><strong>Individual farmers</strong> with agricultural land and a valid land ownership record (7/12 extract, patta, khatauni)</li><li><strong>Farmer groups</strong> / cooperatives can apply jointly for community borewells</li><li><strong>Existing diesel or electric pump</strong> — replacement with solar is prioritised (but not mandatory)</li><li><strong>No existing solar pump</strong> — one subsidised solar pump per farmer family</li><li><strong>Water source</strong> — must have an existing borewell, open well, or other water source suitable for the pump</li></ul><p><strong>Not eligible:</strong> Non-agricultural land, urban residential properties, commercial/industrial users, and anyone who has already received a KUSUM solar pump.</p>"
    },
    {
      "heading": "Documents Required",
      "body": "<ol><li><strong>Aadhaar card</strong> — for identity verification and DBT (Direct Benefit Transfer)</li><li><strong>Land record</strong> — 7/12 extract (Maharashtra), khatauni/khasra (UP/MP), patta/chitta (TN), RoR (Karnataka/Rajasthan)</li><li><strong>Bank account details</strong> — for subsidy disbursement (must be linked to Aadhaar)</li><li><strong>Passport-size photograph</strong></li><li><strong>Existing pump details</strong> — if replacing a diesel/electric pump (make, HP, electricity consumer number)</li><li><strong>Borewell/well details</strong> — depth, diameter, location coordinates</li><li><strong>Caste certificate</strong> — for SC/ST/OBC candidates seeking extra subsidy</li></ol><p>Your empanelled dealer typically helps with form filling and document compilation as part of the service.</p>"
    },
    {
      "heading": "Application Process: Step by Step",
      "body": "<ol><li><strong>Register online</strong> — visit your state''s KUSUM portal (e.g., kusum.rajasthan.gov.in, pmkusum.mnre.gov.in) or the national portal. Fill in farmer details, land info, and pump requirements.</li><li><strong>Document verification</strong> — the state nodal agency (agriculture/renewable energy department) verifies your land records and eligibility.</li><li><strong>Vendor selection</strong> — choose an MNRE-empanelled vendor from the approved list. Compare quotes from 2–3 vendors for the best price within the benchmark cost.</li><li><strong>Pay farmer share</strong> — deposit your share (10–40% of benchmark cost) with the implementing agency or directly to the vendor as per state process.</li><li><strong>Installation</strong> — the empanelled vendor installs the solar pump system (<a href=\"/in/solar-pumps/how-it-works/\">panels, controller, pump</a>) within 60–90 days of approval.</li><li><strong>Inspection and commissioning</strong> — state agency inspects the installation, verifies all components are as per MNRE specifications.</li><li><strong>Subsidy release</strong> — after successful inspection, the government releases the subsidy amount to the vendor. You do not handle the subsidy money directly.</li></ol><p>Timeline: 3–6 months from application to running pump, depending on state backlog and vendor availability.</p>"
    },
    {
      "heading": "Common Questions About the Application",
      "body": "<ul><li><strong>Can I choose my own vendor?</strong> — You must select from the MNRE-empanelled vendor list for your state. Solar Vipani helps you identify empanelled dealers in your district.</li><li><strong>Can I get a bank loan for my share?</strong> — Yes. NABARD and commercial banks offer loans at subsidised interest (7–9%) for the farmer''s share. Some states arrange financing through farmer cooperatives.</li><li><strong>What if my borewell fails after installation?</strong> — The pump can be moved to a new borewell. The subsidy is on the equipment, not the borewell location.</li><li><strong>Can I upgrade to a larger pump later?</strong> — KUSUM is a one-time benefit per farmer. If you need a larger pump, you will need to purchase the upgrade at full cost. Choose the right HP from the start — <a href=\"/in/solar-pumps/borewell/\">our sizing guide</a> helps.</li></ul>"
    },
    {
      "heading": "Get Help with Your KUSUM Application",
      "body": "<p>Solar Vipani connects you with KUSUM-empanelled dealers who handle the entire process — from application to installation to inspection. Fill one form and get connected with verified dealers in your district.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes + KUSUM application support →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the KUSUM Yojana subsidy for solar pumps?",
      "answer": "Under PM-KUSUM Component B, farmers get 60% subsidy (30% central + 30% state) on standalone solar pumps up to 7.5 HP. Several states add top-ups that reduce the farmer share to 10–25%. SC/ST and small farmers get additional concessions in most states."
    },
    {
      "question": "Who is eligible for KUSUM Yojana?",
      "answer": "Any individual farmer with agricultural land and a valid land ownership document is eligible. The farmer must have a water source (borewell, open well) and should not have already received a subsidised solar pump under KUSUM. Farmer groups and cooperatives can also apply."
    },
    {
      "question": "How do I apply for KUSUM Yojana?",
      "answer": "Register on your state''s KUSUM portal or the national pmkusum.mnre.gov.in portal. Submit land documents, Aadhaar, and bank details. After verification, select an empanelled vendor, pay your share, and the vendor installs the system. The process takes 3–6 months."
    },
    {
      "question": "Can I get a KUSUM subsidy for a 10 HP pump?",
      "answer": "KUSUM Component B covers pumps up to 7.5 HP. For 10 HP, subsidy applies only on the 7.5 HP benchmark cost. The additional cost above 7.5 HP is borne by the farmer. Some states have separate schemes for higher HP pumps."
    },
    {
      "question": "Is KUSUM Yojana available for home water pumps?",
      "answer": "No. KUSUM is exclusively for agricultural pump sets. The farmer must have agricultural land. Home/residential solar pumps do not qualify. Some states have separate domestic solar water pump schemes — check with your state renewable energy department."
    },
    {
      "question": "How long does the KUSUM application process take?",
      "answer": "From application to running pump, the process typically takes 3–6 months. Document verification takes 2–4 weeks, vendor allocation 2–4 weeks, and installation 4–8 weeks. States with high application volumes (Rajasthan, UP) may take longer."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'kusum-yojana' AND pillar_slug = 'solar-pumps';

COMMIT;
