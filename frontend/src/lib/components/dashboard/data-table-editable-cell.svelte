<script lang="ts">
	import type { DashboardTableFeatures } from "./data-table-features.js";
	import type { Schema } from "./schemas.js";
	import type { Row } from "@tanstack/svelte-table";
	import { jobStore } from "$lib/jobs.svelte.js";

	let { row, field }: { row: Row<DashboardTableFeatures, Schema>; field: keyof Schema } = $props();

	let isEditing = $derived(jobStore.editingRowId === row.original.id);
	
	// Track local input state
	let initialValue = row.original[field] || "";
	let value = $state(initialValue);

	// Keep local state in sync when entering edit mode
	$effect(() => {
		if (isEditing) {
			value = row.original[field] || "";
		}
	});

	function save() {
		if (value !== row.original[field]) {
			jobStore.updateJob({ ...row.original, [field]: value });
		}
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Enter") {
			save();
			// We don't automatically close edit mode on Enter for individual cells, 
			// because they might want to edit other cells in the row.
			// The user can click "Stop Editing" when done, or it can be left as is.
		}
	}
</script>

{#if isEditing}
	<input
		type="text"
		class="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-inherit shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
		bind:value
		onblur={save}
		onkeydown={handleKeydown}
	/>
{:else}
	<span>{row.original[field]}</span>
{/if}
