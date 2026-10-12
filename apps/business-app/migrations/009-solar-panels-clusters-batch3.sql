-- Solar Panels Clusters Batch 3: efficiency, brands, monocrystalline-vs-polycrystalline, buying-guide
-- Run: psql $POSTGRES_URL < 009-solar-panels-clusters-batch3.sql

BEGIN;

-- 1. CLUSTER: efficiency
UPDATE seo_pages SET
  h1 = 'Solar Panel Efficiency in India: What It Means & Why It Matters',
  meta_title = 'Solar Panel Efficiency India: 15–24% by Type, Real-World Data | Solar Vipani',
  meta_description = 'Solar panel efficiency ranges from 15% (poly) to 24% (HJT). Learn what efficiency means, how heat affects it, and whether higher efficiency panels are worth the cost.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar panel efficiency measures what percentage of sunlight hitting the panel gets converted into electricity. In India''s market, efficiency ranges from <strong>15–18% for polycrystalline</strong>, <strong>19–23% for monocrystalline PERC/TOPCon</strong>, and <strong>22–25% for HJT panels</strong>. For most homeowners, efficiency matters most when <strong>roof space is limited</strong> — a 22% panel produces the same power as a 16% panel in 30% less area.</p>"
    },
    {
      "heading": "What Does Efficiency Actually Mean?",
      "body": "<p>Efficiency is a ratio: the electrical power a panel produces divided by the solar energy hitting its surface. A 20% efficient panel converts 20% of incoming sunlight into usable electricity — the remaining 80% becomes heat or is reflected.</p><p><strong>Standard Test Conditions (STC):</strong> All efficiency ratings are measured under laboratory conditions — 1000 W/m² irradiance, 25°C cell temperature, AM 1.5 spectrum. Real-world conditions differ significantly:</p><ul><li>Indian irradiance varies from 800–1100 W/m² depending on season, time, and weather</li><li>Cell temperatures reach 55–65°C in Indian summers (30–40°C above STC)</li><li>Dust, humidity, and air quality reduce the light reaching cells</li></ul><p>Real-world efficiency is typically <strong>10–20% lower</strong> than the STC rating. A panel rated at 21% STC efficiency delivers roughly 17–19% in field conditions — still excellent.</p>"
    },
    {
      "heading": "Efficiency by Panel Type",
      "body": "<table><thead><tr><th>Panel Type</th><th>STC Efficiency</th><th>Real-World (India)</th><th>Price/Watt</th></tr></thead><tbody><tr><td><a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a></td><td>15–18%</td><td>12–15%</td><td>₹18–₹24</td></tr><tr><td><a href=\"/in/solar-panels/monocrystalline/\">Mono PERC</a></td><td>19–21.5%</td><td>16–18%</td><td>₹24–₹32</td></tr><tr><td>Mono TOPCon</td><td>21–23.5%</td><td>17–20%</td><td>₹28–₹36</td></tr><tr><td>HJT</td><td>22–24.5%</td><td>19–21%</td><td>₹35–₹45</td></tr><tr><td><a href=\"/in/solar-panels/bifacial/\">Bifacial</a> (front)</td><td>20–23%</td><td>17–20%</td><td>₹32–₹45</td></tr></tbody></table><p>The efficiency gap between poly and mono is 4–6 percentage points at STC, which translates to roughly 15–25% less energy per square foot for polycrystalline — a meaningful difference when roof space is at a premium.</p>"
    },
    {
      "heading": "How Heat Affects Solar Panel Efficiency",
      "body": "<p>Temperature is the biggest efficiency killer in Indian conditions. Every solar panel has a <strong>temperature coefficient</strong> — the percentage of output lost per degree Celsius above 25°C.</p><table><thead><tr><th>Panel Type</th><th>Temp Coefficient</th><th>Output Loss at 60°C Cell Temp</th></tr></thead><tbody><tr><td>Polycrystalline</td><td>-0.38 to -0.42%/°C</td><td>13–15%</td></tr><tr><td>Mono PERC</td><td>-0.34 to -0.38%/°C</td><td>12–13%</td></tr><tr><td>Mono TOPCon</td><td>-0.30 to -0.35%/°C</td><td>10–12%</td></tr><tr><td>HJT</td><td>-0.25 to -0.30%/°C</td><td>9–10%</td></tr></tbody></table><p>In Indian summers, rooftop panel cell temperatures routinely reach 55–65°C. A polycrystalline panel rated at 540W might produce only 460W at peak summer — while a TOPCon panel of the same rating produces 480W. Over a full year, this compounds into thousands of extra kilowatt-hours.</p><p>This is why temperature coefficient matters as much as STC efficiency when choosing panels for Indian conditions.</p>"
    },
    {
      "heading": "Factors That Reduce Efficiency in the Field",
      "body": "<p>Beyond heat, several real-world factors reduce panel output below laboratory ratings:</p><ol><li><strong>Dust and soiling (5–15% loss)</strong> — India''s dusty conditions are a major factor. Panels in arid regions (Rajasthan, Gujarat) need cleaning every 1–2 weeks. Coastal areas face salt deposits. A dirty panel can lose 15%+ of its output.</li><li><strong>Shading (10–50% loss per shaded panel)</strong> — Even partial shading from a tree branch, antenna, or water tank can dramatically reduce output. Modern half-cut cell panels handle shade better than full-cell designs.</li><li><strong>Panel orientation and tilt (5–15% loss)</strong> — Panels should face south in India with 10–15° tilt. East/west facing panels lose 10–15% output. Flat-mounted panels lose 5–8%.</li><li><strong>Inverter efficiency (3–5% loss)</strong> — The <a href=\"/in/rooftop-solar/inverter/\">solar inverter</a> loses 3–5% in DC-to-AC conversion. High-quality inverters operate at 97–98% efficiency.</li><li><strong>Wiring and connection losses (1–3%)</strong> — Resistance in cables, connectors, and junction boxes.</li><li><strong>Degradation over time (0.4–0.7%/year)</strong> — Panels slowly lose output as cells age. After 25 years, expect 80–87% of original rated power.</li></ol>"
    },
    {
      "heading": "Does Higher Efficiency Mean Better Value?",
      "body": "<p>Not always. Higher efficiency costs more per watt. The question is whether the extra cost justifies the benefit for your situation.</p><p><strong>Higher efficiency is worth it when:</strong></p><ul><li>Roof space is limited — you need maximum power from minimum area</li><li>You live in a hot region — better temperature coefficient preserves more output</li><li>Your electricity tariff is high — more energy generated = more money saved</li><li>You want maximum 25-year lifetime production</li></ul><p><strong>Higher efficiency is NOT worth it when:</strong></p><ul><li>You have ample roof space — a lower-efficiency panel at lower cost gives the same total output</li><li>Budget is the binding constraint — ₹2,000–₹5,000 extra per panel adds up</li><li>The installation is temporary or short-term</li></ul><p>For a typical Indian urban home with 200–300 sq ft of usable roof space, <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline PERC panels</a> (19–21%) offer the best efficiency-to-cost ratio. TOPCon (21–23%) is worth the 10–15% premium only for space-constrained roofs.</p>"
    },
    {
      "heading": "How to Maximise Your Panel Efficiency",
      "body": "<p>Regardless of panel type, you can optimise real-world efficiency with these practices:</p><ul><li><strong>Regular cleaning</strong> — Clean panels every 2–4 weeks with plain water. In dusty areas, more frequently. This alone can recover 5–15% of lost output.</li><li><strong>Optimal orientation</strong> — Face south with 10–15° tilt. If your roof faces east or west, consider higher-efficiency panels to compensate.</li><li><strong>Minimise shading</strong> — Trim trees, relocate antennas, and position water tanks away from the solar area. Even small shadows have outsized impact.</li><li><strong>Quality inverter</strong> — Choose an inverter with ≥97% efficiency from a reputable brand. The inverter is the weakest link in the chain.</li><li><strong>Half-cut cell panels</strong> — These handle partial shading better, preserving output when parts of the panel are shaded.</li></ul><p><a href=\"/in/tools/solar-calculator/\">Calculate your expected output with our solar calculator →</a></p>"
    },
    {
      "heading": "Get Expert Advice on Panel Selection",
      "body": "<p>Choosing the right efficiency level depends on your roof, budget, and energy goals. Solar Vipani''s verified installers assess your specific conditions and recommend the optimal panel — not the most expensive one, but the one that delivers the best return on your roof.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is a good efficiency for solar panels in India?",
      "answer": "19–22% is the sweet spot for Indian residential installations. This is the range of monocrystalline PERC and TOPCon panels that dominate the market. Below 19% (polycrystalline) requires more roof space. Above 22% (HJT) costs significantly more with diminishing returns for most homeowners."
    },
    {
      "question": "Does solar panel efficiency decrease over time?",
      "answer": "Yes. Panels degrade at 0.4–0.7% per year depending on type. Monocrystalline panels degrade slower (0.4–0.5%/year) than polycrystalline (0.5–0.7%/year). After 25 years, expect 80–87% of original rated output. This degradation is factored into the 25-year performance warranty."
    },
    {
      "question": "How does dust affect solar panel efficiency in India?",
      "answer": "Dust is a significant factor in India, reducing output by 5–15% if panels are not cleaned regularly. In arid regions like Rajasthan and Gujarat, heavy dust accumulation can cause 15–25% loss. Regular cleaning with plain water every 2–4 weeks restores most lost output."
    },
    {
      "question": "Why does efficiency drop in summer heat?",
      "answer": "Solar cells lose output as temperature rises above 25°C. In Indian summers, cell temperatures reach 55–65°C, causing 10–15% efficiency loss. The temperature coefficient determines how much — monocrystalline loses less (-0.34%/°C) than polycrystalline (-0.40%/°C). HJT panels handle heat best (-0.27%/°C)."
    },
    {
      "question": "Is a 22% efficient panel much better than a 20% panel?",
      "answer": "The 2% absolute difference means the 22% panel produces 10% more power per square foot than the 20% panel. For a space-constrained roof, this is significant — you get 10% more energy without adding panels. For roofs with extra space, you can achieve the same output with an extra 20% panel at a lower per-watt cost."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'efficiency' AND pillar_slug = 'solar-panels';


-- 2. CLUSTER: brands
UPDATE seo_pages SET
  h1 = 'Best Solar Panel Brands in India: Top 10 Compared for 2026',
  meta_title = 'Best Solar Panel Brands India 2026: Top 10 Compared by Price & Quality | Solar Vipani',
  meta_description = 'Compare India''s top solar panel brands — Waaree, Tata, Adani, Luminous, and more. Price, efficiency, warranty, and Tier 1 status explained. Data from verified installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The best solar panel brands in India for 2026 include <strong>Waaree, Tata Power Solar, Adani Solar, Vikram Solar, and Luminous</strong> among Indian manufacturers, and <strong>LONGi, Canadian Solar, JA Solar, and Jinko Solar</strong> among international brands. All are Bloomberg NEF Tier 1 rated with BIS certification. The right brand depends on your budget, local installer availability, and whether you prioritise price or premium after-sales support.</p>"
    },
    {
      "heading": "What Makes a Solar Panel Brand Tier 1?",
      "body": "<p>''Tier 1'' is a classification by Bloomberg New Energy Finance (BNEF) based on bankability — whether banks are willing to finance projects using that brand''s panels. It is <strong>not a quality rating</strong> but indicates:</p><ul><li>The manufacturer has been used in at least 6 bankable projects</li><li>Sufficient financial stability to honour 25-year warranties</li><li>Established production scale and quality control</li></ul><p>All brands listed in this guide are Tier 1 or equivalent. However, Tier 1 status does not mean every model from that brand is superior — always compare specific panel specifications, not just brand names.</p><p><strong>BIS certification (IS 14286)</strong> is mandatory for selling solar panels in India. Panels without BIS certification cannot be legally installed and do not qualify for PM Surya Ghar subsidy. Every brand listed here is BIS-certified.</p>"
    },
    {
      "heading": "Top Indian Solar Panel Brands",
      "body": "<table><thead><tr><th>Brand</th><th>Founded</th><th>Capacity</th><th>Price/W (Mono)</th><th>Key Strength</th></tr></thead><tbody><tr><td><strong>Waaree Energies</strong></td><td>2007</td><td>12 GW+</td><td>₹24–₹30</td><td>India''s largest; widest product range</td></tr><tr><td><strong>Tata Power Solar</strong></td><td>1989</td><td>4 GW+</td><td>₹27–₹33</td><td>Tata brand trust; best after-sales</td></tr><tr><td><strong>Adani Solar</strong></td><td>2015</td><td>10 GW+</td><td>₹22–₹28</td><td>Aggressive pricing; massive scale</td></tr><tr><td><strong>Vikram Solar</strong></td><td>2006</td><td>3.5 GW+</td><td>₹24–₹30</td><td>Early TOPCon adopter; R&D focus</td></tr><tr><td><strong>Luminous (Livguard)</strong></td><td>1988</td><td>2 GW+</td><td>₹24–₹30</td><td>Strongest distribution in Tier 2/3 cities</td></tr></tbody></table><p><strong>Waaree</strong> leads in market share with the widest range from budget poly to premium TOPCon bifacial. <strong>Tata Power Solar</strong> commands a premium but delivers industry-leading customer service and warranty resolution. <strong>Adani Solar</strong> offers the most competitive pricing thanks to vertical integration from polysilicon to module. <strong>Vikram Solar</strong> is the innovation leader with early investment in TOPCon cell lines. <strong>Luminous</strong> has the deepest retail distribution network, making it the go-to brand in smaller cities and towns.</p>"
    },
    {
      "heading": "Top International Brands Available in India",
      "body": "<table><thead><tr><th>Brand</th><th>Origin</th><th>Price/W (Mono)</th><th>Key Strength</th></tr></thead><tbody><tr><td><strong>LONGi Green Energy</strong></td><td>China</td><td>₹26–₹34</td><td>World''s largest mono manufacturer; best R&D</td></tr><tr><td><strong>Canadian Solar</strong></td><td>Canada/China</td><td>₹28–₹35</td><td>Proven bankability; strong in utility-scale</td></tr><tr><td><strong>JA Solar</strong></td><td>China</td><td>₹25–₹32</td><td>Excellent price-to-performance ratio</td></tr><tr><td><strong>Jinko Solar</strong></td><td>China</td><td>₹26–₹33</td><td>Global #1 in shipments; Tiger Neo TOPCon</td></tr><tr><td><strong>Trina Solar</strong></td><td>China</td><td>₹25–₹32</td><td>Vertex series with industry-leading wattage</td></tr></tbody></table><p>International brands in India face a <strong>40% Basic Customs Duty (BCD)</strong> on imported modules since April 2022. This has made them less price-competitive than domestic brands for residential projects. However, some international brands manufacture or assemble in India (LONGi, Jinko, JA Solar), which can partially offset the duty.</p><p>For residential projects, domestic brands typically offer better value and faster warranty service. International brands are more common in utility-scale and large commercial projects where bankability is critical.</p>"
    },
    {
      "heading": "Brand Comparison: Warranty Terms",
      "body": "<p>Warranty is a key differentiator — it is the manufacturer''s 25-year promise:</p><table><thead><tr><th>Brand</th><th>Product Warranty</th><th>Performance Warranty</th><th>Year 1 Output</th><th>Year 25 Output</th></tr></thead><tbody><tr><td>Waaree</td><td>12 years</td><td>25 years linear</td><td>≥97.5%</td><td>≥84.8%</td></tr><tr><td>Tata Power Solar</td><td>12 years</td><td>25 years linear</td><td>≥97%</td><td>≥84%</td></tr><tr><td>Adani Solar</td><td>12 years</td><td>25 years linear</td><td>≥97%</td><td>≥84%</td></tr><tr><td>LONGi</td><td>15 years</td><td>25 years linear</td><td>≥98%</td><td>≥86.2%</td></tr><tr><td>Canadian Solar</td><td>15 years</td><td>25 years linear</td><td>≥98%</td><td>≥84.8%</td></tr><tr><td>Jinko Solar</td><td>15 years</td><td>30 years linear</td><td>≥98%</td><td>≥87.4%</td></tr></tbody></table><p><strong>Key warranty considerations:</strong></p><ul><li>A 25-year warranty is only as good as the manufacturer''s ability to honour it. Favour financially stable companies with Indian manufacturing or service presence.</li><li>''Linear'' warranty means gradual, guaranteed output each year — better than ''step'' warranty which only guarantees at two points (year 1 and year 25).</li><li>Product warranty covers manufacturing defects. Performance warranty covers output degradation. You need both.</li></ul>"
    },
    {
      "heading": "How to Choose the Right Brand",
      "body": "<p>Follow this decision framework:</p><ol><li><strong>Set your budget tier</strong><ul><li>Budget (₹22–₹26/W): Adani Solar, JA Solar</li><li>Mid-range (₹26–₹32/W): Waaree, Vikram, Luminous, Jinko</li><li>Premium (₹30–₹36/W): Tata Power Solar, LONGi, Canadian Solar</li></ul></li><li><strong>Check local availability</strong> — The best brand is one your local installer stocks and can service. Ask installers which brands they carry and have warranty experience with.</li><li><strong>Match technology to need</strong> — Limited roof space? Choose brands with high-efficiency TOPCon offerings (Vikram, LONGi, Jinko). Ample space? A PERC panel from any Tier 1 brand will do.</li><li><strong>Prioritise warranty enforcement</strong> — Choose brands with Indian manufacturing or service centres. Filing warranty claims with a brand that has no India presence is difficult.</li></ol><p>Your installer''s recommendation matters — they know which brands perform best in your region''s climate and which ones resolve warranty issues quickly.</p>"
    },
    {
      "heading": "Our Marketplace: Compare Brands Through Quotes",
      "body": "<p>Solar Vipani''s installer network carries panels from 30+ BIS-certified brands. When you request quotes, each installer specifies the exact panel brand, model, and wattage — making apples-to-apples comparison easy.</p><ul><li>Verified installers across 500+ districts</li><li>30+ panel brands represented</li><li>Each quote details exact panel model, quantity, and per-watt price</li></ul><p><a href=\"/in/get-quotes/\">Get free quotes and compare brands →</a></p>"
    },
    {
      "heading": "Related Guides",
      "body": "<ul><li><a href=\"/in/solar-panels/price/\">Solar Panel Prices in India</a> — current market rates by type and brand</li><li><a href=\"/in/solar-panels/types/\">Types of Solar Panels</a> — mono, poly, bifacial explained</li><li><a href=\"/in/solar-panels/efficiency/\">Solar Panel Efficiency</a> — what the numbers mean</li><li><a href=\"/in/solar-panels/buying-guide/\">Solar Panel Buying Guide</a> — step-by-step purchase process</li></ul>"
    }
  ]',
  faq = '[
    {
      "question": "Which is the No. 1 solar panel brand in India?",
      "answer": "Waaree Energies is India''s largest solar panel manufacturer by capacity (12 GW+) and market share. Tata Power Solar is the most trusted brand. Adani Solar offers the most competitive pricing. The best brand depends on your priorities — there is no single ''No. 1'' across all criteria."
    },
    {
      "question": "Are Indian solar panel brands as good as international brands?",
      "answer": "Yes. Top Indian brands (Waaree, Tata, Adani, Vikram) manufacture panels using the same cell technology (PERC, TOPCon) and equipment as international brands. They are BIS-certified and Bloomberg Tier 1 rated. Indian brands often offer better local warranty support and are not subject to the 40% import duty."
    },
    {
      "question": "What does Tier 1 solar panel brand mean?",
      "answer": "Tier 1 is a Bloomberg New Energy Finance classification indicating bankability — banks are willing to finance projects using those panels. It reflects financial stability and manufacturing scale, not product quality. All mainstream brands listed here are Tier 1, but always compare specific panel specifications rather than relying on tier status alone."
    },
    {
      "question": "Which brand offers the best warranty on solar panels?",
      "answer": "LONGi and Jinko Solar lead with 15-year product warranties. Most Indian brands offer 12-year product warranties. All major brands offer 25-year linear performance warranties guaranteeing ≥84% output. Jinko now offers a 30-year performance warranty on select TOPCon models. However, warranty enforcement depends on the brand''s local service presence."
    },
    {
      "question": "Should I buy the cheapest Tier 1 solar panel?",
      "answer": "Not necessarily. While all Tier 1 panels meet quality thresholds, factors like temperature coefficient, degradation rate, and local warranty support matter. The cheapest panel may cost you more over 25 years if it degrades faster or the manufacturer lacks Indian service infrastructure. Compare total cost of ownership, not just upfront price."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'brands' AND pillar_slug = 'solar-panels';


-- 3. CLUSTER: monocrystalline-vs-polycrystalline
UPDATE seo_pages SET
  h1 = 'Monocrystalline vs Polycrystalline Solar Panels: Which Is Better for India?',
  meta_title = 'Mono vs Poly Solar Panels India: Efficiency, Price & Heat Performance | Solar Vipani',
  meta_description = 'Monocrystalline vs polycrystalline solar panels compared — efficiency, price, heat tolerance, roof space, and which is better for Indian homes. Data-backed guide.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p><strong><a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline</a> is better for most Indian homes.</strong> It offers 19–23% efficiency (vs 15–18% for poly), handles heat better, and produces 15–25% more power per square foot. The price gap has narrowed to just 20–25%, making mono the default choice. <a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a> still makes sense for large commercial roofs where space is unlimited and budget is tight.</p>"
    },
    {
      "heading": "Technology Difference",
      "body": "<p>The fundamental difference is crystal structure:</p><p><strong>Monocrystalline:</strong> Made from a single continuous silicon crystal grown via the Czochralski process. The uniform crystal lattice allows electrons to flow freely, resulting in higher efficiency. Recognisable by its black, uniform appearance.</p><p><strong>Polycrystalline:</strong> Made by melting silicon and casting it into moulds where it solidifies into multiple crystals. The boundaries between crystals (grain boundaries) impede electron flow, resulting in lower efficiency. Recognisable by its blue, speckled appearance.</p><p>This structural difference is permanent and fundamental — no manufacturing improvement can make polycrystalline match monocrystalline efficiency. The physics of single-crystal vs multi-crystal electron transport sets an inherent ceiling on poly performance.</p>"
    },
    {
      "heading": "Efficiency Comparison",
      "body": "<table><thead><tr><th>Metric</th><th>Monocrystalline</th><th>Polycrystalline</th><th>Advantage</th></tr></thead><tbody><tr><td>STC efficiency</td><td>19–23%</td><td>15–18%</td><td>Mono by 4–6 pts</td></tr><tr><td>Real-world efficiency (India)</td><td>16–20%</td><td>12–15%</td><td>Mono by 4–5 pts</td></tr><tr><td>Annual output per panel (540W)</td><td>850–950 kWh</td><td>750–850 kWh</td><td>Mono by 12–15%</td></tr><tr><td>Degradation rate</td><td>0.4–0.5%/year</td><td>0.5–0.7%/year</td><td>Mono (slower decline)</td></tr><tr><td>25-year output</td><td>84–88% of rated</td><td>80–84% of rated</td><td>Mono by 4–5%</td></tr></tbody></table><p>The efficiency advantage compounds over 25 years. A monocrystalline panel that starts 15% ahead in output also degrades slower — by year 25, the cumulative energy difference is 20–25%.</p><p><a href=\"/in/solar-panels/efficiency/\">Full efficiency guide →</a></p>"
    },
    {
      "heading": "Price Comparison",
      "body": "<table><thead><tr><th>Metric</th><th>Monocrystalline</th><th>Polycrystalline</th><th>Difference</th></tr></thead><tbody><tr><td>Price per watt</td><td>₹24–₹32</td><td>₹18–₹24</td><td>Mono costs 20–30% more</td></tr><tr><td>540W panel price</td><td>₹13,000–₹17,300</td><td>₹9,700–₹13,000</td><td>₹3,300–₹4,300 extra</td></tr><tr><td>3kW system (panels only)</td><td>₹78,000–₹1,04,000</td><td>₹58,000–₹78,000</td><td>₹20,000–₹26,000 extra</td></tr><tr><td>Extra panels needed (3kW)</td><td>6 panels</td><td>7–8 panels</td><td>Poly needs 1–2 more</td></tr><tr><td>Extra mounting/wiring cost</td><td>—</td><td>+₹5,000–₹10,000</td><td>Poly has hidden costs</td></tr></tbody></table><p><strong>True cost gap:</strong> After accounting for extra panels, mounting, and wiring, the real-world cost difference is ₹10,000–₹18,000 for a 3kW system — smaller than the per-watt gap suggests.</p><p>Over 25 years, the extra energy from monocrystalline panels (15–25% more per sq ft × higher tariff savings) recovers this premium in the first 1–2 years.</p><p><a href=\"/in/solar-panels/price/\">Detailed pricing →</a></p>"
    },
    {
      "heading": "Performance in Indian Heat",
      "body": "<p>India''s hot climate makes temperature performance a critical comparison factor.</p><table><thead><tr><th>Metric</th><th>Monocrystalline</th><th>Polycrystalline</th></tr></thead><tbody><tr><td>Temperature coefficient</td><td>-0.30 to -0.38%/°C</td><td>-0.38 to -0.42%/°C</td></tr><tr><td>Output at 45°C ambient</td><td>~88% of rated</td><td>~85% of rated</td></tr><tr><td>Output at 48°C ambient</td><td>~86% of rated</td><td>~82% of rated</td></tr></tbody></table><p>In practical terms, during Indian peak summer (April–June), monocrystalline panels produce <strong>3–5% more output</strong> than polycrystalline panels of the same wattage rating simply because they handle heat better.</p><p>This advantage is most significant in Rajasthan, Gujarat, Maharashtra, Madhya Pradesh, and Telangana — states where summer temperatures regularly exceed 42°C. In hill stations and cooler northern regions, the heat advantage is less relevant.</p>"
    },
    {
      "heading": "Roof Space Requirement",
      "body": "<p>For urban Indian homes, roof space is often the deciding factor:</p><table><thead><tr><th>System Size</th><th>Mono (roof area)</th><th>Poly (roof area)</th><th>Extra Space for Poly</th></tr></thead><tbody><tr><td>1kW</td><td>~65 sq ft</td><td>~90 sq ft</td><td>+38%</td></tr><tr><td>2kW</td><td>~130 sq ft</td><td>~180 sq ft</td><td>+38%</td></tr><tr><td>3kW</td><td>~200 sq ft</td><td>~280 sq ft</td><td>+40%</td></tr><tr><td>5kW</td><td>~330 sq ft</td><td>~460 sq ft</td><td>+39%</td></tr><tr><td>10kW</td><td>~660 sq ft</td><td>~920 sq ft</td><td>+39%</td></tr></tbody></table><p>A 3kW polycrystalline system needs <strong>80 sq ft more</strong> than monocrystalline — that is the size of a small room. In apartments and row houses, this extra space simply may not exist on the rooftop.</p>"
    },
    {
      "heading": "Aesthetics and Appearance",
      "body": "<p><strong>Monocrystalline:</strong> Uniform black appearance with a sleek, modern look. The cells are octagonal (or full-square in newer designs), creating a premium aesthetic. All-black panels with black frames are available for the most visually cohesive installation.</p><p><strong>Polycrystalline:</strong> Blue, speckled appearance with visible grain boundaries. While functional, the look is less refined and more noticeable on a rooftop.</p><p>Aesthetics rarely drive the purchase decision in India, but for homes in upscale neighbourhoods or where the roof is visible from the street, the sleek black look of mono panels is preferred.</p>"
    },
    {
      "heading": "The Verdict: Which Should You Choose?",
      "body": "<p><strong>Choose monocrystalline if:</strong></p><ul><li>Your roof space is limited (most urban Indian homes)</li><li>You live in a hot region (most of India)</li><li>You want maximum output and lowest degradation over 25 years</li><li>Budget allows ₹10,000–₹18,000 extra for a 3kW system</li></ul><p><strong>Choose polycrystalline if:</strong></p><ul><li>You have a large roof with 40%+ more space than needed</li><li>Budget is the absolute top priority</li><li>You are in a cooler region (hill stations, extreme north)</li><li>The installation is for a large commercial or agricultural structure</li></ul><p><strong>Our recommendation:</strong> For 80%+ of Indian homeowners, monocrystalline is the better choice. The narrowing price gap and widening efficiency advantage make it the default. Your installer will likely recommend mono unless your specific situation favours poly.</p><p><a href=\"/in/get-quotes/\">Get quotes and see which panel your installer recommends →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is monocrystalline better than polycrystalline for Indian homes?",
      "answer": "Yes, for most Indian homes. Monocrystalline offers 19–23% efficiency vs 15–18% for poly, needs 30–40% less roof space, and handles India''s heat better. The 20–25% price premium is recovered within 1–2 years through higher energy generation. Over 80% of new Indian residential installations now use monocrystalline."
    },
    {
      "question": "How much more expensive is monocrystalline vs polycrystalline?",
      "answer": "Monocrystalline costs 20–30% more per watt (₹24–₹32/W vs ₹18–₹24/W). For a 3kW system, this translates to ₹20,000–₹26,000 extra on panels. However, after accounting for fewer panels needed and reduced mounting costs, the real gap narrows to ₹10,000–₹18,000."
    },
    {
      "question": "Do monocrystalline panels last longer than polycrystalline?",
      "answer": "Both types carry 25-year performance warranties and last 25–30 years physically. However, monocrystalline panels degrade slower (0.4–0.5%/year vs 0.5–0.7%/year for poly). By year 25, a mono panel retains 84–88% of rated output compared to 80–84% for poly — a meaningful difference in cumulative energy production."
    },
    {
      "question": "Which type performs better in hot weather?",
      "answer": "Monocrystalline. Its temperature coefficient (-0.30 to -0.38%/°C) is better than polycrystalline (-0.38 to -0.42%/°C). In Indian summer conditions with cell temperatures of 55–65°C, mono panels lose 10–13% of rated output while poly panels lose 13–17%. This 3–5% advantage compounds over the system lifetime."
    },
    {
      "question": "Can I mix monocrystalline and polycrystalline panels?",
      "answer": "Technically possible but not recommended. Mixing panel types with different electrical characteristics (voltage, current) in the same string reduces overall system efficiency. If you must use both, configure them on separate strings with appropriate inverter inputs. Most installers advise using a single panel type for optimal performance."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'monocrystalline-vs-polycrystalline' AND pillar_slug = 'solar-panels';


-- 4. CLUSTER: buying-guide
UPDATE seo_pages SET
  h1 = 'Solar Panel Buying Guide for India: How to Choose the Right Panel',
  meta_title = 'Solar Panel Buying Guide India 2026: 6-Step Selection Process | Solar Vipani',
  meta_description = 'Step-by-step guide to buying solar panels in India. Panel type, wattage, certifications, warranty, brands, and red flags to avoid. Based on data from 500+ installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>To choose the right solar panel: <strong>(1)</strong> calculate your energy needs from electricity bills, <strong>(2)</strong> choose <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline</a> for limited roof space or polycrystalline for budget priority, <strong>(3)</strong> pick 530W+ panels from a BIS-certified <a href=\"/in/solar-panels/brands/\">Tier 1 brand</a>, <strong>(4)</strong> confirm 25-year performance warranty, and <strong>(5)</strong> compare 2–3 installer quotes. Most Indian homeowners need a 3kW system with 6 monocrystalline panels.</p>"
    },
    {
      "heading": "Step 1: Calculate Your Energy Needs",
      "body": "<p>Your electricity bill tells you exactly what system size you need. Gather your last 6–12 months of bills and find your average monthly consumption in kWh (units).</p><p><strong>Quick sizing formula:</strong></p><p><em>System size (kW) = Average monthly units ÷ 120</em></p><table><thead><tr><th>Monthly Bill (units)</th><th>System Size</th><th>Panels (540W)</th><th>Home Type</th></tr></thead><tbody><tr><td>100–200</td><td>1–2 kW</td><td>2–4</td><td>1 BHK, low usage</td></tr><tr><td>200–400</td><td>2–3 kW</td><td>4–6</td><td>2–3 BHK, moderate usage</td></tr><tr><td>400–600</td><td>3–5 kW</td><td>6–10</td><td>3 BHK with AC</td></tr><tr><td>600–1000</td><td>5–8 kW</td><td>10–15</td><td>Large home, multiple ACs</td></tr><tr><td>1000+</td><td>8–10 kW</td><td>15–19</td><td>Villa, high-usage home</td></tr></tbody></table><p><strong>Important:</strong> You do not need to offset 100% of your bill. Aim for 80–90% offset — this avoids over-sizing (excess generation carries forward as credits but earns lower rates in some states).</p><p><a href=\"/in/tools/solar-calculator/\">Use our calculator for precise sizing →</a></p>"
    },
    {
      "heading": "Step 2: Choose the Panel Type",
      "body": "<p>Three options, one clear winner for most homes:</p><ol><li><strong><a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline</a> — recommended for most Indian homes</strong><ul><li>19–23% efficiency, needs ~200 sq ft for 3kW</li><li>Best heat performance — crucial for Indian climate</li><li>₹24–₹36/W (PERC to TOPCon)</li></ul></li><li><strong><a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a> — budget option for large roofs</strong><ul><li>15–18% efficiency, needs ~280 sq ft for 3kW</li><li>₹18–₹24/W — cheapest option</li><li>Choose only if you have ample roof space and tight budget</li></ul></li><li><strong><a href=\"/in/solar-panels/bifacial/\">Bifacial</a> — premium for commercial/elevated installs</strong><ul><li>10–25% extra output from rear side</li><li>₹32–₹45/W — worth it only with elevated mounting</li><li>Skip for residential flush-mount installations</li></ul></li></ol><p>If unsure, go with monocrystalline PERC — it is the industry standard for a reason.</p><p><a href=\"/in/solar-panels/monocrystalline-vs-polycrystalline/\">Mono vs Poly comparison →</a></p>"
    },
    {
      "heading": "Step 3: Check Wattage and Efficiency",
      "body": "<p><strong>Wattage:</strong> Choose 530W+ panels for new installations. Higher-wattage panels reduce the number of panels, mounting hardware, and wiring — saving installation costs. Avoid outdated 250–330W panels; they are less cost-effective per watt of output.</p><p><strong>Efficiency:</strong> For most homes, 19–21% (mono PERC) is the sweet spot. Pay for 22%+ (TOPCon/HJT) only if your roof space is tight. <a href=\"/in/solar-panels/efficiency/\">Efficiency guide →</a></p><p><strong>What to check on the datasheet:</strong></p><ul><li><strong>STC power rating</strong> — e.g., 540Wp (watts peak)</li><li><strong>Module efficiency</strong> — e.g., 21.1%</li><li><strong>Temperature coefficient (Pmax)</strong> — lower is better (e.g., -0.35%/°C)</li><li><strong>Maximum system voltage</strong> — 1000V or 1500V (must match your inverter)</li><li><strong>Dimensions and weight</strong> — confirm they fit your roof and structure can handle the load</li></ul>"
    },
    {
      "heading": "Step 4: Verify Certifications",
      "body": "<p>Non-negotiable certifications for solar panels in India:</p><ul><li><strong>BIS certification (IS 14286)</strong> — Mandatory for all panels sold in India. Without BIS, the panel cannot be legally installed and does not qualify for PM Surya Ghar subsidy. Check the BIS logo and certificate number on the panel nameplate.</li><li><strong>IEC 61215</strong> — International standard for design qualification and type approval. Tests panels for mechanical load, thermal cycling, humidity, and UV exposure.</li><li><strong>IEC 61730</strong> — Safety qualification standard. Tests for electrical insulation, fire resistance, and mechanical safety.</li></ul><p><strong>Red flag:</strong> Any panel offered without BIS certification should be immediately rejected — regardless of price. Uncertified panels cannot get net metering approval, subsidy disbursement, or insurance coverage.</p>"
    },
    {
      "heading": "Step 5: Compare Brands and Warranty",
      "body": "<p><strong>Brand selection:</strong> Choose from BIS-certified, Bloomberg Tier 1 brands. For residential projects in India, domestic brands (Waaree, Tata, Adani, Vikram, Luminous) typically offer better value and warranty service than imports.</p><p><strong>Warranty checklist:</strong></p><ul><li><strong>Product warranty ≥ 12 years</strong> — covers manufacturing defects, delamination, junction box failures</li><li><strong>Performance warranty ≥ 25 years</strong> — must be ''linear'' (guaranteed output each year, not just at year 1 and year 25)</li><li><strong>Year 1 output guarantee ≥ 97%</strong></li><li><strong>Year 25 output guarantee ≥ 84%</strong></li></ul><p><strong>Warranty enforcement tip:</strong> Ask your installer which brands they have successfully processed warranty claims with. A 25-year warranty from a manufacturer with no Indian service centre is worth less than a 12-year warranty from a brand with local presence.</p><p><a href=\"/in/solar-panels/brands/\">Full brand comparison →</a></p>"
    },
    {
      "heading": "Step 6: Get and Compare Installer Quotes",
      "body": "<p>Never buy panels directly without an installer quote. The installation is as important as the panel itself. Here is how to compare quotes:</p><ol><li><strong>Get 2–3 quotes</strong> from different verified installers for the same system size</li><li><strong>Compare apples to apples</strong> — ensure all quotes include panels, inverter, mounting, wiring, installation, net metering, and GST</li><li><strong>Calculate cost per watt</strong> — Total quote ÷ system watts. Competitive range for 3kW: ₹50–₹65/W (total installed, before subsidy)</li><li><strong>Check the panel brand and model</strong> — the cheapest quote may use inferior panels</li><li><strong>Ask about post-installation support</strong> — commissioning, DISCOM liaison, maintenance</li></ol><p>Solar Vipani makes this easy — fill one form and get 2–3 quotes from verified local installers, each specifying exact panel brand and model.</p><p><a href=\"/in/get-quotes/\">Get your free quotes →</a></p>"
    },
    {
      "heading": "Red Flags to Avoid",
      "body": "<p>Watch out for these warning signs when buying solar panels:</p><ul><li><strong>No BIS certification</strong> — Illegal to install, no subsidy, no insurance</li><li><strong>Prices significantly below market</strong> — Likely B-grade cells, short warranty, or counterfeit panels</li><li><strong>Vague warranty terms</strong> — ''25-year warranty'' without specifying product vs performance, linear vs step</li><li><strong>Unknown brand with no Indian presence</strong> — Warranty enforcement becomes impossible</li><li><strong>Pressure to decide immediately</strong> — ''Limited time offer'' or ''prices going up tomorrow'' are sales tactics</li><li><strong>Cash-only payment with no GST invoice</strong> — No legal recourse, no subsidy eligibility</li><li><strong>No site visit before quoting</strong> — A legitimate installer must assess your roof before providing an accurate quote</li></ul>"
    },
    {
      "heading": "Get Started: Free Quotes from Verified Installers",
      "body": "<p>You have the knowledge to make an informed decision. Now get quotes specific to your roof, location, and energy needs.</p><p>Solar Vipani connects you with 2–3 verified, MNRE-registered installers in your city. Each quote specifies exact panel brand, model, wattage, and total installed price — making comparison straightforward.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How do I choose the right solar panel for my home?",
      "answer": "Calculate your energy needs from electricity bills (monthly units ÷ 120 = kW needed). Choose monocrystalline panels for most homes (best efficiency per sq ft in Indian heat). Pick 530W+ panels from a BIS-certified Tier 1 brand with 25-year warranty. Get 2–3 installer quotes to compare pricing."
    },
    {
      "question": "What certifications should I look for when buying solar panels?",
      "answer": "BIS certification (IS 14286) is mandatory in India — without it, panels cannot be legally installed or qualify for subsidy. Also check for IEC 61215 (design qualification) and IEC 61730 (safety). Never buy panels without BIS certification regardless of price."
    },
    {
      "question": "How many solar panels does a typical Indian home need?",
      "answer": "A typical 2–3 BHK home consuming 300–400 units per month needs a 3kW system — that is 6 panels of 540W each, requiring about 200 sq ft of unshaded roof space. Homes with heavy AC usage may need 5kW (10 panels). Use the formula: monthly units ÷ 120 = system size in kW."
    },
    {
      "question": "Should I buy solar panels online or through an installer?",
      "answer": "Always buy through a verified installer, not directly online. The installer handles proper mounting, wiring, inverter matching, DISCOM paperwork for net metering, and subsidy application. A panel without proper installation and grid connection is useless. Plus, installer-sourced panels come with installation warranty on top of manufacturer warranty."
    },
    {
      "question": "What is a fair price for a complete solar system in India?",
      "answer": "For a 3kW on-grid system with monocrystalline panels: ₹1,50,000–₹2,00,000 total installed (before subsidy), or ₹50–₹65 per watt. After PM Surya Ghar subsidy of ₹78,000, expect ₹72,000–₹1,22,000 out of pocket. Beware of quotes significantly below ₹45/W — they may use inferior components."
    },
    {
      "question": "Can I add more solar panels later?",
      "answer": "Yes, but with caveats. Your inverter must have capacity for additional panels. Adding panels of a different brand or wattage to existing strings reduces efficiency — matching panels is ideal. Net metering approval may need amendment for the higher capacity. It is more cost-effective to size correctly upfront."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'buying-guide' AND pillar_slug = 'solar-panels';

COMMIT;
