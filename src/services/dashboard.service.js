import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

const getOverview = async (token) => {
  const res = await axios.get(`${API_BASE}/dashboard/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export default {
  getOverview,
}
