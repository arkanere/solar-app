<script>
	import { page } from '$app/stores';
	import { PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	// Get city and projects from page data
	let city = $derived($page.data.city);
	let projects = $derived($page.data.recentProjects || []);

	// Format date helper function
	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		return new Date(dateString).toLocaleDateString('en-IN', options);
	};

	// Format business name from slug
	function formatBusinessName(slug) {
		if (!slug) return 'Unknown';
		return slug
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

</script>

<!-- Only show the section if there are projects -->
{#if projects.length > 0}
	<section class="recent-projects-city">
		<h2>Recent Solar Panel Installation Projects in {city.replace('-', ' ')}</h2>

		<div class="projects-grid">
				{#each projects as project (project.id)}
					<div class="project-card">
						<a
							href="/solar-panel-installer/{project.business_slug}/project/{project.project_slug}"
							class="project-link"
						>
							<div class="project-image">
								{#if project.cloudinary_public_id}
									<img
										src={`https://res.cloudinary.com/${PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_300,h_200,q_auto,f_auto/${project.cloudinary_public_id}`}
										alt={project.title}
										loading="lazy"
									/>
								{:else if project.image_url}
									<img src={project.image_url} alt={project.title} loading="lazy" />
								{:else}
									<div class="no-image">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="48"
											height="48"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
											<circle cx="8.5" cy="8.5" r="1.5" />
											<polyline points="21,15 16,10 5,21" />
										</svg>
										<span>No Image</span>
									</div>
								{/if}
							</div>

							<div class="project-details">
								<h3>{project.title}</h3>

								<div class="project-meta">
									<p class="location">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
											<circle cx="12" cy="10" r="3" />
										</svg>
										Pincode: {project.pincode}
									</p>

									<p class="date">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
											<line x1="16" y1="2" x2="16" y2="6" />
											<line x1="8" y1="2" x2="8" y2="6" />
											<line x1="3" y1="10" x2="21" y2="10" />
										</svg>
										{formatDate(project.project_date)}
									</p>
									<p class="installer">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
											stroke-linecap="round"
											stroke-linejoin="round"
										>
											<path
												d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
											/>
										</svg>
										Installer:
										<span class="installer-link">{formatBusinessName(project.business_slug)}</span>
									</p>
								</div>
							</div>
						</a>
					</div>
				{/each}
		</div>

		{#if projects.length >= 6}
			<div class="view-more">
				<p>Want to see more solar projects in your area?</p>
				<button class="view-more-button">
					View All Projects in {city.replace('-', ' ')}
				</button>
			</div>
		{/if}
	</section>
{/if}

<style>
	.recent-projects-city {
		margin: 2rem 0;
		padding: 2rem 0;
	}

	.recent-projects-city h2 {
		font-size: 1.8rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: var(--text-primary, #1a1a1a);
		text-align: center;
	}


	.projects-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
		margin-top: 1.5rem;
	}

	.project-card {
		background: var(--card-background, #ffffff);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.project-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.project-link {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.project-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
		background-color: var(--background-secondary, #f8f9fa);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.2s ease;
	}

	.project-card:hover .project-image img {
		transform: scale(1.05);
	}

	.no-image {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: var(--text-tertiary, #999);
		font-size: 0.9rem;
		gap: 0.5rem;
	}

	.project-details {
		padding: 1.25rem;
	}

	.project-details h3 {
		font-size: 1.1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: var(--text-primary, #1a1a1a);
		line-height: 1.3;
	}

	.project-meta {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.project-meta p {
		font-size: 0.85rem;
		color: var(--text-secondary, #666);
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
	}

	.project-meta svg {
		flex-shrink: 0;
		opacity: 0.7;
	}

	.installer-link {
		color: var(--accent-color, #ff6b35);
		cursor: pointer;
		text-decoration: underline;
		transition: color 0.2s ease;
	}

	.installer-link:hover {
		color: var(--accent-color-hover, #e55a2b);
	}

	.view-more {
		text-align: center;
		margin-top: 2rem;
		padding: 2rem 1rem;
		background-color: var(--background-secondary, #f8f9fa);
		border-radius: 8px;
	}

	.view-more p {
		margin-bottom: 1rem;
		color: var(--text-secondary, #666);
	}

	.view-more-button {
		padding: 0.75rem 1.5rem;
		background-color: var(--accent-color, #ff6b35);
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 500;
		transition: background-color 0.2s ease;
	}

	.view-more-button:hover {
		background-color: var(--accent-color-hover, #e55a2b);
	}

	/* Dark mode styles */
	:global(.dark) .recent-projects-city h2 {
		color: var(--dark-text-primary, #ffffff);
	}

	:global(.dark) .project-card {
		background: var(--dark-card-background, #2a2a2a);
		color: var(--dark-text-primary, #ffffff);
	}

	:global(.dark) .project-details h3 {
		color: var(--dark-text-primary, #ffffff);
	}

	:global(.dark) .project-meta p {
		color: var(--dark-text-secondary, #b0b0b0);
	}

	:global(.dark) .view-more {
		background-color: var(--dark-background-secondary, #1a1a1a);
	}

	:global(.dark) .view-more p {
		color: var(--dark-text-secondary, #b0b0b0);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.recent-projects-city h2 {
			font-size: 1.5rem;
		}

		.projects-grid {
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.project-details {
			padding: 1rem;
		}
	}
</style>
