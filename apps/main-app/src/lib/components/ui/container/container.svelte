<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<div
	class="border border-inner-glow bg-card shadow-xs gradient-subtle backdrop-glass {className}"
	style="border-radius: var(--container-radius); padding: var(--container-padding); transition: var(--container-transition);"
	{...rest}
>
	<slot />
</div>
