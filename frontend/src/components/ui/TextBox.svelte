<script>
  import Icon from "./Icon.svelte";
  import { positionStyles, defaultPositionStyle } from "./styles";

  const colourThemes = {
    dark: {
      top: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400/50 focus:bg-slate-50 dark:focus:bg-slate-700 focus:border-blue-500 selection:bg-blue-500 selection:text-white",
    },
  };

  let {
    value = $bindable(""),
    onchange,
    oninput,
    placeholder = "",
    class: className = "",
    type = "text",
    theme = "dark",
    position = "single",
    roundedOverride,
    borderOverride,
    icon,
    ...rest
  } = $props();

  let colours = $derived(colourThemes[theme] ?? colourThemes.dark);
  let posStyle = $derived(positionStyles[position] ?? defaultPositionStyle);
  let rounded = $derived(roundedOverride ?? posStyle.rounded);
  let border = $derived(borderOverride ?? posStyle.border);
</script>

<div class="relative inline-block {className}">
  {#if icon}
    <div
      class="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-slate-400 dark:text-slate-400/50"
    >
      <Icon name={icon} class="w-4 h-4" />
    </div>
  {/if}
  <input
    {type}
    bind:value
    {onchange}
    {oninput}
    {placeholder}
    style="text-shadow: none;"
    class="relative h-9 w-full {icon ? 'pr-4 pl-9' : 'px-4'} py-1 font-sans text-sm font-normal tracking-wide transition-all duration-150 ease-out focus:outline-none placeholder:font-pixel {rounded} {border} {colours.top}"
    {...rest}
  />
</div>
