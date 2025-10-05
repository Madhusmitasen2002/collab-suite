import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ Get all task lists for a workspace
router.get("/lists/:workspaceId", authMiddleware, async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM task_lists WHERE workspace_id=$1 ORDER BY created_at ASC",
      [workspaceId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Task lists fetch error:", err);
    res.status(500).json({ error: "Failed to fetch task lists" });
  }
});

// ✅ Create new task list
router.post("/lists", authMiddleware, async (req, res) => {
  const { name, workspace_id } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const result = await pool.query(
      "INSERT INTO task_lists (name, workspace_id, created_by) VALUES ($1, $2, $3) RETURNING *",
      [name, workspace_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Task list creation error:", err);
    res.status(500).json({ error: "Failed to create task list" });
  }
});

// ✅ Get tasks in a list
router.get("/:listId", authMiddleware, async (req, res) => {
  const { listId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM tasks WHERE list_id=$1 ORDER BY created_at ASC",
      [listId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Task fetch error:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// ✅ Create new task
router.post("/", authMiddleware, async (req, res) => {
  const { title, list_id } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const result = await pool.query(
      "INSERT INTO tasks (title, list_id, created_by) VALUES ($1, $2, $3) RETURNING *",
      [title, list_id, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Task creation error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

export default router;
