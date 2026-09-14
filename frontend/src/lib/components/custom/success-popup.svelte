<script>
  import Button from "./button.svelte";
  import { onMount, onDestroy } from "svelte";

  let { isOpen, onclose, title = "Successfully Saved!", message } = $props();

  function handleKeyDown(e) {
    if (!isOpen) return;
    if (e.key === "Enter" || e.key === "Escape") onclose?.();
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
      class="mx-4 w-full max-w-sm rounded-xl border-2 border-green-500 bg-white p-6 text-center shadow-xl dark:bg-slate-900"
    >
      <h3 class="font-pixel mb-5 font-bold tracking-wider text-green-400 uppercase">
        {title}
      </h3>
      {#if message}
        <p class="mb-6 font-mono text-sm break-all text-slate-700 dark:text-slate-300">
          {message}
        </p>
      {/if}
      <div class="flex justify-center">
        <Button theme="green" onclick={onclose}>OK</Button>
      </div>
    </div>
  </div>
{/if}
