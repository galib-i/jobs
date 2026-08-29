package main

import (
	"strings"
	"time"
)

var stageColourRules = []struct {
	key    string
	colour string
}{
	{"application", "#64748b"},
	{"interview", "#eab308"},
	{"offer", "#22c55e"},
	{"rejected", "#ef4444"},
	{"withdrawn", "#94a3b8"},
}

const (
	defaultStageColour = "#eab308"
	yellowColour       = "#eab308"
	darkTextColour     = "#1e293b"
	whiteColour        = "#ffffff"
)

func getStageColour(stage string) string {
	stage = strings.ToLower(stage)

	for _, rule := range stageColourRules {
		if strings.Contains(stage, rule.key) {
			return rule.colour
		}
	}
	return defaultStageColour
}

func getStageTextColour(bgColour string) string {
	if bgColour == yellowColour {
		return darkTextColour
	}
	return whiteColour
}

func isLastStage(stage string) bool {
	return strings.EqualFold(stage, "rejected") || strings.EqualFold(stage, "withdrawn") || strings.EqualFold(stage, "offer")
}

var DefaultAvailableStages = []string{"Interview", "Offer", "Rejected", "Withdrawn"}

type Job struct {
	ID          int64    `json:"id"`
	Company     string   `json:"company"`
	Role        string   `json:"role"`
	Location    string   `json:"location"`
	Link        string   `json:"link"`
	Description string   `json:"description"`
	Notes       string   `json:"notes"`
	Stages      []string `json:"stages"`
	CreatedAt   string   `json:"createdAt"`

	// Not stored in database
	LastStage           string `json:"lastStage"`
	LastStageColour     string `json:"lastStageColour"`
	LastStageTextColour string `json:"lastStageTextColour"`
	FormattedDate       string `json:"formattedDate"`
	IsActive            bool   `json:"isActive"`
}

type StageMetadata struct {
	Name       string `json:"name"`
	Colour     string `json:"colour"`
	TextColour string `json:"textColour"`
	IsLast     bool   `json:"isLast"`
}

func (js *JobService) GetAvailableStages() []StageMetadata {
	rows, err := js.Database.Query(`SELECT name FROM available_stages ORDER BY id ASC`)
	if err != nil {
		return []StageMetadata{} // Return empty list on error
	}
	defer rows.Close()

	var stages []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err == nil {
			stages = append(stages, name)
		}
	}

	meta := make([]StageMetadata, 0, len(stages))
	for _, s := range stages {
		bg := getStageColour(s)
		meta = append(meta, StageMetadata{
			Name:       s,
			Colour:     bg,
			TextColour: getStageTextColour(bg),
			IsLast:     isLastStage(s),
		})
	}
	return meta
}

func (j *Job) computeFields() {
	if len(j.Stages) > 0 {
		j.LastStage = j.Stages[len(j.Stages)-1]
	}

	j.LastStageColour = getStageColour(j.LastStage)
	j.LastStageTextColour = getStageTextColour(j.LastStageColour)

	if j.CreatedAt != "" {
		t, err := time.Parse(time.DateOnly, j.CreatedAt)
		if err == nil {
			j.FormattedDate = t.Format("02-01-06") // dd-mm-yy
		} else {
			j.FormattedDate = j.CreatedAt
		}
	} else {
		j.FormattedDate = "Unknown"
	}

	// Determine if job is active based on its last stage
	j.IsActive = !isLastStage(j.LastStage)
}
