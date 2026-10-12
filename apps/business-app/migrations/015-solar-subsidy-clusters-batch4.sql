-- Solar Subsidy Clusters Batch 4: commercial-subsidy + mnre-guidelines + subsidy-calculator + latest-updates
-- Run: psql $POSTGRES_URL < 015-solar-subsidy-clusters-batch4.sql

BEGIN;

-- 1. CLUSTER: commercial-subsidy
UPDATE seo_pages SET
  h1 = 'Commercial Solar Subsidy in India 2026: Tax Benefits & Incentives for Businesses',
  meta_title = 'Commercial Solar Subsidy India 2026: Accelerated Depreciation & Business Incentives | Solar Vipani',
  meta_description = 'Solar incentives for commercial and industrial businesses in India. Accelerated depreciation (40%), state incentives, OPEX models, and financing options.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Commercial and industrial businesses <strong>do not qualify for PM Surya Ghar</strong> (residential only) but benefit from <strong>40% accelerated depreciation</strong> under the Income Tax Act, reducing Year 1 tax liability significantly. Some states offer additional incentives for commercial solar. OPEX/PPA models let businesses go solar with zero upfront investment. For a 100 kW commercial system costing ₹50–₹60 lakh, accelerated depreciation saves ₹6–₹7 lakh in taxes in the first year alone.</p>"
    },
    {
      "heading": "Accelerated Depreciation: The Primary Business Incentive",
      "body": "<p>Section 32 of the Income Tax Act allows businesses to claim <strong>40% depreciation on solar assets in the first year</strong> of installation:</p><table><thead><tr><th>System Cost</th><th>Year 1 Depreciation (40%)</th><th>Tax Saving (at 25% rate)</th><th>Tax Saving (at 30% rate)</th></tr></thead><tbody><tr><td>₹10 lakh</td><td>₹4 lakh</td><td>₹1,00,000</td><td>₹1,20,000</td></tr><tr><td>₹25 lakh</td><td>₹10 lakh</td><td>₹2,50,000</td><td>₹3,00,000</td></tr><tr><td>₹50 lakh</td><td>₹20 lakh</td><td>₹5,00,000</td><td>₹6,00,000</td></tr><tr><td>₹1 crore</td><td>₹40 lakh</td><td>₹10,00,000</td><td>₹12,00,000</td></tr></tbody></table><p><strong>Eligibility:</strong> Any business entity that owns the solar system (not leased/rented), files income tax returns, and has sufficient taxable income to absorb the depreciation.</p><p>The remaining 60% of the asset value is depreciated at the normal rate (15%) over subsequent years.</p>"
    },
    {
      "heading": "Why PM Surya Ghar Doesn''t Apply to Businesses",
      "body": "<p>PM Surya Ghar Yojana is exclusively for <strong>residential electricity consumers</strong> — those with domestic tariff connections from their DISCOM. Businesses with commercial, industrial, or institutional connections are excluded.</p><p>This distinction is based on your electricity connection type, not property type. A home office with a domestic connection qualifies; a shop with a commercial connection does not.</p><p>However, the accelerated depreciation benefit for businesses often exceeds the residential subsidy in absolute terms — a ₹50 lakh commercial system saves ₹6+ lakh in taxes, compared to the ₹78,000 residential subsidy cap.</p>"
    },
    {
      "heading": "CAPEX vs OPEX Models for Commercial Solar",
      "body": "<p>Businesses can go solar through two financial models:</p><table><thead><tr><th>Feature</th><th>CAPEX (Buy)</th><th>OPEX / PPA (Subscribe)</th></tr></thead><tbody><tr><td>Ownership</td><td>You own the system</td><td>Developer owns, you buy power</td></tr><tr><td>Upfront cost</td><td>Full system cost</td><td>Zero</td></tr><tr><td>Depreciation benefit</td><td>Yes (40% Year 1)</td><td>No (developer claims it)</td></tr><tr><td>Power rate</td><td>Free after payback</td><td>₹3.5–₹5/unit PPA rate (lower than grid)</td></tr><tr><td>Maintenance</td><td>Your responsibility</td><td>Developer''s responsibility</td></tr><tr><td>Contract period</td><td>N/A</td><td>15–25 years</td></tr><tr><td>Best for</td><td>Profitable businesses with tax liability</td><td>Businesses wanting zero investment</td></tr></tbody></table><p>CAPEX with accelerated depreciation gives the highest total savings. OPEX/PPA suits businesses that prefer zero upfront investment and predictable energy costs.</p>"
    },
    {
      "heading": "State-Level Commercial Solar Incentives",
      "body": "<p>Some states offer additional incentives for commercial solar beyond the central depreciation benefit:</p><ul><li><strong>Gujarat:</strong> Industrial solar policy with dedicated feeder and open access provisions for large installations</li><li><strong>Maharashtra:</strong> Green energy open access for installations above 1 MW. Net metering available for commercial up to sanctioned load</li><li><strong>Karnataka:</strong> Commercial net metering through BESCOM for systems up to 1 MW</li><li><strong>Rajasthan:</strong> Solar park allotments and open access incentives for industrial consumers</li><li><strong>Tamil Nadu:</strong> Solar RPO (Renewable Purchase Obligation) banking and open access provisions</li></ul><p>State incentive structures for commercial solar are more complex than residential and often depend on system size, connection voltage, and industry category. Consult a solar consultant or experienced installer for your specific case.</p>"
    },
    {
      "heading": "Net Metering for Commercial Systems",
      "body": "<p>Most DISCOMs offer net metering for commercial rooftop systems, but rules differ from residential:</p><ul><li><strong>Size limit:</strong> Typically up to sanctioned load or 1 MW, whichever is lower</li><li><strong>Tariff offset:</strong> Commercial tariffs (₹8–₹14/unit) are higher than residential, making solar savings proportionally larger</li><li><strong>Demand charges:</strong> Solar reduces peak demand, which can lower demand charges on your commercial bill</li><li><strong>TOD tariff benefit:</strong> Solar generates most during peak hours (10 AM – 4 PM) when time-of-day tariffs are highest</li></ul><p>A 50 kW commercial rooftop system in Maharashtra (MSEDCL commercial tariff ~₹11/unit) can save ₹5–₹7 lakh annually.</p><p>→ <a href=\"/in/solar-subsidy/net-metering/\">Net metering explained</a></p>"
    },
    {
      "heading": "Solar Financing for Businesses",
      "body": "<p>Multiple financing options make commercial solar accessible:</p><ul><li><strong>Term loan:</strong> Banks offer solar-specific loans at 8–12% interest, 5–7 year tenure. EMI is typically less than current electricity bill</li><li><strong>Green bonds:</strong> Large corporates can issue green bonds to finance solar installations</li><li><strong>OPEX/PPA:</strong> Third-party installs and maintains the system. You pay a fixed per-unit rate lower than grid tariff</li><li><strong>Equipment leasing:</strong> Lease the system with option to buy. Monthly lease < monthly savings</li></ul><p>→ <a href=\"/in/solar-financing/solar-loan/\">Solar loan options and rates</a></p>"
    },
    {
      "heading": "ROI for Commercial Solar Installations",
      "body": "<p>Commercial solar delivers even faster payback than residential due to higher tariffs:</p><table><thead><tr><th>System Size</th><th>Cost</th><th>Annual Savings</th><th>Payback (with depreciation)</th><th>25-Year Savings</th></tr></thead><tbody><tr><td>10 kW</td><td>₹5–₹6 lakh</td><td>₹1.0–₹1.4 lakh</td><td>3–4 years</td><td>₹25–₹35 lakh</td></tr><tr><td>50 kW</td><td>₹25–₹30 lakh</td><td>₹5–₹7 lakh</td><td>3–4 years</td><td>₹1.2–₹1.7 crore</td></tr><tr><td>100 kW</td><td>₹50–₹60 lakh</td><td>₹10–₹14 lakh</td><td>3–4 years</td><td>₹2.5–₹3.5 crore</td></tr></tbody></table><p><em>Savings include accelerated depreciation tax benefit. Tariff escalation assumed at 5% annually.</em></p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your commercial solar ROI</a></p>"
    },
    {
      "heading": "Get a Commercial Solar Assessment",
      "body": "<p>Solar Vipani connects businesses with experienced commercial solar installers who handle everything from system design to DISCOM approvals and financing assistance.</p><p><a href=\"/in/get-quotes/\">Get free commercial solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is there a government subsidy for commercial solar in India?",
      "answer": "There is no direct capital subsidy like PM Surya Ghar for commercial consumers. However, businesses benefit from 40% accelerated depreciation under the Income Tax Act, which provides significant tax savings. Some states offer additional incentives for commercial solar installations."
    },
    {
      "question": "How much can a business save with accelerated depreciation on solar?",
      "answer": "A business can depreciate 40% of the solar system cost in Year 1. On a ₹50 lakh system at a 30% corporate tax rate, this translates to ₹6 lakh in tax savings in the first year alone. The remaining asset value is depreciated over subsequent years at the normal rate."
    },
    {
      "question": "What is the payback period for commercial solar?",
      "answer": "Commercial rooftop solar typically pays back in 3–4 years when combining electricity savings and accelerated depreciation tax benefits. After payback, the system generates essentially free electricity for the remaining 20+ years of its life."
    },
    {
      "question": "Can a shop or office building install solar with net metering?",
      "answer": "Yes. Most DISCOMs offer net metering for commercial establishments up to their sanctioned load. Commercial tariffs are higher than residential, so the per-unit savings are actually larger. Contact your DISCOM or an installer for your specific net metering eligibility."
    },
    {
      "question": "What is a solar PPA for businesses?",
      "answer": "A Power Purchase Agreement (PPA) lets a business go solar with zero upfront investment. A solar developer installs and owns the system on your roof. You buy the generated power at a fixed rate (₹3.5–₹5/unit) — lower than grid tariff. The agreement typically runs 15–25 years."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'commercial-subsidy' AND pillar_slug = 'solar-subsidy';


-- 2. CLUSTER: mnre-guidelines
UPDATE seo_pages SET
  h1 = 'MNRE Solar Guidelines 2026: Technical Standards & Empanelment Rules',
  meta_title = 'MNRE Solar Guidelines India 2026: BIS Standards & Vendor Empanelment | Solar Vipani',
  meta_description = 'MNRE technical guidelines for rooftop solar — BIS certification requirements, vendor empanelment criteria, quality standards, and compliance rules for subsidy eligibility.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The Ministry of New and Renewable Energy (MNRE) sets the <strong>technical standards</strong> that all subsidised rooftop solar installations in India must follow. Key requirements: <strong>BIS-certified panels</strong> (IS 14286), <strong>BIS-certified inverters</strong> (IS 16169), installation by an <strong>MNRE-empanelled vendor</strong>, and compliance with safety standards for earthing, wiring, and protection systems. Non-compliance means subsidy rejection.</p>"
    },
    {
      "heading": "What Is MNRE and Why Do Its Guidelines Matter?",
      "body": "<p>MNRE (Ministry of New and Renewable Energy) is the central government ministry responsible for India''s renewable energy policy. For rooftop solar, MNRE:</p><ul><li>Designs and funds subsidy schemes (PM Surya Ghar, KUSUM)</li><li>Sets technical standards for subsidised installations</li><li>Manages vendor empanelment for the PM Surya Ghar portal</li><li>Coordinates with DISCOMs for scheme implementation</li><li>Monitors installation quality and consumer grievances</li></ul><p>MNRE guidelines are non-negotiable for <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a>. Even a technically sound installation with non-BIS equipment will be denied subsidy. These standards exist to protect consumers from substandard equipment that fails prematurely.</p>"
    },
    {
      "heading": "BIS Certification Requirements for Solar Panels",
      "body": "<p>Solar panels used in subsidised installations must carry Bureau of Indian Standards (BIS) certification:</p><table><thead><tr><th>Standard</th><th>Covers</th><th>What It Ensures</th></tr></thead><tbody><tr><td>IS 14286 (Part 1)</td><td>Crystalline silicon PV modules</td><td>Design qualification and type approval</td></tr><tr><td>IS 14286 (Part 2)</td><td>Thin-film PV modules</td><td>Design qualification for thin-film technology</td></tr><tr><td>IS 61730</td><td>PV module safety</td><td>Electrical and mechanical safety certification</td></tr></tbody></table><p><strong>How to verify:</strong> Every BIS-certified panel has a BIS mark (ISI mark) on the module label along with the license number. Your installer should provide the BIS certificate for the specific panel model being used.</p><p>Note: IEC certification (international standard) is not sufficient for Indian subsidy. The panel must have Indian BIS certification specifically.</p>"
    },
    {
      "heading": "BIS Certification Requirements for Inverters",
      "body": "<p>Grid-tied inverters must meet these BIS standards:</p><table><thead><tr><th>Standard</th><th>Covers</th><th>Key Feature</th></tr></thead><tbody><tr><td>IS 16169</td><td>Grid-connected PV inverters</td><td>Grid synchronisation and anti-islanding safety</td></tr><tr><td>IS 16221</td><td>Grid interaction of PV systems</td><td>Power quality and voltage regulation</td></tr></tbody></table><p><strong>Anti-islanding</strong> is critical — the inverter must automatically disconnect from the grid during a power outage to prevent backfeeding (which could endanger lineworkers). All BIS-certified grid-tied inverters include this safety feature.</p><p>Off-grid inverters and hybrid inverters with battery storage have separate standards but are generally not eligible for PM Surya Ghar subsidy (which requires on-grid systems only).</p>"
    },
    {
      "heading": "Vendor Empanelment: Who Can Install Subsidised Systems",
      "body": "<p>Only MNRE-empanelled vendors can install systems that qualify for PM Surya Ghar subsidy. Empanelment requirements include:</p><ul><li><strong>Business registration:</strong> Valid company/firm registration (LLP, Pvt Ltd, proprietorship)</li><li><strong>Technical capability:</strong> Demonstrated experience in rooftop solar installation</li><li><strong>Certified manpower:</strong> Trained technicians with MNRE/NSDC-recognised solar installer certification</li><li><strong>Financial standing:</strong> Minimum turnover and net worth requirements</li><li><strong>Insurance:</strong> Public liability insurance covering installation work</li><li><strong>After-sales commitment:</strong> Warranty service infrastructure in the regions they operate</li></ul><p>Empanelled vendors are listed on the PM Surya Ghar portal. Solar Vipani only works with empanelled installers — every installer on our platform is verified.</p><p><a href=\"/in/get-quotes/\">Find empanelled installers in your area →</a></p>"
    },
    {
      "heading": "Installation Quality Standards",
      "body": "<p>MNRE specifies technical requirements for the installation itself:</p><ul><li><strong>Mounting structure:</strong> Hot-dip galvanised iron or anodised aluminium. Must withstand wind loads as per IS 875 for your location</li><li><strong>Wiring:</strong> UV-resistant DC cables (4 sq mm or 6 sq mm depending on system size). AC wiring per Indian Electricity Rules</li><li><strong>Earthing:</strong> Double earthing mandatory — one for the panel frame/mounting structure, one for the inverter. Resistance below 5 ohms</li><li><strong>Protection devices:</strong> DC isolator, AC isolator, surge protection device (SPD), miniature circuit breakers (MCBs)</li><li><strong>Panel orientation:</strong> South-facing at 10–15° tilt angle (optimised for Indian latitudes)</li><li><strong>Cable routing:</strong> Protected conduits, no exposed DC cables. Proper labelling of all connections</li></ul><p>DISCOM inspectors check these parameters during the <a href=\"/in/solar-subsidy/application-process/\">commissioning inspection</a>. Deficiencies delay subsidy processing.</p>"
    },
    {
      "heading": "Warranty Requirements",
      "body": "<p>MNRE mandates minimum warranty periods for subsidised installations:</p><table><thead><tr><th>Component</th><th>Minimum Warranty</th><th>Typical Market Warranty</th></tr></thead><tbody><tr><td>Solar panels</td><td>25-year performance warranty</td><td>25-year linear (≥80% at year 25)</td></tr><tr><td>Inverter</td><td>5-year product warranty</td><td>5–10 years (extendable to 15)</td></tr><tr><td>Mounting structure</td><td>5-year warranty</td><td>10–15 years against corrosion</td></tr><tr><td>Workmanship</td><td>5-year warranty</td><td>Varies by installer</td></tr></tbody></table><p>Insist on written warranty cards from your installer. In case of equipment failure, you deal with the installer (under workmanship warranty) or the equipment manufacturer (under product warranty).</p>"
    },
    {
      "heading": "Compliance Checklist for Homeowners",
      "body": "<p>Before your DISCOM inspection, verify these with your installer:</p><ul><li>☐ Panels have BIS mark (IS 14286) visible on module label</li><li>☐ Inverter has BIS mark (IS 16169) on the unit</li><li>☐ Installer is listed as empanelled vendor on PM Surya Ghar portal</li><li>☐ Double earthing installed and tested (resistance < 5 ohms)</li><li>☐ DC and AC isolators installed and accessible</li><li>☐ Surge protection device installed</li><li>☐ All wiring in conduits, properly labelled</li><li>☐ System generating power and exporting to grid</li></ul><p>Your installer is responsible for compliance, but knowing the checklist protects you.</p>"
    },
    {
      "heading": "Questions About Compliance?",
      "body": "<p>Solar Vipani''s empanelled installers follow all MNRE guidelines by default. Every installation meets BIS, safety, and quality standards required for subsidy eligibility.</p><p><a href=\"/in/get-quotes/\">Get quotes from MNRE-compliant installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is BIS certification for solar panels?",
      "answer": "BIS (Bureau of Indian Standards) certification confirms that solar panels meet Indian quality and safety standards (IS 14286). It is mandatory for PM Surya Ghar subsidy eligibility. The BIS mark is printed on the panel label along with the manufacturer''s license number. IEC certification alone is not sufficient."
    },
    {
      "question": "How do I check if my installer is MNRE-empanelled?",
      "answer": "Log in to the PM Surya Ghar national portal and navigate to the vendor selection section. All empanelled vendors for your area are listed there. You can search by state and district. If a vendor is not listed, they cannot process your subsidy application."
    },
    {
      "question": "What happens if non-BIS equipment is used in my installation?",
      "answer": "Your subsidy application will be rejected during the DISCOM inspection. The inspector verifies BIS marks on panels and inverters. If non-certified equipment is found, you will need to replace it with BIS-certified components and schedule a re-inspection, adding weeks to the process."
    },
    {
      "question": "Are Chinese solar panels BIS-certified?",
      "answer": "Some Chinese manufacturers have obtained BIS certification for specific models. BIS certification is granted per product model, not per manufacturer. Verify the specific panel model''s BIS certification — your installer should provide the certificate. Many Indian brands (Tata, Adani, Waaree) also use cells sourced from various countries."
    },
    {
      "question": "What safety standards are required for rooftop solar installation?",
      "answer": "MNRE requires: double earthing (frame + inverter), DC and AC isolators, surge protection, UV-resistant wiring in conduits, anti-islanding protection in the inverter, and mounting structures rated for local wind loads. The DISCOM inspects all these during commissioning."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'mnre-guidelines' AND pillar_slug = 'solar-subsidy';


-- 3. CLUSTER: subsidy-calculator
UPDATE seo_pages SET
  h1 = 'Solar Subsidy Calculator India 2026: Calculate Your Exact Benefit',
  meta_title = 'Solar Subsidy Calculator India 2026: Know Your Exact Subsidy Amount | Solar Vipani',
  meta_description = 'Calculate your solar subsidy under PM Surya Ghar instantly. Enter system size and state to see central subsidy, state top-up, net cost, and estimated savings.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Your solar subsidy under PM Surya Ghar depends on system size: <strong>₹30,000 for 1 kW, ₹60,000 for 2 kW, ₹78,000 for 3 kW</strong> (maximum). Some states add top-ups. Use our <a href=\"/in/tools/subsidy-checker/\">Subsidy Checker tool</a> for an instant, personalised calculation based on your system size, state, and DISCOM.</p>"
    },
    {
      "heading": "How Solar Subsidy Is Calculated",
      "body": "<p>The PM Surya Ghar subsidy follows a simple tiered formula:</p><ol><li><strong>First 2 kW:</strong> ₹30,000 per kW</li><li><strong>2 to 3 kW:</strong> ₹18,000 per kW</li><li><strong>Above 3 kW:</strong> No additional subsidy (capped at ₹78,000)</li></ol><p><strong>Formula:</strong></p><ul><li>For system ≤ 2 kW: Subsidy = capacity × ₹30,000</li><li>For system 2–3 kW: Subsidy = ₹60,000 + (capacity − 2) × ₹18,000</li><li>For system > 3 kW: Subsidy = ₹78,000 (fixed)</li></ul><p>Add your state''s top-up (if applicable) for the total subsidy amount.</p>"
    },
    {
      "heading": "Subsidy by System Size: Quick Reference",
      "body": "<table><thead><tr><th>System Size</th><th>Central Subsidy</th><th>Gujarat Top-Up</th><th>Total (Gujarat)</th><th>Total (Other States)</th></tr></thead><tbody><tr><td>1 kW</td><td>₹30,000</td><td>₹10,000</td><td>₹40,000</td><td>₹30,000</td></tr><tr><td>1.5 kW</td><td>₹45,000</td><td>₹15,000</td><td>₹60,000</td><td>₹45,000</td></tr><tr><td>2 kW</td><td>₹60,000</td><td>₹20,000</td><td>₹80,000</td><td>₹60,000</td></tr><tr><td>2.5 kW</td><td>₹69,000</td><td>₹25,000</td><td>₹94,000</td><td>₹69,000</td></tr><tr><td>3 kW</td><td>₹78,000</td><td>₹30,000</td><td>₹1,08,000</td><td>₹78,000</td></tr><tr><td>4 kW</td><td>₹78,000</td><td>₹40,000</td><td>₹1,18,000</td><td>₹78,000</td></tr><tr><td>5 kW</td><td>₹78,000</td><td>₹50,000</td><td>₹1,28,000</td><td>₹78,000</td></tr><tr><td>10 kW</td><td>₹78,000</td><td>₹1,00,000</td><td>₹1,78,000</td><td>₹78,000</td></tr></tbody></table><p><em>Gujarat state top-up shown as example. Other states with top-ups have different rates. Most states offer only central subsidy.</em></p><p>→ <a href=\"/in/solar-subsidy/state-wise/\">Check your state''s additional subsidy</a></p>"
    },
    {
      "heading": "Net Cost After Subsidy",
      "body": "<p>What you actually pay out of pocket after subsidy:</p><table><thead><tr><th>System Size</th><th>Typical Cost</th><th>Subsidy (Central)</th><th>Net Cost</th><th>Savings as %</th></tr></thead><tbody><tr><td>1 kW</td><td>₹65,000–₹80,000</td><td>₹30,000</td><td>₹35,000–₹50,000</td><td>38–46%</td></tr><tr><td>2 kW</td><td>₹1,15,000–₹1,40,000</td><td>₹60,000</td><td>₹55,000–₹80,000</td><td>43–52%</td></tr><tr><td>3 kW</td><td>₹1,50,000–₹1,90,000</td><td>₹78,000</td><td>₹72,000–₹1,12,000</td><td>41–52%</td></tr><tr><td>5 kW</td><td>₹2,50,000–₹3,20,000</td><td>₹78,000</td><td>₹1,72,000–₹2,42,000</td><td>24–31%</td></tr><tr><td>10 kW</td><td>₹5,00,000–₹6,50,000</td><td>₹78,000</td><td>₹4,22,000–₹5,72,000</td><td>12–16%</td></tr></tbody></table><p>The subsidy has the biggest percentage impact on smaller systems. A 2 kW system becomes nearly half-price after subsidy.</p><p>→ <a href=\"/in/rooftop-solar/cost/\">Detailed cost breakdown by system size</a></p>"
    },
    {
      "heading": "Estimated Annual Savings After Going Solar",
      "body": "<p>Beyond the one-time subsidy, your ongoing electricity savings are the bigger financial benefit:</p><table><thead><tr><th>System Size</th><th>Monthly Generation</th><th>Annual Savings (₹6/unit avg)</th><th>Annual Savings (₹10/unit avg)</th><th>25-Year Savings</th></tr></thead><tbody><tr><td>1 kW</td><td>120–150 units</td><td>₹8,600–₹10,800</td><td>₹14,400–₹18,000</td><td>₹3–₹7 lakh</td></tr><tr><td>2 kW</td><td>240–300 units</td><td>₹17,300–₹21,600</td><td>₹28,800–₹36,000</td><td>₹6–₹14 lakh</td></tr><tr><td>3 kW</td><td>360–450 units</td><td>₹25,900–₹32,400</td><td>₹43,200–₹54,000</td><td>₹10–₹21 lakh</td></tr><tr><td>5 kW</td><td>600–750 units</td><td>₹43,200–₹54,000</td><td>₹72,000–₹90,000</td><td>₹17–₹35 lakh</td></tr></tbody></table><p><em>25-year savings include 5% annual tariff escalation. Actual savings depend on your tariff slab and consumption pattern.</em></p><p>→ <a href=\"/in/tools/solar-calculator/\">Get personalised savings calculation</a></p>"
    },
    {
      "heading": "Payback Period After Subsidy",
      "body": "<p>How quickly your solar system pays for itself:</p><ul><li><strong>1–2 kW system:</strong> 2–4 years payback (high subsidy percentage, low net cost)</li><li><strong>3 kW system:</strong> 3–5 years payback (best balance of subsidy + savings)</li><li><strong>5 kW system:</strong> 4–6 years payback (lower subsidy percentage but higher absolute savings)</li><li><strong>10 kW system:</strong> 5–7 years payback (subsidy is minimal percentage, savings driven)</li></ul><p>After payback, every unit of electricity your system generates is pure savings — for the remaining 20+ years of system life.</p><p>Homes with higher electricity tariffs (₹8+/unit) see significantly faster payback. Those in the highest tariff slabs can recover their investment in under 3 years with a 3 kW system.</p>"
    },
    {
      "heading": "Use Our Interactive Tools",
      "body": "<p>Get precise numbers for your specific situation:</p><ul><li><a href=\"/in/tools/subsidy-checker/\"><strong>Subsidy Checker</strong></a> — Enter your state and system size to see exact central + state subsidy</li><li><a href=\"/in/tools/solar-calculator/\"><strong>Solar Calculator</strong></a> — Calculate total cost, savings, payback period, and ROI based on your electricity bill</li><li><a href=\"/in/tools/emi-calculator/\"><strong>EMI Calculator</strong></a> — See monthly EMI if you finance the post-subsidy amount</li></ul>"
    },
    {
      "heading": "Or Get a Real Quote",
      "body": "<p>Calculators give estimates. For exact numbers specific to your roof, location, and energy needs, get quotes from verified installers. Every Solar Vipani quote includes precise subsidy calculation and net cost.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with exact subsidy calculation →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How do I calculate my solar subsidy amount?",
      "answer": "For systems up to 2 kW: multiply capacity by ₹30,000. For 2–3 kW: ₹60,000 + (additional kW × ₹18,000). Above 3 kW: fixed at ₹78,000. Example: 3 kW = (2 × ₹30,000) + (1 × ₹18,000) = ₹78,000. Add state top-up if your state offers one."
    },
    {
      "question": "Is there a solar subsidy calculator online?",
      "answer": "Yes. Use our Subsidy Checker tool at /in/tools/subsidy-checker/ for instant calculation based on your system size and state. The PM Surya Ghar portal also shows your subsidy amount during registration. Both give you the exact central subsidy; our tool also includes state top-ups."
    },
    {
      "question": "What is the payback period for solar panels with subsidy?",
      "answer": "With subsidy, most residential systems pay back in 3–5 years. A 3 kW system costing ₹92,000 after subsidy (central ₹78,000 on a ₹1,70,000 system) saving ₹25,000–₹35,000 annually breaks even in 3–4 years. Higher electricity tariffs mean faster payback."
    },
    {
      "question": "How much will I save on electricity after installing solar?",
      "answer": "A 3 kW system generates 360–450 units monthly, saving ₹2,000–₹4,500/month depending on your tariff. Over 25 years with tariff escalation, total savings range from ₹10–₹21 lakh. The one-time subsidy of ₹78,000 is a fraction of your lifetime savings."
    },
    {
      "question": "Should I install 3 kW to maximise subsidy or a larger system?",
      "answer": "3 kW maximises the subsidy-to-cost ratio (41–52% cost covered). But if your monthly bill exceeds ₹3,000, a larger system saves more in the long run. The subsidy is a one-time benefit; electricity savings compound for 25 years. Size based on consumption, not just subsidy."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'subsidy-calculator' AND pillar_slug = 'solar-subsidy';


-- 4. CLUSTER: latest-updates
UPDATE seo_pages SET
  h1 = 'Solar Subsidy Latest Updates India 2026: Policy Changes & News',
  meta_title = 'Solar Subsidy Latest Updates 2026: PM Surya Ghar News & Policy Changes | Solar Vipani',
  meta_description = 'Latest solar subsidy updates for India 2026. PM Surya Ghar progress, policy changes, state scheme updates, MNRE announcements, and what they mean for homeowners.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>As of 2026, <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> continues with the same subsidy rates (up to ₹78,000 for 3 kW). Over 1 crore applications have been received since launch. Key updates include faster DISCOM processing in major states, expanded vendor empanelment, and some states announcing new or revised top-up schemes. No rate changes are expected before the scheme''s 2027 target date.</p>"
    },
    {
      "heading": "PM Surya Ghar Progress: Where the Scheme Stands",
      "body": "<p>Key milestones since PM Surya Ghar launched in February 2024:</p><ul><li><strong>Applications received:</strong> Over 1 crore households have registered on the national portal</li><li><strong>Installations completed:</strong> Lakhs of systems commissioned and subsidy disbursed</li><li><strong>Budget utilisation:</strong> Scheme is well-funded with ₹75,021 crore allocated through 2027</li><li><strong>Target:</strong> 1 crore solarised households by March 2027</li></ul><p>The scheme is on track and fully funded. There is no indication of early closure or rate reduction before the 2027 deadline. This is a good time to apply — the process has been streamlined significantly since launch.</p>"
    },
    {
      "heading": "DISCOM Processing Improvements",
      "body": "<p>Several DISCOMs have improved their processing timelines in 2026:</p><ul><li><strong>BESCOM (Karnataka):</strong> Fully online process from application to commissioning. Average processing time reduced to under 45 days</li><li><strong>MSEDCL (Maharashtra):</strong> Dedicated rooftop solar cells in each division. Processing time down to 60–75 days</li><li><strong>Delhi DISCOMs (BSES, TPDDL):</strong> Integrated portal with PM Surya Ghar for seamless application. Fast-track net metering</li><li><strong>Gujarat DISCOMs:</strong> High-volume processing with batch inspections. Gujarat leads in installations</li></ul><p>The biggest improvement is in the net metering stage — previously the major bottleneck. Most large DISCOMs now process meter installations within 15–20 days versus 30–45 days earlier.</p>"
    },
    {
      "heading": "State Subsidy Updates for 2026",
      "body": "<p>Recent state-level developments:</p><ul><li><strong>Gujarat:</strong> Surya Gujarat state top-up (₹10,000/kW) continues for FY 2026-27. No changes in rates</li><li><strong>Delhi:</strong> Generation incentive of ₹2/unit for 5 years continues. Review expected in late 2026</li><li><strong>Rajasthan:</strong> Rural top-up scheme extended. Additional support for tribal and BPL categories</li><li><strong>Maharashtra:</strong> No new state top-up announced. MSEDCL continues with central subsidy processing</li><li><strong>Karnataka:</strong> BESCOM considering pilot incentive programme for apartments. Details awaited</li></ul><p>State subsidies are budget-dependent and can change with each financial year. We update this page as new announcements are made.</p><p>→ <a href=\"/in/solar-subsidy/state-wise/\">Complete state-wise subsidy details</a></p>"
    },
    {
      "heading": "Vendor Empanelment Expansion",
      "body": "<p>MNRE has expanded vendor empanelment to improve access:</p><ul><li>More installers empanelled across Tier 2 and Tier 3 cities</li><li>Simplified empanelment process attracting more qualified vendors</li><li>Portal improvements making vendor selection easier for consumers</li><li>Quality audits of existing vendors to maintain installation standards</li></ul><p>More empanelled vendors means more competition, better pricing, and faster installation timelines for consumers. If you were previously unable to find an empanelled vendor in your area, check again — coverage has expanded significantly.</p><p>Solar Vipani continuously adds newly empanelled, verified installers to our network. <a href=\"/in/get-quotes/\">Check installer availability in your area →</a></p>"
    },
    {
      "heading": "Regulatory and Policy Developments",
      "body": "<p>Broader policy changes affecting rooftop solar in India:</p><ul><li><strong>Net metering standardisation:</strong> MNRE pushing for uniform net metering regulations across states to reduce consumer confusion</li><li><strong>BIS certification streamlining:</strong> Faster BIS certification process for solar equipment manufacturers, improving component availability</li><li><strong>Green energy open access:</strong> Reforms making it easier for commercial and industrial consumers to access solar power</li><li><strong>RPO targets:</strong> Increased Renewable Purchase Obligations for DISCOMs driving grid-level solar adoption</li></ul><p>For residential consumers, the key takeaway is stability — PM Surya Ghar rates and <a href=\"/in/solar-subsidy/eligibility/\">eligibility criteria</a> remain unchanged, and the application process is getting smoother.</p>"
    },
    {
      "heading": "What This Means for You",
      "body": "<p>The solar subsidy landscape in 2026 is the most favourable it has ever been:</p><ul><li><strong>Stable subsidy rates:</strong> ₹78,000 for 3 kW, no reduction expected before 2027</li><li><strong>Faster processing:</strong> Major DISCOMs processing in 45–75 days vs 90–120 days at launch</li><li><strong>More vendors:</strong> Greater choice of empanelled installers, especially in smaller cities</li><li><strong>Proven process:</strong> Lakhs of successful installations mean the process is well-understood and documented</li></ul><p>If you have been considering rooftop solar, 2026 offers the best combination of subsidy availability, process maturity, and competitive installer pricing.</p>"
    },
    {
      "heading": "Start Your Solar Journey",
      "body": "<p>Take advantage of the current subsidy rates and improved processing. Solar Vipani''s verified installers handle the entire process from application to commissioning.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes today →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Has the PM Surya Ghar subsidy rate changed in 2026?",
      "answer": "No. The subsidy rates set at launch (₹30,000/kW up to 2 kW, ₹18,000/kW for 3rd kW, max ₹78,000) remain unchanged in 2026. The scheme is funded through 2027 with no announced rate changes. Current rates are the highest central solar subsidy India has offered."
    },
    {
      "question": "Is the PM Surya Ghar scheme still accepting applications in 2026?",
      "answer": "Yes. The scheme is actively accepting applications through the national portal. With a target of 1 crore households by 2027 and adequate budget allocation, there is no application closure in sight. Register and apply through the PM Surya Ghar portal."
    },
    {
      "question": "Are solar panel prices going down in 2026?",
      "answer": "Solar panel prices have stabilised in 2026 after years of decline. Per-watt prices are at ₹25–₹35 for quality monocrystalline panels. With stable subsidy rates and mature installer pricing, 2026 offers competitive overall system costs for homeowners."
    },
    {
      "question": "Will the solar subsidy increase in the future?",
      "answer": "PM Surya Ghar rates are fixed until 2027. Post-2027, the scheme may be extended, modified, or replaced. Historically, solar subsidies in India have decreased over time as solar becomes cheaper. Current rates are likely the highest you will see — acting now locks in the best benefit."
    },
    {
      "question": "How fast are DISCOMs processing solar applications in 2026?",
      "answer": "Major DISCOMs have improved significantly. BESCOM processes in under 45 days, MSEDCL in 60–75 days, and Delhi DISCOMs in 50–60 days. Smaller or rural DISCOMs may still take 90+ days. Your installer''s relationship with the local DISCOM significantly affects processing speed."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'latest-updates' AND pillar_slug = 'solar-subsidy';

COMMIT;
