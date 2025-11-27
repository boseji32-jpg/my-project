import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { PatientFormValues, Patient } from '../types';

interface PatientFormProps {
  onAddPatient: (patient: Patient) => void;
  initialData?: Patient;
  onUpdatePatient?: (id: number, patient: Patient) => void;
  editing?: boolean;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
  onAddPatient, 
  initialData, 
  onUpdatePatient,
  editing = false
}) => {
  const [formData, setFormData] = useState<PatientFormValues>({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    date_of_birth: initialData?.date_of_birth || '',
    gender: initialData?.gender || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    medical_history: initialData?.medical_history || '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.first_name || !formData.last_name || !formData.date_of_birth || 
        !formData.gender || !formData.email || !formData.phone || !formData.address) {
      setError('Please fill in all required fields');
      return;
    }

    if (!editing && onAddPatient) {
      // Add new patient
      const newPatient: Patient = {
        id: 0, // Will be assigned by backend
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner_id: 1, // Will be assigned by backend
      };
      onAddPatient(newPatient);
      
      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        medical_history: '',
      });
    } else if (editing && onUpdatePatient && initialData) {
      // Update existing patient
      const updatedPatient: Patient = {
        ...initialData,
        ...formData,
        updated_at: new Date().toISOString(),
      };
      onUpdatePatient(initialData.id, updatedPatient);
    }
  };

  return (
    <Card className="form-container">
      <Card.Body>
        <Card.Title>{editing ? 'Edit Patient' : 'Add New Patient'}</Card.Title>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name *</Form.Label>
            <Form.Control
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name *</Form.Label>
            <Form.Control
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDateOfBirth">
            <Form.Label>Date of Birth *</Form.Label>
            <Form.Control
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formGender">
            <Form.Label>Gender *</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPhone">
            <Form.Label>Phone *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Address *</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMedicalHistory">
            <Form.Label>Medical History</Form.Label>
            <Form.Control
              as="textarea"
              name="medical_history"
              value={formData.medical_history || ''}
              onChange={handleChange}
              placeholder="Enter medical history"
              rows={3}
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit"
            className="w-100"
          >
            {editing ? 'Update Patient' : 'Add Patient'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};