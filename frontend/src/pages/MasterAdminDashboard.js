import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Container,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { api } from '../utils/api';

function MasterAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Shuls state
  const [shuls, setShuls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shulToDelete, setShulToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Registrations state
  const [registrations, setRegistrations] = useState([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);
  const [registrationFilter, setRegistrationFilter] = useState('pending');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchShuls();
    fetchRegistrations();
  }, []);

  const fetchShuls = async () => {
    try {
      const data = await api.get('/master-admin/shuls/');
      setShuls(data);
      setError('');
    } catch (err) {
      if (err.message.includes('403')) {
        setError('Access Denied: You must be a master admin to view this page.');
      } else {
        setError(`Failed to load shuls: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditGlobalMemorial = () => {
    navigate('/master-admin/memorial-settings');
  };

  const handleViewDisplay = (slug) => {
    window.open(`/display/${slug}`, '_blank');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchShuls();
  };

  const handleDeleteClick = (shul) => {
    setShulToDelete(shul);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setShulToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!shulToDelete) return;

    try {
      await api.delete(`/master-admin/shuls/${shulToDelete.id}/delete/`);

      // Remove the deleted shul from the list
      setShuls(shuls.filter(s => s.id !== shulToDelete.id));

      setSuccessMessage(`Successfully deleted "${shulToDelete.name}" and associated user account.`);
      setError('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(`Failed to delete shul: ${err.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setShulToDelete(null);
    }
  };

  // Registration management functions
  const fetchRegistrations = async () => {
    try {
      setRegistrationsLoading(true);
      const data = await api.get(`/master-admin/registrations/?status=${registrationFilter}`);
      setRegistrations(data);
      setError('');
    } catch (err) {
      setError(`Failed to load registrations: ${err.message}`);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      fetchRegistrations();
    }
  }, [registrationFilter, activeTab]);

  const handleApproveClick = (registration) => {
    setSelectedRegistration(registration);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedRegistration) return;

    try {
      await api.post(`/master-admin/registrations/${selectedRegistration.id}/approve/`);

      // Refresh registrations list
      await fetchRegistrations();

      setSuccessMessage(`Successfully approved "${selectedRegistration.organization_name}" and sent invitation email.`);
      setError('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(`Failed to approve registration: ${err.message}`);
    } finally {
      setApproveDialogOpen(false);
      setSelectedRegistration(null);
    }
  };

  const handleRejectClick = (registration) => {
    setSelectedRegistration(registration);
    setRejectDialogOpen(true);
    setRejectionReason('');
  };

  const handleRejectConfirm = async () => {
    if (!selectedRegistration) return;

    try {
      await api.post(`/master-admin/registrations/${selectedRegistration.id}/reject/`, {
        rejection_reason: rejectionReason,
        send_email: true
      });

      // Refresh registrations list
      await fetchRegistrations();

      setSuccessMessage(`Successfully rejected "${selectedRegistration.organization_name}".`);
      setError('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(`Failed to reject registration: ${err.message}`);
    } finally {
      setRejectDialogOpen(false);
      setSelectedRegistration(null);
      setRejectionReason('');
    }
  };

  const handleDeleteRegistration = async (registration) => {
    if (!window.confirm(`Delete registration request from ${registration.organization_name}?`)) return;

    try {
      await api.delete(`/master-admin/registrations/${registration.id}/delete/`);

      // Remove from list
      setRegistrations(registrations.filter(r => r.id !== registration.id));

      setSuccessMessage('Registration request deleted successfully.');
      setError('');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(`Failed to delete registration: ${err.message}`);
    }
  };

  const getDisplayStatus = (lastDisplayAccess) => {
    if (!lastDisplayAccess) {
      return { label: 'Never Used', color: 'default', icon: '⚫' };
    }

    const now = new Date();
    const lastAccess = new Date(lastDisplayAccess);
    const minutesAgo = (now - lastAccess) / 1000 / 60;

    if (minutesAgo <= 5) {
      return { label: 'Online', color: 'success', icon: '🟢' };
    } else if (minutesAgo <= 1440) { // 24 hours
      return { label: 'Recent', color: 'warning', icon: '🟡' };
    } else {
      return { label: 'Inactive', color: 'error', icon: '🔴' };
    }
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return 'Never';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <Container maxWidth="xl" className="py-8" sx={{ backgroundColor: 'white', minHeight: '100vh', paddingTop: 4, paddingBottom: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" className="py-8" sx={{ backgroundColor: 'white', minHeight: '100vh', paddingTop: 4, paddingBottom: 4 }}>
      <Box className="mb-6">
        <Typography variant="h4" component="h1" gutterBottom>
          Master Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all Shuls, registration requests, and global memorial boxes
        </Typography>
        <Box className="mt-4" sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditGlobalMemorial}
            size="large"
          >
            Edit Global Memorial Boxes
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRefresh}
            size="large"
            startIcon={<RefreshIcon />}
          >
            Refresh Data
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      <Box className="mb-4">
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Active Shuls" />
          <Tab label="Pending Registrations" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Shul Name</TableCell>
                  <TableCell>Slug</TableCell>
                  <TableCell>Admin Email</TableCell>
                  <TableCell>Display Status</TableCell>
                  <TableCell>Last Display Access</TableCell>
                  <TableCell>Last Admin Login</TableCell>
                  <TableCell>Account Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shuls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} align="center">
                      No Shul found
                    </TableCell>
                  </TableRow>
                ) : (
                  shuls.map((shul) => {
                    const displayStatus = getDisplayStatus(shul.last_display_access);
                    return (
                      <TableRow key={shul.id}>
                        <TableCell>{shul.id}</TableCell>
                        <TableCell>
                          <strong>{shul.name}</strong>
                        </TableCell>
                        <TableCell>
                          <code>{shul.slug}</code>
                        </TableCell>
                        <TableCell>{shul.admin_email}</TableCell>
                        <TableCell>
                          <Chip
                            label={`${displayStatus.icon} ${displayStatus.label}`}
                            color={displayStatus.color}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(shul.last_display_access)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDateTime(shul.admin_last_login)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={shul.is_active ? 'Active' : 'Inactive'}
                            color={shul.is_active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(shul.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewDisplay(shul.slug)}
                            >
                              View Display
                            </Button>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(shul)}
                              title="Delete Shul and User Account"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Box className="mb-4" sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Registration Requests
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant={registrationFilter === 'pending' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setRegistrationFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={registrationFilter === 'approved' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setRegistrationFilter('approved')}
                >
                  Approved
                </Button>
                <Button
                  variant={registrationFilter === 'rejected' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setRegistrationFilter('rejected')}
                >
                  Rejected
                </Button>
                <Button
                  variant={registrationFilter === 'all' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setRegistrationFilter('all')}
                >
                  All
                </Button>
              </Box>
            </Box>

            {registrationsLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Submitted</TableCell>
                      <TableCell>Organization</TableCell>
                      <TableCell>Contact Name</TableCell>
                      <TableCell>Rabbi</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Purpose</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {registrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} align="center">
                          No registration requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      registrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>
                            {new Date(registration.submitted_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <strong>{registration.organization_name}</strong>
                          </TableCell>
                          <TableCell>{registration.contact_name}</TableCell>
                          <TableCell>{registration.rabbi || '—'}</TableCell>
                          <TableCell>{registration.email}</TableCell>
                          <TableCell>{registration.phone || '—'}</TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                              {registration.street_address && (
                                <>
                                  {registration.street_address}<br />
                                </>
                              )}
                              {registration.city}, {registration.state} {registration.zip_code}<br />
                              {registration.country}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {registration.purpose}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={registration.status}
                              color={
                                registration.status === 'approved' ? 'success' :
                                registration.status === 'rejected' ? 'error' :
                                'warning'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              {registration.status === 'pending' && (
                                <>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleApproveClick(registration)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleRejectClick(registration)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDeleteRegistration(registration)}
                                title="Delete registration"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Delete Shul Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete <strong>{shulToDelete?.name}</strong>?
            <br /><br />
            This will permanently delete:
            <ul>
              <li>The shul and all its settings</li>
              <li>The user account for <strong>{shulToDelete?.admin_email}</strong></li>
              <li>All associated data (zmanim, custom times, custom texts)</li>
            </ul>
            <strong>This action cannot be undone.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Registration Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve <strong>{selectedRegistration?.organization_name}</strong>?
            <br /><br />
            An invitation email will be sent to <strong>{selectedRegistration?.email}</strong> with a link to complete their registration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApproveConfirm} color="success" variant="contained">
            Approve & Send Email
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Registration Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>Reject Registration</DialogTitle>
        <DialogContent>
          <DialogContentText className="mb-4">
            Reject registration for <strong>{selectedRegistration?.organization_name}</strong>?
          </DialogContentText>
          <TextField
            label="Rejection Reason (optional)"
            multiline
            rows={4}
            fullWidth
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Provide a reason for rejection (will be sent via email)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRejectConfirm} color="error" variant="contained">
            Reject & Send Email
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MasterAdminDashboard;
