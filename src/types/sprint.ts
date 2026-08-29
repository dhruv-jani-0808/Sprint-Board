export type Status = 'backlog' | 'todo' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
    id: string,
    name: string,
    avatar: string,
    email: string,
};

export interface Issue {
    id: string,
    title: string,
    description: string,
    status: Status,
    priority: Priority,
    assignee: User | null,
    tags: string[],
    createdAt: string,
    order: number,
};

export interface Column {
    id: Status,
    title: string,
};

export interface FilterState {
    searchQuery: string,
    priority: Priority | 'all',
    assigneeId: string | 'all',
};