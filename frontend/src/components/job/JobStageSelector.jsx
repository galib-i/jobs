import { useState } from "react";
import { getStageColour, getStageTextColour } from "../../colours";
import { TriangleButton } from "../ui/Button";

const PREDEFINED_STAGES = ["Interview", "Offer", "Rejected", "Withdrawn"];

export default function JobStageSelector({ job, onAddStage }) {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);

  if (job.stages?.some((s) => s === "Rejected" || s === "Withdrawn")) {
    return null;
  }

  return isAddingStage ? (
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
            const isDisabled = isTerminalStage && job.stages?.includes(stage);
            const isHovered = hoveredStage === stage;
            const stageBg = getStageColour(stage);
            const stageText = getStageTextColour(stageBg);

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
                  color: isHovered && !isDisabled ? stageText : defaultText,
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
      <TriangleButton theme="blue" onClick={() => setIsAddingStage(true)} />
    </div>
  );
}
