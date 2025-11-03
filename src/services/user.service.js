import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL;


const getUsersByRole = async (role, token) => {
  const res = await axios.get(`${API_URL}/users?role=${role}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.data
}

const getAllUsers = async (token) => {
  const res = await axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  //console.log(res.data);
  return res.data;
};

const createUser = async (data, token) => {
  const res = await axios.post(`${API_URL}/auth/register`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

const updateUser = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/users/${id}/role`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

const deleteUser = async (id, token) => {
  const res = await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export default {
  getAllUsers,
  getUsersByRole,
  createUser,
  updateUser,
  deleteUser
};
