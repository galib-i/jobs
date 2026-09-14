<script>
  import ActivityHeatmap from "$lib/components/diagrams/activity-heatmap.svelte";
  import TimeDiagram from "$lib/components/diagrams/time-diagram.svelte";
  import SankeyDiagram from "$lib/components/diagrams/sankey-diagram.svelte";

  let { theme } = $props();

  let isReady = $state(false);

  setTimeout(() => (isReady = true), 150);
</script>

{#if !isReady}
  <div class="font-pixel mt-32 flex animate-pulse items-center justify-center text-sm text-slate-500 dark:text-slate-400">
    LOADING STATISTICS...
  </div>
{:else}
  <div class="flex flex-col items-center gap-6">
    <div class="flex w-full flex-col items-center justify-center gap-6 2xl:flex-row 2xl:items-start">
      <ActivityHeatmap {theme} />
      <TimeDiagram {theme} />
    </div>
    <SankeyDiagram {theme} />
  </div>
{/if}
