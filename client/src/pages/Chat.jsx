import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { supabase } from "../supabaseClient";
import MessageList from "../components/MessageList";
import API_BASE_URL from "../config";

// Create socket once
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
  withCredentials: true,
});

export default function Chat() {
  const { workspaceId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch user on mount
  useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      console.error("Chat loadUser error:", err);
    }
  }

  loadUser();
}, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!workspaceId || !currentUser) {
      console.log("Chat waiting: workspaceId or user missing", workspaceId, currentUser);
      return;
    }

    console.log("Chat: joining workspace", workspaceId);

    socket.emit("joinWorkspace", workspaceId);
    fetchMessages();

    socket.on("newMessage", (msg) => {
      console.log("Chat: got newMessage event", msg);
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("userTyping", (username) => {
      console.log("Chat: got userTyping", username);
      setTypingUser(username);
      setTimeout(() => setTypingUser(null), 1500);
    });

    return () => {
      socket.off("newMessage");
      socket.off("userTyping");
    };
  }, [workspaceId, currentUser]);

  async function fetchMessages() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/messages/${workspaceId}`,
        { credentials: "include" }
      );
      console.log("Chat fetchMessages response:", res.status);
      const data = await res.json();
      console.log("Chat fetchMessages data:", data);
      setMessages(data);
      scrollToBottom();
    } catch (err) {
      console.error("Chat fetchMessages error:", err);
    }
  }

  async function sendMessage() {
    if (!newMsg.trim() || !currentUser) return;

    const messageData = {
      workspace_id: workspaceId,
      sender_id: currentUser.id,
      sender_name: currentUser.email?.split("@")[0] || "User",
      content: newMsg.trim(),
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messageData),
          credentials: "include",
        }
      );
      console.log("Chat sendMessage response:", res.status);
    } catch (err) {
      console.error("Chat sendMessage error:", err);
    }

    socket.emit("sendMessage", messageData);
    setNewMsg("");
  }

  function handleTyping() {
    if (!currentUser) return;
    socket.emit("typing", {
      workspaceId,
      username: currentUser.email?.split("@")[0] || "User",
    });
  }

  if (!currentUser) return <div>Loading user…</div>;

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg shadow p-4">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUser={currentUser} />
        {typingUser && (
          <p className="text-sm text-gray-500 italic px-2">
            {typingUser} is typing...
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex mt-4 gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            handleTyping();
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-black px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
