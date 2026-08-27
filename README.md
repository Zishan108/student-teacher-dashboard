# Joineazy — Student, Group & Assignment Management System (Round 2)

An enhanced, course-based full-stack platform where professors manage courses and assignments while students self-organize into groups, submit work, and track progress — with role-based dashboards, group-leader-only acknowledgment, and live analytics.

Built for the Joineazy Full Stack Intern technical assessment, Task 2.

---

## Overview

This round rebuilds the platform around a **Courses** structure: professors create courses, enroll students, and post assignments scoped to a course. Students see their enrolled courses as a clickable grid, and within each course, they form groups (for group assignments) or submit individually. Every submission goes through a deliberate two-step confirmation ("Yes, I have submitted" → final confirm), and for group assignments, **only the group leader can acknowledge submission** — with that acknowledgment reflected instantly across all group members.

**Roles:**
- **Student** — enrolls (via professor), joins/creates groups within a course, views assignments, confirms submissions (as leader or individually, depending on assignment type)
- **Professor (Admin)** — creates courses, enrolls students, creates/edits/deletes assignments (targeted at all or specific groups, individual or group submission type), monitors and filters submissions by status, views course-scoped analytics

---

## UI/UX Design Choices

The interface uses a **"ledger / academic registry"** aesthetic — the idea being that a system for tracking coursework should feel like a well-kept gradebook, not a generic SaaS dashboard.

- **Typography**: a serif display face (Fraunces) for headings paired with a clean sans (Inter) for body text and a monospace face (IBM Plex Mono) for metadata (dates, counts, status labels). The serif/mono contrast echoes the feel of a printed academic record while staying legible on screen.
- **Color**: a deep ink-navy base (dark mode) or warm paper cream (light mode), with a warm gold accent standing in for "official" marks — confirmations, active states, primary actions. Status is color-coded consistently everywhere: muted grey (not submitted), amber (awaiting confirmation), mint green (confirmed) — so a user never has to read text to understand where something stands.
- **Status "stamps"**: submission status is shown as a small pill with a colored dot, styled like a registrar's stamp rather than a generic badge — reinforcing the "official record" feel and keeping status glanceable across long lists.
- **Course accent colors**: each course card gets a deterministic accent color (derived from its ID) as a thin top bar and icon badge — gives the course list visual rhythm without requiring the professor to pick colors manually.
- **Progress bars + checkmark burst**: each assignment card shows a two-stage progress bar (0% → 50% at step 1 → 100% on final confirm) plus a brief full-screen checkmark animation on final confirmation, giving the "acknowledgment" action a satisfying, unambiguous payoff — important since a silent action here could leave a student unsure whether their group's confirmation actually registered.
- **Sidebar + top bar layout**: a persistent sidebar (collapsing to a slide-out drawer on mobile) keeps navigation consistent across both roles, while a top bar houses the theme toggle and an avatar/account menu — kept separate from navigation so account actions (sign out) are never confused with page navigation.
- **Toasts over inline banners**: all success/error feedback uses toast notifications rather than inline alert boxes, so feedback doesn't shift page layout or get lost when a form is small.
- **Light/dark mode**: designed as two materials rather than a simple color inversion — dark mode reads as a digital terminal, light mode as paper — with the same accent language (gold/mint/amber) recalibrated for contrast in each.
- **Empty and loading states**: every list (courses, groups, assignments, analytics) has a purpose-built empty state (icon + explanation, not just blank space) and a skeleton loader shaped like the real content, rather than a generic spinner or "Loading..." text.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS v4, Framer Motion, Recharts, lucide-react |
| Backend | Node.js, Express |
| Database | PostgreSQL (Neon), Sequelize ORM |
| Auth | JWT (role-based: student / admin) |
| Containerization | Docker, Docker Compose (for local development parity) |

---

## Setup & Run Instructions

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require
JWT_SECRET=your_long_random_secret
```

`DATABASE_URL` should point at a PostgreSQL instance — a free [Neon](https://neon.tech) database works well and requires no local Postgres install.

Run the backend:

```bash
npm run dev
```

You should see `DB connected` and `Server running on port 5000`.

### Frontend

In a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```
VITE_API_URL=http://localhost:5000
```

Run the frontend:

```bash
npm run dev
```

Open **http://localhost:5173**.

### Optional: Docker (local dev parity)

```bash
docker compose up --build
```

Starts backend and frontend as containers; point the backend's `DATABASE_URL` environment variable at your Neon connection string in `docker-compose.yml` before running.

---

## Screenshots / UI Flow

> Add your screenshots or GIFs below — save image files into a `/screenshots` folder at the project root and update the paths accordingly.

### Login / Registration
`![Login screen](./screenshots/login.png)`

### Student Dashboard — Course Grid
`![Student course grid](./screenshots/student-courses.png)`

### Course Detail — Assignment View
`![Course detail with progress bars](./screenshots/course-detail.png)`

### Two-Step Confirmation + Checkmark Animation
`![Confirmation flow](./screenshots/confirm-flow.gif)`

### Professor Dashboard — Courses
`![Professor courses tab](./screenshots/admin-courses.png)`

### Professor — Create Assignment
`![Create assignment form](./screenshots/create-assignment.png)`

### Professor — Submissions with Status Filter
`![Submissions filter](./screenshots/submissions-filter.png)`

### Analytics — Course-Scoped
`![Analytics dashboard](./screenshots/analytics.png)`

---

## Component Architecture

```
frontend/src/
├── api/                      # Axios wrappers, one file per resource
│   ├── axios.js               # Configured instance, auto-attaches JWT
│   ├── auth.js
│   ├── courses.js
│   ├── groups.js
│   ├── assignments.js
│   └── submissions.js
├── components/                # Shared, reusable UI
│   ├── Layout.jsx               # Sidebar + top bar shell used by every dashboard page
│   ├── UserMenu.jsx             # Avatar dropdown (name, email, role, sign out)
│   ├── ThemeToggle.jsx
│   ├── StatusStamp.jsx          # Colored status pill, animates on change
│   ├── ConfirmCheckmark.jsx     # Full-screen checkmark burst on final confirmation
│   ├── ConfirmDialog.jsx        # Reusable "are you sure?" modal
│   ├── Skeleton.jsx             # Loading placeholder primitive
│   ├── EmptyState.jsx           # Icon + message for empty lists
│   └── AmbientBackground.jsx    # Animated background blobs (landing/auth pages)
├── context/
│   ├── AuthContext.jsx          # Logged-in user + token, persisted to localStorage
│   └── ThemeContext.jsx         # Dark/light mode, persisted to localStorage
├── lib/
│   └── courseColors.js          # Deterministic accent color per course ID
├── pages/
│   ├── Home.jsx, Login.jsx, Register.jsx
│   ├── student/
│   │   ├── StudentDashboard.jsx  # Tab shell: Courses / Groups
│   │   ├── CourseGrid.jsx        # Enrolled courses as clickable cards
│   │   ├── CourseDetail.jsx      # Assignments for one course, confirm flow
│   │   └── MyGroups.jsx          # Create/manage groups, leader indicator
│   └── admin/
│       ├── AdminDashboard.jsx    # Tab shell: Courses / Create Assignment / Assignments / Analytics
│       ├── CreateCourse.jsx      # Create courses, enroll students
│       ├── CreateAssignment.jsx  # Course + submission-type-aware assignment form
│       ├── Assignments.jsx       # Edit/delete assignments, filterable submissions view
│       └── Analytics.jsx         # Course-scoped completion chart + progress bars
└── routes/
    └── AppRoutes.jsx             # React Router config, role-protected routes
```

**Data flow**: every page component owns its own data-fetching (via the `api/` wrappers) and local UI state; `AuthContext` and `ThemeContext` are the only cross-cutting state, kept deliberately minimal. `Layout` is shared across every authenticated page so navigation and account controls stay consistent regardless of which dashboard tab is active.

---

## Backend Architecture

```
backend/src/
├── config/db.js         # Sequelize connection (Neon, SSL)
├── middleware/auth.js    # JWT verification + role-based authorization
├── models/               # Sequelize models + associations
│   ├── User.js, Course.js, CourseEnrollment.js
│   ├── Group.js (includes leaderId), GroupMember.js
│   ├── Assignment.js (submissionType, courseId), AssignmentGroup.js
│   └── Submission.js (supports both groupId and studentId)
├── routes/
│   ├── auth.js, courses.js, groups.js, assignments.js, submissions.js
└── server.js
```

**Key backend design decisions:**
- **Group-leader enforcement lives server-side**, not just in the UI — the `/submissions/:id/step1` and `/submissions/:id/confirm` routes check `group.leaderId === req.user.id` before allowing a group-type submission to change status, so the acknowledgment restriction can't be bypassed by calling the API directly.
- **Leadership auto-transfers** if the current leader removes themselves from a group, so a group is never left in a state where no member can confirm submissions.
- **Submissions support two shapes** in one table: a `groupId`-only row (group assignment, one row per group) or a `studentId`-only row (individual assignment, one row per student) — avoiding a second parallel table while keeping the confirmation logic in one place.
- **Status filtering** is done client-side against the full submissions payload for an assignment, since the dataset per assignment is small (bounded by course roster size) — kept the API simple rather than adding query-param filtering for a dataset this size.

---

## Deployment

- **Backend:** Render — [add your Render URL here]
- **Frontend:** Render — [add your Render URL here]
- **Demo video:** [add link here]
