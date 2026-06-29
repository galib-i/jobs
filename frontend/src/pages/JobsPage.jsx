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

        const match = searchableFields.some((field) =>
          (field || "").toLowerCase().includes(q),
        );

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
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-4">
          <SplitButton
            left={{ label: "ACTIVE", value: "active", theme: "yellow" }}
            right={{ label: "INACTIVE", value: "inactive", theme: "yellow" }}
            activeValue={viewMode}
            onChange={setViewMode}
            size="sm"
          />
          <div className="flex items-center pt-1 font-bold text-slate-500 uppercase tracking-wider">
            <span className="inline-block w-6 tabular-nums text-right">
              {filteredJobs.length}
            </span>
            <span className="mx-2">/</span>
            <span className="inline-block w-6 tabular-nums text-left">
              {jobs.length}
            </span>
          </div>
        </div>
        <div className="w-64 font-pixel">
          <TextBox
            theme="dark"
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
          className={`relative grid grid-cols-jobs lg:grid-cols-jobs-lg bg-slate-900 selection:text-white border-2 rounded-2xl overflow-hidden contain-content ${
            inactive
              ? "border-gray-500 selection:bg-gray-500"
              : "border-blue-500 selection:bg-blue-500"
          }`}
        >
          <div
            className={`grid grid-cols-subgrid col-span-full border-b-2 font-pixel font-bold text-white tracking-wider select-none ${
              inactive
                ? "bg-gray-600 border-gray-500 divide-x divide-gray-500"
                : "bg-blue-600 border-blue-500 divide-x divide-blue-500"
            }`}
            draggable={false}
            style={{ WebkitUserDrag: "none" }}
          >
            <div className="flex items-center px-4 py-4 pl-6 whitespace-nowrap">
              Company
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Role
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Location
            </div>
            <div className="flex justify-between items-center px-4 py-4 whitespace-nowrap">
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
            <div className="flex justify-between items-center px-4 py-4 whitespace-nowrap">
              <span>Date</span>
              <div className="opacity-100 ml-2 transition-opacity duration-200">
                <TriangleButton
                  theme="white"
                  pointUp={dateSort === "asc"}
                  onClick={toggleDateSort}
                />
              </div>
            </div>
            <div className="flex items-center px-4 py-4 whitespace-nowrap">
              Notes
            </div>
            <div className="hidden lg:flex items-center px-4 py-4 pr-6 border-l-0"></div>
          </div>
          {sortedJobs.map((job) => (
            <JobListItem
              key={job.id}
              job={job}
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
