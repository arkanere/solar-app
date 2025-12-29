<script lang="ts" module>
	import type { Tabs as TabsPrimitive } from 'bits-ui';

	export type TabsProps = TabsPrimitive.RootProps;
</script>

<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';

	let {
		value = $bindable(''),
		...restProps
	}: TabsProps = $props();
</script>

<TabsPrimitive.Root bind:value data-slot="tabs" {...restProps} />
