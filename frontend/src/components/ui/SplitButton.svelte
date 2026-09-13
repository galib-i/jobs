<script>
  import Button from "./Button.svelte";

  let {
    left,
    right,
    activeValue,
    onchange,
    theme = "blue",
    size = "md",
  } = $props();
</script>

<div class="flex items-center select-none">
  <Button
    position="left"
    theme={left.theme || theme}
    {size}
    isActive={activeValue === left.value}
    onclick={() => onchange?.(left.value)}
  >
    {left.label}
  </Button>
  <Button
    position="right"
    theme={right.theme || theme}
    {size}
    isActive={activeValue === right.value}
    onclick={() => onchange?.(right.value)}
  >
    {right.label}
  </Button>
</div>
