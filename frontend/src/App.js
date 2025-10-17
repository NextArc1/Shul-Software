import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header';  // Import the Header component
import Footer from './components/Footer';  // Import the Footer component
import ErrorBoundary from './components/ErrorBoundary';  // Import the ErrorBoundary component
import ShulSettings from './pages/ShulSettings';  // Import the ShulSettings page
import ZmanimSettings from './pages/ZmanimSettings';  // Import the ZmanimSettings page
import ShulDisplay from './pages/ShulDisplay';  // Import the ShulDisplay page
import ShulDisplayWoodGold from './pages/ShulDisplayWoodGold';  // Import the Wood/Gold display
import ShulDisplayMarbleGold from './pages/ShulDisplayMarbleGold';  // Import the Marble/Gold display
import About from './pages/About';  // Import the About page
import Setup from './pages/Setup';  // Import the Setup page
import Login from './pages/Login';  // Import the Login page
import Register from './pages/Register';  // Import the Register page (LEGACY - kept for potential re-enabling)
import RegistrationRequest from './pages/RegistrationRequest';  // Import the Registration Request page
import CompleteRegistration from './pages/CompleteRegistration';  // Import the Complete Registration page
import ZmanimDebug from './pages/ZmanimDebug';  // Import the ZmanimDebug page
import Suggestions from './pages/Suggestions';  // Import the Suggestions page
import MasterAdminDashboard from './pages/MasterAdminDashboard';  // Import Master Admin Dashboard
import GlobalMemorialSettings from './pages/GlobalMemorialSettings';  // Import Global Memorial Settings
import MasterAdminRoute from './components/MasterAdminRoute';  // Import Master Admin Route Protection
import NotFound from './pages/NotFound';  // Import 404 Not Found page
import LandingPage from './pages/LandingPage';  // Import Landing Page
import woodBackground from './assets/wood-background.png';  // Import wood background

// Layout component for admin pages (with header and footer)
function AdminLayout({ children }) {
  return (
    <div className="App" style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundImage: `url(${woodBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat'
    }}>
      <Header />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  );
}

// Layout component for display pages (no header)
function DisplayLayout({ children }) {
  return (
    <div className="App" style={{
      backgroundImage: `url(${woodBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh'
    }}>
      {children}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <Router>
        <Routes>
          {/* Authentication routes (no header) */}
          <Route path="/login" element={<DisplayLayout><Login /></DisplayLayout>} />

          {/* Registration workflow (no header) */}
          <Route path="/register" element={<DisplayLayout><RegistrationRequest /></DisplayLayout>} />
          <Route path="/register/complete/:token" element={<DisplayLayout><CompleteRegistration /></DisplayLayout>} />

          {/* LEGACY: Old direct register route - commented out but code kept */}
          {/* <Route path="/register-direct" element={<DisplayLayout><Register /></DisplayLayout>} /> */}

          {/* Admin portal routes (with header) */}
          <Route path="/manage/shul-settings" element={<AdminLayout><ShulSettings /></AdminLayout>} />
          <Route path="/manage/zmanim-settings" element={<AdminLayout><ZmanimSettings /></AdminLayout>} />
          <Route path="/manage/zmanim-debug" element={<AdminLayout><ZmanimDebug /></AdminLayout>} />
          <Route path="/manage/suggestions" element={<AdminLayout><Suggestions /></AdminLayout>} />
          <Route path="/manage/about" element={<AdminLayout><About /></AdminLayout>} />
          <Route path="/manage/setup" element={<AdminLayout><Setup /></AdminLayout>} />
          <Route path="/manage" element={<AdminLayout><ShulSettings /></AdminLayout>} />

          {/* Master Admin routes (with header and protection) */}
          <Route path="/master-admin" element={<AdminLayout><MasterAdminRoute><MasterAdminDashboard /></MasterAdminRoute></AdminLayout>} />
          <Route path="/master-admin/memorial-settings" element={<AdminLayout><MasterAdminRoute><GlobalMemorialSettings /></MasterAdminRoute></AdminLayout>} />

          {/* Public display routes (no header) */}
          <Route path="/display/:shulSlug" element={<DisplayLayout><ShulDisplay /></DisplayLayout>} />
          <Route path="/display" element={<DisplayLayout><ShulDisplay /></DisplayLayout>} />

          {/* Wood & Gold Display Theme */}
          <Route path="/display-gold/:slug" element={<DisplayLayout><ShulDisplayWoodGold /></DisplayLayout>} />

          {/* Marble & Gold Display Theme */}
          <Route path="/display-marble/:slug" element={<DisplayLayout><ShulDisplayMarbleGold /></DisplayLayout>} />

          {/* Default route shows landing page */}
          <Route path="/" element={<DisplayLayout><LandingPage /></DisplayLayout>} />

          {/* Catch-all 404 route - must be last */}
          <Route path="*" element={<AdminLayout><NotFound /></AdminLayout>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
