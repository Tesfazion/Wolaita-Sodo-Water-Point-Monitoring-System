import React from 'react';
import { Inbox, AlertTriangle } from './Icons';

const AsyncState = ({ loading, error, empty, onRetry, emptyIcon = <Inbox size={48} />, children }) => {
  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner-lg spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-state-icon"><AlertTriangle size={48} /></div>
        <h3>{error}</h3>
        {onRetry && (
          <button type="button" className="btn btn-outline" onClick={onRetry}>Try Again</button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="card">
        <div className="card-body empty-state">
          <div className="empty-state-icon">{emptyIcon}</div>
          <h3>{empty}</h3>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AsyncState;
