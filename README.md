# Simple Job Application Tracker

A local Wails v3 desktop application for tracking job applications and visualising your interview progress.
> [!NOTE]
> 
> <details>
> <summary>Screenshots</summary>
>
> <img width="1920" height="1020" alt="Screenshot_1" src="https://github.com/user-attachments/assets/7347f61b-8215-4725-b363-1cccc35bed91" />
> <img width="1920" height="1020" alt="Screenshot_2" src="https://github.com/user-attachments/assets/45c29f7b-dcc6-4426-84d4-6949bfb6e626" />
>
> </details>

- Log companies, roles, locations, application links and custom notes.
- Create and manage custom stages.
- Visualise progress through an activity heatmap, a time volume chart and a sankey diagram.

## Get Started
### Installation

Download the latest pre-compiled version for your operating system.

1. Download the file for your OS (Windows, macOS, or Linux) from the [Releases page](../../releases/latest).
2. Extract the file and run the application.

### Development
To build and run this project from source, you will need:

- **[Wails v3](https://v3.wails.io/quick-start/installation/)** for the Wails CLI and its system dependencies.
- **[Bun](https://bun.sh/)** for the JavaScript runtime and package manager for the frontend.

1. Clone the repository and install the frontend packages:
```bash
git clone https://github.com/galib-i/jobs.git
cd jobs/frontend
bun install
cd ..
```

2. Use `wails3 dev` to start the application with live-reloading.
3. Use `wails3 task build` or `wails3 build` to create [binaries](https://v3.wails.io/guides/build/building/).
