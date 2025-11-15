<script>
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Image from '@tiptap/extension-image';
	import Link from '@tiptap/extension-link';
	import { isDarkMode } from '../themeStore.js';

	export let content = '';
	export let onChange = null;
	export let placeholder = 'Start writing your blog content...';

	let editor;
	let element;
	let darkMode;

	$: darkMode = $isDarkMode;

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit,
				Image.configure({
					HTMLAttributes: {
						class: 'editor-image'
					}
				}),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'editor-link',
						target: '_blank',
						rel: 'noopener noreferrer'
					}
				})
			],
			content: content,
			onTransaction: () => {
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				if (onChange) {
					onChange(html);
				}
			},
			editorProps: {
				attributes: {
					class: 'tiptap-editor'
				}
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function setHeading(level) {
		editor.chain().focus().toggleHeading({ level }).run();
	}

	function toggleBold() {
		editor.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor.chain().focus().toggleItalic().run();
	}

	function toggleBulletList() {
		editor.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor.chain().focus().toggleOrderedList().run();
	}

	function toggleBlockquote() {
		editor.chain().focus().toggleBlockquote().run();
	}

	function toggleCodeBlock() {
		editor.chain().focus().toggleCodeBlock().run();
	}

	function addLink() {
		const url = prompt('Enter URL:');
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	}

	function removeLink() {
		editor.chain().focus().unsetLink().run();
	}

	function addImage() {
		const url = prompt('Enter image URL:');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	}

	function undo() {
		editor.chain().focus().undo().run();
	}

	function redo() {
		editor.chain().focus().redo().run();
	}
</script>

<div class="tiptap-wrapper" class:dark={darkMode}>
	<!-- Toolbar -->
	<div class="toolbar">
		<div class="toolbar-group">
			<button
				type="button"
				on:click={toggleBold}
				class:active={editor?.isActive('bold')}
				title="Bold (Ctrl+B)"
			>
				<strong>B</strong>
			</button>
			<button
				type="button"
				on:click={toggleItalic}
				class:active={editor?.isActive('italic')}
				title="Italic (Ctrl+I)"
			>
				<em>I</em>
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button
				type="button"
				on:click={() => setHeading(2)}
				class:active={editor?.isActive('heading', { level: 2 })}
				title="Heading 2"
			>
				H2
			</button>
			<button
				type="button"
				on:click={() => setHeading(3)}
				class:active={editor?.isActive('heading', { level: 3 })}
				title="Heading 3"
			>
				H3
			</button>
			<button
				type="button"
				on:click={() => setHeading(4)}
				class:active={editor?.isActive('heading', { level: 4 })}
				title="Heading 4"
			>
				H4
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button
				type="button"
				on:click={toggleBulletList}
				class:active={editor?.isActive('bulletList')}
				title="Bullet List"
			>
				• List
			</button>
			<button
				type="button"
				on:click={toggleOrderedList}
				class:active={editor?.isActive('orderedList')}
				title="Numbered List"
			>
				1. List
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button
				type="button"
				on:click={toggleBlockquote}
				class:active={editor?.isActive('blockquote')}
				title="Blockquote"
			>
				" Quote
			</button>
			<button
				type="button"
				on:click={toggleCodeBlock}
				class:active={editor?.isActive('codeBlock')}
				title="Code Block"
			>
				&lt;/&gt;
			</button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button
				type="button"
				on:click={addLink}
				class:active={editor?.isActive('link')}
				title="Add Link"
			>
				🔗 Link
			</button>
			{#if editor?.isActive('link')}
				<button type="button" on:click={removeLink} title="Remove Link"> Unlink </button>
			{/if}
			<button type="button" on:click={addImage} title="Add Image"> 🖼️ Image </button>
		</div>

		<div class="toolbar-divider"></div>

		<div class="toolbar-group">
			<button type="button" on:click={undo} title="Undo (Ctrl+Z)"> ↶ </button>
			<button type="button" on:click={redo} title="Redo (Ctrl+Y)"> ↷ </button>
		</div>
	</div>

	<!-- Editor Content -->
	<div bind:this={element} class="editor-content"></div>
</div>

<style>
	.tiptap-wrapper {
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
		background: white;
		margin: 10px 0;
	}

	.tiptap-wrapper.dark {
		background: #2a2a2a;
		border-color: #444;
	}

	.toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 12px;
		border-bottom: 1px solid #ddd;
		background: #f5f5f5;
		align-items: center;
	}

	.dark .toolbar {
		background: #1a1a1a;
		border-color: #444;
	}

	.toolbar-group {
		display: flex;
		gap: 4px;
	}

	.toolbar-divider {
		width: 1px;
		height: 24px;
		background: #ddd;
		margin: 0 4px;
	}

	.dark .toolbar-divider {
		background: #444;
	}

	.toolbar button {
		padding: 6px 12px;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		font-size: 14px;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.dark .toolbar button {
		background: #2a2a2a;
		border-color: #444;
		color: #e0e0e0;
	}

	.toolbar button:hover {
		background: #e0e0e0;
		border-color: #999;
	}

	.dark .toolbar button:hover {
		background: #3a3a3a;
		border-color: #555;
	}

	.toolbar button.active {
		background: #4CAF50;
		color: white;
		border-color: #45a049;
	}

	.dark .toolbar button.active {
		background: #45a049;
		border-color: #3d8b40;
	}

	.editor-content {
		min-height: 400px;
		padding: 20px;
		font-size: 16px;
		line-height: 1.6;
		color: #333;
	}

	.dark .editor-content {
		color: #e0e0e0;
	}

	/* TipTap Editor Styles */
	:global(.tiptap-editor) {
		outline: none;
	}

	:global(.tiptap-editor h2) {
		font-size: 28px;
		font-weight: bold;
		margin: 24px 0 16px;
		color: #222;
	}

	:global(.dark .tiptap-editor h2) {
		color: #f0f0f0;
	}

	:global(.tiptap-editor h3) {
		font-size: 22px;
		font-weight: bold;
		margin: 20px 0 12px;
		color: #333;
	}

	:global(.dark .tiptap-editor h3) {
		color: #e0e0e0;
	}

	:global(.tiptap-editor h4) {
		font-size: 18px;
		font-weight: bold;
		margin: 16px 0 10px;
		color: #444;
	}

	:global(.dark .tiptap-editor h4) {
		color: #d0d0d0;
	}

	:global(.tiptap-editor p) {
		margin: 12px 0;
	}

	:global(.tiptap-editor ul),
	:global(.tiptap-editor ol) {
		padding-left: 24px;
		margin: 12px 0;
	}

	:global(.tiptap-editor li) {
		margin: 6px 0;
	}

	:global(.tiptap-editor blockquote) {
		border-left: 4px solid #4CAF50;
		padding-left: 16px;
		margin: 16px 0;
		font-style: italic;
		color: #666;
	}

	:global(.dark .tiptap-editor blockquote) {
		color: #999;
		border-left-color: #45a049;
	}

	:global(.tiptap-editor pre) {
		background: #f5f5f5;
		border: 1px solid #ddd;
		border-radius: 4px;
		padding: 16px;
		overflow-x: auto;
		margin: 16px 0;
	}

	:global(.dark .tiptap-editor pre) {
		background: #1a1a1a;
		border-color: #444;
	}

	:global(.tiptap-editor code) {
		background: #f5f5f5;
		padding: 2px 6px;
		border-radius: 3px;
		font-family: 'Courier New', monospace;
		font-size: 14px;
	}

	:global(.dark .tiptap-editor code) {
		background: #1a1a1a;
	}

	:global(.tiptap-editor .editor-image) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 16px 0;
		display: block;
	}

	:global(.tiptap-editor .editor-link) {
		color: #4CAF50;
		text-decoration: underline;
		cursor: pointer;
	}

	:global(.dark .tiptap-editor .editor-link) {
		color: #66bb6a;
	}

	:global(.tiptap-editor .editor-link:hover) {
		color: #45a049;
	}

	/* Placeholder */
	:global(.tiptap-editor p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #aaa;
		pointer-events: none;
		height: 0;
	}

	@media (max-width: 768px) {
		.toolbar {
			padding: 8px;
		}

		.toolbar button {
			padding: 4px 8px;
			font-size: 12px;
		}

		.editor-content {
			padding: 12px;
			min-height: 300px;
		}
	}
</style>
