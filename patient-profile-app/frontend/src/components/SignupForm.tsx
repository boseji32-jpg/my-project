import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { SignupFormValues } from '../types';

interface SignupFormProps {}

export const SignupForm: React.FC<SignupFormProps> = () => {
  const [formData, setFormData] = useState<SignupFormValues>({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signup(formData.username, formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="auth-form">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};