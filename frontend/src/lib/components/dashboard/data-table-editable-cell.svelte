<script>
  import { jobStore } from "$lib/jobs.svelte.js";

  let { row, field } = $props();

  let isEditing = $derived(jobStore.editingRowId === row.original.id);

  let value = $state("");

  $effect(() => {
    if (isEditing) {
      value = row.original[field] || "";
    }
  });

  function save() {
    if (value !== row.original[field]) {
      jobStore.updateJob({ ...row.original, [field]: value });
    }
  }

  function handleKeydown(e) {
    if (e.key === "Enter") {
      save();
    }
  }
</script>

{#if isEditing}
  <input
    type="text"
    class="border-input focus-visible:ring-ring flex h-8 w-full rounded-md border bg-transparent px-2 py-1 text-inherit shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
    bind:value
    onblur={save}
    onkeydown={handleKeydown}
  />
{:else}
  <span class="block truncate" title={row.original[field]}>{row.original[field]}</span>
{/if}
