"use client";
import React, { useState } from 'react';
import { showToast } from '@/lib/toast';

export default function Bookings() {
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  
  // Dummy Bookings Data
  const [bookings, setBookings] = useState([
    { id: 1, name: 'Alice Smith', phone: '+1 555-0101', date: '2026-04-18', time: '10:00 AM', status: 'Confirmed', agent: 'Unassigned' },
    { id: 2, name: 'Bob Johnson', phone: '+1 555-0102', date: '2026-04-18', time: '01:30 PM', status: 'Pending', agent: 'John Doe' },
    { id: 3, name: 'Charlie Davis', phone: '+1 555-0103', date: '2026-04-19', time: '09:15 AM', status: 'Confirmed', agent: 'Sarah Adams' },
    { id: 4, name: 'Diana Evans', phone: '+1 555-0104', date: '2026-04-20', time: '11:00 AM', status: 'Pending', agent: 'Unassigned' },
    { id: 5, name: 'Evan Wright', phone: '+1 555-0105', date: '2026-04-21', time: '03:00 PM', status: 'Confirmed', agent: 'John Doe' }
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const agents = ['Unassigned', 'John Doe', 'Sarah Adams', 'Michael Brown'];

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = (newStatus) => {
    setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, status: newStatus } : b));
    showToast(`Booking marked as ${newStatus}`, 'success');
  };

  const handleAgentChange = (e) => {
    const newAgent = e.target.value;
    setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, agent: newAgent } : b));
    setSelectedBooking(prev => ({ ...prev, agent: newAgent }));
    showToast(`Agent assigned: ${newAgent}`, 'success');
  };

  // Mock Calendar Layout Generation (Simulating a simple 5-day week for view)
  const calendarDays = ['2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21'];
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getStatusColor = (status) => {
    return status === 'Confirmed' ? 'var(--color-success)' : 'var(--color-warning)';
  };

  const getStatusBg = (status) => {
    // Translucent backgrounds that work in both light and dark modes
    return status === 'Confirmed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="text-heading" style={{ margin: '0 0 8px 0' }}>Bookings Management</h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage leads booked by the AI, assign human agents, and review schedules.</p>
        </div>
        
        <div style={{ display: 'flex', background: 'var(--color-surface-high)', padding: '4px', borderRadius: '8px' }}>
          <button 
            onClick={() => setViewMode('calendar')}
            style={{ 
              padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px',
              background: viewMode === 'calendar' ? 'var(--color-surface)' : 'transparent', 
              color: viewMode === 'calendar' ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
              boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s'
            }}>
            📅 Calendar
          </button>
          <button 
            onClick={() => setViewMode('list')}
            style={{ 
              padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px',
              background: viewMode === 'list' ? 'var(--color-surface)' : 'transparent', 
              color: viewMode === 'list' ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
              boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s'
            }}>
            📋 List
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="card" style={{ padding: viewMode === 'calendar' ? '24px' : '0', overflow: 'hidden' }}>
        
        {viewMode === 'calendar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '16px', margin: 0 }}>This Week</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {calendarDays.map((date, index) => {
                const dayBookings = bookings.filter(b => b.date === date);
                return (
                  <div key={date} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ paddingBottom: '12px', borderBottom: '2px solid var(--color-surface-high)', textAlign: 'center' }}>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-on-surface)' }}>{dayNames[index]}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{date}</div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {dayBookings.map(b => (
                        <div 
                          key={b.id} 
                          onClick={() => handleBookingClick(b)}
                          style={{
                            padding: '12px',
                            background: getStatusBg(b.status),
                            border: `1px solid ${getStatusColor(b.status)}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'transform 0.15s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--color-on-surface)', marginBottom: '4px' }}>{b.time}</div>
                          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '8px' }}>{b.name}</div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: getStatusColor(b.status), textTransform: 'uppercase' }}>{b.status}</span>
                            {b.agent !== 'Unassigned' && <span title={`Agent: ${b.agent}`} style={{ fontSize: '12px' }}>👤</span>}
                          </div>
                        </div>
                      ))}
                      {dayBookings.length === 0 && (
                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-on-surface-variant)', fontSize: '12px', background: 'var(--color-surface-high)', borderRadius: '8px', border: '1px dashed var(--color-outline-variant)' }}>
                          No bookings
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="table-container">
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Lead Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Assigned Agent</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>
                      <span style={{ padding: '4px 8px', borderRadius: '16px', fontSize: '12px', fontWeight: '600', background: getStatusBg(b.status), color: getStatusColor(b.status) }}>
                        {b.status}
                      </span>
                    </td>
                    <td>{b.agent}</td>
                    <td>
                      <button onClick={() => handleBookingClick(b)} style={{ background: 'transparent', border: '1px solid var(--color-surface-high)', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: 'var(--color-on-surface)' }}>
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Booking Management Modal / Slide-over Simulation */}
      {isModalOpen && selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>✕</button>
            
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 8px 0' }}>Booking Details</h2>
              <p className="text-muted" style={{ margin: 0, fontSize: '14px' }}>Manage the appointment details and assign responsibilities.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px', background: 'var(--color-surface-high)', padding: '16px', borderRadius: '8px' }}>
               <div>
                 <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '4px' }}>Lead Name</span>
                 <strong style={{ fontSize: '15px' }}>{selectedBooking.name}</strong>
               </div>
               <div>
                 <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '4px' }}>Phone</span>
                 <strong style={{ fontSize: '15px', fontFamily: 'monospace' }}>{selectedBooking.phone}</strong>
               </div>
               <div>
                 <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '4px' }}>Date</span>
                 <strong style={{ fontSize: '15px' }}>{selectedBooking.date}</strong>
               </div>
               <div>
                 <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', display: 'block', marginBottom: '4px' }}>Time</span>
                 <strong style={{ fontSize: '15px' }}>{selectedBooking.time}</strong>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>Assign Human Agent</label>
                <select 
                  value={selectedBooking.agent}
                  onChange={handleAgentChange}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                >
                  {agents.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>Update Status / Actions</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {selectedBooking.status === 'Pending' ? (
                    <button onClick={() => handleStatusChange('Confirmed')} className="btn" style={{ flex: 1, background: 'var(--color-success, #16a34a)' }}>Confirm Meeting</button>
                  ) : (
                    <button disabled style={{ flex: 1, padding: '10px 16px', borderRadius: '6px', border: 'none', background: 'var(--color-surface-high)', color: 'var(--color-on-surface-variant)', fontWeight: '600' }}>✓ Confirmed</button>
                  )}
                  <button className="btn-outline" onClick={() => { showToast('Rescheduling interface pending...', 'info'); closeModal(); }} style={{ flex: 1 }}>Reschedule</button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}



