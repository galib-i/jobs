import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

export default function SuccessPopup({
  isOpen,
  onClose,
  title = "Successfully Saved!",
  message,
}) {
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
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/60">
      <div className="bg-slate-900 shadow-xl mx-4 p-6 border-2 border-green-500 rounded-xl w-full max-w-sm text-center">
        <h3 className="mb-5 font-pixel font-bold text-green-400 uppercase tracking-wider">
          {title}
        </h3>
        {message && (
          <p className="mb-6 font-mono text-slate-300 text-sm break-all">
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
