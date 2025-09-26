// server/routes/workspace.js
import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Get all workspaces for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces WHERE created_by=$1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Workspace fetch error:", err);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
});

// Create a new workspace
router.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const result = await pool.query(
      "INSERT INTO workspaces (name, description, created_by) VALUES ($1, $2, $3) RETURNING *",
      [name, description || "", req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Workspace creation error:", err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
});

// Get single workspace
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM workspaces WHERE id=$1 AND created_by=$2",
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Workspace not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Workspace fetch error:", err);
    res.status(500).json({ error: "Failed to fetch workspace" });
  }
});

// Update workspace
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE workspaces SET name=$1, description=$2 WHERE id=$3 AND created_by=$4 RETURNING *",
      [name, description, id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Workspace not found or unauthorized" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Workspace update error:", err);
    res.status(500).json({ error: "Failed to update workspace" });
  }
});

// Delete workspace
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM workspaces WHERE id=$1 AND created_by=$2 RETURNING *",
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Workspace not found or unauthorized" });
    res.json({ message: "Workspace deleted successfully" });
  } catch (err) {
    console.error("Workspace delete error:", err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
});

export default router;
