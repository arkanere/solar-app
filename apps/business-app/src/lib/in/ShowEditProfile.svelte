<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	let {
		show = $bindable(false),
		businessInfo = {},
		businessSlug = '',
		onClose = () => {},
		onUpdated = () => {}
	} = $props();

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
		google_maps_link: ''
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
			google_maps_link: businessInfo.google_maps_link || ''
		};
	}

	function handleOpenChange(open) {
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

		<form class="flex flex-col gap-2.5" onsubmit={(e) => { e.preventDefault(); saveProfile(); }}>
			<Label for="businessname" class="font-bold">Business Name:</Label>
			<Input id="businessname" bind:value={formData.businessname} required />

			<Label for="description" class="font-bold">Description:</Label>
			<Textarea id="description" bind:value={formData.description} class="min-h-[100px]" />

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
			<Input id="instagram_id" bind:value={formData.instagram_id} placeholder="e.g., @your_business_handle" />

			<Label for="google_maps_link" class="font-bold">Google Maps Link:</Label>
			<Input id="google_maps_link" bind:value={formData.google_maps_link} placeholder="e.g., https://maps.google.com/..." />

			<Dialog.Footer class="mt-5">
				<Button type="submit" class="bg-success text-success-foreground hover:bg-success/90">Update</Button>
				<Dialog.Close asChild let:builder>
					<Button builders={[builder]} variant="outline">Cancel</Button>
				</Dialog.Close>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
