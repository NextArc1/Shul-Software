import React from 'react';
import * as Sentry from "@sentry/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // Send error to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div style={{
          padding: '40px',
          maxWidth: '600px',
          margin: '40px auto',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '8px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#856404', marginTop: 0 }}>Something went wrong</h2>
          <p style={{ color: '#856404' }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          {this.props.showDetails && this.state.error && (
            <details style={{ marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', color: '#856404', fontWeight: 'bold' }}>
                Error Details
              </summary>
              <pre style={{
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: '#856404',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
