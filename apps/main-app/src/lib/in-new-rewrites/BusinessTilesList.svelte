<script lang="ts">
	import { page } from '$app/stores';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Phone, MessageCircle, MapPin, X } from '@lucide/svelte';
	import LeadFormModal from '$lib/in-new-rewrites/LeadFormModal.svelte';
	import { makeCall, openWhatsApp } from '$lib/constants/businessTracking';

	// State management
	let visibleBusinesses = $state<any[]>([]);
	let loadedCount = $state(0);
	let isModalOpen = $state(false);
	let selectedBusinessName = $state('');
	let selectedBusinessSlug = $state('');

	const batchSize = 3;

	// Reactive values from page store
	let businesses = $derived($page.data.businesses || []);

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

</script>

{#if visibleBusinesses.length > 0}
	<section class="mx-auto w-full max-w-[theme(--max-width-4xl)] flex flex-col gap-[theme(--form-field-gap)] px-[theme(--button-padding-x-default)] my-[theme(--card-gap)]">
		{#each visibleBusinesses as business}
			<Card.Root class="shadow-[theme(--shadow-card)] transition-shadow duration-100">
				<Card.Header class="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b gap-[theme(--dropdown-menu-item-gap)] pb-[theme(--card-padding-y)]">
					<h2 class="text-[length:theme(--font-size-lg)] leading-[theme(--font-size-lg--line-height)] font-semibold tracking-[theme(--tracking-heading)]">
						<a
							href={`/in/solar-panel-installer/${business.slug}`}
							class="text-primary hover:opacity-80 underline-offset-2 hover:underline transition-all duration-[theme(--transition-default)]"
						>
							{business.businessname}
						</a>
					</h2>
					{#if business.tag}
						<Badge variant="secondary" class="whitespace-nowrap">
							<span class="inline-flex items-center justify-center w-4 h-4 mr-1 rounded-full text-success-foreground bg-success text-[length:theme(--font-size-xs)] font-bold">
								✓
							</span>
							{business.tag}
						</Badge>
					{/if}
				</Card.Header>

				<Card.Content class="flex flex-col gap-[theme(--form-element-field-gap)]">
					{#if business.businessfilled}
						<div class="flex items-center text-foreground-secondary gap-[theme(--form-element-field-gap)]">
							<Phone class="w-5 h-5 text-primary flex-shrink-0" />
							<span>{business.phonenumber}</span>
						</div>

						<div class="flex items-start text-foreground-secondary gap-[theme(--form-element-field-gap)]">
							<MapPin class="w-5 h-5 text-primary flex-shrink-0 mt-[theme(--form-element-field-gap)]" />
							<span>{business.address}</span>
						</div>
					{:else}
						<div class="flex items-start text-foreground-secondary gap-[theme(--form-element-field-gap)]">
							<MapPin class="w-5 h-5 text-primary flex-shrink-0 mt-[theme(--form-element-field-gap)]" />
							<span>{business.address || `${business.city}, ${business.state}`}</span>
						</div>
						{#if business.phonenumber}
							<div class="flex items-center text-foreground-secondary gap-[theme(--form-element-field-gap)]">
								<Phone class="w-5 h-5 text-primary flex-shrink-0" />
								<a
									href={`tel:${business.phonenumber}`}
									class="text-primary hover:opacity-80 hover:underline transition-all duration-[theme(--transition-default)]"
								>
									{business.phonenumber}
								</a>
							</div>
						{/if}
					{/if}
				</Card.Content>

				<div class="flex flex-col sm:flex-row gap-[theme(--form-element-field-gap)] p-[theme(--button-padding-y-default)_theme(--button-padding-x-lg)]">
					<Button
						variant="default"
						class="bg-destructive hover:bg-destructive-hover flex-1 sm:flex-none"
						onclick={() => makeCall(business.phonenumber, business.city, business.slug)}
					>
						<Phone class="w-4 h-4" />
						CALL NOW
					</Button>
					{#if business.businessfilled || business.phonenumber}
						<Button
							variant="default"
							class="bg-success hover:bg-success-hover flex-1 sm:flex-none"
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
			<div class="flex justify-center pt-[theme(--form-field-gap)]">
				<Button variant="outline" onclick={loadMoreBusinesses}>LOAD MORE</Button>
			</div>
		{/if}
	</section>
{/if}

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-md">
		<div class="flex items-center justify-between">
			<h2 class="text-[length:theme(--font-size-lg)] leading-[theme(--font-size-lg--line-height)] font-semibold">Request a Free Quote</h2>
			<Dialog.Close class="rounded-md opacity-70 hover:opacity-100">
				<X class="w-4 h-4" />
			</Dialog.Close>
		</div>
		<p class="text-[length:theme(--font-size-sm)] leading-[theme(--font-size-sm--line-height)] text-foreground-secondary">From {selectedBusinessName}</p>
		<LeadFormModal businessName={selectedBusinessName} businessSlug={selectedBusinessSlug} />
	</Dialog.Content>
</Dialog.Root>
