import { useState, useEffect } from "react";
import { Events, WML } from "@wailsio/runtime";
import {
  GetJobs,
  SaveJob,
  DeleteJob,
  UpdateJob,
} from "../bindings/jobs/jobservice";

function App() {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");

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
      {jobs.map((job) => (
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
            <div>
              {job.company} {job.role}{" "}
              <button onClick={() => handleDelete(job.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
