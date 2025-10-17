<script>
	import { isDarkMode } from '$lib/themeStore';
	import LeadFormBusiness from '$lib/LeadFormBusiness.svelte';

	let darkMode;
	$: darkMode = $isDarkMode;

	const lastUpdated = '2025-01-03';
	const lastUpdatedDisplay = 'January 3, 2025';
	const datePublished = '2025-01-03';

	const articleUrl = 'https://solarvipani.com/blogs/5kw-ongrid-solar-system';

	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: '5kW On-Grid Solar System in India: Complete Guide 2025',
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
			'Complete guide to 5kW on-grid solar system in India. Learn about cost, installation, electricity generation, components, subsidy, and benefits for large homes and small businesses.'
	};

	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<title>5kW On-Grid Solar System in India: Complete Guide 2025</title>
	<meta name="description" content="Complete guide to 5kW on-grid solar system in India. Learn about cost, installation, electricity generation, components, subsidy, and benefits for large homes and small businesses." />
	<meta name="keywords" content="5kw ongrid solar system, 5kw solar system price, 5kw solar panel cost, large solar system, commercial solar system, on grid solar system" />
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
			<h1>5kW On-Grid Solar System in India: Complete Guide 2025</h1>
			<p>By <a href="/about-us">SolarVipani Admin</a></p>
			<p>Last updated: <time datetime={lastUpdated}>{lastUpdatedDisplay}</time></p>
		</header>

		<p>
			A 5kW on-grid solar system is the ideal choice for large homes, villas, and small commercial establishments in India. This robust system provides substantial electricity generation capacity, significant cost savings, and excellent return on investment. Perfect for families with high electricity consumption or small businesses looking to reduce operational costs, a 5kW system offers the best balance of power generation and economic viability for larger energy requirements.
		</p>

		<h2>What is a 5kW On-Grid Solar System?</h2>
		<p>
			A 5kW on-grid solar system generates 5 kilowatts of electricity under standard test conditions and is directly connected to the local electricity grid. This grid-tied system operates without batteries and provides maximum benefits through:
		</p>
		<ul>
			<li>High-capacity solar power generation during daylight hours</li>
			<li>Seamless grid integration for continuous power supply</li>
			<li>Maximum utilization of net metering benefits</li>
			<li>Substantial electricity bill reduction for high-consumption users</li>
			<li>Excellent return on investment for large energy requirements</li>
		</ul>

		<h2>Components of 5kW On-Grid Solar System</h2>
		<p>A complete 5kW on-grid solar system includes the following high-capacity components:</p>

		<h3>1. Solar Panels (5000 Watts)</h3>
		<ul>
			<li><strong>Monocrystalline Panels:</strong> 15-16 panels of 300-350 watts each</li>
			<li><strong>Polycrystalline Panels:</strong> 20-25 panels of 200-250 watts each</li>
			<li><strong>Bifacial Panels:</strong> 12-14 panels of 350-400 watts each</li>
			<li><strong>Half-cut Cell Panels:</strong> 16-18 panels of 275-320 watts each</li>
			<li><strong>TOPCon Technology:</strong> 13-15 panels of 330-400 watts each</li>
		</ul>

		<h3>2. On-Grid Inverter (5kW)</h3>
		<ul>
			<li>Single-phase or three-phase inverter options</li>
			<li>High efficiency rating of 96-98.5%</li>
			<li>Advanced MPPT technology for maximum power extraction</li>
			<li>Popular brands: Fronius, SMA, ABB, SolarEdge, Growatt, Sungrow, Huawei</li>
			<li>Smart features: WiFi monitoring, remote diagnostics, grid support functions</li>
		</ul>

		<h3>3. Mounting Structure</h3>
		<ul>
			<li>Heavy-duty galvanized iron or aluminum mounting rails</li>
			<li>Reinforced clamps and fasteners for large array support</li>
			<li>Wind load resistance up to 200 km/hr</li>
			<li>25-year structural warranty with corrosion protection</li>
		</ul>

		<h3>4. Electrical Components</h3>
		<ul>
			<li>DCDB with MCBs, fuses, surge protection, and isolation switches</li>
			<li>ACDB with grid isolation, monitoring, and safety systems</li>
			<li>High-quality MC4 connectors and XLPE cables</li>
			<li>Comprehensive earthing and lightning protection system</li>
		</ul>

		<h3>5. Net Meter and Monitoring</h3>
		<ul>
			<li>Three-phase bidirectional energy meter</li>
			<li>Smart meter with advanced monitoring capabilities</li>
			<li>Real-time generation and consumption tracking</li>
			<li>Installed and commissioned by DISCOM</li>
		</ul>

		<h2>5kW Solar System Cost in India</h2>
		<p>The cost of a 5kW on-grid solar system varies based on component quality, technology, and installation complexity:</p>

		<h3>Cost Range:</h3>
		<ul>
			<li><strong>Basic System:</strong> ₹2,50,000 - ₹3,00,000</li>
			<li><strong>Mid-range System:</strong> ₹3,00,000 - ₹3,75,000</li>
			<li><strong>Premium System:</strong> ₹3,75,000 - ₹4,50,000</li>
		</ul>

		<h3>Component-wise Cost Breakdown:</h3>
		<ul>
			<li><strong>Solar Panels:</strong> ₹1,25,000 - ₹2,00,000 (50-55% of total cost)</li>
			<li><strong>Inverter:</strong> ₹60,000 - ₹1,00,000 (20-25% of total cost)</li>
			<li><strong>Mounting Structure:</strong> ₹25,000 - ₹40,000 (8-12% of total cost)</li>
			<li><strong>Installation & Balance of System:</strong> ₹40,000 - ₹65,000 (15-20% of total cost)</li>
		</ul>

		<h3>Advanced Financing Options:</h3>
		<ul>
			<li>Solar loans with 6.5-9% interest rates</li>
			<li>Zero down payment schemes for qualified customers</li>
			<li>EMI options starting from ₹15,000 per month</li>
			<li>Extended tenure options up to 15 years</li>
			<li>Corporate financing for commercial installations</li>
		</ul>

		<h2>Electricity Generation from 5kW Solar System</h2>
		<p>A 5kW solar system provides substantial electricity generation throughout the year:</p>

		<h3>Daily Generation by Region:</h3>
		<ul>
			<li><strong>Northern India:</strong> 20-25 units per day</li>
			<li><strong>Western India:</strong> 22-27 units per day</li>
			<li><strong>Southern India:</strong> 20-27 units per day</li>
			<li><strong>Eastern India:</strong> 17-22 units per day</li>
		</ul>

		<h3>Monthly Generation:</h3>
		<ul>
			<li><strong>Summer Months (Apr-Jun):</strong> 700-850 units</li>
			<li><strong>Monsoon Months (Jul-Sep):</strong> 500-650 units</li>
			<li><strong>Winter Months (Oct-Mar):</strong> 600-750 units</li>
			<li><strong>Annual Average:</strong> 6,000-7,500 units</li>
		</ul>

		<h3>Performance Optimization Factors:</h3>
		<ul>
			<li>Solar irradiation levels (4.5-6.5 kWh/m²/day across India)</li>
			<li>Optimal panel orientation (South-facing with 15-30° tilt)</li>
			<li>Minimal shading from structures or vegetation</li>
			<li>High-efficiency components and professional installation</li>
			<li>Regular maintenance and performance monitoring</li>
		</ul>

		<h2>Space Requirements for 5kW Solar System</h2>
		<p>A 5kW solar system requires substantial rooftop space for optimal performance:</p>

		<h3>Space Specifications:</h3>
		<ul>
			<li><strong>Total Area Required:</strong> 400-600 square feet</li>
			<li><strong>Shadow-free Area:</strong> Critical for maximum generation</li>
			<li><strong>Roof Load Capacity:</strong> 15-20 kg per square meter</li>
			<li><strong>Panel Configuration:</strong> 4x4 or 5x3 array options</li>
			<li><strong>Minimum Roof Size:</strong> 800 square feet total roof area</li>
		</ul>

		<h3>Installation Considerations:</h3>
		<ul>
			<li>Comprehensive structural assessment for large array support</li>
			<li>Adequate access pathways for maintenance</li>
			<li>Proximity to three-phase electrical connections</li>
			<li>Compliance with local building codes and fire safety regulations</li>
		</ul>

		<h2>Government Subsidies for 5kW Solar System</h2>
		<p>The PM Surya Ghar Yojana provides subsidies for residential 5kW systems:</p>

		<h3>Central Government Subsidy:</h3>
		<ul>
			<li><strong>Subsidy Amount:</strong> ₹1,14,000 for 5kW system</li>
			<li><strong>Calculation:</strong> ₹30,000 for first 1kW + ₹18,000 for next 2kW + ₹12,000 for remaining 2kW</li>
			<li><strong>Direct Benefit Transfer:</strong> Subsidy credited directly to consumer account</li>
		</ul>

		<h3>Commercial and Industrial Benefits:</h3>
		<ul>
			<li><strong>Accelerated Depreciation:</strong> 40% depreciation in first year</li>
			<li><strong>Tax Benefits:</strong> Deduction under Section 80-IA</li>
			<li><strong>Carbon Credits:</strong> Additional revenue from carbon trading</li>
			<li><strong>Green Building Certification:</strong> LEED/GRIHA rating benefits</li>
		</ul>

		<h3>Net Investment Analysis:</h3>
		<ul>
			<li><strong>Residential Net Cost:</strong> ₹1,80,000 - ₹2,50,000 (after subsidy)</li>
			<li><strong>Commercial Net Cost:</strong> ₹2,00,000 - ₹3,00,000 (after tax benefits)</li>
			<li><strong>Payback Period:</strong> 3.5-5 years</li>
			<li><strong>Total Savings:</strong> ₹25-35 lakhs over 25 years</li>
		</ul>

		<h2>Benefits of 5kW On-Grid Solar System</h2>

		<h3>Financial Benefits:</h3>
		<ul>
			<li><strong>Electricity Bill Savings:</strong> 70-90% reduction in monthly bills</li>
			<li><strong>Net Metering Income:</strong> ₹5,000-₹15,000 monthly from excess generation</li>
			<li><strong>Return on Investment:</strong> 20-30% IRR over system lifetime</li>
			<li><strong>Property Value Enhancement:</strong> 4-6% increase in property value</li>
			<li><strong>Inflation Hedge:</strong> Protection from rising electricity tariffs</li>
			<li><strong>Commercial Benefits:</strong> Reduced operational costs for businesses</li>
		</ul>

		<h3>Environmental Benefits:</h3>
		<ul>
			<li><strong>CO2 Emission Reduction:</strong> 7.5-10 tons annually</li>
			<li><strong>Equivalent Tree Plantation:</strong> 200-250 trees worth of carbon offset</li>
			<li><strong>Clean Energy Generation:</strong> 150+ tons CO2 saved over 25 years</li>
			<li><strong>Renewable Energy Leadership:</strong> Significant contribution to climate goals</li>
		</ul>

		<h3>Technical and Operational Benefits:</h3>
		<ul>
			<li><strong>High System Reliability:</strong> 99%+ system uptime with proper maintenance</li>
			<li><strong>Grid Independence:</strong> Reduced dependency on utility power</li>
			<li><strong>Scalability:</strong> Easy expansion to 10kW or higher capacities</li>
			<li><strong>Low Maintenance:</strong> Annual maintenance cost under ₹8,000</li>
			<li><strong>Advanced Monitoring:</strong> Real-time performance tracking and optimization</li>
		</ul>

		<h2>Ideal Applications for 5kW Solar System</h2>
		<p>A 5kW on-grid solar system is perfect for:</p>

		<h3>Residential Applications:</h3>
		<ul>
			<li>Large homes and villas with monthly consumption of 500-700 units</li>
			<li>3-4 bedroom houses with multiple air conditioners</li>
			<li>Homes with swimming pools, electric heating systems</li>
			<li>Families looking for 70-90% electricity bill reduction</li>
		</ul>

		<h3>Small Commercial Applications:</h3>
		<ul>
			<li>Small offices and retail stores</li>
			<li>Restaurants and cafes</li>
			<li>Clinics and diagnostic centers</li>
			<li>Small manufacturing units</li>
		</ul>

		<h3>Appliance Coverage:</h3>
		<ul>
			<li>Complete home lighting and ventilation systems</li>
			<li>Multiple air conditioners (2-3 tons total capacity)</li>
			<li>All household appliances and electronics</li>
			<li>Electric water heaters and kitchen equipment</li>
			<li>Home office and entertainment systems</li>
			<li>Electric vehicle charging capabilities</li>
		</ul>

		<h2>Installation Process for 5kW System</h2>
		<p>The installation of a 5kW on-grid solar system requires professional planning and execution:</p>

		<h3>Pre-Installation Phase (1-2 Weeks):</h3>
		<ul>
			<li><strong>Detailed Site Survey:</strong> Comprehensive assessment and shadow analysis</li>
			<li><strong>Engineering Design:</strong> Customized system layout and electrical design</li>
			<li><strong>Permits & Approvals:</strong> Building permits and utility approvals</li>
			<li><strong>Net Metering Application:</strong> Three-phase connection application to DISCOM</li>
		</ul>

		<h3>Installation Phase (3-5 Days):</h3>
		<ul>
			<li><strong>Day 1-2:</strong> Mounting structure installation and reinforcement</li>
			<li><strong>Day 3:</strong> Solar panel mounting and DC string wiring</li>
			<li><strong>Day 4:</strong> Inverter installation and AC connections</li>
			<li><strong>Day 5:</strong> System testing, commissioning, and performance verification</li>
		</ul>

		<h3>Post-Installation (1-2 Weeks):</h3>
		<ul>
			<li>Net meter installation and grid synchronization by DISCOM</li>
			<li>Final system performance testing and certification</li>
			<li>Comprehensive handover with documentation</li>
			<li>Performance monitoring system setup and training</li>
		</ul>

		<h2>Advanced Maintenance and Monitoring</h2>
		<p>5kW systems require systematic maintenance for optimal performance:</p>

		<h3>Regular Maintenance Schedule:</h3>
		<ul>
			<li><strong>Daily:</strong> Performance monitoring via mobile apps</li>
			<li><strong>Weekly:</strong> Visual inspection for physical damage</li>
			<li><strong>Monthly:</strong> Panel cleaning and debris removal</li>
			<li><strong>Quarterly:</strong> Electrical connection inspection and tightening</li>
			<li><strong>Annually:</strong> Professional system health checkup</li>
		</ul>

		<h3>Advanced Monitoring Features:</h3>
		<ul>
			<li>String-level monitoring for individual panel performance</li>
			<li>Weather data integration for performance analysis</li>
			<li>Automatic fault detection and alert systems</li>
			<li>Remote diagnostics and troubleshooting capabilities</li>
			<li>Performance benchmarking and optimization recommendations</li>
		</ul>

		<h3>Professional Maintenance Services:</h3>
		<ul>
			<li>Thermal imaging for hotspot detection</li>
			<li>I-V curve analysis for panel health assessment</li>
			<li>Inverter software updates and calibration</li>
			<li>Performance optimization and system upgrades</li>
		</ul>

		<h2>Comprehensive ROI Analysis</h2>
		<p>A 5kW solar system offers exceptional financial returns:</p>

		<h3>Investment Scenario (Residential):</h3>
		<ul>
			<li><strong>Total System Cost:</strong> ₹3,00,000</li>
			<li><strong>Government Subsidy:</strong> ₹1,14,000</li>
			<li><strong>Net Investment:</strong> ₹1,86,000</li>
		</ul>

		<h3>Annual Financial Benefits:</h3>
		<ul>
			<li><strong>Electricity Bill Reduction:</strong> ₹45,000 - ₹65,000</li>
			<li><strong>Net Metering Income:</strong> ₹8,000 - ₹18,000</li>
			<li><strong>Total Annual Benefit:</strong> ₹53,000 - ₹83,000</li>
		</ul>

		<h3>Financial Metrics:</h3>
		<ul>
			<li><strong>Simple Payback Period:</strong> 2.5-3.5 years</li>
			<li><strong>Internal Rate of Return:</strong> 25-35%</li>
			<li><strong>Net Present Value:</strong> ₹8-12 lakhs over 25 years</li>
			<li><strong>Levelized Cost of Energy:</strong> ₹2.0-2.8 per unit</li>
		</ul>

		<h2>Performance Optimization Strategies</h2>
		<p>Maximize your 5kW system performance with these advanced strategies:</p>

		<h3>Design Optimization:</h3>
		<ul>
			<li>Use high-efficiency monocrystalline or bifacial panels</li>
			<li>Implement string optimization with power optimizers</li>
			<li>Design for minimal inter-row shading</li>
			<li>Optimize tilt angles for maximum annual generation</li>
		</ul>

		<h3>Operational Excellence:</h3>
		<ul>
			<li>Implement automated cleaning systems for large arrays</li>
			<li>Use smart inverters with grid support functions</li>
			<li>Monitor performance ratio and benchmark against peers</li>
			<li>Optimize energy consumption patterns for maximum solar utilization</li>
		</ul>

		<h2>Technology Integration Options</h2>
		<p>5kW systems can integrate with advanced technologies:</p>

		<h3>Smart Home Integration:</h3>
		<ul>
			<li>IoT-enabled energy management systems</li>
			<li>Smart appliance scheduling for optimal solar utilization</li>
			<li>Home automation for energy efficiency</li>
			<li>Integration with smart meters and utility programs</li>
		</ul>

		<h3>Future Technology Upgrades:</h3>
		<ul>
			<li><strong>Battery Storage:</strong> Add lithium-ion batteries for backup power</li>
			<li><strong>EV Charging:</strong> Integrate electric vehicle charging infrastructure</li>
			<li><strong>Heat Pumps:</strong> Add solar-powered heating and cooling systems</li>
			<li><strong>Hydrogen Generation:</strong> Future integration with hydrogen production</li>
		</ul>

		<h2>System Expansion Possibilities</h2>
		<p>A 5kW system provides excellent foundation for future expansion:</p>

		<h3>Capacity Expansion Options:</h3>
		<ul>
			<li><strong>Rooftop Expansion:</strong> Upgrade to 10kW or 15kW systems</li>
			<li><strong>Ground Mount Addition:</strong> Add ground-mounted arrays</li>
			<li><strong>Carport Integration:</strong> Solar carports for additional capacity</li>
			<li><strong>Commercial Upgrade:</strong> Transition to commercial-scale systems</li>
		</ul>

		<h2>Troubleshooting and Common Issues</h2>

		<h3>Performance Issues:</h3>
		<ul>
			<li><strong>Reduced Generation:</strong> Check for shading, soiling, or component failures</li>
			<li><strong>Inverter Faults:</strong> Monitor error codes and perform reset procedures</li>
			<li><strong>String Underperformance:</strong> Use string monitoring for fault isolation</li>
		</ul>

		<h3>Grid Integration Issues:</h3>
		<ul>
			<li><strong>Grid Synchronization:</strong> Ensure proper voltage and frequency settings</li>
			<li><strong>Net Metering Problems:</strong> Coordinate with DISCOM for resolution</li>
			<li><strong>Power Quality Issues:</strong> Install filters for harmonic distortion</li>
		</ul>

		<h2>Comparison Analysis</h2>

		<table class="comparison-table">
			<thead>
				<tr>
					<th>System Size</th>
					<th>Investment</th>
					<th>Daily Generation</th>
					<th>Monthly Savings</th>
					<th>Payback Period</th>
					<th>Best For</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>3kW</td>
					<td>₹1,80,000</td>
					<td>12-15 units</td>
					<td>₹2,500-3,500</td>
					<td>3-4 years</td>
					<td>Medium homes</td>
				</tr>
				<tr>
					<td>5kW</td>
					<td>₹3,00,000</td>
					<td>20-25 units</td>
					<td>₹4,500-7,000</td>
					<td>2.5-3.5 years</td>
					<td>Large homes, small business</td>
				</tr>
				<tr>
					<td>10kW</td>
					<td>₹5,50,000</td>
					<td>40-50 units</td>
					<td>₹9,000-14,000</td>
					<td>2.5-3 years</td>
					<td>Commercial establishments</td>
				</tr>
			</tbody>
		</table>

		<h2>Conclusion</h2>
		<p>
			A 5kW on-grid solar system represents the optimal choice for large homes and small commercial establishments seeking maximum energy independence and financial benefits. With its substantial electricity generation capacity of 20-25 units daily, the system can meet the complete energy requirements of most large households while providing significant surplus for net metering income.
		</p>
		
		<p>
			The combination of government subsidies, excellent ROI metrics, and long-term savings makes the 5kW system a compelling investment. With a payback period of just 2.5-3.5 years and potential savings of ₹25-35 lakhs over 25 years, it offers one of the best returns on investment in the renewable energy sector.
		</p>
		
		<p>
			For homeowners with high electricity consumption or small business owners looking to reduce operational costs, a 5kW on-grid solar system provides the perfect solution. Its scalability, advanced monitoring capabilities, and integration with smart technologies make it future-ready for evolving energy needs. Connect with verified solar installers through SolarVipani to get customized quotes and professional installation services for your 5kW solar system.
		</p>
	</div>

	<section id="lead-form-sv" class="lead-form-section">
		<h2>Get Your 5kW Solar System Quote Today</h2>
		<p class="lead-form-subtitle">
			Connect with verified solar installers in your area and receive personalized quotes for your 5kW on-grid solar system. Professional installation and maximum ROI guaranteed.
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