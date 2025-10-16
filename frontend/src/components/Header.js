// src/components/Header.js
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const Header = () => {
  const navigate = useNavigate();
  const [shulSlug, setShulSlug] = useState(null);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get shul ID and user data from API
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    if (token) {
      fetchShulData(token);
      checkMasterAdmin();
    }
  }, []);

  const fetchShulData = async (token) => {
    try {
      const data = await api.get('/shul/');
      setShulSlug(data.slug);
    } catch (error) {
      console.error('Error fetching shul data:', error);
    }
  };

  const checkMasterAdmin = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        setIsMasterAdmin(user.is_staff === true);
      }
    } catch (error) {
      console.error('Error checking master admin status:', error);
    }
  };

  const openShulDisplay = () => {
    const displayUrl = shulSlug ? `/display/${shulSlug}` : '/display';
    window.open(displayUrl, '_blank');
  };

  const handleLogout = () => {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('shulData');

    // Redirect to login page
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        color: '#1f2937'
      }}
    >
      <Toolbar sx={{ minHeight: '64px', px: 3 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            color: '#111827',
            letterSpacing: '-0.02em'
          }}
        >
          Shul Schedule
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {isLoggedIn ? (
            <>
              <Button
                onClick={openShulDisplay}
                sx={{
                  color: '#ffffff',
                  backgroundColor: '#3b82f6',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#2563eb'
                  }
                }}
              >
                Shul Display
              </Button>
              <Button
                component={Link}
                to="/admin/shul-settings"
                sx={{
                  color: '#4b5563',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#111827'
                  }
                }}
              >
                Shul Settings
              </Button>
              <Button
                component={Link}
                to="/admin/zmanim-settings"
                sx={{
                  color: '#4b5563',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#111827'
                  }
                }}
              >
                Zmanim Settings
              </Button>
              <Button
                component={Link}
                to="/admin/zmanim-debug"
                sx={{
                  color: '#4b5563',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#111827'
                  }
                }}
              >
                Future Zmanim
              </Button>
              <Button
                component={Link}
                to="/admin/suggestions"
                sx={{
                  color: '#4b5563',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#111827'
                  }
                }}
              >
                Suggestions
              </Button>
              <Button
                component={Link}
                to="/admin/about"
                sx={{
                  color: '#4b5563',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#111827'
                  }
                }}
              >
                About
              </Button>
              <Button
                component={Link}
                to="/admin/setup"
                sx={{
                  color: '#4b5563',
                  px: 2,
                  py: 0.75,
                  borderRadius: '6px',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#f3f4f6',
                    color: '#111827'
                  }
                }}
              >
                Setup
              </Button>
              {isMasterAdmin && (
                <Button
                  component={Link}
                  to="/master-admin"
                  sx={{
                    color: '#92400e',
                    backgroundColor: '#fef3c7',
                    px: 2,
                    py: 0.75,
                    ml: 1,
                    borderRadius: '6px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: '#fde68a'
                    }
                  }}
                >
                  Master Admin
                </Button>
              )}
              <Button
                onClick={handleLogout}
                sx={{
                  color: '#6b7280',
                  px: 2,
                  py: 0.75,
                  ml: 2,
                  borderLeft: '1px solid #e5e7eb',
                  borderRadius: '0',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#fef2f2',
                    color: '#dc2626'
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: '#ffffff',
                backgroundColor: '#3b82f6',
                px: 2.5,
                py: 0.75,
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: '#2563eb'
                }
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
