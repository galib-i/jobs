<script>
  import Button from "./button.svelte";
  import { onMount, onDestroy } from "svelte";

  let { isOpen, onclose, onconfirm, title = "Delete selected job?" } = $props();

  function handleKeyDown(e) {
    if (!isOpen) return;
    if (e.key === "Enter") onconfirm?.();
    if (e.key === "Escape") onclose?.();
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onDestroy(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div
      class="mx-4 w-full max-w-sm rounded-xl border-2 border-red-500 bg-white p-6 text-center shadow-xl dark:bg-slate-900"
    >
      <h3 class="font-pixel mb-5 font-bold tracking-wider text-red-400 uppercase">
        {title}
      </h3>
      <div class="flex justify-center gap-4">
        <Button theme="gray" onclick={onclose}>CANCEL</Button>
        <Button theme="red" onclick={onconfirm}>DELETE</Button>
      </div>
    </div>
  </div>
{/if}
