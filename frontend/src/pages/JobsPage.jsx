import { useState } from "react";
import JobListItem from "../components/JobListItem";
import { Button } from "../components/Button";
import { TextBox } from "../components/TextBox";

const INITIAL_FORM = {
  company: "",
  role: "",
  location: "",
  link: "",
  description: "",
  notes: "",
};

const FIELD_CONFIG = [
  {
    key: "company",
    placeholder: "Company",
    rounded: "rounded-tl-xl rounded-bl-none rounded-r-none lg:rounded-bl-xl",
    border: "border border-b-2 border-r",
  },
  {
    key: "role",
    placeholder: "Role",
    rounded: "rounded-none",
    border: "border border-b-2 border-x",
  },
  {
    key: "location",
    placeholder: "Location",
    rounded: "rounded-tr-xl rounded-br-none rounded-l-none lg:rounded-tr-none",
    border: "border border-b-2 border-l lg:border-x",
  },
  {
    key: "link",
    placeholder: "Link",
    type: "url",
    rounded: "rounded-bl-xl rounded-tl-none rounded-r-none lg:rounded-bl-none",
    border: "border border-b-2 border-t-0 border-r lg:border-t lg:border-x",
  },
  {
    key: "description",
    placeholder: "Description",
    rounded: "rounded-none",
    border: "border border-b-2 border-t-0 border-x lg:border-t",
  },
  {
    key: "notes",
    placeholder: "Notes",
    rounded: "rounded-br-xl rounded-tr-none rounded-l-none lg:rounded-tr-xl",
    border: "border border-b-2 border-t-0 border-l lg:border-t",
  },
];

export default function JobsPage({
  jobs,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddStage,
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim()) return;
    onAddJob(form);
    setForm(INITIAL_FORM);
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <form
        className="flex flex-wrap lg:flex-nowrap items-center mx-auto mb-6 w-full lg:max-w-none max-w-3xl font-pixel"
        onSubmit={handleSubmit}
      >
        {FIELD_CONFIG.map((field) => (
          <TextBox
            key={field.key}
            theme="dark"
            type={field.type || "text"}
            className="lg:flex-1 w-1/3"
            position="middle"
            roundedOverride={field.rounded}
            borderOverride={field.border}
            value={form[field.key]}
            placeholder={field.placeholder}
            onChange={(e) => updateField(field.key, e.target.value)}
          />
        ))}
        <Button
          theme="green"
          type="submit"
          className="mx-auto lg:mx-0 mt-4 lg:mt-0 lg:ml-4 text-sm"
        >
          ADD
        </Button>
      </form>

      <div className="relative mt-8 mb-4">
        <div className="relative grid grid-cols-jobs lg:grid-cols-jobs-lg bg-slate-900 selection:bg-blue-500 border-2 border-blue-500 rounded-2xl overflow-hidden selection:text-white contain-content">
          <div
            className="grid grid-cols-subgrid col-span-full bg-blue-600 border-blue-500 border-b-2 divide-x divide-blue-500 font-pixel font-bold text-white tracking-wider select-none"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            <div className="flex items-center px-4 py-4 pl-6 whitespace-nowrap">
              Company
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Role
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Location
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Stage
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Date
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Notes
            </div>
            <div className="hidden lg:flex items-center px-4 py-4 pr-6 border-l-0"></div>
          </div>
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
  );
}
