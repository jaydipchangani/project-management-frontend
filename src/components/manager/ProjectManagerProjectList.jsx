import React, { useEffect, useState } from 'react'
import {
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Modal,
  Form,
  Row,
  Col,
  Pagination
} from 'react-bootstrap'
import projectService from '../../services/project.service'
import userService from '../../services/user.service'

export default function ProjectManagerProjectList({ onEditProject, onCreateProject, refreshTrigger }) {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([])
  const [updatingTeam, setUpdatingTeam] = useState(false)
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        const projectList = Array.isArray(data) ? data : data.data || []
        setProjects(projectList)
        setFilteredProjects(projectList)
      } catch {
        setError('Failed to load projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...projects]
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (sortField === 'createdAt') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    setFilteredProjects(filtered)
    setCurrentPage(1)
  }, [search, sortField, sortOrder, projects])

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      const token = localStorage.getItem('token')
      await projectService.deleteProject(projectId, token)
      setProjects(projects.filter((p) => p._id !== projectId))
    } catch {
      setError('Failed to delete project')
    }
  }

  const handleManageTeam = async (project) => {
    setSelectedProject(project)
    setSelectedTeamMembers(project.teamMembers?.map((tm) => tm._id) || [])
    try {
      const token = localStorage.getItem('token')
      const members = await userService.getUsersByRole('TeamMember', token)
      setTeamMembers(Array.isArray(members) ? members : members.data || [])
    } catch {
      setError('Failed to load team members')
    }
    setShowTeamModal(true)
  }

  const handleTeamMembersChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value)
    setSelectedTeamMembers(selected)
  }

  const handleSaveTeam = async () => {
    if (!selectedProject) return
    setUpdatingTeam(true)
    try {
      const token = localStorage.getItem('token')
      await projectService.updateProject(
        selectedProject._id,
        { teamMembers: selectedTeamMembers },
        token
      )
      setProjects((prev) =>
        prev.map((p) =>
          p._id === selectedProject._id
            ? { ...p, teamMembers: selectedTeamMembers.map((id) => ({ _id: id })) }
            : p
        )
      )
      setShowTeamModal(false)
      setSelectedProject(null)
      setSelectedTeamMembers([])
    } catch {
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

  const indexOfLast = currentPage * pageSize
  const indexOfFirst = indexOfLast - pageSize
  const currentProjects = filteredProjects.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredProjects.length / pageSize)

  if (loading)
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading projects...</p>
      </div>
    )

  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header>
          <Row className="align-items-center g-2">
            <Col md={4}>
              <h5 className="mb-0">Projects</h5>
            </Col>
            <Col md={4}>
              <Form.Control
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </Form.Select>
            </Col>
            <Col md={1}>
              <Button
                variant="outline-secondary"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {currentProjects.length > 0 ? (
            <>
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
                    {currentProjects.map((project) => (
                      <tr key={project._id}>
                        <td><strong>{project.name}</strong></td>
                        <td
                          style={{
                            maxWidth: '200px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={project.description}
                        >
                          {project.description || 'N/A'}
                        </td>
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
              <div className="d-flex justify-content-between align-items-center">
                <small>Page {currentPage} of {totalPages}</small>
                <Pagination className="mb-0">
                  <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                  <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                  <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
              </div>
            </>
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
            <Form.Label><strong>Select Team Members</strong></Form.Label>
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
