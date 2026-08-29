import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

export default function Confirm({ isOpen, onClose, onConfirm, title = "Delete selected job?" }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Enter") onConfirm();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 w-full max-w-sm rounded-xl border-2 border-red-500 bg-white p-6 text-center shadow-xl dark:bg-slate-900">
        <h3 className="font-pixel mb-5 font-bold tracking-wider text-red-400 uppercase">{title}</h3>
        <div className="flex justify-center gap-4">
          <Button theme="gray" onClick={onClose}>
            CANCEL
          </Button>
          <Button theme="red" onClick={onConfirm}>
            DELETE
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
