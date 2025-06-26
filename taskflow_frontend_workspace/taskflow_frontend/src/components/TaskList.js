import React, { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { useAuth } from "../AuthContext";

/**
 * PUBLIC_INTERFACE
 * TaskList component: displays a list of tasks, handles fetching tasks from backend API.
 */
function TaskList({ onEditTask, onDeleteTask, onToggleStatus, filter, sort, refreshFlag }) {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");

  // Fetch tasks from backend, filtered/sorted as needed
  useEffect(() => {
    let ignore = false;
    async function fetchTasks() {
      setLoading(true);
      setFetchErr("");
      try {
        let url = "/api/tasks/";
        let params = [];
        const { status, priority } = filter || {};
        const { by, dir } = sort || {};
        if (status) params.push(`status=${encodeURIComponent(status)}`);
        if (priority) params.push(`priority=${encodeURIComponent(priority)}`);
        if (by) params.push(`sort_by=${encodeURIComponent(by)}`);
        if (dir) params.push(`sort_dir=${encodeURIComponent(dir)}`);
        if (params.length) url += "?" + params.join("&");

        const resp = await fetch(url, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        if (!resp.ok) throw new Error("Failed to fetch tasks");
        const data = await resp.json();
        if (!ignore) setTasks(data);
      } catch (err) {
        if (!ignore) setFetchErr("Unable to load tasks.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchTasks();
    return () => { ignore = true; };
  }, [token, filter, sort, refreshFlag]);

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
          refreshTasks={() => {}} // not used, see below
        />
      ))}
    </div>
  );
}

export default TaskList;
