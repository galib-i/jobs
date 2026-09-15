<script>
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  let { isOpen, onclose, title = "Successfully Saved!", message } = $props();
</script>

<AlertDialog.Root
  open={isOpen}
  onOpenChange={(open) => {
    if (!open) onclose?.();
  }}
>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>{title}</AlertDialog.Title>
      {#if message}
        <AlertDialog.Description class="wrap-break-word">
          {message}
        </AlertDialog.Description>
      {/if}
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Action onclick={onclose}>OK</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
