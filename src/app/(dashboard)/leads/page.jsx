"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';
import { api } from '@/lib/api';

export default function Leads() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Form State
  const [config, setConfig] = useState({
    callingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeStart: '09:00',
    timeEnd: '17:00',
    maxAttempts: 3,
    fallbackName: 'John Doe',
    fallbackPhone: '+1 234 567 8900'
  });

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch leads on mount
  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const response = await api.get('/api/leads/');
      if (response.success || Array.isArray(response)) {
        // Handle both wrapped and unwrapped responses
        setLeads(Array.isArray(response) ? response : response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const response = await api.post('/api/leads/upload-csv', formData, true);
      if (response.success) {
        showToast(response.message, 'success');
        fetchLeads(); // Refresh table
      } else {
        showToast(response.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFiles([...files, file]);
      uploadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles([...files, file]);
      uploadFile(file);
    }
  };

  const handleConfigChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setConfig(prev => {
      const isSelected = prev.callingDays.includes(day);
      if (isSelected) {
        return { ...prev, callingDays: prev.callingDays.filter(d => d !== day) };
      } else {
        return { ...prev, callingDays: [...prev.callingDays, day] };
      }
    });
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Helper to format 24h time to 12h with AM/PM
  const format12h = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const handleSaveLaunch = async () => {
    setLoading(true);
    try {
      const payload = {
        callingDays: config.callingDays,
        timeStart: config.timeStart,
        timeEnd: config.timeEnd,
        maxAttempts: parseInt(config.maxAttempts),
        fallbackName: config.fallbackName,
        fallbackPhone: config.fallbackPhone
      };
      
      const response = await api.post('/api/leads/campaign/launch', payload);
      if (response.success) {
        showToast('Agent configuration saved and launched!', 'success');
        setTimeout(() => {
          router.push('/knowledge-base');
        }, 1200);
      } else {
        showToast(response.message || 'Failed to save configuration', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save configuration', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-heading" style={{ margin: '0 0 8px 0' }}>Leads & Configuration</h1>
          <p className="text-muted" style={{ margin: 0 }}>Import your leads and configure the AI agent's calling behavior.</p>
        </div>
      </div>

      {/* Top Section: File Upload */}
      <div className="card">
        <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>1. Bulk Import Leads (CSV)</h2>
        <div 
          style={{
            border: isDragOver ? '2px dashed var(--color-primary)' : '2px dashed var(--color-surface-high)',
            background: isDragOver ? 'var(--color-surface-highest)' : 'var(--color-surface)',
            padding: '48px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'pointer',
            borderRadius: '8px'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ marginBottom: '8px', fontSize: '15px' }}>Drag & drop your CSV file here</h3>
          <p className="text-muted" style={{ marginBottom: '16px', fontSize: '14px' }}>Ensure your CSV includes Name, Phone, and Course fields.</p>
          <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse Files</button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept=".csv" 
            multiple 
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <div style={{ marginTop: '24px', textAlign: 'left', background: 'var(--color-surface-high)', padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '8px', fontSize: '14px' }}>Uploaded Files:</h4>
              <ul style={{ listStylePos: 'inside', fontSize: '14px', color: 'var(--color-on-surface-variant)', margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {files.map((f, i) => <li key={i}>✓ {f.name}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Middle Section: Data Table Preview */}
      <div className="card">
        <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>2. Data Preview</h2>
        <div className="table-container" style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Course Interest</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? leads.map(lead => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td style={{ fontFamily: 'monospace' }}>{lead.phone}</td>
                  <td>{lead.course}</td>
                  <td>
                    <span 
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '16px', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        background: 'var(--color-surface-high)', 
                        color: 'var(--color-on-surface-variant)' 
                      }}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-on-surface-variant)' }}>
                    {loading ? 'Loading leads...' : 'No leads found. Upload a CSV to get started.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="text-muted" style={{ fontSize: '13px', marginTop: '12px', textAlign: 'right' }}>
          {leads.length > 0 ? `Showing ${leads.length} leads.` : ''}
        </p>
      </div>

      {/* Bottom Section: Configuration */}
      <div className="card">
        <h2 style={{ fontSize: '16px', marginBottom: '24px', fontWeight: '600' }}>3. Calling Configuration</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500' }}>Calling Days</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {daysOfWeek.map(day => {
                const isActive = config.callingDays.includes(day);
                return (
                  <button 
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '24px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-primary)' : 'var(--color-surface-high)',
                      background: isActive ? 'var(--color-primary-container)' : 'transparent',
                      color: isActive ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Calling Window Start</label>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600' }}>{format12h(config.timeStart)}</span>
              </div>
              <input 
                type="time" 
                name="timeStart"
                value={config.timeStart}
                onChange={handleConfigChange}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Calling Window End</label>
                <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: '600' }}>{format12h(config.timeEnd)}</span>
              </div>
              <input 
                type="time" 
                name="timeEnd"
                value={config.timeEnd}
                onChange={handleConfigChange}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', fontWeight: '500' }}>Max Daily Call Attempts Per Lead</label>
            <input 
              type="number" 
              name="maxAttempts"
              min="1"
              max="10"
              value={config.maxAttempts}
              onChange={handleConfigChange}
              style={{ width: '100%', maxWidth: '200px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
            />
          </div>

          <div style={{ paddingTop: '24px', borderTop: '1px solid var(--color-surface-high)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '500' }}>Human Fallback Settings</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>If the AI encounters a complex issue, it will transfer the call to this agent.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>Agent Name</label>
                <input 
                  type="text" 
                  name="fallbackName"
                  value={config.fallbackName}
                  onChange={handleConfigChange}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>Agent Phone / Extension</label>
                <input 
                  type="text" 
                  name="fallbackPhone"
                  value={config.fallbackPhone}
                  onChange={handleConfigChange}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating/Bottom Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button 
          className="btn-primary" 
          onClick={handleSaveLaunch}
          style={{ padding: '16px 32px', fontSize: '16px' }}
        >
          Save & Launch Agent 🚀
        </button>
      </div>

    </div>
  );
}



