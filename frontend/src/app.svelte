<script>
  import { jobStore } from "./lib/jobs.svelte.js";
  import SettingsDialog from "$lib/components/dialogs/settings-dialog.svelte";
  import SidebarLayout from "$lib/components/layout/sidebar-layout.svelte";
  import DashboardPage from "$lib/components/dashboard/dashboard-page.svelte";

  let page = $state("jobs");
  let theme = $state("dark");

  $effect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  $effect(() => {
    // Whenever these change, reload jobs
    let sq = jobStore.searchQuery;
    let ss = jobStore.stageSort;
    let ds = jobStore.dateSort;
    jobStore.loadJobs();
  });
</script>

<SidebarLayout bind:page>
  <DashboardPage />
  <SettingsDialog
    open={page === "settings"}
    onOpenChange={(v) => {
      if (!v) page = "jobs";
    }}
    availableStages={jobStore.availableStages}
    onAddStage={(stage) => jobStore.addAvailableStage(stage)}
    onDeleteStage={(stage) => jobStore.deleteAvailableStage(stage)}
    onResetStages={() => jobStore.resetAvailableStages()}
    onWipeDatabase={() => jobStore.wipeDatabase()}
  />
</SidebarLayout>
