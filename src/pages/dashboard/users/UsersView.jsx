import React, { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import UsersList from '../../../components/admin/UsersList'
import UserForm from '../../../components/admin/UserForm'
export default function UsersView() {
  const { user } = useAuth()
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleCreateUser = () => {
    setEditingUser(null)
    setShowUserForm(true)
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setShowUserForm(true)
  }

  const handleUserFormSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div>
      <h2 className="mb-4">Users</h2>

      {user?.role === 'Admin' ? (
        <UsersList
          onEditUser={handleEditUser}
          onCreateUser={handleCreateUser}
          refreshTrigger={refreshTrigger}
        />
      ) : (
        <div className="text-center my-5">
          <p>User management is available only for Admins.</p>
        </div>
      )}

      {user?.role === 'Admin' && (
        <UserForm
          show={showUserForm}
          onHide={() => setShowUserForm(false)}
          user={editingUser}
          onSuccess={handleUserFormSuccess}
        />
      )}
    </div>
  )
}
