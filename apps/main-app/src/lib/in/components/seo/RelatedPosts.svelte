<script lang="ts">
	let { posts }: {
		posts: { title: string; slug: string; publishedAt: string }[];
	} = $props();
</script>

{#if posts.length > 0}
	<section class="mt-8">
		<h2 class="text-xl font-semibold text-primary mb-4">Related Articles</h2>
		<ul class="space-y-3">
			{#each posts as post}
				<li class="border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
					<a href="/in/blog/{post.slug}/" class="font-medium text-foreground hover:text-primary">
						{post.title}
					</a>
					<p class="text-sm text-muted-foreground mt-1">
						{new Date(post.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
					</p>
				</li>
			{/each}
		</ul>
	</section>
{/if}
