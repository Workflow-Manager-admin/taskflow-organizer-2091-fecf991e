import React, { useState } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/**
 * PUBLIC_INTERFACE
 * Dashboard Page component
 * Displays user's tasks, with Add/Edit task form and list.
 * Uses DashboardLayout for header/sidebar/main, modern styling, mobile-responsive.
 */
function DashboardPage() {
  const { logout, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

  // Filtering and sorting state for sidebar controls
  const [statusFilter, setStatusFilter] = useState("all"); // "all"|"completed"|"incomplete"
  const [priorityFilter, setPriorityFilter] = useState("all"); // "all"|"low"|"normal"|"high"
  const [sortBy, setSortBy] = useState("created_at"); // "created_at"|"priority"
  const [sortDir, setSortDir] = useState("desc"); // "asc"|"desc"

  // Compose filter/sort objects for TaskList API requests
  const filter = {
    status: statusFilter === "all" ? undefined : (statusFilter === "completed" ? "completed" : "incomplete"),
    priority: priorityFilter === "all" ? undefined : priorityFilter
  };
  const sort = { by: sortBy, dir: sortDir };

  // Handler functions for main area
  const handleNewTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    setRefreshFlag(r => r + 1); // trigger task list reload
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Header content
  const headerContent = (
    <React.Fragment>
      <span style={{ fontWeight: 700, fontSize: 21, letterSpacing: "0.2px", display: "flex", alignItems: "center" }}>
        <span style={{
          display: "inline-block", width: 10, height: 18, background: "#ff9800", borderRadius: 2, marginRight: 13
        }} />Taskflow
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "15px", fontSize: 15 }}>
        <span style={{ color: "#ff9800", fontWeight: 500 }}>{user?.username}</span>
        <button
          onClick={logout}
          style={{
            background: "none",
            color: "#fff",
            border: "1.5px solid #fff",
            borderRadius: 5,
            padding: "5px 14px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 15,
            opacity: 0.9,
            marginLeft: 2,
            transition: "background 0.17s, border 0.17s, color 0.17s"
          }}
        >
          Log out
        </button>
      </div>
    </React.Fragment>
  );

  // Sidebar content: filters & controls
  const sidebar = (
    <form style={{
      display: "flex",
      flexDirection: "column",
      gap: 18,
      color: "#fff",
      position: "relative"
    }} onSubmit={e => e.preventDefault()}>
      <label style={{ fontWeight: 600 }}>
        Status
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            display: "block",
            marginTop: 7,
            borderRadius: 6,
            border: "1px solid #555",
            padding: "7px 10px",
            background: "#303030",
            color: "#fff",
            fontSize: 15,
            width: "100%"
          }}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="incomplete">Incomplete</option>
        </select>
      </label>
      <label style={{ fontWeight: 600 }}>
        Priority
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={{
            display: "block",
            marginTop: 7,
            borderRadius: 6,
            border: "1px solid #555",
            padding: "7px 10px",
            background: "#303030",
            color: "#fff",
            fontSize: 15,
            width: "100%"
          }}>
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="normal">Normal</option>
          <option value="low">Low</option>
        </select>
      </label>
      <label style={{ fontWeight: 600 }}>
        Sort by
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            display: "block",
            marginTop: 7,
            borderRadius: 6,
            border: "1px solid #555",
            padding: "7px 10px",
            background: "#303030",
            color: "#fff",
            fontSize: 15,
            width: "100%"
          }}>
          <option value="created_at">Date Created</option>
          <option value="priority">Priority</option>
        </select>
      </label>
      <label style={{ fontWeight: 600 }}>
        Direction
        <select
          value={sortDir}
          onChange={e => setSortDir(e.target.value)}
          style={{
            display: "block",
            marginTop: 7,
            borderRadius: 6,
            border: "1px solid #555",
            padding: "7px 10px",
            background: "#303030",
            color: "#fff",
            fontSize: 15,
            width: "100%"
          }}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </label>
      <button
        type="button"
        onClick={handleNewTask}
        style={{
          marginTop: 17,
          background: "#ff9800",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "11px 0",
          fontWeight: 700,
          fontSize: 16,
          width: "100%",
          boxShadow: "0 2px 6px 0 rgba(255,152,0,0.06)",
          cursor: "pointer"
        }}
      >+ New Task</button>
    </form>
  );

  // Main area content
  return (
    <DashboardLayout headerContent={headerContent} sidebar={sidebar}>
      {showForm && (
        <TaskForm
          task={editingTask}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
      <TaskList
        key={statusFilter + "|" + priorityFilter + "|" + sortBy + "|" + sortDir}
        onEditTask={handleEditTask}
        onDeleteTask={() => setRefreshFlag(r => r + 1)}
        onToggleStatus={() => setRefreshFlag(r => r + 1)}
        filter={filter}
        sort={sort}
        refreshFlag={refreshFlag}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
