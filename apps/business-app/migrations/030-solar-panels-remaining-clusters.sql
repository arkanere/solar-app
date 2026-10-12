-- Solar Panels remaining clusters: half-cut, warranty, for-home, for-commercial
-- Run: psql $POSTGRES_URL < src/lib/server/migrations/030-solar-panels-remaining-clusters.sql

BEGIN;

-- 1. CLUSTER: half-cut
UPDATE seo_pages SET
  h1 = 'Half-Cut Solar Panels: How They Work and Why They Perform Better',
  meta_title = 'Half-Cut Solar Panels India: Technology, Benefits & Price Guide | Solar Vipani',
  meta_description = 'Half-cut cell solar panels reduce shading losses by 50% and improve output by 2–4%. Learn how the technology works, pricing, and whether they are worth the upgrade.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Half-cut solar panels use cells that are laser-cut in half — a 540W panel has <strong>120 or 144 half-cells</strong> instead of 60 or 72 full cells. This simple change reduces internal resistive losses, improves shade tolerance, and boosts real-world output by <strong>2–4%</strong> compared to full-cell panels. Most <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline</a> panels sold in India today already use half-cut cell technology — it has become the industry standard rather than a premium upgrade.</p>"
    },
    {
      "heading": "How Half-Cut Cell Technology Works",
      "body": "<p>In a conventional solar panel, each cell generates current that flows through the entire string. When you halve each cell, the current per cell is also halved. Since resistive power loss follows the formula <em>P = I²R</em>, halving the current reduces resistive losses by <strong>75%</strong>.</p><p>The panel is internally wired as two independent halves — top and bottom. Each half operates as a separate circuit with its own bypass diode. This parallel architecture means:</p><ul><li>If the bottom half is shaded, the top half continues producing power at full capacity</li><li>Current per string is halved, reducing heat generation in busbars and ribbons</li><li>Hot spot risk is significantly lower because each cell carries less current</li></ul><p>The cells themselves are identical in material and efficiency to full-size cells — only the physical size changes. A 182mm × 182mm cell becomes two 91mm × 182mm cells. No silicon is wasted in the cutting process.</p>"
    },
    {
      "heading": "Half-Cut vs Full-Cell: Performance Comparison",
      "body": "<table><thead><tr><th>Metric</th><th>Half-Cut Cell</th><th>Full Cell</th><th>Advantage</th></tr></thead><tbody><tr><td>Resistive loss</td><td>~0.5%</td><td>~2%</td><td>Half-cut: 75% less loss</td></tr><tr><td>Shade tolerance</td><td>50% of panel can shade with minimal loss</td><td>One shaded cell affects entire string</td><td>Half-cut: far superior</td></tr><tr><td>Hot spot risk</td><td>Low (less current per cell)</td><td>Higher</td><td>Half-cut: safer</td></tr><tr><td>Real-world output gain</td><td>+2–4% vs same-rated full cell</td><td>Baseline</td><td>Half-cut produces more energy</td></tr><tr><td>Temperature performance</td><td>Slightly better (less resistive heating)</td><td>Baseline</td><td>Half-cut: marginal edge</td></tr><tr><td>Reliability</td><td>Higher (lower mechanical stress per cell)</td><td>Baseline</td><td>Half-cut: fewer micro-cracks</td></tr></tbody></table><p>The 2–4% output advantage may seem small, but over 25 years for a 3kW system, it translates to <strong>1,500–3,000 extra kWh</strong> — worth ₹10,000–₹25,000 at current tariffs.</p>"
    },
    {
      "heading": "Why Shade Tolerance Matters in India",
      "body": "<p>Indian rooftops are rarely shade-free for the entire day. Common sources of partial shading include:</p><ul><li><strong>Water tanks</strong> — almost every Indian home has a rooftop water tank that casts shadows</li><li><strong>Staircase structures</strong> — building staircase heads create long shadows in morning and evening</li><li><strong>Neighbouring buildings</strong> — dense urban areas mean adjacent buildings cast shadows at certain times</li><li><strong>Trees</strong> — overhanging branches from nearby trees</li><li><strong>Satellite dishes and antennas</strong> — small but impactful shadows on nearby cells</li></ul><p>In a full-cell panel, shading even one cell in a string can reduce the entire string''s output by 30–50%. In a half-cut panel, the independent top/bottom halves mean only the affected half loses output — the other half runs at full power.</p><p>For Indian urban rooftops with inevitable partial shading, half-cut panels recover <strong>10–20% more energy</strong> over a year compared to full-cell panels in the same shading conditions.</p>"
    },
    {
      "heading": "Half-Cut Panel Pricing in India",
      "body": "<p>Half-cut cell technology has become standard in most <a href=\"/in/solar-panels/brands/\">major brands</a>. The price premium over full-cell panels has effectively disappeared for new purchases:</p><table><thead><tr><th>Panel Type</th><th>Cell Configuration</th><th>Price/Watt</th></tr></thead><tbody><tr><td>Mono PERC (half-cut)</td><td>120 or 144 cells</td><td>₹24–₹32</td></tr><tr><td>Mono PERC (full-cell)</td><td>60 or 72 cells</td><td>₹22–₹28</td></tr><tr><td>Mono TOPCon (half-cut)</td><td>120 or 144 cells</td><td>₹28–₹36</td></tr><tr><td>Poly (half-cut)</td><td>120 or 144 cells</td><td>₹18–₹24</td></tr></tbody></table><p>All leading Indian brands — Waaree, Tata Power Solar, Adani Solar, Vikram Solar — now ship half-cut as default in their 530W+ panels. You would need to specifically seek out full-cell panels, which are mostly found in older or lower-wattage models.</p><p>If you are getting quotes for a new installation, your panels will almost certainly be half-cut. Confirm this on the datasheet: look for 120 or 144 cells (half-cut) vs 60 or 72 cells (full).</p>"
    },
    {
      "heading": "Half-Cut in Combination with Other Technologies",
      "body": "<p>Half-cut is a cell-level technology that combines freely with other panel innovations:</p><ul><li><strong>Half-cut + PERC:</strong> The most common residential panel in India today. 19–21% efficiency at ₹24–₹32/W. The default choice for most homes.</li><li><strong>Half-cut + TOPCon:</strong> Next-generation cell technology with 21–23.5% efficiency. Gaining market share rapidly. Best for space-constrained roofs.</li><li><strong>Half-cut + <a href=\"/in/solar-panels/bifacial/\">Bifacial</a>:</strong> Generates power from both sides. The half-cut architecture improves shade performance on the front while the rear side captures reflected light. Best for elevated commercial mounts.</li><li><strong>Half-cut + MBB (Multi-Busbar):</strong> More busbars per cell reduce current path length and improve crack tolerance. Most modern panels combine half-cut with 9–16 busbars.</li></ul><p>When buying, focus on the cell technology (PERC, TOPCon, HJT) and overall panel efficiency rather than half-cut as a differentiator — it is now table stakes.</p>"
    },
    {
      "heading": "Should You Upgrade Existing Full-Cell Panels?",
      "body": "<p>If you already have full-cell panels installed:</p><ul><li><strong>Do not replace working panels</strong> — the 2–4% gain does not justify the cost of removing and reinstalling</li><li><strong>If expanding your system</strong> — add half-cut panels on a separate string from your existing full-cell panels. Do not mix half-cut and full-cell in the same string as their electrical characteristics differ.</li><li><strong>If replacing a failed panel</strong> — match the existing panel specifications closely. Switching one panel to half-cut while others are full-cell creates string mismatch issues.</li></ul>"
    },
    {
      "heading": "Get Panels with the Latest Technology",
      "body": "<p>Half-cut cell technology is now standard in quality solar installations. When you get quotes through Solar Vipani, our verified installers specify exact panel models — so you can confirm cell count, technology, and specifications before committing.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is a half-cut solar panel?",
      "answer": "A half-cut solar panel uses cells that are laser-cut in half — 120 or 144 half-cells instead of 60 or 72 full cells. This reduces internal resistive losses by 75%, improves shade tolerance, and boosts real-world output by 2–4%. Most modern monocrystalline panels sold in India already use half-cut technology."
    },
    {
      "question": "Are half-cut solar panels more expensive?",
      "answer": "Not anymore. Half-cut has become the standard in 530W+ panels from all major brands. The price difference over full-cell panels is negligible (₹0–₹2/W). All leading Indian brands — Waaree, Tata, Adani, Vikram — now ship half-cut as their default in high-wattage models."
    },
    {
      "question": "How do half-cut panels handle shade better?",
      "answer": "Half-cut panels are wired as two independent halves (top and bottom). If the bottom half is shaded, the top half continues at full power. In full-cell panels, one shaded cell can reduce the entire string output by 30–50%. This makes half-cut panels ideal for Indian rooftops with water tanks, staircase shadows, or nearby buildings."
    },
    {
      "question": "Can I identify half-cut panels from the datasheet?",
      "answer": "Yes. Look at the cell count: 120 cells (half-cut equivalent of 60 full cells) or 144 cells (equivalent of 72 full cells). Full-cell panels show 60 or 72 cells. The datasheet may also explicitly state ''half-cut'' or ''HC'' in the model designation."
    },
    {
      "question": "Should I replace my existing full-cell panels with half-cut?",
      "answer": "No. The 2–4% output gain does not justify the cost of removing and reinstalling working panels. If you are expanding your system, add half-cut panels on a separate inverter string. If replacing a failed panel, match the existing panel specifications to avoid string mismatch issues."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'half-cut' AND pillar_slug = 'solar-panels';


-- 2. CLUSTER: warranty
UPDATE seo_pages SET
  h1 = 'Solar Panel Warranty in India: What''s Covered and What''s Not',
  meta_title = 'Solar Panel Warranty India: Product vs Performance, Claims Guide | Solar Vipani',
  meta_description = 'Solar panels carry 12–15 year product and 25–30 year performance warranties. Learn what each covers, how to file claims, and which brands offer the best terms.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar panels in India come with two warranties: a <strong>product warranty (10–15 years)</strong> covering manufacturing defects, and a <strong>performance warranty (25–30 years)</strong> guaranteeing minimum output levels. A 25-year performance warranty from a <a href=\"/in/solar-panels/brands/\">Tier 1 brand</a> typically guarantees ≥84% output at year 25. The warranty is only as reliable as the manufacturer''s ability to honour it — prioritise brands with Indian manufacturing or service presence.</p>"
    },
    {
      "heading": "Product Warranty vs Performance Warranty",
      "body": "<p>These are two separate warranties that cover different things:</p><table><thead><tr><th>Aspect</th><th>Product Warranty</th><th>Performance Warranty</th></tr></thead><tbody><tr><td>Duration</td><td>10–15 years</td><td>25–30 years</td></tr><tr><td>Covers</td><td>Manufacturing defects, material failures</td><td>Output degradation beyond specified limits</td></tr><tr><td>Examples</td><td>Delamination, junction box failure, cracked glass (not from impact), cell interconnect breaks, backsheet peeling</td><td>Panel producing below guaranteed percentage of rated power at a given year</td></tr><tr><td>Claim trigger</td><td>Physical defect visible or causing failure</td><td>Measured output falls below warranty curve</td></tr><tr><td>Remedy</td><td>Repair, replace, or refund (manufacturer''s choice)</td><td>Replace or compensate for lost output</td></tr></tbody></table><p>Both warranties are provided by the panel <strong>manufacturer</strong>, not the installer. However, your installer is often the intermediary who initiates the claim process on your behalf.</p>"
    },
    {
      "heading": "Understanding the Performance Warranty Curve",
      "body": "<p>A performance warranty guarantees minimum output at each year of the panel''s life. There are two types:</p><p><strong>Linear warranty (better):</strong> Guarantees a specific output percentage every year, declining gradually. Example: 97% in year 1, declining by 0.5% per year, reaching 84.8% at year 25. You can claim at any point if output falls below the curve.</p><p><strong>Step warranty (worse):</strong> Only guarantees at two points — typically 90% at year 10 and 80% at year 25. Between those points, there is no guarantee. This means the manufacturer is not liable if your panel drops to 82% at year 9.</p><table><thead><tr><th>Year</th><th>Linear Warranty (typical)</th><th>Step Warranty (typical)</th></tr></thead><tbody><tr><td>1</td><td>≥97%</td><td>Not specified</td></tr><tr><td>5</td><td>≥95%</td><td>Not specified</td></tr><tr><td>10</td><td>≥92.5%</td><td>≥90%</td></tr><tr><td>15</td><td>≥90%</td><td>Not specified</td></tr><tr><td>20</td><td>≥87.5%</td><td>Not specified</td></tr><tr><td>25</td><td>≥84.8%</td><td>≥80%</td></tr></tbody></table><p><strong>Always choose panels with linear warranty.</strong> All Tier 1 brands now offer linear performance warranties. Step warranties are typically found on budget or lesser-known brands.</p>"
    },
    {
      "heading": "Warranty Terms by Major Brands",
      "body": "<table><thead><tr><th>Brand</th><th>Product Warranty</th><th>Performance Warranty</th><th>Year 25 Guarantee</th></tr></thead><tbody><tr><td>Waaree</td><td>12 years</td><td>25 years (linear)</td><td>≥84.8%</td></tr><tr><td>Tata Power Solar</td><td>12 years</td><td>25 years (linear)</td><td>≥84%</td></tr><tr><td>Adani Solar</td><td>12 years</td><td>25 years (linear)</td><td>≥84%</td></tr><tr><td>Vikram Solar</td><td>12 years</td><td>25 years (linear)</td><td>≥84.8%</td></tr><tr><td>LONGi</td><td>15 years</td><td>25 years (linear)</td><td>≥86.2%</td></tr><tr><td>Jinko Solar</td><td>15 years</td><td>30 years (linear)</td><td>≥87.4%</td></tr><tr><td>Canadian Solar</td><td>15 years</td><td>25 years (linear)</td><td>≥84.8%</td></tr></tbody></table><p>LONGi and Jinko lead on warranty terms — 15-year product warranty and highest year-25 guarantees. Among Indian brands, Waaree and Vikram offer the strongest performance commitments.</p><p><a href=\"/in/solar-panels/brands/\">Full brand comparison →</a></p>"
    },
    {
      "heading": "What Voids Your Solar Panel Warranty",
      "body": "<p>Avoid these common actions that can void your warranty:</p><ul><li><strong>Installation by non-certified installer:</strong> Most manufacturers require installation by an authorised or certified installer. DIY installation or work by an unqualified electrician can void both product and performance warranties.</li><li><strong>Physical damage:</strong> Cracks from impact (hail, falling objects, foot traffic), improper handling during cleaning, or pressure washer damage are not covered.</li><li><strong>Improper mounting:</strong> Drilling through panel frames, mounting at incorrect angles that cause water pooling, or using incompatible clamps.</li><li><strong>Electrical modifications:</strong> Altering the junction box, rewiring bypass diodes, or connecting panels in configurations outside the manufacturer''s specifications.</li><li><strong>Environmental damage exclusions:</strong> Lightning strikes, floods, fire (unless caused by panel defect), and acts of nature are typically excluded.</li><li><strong>Removing or altering nameplate/serial number:</strong> The serial number is how the manufacturer tracks warranty eligibility.</li></ul><p><strong>Tip:</strong> Keep your purchase invoice, installation certificate, and warranty card in a safe place. Photograph the serial numbers of all panels on the day of installation.</p>"
    },
    {
      "heading": "How to File a Warranty Claim",
      "body": "<p>If you suspect a panel is underperforming or defective:</p><ol><li><strong>Document the issue:</strong> Take photos of visible defects. For performance claims, export data from your inverter monitoring app showing output decline over time.</li><li><strong>Contact your installer first:</strong> Most installers handle warranty claims on your behalf as part of their service. They have direct channels with manufacturers.</li><li><strong>If installer is unresponsive:</strong> Contact the manufacturer directly via their website or customer care. Provide your panel serial number, purchase invoice, and installation date.</li><li><strong>Independent testing (for performance claims):</strong> The manufacturer may send a technician or require an independent lab test (I-V curve measurement) to verify that output has fallen below the warranty curve. This test costs ₹2,000–₹5,000 per panel if you commission it independently.</li><li><strong>Resolution:</strong> The manufacturer will either repair, replace, or compensate. Replacement panels may be equivalent (same wattage) rather than identical models if the original model is discontinued.</li></ol><p><strong>Timeline:</strong> Expect 30–90 days for resolution depending on the manufacturer and claim complexity. Premium brands like Tata Power Solar are known for faster resolution.</p>"
    },
    {
      "heading": "Inverter and Installation Warranties",
      "body": "<p>Your solar system has three separate warranties:</p><table><thead><tr><th>Component</th><th>Typical Warranty</th><th>Provided By</th></tr></thead><tbody><tr><td>Solar panels</td><td>12–15 yr product + 25–30 yr performance</td><td>Panel manufacturer</td></tr><tr><td><a href=\"/in/rooftop-solar/inverter/\">Solar inverter</a></td><td>5–10 years</td><td>Inverter manufacturer</td></tr><tr><td>Mounting structure</td><td>5–10 years</td><td>Installer or structure manufacturer</td></tr><tr><td>Workmanship / installation</td><td>1–2 years</td><td>Installer</td></tr></tbody></table><p>The inverter is the weak link — with a 5–10 year warranty against a 25-year panel life, you will likely need one inverter replacement. Budget ₹20,000–₹60,000 for this at the 10–15 year mark.</p><p>Some inverter brands offer extended warranty purchases (e.g., Fronius offers up to 20-year extended warranty). This can be worth it if you want peace of mind.</p>"
    },
    {
      "heading": "Warranty Insurance and Third-Party Guarantees",
      "body": "<p>For additional protection beyond the manufacturer''s warranty:</p><ul><li><strong>Comprehensive solar insurance:</strong> Some general insurers (HDFC Ergo, ICICI Lombard) offer standalone solar system insurance covering damage, theft, and output underperformance. Premiums run ₹1,000–₹3,000/year for residential systems.</li><li><strong>Installer AMC plans:</strong> Annual maintenance contracts from your installer typically include routine inspections that catch warranty-eligible issues early. <a href=\"/in/rooftop-solar/maintenance/\">Maintenance guide →</a></li></ul><p>For most homeowners, choosing a Tier 1 brand with strong Indian presence is sufficient protection. Insurance is worth considering for systems above 5kW or in extreme weather zones.</p>"
    },
    {
      "heading": "Choose Panels with Warranties You Can Trust",
      "body": "<p>A warranty is only as good as the company behind it. When comparing quotes through Solar Vipani, each installer specifies the exact panel brand and model — so you can verify warranty terms before committing.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How long is the warranty on solar panels in India?",
      "answer": "Solar panels come with two warranties: a product warranty of 10–15 years covering manufacturing defects, and a performance warranty of 25–30 years guaranteeing minimum output. Most Tier 1 brands guarantee ≥84% output at year 25 under a linear performance warranty."
    },
    {
      "question": "What is the difference between product and performance warranty?",
      "answer": "Product warranty covers physical/manufacturing defects — delamination, junction box failure, cell interconnect breaks. Performance warranty covers output degradation — if your panel produces below the guaranteed percentage at any year, you can claim. You need both for full protection."
    },
    {
      "question": "What can void my solar panel warranty?",
      "answer": "Common warranty voiders include: installation by a non-certified installer, physical damage from impact or pressure washing, improper mounting (drilling through frames), electrical modifications to the junction box, and removing the serial number plate. Always use a certified installer and follow manufacturer cleaning guidelines."
    },
    {
      "question": "How do I file a solar panel warranty claim?",
      "answer": "Contact your installer first — they typically handle claims on your behalf. Provide photos of defects or inverter monitoring data showing output decline. The manufacturer may send a technician for verification. Resolution (repair, replace, or compensate) takes 30–90 days depending on brand and claim type."
    },
    {
      "question": "Is a 25-year solar panel warranty reliable?",
      "answer": "From Tier 1 brands with Indian manufacturing or service presence — yes. Companies like Waaree, Tata, Adani, LONGi, and Jinko have the financial stability and local infrastructure to honour long-term warranties. Avoid unknown brands without Indian presence, as filing claims across borders is extremely difficult."
    },
    {
      "question": "Should I buy extended warranty for my solar inverter?",
      "answer": "It can be worthwhile. Standard inverter warranties are 5–10 years, but panels last 25+ years. An extended warranty to 15–20 years (offered by brands like Fronius and SMA) costs ₹5,000–₹15,000 but avoids a ₹20,000–₹60,000 replacement cost. Evaluate based on brand reliability and your risk tolerance."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'warranty' AND pillar_slug = 'solar-panels';


-- 3. CLUSTER: for-home
UPDATE seo_pages SET
  h1 = 'Best Solar Panels for Home in India: How to Choose the Right One',
  meta_title = 'Best Solar Panels for Home India 2026: Top Picks by Size & Budget | Solar Vipani',
  meta_description = 'Find the best solar panels for your home — size, type, brand, and price recommendations for 1kW–10kW residential systems. Based on data from verified installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The best solar panels for Indian homes are <strong><a href=\"/in/solar-panels/monocrystalline/\">monocrystalline</a> PERC or TOPCon panels in 530W–550W range</strong> from BIS-certified Tier 1 brands. For most 2–3 BHK homes, a <strong>3kW system with 6 panels</strong> is ideal — costing ₹1,50,000–₹1,90,000 before subsidy and ₹72,000–₹1,12,000 after <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a>. Top residential brands include Waaree, Tata Power Solar, Adani Solar, and Vikram Solar.</p>"
    },
    {
      "heading": "What Makes a Solar Panel Good for Home Use?",
      "body": "<p>Residential solar panels need to optimise for different factors than commercial or utility-scale panels. Here is what matters most for homes:</p><ul><li><strong>Space efficiency:</strong> Urban Indian homes have limited roof space (200–500 sq ft usable). Higher efficiency means more power from less area.</li><li><strong>Heat performance:</strong> Indian rooftops get extremely hot. A good temperature coefficient preserves output in 40–48°C ambient temperatures.</li><li><strong>Shade tolerance:</strong> Water tanks, staircase structures, and neighbouring buildings create partial shading. <a href=\"/in/solar-panels/half-cut/\">Half-cut cell</a> panels handle this better.</li><li><strong>Aesthetics:</strong> Panels are visible on the roof. Sleek black monocrystalline panels look better than blue polycrystalline.</li><li><strong>Warranty and service:</strong> A 25-year investment needs a manufacturer that will be around to honour <a href=\"/in/solar-panels/warranty/\">warranty</a> claims.</li><li><strong>Price-to-performance ratio:</strong> The best panel is not the most expensive — it is the one that delivers the highest return over 25 years on your specific roof.</li></ul>"
    },
    {
      "heading": "Recommended Panel Types by Home Size",
      "body": "<table><thead><tr><th>Home Type</th><th>Monthly Usage</th><th>System Size</th><th>Recommended Panel</th><th>Budget (before subsidy)</th></tr></thead><tbody><tr><td>1 BHK / small home</td><td>100–200 units</td><td>1–2kW</td><td>Mono PERC 540W × 2–4</td><td>₹60,000–₹1,40,000</td></tr><tr><td>2 BHK / medium home</td><td>200–350 units</td><td>2–3kW</td><td>Mono PERC 540W × 4–6</td><td>₹1,10,000–₹1,90,000</td></tr><tr><td>3 BHK / large home</td><td>350–600 units</td><td>3–5kW</td><td>Mono PERC/TOPCon 540W × 6–10</td><td>₹1,50,000–₹3,20,000</td></tr><tr><td>Villa / high usage</td><td>600+ units</td><td>5–10kW</td><td>TOPCon 540–580W × 10–18</td><td>₹2,50,000–₹6,50,000</td></tr></tbody></table><p><strong>Most popular choice:</strong> A 3kW system with 6 × 540W monocrystalline PERC panels covers the average Indian home. This fits in ~200 sq ft of roof space and generates 12–15 units per day.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate the exact size for your home</a></p>"
    },
    {
      "heading": "Top Solar Panel Brands for Homes",
      "body": "<p>These brands are most recommended by installers for residential projects in India:</p><table><thead><tr><th>Brand</th><th>Best Model Range</th><th>Price/W</th><th>Why Choose</th></tr></thead><tbody><tr><td>Waaree</td><td>Energynext 540–550W</td><td>₹24–₹30</td><td>Widest availability, best value</td></tr><tr><td>Tata Power Solar</td><td>TP540M / TP550M</td><td>₹27–₹33</td><td>Brand trust, best after-sales service</td></tr><tr><td>Adani Solar</td><td>ASP 540–550W</td><td>₹22–₹28</td><td>Most competitive pricing</td></tr><tr><td>Vikram Solar</td><td>Eldora Grand 540W</td><td>₹24–₹30</td><td>Strong R&D, early TOPCon</td></tr><tr><td>Luminous</td><td>Mono PERC 540W</td><td>₹24–₹30</td><td>Best for Tier 2/3 cities</td></tr></tbody></table><p>All these brands are BIS-certified, Bloomberg Tier 1, and have Indian manufacturing. For the detailed comparison, see our <a href=\"/in/solar-panels/brands/\">brand guide</a>.</p><p><strong>Tip:</strong> Ask your installer which brands they stock and have warranty claim experience with. The best panel is one your local installer can fully support.</p>"
    },
    {
      "heading": "Mono PERC vs TOPCon: Which Is Better for Homes?",
      "body": "<p>The two leading technologies for residential panels:</p><table><thead><tr><th>Feature</th><th>Mono PERC</th><th>TOPCon</th></tr></thead><tbody><tr><td><a href=\"/in/solar-panels/efficiency/\">Efficiency</a></td><td>19–21%</td><td>21–23.5%</td></tr><tr><td>Price/W</td><td>₹24–₹32</td><td>₹28–₹36</td></tr><tr><td>Temperature coefficient</td><td>-0.34 to -0.38%/°C</td><td>-0.30 to -0.35%/°C</td></tr><tr><td>Degradation rate</td><td>0.45–0.55%/year</td><td>0.35–0.45%/year</td></tr><tr><td>Best for</td><td>Most homes with adequate roof space</td><td>Space-constrained roofs, hot regions</td></tr></tbody></table><p><strong>Choose Mono PERC</strong> if you have 200+ sq ft of usable roof and want the best value. <strong>Choose TOPCon</strong> if roof space is tight, you are in a very hot region, or you want maximum 25-year output.</p><p>Both are excellent choices. The 10–15% price premium for TOPCon is justified if your roof space or climate makes the extra efficiency worthwhile.</p>"
    },
    {
      "heading": "Solar Panels for Apartments",
      "body": "<p>Installing solar in an apartment has unique considerations:</p><ul><li><strong>Shared rooftop:</strong> Space is divided among participating flat owners. This often means smaller systems (1–2kW per flat) where space efficiency matters most.</li><li><strong>Best panel choice:</strong> Higher-efficiency TOPCon panels make sense for apartments because you are working with limited allocated space. An extra 10% efficiency per panel means meaningful extra output from your restricted area.</li><li><strong>Housing society coordination:</strong> The society must approve installation. Some societies install a common system for shared loads (lifts, water pumps, corridor lights) and divide the savings.</li></ul><p>Under PM Surya Ghar, individual flat owners are eligible for subsidy on their share of the rooftop system.</p><p><a href=\"/in/rooftop-solar/for-apartments/\">Full apartment solar guide →</a></p>"
    },
    {
      "heading": "Key Specifications to Check Before Buying",
      "body": "<p>When your installer presents a quote, verify these specifications on the panel datasheet:</p><ol><li><strong>Rated power (Wp):</strong> 530W+ for new installations. Avoid older 250–330W panels.</li><li><strong>Cell type:</strong> Monocrystalline PERC or TOPCon. Avoid polycrystalline unless budget is the only constraint.</li><li><strong>Cell configuration:</strong> 120 or 144 half-cut cells (not 60/72 full cells). <a href=\"/in/solar-panels/half-cut/\">Why half-cut matters →</a></li><li><strong>Module efficiency:</strong> ≥19% for PERC, ≥21% for TOPCon.</li><li><strong>Temperature coefficient (Pmax):</strong> ≤ -0.38%/°C for PERC, ≤ -0.35%/°C for TOPCon.</li><li><strong>Warranty:</strong> ≥12-year product + 25-year linear performance. <a href=\"/in/solar-panels/warranty/\">Warranty guide →</a></li><li><strong>BIS certification:</strong> IS 14286 — mandatory. No exceptions.</li></ol>"
    },
    {
      "heading": "Get Personalised Recommendations",
      "body": "<p>Every home is different — roof space, orientation, shading, and budget all influence the best panel choice. Solar Vipani connects you with 2–3 verified installers who assess your roof and recommend the optimal panel for your specific situation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which solar panel is best for home use in India?",
      "answer": "Monocrystalline PERC panels (540W, 19–21% efficiency) from Tier 1 brands like Waaree, Tata Power Solar, or Adani Solar are the best choice for most Indian homes. They offer the best balance of efficiency, price, and heat performance. For space-constrained roofs, TOPCon panels (21–23%) are worth the premium."
    },
    {
      "question": "How many solar panels does a typical home need?",
      "answer": "A typical 2–3 BHK home consuming 300–400 units monthly needs a 3kW system — that is 6 panels of 540W each. Smaller homes (1 BHK) need 2–4 panels. Larger homes with heavy AC usage need 10–18 panels (5–10kW). The formula: monthly units ÷ 120 = system size in kW."
    },
    {
      "question": "What is the price of solar panels for home in India?",
      "answer": "For a 3kW home system: ₹1,50,000–₹1,90,000 before subsidy (total installed with inverter and mounting). After PM Surya Ghar subsidy of ₹78,000, your cost is ₹72,000–₹1,12,000. Panel-only cost is ₹24–₹32 per watt for monocrystalline PERC."
    },
    {
      "question": "Should I choose monocrystalline or polycrystalline for my home?",
      "answer": "Monocrystalline for most homes. It offers 20–40% more power per square foot, handles Indian heat better, and the price gap has narrowed to 20–25%. Choose polycrystalline only if you have a very large roof and budget is the absolute top priority."
    },
    {
      "question": "Can I install solar panels on my apartment roof?",
      "answer": "Yes, with housing society approval. Each flat owner gets allocated roof space proportional to their flat size. Higher-efficiency TOPCon panels are recommended for apartments since space is limited. Individual flat owners qualify for PM Surya Ghar subsidy on their share."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-home' AND pillar_slug = 'solar-panels';


-- 4. CLUSTER: for-commercial
UPDATE seo_pages SET
  h1 = 'Commercial Solar Panels in India: Guide for Businesses and Industries',
  meta_title = 'Commercial Solar Panels India: Cost, ROI & System Sizing Guide | Solar Vipani',
  meta_description = 'Commercial solar systems (10kW–1MW) cut electricity costs by 30–70%. See pricing, ROI, panel recommendations, and financing options for Indian businesses.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Commercial <a href=\"/in/solar-panels/\">solar panel</a> systems in India range from <strong>10kW to 1MW+</strong>, cost <strong>₹40–₹55 per watt installed</strong> (lower per-watt than residential), and deliver ROI of <strong>20–35% annually</strong>. Businesses typically recover their investment in <strong>3–5 years</strong> thanks to higher commercial electricity tariffs (₹8–₹14/unit). No residential subsidy applies, but accelerated depreciation (40%) and tax benefits make the economics compelling.</p>"
    },
    {
      "heading": "Why Commercial Solar Makes Financial Sense",
      "body": "<p>Commercial electricity tariffs in India are significantly higher than residential — ₹8–₹14 per unit in most states. This makes the solar savings case even stronger than for homes:</p><table><thead><tr><th>Business Type</th><th>Typical System</th><th>Monthly Savings</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>Small office / shop</td><td>10–20kW</td><td>₹15,000–₹40,000</td><td>₹1.8L–₹4.8L</td><td>3–4 years</td></tr><tr><td>Factory / warehouse</td><td>50–200kW</td><td>₹1L–₹5L</td><td>₹12L–₹60L</td><td>3–5 years</td></tr><tr><td>IT park / commercial complex</td><td>200kW–1MW</td><td>₹5L–₹25L</td><td>₹60L–₹3Cr</td><td>4–5 years</td></tr><tr><td>Cold storage / food processing</td><td>50–500kW</td><td>₹1.5L–₹12L</td><td>₹18L–₹1.5Cr</td><td>3–4 years</td></tr></tbody></table><p>Unlike residential installations, commercial systems do not receive direct PM Surya Ghar subsidies. However, businesses benefit from <strong>accelerated depreciation (40% in year 1)</strong> under the Income Tax Act, which effectively reduces the tax burden and improves ROI.</p>"
    },
    {
      "heading": "Best Panel Types for Commercial Installations",
      "body": "<p>Commercial projects have different requirements from residential — larger scale, more roof space, and higher emphasis on cost per watt:</p><table><thead><tr><th>Panel Type</th><th><a href=\"/in/solar-panels/efficiency/\">Efficiency</a></th><th>Price/W</th><th>Best For</th></tr></thead><tbody><tr><td><a href=\"/in/solar-panels/monocrystalline/\">Mono PERC</a></td><td>19–21%</td><td>₹22–₹28</td><td>Most commercial rooftops — best value</td></tr><tr><td>Mono TOPCon</td><td>21–23.5%</td><td>₹26–₹34</td><td>Space-constrained commercial roofs</td></tr><tr><td><a href=\"/in/solar-panels/bifacial/\">Bifacial</a></td><td>20–23% (front) + 10–25% rear gain</td><td>₹30–₹42</td><td>Elevated structures, carports, ground mounts</td></tr><tr><td><a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a></td><td>15–18%</td><td>₹16–₹22</td><td>Large warehouses with unlimited roof space</td></tr></tbody></table><p><strong>Mono PERC</strong> dominates commercial installations in India — it offers the best ₹/kWh generated over 25 years. <strong>Bifacial panels</strong> are worth the premium for ground-mounted solar farms and carport structures where reflected light boosts rear-side generation by 10–25%.</p><p>For large warehouses with expansive metal roofs, <strong>polycrystalline</strong> panels still make sense — the lower efficiency is irrelevant when space is unlimited, and the price savings on hundreds of panels add up significantly.</p>"
    },
    {
      "heading": "Commercial System Sizing",
      "body": "<p>Commercial system sizing is driven by three factors: electricity consumption, available roof/ground space, and sanctioned load.</p><p><strong>Sizing formula:</strong></p><p><em>System size (kW) = Annual consumption (kWh) ÷ 1,400</em></p><p>(Assumes 4.5 peak sun hours × 365 days × 85% system efficiency)</p><table><thead><tr><th>Monthly Consumption</th><th>System Size</th><th>Roof Area (Mono)</th><th>Panels (540W)</th></tr></thead><tbody><tr><td>2,000–5,000 units</td><td>20–50kW</td><td>1,500–3,500 sq ft</td><td>37–93</td></tr><tr><td>5,000–15,000 units</td><td>50–125kW</td><td>3,500–9,000 sq ft</td><td>93–232</td></tr><tr><td>15,000–50,000 units</td><td>125–400kW</td><td>9,000–28,000 sq ft</td><td>232–741</td></tr><tr><td>50,000+ units</td><td>400kW–1MW+</td><td>28,000–70,000 sq ft</td><td>741–1,852</td></tr></tbody></table><p><strong>Sanctioned load constraint:</strong> Most DISCOMs allow net metering for systems up to the sanctioned load. For systems exceeding sanctioned load, net billing (lower feed-in tariff) may apply. Consult your DISCOM before finalising system size.</p>"
    },
    {
      "heading": "Commercial Solar Pricing and Costs",
      "body": "<p>Commercial systems benefit from economies of scale — lower per-watt pricing than residential:</p><table><thead><tr><th>System Size</th><th>Cost/Watt (installed)</th><th>Total Cost</th></tr></thead><tbody><tr><td>10–25kW</td><td>₹48–₹55</td><td>₹4.8L–₹13.8L</td></tr><tr><td>25–100kW</td><td>₹42–₹50</td><td>₹10.5L–₹50L</td></tr><tr><td>100–500kW</td><td>₹38–₹46</td><td>₹38L–₹2.3Cr</td></tr><tr><td>500kW–1MW</td><td>₹35–₹42</td><td>₹1.75Cr–₹4.2Cr</td></tr></tbody></table><p>Commercial pricing is 10–25% lower per watt than residential because bulk panel purchasing, standardised mounting on flat commercial roofs, and larger inverter sizes all reduce unit costs.</p><p><a href=\"/in/solar-panels/price/\">Detailed solar panel pricing →</a></p>"
    },
    {
      "heading": "Tax Benefits and Financial Incentives",
      "body": "<p>While PM Surya Ghar subsidy is for residential only, commercial solar has its own financial incentives:</p><ul><li><strong>Accelerated depreciation (40%):</strong> Businesses can depreciate 40% of the solar system cost in year 1 under the Income Tax Act. For a ₹50L system in the 30% tax bracket, this saves ₹6L in taxes in the first year alone.</li><li><strong>GST input credit:</strong> The 13.8% GST paid on the solar system is available as input tax credit for GST-registered businesses, effectively reducing the net cost.</li><li><strong>Net metering credits:</strong> Available in all states. Commercial tariffs are higher, so net metering credits are more valuable per unit.</li><li><strong>Carbon credits:</strong> Large installations (100kW+) can generate carbon credits under voluntary carbon markets, providing an additional revenue stream.</li><li><strong>Green building certification:</strong> Solar installation contributes to IGBC/GRIHA green building ratings, which can increase commercial property value and rental premiums.</li></ul><p><a href=\"/in/solar-financing/commercial-financing/\">Commercial solar financing options →</a></p>"
    },
    {
      "heading": "OPEX vs CAPEX Models",
      "body": "<p>Commercial solar offers two ownership models:</p><p><strong>CAPEX (you own the system):</strong></p><ul><li>You pay the full upfront cost and own the system</li><li>Higher long-term savings — you keep all the electricity generated</li><li>Benefit from accelerated depreciation and GST input credit</li><li>Responsible for maintenance (or purchase an AMC)</li><li>Best for: Businesses with capital available, tax-paying entities that benefit from depreciation</li></ul><p><strong>OPEX / PPA (developer owns, you buy power):</strong></p><ul><li>A solar developer installs and owns the system on your roof</li><li>You sign a Power Purchase Agreement (PPA) to buy solar power at a fixed rate (₹3–₹5/unit), lower than your grid tariff</li><li>Zero upfront investment. Developer handles all maintenance</li><li>PPA tenure: 15–25 years. Rates may escalate 1–3% annually</li><li>Best for: Businesses that want savings without capital outlay or maintenance responsibility</li></ul><p>Many mid-sized businesses start with OPEX/PPA and switch to CAPEX ownership when the PPA term ends or when they have capital to invest.</p>"
    },
    {
      "heading": "Choosing an Installer for Commercial Projects",
      "body": "<p>Commercial installations are more complex than residential. Look for installers with:</p><ul><li><strong>Commercial portfolio:</strong> Past installations of similar scale in your region</li><li><strong>EPC capability:</strong> End-to-end engineering, procurement, and construction expertise</li><li><strong>DISCOM experience:</strong> Familiarity with commercial net metering process and HT/LT connection requirements</li><li><strong>AMC and monitoring:</strong> Remote monitoring systems and annual maintenance contracts for commercial-scale systems</li><li><strong>Financial structuring:</strong> Ability to offer CAPEX, OPEX/PPA, and hybrid financing models</li></ul><p>Solar Vipani connects businesses with verified EPC contractors experienced in commercial-scale installations across India.</p><p><a href=\"/in/get-quotes/\">Get your free commercial solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How much does commercial solar cost in India?",
      "answer": "Commercial solar costs ₹35–₹55 per watt installed, depending on system size. A 50kW system costs ₹21L–₹25L. A 200kW system costs ₹76L–₹92L. Larger systems get lower per-watt pricing due to economies of scale. These are pre-tax figures — GST input credit and accelerated depreciation further reduce effective cost."
    },
    {
      "question": "What is the ROI on commercial solar in India?",
      "answer": "Commercial solar delivers 20–35% annual ROI thanks to high commercial tariffs (₹8–₹14/unit). Most businesses recover their investment in 3–5 years. After payback, electricity savings flow directly to the bottom line for the remaining 20+ years of system life. Accelerated depreciation (40% in year 1) improves the financial return further."
    },
    {
      "question": "Do businesses get solar subsidies in India?",
      "answer": "PM Surya Ghar subsidy is for residential consumers only. However, businesses benefit from accelerated depreciation (40% in year 1) under Income Tax Act, GST input credit on the system cost, and net metering credits at high commercial tariff rates. These incentives often exceed the residential subsidy in financial value."
    },
    {
      "question": "What is the difference between CAPEX and OPEX solar models?",
      "answer": "In CAPEX, you pay upfront and own the system — higher long-term savings plus tax benefits from depreciation. In OPEX (PPA model), a developer installs and owns the system on your roof, and you buy power at a fixed rate (₹3–₹5/unit) — zero upfront cost but lower lifetime savings. CAPEX suits capital-rich businesses; OPEX suits those wanting savings without investment."
    },
    {
      "question": "Which solar panels are best for commercial installations?",
      "answer": "Mono PERC (540W+) panels offer the best value for most commercial rooftops. Bifacial panels are worth the premium for elevated mounts and carports where rear-side generation adds 10–25% extra output. Polycrystalline remains viable for massive warehouse roofs where space is unlimited and per-watt cost is the priority."
    },
    {
      "question": "How much roof space does a 100kW commercial solar system need?",
      "answer": "A 100kW system with monocrystalline panels needs approximately 6,500–7,500 sq ft of shadow-free roof area. Polycrystalline panels need 9,000–10,000 sq ft for the same capacity. Flat commercial roofs require tilted mounting, which adds spacing between rows — factor 1.3× the panel area for total roof footprint."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-commercial' AND pillar_slug = 'solar-panels';

COMMIT;