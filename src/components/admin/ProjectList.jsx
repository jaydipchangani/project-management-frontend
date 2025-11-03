import React, { useEffect, useState, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Spinner,
  Alert,
  Badge,
  Form,
  Row,
  Col,
  Pagination,
} from 'react-bootstrap';
import projectService from '../../services/project.service';

export default function ProjectList({ onEditProject, onCreateProject, refreshTrigger }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const data = await projectService.getAllProjects(token);
        const projectList = Array.isArray(data.data) ? data.data : [];
        setProjects(projectList);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refreshTrigger]);

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('token');
      await projectService.deleteProject(projectId, token);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error('Failed to delete project:', err);
      setError('Failed to delete project');
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'primary';
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    if (statusFilter) {
      filtered = filtered.filter(
        (p) => p.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (search.trim() !== '') {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    filtered.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'createdAt') {
        valA = new Date(a.createdAt);
        valB = new Date(b.createdAt);
      }

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, search, sortField, sortOrder, statusFilter]);

  const totalPages = Math.ceil(filteredProjects.length / pageSize);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <Row className="align-items-center g-3">
          <Col md={3}>
            <h5 className="mb-0">Projects</h5>
          </Col>
          <Col md={3}>
            <Form.Control
              placeholder="Search by name or description"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </Col>
          <Col md={2}>
            <Form.Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="createdAt">Sort by Created</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
            </Form.Select>
          </Col>
          <Col md={1}>
            <Button
              variant="outline-secondary"
              onClick={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </Col>
          <Col md={1} className="text-end">
            <Button variant="primary" onClick={onCreateProject}>
              + Add
            </Button>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body>
        {filteredProjects.length > 0 ? (
          <>
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Team Members</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project) => (
                  <tr key={project._id}>
                    <td>{project.name}</td>
                    <td
                      style={{
                        maxWidth: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={project.description}
                    >
                      {project.description}
                    </td>
                    <td>
                      <Badge bg={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </td>
                    <td>{project.createdBy?.name || 'N/A'}</td>
                    <td>{project.teamMembers?.length || 0}</td>
                    <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => onEditProject(project)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteProject(project._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center">
              <small>
                Showing {paginatedProjects.length} of {filteredProjects.length} projects
              </small>
              <Pagination className="mb-0">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted">No projects found.</p>
            <Button variant="primary" onClick={onCreateProject}>
              Create Your First Project
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
