import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const CustomTimes = ({ onCustomTimeCreated, editingCustomTime, onCancelEdit }) => {
  const [internalName, setInternalName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [timeType, setTimeType] = useState('fixed');
  const [fixedTime, setFixedTime] = useState('');
  const [baseTime, setBaseTime] = useState('');
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  const [calculationMode, setCalculationMode] = useState('daily');
  const [targetWeekday, setTargetWeekday] = useState('');
  const [specificDate, setSpecificDate] = useState('');
  const [daily, setDaily] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [availableZmanim, setAvailableZmanim] = useState([]);
  const [errors, setErrors] = useState({});

  // Clear form function
  const clearForm = () => {
    setInternalName('');
    setDisplayName('');
    setDescription('');
    setTimeType('fixed');
    setFixedTime('');
    setBaseTime('');
    setOffsetMinutes(0);
    setCalculationMode('daily');
    setTargetWeekday('');
    setSpecificDate('');
    setDaily(false);
    setDaysOfWeek([]);
    setErrors({});
  };

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
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editingCustomTime) {
      setInternalName(editingCustomTime.internal_name);
      setDisplayName(editingCustomTime.display_name);
      setDescription(editingCustomTime.description || '');
      setTimeType(editingCustomTime.time_type);
      setFixedTime(editingCustomTime.fixed_time || '');
      setBaseTime(editingCustomTime.base_time || '');
      setOffsetMinutes(editingCustomTime.offset_minutes || 0);
      setCalculationMode(editingCustomTime.calculation_mode || 'daily');
      setTargetWeekday(editingCustomTime.target_weekday !== null && editingCustomTime.target_weekday !== undefined ? editingCustomTime.target_weekday : '');
      setSpecificDate(editingCustomTime.specific_date || '');
      setDaily(editingCustomTime.daily);
      // Handle both new (days_of_week) and legacy (day_of_week) formats
      if (editingCustomTime.days_of_week && editingCustomTime.days_of_week.length > 0) {
        setDaysOfWeek(editingCustomTime.days_of_week);
      } else if (editingCustomTime.day_of_week !== null && editingCustomTime.day_of_week !== undefined) {
        setDaysOfWeek([editingCustomTime.day_of_week]);
      } else {
        setDaysOfWeek([]);
      }
    } else {
      // Clear form when not editing
      clearForm();
    }
  }, [editingCustomTime]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    const data = {
      internal_name: internalName,
      display_name: displayName,
      description: description,
      time_type: timeType,
      fixed_time: timeType === 'fixed' ? fixedTime : null,
      base_time: timeType === 'dynamic' ? baseTime : null,
      offset_minutes: timeType === 'dynamic' ? offsetMinutes : 0,
      calculation_mode: calculationMode,
      target_weekday: calculationMode === 'weekly_target' ? (targetWeekday !== '' ? parseInt(targetWeekday) : null) : null,
      specific_date: calculationMode === 'specific_date' ? specificDate : null,
      daily: daily,
      days_of_week: daily ? [] : daysOfWeek,
    };

    try {
      let result;
      if (editingCustomTime) {
        // Update existing custom time
        result = await api.put(`/custom-times/${editingCustomTime.id}/`, data);
      } else {
        // Create new custom time
        result = await api.post('/custom-times/', data);
      }

      console.log(`Custom time ${editingCustomTime ? 'updated' : 'created'}:`, result);

      if (onCustomTimeCreated) {
        onCustomTimeCreated(result);
      }

      // Clear form fields after successful submission
      clearForm();
    } catch (error) {
      console.error(`Error ${editingCustomTime ? 'updating' : 'creating'} custom time:`, error);

      // Handle validation errors from backend
      if (error.errors) {
        // Error from our API wrapper
        setErrors(error.errors);
        console.log('Validation errors:', error.errors);
      } else if (error.response && error.response.data) {
        // Direct error response
        setErrors(error.response.data);
        console.log('Validation errors:', error.response.data);
      } else {
        alert(`Error ${editingCustomTime ? 'updating' : 'creating'} custom time: ` + (error.message || 'Unknown error'));
      }
    }
  };

  const handleDayToggle = (day) => {
    if (daysOfWeek.includes(day)) {
      setDaysOfWeek(daysOfWeek.filter(d => d !== day));
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  return (
    <div>
      {/* Form for create/edit */}
      <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
        {/* General error display */}
        {Object.keys(errors).length > 0 && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '6px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>Please fix the following errors:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              {Object.entries(errors).map(([field, messages]) => (
                <li key={field}>
                  <strong>{field.replace(/_/g, ' ')}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Internal Name:</label>
          <input
            type="text"
            value={internalName}
            onChange={(e) => setInternalName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: errors.internal_name ? '2px solid red' : '1px solid #ccc' }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
            Use lowercase letters, numbers, underscores, or hyphens. No spaces. (e.g., "mincha_friday")
          </div>
          {errors.internal_name && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.internal_name}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Display Name:</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: errors.display_name ? '2px solid red' : '1px solid #ccc' }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
            This is how it will appear on the display
          </div>
          {errors.display_name && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.display_name}</div>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description (Optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            placeholder="Add notes about this custom time..."
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
            Internal notes to help you remember the purpose of this time
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Time Type:</label>
          <select value={timeType} onChange={(e) => setTimeType(e.target.value)} style={{ padding: '8px' }}>
            <option value="fixed">Fixed Time</option>
            <option value="dynamic">Dynamic Time</option>
          </select>
        </div>

        {timeType === 'fixed' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Fixed Time:</label>
            <input
              type="time"
              value={fixedTime}
              onChange={(e) => setFixedTime(e.target.value)}
              required
              style={{ padding: '8px', border: errors.fixed_time ? '2px solid red' : '1px solid #ccc' }}
            />
            {errors.fixed_time && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.fixed_time}</div>}
          </div>
        )}

        {timeType === 'dynamic' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Base Time:</label>
            <select value={baseTime} onChange={(e) => setBaseTime(e.target.value)} required style={{ width: '100%', padding: '8px', border: errors.base_time ? '2px solid red' : '1px solid #ccc' }}>
              <option value="">Select Base Time</option>
              {availableZmanim.map((zman) => (
                <option key={zman.internalKey} value={zman.internalKey}>
                  {zman.displayName}
                </option>
              ))}
            </select>
            {errors.base_time && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.base_time}</div>}

            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Offset (minutes):</label>
              <input
                type="number"
                value={offsetMinutes}
                onChange={(e) => setOffsetMinutes(parseInt(e.target.value) || 0)}
                style={{ padding: '8px' }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                Positive for after, negative for before (e.g., -15 for 15 minutes before)
              </div>
            </div>
          </div>
        )}

        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px'
        }}>
          <h4 style={{ marginTop: 0, marginBottom: '15px', color: '#495057' }}>Calculation Settings</h4>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Calculation Mode:</label>
            <select
              value={calculationMode}
              onChange={(e) => {
                setCalculationMode(e.target.value);
                // Clear mode-specific fields when switching
                setTargetWeekday('');
                setSpecificDate('');
              }}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            >
              <option value="daily">Daily (each day's own calculation)</option>
              <option value="weekly_target">Weekly Target Day (show specific weekday's time)</option>
              <option value="specific_date">Specific Calendar Date (show one date's time)</option>
            </select>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              {calculationMode === 'daily' && 'Uses each day\'s own zmanim for calculation'}
              {calculationMode === 'weekly_target' && 'Shows a specific weekday\'s time throughout the week (e.g., always show Friday\'s Mincha)'}
              {calculationMode === 'specific_date' && 'Shows a specific date\'s time until manually deleted (e.g., Yom Tov schedule)'}
            </div>
          </div>

          {calculationMode === 'weekly_target' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Target Weekday:</label>
              <select
                value={targetWeekday}
                onChange={(e) => setTargetWeekday(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: errors.target_weekday ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Target Weekday</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
              </select>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                Which day of the week to calculate the time from
              </div>
              {errors.target_weekday && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.target_weekday}</div>}
            </div>
          )}

          {calculationMode === 'specific_date' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Specific Date:</label>
              <input
                type="date"
                value={specificDate}
                onChange={(e) => setSpecificDate(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', border: errors.specific_date ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                The exact date to calculate the time from (e.g., first day of Sukkos)
              </div>
              {errors.specific_date && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.specific_date}</div>}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Display on:</label>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Choose which days to show this time on the display screen
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={daily}
                onChange={(e) => {
                  setDaily(e.target.checked);
                  if (e.target.checked) {
                    setDaysOfWeek([]);
                  }
                }}
                style={{ marginRight: '8px' }}
              />
              <span>Every day</span>
            </label>
          </div>

          {!daily && (
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Specific days:</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '10px' }}>
                {[
                  { value: 0, label: 'Sunday' },
                  { value: 1, label: 'Monday' },
                  { value: 2, label: 'Tuesday' },
                  { value: 3, label: 'Wednesday' },
                  { value: 4, label: 'Thursday' },
                  { value: 5, label: 'Friday' },
                  { value: 6, label: 'Saturday' }
                ].map(day => (
                  <label key={day.value} style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={daysOfWeek.includes(day.value)}
                      onChange={() => handleDayToggle(day.value)}
                      style={{ marginRight: '8px' }}
                    />
                    <span>{day.label}</span>
                  </label>
                ))}
              </div>
              {errors.days_of_week && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.days_of_week}</div>}
            </div>
          )}
        </div>

        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #e1e8ed',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            type="button"
            onClick={onCancelEdit}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: '500',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 32px',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: editingCustomTime ? '#3498db' : '#27ae60',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = editingCustomTime ? '#2980b9' : '#229954';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = editingCustomTime ? '#3498db' : '#27ae60';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {editingCustomTime ? '✓ Update Custom Time' : '+ Create Custom Time'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomTimes;
