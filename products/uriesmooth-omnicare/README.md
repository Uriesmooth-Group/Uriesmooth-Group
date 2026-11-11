# Uriesmooth OmniCare

**Uriesmooth Group** · Independent technology company

OmniCare is a modular device-care workspace with a GitHub-backed source and version-control panel. This repository folder is the initial application foundation.

## Included modules

- Dashboard and local status overview
- Telemetry ring (local demonstration; no telemetry upload)
- Windows Update / DISM / SFC repair-command generator (review only; never executes commands)
- Battery Governor profile recommendations (does not change device settings)
- Junk Cleaner safety planner (does not scan or delete files)
- OmniCare Digital Store catalog foundation
- Source repository panel with live GitHub metadata, branches, recent commits, package manifest and HTML source viewer
- One-click standalone HTML export and clipboard copy

## Requirements

- Node.js 20+
- npm
- Optional GitHub fine-grained token for private repository access

## Local setup

```sh
cd products/uriesmooth-omnicare
cp .env.example .env
npm install
npm start
```

Open `http://localhost:3000`.

Set `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` and (if needed) `GITHUB_TOKEN` in the server environment. The token must remain server-side. Grant only read access to repository metadata and contents. Never paste the token into the HTML or commit it.

The repository panel reads the configured repository through `GET /api/repository`. When GitHub is unavailable, the interface reports the failure rather than inventing commits or synchronization success.

## Export and local deployment

Use **Download HTML** or **Download .html** to export `uriesmooth_omnicare.html`. The exported file contains the client interface and can be opened locally. Repository integration requires the Node server and its environment configuration; it is not embedded in the static export. Clipboard copy requires a browser context that permits clipboard access.

## Safety boundaries

This is not an endpoint-management agent or certified diagnostic product. It does not execute Windows commands, change battery/power settings, inspect private device files, or delete data. Repair instructions are suggestions for a human to review and run independently. Add explicit consent, platform-specific validation, authorization and audit logging before implementing device-management actions.

## Deployment

Deploy as a Node.js 20+ web service with `npm install` and `npm start`. Set `PORT` and the GitHub environment variables in the host's secret manager. Use HTTPS. Do not expose the GitHub token to client-side JavaScript. Production deployment, custom domains, monitoring, and access-control hardening are separate steps and are not claimed complete by this scaffold.

## Current status

Foundation scaffold; not yet human-accepted, production-hardened, or deployed. Verify dependencies, test on the target host, review security, and approve a pull request before merging to `main`.
