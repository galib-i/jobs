<script>
  let {
    initialValue = "",
    onsave,
    class: className = "",
    editing = false,
    onEditingChange,
  } = $props();

  // svelte-ignore state_referenced_locally
  let isEditing = $state(editing);
  // svelte-ignore state_referenced_locally
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
  <!-- svelte-ignore a11y_autofocus -->
  <textarea
    bind:this={textareaRef}
    bind:value
    autofocus
    onblur={handleSave}
    onkeydown={handleKeyDown}
    rows="1"
    class="w-full resize-none overflow-hidden rounded-md border border-transparent bg-transparent p-1 focus-visible:border-input focus-visible:bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground {className}"
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
