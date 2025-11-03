// src/services/auth.service.js
import axiosInstance from '../api/axiosInstance'

const authService = {
  login: async (email, password) => {
    const res = await axiosInstance.post('/auth/login', { email, password })
    return res.data
  },

  register: async (name, email, password) => {
    const res = await axiosInstance.post('/auth/register', { name, email, password })
    return res.data
  },
}

export default authService
