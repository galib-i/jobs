<script lang="ts">
	import CircleCheckFilledIcon from "@tabler/icons-svelte/icons/circle-check-filled";
	import LoaderIcon from "@tabler/icons-svelte/icons/loader";
	import InfoCircleIcon from "@tabler/icons-svelte/icons/info-circle";
	import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
	import XIcon from "@tabler/icons-svelte/icons/x";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import type { DashboardTableFeatures } from "./data-table-features.js";
	import type { Schema } from "./schemas.js";
	import type { Row } from "@tanstack/svelte-table";
	import { jobStore } from "$lib/jobs.svelte.js";

	let { row }: { row: Row<DashboardTableFeatures, Schema> } = $props();

	function handleStageChange(newStage: string) {
		jobStore.addStage(row.original.id, newStage);
	}
</script>

<div class="flex items-center gap-2">
	<Select.Root type="single" value={row.original.lastStage || "Applied"} onValueChange={handleStageChange}>
		<Select.Trigger class="h-8 w-[140px]">
		<div class="flex items-center gap-2 text-muted-foreground">
			{#if row.original.lastStageColour}
				<div class="h-2 w-2 shrink-0 rounded-full shadow-sm border border-black/10" style="background-color: {row.original.lastStageColour};"></div>
			{/if}
			<span class="text-foreground">{row.original.lastStage || "Applied"}</span>
		</div>
	</Select.Trigger>
	<Select.Content>
		{#each jobStore.availableStages as stage (stage.name)}
			<Select.Item value={stage.name}>
				<div class="flex items-center gap-2">
					<div class="h-2 w-2 shrink-0 rounded-full shadow-sm border border-black/10" style="background-color: {stage.colour};"></div>
					<span>{stage.name}</span>
				</div>
			</Select.Item>
		{/each}
	</Select.Content>
	</Select.Root>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<div class="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-default">
				<InfoCircleIcon size={16} />
			</div>
		</Tooltip.Trigger>
		<Tooltip.Content>
			<div class="flex items-center gap-2 text-xs">
				{#if row.original.formattedStages && row.original.formattedStages.length > 0}
					{#each row.original.formattedStages as stageObj, index}
						<div class="group/stage flex items-center gap-1">
							<span>{stageObj.display}</span>
							{#if stageObj.raw.toLowerCase() !== "application" && stageObj.raw.toLowerCase() !== "offer"}
								<button
									onclick={(e) => {
										e.preventDefault();
										jobStore.removeStage(row.original.id, index);
									}}
									class="text-destructive transition-opacity hover:opacity-75"
									title="Remove stage"
								>
									<XIcon class="h-3 w-3" />
								</button>
							{/if}
							{#if index < row.original.formattedStages.length - 1}
								<ChevronRightIcon class="h-3.5 w-3.5 mx-0.5 text-muted-foreground" />
							{/if}
						</div>
					{/each}
				{:else}
					<span class="text-muted-foreground">No journey yet</span>
				{/if}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</div>
