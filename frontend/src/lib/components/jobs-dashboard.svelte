<script>
  import JobListItem from "$lib/components/job/job-item.svelte";
  import SplitButton from "$lib/components/custom/split-button.svelte";
  import TriangleButton from "$lib/components/custom/triangle-button.svelte";
  import Icon from "$lib/components/custom/icon.svelte";
  import TextBox from "$lib/components/custom/text-box.svelte";
  import JobForm from "$lib/components/job/job-form.svelte";

  let {
    jobs,
    availableStages,
    viewMode = $bindable(),
    onAddJob,
    onUpdateJob,
    onDeleteJob,
    onAddStage,
    onRemoveStage,
    searchQuery = $bindable(),
    stageSort = $bindable(),
    dateSort = $bindable(),
  } = $props();

  let inactive = $derived(viewMode === "inactive");
  let displayJobs = $derived(jobs.filter((job) => (inactive ? !job.isActive : job.isActive)));

  function toggleStageSort() {
    if (stageSort === "none") stageSort = "asc";
    else if (stageSort === "asc") stageSort = "desc";
    else stageSort = "none";
  }

  function toggleDateSort() {
    dateSort = dateSort === "desc" ? "asc" : "desc";
  }

  let headerBorder = $derived(inactive ? "border-l border-gray-500" : "border-l border-blue-500");
</script>

<div>
  <JobForm {onAddJob} />
  <div class="flex items-center justify-between text-xs">
    <div class="flex items-center gap-4">
      <SplitButton
        left={{ label: "ACTIVE", value: "active", theme: "yellow" }}
        right={{ label: "INACTIVE", value: "inactive", theme: "yellow" }}
        bind:activeValue={viewMode}
        onchange={(val) => (viewMode = val)}
        size="sm"
      />
      <div class="flex items-center pt-1 font-bold tracking-wider text-slate-500 uppercase">
        <span class="inline-block w-6 text-right tabular-nums">{displayJobs.length}</span>
        <span class="mx-2">/</span>
        <span class="inline-block w-6 text-left tabular-nums">{jobs.length}</span>
      </div>
    </div>
    <div class="font-pixel w-64">
      <TextBox
        placeholder="Search..."
        bind:value={searchQuery}
        icon="search"
        borderOverride="border border-b-2"
      />
    </div>
  </div>
  
  <div class="relative mt-4 mb-4">
    <div
      class="grid-cols-jobs lg:grid-cols-jobs-lg relative grid rounded-2xl border-2 bg-slate-100 selection:text-white dark:bg-slate-900 {inactive ? 'border-gray-500 selection:bg-gray-500' : 'border-blue-500 selection:bg-blue-500'}"
    >
      <div
        class="font-pixel col-span-full grid grid-cols-subgrid rounded-t-[14px] border-b-2 font-bold tracking-wider text-white select-none last:rounded-b-[14px] last:border-b-0 {inactive ? 'border-gray-500 bg-gray-600' : 'border-blue-500 bg-blue-600'}"
        draggable="false"
        style="-webkit-user-drag: none;"
      >
        <div class="flex items-center px-4 py-4 pl-6 whitespace-nowrap">Company</div>
        <div class="flex items-center px-4 py-4 whitespace-nowrap {headerBorder}">Role</div>
        <div class="flex items-center px-4 py-4 whitespace-nowrap {headerBorder}">Location</div>
        <div class="flex items-center justify-between px-4 py-4 whitespace-nowrap {headerBorder}">
          <span>Stage</span>
          <div class="ml-2 transition-opacity duration-200 {stageSort !== 'none' ? 'opacity-100' : 'opacity-30'}">
            <TriangleButton
              theme="white"
              pointUp={stageSort === "asc"}
              onclick={toggleStageSort}
            />
          </div>
        </div>
        <div class="flex items-center justify-between px-4 py-4 whitespace-nowrap {headerBorder}">
          <span>Date</span>
          <div class="ml-2 opacity-100 transition-opacity duration-200">
            <TriangleButton
              theme="white"
              pointUp={dateSort === "asc"}
              onclick={toggleDateSort}
            />
          </div>
        </div>
        <div class="flex items-center px-4 py-4 whitespace-nowrap {headerBorder}">Notes</div>
        <div class="hidden items-center border-l-0 px-4 py-4 pr-6 lg:flex"></div>
      </div>
      
      {#each displayJobs as job, idx}
        <JobListItem
          {job}
          {availableStages}
          {onUpdateJob}
          {onDeleteJob}
          {onAddStage}
          {onRemoveStage}
          isLast={idx === displayJobs.length - 1}
        />
      {/each}
      
      {#if displayJobs.length === 0}
        <div class="col-span-full py-12 text-center text-slate-400">
          <p class="font-pixel text-lg">No jobs found.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
