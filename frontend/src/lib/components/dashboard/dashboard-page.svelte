<script>
  import ActivityHeatmap from "$lib/components/diagrams/activity-heatmap.svelte";
  import ActivityStats from "$lib/components/diagrams/activity-stats.svelte";
  import SankeyDiagram from "$lib/components/diagrams/sankey-diagram.svelte";
  import DataTable from "./data-table.svelte";
  import { jobStore } from "$lib/jobs.svelte.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import CopyIcon from "@tabler/icons-svelte/icons/copy";
  import DownloadIcon from "@tabler/icons-svelte/icons/download";

  let sankeyRef = $state();
</script>

<div class="flex min-w-0 flex-1 flex-col">
  <div class="@container/main flex min-w-0 flex-1 flex-col gap-2">
    <div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div class="flex flex-row flex-wrap items-start gap-6 px-4 lg:px-6 xl:flex-nowrap">
        <div class="w-full shrink-0 sm:w-auto">
          <ActivityStats />
        </div>
        <div class="w-full min-w-75 flex-1">
          <ActivityHeatmap />
        </div>
        <div class="w-full shrink-0 sm:w-auto">
          <Dialog.Root>
            <Dialog.Trigger>
              {#snippet child({ props })}
                <Button variant="outline" size="sm" class="w-full sm:w-auto" {...props}
                  >View Sankey diagram</Button
                >
              {/snippet}
            </Dialog.Trigger>
            <Dialog.Content
              class="flex h-[85vh] max-h-[95vh] w-[95vw] max-w-[95vw] flex-col overflow-hidden p-0 sm:max-w-[95vw]"
            >
              <Dialog.Header class="flex shrink-0 flex-row items-start justify-between px-6 pt-6">
                <div>
                  <Dialog.Title>Sankey Diagram</Dialog.Title>
                  <Dialog.Description
                    >A visualisation of your applications' progress</Dialog.Description
                  >
                </div>
                <div class="flex items-center gap-2 pr-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    onclick={() => sankeyRef?.copy()}
                  >
                    <CopyIcon class="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="h-8 w-8"
                    onclick={() => sankeyRef?.download()}
                  >
                    <DownloadIcon class="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Dialog.Header>
              <div class="flex-1 overflow-auto px-6 pb-6">
                <SankeyDiagram bind:this={sankeyRef} />
              </div>
            </Dialog.Content>
          </Dialog.Root>
        </div>
      </div>
      <DataTable data={jobStore.jobs} />
    </div>
  </div>
</div>
