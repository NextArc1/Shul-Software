import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Box,
  Container,
  Divider
} from '@mui/material';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // User fields
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Shul fields
    shul_name: '',
    country: 'United States',
    zip_code: '',
    address: '',
    email_contact: '',
    website: '',
    
    // Location data (will be filled when zip code is entered)
    latitude: 0,
    longitude: 0,
    timezone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate required fields
    if (!formData.email || !formData.password || !formData.shul_name) {
      setError('Please fill in all required fields (email, password, and synagogue name)');
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
      
      const registrationData = {
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        shul_name: formData.shul_name,
        country: formData.country,
        zip_code: formData.zip_code
      };

      const response = await fetch(`${apiBaseUrl}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('shulData', JSON.stringify(data.shul));
        
        setSuccess('Registration successful! Redirecting to admin portal...');
        
        // Redirect to admin portal after 2 seconds
        setTimeout(() => {
          navigate('/admin/shul-settings');
        }, 2000);
      } else {
        // Handle validation errors
        if (data.username) {
          setError(`Username: ${data.username.join(', ')}`);
        } else if (data.email) {
          setError(`Email: ${data.email.join(', ')}`);
        } else if (data.password) {
          setError(`Password: ${data.password.join(', ')}`);
        } else if (data.shul) {
          setError(`Synagogue: ${JSON.stringify(data.shul)}`);
        } else {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" className="py-8">
      <Card>
        <CardContent className="p-8">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Register Your Synagogue
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" className="mb-6">
            Create an account to set up your synagogue's digital display system
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="mb-4">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Admin User Information */}
            <Typography variant="h6" gutterBottom className="mt-4 mb-3">
              👤 Administrator Information
            </Typography>
            
            <TextField
              name="email"
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-4"
              helperText="This will be your login email"
            />

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                name="password"
                label="Password *"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                helperText="Minimum 8 characters"
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password *"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              className="mb-6"
              placeholder="(555) 123-4567"
            />

            <Divider className="my-6" />

            {/* Synagogue Information */}
            <Typography variant="h6" gutterBottom className="mb-3">
              🕍 Synagogue Information
            </Typography>

            <TextField
              name="shul_name"
              label="Synagogue Name *"
              value={formData.shul_name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-4"
              placeholder="e.g., Congregation Beth Shalom"
            />

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                name="zip_code"
                label="Zip Code"
                value={formData.zip_code}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="12345"
                helperText="Used to calculate prayer times"
              />
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="United States"
              />
            </Box>

            <TextField
              name="address"
              label="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
              variant="outlined"
              className="mb-6"
              placeholder="Street address, city, state"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Creating Account...' : 'Register Synagogue'}
            </Button>

            {/* Login Link */}
            <Typography align="center" className="mt-4">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in here
              </Link>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Register;