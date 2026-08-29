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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-sm overflow-hidden rounded-xl border-2 border-slate-300 bg-white shadow-xl select-none dark:border-slate-600 dark:bg-slate-800"
        style={{ "--wails-draggable": "no-drag" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-300 bg-slate-100 px-4 py-3 text-sm font-bold tracking-wider text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <span className="font-pixel">Settings</span>
          <button
            onClick={onClose}
            className="cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-pixel text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                Manage Stages
              </h3>
              <button
                onClick={onResetStages}
                className="font-pixel cursor-pointer text-[10px] tracking-wider text-slate-400 uppercase transition-colors hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
              >
                Reset Defaults
              </button>
            </div>
            <div className="custom-scrollbar max-h-48 space-y-1 overflow-y-auto pr-1">
              {(availableStages || []).map((stage) => {
                const isUndeleteable =
                  stage.name === "Rejected" || stage.name === "Withdrawn" || stage.name === "Offer";
                return (
                  <div
                    key={stage.name}
                    className="flex items-center justify-between rounded bg-slate-100 px-2 py-1.5 dark:bg-slate-700/50"
                  >
                    <span className="flex-1 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                      {stage.name}
                    </span>
                    {!isUndeleteable && (
                      <button
                        onClick={() => onDeleteStage(stage.name)}
                        className="ml-2 cursor-pointer rounded px-1 text-red-400 transition-colors hover:bg-red-400/20 hover:text-red-300"
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
              onChange={(e) => setNewStageName(e.target.value.replace(/[()]/g, ""))}
            />
            <Button theme="green" type="submit" size="sm">
              ADD
            </Button>
          </form>
          <div className="border-t border-slate-300 pt-4 dark:border-slate-700">
            <h3 className="font-pixel mb-2 text-xs font-bold tracking-wider text-red-400 uppercase">
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
