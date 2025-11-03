import React, { useEffect, useState } from 'react'
import { Table, Button, Spinner, Alert, Modal, Form, Row, Col, Pagination } from 'react-bootstrap'
import userService from '../../services/user.service'

export default function UsersList({ onEditUser, onCreateUser, refreshTrigger }) {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [sortField, setSortField] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const pageSize = 5

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('token')
        const res = await userService.getAllUsers(token)
        const data = Array.isArray(res) ? res : res.data || []
        setUsers(data)
        setFilteredUsers(data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...users]
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (roleFilter) filtered = filtered.filter((u) => u.role === roleFilter)
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
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [search, roleFilter, sortField, sortOrder, users])

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token')
      await userService.deleteUser(selectedUser._id, token)
      setUsers(users.filter((u) => u._id !== selectedUser._id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    }
  }

  const indexOfLast = currentPage * pageSize
  const indexOfFirst = indexOfLast - pageSize
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filteredUsers.length / pageSize)

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /></div>
  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <div>
      <Row className="align-items-center mb-3 g-2">
        <Col md={3}><h5>All Users</h5></Col>
        <Col md={3}>
          <Form.Control
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="ProjectManager">Project Manager</option>
            <option value="TeamMember">Team Member</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
            <option value="createdAt">Created Date</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
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
        <Col md={1} className="text-end">
          <Button variant="primary" onClick={onCreateUser}>+ Add</Button>
        </Col>
      </Row>

      {currentUsers.length === 0 ? (
        <Alert variant="info">No users found.</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
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
              {currentUsers.map((u, i) => (
                <tr key={u._id}>
                  <td>{indexOfFirst + i + 1}</td>
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
          <div className="d-flex justify-content-between align-items-center">
            <small>Page {currentPage} of {totalPages}</small>
            <Pagination className="mb-0">
              <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
              <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        </>
      )}

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{selectedUser?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
