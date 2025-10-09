import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Docs() {
  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const fetchDocs = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/docs/${workspaceId}`);
    const data = await res.json();
    setDocs(data);
  };

  useEffect(() => {
    fetchDocs();
  }, [workspaceId]);

  const createDoc = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/docs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace_id: workspaceId, title: "New Doc" }),
    });
    const data = await res.json();
    navigate(`/workspace/${workspaceId}/docs/${data.id}`);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📄 Documents</h1>
        <button
          onClick={createDoc}
          disabled={!workspaceId}
          className={`px-5 py-2 rounded-md font-semibold text-black transition-colors duration-200
            ${workspaceId ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"}`}
        >
          + New Document
        </button>
      </div>

      {/* Document list */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <li
            key={doc.id}
            onClick={() => navigate(`/workspace/${workspaceId}/docs/${doc.id}`)}
            className="cursor-pointer rounded-lg p-4 bg-white shadow hover:shadow-lg transition-shadow duration-200"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate(`/workspace/${workspaceId}/docs/${doc.id}`);
            }}
          >
            <h2 className="text-lg font-medium text-gray-900">{doc.title}</h2>
          </li>
        ))}
      </ul>

      {docs.length === 0 && (
        <p className="mt-8 text-center text-gray-500">No documents found. Create one above!</p>
      )}
    </div>
  );
}

export default Docs;
