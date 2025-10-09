import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, LogOut, Moon } from "lucide-react";
import API_BASE_URL from "../config";

export default function DashboardLayout() {
   console.log("DashboardLayout rendered");
  const { workspaceId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // Fetch user on mount using backend /auth/me endpoint
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include", // send cookies
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        // no user - redirect to login
        navigate("/login");
      }
    }
    fetchUser();
  }, [navigate]);

  // Logout handler
  async function handleLogout() {
    try {
      const res = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  }

  // Dark mode toggle with persistence
  function toggleDarkMode() {
    const html = document.documentElement;
    html.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      html.classList.contains("dark") ? "dark" : "light"
    );
  }

  // Apply saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-col`}
      >
        <div className="p-4 font-bold text-xl border-b dark:border-gray-700 dark:text-white">
          RemoteDashboard
        </div>
        <nav className="flex flex-col justify-between p-4 h-full">
          {/* Navigation links */}
          <div className="space-y-2">
            <Link
              to="/workspace"
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-gray-200"
            >
              Workspace
            </Link>

            {/* Only show tasks and chat links if workspaceId is defined */}
            {workspaceId && (
              <>
                <Link
                  to={`/workspace/${workspaceId}/tasks`}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-gray-200"
                >
                  Tasks
                </Link>
                <Link
                  to={`/workspace/${workspaceId}/chat`}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-gray-200"
                >
                  Chat
                </Link>
              </>
            )}

            <Link
              to={`/workspace/${workspaceId}/docs`}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded dark:text-gray-200"
            >
              Documents
            </Link>
          </div>
{/* User info + Dark mode + Logout */}
<div className="space-y-3 border-t pt-4 dark:border-gray-700">
  {/* User email */}
  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
    <User className="h-4 w-4" />
    <span>{user?.email || "User"}</span>
  </div>

  {/* Dark Mode Toggle */}
  <button
    onClick={toggleDarkMode}
    className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm dark:text-gray-300"
  >
    <Moon className="h-4 w-4" />
    <span>Toggle Dark Mode</span>
  </button>

  {/* ✅ Moved logout right below dark mode toggle */}
  <button
    onClick={async () => {
      if (window.confirm("Are you sure you want to logout?")) {
        await handleLogout();
      }
    }}
    className="flex items-center gap-2 py-2 px-3 bg-red-600 text-black rounded hover:bg-red-700 text-sm"
  >
    <LogOut className="h-4 w-4" />
    <span>Logout</span>
  </button>

          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Mobile top bar */}
        {/* Mobile top bar */}
<header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow dark:shadow-black">
  <div className="font-bold text-xl dark:text-white">RemoteDashboard</div>

  <div className="flex items-center gap-4">
    {/* Logout button */}
    <button
      onClick={async () => {
        if (window.confirm("Are you sure you want to logout?")) {
          await handleLogout();
        }
      }}
      className="flex items-center gap-1 py-1 px-2 bg-red-600 text-black rounded hover:bg-red-700 text-sm"
      aria-label="Logout"
      title="Logout"
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </button>

    {/* Sidebar toggle */}
    <button
      className="text-gray-700 dark:text-gray-300"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      aria-label="Toggle sidebar"
    >
      ☰
    </button>
  </div>
</header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
          
        </main>
      </div>
    </div>
  );
}
