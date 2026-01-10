<script lang="ts">
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';

	export type PostRecentProjectProps = {
		show?: boolean;
		businessSlug?: string;
		onClose?: () => void;
		onPosted?: () => void;
	};

	let {
		show = $bindable(false),
		businessSlug = '',
		onClose = () => {},
		onPosted = () => {}
	}: PostRecentProjectProps = $props();

	// Form data
	let formData = $state({
		projectTitle: '',
		pincode: '',
		district: '',
		city: '',
		projectDate: '',
		projectImage: null
	});

	// Image preview
	let imagePreview = $state(null);

	// Submission state
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let isDistrictLoading = $state(false);
	let cities = $state([]);
	let isCitiesLoading = $state(false);
	let lastFetchedPincode = $state('');
	let lastFetchedDistrict = $state('');

	// Suggested project names for consistency
	const suggestedNames = [
		'2kW Residential Solar Installation with ₹60,000 subsidy under PM Surya Ghar Yojana at [cityName]',
		'5kW Residential Solar Installation with ₹78,000 subsidy under PM Surya Ghar Yojana at [cityName]',
		'5kW Commercial Solar Installation at [cityName]',
		'5kW Agricultural Solar Installation at [cityName]'
	];

	// Function to use suggested name
	function useSuggestedName(name) {
		formData.projectTitle = name;
	}

	// Reset form data when modal is shown
	$effect(() => {
		if (show) {
			resetForm();
			isSubmitting = false;
			errorMessage = '';
		}
	});

	// Fetch district automatically when pincode changes
	$effect(() => {
		if (
			formData.pincode &&
			formData.pincode.length === 6 &&
			formData.pincode !== lastFetchedPincode
		) {
			fetchDistrictByPincode(formData.pincode);
		}
	});

	// Fetch cities when district changes
	$effect(() => {
		if (formData.district && formData.district !== lastFetchedDistrict) {
			fetchCitiesByDistrict(formData.district);
		}
	});

	function resetForm() {
		formData = {
			projectTitle: '',
			pincode: '',
			district: '',
			city: '',
			projectDate: formatDate(new Date()),
			projectImage: null
		};
		imagePreview = null;
		cities = [];
		lastFetchedPincode = '';
		lastFetchedDistrict = '';
		isDistrictLoading = false;
		isCitiesLoading = false;
	}

	// Format date as YYYY-MM-DD for the date input
	function formatDate(date) {
		return date.toISOString().split('T')[0];
	}

	const close = () => {
		if (isSubmitting) return; // Prevent closing during submission
		show = false;
		onClose();
	};

	function handleOpenChange(open: boolean) {
		if (!open && !isSubmitting) {
			show = false;
			onClose();
		}
	}

	// Allowed image formats
	const allowedImageTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
		'image/gif',
		'image/bmp',
		'image/tiff',
		'image/svg+xml'
	];

	// Function to fetch district by pincode
	async function fetchDistrictByPincode(pincodeValue) {
		if (!pincodeValue || pincodeValue.length !== 6) {
			formData.district = '';
			lastFetchedPincode = '';
			return;
		}

		// Update last fetched pincode to prevent duplicate calls
		lastFetchedPincode = pincodeValue;
		isDistrictLoading = true;

		try {
			const res = await fetch('/in/api/getDistrictByPincode', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pincode: pincodeValue })
			});
			const data = await res.json();

			if (data.success) {
				formData.district = data.district;
			} else {
				formData.district = ''; // Clear district if not found
				console.log('District not found for pincode:', pincodeValue);
			}
		} catch (error) {
			console.error('Error fetching district by pincode:', error);
			formData.district = ''; // Clear district on error
		} finally {
			isDistrictLoading = false;
		}
	}

	// Function to fetch cities by district
	async function fetchCitiesByDistrict(districtValue) {
		if (!districtValue) {
			cities = [];
			formData.city = '';
			lastFetchedDistrict = '';
			return;
		}

		// Update last fetched district to prevent duplicate calls
		lastFetchedDistrict = districtValue;
		isCitiesLoading = true;

		try {
			const res = await fetch('/in/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ district: districtValue })
			});
			const data = await res.json();

			if (data.cities && data.cities.length > 0) {
				cities = data.cities;
				// Reset city selection when district changes
				formData.city = '';
			} else {
				console.log('Cities not found for district:', districtValue);
				cities = [];
				formData.city = '';
			}
		} catch (error) {
			console.error('Error fetching cities by district:', error);
			cities = [];
			formData.city = '';
		} finally {
			isCitiesLoading = false;
		}
	}

	// Handle image file selection
	function handleImageChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			// Validate file type
			if (!allowedImageTypes.includes(file.type)) {
				toast.error('Please upload a valid image file (JPG, PNG, WebP, GIF, BMP, TIFF, SVG)');
				target.value = ''; // Clear the input
				return;
			}

			// Validate file size (limit to 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB in bytes
			if (file.size > maxSize) {
				toast.error('Image file size must be less than 10MB');
				target.value = ''; // Clear the input
				return;
			}

			formData.projectImage = file;

			// Create image preview
			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				imagePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	const saveProject = async () => {
		if (isSubmitting) return; // Prevent multiple submissions

		try {
			isSubmitting = true;
			errorMessage = '';

			// Validate required fields
			if (!formData.projectTitle.trim()) {
				errorMessage = 'Project title is required';
				isSubmitting = false;
				return;
			}

			if (!formData.pincode.trim()) {
				errorMessage = 'Pincode is required';
				isSubmitting = false;
				return;
			}

			if (!formData.district.trim()) {
				errorMessage = 'District is required';
				isSubmitting = false;
				return;
			}

			if (!formData.city.trim()) {
				errorMessage = 'City is required';
				isSubmitting = false;
				return;
			}

			if (!formData.projectDate) {
				errorMessage = 'Project date is required';
				isSubmitting = false;
				return;
			}

			// Validate image if provided
			if (formData.projectImage) {
				if (!allowedImageTypes.includes(formData.projectImage.type)) {
					errorMessage = 'Please upload a valid image file (JPG, PNG, WebP, GIF, BMP, TIFF, SVG)';
					isSubmitting = false;
					return;
				}

				const maxSize = 10 * 1024 * 1024; // 10MB
				if (formData.projectImage.size > maxSize) {
					errorMessage = 'Image file size must be less than 10MB';
					isSubmitting = false;
					return;
				}
			}

			// Create FormData object for file upload
			const formDataToSend = new FormData();
			formDataToSend.append('projectTitle', formData.projectTitle);
			formDataToSend.append('pincode', formData.pincode);
			formDataToSend.append('district', formData.district);
			formDataToSend.append('city', formData.city);
			formDataToSend.append('projectDate', formData.projectDate);
			formDataToSend.append('business_slug', businessSlug);

			// Add the file if it exists
			if (formData.projectImage) {
				formDataToSend.append('projectImage', formData.projectImage);
			}

			console.log('Submitting project data with image');

			const response = await fetch(`/in/api/postRecentProject`, {
				method: 'POST',
				body: formDataToSend // Using FormData instead of JSON.stringify
			});

			console.log('Response status:', response.status);
			const result = await response.json();
			console.log('Response data:', result);

			if (result.success) {
				onPosted(result.project);
				// Use a timeout to prevent race conditions
				setTimeout(() => {
					toast.success('Project posted successfully!');
					isSubmitting = false;
					show = false; // Close the modal after toast
					// Redirect to the recent projects page after a short delay
					setTimeout(() => {
						window.location.href = `/in/${businessSlug}/recent-projects`;
					}, 1500);
				}, 100);
			} else {
				errorMessage = result.error || 'Failed to post project';
				toast.error(errorMessage);
				isSubmitting = false;
			}
		} catch (error) {
			console.error('Error posting project:', error);
			errorMessage = error.message || 'An error occurred while posting the project';
			toast.error(errorMessage);
			isSubmitting = false;
		}
	};
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[500px] max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="text-accent">Post Recent Project</Dialog.Title>
		</Dialog.Header>

		<form
			class="flex flex-col gap-4"
			onsubmit={(e) => {
				e.preventDefault();
				saveProject();
			}}
		>
			{#if errorMessage}
				<div
					class="bg-destructive-muted text-destructive p-3 rounded border-l-4 border-destructive text-sm"
				>
					{errorMessage}
				</div>
			{/if}

			<div class="flex flex-col gap-2">
				<Label for="projectTitle">Project Title:</Label>
				<Textarea
					id="projectTitle"
					bind:value={formData.projectTitle}
					required
					disabled={isSubmitting}
					rows={3}
					placeholder="Enter a project title..."
				/>
			</div>

			<div class="p-4 bg-background-secondary rounded-lg border border-border">
				<p class="font-semibold text-sm text-foreground-secondary mb-3">
					Suggested project titles:
				</p>
				<div class="flex flex-col gap-2 max-h-[200px] overflow-y-auto">
					{#each suggestedNames as suggestion}
						<button
							type="button"
							class="bg-card border border-border p-2 rounded text-sm text-left text-foreground-secondary hover:bg-accent-muted hover:border-accent hover:text-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
							onclick={() => useSuggestedName(suggestion)}
							disabled={isSubmitting}
						>
							{suggestion}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="pincode">Pincode:</Label>
				<Input
					id="pincode"
					bind:value={formData.pincode}
					required
					pattern="[0-9]+"
					title="Please enter a valid pincode (numbers only)"
					maxlength="6"
					disabled={isSubmitting}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="district">District (Auto-filled):</Label>
				<Input
					id="district"
					bind:value={formData.district}
					readonly
					placeholder="District will be auto-filled based on pincode"
					class="bg-background-secondary text-foreground-muted cursor-not-allowed"
					disabled={isSubmitting}
				/>
				{#if isDistrictLoading}
					<small class="text-foreground-muted italic text-xs">Loading district...</small>
				{:else if formData.pincode && formData.pincode.length === 6 && !formData.district}
					<small class="text-destructive italic text-xs">District not found for this pincode</small>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<Label for="city">City:</Label>
				<select
					id="city"
					bind:value={formData.city}
					required
					disabled={isSubmitting || !formData.district || isCitiesLoading}
					class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<option value="">Select a city</option>
					{#each cities as city}
						<option value={city}>{city}</option>
					{/each}
				</select>
				{#if isCitiesLoading}
					<small class="text-foreground-muted italic text-xs">Loading cities...</small>
				{/if}
				{#if formData.district && !isCitiesLoading && cities.length === 0}
					<small class="text-destructive italic text-xs">No cities found for this district</small>
				{/if}
			</div>

			<div class="flex flex-col gap-2">
				<Label for="projectDate">Project Date:</Label>
				<Input
					id="projectDate"
					type="date"
					bind:value={formData.projectDate}
					required
					disabled={isSubmitting}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="projectImage">Project Image:</Label>
				<input
					id="projectImage"
					type="file"
					accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.svg,image/*"
					onchange={handleImageChange}
					disabled={isSubmitting}
					class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50"
				/>
				<small class="text-foreground-muted italic text-xs">
					Accepted formats: JPG, PNG, WebP, GIF, BMP, TIFF, SVG (Max: 10MB)
				</small>
				{#if imagePreview}
					<div class="mt-2 border border-dashed border-border p-2 rounded">
						<img
							src={imagePreview}
							alt="Project preview"
							loading="lazy"
							class="max-w-full max-h-[200px] object-contain"
						/>
					</div>
				{/if}
			</div>

			<Dialog.Footer class="mt-4 max-sm:flex-col">
				<Button variant="secondary" disabled={isSubmitting} onclick={close} class="max-sm:w-full">
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isSubmitting}
					class="bg-success text-success-foreground hover:bg-success/90 max-sm:w-full"
				>
					{isSubmitting ? 'Posting...' : 'Post Project'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
