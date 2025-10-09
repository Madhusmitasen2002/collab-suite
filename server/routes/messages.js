import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// Get messages for a workspace with joined user name
router.get("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const { data, error } = await supabase
  .from("messages")
  .select(`
    *,
    users!sender_id ( name )
  `)
  .eq("workspace_id", workspaceId)
  .order("created_at", { ascending: true });


    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save new message (sender_name not needed here)
router.post("/", async (req, res) => {
  const { workspace_id, sender_id, content } = req.body;

  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{ workspace_id, sender_id, content }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
