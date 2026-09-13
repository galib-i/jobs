<script>
  import ExternalLink from "../ui/ExternalLink.svelte";

  let { job, onUpdate } = $props();

  let isEditingRoleLink = $state(false);
  let editRole = $state("");
  let editLink = $state("");

  function handleStartEditRoleLink() {
    editRole = job.role;
    editLink = job.link || "";
    isEditingRoleLink = true;
  }

  function handleSaveRoleLink() {
    isEditingRoleLink = false;
    if (editRole !== job.role || editLink !== (job.link || "")) {
      onUpdate({ ...job, role: editRole, link: editLink });
    }
  }

  function handleCancelRoleLink() {
    isEditingRoleLink = false;
  }

  function onBlur(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      handleSaveRoleLink();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") handleCancelRoleLink();
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSaveRoleLink();
    }
  }
</script>

{#if isEditingRoleLink}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="flex w-full min-w-0 flex-col gap-1"
    onblur={onBlur}
    onkeydown={onKeyDown}
  >
    <input
      autofocus
      type="text"
      class="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      bind:value={editRole}
      placeholder="Role"
    />
    <input
      type="url"
      class="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-blue-600 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-blue-400"
      bind:value={editLink}
      placeholder="Link"
    />
  </div>
{:else}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <span
    ondblclick={handleStartEditRoleLink}
    class="truncate border border-transparent p-1"
  >
    {job.role}
  </span>
  {#if job.link}
    <ExternalLink
      href={job.link}
      class="ml-1 truncate text-xs text-blue-400 transition-colors hover:text-blue-300"
    />
  {/if}
{/if}
