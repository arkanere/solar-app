<script>
	export let show = false;
	export let businessSlug = '';

	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';
	const dispatch = createEventDispatcher();

	// Form data
	let formData = {
		projectTitle: '',
		pincode: '',
		county: '',
		city: '',
		projectDate: '',
		projectImage: null
	};

	// Image preview
	let imagePreview = null;

	// Submission state
	let isSubmitting = false;
	let errorMessage = '';
	let isCountyLoading = false;
	let cities = [];
	let isCitiesLoading = false;
	let lastFetchedPincode = '';
	let lastFetchedCounty = '';

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
	$: if (show) {
		resetForm();
		isSubmitting = false;
		errorMessage = '';
	}

	// Fetch county automatically when pincode changes
	$: if (
		formData.pincode &&
		formData.pincode.length === 6 &&
		formData.pincode !== lastFetchedPincode
	) {
		fetchCountyByPincode(formData.pincode);
	}

	// Fetch cities when county changes
	$: if (formData.county && formData.county !== lastFetchedCounty) {
		fetchCitiesByCounty(formData.county);
	}

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
	function formatDate(date) {
		return date.toISOString().split('T')[0];
	}

	const close = () => {
		if (isSubmitting) return; // Prevent closing during submission
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
	async function fetchCountyByPincode(pincodeValue) {
		if (!pincodeValue || pincodeValue.length !== 6) {
			formData.county = '';
			lastFetchedPincode = '';
			return;
		}

		// Update last fetched pincode to prevent duplicate calls
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
				formData.county = ''; // Clear county if not found
				console.log('County not found for pincode:', pincodeValue);
			}
		} catch (error) {
			console.error('Error fetching county by pincode:', error);
			formData.county = ''; // Clear county on error
		} finally {
			isCountyLoading = false;
		}
	}

	// Function to fetch cities by county
	async function fetchCitiesByCounty(countyValue) {
		if (!countyValue) {
			cities = [];
			formData.city = '';
			lastFetchedCounty = '';
			return;
		}

		// Update last fetched county to prevent duplicate calls
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
				// Reset city selection when county changes
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
	function handleImageChange(event) {
		const file = event.target.files[0];
		if (file) {
			// Validate file type
			if (!allowedImageTypes.includes(file.type)) {
				toast.error('Please upload a valid image file (JPG, PNG, WebP, GIF, BMP, TIFF, SVG)');
				event.target.value = ''; // Clear the input
				return;
			}

			// Validate file size (limit to 10MB)
			const maxSize = 10 * 1024 * 1024; // 10MB in bytes
			if (file.size > maxSize) {
				toast.error('Image file size must be less than 10MB');
				event.target.value = ''; // Clear the input
				return;
			}

			formData.projectImage = file;

			// Create image preview
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target.result;
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
			formDataToSend.append('county', formData.county);
			formDataToSend.append('city', formData.city);
			formDataToSend.append('projectDate', formData.projectDate);
			formDataToSend.append('business_slug', businessSlug);

			// Add the file if it exists
			if (formData.projectImage) {
				formDataToSend.append('projectImage', formData.projectImage);
			}

			console.log('Submitting project data with image');

			const response = await fetch(`/api/postRecentProject`, {
				method: 'POST',
				body: formDataToSend // Using FormData instead of JSON.stringify
			});

			console.log('Response status:', response.status);
			const result = await response.json();
			console.log('Response data:', result);

			if (result.success) {
				dispatch('posted', result.project);
				// Use a timeout to prevent race conditions
				setTimeout(() => {
					toast.success('Project posted successfully! Redirecting...');
					isSubmitting = false;
					show = false; // Close the modal after toast
					// Redirect to the project management page after a short delay
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
			errorMessage = error.message || 'An error occurred while posting the project';
			toast.error(errorMessage);
			isSubmitting = false;
		}
	};
</script>

{#if show}
	<div role="dialog" aria-modal="true" aria-labelledby="post-project-title" class="modal-overlay">
		<div class="modal">
			<button class="close-modal" aria-label="Close dialog" on:click={close} disabled={isSubmitting}
				>&times;</button
			>
			<form class="modal-content" on:submit|preventDefault={saveProject}>
				<h2 id="post-project-title">Post Recent Project</h2>

				{#if errorMessage}
					<div class="error-message">{errorMessage}</div>
				{/if}

				<label for="projectTitle">Project Title:</label>
				<textarea
					id="projectTitle"
					bind:value={formData.projectTitle}
					required
					disabled={isSubmitting}
					rows="3"
					placeholder="Enter a project title..."
				></textarea>

				<div class="suggestions-container">
					<p class="suggestions-label">Suggested project titles:</p>
					<div class="suggestions-grid">
						{#each suggestedNames as suggestion}
							<button
								type="button"
								class="suggestion-btn"
								on:click={() => useSuggestedName(suggestion)}
								disabled={isSubmitting}
							>
								{suggestion}
							</button>
						{/each}
					</div>
				</div>

				<label for="pincode">Pincode:</label>
				<input
					id="pincode"
					bind:value={formData.pincode}
					required
					pattern="[0-9]+"
					title="Please enter a valid pincode (numbers only)"
					maxlength="6"
					disabled={isSubmitting}
				/>

				<label for="county">County (Auto-filled):</label>
				<div class="county-container">
					<input
						id="county"
						bind:value={formData.county}
						readonly
						placeholder="County will be auto-filled based on pincode"
						class="readonly-field"
						disabled={isSubmitting}
					/>
					{#if isCountyLoading}
						<small class="loading-text">Loading county...</small>
					{:else if formData.pincode && formData.pincode.length === 6 && !formData.county}
						<small class="no-county-text">County not found for this pincode</small>
					{/if}
				</div>

				<label for="city">City:</label>
				<div class="city-container">
					<select
						id="city"
						bind:value={formData.city}
						required
						disabled={isSubmitting || !formData.county || isCitiesLoading}
					>
						<option value="">Select a city</option>
						{#each cities as city}
							<option value={city}>{city}</option>
						{/each}
					</select>
					{#if isCitiesLoading}
						<small class="loading-text">Loading cities...</small>
					{/if}
					{#if formData.county && !isCitiesLoading && cities.length === 0}
						<small class="no-cities-text">No cities found for this county</small>
					{/if}
				</div>

				<label for="projectDate">Project Date:</label>
				<input
					id="projectDate"
					type="date"
					bind:value={formData.projectDate}
					required
					disabled={isSubmitting}
				/>

				<label for="projectImage">Project Image:</label>
				<div class="file-upload-container">
					<input
						id="projectImage"
						type="file"
						accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.svg,image/*"
						on:change={handleImageChange}
						disabled={isSubmitting}
					/>
					<small class="file-help-text">
						Accepted formats: JPG, PNG, WebP, GIF, BMP, TIFF, SVG (Max: 10MB)
					</small>
					{#if imagePreview}
						<div class="image-preview">
							<img src={imagePreview} alt="Project preview" loading="lazy" />
						</div>
					{/if}
				</div>

				<div class="modal-buttons">
					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Posting...' : 'Post Project'}
					</button>
					<button type="button" on:click={close} disabled={isSubmitting}>Cancel</button>
				</div>
			</form>
		</div>
		<button
			class="modal-backdrop"
			on:click={close}
			aria-label="Close dialog"
			disabled={isSubmitting}
		></button>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		cursor: default;
		z-index: -1;
	}

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
	}

	.modal {
		position: relative;
		z-index: 1001;
		background: white;
		padding: 20px;
		border-radius: 5px;
		max-width: 500px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
	}

	.close-modal {
		position: absolute;
		top: 10px;
		right: 10px;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.close-modal:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.modal-content {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.error-message {
		background-color: #ffebee;
		color: #c62828;
		padding: 10px;
		border-radius: 4px;
		border-left: 4px solid #c62828;
		margin-bottom: 10px;
	}

	label {
		font-weight: bold;
	}

	input,
	textarea {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-family: inherit;
		font-size: inherit;
	}

	input:disabled,
	textarea:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
	}

	textarea {
		resize: vertical;
		min-height: 60px;
		line-height: 1.4;
	}

	textarea:focus {
		outline: none;
		border-color: #4caf50;
		box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
	}

	.county-container,
	.city-container {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.readonly-field {
		background-color: #f9f9f9;
		color: #666;
		cursor: not-allowed;
		border-color: #ddd;
	}

	.loading-text {
		color: #666;
		font-style: italic;
		font-size: 12px;
		margin-top: 2px;
	}

	.no-cities-text,
	.no-county-text {
		color: #ff6b6b;
		font-style: italic;
		font-size: 12px;
		margin-top: 2px;
	}

	select {
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
	}

	select:disabled {
		background-color: #f5f5f5;
		cursor: not-allowed;
		color: #999;
	}

	.file-upload-container {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.file-help-text {
		color: #666;
		font-size: 12px;
		margin-top: 4px;
		font-style: italic;
	}

	.image-preview {
		margin-top: 8px;
		border: 1px dashed #ccc;
		padding: 8px;
		border-radius: 4px;
		max-width: 100%;
	}

	.image-preview img {
		max-width: 100%;
		max-height: 200px;
		object-fit: contain;
	}

	.modal-buttons {
		display: flex;
		gap: 10px;
		justify-content: flex-end;
		margin-top: 20px;
	}

	button {
		padding: 8px 16px;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	button[type='submit'] {
		background-color: #4caf50;
		color: white;
		border: none;
	}

	button[type='button'] {
		background-color: #f1f1f1;
		border: 1px solid #ccc;
	}

	.suggestions-container {
		margin: 10px 0;
		padding: 15px;
		background-color: #f8f9fa;
		border-radius: 6px;
		border: 1px solid #e9ecef;
	}

	.suggestions-label {
		margin: 0 0 10px 0;
		font-weight: 600;
		font-size: 14px;
		color: #495057;
	}

	.suggestions-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 8px;
		max-height: 200px;
		overflow-y: auto;
	}

	.suggestion-btn {
		background-color: white;
		border: 1px solid #dee2e6;
		padding: 8px 12px;
		border-radius: 4px;
		font-size: 13px;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s ease;
		color: #495057;
		line-height: 1.3;
	}

	.suggestion-btn:hover:not(:disabled) {
		background-color: #e3f2fd;
		border-color: #2196f3;
		color: #1976d2;
	}

	.suggestion-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	@media (max-width: 600px) {
		.suggestion-btn {
			font-size: 12px;
			padding: 6px 10px;
		}

		.suggestions-grid {
			max-height: 150px;
		}
	}
</style>
