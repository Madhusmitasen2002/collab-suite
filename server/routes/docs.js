import express from "express";
import { supabase } from "../supabaseClient.js";


const router = express.Router();

// ✅ Get all documents for a workspace
router.get("/:workspaceId", async (req, res) => {
  const { workspaceId } = req.params;
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("updated_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ Get single document by ID
router.get("/doc/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ Create new document
router.post("/", async (req, res) => {
  const { workspace_id, title } = req.body;
  const { data, error } = await supabase
    .from("documents")
    .insert([{ workspace_id, title }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// ✅ Update document content
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { error } = await supabase
    .from("documents")
    .update({ content, updated_at: new Date() })
    .eq("id", id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

export default router;
