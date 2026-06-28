import { useState } from "react";
import { TriangleButton } from "../ui/Button";

export default function JobStageSelector({ job, availableStages, onAddStage }) {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);

  if (!job.isActive) {
    return null;
  }

  const stagesToSelect = availableStages || [];

  return isAddingStage ? (
    <div className="inline-block z-40 ml-auto">
      <div
        className="fixed inset-0"
        onClick={() => setIsAddingStage(false)}
      ></div>
      <div className="top-full right-2 left-2 absolute bg-slate-800 shadow-2xl mt-1 py-2 border-2 border-slate-600 rounded-md overflow-hidden">
        <div className="mb-2 px-3 pb-2 border-slate-700 border-b font-bold text-slate-400 text-xs uppercase tracking-wider">
          Select Stage
        </div>
        <div className="space-y-0.5 px-1.5 pb-1.5 max-h-48 overflow-y-auto overscroll-contain custom-scrollbar">
          {stagesToSelect.map((stage) => {
            const isTerminalStage = stage.isTerminal;
            const isDisabled =
              isTerminalStage && job.stages?.includes(stage.name);
            const isHovered = hoveredStage === stage.name;
            const stageBg = stage.colour;
            const stageText = stage.textColour;

            const defaultBg = isDisabled
              ? "rgba(30, 41, 59, 0.5)"
              : "transparent";
            const defaultText = isDisabled ? "#64748b" : "#e2e8f0";

            return (
              <button
                key={stage.name}
                disabled={isDisabled}
                className={`block w-full text-left px-2.5 py-1.5 text-sm transition-colors font-bold rounded ${
                  isDisabled ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                style={{
                  backgroundColor:
                    isHovered && !isDisabled ? stageBg : defaultBg,
                  color: isHovered && !isDisabled ? stageText : defaultText,
                }}
                onMouseEnter={() => setHoveredStage(stage.name)}
                onMouseLeave={() => setHoveredStage(null)}
                onClick={() => {
                  if (!isDisabled) {
                    onAddStage(job.id, stage.name);
                    setIsAddingStage(false);
                    setHoveredStage(null);
                  }
                }}
              >
                {stage.name}
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
