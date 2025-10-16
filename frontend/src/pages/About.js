import React from 'react';

const About = () => {
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    heroSection: {
      background: 'linear-gradient(135deg, #162A45 0%, #1e3a5f 100%)',
      color: 'white',
      padding: '80px 40px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    },
    heroTitle: {
      fontSize: '48px',
      fontWeight: '700',
      marginBottom: '20px',
      letterSpacing: '-1px'
    },
    heroSubtitle: {
      fontSize: '22px',
      opacity: 0.9,
      maxWidth: '800px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    contentWrapper: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 40px'
    },
    section: {
      marginBottom: '80px'
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2c3e50',
      marginBottom: '20px',
      textAlign: 'center'
    },
    sectionDescription: {
      fontSize: '18px',
      color: '#6b7280',
      textAlign: 'center',
      maxWidth: '800px',
      margin: '0 auto 50px',
      lineHeight: '1.8'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginTop: '40px'
    },
    featureCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '40px 30px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    featureIcon: {
      fontSize: '48px',
      marginBottom: '20px'
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '12px'
    },
    featureDescription: {
      fontSize: '15px',
      color: '#6b7280',
      lineHeight: '1.6'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      marginTop: '40px'
    },
    statCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '30px',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      border: '2px solid #162A45'
    },
    statNumber: {
      fontSize: '40px',
      fontWeight: '700',
      color: '#162A45',
      marginBottom: '8px'
    },
    statLabel: {
      fontSize: '16px',
      color: '#6b7280',
      fontWeight: '500'
    },
    techSection: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '50px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb'
    },
    techGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    techItem: {
      padding: '20px',
      backgroundColor: '#f9fafb',
      borderRadius: '10px',
      border: '1px solid #e5e7eb'
    },
    techTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '8px'
    },
    techDescription: {
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: '1.5'
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #d4af37 0%, #f5d66d 100%)',
      borderRadius: '16px',
      padding: '60px 40px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(212,175,55,0.3)'
    },
    ctaTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#2a1a06',
      marginBottom: '20px'
    },
    ctaDescription: {
      fontSize: '18px',
      color: '#3a2a16',
      marginBottom: '30px',
      maxWidth: '600px',
      margin: '0 auto 30px'
    },
    ctaButton: {
      padding: '16px 40px',
      fontSize: '18px',
      fontWeight: '600',
      backgroundColor: '#162A45',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(22,42,69,0.3)'
    }
  };

  const features = [
    {
      icon: '🕐',
      title: 'Accurate Zmanim',
      description: 'Display precise zmanim calculated for your exact location, supporting different minhagim and shittos. Never miss zman tefillah or krias shema again.'
    },
    {
      icon: '📚',
      title: 'Daily Shiurim & Learning',
      description: 'Keep your shul updated with the Daf Yomi, Mishna Yomis, this week\'s Parsha, and other daily learning schedules everyone follows.'
    },
    {
      icon: '🎨',
      title: 'Fully Customizable',
      description: 'Personalize colors, fonts, and layouts to match your shul\'s style. Make it look heimish or keep it simple—totally up to you.'
    },
    {
      icon: '📅',
      title: 'Hebrew Calendar (Luach)',
      description: 'Display the Hebrew date, Yomim Tovim, Rosh Chodesh, sefiras ha\'omer, and other important dates from the luach.'
    },
    {
      icon: '⏰',
      title: 'Custom Minyanim',
      description: 'Add your own minyan times for Shacharis, Mincha, Maariv, and special tefillos. Perfect for shuls with multiple daily minyanim.'
    },
    {
      icon: '🌍',
      title: 'Multi-Language Support',
      description: 'Interface available in English, Lashon Kodesh, or transliterated—whatever works best for your shul.'
    }
  ];


  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <h1 style={styles.heroTitle}>Shul Schedule</h1>
        <p style={styles.heroSubtitle}>
          A modern, beautiful way to display accurate zmanim, learning schedules,
          and important information for your shul
        </p>
      </div>

      {/* Main Content */}
      <div style={styles.contentWrapper}>

        {/* About Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>What We Do</h2>
          <p style={styles.sectionDescription}>
            Shul Schedule is a comprehensive digital display system designed specifically for shuls and batei medrash.
            We provide accurate zmanim for all your tefillos, daily shiurim schedules, the luach, and custom
            announcements—all in a beautiful, easy-to-read format that helps your shul daven and learn on time.
          </p>
        </div>

        {/* Features Grid */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Features</h2>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                }}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>By The Numbers</h2>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>30+</div>
              <div style={styles.statLabel}>Different Zmanim</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>8+</div>
              <div style={styles.statLabel}>Daily Shiurim</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>20+</div>
              <div style={styles.statLabel}>Luach Fields</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>100%</div>
              <div style={styles.statLabel}>Customizable</div>
            </div>
          </div>
        </div>

        {/* Zmanim Calculation Disclaimer Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>About Our Zmanim Calculations</h2>
          <div style={styles.techSection}>
            <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{
                backgroundColor: '#fff8e1',
                border: '2px solid #d4af37',
                borderRadius: '12px',
                padding: '30px',
                marginBottom: '30px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#2a1a06', marginBottom: '15px' }}>
                  ⚠️ Important Notice
                </h3>
                <p style={{ fontSize: '16px', color: '#3a2a16', lineHeight: '1.8', marginBottom: '15px' }}>
                  <strong>We did not develop the zmanim calculations used in this application.</strong> All astronomical
                  calculations for the zmanim are powered by the <strong>KosherJava library</strong>, a widely-used and
                  respected open-source project maintained by Eliyahu Hershfeld.
                </p>
                <p style={{ fontSize: '16px', color: '#3a2a16', lineHeight: '1.8' }}>
                  Learn more about KosherJava at:{' '}
                  <a
                    href="https://kosherjava.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#162A45', fontWeight: '600', textDecoration: 'underline' }}
                  >
                    kosherjava.com
                  </a>
                </p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#162A45', marginBottom: '10px' }}>
                  Our Research & Testing
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.8' }}>
                  We have conducted extensive research and comparison of the KosherJava calculations against actual
                  published zmanim from various reliable sources. Based on our testing, the calculations line up
                  perfectly and provide accurate results. However, <strong>we cannot guarantee absolute accuracy in
                  all situations and configurations</strong>.
                </p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#162A45', marginBottom: '10px' }}>
                  Disclaimer of Responsibility
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.8' }}>
                  <strong>We do not take responsibility for any issues, inaccuracies, or problems that may arise
                  from the use of these calculations.</strong> While we have done our due diligence in testing,
                  halachic timekeeping is a serious matter, and each community should verify the calculations
                  independently for their specific needs and circumstances.
                </p>
              </div>

              <div style={{
                backgroundColor: '#e3f2fd',
                border: '2px solid #162A45',
                borderRadius: '12px',
                padding: '30px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#162A45', marginBottom: '15px' }}>
                  📋 Consult With Your Rabbi
                </h3>
                <p style={{ fontSize: '16px', color: '#1e3a5f', lineHeight: '1.8' }}>
                  <strong>Before setting up your account and configuring your shul's zmanim display, we
                  recommend consulting with a rabbi.</strong> Your rabbi can guide you on:
                </p>
                <ul style={{ fontSize: '16px', color: '#1e3a5f', lineHeight: '1.8', marginTop: '15px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '10px' }}>Which zmanim calculations (shittos) to use for your community</li>
                  <li style={{ marginBottom: '10px' }}>Which zmanim should be displayed for your minhagim</li>
                  <li style={{ marginBottom: '10px' }}>Any adjustments specific to your community's customs</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.techSection}>
            <div style={{ textAlign: 'left', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#162A45', marginBottom: '10px' }}>
                  1. Set Up Your Shul's Details
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
                  Enter your shul's location (zip code), pick your minhag and language preference,
                  and customize the colors and fonts to match your shul's style.
                </p>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#162A45', marginBottom: '10px' }}>
                  2. Arrange Your Display
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
                  Drag and drop the zmanim, shiurim, and luach information into boxes—whatever your shul needs to see.
                  Add custom minyan times or announcements for special events.
                </p>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#162A45', marginBottom: '10px' }}>
                  3. Put It Up on Your Screen
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6' }}>
                  Open your unique display link on any TV or monitor in the shul. The zmanim update automatically
                  every day—no maintenance, no headaches. Just set it and forget it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={styles.section}>
          <div style={styles.ctaSection}>
            <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
            <p style={styles.ctaDescription}>
              Give your shul the gift of accurate, beautiful zmanim. It's completely free
              and takes just a few minutes to set up.
            </p>
            <button
              style={styles.ctaButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(22,42,69,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(22,42,69,0.3)';
              }}
              onClick={() => window.location.href = '/admin/setup'}
            >
              Set Up Your Shul Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
