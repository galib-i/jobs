package main

import (
	"embed"

	"log"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := application.New(application.Options{
		Name:        "job-application-tracker",
		Description: "Track your job applications.",
		Services: []application.Service{
			application.NewService(NewJobService()),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},

	})

	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title: "Job Application Tracker",

		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              "/",
		MinWidth:         935,
		MinHeight:        400,
	})

	err := app.Run()
	if err != nil {
		log.Fatal(err)
	}
}
