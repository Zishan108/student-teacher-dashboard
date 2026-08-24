# Joineazy — Student, Group & Assignment Management System

A role-based full-stack web application where students self-organize into groups and confirm assignment submissions, while professors post assignments and track completion in real time.

Built for the Joineazy Full Stack Intern technical task.

---

## Overview

Joineazy replaces manual spreadsheet tracking for group assignments. Students create their own groups, add teammates by email, and confirm submissions through a deliberate two-step flow ("Yes, I have submitted" → final confirm) to avoid accidental mark-offs. Professors post assignments — targeted at all groups or specific ones — and get a live dashboard showing group-wise and student-wise submission status, plus completion analytics.

**Roles:**
- **Student** — creates/joins groups, views assignments, confirms submissions
- **Admin (Professor)** — creates/edits/deletes assignments, tracks group and student-level progress, views analytics

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS v4, Framer Motion, Recharts |
| Backend | Node.js, Express |
| Database | PostgreSQL, Sequelize ORM |
| Auth | JWT (role-based: student / admin) |
| Containerization | Docker, Docker Compose |

---

## Project Structure

joineazy-task/
├── backend/
│ ├── src/
│ │ ├── config/ # Sequelize DB connection
│ │ ├── middleware/ # JWT auth + role authorization
│ │ ├── models/ # Sequelize models + associations
│ │ ├── routes/ # Express route handlers
│ │ └── server.js
│ ├── Dockerfile
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── api/ # Axios API client + endpoint wrappers
│ │ ├── components/ # Shared UI (Layout, StatusStamp, etc.)
│ │ ├── context/ # Auth + Theme context providers
│ │ ├── pages/ # Route-level pages (student/, admin/)
│ │ └── routes/ # React Router config
│ ├── Dockerfile
│ └── package.json
├── docker-compose.yml
└── README.md


---

## Setup & Run Instructions

### Option A — Run with Docker (recommended)

Requires Docker Desktop installed and running.

```bash
git clone <your-repo-url>
cd joineazy-task
docker compose up --build
```

This starts three containers: PostgreSQL (`db`), the Express API (`backend`, port 5000), and the React frontend served statically (`frontend`, port 3000).

Once running, open **http://localhost:3000**.

### Option B — Run manually (without Docker)

**Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=joineazy
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_long_random_secret


Start a local Postgres instance (via Docker is easiest):
```bash
docker run --name joineazy-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=joineazy -p 5432:5432 -d postgres:16
```

Run the backend:
```bash
npm run dev
```

**Frontend** (new terminal):
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

---

## Database Schema & Relationships

**Tables:** `users`, `groups`, `group_members`, `assignments`, `assignment_groups`, `submissions`

- A **User** (`role`: student/admin) can create many **Groups**, and belongs to many **Groups** through **GroupMembers** (many-to-many).
- A **User** (admin) creates many **Assignments**.
- An **Assignment** can target specific **Groups** via **AssignmentGroups** (many-to-many), or all groups.
- A **Submission** links one **Assignment** to one **Group**, tracks `status` (`pending` → `step1_confirmed` → `confirmed`), and records which **User** (`confirmedBy`) completed the confirmation.

**ER Diagram (textual):**

┌─────────┐ ┌──────────────┐ ┌─────────┐
│ users │──1:N──│ group_members│──N:1──│ groups │
└─────────┘ └──────────────┘ └─────────┘
│ │
│ 1:N (createdBy) │ N:M
▼ ▼
┌─────────────┐ ┌───────────────────┐ ┌──────────────┐
│ assignments │──<│ assignment_groups │>─│ groups │
└─────────────┘ └───────────────────┘ └──────────────┘
│ │
└──────────────< submissions >───────────┘
(assignmentId, groupId,
status, confirmedBy)


---

## Architecture Overview

- **Frontend (React + Vite)** — talks to the backend exclusively via a REST API, using an Axios instance that auto-attaches the JWT from `localStorage` to every request. Role-based routing (`ProtectedRoute`) restricts `/student` and `/admin` dashboards by decoded JWT role.
- **Backend (Express)** — stateless REST API. JWT middleware (`authenticate`) verifies tokens; `authorize(role)` middleware gates admin-only routes. Sequelize handles all DB access and model associations.
- **Database (PostgreSQL)** — normalized relational schema; Sequelize's `sync({ alter: true })` keeps tables in sync with models during development.
- **Flow:** Browser → React (port 3000/5173) → Express API (port 5000) → PostgreSQL (port 5432). In Docker, all three run as separate containers on a shared bridge network, referencing each other by service name (`db`, `backend`).

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register (student or admin) |
| POST | `/auth/login` | Login, returns JWT |

### Groups
| Method | Endpoint | Description |
|---|---|---|
| POST | `/groups` | Create a group |
| POST | `/groups/:id/members` | Add member by email |
| DELETE | `/groups/:id/members/:userId` | Remove a member |
| GET | `/groups/:id` | Get a group + members |
| GET | `/groups` | Get logged-in user's groups |
| GET | `/groups/all` | Get all groups (admin only) |

### Assignments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/assignments` | Create assignment (admin only) |
| PATCH | `/assignments/:id` | Edit assignment (admin only) |
| DELETE | `/assignments/:id` | Delete assignment (admin only) |
| GET | `/assignments` | List all assignments |
| GET | `/assignments/:id` | Get one assignment |

### Submissions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/submissions/:id/step1` | Step 1: "Yes, I have submitted" |
| POST | `/submissions/:id/confirm` | Step 2: final confirmation |
| GET | `/submissions/group/:groupId` | Submissions for a group |
| GET | `/submissions/assignment/:assignmentId` | Submissions for an assignment (admin) |
| GET | `/submissions/analytics` | Completion analytics (admin only) |

All endpoints except `/auth/*` require `Authorization: Bearer <token>`.

---

## Key Design Decisions

- **Two-step submission confirmation** is enforced at the database level via a `status` enum (`pending` → `step1_confirmed` → `confirmed`), not just in the UI — the API rejects a step-2 confirmation if step 1 hasn't happened first.
- **Submissions are pre-created** when an assignment is made, one row per targeted group, so progress can be tracked from "not started" rather than only appearing once a student acts.
- **Role authorization** is enforced server-side via Express middleware (`authorize('admin')`), not just hidden in the UI — student tokens are rejected with 403 on admin-only routes even if called directly.
- **JWT stored in `localStorage`** with the role embedded in the payload, decoded client-side for route protection (`ProtectedRoute`) and re-verified server-side on every request.
- **Dockerized as three services** (db, backend, frontend) with a Postgres healthcheck gating backend startup, avoiding the common "backend crashes before DB is ready" race condition.

---

## Deployment

- **Frontend:** [add deployed URL here]
- **Backend:** [add deployed URL here]
- **Demo video:** [add link here]