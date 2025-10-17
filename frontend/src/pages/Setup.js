import React from 'react';

const Setup = () => {
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
      marginBottom: 'clamp(12px, 2.5vw, 15px)'
    },
    troubleshootingQuestion: {
      fontSize: 'clamp(15px, 3vw, 16px)',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: 'clamp(6px, 1.5vw, 8px)'
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
      question: 'The display shows old zmanim',
      answer: 'Check that your internet connection is working. The display updates automatically every 5 minutes, but needs internet to get new times. Try refreshing the page by pressing F5.'
    },
    {
      question: 'I can\'t find the display URL',
      answer: 'Click the "Shul Display" button in the top navigation bar. Your unique display link will open in a new tab. Bookmark this page for easy access.'
    },
    {
      question: 'I want to hide the mouse cursor',
      answer: 'Press F11 to enter fullscreen mode. The cursor will hide automatically after a few seconds of no movement.'
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
                  Go to "Shul Settings" in the top menu and fill in your shul's information:
                </p>
                <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.8', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                  <li>Enter your zip code (this calculates accurate zmanim for your location)</li>
                  <li>Choose your minhag (Ashkenazi or Sephardi)</li>
                  <li>Pick your preferred language</li>
                  <li>Customize colors and fonts if you'd like</li>
                </ul>
                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    The zip code is the most important part—this is how we calculate the correct zmanim for your exact location!
                  </span>
                </div>
              </div>

              {/* Step 2 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>2</div>
                <h3 style={styles.stepTitle}>Arrange Your Display</h3>
                <p style={styles.stepDescription}>
                  Go to "Zmanim Settings" and drag the zmanim you want into the display boxes:
                </p>
                <ul style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#6b7280', lineHeight: '1.8', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                  <li>Drag important times (like Shacharis, Mincha, Maariv) into "Shabbos Times" and "Weekday Times" boxes</li>
                  <li>Add Daf Yomi, Parsha, and other learning schedules</li>
                  <li>Include any custom minyan times or announcements</li>
                  <li>Remove items you don't need by clicking the × button</li>
                </ul>
                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    You can rearrange items by dragging them up or down within a box. Changes save automatically!
                  </span>
                </div>
              </div>

              {/* Step 2.5 - Custom Times Feature */}
              <div style={styles.stepItem}>
                <div style={{ ...styles.stepNumber, backgroundColor: '#8b5cf6' }}>2.5</div>
                <h3 style={styles.stepTitle}>Create Custom Times (Optional)</h3>
                <p style={styles.stepDescription}>
                  Need to show specific minyan times or special events? Use Custom Times to create times that aren't in the standard zmanim list:
                </p>

                <div style={{ marginTop: 'clamp(16px, 3vw, 20px)', marginBottom: 'clamp(16px, 3vw, 20px)' }}>
                  <h4 style={{ fontSize: 'clamp(16px, 3vw, 17px)', fontWeight: '600', color: '#2c3e50', marginBottom: 'clamp(10px, 2vw, 12px)' }}>
                    Three Calculation Modes:
                  </h4>

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

                <div style={{ backgroundColor: '#f9fafb', borderLeft: '4px solid #3b82f6', padding: 'clamp(12px, 2.5vw, 15px)', marginTop: 'clamp(16px, 3vw, 20px)' }}>
                  <div style={{ fontSize: 'clamp(14px, 2.8vw, 15px)', fontWeight: '600', color: '#1e40af', marginBottom: 'clamp(6px, 1.5vw, 8px)' }}>
                    How to Create a Custom Time:
                  </div>
                  <ol style={{ marginLeft: 'clamp(16px, 3vw, 20px)', color: '#4b5563', lineHeight: '1.7', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                    <li>Go to "Zmanim Settings"</li>
                    <li>Scroll to "Create Custom Time" section</li>
                    <li>Choose between <strong>Fixed Time</strong> (e.g., 7:00 PM) or <strong>Dynamic Time</strong> (e.g., 10 min before Shkiah)</li>
                    <li>Select your <strong>Calculation Mode</strong> (Daily, Weekly Target, or Specific Date)</li>
                    <li>Choose which days to <strong>display</strong> this time on the screen</li>
                    <li>Drag it into one of your display boxes</li>
                  </ol>
                </div>

                <div style={styles.tipBox}>
                  <span style={styles.tipIcon}>💡</span>
                  <span style={styles.tipText}>
                    <strong>Pro Tip:</strong> The "Weekly Target Day" mode is especially useful for showing important weekly events like "Early Shabbos Mincha" or "Netz Shacharis on Shabbos Day" throughout the week so everyone knows what time to expect.
                  </span>
                </div>
              </div>

              {/* Step 3 */}
              <div style={styles.stepItem}>
                <div style={styles.stepNumber}>3</div>
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
            {troubleshooting.map((item, index) => (
              <li key={index} style={styles.troubleshootingItem}>
                <div style={styles.troubleshootingQuestion}>Q: {item.question}</div>
                <div style={styles.troubleshootingAnswer}>A: {item.answer}</div>
              </li>
            ))}
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
