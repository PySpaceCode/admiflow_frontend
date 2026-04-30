"use client";
import React, { useState } from 'react';
import { showToast } from '@/lib/toast';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Institute Profile', icon: '🏫' },
    { id: 'team', label: 'Team & Agents', icon: '👥' },
    { id: 'schedule', label: 'Calling Schedule', icon: '⏰' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'billing', label: 'Billing & Plans', icon: '💳' }
  ];

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  // --- Sub-components for Settings Sections ---

  const renderProfile = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '18px', margin: 0 }}>Institute Profile</h2>
      <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Manage your institution's core details and branding.</p>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '8px', background: 'var(--color-surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: '1px dashed var(--color-on-surface-variant)' }}>
           🏢
        </div>
        <div>
          <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>Upload Logo</button>
          <p className="text-muted" style={{ fontSize: '11px', marginTop: '8px' }}>Recommended size: 400x400px</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Institute Name</label>
          <input type="text" defaultValue="Global Tech University" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Primary Contact Email</label>
          <input type="email" defaultValue="admissions@globaltech.edu" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500' }}>Address</label>
        <textarea defaultValue="123 Education Boulevard, Innovation City, ST 12345" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', fontFamily: 'inherit', resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="btn" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );

  const renderTeam = () => {
    const dummyTeam = [
      { id: 1, name: 'Alice Smith', email: 'alice@globaltech.edu', role: 'Admin' },
      { id: 2, name: 'John Doe', email: 'john@globaltech.edu', role: 'Agent' },
      { id: 3, name: 'Sarah Adams', email: 'sarah@globaltech.edu', role: 'Agent' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Team & Agents</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Manage administrative access and human fallback agents.</p>
          </div>
          <button className="btn-primary" onClick={() => showToast('Invite modal pending...', 'info')}>Invite new member</button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyTeam.map(member => (
                <tr key={member.id}>
                  <td style={{ fontWeight: '500' }}>{member.name}</td>
                  <td style={{ color: 'var(--color-on-surface-variant)' }}>{member.email}</td>
                  <td>
                    <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '12px', background: 'var(--color-surface-high)', fontWeight: '600' }}>{member.role}</span>
                  </td>
                  <td>
                    <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', border: 'none' }}>Edit</button>
                    <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '11px', border: 'none', color: 'var(--color-danger)' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderSchedule = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '18px', margin: 0 }}>Calling Schedule Defaults</h2>
      <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Set the global operational boundries for all AI outbound communication.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Timezone</label>
          <select defaultValue="America/New_York" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}>
            <option value="America/New_York">EST - Eastern Standard Time</option>
            <option value="America/Chicago">CST - Central Standard Time</option>
            <option value="America/Denver">MST - Mountain Standard Time</option>
            <option value="America/Los_Angeles">PST - Pacific Standard Time</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Business Hours Start</label>
            <input type="time" defaultValue="09:00" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Business Hours End</label>
            <input type="time" defaultValue="17:30" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button className="btn" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );

  const renderNotifications = () => {
    const notifyOptions = [
      { id: 'daily', label: 'Daily Summary Email', desc: 'Receive a daily aggregation of all AI calls and text volumes.' },
      { id: 'alert', label: 'New Lead Alerts', desc: 'Notify immediately when a new lead is imported and processed.' },
      { id: 'handoff', label: 'Live Handoff Alerts', desc: 'Browser and mobile notifications requiring immediate human agent attention.' },
      { id: 'health', label: 'System Health Alerts', desc: 'Warnings regarding low funds, disconnected integrations, or errors.' }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Notifications & Alerts</h2>
        <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Configure how and when your team is alerted about platform activity.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifyOptions.map((opt, i) => (
            <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: i < notifyOptions.length - 1 ? '1px solid var(--color-surface-high)' : 'none' }}>
              <div style={{ paddingRight: '24px' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{opt.label}</h4>
                <p className="text-muted" style={{ margin: 0, fontSize: '13px' }}>{opt.desc}</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                {/* Custom toggle visualization */}
                <div style={{ width: '40px', height: '24px', background: 'var(--color-primary)', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <button className="btn" onClick={handleSave}>Save Preferences</button>
        </div>
      </div>
    );
  };

  const renderBilling = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '18px', margin: 0 }}>Billing & Plans</h2>
      <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Manage your subscription, balance, and billing history.</p>

      <div style={{ background: 'var(--color-primary-container)', padding: '24px', borderRadius: '8px', color: 'var(--color-on-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>Professional Plan</h3>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Up to 5,000 AI minutes & 20,000 texts / month</p>
          </div>
          <div>
            <span style={{ fontSize: '24px', fontWeight: 'bold' }}>$499</span><span style={{ opacity: 0.9 }}>/mo</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '16px' }}>
           <button style={{ padding: '8px 16px', background: 'var(--color-on-primary)', color: 'var(--color-primary)', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Upgrade Plan</button>
           <button style={{ padding: '8px 16px', background: 'transparent', color: 'var(--color-on-primary)', border: '1px solid var(--color-on-primary)', borderRadius: '4px', fontWeight: '500', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '16px', margin: '0 0 16px 0' }}>Recent Invoices</h3>
        <div className="table-container">
          <table className="table" style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                 <td>Oct 01, 2026</td>
                 <td>$499.00</td>
                 <td><span style={{ color: 'var(--color-success, #16a34a)', fontWeight: '500' }}>Paid</span></td>
                 <td><button onClick={(e) => { e.preventDefault(); showToast('Downloading invoice...', 'info'); }} style={{ background: 'none', border:'none', color: 'var(--color-primary)', textDecoration: 'none', cursor: 'pointer', padding: 0 }}>Invoice-Oct-26.pdf</button></td>
              </tr>
              <tr>
                 <td>Sep 01, 2026</td>
                 <td>$499.00</td>
                 <td><span style={{ color: 'var(--color-success, #16a34a)', fontWeight: '500' }}>Paid</span></td>
                 <td><button onClick={(e) => { e.preventDefault(); showToast('Downloading invoice...', 'info'); }} style={{ background: 'none', border:'none', color: 'var(--color-primary)', textDecoration: 'none', cursor: 'pointer', padding: 0 }}>Invoice-Sep-26.pdf</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', gap: '24px' }}>
      
      <div>
        <h1 className="text-heading" style={{ margin: '0 0 8px 0' }}>Settings</h1>
        <p className="text-muted" style={{ margin: 0 }}>Configure your platform tools, team access, and integrations.</p>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '32px', minHeight: 0 }}>
        
        {/* Left Sidebar Nav */}
        <div style={{ flex: '0 0 240px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                width: '100%',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'var(--color-surface-high)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                fontWeight: activeTab === tab.id ? '600' : '500',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="card" style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'team' && renderTeam()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'billing' && renderBilling()}
        </div>

      </div>

    </div>
  );
}



