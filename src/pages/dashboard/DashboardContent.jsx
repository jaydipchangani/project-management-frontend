import React, { useEffect, useState } from 'react'
import dashboardService from '../../services/dashboard.service'
import { Spinner, Card, Row, Col, Table } from 'react-bootstrap'

export default function DashboardContent() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await dashboardService.getOverview(token)
        setOverview(data)
      } catch (err) {
        console.error(err)
        setError('Failed to fetch dashboard overview')
      } finally {
        setLoading(false)
      }
    }

    fetchOverview()
  }, [])

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading Dashboard...</p>
      </div>
    )
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  if (!overview) {
    return <div className="alert alert-warning">No data available</div>
  }

  return (
    <div>
      <h2 className="mb-4">{overview.role} Dashboard</h2>

      {/* Top Stats */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <Card.Title>Total Projects</Card.Title>
              <h3>{overview.totalProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <h3>{overview.activeProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <Card.Title>Total Tasks</Card.Title>
              <h3>{overview.totalTasks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <Card.Title>Completed Tasks</Card.Title>
              <h3>{overview.completedTasks}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Projects */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="fw-bold">Recent Projects</Card.Header>
        <Card.Body>
          {overview.recentProjects.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Project Name</th>
                  <th>Status</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentProjects.map((proj) => (
                  <tr key={proj._id}>
                    <td>{proj.name}</td>
                    <td>{proj.status}</td>
                    <td>{new Date(proj.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No recent projects found.</p>
          )}
        </Card.Body>
      </Card>

      {/* Recent Tasks */}
      <Card className="shadow-sm">
        <Card.Header className="fw-bold">Recent Tasks</Card.Header>
        <Card.Body>
          {overview.recentTasks.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Task Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No recent tasks found.</p>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}
