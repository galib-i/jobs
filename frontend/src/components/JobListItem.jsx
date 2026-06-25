import { useState, useRef, useEffect } from "react";
import { getStageColour } from "../colours";
import { Button, TriangleButton } from "./Button";
import { BinIcon, InfoIcon, ChevronDownIcon } from "./Icon";
import ExternalLink from "./ExternalLink";
import EditableInput from "./EditableInput";
import Confirm from "./Confirmation";
import Tooltip from "./Tooltip";

const PREDEFINED_STAGES = ["Interview", "Offer", "Rejected", "Withdrawn"];

export default function JobListItem({ job, onUpdate, onDelete, onAddStage }) {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);
  const [newStageName, setNewStageName] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingRoleLink, setIsEditingRoleLink] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [editLink, setEditLink] = useState("");
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

  const handleStartEditRoleLink = () => {
    setEditRole(job.role);
    setEditLink(job.link || "");
    setIsEditingRoleLink(true);
  };

  const handleSaveRoleLink = () => {
    setIsEditingRoleLink(false);
    if (editRole !== job.role || editLink !== (job.link || "")) {
      onUpdate({ ...job, role: editRole, link: editLink });
    }
  };

  const handleCancelRoleLink = () => {
    setIsEditingRoleLink(false);
  };

  const formatStage = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
  const formattedStages = job.stages?.map(formatStage) || [];
  const lastStage = formattedStages[formattedStages.length - 1] || "";
  const tooltipText = formattedStages.join(" ➔ ");

  const bgColour = getStageColour(lastStage);
  const textColour = bgColour === "#FFC107" ? "#333333" : "#ffffff";

  return (
    <div className="contents">
      <div
        className={`grid grid-cols-subgrid col-span-full border-b-2 last:border-b-0 text-slate-200 text-sm tracking-wide divide-x ${
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
          {isEditingRoleLink ? (
            <div
              className="flex flex-col gap-1 w-full min-w-0"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  handleSaveRoleLink();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancelRoleLink();
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSaveRoleLink();
                }
              }}
            >
              <input
                autoFocus
                type="text"
                className="bg-slate-700 px-2 py-1 border border-slate-500 rounded outline-none w-full text-slate-200 text-sm"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                placeholder="Role"
              />
              <input
                type="url"
                className="bg-slate-700 px-2 py-1 border border-slate-500 rounded outline-none w-full text-blue-400 text-xs"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
                placeholder="Link"
              />
            </div>
          ) : (
            <>
              <span
                onDoubleClick={handleStartEditRoleLink}
                style={{
                  padding: "4px",
                  border: "1px solid transparent",
                }}
                className="truncate"
              >
                {job.role}
              </span>
              {job.link && (
                <ExternalLink
                  href={job.link}
                  className="ml-1 text-blue-400 hover:text-blue-300 text-xs truncate transition-colors"
                />
              )}
            </>
          )}
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
          {!job.stages?.some((s) => s === "Rejected" || s === "Withdrawn") &&
            (isAddingStage ? (
              <div className="inline-block z-40 relative ml-auto">
                <div
                  className="fixed inset-0"
                  onClick={() => setIsAddingStage(false)}
                ></div>
                <div className="top-1/2 left-full absolute bg-slate-800 shadow-2xl ml-2 py-2 border-2 border-slate-600 rounded-xl w-36 overflow-hidden -translate-y-1/2">
                  <div className="mb-2 px-3 pb-2 border-slate-700 border-b font-bold text-slate-400 text-xs uppercase tracking-wider">
                    Select Stage
                  </div>
                  <div className="space-y-0.5 px-1.5 pb-1.5 max-h-48 overflow-y-auto overscroll-contain custom-scrollbar">
                    {PREDEFINED_STAGES.map((stage) => {
                      const isTerminalStage =
                        stage === "Rejected" || stage === "Withdrawn";
                      const isDisabled =
                        isTerminalStage && job.stages?.includes(stage);
                      const isHovered = hoveredStage === stage;
                      const stageBg = getStageColour(stage);
                      const stageText =
                        stageBg === "#FFC107" ? "#333333" : "#ffffff";

                      const defaultBg = isDisabled
                        ? "rgba(30, 41, 59, 0.5)"
                        : "transparent";
                      const defaultText = isDisabled ? "#64748b" : "#e2e8f0";

                      return (
                        <button
                          key={stage}
                          disabled={isDisabled}
                          className={`block w-full text-left px-2.5 py-1.5 text-sm transition-colors font-bold rounded ${
                            isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                          }`}
                          style={{
                            backgroundColor:
                              isHovered && !isDisabled ? stageBg : defaultBg,
                            color:
                              isHovered && !isDisabled
                                ? stageText
                                : defaultText,
                          }}
                          onMouseEnter={() => setHoveredStage(stage)}
                          onMouseLeave={() => setHoveredStage(null)}
                          onClick={() => {
                            if (!isDisabled) {
                              onAddStage(job.id, stage);
                              setIsAddingStage(false);
                              setHoveredStage(null);
                            }
                          }}
                        >
                          {stage}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="inline-block mt-0.5 ml-auto" title="Add Stage">
                <TriangleButton
                  theme="blue"
                  onClick={() => setIsAddingStage(true)}
                />
              </div>
            ))}
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
              onClick={() => setIsDeleteModalOpen(true)}
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
