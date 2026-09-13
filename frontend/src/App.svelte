<script>
  import { jobStore } from "./lib/jobs.svelte.js";
  import Navbar from "./components/layout/Navbar.svelte";
  import JobsPage from "./pages/JobsPage.svelte";
  import DiagramsPage from "./pages/DiagramsPage.svelte";

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

<div class="m-4">
  <Navbar
    bind:activePage={page}
    bind:theme={theme}
    availableStages={jobStore.availableStages}
    addAvailableStage={(name) => jobStore.addAvailableStage(name)}
    deleteAvailableStage={(name) => jobStore.deleteAvailableStage(name)}
    resetAvailableStages={() => jobStore.resetAvailableStages()}
    wipeDatabase={() => jobStore.wipeDatabase()}
  />

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