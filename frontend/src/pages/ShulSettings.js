import React from 'react';
import ZipCodeForm from '../components/ZipCodeForm';

function ShulSettings() {
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      background: 'linear-gradient(to right, #ffffff 0%, #f8fafc 100%)',
      color: '#1e293b',
      padding: '32px 40px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      marginBottom: '0',
      borderBottom: '1px solid #e2e8f0'
    },
    headerTitle: {
      margin: '0',
      fontSize: '28px',
      fontWeight: '600',
      letterSpacing: '-0.3px',
      color: '#0f172a'
    },
    contentWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '40px 40px 40px'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Shul Configuration</h1>
      </div>

      <div style={styles.contentWrapper}>
        <ZipCodeForm />
      </div>
    </div>
  );
}

export default ShulSettings;
