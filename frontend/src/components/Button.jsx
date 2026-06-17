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
};

export function Button({
  children,
  onClick,
  className = "",
  type = "button",
  theme = "blue",
  isIcon = false,
  isActive = false,
  position = "single",
}) {
  const activeColours = colourThemes[theme] || colourThemes.blue;

  const positionStyles = {
    left: { rounded: "rounded-l-xl rounded-r-none", border: "border-2 border-r" },
    middle: { rounded: "rounded-none", border: "border-2 border-x" },
    right: { rounded: "rounded-r-xl rounded-l-none", border: "border-2 border-l" },
    single: { rounded: "rounded-xl", border: "border-2" },
  }[position] || { rounded: "rounded-xl", border: "border-2" };

  const transformStyles = isActive
    ? `translate-y-1.5 border-b cursor-default ${activeColours.active}`
    : `group-hover:-translate-y-0.5 group-active:translate-y-1`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative inline-block group focus:outline-none cursor-pointer mb-1.5 ${className}`}
    >
      {/* Bottom shadow */}
      <span
        className={`absolute inset-0 translate-y-1.5 ${positionStyles.rounded} ${activeColours.bottom}`}
      ></span>

      {/* Top face */}
      <span
        className={`relative flex items-center justify-center h-9 ${
          isIcon ? "py-1 px-2" : "px-8 py-1"
        } text-white font-bold tracking-wide transition-all duration-150 ease-out ${
          positionStyles.rounded
        } ${positionStyles.border} ${activeColours.top} ${transformStyles}`}
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
}) {
  return (
    <div className="flex items-center select-none">
      <Button
        position="left"
        theme={theme}
        isActive={activeValue === left.value}
        onClick={() => onChange(left.value)}
      >
        {left.label}
      </Button>
      <Button
        position="right"
        theme={theme}
        isActive={activeValue === right.value}
        onClick={() => onChange(right.value)}
      >
        {right.label}
      </Button>
    </div>
  );
}
