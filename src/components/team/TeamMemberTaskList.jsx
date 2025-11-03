import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import taskService from '../../services/task.service'
import TeamMemberTaskModal from './TeamMemberTaskModal'

export default function TeamMemberTaskList() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    const fetchAssignedTasks = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        if (user?._id) {
          const data = await taskService.getAssignedTasks(user._id, token)
          setTasks(Array.isArray(data) ? data : data.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch assigned tasks:', err)
        setError('Failed to load your assigned tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedTasks()
  }, [user, refreshTrigger])

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

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your tasks...</p>
      </div>
    )
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>
  }

  return (
    <>
      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">My Assigned Tasks</h5>
        </Card.Header>
        <Card.Body>
          {tasks.length > 0 ? (
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
                  {tasks.map((task) => (
                    <tr key={task._id}>
                      <td>
                        <strong>{task.title}</strong>
                      </td>
                      <td>{task.description || 'N/A'}</td>
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
