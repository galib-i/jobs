import { useState, useEffect, useCallback } from "react";
import {
  GetJobs,
  SaveJob,
  DeleteJob,
  UpdateJob,
  AddJobStage,
  GetAvailableStages,
  AddAvailableStage,
  DeleteAvailableStage,
  ResetAvailableStages,
  WipeDatabase,
  RemoveJobStageAt,
} from "../../bindings/jobs/jobservice";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [availableStages, setAvailableStages] = useState([]);

  const loadJobs = useCallback(async () => {
    try {
      const data = await GetJobs();
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadStages = useCallback(async () => {
    try {
      const data = await GetAvailableStages();
      setAvailableStages(data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    loadStages();
  }, [loadJobs, loadStages]);

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

  const removeStage = async (jobId, index) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const newStages = [...(j.stages || [])];
          newStages.splice(index, 1);
          return { ...j, stages: newStages };
        }
        return j;
      }),
    );
    await RemoveJobStageAt(jobId, index);
    loadJobs();
  };

  const addAvailableStage = async (stageName) => {
    if (!stageName.trim()) return;
    await AddAvailableStage(stageName);
    loadStages();
  };

  const deleteAvailableStage = async (stageName) => {
    await DeleteAvailableStage(stageName);
    loadStages();
  };

  const resetAvailableStages = async () => {
    await ResetAvailableStages();
    loadStages();
  };

  const wipeDatabase = async () => {
    await WipeDatabase();
    loadJobs();
  };

  return {
    jobs,
    availableStages,
    addJob,
    updateJob,
    deleteJob,
    addStage,
    removeStage,
    addAvailableStage,
    deleteAvailableStage,
    resetAvailableStages,
    wipeDatabase,
  };
}
