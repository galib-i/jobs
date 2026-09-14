<script lang="ts">
	import ChartAreaInteractive from "./chart-area-interactive.svelte";
	import DataTable from "./data-table.svelte";
	import SectionCards from "./section-cards.svelte";
	import { jobStore } from "$lib/jobs.svelte.js";
</script>
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<SectionCards />
					<div class="px-4 lg:px-6">
						<ChartAreaInteractive />
					</div>
					<DataTable data={jobStore.jobs} />
				</div>
			</div>
		</div>
