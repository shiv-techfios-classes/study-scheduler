import React from "react";
import { Card, Col, Row } from "react-bootstrap";

const ScheduleCards = ({ schedule }) => {
  if (schedule.length === 0) {
    return <p>No schedules generated yet. Add topics and generate a schedule.</p>;
  }

  return (
    <Row xs={1} md={2} className="g-4">
      {schedule.map((entry, index) => (
        <Col key={index}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{entry.date}</Card.Title>
              <Card.Text>
                <strong>Topic:</strong> {entry.topic} <br />
                <strong>Hours:</strong> {entry.hours}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ScheduleCards;
