<script lang="ts">
	import TimeDiagram from "$lib/components/diagrams/time-diagram.svelte";
	import ActivityHeatmap from "$lib/components/diagrams/activity-heatmap.svelte";
	import ActivityStats from "$lib/components/diagrams/activity-stats.svelte";
	import DataTable from "./data-table.svelte";
	import { jobStore } from "$lib/jobs.svelte.js";
</script>
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div class="px-4 lg:px-6 flex flex-col xl:flex-row gap-6 items-start">
						<ActivityStats />
						<ActivityHeatmap />
						<TimeDiagram />
					</div>
					<DataTable data={jobStore.jobs} />
				</div>
			</div>
		</div>
