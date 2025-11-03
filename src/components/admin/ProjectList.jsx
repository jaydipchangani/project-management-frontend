import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import projectService from '../../services/project.service'

export default function ProjectList({ onEditProject, onCreateProject, refreshTrigger }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        setProjects(data.data)
      } catch (err) {
        console.error('Failed to fetch projects:', err)
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [refreshTrigger])

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await projectService.deleteProject(projectId, token)
      setProjects(projects.filter(project => project._id !== projectId))
    } catch (err) {
      console.error('Failed to delete project:', err)
      setError('Failed to delete project')
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'Active':
        return 'secondary'
      case 'Completed':
        return 'success'
      default:
        return 'secondary'
    }
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Projects</h5>
        <Button variant="primary" onClick={onCreateProject}>
          Create Project
        </Button>
      </Card.Header>
      <Card.Body>
        {projects.length > 0 ? (
          <Table striped bordered hover responsive>
  <thead className="table-dark">
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>Status</th>
      <th>Created By</th>
      <th>Team Members</th>
      <th>Created At</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {projects.map((project) => (
      <tr key={project._id}>
        <td>{project.name}</td>
        <td>{project.description}</td>
        <td>
          <Badge bg={getStatusBadgeVariant(project.status)}>
            {project.status}
          </Badge>
        </td>
        <td>{project.createdBy?.name || 'N/A'}</td>
        <td>{project.teamMembers?.length || 0}</td>
        <td>{new Date(project.createdAt).toLocaleDateString()}</td>
        <td>
          <Button
            variant="outline-primary"
            size="sm"
            className="me-2"
            onClick={() => onEditProject(project)}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDeleteProject(project._id)}
          >
            Delete
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>

        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No projects found.</p>
            <Button variant="primary" onClick={onCreateProject}>
              Create Your First Project
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}