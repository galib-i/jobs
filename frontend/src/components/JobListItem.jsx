import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { BinIcon, InfoIcon, CheckIcon, XIcon } from "./Icon";
import ExternalLink from "./ExternalLink";
import EditableInput from "./EditableInput";
import Confirm from "./Confirmation";

export default function JobListItem({ job, onUpdate, onDelete, onAddStage }) {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const descRef = useRef(null);

  useEffect(() => {
    if (isAddingDescription && descRef.current) {
      descRef.current.style.height = "auto";
      descRef.current.style.height = `${descRef.current.scrollHeight}px`;
    }
  }, [isAddingDescription, newDescription]);

  const handleStageSubmit = () => {
    onAddStage(job.id, newStageName);
    setIsAddingStage(false);
    setNewStageName("");
  };

  const lastStage = job.stages?.[job.stages.length - 1] ?? "";
  const tooltipText = job.stages?.join(" ➔ ") ?? "";

  return (
    <div className="contents">
      <div
        className={`grid grid-cols-subgrid col-span-full border-b-2 last:border-b-0 text-slate-200 text-sm tracking-wide transition-colors divide-x ${
          isDeleteModalOpen
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
          <EditableInput
            initialValue={job.role}
            onSave={(newValue) => onUpdate({ ...job, role: newValue })}
            className="truncate"
          />
          <ExternalLink
            href={job.link}
            className="text-blue-400 hover:text-blue-300 text-xs truncate transition-colors"
          />
        </div>
        <div className="flex items-center px-4 py-3 overflow-hidden">
          <EditableInput
            initialValue={job.location}
            onSave={(newValue) => onUpdate({ ...job, location: newValue })}
            className="block w-full truncate"
          />
        </div>
        <div className="flex items-center px-4 py-3 truncate">
          <span
            title={tooltipText}
            className="border-blue-500/40 border-b-2 border-dotted text-blue-300 truncate cursor-help"
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
                className="bg-slate-700 px-2 py-1 border-2 border-blue-500 rounded-xl outline-none w-24 text-blue-200 text-sm placeholder-blue-400/50"
                placeholder="Stage..."
                value={newStageName}
                onChange={(e) => setNewStageName(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setIsAddingStage(false)}
                onBlur={() => setIsAddingStage(false)}
                autoFocus
              />
            </form>
          ) : (
            <div className="inline-block mt-1.5 ml-2">
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
        <div className="flex justify-center items-center px-4 py-3 truncate">
          {job.createdAt
            ? (() => {
                const d = new Date(job.createdAt);
                const dd = String(d.getDate()).padStart(2, "0");
                const mm = String(d.getMonth() + 1).padStart(2, "0");
                return `${dd}-${mm}-${String(d.getFullYear()).slice(-2)}`;
              })()
            : ""}
        </div>
        <div className="flex items-center px-4 py-3 truncate" title={job.notes}>
          {job.notes}
        </div>
        <div className="hidden lg:flex justify-end items-center px-4 py-3 pr-6">
          <div className="mt-1.5">
            <Button
              theme="red"
              onClick={() => setIsDeleteModalOpen(true)}
              isIcon
            >
              <BinIcon />
            </Button>
          </div>
        </div>
      </div>
      {showDescription && job.description && (
        <div className="col-span-full bg-slate-800/80 px-6 py-3 border-slate-700 border-b-2 font-normal text-slate-200 text-sm">
          <span
            className="font-pixel font-bold text-yellow-400 uppercase tracking-wider select-none"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            Description:
          </span>{" "}
          <EditableInput
            initialValue={job.description}
            onSave={(newValue) => onUpdate({ ...job, description: newValue })}
          ></EditableInput>
        </div>
      )}
      {isAddingDescription && (
        <form
          className="flex items-center gap-2 col-span-full bg-slate-800/80 px-6 py-3 border-slate-700 border-b-2 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            if (newDescription.trim()) {
              onUpdate({ ...job, description: newDescription.trim() });
              setIsAddingDescription(false);
              setNewDescription("");
            }
          }}
        >
          <span
            className="font-pixel font-bold text-slate-400 uppercase tracking-wider select-none"
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            Description:
          </span>{" "}
          <textarea
            ref={descRef}
            rows={1}
            className="flex-1 bg-slate-700 px-3 py-2 border-2 border-slate-500 rounded-xl outline-none overflow-hidden text-slate-200 text-sm resize-none"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (newDescription.trim()) {
                  onUpdate({ ...job, description: newDescription.trim() });
                  setIsAddingDescription(false);
                  setNewDescription("");
                }
              }
              if (e.key === "Escape") {
                setIsAddingDescription(false);
                setNewDescription("");
              }
            }}
            autoFocus
          />
          <div className="mt-1.5">
            <Button
              theme="red"
              onClick={() => {
                setIsAddingDescription(false);
                setNewDescription("");
              }}
              isIcon
            >
              <XIcon />
            </Button>
          </div>
          <div className="mt-1.5">
            <Button theme="green" type="submit" isIcon>
              <CheckIcon />
            </Button>
          </div>
        </form>
      )}

      <Confirm
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          setIsDeleteModalOpen(false);
          onDelete(job.id);
        }}
      />
    </div>
  );
}
