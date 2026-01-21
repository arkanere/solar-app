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
	<section style="width: 100%; max-width: var(--max-width-4xl); margin-left: auto; margin-right: auto; padding-left: var(--button-padding-x-default); padding-right: var(--button-padding-x-default); margin-top: var(--card-gap); margin-bottom: var(--card-gap); display: flex; flex-direction: column; gap: var(--form-field-gap);">
		{#each visibleBusinesses as business}
			<Card.Root class="transition-shadow" style="box-shadow: var(--shadow-card); transition: box-shadow var(--transition-default);">
				<Card.Header class="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b" style="gap: var(--dropdown-menu-item-gap); padding-bottom: var(--card-padding-y);">
					<h2 style="font-size: var(--font-size-xl); line-height: var(--font-size-xl--line-height); font-weight: 600; letter-spacing: var(--tracking-heading);">
						<a
							href={`/in/solar-panel-installer/${business.slug}`}
							class="hover:opacity-80 underline-offset-2 hover:underline"
							style="color: hsl(var(--primary)); text-decoration: none; transition: all var(--transition-default);"
						>
							{business.businessname}
						</a>
					</h2>
					{#if business.tag}
						<Badge variant="secondary" class="whitespace-nowrap">
							<span class="inline-flex items-center justify-center w-4 h-4 mr-1 rounded-full text-success-foreground bg-success" style="font-size: var(--font-size-xs); font-weight: 700;">
								✓
							</span>
							{business.tag}
						</Badge>
					{/if}
				</Card.Header>

				<Card.Content style="display: flex; flex-direction: column; gap: var(--form-element-field-gap);">
					{#if business.businessfilled}
						{#if business.description}
							<p style="color: hsl(var(--foreground));">{business.description}</p>
						{/if}

						<div class="flex items-center" style="color: hsl(var(--foreground-secondary)); gap: var(--form-element-field-gap);">
							<Phone class="w-5 h-5 text-primary flex-shrink-0" />
							<span>{business.phonenumber}</span>
						</div>

						<div class="flex items-start" style="color: hsl(var(--foreground-secondary)); gap: var(--form-element-field-gap);">
							<MapPin class="w-5 h-5 text-primary flex-shrink-0" style="margin-top: var(--form-element-field-gap);" />
							<span>{business.address}</span>
						</div>
					{:else}
						<div class="flex items-start" style="color: hsl(var(--foreground-secondary)); gap: var(--form-element-field-gap);">
							<MapPin class="w-5 h-5 text-primary flex-shrink-0" style="margin-top: var(--form-element-field-gap);" />
							<span>{business.address || `${business.city}, ${business.state}`}</span>
						</div>
						{#if business.phonenumber}
							<div class="flex items-center" style="color: hsl(var(--foreground-secondary)); gap: var(--form-element-field-gap);">
								<Phone class="w-5 h-5 text-primary flex-shrink-0" />
								<a
									href={`tel:${business.phonenumber}`}
									class="hover:opacity-80 hover:underline"
									style="color: hsl(var(--primary)); text-decoration: none; transition: all var(--transition-default);"
								>
									{business.phonenumber}
								</a>
							</div>
						{/if}
					{/if}
				</Card.Content>

				<div class="flex flex-col sm:flex-row" style="background-color: hsl(var(--muted)); gap: var(--form-element-field-gap); padding: var(--button-padding-y-default) var(--button-padding-x-lg);">
					<Button
						variant="default"
						class="bg-destructive hover:bg-destructive/80 flex-1 sm:flex-none"
						onclick={() => makeCall(business.phonenumber, business.city, business.slug)}
					>
						<Phone class="w-4 h-4" />
						CALL NOW
					</Button>
					{#if business.businessfilled || business.phonenumber}
						<Button
							variant="default"
							class="bg-success hover:bg-success/80 flex-1 sm:flex-none"
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
			<div class="flex justify-center" style="padding-top: var(--form-field-gap);">
				<Button variant="outline" onclick={loadMoreBusinesses}>LOAD MORE</Button>
			</div>
		{/if}
	</section>
{/if}

<Dialog.Root bind:open={isModalOpen}>
	<Dialog.Content class="max-w-md">
		<div class="flex items-center justify-between">
			<h2 style="font-size: var(--font-size-lg); line-height: var(--font-size-lg--line-height); font-weight: 600;">Request a Free Quote</h2>
			<Dialog.Close class="rounded-md opacity-70 hover:opacity-100">
				<X class="w-4 h-4" />
			</Dialog.Close>
		</div>
		<p style="font-size: var(--font-size-sm); line-height: var(--font-size-sm--line-height); color: hsl(var(--foreground-secondary));">From {selectedBusinessName}</p>
		<LeadFormModal businessName={selectedBusinessName} businessSlug={selectedBusinessSlug} />
	</Dialog.Content>
</Dialog.Root>
