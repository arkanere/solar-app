<script>
	import { page } from '$app/stores';

	const pageData = $derived($page);
</script>

<h1>{pageData.status}: {pageData.error.message}</h1>