<script>
  import { jobStore } from "$lib/jobs.svelte.js";

  let { row } = $props();

  let notesValue = $state(row.original.notes || "");

  function handleBlur() {
    if (row.original.notes !== notesValue) {
      jobStore.updateJob({ ...row.original, notes: notesValue });
    }
  }
</script>

<textarea
  class="border-input font-inherit placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 min-h-9 w-full resize-y rounded-md border bg-transparent px-3 py-1.5 text-inherit shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
  placeholder="Add notes..."
  bind:value={notesValue}
  onblur={handleBlur}></textarea>
