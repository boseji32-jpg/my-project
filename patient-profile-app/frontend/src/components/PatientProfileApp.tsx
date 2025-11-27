import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Patient } from '../types';
import { PatientForm } from './PatientForm';
import { PatientList } from './PatientList';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { Header } from './Header';

export const PatientProfileApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
      <Header />
      <Container className="py-4">
        {isAuthenticated ? (
          <AuthenticatedApp />
        ) : (
          <UnauthenticatedApp />
        )}
      </Container>
    </div>
  );
};

const AuthenticatedApp: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, [token]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/patients/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }
      
      const data: Patient[] = await response.json();
      setPatients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching patients');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData: Patient) => {
    try {
      const response = await fetch('/patients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add patient');
      }
      
      const newPatient: Patient = await response.json();
      setPatients([...patients, newPatient]);
      setSuccess('Patient added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while adding patient');
    }
  };

  const handleUpdatePatient = async (id: number, patientData: Patient) => {
    try {
      const response = await fetch(`/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(patientData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update patient');
      }
      
      const updatedPatient: Patient = await response.json();
      setPatients(patients.map(p => p.id === id ? updatedPatient : p));
      setSuccess('Patient updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating patient');
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }
    
    try {
      const response = await fetch(`/patients/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete patient');
      }
      
      setPatients(patients.filter(patient => patient.id !== id));
      setSuccess('Patient deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting patient');
    }
  };

  return (
    <Row>
      <Col md={8}>
        <h2>Patient Profiles</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <PatientList 
          patients={patients} 
          loading={loading} 
          onUpdate={handleUpdatePatient}
          onDelete={handleDeletePatient} 
        />
      </Col>
      <Col md={4}>
        <PatientForm onAddPatient={handleAddPatient} />
      </Col>
    </Row>
  );
};

const UnauthenticatedApp: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  
  return (
    <Row className="justify-content-center">
      <Col md={6}>
        {showLogin ? (
          <div>
            <h2 className="text-center mb-4">Login</h2>
            <LoginForm />
            <div className="text-center mt-3">
              <p>Don't have an account?{' '}
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(false);
                }}>Sign up</a>
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-center mb-4">Sign Up</h2>
            <SignupForm />
            <div className="text-center mt-3">
              <p>Already have an account?{' '}
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  setShowLogin(true);
                }}>Log in</a>
              </p>
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};