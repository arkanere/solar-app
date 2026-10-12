-- Solar Panels Content: pillar + price + types cluster pages
-- Run: psql $POSTGRES_URL < 007-solar-panels-content.sql

BEGIN;

-- 1. PILLAR: solar-panels
UPDATE seo_pages SET
  h1 = 'Solar Panels in India: Types, Prices & Buying Guide',
  meta_title = 'Solar Panels India: Types, Prices & Best Brands 2026 | Solar Vipani',
  meta_description = 'Compare solar panel types, prices and top brands in India. Monocrystalline, polycrystalline, bifacial — data from verified installers across 500+ cities. Get free quotes.',
  content = '[
    {
      "heading": "Choosing the Right Solar Panel for Your Home",
      "body": "<p>India is the world''s fourth-largest solar market, and solar panel technology has evolved rapidly — prices have dropped 90% in a decade while efficiency has climbed past 22%. Yet choosing the right panel remains the single most important decision in your solar journey. The panel you pick determines how much power your system generates per square foot of roof, how long it lasts, and what you pay upfront. Solar Vipani connects you with verified installers across 500+ cities who carry panels from every major brand, so you can compare options and get the best deal.</p>"
    },
    {
      "heading": "What Are Solar Panels?",
      "body": "<p>A solar panel (also called a solar module) is a flat assembly of photovoltaic (PV) cells that converts sunlight directly into electricity. Each cell is made from semiconductor material — almost always silicon — that generates a small voltage when photons from sunlight knock electrons loose.</p><p>A typical residential panel today contains 120–144 half-cut monocrystalline cells, produces 530–560 watts, and measures roughly 2.3m × 1.1m. Panels are connected in series to form a string, and one or more strings feed into a <a href=\"/in/rooftop-solar/inverter/\">solar inverter</a> that converts DC output to 230V AC for your home.</p><p>Panels carry two warranties: a product warranty (10–15 years against defects) and a performance warranty (25 years guaranteeing ≥80% output). The actual lifespan often exceeds 30 years.</p>"
    },
    {
      "heading": "Solar Panel Price in India",
      "body": "<p>Solar panel prices in India range from <strong>₹18–₹45 per watt</strong> depending on type, brand, and technology. For a 3kW system (6 panels at 540W each), panels alone cost ₹58,000–₹1,35,000 — roughly 40–50% of the total system cost.</p><table><thead><tr><th>Panel Type</th><th>Price per Watt</th><th>6-Panel Cost (3kW)</th></tr></thead><tbody><tr><td>Polycrystalline</td><td>₹18–₹24/W</td><td>₹58,000–₹78,000</td></tr><tr><td>Monocrystalline</td><td>₹24–₹32/W</td><td>₹78,000–₹1,04,000</td></tr><tr><td>Mono PERC / TOPCon</td><td>₹28–₹36/W</td><td>₹91,000–₹1,17,000</td></tr><tr><td>Bifacial</td><td>₹32–₹45/W</td><td>₹1,04,000–₹1,35,000</td></tr></tbody></table><p>Prices have been declining steadily — monocrystalline panels cost 30% less in 2026 than in 2023. Most installers on our platform include panels, inverter, mounting, and installation in a single bundled quote.</p><p>→ <a href=\"/in/solar-panels/price/\">Full guide: Solar Panel Price in India — Detailed Breakdown</a></p>"
    },
    {
      "heading": "Types of Solar Panels",
      "body": "<p>Solar panels sold in India fall into three main categories based on the silicon cell technology used:</p><ul><li><strong><a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline</a></strong> — Single-crystal silicon cells with 19–23% efficiency. Black appearance. Now the dominant technology for residential systems (80%+ market share).</li><li><strong><a href=\"/in/solar-panels/polycrystalline/\">Polycrystalline</a></strong> — Multi-crystal silicon cells with 15–18% efficiency. Blue appearance. Lower cost per watt but requires more roof space for the same output.</li><li><strong><a href=\"/in/solar-panels/bifacial/\">Bifacial</a></strong> — Panels that absorb light from both sides, generating 10–25% more energy in optimal mounting conditions. Premium option for elevated installations.</li></ul><p>Within monocrystalline, newer sub-technologies include PERC (Passivated Emitter Rear Cell), TOPCon (Tunnel Oxide Passivated Contact), and HJT (Heterojunction) — each pushing efficiency higher.</p><p>→ <a href=\"/in/solar-panels/types/\">Full guide: Types of Solar Panels — Complete Comparison</a></p>"
    },
    {
      "heading": "Monocrystalline vs Polycrystalline",
      "body": "<p>This is the most common comparison Indian homeowners face. Here is the summary:</p><table><thead><tr><th>Feature</th><th>Monocrystalline</th><th>Polycrystalline</th></tr></thead><tbody><tr><td>Efficiency</td><td>19–23%</td><td>15–18%</td></tr><tr><td>Price per watt</td><td>₹24–₹32</td><td>₹18–₹24</td></tr><tr><td>Roof space (3kW)</td><td>~200 sq ft</td><td>~280 sq ft</td></tr><tr><td>Heat performance</td><td>Better (lower temp coefficient)</td><td>Slightly worse</td></tr><tr><td>Appearance</td><td>Black, uniform</td><td>Blue, speckled</td></tr><tr><td>Lifespan</td><td>25–30 years</td><td>25–30 years</td></tr></tbody></table><p>For most Indian homes — especially those with limited roof space — <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline panels</a> offer better value despite the higher per-watt cost, because you get more power from less area.</p><p>→ <a href=\"/in/solar-panels/monocrystalline-vs-polycrystalline/\">Full comparison: Mono vs Poly Solar Panels</a></p>"
    },
    {
      "heading": "Solar Panel Efficiency Explained",
      "body": "<p>Efficiency measures what percentage of sunlight hitting the panel gets converted into electricity. A 21% efficient panel converts 21% of solar energy into usable power — the rest becomes heat.</p><p>For Indian homeowners, efficiency matters most when roof space is limited. A 22% efficient panel produces the same power as a 16% efficient panel but in 30% less area. However, if you have ample roof space, a lower-efficiency panel at a lower price can deliver the same total output for less money.</p><p>Temperature also affects efficiency — panels lose 0.3–0.5% output per degree Celsius above 25°C. In Indian summers (cell temperatures of 55–65°C), this means 10–15% output reduction. Monocrystalline panels handle heat better than polycrystalline.</p><p>→ <a href=\"/in/solar-panels/efficiency/\">Full guide: Solar Panel Efficiency — What Actually Matters</a></p>"
    },
    {
      "heading": "Get a Personalised Quote",
      "body": "<p>Panel specs matter, but the right panel for your home depends on your roof area, shading, budget, and energy needs. Solar Vipani connects you with 2–3 verified installers in your city who will recommend the best panel for your specific situation.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes →</a></p>"
    },
    {
      "heading": "Top Solar Panel Brands in India",
      "body": "<p>India has both domestic manufacturers and international brands competing for market share. The top brands by market presence on our platform:</p><ul><li><strong>Waaree Energies</strong> — India''s largest panel manufacturer. Wide range from 330W poly to 550W+ mono bifacial.</li><li><strong>Tata Power Solar</strong> — Trusted Tata brand with strong residential focus and nationwide service network.</li><li><strong>Adani Solar</strong> — Aggressive pricing, large-scale manufacturing. Popular in budget-conscious segments.</li><li><strong>Luminous (Livguard)</strong> — Strong distribution network, popular in Tier 2/3 cities.</li><li><strong>Canadian Solar / JA Solar / LONGi</strong> — International Tier 1 brands with high-efficiency offerings.</li></ul><p>All Tier 1 brands carry BIS certification and 25-year performance warranties. The choice often comes down to local installer preference and pricing.</p><p>→ <a href=\"/in/solar-panels/brands/\">Full guide: Best Solar Panel Brands in India</a></p>"
    },
    {
      "heading": "Solar Panel Buying Guide",
      "body": "<p>Buying solar panels involves more than picking a brand. A systematic approach saves you money and avoids common mistakes:</p><ol><li><strong>Calculate your energy needs</strong> — Check your last 6 months'' electricity bills to determine average daily consumption in kWh.</li><li><strong>Choose the panel type</strong> — Monocrystalline for limited roof space, polycrystalline for budget priority, bifacial for elevated installations.</li><li><strong>Compare wattage and efficiency</strong> — Higher wattage panels (540W+) mean fewer panels and simpler wiring.</li><li><strong>Check certifications</strong> — BIS certification (IS 14286) is mandatory in India. IEC 61215/61730 for international standards.</li><li><strong>Understand the warranty</strong> — Insist on both product warranty (≥12 years) and performance warranty (≥25 years, ≥80% at end).</li><li><strong>Get multiple quotes</strong> — Compare 2–3 installer quotes to understand fair pricing for your area.</li></ol><p>→ <a href=\"/in/solar-panels/buying-guide/\">Full guide: Solar Panel Buying Guide for Indian Homeowners</a></p>"
    },
    {
      "heading": "Our Installer Network",
      "body": "<p>Solar Vipani maintains a verified network of solar installers across India. Every installer is vetted for licensing, insurance, and installation quality.</p><ul><li>Verified installers across 500+ districts</li><li>Panels from 30+ BIS-certified brands</li><li>Coverage in 28 states and 8 union territories</li><li>All installers carry valid MNRE channel partner certification</li></ul><p>Fill one form and receive 2–3 competitive quotes from installers in your city — free, with no obligation.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a solar panel in India?",
      "answer": "Solar panel prices in India range from ₹18–₹45 per watt depending on type and brand. A standard 540W monocrystalline panel costs ₹13,000–₹19,000. For a complete 3kW system (6 panels), the panel cost is ₹78,000–₹1,17,000 — roughly 40–50% of total system cost including inverter and installation."
    },
    {
      "question": "Which type of solar panel is best for home use in India?",
      "answer": "Monocrystalline panels are the best choice for most Indian homes. They offer 19–23% efficiency, perform better in high temperatures, and produce more power per square foot than polycrystalline panels. While they cost 20–30% more per watt, the space savings and higher output make them more cost-effective over 25 years."
    },
    {
      "question": "How long do solar panels last?",
      "answer": "Quality solar panels last 25–30 years. Manufacturers provide a 25-year performance warranty guaranteeing at least 80% output at end of life. The product warranty (against defects) is typically 10–15 years. With proper maintenance — occasional cleaning — panels continue generating power well beyond their warranty period."
    },
    {
      "question": "Is monocrystalline or polycrystalline better?",
      "answer": "Monocrystalline is better for most Indian installations. It offers higher efficiency (19–23% vs 15–18%), needs less roof space, and handles heat better. Polycrystalline costs less per watt but requires 30–40% more roof area for the same output. Choose poly only if you have ample roof space and a tight budget."
    },
    {
      "question": "What size solar panel do I need for my home?",
      "answer": "System size depends on your electricity consumption. Check your monthly bill: divide average monthly units by 120 to get the kW size needed. A 2–3 BHK home using 300–400 units/month needs a 3kW system (6 panels of 540W each). Large homes using 600+ units need a 5kW system (10 panels)."
    },
    {
      "question": "Do solar panels require maintenance?",
      "answer": "Minimal maintenance is needed. Clean panels with water every 2–4 weeks to remove dust, bird droppings, and pollen. Avoid abrasive cleaners. Check for shading from new tree growth annually. No moving parts means almost nothing can break. Most issues are with inverters, not panels."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'solar-panels' AND page_type = 'pillar';


-- 2. CLUSTER: price
UPDATE seo_pages SET
  h1 = 'Solar Panel Price in India in 2026: Real Prices by Type & Brand',
  meta_title = 'Solar Panel Price India 2026: ₹18–₹45/W by Type & Brand | Solar Vipani',
  meta_description = 'Solar panel prices in India range from ₹18–₹45 per watt. Compare prices by type (mono, poly, bifacial), wattage, and brand. Based on data from verified installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar panels in India cost <strong>₹18–₹45 per watt</strong> depending on type, brand, and technology. A standard 540W monocrystalline panel costs <strong>₹13,000–₹19,000</strong>. For a complete 3kW residential system, panels alone account for ₹78,000–₹1,17,000 — roughly 40–50% of the total installed cost. Prices have dropped 25–30% over the past three years and continue to trend downward as manufacturing scales up.</p>"
    },
    {
      "heading": "Solar Panel Price by Type",
      "body": "<p>Panel technology is the biggest price driver. Here are current market prices from our installer network:</p><table><thead><tr><th>Panel Type</th><th>Price per Watt</th><th>540W Panel Price</th><th>3kW System (panels only)</th></tr></thead><tbody><tr><td>Polycrystalline</td><td>₹18–₹24/W</td><td>₹9,700–₹13,000</td><td>₹58,000–₹78,000</td></tr><tr><td>Monocrystalline (PERC)</td><td>₹24–₹32/W</td><td>₹13,000–₹17,300</td><td>₹78,000–₹1,04,000</td></tr><tr><td>Mono TOPCon</td><td>₹28–₹36/W</td><td>₹15,100–₹19,400</td><td>₹91,000–₹1,17,000</td></tr><tr><td>Bifacial (Mono PERC)</td><td>₹32–₹42/W</td><td>₹17,300–₹22,700</td><td>₹1,04,000–₹1,36,000</td></tr><tr><td>Bifacial (TOPCon)</td><td>₹35–₹45/W</td><td>₹18,900–₹24,300</td><td>₹1,14,000–₹1,46,000</td></tr></tbody></table><p><em>Prices based on quotes from verified installers. Actual prices vary by location and order volume.</em></p><p><a href=\"/in/solar-panels/monocrystalline/\">Monocrystalline panels</a> now dominate 80%+ of residential installations because their price premium over <a href=\"/in/solar-panels/polycrystalline/\">polycrystalline</a> has narrowed while efficiency advantage has widened.</p>"
    },
    {
      "heading": "Solar Panel Price by Wattage",
      "body": "<p>Higher-wattage panels cost more per unit but less per watt — and reduce installation costs by needing fewer panels, less wiring, and less mounting hardware.</p><table><thead><tr><th>Panel Wattage</th><th>Price Range</th><th>Panels for 3kW</th><th>Best For</th></tr></thead><tbody><tr><td>330–370W</td><td>₹7,000–₹10,000</td><td>8–9 panels</td><td>Budget systems, large roofs</td></tr><tr><td>400–450W</td><td>₹10,000–₹14,000</td><td>7 panels</td><td>Mid-range residential</td></tr><tr><td>530–550W</td><td>₹13,000–₹19,000</td><td>6 panels</td><td>Space-efficient, modern systems</td></tr><tr><td>580–600W</td><td>₹17,000–₹24,000</td><td>5 panels</td><td>Premium, limited roof space</td></tr></tbody></table><p>The industry standard for new residential installations in 2026 is 530–550W panels. Older 330W panels are still available but less cost-effective when you factor in installation labour and mounting costs per panel.</p>"
    },
    {
      "heading": "Solar Panel Price by Brand",
      "body": "<p>Brand pricing varies based on manufacturing scale, technology, and market positioning:</p><table><thead><tr><th>Brand</th><th>Origin</th><th>Price/Watt (Mono)</th><th>Tier</th></tr></thead><tbody><tr><td>Waaree</td><td>India</td><td>₹24–₹30</td><td>Tier 1</td></tr><tr><td>Tata Power Solar</td><td>India</td><td>₹27–₹33</td><td>Tier 1</td></tr><tr><td>Adani Solar</td><td>India</td><td>₹22–₹28</td><td>Tier 1</td></tr><tr><td>Luminous</td><td>India</td><td>₹24–₹30</td><td>Tier 1</td></tr><tr><td>Vikram Solar</td><td>India</td><td>₹24–₹30</td><td>Tier 1</td></tr><tr><td>Canadian Solar</td><td>Canada/China</td><td>₹28–₹35</td><td>Global Tier 1</td></tr><tr><td>JA Solar</td><td>China</td><td>₹25–₹32</td><td>Global Tier 1</td></tr><tr><td>LONGi</td><td>China</td><td>₹26–₹34</td><td>Global Tier 1</td></tr></tbody></table><p>Tier 1 status (Bloomberg NEF classification) indicates bankability and manufacturing scale — it does not guarantee the best product for every use case. Indian brands often offer better after-sales service and local warranty support.</p><p><a href=\"/in/solar-panels/brands/\">Detailed brand comparison →</a></p>"
    },
    {
      "heading": "What Determines Solar Panel Price?",
      "body": "<p>Six factors drive the price you pay for solar panels:</p><ol><li><strong>Cell technology</strong> — TOPCon and HJT cells cost more than PERC, which costs more than standard poly. Higher efficiency justifies the premium for space-constrained installations.</li><li><strong>Wattage and size</strong> — Higher-watt panels cost more per unit but less per watt. A 540W panel offers better value than two 270W panels.</li><li><strong>Brand and tier</strong> — Tier 1 brands charge a premium for better quality control, bankability, and warranty enforcement.</li><li><strong>BIS certification</strong> — Mandatory in India. Panels without BIS certification cannot be legally sold and do not qualify for government subsidies.</li><li><strong>Order volume</strong> — Bulk orders (10kW+ commercial) get 5–15% lower per-watt pricing. Residential orders (1–5kW) pay standard rates.</li><li><strong>Import vs domestic</strong> — India imposes a 40% basic customs duty (BCD) on imported solar cells and modules since April 2022, making domestic brands more price-competitive.</li></ol>"
    },
    {
      "heading": "Panel Price vs Total System Cost",
      "body": "<p>Solar panels are the largest single cost component, but they are only part of the total system price. Here is how the full cost breaks down for a typical 3kW on-grid system:</p><table><thead><tr><th>Component</th><th>Cost Range</th><th>% of Total</th></tr></thead><tbody><tr><td>Solar panels</td><td>₹78,000–₹1,17,000</td><td>40–50%</td></tr><tr><td>Inverter</td><td>₹30,000–₹55,000</td><td>18–25%</td></tr><tr><td>Mounting structure</td><td>₹15,000–₹25,000</td><td>8–12%</td></tr><tr><td>Wiring & electricals</td><td>₹8,000–₹15,000</td><td>5–8%</td></tr><tr><td>Installation labour</td><td>₹10,000–₹20,000</td><td>5–10%</td></tr><tr><td>Net metering & approvals</td><td>₹5,000–₹12,000</td><td>3–6%</td></tr></tbody></table><p><strong>Total 3kW system: ₹1,50,000–₹2,00,000 (before subsidy)</strong></p><p>After PM Surya Ghar subsidy of ₹78,000, a 3kW system costs most homeowners ₹72,000–₹1,22,000 out of pocket.</p><p><a href=\"/in/rooftop-solar/cost/\">Complete system cost breakdown →</a></p>"
    },
    {
      "heading": "Solar Panel Price Trends in India",
      "body": "<p>Solar panel prices in India have followed a steep downward trajectory:</p><ul><li><strong>2015:</strong> ₹55–₹70/W for polycrystalline</li><li><strong>2018:</strong> ₹28–₹40/W for mono PERC</li><li><strong>2022:</strong> ₹25–₹35/W for mono PERC (temporary spike due to polysilicon shortage)</li><li><strong>2024:</strong> ₹22–₹32/W for mono PERC, TOPCon entering market</li><li><strong>2026:</strong> ₹24–₹32/W for mono PERC, ₹28–₹36/W for TOPCon</li></ul><p>The 40% BCD on imports (since April 2022) created a price floor for panels in India while simultaneously boosting domestic manufacturing capacity. India''s domestic panel manufacturing capacity has grown from 8 GW in 2022 to over 60 GW in 2026.</p><p>Expect continued gradual declines as new gigawatt-scale factories from Adani, Reliance, Tata, and Waaree reach full production.</p>"
    },
    {
      "heading": "Want to See What Panels Cost for Your Roof?",
      "body": "<p>Online price lists give you a range. For an accurate quote specific to your roof area, location, and energy needs, you need quotes from local installers who know the pricing in your district.</p><p>Solar Vipani connects you with 2–3 verified installers in your city who will recommend the right panels and provide detailed, comparable quotes — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 540W solar panel in India?",
      "answer": "A 540W monocrystalline solar panel costs ₹13,000–₹19,000 in India depending on the brand and technology. Polycrystalline 540W panels cost ₹9,700–₹13,000. TOPCon technology panels of the same wattage cost ₹15,100–₹19,400. Prices include GST."
    },
    {
      "question": "Why are solar panel prices different across brands?",
      "answer": "Price differences reflect cell technology (PERC vs TOPCon vs HJT), manufacturing quality control, warranty terms, and brand positioning. Tier 1 brands charge more for better bankability and warranty enforcement. Domestic brands are often more affordable due to lower logistics costs and no import duty."
    },
    {
      "question": "Are cheap solar panels worth buying?",
      "answer": "Not recommended. Panels priced significantly below market rates often lack BIS certification, have shorter warranties, or use lower-grade cells that degrade faster. Since panels must last 25+ years, saving ₹2,000–₹3,000 per panel upfront can cost you lakhs in lost generation over the system lifetime."
    },
    {
      "question": "How many solar panels do I need for a 3kW system?",
      "answer": "With standard 540W panels, you need 6 panels for a 3kW system (6 × 540W = 3,240W). With 400W panels, you need 8. The number varies by panel wattage. Higher-wattage panels are more cost-effective because they reduce mounting and wiring costs."
    },
    {
      "question": "Is there GST on solar panels in India?",
      "answer": "Solar panels sold as part of a complete solar power system attract 13.8% GST under the composite supply rule. Panels bought separately attract 12% GST. Most installer quotes include GST in the total price. Always confirm whether a quote is inclusive of GST before comparing."
    },
    {
      "question": "Will solar panel prices decrease further in India?",
      "answer": "Gradual declines are expected as India''s domestic manufacturing capacity scales up beyond 60 GW. However, the 40% import duty creates a price floor. Expect 5–10% annual reductions for equivalent technology, with most savings coming from newer, higher-efficiency panels at similar price points."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'price' AND pillar_slug = 'solar-panels';


-- 3. CLUSTER: types
UPDATE seo_pages SET
  h1 = 'Types of Solar Panels in India: Which One Is Right for You?',
  meta_title = 'Types of Solar Panels India: Mono, Poly, Bifacial Compared | Solar Vipani',
  meta_description = 'Compare monocrystalline, polycrystalline, and bifacial solar panels — efficiency, price, lifespan, and best use cases for Indian homes. Data-backed guide.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Three types of <a href=\"/in/solar-panels/\">solar panels</a> dominate the Indian market: <strong>monocrystalline</strong> (19–23% efficiency, best for most homes), <strong>polycrystalline</strong> (15–18% efficiency, budget option), and <strong>bifacial</strong> (generates power from both sides, 10–25% extra output). For most Indian homeowners, monocrystalline PERC or TOPCon panels offer the best balance of efficiency, price, and space utilisation.</p>"
    },
    {
      "heading": "Monocrystalline Solar Panels",
      "body": "<p>Monocrystalline panels are made from single-crystal silicon wafers, giving them a uniform black appearance and the highest efficiency among mainstream panel types. They dominate 80%+ of new residential installations in India.</p><p><strong>Key specs:</strong></p><ul><li>Efficiency: 19–23%</li><li>Price: ₹24–₹36/W</li><li>Temperature coefficient: -0.35%/°C (loses less power in heat)</li><li>Lifespan: 25–30 years</li><li>Roof space for 3kW: ~200 sq ft</li></ul><p>Modern monocrystalline panels use <strong>PERC</strong> (Passivated Emitter Rear Cell) technology as standard, and the industry is transitioning to <strong>TOPCon</strong> (Tunnel Oxide Passivated Contact) for even higher efficiency at a modest price premium.</p><p>→ <a href=\"/in/solar-panels/monocrystalline/\">Full guide: Monocrystalline Solar Panels</a></p>"
    },
    {
      "heading": "Polycrystalline Solar Panels",
      "body": "<p>Polycrystalline panels use multi-crystal silicon cells, identifiable by their blue, speckled appearance. They cost less to manufacture but deliver lower efficiency per square foot.</p><p><strong>Key specs:</strong></p><ul><li>Efficiency: 15–18%</li><li>Price: ₹18–₹24/W</li><li>Temperature coefficient: -0.40%/°C (more affected by heat)</li><li>Lifespan: 25–30 years</li><li>Roof space for 3kW: ~280 sq ft</li></ul><p>Polycrystalline panels made sense when they cost 40–50% less than mono. Today, the price gap has narrowed to 15–25%, making them harder to justify unless roof space is abundant and budget is the primary constraint.</p><p>→ <a href=\"/in/solar-panels/polycrystalline/\">Full guide: Polycrystalline Solar Panels</a></p>"
    },
    {
      "heading": "Bifacial Solar Panels",
      "body": "<p>Bifacial panels have transparent backsheets (or glass-glass construction) that allow light to enter from both sides. The rear cells capture reflected and diffused light from the ground or roof surface, generating 10–25% more energy than equivalent monofacial panels.</p><p><strong>Key specs:</strong></p><ul><li>Front efficiency: 20–23%</li><li>Bifacial gain: 10–25% extra output</li><li>Price: ₹32–₹45/W</li><li>Best mounting: Elevated (1m+ gap from ground/roof) over light-coloured surfaces</li><li>Lifespan: 30+ years (glass-glass construction is more durable)</li></ul><p>Bifacial panels are most cost-effective for commercial rooftop and ground-mount installations where elevated mounting is standard. For residential rooftops with flush mounting, the bifacial gain drops to 5–10%, making the premium harder to justify.</p><p>→ <a href=\"/in/solar-panels/bifacial/\">Full guide: Bifacial Solar Panels</a></p>"
    },
    {
      "heading": "Half-Cut Cell Panels",
      "body": "<p>Half-cut cell technology is not a panel type but a manufacturing improvement applied to both mono and poly panels. Standard cells are laser-cut in half, doubling the cell count (from 72 to 144 in a typical panel).</p><p><strong>Why it matters:</strong></p><ul><li><strong>Lower resistive losses</strong> — Half the current per cell means less energy lost as heat in the circuit.</li><li><strong>Better shade tolerance</strong> — If one section is shaded, the other half continues generating. Standard cells would drag down the entire string.</li><li><strong>Higher output</strong> — Typically 2–3% more energy than equivalent full-cell panels.</li></ul><p>Most 530W+ monocrystalline panels sold in India today use half-cut cells. It is the baseline technology for modern panels, not a premium upgrade.</p>"
    },
    {
      "heading": "Thin-Film Solar Panels",
      "body": "<p>Thin-film panels (CdTe, CIGS, amorphous silicon) use a thin semiconductor layer deposited on glass or flexible substrate. They are lightweight and perform better in diffused light but have low efficiency (10–13%) and require 2–3× more roof area.</p><p>Thin-film panels have limited residential use in India. They are primarily used in utility-scale solar farms and building-integrated photovoltaics (BIPV). Most Indian installers do not stock them for residential projects.</p>"
    },
    {
      "heading": "Quick Comparison: All Panel Types",
      "body": "<table><thead><tr><th>Feature</th><th>Monocrystalline</th><th>Polycrystalline</th><th>Bifacial</th><th>Thin-Film</th></tr></thead><tbody><tr><td>Efficiency</td><td>19–23%</td><td>15–18%</td><td>20–23% (front)</td><td>10–13%</td></tr><tr><td>Price/Watt</td><td>₹24–₹36</td><td>₹18–₹24</td><td>₹32–₹45</td><td>₹20–₹30</td></tr><tr><td>Space for 3kW</td><td>~200 sq ft</td><td>~280 sq ft</td><td>~200 sq ft</td><td>~450 sq ft</td></tr><tr><td>Heat tolerance</td><td>Good</td><td>Moderate</td><td>Good</td><td>Best</td></tr><tr><td>Lifespan</td><td>25–30 yr</td><td>25–30 yr</td><td>30+ yr</td><td>20–25 yr</td></tr><tr><td>Residential use</td><td>Most popular</td><td>Budget option</td><td>Premium/commercial</td><td>Rare</td></tr></tbody></table><p>For detailed comparisons: <a href=\"/in/solar-panels/monocrystalline-vs-polycrystalline/\">Mono vs Poly</a> · <a href=\"/in/solar-panels/efficiency/\">Efficiency explained</a></p>"
    },
    {
      "heading": "Which Panel Type Should You Choose?",
      "body": "<p>Your best choice depends on three factors:</p><ul><li><strong>Limited roof space (< 250 sq ft for 3kW)?</strong> → Choose <a href=\"/in/solar-panels/monocrystalline/\">monocrystalline</a>. Higher efficiency means more power from less area.</li><li><strong>Tight budget, ample roof space?</strong> → Consider <a href=\"/in/solar-panels/polycrystalline/\">polycrystalline</a>. Lower cost per watt if space is not a constraint.</li><li><strong>Commercial/elevated installation?</strong> → <a href=\"/in/solar-panels/bifacial/\">Bifacial</a> panels maximise output when properly mounted with reflective surface below.</li><li><strong>Not sure?</strong> → Get quotes from verified installers who can assess your roof and recommend the right panel. <a href=\"/in/get-quotes/\">Get free quotes →</a></li></ul>"
    },
    {
      "heading": "Explore Related Guides",
      "body": "<p>Continue your research with these detailed guides:</p><ul><li><a href=\"/in/solar-panels/price/\">Solar Panel Price in India</a> — current prices by type, brand, and wattage</li><li><a href=\"/in/solar-panels/efficiency/\">Solar Panel Efficiency</a> — what efficiency means and why it matters</li><li><a href=\"/in/solar-panels/brands/\">Best Solar Panel Brands</a> — top brands compared</li><li><a href=\"/in/solar-panels/buying-guide/\">Solar Panel Buying Guide</a> — step-by-step guide for homeowners</li><li><a href=\"/in/rooftop-solar/\">Rooftop Solar Guide</a> — complete guide to going solar</li></ul>"
    }
  ]',
  faq = '[
    {
      "question": "Which type of solar panel is most efficient?",
      "answer": "Monocrystalline panels are the most efficient mainstream type at 19–23%. Within monocrystalline, TOPCon technology reaches 22–24% and HJT reaches 23–25%. Bifacial panels can produce more total energy (10–25% extra from the rear side) but their front efficiency is similar to standard mono panels."
    },
    {
      "question": "What is the difference between monocrystalline and polycrystalline solar panels?",
      "answer": "Monocrystalline uses single-crystal silicon (black, 19–23% efficient, ₹24–₹36/W). Polycrystalline uses multi-crystal silicon (blue, 15–18% efficient, ₹18–₹24/W). Mono produces more power per square foot and handles heat better. Poly costs less but needs 30–40% more roof space for the same output."
    },
    {
      "question": "Are bifacial solar panels worth the extra cost?",
      "answer": "For commercial and ground-mount installations with elevated mounting over light surfaces — yes, bifacial panels generate 15–25% more energy and justify the 30–40% price premium. For residential flush-mounted rooftop systems, the gain drops to 5–10%, making standard monocrystalline a better value."
    },
    {
      "question": "What are half-cut cell solar panels?",
      "answer": "Half-cut cells are standard solar cells laser-cut in half, doubling the cell count per panel. This reduces resistive losses, improves shade tolerance, and increases output by 2–3%. Most modern 530W+ panels use half-cut cells as standard — it is not a premium upgrade but baseline technology."
    },
    {
      "question": "Which solar panel type is best for hot climates like India?",
      "answer": "Monocrystalline panels perform best in Indian heat. Their temperature coefficient (-0.35%/°C) is better than polycrystalline (-0.40%/°C), meaning they lose less output as temperatures rise. In Indian summers where cell temperatures reach 55–65°C, this translates to 2–3% more energy from mono panels."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'types' AND pillar_slug = 'solar-panels';

COMMIT;
