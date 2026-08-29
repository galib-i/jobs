import { useState, useMemo } from "react";
import JobListItem from "../components/job/JobItem";
import { SplitButton, TriangleButton } from "../components/ui/Button";
import { SearchIcon } from "../components/ui/Icon";
import { TextBox } from "../components/ui/TextBox";

import JobForm from "../components/job/JobForm";

export default function JobsPage({
  jobs,
  availableStages,
  viewMode,
  setViewMode,
  onAddJob,
  onUpdateJob,
  onDeleteJob,
  onAddStage,
  onRemoveStage,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const inactive = viewMode === "inactive";
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (inactive && job.isActive) return false;
      if (!inactive && !job.isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const searchableFields = [
          job.company,
          job.role,
          job.location,
          job.link,
          job.description,
          job.notes,
          job.lastStage,
        ];

        const match = searchableFields.some((field) => (field || "").toLowerCase().includes(q));

        if (!match) return false;
      }
      return true;
    });
  }, [jobs, inactive, searchQuery]);

  const [stageSort, setStageSort] = useState("none"); // none, asc, desc
  const [dateSort, setDateSort] = useState("desc"); // asc, desc

  const toggleStageSort = () => {
    if (stageSort === "none") setStageSort("asc");
    else if (stageSort === "asc") setStageSort("desc");
    else setStageSort("none");
  };

  const toggleDateSort = () => {
    setDateSort((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  const sortedJobs = useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      const dateDiff = b.id - a.id; // job IDs are sequential, newest first
      const dateComparison = dateSort === "asc" ? -dateDiff : dateDiff;

      if (stageSort !== "none") {
        const stageA = a.lastStage || "";
        const stageB = b.lastStage || "";
        const stageComparison = stageA.localeCompare(stageB);

        if (stageComparison !== 0) {
          return stageSort === "asc" ? stageComparison : -stageComparison;
        }
      }

      // Fallback date sort
      return dateComparison;
    });
  }, [filteredJobs, dateSort, stageSort]);

  return (
    <div>
      <JobForm onAddJob={onAddJob} />
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-4">
          <SplitButton
            left={{ label: "ACTIVE", value: "active", theme: "yellow" }}
            right={{ label: "INACTIVE", value: "inactive", theme: "yellow" }}
            activeValue={viewMode}
            onChange={setViewMode}
            size="sm"
          />
          <div className="flex items-center pt-1 font-bold tracking-wider text-slate-500 uppercase">
            <span className="inline-block w-6 text-right tabular-nums">{filteredJobs.length}</span>
            <span className="mx-2">/</span>
            <span className="inline-block w-6 text-left tabular-nums">{jobs.length}</span>
          </div>
        </div>
        <div className="font-pixel w-64">
          <TextBox
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={SearchIcon}
            borderOverride="border border-b-2"
          />
        </div>
      </div>
      <div className="relative mt-4 mb-4">
        <div
          className={`grid-cols-jobs lg:grid-cols-jobs-lg relative grid rounded-2xl border-2 bg-slate-100 selection:text-white dark:bg-slate-900 ${
            inactive
              ? "border-gray-500 selection:bg-gray-500"
              : "border-blue-500 selection:bg-blue-500"
          }`}
        >
          <div
            className={`font-pixel col-span-full grid grid-cols-subgrid rounded-t-[14px] border-b-2 font-bold tracking-wider text-white select-none last:rounded-b-[14px] last:border-b-0 ${
              inactive
                ? "divide-x divide-gray-500 border-gray-500 bg-gray-600"
                : "divide-x divide-blue-500 border-blue-500 bg-blue-600"
            }`}
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            <div className="flex items-center px-4 py-4 pl-6 whitespace-nowrap">Company</div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">Role</div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">Location</div>
            <div className="flex items-center justify-between px-4 py-4 whitespace-nowrap">
              <span>Stage</span>
              <div
                className={`ml-2 transition-opacity duration-200 ${
                  stageSort !== "none" ? "opacity-100" : "opacity-30"
                }`}
              >
                <TriangleButton
                  theme="white"
                  pointUp={stageSort === "asc"}
                  onClick={toggleStageSort}
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4 whitespace-nowrap">
              <span>Date</span>
              <div className="ml-2 opacity-100 transition-opacity duration-200">
                <TriangleButton
                  theme="white"
                  pointUp={dateSort === "asc"}
                  onClick={toggleDateSort}
                />
              </div>
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">Notes</div>
            <div className="hidden items-center border-l-0 px-4 py-4 pr-6 lg:flex"></div>
          </div>
          {sortedJobs.map((job, idx) => (
            <JobListItem
              key={job.id}
              job={job}
              isLast={idx === sortedJobs.length - 1}
              availableStages={availableStages}
              onUpdate={onUpdateJob}
              onDelete={onDeleteJob}
              onAddStage={onAddStage}
              onRemoveStage={onRemoveStage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
