import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap'
import projectService from '../../services/project.service'
import userService from '../../services/user.service'

export default function ProjectManagerProjectList({ onEditProject, onCreateProject, refreshTrigger }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([])
  const [updatingTeam, setUpdatingTeam] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        setProjects(Array.isArray(data) ? data : data.data || [])
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

  const handleManageTeam = async (project) => {
    setSelectedProject(project)
    setSelectedTeamMembers(project.teamMembers?.map(tm => tm._id) || [])

    try {
      const token = localStorage.getItem('token')
      const members = await userService.getUsersByRole('TeamMember', token)
      setTeamMembers(Array.isArray(members) ? members : members.data || [])
    } catch (err) {
      console.error('Failed to fetch team members:', err)
      setError('Failed to load team members')
    }

    setShowTeamModal(true)
  }

  const handleTeamMembersChange = (e) => {
    const options = e.target.options
    const selected = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value)
    }
    setSelectedTeamMembers(selected)
  }

  const handleSaveTeam = async () => {
    if (!selectedProject) return

    setUpdatingTeam(true)
    try {
      const token = localStorage.getItem('token')
      await projectService.updateProject(selectedProject._id, {
        teamMembers: selectedTeamMembers
      }, token)

      setProjects(projects.map(p =>
        p._id === selectedProject._id
          ? { ...p, teamMembers: selectedTeamMembers.map(id => ({ _id: id })) }
          : p
      ))

      setShowTeamModal(false)
      setSelectedProject(null)
      setSelectedTeamMembers([])
    } catch (err) {
      console.error('Failed to update team members:', err)
      setError('Failed to update team members')
    } finally {
      setUpdatingTeam(false)
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success'
      case 'completed':
        return 'secondary'
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
    <>
      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Projects</h5>
          <Button variant="primary" onClick={onCreateProject}>
            Create Project
          </Button>
        </Card.Header>
        <Card.Body>
          {projects.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Team Members</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project._id}>
                      <td>
                        <strong>{project.name}</strong>
                      </td>
                      <td>{project.description || 'N/A'}</td>
                      <td>
                        <Badge bg={getStatusBadgeVariant(project.status)}>
                          {project.status}
                        </Badge>
                      </td>
                      <td>{project.teamMembers?.length || 0}</td>
                      <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleManageTeam(project)}
                        >
                          Team
                        </Button>
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
            </div>
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

      <Modal show={showTeamModal} onHide={() => setShowTeamModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Manage Team Members - {selectedProject?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>
              <strong>Select Team Members</strong>
            </Form.Label>
            <Form.Select
              multiple
              value={selectedTeamMembers}
              onChange={handleTeamMembersChange}
              style={{ minHeight: '200px' }}
            >
              {teamMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted d-block mt-2">
              Hold Ctrl (Windows) or Command (Mac) to select multiple members.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTeamModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveTeam} disabled={updatingTeam}>
            {updatingTeam ? 'Saving...' : 'Save Team Members'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
