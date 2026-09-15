<script>
  import Button from "$lib/components/custom/button.svelte";
  import TextBox from "$lib/components/custom/text-box.svelte";
  import Confirm from "$lib/components/custom/delete-confirmation-popup.svelte";
  import { OpenDataFolder } from "../../../bindings/jobs/jobservice.js";

  let { availableStages, onAddStage, onDeleteStage, onResetStages, onWipeDatabase } = $props();

  let newStageName = $state("");
  let isConfirmOpen = $state(false);

  function handleAdd(e) {
    e.preventDefault();
    if (newStageName.trim()) {
      onAddStage(newStageName);
      newStageName = "";
    }
  }
</script>

<div class="flex h-full w-full items-center justify-center p-4">
  <div
    class="mx-4 w-full max-w-sm overflow-hidden rounded-xl border-2 border-slate-300 bg-white shadow-xl select-none dark:border-slate-600 dark:bg-slate-800"
    style="--wails-draggable: no-drag"
  >
    <div
      class="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold tracking-wider text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      <span class="font-pixel">Settings</span>
    </div>
    <div class="space-y-4 p-4">
      <div>
        <div class="mb-2 flex items-center justify-between">
          <h3
            class="font-pixel text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
          >
            Manage Stages
          </h3>
          <button
            onclick={onResetStages}
            class="font-pixel cursor-pointer text-[10px] tracking-wider text-slate-400 uppercase transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          >
            Reset Defaults
          </button>
        </div>
        <div class="custom-scrollbar max-h-48 space-y-1 overflow-y-auto pr-1">
          {#each availableStages || [] as stage}
            {@const isUndeleteable =
              stage.name === "Rejected" || stage.name === "Withdrawn" || stage.name === "Offer"}
            <div
              class="flex items-center justify-between rounded bg-slate-100 px-2 py-1.5 dark:bg-slate-700/50"
            >
              <span class="flex-1 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                {stage.name}
              </span>
              {#if !isUndeleteable}
                <button
                  onclick={() => onDeleteStage(stage.name)}
                  class="ml-2 cursor-pointer rounded px-1 text-red-400 transition-colors hover:bg-red-400/20 hover:text-red-300"
                  title="Delete stage"
                >
                  ✕
                </button>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <form onsubmit={handleAdd} class="flex items-center gap-2 pt-2">
        <TextBox
          type="text"
          class="flex-1"
          placeholder="New stage..."
          bind:value={newStageName}
          oninput={(e) => {
            newStageName = e.target.value.replace(/[()]/g, "");
          }}
        />
        <Button theme="green" type="submit" size="sm">ADD</Button>
      </form>
      <div class="border-t border-slate-300 pt-4 dark:border-slate-700">
        <h3
          class="font-pixel mb-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400"
        >
          Data
        </h3>
        <Button theme="blue" class="mb-4 w-full text-center" onclick={() => OpenDataFolder()}>
          OPEN DATA FOLDER
        </Button>

        <h3 class="font-pixel mb-2 text-xs font-bold tracking-wider text-red-400 uppercase">
          Reset
        </h3>
        <Button theme="red" class="w-full text-center" onclick={() => (isConfirmOpen = true)}>
          DELETE ALL RECORDS
        </Button>
      </div>
    </div>
  </div>
  <Confirm
    isOpen={isConfirmOpen}
    onclose={() => (isConfirmOpen = false)}
    onconfirm={() => {
      onWipeDatabase();
      isConfirmOpen = false;
    }}
    title="Wipe all jobs and stages?"
  />
</div>
