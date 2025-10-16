import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      backgroundColor: '#162A45',
      color: '#ffffff',
      textAlign: 'center',
      padding: '20px 40px',
      marginTop: 'auto',
      fontSize: '14px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    text: {
      margin: 0,
      opacity: 0.9
    }
  };

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © 2025 Shul Schedule.
        <br />
        Built with care for the Jewish community.
      </p>
    </footer>
  );
};

export default Footer;
