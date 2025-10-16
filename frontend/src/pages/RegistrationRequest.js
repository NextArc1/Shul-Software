import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Container,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';

function RegistrationRequest() {
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_name: '',
    rabbi: '',
    email: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'United States',
    purpose: ''
  });

  const [purposeType, setPurposeType] = useState('');
  const [otherPurpose, setOtherPurpose] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePurposeTypeChange = (e) => {
    const value = e.target.value;
    setPurposeType(value);

    // If not "Other", set purpose directly
    if (value !== 'other') {
      setFormData({
        ...formData,
        purpose: value
      });
      setOtherPurpose('');
    } else {
      // Clear purpose when "Other" is selected
      setFormData({
        ...formData,
        purpose: ''
      });
    }
  };

  const handleOtherPurposeChange = (e) => {
    const value = e.target.value;
    setOtherPurpose(value);
    setFormData({
      ...formData,
      purpose: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validate required fields
    if (!formData.organization_name || !formData.contact_name || !formData.email ||
        !formData.phone || !formData.street_address || !formData.city ||
        !formData.state || !formData.zip_code || !formData.country ||
        !purposeType || !formData.purpose) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

      const response = await fetch(`${apiBaseUrl}/registration/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Clear form
        setFormData({
          organization_name: '',
          contact_name: '',
          rabbi: '',
          email: '',
          phone: '',
          street_address: '',
          city: '',
          state: '',
          zip_code: '',
          country: 'United States',
          purpose: ''
        });
        setPurposeType('');
        setOtherPurpose('');
      } else {
        // Handle validation errors
        if (data.email) {
          setError(`Email: ${data.email.join(', ')}`);
        } else if (data.organization_name) {
          setError(`Organization name: ${data.organization_name.join(', ')}`);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(', '));
        } else {
          setError('Registration request failed. Please try again.');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Registration request error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="md" className="py-8">
        <Card>
          <CardContent className="p-8">
            <Typography variant="h4" component="h1" gutterBottom align="center" color="success.main">
              Request Submitted Successfully!
            </Typography>
            <Alert severity="success" className="my-4">
              Thank you for your interest in Shul Display! We've received your registration request and will review it shortly.
              You'll receive an email at the address you provided once your request has been approved.
            </Alert>
            <Box className="mt-6" textAlign="center">
              <Typography variant="body1" className="mb-4">
                Already have an account?
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
                size="large"
              >
                Sign In
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-8">
      <Card>
        <CardContent className="p-8">
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Request Access to Shul Display
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" className="mb-6">
            Fill out this form to request access. We'll review your application and send you an email with further instructions.
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" className="mb-4">
            * Required fields
          </Typography>

          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Organization Information */}
            <Typography variant="h6" gutterBottom className="mt-4 mb-3">
              Organization Information
            </Typography>

            <TextField
              name="organization_name"
              label="Shul Name"
              value={formData.organization_name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-4"
              placeholder="e.g., Congregation Beth Shalom"
            />

            <TextField
              name="rabbi"
              label="Rabbi Name"
              value={formData.rabbi}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              className="mb-4"
              placeholder="Rabbi's full name"
            />

            <TextField
              name="street_address"
              label="Street Address"
              value={formData.street_address}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-4"
              placeholder="123 Main Street, Apt 4B"
            />

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                name="city"
                label="City"
                value={formData.city}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="Brooklyn"
              />
              <TextField
                name="state"
                label="State/Province/Region"
                value={formData.state}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="NY"
              />
            </Box>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                name="zip_code"
                label="Zip/Postal Code"
                value={formData.zip_code}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                placeholder="11211"
              />
              <FormControl fullWidth variant="outlined" required>
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  label="Country"
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
                </Select>
              </FormControl>
            </Box>

            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-6"
              placeholder="(555) 123-4567"
            />

            <Divider className="my-6" />

            {/* Contact Person Information */}
            <Typography variant="h6" gutterBottom className="mb-3">
              Contact Person
            </Typography>

            <TextField
              name="contact_name"
              label="Your Full Name"
              value={formData.contact_name}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-4"
              placeholder="John Doe"
            />

            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              className="mb-6"
              helperText="This will be used for your account login"
              placeholder="your.email@example.com"
            />

            <Divider className="my-6" />

            {/* Purpose */}
            <Typography variant="h6" gutterBottom className="mb-3">
              Additional Information
            </Typography>

            <FormControl fullWidth variant="outlined" required className="mb-4">
              <InputLabel>How will you use Shul Display?</InputLabel>
              <Select
                value={purposeType}
                onChange={handlePurposeTypeChange}
                label="How will you use Shul Display?"
              >
                <MenuItem value="Display zmanim in our shul/synagogue">Display zmanim in our shul/synagogue</MenuItem>
                <MenuItem value="Display zmanim in our yeshiva/school">Display zmanim in our yeshiva/school</MenuItem>
                <MenuItem value="Display zmanim in our community center">Display zmanim in our community center</MenuItem>
                <MenuItem value="other">Other (please specify)</MenuItem>
              </Select>
              <FormHelperText>This helps us understand your needs and approve your request faster</FormHelperText>
            </FormControl>

            {purposeType === 'other' && (
              <TextField
                label="Please specify"
                value={otherPurpose}
                onChange={handleOtherPurposeChange}
                required
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                className="mb-6"
                placeholder="Please describe how you plan to use this service..."
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Submitting Request...' : 'Submit Registration Request'}
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

export default RegistrationRequest;
