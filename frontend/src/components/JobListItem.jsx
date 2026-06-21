import { useState } from "react";
import { Button } from "./Button";
import { BinIcon, InfoIcon, CheckIcon } from "./Icon";
import ExternalLink from "./ExternalLink";
import EditableInput from "./EditableInput";

export default function JobListItem({ job, onUpdate, onDelete, onAddStage }) {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");

  const handleStageSubmit = () => {
    onAddStage(job.id, newStageName);
    setIsAddingStage(false);
    setNewStageName("");
  };

  const lastStage = job.stages?.[job.stages.length - 1] ?? "";
  const tooltipText = job.stages?.join(" ➔ ") ?? "";

  return (
    <div>
      <div className="grid grid-cols-[1fr_2fr_1fr_1.5fr_0.8fr_3fr_auto] gap-4 items-center py-3 px-6 bg-slate-800 hover:bg-slate-700 border-b-2 border-slate-700 last:border-b-0 transition-colors tracking-wide text-sm text-slate-200">
        <EditableInput
          initialValue={job.company}
          onSave={(newValue) => onUpdate({ ...job, company: newValue })}
          className="block w-full truncate"
        />

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
          <EditableInput
            initialValue={job.role}
            onSave={(newValue) => onUpdate({ ...job, role: newValue })}
            className="truncate"
          />
          <ExternalLink
            href={job.link}
            className="text-blue-400 hover:text-blue-300 transition-colors truncate text-xs"
          />
        </div>
        <EditableInput
          initialValue={job.location}
          onSave={(newValue) => onUpdate({ ...job, location: newValue })}
          className="block w-full"
        />
        <div className="flex items-center truncate">
          <span
            title={tooltipText}
            className="text-blue-300 cursor-help border-b-2 border-dotted border-blue-500/40 truncate"
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
                className="outline-none w-24 px-2 py-1 text-sm border-2 border-blue-500 rounded-xl bg-slate-700 text-blue-200 placeholder-blue-400/50"
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
        <div className="">
          {job.createdAt
            ? (() => {
                const d = new Date(job.createdAt);
                const dd = String(d.getDate()).padStart(2, "0");
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                return `${dd}-${mm}-${String(d.getFullYear()).slice(-2)}`;
              })()
            : ""}
        </div>
        <div className="" title={job.notes}>
          {job.notes}
        </div>
        <div className="flex items-center justify-end mt-1.5">
          <Button theme="red" onClick={() => onDelete(job.id)} isIcon>
            <BinIcon />
          </Button>
        </div>
      </div>
      {showDescription && job.description && (
        <div className="px-6 py-3 bg-yellow-900/30 border-b-2 border-yellow-700/40 text-sm text-yellow-200 font-normal">
          <span className=" text-yellow-400">Description:</span>{" "}
          <EditableInput
            initialValue={job.description}
            onSave={(newValue) => onUpdate({ ...job, description: newValue })}
          ></EditableInput>
        </div>
      )}
      {isAddingDescription && (
        <form
          className="px-6 py-3 bg-slate-800/80 border-b-2 border-slate-700 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (newDescription.trim()) {
              onUpdate({ ...job, description: newDescription.trim() });
              setIsAddingDescription(false);
              setNewDescription("");
            }
          }}
        >
          <span className=" text-slate-400 text-sm shrink-0">description:</span>
          <input
            type="text"
            className="flex-1 outline-none px-3 py-1 text-sm border-2 border-slate-500 rounded-xl bg-slate-700 text-slate-200 placeholder-slate-400"
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
              <CheckIcon />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
