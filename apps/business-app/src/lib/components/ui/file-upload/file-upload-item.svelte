<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { FileUploadFile } from './file-upload.svelte';

	export type FileUploadItemProps = HTMLAttributes<HTMLLIElement> & {
		file: FileUploadFile;
		ref?: HTMLLIElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext } from 'svelte';
	import { File, X, AlertCircle, CheckCircle2 } from '@lucide/svelte';
	import { Progress } from '$lib/components/ui/progress';

	let {
		ref = $bindable(null),
		class: className,
		file,
		...restProps
	}: FileUploadItemProps = $props();

	const context = getContext<{
		removeFile: (id: string) => void;
	}>('file-upload');

	function formatFileSize(bytes: number): string {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	}
</script>

<li
	bind:this={ref}
	data-slot="file-upload-item"
	class={cn(
		'flex items-center gap-3 rounded-lg border bg-card p-3',
		file.status === 'error' && 'border-destructive/50 bg-destructive/5',
		file.status === 'complete' && 'border-success/50 bg-success/5',
		className
	)}
	{...restProps}
>
	<div class="flex-shrink-0">
		{#if file.status === 'error'}
			<AlertCircle class="size-8 text-destructive" />
		{:else if file.status === 'complete'}
			<CheckCircle2 class="size-8 text-success" />
		{:else}
			<File class="size-8 text-muted-foreground" />
		{/if}
	</div>

	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium truncate">{file.file.name}</p>
		<div class="flex items-center gap-2 text-xs text-muted-foreground">
			<span>{formatFileSize(file.file.size)}</span>
			{#if file.status === 'error' && file.error}
				<span class="text-destructive">{file.error}</span>
			{:else if file.status === 'uploading'}
				<span>{file.progress}%</span>
			{:else if file.status === 'complete'}
				<span class="text-success">Complete</span>
			{/if}
		</div>
		{#if file.status === 'uploading'}
			<Progress value={file.progress} size="sm" class="mt-2" />
		{/if}
	</div>

	<button
		type="button"
		class={cn(
			'flex-shrink-0 rounded-md p-1 text-muted-foreground',
			'hover:bg-muted hover:text-foreground',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
		)}
		onclick={() => context.removeFile(file.id)}
		aria-label="Remove file"
	>
		<X class="size-4" />
	</button>
</li>
