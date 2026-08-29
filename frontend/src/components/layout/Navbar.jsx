import { useState } from "react";
import { Button, SplitButton } from "../ui/Button";
import { SunIcon, MoonIcon, SettingsIcon } from "../ui/Icon";
import SettingsPopup from "./SettingsPopup";

export default function Navbar({
  activePage,
  setPage,
  theme,
  setTheme,
  availableStages,
  addAvailableStage,
  deleteAvailableStage,
  resetAvailableStages,
  wipeDatabase,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between gap-4 p-4 text-sm">
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
      <div className="flex flex-1 justify-start gap-2">
        <Button theme="yellow" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} isIcon>
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>
        <div className="relative">
          <Button isIcon theme="blue" onClick={() => setIsSettingsOpen(true)}>
            <SettingsIcon />
          </Button>
          {isSettingsOpen && (
            <SettingsPopup
              availableStages={availableStages}
              onAddStage={addAvailableStage}
              onDeleteStage={deleteAvailableStage}
              onResetStages={resetAvailableStages}
              onWipeDatabase={wipeDatabase}
              onClose={() => setIsSettingsOpen(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
