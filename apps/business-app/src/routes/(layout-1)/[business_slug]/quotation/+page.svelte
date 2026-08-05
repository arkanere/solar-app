<script lang="ts">
	import { page } from '$app/stores';
	import QuotationMaker from '$lib/components/QuotationMaker.svelte';

	let business = $derived($page.data.business ?? {});
</script>

<QuotationMaker {business} />
