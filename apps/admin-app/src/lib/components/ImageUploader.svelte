<script>
	import { isDarkMode } from '../themeStore.js';

	export let imageData = null; // {url, alt, cloudinaryId, width, height}
	export let onChange = null;
	export let label = 'Featured Image';

	let darkMode;
	let uploading = false;
	let uploadError = '';
	let fileInput;

	$: darkMode = $isDarkMode;

	async function handleFileSelect(event) {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			uploadError = 'Please select an image file';
			return;
		}

		// Validate file size (max 10MB)
		if (file.size > 10 * 1024 * 1024) {
			uploadError = 'File size must be less than 10MB';
			return;
		}

		uploadError = '';
		uploading = true;

		try {
			// Create FormData
			const formData = new FormData();
			formData.append('image', file);

			// Upload to API
			const response = await fetch('/us/api/blogs/upload-image', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Upload failed');
			}

			const data = await response.json();

			// Update image data
			imageData = {
				url: data.url,
				cloudinaryId: data.cloudinaryId,
				width: data.width,
				height: data.height,
				alt: ''
			};

			if (onChange) {
				onChange(imageData);
			}
		} catch (error) {
			console.error('Upload error:', error);
			uploadError = 'Failed to upload image. Please try again.';
		} finally {
			uploading = false;
		}
	}

	function handleAltTextChange(event) {
		if (imageData) {
			imageData.alt = event.target.value;
			if (onChange) {
				onChange(imageData);
			}
		}
	}

	function removeImage() {
		imageData = null;
		if (fileInput) {
			fileInput.value = '';
		}
		if (onChange) {
			onChange(null);
		}
	}

	function triggerFileInput() {
		fileInput.click();
	}
</script>

<div class="image-uploader-wrapper" class:dark={darkMode}>
	<label class="main-label">
		{label}
		<span class="optional">(Optional)</span>
	</label>

	{#if !imageData}
		<!-- Upload UI -->
		<div class="upload-area" on:click={triggerFileInput} role="button" tabindex="0">
			<input
				type="file"
				bind:this={fileInput}
				on:change={handleFileSelect}
				accept="image/*"
				style="display: none;"
			/>

			{#if uploading}
				<div class="uploading">
					<div class="spinner"></div>
					<p>Uploading image...</p>
				</div>
			{:else}
				<div class="upload-prompt">
					<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path
							d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<p class="primary-text">Click to upload image</p>
					<p class="secondary-text">or drag and drop</p>
					<p class="hint-text">PNG, JPG, GIF up to 10MB</p>
				</div>
			{/if}
		</div>

		{#if uploadError}
			<p class="error-message">{uploadError}</p>
		{/if}
	{:else}
		<!-- Preview UI -->
		<div class="image-preview">
			<img src={imageData.url} alt={imageData.alt || 'Uploaded image'} />

			<div class="image-info">
				<p class="image-dimensions">
					{imageData.width} × {imageData.height}px
				</p>
				<button type="button" class="remove-btn" on:click={removeImage}> ✕ Remove </button>
			</div>
		</div>

		<!-- Alt Text Input -->
		<div class="alt-text-input">
			<label for="image-alt">
				Alt Text <span class="hint">(Describe the image for accessibility)</span>
			</label>
			<input
				type="text"
				id="image-alt"
				value={imageData.alt || ''}
				on:input={handleAltTextChange}
				placeholder="e.g., Solar panels installed on residential roof"
				maxlength="200"
			/>
		</div>
	{/if}

	<p class="help-text">
		Recommended size: 1200 × 630px for optimal social media sharing. Images are automatically
		optimized via Cloudinary.
	</p>
</div>

<style>
	.image-uploader-wrapper {
		margin: 20px 0;
	}

	.main-label {
		display: block;
		font-weight: 600;
		margin-bottom: 12px;
		color: #333;
		font-size: 14px;
	}

	.dark .main-label {
		color: #e0e0e0;
	}

	.optional {
		font-weight: normal;
		color: #666;
		font-size: 13px;
		font-style: italic;
	}

	.dark .optional {
		color: #999;
	}

	.upload-area {
		border: 2px dashed #ddd;
		border-radius: 8px;
		padding: 40px 20px;
		text-align: center;
		cursor: pointer;
		transition: all 0.3s;
		background: #fafafa;
	}

	.dark .upload-area {
		background: #1a1a1a;
		border-color: #444;
	}

	.upload-area:hover {
		border-color: #4CAF50;
		background: #f0f9f0;
	}

	.dark .upload-area:hover {
		border-color: #66bb6a;
		background: #2a2a2a;
	}

	.upload-prompt svg {
		color: #999;
		margin-bottom: 16px;
	}

	.dark .upload-prompt svg {
		color: #666;
	}

	.primary-text {
		font-size: 16px;
		font-weight: 600;
		color: #333;
		margin: 8px 0;
	}

	.dark .primary-text {
		color: #e0e0e0;
	}

	.secondary-text {
		font-size: 14px;
		color: #666;
		margin: 4px 0;
	}

	.dark .secondary-text {
		color: #999;
	}

	.hint-text {
		font-size: 12px;
		color: #999;
		margin-top: 8px;
	}

	.dark .hint-text {
		color: #666;
	}

	.uploading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #4CAF50;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	.dark .spinner {
		border-color: #444;
		border-top-color: #66bb6a;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.uploading p {
		color: #666;
		font-size: 14px;
	}

	.dark .uploading p {
		color: #999;
	}

	.error-message {
		color: #f44336;
		font-size: 13px;
		margin-top: 8px;
		padding: 8px 12px;
		background: #FFEBEE;
		border-radius: 4px;
	}

	.dark .error-message {
		background: #C62828;
		color: #FFCDD2;
	}

	.image-preview {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		margin-bottom: 12px;
	}

	.dark .image-preview {
		border-color: #444;
	}

	.image-preview img {
		width: 100%;
		height: auto;
		display: block;
		max-height: 400px;
		object-fit: cover;
	}

	.image-info {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px;
		background: #f5f5f5;
	}

	.dark .image-info {
		background: #1a1a1a;
	}

	.image-dimensions {
		font-size: 13px;
		color: #666;
		font-family: 'Courier New', monospace;
	}

	.dark .image-dimensions {
		color: #999;
	}

	.remove-btn {
		padding: 6px 12px;
		background: #f44336;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 13px;
		transition: background 0.3s;
	}

	.remove-btn:hover {
		background: #d32f2f;
	}

	.alt-text-input {
		margin-top: 12px;
	}

	.alt-text-input label {
		display: block;
		font-weight: 600;
		margin-bottom: 6px;
		color: #333;
		font-size: 13px;
	}

	.dark .alt-text-input label {
		color: #e0e0e0;
	}

	.alt-text-input .hint {
		font-weight: normal;
		color: #666;
		font-size: 12px;
		font-style: italic;
	}

	.dark .alt-text-input .hint {
		color: #999;
	}

	.alt-text-input input {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
		box-sizing: border-box;
		background: white;
		color: #333;
	}

	.dark .alt-text-input input {
		background: #2a2a2a;
		border-color: #444;
		color: #e0e0e0;
	}

	.alt-text-input input:focus {
		outline: none;
		border-color: #4CAF50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}

	.help-text {
		margin-top: 8px;
		font-size: 12px;
		color: #666;
		font-style: italic;
	}

	.dark .help-text {
		color: #999;
	}

	@media (max-width: 768px) {
		.upload-area {
			padding: 30px 15px;
		}

		.upload-prompt svg {
			width: 36px;
			height: 36px;
		}
	}
</style>
