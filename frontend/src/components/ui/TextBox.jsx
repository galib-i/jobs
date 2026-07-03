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
        <div className="top-1/2 left-3 z-10 absolute text-slate-400 dark:text-slate-400/50 -translate-y-1/2 pointer-events-none">
          <Icon size="sm" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ textShadow: "none" }}
        className={`relative w-full h-9 ${Icon ? "pl-9 pr-4" : "px-4"} py-1 text-sm font-sans placeholder:font-pixel font-normal tracking-wide transition-all duration-150 ease-out focus:outline-none ${rounded} ${border} ${colours.top}`}
        {...props}
      />
    </div>
  );
}
