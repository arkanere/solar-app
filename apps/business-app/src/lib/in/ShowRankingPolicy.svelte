<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	export type ShowRankingPolicyProps = {
		show?: boolean;
		onClose?: () => void;
	};

	let { show = $bindable(false), onClose = () => {} }: ShowRankingPolicyProps = $props();

	function handleOpenChange(open: boolean) {
		if (!open) {
			show = false;
			onClose();
		}
	}

	function close() {
		show = false;
		onClose();
	}
</script>

<Dialog.Root open={show} onOpenChange={handleOpenChange}>
	<Dialog.Content class="max-w-[600px] max-h-[80vh] overflow-y-auto">
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title class="text-accent">Policy</Dialog.Title>
		</Dialog.Header>

		<div class="text-left text-foreground">
			<h3 class="mt-5 mb-3 text-accent text-lg font-semibold">Non-Exclusive Lead Allotment</h3>
			<p class="mb-4 leading-relaxed">
				Our lead distribution system works on a <strong>non-exclusive basis</strong> to ensure fair opportunity
				for all qualified businesses:
			</p>
			<ul class="ml-5 mb-4 list-disc">
				<li class="mb-2 leading-relaxed">
					<strong>Lead Distribution:</strong> Each lead is allotted to 4 businesses simultaneously
				</li>
				<li class="mb-2 leading-relaxed">
					<strong>First Come, First Served:</strong> Leads are distributed on a first come, first served
					basis to eligible businesses
				</li>
				<li class="mb-2 leading-relaxed">
					<strong>Response Time Matters:</strong> Quick response to leads increases your chances of conversion
				</li>
				<li class="mb-2 leading-relaxed">
					<strong>Equal Opportunity:</strong> All businesses have an equal chance to connect with potential
					customers
				</li>
			</ul>

			<h3 class="mt-5 mb-3 text-accent text-lg font-semibold">Business Ranking Factors</h3>
			<p class="mb-4 leading-relaxed">
				Your business ranking on Solar Vipani is determined by several factors:
			</p>
			<ul class="ml-5 mb-4 list-disc">
				<li class="mb-2 leading-relaxed">
					<strong>Profile Completion:</strong> Businesses with complete profiles rank higher
				</li>
				<li class="mb-2 leading-relaxed">
					<strong>Recent Projects:</strong> Posting recent solar installation projects significantly improves
					your ranking
				</li>
			</ul>
			<p class="mb-4 leading-relaxed">
				<strong>Pro Tip:</strong> Regularly update your profile and post recent projects to maintain high
				ranking!
			</p>
		</div>

		<Dialog.Footer class="sm:justify-center">
			<Button variant="outline" onclick={close}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
