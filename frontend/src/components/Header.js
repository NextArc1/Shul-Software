// src/components/Header.js
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Shul Display App
        </Typography>

        <Box>
          <Button color="inherit" component={Link} to="/shul-settings">Shul Settings</Button>
          <Button color="inherit" component={Link} to="/zmanim-settings">Zmanim Settings</Button>
          <Button color="inherit" component={Link} to="/shul-display">Shul Display</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/setup">Setup</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
