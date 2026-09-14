<script lang="ts">
	import type { DashboardTableFeatures } from "./data-table-features.js";
	import type { Schema } from "./schemas.js";
	import type { Row } from "@tanstack/svelte-table";
	import { jobStore } from "$lib/jobs.svelte.js";

	let { row }: { row: Row<DashboardTableFeatures, Schema> } = $props();

	let isEditing = $derived(jobStore.editingRowId === row.original.id);
	
	let initialRole = row.original.role || "";
	let initialLink = row.original.link || "";
	let roleValue = $state(initialRole);
	let linkValue = $state(initialLink);

	$effect(() => {
		if (isEditing) {
			roleValue = row.original.role || "";
			linkValue = row.original.link || "";
		}
	});

	function save() {
		if (roleValue !== row.original.role || linkValue !== row.original.link) {
			jobStore.updateJob({ ...row.original, role: roleValue, link: linkValue });
		}
	}
</script>

{#if isEditing}
	<div class="flex flex-col gap-1">
		<input
			type="text"
			placeholder="Role"
			class="flex h-7 w-full rounded-md border border-input bg-transparent px-2 py-1 text-inherit shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			bind:value={roleValue}
			onblur={save}
		/>
		<input
			type="url"
			placeholder="https://..."
			class="flex h-7 w-full rounded-md border border-input bg-transparent px-2 py-1 text-inherit shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
			bind:value={linkValue}
			onblur={save}
		/>
	</div>
{:else}
	{#if row.original.link}
		<a 
			href={row.original.link} 
			target="_blank" 
			rel="noopener noreferrer" 
			class="font-medium text-primary hover:underline transition-colors"
		>
			{row.original.role}
		</a>
	{:else}
		<span class="font-medium">{row.original.role}</span>
	{/if}
{/if}
