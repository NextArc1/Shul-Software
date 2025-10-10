// src/components/Header.js
import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';

const Header = () => {
  const [shulSlug, setShulSlug] = useState(null);

  useEffect(() => {
    // Get shul ID from API
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchShulData(token);
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

  const openShulDisplay = () => {
    const displayUrl = shulSlug ? `/display/${shulSlug}` : '/display';
    window.open(displayUrl, '_blank');
  };

  const openGoldDisplay = () => {
    const displayUrl = shulSlug ? `/display-gold/${shulSlug}` : '/display-gold/abc';
    window.open(displayUrl, '_blank');
  };

  const openMarbleDisplay = () => {
    const displayUrl = shulSlug ? `/display-marble/${shulSlug}` : '/display-marble/abc';
    window.open(displayUrl, '_blank');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Shul Display App
        </Typography>

        <Box>
          <Button color="inherit" onClick={openShulDisplay} sx={{ backgroundColor: 'rgba(255,255,255,0.1)', marginRight: 1 }}>📺 Display (Classic)</Button>
          <Button color="inherit" onClick={openGoldDisplay} sx={{ backgroundColor: 'rgba(210,180,96,0.2)', marginRight: 1 }}>✨ Display (Gold)</Button>
          <Button color="inherit" onClick={openMarbleDisplay} sx={{ backgroundColor: 'rgba(245,245,220,0.2)', marginRight: 1 }}>🏛️ Display (Marble)</Button>
          <Button color="inherit" component={Link} to="/admin/shul-settings">Shul Settings</Button>
          <Button color="inherit" component={Link} to="/admin/zmanim-settings">Zmanim Settings</Button>
          <Button color="inherit" component={Link} to="/admin/zmanim-debug">🐛 Zmanim Debug</Button>
          <Button color="inherit" component={Link} to="/admin/about">About</Button>
          <Button color="inherit" component={Link} to="/admin/setup">Setup</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
