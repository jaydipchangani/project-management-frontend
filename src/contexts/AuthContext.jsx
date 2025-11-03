import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/auth.service'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    }
  } catch (err) {
    console.error('Failed to parse user from localStorage:', err)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  } finally {
    setLoading(false)
  }
}, [])


  const login = async (email, password) => {
    const data = await authService.login(email, password)
    const { token, ...userData } = data

    setUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    return userData // so Login page can check role
  }

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password)
    const { token, ...userData } = data

    setUser(userData)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))

    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
