const API_BASE = "http://localhost:5000/api";

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if(!res.ok) {
        throw new Error(data.message || "An API error occured");
    }

    return data as T;
}

export const authApi = {
    login: (email: string, password: string) =>
        apiFetch<{ user: any }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        }),
    register: (name: string, email: string, password: string) =>
        apiFetch<{ user: any, workspace: any }>("/auth/register", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
        }),
    logout: () => apiFetch<{ message: string }>("/auth/logout", { method: "POST" }),
    getMe: () => apiFetch<{ user: any }>("/auth/me"),
};

export const workspaceApi = {
    getBySlug: (slug: string) => apiFetch<{ workspace: any }>(`/workspaces/${slug}`),
    invite: (id: string, email: string, role: string) =>
        apiFetch<{ member: any }>(`/workspaces/${id}/invite`, {
            method: "POST",
            body: JSON.stringify({ email, role }),
        }),
    update: (id: string, data: { name?: string; slug?: string }) =>
        apiFetch<{ workspace: any }>(`/workspaces/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        }),
};

export const sprintApi = {
    getActive: (workspaceId: string) =>
        apiFetch<{ sprint: any }>(`/sprints/active/${workspaceId}`),
    create: (data: { workspaceId: string; name: string; startDate?: string; endDate?: string }) =>
        apiFetch<{ sprint: any }>("/sprints", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    start: (id: string, workspaceId: string) =>
        apiFetch<{ sprint: any }>(`/sprints/${id}/start`, {
            method: "POST",
            body: JSON.stringify({ workspaceId }),
        }),
    complete: (id: string) =>
        apiFetch<{ sprint: any }>(`/sprints/${id}/complete`, {
            method: "POST",
        }),
};

export const issueApi = {
    getBoard: (sprintId: string) =>
        apiFetch<{ issues: any[] }>(`/issues/board/${sprintId}`),
    create: (data: any) =>
        apiFetch<{ issue: any }>("/issues", {
            method: "POST",
            body: JSON.stringify(data),
        }),
    move: (id: string, status: string, order: number, sprintId?: string) =>
        apiFetch<{ issue: any }>(`/issues/${id}/move`, {
            method: "PATCH",
            body: JSON.stringify({ status, order, sprintId }),
        }),
    update: (id: string, data: any, sprintId?: string) =>
        apiFetch<{ issue: any }>(`/issues/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ ...data, sprintId }),
        }),
    delete: (id: string, sprintId?: string) =>
        apiFetch<{ message: string }>(`/issues/${id}${sprintId ? `?sprintId=${sprintId}` : ""}`, {
            method: "DELETE",
        }),
};