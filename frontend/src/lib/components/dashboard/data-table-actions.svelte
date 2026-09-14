<script lang="ts">
	import DotsVerticalIcon from "@tabler/icons-svelte/icons/dots-vertical";
	import CheckIcon from "@tabler/icons-svelte/icons/check";
	import XIcon from "@tabler/icons-svelte/icons/x";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { Row } from "@tanstack/svelte-table";
	import { jobStore } from "$lib/jobs.svelte.js";
	
	let { row }: { row: Row<any, any> } = $props();

	let isEditing = $derived(jobStore.editingRowId === row.original.id);
</script>

{#if isEditing}
	<div class="flex items-center gap-1">
		<Button 
			variant="ghost" 
			size="icon" 
			class="flex size-7 text-green-500 hover:text-green-600 hover:bg-green-500/10" 
			onclick={() => jobStore.editingRowId = null}
			title="Save changes"
		>
			<CheckIcon class="h-4 w-4" />
			<span class="sr-only">Save editing</span>
		</Button>
		<Button 
			variant="ghost" 
			size="icon" 
			class="flex size-7 text-destructive hover:text-destructive hover:bg-destructive/10" 
			onmousedown={(e) => {
				// We use mousedown so it fires before the input blur event, 
				// allowing us to potentially cancel without saving if we implement a global cancel flag.
				// For now it just cleanly closes the edit mode.
				e.preventDefault();
				jobStore.editingRowId = null;
			}}
			title="Close editing"
		>
			<XIcon class="h-4 w-4" />
			<span class="sr-only">Cancel editing</span>
		</Button>
	</div>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class="flex size-8 text-muted-foreground data-[state=open]:bg-muted">
			{#snippet child({ props })}
				<Button variant="ghost" size="icon" {...props}>
					<DotsVerticalIcon />
					<span class="sr-only">Open menu</span>
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end" class="w-32">
			<DropdownMenu.Item onclick={() => jobStore.editingRowId = row.original.id}>
				Edit
			</DropdownMenu.Item>
			<DropdownMenu.Item>Favorite</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item variant="destructive" onclick={() => jobStore.deleteJob(row.original.id)}>Delete</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
