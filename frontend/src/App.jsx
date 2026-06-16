import { useState } from "react";
import { useJobs } from "./hooks/useJobs";
import Navbar from "./components/Navbar";
import JobsPage from "./pages/JobsPage";
import SankeyDiagram from "./components/SankeyDiagram";
import TimeDiagram from "./components/TimeDiagram";

function App() {
  const [page, setPage] = useState("jobs");
  const { jobs, addJob, updateJob, deleteJob, addStage } = useJobs();

  return (
    <div>
      <Navbar activePage={page} setPage={setPage} />

      {page === "diagrams" && (
        <div className="flex flex-col gap-8">
          <TimeDiagram jobs={jobs} />
          <SankeyDiagram jobs={jobs} />
        </div>
      )}

      {page === "jobs" && (
        <JobsPage
          jobs={jobs}
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
