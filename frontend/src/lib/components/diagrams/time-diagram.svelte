<script lang="ts">
  import { scaleBand } from "d3-scale";
  import { BarChart } from "layerchart";
  import { cubicInOut } from "svelte/easing";
  import * as Card from "$lib/components/ui/card/index.js";
  import * as Chart from "$lib/components/ui/chart/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
  import { GetTimelineData } from "../../../../bindings/jobs/jobservice";
  
  let { theme = "dark" } = $props();

  let groupBy = $state("day");
  let timelineData: { dates?: string[]; counts?: number[] } | null = $state(null);

  async function load(group: string) {
    try {
      timelineData = await GetTimelineData(group + "_apps");
    } catch (err) {
      console.error(err);
    }
  }

  $effect(() => {
    load(groupBy);
  });

  const chartData = $derived.by(() => {
    if (!timelineData?.dates || !timelineData?.counts) return [];
    return timelineData.dates.map((date, i) => {
        let label = date;
        const parts = date.split("-");
        if (groupBy === "day" && parts.length === 3) {
            label = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        } else if (groupBy === "month" && parts.length === 2) {
            label = new Date(Number(parts[0]), Number(parts[1]) - 1).toLocaleDateString("en-US", {
                month: "short",
            });
        } else if (groupBy === "week" && parts.length === 3) {
            const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
            label = "Wk of " + dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
        return {
            dateLabel: label,
            count: timelineData.counts![i]
        };
    });
  });

  const chartConfig = {
    count: { label: "Activity", color: "var(--chart-1)" },
  } satisfies Chart.ChartConfig;
</script>

{#if timelineData?.dates?.length}
  <div class="flex w-full flex-col items-center">
    <Card.Root class="@container/card w-full max-w-xs">
      <Card.Header class="flex flex-row items-center justify-between space-y-0">
        <Card.Title>Volume</Card.Title>
        <Card.Action>
          <ToggleGroup.Root
            type="single"
            bind:value={groupBy}
            variant="outline"
            class="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroup.Item value="day">Day</ToggleGroup.Item>
            <ToggleGroup.Item value="week">Week</ToggleGroup.Item>
            <ToggleGroup.Item value="month">Month</ToggleGroup.Item>
          </ToggleGroup.Root>
          <Select.Root type="single" bind:value={groupBy}>
            <Select.Trigger
              size="sm"
              class="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select a grouping"
            >
              <span data-slot="select-value">
                {groupBy === "day" ? "Day" : groupBy === "week" ? "Week" : "Month"}
              </span>
            </Select.Trigger>
            <Select.Content class="rounded-xl">
              <Select.Item value="day" class="rounded-lg">Day</Select.Item>
              <Select.Item value="week" class="rounded-lg">Week</Select.Item>
              <Select.Item value="month" class="rounded-lg">Month</Select.Item>
            </Select.Content>
          </Select.Root>
        </Card.Action>
      </Card.Header>
      <Card.Content class="px-2 pt-4 sm:px-4 sm:pt-4 pb-0 sm:pb-0">
        <Chart.Container config={chartConfig} class="aspect-auto h-[126px] w-full">
          <BarChart
            data={chartData}
            xScale={scaleBand().padding(0.25)}
            x="dateLabel"
            axis="x"
            series={[{ key: "count", label: "Activity", color: chartConfig.count.color }]}
            props={{
              bars: {
                stroke: "none",
                rounded: "all",
                radius: 4,
                motion: { type: "tween", duration: 500, easing: cubicInOut },
              },
              highlight: { area: { fill: "none" } },
              xAxis: { format: (d) => String(d) },
            }}
          >
            {#snippet tooltip()}
              <Chart.Tooltip hideLabel hideIndicator />
            {/snippet}
          </BarChart>
        </Chart.Container>
      </Card.Content>
    </Card.Root>
  </div>
{/if}
