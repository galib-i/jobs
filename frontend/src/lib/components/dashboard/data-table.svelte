<script>
  import ChevronDownIcon from "@tabler/icons-svelte/icons/chevron-down";
  import LayoutColumnsIcon from "@tabler/icons-svelte/icons/layout-columns";
  import SearchIcon from "@tabler/icons-svelte/icons/search";

  import {
    FlexRender,
    createColumnHelper,
    createTable,
    createTableState,
    renderComponent,
  } from "@tanstack/svelte-table";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import * as Tabs from "$lib/components/ui/tabs/index.js";
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
  import { features } from "./data-table-features.js";
  import { jobStore } from "$lib/jobs.svelte.js";

  let { data } = $props();

  const columnHelper = createColumnHelper();

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

  const [rowSelection, setRowSelection] = createTableState({});
  const [sorting, setSorting] = createTableState([]);
  const [pagination, setPagination] = createTableState({ pageIndex: 0, pageSize: 25 });

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

  const columnNames = {
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

  let displayData = $derived(data.filter((j) => (view === "active" ? j.isActive : !j.isActive)));

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
      get pagination() {
        return pagination();
      },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  $effect(() => {
    void view;
    untrack(() => table.setPageIndex(0));
  });
</script>

<Tabs.Root bind:value={view} class="w-full flex-col justify-start gap-6">
  <div class="flex items-center justify-between px-4 lg:px-6">
    <div class="flex items-center gap-4">
      <Label for="view-selector" class="sr-only">View</Label>
      <Select.Root type="single" bind:value={view}>
        <Select.Trigger class="flex w-24 @4xl/main:hidden" size="sm" id="view-selector">
          {viewLabel}
        </Select.Trigger>
        <Select.Content>
          {#each views as view (view.id)}
            <Select.Item value={view.id}>{view.label}</Select.Item>
          {/each}
        </Select.Content>
      </Select.Root>
      <Tabs.List class="hidden items-center group-data-horizontal/tabs:h-7 @4xl/main:flex">
        {#each views as view (view.id)}
          <Tabs.Trigger value={view.id} class="px-2 text-xs">
            {view.label}
          </Tabs.Trigger>
        {/each}
      </Tabs.List>
      <div class="text-muted-foreground hidden text-xs font-medium sm:block">
        <span class="inline-block w-4 text-right">{displayData.length}</span> /
        <span>{data.length}</span> total jobs
      </div>
    </div>
    <div class="flex items-center gap-2">
      <div class="relative">
        <SearchIcon class="text-muted-foreground absolute top-1.5 left-2.5 size-4" />
        <Input
          placeholder="Search jobs..."
          class="h-7 w-48 pl-8 text-xs lg:w-64"
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
      <Table.Root class="w-full table-fixed">
        <Table.Header class="bg-secondary text-secondary-foreground sticky top-0 z-10">
          {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
            <Table.Row>
              {#each headerGroup.headers as header (header.id)}
                <Table.Head
                  colspan={header.colSpan}
                  style="width: {header.column.columnDef.size
                    ? header.column.columnDef.size + 'px'
                    : 'auto'}"
                >
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
                <Table.Row class="bg-muted/30 border-b">
                  <Table.Cell colspan={columns.length - 1} class="border-0 p-0">
                    <div class="bg-background/50 py-4 pr-2 pl-12">
                      <textarea
                        class="border-input font-inherit placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 min-h-9 w-full resize-y rounded-md border bg-transparent px-3 py-1.5 text-inherit shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Add a job description..."
                        value={row.original.description || ""}
                        onblur={(e) =>
                          jobStore.updateJob({
                            ...row.original,
                            description: e.currentTarget.value,
                          })}></textarea>
                    </div>
                  </Table.Cell>
                  <Table.Cell class="bg-background/50 border-0 p-0"></Table.Cell>
                </Table.Row>
              {/if}
            {/each}
          {:else}
            <Table.Row>
              <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
            </Table.Row>
          {/if}
        </Table.Body>
      </Table.Root>
    </div>
    <div class="flex items-center justify-end space-x-2 py-2">
      <div class="text-muted-foreground flex-1 text-xs font-medium">
        Page {(pagination()?.pageIndex ?? 0) + 1} of {Math.max(1, table.getPageCount?.() ?? 1)}
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onclick={() => table.previousPage?.()}
          disabled={!table.getCanPreviousPage?.()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onclick={() => table.nextPage?.()}
          disabled={!table.getCanNextPage?.()}
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</Tabs.Root>
