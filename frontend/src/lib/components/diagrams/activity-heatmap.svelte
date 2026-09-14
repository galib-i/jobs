<script>
  import * as echarts from "echarts/core";
  import { HeatmapChart } from "echarts/charts";
  import { TooltipComponent, VisualMapComponent, GridComponent, DataZoomComponent } from "echarts/components";
  import { SVGRenderer } from "echarts/renderers";

  echarts.use([HeatmapChart, TooltipComponent, VisualMapComponent, GridComponent, DataZoomComponent, SVGRenderer]);
  import * as Card from "$lib/components/ui/card/index.js";
  import { GetHeatmapData } from "../../../../bindings/jobs/jobservice";
  import { onDestroy } from "svelte";

  let { theme = "dark" } = $props();

  let timelineData = $state(null);
  let chartEl = $state();
  let chart;

  function parseDate(str) {
    const [y, m, d] = str.split("-");
    return new Date(y, m - 1, d);
  }

  async function load() {
    try {
      timelineData = await GetHeatmapData();
    } catch (err) {
      console.error(err);
    }
  }

  load();

  function buildOption() {
    if (!timelineData?.weeks?.length) return null;

    const { weeks, heatmapData } = timelineData;
    const maxSpan = 30;
    const dataLen = weeks.length;
    const startPercent = dataLen > maxSpan ? 100 - (maxSpan / dataLen) * 100 : 0;

    return {
      textStyle: { fontFamily: "Inter, sans-serif" },
      tooltip: {
        position: "top",
        appendToBody: true,
        padding: [4, 8],
        formatter: (p) => {
          const count = p.data[2];
          const date = p.data[3];
          const [_y, m, d] = date.split("-");
          return `${count} activit${count === 1 ? "y" : "ies"} on ${d}-${m}`;
        },
        backgroundColor: theme === "dark" ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
        borderColor: theme === "dark" ? "#334155" : "#cbd5e1",
        textStyle: { color: theme === "dark" ? "#f8fafc" : "#1e293b", fontSize: 12 },
      },
      visualMap: {
        dimension: 2,
        type: "piecewise",
        show: false,
        orient: "horizontal",
        right: -8,
        bottom: 0,
        itemWidth: 12,
        itemHeight: 12,
        itemSymbol: "roundRect",
        itemGap: 4,
        showLabel: false,
        text: ["More", "Less"],
        textGap: 6,
        textStyle: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          fontSize: 11,
          fontWeight: "bold",
        },
        pieces: [
          { value: 0, color: theme === "dark" ? "#27272a" : "#e4e4e7" },
          { min: 1, max: 2, color: "#0e4429" },
          { min: 3, max: 4, color: "#006d32" },
          { min: 5, max: 6, color: "#26a641" },
          { min: 7, max: 9999, color: "#39d353" },
        ],
      },
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
      xAxis: {
        show: true,
        type: "category",
        data: weeks,
        position: "top",
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          fontSize: 12,
          interval: 0,
          formatter: (value) => {
            const absIndex = weeks.indexOf(value);
            if (absIndex === 0) {
              return parseDate(value).toLocaleDateString("en-US", { month: "short" });
            }
            const curr = parseDate(value);
            const prev = parseDate(weeks[absIndex - 1]);
            if (curr.getMonth() !== prev.getMonth()) {
              return curr.toLocaleDateString("en-US", { month: "short" });
            }
            return "";
          },
        },
      },
      yAxis: {
        show: true,
        type: "category",
        data: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        inverse: true,
        splitArea: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: theme === "dark" ? "#94a3b8" : "#64748b",
          fontSize: 12,
          formatter: (value) => {
            if (value === "Mon" || value === "Wed" || value === "Fri") return value;
            return "";
          },
        },
      },
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0],
          start: startPercent,
          end: 100,
          maxValueSpan: maxSpan,
          zoomOnMouseWheel: false,
          moveOnMouseWheel: false,
          moveOnMouseMove: false,
        },
      ],
      series: [
        {
          type: "heatmap",
          data: heatmapData,
          itemStyle: {
            borderRadius: 6,
            borderColor: "var(--card)",
            borderWidth: 4,
          },
        },
      ],
    };
  }

  $effect(() => {
    // deps: chartEl, timelineData, theme
    const option = buildOption();
    if (!chartEl || !option) return;

    if (!chart) {
      chart = echarts.init(chartEl, null, { renderer: "svg" });
    }
    chart.setOption(option, true);
  });

  onDestroy(() => chart?.dispose());
</script>

{#if timelineData?.weeks?.length}
  <Card.Root class="w-full max-w-2xl min-w-0">
    <Card.Header>
      <Card.Title>Activity</Card.Title>
    </Card.Header>
    <Card.Content class="p-4 pt-0 sm:px-6 sm:pt-0 pb-0 sm:pb-0">
      <div bind:this={chartEl} style="height: 150px; width: 100%; margin: 0 auto;"></div>
    </Card.Content>
  </Card.Root>
{/if}
