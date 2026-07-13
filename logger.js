// Route to create a new note
app.post("/add-note", (req, res) => {
  const { user_id, title, content } = req.body;

  if (!user_id || !title || !content) {
    return res.status(400).json({ success: false, message: "Missing user_id, title, or content" });
  }

  const insertQuery = "INSERT INTO user_notes (user_id, title, content) VALUES (?, ?, ?)";
  db.query(insertQuery, [user_id, title, content], (err, results) => {
    if (err) {
      console.error("Error inserting note:", err);
      return res.status(500).json({ success: false, message: "Error saving note" });
    }
    res.json({ success: true, message: "Note added successfully" });
  });
});
// Route to update an existing note
app.put("/update-note", (req, res) => {
    const { note_id, user_id, title, content } = req.body;

    if (!note_id || !user_id || !title || !content) {
        return res.status(400).json({ success: false, message: "Missing note_id, user_id, title, or content" });
    }

    const updateQuery = "UPDATE user_notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE note_id = ? AND user_id = ?";
    db.query(updateQuery, [title, content, note_id, user_id], (err, results) => {
        if (err) {
            console.error("Error updating note:", err);
            return res.status(500).json({ success: false, message: "Error updating note" });
        }
        if (results.affectedRows === 0) {
            return res.status(400).json({ success: false, message: "Note not found or not authorized" });
        }
        res.json({ success: true, message: "Note updated successfully" });
    });
});

// Route to delete a specific note
app.delete("/delete-note", (req, res) => {
  const { note_id, user_id } = req.body;

  if (!note_id || !user_id) {
    return res.status(400).json({ success: false, message: "Missing note_id or user_id" });
  }

  const deleteQuery = "DELETE FROM user_notes WHERE note_id = ? AND user_id = ?";
  db.query(deleteQuery, [note_id, user_id], (err, results) => {
    if (err) {
      console.error("Error deleting note:", err);
      return res.status(500).json({ success: false, message: "Error deleting note" });
    }
    if (results.affectedRows === 0) {
      return res.status(400).json({ success: false, message: "Note not found or not authorized" });
    }
    res.json({ success: true, message: "Note deleted successfully" });
  });
});

// Route to delete all notes for a specific user
app.delete("/delete-all-notes", (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ success: false, message: "Missing user_id" });
  }

  const deleteQuery = "DELETE FROM user_notes WHERE user_id = ?";
  db.query(deleteQuery, [user_id], (err, results) => {
    if (err) {
      console.error("Error deleting all notes:", err);
      return res.status(500).json({ success: false, message: "Error deleting all notes" });
    }
    res.json({ success: true, message: "All notes deleted successfully" });
  });
});
// Route to get all notes for a user
app.get("/get-notes/:user_id", (req, res) => {
  const { user_id } = req.params;

  const selectQuery = "SELECT * FROM user_notes WHERE user_id = ?";
  db.query(selectQuery, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching notes:", err);
      return res.status(500).json({ success: false, message: "Error fetching notes" });
    }
    res.json({ success: true, notes: results });
  });
});