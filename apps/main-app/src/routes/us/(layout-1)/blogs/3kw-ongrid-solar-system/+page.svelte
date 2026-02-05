<script>
	import { isDarkMode } from '$lib/us/themeStore';
	import LeadFormBusiness from '$lib/us/LeadFormBusiness.svelte';

	let darkMode = $derived($isDarkMode);

	const lastUpdated = '2025-01-03';
	const lastUpdatedDisplay = 'January 3, 2025';
	const datePublished = '2025-01-03';

	const articleUrl = 'https://solarvipani.com/us/blogs/3kw-ongrid-solar-system';

	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: '3kW On-Grid Solar System in USA: Complete Guide 2025',
		author: {
			'@type': 'Person',
			name: 'SolarVipani Admin',
			url: '/us/about-us'
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
			'Complete guide to 3kW on-grid solar system in USA. Learn about cost, installation, electricity generation, components, federal tax credit, and benefits for medium-sized homes.'
	};

	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<title>3kW On-Grid Solar System in USA: Complete Guide 2025</title>
	<meta
		name="description"
		content="Complete guide to 3kW on-grid solar system in USA. Learn about cost, installation, electricity generation, components, federal tax credit, and benefits for medium-sized homes."
	/>
	<meta
		name="keywords"
		content="3kw ongrid solar system, 3kw solar system price usa, 3kw solar panel cost, medium solar system, home solar system, on grid solar system, federal tax credit"
	/>
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
			<h1>3kW On-Grid Solar System in USA: Complete Guide 2025</h1>
			<p>By <a href="/us/about-us">SolarVipani Admin</a></p>
			<p>Last updated: <time datetime={lastUpdated}>{lastUpdatedDisplay}</time></p>
		</header>

		<p>
			A 3kW on-grid solar system is the most popular choice for medium-sized homes in the USA,
			offering the perfect balance between cost, electricity generation, and space requirements.
			This system is ideal for families with moderate to high electricity consumption, providing
			substantial savings on monthly electricity bills while contributing to environmental
			sustainability. In this comprehensive guide, we'll explore everything about 3kW on-grid solar
			systems in the United States, including federal tax credits and state incentives.
		</p>

		<h2>What is a 3kW On-Grid Solar System?</h2>
		<p>
			A 3kW on-grid solar system generates 3 kilowatts of electricity under standard test conditions
			and is directly connected to the local electricity grid. This grid-tied system operates
			without batteries and offers several advantages:
		</p>
		<ul>
			<li>Generates clean solar power during daylight hours</li>
			<li>Automatically switches to grid power when solar generation is insufficient</li>
			<li>Exports excess electricity to the grid through net metering</li>
			<li>Provides credits on electricity bills for surplus power generated</li>
			<li>Requires minimal maintenance compared to off-grid systems</li>
		</ul>

		<h2>Components of 3kW On-Grid Solar System</h2>
		<p>A complete 3kW on-grid solar system includes the following components:</p>

		<h3>1. Solar Panels (3000 Watts)</h3>
		<ul>
			<li><strong>Monocrystalline Panels:</strong> 9-10 panels of 300-350 watts each</li>
			<li><strong>Polycrystalline Panels:</strong> 12-15 panels of 200-250 watts each</li>
			<li><strong>Bifacial Panels:</strong> 8-9 panels of 330-400 watts each</li>
			<li><strong>Half-cut Cell Panels:</strong> 10-12 panels of 250-300 watts each</li>
		</ul>

		<h3>2. On-Grid Inverter (3kW)</h3>
		<ul>
			<li>Single-phase or three-phase inverter options</li>
			<li>Efficiency rating of 95-98%</li>
			<li>Grid synchronization and safety features</li>
			<li>Popular brands: Fronius, SMA, ABB, SolarEdge, Growatt, Sungrow</li>
			<li>Advanced features: WiFi monitoring, MPPT optimization</li>
		</ul>

		<h3>3. Mounting Structure</h3>
		<ul>
			<li>Hot-dip galvanized iron or aluminum mounting rails</li>
			<li>Rooftop clamps and fasteners for secure installation</li>
			<li>Wind load resistance up to 180 km/hr</li>
			<li>25-year structural warranty</li>
		</ul>

		<h3>4. Electrical Components</h3>
		<ul>
			<li>DCDB with MCBs, fuses, and surge protection devices</li>
			<li>ACDB with grid isolation and monitoring systems</li>
			<li>Weather-resistant MC4 connectors and cables</li>
			<li>Earthing kit and lightning protection</li>
		</ul>

		<h3>5. Net Meter</h3>
		<ul>
			<li>Bidirectional energy meter</li>
			<li>Smart meter with remote monitoring capabilities</li>
			<li>Installed and commissioned by utility company</li>
		</ul>

		<h2>3kW Solar System Cost in USA</h2>
		<p>
			The cost of a 3kW on-grid solar system varies based on component quality, brand, and location:
		</p>

		<h3>Cost Range (Before Tax Credits):</h3>
		<ul>
			<li><strong>Basic System:</strong> $6,000 - $7,500</li>
			<li><strong>Mid-range System:</strong> $7,500 - $9,000</li>
			<li><strong>Premium System:</strong> $9,000 - $12,000</li>
		</ul>

		<h3>Component-wise Cost Breakdown:</h3>
		<ul>
			<li><strong>Solar Panels:</strong> $3,000 - $4,800 (50-55% of total cost)</li>
			<li><strong>Inverter:</strong> $1,400 - $2,400 (20-25% of total cost)</li>
			<li><strong>Mounting Structure:</strong> $600 - $1,000 (8-12% of total cost)</li>
			<li>
				<strong>Installation & Balance of System:</strong> $1,000 - $1,600 (15-20% of total cost)
			</li>
		</ul>

		<h3>Financing Options:</h3>
		<ul>
			<li>Solar loans with competitive interest rates (3-7% APR)</li>
			<li>PACE (Property Assessed Clean Energy) financing in select states</li>
			<li>Home equity loans or lines of credit</li>
			<li>Monthly payment options starting from $80-$150/month</li>
			<li>Power Purchase Agreements (PPAs) and solar leases available</li>
		</ul>

		<h2>Electricity Generation from 3kW Solar System</h2>
		<p>A 3kW solar system generates substantial electricity throughout the year:</p>

		<h3>Daily Generation by Region:</h3>
		<ul>
			<li><strong>Southwest (AZ, NM, CA):</strong> 13.5-18 kWh per day</li>
			<li><strong>Southeast (FL, TX, GA):</strong> 12-15 kWh per day</li>
			<li><strong>West Coast (CA, OR, WA):</strong> 10.5-13.5 kWh per day</li>
			<li><strong>Northeast (NY, MA, PA):</strong> 9-12 kWh per day</li>
			<li><strong>Midwest (IL, OH, MI):</strong> 10.5-13.5 kWh per day</li>
		</ul>

		<h3>Monthly Generation:</h3>
		<ul>
			<li><strong>Summer Months (Jun-Aug):</strong> 390-540 kWh</li>
			<li><strong>Spring/Fall Months (Mar-May, Sep-Nov):</strong> 330-450 kWh</li>
			<li><strong>Winter Months (Dec-Feb):</strong> 270-360 kWh</li>
			<li><strong>Annual Average:</strong> 3,600-5,400 kWh</li>
		</ul>

		<h3>Performance Factors:</h3>
		<ul>
			<li>Solar irradiation levels (3.5-6.5 kWh/m²/day across USA)</li>
			<li>Panel orientation and tilt angle (South-facing optimal, latitude-based tilt)</li>
			<li>Shading from nearby structures, trees, or snow accumulation</li>
			<li>System efficiency and component quality</li>
			<li>Weather conditions and seasonal variations by region</li>
		</ul>

		<h2>Space Requirements for 3kW Solar System</h2>
		<p>A 3kW solar system requires adequate rooftop space for optimal performance:</p>

		<h3>Space Specifications:</h3>
		<ul>
			<li><strong>Total Area Required:</strong> 250-350 square feet</li>
			<li><strong>Shadow-free Area:</strong> Essential for maximum generation</li>
			<li><strong>Roof Load Capacity:</strong> 15-20 kg per square meter</li>
			<li><strong>Panel Configuration:</strong> 3x3 or 2x5 array options</li>
			<li><strong>Minimum Roof Size:</strong> 400 square feet total roof area</li>
		</ul>

		<h3>Installation Considerations:</h3>
		<ul>
			<li>Structural integrity assessment required</li>
			<li>Access for maintenance and cleaning</li>
			<li>Proximity to electrical meter and distribution board</li>
			<li>Local building regulations and permissions</li>
		</ul>

		<h2>Federal Solar Tax Credit for 3kW Solar System</h2>
		<p>
			The Federal Solar Investment Tax Credit (ITC) provides significant tax benefits for 3kW
			systems:
		</p>

		<h3>Federal Tax Credit (2024-2025):</h3>
		<ul>
			<li><strong>Tax Credit Rate:</strong> 30% of total system cost</li>
			<li><strong>Credit Amount for 3kW System:</strong> $1,800-$3,600 (30% of $6,000-$12,000)</li>
			<li><strong>Claim Method:</strong> Federal income tax return (Form 5695)</li>
			<li>
				<strong>Carry Forward:</strong> Unused credit can be carried forward to future tax years
			</li>
		</ul>

		<h3>State and Local Incentives:</h3>
		<ul>
			<li><strong>California:</strong> SGIP battery rebates + local utility rebates</li>
			<li>
				<strong>New York:</strong> State tax credit (25% up to $5,000) + Megawatt Block incentive
			</li>
			<li><strong>Massachusetts:</strong> SMART program ($0.20-$0.40/kWh for 10 years)</li>
			<li><strong>New Jersey:</strong> SREC program + sales tax exemption</li>
			<li><strong>Colorado:</strong> State tax credit up to $5,000</li>
			<li><strong>Arizona:</strong> State tax credit (25% up to $1,000) + utility rebates</li>
		</ul>

		<h3>Net Cost After Incentives:</h3>
		<ul>
			<li><strong>Cost After Federal Tax Credit:</strong> $4,200-$8,400</li>
			<li><strong>With State Incentives:</strong> $3,500-$7,500 (varies by state)</li>
			<li><strong>Payback Period:</strong> 6-10 years</li>
			<li><strong>Total Savings:</strong> $30,000-$60,000 over 25 years</li>
		</ul>

		<h2>Benefits of 3kW On-Grid Solar System</h2>

		<h3>Financial Benefits:</h3>
		<ul>
			<li>
				<strong>Electricity Bill Savings:</strong> $60-$120 per month (varies by location and rates)
			</li>
			<li><strong>Net Metering Credits:</strong> Earn utility credits for excess generation</li>
			<li><strong>Return on Investment:</strong> 10-15% ROI over system lifetime</li>
			<li><strong>Property Value Enhancement:</strong> Studies show 3-4% increase in home value</li>
			<li><strong>Hedge Against Inflation:</strong> Protection from rising electricity rates</li>
			<li><strong>Long-term Savings:</strong> $30,000-$60,000 over 25 years</li>
		</ul>

		<h3>Environmental Benefits:</h3>
		<ul>
			<li><strong>CO2 Emission Reduction:</strong> 4.5-6 tons annually</li>
			<li><strong>Equivalent Tree Plantation:</strong> 120-150 trees worth of carbon offset</li>
			<li><strong>Clean Energy Generation:</strong> 90+ tons CO2 saved over 25 years</li>
			<li><strong>Renewable Energy Contribution:</strong> Support USA's clean energy goals</li>
		</ul>

		<h3>Technical Benefits:</h3>
		<ul>
			<li><strong>Grid Stability:</strong> No battery maintenance required</li>
			<li><strong>High Reliability:</strong> 98%+ system uptime</li>
			<li><strong>Scalability:</strong> Easy expansion to 5kW or 10kW</li>
			<li><strong>Long Lifespan:</strong> 25+ years of electricity generation</li>
			<li><strong>Low Maintenance:</strong> Annual maintenance cost under $200</li>
		</ul>

		<h2>Ideal Applications for 3kW Solar System</h2>
		<p>A 3kW on-grid solar system is perfect for:</p>

		<h3>Residential Applications:</h3>
		<ul>
			<li>2-3 bedroom homes with monthly consumption of 300-400 units</li>
			<li>Medium-sized apartments and independent houses</li>
			<li>Homes with air conditioning and modern appliances</li>
			<li>Families looking for 60-80% electricity bill reduction</li>
		</ul>

		<h3>Appliance Coverage:</h3>
		<ul>
			<li>Lighting systems (LED bulbs and tube lights)</li>
			<li>Ceiling fans and exhaust fans</li>
			<li>Refrigerator and washing machine</li>
			<li>Television and entertainment systems</li>
			<li>1.5-ton air conditioner (limited hours)</li>
			<li>Computer and home office equipment</li>
		</ul>

		<h2>Installation Process</h2>
		<p>
			The installation of a 3kW on-grid solar system involves systematic planning and execution:
		</p>

		<h3>Pre-Installation Phase:</h3>
		<ul>
			<li><strong>Site Survey:</strong> Technical assessment and feasibility study</li>
			<li><strong>System Design:</strong> Customized layout and electrical design</li>
			<li><strong>Permits & Approvals:</strong> NOC from society/municipality</li>
			<li><strong>Net Metering Application:</strong> Submission to utility company</li>
		</ul>

		<h3>Installation Phase:</h3>
		<ul>
			<li><strong>Day 1:</strong> Mounting structure installation</li>
			<li><strong>Day 2:</strong> Solar panel mounting and DC wiring</li>
			<li><strong>Day 3:</strong> Inverter installation and AC connections</li>
			<li><strong>Day 4:</strong> System testing and commissioning</li>
		</ul>

		<h3>Post-Installation:</h3>
		<ul>
			<li>Net meter installation by utility company</li>
			<li>Interconnection agreement approval</li>
			<li>System performance testing</li>
			<li>Handover with operation manual</li>
			<li>Performance monitoring setup</li>
		</ul>

		<h2>Maintenance and Monitoring</h2>
		<p>3kW on-grid solar systems require minimal but essential maintenance:</p>

		<h3>Regular Maintenance Tasks:</h3>
		<ul>
			<li><strong>Panel Cleaning:</strong> Monthly cleaning to remove dust and debris</li>
			<li><strong>Visual Inspection:</strong> Check for physical damage or bird nesting</li>
			<li><strong>Performance Monitoring:</strong> Daily generation tracking via apps</li>
			<li><strong>Electrical Checks:</strong> Quarterly inspection of connections</li>
		</ul>

		<h3>Professional Maintenance:</h3>
		<ul>
			<li><strong>Annual Service:</strong> Comprehensive system health checkup</li>
			<li><strong>Inverter Maintenance:</strong> Software updates and calibration</li>
			<li><strong>Performance Analysis:</strong> Efficiency monitoring and optimization</li>
			<li><strong>Warranty Claims:</strong> Component replacement if needed</li>
		</ul>

		<h3>Monitoring Technology:</h3>
		<ul>
			<li>Mobile apps for real-time generation data</li>
			<li>Web portals for detailed analytics</li>
			<li>SMS/email alerts for system issues</li>
			<li>Remote diagnostics and troubleshooting</li>
		</ul>

		<h2>Return on Investment Analysis</h2>
		<p>A 3kW solar system offers excellent financial returns:</p>

		<h3>Investment Scenario:</h3>
		<ul>
			<li><strong>Total System Cost:</strong> $7,500</li>
			<li><strong>Federal Tax Credit (30%):</strong> $2,250</li>
			<li><strong>Net Investment:</strong> $5,250</li>
			<li><strong>With State Incentives:</strong> $4,500-$5,000 (varies by location)</li>
		</ul>

		<h3>Annual Savings:</h3>
		<ul>
			<li><strong>Electricity Bill Reduction:</strong> $720-$1,440 per year</li>
			<li><strong>Net Metering Credits:</strong> $100-$300 per year</li>
			<li><strong>Total Annual Benefit:</strong> $820-$1,740 per year</li>
		</ul>

		<h3>Financial Metrics:</h3>
		<ul>
			<li><strong>Simple Payback Period:</strong> 6-9 years</li>
			<li><strong>Internal Rate of Return:</strong> 10-15%</li>
			<li><strong>Net Present Value:</strong> $30,000-$60,000 over 25 years</li>
			<li><strong>Levelized Cost of Energy:</strong> $0.06-$0.10 per kWh</li>
		</ul>

		<h2>Performance Optimization Tips</h2>
		<p>Maximize your 3kW system performance with these tips:</p>

		<h3>Installation Optimization:</h3>
		<ul>
			<li>Ensure south-facing orientation for maximum sun exposure</li>
			<li>Maintain optimal tilt angle based on latitude</li>
			<li>Minimize shading from nearby structures</li>
			<li>Use high-efficiency components for better performance</li>
		</ul>

		<h3>Operational Optimization:</h3>
		<ul>
			<li>Regular cleaning and maintenance schedule</li>
			<li>Monitor daily generation and identify issues early</li>
			<li>Optimize electricity consumption during peak generation hours</li>
			<li>Use energy-efficient appliances to maximize solar utilization</li>
		</ul>

		<h2>Common Challenges and Solutions</h2>

		<h3>Challenge: Seasonal Generation Variation</h3>
		<ul>
			<li><strong>Issue:</strong> Lower generation during monsoon and winter</li>
			<li>
				<strong>Solution:</strong> Size system for worst-case scenario and use grid power as backup
			</li>
		</ul>

		<h3>Challenge: Shading Issues</h3>
		<ul>
			<li><strong>Issue:</strong> Reduced performance due to partial shading</li>
			<li>
				<strong>Solution:</strong> Use power optimizers or microinverters for individual panel control
			</li>
		</ul>

		<h3>Challenge: Inverter Failures</h3>
		<ul>
			<li><strong>Issue:</strong> Grid inverters shutting down during grid fluctuations</li>
			<li><strong>Solution:</strong> Install voltage stabilizers and choose robust inverters</li>
		</ul>

		<h2>Future Expansion Options</h2>
		<p>A 3kW system can be expanded based on growing energy needs:</p>

		<h3>Capacity Expansion:</h3>
		<ul>
			<li><strong>Additional Panels:</strong> Upgrade to 5kW or 10kW systems</li>
			<li><strong>Inverter Upgrade:</strong> Replace with higher capacity inverter</li>
			<li><strong>String Addition:</strong> Add new panel strings to existing system</li>
		</ul>

		<h3>Technology Upgrades:</h3>
		<ul>
			<li><strong>Battery Integration:</strong> Convert to hybrid system for backup power</li>
			<li><strong>Smart Home Integration:</strong> IoT-enabled energy management</li>
			<li><strong>EV Charging:</strong> Integrate electric vehicle charging infrastructure</li>
		</ul>

		<h2>Comparison with Other System Sizes</h2>

		<table class="comparison-table">
			<thead>
				<tr>
					<th>System Size</th>
					<th>Investment</th>
					<th>Daily Generation</th>
					<th>Monthly Savings</th>
					<th>Payback Period</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>1kW</td>
					<td>$1,400-$2,450</td>
					<td>3-6 kWh</td>
					<td>$20-$40</td>
					<td>6-10 years</td>
				</tr>
				<tr>
					<td>3kW</td>
					<td>$4,200-$8,400</td>
					<td>9-18 kWh</td>
					<td>$60-$120</td>
					<td>6-9 years</td>
				</tr>
				<tr>
					<td>5kW</td>
					<td>$7,000-$10,500</td>
					<td>15-30 kWh</td>
					<td>$100-$200</td>
					<td>6-9 years</td>
				</tr>
			</tbody>
		</table>

		<h2>Conclusion</h2>
		<p>
			A 3kW on-grid solar system represents the sweet spot for most American households, offering
			optimal balance between investment, electricity generation, and savings. With the 30% Federal
			Tax Credit and state incentives reducing the effective cost significantly, the payback period
			is attractive at 6-9 years.
		</p>

		<p>
			The system's ability to generate 9-18 kWh daily makes it perfect for medium-sized homes with
			modern appliances and moderate air conditioning usage. The combination of substantial
			electricity bill savings, net metering credits, and environmental benefits makes it a
			compelling investment for the future.
		</p>

		<p>
			For homeowners considering solar adoption, a 3kW on-grid system provides the perfect entry
			point into renewable energy with proven financial returns and long-term benefits. Take
			advantage of the 30% federal tax credit while it's available. Connect with verified solar
			installers through SolarVipani to get customized quotes and professional installation services
			for your 3kW solar system.
		</p>
	</div>

	<section id="lead-form-sv" class="lead-form-section">
		<h2>Get Your 3kW Solar System Quote Today</h2>
		<p class="lead-form-subtitle">
			Connect with verified solar installers in your area and receive personalized quotes for your
			3kW on-grid solar system. Professional installation and competitive pricing guaranteed.
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

	ul {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	ul li {
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

	.comparison-table {
		width: 100%;
		border-collapse: collapse;
		margin: 2rem 0;
		font-size: 1rem;
	}

	.comparison-table th,
	.comparison-table td {
		padding: 1rem;
		text-align: left;
		border: 1px solid #ddd;
	}

	.comparison-table th {
		background-color: var(--accent-color);
		color: white;
		font-weight: 600;
	}

	.comparison-table tbody tr:nth-child(even) {
		background-color: rgba(0, 86, 179, 0.1);
	}

	.dark .comparison-table th {
		background-color: var(--accent-color);
	}

	.dark .comparison-table td {
		border-color: #444;
	}

	.dark .comparison-table tbody tr:nth-child(even) {
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
		ul li {
			font-size: 1rem;
		}

		.comparison-table {
			font-size: 0.9rem;
		}

		.comparison-table th,
		.comparison-table td {
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
