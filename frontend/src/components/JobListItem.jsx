import { useState } from "react";
import { Button } from "./Button";
import { BinIcon } from "./Icon";

export default function JobListItem({ job, onUpdate, onDelete, onAddStage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editCompany, setEditCompany] = useState(job.company);
  const [editRole, setEditRole] = useState(job.role);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");

  const handleEditSave = () => {
    onUpdate(job.id, editCompany, editRole);
    setIsEditing(false);
  };

  const handleStageSubmit = () => {
    onAddStage(job.id, newStageName);
    setIsAddingStage(false);
    setNewStageName("");
  };

  const lastStage = job.stages ? job.stages[job.stages.length - 1] : "";
  const tooltipText = job.stages ? job.stages.join(" ➔ ") : "";

  if (isEditing) {
    return (
      <form
        className="flex py-1"
        onSubmit={(e) => {
          e.preventDefault();
          handleEditSave();
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            handleEditSave();
          }
        }}
      >
        <input
          type="text"
          className="outline mr-2 px-1"
          value={editCompany}
          onChange={(e) => setEditCompany(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setIsEditing(false)}
          autoFocus
        />
        <input
          type="text"
          className="outline mr-2 px-1"
          value={editRole}
          onChange={(e) => setEditRole(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setIsEditing(false)}
        />
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div
      className="flex items-center justify-between py-1"
      onDoubleClick={() => setIsEditing(true)}
    >
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
        {isAddingStage ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleStageSubmit();
            }}
          >
            <input
              type="text"
              className="outline w-24 mr-2 px-1"
              placeholder="New stage..."
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setIsAddingStage(false)}
              onBlur={() => setIsAddingStage(false)}
              autoFocus
            />
          </form>
        ) : (
          <button
            className="mr-2 text-blue-500 font-bold"
            onClick={() => setIsAddingStage(true)}
          >
            +
          </button>
        )}
        <Button theme="red" onClick={() => onDelete(job.id)} isIcon>
          <BinIcon />
        </Button>
      </div>
    </div>
  );
}
