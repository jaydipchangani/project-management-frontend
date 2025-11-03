import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, Alert } from 'react-bootstrap'
import userService from '../../services/user.service'

export default function UserForm({ show, onHide, user, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'TeamMember'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'TeamMember'
      })
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'TeamMember'
      })
    }
  }, [user, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      if (user) {
        await userService.updateUser(user._id, formData, token)
      } else {
        await userService.createUser(formData, token)
      }
      onSuccess()
      onHide()
    } catch (err) {
      console.error('Failed to save user:', err)
      setError(err.response?.data?.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Edit User' : 'Create User'}</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-3">
            <Form.Label>Name *</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </Form.Group>

          {!user && (
            <Form.Group className="mb-3">
              <Form.Label>Password *</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Admin">Admin</option>
              <option value="ProjectManager">Project Manager</option>
              <option value="TeamMember">Team Member</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Saving...' : user ? 'Update User' : 'Create User'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}
