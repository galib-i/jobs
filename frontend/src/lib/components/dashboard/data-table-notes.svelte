<script lang="ts">
	import type { DashboardTableFeatures } from "./data-table-features.js";
	import type { Schema } from "./schemas.js";
	import type { Row } from "@tanstack/svelte-table";
	import { jobStore } from "$lib/jobs.svelte.js";

	let { row }: { row: Row<DashboardTableFeatures, Schema> } = $props();
	
	let initialNotes = row.original.notes || "";
	let notesValue = $state(initialNotes);
	
	function handleBlur() {
		if (row.original.notes !== notesValue) {
			jobStore.updateJob({ ...row.original, notes: notesValue });
		}
	}
</script>

<textarea
	class="flex h-9 min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 font-inherit text-inherit shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
	placeholder="Add notes..."
	bind:value={notesValue}
	onblur={handleBlur}
></textarea>
