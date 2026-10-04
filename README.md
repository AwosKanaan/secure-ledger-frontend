<div align="center">

# Secure Ledger Frontend

**Vue 3 dashboard to add and see your transactions in the Secure Ledger API**

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

## Features

- Login with JWT kept in memory
- Transactions table with sorting, pagination and date filter
- Create transaction dialog with validation
- Idempotency key on every new transaction
- Toasts and alerts for API errors
- Works on phone, tablet and desktop

## Getting started

The full stack is started from the [backend repository](https://github.com/AwosKanaan/secure-ledger), you need to clone both repositories in same folder

```bash
git clone https://github.com/AwosKanaan/secure-ledger.git
git clone https://github.com/AwosKanaan/secure-ledger-frontend.git
cd secure-ledger
docker compose up --build
```

Then open http://localhost:5173 and login with `gilbert@gmail.com` / `gilbert123` or `bob@ledger.test` / `Ledger-Test-2026!`

For local development (the API must run on http://localhost:8080)

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type check and build to dist/
```

## Architecture

```mermaid
flowchart LR
    User((User)) --> Router["Vue Router<br/>auth guard"]
    Router --> Views["Views<br/>LoginView, DashboardView"]
    Router -.->|"not logged in"| Login["/login"]
    Views --> Components["Components<br/>table, filters, pagination, dialog"]
    Views --> Composables["Composables<br/>useAuth, useTransactions,<br/>useCreateTransaction"]
    Components --> Composables
    Composables --> Query["TanStack Query<br/>cache"]
    Composables --> API["API layer<br/>fetch wrapper"]
    Query --> API
    API -->|"/ledger + JWT"| Proxy["Vite proxy / nginx"]
    Proxy --> Backend[("Spring Boot API")]
```

```
src
├── api           HTTP calls
├── composables   state and logic
├── components    UI parts
├── views         pages
├── utils         validation and formatting
└── router.ts     routes and auth guard
```

## Configuration

The app calls `/ledger` on same origin, Vite or nginx forward it to the API

| Variable           | Default                 | What it does                                  |
|--------------------|-------------------------|-----------------------------------------------|
| `API_PROXY_TARGET` | `http://localhost:8080` | API address for the dev proxy                 |
| `VITE_API_URL`     | empty (same origin)     | API base URL on other origin, set at build time |
