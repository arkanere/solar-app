<script>
	import { isDarkMode } from '$lib/themeStore';
	import LeadFormBusiness from '$lib/LeadFormBusiness.svelte';

	let darkMode;
	$: darkMode = $isDarkMode;

	const lastUpdated = '2025-01-03';
	const lastUpdatedDisplay = 'January 3, 2025';
	const datePublished = '2025-01-03';

	const articleUrl = 'https://solarvipani.com/blogs/zero-cost-emi-schemes-solar';

	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Zero Cost EMI Schemes for Solar Panels in India: Complete Guide 2025',
		author: {
			'@type': 'Person',
			name: 'SolarVipani Admin',
			url: '/about-us'
		},
		datePublished: datePublished,
		dateModified: lastUpdated,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': articleUrl
		},
		publisher: {
			'@type': 'Organization',
			name: 'SolarVipani Admin'
		},
		description:
			'Complete guide to Zero Cost EMI schemes for solar panels in India. Learn about no-cost EMI options, eligibility, banks offering solar loans, and how to finance your solar installation without upfront payment.'
	};

	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<title>Zero Cost EMI Schemes for Solar Panels in India: Complete Guide 2025</title>
	<meta name="description" content="Complete guide to Zero Cost EMI schemes for solar panels in India. Learn about no-cost EMI options, eligibility, banks offering solar loans, and how to finance your solar installation without upfront payment." />
	<meta name="keywords" content="zero cost emi solar, no cost emi solar panels, solar loan emi, solar financing schemes, solar panel loan without down payment, solar emi calculator" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href={articleUrl} />

	{@html `
      <script type="application/ld+json">
        ${jsonLdString}
      </script>
    `}
</svelte:head>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<header class="blog-header">
			<h1>Zero Cost EMI Schemes for Solar Panels in India: Complete Guide 2025</h1>
			<p>By <a href="/about-us">SolarVipani Admin</a></p>
			<p>Last updated: <time datetime={lastUpdated}>{lastUpdatedDisplay}</time></p>
		</header>

		<p>
			Zero Cost EMI schemes have revolutionized solar panel financing in India, making renewable energy accessible to homeowners without requiring large upfront investments. These innovative financing options allow you to install solar panels with no down payment and convert the entire cost into convenient monthly installments. This comprehensive guide explains everything you need to know about Zero Cost EMI schemes for solar panels, helping you make an informed decision about financing your solar journey.
		</p>

		<h2>What are Zero Cost EMI Schemes for Solar Panels?</h2>
		<p>
			Zero Cost EMI (Equated Monthly Installment) schemes are financing options that allow customers to purchase solar panel systems without paying any upfront amount. Under these schemes:
		</p>
		<ul>
			<li>No down payment or processing fees required</li>
			<li>The entire solar system cost is converted into monthly EMIs</li>
			<li>Interest rates are often subsidized or absorbed by the manufacturer/installer</li>
			<li>Flexible tenure options from 6 months to 7 years</li>
			<li>Quick approval process with minimal documentation</li>
		</ul>

		<h2>How Zero Cost EMI Works for Solar Installations</h2>
		<p>The Zero Cost EMI process for solar panels follows a systematic approach:</p>

		<h3>Step 1: System Selection and Quotation</h3>
		<ul>
			<li>Choose your preferred solar system size (1kW, 3kW, 5kW, etc.)</li>
			<li>Get detailed quotation including all components and installation</li>
			<li>Review EMI options and tenure plans available</li>
		</ul>

		<h3>Step 2: EMI Application and Approval</h3>
		<ul>
			<li>Submit basic KYC documents and income proof</li>
			<li>Credit score verification (typically 650+ required)</li>
			<li>Instant approval through digital platforms</li>
			<li>EMI amount and tenure finalization</li>
		</ul>

		<h3>Step 3: Installation and EMI Commencement</h3>
		<ul>
			<li>Solar system installation by certified professionals</li>
			<li>System commissioning and performance testing</li>
			<li>EMI payments begin post-installation</li>
			<li>Start saving on electricity bills immediately</li>
		</ul>

		<h2>Types of Zero Cost EMI Schemes Available</h2>

		<h3>1. Manufacturer-Sponsored Zero Cost EMI</h3>
		<ul>
			<li><strong>Who Offers:</strong> Solar panel manufacturers like Tata Solar, Adani Solar, Vikram Solar</li>
			<li><strong>Benefits:</strong> Factory-direct pricing with financing</li>
			<li><strong>Tenure:</strong> 6-24 months typically</li>
			<li><strong>Interest:</strong> Absorbed by manufacturer</li>
		</ul>

		<h3>2. Bank Partnership EMI Schemes</h3>
		<ul>
			<li><strong>Who Offers:</strong> Banks in partnership with solar companies</li>
			<li><strong>Benefits:</strong> Longer tenure options and lower interest rates</li>
			<li><strong>Tenure:</strong> 12-84 months</li>
			<li><strong>Interest:</strong> Subsidized rates starting from 7.5%</li>
		</ul>

		<h3>3. NBFC Zero Cost EMI Programs</h3>
		<ul>
			<li><strong>Who Offers:</strong> NBFCs like Bajaj Finserv, HDFC Ltd, L&T Finance</li>
			<li><strong>Benefits:</strong> Quick approval and flexible terms</li>
			<li><strong>Tenure:</strong> 6-60 months</li>
			<li><strong>Interest:</strong> Promotional rates or EMI conversion offers</li>
		</ul>

		<h3>4. Credit Card EMI Conversion</h3>
		<ul>
			<li><strong>Who Offers:</strong> All major credit card providers</li>
			<li><strong>Benefits:</strong> Instant conversion of solar purchase to EMI</li>
			<li><strong>Tenure:</strong> 3-24 months</li>
			<li><strong>Interest:</strong> 0% during promotional periods</li>
		</ul>

		<h2>Major Banks and Financial Institutions Offering Solar EMI</h2>

		<h3>Public Sector Banks</h3>
		<ul>
			<li><strong>State Bank of India:</strong> SBI Green Car Loan (7.5-9% interest)</li>
			<li><strong>Bank of Baroda:</strong> Solar Equipment Financing (8-10% interest)</li>
			<li><strong>Punjab National Bank:</strong> PNB Solar Loan (8.5-10.5% interest)</li>
			<li><strong>Union Bank of India:</strong> Green Energy Financing (8-9.5% interest)</li>
		</ul>

		<h3>Private Sector Banks</h3>
		<ul>
			<li><strong>HDFC Bank:</strong> Solar Panel Loan (9-12% interest)</li>
			<li><strong>ICICI Bank:</strong> Home Energy Loan (9.5-13% interest)</li>
			<li><strong>Axis Bank:</strong> Green Loan (9-11.5% interest)</li>
			<li><strong>Kotak Mahindra Bank:</strong> Solar Financing (10-13% interest)</li>
		</ul>

		<h3>NBFCs and Specialized Lenders</h3>
		<ul>
			<li><strong>Bajaj Finserv:</strong> Solar Equipment EMI (0-15% based on tenure)</li>
			<li><strong>Tata Capital:</strong> Green Energy Loans (9-14% interest)</li>
			<li><strong>L&T Finance:</strong> Solar Panel Financing (10-15% interest)</li>
			<li><strong>Mahindra Finance:</strong> Sustainable Energy Loans (11-16% interest)</li>
		</ul>

		<h2>EMI Calculations for Different Solar System Sizes</h2>

		<h3>1kW Solar System EMI Examples</h3>
		<table class="emi-table">
			<thead>
				<tr>
					<th>System Cost</th>
					<th>Tenure</th>
					<th>Interest Rate</th>
					<th>Monthly EMI</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>₹70,000</td>
					<td>12 months</td>
					<td>0%</td>
					<td>₹5,833</td>
				</tr>
				<tr>
					<td>₹70,000</td>
					<td>24 months</td>
					<td>9%</td>
					<td>₹3,200</td>
				</tr>
				<tr>
					<td>₹70,000</td>
					<td>36 months</td>
					<td>10%</td>
					<td>₹2,260</td>
				</tr>
			</tbody>
		</table>

		<h3>3kW Solar System EMI Examples</h3>
		<table class="emi-table">
			<thead>
				<tr>
					<th>System Cost</th>
					<th>Tenure</th>
					<th>Interest Rate</th>
					<th>Monthly EMI</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>₹1,80,000</td>
					<td>24 months</td>
					<td>0%</td>
					<td>₹7,500</td>
				</tr>
				<tr>
					<td>₹1,80,000</td>
					<td>36 months</td>
					<td>9%</td>
					<td>₹5,720</td>
				</tr>
				<tr>
					<td>₹1,80,000</td>
					<td>60 months</td>
					<td>10%</td>
					<td>₹3,830</td>
				</tr>
			</tbody>
		</table>

		<h3>5kW Solar System EMI Examples</h3>
		<table class="emi-table">
			<thead>
				<tr>
					<th>System Cost</th>
					<th>Tenure</th>
					<th>Interest Rate</th>
					<th>Monthly EMI</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>₹3,00,000</td>
					<td>36 months</td>
					<td>0%</td>
					<td>₹8,333</td>
				</tr>
				<tr>
					<td>₹3,00,000</td>
					<td>60 months</td>
					<td>9%</td>
					<td>₹6,220</td>
				</tr>
				<tr>
					<td>₹3,00,000</td>
					<td>84 months</td>
					<td>10%</td>
					<td>₹4,890</td>
				</tr>
			</tbody>
		</table>

		<h2>Eligibility Criteria for Zero Cost EMI Schemes</h2>

		<h3>Basic Eligibility Requirements</h3>
		<ul>
			<li><strong>Age:</strong> 21-65 years for salaried, 25-70 years for self-employed</li>
			<li><strong>Income:</strong> Minimum ₹25,000 monthly for salaried, ₹3 lakhs annual for self-employed</li>
			<li><strong>Credit Score:</strong> 650+ (higher scores get better terms)</li>
			<li><strong>Employment:</strong> Stable job/business for minimum 2 years</li>
			<li><strong>Property:</strong> Own house or valid tenancy agreement</li>
		</ul>

		<h3>Required Documents</h3>
		<ul>
			<li><strong>Identity Proof:</strong> Aadhaar, PAN Card, Passport, Voter ID</li>
			<li><strong>Address Proof:</strong> Utility bills, rental agreement, property documents</li>
			<li><strong>Income Proof:</strong> Salary slips, ITR, bank statements, Form 16</li>
			<li><strong>Bank Statements:</strong> Last 6 months for salary account</li>
			<li><strong>Property Documents:</strong> Ownership proof or NOC from landlord</li>
		</ul>

		<h3>Credit Score Impact and Improvement</h3>
		<ul>
			<li>Credit scores 750+ get best interest rates and terms</li>
			<li>Scores 650-750 qualify for standard rates</li>
			<li>Scores below 650 may require co-guarantor or collateral</li>
			<li>Regular EMI payments improve credit score over time</li>
		</ul>

		<h2>Benefits of Zero Cost EMI for Solar Installations</h2>

		<h3>Financial Benefits</h3>
		<ul>
			<li><strong>No Upfront Payment:</strong> Start saving on electricity bills immediately</li>
			<li><strong>Cash Flow Management:</strong> Preserve working capital for other investments</li>
			<li><strong>Inflation Hedge:</strong> Fixed EMI protects against rising electricity costs</li>
			<li><strong>Tax Benefits:</strong> Interest paid qualifies for tax deductions</li>
			<li><strong>Immediate ROI:</strong> Monthly savings often exceed EMI amount</li>
		</ul>

		<h3>Convenience Benefits</h3>
		<ul>
			<li>Quick approval process with minimal paperwork</li>
			<li>Online application and approval systems</li>
			<li>Flexible tenure options to suit budget</li>
			<li>Pre-approved limits for existing bank customers</li>
			<li>Automated EMI deduction systems</li>
		</ul>

		<h3>Environmental and Social Benefits</h3>
		<ul>
			<li>Immediate contribution to renewable energy adoption</li>
			<li>Reduced carbon footprint from day one</li>
			<li>Support for government clean energy initiatives</li>
			<li>Enhanced property value and green credentials</li>
		</ul>

		<h2>EMI vs Electricity Bill: Cost Comparison Analysis</h2>

		<h3>3kW System Example</h3>
		<p><strong>Scenario:</strong> 3kW system costing ₹1,80,000 with 36-month EMI</p>
		<ul>
			<li><strong>Monthly EMI:</strong> ₹5,720 (at 9% interest)</li>
			<li><strong>Monthly Generation:</strong> 360-450 units</li>
			<li><strong>Electricity Bill Savings:</strong> ₹2,500-₄,000</li>
			<li><strong>Net Monthly Cost:</strong> ₹1,720-₹3,220</li>
			<li><strong>Post-EMI Period:</strong> Complete electricity bill savings</li>
		</ul>

		<h3>5kW System Example</h3>
		<p><strong>Scenario:</strong> 5kW system costing ₹3,00,000 with 60-month EMI</p>
		<ul>
			<li><strong>Monthly EMI:</strong> ₹6,220 (at 9% interest)</li>
			<li><strong>Monthly Generation:</strong> 600-750 units</li>
			<li><strong>Electricity Bill Savings:</strong> ₹4,500-₹6,500</li>
			<li><strong>Net Monthly Benefit:</strong> ₹280-₹1,720 (EMI &lt; Savings)</li>
			<li><strong>Post-EMI Period:</strong> ₹4,500-₹6,500 monthly savings</li>
		</ul>

		<h2>Top Zero Cost EMI Schemes in 2025</h2>

		<h3>1. Tata Power Solar EMI Scheme</h3>
		<ul>
			<li><strong>Partnership:</strong> HDFC Bank, SBI, ICICI</li>
			<li><strong>Interest Rate:</strong> 0% for 12 months, 8.5% thereafter</li>
			<li><strong>Max Tenure:</strong> 60 months</li>
			<li><strong>Processing Fee:</strong> Nil</li>
			<li><strong>Special Offer:</strong> Additional 5% cashback on select models</li>
		</ul>

		<h3>2. Bajaj Finserv Solar EMI</h3>
		<ul>
			<li><strong>Partnership:</strong> Multiple solar installers</li>
			<li><strong>Interest Rate:</strong> 0% for up to 24 months</li>
			<li><strong>Max Tenure:</strong> 48 months</li>
			<li><strong>Processing Fee:</strong> Nil</li>
			<li><strong>Special Offer:</strong> Instant approval within 4 hours</li>
		</ul>

		<h3>3. Amazon Pay Later Solar EMI</h3>
		<ul>
			<li><strong>Partnership:</strong> Select solar brands on Amazon</li>
			<li><strong>Interest Rate:</strong> 0% for 6-12 months</li>
			<li><strong>Max Tenure:</strong> 24 months</li>
			<li><strong>Processing Fee:</strong> Nil</li>
			<li><strong>Special Offer:</strong> Additional Amazon rewards points</li>
		</ul>

		<h2>Application Process for Zero Cost EMI</h2>

		<h3>Online Application Process</h3>
		<ol>
			<li><strong>Choose Solar System:</strong> Select system size and installer</li>
			<li><strong>EMI Calculator:</strong> Calculate EMI for different tenures</li>
			<li><strong>Online Form:</strong> Fill application with basic details</li>
			<li><strong>Document Upload:</strong> Upload required KYC and income documents</li>
			<li><strong>Instant Approval:</strong> Get approval status within hours</li>
			<li><strong>Installation Scheduling:</strong> Book installation date</li>
		</ol>

		<h3>Offline Application Process</h3>
		<ol>
			<li><strong>Dealer Visit:</strong> Visit authorized solar dealer/installer</li>
			<li><strong>System Selection:</strong> Choose system with expert guidance</li>
			<li><strong>EMI Discussion:</strong> Discuss financing options and terms</li>
			<li><strong>Document Submission:</strong> Submit physical documents</li>
			<li><strong>Credit Check:</strong> Dealer processes EMI application</li>
			<li><strong>Approval & Installation:</strong> Get approval and schedule installation</li>
		</ol>

		<h2>Things to Consider Before Opting for Zero Cost EMI</h2>

		<h3>Financial Considerations</h3>
		<ul>
			<li><strong>Total Cost:</strong> Compare total amount payable vs upfront payment</li>
			<li><strong>Interest Component:</strong> Understand hidden costs and interest charges</li>
			<li><strong>Prepayment Options:</strong> Check for prepayment charges and flexibility</li>
			<li><strong>EMI Burden:</strong> Ensure EMI fits comfortably within monthly budget</li>
		</ul>

		<h3>Technical Considerations</h3>
		<ul>
			<li><strong>System Quality:</strong> Don't compromise on quality for EMI convenience</li>
			<li><strong>Warranty Terms:</strong> Ensure comprehensive warranty coverage</li>
			<li><strong>Installer Reputation:</strong> Choose certified and experienced installers</li>
			<li><strong>After-sales Service:</strong> Verify maintenance and support services</li>
		</ul>

		<h3>Legal and Contractual Considerations</h3>
		<ul>
			<li>Read and understand loan agreement terms</li>
			<li>Check for penalty clauses and additional charges</li>
			<li>Understand ownership rights during EMI period</li>
			<li>Verify insurance coverage and protection</li>
		</ul>

		<h2>Alternatives to Zero Cost EMI Schemes</h2>

		<h3>1. Government Subsidy + Partial EMI</h3>
		<ul>
			<li>Avail government subsidy to reduce principal amount</li>
			<li>Finance remaining amount through EMI</li>
			<li>Lower total interest outgo</li>
			<li>Faster loan closure</li>
		</ul>

		<h3>2. Solar Leasing Models</h3>
		<ul>
			<li>No ownership, pay monthly lease amount</li>
			<li>Maintenance included in lease agreement</li>
			<li>Lower monthly outgo than EMI</li>
			<li>Option to purchase at end of lease term</li>
		</ul>

		<h3>3. Power Purchase Agreements (PPA)</h3>
		<ul>
			<li>Pay for electricity generated, not equipment</li>
			<li>Zero upfront investment</li>
			<li>Immediate savings on electricity bills</li>
			<li>Long-term contract (15-25 years)</li>
		</ul>

		<h2>Tips to Get the Best Zero Cost EMI Deal</h2>

		<h3>Research and Comparison</h3>
		<ul>
			<li>Compare EMI rates across multiple banks and NBFCs</li>
			<li>Check for promotional offers and seasonal discounts</li>
			<li>Negotiate with dealers for better financing terms</li>
			<li>Consider total cost of ownership including interest</li>
		</ul>

		<h3>Credit Score Optimization</h3>
		<ul>
			<li>Check and improve credit score before applying</li>
			<li>Clear existing dues and maintain good credit history</li>
			<li>Apply through existing bank relationships for better rates</li>
			<li>Consider co-applicant with higher credit score</li>
		</ul>

		<h3>Timing Your Purchase</h3>
		<ul>
			<li>Look for festival season offers and discounts</li>
			<li>End of financial year deals for additional benefits</li>
			<li>New product launch periods for promotional rates</li>
			<li>Bulk purchase offers for housing societies</li>
		</ul>

		<h2>Common Mistakes to Avoid</h2>

		<h3>Financial Mistakes</h3>
		<ul>
			<li><strong>Overcommitting:</strong> Don't stretch EMI beyond 30% of monthly income</li>
			<li><strong>Ignoring Total Cost:</strong> Focus on total payable amount, not just EMI</li>
			<li><strong>Multiple EMIs:</strong> Avoid taking multiple EMIs simultaneously</li>
			<li><strong>Hidden Charges:</strong> Check for processing fees, insurance, and other charges</li>
		</ul>

		<h3>Technical Mistakes</h3>
		<ul>
			<li>Compromising on system quality for lower EMI</li>
			<li>Not verifying installer credentials and certifications</li>
			<li>Skipping detailed technical specifications review</li>
			<li>Ignoring warranty and after-sales service terms</li>
		</ul>

		<h2>Future of Solar Financing in India</h2>

		<h3>Emerging Trends</h3>
		<ul>
			<li><strong>Digital Lending:</strong> AI-powered instant approvals</li>
			<li><strong>Blockchain Financing:</strong> Transparent and secure loan processing</li>
			<li><strong>Green Bonds:</strong> Dedicated environmental financing instruments</li>
			<li><strong>Peer-to-Peer Lending:</strong> Alternative financing platforms</li>
		</ul>

		<h3>Government Initiatives</h3>
		<ul>
			<li>Enhanced subsidy schemes with easier EMI integration</li>
			<li>Priority sector lending mandates for renewable energy</li>
			<li>Tax incentives for solar financing institutions</li>
			<li>Digital infrastructure for seamless loan processing</li>
		</ul>

		<h2>Conclusion</h2>
		<p>
			Zero Cost EMI schemes have democratized access to solar energy in India, making it possible for millions of homeowners to adopt renewable energy without upfront investment barriers. These financing options provide an excellent opportunity to start saving on electricity bills immediately while contributing to environmental sustainability.
		</p>
		
		<p>
			The key to maximizing benefits from Zero Cost EMI schemes lies in careful comparison of offers, understanding the total cost implications, and choosing reputable installers. With monthly EMI amounts often lower than electricity bill savings, solar installations through EMI schemes provide immediate positive cash flow and long-term financial benefits.
		</p>
		
		<p>
			As the solar industry continues to evolve and financing options become more sophisticated, Zero Cost EMI schemes will play a crucial role in accelerating India's renewable energy adoption. For homeowners considering solar installation, these schemes offer a risk-free path to energy independence and substantial long-term savings.
		</p>
		
		<p>
			Ready to explore Zero Cost EMI options for your solar installation? Connect with verified solar installers through SolarVipani to get customized EMI quotes and find the best financing solution for your needs.
		</p>
	</div>

	<section id="lead-form-sv" class="lead-form-section">
		<h2>Get Your Zero Cost EMI Solar Quote Today</h2>
		<p class="lead-form-subtitle">
			Connect with verified solar installers offering zero cost EMI schemes. Get personalized quotes with flexible financing options and start saving immediately.
		</p>
		<LeadFormBusiness />
	</section>
</main>

<style>
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		font-family: var(--font-family);
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
	}

	.blogpost {
		max-width: 800px;
	}

	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	.blog-header {
		margin-bottom: 2rem;
	}

	h1,
	h2,
	h3 {
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: 1.5rem;
	}

	h1 {
		font-size: 2.5rem;
		text-align: center;
	}

	h2 {
		font-size: 2rem;
		margin-top: 2.5rem;
		color: var(--accent-color);
	}

	h3 {
		font-size: 1.5rem;
		margin-top: 2rem;
	}

	p {
		font-size: 1.1rem;
		margin-bottom: 1.8rem;
		line-height: 1.6;
	}

	ul,
	ol {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	ul li,
	ol li {
		margin-bottom: 0.8rem;
		line-height: 1.6;
	}

	strong {
		font-weight: 600;
	}

	a {
		color: var(--accent-color);
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	.emi-table {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		font-size: 1rem;
	}

	.emi-table th,
	.emi-table td {
		padding: 1rem;
		text-align: left;
		border: 1px solid #ddd;
	}

	.emi-table th {
		background-color: var(--accent-color);
		color: white;
		font-weight: 600;
	}

	.emi-table tbody tr:nth-child(even) {
		background-color: rgba(0, 86, 179, 0.1);
	}

	.dark .emi-table th {
		background-color: var(--accent-color);
	}

	.dark .emi-table td {
		border-color: #444;
	}

	.dark .emi-table tbody tr:nth-child(even) {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Lead form section styling */
	.lead-form-section {
		margin-top: 3rem;
		padding: 3rem 2rem;
		text-align: center;
		background: linear-gradient(135deg, var(--accent-color), #004494);
		color: white;
		border-radius: 16px;
		max-width: 800px;
		width: 100%;
	}

	.lead-form-section h2 {
		margin: 0 auto 1.5rem;
		font-size: 1.8rem;
		color: white;
		max-width: 800px;
	}

	.lead-form-subtitle {
		color: rgba(255, 255, 255, 0.9);
		font-size: 1.1rem;
		margin-bottom: 1.5rem;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		.blogpost {
			max-width: 100%;
		}

		h1 {
			font-size: 2rem;
		}

		h2 {
			font-size: 1.7rem;
		}

		h3 {
			font-size: 1.3rem;
		}

		p,
		ul li,
		ol li {
			font-size: 1rem;
		}

		.emi-table {
			font-size: 0.9rem;
		}

		.emi-table th,
		.emi-table td {
			padding: 0.7rem;
		}

		/* Mobile lead form section */
		.lead-form-section {
			padding: 2rem 1rem;
			margin-top: 2rem;
		}

		.lead-form-section h2 {
			font-size: 1.5rem;
		}

		.lead-form-subtitle {
			font-size: 1rem;
		}
	}
</style>