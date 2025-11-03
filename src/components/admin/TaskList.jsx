import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge, Form, Row, Col, Pagination } from 'react-bootstrap'
import taskService from '../../services/task.service'

export default function TaskList({ onEditTask, onCreateTask, refreshTrigger }) {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortField, setSortField] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await taskService.getAllTasks(token)
        setTasks(data.data)
        setFilteredTasks(data.data)
      } catch (err) {
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...tasks]
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (statusFilter) filtered = filtered.filter((t) => t.status === statusFilter)
    if (priorityFilter) filtered = filtered.filter((t) => t.priority === priorityFilter)
    filtered.sort((a, b) => {
      let aVal = a[sortField], bVal = b[sortField]
      if (sortField === 'dueDate') {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    setFilteredTasks(filtered)
    setCurrentPage(1)
  }, [search, statusFilter, priorityFilter, sortField, sortOrder, tasks])

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      const token = localStorage.getItem('token')
      await taskService.deleteTask(taskId, token)
      setTasks(tasks.filter((task) => task._id !== taskId))
    } catch {
      setError('Failed to delete task')
    }
  }

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'secondary'
      case 'in progress':
        return 'primary'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'success'
      case 'medium':
        return 'warning'
      case 'high':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const indexOfLastTask = currentPage * pageSize
  const indexOfFirstTask = indexOfLastTask - pageSize
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask)
  const totalPages = Math.ceil(filteredTasks.length / pageSize)

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading tasks...</p>
      </div>
    )
  }

  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-3">
          <Col md={3}><h5 className="mb-0">Tasks</h5></Col>
          <Col md={3}>
            <Form.Control
              placeholder="Search by title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={2}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Form.Select>
          </Col>
          <Col md={1}>
            <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
              <option value="priority">Priority</option>
            </Form.Select>
          </Col>
          <Col md={1}>
            <Button variant="outline-secondary" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </Col>
          <Col md={12} className="text-end">
            <Button variant="primary" onClick={onCreateTask}>+ Add</Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {currentTasks.length > 0 ? (
          <>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td
                      style={{
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={task.description}
                    >
                      {task.description}
                    </td>
                    <td><Badge bg={getStatusBadgeVariant(task.status)}>{task.status}</Badge></td>
                    <td><Badge bg={getPriorityBadgeVariant(task.priority)}>{task.priority}</Badge></td>
                    <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEditTask(task)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDeleteTask(task._id)}>Delete</Button>
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
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No tasks found.</p>
            <Button variant="primary" onClick={onCreateTask}>Create Your First Task</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
