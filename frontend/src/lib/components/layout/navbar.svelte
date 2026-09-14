<script>
  import Button from "$lib/components/custom/button.svelte";
  import SplitButton from "$lib/components/custom/split-button.svelte";
  import Icon from "$lib/components/custom/icon.svelte";
  import SettingsPopup from "./settings-popup.svelte";

  let {
    activePage = $bindable(),
    theme = $bindable(),
    availableStages,
    addAvailableStage,
    deleteAvailableStage,
    resetAvailableStages,
    wipeDatabase,
  } = $props();

  let isSettingsOpen = $state(false);
</script>

<nav class="flex items-center justify-between gap-4 p-4 text-sm">
  <div class="flex-1"></div>

  <!-- Navigation -->
  <div class="flex-none">
    <SplitButton
      left={{ label: "JOBS", value: "jobs" }}
      right={{ label: "STATISTICS", value: "diagrams" }}
      activeValue={activePage}
      onchange={(val) => (activePage = val)}
    />
  </div>

  <!-- Theme -->
  <div class="flex flex-1 justify-start gap-2">
    <Button
      theme="yellow"
      onclick={() => (theme = theme === "dark" ? "light" : "dark")}
      isIcon
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </Button>
    <div class="relative">
      <Button isIcon theme="blue" onclick={() => (isSettingsOpen = true)}>
        <Icon name="settings" />
      </Button>
      <SettingsPopup
        isOpen={isSettingsOpen}
        {availableStages}
        onAddStage={addAvailableStage}
        onDeleteStage={deleteAvailableStage}
        onResetStages={resetAvailableStages}
        onWipeDatabase={wipeDatabase}
        onclose={() => (isSettingsOpen = false)}
      />
    </div>
  </div>
</nav>
