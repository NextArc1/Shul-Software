import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const ZipcodeForm = () => {
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [language, setLanguage] = useState('s');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [showSeconds, setShowSeconds] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentZipCode, setCurrentZipCode] = useState('');

  // Styles
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
      border: '1px solid #e5e7eb'
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center',
      color: '#1f2937'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      margin: '0 0 0.5rem 0',
      color: '#111827'
    },
    subtitle: {
      fontSize: '1rem',
      color: '#6b7280',
      margin: 0
    },
    currentInfo: {
      padding: '1rem',
      marginBottom: '2rem',
      backgroundColor: '#f0f9ff',
      border: '1px solid #bae6fd',
      borderRadius: '8px',
      fontSize: '0.95rem',
      color: '#0c4a6e',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    section: {
      marginBottom: '2.5rem'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: '2px solid #e5e7eb'
    },
    formGroup: {
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '1rem',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
      boxSizing: 'border-box'
    },
    flexRow: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'end'
    },
    flexEqual: {
      flex: 1
    },
    button: {
      padding: '0.75rem 1.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      whiteSpace: 'nowrap'
    },
    buttonHover: {
      backgroundColor: '#2563eb'
    },
    buttonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    primaryButton: {
      padding: '1rem 2rem',
      backgroundColor: '#059669',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      marginTop: '2rem',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    alert: {
      padding: '1rem',
      marginTop: '1.5rem',
      borderRadius: '8px',
      fontSize: '0.95rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    alertSuccess: {
      backgroundColor: '#d1fae5',
      border: '1px solid #a7f3d0',
      color: '#065f46'
    },
    alertError: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#991b1b'
    },
    gridTwo: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem'
    },
    gridThree: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 1fr',
      gap: '1rem'
    },
    helpText: {
      fontSize: '0.85rem',
      color: '#6b7280',
      marginTop: '0.25rem'
    },
    spinner: {
      width: '1rem',
      height: '1rem',
      border: '2px solid #ffffff',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  // Load current settings when component mounts
  useEffect(() => {
    const loadCurrentSettings = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const data = await api.get('/shul/');
        if (data.zip_code) setCurrentZipCode(data.zip_code);
        if (data.country) setCountry(data.country);
        if (data.latitude) setLatitude(data.latitude.toString());
        if (data.longitude) setLongitude(data.longitude.toString());
        if (data.language) setLanguage(data.language);
        if (data.time_format) setTimeFormat(data.time_format);
        if (data.show_seconds !== undefined) setShowSeconds(data.show_seconds);
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };

    loadCurrentSettings();
  }, []);

  // Country mapping for geocoding
  const getCountryName = (code) => {
    const countryMap = {
      'USA': 'United States', 'ISR': 'Israel', 'CAN': 'Canada', 'GBR': 'United Kingdom',
      'AUS': 'Australia', 'ZAF': 'South Africa', 'FRA': 'France', 'BRA': 'Brazil',
      'ARG': 'Argentina', 'RUS': 'Russia', 'MEX': 'Mexico', 'GER': 'Germany',
      'NLD': 'Netherlands', 'BEL': 'Belgium', 'ESP': 'Spain', 'ITA': 'Italy',
      'CHL': 'Chile', 'UKR': 'Ukraine', 'HUN': 'Hungary', 'AUT': 'Austria'
    };
    return countryMap[code] || code;
  };

  // Fetch coordinates from zip code and auto-save
  const fetchCoordinates = async () => {
    if (!zipCode || zipCode.length < 3) return;
    
    setIsLoadingCoordinates(true);
    setSuccessMessage('');
    
    try {
      const query = country === 'USA' ? `${zipCode}, United States` : `${zipCode}, ${getCountryName(country)}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const newLat = parseFloat(result.lat).toFixed(6);
        const newLon = parseFloat(result.lon).toFixed(6);
        
        setLatitude(newLat);
        setLongitude(newLon);
        
        // Auto-save the settings with new coordinates
        await saveSettings(newLat, newLon);
        
      } else {
        setSuccessMessage('Could not find coordinates for this location');
      }
    } catch (error) {
      setSuccessMessage('Error fetching coordinates');
      console.error('Geocoding error:', error);
    } finally {
      setIsLoadingCoordinates(false);
    }
  };

  // Helper function to save settings
  const saveSettings = async (lat = latitude, lon = longitude) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setSuccessMessage('Error: No authentication token found. Please log in.');
      return;
    }

    const data = {
      language,
      time_format: timeFormat,
      show_seconds: showSeconds
    };

    // Include location data if coordinates are available
    if (lat && lon) {
      data.zip_code = zipCode;
      data.country = country;
      data.latitude = parseFloat(lat);
      data.longitude = parseFloat(lon);
    }

    try {
      setSuccessMessage('Saving settings...');
      
      await api.patch('/shul/', data);
      
      setSuccessMessage('✓ Location found and settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      setSuccessMessage('Location found but failed to save settings. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    await saveSettings();
    setIsSaving(false);
  };

  return (
    <div style={styles.container}>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Shul Configuration</h1>
        <p style={styles.subtitle}>Configure your synagogue's location and display preferences</p>
      </div>

      {currentZipCode && (
        <div style={styles.currentInfo}>
          <span>📍</span>
          <strong>Current Location:</strong> {currentZipCode}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📍 Location Settings</h2>
          <p style={styles.helpText}>Location is optional but required for accurate prayer times</p>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Zip/Postal Code</label>
            <div style={styles.flexRow}>
              <input
                type="text"
                value={zipCode}
                onChange={e => setZipCode(e.target.value)}
                placeholder="Enter zip code (e.g., 10001)"
                style={{ ...styles.input, ...styles.flexEqual }}
              />
              <button 
                type="button" 
                onClick={fetchCoordinates}
                disabled={zipCode.length < 3 || isLoadingCoordinates}
                style={{
                  ...styles.button,
                  ...(zipCode.length < 3 || isLoadingCoordinates ? styles.buttonDisabled : {})
                }}
              >
                {isLoadingCoordinates ? (
                  <>
                    <div style={styles.spinner}></div>
                    Loading...
                  </>
                ) : (
                  'Get Coordinates'
                )}
              </button>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Country</label>
            <select 
              value={country} 
              onChange={e => setCountry(e.target.value)}
              style={styles.select}
            >
              <option value="USA">🇺🇸 United States</option>
              <option value="ISR">🇮🇱 Israel</option>
              <option value="CAN">🇨🇦 Canada</option>
              <option value="GBR">🇬🇧 United Kingdom</option>
              <option value="AUS">🇦🇺 Australia</option>
              <option value="ZAF">🇿🇦 South Africa</option>
              <option value="FRA">🇫🇷 France</option>
              <option value="BRA">🇧🇷 Brazil</option>
              <option value="ARG">🇦🇷 Argentina</option>
              <option value="RUS">🇷🇺 Russia</option>
              <option value="MEX">🇲🇽 Mexico</option>
              <option value="GER">🇩🇪 Germany</option>
              <option value="NLD">🇳🇱 Netherlands</option>
              <option value="BEL">🇧🇪 Belgium</option>
              <option value="ESP">🇪🇸 Spain</option>
              <option value="ITA">🇮🇹 Italy</option>
              <option value="CHL">🇨🇱 Chile</option>
              <option value="UKR">🇺🇦 Ukraine</option>
              <option value="HUN">🇭🇺 Hungary</option>
              <option value="AUT">🇦🇹 Austria</option>
            </select>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Latitude</label>
              <input
                type="text"
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                placeholder="Auto-populated"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Longitude</label>
              <input
                type="text"
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                placeholder="Auto-populated"
                style={styles.input}
              />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎨 Display Preferences</h2>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Language & Tradition</label>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value)}
              style={styles.select}
            >
              <option value="s">Sephardic (Default)</option>
              <option value="a">Ashkenazic</option>
              <option value="he">Hebrew</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="ru">Russian</option>
              <option value="pl">Polish</option>
              <option value="fi">Finnish</option>
              <option value="hu">Hungarian</option>
              <option value="ro">Romanian</option>
              <option value="uk">Ukrainian</option>
              <option value="sh">Sephardic + Hebrew</option>
              <option value="ah">Ashkenazic + Hebrew</option>
            </select>
          </div>

          <div style={styles.gridTwo}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Time Format</label>
              <select 
                value={timeFormat} 
                onChange={e => setTimeFormat(e.target.value)}
                style={styles.select}
              >
                <option value="12h">12-hour (e.g., 7:30 PM)</option>
                <option value="24h">24-hour (e.g., 19:30)</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Show Seconds</label>
              <select 
                value={showSeconds ? 'yes' : 'no'} 
                onChange={e => setShowSeconds(e.target.value === 'yes')}
                style={styles.select}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSaving}
          style={{
            ...styles.primaryButton,
            ...(isSaving ? { backgroundColor: '#9ca3af', cursor: 'not-allowed' } : {})
          }}
        >
          {isSaving ? (
            <>
              <div style={styles.spinner}></div>
              Saving Settings...
            </>
          ) : (
            <>
              💾 Save Configuration
            </>
          )}
        </button>
      </form>

      {successMessage && (
        <div style={{
          ...styles.alert,
          ...(successMessage.includes('✓') ? styles.alertSuccess : styles.alertError)
        }}>
          <span>{successMessage.includes('✓') ? '✅' : '⚠️'}</span>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default ZipcodeForm;