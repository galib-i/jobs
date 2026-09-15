<script>
  import * as echarts from "echarts/core";
  import { SankeyChart } from "echarts/charts";
  import { TooltipComponent } from "echarts/components";
  import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

  echarts.use([SankeyChart, TooltipComponent, CanvasRenderer, SVGRenderer]);
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import Icon from "$lib/components/custom/icon.svelte";
  import SuccessPopup from "$lib/components/custom/success-popup.svelte";
  import { GetSankeyData, ExportSankeyImage } from "../../../../bindings/jobs/jobservice";
  import { onDestroy } from "svelte";

  export function copy() {
    return handleCopy();
  }
  export function download() {
    return handleExport();
  }

  let { theme } = $props();

  let sankeyData = $state(null);
  let isLoading = $state(true);
  let showSuccess = $state(false);
  let popupTitle = $state("");
  let popupMessage = $state("");
  let chartEl = $state();
  let chart;

  async function load() {
    try {
      sankeyData = await GetSankeyData();
    } catch (err) {
      console.error(err);
    } finally {
      isLoading = false;
    }
  }

  load();

  function buildOption() {
    if (!sankeyData?.nodes?.length) return null;

    const nodes = sankeyData.nodes.map((node) => {
      const blockStyle = {
        backgroundColor: node.colour,
        color: node.textColour,
        padding: [4, 8],
        borderRadius: 4,
        fontWeight: "bold",
      };

      return {
        name: node.name,
        cleanName: node.cleanName,
        value: node.value,
        itemStyle: { color: node.colour },
        label: { rich: { nameBlock: blockStyle, valBlock: blockStyle } },
      };
    });

    return {
      textStyle: { fontFamily: "Inter, sans-serif" },
      tooltip: { show: false },
      series: [
        {
          type: "sankey",
          top: "10%",
          bottom: "10%",
          left: 40,
          right: 150,
          nodeWidth: 20,
          layoutIterations: 32,
          silent: true,
          nodeAlign: "left",
          nodeGap: 16,
          data: nodes,
          links: sankeyData.links,
          lineStyle: { color: "source", opacity: 0.4, curveness: 0.5 },
          label: {
            position: "right",
            textBorderWidth: 0,
            formatter: ({ data, value }) => `{nameBlock|${data.cleanName}} {valBlock|${value}}`,
          },
        },
      ],
    };
  }

  async function generateBase64Image() {
    const option = buildOption();
    if (!option) return null;

    const tempDiv = document.createElement("div");
    Object.assign(tempDiv.style, {
      width: "1299px",
      height: Math.max(120, option.series[0].data.length * 40) + "px",
      position: "absolute",
      left: "-9999px",
    });

    document.body.appendChild(tempDiv);
    const tempInstance = echarts.init(tempDiv, null, { renderer: "canvas" });
    try {
      tempInstance.setOption({ ...option, animation: false });
      return tempInstance.getDataURL({
        type: "png",
        pixelRatio: 2,
        backgroundColor: theme === "dark" ? "#0f172a" : "#f1f5f9",
      });
    } finally {
      tempInstance.dispose();
      document.body.removeChild(tempDiv);
    }
  }

  async function handleExport() {
    const base64Data = await generateBase64Image();
    if (!base64Data) return;

    try {
      const path = await ExportSankeyImage(base64Data);
      popupTitle = "Diagram Saved!";
      popupMessage = path;
      showSuccess = true;
    } catch (err) {
      console.error(err);
    }
  }

  async function handleCopy() {
    const base64Data = await generateBase64Image();
    if (!base64Data) return;

    try {
      const res = await fetch(base64Data);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      popupTitle = "Copied to Clipboard!";
      popupMessage = "";
      showSuccess = true;
    } catch (err) {
      console.error("Failed to copy image: ", err);
    }
  }

  $effect(() => {
    const option = buildOption();
    if (!chartEl || !option) return;

    if (!chart) {
      chart = echarts.init(chartEl, null, {
        renderer: "svg",
        devicePixelRatio: window.devicePixelRatio,
      });
      const ro = new ResizeObserver(() => chart?.resize());
      ro.observe(chartEl);
    }
    chart.setOption(option, true);
  });

  onDestroy(() => chart?.dispose());
</script>

{#if !isLoading}
  {#if !sankeyData?.nodes?.length}
    <p class="font-pixel mt-8 mb-4 text-center text-slate-500 dark:text-slate-400">No data</p>
  {:else}
    <div class="flex w-full flex-col">
      <div
        bind:this={chartEl}
        style="height: {Math.max(
          500,
          (sankeyData?.nodes?.length || 0) * 45,
        )}px; min-width: 1000px; width: 100%;"
      ></div>
    </div>

    <SuccessPopup
      isOpen={showSuccess}
      onclose={() => (showSuccess = false)}
      title={popupTitle}
      message={popupMessage}
    />
  {/if}
{/if}
