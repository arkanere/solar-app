<script lang="ts">
	import { page } from '$app/state';
	let { data } = $props();
	const slug = page.params.business_slug;
</script>

{#if data.error}
	<div style="padding: 2rem; text-align: center;">
		<p>{data.error}</p>
		<a href="/in/{slug}/login">Request a new sign-in link</a>
	</div>
{:else}
	<p>Redirecting...</p>
{/if}
