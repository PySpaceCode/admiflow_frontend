"use client";
import React from 'react';
import { showToast } from '@/lib/toast';

export default function WhatsApp() {
  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>WhatsApp Integration</h2>
        <p className="text-muted" style={{ margin: 0, fontSize: '15px' }}>
          Connect the Admission AI to your official WhatsApp Business API to handle inbound and outbound student conversations directly through WhatsApp.
        </p>
        
        <div style={{ padding: '24px', background: 'var(--color-surface)', border: '1px solid var(--color-success, #16a34a)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✓</div>
            <div>
              <h3 style={{ fontSize: '16px', margin: '0 0 4px 0', color: 'var(--color-success, #16a34a)' }}>Connected</h3>
              <p style={{ margin: 0, fontSize: '14px', fontFamily: 'monospace', color: 'var(--color-on-surface)' }}>+1 987 654 3210</p>
            </div>
          </div>
          <div>
            <button className="btn-outline" onClick={() => showToast('Manage connection pending...', 'info')}>Manage Connection</button>
          </div>
        </div>
      </div>
    </div>
  );
}



