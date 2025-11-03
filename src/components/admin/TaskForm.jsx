import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import taskService from '../../services/task.service'
import projectService from '../../services/project.service'
import userService from '../../services/user.service' // ✅ import user service

export default function TaskForm({ show, onHide, task, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: '',
    projectId: '',
    assignedTo: '' // ✅ new field
  })
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([]) // ✅ team members state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ✅ Fetch projects when modal opens
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        setProjects(data.data || [])
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      }
    }

    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('token')
        const users = await userService.getUsersByRole('TeamMember', token)
        setTeamMembers(Array.isArray(users) ? users : users.data || [])
      } catch (err) {
        console.error('Failed to fetch team members:', err)
      }
    }

    if (show) {
      fetchProjects()
      fetchTeamMembers()
    }
  }, [show])

  // ✅ Populate form if editing an existing task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        projectId: task.projectId || '',
        assignedTo: task.assignedTo || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        dueDate: '',
        projectId: '',
        assignedTo: ''
      })
    }
  }, [task, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const submitData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      }

      if (task) {
        await taskService.updateTask(task._id, submitData, token)
      } else {
        await taskService.createTask(submitData, token)
      }

      onSuccess()
      onHide()
    } catch (err) {
      console.error('Failed to save task:', err)
      setError(err.response?.data?.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {task ? 'Edit Task' : 'Create New Task'}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Title */}
          <Form.Group className="mb-3">
            <Form.Label>Task Title *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
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
              placeholder="Enter task description"
            />
          </Form.Group>

          {/* Project Select */}
          <Form.Group className="mb-3">
            <Form.Label>Project</Form.Label>
            <Form.Select
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
            >
              <option value="">Select a project (optional)</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* ✅ Assigned To */}
          <Form.Group className="mb-3">
            <Form.Label>Assign To</Form.Label>
            <Form.Select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select a team member</option>
              {teamMembers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Status */}
          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>

          {/* Priority */}
          <Form.Group className="mb-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Form.Group>

          {/* Due Date */}
          <Form.Group className="mb-3">
            <Form.Label>Due Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
