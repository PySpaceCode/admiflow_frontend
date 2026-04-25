"use client";

import React, { useState } from 'react';

function UploadDocuments() {
  const [reportText, setReportText] = useState("• Extracted Brochure info: ...\n• FAQ list parsed...\n• Pricing details found...");
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
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
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div 
        className="card"
        style={{
          border: isDragOver ? '2px dashed var(--color-primary)' : '2px dashed var(--color-surface-high)',
          background: isDragOver ? 'var(--color-surface-highest)' : 'var(--color-surface)',
          padding: '48px',
          textAlign: 'center',
          transition: 'all 0.2s',
          cursor: 'pointer'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>📂</div>
        <h3 style={{ marginBottom: '8px' }}>Drag & drop documents here</h3>
        <p className="text-muted" style={{ marginBottom: '16px' }}>Accepts PDF, DOCX (Brochure, Syllabus, FAQ, Pricing)</p>
        <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); document.getElementById('file-upload').click(); }}>Browse Files</button>
        <input 
          type="file" 
          id="file-upload" 
          style={{ display: 'none' }} 
          accept=".pdf,.docx" 
          multiple 
          onChange={handleFileChange}
        />
        {files.length > 0 && (
          <div style={{ marginTop: '24px', textAlign: 'left', background: 'var(--color-surface-high)', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '8px', fontSize: '14px' }}>Selected Files:</h4>
            <ul style={{ listStylePos: 'inside', fontSize: '14px', color: 'var(--color-on-surface-variant)', margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {files.map((f, i) => <li key={i}>📄 {f.name}</li>)}
            </ul>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>AI Analysis Report</h3>
        <p className="text-muted" style={{ marginBottom: '16px', fontSize: '14px' }}>
          Review and edit the extracted key points before saving them to the AI's knowledge base.
        </p>
        <textarea
          style={{
            width: '100%',
            minHeight: '200px',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--color-surface-high)',
            background: 'var(--color-surface)',
            color: 'var(--color-on-surface)',
            fontFamily: 'inherit',
            lineHeight: '1.6',
            resize: 'vertical',
            marginBottom: '16px'
          }}
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn-primary">Save Knowledge</button>
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        <button className="btn-primary">Save Persona</button>
      </div>
    </div>
  );
}

function PitchScript() {
  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Section 1: The Opening (Identity & Relevance)",
      description: "Define how the AI introduces itself and establishes the reason for calling.",
      script: "Hi, this is {AgentName} from {UniversityName}. I'm calling because I saw you recently inquired about our Computer Science program. Is now a good time to chat?",
      instruction: ""
    },
    {
      id: 2,
      title: "Section 2: Discovery & Qualification (Pain Points)",
      description: "Guide the AI to ask questions to understand the student's goals and challenges.",
      script: "Great! Tell me, what got you interested in studying Computer Science right now? Are you looking to advance your career or perhaps pivot into a new field?",
      instruction: ""
    },
    {
      id: 3,
      title: "Section 3: Value Proposition",
      description: "Explain how the university solves their pain points.",
      script: "That's fantastic. Our program is actually designed specifically for career advancers like you. We offer flexible evening classes and connect you directly with local tech companies through our internship network.",
      instruction: ""
    },
    {
      id: 4,
      title: "Section 4: Objection Handling",
      description: "Provide the AI with default responses to common objections (e.g., price, time).",
      script: "I completely understand that balancing work and study is a concern. Many of our students are working professionals, and we structure our modules to require about 10-15 hours a week so it remains manageable without sacrificing your current job.",
      instruction: ""
    },
    {
      id: 5,
      title: "Section 5: The Close (Secure Commitment)",
      description: "Define the final call to action to secure a meeting, application, or payment.",
      script: "Considering what we've discussed, would it make sense for us to schedule a brief 10-minute discovery call next week with one of our specialized academic advisors to map out your potential timeline?",
      instruction: ""
    }
  ]);

  const handleScriptChange = (index, value) => {
    const newSections = [...sections];
    newSections[index].script = value;
    setSections(newSections);
  };

  const handleInstructionChange = (index, value) => {
    const newSections = [...sections];
    newSections[index].instruction = value;
    setSections(newSections);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>Pitch Script Framework</h2>
        <p className="text-muted" style={{ fontSize: '14px', lineHeight: '1.5' }}>
          Customize the AI's conversation flow. You can adjust the default script or add specific instructions for how the AI should behave during each phase of the call.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {sections.map((section, index) => (
          <div key={section.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '32px', borderBottom: index < sections.length - 1 ? '1px solid var(--color-surface-high)' : 'none' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>{section.title}</h3>
              <p className="text-muted" style={{ fontSize: '13px' }}>{section.description}</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>AI Script Content</label>
              <textarea 
                style={{ 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-surface-high)', 
                  background: 'var(--color-surface)', 
                  color: 'var(--color-on-surface)', 
                  minHeight: '100px', 
                  resize: 'vertical', 
                  fontSize: '14px', 
                  fontFamily: 'inherit', 
                  lineHeight: '1.6' 
                }}
                value={section.script}
                onChange={(e) => handleScriptChange(index, e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }}>Add custom instructions (Optional)</label>
              <input 
                type="text" 
                placeholder="e.g. Keep this brief and upbeat"
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-surface-high)', 
                  background: 'var(--color-surface-highest)', 
                  color: 'var(--color-on-surface)',
                  fontSize: '14px'
                }}
                value={section.instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '12px', marginTop: '16px', paddingTop: '24px', borderTop: '1px solid var(--color-surface-high)' }}>
        <button className="btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>🔄</span> Regenerate
        </button>
        <button className="btn-outline" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>🎧</span> Test audio script (Preview)
        </button>
        <button className="btn-primary">Save changes</button>
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


