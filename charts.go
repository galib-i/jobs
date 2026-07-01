package main

import (
	"strconv"
	"strings"
)

type SankeyNode struct {
	Name       string `json:"name"`
	CleanName  string `json:"cleanName"`
	Colour     string `json:"colour"`
	TextColour string `json:"textColour"`
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

	nodeSet := make(map[NodeKey]bool)
	linkMap := make(map[LinkKey]int)

	for _, job := range jobs {
		if len(job.Stages) == 0 {
			continue
		}

		for i, stage := range job.Stages {
			// Diagram should show step-by-step and not looping back - an index is added to treat each as a unique node
			current := NodeKey{Name: stage, Index: i}
			nodeSet[current] = true

			if i < len(job.Stages)-1 {
				next := NodeKey{Name: job.Stages[i+1], Index: i + 1}
				linkKey := LinkKey{Source: current, Target: next}
				linkMap[linkKey]++
			}
		}
	}

	if len(nodeSet) == 0 {
		return nil, nil
	}

	nodes := make([]SankeyNode, 0, len(nodeSet))
	for nodeKey := range nodeSet {
		bg := getStageColour(nodeKey.Name)
		nodes = append(nodes, SankeyNode{
			// Create a unique string name only when sending to the frontend
			Name:       nodeKey.Name + "__" + strconv.Itoa(nodeKey.Index),
			CleanName:  nodeKey.Name,
			Colour:     bg,
			TextColour: getStageTextColour(bg),
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
