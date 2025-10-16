import React, { useState, useEffect } from 'react';
import { ReactSortable } from "react-sortablejs";
import ZmanimUpdater from '../components/ZmanimUpdater';
import CustomTimes from '../components/CustomTimes';
import CustomText from '../components/CustomText';
import { api } from '../utils/api';

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    background: 'linear-gradient(135deg, #162A45 0%, #1e3a5f 100%)',
    color: 'white',
    padding: '30px 40px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  headerTitle: {
    margin: '0 0 10px 0',
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '-0.5px'
  },
  contentWrapper: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px 40px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    marginTop: '40px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#7f8c8d',
    marginLeft: '10px',
    fontWeight: '400'
  },
  displayBoxesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  sourceBoxesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  box: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e1e8ed',
    minHeight: '200px',
    transition: 'all 0.3s ease',
  },
  boxHover: {
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
  },
  boxHeader: {
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #f0f0f0'
  },
  boxTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0'
  },
  boxTitleInput: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '16px',
    fontWeight: '600',
    border: '2px solid #d4af37',
    borderRadius: '8px',
    outline: 'none',
    color: '#2c3e50',
    transition: 'border-color 0.2s'
  },
  item: {
    backgroundColor: '#fafbfc',
    border: '1px solid #e1e8ed',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    cursor: 'move'
  },
  itemHover: {
    backgroundColor: '#f0f4f8',
    border: '1px solid #d4af37',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
  },
  itemContent: {
    flex: 1,
    minWidth: 0
  },
  itemName: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '14px',
    marginBottom: '2px'
  },
  itemInternalName: {
    fontSize: '11px',
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: '2px'
  },
  itemDetail: {
    fontSize: '12px',
    color: '#7f8c8d',
    marginTop: '4px'
  },
  dragHandle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    cursor: 'grab',
    userSelect: 'none'
  },
  dragIcon: {
    color: '#bdc3c7',
    fontSize: '16px',
    flexShrink: 0
  },
  buttonGroup: {
    display: 'flex',
    gap: '6px',
    marginLeft: '8px'
  },
  button: {
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px'
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  editButtonHover: {
    backgroundColor: '#2980b9',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white'
  },
  deleteButtonHover: {
    backgroundColor: '#c0392b',
    transform: 'translateY(-1px)',
    boxShadow: '0 2px 4px rgba(231, 76, 60, 0.3)'
  },
  removeButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    padding: '4px 8px',
    fontSize: '16px',
    lineHeight: '1'
  },
  removeButtonHover: {
    backgroundColor: '#7f8c8d'
  },
  updateButton: {
    backgroundColor: '#d4af37',
    color: 'white',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(212, 175, 55, 0.2)',
    display: 'inline-block'
  },
  message: {
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    marginBottom: '20px',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '30px 20px',
    color: '#95a5a6',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  customTimesCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e1e8ed',
    marginTop: '20px'
  },
  divider: {
    height: '1px',
    backgroundColor: '#e1e8ed',
    margin: '30px 0',
    border: 'none'
  },
  addButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(39, 174, 96, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px'
  },
  addButtonHover: {
    backgroundColor: '#229954',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(39, 174, 96, 0.3)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '0',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    position: 'relative'
  },
  modalHeader: {
    padding: '24px 30px',
    borderBottom: '1px solid #e1e8ed',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    borderRadius: '16px 16px 0 0',
    zIndex: 1
  },
  modalTitle: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50'
  },
  modalCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '28px',
    color: '#95a5a6',
    cursor: 'pointer',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    transition: 'all 0.2s ease'
  },
  modalCloseButtonHover: {
    backgroundColor: '#f5f7fa',
    color: '#2c3e50'
  },
  modalBody: {
    padding: '30px'
  }
};

const AddButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        ...styles.addButton,
        ...(isHovered ? styles.addButtonHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={{ fontSize: '18px' }}>+</span>
      Add Custom Time
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  const [closeHovered, setCloseHovered] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button
            onClick={onClose}
            style={{
              ...styles.modalCloseButton,
              ...(closeHovered ? styles.modalCloseButtonHover : {})
            }}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
          >
            ×
          </button>
        </div>
        <div style={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Box = ({ id, name, items, setItems, onNameChange, group, canEditName, onRemoveItem, renderItemActions, styling, onStylingChange }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [stylingExpanded, setStylingExpanded] = useState(false);

  const fontOptions = ['Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Verdana', 'Trebuchet MS', 'Impact', 'Palatino', 'Garamond', 'Helvetica'];

  // Determine if this box has title styling (box1 and box2)
  const hasTitleStyling = id === 'box1' || id === 'box2';

  return (
    <div
      style={{
        ...styles.box,
        ...(isHovered ? styles.boxHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Styling controls */}
      {canEditName && styling && (
        <div style={{
          marginBottom: '15px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          overflow: 'hidden'
        }}>
          {/* Toggle button */}
          <button
            type="button"
            onClick={() => setStylingExpanded(!stylingExpanded)}
            style={{
              width: '100%',
              padding: '10px 12px',
              backgroundColor: '#f9fafb',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f9fafb'}
          >
            <span>🎨 Customize Appearance</span>
            <span style={{ fontSize: '10px' }}>{stylingExpanded ? '▲' : '▼'}</span>
          </button>

          {/* Expanded styling panel */}
          {stylingExpanded && (
            <div style={{ padding: '16px', backgroundColor: '#ffffff' }}>
              {hasTitleStyling && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '10px',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Title Style
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <select
                        value={styling[`${id}_title_font`]}
                        onChange={(e) => onStylingChange(`${id}_title_font`, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          fontSize: '13px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                      </select>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="color"
                        value={styling[`${id}_title_color`]}
                        onChange={(e) => onStylingChange(`${id}_title_color`, e.target.value)}
                        style={{
                          width: '50px',
                          height: '38px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '10px',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Content Style
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <select
                      value={styling[`${id}_text_font`]}
                      onChange={(e) => onStylingChange(`${id}_text_font`, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        fontSize: '13px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                    </select>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="color"
                      value={styling[`${id}_text_color`]}
                      onChange={(e) => onStylingChange(`${id}_text_color`, e.target.value)}
                      style={{
                        width: '50px',
                        height: '38px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    />
                  </div>
                  <div style={{ width: '70px' }}>
                    <input
                      type="number"
                      value={styling[`${id}_text_size`]}
                      onChange={(e) => onStylingChange(`${id}_text_size`, parseInt(e.target.value))}
                      min="8"
                      max="72"
                      placeholder="Size"
                      style={{
                        width: '100%',
                        padding: '8px',
                        fontSize: '13px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        textAlign: 'center',
                        fontWeight: '500'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={styles.boxHeader}>
        {canEditName ? (
          <input
            value={name}
            onChange={(e) => onNameChange(id, e.target.value)}
            style={styles.boxTitleInput}
            placeholder="Box Name..."
          />
        ) : (
          <h3 style={styles.boxTitle}>{name}</h3>
        )}
      </div>
      <ReactSortable
        list={items}
        setList={(newState) => setItems(id, newState)}
        group={group}
        animation={200}
        handle=".handle"
        ghostClass="ghost-item"
      >
        {items.length === 0 ? (
          <div style={styles.emptyState}>
            {canEditName ? 'Drag items here' : 'No items available'}
          </div>
        ) : (
          items.map((item) => <Item key={item.id} item={item} onRemoveItem={onRemoveItem} boxId={id} renderItemActions={renderItemActions} />)
        )}
      </ReactSortable>
    </div>
  );
};

const Item = ({ item, onRemoveItem, boxId, renderItemActions }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(null);

  return (
    <div
      style={{
        ...styles.item,
        ...(isHovered ? styles.itemHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="handle" style={styles.dragHandle}>
        <span style={styles.dragIcon}>⋮⋮</span>
        <div style={styles.itemContent}>
          <div style={styles.itemName}>{item.name}</div>
          {item.internalName && <div style={styles.itemInternalName}>({item.internalName})</div>}
          {item.calculated_time && <div style={styles.itemDetail}>{item.calculated_time}</div>}
          {item.timeInfo && <div style={styles.itemDetail}>{item.timeInfo}</div>}
          {item.frequencyInfo && <div style={styles.itemDetail}>{item.frequencyInfo}</div>}
        </div>
      </div>
      <div style={styles.buttonGroup}>
        {renderItemActions && renderItemActions(item, buttonHovered, setButtonHovered)}
        {onRemoveItem && (
          <button
            type="button"
            onClick={() => onRemoveItem(boxId, item.id)}
            style={{
              ...styles.button,
              ...styles.removeButton,
              ...(buttonHovered === 'remove' ? styles.removeButtonHover : {})
            }}
            onMouseEnter={() => setButtonHovered('remove')}
            onMouseLeave={() => setButtonHovered(null)}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

const ZmanimSettings = () => {
  const [zmanim, setZmanim] = useState(null);
  const [limudim, setLimudim] = useState(null);
  const [jewishCalendar, setJewishCalendar] = useState(null);
  const [message, setMessage] = useState('');
  const [editingCustomTime, setEditingCustomTime] = useState(null);
  const [editingCustomText, setEditingCustomText] = useState(null);
  const [customTimesData, setCustomTimesData] = useState([]);
  const [customTextsData, setCustomTextsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('time'); // 'time' or 'text'
  const [boxes, setBoxes] = useState({
    box1: { internalName: 'box1', displayName: 'Shabbos Times', items: [] },
    box2: { internalName: 'box2', displayName: 'Weekday Times', items: [] },
    box3: { internalName: 'box3', displayName: 'Box 3', items: [] },
    box4: { internalName: 'box4', displayName: 'Box 4', items: [] },
    zmanimAndLimudim: { internalName: 'zmanimAndLimudim', displayName: 'Basic Zmanim', items: [] },
    limudimBox: { internalName: 'limudimBox', displayName: 'Limudim', items: [] },
    jewishCalendar: { internalName: 'jewishCalendar', displayName: 'Jewish Calendar', items: [] },
    customTimes: { internalName: 'customTimes', displayName: 'Custom', items: [] },
  });

  // Box styling state
  const [boxStyling, setBoxStyling] = useState({
    box1_title_font: 'Arial',
    box1_title_color: '#ffc764',
    box1_text_font: 'Arial',
    box1_text_color: '#ffc764',
    box1_text_size: 22,
    box2_title_font: 'Arial',
    box2_title_color: '#ffc764',
    box2_text_font: 'Arial',
    box2_text_color: '#ffc764',
    box2_text_size: 22,
    box3_text_font: 'Arial',
    box3_text_color: '#ffc764',
    box3_text_size: 18,
    box4_text_font: 'Arial',
    box4_text_color: '#ffc764',
    box4_text_size: 18,
  });

  // Load layout and styling from database on mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchZmanim();
      await loadLayoutFromDatabase();
      await loadBoxStyling();
      // Fetch custom times/texts after layout is loaded to avoid race condition
      await fetchCustomTimes();
      await fetchCustomTexts();
    };

    initializeData();
  }, []);

  // Load layout configuration from database
  const loadLayoutFromDatabase = async () => {
    try {
      const response = await api.get('/shul/display-layout/');
      // Backend returns {id, shul, layout_config, created_at, updated_at}
      if (response.layout_config && Object.keys(response.layout_config).length > 0) {
        setBoxes(response.layout_config);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      // If layout doesn't exist, it's okay - we'll use default
    }
  };

  // Load box styling from shul settings
  const loadBoxStyling = async () => {
    try {
      const response = await api.get('/shul/');
      const styling = {};
      if (response.box1_title_font) styling.box1_title_font = response.box1_title_font;
      if (response.box1_title_color) styling.box1_title_color = response.box1_title_color;
      if (response.box1_text_font) styling.box1_text_font = response.box1_text_font;
      if (response.box1_text_color) styling.box1_text_color = response.box1_text_color;
      if (response.box1_text_size) styling.box1_text_size = response.box1_text_size;
      if (response.box2_title_font) styling.box2_title_font = response.box2_title_font;
      if (response.box2_title_color) styling.box2_title_color = response.box2_title_color;
      if (response.box2_text_font) styling.box2_text_font = response.box2_text_font;
      if (response.box2_text_color) styling.box2_text_color = response.box2_text_color;
      if (response.box2_text_size) styling.box2_text_size = response.box2_text_size;
      if (response.box3_text_font) styling.box3_text_font = response.box3_text_font;
      if (response.box3_text_color) styling.box3_text_color = response.box3_text_color;
      if (response.box3_text_size) styling.box3_text_size = response.box3_text_size;
      if (response.box4_text_font) styling.box4_text_font = response.box4_text_font;
      if (response.box4_text_color) styling.box4_text_color = response.box4_text_color;
      if (response.box4_text_size) styling.box4_text_size = response.box4_text_size;

      if (Object.keys(styling).length > 0) {
        setBoxStyling(prev => ({ ...prev, ...styling }));
      }
    } catch (error) {
      console.error('Error loading box styling:', error);
    }
  };

  // Save box styling to backend
  const saveBoxStyling = async (field, value) => {
    try {
      await api.patch('/shul/', { [field]: value });
      setBoxStyling(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error saving box styling:', error);
    }
  };

  // Save layout to database whenever boxes change
  useEffect(() => {
    const saveLayout = async () => {
      try {
        await api.put('/shul/display-layout/', { layout_config: boxes });
      } catch (error) {
        console.error('Error saving layout:', error);
      }
    };

    // Debounce saves to avoid too many API calls
    const timeoutId = setTimeout(saveLayout, 1000);
    return () => clearTimeout(timeoutId);
  }, [boxes]);

  useEffect(() => {
    if (zmanim && limudim && jewishCalendar) {
      updateZmanimAndLimudimBox();
    }
  }, [zmanim, limudim, jewishCalendar]);

  const fetchZmanim = async (showSuccessMessage = false) => {
    try {
      const data = await api.get('/zmanim/');
      handleZmanimUpdate(data.zmanim, data.limudim, data.jewish_calendar, null, showSuccessMessage);
    } catch (error) {
      // Silently fail - don't show error message to user
      handleZmanimUpdate(null, null, null, null, showSuccessMessage);
    }
  };

  const handleZmanimUpdate = (zmanimData, limudimData, calendarData, error, showSuccessMessage = false) => {
    if (error) {
      // Don't show error messages
      setZmanim(null);
      setLimudim(null);
      setJewishCalendar(null);
    } else {
      setZmanim(zmanimData);
      setLimudim(limudimData);
      setJewishCalendar(calendarData);
      if (showSuccessMessage) {
        setMessage('Zmanim, Limudim, and Calendar data updated successfully!');
      }
    }
  };

  const handleCustomTimeCreated = () => {
    // Refresh the custom times list from the backend
    fetchCustomTimes();
    setEditingCustomTime(null); // Clear editing state
    setIsModalOpen(false); // Close modal
  };

  const handleEditCustomTime = (internalName) => {
    const customTime = customTimesData.find(ct => ct.internal_name === internalName);
    if (customTime) {
      setEditingCustomTime(customTime);
      setModalType('time');
      setIsModalOpen(true); // Open modal
    }
  };

  const handleAddCustomTime = () => {
    setEditingCustomTime(null); // Clear any editing state
    setModalType('time');
    setIsModalOpen(true); // Open modal
  };

  const handleCustomTextCreated = () => {
    // Refresh the custom texts list from the backend
    fetchCustomTexts();
    setEditingCustomText(null); // Clear editing state
    setIsModalOpen(false); // Close modal
  };

  const handleEditCustomText = (internalName) => {
    const customText = customTextsData.find(ct => ct.internal_name === internalName);
    if (customText) {
      setEditingCustomText(customText);
      setModalType('text');
      setIsModalOpen(true); // Open modal
    }
  };

  const handleAddCustomText = () => {
    setEditingCustomText(null); // Clear any editing state
    setModalType('text');
    setIsModalOpen(true); // Open modal
  };

  const handleDeleteCustomTime = async (internalName) => {
    const customTime = customTimesData.find(ct => ct.internal_name === internalName);
    if (!customTime) return;

    // Check which boxes are using this custom time
    const usedInBoxes = [];
    ['box1', 'box2', 'box3', 'box4'].forEach((boxKey) => {
      const box = boxes[boxKey];
      if (box.items.some(item => item.id === internalName)) {
        usedInBoxes.push(box.displayName);
      }
    });

    // Build confirmation message
    let confirmMessage = `Are you sure you want to delete "${customTime.display_name}"?`;
    if (usedInBoxes.length > 0) {
      confirmMessage += `\n\nWARNING: This custom time is currently being used in the following display boxes:\n- ${usedInBoxes.join('\n- ')}`;
      confirmMessage += '\n\nDeleting it will remove it from these boxes.';
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await api.delete(`/custom-times/${customTime.id}/`);
      fetchCustomTimes();

      // Remove from any boxes that were using it
      if (usedInBoxes.length > 0) {
        setBoxes(prevBoxes => {
          const updatedBoxes = { ...prevBoxes };
          ['box1', 'box2', 'box3', 'box4'].forEach((boxKey) => {
            updatedBoxes[boxKey] = {
              ...updatedBoxes[boxKey],
              items: updatedBoxes[boxKey].items.filter(item => item.id !== internalName)
            };
          });
          return updatedBoxes;
        });
      }
    } catch (error) {
      console.error('Error deleting custom time:', error);
      alert('Error deleting custom time: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteCustomText = async (internalName) => {
    const customText = customTextsData.find(ct => ct.internal_name === internalName);
    if (!customText) return;

    // Check which boxes are using this custom text
    const usedInBoxes = [];
    ['box1', 'box2', 'box3', 'box4'].forEach((boxKey) => {
      const box = boxes[boxKey];
      if (box.items.some(item => item.id === `customtext_${internalName}`)) {
        usedInBoxes.push(box.displayName);
      }
    });

    // Build confirmation message
    let confirmMessage = `Are you sure you want to delete "${customText.display_name}"?`;
    if (usedInBoxes.length > 0) {
      confirmMessage += `\n\nWARNING: This custom text is currently being used in the following display boxes:\n- ${usedInBoxes.join('\n- ')}`;
      confirmMessage += '\n\nDeleting it will remove it from these boxes.';
    }

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await api.delete(`/custom-texts/${customText.id}/`);
      fetchCustomTexts();

      // Remove from any boxes that were using it
      if (usedInBoxes.length > 0) {
        setBoxes(prevBoxes => {
          const updatedBoxes = { ...prevBoxes };
          ['box1', 'box2', 'box3', 'box4'].forEach((boxKey) => {
            updatedBoxes[boxKey] = {
              ...updatedBoxes[boxKey],
              items: updatedBoxes[boxKey].items.filter(item => item.id !== `customtext_${internalName}`)
            };
          });
          return updatedBoxes;
        });
      }
    } catch (error) {
      console.error('Error deleting custom text:', error);
      alert('Error deleting custom text: ' + (error.message || 'Unknown error'));
    }
  };

  const handleCancelEdit = () => {
    setEditingCustomTime(null);
    setEditingCustomText(null);
    setIsModalOpen(false); // Close modal
  };

  const updateZmanimAndLimudimBox = () => {
    setBoxes(prevBoxes => {
      if (!zmanim) {
        return prevBoxes;
      }

      // Define field categories based on backend models.py structure
      // All zmanim fields (merged basic + additional)
      const basicZmanimFields = [
        'Alos HaShachar', 'Neitz HaChamah', 'Sof Zman Krias Shema GRA', 'Sof Zman Krias Shema MGA',
        'Sof Zman Tefillah GRA', 'Sof Zman Tefillah MGA', 'Chatzos', 'Mincha Gedola',
        'Mincha Ketana', 'Plag HaMincha', 'Shkiah', 'Tzais', 'Tzais 72 minutes', 'Candle Lighting',
        'Sea Level Sunrise', 'Sea Level Sunset', 'Elevation Adjusted Sunrise', 'Elevation Adjusted Sunset',
        'Alos 16.1°', 'Alos 18°', 'Alos 19.8°', 'Tzais 8.5°', 'Tzais 7.083°', 'Tzais 5.95°',
        'Tzais 6.45°', 'Sun Transit', 'Shaah Zmanis GRA', 'Shaah Zmanis MGA', 'Temporal Hour'
      ];

      const limudimFields = [
        'Parsha', 'Daf Yomi Bavli', 'Daf Yomi Yerushalmi', 'Mishna Yomis',
        'Tehillim Monthly', 'Pirkei Avos', 'Daf HaShavua Bavli', 'Amud Yomi Bavli Dirshu'
      ];

      const jewishCalendarFields = [
        'Jewish Year', 'Jewish Month', 'Jewish Month Name', 'Jewish Day', 'Day of Week',
        'Significant Day', 'Day of Omer', 'Day of Chanukah',
        'Is Rosh Chodesh', 'Is Yom Tov', 'Is Chol HaMoed', 'Is Erev Yom Tov',
        'Is Chanukah', 'Is Fast Day', 'Is Assur Bemelacha', 'Is Erev Rosh Chodesh',
        'Molad', 'Kiddush Levana Earliest (3 Days)', 'Kiddush Levana Earliest (7 Days)',
        'Kiddush Levana Latest (15 Days)'
      ];

      // Get all available fields from zmanim data
      const allZmanimKeys = Object.keys(zmanim);
      const allLimudimKeys = limudim ? Object.keys(limudim) : [];

      // Create items for basic zmanim (includes all zmanim fields)
      const basicZmanimItems = basicZmanimFields
        .filter(field => allZmanimKeys.includes(field))
        .map(key => ({ id: `zmanim_${key}`, name: key }));

      // Create items for limudim - always update from API to include new fields
      const limudimItems = allLimudimKeys
        .map(key => ({ id: `limudim_${key}`, name: key }));

      // Create items for jewish calendar from actual data
      const allCalendarKeys = jewishCalendar ? Object.keys(jewishCalendar) : [];
      const jewishCalendarItems = allCalendarKeys
        .map(key => ({ id: `calendar_${key}`, name: key }));

      // Check if boxes are empty (first load)
      const isFirstLoad =
        prevBoxes.zmanimAndLimudim.items.length === 0 &&
        prevBoxes.limudimBox.items.length === 0 &&
        prevBoxes.jewishCalendar.items.length === 0;

      if (isFirstLoad) {
        // First load - populate everything
        return {
          ...prevBoxes,
          zmanimAndLimudim: {
            ...prevBoxes.zmanimAndLimudim,
            displayName: 'Basic Zmanim',
            items: basicZmanimItems
          },
          limudimBox: {
            ...prevBoxes.limudimBox,
            items: limudimItems
          },
          jewishCalendar: {
            ...prevBoxes.jewishCalendar,
            items: jewishCalendarItems
          }
        };
      } else {
        // Subsequent loads - merge new items into existing boxes
        const mergeItems = (existingItems, newItems) => {
          const existingIds = new Set(existingItems.map(item => item.id));
          const itemsToAdd = newItems.filter(item => !existingIds.has(item.id));
          return [...existingItems, ...itemsToAdd];
        };

        return {
          ...prevBoxes,
          zmanimAndLimudim: {
            ...prevBoxes.zmanimAndLimudim,
            items: mergeItems(prevBoxes.zmanimAndLimudim.items, basicZmanimItems)
          },
          limudimBox: {
            ...prevBoxes.limudimBox,
            items: mergeItems(prevBoxes.limudimBox.items, limudimItems)
          },
          jewishCalendar: {
            ...prevBoxes.jewishCalendar,
            items: mergeItems(prevBoxes.jewishCalendar.items, jewishCalendarItems)
          }
        };
      }
    });
  };

  const setItems = (boxId, newItems) => {
    setBoxes(prevBoxes => ({
      ...prevBoxes,
      [boxId]: {
        ...prevBoxes[boxId],
        items: newItems
      }
    }));
  };

  const handleBoxNameChange = (boxId, newName) => {
    setBoxes(prevBoxes => ({
      ...prevBoxes,
      [boxId]: {
        ...prevBoxes[boxId],
        displayName: newName,
      },
    }));
  };

  const handleRemoveItem = (boxId, itemId) => {
    setBoxes(prevBoxes => ({
      ...prevBoxes,
      [boxId]: {
        ...prevBoxes[boxId],
        items: prevBoxes[boxId].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const globalStyles = `
    .handle:active {
      cursor: grabbing !important;
    }

    .ghost-item {
      opacity: 0.4;
      background: #d4af37;
    }

    * {
      box-sizing: border-box;
    }
  `;

  // Fetch custom times and populate the customTimes box
  const fetchCustomTimes = () => {
    return api.get('/custom-times/')
      .then(data => {
        const customTimes = data || [];
        setCustomTimesData(customTimes); // Store full data for edit/delete
        setBoxes(prevBoxes => ({
          ...prevBoxes,
          customTimes: {
            ...prevBoxes.customTimes,
            items: customTimes.map(ct => {
              // Format time info
              const timeInfo = ct.time_type === 'fixed'
                ? `Fixed: ${ct.fixed_time}`
                : `Dynamic: ${ct.base_time} + ${ct.offset_minutes} min`;

              // Format frequency info
              let frequencyInfo;
              if (ct.daily) {
                frequencyInfo = 'Daily';
              } else {
                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                // Handle both new (days_of_week array) and legacy (single day_of_week)
                const days = ct.days_of_week && ct.days_of_week.length > 0
                  ? ct.days_of_week
                  : (ct.day_of_week !== null && ct.day_of_week !== undefined ? [ct.day_of_week] : []);

                if (days.length > 0) {
                  frequencyInfo = days.map(d => dayNames[d]).join(', ');
                } else {
                  frequencyInfo = 'No days selected';
                }
              }

              return {
                id: ct.internal_name,
                name: ct.display_name,
                internalName: ct.internal_name,
                timeInfo,
                frequencyInfo,
                description: ct.description,
                calculated_time: ct.calculated_time ? new Date(ct.calculated_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
                itemType: 'customtime' // Mark as custom time for actions
              };
            }),
          },
        }));
      })
      .catch(error => {
        console.error('Error fetching custom times:', error);
      });
  };

  // Custom times/texts are now fetched in the main initialization useEffect
  // to avoid race conditions with loadLayoutFromDatabase()

  // Fetch custom texts and merge into customTimes box
  const fetchCustomTexts = () => {
    return api.get('/custom-texts/')
      .then(data => {
        const customTexts = data || [];
        setCustomTextsData(customTexts); // Store full data for edit/delete

        // Merge with custom times in the box
        setBoxes(prevBoxes => {
          const existingCustomTimeItems = prevBoxes.customTimes.items.filter(item =>
            !item.id.startsWith('customtext_')
          );

          const customTextItems = customTexts.map(ct => {
            // Format display info based on type
            let typeInfo = ct.text_type === 'divider' ? 'Divider' : 'Text';
            let detailInfo = ct.text_type === 'text' ? `Content: ${ct.text_content.substring(0, 30)}${ct.text_content.length > 30 ? '...' : ''}` : '';

            return {
              id: `customtext_${ct.internal_name}`,
              name: ct.display_name,
              internalName: ct.internal_name,
              typeInfo,
              detailInfo,
              description: ct.description,
              itemType: 'customtext' // Mark as custom text for actions
            };
          });

          return {
            ...prevBoxes,
            customTimes: {
              ...prevBoxes.customTimes,
              items: [...existingCustomTimeItems, ...customTextItems]
            }
          };
        });
      })
      .catch(error => {
        console.error('Error fetching custom texts:', error);
      });
  };

  const renderCustomTimeActions = (item, buttonHovered, setButtonHovered) => {
    // Determine if this is a custom time or custom text
    const isCustomText = item.itemType === 'customtext';
    const handleEdit = isCustomText ? handleEditCustomText : handleEditCustomTime;
    const handleDelete = isCustomText ? handleDeleteCustomText : handleDeleteCustomTime;

    return (
      <>
        <button
          type="button"
          onClick={() => handleEdit(item.internalName)}
          style={{
            ...styles.button,
            ...styles.editButton,
            ...(buttonHovered === `edit-${item.id}` ? styles.editButtonHover : {})
          }}
          onMouseEnter={() => setButtonHovered(`edit-${item.id}`)}
          onMouseLeave={() => setButtonHovered(null)}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => handleDelete(item.internalName)}
          style={{
            ...styles.button,
            ...styles.deleteButton,
            ...(buttonHovered === `delete-${item.id}` ? styles.deleteButtonHover : {})
          }}
          onMouseEnter={() => setButtonHovered(`delete-${item.id}`)}
          onMouseLeave={() => setButtonHovered(null)}
        >
          Delete
        </button>
      </>
    );
  };


  return (
    <div style={styles.pageContainer}>
      <style>{globalStyles}</style>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Display Settings</h1>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        {message && <div style={styles.message}>{message}</div>}

        {/* Display Boxes Section */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            📺 Display Boxes
            <span style={styles.sectionSubtitle}>Customize what appears on your shul display</span>
          </h2>
        </div>
        <div style={styles.displayBoxesGrid}>
          {['box1', 'box2', 'box3', 'box4'].map((boxId) => (
            <Box
              key={boxId}
              id={boxId}
              name={boxes[boxId].displayName}
              items={boxes[boxId].items}
              setItems={setItems}
              onNameChange={handleBoxNameChange}
              onRemoveItem={handleRemoveItem}
              group="shared"
              canEditName={true}
              styling={boxStyling}
              onStylingChange={saveBoxStyling}
            />
          ))}
        </div>

        <hr style={styles.divider} />

        {/* Available Fields Section */}
        <div style={{ ...styles.sectionHeader, justifyContent: 'space-between' }}>
          <h2 style={styles.sectionTitle}>
            📋 Available Fields
            <span style={styles.sectionSubtitle}>Drag items to the display boxes above</span>
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <AddButton onClick={handleAddCustomTime} />
            <button
              onClick={handleAddCustomText}
              style={{
                ...styles.addButton,
                backgroundColor: '#3498db'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#2980b9';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(52, 152, 219, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#3498db';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(52, 152, 219, 0.2)';
              }}
            >
              <span style={{ fontSize: '18px' }}>+</span>
              Add Custom Component
            </button>
          </div>
        </div>
        <div style={styles.sourceBoxesGrid}>
          <Box
            id="zmanimAndLimudim"
            name={boxes.zmanimAndLimudim.displayName}
            items={boxes.zmanimAndLimudim.items}
            setItems={setItems}
            onNameChange={handleBoxNameChange}
            group={{ name: 'shared', pull: 'clone', put: false }}
            canEditName={false}
          />
          <Box
            id="customTimes"
            name={boxes.customTimes.displayName}
            items={boxes.customTimes.items}
            setItems={setItems}
            onNameChange={handleBoxNameChange}
            group={{ name: 'shared', pull: 'clone', put: false }}
            canEditName={false}
            renderItemActions={renderCustomTimeActions}
          />
          <Box
            id="limudimBox"
            name={boxes.limudimBox.displayName}
            items={boxes.limudimBox.items}
            setItems={setItems}
            onNameChange={handleBoxNameChange}
            group={{ name: 'shared', pull: 'clone', put: false }}
            canEditName={false}
          />
          <Box
            id="jewishCalendar"
            name={boxes.jewishCalendar.displayName}
            items={boxes.jewishCalendar.items}
            setItems={setItems}
            onNameChange={handleBoxNameChange}
            group={{ name: 'shared', pull: 'clone', put: false }}
            canEditName={false}
          />
        </div>

      </div>

      {/* Modal for Custom Times and Custom Texts */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancelEdit}
        title={
          modalType === 'time'
            ? (editingCustomTime ? 'Edit Custom Time' : 'Create Custom Time')
            : (editingCustomText ? 'Edit Custom Component' : 'Create Custom Component')
        }
      >
        {modalType === 'time' ? (
          <CustomTimes
            onCustomTimeCreated={handleCustomTimeCreated}
            editingCustomTime={editingCustomTime}
            onCancelEdit={handleCancelEdit}
          />
        ) : (
          <CustomText
            onCustomTextCreated={handleCustomTextCreated}
            editingCustomText={editingCustomText}
            onCancelEdit={handleCancelEdit}
          />
        )}
      </Modal>
    </div>
  );
};

export default ZmanimSettings;
