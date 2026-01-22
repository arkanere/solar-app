<script lang="ts">
	import type { Command as CommandPrimitive, Dialog as DialogPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";
	import Command from "./command.svelte";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import type { WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		open = $bindable(false),
		ref = $bindable(null),
		value = $bindable(""),
		title = "Command Palette",
		description = "Search for a command to run",
		portalProps,
		children,
		...restProps
	}: WithoutChildrenOrChild<DialogPrimitive.RootProps> &
		WithoutChildrenOrChild<CommandPrimitive.RootProps> & {
			portalProps?: Omit<DialogPrimitive.PortalProps, "children">;
			children: Snippet;
			title?: string;
			description?: string;
		} = $props();
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Header class="sr-only">
		<Dialog.Title>{title}</Dialog.Title>
		<Dialog.Description>{description}</Dialog.Description>
	</Dialog.Header>
	<Dialog.Content class="overflow-hidden p-0" {portalProps}>
		<Command
			class="[&_[data-slot=command-input-wrapper]]:h-[var(--command-dialog-input-wrapper-height)] [&_[data-slot=command-group]]:px-[var(--command-dialog-group-padding-x)] [&_[data-slot=command-group]]:py-[var(--command-dialog-group-padding-y)] [&_[data-slot=command-group]:not([hidden])_~[data-slot=command-group]]:pt-0 [&_[data-slot=command-input-wrapper]_svg]:h-[var(--command-dialog-icon-size)] [&_[data-slot=command-input-wrapper]_svg]:w-[var(--command-dialog-icon-size)] [&_[data-slot=command-input]]:h-[var(--command-dialog-input-height)] [&_[data-slot=command-item]]:px-[var(--command-dialog-item-padding-x)] [&_[data-slot=command-item]]:py-[var(--command-dialog-item-padding-y)] [&_[data-slot=command-item]_svg]:h-[var(--command-dialog-icon-size)] [&_[data-slot=command-item]_svg]:w-[var(--command-dialog-icon-size)]"
			{...restProps}
			bind:value
			bind:ref
			{children}
		/>
	</Dialog.Content>
</Dialog.Root>
