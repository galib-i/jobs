<script>
  import { jobStore } from "./lib/jobs.svelte.js";
  import SettingsPage from "$lib/components/settings-page.svelte";

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
  {#if page === "settings"}
    <SettingsPage
      availableStages={jobStore.availableStages}
      onAddStage={(stage) => jobStore.addStage(null, stage)}
      onDeleteStage={(stage) => {
        // Find index of stage to delete
        const index = jobStore.availableStages.findIndex((s) => s.name === stage);
        if (index !== -1) jobStore.removeStage(null, index);
      }}
      onResetStages={() => jobStore.resetStages()}
      onWipeDatabase={() => jobStore.wipeDatabase()}
    />
  {:else}
    <DashboardPage />
  {/if}
</SidebarLayout>
