import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import TaskList from '../../components/admin/TaskList'
import TaskForm from '../../components/admin/TaskForm'
import TeamMemberTaskList from '../../components/team/TeamMemberTaskList'
import ProjectManagerTaskList from '../../components/manager/ProjectManagerTaskList'
import ProjectManagerTaskModal from '../../components/manager/ProjectManagerTaskModal'
import projectService from '../../services/project.service'

export default function TasksView() {
  const { user } = useAuth()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [projects, setProjects] = useState([])
  const [projectsLoaded, setProjectsLoaded] = useState(false)

  const handleCreateTask = async () => {
    setEditingTask(null)

    if (user?.role === 'ProjectManager' && !projectsLoaded) {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        const projectList = Array.isArray(data) ? data : data.data || []
        setProjects(projectList)
        setProjectsLoaded(true)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      }
    }

    setShowTaskForm(true)
  }

  const handleEditTask = async (task) => {
    setEditingTask(task)

    if (user?.role === 'ProjectManager' && !projectsLoaded) {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        const projectList = Array.isArray(data) ? data : data.data || []
        setProjects(projectList)
        setProjectsLoaded(true)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      }
    }

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

      {user?.role === 'ProjectManager' && (
        <>
          <ProjectManagerTaskList
            onCreateTask={handleCreateTask}
            refreshTrigger={refreshTrigger}
          />
          <ProjectManagerTaskModal
            show={showTaskForm}
            onHide={() => setShowTaskForm(false)}
            task={editingTask}
            projects={projects}
            onSuccess={handleTaskFormSuccess}
          />
        </>
      )}

      {user?.role !== 'Admin' && user?.role !== 'TeamMember' && user?.role !== 'ProjectManager' && (
        <div className="text-center my-5">
          <p>Task viewing features coming soon for your role.</p>
        </div>
      )}
    </div>
  )
}