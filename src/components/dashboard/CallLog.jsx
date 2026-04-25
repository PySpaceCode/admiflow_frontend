"use client";
import React, { useState } from 'react';

export default function CallLog({ log }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Connected': return 'badge-success';
      case 'No Answer': return 'badge-warning';
      case 'Failed': return 'badge-danger';
      case 'Voicemail': return 'badge-neutral';
      default: return 'badge-neutral';
    }
  };

  const getOutcomeBadge = (outcome) => {
    switch(outcome) {
      case 'Booked': return 'badge-success';
      case 'Interested': return 'badge-primary';
      case 'Not Interested': return 'badge-danger';
      case 'Pending': return 'badge-warning';
      default: return 'badge-neutral';
    }
  };

  return (
    <div className="card" style={{ marginBottom: '16px', padding: '16px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div style={{ flex: '1 1 200px' }}>
          <div style={{ fontWeight: '600', fontSize: '15px' }}>{log.lead_name}</div>
          <div className="text-muted data-text" style={{ fontSize: '14px', letterSpacing: '0.02em' }}>{log.phone}</div>
        </div>
        
        <div style={{ flex: '1 1 150px' }}>
          <div style={{ fontSize: '14px' }}>{log.call_time}</div>
          <div className="text-muted" style={{ fontSize: '13px' }}>Duration: {log.duration}</div>
        </div>

        <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div><span className={`badge ${getStatusBadge(log.status)}`}>{log.status}</span></div>
          <div><span className={`badge ${getOutcomeBadge(log.outcome)}`}>{log.outcome}</span></div>
        </div>

        <div>
          <button className="btn-outline" onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide Transcript' : 'Play Transcript ►'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: '16px', background: 'var(--color-surface-low)', padding: '16px', borderRadius: '12px' }}>
          <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TRANSCRIPT</h4>
          {log.transcript ? (
            <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{log.transcript}</p>
          ) : (
            <p className="text-muted" style={{ fontStyle: 'italic', fontSize: '13px' }}>No transcript available for this call.</p>
          )}
        </div>
      )}
    </div>
  );
}


