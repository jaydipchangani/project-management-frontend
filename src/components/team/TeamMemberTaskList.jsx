import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge, Form, Row, Col, Pagination } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import taskService from '../../services/task.service'
import TeamMemberTaskModal from './TeamMemberTaskModal'

export default function TeamMemberTaskList() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState('dueDate')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const pageSize = 5

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (user?._id) {
          const data = await taskService.getAssignedTasks(user._id, token)
          const tasksData = Array.isArray(data) ? data : data.data || []
          setTasks(tasksData)
          setFilteredTasks(tasksData)
        }
      } catch {
        setError('Failed to load your assigned tasks')
      } finally {
        setLoading(false)
      }
    }
    fetchAssignedTasks()
  }, [user, refreshTrigger])

  useEffect(() => {
    let filtered = [...tasks]
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description?.toLowerCase().includes(search.toLowerCase())
      )
    }
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
  }, [search, sortField, sortOrder, tasks])

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  const handleTaskUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
    setShowModal(false)
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
        <p className="mt-3">Loading your tasks...</p>
      </div>
    )
  }

  if (error) return <Alert variant="danger">{error}</Alert>

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header>
          <Row className="align-items-center g-2">
            <Col md={4}><h5 className="mb-0">My Assigned Tasks</h5></Col>
            <Col md={4}>
              <Form.Control
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Col>
            <Col md={3}>
              <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
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
          {currentTasks.length > 0 ? (
            <>
              <div className="table-responsive">
                <Table striped bordered hover>
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
                          {task.description || 'N/A'}
                        </td>
                        <td>
                          <Badge bg={getStatusBadgeVariant(task.status)}>
                            {task.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getPriorityBadgeVariant(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>
                        <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditTask(task)}
                          >
                            Update
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
              <p className="text-muted">No tasks assigned to you yet.</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <TeamMemberTaskModal
        show={showModal}
        onHide={() => setShowModal(false)}
        task={selectedTask}
        onSuccess={handleTaskUpdate}
      />
    </>
  )
}
