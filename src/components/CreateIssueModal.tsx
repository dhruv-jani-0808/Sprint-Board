import { X } from "lucide-react";

// TODO: Define props interface

export function CreateIssueModal() {
  // TODO: Call useMutation for creating issue

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-slate-100 tracking-tight">
            Create New Issue
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Issue Title
            </label>
            <input
              type="text"
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
              placeholder="Add additional details, acceptance criteria, or context..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Status
              </label>
              <select className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors cursor-pointer">
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
              <select className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500/80 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none transition-colors cursor-pointer">
                <option value="">Unassigned</option>
                <option value="1">jani</option>
                <option value="2">gandhi</option>
                <option value="3">uday</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:border-slate-700 transition-colors"
              >
                <span>Low</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-sky-950/40 border border-sky-800/60 rounded-lg text-xs font-medium text-sky-400 transition-colors"
              >
                <span>Medium</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:border-slate-700 transition-colors"
              >
                <span>High</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-400 hover:border-slate-700 transition-colors"
              >
                <span>Urgent</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <button
              type="button"
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
