import { useState } from "react";
import { Button } from "../ui/Button";
import { TextBox } from "../ui/TextBox";

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

export default function JobForm({ onAddJob }) {
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
    <form
      className="flex flex-wrap lg:flex-nowrap items-center mx-auto mb-6 w-full lg:max-w-none max-w-3xl font-pixel"
      onSubmit={handleSubmit}
    >
      {FIELD_CONFIG.map((field) => (
        <TextBox
          key={field.key}

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
  );
}
