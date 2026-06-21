import { useState } from "react";
import { Button, SplitButton } from "./Button";
import { SunIcon, MoonIcon } from "./Icon";

export default function Navbar({ activePage, setPage }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 text-sm gap-4">
      <div className="flex-1"></div>

      {/* Navigation */}
      <div className="flex-none">
        <SplitButton
          left={{ label: "JOBS", value: "jobs" }}
          right={{ label: "STATISTICS", value: "diagrams" }}
          activeValue={activePage}
          onChange={setPage}
        />
      </div>

      {/* Theme */}
      <div className="flex-1 flex justify-start">
        <Button
          theme="yellow"
          onClick={() => setIsDarkMode((prev) => !prev)}
          isIcon
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </nav>
  );
}
