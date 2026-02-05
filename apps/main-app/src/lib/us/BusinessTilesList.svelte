<script>
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/us/themeStore';
	import LeadFormModal from '$lib/us/LeadFormModal.svelte';

	// State management
	let visibleBusinesses = $state([]); // Businesses to display on the screen
	let loadedCount = $state(0); // Tracks the number of businesses currently loaded
	let isModalOpen = $state(false); // State to track if the modal is open
	let selectedBusinessName = $state('');
	let selectedBusinessSlug = $state('');

	const batchSize = 3; // Number of businesses to load at a time

	// Get reactive data from the page store
	let city = $derived($page.data.city);
	let businesses = $derived($page.data.businesses || []);
	let errorMessage = $derived($page.data.errorMessage);
	let darkMode = $derived($isDarkMode);
	$effect(() => {
		if (loadedCount === 0 && businesses.length > 0) {
			loadMoreBusinesses();
		}
	});

	// Load more businesses function
	function loadMoreBusinesses() {
		const startIndex = loadedCount;
		const endIndex = Math.min(loadedCount + batchSize, businesses.length);
		visibleBusinesses = [...visibleBusinesses, ...businesses.slice(startIndex, endIndex)];
		loadedCount = endIndex;
	}

	// Function to make call
	function makeCall(phoneNumber, businessCity, businessSlug) {
		// Track Umami event after hydration
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(`${businessCity}-call-now-button-${businessSlug}`);
		}
		window.location.href = `tel:${phoneNumber}`;
	}

	// Function to open WhatsApp
	function openWhatsApp(phoneNumber, businessCity, businessSlug) {
		// Track Umami event after hydration
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track(`${businessCity}-whatsapp-button-${businessSlug}`);
		}
		// Clean the phone number and ensure it has the US country code
		const cleanNumber = phoneNumber.replace(/\D/g, '');
		const formattedNumber = cleanNumber.startsWith('1') ? cleanNumber : `1${cleanNumber}`;
		// Preset message for WhatsApp
		const presetMessage = encodeURIComponent('Inquiry through Solar Vipani');
		window.location.href = `https://wa.me/${formattedNumber}?text=${presetMessage}`;
	}

	// Function to toggle modal visibility
	function toggleModal(businessName = '', businessSlug = '') {
		selectedBusinessName = businessName;
		selectedBusinessSlug = businessSlug;
		isModalOpen = !isModalOpen;
	}

	// Prevent click propagation action
	function preventClickPropagation(node) {
		const handleClick = (event) => event.stopPropagation();
		node.addEventListener('click', handleClick);
		return {
			destroy() {
				node.removeEventListener('click', handleClick);
			}
		};
	}
</script>

{#if visibleBusinesses.length > 0}
	<section id="all-installers" class:dark={darkMode}>
		<ul>
			{#each visibleBusinesses as business}
				<li class="business-card">
					<div class="business-header">
						<h2>
							<a href={`/solar-panel-installer/${business.slug}`} class="business-link"
								>{business.businessname}</a
							>
						</h2>
						{#if business.tag}<span class="business-tag">{business.tag}</span>{/if}
					</div>

					{#if business.businessfilled}
						<div class="business-content">
							{#if business.description}
								<div class="info-section">
									<p>{business.description}</p>
								</div>
							{/if}

							<div class="info-section">
								<span class="info-icon phone-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path
											d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
										></path></svg
									>
								</span>
								<p>{business.phonenumber}</p>
							</div>

							<div class="info-section">
								<span class="info-icon address-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle
											cx="12"
											cy="10"
											r="3"
										></circle></svg
									>
								</span>
								<p>{business.address}</p>
							</div>
						</div>

						<div class="button-container">
							<button
								class="call-now"
								onclick={() => makeCall(business.phonenumber, business.city, business.slug)}
							>
								<span class="button-icon phone-button-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path
											d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
										></path></svg
									>
								</span>
								<span>CALL NOW</span>
							</button>
							<button
								class="whatsapp-button"
								onclick={() => openWhatsApp(business.phonenumber, business.city, business.slug)}
							>
								<span class="button-icon whatsapp-button-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path
											d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.345"
										/>
									</svg>
								</span>
								<span>WHATSAPP</span>
							</button>
						</div>
					{:else}
						<div class="business-content">
							<div class="info-section">
								<span class="info-icon address-icon">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="16"
										height="16"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
										><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle
											cx="12"
											cy="10"
											r="3"
										></circle></svg
									>
								</span>
								<p>{business.address || business.city + ', ' + business.state}</p>
							</div>
							{#if business.phonenumber}
								<div class="info-section">
									<span class="info-icon phone-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><path
												d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
											></path></svg
										>
									</span>
									<p>
										<a href={`tel:${business.phonenumber}`} class="phone-link"
											>{business.phonenumber}</a
										>
									</p>
								</div>
							{/if}
						</div>
						<div class="button-container">
							{#if business.phonenumber}
								<button
									class="call-now"
									onclick={() => makeCall(business.phonenumber, business.city, business.slug)}
								>
									<span class="button-icon phone-button-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
											><path
												d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
											></path></svg
										>
									</span>
									<span>CALL NOW</span>
								</button>
								<button
									class="whatsapp-button"
									onclick={() => openWhatsApp(business.phonenumber, business.city, business.slug)}
								>
									<span class="button-icon whatsapp-button-icon">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="currentColor"
										>
											<path
												d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.345"
											/>
										</svg>
									</span>
									<span>WHATSAPP</span>
								</button>
							{/if}
						</div>
					{/if}
				</li>
			{/each}
		</ul>

		{#if loadedCount < businesses.length}
			<button class="load-more" onclick={loadMoreBusinesses}>
				<span>LOAD MORE</span>
			</button>
		{/if}
	</section>
{/if}

{#if isModalOpen}
	<div
		class="modal-overlay"
		class:dark={darkMode}
		onclick={toggleModal}
		onkeydown={(e) => e.key === 'Escape' && toggleModal()}
		role="button"
		tabindex="0"
		aria-label="Close modal"
	>
		<dialog class="modal" open aria-modal="true" use:preventClickPropagation>
			<button class="close-modal" onclick={toggleModal} aria-label="Close"> &times; </button>
			<h2>Request a Free Quote from {selectedBusinessName}</h2>
			<LeadFormModal businessName={selectedBusinessName} businessSlug={selectedBusinessSlug} />
		</dialog>
	</div>
{/if}

<style>
	/* Root variables using custom properties with updated color palette */
	:root {
		/* Colors - more subtle palette */
		--primary-color: #2d82c7;
		--primary-hover: #1e6ca9;
		--primary-light: #e6f0ff;
		--secondary-color: #5bb56e;
		--secondary-hover: #4a9d5a;
		--accent-color: #ffd54f;

		/* Text colors */
		--text-dark: #374151;
		--text-medium: #6b7280;
		--text-light: #f3f4f6;

		/* Theme colors */
		--light-bg-color: #f8f9fa;
		--dark-bg-color: #1a202c;
		--light-card-bg: #ffffff;
		--dark-card-bg: #2d3748;

		/* UI elements - lighter shadows */
		--border-radius-sm: 4px;
		--border-radius-md: 8px;
		--border-radius-lg: 12px;
		--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
		--shadow-md: 0 3px 8px rgba(0, 0, 0, 0.05);
		--shadow-lg: 0 5px 15px rgba(0, 0, 0, 0.08);

		/* Typography */
		--font-family: 'Poppins', 'Helvetica Neue', Arial, sans-serif;
		--heading-line-height: 1.2;
		--body-line-height: 1.6;

		/* Transitions */
		--transition-fast: 0.2s ease;
		--transition-medium: 0.3s ease;
		--transition-slow: 0.5s ease;
	}

	/* Section styling */
	section {
		width: 100%;
		max-width: 1000px;
		margin: 0 auto 2.5rem;
		padding: 2rem 1.5rem;
		transition: background-color var(--transition-medium);
	}

	/* List styling */
	ul {
		list-style-type: none;
		padding: 0;
		width: 100%;
	}

	/* Business card styling - updated for cleaner look */
	.business-card {
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		border-radius: var(--border-radius-md);
		background-color: var(--light-card-bg);
		box-shadow: var(--shadow-md);
		transition:
			transform var(--transition-medium),
			box-shadow var(--transition-medium);
		border: 1px solid rgba(0, 0, 0, 0.05);
		max-width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.dark .business-card {
		background-color: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.business-card:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-lg);
	}

	/* Business header styling */
	.business-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.75rem;
		padding-bottom: 0.75rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.dark .business-header {
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	/* Business content styling */
	.business-content {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	/* Info section with icons */
	.info-section {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.info-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		color: var(--primary-color);
	}

	.dark .info-icon {
		color: var(--primary-light);
	}

	/* Business tag styling */
	.business-tag {
		display: inline-flex;
		align-items: center;
		color: #22c55e;
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		position: relative;
	}

	.business-tag::before {
		content: '✓';
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 14px;
		height: 14px;
		background-color: #22c55e;
		color: white;
		border-radius: 50%;
		font-size: 0.6rem;
		font-weight: bold;
		margin-right: 0.4rem;
	}

	.dark .business-tag {
		color: #4ade80;
	}

	.dark .business-tag::before {
		background-color: #4ade80;
	}

	/* Button container */
	.button-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	/* Enhanced buttons with icons */
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1rem;
		font-size: 0.9rem;
		font-weight: 700;
		border: none;
		border-radius: var(--border-radius-md);
		cursor: pointer;
		transition:
			background var(--transition-fast),
			transform var(--transition-fast),
			box-shadow var(--transition-fast);
		text-transform: uppercase;
		letter-spacing: 0.8px;
		gap: 0.5rem;
		min-height: 48px;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	button:focus-visible {
		outline: 2px solid var(--primary-color);
		outline-offset: 2px;
	}

	.button-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 20px;
		height: 20px;
	}

	/* Call button */
	.call-now {
		background: linear-gradient(135deg, #ff6b35, #f94449);
		color: white;
		width: 160px;
		position: relative;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
		border: 2px solid transparent;
	}

	.call-now::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(255, 255, 255, 0);
		transition: background-color var(--transition-fast);
	}

	.call-now:hover {
		background: linear-gradient(135deg, #f94449, #ff6b35);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
	}

	.call-now:active {
		transform: translateY(0);
	}

	.call-now:hover::after {
		background-color: rgba(255, 255, 255, 0.1);
	}

	/* WhatsApp button */
	.whatsapp-button {
		background: linear-gradient(135deg, #25d366, #20c858);
		color: white;
		width: 160px;
		position: relative;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);
		border: 2px solid transparent;
	}

	.whatsapp-button::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(255, 255, 255, 0);
		transition: background-color var(--transition-fast);
	}

	.whatsapp-button:hover {
		background: linear-gradient(135deg, #20c858, #25d366);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
	}

	.whatsapp-button:active {
		transform: translateY(0);
	}

	.whatsapp-button:hover::after {
		background-color: rgba(255, 255, 255, 0.1);
	}

	/* Load more button */
	.load-more {
		background-color: transparent;
		color: var(--primary-color);
		border: 1px solid var(--primary-color);
		padding: 0.75rem 1.5rem;
		margin: 1.5rem auto;
		display: flex;
		width: auto;
		min-width: 180px;
	}

	.load-more:hover {
		background-color: rgba(45, 130, 199, 0.05);
		transform: translateY(-2px);
		box-shadow: var(--shadow-sm);
	}

	.dark .load-more {
		color: var(--primary-light);
		border: 1px solid var(--primary-light);
	}

	.dark .load-more:hover {
		background-color: rgba(230, 240, 255, 0.05);
	}

	/* Business name and link styling */
	#all-installers h2 {
		font-size: 1.5rem;
		margin: 0;
		color: var(--primary-color);
	}

	.business-link {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
		transition: color var(--transition-fast);
		position: relative;
	}

	.business-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 2px;
		background-color: var(--primary-hover);
		transition: width var(--transition-medium);
	}

	.business-link:hover {
		color: var(--primary-hover);
	}

	.business-link:hover::after {
		width: 100%;
	}

	.dark .business-link {
		color: #90caf9;
	}

	.dark .business-link:hover {
		color: #64b5f6;
	}

	.dark .business-link::after {
		background-color: #64b5f6;
	}

	/* Phone link styling */
	.phone-link {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 500;
		transition: color var(--transition-fast);
	}

	.phone-link:hover {
		color: var(--primary-hover);
		text-decoration: underline;
	}

	.dark .phone-link {
		color: #90caf9;
	}

	.dark .phone-link:hover {
		color: #64b5f6;
	}

	/* Modal styling */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		backdrop-filter: blur(3px);
	}

	.modal {
		background: white;
		padding: 2rem;
		border-radius: var(--border-radius-md);
		max-width: 500px;
		width: 90%;
		box-shadow: var(--shadow-lg);
		position: relative;
	}

	.dark .modal {
		background-color: var(--dark-card-bg);
		color: var(--text-light);
	}

	.close-modal {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 10px;
		margin: 0;
		color: var(--text-dark);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-modal:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.dark .close-modal {
		color: var(--text-light);
	}

	.dark .close-modal:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	/* Paragraph styling */
	p {
		font-size: 1rem;
		margin: 0;
		line-height: var(--body-line-height);
	}

	li p {
		color: var(--text-medium);
	}

	.dark li p {
		color: #cbd5e0;
	}

	/* Responsive design */
	@media (max-width: 992px) {
		#all-installers h2 {
			font-size: 1.4rem;
		}
	}

	@media (max-width: 768px) {
		section {
			padding: 2rem 0.25rem;
			margin: 0 0 2.5rem;
			max-width: none;
		}

		button {
			padding: 0.6rem 1rem;
		}

		.modal {
			padding: 1.5rem;
		}
	}

	@media (max-width: 576px) {
		section {
			padding: 2rem 0.25rem;
			margin: 0 0 2.5rem;
			max-width: none;
		}

		.business-card {
			padding: 1.25rem;
		}

		.business-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.button-container {
			flex-direction: column;
			width: 100%;
		}

		.call-now,
		.whatsapp-button {
			width: 100%;
		}
	}
</style>
