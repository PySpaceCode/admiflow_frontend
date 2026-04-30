"use client";
import React, { useState } from 'react';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';

export default function LeadTable({ leads, onViewLead, onActionStart, onActionEnd }) {
  const [revealedPhones, setRevealedPhones] = useState(new Set());

  const togglePhone = (leadId) => {
    setRevealedPhones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const handleCall = async (lead) => {
    onActionStart && onActionStart();
    try {
      await api.post('/api/calls/initiate', { lead_id: lead.id });
      showToast(`Calling ${lead.name}...`, 'info');
    } catch (e) {
      showToast(`Failed to initiate call: ${e.message}`, 'error');
    } finally {
      onActionEnd && onActionEnd();
    }
  };

  const handleWhatsApp = async (lead) => {
    onActionStart && onActionStart();
    try {
      await api.post('/api/whatsapp/send', { lead_id: lead.id });
      showToast(`WhatsApp sent to ${lead.name}`, 'success');
    } catch (e) {
      showToast(`Failed to send WhatsApp: ${e.message}`, 'error');
    } finally {
      onActionEnd && onActionEnd();
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Not Called': return 'badge-neutral';
      case 'Called': return 'badge-primary';
      case 'Booked': return 'badge-success';
      case 'Not Interested': return 'badge-danger';
      default: return 'badge-neutral';
    }
  };

  const formatPhone = (phone, isRevealed) => {
    if (!phone) return '-';
    if (isRevealed) return phone;
    // Masking: assume format +91XXXXXXXXXX
    const last4 = phone.slice(-4);
    const code = phone.startsWith('+') ? phone.slice(0, 3) : '';
    return `${code} ••••• ${last4}`;
  };

  if (!leads || leads.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <p className="text-muted">No leads found. Upload a CSV to get started.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Course Interest</th>
            <th>Status</th>
            <th>Last Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const isRevealed = revealedPhones.has(lead.id);
            return (
              <tr key={lead.id}>
                <td style={{ fontWeight: 500 }}>{lead.name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="data-text" style={{ fontSize: '14px', letterSpacing: '0.02em' }}>
                      {formatPhone(lead.phone, isRevealed)}
                    </span>
                    <button 
                      onClick={() => togglePhone(lead.id)}
                      style={{ fontSize: '16px', color: 'var(--color-on-surface-variant)' }}
                      title={isRevealed ? "Hide Phone" : "Reveal Phone"}
                    >
                      {isRevealed ? '🙈' : '👁️'}
                    </button>
                  </div>
                </td>
                <td>{lead.course}</td>
                <td><span className={`badge ${getStatusBadgeClass(lead.status)}`}>{lead.status}</span></td>
                <td className="text-muted" style={{ fontSize: '13px' }}>{lead.last_contact || 'Never'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-outline" style={{ padding: '6px' }} title="Call Now" onClick={() => handleCall(lead)}>📞</button>
                    <button className="btn-outline" style={{ padding: '6px' }} title="WhatsApp" onClick={() => handleWhatsApp(lead)}>💬</button>
                    <button className="btn-outline" style={{ padding: '6px' }} title="View Details" onClick={() => onViewLead(lead)}>👁</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


