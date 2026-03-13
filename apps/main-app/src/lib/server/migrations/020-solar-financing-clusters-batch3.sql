-- Solar Financing Clusters Batch 3: eligibility, documents-required, payback-period, lease-vs-loan
-- Run: psql $POSTGRES_URL < src/lib/server/migrations/020-solar-financing-clusters-batch3.sql

BEGIN;

-- 1. CLUSTER: eligibility
UPDATE seo_pages SET
  h1 = 'Solar Loan Eligibility in India: Requirements & How to Qualify',
  meta_title = 'Solar Loan Eligibility India 2026: Income, CIBIL & Requirements | Solar Vipani',
  meta_description = 'Check if you qualify for a solar loan. CIBIL score, income, age, and document requirements for SBI, HDFC, and other bank solar loans explained.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Most Indian adults with a <strong>CIBIL score of 650+</strong>, a <strong>stable income source</strong>, and an <strong>existing electricity connection</strong> qualify for a solar loan. There is no minimum income threshold at most banks — you just need your net monthly income to be at least <strong>3× the proposed EMI</strong>. For a 3kW system EMI of ₹2,200/month, that means ₹6,600+ net income — well within reach for most households.</p>"
    },
    {
      "heading": "General Eligibility Criteria",
      "body": "<p>Here are the standard requirements across major banks for residential solar loans:</p><table><thead><tr><th>Criterion</th><th>Requirement</th><th>Notes</th></tr></thead><tbody><tr><td>Age</td><td>21–65 years</td><td>At loan maturity, should be under 70</td></tr><tr><td>Citizenship</td><td>Indian citizen or NRI</td><td>NRIs need India-based co-applicant at some banks</td></tr><tr><td>CIBIL score</td><td>650+ (700+ for best rates)</td><td>Some NBFCs accept 600+</td></tr><tr><td>Income</td><td>3× EMI minimum</td><td>Salaried or self-employed</td></tr><tr><td>Electricity connection</td><td>Active domestic connection</td><td>In applicant''s name or immediate family</td></tr><tr><td>Property</td><td>Owned or NOC from owner</td><td>Rental properties need landlord consent</td></tr></tbody></table><p>→ <a href=\"/in/solar-financing/\">Back to Solar Financing overview</a></p>"
    },
    {
      "heading": "Bank-Specific Eligibility",
      "body": "<p>Each bank has slightly different requirements:</p><p><strong>SBI Surya Shakti:</strong></p><ul><li>CIBIL 700+ for best rate (7.00%). Accepts 650+ at higher rate.</li><li>Existing SBI account not mandatory but speeds up processing</li><li>Salaried: 2+ years employment. Self-employed: 3+ years business vintage.</li></ul><p><strong>HDFC Solar Rooftop Loan:</strong></p><ul><li>CIBIL 700+ preferred</li><li>Minimum income: ₹25,000/month (salaried) or ₹3 lakh/year (self-employed)</li><li>Existing HDFC relationship gets faster processing</li></ul><p><strong>Canara Bank Solar Loan:</strong></p><ul><li>CIBIL 650+ accepted</li><li>Government employees get preferential rates</li><li>Agricultural land owners eligible for solar pump financing</li></ul><p>→ <a href=\"/in/solar-financing/solar-loan/\">Compare all bank solar loan schemes</a></p>"
    },
    {
      "heading": "Salaried vs Self-Employed: What Changes?",
      "body": "<p>Both salaried and self-employed individuals can get solar loans, but the documentation and verification differ:</p><table><thead><tr><th>Factor</th><th>Salaried</th><th>Self-Employed</th></tr></thead><tbody><tr><td>Income proof</td><td>3 months salary slips</td><td>2 years ITR</td></tr><tr><td>Bank statements</td><td>3 months</td><td>6–12 months</td></tr><tr><td>Employment proof</td><td>Company ID / appointment letter</td><td>Business registration / GST certificate</td></tr><tr><td>Approval time</td><td>5–10 days</td><td>10–15 days</td></tr><tr><td>Rate premium</td><td>Base rate</td><td>+0.25–0.50%</td></tr></tbody></table><p>Self-employed borrowers with irregular income can improve their chances by showing consistent bank balance and ITR for the last 2–3 years. Alternatively, <a href=\"/in/solar-financing/emi/\">installer EMI plans</a> have more relaxed income verification.</p>"
    },
    {
      "heading": "What If Your CIBIL Score Is Low?",
      "body": "<p>A CIBIL score below 650 does not mean you cannot go solar. Here are your options:</p><ol><li><strong>Installer 0% EMI</strong> — Most installer-arranged EMI plans do not check CIBIL. They verify identity and set up NACH auto-debit. This is the fastest route for low-score borrowers.</li><li><strong>NBFC financing</strong> — Companies like Bajaj Finserv and Tata Capital accept scores of 600+ at slightly higher rates (12–14%).</li><li><strong>Co-applicant</strong> — Add a family member with a good CIBIL score as co-applicant. The bank considers the higher score.</li><li><strong>Improve and apply later</strong> — Pay off outstanding debts, close unused credit cards, and ensure no EMI defaults for 6 months. Score improvement of 50–100 points is possible in 3–6 months.</li><li><strong>Upfront with subsidy</strong> — If you can arrange ₹30,000–₹50,000 for a 1kW system after subsidy, buy outright and avoid financing altogether.</li></ol>"
    },
    {
      "heading": "Eligibility for Special Categories",
      "body": "<p><strong>Senior citizens (60+):</strong> Banks accept applications up to age 65, with loan maturity before age 70. Shorter tenures may be required. Pension income is accepted as income proof.</p><p><strong>Women applicants:</strong> Some banks offer 0.05–0.10% rate concession for women borrowers. SBI and Bank of Baroda have this provision for all home/solar loans.</p><p><strong>Government employees:</strong> Enjoy faster processing and sometimes preferential rates at public sector banks. Canara Bank and PNB offer special rates for central/state government employees.</p><p><strong>Farmers:</strong> Eligible for solar pump loans under <a href=\"/in/solar-subsidy/\">PM-KUSUM scheme</a> with 60% subsidy and bank financing for the remaining 40%.</p><p><strong>NRIs:</strong> Can apply with an India-based co-applicant (spouse/parent). Documentation includes NRI income proof and India address proof.</p>"
    },
    {
      "heading": "Pre-Qualification: Check Before You Apply",
      "body": "<p>Avoid rejected applications (which hurt your CIBIL score) by pre-qualifying yourself:</p><ul><li><strong>Check your CIBIL score</strong> — Free once a year at cibil.com. If above 700, you qualify at most banks.</li><li><strong>Calculate your EMI capacity</strong> — Total EMIs (all loans + proposed solar) should not exceed 50% of net monthly income.</li><li><strong>Verify your electricity bill</strong> — Ensure the connection is in your name or a direct family member''s name.</li><li><strong>Confirm property ownership</strong> — Have your property tax receipt or ownership document ready. If rented, secure landlord NOC.</li></ul><p>→ <a href=\"/in/solar-financing/documents-required/\">Complete document checklist</a></p>"
    },
    {
      "heading": "Ready to Check Your Eligibility?",
      "body": "<p>Get quotes from verified installers who can also help assess your financing eligibility. Many installers pre-screen borrowers and recommend the best-fit bank or NBFC based on your profile.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with financing guidance →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What CIBIL score is needed for a solar loan?",
      "answer": "Most banks require a CIBIL score of 650+ for solar loan approval, with 700+ getting the best interest rates. NBFCs accept scores as low as 600 at higher rates. Installer-arranged 0% EMI plans typically do not check CIBIL at all, making them a good option for borrowers with low scores."
    },
    {
      "question": "Can a self-employed person get a solar loan?",
      "answer": "Yes. All major banks accept self-employed applicants for solar loans. You need 2 years of ITR, 6–12 months bank statements, and business registration. Rates may be 0.25–0.50% higher than for salaried applicants, and processing takes slightly longer (10–15 days vs 5–10 days)."
    },
    {
      "question": "Is there a minimum income requirement for solar loans?",
      "answer": "Most banks do not specify a minimum income. The practical requirement is that your net monthly income should be at least 3× the proposed EMI. For a 3kW system EMI of ₹2,200/month, that means ₹6,600+ net income. HDFC requires a minimum ₹25,000/month for salaried applicants."
    },
    {
      "question": "Can I get a solar loan if I live in a rented house?",
      "answer": "It is possible but harder. You need written NOC from the property owner authorising the installation on their roof. The loan would be in your name, but the system is technically attached to someone else''s property. Most banks prefer owner-occupied properties for solar loans."
    },
    {
      "question": "Does applying for a solar loan affect my CIBIL score?",
      "answer": "Each loan application creates a hard inquiry that can reduce your CIBIL score by 5–10 points. Apply to no more than 2–3 banks within a 30-day window (multiple inquiries within 30 days count as one). Pre-qualify yourself before applying to avoid unnecessary rejections."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'eligibility' AND pillar_slug = 'solar-financing';


-- 2. CLUSTER: documents-required
UPDATE seo_pages SET
  h1 = 'Documents Required for Solar Loan: Complete Checklist',
  meta_title = 'Solar Loan Documents Required 2026: Complete Checklist for All Banks | Solar Vipani',
  meta_description = 'Complete list of documents needed for solar loan application — identity, income, property, and installer documents. Bank-wise requirements included.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>You need <strong>6 categories of documents</strong> for a solar loan: identity proof (Aadhaar/PAN), address proof, income proof (salary slips or ITR), bank statements (3–6 months), electricity bill, and the solar installer''s quotation. Most documents are standard KYC that you likely already have. Your installer typically helps compile and submit the application.</p>"
    },
    {
      "heading": "Complete Document Checklist",
      "body": "<table><thead><tr><th>Category</th><th>Document</th><th>Salaried</th><th>Self-Employed</th></tr></thead><tbody><tr><td>Identity</td><td>Aadhaar Card</td><td>Required</td><td>Required</td></tr><tr><td>Identity</td><td>PAN Card</td><td>Required</td><td>Required</td></tr><tr><td>Address</td><td>Aadhaar / Passport / Voter ID</td><td>Any one</td><td>Any one</td></tr><tr><td>Income</td><td>Salary slips (last 3 months)</td><td>Required</td><td>N/A</td></tr><tr><td>Income</td><td>Form 16 / IT returns</td><td>Last 2 years</td><td>Last 2 years</td></tr><tr><td>Income</td><td>Business registration / GST cert</td><td>N/A</td><td>Required</td></tr><tr><td>Bank</td><td>Bank statements</td><td>3 months</td><td>6–12 months</td></tr><tr><td>Property</td><td>Electricity bill (latest)</td><td>Required</td><td>Required</td></tr><tr><td>Property</td><td>Property ownership proof</td><td>Required</td><td>Required</td></tr><tr><td>Solar</td><td>Installer quotation with specs</td><td>Required</td><td>Required</td></tr><tr><td>Solar</td><td>Installer MNRE empanelment proof</td><td>Recommended</td><td>Recommended</td></tr><tr><td>Photo</td><td>Passport-size photographs</td><td>2 copies</td><td>2 copies</td></tr></tbody></table><p>→ <a href=\"/in/solar-financing/\">Back to Solar Financing overview</a></p>"
    },
    {
      "heading": "Identity & Address Proof",
      "body": "<p><strong>Accepted identity documents (any one):</strong></p><ul><li>Aadhaar Card (most commonly requested)</li><li>PAN Card (mandatory for loans above ₹50,000)</li><li>Passport</li><li>Voter ID / Driving Licence</li></ul><p><strong>Address proof (any one):</strong></p><ul><li>Aadhaar Card (if address is current)</li><li>Passport</li><li>Utility bill (electricity/gas) within 3 months</li><li>Property tax receipt</li></ul><p><strong>Tip:</strong> Aadhaar + PAN covers both identity and address requirements at most banks. Keep self-attested photocopies ready — most banks need 2 sets.</p>"
    },
    {
      "heading": "Income Proof by Employment Type",
      "body": "<p><strong>Salaried employees:</strong></p><ul><li>Salary slips for the last 3 months</li><li>Form 16 (last 2 years) OR ITR (last 2 years)</li><li>Employment certificate or company ID card</li><li>Bank statement showing salary credits (3 months)</li></ul><p><strong>Self-employed / Business owners:</strong></p><ul><li>ITR for the last 2–3 years</li><li>Computation of income signed by CA</li><li>Business registration certificate / Udyam registration</li><li>GST registration certificate (if applicable)</li><li>Bank statements showing business income (6–12 months)</li></ul><p><strong>Pensioners:</strong></p><ul><li>Pension payment order</li><li>Bank statement showing pension credits (3 months)</li><li>Latest Form 16 or pension certificate</li></ul>"
    },
    {
      "heading": "Property & Electricity Documents",
      "body": "<p>Since the solar system is installed on your roof, banks verify property ownership:</p><ul><li><strong>Property ownership proof</strong> — Sale deed, property tax receipt, or society allotment letter</li><li><strong>Latest electricity bill</strong> — Must be in the applicant''s name or immediate family member. The consumer number links your PM Surya Ghar application.</li><li><strong>Property NOC</strong> — Required only if the property is not in the applicant''s name (e.g., parent''s property or rented house)</li><li><strong>Housing society resolution</strong> — Required for apartment installations where panels go on shared rooftop</li></ul><p>→ <a href=\"/in/solar-installation/roof-assessment/\">Learn about roof assessment for solar</a></p>"
    },
    {
      "heading": "Installer Documents",
      "body": "<p>Banks verify the installer and system specifications before disbursement:</p><ul><li><strong>Detailed quotation</strong> — Must include: panel brand/model/wattage, inverter brand/model, mounting type, total kW capacity, itemised pricing, GST details, warranty terms, and installation timeline</li><li><strong>Installer MNRE empanelment certificate</strong> — Required for PM Surya Ghar subsidy eligibility. Banks prefer empanelled vendors as it de-risks the loan.</li><li><strong>Installer GST registration</strong> — Some banks verify the installer is a registered business entity</li><li><strong>Proforma invoice</strong> — Formal invoice for the bank to process disbursement directly to the installer</li></ul><p>When you get quotes through <a href=\"/in/get-quotes/\">Solar Vipani</a>, all verified installers provide bank-ready quotations with the required details.</p>"
    },
    {
      "heading": "Bank-Specific Additional Requirements",
      "body": "<p><strong>SBI Surya Shakti:</strong> Requires filled SBI solar loan application form (available at branches and online). Existing SBI customers can apply through YONO app with pre-filled details.</p><p><strong>HDFC:</strong> Requires signed HDFC loan application form plus net banking or mobile banking registration for EMI auto-debit.</p><p><strong>Canara Bank:</strong> Government employees need departmental NOC for salary deduction mandate.</p><p><strong>NBFCs (Bajaj Finserv, Tata Capital):</strong> Usually require fewer documents — Aadhaar, PAN, bank statements, and installer quotation may suffice. Verification is largely digital.</p>"
    },
    {
      "heading": "Tips to Speed Up Your Application",
      "body": "<ul><li><strong>Prepare everything before visiting the bank</strong> — Missing even one document means a return trip and delayed processing.</li><li><strong>Self-attest all photocopies</strong> — Sign and date each copy with ''self-attested for solar loan application''.</li><li><strong>Get the quotation first</strong> — The installer''s detailed quotation is the most critical document. Without it, the bank cannot process your application.</li><li><strong>Apply online if available</strong> — SBI (YONO), HDFC, and most NBFCs accept online applications with document uploads. Processing is 2–3 days faster.</li><li><strong>Let your installer help</strong> — Experienced installers have processed hundreds of solar loans. They know exactly what each bank needs and often liaise directly with the branch.</li></ul>"
    },
    {
      "heading": "Get Started with a Quote",
      "body": "<p>The first step to a solar loan is a detailed quotation from a verified installer. This document is required by every bank and forms the basis of your loan application.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What documents are needed for SBI solar loan?",
      "answer": "SBI Surya Shakti requires: Aadhaar card, PAN card, salary slips (3 months) or ITR (2 years), bank statements (3 months), latest electricity bill, property ownership proof, passport photos, and the solar installer''s detailed quotation with MNRE empanelment proof."
    },
    {
      "question": "Can I apply for solar loan online?",
      "answer": "Yes. SBI (through YONO app), HDFC, and most NBFCs accept online solar loan applications. You upload scanned documents, and verification is done digitally. Online applications are typically processed 2–3 days faster than branch applications."
    },
    {
      "question": "Do I need property papers for a solar loan?",
      "answer": "Yes. Banks need proof that you own the property where the solar system will be installed. A property tax receipt, sale deed, or society allotment letter works. If the property is in a family member''s name, you need their NOC. Rented property installations require landlord written consent."
    },
    {
      "question": "What if my electricity bill is not in my name?",
      "answer": "If the bill is in an immediate family member''s name (spouse, parent), most banks accept it with a family relationship declaration. If the connection is in someone else''s name, you need to either transfer the connection to your name or get a NOC from the connection holder."
    },
    {
      "question": "Does the installer help with loan documentation?",
      "answer": "Yes. Most verified solar installers assist with the entire loan process — from preparing the quotation in bank-required format to liaising with the branch for document submission and disbursement. This is a standard part of their service, especially for installers on the Solar Vipani platform."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'documents-required' AND pillar_slug = 'solar-financing';


-- 3. CLUSTER: payback-period
UPDATE seo_pages SET
  h1 = 'Solar Panel Payback Period in India: How Fast Will You Recover Your Investment?',
  meta_title = 'Solar Payback Period India 2026: Recovery Time by System Size & State | Solar Vipani',
  meta_description = 'Solar systems pay back in 3–6 years in India. See payback by system size, state, tariff slab, and financing method. Real data from verified installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A residential rooftop solar system in India pays for itself in <strong>3–6 years</strong>, depending on your electricity tariff, system size, and whether you used the PM Surya Ghar subsidy. After payback, the system generates <strong>free electricity for 20+ more years</strong>. Homeowners with high electricity bills (₹3,000+/month) and full subsidy utilisation see payback in as little as <strong>2.5–3 years</strong>.</p>"
    },
    {
      "heading": "Payback Period by System Size",
      "body": "<p>Assuming average electricity tariff of ₹7/unit, PM Surya Ghar subsidy applied, and on-grid system with net metering:</p><table><thead><tr><th>System Size</th><th>Cost After Subsidy</th><th>Annual Saving</th><th>Simple Payback</th><th>Discounted Payback (8%)</th></tr></thead><tbody><tr><td>1kW</td><td>₹30,000–₹50,000</td><td>₹9,800–₹12,600</td><td>2.5–4.0 years</td><td>3.0–5.0 years</td></tr><tr><td>2kW</td><td>₹50,000–₹80,000</td><td>₹19,600–₹25,200</td><td>2.5–3.5 years</td><td>3.0–4.0 years</td></tr><tr><td>3kW</td><td>₹72,000–₹1,12,000</td><td>₹29,400–₹37,800</td><td>2.5–3.5 years</td><td>3.0–4.0 years</td></tr><tr><td>5kW</td><td>₹1,72,000–₹2,42,000</td><td>₹49,000–₹63,000</td><td>3.5–4.5 years</td><td>4.0–5.5 years</td></tr><tr><td>10kW</td><td>₹4,22,000–₹5,72,000</td><td>₹98,000–₹1,26,000</td><td>4.0–5.5 years</td><td>5.0–7.0 years</td></tr></tbody></table><p><em>Smaller systems have shorter payback because the subsidy covers a higher percentage of the cost.</em></p><p>→ <a href=\"/in/solar-financing/\">Back to Solar Financing overview</a> · <a href=\"/in/solar-financing/roi/\">Full ROI analysis</a></p>"
    },
    {
      "heading": "Payback by Electricity Tariff",
      "body": "<p>Your electricity tariff is the single biggest factor affecting payback. Here is how payback changes for a 3kW system (₹1,12,000 after subsidy):</p><table><thead><tr><th>Tariff Slab</th><th>Annual Saving</th><th>Payback</th><th>Typical Consumers</th></tr></thead><tbody><tr><td>₹4–₹5/unit</td><td>₹20,000–₹25,000</td><td>4.5–5.5 years</td><td>Low-usage, subsidised slabs</td></tr><tr><td>₹6–₹7/unit</td><td>₹30,000–₹35,000</td><td>3.0–3.7 years</td><td>Average residential consumers</td></tr><tr><td>₹8–₹10/unit</td><td>₹40,000–₹50,000</td><td>2.2–2.8 years</td><td>High-usage homes, metro cities</td></tr><tr><td>₹10–₹14/unit</td><td>₹50,000–₹70,000</td><td>1.6–2.2 years</td><td>Commercial/industrial tariff</td></tr></tbody></table><p><strong>Key insight:</strong> If your per-unit rate exceeds ₹8, solar pays back in under 3 years. Check your latest electricity bill for your effective per-unit cost.</p>"
    },
    {
      "heading": "How Financing Affects Payback",
      "body": "<p>If you finance your solar system with a loan, the payback period changes because you are paying interest:</p><table><thead><tr><th>Payment Method</th><th>Total Cost (3kW)</th><th>Effective Payback</th><th>Monthly Cash Flow</th></tr></thead><tbody><tr><td>Upfront after subsidy</td><td>₹1,12,000</td><td>3.1 years</td><td>+₹3,000 (savings)</td></tr><tr><td>0% EMI (12 months)</td><td>₹1,12,000</td><td>3.1 years</td><td>−₹6,000 (year 1), +₹3,000 (year 2+)</td></tr><tr><td>Bank loan (5 years, 8%)</td><td>₹1,35,000</td><td>5.2 years</td><td>+₹750 (during loan), +₹3,000 (after)</td></tr><tr><td>Bank loan (7 years, 8%)</td><td>₹1,50,000</td><td>6.8 years</td><td>+₹1,250 (during loan), +₹3,000 (after)</td></tr></tbody></table><p>Even with the longest financing option, you break even well within the 25-year system life. The key question is not <em>if</em> solar pays back — it always does — but <em>how quickly</em>.</p><p>→ <a href=\"/in/solar-financing/solar-loan/\">Compare solar loan options</a></p>"
    },
    {
      "heading": "State-Wise Payback Variations",
      "body": "<p>Payback varies significantly by state due to differences in tariffs, solar irradiance, and state-level subsidies:</p><table><thead><tr><th>State</th><th>Avg Tariff</th><th>Solar Hours/Day</th><th>Payback (3kW)</th></tr></thead><tbody><tr><td>Maharashtra</td><td>₹8–₹12</td><td>5.0</td><td>2.0–3.0 years</td></tr><tr><td>Rajasthan</td><td>₹6–₹8</td><td>5.5</td><td>2.5–3.5 years</td></tr><tr><td>Gujarat</td><td>₹5–₹7</td><td>5.2</td><td>3.0–4.0 years</td></tr><tr><td>Karnataka</td><td>₹6–₹9</td><td>4.8</td><td>2.5–3.5 years</td></tr><tr><td>Tamil Nadu</td><td>₹4–₹7</td><td>5.0</td><td>3.0–4.5 years</td></tr><tr><td>Delhi</td><td>₹6–₹10</td><td>4.5</td><td>2.5–3.5 years</td></tr><tr><td>West Bengal</td><td>₹6–₹8</td><td>4.2</td><td>3.5–4.5 years</td></tr><tr><td>Kerala</td><td>₹5–₹7</td><td>4.0</td><td>4.0–5.5 years</td></tr></tbody></table><p>States with high tariffs and high solar irradiance (Maharashtra, Rajasthan) see the fastest payback. Northeast and hill states have longer payback due to lower sunlight hours.</p>"
    },
    {
      "heading": "Factors That Speed Up Payback",
      "body": "<p>Optimise your payback period with these strategies:</p><ul><li><strong>Maximise subsidy</strong> — Apply for PM Surya Ghar and any state-level subsidies. Each ₹10,000 in subsidy reduces payback by 3–4 months.</li><li><strong>Right-size your system</strong> — A system that offsets 80–100% of your bill offers the best payback. Oversizing leads to excess export at lower net metering rates.</li><li><strong>Optimal orientation</strong> — South-facing panels at 10–15° tilt maximise annual generation in India. Poor orientation can reduce output by 15–20%.</li><li><strong>Clean panels regularly</strong> — Dust reduces output by 5–15% in Indian conditions. Monthly cleaning maintains peak performance.</li><li><strong>Choose the right tariff comparison</strong> — Compare savings against your marginal tariff rate (highest slab), not your average rate. Solar eliminates units from the top slab first.</li></ul>"
    },
    {
      "heading": "What Happens After Payback?",
      "body": "<p>The real value of solar lies in what happens <em>after</em> the payback period:</p><ul><li><strong>Years 1–4:</strong> Payback period. You recover your investment through electricity savings.</li><li><strong>Years 5–25:</strong> Pure profit. Every unit generated is essentially free electricity. At ₹7/unit with 5% annual escalation, a 3kW system saves ₹6,00,000–₹10,00,000 in this phase alone.</li><li><strong>Year 10:</strong> Inverter may need replacement (₹15,000–₹30,000). Even after this, cumulative savings far exceed the original investment.</li><li><strong>Year 25:</strong> Panels still produce 80%+ of original output. Many owners continue using panels beyond 25 years.</li></ul><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your exact payback with our solar calculator</a></p>"
    },
    {
      "heading": "Get a Personalised Payback Estimate",
      "body": "<p>Your actual payback depends on your specific electricity consumption, tariff slab, roof conditions, and location. Get quotes from verified installers who will calculate your projected savings and payback period.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with payback projections →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How many years does it take for solar panels to pay for themselves?",
      "answer": "In India, solar panels typically pay for themselves in 3–6 years with the PM Surya Ghar subsidy. Homes with high electricity bills (₹3,000+/month) see payback in 2.5–3 years. After payback, you get free electricity for the remaining 20+ years of the system life."
    },
    {
      "question": "Does financing extend the payback period?",
      "answer": "Yes. If you take a solar loan at 8% interest for 5 years, payback extends from about 3 years (upfront payment) to about 5.2 years. However, your monthly cash flow is positive from day one in most cases — the EMI is less than your electricity savings, so you start saving immediately."
    },
    {
      "question": "What is the payback period without subsidy?",
      "answer": "Without the PM Surya Ghar subsidy, payback extends by 1.5–2.5 years. A 3kW system costing ₹1,80,000 (no subsidy) at ₹7/unit tariff pays back in about 5 years instead of 3 years. Solar is still a strong investment even without subsidy, just with a longer recovery period."
    },
    {
      "question": "Does solar payback vary by state?",
      "answer": "Yes, significantly. States with high tariffs and high solar irradiance (Maharashtra, Rajasthan, Karnataka) see 2–3 year payback. States with lower tariffs or less sunlight (Kerala, Northeast) may take 4–6 years. The combination of your DISCOM tariff rate and local solar hours determines your payback."
    },
    {
      "question": "Is payback faster for commercial solar installations?",
      "answer": "Yes. Commercial tariffs (₹8–₹14/unit) are much higher than residential, leading to payback in 2–4 years. Additionally, businesses can claim 40% accelerated depreciation, further reducing the effective cost. Commercial solar is one of the fastest-payback investments available."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'payback-period' AND pillar_slug = 'solar-financing';


-- 4. CLUSTER: lease-vs-loan
UPDATE seo_pages SET
  h1 = 'Solar Lease vs Loan in India: Which Saves You More?',
  meta_title = 'Solar Lease vs Loan India 2026: Complete Comparison Guide | Solar Vipani',
  meta_description = 'Should you lease or buy solar panels? Compare costs, ownership, savings, and flexibility. Detailed analysis for Indian homeowners with real numbers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>For most Indian homeowners, <strong>buying with a solar loan is better</strong> than leasing. Over 25 years, a loan-financed purchase saves <strong>₹2,00,000–₹5,00,000 more</strong> than a lease because you own the system and claim the PM Surya Ghar subsidy (₹78,000). Leasing makes sense only if you want <strong>zero investment, zero maintenance</strong> and are willing to accept lower total savings in exchange for hassle-free operation.</p>"
    },
    {
      "heading": "How Solar Leasing Works in India",
      "body": "<p>In a solar lease (also called RESCO or OPEX model), a third-party company installs panels on your roof at zero cost and sells you the electricity at a pre-agreed rate.</p><ol><li>A solar company surveys your roof and proposes a system size</li><li>They install, own, and maintain the system — you pay nothing upfront</li><li>You buy the generated electricity at ₹3–₹5/unit (vs ₹6–₹12/unit DISCOM rate)</li><li>Contract runs for 15–25 years with annual rate escalation of 1–3%</li><li>At contract end, you may buy the system at residual value or the company removes it</li></ol><p>Leasing is more common for commercial installations but is increasingly available for residential systems above 3kW.</p>"
    },
    {
      "heading": "How Solar Loan Purchase Works",
      "body": "<p>With a <a href=\"/in/solar-financing/solar-loan/\">solar loan</a>, you borrow to buy the system, own it from day one, and repay through EMIs.</p><ol><li>Get quotes from verified installers via <a href=\"/in/get-quotes/\">Solar Vipani</a></li><li>Apply for a solar loan (SBI at 7%, HDFC at 8.5%, etc.)</li><li>Installer installs the system; bank disburses to installer</li><li>You pay EMIs for 3–10 years (typically less than your electricity bill)</li><li>After loan repayment, electricity is completely free for 15–20+ remaining years</li><li>PM Surya Ghar subsidy (up to ₹78,000) is credited to your account post-installation</li></ol>"
    },
    {
      "heading": "Head-to-Head Comparison: 3kW System Over 25 Years",
      "body": "<p>Here is a detailed comparison for a 3kW system in a city with ₹8/unit tariff:</p><table><thead><tr><th>Factor</th><th>Solar Loan (5 years, 8%)</th><th>Solar Lease (25 years)</th></tr></thead><tbody><tr><td>Upfront cost</td><td>₹0 (100% financed)</td><td>₹0</td></tr><tr><td>Monthly payment (year 1)</td><td>₹3,650 EMI</td><td>₹1,800 lease rent</td></tr><tr><td>PM Surya Ghar subsidy</td><td>₹78,000 (yours to keep)</td><td>₹0 (company claims it)</td></tr><tr><td>System ownership</td><td>Yours from day one</td><td>Company''s for 25 years</td></tr><tr><td>Maintenance</td><td>Your responsibility</td><td>Company handles it</td></tr><tr><td>Total paid (25 years)</td><td>₹2,19,000 (loan) − ₹78,000 (subsidy) = ₹1,41,000</td><td>₹6,50,000–₹8,00,000</td></tr><tr><td>Total electricity savings</td><td>₹12,00,000+</td><td>₹4,00,000–₹6,00,000</td></tr><tr><td>Net benefit (25 years)</td><td>₹10,59,000+</td><td>₹4,00,000–₹6,00,000</td></tr></tbody></table><p><strong>The loan wins by ₹4,00,000–₹6,00,000</strong> over 25 years because you own the system, claim the subsidy, and pay nothing after the loan ends.</p>"
    },
    {
      "heading": "When Leasing Makes Sense",
      "body": "<p>Despite the lower total savings, leasing is the right choice in specific situations:</p><ul><li><strong>Commercial buildings with large roofs</strong> — The RESCO model for 50kW+ installations eliminates capex and maintenance overhead. Companies prefer opex-based solar for balance sheet benefits.</li><li><strong>Renters</strong> — If you do not own the property and the landlord agrees to a lease arrangement, you save on electricity without investing in an asset attached to someone else''s property.</li><li><strong>Zero hassle priority</strong> — The leasing company handles all maintenance, inverter replacements, monitoring, and DISCOM coordination. You just pay a bill.</li><li><strong>Short-term residents</strong> — If you plan to move within 5–7 years, a lease avoids the complexity of selling or transferring an owned system.</li><li><strong>Poor financing access</strong> — If you cannot qualify for a solar loan and installer EMI is not available, leasing provides an alternative route to solar savings.</li></ul>"
    },
    {
      "heading": "When a Loan Is Clearly Better",
      "body": "<p>A solar loan purchase is the better option when:</p><ul><li><strong>You own your home</strong> — You will benefit from the full 25-year savings without lease payments eating into your returns.</li><li><strong>You qualify for PM Surya Ghar</strong> — The ₹78,000 subsidy is only available to system owners, not lessees. This alone shifts the math decisively in favour of buying.</li><li><strong>You plan to stay long-term</strong> — If you will live in the home for 10+ years, ownership delivers far greater value.</li><li><strong>You can get a solar loan at 7–10%</strong> — At these rates, the EMI is competitive with lease payments but with the massive advantage of eventual ownership.</li><li><strong>You want to increase property value</strong> — An owned solar system adds value to your property. A leased system can actually complicate resale since the buyer inherits the lease contract.</li></ul>"
    },
    {
      "heading": "Key Risks to Consider",
      "body": "<p><strong>Lease risks:</strong></p><ul><li>Long lock-in period (15–25 years) with early exit penalties</li><li>Annual rate escalation (1–3%) reduces savings over time</li><li>Company bankruptcy risk — who maintains the system if the lessor goes under?</li><li>Roof access restrictions during the lease period</li><li>Complicates property sale — buyer must accept lease transfer</li></ul><p><strong>Loan risks:</strong></p><ul><li>EMI obligation regardless of system performance (mitigated by warranty)</li><li>Maintenance responsibility and costs (₹2,000–₹5,000/year)</li><li>Inverter replacement at year 10–12 (₹15,000–₹30,000)</li><li>Interest cost if you choose a long tenure</li></ul><p>For most homeowners, the loan risks are manageable and well-compensated by the far higher returns.</p>"
    },
    {
      "heading": "Make the Right Choice",
      "body": "<p>Start by getting quotes from verified installers who can model both purchase and lease scenarios for your specific situation. Understanding your actual savings under each option makes the decision straightforward.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with financing comparison →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is it better to lease or buy solar panels in India?",
      "answer": "For most homeowners, buying (with or without a loan) is better. Over 25 years, buying saves ₹4,00,000–₹6,00,000 more than leasing for a 3kW system because you own the asset, claim the PM Surya Ghar subsidy, and pay nothing after the loan ends. Leasing suits commercial buildings or those who prioritise zero hassle over maximum savings."
    },
    {
      "question": "Can I lease solar panels for my home?",
      "answer": "Solar leasing for residential consumers is still emerging in India and mainly available for systems above 3kW. Companies like Amplus Solar and Fourth Partner Energy offer residential leasing in select cities. For smaller systems (1–3kW), a zero-cost EMI from an installer is a more practical alternative to leasing."
    },
    {
      "question": "What happens to a leased solar system if I sell my house?",
      "answer": "The lease transfers to the new homeowner as part of the property sale. The buyer must agree to the remaining lease terms. This can complicate and slow down the sale process. Some lease contracts include a buyout clause that lets you purchase the system before selling the property."
    },
    {
      "question": "Do I get subsidy on leased solar panels?",
      "answer": "No. The PM Surya Ghar subsidy is available only to the system owner. In a lease arrangement, the leasing company owns the system and claims the subsidy. You benefit indirectly through a lower lease rate, but the ₹78,000 subsidy does not come to your account."
    },
    {
      "question": "What is the typical lease rate for solar panels?",
      "answer": "Residential solar lease rates in India range from ₹3–₹5 per unit of electricity generated, compared to DISCOM tariffs of ₹6–₹12/unit. Most leases include an annual escalation of 1–3%. Over 25 years, the cumulative lease payment can be ₹6–₹8 lakh for a 3kW system."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'lease-vs-loan' AND pillar_slug = 'solar-financing';

COMMIT;
