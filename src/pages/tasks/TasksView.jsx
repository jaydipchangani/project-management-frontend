import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import TaskList from '../../components/admin/TaskList'
import TaskForm from '../../components/admin/TaskForm'

export default function TasksView() {
  const { user } = useAuth()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateTask = () => {
    setEditingTask(null)
    setShowTaskForm(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const handleTaskFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div>
      <h2 className="mb-4">Tasks</h2>

      {user?.role === 'Admin' && (
        <TaskList
          onEditTask={handleEditTask}
          onCreateTask={handleCreateTask}
          refreshTrigger={refreshTrigger}
        />
      )}

      {user?.role !== 'Admin' && (
        <div className="text-center my-5">
          <p>Task viewing features coming soon for your role.</p>
        </div>
      )}

      {/* Task Form Modal - only for admin */}
      {user?.role === 'Admin' && (
        <TaskForm
          show={showTaskForm}
          onHide={() => setShowTaskForm(false)}
          task={editingTask}
          onSuccess={handleTaskFormSuccess}
        />
      )}
    </div>
  )
}