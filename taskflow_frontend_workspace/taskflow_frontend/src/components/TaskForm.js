import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";

/**
 * PUBLIC_INTERFACE
 * TaskForm component: used for creating a new task or editing an existing task.
 * Props:
 *   task - task object to edit (if present), else create mode.
 *   onSuccess - callback on successful create/update.
 *   onCancel - callback for cancel action.
 */
function TaskForm({ task, onSuccess, onCancel }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "normal",
  });
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "normal",
      });
    } else {
      setForm({ title: "", description: "", priority: "normal" });
    }
    setErr("");
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErr("");
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setErr("");
    try {
      const url = task
        ? `/api/tasks/${task.id}`
        : "/api/tasks/";
      const method = task ? "PATCH" : "POST";
      const resp = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "Failed to save");
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setErr("Failed to save: " + (err.message || "Server error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      style={{
        background: "var(--bg-secondary)",
        borderRadius: 8,
        padding: 18,
        margin: "0 auto",
        marginBottom: 18,
        maxWidth: 480,
        boxShadow: "0 1.5px 6px rgba(0,0,0,.07)"
      }}
      onSubmit={handleSubmit}
    >
      <h3 style={{ marginTop: 0, fontWeight: 600 }}>
        {task ? "Edit Task" : "New Task"}
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          maxLength={256}
          required
          style={{ padding: 9, borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 16 }}
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          maxLength={1024}
          rows={3}
          style={{ padding: 9, borderRadius: 6, border: "1px solid var(--border-color)", fontSize: 15 }}
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          style={{ padding: 8, borderRadius: 6, fontSize: 15, border: "1px solid var(--border-color)" }}
        >
          <option value="low">Low Priority</option>
          <option value="normal">Normal Priority</option>
          <option value="high">High Priority</option>
        </select>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              background: "var(--button-bg)",
              color: "var(--button-text)",
              border: "none",
              borderRadius: 6,
              padding: "10px 22px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            {submitting ? (task ? "Saving..." : "Creating...") : (task ? "Save" : "Create")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "#fff",
              color: "var(--button-bg)",
              border: "1px solid var(--border-color)",
              borderRadius: 6,
              padding: "10px 18px",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
        {err && <div style={{ color: "crimson", marginLeft: 2, marginTop: 5 }}>{err}</div>}
      </div>
    </form>
  );
}

export default TaskForm;
