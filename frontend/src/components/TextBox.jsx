import { positionStyles, defaultPositionStyle } from "./styles";

const colourThemes = {
  blue: {
    top: "bg-slate-800 border-blue-500 text-blue-200 placeholder-blue-400/50 focus:bg-slate-700",
  },
  red: {
    top: "bg-slate-800 border-red-500 text-red-200 placeholder-red-400/50 focus:bg-slate-700",
  },
  yellow: {
    top: "bg-slate-800 border-yellow-500 text-yellow-200 placeholder-yellow-500/50 focus:bg-slate-700",
  },
  green: {
    top: "bg-slate-800 border-green-500 text-green-200 placeholder-green-400/50 focus:bg-slate-700",
  },
  gray: {
    top: "bg-slate-800 border-slate-500 text-slate-200 placeholder-slate-400/50 focus:bg-slate-700",
  },
  dark: {
    top: "bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-400/50 focus:bg-slate-700 focus:border-blue-500 selection:bg-blue-500 selection:text-white",
  },
};

export function TextBox({
  value,
  onChange,
  placeholder = "",
  className = "",
  type = "text",
  theme = "blue",
  position = "single",
  roundedOverride,
  borderOverride,
  ...props
}) {
  const colours = colourThemes[theme] ?? colourThemes.blue;
  const posStyle = positionStyles[position] ?? defaultPositionStyle;
  const rounded = roundedOverride ?? posStyle.rounded;
  const border = borderOverride ?? posStyle.border;

  return (
    <div className={`relative inline-block ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ textShadow: "none" }}
        className={`relative w-full h-9 px-4 py-1 text-sm font-sans placeholder:font-pixel font-normal tracking-wide transition-all duration-150 ease-out focus:outline-none ${rounded} ${border} ${colours.top}`}
        {...props}
      />
    </div>
  );
}
