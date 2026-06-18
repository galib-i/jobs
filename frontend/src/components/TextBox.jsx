import { positionStyles, defaultPositionStyle } from "./styles";

const colourThemes = {
  blue: {
    bottom: "bg-blue-800",
    top: "bg-white border-blue-800 text-blue-800 placeholder-blue-400 focus:bg-blue-50",
  },
  red: {
    bottom: "bg-red-800",
    top: "bg-white border-red-800 text-red-800 placeholder-red-400 focus:bg-red-50",
  },
  yellow: {
    bottom: "bg-yellow-800",
    top: "bg-white border-yellow-800 text-yellow-900 placeholder-yellow-600 focus:bg-yellow-50",
  },
  green: {
    bottom: "bg-green-800",
    top: "bg-white border-green-800 text-green-800 placeholder-green-400 focus:bg-green-50",
  },
  gray: {
    bottom: "bg-gray-800",
    top: "bg-white border-gray-800 text-gray-800 placeholder-gray-400 focus:bg-gray-100",
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
  const activeColours = colourThemes[theme] || colourThemes.blue;

  const posStyle = positionStyles[position] || defaultPositionStyle;

  const roundedClasses = roundedOverride ?? posStyle.rounded;
  const borderClasses = borderOverride ?? posStyle.border;

  return (
    <div className={`relative inline-block ${className}`}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`relative w-full h-9 px-4 py-1 font-bold tracking-wide transition-all duration-150 ease-out focus:outline-none ${roundedClasses} ${borderClasses} ${activeColours.top}`}
        {...props}
      />
    </div>
  );
}
