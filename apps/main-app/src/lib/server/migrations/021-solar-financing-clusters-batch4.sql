-- Solar Financing Clusters Batch 4: commercial-financing, green-bonds
-- Run: psql $POSTGRES_URL < src/lib/server/migrations/021-solar-financing-clusters-batch4.sql

BEGIN;

-- 1. CLUSTER: commercial-financing
UPDATE seo_pages SET
  h1 = 'Commercial Solar Financing in India: CAPEX, OPEX & RESCO Models',
  meta_title = 'Commercial Solar Financing India 2026: CAPEX vs OPEX vs RESCO | Solar Vipani',
  meta_description = 'Finance your commercial solar installation through CAPEX, OPEX, or RESCO models. Compare tax benefits, ROI, and financing options for businesses in India.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Businesses in India have three primary models for financing solar installations: <strong>CAPEX</strong> (buy and own, 2–4 year payback with 40% depreciation benefit), <strong>OPEX/RESCO</strong> (zero investment, pay per unit at ₹3–₹5/unit vs ₹8–₹14/unit grid tariff), and <strong>project finance</strong> (term loans at 8–10% for large installations). The right model depends on your balance sheet preference, tax position, and willingness to manage the asset.</p>"
    },
    {
      "heading": "Three Models of Commercial Solar Financing",
      "body": "<p>Commercial and industrial (C&I) solar projects above 10kW use different financing structures than residential systems:</p><table><thead><tr><th>Model</th><th>Investment</th><th>Ownership</th><th>Tariff Saving</th><th>Tax Benefit</th><th>Best For</th></tr></thead><tbody><tr><td>CAPEX</td><td>Full upfront or loan</td><td>Business</td><td>100%</td><td>40% depreciation</td><td>Profitable businesses</td></tr><tr><td>OPEX/RESCO</td><td>Zero</td><td>Solar company</td><td>30–50%</td><td>None direct</td><td>Asset-light preference</td></tr><tr><td>Project Finance</td><td>20–30% equity</td><td>Business</td><td>100%</td><td>40% depreciation</td><td>Large installations (100kW+)</td></tr></tbody></table><p>→ <a href=\"/in/solar-financing/\">Back to Solar Financing overview</a></p>"
    },
    {
      "heading": "CAPEX Model: Own Your Solar Asset",
      "body": "<p>In the CAPEX model, the business purchases and owns the solar system outright or through a term loan.</p><p><strong>How it works:</strong></p><ul><li>Business invests ₹40,000–₹55,000 per kW (installed cost for C&I systems)</li><li>System is owned by the business and appears on the balance sheet as a fixed asset</li><li>All electricity generated offsets grid purchase — saving ₹8–₹14/unit</li><li><strong>Accelerated depreciation</strong>: Claim 40% depreciation in year one under Income Tax Act, reducing tax liability significantly</li></ul><p><strong>ROI example (100kW system):</strong></p><ul><li>Cost: ₹45,00,000</li><li>Year 1 depreciation benefit (40% at 25% tax rate): ₹4,50,000</li><li>Annual electricity saving: ₹12,00,000+ (at ₹9/unit)</li><li>Effective payback: 2.5–3.5 years (factoring depreciation)</li><li>20-year NPV: ₹1.5–₹2 crore net benefit</li></ul>"
    },
    {
      "heading": "OPEX/RESCO Model: Zero Investment Solar",
      "body": "<p>The OPEX (Operating Expenditure) or RESCO (Renewable Energy Service Company) model is the most popular choice for commercial solar in India. A solar developer installs, owns, and maintains the system on your premises.</p><p><strong>How it works:</strong></p><ol><li>Solar developer surveys your roof/land and proposes system size (typically 50kW–5MW)</li><li>Developer finances, installs, and owns the system at <strong>zero cost to you</strong></li><li>You sign a PPA (Power Purchase Agreement) for 15–25 years</li><li>You buy generated electricity at ₹3.50–₹5.50/unit (vs ₹8–₹14 grid tariff)</li><li>Developer handles all maintenance, monitoring, and insurance</li><li>Annual tariff escalation of 1–3% is built into the PPA</li></ol><p><strong>Best for:</strong> Companies that want to reduce electricity costs without capital expenditure, prefer opex over capex on their books, or do not have sufficient tax liability to benefit from accelerated depreciation.</p>"
    },
    {
      "heading": "CAPEX vs OPEX: Detailed Comparison",
      "body": "<table><thead><tr><th>Factor</th><th>CAPEX (Buy)</th><th>OPEX/RESCO</th></tr></thead><tbody><tr><td>Upfront investment</td><td>₹40–₹55 lakh per MW</td><td>Zero</td></tr><tr><td>Per-unit saving</td><td>₹8–₹14 (100%)</td><td>₹3–₹7 (30–50%)</td></tr><tr><td>Payback period</td><td>2.5–4 years</td><td>Immediate (day one saving)</td></tr><tr><td>25-year NPV (1MW)</td><td>₹8–₹12 crore</td><td>₹3–₹5 crore</td></tr><tr><td>Maintenance</td><td>Your responsibility</td><td>Developer handles</td></tr><tr><td>Balance sheet</td><td>Asset (depreciable)</td><td>Operating expense</td></tr><tr><td>Tax benefit</td><td>40% accelerated depreciation</td><td>PPA expense is deductible</td></tr><tr><td>Contract lock-in</td><td>None</td><td>15–25 years PPA</td></tr><tr><td>Risk</td><td>Asset performance risk</td><td>Developer credit risk</td></tr></tbody></table><p><strong>Rule of thumb:</strong> If your business is profitable and has tax liability, CAPEX is almost always better. If you want zero hassle or have limited capital, OPEX delivers value with no investment.</p>"
    },
    {
      "heading": "Project Finance for Large Installations",
      "body": "<p>For large C&I installations (500kW+), project finance structures provide optimal capital efficiency:</p><ul><li><strong>Debt-equity ratio:</strong> Typically 70:30 or 80:20 for solar projects</li><li><strong>Debt sources:</strong> Commercial banks (SBI, PNB, IREDA), green bonds, infrastructure finance companies</li><li><strong>Interest rates:</strong> 8–10% for established businesses with good credit</li><li><strong>Tenure:</strong> 10–15 years (matching the project cash flow profile)</li><li><strong>Security:</strong> Assignment of project receivables, charge on solar equipment</li></ul><p><strong>IREDA (Indian Renewable Energy Development Agency)</strong> is the specialised government agency for renewable energy project finance. They offer competitive rates and understand solar project economics.</p><p>→ <a href=\"/in/solar-financing/green-bonds/\">Green bonds for solar projects</a></p>"
    },
    {
      "heading": "Tax Benefits for Commercial Solar",
      "body": "<p>Businesses enjoy significant tax advantages from solar investment:</p><ul><li><strong>Accelerated depreciation (40%)</strong> — Claim 40% of system cost as depreciation in year one. On a ₹50 lakh system, this saves ₹5 lakh in taxes (at 25% rate) immediately.</li><li><strong>Remaining depreciation</strong> — Balance 60% depreciated at normal rates (15% WDV) over subsequent years</li><li><strong>GST input credit</strong> — Businesses registered for GST can claim input tax credit on the solar system purchase (13.8%)</li><li><strong>Carbon credits</strong> — Commercial solar installations may qualify for carbon credits under India''s voluntary carbon market</li></ul><p>The combination of accelerated depreciation and electricity savings can reduce the effective payback to under 2 years for highly profitable businesses.</p>"
    },
    {
      "heading": "Choosing the Right Developer",
      "body": "<p>For commercial solar, the developer''s credibility matters as much as the technology:</p><ul><li><strong>Track record</strong> — Look for developers with 50+ MW of operational C&I installations</li><li><strong>Financial backing</strong> — RESCO developers must have strong balance sheets to honour 25-year PPAs</li><li><strong>O&M capability</strong> — In-house maintenance teams ensure uptime commitments are met</li><li><strong>Performance guarantees</strong> — Insist on contractual generation guarantees with penalty clauses</li><li><strong>Insurance</strong> — Comprehensive insurance for the solar asset against natural disasters and equipment failure</li></ul><p>Solar Vipani connects businesses with verified C&I solar developers who meet all these criteria.</p><p><a href=\"/in/get-quotes/\">Get commercial solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the RESCO model for commercial solar?",
      "answer": "RESCO (Renewable Energy Service Company) installs solar at your premises at zero cost. They own and maintain the system and sell you electricity at ₹3.50–₹5.50/unit through a 15–25 year PPA — 30–50% cheaper than your grid tariff. You save from day one with no capital investment."
    },
    {
      "question": "What tax benefits does a business get from solar installation?",
      "answer": "Businesses can claim 40% accelerated depreciation in the first year, reducing tax liability by up to 10% of system cost. GST input credit (13.8%) is also available. Combined with electricity savings, these benefits can bring the effective payback period below 2 years for profitable companies."
    },
    {
      "question": "Is CAPEX or OPEX better for commercial solar?",
      "answer": "CAPEX delivers 2–3× higher lifetime savings and offers accelerated depreciation benefits, making it better for profitable businesses with available capital or financing access. OPEX suits companies that prefer zero investment, want to keep solar off the balance sheet, or lack sufficient tax liability for depreciation."
    },
    {
      "question": "What is the minimum system size for commercial solar financing?",
      "answer": "Most RESCO developers require a minimum of 50–100kW for commercial PPA arrangements, as smaller systems are not economical to operate under the OPEX model. For CAPEX purchases, there is no minimum — businesses can install any size. Bank project finance typically starts at 100kW+."
    },
    {
      "question": "Can a rented commercial space install solar?",
      "answer": "Yes, with the building owner''s consent. Under the RESCO model, the PPA is between the developer and the electricity consumer (tenant). The lease agreement should explicitly permit rooftop installations. For CAPEX, the tenant must assess whether the remaining lease period justifies the investment."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'commercial-financing' AND pillar_slug = 'solar-financing';


-- 2. CLUSTER: green-bonds
UPDATE seo_pages SET
  h1 = 'Green Bonds for Solar Projects in India: What Businesses Need to Know',
  meta_title = 'Green Bonds for Solar India 2026: Financing Large Solar Projects | Solar Vipani',
  meta_description = 'How green bonds finance large-scale solar projects in India. Learn about eligibility, issuance process, rates, and benefits for commercial solar developers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Green bonds are debt instruments specifically earmarked for financing environmentally beneficial projects, including solar installations. In India, green bonds for solar offer <strong>interest rates 0.5–1.5% lower</strong> than conventional corporate bonds. They are primarily used by <strong>solar developers, utilities, and large corporates</strong> for projects above <strong>₹25 crore</strong>. For smaller commercial installations, traditional <a href=\"/in/solar-financing/commercial-financing/\">project finance or RESCO models</a> are more practical.</p>"
    },
    {
      "heading": "What Are Green Bonds?",
      "body": "<p>A green bond works exactly like a regular bond — the issuer borrows money from investors and pays interest — but with one key difference: the proceeds must be used exclusively for green projects. Solar energy is one of the most common qualifying project categories.</p><p><strong>Key characteristics:</strong></p><ul><li>Fixed income instrument with regular coupon (interest) payments</li><li>Proceeds ring-fenced for eligible green projects (solar, wind, energy efficiency)</li><li>Certified by independent verifiers against international green bond standards</li><li>Typically issued by solar developers, banks, corporates, or government agencies</li><li>Listed on BSE/NSE for secondary trading</li></ul><p>India is the world''s second-largest emerging market for green bonds, with over $25 billion issued since 2015. Solar projects account for approximately 40% of green bond proceeds in India.</p><p>→ <a href=\"/in/solar-financing/\">Back to Solar Financing overview</a></p>"
    },
    {
      "heading": "Who Issues Green Bonds for Solar?",
      "body": "<p>Green bond issuers in the Indian solar sector include:</p><table><thead><tr><th>Issuer Type</th><th>Examples</th><th>Typical Size</th><th>Use of Proceeds</th></tr></thead><tbody><tr><td>Solar developers</td><td>Adani Green, ReNew Power, Azure Power</td><td>₹500–₹5,000 crore</td><td>New solar project construction</td></tr><tr><td>Public sector banks</td><td>SBI, PNB, IREDA</td><td>₹1,000–₹10,000 crore</td><td>On-lending for solar projects</td></tr><tr><td>Government (sovereign)</td><td>RBI Sovereign Green Bond</td><td>₹16,000 crore (2023)</td><td>Renewable energy infrastructure</td></tr><tr><td>Corporates</td><td>Tata Group, Reliance, L&T</td><td>₹500–₹3,000 crore</td><td>Captive solar installations</td></tr><tr><td>NBFCs/DFIs</td><td>IREDA, PTC India, IFC</td><td>₹200–₹2,000 crore</td><td>Solar project lending</td></tr></tbody></table>"
    },
    {
      "heading": "How Green Bonds Benefit Solar Projects",
      "body": "<p>Green bonds offer several advantages over conventional financing for solar:</p><ul><li><strong>Lower cost of capital</strong> — Green bonds typically trade at a ''greenium'' of 0.5–1.5% below equivalent conventional bonds. This directly reduces the cost of financing large solar projects.</li><li><strong>Longer tenures</strong> — Green bonds can be issued for 10–20 year terms, matching solar project lifecycles better than 7–10 year bank loans.</li><li><strong>Access to ESG investors</strong> — A growing pool of institutional investors (pension funds, sovereign wealth funds, ESG mandates) specifically seek green bonds, ensuring strong demand.</li><li><strong>Reputational benefit</strong> — Issuing green bonds signals environmental commitment to stakeholders, customers, and regulators.</li><li><strong>Regulatory support</strong> — SEBI has a dedicated framework for green bond issuance with streamlined listing requirements.</li></ul>"
    },
    {
      "heading": "Eligibility for Green Bond Financing",
      "body": "<p>Green bond financing is relevant in two scenarios:</p><p><strong>1. As a solar developer/issuer:</strong></p><ul><li>Minimum project portfolio: ₹25–₹50 crore (to justify issuance costs)</li><li>Established track record in solar project execution</li><li>Credit rating from a recognised agency (CRISIL, ICRA, CARE)</li><li>Willingness to comply with green bond reporting and verification requirements</li><li>Independent green bond certification (e.g., Climate Bonds Initiative)</li></ul><p><strong>2. As a business benefiting from green bond-funded lending:</strong></p><ul><li>Banks like SBI and IREDA use green bond proceeds to fund solar loans at competitive rates</li><li>Your commercial solar loan may be funded from a bank''s green bond pool — resulting in lower interest rates</li><li>No special requirements from the borrower''s side; the bank handles green bond compliance</li></ul>"
    },
    {
      "heading": "India''s Sovereign Green Bond Program",
      "body": "<p>India launched sovereign green bonds in 2023, with the RBI issuing ₹16,000 crore in the first year. A significant portion funds solar and renewable energy infrastructure.</p><p><strong>Key features:</strong></p><ul><li>Issued at 5–7 basis points below equivalent government securities</li><li>10-year tenure with semi-annual coupon</li><li>Proceeds deployed through government agencies for renewable energy projects</li><li>SEBI-regulated with annual allocation and impact reporting</li></ul><p>Sovereign green bonds signal India''s commitment to renewable energy and help establish a yield benchmark for corporate green bonds.</p>"
    },
    {
      "heading": "Green Bonds vs Other Solar Financing",
      "body": "<table><thead><tr><th>Factor</th><th>Green Bond</th><th>Bank Loan</th><th>RESCO/PPA</th></tr></thead><tbody><tr><td>Typical size</td><td>₹25 crore+</td><td>₹10 lakh–₹50 crore</td><td>₹25 lakh–₹50 crore</td></tr><tr><td>Interest rate</td><td>7–9%</td><td>8–10%</td><td>N/A (per-unit tariff)</td></tr><tr><td>Tenure</td><td>10–20 years</td><td>7–15 years</td><td>15–25 years PPA</td></tr><tr><td>Issuance cost</td><td>High (legal, certification)</td><td>Low (processing fee)</td><td>None for consumer</td></tr><tr><td>Best for</td><td>Developers, large corporates</td><td>SMEs, mid-size installations</td><td>Zero-investment preference</td></tr></tbody></table><p>For most businesses installing solar for their own consumption (10kW–500kW), a bank loan or RESCO model is more practical. Green bonds serve the developer ecosystem that builds these projects.</p>"
    },
    {
      "heading": "How Green Bonds Reach You",
      "body": "<p>Even if you are not issuing green bonds, you benefit from them indirectly. When banks raise capital through green bonds, they on-lend at lower rates to solar borrowers. When solar developers use green bonds, they can offer more competitive RESCO/PPA rates to commercial consumers.</p><p>The bottom line: green bonds reduce the cost of solar for everyone, from large utility-scale projects down to the commercial rooftop on your office building.</p><p>For commercial solar financing tailored to your business, get quotes from verified developers.</p><p><a href=\"/in/get-quotes/\">Get commercial solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is a green bond for solar energy?",
      "answer": "A green bond is a debt instrument where the proceeds are exclusively used for environmentally beneficial projects like solar energy. The issuer borrows money from investors at competitive rates and commits to deploying funds only for qualifying green projects. In India, green bonds for solar offer 0.5–1.5% lower rates than conventional bonds."
    },
    {
      "question": "Can a small business issue green bonds for solar?",
      "answer": "Practically, no. Green bond issuance involves significant costs — legal fees, certification, rating, and listing — that are only justified for large projects (₹25 crore+). Small businesses benefit from green bonds indirectly when banks use green bond proceeds to fund solar loans at lower interest rates."
    },
    {
      "question": "How do green bonds reduce solar costs?",
      "answer": "Green bonds attract ESG-focused investors who accept slightly lower returns, creating a ''greenium'' of 0.5–1.5%. This lower cost of capital flows through to solar project developers (who offer cheaper PPAs) and banks (who offer lower solar loan rates). The end consumer benefits without directly interacting with the bond market."
    },
    {
      "question": "Are green bonds regulated in India?",
      "answer": "Yes. SEBI issued the Green Bond Framework in 2023 with clear definitions of eligible projects, disclosure requirements, and use-of-proceeds tracking. Green bonds must be independently verified and the issuer must provide annual allocation and impact reports. This regulatory clarity has boosted investor confidence."
    },
    {
      "question": "What is the minimum investment for solar green bonds?",
      "answer": "For retail investors, sovereign green bonds are available on the secondary market through BSE/NSE at face value of ₹10,000. Corporate green bonds typically have minimum lot sizes of ₹10 lakh. However, these are investment opportunities — for financing your solar installation, standard bank loans or RESCO models are more relevant."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'green-bonds' AND pillar_slug = 'solar-financing';

COMMIT;
