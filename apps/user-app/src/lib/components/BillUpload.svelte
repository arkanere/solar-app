<script>
	/**
	 * Electricity bill upload, reusable on the thank-you page (pass `leadRef`)
	 * and the logged-in dashboard (pass `leadId`).
	 */
	export let leadRef = '';
	export let leadId = null;
	export let billUrl = null;
	export let billFormat = null;

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

	let fileInput;
	let selectedFile = null;
	let imagePreview = null;
	let isUploading = false;
	let errorMessage = '';
	let successMessage = '';

	$: hasBill = !!billUrl;
	$: billIsPdf = billFormat === 'pdf' || (billUrl && billUrl.toLowerCase().endsWith('.pdf'));

	function handleFileChange(event) {
		errorMessage = '';
		successMessage = '';
		selectedFile = null;
		imagePreview = null;

		const file = event.target.files && event.target.files[0];
		if (!file) return;

		if (!allowedFileTypes.includes(file.type)) {
			errorMessage = 'Please upload an image (JPG, PNG, WebP) or PDF file';
			event.target.value = '';
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			errorMessage = 'File size must be less than 10MB';
			event.target.value = '';
			return;
		}

		selectedFile = file;

		if (file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				imagePreview = e.target?.result;
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
				formData.append('leadId', leadId);
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
			on:change={handleFileChange}
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
			<button type="button" class="upload-btn" on:click={uploadBill} disabled={isUploading}>
				{isUploading ? 'Uploading...' : hasBill ? 'Replace Bill' : 'Upload Bill'}
			</button>
		{/if}
	</div>
</div>

<style>
	.bill-upload {
		background: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		padding: 1.25rem;
		margin: 1.5rem 0;
		text-align: left;
	}

	h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: #0056b3;
	}

	.bill-intro {
		font-size: 0.9rem;
		color: #546e7a;
		line-height: 1.6;
		margin: 0 0 1rem;
	}

	.current-bill {
		margin-bottom: 1rem;
	}

	.bill-link {
		color: #0056b3;
		font-weight: 500;
		font-size: 0.95rem;
		text-decoration: underline;
	}

	.bill-link:hover {
		text-decoration: none;
	}

	.bill-thumb-link {
		display: inline-block;
		border: 1px dashed #cbd5e1;
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
		background: #fdecea;
		color: #c0392b;
		border-left: 4px solid #c0392b;
	}

	.message.success {
		background: #e8f5e9;
		color: #2e7d32;
		border-left: 4px solid #2e7d32;
	}

	.upload-controls {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input[type='file'] {
		font-size: 0.9rem;
		color: #475569;
	}

	.hint {
		font-size: 0.8rem;
		color: #94a3b8;
		font-style: italic;
	}

	.preview {
		border: 1px dashed #cbd5e1;
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
		color: #475569;
		margin: 0.25rem 0 0;
	}

	.upload-btn {
		align-self: flex-start;
		margin-top: 0.5rem;
		padding: 0.55rem 1.5rem;
		background: linear-gradient(135deg, #0056b3, #0a4b9e);
		color: white;
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
