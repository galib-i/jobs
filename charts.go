package main

import (
	"strconv"
	"strings"
	"time"
)

type SankeyNode struct {
	Name       string `json:"name"`
	CleanName  string `json:"cleanName"`
	Colour     string `json:"colour"`
	TextColour string `json:"textColour"`
	Value      int    `json:"value"`
}

type SankeyLink struct {
	Source string `json:"source"`
	Target string `json:"target"`
	Value  int    `json:"value"`
}

type SankeyData struct {
	Nodes []SankeyNode `json:"nodes"`
	Links []SankeyLink `json:"links"`
}

type TimelineData struct {
	Dates  []string `json:"dates"`
	Counts []int    `json:"counts"`
}

type ActivityStats struct {
	CurrentStreak      int    `json:"currentStreak"`
	LongestStreak      int    `json:"longestStreak"`
	LongestStreakMonth string `json:"longestStreakMonth"`
	MostActiveDay      string `json:"mostActiveDay"`
}

type NodeKey struct {
	Name  string
	Index int
}

type LinkKey struct {
	Source NodeKey
	Target NodeKey
}

func (js *JobService) GetSankeyData() (*SankeyData, error) {
	jobs, err := js.GetJobs()
	if err != nil {
		return nil, err
	}

	if len(jobs) == 0 {
		return nil, nil
	}

	nodeCount := make(map[NodeKey]int)
	linkMap := make(map[LinkKey]int)

	for _, job := range jobs {
		if len(job.Stages) == 0 {
			continue
		}

		for i, stage := range job.Stages {
			// Diagram should show step-by-step and not looping back - an index is added to treat each as a unique node
			current := NodeKey{Name: stage, Index: i}
			nodeCount[current]++

			if i < len(job.Stages)-1 {
				next := NodeKey{Name: job.Stages[i+1], Index: i + 1}
				linkKey := LinkKey{Source: current, Target: next}
				linkMap[linkKey]++
			}
		}
	}

	if len(nodeCount) == 0 {
		return nil, nil
	}

	nodes := make([]SankeyNode, 0, len(nodeCount))
	for nodeKey, count := range nodeCount {
		bg := getStageColour(nodeKey.Name)
		nodes = append(nodes, SankeyNode{
			// Create a unique string name only when sending to the frontend
			Name:       nodeKey.Name + "__" + strconv.Itoa(nodeKey.Index),
			CleanName:  nodeKey.Name,
			Colour:     bg,
			TextColour: getStageTextColour(bg),
			Value:      count,
		})
	}

	links := make([]SankeyLink, 0, len(linkMap))
	for linkKey, count := range linkMap {
		links = append(links, SankeyLink{
			Source: linkKey.Source.Name + "__" + strconv.Itoa(linkKey.Source.Index),
			Target: linkKey.Target.Name + "__" + strconv.Itoa(linkKey.Target.Index),
			Value:  count,
		})
	}

	return &SankeyData{Nodes: nodes, Links: links}, nil
}

func (js *JobService) GetTimelineData(groupBy string) (*TimelineData, error) {
	dateExpr := `date(last_updated)`
	filterExpr := `WHERE last_updated IS NOT NULL`

	if strings.HasSuffix(groupBy, "_apps") {
		filterExpr += ` AND stage = 'Application'`
		groupBy = strings.TrimSuffix(groupBy, "_apps")
	}

	switch groupBy {
	case "month":
		dateExpr = `strftime('%Y-%m', last_updated)`
	case "week":
		dateExpr = `date(last_updated, 'weekday 0', '-6 days')` // Gets the Monday of the current week
	}

	query := `SELECT ` + dateExpr + ` as date_group, count(*) 
			  FROM stages 
			  ` + filterExpr + `
			  GROUP BY date_group 
			  ORDER BY date_group ASC`

	rows, err := js.Database.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dates []string
	var counts []int

	for rows.Next() {
		var dateStr string
		var count int
		if err := rows.Scan(&dateStr, &count); err != nil {
			return nil, err
		}

		dates = append(dates, dateStr)
		counts = append(counts, count)
	}

	return &TimelineData{Dates: dates, Counts: counts}, nil
}

func (js *JobService) GetActivityStats() (*ActivityStats, error) {
	timeline, err := js.GetTimelineData("day")
	if err != nil {
		return nil, err
	}

	if timeline == nil || len(timeline.Dates) == 0 {
		return &ActivityStats{}, nil
	}

	// Build date -> count map
	countMap := make(map[string]int)
	for i, date := range timeline.Dates {
		countMap[date] = timeline.Counts[i]
	}

	// Current streak: consecutive days ending at today (or yesterday)
	today := time.Now().Truncate(24 * time.Hour)
	checkDate := today

	// If no activity today, try starting from yesterday
	if countMap[checkDate.Format("2006-01-02")] == 0 {
		checkDate = checkDate.AddDate(0, 0, -1)
	}

	currentStreak := 0
	for {
		key := checkDate.Format("2006-01-02")
		if countMap[key] > 0 {
			currentStreak++
			checkDate = checkDate.AddDate(0, 0, -1)
		} else {
			break
		}
	}

	// Longest streak
	longestStreak := 0
	longestStreakMonth := ""

	if len(timeline.Dates) > 0 {
		tempStreak := 1
		tempStart, _ := time.Parse("2006-01-02", timeline.Dates[0])
		longestStreak = 1
		longestStreakMonth = tempStart.Month().String()

		for i := 1; i < len(timeline.Dates); i++ {
			curr, _ := time.Parse("2006-01-02", timeline.Dates[i])
			prev, _ := time.Parse("2006-01-02", timeline.Dates[i-1])

			// Check if consecutive day
			if curr.Sub(prev).Hours() == 24 {
				tempStreak++
			} else {
				tempStreak = 1
				tempStart = curr
			}

			if tempStreak > longestStreak {
				longestStreak = tempStreak
				longestStreakMonth = tempStart.Month().String()
			}
		}
	}

	// Most active day of week
	dayNames := []string{"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"}
	dayTotals := make([]int, 7)
	for i, dateStr := range timeline.Dates {
		t, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			continue
		}
		dayTotals[t.Weekday()] += timeline.Counts[i]
	}

	maxDay := 0
	for i, total := range dayTotals {
		if total > dayTotals[maxDay] {
			maxDay = i
		}
	}

	return &ActivityStats{
		CurrentStreak:      currentStreak,
		LongestStreak:      longestStreak,
		LongestStreakMonth: longestStreakMonth,
		MostActiveDay:      dayNames[maxDay],
	}, nil
}
