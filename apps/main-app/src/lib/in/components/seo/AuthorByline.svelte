<script lang="ts">
	let { name, slug, photo, date }: {
		name: string;
		slug: string;
		photo?: string;
		date?: string;
	} = $props();

	const formattedDate = $derived(date ? new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '');
</script>

<div class="flex items-center gap-3 text-sm text-muted-foreground">
	{#if photo}
		<img src={photo} alt={name} class="w-8 h-8 rounded-full object-cover" />
	{/if}
	<div>
		<a href="/in/authors/{slug}/" class="font-medium text-foreground hover:text-primary">{name}</a>
		{#if formattedDate}
			<span class="mx-1">&middot;</span>
			<time datetime={date}>{formattedDate}</time>
		{/if}
	</div>
</div>
