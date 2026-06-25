import { useState } from "react";
import { getStageColour, getStageTextColour } from "../../colours";
import { Button } from "../ui/Button";
import { BinIcon, InfoIcon, ChevronDownIcon } from "../ui/Icon";
import EditableInput from "../ui/EditableInput";
import Confirm from "../ui/Confirmation";
import Tooltip from "../ui/Tooltip";
import JobRoleEditor from "./JobRoleEditor";
import JobStageSelector from "./JobStageSelector";

export default function JobListItem({ job, onUpdate, onDelete, onAddStage }) {
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [isDeleteConfirmationOpen, setisDeleteConfirmationOpen] =
    useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const formatStage = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
  const formattedStages = job.stages?.map(formatStage) || [];
  const lastStage = formattedStages.at(-1) || "";
  const tooltipText = formattedStages.join(" ➔ ");

  const bgColour = getStageColour(lastStage);
  const textColour = getStageTextColour(bgColour);

  return (
    <div className="contents">
      <div
        className={`grid grid-cols-subgrid col-span-full border-b-2 last:border-b-0 text-slate-200 text-sm tracking-wide divide-x ${
          isDeleteConfirmationOpen
            ? "bg-red-900/60 border-red-800 divide-red-800/50"
            : "bg-slate-800 hover:bg-slate-700 border-slate-700 divide-slate-600/50"
        }`}
      >
        <div className="flex items-center px-4 py-3 pl-6 overflow-hidden">
          <EditableInput
            initialValue={job.company}
            onSave={(newValue) => onUpdate({ ...job, company: newValue })}
            className="block w-full truncate"
          />
        </div>

        <div className="flex items-center px-4 py-3 truncate">
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
        <div className="flex items-center px-4 py-3 overflow-hidden">
          <EditableInput
            initialValue={job.location}
            onSave={(newValue) => onUpdate({ ...job, location: newValue })}
            className="block w-full truncate"
          />
        </div>
        <div className="flex items-center px-4 py-3 min-w-0">
          <Tooltip text={tooltipText} className="min-w-0">
            <span
              className="block px-2 py-1 rounded font-bold text-xs truncate cursor-help"
              style={{ backgroundColor: bgColour, color: textColour }}
            >
              {lastStage || "None"}
            </span>
          </Tooltip>
          <JobStageSelector job={job} onAddStage={onAddStage} />
        </div>
        <div className="flex justify-center items-center px-4 py-3 truncate">
          {job.createdAt
            ? (() => {
                const [yyyy, mm, dd] = job.createdAt.slice(0, 10).split("-");
                return `${dd}-${mm}-${yyyy.slice(2)}`;
              })()
            : ""}
        </div>
        <div
          className="group/notes flex items-center px-4 py-3 min-w-0 cursor-text"
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
        <div className="hidden lg:flex justify-end items-center px-4 py-3 pr-6">
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
