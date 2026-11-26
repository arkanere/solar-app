<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	type ContactPerson = {
		full_name: string;
		role: string;
		description: string | null;
	};

	type Props = {
		show?: boolean;
		contactPerson?: ContactPerson | null;
		onClose?: () => void;
		onUpdated?: () => void;
	};

	let {
		show = $bindable(false),
		contactPerson = null,
		onClose = () => {},
		onUpdated = () => {}
	}: Props = $props();

	const ROLE_OPTIONS = [
		{ value: 'proprietor', label: 'Proprietor' },
		{ value: 'employee', label: 'Employee' },
		{ value: 'third_party', label: 'Third party' }
	];

	let fullName = $state('');
	let role = $state('');
	let description = $state('');
	let saving = $state(false);

	let roleLabel = $derived(ROLE_OPTIONS.find((r) => r.value === role)?.label);

	$effect(() => {
		if (show) {
			fullName = contactPerson?.full_name ?? '';
			role = contactPerson?.role ?? '';
			description = contactPerson?.description ?? '';
		}
	});

	function close() {
		show = false;
		onClose();
	}

	async function save() {
		if (!fullName.trim() || !role) {
			toast.error('Name and position are required');
			return;
		}
		saving = true;
		try {
			const response = await fetch('/api/contactPerson', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ full_name: fullName, role, description })
			});
			const result = await response.json();
			if (result.success) {
				toast.success('Contact person saved');
				onUpdated();
			} else {
				toast.error(result.error || 'Could not save contact person');
			}
		} catch {
			toast.error('Could not save contact person');
		} finally {
			saving = false;
		}
	}
</script>

<Dialog.Root open={show} onOpenChange={(open) => !open && close()}>
	<Dialog.Content class="max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Contact Person</Dialog.Title>
			<Dialog.Description>The person responsible for this business account.</Dialog.Description>
		</Dialog.Header>

		<form
			class="flex flex-col gap-2.5"
			onsubmit={(e) => {
				e.preventDefault();
				save();
			}}
		>
			<Label for="cp_full_name" class="font-bold">Full Name:</Label>
			<Input id="cp_full_name" bind:value={fullName} required maxlength={255} />

			<Label for="cp_role" class="font-bold">Position in the firm:</Label>
			<Select.Root type="single" bind:value={role}>
				<Select.Trigger id="cp_role" class="w-full">
					{roleLabel ?? 'Select a position'}
				</Select.Trigger>
				<Select.Content>
					{#each ROLE_OPTIONS as option}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<Label for="cp_description" class="font-bold">Description:</Label>
			<Textarea
				id="cp_description"
				bind:value={description}
				maxlength={1000}
				placeholder="e.g., Founder, handles all customer projects"
				class="min-h-[80px]"
			/>

			<Dialog.Footer class="mt-5">
				<Button variant="outline" onclick={close}>Cancel</Button>
				<Button type="submit" disabled={saving}>Save</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
