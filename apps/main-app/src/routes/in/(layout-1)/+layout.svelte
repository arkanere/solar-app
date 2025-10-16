<script>
	import { isDarkMode, toggleTheme, initializeTheme } from '$lib/themeStore';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import ChatbotWidget from '$lib/ChatbotWidget.svelte';
	import { storiesModalOpen } from '$lib/storiesStore.js';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { page } from '$app/stores';

	// Lazy loading for StoriesModal
	let StoriesModalComponent = null;
	let storiesModalLoading = false;

	// Create a shared store for chat messages
	const chatMessages = writable([]);

	// Only load component client-side to avoid SSR issues
	let showChat = false;

	// Translation dropdown state
	let showTranslateDropdown = false;
	let showTranslationModal = false;
	let selectedLanguage = '';

	// Indian languages for translation
	const indianLanguages = [
		{ code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
		{ code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
		{ code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
		{ code: 'bn', name: 'বাংলা (Bengali)', flag: '🇮🇳' },
		{ code: 'mr', name: 'मराठी (Marathi)', flag: '🇮🇳' },
		{ code: 'gu', name: 'ગુજરાતી (Gujarati)', flag: '🇮🇳' },
		{ code: 'more', name: 'More Languages', flag: '🌍' }
	];

	// Reactive variable for current page path - format for CallSafe (only a-z, A-Z, 0-9, -, _)
	$: currentPath = $page.url.pathname
		.replace(/\//g, '-')           // Replace slashes with hyphens
		.replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
		.replace(/-+/g, '-')           // Replace multiple hyphens with single
		|| 'home';                     // Default to 'home' for root path

	// Initialize the theme when the component is mounted
	onMount(() => {
		initializeTheme();
		// Only show the chat widget after the page has loaded
		showChat = true;
		// Initialize Vercel Speed Insights
		injectSpeedInsights();

		// Track CallSafe widget interactions
		trackCallSafeEvents();

		// Add click outside listener for translate dropdown
		document.addEventListener('click', handleClickOutside);

		// Defer analytics scripts to improve initial page performance
		setTimeout(() => {
			loadAnalytics();
		}, 3000); // Load analytics after 3 seconds

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	function trackCallSafeEvents() {
		// Track main widget button clicks
		document.addEventListener('click', (event) => {
			if (event.target.closest('.callsafe-button') || 
				event.target.classList.contains('callsafe-button')) {
				
				if (typeof window !== 'undefined' && window.umami) {
					window.umami.track('callsafe-widget-clicked');
				}
			}
		});

		// Track other CallSafe interactions
		document.addEventListener('click', (event) => {
			const target = event.target;
			
			if (target.id === 'callsafe-mute') {
				if (typeof window !== 'undefined' && window.umami) {
					window.umami.track('callsafe-mute-clicked');
				}
			} else if (target.id === 'callsafe-end') {
				if (typeof window !== 'undefined' && window.umami) {
					window.umami.track('callsafe-call-ended');
				}
			}
		});
	}

	// Lazy load StoriesModal component when modal should open
	async function loadStoriesModal() {
		if (storiesModalLoading || StoriesModalComponent) return;
		
		try {
			storiesModalLoading = true;
			const module = await import('$lib/StoriesModal.svelte');
			StoriesModalComponent = module.default;
		} catch (error) {
			console.error('Failed to load StoriesModal:', error);
		} finally {
			storiesModalLoading = false;
		}
	}

	// Function to open stories modal with lazy loading
	async function openStoriesModal() {
		await loadStoriesModal();
		if (StoriesModalComponent) {
			storiesModalOpen.set(true);
		}
	}

	// Watch for modal open state changes to trigger lazy loading
	$: if ($storiesModalOpen && !StoriesModalComponent && !storiesModalLoading) {
		loadStoriesModal();
	}

	// Handle translate dropdown toggle
	function toggleTranslateDropdown() {
		showTranslateDropdown = !showTranslateDropdown;
	}

	// Handle language selection
	function selectLanguage(language) {
		selectedLanguage = language.name;
		showTranslateDropdown = false;
		showTranslationModal = true;
	}

	// Close translation modal
	function closeTranslationModal() {
		showTranslationModal = false;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.translate-container')) {
			showTranslateDropdown = false;
		}
	}

	function loadAnalytics() {
		// Load Hotjar
		if (typeof window !== 'undefined' && !window.hj) {
			(function (h, o, t, j, a, r) {
				h.hj =
					h.hj ||
					function () {
						(h.hj.q = h.hj.q || []).push(arguments);
					};
				h._hjSettings = { hjid: 5045118, hjsv: 6 };
				a = o.getElementsByTagName('head')[0];
				r = o.createElement('script');
				r.async = 1;
				r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
				a.appendChild(r);
			})(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
		}

		// Load Google Analytics
		if (typeof window !== 'undefined' && !window.gtag) {
			const script = document.createElement('script');
			script.async = true;
			script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BXXPPJ3LK8';
			document.head.appendChild(script);

			window.dataLayer = window.dataLayer || [];
			function gtag() {
				dataLayer.push(arguments);
			}
			window.gtag = gtag;
			gtag('js', new Date());
			gtag('config', 'G-BXXPPJ3LK8');
		}

		// Load Twitter conversion tracking
		if (typeof window !== 'undefined' && !window.twq) {
			!(function (e, t, n, s, u, a) {
				e.twq ||
					((s = e.twq =
						function () {
							s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
						}),
					(s.version = '1.1'),
					(s.queue = []),
					(u = t.createElement(n)),
					(u.async = !0),
					(u.src = 'https://static.ads-twitter.com/uwt.js'),
					(a = t.getElementsByTagName(n)[0]),
					a.parentNode.insertBefore(u, a));
			})(window, document, 'script');
			window.twq('config', 'opkvk');
		}
	}
</script>

<!-- svelte-ignore a11y-img-redundant-alt -->
<svelte:head>
	<!-- Umami Analytics - Layout 1 Only (kept as defer for minimal impact) -->
	<script
		defer
		src="https://cloud.umami.is/script.js"
		data-website-id="d592f22f-fdfe-470a-9cd7-fc46022d46ec"
	></script>

	<!-- Facebook Pixel (kept for immediate tracking) -->
	<script async="" src="https://connect.facebook.net/en_US/fbevents.js"></script>

	<!-- CallSafe Widget - Lazy loaded after page is fully loaded -->
	<script>
		if (typeof window !== 'undefined') {
			window.addEventListener('load', function() {
				const callsafeScript = document.createElement('script');
				callsafeScript.src = 'https://callsafe.tech/embed.js';
				callsafeScript.setAttribute('data-handle', '25831dee9a0b76f8');
				callsafeScript.setAttribute('data-source-id', 'solar-vipani');
				document.head.appendChild(callsafeScript);
			});
		}
	</script>

	<!--src="http://localhost:5173/embed4.js"  -->

	<!-- Heavy analytics scripts moved to loadAnalytics() function for deferred loading -->
</svelte:head>

<nav class={$isDarkMode ? 'dark' : 'light'}>
	<a href="/in">Solar Vipani</a>
	<a href="/in/business-listing">List Business</a>
	<a href="/in/recent-solar-installation-projects">Recent Projects</a>
	<a href="/in/solar-panel-installer-directory">Directory</a>
	<button class="stories-nav-btn" on:click={openStoriesModal}>Stories</button>
	<a href="/in/about-us">About us</a>

	<!-- Translate Dropdown -->
	<div class="translate-container">
		<button class="translate-btn" on:click={toggleTranslateDropdown}>
			🌐 Translate
		</button>

		{#if showTranslateDropdown}
			<div class="translate-dropdown">
				{#each indianLanguages as language}
					<button
						class="language-option"
						on:click={() => selectLanguage(language)}
					>
						{language.flag} {language.name}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<button on:click={toggleTheme}>
		{$isDarkMode ? 'Light mode' : 'Dark mode'}
	</button>
</nav>

<slot></slot>

<!-- Stories Modal - Lazy Loaded -->
{#if StoriesModalComponent}
	<svelte:component this={StoriesModalComponent} />
{:else if storiesModalLoading && $storiesModalOpen}
	<!-- Loading state for component import -->
	<div class="stories-loading-backdrop">
		<div class="stories-loading-container">
			<div class="stories-loading-spinner"></div>
			<p>Loading stories...</p>
		</div>
	</div>
{/if}

<!-- Translation Instructions Modal -->
{#if showTranslationModal}
	<div class="modal-backdrop" on:click={closeTranslationModal}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<h3>🌐 How to translate to {selectedLanguage}</h3>
				<button class="modal-close" on:click={closeTranslationModal}>×</button>
			</div>
			<div class="modal-body">
				
				<div class="instruction-steps">
					<h4>📱 On Mobile:</h4>
					<div class="step">
						<div class="step-number">1</div>
						<div class="step-content">
							<strong>Tap the three dots menu (⋮) in your browser</strong>
						</div>
					</div>
					<div class="step">
						<div class="step-number">2</div>
						<div class="step-content">
							<strong>Look for "Translate" option</strong>
						</div>
					</div>
					<div class="step">
						<div class="step-number">3</div>
						<div class="step-content">
							<strong>Select your language</strong>
						</div>
					</div>
				</div>
				
				<div class="instruction-steps">
					<h4>💻 On Desktop:</h4>
					<div class="step">
						<div class="step-number">1</div>
						<div class="step-content">
							<strong>Right-click anywhere on this page</strong>
						</div>
					</div>
					<div class="step">
						<div class="step-number">2</div>
						<div class="step-content">
							<strong>Look for "Translate to {selectedLanguage !== 'More Languages' ? (selectedLanguage.split('(')[1]?.replace(')', '') || 'your language') : 'your language'}"</strong>
						</div>
					</div>
					<div class="step">
						<div class="step-number">3</div>
						<div class="step-content">
							<strong>Click to translate</strong>
						</div>
					</div>
				</div>
				
				<div class="alternative-method">
					<h4>💡 Alternative methods:</h4>
					<p><strong>Chrome users:</strong> Look for the translate icon 🌐 in your address bar</p>
					<p><strong>Safari (iPhone/iPad):</strong> Tap the "aA" button in address bar</p>
					<p><strong>Other browsers:</strong> Check browser settings for translation options</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- {#if browser && showChat}
  <ChatbotWidget messages={chatMessages} />
{/if} -->

<style>
	:global(body) {
		font-family: 'Georgia', serif;
		margin: 0;
		padding: 0;
	}

	nav {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		padding: 1rem;
		transition: background-color 0.3s ease;
		width: 100%;
		box-sizing: border-box;
		gap: 2rem;
	}

	nav a {
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 500;
		transition: color 0.3s ease;
		white-space: nowrap;
	}

	/* Light Mode */
	.light {
		background-color: #fafafa;
		color: #333;
	}

	.light a {
		color: #333;
	}

	.light a:hover {
		color: #0077cc;
	}

	/* Dark Mode */
	.dark {
		background-color: #1a1a1a;
		color: #fff;
	}

	.dark a {
		color: #fff;
	}

	.dark a:hover {
		color: #66b2ff;
	}

	/* Button style */
	button {
		background: none;
		border: 1px solid;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition:
			background-color 0.3s ease,
			color 0.3s ease;
		white-space: nowrap;
		border-radius: 4px;
	}

	/* Stories navigation button - special styling */
	.stories-nav-btn {
		background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
		border: none;
		color: white;
		font-weight: 600;
		border-radius: 20px;
		padding: 0.6rem 1.2rem;
		font-size: 0.95rem;
		margin-left: 0;
	}

	.stories-nav-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
		filter: brightness(1.1);
	}

	/* Theme toggle button and translate container - move to right */
	.translate-container {
		margin-left: auto;
	}

	.light button {
		border-color: #333;
		color: #333;
	}

	.light button:hover {
		background-color: #333;
		color: white;
	}

	.dark button {
		border-color: #fff;
		color: #fff;
	}

	.dark button:hover {
		background-color: #fff;
		color: #333;
	}

	/* Translate button - different hover effect */
	.light .translate-btn:hover {
		background-color: #f0f8ff;
		color: #0077cc;
		border-color: #0077cc;
	}

	.dark .translate-btn:hover {
		background-color: #1a2332;
		color: #66b2ff;
		border-color: #66b2ff;
	}

	/* Stories Modal Loading State */
	.stories-loading-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.95);
		z-index: 2000;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.stories-loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		color: white;
		text-align: center;
	}

	.stories-loading-spinner {
		width: 50px;
		height: 50px;
		border: 4px solid rgba(255, 255, 255, 0.2);
		border-left-color: white;
		border-radius: 50%;
		animation: stories-spin 1s linear infinite;
	}

	@keyframes stories-spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.stories-loading-container p {
		font-size: 1.1rem;
		margin: 0;
	}

	/* Translate container and dropdown */
	.translate-container {
		position: relative;
		display: inline-block;
	}

	.translate-btn {
		background: none;
		border: 1px solid;
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		cursor: pointer;
		transition: background-color 0.3s ease, color 0.3s ease;
		white-space: nowrap;
		border-radius: 4px;
	}

	.translate-dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		background: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		min-width: 200px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		margin-top: 2px;
	}

	.dark .translate-dropdown {
		background: #2a2a2a;
		border-color: #555;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.language-option {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: none;
		text-align: left;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background-color 0.2s ease;
		border-bottom: 1px solid #eee;
	}

	.language-option:last-child {
		border-bottom: none;
	}

	.language-option:hover {
		background-color: #f5f5f5;
	}

	.dark .language-option {
		color: #fff;
		border-bottom-color: #444;
	}

	.dark .language-option:hover {
		background-color: #3a3a3a;
	}

	/* Translation Modal */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		max-width: 500px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
	}

	.dark .modal-content {
		background: #2a2a2a;
		color: #fff;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	.dark .modal-header {
		border-bottom-color: #444;
	}

	.modal-header h3 {
		margin: 0;
		font-size: 1.2rem;
		color: #333;
	}

	.dark .modal-header h3 {
		color: #fff;
	}

	.modal-close {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
		color: #666;
		transition: color 0.2s ease;
	}

	.modal-close:hover {
		color: #333;
	}

	.dark .modal-close {
		color: #ccc;
	}

	.dark .modal-close:hover {
		color: #fff;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.instruction-steps {
		margin-bottom: 1.5rem;
	}

	.step {
		display: flex;
		margin-bottom: 1rem;
		align-items: flex-start;
	}

	.step-number {
		background: #0077cc;
		color: white;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8rem;
		font-weight: bold;
		margin-right: 1rem;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.step-content strong {
		display: block;
		margin-bottom: 0.25rem;
		color: #333;
	}

	.dark .step-content strong {
		color: #fff;
	}

	.step-content p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}

	.dark .step-content p {
		color: #ccc;
	}

	.alternative-method {
		border-top: 1px solid #eee;
		padding-top: 1rem;
	}

	.dark .alternative-method {
		border-top-color: #444;
	}

	.alternative-method h4 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #333;
	}

	.dark .alternative-method h4 {
		color: #fff;
	}

	.alternative-method p {
		margin: 0.25rem 0;
		font-size: 0.9rem;
		color: #666;
	}

	.dark .alternative-method p {
		color: #ccc;
	}

	/* More languages content */
	.more-languages-content {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid #eee;
	}

	.dark .more-languages-content {
		border-bottom-color: #444;
	}

	.language-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.language-grid span {
		background: #f5f5f5;
		padding: 0.5rem;
		border-radius: 4px;
		font-size: 0.85rem;
		text-align: center;
	}

	.dark .language-grid span {
		background: #3a3a3a;
		color: #fff;
	}

	.instruction-steps h4 {
		margin: 1rem 0 0.5rem 0;
		color: #0077cc;
		font-size: 1rem;
	}

	.dark .instruction-steps h4 {
		color: #66b2ff;
	}

	.instruction-steps:first-of-type h4 {
		margin-top: 0;
	}

	/* Mobile responsiveness */
	@media (max-width: 768px) {
		nav {
			justify-content: center;
			padding: 0.75rem;
			gap: 1rem;
		}

		nav a {
			font-size: 0.9rem;
		}

		button {
			padding: 0.25rem 0.5rem;
			font-size: 0.8rem;
			margin-left: 0;
		}

		.stories-nav-btn {
			padding: 0.4rem 0.8rem;
			font-size: 0.85rem;
		}

		.translate-btn {
			padding: 0.4rem 0.8rem;
			font-size: 0.8rem;
		}

		.translate-dropdown {
			left: auto;
			right: 0;
			min-width: 180px;
		}

		.modal-content {
			width: 95%;
			margin: 1rem;
		}

		.modal-header {
			padding: 1rem;
		}

		.modal-body {
			padding: 1rem;
		}
	}
</style>
