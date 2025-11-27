import React, { useState } from 'react';
import { Card, Button, Row, Col, Spinner, Badge } from 'react-bootstrap';
import { Patient } from '../types';
import { PatientForm } from './PatientForm';

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  onUpdate: (id: number, patient: Patient) => void;
  onDelete: (id: number) => void;
}

export const PatientList: React.FC<PatientListProps> = ({ 
  patients, 
  loading, 
  onUpdate, 
  onDelete 
}) => {
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <p className="mt-2">Loading patients...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <Card>
        <Card.Body>
          <Card.Text>No patients found. Add your first patient using the form.</Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="patient-list-container">
      {editingPatient ? (
        <div className="mb-4">
          <h4>Edit Patient</h4>
          <PatientForm
            initialData={editingPatient}
            onUpdatePatient={onUpdate}
            editing={true}
            onAddPatient={() => {}} // Dummy function for type compatibility
          />
          <Button 
            variant="secondary" 
            className="mt-2"
            onClick={() => setEditingPatient(null)}
          >
            Cancel Edit
          </Button>
        </div>
      ) : null}
      
      <Row>
        {patients.map(patient => (
          <Col key={patient.id} md={12} className="mb-3">
            <Card className="patient-card">
              <Card.Body>
                <Row>
                  <Col md={8}>
                    <Card.Title>
                      {patient.first_name} {patient.last_name} 
                      <Badge bg="secondary" className="ms-2">
                        {patient.gender}
                      </Badge>
                    </Card.Title>
                    <Card.Text>
                      <strong>Date of Birth:</strong> {patient.date_of_birth}<br />
                      <strong>Email:</strong> {patient.email}<br />
                      <strong>Phone:</strong> {patient.phone}<br />
                      <strong>Address:</strong> {patient.address}
                    </Card.Text>
                    {patient.medical_history && (
                      <Card.Text>
                        <strong>Medical History:</strong> {patient.medical_history}
                      </Card.Text>
                    )}
                  </Col>
                  <Col md={4} className="d-flex flex-column">
                    <div className="ms-auto">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => setEditingPatient(patient)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => onDelete(patient.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <small className="text-muted mt-2">
                      Added: {new Date(patient.created_at).toLocaleDateString()}
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};