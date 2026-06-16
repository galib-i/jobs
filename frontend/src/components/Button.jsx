const colourThemes = {
  blue: {
    bottom: "bg-blue-800",
    top: "bg-blue-500 border-blue-800 group-hover:bg-blue-400",
  },
  red: {
    bottom: "bg-red-800",
    top: "bg-red-500 border-red-800 group-hover:bg-red-400",
  },
  yellow: {
    bottom: "bg-yellow-800",
    top: "bg-yellow-500 border-yellow-800 group-hover:bg-yellow-400",
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
}) {
  const activeColours = colourThemes[theme] || colourThemes.blue;

  const transformStyles = isActive
    ? "translate-y-1.5 cursor-default"
    : "group-hover:-translate-y-0.5 group-active:translate-y-1";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative inline-block group focus:outline-none ${className}`}
    >
      {/* Bottom 3D Layer */}
      <span
        className={`absolute inset-0 rounded-xl translate-y-1.5 ${activeColours.bottom}`}
      ></span>

      {/* Top Interactive Layer */}
      <span
        className={`relative flex items-center justify-center h-9 ${
          isIcon ? "py-1 px-2" : "px-8 py-1"
        } text-white font-bold tracking-wide rounded-xl border-2 transition-all duration-150 ease-out ${transformStyles} ${activeColours.top}`}
      >
        {children}
      </span>
    </button>
  );
}

export function SplitButton({ left, right, activeValue, onChange }) {
  return (
    <div className="flex items-center select-none">
      {/* Left */}
      <button
        type="button"
        onClick={() => onChange(left.value)}
        className="relative inline-block group focus:outline-none"
      >
        <span
          className={`absolute inset-0 rounded-l-xl rounded-r-none translate-y-1.5 bg-blue-800`}
        ></span>
        <span
          className={`relative flex items-center justify-center h-9 px-8 py-1 text-white font-bold tracking-wide rounded-l-xl rounded-r-none border-2 border-r border-blue-800 transition-all duration-150 ease-out bg-blue-500 ${
            activeValue === left.value
              ? "translate-y-1.5 bg-blue-600 border-b cursor-default"
              : "group-hover:-translate-y-0.5 group-hover:bg-blue-400 group-active:translate-y-1"
          }`}
        >
          {left.label}
        </span>
      </button>

      {/* Right */}
      <button
        type="button"
        onClick={() => onChange(right.value)}
        className="relative inline-block group focus:outline-none"
      >
        <span
          className={`absolute inset-0 rounded-r-xl rounded-l-none translate-y-1.5 bg-blue-800`}
        ></span>
        <span
          className={`relative flex items-center justify-center h-9 px-8 py-1 text-white font-bold tracking-wide rounded-r-xl rounded-l-none border-2 border-l border-blue-800 transition-all duration-150 ease-out bg-blue-500 ${
            activeValue === right.value
              ? "translate-y-1.5 bg-blue-600 border-b cursor-default"
              : "group-hover:-translate-y-0.5 group-hover:bg-blue-400 group-active:translate-y-1"
          }`}
        >
          {right.label}
        </span>
      </button>
    </div>
  );
}
