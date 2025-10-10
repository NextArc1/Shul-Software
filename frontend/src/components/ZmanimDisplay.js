import React from 'react';

const ZmanimDisplay = ({ zmanim, limudim, jewishCalendar }) => {
  // Filter to show only values that exist (not null/undefined)
  const filterData = (data) => {
    if (!data) return {};
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== null && value !== undefined && value !== '')
    );
  };

  const filteredZmanim = filterData(zmanim);
  const filteredLimudim = filterData(limudim);
  const filteredCalendar = filterData(jewishCalendar);

  return (
    <div className="zmanim-display" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {/* Zmanim Section */}
      <div style={{ flex: '1 1 300px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, color: '#2196F3' }}>Zmanim ({Object.keys(filteredZmanim).length})</h2>
        {Object.keys(filteredZmanim).length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px' }}>
            {Object.entries(filteredZmanim).map(([key, value]) => (
              <li key={key} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>No zmanim data available</p>
        )}
      </div>

      {/* Limudim Section */}
      <div style={{ flex: '1 1 300px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, color: '#9C27B0' }}>Limudim ({Object.keys(filteredLimudim).length})</h2>
        {Object.keys(filteredLimudim).length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px' }}>
            {Object.entries(filteredLimudim).map(([key, value]) => (
              <li key={key} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                <strong>{key}:</strong> {String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>No limudim data available</p>
        )}
      </div>

      {/* Jewish Calendar Section */}
      <div style={{ flex: '1 1 300px', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0, color: '#4CAF50' }}>Jewish Calendar ({Object.keys(filteredCalendar).length})</h2>
        {Object.keys(filteredCalendar).length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '13px' }}>
            {Object.entries(filteredCalendar).map(([key, value]) => (
              <li key={key} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                <strong>{key}:</strong> {typeof value === 'boolean' ? (value ? '✓' : '✗') : String(value)}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#999' }}>No calendar data available</p>
        )}
      </div>
    </div>
  );
};

export default ZmanimDisplay;