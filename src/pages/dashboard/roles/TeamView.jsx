import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'

export default function TeamView() {
  return (
    <>
      <h2 className="mb-4">Team Member Dashboard</h2>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>My Tasks</Card.Title>
              <Card.Text>Check and update your assigned tasks.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Project Feed</Card.Title>
              <Card.Text>Stay updated with your project’s latest activities.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
