<script>
  import { jobStore } from "$lib/jobs.svelte.js";

  let { row } = $props();

  let isEditing = $derived(jobStore.editingRowId === row.original.id);

  let roleValue = $state("");
  let linkValue = $state("");

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
      class="border-input focus-visible:ring-ring flex h-7 w-full rounded-md border bg-transparent px-2 py-1 text-inherit shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
      bind:value={roleValue}
      onblur={save}
    />
    <input
      type="url"
      placeholder="https://..."
      class="border-input focus-visible:ring-ring flex h-7 w-full rounded-md border bg-transparent px-2 py-1 text-inherit shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
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
      class="text-primary font-medium transition-colors hover:underline"
    >
      {row.original.role}
    </a>
  {:else}
    <span class="font-medium">{row.original.role}</span>
  {/if}
{/if}
