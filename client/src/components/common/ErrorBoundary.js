import React, { Component } from 'react';
import { AlertTriangle } from './Icons';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { fallback } = this.props;
    if (this.state.hasError) {
      return (
        fallback || (
          <div className="error-state">
            <div className="error-state-icon"><AlertTriangle size={48} /></div>
            <h3>Something went wrong</h3>
            <button type="button" className="btn btn-outline" onClick={this.handleRetry}>Try Again</button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
