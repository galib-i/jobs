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
    (setDescription(""), setNotes(""));
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
    <div className="">
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
