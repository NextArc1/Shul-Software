import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Container,
  CircularProgress,
  MenuItem
} from '@mui/material';

function CompleteRegistration() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    shul_name: '',
    zip_code: '',
    country: 'United States'
  });

  const [registrationInfo, setRegistrationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
      const response = await fetch(`${apiBaseUrl}/registration/validate/${token}/`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setRegistrationInfo(data);
        setFormData(prev => ({
          ...prev,
          shul_name: data.organization_name
        }));
      } else {
        setValidationError(data.error || 'Invalid or expired registration link');
      }
    } catch (err) {
      setValidationError('Failed to validate registration link');
      console.error('Token validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSubmitting(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setSubmitting(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

      const requestData = {
        token: token,
        password: formData.password,
        shul_name: formData.shul_name,
        zip_code: formData.zip_code,
        country: formData.country
      };

      // Note: This request may take 1-2 minutes while calculating 6 months of zmanim
      const response = await fetch(`${apiBaseUrl}/registration/complete/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store auth token
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('shulData', JSON.stringify(data.shul));

        // Redirect to admin portal
        navigate('/manage/shul-settings');
      } else {
        // Handle validation errors
        if (data.zip_code) {
          setError(Array.isArray(data.zip_code) ? data.zip_code.join(', ') : data.zip_code);
        } else if (data.password) {
          setError(`Password: ${data.password.join(', ')}`);
        } else if (data.token) {
          setError(`Registration link: ${data.token.join(', ')}`);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(', '));
        } else {
          setError('Account creation failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Complete registration error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (validationError) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Card>
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" color="error">
              Invalid Registration Link
            </Typography>
            <Alert severity="error" className="my-4">
              {validationError}
            </Alert>
            <Typography variant="body1" align="center" className="mt-4">
              This link may have expired or already been used. Please contact support if you believe this is an error.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 4, md: 6 } }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
            Complete Your Registration
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: { xs: 3, md: 4 }, px: { xs: 1, sm: 0 } }}>
            Welcome, {registrationInfo?.contact_name}! Create your account to get started.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: { xs: 2, md: 3 } }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Account Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Account Information
            </Typography>

            <TextField
              label="Email Address"
              value={registrationInfo?.email || ''}
              disabled
              fullWidth
              variant="outlined"
              sx={{ mb: { xs: 2, md: 3 } }}
              helperText="This will be your login email"
            />

            <TextField
              name="password"
              label="Create Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: { xs: 2, md: 3 } }}
              helperText="Minimum 8 characters"
            />

            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: { xs: 3, md: 4 } }}
            />

            {/* Shul Information */}
            <Typography variant="h6" gutterBottom sx={{ mt: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
              Shul Information
            </Typography>

            <TextField
              name="shul_name"
              label="Shul Name"
              value={formData.shul_name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: { xs: 2, md: 3 } }}
              helperText="You can change this later in settings"
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 } }}>
              <TextField
                name="zip_code"
                label="Zip Code"
                value={formData.zip_code}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="12345"
                helperText="Required for accurate time calculations"
              />
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                select
                fullWidth
                variant="outlined"
              >
                <MenuItem value="United States">United States</MenuItem>
                <MenuItem value="Israel">Israel</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                <MenuItem value="Australia">Australia</MenuItem>
                <MenuItem value="South Africa">South Africa</MenuItem>
                <MenuItem value="France">France</MenuItem>
                <MenuItem value="Brazil">Brazil</MenuItem>
                <MenuItem value="Argentina">Argentina</MenuItem>
                <MenuItem value="Russia">Russia</MenuItem>
                <MenuItem value="Mexico">Mexico</MenuItem>
                <MenuItem value="Germany">Germany</MenuItem>
                <MenuItem value="Netherlands">Netherlands</MenuItem>
                <MenuItem value="Belgium">Belgium</MenuItem>
                <MenuItem value="Spain">Spain</MenuItem>
                <MenuItem value="Italy">Italy</MenuItem>
                <MenuItem value="Chile">Chile</MenuItem>
                <MenuItem value="Ukraine">Ukraine</MenuItem>
                <MenuItem value="Hungary">Hungary</MenuItem>
                <MenuItem value="Austria">Austria</MenuItem>
              </TextField>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              sx={{ mt: { xs: 3, md: 4 } }}
            >
              {submitting ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Creating Account...</span>
                </Box>
              ) : (
                'Create Account & Continue'
              )}
            </Button>

            {submitting && (
              <Box sx={{ mt: { xs: 2, md: 3 } }} textAlign="center">
                <Typography variant="body2" color="text.secondary" sx={{ px: { xs: 1, sm: 0 } }}>
                  Please wait while we create your account and calculate the zmanim for your location.
                  <br />
                  This process may take up to 2 minutes...
                </Typography>
              </Box>
            )}
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default CompleteRegistration;
