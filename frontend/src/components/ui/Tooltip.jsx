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
        <div className="top-1/2 left-1/2 z-50 absolute bg-white dark:bg-slate-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] px-6 py-4 border border-slate-300 dark:border-slate-600 rounded text-slate-800 dark:text-slate-200 text-sm whitespace-nowrap scale-105 transition-all -translate-x-1/2 -translate-y-1/2 duration-200 transform">
          {content || text}
        </div>
      )}
    </div>
  );
}
