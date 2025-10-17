import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

function Suggestions() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject_type: 'Feature Request',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setSubmitMessage('');

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setSubmitMessage('Please log in to submit feedback');
        setSubmitting(false);
        return;
      }

      const response = await fetch(`${API_URL}/feedback/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message || 'Thank you for your feedback!');
        // Clear form
        setFormData({
          name: '',
          email: '',
          subject_type: 'Feature Request',
          message: ''
        });
      } else {
        setSubmitMessage(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const pageStyles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      padding: '0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    header: {
      background: 'linear-gradient(to right, #ffffff 0%, #f8fafc 100%)',
      color: '#1e293b',
      padding: 'clamp(24px, 4vw, 32px) clamp(16px, 4vw, 40px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      marginBottom: '0',
      borderBottom: '1px solid #e2e8f0'
    },
    headerTitle: {
      margin: '0 0 clamp(6px, 1.5vw, 8px) 0',
      fontSize: 'clamp(1.5rem, 4vw, 1.75rem)',
      fontWeight: '600',
      letterSpacing: '-0.3px',
      color: '#0f172a'
    },
    headerSubtitle: {
      margin: '0',
      fontSize: 'clamp(14px, 2.8vw, 16px)',
      fontWeight: '400',
      color: '#64748b',
      lineHeight: '1.6'
    },
    contentWrapper: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: 'clamp(20px, 4vw, 40px)',
    },
    introSection: {
      backgroundColor: '#ffffff',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(20px, 4vw, 32px)',
      marginBottom: 'clamp(24px, 4vw, 32px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0'
    },
    introTitle: {
      fontSize: 'clamp(1.1rem, 3vw, 1.25rem)',
      fontWeight: '600',
      color: '#0f172a',
      marginBottom: 'clamp(12px, 2.5vw, 16px)',
      marginTop: '0'
    },
    introText: {
      fontSize: 'clamp(14px, 2.8vw, 15px)',
      lineHeight: '1.7',
      color: '#475569',
      marginBottom: 'clamp(10px, 2vw, 12px)'
    },
    formCard: {
      backgroundColor: '#ffffff',
      borderRadius: 'clamp(8px, 2vw, 12px)',
      padding: 'clamp(20px, 4vw, 32px)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #e2e8f0'
    },
    formGroup: {
      marginBottom: 'clamp(18px, 3.5vw, 24px)'
    },
    label: {
      display: 'block',
      marginBottom: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      fontWeight: '600',
      color: '#374151'
    },
    required: {
      color: '#ef4444',
      marginLeft: '4px'
    },
    input: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 10px) clamp(12px, 2.5vw, 14px)',
      border: '1px solid #d1d5db',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(14px, 2.8vw, 15px)',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 10px) clamp(12px, 2.5vw, 14px)',
      border: '1px solid #d1d5db',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(14px, 2.8vw, 15px)',
      fontFamily: 'inherit',
      minHeight: 'clamp(120px, 25vw, 150px)',
      resize: 'vertical',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: 'clamp(8px, 2vw, 10px) clamp(12px, 2.5vw, 14px)',
      border: '1px solid #d1d5db',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(14px, 2.8vw, 15px)',
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      cursor: 'pointer',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    },
    error: {
      color: '#ef4444',
      fontSize: 'clamp(12px, 2.3vw, 13px)',
      marginTop: 'clamp(4px, 1vw, 6px)'
    },
    submitButton: {
      backgroundColor: submitting ? '#9ca3af' : '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      padding: 'clamp(10px, 2.5vw, 12px) clamp(24px, 5vw, 32px)',
      fontSize: 'clamp(14px, 2.8vw, 15px)',
      fontWeight: '600',
      cursor: submitting ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
      width: '100%'
    },
    successMessage: {
      padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
      marginBottom: 'clamp(18px, 3.5vw, 24px)',
      backgroundColor: '#d1fae5',
      color: '#065f46',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      fontWeight: '500',
      border: '1px solid #a7f3d0'
    },
    errorMessage: {
      padding: 'clamp(12px, 2.5vw, 16px) clamp(16px, 3vw, 20px)',
      marginBottom: 'clamp(18px, 3.5vw, 24px)',
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      borderRadius: 'clamp(6px, 1.5vw, 8px)',
      fontSize: 'clamp(13px, 2.5vw, 14px)',
      fontWeight: '500',
      border: '1px solid #fecaca'
    }
  };

  return (
    <div style={pageStyles.pageContainer}>
      <div style={pageStyles.header}>
        <h1 style={pageStyles.headerTitle}>Share Your Suggestions</h1>
        <p style={pageStyles.headerSubtitle}>Help us improve Shul Schedule for your community</p>
      </div>

      <div style={pageStyles.contentWrapper}>
        <div style={pageStyles.introSection}>
          <h2 style={pageStyles.introTitle}>We're Here to Serve You</h2>
          <p style={pageStyles.introText}>
            Shul Schedule is a new platform, and we're committed to continuously improving our service to better meet the needs of your community.
          </p>
          <p style={pageStyles.introText}>
            Your feedback is invaluable to us. Whether you have ideas for new features, suggestions for improvements, encountered a bug, or simply want to share your experience - we want to hear from you.
          </p>
          <p style={pageStyles.introText}>
            Every suggestion is carefully reviewed by our team, and we're dedicated to implementing changes that will enhance your experience.
          </p>
        </div>

        <div style={pageStyles.formCard}>
          {submitMessage && (
            <div style={submitMessage.includes('error') || submitMessage.includes('Failed') ? pageStyles.errorMessage : pageStyles.successMessage}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={pageStyles.formGroup}>
              <label style={pageStyles.label}>
                Your Name<span style={pageStyles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  ...pageStyles.input,
                  borderColor: errors.name ? '#ef4444' : '#d1d5db'
                }}
                placeholder="Enter your name"
              />
              {errors.name && <div style={pageStyles.error}>{errors.name}</div>}
            </div>

            <div style={pageStyles.formGroup}>
              <label style={pageStyles.label}>
                Email Address<span style={pageStyles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...pageStyles.input,
                  borderColor: errors.email ? '#ef4444' : '#d1d5db'
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && <div style={pageStyles.error}>{errors.email}</div>}
            </div>

            <div style={pageStyles.formGroup}>
              <label style={pageStyles.label}>
                Type of Feedback<span style={pageStyles.required}>*</span>
              </label>
              <select
                name="subject_type"
                value={formData.subject_type}
                onChange={handleChange}
                style={pageStyles.select}
              >
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Improvement Suggestion">Improvement Suggestion</option>
                <option value="General Feedback">General Feedback</option>
                <option value="Question">Question</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={pageStyles.formGroup}>
              <label style={pageStyles.label}>
                Your Message<span style={pageStyles.required}>*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={{
                  ...pageStyles.textarea,
                  borderColor: errors.message ? '#ef4444' : '#d1d5db'
                }}
                placeholder="Tell us what's on your mind... Please be as detailed as possible."
              />
              {errors.message && <div style={pageStyles.error}>{errors.message}</div>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={pageStyles.submitButton}
              onMouseEnter={(e) => {
                if (!submitting) e.target.style.backgroundColor = '#2563eb';
              }}
              onMouseLeave={(e) => {
                if (!submitting) e.target.style.backgroundColor = '#3b82f6';
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Suggestions;
