import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

export default function Confirm({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete selected job?",
}) {
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
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="bg-slate-900 shadow-xl mx-4 p-6 border-2 border-red-500 rounded-xl w-full max-w-sm text-center">
        <h3 className="mb-5 font-pixel font-bold text-red-400 uppercase tracking-wider">
          {title}
        </h3>
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
