<script>
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import { OpenDataFolder } from "../../../bindings/jobs/jobservice.js";
  import XIcon from "@tabler/icons-svelte/icons/x";

  let {
    open = false,
    onOpenChange,
    availableStages,
    onAddStage,
    onDeleteStage,
    onResetStages,
    onWipeDatabase,
  } = $props();

  let newStageName = $state("");
  let isConfirmOpen = $state(false);

  function handleAdd(e) {
    e.preventDefault();
    const stage = newStageName.trim();
    if (!stage) return;

    // Check for duplicates
    const isDuplicate = (availableStages || []).some(
      (s) => s.name.toLowerCase() === stage.toLowerCase(),
    );
    if (isDuplicate) {
      newStageName = ""; // Or show an error toast
      return;
    }

    onAddStage(stage);
    newStageName = "";
  }

  function handleWipe() {
    onWipeDatabase();
    isConfirmOpen = false;
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content class="max-h-[95vh] w-[95vw] max-w-2xl overflow-auto sm:max-w-2xl">
    <Dialog.Header>
      <Dialog.Title class="font-bold">Settings</Dialog.Title>
      <Dialog.Description class="sr-only">Settings for the application</Dialog.Description>
    </Dialog.Header>

    <div class="mt-4 flex w-full flex-col gap-10">
      <!-- Manage Stages -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium">Manage Stages</h3>
          <Button variant="outline" size="sm" onclick={onResetStages}>Reset Defaults</Button>
        </div>

        <div class="bg-card text-card-foreground space-y-4 rounded-xl border p-6 shadow-sm">
          <div class="bg-background h-64 overflow-y-auto rounded-md border">
            <div class="flex flex-col">
              {#each availableStages || [] as stage}
                {@const isUndeleteable =
                  stage.name === "Rejection" ||
                  stage.name === "Withdrawn" ||
                  stage.name === "Offer" ||
                  stage.name === "Application"}
                <div
                  class="hover:bg-muted/50 flex items-center justify-between border-b px-3 py-1.5 transition-colors last:border-0"
                >
                  <span class="text-sm font-medium">{stage.name}</span>
                  {#if !isUndeleteable}
                    <Button
                      variant="ghost"
                      size="icon"
                      class="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                      onclick={() => onDeleteStage(stage.name)}
                      title="Delete stage"
                    >
                      <XIcon class="h-4 w-4" />
                      <span class="sr-only">Delete {stage.name}</span>
                    </Button>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
          <form onsubmit={handleAdd} class="flex items-center gap-2 pt-2">
            <Input
              type="text"
              class="flex-1"
              placeholder="New stage..."
              bind:value={newStageName}
              oninput={(e) => {
                newStageName = e.currentTarget.value.replace(/[()]/g, "");
              }}
            />
            <Button type="submit">Add Stage</Button>
          </form>
        </div>
      </div>

      <Separator />

      <!-- Data Management -->
      <div class="space-y-6">
        <div>
          <h3 class="text-sm font-medium">Data Management</h3>
        </div>

        <div class="space-y-6">
          <div class="space-y-2">
            <h4 class="text-sm font-medium">Local Data</h4>
            <p class="text-muted-foreground text-sm">
              Open the folder where your SQLite database and config files are stored.
            </p>
            <Button variant="outline" class="w-full" onclick={() => OpenDataFolder()}>
              Open Data Folder
            </Button>
          </div>

          <Separator />

          <div class="space-y-2">
            <h4 class="text-destructive text-sm font-medium">Danger Zone</h4>
            <p class="text-muted-foreground text-sm">
              Permanently delete all job applications and stages. This action cannot be undone.
            </p>
            <AlertDialog.Root bind:open={isConfirmOpen}>
              <AlertDialog.Trigger>
                {#snippet child({ props })}
                  <Button variant="destructive" class="w-full" {...props}>Wipe Database</Button>
                {/snippet}
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Header>
                  <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                  <AlertDialog.Description>
                    This action cannot be undone. This will permanently delete your entire database,
                    removing all job applications, custom stages, and related data.
                  </AlertDialog.Description>
                </AlertDialog.Header>
                <AlertDialog.Footer>
                  <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                  <AlertDialog.Action variant="destructive" onclick={handleWipe}>
                    Yes, wipe database
                  </AlertDialog.Action>
                </AlertDialog.Footer>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </div>
        </div>
      </div>
    </div>
  </Dialog.Content>
</Dialog.Root>
