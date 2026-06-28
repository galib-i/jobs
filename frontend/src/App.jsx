import { useState } from "react";
import { useJobs } from "./hooks/useJobs";
import Navbar from "./components/layout/Navbar";
import JobsPage from "./pages/JobsPage";
import SankeyDiagram from "./components/diagrams/SankeyDiagram";
import TimeDiagram from "./components/diagrams/TimeDiagram";

function App() {
  const [page, setPage] = useState("jobs");
  const [viewMode, setViewMode] = useState("active");

  const { jobs, availableStages, addJob, updateJob, deleteJob, addStage } =
    useJobs();

  return (
    <div className="m-4">
      <Navbar activePage={page} setPage={setPage} />

      {page === "diagrams" && (
        <div className="flex flex-col gap-8">
          <TimeDiagram />
          <SankeyDiagram />
        </div>
      )}

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
