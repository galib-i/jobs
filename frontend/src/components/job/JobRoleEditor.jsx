import { useState } from "react";
import ExternalLink from "../ui/ExternalLink";

export default function JobRoleEditor({ job, onUpdate }) {
  const [isEditingRoleLink, setIsEditingRoleLink] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [editLink, setEditLink] = useState("");

  const handleStartEditRoleLink = () => {
    setEditRole(job.role);
    setEditLink(job.link || "");
    setIsEditingRoleLink(true);
  };

  const handleSaveRoleLink = () => {
    setIsEditingRoleLink(false);
    if (editRole !== job.role || editLink !== (job.link || "")) {
      onUpdate({ ...job, role: editRole, link: editLink });
    }
  };

  const handleCancelRoleLink = () => {
    setIsEditingRoleLink(false);
  };

  return isEditingRoleLink ? (
    <div
      className="flex w-full min-w-0 flex-col gap-1"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          handleSaveRoleLink();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleCancelRoleLink();
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          handleSaveRoleLink();
        }
      }}
    >
      <input
        autoFocus
        type="text"
        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        value={editRole}
        onChange={(e) => setEditRole(e.target.value)}
        placeholder="Role"
      />
      <input
        type="url"
        className="w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs text-blue-600 outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-blue-400"
        value={editLink}
        onChange={(e) => setEditLink(e.target.value)}
        placeholder="Link"
      />
    </div>
  ) : (
    <>
      <span
        onDoubleClick={handleStartEditRoleLink}
        className="truncate border border-transparent p-1"
      >
        {job.role}
      </span>
      {job.link && (
        <ExternalLink
          href={job.link}
          className="ml-1 truncate text-xs text-blue-400 transition-colors hover:text-blue-300"
        />
      )}
    </>
  );
}
