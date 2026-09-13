<script>
  import { positionStyles, defaultPositionStyle } from "./styles";

  const colourThemes = {
    blue: {
      bottom: "bg-blue-800",
      top: "bg-blue-500 border-blue-800 group-hover:bg-blue-400",
      active: "bg-blue-600",
    },
    red: {
      bottom: "bg-red-800",
      top: "bg-red-500 border-red-800 group-hover:bg-red-400",
      active: "bg-red-600",
    },
    yellow: {
      bottom: "bg-yellow-800",
      top: "bg-yellow-500 border-yellow-800 group-hover:bg-yellow-400",
      active: "bg-yellow-600",
    },
    green: {
      bottom: "bg-green-800",
      top: "bg-green-500 border-green-800 group-hover:bg-green-400",
      active: "bg-green-600",
    },
    gray: {
      bottom: "bg-gray-600",
      top: "bg-gray-400 border-gray-600 group-hover:bg-gray-300",
      active: "bg-gray-500",
    },
  };

  const sizeStyles = {
    sm: {
      height: "h-6",
      padding: { icon: "py-0.5 px-1", default: "px-4 py-0.5" },
      shadow: "translate-y-1",
      margin: "mb-1",
    },
    md: {
      height: "h-9",
      padding: { icon: "py-1 px-2", default: "px-8 py-1" },
      shadow: "translate-y-1.5",
      margin: "mb-1.5",
    },
  };

  let {
    children,
    onclick,
    class: className = "",
    type = "button",
    theme = "gray",
    isIcon = false,
    isActive = false,
    position = "single",
    size = "md",
  } = $props();

  let colours = $derived(colourThemes[theme] ?? colourThemes.gray);
  let posStyle = $derived(positionStyles[position] ?? defaultPositionStyle);
  let s = $derived(sizeStyles[size] ?? sizeStyles.md);
  let padding = $derived(isIcon ? s.padding.icon : s.padding.default);

  let transformStyles = $derived(
    isActive
      ? `${s.shadow} border-b cursor-default ${colours.active}`
      : "group-hover:-translate-y-0.5 group-active:translate-y-1"
  );
</script>

<button
  {type}
  {onclick}
  class="group relative inline-block cursor-pointer focus:outline-none {s.margin} {className}"
>
  <!-- Bottom shadow -->
  <span class="absolute inset-0 {s.shadow} {posStyle.rounded} {colours.bottom}"></span>

  <!-- Top face -->
  <span
    class="font-pixel relative flex items-center justify-center {s.height} {padding} font-bold tracking-wide text-white transition-all duration-150 ease-out {posStyle.rounded} {posStyle.border} {colours.top} {transformStyles}"
  >
    {@render children?.()}
  </span>
</button>
