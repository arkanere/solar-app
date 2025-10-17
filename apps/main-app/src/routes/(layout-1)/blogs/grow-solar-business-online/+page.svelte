<script>
	import { isDarkMode } from '$lib/themeStore'; // If you have a global store for theme

	// Initialize dark mode state
	let darkMode;

	// Use the global theme store
	$: darkMode = $isDarkMode;
</script>

<main class={darkMode ? 'dark' : 'light'}>
	<div class="blogpost">
		<!-- Title -->
		<h1>How to Grow Your Solar Business Online in India</h1>

		<!-- Introduction -->
		<p>
			India’s solar sector has grown exponentially in the past decade, fueled by supportive
			government policies and a rising demand for clean energy. In such a competitive landscape,
			simply offering solar solutions isn’t enough—you need a robust online strategy to reach
			potential customers, stand out from rivals, and build credibility. This blog post will guide
			you through six essential strategies—covering market understanding, digital platforms, social
			media, content, local optimizations, and customer relationships—to help you grow your solar
			business online in India.
		</p>

		<!-- Section 1: Understand the Indian Solar Landscape -->
		<h2>1. Understand the Indian Solar Landscape</h2>
		<p>
			Before diving into digital marketing, it’s vital to grasp the unique characteristics of
			India’s solar market:
		</p>
		<ul>
			<li>
				<strong>Regional Nuances:</strong> Different states have varied policies, incentive programs,
				and climate conditions. Tailor your products and messaging accordingly.
			</li>
			<li>
				<strong>Government Incentives:</strong> Stay informed about central and state-level schemes like
				KUSUM, rooftop solar subsidies, and net metering. Promote these benefits to demonstrate tangible
				value.
			</li>
			<li>
				<strong>Cost Sensitivity:</strong> Many Indian customers prioritize affordability. Highlight
				financing options such as EMIs, subsidies, or group-installation discounts.
			</li>
			<li>
				<strong>Cultural Trust Factors:</strong> Word-of-mouth still holds weight. Showcase customer
				testimonials and success stories on all digital platforms.
			</li>
		</ul>

		<!-- Section 2: Build a Strong Online Presence -->
		<h2>2. Build a Strong Online Presence</h2>
		<p>
			Your website is the core of your digital presence. Here’s how to optimize it for Indian
			audiences:
		</p>
		<ul>
			<li>
				<strong>Mobile-First Design:</strong> Many in India browse primarily via smartphones; ensure
				seamless, fast-loading pages.
			</li>
			<li>
				<strong>Clear CTAs:</strong> Incorporate “Request a Quote” or “Schedule a Consultation” buttons
				in prominent locations.
			</li>
			<li>
				<strong>Localized Language Options:</strong> Adding Hindi or regional languages alongside English
				can expand your reach.
			</li>
			<li>
				<strong>Trust Signals:</strong> Display MNRE or BIS certifications, awards, and real client testimonials.
			</li>
		</ul>

		<!-- Section 3: Master Social Media and Communities -->
		<h2>3. Master Social Media and Communities</h2>
		<p>
			With one of the world’s largest social media user bases, India offers ample channels for brand
			awareness:
		</p>
		<ul>
			<li>
				<strong>Platform Choice:</strong> Facebook for local community groups, Instagram for visuals,
				LinkedIn for B2B connections.
			</li>
			<li>
				<strong>Engaging Content:</strong> Short explainer videos, installation photos, and cost-saving
				tips resonate with Indian audiences.
			</li>
			<li>
				<strong>Community Groups:</strong> Participate in local forums or sustainable-living groups.
				Offer expertise instead of pushing sales.
			</li>
			<li>
				<strong>Influencer Tie-Ups:</strong> Collaborate with eco-conscious influencers who can spotlight
				your brand’s benefits.
			</li>
		</ul>

		<!-- Section 4: Strengthen Content Marketing and SEO -->
		<h2>4. Strengthen Content Marketing and SEO</h2>
		<p>High-quality, keyword-rich content makes you more visible on search engines:</p>
		<ul>
			<li>
				<strong>Keyword Strategy:</strong> Incorporate local terms (“solar panel installer in Mumbai”)
				using tools like Google Keyword Planner.
			</li>
			<li>
				<strong>Blog and Articles:</strong> Write concise posts about financing, maintenance tips, and
				new technologies. Frequent updates help with rankings.
			</li>
			<li>
				<strong>Video Tutorials:</strong> Demonstrate real installations or cost-benefit analyses to
				offer shareable, easy-to-understand insights.
			</li>
			<li>
				<strong>On-Page Optimization:</strong> Use descriptive meta titles and headings so search engines—and
				users—quickly find relevant info.
			</li>
		</ul>

		<!-- Section 5: Embrace Local Listings and Optimizations -->
		<h2>5. Embrace Local Listings and Optimizations</h2>
		<p>Local SEO can make or break visibility in a specific region:</p>
		<ul>
			<li>
				<strong>Google Business Profile:</strong> Keep address, phone, hours, and photos current. Positive
				reviews boost local search rankings.
			</li>
			<li>
				<strong>Online Directories:</strong> List your company on
				<a href="/business-listing" target="_blank" rel="noopener">SolarVipani</a>, IndiaMART,
				Justdial, or regional trade portals for broader reach.
			</li>
			<li>
				<strong>Location-Specific Pages:</strong> Create pages tailored to each city or state you serve,
				highlighting local incentives.
			</li>
			<li>
				<strong>Partnerships:</strong> Collaborate with local firms (e.g., housing societies) and publicize
				these tie-ups for added credibility.
			</li>
		</ul>

		<!-- Section 6: Nurture Customer Relationships -->
		<h2>6. Nurture Customer Relationships</h2>
		<p>Strong relationships turn one-time buyers into long-term advocates:</p>
		<ul>
			<li>
				<strong>Email Marketing:</strong> Send newsletters with subsidy updates, maintenance tips, and
				exclusive offers.
			</li>
			<li>
				<strong>Post-Installation Support:</strong> Provide easy-to-follow guides and proactive assistance
				to reduce future issues.
			</li>
			<li>
				<strong>Referral Incentives:</strong> Encourage customers to recommend your services with referral
				bonuses or loyalty discounts.
			</li>
			<li>
				<strong>Personalization:</strong> Segment your list by location or purchase history to boost
				engagement and conversions.
			</li>
		</ul>

		<!-- Conclusion -->
		<h2>Conclusion</h2>
		<p>
			Growing a solar business online in India requires understanding local market nuances,
			delivering consistent messaging, and making it easy for potential clients to find credible
			information about your offerings. By focusing on mobile-friendly design, social engagement,
			targeted content, and local SEO, you’ll reach wider audiences and position your brand as a
			trusted authority. Plus, ongoing relationship-building—from personalized emails to referral
			programs—will help ensure sustained growth and a positive reputation in India’s fast-evolving
			solar market.
		</p>
	</div>
</main>

<style>
	/* Root variables for light and dark modes */
	:root {
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a1a1a;
		--light-primary-text-color: #333;
		--dark-primary-text-color: #f0f0f0;
		--accent-color: #0056b3;
		--font-family: 'Helvetica Neue', Arial, sans-serif;
	}

	/* Main layout styling */
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

	div {
		max-width: 650px;
	}

	/* Light mode */
	.light {
		background-color: var(--light-bg-color);
		color: var(--light-primary-text-color);
	}

	/* Dark mode */
	.dark {
		background-color: var(--dark-bg-color);
		color: var(--dark-primary-text-color);
	}

	/* Heading styling */
	h1,
	h2 {
		font-size: 2.2rem;
		margin-bottom: 1.5rem;
		font-weight: 600;
		line-height: 1.3;
	}

	h1 {
		text-align: center;
	}

	/* Paragraph styling */
	p {
		font-size: 1.1rem;
		margin-bottom: 1.8rem;
		line-height: 1.6;
	}

	/* List styling */
	ul {
		margin-left: 1.5rem;
		margin-bottom: 1.5rem;
	}

	ul li {
		margin-bottom: 1rem;
		line-height: 1.6;
	}

	strong {
		font-weight: 600;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 1.5rem;
		}

		h1,
		h2 {
			font-size: 2rem;
		}

		p,
		ul li {
			font-size: 1rem;
		}
	}
</style>
