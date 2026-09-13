<script>
  let {
    initialValue = "",
    onsave,
    class: className = "",
    editing = false,
    onEditingChange,
  } = $props();

  let isEditing = $state(editing);
  let value = $state(initialValue);
  let textareaRef = $state();

  $effect(() => {
    isEditing = editing;
  });

  $effect(() => {
    if (isEditing && textareaRef) {
      textareaRef.style.height = "auto";
      textareaRef.style.height = `${textareaRef.scrollHeight}px`;
    }
  });

  function updateEditing(val) {
    isEditing = val;
    onEditingChange?.(val);
  }

  function handleSave() {
    updateEditing(false);
    if (value !== initialValue && onsave) {
      onsave(value);
    }
  }

  function handleCancel() {
    updateEditing(false);
    value = initialValue;
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  }
</script>

{#if isEditing}
  <textarea
    bind:this={textareaRef}
    bind:value
    autofocus
    onblur={handleSave}
    onkeydown={handleKeyDown}
    rows="1"
    class="w-full resize-none overflow-hidden rounded border border-slate-300 bg-white p-1 font-[inherit] text-[length:inherit] text-slate-800 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 {className}"
  ></textarea>
{:else}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <span
    ondblclick={() => updateEditing(true)}
    class="border border-transparent p-1 {className}"
  >
    {value}
  </span>
{/if}
