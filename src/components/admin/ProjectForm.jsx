import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap'
import projectService from '../../services/project.service'
import userService from '../../services/user.service'

export default function ProjectForm({ show, onHide, project, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    projectManager: '',
    teamMembers: [],
    selectedFiles: []
  })
  const [existingFiles, setExistingFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projectManagers, setProjectManagers] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(true)

  // 🔹 Fetch Project Managers and Team Members
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const [pmRes, tmRes] = await Promise.all([
          userService.getUsersByRole('ProjectManager', token),
          userService.getUsersByRole('TeamMember', token)
        ])
        console.log("PM", pmRes);
        console.log("TM", tmRes);
        setProjectManagers(pmRes)
        setTeamMembers(tmRes)
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Failed to load users for selection')
      } finally {
        setLoadingUsers(false)
      }
    }

    if (show) fetchUsers()
  }, [show])

  // 🔹 Set form data for Create or Edit mode
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        status: project.status || 'Active',
        projectManager: project.projectManager?._id || '',
        teamMembers: project.teamMembers?.map((m) => m._id) || [],
        selectedFiles: []
      })
      setExistingFiles(project.files || [])
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'Active',
        projectManager: '',
        teamMembers: [],
        selectedFiles: []
      })
      setExistingFiles([])
    }
  }, [project, show])

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTeamMembersChange = (e) => {
    const options = e.target.options
    const selected = []
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value)
    }
    setFormData((prev) => ({ ...prev, teamMembers: selected }))
  }

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, selectedFiles: Array.from(e.target.files) }))
  }

  // 🔹 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('status', formData.status)
      data.append('projectManager', formData.projectManager || '')
      data.append('teamMembers', JSON.stringify(formData.teamMembers || []))
      formData.selectedFiles.forEach(file => data.append('files', file))

      if (project) {
        await projectService.updateProject(project._id, data, token)
      } else {
        await projectService.createProject(data, token)
      }

      onSuccess()
      onHide()
    } catch (err) {
      console.error('Failed to save project:', err)
      setError(err.response?.data?.message || 'Failed to save project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{project ? 'Edit Project' : 'Create New Project'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {loadingUsers ? (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Loading users...</p>
            </div>
          ) : (
            <>
              {/* Project Name */}
              <Form.Group className="mb-3">
                <Form.Label>Project Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter project name"
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter project description"
                />
              </Form.Group>

              {/* Status */}
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </Form.Select>
              </Form.Group>

              {/* Project Manager */}
              <Form.Group className="mb-3">
                <Form.Label>Project Manager</Form.Label>
                <Form.Select
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleChange}
                  required={true} // 🔹 ensure PM must be selected
                >
                  <option value="">-- Select Project Manager --</option>
                  {projectManagers.map((pm) => (
                    <option key={pm._id} value={pm._id}>
                      {pm.name} ({pm.email})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              {/* Team Members */}
              <Form.Group className="mb-3">
                <Form.Label>Team Members</Form.Label>
                <Form.Select
                  multiple
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleTeamMembersChange}
                >
                  {teamMembers.map((tm) => (
                    <option key={tm._id} value={tm._id}>
                      {tm.name} ({tm.email})
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Hold Ctrl (Windows) or Command (Mac) to select multiple members.
                </Form.Text>
              </Form.Group>

              {/* Existing Files */}
              {project && existingFiles.length > 0 && (
                <Form.Group className="mb-3">
                  <Form.Label>Existing Files</Form.Label>
                  <ul>
                    {existingFiles.map((file, index) => (
                      <li key={index}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Form.Group>
              )}

              {/* Files */}
              <Form.Group className="mb-3">
                <Form.Label>Upload Files</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                <Form.Text className="text-muted">
                  Select multiple files to upload.
                </Form.Text>
              </Form.Group>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading || loadingUsers}>
            {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
