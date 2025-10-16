import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SettingsIcon from '@mui/icons-material/Settings';
import TvIcon from '@mui/icons-material/Tv';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import PaletteIcon from '@mui/icons-material/Palette';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

const LandingPage = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <AccessTimeIcon sx={{ fontSize: 60, color: '#162A45' }} />,
      title: 'Complete Zmanim System',
      description: 'Over 25 different zmanim automatically calculated daily based on your exact GPS coordinates—no manual updates needed, ever.'
    },
    {
      icon: <CalendarMonthIcon sx={{ fontSize: 60, color: '#162A45' }} />,
      title: 'Full Jewish Calendar',
      description: 'Hebrew dates, Parsha, Daf Yomi (Bavli & Yerushalmi), Mishna Yomis, Tehillim, Pirkei Avos, Amud Yomi, and all Yomim Tovim automatically displayed.'
    },
    {
      icon: <TvIcon sx={{ fontSize: 60, color: '#162A45' }} />,
      title: 'Beautiful HD Display',
      description: 'Professional display screen that looks stunning on any screen or monitor. Plug in a computer and you\'re ready to go.'
    },
    {
      icon: <SettingsIcon sx={{ fontSize: 60, color: '#162A45' }} />,
      title: 'Powerful Admin Portal',
      description: 'Manage everything from one simple dashboard—add minyanim, post announcements, customize the display, and control every detail of what shows.'
    }
  ];

  const zmanimFeatures = [
    'Alos HaShachar (multiple opinions: 72 min, 16.1°, 18°, 19.8°)',
    'Neitz HaChamah (Sunrise)',
    'Sof Zman Krias Shema (GRA & MGA)',
    'Sof Zman Tefillah (GRA & MGA)',
    'Chatzos (Midday)',
    'Mincha Gedola & Mincha Ketana',
    'Plag HaMincha',
    'Shkiah (Sunset)',
    'Tzais HaKochavim (multiple opinions: 8.5°, 7.083°, 5.95°, 6.45°, 72 min)',
    'Candle Lighting times',
    'Shaah Zmanis (GRA & MGA)',
    'Elevation-adjusted sunrise/sunset',
    'Molad times',
    'Kiddush Levana (earliest & latest)'
  ];

  const customizationFeatures = [
    'Upload your shul\'s logo or use custom text',
    'Multiple language options: Hebrew, English, Ashkenazic, and Sephardic transliterations',
    '12-hour or 24-hour time format',
    'Custom fonts for every box and text element',
    'Full color customization (text, backgrounds, borders)',
    'Custom background image or solid color',
    'Drag-and-drop layout builder—arrange any zmanim in any box',
    'Font size controls for perfect readability',
  ];

  const adminFeatures = [
    'Add unlimited custom minyan times (fixed times or dynamic based on zmanim)',
    'Schedule times for specific days (e.g., "Mincha only on Sundays")',
    'Create custom announcements and text fields',
    'View 6 months of future zmanim',
    'Everything auto-updates daily—set it and forget it',
    'Simple location setup with ZIP code or GPS coordinates',
    'Instant preview of changes before publishing'
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #162A45 0%, #0a1929 100%)',
        color: 'white'
      }}
    >
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Shul Schedule
          </Typography>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 4, color: '#ffc764', fontWeight: 300 }}
          >
            The Complete Zmanim & Luach Display System for Your Shul
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 3, maxWidth: '900px', mx: 'auto', color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}
          >
            Give your Shul a professional display showing accurate zmanim, davening times,
            shiurim schedules, the daily Daf Yomi, and Yomim Tovim—all calculated precisely for your
            shul's exact location.
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 5, maxWidth: '800px', mx: 'auto', color: 'rgba(255,255,255,0.8)' }}
          >

          </Typography>

          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                backgroundColor: '#ffc764',
                color: '#162A45',
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#ffb732'
                }
              }}
            >
              Start Free Today
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontSize: '1.2rem',
                px: 6,
                py: 2,
                '&:hover': {
                  borderColor: '#ffc764',
                  color: '#ffc764',
                  backgroundColor: 'rgba(255, 199, 100, 0.1)'
                }
              }}
            >
              Sign In
            </Button>
          </Box>

          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
            100% Free • No Credit Card Required • Setup in 5 Minutes
          </Typography>
        </Box>

        {/* Main Features Grid */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          {mainFeatures.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  backgroundColor: 'rgba(255, 255, 255, 0.98)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.25)'
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 4, px: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color: '#162A45', mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Features Sections */}
        <Box sx={{ my: 10 }}>
          <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Zmanim Section */}
          <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <AccessTimeIcon sx={{ fontSize: 50, color: '#ffc764', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Over 25 Zmanim Calculated Daily
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                Every single zman is calculated daily using your shul's exact GPS coordinates and elevation.
                We support multiple opinions for Alos and Tzais, giving you the flexibility to display
                zmanim according to your minhag.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                <CardContent sx={{ p: 3 }}>
                  <List dense>
                    {zmanimFeatures.map((feature, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Customization Section */}
          <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                <CardContent sx={{ p: 3 }}>
                  <List dense>
                    {customizationFeatures.map((feature, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PaletteIcon sx={{ fontSize: 50, color: '#ffc764', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Fully Customizable Design
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                Make it yours! Upload your shul's logo, choose colors that match your style, select your
                preferred language (Hebrew, English, or transliterated Ashkenazic/Sephardic pronunciations),
                and arrange the layout exactly how you want it.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Every element is customizable—fonts, colors, sizes, positions. Use the drag-and-drop
                layout builder to decide which zmanim appear in which boxes. Want Mincha Gedola in the
                left box? No problem. Want to hide Tzais 72? Done in one click.
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 8, borderColor: 'rgba(255,255,255,0.2)' }} />

          {/* Admin Portal Section */}
          <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ViewQuiltIcon sx={{ fontSize: 50, color: '#ffc764', mr: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  Simple Admin Dashboard
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
                Managing your shul's display is easy. Add your minyan times (Shacharis, Mincha, Maariv),
                post announcements, create memorial boxes, and customize everything from one clean dashboard.
                No technical knowledge needed—if you can use email, you can use this.
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                Create custom times that automatically adjust based on zmanim. For example: "Mincha is
                30 minutes before Shkiah on weekdays" or "Sunday Shacharis at 8:00 AM." Set it once and
                it updates automatically every single day.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
                <CardContent sx={{ p: 3 }}>
                  <List dense>
                    {adminFeatures.map((feature, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* How It Works */}
        <Box textAlign="center" sx={{ my: 10 }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
            Setup in 3 Easy Steps
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h2"
                    sx={{ color: '#ffc764', fontWeight: 'bold', mb: 2 }}
                  >
                    1
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#162A45' }}>
                    Sign Up Free
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your account and enter your shul's name and location (ZIP code or coordinates).
                    Takes 2 minutes.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h2"
                    sx={{ color: '#ffc764', fontWeight: 'bold', mb: 2 }}
                  >
                    2
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#162A45' }}>
                    Customize Your Display
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add your logo, choose colors and fonts, arrange the layout, and add your minyan times.
                    Preview in real-time.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.95)', height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h2"
                    sx={{ color: '#ffc764', fontWeight: 'bold', mb: 2 }}
                  >
                    3
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#162A45' }}>
                    Display on Your Screen
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Open the display link on the computer connected to your Screen.
                    That's it—you're live!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Final CTA */}
        <Box textAlign="center" sx={{ my: 10, py: 8, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.05)' }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
            Ready to Upgrade Your Shul?
          </Typography>
          <Typography variant="h6" sx={{ mb: 5, color: 'rgba(255,255,255,0.8)', maxWidth: '700px', mx: 'auto' }}>
            Join shuls worldwide using Shul Schedule to provide their Shul with accurate,
            beautiful, and always-updated zmanim displays.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              backgroundColor: '#ffc764',
              color: '#162A45',
              fontSize: '1.3rem',
              px: 8,
              py: 2.5,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#ffb732'
              }
            }}
          >
            Get Started Free
          </Button>
          <Typography variant="body2" sx={{ mt: 3, color: 'rgba(255,255,255,0.6)' }}>
            No credit card required • Free forever • Cancel anytime
          </Typography>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          backgroundColor: 'rgba(0, 0, 0, 0.3)'
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          © {new Date().getFullYear()} Shul Schedule. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
