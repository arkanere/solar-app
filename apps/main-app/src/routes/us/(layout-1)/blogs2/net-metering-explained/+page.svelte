<script>
	import { isDarkMode } from '$lib/us/themeStore';
	import LeadFormBusiness from '$lib/us/LeadFormBusiness.svelte';

	let darkMode;
	$: darkMode = $isDarkMode;

	const lastUpdated = '2025-01-15';
	const lastUpdatedDisplay = 'January 15, 2025';
	const datePublished = '2025-01-15';

	const articleUrl = 'https://solarvipani.com/us/blogs/net-metering-explained';

	const jsonLdData = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'Net Metering Explained: Complete Guide to Solar Energy Credits 2025',
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
			'Complete guide to net metering in 2025. Learn how net metering works, state-by-state policies, NEM 2.0 vs 3.0, billing examples, and how to maximize your solar energy credits and savings.'
	};

	const jsonLdString = JSON.stringify(jsonLdData);
</script>

<svelte:head>
	<title>Net Metering Explained: Complete Solar Energy Credits Guide 2025</title>
	<meta
		name="description"
		content="Complete guide to net metering in 2025. Learn how net metering works, state-by-state policies, NEM 2.0 vs 3.0, billing examples, and how to maximize your solar energy credits and savings."
	/>
	<meta
		name="keywords"
		content="net metering, solar credits, NEM 3.0, net energy metering, solar buyback, grid-tied solar, solar billing, renewable energy credits, virtual net metering"
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
			<h1>Net Metering Explained: Complete Guide to Solar Energy Credits 2025</h1>
			<p>By <a href="/about-us">SolarVipani Admin</a></p>
			<p>Last updated: <time datetime={lastUpdated}>{lastUpdatedDisplay}</time></p>
		</header>

		<p>
			Net metering is one of the most important policies making solar energy financially attractive
			for homeowners and businesses across the United States. This billing mechanism allows solar
			system owners to receive credits for excess electricity their solar panels generate and send
			back to the grid. Understanding how net metering works, the different versions (NEM 1.0, 2.0,
			and 3.0), and state-specific policies is crucial for maximizing your solar investment returns.
			This comprehensive guide explains everything you need to know about net metering in 2025.
		</p>

		<h2>What is Net Metering?</h2>
		<p>
			Net metering (also called Net Energy Metering or NEM) is a billing arrangement that credits
			solar energy system owners for the electricity they add to the grid. Here's how it works:
		</p>
		<ul>
			<li>
				<strong>Grid-connected system:</strong> Your solar panels are connected to the utility grid
			</li>
			<li>
				<strong>Two-way meter:</strong> A bi-directional meter tracks electricity flowing both ways
			</li>
			<li>
				<strong>Excess energy credits:</strong> When you produce more than you use, excess goes to the
				grid
			</li>
			<li>
				<strong>Credit on your bill:</strong> You receive credits for the excess energy you provide
			</li>
			<li>
				<strong>Use credits later:</strong> Credits offset your consumption when solar isn't producing
			</li>
			<li><strong>Annual true-up:</strong> Most utilities reconcile credits annually</li>
		</ul>

		<h2>How Net Metering Works: Step-by-Step</h2>

		<h3>Daytime (Solar Production)</h3>
		<ol>
			<li><strong>Solar panels generate electricity</strong> from sunlight</li>
			<li><strong>Power flows to your home first</strong> to meet immediate needs</li>
			<li><strong>Excess production</strong> (when generating more than consuming)</li>
			<li><strong>Surplus flows to the grid</strong> through your bi-directional meter</li>
			<li><strong>Meter runs backward</strong> (or credits accumulate digitally)</li>
			<li><strong>You earn credits</strong> at the retail or export rate</li>
		</ol>

		<h3>Nighttime (No Solar Production)</h3>
		<ol>
			<li><strong>Solar panels aren't producing</strong> electricity</li>
			<li><strong>You draw power from the grid</strong> to meet your needs</li>
			<li><strong>Meter runs forward</strong> tracking consumption</li>
			<li><strong>Credits are applied</strong> to offset grid electricity costs</li>
			<li><strong>You only pay</strong> for net consumption (usage minus credits)</li>
		</ol>

		<h2>Net Metering Example: Monthly Billing Cycle</h2>
		<p>Let's see how net metering works with a real-world example for a 5kW solar system:</p>

		<table class="emi-table">
			<thead>
				<tr>
					<th>Time Period</th>
					<th>Solar Production</th>
					<th>Home Consumption</th>
					<th>Net Balance</th>
					<th>Credit/Charge</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Week 1 (Sunny)</td>
					<td>750 kWh</td>
					<td>600 kWh</td>
					<td>+150 kWh</td>
					<td>150 kWh credit</td>
				</tr>
				<tr>
					<td>Week 2 (Sunny)</td>
					<td>800 kWh</td>
					<td>580 kWh</td>
					<td>+220 kWh</td>
					<td>220 kWh credit</td>
				</tr>
				<tr>
					<td>Week 3 (Cloudy)</td>
					<td>400 kWh</td>
					<td>650 kWh</td>
					<td>-250 kWh</td>
					<td>Use 250 kWh from credits</td>
				</tr>
				<tr>
					<td>Week 4 (Mixed)</td>
					<td>550 kWh</td>
					<td>600 kWh</td>
					<td>-50 kWh</td>
					<td>Use 50 kWh from credits</td>
				</tr>
				<tr>
					<td><strong>Monthly Total</strong></td>
					<td><strong>2,500 kWh</strong></td>
					<td><strong>2,430 kWh</strong></td>
					<td><strong>+70 kWh</strong></td>
					<td><strong>70 kWh credit carried forward</strong></td>
				</tr>
			</tbody>
		</table>

		<p>
			<strong>Result:</strong> You produced 70 kWh more than you consumed. These credits carry forward
			to next month, and you only pay the fixed grid connection charges (typically $10-30).
		</p>

		<h2>Financial Benefits of Net Metering</h2>

		<h3>Example: Annual Savings with Net Metering</h3>
		<p>Consider a 6kW residential solar system in California with $0.30/kWh electricity rate:</p>

		<table class="emi-table">
			<thead>
				<tr>
					<th>Metric</th>
					<th>Without Solar</th>
					<th>With Solar (No Net Metering)</th>
					<th>With Solar + Net Metering</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Annual consumption</td>
					<td>10,000 kWh</td>
					<td>10,000 kWh</td>
					<td>10,000 kWh</td>
				</tr>
				<tr>
					<td>Solar production</td>
					<td>0 kWh</td>
					<td>9,000 kWh</td>
					<td>9,000 kWh</td>
				</tr>
				<tr>
					<td>Self-consumption</td>
					<td>-</td>
					<td>6,000 kWh</td>
					<td>6,000 kWh</td>
				</tr>
				<tr>
					<td>Excess to grid</td>
					<td>-</td>
					<td>3,000 kWh (wasted)</td>
					<td>3,000 kWh (credited)</td>
				</tr>
				<tr>
					<td>Grid purchases</td>
					<td>10,000 kWh</td>
					<td>4,000 kWh</td>
					<td>1,000 kWh (net)</td>
				</tr>
				<tr>
					<td><strong>Annual electricity cost</strong></td>
					<td><strong>$3,000</strong></td>
					<td><strong>$1,200</strong></td>
					<td><strong>$300</strong></td>
				</tr>
				<tr>
					<td><strong>Annual savings</strong></td>
					<td><strong>-</strong></td>
					<td><strong>$1,800</strong></td>
					<td><strong>$2,700</strong></td>
				</tr>
			</tbody>
		</table>

		<p>
			<strong>Key Insight:</strong> Net metering increases annual savings by $900 (50% more) compared
			to solar without net metering, significantly reducing your payback period.
		</p>

		<h2>Types of Net Metering Programs</h2>

		<h3>1. Full Retail Rate Net Metering (NEM 1.0)</h3>
		<ul>
			<li><strong>Credit rate:</strong> Full retail electricity rate (e.g., $0.30/kWh)</li>
			<li><strong>1:1 credit:</strong> Each kWh exported = 1 kWh of credit</li>
			<li><strong>Best for customers:</strong> Maximum financial benefit</li>
			<li><strong>Status:</strong> Being phased out in many states</li>
			<li><strong>Still available in:</strong> Many states with traditional net metering</li>
		</ul>

		<h3>2. Modified Net Metering (NEM 2.0)</h3>
		<ul>
			<li><strong>Credit rate:</strong> Retail rate minus some fees/charges</li>
			<li><strong>Additional charges:</strong> Non-bypassable charges, grid fees</li>
			<li><strong>Typical reduction:</strong> 2-5 cents per kWh compared to retail</li>
			<li><strong>Status:</strong> Common in many progressive solar states</li>
			<li><strong>Examples:</strong> California (until 2023), Hawaii, Nevada</li>
		</ul>

		<h3>3. Net Billing / Buy-All-Sell-All (NEM 3.0)</h3>
		<ul>
			<li><strong>Credit rate:</strong> Lower export rate (often wholesale or avoided cost)</li>
			<li><strong>Typical rate:</strong> $0.05-0.15/kWh (vs. $0.25-0.40 retail)</li>
			<li><strong>Time-of-use rates:</strong> Credits vary by time of day</li>
			<li><strong>Battery incentive:</strong> Strong incentive to add battery storage</li>
			<li><strong>Examples:</strong> California NEM 3.0 (2023+), some utility programs</li>
		</ul>

		<h3>4. Virtual Net Metering (VNM)</h3>
		<ul>
			<li><strong>Community solar:</strong> Credits from shared/community solar projects</li>
			<li><strong>Multiple meters:</strong> Credits distributed across multiple accounts</li>
			<li><strong>No rooftop needed:</strong> Great for renters and unsuitable roofs</li>
			<li><strong>Allocation flexibility:</strong> Credits distributed by percentage or kWh</li>
			<li><strong>Examples:</strong> New York, Massachusetts, Colorado programs</li>
		</ul>

		<h2>California NEM 3.0: What Changed?</h2>
		<p>California's NEM 3.0 (started April 2023) significantly changed the solar economics:</p>

		<h3>Major Changes</h3>
		<ul>
			<li><strong>Export rates reduced:</strong> From $0.30/kWh to $0.05-0.10/kWh average</li>
			<li><strong>Time-of-use matters:</strong> Higher credits during peak hours (4-9 PM)</li>
			<li>
				<strong>Battery storage crucial:</strong> Stores excess for use during high-rate periods
			</li>
			<li><strong>Glide path:</strong> Rates decrease 2% annually for 10 years</li>
			<li><strong>Grid benefits adder:</strong> Small additional payment for grid support</li>
		</ul>

		<h3>NEM 2.0 vs NEM 3.0 Comparison</h3>
		<table class="emi-table">
			<thead>
				<tr>
					<th>Feature</th>
					<th>NEM 2.0 (Before April 2023)</th>
					<th>NEM 3.0 (After April 2023)</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Export credit rate</td>
					<td>Retail rate (~$0.30/kWh)</td>
					<td>Avoided cost ($0.05-0.10/kWh)</td>
				</tr>
				<tr>
					<td>Peak hours credit</td>
					<td>Same as off-peak</td>
					<td>Higher (4-9 PM)</td>
				</tr>
				<tr>
					<td>Battery requirement</td>
					<td>Optional</td>
					<td>Highly recommended</td>
				</tr>
				<tr>
					<td>Payback period (no battery)</td>
					<td>5-7 years</td>
					<td>8-12 years</td>
				</tr>
				<tr>
					<td>Payback period (with battery)</td>
					<td>7-10 years</td>
					<td>7-10 years</td>
				</tr>
				<tr>
					<td>Interconnection timeline</td>
					<td>Fast</td>
					<td>Slower (high volume)</td>
				</tr>
			</tbody>
		</table>

		<h2>State-by-State Net Metering Policies</h2>

		<h3>States with Strong Net Metering</h3>

		<h4>New Jersey</h4>
		<ul>
			<li><strong>Policy:</strong> Full retail rate net metering</li>
			<li><strong>System size limit:</strong> 2 MW for most systems</li>
			<li><strong>Credit expiration:</strong> Annual reconciliation</li>
			<li><strong>Additional benefit:</strong> SREC (Solar Renewable Energy Credits) program</li>
		</ul>

		<h4>Massachusetts</h4>
		<ul>
			<li><strong>Policy:</strong> Net metering with SMART incentive program</li>
			<li><strong>System size limit:</strong> 60 kW residential, up to 2 MW commercial</li>
			<li><strong>Credit rate:</strong> Full retail rate for Class I & II</li>
			<li><strong>Special programs:</strong> Virtual net metering, SMART incentives</li>
		</ul>

		<h4>New York</h4>
		<ul>
			<li><strong>Policy:</strong> Net Energy Metering with VDER (Value of DER)</li>
			<li><strong>System size limit:</strong> 2 MW for most customers</li>
			<li><strong>Credit structure:</strong> Value stack including LSRV, DRVC, LBMP</li>
			<li><strong>Programs:</strong> Community solar, remote net metering</li>
		</ul>

		<h4>Arizona</h4>
		<ul>
			<li><strong>Policy:</strong> Net billing with export rates</li>
			<li><strong>System size limit:</strong> 125% of load, up to 1 MW</li>
			<li><strong>Credit rate:</strong> Varies by utility (APS, SRP, TEP)</li>
			<li><strong>Time-of-use:</strong> Export rates vary by time</li>
		</ul>

		<h4>Florida</h4>
		<ul>
			<li><strong>Policy:</strong> Net metering at retail rates</li>
			<li><strong>System size limit:</strong> 2 MW</li>
			<li><strong>Credit treatment:</strong> Month-to-month rollover</li>
			<li><strong>Unique aspect:</strong> No state income tax credit, but strong net metering</li>
		</ul>

		<h3>States with Limited or No Net Metering</h3>

		<h4>Alabama</h4>
		<ul>
			<li><strong>Policy:</strong> No statewide net metering mandate</li>
			<li><strong>Utility programs:</strong> Some utilities offer limited programs</li>
			<li><strong>Typical rates:</strong> Avoided cost or wholesale rates only</li>
		</ul>

		<h4>Tennessee</h4>
		<ul>
			<li><strong>Policy:</strong> No statewide net metering</li>
			<li><strong>TVA areas:</strong> Limited programs through Generation Partners</li>
			<li><strong>Credit rate:</strong> Wholesale rate only</li>
		</ul>

		<h4>Mississippi</h4>
		<ul>
			<li><strong>Policy:</strong> Net metering available but limited</li>
			<li><strong>System size limit:</strong> 20 kW residential</li>
			<li><strong>Credit treatment:</strong> Avoided cost rate</li>
		</ul>

		<h2>Net Metering vs. Other Solar Compensation Models</h2>

		<table class="emi-table">
			<thead>
				<tr>
					<th>Model</th>
					<th>How It Works</th>
					<th>Credit Rate</th>
					<th>Best For</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Net Metering</strong></td>
					<td>1:1 credit for excess</td>
					<td>Retail rate</td>
					<td>Most homeowners</td>
				</tr>
				<tr>
					<td><strong>Net Billing</strong></td>
					<td>Buy all, sell all separately</td>
					<td>Wholesale/avoided cost</td>
					<td>Battery storage users</td>
				</tr>
				<tr>
					<td><strong>Feed-in Tariff</strong></td>
					<td>Fixed payment per kWh</td>
					<td>Fixed contract rate</td>
					<td>Long-term certainty</td>
				</tr>
				<tr>
					<td><strong>Power Purchase Agreement</strong></td>
					<td>Third party owns system</td>
					<td>Lower than retail</td>
					<td>Zero upfront cost</td>
				</tr>
				<tr>
					<td><strong>Time-of-Use Net Metering</strong></td>
					<td>Variable credit by time</td>
					<td>Peak hours higher</td>
					<td>Battery + solar combos</td>
				</tr>
			</tbody>
		</table>

		<h2>Maximizing Net Metering Benefits</h2>

		<h3>1. Right-Size Your Solar System</h3>
		<ul>
			<li><strong>Analyze usage patterns:</strong> Review 12 months of electricity bills</li>
			<li><strong>Account for growth:</strong> Future EVs, home additions, electric heating</li>
			<li><strong>Optimal sizing:</strong> 90-110% of annual consumption</li>
			<li><strong>Avoid over-sizing:</strong> Excess credits may expire annually</li>
		</ul>

		<h3>2. Add Battery Storage (Especially NEM 3.0)</h3>
		<ul>
			<li><strong>Store excess production:</strong> Use during high-rate hours</li>
			<li><strong>Backup power:</strong> Keep critical loads running during outages</li>
			<li><strong>Peak shaving:</strong> Avoid grid use during expensive peak times</li>
			<li><strong>Arbitrage:</strong> Charge from grid when cheap, discharge when expensive</li>
		</ul>

		<h3>3. Optimize Energy Usage Timing</h3>
		<ul>
			<li>
				<strong>Use appliances during solar production:</strong> Run dishwasher, laundry during day
			</li>
			<li><strong>Pre-cool or pre-heat:</strong> Adjust HVAC during solar production hours</li>
			<li><strong>Charge EVs during day:</strong> Maximize use of solar-generated power</li>
			<li><strong>Smart home automation:</strong> Schedule high-consumption devices</li>
		</ul>

		<h3>4. Monitor Your System</h3>
		<ul>
			<li><strong>Track production:</strong> Ensure system performs as expected</li>
			<li><strong>Verify credits:</strong> Check utility bills for accurate crediting</li>
			<li><strong>Identify issues:</strong> Catch underperformance early</li>
			<li><strong>Usage insights:</strong> Find opportunities to shift consumption</li>
		</ul>

		<h3>5. Understand Annual True-Up</h3>
		<ul>
			<li><strong>Annual reconciliation:</strong> Most utilities settle annually</li>
			<li><strong>Excess credits:</strong> May be forfeited or compensated at wholesale rate</li>
			<li><strong>Plan accordingly:</strong> Size system to avoid large excess</li>
			<li><strong>Timing matters:</strong> Understand your utility's true-up date</li>
		</ul>

		<h2>Common Net Metering Questions</h2>

		<h3>Do I need a special meter for net metering?</h3>
		<p>
			Yes, you need a bi-directional (two-way) meter that can track electricity flowing both to and
			from the grid. Most utilities install this as part of the solar interconnection process, often
			at no additional cost. Some use smart meters that digitally track net consumption.
		</p>

		<h3>What happens to excess credits at year-end?</h3>
		<p>This varies by utility and state policy:</p>
		<ul>
			<li><strong>Forfeited:</strong> Credits expire and reset to zero (most common)</li>
			<li><strong>Compensated:</strong> Paid out at wholesale or avoided cost rate</li>
			<li><strong>Indefinite rollover:</strong> Credits continue indefinitely (rare)</li>
			<li><strong>Donated:</strong> Some utilities donate value to low-income programs</li>
		</ul>

		<h3>Can I participate in net metering with a leased system?</h3>
		<p>
			Yes, but the arrangement is typically managed by the leasing company. They receive the net
			metering credits and pass savings to you through reduced lease payments or electricity rates.
			The specific structure depends on your lease or PPA agreement.
		</p>

		<h3>What if I generate more than I consume all year?</h3>
		<p>If your solar system consistently over-produces:</p>
		<ul>
			<li>Annual true-up settles at wholesale rate or credits forfeit</li>
			<li>You typically won't receive full retail value for excess</li>
			<li>Consider reducing system size or adding more electrical loads (EV, heat pump)</li>
			<li>Battery storage can store excess for later use</li>
		</ul>

		<h3>Is net metering available for community solar?</h3>
		<p>
			Yes, through Virtual Net Metering (VNM) programs in many states. Community solar subscribers
			receive credits on their utility bills for their share of a larger solar array's production.
			This is ideal for renters, those with unsuitable roofs, or customers who want solar without
			installation.
		</p>

		<h3>Can net metering work with battery storage?</h3>
		<p>
			Yes, and increasingly this combination is optimal, especially under NEM 3.0 and similar
			programs:
		</p>
		<ul>
			<li>Solar charges battery during day</li>
			<li>Battery powers home during evening peak hours</li>
			<li>Only true excess exports to grid</li>
			<li>Maximizes self-consumption and savings</li>
		</ul>

		<h2>The Future of Net Metering</h2>

		<h3>Trends Shaping Net Metering</h3>
		<ul>
			<li>
				<strong>Lower export rates:</strong> Many states moving from retail to avoided cost rates
			</li>
			<li><strong>Time-varying credits:</strong> More emphasis on time-of-use compensation</li>
			<li><strong>Battery integration:</strong> Incentives favoring solar + storage systems</li>
			<li><strong>Grid services compensation:</strong> Payments for providing grid support</li>
			<li><strong>Community solar expansion:</strong> More VNM programs launching</li>
			<li><strong>Successor tariffs:</strong> Utilities designing post-net-metering programs</li>
		</ul>

		<h3>Legislative Landscape</h3>
		<p>Net metering policies continue to evolve as solar adoption increases:</p>
		<ul>
			<li>
				<strong>Utility pushback:</strong> Some utilities seeking to reduce or eliminate net metering
			</li>
			<li>
				<strong>Consumer advocacy:</strong> Solar advocates fighting to preserve favorable policies
			</li>
			<li><strong>Grandfathering:</strong> Most changes don't affect existing solar customers</li>
			<li><strong>State variations:</strong> Policies differ dramatically by state</li>
		</ul>

		<h2>Conclusion: Net Metering is Key to Solar Economics</h2>
		<p>
			Net metering remains one of the most important policies supporting residential and commercial
			solar adoption in the United States. While some states are transitioning to less generous
			compensation structures like NEM 3.0, the core principle of crediting solar exports continues
			to make solar financially attractive. Understanding your state's specific net metering rules,
			credit rates, and how to optimize your system design and usage patterns is essential for
			maximizing your solar investment returns.
		</p>

		<p>
			As net metering policies evolve, combining solar with battery storage is becoming increasingly
			important to maximize self-consumption and reduce dependence on favorable export rates.
			Whether you're in a traditional net metering state or one with updated policies like
			California's NEM 3.0, solar energy continues to offer substantial long-term savings and
			environmental benefits.
		</p>

		<div class="cta-section">
			<h3>Ready to Take Advantage of Net Metering?</h3>
			<p>
				Connect with verified solar installers in your area who understand your state's net metering
				policies. Get personalized quotes and expert guidance on system sizing, battery storage
				options, and maximizing your solar savings under local net metering programs.
			</p>
		</div>

		<LeadFormBusiness />
	</div>
</main>

<style>
	.blogpost {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		line-height: 1.8;
	}

	.blog-header {
		margin-bottom: 2rem;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 1.5rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		line-height: 1.2;
	}

	h2 {
		font-size: 1.875rem;
		font-weight: 600;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		color: #1a56db;
	}

	h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: #1e40af;
	}

	h4 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: #2563eb;
	}

	p {
		margin-bottom: 1.25rem;
		font-size: 1.125rem;
		color: #374151;
	}

	ul,
	ol {
		margin-bottom: 1.5rem;
		padding-left: 2rem;
		font-size: 1.125rem;
	}

	li {
		margin-bottom: 0.75rem;
		color: #4b5563;
	}

	.emi-table {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.emi-table thead {
		background-color: #1e40af;
		color: white;
	}

	.emi-table th {
		padding: 1rem;
		text-align: left;
		font-weight: 600;
	}

	.emi-table td {
		padding: 1rem;
		border-bottom: 1px solid #e5e7eb;
	}

	.emi-table tbody tr:nth-child(even) {
		background-color: #f9fafb;
	}

	.emi-table tbody tr:hover {
		background-color: #f3f4f6;
	}

	.emi-table tbody tr:last-child {
		font-weight: 600;
		background-color: #dbeafe;
	}

	.cta-section {
		background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
		color: white;
		padding: 2rem;
		border-radius: 12px;
		margin: 3rem 0;
		text-align: center;
	}

	.cta-section h3 {
		color: white;
		margin-top: 0;
		font-size: 1.75rem;
	}

	.cta-section p {
		color: #e0e7ff;
		font-size: 1.125rem;
		margin-bottom: 0;
	}

	a {
		color: #1e40af;
		text-decoration: none;
		border-bottom: 1px solid #93c5fd;
	}

	a:hover {
		color: #1e3a8a;
		border-bottom-color: #1e3a8a;
	}

	time {
		color: #6b7280;
		font-style: italic;
	}

	strong {
		font-weight: 600;
		color: #1f2937;
	}

	/* Dark mode styles */
	main.dark .blogpost {
		color: #e5e7eb;
	}

	main.dark h1,
	main.dark h2,
	main.dark h3,
	main.dark h4 {
		color: #60a5fa;
	}

	main.dark p,
	main.dark li {
		color: #d1d5db;
	}

	main.dark .blog-header {
		border-bottom-color: #374151;
	}

	main.dark .emi-table thead {
		background-color: #1e3a8a;
	}

	main.dark .emi-table td {
		border-bottom-color: #374151;
		background-color: #1f2937;
	}

	main.dark .emi-table tbody tr:nth-child(even) {
		background-color: #111827;
	}

	main.dark .emi-table tbody tr:hover {
		background-color: #374151;
	}

	main.dark .emi-table tbody tr:last-child {
		background-color: #1e3a8a;
	}

	main.dark a {
		color: #60a5fa;
		border-bottom-color: #3b82f6;
	}

	main.dark a:hover {
		color: #93c5fd;
		border-bottom-color: #93c5fd;
	}

	main.dark strong {
		color: #f3f4f6;
	}

	@media (max-width: 768px) {
		.blogpost {
			padding: 1rem;
		}

		h1 {
			font-size: 1.875rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		h3 {
			font-size: 1.25rem;
		}

		h4 {
			font-size: 1.125rem;
		}

		p,
		li {
			font-size: 1rem;
		}

		.emi-table {
			font-size: 0.875rem;
		}

		.emi-table th,
		.emi-table td {
			padding: 0.5rem;
		}
	}
</style>
