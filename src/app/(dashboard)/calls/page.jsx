"use client";
import React, { useState } from 'react';
import { showToast } from '@/lib/toast';

export default function Calls() {
  const [search, setSearch] = useState('');
  const [filterSentiment, setFilterSentiment] = useState('All');
  
  // Dummy Data
  const dummyCalls = [
    { 
      id: 1, 
      name: 'Alice Smith', 
      phone: '+1 555-0101',
      duration: '4m 12s', 
      date: 'Oct 24, 10:30 AM', 
      sentiment: 'Positive', 
      tags: ['Interested', 'Sent Brochure'], 
      handoff: null,
      summary: 'Student is highly interested in the Computer Science program. Discussed tuition and scheduling. Sent follow-up email with brochure.',
      transcript: [
        { speaker: 'AI', text: 'Hi, this is Admission Assistant from University. I saw you recently inquired about our programs. How can I assist you today?' },
        { speaker: 'Human', text: 'Hi, yeah I wanted to know more about the CS schedule.' },
        { speaker: 'AI', text: 'Our CS program offers flexible evening classes. Would you like me to email you the full syllabus?' },
        { speaker: 'Human', text: 'Yes, that would be perfect, thank you.' }
      ] 
    },
    { 
      id: 2, 
      name: 'Bob Johnson', 
      phone: '+1 555-0102',
      duration: '12m 45s', 
      date: 'Oct 24, 11:15 AM', 
      sentiment: 'Neutral', 
      tags: ['Escalated', 'Financial Aid'], 
      handoff: '11:25 AM - Transferred to John Doe',
      summary: 'Student had complex questions regarding international student financial aid. Call was escalated to human agent John Doe.',
      transcript: [
        { speaker: 'AI', text: 'Hello Bob, how can I help you regarding your application?' },
        { speaker: 'Human', text: 'I am an international student and I need to figure out how financial aid works.' },
        { speaker: 'AI', text: 'I can provide some general information, or I can transfer you to our international financial aid specialist.' },
        { speaker: 'Human', text: 'Please transfer me.' },
        { speaker: 'AI', text: 'Transferring you now. Please hold.' }
      ] 
    },
    { 
      id: 3, 
      name: 'Charlie Davis', 
      phone: '+1 555-0103',
      duration: '1m 20s', 
      date: 'Oct 24, 01:00 PM', 
      sentiment: 'Negative', 
      tags: ['Not applicable'], 
      handoff: null,
      summary: 'Student indicated they already enrolled elsewhere. Removed from calling list.',
      transcript: [
        { speaker: 'AI', text: 'Hi Charlie, checking in on your application status.' },
        { speaker: 'Human', text: 'I already got accepted somewhere else, stop calling me.' },
        { speaker: 'AI', text: 'I apologize for the inconvenience. I will remove you from our list. Have a great day.' }
      ] 
    }
  ];

  const [selectedCallId, setSelectedCallId] = useState(1);

  const filteredCalls = dummyCalls.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesSentiment = filterSentiment === 'All' || c.sentiment === filterSentiment;
    return matchesSearch && matchesSentiment;
  });

  const selectedCall = dummyCalls.find(c => c.id === selectedCallId);

  const handleManualTrigger = () => {
    showToast('Manual call trigger initiated!', 'info');
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'var(--color-success, #16a34a)';
      case 'Neutral': return 'var(--color-on-surface-variant)';
      case 'Negative': return 'var(--color-danger)';
      default: return 'inherit';
    }
  };

  const getSentimentBg = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '#dcfce7'; // light green
      case 'Neutral': return 'var(--color-surface-high)';
      case 'Negative': return '#fee2e2'; // light red
      default: return 'transparent';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', gap: '16px' }}>
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="text-heading" style={{ margin: '0 0 8px 0' }}>Call Logs</h1>
          <p className="text-muted" style={{ margin: 0 }}>Review AI conversations, transcripts, and handoffs.</p>
        </div>
        <div>
          <button className="btn-primary" onClick={handleManualTrigger}>Manual Trigger 📞</button>
        </div>
      </div>

      {/* Split View */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, minHeight: 0 }}>
        
        {/* Left Pane: Call History Log */}
        <div className="card" style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '13px', width: '100%' }}
            />
            <select 
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '13px', width: '100%' }}
            >
              <option value="All">All Sentiments</option>
              <option value="Positive">Positive</option>
              <option value="Neutral">Neutral</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
            {filteredCalls.map(call => {
              const isSelected = call.id === selectedCallId;
              return (
                <div 
                  key={call.id} 
                  onClick={() => setSelectedCallId(call.id)}
                  style={{ 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-surface-high)',
                    background: isSelected ? 'var(--color-surface-highest)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-on-surface)' }}>{call.name}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', fontWeight: '500' }}>{call.duration}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '8px' }}>
                    {call.date}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      background: getSentimentBg(call.sentiment),
                      color: getSentimentColor(call.sentiment),
                      fontWeight: '600'
                    }}>
                      {call.sentiment}
                    </span>
                    {call.handoff && (
                      <span title="Human Handoff" style={{ fontSize: '11px', background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>👤 Handoff</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Pane: Call Details */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
          {selectedCall ? (
            <>
              {/* Header Details */}
              <div style={{ padding: '24px', borderBottom: '1px solid var(--color-surface-high)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>{selectedCall.name}</h2>
                  <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '14px', margin: '0 0 12px 0', fontFamily: 'monospace' }}>{selectedCall.phone}</p>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {selectedCall.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '12px', background: 'var(--color-surface-high)', padding: '4px 10px', borderRadius: '4px', color: 'var(--color-on-surface)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '14px', marginBottom: '8px' }}><strong>Date:</strong> {selectedCall.date}</div>
                   <div style={{ fontSize: '14px' }}><strong>Duration:</strong> {selectedCall.duration}</div>
                </div>
              </div>

              {/* Two Column Layout for Details */}
              <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                
                {/* Transcript Viewer */}
                <div style={{ flex: '1 1 60%', padding: '24px', overflowY: 'auto', borderRight: '1px solid var(--color-surface-high)' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-on-surface-variant)' }}>TRANSCRIPT</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {selectedCall.transcript.map((msg, i) => {
                      const isAI = msg.speaker === 'AI';
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: isAI ? 'flex-start' : 'flex-end', width: '100%' }}>
                          <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginBottom: '4px', fontWeight: '500' }}>{msg.speaker}</span>
                          <div style={{ 
                            background: isAI ? 'var(--color-surface-high)' : 'var(--color-primary)', 
                            color: isAI ? 'var(--color-on-surface)' : 'white', 
                            padding: '12px 16px', 
                            borderRadius: isAI ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                            maxWidth: '80%',
                            fontSize: '14px',
                            lineHeight: '1.5'
                          }}>
                            {msg.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Meta Summaries */}
                <div style={{ flex: '0 0 40%', padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-on-surface-variant)' }}>AI SUMMARY</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', margin: 0 }}>{selectedCall.summary}</p>
                  </div>

                  <div>
                     <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-on-surface-variant)' }}>SENTIMENT ANALYSIS</h3>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getSentimentColor(selectedCall.sentiment) }}></div>
                        <span style={{ fontWeight: '500' }}>{selectedCall.sentiment}</span>
                     </div>
                  </div>

                  {selectedCall.handoff && (
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-on-surface-variant)' }}>HUMAN HANDOFF LOG</h3>
                      <div style={{ padding: '12px', background: 'var(--color-surface-high)', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '3px solid var(--color-primary)' }}>
                        <span>⏱️</span>
                        <span>{selectedCall.handoff}</span>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-surface-variant)' }}>
              Select a call to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



