import { KanbanColumn } from "./KanbanColumn";

// TODO: Define props interface

export function KanbanBoard() {
  // TODO: Call useQuery to fetch issues/board data

  return (
    <div className="flex-1 overflow-x-auto p-6 flex gap-5 items-start min-h-0 select-none">
      <KanbanColumn />
      <KanbanColumn />
      <KanbanColumn />
      <KanbanColumn />
    </div>
  );
}
