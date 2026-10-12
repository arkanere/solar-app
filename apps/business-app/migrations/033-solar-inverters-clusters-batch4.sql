-- Solar Inverters Clusters Batch 4: sizing, for-home, for-commercial
-- Run: psql $POSTGRES_URL < 033-solar-inverters-clusters-batch4.sql

BEGIN;

-- 1. CLUSTER: sizing
UPDATE seo_pages SET
  h1 = 'Solar Inverter Sizing: How to Choose the Right Capacity for Your System',
  meta_title = 'Solar Inverter Sizing Guide: Calculate the Right Size India 2026 | Solar Vipani',
  meta_description = 'Learn how to size your solar inverter correctly. Match inverter capacity to panel array, understand MPPT ranges, and avoid common sizing mistakes. Simple guide.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Your solar inverter capacity should be <strong>100–120% of your total solar panel capacity</strong>. For a 3kW panel array, choose a 3kW–3.6kW inverter. Undersizing loses generation; oversizing wastes money. Beyond capacity matching, you must check MPPT voltage range, phase compatibility, and your DISCOM''s sanctioned load limit. Getting the sizing right is critical — it directly affects system output, safety, and warranty validity.</p>"
    },
    {
      "heading": "Step 1: Match Inverter Capacity to Panel Array",
      "body": "<p>The most important sizing rule: your inverter capacity should closely match your total panel wattage.</p><table><thead><tr><th>Panel Array</th><th>Recommended Inverter</th><th>Why</th></tr></thead><tbody><tr><td>1kW (1,000W)</td><td>1kW–1.2kW</td><td>Handles peak output comfortably</td></tr><tr><td>2kW (2,000W)</td><td>2kW–2.4kW</td><td>Standard residential range</td></tr><tr><td>3kW (3,000W)</td><td>3kW–3.6kW</td><td>Most popular home system size</td></tr><tr><td>5kW (5,000W)</td><td>5kW–6kW</td><td>Large home or high AC usage</td></tr><tr><td>10kW (10,000W)</td><td>10kW–12kW</td><td>Villa or small commercial</td></tr></tbody></table><p><strong>Can you undersize?</strong> Some installers use a slightly smaller inverter (e.g., 2.5kW inverter for 3kW panels) to save cost. This works if panels rarely hit peak output, but you lose generation during peak hours. Most inverter manufacturers void the warranty if the panel-to-inverter ratio exceeds 1.3:1.</p><p><strong>Should you oversize?</strong> A 10–20% oversize provides headroom for peak conditions. Going beyond 20% wastes money — the extra capacity sits unused.</p>"
    },
    {
      "heading": "Step 2: Check MPPT Voltage Range",
      "body": "<p>Every inverter has an MPPT (Maximum Power Point Tracking) input voltage range — typically 80V–550V for residential inverters. Your solar panel string voltage must fall within this range.</p><p><strong>How to calculate string voltage:</strong></p><ul><li>Find your panel''s Voc (open circuit voltage) — typically 38–50V for a 540W panel</li><li>Multiply by the number of panels in the string: e.g., 8 panels × 45V = 360V</li><li>Adjust for temperature: In cold weather, voltage rises by 5–10%. In hot weather (common in India), it drops by 5–15%</li><li>The adjusted range must stay within the inverter''s MPPT window</li></ul><p><strong>What happens if you get it wrong?</strong></p><ul><li>String voltage below MPPT minimum → inverter won''t start, zero generation</li><li>String voltage above maximum input voltage → inverter damage, warranty void</li></ul><p>Most inverters have 1–2 MPPT inputs. If your panels face different directions (e.g., east and west), use an inverter with 2 MPPT inputs — one per orientation — for optimal tracking.</p>"
    },
    {
      "heading": "Step 3: Single-Phase vs Three-Phase",
      "body": "<p>Your electrical connection type determines which inverter you can install:</p><table><thead><tr><th>Connection Type</th><th>Inverter Options</th><th>Typical Capacity</th></tr></thead><tbody><tr><td>Single-phase (230V)</td><td>Single-phase inverter only</td><td>Up to 5kW</td></tr><tr><td>Three-phase (415V)</td><td>Single-phase or three-phase</td><td>Up to 50kW+</td></tr></tbody></table><p><strong>Key rules:</strong></p><ul><li>Most Indian homes have single-phase connections — use a single-phase inverter up to 5kW</li><li>Systems above 5kW typically require three-phase connection and inverter</li><li>Some DISCOMs mandate three-phase inverters for systems above 3kW — check with your local DISCOM</li><li>Three-phase inverters distribute load evenly across phases, reducing grid imbalance</li></ul><p>If you have a three-phase connection and a system under 5kW, you can still use a single-phase inverter — but some DISCOMs may require three-phase for net metering approval.</p>"
    },
    {
      "heading": "Step 4: Account for DISCOM Limits",
      "body": "<p>Indian DISCOMs impose limits on the solar system size you can install under net metering:</p><ul><li><strong>Sanctioned load limit</strong> — Most DISCOMs cap solar capacity at your sanctioned load. If your sanctioned load is 3kW, your inverter cannot exceed 3kW.</li><li><strong>Connected load limit</strong> — Some DISCOMs use connected load as the cap. This is typically higher than sanctioned load.</li><li><strong>Maximum cap</strong> — Many states cap residential net metering at 10kW regardless of sanctioned load.</li><li><strong>Inverter capacity = system capacity</strong> — DISCOMs treat your inverter rating as the official system size. A 5kW inverter with 6kW of panels is still classified as a 5kW system.</li></ul><p>Before purchasing, confirm your DISCOM''s rules. Your installer should handle this verification as part of the site assessment.</p>"
    },
    {
      "heading": "Sizing for Off-Grid and Hybrid Systems",
      "body": "<p><a href=\"/in/solar-inverters/off-grid-inverter/\">Off-grid</a> and <a href=\"/in/solar-inverters/hybrid-inverter/\">hybrid</a> inverter sizing follows different rules because they must handle peak load demand:</p><ul><li><strong>Inverter VA rating ≥ peak load</strong> — List every appliance that might run simultaneously. If your peak load is 2,500W, choose at least a 3kVA inverter (with 20% margin).</li><li><strong>Surge handling</strong> — Appliances with motors (fridge, pump, washing machine) draw 2–3x their rated power at startup. The inverter must handle this surge. A 3kVA inverter with 6kVA surge rating handles most residential startups.</li><li><strong>Battery bank matching</strong> — The inverter''s DC input voltage must match the battery bank voltage (12V, 24V, or 48V). Higher voltage banks are more efficient for larger systems.</li><li><strong>Charge controller capacity</strong> — If the inverter includes a built-in solar charge controller, ensure its capacity matches your panel array. External MPPT controllers offer more flexibility.</li></ul><p>Off-grid sizing is more conservative than on-grid — oversizing by 20–30% is recommended to handle unexpected loads and cloudy days.</p>"
    },
    {
      "heading": "Common Sizing Mistakes to Avoid",
      "body": "<p>These sizing errors reduce output, damage equipment, or void warranties:</p><ul><li><strong>Ignoring temperature effects</strong> — Panel voltage rises in cold weather. If your string voltage at low temperature exceeds the inverter''s max input, the inverter can be damaged. Use your panel''s temperature coefficient to calculate winter voltage.</li><li><strong>Mixing panel types in a string</strong> — Panels with different wattages or Vmp in the same string force the entire string to the weakest panel''s current. Use identical panels per string.</li><li><strong>Forgetting about future expansion</strong> — If you plan to add panels later, size the inverter for the final array. Adding panels beyond the inverter''s capacity wastes the additional panels'' output.</li><li><strong>Ignoring ambient temperature derating</strong> — Inverters derate (reduce output) in high ambient temperatures. In hot Indian summers (45°C+), a 5kW inverter may only deliver 4–4.5kW. Ensure your inverter can handle your region''s peak temperatures.</li></ul>"
    },
    {
      "heading": "Get Professional Sizing for Your System",
      "body": "<p>While these guidelines help you understand sizing principles, professional system design accounts for your specific roof, panels, local climate, and DISCOM rules. Solar Vipani connects you with verified installers who design optimised systems matched to your needs.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What size inverter do I need for a 3kW solar system?",
      "answer": "For a 3kW panel array, choose a 3kW–3.6kW inverter. This provides enough headroom for peak generation. A 3kW inverter works well if your panels rarely exceed rated output; a 3.6kW gives more margin. Your installer will match the exact size based on panel specifications and DISCOM limits."
    },
    {
      "question": "Can I use a bigger inverter than my solar panel capacity?",
      "answer": "Yes, but it is not cost-effective. An oversized inverter (e.g., 5kW inverter for 3kW panels) works fine technically — it will simply never reach full capacity. You pay more for unused capacity. Keep the inverter within 100–120% of panel capacity for optimal value."
    },
    {
      "question": "What happens if my inverter is too small for my panels?",
      "answer": "The inverter will clip (limit) power output during peak generation hours, wasting potential energy. A small amount of clipping (5–10%) is acceptable, but significant undersizing loses meaningful generation. Most inverter warranties are voided if the panel-to-inverter ratio exceeds 1.3:1."
    },
    {
      "question": "How do I know if I need a single-phase or three-phase inverter?",
      "answer": "Check your electricity meter and connection. Most Indian homes have single-phase (230V) connections — use a single-phase inverter for systems up to 5kW. If you have a three-phase (415V) connection and a system above 5kW, use a three-phase inverter. Some DISCOMs mandate three-phase for systems above 3kW."
    },
    {
      "question": "Does my DISCOM limit the inverter size I can install?",
      "answer": "Yes. Most DISCOMs cap the solar system size at your sanctioned load for net metering. If your sanctioned load is 5kW, your inverter cannot exceed 5kW. Some states cap residential net metering at 10kW. Your installer will verify DISCOM limits during the site assessment."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'sizing' AND pillar_slug = 'solar-inverters';


-- 2. CLUSTER: for-home
UPDATE seo_pages SET
  h1 = 'Best Solar Inverters for Home in India: How to Choose in 2026',
  meta_title = 'Best Solar Inverter for Home India 2026: Types, Price & Brands | Solar Vipani',
  meta_description = 'Choose the best solar inverter for your home. Compare on-grid, hybrid, and off-grid options. Price guide from ₹8,000. Real recommendations from verified installers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The best solar inverter for most Indian homes is an <strong>on-grid string inverter</strong> in the 3kW–5kW range, costing <strong>₹15,000–₹50,000</strong>. It qualifies for the full PM Surya Ghar subsidy, works with net metering to slash your electricity bill, and has the fastest payback period. If you face frequent power cuts, a <a href=\"/in/solar-inverters/hybrid-inverter/\">hybrid inverter</a> adds battery backup for ₹20,000–₹30,000 more.</p>"
    },
    {
      "heading": "Which Inverter Type Is Right for Your Home?",
      "body": "<p>Your choice depends on two factors: grid reliability and budget.</p><table><thead><tr><th>Your Situation</th><th>Best Inverter Type</th><th>Why</th></tr></thead><tbody><tr><td>Reliable grid (22+ hrs/day)</td><td><a href=\"/in/solar-inverters/on-grid-inverter/\">On-Grid</a></td><td>Lowest cost, full subsidy, maximum savings</td></tr><tr><td>Frequent power cuts (2+ hrs/day)</td><td><a href=\"/in/solar-inverters/hybrid-inverter/\">Hybrid</a></td><td>Grid savings + battery backup during cuts</td></tr><tr><td>No grid connection</td><td><a href=\"/in/solar-inverters/off-grid-inverter/\">Off-Grid</a></td><td>Complete independence with battery storage</td></tr><tr><td>Shaded or complex roof</td><td>Micro-Inverter</td><td>Panel-level optimisation, no shading losses</td></tr></tbody></table><p><strong>80% of Indian homeowners</strong> choose on-grid inverters because most urban and semi-urban areas have 22+ hours of reliable grid supply. The savings from net metering far outweigh the occasional inconvenience of no power during rare outages.</p>"
    },
    {
      "heading": "Best Solar Inverters for Home by Budget",
      "body": "<p>Here are the most popular inverter choices across budget ranges for typical Indian homes:</p><table><thead><tr><th>Budget</th><th>System Size</th><th>Recommended Inverter</th><th>Price</th></tr></thead><tbody><tr><td>Economy</td><td>1–2kW</td><td>Solis Mini 1–2kW (on-grid)</td><td>₹8,000–₹22,000</td></tr><tr><td>Mid-range</td><td>3kW</td><td>Growatt MIC 3kW (on-grid)</td><td>₹18,000–₹30,000</td></tr><tr><td>Mid-range + backup</td><td>3kW</td><td>Goodwe ES 3kW (hybrid)</td><td>₹38,000–₹50,000</td></tr><tr><td>Premium</td><td>5kW</td><td>Fronius Primo 5kW (on-grid)</td><td>₹40,000–₹55,000</td></tr><tr><td>Premium + backup</td><td>5kW</td><td>Growatt SPH 5kW (hybrid)</td><td>₹55,000–₹75,000</td></tr></tbody></table><p>For most homes, the mid-range on-grid option (Growatt MIC 3kW or similar) offers the best balance of price, performance, and reliability.</p><p><a href=\"/in/solar-inverters/price/\">Complete price comparison across all brands →</a></p>"
    },
    {
      "heading": "How to Size an Inverter for Your Home",
      "body": "<p>Your inverter size depends on your electricity consumption and roof capacity:</p><ul><li><strong>Monthly bill under ₹1,500</strong> → 1kW–2kW system and inverter</li><li><strong>Monthly bill ₹1,500–₹3,000</strong> → 2kW–3kW system and inverter</li><li><strong>Monthly bill ₹3,000–₹5,000</strong> → 3kW–5kW system and inverter</li><li><strong>Monthly bill above ₹5,000</strong> → 5kW–10kW system and inverter</li></ul><p>The inverter capacity should match or slightly exceed your panel array. For a 3kW panel array, a 3kW or 3.6kW inverter is ideal.</p><p>Your DISCOM limits the maximum system size to your sanctioned load — verify this before purchasing. Most urban homes have 3kW–5kW sanctioned load.</p><p><a href=\"/in/solar-inverters/sizing/\">Detailed inverter sizing guide →</a></p>"
    },
    {
      "heading": "Top Inverter Brands for Indian Homes",
      "body": "<p>These brands are recommended by verified installers across our network for residential use:</p><ul><li><strong>Growatt</strong> — Best value on-grid and hybrid inverters. MIC series (on-grid) and SPH series (hybrid) dominate the residential segment. Free ShinePhone monitoring app.</li><li><strong>Solis</strong> — Excellent compact on-grid inverters. The S6 Mini is popular for smaller systems. Built-in Wi-Fi and Solis Cloud monitoring.</li><li><strong>Goodwe</strong> — Strong hybrid inverter range. GW-ES series offers seamless grid-battery switching. Good after-sales in India.</li><li><strong>Havells</strong> — Indian brand with nationwide service network. Enviro Solar on-grid inverters offer peace of mind for after-sales support.</li><li><strong>Fronius</strong> — Premium Austrian brand. Primo series is the gold standard for efficiency (98.1%). Higher price but exceptional build quality.</li></ul><p>When choosing, look beyond price — compare warranty terms (5 vs 10 years), monitoring app quality, and the brand''s local service presence in your city.</p>"
    },
    {
      "heading": "Key Features to Look For",
      "body": "<p>When comparing inverters for home use, prioritise these features:</p><ul><li><strong>Conversion efficiency</strong> — 96%+ is standard; 97%+ is good. Even 1% difference compounds over 25 years of generation.</li><li><strong>MPPT inputs</strong> — 1 MPPT is fine for single-orientation roofs. Get 2 MPPT if panels face different directions.</li><li><strong>Wi-Fi monitoring</strong> — Essential for tracking daily generation and catching faults early. Most modern inverters include this.</li><li><strong>IP65 rating</strong> — Weather-resistant for outdoor or semi-outdoor installation. Standard on quality inverters.</li><li><strong>Warranty</strong> — 5 years is basic, 10 years is good. Some brands offer 15–25 year warranties on premium models.</li><li><strong>Noise level</strong> — Under 30 dB is quiet enough for indoor/balcony mounting. Fan-cooled inverters are louder than fanless designs.</li></ul>"
    },
    {
      "heading": "Installation Tips for Home Inverters",
      "body": "<p>Proper installation extends inverter life and ensures safety:</p><ul><li><strong>Location</strong> — Mount on a shaded, ventilated wall near your main distribution board. Avoid direct sun and rain exposure.</li><li><strong>Ventilation</strong> — Leave 30 cm clearance on all sides for airflow. Inverters generate heat and derate in poorly ventilated spaces.</li><li><strong>Cable routing</strong> — DC cables from panels should be as short as possible to minimise voltage drop. Use conduit for protection.</li><li><strong>Earthing</strong> — Dedicated earth connection is mandatory for safety. Your installer must connect the inverter to an independent earth pit.</li></ul><p>A professional installer handles all of this. DIY inverter installation is not recommended and may void both the inverter warranty and DISCOM net metering approval.</p>"
    },
    {
      "heading": "Get the Right Inverter for Your Home",
      "body": "<p>The inverter is the brain of your solar system — a bad choice affects output for 10–15 years. Solar Vipani connects you with verified installers who will assess your home, recommend the optimal inverter type and brand, and provide competitive quotes.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes from verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which solar inverter brand is best for home use in India?",
      "answer": "Growatt and Solis are the most popular residential brands, offering good performance at competitive prices. Havells is preferred by those wanting strong Indian after-sales support. Fronius and ABB are premium choices for maximum efficiency and durability. The best brand depends on your budget, system size, and service availability in your city."
    },
    {
      "question": "How much does a solar inverter cost for a home?",
      "answer": "On-grid inverters for homes cost ₹8,000–₹55,000 depending on capacity. A 3kW on-grid inverter costs ₹15,000–₹35,000. Hybrid inverters (with battery support) cost 40–80% more. The inverter is typically 20–25% of total system cost."
    },
    {
      "question": "Should I buy an on-grid or hybrid inverter for my home?",
      "answer": "Choose on-grid if your area has reliable power (22+ hours daily) — it costs less, qualifies for full subsidy, and gives the best ROI. Choose hybrid if you face frequent power cuts (2+ hours daily) and need uninterrupted power for work-from-home or medical equipment."
    },
    {
      "question": "Can I use a normal inverter for solar panels?",
      "answer": "No. A regular home UPS inverter is not designed for solar input. Solar inverters have MPPT tracking, grid synchronisation, and safety features specific to solar systems. Using a regular inverter with solar panels is unsafe and will not work for net metering."
    },
    {
      "question": "How long does a home solar inverter last?",
      "answer": "Home solar inverters last 10–15 years. Since solar panels last 25+ years, you will likely replace the inverter once during the system''s lifetime. Budget ₹15,000–₹50,000 for the replacement. Choosing a brand with a 10-year warranty reduces this risk."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-home' AND pillar_slug = 'solar-inverters';


-- 3. CLUSTER: for-commercial
UPDATE seo_pages SET
  h1 = 'Commercial Solar Inverters in India: Types, Sizing & Best Brands',
  meta_title = 'Commercial Solar Inverter: Price, Sizing & Brands India 2026 | Solar Vipani',
  meta_description = 'Commercial solar inverters for 10kW–500kW systems. Compare string vs central inverters, get pricing, and understand sizing for factories, offices, and warehouses.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Commercial solar inverters serve businesses with system sizes from <strong>10kW to 500kW+</strong> — factories, offices, warehouses, hotels, and shopping complexes. They cost <strong>₹45,000–₹25,00,000</strong> depending on capacity and technology. Commercial systems use either high-capacity <a href=\"/in/solar-inverters/string-inverter/\">string inverters</a> (10kW–100kW) or central inverters (100kW–500kW+). The choice depends on roof layout, shading conditions, and budget.</p>"
    },
    {
      "heading": "Commercial vs Residential Solar Inverters",
      "body": "<p>Commercial inverters differ from residential units in several important ways:</p><table><thead><tr><th>Feature</th><th>Residential</th><th>Commercial</th></tr></thead><tbody><tr><td>Typical capacity</td><td>1kW–10kW</td><td>10kW–500kW+</td></tr><tr><td>Phase</td><td>Single-phase</td><td>Three-phase</td></tr><tr><td>Inverter type</td><td>Single string inverter</td><td>Multiple string or central</td></tr><tr><td>Monitoring</td><td>Basic app monitoring</td><td>Advanced SCADA/fleet management</td></tr><tr><td>Warranty</td><td>5–10 years</td><td>5–15 years (with SLA)</td></tr><tr><td>Maintenance</td><td>Annual checkup</td><td>Quarterly with AMC</td></tr><tr><td>Grid connection</td><td>Single-phase net metering</td><td>Three-phase HT/LT metering</td></tr></tbody></table><p>Commercial systems also have different regulatory requirements — DISCOM approvals, HT metering, and open access provisions for systems above 100kW.</p>"
    },
    {
      "heading": "Types of Commercial Solar Inverters",
      "body": "<p>Three inverter architectures are used in commercial installations:</p><p><strong>1. Three-Phase String Inverters (10kW–100kW)</strong></p><ul><li>Multiple string inverters distributed across the array</li><li>Each inverter handles a section of panels independently</li><li>Best for rooftops with multiple orientations, partial shading, or phased expansion</li><li>If one inverter fails, only that section goes down — the rest continue generating</li></ul><p><strong>2. Central Inverters (100kW–500kW+)</strong></p><ul><li>Single large inverter for the entire array</li><li>Lower cost per watt for very large systems</li><li>Requires uniform panel layout and minimal shading</li><li>Single point of failure — if it goes down, the entire system stops</li></ul><p><strong>3. Micro-Inverters (for shaded commercial roofs)</strong></p><ul><li>One small inverter per panel</li><li>Eliminates shading impact — each panel operates independently</li><li>Higher cost but justified for complex roofs with HVAC units, parapet shadows, or multiple roof angles</li><li><a href=\"/in/solar-inverters/micro-inverter/\">Micro-inverter guide →</a></li></ul>"
    },
    {
      "heading": "Commercial Inverter Pricing",
      "body": "<p>Commercial inverter prices by capacity (on-grid, three-phase):</p><table><thead><tr><th>Capacity</th><th>Inverter Type</th><th>Price Range</th><th>Cost per kW</th></tr></thead><tbody><tr><td>10kW</td><td>String</td><td>₹45,000–₹90,000</td><td>₹4,500–₹9,000</td></tr><tr><td>25kW</td><td>String</td><td>₹90,000–₹1,80,000</td><td>₹3,600–₹7,200</td></tr><tr><td>50kW</td><td>String</td><td>₹1,50,000–₹3,50,000</td><td>₹3,000–₹7,000</td></tr><tr><td>100kW</td><td>String or Central</td><td>₹3,00,000–₹7,00,000</td><td>₹3,000–₹7,000</td></tr><tr><td>250kW</td><td>Central</td><td>₹7,00,000–₹15,00,000</td><td>₹2,800–₹6,000</td></tr><tr><td>500kW</td><td>Central</td><td>₹12,00,000–₹25,00,000</td><td>₹2,400–₹5,000</td></tr></tbody></table><p>Cost per kW decreases as system size increases — this economy of scale makes commercial solar increasingly attractive for businesses with high electricity consumption.</p><p><a href=\"/in/solar-inverters/price/\">All inverter prices →</a></p>"
    },
    {
      "heading": "Top Commercial Inverter Brands in India",
      "body": "<p>Leading brands for commercial solar installations in India:</p><ul><li><strong>Sungrow</strong> — China''s largest inverter manufacturer. SG series (25kW–250kW) dominates the Indian commercial segment with excellent price-to-performance ratio.</li><li><strong>Huawei</strong> — SUN2000 series. Known for smart string technology with AI-based fault detection. Strong in the 10kW–100kW range.</li><li><strong>ABB / FIMER</strong> — PVS series. European engineering with proven long-term reliability. Preferred for premium commercial projects.</li><li><strong>Fronius</strong> — Symo and Tauro series. Highest efficiency (98.1%+) and excellent build quality. Austrian brand with Indian support.</li><li><strong>Growatt</strong> — MAX series (25kW–80kW). Competitive pricing with adequate performance for budget-conscious commercial projects.</li><li><strong>Delta</strong> — M-Series (15kW–100kW). Taiwanese quality with strong Indian service network.</li></ul><p>For commercial installations, prioritise brands with Indian service centres, spare part availability, and SLA-based AMC (Annual Maintenance Contract) options.</p>"
    },
    {
      "heading": "Sizing Commercial Solar Inverters",
      "body": "<p>Commercial inverter sizing involves additional considerations beyond residential systems:</p><ul><li><strong>Load profile analysis</strong> — Map your electricity consumption by hour. Peak demand determines minimum inverter capacity. Off-peak consumption determines optimal system size for maximum self-consumption.</li><li><strong>Sanctioned load and contract demand</strong> — Your inverter capacity cannot exceed your sanctioned/contract demand without DISCOM approval for enhancement.</li><li><strong>String design</strong> — With larger arrays, string design (number of panels per string × number of strings per MPPT) becomes critical. Professional system design software (PVsyst, HelioScope) is essential.</li><li><strong>Redundancy</strong> — For mission-critical facilities, using multiple smaller string inverters instead of one large central inverter ensures partial generation continues even if one unit fails.</li><li><strong>Future expansion</strong> — If phased expansion is planned, choose string inverters and design wiring to accommodate additional units.</li></ul><p><a href=\"/in/solar-inverters/sizing/\">Detailed sizing guide →</a></p>"
    },
    {
      "heading": "Commercial Solar Benefits and ROI",
      "body": "<p>Commercial solar delivers faster ROI than residential due to higher tariffs and accelerated depreciation:</p><ul><li><strong>Electricity savings</strong> — Commercial tariffs (₹8–₹14/unit) are higher than residential, accelerating payback to 3–5 years.</li><li><strong>Accelerated depreciation</strong> — Businesses can claim 40% depreciation on solar assets in the first year, significantly reducing tax liability.</li><li><strong>Green certification</strong> — Solar installations help achieve IGBC, LEED, or GRIHA green building ratings.</li><li><strong>Demand charge reduction</strong> — Solar reduces peak grid draw, potentially lowering demand charges on your commercial electricity bill.</li><li><strong>Carbon credits</strong> — Large commercial installations can generate tradeable carbon credits under India''s carbon market framework.</li></ul><p>A 100kW commercial system costing ₹50–₹60 lakh typically saves ₹10–₹15 lakh annually in electricity costs, achieving payback in 3.5–5 years.</p>"
    },
    {
      "heading": "Get Commercial Solar Quotes",
      "body": "<p>Commercial solar projects require professional system design, structural assessment, and DISCOM liaison. Solar Vipani connects businesses with verified commercial solar installers who specialise in 10kW–500kW rooftop and ground-mount installations.</p><p><a href=\"/in/get-quotes/\">Get free commercial solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What size solar inverter does a commercial building need?",
      "answer": "It depends on your monthly electricity consumption and available roof space. A factory using 10,000 units/month typically needs a 50kW–100kW system. An office using 3,000 units/month needs 15kW–25kW. Your installer will analyse your load profile and design the optimal system size within your sanctioned load limit."
    },
    {
      "question": "Is string or central inverter better for commercial solar?",
      "answer": "String inverters are better for most commercial rooftops — they handle shading, multiple orientations, and allow phased expansion. Central inverters are more cost-effective for large ground-mount or uniform rooftop arrays above 100kW. String inverters also offer redundancy since one failure does not shut down the entire system."
    },
    {
      "question": "What is the payback period for commercial solar in India?",
      "answer": "Commercial solar typically pays back in 3–5 years thanks to higher commercial tariffs (₹8–₹14/unit) and 40% accelerated depreciation tax benefit. After payback, the system generates essentially free electricity for 20+ more years. ROI improves further with rising tariffs."
    },
    {
      "question": "Do commercial solar systems qualify for government subsidy?",
      "answer": "The PM Surya Ghar subsidy is for residential consumers only. However, commercial systems benefit from accelerated depreciation (40% in year one), GST input credit, and some state-level industrial incentives. These tax benefits often provide more value than a direct subsidy for businesses."
    },
    {
      "question": "What maintenance does a commercial solar inverter need?",
      "answer": "Commercial inverters need quarterly inspection of connections, cooling systems, and performance data. Most commercial installations include an AMC (Annual Maintenance Contract) costing 1–2% of system cost per year. The AMC covers preventive maintenance, fault diagnosis, and parts replacement."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-commercial' AND pillar_slug = 'solar-inverters';

COMMIT;
