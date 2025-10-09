import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import API_BASE_URL from "../config";
import MessageList from "../components/MessageList";

export default function Chat() {
  const { workspaceId } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection once
  useEffect(() => {
    socketRef.current = io(API_BASE_URL, { withCredentials: true });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Load current user via /auth/me endpoint (not Supabase client)
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data?.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error("Chat: Failed to load user", err);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (!workspaceId || !currentUser) return;

    socketRef.current.emit("joinWorkspace", workspaceId);
    fetchMessages();

    socketRef.current.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socketRef.current.on("userTyping", (username) => {
      setTypingUser(username);
      setTimeout(() => setTypingUser(null), 1500);
    });

    return () => {
      socketRef.current.off("newMessage");
      socketRef.current.off("userTyping");
    };
  }, [workspaceId, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function fetchMessages() {
    const res = await fetch(`${API_BASE_URL}/api/messages/${workspaceId}`, {
      credentials: "include",
    });
    const data = await res.json();
    setMessages(data);
    scrollToBottom();
  }

  function sendMessage() {
    if (!newMsg.trim() || !currentUser) return;

    const messageData = {
      workspace_id: workspaceId,
      sender_id: currentUser.id,
      sender_name: currentUser.email?.split("@")[0] || "User",
      content: newMsg.trim(),
    };

    console.log("Sending message via socket:", messageData);
    socketRef.current.emit("sendMessage", messageData); // Send via socket only
    setNewMsg("");
  }

  function handleTyping() {
    if (!currentUser) return;
    socketRef.current.emit("typing", {
      workspaceId,
      username: currentUser.email?.split("@")[0] || "User",
    });
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 rounded shadow">
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUser={currentUser} />
        {typingUser && (
          <p className="text-sm text-gray-500 italic">{typingUser} is typing...</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex gap-2 mt-4">
        <input
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => {
            handleTyping();
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Type a message"
          className="flex-1 px-3 py-2 border rounded"
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
