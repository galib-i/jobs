import { useState } from "react";
import { useJobs } from "./hooks/useJobs";
import Navbar from "./components/Navbar";
import JobsPage from "./pages/JobsPage";
import SankeyDiagram from "./SankeyDiagram";

function App() {
  const [page, setPage] = useState("jobs");
  const { jobs, addJob, updateJob, deleteJob, addStage } = useJobs();

  return (
    <div>
      <Navbar activePage={page} setPage={setPage} />

      {page === "diagrams" && <SankeyDiagram jobs={jobs} />}

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
