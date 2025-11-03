import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spinner, Alert, Table, Badge } from 'react-bootstrap'
import { useAuth } from '../../../contexts/AuthContext'
import taskService from '../../../services/task.service'

export default function TeamView() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  })

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (user?._id) {
          const data = await taskService.getAssignedTasks(user._id, token)
          const taskList = Array.isArray(data) ? data : data.data || []
          setTasks(taskList)

          const totalTasks = taskList.length
          const pendingTasks = taskList.filter(
            t => t.status?.toLowerCase() === 'pending'
          ).length
          const inProgressTasks = taskList.filter(
            t => t.status?.toLowerCase() === 'in progress'
          ).length
          const completedTasks = taskList.filter(
            t => t.status?.toLowerCase() === 'completed'
          ).length

          setStats({
            total: totalTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
          })
        }
      } catch (err) {
        console.error('Failed to fetch assigned tasks:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedTasks()
  }, [user])

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

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <>
      <h2 className="mb-4">Welcome, {user?.name}!</h2>

      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <Card.Title>Total Tasks</Card.Title>
              <h3>{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <Card.Title>Pending</Card.Title>
              <h3>{stats.pending}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <Card.Title>In Progress</Card.Title>
              <h3>{stats.inProgress}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <Card.Title>Completed</Card.Title>
              <h3>{stats.completed}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="fw-bold">Recent Assigned Tasks</Card.Header>
        <Card.Body>
          {tasks.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map((task) => (
                    <tr key={task._id}>
                      <td>
                        <strong>{task.title}</strong>
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
                      <td>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-muted text-center py-3">
              No tasks assigned to you yet.
            </p>
          )}
        </Card.Body>
      </Card>
    </>
  )
}
