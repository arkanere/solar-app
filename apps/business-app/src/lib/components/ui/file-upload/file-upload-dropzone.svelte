<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type FileUploadDropzoneProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import { Upload } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: FileUploadDropzoneProps = $props();

	const context = getContext<{
		isDragging: boolean;
		disabled: boolean;
		accept: string;
		multiple: boolean;
		addFiles: (files: FileList | File[]) => void;
	}>('file-upload');

	let inputRef: HTMLInputElement;

	function handleClick() {
		if (!context.disabled) {
			inputRef?.click();
		}
	}

	function handleInputChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			context.addFiles(input.files);
			input.value = '';
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleClick();
		}
	}
</script>

<div
	bind:this={ref}
	data-slot="file-upload-dropzone"
	class={cn(
		'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
		'hover:border-accent hover:bg-accent/5',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
		context.isDragging && 'border-accent bg-accent/10',
		context.disabled && 'cursor-not-allowed opacity-50',
		className
	)}
	role="button"
	tabindex={context.disabled ? -1 : 0}
	onclick={handleClick}
	onkeydown={handleKeyDown}
	{...restProps}
>
	<input
		bind:this={inputRef}
		type="file"
		accept={context.accept}
		multiple={context.multiple}
		disabled={context.disabled}
		class="sr-only"
		onchange={handleInputChange}
	/>
	{#if children}
		{@render children()}
	{:else}
		<Upload class="size-10 text-muted-foreground" />
		<div class="text-center">
			<p class="text-sm font-medium">
				{context.isDragging ? 'Drop files here' : 'Click to upload or drag and drop'}
			</p>
			<p class="text-xs text-muted-foreground mt-1">
				{context.accept === '*' ? 'Any file type' : context.accept}
			</p>
		</div>
	{/if}
</div>
