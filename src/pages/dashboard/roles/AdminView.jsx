import React from 'react'
import { Card, Row, Col } from 'react-bootstrap'

export default function AdminView() {
  return (
    <>
      <h2 className="mb-4">Admin Dashboard</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Users</Card.Title>
              <Card.Text>View, add, or remove system users.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Project Overview</Card.Title>
              <Card.Text>Monitor all ongoing projects.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <Card.Text>Generate detailed usage reports.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
