package main

import (
	"sort"
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
	CurrentStreak     int    `json:"currentStreak"`
	LongestStreak     int    `json:"longestStreak"`
	LongestStreakDate string `json:"longestStreakDate"`
	MostActiveDay     string `json:"mostActiveDay"`
	MostActivityCount int    `json:"mostActivityCount"`
	MostActivityDate  string `json:"mostActivityDate"`
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
	jobs, err := js.GetJobs("", "none", "desc")
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

		for i, stage := range job.StagesList {
			// Diagram should show steps, an index is added to treat each as a unique node
			current := NodeKey{Name: stage, Index: i}
			nodeCount[current]++

			if i < len(job.Stages)-1 {
				next := NodeKey{Name: job.StagesList[i+1], Index: i + 1}
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
	jobs, err := js.GetJobs("", "none", "desc")
	if err != nil {
		return nil, err
	}

	// If filtering by applications
	isAppsOnly := strings.HasSuffix(groupBy, "_apps")
	if isAppsOnly {
		groupBy = strings.TrimSuffix(groupBy, "_apps")
	}

	// Group the dates in Go
	counts := make(map[string]int)

	for _, job := range jobs {
		for _, stage := range job.Stages {
			if stage.LastUpdated.IsZero() {
				continue
			}
			if isAppsOnly && stage.Stage != "Application" {
				continue
			}

			var dateKey string
			t := stage.LastUpdated

			switch groupBy {
			case "month":
				dateKey = t.Format("2006-01")
			case "week":
				// Find the Monday of the week
				offset := int(time.Monday - t.Weekday())
				if offset > 0 {
					offset = -6
				}
				monday := t.AddDate(0, 0, offset)
				dateKey = monday.Format("2006-01-02")
			default:
				dateKey = t.Format("2006-01-02")
			}
			counts[dateKey]++
		}
	}

	// Sort chronologically
	var dates []string
	for k := range counts {
		dates = append(dates, k)
	}
	sort.Strings(dates)

	var finalCounts []int
	for _, d := range dates {
		finalCounts = append(finalCounts, counts[d])
	}

	return &TimelineData{Dates: dates, Counts: finalCounts}, nil
}

func (js *JobService) GetActivityStats() (*ActivityStats, error) {
	timeline, err := js.GetTimelineData("day")
	if err != nil {
		return nil, err
	}

	if timeline == nil || len(timeline.Dates) == 0 {
		return &ActivityStats{}, nil
	}

	// Build date -> count map and find most activity record
	countMap := make(map[string]int)
	mostActivityCount := 0
	mostActivityDate := ""

	for i, date := range timeline.Dates {
		count := timeline.Counts[i]
		countMap[date] = count
		if count > mostActivityCount {
			mostActivityCount = count
			mostActivityDate = date
		}
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
	longestStreakDate := ""

	if len(timeline.Dates) > 0 {
		tempStreak := 1
		tempEndDateStr := timeline.Dates[0]
		longestStreak = 1
		longestStreakDate = tempEndDateStr

		for i := 1; i < len(timeline.Dates); i++ {
			curr, _ := time.Parse("2006-01-02", timeline.Dates[i])
			prev, _ := time.Parse("2006-01-02", timeline.Dates[i-1])

			// Check if consecutive day
			if curr.Sub(prev).Hours() == 24 {
				tempStreak++
			} else {
				tempStreak = 1
			}
			tempEndDateStr = timeline.Dates[i]

			if tempStreak > longestStreak {
				longestStreak = tempStreak
				longestStreakDate = tempEndDateStr
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
		CurrentStreak:     currentStreak,
		LongestStreak:     longestStreak,
		LongestStreakDate: longestStreakDate,
		MostActiveDay:     dayNames[maxDay],
		MostActivityCount: mostActivityCount,
		MostActivityDate:  mostActivityDate,
	}, nil
}

type HeatmapResult struct {
	HeatmapData [][]any  `json:"heatmapData"`
	Weeks       []string `json:"weeks"`
}

func (js *JobService) GetHeatmapData() (*HeatmapResult, error) {
	timeline, err := js.GetTimelineData("day")
	if err != nil {
		return nil, err
	}

	countMap := make(map[string]int)
	if timeline != nil {
		for i, d := range timeline.Dates {
			countMap[d] = timeline.Counts[i]
		}
	}

	now := time.Now()
	year := now.Year()

	firstOfYear := time.Date(year, time.January, 1, 0, 0, 0, 0, time.UTC)
	lastOfYear := time.Date(year, time.December, 31, 0, 0, 0, 0, time.UTC)

	// End at the Saturday of the week containing Dec 31st
	endDate := lastOfYear.AddDate(0, 0, int(time.Saturday-lastOfYear.Weekday()))
	// Start at the Sunday of the week containing Jan 1st
	currDate := firstOfYear.AddDate(0, 0, -int(firstOfYear.Weekday()))

	var weeks []string
	var heatmapData [][]any

	weekIndex := 0
	for currDate.Before(endDate) || currDate.Equal(endDate) {
		weeks = append(weeks, currDate.Format("2006-01-02"))

		for dayIndex := range 7 {
			dStr := currDate.Format("2006-01-02")
			count := countMap[dStr]
			heatmapData = append(heatmapData, []any{weekIndex, dayIndex, count, dStr})
			currDate = currDate.AddDate(0, 0, 1)
		}
		weekIndex++
	}

	return &HeatmapResult{HeatmapData: heatmapData, Weeks: weeks}, nil
}
