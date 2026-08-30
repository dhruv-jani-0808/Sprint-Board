import { X } from "lucide-react";
import type { Priority, Status } from "../types/sprint";
import { useEffect, useState, type FormEvent } from "react";
import { MOCK_USERS } from "../data/mockIssues";

interface CreateIssueModalProps {
  isOpen: boolean,
  onClose: () => void,
  onCreateIssue: (issueData: {
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    assigneeId: string;
    tags: string[];
  }) => void;
  defaultStatus: Status;
}

export function CreateIssueModal({isOpen, onClose, onCreateIssue, defaultStatus}: CreateIssueModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<Status>(defaultStatus);
    const [priority, setPriority] = useState<Priority>("medium");
    const [assigneeId, setAssigneeId] = useState<string>("");
    const [tagsInput, setTagsInput] = useState("Frontend, UI");

    useEffect(() => {
        if(isOpen) setStatus(defaultStatus);
    }, [isOpen, defaultStatus]);

    if(!isOpen) return null;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if(!title.trim()) return;

        const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);

        onCreateIssue({
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            assigneeId,
            tags: tags.length > 0 ? tags : ["Task"],
        });

        setTitle("");
        setDescription("");
        setPriority("medium");
        setAssigneeId("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                    <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
                        Create New Issue
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Issue Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Implement WebSocket reconnect logic"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add additional details, acceptance criteria, or context..."
                            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as Status)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors cursor-pointer"
                            >
                                <option value="backlog">Backlog</option>
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                Assignee
                            </label>
                            <select
                                value={assigneeId}
                                onChange={(e) => setAssigneeId(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors cursor-pointer"
                            >
                                <option value="">Unassigned</option>
                                {MOCK_USERS.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="Frontend, UI, Security"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                            Priority
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPriority(p)}
                                    className={`py-1.5 px-2 rounded-lg text-xs font-medium capitalize transition-colors border ${
                                        priority === p
                                            ? p === "urgent"
                                                ? "bg-red-950/60 border-red-800 text-red-400"
                                                : p === "high"
                                                ? "bg-amber-950/60 border-amber-800 text-amber-400"
                                                : p === "medium"
                                                ? "bg-sky-950/60 border-sky-800 text-sky-400"
                                                : "bg-slate-800 border-slate-700 text-slate-200"
                                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold rounded-lg shadow-sm transition-colors"
                        >
                            Create Issue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
