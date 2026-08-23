<script lang="ts">
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	/**
	 * Electricity bill upload, reusable on the thank-you page (pass `leadRef`)
	 * and the logged-in dashboard (pass `leadId`).
	 */
	interface Props {
		leadRef?: string;
		leadId?: number | null;
		billUrl?: string | null;
		billFormat?: string | null;
	}

	let {
		leadRef = '',
		leadId = null,
		billUrl = $bindable(null),
		billFormat = $bindable(null)
	}: Props = $props();

	const allowedFileTypes = [
		'image/jpeg',
		'image/jpg',
		'image/png',
		'image/webp',
		'image/gif',
		'image/bmp',
		'image/tiff',
		'application/pdf'
	];
	const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

	let fileInput = $state<HTMLInputElement | undefined>();
	let selectedFile = $state<File | null>(null);
	let imagePreview = $state<string | null>(null);
	let isUploading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	const hasBill = $derived(!!billUrl);
	const billIsPdf = $derived(
		billFormat === 'pdf' || !!billUrl?.toLowerCase().endsWith('.pdf')
	);

	function handleFileChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		errorMessage = '';
		successMessage = '';
		selectedFile = null;
		imagePreview = null;

		const file = input.files && input.files[0];
		if (!file) return;

		if (!allowedFileTypes.includes(file.type)) {
			errorMessage = 'Please upload an image (JPG, PNG, WebP) or PDF file';
			input.value = '';
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			errorMessage = 'File size must be less than 10MB';
			input.value = '';
			return;
		}

		selectedFile = file;

		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => {
				// FileReader.result is `string | ArrayBuffer | null`; readAsDataURL
				// always yields the string form.
				imagePreview = typeof reader.result === 'string' ? reader.result : null;
			};
			reader.readAsDataURL(file);
		}
	}

	async function uploadBill() {
		if (!selectedFile || isUploading) return;

		isUploading = true;
		errorMessage = '';
		successMessage = '';

		try {
			const formData = new FormData();
			formData.append('billFile', selectedFile);
			if (leadRef) {
				formData.append('ref', leadRef);
			} else if (leadId) {
				formData.append('leadId', String(leadId));
			}

			const response = await fetch('/in/api/uploadBill', {
				method: 'POST',
				body: formData
			});
			const result = await response.json();

			if (result.success) {
				billUrl = result.billUrl;
				billFormat = result.billFormat;
				successMessage = 'Your electricity bill has been uploaded successfully!';
				selectedFile = null;
				imagePreview = null;
				if (fileInput) fileInput.value = '';
			} else {
				errorMessage = result.error || 'Failed to upload bill. Please try again.';
			}
		} catch (err) {
			console.error('Error uploading bill:', err);
			errorMessage = 'An error occurred while uploading. Please try again.';
		} finally {
			isUploading = false;
		}
	}
</script>

<div class="text-left">
	<h3 class="text-base font-semibold text-foreground">Your Recent Electricity Bill</h3>
	<p class="mt-1 text-sm text-muted-foreground">
		{#if hasBill}
			Your electricity bill is on file. Uploading a new file will replace it.
		{:else}
			Upload your most recent electricity bill so installers can give you an accurate quote based
			on your power usage.
		{/if}
	</p>

	{#if hasBill}
		<div class="mt-3">
			{#if billIsPdf}
				<a
					href={billUrl}
					target="_blank"
					rel="noopener"
					class="text-sm font-medium text-primary-strong hover:underline"
				>
					📄 View uploaded bill (PDF)
				</a>
			{:else}
				<a href={billUrl} target="_blank" rel="noopener" class="inline-block">
					<img
						src={billUrl}
						alt="Uploaded electricity bill"
						loading="lazy"
						class="h-24 w-auto rounded-md border border-border object-cover"
					/>
				</a>
			{/if}
		</div>
	{/if}

	{#if errorMessage}
		<Alert variant="destructive" class="mt-3">{errorMessage}</Alert>
	{/if}
	{#if successMessage}
		<Alert variant="success" class="mt-3">{successMessage}</Alert>
	{/if}

	<div class="mt-4 space-y-2">
		<input
			bind:this={fileInput}
			type="file"
			accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.pdf,image/*,application/pdf"
			onchange={handleFileChange}
			disabled={isUploading}
			class="block w-full text-sm text-foreground-secondary file:mr-3 file:cursor-pointer file:rounded-md file:border file:border-border file:bg-card file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-background-tertiary disabled:opacity-50"
		/>
		<p class="text-xs text-muted-foreground">
			Accepted formats: JPG, PNG, WebP, GIF, BMP, TIFF, PDF (Max: 10MB)
		</p>

		{#if imagePreview}
			<div>
				<img
					src={imagePreview}
					alt="Bill preview"
					class="h-32 w-auto rounded-md border border-border object-cover"
				/>
			</div>
		{:else if selectedFile}
			<p class="text-sm font-medium text-foreground">Selected: {selectedFile.name}</p>
		{/if}

		{#if selectedFile}
			<div class="pt-1">
				<Button type="button" size="sm" onclick={uploadBill} disabled={isUploading}>
					{isUploading ? 'Uploading...' : hasBill ? 'Replace Bill' : 'Upload Bill'}
				</Button>
			</div>
		{/if}
	</div>
</div>
