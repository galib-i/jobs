package main

import (
	"database/sql"
	"log"
	"strings"

	_ "modernc.org/sqlite"
)

type JobService struct {
	Database *sql.DB
}

type Job struct {
	ID      int64    `json:"id"`
	Company string   `json:"company"`
	Role      string   `json:"role"`
	Stages    []string `json:"stages"`
	CreatedAt string   `json:"createdAt"`
}

func NewJobService() *JobService {
	db, err := sql.Open("sqlite", "jobs.db?_pragma=foreign_keys(1)")

	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}

	query := `CREATE TABLE IF NOT EXISTS jobs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				company TEXT NOT NULL,
				role TEXT NOT NULL
				);
				
				CREATE TABLE IF NOT EXISTS stages (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				job_id INTEGER,
				stage TEXT NOT NULL,
				last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
				)`

	if _, err := db.Exec(query); err != nil {
		log.Fatalf("failed to create tables: %v", err)
	}

	return &JobService{Database: db}
}

func (g *JobService) SaveJob(company string, role string) (int64, error) {
	query := `INSERT INTO jobs (company, role)
				VALUES (?, ?);
				
				INSERT INTO stages (job_id, stage)
				VALUES (last_insert_rowid(), 'Application')`

	result, err := g.Database.Exec(query, company, role)
	if err != nil {
		log.Printf("failed to save job (%s, %s): %v", company, role, err)
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (g *JobService) GetJobs() ([]Job, error) {
	query := `SELECT jobs.id, jobs.company, jobs.role, coalesce((SELECT group_concat(stage, ',')
				FROM (SELECT stage FROM stages WHERE job_id = jobs.id ORDER BY id ASC)), ''),
				coalesce((SELECT date(last_updated) FROM stages WHERE job_id = jobs.id ORDER BY id ASC LIMIT 1), date('now'))
				FROM jobs`

	rows, err := g.Database.Query(query)
	if err != nil {
		log.Printf("failed to get all jobs: %v", err)
		return nil, err
	}
	defer rows.Close()

	var jobs []Job

	for rows.Next() {
		var currentJob Job
		var stagesString string

		if err := rows.Scan(&currentJob.ID, &currentJob.Company, &currentJob.Role, &stagesString, &currentJob.CreatedAt); err != nil {
			log.Printf("failed to scan job: %v", err)
			return nil, err
		}

		currentJob.Stages = strings.Split(stagesString, ",")
		jobs = append(jobs, currentJob)
	}

	if err := rows.Err(); err != nil {
		log.Printf("failed to read rows: %v", err)
		return nil, err
	}

	return jobs, nil
}

func (g *JobService) DeleteJob(id int64) error {
	query := `DELETE FROM jobs
				WHERE id = ?`

	if _, err := g.Database.Exec(query, id); err != nil {
		log.Printf("failed to delete job (id: %v): %v", id, err)
		return err
	}

	return nil
}

func (g *JobService) UpdateJob(id int64, company string, role string) error {
	query := `UPDATE jobs
				SET company = ?, role = ?
				WHERE id = ?`

	if _, err := g.Database.Exec(query, company, role, id); err != nil {
		log.Printf("failed to edit job (id: %v): %v", id, err)
		return err
	}

	return nil
}

func (g *JobService) AddJobStage(jobId int64, stage string) error {
	query := `INSERT INTO stages (job_id, stage)
				VALUES (?, ?)`

	if _, err := g.Database.Exec(query, jobId, stage); err != nil {
		log.Printf("failed to add stage to job (id: %v): %v", jobId, err)
		return err
	}

	return nil
}
