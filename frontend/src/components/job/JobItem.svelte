<script>
  import Button from "../ui/Button.svelte";
  import Icon from "../ui/Icon.svelte";
  import EditableInput from "../ui/EditableInput.svelte";
  import Confirm from "../ui/DeleteConfirmationPopup.svelte";
  import Tooltip from "../ui/Tooltip.svelte";
  import JobRoleEditor from "./JobRoleEditor.svelte";
  import JobStageSelector from "./JobStageSelector.svelte";

  let {
    job,
    availableStages,
    onUpdateJob,
    onDeleteJob,
    onAddStage,
    onRemoveStage,
  } = $props();

  let showDescription = $state(false);
  let isAddingDescription = $state(false);
  let isDeleteConfirmationOpen = $state(false);
  let isEditingNotes = $state(false);

  let displayLastStage = $derived(
    job.stageHistory && job.stageHistory.length > 0
      ? job.stageHistory[job.stageHistory.length - 1].count > 1
        ? `${job.lastStage} (${job.stageHistory[job.stageHistory.length - 1].count})`
        : job.lastStage
      : "None"
  );

  let bgColour = $derived(job.lastStageColour || "var(--color-yellow-500)");
  let textColour = $derived(job.lastStageTextColour || "var(--color-slate-800)");
  let formattedStages = $derived(job.formattedStages || []);

  let innerBorder = $derived(
    isDeleteConfirmationOpen
      ? "border-l border-red-300 dark:border-red-800/50"
      : "border-l border-slate-300 dark:border-slate-600/50"
  );
</script>

{#snippet tooltipContent()}
  <div class="flex items-center gap-2">
    {#if formattedStages.length > 0}
      {#each formattedStages as stageObj, index}
        <div class="group/stage flex items-center gap-1">
          <span>{stageObj.display}</span>
          {#if stageObj.raw.toLowerCase() !== "application" && stageObj.raw.toLowerCase() !== "offer"}
            <button
              onclick={(e) => {
                e.stopPropagation();
                if (onRemoveStage) onRemoveStage(job.id, index);
              }}
              class="text-slate-400 transition-all hover:text-red-400"
              title="Remove stage"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          {/if}
          {#if index < job.stages.length - 1}
            <span class="ml-1 text-slate-500">➔</span>
          {/if}
        </div>
      {/each}
    {:else}
      <span>None</span>
    {/if}
  </div>
{/snippet}

<div
  class="col-span-full grid grid-cols-subgrid border-b-2 text-sm tracking-wide text-slate-800 transition-colors duration-200 last:rounded-b-[14px] last:border-b-0 dark:text-slate-200 {isDeleteConfirmationOpen ? 'border-red-300 bg-red-100 dark:border-red-800 dark:bg-red-900/60' : 'border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700'}"
>
  <div class="flex items-center overflow-hidden px-4 py-2 pl-6">
    <EditableInput
      initialValue={job.company}
      onsave={(newValue) => onUpdateJob({ ...job, company: newValue })}
      class="block w-full truncate"
    />
  </div>

  <div class="flex items-center truncate px-4 py-2 {innerBorder}">
    <div class="mt-1 mr-2 shrink-0">
      <Button
        theme={job.description ? "yellow" : "gray"}
        onclick={() => {
          if (job.description) {
            showDescription = !showDescription;
          } else {
            isAddingDescription = true;
          }
        }}
        isIcon
        size="sm"
      >
        <Icon name="info" class="h-3.5 w-3.5" />
      </Button>
    </div>
    <JobRoleEditor {job} {onUpdateJob} />
  </div>
  
  <div class="flex items-center overflow-hidden px-4 py-2 {innerBorder}">
    <EditableInput
      initialValue={job.location}
      onsave={(newValue) => onUpdateJob({ ...job, location: newValue })}
      class="block w-full truncate"
    />
  </div>
  
  <div class="relative flex min-w-0 items-center px-4 py-2 {innerBorder}">
    <Tooltip content={tooltipContent} class="min-w-0">
      <span
        class="block cursor-help truncate rounded px-2 py-1 text-xs font-bold"
        style="background-color: {bgColour}; color: {textColour};"
      >
        {displayLastStage || "None"}
      </span>
    </Tooltip>
    <JobStageSelector {job} {availableStages} {onAddStage} />
  </div>
  
  <div class="flex items-center justify-center truncate px-4 py-2 {innerBorder}">
    {job.formattedDate}
  </div>
  
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="group/notes flex min-w-0 cursor-text items-center px-4 py-2 {innerBorder}"
    ondblclick={() => (isEditingNotes = true)}
  >
    <EditableInput
      initialValue={job.notes}
      onsave={(newValue) => onUpdateJob({ ...job, notes: newValue })}
      class="max-h-7 w-full overflow-hidden wrap-break-word whitespace-pre-wrap transition-[max-height] duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover/notes:max-h-96"
      bind:editing={isEditingNotes}
      onEditingChange={(val) => (isEditingNotes = val)}
    />
  </div>
  
  <div class="hidden items-center justify-end px-4 py-2 pr-6 lg:flex">
    <div class="mt-1.5">
      <Button theme="red" onclick={() => (isDeleteConfirmationOpen = true)} isIcon>
        <Icon name="bin" />
      </Button>
    </div>
  </div>
</div>

{#if showDescription && job.description}
  <div class="col-span-full flex items-center gap-2 border-b-2 border-slate-300 bg-slate-50 px-6 py-3 text-sm font-normal text-slate-800 last:rounded-b-[14px] last:border-b-0 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
    <span
      class="font-pixel shrink-0 font-bold tracking-wider text-yellow-600 uppercase select-none dark:text-yellow-400"
      draggable="false"
      style="-webkit-user-drag: none;"
    >
      Description:
    </span>
    <EditableInput
      initialValue={job.description}
      onsave={(newValue) => onUpdateJob({ ...job, description: newValue })}
      class="w-full flex-1 wrap-break-word whitespace-pre-wrap"
    />
  </div>
{/if}

{#if isAddingDescription}
  <div class="col-span-full flex items-center gap-2 border-b-2 border-slate-300 bg-slate-50 px-6 py-3 text-sm text-slate-800 last:rounded-b-[14px] last:border-b-0 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
    <span
      class="font-pixel shrink-0 font-bold tracking-wider text-slate-500 uppercase select-none dark:text-slate-400"
      draggable="false"
      style="-webkit-user-drag: none;"
    >
      Description:
    </span>
    <EditableInput
      initialValue=""
      editing={true}
      onEditingChange={(isEditing) => {
        if (!isEditing) isAddingDescription = false;
      }}
      onsave={(newValue) => {
        if (newValue.trim()) {
          onUpdateJob({ ...job, description: newValue.trim() });
          showDescription = true;
        }
        isAddingDescription = false;
      }}
      class="w-full flex-1 wrap-break-word whitespace-pre-wrap"
    />
  </div>
{/if}

<Confirm
  isOpen={isDeleteConfirmationOpen}
  onclose={() => (isDeleteConfirmationOpen = false)}
  onconfirm={() => {
    onDeleteJob(job.id);
    isDeleteConfirmationOpen = false;
  }}
/>
