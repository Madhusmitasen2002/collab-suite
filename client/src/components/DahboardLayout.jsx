import { Outlet, Link } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 font-bold text-xl">ProjectHub</div>
        <nav className="space-y-2">
          <Link to="/workspace" className="block px-4 py-2 hover:bg-gray-100">Workspace</Link>
          <Link to="/workspace/tasks" className="block px-4 py-2 hover:bg-gray-100">Tasks</Link>
          <Link to="/workspace/chat" className="block px-4 py-2 hover:bg-gray-100">Chat</Link>
          <Link to="/workspace/docs" className="block px-4 py-2 hover:bg-gray-100">Documents</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
