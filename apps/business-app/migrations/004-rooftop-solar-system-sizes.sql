-- Rooftop Solar Clusters Batch 3: 1kW, 2kW, 3kW, 5kW, 10kW system pages
-- Run: psql $POSTGRES_URL < 004-rooftop-solar-system-sizes.sql

BEGIN;

-- 1. CLUSTER: 1kw-system
UPDATE seo_pages SET
  h1 = '1kW Solar System for Home: Price, Output & Subsidy in India (2026)',
  meta_title = '1kW Solar System Price India 2026: ₹30K After Subsidy | Solar Vipani',
  meta_description = '1kW solar system costs ₹60,000–₹80,000 before subsidy, ₹30,000–₹50,000 after. Generates 4–5 units/day. Ideal for 1 BHK homes with ₹500–₹1,000 monthly bills.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 1kW solar system costs <strong>₹60,000–₹80,000 before subsidy</strong> and <strong>₹30,000–₹50,000 after the PM Surya Ghar subsidy</strong> of ₹30,000. It generates 4–5 units (kWh) per day — enough for a 1 BHK flat or a home with a monthly bill of ₹500–₹1,000. Needs just ~100 sq ft of shadow-free roof space and 2 standard 540W panels.</p>"
    },
    {
      "heading": "1kW Solar System Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th><th>Share of Total</th></tr></thead><tbody><tr><td>Solar panels (2 × 540W mono)</td><td>₹18,000–₹24,000</td><td>30–35%</td></tr><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverter</a> (1kW)</td><td>₹15,000–₹22,000</td><td>25–30%</td></tr><tr><td>Mounting structure</td><td>₹5,000–₹8,000</td><td>8–10%</td></tr><tr><td>Wiring, protection, earthing</td><td>₹4,000–₹6,000</td><td>6–8%</td></tr><tr><td>Installation labour</td><td>₹4,000–₹6,000</td><td>6–8%</td></tr><tr><td>Net metering & DISCOM fees</td><td>₹2,000–₹5,000</td><td>3–6%</td></tr><tr><td>GST (13.8%)</td><td>₹7,000–₹9,000</td><td>~13%</td></tr><tr><td><strong>Total (before subsidy)</strong></td><td><strong>₹60,000–₹80,000</strong></td><td>100%</td></tr><tr><td>PM Surya Ghar subsidy</td><td>−₹30,000</td><td></td></tr><tr><td><strong>Net cost (after subsidy)</strong></td><td><strong>₹30,000–₹50,000</strong></td><td></td></tr></tbody></table><p><a href=\"/in/rooftop-solar/cost/\">Full cost guide for all system sizes →</a></p>"
    },
    {
      "heading": "Daily and Monthly Output",
      "body": "<p>A 1kW system generates:</p><table><thead><tr><th>Period</th><th>Output</th><th>Bill Savings (at ₹6–₹10/unit)</th></tr></thead><tbody><tr><td>Per day</td><td>4–5 units</td><td>₹24–₹50</td></tr><tr><td>Per month</td><td>120–150 units</td><td>₹720–₹1,500</td></tr><tr><td>Per year</td><td>1,450–1,800 units</td><td>₹8,700–₹18,000</td></tr></tbody></table><p>Output varies by location — western and southern India (Rajasthan, Gujarat, Maharashtra, Karnataka) average 4.5–5.5 peak sun hours, while northern and eastern states average 3.5–4.5 hours.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate exact output for your location</a></p>"
    },
    {
      "heading": "What Can a 1kW System Run?",
      "body": "<p>A 1kW system is best suited for <strong>light electrical loads</strong>:</p><table><thead><tr><th>Appliance</th><th>Wattage</th><th>Hours/day</th><th>Daily Units</th></tr></thead><tbody><tr><td>LED lights (5)</td><td>50W</td><td>6</td><td>0.3</td></tr><tr><td>Ceiling fans (2)</td><td>140W</td><td>10</td><td>1.4</td></tr><tr><td>TV (LED 42\")</td><td>80W</td><td>4</td><td>0.3</td></tr><tr><td>WiFi router</td><td>15W</td><td>24</td><td>0.4</td></tr><tr><td>Laptop charger</td><td>65W</td><td>5</td><td>0.3</td></tr><tr><td>Mobile chargers (2)</td><td>20W</td><td>3</td><td>0.06</td></tr><tr><td><strong>Total</strong></td><td></td><td></td><td><strong>2.8 units</strong></td></tr></tbody></table><p>This leaves 1–2 units of surplus per day for net metering credits. A 1kW system <strong>cannot</strong> handle heavy loads like AC, geyser, or washing machine — for those, consider a <a href=\"/in/rooftop-solar/3kw-system/\">3kW</a> or <a href=\"/in/rooftop-solar/5kw-system/\">5kW system</a>.</p>"
    },
    {
      "heading": "Space Requirements",
      "body": "<p>A 1kW system is the most compact rooftop solar setup:</p><ul><li><strong>Panels:</strong> 2 × 540W monocrystalline panels</li><li><strong>Panel dimensions:</strong> ~2.3m × 1.1m each</li><li><strong>Total roof area:</strong> ~100 sq ft (with inter-row spacing and access clearance)</li><li><strong>Roof type:</strong> Works on flat RCC roof, metal sheet roof, or tiled roof with appropriate mounting</li><li><strong>Weight:</strong> ~30–40 kg total (panels + structure) — any standard RCC roof handles this easily</li></ul><p>Ideal for apartments with limited terrace allocation or small independent houses. <a href=\"/in/rooftop-solar/for-apartments/\">Solar for apartments guide →</a></p>"
    },
    {
      "heading": "Subsidy and Payback Period",
      "body": "<p>A 1kW system qualifies for ₹30,000 under <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a> (₹30,000/kW for the first 2kW).</p><p><strong>Payback calculation:</strong></p><table><thead><tr><th>Scenario</th><th>Net Cost</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>Low tariff (₹5/unit)</td><td>₹40,000</td><td>₹7,500</td><td>~5.3 years</td></tr><tr><td>Medium tariff (₹7/unit)</td><td>₹40,000</td><td>₹10,500</td><td>~3.8 years</td></tr><tr><td>High tariff (₹10/unit)</td><td>₹40,000</td><td>₹15,000</td><td>~2.7 years</td></tr></tbody></table><p>After payback, you get free electricity for the remaining 20+ years of panel life. Even the most conservative scenario recovers investment well within the warranty period.</p>"
    },
    {
      "heading": "On-Grid vs Off-Grid for 1kW",
      "body": "<p>For a 1kW system, <a href=\"/in/rooftop-solar/on-grid/\">on-grid</a> is almost always the right choice:</p><table><thead><tr><th></th><th>On-Grid 1kW</th><th>Off-Grid 1kW</th></tr></thead><tbody><tr><td>Cost</td><td>₹60,000–₹80,000</td><td>₹1,20,000–₹1,60,000</td></tr><tr><td>After subsidy</td><td>₹30,000–₹50,000</td><td>No subsidy</td></tr><tr><td>Battery</td><td>None needed</td><td>₹40,000–₹60,000</td></tr><tr><td>Maintenance</td><td>Minimal</td><td>Battery replacement every 4–5 yrs</td></tr></tbody></table><p>Choose off-grid only if you have no grid connection. For backup during power cuts, a <a href=\"/in/rooftop-solar/hybrid/\">hybrid setup</a> is better value than full off-grid.</p>"
    },
    {
      "heading": "Who Should Choose 1kW?",
      "body": "<ul><li><strong>1 BHK flats</strong> with basic loads (fans, lights, TV, WiFi)</li><li><strong>Apartment owners</strong> with limited rooftop allocation (~100 sq ft)</li><li><strong>Low electricity bills</strong> (₹500–₹1,000/month)</li><li><strong>Budget-conscious buyers</strong> wanting the lowest entry cost into solar</li><li><strong>First-time solar users</strong> who want to start small and potentially expand later</li></ul><p>If your monthly bill exceeds ₹1,500, a <a href=\"/in/rooftop-solar/2kw-system/\">2kW</a> or <a href=\"/in/rooftop-solar/3kw-system/\">3kW system</a> offers better value per watt and faster payback.</p>"
    },
    {
      "heading": "Get 1kW Solar Quotes",
      "body": "<p>Compare quotes from 2–3 verified local installers. Solar Vipani matches you with MNRE-empanelled installers in your city who handle everything — design, installation, net metering, and subsidy paperwork.</p><p><a href=\"/in/get-quotes/\">Get your free 1kW solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 1kW solar system in India?",
      "answer": "A 1kW on-grid solar system costs ₹60,000–₹80,000 before subsidy. After the PM Surya Ghar subsidy of ₹30,000, your out-of-pocket cost is ₹30,000–₹50,000. This includes panels, inverter, mounting, wiring, installation, and net metering fees."
    },
    {
      "question": "How many units does a 1kW solar system generate per day?",
      "answer": "A 1kW system generates 4–5 units (kWh) per day on average in Indian conditions. Monthly output is 120–150 units. Output varies by location — sunny states like Rajasthan and Gujarat get closer to 5 units/day, while cloudy regions average 3.5–4 units."
    },
    {
      "question": "Can a 1kW solar system run an AC?",
      "answer": "Not practically. A 1-ton AC draws about 1,000W — consuming the entire 1kW system output just for cooling. A 1kW system is designed for light loads: fans, lights, TV, and small appliances. For AC usage, consider a 3kW or 5kW system."
    },
    {
      "question": "How many solar panels are needed for 1kW?",
      "answer": "With modern 540W monocrystalline panels, you need just 2 panels for a 1kW system (2 × 540W = 1,080W). This requires about 100 sq ft of shadow-free roof space."
    },
    {
      "question": "What is the subsidy on a 1kW solar system?",
      "answer": "Under PM Surya Ghar, a 1kW system qualifies for ₹30,000 subsidy (₹30,000/kW for the first 2kW). The subsidy is available only for on-grid systems installed by MNRE-empanelled vendors. It is credited to your bank account after DISCOM inspection."
    },
    {
      "question": "Is a 1kW solar system enough for a home?",
      "answer": "For a 1 BHK with basic loads (fans, lights, TV, WiFi), yes. It generates 120–150 units/month, offsetting ₹720–₹1,500 from your bill. For larger homes or heavier usage (AC, geyser, washing machine), you need at least 3kW."
    }
  ]',
  updated_at = NOW()
WHERE slug = '1kw-system' AND pillar_slug = 'rooftop-solar';


-- 2. CLUSTER: 2kw-system
UPDATE seo_pages SET
  h1 = '2kW Solar System for Home: Price, Output & Subsidy in India (2026)',
  meta_title = '2kW Solar System Price India 2026: ₹50K–₹80K After Subsidy | Solar Vipani',
  meta_description = '2kW solar system costs ₹1,10,000–₹1,40,000 before subsidy, ₹50,000–₹80,000 after. Generates 8–10 units/day. Best for 2 BHK homes with ₹1,000–₹2,000 monthly bills.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 2kW solar system costs <strong>₹1,10,000–₹1,40,000 before subsidy</strong> and <strong>₹50,000–₹80,000 after the PM Surya Ghar subsidy</strong> of ₹60,000. It generates 8–10 units per day — suitable for a 2 BHK home with moderate electricity usage (₹1,000–₹2,000/month bill). Requires ~200 sq ft of roof space and 4 standard panels.</p>"
    },
    {
      "heading": "2kW Solar System Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (4 × 540W mono)</td><td>₹36,000–₹48,000</td></tr><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverter</a> (2kW)</td><td>₹20,000–₹28,000</td></tr><tr><td>Mounting structure</td><td>₹8,000–₹12,000</td></tr><tr><td>Wiring, protection, earthing</td><td>₹6,000–₹8,000</td></tr><tr><td>Installation labour</td><td>₹5,000–₹8,000</td></tr><tr><td>Net metering & DISCOM fees</td><td>₹2,000–₹5,000</td></tr><tr><td>GST (13.8%)</td><td>₹12,000–₹16,000</td></tr><tr><td><strong>Total (before subsidy)</strong></td><td><strong>₹1,10,000–₹1,40,000</strong></td></tr><tr><td>PM Surya Ghar subsidy</td><td>−₹60,000</td></tr><tr><td><strong>Net cost (after subsidy)</strong></td><td><strong>₹50,000–₹80,000</strong></td></tr></tbody></table><p>The 2kW tier gets the maximum per-kW subsidy rate (₹30,000/kW × 2 = ₹60,000), making it one of the best value-for-money sizes.</p><p><a href=\"/in/rooftop-solar/cost/\">Full cost guide for all sizes →</a></p>"
    },
    {
      "heading": "Daily and Monthly Output",
      "body": "<table><thead><tr><th>Period</th><th>Output</th><th>Bill Savings (at ₹6–₹10/unit)</th></tr></thead><tbody><tr><td>Per day</td><td>8–10 units</td><td>₹48–₹100</td></tr><tr><td>Per month</td><td>240–300 units</td><td>₹1,440–₹3,000</td></tr><tr><td>Per year</td><td>2,900–3,600 units</td><td>₹17,400–₹36,000</td></tr></tbody></table><p>A 2kW system typically offsets 60–80% of a 2 BHK household''s electricity consumption — enough for fans, lights, TV, refrigerator, and small kitchen appliances but not enough for regular AC usage.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate exact savings for your location and usage</a></p>"
    },
    {
      "heading": "What Can a 2kW System Run?",
      "body": "<p>A 2kW system handles moderate household loads comfortably:</p><table><thead><tr><th>Appliance</th><th>Wattage</th><th>Hours/day</th><th>Daily Units</th></tr></thead><tbody><tr><td>LED lights (8)</td><td>80W</td><td>6</td><td>0.5</td></tr><tr><td>Ceiling fans (3)</td><td>210W</td><td>10</td><td>2.1</td></tr><tr><td>Refrigerator (190L)</td><td>150W</td><td>8 (compressor)</td><td>1.2</td></tr><tr><td>TV (LED 42\")</td><td>80W</td><td>5</td><td>0.4</td></tr><tr><td>WiFi router</td><td>15W</td><td>24</td><td>0.4</td></tr><tr><td>Washing machine</td><td>500W</td><td>1</td><td>0.5</td></tr><tr><td>Mixer grinder</td><td>750W</td><td>0.3</td><td>0.2</td></tr><tr><td>Mobile + laptop charging</td><td>85W</td><td>5</td><td>0.4</td></tr><tr><td><strong>Total</strong></td><td></td><td></td><td><strong>5.7 units</strong></td></tr></tbody></table><p>This leaves 2–4 units daily surplus for net metering credits. For AC or geyser, upgrade to <a href=\"/in/rooftop-solar/3kw-system/\">3kW</a> or <a href=\"/in/rooftop-solar/5kw-system/\">5kW</a>.</p>"
    },
    {
      "heading": "Space and Installation",
      "body": "<ul><li><strong>Panels:</strong> 4 × 540W monocrystalline panels</li><li><strong>Roof area:</strong> ~200 sq ft (shadow-free, includes spacing)</li><li><strong>Weight:</strong> ~60–80 kg total</li><li><strong>Installation time:</strong> 1 day for most roofs</li><li><strong>Orientation:</strong> South-facing at 10–15° tilt (optimal for India)</li></ul><p>A 2kW system fits comfortably on most independent house terraces. For apartments, you need ~200 sq ft of allocated space — check with your <a href=\"/in/rooftop-solar/for-apartments/\">housing society</a>.</p>"
    },
    {
      "heading": "Subsidy and Payback Period",
      "body": "<p>2kW hits the sweet spot for subsidy — it gets the highest per-kW rate under <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar</a>:</p><ul><li><strong>Subsidy:</strong> ₹30,000/kW × 2kW = ₹60,000</li><li><strong>Effective subsidy coverage:</strong> 43–55% of system cost</li></ul><p><strong>Payback calculation:</strong></p><table><thead><tr><th>Tariff</th><th>Net Cost</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>₹5/unit</td><td>₹65,000</td><td>₹15,000</td><td>~4.3 years</td></tr><tr><td>₹7/unit</td><td>₹65,000</td><td>₹21,000</td><td>~3.1 years</td></tr><tr><td>₹10/unit</td><td>₹65,000</td><td>₹30,000</td><td>~2.2 years</td></tr></tbody></table><p>The 2kW system offers arguably the best payback of any size because of the maximum subsidy rate.</p>"
    },
    {
      "heading": "2kW vs Other Sizes: Should You Go Bigger?",
      "body": "<table><thead><tr><th></th><th><a href=\"/in/rooftop-solar/1kw-system/\">1kW</a></th><th><strong>2kW</strong></th><th><a href=\"/in/rooftop-solar/3kw-system/\">3kW</a></th></tr></thead><tbody><tr><td>Cost after subsidy</td><td>₹30K–₹50K</td><td>₹50K–₹80K</td><td>₹72K–₹1.12L</td></tr><tr><td>Daily output</td><td>4–5 units</td><td>8–10 units</td><td>12–15 units</td></tr><tr><td>Runs AC?</td><td>No</td><td>No</td><td>1 unit, limited hours</td></tr><tr><td>Best monthly bill</td><td>₹500–₹1,000</td><td>₹1,000–₹2,000</td><td>₹2,000–₹3,500</td></tr></tbody></table><p><strong>Rule of thumb:</strong> If your monthly bill is under ₹2,000, 2kW is the sweet spot. If it is ₹2,000–₹3,500, the extra ₹20,000–₹30,000 for 3kW is worth it because of the additional subsidy kW at ₹18,000/kW.</p>"
    },
    {
      "heading": "Who Should Choose 2kW?",
      "body": "<ul><li><strong>2 BHK homes</strong> without AC or with minimal AC use</li><li><strong>Monthly bills of ₹1,000–₹2,000</strong></li><li><strong>Budget-conscious buyers</strong> who want strong subsidy coverage (~50% of cost)</li><li><strong>Small families</strong> (2–3 members) with standard appliance usage</li><li><strong>Apartment flat owners</strong> with ~200 sq ft of rooftop allocation</li></ul>"
    },
    {
      "heading": "Get 2kW Solar Quotes",
      "body": "<p>Solar Vipani connects you with 2–3 verified installers in your city. Compare quotes, panel brands, and inverter options — free and without obligation.</p><p><a href=\"/in/get-quotes/\">Get your free 2kW solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 2kW solar system in India?",
      "answer": "A 2kW on-grid system costs ₹1,10,000–₹1,40,000 before subsidy. After PM Surya Ghar subsidy of ₹60,000 (₹30,000/kW × 2), your net cost is ₹50,000–₹80,000 including panels, inverter, mounting, installation, and net metering."
    },
    {
      "question": "How many units does a 2kW solar system produce per day?",
      "answer": "A 2kW system produces 8–10 units (kWh) per day on average. Monthly output is 240–300 units. This offsets ₹1,440–₹3,000 per month depending on your electricity tariff."
    },
    {
      "question": "How many panels are needed for 2kW solar?",
      "answer": "With 540W monocrystalline panels, you need 4 panels (4 × 540W = 2,160W). These require approximately 200 sq ft of shadow-free roof space."
    },
    {
      "question": "Can a 2kW solar system run an air conditioner?",
      "answer": "Not effectively. A 1-ton inverter AC draws 700–1,000W, consuming most of the 2kW capacity and leaving little for other appliances. For AC usage, a 3kW or 5kW system is recommended."
    },
    {
      "question": "What is the payback period for a 2kW solar system?",
      "answer": "2–4 years depending on your electricity tariff. At ₹7/unit, a 2kW system with ₹65,000 net cost (after subsidy) pays back in about 3 years. The 2kW size offers the best payback ratio due to the maximum per-kW subsidy rate."
    },
    {
      "question": "Is 2kW enough for a 2 BHK house?",
      "answer": "For a 2 BHK without AC, yes. A 2kW system generates 8–10 units/day, covering fans, lights, fridge, TV, washing machine, and small appliances. If your monthly bill exceeds ₹2,000 or you use AC regularly, consider upgrading to 3kW."
    }
  ]',
  updated_at = NOW()
WHERE slug = '2kw-system' AND pillar_slug = 'rooftop-solar';


-- 3. CLUSTER: 3kw-system
UPDATE seo_pages SET
  h1 = '3kW Solar System for Home: Price, Output & Subsidy in India (2026)',
  meta_title = '3kW Solar System Price India 2026: Most Popular Home Size | Solar Vipani',
  meta_description = '3kW solar costs ₹1,50,000–₹1,90,000 before subsidy, ₹72,000–₹1,12,000 after. India''s most popular home solar size. 12–15 units/day for 2–3 BHK homes.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 3kW solar system costs <strong>₹1,50,000–₹1,90,000 before subsidy</strong> and <strong>₹72,000–₹1,12,000 after PM Surya Ghar subsidy</strong> of ₹78,000. It generates 12–15 units per day — <strong>India''s most popular residential solar size</strong>, ideal for 2–3 BHK homes with monthly bills of ₹2,000–₹3,500. This is also the maximum subsidy-optimised size, as the ₹78,000 cap is reached at 3kW.</p>"
    },
    {
      "heading": "3kW Solar System Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (6 × 540W mono)</td><td>₹50,000–₹68,000</td></tr><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverter</a> (3kW)</td><td>₹25,000–₹35,000</td></tr><tr><td>Mounting structure</td><td>₹10,000–₹15,000</td></tr><tr><td>Wiring, protection, earthing</td><td>₹8,000–₹10,000</td></tr><tr><td>Installation labour</td><td>₹6,000–₹10,000</td></tr><tr><td>Net metering & DISCOM fees</td><td>₹2,000–₹5,000</td></tr><tr><td>GST (13.8%)</td><td>₹16,000–₹21,000</td></tr><tr><td><strong>Total (before subsidy)</strong></td><td><strong>₹1,50,000–₹1,90,000</strong></td></tr><tr><td>PM Surya Ghar subsidy</td><td>−₹78,000</td></tr><tr><td><strong>Net cost (after subsidy)</strong></td><td><strong>₹72,000–₹1,12,000</strong></td></tr></tbody></table><p>The 3kW size maximises subsidy value: ₹30,000/kW for the first 2kW + ₹18,000/kW for the 3rd kW = ₹78,000 total. Beyond 3kW, no additional subsidy applies.</p><p><a href=\"/in/rooftop-solar/cost/\">Complete cost comparison across all sizes →</a></p>"
    },
    {
      "heading": "Daily and Monthly Output",
      "body": "<table><thead><tr><th>Period</th><th>Output</th><th>Bill Savings (at ₹6–₹10/unit)</th></tr></thead><tbody><tr><td>Per day</td><td>12–15 units</td><td>₹72–₹150</td></tr><tr><td>Per month</td><td>360–450 units</td><td>₹2,160–₹4,500</td></tr><tr><td>Per year</td><td>4,380–5,475 units</td><td>₹26,280–₹54,750</td></tr></tbody></table><p>For most 2–3 BHK homes consuming 300–450 units/month, a 3kW system offsets <strong>80–100% of the electricity bill</strong>. You may end up paying only the fixed DISCOM charges (₹50–₹200/month).</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your exact savings</a></p>"
    },
    {
      "heading": "What Can a 3kW System Run?",
      "body": "<p>A 3kW system handles a typical Indian household comfortably:</p><table><thead><tr><th>Appliance</th><th>Wattage</th><th>Hours/day</th><th>Daily Units</th></tr></thead><tbody><tr><td>LED lights (10)</td><td>100W</td><td>6</td><td>0.6</td></tr><tr><td>Ceiling fans (4)</td><td>280W</td><td>10</td><td>2.8</td></tr><tr><td>Refrigerator (260L)</td><td>180W</td><td>8</td><td>1.4</td></tr><tr><td>TV (LED 50\")</td><td>100W</td><td>5</td><td>0.5</td></tr><tr><td>Washing machine</td><td>500W</td><td>1</td><td>0.5</td></tr><tr><td>WiFi + laptop + phones</td><td>100W</td><td>8</td><td>0.8</td></tr><tr><td>Mixer + iron (alternating)</td><td>800W</td><td>0.5</td><td>0.4</td></tr><tr><td>Inverter AC (1 ton, limited)</td><td>900W</td><td>3</td><td>2.7</td></tr><tr><td><strong>Total</strong></td><td></td><td></td><td><strong>9.7 units</strong></td></tr></tbody></table><p>This leaves 2–5 units of daily surplus for net metering. The 3kW system can handle <strong>limited AC usage</strong> (3–4 hours/day) alongside other appliances. For heavy AC usage, consider <a href=\"/in/rooftop-solar/5kw-system/\">5kW</a>.</p>"
    },
    {
      "heading": "Space and Installation",
      "body": "<ul><li><strong>Panels:</strong> 6 × 540W monocrystalline panels</li><li><strong>Roof area:</strong> ~300 sq ft (shadow-free)</li><li><strong>Weight:</strong> ~90–120 kg total</li><li><strong>Installation time:</strong> 1–2 days</li><li><strong>Orientation:</strong> South-facing, 10–15° tilt</li></ul><p>300 sq ft is achievable on most independent house terraces. For apartments, it requires a cooperative society or individually allocated terrace space. <a href=\"/in/rooftop-solar/for-apartments/\">Apartment solar guide →</a></p>"
    },
    {
      "heading": "Subsidy and Payback Period",
      "body": "<p>3kW maximises the PM Surya Ghar subsidy at ₹78,000:</p><ul><li>First 2kW: ₹30,000/kW = ₹60,000</li><li>3rd kW: ₹18,000/kW = ₹18,000</li><li><strong>Total: ₹78,000</strong> (subsidy cap reached)</li></ul><p><strong>Payback calculation:</strong></p><table><thead><tr><th>Tariff</th><th>Net Cost</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>₹5/unit</td><td>₹92,000</td><td>₹22,500</td><td>~4.1 years</td></tr><tr><td>₹7/unit</td><td>₹92,000</td><td>₹31,500</td><td>~2.9 years</td></tr><tr><td>₹10/unit</td><td>₹92,000</td><td>₹45,000</td><td>~2.0 years</td></tr></tbody></table><p>Most homes with ₹3,000+ monthly bills recover investment in under 3 years.</p>"
    },
    {
      "heading": "Why 3kW Is India''s Most Popular Size",
      "body": "<p>Three reasons make 3kW the dominant choice:</p><ol><li><strong>Subsidy-optimised</strong> — ₹78,000 is the maximum subsidy. Going to 4kW or 5kW adds ₹50,000–₹1,30,000 in cost with zero additional subsidy.</li><li><strong>Right-sized for most homes</strong> — 12–15 units/day covers 80–100% of a typical 2–3 BHK''s consumption, including limited AC.</li><li><strong>Best cost-to-benefit ratio</strong> — After subsidy, you pay ~₹92,000 for a system that saves ₹25,000–₹45,000 per year. No other home investment matches this return.</li></ol><p>If your bill consistently exceeds ₹4,000/month (heavy AC, EV charging), the <a href=\"/in/rooftop-solar/5kw-system/\">5kW system</a> is worth the premium despite no extra subsidy.</p>"
    },
    {
      "heading": "3kW vs Other Sizes",
      "body": "<table><thead><tr><th></th><th><a href=\"/in/rooftop-solar/2kw-system/\">2kW</a></th><th><strong>3kW</strong></th><th><a href=\"/in/rooftop-solar/5kw-system/\">5kW</a></th></tr></thead><tbody><tr><td>Cost after subsidy</td><td>₹50K–₹80K</td><td>₹72K–₹1.12L</td><td>₹1.72L–₹2.42L</td></tr><tr><td>Daily output</td><td>8–10 units</td><td>12–15 units</td><td>20–25 units</td></tr><tr><td>Runs AC?</td><td>No</td><td>Limited (3–4 hrs)</td><td>Yes (6–8 hrs)</td></tr><tr><td>Bill range</td><td>₹1K–₹2K</td><td>₹2K–₹3.5K</td><td>₹3.5K–₹6K</td></tr><tr><td>Subsidy</td><td>₹60,000</td><td>₹78,000</td><td>₹78,000</td></tr></tbody></table>"
    },
    {
      "heading": "Get 3kW Solar Quotes",
      "body": "<p>The 3kW system is India''s best-selling residential solar size. Compare quotes from verified installers who install 3kW systems daily and know the optimal configuration for your roof.</p><p><a href=\"/in/get-quotes/\">Get your free 3kW solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 3kW solar system in India after subsidy?",
      "answer": "A 3kW on-grid system costs ₹1,50,000–₹1,90,000 before subsidy. After PM Surya Ghar subsidy of ₹78,000, your net cost is ₹72,000–₹1,12,000. This is the maximum subsidy amount — going above 3kW does not increase the subsidy."
    },
    {
      "question": "How many units does a 3kW solar system generate per month?",
      "answer": "A 3kW system generates 360–450 units per month (12–15 units/day). This is enough to offset ₹2,000–₹4,500 in monthly electricity bills, covering 80–100% of a typical 2–3 BHK home consumption."
    },
    {
      "question": "Can a 3kW solar system run AC?",
      "answer": "Yes, with limitations. A 3kW system can run a 1-ton inverter AC for 3–4 hours daily alongside other household loads. For 6–8 hours of daily AC or multiple AC units, upgrade to a 5kW system."
    },
    {
      "question": "How many panels are needed for a 3kW system?",
      "answer": "With 540W panels, you need 6 panels (6 × 540W = 3,240W). This requires about 300 sq ft of shadow-free roof space. With older 330W panels, you would need 9–10 panels."
    },
    {
      "question": "Why is 3kW the most popular solar system size in India?",
      "answer": "Three reasons: it maximises the PM Surya Ghar subsidy (₹78,000 cap reached at 3kW), it right-sizes for most Indian homes (12–15 units/day), and it offers the best payback ratio (2–4 years). Going above 3kW costs significantly more with no additional subsidy."
    },
    {
      "question": "What is the payback period for a 3kW solar system?",
      "answer": "2–4 years depending on your electricity tariff. At ₹7/unit average, a 3kW system pays back in about 3 years. After payback, you save ₹25,000–₹45,000 annually for the remaining 22+ years of system life."
    }
  ]',
  updated_at = NOW()
WHERE slug = '3kw-system' AND pillar_slug = 'rooftop-solar';


-- 4. CLUSTER: 5kw-system
UPDATE seo_pages SET
  h1 = '5kW Solar System for Home: Price, Output & Setup Guide India (2026)',
  meta_title = '5kW Solar System Price India 2026: Ideal for AC & Large Homes | Solar Vipani',
  meta_description = '5kW solar system costs ₹2,50,000–₹3,20,000 before subsidy, ₹1,72,000–₹2,42,000 after. Generates 20–25 units/day. Best for 3+ BHK homes with AC usage.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 5kW solar system costs <strong>₹2,50,000–₹3,20,000 before subsidy</strong> and <strong>₹1,72,000–₹2,42,000 after PM Surya Ghar subsidy</strong> of ₹78,000. It generates 20–25 units per day — built for <strong>large homes with AC, geysers, and heavy appliance usage</strong>. Ideal for 3+ BHK homes with monthly electricity bills of ₹3,500–₹6,000. Requires ~500 sq ft of roof space.</p>"
    },
    {
      "heading": "5kW Solar System Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (10 × 540W mono)</td><td>₹85,000–₹1,10,000</td></tr><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverter</a> (5kW)</td><td>₹35,000–₹50,000</td></tr><tr><td>Mounting structure</td><td>₹15,000–₹22,000</td></tr><tr><td>Wiring, protection, earthing</td><td>₹10,000–₹14,000</td></tr><tr><td>Installation labour</td><td>₹8,000–₹12,000</td></tr><tr><td>Net metering & DISCOM fees</td><td>₹3,000–₹6,000</td></tr><tr><td>GST (13.8%)</td><td>₹27,000–₹35,000</td></tr><tr><td><strong>Total (before subsidy)</strong></td><td><strong>₹2,50,000–₹3,20,000</strong></td></tr><tr><td>PM Surya Ghar subsidy</td><td>−₹78,000</td></tr><tr><td><strong>Net cost (after subsidy)</strong></td><td><strong>₹1,72,000–₹2,42,000</strong></td></tr></tbody></table><p><strong>Note:</strong> Subsidy remains capped at ₹78,000 (same as 3kW). The extra 2kW beyond 3kW is fully at your cost. Despite this, 5kW is worth it if your consumption justifies it.</p><p><a href=\"/in/rooftop-solar/cost/\">Full cost guide for all sizes →</a></p>"
    },
    {
      "heading": "Daily and Monthly Output",
      "body": "<table><thead><tr><th>Period</th><th>Output</th><th>Bill Savings (at ₹6–₹10/unit)</th></tr></thead><tbody><tr><td>Per day</td><td>20–25 units</td><td>₹120–₹250</td></tr><tr><td>Per month</td><td>600–750 units</td><td>₹3,600–₹7,500</td></tr><tr><td>Per year</td><td>7,300–9,125 units</td><td>₹43,800–₹91,250</td></tr></tbody></table><p>A 5kW system comfortably offsets electricity bills of ₹3,500–₹7,000/month. In many cases, your net bill drops to just the fixed charges.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your exact savings</a></p>"
    },
    {
      "heading": "What Can a 5kW System Run?",
      "body": "<p>5kW is the entry point for homes with <strong>regular AC usage</strong>:</p><table><thead><tr><th>Appliance</th><th>Wattage</th><th>Hours/day</th><th>Daily Units</th></tr></thead><tbody><tr><td>LED lights (12)</td><td>120W</td><td>6</td><td>0.7</td></tr><tr><td>Ceiling fans (5)</td><td>350W</td><td>10</td><td>3.5</td></tr><tr><td>Refrigerator (300L)</td><td>200W</td><td>8</td><td>1.6</td></tr><tr><td>Inverter AC 1.5 ton</td><td>1,200W</td><td>6</td><td>7.2</td></tr><tr><td>TV (55\")</td><td>120W</td><td>5</td><td>0.6</td></tr><tr><td>Washing machine</td><td>500W</td><td>1</td><td>0.5</td></tr><tr><td>Geyser (instant, 3kW)</td><td>3,000W</td><td>0.3</td><td>0.9</td></tr><tr><td>WiFi + laptops + phones</td><td>150W</td><td>10</td><td>1.5</td></tr><tr><td>Kitchen (mixer, microwave)</td><td>1,000W</td><td>0.5</td><td>0.5</td></tr><tr><td><strong>Total</strong></td><td></td><td></td><td><strong>17 units</strong></td></tr></tbody></table><p>This leaves 3–8 units of daily surplus. A 5kW system runs <strong>1 AC for 6+ hours daily</strong> alongside full household loads. For 2+ ACs or EV charging, consider <a href=\"/in/rooftop-solar/10kw-system/\">10kW</a>.</p>"
    },
    {
      "heading": "Space and Installation",
      "body": "<ul><li><strong>Panels:</strong> 10 × 540W monocrystalline panels</li><li><strong>Roof area:</strong> ~500 sq ft (shadow-free)</li><li><strong>Weight:</strong> ~150–200 kg total</li><li><strong>Installation time:</strong> 1–2 days</li></ul><p>500 sq ft is available on most independent house terraces but tight for apartments. If space is limited, use higher-wattage panels (580–600W) to reduce panel count, or <a href=\"/in/solar-panels/bifacial/\">bifacial panels</a> for extra output from reflected light.</p>"
    },
    {
      "heading": "Subsidy and Payback Period",
      "body": "<p>Subsidy remains capped at ₹78,000 (same as 3kW). The financial case for 5kW rests on <strong>higher absolute savings</strong>, not better subsidy coverage:</p><table><thead><tr><th>Tariff</th><th>Net Cost</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>₹5/unit</td><td>₹2,07,000</td><td>₹37,500</td><td>~5.5 years</td></tr><tr><td>₹7/unit</td><td>₹2,07,000</td><td>₹52,500</td><td>~3.9 years</td></tr><tr><td>₹10/unit</td><td>₹2,07,000</td><td>₹75,000</td><td>~2.8 years</td></tr></tbody></table><p>Homes in higher tariff slabs (₹8–₹12/unit) — common in metros like Mumbai, Delhi, Bangalore — see the strongest returns because solar offsets the most expensive units first.</p>"
    },
    {
      "heading": "5kW vs 3kW: When to Upgrade",
      "body": "<p>The decision between <a href=\"/in/rooftop-solar/3kw-system/\">3kW</a> and 5kW comes down to consumption:</p><table><thead><tr><th></th><th>3kW</th><th>5kW</th></tr></thead><tbody><tr><td>Cost after subsidy</td><td>₹72K–₹1.12L</td><td>₹1.72L–₹2.42L</td></tr><tr><td>Daily output</td><td>12–15 units</td><td>20–25 units</td></tr><tr><td>AC capability</td><td>1 unit, 3–4 hrs</td><td>1 unit, 6–8 hrs</td></tr><tr><td>Best bill range</td><td>₹2K–₹3.5K</td><td>₹3.5K–₹6K</td></tr><tr><td>Extra cost vs 3kW</td><td>—</td><td>₹1,00,000–₹1,30,000</td></tr></tbody></table><p><strong>Upgrade to 5kW if:</strong> You use AC 5+ hours daily, have a geyser, use a washing machine + dryer, or your bill exceeds ₹3,500/month. The extra ₹1L pays back through higher tariff-slab savings.</p>"
    },
    {
      "heading": "On-Grid vs Hybrid for 5kW",
      "body": "<p>At the 5kW level, the <a href=\"/in/rooftop-solar/hybrid/\">hybrid</a> option becomes attractive because the absolute cost premium for batteries is proportionally smaller:</p><ul><li><strong>On-grid 5kW:</strong> ₹2,50,000–₹3,20,000 — no backup, lowest cost</li><li><strong>Hybrid 5kW:</strong> ₹3,50,000–₹4,80,000 — adds 3–5 kWh battery for power-cut backup</li><li><strong>Premium:</strong> ₹1,00,000–₹1,60,000 for battery backup</li></ul><p>If you currently have a separate home inverter + battery for backup (₹15,000–₹30,000), a hybrid solar system <strong>replaces both your solar and backup setup</strong> in one unit — often making the total cost comparable.</p>"
    },
    {
      "heading": "Get 5kW Solar Quotes",
      "body": "<p>A 5kW system is a significant investment. Compare quotes from verified installers who will design the optimal panel layout, inverter sizing, and wiring for your roof and consumption pattern.</p><p><a href=\"/in/get-quotes/\">Get your free 5kW solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 5kW solar system in India?",
      "answer": "A 5kW on-grid system costs ₹2,50,000–₹3,20,000 before subsidy. After PM Surya Ghar subsidy of ₹78,000 (capped at 3kW), your net cost is ₹1,72,000–₹2,42,000. Includes panels, inverter, mounting, installation, and net metering."
    },
    {
      "question": "How many units does a 5kW solar system generate?",
      "answer": "A 5kW system generates 20–25 units per day, or 600–750 units per month. Annual output is 7,300–9,125 units, offsetting ₹43,800–₹91,250 in electricity costs depending on your tariff."
    },
    {
      "question": "Can a 5kW system run 2 ACs?",
      "answer": "Running 2 ACs simultaneously (2–2.5kW combined) would consume most of the system capacity, leaving little for other loads. A 5kW system comfortably runs 1 AC for 6–8 hours daily with full household loads. For 2 ACs, a 10kW system is recommended."
    },
    {
      "question": "How many panels are needed for 5kW?",
      "answer": "With 540W panels, you need 10 panels (10 × 540W = 5,400W). This requires approximately 500 sq ft of shadow-free roof space. Higher-wattage 580–600W panels can reduce count to 9."
    },
    {
      "question": "Is 5kW solar worth it over 3kW?",
      "answer": "Yes, if your monthly bill exceeds ₹3,500. The extra ₹1,00,000–₹1,30,000 over 3kW generates 8–10 additional units/day, saving ₹1,500–₹3,000 more per month. Payback on the incremental cost is 3–5 years, after which the extra savings are pure profit."
    },
    {
      "question": "What is the payback period for a 5kW system?",
      "answer": "3–6 years depending on your electricity tariff. At ₹7/unit, payback is about 4 years. Homes in high-tariff metros (₹8–₹12/unit) see payback in under 3 years. After payback, you save ₹40,000–₹90,000 annually for the remaining system life."
    }
  ]',
  updated_at = NOW()
WHERE slug = '5kw-system' AND pillar_slug = 'rooftop-solar';


-- 5. CLUSTER: 10kw-system
UPDATE seo_pages SET
  h1 = '10kW Solar System: Price, Output & Setup Guide for Large Homes India (2026)',
  meta_title = '10kW Solar System Price India 2026: Villas, Offices & Large Homes | Solar Vipani',
  meta_description = '10kW solar system costs ₹5,00,000–₹6,50,000 before subsidy. Generates 40–50 units/day. Ideal for large villas, home offices, EV charging, and small businesses.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A 10kW solar system costs <strong>₹5,00,000–₹6,50,000 before subsidy</strong> and <strong>₹4,22,000–₹5,72,000 after PM Surya Ghar subsidy</strong> of ₹78,000. It generates 40–50 units per day — designed for <strong>large villas, bungalows, home offices, and small commercial establishments</strong> with monthly bills of ₹6,000–₹15,000+. Requires ~1,000 sq ft of roof space and is the largest size commonly installed for residential use.</p>"
    },
    {
      "heading": "10kW Solar System Price Breakdown",
      "body": "<table><thead><tr><th>Component</th><th>Cost Range</th></tr></thead><tbody><tr><td>Solar panels (19 × 540W mono)</td><td>₹1,60,000–₹2,10,000</td></tr><tr><td><a href=\"/in/rooftop-solar/on-grid-inverter/\">On-grid inverter</a> (10kW)</td><td>₹55,000–₹80,000</td></tr><tr><td>Mounting structure</td><td>₹25,000–₹40,000</td></tr><tr><td>Wiring, protection, earthing</td><td>₹15,000–₹22,000</td></tr><tr><td>Installation labour</td><td>₹15,000–₹22,000</td></tr><tr><td>Net metering & DISCOM fees</td><td>₹5,000–₹10,000</td></tr><tr><td>GST (13.8%)</td><td>₹50,000–₹65,000</td></tr><tr><td><strong>Total (before subsidy)</strong></td><td><strong>₹5,00,000–₹6,50,000</strong></td></tr><tr><td>PM Surya Ghar subsidy</td><td>−₹78,000</td></tr><tr><td><strong>Net cost (after subsidy)</strong></td><td><strong>₹4,22,000–₹5,72,000</strong></td></tr></tbody></table><p>At 10kW, the per-watt cost drops to ₹50–₹65/W (vs ₹55–₹75/W for smaller systems) due to bulk panel pricing and shared installation labour. The ₹78,000 subsidy covers only 12–15% of total cost at this size.</p><p><a href=\"/in/rooftop-solar/cost/\">Full cost comparison →</a></p>"
    },
    {
      "heading": "Daily and Monthly Output",
      "body": "<table><thead><tr><th>Period</th><th>Output</th><th>Bill Savings (at ₹6–₹10/unit)</th></tr></thead><tbody><tr><td>Per day</td><td>40–50 units</td><td>₹240–₹500</td></tr><tr><td>Per month</td><td>1,200–1,500 units</td><td>₹7,200–₹15,000</td></tr><tr><td>Per year</td><td>14,600–18,250 units</td><td>₹87,600–₹1,82,500</td></tr></tbody></table><p>At 1,200–1,500 units/month, a 10kW system can <strong>eliminate electricity bills entirely</strong> for most households. Homes with very high consumption may still have a small residual bill.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your exact savings</a></p>"
    },
    {
      "heading": "What Can a 10kW System Run?",
      "body": "<p>10kW handles the heaviest residential loads without compromise:</p><table><thead><tr><th>Appliance</th><th>Wattage</th><th>Hours/day</th><th>Daily Units</th></tr></thead><tbody><tr><td>LED lights (15–20)</td><td>150W</td><td>6</td><td>0.9</td></tr><tr><td>Ceiling fans (6–8)</td><td>420W</td><td>10</td><td>4.2</td></tr><tr><td>Double-door refrigerator</td><td>250W</td><td>8</td><td>2.0</td></tr><tr><td>Inverter AC 1.5T × 2</td><td>2,400W</td><td>6</td><td>14.4</td></tr><tr><td>Geyser</td><td>3,000W</td><td>0.5</td><td>1.5</td></tr><tr><td>Washing machine + dryer</td><td>1,500W</td><td>1</td><td>1.5</td></tr><tr><td>Home office (PC, monitors, printer)</td><td>400W</td><td>8</td><td>3.2</td></tr><tr><td>TV (65\") + sound system</td><td>200W</td><td>4</td><td>0.8</td></tr><tr><td>EV charger (3.3kW Level 2)</td><td>3,300W</td><td>2</td><td>6.6</td></tr><tr><td><strong>Total</strong></td><td></td><td></td><td><strong>35.1 units</strong></td></tr></tbody></table><p>Even with 2 ACs, EV charging, and full home office — 5–15 units of daily surplus flow to the grid through net metering.</p>"
    },
    {
      "heading": "Space and Installation",
      "body": "<ul><li><strong>Panels:</strong> 19 × 540W monocrystalline panels (or 17 × 600W for reduced count)</li><li><strong>Roof area:</strong> ~1,000 sq ft (shadow-free, includes row spacing)</li><li><strong>Weight:</strong> ~400–500 kg total — a structural assessment is recommended for older buildings</li><li><strong>Installation time:</strong> 2–3 days</li><li><strong>Electrical:</strong> May require a dedicated distribution board and 3-phase connection (check with installer)</li></ul><p>1,000 sq ft is available on most villa and bungalow terraces. For smaller roofs, consider splitting across multiple roof faces or using higher-wattage panels to reduce total count.</p>"
    },
    {
      "heading": "Subsidy and Payback Period",
      "body": "<p>The ₹78,000 subsidy is a smaller fraction of cost at 10kW (~14%), but the <strong>absolute annual savings are substantial</strong>:</p><table><thead><tr><th>Tariff</th><th>Net Cost</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>₹5/unit</td><td>₹4,97,000</td><td>₹75,000</td><td>~6.6 years</td></tr><tr><td>₹7/unit</td><td>₹4,97,000</td><td>₹1,05,000</td><td>~4.7 years</td></tr><tr><td>₹10/unit</td><td>₹4,97,000</td><td>₹1,50,000</td><td>~3.3 years</td></tr></tbody></table><p>Metro residents in the highest tariff slabs (₹10–₹14/unit for 500+ units) see the fastest returns — often under 3.5 years. Over 25 years, a 10kW system saves ₹20,00,000–₹45,00,000.</p>"
    },
    {
      "heading": "Use Cases Beyond Residential",
      "body": "<p>10kW straddles the residential-commercial boundary. Common use cases:</p><ul><li><strong>Large villas and farmhouses</strong> — Multiple ACs, pool pumps, landscaping lights, and full home automation</li><li><strong>Home offices and studios</strong> — Designers, architects, content creators with heavy equipment loads</li><li><strong>EV owners</strong> — A 10kW system generates enough surplus to charge an EV daily (adds 25–35 km of range per day from solar alone)</li><li><strong>Small shops and clinics</strong> — Doctor''s clinics, retail shops, and small restaurants with daytime-heavy consumption</li><li><strong>Dual-use homes</strong> — Ground-floor shop + upper-floor residence</li></ul><p>For larger commercial installations (15kW–100kW+), see <a href=\"/in/rooftop-solar/commercial/\">commercial rooftop solar</a>.</p>"
    },
    {
      "heading": "10kW vs 5kW: When to Go Bigger",
      "body": "<table><thead><tr><th></th><th><a href=\"/in/rooftop-solar/5kw-system/\">5kW</a></th><th><strong>10kW</strong></th></tr></thead><tbody><tr><td>Cost after subsidy</td><td>₹1.72L–₹2.42L</td><td>₹4.22L–₹5.72L</td></tr><tr><td>Daily output</td><td>20–25 units</td><td>40–50 units</td></tr><tr><td>ACs supported</td><td>1 (6–8 hrs)</td><td>2+ (6–8 hrs)</td></tr><tr><td>EV charging</td><td>Limited</td><td>Yes, daily</td></tr><tr><td>Bill range</td><td>₹3.5K–₹6K</td><td>₹6K–₹15K+</td></tr><tr><td>Roof space</td><td>500 sq ft</td><td>1,000 sq ft</td></tr></tbody></table><p><strong>Go 10kW if:</strong> Your bill exceeds ₹6,000/month, you run 2+ ACs, you charge an EV at home, or you have a home-based business. The doubling in output justifies the doubling in cost through higher-slab tariff savings.</p>"
    },
    {
      "heading": "Get 10kW Solar Quotes",
      "body": "<p>A 10kW system requires expert design — panel string configuration, inverter sizing, structural assessment, and potentially 3-phase electrical work. Solar Vipani connects you with experienced installers who handle large residential projects end to end.</p><p><a href=\"/in/get-quotes/\">Get your free 10kW solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the price of a 10kW solar system in India?",
      "answer": "A 10kW on-grid system costs ₹5,00,000–₹6,50,000 before subsidy. After PM Surya Ghar subsidy of ₹78,000, your net cost is ₹4,22,000–₹5,72,000. Per-watt cost is lower at this size (₹50–₹65/W) due to bulk pricing."
    },
    {
      "question": "How many units does a 10kW solar system generate per month?",
      "answer": "A 10kW system generates 1,200–1,500 units per month (40–50 units/day). This is enough to offset monthly bills of ₹7,200–₹15,000, effectively eliminating electricity costs for most large homes."
    },
    {
      "question": "Can a 10kW system run 2 ACs and charge an EV?",
      "answer": "Yes. Two 1.5-ton ACs running 6 hours consume ~14 units. A Level 2 EV charger for 2 hours adds ~6.6 units. Combined with other household loads (15–17 units), total is ~38 units — within the 40–50 unit daily output."
    },
    {
      "question": "How much roof space does a 10kW system need?",
      "answer": "Approximately 1,000 sq ft of shadow-free roof space for 19 standard 540W panels with inter-row spacing. Using higher-wattage panels (580–600W) can reduce this to ~900 sq ft. A structural assessment is recommended for older buildings."
    },
    {
      "question": "Do I need a 3-phase connection for 10kW?",
      "answer": "Most DISCOMs require a 3-phase connection for systems above 5kW. If you currently have single-phase, your installer can apply for a 3-phase upgrade. This involves DISCOM paperwork and may take 2–4 weeks. The cost is ₹2,000–₹5,000 in most states."
    },
    {
      "question": "Is 10kW too big for residential use?",
      "answer": "Not if your consumption matches. Homes with monthly bills of ₹6,000+ (large villas, 2+ ACs, EV, home office) fully utilise 10kW output. Oversizing wastes money since net metering export rates are lower than import tariffs in many states. Size your system to match 90–100% of your annual consumption."
    }
  ]',
  updated_at = NOW()
WHERE slug = '10kw-system' AND pillar_slug = 'rooftop-solar';

COMMIT;
