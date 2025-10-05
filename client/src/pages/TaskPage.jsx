// TaskPage.jsx
import { useParams } from "react-router-dom";
import TaskBoard from "../components/Taskboard";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function TaskPage() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspace = async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) setWorkspace(data);
      setLoading(false);
    };

    fetchWorkspace();
  }, [id]);

  if (loading) return <div>Loading workspace…</div>;
  if (!workspace) return <div>Workspace not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{workspace.name}</h1>
      <p className="text-gray-500 mb-4">{workspace.description}</p>
      <TaskBoard workspaceId={id} />
    </div>
  );
}
