import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import ProjectList from '../../components/admin/ProjectList'
import ProjectForm from '../../components/admin/ProjectForm'

export default function ProjectsView() {
  const { user } = useAuth()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateProject = () => {
    setEditingProject(null)
    setShowProjectForm(true)
  }

  const handleEditProject = (project) => {
    setEditingProject(project)
    setShowProjectForm(true)
  }

  const handleProjectFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div>
      <h2 className="mb-4">Projects</h2>

      {user?.role === 'Admin' && (
        <ProjectList
          onEditProject={handleEditProject}
          onCreateProject={handleCreateProject}
          refreshTrigger={refreshTrigger}
        />
      )}

      {user?.role !== 'Admin' && (
        <div className="text-center my-5">
          <p>Project viewing features coming soon for your role.</p>
        </div>
      )}

      {/* Project Form Modal - only for admin */}
      {user?.role === 'Admin' && (
        <ProjectForm
          show={showProjectForm}
          onHide={() => setShowProjectForm(false)}
          project={editingProject}
          onSuccess={handleProjectFormSuccess}
        />
      )}
    </div>
  )
}