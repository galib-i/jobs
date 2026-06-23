import { useState, useEffect, useCallback } from "react";
import {
  GetJobs,
  SaveJob,
  DeleteJob,
  UpdateJob,
  AddJobStage,
} from "../../bindings/jobs/jobservice";

export function useJobs() {
  const [jobs, setJobs] = useState([]);

  const loadJobs = useCallback(() => {
    GetJobs()
      .then((data) => setJobs(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const addJob = async (job) => {
    await SaveJob(job);
    loadJobs();
  };

  const updateJob = async (job) => {
    setJobs((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    await UpdateJob(job);
    loadJobs();
  };

  const deleteJob = async (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    await DeleteJob(id);
    loadJobs();
  };

  const addStage = async (jobId, stageName) => {
    if (!stageName.trim()) return;
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return { ...j, stages: [...(j.stages || []), stageName] };
        }
        return j;
      }),
    );
    await AddJobStage(jobId, stageName);
    loadJobs();
  };

  return { jobs, addJob, updateJob, deleteJob, addStage };
}
