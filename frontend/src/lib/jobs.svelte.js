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

export class JobStore {
  jobs = $state([]);
  availableStages = $state([]);

  searchQuery = $state("");
  stageSort = $state("none");
  dateSort = $state("desc");

  editingRowId = $state(null);
  expandedRowIds = $state(new Set());

  constructor() {
    this.loadJobs();
    this.loadStages();
  }

  async loadJobs() {
    try {
      const data = await GetJobs(this.searchQuery, this.stageSort, this.dateSort);
      this.jobs = data || [];
    } catch (err) {
      console.error(err);
    }
  }

  async loadStages() {
    try {
      const data = await GetAvailableStages();
      this.availableStages = data || [];
    } catch (err) {
      console.error(err);
    }
  }

  async addJob(job) {
    await SaveJob(job);
    await this.loadJobs();
  }

  async updateJob(job) {
    this.jobs = this.jobs.map((j) => (j.id === job.id ? job : j));
    await UpdateJob(job);
    await this.loadJobs();
  }

  async deleteJob(id) {
    this.jobs = this.jobs.filter((j) => j.id !== id);
    await DeleteJob(id);
    await this.loadJobs();
  }

  async addStage(jobId, stageName) {
    if (!stageName.trim()) return;
    this.jobs = this.jobs.map((j) => {
      if (j.id === jobId) {
        return { ...j, stages: [...(j.stages || []), stageName] };
      }
      return j;
    });
    await AddJobStage(jobId, stageName);
    await this.loadJobs();
  }

  async removeStage(jobId, index) {
    this.jobs = this.jobs.map((j) => {
      if (j.id === jobId) {
        const newStages = [...(j.stages || [])];
        newStages.splice(index, 1);
        return { ...j, stages: newStages };
      }
      return j;
    });
    await RemoveJobStageAt(jobId, index);
    await this.loadJobs();
  }

  async addAvailableStage(stageName) {
    if (!stageName.trim()) return;
    await AddAvailableStage(stageName);
    await this.loadStages();
  }

  async deleteAvailableStage(stageName) {
    await DeleteAvailableStage(stageName);
    await this.loadStages();
  }

  async resetAvailableStages() {
    await ResetAvailableStages();
    await this.loadStages();
  }

  async wipeDatabase() {
    await WipeDatabase();
    await this.loadJobs();
  }
}

export const jobStore = new JobStore();
