import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge, Form, Row, Col } from 'react-bootstrap'
import taskService from '../../services/task.service'
import projectService from '../../services/project.service'
import ProjectManagerTaskModal from './ProjectManagerTaskModal'

export default function ProjectManagerTaskList({ onCreateTask, refreshTrigger }) {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [refreshTaskTrigger, setRefreshTaskTrigger] = useState(0)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await projectService.getAllProjects(token)
        const projectList = Array.isArray(data) ? data : data.data || []
        setProjects(projectList)
        if (projectList.length > 0 && !selectedProject) {
          setSelectedProject(projectList[0]._id)
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err)
      }
    }

    fetchProjects()
  }, [refreshTrigger])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const data = await taskService.getAllTasks(token)
        const allTasks = Array.isArray(data) ? data : data.data || []

        if (selectedProject) {
          const filteredTasks = allTasks.filter(task => task.project?._id === selectedProject)
          setTasks(filteredTasks)
        } else {
          setTasks(allTasks)
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [selectedProject, refreshTaskTrigger])

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await taskService.deleteTask(taskId, token)
      setTasks(tasks.filter(task => task._id !== taskId))
    } catch (err) {
      console.error('Failed to delete task:', err)
      setError('Failed to delete task')
    }
  }

  const handleEditTask = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  const handleTaskUpdate = () => {
    setRefreshTaskTrigger(prev => prev + 1)
    setShowTaskModal(false)
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

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading tasks...</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <>
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <Row className="align-items-center g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label className="mb-0">
                  <strong>Filter by Project</strong>
                </Form.Label>
                <Form.Select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
              <Button variant="primary" onClick={onCreateTask}>
                Create Task
              </Button>
            </Col>
          </Row>
        </Card.Header>
      </Card>

      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">
            Tasks {selectedProject && `- ${projects.find(p => p._id === selectedProject)?.name}`}
          </h5>
        </Card.Header>
        <Card.Body>
          {tasks.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
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
                      <td>{task.assignedTo?.name || 'Unassigned'}</td>
                      <td>
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditTask(task)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTask(task._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">
                {selectedProject ? 'No tasks for this project.' : 'No tasks found.'}
              </p>
              <Button variant="primary" onClick={onCreateTask}>
                Create Your First Task
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>

      <ProjectManagerTaskModal
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        task={selectedTask}
        projects={projects}
        onSuccess={handleTaskUpdate}
      />
    </>
  )
}
