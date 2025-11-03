import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert, Modal } from 'react-bootstrap'
import userService from '../../services/user.service'

export default function UsersList({ onEditUser, onCreateUser, refreshTrigger }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('token')
        const res = await userService.getAllUsers(token)
        //console.log("Fetched Users",res)
        setUsers(Array.isArray(res) ? res : res.data || [])
        //console.log("Set Users",users)
      } catch (err) {
        //console.error('Error fetching users:', err)
        setError(err.response?.data?.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [refreshTrigger])

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token')
      await userService.deleteUser(selectedUser._id, token)
      setShowDeleteModal(false)
      setSelectedUser(null)
      window.alert('User deleted successfully!')
      // trigger refresh
      window.location.reload()
    } catch (err) {
      //console.error('Failed to delete user:', err)
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  if (loading) return <div className="text-center"><Spinner animation="border" /></div>
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>All Users</h5>
        <Button variant="primary" onClick={onCreateUser}>
          + Add User
        </Button>
      </div>

      {users.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEditUser(u)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      setSelectedUser(u)
                      setShowDeleteModal(true)
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Delete confirmation modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
