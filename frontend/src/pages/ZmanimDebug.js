import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000/api';

function ZmanimDebug() {
  const [zmanimData, setZmanimData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState('zmanim');

  useEffect(() => {
    // Set default date range (today to 6 months from now)
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(sixMonthsLater.toISOString().split('T')[0]);
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
      <h3 style={{ marginBottom: '10px' }}>Basic Zmanim Times (14 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#e3f2fd' }}>
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
      <h3 style={{ marginBottom: '10px' }}>Additional Zmanim (12 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#fff3e0' }}>
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

      <h3 style={{ marginTop: '30px', marginBottom: '10px' }}>Halachic Hours (3 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#fff3e0' }}>
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
      <h3 style={{ marginBottom: '10px' }}>Jewish Date Info (5 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#e8f5e9' }}>
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

      <h3 style={{ marginTop: '30px', marginBottom: '10px' }}>Special Days & Holidays (3 fields + 8 flags)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#e8f5e9' }}>
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

      <h3 style={{ marginTop: '30px', marginBottom: '10px' }}>Molad & Kiddush Levana (4 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#e8f5e9' }}>
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
      <h3 style={{ marginBottom: '10px' }}>Learning Schedules (8 fields)</h3>
      <table style={tableStyle}>
        <thead>
          <tr style={{ backgroundColor: '#f3e5f5' }}>
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

  return (
    <div style={{ padding: '20px', maxWidth: '100%', overflow: 'auto' }}>
      <h1>Zmanim Debug - ALL Fields (64 total!)</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>

        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>

        <button onClick={fetchZmanimRange} style={{ padding: '5px 15px' }}>
          Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('zmanim')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'zmanim' ? '#2196F3' : '#f0f0f0',
            color: activeTab === 'zmanim' ? 'white' : 'black',
          }}
        >
          Basic Zmanim (14)
        </button>
        <button
          onClick={() => setActiveTab('additional')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'additional' ? '#FF9800' : '#f0f0f0',
            color: activeTab === 'additional' ? 'white' : 'black',
          }}
        >
          Additional Zmanim (15)
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'calendar' ? '#4CAF50' : '#f0f0f0',
            color: activeTab === 'calendar' ? 'white' : 'black',
          }}
        >
          Jewish Calendar (20)
        </button>
        <button
          onClick={() => setActiveTab('limudim')}
          style={{
            ...tabButtonStyle,
            backgroundColor: activeTab === 'limudim' ? '#9C27B0' : '#f0f0f0',
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
          <p style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '16px' }}>
            📊 Showing {zmanimData.length} days of complete zmanim data (64 fields per day)
          </p>

          {activeTab === 'zmanim' && renderBasicZmanimTab()}
          {activeTab === 'additional' && renderAdditionalZmanimTab()}
          {activeTab === 'calendar' && renderJewishCalendarTab()}
          {activeTab === 'limudim' && renderLimudimTab()}
        </div>
      )}
    </div>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '11px',
  border: '1px solid #ddd',
  marginBottom: '20px',
};

const headerStyle = {
  padding: '8px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontWeight: 'bold',
  position: 'sticky',
  top: 0,
  whiteSpace: 'nowrap',
};

const cellStyle = {
  padding: '6px 8px',
  borderRight: '1px solid #eee',
  whiteSpace: 'nowrap',
};

const tabButtonStyle = {
  padding: '10px 20px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 'bold',
  marginRight: '5px',
  borderRadius: '4px 4px 0 0',
  transition: 'all 0.3s',
};

export default ZmanimDebug;
