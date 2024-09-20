import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Header from './components/Header';  // Import the Header component
import ShulSettings from './pages/ShulSettings';  // Import the ShulSettings page
import ZmanimSettings from './pages/ZmanimSettings';  // Import the ZmanimSettings page
import ShulDisplay from './pages/ShulDisplay';  // Import the ShulDisplay page
import About from './pages/About';  // Import the About page
import Setup from './pages/Setup';  // Import the Setup page

function App() {
  return (
    <Router>
      <div className="App">
        <Header />  {/* Keep the Header component always visible */}
        <Routes>  {/* Use Routes instead of Switch */}
          <Route path="/shul-settings" element={<ShulSettings />} />
          <Route path="/zmanim-settings" element={<ZmanimSettings />} />
          <Route path="/shul-display" element={<ShulDisplay />} />
          <Route path="/about" element={<About />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/" element={<ShulSettings />} />  {/* Default to Shul Settings */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
