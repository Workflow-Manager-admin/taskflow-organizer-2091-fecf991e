import React, { useState, useCallback } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../AuthContext';

/**
 * PUBLIC_INTERFACE
 * Dashboard Page component
 * Displays user's tasks, with Add/Edit task form and list.
 */
function DashboardPage() {
  const { logout, user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshFlag, setRefreshFlag] = useState(0);

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
    setRefreshFlag(r => r + 1); // re-render
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // Optionally: handle Filtering and Sorting (future)
  const filter = null, sort = null;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", paddingTop: 25 }}>
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
        marginBottom: 16, gap: 12
      }}>
        <h2 style={{ margin: 0 }}>Task Dashboard</h2>
        <div>
          <span style={{ color: "var(--text-secondary)", fontSize: 16, marginRight: 15 }}>
            {user?.username}
          </span>
          <button
            onClick={logout}
            style={{
              background: "none",
              color: "var(--button-bg)",
              border: "1px solid var(--button-bg)",
              borderRadius: 5,
              padding: "5px 14px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 15
            }}
          >
            Log out
          </button>
        </div>
      </header>
      <button
        onClick={handleNewTask}
        style={{
          background: "var(--button-bg)",
          color: "var(--button-text)",
          border: "none",
          borderRadius: 6,
          padding: "8px 20px",
          fontWeight: 700,
          fontSize: 17,
          marginBottom: 14,
          cursor: "pointer"
        }}
      >
        + New Task
      </button>
      {showForm && (
        <TaskForm
          task={editingTask}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
      <TaskList
        key={refreshFlag}
        onEditTask={handleEditTask}
        onDeleteTask={handleFormSuccess}
        onToggleStatus={handleFormSuccess}
        filter={filter}
        sort={sort}
      />
    </div>
  );
}

export default DashboardPage;
