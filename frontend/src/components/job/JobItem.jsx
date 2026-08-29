import { useState } from "react";

import { Button } from "../ui/Button";
import { BinIcon, InfoIcon } from "../ui/Icon";
import EditableInput from "../ui/EditableInput";
import Confirm from "../ui/DeleteConfirmationPopup";
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
  const [isDeleteConfirmationOpen, setisDeleteConfirmationOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const lastStage = job.lastStage || "";
  const lastStageCount = job.stages ? job.stages.filter((s) => s === lastStage).length : 0;
  const displayLastStage = lastStageCount > 1 ? `${lastStage} (${lastStageCount})` : lastStage;

  const bgColour = job.lastStageColour || "var(--color-yellow-500)";
  const textColour = job.lastStageTextColour || "var(--color-slate-800)";

  const stageCounts = {};
  const formattedStages = (job.stages || []).map((stage) => {
    stageCounts[stage] = (stageCounts[stage] || 0) + 1;
    return {
      raw: stage,
      display: stageCounts[stage] > 1 ? `${stage} (${stageCounts[stage]})` : stage,
    };
  });

  return (
    <>
      <div
        className={`col-span-full grid grid-cols-subgrid divide-x border-b-2 text-sm tracking-wide text-slate-800 last:rounded-b-[14px] last:border-b-0 dark:text-slate-200 ${
          isDeleteConfirmationOpen
            ? "divide-red-300 border-red-300 bg-red-100 dark:divide-red-800/50 dark:border-red-800 dark:bg-red-900/60"
            : "divide-slate-300 border-slate-300 bg-white hover:bg-slate-50 dark:divide-slate-600/50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
        }`}
      >
        <div className="flex items-center overflow-hidden px-4 py-2 pl-6">
          <EditableInput
            initialValue={job.company}
            onSave={(newValue) => onUpdate({ ...job, company: newValue })}
            className="block w-full truncate"
          />
        </div>

        <div className="flex items-center truncate px-4 py-2">
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
              <InfoIcon />
            </Button>
          </div>
          <JobRoleEditor job={job} onUpdate={onUpdate} />
        </div>
        <div className="flex items-center overflow-hidden px-4 py-2">
          <EditableInput
            initialValue={job.location}
            onSave={(newValue) => onUpdate({ ...job, location: newValue })}
            className="block w-full truncate"
          />
        </div>
        <div className="relative flex min-w-0 items-center px-4 py-2">
          <Tooltip
            content={
              <div className="flex items-center gap-2">
                {formattedStages.length > 0 ? (
                  formattedStages.map((stageObj, index) => {
                    return (
                      <div key={index} className="group/stage flex items-center gap-1">
                        <span>{stageObj.display}</span>
                        {stageObj.raw.toLowerCase() !== "application" &&
                          stageObj.raw.toLowerCase() !== "offer" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onRemoveStage) onRemoveStage(job.id, index);
                              }}
                              className="text-slate-400 transition-all hover:text-red-400"
                              title="Remove stage"
                            >
                              <svg
                                className="h-4 w-4"
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
                    );
                  })
                ) : (
                  <span>None</span>
                )}
              </div>
            }
            className="min-w-0"
          >
            <span
              className="block cursor-help truncate rounded px-2 py-1 text-xs font-bold"
              style={{ backgroundColor: bgColour, color: textColour }}
            >
              {displayLastStage || "None"}
            </span>
          </Tooltip>
          <JobStageSelector job={job} availableStages={availableStages} onAddStage={onAddStage} />
        </div>
        <div className="flex items-center justify-center truncate px-4 py-2">
          {job.formattedDate}
        </div>
        <div
          className="group/notes flex min-w-0 cursor-text items-center px-4 py-2"
          onDoubleClick={() => setIsEditingNotes(true)}
        >
          <EditableInput
            initialValue={job.notes}
            onSave={(newValue) => onUpdate({ ...job, notes: newValue })}
            className="max-h-7 w-full overflow-hidden wrap-break-word whitespace-pre-wrap transition-[max-height] duration-1000 ease-[cubic-bezier(0.85,0,0.15,1)] group-hover/notes:max-h-96"
            editing={isEditingNotes}
            onEditingChange={setIsEditingNotes}
          />
        </div>
        <div className="hidden items-center justify-end px-4 py-2 pr-6 lg:flex">
          <div className="mt-1.5">
            <Button theme="red" onClick={() => setisDeleteConfirmationOpen(true)} isIcon>
              <BinIcon />
            </Button>
          </div>
        </div>
      </div>
      {showDescription && job.description && (
        <div className="col-span-full flex items-center gap-2 border-b-2 border-slate-300 bg-slate-50 px-6 py-3 text-sm font-normal text-slate-800 last:rounded-b-[14px] last:border-b-0 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
          <span
            className="font-pixel shrink-0 font-bold tracking-wider text-yellow-600 uppercase select-none dark:text-yellow-400"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            Description:
          </span>
          <EditableInput
            initialValue={job.description}
            onSave={(newValue) => onUpdate({ ...job, description: newValue })}
            className="w-full flex-1 wrap-break-word whitespace-pre-wrap"
          />
        </div>
      )}
      {isAddingDescription && (
        <div className="col-span-full flex items-center gap-2 border-b-2 border-slate-300 bg-slate-50 px-6 py-3 text-sm text-slate-800 last:rounded-b-[14px] last:border-b-0 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
          <span
            className="font-pixel shrink-0 font-bold tracking-wider text-slate-500 uppercase select-none dark:text-slate-400"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            Description:
          </span>
          <EditableInput
            initialValue=""
            editing={true}
            onEditingChange={(isEditing) => {
              if (!isEditing) setIsAddingDescription(false);
            }}
            onSave={(newValue) => {
              if (newValue.trim()) {
                onUpdate({ ...job, description: newValue.trim() });
                setShowDescription(true);
              }
              setIsAddingDescription(false);
            }}
            className="w-full flex-1 wrap-break-word whitespace-pre-wrap"
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
    </>
  );
}
