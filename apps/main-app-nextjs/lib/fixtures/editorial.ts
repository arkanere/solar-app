/**
 * Real rows from `seo_pages` on live, 2026-09-21. Nothing here is invented.
 *
 * The editorial specimen proposes a body treatment; these keep it honest. This
 * is the actual database HTML the 118 editorial pages are made of — the real
 * six-column table, the real hundred-character cells, the real stale `/in/`
 * links that archetype/editorial.md §6 is about.
 *
 * Nothing is masked. Unlike the directory fixtures, every character here is
 * already published at solarvipani.com.
 *
 * Aggregate measurements behind the design choices are in archetype/editorial.md §2.
 */

export type Section = { heading: string; body: string };
export type FaqItem = { question: string; answer: string };

/**
 * `/rooftop-solar/1kw-system` — one of the five densest pages in the table
 * (5 tables) and otherwise dead typical: 9 sections, 6 FAQ items, 6,093
 * characters of body. The whole-page test.
 */
export const ONE_KW: {
  slug: string;
  pillarSlug: string;
  h1: string;
  content: Section[];
  faq: FaqItem[];
} = {
  slug: '1kw-system',
  pillarSlug: 'rooftop-solar',
  h1: '1kW Solar System for Home: Price, Output & Subsidy in India (2026)',
  content: [
    {
      body: '<p>A 1kW solar system costs <strong>₹60,000–₹80,000 before subsidy</strong> and <strong>₹30,000–₹50,000 after the PM Surya Ghar subsidy</strong> of ₹30,000. It generates 4–5 units (kWh) per day — enough for a 1 BHK flat or a home with a monthly bill of ₹500–₹1,000. Needs just ~100 sq ft of shadow-free roof space and 2 standard 540W panels.</p>',
      heading: 'The Short Answer'
    },
    {
      body: '<table><thead><tr><th>Component</th><th>Cost Range</th><th>Share of Total</th></tr></thead><tbody><tr><td>Solar panels (2 × 540W mono)</td><td>₹18,000–₹24,000</td><td>30–35%</td></tr><tr><td><a href="/in/rooftop-solar/on-grid-inverter">On-grid inverter</a> (1kW)</td><td>₹15,000–₹22,000</td><td>25–30%</td></tr><tr><td>Mounting structure</td><td>₹5,000–₹8,000</td><td>8–10%</td></tr><tr><td>Wiring, protection, earthing</td><td>₹4,000–₹6,000</td><td>6–8%</td></tr><tr><td>Installation labour</td><td>₹4,000–₹6,000</td><td>6–8%</td></tr><tr><td>Net metering & DISCOM fees</td><td>₹2,000–₹5,000</td><td>3–6%</td></tr><tr><td>GST (13.8%)</td><td>₹7,000–₹9,000</td><td>~13%</td></tr><tr><td><strong>Total (before subsidy)</strong></td><td><strong>₹60,000–₹80,000</strong></td><td>100%</td></tr><tr><td>PM Surya Ghar subsidy</td><td>−₹30,000</td><td></td></tr><tr><td><strong>Net cost (after subsidy)</strong></td><td><strong>₹30,000–₹50,000</strong></td><td></td></tr></tbody></table><p><a href="/in/rooftop-solar/cost">Full cost guide for all system sizes →</a></p>',
      heading: '1kW Solar System Price Breakdown'
    },
    {
      body: '<p>A 1kW system generates:</p><table><thead><tr><th>Period</th><th>Output</th><th>Bill Savings (at ₹6–₹10/unit)</th></tr></thead><tbody><tr><td>Per day</td><td>4–5 units</td><td>₹24–₹50</td></tr><tr><td>Per month</td><td>120–150 units</td><td>₹720–₹1,500</td></tr><tr><td>Per year</td><td>1,450–1,800 units</td><td>₹8,700–₹18,000</td></tr></tbody></table><p>Output varies by location — western and southern India (Rajasthan, Gujarat, Maharashtra, Karnataka) average 4.5–5.5 peak sun hours, while northern and eastern states average 3.5–4.5 hours.</p><p>→ <a href="/in/tools/solar-calculator">Calculate exact output for your location</a></p>',
      heading: 'Daily and Monthly Output'
    },
    {
      body: '<p>A 1kW system is best suited for <strong>light electrical loads</strong>:</p><table><thead><tr><th>Appliance</th><th>Wattage</th><th>Hours/day</th><th>Daily Units</th></tr></thead><tbody><tr><td>LED lights (5)</td><td>50W</td><td>6</td><td>0.3</td></tr><tr><td>Ceiling fans (2)</td><td>140W</td><td>10</td><td>1.4</td></tr><tr><td>TV (LED 42")</td><td>80W</td><td>4</td><td>0.3</td></tr><tr><td>WiFi router</td><td>15W</td><td>24</td><td>0.4</td></tr><tr><td>Laptop charger</td><td>65W</td><td>5</td><td>0.3</td></tr><tr><td>Mobile chargers (2)</td><td>20W</td><td>3</td><td>0.06</td></tr><tr><td><strong>Total</strong></td><td></td><td></td><td><strong>2.8 units</strong></td></tr></tbody></table><p>This leaves 1–2 units of surplus per day for net metering credits. A 1kW system <strong>cannot</strong> handle heavy loads like AC, geyser, or washing machine — for those, consider a <a href="/in/rooftop-solar/3kw-system">3kW</a> or <a href="/in/rooftop-solar/5kw-system">5kW system</a>.</p>',
      heading: 'What Can a 1kW System Run?'
    },
    {
      body: '<p>A 1kW system is the most compact rooftop solar setup:</p><ul><li><strong>Panels:</strong> 2 × 540W monocrystalline panels</li><li><strong>Panel dimensions:</strong> ~2.3m × 1.1m each</li><li><strong>Total roof area:</strong> ~100 sq ft (with inter-row spacing and access clearance)</li><li><strong>Roof type:</strong> Works on flat RCC roof, metal sheet roof, or tiled roof with appropriate mounting</li><li><strong>Weight:</strong> ~30–40 kg total (panels + structure) — any standard RCC roof handles this easily</li></ul><p>Ideal for apartments with limited terrace allocation or small independent houses. <a href="/in/rooftop-solar/for-apartments">Solar for apartments guide →</a></p>',
      heading: 'Space Requirements'
    },
    {
      body: '<p>A 1kW system qualifies for ₹30,000 under <a href="/in/solar-subsidy/pm-surya-ghar">PM Surya Ghar</a> (₹30,000/kW for the first 2kW).</p><p><strong>Payback calculation:</strong></p><table><thead><tr><th>Scenario</th><th>Net Cost</th><th>Annual Savings</th><th>Payback</th></tr></thead><tbody><tr><td>Low tariff (₹5/unit)</td><td>₹40,000</td><td>₹7,500</td><td>~5.3 years</td></tr><tr><td>Medium tariff (₹7/unit)</td><td>₹40,000</td><td>₹10,500</td><td>~3.8 years</td></tr><tr><td>High tariff (₹10/unit)</td><td>₹40,000</td><td>₹15,000</td><td>~2.7 years</td></tr></tbody></table><p>After payback, you get free electricity for the remaining 20+ years of panel life. Even the most conservative scenario recovers investment well within the warranty period.</p>',
      heading: 'Subsidy and Payback Period'
    },
    {
      body: '<p>For a 1kW system, <a href="/in/rooftop-solar/on-grid">on-grid</a> is almost always the right choice:</p><table><thead><tr><th></th><th>On-Grid 1kW</th><th>Off-Grid 1kW</th></tr></thead><tbody><tr><td>Cost</td><td>₹60,000–₹80,000</td><td>₹1,20,000–₹1,60,000</td></tr><tr><td>After subsidy</td><td>₹30,000–₹50,000</td><td>No subsidy</td></tr><tr><td>Battery</td><td>None needed</td><td>₹40,000–₹60,000</td></tr><tr><td>Maintenance</td><td>Minimal</td><td>Battery replacement every 4–5 yrs</td></tr></tbody></table><p>Choose off-grid only if you have no grid connection. For backup during power cuts, a <a href="/in/rooftop-solar/hybrid">hybrid setup</a> is better value than full off-grid.</p>',
      heading: 'On-Grid vs Off-Grid for 1kW'
    },
    {
      body: '<ul><li><strong>1 BHK flats</strong> with basic loads (fans, lights, TV, WiFi)</li><li><strong>Apartment owners</strong> with limited rooftop allocation (~100 sq ft)</li><li><strong>Low electricity bills</strong> (₹500–₹1,000/month)</li><li><strong>Budget-conscious buyers</strong> wanting the lowest entry cost into solar</li><li><strong>First-time solar users</strong> who want to start small and potentially expand later</li></ul><p>If your monthly bill exceeds ₹1,500, a <a href="/in/rooftop-solar/2kw-system">2kW</a> or <a href="/in/rooftop-solar/3kw-system">3kW system</a> offers better value per watt and faster payback.</p>',
      heading: 'Who Should Choose 1kW?'
    },
    {
      body: '<p>Compare quotes from 2–3 verified local installers. Solar Vipani matches you with MNRE-empanelled installers in your city who handle everything — design, installation, net metering, and subsidy paperwork.</p><p><a href="/in/get-quotes">Get your free 1kW solar quotes →</a></p>',
      heading: 'Get 1kW Solar Quotes'
    }
  ],
  faq: [
    {
      answer:
        'A 1kW on-grid solar system costs ₹60,000–₹80,000 before subsidy. After the PM Surya Ghar subsidy of ₹30,000, your out-of-pocket cost is ₹30,000–₹50,000. This includes panels, inverter, mounting, wiring, installation, and net metering fees.',
      question: 'What is the price of a 1kW solar system in India?'
    },
    {
      answer:
        'A 1kW system generates 4–5 units (kWh) per day on average in Indian conditions. Monthly output is 120–150 units. Output varies by location — sunny states like Rajasthan and Gujarat get closer to 5 units/day, while cloudy regions average 3.5–4 units.',
      question: 'How many units does a 1kW solar system generate per day?'
    },
    {
      answer:
        'Not practically. A 1-ton AC draws about 1,000W — consuming the entire 1kW system output just for cooling. A 1kW system is designed for light loads: fans, lights, TV, and small appliances. For AC usage, consider a 3kW or 5kW system.',
      question: 'Can a 1kW solar system run an AC?'
    },
    {
      answer:
        'With modern 540W monocrystalline panels, you need just 2 panels for a 1kW system (2 × 540W = 1,080W). This requires about 100 sq ft of shadow-free roof space.',
      question: 'How many solar panels are needed for 1kW?'
    },
    {
      answer:
        'Under PM Surya Ghar, a 1kW system qualifies for ₹30,000 subsidy (₹30,000/kW for the first 2kW). The subsidy is available only for on-grid systems installed by MNRE-empanelled vendors. It is credited to your bank account after DISCOM inspection.',
      question: 'What is the subsidy on a 1kW solar system?'
    },
    {
      answer:
        'For a 1 BHK with basic loads (fans, lights, TV, WiFi), yes. It generates 120–150 units/month, offsetting ₹720–₹1,500 from your bill. For larger homes or heavier usage (AC, geyser, washing machine), you need at least 3kW.',
      question: 'Is a 1kW solar system enough for a home?'
    }
  ]
};

/**
 * The four tables that decide the design. Picked as the extremes of the 282,
 * not as a sample — a treatment that survives these survives the rest.
 */
export const HARD_TABLES: { label: string; why: string; source: string; html: string }[] = [
  {
    label: 'Six columns, narrow cells',
    why: 'The widest shape in the table — 6 columns × 10 rows, and no cell longer than 14 characters. Every column is a number or a short label, so the grid is the point and nothing can be dropped.',
    source: '/solar-financing/interest-rates — Bank-Wise Solar Loan Interest Rates',
    html: '<table><thead><tr><th>Bank</th><th>Scheme</th><th>Rate (p.a.)</th><th>Max Tenure</th><th>Processing Fee</th><th>Type</th></tr></thead><tbody><tr><td>SBI</td><td>Surya Shakti</td><td>7.00–7.75%</td><td>10 years</td><td>0.50%</td><td>Public</td></tr><tr><td>Canara Bank</td><td>Solar Loan</td><td>7.25–8.25%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>Bank of Baroda</td><td>Baroda Solar</td><td>7.50–8.50%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>PNB</td><td>PNB Solar</td><td>7.50–8.75%</td><td>7 years</td><td>1.00%</td><td>Public</td></tr><tr><td>Union Bank</td><td>Union Solar</td><td>7.75–8.50%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>Indian Bank</td><td>IB Solar</td><td>7.50–8.50%</td><td>7 years</td><td>0.50%</td><td>Public</td></tr><tr><td>HDFC Bank</td><td>Solar Rooftop</td><td>8.50–9.50%</td><td>7 years</td><td>1.00%</td><td>Private</td></tr><tr><td>ICICI Bank</td><td>Solar Loan</td><td>9.00–10.00%</td><td>5 years</td><td>1.00%</td><td>Private</td></tr><tr><td>Axis Bank</td><td>Green Loan</td><td>9.00–10.50%</td><td>5 years</td><td>1.00%</td><td>Private</td></tr><tr><td>Kotak Mahindra</td><td>Solar Finance</td><td>9.50–10.50%</td><td>5 years</td><td>1.00%</td><td>Private</td></tr></tbody></table>'
  },
  {
    label: 'Five columns, long cells',
    why: 'The genuinely hardest one: 5 columns × 12 rows with cells up to 42 characters. Widest real footprint on the page.',
    source: '/solar-subsidy/state-wise — State-Wise Subsidy Comparison Table',
    html: '<table><thead><tr><th>State</th><th>Central Subsidy</th><th>State Top-Up</th><th>Total (3 kW)</th><th>Key DISCOM</th></tr></thead><tbody><tr><td>Gujarat</td><td>₹78,000</td><td>₹10,000/kW</td><td>~₹1,08,000</td><td>UGVCL, MGVCL, PGVCL, DGVCL</td></tr><tr><td>Rajasthan</td><td>₹78,000</td><td>₹5,000–₹10,000/kW</td><td>~₹93,000–₹1,08,000</td><td>JVVNL, AVVNL, JdVVNL</td></tr><tr><td>Uttarakhand</td><td>₹78,000</td><td>₹15,000 flat</td><td>~₹93,000</td><td>UPCL</td></tr><tr><td>Maharashtra</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>MSEDCL</td></tr><tr><td>Karnataka</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>BESCOM, MESCOM, HESCOM, CESC, GESCOM</td></tr><tr><td>Tamil Nadu</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>TANGEDCO</td></tr><tr><td>Kerala</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>KSEB</td></tr><tr><td>Madhya Pradesh</td><td>₹78,000</td><td>Varies (rural areas)</td><td>₹78,000+</td><td>MPEB (MPPKVVCL, MPMKVVCL)</td></tr><tr><td>Uttar Pradesh</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>UPPCL (DVVNL, MVVNL, PVVNL, etc.)</td></tr><tr><td>Haryana</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>UHBVNL, DHBVNL</td></tr><tr><td>Punjab</td><td>₹78,000</td><td>Nil</td><td>₹78,000</td><td>PSPCL</td></tr><tr><td>Delhi</td><td>₹78,000</td><td>Generation incentive (₹2/unit for 5 years)</td><td>₹78,000 + generation bonus</td><td>BSES Rajdhani, BSES Yamuna, TPDDL, NDMC</td></tr></tbody></table>'
  },
  {
    label: 'Three columns, 112-character cells',
    why: 'Barely a table — three columns of sentences. The one shape where stacking into label/value blocks might actually read better, which is why it is here.',
    source: '/solar-panels/warranty — Product Warranty vs Performance Warranty',
    html: "<table><thead><tr><th>Aspect</th><th>Product Warranty</th><th>Performance Warranty</th></tr></thead><tbody><tr><td>Duration</td><td>10–15 years</td><td>25–30 years</td></tr><tr><td>Covers</td><td>Manufacturing defects, material failures</td><td>Output degradation beyond specified limits</td></tr><tr><td>Examples</td><td>Delamination, junction box failure, cracked glass (not from impact), cell interconnect breaks, backsheet peeling</td><td>Panel producing below guaranteed percentage of rated power at a given year</td></tr><tr><td>Claim trigger</td><td>Physical defect visible or causing failure</td><td>Measured output falls below warranty curve</td></tr><tr><td>Remedy</td><td>Repair, replace, or refund (manufacturer's choice)</td><td>Replace or compensate for lost output</td></tr></tbody></table>"
  },
  {
    label: 'Four columns, eleven rows',
    why: 'The median-ish comparison table, and the commonest thing on the editorial surface. If this does not read well the archetype fails at its most typical.',
    source: '/rooftop-solar/on-grid-vs-off-grid — Complete Comparison Table',
    html: '<table><thead><tr><th>Feature</th><th>On-Grid</th><th>Off-Grid</th><th>Hybrid</th></tr></thead><tbody><tr><td>Grid connection</td><td>Required</td><td>None</td><td>Required</td></tr><tr><td>Battery</td><td>No</td><td>Yes (mandatory)</td><td>Yes (optional)</td></tr><tr><td>Net metering</td><td>Yes</td><td>No</td><td>Yes</td></tr><tr><td>Works in power cut</td><td>No</td><td>Yes</td><td>Yes</td></tr><tr><td>PM Surya Ghar subsidy</td><td>Full (up to ₹78,000)</td><td>None</td><td>Partial (varies by state)</td></tr><tr><td>Cost (3kW)</td><td>₹1.5L–₹1.9L</td><td>₹2.5L–₹3.5L</td><td>₹2.3L–₹3.0L</td></tr><tr><td>After subsidy (3kW)</td><td>₹72K–₹1.12L</td><td>₹2.5L–₹3.5L</td><td>₹1.5L–₹2.2L</td></tr><tr><td>Payback period</td><td>3–5 years</td><td>7–10 years</td><td>5–7 years</td></tr><tr><td>Maintenance</td><td>Minimal (panel cleaning)</td><td>High (battery + panel)</td><td>Moderate (battery + panel)</td></tr><tr><td>Lifespan</td><td>25+ years</td><td>Panels 25 yrs, batteries 3–5 yrs</td><td>Panels 25 yrs, batteries 5–10 yrs</td></tr><tr><td>Electricity bill</td><td>Near zero (net metered)</td><td>Zero (no connection)</td><td>Near zero + backup</td></tr></tbody></table>'
  }
];
