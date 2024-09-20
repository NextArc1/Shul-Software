import React, { useState, useEffect } from 'react';

function ZmanimSettings() {
  const [zmanim, setZmanim] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/zmanim/')
      .then(response => response.json())
      .then(data => setZmanim(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Zmanim Settings</h1>
      <ul>
        {zmanim.map((zman, index) => (
          <li key={index}>
            Zip Code: {zman.zip_code}, Sunrise: {zman.sunrise}, Sunset: {zman.sunset}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ZmanimSettings;
