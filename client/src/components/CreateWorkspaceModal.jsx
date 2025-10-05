import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";

export default function CreateWorkspaceModal({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("workspaces")
      .insert([{ name, description }])
      .select()
      .single();

    if (error) setError(error.message);
    else onSuccess(data);

    setLoading(false);
  }

  // Drag handlers
  const onMouseDown = (e) => {
    setIsDragging(true);
    const modal = modalRef.current;
    modal.initialX = e.clientX - position.x;
    modal.initialY = e.clientY - position.y;
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - modalRef.current.initialX,
      y: e.clientY - modalRef.current.initialY,
    });
  };

  const onMouseUp = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 px-2">
      <div
        ref={modalRef}
        onMouseDown={onMouseDown}
        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:h-auto overflow-y-auto cursor-move"
      >
        <h2 className="text-xl font-bold mb-4">Create Workspace</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Workspace name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-black rounded"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
