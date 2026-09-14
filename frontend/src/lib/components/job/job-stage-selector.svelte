<script>
  import TriangleButton from "$lib/components/custom/triangle-button.svelte";

  let { job, availableStages, onAddStage } = $props();

  let isAddingStage = $state(false);
  let hoveredStage = $state(null);

  let stagesToSelect = $derived(availableStages || []);
</script>

{#if job.isActive}
  <div class="ml-auto inline-block {isAddingStage ? 'z-40' : 'mt-0.5'}">
    <TriangleButton theme="blue" onclick={() => (isAddingStage = true)} />
    {#if isAddingStage}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div class="fixed inset-0" onclick={() => (isAddingStage = false)}></div>
      <div
        class="absolute top-full right-2 left-2 mt-1 overflow-hidden rounded-md border-2 border-slate-300 bg-white py-2 shadow-2xl dark:border-slate-600 dark:bg-slate-800"
      >
        <div class="mb-2 border-b border-slate-200 px-3 pb-2 text-center text-xs font-bold tracking-wider text-slate-500 uppercase dark:border-slate-700 dark:text-slate-400">
          Select Stage
        </div>
        <div class="custom-scrollbar max-h-48 space-y-0.5 overflow-y-auto overscroll-contain px-1.5 pb-1.5">
          {#each stagesToSelect as stage}
            {@const isLastStage = stage.isLast}
            {@const isDisabled = isLastStage && job.stages?.includes(stage.name)}
            {@const isHovered = hoveredStage === stage.name}
            {@const stageBg = stage.colour}
            {@const stageText = stage.textColour}
            {@const count = job.stages?.filter((s) => s === stage.name).length || 0}
            {@const displayStage = count > 0 ? `${stage.name} (${count + 1})` : stage.name}

            <button
              disabled={isDisabled}
              class="block w-full rounded px-2.5 py-1.5 text-center text-sm font-bold transition-colors {isDisabled ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800/50 dark:text-slate-500' : 'cursor-pointer text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700'}"
              style={isHovered && !isDisabled ? `background-color: ${stageBg}; color: ${stageText}` : ""}
              onmouseenter={() => (hoveredStage = stage.name)}
              onmouseleave={() => (hoveredStage = null)}
              onclick={() => {
                if (!isDisabled) {
                  onAddStage(job.id, stage.name);
                  isAddingStage = false;
                  hoveredStage = null;
                }
              }}
            >
              {displayStage}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}
