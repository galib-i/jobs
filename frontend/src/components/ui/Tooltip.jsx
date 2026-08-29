import { useState } from "react";

export default function Tooltip({ text, content, children, className = "" }) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={`relative flex items-center ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (text || content) && (
        <div className="absolute top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 scale-105 transform rounded border border-slate-300 bg-white px-6 py-4 text-sm whitespace-nowrap text-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] transition-all duration-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          {content || text}
        </div>
      )}
    </div>
  );
}
