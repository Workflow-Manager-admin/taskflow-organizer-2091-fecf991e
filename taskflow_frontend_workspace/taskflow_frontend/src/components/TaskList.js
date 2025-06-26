import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { useAuth } from "../AuthContext";

/**
 * PUBLIC_INTERFACE
 * TaskList component: displays a list of tasks, handles fetching tasks from backend API.
 */
function TaskList({ onEditTask, onDeleteTask, onToggleStatus, filter, sort }) {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  // Fetch tasks from backend, filtered/sorted as needed
  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      setFetchErr("");
      try {
        let url = "/api/tasks/";
        let params = [];
        if (filter?.status) params.push(`status=${encodeURIComponent(filter.status)}`);
        if (filter?.priority) params.push(`priority=${encodeURIComponent(filter.priority)}`);
        if (sort) {
          params.push(`sort_by=${encodeURIComponent(sort.by)}`);
          params.push(`sort_dir=${encodeURIComponent(sort.dir)}`);
        }
        if (params.length) url += "?" + params.join("&");

        const resp = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (!resp.ok) throw new Error("Failed to fetch tasks");
        const data = await resp.json();
        setTasks(data);
      } catch (err) {
        setFetchErr("Unable to load tasks.");
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, [token, filter, sort]);

  // Handler for local updates (after creation, deletion, edit)
  const refresh = () => {
    setLoading(true);
    setTimeout(() => { // triggers effect
      setLoading(false);
    }, 1);
  };

  if (loading) return <div>Loading tasks...</div>;
  if (fetchErr) return <div style={{ color: 'crimson' }}>{fetchErr}</div>;
  if (!tasks.length) return <div>No tasks found.</div>;

  return (
    <div style={{ width: "100%", maxWidth: 680, margin: "0 auto", marginTop: 16 }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onToggle={onToggleStatus}
          refreshTasks={refresh}
        />
      ))}
    </div>
  );
}

export default TaskList;
