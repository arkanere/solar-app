<script lang="ts">
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

<div class="bill-upload">
	<h3>Your Recent Electricity Bill</h3>
	<p class="bill-intro">
		{#if hasBill}
			Your electricity bill is on file. Uploading a new file will replace it.
		{:else}
			Upload your most recent electricity bill so installers can give you an accurate quote based
			on your power usage.
		{/if}
	</p>

	{#if hasBill}
		<div class="current-bill">
			{#if billIsPdf}
				<a href={billUrl} target="_blank" rel="noopener" class="bill-link">📄 View uploaded bill (PDF)</a>
			{:else}
				<a href={billUrl} target="_blank" rel="noopener" class="bill-thumb-link">
					<img src={billUrl} alt="Uploaded electricity bill" class="bill-thumb" loading="lazy" />
				</a>
			{/if}
		</div>
	{/if}

	{#if errorMessage}
		<div class="message error">{errorMessage}</div>
	{/if}
	{#if successMessage}
		<div class="message success">{successMessage}</div>
	{/if}

	<div class="upload-controls">
		<input
			bind:this={fileInput}
			type="file"
			accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.pdf,image/*,application/pdf"
			onchange={handleFileChange}
			disabled={isUploading}
		/>
		<small class="hint">Accepted formats: JPG, PNG, WebP, GIF, BMP, TIFF, PDF (Max: 10MB)</small>

		{#if imagePreview}
			<div class="preview">
				<img src={imagePreview} alt="Bill preview" />
			</div>
		{:else if selectedFile}
			<p class="selected-file">Selected: {selectedFile.name}</p>
		{/if}

		{#if selectedFile}
			<button type="button" class="upload-btn" onclick={uploadBill} disabled={isUploading}>
				{isUploading ? 'Uploading...' : hasBill ? 'Replace Bill' : 'Upload Bill'}
			</button>
		{/if}
	</div>
</div>

<style>
	.bill-upload {
		background: hsl(var(--card));
		border: 1px solid hsl(var(--border));
		border-radius: 8px;
		box-shadow: var(--shadow-sm);
		padding: 1.25rem;
		margin: 1.5rem 0;
		text-align: left;
	}

	h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: hsl(var(--primary-strong));
	}

	.bill-intro {
		font-size: 0.9rem;
		color: hsl(var(--foreground-secondary));
		line-height: 1.6;
		margin: 0 0 1rem;
	}

	.current-bill {
		margin-bottom: 1rem;
	}

	.bill-link {
		color: hsl(var(--primary-strong));
		font-weight: 500;
		font-size: 0.95rem;
		text-decoration: underline;
	}

	.bill-link:hover {
		text-decoration: none;
	}

	.bill-thumb-link {
		display: inline-block;
		border: 1px dashed hsl(var(--border-hover));
		border-radius: 6px;
		padding: 0.4rem;
	}

	.bill-thumb {
		display: block;
		max-width: 100%;
		max-height: 180px;
		object-fit: contain;
		border-radius: 4px;
	}

	.message {
		padding: 0.6rem 0.9rem;
		border-radius: 6px;
		font-size: 0.9rem;
		margin-bottom: 1rem;
	}

	.message.error {
		background: hsl(var(--destructive-muted));
		color: hsl(var(--foreground));
		border-left: 4px solid hsl(var(--destructive));
	}

	.message.success {
		background: hsl(var(--success-muted));
		color: hsl(var(--foreground));
		border-left: 4px solid hsl(var(--success));
	}

	.upload-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input[type='file'] {
		font-size: 0.9rem;
		color: hsl(var(--foreground-secondary));
	}

	.hint {
		font-size: 0.8rem;
		color: hsl(var(--muted-foreground));
		font-style: italic;
	}

	.preview {
		border: 1px dashed hsl(var(--border-hover));
		border-radius: 6px;
		padding: 0.5rem;
		margin-top: 0.5rem;
	}

	.preview img {
		display: block;
		max-width: 100%;
		max-height: 200px;
		object-fit: contain;
	}

	.selected-file {
		font-size: 0.9rem;
		color: hsl(var(--foreground-secondary));
		margin: 0.25rem 0 0;
	}

	.upload-btn {
		align-self: flex-start;
		margin-top: 0.5rem;
		padding: 0.55rem 1.5rem;
		background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-strong)));
		color: hsl(var(--primary-foreground));
		border: none;
		border-radius: 6px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.upload-btn:hover:not(:disabled) {
		opacity: 0.9;
	}

	.upload-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
</style>
