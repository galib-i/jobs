<script>
  import DatabaseIcon from "@lucide/svelte/icons/database";
  import SettingsIcon from "@lucide/svelte/icons/settings";
  import LayersIcon from "@lucide/svelte/icons/layers";
  import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import XIcon from "@tabler/icons-svelte/icons/x";

  const data = {
    nav: [
      { name: "General", icon: SettingsIcon },
      { name: "Manage Stages", icon: LayersIcon },
      { name: "Data Management", icon: DatabaseIcon },
    ],
  };

  let {
    open = false,
    onOpenChange,
    availableStages,
    onAddStage,
    onDeleteStage,
    onResetStages,
    onWipeDatabase,
  } = $props();

  let activeItem = $state(data.nav[0]);
  let newStageName = $state("");
  let isResetConfirmOpen = $state(false);
  let isWipeConfirmOpen = $state(false);

  function handleWipe() {
    onWipeDatabase();
    isWipeConfirmOpen = false;
  }

  function handleAdd(e) {
    e.preventDefault();
    const stage = newStageName.trim();
    if (!stage) return;

    // Check for duplicates
    const isDuplicate = (availableStages || []).some(
      (s) => s.name.toLowerCase() === stage.toLowerCase(),
    );
    if (isDuplicate) {
      newStageName = "";
      return;
    }

    onAddStage(stage);
    newStageName = "";
  }
</script>

<Dialog.Root {open} {onOpenChange}>
  <Dialog.Content
    class="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]"
    trapFocus={false}
  >
    <Dialog.Title class="sr-only">Settings</Dialog.Title>
    <Dialog.Description class="sr-only">Customize your settings here.</Dialog.Description>
    <Sidebar.Provider class="flex-row-reverse items-start">
      <Sidebar.Root side="right" collapsible="none" class="hidden border-l md:flex">
        <Sidebar.Content>
          <Sidebar.Group class="pt-16">
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {#each data.nav as item (item.name)}
                  <Sidebar.MenuItem>
                    <Sidebar.MenuButton
                      isActive={activeItem.name === item.name}
                      onclick={() => (activeItem = item)}
                    >
                      {#snippet child({ props })}
                        <button {...props}>
                          <item.icon />
                          <span>{item.name}</span>
                        </button>
                      {/snippet}
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                {/each}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar.Root>
      <main class="flex h-[480px] flex-1 flex-col overflow-hidden">
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
        >
          <div class="flex items-center gap-2 px-4">
            <Breadcrumb.Root>
              <Breadcrumb.List>
                <Breadcrumb.Item class="hidden md:block">
                  <Breadcrumb.Link href="##">Settings</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator class="hidden md:block" />
                <Breadcrumb.Item>
                  <Breadcrumb.Page>{activeItem.name}</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>
          </div>
        </header>
        <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          {#if activeItem.name === "Manage Stages"}
            <div class="space-y-6">
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
                <AlertDialog.Root bind:open={isResetConfirmOpen}>
                  <AlertDialog.Trigger>
                    {#snippet child({ props })}
                      <Button {...props} variant="outline" size="icon" title="Reset Defaults">
                        <RotateCcwIcon class="h-4 w-4" />
                        <span class="sr-only">Reset Defaults</span>
                      </Button>
                    {/snippet}
                  </AlertDialog.Trigger>
                  <AlertDialog.Content>
                    <AlertDialog.Header>
                      <AlertDialog.Title>Reset to default stages?</AlertDialog.Title>
                      <AlertDialog.Description>
                        This will remove custom stages from the Status dropdown, but not delete
                        them.
                      </AlertDialog.Description>
                    </AlertDialog.Header>
                    <AlertDialog.Footer>
                      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                      <AlertDialog.Action
                        onclick={() => {
                          onResetStages();
                          isResetConfirmOpen = false;
                        }}
                      >
                        Continue
                      </AlertDialog.Action>
                    </AlertDialog.Footer>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </form>
            </div>
          {:else if activeItem.name === "General"}
            <div class="text-muted-foreground flex h-full items-center justify-center text-sm">
              General settings coming soon...
            </div>
          {:else if activeItem.name === "Data Management"}
            <div class="space-y-6">
              <div>
                <h3 class="text-sm font-medium">Data Management</h3>
              </div>
              <div class="space-y-6">
                <div class="space-y-2">
                  <h4 class="text-destructive text-sm font-medium">Danger Zone</h4>
                  <p class="text-muted-foreground text-sm">
                    Permanently delete all job applications and stages. This action cannot be
                    undone.
                  </p>
                  <AlertDialog.Root bind:open={isWipeConfirmOpen}>
                    <AlertDialog.Trigger>
                      {#snippet child({ props })}
                        <Button variant="destructive" class="w-full" {...props}
                          >Wipe Database</Button
                        >
                      {/snippet}
                    </AlertDialog.Trigger>
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
                        <AlertDialog.Description>
                          This will permanently delete all your job applications and stages. This
                          action cannot be undone.
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
          {/if}
        </div>
      </main>
    </Sidebar.Provider>
  </Dialog.Content>
</Dialog.Root>
