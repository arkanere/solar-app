<script>
	import { isDarkMode } from '../themeStore.js';

	export let slug = '';
	export let title = '';
	export let blogId = null; // For edit mode - exclude self from uniqueness check
	export let onChange = null;
	export let region = 'us'; // 'us' or 'in'

	let darkMode;
	let isValidating = false;
	let validationStatus = ''; // 'available', 'taken', 'invalid', ''
	let validationMessage = '';
	// If we have a blogId (edit mode) and a slug, don't auto-generate
	let manuallyEdited = !!(blogId && slug);

	$: darkMode = $isDarkMode;

	// Auto-generate slug from title if not manually edited
	$: if (!manuallyEdited && title) {
		slug = generateSlug(title);
		if (onChange) onChange(slug);
	}

	function generateSlug(text) {
		return text
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, '') // Remove special characters
			.replace(/\s+/g, '-') // Replace spaces with hyphens
			.replace(/-+/g, '-') // Replace multiple hyphens with single
			.replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
	}

	function handleSlugInput(event) {
		manuallyEdited = true;
		slug = event.target.value;
		slug = generateSlug(slug); // Apply slug formatting
		if (onChange) onChange(slug);
		validateSlug();
	}

	async function validateSlug() {
		if (!slug || slug.length < 3) {
			validationStatus = 'invalid';
			validationMessage = 'Slug must be at least 3 characters';
			return;
		}

		isValidating = true;
		validationStatus = '';
		validationMessage = '';

		try {
			const url = blogId
				? `/${region}/api/blogs/validate-slug?slug=${encodeURIComponent(slug)}&excludeId=${blogId}`
				: `/${region}/api/blogs/validate-slug?slug=${encodeURIComponent(slug)}`;

			const response = await fetch(url);
			const data = await response.json();

			if (data.available) {
				validationStatus = 'available';
				validationMessage = 'Available';
			} else {
				validationStatus = 'taken';
				validationMessage = 'Already taken';
			}
		} catch (error) {
			validationStatus = 'invalid';
			validationMessage = 'Error validating slug';
			console.error('Slug validation error:', error);
		} finally {
			isValidating = false;
		}
	}

	function handleFocus() {
		manuallyEdited = true;
	}
</script>

<div class="slug-input-wrapper" class:dark={darkMode}>
	<label for="slug">
		URL Slug <span class="required">*</span>
		<span class="hint">(Auto-generated from title, but you can edit it)</span>
	</label>

	<div class="input-with-status">
		<div class="slug-preview">
			<span class="base-url">solarvipani.com/{region}/blogs/</span>
			<span class="slug-value">{slug || 'your-blog-slug'}</span>
		</div>

		<input
			type="text"
			id="slug"
			bind:value={slug}
			on:input={handleSlugInput}
			on:focus={handleFocus}
			on:blur={validateSlug}
			placeholder="auto-generated-from-title"
			required
			pattern="[a-z0-9-]+"
			minlength="3"
			maxlength="255"
		/>

		{#if isValidating}
			<span class="validation-status validating">Checking...</span>
		{:else if validationStatus === 'available'}
			<span class="validation-status available">✓ {validationMessage}</span>
		{:else if validationStatus === 'taken'}
			<span class="validation-status taken">✗ {validationMessage}</span>
		{:else if validationStatus === 'invalid'}
			<span class="validation-status invalid">⚠ {validationMessage}</span>
		{/if}
	</div>

	<p class="help-text">
		URL-friendly slug (lowercase, hyphens only, no spaces). Must be unique.
	</p>
</div>

<style>
	.slug-input-wrapper {
		margin: 20px 0;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 8px;
		color: #333;
		font-size: 14px;
	}

	.dark label {
		color: #e0e0e0;
	}

	.required {
		color: #f44336;
	}

	.hint {
		font-weight: normal;
		color: #666;
		font-size: 13px;
		font-style: italic;
	}

	.dark .hint {
		color: #999;
	}

	.input-with-status {
		position: relative;
	}

	.slug-preview {
		padding: 8px 12px;
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px 4px 0 0;
		border-bottom: none;
		font-size: 13px;
		color: #666;
		font-family: 'Courier New', monospace;
	}

	.dark .slug-preview {
		background: #1a1a1a;
		border-color: #444;
		color: #999;
	}

	.base-url {
		color: #999;
	}

	.dark .base-url {
		color: #666;
	}

	.slug-value {
		color: #4CAF50;
		font-weight: 600;
	}

	.dark .slug-value {
		color: #66bb6a;
	}

	input {
		width: 100%;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 0 0 4px 4px;
		font-size: 14px;
		font-family: 'Courier New', monospace;
		transition: border-color 0.3s;
		box-sizing: border-box;
		background: white;
		color: #333;
	}

	.dark input {
		background: #2a2a2a;
		border-color: #444;
		color: #e0e0e0;
	}

	input:focus {
		outline: none;
		border-color: #4CAF50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
	}

	.dark input:focus {
		border-color: #66bb6a;
		box-shadow: 0 0 0 3px rgba(102, 187, 106, 0.1);
	}

	.validation-status {
		position: absolute;
		right: 12px;
		top: 50%;
		transform: translateY(-50%);
		font-size: 13px;
		font-weight: 600;
		padding: 4px 8px;
		border-radius: 4px;
	}

	.validation-status.validating {
		color: #2196F3;
		background: #E3F2FD;
	}

	.validation-status.available {
		color: #4CAF50;
		background: #E8F5E9;
	}

	.validation-status.taken {
		color: #f44336;
		background: #FFEBEE;
	}

	.validation-status.invalid {
		color: #FF9800;
		background: #FFF3E0;
	}

	.dark .validation-status.validating {
		color: #64B5F6;
		background: #1565C0;
	}

	.dark .validation-status.available {
		color: #81C784;
		background: #2E7D32;
	}

	.dark .validation-status.taken {
		color: #EF5350;
		background: #C62828;
	}

	.dark .validation-status.invalid {
		color: #FFB74D;
		background: #E65100;
	}

	.help-text {
		margin-top: 6px;
		font-size: 12px;
		color: #666;
		font-style: italic;
	}

	.dark .help-text {
		color: #999;
	}

	@media (max-width: 768px) {
		.slug-preview {
			font-size: 11px;
			padding: 6px 10px;
		}

		input {
			font-size: 13px;
		}

		.validation-status {
			position: static;
			transform: none;
			display: block;
			margin-top: 8px;
			text-align: right;
		}
	}
</style>
