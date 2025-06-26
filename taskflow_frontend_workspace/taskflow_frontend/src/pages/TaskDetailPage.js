import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Task Detail Page component
 * Skeleton for viewing/editing a specific task.
 */
function TaskDetailPage() {
  const { id } = useParams();
  return (
    <div>
      <h2>Task Details</h2>
      <p>This is the detail view for task ID: <b>{id}</b> (UI coming soon)</p>
    </div>
  );
}

export default TaskDetailPage;
