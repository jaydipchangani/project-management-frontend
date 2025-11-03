import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import TaskList from '../../components/admin/TaskList'
import TaskForm from '../../components/admin/TaskForm'
import TeamMemberTaskList from '../../components/team/TeamMemberTaskList'

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
        <>
          <TaskList
            onEditTask={handleEditTask}
            onCreateTask={handleCreateTask}
            refreshTrigger={refreshTrigger}
          />
          <TaskForm
            show={showTaskForm}
            onHide={() => setShowTaskForm(false)}
            task={editingTask}
            onSuccess={handleTaskFormSuccess}
          />
        </>
      )}

      {user?.role === 'TeamMember' && <TeamMemberTaskList />}

      {user?.role !== 'Admin' && user?.role !== 'TeamMember' && (
        <div className="text-center my-5">
          <p>Task viewing features coming soon for your role.</p>
        </div>
      )}
    </div>
  )
}