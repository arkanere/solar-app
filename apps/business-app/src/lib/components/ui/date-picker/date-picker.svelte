<script lang="ts" module>
	import type { DatePicker as DatePickerPrimitive } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';

	export type DatePickerProps = DatePickerPrimitive.RootProps & {
		placeholder?: string;
	};
</script>

<script lang="ts">
	import { DatePicker as DatePickerPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';
	import { ChevronLeft, ChevronRight, CalendarIcon } from '@lucide/svelte';

	let {
		ref = $bindable(null),
		value = $bindable(undefined),
		class: className,
		placeholder = 'Pick a date',
		...restProps
	}: DatePickerProps = $props();

	function formatDate(date: DateValue | undefined): string {
		if (!date) return placeholder;
		return new Date(date.year, date.month - 1, date.day).toLocaleDateString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<DatePickerPrimitive.Root
	bind:ref
	bind:value
	data-slot="date-picker"
	weekdayFormat="short"
	class={cn(className)}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<DatePickerPrimitive.Input
			class={cn(
				'flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm',
				'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
				'disabled:cursor-not-allowed disabled:opacity-50'
			)}
		>
			{#snippet children({ segments })}
				<div class="flex items-center gap-1">
					{#each segments as { part, value: segValue }}
						{#if part === 'literal'}
							<span class="text-muted-foreground">{segValue}</span>
						{:else}
							<DatePickerPrimitive.Segment
								{part}
								class={cn(
									'rounded px-0.5 tabular-nums',
									'focus:outline-none focus:bg-accent focus:text-accent-foreground',
									'data-[placeholder]:text-muted-foreground'
								)}
							>
								{segValue}
							</DatePickerPrimitive.Segment>
						{/if}
					{/each}
				</div>
			{/snippet}
			<DatePickerPrimitive.Trigger
				class="text-muted-foreground hover:text-foreground focus:outline-none"
			>
				<CalendarIcon class="size-4" />
			</DatePickerPrimitive.Trigger>
		</DatePickerPrimitive.Input>

		<DatePickerPrimitive.Content
			class={cn(
				'z-50 rounded-md border bg-popover p-3 text-popover-foreground shadow-md',
				'data-[state=open]:animate-in data-[state=closed]:animate-out',
				'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
				'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95'
			)}
			sideOffset={4}
		>
			<DatePickerPrimitive.Calendar>
				<DatePickerPrimitive.Header class="flex items-center justify-between pb-2">
					<DatePickerPrimitive.PrevButton
						class={cn(
							'inline-flex size-7 items-center justify-center rounded-md border border-input bg-transparent',
							'hover:bg-accent hover:text-accent-foreground',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							'disabled:pointer-events-none disabled:opacity-50'
						)}
					>
						<ChevronLeft class="size-4" />
					</DatePickerPrimitive.PrevButton>
					<DatePickerPrimitive.Heading class="text-sm font-medium" />
					<DatePickerPrimitive.NextButton
						class={cn(
							'inline-flex size-7 items-center justify-center rounded-md border border-input bg-transparent',
							'hover:bg-accent hover:text-accent-foreground',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							'disabled:pointer-events-none disabled:opacity-50'
						)}
					>
						<ChevronRight class="size-4" />
					</DatePickerPrimitive.NextButton>
				</DatePickerPrimitive.Header>

				<div class="flex flex-col gap-4">
					{#each months as month}
						<DatePickerPrimitive.Grid class="w-full border-collapse space-y-1">
							<DatePickerPrimitive.GridHead>
								<DatePickerPrimitive.GridRow class="flex">
									{#each weekdays as weekday}
										<DatePickerPrimitive.HeadCell
											class="w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground"
										>
											{weekday.slice(0, 2)}
										</DatePickerPrimitive.HeadCell>
									{/each}
								</DatePickerPrimitive.GridRow>
							</DatePickerPrimitive.GridHead>
							<DatePickerPrimitive.GridBody>
								{#each month.weeks as weekDates}
									<DatePickerPrimitive.GridRow class="mt-2 flex w-full">
										{#each weekDates as date}
											<DatePickerPrimitive.Cell
												{date}
												month={month.value}
												class="relative p-0 text-center text-sm"
											>
												<DatePickerPrimitive.Day
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
											</DatePickerPrimitive.Cell>
										{/each}
									</DatePickerPrimitive.GridRow>
								{/each}
							</DatePickerPrimitive.GridBody>
						</DatePickerPrimitive.Grid>
					{/each}
				</div>
			</DatePickerPrimitive.Calendar>
		</DatePickerPrimitive.Content>
	{/snippet}
</DatePickerPrimitive.Root>
