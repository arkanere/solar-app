-- Solar Pumps remaining clusters: types, ac-pump, dc-pump, for-agriculture, sizing, maintenance
-- Skipping kusum-scheme (duplicate of existing kusum-yojana)
-- Run: psql $POSTGRES_URL < src/lib/server/migrations/031-solar-pumps-remaining-clusters.sql

BEGIN;

-- 1. CLUSTER: types
UPDATE seo_pages SET
  h1 = 'Types of Solar Water Pumps in India: Complete Classification Guide',
  meta_title = 'Types of Solar Water Pumps: Submersible, Surface, AC, DC & BLDC | Solar Vipani',
  meta_description = 'Solar pumps classified by mounting (submersible vs surface), motor (AC vs DC vs BLDC), and application. Compare all types with pricing and use cases for Indian conditions.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p><a href=\"/in/solar-pumps/\">Solar water pumps</a> are classified three ways: <strong>by mounting</strong> (<a href=\"/in/solar-pumps/submersible/\">submersible</a> vs <a href=\"/in/solar-pumps/surface/\">surface</a>), <strong>by motor technology</strong> (<a href=\"/in/solar-pumps/ac-pump/\">AC induction</a> vs <a href=\"/in/solar-pumps/dc-pump/\">DC</a> vs <a href=\"/in/solar-pumps/bldc/\">BLDC</a>), and <strong>by application</strong> (borewell, irrigation, domestic). The right type depends on your water source (borewell depth or open well), daily water requirement, and budget. Submersible AC pumps dominate Indian agriculture for borewells; BLDC pumps lead the small-farm and home segment.</p>"
    },
    {
      "heading": "Classification by Mounting Type",
      "body": "<p>The first decision is where the pump sits — inside the water source or above it.</p><table><thead><tr><th>Type</th><th>Installation</th><th>Water Source</th><th>Max Depth</th><th>HP Range</th></tr></thead><tbody><tr><td><strong><a href=\"/in/solar-pumps/submersible/\">Submersible</a></strong></td><td>Inside borewell/well</td><td>Borewells, deep tube wells</td><td>300+ feet</td><td>1–10 HP</td></tr><tr><td><strong><a href=\"/in/solar-pumps/surface/\">Surface</a></strong></td><td>Above ground near water</td><td>Open wells, ponds, canals, rivers</td><td>15–20 feet suction</td><td>0.5–5 HP</td></tr></tbody></table><p><strong>Submersible pumps</strong> are the most common in Indian agriculture because borewells are the primary water source in most regions. The pump motor is sealed and cooled by surrounding water, making it reliable even in extreme heat.</p><p><strong>Surface pumps</strong> are simpler, cheaper, and easier to maintain since the motor is accessible above ground. Choose surface pumps when your water source is an open well, farm pond, canal, or river with water level within 15–20 feet of the pump.</p><p><strong>Rule of thumb:</strong> If your water comes from a borewell → submersible. If from an open well or surface water → surface pump.</p>"
    },
    {
      "heading": "Classification by Motor Technology",
      "body": "<p>The motor determines efficiency, cost, and serviceability:</p><table><thead><tr><th>Motor Type</th><th>How It Works</th><th>Efficiency</th><th>HP Range</th><th>Price Range</th></tr></thead><tbody><tr><td><strong><a href=\"/in/solar-pumps/ac-pump/\">AC Induction</a></strong></td><td>Solar DC → VFD converts to 3-phase AC → standard AC motor</td><td>70–85%</td><td>1–10 HP</td><td>₹60,000–₹4,50,000</td></tr><tr><td><strong><a href=\"/in/solar-pumps/dc-pump/\">DC</a></strong></td><td>Solar DC → controller → DC brushed motor</td><td>75–85%</td><td>0.5–3 HP</td><td>₹25,000–₹1,50,000</td></tr><tr><td><strong><a href=\"/in/solar-pumps/bldc/\">BLDC</a></strong></td><td>Solar DC → controller → brushless DC motor</td><td>85–95%</td><td>0.5–5 HP</td><td>₹40,000–₹2,00,000</td></tr></tbody></table><p><strong>AC pumps</strong> use widely available standard motors that any local electrician can service. The VFD (<a href=\"/in/solar-pumps/controller/\">controller</a>) adds cost but enables the pump to work across a wide voltage range as sunlight varies.</p><p><strong>DC brushed pumps</strong> are the simplest and cheapest but have lower efficiency and shorter motor life (brushes wear out after 3–5 years).</p><p><strong>BLDC pumps</strong> are the most efficient — they extract more water per watt of solar power. No brushes means longer motor life (10+ years). They dominate the 1–3 HP segment and are rapidly gaining share.</p>"
    },
    {
      "heading": "AC vs DC vs BLDC: Which Should You Choose?",
      "body": "<p>A direct comparison for decision-making:</p><table><thead><tr><th>Factor</th><th>AC</th><th>DC Brushed</th><th>BLDC</th></tr></thead><tbody><tr><td>Best HP range</td><td>3–10 HP</td><td>0.5–2 HP</td><td>1–5 HP</td></tr><tr><td>Efficiency</td><td>70–85%</td><td>75–85%</td><td>85–95%</td></tr><tr><td>Low-light performance</td><td>Moderate (VFD helps)</td><td>Good</td><td>Excellent</td></tr><tr><td>Motor lifespan</td><td>15–20 years</td><td>3–5 years (brush replacement)</td><td>10–15 years</td></tr><tr><td>Serviceability</td><td>Easy (standard motors)</td><td>Easy</td><td>Requires trained technician</td></tr><tr><td>Spare parts</td><td>Widely available</td><td>Widely available</td><td>Brand-specific</td></tr><tr><td>KUSUM eligible</td><td>Yes</td><td>Yes</td><td>Yes</td></tr></tbody></table><p><strong>Choose AC</strong> for 5+ HP systems, deep borewells, and areas where motor servicing is readily available. <strong>Choose BLDC</strong> for 1–3 HP systems where efficiency and low-light performance matter — it pumps more water from fewer panels. <strong>Choose DC brushed</strong> only for ultra-low-budget small systems.</p><p><a href=\"/in/solar-pumps/ac-pump/\">AC pump guide →</a> · <a href=\"/in/solar-pumps/dc-pump/\">DC pump guide →</a> · <a href=\"/in/solar-pumps/bldc/\">BLDC pump guide →</a></p>"
    },
    {
      "heading": "Classification by Application",
      "body": "<p>Solar pumps serve three broad application categories:</p><p><strong>1. Agricultural irrigation</strong></p><ul><li>Largest segment — borewells, open wells, canal lift</li><li>HP range: 2–10 HP for most Indian farms</li><li>Submersible for borewells, surface for canal/pond lift</li><li><a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> subsidy available (up to 60%)</li><li><a href=\"/in/solar-pumps/for-agriculture/\">Full agriculture pump guide →</a></li></ul><p><strong>2. Domestic water supply</strong></p><ul><li>Overhead tank filling, garden watering, rainwater harvesting</li><li>HP range: 0.5–2 HP</li><li>Surface or small submersible pumps</li><li><a href=\"/in/solar-pumps/for-home/\">Home pump guide →</a></li></ul><p><strong>3. Livestock and dairy</strong></p><ul><li>Water troughs, dairy parlour cleaning, pasture irrigation</li><li>HP range: 1–5 HP</li><li>Often combined with storage tanks for continuous water access</li></ul>"
    },
    {
      "heading": "How to Choose the Right Type",
      "body": "<p>Follow this decision tree:</p><ol><li><strong>What is your water source?</strong><ul><li>Borewell → Submersible pump</li><li>Open well / pond / canal → Surface pump</li></ul></li><li><strong>What is the depth/head?</strong><ul><li>Under 100 feet → 1–3 HP sufficient</li><li>100–200 feet → 3–5 HP</li><li>200–300+ feet → 5–10 HP</li></ul></li><li><strong>What HP do you need?</strong><ul><li>1–3 HP → BLDC is most efficient</li><li>5–10 HP → AC induction is the standard</li></ul></li><li><strong>Budget constraint?</strong><ul><li>Tight budget → DC brushed (cheapest) or AC (standard)</li><li>Best value over time → BLDC (highest efficiency, lowest running cost)</li></ul></li></ol><p>A site survey by a qualified dealer — measuring borewell depth, water level, delivery distance, and daily water requirement — gives the most accurate recommendation.</p><p><a href=\"/in/solar-pumps/sizing/\">Detailed sizing guide →</a></p>"
    },
    {
      "heading": "Get Expert Help Choosing Your Solar Pump",
      "body": "<p>The right pump type depends on your specific water source, depth, acreage, and crop water requirements. Solar Vipani connects you with verified pump dealers who conduct on-site surveys and recommend the optimal pump type and size for your conditions.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What are the main types of solar water pumps?",
      "answer": "Solar pumps are classified by mounting (submersible for borewells, surface for open wells) and motor (AC induction, DC brushed, BLDC). Submersible AC pumps dominate for deep borewells (5–10 HP). BLDC pumps lead in efficiency for smaller systems (1–3 HP). Surface pumps work for open wells and ponds with water within 15–20 feet."
    },
    {
      "question": "Which is better — submersible or surface solar pump?",
      "answer": "Submersible pumps are better for borewells and deep wells (30–300+ feet). Surface pumps suit open wells, ponds, and canals where water is within 15–20 feet of the pump. In India, borewells are the primary agricultural water source, making submersible pumps the more common choice."
    },
    {
      "question": "What is a BLDC solar pump?",
      "answer": "BLDC (Brushless DC) pumps use permanent magnet motors that run directly on DC power from solar panels without needing an AC inverter. They are 85–95% efficient — the highest among solar pump types. They perform well in low-light conditions and have 10–15 year motor life with no brush replacements. Best for 1–5 HP applications."
    },
    {
      "question": "Can I use a regular AC pump with solar panels?",
      "answer": "Not directly. Standard AC pumps need a Variable Frequency Drive (VFD) controller to convert solar DC power to 3-phase AC. Purpose-built solar AC pump systems include this controller. Retrofitting an existing AC pump with a solar VFD is possible but less efficient than a purpose-designed solar pump system."
    },
    {
      "question": "Which type of solar pump is best for agriculture?",
      "answer": "For Indian agriculture: submersible AC pumps (5–10 HP) for deep borewells; BLDC submersible pumps (1–3 HP) for shallow borewells; surface pumps for canal lift and pond irrigation. All types qualify for KUSUM Yojana subsidy. A site survey determines the best type based on your borewell depth and water requirement."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'types' AND pillar_slug = 'solar-pumps';


-- 2. CLUSTER: ac-pump
UPDATE seo_pages SET
  h1 = 'AC Solar Water Pumps in India: How They Work, Pricing & Best Models',
  meta_title = 'AC Solar Water Pump India: Price, Working & Comparison with DC | Solar Vipani',
  meta_description = 'AC solar pumps use VFD controllers to power standard 3-phase motors from solar panels. Pricing from ₹60,000–₹4,50,000, available in 1–10 HP. KUSUM subsidy eligible.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>AC solar water pumps use a <strong>Variable Frequency Drive (VFD)</strong> to convert solar DC power into 3-phase AC, driving a <strong>standard induction motor</strong>. They are available in <strong>1–10 HP</strong>, cost <strong>₹60,000–₹4,50,000</strong> before subsidy, and are the default choice for <strong>5+ HP applications</strong> and deep borewells. The key advantage: standard AC motors are widely available, easy to service, and replaceable by any local electrician — critical for rural India where specialised technicians are scarce.</p>"
    },
    {
      "heading": "How AC Solar Pumps Work",
      "body": "<p>An AC solar pump system has three stages:</p><ol><li><strong>Solar panels generate DC power:</strong> The panel array size matches the pump''s HP rating — a 5 HP pump needs 6–7.5 kW of panels.</li><li><strong><a href=\"/in/solar-pumps/controller/\">VFD controller</a> converts DC to 3-phase AC:</strong> The VFD (also called a solar pump inverter or drive) is the brain of the system. It converts variable DC input from the panels into stable 3-phase AC at the right frequency for the motor. As sunlight varies through the day, the VFD adjusts motor speed to match available power — the pump runs slower in low light and faster in full sun.</li><li><strong>Standard AC motor drives the pump:</strong> A standard squirrel-cage induction motor powers the pump impellers. These motors are identical to grid-powered pump motors — the only difference is the VFD power source.</li></ol><p>This architecture means if the motor fails after 15–20 years, you replace it with any standard AC motor of the same rating — no proprietary parts needed.</p>"
    },
    {
      "heading": "AC Solar Pump Pricing",
      "body": "<table><thead><tr><th>HP Rating</th><th>Panel Array</th><th>Price (before subsidy)</th><th>After KUSUM (~60%)</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>1.2–1.5 kW</td><td>₹60,000–₹90,000</td><td>₹24,000–₹36,000</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>2.4–3.0 kW</td><td>₹1,00,000–₹1,40,000</td><td>₹40,000–₹56,000</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>3.6–4.5 kW</td><td>₹1,40,000–₹1,80,000</td><td>₹56,000–₹72,000</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>6.0–7.5 kW</td><td>₹2,00,000–₹2,80,000</td><td>₹80,000–₹1,12,000</td></tr><tr><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>9.0–11 kW</td><td>₹2,80,000–₹3,60,000</td><td>₹1,12,000–₹1,44,000</td></tr><tr><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>12–15 kW</td><td>₹3,50,000–₹4,50,000</td><td>₹1,40,000–₹1,80,000</td></tr></tbody></table><p>AC pumps cost 10–20% less than equivalent BLDC pumps at the same HP rating because induction motors are cheaper to manufacture. However, they require more solar panels for the same water output due to lower efficiency.</p><p><a href=\"/in/solar-pumps/price/\">Detailed pricing guide →</a></p>"
    },
    {
      "heading": "AC vs DC Solar Pumps: When to Choose AC",
      "body": "<p><strong>Choose AC solar pumps when:</strong></p><ul><li><strong>HP requirement is 5 or higher:</strong> AC induction motors scale better to high power ratings. Most 7.5 HP and 10 HP solar pumps are AC.</li><li><strong>Deep borewells (200+ feet):</strong> High-head submersible pumps in the 5–10 HP range are predominantly AC. <a href=\"/in/solar-pumps/borewell/\">Borewell pump guide →</a></li><li><strong>Serviceability matters:</strong> Standard AC motors can be rewound, repaired, or replaced by any local motor shop. Critical advantage in remote rural locations.</li><li><strong>Future grid connection possible:</strong> AC pumps can run on grid power with a simple changeover switch, giving you dual-source flexibility.</li><li><strong>Cost is a priority at higher HP:</strong> AC pump systems cost less than BLDC above 3 HP.</li></ul><p><strong>Choose <a href=\"/in/solar-pumps/dc-pump/\">DC</a> or <a href=\"/in/solar-pumps/bldc/\">BLDC</a> when:</strong></p><ul><li>HP requirement is 1–3 (BLDC is more efficient at small scale)</li><li>Low-light performance is critical (cloudy regions, early morning pumping)</li><li>You want maximum water output per panel watt</li></ul>"
    },
    {
      "heading": "Key Components of an AC Solar Pump System",
      "body": "<p>A complete AC solar pump installation includes:</p><ul><li><strong>Solar panel array:</strong> Sized at 1.2–1.5× the motor HP in kW (e.g., 5 HP pump needs 6–7.5 kW panels). Monocrystalline panels are standard.</li><li><strong>VFD/solar pump controller:</strong> Converts DC to 3-phase AC. Includes MPPT (Maximum Power Point Tracking) to extract maximum power from panels as conditions change. Also provides dry-run protection, over-voltage protection, and motor overload protection.</li><li><strong>AC induction motor:</strong> Standard 3-phase squirrel-cage motor. Rated for continuous duty. For submersible applications, oil-filled or water-filled motor designs.</li><li><strong>Pump end:</strong> Centrifugal impellers for submersible; centrifugal or jet for surface. Stainless steel construction for borewell use.</li><li><strong>Mounting structure:</strong> Ground-mounted or pole-mounted panel structure. Must be theft-resistant in agricultural settings.</li><li><strong>Cables and protection:</strong> DC cables from panels to controller, AC cables from controller to motor, earthing, and lightning arrestor.</li></ul>"
    },
    {
      "heading": "Top AC Solar Pump Brands in India",
      "body": "<table><thead><tr><th>Brand</th><th>HP Range</th><th>Strength</th></tr></thead><tbody><tr><td><strong>Shakti Pumps</strong></td><td>1–25 HP</td><td>Market leader, widest model range, KUSUM empanelled nationwide</td></tr><tr><td><strong>Kirloskar Solar</strong></td><td>1–10 HP</td><td>Trusted agricultural brand, excellent service network</td></tr><tr><td><strong>CRI Pumps</strong></td><td>1–10 HP</td><td>Strong in South India, reliable submersibles</td></tr><tr><td><strong>Lubi Solar</strong></td><td>1–10 HP</td><td>Good pricing, strong in Gujarat and Rajasthan</td></tr><tr><td><strong>Tata Power Solar</strong></td><td>1–10 HP</td><td>Premium quality, Tata brand trust</td></tr></tbody></table><p>When choosing a brand, prioritise <strong>local dealer presence</strong> and <strong>KUSUM empanelment</strong> in your state. A pump from a top brand but without local service support is less valuable than a well-supported regional brand.</p>"
    },
    {
      "heading": "Maintenance and Lifespan",
      "body": "<p>AC solar pump systems are built for Indian agricultural conditions:</p><ul><li><strong>Motor lifespan:</strong> 15–20 years for quality AC induction motors. Can be rewound 1–2 times, extending life further.</li><li><strong>VFD controller:</strong> 10–15 years. Keep in a shaded, ventilated enclosure to extend life.</li><li><strong>Solar panels:</strong> 25-year warranty, 25–30 year useful life.</li><li><strong>Annual maintenance:</strong> Panel cleaning (2–4× per year), controller inspection, motor vibration check for surface pumps. Budget ₹2,000–₹5,000/year.</li></ul><p><a href=\"/in/solar-pumps/maintenance/\">Full maintenance guide →</a></p>"
    },
    {
      "heading": "Get AC Solar Pump Quotes",
      "body": "<p>Solar Vipani connects you with verified AC solar pump dealers who conduct on-site surveys, recommend the right HP and model for your borewell, and assist with <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> applications.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is an AC solar water pump?",
      "answer": "An AC solar pump uses a VFD (Variable Frequency Drive) controller to convert DC power from solar panels into 3-phase AC to drive a standard induction motor. Available in 1–10 HP, they are the default choice for 5+ HP systems and deep borewells. Standard AC motors are easy to service and widely available across rural India."
    },
    {
      "question": "How much does an AC solar pump cost?",
      "answer": "AC solar pumps cost ₹60,000–₹4,50,000 before subsidy depending on HP (1–10 HP). Under KUSUM Yojana, farmers pay only 40% (or less in some states). A 5 HP AC solar pump system costs ₹2,00,000–₹2,80,000 before subsidy and ₹80,000–₹1,12,000 after KUSUM."
    },
    {
      "question": "Can I run my existing AC pump on solar?",
      "answer": "Yes, by adding a solar VFD controller and appropriate solar panel array. The VFD converts solar DC to 3-phase AC compatible with your existing motor. However, purpose-built solar pump systems are more efficient and reliable than retrofitted setups. Consult a dealer for feasibility."
    },
    {
      "question": "How many solar panels does an AC pump need?",
      "answer": "Rule of thumb: 1.2–1.5 kW of panels per HP. A 5 HP pump needs 6–7.5 kW (11–14 panels of 540W). A 3 HP pump needs 3.6–4.5 kW (7–8 panels). The extra panel capacity beyond the motor rating compensates for efficiency losses in the VFD controller and varying sunlight conditions."
    },
    {
      "question": "Is AC or BLDC better for solar pumps?",
      "answer": "BLDC is more efficient (85–95% vs 70–85%) and better in low light, making it ideal for 1–3 HP systems. AC is better for 5–10 HP — motors are cheaper, widely serviceable, and replaceable by any local electrician. For deep borewells (200+ feet) requiring 5+ HP, AC is the standard and practical choice."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'ac-pump' AND pillar_slug = 'solar-pumps';


-- 3. CLUSTER: dc-pump
UPDATE seo_pages SET
  h1 = 'DC Solar Water Pumps in India: Types, Pricing & Best Applications',
  meta_title = 'DC Solar Water Pump India: Price, Types & AC vs DC Comparison | Solar Vipani',
  meta_description = 'DC solar pumps run directly on solar panel power without AC conversion. Available in 0.5–5 HP from ₹25,000. Compare brushed DC vs BLDC and find the best fit.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>DC solar water pumps run directly on DC power from solar panels — no AC conversion needed. They come in two variants: <strong>brushed DC</strong> (cheapest, 0.5–2 HP, ₹25,000–₹1,20,000) and <strong><a href=\"/in/solar-pumps/bldc/\">BLDC</a> (brushless DC)</strong> (most efficient, 0.5–5 HP, ₹40,000–₹2,00,000). DC pumps are ideal for <strong>small farms, homes, and livestock</strong> where 1–3 HP is sufficient. Their higher efficiency means they pump more water from fewer <a href=\"/in/solar-panels/\">solar panels</a> than equivalent <a href=\"/in/solar-pumps/ac-pump/\">AC pumps</a>.</p>"
    },
    {
      "heading": "How DC Solar Pumps Work",
      "body": "<p>DC solar pumps eliminate the DC-to-AC conversion step that AC pumps require, resulting in a simpler and more efficient system:</p><ol><li><strong>Solar panels generate DC power</strong> — directly compatible with the DC motor</li><li><strong>DC controller regulates voltage and current</strong> — includes MPPT (Maximum Power Point Tracking) to optimise power extraction from panels, plus protections for dry-run, over-voltage, and reverse polarity</li><li><strong>DC motor drives the pump</strong> — either brushed (mechanical commutation) or brushless/BLDC (electronic commutation)</li></ol><p>Without the VFD conversion stage, DC pumps lose 5–10% less energy in the power chain. This means a DC pump needs <strong>15–25% fewer solar panels</strong> than an AC pump to deliver the same daily water output — a significant cost saving on the panel array.</p>"
    },
    {
      "heading": "Brushed DC vs BLDC Pumps",
      "body": "<table><thead><tr><th>Factor</th><th>Brushed DC</th><th>BLDC (Brushless DC)</th></tr></thead><tbody><tr><td>Motor mechanism</td><td>Mechanical carbon brushes</td><td>Electronic commutation (no brushes)</td></tr><tr><td>Efficiency</td><td>75–85%</td><td>85–95%</td></tr><tr><td>Motor lifespan</td><td>3–5 years (brush replacement needed)</td><td>10–15 years</td></tr><tr><td>HP range</td><td>0.5–3 HP</td><td>0.5–5 HP</td></tr><tr><td>Price</td><td>₹25,000–₹1,20,000</td><td>₹40,000–₹2,00,000</td></tr><tr><td>Low-light performance</td><td>Good</td><td>Excellent (starts at lower irradiance)</td></tr><tr><td>Maintenance</td><td>Brush replacement every 2–3 years</td><td>Near zero</td></tr><tr><td>Noise</td><td>Moderate (brush friction)</td><td>Very quiet</td></tr></tbody></table><p><strong>BLDC is the clear winner</strong> for any new installation where budget allows. The 10–15 year motor life vs 3–5 years for brushed DC means lower lifetime cost despite the higher upfront price. Brushed DC pumps are suitable only for ultra-tight budgets or temporary setups.</p><p><a href=\"/in/solar-pumps/bldc/\">Full BLDC pump guide →</a></p>"
    },
    {
      "heading": "DC Solar Pump Pricing",
      "body": "<table><thead><tr><th>HP Rating</th><th>Brushed DC Price</th><th>BLDC Price</th><th>Panel Array Needed</th></tr></thead><tbody><tr><td>0.5 HP</td><td>₹25,000–₹40,000</td><td>₹40,000–₹60,000</td><td>0.6–0.9 kW</td></tr><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>₹40,000–₹70,000</td><td>₹55,000–₹90,000</td><td>1.0–1.2 kW</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>₹70,000–₹1,20,000</td><td>₹90,000–₹1,40,000</td><td>2.0–2.4 kW</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>₹1,00,000–₹1,50,000</td><td>₹1,20,000–₹1,80,000</td><td>3.0–3.6 kW</td></tr><tr><td>5 HP</td><td>—</td><td>₹1,60,000–₹2,00,000</td><td>5.0–6.0 kW</td></tr></tbody></table><p>DC pumps need <strong>15–25% fewer panels</strong> than AC pumps for the same water output. For a 3 HP system, that saves 1–2 panels (₹13,000–₹26,000). Factor this panel saving into your total cost comparison.</p><p>All DC pumps qualify for <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> subsidy — farmers pay only 10–40% of the total cost.</p>"
    },
    {
      "heading": "Best Applications for DC Solar Pumps",
      "body": "<p>DC pumps excel in specific use cases:</p><ul><li><strong><a href=\"/in/solar-pumps/for-home/\">Home water supply</a>:</strong> 0.5–1 HP BLDC pumps for overhead tank filling. Quiet operation, compact panel array, zero electricity bill for water pumping.</li><li><strong>Small farms (1–4 acres):</strong> 1–3 HP BLDC submersible for shallow borewells (up to 150 feet). Maximum water output per panel, ideal for drip and sprinkler irrigation.</li><li><strong>Kitchen gardens and nurseries:</strong> 0.5–1 HP surface DC pumps for pond/well irrigation. Simple, portable setups.</li><li><strong>Livestock watering:</strong> 1–2 HP DC pumps with storage tanks. Reliable daytime pumping for cattle troughs and dairy operations.</li><li><strong>Remote locations:</strong> Areas without grid access where diesel was the only option. DC pumps'' higher efficiency means smaller, cheaper panel arrays — easier to transport and install in remote fields.</li></ul>"
    },
    {
      "heading": "Limitations of DC Solar Pumps",
      "body": "<p>Know the boundaries before choosing DC:</p><ul><li><strong>HP ceiling:</strong> Practical limit is 5 HP for BLDC, 3 HP for brushed DC. For 7.5–10 HP requirements, <a href=\"/in/solar-pumps/ac-pump/\">AC pumps</a> are the only option.</li><li><strong>Deep borewell limitation:</strong> For borewells deeper than 200 feet requiring high-head pumps, AC submersibles dominate. DC submersibles in this range are limited in model availability.</li><li><strong>Spare parts for BLDC:</strong> BLDC motors use brand-specific electronic controllers. Unlike AC motors that any electrician can rewind, a failed BLDC motor requires the dealer or manufacturer for service.</li><li><strong>Brushed DC maintenance:</strong> Carbon brushes wear out every 2–3 years and need replacement. If brushes are not replaced timely, the commutator damages and the motor needs rewinding.</li></ul>"
    },
    {
      "heading": "How to Choose Between DC and AC",
      "body": "<p>Use this quick decision guide:</p><ul><li><strong>1–3 HP + budget available → BLDC</strong> (highest efficiency, lowest lifetime cost)</li><li><strong>1–3 HP + very tight budget → Brushed DC</strong> (cheapest upfront, higher maintenance)</li><li><strong>5 HP → BLDC if available in your model/head range, otherwise AC</strong></li><li><strong>7.5–10 HP → AC</strong> (only practical option at this scale)</li><li><strong>Need grid backup option → AC</strong> (can switch to grid power easily)</li></ul><p>Your local pump dealer can recommend the optimal type after assessing your borewell depth, water table, delivery head, and daily requirement.</p>"
    },
    {
      "heading": "Get DC Solar Pump Quotes",
      "body": "<p>Solar Vipani connects you with verified dealers who stock DC and BLDC pump systems from leading brands. Get a site survey, sizing recommendation, and KUSUM application support — all from one enquiry.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the difference between DC and AC solar pumps?",
      "answer": "DC pumps run directly on solar panel DC power with a simple controller. AC pumps need a VFD to convert DC to 3-phase AC. DC pumps are 10–15% more efficient and need fewer panels for the same output. AC pumps are better for high-HP applications (5–10 HP) and offer easier motor serviceability."
    },
    {
      "question": "How long do DC solar pump motors last?",
      "answer": "BLDC motors last 10–15 years with virtually no maintenance. Brushed DC motors last 3–5 years before brushes need replacement; with timely brush changes, the motor can last 8–10 years. BLDC is the better long-term investment despite higher upfront cost."
    },
    {
      "question": "What HP DC solar pump do I need for my farm?",
      "answer": "For small farms (1–2 acres) with shallow borewells, 1 HP is sufficient. Medium farms (2–4 acres) need 2 HP. Farms of 4–6 acres need 3 HP. Above 6 acres or for deep borewells (200+ feet), consider 5 HP BLDC or switch to AC. A site survey gives the most accurate recommendation based on head and flow requirements."
    },
    {
      "question": "Can DC solar pumps work on cloudy days?",
      "answer": "Yes, and they perform better than AC pumps in low-light conditions. BLDC pumps can start at irradiance levels as low as 200–300 W/m², while AC pumps typically need 400+ W/m². This means BLDC pumps start earlier in the morning and pump longer into the evening, extracting more water on partly cloudy days."
    },
    {
      "question": "Are DC solar pumps eligible for KUSUM subsidy?",
      "answer": "Yes. Both brushed DC and BLDC solar pumps qualify for KUSUM Yojana Component B subsidy (up to 60% — 30% central + 30% state). The pump must be purchased from an MNRE-empanelled vendor and installed through the official application process."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'dc-pump' AND pillar_slug = 'solar-pumps';


-- 4. CLUSTER: for-agriculture
UPDATE seo_pages SET
  h1 = 'Solar Pumps for Agriculture in India: Farmer''s Complete Guide',
  meta_title = 'Solar Pumps for Agriculture India: Sizing, Pricing & KUSUM Guide | Solar Vipani',
  meta_description = 'Solar pumps for Indian agriculture — choose the right HP for your farm, get up to 60% KUSUM subsidy, and eliminate diesel costs. Guide covers 1–10 HP systems.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar pumps have become the most cost-effective irrigation solution for Indian farmers. A <a href=\"/in/solar-pumps/3hp/\">3 HP system</a> irrigates 4–6 acres, costs ₹1,40,000–₹1,80,000 before subsidy, and under <a href=\"/in/solar-pumps/kusum-yojana/\">KUSUM Yojana</a> the farmer pays just <strong>₹14,000–₹72,000</strong> (10–40% depending on state). With <strong>zero fuel costs and 25-year panel life</strong>, solar pumps eliminate the ₹30,000–₹80,000 that farmers spend annually on diesel — making it the single highest-ROI investment available to Indian agriculture.</p>"
    },
    {
      "heading": "Why Farmers Are Switching to Solar Pumps",
      "body": "<p>The economics are overwhelming:</p><table><thead><tr><th>Factor</th><th>Diesel Pump</th><th>Grid Electric Pump</th><th>Solar Pump</th></tr></thead><tbody><tr><td>Fuel/electricity cost</td><td>₹30,000–₹80,000/year</td><td>₹10,000–₹30,000/year (if available)</td><td>₹0/year</td></tr><tr><td>Availability</td><td>Always (if diesel available)</td><td>4–8 hours/day (rationed)</td><td>6–8 hours/day (sunlight)</td></tr><tr><td>Upfront cost</td><td>₹15,000–₹50,000</td><td>₹10,000–₹40,000 + connection</td><td>₹14,000–₹1,80,000 (after KUSUM)</td></tr><tr><td>Pollution</td><td>High (noise + emissions)</td><td>None locally</td><td>None</td></tr><tr><td>Maintenance</td><td>High (engine servicing)</td><td>Low</td><td>Very low (panel cleaning)</td></tr><tr><td>Lifespan</td><td>5–8 years</td><td>10–15 years</td><td>25+ years (panels)</td></tr></tbody></table><p>A farmer spending ₹50,000/year on diesel recovers the cost of a KUSUM-subsidised solar pump in <strong>1–2 years</strong>. Over 25 years, the savings exceed <strong>₹12,00,000</strong>.</p>"
    },
    {
      "heading": "Choosing the Right HP for Your Farm",
      "body": "<p>Three factors determine the HP you need: <strong>acreage</strong>, <strong>borewell depth</strong>, and <strong>crop water requirement</strong>.</p><table><thead><tr><th>Farm Size</th><th>Borewell Depth</th><th>Recommended HP</th><th>Daily Water Output</th></tr></thead><tbody><tr><td>1–2 acres</td><td>Up to 100 ft</td><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>40,000–60,000 litres</td></tr><tr><td>2–4 acres</td><td>Up to 150 ft</td><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>80,000–1,20,000 litres</td></tr><tr><td>4–6 acres</td><td>Up to 200 ft</td><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>1,20,000–1,80,000 litres</td></tr><tr><td>6–10 acres</td><td>Up to 250 ft</td><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>2,00,000–3,00,000 litres</td></tr><tr><td>10–15 acres</td><td>Up to 300 ft</td><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>3,00,000–4,50,000 litres</td></tr><tr><td>15+ acres / community</td><td>300+ ft</td><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>4,00,000–6,00,000 litres</td></tr></tbody></table><p><strong>Important:</strong> Borewell depth (total dynamic head) matters more than acreage alone. A shallow borewell at 80 feet needs less HP than a deep one at 250 feet even for the same farm size. Always get a dealer to measure your actual head before ordering.</p><p><a href=\"/in/solar-pumps/sizing/\">Detailed sizing guide →</a></p>"
    },
    {
      "heading": "KUSUM Yojana: Up to 90% Subsidy for Farmers",
      "body": "<p>The <a href=\"/in/solar-pumps/kusum-yojana/\">PM-KUSUM scheme</a> (Component B) is the primary subsidy for standalone solar pumps:</p><ul><li><strong>Central subsidy:</strong> 30% of benchmark cost</li><li><strong>State subsidy:</strong> 30% (varies by state — some states contribute more)</li><li><strong>Farmer''s share:</strong> 40% of benchmark cost</li></ul><p>In some states, the farmer''s share drops further:</p><table><thead><tr><th>State</th><th>Farmer''s Share</th><th>3 HP Pump Cost to Farmer</th></tr></thead><tbody><tr><td>Rajasthan</td><td>40%</td><td>~₹64,000</td></tr><tr><td>Maharashtra</td><td>10% (additional state top-up)</td><td>~₹16,000</td></tr><tr><td>Madhya Pradesh</td><td>10%</td><td>~₹16,000</td></tr><tr><td>Gujarat</td><td>40%</td><td>~₹64,000</td></tr><tr><td>Uttar Pradesh</td><td>40%</td><td>~₹64,000</td></tr></tbody></table><p><strong>Eligibility:</strong> All farmers with agricultural land and an irrigation water source (borewell, open well, canal). Small and marginal farmers get priority. Apply through your state agriculture/energy department or the national KUSUM portal.</p>"
    },
    {
      "heading": "Best Pump Type by Crop and Irrigation Method",
      "body": "<p>Match your pump to your irrigation system for maximum efficiency:</p><table><thead><tr><th>Irrigation Method</th><th>Flow Needed</th><th>Pressure Needed</th><th>Best Pump Type</th></tr></thead><tbody><tr><td>Flood irrigation (rice, wheat)</td><td>High</td><td>Low</td><td>Surface pump or low-head submersible</td></tr><tr><td>Drip irrigation (vegetables, fruits)</td><td>Low</td><td>High (2–4 bar)</td><td>Submersible with pressure controller</td></tr><tr><td>Sprinkler (pulses, oilseeds)</td><td>Medium</td><td>Medium-High</td><td>Submersible or surface with booster</td></tr><tr><td>Micro-sprinkler (orchards)</td><td>Low</td><td>Medium</td><td>Small submersible or BLDC surface</td></tr></tbody></table><p><strong>Drip + solar is the best combination</strong> for water-scarce regions. Drip irrigation uses 30–50% less water than flood irrigation, meaning a smaller (cheaper) solar pump can irrigate the same acreage. Many states offer combined subsidies for drip systems and solar pumps.</p><p><a href=\"/in/solar-pumps/irrigation/\">Irrigation pump guide →</a></p>"
    },
    {
      "heading": "Solar Pump with Water Storage",
      "body": "<p>Since solar pumps operate only during daylight, water storage is essential for evening and night irrigation:</p><ul><li><strong>Overhead tank:</strong> Concrete or plastic tanks elevated 10–15 feet above ground. Gravity-fed irrigation after sunset. Most practical for <a href=\"/in/solar-pumps/for-home/\">home use</a> and small farms.</li><li><strong>Farm pond:</strong> Lined or unlined ponds holding 50,000–5,00,000+ litres. Pump fills the pond during the day; pond water is used for irrigation anytime. Government subsidy available under MGNREGA in many states.</li><li><strong>Elevated tank on pillars:</strong> Steel or concrete tanks for gravity-fed drip systems. Common in commercial horticulture.</li></ul><p>A farm pond is the most cost-effective storage for agriculture — it buffers 2–3 days of water, protecting against consecutive cloudy days.</p>"
    },
    {
      "heading": "Common Mistakes Farmers Make",
      "body": "<p>Avoid these pitfalls when buying a solar pump:</p><ul><li><strong>Oversizing the pump:</strong> A 5 HP pump for a 2-acre farm wastes money. Match HP to actual head and water requirement, not aspiration.</li><li><strong>Ignoring total dynamic head:</strong> The borewell depth alone is not the full picture. Add delivery pipe length and vertical rise to the storage tank. Underestimating head results in poor water output.</li><li><strong>Buying non-KUSUM-empanelled brands:</strong> Only MNRE-empanelled vendors qualify for subsidy. Buying from non-empanelled dealers means paying full price.</li><li><strong>Skipping the site survey:</strong> A ₹500 site survey prevents a ₹50,000 sizing mistake. Always insist on a dealer visit before ordering.</li><li><strong>Neglecting panel security:</strong> Solar panels in agricultural fields are theft targets. Budget for fencing or elevated pole-mounted structures.</li></ul>"
    },
    {
      "heading": "Get the Right Pump for Your Farm",
      "body": "<p>Solar Vipani connects you with KUSUM-empanelled dealers who conduct on-site surveys, measure your borewell parameters, and recommend the optimal pump for your farm. We also assist with the KUSUM application process.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What size solar pump do I need for 5 acres?",
      "answer": "For 5 acres with a borewell up to 200 feet deep, a 3 HP solar pump is typically sufficient. For deeper borewells (200–250 feet) or water-intensive crops like rice, a 5 HP pump is recommended. The exact sizing depends on your total dynamic head, crop type, and irrigation method. A dealer site survey gives the most accurate recommendation."
    },
    {
      "question": "How much subsidy can farmers get on solar pumps?",
      "answer": "Under KUSUM Yojana, the combined central (30%) and state (30%) subsidy covers up to 60% of the cost. Some states like Maharashtra and Madhya Pradesh offer additional top-up, reducing the farmer''s share to just 10%. A 3 HP pump worth ₹1,60,000 can cost as little as ₹16,000 in such states."
    },
    {
      "question": "Can solar pumps work for rice paddy irrigation?",
      "answer": "Yes. Rice requires flood irrigation with high water volumes. A 5–10 HP submersible pump with adequate borewell yield can support rice cultivation. Pair it with a farm pond to store water during peak sunlight and release it for flooding as needed. A 5 HP pump delivers 2–3 lakh litres per day."
    },
    {
      "question": "How much diesel cost does a solar pump save per year?",
      "answer": "Indian farmers typically spend ₹30,000–₹80,000 per year on diesel for irrigation pumps. A solar pump eliminates this entirely — running on free sunlight with near-zero maintenance cost (₹2,000–₹5,000/year for cleaning). Over 25 years, diesel savings alone can exceed ₹12,00,000."
    },
    {
      "question": "Do I need batteries with a solar pump for my farm?",
      "answer": "No. Agricultural solar pumps operate during daylight hours without batteries. Store pumped water in a farm pond or overhead tank for use after sunset. Batteries add 30–50% to system cost, reduce efficiency, and need replacement every 5–7 years — far less economical than water storage."
    },
    {
      "question": "Can I use solar pump surplus power for my home?",
      "answer": "Under KUSUM Component C, farmers with grid-connected pumps can sell surplus solar power to the DISCOM. For standalone solar pumps (Component B), the system is dedicated to pumping. However, some farmers add a small separate solar system for home electricity using the PM Surya Ghar scheme."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'for-agriculture' AND pillar_slug = 'solar-pumps';


-- 5. CLUSTER: sizing
UPDATE seo_pages SET
  h1 = 'Solar Pump Sizing Guide: How to Choose the Right HP for Your Needs',
  meta_title = 'Solar Pump Sizing Guide India: Calculate HP, Panels & Flow Rate | Solar Vipani',
  meta_description = 'Size your solar pump correctly — calculate HP from borewell depth, daily water needs, and head. Covers 1–10 HP with sizing tables and formulas for Indian conditions.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar pump sizing depends on three factors: <strong>total dynamic head</strong> (borewell depth + delivery height + pipe friction), <strong>daily water requirement</strong> (litres per day), and <strong>peak sun hours</strong> (4.5–5.5 in most of India). The formula: <em>HP = (Flow rate × Total head) ÷ (75 × efficiency × 3600)</em>. For most Indian farms, <a href=\"/in/solar-pumps/3hp/\">3 HP</a> covers 4–6 acres, <a href=\"/in/solar-pumps/5hp/\">5 HP</a> covers 6–10 acres. Always get a <strong>dealer site survey</strong> — a ₹500 measurement prevents a ₹50,000 sizing mistake.</p>"
    },
    {
      "heading": "Step 1: Determine Your Total Dynamic Head (TDH)",
      "body": "<p>Total Dynamic Head is the total vertical distance the pump must push water, plus friction losses. It is the single most important sizing parameter.</p><p><strong>TDH = Static water level + Drawdown + Delivery height + Friction loss</strong></p><ul><li><strong>Static water level:</strong> Distance from ground to the water surface in your borewell/well when the pump is off. Measure during summer (lowest water table) for worst-case sizing.</li><li><strong>Drawdown:</strong> How much the water level drops when the pump runs. Typically 5–30 feet depending on borewell yield.</li><li><strong>Delivery height:</strong> Vertical rise from ground level to the highest delivery point (overhead tank or field elevation).</li><li><strong>Friction loss:</strong> Resistance in pipes. Add 10–15% of total head for pipe friction, or calculate from pipe diameter and length tables.</li></ul><p><strong>Example:</strong> Static water level 120 ft + drawdown 20 ft + delivery height 15 ft + friction 15 ft = <strong>TDH = 170 feet (52 metres)</strong></p><p><strong>Critical:</strong> Measure static water level in the <strong>driest month</strong> (typically May–June). Sizing for monsoon water levels will leave you short during summer peak irrigation season.</p>"
    },
    {
      "heading": "Step 2: Calculate Daily Water Requirement",
      "body": "<p>How much water you need per day depends on your application:</p><table><thead><tr><th>Application</th><th>Daily Requirement</th><th>Basis</th></tr></thead><tbody><tr><td>Home (family of 4–6)</td><td>500–1,500 litres</td><td>Drinking, cooking, bathing, cleaning</td></tr><tr><td>Kitchen garden (0.25 acre)</td><td>2,000–5,000 litres</td><td>Drip or manual watering</td></tr><tr><td>Small farm (1–2 acres, drip)</td><td>20,000–60,000 litres</td><td>Vegetables, flowers</td></tr><tr><td>Medium farm (4–6 acres, drip)</td><td>80,000–1,80,000 litres</td><td>Mixed crops</td></tr><tr><td>Large farm (6–10 acres, flood)</td><td>2,00,000–4,00,000 litres</td><td>Rice, wheat, sugarcane</td></tr><tr><td>Livestock (50 cattle)</td><td>5,000–10,000 litres</td><td>Drinking + dairy cleaning</td></tr></tbody></table><p><strong>Tip:</strong> If you use drip irrigation, your water requirement is 30–50% less than flood irrigation for the same acreage. Sizing for drip means a smaller, cheaper pump.</p>"
    },
    {
      "heading": "Step 3: Calculate Required HP",
      "body": "<p>With TDH and daily water requirement known, calculate the HP:</p><p><strong>Quick sizing table (for 5 peak sun hours):</strong></p><table><thead><tr><th>TDH (feet)</th><th>50,000 L/day</th><th>1,00,000 L/day</th><th>2,00,000 L/day</th><th>3,00,000 L/day</th></tr></thead><tbody><tr><td>50</td><td>1 HP</td><td>1 HP</td><td>2 HP</td><td>3 HP</td></tr><tr><td>100</td><td>1 HP</td><td>2 HP</td><td>3 HP</td><td>5 HP</td></tr><tr><td>150</td><td>2 HP</td><td>3 HP</td><td>5 HP</td><td>7.5 HP</td></tr><tr><td>200</td><td>2 HP</td><td>3 HP</td><td>5 HP</td><td>7.5 HP</td></tr><tr><td>250</td><td>3 HP</td><td>5 HP</td><td>7.5 HP</td><td>10 HP</td></tr><tr><td>300</td><td>3 HP</td><td>5 HP</td><td>7.5 HP</td><td>10 HP</td></tr></tbody></table><p><strong>Engineering formula:</strong></p><p><em>Power (watts) = (Q × H × ρ × g) ÷ (η × 3600)</em></p><p>Where Q = flow rate (m³/hour), H = TDH (metres), ρ = 1000 kg/m³, g = 9.81 m/s², η = pump efficiency (0.5–0.7)</p><p><em>HP = Power (watts) ÷ 746</em></p><p>Always round up to the next available HP size. Solar output varies through the day, so the pump needs headroom to deliver target volume within 5–6 peak hours.</p>"
    },
    {
      "heading": "Step 4: Size the Solar Panel Array",
      "body": "<p>The panel array must produce enough DC power to drive the pump during peak sun hours:</p><table><thead><tr><th>Pump HP</th><th>Panel Array (DC pump/BLDC)</th><th>Panel Array (AC pump)</th><th>No. of 540W Panels</th></tr></thead><tbody><tr><td><a href=\"/in/solar-pumps/1hp/\">1 HP</a></td><td>0.9–1.2 kW</td><td>1.2–1.5 kW</td><td>2–3</td></tr><tr><td><a href=\"/in/solar-pumps/2hp/\">2 HP</a></td><td>1.8–2.4 kW</td><td>2.4–3.0 kW</td><td>4–6</td></tr><tr><td><a href=\"/in/solar-pumps/3hp/\">3 HP</a></td><td>2.7–3.6 kW</td><td>3.6–4.5 kW</td><td>5–8</td></tr><tr><td><a href=\"/in/solar-pumps/5hp/\">5 HP</a></td><td>4.5–6.0 kW</td><td>6.0–7.5 kW</td><td>9–14</td></tr><tr><td><a href=\"/in/solar-pumps/7-5hp/\">7.5 HP</a></td><td>6.8–9.0 kW</td><td>9.0–11 kW</td><td>13–20</td></tr><tr><td><a href=\"/in/solar-pumps/10hp/\">10 HP</a></td><td>9.0–12 kW</td><td>12–15 kW</td><td>17–28</td></tr></tbody></table><p><a href=\"/in/solar-pumps/dc-pump/\">DC/BLDC pumps</a> need <strong>15–25% fewer panels</strong> than <a href=\"/in/solar-pumps/ac-pump/\">AC pumps</a> because they skip the DC-to-AC conversion loss. This panel saving partially offsets the higher price of BLDC motors.</p>"
    },
    {
      "heading": "Common Sizing Mistakes",
      "body": "<p>Avoid these errors that lead to undersized or oversized systems:</p><ul><li><strong>Measuring water level during monsoon:</strong> Water tables are highest during and after monsoon. Size for summer levels — they can be 30–80 feet lower.</li><li><strong>Ignoring drawdown:</strong> When the pump runs, the water level drops. A borewell with 100 ft static level may draw down to 130 ft during pumping. Missing this means the pump runs at higher head than planned.</li><li><strong>Oversizing for ''safety margin'':</strong> A 5 HP pump on a 2-acre farm wastes ₹50,000–₹1,00,000. The pump runs below capacity, and oversized systems cost more under KUSUM too.</li><li><strong>Forgetting pipe friction:</strong> Long delivery pipes (100+ metres) add significant head. Use wider pipes (2–3 inch) to reduce friction loss.</li><li><strong>Not accounting for future needs:</strong> If you plan to expand acreage in 2–3 years, consider sizing up one HP increment — but only one, not more.</li></ul>"
    },
    {
      "heading": "When to Size Up vs Size Down",
      "body": "<p><strong>Size up (next HP) when:</strong></p><ul><li>Your TDH is near the upper limit of the current HP range</li><li>You plan to add acreage within 2–3 years</li><li>Your borewell yield is uncertain (lower yield = longer pumping hours needed)</li><li>You are in a region with fewer peak sun hours (Northeast, Kashmir)</li></ul><p><strong>Size down (save cost) when:</strong></p><ul><li>You use drip irrigation (30–50% less water needed)</li><li>Your borewell has excellent yield (high flow rate)</li><li>You are in a high-irradiance region (Rajasthan, Gujarat — 5.5+ peak sun hours)</li><li>You have water storage (farm pond) to buffer across days</li></ul>"
    },
    {
      "heading": "Get Professional Sizing for Your Needs",
      "body": "<p>Online calculators give estimates. For accurate sizing, you need a dealer to visit your site, measure your borewell parameters, and recommend the exact pump model and panel configuration. Solar Vipani connects you with verified dealers who provide free site surveys.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How do I calculate what HP solar pump I need?",
      "answer": "Determine your total dynamic head (borewell depth + drawdown + delivery height + pipe friction) and daily water requirement. Use the formula: HP = (Flow × Head) ÷ (75 × efficiency × 3600). For a quick estimate: 1 HP per 50,000 litres/day at 100 ft head. A dealer site survey gives the most accurate sizing."
    },
    {
      "question": "What is total dynamic head and why does it matter?",
      "answer": "Total Dynamic Head (TDH) is the total vertical distance the pump must push water — static water level + drawdown + delivery height + pipe friction. It is the most important sizing parameter. A pump rated for 100 ft head cannot deliver adequate water from a 150 ft TDH borewell. Always measure during summer when water tables are lowest."
    },
    {
      "question": "How many solar panels does a 5 HP pump need?",
      "answer": "A 5 HP solar pump needs 6–7.5 kW of panels for AC systems (11–14 panels of 540W) or 4.5–6 kW for DC/BLDC systems (9–11 panels). The extra capacity for AC pumps compensates for VFD conversion losses. Your dealer will specify the exact array size based on your location and pump model."
    },
    {
      "question": "Can I upgrade my solar pump HP later?",
      "answer": "Upgrading HP usually means replacing the pump, controller, and adding panels — essentially a new system. It is more cost-effective to size correctly upfront. If unsure, size up by one increment (e.g., 3 HP instead of 2 HP). The 20–30% cost difference is much less than a full replacement later."
    },
    {
      "question": "What HP solar pump do I need for a 100-foot borewell?",
      "answer": "For a 100-foot borewell with 20 ft drawdown and 10 ft delivery (TDH ~130 ft): 1 HP is sufficient for up to 50,000 litres/day (home + small garden), 2 HP for 80,000–1,00,000 litres (2–3 acres), 3 HP for 1,20,000–1,50,000 litres (4–5 acres). Actual sizing depends on delivery distance and irrigation method."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'sizing' AND pillar_slug = 'solar-pumps';


-- 6. CLUSTER: maintenance
UPDATE seo_pages SET
  h1 = 'Solar Pump Maintenance in India: Keep Your System Running Efficiently',
  meta_title = 'Solar Pump Maintenance Guide: Schedule, Costs & Troubleshooting | Solar Vipani',
  meta_description = 'Solar pumps need minimal maintenance — panel cleaning, controller checks, and annual pump inspection. See the full schedule, costs, and troubleshooting guide.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p><a href=\"/in/solar-pumps/\">Solar water pumps</a> require remarkably little maintenance — <strong>panel cleaning every 2–4 weeks</strong>, <strong>controller inspection twice a year</strong>, and an <strong>annual pump checkup</strong>. Annual maintenance costs run <strong>₹2,000–₹8,000</strong> depending on system size. Compare this to diesel pump servicing at ₹5,000–₹15,000/year plus fuel costs. The biggest maintenance risk is dust on panels — a dirty array can reduce water output by 15–25%.</p>"
    },
    {
      "heading": "Panel Maintenance: The Most Important Task",
      "body": "<p>Solar panels are the energy source — when they are dirty, the pump gets less power and delivers less water. In agricultural environments, dust is a constant challenge.</p><p><strong>Cleaning frequency by environment:</strong></p><table><thead><tr><th>Environment</th><th>Cleaning Frequency</th><th>Output Loss If Neglected</th></tr></thead><tbody><tr><td>Arid/desert (Rajasthan, Gujarat)</td><td>Every 1–2 weeks</td><td>20–30%</td></tr><tr><td>Standard agricultural</td><td>Every 2–3 weeks</td><td>15–20%</td></tr><tr><td>Coastal / high-humidity</td><td>Monthly</td><td>10–15%</td></tr><tr><td>Urban / peri-urban</td><td>Monthly</td><td>10–15%</td></tr></tbody></table><p><strong>How to clean:</strong></p><ol><li>Clean early morning or late evening when panels are cool</li><li>Use plain water and a soft cloth or sponge — no soap, detergent, or abrasives</li><li>Rinse from top to bottom with a bucket or hose</li><li>Remove bird droppings by soaking with water for 10 minutes before wiping</li><li>Do not step on panels or use pressure washers</li></ol><p>Many farmers assign this task to a family member or farm worker as a 15-minute weekly routine. The water output difference between clean and dirty panels is immediately noticeable.</p>"
    },
    {
      "heading": "Controller/VFD Maintenance",
      "body": "<p>The <a href=\"/in/solar-pumps/controller/\">pump controller</a> (VFD for <a href=\"/in/solar-pumps/ac-pump/\">AC pumps</a>, DC controller for <a href=\"/in/solar-pumps/dc-pump/\">DC/BLDC pumps</a>) is the most sensitive electronic component:</p><ul><li><strong>Keep it shaded and ventilated:</strong> Controllers should be installed in a shaded enclosure or pump house — not in direct sunlight. Temperature above 50°C reduces lifespan. Ensure the enclosure has ventilation slots or a fan.</li><li><strong>Check indicator lights:</strong> Every 2–4 weeks, verify the controller displays normal operation. Note any error codes and consult the manual or dealer.</li><li><strong>Inspect connections:</strong> Twice a year, check DC input cables from panels and AC/DC output cables to the motor for loose connections, corrosion, or rodent damage. Agricultural settings are prone to rodent damage on cables.</li><li><strong>Surge protection:</strong> Ensure the lightning arrestor and surge protection device (SPD) are functional. Lightning strikes during monsoon are the #1 cause of controller failure in agricultural installations. Replace SPDs after any lightning event.</li></ul><p><strong>Controller lifespan:</strong> 10–15 years with proper protection. Replacement cost: ₹8,000–₹25,000 depending on HP and type.</p>"
    },
    {
      "heading": "Pump Motor Maintenance",
      "body": "<p>Maintenance differs by motor type:</p><p><strong><a href=\"/in/solar-pumps/submersible/\">Submersible pumps</a>:</strong></p><ul><li>Sealed units — no routine user-serviceable maintenance</li><li>Monitor water output and pressure. A gradual decline indicates impeller wear or borewell silting</li><li>Annual inspection by pulling the pump from the borewell — check for sand damage, seal condition, and cable integrity (₹2,000–₹5,000 for the pull-up and inspection)</li><li>AC motor lifespan: 15–20 years. BLDC motor: 10–15 years.</li></ul><p><strong><a href=\"/in/solar-pumps/surface/\">Surface pumps</a>:</strong></p><ul><li>Check priming and foot valve regularly — surface pumps lose prime if the foot valve leaks</li><li>Listen for unusual vibration or noise — indicates bearing wear or impeller imbalance</li><li>Grease bearings annually (if applicable to your model)</li><li>Check mechanical seals for leakage</li></ul><p><strong>Brushed DC pumps:</strong></p><ul><li>Replace carbon brushes every 2–3 years. Cost: ₹200–₹800 per set</li><li>Inspect commutator for scoring. If badly scored, the motor needs professional rewinding</li></ul>"
    },
    {
      "heading": "Annual Maintenance Schedule",
      "body": "<table><thead><tr><th>Month</th><th>Task</th><th>Cost</th></tr></thead><tbody><tr><td>March (Pre-summer)</td><td>Full panel cleaning, controller check, cable inspection, test water output</td><td>₹500–₹1,500</td></tr><tr><td>June (Pre-monsoon)</td><td>Panel cleaning, check earthing and lightning protection, verify SPD, inspect panel mounting for corrosion</td><td>₹500–₹1,500</td></tr><tr><td>October (Post-monsoon)</td><td>Pull-up submersible for inspection (annual), clean panels, check for water ingress in controller enclosure</td><td>₹2,000–₹5,000</td></tr><tr><td>December</td><td>Panel cleaning, controller firmware update (if applicable), overall system check</td><td>₹500–₹1,000</td></tr></tbody></table><p><strong>Total annual maintenance: ₹3,500–₹9,000</strong> including one submersible pull-up inspection. For surface pumps, skip the pull-up — total drops to ₹1,500–₹4,000.</p>"
    },
    {
      "heading": "Troubleshooting Common Issues",
      "body": "<p>Quick diagnosis guide for common solar pump problems:</p><table><thead><tr><th>Symptom</th><th>Likely Cause</th><th>Fix</th></tr></thead><tbody><tr><td>No water output, motor not running</td><td>Controller error, tripped protection, low sunlight</td><td>Check controller display for error code, verify DC voltage from panels, reset controller</td></tr><tr><td>Motor runs but no water</td><td>Dry borewell, broken foot valve, air lock</td><td>Check water level, reprime surface pump, verify foot valve</td></tr><tr><td>Reduced water output (gradual)</td><td>Dirty panels, impeller wear, falling water table</td><td>Clean panels first. If output does not recover, check borewell water level and pump condition</td></tr><tr><td>Reduced output (sudden)</td><td>Panel damage, cable fault, controller fault</td><td>Inspect panels for cracks/hot spots, check cable connections, read controller error codes</td></tr><tr><td>Controller shows error/shuts down</td><td>Over-voltage, dry-run protection, overheating</td><td>Power cycle controller. If dry-run triggered, check borewell water level. If overheating, improve ventilation</td></tr><tr><td>Motor vibration/noise</td><td>Bearing wear, sand damage, loose mounting</td><td>Surface pump: check bearings and impeller. Submersible: needs pull-up for inspection</td></tr></tbody></table><p>For any issue that persists after basic troubleshooting, contact your dealer. Do not attempt electrical repairs — solar systems carry dangerous DC voltages.</p>"
    },
    {
      "heading": "Protecting Against Theft and Damage",
      "body": "<p>Agricultural solar panels are theft targets. Protect your investment:</p><ul><li><strong>Elevated pole mounting:</strong> Panels on 8–10 ft poles are harder to steal and safer from animals. Most KUSUM installations use pole mounts.</li><li><strong>Fencing:</strong> Wire mesh or thorn fencing around ground-mounted arrays. Cost: ₹5,000–₹15,000.</li><li><strong>Controller enclosure:</strong> Lockable metal box protects the controller from theft, weather, and rodents.</li><li><strong>Insurance:</strong> Some general insurers offer standalone solar pump insurance. Premiums: ₹500–₹2,000/year. Covers theft, storm damage, and lightning.</li></ul>"
    },
    {
      "heading": "Get Reliable After-Sales Support",
      "body": "<p>Maintenance is simpler when your dealer provides ongoing support. Solar Vipani connects you with verified dealers who offer AMC plans and warranty-backed service for solar pump systems across India.</p><p><a href=\"/in/get-quotes/\">Get free solar pump quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How often do solar pump panels need cleaning?",
      "answer": "In standard agricultural settings, clean panels every 2–3 weeks. In arid/desert regions (Rajasthan, Gujarat), clean every 1–2 weeks. Dusty panels can reduce water output by 15–25%. Use plain water and a soft cloth — never soap or pressure washers. It is a 15-minute task that directly impacts daily water volume."
    },
    {
      "question": "What is the annual maintenance cost for a solar pump?",
      "answer": "₹3,500–₹9,000/year for a complete system including one submersible pull-up inspection. For surface pumps, ₹1,500–₹4,000/year. This covers panel cleaning, controller inspection, cable checks, and pump checkup. Far cheaper than diesel pump maintenance at ₹5,000–₹15,000/year plus ₹30,000–₹80,000 fuel."
    },
    {
      "question": "How long does a solar pump last?",
      "answer": "Solar panels last 25–30 years. AC induction motors last 15–20 years (can be rewound). BLDC motors last 10–15 years. Controllers last 10–15 years. The full system typically lasts 20–25 years with one motor or controller replacement. Brushed DC motors need brush replacement every 2–3 years."
    },
    {
      "question": "What causes a solar pump to stop working?",
      "answer": "Common causes: controller error (reset it), dry borewell (check water level), dirty panels (clean them), cable damage from rodents, or tripped dry-run protection. Check the controller display for error codes first. If the issue persists after basic troubleshooting, contact your dealer — do not attempt electrical repairs yourself."
    },
    {
      "question": "How do I protect my solar pump panels from theft?",
      "answer": "Use elevated pole mounting (8–10 ft) instead of ground mounting — most KUSUM installations use this by default. Add wire mesh or thorn fencing around the array. Install the controller in a lockable metal enclosure. Consider solar pump insurance (₹500–₹2,000/year) from general insurers for theft and storm coverage."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'maintenance' AND pillar_slug = 'solar-pumps';

COMMIT;