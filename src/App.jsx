import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ProtectedRoute from './components/common/ProtectedRoute'

// Dashboards
import AdminDashboard from './pages/dashboard/Admin/AdminDashboard'
import ManagerDashboard from './pages/dashboard/Manager/ManagerDashboard'
import TeamDashboard from './pages/dashboard/Team/TeamDashboard'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        <Route path="/dashboard/team" element={<TeamDashboard />} />
      </Route>

      {/* Redirect */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
