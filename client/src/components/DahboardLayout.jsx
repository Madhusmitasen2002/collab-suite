import { Outlet, Link, useParams } from "react-router-dom";
import { useState } from "react";
export default function DashboardLayout() {
  const { workspaceId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-100">
      {/* Sidebar for desktop and mobile */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col`}>
        <div className="p-4 font-bold text-xl border-b">RemoteDashboard</div>
        <nav className="flex flex-col p-4 space-y-2">
          <Link to="/workspace" className="block px-4 py-2 hover:bg-gray-100 rounded">Workspace</Link>
          <Link to={`/workspace/${workspaceId}/tasks`} className="block px-4 py-2 hover:bg-gray-100 rounded">Tasks</Link>
          <Link to="/workspace/chat" className="block px-4 py-2 hover:bg-gray-100 rounded">Chat</Link>
          <Link to="/workspace/docs" className="block px-4 py-2 hover:bg-gray-100 rounded">Documents</Link>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <div className="font-bold text-xl">RemoteDashboard</div>
          <button
            className="text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-6 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
