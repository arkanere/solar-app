<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	const links = [{ label: 'Quotation Maker', href: '/in/quotation' }];
</script>

<nav
	class="w-full flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-3"
>
	<a href="/in" class="text-lg font-semibold no-underline text-foreground hover:text-primary transition-colors whitespace-nowrap">
		Solar Vipani <span class="text-muted-foreground font-normal">for Business</span>
	</a>

	<div class="flex items-center gap-4">
		{#each links as link}
			<a
				href={link.href}
				class={cn(
					'text-sm font-medium no-underline text-foreground hover:text-primary transition-colors whitespace-nowrap'
				)}
			>
				{link.label}
			</a>
		{/each}
		<Button href="/in/login" size="sm">Login</Button>
	</div>
</nav>
