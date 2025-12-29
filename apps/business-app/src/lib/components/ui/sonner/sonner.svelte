<script lang="ts">
	import { Toaster as SonnerToaster, type ToasterProps } from 'svelte-sonner';

	let { ...props }: ToasterProps = $props();
</script>

<SonnerToaster
	class="toaster group"
	toastOptions={{
		classes: {
			toast: 'group toast bg-card text-foreground border-border shadow-lg',
			title: 'text-foreground font-semibold',
			description: 'text-foreground-muted',
			success: 'bg-success text-success-foreground border-success',
			error: 'bg-destructive text-destructive-foreground border-destructive',
			warning: 'bg-warning text-warning-foreground border-warning',
			actionButton: 'bg-primary text-primary-foreground',
			cancelButton: 'bg-muted text-foreground-muted'
		}
	}}
	{...props}
/>
