package main

import (
	"context"
	"encoding/base64"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type JobService struct {
	Client  *mongo.Client
	JobsCol *mongo.Collection
	Stages  *mongo.Collection
}

func NewJobService() *JobService {
	if err := godotenv.Load(); err != nil {
		log.Println("Failed to find a .env file")
	}

	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI is not set")
	}

	client, err := mongo.Connect(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("failed to connect to MongoDB: %v", err)
	}

	if err := client.Ping(context.TODO(), nil); err != nil {
		log.Fatalf("failed to ping MongoDB: %v", err)
	}

	db := client.Database("applications")
	jobsCol := db.Collection("jobs")
	stagesCol := db.Collection("stages")

	count, _ := stagesCol.CountDocuments(context.TODO(), bson.M{})
	if count == 0 {
		for _, stage := range DefaultAvailableStages {
			stagesCol.InsertOne(context.TODO(), bson.M{"name": stage})
		}
	}

	return &JobService{
		Client:  client,
		JobsCol: jobsCol,
		Stages:  stagesCol,
	}

}

func (js *JobService) AddAvailableStage(name string) error {
	_, err := js.Stages.InsertOne(context.TODO(), bson.M{"name": strings.TrimSpace(name)})
	if err != nil {
		log.Printf("failed to add available stage %s: %v", name, err)
		return err
	}

	return nil
}

func (js *JobService) DeleteAvailableStage(name string) error {
	if isLastStage(name) {
		return fmt.Errorf("cannot delete reserved stage: %s", name)
	}
	_, err := js.Stages.DeleteOne(context.TODO(), bson.M{"name": name})
	if err != nil {
		log.Printf("failed to delete available stage %s: %v", name, err)
		return err
	}

	return nil
}

func (js *JobService) ResetAvailableStages() error {
	if _, err := js.Stages.DeleteMany(context.TODO(), bson.M{}); err != nil {
		log.Printf("failed to clear available stages: %v", err)
		return err
	}

	for _, stage := range DefaultAvailableStages {
		if _, err := js.Stages.InsertOne(context.TODO(), bson.M{"name": stage}); err != nil {
			log.Printf("failed to insert default stage %s: %v", stage, err)
			return err
		}
	}

	return nil
}

func (js *JobService) SaveJob(j Job) (string, error) {
	j.Stages = []StageEntry{
		{Stage: "Application", LastUpdated: time.Now()},
	}
	j.CreatedAt = time.Now().Format(time.DateOnly)

	res, err := js.JobsCol.InsertOne(context.TODO(), j)
	if err != nil {
		return "", err
	}

	return res.InsertedID.(bson.ObjectID).Hex(), nil
}

func (js *JobService) DeleteJob(id string) error {
	objID, _ := bson.ObjectIDFromHex(id)
	_, err := js.JobsCol.DeleteOne(context.TODO(), bson.M{"_id": objID})

	return err
}

func (js *JobService) UpdateJob(j Job) error {
	objID, _ := bson.ObjectIDFromHex(j.ID)
	update := bson.M{
		"$set": bson.M{
			"company": j.Company, "role": j.Role, "location": j.Location,
			"link": j.Link, "description": j.Description, "notes": j.Notes,
		},
	}
	_, err := js.JobsCol.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)

	return err
}

func (js *JobService) WipeDatabase() error {
	_, err := js.JobsCol.DeleteMany(context.TODO(), bson.M{})
	if err != nil {
		log.Printf("failed to clear jobs: %v", err)
		return err
	}

	return nil
}

func (js *JobService) GetJobs(search string, stageSort string, dateSort string) ([]Job, error) {
	filter := bson.M{}

	// Case-insensitive search
	if search != "" {
		regex := bson.Regex{Pattern: search, Options: "i"}
		filter = bson.M{
			"$or": []bson.M{
				{"company": regex},
				{"role": regex},
			},
		}
	}

	// Fetch all matching jobs
	cursor, err := js.JobsCol.Find(context.TODO(), filter)
	if err != nil {
		log.Printf("failed to find jobs: %v", err)
		return nil, err
	}
	defer cursor.Close(context.TODO())

	var jobs []Job
	if err = cursor.All(context.TODO(), &jobs); err != nil {
		return nil, err
	}

	// Compute frontend fields
	for i := range jobs {
		var stageStrings []string
		for _, s := range jobs[i].Stages {
			stageStrings = append(stageStrings, s.Stage)
		}
		jobs[i].StagesList = stageStrings
		jobs[i].computeFields()
	}

	sort.Slice(jobs, func(i, j int) bool {
		// Sort by stage
		if stageSort == "asc" && jobs[i].LastStage != jobs[j].LastStage {
			return jobs[i].LastStage < jobs[j].LastStage
		} else if stageSort == "desc" && jobs[i].LastStage != jobs[j].LastStage {
			return jobs[i].LastStage > jobs[j].LastStage
		}

		// Sort by date
		dateI, dateJ := jobs[i].CreatedAt, jobs[j].CreatedAt
		if len(jobs[i].Stages) > 0 {
			dateI = jobs[i].Stages[len(jobs[i].Stages)-1].LastUpdated.Format(time.RFC3339)
		}
		if len(jobs[j].Stages) > 0 {
			dateJ = jobs[j].Stages[len(jobs[j].Stages)-1].LastUpdated.Format(time.RFC3339)
		}

		if dateSort == "asc" {
			return dateI < dateJ
		}
		return dateI > dateJ // Default to descending
	})

	return jobs, nil
}

func (js *JobService) AddJobStage(jobId string, stage string) error {
	objID, _ := bson.ObjectIDFromHex(jobId)

	newEntry := StageEntry{
		Stage:       stage,
		LastUpdated: time.Now(),
	}

	update := bson.M{"$push": bson.M{"stages": newEntry}}

	_, err := js.JobsCol.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)

	return err
}

func (js *JobService) RemoveJobStageAt(jobId string, index int) error {
	objID, _ := bson.ObjectIDFromHex(jobId)

	var job Job
	if err := js.JobsCol.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&job); err != nil {
		return err
	}

	if index < 0 || index >= len(job.Stages) {
		return fmt.Errorf("stage index out of bounds")
	}

	job.Stages = append(job.Stages[:index], job.Stages[index+1:]...)

	update := bson.M{"$set": bson.M{"stages": job.Stages}}
	_, err := js.JobsCol.UpdateOne(context.TODO(), bson.M{"_id": objID}, update)

	return err
}

func (js *JobService) ExportSankeyImage(base64Data string) (string, error) {
	idx := strings.Index(base64Data, ",")
	if idx != -1 {
		base64Data = base64Data[idx+1:]
	}

	decoded, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		log.Printf("failed to decode base64 image: %v", err)
		return "", err
	}

	filename := "sankey_diagram.png"
	err = os.WriteFile(filename, decoded, 0644)
	if err != nil {
		log.Printf("failed to write image to disk: %v", err)
		return "", err
	}

	absPath, err := filepath.Abs(filename)
	if err == nil {
		homeDir, err := os.UserHomeDir()
		if err == nil && strings.HasPrefix(absPath, homeDir) {
			return "~" + strings.TrimPrefix(absPath, homeDir), nil
		}
		return absPath, nil
	}

	return filename, nil
}

func (js *JobService) GetAvailableStages() []StageMetadata {
	// Fetch all documents in the Stages collection
	cursor, err := js.Stages.Find(context.TODO(), bson.M{})
	if err != nil {
		return []StageMetadata{}
	}
	defer cursor.Close(context.TODO())

	// Decode into a temporary struct just to grab the name
	var stageDocs []struct {
		Name string `bson:"name"`
	}
	if err = cursor.All(context.TODO(), &stageDocs); err != nil {
		return []StageMetadata{}
	}

	// Extract just the string names
	var stages []string
	for _, doc := range stageDocs {
		stages = append(stages, doc.Name)
	}

	sort.Slice(stages, func(i, j int) bool {
		return strings.ToLower(stages[i]) < strings.ToLower(stages[j])
	})

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
