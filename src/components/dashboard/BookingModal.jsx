"use client";
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';

export default function BookingModal({ lead, onClose }) {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch available slots
    setLoading(true);
    api.get('/api/bookings/slots')
      .then(data => setSlots(Array.isArray(data) ? data : []))
      .catch((err) => showToast('Failed to load slots: ' + err.message, 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    try {
      await api.post('/api/bookings', { lead_id: lead.id, slot_time: selectedSlot });
      showToast('Booking confirmed ✓', 'success');
      onClose();
    } catch (err) {
      showToast('Booking failed: ' + err.message, 'error');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div className="card" style={{ width: '400px', maxWidth: '90%', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Book Slot for {lead?.name}</h3>
          <button style={{ fontSize: '20px', color: 'var(--color-text-muted)' }} onClick={onClose}>&times;</button>
        </div>

        {loading ? (
          <div className="skeleton" style={{ height: '150px' }}></div>
        ) : slots.length === 0 ? (
          <p className="text-muted">No slots available.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px', maxHeight: '300px', overflowY: 'auto' }}>
            {slots.map((slot, idx) => {
               const isSelected = selectedSlot === slot.time;
               return (
                 <button 
                   key={idx}
                   onClick={() => setSelectedSlot(slot.time)}
                   style={{
                     padding: '10px', borderRadius: '6px', fontSize: '13px',
                     border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                     background: isSelected ? 'var(--color-accent-soft)' : 'var(--color-white)',
                     color: isSelected ? 'var(--color-accent)' : 'var(--color-text)',
                     cursor: 'pointer', transition: 'all 0.2s'
                   }}
                 >
                   {slot.label}
                 </button>
               );
            })}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!selectedSlot} onClick={handleConfirm}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}


