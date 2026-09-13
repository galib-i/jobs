<script>
  import * as echarts from "echarts/core";
  import { BarChart } from "echarts/charts";
  import { TooltipComponent, GridComponent, DataZoomComponent } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";

  echarts.use([BarChart, TooltipComponent, GridComponent, DataZoomComponent, SVGRenderer]);
  import Button from "../ui/Button.svelte";
  import { GetTimelineData } from "../../../bindings/jobs/jobservice";
  import { onDestroy } from "svelte";

  let { theme } = $props();

  let groupBy = $state("day");
  let timelineData = $state(null);
  let chartEl = $state();
  let chart;

  const maxSpans = { day: 7, week: 26, month: 6 };

  async function load(group) {
    try {
      timelineData = await GetTimelineData(group + "_apps");
    } catch (err) {
      console.error(err);
    }
  }

  $effect(() => {
    load(groupBy);
  });

  function buildOption() {
    if (!timelineData?.dates?.length) return null;

    const isDark = theme === "dark";
    const maxSpan = maxSpans[groupBy];
    const dataLen = timelineData.dates.length;
    const startPercent = dataLen > maxSpan ? 100 - (maxSpan / dataLen) * 100 : 0;

    return {
      textStyle: { fontFamily: "Inter, sans-serif" },
      tooltip: {
        show: true,
        position: "top",
        appendToBody: true,
        padding: [4, 8],
        formatter: (p) => {
          const count = p.value;
          const name = p.name;
          const parts = name.split("-");
          let dateStr = name;
          let preposition = "on";
          
          if (groupBy === "day" && parts.length === 3) {
            dateStr = `${parts[2]}-${parts[1]}`;
          } else if (groupBy === "month" && parts.length === 2) {
            dateStr = `${parts[1]}-${parts[0]}`;
            preposition = "in";
          } else if (groupBy === "week") {
            dateStr = `week ${parts[1]} of ${parts[0]}`;
            preposition = "in";
          }
          
          return `${count} activit${count === 1 ? "y" : "ies"} ${preposition} ${dateStr}`;
        },
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
        borderColor: isDark ? "#334155" : "#cbd5e1",
        textStyle: { color: isDark ? "#f8fafc" : "#1e293b", fontSize: 12 },
      },
      grid: { top: 10, right: 15, bottom: 45, left: 40 },
      dataZoom: [
        {
          type: "slider",
          show: dataLen > maxSpan,
          xAxisIndex: [0],
          start: startPercent,
          end: 100,
          maxValueSpan: maxSpan,
          bottom: 0,
          height: 8,
          showDataShadow: false,
          showDetail: false,
          borderColor: isDark ? "#1e293b" : "#e2e8f0",
          backgroundColor: isDark ? "#0f172a" : "#f1f5f9",
          fillerColor: "#3b82f6",
          handleSize: 0,
          brushSelect: false,
        },
        {
          type: "inside",
          xAxisIndex: [0],
          zoomOnMouseWheel: false,
          moveOnMouseWheel: true,
          moveOnMouseMove: true,
        },
      ],
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: timelineData.dates,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: isDark ? "#94a3b8" : "#64748b",
          fontWeight: "bold",
          formatter: (val) => {
            const parts = val.split("-");
            if (parts.length === 3) {
              return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            } else if (parts.length === 2) {
              return new Date(parts[0], parts[1] - 1).toLocaleDateString("en-US", {
                month: "short",
              });
            }
            return val;
          },
        },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitLine: { lineStyle: { color: isDark ? "#334155" : "#e2e8f0" } },
        axisLabel: { color: isDark ? "#94a3b8" : "#64748b", fontWeight: "bold" },
      },
      series: [
        {
          data: timelineData.counts,
          type: "bar",
          cursor: "default",
          itemStyle: { color: "#eab308", borderRadius: [4, 4, 0, 0] },
          emphasis: { disabled: true },
          barWidth: "80%",
        },
      ],
    };
  }

  $effect(() => {
    // deps: chartEl, timelineData, theme, groupBy
    const option = buildOption();
    if (!chartEl || !option) return;

    if (!chart) {
      chart = echarts.init(chartEl, null, { renderer: "svg" });
      const ro = new ResizeObserver(() => chart?.resize());
      ro.observe(chartEl);
    }
    chart.setOption(option, true);
  });

  onDestroy(() => chart?.dispose());
</script>

{#if timelineData?.dates?.length}
  <div class="flex w-full max-w-212.5 flex-col 2xl:max-w-106.25">
    <div class="relative overflow-hidden rounded-2xl border-2 border-blue-500 bg-slate-100 contain-content dark:bg-slate-900">
      <!-- Header -->
      <div class="font-pixel flex items-center justify-between border-b-2 border-blue-500 bg-blue-600 font-bold tracking-wider text-white select-none">
        <div class="px-4 py-3 pl-6 whitespace-nowrap">Volume</div>
        <div class="flex items-center pr-4 select-none">
          {#each ["day", "week", "month"] as group, index}
            {@const position = index === 0 ? "left" : index === 1 ? "middle" : "right"}
            <Button
              {position}
              theme="yellow"
              size="sm"
              isActive={groupBy === group}
              onclick={() => (groupBy = group)}
            >
              {group.toUpperCase()}
            </Button>
          {/each}
        </div>
      </div>

      <!-- Chart -->
      <div class="flex min-w-0 items-center justify-center p-4 pt-6">
        <div bind:this={chartEl} style="height: 200px; width: 100%;"></div>
      </div>
    </div>
  </div>
{/if}
