<script>
  import { jobStore } from "./lib/jobs.svelte.js";
  import JobsPage from "$lib/components/jobs-dashboard.svelte";
  import DiagramsPage from "$lib/components/stats-summary.svelte";
  import SettingsPage from "$lib/components/settings-page.svelte";

  // Import the sidebar layout installed from shadcn-svelte
  import SidebarLayout from "$lib/components/layout/sidebar-layout.svelte";

  let page = $state("jobs");
  let viewMode = $state("active");
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
        const index = jobStore.availableStages.findIndex(s => s.name === stage);
        if (index !== -1) jobStore.removeStage(null, index);
      }}
      onResetStages={() => jobStore.resetStages()}
      onWipeDatabase={() => jobStore.wipeDatabase()}
    />
  {:else}
    <DiagramsPage {theme} />
    <JobsPage
      jobs={jobStore.jobs}
      availableStages={jobStore.availableStages}
      bind:viewMode={viewMode}
      onAddJob={(job) => jobStore.addJob(job)}
      onUpdateJob={(job) => jobStore.updateJob(job)}
      onDeleteJob={(id) => jobStore.deleteJob(id)}
      onAddStage={(id, stage) => jobStore.addStage(id, stage)}
      onRemoveStage={(id, index) => jobStore.removeStage(id, index)}
      bind:searchQuery={jobStore.searchQuery}
      bind:stageSort={jobStore.stageSort}
      bind:dateSort={jobStore.dateSort}
    />
  {/if}
</SidebarLayout>

<!--
<div class="m-4">
  {#if page === "diagrams"}
    <DiagramsPage {theme} />
  {/if}

  {#if page === "jobs"}
    <JobsPage
      jobs={jobStore.jobs}
      availableStages={jobStore.availableStages}
      bind:viewMode={viewMode}
      onAddJob={(job) => jobStore.addJob(job)}
      onUpdateJob={(job) => jobStore.updateJob(job)}
      onDeleteJob={(id) => jobStore.deleteJob(id)}
      onAddStage={(id, stage) => jobStore.addStage(id, stage)}
      onRemoveStage={(id, index) => jobStore.removeStage(id, index)}
      bind:searchQuery={jobStore.searchQuery}
      bind:stageSort={jobStore.stageSort}
      bind:dateSort={jobStore.dateSort}
    />
  {/if}
</div>
-->
