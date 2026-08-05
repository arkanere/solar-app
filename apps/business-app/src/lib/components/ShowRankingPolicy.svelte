<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	export type ShowRankingPolicyProps = {
		show?: boolean;
		onClose?: () => void;
	};

	let { show = $bindable(false), onClose = () => {} }: ShowRankingPolicyProps = $props();
</script>

<Dialog.Root bind:open={show} onOpenChange={() => !show && onClose()}>
	<Dialog.Content class="max-w-[600px] max-h-[80vh] overflow-y-auto">
		<Dialog.Header class="text-center sm:text-center">
			<Dialog.Title>Policy</Dialog.Title>
		</Dialog.Header>

		<div class="space-y-6 text-foreground">
			<section class="space-y-3">
				<h3 class="text-lg font-semibold text-foreground">Non-Exclusive Lead Allotment</h3>
				<Dialog.Description class="leading-relaxed">
					Our lead distribution system works on a <strong>non-exclusive basis</strong> to ensure
					fair opportunity for all qualified businesses:
				</Dialog.Description>
				<ul class="ml-5 space-y-2 list-disc">
					<li class="leading-relaxed">
						<strong>Lead Distribution:</strong> Each lead is allotted to 4 businesses simultaneously
					</li>
					<li class="leading-relaxed">
						<strong>First Come, First Served:</strong> Leads are distributed on a first come, first
						served basis to eligible businesses
					</li>
					<li class="leading-relaxed">
						<strong>Response Time Matters:</strong> Quick response to leads increases your chances of
						conversion
					</li>
					<li class="leading-relaxed">
						<strong>Equal Opportunity:</strong> All businesses have an equal chance to connect with
						potential customers
					</li>
				</ul>
			</section>

			<section class="space-y-3">
				<h3 class="text-lg font-semibold text-foreground">Business Ranking Factors</h3>
				<Dialog.Description class="leading-relaxed">
					Your business ranking on Solar Vipani is determined by several factors:
				</Dialog.Description>
				<ul class="ml-5 space-y-2 list-disc">
					<li class="leading-relaxed">
						<strong>Profile Completion:</strong> Businesses with complete profiles rank higher
					</li>
					<li class="leading-relaxed">
						<strong>Recent Projects:</strong> Posting recent solar installation projects significantly
						improves your ranking
					</li>
				</ul>
				<Dialog.Description class="leading-relaxed">
					<strong>Pro Tip:</strong> Regularly update your profile and post recent projects to maintain
					high ranking!
				</Dialog.Description>
			</section>
		</div>

		<Dialog.Footer class="sm:justify-center">
			<Button variant="outline" onclick={() => (show = false)}>Close</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
