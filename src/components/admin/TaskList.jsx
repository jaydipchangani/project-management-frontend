import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import taskService from '../../services/task.service'

export default function TaskList({ onEditTask, onCreateTask, refreshTrigger }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token')
        const data = await taskService.getAllTasks(token)
        setTasks(data.data)
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
        setError('Failed to load tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [refreshTrigger])

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

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'Pending':
        return 'secondary'
      case 'In Progress':
        return 'primary'
      case 'Completed':
        return 'success'
      case 'Cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getPriorityBadgeVariant = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'Low':
        return 'success'
      case 'Medium':
        return 'warning'
      case 'High':
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
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Tasks</h5>
        <Button variant="primary" onClick={onCreateTask}>
          Create Task
        </Button>
      </Card.Header>
      <Card.Body>
        {tasks.length > 0 ? (
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
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
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
                      className="me-2"
                      onClick={() => onEditTask(task)}
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
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No tasks found.</p>
            <Button variant="primary" onClick={onCreateTask}>
              Create Your First Task
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}