import { useState, useEffect } from "react";
import { useJobs } from "./hooks/useJobs";
import Navbar from "./components/layout/Navbar";
import JobsPage from "./pages/JobsPage";
import DiagramsPage from "./pages/DiagramsPage";

function App() {
  const [page, setPage] = useState("jobs");
  const [viewMode, setViewMode] = useState("active");

  const {
    jobs,
    availableStages,
    addJob,
    updateJob,
    deleteJob,
    addStage,
    removeStage,
    addAvailableStage,
    deleteAvailableStage,
    resetAvailableStages,
    wipeDatabase,
  } = useJobs();
  const [theme, setTheme] = useState("dark");

  // Apply dark mode class to html root
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="m-4">
      <Navbar
        activePage={page}
        setPage={setPage}
        theme={theme}
        setTheme={setTheme}
        availableStages={availableStages}
        addAvailableStage={addAvailableStage}
        deleteAvailableStage={deleteAvailableStage}
        resetAvailableStages={resetAvailableStages}
        wipeDatabase={wipeDatabase}
      />

      {page === "diagrams" && <DiagramsPage theme={theme} />}

      {page === "jobs" && (
        <JobsPage
          jobs={jobs}
          availableStages={availableStages}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAddJob={addJob}
          onUpdateJob={updateJob}
          onDeleteJob={deleteJob}
          onAddStage={addStage}
          onRemoveStage={removeStage}
        />
      )}
    </div>
  );
}

export default App;
