import { useState } from "react";
import JobListItem from "../components/JobListItem";

export default function JobsPage({
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddStage,
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    onAddJob(company, role);
    setCompany("");
    setRole("");
  };

  return (
    <div className="max-w-xs mx-auto">
      <form className="flex flex-col mb-6" onSubmit={handleSubmit}>
        <label>Company</label>
        <input
          type="text"
          className="outline mb-2"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <label>Role</label>
        <input
          type="text"
          className="outline mb-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <input
          type="submit"
          value="Submit"
          className="outline cursor-pointer"
        />
      </form>

      <div className="flex flex-col gap-2">
        {jobs.map((job) => (
          <JobListItem
            key={job.id}
            job={job}
            onUpdate={onUpdateJob}
            onDelete={onDeleteJob}
            onAddStage={onAddStage}
          />
        ))}
      </div>
    </div>
  );
}
