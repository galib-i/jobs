<script lang="ts" generics="TData, TValue">
  import type { Column } from "@tanstack/table-core";
  import ArrowDownIcon from "@tabler/icons-svelte/icons/arrow-down";
  import ArrowUpIcon from "@tabler/icons-svelte/icons/arrow-up";
  import ArrowsSortIcon from "@tabler/icons-svelte/icons/arrows-sort";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";

  let {
    column,
    title,
    class: className,
  }: {
    column: Column<TData, TValue>;
    title: string;
    class?: string;
  } = $props();
</script>

{#if !column.getCanSort()}
  <div class={cn("text-muted-foreground", className)}>{title}</div>
{:else}
  <div class={cn("flex items-center space-x-2", className)}>
    <Button
      variant="ghost"
      size="sm"
      class="-ml-3 h-8 w-full justify-between"
      onclick={() => column.toggleSorting(undefined, true)}
    >
      <span>{title}</span>
      {#if column.getIsSorted() === "desc"}
        <ArrowDownIcon class="ml-2 size-4" />
      {:else if column.getIsSorted() === "asc"}
        <ArrowUpIcon class="ml-2 size-4" />
      {:else}
        <ArrowsSortIcon class="ml-2 size-4 opacity-50" />
      {/if}
    </Button>
  </div>
{/if}
