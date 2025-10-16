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
    <AppBar position="static" sx={{ backgroundColor: '#162A45' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Shul Schedule
        </Typography>

        <Box>
          {isLoggedIn ? (
            <>
              <Button color="inherit" onClick={openShulDisplay} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 1 }}>Shul Display</Button>
              <Button color="inherit" component={Link} to="/admin/shul-settings">Shul Settings</Button>
              <Button color="inherit" component={Link} to="/admin/zmanim-settings">Zmanim Settings</Button>
              <Button color="inherit" component={Link} to="/admin/zmanim-debug">Future Zmanim</Button>
              <Button color="inherit" component={Link} to="/admin/about">About</Button>
              <Button color="inherit" component={Link} to="/admin/setup">Setup</Button>
              {isMasterAdmin && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/master-admin"
                  sx={{
                    backgroundColor: 'rgba(255, 199, 0, 0.2)',
                    marginLeft: 1,
                    borderLeft: '2px solid rgba(255, 199, 0, 0.5)'
                  }}
                >
                  Master Admin
                </Button>
              )}
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  marginLeft: 2,
                  borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                  paddingLeft: 2
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color="inherit"
              component={Link}
              to="/login"
              sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
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
