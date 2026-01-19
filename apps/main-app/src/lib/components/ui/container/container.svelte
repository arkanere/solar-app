<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<div class="rounded-lg border border-inner-glow bg-card p-4 shadow-xs gradient-subtle backdrop-glass {className}" {...rest}>
	<slot />
</div>

<style>
	div {
		transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
