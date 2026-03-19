<script lang="ts">
	type District = {
		name: string;
		state: string;
		stateSlug: string;
		districtSlug: string;
		installerCount: number;
	};

	let { districts }: { districts: District[] } = $props();
</script>

{#if districts.length > 0}
	<section class="mb-8 bg-accent/10 rounded-lg p-6">
		<h2 class="text-xl font-semibold text-primary mb-3">Find Installers in Your City</h2>
		<p class="text-sm text-muted-foreground mb-4">
			Ready to go solar? Browse verified installers in top districts across India.
		</p>
		<div class="flex flex-wrap gap-2">
			{#each districts as d}
				<a
					href="/in/solar/{d.stateSlug}/{d.districtSlug}/"
					class="bg-card border rounded-lg px-4 py-2 text-sm font-medium hover:border-primary hover:shadow-sm transition-all"
				>
					{d.name} <span class="text-muted-foreground">({d.installerCount})</span>
				</a>
			{/each}
		</div>
	</section>
{/if}
