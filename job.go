package main

import (
	"fmt"
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
	{"rejection", "#ef4444"},
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
	return strings.EqualFold(stage, "rejection") || strings.EqualFold(stage, "withdrawn") || strings.EqualFold(stage, "offer")
}

var DefaultAvailableStages = []string{"Interview", "Offer", "Rejection", "Withdrawn"}

type StageCount struct {
	Name  string `json:"name"`
	Count int    `json:"count"`
}

type StageEntry struct {
	Stage       string    `json:"stage" bson:"stage"`
	LastUpdated time.Time `json:"lastUpdated" bson:"last_updated"`
}

type FormattedStage struct {
	Raw     string `json:"raw"`
	Display string `json:"display"`
}

type Job struct {
	ID              string           `json:"id" bson:"_id,omitempty"`
	Company         string           `json:"company" bson:"company"`
	Role            string           `json:"role" bson:"role"`
	Location        string           `json:"location" bson:"location"`
	Link            string           `json:"link" bson:"link"`
	Description     string           `json:"description" bson:"description"`
	Notes           string           `json:"notes" bson:"notes"`
	Stages          []StageEntry     `json:"-" bson:"stages"`
	StagesList      []string         `json:"stages" bson:"-"`
	StageHistory    []StageCount     `json:"stageHistory" bson:"-"`
	FormattedStages []FormattedStage `json:"formattedStages" bson:"-"`
	CreatedAt       string           `json:"createdAt" bson:"created_at"`

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

func (j *Job) computeFields() {
	if len(j.StagesList) > 0 {
		j.LastStage = j.StagesList[len(j.StagesList)-1]
	}

	// Calculate StageHistory
	counts := make(map[string]int)
	var history []StageCount
	var formatted []FormattedStage

	for _, stage := range j.StagesList {
		if counts[stage] == 0 {
			history = append(history, StageCount{Name: stage, Count: 0})
		}
		counts[stage]++
		display := stage
		if counts[stage] > 1 {
			display = fmt.Sprintf("%s (%d)", stage, counts[stage])
		}
		formatted = append(formatted, FormattedStage{
			Raw:     stage,
			Display: display,
		})
	}

	// Update the counts in the ordered history slice
	for i, h := range history {
		history[i].Count = counts[h.Name]
	}
	j.StageHistory = history
	j.FormattedStages = formatted

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
