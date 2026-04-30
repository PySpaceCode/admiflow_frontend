"use client";
import React, { useState } from 'react';
import { showToast } from '@/lib/toast';

export default function Conversations() {
  const [channelFilter, setChannelFilter] = useState('All');
  const [replyText, setReplyText] = useState('');

  const dummyConversations = [
    {
      id: 1,
      name: 'Alice Smith',
      phone: '+1 555-0101',
      course: 'Computer Science',
      status: 'In Discussion',
      nextAction: 'Follow-up Email (Oct 26)',
      channel: 'WhatsApp',
      time: '10:30 AM',
      unread: 2,
      lastMessage: 'Can you send the syllabus?',
      messages: [
        { id: 101, speaker: 'AI', text: 'Hi Alice, great to connect! Are you still interested in the CS program?', isAudio: false },
        { id: 102, speaker: 'User', text: 'Yes I am. Can you send the syllabus?', isAudio: false }
      ]
    },
    {
      id: 2,
      name: 'Bob Johnson',
      phone: '+1 555-0102',
      course: 'Business Admin',
      status: 'Needs Human',
      nextAction: 'Manager Call (Today 3PM)',
      channel: 'Voice',
      time: '11:15 AM',
      unread: 0,
      lastMessage: '[Voice transcript recorded]',
      messages: [
        { id: 201, speaker: 'AI', text: 'Hello Bob! I am the admission assistant.', isAudio: false },
        { id: 202, speaker: 'User', text: 'I need to speak to a real person regarding financial aid.', isAudio: true, duration: '0:15' },
        { id: 203, speaker: 'AI', text: 'Transferring you to an agent now.', isAudio: false }
      ]
    },
    {
      id: 3,
      name: 'Charlie Davis',
      phone: '+1 555-0103',
      course: 'Nursing',
      status: 'Pending',
      nextAction: 'None',
      channel: 'WhatsApp',
      time: 'Yesterday',
      unread: 0,
      lastMessage: 'Thank you!',
      messages: [
        { id: 301, speaker: 'AI', text: 'Just a reminder that the nursing application closes this Friday.', isAudio: false },
        { id: 302, speaker: 'User', text: 'Thank you!', isAudio: false }
      ]
    }
  ];

  const [selectedId, setSelectedId] = useState(1);

  const filteredConversations = dummyConversations.filter(c => 
    channelFilter === 'All' || c.channel === channelFilter
  );

  const selectedConvo = dummyConversations.find(c => c.id === selectedId);

  const handleSend = () => {
    if (!replyText.trim()) return;
    showToast('Message sent! (Human overriding AI)', 'success');
    setReplyText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <h1 className="text-heading" style={{ margin: '0 0 8px 0' }}>Omnichannel Conversations</h1>
          <p className="text-muted" style={{ margin: 0 }}>Monitor and intervene in active AI chats and voice calls.</p>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div style={{ display: 'flex', flex: 1, gap: '24px', minHeight: 0 }}>
        
        {/* Column 1: Conversation List */}
        <div className="card" style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid var(--color-surface-high)' }}>
            <div style={{ display: 'flex', gap: '8px', background: 'var(--color-surface-high)', padding: '4px', borderRadius: '8px' }}>
              {['All', 'WhatsApp', 'Voice'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: channelFilter === ch ? 'var(--color-surface)' : 'transparent',
                    color: channelFilter === ch ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                    fontWeight: channelFilter === ch ? '600' : '500',
                    cursor: 'pointer',
                    fontSize: '13px',
                    boxShadow: channelFilter === ch ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredConversations.map(c => {
              const isActive = c.id === selectedId;
              return (
                <div 
                  key={c.id} 
                  onClick={() => setSelectedId(c.id)}
                  style={{ 
                    padding: '16px', 
                    borderBottom: '1px solid var(--color-surface-high)', 
                    background: isActive ? 'var(--color-surface-highest)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-on-surface)' }}>{c.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{c.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '13px', 
                      color: isActive ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      maxWidth: '80%' 
                    }}>
                      {c.channel === 'Voice' ? '📞' : '💬'} {c.lastMessage}
                    </span>
                    {c.unread > 0 && (
                      <span style={{ background: 'var(--color-primary)', color: 'white', fontSize: '11px', padding: '2px 6px', borderRadius: '12px', fontWeight: 'bold' }}>
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Column 2: Thread Pane */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          {selectedConvo ? (
            <>
              {/* Thread Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-surface-high)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                    {selectedConvo.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', margin: '0 0 2px 0' }}>{selectedConvo.name}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>via {selectedConvo.channel}</span>
                  </div>
                </div>
                <div>
                   <button className="btn-outline" style={{ fontSize: '12px', padding: '6px 12px' }}>Pause AI Intervention</button>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--color-surface-base)' }}>
                {selectedConvo.messages.map(msg => {
                  const isUser = msg.speaker === 'User';
                  return (
                    <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', width: '100%' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', padding: '0 4px' }}>
                        {msg.speaker === 'User' ? 'Lead' : 'Admission AI'}
                      </span>
                      
                      {msg.isAudio ? (
                        <div style={{ 
                          background: 'var(--color-surface-high)', 
                          border: '1px solid var(--color-outline-variant)',
                          padding: '12px 16px', 
                          borderRadius: '16px 16px 4px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          maxWidth: '70%',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button style={{ background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>▶</button>
                            <div style={{ flex: 1, height: '4px', background: 'var(--color-surface-high)', borderRadius: '2px', width: '100px', display: 'flex', alignItems: 'center' }}>
                              <div style={{ height: '4px', width: '40%', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{msg.duration}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', fontStyle: 'italic', borderTop: '1px solid var(--color-surface-high)', paddingTop: '8px' }}>
                            Transcript: "{msg.text}"
                          </div>
                        </div>
                      ) : (
                        <div style={{ 
                          background: isUser ? 'var(--color-surface-highest)' : 'var(--color-primary-container)', 
                          color: isUser ? 'var(--color-on-surface)' : 'var(--color-on-primary)',
                          border: isUser ? '1px solid var(--color-outline-variant)' : '1px solid transparent',
                          padding: '12px 16px', 
                          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                          maxWidth: '70%',
                          fontSize: '14px',
                          lineHeight: '1.5',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          {msg.text}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Reply Input */}
              <div style={{ padding: '16px', borderTop: '1px solid var(--color-surface-high)', display: 'flex', gap: '12px', alignItems: 'flex-end', background: 'var(--color-surface)' }}>
                <textarea 
                  placeholder={`Reply to ${selectedConvo.name}... (Taking over from AI)`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-outline-variant)',
                    background: 'var(--color-surface-highest)',
                    color: 'var(--color-on-surface)',
                    resize: 'none',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                    minHeight: '44px',
                    maxHeight: '120px'
                  }}
                  rows={replyText.split('\n').length > 1 ? replyText.split('\n').length : 1}
                />
                <button className="btn" onClick={handleSend} style={{ height: '44px', padding: '0 24px' }}>Send</button>
              </div>

            </>
          ) : (
             <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-surface-variant)' }}>
              Select a conversation to view thread
            </div>
          )}
        </div>

        {/* Column 3: Lead Context Sidebar */}
        <div className="card" style={{ flex: '0 0 300px', padding: '24px', overflowY: 'auto' }}>
          {selectedConvo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ textAlign: 'center', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '24px' }}>
                 <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '32px', margin: '0 auto 16px auto' }}>
                    {selectedConvo.name.charAt(0)}
                  </div>
                 <h2 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>{selectedConvo.name}</h2>
                 <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', margin: 0, fontFamily: 'monospace' }}>{selectedConvo.phone}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface-variant)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</h3>
                <div style={{ background: 'var(--color-surface-high)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{selectedConvo.status}</span>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedConvo.status === 'Needs Human' ? 'var(--color-danger)' : 'var(--color-success)' }}></span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface-variant)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-on-surface-variant)' }}>Course:</span>
                    <span style={{ fontWeight: '500' }}>{selectedConvo.course}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-on-surface-variant)' }}>Latest Channel:</span>
                    <span style={{ fontWeight: '500' }}>{selectedConvo.channel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface-variant)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Scheduled Action</h3>
                <div style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: '500' }}>
                  {selectedConvo.nextAction}
                </div>
              </div>

            </div>
          ) : (
            <p className="text-muted" style={{ textAlign: 'center', marginTop: '48px' }}>No context available.</p>
          )}
        </div>

      </div>
    </div>
  );
}



