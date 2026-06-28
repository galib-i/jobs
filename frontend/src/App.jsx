import { useState } from "react";
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
    addAvailableStage,
    deleteAvailableStage,
    resetAvailableStages,
    wipeDatabase,
  } = useJobs();

  return (
    <div className="m-4">
      <Navbar
        activePage={page}
        setPage={setPage}
        availableStages={availableStages}
        addAvailableStage={addAvailableStage}
        deleteAvailableStage={deleteAvailableStage}
        resetAvailableStages={resetAvailableStages}
        wipeDatabase={wipeDatabase}
      />

      {page === "diagrams" && <DiagramsPage />}

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
        />
      )}
    </div>
  );
}

export default App;
