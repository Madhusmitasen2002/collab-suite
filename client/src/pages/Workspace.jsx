import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";

export default function Workspace() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  async function fetchWorkspaces() {
    setLoading(true);
    const { data, error } = await supabase.from("workspaces").select("*");
    if (error) setError(error.message);
    else setWorkspaces(data);
    setLoading(false);
  }

  function handleWorkspaceCreated(newWs) {
    setWorkspaces((prev) => [...prev, newWs]);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Workspaces</h1>
          <p className="text-gray-500 text-sm">
            Manage your projects and collaborate with your team
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-600 text-black rounded-lg shadow hover:bg-blue-700"
        >
          + Add Workspace
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : workspaces.length === 0 ? (
        <p className="text-gray-500">No workspaces yet. Create your first one!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{ws.name}</h3>
              <p className="text-sm text-gray-500">
                {ws.description || "No description"}
              </p>
              <Link
                to={`/workspace/${ws.id}/tasks`}
                className="mt-3 inline-block text-sm text-blue-600 hover:underline"
              >
                Open →
              </Link>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateWorkspaceModal
          onClose={() => setShowCreate(false)}
          onSuccess={(ws) => {
            handleWorkspaceCreated(ws);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}
