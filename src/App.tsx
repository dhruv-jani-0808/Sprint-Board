import { Sidebar } from "./components/layout/sidebar";
import { Navbar } from "./components/layout/Navbar";
import { FilterBar } from "./components/FilterBar";
import { KanbanBoard } from "./components/KanbanBoard";

// TODO: Define props interface

export default function App() {
  // TODO: Call useQuery to fetch issues/board data

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 select-none">
      <Sidebar activeTab="board" onSelectTab={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <Navbar onOpenNewIssue={() => {}} />
        <FilterBar />

        <main className="flex-1 overflow-hidden flex flex-col bg-slate-950">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
}