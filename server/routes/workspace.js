import express from "express";
import { supabase } from "../db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Create a new workspace
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id; // from auth middleware

    const { data, error } = await supabase
      .from("workspaces")
      .insert([{ name, created_by: userId, members: [userId] }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get workspaces for logged in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("workspaces")
      .select("*")
      .contains("members", [userId]); // check if user is member

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
