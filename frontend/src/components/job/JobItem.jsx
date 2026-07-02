import { useState } from "react";

import { Button } from "../ui/Button";
import { BinIcon, InfoIcon } from "../ui/Icon";
import EditableInput from "../ui/EditableInput";
import Confirm from "../ui/Confirmation";
import Tooltip from "../ui/Tooltip";
import JobRoleEditor from "./JobRoleEditor";
import JobStageSelector from "./JobStageSelector";

export default function JobListItem({
  job,
  availableStages,
  onUpdate,
  onDelete,
  onAddStage,
  onRemoveStage,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [isDeleteConfirmationOpen, setisDeleteConfirmationOpen] =
    useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const lastStage = job.lastStage || "";
  const bgColour = job.lastStageColour || "var(--color-yellow-500)";
  const textColour = job.lastStageTextColour || "var(--color-slate-800)";
  const tooltipText = job.stageHistory || "";

  return (
    <div className="contents">
      <div
        className={`grid grid-cols-subgrid col-span-full border-b-2 last:border-b-0 text-slate-200 text-sm tracking-wide divide-x ${
          isDeleteConfirmationOpen
            ? "bg-red-900/60 border-red-800 divide-red-800/50"
            : "bg-slate-800 hover:bg-slate-700 border-slate-700 divide-slate-600/50"
        }`}
      >
        <div className="flex items-center px-4 py-2 pl-6 overflow-hidden">
          <EditableInput
            initialValue={job.company}
            onSave={(newValue) => onUpdate({ ...job, company: newValue })}
            className="block w-full truncate"
          />
        </div>

        <div className="flex items-center px-4 py-2 truncate">
          <div className="mt-1 mr-2 shrink-0">
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
          <JobRoleEditor job={job} onUpdate={onUpdate} />
        </div>
        <div className="flex items-center px-4 py-2 overflow-hidden">
          <EditableInput
            initialValue={job.location}
            onSave={(newValue) => onUpdate({ ...job, location: newValue })}
            className="block w-full truncate"
          />
        </div>
        <div className="relative flex items-center px-4 py-2 min-w-0">
          <Tooltip
            content={
              <div className="flex items-center gap-2">
                {job.stages && job.stages.length > 0 ? (
                  job.stages.map((stage, index) => (
                    <div
                      key={index}
                      className="group/stage flex items-center gap-1"
                    >
                      <span>{stage}</span>
                      {stage.toLowerCase() !== "application" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onRemoveStage) onRemoveStage(job.id, index);
                          }}
                          className="text-slate-400 hover:text-red-400 transition-all"
                          title="Remove stage"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                      {index < job.stages.length - 1 && (
                        <span className="ml-1 text-slate-500">➔</span>
                      )}
                    </div>
                  ))
                ) : (
                  <span>None</span>
                )}
              </div>
            }
            className="min-w-0"
          >
            <span
              className="block px-2 py-1 rounded font-bold text-xs truncate cursor-help"
              style={{ backgroundColor: bgColour, color: textColour }}
            >
              {lastStage || "None"}
            </span>
          </Tooltip>
          <JobStageSelector
            job={job}
            availableStages={availableStages}
            onAddStage={onAddStage}
          />
        </div>
        <div className="flex justify-center items-center px-4 py-2 truncate">
          {job.formattedDate}
        </div>
        <div
          className="group/notes flex items-center px-4 py-2 min-w-0 cursor-text"
          onDoubleClick={() => setIsEditingNotes(true)}
        >
          <EditableInput
            initialValue={job.notes}
            onSave={(newValue) => onUpdate({ ...job, notes: newValue })}
            className="w-full max-h-7 group-hover/notes:max-h-96 overflow-hidden wrap-break-word whitespace-pre-wrap transition-[max-height] duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)]"
            isEditingProp={isEditingNotes}
            setIsEditingProp={setIsEditingNotes}
          />
        </div>
        <div className="hidden lg:flex justify-end items-center px-4 py-2 pr-6">
          <div className="mt-1.5">
            <Button
              theme="red"
              onClick={() => setisDeleteConfirmationOpen(true)}
              isIcon
            >
              <BinIcon />
            </Button>
          </div>
        </div>
      </div>
      {showDescription && job.description && (
        <div className="flex items-center gap-2 col-span-full bg-slate-800/80 px-6 py-3 border-slate-700 border-b-2 font-normal text-slate-200 text-sm">
          <span
            className="font-pixel font-bold text-yellow-400 uppercase tracking-wider select-none shrink-0"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            Description:
          </span>
          <EditableInput
            initialValue={job.description}
            onSave={(newValue) => onUpdate({ ...job, description: newValue })}
            className="flex-1 w-full wrap-break-word whitespace-pre-wrap"
          />
        </div>
      )}
      {isAddingDescription && (
        <div className="flex items-center gap-2 col-span-full bg-slate-800/80 px-6 py-3 border-slate-700 border-b-2 text-sm">
          <span
            className="font-pixel font-bold text-slate-400 uppercase tracking-wider select-none shrink-0"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            Description:
          </span>
          <EditableInput
            initialValue=""
            isEditingProp={true}
            setIsEditingProp={(isEditing) => {
              if (!isEditing) setIsAddingDescription(false);
            }}
            onSave={(newValue) => {
              if (newValue.trim()) {
                onUpdate({ ...job, description: newValue.trim() });
                setShowDescription(true);
              }
              setIsAddingDescription(false);
            }}
            className="flex-1 w-full wrap-break-word whitespace-pre-wrap"
          />
        </div>
      )}

      <Confirm
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setisDeleteConfirmationOpen(false)}
        onConfirm={() => {
          setisDeleteConfirmationOpen(false);
          onDelete(job.id);
        }}
      />
    </div>
  );
}
