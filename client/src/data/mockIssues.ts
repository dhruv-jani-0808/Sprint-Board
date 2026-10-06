import type { User, Issue, Column } from '../types/sprint';

export const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "jani",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jani",
        email: "dhruv.jani.0808@gmail.com"
    },
    {
        id: "2",
        name: "gandhi",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gandhi",
        email: "gandhi.dhruvil.1314@gmail.com"
    },
    {
        id: "3",
        name: "uday",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=uday",
        email: "uday.gadhavi.1110@gmail.com"
    }
];

export const COLUMNS: Column[] = [
    { id: 'backlog', title: 'Backlog' },
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
];

export const INITIAL_ISSUES: Issue[] = [
    {
        id: "DEV-101",
        title: "Implement JWT authentication refresh rotation",
        description: "Handle access token expiration silently and rotate refresh tokens securely in HTTP-only cookies.",
        status: "done",
        priority: "urgent",
        assignee: MOCK_USERS[0],
        tags: ["Backend", "Security"],
        createdAt: "2026-08-20T10:00:00Z",
        order: 0,
    },
    {
        id: "DEV-102",
        title: "Optimize PostgreSQL connection pooling with Prisma",
        description: "Prevent DB connection exhaustion under heavy concurrent read traffic by configuring PgBouncer.",
        status: "in_progress",
        priority: "high",
        assignee: MOCK_USERS[1],
        tags: ["Database", "Performance"],
        createdAt: "2026-08-22T14:30:00Z",
        order: 0,
    },
    {
        id: "DEV-103",
        title: "Build multi-column drag-and-drop Kanban interface",
        description: "Create fluid column transitions with optimistic UI state and keyboard accessibility.",
        status: "in_progress",
        priority: "urgent",
        assignee: MOCK_USERS[0],
        tags: ["Frontend", "UI"],
        createdAt: "2026-08-24T09:15:00Z",
        order: 1,
    },
    {
        id: "DEV-104",
        title: "Add Redis Pub/Sub layer for live WebSocket events",
        description: "Distribute board updates across multiple Node.js instances using Redis channels.",
        status: "todo",
        priority: "medium",
        assignee: MOCK_USERS[2],
        tags: ["WebSockets", "Infra"],
        createdAt: "2026-08-25T11:00:00Z",
        order: 0,
    },
    {
        id: "DEV-105",
        title: "Design modal drawer for issue creation and editing",
        description: "Include priority selector, markdown preview, tag manager, and assignee search dropdown.",
        status: "todo",
        priority: "medium",
        assignee: null,
        tags: ["Frontend", "UX"],
        createdAt: "2026-08-26T16:20:00Z",
        order: 1,
    },
    {
        id: "DEV-106",
        title: "Implement BullMQ queue worker for email digests",
        description: "Offload transactional assignment notifications to an async background worker.",
        status: "backlog",
        priority: "low",
        assignee: null,
        tags: ["Backend", "Queues"],
        createdAt: "2026-08-27T08:45:00Z",
        order: 0,
    },
    {
        id: "DEV-107",
        title: "Audit security headers and configure strict CSP",
        description: "Add Content Security Policy, X-Frame-Options, and CORS whitelist rules in Helmet.",
        status: "backlog",
        priority: "high",
        assignee: MOCK_USERS[1],
        tags: ["Security"],
        createdAt: "2026-08-28T13:00:00Z",
        order: 1,
    }
];