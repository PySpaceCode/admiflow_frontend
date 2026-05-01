"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';

function UploadDocuments() {
  const [reportData, setReportData] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/knowledge/documents');
      if (response.success || Array.isArray(response)) {
        setDocuments(Array.isArray(response) ? response : response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const uploadKnowledgeFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const response = await api.post('/api/knowledge/upload', formData, true);
      if (response.success) {
        showToast('Document processed and analyzed', 'success');
        try {
          const report = typeof response.data.aiReport === 'string' 
            ? JSON.parse(response.data.aiReport) 
            : response.data.aiReport;
          setReportData(report);
        } catch (e) {
          console.error("Failed to parse report:", e);
        }
        fetchDocuments();
      }
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadKnowledgeFile(e.dataTransfer.files[0]);
    }
  };

  if (!reportData && !loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div 
          className="card"
          style={{
            border: isDragOver ? '2px dashed var(--color-primary)' : '2px dashed var(--color-surface-high)',
            background: isDragOver ? 'var(--color-surface-highest)' : 'var(--color-surface)',
            padding: '80px 48px',
            textAlign: 'center',
            transition: 'all 0.2s',
            cursor: 'pointer',
            borderRadius: '16px'
          }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>📄</div>
          <h2 style={{ marginBottom: '12px', fontSize: '20px' }}>Train your AI Sales Agent</h2>
          <p className="text-muted" style={{ marginBottom: '24px', maxWidth: '400px', marginInline: 'auto' }}>
            Upload your brochure or syllabus (PDF/DOCX). We'll extract every detail to ensure your agent never misses a lead.
          </p>
          <button className="btn-primary" style={{ padding: '12px 32px' }}>Browse Files</button>
          <input type="file" id="file-upload" style={{ display: 'none' }} accept=".pdf,.docx" onChange={(e) => e.target.files?.[0] && uploadKnowledgeFile(e.target.files[0])} />
        </div>
        
        {documents.length > 0 && (
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Training History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {documents.map((doc, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--color-surface-highest)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{ fontSize: '20px' }}>📄</span>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600' }}>{doc.file_name || doc.fileName}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Processed successfully</div>
                    </div>
                  </div>
                  <button className="btn-outline" style={{ fontSize: '12px', padding: '4px 12px' }} onClick={() => setReportData(JSON.parse(doc.ai_report || doc.aiReport))}>View Report</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '100px 0' }}>
        <div className="spinner" style={{ margin: '0 auto 24px auto', width: '40px', height: '40px', border: '4px solid var(--color-surface-high)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Analyzing Brochure...</h3>
        <p className="text-muted">Extracting modules, pricing, and FAQs to train your agent.</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Profile Section */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'linear-gradient(to right, var(--color-surface), var(--color-surface-highest))' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            {reportData.institute_name?.[0] || 'AF'}
          </div>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>{reportData.institute_name}</h1>
            <p className="text-muted" style={{ margin: 0 }}>{reportData.institute_tagline}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {reportData.accreditation && <span style={{ fontSize: '11px', padding: '2px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '4px', fontWeight: '600' }}>{reportData.accreditation}</span>}
              {reportData.naac_grade && <span style={{ fontSize: '11px', padding: '2px 8px', background: '#f0fdf4', color: '#166534', borderRadius: '4px', fontWeight: '600' }}>NAAC {reportData.naac_grade}</span>}
              {reportData.placement_support && <span style={{ fontSize: '11px', padding: '2px 8px', background: '#fff7ed', color: '#9a3412', borderRadius: '4px', fontWeight: '600' }}>Placement Assistance</span>}
            </div>
          </div>
        </div>
        <button className="btn-outline" onClick={() => setReportData(null)}>Re-upload</button>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Course Fee', value: reportData.courses?.[0]?.fee ? `₹${reportData.courses[0].fee}` : 'N/A', icon: '💰' },
          { label: 'Duration', value: reportData.courses?.[0]?.duration || 'N/A', icon: '⏱️' },
          { label: 'Total Hours', value: reportData.courses?.[0]?.total_hours || 'N/A', icon: '📚' },
          { label: 'Mode', value: reportData.courses?.[0]?.mode || 'N/A', icon: '💻' }
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
            <div className="text-muted" style={{ fontSize: '12px', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-primary)' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Course Details */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px' }}>Course Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Course Name', value: reportData.courses?.[0]?.course_name },
                { label: 'Course Code', value: reportData.courses?.[0]?.course_code },
                { label: 'Eligibility', value: reportData.courses?.[0]?.eligibility },
                { label: 'Coordinator', value: reportData.courses?.[0]?.coordinator },
                { label: 'Partner', value: reportData.courses?.[0]?.partner_institute }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span className="text-muted">{item.label}</span>
                  <span style={{ fontWeight: '600' }}>{item.value || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modules Section */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px' }}>Course Modules</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reportData.modules?.map((mod, i) => (
                <div key={i} style={{ padding: '16px', background: 'var(--color-surface-highest)', borderRadius: '12px', borderLeft: '4px solid var(--color-primary)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>Module {mod.module_number || i+1}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '12px' }}>{mod.module_title}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {mod.topics?.map((topic, j) => (
                      <span key={j} style={{ fontSize: '11px', padding: '4px 10px', background: 'white', borderRadius: '12px', border: '1px solid var(--color-surface-high)' }}>{topic}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Contact Information */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '📧', label: 'Email', value: reportData.contact?.email },
                { icon: '📞', label: 'Phone', value: reportData.contact?.phone },
                { icon: '🌐', label: 'Website', value: reportData.contact?.website },
                { icon: '📍', label: 'Branches', value: reportData.contact?.branches?.join(' • ') }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{item.value || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Learning Outcomes</h3>
            <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reportData.learning_outcomes?.map((outcome, i) => (
                <li key={i} style={{ fontSize: '13px', display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--color-primary)' }}>•</span>
                  {outcome}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools & Tech */}
          <div className="card">
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Tools & Technologies</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {reportData.tools_technologies?.map((tool, i) => (
                <span key={i} style={{ fontSize: '12px', padding: '6px 12px', background: 'var(--color-surface-highest)', borderRadius: '8px', border: '1px solid var(--color-surface-high)' }}>{tool}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQs and Final Save */}
      <div className="card">
        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reportData.faqs?.map((faq, i) => (
            <div key={i} style={{ padding: '16px', background: 'var(--color-surface-highest)', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>Q: {faq.question}</div>
              <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>A: {faq.answer}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
          <button className="btn-primary" style={{ padding: '16px 48px', fontSize: '16px' }} onClick={() => showToast('Knowledge base finalized and deployed!', 'success')}>Approve & Deploy Knowledge 🚀</button>
        </div>
      </div>
    </div>
  );
}

function AITonePersona() {
  const [formData, setFormData] = useState({
    agentName: 'Admission Assistant',
    designation: 'Admissions Counselor',
    toneStyle: 'Friendly',
    voiceGender: 'Female',
    voiceSpeed: 1,
    personaDescription: 'You are a helpful and enthusiastic admissions counselor representing the university. Your goal is to guide prospective students through the enrollment process.'
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersona = async () => {
    setLoading(true);
    try {
      const payload = {
        agent_name: formData.agentName,
        designation: formData.designation,
        tone_style: formData.toneStyle,
        voice_gender: formData.voiceGender,
        voice_speed: parseFloat(formData.voiceSpeed),
        persona_description: formData.personaDescription
      };
      
      const response = await api.post('/api/knowledge/persona', payload);
      if (response.success) {
        showToast('AI Persona updated successfully', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save persona', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>AI Tone & Persona Settings</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>AI Agent Name</label>
          <input 
            type="text" 
            name="agentName"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
            value={formData.agentName}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>AI Agent Designation</label>
          <input 
            type="text" 
            name="designation"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
            value={formData.designation}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Tone Style</label>
          <select 
            name="toneStyle"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
            value={formData.toneStyle}
            onChange={handleChange}
          >
            <option value="Formal">Formal</option>
            <option value="Friendly">Friendly</option>
            <option value="Persuasive">Persuasive</option>
          </select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Voice Gender</label>
          <select 
            name="voiceGender"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)' }}
            value={formData.voiceGender}
            onChange={handleChange}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>Voice Speed</label>
          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>{formData.voiceSpeed}x</span>
        </div>
        <input 
          type="range" 
          name="voiceSpeed"
          min="0.5" 
          max="2" 
          step="0.1"
          style={{ width: '100%', accentColor: 'var(--color-primary)' }}
          value={formData.voiceSpeed}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '14px', fontWeight: '500' }}>Persona Description</label>
        <textarea 
          name="personaDescription"
          style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.5' }}
          value={formData.personaDescription}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button className="btn-primary" onClick={handleSavePersona} disabled={loading}>
          {loading ? 'Saving...' : 'Save Persona'}
        </button>
      </div>
    </div>
  );
}

function PitchScript() {
  const [activeSection, setActiveSection] = useState('brain');

  // 1. Conversation Brain
  const [intents, setIntents] = useState([
    { id: 1, name: 'Fee Objection', triggers: 'expensive, high fees', response: 'I completely understand that managing tuition is a priority. We do have flexible monthly payment plans and scholarship options we can explore. Would you like me to send you the details?', goal: 'Reduce hesitation', tone: 'Empathetic' }
  ]);

  // 2. Behavior Rules
  const [rules, setRules] = useState([
    { id: 1, conditionType: 'User says', conditionValue: 'call me later', actionType: 'Schedule follow-up', actionConfig: 'after 2 days' }
  ]);

  // 3. Script Control
  const [scriptControl, setScriptControl] = useState({
    generatedScript: "Hi, this is {AgentName} from {UniversityName}. I'm calling because you inquired about our program...",
    editableScript: "Hi, this is {AgentName} from {UniversityName}. I'm calling because you inquired about our program...",
    additionalInstructions: "Keep the tone energetic but professional."
  });

  // 4. Final Prompt Preview
  const [previewPrompt, setPreviewPrompt] = useState("");

  const sections = [
    { id: 'brain', label: '1. Conversation Brain' },
    { id: 'rules', label: '2. Behavior Rules' },
    { id: 'script', label: '3. Script Control' },
    { id: 'preview', label: '4. Final Prompt Preview' }
  ];

  const handleSaveScript = async () => {
    try {
      const sections = {
        intents,
        rules,
        scriptControl
      };
      const response = await api.post('/api/knowledge/script', { sections });
      if (response.success) {
        showToast('Conversation script and training data saved', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save script', 'error');
    }
  };

  const handleGeneratePreview = () => {
    const prompt = `System Prompt:
You are an AI Agent.

Intents:
${intents.map(i => `- Intent: ${i.name}\n  Triggers: [${i.triggers}]\n  Response: ${i.response}\n  Goal: ${i.goal}\n  Tone: ${i.tone}`).join('\n\n')}

Rules:
${rules.map(r => `- IF ${r.conditionType} "${r.conditionValue}" THEN ${r.actionType} "${r.actionConfig}"`).join('\n')}

Base Script:
${scriptControl.editableScript}

Instructions:
${scriptControl.additionalInstructions}`;
    
    setPreviewPrompt(prompt);
    setActiveSection('preview');
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>AI Agent Training Interface</h2>
        <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.5' }}>
          Configure how the AI talks and behaves. Define conversational intents, logical rules, and base scripts to train your agent.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px', overflowX: 'auto' }}>
        {sections.map(sec => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            style={{
              padding: '8px 16px',
              background: activeSection === sec.id ? 'var(--color-surface-high)' : 'transparent',
              color: activeSection === sec.id ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
              borderRadius: '8px',
              fontWeight: activeSection === sec.id ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: 'none',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div>
        {activeSection === 'brain' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Conversation Intents</h3>
              <button 
                className="btn-outline" 
                onClick={() => setIntents([...intents, { id: Date.now(), name: '', triggers: '', response: '', goal: '', tone: 'Friendly' }])}
                style={{ fontSize: '13px', padding: '6px 12px' }}
              >
                + Add Intent
              </button>
            </div>
            
            {intents.map((intent, index) => (
              <div key={intent.id} style={{ padding: '24px', border: '1px solid var(--color-surface-high)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--color-surface-highest)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Intent #{index + 1}</h4>
                  <button 
                    onClick={() => setIntents(intents.filter(i => i.id !== intent.id))}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Remove
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Intent Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Fee Objection"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={intent.name}
                      onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, name: e.target.value } : i))}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Trigger Phrases (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. expensive, high fees"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={intent.triggers}
                      onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, triggers: e.target.value } : i))}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>AI Response</label>
                  <textarea 
                    placeholder="How should the AI respond?"
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                    value={intent.response}
                    onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, response: e.target.value } : i))}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Goal</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Reduce hesitation"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={intent.goal}
                      onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, goal: e.target.value } : i))}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Tone</label>
                    <select 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={intent.tone}
                      onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, tone: e.target.value } : i))}
                    >
                      <option value="Friendly">Friendly</option>
                      <option value="Empathetic">Empathetic</option>
                      <option value="Persuasive">Persuasive</option>
                      <option value="Professional">Professional</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Behavior Rules</h3>
              <button 
                className="btn-outline" 
                onClick={() => setRules([...rules, { id: Date.now(), conditionType: 'User says', conditionValue: '', actionType: 'Schedule follow-up', actionConfig: '' }])}
                style={{ fontSize: '13px', padding: '6px 12px' }}
              >
                + Add Rule
              </button>
            </div>
            
            {rules.map((rule, index) => (
              <div key={rule.id} style={{ padding: '20px', border: '1px solid var(--color-surface-high)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--color-surface-highest)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Rule #{index + 1}</h4>
                  <button 
                    onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Remove
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '16px', alignItems: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>IF</label>
                    <select 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={rule.conditionType}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, conditionType: e.target.value } : r))}
                    >
                      <option value="User says">User says</option>
                      <option value="Call duration >">Call duration &gt;</option>
                      <option value="User sentiment is">User sentiment is</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. later, expensive, busy..."
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={rule.conditionValue}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, conditionValue: e.target.value } : r))}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '16px', alignItems: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>THEN</label>
                    <select 
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={rule.actionType}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, actionType: e.target.value } : r))}
                    >
                      <option value="Schedule follow-up">Schedule follow-up</option>
                      <option value="End call gracefully">End call gracefully</option>
                      <option value="Transfer to human">Transfer to human</option>
                      <option value="Send SMS">Send SMS</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="e.g. after 15 days"
                      style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', fontSize: '14px' }}
                      value={rule.actionConfig}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, actionConfig: e.target.value } : r))}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'script' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Script Control</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Generated Script (Read-only)</label>
              <textarea 
                readOnly
                style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface-highest)', color: 'var(--color-on-surface-variant)', minHeight: '100px', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.6' }}
                value={scriptControl.generatedScript}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Editable Script</label>
              <textarea 
                style={{ padding: '16px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', minHeight: '150px', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit', lineHeight: '1.6' }}
                value={scriptControl.editableScript}
                onChange={(e) => setScriptControl({...scriptControl, editableScript: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Additional Instructions</label>
              <textarea 
                placeholder="e.g. Always confirm their email before ending."
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--color-surface-high)', background: 'var(--color-surface)', color: 'var(--color-on-surface)', minHeight: '80px', resize: 'vertical', fontSize: '14px', fontFamily: 'inherit' }}
                value={scriptControl.additionalInstructions}
                onChange={(e) => setScriptControl({...scriptControl, additionalInstructions: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button className="btn-outline">Save Draft</button>
              <button className="btn-primary">Approve Script</button>
            </div>
          </div>
        )}

        {activeSection === 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600' }}>🧠 Final AI Prompt Preview</h3>
              <button 
                className="btn-outline" 
                onClick={handleGeneratePreview}
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <span>⚡</span> Generate Preview
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Compiled Prompt</label>
              <textarea 
                readOnly
                placeholder="Click 'Generate Preview' to compile the prompt..."
                style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-surface-high)', 
                  background: '#0d1117', 
                  color: '#c9d1d9', 
                  minHeight: '400px', 
                  resize: 'vertical', 
                  fontSize: '13px', 
                  fontFamily: 'monospace', 
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}
                value={previewPrompt}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
              <button 
                className="btn-primary" 
                style={{ background: '#10b981', borderColor: '#10b981', color: '#ffffff' }}
                onClick={handleSaveScript}
              >
                Approve & Deploy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('upload-documents');

  const tabs = [
    { id: 'upload-documents', label: 'Upload Documents' },
    { id: 'ai-tone-persona', label: 'AI Tone & Persona' },
    { id: 'pitch-script', label: 'Pitch Script' },
  ];

  return (
    <div>
      <h1 className="text-heading" style={{ marginBottom: '16px' }}>Knowledge Base</h1>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'var(--color-primary-container)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              borderRadius: '24px',
              fontWeight: activeTab === tab.id ? '600' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              border: 'none',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ width: '100%' }}>
        {activeTab === 'upload-documents' && <UploadDocuments />}
        {activeTab === 'ai-tone-persona' && <AITonePersona />}
        {activeTab === 'pitch-script' && <PitchScript />}
      </div>
    </div>
  );
}


