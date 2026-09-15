<script>
  import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  import { jobStore } from "$lib/jobs.svelte.js";

  let { row } = $props();

  let isExpanded = $derived(jobStore.expandedRowIds.has(row.original.id));

  function toggle() {
    const newSet = new Set(jobStore.expandedRowIds);
    if (isExpanded) {
      newSet.delete(row.original.id);
    } else {
      newSet.add(row.original.id);
    }
    jobStore.expandedRowIds = newSet;
  }
</script>

<Tooltip.Root>
  <Tooltip.Trigger>
    <div class="inline-flex">
      <Button variant="ghost" size="icon" class="h-6 w-6 p-0 hover:bg-transparent" onclick={toggle}>
        <ChevronRightIcon
          class="text-muted-foreground h-4 w-4 transition-transform duration-200 {isExpanded
            ? 'rotate-90'
            : ''}"
        />
        <span class="sr-only">Toggle row</span>
      </Button>
    </div>
  </Tooltip.Trigger>
  <Tooltip.Content side="top">
    <p class="text-xs">Description</p>
  </Tooltip.Content>
</Tooltip.Root>
