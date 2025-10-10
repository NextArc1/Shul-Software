import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const CustomTimes = ({ onCustomTimeCreated }) => {
  const [internalName, setInternalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [timeType, setTimeType] = useState('fixed');
  const [fixedTime, setFixedTime] = useState('');
  const [baseTime, setBaseTime] = useState('');
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [daily, setDaily] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [availableZmanim, setAvailableZmanim] = useState([]);
  const [existingCustomTimes, setExistingCustomTimes] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all available fields from DailyZmanim
  useEffect(() => {
    api.get('/zmanim/available-fields/')
      .then(data => {
        // Convert object to array of {internalKey, displayName}
        const fieldsArray = Object.entries(data).map(([internalKey, displayName]) => ({
          internalKey,
          displayName
        }));
        setAvailableZmanim(fieldsArray);
      })
      .catch(error => {
        console.error('Error fetching available fields:', error);
      });

    fetchExistingCustomTimes();
  }, []);

  // Fetch existing custom times
  const fetchExistingCustomTimes = () => {
    api.get('/custom-times/')
      .then(data => {
        setExistingCustomTimes(data.custom_times || data || []);
      })
      .catch(error => {
        console.error('Error fetching existing custom times:', error);
      });
  };

  // Edit custom time
  const handleEdit = (customTime) => {
    setEditingId(customTime.id);
    setInternalName(customTime.internal_name);
    setDisplayName(customTime.display_name);
    setTimeType(customTime.time_type);
    setFixedTime(customTime.fixed_time || '');
    setBaseTime(customTime.base_time || '');
    setOffsetMinutes(customTime.offset_minutes || 0);
    setDaily(customTime.daily);
    setDayOfWeek(customTime.day_of_week);
  };

  // Delete custom time
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this custom time?')) {
      return;
    }

    try {
      await api.delete(`/custom-times/${id}/`);
      fetchExistingCustomTimes();
      if (onCustomTimeCreated) {
        onCustomTimeCreated(); // Trigger refresh in parent
      }
    } catch (error) {
      console.error('Error deleting custom time:', error);
      alert('Error deleting custom time: ' + (error.message || 'Unknown error'));
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setInternalName('');
    setDisplayName('');
    setTimeType('fixed');
    setFixedTime('');
    setBaseTime('');
    setOffsetMinutes(0);
    setDaily(false);
    setDayOfWeek(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      internal_name: internalName,
      display_name: displayName,
      time_type: timeType,
      fixed_time: timeType === 'fixed' ? fixedTime : null,
      base_time: timeType === 'dynamic' ? baseTime : null,
      offset_minutes: timeType === 'dynamic' ? offsetMinutes : 0,
      daily: daily,
      day_of_week: daily ? null : dayOfWeek,
    };

    try {
      let result;
      if (editingId) {
        // Update existing custom time
        result = await api.put(`/custom-times/${editingId}/`, data);
      } else {
        // Create new custom time
        result = await api.post('/custom-times/', data);
      }

      console.log(`Custom time ${editingId ? 'updated' : 'created'}:`, result);

      // Refresh the list
      fetchExistingCustomTimes();

      if (onCustomTimeCreated) {
        onCustomTimeCreated(result);
      }

      // Clear form fields after successful submission
      handleCancelEdit();
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'creating'} custom time:`, error);
      alert(`Error ${editingId ? 'updating' : 'creating'} custom time: ` + (error.message || 'Unknown error'));
    }
  };

  return (
    <div>
      {/* List of existing custom times */}
      {existingCustomTimes.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Existing Custom Times</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {existingCustomTimes.map((ct) => (
              <div key={ct.id} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{ct.display_name}</strong> ({ct.internal_name})
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {ct.time_type === 'fixed' ? `Fixed: ${ct.fixed_time}` : `Dynamic: ${ct.base_time} + ${ct.offset_minutes} min`}
                      {' '} - {ct.daily ? 'Daily' : `Day ${ct.day_of_week}`}
                    </div>
                  </div>
                  <div>
                    <button type="button" onClick={() => handleEdit(ct)} style={{ marginRight: '5px' }}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(ct.id)} style={{ backgroundColor: '#dc3545', color: 'white' }}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form for create/edit */}
      <form onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit Custom Time' : 'Create Custom Time'}</h2>
      <div>
        <label>Internal Name:</label>
        <input
          type="text"
          value={internalName}
          onChange={(e) => setInternalName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Display Name:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Time Type:</label>
        <select value={timeType} onChange={(e) => setTimeType(e.target.value)}>
          <option value="fixed">Fixed Time</option>
          <option value="dynamic">Dynamic Time</option>
        </select>
      </div>
      {timeType === 'fixed' && (
        <div>
          <label>Fixed Time:</label>
          <input
            type="time"
            value={fixedTime}
            onChange={(e) => setFixedTime(e.target.value)}
            required
          />
        </div>
      )}
      {timeType === 'dynamic' && (
        <div>
          <label>Base Time:</label>
          <select value={baseTime} onChange={(e) => setBaseTime(e.target.value)} required>
            <option value="">Select Base Time</option>
            {availableZmanim.map((zman) => (
              <option key={zman.internalKey} value={zman.internalKey}>
                {zman.displayName}
              </option>
            ))}
          </select>
          <div>
            <label>Offset (minutes):</label>
            <input
              type="number"
              value={offsetMinutes}
              onChange={(e) => setOffsetMinutes(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      )}
      <div>
        <label>Apply to:</label>
        <div>
          <input
            type="checkbox"
            checked={daily}
            onChange={(e) => {
              setDaily(e.target.checked);
              if (e.target.checked) {
                setDayOfWeek(null);
              }
            }}
          />
          <label>Daily</label>
        </div>
        {!daily && (
          <div>
            <label>Day of Week:</label>
            <select
                value={dayOfWeek !== null ? dayOfWeek : ''}
                onChange={(e) => setDayOfWeek(e.target.value !== '' ? parseInt(e.target.value) : null)}
            >

              <option value="">Select Day</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
        )}
      </div>
      <button type="submit">{editingId ? 'Update Custom Time' : 'Create Custom Time'}</button>
      {editingId && (
        <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      )}
    </form>
    </div>
  );
};

export default CustomTimes;
