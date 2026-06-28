const themeIconSize = "w-5 h-5";

const svgDefaults = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function SvgIcon({ className = themeIconSize, children }) {
  return (
    <svg className={className} {...svgDefaults}>
      {children}
    </svg>
  );
}

export function SunIcon() {
  return (
    <SvgIcon>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </SvgIcon>
  );
}

export function MoonIcon() {
  return (
    <SvgIcon>
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </SvgIcon>
  );
}

export function BinIcon() {
  return (
    <SvgIcon>
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </SvgIcon>
  );
}

export function InfoIcon({ size = "md" }) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : themeIconSize;
  return (
    <SvgIcon className={iconSize}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </SvgIcon>
  );
}

export function SettingsIcon() {
  return (
    <SvgIcon>
      <path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" />
      <circle cx="12" cy="12" r="3" />
    </SvgIcon>
  );
}

export function SearchIcon({ size = "md" }) {
  const iconSize = size === "sm" ? "w-3.5 h-3.5" : themeIconSize;
  return (
    <SvgIcon className={iconSize}>
      <circle cx="11" cy="11" r="8" />
      <path d="m23 23-6.34-6.34" />
    </SvgIcon>
  );
}
