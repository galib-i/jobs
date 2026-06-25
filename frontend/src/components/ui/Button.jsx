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

export function Button({
  children,
  onClick,
  className = "",
  type = "button",
  theme = "gray",
  isIcon = false,
  isActive = false,
  position = "single",
  size = "md",
}) {
  const colours = colourThemes[theme] ?? colourThemes.gray;
  const posStyle = positionStyles[position] ?? defaultPositionStyle;
  const s = sizeStyles[size] ?? sizeStyles.md;
  const padding = isIcon ? s.padding.icon : s.padding.default;

  const transformStyles = isActive
    ? `${s.shadow} border-b cursor-default ${colours.active}`
    : "group-hover:-translate-y-0.5 group-active:translate-y-1";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative inline-block group focus:outline-none cursor-pointer ${s.margin} ${className}`}
    >
      {/* Bottom shadow */}
      <span
        className={`absolute inset-0 ${s.shadow} ${posStyle.rounded} ${colours.bottom}`}
      ></span>

      {/* Top face */}
      <span
        className={`relative flex items-center justify-center font-pixel ${s.height} ${padding} text-white font-bold tracking-wide transition-all duration-150 ease-out ${posStyle.rounded} ${posStyle.border} ${colours.top} ${transformStyles}`}
      >
        {children}
      </span>
    </button>
  );
}

export function SplitButton({
  left,
  right,
  activeValue,
  onChange,
  theme = "blue",
  size = "md",
}) {
  return (
    <div className="flex items-center select-none">
      <Button
        position="left"
        theme={left.theme || theme}
        size={size}
        isActive={activeValue === left.value}
        onClick={() => onChange(left.value)}
      >
        {left.label}
      </Button>
      <Button
        position="right"
        theme={right.theme || theme}
        size={size}
        isActive={activeValue === right.value}
        onClick={() => onChange(right.value)}
      >
        {right.label}
      </Button>
    </div>
  );
}

export function TriangleButton({ onClick, theme = "blue", className = "" }) {
  const textThemes = {
    blue: { top: "text-blue-500", bottom: "text-blue-800" },
  };
  const colours = textThemes[theme] || textThemes.blue;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative group focus:outline-none cursor-pointer block ${className}`}
    >
      <svg
        width="14"
        height="12"
        viewBox="0 0 7 6"
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <g className={colours.bottom} fill="currentColor">
          <rect x="0" y="2" width="7" height="1" />
          <rect x="1" y="3" width="5" height="1" />
          <rect x="2" y="4" width="3" height="1" />
          <rect x="3" y="5" width="1" height="1" />
        </g>
        <g
          className={`${colours.top} group-hover:translate-y-[-0.5px] group-active:translate-y-px transition-transform duration-150 ease-out`}
          fill="currentColor"
        >
          <rect x="0" y="0" width="7" height="1" />
          <rect x="1" y="1" width="5" height="1" />
          <rect x="2" y="2" width="3" height="1" />
          <rect x="3" y="3" width="1" height="1" />
        </g>
      </svg>
    </button>
  );
}
