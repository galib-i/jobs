<script>
  import * as echarts from "echarts/core";
  import { SankeyChart } from "echarts/charts";
  import { TooltipComponent } from "echarts/components";
  import { CanvasRenderer, SVGRenderer } from "echarts/renderers";

  echarts.use([SankeyChart, TooltipComponent, CanvasRenderer, SVGRenderer]);
  import Button from "$lib/components/custom/button.svelte";
  import Icon from "$lib/components/custom/icon.svelte";
  import SuccessPopup from "$lib/components/custom/success-popup.svelte";
  import { GetSankeyData, ExportSankeyImage } from "../../../../bindings/jobs/jobservice";
  import { onDestroy } from "svelte";

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
            formatter: ({ data, value }) =>
              `{nameBlock|${data.cleanName}} {valBlock|${value}}`,
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
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob })
      ]);
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
      chart = echarts.init(chartEl, null, { renderer: "svg" });
      const ro = new ResizeObserver(() => chart?.resize());
      ro.observe(chartEl);
    }
    chart.setOption(option, true);
  });

  let nodeCount = $derived(sankeyData?.nodes?.length ?? 0);
  let chartHeight = $derived(Math.max(120, nodeCount * 40));

  onDestroy(() => chart?.dispose());
</script>

{#if !isLoading}
  {#if !sankeyData?.nodes?.length}
    <p class="font-pixel mt-8 mb-4 text-center text-slate-500 dark:text-slate-400">No data</p>
  {:else}
    <div class="mx-auto flex w-full max-w-212.5 flex-col 2xl:max-w-324.75">
      <div class="relative overflow-hidden rounded-2xl border-2 border-blue-500 bg-slate-100 dark:bg-slate-900">
        <!-- Header -->
        <div class="font-pixel flex items-center justify-between border-b-2 border-blue-500 bg-blue-600 font-bold tracking-wider text-white select-none">
          <div class="px-4 py-3 pl-6 whitespace-nowrap">Progress</div>
          <div class="flex items-center gap-2 pr-4">
            <Button theme="yellow" isIcon size="sm" onclick={handleCopy}>
              <Icon name="copy" class="h-3.5 w-3.5" />
            </Button>
            <Button theme="green" isIcon size="sm" onclick={handleExport}>
              <Icon name="download" class="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <!-- Chart -->
        <div class="flex min-w-0 items-center justify-center p-4 pt-6">
          <div bind:this={chartEl} style="height: {chartHeight}px; width: 100%;"></div>
        </div>
      </div>
    </div>

    <SuccessPopup
      isOpen={showSuccess}
      onclose={() => (showSuccess = false)}
      title={popupTitle}
      message={popupMessage}
    />
  {/if}
{/if}
