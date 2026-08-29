import { positionStyles, defaultPositionStyle } from "./styles";

const colourThemes = {
  dark: {
    top: "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-400/50 focus:bg-slate-50 dark:focus:bg-slate-700 focus:border-blue-500 selection:bg-blue-500 selection:text-white",
  },
};

export function TextBox({
  value,
  onChange,
  placeholder = "",
  className = "",
  type = "text",
  theme = "dark",
  position = "single",
  roundedOverride,
  borderOverride,
  icon: Icon,
  ...props
}) {
  const colours = colourThemes[theme] ?? colourThemes.dark;
  const posStyle = positionStyles[position] ?? defaultPositionStyle;
  const rounded = roundedOverride ?? posStyle.rounded;
  const border = borderOverride ?? posStyle.border;

  return (
    <div className={`relative inline-block ${className}`}>
      {Icon && (
        <div className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-slate-400 dark:text-slate-400/50">
          <Icon size="sm" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ textShadow: "none" }}
        className={`relative h-9 w-full ${Icon ? "pr-4 pl-9" : "px-4"} placeholder:font-pixel py-1 font-sans text-sm font-normal tracking-wide transition-all duration-150 ease-out focus:outline-none ${rounded} ${border} ${colours.top}`}
        {...props}
      />
    </div>
  );
}
