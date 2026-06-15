package main

import (
	"database/sql"
	"log"

	_ "modernc.org/sqlite"
)

type JobService struct {
	Database *sql.DB
}

type Job struct {
	ID      int64  `json:"id"`
	Company string `json:"company"`
	Role    string `json:"role"`
}

func NewJobService() *JobService {
	db, err := sql.Open("sqlite", "jobs.db")

	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}

	query := `CREATE TABLE IF NOT EXISTS jobs (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				company TEXT NOT NULL,
				role TEXT NOT NULL
	)`

	if _, err := db.Exec(query); err != nil {
		log.Fatalf("failed to create table: %v", err)
	}

	return &JobService{Database: db}
}

func (g *JobService) SaveJob(company string, role string) (int64, error) {
	query := `INSERT INTO jobs (company, role)
				VALUES (?, ?)`

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
	query := `SELECT id, company, role
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

		if err := rows.Scan(&currentJob.ID, &currentJob.Company, &currentJob.Role); err != nil {
			log.Printf("failed to scan job: %v", err)
			return nil, err
		}

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
