import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spinner, Alert, Table, Badge } from 'react-bootstrap'
import { useAuth } from '../../../contexts/AuthContext'
import projectService from '../../../services/project.service'
import taskService from '../../../services/task.service'

export default function ManagerView() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')

        const [projectsRes, tasksRes] = await Promise.all([
          projectService.getAllProjects(token),
          taskService.getAllTasks(token),
        ])

        const projectList = Array.isArray(projectsRes) ? projectsRes : projectsRes.data || []
        const taskList = Array.isArray(tasksRes) ? tasksRes : tasksRes.data || []

        setProjects(projectList)
        setTasks(taskList)

        const totalProjects = projectList.length
        const activeProjects = projectList.filter(
          p => p.status?.toLowerCase() === 'active'
        ).length
        const completedProjects = projectList.filter(
          p => p.status?.toLowerCase() === 'completed'
        ).length
        const totalTasks = taskList.length
        const completedTasks = taskList.filter(
          t => t.status?.toLowerCase() === 'completed'
        ).length

        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          totalTasks,
          completedTasks,
        })
      } catch (err) {
        console.error('Failed to fetch manager dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success'
      case 'completed':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getTaskStatusBadgeVariant = (status) => {
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
              <Card.Title>Total Projects</Card.Title>
              <h3>{stats.totalProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <h3>{stats.activeProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <Card.Title>Total Tasks</Card.Title>
              <h3>{stats.totalTasks}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <Card.Title>Completed Tasks</Card.Title>
              <h3>{stats.completedTasks}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">My Projects</Card.Header>
            <Card.Body>
              {projects.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Team Members</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 5).map((project) => (
                        <tr key={project._id}>
                          <td>
                            <strong>{project.name}</strong>
                          </td>
                          <td>
                            <Badge bg={getStatusBadgeVariant(project.status)}>
                              {project.status}
                            </Badge>
                          </td>
                          <td>{project.teamMembers?.length || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted text-center py-3">
                  No projects yet. Create one to get started.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="fw-bold">Recent Tasks</Card.Header>
            <Card.Body>
              {tasks.length > 0 ? (
                <div className="table-responsive">
                  <Table striped bordered hover>
                    <thead className="table-dark">
                      <tr>
                        <th>Task Title</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.slice(0, 5).map((task) => (
                        <tr key={task._id}>
                          <td>
                            <strong>{task.title}</strong>
                          </td>
                          <td>
                            <Badge bg={getTaskStatusBadgeVariant(task.status)}>
                              {task.status}
                            </Badge>
                          </td>
                          <td>{task.assignedTo?.name || 'Unassigned'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted text-center py-3">
                  No tasks yet.
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
