# SprintHub — High-Velocity Sprint Board & Issue Tracker

> A minimalist, Linear-style developer workspace featuring real-time Kanban sprint tracking, multi-tenant workspaces, PostgreSQL indexing, Redis caching, WebSockets live sync, and background BullMQ workers.

---

## 🏗️ Architecture & Tech Stack

```text
sprint-board/
├── client/          # React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite
└── server/          # Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis, WebSockets (ws), BullMQ
```

### Frontend (`client/`)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS (Dark Charcoal & Carbon Theme)
- **Features**:
  - Interactive Kanban Sprint Board with Native Drag-and-Drop column transitions.
  - Real-time issue filtering (ID, title, tags, priority, assignee) with `⌘K` search shortcut.
  - Modal workflows: Issue Creator with validation, priority & assignee picker.
  - Product Backlog view, Sprint Analytics with burndown progress, and Workspace Settings.
  - Auth page (Login & Signup) & modern SaaS Landing Page.

### Backend (`server/`)
- **Runtime & API**: Node.js + Express (Layered MVC Architecture)
- **Database & ORM**: PostgreSQL + Prisma ORM
- **Database Indexing**: Compound B-Tree indexes on `(sprint_id, status, order)` & `(workspace_id, status)`.
- **In-Memory Cache & Pub/Sub**: Redis (Active board caching & live sync adapter).
- **Real-Time Layer**: Native WebSockets (`ws`) for instant multi-user board state updates.
- **Message Queues**: BullMQ for async email notifications, audit logs, and digest summaries.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v20+`
- **Package Manager**: `pnpm`
- **PostgreSQL Database**: Local or hosted on [Neon](https://neon.tech) / [Supabase](https://supabase.com).
- **Redis Server**: Local or hosted on [Upstash](https://upstash.com).

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
```

#### Run Database Migrations:
```bash
pnpm exec prisma db push
# or
pnpm exec prisma migrate dev --name init
```

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
