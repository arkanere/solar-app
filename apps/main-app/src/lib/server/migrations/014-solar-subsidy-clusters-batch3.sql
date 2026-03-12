-- Solar Subsidy Clusters Batch 3: documents-required + application-process + state-subsidy + central-subsidy
-- Run: psql $POSTGRES_URL < 014-solar-subsidy-clusters-batch3.sql

BEGIN;

-- 1. CLUSTER: documents-required
UPDATE seo_pages SET
  h1 = 'Documents Required for Solar Subsidy in India: Complete Checklist',
  meta_title = 'Documents Required for Solar Subsidy India 2026: PM Surya Ghar Checklist | Solar Vipani',
  meta_description = 'Complete document checklist for solar subsidy application under PM Surya Ghar. Aadhaar, electricity bill, bank details, roof proof — everything you need before applying.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>You need <strong>6 key documents</strong> to apply for solar subsidy under PM Surya Ghar: recent electricity bill, Aadhaar card (linked to mobile and bank), bank account details, passport-size photo, roof ownership proof, and PAN card (optional). Your installer will additionally need installation certificates and equipment serial numbers for the post-installation subsidy claim.</p>"
    },
    {
      "heading": "Documents for Portal Registration (Phase 1)",
      "body": "<p>These documents are needed when you first register on the PM Surya Ghar portal:</p><table><thead><tr><th>Document</th><th>Purpose</th><th>Requirements</th></tr></thead><tbody><tr><td>Electricity bill</td><td>Verify consumer number and residential tariff</td><td>Latest bill, not older than 3 months. Clear photo/scan showing consumer number</td></tr><tr><td>Aadhaar card</td><td>Identity verification and DBT linkage</td><td>Must be linked to registered mobile (for OTP) and bank account</td></tr><tr><td>Bank account details</td><td>Subsidy credit via DBT</td><td>Account number + IFSC code. Must match Aadhaar-linked account</td></tr><tr><td>Passport-size photo</td><td>Application record</td><td>Digital copy, clear face, recent photo</td></tr><tr><td>PAN card</td><td>Additional identification</td><td>Optional but recommended for faster processing</td></tr></tbody></table><p><strong>Critical:</strong> The Aadhaar-bank account link is the #1 cause of subsidy disbursement failures. Verify your linkage at your bank or via UIDAI before applying.</p>"
    },
    {
      "heading": "Roof and Property Documents",
      "body": "<p>You must prove you have the right to install panels on the roof:</p><ul><li><strong>Individual house:</strong> Property tax receipt, sale deed, or registry document. Any one is sufficient</li><li><strong>Apartment/flat:</strong> Housing society NOC (No Objection Certificate) + society resolution authorising rooftop solar + allotment letter or sale deed for your flat</li><li><strong>Rented property:</strong> Landlord''s written consent letter + electricity connection must be in applicant''s name (not landlord''s)</li><li><strong>Government quarters:</strong> Allotment letter + NOC from the department/authority</li></ul><p>The portal may ask you to upload a photograph of your roof showing the proposed installation area. Take a clear daytime photo from a vantage point showing the available shadow-free area.</p>"
    },
    {
      "heading": "Documents for DISCOM Approval (Phase 2)",
      "body": "<p>After portal registration, your DISCOM may request additional documents during feasibility assessment:</p><ul><li><strong>Sanctioned load certificate</strong> — Shows your current sanctioned load. Available from your DISCOM office or often printed on your bill. System size cannot exceed sanctioned load</li><li><strong>Single-line diagram</strong> — Technical drawing of the proposed solar connection. Your installer prepares this</li><li><strong>Structural stability certificate</strong> — Some DISCOMs require this for older buildings. A civil engineer certifies the roof can support panel weight</li></ul><p>Most of these are handled by your installer. Your role is to provide the consumer-side documents; the installer manages technical documentation.</p>"
    },
    {
      "heading": "Post-Installation Documents (Phase 3)",
      "body": "<p>After installation, your vendor uploads these to the portal for subsidy processing:</p><ul><li><strong>Installation completion certificate</strong> — Vendor certifies that installation is complete per approved specifications</li><li><strong>Equipment details</strong> — Panel brand, model, wattage, serial numbers. Inverter brand, model, capacity, serial number. All must match BIS-certified equipment</li><li><strong>System photographs</strong> — Photos of installed panels, inverter, meter, earthing, and wiring as per portal requirements</li><li><strong>Net metering application</strong> — Submitted to DISCOM for bi-directional meter installation</li><li><strong>Commissioning report</strong> — DISCOM issues this after inspection. Uploaded by DISCOM or vendor to portal</li></ul><p>Keep copies of all equipment invoices and warranty cards. These are not required for subsidy but essential for warranty claims.</p>"
    },
    {
      "heading": "Document Specifications and Upload Requirements",
      "body": "<p>The PM Surya Ghar portal has specific upload requirements:</p><ul><li><strong>File format:</strong> PDF or JPEG for most documents</li><li><strong>File size:</strong> Usually 2–5 MB maximum per document</li><li><strong>Quality:</strong> Text must be legible. Blurry, cropped, or dark uploads get rejected</li><li><strong>Language:</strong> Documents in any Indian language are accepted. No translation needed</li><li><strong>Validity:</strong> Electricity bill must be within last 3 months. Aadhaar and PAN have no expiry concern</li></ul><p>Scan documents using your phone camera with good lighting. Many phone scanning apps (like Google Drive''s scan feature) produce cleaner results than photographs.</p>"
    },
    {
      "heading": "Common Document Issues and How to Resolve Them",
      "body": "<p>These issues cause the most delays in subsidy processing:</p><ol><li><strong>Aadhaar not linked to bank account</strong> — Visit your bank branch with Aadhaar and request linkage. Takes 1–3 working days. Verify via NPCI mapper</li><li><strong>Aadhaar mobile not updated</strong> — OTP verification requires the mobile number registered with UIDAI. Update at an Aadhaar centre if needed (takes 7–15 days)</li><li><strong>Consumer number mismatch</strong> — Some DISCOMs have different consumer number formats for billing vs connection. Use the number printed on the top of your latest bill</li><li><strong>Housing society NOC delays</strong> — Start the NOC process early. Draft a standard resolution and present it at the next society meeting. Most societies approve readily once they understand the process</li><li><strong>Name mismatch across documents</strong> — Aadhaar name, bank account name, and electricity bill name should match. Minor variations (initials vs full name) are usually accepted, but completely different names will cause rejection</li></ol>"
    },
    {
      "heading": "Quick Document Checklist",
      "body": "<p>Use this checklist before starting your application:</p><ul><li>☐ Latest electricity bill (within 3 months)</li><li>☐ Aadhaar card (linked to mobile + bank account)</li><li>☐ Bank passbook or cancelled cheque (for account + IFSC details)</li><li>☐ Passport-size photo (digital)</li><li>☐ Roof ownership proof (tax receipt / sale deed / society NOC)</li><li>☐ Roof photograph (clear, daytime, showing installation area)</li><li>☐ PAN card (optional)</li></ul><p>With these documents ready, portal registration takes about 15 minutes.</p><p>→ <a href=\"/in/solar-subsidy/how-to-apply/\">Start your application — step-by-step guide</a></p>"
    },
    {
      "heading": "Let Your Installer Handle the Paperwork",
      "body": "<p>Solar Vipani''s verified installers guide you through every document requirement and help with portal registration. You provide the basic consumer documents; they handle all technical and post-installation paperwork.</p><p><a href=\"/in/get-quotes/\">Get free quotes from installers who manage the full process →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What documents do I need for solar panel subsidy?",
      "answer": "You need: recent electricity bill, Aadhaar card (linked to mobile and bank), bank account details, passport-size photo, and roof ownership proof (property tax receipt or housing society NOC). PAN card is optional but recommended. Your installer handles all technical documentation."
    },
    {
      "question": "Does Aadhaar need to be linked to bank account for solar subsidy?",
      "answer": "Yes, mandatory. The subsidy is disbursed via Direct Benefit Transfer (DBT) to your Aadhaar-linked bank account. If the linkage is missing or incorrect, the subsidy payment will fail. Verify your linkage at your bank branch or through the NPCI mapper portal before applying."
    },
    {
      "question": "What if my electricity bill name differs from Aadhaar name?",
      "answer": "Minor variations like initials are usually accepted. If the names are significantly different, you may need to update either your DISCOM records or Aadhaar to match. Contact your DISCOM for a name correction on the electricity bill — it typically takes 7–15 days."
    },
    {
      "question": "Do I need NOC from housing society for solar subsidy?",
      "answer": "Yes, if you live in an apartment or housing society. The society must pass a formal resolution authorising rooftop solar installation and allocating roof space. Submit this NOC with your PM Surya Ghar application. Individual homeowners with their own roof do not need an NOC."
    },
    {
      "question": "What happens if I upload wrong or blurry documents?",
      "answer": "The application gets flagged for document resubmission. You receive a notification to re-upload the specific document. This adds 7–15 days to the process. Use a phone scanner app for clean document uploads and verify all details are legible before submitting."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'documents-required' AND pillar_slug = 'solar-subsidy';


-- 2. CLUSTER: application-process
UPDATE seo_pages SET
  h1 = 'Solar Subsidy Application Process in India: Timeline & What to Expect',
  meta_title = 'Solar Subsidy Application Process 2026: Complete Timeline | Solar Vipani',
  meta_description = 'End-to-end solar subsidy application process — registration, DISCOM approval, installation, inspection, and disbursement. Know exactly what to expect at each stage.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The solar subsidy application process has <strong>6 stages</strong>: portal registration (1 day), DISCOM feasibility (7–15 days), vendor selection and installation (7–21 days), net metering (15–30 days), DISCOM inspection (7–15 days), and subsidy disbursement (15–45 days). Total timeline: <strong>2–4 months</strong> from first click to money in your bank.</p>"
    },
    {
      "heading": "Process Overview: 6 Stages",
      "body": "<p>The PM Surya Ghar subsidy application follows a defined pipeline. Here is the full map:</p><table><thead><tr><th>Stage</th><th>What Happens</th><th>Who Acts</th><th>Duration</th></tr></thead><tbody><tr><td>1. Registration</td><td>Create account, upload documents</td><td>You</td><td>1 day</td></tr><tr><td>2. Feasibility</td><td>DISCOM verifies technical viability</td><td>DISCOM</td><td>7–15 days</td></tr><tr><td>3. Installation</td><td>Vendor installs system</td><td>Installer</td><td>7–21 days</td></tr><tr><td>4. Net metering</td><td>Bi-directional meter installed</td><td>DISCOM</td><td>15–30 days</td></tr><tr><td>5. Inspection</td><td>Technical inspection + commissioning</td><td>DISCOM</td><td>7–15 days</td></tr><tr><td>6. Disbursement</td><td>Subsidy credited via DBT</td><td>MNRE</td><td>15–45 days</td></tr></tbody></table><p>Your active involvement is needed only in Stages 1 and 3 (registration and coordinating with your installer). The rest is handled by the DISCOM and your vendor.</p><p>→ <a href=\"/in/solar-subsidy/how-to-apply/\">Detailed step-by-step application guide</a></p>"
    },
    {
      "heading": "Stage 1: Portal Registration",
      "body": "<p>Register on the PM Surya Ghar national portal with your electricity consumer number. The portal verifies your DISCOM connection and creates your application profile.</p><p><strong>What you do:</strong></p><ul><li>Enter consumer number, state, and DISCOM</li><li>Verify mobile via OTP</li><li>Upload documents: electricity bill, Aadhaar, bank details, photo</li><li>Select preferred system size (1kW–10kW)</li></ul><p><strong>Typical issues:</strong> Consumer number not found (contact DISCOM), Aadhaar OTP not received (check mobile linkage with UIDAI).</p><p>→ <a href=\"/in/solar-subsidy/documents-required/\">Documents you need for registration</a></p>"
    },
    {
      "heading": "Stage 2: DISCOM Feasibility Approval",
      "body": "<p>Your DISCOM reviews the application to confirm technical feasibility:</p><ul><li><strong>Transformer check:</strong> Is the local transformer capable of handling additional solar injection?</li><li><strong>Feeder load:</strong> What percentage of the feeder''s consumers already have solar? Some feeders are saturated</li><li><strong>Sanctioned load:</strong> Your solar system cannot exceed your sanctioned load</li></ul><p><strong>Outcome:</strong> Approved (proceed to vendor selection) or rejected (usually with reason — transformer capacity, feeder saturation). Rejection can be appealed or resolved by reducing system size.</p><p><strong>Timeline:</strong> 7–15 working days. Fast DISCOMs like BESCOM process in under 7 days. Slower DISCOMs may take 3–4 weeks.</p>"
    },
    {
      "heading": "Stage 3: Vendor Selection and Installation",
      "body": "<p>After feasibility approval, select your installer and proceed with installation:</p><ol><li><strong>Vendor selection:</strong> Choose from MNRE-empanelled vendors on the portal. Compare quotes from 2–3 installers</li><li><strong>Site survey:</strong> Vendor assesses your roof (1 day)</li><li><strong>Contract and payment:</strong> Agree on scope, timeline, and payment terms. Most vendors take 50–70% advance</li><li><strong>Installation:</strong> Physical installation of panels, inverter, mounting, and wiring (1–3 days for residential)</li><li><strong>Portal update:</strong> Vendor uploads equipment details, serial numbers, and installation photos</li></ol><p>Solar Vipani makes vendor selection easy — all installers on our platform are MNRE-empanelled and subsidy-authorised. <a href=\"/in/get-quotes/\">Get quotes →</a></p><p>→ <a href=\"/in/solar-installation/process/\">What to expect during installation</a></p>"
    },
    {
      "heading": "Stage 4: Net Metering",
      "body": "<p>Your vendor applies to the DISCOM for net metering after installation:</p><ul><li><strong>Application:</strong> Vendor submits net metering request with system details and single-line diagram</li><li><strong>Meter procurement:</strong> DISCOM arranges bi-directional meter (or you purchase per local policy)</li><li><strong>Meter installation:</strong> DISCOM technician replaces your existing meter. Takes 15–30 days from application</li><li><strong>Grid synchronisation:</strong> System is connected to grid and tested for proper export/import</li></ul><p>This stage has the most variability in timeline. Some DISCOMs batch meter installations weekly, others process individually. Active follow-up by your installer helps.</p><p>→ <a href=\"/in/solar-subsidy/net-metering/\">Complete net metering guide</a></p>"
    },
    {
      "heading": "Stage 5: DISCOM Inspection and Commissioning",
      "body": "<p>After net meter installation, the DISCOM conducts a technical inspection:</p><ul><li><strong>Safety check:</strong> Earthing, isolators, surge protection, and wiring compliance</li><li><strong>Equipment verification:</strong> Panel and inverter serial numbers match portal declaration</li><li><strong>BIS certification check:</strong> Equipment carries valid Bureau of Indian Standards marks</li><li><strong>Performance test:</strong> System is generating power and exporting to grid correctly</li><li><strong>Commissioning certificate:</strong> DISCOM uploads the commissioning report to the PM Surya Ghar portal</li></ul><p>If any deficiency is found, you get a correction notice. The installer fixes the issue, and re-inspection is scheduled. This rarely happens with experienced, empanelled vendors.</p>"
    },
    {
      "heading": "Stage 6: Subsidy Disbursement",
      "body": "<p>The final stage — subsidy reaches your bank:</p><ol><li>DISCOM''s commissioning report triggers subsidy processing on the central portal</li><li>MNRE verifies installation details against approved specifications</li><li>Subsidy amount is calculated based on actually installed capacity</li><li>Payment is processed through the government''s Public Financial Management System (PFMS)</li><li>Amount is credited to your Aadhaar-linked bank account via DBT</li></ol><p><strong>Timeline:</strong> 15–45 days after commissioning report upload. You receive an SMS when the amount is credited.</p><p><strong>If DBT fails:</strong> Usually due to Aadhaar-bank linkage issues. Resolve the linkage at your bank and raise a ticket on the portal for re-processing.</p>"
    },
    {
      "heading": "How to Track Your Application",
      "body": "<p>Monitor your application at every stage:</p><ul><li><strong>PM Surya Ghar portal:</strong> Log in to see current status, pending actions, and any deficiency notices</li><li><strong>SMS notifications:</strong> You receive automated SMS at each stage transition</li><li><strong>Installer dashboard:</strong> Your vendor can also track status and flag delays</li><li><strong>DISCOM helpline:</strong> For net metering delays, contact your DISCOM''s rooftop solar cell directly</li></ul><p>If your application is stuck at any stage for more than the expected timeline, raise a grievance on the portal. Include your application number and consumer number.</p>"
    },
    {
      "heading": "Start Your Application With Expert Support",
      "body": "<p>The process is straightforward but benefits from an experienced installer''s guidance. Solar Vipani''s verified installers manage the end-to-end process — from portal registration assistance to subsidy follow-up.</p><p><a href=\"/in/get-quotes/\">Get free quotes from process-savvy installers →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "How long does the complete solar subsidy process take?",
      "answer": "From portal registration to subsidy credit, the process takes 2–4 months. The biggest variable is your DISCOM''s net metering and inspection timeline. Fast DISCOMs (like BESCOM) can complete the whole process in under 60 days. Slower ones may take 90–120 days."
    },
    {
      "question": "Can I install solar before getting DISCOM feasibility approval?",
      "answer": "No. You must receive DISCOM feasibility approval before installation. Installing first and applying later will result in subsidy rejection. The correct sequence is: register → get approval → install → get inspected → receive subsidy."
    },
    {
      "question": "What if my subsidy application is stuck at one stage?",
      "answer": "If your application has not progressed beyond the expected timeline, raise a grievance on the PM Surya Ghar portal with your application number. You can also contact your DISCOM''s rooftop solar cell directly. Your installer should be following up on your behalf."
    },
    {
      "question": "Can I change my installer after feasibility approval?",
      "answer": "Yes, you can change your empanelled vendor on the portal after feasibility approval and before installation. Log in, cancel the current vendor selection, and choose a new MNRE-empanelled installer. This does not affect your feasibility approval."
    },
    {
      "question": "What if the DISCOM inspection finds a deficiency?",
      "answer": "You receive a deficiency notice specifying what needs correction — typically a wiring issue, missing earthing, or equipment mismatch. Your installer fixes the issue, and the DISCOM schedules a re-inspection. This adds 7–15 days but does not cancel your subsidy eligibility."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'application-process' AND pillar_slug = 'solar-subsidy';


-- 3. CLUSTER: state-subsidy
UPDATE seo_pages SET
  h1 = 'State Solar Subsidy Schemes in India 2026: Beyond Central Government',
  meta_title = 'State Solar Subsidy Schemes India 2026: Gujarat, Delhi, Rajasthan & More | Solar Vipani',
  meta_description = 'State-level solar subsidies beyond PM Surya Ghar. Gujarat Surya scheme, Delhi generation incentive, Rajasthan top-up, and more. Know what your state offers.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>Several Indian states offer <strong>additional solar subsidies on top of the central PM Surya Ghar scheme</strong>. Gujarat leads with ₹10,000/kW state top-up, Delhi offers a ₹2/unit generation incentive for 5 years, and Rajasthan provides ₹5,000–₹10,000/kW for rural households. Most other states currently provide only the central subsidy. State subsidies are funded by state budgets and can change annually.</p>"
    },
    {
      "heading": "How State Subsidies Differ from Central Subsidy",
      "body": "<p>Understanding the distinction is critical for maximising your benefit:</p><table><thead><tr><th>Feature</th><th>Central (PM Surya Ghar)</th><th>State Subsidies</th></tr></thead><tbody><tr><td>Funding</td><td>MNRE / central budget</td><td>State government / DISCOM</td></tr><tr><td>Availability</td><td>All states, all DISCOMs</td><td>Select states only</td></tr><tr><td>Rates</td><td>Fixed nationally</td><td>Varies by state and year</td></tr><tr><td>Application</td><td>PM Surya Ghar portal</td><td>State/DISCOM portal (separate)</td></tr><tr><td>Disbursement</td><td>DBT to bank account</td><td>DBT, bill credit, or upfront discount</td></tr><tr><td>Stability</td><td>Fixed until 2027</td><td>Subject to annual budget review</td></tr></tbody></table><p>You always get the central subsidy first. The state subsidy is an additional bonus where available.</p>"
    },
    {
      "heading": "Gujarat: Surya Gujarat Scheme",
      "body": "<p>Gujarat offers India''s most generous state top-up:</p><ul><li><strong>Amount:</strong> ₹10,000/kW additional subsidy (up to 10 kW systems)</li><li><strong>For 3 kW system:</strong> ₹30,000 state + ₹78,000 central = ₹1,08,000 total</li><li><strong>Eligibility:</strong> All residential consumers in Gujarat (UGVCL, MGVCL, PGVCL, DGVCL)</li><li><strong>Application:</strong> Apply through the Surya Gujarat portal after PM Surya Ghar registration</li><li><strong>Disbursement:</strong> Credited to bank account after central subsidy is processed</li></ul><p>Gujarat has been India''s rooftop solar leader, with over 10 lakh residential installations. The strong state subsidy is a major driver.</p>"
    },
    {
      "heading": "Delhi: Generation-Based Incentive",
      "body": "<p>Delhi takes a unique approach — instead of upfront subsidy, it offers a per-unit incentive:</p><ul><li><strong>Amount:</strong> ₹2 per unit of solar electricity generated for 5 years</li><li><strong>For 3 kW system:</strong> ~₹9,000–₹10,000 annually for 5 years = ~₹45,000–₹50,000 total</li><li><strong>On top of:</strong> Central PM Surya Ghar subsidy of ₹78,000</li><li><strong>Combined benefit:</strong> ₹78,000 upfront + ₹45,000–₹50,000 over 5 years = ~₹1,28,000 total</li><li><strong>DISCOMs:</strong> BSES Rajdhani, BSES Yamuna, TPDDL, NDMC</li></ul><p>With Delhi''s high electricity tariffs (₹8–₹12/unit for higher slabs), rooftop solar here delivers the fastest payback in India — often under 3 years.</p>"
    },
    {
      "heading": "Rajasthan: Rural and BPL Top-Up",
      "body": "<p>Rajasthan offers additional support targeting rural and below-poverty-line households:</p><ul><li><strong>Amount:</strong> ₹5,000–₹10,000/kW additional for eligible categories</li><li><strong>Eligibility:</strong> Primarily rural households and BPL card holders</li><li><strong>Application:</strong> Through RRECL (Rajasthan Renewable Energy Corporation Limited)</li><li><strong>Solar irradiance advantage:</strong> Rajasthan has India''s highest solar radiation (5.5–6.0 peak sun hours), meaning systems here generate 15–20% more than the national average</li></ul><p>Even without the state top-up, Rajasthan''s superior solar conditions make rooftop solar exceptionally rewarding here.</p>"
    },
    {
      "heading": "Uttarakhand: Flat Additional Subsidy",
      "body": "<p>Uttarakhand provides a straightforward flat top-up:</p><ul><li><strong>Amount:</strong> ₹15,000 flat additional subsidy for systems up to 3 kW</li><li><strong>Total for 3 kW:</strong> ₹78,000 central + ₹15,000 state = ₹93,000</li><li><strong>DISCOM:</strong> UPCL (Uttarakhand Power Corporation Limited)</li><li><strong>Application:</strong> Through UPCL''s rooftop solar portal</li></ul>"
    },
    {
      "heading": "States Without Additional Subsidy",
      "body": "<p>Most Indian states currently rely solely on the central PM Surya Ghar subsidy without a state top-up. Major states in this category:</p><ul><li><strong>Maharashtra</strong> — No state top-up. MSEDCL processes central subsidy. Maharashtra has high adoption despite no state incentive due to high tariffs</li><li><strong>Karnataka</strong> — No state top-up, but BESCOM''s efficient processing makes the central subsidy experience smooth</li><li><strong>Tamil Nadu</strong> — No state top-up. TANGEDCO handles net metering</li><li><strong>Uttar Pradesh</strong> — No state top-up. Growing adoption driven by central subsidy alone</li><li><strong>Kerala</strong> — No state top-up. KSEB provides net metering</li><li><strong>Punjab, Haryana, Andhra Pradesh, Telangana</strong> — Central subsidy only</li></ul><p>Even without state top-ups, the central ₹78,000 subsidy reduces 3 kW system cost by 40–50%, making solar highly attractive.</p>"
    },
    {
      "heading": "How to Check and Claim State Subsidy",
      "body": "<p>State subsidies require separate applications from the central scheme:</p><ol><li><strong>Verify availability:</strong> Check your state renewable energy agency or DISCOM website for current schemes</li><li><strong>Apply for central first:</strong> Complete PM Surya Ghar registration and installation</li><li><strong>Apply for state top-up:</strong> Submit application on the state/DISCOM portal with installation proof</li><li><strong>Disbursement:</strong> State subsidy is processed after central subsidy confirmation</li></ol><p>Your installer should know the current state subsidy landscape and guide you through both applications.</p><p>Use our <a href=\"/in/tools/subsidy-checker/\">Subsidy Checker</a> to see the combined central + state subsidy for your location.</p>"
    },
    {
      "heading": "Get the Maximum Subsidy for Your State",
      "body": "<p>Solar Vipani''s local installers know your state''s subsidy policies inside out. They ensure you claim every rupee of subsidy you''re entitled to — both central and state.</p><p><a href=\"/in/get-quotes/\">Get free quotes with full subsidy calculation →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "Which states offer additional solar subsidy beyond PM Surya Ghar?",
      "answer": "Gujarat (₹10,000/kW top-up), Delhi (₹2/unit generation incentive for 5 years), Rajasthan (₹5,000–₹10,000/kW for rural/BPL), and Uttarakhand (₹15,000 flat) are the notable states with additional subsidies. Most other states provide only the central PM Surya Ghar subsidy."
    },
    {
      "question": "Do I need to apply separately for state and central subsidy?",
      "answer": "Yes. Central subsidy is applied through the PM Surya Ghar portal. State subsidies, where available, require a separate application on the state renewable energy agency or DISCOM portal. Your installer typically handles both applications."
    },
    {
      "question": "Can state subsidies be discontinued mid-year?",
      "answer": "Yes. State subsidies are budget-dependent and can be revised or discontinued when funds are exhausted. Gujarat''s Surya scheme has been stable, but smaller state schemes may vary. Verify current availability before finalising your installation timeline."
    },
    {
      "question": "Is there a solar subsidy for Maharashtra?",
      "answer": "Maharashtra provides the central PM Surya Ghar subsidy (up to ₹78,000) but currently has no additional state top-up. Despite this, Maharashtra has high rooftop solar adoption due to high MSEDCL tariffs making solar economically attractive even with central subsidy alone."
    },
    {
      "question": "How much total subsidy can I get in Gujarat for a 3 kW system?",
      "answer": "In Gujarat, a 3 kW system qualifies for ₹78,000 central subsidy (PM Surya Ghar) plus ₹30,000 state top-up (Surya Gujarat at ₹10,000/kW) = approximately ₹1,08,000 total. This can bring the net cost of a 3 kW system below ₹60,000."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'state-subsidy' AND pillar_slug = 'solar-subsidy';


-- 4. CLUSTER: central-subsidy
UPDATE seo_pages SET
  h1 = 'Central Solar Subsidy Rates in India 2026: MNRE Scheme Breakdown',
  meta_title = 'Central Solar Subsidy Rates 2026: MNRE Per-kW Rates & Calculation | Solar Vipani',
  meta_description = 'Central solar subsidy rates under PM Surya Ghar — ₹30,000/kW up to 2kW, ₹18,000/kW for 3rd kW. See exact amounts by system size and how disbursement works.',
  content = '[
    {
      "heading": "The Short Answer",
      "body": "<p>The central solar subsidy under PM Surya Ghar follows a <strong>tiered per-kW rate</strong>: ₹30,000/kW for the first 2 kW and ₹18,000/kW for capacity between 2–3 kW. <strong>Maximum subsidy: ₹78,000</strong> (at 3 kW). Systems above 3 kW still receive only ₹78,000. The subsidy is a one-time capital grant credited to your bank account — not a loan or tax benefit.</p>"
    },
    {
      "heading": "Subsidy Rate Structure Explained",
      "body": "<p>The tiered structure intentionally favours smaller systems, where subsidy has the most impact:</p><table><thead><tr><th>Capacity Slab</th><th>Subsidy Rate</th><th>Cumulative Subsidy</th><th>% of Typical System Cost</th></tr></thead><tbody><tr><td>First 1 kW</td><td>₹30,000/kW</td><td>₹30,000</td><td>40–50%</td></tr><tr><td>1–2 kW</td><td>₹30,000/kW</td><td>₹60,000</td><td>43–55%</td></tr><tr><td>2–3 kW</td><td>₹18,000/kW</td><td>₹78,000</td><td>41–52%</td></tr><tr><td>Above 3 kW</td><td>₹0/kW (capped)</td><td>₹78,000</td><td>Decreasing %</td></tr></tbody></table><p><strong>Design intent:</strong> For a 1 kW system, subsidy covers 40–50% of cost. For 10 kW, only about 12–15%. This steers the scheme towards the households that benefit most from the financial support.</p>"
    },
    {
      "heading": "Subsidy Amount by System Size",
      "body": "<p>Here is the exact subsidy you receive for each common system size:</p><table><thead><tr><th>System Size</th><th>Subsidy Calculation</th><th>Total Subsidy</th><th>System Cost (avg)</th><th>Net Cost</th></tr></thead><tbody><tr><td>1 kW</td><td>1 × ₹30,000</td><td>₹30,000</td><td>₹70,000</td><td>~₹40,000</td></tr><tr><td>1.5 kW</td><td>1.5 × ₹30,000</td><td>₹45,000</td><td>₹95,000</td><td>~₹50,000</td></tr><tr><td>2 kW</td><td>2 × ₹30,000</td><td>₹60,000</td><td>₹1,25,000</td><td>~₹65,000</td></tr><tr><td>2.5 kW</td><td>(2 × ₹30,000) + (0.5 × ₹18,000)</td><td>₹69,000</td><td>₹1,45,000</td><td>~₹76,000</td></tr><tr><td>3 kW</td><td>(2 × ₹30,000) + (1 × ₹18,000)</td><td>₹78,000</td><td>₹1,70,000</td><td>~₹92,000</td></tr><tr><td>4 kW</td><td>Capped</td><td>₹78,000</td><td>₹2,20,000</td><td>~₹1,42,000</td></tr><tr><td>5 kW</td><td>Capped</td><td>₹78,000</td><td>₹2,85,000</td><td>~₹2,07,000</td></tr><tr><td>10 kW</td><td>Capped</td><td>₹78,000</td><td>₹5,75,000</td><td>~₹4,97,000</td></tr></tbody></table><p><em>System costs are indicative averages. Actual prices vary by panel brand, inverter type, and location.</em></p><p>→ <a href=\"/in/rooftop-solar/cost/\">Detailed system cost breakdown</a></p>"
    },
    {
      "heading": "Subsidy vs Other Financial Incentives",
      "body": "<p>The central subsidy is a direct capital grant. Here is how it compares to other available incentives:</p><table><thead><tr><th>Incentive</th><th>Type</th><th>For Whom</th><th>Value (3 kW)</th></tr></thead><tbody><tr><td>PM Surya Ghar subsidy</td><td>Upfront capital grant</td><td>Residential</td><td>₹78,000 one-time</td></tr><tr><td>Accelerated depreciation</td><td>Tax benefit</td><td>Commercial/Industrial</td><td>~₹72,000 tax saving*</td></tr><tr><td>State top-up (Gujarat)</td><td>Additional grant</td><td>Residential</td><td>₹30,000 one-time</td></tr><tr><td>Net metering savings</td><td>Bill reduction</td><td>All grid-connected</td><td>₹15,000–₹40,000/year</td></tr></tbody></table><p><em>*Accelerated depreciation calculated at 40% on ₹1,80,000 system cost at 30% corporate tax rate. Not applicable to residential.</em></p><p>Residential consumers benefit from the subsidy as a direct cost reduction. The ongoing savings from net metering add up to far more over the system''s 25-year life.</p>"
    },
    {
      "heading": "How the Subsidy Is Disbursed",
      "body": "<p>The central subsidy flows through a defined government payment pipeline:</p><ol><li><strong>Trigger:</strong> DISCOM uploads commissioning report to PM Surya Ghar portal</li><li><strong>Verification:</strong> MNRE verifies installation matches approved specifications</li><li><strong>Approval:</strong> Subsidy amount calculated based on installed (not applied-for) capacity</li><li><strong>Payment processing:</strong> Routed through Public Financial Management System (PFMS)</li><li><strong>DBT credit:</strong> Amount credited to your Aadhaar-linked bank account</li><li><strong>Confirmation:</strong> SMS notification sent on successful credit</li></ol><p><strong>Timeline:</strong> 15–45 days from commissioning to bank credit. If your Aadhaar-bank linkage has issues, the payment bounces and needs re-processing after linkage correction.</p>"
    },
    {
      "heading": "Important Rules and Limitations",
      "body": "<p>Know these rules to avoid surprises:</p><ul><li><strong>One subsidy per consumer number:</strong> If you already received subsidy under a previous MNRE scheme, you cannot claim again under PM Surya Ghar</li><li><strong>On-grid only:</strong> Off-grid and standalone systems are excluded. The system must be grid-connected with net metering</li><li><strong>Cannot be combined with commercial depreciation:</strong> You choose either residential subsidy OR commercial accelerated depreciation, not both</li><li><strong>Capacity based on installation:</strong> If you applied for 3 kW but installed 2 kW, subsidy is calculated on 2 kW (₹60,000, not ₹78,000)</li><li><strong>No retrospective claims:</strong> Systems installed before PM Surya Ghar registration do not qualify</li></ul>"
    },
    {
      "heading": "Is 3 kW the Sweet Spot?",
      "body": "<p>From a pure subsidy-optimisation perspective, <strong>3 kW maximises your per-kW subsidy benefit</strong>. But the right system size depends on your electricity consumption, not just subsidy:</p><ul><li>If your monthly bill is under ₹1,500 → 1–2 kW is sufficient (₹30,000–₹60,000 subsidy)</li><li>If your bill is ₹1,500–₹3,000 → 3 kW is optimal (₹78,000 subsidy, best value)</li><li>If your bill exceeds ₹3,000 → 5 kW+ makes economic sense despite lower subsidy-per-kW</li></ul><p>The subsidy is a one-time benefit. Your 25-year electricity savings dwarf the subsidy amount. Size your system for maximum long-term savings, not just maximum subsidy percentage.</p><p>→ <a href=\"/in/tools/solar-calculator/\">Calculate your optimal system size</a></p>"
    },
    {
      "heading": "Get Your Exact Subsidy Amount",
      "body": "<p>Solar Vipani''s installers provide quotes that clearly show your subsidy amount and net out-of-pocket cost. No guesswork.</p><p><a href=\"/in/get-quotes/\">Get free solar quotes with subsidy breakdown →</a></p>"
    }
  ]',
  faq = '[
    {
      "question": "What is the exact central subsidy for a 3 kW solar system?",
      "answer": "For a 3 kW system: (2 kW × ₹30,000) + (1 kW × ₹18,000) = ₹78,000. This is the maximum central subsidy available. Systems above 3 kW also receive ₹78,000 — the subsidy does not increase beyond 3 kW."
    },
    {
      "question": "Why is the subsidy capped at 3 kW?",
      "answer": "The tiered structure ensures maximum benefit reaches households with modest energy needs. The ₹78,000 cap at 3 kW means the subsidy covers 40–50% of a 3 kW system cost. For larger systems (5–10 kW), which typically belong to higher-income households, the same ₹78,000 represents a smaller percentage."
    },
    {
      "question": "Is the central subsidy a loan or a grant?",
      "answer": "It is a direct, non-refundable grant. You do not need to repay it. The amount is credited to your bank account via DBT after installation and DISCOM verification. There is no EMI, interest, or repayment obligation."
    },
    {
      "question": "Can I get central subsidy for a solar system larger than 10 kW?",
      "answer": "PM Surya Ghar allows residential systems up to 10 kW (or your sanctioned load, whichever is lower). The subsidy remains capped at ₹78,000 regardless of size above 3 kW. For systems above 10 kW, residential subsidy does not apply — these are typically classified as commercial."
    },
    {
      "question": "Has the central subsidy rate changed recently?",
      "answer": "The current PM Surya Ghar rates (₹30,000/kW up to 2 kW, ₹18,000/kW for 3rd kW) were set at launch in February 2024 and are fixed for the scheme period until 2027. Previous MNRE schemes had lower rates. The current rates are the highest central solar subsidy India has ever offered."
    }
  ]',
  updated_at = NOW()
WHERE slug = 'central-subsidy' AND pillar_slug = 'solar-subsidy';

COMMIT;
