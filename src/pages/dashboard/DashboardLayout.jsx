// src/pages/dashboard/DashboardLayout.jsx
import React, { useState } from 'react'
import { Container, Navbar, Tab, Tabs,Nav } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardContent from './DashboardContent' // ← IMPORTANT: make sure this exists
import ProjectsView from '../projects/ProjectsView'
import TasksView from '../tasks/TasksView'
import UsersView from './users/UsersView'

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4">
        <Container fluid>
          <Navbar.Brand href="#">Project Management System</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <div className="text-white me-3">
                <small className="d-block">Signed in as</small>
                <strong>{user?.name}</strong>
              </div>
              <div className="text-white me-3">
                <small>Role</small>
                <div>{user?.role}</div>
              </div>
              <Nav.Link onClick={handleLogout} className="text-danger">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Layout */}
      <Container fluid className="mt-4">
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="dashboard" title="Dashboard">
            <div className="p-4">
              <DashboardContent role={user?.role} />
            </div>
          </Tab>
          <Tab eventKey="projects" title="Projects">
            <div className="p-4">
              <ProjectsView />
            </div>
          </Tab>
          <Tab eventKey="tasks" title="Tasks">
            <div className="p-4">
              <TasksView />
            </div>
          </Tab>
          <Tab eventKey="users" title="Users">
            <div className="p-4">
              <UsersView />
            </div>
          </Tab>
          <Tab eventKey="profile" title="Profile">
            <div className="p-4">
              {/* Profile content will go here */}
              <div className="text-center my-5">
                <p>Profile management coming soon...</p>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Container>
    </>
  )
}
