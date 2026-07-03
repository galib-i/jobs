import { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../ui/Button";
import { TextBox } from "../ui/TextBox";
import Confirm from "../ui/DeleteConfirmationPopup";

export default function SettingsPopup({
  availableStages,
  onAddStage,
  onDeleteStage,
  onResetStages,
  onWipeDatabase,
  onClose,
}) {
  const [newStageName, setNewStageName] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newStageName.trim()) {
      onAddStage(newStageName);
      setNewStageName("");
    }
  };

  return createPortal(
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 shadow-xl mx-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl w-full max-w-sm overflow-hidden select-none"
        style={{ "--wails-draggable": "no-drag" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 px-4 py-3 border-slate-300 dark:border-slate-700 border-b font-bold text-slate-800 dark:text-slate-300 text-sm tracking-wider">
          <span className="font-pixel">Settings</span>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-pixel font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                Manage Stages
              </h3>
              <button
                onClick={onResetStages}
                className="font-pixel text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 dark:text-slate-500 uppercase tracking-wider transition-colors cursor-pointer"
              >
                Reset Defaults
              </button>
            </div>
            <div className="space-y-1 pr-1 max-h-48 overflow-y-auto custom-scrollbar">
              {(availableStages || []).map((stage) => {
                const isUndeleteable =
                  stage.name === "Rejected" ||
                  stage.name === "Withdrawn" ||
                  stage.name === "Offer";
                return (
                  <div
                    key={stage.name}
                    className="flex justify-between items-center bg-slate-100 dark:bg-slate-700/50 px-2 py-1.5 rounded"
                  >
                    <span className="flex-1 font-bold text-slate-800 dark:text-slate-200 text-sm truncate">
                      {stage.name}
                    </span>
                    {!isUndeleteable && (
                      <button
                        onClick={() => onDeleteStage(stage.name)}
                        className="hover:bg-red-400/20 ml-2 px-1 rounded text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Delete stage"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <form onSubmit={handleAdd} className="flex items-center gap-2 pt-2">
            <TextBox
              type="text"
              className="flex-1"
              placeholder="New stage..."
              value={newStageName}
              onChange={(e) =>
                setNewStageName(e.target.value.replace(/[()]/g, ""))
              }
            />
            <Button theme="green" type="submit" size="sm">
              ADD
            </Button>
          </form>
          <div className="pt-4 border-slate-300 dark:border-slate-700 border-t">
            <h3 className="mb-2 font-pixel font-bold text-red-400 text-xs uppercase tracking-wider">
              Reset
            </h3>
            <Button
              theme="red"
              className="w-full text-center"
              onClick={() => setIsConfirmOpen(true)}
            >
              DELETE ALL RECORDS
            </Button>
          </div>
        </div>
      </div>
      <Confirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          onWipeDatabase();
          setIsConfirmOpen(false);
          onClose();
        }}
        title="Wipe all jobs and stages?"
      />
    </div>,
    document.body,
  );
}
