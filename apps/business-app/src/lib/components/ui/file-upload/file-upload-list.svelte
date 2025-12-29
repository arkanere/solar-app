<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type FileUploadListProps = HTMLAttributes<HTMLUListElement> & {
		children?: Snippet;
		ref?: HTMLUListElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import type { FileUploadFile } from './file-upload.svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: FileUploadListProps = $props();

	const context = getContext<{
		files: FileUploadFile[];
	}>('file-upload');
</script>

{#if context.files.length > 0}
	<ul
		bind:this={ref}
		data-slot="file-upload-list"
		class={cn('mt-4 space-y-2', className)}
		{...restProps}
	>
		{#if children}
			{@render children()}
		{:else}
			{#each context.files as file (file.id)}
				<slot name="item" {file} />
			{/each}
		{/if}
	</ul>
{/if}
