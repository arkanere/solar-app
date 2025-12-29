<script lang="ts" module>
	import type { Calendar as CalendarPrimitive } from 'bits-ui';

	export type CalendarProps = CalendarPrimitive.RootProps;
</script>

<script lang="ts">
	import { Calendar as CalendarPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		class: className,
		weekdayFormat = 'short',
		...restProps
	}: CalendarProps = $props();
</script>

<CalendarPrimitive.Root
	bind:ref
	data-slot="calendar"
	{weekdayFormat}
	class={cn('p-3', className)}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<CalendarPrimitive.Header class="flex items-center justify-between pb-2">
			<CalendarPrimitive.PrevButton
				class={cn(
					'inline-flex size-7 items-center justify-center rounded-md border border-input bg-transparent',
					'hover:bg-accent hover:text-accent-foreground',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
					'disabled:pointer-events-none disabled:opacity-50'
				)}
			>
				<ChevronLeft class="size-4" />
			</CalendarPrimitive.PrevButton>
			<CalendarPrimitive.Heading class="text-sm font-medium" />
			<CalendarPrimitive.NextButton
				class={cn(
					'inline-flex size-7 items-center justify-center rounded-md border border-input bg-transparent',
					'hover:bg-accent hover:text-accent-foreground',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
					'disabled:pointer-events-none disabled:opacity-50'
				)}
			>
				<ChevronRight class="size-4" />
			</CalendarPrimitive.NextButton>
		</CalendarPrimitive.Header>

		<div class="flex flex-col gap-4 sm:flex-row">
			{#each months as month}
				<CalendarPrimitive.Grid class="w-full border-collapse space-y-1">
					<CalendarPrimitive.GridHead>
						<CalendarPrimitive.GridRow class="flex">
							{#each weekdays as weekday}
								<CalendarPrimitive.HeadCell
									class="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground"
								>
									{weekday.slice(0, 2)}
								</CalendarPrimitive.HeadCell>
							{/each}
						</CalendarPrimitive.GridRow>
					</CalendarPrimitive.GridHead>
					<CalendarPrimitive.GridBody>
						{#each month.weeks as weekDates}
							<CalendarPrimitive.GridRow class="mt-2 flex w-full">
								{#each weekDates as date}
									<CalendarPrimitive.Cell {date} month={month.value} class="relative p-0 text-center text-sm">
										<CalendarPrimitive.Day
											class={cn(
												'inline-flex size-8 items-center justify-center rounded-md text-sm font-normal',
												'hover:bg-accent hover:text-accent-foreground',
												'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
												'data-[selected]:bg-primary data-[selected]:text-primary-foreground',
												'data-[today]:bg-accent data-[today]:text-accent-foreground',
												'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
												'data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50',
												'data-[unavailable]:text-muted-foreground data-[unavailable]:line-through'
											)}
										/>
									</CalendarPrimitive.Cell>
								{/each}
							</CalendarPrimitive.GridRow>
						{/each}
					</CalendarPrimitive.GridBody>
				</CalendarPrimitive.Grid>
			{/each}
		</div>
	{/snippet}
</CalendarPrimitive.Root>
