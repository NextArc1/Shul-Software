import React from 'react';
import { api } from '../utils/api';

function ZmanimUpdater({ onUpdate }) {
    const updateZmanim = async () => {
        try {
            // First refresh the zmanim
            await api.post('/zmanim/refresh/');

            // Then fetch the updated data
            const data = await api.get('/zmanim/');
            console.log('Received data:', data);
            onUpdate(data.zmanim, data.limudim, data.jewish_calendar);
        } catch (error) {
            console.error('Error:', error);
            onUpdate(null, null, null, 'Error updating daily zmanim and limudim.');
        }
    };

    return (
        <button onClick={updateZmanim}>Refresh Zmanim</button>
    );
}

export default ZmanimUpdater;