-- Solar Installation Clusters Batch 3: roof-assessment, permits, grid-connection, safety
-- Run: psql $POSTGRES_URL < 027-solar-installation-clusters-batch3.sql

BEGIN;

-- 1. CLUSTER: roof-assessment
UPDATE seo_pages SET
  h1 = 'Roof Assessment for Solar Panels: What Installers Check Before Installation',
  meta_title = 'Roof Assessment for Solar Panels India: Complete Checklist | Solar Vipani',
  meta_description = 'Before solar installation, your roof needs assessment for structural strength, shadow analysis, orientation and waterproofing. See what installers evaluate and why it matters.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>A roof assessment determines whether your roof can safely support a <a href=\"/in/solar-installation/\">solar installation</a> and how much power it can generate. Installers evaluate <strong>structural strength, available area, shadow patterns, roof orientation, tilt angle, and waterproofing condition</strong>. This assessment takes 1–2 hours on-site and is usually free when you request quotes through Solar Vipani''s verified installer network.</p>"
    },
    {
      "heading": "Why Roof Assessment Is the First Step",
      "body": "<p>Skipping a proper roof assessment is the most common cause of underperforming solar systems. A roof that faces the wrong direction can cut output by 20–30%. Shadows from a nearby building or water tank can reduce a panel''s output by 50% or more. And installing panels on a structurally weak roof risks collapse and voids your insurance.</p><p>Every verified installer on Solar Vipani conducts a thorough roof assessment before quoting. This ensures the system is designed for your specific roof — not a generic estimate that falls short in real-world conditions.</p><p>The assessment feeds directly into the <a href=\"/in/solar-installation/process/\">installation process</a> — it determines system size, panel layout, mounting structure type, and expected output.</p>"
    },
    {
      "heading": "Structural Load Capacity",
      "body": "<p>Solar panels with mounting structures weigh <strong>15–25 kg per square metre</strong>. Your roof must handle this added load for 25+ years through rain, wind, and temperature cycles.</p><p>What installers check:</p><ul><li><strong>Roof type</strong> — RCC slabs handle solar load easily. Sheet metal and asbestos roofs need reinforcement or specialised light-weight mounts.</li><li><strong>Slab thickness</strong> — Minimum 4 inches (100 mm) RCC is standard. Older buildings with thinner slabs may need a structural engineer''s sign-off.</li><li><strong>Age and condition</strong> — Cracks, water seepage, or spalling concrete indicate the roof needs repair before panel installation.</li><li><strong>Parapet walls</strong> — Low parapets may need height extensions to secure mounting rails.</li></ul><p>If your roof cannot support the weight directly, elevated structures (tilt frames on pillars) distribute the load to columns rather than the slab — a common solution for older buildings.</p>"
    },
    {
      "heading": "Shadow Analysis",
      "body": "<p>Even partial shading kills solar output. A single shaded cell in a panel can reduce the entire string''s output by 30–50% due to how cells are wired in series.</p><p>Installers analyse shadows from:</p><ul><li><strong>Adjacent buildings</strong> — Taller structures to the south cast the longest shadows</li><li><strong>Water tanks and staircase rooms</strong> — Typically the biggest rooftop obstructions</li><li><strong>Trees</strong> — Seasonal foliage changes can create shadows in some months but not others</li><li><strong>Parapets and walls</strong> — Low shadows that affect the first row of panels</li><li><strong>Antennas and satellite dishes</strong> — Small but concentrated shadow sources</li></ul><p>Professional installers use sun path analysis (digital or manual) to map shadows across all seasons. Panels are placed only in zones with <strong>minimum 4–5 hours of unshaded sunlight</strong> daily. This shadow map directly determines your <a href=\"/in/solar-installation/cost/\">installation cost</a> because it caps the maximum system size your roof can support.</p>"
    },
    {
      "heading": "Roof Orientation and Tilt",
      "body": "<p>In India (northern hemisphere), <strong>south-facing roofs</strong> receive maximum annual sunlight. Here is how orientation affects output:</p><table><thead><tr><th>Roof Direction</th><th>Output vs South-Facing</th><th>Recommendation</th></tr></thead><tbody><tr><td>South</td><td>100% (baseline)</td><td>Ideal — maximum output</td></tr><tr><td>South-East / South-West</td><td>90–95%</td><td>Excellent — minor loss</td></tr><tr><td>East / West</td><td>75–85%</td><td>Viable — compensate with larger system</td></tr><tr><td>North</td><td>50–65%</td><td>Not recommended — significant loss</td></tr></tbody></table><p>For flat roofs (most common in India), panels are mounted on tilt structures at <strong>10–15 degrees</strong> — matching India''s latitude band for optimal year-round output. Steeper tilts improve winter output but reduce summer generation and increase wind load.</p>"
    },
    {
      "heading": "Available Roof Area",
      "body": "<p>Not all roof space is usable. Installers measure the <strong>effective area</strong> after subtracting:</p><ul><li>Water tanks, staircase rooms, and service ducts</li><li>Shadow zones identified during shadow analysis</li><li>Setback margins (typically 0.5–1 metre from edges)</li><li>Inter-row spacing to prevent self-shading (0.5–1 metre between tilted rows)</li><li>Maintenance access pathways</li></ul><p>As a rule of thumb, you need <strong>100 square feet per kW</strong> of effective (shadow-free) roof space. A typical 3kW system needs about 300 sq ft of usable area.</p><p>For apartments with shared rooftops, the assessment determines each flat owner''s proportional share of usable area — critical for <a href=\"/in/rooftop-solar/for-apartments/\">apartment solar installations</a>.</p>"
    },
    {
      "heading": "Waterproofing and Roof Condition",
      "body": "<p>Drilling into your roof for mounting bolts can compromise waterproofing if not done correctly. The assessment evaluates:</p><ul><li><strong>Existing waterproofing layer</strong> — Is it intact? When was it last applied?</li><li><strong>Drainage slope</strong> — Panels should not block water flow to drain outlets</li><li><strong>Mounting method</strong> — Ballasted (weighted, no drilling) vs penetrating (bolted) mounts</li></ul><p>Most quality installers use chemical anchor bolts with waterproof sealant, or non-penetrating ballasted systems on flat roofs. If your roof''s waterproofing is old or damaged, repair it <em>before</em> solar installation — accessing the roof surface afterwards requires removing panels.</p>"
    },
    {
      "heading": "What Happens After the Assessment",
      "body": "<p>A complete roof assessment produces a system design proposal that includes:</p><ul><li>Maximum installable capacity (kW)</li><li>Recommended panel layout and orientation</li><li>Expected daily and annual energy generation</li><li>Mounting structure specifications</li><li>Estimated <a href=\"/in/solar-installation/cost/\">installation cost</a></li></ul><p>This proposal forms the basis of your quote. When you request quotes through Solar Vipani, 2–3 verified installers each conduct their own assessment and provide competing proposals — giving you the data to make an informed decision.</p><p><a href=\"/in/get-quotes/\">Get your free roof assessment and solar quotes →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Is a roof assessment required before solar installation?",
      "answer": "Yes. A professional roof assessment is essential before any solar installation. It determines structural safety, optimal panel placement, and expected output. Skipping it risks underperformance, roof damage, or even structural failure. Reputable installers include it free as part of the quotation process."
    },
    {
      "question": "How long does a solar roof assessment take?",
      "answer": "A typical residential roof assessment takes 1–2 hours. The installer measures the roof, checks for shadows, evaluates structural condition, and takes photos. They then prepare a system design proposal, which is usually delivered within 2–3 days."
    },
    {
      "question": "Can I install solar panels on any type of roof?",
      "answer": "Solar panels can be installed on most roof types — RCC slabs, metal sheets, tiles, and even asbestos (with specialised mounts). RCC flat roofs are the easiest and cheapest. Sloped tile roofs need flush-mount systems. Very old or structurally weak roofs may need reinforcement before installation."
    },
    {
      "question": "What is the minimum roof area needed for solar panels?",
      "answer": "You need approximately 100 square feet of shadow-free roof area per 1kW of solar capacity. A 3kW system needs about 300 sq ft, and a 5kW system needs about 500 sq ft. This is effective area — total roof space minus tanks, staircase rooms, shadow zones, and maintenance pathways."
    },
    {
      "question": "Does a north-facing roof work for solar panels?",
      "answer": "North-facing roofs in India receive 35–50% less sunlight than south-facing ones and are generally not recommended for solar. However, flat roofs can use tilt structures to orient panels south regardless of building direction. East and west-facing roofs are viable with 15–25% output reduction."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'roof-assessment' AND pillar_slug = 'solar-installation';


-- 2. CLUSTER: permits
UPDATE seo_pages SET
  h1 = 'Solar Panel Installation Permits in India: What Approvals Do You Need?',
  meta_title = 'Solar Installation Permits India: DISCOM, Municipal & Society Approvals | Solar Vipani',
  meta_description = 'Solar installation requires DISCOM net metering approval and sometimes municipal/society permits. See what permits you need, documents required, and how your installer handles them.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>For residential rooftop solar in India, you need <strong>one mandatory permit</strong>: DISCOM approval for net metering. Municipal building permission is <strong>not required</strong> for systems up to 10kW in most states. Housing society approval is needed for apartments. Your installer typically handles all paperwork as part of the <a href=\"/in/solar-installation/\">installation package</a>.</p>"
    },
    {
      "heading": "DISCOM Net Metering Approval",
      "body": "<p>This is the only universally required approval. Your local electricity distribution company (DISCOM) must approve the grid connection before your on-grid system can export surplus power.</p><p>The DISCOM approval process:</p><ol><li><strong>Application submission</strong> — Your installer submits the net metering application with system specifications, single-line diagram, and your electricity bill details.</li><li><strong>Feasibility check</strong> — DISCOM verifies that the local transformer and distribution network can handle your system''s export capacity. This takes 7–15 days.</li><li><strong>Technical inspection</strong> — A DISCOM engineer visits your site after installation to verify compliance. Takes 1–3 days.</li><li><strong>Meter replacement</strong> — DISCOM replaces your existing meter with a bi-directional net meter. Some DISCOMs install within a week; others take 2–4 weeks.</li><li><strong>Commissioning certificate</strong> — DISCOM issues a certificate confirming your system is grid-connected and metering is active.</li></ol><p>Timeline varies dramatically by state. States like Gujarat and Rajasthan process applications in 2–3 weeks. Others like UP and Bihar can take 6–8 weeks. <a href=\"/in/solar-subsidy/net-metering/\">Full net metering guide →</a></p>"
    },
    {
      "heading": "Documents Required for DISCOM Approval",
      "body": "<p>Your installer prepares most of these, but you need to provide the originals:</p><table><thead><tr><th>Document</th><th>Who Provides</th><th>Notes</th></tr></thead><tbody><tr><td>Electricity bill (latest)</td><td>You</td><td>Must match the consumer number on the application</td></tr><tr><td>ID proof (Aadhaar/PAN)</td><td>You</td><td>Must match the bill holder''s name</td></tr><tr><td>Property ownership proof</td><td>You</td><td>Registry or society allotment letter</td></tr><tr><td>Passport-size photos</td><td>You</td><td>2 copies in most states</td></tr><tr><td>System design and SLD</td><td>Installer</td><td>Single-line diagram showing electrical layout</td></tr><tr><td>Panel and inverter datasheets</td><td>Installer</td><td>Must be from BIS-certified manufacturers</td></tr><tr><td>MNRE channel partner certificate</td><td>Installer</td><td>Required for subsidy eligibility</td></tr><tr><td>Undertaking/indemnity bond</td><td>You (drafted by installer)</td><td>Stating system meets safety standards</td></tr></tbody></table><p>For <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a>, additional documents include bank account details (for direct subsidy transfer) and a cancelled cheque. <a href=\"/in/solar-subsidy/documents-required/\">Complete documents checklist →</a></p>"
    },
    {
      "heading": "Municipal and Building Permissions",
      "body": "<p>Good news for homeowners: <strong>most Indian states exempt residential rooftop solar from municipal building permissions</strong>. The MNRE and state governments have issued directives to simplify solar adoption.</p><p>Current rules by property type:</p><ul><li><strong>Independent houses (up to 10kW)</strong> — No building permission needed in most states. The DISCOM approval suffices.</li><li><strong>Systems above 10kW</strong> — Some states require electrical inspector approval in addition to DISCOM clearance.</li><li><strong>Heritage zones or restricted areas</strong> — May require clearance from the local development authority. Rare for residential installations.</li><li><strong>Commercial buildings</strong> — May need fire safety NOC if the system exceeds 50kW.</li></ul><p>Your installer will advise if any local-body permissions are needed based on your location and system size.</p>"
    },
    {
      "heading": "Housing Society Approvals for Apartments",
      "body": "<p>Installing solar in an apartment building requires the housing society''s consent since the rooftop is shared common area. Here is what you need:</p><ol><li><strong>Society resolution</strong> — A general body meeting resolution approving solar installation on the rooftop. This can be for common-area solar (powering lifts, lights) or individual flat allocations.</li><li><strong>Roof space allocation</strong> — If individual flat owners are installing, the society must allocate proportional roof space to each participating flat.</li><li><strong>NOC from society</strong> — A formal No Objection Certificate signed by the society secretary and chairman.</li><li><strong>Structural assessment</strong> — Some societies require a structural engineer''s certificate confirming the roof can bear the additional load.</li></ol><p>Under PM Surya Ghar, individual flat owners in apartments can apply for subsidy on their allocated share. The key is getting the society resolution passed — once that is done, the DISCOM application proceeds normally. <a href=\"/in/rooftop-solar/for-apartments/\">Solar for apartments guide →</a></p>"
    },
    {
      "heading": "Subsidy-Related Approvals",
      "body": "<p>If you are claiming the <a href=\"/in/solar-subsidy/pm-surya-ghar/\">PM Surya Ghar subsidy</a>, there are additional approval steps beyond standard permits:</p><ul><li><strong>Portal registration</strong> — Register on the national PM Surya Ghar portal with your DISCOM consumer number before installation begins.</li><li><strong>Vendor selection</strong> — Your installer must be an MNRE-empanelled vendor. Only systems installed by registered vendors qualify for subsidy.</li><li><strong>Pre-installation approval</strong> — Some DISCOMs require portal-based approval before you can proceed with installation.</li><li><strong>Post-installation inspection</strong> — DISCOM inspects the installed system, verifies it matches the application, and uploads a commissioning report to the portal.</li><li><strong>Subsidy disbursement</strong> — After DISCOM verification, the subsidy amount is credited directly to your bank account within 30–45 days.</li></ul><p>Your installer guides you through each step. The subsidy process runs parallel to the standard DISCOM approval, adding minimal extra time. <a href=\"/in/solar-subsidy/how-to-apply/\">How to apply for solar subsidy →</a></p>"
    },
    {
      "heading": "Common Permit Delays and How to Avoid Them",
      "body": "<p>Permit processing is the longest phase of any <a href=\"/in/solar-installation/timeline/\">solar installation timeline</a>. Here are the most common bottlenecks and solutions:</p><ul><li><strong>Incomplete documents</strong> — Missing or mismatched names on ID proof and electricity bill is the top cause of rejection. Ensure all documents match exactly.</li><li><strong>Transformer capacity</strong> — If your local transformer already has high solar penetration, DISCOM may delay approval. This is common in solar-heavy residential colonies.</li><li><strong>DISCOM backlog</strong> — In states with rapid adoption (Maharashtra, Gujarat, Rajasthan), processing times increase due to volume. Apply early.</li><li><strong>Society delays</strong> — Housing societies can take months to pass resolutions. Start the society discussion well before engaging installers.</li></ul><p>Working with experienced installers who know local DISCOM processes is the best way to minimise delays. Solar Vipani''s network includes installers with established DISCOM relationships across 500+ districts.</p><p><a href=\"/in/get-quotes/\">Get quotes from permit-experienced installers →</a></p>"
    },
    {
      "heading": "Your Installer Handles Most Permits",
      "body": "<p>The good news: a quality installer manages 80–90% of the permit process on your behalf. When you choose an installer through Solar Vipani, they handle:</p><ul><li>DISCOM application preparation and submission</li><li>Single-line diagram and technical documentation</li><li>Liaison with DISCOM engineers for inspections</li><li>PM Surya Ghar portal registration and subsidy processing</li><li>Coordination with your housing society (if applicable)</li></ul><p>Your role is limited to providing personal documents, signing applications, and being available during the DISCOM inspection visit.</p><p><a href=\"/in/get-quotes/\">Connect with verified installers who handle all approvals →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Do I need government permission to install solar panels on my roof?",
      "answer": "For residential systems up to 10kW, you need DISCOM (electricity company) approval for net metering but no municipal building permission in most Indian states. Your solar installer handles the DISCOM application as part of the installation package. Apartment installations additionally require housing society approval."
    },
    {
      "question": "How long does it take to get solar installation permits?",
      "answer": "DISCOM approval typically takes 2–6 weeks depending on your state. Gujarat and Rajasthan process in 2–3 weeks, while states like UP and Bihar may take 6–8 weeks. The application itself takes 1–3 days to prepare and submit. Your installer handles the entire process."
    },
    {
      "question": "What documents do I need for solar panel installation?",
      "answer": "You need your latest electricity bill, Aadhaar or PAN card, property ownership proof, and passport-size photos. Your installer provides technical documents like the single-line diagram and equipment datasheets. For PM Surya Ghar subsidy, you also need bank account details and a cancelled cheque."
    },
    {
      "question": "Can I install solar without net metering approval?",
      "answer": "Technically, you can install an off-grid system without DISCOM approval since it is not connected to the grid. However, off-grid systems cost 40–60% more due to batteries and do not qualify for government subsidies. For on-grid systems (which most homeowners choose), net metering approval is mandatory."
    },
    {
      "question": "Do apartments need special permission for solar installation?",
      "answer": "Yes. Apartment buildings need a housing society general body resolution approving the installation, a roof space allocation plan, and a formal NOC from the society. Individual flat owners can apply for PM Surya Ghar subsidy on their allocated share once the society resolution is passed."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'permits' AND pillar_slug = 'solar-installation';


-- 3. CLUSTER: grid-connection
UPDATE seo_pages SET
  h1 = 'Solar Grid Connection in India: How to Connect Your System to the Grid',
  meta_title = 'Solar Grid Connection India: Net Metering Setup & DISCOM Process | Solar Vipani',
  meta_description = 'Learn how to connect your rooftop solar system to the electricity grid. Step-by-step DISCOM process, net meter installation, and grid synchronisation explained.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Grid connection allows your rooftop solar system to export surplus electricity to the grid and earn net metering credits. The process involves <strong>DISCOM application, feasibility check, system installation, inspection, bi-directional meter installation, and commissioning</strong>. Your <a href=\"/in/solar-installation/choosing-installer/\">installer handles the entire process</a> — you just provide documents and be available for the inspection visit.</p>"
    },
    {
      "heading": "Why Grid Connection Matters",
      "body": "<p>Without grid connection, your on-grid solar system cannot export surplus power. You would waste every unit your panels generate beyond your instant consumption — typically 40–60% of daytime output.</p><p>Grid connection with net metering effectively turns the electricity grid into a free virtual battery. During the day, your surplus flows to the grid and earns credits. At night, you draw power from the grid. You pay only for the net difference.</p><p>This is what makes on-grid solar financially viable for Indian homeowners. Without it, you would need expensive batteries to store surplus — increasing costs by 40–60%. <a href=\"/in/solar-subsidy/net-metering/\">How net metering works →</a></p>"
    },
    {
      "heading": "Grid Connection Process: Step by Step",
      "body": "<ol><li><strong>Pre-installation application</strong> — Submit net metering application to your DISCOM with system specifications, single-line diagram, and personal documents. Some states require this before installation begins.</li><li><strong>Feasibility assessment</strong> — DISCOM checks whether the local distribution transformer can handle your system''s export. Takes 7–15 days. Approval rate is high for residential systems.</li><li><strong>System installation</strong> — Once feasibility is cleared, your installer proceeds with <a href=\"/in/solar-installation/process/\">physical installation</a> — panels, inverter, <a href=\"/in/solar-installation/wiring/\">wiring</a>, and electrical connections.</li><li><strong>DISCOM inspection</strong> — A DISCOM engineer visits your site to verify the installation matches the application. They check panel capacity, inverter specifications, safety devices, and earthing.</li><li><strong>Meter replacement</strong> — DISCOM replaces your existing uni-directional meter with a bi-directional (import/export) net meter. Some DISCOMs use your existing smart meter if it supports bi-directional metering.</li><li><strong>Grid synchronisation</strong> — The inverter is configured to sync with grid frequency (50 Hz) and voltage (230V). Anti-islanding protection is verified.</li><li><strong>Commissioning certificate</strong> — DISCOM issues a formal commissioning certificate confirming your system is grid-connected and net metering is active.</li></ol>"
    },
    {
      "heading": "The Bi-Directional Net Meter",
      "body": "<p>The net meter is the key hardware that enables grid connection. It records electricity flowing in both directions:</p><ul><li><strong>Import</strong> — Units you consume from the grid (night-time and cloudy periods)</li><li><strong>Export</strong> — Units your solar system sends to the grid (daytime surplus)</li></ul><p>At billing time, your DISCOM calculates: <em>Net consumption = Import − Export</em>. You pay only for the net. If export exceeds import in a billing cycle, the credit carries forward.</p><p>Most DISCOMs supply the net meter free of charge or at a nominal fee (₹1,000–₹3,000). Some states like Maharashtra charge a refundable security deposit. The meter is owned and maintained by the DISCOM.</p><p>Modern net meters are digital with remote reading capability, so DISCOM can monitor your export and import in real time.</p>"
    },
    {
      "heading": "Anti-Islanding Protection: The Safety Requirement",
      "body": "<p>Every grid-connected inverter must have <strong>anti-islanding protection</strong>. This is a safety feature that automatically disconnects your solar system from the grid during a power outage.</p><p>Why it is critical:</p><ul><li>During a grid outage, linemen work on the assumption that lines are de-energised</li><li>If your solar system keeps feeding power into a dead grid, it creates a dangerous energised ''island''</li><li>Anti-islanding detection shuts down your inverter within milliseconds of detecting a grid failure</li></ul><p>All BIS-certified solar inverters sold in India include anti-islanding as a built-in feature. The DISCOM inspection specifically verifies this protection is functional. This is also a key reason <a href=\"/in/solar-installation/diy-vs-professional/\">professional installation</a> is recommended over DIY attempts.</p>"
    },
    {
      "heading": "Grid Connection by DISCOM: How Timelines Vary",
      "body": "<p>Processing times differ significantly across Indian DISCOMs:</p><table><thead><tr><th>State / DISCOM</th><th>Typical Timeline</th><th>Notes</th></tr></thead><tbody><tr><td>Gujarat (UGVCL, DGVCL)</td><td>2–3 weeks</td><td>Fastest processing, strong solar policy</td></tr><tr><td>Rajasthan (JVVNL, AVVNL)</td><td>2–3 weeks</td><td>Streamlined online portal</td></tr><tr><td>Maharashtra (MSEDCL)</td><td>3–5 weeks</td><td>High volume, improving timelines</td></tr><tr><td>Karnataka (BESCOM)</td><td>3–4 weeks</td><td>Efficient in Bengaluru urban</td></tr><tr><td>Tamil Nadu (TANGEDCO)</td><td>4–6 weeks</td><td>Improving but still slow in rural areas</td></tr><tr><td>UP (UPPCL divisions)</td><td>5–8 weeks</td><td>Significant backlog, improving gradually</td></tr><tr><td>Delhi (TPDDL, BRPL, BYPL)</td><td>2–4 weeks</td><td>Private DISCOMs process faster</td></tr></tbody></table><p>Experienced installers with established DISCOM relationships can often expedite the process. This is one reason <a href=\"/in/solar-installation/choosing-installer/\">choosing the right installer</a> matters.</p>"
    },
    {
      "heading": "Common Grid Connection Issues",
      "body": "<p>Most grid connection processes go smoothly, but watch for these potential issues:</p><ul><li><strong>Transformer capacity exhausted</strong> — If too many homes on your local transformer already have solar, the DISCOM may limit your system size or require a transformer upgrade. This is becoming common in solar-saturated residential colonies.</li><li><strong>Phase mismatch</strong> — If you have single-phase supply but install a three-phase inverter (or vice versa), the DISCOM will reject the application. Ensure your installer designs for your existing supply.</li><li><strong>Export limitation</strong> — Some DISCOMs cap export at a percentage of your sanctioned load (typically 80–100%). If your system generates more, excess is simply not metered.</li><li><strong>Meter delay</strong> — Bi-directional meter availability can cause delays. Some homeowners start generating solar power before the net meter is installed — units exported during this period are often not credited.</li></ul><p>Your installer should flag these issues during the <a href=\"/in/solar-installation/roof-assessment/\">roof assessment</a> and <a href=\"/in/solar-installation/site-survey/\">site survey</a> stages — before you commit to a system size.</p>"
    },
    {
      "heading": "Get Connected with Verified Installers",
      "body": "<p>Grid connection is the most DISCOM-dependent part of your solar journey. Working with an installer who knows your local DISCOM''s processes and has established relationships with their engineering team makes a significant difference in timeline and success rate.</p><p>Solar Vipani''s verified installer network covers 500+ districts and all major DISCOMs. Each installer is experienced in local grid connection procedures.</p><p><a href=\"/in/get-quotes/\">Get quotes from grid-connection experienced installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How long does it take to connect solar panels to the grid?",
      "answer": "Grid connection typically takes 2–6 weeks after your solar system is physically installed. The timeline depends on your DISCOM — states like Gujarat process in 2–3 weeks, while UP can take 5–8 weeks. Your installer handles the entire application and liaison process."
    },
    {
      "question": "Can I use solar power before grid connection is complete?",
      "answer": "With an on-grid system, the inverter requires grid presence to function, so you cannot generate power until the DISCOM energises your connection. Some hybrid inverters allow standalone mode, but any power exported before the net meter is installed will not be credited to your account."
    },
    {
      "question": "What is a bi-directional meter and do I need to buy one?",
      "answer": "A bi-directional meter records electricity flowing both ways — import from the grid and export from your solar system. Most DISCOMs supply and install the net meter free or at a nominal cost of ₹1,000–₹3,000. It replaces your existing meter and is owned by the DISCOM."
    },
    {
      "question": "What is anti-islanding and why is it important?",
      "answer": "Anti-islanding is a safety feature in grid-connected inverters that automatically shuts down your solar system during a power outage. This protects utility workers who may be working on power lines. All BIS-certified inverters include this feature, and DISCOMs verify it during inspection."
    },
    {
      "question": "What happens if my local transformer cannot handle more solar connections?",
      "answer": "If the local distribution transformer is at capacity, your DISCOM may reduce your approved system size, delay approval until the transformer is upgraded, or suggest connecting to a nearby transformer. This is uncommon for small residential systems but increasingly relevant in solar-heavy residential areas."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'grid-connection' AND pillar_slug = 'solar-installation';


-- 4. CLUSTER: safety
UPDATE seo_pages SET
  h1 = 'Solar Installation Safety: Essential Precautions for Rooftop Solar in India',
  meta_title = 'Solar Installation Safety India: Electrical, Structural & Fire Precautions | Solar Vipani',
  meta_description = 'Solar installation safety covers electrical protection, structural integrity, fire prevention and maintenance protocols. Learn what safety measures your installer must follow.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Solar installation safety covers <strong>electrical protection, structural integrity, fire prevention, and weather resistance</strong>. A professionally installed system with proper earthing, surge protection, DC isolators, and BIS-certified components is extremely safe — India has an excellent track record with residential solar. The key is choosing <a href=\"/in/solar-installation/choosing-installer/\">a verified installer</a> who follows MNRE and IEC standards.</p>"
    },
    {
      "heading": "Why Safety Starts with Professional Installation",
      "body": "<p>Solar panels generate electricity the moment sunlight hits them. Unlike household wiring that you can switch off at the mains, solar panels have no off switch during daylight hours. This makes proper installation technique critical — a wiring error or faulty connection can create fire or electrocution hazards that are difficult to isolate.</p><p>This is the primary reason <a href=\"/in/solar-installation/diy-vs-professional/\">professional installation is strongly recommended</a> over DIY. Verified installers understand DC electrical safety, proper cable routing, earthing requirements, and inverter protection settings that a general electrician may not.</p><p>Every installer on Solar Vipani''s network is vetted for safety compliance and carries valid MNRE channel partner certification.</p>"
    },
    {
      "heading": "Electrical Safety Measures",
      "body": "<p>Electrical protection is the most critical safety domain for solar installations. Required safety devices include:</p><ul><li><strong>DC isolator</strong> — A switch between panels and inverter that allows safe disconnection during maintenance. Must be rated for DC voltage (panels can generate 400–600V DC).</li><li><strong>AC isolator</strong> — Disconnects the inverter output from your home''s electrical system and the grid.</li><li><strong>Surge protection device (SPD)</strong> — Protects against voltage spikes from lightning or grid fluctuations. Should be installed on both DC and AC sides.</li><li><strong>Earthing</strong> — All metal components (panel frames, mounting structure, inverter body) must be earthed to protect against electric shock. Minimum two earth pits — one for DC, one for AC side.</li><li><strong>MCB/MCCB</strong> — Miniature circuit breakers sized for your system''s current rating, installed in the AC distribution board.</li><li><strong>Anti-islanding</strong> — Built into grid-connected inverters, this shuts down the system during grid outages to protect utility linemen.</li></ul><p>A quality installer installs all these as standard. If a quote omits surge protection or proper earthing, treat it as a red flag.</p>"
    },
    {
      "heading": "Structural Safety",
      "body": "<p>Your roof must safely support the solar system for 25+ years through monsoons, high winds, and temperature extremes.</p><p>Key structural safety requirements:</p><ul><li><strong>Load assessment</strong> — Solar panels with mounts add 15–25 kg/m². Your roof slab must handle this plus wind uplift forces. <a href=\"/in/solar-installation/roof-assessment/\">Roof assessment details →</a></li><li><strong>Wind resistance</strong> — Mounting structures must withstand wind speeds of 150–200 km/h (depending on your wind zone). Panels should be bolted, not just clamped, to the mounting rails.</li><li><strong>Corrosion protection</strong> — Mounting structures should be hot-dip galvanised steel or anodised aluminium. Coastal areas need marine-grade materials to resist salt corrosion.</li><li><strong>Foundation design</strong> — On flat roofs, ballasted systems (weighted concrete blocks) avoid roof penetration. Bolted systems must use chemical anchors with waterproof sealant.</li></ul><p>Your installer should provide a mounting structure design certified for your local wind zone and roof type.</p>"
    },
    {
      "heading": "Fire Safety",
      "body": "<p>Solar fire incidents are extremely rare in India but the risk exists if safety standards are ignored. Primary fire causes and prevention:</p><ul><li><strong>Loose DC connections</strong> — DC arcs at loose connectors generate intense heat. Prevention: Use MC4 connectors properly crimped (not hand-tightened), and torque all terminal connections to manufacturer specifications.</li><li><strong>Undersized cables</strong> — Cables too thin for the current load overheat. Prevention: Use cables rated for 1.5x the system''s maximum current with UV-resistant insulation.</li><li><strong>Poor cable routing</strong> — Cables resting on hot metal roofs or rubbing against sharp edges degrade over time. Prevention: Use cable trays, conduits, and grommets at all edge crossings.</li><li><strong>Inverter overheating</strong> — Inverters generate heat during conversion. Prevention: Install in ventilated, shaded locations with minimum clearance on all sides per manufacturer specs.</li></ul><p>For commercial systems above 50kW, fire safety NOC from the local fire department may be required. Residential systems are exempt in most states.</p>"
    },
    {
      "heading": "Lightning and Surge Protection",
      "body": "<p>Rooftop solar panels — being the highest point on most buildings — are exposed to lightning risk. While direct strikes are rare, nearby strikes induce voltage surges that can damage inverters and panels.</p><p>Protection measures:</p><ul><li><strong>Surge protection devices (SPD)</strong> — Type II SPDs on both DC and AC sides are standard. Type I SPDs are recommended in high-lightning zones (eastern India, Western Ghats).</li><li><strong>Lightning arrestor</strong> — A separate lightning conductor higher than the panel array, connected to a dedicated earth pit. Recommended for buildings in lightning-prone areas.</li><li><strong>Proper earthing</strong> — All metal components earthed with less than 5 ohm earth resistance. This provides a safe path for surge currents.</li></ul><p>Most residential insurance policies cover solar systems once they are installed. Check with your insurer and add the system to your home insurance for comprehensive protection.</p>"
    },
    {
      "heading": "Maintenance Safety",
      "body": "<p>Post-installation, safe <a href=\"/in/rooftop-solar/maintenance/\">maintenance practices</a> protect both you and the system:</p><ul><li><strong>Panel cleaning</strong> — Use water and a soft brush only. Never use abrasive cleaners or high-pressure jets. Clean early morning or late evening when panels are cool — cold water on hot panels causes thermal shock.</li><li><strong>No walking on panels</strong> — Solar panels are glass-topped and not designed to bear foot traffic. Use walkways between rows.</li><li><strong>DC awareness</strong> — Panels generate voltage in any light. Before touching any electrical connection, use the DC isolator to disconnect panels from the inverter.</li><li><strong>Annual inspection</strong> — Have your installer check all connections, earthing resistance, cable insulation, and mounting bolt tightness annually.</li></ul><p>For any maintenance beyond basic cleaning, contact your installer or a qualified solar technician. Do not attempt electrical work yourself.</p>"
    },
    {
      "heading": "Ensure Safety with Verified Installers",
      "body": "<p>The single most effective safety measure is choosing a qualified, verified installer. Every installer on Solar Vipani''s network is vetted for MNRE compliance, uses BIS-certified components, and follows IEC safety standards.</p><p>When comparing quotes, verify that safety equipment (DC/AC isolators, SPDs, proper earthing) is explicitly listed. The cheapest quote that omits safety devices is the most expensive mistake.</p><p><a href=\"/in/get-quotes/\">Get quotes from safety-compliant verified installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Are rooftop solar panels safe for homes?",
      "answer": "Yes. Professionally installed rooftop solar systems with proper earthing, surge protection, and BIS-certified components are extremely safe. India has installed millions of residential systems with an excellent safety record. The key is using a verified installer who follows MNRE and IEC standards, not a general electrician."
    },
    {
      "question": "Can solar panels cause fire?",
      "answer": "Solar fires are extremely rare and almost always caused by poor installation — loose DC connections, undersized cables, or improper cable routing. A professionally installed system with properly crimped MC4 connectors, correctly sized cables, and a well-ventilated inverter has negligible fire risk."
    },
    {
      "question": "Do solar panels attract lightning?",
      "answer": "Solar panels do not attract lightning any more than other rooftop structures. However, being at the roof''s highest point, they can be affected by nearby lightning strikes through voltage surges. Surge protection devices on both DC and AC sides, proper earthing, and a lightning arrestor in high-risk zones provide adequate protection."
    },
    {
      "question": "Is it safe to clean solar panels myself?",
      "answer": "Basic cleaning with water and a soft brush is safe if done early morning or late evening when panels are cool. Never use abrasive cleaners, high-pressure water jets, or walk on panels. For any electrical maintenance, always contact your installer or a qualified solar technician — panels generate voltage in any light and cannot be fully switched off."
    },
    {
      "question": "What safety equipment should be included in a solar installation?",
      "answer": "Every residential solar installation must include DC and AC isolators, surge protection devices on both sides, proper earthing with at least two earth pits, MCB/MCCB protection, and an inverter with anti-islanding protection. If a quote omits any of these, choose a different installer."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'safety' AND pillar_slug = 'solar-installation';

COMMIT;
