<script lang="ts">
	import { page } from '$app/stores';
	import { isDarkMode } from '$lib/themeStore';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Phone, MessageCircle, MapPin, X } from '@lucide/svelte';
	import LeadFormModal from '$lib/in-new-rewrites/LeadFormModal.svelte';
	import { makeCall, openWhatsApp } from '$lib/constants/businessTracking';

	// State management
	let visibleBusinesses = $state([]);
	let loadedCount = $state(0);
	let isModalOpen = $state(false);
	let selectedBusinessName = $state('');
	let selectedBusinessSlug = $state('');

	const batchSize = 3;

	// Reactive values from page store
	let city = $derived($page.data.city);
	let businesses = $derived($page.data.businesses || []);
	let errorMessage = $derived($page.data.errorMessage);
	let darkMode = $derived($isDarkMode);

	// Auto-load first batch
	$effect(() => {
		if (loadedCount === 0 && businesses.length > 0) {
			loadMoreBusinesses();
		}
	});

	function loadMoreBusinesses() {
		const startIndex = loadedCount;
		const endIndex = Math.min(loadedCount + batchSize, businesses.length);
		visibleBusinesses = [...visibleBusinesses, ...businesses.slice(startIndex, endIndex)];
		loadedCount = endIndex;
	}

	function toggleModal(businessName = '', businessSlug = '') {
		selectedBusinessName = businessName;
		selectedBusinessSlug = businessSlug;
		isModalOpen = !isModalOpen;
	}
</script>

{#if visibleBusinesses.length > 0}
	<section class="w-full max-w-4xl mx-auto my-10 px-4 space-y-4">
		{#each visibleBusinesses as business}
			<Card.Root class="hover:shadow-lg transition-shadow">
				<Card.Header class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 pb-3 border-b">
					<h2 class="text-xl font-semibold">
						<a
							href={`/in/solar-panel-installer/${business.slug}`}
							class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline-offset-2 hover:underline"
						>
							{business.businessname}
						</a>
					</h2>
					{#if business.tag}
						<Badge variant="secondary" class="whitespace-nowrap">
							<span class="inline-flex items-center justify-center w-4 h-4 mr-1 rounded-full text-xs font-bold text-white bg-green-600">
								✓
							</span>
							{business.tag}
						</Badge>
					{/if}
				</Card.Header>

				<Card.Content class="space-y-3">
					{#if business.businessfilled}
						{#if business.description}
							<p class="text-gray-700 dark:text-gray-300">{business.description}</p>
						{/if}

						<div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
							<Phone class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
							<span>{business.phonenumber}</span>
						</div>

						<div class="flex items-start gap-3 text-gray-600 dark:text-gray-400">
							<MapPin class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
							<span>{business.address}</span>
						</div>
					{:else}
						<div class="flex items-start gap-3 text-gray-600 dark:text-gray-400">
							<MapPin class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
							<span>{business.address || `${business.city}, ${business.state}`}</span>
						</div>
						{#if business.phonenumber}
							<div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
								<Phone class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
								<a
									href={`tel:${business.phonenumber}`}
									class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
								>
									{business.phonenumber}
								</a>
							</div>
						{/if}
					{/if}
				</Card.Content>

				<div class="flex flex-col sm:flex-row gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
					<Button
						variant="default"
						class="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
						onclick={() => makeCall(business.phonenumber, business.city, business.slug)}
					>
						<Phone class="w-4 h-4" />
						CALL NOW
					</Button>
					{#if business.businessfilled || business.phonenumber}
						<Button
							variant="default"
							class="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
							onclick={() => openWhatsApp(business.phonenumber, business.city, business.slug)}
						>
							<MessageCircle class="w-4 h-4" />
							WHATSAPP
						</Button>
					{/if}
				</div>
			</Card.Root>
		{/each}

		{#if loadedCount < businesses.length}
			<div class="flex justify-center pt-4">
				<Button variant="outline" onclick={loadMoreBusinesses}>LOAD MORE</Button>
			</div>
		{/if}
	</section>
{/if}

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-md">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">Request a Free Quote</h2>
			<Dialog.Close class="rounded-md opacity-70 hover:opacity-100">
				<X class="w-4 h-4" />
			</Dialog.Close>
		</div>
		<p class="text-sm text-gray-600 dark:text-gray-400">From {selectedBusinessName}</p>
		<LeadFormModal businessName={selectedBusinessName} businessSlug={selectedBusinessSlug} />
	</Dialog.Content>
</Dialog.Root>
