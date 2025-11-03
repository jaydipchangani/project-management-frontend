import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProtectedRoute from './components/common/ProtectedRoute'
import DashboardLayout from './pages/dashboard/DashboardLayout'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
