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
      className="flex flex-col gap-1 w-full min-w-0"
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
        className="bg-white dark:bg-slate-800 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded outline-none w-full text-slate-800 dark:text-slate-200 text-sm"
        value={editRole}
        onChange={(e) => setEditRole(e.target.value)}
        placeholder="Role"
      />
      <input
        type="url"
        className="bg-white dark:bg-slate-800 px-2 py-1 border border-slate-300 dark:border-slate-600 rounded outline-none w-full text-blue-600 dark:text-blue-400 text-xs"
        value={editLink}
        onChange={(e) => setEditLink(e.target.value)}
        placeholder="Link"
      />
    </div>
  ) : (
    <>
      <span
        onDoubleClick={handleStartEditRoleLink}
        className="p-1 border border-transparent truncate"
      >
        {job.role}
      </span>
      {job.link && (
        <ExternalLink
          href={job.link}
          className="ml-1 text-blue-400 hover:text-blue-300 text-xs truncate transition-colors"
        />
      )}
    </>
  );
}
