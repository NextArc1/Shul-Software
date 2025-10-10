import React, { useState, useEffect } from 'react';
import { ReactSortable } from "react-sortablejs";
import ZmanimUpdater from '../components/ZmanimUpdater';
import ZmanimDisplay from '../components/ZmanimDisplay';
import CustomTimes from '../components/CustomTimes';
import { api } from '../utils/api';

const Box = ({ id, name, items, setItems, onNameChange, group, canEditName, onRemoveItem }) => (
  <div style={{ border: '1px solid black', padding: '10px', width: '22%', minHeight: '100px' }}>
    {canEditName ? (
      <input
        value={name}
        onChange={(e) => onNameChange(id, e.target.value)}
        style={{ marginBottom: '10px' }}
      />
    ) : (
      <h3>{name}</h3>
    )}
    <ReactSortable
      list={items}
      setList={(newState) => setItems(id, newState)}
      group={group}
      animation={150}
      handle=".handle"
    >
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            padding: '5px',
            border: '1px solid #ddd',
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div className="handle" style={{ flex: 1, cursor: 'grab', userSelect: 'none' }}>
            {item.name}
            {item.calculated_time && <div style={{ fontSize: '12px' }}>{item.calculated_time}</div>}
          </div>
          {onRemoveItem && (
            <button
              type="button"
              onClick={() => onRemoveItem(id, item.id)}
              style={{
                marginLeft: '5px',
                padding: '2px 6px',
                fontSize: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          )}
        </div>
      ))}
    </ReactSortable>
  </div>
);

const ZmanimSettings = () => {
  const [zmanim, setZmanim] = useState(null);
  const [limudim, setLimudim] = useState(null);
  const [jewishCalendar, setJewishCalendar] = useState(null);
  const [message, setMessage] = useState('');
  const [boxes, setBoxes] = useState({
    box1: { internalName: 'box1', displayName: 'Shabbos Times', items: [] },
    box2: { internalName: 'box2', displayName: 'Weekday Times', items: [] },
    box3: { internalName: 'box3', displayName: 'Box 3', items: [] },
    box4: { internalName: 'box4', displayName: 'Box 4', items: [] },
    zmanimAndLimudim: { internalName: 'zmanimAndLimudim', displayName: 'Basic Zmanim', items: [] },
    limudimBox: { internalName: 'limudimBox', displayName: 'Limudim', items: [] },
    jewishCalendar: { internalName: 'jewishCalendar', displayName: 'Jewish Calendar', items: [] },
    additionalZmanim: { internalName: 'additionalZmanim', displayName: 'Additional Zmanim', items: [] },
    customTimes: { internalName: 'customTimes', displayName: 'Custom Times', items: [] },
  });

  // Load layout from database on mount
  useEffect(() => {
    fetchZmanim();
    loadLayoutFromDatabase();
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

  const fetchZmanim = async () => {
    try {
      const data = await api.get('/zmanim/');
      handleZmanimUpdate(data.zmanim, data.limudim, data.jewish_calendar);
    } catch (error) {
      handleZmanimUpdate(null, null, null, 'Failed to fetch zmanim and limudim');
    }
  };

  const handleZmanimUpdate = (zmanimData, limudimData, calendarData, error) => {
    if (error) {
      setMessage(error);
      setZmanim(null);
      setLimudim(null);
      setJewishCalendar(null);
    } else {
      setZmanim(zmanimData);
      setLimudim(limudimData);
      setJewishCalendar(calendarData);
      setMessage('Zmanim, Limudim, and Calendar data updated successfully!');
    }
  };

  const handleCustomTimeCreated = (customTime) => {
    // Update the customTimes box with the new custom time
    setBoxes(prevBoxes => ({
      ...prevBoxes,
      customTimes: {
        ...prevBoxes.customTimes,
        items: [...prevBoxes.customTimes.items, { id: customTime.internal_name, name: customTime.display_name }],
      },
    }));
  };

  const updateZmanimAndLimudimBox = () => {
    setBoxes(prevBoxes => {
      if (!zmanim) {
        return prevBoxes;
      }

      // Define field categories based on backend models.py structure
      const basicZmanimFields = [
        'Alos HaShachar', 'Neitz HaChamah', 'Sof Zman Krias Shema GRA', 'Sof Zman Krias Shema MGA',
        'Sof Zman Tefillah GRA', 'Sof Zman Tefillah MGA', 'Chatzos', 'Mincha Gedola',
        'Mincha Ketana', 'Plag HaMincha', 'Shkiah', 'Tzais', 'Tzais 72 minutes', 'Candle Lighting'
      ];

      const additionalZmanimFields = [
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

      // Create items for basic zmanim
      const basicZmanimItems = basicZmanimFields
        .filter(field => allZmanimKeys.includes(field))
        .map(key => ({ id: `zmanim_${key}`, name: key }));

      // Create items for additional zmanim (any that aren't in basic)
      const additionalZmanimItems = additionalZmanimFields
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
        prevBoxes.jewishCalendar.items.length === 0 &&
        prevBoxes.additionalZmanim.items.length === 0;

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
          },
          additionalZmanim: {
            ...prevBoxes.additionalZmanim,
            items: additionalZmanimItems
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
          },
          additionalZmanim: {
            ...prevBoxes.additionalZmanim,
            items: mergeItems(prevBoxes.additionalZmanim.items, additionalZmanimItems)
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

  const style = `
    .handle:active {
      cursor: grabbing;
    }
  `;

  useEffect(() => {
    // Fetch custom times
    api.get('/custom-times/')
      .then(data => {
        setBoxes(prevBoxes => ({
          ...prevBoxes,
          customTimes: {
            ...prevBoxes.customTimes,
            items: (data.custom_times || []).map(ct => ({ id: ct.internal_name, name: ct.display_name })),
          },
        }));
      })
      .catch(error => {
        console.error('Error fetching custom times:', error);
      });
  }, []);

  return (
    <div>
      <style>{style}</style>
      <h1>Zmanim Settings</h1>
      <ZmanimUpdater onUpdate={handleZmanimUpdate} />
      {message && <p>{message}</p>}
      <ZmanimDisplay zmanim={zmanim} limudim={limudim} jewishCalendar={jewishCalendar} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
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
          />
        ))}
      </div>

      {/* Source boxes - organized by category */}
      <h2 style={{ marginTop: '30px', marginBottom: '15px' }}>Available Fields (drag to boxes above)</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '10px' }}>
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
          id="additionalZmanim"
          name={boxes.additionalZmanim.displayName}
          items={boxes.additionalZmanim.items}
          setItems={setItems}
          onNameChange={handleBoxNameChange}
          group={{ name: 'shared', pull: 'clone', put: false }}
          canEditName={false}
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

      {/* Custom Times and Creator */}
      <h2 style={{ marginTop: '30px', marginBottom: '15px' }}>Custom Times</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <Box
          id="customTimes"
          name={boxes.customTimes.displayName}
          items={boxes.customTimes.items}
          setItems={setItems}
          onNameChange={handleBoxNameChange}
          onRemoveItem={handleRemoveItem}
          group="shared"
          canEditName={false}
        />
        <div style={{ flex: 1 }}>
          <CustomTimes onCustomTimeCreated={handleCustomTimeCreated} />
        </div>
      </div>
    </div>
  );
};

export default ZmanimSettings;