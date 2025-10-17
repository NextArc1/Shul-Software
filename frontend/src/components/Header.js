// src/components/Header.js
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const Header = () => {
  const navigate = useNavigate();
  const [shulSlug, setShulSlug] = useState(null);
  const [isMasterAdmin, setIsMasterAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    // Close mobile menu if open
    setMobileMenuOpen(false);

    // Redirect to login page
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const menuItems = [
    { label: 'Shul Display', onClick: openShulDisplay, color: '#3b82f6' },
    { label: 'Shul Settings', to: '/manage/shul-settings' },
    { label: 'Zmanim Settings', to: '/manage/zmanim-settings' },
    { label: 'Future Zmanim', to: '/manage/zmanim-debug' },
    { label: 'Suggestions', to: '/manage/suggestions' },
    { label: 'About', to: '/manage/about' },
    { label: 'Setup', to: '/manage/setup' },
  ];

  if (isMasterAdmin) {
    menuItems.push({ label: 'Master Admin', to: '/master-admin', highlight: true });
  }

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e7eb',
          color: '#1f2937'
        }}
      >
        <Toolbar sx={{ minHeight: '64px', px: { xs: 2, sm: 3 } }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              color: '#111827',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            Shul Schedule
          </Typography>

          {/* Mobile Menu Icon */}
          {isLoggedIn && (
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={toggleMobileMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                color: '#111827'
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
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
                to="/manage/shul-settings"
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
                to="/manage/zmanim-settings"
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
                to="/manage/zmanim-debug"
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
                to="/manage/suggestions"
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
                to="/manage/about"
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
                to="/manage/setup"
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

    {/* Mobile Drawer Menu */}
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={closeMobileMenu}
      sx={{
        display: { xs: 'block', md: 'none' },
        '& .MuiDrawer-paper': {
          width: 280,
          pt: 2
        }
      }}
    >
      <List>
        {isLoggedIn && menuItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                } else if (item.to) {
                  navigate(item.to);
                }
                closeMobileMenu();
              }}
              sx={{
                py: 1.5,
                backgroundColor: item.highlight ? '#fef3c7' : 'transparent',
                '&:hover': {
                  backgroundColor: item.highlight ? '#fde68a' : '#f3f4f6'
                }
              }}
            >
              <ListItemText
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: item.highlight ? 600 : 500,
                    color: item.highlight ? '#92400e' : item.color || '#4b5563'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        {isLoggedIn && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#fef2f2'
                  }
                }}
              >
                <ListItemText
                  primary="Logout"
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      color: '#dc2626'
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  </>
  );
};

export default Header;
