<script>
	import { isDarkMode } from '$lib/themeStore.js';
	import { goto } from '$app/navigation';

	export let data;

	let darkMode;
	let searchQuery = '';
	let statusFilter = 'all'; // 'all', 'draft', 'published', 'archived'
	let sortBy = 'newest'; // 'newest', 'oldest', 'views'

	$: darkMode = $isDarkMode;
	$: ({ blogs, error } = data);

	// Filter and sort blogs
	$: filteredBlogs = blogs
		.filter((blog) => {
			// Search filter
			const matchesSearch =
				searchQuery === '' ||
				blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(blog.excerpt && blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));

			// Status filter
			const matchesStatus = statusFilter === 'all' || blog.status === statusFilter;

			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			if (sortBy === 'newest') {
				return new Date(b.created_at) - new Date(a.created_at);
			} else if (sortBy === 'oldest') {
				return new Date(a.created_at) - new Date(b.created_at);
			} else if (sortBy === 'views') {
				return (b.view_count || 0) - (a.view_count || 0);
			}
			return 0;
		});

	async function deleteBlog(blogId, blogTitle) {
		if (!confirm(`Are you sure you want to delete "${blogTitle}"? This action cannot be undone.`)) {
			return;
		}

		try {
			const response = await fetch('/in/api/blogs/delete', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: blogId })
			});

			const result = await response.json();

			if (result.success) {
				alert(result.message);
				// Reload page to refresh blog list
				window.location.reload();
			} else {
				alert(result.error || 'Failed to delete blog');
			}
		} catch (error) {
			console.error('Error deleting blog:', error);
			alert('Failed to delete blog. Please try again.');
		}
	}

	function formatDate(dateString) {
		if (!dateString) return 'Not published';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getStatusBadgeClass(status) {
		if (status === 'published') return 'badge-published';
		if (status === 'draft') return 'badge-draft';
		if (status === 'archived') return 'badge-archived';
		return '';
	}
</script>

<svelte:head>
	<title>Manage Blogs - Solar Vipani Admin</title>
</svelte:head>

<div class="blogs-page" class:dark={darkMode}>
	<div class="page-header">
		<h1>Blog Management</h1>
		<button class="btn-create" on:click={() => goto('/in/blogs/create')}>
			+ Create New Blog
		</button>
	</div>

	{#if error}
		<div class="error-banner">
			<p>⚠️ {error}</p>
		</div>
	{/if}

	<!-- Filters and Search -->
	<div class="filters-section">
		<div class="search-box">
			<input
				type="text"
				placeholder="Search blogs by title or excerpt..."
				bind:value={searchQuery}
			/>
		</div>

		<div class="filter-controls">
			<label>
				Status:
				<select bind:value={statusFilter}>
					<option value="all">All ({blogs.length})</option>
					<option value="published"
						>Published ({blogs.filter((b) => b.status === 'published').length})</option
					>
					<option value="draft">Drafts ({blogs.filter((b) => b.status === 'draft').length})</option
					>
					<option value="archived"
						>Archived ({blogs.filter((b) => b.status === 'archived').length})</option
					>
				</select>
			</label>

			<label>
				Sort by:
				<select bind:value={sortBy}>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="views">Most Views</option>
				</select>
			</label>
		</div>
	</div>

	<!-- Blog Stats -->
	<div class="stats-row">
		<div class="stat-card">
			<span class="stat-value">{filteredBlogs.length}</span>
			<span class="stat-label">Showing</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{blogs.filter((b) => b.status === 'published').length}</span>
			<span class="stat-label">Published</span>
		</div>
		<div class="stat-card">
			<span class="stat-value">{blogs.filter((b) => b.status === 'draft').length}</span>
			<span class="stat-label">Drafts</span>
		</div>
	</div>

	<!-- Blogs Table -->
	{#if filteredBlogs.length === 0}
		<div class="empty-state">
			<p class="empty-icon">📝</p>
			<h2>No blogs found</h2>
			<p>
				{#if searchQuery || statusFilter !== 'all'}
					Try adjusting your filters or search query.
				{:else}
					Get started by creating your first blog post.
				{/if}
			</p>
			{#if blogs.length === 0}
				<button class="btn-primary" on:click={() => goto('/in/blogs/create')}>
					Create Your First Blog
				</button>
			{/if}
		</div>
	{:else}
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Status</th>
						<th>Author</th>
						<th>Published</th>
						<th>Views</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredBlogs as blog}
						<tr>
							<td class="title-cell">
								<div class="title-wrapper">
									<a href="/in/blogs/{blog.id}/edit" class="blog-title">{blog.title}</a>
									{#if blog.excerpt}
										<p class="blog-excerpt">{blog.excerpt.substring(0, 100)}...</p>
									{/if}
								</div>
							</td>
							<td>
								<span class="badge {getStatusBadgeClass(blog.status)}">
									{blog.status}
								</span>
							</td>
							<td>{blog.author_name}</td>
							<td>{formatDate(blog.published_at)}</td>
							<td>{blog.view_count || 0}</td>
							<td class="actions-cell">
								<div class="action-buttons">
									<button
										class="btn-action btn-edit"
										on:click={() => goto(`/in/blogs/${blog.id}/edit`)}
										title="Edit"
									>
										✏️
									</button>
									{#if blog.status === 'published'}
										<a
											href="https://solarvipani.com/in/blogs/{blog.slug}"
											target="_blank"
											class="btn-action btn-view"
											title="View on site"
										>
											👁️
										</a>
									{/if}
									<button
										class="btn-action btn-delete"
										on:click={() => deleteBlog(blog.id, blog.title)}
										title="Delete"
									>
										🗑️
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<style>
	.blogs-page {
		padding: 30px;
		max-width: 1400px;
		margin: 0 auto;
	}

	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30px;
	}

	h1 {
		font-size: 32px;
		color: #333;
		margin: 0;
	}

	.dark h1 {
		color: #e0e0e0;
	}

	.btn-create {
		padding: 12px 24px;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.3s;
	}

	.btn-create:hover {
		background: #45a049;
	}

	.error-banner {
		background: #FFEBEE;
		border: 1px solid #f44336;
		padding: 16px;
		border-radius: 6px;
		margin-bottom: 20px;
	}

	.error-banner p {
		color: #d32f2f;
		margin: 0;
	}

	.filters-section {
		background: white;
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 20px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .filters-section {
		background: #2a2a2a;
	}

	.search-box {
		margin-bottom: 16px;
	}

	.search-box input {
		width: 100%;
		padding: 12px;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 15px;
		box-sizing: border-box;
	}

	.dark .search-box input {
		background: #1a1a1a;
		border-color: #444;
		color: #e0e0e0;
	}

	.filter-controls {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
	}

	.filter-controls label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: #666;
	}

	.dark .filter-controls label {
		color: #999;
	}

	.filter-controls select {
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 14px;
		background: white;
		color: #333;
	}

	.dark .filter-controls select {
		background: #1a1a1a;
		border-color: #444;
		color: #e0e0e0;
	}

	.stats-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 16px;
		margin-bottom: 24px;
	}

	.stat-card {
		background: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.dark .stat-card {
		background: #2a2a2a;
	}

	.stat-value {
		display: block;
		font-size: 32px;
		font-weight: bold;
		color: #4CAF50;
		margin-bottom: 6px;
	}

	.stat-label {
		display: block;
		font-size: 14px;
		color: #666;
	}

	.dark .stat-label {
		color: #999;
	}

	.empty-state {
		text-align: center;
		padding: 60px 20px;
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dark .empty-state {
		background: #2a2a2a;
	}

	.empty-icon {
		font-size: 64px;
		margin-bottom: 16px;
	}

	.empty-state h2 {
		color: #333;
		margin-bottom: 12px;
	}

	.dark .empty-state h2 {
		color: #e0e0e0;
	}

	.empty-state p {
		color: #666;
		margin-bottom: 24px;
	}

	.dark .empty-state p {
		color: #999;
	}

	.btn-primary {
		padding: 12px 24px;
		background: #4CAF50;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 16px;
		cursor: pointer;
		transition: background 0.3s;
	}

	.btn-primary:hover {
		background: #45a049;
	}

	.table-wrapper {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		overflow-x: auto;
	}

	.dark .table-wrapper {
		background: #2a2a2a;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	thead {
		background: #f5f5f5;
	}

	.dark thead {
		background: #1a1a1a;
	}

	th {
		padding: 16px;
		text-align: left;
		font-weight: 600;
		color: #333;
		border-bottom: 2px solid #ddd;
	}

	.dark th {
		color: #e0e0e0;
		border-color: #444;
	}

	td {
		padding: 16px;
		border-bottom: 1px solid #eee;
		color: #333;
	}

	.dark td {
		color: #e0e0e0;
		border-color: #3a3a3a;
	}

	tr:hover {
		background: #f9f9f9;
	}

	.dark tr:hover {
		background: #333;
	}

	.title-cell {
		max-width: 400px;
	}

	.blog-title {
		font-weight: 600;
		color: #4CAF50;
		text-decoration: none;
		display: block;
		margin-bottom: 4px;
	}

	.blog-title:hover {
		text-decoration: underline;
	}

	.blog-excerpt {
		font-size: 13px;
		color: #666;
		margin: 0;
	}

	.dark .blog-excerpt {
		color: #999;
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

	.actions-cell {
		white-space: nowrap;
	}

	.action-buttons {
		display: flex;
		gap: 8px;
	}

	.btn-action {
		padding: 8px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		font-size: 16px;
		transition: all 0.2s;
		text-decoration: none;
		display: inline-block;
	}

	.dark .btn-action {
		background: #1a1a1a;
		border-color: #444;
	}

	.btn-action:hover {
		background: #f5f5f5;
		transform: scale(1.1);
	}

	.dark .btn-action:hover {
		background: #3a3a3a;
	}

	.btn-delete:hover {
		background: #FFEBEE;
		border-color: #f44336;
	}

	@media (max-width: 768px) {
		.blogs-page {
			padding: 15px;
		}

		.page-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}

		.btn-create {
			width: 100%;
		}

		.stats-row {
			grid-template-columns: 1fr;
		}

		table {
			font-size: 14px;
		}

		th,
		td {
			padding: 12px 8px;
		}

		.title-cell {
			max-width: 200px;
		}

		.action-buttons {
			flex-direction: column;
		}
	}
</style>
