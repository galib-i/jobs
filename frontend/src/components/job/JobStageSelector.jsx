import { useState } from "react";
import { TriangleButton } from "../ui/Button";

export default function JobStageSelector({ job, availableStages, onAddStage }) {
  const [isAddingStage, setIsAddingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);

  if (!job.isActive) {
    return null;
  }

  const stagesToSelect = availableStages || [];

  return (
    <div
      className={`inline-block ml-auto ${isAddingStage ? "z-40" : "mt-0.5"}`}
    >
      <TriangleButton theme="blue" onClick={() => setIsAddingStage(true)} />
      {isAddingStage && (
        <>
          <div
            className="fixed inset-0"
            onClick={() => setIsAddingStage(false)}
          ></div>
          <div className="top-full right-2 left-2 absolute bg-white dark:bg-slate-800 shadow-2xl mt-1 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-md overflow-hidden">
            <div className="mb-2 px-3 pb-2 border-slate-200 dark:border-slate-700 border-b font-bold text-slate-500 dark:text-slate-400 text-xs text-center uppercase tracking-wider">
              Select Stage
            </div>
            <div className="space-y-0.5 px-1.5 pb-1.5 max-h-48 overflow-y-auto overscroll-contain custom-scrollbar">
              {stagesToSelect.map((stage) => {
                const isLastStage = stage.isLast;
                const isDisabled =
                  isLastStage && job.stages?.includes(stage.name);
                const isHovered = hoveredStage === stage.name;
                const stageBg = stage.colour;
                const stageText = stage.textColour;

                const count =
                  job.stages?.filter((s) => s === stage.name).length || 0;
                const displayStage =
                  count > 0 ? `${stage.name} (${count + 1})` : stage.name;

                return (
                  <button
                    key={stage.name}
                    disabled={isDisabled}
                    className={`block w-full text-center px-2.5 py-1.5 text-sm transition-colors font-bold rounded ${
                      isDisabled
                        ? "cursor-not-allowed bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500"
                        : "cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                    style={
                      isHovered && !isDisabled
                        ? { backgroundColor: stageBg, color: stageText }
                        : {}
                    }
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
                    {displayStage}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
