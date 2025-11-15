<script>
	import { isDarkMode } from '$lib/themeStore.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import TipTapEditor from '$lib/components/TipTapEditor.svelte';
	import ImageUploader from '$lib/components/ImageUploader.svelte';
	import SlugInput from '$lib/components/SlugInput.svelte';

	export let data;

	let darkMode;
	$: darkMode = $isDarkMode;

	const { blog } = data;

	// Form data (initialized from blog)
	let title = blog.title;
	let slug = blog.slug;
	let content = blog.content;
	let excerpt = blog.excerpt || '';
	let featuredImage = blog.featured_image;
	let authorName = blog.author_name;
	let status = blog.status;
	let tags = blog.tags ? blog.tags.join(', ') : '';
	let categories = blog.categories ? blog.categories.join(', ') : '';
	let seoTitle = blog.seo_metadata?.metaTitle || blog.title;
	let seoDescription = blog.seo_metadata?.metaDescription || '';
	let seoKeywords = blog.seo_metadata?.keywords || '';

	let saving = false;
	let errorMessage = '';
	let showSeoSection = false;
	let seoTitleManuallyEdited = false;

	// Track if SEO title was manually set
	onMount(() => {
		if (seoTitle && seoTitle !== title) {
			seoTitleManuallyEdited = true;
		}
	});

	// Auto-sync SEO title with main title if not manually edited
	$: if (!seoTitleManuallyEdited && title) {
		seoTitle = title;
	}

	function handleContentChange(html) {
		content = html;
	}

	function handleImageChange(imageData) {
		featuredImage = imageData;
	}

	function handleSlugChange(newSlug) {
		slug = newSlug;
	}

	async function updateBlog(publishNow = false) {
		// Validate required fields
		if (!title.trim()) {
			errorMessage = 'Title is required';
			return;
		}

		if (!slug.trim()) {
			errorMessage = 'Slug is required';
			return;
		}

		if (!content.trim()) {
			errorMessage = 'Content is required';
			return;
		}

		saving = true;
		errorMessage = '';

		try {
			// Determine final status
			let finalStatus = status;
			let finalPublishedAt = blog.published_at;

			if (publishNow) {
				finalStatus = 'published';
				if (!blog.published_at) {
					finalPublishedAt = new Date().toISOString();
				}
			}

			// Prepare data
			const blogData = {
				id: blog.id,
				title: title.trim(),
				slug: slug.trim(),
				content: content.trim(),
				excerpt: excerpt.trim() || null,
				featured_image: featuredImage,
				author_name: authorName.trim(),
				status: finalStatus,
				tags: tags
					.split(',')
					.map((t) => t.trim())
					.filter((t) => t),
				categories: categories
					.split(',')
					.map((c) => c.trim())
					.filter((c) => c),
				seo_metadata: {
					metaTitle: seoTitle.trim() || title.trim(),
					metaDescription: seoDescription.trim(),
					keywords: seoKeywords.trim()
				},
				custom_fields: blog.custom_fields || {},
				published_at: finalPublishedAt
			};

			// Call API
			const response = await fetch('/in/api/blogs/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(blogData)
			});

			const result = await response.json();

			if (result.success) {
				alert(
					publishNow ? 'Blog published successfully!' : 'Blog updated successfully!'
				);
				// Reload page to get fresh data
				window.location.reload();
			} else {
				errorMessage = result.error || 'Failed to update blog';
			}
		} catch (error) {
			console.error('Error updating blog:', error);
			errorMessage = 'Failed to update blog. Please try again.';
		} finally {
			saving = false;
		}
	}

	async function deleteBlog() {
		if (
			!confirm(
				`Are you sure you want to delete "${blog.title}"? This action cannot be undone.`
			)
		) {
			return;
		}

		try {
			const response = await fetch('/in/api/blogs/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: blog.id })
			});

			const result = await response.json();

			if (result.success) {
				alert(result.message);
				goto('/in/blogs');
			} else {
				alert(result.error || 'Failed to delete blog');
			}
		} catch (error) {
			console.error('Error deleting blog:', error);
			alert('Failed to delete blog. Please try again.');
		}
	}

	function handleSeoTitleInput() {
		seoTitleManuallyEdited = true;
	}

	function formatDate(dateString) {
		if (!dateString) return 'Not published';
		const date = new Date(dateString);
		return date.toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Edit: {blog.title} - Solar Vipani Admin</title>
</svelte:head>

<div class="edit-blog-page" class:dark={darkMode}>
	<div class="page-header">
		<div>
			<h1>Edit Blog Post</h1>
			<p class="subtitle">Editing: {blog.title}</p>
		</div>
		<button class="btn-back" on:click={() => goto('/in/blogs')}>← Back to Blogs</button>
	</div>

	<!-- Blog Info Banner -->
	<div class="info-banner">
		<div class="info-item">
			<span class="label">Status:</span>
			<span class="badge badge-{blog.status}">{blog.status}</span>
		</div>
		<div class="info-item">
			<span class="label">Published:</span>
			<span class="value">{formatDate(blog.published_at)}</span>
		</div>
		<div class="info-item">
			<span class="label">Last Updated:</span>
			<span class="value">{formatDate(blog.updated_at)}</span>
		</div>
		<div class="info-item">
			<span class="label">Views:</span>
			<span class="value">{blog.view_count || 0}</span>
		</div>
	</div>

	{#if errorMessage}
		<div class="error-banner">
			<p>⚠️ {errorMessage}</p>
		</div>
	{/if}

	<form on:submit|preventDefault={() => updateBlog(false)}>
		<div class="form-grid">
			<!-- Main Content Section -->
			<div class="main-section">
				<!-- Title -->
				<div class="form-group">
					<label for="title">
						Blog Title <span class="required">*</span>
					</label>
					<input
						type="text"
						id="title"
						bind:value={title}
						placeholder="e.g., Complete Guide to Solar Panel Installation in 2025"
						required
						maxlength="255"
					/>
					<p class="help-text">Keep it clear and compelling (50-60 characters for best SEO)</p>
				</div>

				<!-- Slug -->
				<SlugInput bind:slug {title} blogId={blog.id} region="in" onChange={handleSlugChange} />

				<!-- Excerpt -->
				<div class="form-group">
					<label for="excerpt">
						Excerpt <span class="optional">(Optional)</span>
					</label>
					<textarea
						id="excerpt"
						bind:value={excerpt}
						placeholder="A brief summary of your blog post (1-2 sentences)"
						rows="3"
						maxlength="500"
					></textarea>
					<p class="help-text">
						Short description shown in blog listings ({excerpt.length}/500 characters)
					</p>
				</div>

				<!-- Featured Image -->
				<ImageUploader imageData={featuredImage} onChange={handleImageChange} />

				<!-- Content Editor -->
				<div class="form-group">
					<label>
						Blog Content <span class="required">*</span>
					</label>
					<TipTapEditor {content} onChange={handleContentChange} />
					<p class="help-text">Write your full blog post content using the rich text editor</p>
				</div>
			</div>

			<!-- Sidebar Section -->
			<div class="sidebar-section">
				<!-- Publish Settings -->
				<div class="card">
					<h3>Publish Settings</h3>

					<div class="form-group">
						<label for="status">Status</label>
						<select id="status" bind:value={status}>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="archived">Archived</option>
						</select>
					</div>

					<div class="form-group">
						<label for="author">Author</label>
						<input type="text" id="author" bind:value={authorName} />
					</div>

					<div class="button-group">
						<button type="submit" class="btn-save" disabled={saving}>
							{saving ? 'Saving...' : 'Update'}
						</button>
						{#if status !== 'published'}
							<button
								type="button"
								class="btn-publish"
								on:click={() => updateBlog(true)}
								disabled={saving}
							>
								{saving ? 'Publishing...' : 'Publish Now'}
							</button>
						{/if}
					</div>

					<div class="divider"></div>

					<div class="button-group">
						{#if blog.status === 'published'}
							<a
								href="https://solarvipani.com/in/blogs/{blog.slug}"
								target="_blank"
								class="btn-view"
							>
								👁️ View on Site
							</a>
						{/if}
						<button type="button" class="btn-delete" on:click={deleteBlog}>
							🗑️ Delete Blog
						</button>
					</div>
				</div>

				<!-- Categories & Tags -->
				<div class="card">
					<h3>Organization</h3>

					<div class="form-group">
						<label for="categories">
							Categories <span class="optional">(Optional)</span>
						</label>
						<input
							type="text"
							id="categories"
							bind:value={categories}
							placeholder="e.g., Solar Energy, Guides"
						/>
						<p class="help-text">Comma-separated</p>
					</div>

					<div class="form-group">
						<label for="tags">
							Tags <span class="optional">(Optional)</span>
						</label>
						<input
							type="text"
							id="tags"
							bind:value={tags}
							placeholder="e.g., solar, installation, residential"
						/>
						<p class="help-text">Comma-separated keywords</p>
					</div>
				</div>

				<!-- SEO Settings -->
				<div class="card">
					<div class="card-header-toggle" on:click={() => (showSeoSection = !showSeoSection)}>
						<h3>SEO Settings</h3>
						<span class="toggle-icon">{showSeoSection ? '▼' : '▶'}</span>
					</div>

					{#if showSeoSection}
						<div class="seo-content">
							<div class="form-group">
								<label for="seo-title">
									SEO Title <span class="optional">(Auto-filled)</span>
								</label>
								<input
									type="text"
									id="seo-title"
									bind:value={seoTitle}
									on:input={handleSeoTitleInput}
									placeholder={title || 'Your blog title'}
									maxlength="60"
								/>
								<p class="help-text">{seoTitle.length}/60 characters</p>
							</div>

							<div class="form-group">
								<label for="seo-description">SEO Description</label>
								<textarea
									id="seo-description"
									bind:value={seoDescription}
									placeholder="Brief description for search engines"
									rows="3"
									maxlength="160"
								></textarea>
								<p class="help-text">{seoDescription.length}/160 characters</p>
							</div>

							<div class="form-group">
								<label for="seo-keywords">SEO Keywords</label>
								<input
									type="text"
									id="seo-keywords"
									bind:value={seoKeywords}
									placeholder="solar panels, installation, residential"
								/>
								<p class="help-text">Comma-separated keywords</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	.edit-blog-page {
		padding: 30px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 20px;
	}

	h1 {
		font-size: 32px;
		color: #333;
		margin: 0 0 8px 0;
	}

	.dark h1 {
		color: #e0e0e0;
	}

	.subtitle {
		color: #666;
		margin: 0;
		font-size: 14px;
		font-weight: normal;
	}

	.dark .subtitle {
		color: #999;
	}

	.btn-back {
		padding: 10px 20px;
		background: white;
		border: 1px solid #ddd;
		border-radius: 6px;
		color: #333;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.3s;
	}

	.dark .btn-back {
		background: #2a2a2a;
		border-color: #444;
		color: #e0e0e0;
	}

	.btn-back:hover {
		background: #f5f5f5;
		border-color: #999;
	}

	.dark .btn-back:hover {
		background: #3a3a3a;
	}

	.info-banner {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		padding: 16px 20px;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
	}

	.dark .info-banner {
		background: #2a2a2a;
	}

	.info-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.info-item .label {
		font-size: 13px;
		color: #666;
		font-weight: 600;
	}

	.dark .info-item .label {
		color: #999;
	}

	.info-item .value {
		font-size: 13px;
		color: #333;
	}

	.dark .info-item .value {
		color: #e0e0e0;
	}

	.badge {
		display: inline-block;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 12px;
		font-weight: 600;
		text-transform: uppercase;
	}

	.badge-published {
		background: #E8F5E9;
		color: #2E7D32;
	}

	.badge-draft {
		background: #FFF3E0;
		color: #E65100;
	}

	.badge-archived {
		background: #F5F5F5;
		color: #757575;
	}

	.dark .badge-published {
		background: #2E7D32;
		color: #C8E6C9;
	}

	.dark .badge-draft {
		background: #E65100;
		color: #FFE0B2;
	}

	.dark .badge-archived {
		background: #424242;
		color: #BDBDBD;
	}

	.error-banner {
		background: #FFEBEE;
		border: 1px solid #f44336;
		padding: 16px;
		border-radius: 6px;
		margin-bottom: 20px;
	}

	.dark .error-banner {
		background: #C62828;
		border-color: #f44336;
	}

	.error-banner p {
		color: #d32f2f;
		margin: 0;
	}

	.dark .error-banner p {
		color: #FFCDD2;
	}

	.form-grid {
		display: grid;
		grid-template-columns: 1fr 350px;
		gap: 30px;
	}

	.main-section,
	.sidebar-section {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form-group {
		margin-bottom: 20px;
	}

	.form-group:last-child {
		margin-bottom: 0;
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

	.optional {
		font-weight: normal;
		color: #666;
		font-size: 13px;
		font-style: italic;
	}

	.dark .optional {
		color: #999;
	}

	input[type='text'],
	select,
	textarea {
		width: 100%;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 14px;
		box-sizing: border-box;
		font-family: inherit;
		background: white;
		color: #333;
	}

	.dark input[type='text'],
	.dark select,
	.dark textarea {
		background: #2a2a2a;
		border-color: #444;
		color: #e0e0e0;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #4CAF50;
		box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
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

	.card {
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .card {
		background: #2a2a2a;
	}

	.card h3 {
		margin: 0 0 16px 0;
		font-size: 18px;
		color: #333;
	}

	.dark .card h3 {
		color: #e0e0e0;
	}

	.card-header-toggle {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		user-select: none;
	}

	.card-header-toggle:hover h3 {
		color: #4CAF50;
	}

	.toggle-icon {
		font-size: 12px;
		color: #666;
	}

	.dark .toggle-icon {
		color: #999;
	}

	.seo-content {
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px solid #eee;
	}

	.dark .seo-content {
		border-color: #444;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 16px;
	}

	.button-group:first-child {
		margin-top: 0;
	}

	.btn-save,
	.btn-publish,
	.btn-view,
	.btn-delete {
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 6px;
		font-size: 15px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s;
		text-align: center;
		text-decoration: none;
		display: block;
	}

	.btn-save {
		background: #4CAF50;
		color: white;
	}

	.btn-save:hover:not(:disabled) {
		background: #45a049;
	}

	.btn-publish {
		background: #2196F3;
		color: white;
	}

	.btn-publish:hover:not(:disabled) {
		background: #1976D2;
	}

	.btn-view {
		background: #f5f5f5;
		color: #333;
		border: 1px solid #ddd;
	}

	.dark .btn-view {
		background: #1a1a1a;
		border-color: #444;
		color: #e0e0e0;
	}

	.btn-view:hover {
		background: #e0e0e0;
	}

	.dark .btn-view:hover {
		background: #3a3a3a;
	}

	.btn-delete {
		background: #FFEBEE;
		color: #f44336;
		border: 1px solid #f44336;
	}

	.btn-delete:hover {
		background: #f44336;
		color: white;
	}

	.btn-save:disabled,
	.btn-publish:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.divider {
		height: 1px;
		background: #eee;
		margin: 16px 0;
	}

	.dark .divider {
		background: #444;
	}

	@media (max-width: 1024px) {
		.form-grid {
			grid-template-columns: 1fr;
		}

		.sidebar-section {
			order: -1;
		}
	}

	@media (max-width: 768px) {
		.edit-blog-page {
			padding: 15px;
		}

		.page-header {
			flex-direction: column;
			gap: 16px;
		}

		.btn-back {
			width: 100%;
		}

		h1 {
			font-size: 24px;
		}

		.info-banner {
			flex-direction: column;
			gap: 12px;
		}
	}
</style>
