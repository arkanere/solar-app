<script lang="ts">
	import { Users, MapPin, FileCheck, TrendingUp } from '@lucide/svelte';

	interface Props {
		installerCount: number;
		citiesServed: number;
		projectsCompleted: number;
		leadsGenerated: number;
	}

	let { installerCount, citiesServed, projectsCompleted, leadsGenerated } = $props();

	const stats = $derived([
		{ label: 'Verified Installers', value: installerCount, icon: Users },
		{ label: 'Cities Served', value: citiesServed, icon: MapPin },
		{ label: 'Projects Completed', value: projectsCompleted, icon: FileCheck },
		{ label: 'Leads Generated', value: leadsGenerated, icon: TrendingUp }
	]);
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
	{#each stats as stat}
		<div class="flex flex-col items-center gap-2 rounded-lg bg-muted p-4 text-center">
			<stat.icon class="h-6 w-6 text-primary" />
			<span class="text-2xl font-bold text-foreground md:text-3xl">{stat.value.toLocaleString('en-IN')}+</span>
			<span class="text-sm text-muted-foreground">{stat.label}</span>
		</div>
	{/each}
</div>
