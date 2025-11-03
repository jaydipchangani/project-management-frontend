import React, { useState, useEffect } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import taskService from '../../services/task.service'

export default function TeamMemberTaskModal({ show, onHide, task, onSuccess }) {
  const [formData, setFormData] = useState({
    status: 'Pending',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task && show) {
      setFormData({
        status: task.status || 'Pending',
      })
      setError('')
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
        status: formData.status,
      }

      await taskService.updateTask(task._id, submitData, token)
      onSuccess()
      onHide()
    } catch (err) {
      console.error('Failed to update task:', err)
      setError(err.response?.data?.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  if (!task) return null

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Update Task Status</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Task Title</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={task.title || ''}
              disabled
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Description</strong>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={task.description || 'N/A'}
              disabled
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Priority</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={task.priority || 'N/A'}
              disabled
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Due Date</strong>
            </Form.Label>
            <Form.Control
              type="text"
              value={
                task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : 'N/A'
              }
              disabled
              className="bg-light"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Update Status *</strong>
            </Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Task'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
