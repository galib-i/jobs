<script>
  let {
    onclick,
    theme = "blue",
    pointUp = false,
    class: className = "",
  } = $props();

  const textThemes = {
    blue: { top: "text-blue-500", bottom: "text-blue-800" },
    white: { top: "text-white", bottom: "text-slate-300" },
  };

  let colours = $derived(textThemes[theme] || textThemes.blue);
</script>

<button
  type="button"
  {onclick}
  aria-label={pointUp ? "Sort ascending" : "Sort descending"}
  class="group relative block cursor-pointer focus:outline-none {className}"
>
  <svg
    width="12"
    height="10"
    viewBox="0 0 7 6"
    class="overflow-visible"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class={colours.bottom} fill="currentColor">
      <polygon points={pointUp ? "3.5,0 7,4 7,6 0,6 0,4" : "0,0 7,0 7,2 3.5,6 0,2"} />
    </g>
    <g
      class="{colours.top} transition-transform duration-150 ease-out group-hover:translate-y-[-0.5px] group-active:translate-y-px"
      fill="currentColor"
    >
      <polygon points={pointUp ? "3.5,0 7,4 0,4" : "0,0 7,0 3.5,4"} />
    </g>
  </svg>
</button>
