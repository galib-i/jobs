<script>
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
  <div class="flex flex-col items-center gap-6 w-full">
    <SankeyDiagram {theme} />
  </div>
{/if}
