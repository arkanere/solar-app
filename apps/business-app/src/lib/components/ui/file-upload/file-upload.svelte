<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	export type FileUploadFile = {
		file: File;
		id: string;
		progress: number;
		status: 'pending' | 'uploading' | 'complete' | 'error';
		error?: string;
	};

	export type FileUploadProps = HTMLAttributes<HTMLDivElement> & {
		children: Snippet;
		files?: FileUploadFile[];
		accept?: string;
		multiple?: boolean;
		maxSize?: number;
		maxFiles?: number;
		disabled?: boolean;
		onFilesChange?: (files: FileUploadFile[]) => void;
		ref?: HTMLDivElement | null;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils';
	import { setContext } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		files = $bindable([]),
		accept = '*',
		multiple = true,
		maxSize = 10 * 1024 * 1024, // 10MB default
		maxFiles = 10,
		disabled = false,
		onFilesChange,
		children,
		...restProps
	}: FileUploadProps = $props();

	let isDragging = $state(false);

	function generateId(): string {
		return Math.random().toString(36).substring(2, 9);
	}

	function addFiles(newFiles: FileList | File[]) {
		if (disabled) return;

		const fileArray = Array.from(newFiles);
		const validFiles: FileUploadFile[] = [];

		for (const file of fileArray) {
			if (files.length + validFiles.length >= maxFiles) break;

			if (file.size > maxSize) {
				validFiles.push({
					file,
					id: generateId(),
					progress: 0,
					status: 'error',
					error: `File exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`
				});
				continue;
			}

			validFiles.push({
				file,
				id: generateId(),
				progress: 0,
				status: 'pending'
			});
		}

		files = [...files, ...validFiles];
		onFilesChange?.(files);
	}

	function removeFile(id: string) {
		files = files.filter((f) => f.id !== id);
		onFilesChange?.(files);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (!disabled) isDragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			addFiles(e.dataTransfer.files);
		}
	}

	setContext('file-upload', {
		get files() {
			return files;
		},
		get isDragging() {
			return isDragging;
		},
		get disabled() {
			return disabled;
		},
		get accept() {
			return accept;
		},
		get multiple() {
			return multiple;
		},
		addFiles,
		removeFile
	});
</script>

<div
	bind:this={ref}
	data-slot="file-upload"
	class={cn('relative', className)}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	{...restProps}
>
	{@render children?.()}
</div>
