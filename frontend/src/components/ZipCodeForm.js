import React, { useState } from 'react';

const ZipcodeForm = () => {
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('USA');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [language, setLanguage] = useState('s');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [showSeconds, setShowSeconds] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      zip_code: zipCode,
      country,
      latitude: latitude || null,  // Send latitude if manually entered
      longitude: longitude || null,  // Send longitude if manually entered
      language,
      time_format: timeFormat,
      show_seconds: showSeconds
    };

    fetch('http://127.0.0.1:8000/api/get-coordinates/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        // Set the success message
        setSuccessMessage('Shul settings saved successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        setSuccessMessage('Error saving shul settings.');
      });
  };

  return (
      <div>
          <form onSubmit={handleSubmit}>
              <h2>Enter ZIP Code or Coordinates</h2>

              <label>
                  Zip Code:
                  <input
                      type="text"
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                  />
              </label>

              <label>
                  Country:
                  <select value={country} onChange={e => setCountry(e.target.value)}>
                      <option value="USA">United States</option>
                      <option value="ISR">Israel</option>
                      <option value="CAN">Canada</option>
                      <option value="GBR">United Kingdom</option>
                      <option value="AUS">Australia</option>
                      <option value="ZAF">South Africa</option>
                      <option value="FRA">France</option>
                      <option value="BRA">Brazil</option>
                      <option value="ARG">Argentina</option>
                      <option value="RUS">Russia</option>
                      <option value="MEX">Mexico</option>
                      <option value="GER">Germany</option>
                      <option value="NLD">Netherlands</option>
                      <option value="BEL">Belgium</option>
                      <option value="ESP">Spain</option>
                      <option value="ITA">Italy</option>
                      <option value="CHL">Chile</option>
                      <option value="UKR">Ukraine</option>
                      <option value="HUN">Hungary</option>
                      <option value="AUT">Austria</option>
                  </select>
              </label>

              <h2>OR Manually Enter Coordinates</h2>
              <label>
                  Latitude:
                  <input
                      type="text"
                      value={latitude}
                      onChange={e => setLatitude(e.target.value)}
                  />
              </label>

              <label>
                  Longitude:
                  <input
                      type="text"
                      value={longitude}
                      onChange={e => setLongitude(e.target.value)}
                  />
              </label>

              <h2>Language and Time Format Settings</h2>
              <label>
                  Display Language:
                  <select value={language} onChange={e => setLanguage(e.target.value)}>
                      <option value="s">Sephardic (default)</option>
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
              </label>

              <label>
                  Time Format:
                  <select value={timeFormat} onChange={e => setTimeFormat(e.target.value)}>
                      <option value="12h">12-hour</option>
                      <option value="24h">24-hour</option>
                  </select>
              </label>

              <label>
                  Show Seconds:
                  <select value={showSeconds} onChange={e => setShowSeconds(e.target.value === 'yes')}>
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                  </select>
              </label>

              <button type="submit">Submit</button>
          </form>

          {successMessage && <p>{successMessage}</p>}
          </div>
          );
          };

          export default ZipcodeForm;
