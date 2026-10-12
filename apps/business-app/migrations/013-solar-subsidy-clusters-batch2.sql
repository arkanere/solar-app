-- Solar Subsidy Clusters Batch 2: eligibility + how-to-apply + state-wise + net-metering
-- Run: psql $POSTGRES_URL < 013-solar-subsidy-clusters-batch2.sql

BEGIN;

-- 1. CLUSTER: eligibility
UPDATE seo_pages SET
  h1 = 'Solar Subsidy Eligibility in India 2026: Who Qualifies & Who Doesn''t',
  meta_title = 'Solar Subsidy Eligibility India 2026: Complete Checklist | Solar Vipani',
  meta_description = 'Check if you qualify for solar subsidy under PM Surya Ghar. Residential eligibility, property requirements, technical criteria, and common disqualification reasons.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>You qualify for the <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a> solar subsidy if you are a <strong>residential electricity consumer</strong> with a valid DISCOM connection, installing an <strong>on-grid rooftop solar system</strong> through an <strong>MNRE-empanelled vendor</strong> using <strong>BIS-certified equipment</strong>. There is no income cap. One subsidy per household, linked to your electricity consumer number.</p>"
    },
    {
      "heading": "Residential Consumer Eligibility",
      "body": "<p>The fundamental requirement is a domestic/residential electricity connection. Here is what qualifies and what does not:</p><table><thead><tr><th>Eligible</th><th>Not Eligible</th></tr></thead><tbody><tr><td>Individual homeowners with domestic tariff</td><td>Commercial/industrial electricity consumers</td></tr><tr><td>Flat owners in apartments (with society NOC)</td><td>Agricultural connections (covered under KUSUM)</td></tr><tr><td>Government employees and pensioners</td><td>Institutional consumers (schools, hospitals)</td></tr><tr><td>All income groups — no income cap</td><td>Consumers with temporary connections</td></tr><tr><td>Properties with existing solar (for expansion)</td><td>Consumers with arrears on electricity bills</td></tr></tbody></table><p>The subsidy is linked to your electricity consumer number, not your Aadhaar. One consumer number = one subsidy application. If you have two residential connections (e.g., house + farmhouse), you can technically apply for both.</p>"
    },
    {
      "heading": "Property and Roof Requirements",
      "body": "<p>Your property must meet these physical requirements:</p><ul><li><strong>Roof ownership:</strong> You must own the roof where panels will be installed. Tenants need written landlord consent plus the electricity connection must be in the applicant''s name</li><li><strong>Structural soundness:</strong> The roof must support the weight of solar panels (15–20 kg/sqm). Most RCC and concrete roofs qualify. Asbestos roofs may need structural assessment</li><li><strong>Shadow-free area:</strong> Minimum 100 sq ft of shadow-free roof space per kW. A 3 kW system needs ~300 sq ft of unshaded area</li><li><strong>Roof access:</strong> Safe access for installation and maintenance. Panels are mounted facing south at a 10–15° tilt for optimal output in India</li></ul><p>For apartments, the housing society must pass a resolution authorising rooftop solar installation and allocating roof space to participating flat owners.</p>"
    },
    {
      "heading": "Technical Requirements",
      "body": "<p>The solar system itself must meet MNRE technical standards:</p><ul><li><strong>System type:</strong> Must be on-grid (grid-connected). Off-grid systems with batteries do not qualify for central subsidy</li><li><strong>Panel certification:</strong> Solar panels must carry BIS certification (IS 14286). International certifications like IEC alone are insufficient</li><li><strong>Inverter certification:</strong> Grid-tied inverters must be BIS-certified (IS 16169)</li><li><strong>Vendor empanelment:</strong> Installation must be done by a vendor registered on the PM Surya Ghar portal. Non-empanelled vendors cannot process your subsidy</li><li><strong>Minimum warranty:</strong> 25-year performance warranty on panels, 5-year warranty on inverter</li><li><strong>Net metering:</strong> System must be configured for net metering with the local DISCOM</li></ul><p>These requirements are non-negotiable. Even one missing certification results in subsidy rejection.</p><p>→ <a href=\"/in/solar-subsidy/mnre-guidelines/\">Complete MNRE technical guidelines</a></p>"
    },
    {
      "heading": "Who Is NOT Eligible",
      "body": "<p>These categories are explicitly excluded from PM Surya Ghar:</p><ul><li><strong>Commercial and industrial consumers</strong> — Businesses should explore <a href=\"/in/solar-subsidy/commercial-subsidy/\">accelerated depreciation and commercial incentives</a></li><li><strong>Agricultural connections</strong> — Farmers are covered under <a href=\"/in/solar-pumps/kusum-yojana/\">PM-KUSUM scheme</a> for solar pumps</li><li><strong>Off-grid installations</strong> — Battery-based standalone systems do not qualify</li><li><strong>Non-empanelled vendor installations</strong> — Even if the system meets all technical specs, subsidy is denied if the vendor is not registered</li><li><strong>Duplicate applications</strong> — Second application from the same consumer number is auto-rejected</li><li><strong>Consumers with outstanding DISCOM dues</strong> — Clear all arrears before applying</li></ul>"
    },
    {
      "heading": "Eligibility for Apartments and Housing Societies",
      "body": "<p>Apartment dwellers face additional requirements but are fully eligible:</p><ol><li><strong>Society resolution:</strong> The RWA or housing society must pass a formal resolution authorising solar installation on the common terrace</li><li><strong>Roof allocation:</strong> Each participating flat owner gets a proportional roof space allocation. A 100-flat society with 10,000 sq ft of usable roof can allocate 100 sq ft per flat</li><li><strong>Individual applications:</strong> Each flat owner applies separately on the PM Surya Ghar portal with their individual consumer number</li><li><strong>Group net metering:</strong> Some DISCOMs offer group net metering where the entire building acts as one entity. Others require individual net meters per flat</li><li><strong>Subsidy per flat:</strong> Each flat owner receives subsidy proportional to their installed capacity, up to the ₹78,000 cap</li></ol><p>→ <a href=\"/in/rooftop-solar/for-apartments/\">Solar for apartments — complete guide</a></p>"
    },
    {
      "heading": "How to Verify Your Eligibility",
      "body": "<p>Before starting the application process, verify your eligibility in 3 steps:</p><ol><li><strong>Check your electricity bill</strong> — Confirm it shows ''domestic'' or ''residential'' tariff category. The consumer number printed on the bill is what you''ll use to register</li><li><strong>Verify your DISCOM</strong> — Check if your DISCOM is active on the PM Surya Ghar portal. All major DISCOMs (MSEDCL, BESCOM, TPDDL, BSES, UHBVNL, etc.) are registered</li><li><strong>Assess your roof</strong> — Ensure you have at least 100 sq ft of shadow-free roof space per kW. An installer can do a free site survey to confirm</li></ol><p>Use our <a href=\"/in/tools/subsidy-checker/\">Subsidy Checker tool</a> to instantly verify your eligibility and see the exact subsidy amount for your system size and state.</p>"
    },
    {
      "heading": "Ready to Check Your Eligibility?",
      "body": "<p>Solar Vipani''s verified installers can confirm your eligibility during a free site assessment. They check roof space, structural suitability, shading, and DISCOM compatibility — and provide a quote with your exact subsidy amount.</p><p><a href=\"/in/get-quotes/\">Get a free site assessment and subsidy-inclusive quote →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is there an income limit for solar subsidy in India?",
      "answer": "No. PM Surya Ghar has no income cap. Any residential electricity consumer — regardless of income level — can apply. The subsidy is linked to your electricity consumer number, not your income. Government employees, pensioners, and all income groups qualify equally."
    },
    {
      "question": "Can I get solar subsidy if I already have a solar system?",
      "answer": "If your existing system was installed without subsidy, you may be eligible for subsidy on a new or expanded system. However, if you already received subsidy under any previous MNRE scheme on the same consumer number, you cannot apply again. Check the PM Surya Ghar portal for your application history."
    },
    {
      "question": "Do tenants qualify for solar subsidy?",
      "answer": "Tenants face practical barriers: the electricity connection must be in the applicant''s name, and you need roof ownership or landlord consent. In most cases, the property owner applies for the subsidy. If the connection is in the tenant''s name and the landlord consents, it is technically possible."
    },
    {
      "question": "Is solar subsidy available for commercial properties?",
      "answer": "PM Surya Ghar subsidy is for residential consumers only. Commercial and industrial properties can benefit from 40% accelerated depreciation under the Income Tax Act and may access state-level commercial solar incentives. Some states offer separate schemes for MSME and commercial solar."
    },
    {
      "question": "Can NRIs apply for solar subsidy in India?",
      "answer": "Yes, if the NRI owns a residential property in India with a domestic electricity connection in their name. The Aadhaar card and bank account for DBT must be Indian. A family member with power of attorney can manage the application process on their behalf."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'eligibility' AND pillar_slug = 'solar-subsidy';


-- 2. CLUSTER: how-to-apply
UPDATE seo_pages SET
  h1 = 'How to Apply for Solar Subsidy in India: Step-by-Step Guide (2026)',
  meta_title = 'How to Apply for Solar Subsidy India 2026: PM Surya Ghar Application Guide | Solar Vipani',
  meta_description = 'Step-by-step guide to applying for solar subsidy under PM Surya Ghar. Portal registration, DISCOM approval, vendor selection, installation, and subsidy disbursement.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Apply for solar subsidy through the <strong>PM Surya Ghar national portal</strong>: register with your electricity consumer number, get DISCOM feasibility approval (7–15 days), select an MNRE-empanelled installer, complete installation, and receive the subsidy via DBT to your bank account within 45–90 days of installation. The entire process from application to subsidy credit takes 2–4 months.</p>"
    },
    {
      "heading": "Before You Apply: Pre-Application Checklist",
      "body": "<p>Gather these before starting your application:</p><ul><li><strong>Latest electricity bill</strong> — Not older than 3 months. Note your consumer number and tariff category (must be ''domestic'')</li><li><strong>Aadhaar card</strong> — Must be linked to your mobile number (for OTP verification) and bank account (for DBT)</li><li><strong>Bank account details</strong> — Account must match Aadhaar-linked account. IFSC code and account number needed</li><li><strong>Passport-size photo</strong> — Digital copy for upload</li><li><strong>Roof ownership proof</strong> — Property tax receipt, sale deed, or housing society NOC for apartments</li></ul><p>Verify your <a href=\"/in/solar-subsidy/eligibility/\">eligibility</a> before proceeding. The most common application delays come from mismatched Aadhaar-bank details or incorrect consumer numbers.</p><p>→ <a href=\"/in/solar-subsidy/documents-required/\">Complete document checklist</a></p>"
    },
    {
      "heading": "Step 1: Register on the PM Surya Ghar Portal",
      "body": "<p>Visit the official PM Surya Ghar national portal and create your account:</p><ol><li>Click ''Apply for Rooftop Solar'' on the homepage</li><li>Select your state and electricity distribution company (DISCOM)</li><li>Enter your electricity consumer number exactly as printed on your bill</li><li>Verify with OTP sent to your registered mobile number</li><li>Fill in personal details: name, Aadhaar number, address, bank account</li><li>Upload your electricity bill and roof photograph</li></ol><p>The portal auto-verifies your consumer number with the DISCOM database. If verification fails, contact your DISCOM to ensure your consumer number is active and updated.</p>"
    },
    {
      "heading": "Step 2: DISCOM Feasibility Approval",
      "body": "<p>After registration, your DISCOM reviews the application for technical feasibility:</p><ul><li><strong>Timeline:</strong> 7–15 working days (varies by DISCOM)</li><li><strong>What they check:</strong> Transformer capacity in your area, existing solar load on the feeder, and your sanctioned load</li><li><strong>System size limit:</strong> Most DISCOMs allow rooftop solar up to your sanctioned load. A 5 kW sanctioned load means you can install up to 5 kW</li><li><strong>Approval notification:</strong> You receive an SMS and email when feasibility is approved</li></ul><p>If feasibility is rejected (rare — usually due to transformer overload), you can appeal or reduce your proposed system size. Your DISCOM or installer can advise on the maximum allowable capacity.</p>"
    },
    {
      "heading": "Step 3: Select an MNRE-Empanelled Vendor",
      "body": "<p>After feasibility approval, select an installer from the empanelled vendor list on the portal:</p><ul><li>The portal shows MNRE-registered vendors available in your area</li><li>Compare vendor ratings, past installations, and quoted prices</li><li>Contact 2–3 vendors for detailed quotes and site assessment</li><li>Confirm the vendor on the portal after finalising your choice</li></ul><p><strong>Critical:</strong> Only vendors registered on the PM Surya Ghar portal can process your subsidy. Using an unregistered installer — even a good one — will void your subsidy eligibility.</p><p>Solar Vipani simplifies this step. All installers on our platform are MNRE-empanelled. <a href=\"/in/get-quotes/\">Get quotes from verified vendors →</a></p>"
    },
    {
      "heading": "Step 4: Installation and Commissioning",
      "body": "<p>Your chosen vendor handles the complete installation:</p><ol><li><strong>Site survey</strong> — Vendor assesses roof structure, orientation, shading, and electrical setup (1 day)</li><li><strong>System design</strong> — Panel layout, inverter sizing, and wiring plan finalised</li><li><strong>Installation</strong> — Panels, inverter, mounting structure, and wiring installed (1–3 days for residential)</li><li><strong>Testing</strong> — System tested for output, safety, and grid compatibility</li><li><strong>Portal update</strong> — Vendor uploads installation photos, equipment details, and serial numbers on the PM Surya Ghar portal</li></ol><p>The installation must match the approved system size and use the exact equipment brands declared. Any changes require portal update before DISCOM inspection.</p><p>→ <a href=\"/in/solar-installation/process/\">Detailed installation process guide</a></p>"
    },
    {
      "heading": "Step 5: Net Metering and DISCOM Inspection",
      "body": "<p>After installation, the final steps before subsidy disbursement:</p><ol><li><strong>Net metering application</strong> — Your vendor applies to the DISCOM for bi-directional meter installation (often done simultaneously with system installation)</li><li><strong>Meter installation</strong> — DISCOM replaces your existing meter with a bi-directional net meter (15–30 days)</li><li><strong>DISCOM inspection</strong> — Technical team inspects the installation for safety and code compliance (7–15 days after meter)</li><li><strong>Commissioning certificate</strong> — DISCOM issues a commissioning report and uploads it to the portal</li></ol><p>This is the stage where most delays occur. Active follow-up with your DISCOM through the installer accelerates the process.</p><p>→ <a href=\"/in/solar-subsidy/net-metering/\">Net metering process explained</a></p>"
    },
    {
      "heading": "Step 6: Subsidy Disbursement",
      "body": "<p>After DISCOM commissioning, the subsidy is processed:</p><ul><li>DISCOM uploads the commissioning report to the PM Surya Ghar portal</li><li>MNRE verifies the installation details against approved specifications</li><li>Subsidy amount is calculated based on installed capacity (not applied-for capacity)</li><li>Amount is credited to your Aadhaar-linked bank account via Direct Benefit Transfer (DBT)</li><li><strong>Timeline:</strong> 15–45 days after commissioning report upload</li></ul><p><strong>Total time from application to subsidy:</strong> 2–4 months typically. Track status on the portal using your application number.</p>"
    },
    {
      "heading": "Common Application Mistakes to Avoid",
      "body": "<p>Avoid these pitfalls that cause delays or rejections:</p><ol><li><strong>Aadhaar-bank mismatch</strong> — Ensure your Aadhaar is linked to the bank account you provide. DBT will fail otherwise</li><li><strong>Wrong consumer number</strong> — Copy the number exactly from your bill, including any leading zeros or special characters</li><li><strong>Non-empanelled vendor</strong> — Verify your installer is registered on the portal before signing any contract</li><li><strong>Applying after installation</strong> — Register and get feasibility approval before starting installation, not after</li><li><strong>Non-BIS equipment</strong> — Ensure panels and inverter carry BIS marks. Ask your vendor for certificates</li><li><strong>Incomplete documents</strong> — Upload all required documents in the specified format. Blurry or cropped uploads get rejected</li></ol>"
    },
    {
      "heading": "Start Your Subsidy Application Today",
      "body": "<p>The process is simpler than it looks — especially with an experienced installer managing the paperwork. Solar Vipani''s verified installers handle everything from portal registration assistance to DISCOM coordination and subsidy follow-up.</p><p><a href=\"/in/get-quotes/\">Get free quotes from MNRE-empanelled installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How long does the solar subsidy application process take?",
      "answer": "From portal registration to subsidy credit, the process typically takes 2–4 months. Feasibility approval takes 7–15 days, installation 1–7 days, net metering 15–30 days, DISCOM inspection 7–15 days, and subsidy processing 15–45 days. Active follow-up through your installer can shorten the timeline."
    },
    {
      "question": "Can I apply for solar subsidy after installing the system?",
      "answer": "No. You must register on the PM Surya Ghar portal and receive DISCOM feasibility approval before starting installation. Applying after installation will result in rejection. The correct sequence is: register → get approval → select vendor → install → get subsidy."
    },
    {
      "question": "What if my DISCOM feasibility is rejected?",
      "answer": "Feasibility rejection is rare and usually happens when the local transformer is overloaded with solar connections. You can appeal, request a smaller system size, or wait until the DISCOM upgrades the transformer. Your installer can advise on the maximum allowable capacity in your area."
    },
    {
      "question": "Do I need to pay the installer the full amount upfront?",
      "answer": "Payment terms vary by installer. Most require 50–70% advance before installation and the balance after commissioning. The subsidy is credited to your bank account separately — it does not go to the installer. Some installers offer financing where you pay only the post-subsidy amount upfront."
    },
    {
      "question": "Can I track my solar subsidy application status?",
      "answer": "Yes. Log in to the PM Surya Ghar national portal with your registered credentials. Your dashboard shows the current status: registration, feasibility, installation, inspection, and subsidy processing. You also receive SMS updates at each stage."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'how-to-apply' AND pillar_slug = 'solar-subsidy';


-- 3. CLUSTER: state-wise
UPDATE seo_pages SET
  h1 = 'State-Wise Solar Subsidy in India 2026: Every State Compared',
  meta_title = 'State-Wise Solar Subsidy India 2026: All States Compared | Solar Vipani',
  meta_description = 'Compare solar subsidies across all Indian states. Central + state top-ups, DISCOM policies, net metering rules, and application links for every major state.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Every Indian state receives the <a href=\"/in/solar-subsidy/central-government/\">central PM Surya Ghar subsidy</a> of up to ₹78,000. A few states — notably <strong>Gujarat, Rajasthan, and Uttarakhand</strong> — offer additional state-level top-ups of ₹5,000–₹15,000 per kW. Most other states provide only the central subsidy. The real differentiator across states is DISCOM processing speed and net metering policy, not the subsidy amount itself.</p>"
    },
    {
      "heading": "How State Subsidies Work Alongside Central Subsidy",
      "body": "<p>India''s solar subsidy structure has two independent layers:</p><ul><li><strong>Central subsidy (PM Surya Ghar):</strong> Uniform across all states. ₹30,000/kW up to 2 kW + ₹18,000/kW for 3rd kW. Maximum ₹78,000. Funded by MNRE</li><li><strong>State subsidy:</strong> Additional incentive from the state government or DISCOM. Available in select states only. Funded by state budget. Amount and eligibility vary by state and financial year</li></ul><p>Both subsidies are credited independently — central via DBT from MNRE, state via the state/DISCOM mechanism. You apply for central subsidy on the PM Surya Ghar portal and for state subsidy on the respective state portal (where applicable).</p>"
    },
    {
      "heading": "State-Wise Subsidy Comparison Table",
      "body": "<p>Here is the current subsidy landscape across major Indian states (as of 2026):</p><table><thead><tr><th>State</th><th>Central Subsidy</th><th>State Top-Up</th><th>Total (3 kW)</th><th>Key DISCOM</th></tr></thead><tbody><tr><td>Gujarat</td><td>₹78,000</td><td>₹10,000/kW</td><td>~₹1,08,000</td><td>UGVCL, MGVCL, PGVCL, DGVCL</td></tr><tr><td>Rajasthan</td><td>₹78,000</td><td>₹5,000–₹10,000/kW</td><td>~₹93,000–₹1,08,000</td><td>JVVNL, AVVNL, JdVVNL</td></tr><tr><td>Uttarakhand</td><td>₹78,000</td><td>₹15,000 flat</td><td>~₹93,000</td><td>UPCL</td></tr><tr><td>Maharashtra</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>MSEDCL</td></tr><tr><td>Karnataka</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>BESCOM, MESCOM, HESCOM, CESC, GESCOM</td></tr><tr><td>Tamil Nadu</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>TANGEDCO</td></tr><tr><td>Kerala</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>KSEB</td></tr><tr><td>Madhya Pradesh</td><td>₹78,000</td><td>Varies (rural areas)</td><td>₹78,000+</td><td>MPEB (MPPKVVCL, MPMKVVCL)</td></tr><tr><td>Uttar Pradesh</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>UPPCL (DVVNL, MVVNL, PVVNL, etc.)</td></tr><tr><td>Haryana</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>UHBVNL, DHBVNL</td></tr><tr><td>Punjab</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>PSPCL</td></tr><tr><td>Delhi</td><td>₹78,000</td><td>Generation incentive (₹2/unit for 5 years)</td><td>₹78,000 + generation bonus</td><td>BSES Rajdhani, BSES Yamuna, TPDDL, NDMC</td></tr></tbody></table><p><em>State subsidies are subject to budget availability and policy changes. Verify current status with your DISCOM before committing.</em></p>"
    },
    {
      "heading": "States with Best Solar Subsidy Benefits",
      "body": "<p>Factoring in central subsidy, state top-ups, net metering generosity, and DISCOM efficiency, these states offer the best overall package:</p><ol><li><strong>Gujarat</strong> — Highest combined subsidy (₹1,08,000 for 3 kW). Surya Gujarat portal streamlines the state top-up. All four DISCOMs process efficiently. India''s solar leader in rooftop adoption</li><li><strong>Delhi</strong> — Central subsidy plus unique generation-based incentive of ₹2/unit exported for 5 years. With high electricity tariffs (₹8–₹12/unit), Delhi homeowners see the fastest payback in India</li><li><strong>Rajasthan</strong> — Additional state top-up for select categories. Excellent solar irradiance (5.5–6.0 peak sun hours) means higher generation per kW</li><li><strong>Karnataka (BESCOM)</strong> — No state top-up, but BESCOM has one of the fastest net metering approval processes in India. Fully online application</li></ol>"
    },
    {
      "heading": "Net Metering Policies by State",
      "body": "<p>Net metering rules vary significantly and directly affect your savings:</p><table><thead><tr><th>State</th><th>Settlement</th><th>Max Capacity</th><th>Credit Validity</th></tr></thead><tbody><tr><td>Maharashtra</td><td>Annual (April–March)</td><td>Up to sanctioned load</td><td>12 months rolling</td></tr><tr><td>Karnataka</td><td>Annual</td><td>Up to 100% of sanctioned load</td><td>12 months</td></tr><tr><td>Gujarat</td><td>Annual</td><td>Up to sanctioned load</td><td>12 months</td></tr><tr><td>Tamil Nadu</td><td>Bi-annual</td><td>Up to 90% of sanctioned load</td><td>6 months</td></tr><tr><td>Delhi</td><td>Annual</td><td>Up to sanctioned load</td><td>12 months</td></tr><tr><td>Uttar Pradesh</td><td>Annual</td><td>Up to sanctioned load</td><td>12 months</td></tr><tr><td>Rajasthan</td><td>Annual</td><td>Up to sanctioned load</td><td>12 months</td></tr></tbody></table><p>Annual settlement is most favourable — excess generation in sunny months offsets consumption in monsoon. States with shorter settlement periods (like Tamil Nadu''s bi-annual) may result in lost credits if you over-generate.</p><p>→ <a href=\"/in/solar-subsidy/net-metering/\">Complete net metering guide</a></p>"
    },
    {
      "heading": "DISCOM Processing Speed: What to Expect",
      "body": "<p>Your DISCOM''s efficiency determines how long the overall process takes. Based on installer experience across our network:</p><ul><li><strong>Fast (30–60 days total):</strong> BESCOM (Karnataka), UGVCL (Gujarat), BSES/TPDDL (Delhi)</li><li><strong>Moderate (60–90 days):</strong> MSEDCL (Maharashtra), TANGEDCO (Tamil Nadu), PSPCL (Punjab)</li><li><strong>Slow (90–120+ days):</strong> Some UP DISCOMs, certain rural DISCOMs with heavy backlog</li></ul><p>These timelines cover feasibility approval through commissioning and subsidy credit. Your installer''s experience with the specific DISCOM matters — an empanelled installer with strong DISCOM relationships can cut weeks off the process.</p>"
    },
    {
      "heading": "How to Find Your State''s Current Subsidy",
      "body": "<p>State subsidy policies change with annual budgets. To get the latest information:</p><ol><li><strong>PM Surya Ghar portal</strong> — Shows central subsidy (always current) and may list active state schemes</li><li><strong>Your DISCOM''s website</strong> — Most DISCOMs have a dedicated ''Rooftop Solar'' or ''Net Metering'' section</li><li><strong>State renewable energy development agency</strong> — GEDA (Gujarat), HAREDA (Haryana), RRECL (Rajasthan), etc.</li><li><strong>Ask your installer</strong> — Experienced local installers know the latest state policies and can guide you</li></ol><p>Use our <a href=\"/in/tools/subsidy-checker/\">Subsidy Checker</a> to see the combined central + state subsidy for your specific location and system size.</p>"
    },
    {
      "heading": "Get State-Specific Quotes",
      "body": "<p>Solar Vipani connects you with local, MNRE-empanelled installers who know your state''s subsidy landscape inside out. Your quote includes both central and state subsidies applicable to your location.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes for your state →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which Indian state gives the highest solar subsidy?",
      "answer": "Gujarat offers the highest combined subsidy — ₹78,000 central (PM Surya Ghar) plus ₹10,000/kW state top-up through the Surya Gujarat scheme, totalling approximately ₹1,08,000 for a 3 kW system. Delhi offers a unique generation incentive of ₹2/unit for 5 years on top of the central subsidy."
    },
    {
      "question": "Is the solar subsidy same in all states?",
      "answer": "The central subsidy (PM Surya Ghar) is the same across all states — up to ₹78,000 for a 3 kW system. However, some states offer additional top-up subsidies funded by the state government. Most states currently provide only the central subsidy without any state top-up."
    },
    {
      "question": "How do I know if my state has an additional solar subsidy?",
      "answer": "Check your state renewable energy development agency website, your DISCOM''s rooftop solar section, or the PM Surya Ghar portal. You can also use our Subsidy Checker tool or ask a local installer — they stay updated on state policy changes."
    },
    {
      "question": "Does the subsidy amount change every year?",
      "answer": "The central subsidy (PM Surya Ghar) is fixed for the scheme period 2024–2027. State subsidies can change with annual budget allocations — some states add, modify, or discontinue top-ups each financial year. Always verify current state subsidy status before finalising your installation."
    },
    {
      "question": "Can I apply for subsidy if my state does not have a top-up?",
      "answer": "Yes, absolutely. The central PM Surya Ghar subsidy is available in every state regardless of state-level schemes. Even without a state top-up, you get up to ₹78,000 subsidy, which reduces a 3 kW system cost by 40–50%."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'state-wise' AND pillar_slug = 'solar-subsidy';


-- 4. CLUSTER: net-metering
UPDATE seo_pages SET
  h1 = 'Net Metering for Solar in India 2026: How It Works & State Rules',
  meta_title = 'Net Metering for Solar India 2026: Rules, Process & State Policies | Solar Vipani',
  meta_description = 'How net metering works for rooftop solar in India. Understand credit calculation, state-wise policies, DISCOM process, and how net metering maximises your savings.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Net metering lets you <strong>export surplus solar electricity to the grid and receive credits</strong> on your electricity bill. Your DISCOM installs a bi-directional meter that tracks power flowing both ways. At billing time, you pay only for the <strong>net consumption</strong> (units imported minus units exported). Most Indian states settle credits annually, meaning summer surplus offsets monsoon shortfall.</p>"
    },
    {
      "heading": "How Net Metering Works",
      "body": "<p>The mechanism is straightforward:</p><ol><li><strong>Daytime generation:</strong> Your solar panels produce electricity. Your home consumes what it needs instantly</li><li><strong>Surplus export:</strong> Any electricity your home doesn''t consume flows to the grid through the bi-directional meter</li><li><strong>Nighttime import:</strong> After sunset, you draw power from the grid as usual</li><li><strong>Bi-directional metering:</strong> The meter records both import and export separately</li><li><strong>Billing:</strong> Your DISCOM calculates net consumption = units imported − units exported. You pay only for the net</li><li><strong>Credit carry-forward:</strong> If you exported more than imported in a billing cycle, the surplus carries forward as credit to the next cycle</li></ol><p>The grid essentially acts as a free battery — storing your daytime surplus and returning it at night. This is why <a href=\"/in/rooftop-solar/on-grid/\">on-grid systems</a> are the most cost-effective choice for most Indian homeowners.</p>"
    },
    {
      "heading": "Net Metering vs Net Billing vs Gross Metering",
      "body": "<p>India uses three solar metering arrangements. Understanding the difference is critical:</p><table><thead><tr><th>Feature</th><th>Net Metering</th><th>Net Billing</th><th>Gross Metering</th></tr></thead><tbody><tr><td>Self-consumption</td><td>Yes — use solar first</td><td>Yes — use solar first</td><td>No — all power goes to grid</td></tr><tr><td>Credit calculation</td><td>kWh for kWh (1:1)</td><td>Export at feed-in tariff (lower rate)</td><td>All generation at feed-in tariff</td></tr><tr><td>Settlement</td><td>Monthly/Annual</td><td>Monthly</td><td>Monthly</td></tr><tr><td>Best for</td><td>Maximum savings</td><td>States transitioning away from net metering</td><td>Large systems, commercial</td></tr></tbody></table><p><strong>Net metering</strong> gives you the best deal because each unit exported offsets one unit imported at full retail tariff (₹5–₹12/unit). Net billing pays you a lower feed-in rate (₹2–₹3/unit) for exports, which is less favourable.</p><p>Most states currently offer net metering for residential systems. Some are transitioning to net billing for systems above a certain capacity (typically 10 kW). Confirm your DISCOM''s current policy.</p>"
    },
    {
      "heading": "How Credits Are Calculated",
      "body": "<p>Let''s walk through a real example for a 3 kW system in Maharashtra (MSEDCL):</p><table><thead><tr><th>Month</th><th>Units Generated</th><th>Units Consumed</th><th>Exported to Grid</th><th>Imported from Grid</th><th>Net Bill</th></tr></thead><tbody><tr><td>March (sunny)</td><td>450</td><td>300</td><td>200</td><td>50</td><td>Pay for: 50 − 200 = −150 (credit)</td></tr><tr><td>April (peak sun)</td><td>480</td><td>350</td><td>220</td><td>90</td><td>Pay for: 90 − 220 = −130 (credit)</td></tr><tr><td>July (monsoon)</td><td>280</td><td>320</td><td>80</td><td>120</td><td>Pay for: 120 − 80 = 40 units</td></tr></tbody></table><p><strong>Key insight:</strong> In sunny months, you build up credits that offset monsoon months when generation drops. With annual settlement, these credits accumulate for 12 months — perfect for India''s seasonal variation.</p><p>Your total annual savings depend on system size, consumption pattern, and tariff slab. Use our <a href=\"/in/tools/solar-calculator/\">Solar Calculator</a> for a personalised estimate.</p>"
    },
    {
      "heading": "Net Metering Process: Getting Connected",
      "body": "<p>Net metering setup is part of the <a href=\"/in/solar-subsidy/how-to-apply/\">solar subsidy application process</a>. Your installer handles most of it:</p><ol><li><strong>Application:</strong> Vendor submits net metering application to your DISCOM (done during subsidy process)</li><li><strong>Technical feasibility:</strong> DISCOM checks transformer capacity and feeder load (7–15 days)</li><li><strong>Meter procurement:</strong> DISCOM procures or you purchase a bi-directional meter (per DISCOM policy)</li><li><strong>Meter installation:</strong> DISCOM replaces your existing meter with the bi-directional meter (15–30 days)</li><li><strong>Testing:</strong> System is tested for proper grid synchronisation and safety</li><li><strong>Commissioning:</strong> DISCOM issues commissioning certificate, net metering goes live</li></ol><p>Cost for the bi-directional meter varies: some DISCOMs provide it free, others charge ₹2,000–₹5,000. Your installer can clarify the local policy.</p>"
    },
    {
      "heading": "State-Wise Net Metering Rules",
      "body": "<p>Key net metering policy differences across states:</p><table><thead><tr><th>State</th><th>Metering Type</th><th>Settlement Period</th><th>Max System Size</th><th>Excess Credit Rate</th></tr></thead><tbody><tr><td>Maharashtra</td><td>Net metering</td><td>Annual (Apr–Mar)</td><td>Sanctioned load</td><td>₹2.25/unit</td></tr><tr><td>Karnataka</td><td>Net metering</td><td>Annual</td><td>100% sanctioned load</td><td>APPC rate</td></tr><tr><td>Gujarat</td><td>Net metering</td><td>Annual</td><td>Sanctioned load</td><td>₹2.25/unit</td></tr><tr><td>Delhi</td><td>Net metering</td><td>Annual</td><td>Sanctioned load</td><td>APPC rate + ₹2 incentive</td></tr><tr><td>Tamil Nadu</td><td>Net metering (up to 10 kW); net billing above</td><td>Bi-annual</td><td>90% sanctioned load</td><td>Feed-in tariff</td></tr><tr><td>Uttar Pradesh</td><td>Net metering</td><td>Annual</td><td>Sanctioned load</td><td>₹2.00/unit</td></tr></tbody></table><p><strong>Excess credit rate</strong> applies when your annual export exceeds import — the DISCOM buys the net surplus at the listed rate. This is usually much lower than retail tariff, so size your system to match (not exceed) your consumption.</p>"
    },
    {
      "heading": "Maximising Your Net Metering Savings",
      "body": "<p>These strategies help you get the most from net metering:</p><ol><li><strong>Right-size your system:</strong> Match system capacity to your annual consumption. Over-sizing means exporting surplus at low buy-back rates</li><li><strong>Shift heavy loads to daytime:</strong> Run washing machines, water heaters, and dishwashers during peak solar hours (10 AM – 3 PM) to maximise self-consumption</li><li><strong>Annual settlement states are better:</strong> If your state offers annual settlement, seasonal variation balances out naturally</li><li><strong>Monitor your meter:</strong> Track import/export readings monthly to understand your consumption pattern and adjust if needed</li><li><strong>Avoid system oversizing:</strong> A system generating more than 110% of your annual consumption wastes money on low buy-back rates</li></ol><p>The optimal system size typically matches 80–100% of your annual electricity consumption.</p><p>→ <a href=\"/in/rooftop-solar/cost/\">System sizing and cost guide</a></p>"
    },
    {
      "heading": "Common Net Metering Questions Resolved",
      "body": "<p>Addressing the practical concerns homeowners raise most often:</p><ul><li><strong>What happens during power cuts?</strong> — On-grid inverters shut down during grid outages for safety (anti-islanding). You will not have solar power during a grid outage unless you have a <a href=\"/in/rooftop-solar/hybrid/\">hybrid system</a> with battery</li><li><strong>Will my meter run backwards?</strong> — Old-style electromechanical meters could literally spin backwards. Modern bi-directional digital meters record import and export separately. Both values are printed on your bill</li><li><strong>Do I still pay any fixed charges?</strong> — Yes. Net metering offsets energy charges only. Fixed charges, demand charges, and regulatory surcharges still apply as per your DISCOM tariff</li></ul>"
    },
    {
      "heading": "Get Net Metering Set Up With Your Solar Installation",
      "body": "<p>Net metering is included in every rooftop solar installation from our verified installers. They handle the complete DISCOM process — application, meter coordination, and commissioning.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with net metering included →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is net metering for solar panels?",
      "answer": "Net metering is a billing arrangement where your DISCOM installs a bi-directional meter that tracks electricity flowing to and from the grid. Surplus solar power you generate during the day is exported to the grid and earns credits. At billing time, you pay only for the net consumption (imports minus exports)."
    },
    {
      "question": "Do I earn money from net metering?",
      "answer": "Net metering primarily reduces your bill rather than earning you money. If your annual exports exceed imports, the DISCOM buys the surplus at a low rate (₹2–₹3/unit) — much less than the retail tariff you save by self-consuming. For maximum savings, size your system to match your consumption rather than over-produce."
    },
    {
      "question": "Is net metering mandatory for solar subsidy?",
      "answer": "Yes. PM Surya Ghar subsidy requires an on-grid system with net metering. The DISCOM must install a bi-directional meter and commission the system before the subsidy is processed. Off-grid systems without net metering do not qualify for the central subsidy."
    },
    {
      "question": "How much does a net meter cost?",
      "answer": "Bi-directional meter costs range from free (provided by some DISCOMs) to ₹2,000–₹5,000 (purchased by consumer). Some DISCOMs include the meter cost in their processing fee. Your installer will inform you about your specific DISCOM''s policy."
    },
    {
      "question": "What happens to unused net metering credits?",
      "answer": "In most states with annual settlement, unused credits at year-end are bought back by the DISCOM at a low rate (₹2–₹3/unit) called the APPC rate. Some states allow credit carry-forward for another year. The policy varies — check with your DISCOM."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'net-metering' AND pillar_slug = 'solar-subsidy';

COMMIT;
