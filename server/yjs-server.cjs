const http = require("http");
const WebSocket = require("ws");
const Y = require("yjs");

// A simple in-memory map for active docs
const docs = new Map();

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("✅ Yjs WebSocket Server is running");
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  // Parse the doc name from URL, e.g. ws://localhost:1234/my-room
  const url = new URL(req.url, "http://localhost:1234");
  const roomName = url.pathname.slice(1) || "default-room";

  console.log(`🧩 New connection to room: ${roomName}`);

  // Get or create Y.Doc for the room
  let ydoc = docs.get(roomName);
  if (!ydoc) {
    ydoc = new Y.Doc();
    docs.set(roomName, ydoc);
  }

  // Listen for sync events
  ws.on("message", (message) => {
    // Broadcast changes to everyone in this room
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log(`❌ Disconnected from ${roomName}`);
  });
});

const PORT = 1234;
server.listen(PORT, () => {
  console.log(`🚀 Yjs WebSocket server running at ws://localhost:${PORT}`);
});
