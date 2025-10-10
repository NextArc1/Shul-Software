import React from 'react';
import ZipCodeForm from '../components/ZipCodeForm';
import { Card, CardContent, Typography } from '@mui/material';

function ShulSettings() {

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Shul Settings</h1>
      
      {/* Location Settings */}
      <Card>
        <CardContent>
          <ZipCodeForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default ShulSettings;
