import { useState } from "react";
import JobListItem from "../components/JobListItem";
import { Button } from "../components/Button";
import { TextBox } from "../components/TextBox";

export default function JobsPage({
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddStage,
}) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;
    onAddJob({ company, role, location, link, description, notes });
    setCompany("");
    setRole("");
    setLocation("");
    setLink("");
    setDescription("");
    setNotes("");
  };

  const JOB_FIELDS = [
    {
      key: "company",
      value: company,
      setter: setCompany,
      placeholder: "Company",
      rounded: "rounded-tl-xl rounded-bl-none rounded-r-none lg:rounded-bl-xl",
      border: "border-2 border-r",
    },
    {
      key: "role",
      value: role,
      setter: setRole,
      placeholder: "Role",
      rounded: "rounded-none",
      border: "border-2 border-x",
    },
    {
      key: "location",
      value: location,
      setter: setLocation,
      placeholder: "Location",
      rounded:
        "rounded-tr-xl rounded-br-none rounded-l-none lg:rounded-tr-none",
      border: "border-2 border-l lg:border-x",
    },
    {
      key: "link",
      value: link,
      setter: setLink,
      placeholder: "Link",
      rounded:
        "rounded-bl-xl rounded-tl-none rounded-r-none lg:rounded-bl-none",
      border: "border-2 border-t-0 border-r lg:border-t-2 lg:border-x",
    },
    {
      key: "description",
      value: description,
      setter: setDescription,
      placeholder: "Description",
      rounded: "rounded-none",
      border: "border-2 border-t-0 border-x lg:border-t-2",
    },
    {
      key: "notes",
      value: notes,
      setter: setNotes,
      placeholder: "Notes",
      rounded: "rounded-br-xl rounded-tr-none rounded-l-none lg:rounded-tr-xl",
      border: "border-2 border-t-0 border-l lg:border-t-2",
    },
  ];

  return (
    <div>
      <form
        className="flex flex-wrap lg:flex-nowrap items-center w-full max-w-3xl mx-auto lg:max-w-none mb-6"
        onSubmit={handleSubmit}
      >
        {JOB_FIELDS.map((field) => (
          <TextBox
            key={field.key}
            type="text"
            className="w-1/3 lg:flex-1"
            position="middle"
            roundedOverride={field.rounded}
            borderOverride={field.border}
            value={field.value}
            placeholder={field.placeholder}
            onChange={(e) => field.setter && field.setter(e.target.value)}
          />
        ))}
        <Button
          theme="green"
          type="submit"
          className="text-sm mt-4 lg:mt-0 mx-auto lg:mx-0 lg:ml-4"
        >
          add
        </Button>
      </form>

      <div className="relative mt-8 mb-4">
        <div className="relative flex flex-col bg-white rounded-2xl border-2 border-blue-800 overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr_1fr_1.5fr_0.8fr_3fr_auto] gap-4 items-center py-4 px-6 bg-blue-500 border-b-2 border-blue-800 text-sm font-bold text-white uppercase tracking-wider">
            <div>Company</div>
            <div>Role</div>
            <div>Location</div>
            <div>Stage</div>
            <div>Date</div>
            <div>Notes</div>
            <div className="w-8"></div>
          </div>
          <div className="flex flex-col">
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
      </div>
    </div>
  );
}
