import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const getAllProjects = async (token) => {
  const res = await axios.get(`${API_BASE}/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const getProjectById = async (id, token) => {
  const res = await axios.get(`${API_BASE}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const createProject = async (projectData, token) => {
  const res = await axios.post(`${API_BASE}/projects`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const updateProject = async (id, projectData, token) => {
  const res = await axios.put(`${API_BASE}/projects/${id}`, projectData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const deleteProject = async (id, token) => {
  const res = await axios.delete(`${API_BASE}/projects/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
}