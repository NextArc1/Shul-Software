import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Container,
  Box
} from '@mui/material';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${apiBaseUrl}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token and user data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        if (data.shul) {
          localStorage.setItem('shulData', JSON.stringify(data.shul));
        }
        
        // Redirect to admin portal
        navigate('/manage/shul-settings');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
            Sign In
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: { xs: 3, md: 4 } }}>
            Access your synagogue's admin portal
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: { xs: 2, md: 3 } }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: { xs: 2, md: 3 } }}
              autoComplete="email"
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: { xs: 3, md: 4 } }}
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ mb: { xs: 2, md: 3 } }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* Registration Link */}
            <Typography align="center" sx={{ mt: { xs: 2, md: 3 } }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
              >
                Request access
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;