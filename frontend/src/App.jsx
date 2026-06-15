import { useState, useEffect } from "react";
import { Events, WML } from "@wailsio/runtime";
import {
  GetJobs,
  SaveJob,
  DeleteJob,
  UpdateJob,
  AddJobStage,
} from "../bindings/jobs/jobservice";

function App() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [activeStageInputId, setActiveStageInputId] = useState(null);
  const [newStageName, setNewStageName] = useState("");

  function loadJobs() {
    GetJobs()
      .then((data) => setJobs(data))
      .catch((err) => {
        console.error(err);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    SaveJob(company, role)
      .then(() => {
        setCompany("");
        setRole("");
        loadJobs();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleDelete(id) {
    DeleteJob(id)
      .then(() => {
        loadJobs();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleEditStart(job) {
    setEditingJobId(job.id);
    setEditCompany(job.company);
    setEditRole(job.role);
  }

  function handleEditSave(id) {
    UpdateJob(id, editCompany, editRole)
      .then(() => {
        setEditingJobId(null);
        loadJobs();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleAddStageSubmit(jobId) {
    if (!newStageName.trim()) return;

    AddJobStage(jobId, newStageName)
      .then(() => {
        setNewStageName("");
        setActiveStageInputId(null);
        loadJobs();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="max-w-xs mx-auto">
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <label>Company</label>
        <input
          type="text"
          className="outline"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        ></input>
        <label>Role</label>
        <input
          type="text"
          className="outline"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        ></input>
        <input type="submit" value="Submit" className="outline"></input>
      </form>
      {jobs.map((job) => {
        const lastStage = job.stages ? job.stages[job.stages.length - 1] : "";
        const tooltipText = job.stages ? job.stages.join(" ➔ ") : "";

        return (
          <div key={job.id} onDoubleClick={() => handleEditStart(job)}>
            {editingJobId === job.id ? (
              <div
                className="flex"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    handleEditSave(job.id);
                  }
                }}
              >
                <input
                  type="text"
                  className="outline mr-2"
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditSave(job.id);
                    } else if (e.key === "Escape") {
                      setEditingJobId(null);
                    }
                  }}
                />
                <input
                  type="text"
                  className="outline mr-2"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEditSave(job.id);
                    } else if (e.key === "Escape") {
                      setEditingJobId(null);
                    }
                  }}
                />
                <button onClick={() => setEditingJobId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="flex items-center justify-between py-1">
                <div>
                  {job.company} - {job.role}{" "}
                  <span
                    title={tooltipText}
                    className="ml-2 text-gray-500 cursor-help border-b border-dashed border-gray-400"
                  >
                    ({lastStage})
                  </span>
                </div>

                <div className="flex items-center">
                  {activeStageInputId === job.id ? (
                    <input
                      type="text"
                      className="outline w-24 mr-2"
                      placeholder="New stage..."
                      value={newStageName}
                      onChange={(e) => setNewStageName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddStageSubmit(job.id);
                        } else if (e.key === "Escape") {
                          setActiveStageInputId(null);
                        }
                      }}
                      onBlur={() => setActiveStageInputId(null)}
                      autoFocus
                    />
                  ) : (
                    <button
                      className="mr-2 text-blue-500 font-bold"
                      onClick={() => setActiveStageInputId(job.id)}
                    >
                      +
                    </button>
                  )}
                  <button onClick={() => handleDelete(job.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default App;
