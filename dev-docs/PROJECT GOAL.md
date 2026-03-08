PROJECT GOAL
Create a frontend-only Angular web application called **Static Apps Manager** to manage and monitor multiple static web applications hosted on **GitHub Pages** under one main domain with multiple subdomains.

The goal of this project is to provide a **central dashboard to manage 50+ static apps**.
Initially the system must be **frontend-only (Angular)** with no backend. Later it will support a backend for secure operations.

TECH STACK

* Angular (latest version)
* TypeScript
* Angular Material (or another UI library if better)
* RxJS
* GitHub REST API (read-only operations only)
* Responsive dashboard layout

IMPORTANT CONSTRAINTS

* No backend for now
* No private GitHub tokens stored in the code
* Only public GitHub API calls
* Focus on architecture that can later integrate a backend

CORE FEATURES (INITIAL VERSION)

1. Apps Dashboard

* Display a list of all managed static apps
* Each app card shows:

  * app name
  * repository name
  * framework (Angular / React / other)
  * subdomain URL
  * last deployment time
  * status indicator (online/offline)

2. App Configuration
   Apps should be defined using a configuration file (apps.json).

Example structure:

{
"apps": [
{
"name": "portfolio",
"repo": "portfolio-site",
"framework": "angular",
"domain": "portfolio.mydomain.com",
"githubRepoUrl": "https://github.com/username/portfolio-site"
}
]
}

3. GitHub Integration (Public Data Only)
   Using GitHub REST API:

Show:

* latest commit
* last commit date
* repo stars
* repo status

API example:
GET https://api.github.com/repos/{owner}/{repo}

4. Deployment Information
   Display:

* latest commit hash
* latest commit message
* last updated date

API example:
GET /repos/{owner}/{repo}/commits

5. Health Monitoring
   Check whether the deployed site is reachable.

Implementation:

* periodically ping the app domain
* mark status as:

  * online
  * offline

6. App Detail Page
   Clicking an app opens a detail view showing:

* repository information
* last commits
* link to GitHub repository
* link to deployed site
* health status

7. Filtering & Search
   Allow filtering apps by:

* framework
* status
* name search

8. Clean Dashboard UI
   Create a dashboard layout with:

* sidebar navigation
* main content area
* responsive app cards

9. Architecture Requirements
   Structure the Angular project using a scalable architecture:

modules/
core/
shared/
dashboard/
apps/
services/
models/

Include:

* AppService
* GithubService
* HealthCheckService

10. Future Ready Design
    Design services so they can later support backend endpoints.

Example:

Current:
GithubService -> GitHub API

Future:
GithubService -> Backend API -> GitHub API

Deliverables Expected From Copilot

* Angular project structure
* Models/interfaces
* Services for GitHub API
* Dashboard components
* App list component
* App detail component
* Health check service
* Config loader service for apps.json
* Basic UI layout

The code should be clean, modular, and production ready.
