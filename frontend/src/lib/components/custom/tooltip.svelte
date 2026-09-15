<script>
  let { text, content, children, class: className = "" } = $props();
  let show = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="relative flex items-center {className}"
  onmouseenter={() => (show = true)}
  onmouseleave={() => (show = false)}
>
  {@render children?.()}
  {#if show && (text || content)}
    <div
      class="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 scale-105 transform rounded border border-slate-300 bg-white px-6 py-4 text-sm whitespace-nowrap text-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      {#if typeof content === "function"}
        {@render content()}
      {:else}
        {content || text}
      {/if}
    </div>
  {/if}
</div>
