<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';

	export type ShowEditProfileProps = {
		show?: boolean;
		businessInfo?: Record<string, any>;
		businessSlug?: string;
		onClose?: () => void;
		onUpdated?: (profile?: unknown) => void;
	};

	let {
		show = $bindable(false),
		businessInfo = {},
		businessSlug = '',
		onClose = () => {},
		onUpdated = () => {}
	}: ShowEditProfileProps = $props();

	// Service mappings
	const SERVICE_OPTIONS = [
		{ id: 1, name: 'Solar Panel Installation' },
		{ id: 2, name: 'Net Metering' },
		{ id: 3, name: 'Subsidy Documentation' },
		{ id: 4, name: 'Financing' },
		{ id: 5, name: 'Cleaning of Solar Panels' },
		{ id: 6, name: 'Agricultural Solar Installation' }
	];

	// Brand mappings
	const BRAND_OPTIONS = [
		{ id: 1, name: 'Waaree Energies' },
		{ id: 2, name: 'Adani Solar' },
		{ id: 3, name: 'Tata Power Solar' },
		{ id: 4, name: 'Vikram Solar' },
		{ id: 5, name: 'Goldi Solar' },
		{ id: 6, name: 'RenewSys' },
		{ id: 7, name: 'Loom Solar' }
	];

	// Create a local copy of the business info that we can modify
	let formData = $state({
		id: '',
		businessname: '',
		description: '',
		phonenumber: '',
		whatsapp: '',
		email: '',
		address: '',
		website: '',
		instagram_id: '',
		google_maps_link: '',
		services: [] as number[],
		brands: [] as number[]
	});

	// Reset the form data whenever the modal is shown or businessInfo changes
	$effect(() => {
		if (show) {
			resetForm();
		}
	});

	$effect(() => {
		if (businessInfo && Object.keys(businessInfo).length > 0) {
			// Only update if businessInfo actually has values
			if (show) resetForm();
		}
	});

	function close() {
		show = false;
		onClose();
	}

	function resetForm() {
		// Create a fresh copy of the business info
		formData = {
			id: businessInfo.id || '',
			businessname: businessInfo.businessname || '',
			description: businessInfo.description || '',
			phonenumber: businessInfo.phonenumber || '',
			whatsapp: businessInfo.whatsapp || '',
			email: businessInfo.email || '',
			address: businessInfo.address || '',
			website: businessInfo.website || '',
			instagram_id: businessInfo.instagram_id || '',
			google_maps_link: businessInfo.google_maps_link || '',
			services: businessInfo.services || [],
			brands: businessInfo.brands || []
		};
	}

	// Helper functions for service selection
	function toggleService(serviceId: number) {
		if (formData.services.includes(serviceId)) {
			formData.services = formData.services.filter((id) => id !== serviceId);
		} else {
			formData.services = [...formData.services, serviceId];
		}
	}

	function isServiceSelected(serviceId: number) {
		return formData.services.includes(serviceId);
	}

	// Helper functions for brand selection
	function toggleBrand(brandId: number) {
		if (formData.brands.includes(brandId)) {
			formData.brands = formData.brands.filter((id) => id !== brandId);
		} else {
			formData.brands = [...formData.brands, brandId];
		}
	}

	function isBrandSelected(brandId: number) {
		return formData.brands.includes(brandId);
	}

	function handleOpenChange(open: boolean) {
		if (!open) {
			show = false;
			onClose();
		}
	}

	const saveProfile = async () => {
		try {
			const response = await fetch(`/in/api/updateBusinessDetails`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...formData,
					business_slug: businessSlug
				})
			});

			const result = await response.json();
			if (result.success) {
				toast.success('Profile updated successfully!');
				onUpdated(formData);
				show = false;
				onClose();
			} else {
				throw new Error('Failed to update profile');
			}
		} catch (error) {
			console.error('Error updating profile:', error);
			toast.error('An error occurred while updating the profile');
		}
	};
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px] max-h-[calc(100vh-40px)] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Edit Profile</Dialog.Title>
		</Dialog.Header>

		<form
			class="flex flex-col gap-2.5"
			onsubmit={(e) => {
				e.preventDefault();
				saveProfile();
			}}
		>
			<Label for="businessname" class="font-bold">Business Name:</Label>
			<Input id="businessname" bind:value={formData.businessname} required />

			<Label for="description" class="font-bold">Description:</Label>
			<Textarea id="description" bind:value={formData.description} class="min-h-[100px]" />

			<Label class="font-bold">Services Provided:</Label>
			<div class="flex flex-col gap-3 p-3 border rounded-md">
				{#each SERVICE_OPTIONS as service}
					<label class="flex items-center gap-3 cursor-pointer">
						<Checkbox
							checked={isServiceSelected(service.id)}
							onCheckedChange={() => toggleService(service.id)}
						/>
						<span class="text-sm">{service.name}</span>
					</label>
				{/each}
			</div>

			<Label class="font-bold">Brands:</Label>
			<div class="flex flex-col gap-3 p-3 border rounded-md">
				{#each BRAND_OPTIONS as brand}
					<label class="flex items-center gap-3 cursor-pointer">
						<Checkbox
							checked={isBrandSelected(brand.id)}
							onCheckedChange={() => toggleBrand(brand.id)}
						/>
						<span class="text-sm">{brand.name}</span>
					</label>
				{/each}
			</div>

			<Label for="phonenumber" class="font-bold">Phone Number:</Label>
			<Input id="phonenumber" bind:value={formData.phonenumber} />

			<Label for="whatsapp" class="font-bold">WhatsApp Number:</Label>
			<Input id="whatsapp" bind:value={formData.whatsapp} placeholder="e.g., +919876543210" />

			<Label for="email" class="font-bold">Business Email:</Label>
			<Input id="email" type="email" bind:value={formData.email} />

			<Label for="address" class="font-bold">Address:</Label>
			<Input id="address" bind:value={formData.address} />

			<Label for="website" class="font-bold">Website:</Label>
			<Input id="website" bind:value={formData.website} />

			<Label for="instagram_id" class="font-bold">Instagram ID:</Label>
			<Input
				id="instagram_id"
				bind:value={formData.instagram_id}
				placeholder="e.g., @your_business_handle"
			/>

			<Label for="google_maps_link" class="font-bold">Google Maps Link:</Label>
			<Input
				id="google_maps_link"
				bind:value={formData.google_maps_link}
				placeholder="e.g., https://maps.google.com/..."
			/>

			<Dialog.Footer class="mt-5">
				<Button variant="outline" onclick={close}>Cancel</Button>
				<Button type="submit">Update</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
