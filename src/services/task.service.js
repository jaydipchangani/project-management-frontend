import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const getAllTasks = async (token) => {
  const res = await axios.get(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const getTaskById = async (id, token) => {
  const res = await axios.get(`${API_BASE}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// Get tasks assigned to the current user
const getAssignedTasks = async (userId, token) => {
  const res = await axios.get(`${API_BASE}/tasks/assigned/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const createTask = async (taskData, token) => {
  const res = await axios.post(`${API_BASE}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const updateTask = async (id, taskData, token) => {
  const res = await axios.put(`${API_BASE}/tasks/${id}`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const deleteTask = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const getTasksByProject = async (projectId, token) => {
  const res = await axios.get(`${API_BASE}/projects/${projectId}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export default {
  getAllTasks,
  getTaskById,
  getAssignedTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
}
