import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const Land = () => {
  const [lands, setLands] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/securityoffices/");
        setLands(response.data); // Set the data from the API
        setLoading(false); // Mark loading as complete
      } catch (err) {
        setError(err.response ? err.response.data.error : "Failed to fetch land data");
        setLoading(false); // Mark loading as complete
      }
    };

    fetchLands(); // Call the async function
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Available Lands</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {lands.map((land) => (
          <Col key={land.id}>
            <Card>
              <Card.Img
                variant="top"
                src={land.image || "https://via.placeholder.com/150"}
                alt={land.title}
              />
              <Card.Body>
                <Card.Title>{land.title}</Card.Title>
                <Card.Text>
                  <strong>Location:</strong> {land.location}
                  <br />
                  <strong>Type:</strong> {land.land_type}
                  <br />
                  <strong>Price:</strong> ${land.price}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default securityoffices;
