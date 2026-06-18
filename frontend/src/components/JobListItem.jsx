import { useState, useEffect } from "react";
import { Button } from "./Button";
import { BinIcon, InfoIcon } from "./Icon";
import ExternalLink from "./ExternalLink";

const JOB_FIELDS = [
  "company",
  "role",
  "location",
  "link",
  "description",
  "notes",
];

export default function JobListItem({ job, onUpdate, onDelete, onAddStage }) {
  const initialEditState = {
    company: job.company,
    role: job.role,
    location: job.location,
    link: job.link,
    description: job.description,
    notes: job.notes,
  };

  const [editState, setEditState] = useState(initialEditState);

  // Sync edit state when job props change externally
  const jobKey = `${job.id}-${job.company}-${job.role}-${job.location}-${job.description}-${job.notes}`;
  useEffect(() => {
    setEditState(initialEditState);
  }, [jobKey]);

  const [isEditing, setIsEditing] = useState(false);
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  const handleEditSave = () => {
    onUpdate({ ...job, ...editState });

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
        {JOB_FIELDS.map((field) => (
          <input
            key={field}
            type="text"
            className="outline mr-2 px-1"
            value={editState[field]}
            onChange={(e) =>
              setEditState((prev) => ({ ...prev, [field]: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Escape" && setIsEditing(false)}
          />
        ))}

        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div>
      <div
        className="grid grid-cols-[1fr_2fr_1fr_1.5fr_0.8fr_3fr_auto] gap-4 items-center py-3 px-6 bg-white hover:bg-blue-50 border-b-2 border-blue-100 last:border-b-0 transition-colors font-bold tracking-wide text-sm"
        onDoubleClick={() => setIsEditing(true)}
      >
        <div className="text-blue-900 truncate" title={job.company}>
          {job.company}
        </div>
        <div className="flex items-center gap-2 truncate">
          <div className="mt-1 shrink-0">
            <Button
              theme={job.description ? "yellow" : "gray"}
              onClick={() => {
                if (job.description) {
                  setShowDescription(!showDescription);
                } else {
                  setIsAddingDescription(true);
                }
              }}
              isIcon
              size="sm"
            >
              <InfoIcon size="sm" />
            </Button>
          </div>
          <ExternalLink
            href={job.link}
            className="text-blue-600 hover:text-blue-400 transition-colors truncate"
            title={job.role}
          >
            {job.role}
          </ExternalLink>
        </div>
        <div className="text-blue-800 truncate" title={job.location}>
          {job.location}
        </div>
        <div className="flex items-center truncate">
          <span
            title={tooltipText}
            className="text-blue-800 cursor-help border-b-2 border-dotted border-blue-300 truncate"
          >
            {lastStage || "None"}
          </span>
          {isAddingStage ? (
            <form
              className="inline-block ml-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleStageSubmit();
              }}
            >
              <input
                type="text"
                className="outline-none w-24 px-2 py-1 text-sm border-2 border-blue-800 rounded-xl font-bold text-blue-900"
                placeholder="Stage..."
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setIsAddingStage(false)}
                onBlur={() => setIsAddingStage(false)}
                autoFocus
              />
            </form>
          ) : (
            <div className="ml-2 mt-1.5 inline-block">
              <Button
                theme="blue"
                onClick={() => setIsAddingStage(true)}
                isIcon
              >
                +
              </Button>
            </div>
          )}
        </div>
        <div className="text-blue-600 whitespace-nowrap">{job.createdAt}</div>
        <div className="text-blue-800 truncate font-normal" title={job.notes}>
          {job.notes}
        </div>
        <div className="flex items-center justify-end mt-1.5">
          <Button theme="red" onClick={() => onDelete(job.id)} isIcon>
            <BinIcon />
          </Button>
        </div>
      </div>
      {showDescription && job.description && (
        <div className="px-6 py-3 bg-yellow-50 border-b-2 border-yellow-200 text-sm text-yellow-900 font-normal">
          <span className="font-bold text-yellow-700">Description:</span>{" "}
          {job.description}
        </div>
      )}
      {isAddingDescription && (
        <form
          className="px-6 py-3 bg-gray-50 border-b-2 border-gray-200 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (newDescription.trim()) {
              onUpdate({ ...job, description: newDescription.trim() });
              setIsAddingDescription(false);
              setNewDescription("");
            }
          }}
        >
          <span className="font-bold text-gray-600 text-sm shrink-0">
            Description:
          </span>
          <input
            type="text"
            className="flex-1 outline-none px-3 py-1 text-sm border-2 border-gray-600 rounded-xl font-bold text-gray-800"
            placeholder="Add a description..."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setIsAddingDescription(false);
                setNewDescription("");
              }
            }}
            autoFocus
          />
          <div className="mt-1.5">
            <Button theme="green" type="submit" isIcon>
              ✓
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
