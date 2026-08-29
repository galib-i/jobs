import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

export default function SuccessPopup({ isOpen, onClose, title = "Successfully Saved!", message }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-sm rounded-xl border-2 border-green-500 bg-white p-6 text-center shadow-xl dark:bg-slate-900">
        <h3 className="font-pixel mb-5 font-bold tracking-wider text-green-400 uppercase">
          {title}
        </h3>
        {message && (
          <p className="mb-6 font-mono text-sm break-all text-slate-700 dark:text-slate-300">
            {message}
          </p>
        )}
        <div className="flex justify-center">
          <Button theme="green" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
