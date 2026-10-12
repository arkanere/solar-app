-- Solar Financing Clusters Batch 2: free-solar-scheme, roi, emi-options, interest-rates
-- Run: psql $POSTGRES_URL < src/lib/server/migrations/019-solar-financing-clusters-batch2.sql

BEGIN;

-- 1. CLUSTER: free-solar-scheme
UPDATE seo_pages SET
  h1 = 'Free Solar Panel Scheme in India: PM Surya Ghar & State Programs',
  meta_title = 'Free Solar Panel Scheme India 2026: Government Programs & Eligibility | Solar Vipani',
  meta_description = 'Learn about free and subsidised solar panel schemes in India — PM Surya Ghar, state programs, and RESCO models. Check eligibility and apply step by step.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>There is no scheme that provides solar panels completely free to homeowners. However, the <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar Yojana</a> provides subsidies up to <strong>₹78,000</strong> that can cover <strong>40–60% of the system cost</strong> for a 3kW system. Combined with state subsidies and zero-cost EMI plans, your effective out-of-pocket cost can be as low as <strong>₹30,000–₹50,000</strong> for a 1kW system — close to free when you factor in the electricity savings.</p>"
    },
    {
      "heading": "PM Surya Ghar: The Closest to Free Solar",
      "body": "<p>Launched in 2024, PM Surya Ghar Muft Bijli Yojana is the Indian government''s flagship rooftop solar scheme. The name literally translates to ''free electricity'' — and while the panels are not free, the subsidy makes the effective cost remarkably low.</p><table><thead><tr><th>System Size</th><th>Subsidy</th><th>Typical Cost</th><th>Your Cost (After Subsidy)</th></tr></thead><tbody><tr><td>1kW</td><td>₹30,000</td><td>₹60,000–₹80,000</td><td>₹30,000–₹50,000</td></tr><tr><td>2kW</td><td>₹60,000</td><td>₹1,10,000–₹1,40,000</td><td>₹50,000–₹80,000</td></tr><tr><td>3kW</td><td>₹78,000</td><td>₹1,50,000–₹1,90,000</td><td>₹72,000–₹1,12,000</td></tr></tbody></table><p>Subsidy is capped at 3kW for residential consumers. Systems above 3kW get the same ₹78,000 subsidy. Only on-grid systems installed by <a href=\"/in/solar-installation/choosing-installer/\">MNRE-registered vendors</a> qualify.</p><p>→ <a href=\"/in/solar-subsidy/pm-surya-ghar/\">Complete PM Surya Ghar guide</a></p>"
    },
    {
      "heading": "State-Level Free Solar Schemes",
      "body": "<p>Several states offer additional incentives on top of the central subsidy:</p><ul><li><strong>Gujarat</strong> — Additional state subsidy of ₹10,000/kW for systems up to 3kW, over and above PM Surya Ghar</li><li><strong>Rajasthan</strong> — Free solar panel scheme for BPL families under the Mukhyamantri Solar Mission</li><li><strong>Maharashtra</strong> — Interest subvention of 2% on solar loans through MEDA</li><li><strong>Punjab</strong> — Additional 50% state subsidy for SC/ST households</li><li><strong>Uttar Pradesh</strong> — UP Solar Policy offers additional incentives for residential installations in rural areas</li></ul><p>State schemes change frequently. Check with your local DISCOM or <a href=\"/in/solar-subsidy/state-wise/\">state-wise subsidy guide</a> for the latest information.</p>"
    },
    {
      "heading": "RESCO Model: Solar with Zero Investment",
      "body": "<p>The RESCO (Renewable Energy Service Company) model is the closest to truly free solar. Here is how it works:</p><ol><li>A solar company installs panels on your roof at <strong>zero cost to you</strong></li><li>The company owns the system and sells you the generated electricity at a <strong>pre-agreed rate</strong> (typically ₹3–₹5/unit)</li><li>You save because this rate is <strong>lower than your DISCOM tariff</strong> (₹6–₹12/unit)</li><li>After the contract period (15–25 years), ownership transfers to you — or the company removes the system</li></ol><p><strong>Pros:</strong> Zero investment, immediate savings, maintenance handled by the company</p><p><strong>Cons:</strong> Lower total savings than owning (you pay rent for 15–25 years), long lock-in period, roof access restrictions</p><p>RESCO is best suited for commercial and institutional buildings with large, unshaded rooftops. For residential consumers, subsidised purchase with EMI usually offers better long-term value.</p>"
    },
    {
      "heading": "Who Is Eligible for Free/Subsidised Solar?",
      "body": "<p>Eligibility for PM Surya Ghar and most state schemes:</p><ul><li><strong>Residential consumers only</strong> — Must have a valid domestic electricity connection</li><li><strong>One subsidy per household</strong> — Linked to your electricity consumer number</li><li><strong>Grid-connected system</strong> — Only on-grid systems qualify; off-grid and hybrid do not</li><li><strong>MNRE-registered vendor</strong> — Installation must be by an empanelled installer</li><li><strong>No income limit</strong> — PM Surya Ghar has no income ceiling for general category</li><li><strong>Roof ownership or NOC</strong> — You must own the roof or have written consent from the owner</li></ul><p>→ <a href=\"/in/solar-subsidy/eligibility/\">Detailed eligibility criteria</a> · <a href=\"/in/solar-subsidy/documents-required/\">Documents required</a></p>"
    },
    {
      "heading": "How to Apply for Government Solar Schemes",
      "body": "<p>The application process is standardised across India:</p><ol><li><strong>Register on the PM Surya Ghar portal</strong> — <em>pmsuryaghar.gov.in</em> (linked to your electricity consumer number)</li><li><strong>Get a feasibility report</strong> — Your DISCOM assesses your roof and approves net metering</li><li><strong>Choose an empanelled installer</strong> — Select from the list on the portal or use <a href=\"/in/get-quotes/\">Solar Vipani</a> to compare verified installers</li><li><strong>Install the system</strong> — Installer completes work within 60–90 days of DISCOM approval</li><li><strong>DISCOM inspection</strong> — Net meter installed and system commissioned</li><li><strong>Subsidy disbursement</strong> — Amount credited to your bank account within 30–60 days of commissioning</li></ol><p>→ <a href=\"/in/solar-subsidy/how-to-apply/\">Step-by-step application guide</a></p>"
    },
    {
      "heading": "Beware of ''Free Solar'' Scams",
      "body": "<p>If someone promises completely free solar panels with no strings attached, proceed with caution. Common red flags:</p><ul><li><strong>''100% free'' claims</strong> — No legitimate scheme covers the entire cost. Even PM Surya Ghar covers 40–60%.</li><li><strong>Upfront fee for ''registration''</strong> — Government portal registration is free. Never pay a middleman for scheme access.</li><li><strong>Unknown installer brands</strong> — Always verify the installer is MNRE-empanelled on the official portal.</li><li><strong>No written agreement</strong> — Insist on a detailed quotation with component specs, warranty terms, and timeline.</li></ul><p>Stick to verified installers and apply directly through the official PM Surya Ghar portal or your DISCOM office.</p>"
    },
    {
      "heading": "Start Your Subsidised Solar Journey",
      "body": "<p>The best approach: get quotes from verified installers who handle the subsidy paperwork for you. Solar Vipani''s installer network includes MNRE-empanelled vendors who process PM Surya Ghar applications as part of the installation service.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from subsidy-eligible installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is solar panel really free under government scheme?",
      "answer": "No scheme provides solar panels completely free. PM Surya Ghar provides a subsidy of up to ₹78,000 (covering 40–60% of cost for a 3kW system). Combined with zero-cost EMI, your monthly payment can be less than your electricity bill, effectively making solar ''free'' in terms of cash flow. But you do pay for the system."
    },
    {
      "question": "How much subsidy can I get under PM Surya Ghar?",
      "answer": "PM Surya Ghar provides ₹30,000/kW for the first 2kW and ₹18,000/kW for the 3rd kW — a maximum of ₹78,000 for 3kW. Systems above 3kW still get only ₹78,000. The subsidy is credited directly to your bank account after installation and DISCOM verification."
    },
    {
      "question": "Can BPL families get free solar panels?",
      "answer": "Some state schemes specifically target BPL (Below Poverty Line) families with enhanced subsidies. Rajasthan''s Mukhyamantri Solar Mission and similar state programs offer up to 80–90% subsidy for economically weaker sections. Check your state''s renewable energy agency website for current schemes."
    },
    {
      "question": "What is the RESCO model for solar installation?",
      "answer": "RESCO (Renewable Energy Service Company) installs solar panels on your roof at zero cost. They own the system and sell you electricity at a fixed rate (₹3–₹5/unit) lower than your DISCOM tariff. You save immediately without investing anything. After the 15–25 year contract, ownership may transfer to you."
    },
    {
      "question": "How long does it take to receive the solar subsidy?",
      "answer": "After your system is installed and commissioned by the DISCOM, the PM Surya Ghar subsidy is typically credited to your bank account within 30–60 days. The entire process from application to subsidy receipt takes 3–6 months, depending on your DISCOM''s processing speed."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'free-solar-scheme' AND pillar_slug = 'solar-financing';


-- 2. CLUSTER: roi
UPDATE seo_pages SET
  h1 = 'Solar Panel ROI in India: Returns, Payback Period & 25-Year Savings',
  meta_title = 'Solar Panel ROI India 2026: Real Returns & Payback Calculator | Solar Vipani',
  meta_description = 'Solar panels deliver 15–25% annual returns in India — better than FDs and PPF. See payback periods by system size, real savings data, and ROI calculations.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A rooftop solar system in India delivers <strong>15–25% annual returns</strong> (IRR) — significantly better than fixed deposits (6–7%), PPF (7.1%), or even many equity mutual funds on a risk-adjusted basis. The <strong>payback period is 3–6 years</strong> after subsidy, and the system generates free electricity for <strong>20+ more years</strong> after that. On a 3kW system costing ₹1,12,000 after subsidy, cumulative 25-year savings range from <strong>₹7,00,000 to ₹12,00,000</strong>.</p>"
    },
    {
      "heading": "ROI by System Size",
      "body": "<p>Here is how returns look across different system sizes (assuming ₹7/unit average tariff with 5% annual tariff escalation):</p><table><thead><tr><th>System Size</th><th>Cost After Subsidy</th><th>Annual Saving (Year 1)</th><th>Payback Period</th><th>25-Year Savings</th><th>IRR</th></tr></thead><tbody><tr><td>1kW</td><td>₹30,000–₹50,000</td><td>₹9,000–₹12,000</td><td>3–5 years</td><td>₹3,00,000–₹4,00,000</td><td>20–30%</td></tr><tr><td>2kW</td><td>₹50,000–₹80,000</td><td>₹18,000–₹24,000</td><td>3–4 years</td><td>₹6,00,000–₹8,00,000</td><td>22–28%</td></tr><tr><td>3kW</td><td>₹72,000–₹1,12,000</td><td>₹27,000–₹36,000</td><td>3–4 years</td><td>₹7,00,000–₹12,00,000</td><td>20–28%</td></tr><tr><td>5kW</td><td>₹1,72,000–₹2,42,000</td><td>₹42,000–₹60,000</td><td>3–5 years</td><td>₹12,00,000–₹18,00,000</td><td>18–25%</td></tr><tr><td>10kW</td><td>₹4,22,000–₹5,72,000</td><td>₹84,000–₹1,20,000</td><td>4–6 years</td><td>₹25,00,000–₹35,00,000</td><td>16–22%</td></tr></tbody></table><p><em>Smaller systems show higher IRR because the subsidy covers a larger percentage of the cost.</em></p><p>→ <a href=\"/in/solar-financing/\">Back to Solar Financing overview</a></p>"
    },
    {
      "heading": "How to Calculate Solar ROI",
      "body": "<p>Solar ROI depends on five variables:</p><ol><li><strong>System cost (after subsidy)</strong> — Your total out-of-pocket investment</li><li><strong>Annual electricity generation</strong> — Depends on system size, location, and panel quality. Use 1,400–1,600 units/kW/year for most Indian cities.</li><li><strong>Electricity tariff</strong> — Your current rate per unit. Higher tariff = faster payback.</li><li><strong>Tariff escalation</strong> — Electricity prices rise 5–8% annually in India. This makes your solar savings grow every year.</li><li><strong>System degradation</strong> — Panels lose 0.5–0.7% efficiency per year. Factor 0.5% annual degradation.</li></ol><p><strong>Simple ROI formula:</strong></p><p><em>Simple payback = System cost ÷ Year 1 electricity savings</em></p><p><em>Example: ₹1,12,000 ÷ ₹36,000 = 3.1 years</em></p><p>For a more accurate picture including tariff escalation and degradation, use our <a href=\"/in/tools/solar-calculator/\">solar calculator</a>.</p>"
    },
    {
      "heading": "Solar vs Other Investments",
      "body": "<p>How does solar compare to other places you could put your money?</p><table><thead><tr><th>Investment</th><th>Annual Return</th><th>Risk</th><th>Liquidity</th><th>Tax Treatment</th></tr></thead><tbody><tr><td><strong>Solar (3kW)</strong></td><td><strong>20–28% IRR</strong></td><td><strong>Very low</strong></td><td><strong>Illiquid</strong></td><td><strong>Savings tax-free</strong></td></tr><tr><td>Fixed Deposit</td><td>6–7%</td><td>Very low</td><td>Moderate</td><td>Interest taxable</td></tr><tr><td>PPF</td><td>7.1%</td><td>Zero</td><td>Low (15-year lock)</td><td>EEE (tax-free)</td></tr><tr><td>Equity MF (large-cap)</td><td>10–14%</td><td>High</td><td>High</td><td>LTCG taxable</td></tr><tr><td>Gold</td><td>8–12%</td><td>Moderate</td><td>Moderate</td><td>LTCG taxable</td></tr></tbody></table><p><strong>Key advantage of solar:</strong> The return is in the form of <em>savings on a guaranteed expense</em> (electricity), not market-dependent gains. Your electricity bill will exist for 25 years — solar just replaces who you pay (yourself instead of the DISCOM).</p>"
    },
    {
      "heading": "What Affects Your Payback Period?",
      "body": "<p>Your actual payback can be shorter or longer than the 3–6 year average. Here are the factors:</p><p><strong>Faster payback (under 4 years):</strong></p><ul><li>High current electricity bill (₹3,000+/month)</li><li>High tariff slab (₹8–₹12/unit)</li><li>Full PM Surya Ghar subsidy utilised</li><li>Optimal roof orientation (south-facing, no shading)</li><li>High solar irradiance location (Rajasthan, Gujarat, Maharashtra)</li></ul><p><strong>Slower payback (5–7 years):</strong></p><ul><li>Low current bill (under ₹1,500/month)</li><li>Low tariff slab (₹3–₹5/unit)</li><li>System financed with a loan at 8–10% interest</li><li>Partial shading or non-optimal roof angle</li><li>Lower irradiance location (Northeast, hill stations)</li></ul><p>→ <a href=\"/in/solar-financing/payback-period/\">Detailed payback period analysis</a></p>"
    },
    {
      "heading": "The Hidden Return: Tariff Escalation",
      "body": "<p>The most undervalued aspect of solar ROI is <strong>tariff escalation</strong>. Electricity prices in India have risen 5–8% annually over the past decade, and this trend is expected to continue.</p><p>Here is how your annual savings grow over time on a 3kW system (starting at ₹7/unit):</p><table><thead><tr><th>Year</th><th>Effective Tariff</th><th>Annual Saving</th><th>Cumulative Saving</th></tr></thead><tbody><tr><td>Year 1</td><td>₹7.00</td><td>₹35,000</td><td>₹35,000</td></tr><tr><td>Year 5</td><td>₹8.75</td><td>₹43,750</td><td>₹1,98,000</td></tr><tr><td>Year 10</td><td>₹11.40</td><td>₹57,000</td><td>₹4,65,000</td></tr><tr><td>Year 15</td><td>₹14.85</td><td>₹74,250</td><td>₹8,00,000</td></tr><tr><td>Year 20</td><td>₹19.33</td><td>₹96,650</td><td>₹12,50,000</td></tr><tr><td>Year 25</td><td>₹25.17</td><td>₹1,25,850</td><td>₹18,50,000</td></tr></tbody></table><p><em>Assumes 5% annual tariff escalation and 0.5% annual panel degradation. Actual savings will vary.</em></p><p>By year 10, your annual savings are 63% higher than year 1 — and you did nothing but let the panels sit on your roof.</p>"
    },
    {
      "heading": "ROI When Using a Solar Loan",
      "body": "<p>Financing your solar system with a <a href=\"/in/solar-financing/solar-loan/\">solar loan</a> reduces the upfront investment to zero but adds interest cost. Here is how ROI changes:</p><ul><li><strong>Upfront purchase (3kW):</strong> IRR = 25%, payback = 3.1 years</li><li><strong>5-year loan at 8%:</strong> IRR = 18%, payback = 5.5 years (from loan start)</li><li><strong>7-year loan at 8%:</strong> IRR = 15%, payback = 7.2 years (from loan start)</li></ul><p>Even with a loan, solar delivers returns that beat most traditional investments. The key insight: your EMI is a <em>transfer payment</em> from the electricity company to the bank. Once the loan is repaid, the full savings flow to you.</p><p>→ <a href=\"/in/solar-financing/interest-rates/\">Compare solar loan interest rates</a></p>"
    },
    {
      "heading": "Calculate Your Personalised ROI",
      "body": "<p>Your actual ROI depends on your specific electricity bill, tariff slab, location, and financing choice. Use our solar calculator for a personalised estimate.</p><p><a href=\"/in/tools/solar-calculator/\">Calculate your solar ROI →</a></p><p>Or get real quotes from verified installers who will design a system optimised for your roof and consumption pattern.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the ROI of solar panels in India?",
      "answer": "Solar panels deliver 15–25% annual internal rate of return (IRR) in India, depending on system size, electricity tariff, and location. A 3kW system costing ₹1,12,000 after subsidy saves ₹35,000+ in year one and ₹7,00,000–₹12,00,000 over 25 years. This significantly outperforms FDs (6–7%) and PPF (7.1%)."
    },
    {
      "question": "How many years to recover solar panel cost?",
      "answer": "Most homeowners recover their investment in 3–6 years. With full PM Surya Ghar subsidy and a high electricity tariff (₹8+/unit), payback can be as fast as 2.5–3 years. With a solar loan, payback extends to 5–7 years including interest, but you start saving from month one."
    },
    {
      "question": "Do solar panels increase property value?",
      "answer": "Yes. A solar-equipped home is more attractive to buyers due to lower electricity costs. While India lacks specific data, the combination of ₹2,000–₹5,000/month bill reduction and a modern, sustainable amenity adds perceived value. The system also provides a tangible asset with 20+ years of remaining productive life."
    },
    {
      "question": "Is solar a good investment compared to mutual funds?",
      "answer": "On a risk-adjusted basis, solar is one of the best investments available. It delivers 15–25% IRR with near-zero risk (your electricity bill is guaranteed). Equity mutual funds may deliver 10–14% long-term but with significant volatility. Solar returns are also tax-free (savings, not income), unlike mutual fund gains."
    },
    {
      "question": "How does electricity tariff affect solar ROI?",
      "answer": "Higher tariff = better ROI. At ₹8/unit, a 3kW system pays back in 3 years. At ₹5/unit, payback extends to 5 years. Importantly, tariffs rise 5–8% annually, so your savings grow every year even as panel output slightly degrades. This built-in escalation makes solar a natural hedge against rising electricity costs."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'roi' AND pillar_slug = 'solar-financing';


-- 3. CLUSTER: emi-options
UPDATE seo_pages SET
  h1 = 'Solar EMI Options Compared: Banks, NBFCs & Installer Plans',
  meta_title = 'Solar EMI Options India 2026: Compare Bank, NBFC & Installer Plans | Solar Vipani',
  meta_description = 'Compare all solar EMI options — bank loans, NBFC financing, installer plans, and credit card EMI. Find the lowest monthly payment for your solar system.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Four types of EMI options exist for solar installations in India: <strong>bank solar loans</strong> (7–10%, up to 10 years), <strong>NBFC financing</strong> (10–14%, up to 5 years), <strong>installer zero-cost EMI</strong> (0% for 6–24 months), and <strong>credit card EMI</strong> (12–18%, 3–12 months). The best option depends on your budget: if you want the lowest monthly payment, choose a long-tenure bank loan; if you want zero interest cost, choose an installer''s 0% EMI plan.</p>"
    },
    {
      "heading": "All EMI Options at a Glance",
      "body": "<p>Here is a complete comparison for a 3kW system costing ₹1,12,000 after subsidy:</p><table><thead><tr><th>Option</th><th>Interest Rate</th><th>Tenure</th><th>Monthly EMI</th><th>Total Paid</th><th>Approval Time</th></tr></thead><tbody><tr><td>Installer 0% EMI</td><td>0%</td><td>12 months</td><td>₹9,333</td><td>₹1,12,000</td><td>Same day</td></tr><tr><td>Installer 0% EMI</td><td>0%</td><td>24 months</td><td>₹4,667</td><td>₹1,12,000</td><td>Same day</td></tr><tr><td>SBI Solar Loan</td><td>7.00%</td><td>5 years</td><td>₹2,218</td><td>₹1,33,080</td><td>7–15 days</td></tr><tr><td>SBI Solar Loan</td><td>7.00%</td><td>7 years</td><td>₹1,690</td><td>₹1,41,960</td><td>7–15 days</td></tr><tr><td>HDFC Solar Loan</td><td>9.00%</td><td>5 years</td><td>₹2,326</td><td>₹1,39,560</td><td>7–10 days</td></tr><tr><td>Bajaj Finserv</td><td>12.00%</td><td>3 years</td><td>₹3,722</td><td>₹1,33,992</td><td>2–3 days</td></tr><tr><td>Credit Card EMI</td><td>15.00%</td><td>12 months</td><td>₹10,130</td><td>₹1,21,560</td><td>Instant</td></tr></tbody></table><p>→ <a href=\"/in/solar-financing/emi/\">Detailed EMI guide</a> · <a href=\"/in/solar-financing/solar-loan/\">Solar loan comparison</a></p>"
    },
    {
      "heading": "Bank Solar Loans: Best for Long Tenure",
      "body": "<p><a href=\"/in/solar-financing/solar-loan/\">Bank solar loans</a> offer the lowest interest rates and longest tenures, making them ideal if you want the smallest possible monthly payment.</p><p><strong>Best for:</strong> Homeowners who prefer low monthly outgo and can wait 7–15 days for approval</p><p><strong>Pros:</strong></p><ul><li>Lowest interest rates (7–10%)</li><li>Longest tenure (up to 10 years with SBI)</li><li>No collateral for amounts up to ₹10 lakh</li><li>Subsidy integration — many banks factor in expected subsidy</li></ul><p><strong>Cons:</strong></p><ul><li>Longer processing time (7–15 days)</li><li>Documentation requirements (income proof, bank statements)</li><li>CIBIL score of 650+ required</li></ul><p>→ <a href=\"/in/solar-financing/interest-rates/\">Compare all bank interest rates</a></p>"
    },
    {
      "heading": "NBFC Financing: Faster Approval",
      "body": "<p>Non-banking financial companies (NBFCs) like Bajaj Finserv, Tata Capital, and L&T Finance offer solar financing with faster approval but higher rates.</p><p><strong>Best for:</strong> Self-employed individuals, those with lower credit scores, or anyone who needs quick approval</p><p><strong>Pros:</strong></p><ul><li>Approval in 2–3 days (sometimes same day)</li><li>More flexible income verification</li><li>Lower CIBIL requirement (600+)</li><li>Online application with minimal paperwork</li></ul><p><strong>Cons:</strong></p><ul><li>Higher interest rates (10–14%)</li><li>Shorter tenure (typically 3–5 years)</li><li>Processing fees may be higher (1–2%)</li></ul>"
    },
    {
      "heading": "Installer Zero-Cost EMI: No Interest",
      "body": "<p>Many solar installers offer 0% EMI plans where you pay the system cost in equal monthly instalments with no interest or extra charges.</p><p><strong>Best for:</strong> Homeowners who can handle higher monthly payments (₹4,500–₹9,500/month for a 3kW system) for 12–24 months</p><p><strong>Pros:</strong></p><ul><li>Zero interest — total cost equals system price</li><li>Instant approval — no bank paperwork</li><li>Simple NACH mandate setup</li><li>No CIBIL check in most cases</li></ul><p><strong>Cons:</strong></p><ul><li>Short tenure (6–24 months) means higher EMI</li><li>Available only through participating installers</li><li>May not be available during all periods</li></ul><p>Always verify that the total amount paid equals the quoted price with no hidden charges.</p>"
    },
    {
      "heading": "Credit Card EMI: Quick but Expensive",
      "body": "<p>If your installer accepts credit card payments, you can convert the transaction to EMI through your card issuer.</p><p><strong>Best for:</strong> Small systems (1–2kW) or if you plan to repay within 3 months</p><p><strong>Why it is usually not recommended:</strong></p><ul><li>High interest (12–18%) compared to solar loans (7–10%)</li><li>EMI conversion fee of 1–2%</li><li>Blocks your credit limit</li><li>Short tenure (3–12 months)</li></ul><p>For a 3kW system, credit card EMI costs ₹9,500–₹21,000 more than a bank solar loan over the same tenure. Only use this option if no other financing is available or for very small amounts.</p>"
    },
    {
      "heading": "Decision Framework: Which EMI Option Is Right?",
      "body": "<p>Use this flowchart:</p><ol><li><strong>Can you pay ₹9,000+/month for 12 months?</strong> → Choose installer 0% EMI. Best total value.</li><li><strong>Is lowest EMI your priority?</strong> → Choose SBI solar loan (7-year). EMI as low as ₹1,690 for 3kW.</li><li><strong>Need approval within 2 days?</strong> → Choose NBFC financing (Bajaj Finserv, Tata Capital).</li><li><strong>Self-employed with irregular income?</strong> → Choose NBFC or installer EMI. More flexible requirements.</li><li><strong>CIBIL below 650?</strong> → Choose installer 0% EMI (no credit check) or NBFC with relaxed norms.</li></ol><p>Regardless of which option you choose, your solar system saves you money from day one in most cases — the EMI is typically less than or equal to your current electricity bill.</p>"
    },
    {
      "heading": "Compare EMI Options with Your Quotes",
      "body": "<p>Solar Vipani''s verified installers provide quotes with EMI breakdowns for multiple financing options. See your exact monthly payment before committing.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with EMI options →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which is the cheapest EMI option for solar panels?",
      "answer": "In terms of total cost, installer 0% EMI is cheapest — you pay the exact system price with no interest. In terms of monthly payment, a long-tenure SBI solar loan (7–10 years at 7%) gives the lowest EMI — around ₹1,400–₹1,700/month for a 3kW system. Choose based on whether you prioritise total cost or monthly comfort."
    },
    {
      "question": "Can I get solar EMI without a credit check?",
      "answer": "Yes. Installer-arranged 0% EMI plans typically do not require a CIBIL check. They verify your identity and set up a NACH auto-debit mandate. Bank and NBFC financing will check your credit score. If your CIBIL is below 650, the installer EMI route is your best option."
    },
    {
      "question": "What is the typical EMI for a 3kW solar system?",
      "answer": "For a 3kW system costing ₹1,12,000 after subsidy: 0% EMI for 12 months = ₹9,333/month; bank loan for 5 years at 8% = ₹2,271/month; bank loan for 7 years at 8% = ₹1,746/month. Most homeowners choose the 5-year bank option as it balances low EMI with reasonable total interest."
    },
    {
      "question": "Can I combine subsidy with EMI financing?",
      "answer": "Yes. The PM Surya Ghar subsidy is processed independently of your financing choice. Whether you pay upfront, use EMI, or take a bank loan, the subsidy is credited to your bank account after installation. You can use this amount to prepay your loan or EMI, reducing your remaining balance."
    },
    {
      "question": "Is it better to pay upfront or use EMI for solar?",
      "answer": "If you have the funds, upfront payment saves you interest costs (₹20,000–₹50,000 on a 5-year loan). But EMI lets you keep your savings invested elsewhere. If your investment returns exceed the solar loan interest rate (7–10%), EMI is mathematically better. Most importantly, EMI removes the upfront barrier — do not delay going solar waiting to save up."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'emi-options' AND pillar_slug = 'solar-financing';


-- 4. CLUSTER: interest-rates
UPDATE seo_pages SET
  h1 = 'Solar Loan Interest Rates in India: Bank-Wise Comparison 2026',
  meta_title = 'Solar Loan Interest Rates 2026: SBI, HDFC, PNB & More Compared | Solar Vipani',
  meta_description = 'Compare solar loan interest rates from all major Indian banks. SBI at 7%, HDFC at 8.5%, and more. Updated rates, eligibility, and how to get the best deal.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar loan interest rates in India range from <strong>7.00% to 10.50%</strong> depending on the bank and your credit profile. <strong>SBI offers the lowest rate at 7.00–7.75%</strong> through its Surya Shakti scheme. Public sector banks generally offer 0.5–1.5% lower rates than private banks. Your actual rate depends on your CIBIL score, loan amount, and relationship with the bank.</p>"
    },
    {
      "heading": "Bank-Wise Solar Loan Interest Rates",
      "body": "<p>Current solar loan rates from major Indian banks (as of 2026):</p><table><thead><tr><th>Bank</th><th>Scheme</th><th>Rate (p.a.)</th><th>Max Tenure</th><th>Processing Fee</th><th>Type</th></tr></thead><tbody><tr><td>SBI</td><td>Surya Shakti</td><td>7.00–7.75%</td><td>10 years</td><td>0.50%</td><td>Public</td></tr><tr><td>Canara Bank</td><td>Solar Loan</td><td>7.25–8.25%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>Bank of Baroda</td><td>Baroda Solar</td><td>7.50–8.50%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>PNB</td><td>PNB Solar</td><td>7.50–8.75%</td><td>7 years</td><td>1.00%</td><td>Public</td></tr><tr><td>Union Bank</td><td>Union Solar</td><td>7.75–8.50%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>Indian Bank</td><td>IB Solar</td><td>7.50–8.50%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>HDFC Bank</td><td>Solar Rooftop</td><td>8.50–9.50%</td><td>7 years</td><td>1.00%</td><td>Private</td></tr><tr><td>ICICI Bank</td><td>Solar Loan</td><td>9.00–10.00%</td><td>5 years</td><td>1.00%</td><td>Private</td></tr><tr><td>Axis Bank</td><td>Green Loan</td><td>9.00–10.50%</td><td>5 years</td><td>1.00%</td><td>Private</td></tr><tr><td>Kotak Mahindra</td><td>Solar Finance</td><td>9.50–10.50%</td><td>5 years</td><td>1.00%</td><td>Private</td></tr></tbody></table><p><em>Rates are indicative and may vary based on your profile, loan amount, and market conditions.</em></p>"
    },
    {
      "heading": "How Your Interest Rate Is Determined",
      "body": "<p>Banks consider these factors when setting your solar loan interest rate:</p><ol><li><strong>CIBIL score</strong> — The biggest factor. Score above 750 gets the best rate. Below 700 adds 0.5–1.5% to the base rate.</li><li><strong>Loan amount</strong> — Larger loans (₹5 lakh+) may get preferential rates due to economies of processing.</li><li><strong>Existing relationship</strong> — Salary account holders and long-term customers get 0.25–0.50% concession.</li><li><strong>Employment type</strong> — Salaried borrowers get slightly better rates than self-employed.</li><li><strong>Loan tenure</strong> — Some banks offer lower rates for shorter tenures.</li></ol><p>→ <a href=\"/in/solar-financing/eligibility/\">Check your eligibility for solar loans</a></p>"
    },
    {
      "heading": "Why Solar Loan Rates Are Lower Than Personal Loans",
      "body": "<p>Solar loans enjoy preferential rates (7–10%) compared to personal loans (10–18%) for three reasons:</p><ul><li><strong>Priority sector classification</strong> — RBI mandates banks allocate a percentage of lending to priority sectors, including renewable energy. This incentivises banks to offer competitive solar loan rates.</li><li><strong>Tangible asset</strong> — The solar system is bolted to your roof and generates measurable savings, providing implicit collateral even though no formal collateral is required.</li><li><strong>Government backing</strong> — PM Surya Ghar and MNRE actively promote solar adoption, giving banks confidence in the sector.</li></ul><p>Always opt for a dedicated solar loan product rather than a personal loan or credit card EMI for your installation.</p>"
    },
    {
      "heading": "Fixed vs Floating Rate: Which to Choose?",
      "body": "<p>Most solar loans are offered at <strong>floating rates</strong> linked to the bank''s MCLR or repo rate. A few banks offer fixed-rate options.</p><table><thead><tr><th>Feature</th><th>Fixed Rate</th><th>Floating Rate</th></tr></thead><tbody><tr><td>Rate changes</td><td>Stays constant</td><td>Changes with repo rate</td></tr><tr><td>Typical rate</td><td>0.25–0.50% higher</td><td>Base rate</td></tr><tr><td>Predictability</td><td>Fixed EMI always</td><td>EMI may change</td></tr><tr><td>Best when</td><td>Rates expected to rise</td><td>Rates expected to fall</td></tr></tbody></table><p>For solar loans with 5–7 year tenures, the rate difference between fixed and floating is marginal (₹2,000–₹5,000 over the tenure). Choose floating if you expect RBI to cut rates; choose fixed for predictable budgeting.</p>"
    },
    {
      "heading": "How to Get the Best Interest Rate",
      "body": "<p>Follow these strategies to secure the lowest rate:</p><ul><li><strong>Apply with a CIBIL score above 750</strong> — Check your score before applying. If below 700, spend 3–6 months improving it before applying.</li><li><strong>Apply at your salary bank</strong> — Existing relationship can save 0.25–0.50% on the rate.</li><li><strong>Compare at least 3 banks</strong> — Even a 1% rate difference saves ₹5,000–₹12,000 on a ₹1.5 lakh loan over 5 years.</li><li><strong>Negotiate</strong> — Banks have discretion on pricing. If you have a competing offer at a lower rate, show it to your preferred bank.</li><li><strong>Check for seasonal offers</strong> — Banks frequently offer reduced processing fees and rate concessions during festivals and government campaigns.</li><li><strong>Ask about state subsidies on interest</strong> — Some states offer 2–3% interest subvention on solar loans through their renewable energy agencies.</li></ul>"
    },
    {
      "heading": "Total Interest Cost by Tenure",
      "body": "<p>Here is how much interest you pay on a ₹1,12,000 solar loan at different rates and tenures:</p><table><thead><tr><th>Rate</th><th>3-Year Total Interest</th><th>5-Year Total Interest</th><th>7-Year Total Interest</th></tr></thead><tbody><tr><td>7.00%</td><td>₹11,760</td><td>₹19,880</td><td>₹28,280</td></tr><tr><td>8.00%</td><td>₹13,440</td><td>₹22,880</td><td>₹32,760</td></tr><tr><td>9.00%</td><td>₹15,120</td><td>₹25,880</td><td>₹37,240</td></tr><tr><td>10.00%</td><td>₹16,800</td><td>₹28,880</td><td>₹42,000</td></tr></tbody></table><p>The difference between 7% and 10% over 5 years is ₹9,000 — meaningful but not a deal-breaker. Do not delay your solar installation waiting for a slightly better rate. The electricity savings you miss while waiting likely exceed the interest difference.</p>"
    },
    {
      "heading": "Get the Best Rate with Your Solar Quote",
      "body": "<p>Solar Vipani''s verified installers partner with multiple banks and NBFCs. When you get quotes through us, financing options with competitive rates are included.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with financing options →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the lowest interest rate for solar loan in India?",
      "answer": "SBI offers the lowest solar loan interest rate at 7.00–7.75% through its Surya Shakti scheme. Canara Bank is next at 7.25–8.25%. Both are public sector banks offering priority sector lending rates. Your actual rate depends on your CIBIL score, with 750+ scores getting the best rates."
    },
    {
      "question": "Is solar loan interest rate fixed or floating?",
      "answer": "Most bank solar loans are floating rate, linked to MCLR or the repo rate. Some banks offer fixed-rate options at a 0.25–0.50% premium. For a typical 5-year solar loan, the practical difference between fixed and floating is small (₹2,000–₹5,000). Choose floating if you expect rates to fall."
    },
    {
      "question": "Do private banks offer solar loans?",
      "answer": "Yes. HDFC, ICICI, Axis, and Kotak all offer solar loan products. However, their rates (8.5–10.5%) are typically 1–2% higher than public sector banks like SBI (7%) and Canara Bank (7.25%). Private banks may offer faster processing to compensate."
    },
    {
      "question": "How much interest will I pay on a 3kW solar loan?",
      "answer": "On a ₹1,12,000 loan (3kW after subsidy), total interest ranges from ₹11,760 (7% for 3 years) to ₹42,000 (10% for 7 years). A typical 5-year SBI loan at 7% costs about ₹19,880 in interest. This is easily recovered through the additional electricity savings during the loan period."
    },
    {
      "question": "Can I get a solar loan at 0% interest?",
      "answer": "Banks do not offer 0% interest solar loans. However, many solar installers offer 0% EMI plans for 12–24 months where the installer absorbs the interest cost. For genuine 0% financing, ask your installer about their EMI plans rather than approaching a bank."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'interest-rates' AND pillar_slug = 'solar-financing';

COMMIT;
