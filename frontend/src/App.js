import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header';  // Import the Header component
import ErrorBoundary from './components/ErrorBoundary';  // Import the ErrorBoundary component
import ShulSettings from './pages/ShulSettings';  // Import the ShulSettings page
import ZmanimSettings from './pages/ZmanimSettings';  // Import the ZmanimSettings page
import ShulDisplay from './pages/ShulDisplay';  // Import the ShulDisplay page
import ShulDisplayWoodGold from './pages/ShulDisplayWoodGold';  // Import the Wood/Gold display
import ShulDisplayMarbleGold from './pages/ShulDisplayMarbleGold';  // Import the Marble/Gold display
import About from './pages/About';  // Import the About page
import Setup from './pages/Setup';  // Import the Setup page
import Login from './pages/Login';  // Import the Login page
import Register from './pages/Register';  // Import the Register page
import ZmanimDebug from './pages/ZmanimDebug';  // Import the ZmanimDebug page

// Layout component for admin pages (with header)
function AdminLayout({ children }) {
  return (
    <div className="App">
      <Header />
      {children}
    </div>
  );
}

// Layout component for display pages (no header)
function DisplayLayout({ children }) {
  return (
    <div className="App">
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
          <Route path="/register" element={<DisplayLayout><Register /></DisplayLayout>} />

          {/* Admin portal routes (with header) */}
          <Route path="/admin/shul-settings" element={<AdminLayout><ShulSettings /></AdminLayout>} />
          <Route path="/admin/zmanim-settings" element={<AdminLayout><ZmanimSettings /></AdminLayout>} />
          <Route path="/admin/zmanim-debug" element={<AdminLayout><ZmanimDebug /></AdminLayout>} />
          <Route path="/admin/about" element={<AdminLayout><About /></AdminLayout>} />
          <Route path="/admin/setup" element={<AdminLayout><Setup /></AdminLayout>} />
          <Route path="/admin" element={<AdminLayout><ShulSettings /></AdminLayout>} />

          {/* Public display routes (no header) */}
          <Route path="/display/:shulSlug" element={<DisplayLayout><ShulDisplay /></DisplayLayout>} />
          <Route path="/display" element={<DisplayLayout><ShulDisplay /></DisplayLayout>} />

          {/* Wood & Gold Display Theme */}
          <Route path="/display-gold/:slug" element={<DisplayLayout><ShulDisplayWoodGold /></DisplayLayout>} />

          {/* Marble & Gold Display Theme */}
          <Route path="/display-marble/:slug" element={<DisplayLayout><ShulDisplayMarbleGold /></DisplayLayout>} />

          {/* Default route redirects to registration */}
          <Route path="/" element={<DisplayLayout><Register /></DisplayLayout>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
