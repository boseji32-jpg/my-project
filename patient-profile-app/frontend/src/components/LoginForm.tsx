import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { LoginFormValues } from '../types';

interface LoginFormProps {}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const [formData, setFormData] = useState<LoginFormValues>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

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
      await login(formData.username, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};