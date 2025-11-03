import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'

export default function ManagerView() {
  return (
    <>
      <h2 className="mb-4">Project Manager Dashboard</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Team Overview</Card.Title>
              <Card.Text>Assign and track tasks for your team.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Active Projects</Card.Title>
              <Card.Text>View and update ongoing project progress.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
