# Toggl Focus shell

A frontend prototype of [Toggl Focus](https://focus.toggl.com) with a calendar-first way to turn existing time into a billable project.

Open the live demo: **https://matmeirelles.github.io/toggl-focus-shell/**

## What it does

1. Sync a calendar (mocked) and scan the last 7 days.
2. Match work blocks to a project (Acme), skip personal time, and confirm billable hours.
3. Open the project Time tab to see assigned slots, planned vs logged, and a path to invoice.

No backend. All data is mocked in the browser.

## Stack

Vite, React, TypeScript, Tailwind CSS. Deployed on GitHub Pages.

## Run locally

```bash
npm install
npm run dev
```
