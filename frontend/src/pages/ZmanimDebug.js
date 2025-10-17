import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

function ZmanimDebug() {
  const [zmanimData, setZmanimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('zmanim');
  const [extending, setExtending] = useState(false);
  const [extendMessage, setExtendMessage] = useState('');

  useEffect(() => {
    // Set default date range (today to 6 months from now)
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    // Format dates in local timezone (YYYY-MM-DD)
    const formatLocalDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatLocalDate(today));
    setEndDate(formatLocalDate(sixMonthsLater));
  }, []);

  const fetchZmanimRange = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in first');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/zmanim/range/?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch zmanim data');
      }

      const data = await response.json();
      setZmanimData(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching zmanim range:', err);
      setError(err.message || 'Failed to fetch zmanim data');
      setLoading(false);
    }
  };

  const handleExtendZmanim = async () => {
    try {
      setExtending(true);
      setExtendMessage('');

      const token = localStorage.getItem('authToken');
      if (!token) {
        setExtendMessage('Please log in first');
        setExtending(false);
        return;
      }

      const response = await fetch(`${API_URL}/zmanim/extend/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to extend zmanim');
      }

      const data = await response.json();
      setExtendMessage(`✓ ${data.message} (${data.records_created} days added)`);

      // Refresh the data after extending
      setTimeout(() => {
        fetchZmanimRange();
      }, 1000);

      // Clear message after 5 seconds
      setTimeout(() => setExtendMessage(''), 5000);

    } catch (err) {
      console.error('Error extending zmanim:', err);
      setExtendMessage(`Error: ${err.message}`);
    } finally {
      setExtending(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchZmanimRange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeString;
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const dt = new Date(dateTimeString);
    return dt.toLocaleString();
  };

  const formatMilliseconds = (ms) => {
    if (!ms) return 'N/A';
    const minutes = (ms / 60000).toFixed(2);
    return `${minutes} min`;
  };

  const renderBasicZmanimTab = () => (
    <div style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Basic Zmanim Times (14 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Alos</th>
            <th style={headerStyle}>Hanetz</th>
            <th style={headerStyle}>Shema GRA</th>
            <th style={headerStyle}>Shema MGA</th>
            <th style={headerStyle}>Tefila GRA</th>
            <th style={headerStyle}>Tefila MGA</th>
            <th style={headerStyle}>Chatzos</th>
            <th style={headerStyle}>Mincha Gedola</th>
            <th style={headerStyle}>Mincha Ketana</th>
            <th style={headerStyle}>Plag</th>
            <th style={headerStyle}>Shkia</th>
            <th style={headerStyle}>Tzais</th>
            <th style={headerStyle}>Tzais 72</th>
            <th style={headerStyle}>Candle</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{formatTime(day.alos)}</td>
              <td style={cellStyle}>{formatTime(day.hanetz)}</td>
              <td style={cellStyle}>{formatTime(day.sof_zman_krias_shema_gra)}</td>
              <td style={cellStyle}>{formatTime(day.sof_zman_krias_shema_mga)}</td>
              <td style={cellStyle}>{formatTime(day.sof_zman_tfila_gra)}</td>
              <td style={cellStyle}>{formatTime(day.sof_zman_tfila_mga)}</td>
              <td style={cellStyle}>{formatTime(day.chatzos)}</td>
              <td style={cellStyle}>{formatTime(day.mincha_gedola)}</td>
              <td style={cellStyle}>{formatTime(day.mincha_ketana)}</td>
              <td style={cellStyle}>{formatTime(day.plag_hamincha)}</td>
              <td style={cellStyle}>{formatTime(day.shkia)}</td>
              <td style={cellStyle}>{formatTime(day.tzais)}</td>
              <td style={cellStyle}>{formatTime(day.tzais_72)}</td>
              <td style={cellStyle}>{formatTime(day.candle_lighting)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAdditionalZmanimTab = () => (
    <div style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Additional Zmanim (12 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Sea Sunrise</th>
            <th style={headerStyle}>Sea Sunset</th>
            <th style={headerStyle}>Elev Sunrise</th>
            <th style={headerStyle}>Elev Sunset</th>
            <th style={headerStyle}>Alos 16.1°</th>
            <th style={headerStyle}>Alos 18°</th>
            <th style={headerStyle}>Alos 19.8°</th>
            <th style={headerStyle}>Tzais 8.5°</th>
            <th style={headerStyle}>Tzais 7.083°</th>
            <th style={headerStyle}>Tzais 5.95°</th>
            <th style={headerStyle}>Tzais 6.45°</th>
            <th style={headerStyle}>Sun Transit</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{formatTime(day.sea_level_sunrise)}</td>
              <td style={cellStyle}>{formatTime(day.sea_level_sunset)}</td>
              <td style={cellStyle}>{formatTime(day.elevation_adjusted_sunrise)}</td>
              <td style={cellStyle}>{formatTime(day.elevation_adjusted_sunset)}</td>
              <td style={cellStyle}>{formatTime(day.alos_16_1)}</td>
              <td style={cellStyle}>{formatTime(day.alos_18)}</td>
              <td style={cellStyle}>{formatTime(day.alos_19_8)}</td>
              <td style={cellStyle}>{formatTime(day.tzais_8_5)}</td>
              <td style={cellStyle}>{formatTime(day.tzais_7_083)}</td>
              <td style={cellStyle}>{formatTime(day.tzais_5_95)}</td>
              <td style={cellStyle}>{formatTime(day.tzais_6_45)}</td>
              <td style={cellStyle}>{formatTime(day.sun_transit)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 'clamp(24px, 5vw, 30px)', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Halachic Hours (3 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Shaah Zmanis GRA</th>
            <th style={headerStyle}>Shaah Zmanis MGA</th>
            <th style={headerStyle}>Temporal Hour</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{formatMilliseconds(day.shaah_zmanis_gra)}</td>
              <td style={cellStyle}>{formatMilliseconds(day.shaah_zmanis_mga)}</td>
              <td style={cellStyle}>{formatMilliseconds(day.temporal_hour)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderJewishCalendarTab = () => (
    <div style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Jewish Date Info (5 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Gregorian Date</th>
            <th style={headerStyle}>Jewish Year</th>
            <th style={headerStyle}>Month #</th>
            <th style={headerStyle}>Month Name</th>
            <th style={headerStyle}>Day</th>
            <th style={headerStyle}>Day of Week</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{day.jewish_year || 'N/A'}</td>
              <td style={cellStyle}>{day.jewish_month || 'N/A'}</td>
              <td style={cellStyle}>{day.jewish_month_name || 'N/A'}</td>
              <td style={cellStyle}>{day.jewish_day || 'N/A'}</td>
              <td style={cellStyle}>{day.day_of_week !== null ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.day_of_week - 1] : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 'clamp(24px, 5vw, 30px)', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Special Days & Holidays (3 fields + 8 flags)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Significant Day</th>
            <th style={headerStyle}>Omer</th>
            <th style={headerStyle}>Chanukah</th>
            <th style={headerStyle}>R.C.</th>
            <th style={headerStyle}>Y.T.</th>
            <th style={headerStyle}>C.H.</th>
            <th style={headerStyle}>Erev Y.T.</th>
            <th style={headerStyle}>Chan.</th>
            <th style={headerStyle}>Taanis</th>
            <th style={headerStyle}>Assur</th>
            <th style={headerStyle}>Erev R.C.</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{day.significant_day || '-'}</td>
              <td style={cellStyle}>{day.day_of_omer || '-'}</td>
              <td style={cellStyle}>{day.day_of_chanukah || '-'}</td>
              <td style={cellStyle}>{day.is_rosh_chodesh ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_yom_tov ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_chol_hamoed ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_erev_yom_tov ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_chanukah ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_taanis ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_assur_bemelacha ? '✓' : ''}</td>
              <td style={cellStyle}>{day.is_erev_rosh_chodesh ? '✓' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: 'clamp(24px, 5vw, 30px)', marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Molad & Kiddush Levana (4 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Molad</th>
            <th style={headerStyle}>KL Earliest (3 days)</th>
            <th style={headerStyle}>KL Earliest (7 days)</th>
            <th style={headerStyle}>KL Latest (15 days)</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{formatDateTime(day.molad_datetime)}</td>
              <td style={cellStyle}>{formatDateTime(day.kiddush_levana_earliest_3_days)}</td>
              <td style={cellStyle}>{formatDateTime(day.kiddush_levana_earliest_7_days)}</td>
              <td style={cellStyle}>{formatDateTime(day.kiddush_levana_latest_15_days)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLimudimTab = () => (
    <div style={{ overflowX: 'auto' }}>
      <h3 style={{ marginBottom: 'clamp(8px, 2vw, 10px)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)' }}>Learning Schedules (8 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#dbeafe' }}>
            <th style={headerStyle}>Date</th>
            <th style={headerStyle}>Parsha</th>
            <th style={headerStyle}>Daf Yomi Bavli</th>
            <th style={headerStyle}>Daf Yomi Yerushalmi</th>
            <th style={headerStyle}>Mishna Yomis</th>
            <th style={headerStyle}>Tehillim Monthly</th>
            <th style={headerStyle}>Pirkei Avos</th>
            <th style={headerStyle}>Daf HaShavua Bavli</th>
            <th style={headerStyle}>Amud Yomi Bavli Dirshu</th>
          </tr>
        </thead>
        <tbody>
          {zmanimData.map((day, index) => (
            <tr key={day.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9' }}>
              <td style={cellStyle}><strong>{day.date}</strong></td>
              <td style={cellStyle}>{day.parsha || 'N/A'}</td>
              <td style={cellStyle}>{day.daf_yomi_bavli || 'N/A'}</td>
              <td style={cellStyle}>{day.daf_yomi_yerushalmi || 'N/A'}</td>
              <td style={cellStyle}>{day.mishna_yomis || 'N/A'}</td>
              <td style={cellStyle}>{day.tehillim_monthly || 'N/A'}</td>
              <td style={cellStyle}>{day.pirkei_avos || 'N/A'}</td>
              <td style={cellStyle}>{day.daf_hashavua_bavli || 'N/A'}</td>
              <td style={cellStyle}>{day.amud_yomi_bavli_dirshu || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const pageStyles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      background: 'linear-gradient(to right, #ffffff 0%, #f8fafc 100%)',
      color: '#1e293b',
      padding: 'clamp(24px, 4vw, 32px) clamp(16px, 4vw, 40px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      marginBottom: '0',
      borderBottom: '1px solid #e2e8f0'
    },
    headerTitle: {
      margin: '0',
      fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
      fontWeight: '600',
      letterSpacing: '-0.3px',
      color: '#0f172a'
    },
    contentWrapper: {
      maxWidth: '100%',
      margin: '0 auto',
      padding: 'clamp(20px, 4vw, 40px)',
      overflow: 'auto'
    }
  };

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.header}>
        <h1 style={pageStyles.headerTitle}>Future Zmanim - All Fields</h1>
      </div>

      <div style={pageStyles.contentWrapper}>
      <div style={{ marginBottom: 'clamp(16px, 3vw, 20px)', display: 'flex', gap: 'clamp(10px, 2vw, 15px)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 15px)', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)', fontSize: 'clamp(13px, 2.5vw, 14px)', fontWeight: '500' }}>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 10px)', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: 'clamp(13px, 2.5vw, 14px)' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)', fontSize: 'clamp(13px, 2.5vw, 14px)', fontWeight: '500' }}>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ padding: 'clamp(6px, 1.5vw, 8px) clamp(8px, 2vw, 10px)', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: 'clamp(13px, 2.5vw, 14px)' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px, 1.5vw, 8px)' }}>
          <button
            onClick={handleExtendZmanim}
            disabled={extending}
            style={{
              padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 16px)',
              backgroundColor: extending ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: 'clamp(13px, 2.5vw, 14px)',
              fontWeight: '600',
              cursor: extending ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              if (!extending) e.target.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              if (!extending) e.target.style.backgroundColor = '#10b981';
            }}
          >
            {extending ? 'Calculating...' : 'Calculate Zmanim'}
          </button>
          <div
            style={{
              position: 'relative',
              display: 'inline-block'
            }}
            title="Ensures you have 6 months of zmanim data. Use this if the automated weekly calculations haven't been running or if you're missing future dates."
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'clamp(18px, 4vw, 20px)',
              height: 'clamp(18px, 4vw, 20px)',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontSize: 'clamp(11px, 2.5vw, 12px)',
              fontWeight: 'bold',
              cursor: 'help',
              userSelect: 'none'
            }}>
              i
            </span>
          </div>
        </div>
      </div>

      {extendMessage && (
        <div style={{
          padding: 'clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px)',
          marginBottom: 'clamp(16px, 3vw, 20px)',
          backgroundColor: extendMessage.includes('Error') ? '#fee2e2' : '#d1fae5',
          color: extendMessage.includes('Error') ? '#991b1b' : '#065f46',
          borderRadius: '6px',
          fontSize: 'clamp(13px, 2.5vw, 14px)',
          fontWeight: '500',
          border: `1px solid ${extendMessage.includes('Error') ? '#fecaca' : '#a7f3d0'}`
        }}>
          {extendMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ marginBottom: 'clamp(16px, 3vw, 20px)', borderBottom: '2px solid #ddd', display: 'flex', flexWrap: 'wrap', gap: 'clamp(4px, 1vw, 5px)' }}>
        <button
          onClick={() => setActiveTab('zmanim')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'zmanim' ? '#3b82f6' : '#f0f0f0',
            color: activeTab === 'zmanim' ? 'white' : 'black',
          }}
        >
          Basic Zmanim (14)
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'additional' ? '#3b82f6' : '#f0f0f0',
            color: activeTab === 'additional' ? 'white' : 'black',
          }}
        >
          Additional Zmanim (15)
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'calendar' ? '#3b82f6' : '#f0f0f0',
            color: activeTab === 'calendar' ? 'white' : 'black',
          }}
        >
          Jewish Calendar (20)
        </button>
        <button
          onClick={() => setActiveTab('limudim')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'limudim' ? '#3b82f6' : '#f0f0f0',
            color: activeTab === 'limudim' ? 'white' : 'black',
          }}
        >
          Limudim (8)
        </button>
      </div>

      {loading && <p>Loading zmanim data...</p>}

      {error && (
        <div style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && zmanimData.length === 0 && (
        <p>No zmanim data found for this date range.</p>
      )}

      {!loading && !error && zmanimData.length > 0 && (
        <div>
          <p style={{ marginBottom: 'clamp(16px, 3vw, 20px)', fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 16px)' }}>
            Showing {zmanimData.length} days of complete zmanim data (64 fields per day)
          </p>

          {activeTab === 'zmanim' && renderBasicZmanimTab()}
          {activeTab === 'additional' && renderAdditionalZmanimTab()}
          {activeTab === 'calendar' && renderJewishCalendarTab()}
          {activeTab === 'limudim' && renderLimudimTab()}
        </div>
      )}
      </div>
    </div>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 'clamp(10px, 2vw, 11px)',
  border: '1px solid #ddd',
  marginBottom: 'clamp(16px, 3vw, 20px)',
};

const headerStyle = {
  padding: 'clamp(6px, 1.5vw, 8px)',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontWeight: 'bold',
  position: 'sticky',
  top: 0,
  whiteSpace: 'nowrap',
};

const cellStyle = {
  padding: 'clamp(5px, 1.2vw, 6px) clamp(6px, 1.5vw, 8px)',
  borderRight: '1px solid #eee',
  whiteSpace: 'nowrap',
};

const tabButtonStyle = {
  padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 20px)',
  border: 'none',
  cursor: 'pointer',
  fontSize: 'clamp(12px, 2.5vw, 14px)',
  fontWeight: 'bold',
  borderRadius: '4px 4px 0 0',
  transition: 'all 0.3s',
};

export default ZmanimDebug;
