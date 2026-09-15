<script>
  import DotsVerticalIcon from "@tabler/icons-svelte/icons/dots-vertical";
  import CheckIcon from "@tabler/icons-svelte/icons/check";
  import XIcon from "@tabler/icons-svelte/icons/x";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { jobStore } from "$lib/jobs.svelte.js";

  let { row } = $props();
  let isEditing = $derived(jobStore.editingRowId === row.original.id);
  let isDeleteDialogOpen = $state(false);

  function confirmDelete() {
    jobStore.deleteJob(row.original.id);
    isDeleteDialogOpen = false;
  }
</script>

{#if isEditing}
  <div class="flex items-center gap-1">
    <Button
      variant="ghost"
      size="icon"
      class="flex size-7 text-green-500 hover:bg-green-500/10 hover:text-green-600"
      onclick={() => (jobStore.editingRowId = null)}
      title="Save changes"
    >
      <CheckIcon class="h-4 w-4" />
      <span class="sr-only">Save editing</span>
    </Button>
    <Button
      variant="ghost"
      size="icon"
      class="text-destructive hover:text-destructive hover:bg-destructive/10 flex size-7"
      onmousedown={(e) => {
        e.preventDefault();
        jobStore.editingRowId = null;
      }}
      title="Close editing"
    >
      <XIcon class="h-4 w-4" />
      <span class="sr-only">Cancel editing</span>
    </Button>
  </div>
{:else}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="text-muted-foreground data-[state=open]:bg-muted flex size-8">
      {#snippet child({ props })}
        <Button variant="ghost" size="icon" {...props}>
          <DotsVerticalIcon />
          <span class="sr-only">Open menu</span>
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" class="w-32">
      <DropdownMenu.Item onclick={() => (jobStore.editingRowId = row.original.id)}>
        Edit
      </DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="destructive" onclick={() => (isDeleteDialogOpen = true)}>
        Delete
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>

  <!-- Delete Confirmation Alert Dialog -->
  <AlertDialog.Root bind:open={isDeleteDialogOpen}>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Delete this application?</AlertDialog.Title>
        <AlertDialog.Description>
          Are you sure you want to delete the application for
          <span class="text-foreground font-semibold">
            {row.original.role}
          </span>
          at
          <span class="text-foreground font-semibold">
            {row.original.company}
          </span>?
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
        <AlertDialog.Action variant="destructive" onclick={confirmDelete}>
          Delete
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
{/if}
