<script lang="ts">
	import QuotationMaker from '$lib/in-new-rewrites/QuotationMaker.svelte';
	import PublicNavbar from '$lib/in-new-rewrites/PublicNavbar.svelte';
</script>

<PublicNavbar />
<main class="min-h-screen bg-background text-foreground">
	<div class="w-full max-w-[1200px] mx-auto px-4 py-6 md:px-6 md:py-8 max-[480px]:px-3">
		<QuotationMaker />
	</div>
</main>
