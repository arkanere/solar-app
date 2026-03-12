-- Solar Subsidy Content: pillar + pm-surya-ghar + central-government
-- Run: psql $POSTGRES_URL < 012-solar-subsidy-content.sql

BEGIN;

-- 1. PILLAR: solar-subsidy
UPDATE seo_pages SET
  h1 = 'Solar Subsidy in India 2026: Complete Guide to Government Schemes',
  meta_title = 'Solar Subsidy India 2026: PM Surya Ghar, State Schemes & How to Apply | Solar Vipani',
  meta_description = 'Complete guide to solar subsidies in India — PM Surya Ghar, central and state schemes, eligibility, and application process. Get up to ₹78,000 subsidy on rooftop solar.',
  content = '[
    {
      "heading": "Solar Subsidies Are Making Rooftop Solar Affordable for Every Indian Home",
      "body": "<p>India''s solar subsidy landscape has never been more generous. The central government''s PM Surya Ghar Yojana offers up to ₹78,000 in direct subsidy for residential rooftop solar, while many states provide additional top-ups. As of 2026, over 1 crore Indian households have applied under PM Surya Ghar alone. Solar Vipani connects you with MNRE-empanelled installers who handle the complete subsidy paperwork — so you get the full benefit without the bureaucratic hassle.</p>"
    },
    {
      "heading": "What Are Solar Subsidies in India?",
      "body": "<p>Solar subsidies are direct financial incentives provided by the central and state governments to reduce the upfront cost of installing rooftop solar systems. Unlike tax benefits, subsidies are credited directly to your bank account after installation and DISCOM verification — reducing what you actually pay out of pocket.</p><p>India''s solar subsidy structure operates at two levels:</p><ul><li><strong>Central subsidy</strong> — Funded by MNRE (Ministry of New and Renewable Energy) through schemes like PM Surya Ghar. Available nationwide for residential on-grid systems.</li><li><strong>State subsidy</strong> — Additional incentives offered by select state governments or DISCOMs. Varies widely — some states offer ₹10,000–₹20,000 per kW on top of the central subsidy.</li></ul><p>The combined effect can reduce your <a href=\"/in/rooftop-solar/cost/\">rooftop solar cost</a> by 30–60% depending on system size and your state.</p>"
    },
    {
      "heading": "PM Surya Ghar Yojana",
      "body": "<p>PM Surya Ghar Muft Bijli Yojana is the flagship central government scheme for residential rooftop solar. Launched in February 2024 with a ₹75,021 crore outlay, it aims to solarise 1 crore households by 2027.</p><p>Subsidy rates under PM Surya Ghar:</p><table><thead><tr><th>System Size</th><th>Rate</th><th>Total Subsidy</th></tr></thead><tbody><tr><td>Up to 2 kW</td><td>₹30,000/kW</td><td>Up to ₹60,000</td></tr><tr><td>2 kW to 3 kW</td><td>₹18,000/kW (additional)</td><td>Up to ₹78,000</td></tr><tr><td>Above 3 kW</td><td>No additional subsidy</td><td>Capped at ₹78,000</td></tr></tbody></table><p>The subsidy is credited directly to your bank account via DBT (Direct Benefit Transfer) after installation, DISCOM inspection, and net meter commissioning.</p><p>→ <a href=\"/in/solar-subsidy/pm-surya-ghar/\">Full guide: PM Surya Ghar Yojana — Eligibility, Process & Benefits</a></p>"
    },
    {
      "heading": "Central Government Solar Subsidies",
      "body": "<p>Beyond PM Surya Ghar, the central government supports solar adoption through multiple channels. MNRE provides capital subsidies for residential and institutional systems, while commercial and industrial consumers benefit from accelerated depreciation (40%) under the Income Tax Act.</p><p>Key central schemes include PM Surya Ghar for households, KUSUM for agricultural solar pumps, and viability gap funding for solar parks. For homeowners, PM Surya Ghar remains the primary and most impactful scheme.</p><p>→ <a href=\"/in/solar-subsidy/central-government/\">Full guide: Central Government Solar Subsidy Schemes</a></p>"
    },
    {
      "heading": "State-Wise Solar Subsidies",
      "body": "<p>Several Indian states offer additional subsidies on top of the central scheme. These vary significantly:</p><table><thead><tr><th>State</th><th>Additional Subsidy</th><th>Notable Feature</th></tr></thead><tbody><tr><td>Gujarat</td><td>₹10,000/kW (up to 10 kW)</td><td>One of the most generous state top-ups</td></tr><tr><td>Maharashtra</td><td>No state top-up</td><td>Central subsidy only; MSEDCL handles net metering</td></tr><tr><td>Karnataka</td><td>Varies by DISCOM</td><td>BESCOM offers streamlined online process</td></tr><tr><td>Rajasthan</td><td>₹5,000–₹10,000/kW</td><td>Additional support for rural areas</td></tr><tr><td>Tamil Nadu</td><td>No state top-up</td><td>TANGEDCO net metering available</td></tr></tbody></table><p>Always verify current state subsidy status before finalising your system — policies change with state budgets.</p><p>→ <a href=\"/in/solar-subsidy/state-wise/\">Full guide: State-Wise Solar Subsidies in India</a></p>"
    },
    {
      "heading": "Eligibility and How to Apply",
      "body": "<p>To qualify for the central subsidy under PM Surya Ghar, you must be a residential electricity consumer with a valid DISCOM connection. The system must be on-grid, installed by an MNRE-empanelled vendor, and use BIS-certified components.</p><p>The application process is straightforward: register on the national portal, select a vendor, get installation done, apply for net metering, and the subsidy is credited after DISCOM inspection.</p><p>→ <a href=\"/in/solar-subsidy/eligibility/\">Eligibility criteria in detail</a></p><p>→ <a href=\"/in/solar-subsidy/how-to-apply/\">Step-by-step application guide</a></p>"
    },
    {
      "heading": "Net Metering and Your Subsidy",
      "body": "<p>Net metering is mandatory for subsidy-eligible systems. Your DISCOM installs a bi-directional meter that tracks electricity exported to and imported from the grid. Surplus solar units earn you credits on your electricity bill — effectively spinning your meter backwards during daylight hours.</p><p>Net metering policies vary by state and DISCOM. Most states allow annual settlement of credits, meaning excess generation in summer offsets winter consumption.</p><p>→ <a href=\"/in/solar-subsidy/net-metering/\">Full guide: Net Metering for Solar in India</a></p>"
    },
    {
      "heading": "Our Verified Installer Network",
      "body": "<p>Solar Vipani works exclusively with MNRE-empanelled installers who are authorised to process subsidy applications. Every installer on our platform handles:</p><ul><li>PM Surya Ghar portal registration and application</li><li>DISCOM liaison for net metering approval</li><li>Installation with BIS-certified components</li><li>Post-installation inspection coordination</li><li>Subsidy disbursement follow-up</li></ul><p>Fill one form and receive 2–3 quotes from verified installers in your city — complete with subsidy calculation for your specific system size.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with subsidy estimate →</a></p>"
    },
    {
      "heading": "Calculate Your Net Cost After Subsidy",
      "body": "<p>Your actual out-of-pocket cost depends on system size, state incentives, and installer pricing. Use our tools to get an accurate estimate:</p><ul><li><a href=\"/in/tools/subsidy-checker/\">Subsidy Checker</a> — See exactly how much subsidy you qualify for based on your state and system size</li><li><a href=\"/in/tools/solar-calculator/\">Solar Calculator</a> — Calculate total cost, savings, and payback period after subsidy</li></ul><p>Or skip the calculators and <a href=\"/in/get-quotes/\">get personalised quotes</a> from verified local installers who will include the subsidy calculation in their proposal.</p>"
    }
  ]',
  faq = '[
    {
      "question": "How much subsidy can I get on rooftop solar in India?",
      "answer": "Under PM Surya Ghar Yojana, residential consumers get ₹30,000/kW for the first 2 kW and ₹18,000/kW for the 3rd kW — up to a maximum of ₹78,000 for a 3 kW system. Some states like Gujarat offer additional top-ups of ₹10,000/kW. The subsidy is credited directly to your bank account after installation."
    },
    {
      "question": "Who is eligible for solar panel subsidy in India?",
      "answer": "Any residential electricity consumer with a valid DISCOM connection can apply. The system must be on-grid, installed by an MNRE-empanelled vendor, and use BIS-certified equipment. One subsidy per household, linked to your electricity consumer number. Commercial, industrial, and off-grid systems do not qualify."
    },
    {
      "question": "How long does it take to receive the solar subsidy?",
      "answer": "After installation and DISCOM inspection, the subsidy is typically credited within 30–90 days via Direct Benefit Transfer to your bank account. Timelines vary by state and DISCOM processing speed. Your installer can help track the disbursement status on the PM Surya Ghar portal."
    },
    {
      "question": "Is solar subsidy available for apartments and housing societies?",
      "answer": "Yes. Individual flat owners in housing societies can apply for the PM Surya Ghar subsidy on their share of a rooftop system. The housing society needs to pass a resolution and apply for group net metering with the DISCOM. Each flat owner receives subsidy proportional to their allocated capacity."
    },
    {
      "question": "Do I need to apply for the subsidy separately or does the installer handle it?",
      "answer": "You need to register on the PM Surya Ghar national portal yourself, but most MNRE-empanelled installers assist with the entire process. They handle vendor selection, DISCOM liaison, inspection coordination, and subsidy follow-up. Choose a verified installer to ensure smooth subsidy processing."
    },
    {
      "question": "Can I get both central and state solar subsidies?",
      "answer": "In states that offer additional subsidies, yes — you can receive both the central PM Surya Ghar subsidy and the state top-up. The central subsidy (up to ₹78,000) comes from MNRE, while state subsidies are funded by the state government or DISCOM. Not all states offer additional subsidies."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'solar-subsidy' AND page_type = 'pillar';


-- 2. CLUSTER: pm-surya-ghar
UPDATE seo_pages SET
  h1 = 'PM Surya Ghar Yojana 2026: Subsidy Rates, Eligibility & How to Apply',
  meta_title = 'PM Surya Ghar Yojana 2026: Get Up to ₹78,000 Solar Subsidy | Solar Vipani',
  meta_description = 'PM Surya Ghar Muft Bijli Yojana offers ₹30,000/kW subsidy on rooftop solar. Check eligibility, application steps, documents needed, and disbursement timeline.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>PM Surya Ghar Muft Bijli Yojana is the central government''s flagship scheme offering up to <strong>₹78,000 direct subsidy</strong> for residential rooftop solar systems. You get ₹30,000/kW for the first 2 kW and ₹18,000/kW for the 3rd kW. The subsidy is credited to your bank account via DBT after installation and DISCOM inspection. Only on-grid systems installed by MNRE-empanelled vendors using BIS-certified equipment qualify.</p>"
    },
    {
      "heading": "What Is PM Surya Ghar Muft Bijli Yojana?",
      "body": "<p>Launched on 13 February 2024 by the Government of India, PM Surya Ghar aims to install rooftop solar on 1 crore households by 2027. The scheme has a total outlay of ₹75,021 crore and is administered by the Ministry of New and Renewable Energy (MNRE).</p><p>The name translates to ''Free Electricity for Every Home'' — though ''free'' refers to the subsidy covering a significant portion of installation cost, not free electricity indefinitely. After installation, you save ₹15,000–₹18,000 annually on electricity bills for a typical 3 kW system, effectively getting 300 units of free electricity per month.</p><p>This is a successor and expansion of earlier rooftop solar subsidy schemes, offering higher per-kW rates and a vastly simplified application process through a <a href=\"/in/solar-subsidy/\">unified national portal</a>.</p>"
    },
    {
      "heading": "Subsidy Rates and Structure",
      "body": "<p>The subsidy follows a tiered structure designed to maximise benefit for smaller systems:</p><table><thead><tr><th>System Size</th><th>Subsidy Rate</th><th>Total Subsidy</th><th>Typical System Cost (before)</th><th>Net Cost (after subsidy)</th></tr></thead><tbody><tr><td>1 kW</td><td>₹30,000/kW</td><td>₹30,000</td><td>₹60,000–₹80,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2 kW</td><td>₹30,000/kW</td><td>₹60,000</td><td>₹1,10,000–₹1,40,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3 kW</td><td>₹30,000/kW (first 2) + ₹18,000/kW (3rd)</td><td>₹78,000</td><td>₹1,50,000–₹1,90,000</td><td>₹72,000–₹1,12,000</td></tr><tr><td>5 kW</td><td>Capped at 3 kW</td><td>₹78,000</td><td>₹2,50,000–₹3,20,000</td><td>₹1,72,000–₹2,42,000</td></tr><tr><td>10 kW</td><td>Capped at 3 kW</td><td>₹78,000</td><td>₹5,00,000–₹6,50,000</td><td>₹4,22,000–₹5,72,000</td></tr></tbody></table><p><strong>Key point:</strong> The subsidy caps at ₹78,000 regardless of system size above 3 kW. For systems larger than 3 kW, the per-kW subsidy benefit decreases.</p><p>→ <a href=\"/in/rooftop-solar/cost/\">See complete cost breakdown by system size</a></p>"
    },
    {
      "heading": "Who Is Eligible?",
      "body": "<p>Eligibility under PM Surya Ghar is straightforward but strict:</p><ul><li><strong>Residential consumers only</strong> — You must have a domestic electricity connection with a valid consumer number from your DISCOM</li><li><strong>One subsidy per household</strong> — Linked to your electricity consumer number. Multiple applications from the same household are rejected</li><li><strong>On-grid systems only</strong> — Off-grid and hybrid systems with batteries do not qualify for the central subsidy</li><li><strong>MNRE-empanelled vendor</strong> — Installation must be done by a registered vendor listed on the PM Surya Ghar portal</li><li><strong>BIS-certified equipment</strong> — Panels and inverters must carry Bureau of Indian Standards certification</li><li><strong>Roof ownership</strong> — You must own the roof or have documented permission (housing society resolution for apartments)</li></ul><p>Government employees, pensioners, and all income groups are eligible — there is no income cap.</p><p>→ <a href=\"/in/solar-subsidy/eligibility/\">Detailed eligibility criteria and edge cases</a></p>"
    },
    {
      "heading": "How to Apply: Step-by-Step",
      "body": "<p>The application process is online and takes about 15–20 minutes:</p><ol><li><strong>Register on the national portal</strong> — Visit the PM Surya Ghar website. Register with your electricity consumer number, mobile number, and email</li><li><strong>Submit application</strong> — Fill in roof details, preferred system size, and upload electricity bill. Portal auto-calculates your subsidy amount</li><li><strong>Receive feasibility approval</strong> — Your DISCOM verifies your connection and approves the technical feasibility (7–15 days)</li><li><strong>Select empanelled vendor</strong> — Choose from MNRE-registered installers listed on the portal. Solar Vipani installers are empanelled</li><li><strong>Installation</strong> — Vendor installs the system (1–3 days for residential). Must match the approved system size and specifications</li><li><strong>Net meter installation</strong> — DISCOM installs the bi-directional meter and commissions the system</li><li><strong>DISCOM inspection</strong> — Technical inspection and commissioning report generation</li><li><strong>Subsidy credit</strong> — After successful inspection, subsidy is credited to your bank account via DBT within 30–90 days</li></ol><p>→ <a href=\"/in/solar-subsidy/how-to-apply/\">Detailed application walkthrough with screenshots</a></p>"
    },
    {
      "heading": "Documents Required",
      "body": "<p>Keep these ready before starting your application:</p><ul><li>Recent electricity bill (not older than 3 months)</li><li>Aadhaar card (linked to mobile number for DBT)</li><li>Bank account details (for subsidy credit — must match Aadhaar-linked account)</li><li>Passport-size photograph</li><li>Roof ownership proof or housing society NOC (for apartments)</li><li>PAN card (optional but recommended)</li></ul><p>Your installer will additionally need to upload the installation completion certificate, net metering application, and commissioning report on the portal.</p><p>→ <a href=\"/in/solar-subsidy/documents-required/\">Complete document checklist with requirements</a></p>"
    },
    {
      "heading": "Subsidy Disbursement Timeline",
      "body": "<p>After installation, the subsidy follows a defined processing pipeline:</p><table><thead><tr><th>Stage</th><th>Timeline</th><th>Who Acts</th></tr></thead><tbody><tr><td>Installation completion</td><td>1–7 days</td><td>Vendor</td></tr><tr><td>Net meter installation</td><td>15–30 days</td><td>DISCOM</td></tr><tr><td>DISCOM inspection</td><td>7–15 days after meter</td><td>DISCOM</td></tr><tr><td>Commissioning report upload</td><td>3–7 days</td><td>DISCOM/Vendor</td></tr><tr><td>Subsidy processing</td><td>15–30 days</td><td>MNRE/DISCOM</td></tr><tr><td>DBT credit to bank</td><td>7–15 days</td><td>Government</td></tr></tbody></table><p><strong>Total typical timeline:</strong> 45–90 days from installation to subsidy credit. Some DISCOMs like BESCOM (Karnataka) process faster than average, while others may take up to 120 days.</p><p>Track your application status on the PM Surya Ghar portal using your application number.</p>"
    },
    {
      "heading": "State Top-Up Subsidies",
      "body": "<p>Some states offer additional subsidies on top of PM Surya Ghar. These are funded by the state government and processed separately:</p><ul><li><strong>Gujarat</strong> — ₹10,000/kW additional (up to 10 kW) through Surya Gujarat scheme</li><li><strong>Rajasthan</strong> — ₹5,000–₹10,000/kW for BPL and rural households</li><li><strong>Uttarakhand</strong> — Additional ₹15,000 flat subsidy for systems up to 3 kW</li><li><strong>Madhya Pradesh</strong> — Additional top-up for rural and tribal areas</li></ul><p>State subsidies change with annual budget allocations. Always verify current availability with your DISCOM or installer before finalising.</p><p>→ <a href=\"/in/solar-subsidy/state-wise/\">Complete state-wise subsidy directory</a></p>"
    },
    {
      "heading": "Get Your Subsidy-Inclusive Quote",
      "body": "<p>The subsidy process is straightforward when you work with the right installer. Solar Vipani connects you with MNRE-empanelled installers who handle the complete paperwork — from portal registration to subsidy disbursement follow-up.</p><p>Fill one form and receive 2–3 quotes from verified local installers. Every quote includes your exact subsidy amount and net out-of-pocket cost.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with subsidy calculation →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is PM Surya Ghar Yojana?",
      "answer": "PM Surya Ghar Muft Bijli Yojana is the central government''s rooftop solar subsidy scheme launched in 2024. It offers up to ₹78,000 direct subsidy for residential on-grid solar systems. The subsidy is ₹30,000/kW for the first 2 kW and ₹18,000/kW for the 3rd kW, credited directly to your bank account after installation."
    },
    {
      "question": "How do I apply for PM Surya Ghar subsidy?",
      "answer": "Register on the PM Surya Ghar national portal with your electricity consumer number. Submit your application with roof details and electricity bill. After DISCOM approval, choose an MNRE-empanelled installer, get the system installed, and the subsidy is credited to your bank account after DISCOM inspection."
    },
    {
      "question": "How long does it take to get the PM Surya Ghar subsidy amount?",
      "answer": "The subsidy is typically credited 45–90 days after installation. The timeline includes DISCOM net meter installation (15–30 days), inspection (7–15 days), and subsidy processing (15–30 days). Track your status on the PM Surya Ghar portal using your application number."
    },
    {
      "question": "Can I get PM Surya Ghar subsidy for a 5 kW or 10 kW system?",
      "answer": "Yes, you can install any system size, but the subsidy caps at ₹78,000 (the 3 kW level). For a 5 kW system, you still get ₹78,000 subsidy. For a 10 kW system, the same ₹78,000 applies. The per-kW subsidy benefit decreases as system size increases beyond 3 kW."
    },
    {
      "question": "Is PM Surya Ghar subsidy available for off-grid solar systems?",
      "answer": "No. PM Surya Ghar subsidy is available only for on-grid (grid-connected) rooftop solar systems. Off-grid systems with batteries and standalone solar setups do not qualify. Hybrid systems may qualify for the on-grid portion, but this depends on your DISCOM''s policy."
    },
    {
      "question": "Can tenants apply for PM Surya Ghar subsidy?",
      "answer": "The subsidy is linked to the electricity consumer number and roof ownership. Tenants cannot directly apply unless the electricity connection is in their name and the landlord provides written consent for rooftop installation. In practice, the property owner typically applies."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'pm-surya-ghar' AND pillar_slug = 'solar-subsidy';


-- 3. CLUSTER: central-government
UPDATE seo_pages SET
  h1 = 'Central Government Solar Subsidy 2026: All Schemes & Benefits Explained',
  meta_title = 'Central Government Solar Subsidy India 2026: PM Surya Ghar & MNRE Schemes | Solar Vipani',
  meta_description = 'Complete guide to central government solar subsidies — PM Surya Ghar, MNRE capital subsidy, accelerated depreciation, and KUSUM scheme. Know what you qualify for.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The central government offers solar subsidies primarily through <strong>PM Surya Ghar Yojana</strong> (up to ₹78,000 for residential rooftop solar) and <strong>PM-KUSUM</strong> (for agricultural solar pumps). Residential homeowners benefit most from PM Surya Ghar, which provides ₹30,000/kW for systems up to 2 kW and ₹18,000/kW for the 3rd kW. Commercial establishments can claim 40% accelerated depreciation on solar assets under the Income Tax Act.</p>"
    },
    {
      "heading": "Overview of Central Solar Subsidy Schemes",
      "body": "<p>The Ministry of New and Renewable Energy (MNRE) administers India''s central solar subsidy programmes. These schemes target different consumer categories:</p><table><thead><tr><th>Scheme</th><th>Target</th><th>Benefit</th><th>Status (2026)</th></tr></thead><tbody><tr><td>PM Surya Ghar</td><td>Residential consumers</td><td>Up to ₹78,000 direct subsidy</td><td>Active (until 2027)</td></tr><tr><td>PM-KUSUM</td><td>Farmers</td><td>60% subsidy on solar pumps</td><td>Active</td></tr><tr><td>Accelerated Depreciation</td><td>Commercial/Industrial</td><td>40% depreciation in Year 1</td><td>Active</td></tr><tr><td>VGF for Solar Parks</td><td>Developers</td><td>Viability gap funding</td><td>Project-based</td></tr><tr><td>CPSU Scheme</td><td>Government buildings</td><td>Capital subsidy for govt installations</td><td>Active</td></tr></tbody></table><p>For homeowners, <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a> is the only directly applicable scheme and the one that delivers the most tangible savings.</p>"
    },
    {
      "heading": "PM Surya Ghar: The Primary Residential Subsidy",
      "body": "<p>PM Surya Ghar Muft Bijli Yojana is by far the most impactful central scheme for homeowners. Key features:</p><ul><li><strong>Budget:</strong> ₹75,021 crore allocated for the scheme period (2024–2027)</li><li><strong>Target:</strong> 1 crore households across India</li><li><strong>Subsidy:</strong> ₹30,000/kW (up to 2 kW) + ₹18,000/kW (3rd kW) = max ₹78,000</li><li><strong>Disbursement:</strong> Direct Benefit Transfer (DBT) to bank account</li><li><strong>Eligibility:</strong> Any residential consumer with a valid DISCOM connection</li></ul><p>The scheme replaced the earlier Phase II grid-connected rooftop solar programme and offers higher subsidy rates with a simplified application process through a unified national portal.</p><p>→ <a href=\"/in/solar-subsidy/pm-surya-ghar/\">Complete PM Surya Ghar guide with application steps</a></p>"
    },
    {
      "heading": "MNRE Guidelines and Quality Standards",
      "body": "<p>MNRE sets the technical standards that all subsidised installations must meet. These are non-negotiable for subsidy eligibility:</p><ul><li><strong>Panel certification:</strong> Must carry BIS (IS 14286) certification. IEC certification alone is not sufficient for subsidy</li><li><strong>Inverter certification:</strong> Must be BIS-certified (IS 16169 for grid-tied inverters)</li><li><strong>Vendor empanelment:</strong> Installer must be registered on the PM Surya Ghar portal as an empanelled vendor with valid credentials</li><li><strong>System design:</strong> Must comply with MNRE technical specifications for mounting, wiring, earthing, and protection systems</li><li><strong>Warranty requirements:</strong> Minimum 25-year panel warranty and 5-year inverter warranty</li></ul><p>These standards exist to protect consumers and ensure system quality. Working with an MNRE-empanelled installer like those on Solar Vipani guarantees compliance.</p><p>→ <a href=\"/in/solar-subsidy/mnre-guidelines/\">Detailed MNRE technical guidelines</a></p>"
    },
    {
      "heading": "Accelerated Depreciation for Businesses",
      "body": "<p>Commercial and industrial solar installations don''t qualify for PM Surya Ghar subsidies, but they benefit from <strong>accelerated depreciation</strong> under Section 32 of the Income Tax Act:</p><ul><li><strong>Depreciation rate:</strong> 40% in the first year on the total solar asset cost</li><li><strong>Benefit:</strong> Significant tax saving — on a ₹10 lakh commercial solar system, you can claim ₹4 lakh depreciation in Year 1</li><li><strong>Eligibility:</strong> Any business that owns the solar system (not leased) and files income tax returns</li><li><strong>Combination:</strong> Cannot be combined with PM Surya Ghar subsidy (residential only), but can be used alongside state incentives for commercial systems</li></ul><p>For businesses with high tax liability, accelerated depreciation can be more valuable than a direct subsidy. A 5 kW commercial rooftop system at ₹3,00,000 with 40% depreciation saves ₹1,20,000 in Year 1 taxes (at 30% tax rate).</p><p>→ <a href=\"/in/solar-subsidy/commercial-subsidy/\">Commercial solar incentives in detail</a></p>"
    },
    {
      "heading": "PM-KUSUM Scheme for Farmers",
      "body": "<p>PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan) is the central government''s scheme for agricultural solar. It has three components:</p><ol><li><strong>Component A:</strong> 10,000 MW of decentralised ground-mounted solar power plants on barren/fallow agricultural land</li><li><strong>Component B:</strong> Installation of 20 lakh standalone solar-powered agricultural pumps</li><li><strong>Component C:</strong> Solarisation of 15 lakh existing grid-connected agricultural pumps</li></ol><p>Under Components B and C, farmers get a combined central + state subsidy of up to 60%, paying only 40% of the pump cost (with loan options for their share).</p><p>→ <a href=\"/in/solar-pumps/kusum-yojana/\">Complete KUSUM scheme guide for solar pumps</a></p>"
    },
    {
      "heading": "Central vs State Subsidies: How They Stack",
      "body": "<p>Central and state subsidies operate independently and can be combined where available:</p><table><thead><tr><th>Feature</th><th>Central Subsidy (PM Surya Ghar)</th><th>State Subsidy</th></tr></thead><tbody><tr><td>Funding source</td><td>MNRE / central budget</td><td>State government / DISCOM</td></tr><tr><td>Availability</td><td>All states</td><td>Select states only</td></tr><tr><td>Maximum amount</td><td>₹78,000 (for 3 kW)</td><td>Varies: ₹5,000–₹30,000/kW</td></tr><tr><td>Disbursement</td><td>DBT to bank account</td><td>DBT or bill credit (varies)</td></tr><tr><td>Application</td><td>PM Surya Ghar portal</td><td>State/DISCOM portal</td></tr></tbody></table><p>In the best-case scenario (e.g., Gujarat), a 3 kW system can receive ₹78,000 central + ₹30,000 state = <strong>₹1,08,000 total subsidy</strong>, bringing the net cost below ₹60,000.</p><p>→ <a href=\"/in/solar-subsidy/state-wise/\">Check your state''s additional subsidy</a></p>"
    },
    {
      "heading": "How to Maximise Your Central Government Subsidy",
      "body": "<p>Follow these principles to get the full benefit:</p><ol><li><strong>Size your system at 3 kW</strong> — This maximises the per-kW subsidy. Going above 3 kW still gets only ₹78,000</li><li><strong>Choose an MNRE-empanelled vendor</strong> — Non-empanelled vendors cannot process your subsidy. Solar Vipani only lists empanelled installers</li><li><strong>Ensure BIS-certified equipment</strong> — Reject quotes using non-BIS panels or inverters, even if cheaper. Subsidy will be denied</li><li><strong>Apply before installation</strong> — Register on the portal first, get feasibility approval, then proceed with installation</li><li><strong>Keep documents ready</strong> — Aadhaar linked to bank account, recent electricity bill, and roof ownership proof</li></ol><p>The most common reason for subsidy rejection is using a non-empanelled vendor or non-certified equipment. Avoid this by working with verified installers.</p>"
    },
    {
      "heading": "Get Quotes from Subsidy-Eligible Installers",
      "body": "<p>Every installer on Solar Vipani is MNRE-empanelled and authorised to process PM Surya Ghar subsidies. Your quote will include the exact subsidy amount and your net out-of-pocket cost.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with subsidy calculation →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What central government subsidy is available for rooftop solar in 2026?",
      "answer": "The primary central subsidy is PM Surya Ghar Yojana, offering ₹30,000/kW for the first 2 kW and ₹18,000/kW for the 3rd kW — a maximum of ₹78,000 for a 3 kW residential system. The scheme is active until 2027 and available to all residential consumers across India."
    },
    {
      "question": "Can commercial businesses get central government solar subsidy?",
      "answer": "Commercial and industrial consumers do not qualify for PM Surya Ghar (residential only). However, businesses can claim 40% accelerated depreciation on solar assets under Section 32 of the Income Tax Act, which provides significant tax savings. Some states also offer separate incentives for commercial solar."
    },
    {
      "question": "What is the difference between central and state solar subsidy?",
      "answer": "Central subsidy (PM Surya Ghar) is funded by MNRE and available nationwide at fixed rates. State subsidies are additional incentives funded by state governments, available only in select states, and vary in amount. Both can be combined where state subsidies exist — maximising your total benefit."
    },
    {
      "question": "Is the KUSUM scheme part of the solar subsidy?",
      "answer": "PM-KUSUM is a separate central scheme specifically for agricultural solar. It provides up to 60% subsidy (central + state combined) for solar water pumps and solarisation of existing farm pumps. It is not related to rooftop solar for homes, which falls under PM Surya Ghar."
    },
    {
      "question": "What happens if my subsidy application is rejected?",
      "answer": "Common rejection reasons include: non-empanelled vendor, non-BIS certified equipment, incomplete documents, or duplicate application. You can re-apply after correcting the issue. Check rejection reason on the PM Surya Ghar portal and consult your installer for resolution."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'central-government' AND pillar_slug = 'solar-subsidy';

COMMIT;
