// src/pages/dashboard/DashboardLayout.jsx
import React from 'react'
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardContent from './DashboardContent' // ← IMPORTANT: make sure this exists

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

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
        <Row>
          {/* Sidebar */}
          <Col md={2} className="bg-light border-end min-vh-100 p-3">
            <h5 className="mb-3">{user?.name}</h5>
            <Nav className="flex-column">
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              <Nav.Link href="#projects">Projects</Nav.Link>
              <Nav.Link href="#tasks">Tasks</Nav.Link>
              <Nav.Link href="#profile">Profile</Nav.Link>
            </Nav>
          </Col>

          {/* Main Content */}
          <Col md={10} className="p-4">
            <DashboardContent role={user?.role} />
          </Col>
        </Row>
      </Container>
    </>
  )
}
