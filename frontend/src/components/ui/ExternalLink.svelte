<script>
  import { Browser } from "@wailsio/runtime";

  let { href, children, class: className = "", ...rest } = $props();

  function handleClick(e) {
    e.preventDefault();
    let url = href;
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
    Browser.OpenURL(url).catch((err) => {
      console.error("Failed to open link:", err);
    });
  }
</script>

<a {href} onclick={handleClick} class={className} {...rest}>
  {@render children?.()}
  <sup class="font-semibold">[↗]</sup>
</a>
