import { useRef, useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import Quill from "quill";
import { QuillBinding } from "y-quill";
import { useParams } from "react-router-dom";
import "quill/dist/quill.snow.css";

export default function DocumentEditor() {
  const editorRef = useRef(null);
  const ydocRef = useRef(null);
  const { docId } = useParams();

  useEffect(() => {
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(
      "wss://collab-suite-yjs-server.onrender.com",
      docId || "default-room",
      ydoc
    );

    const ytext = ydoc.getText("quill");

    const editor = new Quill(editorRef.current, {
      theme: "snow",
      placeholder: "Start typing...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"]
        ],
      },
    });

    new QuillBinding(ytext, editor);

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [docId]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center max-w-6xl mx-auto w-full">
        <h1 className="text-xl font-semibold text-gray-800 select-none">
          Collaborative Document Editor
        </h1>
        <span className="text-gray-500 text-sm truncate max-w-xs">
          Doc ID: {docId || "default"}
        </span>
      </header>

      {/* Editor */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-4 sm:p-6 flex flex-col">
        {/* Quill toolbar will be automatically injected here */}
        <div
          ref={editorRef}
          className="flex-grow bg-white rounded-lg shadow-lg overflow-auto min-h-[60vh] sm:min-h-[70vh] text-gray-900"
          style={{ fontFamily: "'Georgia', serif" }}
        />
      </main>
    </div>
  );
}
