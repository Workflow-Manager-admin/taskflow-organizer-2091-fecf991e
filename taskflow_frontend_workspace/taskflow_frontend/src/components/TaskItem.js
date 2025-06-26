import React, { useState } from "react";
import { useAuth } from "../AuthContext";

/**
 * PUBLIC_INTERFACE
 * TaskItem component: displays one task, allows complete/toggle, edit, delete.
 * Props:
 *   task - the task object to render
 *   onEdit, onDelete, onToggle - callbacks to inform parent to reload upon mutating actions
 */
function TaskItem({ task, onEdit, onDelete, onToggle }) {
  const { token } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  // Toggle completion
  const handleToggle = async () => {
    setSubmitting(true); setErr("");
    try {
      const resp = await fetch(`/api/tasks/${task.id}/toggle`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Could not toggle status");
      if (onToggle) onToggle(task.id);
    } catch {
      setErr("Error toggling status");
    } finally { setSubmitting(false); }
  };

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    setSubmitting(true); setErr("");
    try {
      const resp = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("Could not delete task");
      if (onDelete) onDelete(task.id);
    } catch {
      setErr("Error deleting task");
    } finally { setSubmitting(false); }
  };

  // Edit
  const startEdit = () => {
    if (onEdit) onEdit(task);
  };

  const taskStyles = {
    background: "var(--bg-secondary)",
    color: "var(--text-primary)",
    borderRadius: 7,
    marginBottom: 12,
    padding: "14px 16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    display: "flex",
    alignItems: "center",
    gap: 20,
    border: task.completed ? "1.3px solid #6ac27f" : "1px solid var(--border-color)",
    opacity: task.completed ? 0.7 : 1
  };

  return (
    <div style={taskStyles}>
      <input
        type="checkbox"
        checked={task.completed}
        disabled={submitting}
        onChange={handleToggle}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
        style={{ marginRight: 14, transform: "scale(1.25)" }}
      />
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{
          textDecoration: task.completed ? "line-through" : "none",
          fontWeight: "bold",
          fontSize: 17
        }}>{task.title}</div>
        <div style={{
          color: "var(--text-secondary)",
          fontSize: 14,
          marginTop: 2,
          marginBottom: 6
        }}>{task.description}</div>
        <span style={{
          padding: "2px 10px",
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          background: getPriorityColor(task.priority),
          color: "#fff",
          marginRight: 8
        }}>
          {capitalize(task.priority)}
        </span>
      </div>
      <button onClick={startEdit} style={btnStyle("accent")}>Edit</button>
      <button onClick={handleDelete} disabled={submitting} style={btnStyle("danger")}>Delete</button>
      {err && <span style={{ color: "crimson", fontSize: 13, marginLeft: 10 }}>{err}</span>}
    </div>
  );
}

// Helper styles and functions
function btnStyle(type) {
  switch (type) {
    case "accent":
      return {
        background: "#ff9800", color: "#fff", border: "none", borderRadius: 6, padding: "7px 16px",
        marginLeft: 4, cursor: "pointer", fontWeight: 600
      };
    case "danger":
      return {
        background: "#e6584f", color: "#fff", border: "none", borderRadius: 6, padding: "7px 10px",
        marginLeft: 6, cursor: "pointer", fontWeight: 600
      };
    default:
      return {};
  }
}

function getPriorityColor(priority) {
  switch ((priority || "").toLowerCase()) {
    case "high":
      return "#e6584f";
    case "normal":
      return "#1976d2";
    case "low":
      return "#777";
    default:
      return "#bdbdbd";
  }
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default TaskItem;
