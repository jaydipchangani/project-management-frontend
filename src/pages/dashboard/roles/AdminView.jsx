import React from 'react'
import { Card, Row, Col, Button } from 'react-bootstrap'

export default function AdminView() {
  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* Quick Actions */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>View, add, or remove system users.</Card.Text>
              <Button variant="outline-primary">Manage Users</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Project Overview</Card.Title>
              <Card.Text>Monitor all ongoing projects.</Card.Text>
              <Button variant="outline-primary">View Reports</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <Card.Text>Generate detailed usage reports.</Card.Text>
              <Button variant="outline-primary">Generate Reports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
