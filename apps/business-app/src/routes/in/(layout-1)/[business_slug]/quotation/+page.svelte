<script lang="ts">
	import { page } from '$app/stores';
	import QuotationMaker from '$lib/in-new-rewrites/QuotationMaker.svelte';

	let business = $derived($page.data.business ?? {});
</script>

<QuotationMaker {business} />
