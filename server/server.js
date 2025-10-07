import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { supabase } from "./supabaseClient.js";

// Routes
import authRoutes from "./routes/auth.js";
import workspaceRoutes from "./routes/workspace.js";
import taskRoutes from "./routes/tasks.js";
import messageRoutes from "./routes/messages.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP + Socket.io server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://collab-suite.vercel.app",
      "https://collab-suite-weld.vercel.app",
    ],
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Health route
app.get("/", (req, res) => {
  res.json({ message: "✅ Backend + Socket Server Running" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/tasks", taskRoutes);
app.use("/api/messages", messageRoutes);

// --- SOCKET.IO LOGIC ---
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // Join workspace
  socket.on("joinWorkspace", (workspaceId) => {
    socket.join(workspaceId);
    console.log(`📂 User joined workspace ${workspaceId}`);
  });
  // Handle typing indicator
socket.on("typing", ({ workspaceId, username }) => {
  socket.to(workspaceId).emit("userTyping", username);
});

  // Handle send message
  socket.on("sendMessage", async (msg) => {
    try {
      const { workspace_id, sender_id, content } = msg;

      // Save message in Supabase
      const { data, error } = await supabase
        .from("messages")
        .insert([{ workspace_id, sender_id, content }])
        .select()
        .single();

      if (error) {
        console.error("❌ Supabase insert error:", error.message);
        return;
      }

      // Broadcast message to workspace
      io.to(workspace_id).emit("newMessage", data);
    } catch (err) {
      console.error("❌ Socket message error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
