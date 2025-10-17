import React, { useState } from 'react';

const Setup = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    heroSection: {
      background: 'linear-gradient(to right, #ffffff 0%, #f8fafc 100%)',
      color: '#1e293b',
      padding: '32px 20px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      borderBottom: '1px solid #e2e8f0'
    },
    heroTitle: {
      fontSize: 'clamp(1.75rem, 5vw, 2.25rem)',
      fontWeight: '600',
      marginBottom: '12px',
      letterSpacing: '-0.5px',
      color: '#0f172a'
    },
    heroSubtitle: {
      fontSize: 'clamp(0.9rem, 2.5vw, 1.125rem)',
      color: '#64748b',
      maxWidth: '700px',
      margin: '0 auto',
      lineHeight: '1.6',
      padding: '0 16px'
    },
    contentWrapper: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: 'clamp(24px, 5vw, 50px) clamp(16px, 4vw, 40px)'
    },
    section: {
      marginBottom: 'clamp(40px, 8vw, 60px)'
    },
    sectionTitle: {
      fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(20px, 4vw, 30px)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      marginBottom: 'clamp(16px, 3vw, 20px)'
    },
    requirementsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
      gap: 'clamp(12px, 2.5vw, 16px)',
      marginTop: 'clamp(12px, 2.5vw, 16px)'
    },
    requirementItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: 'clamp(16px, 3vw, 20px)',
      backgroundColor: '#f9fafb',
      borderRadius: '10px',
      border: '1px solid #e5e7eb'
    },
    requirementIcon: {
      fontSize: 'clamp(24px, 5vw, 32px)',
      flexShrink: 0
    },
    requirementContent: {
      flex: 1
    },
    requirementTitle: {
      fontSize: 'clamp(15px, 3vw, 16px)',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: 'clamp(4px, 1vw, 6px)'
    },
    requirementDescription: {
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      color: '#6b7280',
      lineHeight: '1.5'
    },
    stepsList: {
      counterReset: 'step-counter'
    },
    stepItem: {
      position: 'relative',
      paddingLeft: 'clamp(56px, 12vw, 70px)',
      marginBottom: 'clamp(24px, 5vw, 35px)'
    },
    stepNumber: {
      position: 'absolute',
      left: '0',
      top: '0',
      width: 'clamp(40px, 9vw, 50px)',
      height: 'clamp(40px, 9vw, 50px)',
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'clamp(18px, 4vw, 22px)',
      fontWeight: '700'
    },
    stepTitle: {
      fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: '10px'
    },
    stepDescription: {
      fontSize: 'clamp(0.875rem, 2.5vw, 0.9375rem)',
      color: '#6b7280',
      lineHeight: '1.7',
      marginBottom: '12px'
    },
    tipBox: {
      backgroundColor: '#fef3c7',
      border: '1px solid #fbbf24',
      borderRadius: '8px',
      padding: 'clamp(12px, 3vw, 15px)',
      marginTop: '12px',
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-start'
    },
    tipIcon: {
      fontSize: 'clamp(18px, 4vw, 20px)',
      flexShrink: 0
    },
    tipText: {
      fontSize: 'clamp(0.8125rem, 2.5vw, 0.875rem)',
      color: '#92400e',
      lineHeight: '1.5'
    },
    highlightBox: {
      backgroundColor: '#dbeafe',
      border: '2px solid #3b82f6',
      borderRadius: 'clamp(8px, 2vw, 10px)',
      padding: 'clamp(16px, 3vw, 20px)',
      marginTop: 'clamp(10px, 2vw, 12px)'
    },
    highlightTitle: {
      fontSize: 'clamp(15px, 3vw, 16px)',
      fontWeight: '600',
      color: '#1e40af',
      marginBottom: 'clamp(6px, 1.5vw, 8px)'
    },
    highlightText: {
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      color: '#1e3a8a',
      lineHeight: '1.6'
    },
    troubleshootingList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    troubleshootingItem: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      padding: 'clamp(16px, 3vw, 20px)',
      marginBottom: 'clamp(12px, 2.5vw, 15px)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    troubleshootingItemHover: {
      backgroundColor: '#f9fafb',
      borderColor: '#3b82f6',
      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1)'
    },
    troubleshootingQuestion: {
      fontSize: 'clamp(15px, 3vw, 16px)',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    },
    expandIcon: {
      fontSize: '20px',
      color: '#6b7280',
      flexShrink: 0,
      transition: 'transform 0.2s ease'
    },
    expandIconOpen: {
      transform: 'rotate(180deg)'
    },
    troubleshootingAnswer: {
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      color: '#6b7280',
      lineHeight: '1.6'
    },
    videoPlaceholder: {
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
      border: '2px dashed #d1d5db',
      marginTop: '20px'
    },
    videoText: {
      fontSize: '16px',
      color: '#6b7280',
      marginBottom: '10px'
    }
  };

  const requirements = [
    {
      icon: '',
      title: 'Computer',
      description: 'Any computer that can run a web browser (Chrome, Firefox, Safari, or Edge)'
    },
    {
      icon: '',
      title: 'TV or Monitor',
      description: 'Any screen with an HDMI port to display the zmanim'
    },
    {
      icon: '',
      title: 'Internet Connection',
      description: 'WiFi or ethernet connection to keep zmanim updated'
    }
  ];

  const troubleshooting = [
    {
      question: 'The screen turned off or shows a screensaver',
      answer: 'Go to your computer\'s display settings and set "Turn off screen" to "Never" and disable the screensaver. On Windows: Settings > System > Power & Sleep. On Mac: System Preferences > Energy Saver.'
    },
    {
      question: 'The display shows old zmanim or times aren\'t updating',
      answer: 'Check that your internet connection is working. The display updates automatically every 5 minutes, but needs internet to get new times. Try refreshing the page by pressing F5. If the problem persists, log into your admin account and go to Shul Settings to verify your zip code is correct.'
    },
    {
      question: 'I can\'t find the display URL',
      answer: 'Click the "Shul Display" button in the top navigation bar. Your unique display link will open in a new tab. Bookmark this page for easy access. The URL format is: yoursite.com/display/your-shul-name'
    },
    {
      question: 'I want to hide the mouse cursor on the display',
      answer: 'Press F11 on your keyboard to enter fullscreen mode. The cursor will hide automatically after a few seconds of no movement.'
    },
    {
      question: 'My custom time isn\'t showing up or shows wrong time',
      answer: 'Go to Zmanim Settings and check: (1) The custom time is dragged into one of the 4 display boxes at the top, (2) The "Display Days" settings include today\'s day of the week, (3) For Weekly Target mode, verify the target weekday is correct, (4) For Specific Date mode, the date you selected is still relevant. Click Edit on the custom time to verify all settings.'
    },
    {
      question: 'The colors or fonts look wrong on the display',
      answer: 'Go to Shul Settings and scroll down to the "Visual Styling" section. Check the Box Outline Color, Header Text Color, and Header Background Color. In Zmanim Settings, each display box has a "Customize Appearance" button where you can adjust fonts, colors, and text sizes for that specific box.'
    },
    {
      question: 'Times are showing in the wrong timezone',
      answer: 'Go to Shul Settings, enter your correct zip code, and click "Get Coordinates". The system will automatically detect and update your timezone based on your location. Make sure to click "Save Configuration" at the bottom.'
    },
    {
      question: 'The text is too small or too large on the TV',
      answer: 'Go to Zmanim Settings. Click "Customize Appearance" on each display box and adjust the text size (range: 8-72px). You can set different sizes for each box. Changes save automatically and will appear on your display within 5 minutes.'
    },
    {
      question: 'How do I delete a custom time or custom component?',
      answer: 'Go to Zmanim Settings and scroll to the "Available Fields" section at the bottom. Find the "Custom" box. Locate your custom time or component and click the red "Delete" button. A confirmation message will appear if it\'s being used in any display boxes.'
    },
    {
      question: 'My logo isn\'t showing up or looks distorted',
      answer: 'Go to Shul Settings > Branding & Identity section. Check that: (1) Your logo file was uploaded successfully (you should see a preview), (2) The logo size is set appropriately (100-600px), (3) The vertical position is where you want it (0=top, 50=center, 100=bottom). If you have both a logo AND center text, only the logo will display. Recommended logo size: 400x400px.'
    },
    {
      question: 'The display won\'t go fullscreen',
      answer: 'Different browsers handle fullscreen differently. Try: F11 (Windows/Linux), Cmd+Shift+F (Mac), or click the browser\'s fullscreen icon (usually in the address bar or menu). If using Chrome, you can also right-click the page and select "Open in fullscreen window".'
    },
    {
      question: 'Changes I made aren\'t showing on the display screen',
      answer: 'Changes can take up to 5 minutes to appear on the display (that\'s how often it refreshes). If after 5 minutes you still don\'t see changes: (1) Refresh the display page (F5), (2) Verify your changes were saved in Shul Settings or Zmanim Settings, (3) Check that your computer has internet connection.'
    },
    {
      question: 'How do I show different times on Shabbos vs. weekdays?',
      answer: 'You have two options: (1) Use the built-in boxes - rename Box 1 to "Shabbos Times" and add Candle Lighting, Shkiah, etc., then rename Box 2 to "Weekday Times" and add your weekday schedule. Both will show simultaneously. (2) Create custom times and set specific "Display Days" for each (e.g., Friday-Saturday only vs. Sunday-Thursday only).'
    },
    {
      question: 'The Hebrew text or gematria numbers look wrong',
      answer: 'Go to Shul Settings > Regional Preferences and check your "Display Language" setting. Choose: "Hebrew" for full Hebrew with gematria, "English" for English translations, "Sephardic Transliteration" or "Ashkenazic Transliteration" for transliterated text. Click "Save Configuration".'
    }
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Setup Your Shul Display</h1>
        <p style={styles.heroSubtitle}>
          Follow these simple steps to get your shul's zmanim display up and running in minutes
        </p>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>

        {/* What You Need Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>📋</span>
            What You Need
          </h2>
          <div style={styles.card}>
            <p style={{ fontSize: 'clamp(15px, 3vw, 16px)', color: '#6b7280', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
              Don't worry—you don't need to be a tech expert! Here's everything you need to get started:
            </p>
            <div style={styles.requirementsList}>
              {requirements.map((req, index) => (
                <div key={index} style={styles.requirementItem}>
                  {req.icon && <div style={styles.requirementIcon}>{req.icon}</div>}
                  <div style={styles.requirementContent}>
                    <div style={styles.requirementTitle}>{req.title}</div>
                    <div style={styles.requirementDescription}>{req.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step by Step Instructions */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>🚀</span>
            Step-by-Step Setup
          </h2>
          <div style={styles.card}>
            <div style={styles.stepsList}>

              {/* Step 1 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>1</div>
                <h3 style={styles.stepTitle}>Configure Your Shul Settings</h3>
                <p style={styles.stepDescription}>
                  After creating your account, click on "Shul Settings" in the top navigation menu. This is where you'll configure all the basic settings for your display.
                </p>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                    Basic Configuration Section:
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Zip/Postal Code:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px' }}>
                      <li>Enter your shul's zip code (e.g., 10001)</li>
                      <li>Click "Get Coordinates" button - this automatically finds your location</li>
                      <li>The system will fill in latitude, longitude, and timezone automatically</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Country:</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Select your country from the dropdown (United States, Israel, Canada, UK, etc.)
                    </p>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Display Language:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px' }}>
                      <li><strong>Hebrew:</strong> Full Hebrew display with gematria numerals</li>
                      <li><strong>English:</strong> English translations</li>
                      <li><strong>Sephardic Transliteration:</strong> Hebrew words in Sephardic pronunciation</li>
                      <li><strong>Ashkenazic Transliteration:</strong> Hebrew words in Ashkenazic pronunciation</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Time Format:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px' }}>
                      <li><strong>12-hour:</strong> Shows times like 7:30 PM</li>
                      <li><strong>24-hour:</strong> Shows times like 19:30</li>
                    </ul>
                  </div>

                  <div>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Show Seconds:</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Choose "Yes" to display seconds (7:30:45 PM) or "No" for just hours and minutes (7:30 PM)
                    </p>
                  </div>
                </div>

                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    <strong>Important:</strong> The zip code is the most critical setting—this is how we calculate accurate zmanim for your exact location. The system automatically detects your timezone based on the coordinates!
                  </span>
                </div>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginTop: 'clamp(12px, 2.5vw, 15px)' }}>
                  <p style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)', marginBottom: '8px' }}>
                    After filling in these basic settings, scroll down to see more customization options for branding and visual styling (we'll cover those in the next steps). For now, click <strong>"Save Configuration"</strong> at the bottom of the page.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>2</div>
                <h3 style={styles.stepTitle}>Arrange Your Display</h3>
                <p style={styles.stepDescription}>
                  Click on "Zmanim Settings" in the top menu. This is where you'll choose which times and information appear on your display screen.
                </p>

                <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#0c4a6e', marginBottom: '10px' }}>
                    Understanding the Layout:
                  </h4>
                  <p style={{ color: '#0c4a6e', fontSize: 'clamp(13px, 2.5vw, 14px)', lineHeight: '1.7', marginBottom: '10px' }}>
                    The page is divided into two sections:
                  </p>
                  <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#0c4a6e', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                    <li><strong>Top Section - Display Boxes:</strong> These are the 4 boxes that will appear on your actual shul display screen (Box 1, Box 2, Box 3, Box 4)</li>
                    <li><strong>Bottom Section - Available Fields:</strong> All the zmanim, learning schedules, and custom items you can choose from</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                    How to Add Items:
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>On Desktop/Computer:</strong>
                    <ol style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px' }}>
                      <li>Find the item you want in the "Available Fields" section at the bottom</li>
                      <li>Click and hold on the item (you'll see ⋮⋮ handles)</li>
                      <li>Drag it up to one of the 4 display boxes at the top</li>
                      <li>Release to drop it in the box</li>
                    </ol>
                  </div>

                  <div>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>On Mobile/Tablet:</strong>
                    <ol style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px' }}>
                      <li>Find the item in the "Available Fields" section</li>
                      <li>Click the "Move to ▼" button on the item</li>
                      <li>Select which box you want to move it to (Box 1, Box 2, Box 3, or Box 4)</li>
                    </ol>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                    Available Fields Explained:
                  </h4>

                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Basic Zmanim Box:</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Contains all prayer times: Alos HaShachar, Neitz, Sof Zman Krias Shema, Chatzos, Mincha Gedola, Mincha Ketana, Plag HaMincha, Shkiah, Tzais, Candle Lighting, and more
                    </p>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Limudim Box:</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Learning schedules: Parsha, Daf Yomi Bavli, Daf Yomi Yerushalmi, Mishna Yomis, Tehillim Monthly, Pirkei Avos, Daf HaShavua, Amud Yomi
                    </p>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Jewish Calendar Box:</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Hebrew date info: Jewish Year, Jewish Month, Significant Day, Day of Omer, Rosh Chodesh, Yom Tov, Molad, Kiddush Levana times
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: '#374151', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Custom Box:</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Your custom times and text components (we'll create these in Step 2.5)
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#9a3412', marginBottom: '10px' }}>
                    Other Actions:
                  </h4>
                  <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#9a3412', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                    <li><strong>Reorder items:</strong> Drag items up or down within a box to change their order</li>
                    <li><strong>Remove items:</strong> Click the × button on any item in a display box to remove it</li>
                    <li><strong>Rename boxes:</strong> Click on the box name (like "Box 1") and type a new name (e.g., "Shabbos Times")</li>
                    <li><strong>Customize appearance:</strong> Click "Customize Appearance" in each box to change fonts, colors, and text sizes</li>
                  </ul>
                </div>

                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    <strong>Pro Tip:</strong> Changes save automatically! You don't need to click a save button. Just arrange the boxes how you want them, and your layout is saved instantly.
                  </span>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginTop: 'clamp(12px, 2.5vw, 15px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>
                    Suggested Setup:
                  </h4>
                  <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#166534', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                    <li><strong>Box 1 (Shabbos Times):</strong> Candle Lighting, Shkiah, Tzais, plus any Shabbos-specific minyan times</li>
                    <li><strong>Box 2 (Weekday Times):</strong> Alos, Neitz, Sof Zman Krias Shema, Chatzos, Mincha Gedola, Shkiah, Tzais</li>
                    <li><strong>Box 3:</strong> Parsha, Daf Yomi, Significant Day, Day of Omer</li>
                    <li><strong>Box 4:</strong> Mishna Yomis, Pirkei Avos, or other learning schedules</li>
                  </ul>
                </div>
              </div>

              {/* Step 2.5 - Custom Times Feature */}
              <div style={styles.stepItem}>
                <div style={{ ...styles.stepNumber, backgroundColor: '#8b5cf6' }}>2.5</div>
                <h3 style={styles.stepTitle}>Create Custom Times (Optional)</h3>
                <p style={styles.stepDescription}>
                  Custom Times allow you to display minyan times, events, or any schedule that isn't in the standard zmanim list. This is one of the most powerful features of the system!
                </p>

                <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#92400e', marginBottom: '8px' }}>
                    When to Use Custom Times:
                  </h4>
                  <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#92400e', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginBottom: 0 }}>
                    <li>Regular minyan times that happen at specific times (e.g., "Sunday Shacharis at 8:00 AM")</li>
                    <li>Minyanim calculated from zmanim (e.g., "30 minutes before Shkiah every weekday")</li>
                    <li>Weekly recurring events (e.g., "Friday afternoon Mincha")</li>
                    <li>Holiday-specific times (e.g., "Rosh Hashanah Day 1 Shacharis")</li>
                    <li>Special announcements with times (e.g., "Selichos starts 6:00 AM")</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                    Two Types of Custom Times:
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>1. Fixed Time (Static)</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '6px', marginBottom: '6px' }}>
                      The time never changes - you set a specific time like 7:00 PM or 8:30 AM.
                    </p>
                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: 'clamp(10px, 2vw, 12px)', fontSize: 'clamp(12px, 2.3vw, 13px)', color: '#0369a1' }}>
                      <strong>Example:</strong> "Sunday Morning Shacharis" at 8:00 AM<br/>
                      → Always shows 8:00 AM on Sundays
                    </div>
                  </div>

                  <div>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>2. Dynamic Time (Calculated)</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '6px', marginBottom: '6px' }}>
                      The time is calculated based on a zman (sunrise, sunset, etc.) plus or minus minutes. Updates automatically every day.
                    </p>
                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px', padding: 'clamp(10px, 2vw, 12px)', fontSize: 'clamp(12px, 2.3vw, 13px)', color: '#0369a1' }}>
                      <strong>Example:</strong> "Weekday Mincha" at 20 minutes before Shkiah<br/>
                      → Shows 6:45 PM today, 6:43 PM tomorrow (as sunset changes)
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'clamp(16px, 3vw, 20px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(16px, 3vw, 17px)', fontWeight: '600', color: '#2c3e50', marginBottom: 'clamp(10px, 2vw, 12px)' }}>
                    Three Calculation Modes:
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)', lineHeight: '1.7', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                    The calculation mode determines <strong>which day's zmanim</strong> to use for the time calculation. This is crucial for understanding how your custom time will behave.
                  </p>

                  {/* Daily Mode */}
                  <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 'clamp(6px, 1.5vw, 8px)', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                    <div style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#0c4a6e', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>
                      📅 Daily (Each Day's Own Calculation)
                    </div>
                    <div style={{ fontSize: 'clamp(13px, 2.5vw, 14px)', color: '#0c4a6e', lineHeight: '1.6', marginBottom: 'clamp(8px, 2vw, 10px)' }}>
                      Perfect for regular daily times. Each day shows that day's calculated time.
                    </div>
                    <div style={{ fontSize: 'clamp(12px, 2.3vw, 13px)', color: '#0369a1', backgroundColor: '#e0f2fe', padding: 'clamp(8px, 2vw, 10px)', borderRadius: 'clamp(5px, 1.2vw, 6px)', fontStyle: 'italic' }}>
                      <strong>Example:</strong> "Daily Shacharis" at 30 minutes before Netz<br/>
                      → Monday shows Monday's Netz - 30 min<br/>
                      → Tuesday shows Tuesday's Netz - 30 min
                    </div>
                  </div>

                  {/* Weekly Target Mode */}
                  <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 'clamp(6px, 1.5vw, 8px)', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                    <div style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#78350f', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>
                      📆 Weekly Target Day (Show Specific Weekday's Time)
                    </div>
                    <div style={{ fontSize: 'clamp(13px, 2.5vw, 14px)', color: '#78350f', lineHeight: '1.6', marginBottom: 'clamp(8px, 2vw, 10px)' }}>
                      Display a specific weekday's time throughout the week. Great for showing "Friday Mincha" all week long.
                    </div>
                    <div style={{ fontSize: 'clamp(12px, 2.3vw, 13px)', color: '#92400e', backgroundColor: '#fef3c7', padding: 'clamp(8px, 2vw, 10px)', borderRadius: 'clamp(5px, 1.2vw, 6px)', fontStyle: 'italic', border: '1px solid #fbbf24' }}>
                      <strong>Example:</strong> "Friday Mincha" displayed Sunday through Friday<br/>
                      → Set Target Weekday: Friday<br/>
                      → Set Base Time: Shkiah - 10 minutes<br/>
                      → Display Days: Sun, Mon, Tue, Wed, Thu, Fri<br/>
                      → <strong>Result:</strong> All those days show <u>Friday's</u> Shkiah - 10 min<br/>
                      → Updates automatically each week to show the upcoming Friday
                    </div>
                  </div>

                  {/* Specific Date Mode */}
                  <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 'clamp(6px, 1.5vw, 8px)', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
                    <div style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#065f46', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>
                      📌 Specific Calendar Date (Show One Date's Time)
                    </div>
                    <div style={{ fontSize: 'clamp(13px, 2.5vw, 14px)', color: '#065f46', lineHeight: '1.6', marginBottom: 'clamp(8px, 2vw, 10px)' }}>
                      Plan ahead for Yomim Tovim or special events. Calculate from one specific date and display it until you manually delete it.
                    </div>
                    <div style={{ fontSize: 'clamp(12px, 2.3vw, 13px)', color: '#047857', backgroundColor: '#d1fae5', padding: 'clamp(8px, 2vw, 10px)', borderRadius: 'clamp(5px, 1.2vw, 6px)', fontStyle: 'italic', border: '1px solid #6ee7b7' }}>
                      <strong>Example:</strong> "First Day Sukkos Shacharis" created a month in advance<br/>
                      → Set Specific Date: October 17, 2025 (first day of Sukkos)<br/>
                      → Set Base Time: Netz + 30 minutes<br/>
                      → Display Days: All days<br/>
                      → <strong>Result:</strong> Shows October 17's Netz + 30 min every day until you delete it<br/>
                      → Perfect for advance holiday planning
                    </div>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginTop: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#166534', marginBottom: 'clamp(10px, 2vw, 12px)' }}>
                    Step-by-Step: Creating a Custom Time
                  </h4>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 1: Access the Creation Form</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Go to "Zmanim Settings" from the top menu</li>
                      <li>Scroll down past the Available Fields section</li>
                      <li>Click the green "+ Add Custom Time" button</li>
                      <li>A modal window will pop up with the creation form</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 2: Name Your Custom Time</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      <li><strong>Internal Name:</strong> A unique identifier (lowercase, no spaces, 3+ chars) - e.g., "friday_mincha" or "sunday_shacharis"</li>
                      <li><strong>Display Name:</strong> What shows on your screen - e.g., "Friday Mincha" or "Sunday Shacharis"</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 3: Choose Time Type</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      <li><strong>Fixed Time:</strong> Select this and enter the exact time (e.g., 8:00 AM)</li>
                      <li><strong>Dynamic Time:</strong> Select this if you want it calculated from a zman</li>
                      <li>If Dynamic, choose a Base Time from the dropdown (e.g., "Shkiah", "Neitz", "Plag HaMincha")</li>
                      <li>Then enter Offset Minutes (positive for after, negative for before) - e.g., -20 for "20 minutes before"</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 4: Select Calculation Mode</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      <li><strong>Daily:</strong> Most common - each day uses that day's own calculation</li>
                      <li><strong>Weekly Target:</strong> Choose a target weekday - all days will show that weekday's time</li>
                      <li><strong>Specific Date:</strong> Pick a calendar date - all days show that date's time (useful for holidays)</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 5: Choose Display Days</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Check "Daily" to show it every day, OR</li>
                      <li>Uncheck "Daily" and select specific days (Sun, Mon, Tue, Wed, Thu, Fri, Sat)</li>
                      <li>The time will ONLY appear on the days you select</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 6: Add Description (Optional)</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Add a note for yourself to remember what this custom time is for
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Step 7: Save and Use</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Click "Create Custom Time" button at the bottom of the modal</li>
                      <li>Your custom time will now appear in the "Custom" box in Available Fields</li>
                      <li>Drag it to one of your 4 display boxes at the top</li>
                      <li>It's now live on your display!</li>
                    </ul>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginTop: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#9a3412', marginBottom: '10px' }}>
                    Real-World Examples:
                  </h4>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#9a3412', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Example 1: Sunday Morning Shacharis</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#9a3412', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Internal Name: sunday_shacharis</li>
                      <li>Display Name: Sunday Shacharis</li>
                      <li>Time Type: Fixed → 8:00 AM</li>
                      <li>Calculation Mode: Daily (doesn't matter for fixed times)</li>
                      <li>Display Days: Sunday only</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#9a3412', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Example 2: Friday Mincha (All Week)</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#9a3412', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Internal Name: friday_mincha</li>
                      <li>Display Name: Friday Mincha</li>
                      <li>Time Type: Dynamic → Base Time: Shkiah → Offset: -18 minutes</li>
                      <li>Calculation Mode: Weekly Target → Target Weekday: Friday</li>
                      <li>Display Days: Sun, Mon, Tue, Wed, Thu, Fri</li>
                      <li>Result: Shows Friday's Shkiah -18 min all week long</li>
                    </ul>
                  </div>

                  <div>
                    <strong style={{ color: '#9a3412', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Example 3: Early Weekday Mincha</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#9a3412', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Internal Name: early_mincha</li>
                      <li>Display Name: Early Mincha</li>
                      <li>Time Type: Dynamic → Base Time: Mincha Gedola → Offset: +15 minutes</li>
                      <li>Calculation Mode: Daily</li>
                      <li>Display Days: Sun, Mon, Tue, Wed, Thu</li>
                      <li>Result: Shows 15 min after Mincha Gedola every weekday</li>
                    </ul>
                  </div>
                </div>

                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    <strong>Pro Tip:</strong> The "Weekly Target Day" mode is especially useful for showing important weekly events like "Early Shabbos Mincha" or "Leil Shabbos Maariv" throughout the week so everyone knows what time to expect. It automatically updates each week!
                  </span>
                </div>

                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginTop: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#991b1b', marginBottom: '8px' }}>
                    ⚠️ Important Notes:
                  </h4>
                  <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#991b1b', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginBottom: 0 }}>
                    <li>If a custom time doesn't appear on the display, check that today's day is selected in "Display Days"</li>
                    <li>You can Edit or Delete custom times by clicking the buttons in the Custom box</li>
                    <li>Deleting a custom time will remove it from all display boxes where it's being used</li>
                    <li>Internal names must be unique - you can't have two custom times with the same internal name</li>
                    <li>Changes to custom times appear on the display within 5 minutes (auto-refresh)</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 - Styling & Branding */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>3</div>
                <h3 style={styles.stepTitle}>Customize Colors, Fonts, and Branding</h3>
                <p style={styles.stepDescription}>
                  Make your display look exactly how you want it! You have complete control over colors, fonts, logos, and backgrounds.
                </p>

                <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#0c4a6e', marginBottom: '10px' }}>
                    Two Places to Customize:
                  </h4>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#0c4a6e', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>1. Shul Settings (Global Styling)</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#0369a1', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Settings that apply to the entire display - logos, center text, global colors, backgrounds
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: '#0c4a6e', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>2. Zmanim Settings (Per-Box Styling)</strong>
                    <p style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#0369a1', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px', marginBottom: 0 }}>
                      Individual styling for each of the 4 display boxes - fonts, colors, text sizes
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                    Shul Settings - Global Styling Options:
                  </h4>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Branding & Identity Section:</strong>

                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', marginTop: '8px', marginBottom: '10px' }}>
                      <strong style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Center Logo:</strong>
                      <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px' }}>
                        <li>Upload an image file (PNG, JPG, etc.)</li>
                        <li>Adjust logo size with the slider (100px - 600px)</li>
                        <li>Recommended size: 400x400px for best quality</li>
                        <li>Remove logo anytime with "Remove Logo" button</li>
                        <li><strong>Note:</strong> Logo takes priority - if you have both logo and text, only logo shows</li>
                      </ul>
                    </div>

                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', marginTop: '8px', marginBottom: '10px' }}>
                      <strong style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Center Text (if no logo):</strong>
                      <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px' }}>
                        <li><strong>Text:</strong> Enter your shul's name or any text</li>
                        <li><strong>Text Size:</strong> Slider from 24px to 96px</li>
                        <li><strong>Text Color:</strong> Click the color picker or enter hex code (e.g., #ffc764)</li>
                        <li><strong>Font Style:</strong> Choose from 12 fonts (Arial, Times New Roman, Georgia, etc.)</li>
                        <li><strong>Vertical Position:</strong> Slider - 0=top, 50=center, 100=bottom of the screen</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Visual Styling Section:</strong>

                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', marginTop: '8px', marginBottom: '10px' }}>
                      <strong style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Color Scheme:</strong>
                      <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px' }}>
                        <li><strong>Box Outline Color:</strong> The border color for ALL 4 display boxes (applies globally)</li>
                        <li><strong>Header Text Color:</strong> Color for the date/time text in the top header bar</li>
                        <li><strong>Header Background Color:</strong> Background color for the top header bar</li>
                        <li>Each has a color picker + text input for precise hex codes</li>
                      </ul>
                    </div>

                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', marginTop: '8px' }}>
                      <strong style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Background:</strong>
                      <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px' }}>
                        <li><strong>Default Background:</strong> The built-in gradient background</li>
                        <li><strong>Solid Color:</strong> Choose any solid color with color picker</li>
                        <li><strong>Custom Image:</strong> Upload your own background image (1920x1080px recommended)</li>
                        <li>Can remove custom backgrounds with "Remove Background" button</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '6px', padding: 'clamp(10px, 2vw, 12px)', marginTop: '10px' }}>
                    <p style={{ color: '#1e40af', fontSize: 'clamp(12px, 2.3vw, 13px)', lineHeight: '1.6', margin: 0 }}>
                      <strong>💡 Tip:</strong> After making changes in Shul Settings, scroll to the bottom and click <strong>"Save Configuration"</strong> to apply them!
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                    Zmanim Settings - Per-Box Styling:
                  </h4>

                  <p style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)', lineHeight: '1.7', marginBottom: '10px' }}>
                    Each of the 4 display boxes (Box 1, Box 2, Box 3, Box 4) can be styled individually with unique fonts, colors, and sizes.
                  </p>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>How to Access Box Styling:</strong>
                    <ol style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginTop: '4px' }}>
                      <li>Go to "Zmanim Settings" from the top menu</li>
                      <li>Look at the 4 display boxes at the top of the page</li>
                      <li>Each box has a "Customize Appearance" button - click it to expand the styling panel</li>
                    </ol>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Box 1 & Box 2 (Tall Boxes) - Full Styling:</strong>
                    <div style={{ marginLeft: 'clamp(16px, 3vw, 20px)', marginTop: '8px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Title Style:</strong>
                        <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                          <li><strong>Font:</strong> Choose from 10 font options (Arial, Times New Roman, Georgia, etc.)</li>
                          <li><strong>Color:</strong> Color picker for the box title/name</li>
                        </ul>
                      </div>
                      <div>
                        <strong style={{ color: '#6b7280', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>Content Style:</strong>
                        <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                          <li><strong>Font:</strong> Font for all items inside the box</li>
                          <li><strong>Color:</strong> Text color for all items</li>
                          <li><strong>Size:</strong> Number input (8-72px) - controls all text in the box</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <strong style={{ color: '#374151', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Box 3 & Box 4 (Small Boxes) - Content Only:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px' }}>
                      <li>No separate title styling (these boxes are smaller)</li>
                      <li>Only Content Style options: Font, Color, Size</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '6px', padding: 'clamp(10px, 2vw, 12px)', marginTop: '10px' }}>
                    <p style={{ color: '#1e40af', fontSize: 'clamp(12px, 2.3vw, 13px)', lineHeight: '1.6', margin: 0 }}>
                      <strong>💡 Tip:</strong> Box styling changes save <strong>automatically</strong> - no save button needed! Changes appear on your display within 5 minutes.
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#9a3412', marginBottom: '10px' }}>
                    Styling Best Practices:
                  </h4>
                  <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#9a3412', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)', marginBottom: 0 }}>
                    <li><strong>Contrast is Key:</strong> Use light text on dark backgrounds or dark text on light backgrounds for readability</li>
                    <li><strong>Font Sizes:</strong> Larger is usually better for TVs viewed from a distance (22-28px recommended)</li>
                    <li><strong>Consistency:</strong> Use similar colors across boxes for a cohesive look</li>
                    <li><strong>Test on TV:</strong> Colors and sizes look different on a TV vs. computer screen - check your actual display</li>
                    <li><strong>Hebrew Text:</strong> Some fonts display Hebrew better than others - test if using Hebrew language</li>
                    <li><strong>Box Borders:</strong> A subtle outline color (like gold #d4af37) helps separate boxes visually</li>
                  </ul>
                </div>

                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: 'clamp(14px, 3vw, 18px)', marginTop: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(15px, 3vw, 16px)', fontWeight: '600', color: '#166534', marginBottom: '10px' }}>
                    Example Color Schemes:
                  </h4>

                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Traditional Gold & Navy:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Box Outline: #d4af37 (Gold)</li>
                      <li>Box Text: #ffc764 (Light Gold)</li>
                      <li>Header Background: #162A45 (Navy Blue)</li>
                      <li>Background: Default gradient or dark blue</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>Clean Modern:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Box Outline: #3b82f6 (Blue)</li>
                      <li>Box Text: #1e293b (Dark Gray)</li>
                      <li>Header Background: #ffffff (White)</li>
                      <li>Background: Light gray or white</li>
                    </ul>
                  </div>

                  <div>
                    <strong style={{ color: '#166534', fontSize: 'clamp(14px, 2.5vw, 15px)' }}>High Contrast:</strong>
                    <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#15803d', lineHeight: '1.6', fontSize: 'clamp(12px, 2.3vw, 13px)', marginTop: '4px', marginBottom: 0 }}>
                      <li>Box Outline: #ffffff (White)</li>
                      <li>Box Text: #ffffff (White)</li>
                      <li>Header Background: #000000 (Black)</li>
                      <li>Background: Solid black #000000</li>
                    </ul>
                  </div>
                </div>

                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    <strong>Pro Tip:</strong> Start with the default colors and make small adjustments. Preview your changes on the actual TV display to ensure everything is readable from across the room!
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>4</div>
                <h3 style={styles.stepTitle}>Connect Your Computer to the TV</h3>
                <p style={styles.stepDescription}>
                  Now let's get this on your shul's screen:
                </p>
                <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.8', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                  <li>Take an HDMI cable and connect one end to your computer</li>
                  <li>Connect the other end to your TV or monitor</li>
                  <li>Turn on the TV and select the correct HDMI input (usually labeled HDMI 1, HDMI 2, etc.)</li>
                  <li>You should see your computer screen appear on the TV</li>
                </ul>
                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    If you don't see anything, press the "Source" or "Input" button on your TV remote and select the right HDMI port.
                  </span>
                </div>
              </div>

              {/* Step 4 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>4</div>
                <h3 style={styles.stepTitle}>Open Your Display Page</h3>
                <p style={styles.stepDescription}>
                  Now open the display on your computer:
                </p>
                <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.8', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                  <li>Click the "Shul Display" button at the top of this page</li>
                  <li>Your shul's display will open in a new tab</li>
                  <li>Press F11 on your keyboard to make it fullscreen</li>
                  <li>Bookmark this page so you can find it easily later</li>
                </ul>
                <div style={styles.highlightBox}>
                  <div style={styles.highlightTitle}>Important: Keep This Page Open</div>
                  <div style={styles.highlightText}>
                    Leave this page open on your computer 24/7. The zmanim will update automatically every day.
                    Don't close the browser or turn off the computer!
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>5</div>
                <h3 style={styles.stepTitle}>Configure Power & Sleep Settings</h3>
                <p style={styles.stepDescription}>
                  To keep the display running all the time:
                </p>
                <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.8', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                  <li><strong>Windows:</strong> Go to Settings → System → Power & Sleep. Set "Screen" and "Sleep" to "Never"</li>
                  <li><strong>Mac:</strong> Go to System Preferences → Energy Saver. Set "Turn display off after" to "Never"</li>
                  <li>Disable the screensaver in Display settings</li>
                </ul>
                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    This ensures your display stays on all day and doesn't go to sleep during davening!
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <span>🔧</span>
            Common Questions & Troubleshooting
          </h2>
          <ul style={styles.troubleshootingList}>
            {troubleshooting.map((item, index) => {
              const isOpen = openQuestion === index;

              return (
                <li
                  key={index}
                  style={styles.troubleshootingItem}
                  onClick={() => toggleQuestion(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={styles.troubleshootingQuestion}>
                    <span>Q: {item.question}</span>
                    <span style={{
                      ...styles.expandIcon,
                      ...(isOpen ? styles.expandIconOpen : {})
                    }}>
                      ▼
                    </span>
                  </div>
                  {isOpen && (
                    <div style={{ ...styles.troubleshootingAnswer, marginTop: 'clamp(8px, 2vw, 12px)', paddingTop: 'clamp(8px, 2vw, 12px)', borderTop: '1px solid #e5e7eb' }}>
                      A: {item.answer}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Final Tips Section */}
        <div style={styles.section}>
          <div style={{ ...styles.card, backgroundColor: '#f0fdf4', border: '2px solid #86efac' }}>
            <h3 style={{ fontSize: 'clamp(1.1rem, 3.5vw, 1.25rem)', fontWeight: '600', color: '#166534', marginBottom: 'clamp(12px, 2.5vw, 15px)' }}>
              ✅ You're All Set!
            </h3>
            <p style={{ fontSize: 'clamp(14px, 2.8vw, 15px)', color: '#15803d', lineHeight: '1.7' }}>
              That's it! Your shul display is now up and running. The zmanim will update automatically every day,
              and you can make changes anytime from "Shul Settings" or "Zmanim Settings."
            </p>
            <p style={{ fontSize: 'clamp(14px, 2.8vw, 15px)', color: '#15803d', lineHeight: '1.7', marginTop: 'clamp(12px, 2.5vw, 15px)' }}>
              If you need to make any changes to what's displayed, just come back to this website,
              log in, and adjust the settings. The changes will appear on your display within a few minutes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Setup;
