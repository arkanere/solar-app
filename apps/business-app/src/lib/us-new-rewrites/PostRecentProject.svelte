<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { AlertCircle } from '@lucide/svelte';

	export type PostRecentProjectProps = {
		show?: boolean;
		businessSlug?: string;
	};

	let { show = $bindable(false), businessSlug = '' }: PostRecentProjectProps = $props();

	const dispatch = createEventDispatcher();

	// Form data
	let formData = $state({
		projectTitle: '',
		pincode: '',
		county: '',
		city: '',
		projectDate: '',
		projectImage: null as File | null
	});

	// Image preview
	let imagePreview: string | null = $state(null);

	// Submission state
	let isSubmitting = $state(false);
	let errorMessage = $state('');
	let isCountyLoading = $state(false);
	let cities = $state([]);
	let isCitiesLoading = $state(false);
	let lastFetchedPincode = $state('');
	let lastFetchedCounty = $state('');

	// Suggested project names for consistency
	const suggestedNames = [
		'2kW Residential Solar Installation with ₹60,000 subsidy under PM Surya Ghar Yojana at [cityName]',
		'5kW Residential Solar Installation with ₹78,000 subsidy under PM Surya Ghar Yojana at [cityName]',
		'5kW Commercial Solar Installation at [cityName]',
		'5kW Agricultural Solar Installation at [cityName]'
	];

	// Function to use suggested name
	function useSuggestedName(name: string) {
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

	// Fetch county automatically when pincode changes
	$effect(() => {
		if (
			formData.pincode &&
			formData.pincode.length === 6 &&
			formData.pincode !== lastFetchedPincode
		) {
			fetchCountyByPincode(formData.pincode);
		}
	});

	// Fetch cities when county changes
	$effect(() => {
		if (formData.county && formData.county !== lastFetchedCounty) {
			fetchCitiesByCounty(formData.county);
		}
	});

	function resetForm() {
		formData = {
			projectTitle: '',
			pincode: '',
			county: '',
			city: '',
			projectDate: formatDate(new Date()),
			projectImage: null
		};
		imagePreview = null;
		cities = [];
		lastFetchedPincode = '';
		lastFetchedCounty = '';
		isCountyLoading = false;
		isCitiesLoading = false;
	}

	// Format date as YYYY-MM-DD for the date input
	function formatDate(date: Date) {
		return date.toISOString().split('T')[0];
	}

	const close = () => {
		if (isSubmitting) return;
		show = false;
		dispatch('close');
	};

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

	// Function to fetch county by pincode
	async function fetchCountyByPincode(pincodeValue: string) {
		if (!pincodeValue || pincodeValue.length !== 6) {
			formData.county = '';
			lastFetchedPincode = '';
			return;
		}

		lastFetchedPincode = pincodeValue;
		isCountyLoading = true;

		try {
			const res = await fetch('/us/api/getCountyByZipcode', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pincode: pincodeValue })
			});
			const data = await res.json();

			if (data.success) {
				formData.county = data.county;
			} else {
				formData.county = '';
				console.log('County not found for pincode:', pincodeValue);
			}
		} catch (error) {
			console.error('Error fetching county by pincode:', error);
			formData.county = '';
		} finally {
			isCountyLoading = false;
		}
	}

	// Function to fetch cities by county
	async function fetchCitiesByCounty(countyValue: string) {
		if (!countyValue) {
			cities = [];
			formData.city = '';
			lastFetchedCounty = '';
			return;
		}

		lastFetchedCounty = countyValue;
		isCitiesLoading = true;

		try {
			const res = await fetch('/us/api/getCities', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ county: countyValue })
			});
			const data = await res.json();

			if (data.cities && data.cities.length > 0) {
				cities = data.cities;
				formData.city = '';
			} else {
				console.log('Cities not found for county:', countyValue);
				cities = [];
				formData.city = '';
			}
		} catch (error) {
			console.error('Error fetching cities by county:', error);
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
				target.value = '';
				return;
			}

			// Validate file size (limit to 10MB)
			const maxSize = 10 * 1024 * 1024;
			if (file.size > maxSize) {
				toast.error('Image file size must be less than 10MB');
				target.value = '';
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
		if (isSubmitting) return;

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

			if (!formData.county.trim()) {
				errorMessage = 'County is required';
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

				const maxSize = 10 * 1024 * 1024;
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
			formDataToSend.append('county', formData.county);
			formDataToSend.append('city', formData.city);
			formDataToSend.append('projectDate', formData.projectDate);
			formDataToSend.append('business_slug', businessSlug);

			if (formData.projectImage) {
				formDataToSend.append('projectImage', formData.projectImage);
			}

			console.log('Submitting project data with image');

			const response = await fetch(`/api/postRecentProject`, {
				method: 'POST',
				body: formDataToSend
			});

			console.log('Response status:', response.status);
			const result = await response.json();
			console.log('Response data:', result);

			if (result.success) {
				dispatch('posted', result.project);
				setTimeout(() => {
					toast.success('Project posted successfully! Redirecting...');
					isSubmitting = false;
					show = false;
					setTimeout(() => {
						window.location.href = `/business/${businessSlug}/project`;
					}, 1500);
				}, 100);
			} else {
				errorMessage = result.error || 'Failed to post project';
				toast.error(errorMessage);
				isSubmitting = false;
			}
		} catch (error) {
			console.error('Error posting project:', error);
			errorMessage = error instanceof Error ? error.message : 'An error occurred while posting the project';
			toast.error(errorMessage);
			isSubmitting = false;
		}
	};
</script>

<Dialog.Root bind:open={show}>
	<Dialog.Content class="max-w-2xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Post Recent Project</Dialog.Title>
			<Dialog.Description>
				Share your recent solar installation project with potential customers.
			</Dialog.Description>
		</Dialog.Header>

		<form
			class="space-y-4"
			onsubmit={(e) => {
				e.preventDefault();
				saveProject();
			}}
		>
			{#if errorMessage}
				<Alert.Root variant="destructive">
					<AlertCircle class="h-4 w-4" />
					<Alert.Description>{errorMessage}</Alert.Description>
				</Alert.Root>
			{/if}

			<div class="space-y-2">
				<Label for="projectTitle">Project Title</Label>
				<Textarea
					id="projectTitle"
					bind:value={formData.projectTitle}
					disabled={isSubmitting}
					rows={3}
					placeholder="Enter a project title..."
				/>
			</div>

			<div class="space-y-2 rounded-lg border bg-muted/50 p-4">
				<p class="text-sm font-medium">Suggested project titles:</p>
				<div class="flex flex-col gap-2">
					{#each suggestedNames as suggestion}
						<Button
							type="button"
							variant="outline"
							class="h-auto justify-start whitespace-normal py-2 text-left text-sm"
							onclick={() => useSuggestedName(suggestion)}
							disabled={isSubmitting}
						>
							{suggestion}
						</Button>
					{/each}
				</div>
			</div>

			<div class="space-y-2">
				<Label for="pincode">Zipcode</Label>
				<Input
					id="pincode"
					bind:value={formData.pincode}
					pattern="[0-9]+"
					maxlength={6}
					disabled={isSubmitting}
					placeholder="Enter zipcode"
				/>
			</div>

			<div class="space-y-2">
				<Label for="county">County (Auto-filled)</Label>
				{#if isCountyLoading}
					<Skeleton class="h-10 w-full" />
					<p class="text-xs italic text-muted-foreground">Loading county...</p>
				{:else}
					<Input
						id="county"
						bind:value={formData.county}
						readonly
						placeholder="County will be auto-filled based on zipcode"
						class="bg-muted"
						disabled={isSubmitting}
					/>
					{#if formData.pincode && formData.pincode.length === 6 && !formData.county}
						<p class="text-xs italic text-destructive">County not found for this zipcode</p>
					{/if}
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="city">City</Label>
				{#if isCitiesLoading}
					<Skeleton class="h-10 w-full" />
					<p class="text-xs italic text-muted-foreground">Loading cities...</p>
				{:else}
					<Select.Root type="single" bind:value={formData.city} disabled={isSubmitting || !formData.county}>
						<Select.Trigger>
							<span>{formData.city || 'Select a city'}</span>
						</Select.Trigger>
						<Select.Content>
							{#each cities as city}
								<Select.Item value={city}>{city}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					{#if formData.county && !isCitiesLoading && cities.length === 0}
						<p class="text-xs italic text-destructive">No cities found for this county</p>
					{/if}
				{/if}
			</div>

			<div class="space-y-2">
				<Label for="projectDate">Project Date</Label>
				<Input
					id="projectDate"
					type="date"
					bind:value={formData.projectDate}
					disabled={isSubmitting}
				/>
			</div>

			<div class="space-y-2">
				<Label for="projectImage">Project Image</Label>
				<Input
					id="projectImage"
					type="file"
					accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.svg,image/*"
					onchange={handleImageChange}
					disabled={isSubmitting}
				/>
				<p class="text-xs italic text-muted-foreground">
					Accepted formats: JPG, PNG, WebP, GIF, BMP, TIFF, SVG (Max: 10MB)
				</p>
				{#if imagePreview}
					<div class="mt-2 rounded-lg border border-dashed p-2">
						<img src={imagePreview} alt="Project preview" loading="lazy" class="max-h-48 w-full object-contain" />
					</div>
				{/if}
			</div>

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={close} disabled={isSubmitting}>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Posting...' : 'Post Project'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
