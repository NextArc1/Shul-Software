import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';

const CustomText = ({ onCustomTextCreated, editingCustomText, onCancelEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [textType, setTextType] = useState('text');
  const [textContent, setTextContent] = useState('');
  const [fontSize, setFontSize] = useState('');
  const [fontColor, setFontColor] = useState('#ffc764');
  const [textAlign, setTextAlign] = useState('left');
  const [lineThickness, setLineThickness] = useState('40');
  const [errors, setErrors] = useState({});

  // Clear form function
  const clearForm = () => {
    setName('');
    setDescription('');
    setTextType('text');
    setTextContent('');
    setFontSize('');
    setFontColor('#ffc764');
    setTextAlign('left');
    setLineThickness('40');
    setErrors({});
  };

  // Populate form when editing
  useEffect(() => {
    if (editingCustomText) {
      setName(editingCustomText.display_name || editingCustomText.internal_name);
      setDescription(editingCustomText.description || '');
      setTextType(editingCustomText.text_type);
      setTextContent(editingCustomText.text_content || '');
      setFontSize(editingCustomText.font_size || '');
      setFontColor(editingCustomText.font_color || '#ffc764');
      setTextAlign(editingCustomText.text_align || 'left');
      setLineThickness(editingCustomText.line_thickness || '40');
    } else {
      clearForm();
    }
  }, [editingCustomText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const data = {
      internal_name: name,
      display_name: name,
      description: description,
      text_type: textType,
      text_content: textType === 'text' ? textContent : '',
      font_size: fontSize ? parseInt(fontSize) : null,
      font_color: fontColor || '',
      text_align: textAlign || 'left',
      line_thickness: textType === 'line_space' ? parseInt(lineThickness) : null,
    };

    try {
      let result;
      if (editingCustomText) {
        result = await api.put(`/custom-texts/${editingCustomText.id}/`, data);
      } else {
        result = await api.post('/custom-texts/', data);
      }

      console.log(`Custom text ${editingCustomText ? 'updated' : 'created'}:`, result);

      if (onCustomTextCreated) {
        onCustomTextCreated(result);
      }

      clearForm();
    } catch (error) {
      console.error(`Error ${editingCustomText ? 'updating' : 'creating'} custom text:`, error);

      if (error.errors) {
        setErrors(error.errors);
        console.log('Validation errors:', error.errors);
      } else if (error.response && error.response.data) {
        setErrors(error.response.data);
        console.log('Validation errors:', error.response.data);
      } else {
        alert(`Error ${editingCustomText ? 'updating' : 'creating'} custom text: ` + (error.message || 'Unknown error'));
      }
    }
  };

  return (
    <div>
      {/* Info section explaining Custom Text Components */}
      <div style={{
        padding: '20px',
        backgroundColor: '#e8f5e9',
        border: '2px solid #27ae60',
        borderRadius: '12px',
        marginBottom: '25px',
        maxWidth: '600px'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '12px', color: '#2c3e50', fontSize: '20px' }}>
          ℹ️ How Custom Components Work
        </h3>
        <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#34495e' }}>
          <p style={{ marginTop: 0 }}>
            <strong>Custom Components</strong> let you add flexible content to your display beyond times and zmanim.
          </p>
          <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
            <li style={{ marginBottom: '6px' }}>
              <strong>📝 Text:</strong> Display custom messages (e.g., "Rabbi's Office Hours", announcements, shiurim)
              <ul style={{ marginTop: '4px', paddingLeft: '18px' }}>
                <li style={{ fontSize: '13px', marginBottom: '3px' }}>Customize font size, color, and alignment</li>
                <li style={{ fontSize: '13px' }}>Works great for notes, instructions, or special announcements</li>
              </ul>
            </li>
            <li style={{ marginBottom: '6px' }}>
              <strong>➖ Divider:</strong> Add a horizontal line to separate sections visually
            </li>
            <li>
              <strong>⬜ Line Space:</strong> Insert empty space to control layout spacing (adjustable height)
            </li>
          </ul>
        </div>
      </div>

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
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Component Type:</label>
          <div style={{ position: 'relative' }}>
            <select
              value={textType}
              onChange={(e) => setTextType(e.target.value)}
              style={{
                padding: '10px 35px 10px 12px',
                width: '100%',
                fontSize: '15px',
                border: '2px solid #3b82f6',
                borderRadius: '8px',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                appearance: 'none',
                fontWeight: '500',
                color: '#2c3e50',
                backgroundImage: 'none',
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#2563eb';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="text">📝 Text - Display custom content</option>
              <option value="divider">➖ Divider - Add a line separator</option>
              <option value="line_space">⬜ Line Space - Add empty space</option>
            </select>
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '18px',
              color: '#3b82f6',
              fontWeight: 'bold'
            }}>
              ▼
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '6px', fontStyle: 'italic' }}>
            Choose what type of component you want to add to your display
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', border: (errors.internal_name || errors.display_name) ? '2px solid red' : '1px solid #ccc' }}
            placeholder="e.g., Rabbi's Office Hours"
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
            For your reference only (not shown on display)
          </div>
          {(errors.internal_name || errors.display_name) && (
            <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>
              {errors.internal_name || errors.display_name}
            </div>
          )}
        </div>

        {textType === 'text' && (
          <>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Text Content:</label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                required
                rows={3}
                style={{ width: '100%', padding: '8px', border: errors.text_content ? '2px solid red' : '1px solid #ccc' }}
                placeholder="Enter the text to display..."
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                The actual text content that will be shown
              </div>
              {errors.text_content && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.text_content}</div>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Font Size (optional):</label>
              <input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                min="8"
                max="200"
                style={{ width: '100%', padding: '8px', border: errors.font_size ? '2px solid red' : '1px solid #ccc' }}
                placeholder="Leave empty to inherit from box (e.g., 18-22)"
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                Font size in pixels (8-200). Leave empty to use default box size.
              </div>
              {errors.font_size && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.font_size}</div>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Font Color (optional):</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  style={{ width: '60px', height: '40px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  style={{ flex: 1, padding: '8px', border: errors.font_color ? '2px solid red' : '1px solid #ccc' }}
                  placeholder="#ffc764"
                />
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                Hex color code. Leave empty to use default display color.
              </div>
              {errors.font_color && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.font_color}</div>}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Text Alignment:</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={textAlign}
                  onChange={(e) => setTextAlign(e.target.value)}
                  style={{
                    padding: '10px 35px 10px 12px',
                    width: '100%',
                    fontSize: '15px',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    appearance: 'none',
                    fontWeight: '500',
                    color: '#2c3e50',
                    backgroundImage: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="left">◀ Left</option>
                  <option value="center">▣ Center</option>
                  <option value="right">▶ Right</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '18px',
                  color: '#3b82f6',
                  fontWeight: 'bold'
                }}>
                  ▼
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
                Choose how the text should be aligned horizontally
              </div>
              {errors.text_align && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.text_align}</div>}
            </div>
          </>
        )}

        {textType === 'divider' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Divider Color (optional):</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                style={{ width: '60px', height: '40px', cursor: 'pointer' }}
              />
              <input
                type="text"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                style={{ flex: 1, padding: '8px', border: errors.font_color ? '2px solid red' : '1px solid #ccc' }}
                placeholder="#ffc764 or rgba(251, 191, 36, 0.3)"
              />
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
              Color for the divider line. Leave empty to use default amber color.
            </div>
            {errors.font_color && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.font_color}</div>}
          </div>
        )}

        {textType === 'line_space' && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Line Thickness (height in pixels):</label>
            <input
              type="number"
              value={lineThickness}
              onChange={(e) => setLineThickness(e.target.value)}
              min="1"
              max="200"
              style={{ width: '100%', padding: '8px', border: errors.line_thickness ? '2px solid red' : '1px solid #ccc' }}
              placeholder="40"
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
              Height of the empty space in pixels (1-200). Default is 40px.
            </div>
            {errors.line_thickness && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.line_thickness}</div>}
          </div>
        )}

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Description (Optional):</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc' }}
            placeholder="Add notes about this custom text..."
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '3px' }}>
            Internal notes to help you remember the purpose
          </div>
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
              backgroundColor: editingCustomText ? '#3498db' : '#27ae60',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = editingCustomText ? '#2980b9' : '#229954';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = editingCustomText ? '#3498db' : '#27ae60';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            }}
          >
            {editingCustomText ? '✓ Update Component' : '+ Create Component'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomText;
