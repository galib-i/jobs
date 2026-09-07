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
  searchQuery,
  setSearchQuery,
  stageSort,
  setStageSort,
  dateSort,
  setDateSort,
}) {
  const inactive = viewMode === "inactive";
  const displayJobs = jobs.filter((job) => (inactive ? !job.isActive : job.isActive));

  const toggleStageSort = () => {
    if (stageSort === "none") setStageSort("asc");
    else if (stageSort === "asc") setStageSort("desc");
    else setStageSort("none");
  };

  const toggleDateSort = () => {
    setDateSort((prev) => (prev === "desc" ? "asc" : "desc"));
  };

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
            <span className="inline-block w-6 text-right tabular-nums">{displayJobs.length}</span>
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
          {(() => {
            const headerBorder = inactive ? "border-l border-gray-500" : "border-l border-blue-500";
            return (
              <>
                <div
                  className={`font-pixel col-span-full grid grid-cols-subgrid rounded-t-[14px] border-b-2 font-bold tracking-wider text-white select-none last:rounded-b-[14px] last:border-b-0 ${
                    inactive ? "border-gray-500 bg-gray-600" : "border-blue-500 bg-blue-600"
                  }`}
                  draggable={false}
                  style={{ WebkitUserDrag: "none" }}
                >
                  <div className="flex items-center px-4 py-4 pl-6 whitespace-nowrap">Company</div>
                  <div className={`flex items-center px-4 py-4 whitespace-nowrap ${headerBorder}`}>
                    Role
                  </div>
                  <div className={`flex items-center px-4 py-4 whitespace-nowrap ${headerBorder}`}>
                    Location
                  </div>
                  <div
                    className={`flex items-center justify-between px-4 py-4 whitespace-nowrap ${headerBorder}`}
                  >
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
                  <div
                    className={`flex items-center justify-between px-4 py-4 whitespace-nowrap ${headerBorder}`}
                  >
                    <span>Date</span>
                    <div className="ml-2 opacity-100 transition-opacity duration-200">
                      <TriangleButton
                        theme="white"
                        pointUp={dateSort === "asc"}
                        onClick={toggleDateSort}
                      />
                    </div>
                  </div>
                  <div className={`flex items-center px-4 py-4 whitespace-nowrap ${headerBorder}`}>
                    Notes
                  </div>
                  <div className="hidden items-center border-l-0 px-4 py-4 pr-6 lg:flex"></div>
                </div>
              </>
            );
          })()}
          {displayJobs.map((job, idx) => (
            <JobListItem
              key={job.id}
              job={job}
              availableStages={availableStages}
              onUpdateJob={onUpdateJob}
              onDeleteJob={onDeleteJob}
              onAddStage={onAddStage}
              onRemoveStage={onRemoveStage}
              isLast={idx === displayJobs.length - 1}
            />
          ))}
          {displayJobs.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <p className="font-pixel text-lg">No jobs found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
