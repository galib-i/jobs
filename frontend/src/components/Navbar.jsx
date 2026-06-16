import { useState } from "react";
import { Button, SplitButton } from "./Button";
import { SunIcon, MoonIcon } from "./Icon";

function Navbar({ activePage, setPage }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeClick = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <nav className="flex items-center justify-between p-4 m-4 text-sm gap-4">
      <div className="flex-1"></div>

      {/* Navigation */}
      <div className="flex-none">
        <SplitButton
          left={{ label: "jobs", value: "jobs" }}
          right={{ label: "stats", value: "diagrams" }}
          activeValue={activePage}
          onChange={setPage}
        />
      </div>

      {/* Theme */}
      <div className="flex-1 flex justify-end">
        <Button theme="yellow" onClick={handleThemeClick} isIcon>
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>
    </nav>
  );
}

export default Navbar;
