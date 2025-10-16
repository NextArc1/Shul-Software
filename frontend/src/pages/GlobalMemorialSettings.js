import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Container,
  Box,
  IconButton,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { api } from '../utils/api';

function GlobalMemorialSettings() {
  const navigate = useNavigate();

  const [iluiNishmat, setIluiNishmat] = useState([]);
  const [refuahShleima, setRefuahShleima] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMemorialBoxes();
  }, []);

  const fetchMemorialBoxes = async () => {
    try {
      const data = await api.get('/master-admin/memorial-boxes/');

      // Initialize arrays with existing data or empty arrays
      setIluiNishmat(Array.isArray(data.ilui_nishmat) ? data.ilui_nishmat : []);
      setRefuahShleima(Array.isArray(data.refuah_shleima) ? data.refuah_shleima : []);

      setError('');
    } catch (err) {
      if (err.message.includes('403')) {
        setError('Access Denied: You must be a master admin to view this page.');
      } else {
        setError(`Failed to load memorial boxes: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.patch('/master-admin/memorial-boxes/', {
        ilui_nishmat: iluiNishmat.filter(name => name.trim() !== ''),
        refuah_shleima: refuahShleima.filter(name => name.trim() !== '')
      });

      setSuccess('Global memorial boxes updated successfully! Changes will apply to all shul displays.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const addIluiName = () => {
    setIluiNishmat([...iluiNishmat, '']);
  };

  const updateIluiName = (index, value) => {
    const updated = [...iluiNishmat];
    updated[index] = value;
    setIluiNishmat(updated);
  };

  const removeIluiName = (index) => {
    setIluiNishmat(iluiNishmat.filter((_, i) => i !== index));
  };

  const addRefuahName = () => {
    setRefuahShleima([...refuahShleima, '']);
  };

  const updateRefuahName = (index, value) => {
    const updated = [...refuahShleima];
    updated[index] = value;
    setRefuahShleima(updated);
  };

  const removeRefuahName = (index) => {
    setRefuahShleima(refuahShleima.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/master-admin')}
          className="mb-4"
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Global Memorial Boxes Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          These memorial boxes will be displayed on all Shul displays
        </Typography>
      </Box>

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

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ilui Nishmat Box */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom dir="rtl">
              לעילוי נשמת 
            </Typography>
            <Divider className="mb-4" />

            <Box className="space-y-3">
              {iluiNishmat.map((name, index) => (
                <Box key={index} className="flex items-center gap-2">
                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => updateIluiName(index, e.target.value)}
                    placeholder="Enter name in Hebrew"
                    variant="outlined"
                    size="small"
                    inputProps={{ dir: 'rtl' }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeIluiName(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addIluiName}
                variant="outlined"
                fullWidth
              >
                Add Name
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Refuah Shleima Box */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom dir="rtl">
              רפואה שלמה 
            </Typography>
            <Divider className="mb-4" />

            <Box className="space-y-3">
              {refuahShleima.map((name, index) => (
                <Box key={index} className="flex items-center gap-2">
                  <TextField
                    fullWidth
                    value={name}
                    onChange={(e) => updateRefuahName(index, e.target.value)}
                    placeholder="Enter name in Hebrew"
                    variant="outlined"
                    size="small"
                    inputProps={{ dir: 'rtl' }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeRefuahName(index)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={addRefuahName}
                variant="outlined"
                fullWidth
              >
                Add Name
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box className="mt-6 flex justify-end gap-4">
        <Button
          variant="outlined"
          onClick={() => navigate('/master-admin')}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>

      <Box className="mt-6">
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Note:</strong> These memorial boxes will be displayed on ALL shul displays.
            Empty names will be automatically removed when saving. Changes take effect immediately.
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
}

export default GlobalMemorialSettings;
