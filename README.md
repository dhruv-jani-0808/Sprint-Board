# SprintHub — High-Velocity Sprint Board & Issue Tracker

> A minimalist, Linear-style developer workspace featuring real-time Kanban sprint tracking, multi-tenant workspaces, PostgreSQL indexing, Redis caching, WebSockets live sync, and background BullMQ workers.

---

## 🏗️ Architecture & Tech Stack

```text
sprint-board/
├── client/          # React 19, TypeScript, Tailwind CSS, Vite, Nginx
├── server/          # Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, WebSockets (ws), BullMQ
└── docker-compose.yml # Multi-container orchestration (Client, Server, Redis)
```

### Frontend (`client/`)
- **Framework**: React 19 + TypeScript + Vite
- **State & Data**: TanStack Query (React Query) with optimistic updates & real-time WebSocket invalidation
- **Styling**: Tailwind CSS (Dark Charcoal & Carbon Theme)
- **Features**:
  - Interactive Kanban Sprint Board with native drag-and-drop column transitions.
  - Real-time issue filtering (ID, title, tags, priority, assignee) with `⌘K` search shortcut.
  - Modal workflows: Issue Creator with validation, priority & assignee picker.
  - Product Backlog view, Sprint Analytics with burndown progress, and Workspace Settings.
  - Auth page (Login & Signup) & modern SaaS Landing Page.

### Backend (`server/`)
- **Runtime & API**: Node.js + Express (Layered MVC Architecture)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Database Indexing**: Compound B-Tree indexes on `(sprint_id, status, order)` & `(workspace_id, status)` with fractional spacing for $O(1)$ reordering.
- **In-Memory Cache**: Redis Cache-Aside pattern for sub-millisecond board reads.
- **Real-Time Layer**: Native WebSockets (`ws`) with heartbeat health check and workspace rooms for live multi-user sync.
- **Message Queues**: BullMQ on dedicated Redis connections for non-blocking audit logging and notifications.

---

## 🐳 Quick Start with Docker (Recommended)

Run the entire full-stack system (Frontend, Backend, Redis) with a single command:

1. Ensure [Docker](https://www.docker.com/) is installed and running.
2. Set up your database connection string in `server/.env` (see `server/.env.example`).
3. Run:
   ```bash
   docker compose up --build
   ```
4. Access the apps:
   - **Frontend**: [http://localhost:5173](http://localhost:5173)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **Redis**: Port `6379`

---

## 💻 Manual Local Development

### 1. Prerequisites
- **Node.js**: `v20+`
- **Package Manager**: `pnpm`
- **PostgreSQL Database**: Local or hosted on [Neon](https://neon.tech) / [Supabase](https://supabase.com).
- **Redis Server**: Local or running via Docker (`docker run -p 6379:6379 -d redis:alpine`).

---

### 2. Frontend Setup (`client/`)

```bash
cd client
pnpm install
pnpm dev
```
Runs the Vite development server at `http://localhost:5173`.

---

### 3. Backend Setup (`server/`)

```bash
cd server
pnpm install
```

#### Configure Environment Variables (`server/.env`):
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/sprinthub?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your_secure_jwt_secret_key"
CLIENT_URL="http://localhost:5173"
```

#### Run Database Migrations:
```bash
pnpm exec prisma db push
# or
pnpm exec prisma migrate dev --name init
```

#### Start Backend Server:
```bash
pnpm dev
```
Server runs at `http://localhost:5000`.

---

## 🗄️ Database Schema Overview

- **`User`**: Account authentication, avatar, timestamps.
- **`Workspace`**: Multi-tenant workspace with slug identifier and owner relation.
- **`WorkspaceMember`**: Membership roles (`ADMIN`, `MEMBER`, `VIEWER`).
- **`Sprint`**: Sprints lifecycle (`PLANNING`, `ACTIVE`, `COMPLETED`).
- **`Issue`**: Tickets with priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), status (`BACKLOG`, `TODO`, `IN_PROGRESS`, `DONE`), tags, fractional `order` for drag sorting.
- **`Activity`**: Audit trail for issue events and assignment history.

---

## 📄 License
MIT
