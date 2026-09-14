<script lang="ts">
	import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
	import ChevronLeftIcon from "@tabler/icons-svelte/icons/chevron-left";
	import ChevronRightIcon from "@tabler/icons-svelte/icons/chevron-right";
	import ChevronsLeftIcon from "@tabler/icons-svelte/icons/chevrons-left";
	import ChevronsRightIcon from "@tabler/icons-svelte/icons/chevrons-right";
	import LayoutColumnsIcon from "@tabler/icons-svelte/icons/layout-columns";
	import SearchIcon from "@tabler/icons-svelte/icons/search";

	import {
		FlexRender,
		type RowSelectionState,
		type SortingState,
		createColumnHelper,
		createTable,
		createTableState,
		renderComponent,
		type Row,
	} from "@tanstack/svelte-table";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import * as Select from "$lib/components/ui/select/index.js";
	import * as Table from "$lib/components/ui/table/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import DataTableActions from "./data-table-actions.svelte";

	import DataTableStatus from "./data-table-status.svelte";
	import DataTableNotes from "./data-table-notes.svelte";
	import DataTableRole from "./data-table-role.svelte";
	import DataTableEditableCell from "./data-table-editable-cell.svelte";
	import DataTableExpander from "./data-table-expander.svelte";
	import DataTableColumnHeader from "./data-table-column-header.svelte";
	import EditableInput from "$lib/components/custom/editable-input.svelte";
	import { features, type DashboardTableFeatures } from "./data-table-features.js";
	import { jobStore } from "$lib/jobs.svelte.js";
	import type { Schema } from "./schemas.js";

	let { data }: { data: Schema[] } = $props();

	const columnHelper = createColumnHelper<DashboardTableFeatures, Schema>();

	const columns = columnHelper.columns([
		columnHelper.display({
			id: "expander",
			size: 30,
			cell: ({ row }) => renderComponent(DataTableExpander, { row }),
		}),
		columnHelper.accessor("company", {
			header: ({ column }) => renderComponent(DataTableColumnHeader, { title: "Company", column }),
			enableHiding: false,
			size: 150,
			cell: ({ row }) =>
				renderComponent(DataTableEditableCell, {
					row,
					field: "company",
					initialValue: row.original.company,
				}),
		}),
		columnHelper.accessor("role", {
			header: ({ column }) => renderComponent(DataTableColumnHeader, { title: "Role", column }),
			size: 200,
			cell: ({ row }) => renderComponent(DataTableRole, { row }),
		}),
		columnHelper.accessor("location", {
			header: ({ column }) => renderComponent(DataTableColumnHeader, { title: "Location", column }),
			size: 150,
			cell: ({ row }) =>
				renderComponent(DataTableEditableCell, {
					row,
					field: "location",
					initialValue: row.original.location,
				}),
		}),
		columnHelper.accessor("lastStage", {
			header: ({ column }) => renderComponent(DataTableColumnHeader, { title: "Stage", column }),
			size: 200,
			enableHiding: false,
			cell: ({ row }) => renderComponent(DataTableStatus, { row }),
		}),
		columnHelper.accessor("formattedDate", {
			header: ({ column }) => renderComponent(DataTableColumnHeader, { title: "Date", column }),
			size: 120,
		}),
		columnHelper.accessor("notes", {
			header: "Notes",
			size: 350,
			cell: ({ row }) => renderComponent(DataTableNotes, { row }),
		}),
		columnHelper.display({
			id: "actions",
			size: 50,
			cell: ({ row }) => renderComponent(DataTableActions, { row }),
		}),
	]);

	// Keep row selection and sorting outside the table so the rest of the app can read or update it.
	const [rowSelection, setRowSelection] = createTableState<RowSelectionState>({});
	const [sorting, setSorting] = createTableState<SortingState>([]);

	// v9 manages the rest of its state internally — reads like
	// `table.getRowModel()` are rune-reactive, so no `$state` mirrors are needed.
	let views = $derived([
		{
			id: "active",
			label: "Active",
			badge: data.filter((j) => j.isActive).length,
		},
		{
			id: "inactive",
			label: "Inactive",
			badge: data.filter((j) => !j.isActive).length,
		},
	]);

	const columnNames: Record<string, string> = {
		expander: "Description",
		company: "Company",
		role: "Role",
		location: "Location",
		lastStage: "Stage",
		formattedDate: "Date",
		notes: "Notes",
	};

	let view = $state("active");
	let viewLabel = $derived(views.find((v) => view === v.id)?.label ?? "Active");
	
	let displayData = $derived(data.filter((j) => view === "active" ? j.isActive : !j.isActive));

	const table = createTable({
		features,
		get data() {
			return displayData;
		},
		columns,
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		autoResetPageIndex: false,
		state: {
			get rowSelection() {
				return rowSelection();
			},
			get sorting() {
				return sorting();
			},
		},
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
	});



</script>

<Tabs.Root bind:value={view} class="w-full flex-col justify-start gap-6">
	<div class="flex items-center justify-between px-4 lg:px-6">
		<div class="flex items-center gap-4">
			<Label for="view-selector" class="sr-only">View</Label>
			<Select.Root type="single" bind:value={view}>
			<Select.Trigger class="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
				{viewLabel}
			</Select.Trigger>
			<Select.Content>
				{#each views as view (view.id)}
					<Select.Item value={view.id}>{view.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Tabs.List
			class="hidden group-data-horizontal/tabs:h-7 items-center **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:px-1 @4xl/main:flex"
		>
			{#each views as view (view.id)}
				<Tabs.Trigger value={view.id} class="px-2 text-xs">
					{view.label}
					{#if view.badge > 0}
						<Badge variant="secondary">{view.badge}</Badge>
					{/if}
				</Tabs.Trigger>
			{/each}
		</Tabs.List>
		<div class="hidden text-xs font-medium text-muted-foreground sm:block">
			{data.length} total jobs
		</div>
		</div>
		<div class="flex items-center gap-2">
			<div class="relative">
				<SearchIcon class="absolute left-2.5 top-1.5 size-4 text-muted-foreground" />
				<Input
					placeholder="Search jobs..."
					class="h-7 w-48 lg:w-64 pl-8 text-xs"
					bind:value={jobStore.searchQuery}
				/>
			</div>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button variant="outline" size="sm" class="h-7 text-xs" {...props}>
							<LayoutColumnsIcon class="size-4" />
							<span>View</span>
							<ChevronDownIcon class="size-4" />
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="w-56">
					{#each table
						.getAllColumns()
						.filter((col) => col.id !== "actions" && col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							checked={column.getIsVisible()}
							onCheckedChange={(value) => column.toggleVisibility(!!value)}
						>
							{columnNames[column.id] || column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
	<div class="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
		<div class="overflow-hidden rounded-lg border">
			<Table.Root class="table-fixed w-full">
					<Table.Header class="sticky top-0 z-10 bg-secondary text-secondary-foreground">
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head colspan={header.colSpan} style="width: {header.column.columnDef.size ? header.column.columnDef.size + 'px' : 'auto'}">
										{#if !header.isPlaceholder}
											<FlexRender {header} />
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body class="**:data-[slot=table-cell]:first:w-8">
						{#if table.getRowModel().rows?.length}
							{#each table.getRowModel().rows as row (row.id)}
								<Table.Row data-state={row.getIsSelected() && "selected"} class="even:bg-muted/30">
									{#each row.getVisibleCells() as cell (cell.id)}
										<Table.Cell>
											<FlexRender {cell} />
										</Table.Cell>
									{/each}
								</Table.Row>
								{#if jobStore.expandedRowIds.has(row.original.id)}
									<Table.Row class="border-b bg-muted/30">
										<Table.Cell colspan={columns.length - 1} class="p-0 border-0">
											<div class="py-4 pl-12 pr-2 bg-background/50">
												<textarea
													class="flex h-9 min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1.5 font-inherit text-inherit shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
													placeholder="Add a job description..."
													value={row.original.description || ""}
													onblur={(e) => jobStore.updateJob({ ...row.original, description: e.currentTarget.value })}
												></textarea>
											</div>
										</Table.Cell>
										<Table.Cell class="p-0 border-0 bg-background/50"></Table.Cell>
									</Table.Row>
								{/if}
							{/each}
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center">
									No results.
								</Table.Cell>
							</Table.Row>
						{/if}
					</Table.Body>
				</Table.Root>
		</div>
	</div>
</Tabs.Root>

