<script lang="ts">
	import Breadcrumb from '$lib/in/components/seo/Breadcrumb.svelte';
	import { personLD, breadcrumbLD } from '$lib/seo';

	let { data } = $props();

	const jsonLdPerson = $derived(JSON.stringify(personLD({
		name: data.author.name,
		slug: data.author.slug,
		credentials: data.author.credentials,
		photo: data.author.photo
	})));

	const jsonLdBreadcrumb = $derived(JSON.stringify(breadcrumbLD([
		{ name: 'Home', url: 'https://solarvipani.com/in/' },
		{ name: data.author.name, url: `https://solarvipani.com/in/authors/${data.author.slug}/` }
	])));

	const allArticles = $derived([
		...data.blogPosts.map((p: { title: string; slug: string; published_at: string }) => ({
			title: p.title,
			href: `/in/blog/${p.slug}/`,
			date: p.published_at
		})),
		...data.seoPages.map((p: { title: string; slug: string; pillar_slug: string; updated_at: string }) => ({
			title: p.title,
			href: `/in/${p.pillar_slug}/${p.slug}/`,
			date: p.updated_at
		}))
	].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

	const socialLinks = $derived(
		typeof data.author.social_links === 'string'
			? JSON.parse(data.author.social_links)
			: data.author.social_links
	);
</script>

<svelte:head>
	<title>{data.author.name} - Author | Solar Vipani</title>
	<meta name="description" content="{data.author.name}{data.author.credentials ? `, ${data.author.credentials}` : ''} — Solar energy expert and author at Solar Vipani." />
	<link rel="canonical" href="https://solarvipani.com/in/authors/{data.author.slug}/" />
	{@html `<script type="application/ld+json">${jsonLdPerson}<\u002Fscript>`}
	{@html `<script type="application/ld+json">${jsonLdBreadcrumb}<\u002Fscript>`}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<Breadcrumb items={[
		{ name: 'Home', href: '/in/' },
		{ name: data.author.name, href: '' }
	]} />

	<div class="flex items-start gap-6 mb-8">
		{#if data.author.photo}
			<img
				src={data.author.photo}
				alt={data.author.name}
				class="w-24 h-24 rounded-full object-cover shrink-0"
			/>
		{/if}
		<div>
			<h1 class="text-3xl md:text-4xl font-bold text-primary mb-1">{data.author.name}</h1>
			{#if data.author.credentials}
				<p class="text-muted-foreground font-medium mb-2">{data.author.credentials}</p>
			{/if}
			{#if data.author.expertise}
				<div class="flex flex-wrap gap-2 mb-3">
					{#each (Array.isArray(data.author.expertise) ? data.author.expertise : []) as area}
						<span class="bg-muted rounded-lg px-3 py-1 text-sm font-medium">{area}</span>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	{#if data.author.bio}
		<div class="prose prose-sm max-w-none mb-8">
			<p>{data.author.bio}</p>
		</div>
	{/if}

	{#if socialLinks}
		<div class="flex gap-4 mb-8 text-sm">
			{#each Object.entries(socialLinks) as [platform, url]}
				<a
					href={String(url)}
					target="_blank"
					rel="noopener noreferrer"
					class="text-muted-foreground hover:text-primary capitalize"
				>
					{platform}
				</a>
			{/each}
		</div>
	{/if}

	{#if allArticles.length > 0}
		<section>
			<h2 class="text-2xl font-semibold text-primary mb-4">Published Articles</h2>
			<div class="space-y-3">
				{#each allArticles as article}
					<a
						href={article.href}
						class="block border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all"
					>
						<h3 class="font-medium text-foreground">{article.title}</h3>
						{#if article.date}
							<p class="text-sm text-muted-foreground mt-1">
								{new Date(article.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
							</p>
						{/if}
					</a>
				{/each}
			</div>
		</section>
	{/if}
</div>
