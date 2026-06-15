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

  const addJob = async (company, role) => {
    await SaveJob(company, role);
    loadJobs();
  };

  const updateJob = async (id, company, role) => {
    await UpdateJob(id, company, role);
    loadJobs();
  };

  const deleteJob = async (id) => {
    await DeleteJob(id);
    loadJobs();
  };

  const addStage = async (jobId, stageName) => {
    if (!stageName.trim()) return;
    await AddJobStage(jobId, stageName);
    loadJobs();
  };

  return { jobs, addJob, updateJob, deleteJob, addStage };
}
