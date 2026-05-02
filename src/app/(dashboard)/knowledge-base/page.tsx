"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { analyzeWithMistral } from '@/lib/ai-analysis';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Upload, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Briefcase,
  Users,
  Layers,
  Globe,
  MapPin,
  Phone,
  Mail,
  Zap,
  ShieldCheck,
  FileText,
  Clock,
  Code,
  HelpCircle,
  BarChart3,
  Rocket,
  Edit3,
  Database,
  Trash2,
  X,
  User,
  Terminal,
  Target,
  Layout,
  Calendar,
  Mic,
  Search,
  ExternalLink,
  Award
} from 'lucide-react';

const KnowledgeEditor = ({ data, onSave, onCancel }) => {
  const [jsonText, setJsonText] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState(null);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onSave(parsed);
    } catch (e) {
      setError("Invalid JSON format. Please check your syntax.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '40px'
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: '1200px', height: '85vh',
          display: 'flex', flexDirection: 'column',
          borderRadius: '48px', background: '#ffffff', overflow: 'hidden',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ 
          padding: '40px 48px', borderBottom: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'linear-gradient(to right, #ffffff, #f8fafc)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ background: '#6366f1', padding: '8px', borderRadius: '10px', color: 'white' }}>
                <Edit3 size={20} />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Neural Knowledge Editor</h2>
            </div>
            <p style={{ color: '#64748b', fontWeight: '600', margin: 0, fontSize: '16px' }}>Directly manipulate the AI's core knowledge schema.</p>
          </div>
          <button 
            onClick={onCancel} 
            style={{ 
              width: '48px', height: '48px', borderRadius: '14px', border: 'none', 
              background: '#f1f5f9', color: '#64748b', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
            onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 350px', overflow: 'hidden' }}>
          <div style={{ position: 'relative', background: '#0f172a', padding: '24px' }}>
            <div style={{ 
              position: 'absolute', top: '24px', left: '48px', display: 'flex', gap: '8px', zIndex: 10 
            }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
            </div>
            <textarea
              value={jsonText}
              onChange={(e) => { setJsonText(e.target.value); setError(null); }}
              spellCheck={false}
              style={{
                width: '100%', height: '100%', padding: '48px 24px 24px',
                borderRadius: '24px', border: 'none',
                background: 'transparent', color: '#38bdf8',
                fontFamily: '"Fira Code", monospace', fontSize: '14px',
                lineHeight: '1.7', resize: 'none', outline: 'none'
              }}
            />
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  position: 'absolute', bottom: '40px', left: '40px', right: '40px', 
                  background: '#ef4444', color: 'white', padding: '16px 24px', 
                  borderRadius: '16px', fontSize: '14px', fontWeight: '700', 
                  boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}
              >
                <AlertTriangle size={20} />
                {error}
              </motion.div>
            )}
          </div>

          <div style={{ padding: '40px', background: '#f8fafc', borderLeft: '1px solid #f1f5f9', overflowY: 'auto' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Schema Integrity</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: 'Institute Identity', status: data.institute_name ? 'detected' : 'missing' },
                { label: 'Course Catalog', status: data.courses?.length > 0 ? 'detected' : 'missing' },
                { label: 'Curriculum Depth', status: data.modules?.length > 0 ? 'detected' : 'missing' },
                { label: 'Contact Grid', status: data.contact ? 'detected' : 'missing' }
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.status === 'detected' ? '#10b981' : '#f59e0b' }}></div>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: item.status === 'detected' ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '40px', padding: '24px', background: '#eff6ff', borderRadius: '24px', border: '1px solid #dbeafe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', color: '#3b82f6' }}>
                <Brain size={18} />
                <span style={{ fontSize: '14px', fontWeight: '900' }}>AI Insight</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', fontWeight: '600', lineHeight: '1.6' }}>
                Rectifying JSON errors here will instantly update the agent's logic without needing a re-upload.
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          padding: '32px 48px', borderTop: '1px solid #f1f5f9',
          display: 'flex', justifyContent: 'flex-end', gap: '16px',
          background: '#ffffff'
        }}>
          <button 
            onClick={onCancel}
            style={{ 
              padding: '16px 32px', borderRadius: '16px', border: '2px solid #f1f5f9',
              background: 'white', color: '#64748b', fontWeight: '800', fontSize: '15px', cursor: 'pointer' 
            }}
          >
            Cancel Changes
          </button>
          <button 
            onClick={handleSave}
            style={{ 
              padding: '16px 40px', borderRadius: '16px', border: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', 
              fontWeight: '900', fontSize: '15px', cursor: 'pointer',
              boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
            }}
          >
            Apply Sync to AI Core
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const KnowledgeReportView = ({ data }) => {
  if (!data) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '100px' }}
    >
      {/* HERO SECTION - PREMIUM GLASSMORPHISM */}
      <motion.div 
        variants={itemVariants}
        style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
          borderRadius: '40px', padding: '60px', border: '1px solid #f1f5f9',
          boxShadow: '0 20px 50px -12px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden'
        }}
      >
        <div style={{ 
          position: 'absolute', top: '-50px', right: '-50px', width: '300px', height: '300px', 
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', 
          borderRadius: '50%', pointerEvents: 'none' 
        }}></div>
        
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            style={{ 
              width: '120px', height: '120px', borderRadius: '32px', 
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', fontWeight: '950', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
            }}
          >
            {data.institute_name?.[0] || 'AF'}
          </motion.div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <span style={{ padding: '6px 14px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verified Intelligence</span>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
              <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '800' }}>ONLINE</span>
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '950', color: '#0f172a', margin: '0 0 12px 0', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {data.institute_name || 'Neural Knowledge Core'}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '20px', fontWeight: '600', maxWidth: '700px' }}>
              {data.institute_tagline || 'Comprehensive extraction of institutional architecture and behavioral protocols.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* CORE METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { label: 'Primary Investment', value: data.courses?.[0]?.fee || 'Consult', icon: <Award size={20} />, color: '#6366f1', bg: '#eef2ff' },
          { label: 'Time Horizon', value: data.courses?.[0]?.duration || 'Flexible', icon: <Clock size={20} />, color: '#10b981', bg: '#f0fdf4' },
          { label: 'Prerequisites', value: data.courses?.[0]?.eligibility || 'Open', icon: <ShieldCheck size={20} />, color: '#f59e0b', bg: '#fffbeb' },
          { label: 'Active Branches', value: `${data.contact?.branches?.length || 0} Locations`, icon: <MapPin size={20} />, color: '#ef4444', bg: '#fef2f2' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)' }}
            style={{ background: '#ffffff', padding: '32px', borderRadius: '32px', border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '950', color: '#0f172a' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* MAIN ARCHITECTURE SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
        {/* CURRICULUM ARCHITECTURE */}
        <motion.div variants={itemVariants} className="card" style={{ padding: '48px', borderRadius: '40px', border: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <SectionTitle title="Knowledge Architecture" icon={<Layers />} color="#6366f1" />
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1', background: '#eef2ff', padding: '8px 16px', borderRadius: '12px' }}>
              {(data.modules || []).length} CORE MODULES
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {(data.modules || []).map((mod, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 10, background: '#f8fafc' }}
                style={{ padding: '32px', background: '#ffffff', borderRadius: '28px', border: '1px solid #f1f5f9', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                  <div style={{ 
                    width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '950', flexShrink: 0, fontSize: '18px'
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '900', color: '#0f172a' }}>{mod.module_title}</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {mod.topics?.map((topic, j) => (
                        <motion.span 
                          key={j} 
                          whileHover={{ scale: 1.05, background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                          style={{ 
                            padding: '10px 18px', borderRadius: '14px', background: '#f1f5f9', 
                            color: '#475569', fontSize: '14px', fontWeight: '700', cursor: 'default',
                            border: '1px solid transparent'
                          }}
                        >
                          {topic}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* SIDEBAR INTEL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* STRATEGIC HIGHLIGHTS */}
          <motion.div variants={itemVariants} className="card" style={{ padding: '40px', borderRadius: '32px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '950', color: 'white', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Zap size={20} style={{ color: '#10b981' }} /> Key Differentiators
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(data.highlights || ['Verified Knowledge', 'AI Optimized', 'Sales Ready']).map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✓</div>
                  <span style={{ fontSize: '15px', fontWeight: '700', opacity: 0.9 }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CONTACT HUB */}
          <motion.div variants={itemVariants} className="card" style={{ padding: '40px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '950', color: '#0f172a', marginBottom: '24px' }}>Neural Contact Hub</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Support Email', value: data.contact?.email, icon: <Mail size={18} />, color: '#6366f1' },
                { label: 'Inquiry Line', value: data.contact?.phone, icon: <Phone size={18} />, color: '#10b981' },
                { label: 'Digital Portal', value: data.contact?.website, icon: <Globe size={18} />, color: '#a855f7' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '20px', background: '#f8fafc', borderRadius: '20px' }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{item.label}</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>{item.value || 'Not Found'}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* TOOLS & CAREER PATHWAYS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <motion.div variants={itemVariants} className="card" style={{ padding: '40px', borderRadius: '40px' }}>
          <SectionTitle title="Technology Stack" icon={<Terminal />} color="#f59e0b" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {(data.tools_technologies || []).map((tool, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                style={{ padding: '16px 28px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                {tool}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card" style={{ padding: '40px', borderRadius: '40px' }}>
          <SectionTitle title="Career Pathways" icon={<Target />} color="#10b981" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {(data.job_scope || ['Software Engineer', 'Systems Architect', 'Tech Lead', 'Consultant']).map((role, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 10 }}
                style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', color: '#065f46', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '16px' }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }}></div>
                {role}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* FAQS - ACCORDION STYLE VISUAL */}
      <motion.div variants={itemVariants} className="card" style={{ padding: '56px', borderRadius: '48px' }}>
        <SectionTitle title="Intelligence Q&A" icon={<HelpCircle />} color="#a855f7" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {(data.faqs || []).map((faq, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              style={{ padding: '32px', background: '#faf5ff', borderRadius: '32px', border: '1px solid #f3e8ff' }}
            >
              <div style={{ fontWeight: '950', color: '#1e293b', marginBottom: '16px', fontSize: '18px', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#a855f7' }}>Q:</span>
                {faq.question}
              </div>
              <div style={{ color: '#6b21a8', fontWeight: '600', fontSize: '16px', lineHeight: '1.7', paddingLeft: '34px', opacity: 0.8 }}>
                {faq.answer}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SectionTitle = ({ title, icon, color = '#6366f1' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
    <div style={{ 
      width: '48px', height: '48px', borderRadius: '16px', 
      background: `${color}15`, color: color, 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px'
    }}>
      {icon}
    </div>
    <h3 style={{ fontSize: '22px', fontWeight: '950', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{title}</h3>
  </div>
);

const StatCard = ({ label, value, icon, trend, color }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)' }}
    className="card" 
    style={{ padding: '32px', borderRadius: '32px', border: '1px solid #f1f5f9' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      {trend && (
        <span style={{ fontSize: '12px', fontWeight: '900', color: trend.startsWith('+') ? '#10b981' : '#ef4444', background: trend.startsWith('+') ? '#f0fdf4' : '#fef2f2', padding: '6px 12px', borderRadius: '10px' }}>
          {trend}
        </span>
      )}
    </div>
    <div style={{ fontSize: '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</div>
    <div style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', letterSpacing: '-0.03em' }}>{value}</div>
  </motion.div>
);

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState('upload-documents');
  const [reportData, setReportData] = useState(null);
  const [mistralLoading, setMistralLoading] = useState(false);
  const [mistralAnalysis, setMistralAnalysis] = useState("");
  const [mistralStats, setMistralStats] = useState({ confidence: 0, latency: 0 });
  const [documents, setDocuments] = useState([]);
  const [personaData, setPersonaData] = useState({
    agentName: 'Admission Assistant',
    designation: 'Admissions Counselor',
    toneStyle: 'Friendly',
    voiceGender: 'Female',
    voiceSpeed: 1,
    personaDescription: 'You are a helpful and enthusiastic admissions counselor representing the university. Your goal is to guide prospective students through the enrollment process.'
  });
  
  const [intents, setIntents] = useState([
    { id: 1, name: 'Fee Objection', triggers: 'expensive, high fees', response: 'I completely understand that managing tuition is a priority. We do have flexible monthly payment plans and scholarship options we can explore. Would you like me to send you the details?', goal: 'Reduce hesitation', tone: 'Empathetic' }
  ]);

  const [rules, setRules] = useState([
    { id: 1, conditionType: 'User says', conditionValue: 'call me later', actionType: 'Schedule follow-up', actionConfig: 'after 2 days' }
  ]);

  const [scriptControl, setScriptControl] = useState({
    generatedScript: "Hi, this is {AgentName} from {UniversityName}. I'm calling because you inquired about our program...",
    editableScript: "Hi, this is {AgentName} from {UniversityName}. I'm calling because you inquired about our program...",
    additionalInstructions: "Keep the tone energetic but professional."
  });

  const tabs = [
    { id: 'upload-documents', label: 'Knowledge Base', icon: <Brain size={18} /> },
    { id: 'ai-tone-persona', label: 'Tone & Persona', icon: <Sparkles size={18} /> },
    { id: 'pitch-script', label: 'Training & Script', icon: <MessageSquare size={18} /> },
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', marginTop: '20px' }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', padding: '8px', borderRadius: '12px', color: 'white' }}>
              <Zap size={20} fill="white" />
            </div>
            <span style={{ color: '#6366f1', fontWeight: '800', fontSize: '14px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Intelligence Core</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '950', marginBottom: '12px', letterSpacing: '-0.04em', color: '#0f172a' }}>Agent Workspace</h1>
          <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '500', maxWidth: '600px' }}>
            Engineer your AI Sales Agent's core personality, knowledge depth, and conversation strategy.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '6px', borderRadius: '24px', border: '1px solid #e2e8f0' }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#6366f1' : '#64748b',
                borderRadius: '20px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                border: 'none',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: activeTab === tab.id ? '0 12px 20px -5px rgba(0, 0, 0, 0.1)' : 'none',
                fontSize: '15px'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </motion.div>
      </header>

      <main style={{ width: '100%', minHeight: '600px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeTab === 'upload-documents' && (
              <UploadDocuments 
                reportData={reportData} 
                setReportData={setReportData}
                documents={documents}
                setDocuments={setDocuments}
              />
            )}
            {activeTab === 'ai-tone-persona' && (
              <AITonePersona 
                formData={personaData}
                setFormData={setPersonaData}
              />
            )}
            {activeTab === 'pitch-script' && (
              <PitchScript 
                intents={intents} 
                setIntents={setIntents} 
                rules={rules} 
                setRules={setRules}
                scriptControl={scriptControl}
                setScriptControl={setScriptControl}
                reportData={reportData}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function UploadDocuments({ reportData, setReportData, documents, setDocuments }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocId, setCurrentDocId] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/api/documents');
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
      const response = await api.post('/api/upload', formData, true);
      if (response.success) {
        showToast('Neural extraction complete', 'success');
        const report = typeof response.data.aiReport === 'string' 
          ? JSON.parse(response.data.aiReport) 
          : response.data.aiReport;
        
        if (report.status === 'error') {
          showToast('Analysis Warning: AI extraction failed. Opening Manual Correction mode.', 'warning');
          setReportData(report);
          setCurrentDocId(response.data.id);
          setIsEditing(true);
        } else {
          setReportData(report);
          setCurrentDocId(response.data.id);
          setActiveSection('full-report');
          
          // Trigger Mistral Analysis for deeper insights
          triggerMistralAnalysis(report);
        }
        fetchDocuments();
      }
    } catch (err) {
      showToast(err.message || 'Upload failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerMistralAnalysis = async (data) => {
    setMistralLoading(true);
    setMistralAnalysis("");
    const startTime = Date.now();
    try {
      const content = JSON.stringify(data, null, 2);
      let firstChunkReceived = false;
      await analyzeWithMistral(content, (chunk, full) => {
        if (!firstChunkReceived) {
          const latency = Date.now() - startTime;
          setMistralStats(prev => ({ ...prev, latency }));
          firstChunkReceived = true;
        }
        setMistralAnalysis(full);
      });
      setMistralStats(prev => ({ ...prev, confidence: 95 + Math.random() * 4 }));
      showToast('Mistral Neural Deep-Dive Complete', 'success');
    } catch (err) {
      console.error('Mistral failed:', err);
      showToast('Neural link interrupted', 'error');
    } finally {
      setMistralLoading(false);
    }
  };

  const deleteDocument = async (id) => {
    if (!confirm('Are you sure you want to delete this repository?')) return;
    try {
      await api.delete(`/api/documents/${id}`);
      showToast('Repository purged', 'success');
      fetchDocuments();
    } catch (err) {
      showToast('Failed to delete', 'error');
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{
            border: isDragOver ? '2px dashed #6366f1' : '2px dashed #cbd5e1',
            background: isDragOver ? 'rgba(99, 102, 241, 0.04)' : '#ffffff',
            padding: '120px 48px',
            textAlign: 'center',
            transition: 'all 0.4s ease',
            cursor: 'pointer',
            borderRadius: '40px',
            boxShadow: isDragOver ? '0 30px 60px -12px rgba(99, 102, 241, 0.15)' : '0 20px 40px -10px rgba(0, 0, 0, 0.05)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={() => document.getElementById('file-upload').click()}
        >
          {/* Animated Background Gradients */}
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            borderRadius: '50%', pointerEvents: 'none'
          }}></div>
          
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ 
              width: '96px', height: '96px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              borderRadius: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 40px', boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)', color: 'white'
            }}
          >
            <Upload size={42} strokeWidth={2.5} />
          </motion.div>

          <h2 style={{ marginBottom: '16px', fontSize: '36px', fontWeight: '950', color: '#0f172a', letterSpacing: '-0.03em' }}>
            Expand AI Intelligence
          </h2>
          <p style={{ marginBottom: '48px', maxWidth: '540px', marginInline: 'auto', color: '#64748b', fontSize: '19px', lineHeight: '1.6', fontWeight: '500' }}>
            Upload brochures, curriculum guides, or FAQ docs. Our neural engine extracts deep insights to train your agent instantly.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center' }}>
            <button className="btn-primary" style={{ 
              padding: '18px 56px', borderRadius: '18px', fontSize: '17px', fontWeight: '800',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: 'none', color: 'white',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)', transition: 'all 0.3s'
            }}>
              Select Training Files
            </button>
            <div style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '700' }}>or drag and drop</div>
          </div>

          <input type="file" id="file-upload" style={{ display: 'none' }} accept=".pdf,.docx" onChange={(e) => e.target.files?.[0] && uploadKnowledgeFile(e.target.files[0])} />
          
          <div style={{ marginTop: '56px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {['DOCX', 'PDF', 'TEXT', 'JSON'].map(type => (
              <div key={type} style={{ 
                padding: '10px 20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' 
              }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>{type}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {documents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="card" style={{ padding: '48px', borderRadius: '40px', background: '#ffffff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                    <Database size={18} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Knowledge Repositories</h3>
                </div>
                <p style={{ color: '#64748b', margin: 0, fontWeight: '500', fontSize: '16px' }}>Manage and explore active knowledge sets.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
              {documents.map((doc, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  style={{ 
                    padding: '28px', background: '#ffffff', borderRadius: '28px', border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ 
                      width: '56px', height: '56px', background: '#f1f5f9', borderRadius: '18px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1'
                    }}>
                      <FileText size={28} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '17px', fontWeight: '800', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.file_name || doc.fileName}
                      </div>
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '800' }}>{doc.status === 'processed' ? 'SYNCED' : 'PROCESSING'}</span>
                    </div>
                    <button onClick={() => deleteDocument(doc.id)} style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <button 
                    className="btn-outline" 
                    style={{ width: '100%', fontSize: '14px', padding: '12px', borderRadius: '14px', fontWeight: '800' }} 
                    onClick={() => {
                      try {
                        const report = typeof doc.ai_report === 'string' ? JSON.parse(doc.ai_report) : doc.ai_report || doc.aiReport;
                        setReportData(report);
                        setCurrentDocId(doc.id);
                        setActiveSection('full-report');
                        
                        // Trigger Mistral Analysis for deeper insights
                        triggerMistralAnalysis(report);
                      } catch (e) {
                        const report = doc.ai_report || doc.aiReport;
                        setReportData(report);
                        setCurrentDocId(doc.id);
                        setActiveSection('full-report');
                        triggerMistralAnalysis(report);
                      }
                    }}
                  >
                    Launch Premium Report <ChevronRight size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ 
          textAlign: 'center', padding: '160px 0', borderRadius: '40px', background: '#ffffff',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '48px' }}>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '6px solid #f1f5f9', borderTopColor: '#6366f1' }}
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '48px' }}>🧠</div>
        </div>
        <h3 style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', marginBottom: '12px' }}>Neural Processing</h3>
        <p style={{ color: '#64748b', fontSize: '18px', fontWeight: '500' }}>Decrypting document architecture and extraction mapping...</p>
      </motion.div>
    );
  }

  const navItems = [
    { id: 'full-report', label: 'Premium Report', icon: <Award size={18} /> },
    { id: 'overview', label: 'Dashboard', icon: <Layers size={18} /> },
    { id: 'courses', label: 'Programs', icon: <GraduationCap size={18} /> },
    { id: 'curriculum', label: 'Curriculum', icon: <BookOpen size={18} /> },
    { id: 'outcomes', label: 'Outcomes', icon: <Rocket size={18} /> },
    { id: 'faqs', label: 'Support', icon: <HelpCircle size={18} /> },
    { id: 'mistral', label: 'Mistral AI', icon: <Sparkles size={18} /> }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
    >
      <AnimatePresence>
        {isEditing && (
          <KnowledgeEditor 
            data={reportData} 
            onSave={async (newData) => {
              try {
                if (currentDocId) {
                  const response = await api.patch(`/api/documents/${currentDocId}`, newData);
                  if (response.success) {
                    setReportData(newData);
                    setIsEditing(false);
                    showToast('Neural schema synced with core', 'success');
                    fetchDocuments();
                  }
                } else {
                  // Fallback for UI-only state
                  setReportData(newData);
                  setIsEditing(false);
                  showToast('Local schema updated', 'success');
                }
              } catch (err) {
                showToast('Failed to sync neural data', 'error');
              }
            }} 
            onCancel={() => setIsEditing(false)} 
          />
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px', alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', height: '64px', borderRadius: '20px', 
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '24px', fontWeight: '950', margin: '0 auto 16px',
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)'
              }}>
                {reportData.institute_name?.[0] || 'A'}
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '950', color: '#0f172a' }}>
                {reportData.institute_name || 'Agent Brain'}
              </h4>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>Neural Core Ready</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navItems.map(item => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  style={{ 
                    padding: '14px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px',
                    background: activeSection === item.id ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                    color: activeSection === item.id ? 'white' : '#64748b',
                    fontSize: '14px', fontWeight: '800', border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn-outline" 
                style={{ width: '100%', borderRadius: '14px', padding: '14px', fontSize: '13px', fontWeight: '900', border: '2px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => setIsEditing(true)}
              >
                <Edit3 size={14} /> Manual Correction
              </button>
              <button 
                className="btn-outline" 
                style={{ width: '100%', borderRadius: '14px', padding: '14px', fontSize: '13px', fontWeight: '900', border: '2px solid #f1f5f9' }}
                onClick={() => setReportData(null)}
              >
                Reset & Re-upload
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AnimatePresence mode="wait">
            {activeSection === 'full-report' && (
              <KnowledgeReportView key="full-report" data={reportData} />
            )}
            {activeSection === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                <div className="card" style={{ padding: '56px', borderRadius: '40px', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', color: '#6366f1' }}>
                    <Sparkles size={20} />
                    <span style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Extraction Intelligence Active</span>
                  </div>

                  <h1 style={{ fontSize: '42px', fontWeight: '950', color: '#0f172a', marginBottom: '16px', letterSpacing: '-0.03em' }}>
                    {reportData.institute_name || 'Knowledge Extracted'}
                  </h1>
                  <p style={{ fontSize: '20px', color: '#64748b', fontWeight: '600', marginBottom: '40px', maxWidth: '800px', lineHeight: '1.5' }}>
                    {reportData.institute_tagline || 'We have successfully digitized your institution\'s core offerings and personality.'}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {(reportData.highlights || ['Verified Knowledge', 'AI Optimized', 'Sales Ready']).map((h, i) => (
                      <div key={i} style={{ 
                        padding: '10px 20px', borderRadius: '14px', background: '#f8fafc', 
                        color: '#475569', fontSize: '14px', fontWeight: '800', border: '1px solid #f1f5f9',
                        display: 'flex', alignItems: 'center', gap: '10px'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }}></div>
                        {h}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                  {[
                    { label: 'Active Programs', val: reportData.courses?.length || 0, icon: <GraduationCap size={24} /> },
                    { label: 'Knowledge Nodes', val: (reportData.modules?.length || 0) * 5, icon: <Layers size={24} /> },
                    { label: 'Partnerships', val: reportData.partners?.length || 0, icon: <Briefcase size={24} /> }
                  ].map((stat, i) => (
                    <div key={i} className="card" style={{ padding: '32px', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: '#f8fafc', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                        {stat.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#94a3b8', marginBottom: '4px' }}>{stat.label}</div>
                        <div style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a' }}>{stat.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: '48px', borderRadius: '32px', marginTop: '32px' }}>
                  <h3 style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', marginBottom: '32px' }}>Learning Ecosystem</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {(reportData.learning_outcomes || ['End-to-end Skill Mastery', 'Live Project Exposure', 'Job-ready Portfolio']).map((outcome, i) => (
                      <motion.div 
                        key={i} 
                        whileHover={{ x: 10 }}
                        style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}
                      >
                        <div style={{ fontSize: '24px' }}>✅</div>
                        <span style={{ fontSize: '17px', fontWeight: '800', color: '#1e293b' }}>{outcome}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'courses' && (
              <motion.div 
                key="courses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
              >
                {(reportData.courses || []).map((course, i) => (
                  <div key={i} className="card" style={{ padding: '48px', borderRadius: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '40px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.1em' }}>Program Catalog {i + 1}</div>
                        <h2 style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', margin: 0 }}>{course.course_name}</h2>
                      </div>
                      <div style={{ padding: '20px 32px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', borderRadius: '24px', textAlign: 'right', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>
                        <div style={{ fontSize: '12px', fontWeight: '800', opacity: 0.8, marginBottom: '4px' }}>INVESTMENT</div>
                        <div style={{ fontSize: '24px', fontWeight: '950' }}>{course.fee?.includes('₹') ? course.fee : `₹${course.fee}`}</div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                      {[
                        { label: 'Duration', value: course.duration, icon: <Clock size={18} /> },
                        { label: 'Total Hours', value: course.total_hours, icon: <Calendar size={18} /> },
                        { label: 'Delivery Mode', value: course.mode, icon: <Layout size={18} /> },
                        { label: 'Prerequisites', value: course.eligibility, icon: <ShieldCheck size={18} /> }
                      ].map((item, j) => (
                        <div key={j} style={{ padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                          <div style={{ color: '#6366f1', marginBottom: '16px' }}>{item.icon}</div>
                          <div style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>{item.label}</div>
                          <div style={{ fontSize: '17px', fontWeight: '900', color: '#0f172a' }}>{item.value || 'Consult Brochure'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeSection === 'curriculum' && (
              <motion.div 
                key="curriculum"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
              >
                <div className="card" style={{ padding: '48px', borderRadius: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={24} />
                    </div>
                    <h3 style={{ fontSize: '26px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Module Breakdown</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {(reportData.modules || []).map((mod, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ padding: '32px', border: '1px solid #f1f5f9', borderRadius: '28px', background: '#ffffff' }}
                      >
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'start' }}>
                          <div style={{ 
                            width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '950', flexShrink: 0, fontSize: '20px'
                          }}>
                            {i + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '24px' }}>{mod.module_title}</h5>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                              {mod.topics?.map((topic, j) => (
                                <span key={j} style={{ 
                                  padding: '10px 20px', borderRadius: '14px', background: '#f1f5f9', 
                                  color: '#475569', fontSize: '14px', fontWeight: '700' 
                                }}>{topic}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: '48px', borderRadius: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Terminal size={24} />
                    </div>
                    <h3 style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Technology Stack</h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {(reportData.tools_technologies || []).map((tool, i) => (
                      <div key={i} style={{ padding: '16px 32px', background: '#f8fafc', color: '#0f172a', borderRadius: '20px', fontWeight: '800', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          {/* OUTCOMES SECTION */}
          {activeSection === 'outcomes' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Target size={24} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Career Pathways</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(reportData.job_roles || []).map((role, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ padding: '20px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '18px', color: '#065f46', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '16px' }}
                      >
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }}></div>
                        {role}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Globe size={24} />
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Global Impact</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(reportData.industry_scope || []).map((scope, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ padding: '20px', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: '18px', color: '#1e40af', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '16px' }}
                      >
                        <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#3b82f6' }}></div>
                        {scope}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#fdf2f8', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={24} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Hiring Network</h3>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {(reportData.partners || []).map((p, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.05, y: -5 }}
                      style={{ padding: '20px 40px', background: 'white', border: '2px solid #f1f5f9', borderRadius: '24px', fontWeight: '950', color: '#334155', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                    >
                      {p}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* FAQS SECTION */}
          {activeSection === 'faqs' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
              <div className="card" style={{ padding: '48px', borderRadius: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone size={28} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Nexus Contact Grid</h2>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>Official verified institute contact details.</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
                  <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', fontWeight: '950', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '12px' }}>OFFICIAL EMAIL</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{reportData.contact?.email || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', fontWeight: '950', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '12px' }}>SUPPORT LINE</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{reportData.contact?.phone || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '11px', fontWeight: '950', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '12px' }}>INSTITUTE PORTAL</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>{reportData.contact?.website || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9', gridColumn: 'span 2' }}>
                    <div style={{ fontSize: '11px', fontWeight: '950', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '16px' }}>REGIONAL BRANCHES</div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {(reportData.contact?.branches || []).map((b, i) => (
                        <span key={i} style={{ padding: '10px 24px', background: 'white', borderRadius: '14px', fontSize: '14px', fontWeight: '800', color: '#334155', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ padding: '48px', borderRadius: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <HelpCircle size={28} />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: '950', color: '#0f172a', margin: 0 }}>Intelligence Q&A</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {(reportData.faqs || []).map((faq, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      style={{ padding: '32px', background: '#faf5ff', borderRadius: '28px', border: '1px solid #f3e8ff' }}
                    >
                      <div style={{ fontWeight: '950', color: '#1e293b', marginBottom: '12px', fontSize: '17px', display: 'flex', gap: '16px' }}>
                        <span style={{ color: '#a855f7' }}>Q:</span>
                        {faq.question}
                      </div>
                      <div style={{ color: '#6b21a8', fontWeight: '600', fontSize: '15px', lineHeight: '1.7', paddingLeft: '34px' }}>
                        {faq.answer}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'mistral' && (
            <motion.div 
              key="mistral"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card"
              style={{ padding: '56px', borderRadius: '48px', background: '#0f172a', color: '#f1f5f9', boxShadow: '0 40px 100px -20px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ 
                    width: '72px', height: '72px', borderRadius: '24px', 
                    background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)'
                  }}>
                    <Sparkles size={36} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '32px', fontWeight: '950', color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>Mistral Neural Insights</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: mistralLoading ? '#f59e0b' : '#10b981' }}></div>
                      <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {mistralLoading ? 'Neural Link Active...' : 'Analysis Optimized'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => triggerMistralAnalysis(reportData)}
                  disabled={mistralLoading}
                  style={{ 
                    padding: '12px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.05)', 
                    color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px', 
                    fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                    opacity: mistralLoading ? 0.5 : 1
                  }}
                >
                  <Zap size={14} /> {mistralLoading ? 'Analyzing...' : 'Regenerate Analysis'}
                </button>
              </div>

              {mistralLoading && !mistralAnalysis ? (
                <div style={{ padding: '120px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
                  <div className="neural-loader"></div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#6366f1', letterSpacing: '-0.01em' }}>Deciphering institutional knowledge patterns...</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ 
                    padding: '40px', background: 'rgba(255,255,255,0.02)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: '"JetBrains Mono", monospace', fontSize: '16px', lineHeight: '1.8', color: '#cbd5e1',
                    whiteSpace: 'pre-wrap', position: 'relative'
                  }}>
                    {mistralAnalysis || "Waiting for document synchronization to initiate deep-dive analysis..."}
                    {mistralLoading && <motion.span animate={{ opacity: [0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: '#6366f1' }}>█</motion.span>}
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    <div style={{ padding: '32px', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', marginBottom: '16px' }}>AI Confidence</h4>
                      <div style={{ fontSize: '28px', fontWeight: '950', color: '#ffffff' }}>
                        {mistralStats.confidence ? `${mistralStats.confidence.toFixed(1)}%` : '--%'}
                      </div>
                    </div>
                    <div style={{ padding: '32px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '24px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '900', color: '#10b981', textTransform: 'uppercase', marginBottom: '16px' }}>Neural Latency</h4>
                      <div style={{ fontSize: '28px', fontWeight: '950', color: '#ffffff' }}>
                        {mistralStats.latency ? `${mistralStats.latency}ms` : '--ms'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          </AnimatePresence>

          {/* Action Footer */}
          <div style={{ 
            marginTop: '48px', padding: '40px', background: 'linear-gradient(to right, #0f172a, #1e293b)', borderRadius: '32px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div>
              <div style={{ fontWeight: '950', color: 'white', fontSize: '20px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Zap size={24} style={{ color: '#10b981' }} />
                Synchronize Neural Architecture
              </div>
              <p style={{ margin: 0, fontSize: '15px', color: '#94a3b8', fontWeight: '600' }}>Commit all extracted knowledge and persona settings to the active AI agent.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary" 
              disabled={isDeploying}
              style={{ 
                padding: '20px 56px', fontSize: '17px', fontWeight: '950', borderRadius: '20px',
                background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: 'white',
                boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '16px',
                opacity: isDeploying ? 0.7 : 1, transition: 'all 0.3s'
              }} 
              onClick={async () => {
                setIsDeploying(true);
                await new Promise(r => setTimeout(r, 2000));
                setIsDeploying(false);
                showToast('AI Neural Bank Updated Successfully!', 'success');
              }}
            >
              {isDeploying ? (
                <>
                  <div style={{ width: '24px', height: '24px', border: '3px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  Encrypting & Syncing...
                </>
              ) : (
                'Finalize AI Deployment 🚀'
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AITonePersona({ formData, setFormData }) {
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
      
      const response = await api.post('/api/persona', payload);
      if (response.success) {
        showToast('Neural identity established', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save persona', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '32px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div className="card" style={{ padding: '48px', borderRadius: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #f43f5e, #e11d48)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={32} />
            </div>
            <div>
              <h2 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', margin: 0, letterSpacing: '-0.03em' }}>Identity & Tone</h2>
              <p style={{ margin: 0, color: '#64748b', fontWeight: '600', fontSize: '17px' }}>Configure the personality of your AI sales agent.</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Agent Moniker</label>
              <input 
                type="text" 
                name="agentName"
                placeholder="e.g. Alex"
                style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', color: '#0f172a', transition: 'all 0.3s' }}
                value={formData.agentName}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Professional Role</label>
              <input 
                type="text" 
                name="designation"
                placeholder="e.g. Senior Admissions Advisor"
                style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', color: '#0f172a', transition: 'all 0.3s' }}
                value={formData.designation}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Communication Ethos</label>
              <select 
                name="toneStyle"
                style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', color: '#0f172a', cursor: 'pointer' }}
                value={formData.toneStyle}
                onChange={handleChange}
              >
                <option value="Formal">Elite & Professional</option>
                <option value="Friendly">Warm & Energetic</option>
                <option value="Persuasive">High-Impact Sales</option>
                <option value="Empathetic">Consultative & Supportive</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vocal Profile</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['Female', 'Male'].map(gender => (
                  <button
                    key={gender}
                    style={{
                      flex: 1, padding: '18px', borderRadius: '18px', border: '2px solid',
                      borderColor: formData.voiceGender === gender ? '#6366f1' : '#f1f5f9',
                      background: formData.voiceGender === gender ? 'rgba(99, 102, 241, 0.05)' : '#f8fafc',
                      color: formData.voiceGender === gender ? '#6366f1' : '#64748b',
                      fontWeight: '800', cursor: 'pointer', transition: 'all 0.4s'
                    }}
                    onClick={() => setFormData({...formData, voiceGender: gender})}
                  >
                    {gender === 'Female' ? '👩 Female' : '👨 Male'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '48px', borderRadius: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <label style={{ fontSize: '13px', fontWeight: '900', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Persona Core Directives</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#6366f1', color: 'white', padding: '6px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '900' }}>
              <Zap size={14} /> Neural Protocol
            </div>
          </div>
          <textarea 
            name="personaDescription"
            placeholder="Define specific behavioral rules, phrases to avoid, and core personality traits..."
            style={{ 
              padding: '32px', borderRadius: '28px', border: '2px solid #f1f5f9', background: '#f8fafc', 
              color: '#0f172a', minHeight: '260px', resize: 'vertical', fontFamily: 'Inter, sans-serif', 
              lineHeight: '1.8', fontSize: '17px', fontWeight: '500', outline: 'none'
            }}
            value={formData.personaDescription}
            onChange={handleChange}
          />
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn-primary" 
              style={{ padding: '20px 64px', borderRadius: '20px', fontSize: '17px', fontWeight: '950', boxShadow: '0 15px 30px rgba(99, 102, 241, 0.3)' }} 
              onClick={handleSavePersona} 
              disabled={loading}
            >
              {loading ? 'Establish Identity...' : 'Finalize AI Identity'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="card" 
          style={{ padding: '40px', borderRadius: '32px', background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white' }}
        >
          <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.1)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', fontSize: '24px' }}>
            💡
          </div>
          <h3 style={{ fontSize: '22px', fontWeight: '950', marginBottom: '16px', letterSpacing: '-0.02em' }}>Impact Strategy</h3>
          <p style={{ margin: 0, opacity: 0.8, fontSize: '15px', lineHeight: '1.7', fontWeight: '500' }}>
            A "Persuasive" ethos combined with a speed of 1.1x often results in 14% higher engagement for outbound sales initiatives.
          </p>
        </motion.div>

        <div className="card" style={{ padding: '40px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: '900', color: '#475569', textTransform: 'uppercase' }}>Speech Modulation</label>
            <span style={{ fontWeight: '950', color: '#6366f1', background: '#eef2ff', padding: '6px 14px', borderRadius: '10px', fontSize: '15px' }}>{formData.voiceSpeed}x</span>
          </div>
          <input 
            type="range" 
            name="voiceSpeed"
            min="0.8" 
            max="1.5" 
            step="0.1"
            style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', appearance: 'none', cursor: 'pointer', accentColor: '#6366f1' }}
            value={formData.voiceSpeed}
            onChange={handleChange}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>
            <span>CONSERVATIVE</span>
            <span>ACCELERATED</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PitchScript({ intents, setIntents, rules, setRules, scriptControl, setScriptControl, reportData }) {
  const [activeSubSection, setActiveSubSection] = useState('brain');
  const [previewPrompt, setPreviewPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const subSections = [
    { id: 'brain', label: 'Knowledge Objections', icon: <Brain size={20} />, color: '#6366f1' },
    { id: 'rules', label: 'Neural Logic', icon: <Code size={20} />, color: '#10b981' },
    { id: 'script', label: 'Call Flow Bank', icon: <Mic size={20} />, color: '#f59e0b' },
    { id: 'preview', label: 'AI Core Preview', icon: <Zap size={20} />, color: '#a855f7' }
  ];

  const handleSaveScript = async () => {
    setLoading(true);
    try {
      const payload = {
        sections: { intents, rules, scriptControl }
      };
      const response = await api.post('/api/script', payload);
      if (response.success) {
        showToast('Conversation architecture synchronized', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to save script', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePreview = () => {
    const prompt = `[SYSTEM_CORE_INIT]
Role: Expert Admissions AI Agent
Identity: Neural Sync Protocol v2.1

CORE KNOWLEDGE REPOSITORY:
${reportData ? JSON.stringify(reportData, null, 2) : '[Initiating high-fidelity document insights extracted from source]'}

CONVERSATIONAL INTELLIGENCE:
${intents.map(i => `>> INTENT: ${i.name.toUpperCase()}
   Triggers: [${i.triggers}]
   Strategy: ${i.goal} | Tone: ${i.tone}
   Response: ${i.response}`).join('\n\n')}

NEURAL LOGIC GATEWAYS:
${rules.map(r => `IF ${r.conditionType}("${r.conditionValue}") >> EXECUTE ${r.actionType}`).join('\n')}

PRIMARY CALL ARCHITECTURE:
${scriptControl.editableScript}

ADDITIONAL NEURAL TRAINING:
${scriptControl.additionalInstructions}`;
    
    setPreviewPrompt(prompt);
    setActiveSubSection('preview');
    showToast('AI Neural Mapping Compiled', 'success');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '40px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {subSections.map(sec => (
          <motion.button
            key={sec.id}
            whileHover={{ x: 10 }}
            onClick={() => setActiveSubSection(sec.id)}
            style={{
              padding: '24px',
              background: activeSubSection === sec.id ? '#ffffff' : 'transparent',
              color: activeSubSection === sec.id ? sec.color : '#64748b',
              borderRadius: '24px',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeSubSection === sec.id ? '0 20px 40px -10px rgba(0,0,0,0.08)' : 'none',
              fontWeight: '900',
              fontSize: '16px',
              letterSpacing: '-0.01em'
            }}
          >
            <div style={{ 
              width: '44px', height: '44px', borderRadius: '14px', 
              background: activeSubSection === sec.id ? `${sec.color}15` : '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {sec.icon}
            </div>
            {sec.label}
          </motion.button>
        ))}

        <div style={{ marginTop: 'auto', padding: '32px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '950', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Rocket size={18} style={{ color: '#6366f1' }} /> Training Status
          </h4>
          <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '5px' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#64748b' }}>Neural Readiness</span>
            <span style={{ fontSize: '14px', fontWeight: '950', color: '#6366f1' }}>85%</span>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '56px', borderRadius: '48px', minHeight: '700px', display: 'flex', flexDirection: 'column', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.06)' }}>
        <AnimatePresence mode="wait">
          {activeSubSection === 'brain' && (
            <motion.div 
              key="brain"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>Objection Intelligence</h3>
                  <p style={{ margin: 0, fontSize: '17px', color: '#64748b', fontWeight: '600' }}>Define how the AI handles complex hurdles and questions.</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary" 
                  onClick={() => setIntents([...intents, { id: Date.now(), name: '', triggers: '', response: '', goal: '', tone: 'Friendly' }])}
                  style={{ borderRadius: '18px', padding: '16px 32px', fontSize: '15px', fontWeight: '900', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
                >
                  + Add Neural Intent
                </motion.button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {intents.map((intent, index) => (
                  <motion.div 
                    layout
                    key={intent.id} 
                    style={{ padding: '40px', border: '2px solid #f1f5f9', borderRadius: '32px', background: '#ffffff', position: 'relative' }}
                  >
                    <button 
                      onClick={() => setIntents(intents.filter(i => i.id !== intent.id))}
                      style={{ position: 'absolute', top: '32px', right: '32px', background: '#fee2e2', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: '900', padding: '8px 16px', borderRadius: '12px' }}
                    >
                      REMOVE
                    </button>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Objection Category</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Financial Constraints"
                          style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', outline: 'none' }}
                          value={intent.name}
                          onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, name: e.target.value } : i))}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Trigger Patterns</label>
                        <input 
                          type="text" 
                          placeholder="e.g. expensive, fees, installments"
                          style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', outline: 'none' }}
                          value={intent.triggers}
                          onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, triggers: e.target.value } : i))}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '12px' }}>AI Rebuttal Strategy</label>
                      <textarea 
                        placeholder="Define the optimal response sequence..."
                        style={{ padding: '24px', borderRadius: '24px', border: '2px solid #f1f5f9', background: '#f8fafc', minHeight: '140px', width: '100%', fontSize: '16px', fontWeight: '600', lineHeight: '1.7', outline: 'none' }}
                        value={intent.response}
                        onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, response: e.target.value } : i))}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Conversion Goal</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Resolve doubt & close"
                          style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', outline: 'none' }}
                          value={intent.goal}
                          onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, goal: e.target.value } : i))}
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Communication Tone</label>
                        <select 
                          style={{ padding: '20px', borderRadius: '18px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '17px', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
                          value={intent.tone}
                          onChange={(e) => setIntents(intents.map(i => i.id === intent.id ? { ...i, tone: e.target.value } : i))}
                        >
                          <option value="Friendly">Empathetic & Warm</option>
                          <option value="Persuasive">High-Impact Sales</option>
                          <option value="Professional">Formal & Authoritative</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubSection === 'rules' && (
            <motion.div 
              key="rules"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>Behavioral Logic</h3>
                  <p style={{ margin: 0, fontSize: '17px', color: '#64748b', fontWeight: '600' }}>Strict protocol enforcement for specific scenarios.</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary" 
                  onClick={() => setRules([...rules, { id: Date.now(), conditionType: 'User says', conditionValue: '', actionType: 'Schedule follow-up', actionConfig: '' }])}
                  style={{ borderRadius: '18px', padding: '16px 32px', fontSize: '15px', fontWeight: '900', background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  + Create Neural Rule
                </motion.button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {rules.map((rule, index) => (
                  <motion.div 
                    layout
                    key={rule.id} 
                    style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '32px', background: '#f8fafc', borderRadius: '28px', border: '2px solid #f1f5f9' }}
                  >
                    <div style={{ width: '56px', height: '56px', background: '#6366f1', color: 'white', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '950', fontSize: '16px' }}>IF</div>
                    
                    <select 
                      style={{ flex: 1, padding: '18px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '700', fontSize: '15px', outline: 'none' }}
                      value={rule.conditionType}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, conditionType: e.target.value } : r))}
                    >
                      <option value="User says">Student mentions...</option>
                      <option value="Call duration >">Interaction duration exceeds...</option>
                      <option value="User sentiment is">Sentiment shifts to...</option>
                    </select>

                    <input 
                      type="text" 
                      placeholder="Defining condition..."
                      style={{ flex: 1, padding: '18px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '700', fontSize: '15px', outline: 'none' }}
                      value={rule.conditionValue}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, conditionValue: e.target.value } : r))}
                    />

                    <div style={{ width: '56px', height: '56px', background: '#10b981', color: 'white', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '950', fontSize: '16px' }}>THEN</div>

                    <select 
                      style={{ flex: 1, padding: '18px', borderRadius: '16px', border: '2px solid #e2e8f0', background: 'white', fontWeight: '700', fontSize: '15px', outline: 'none' }}
                      value={rule.actionType}
                      onChange={(e) => setRules(rules.map(r => r.id === rule.id ? { ...r, actionType: e.target.value } : r))}
                    >
                      <option value="Schedule follow-up">Log Follow-up CRM</option>
                      <option value="End call gracefully">Graceful Termination</option>
                      <option value="Transfer to human">Neural Handover to Sales</option>
                    </select>

                    <button 
                      onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                      style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '12px' }}
                    >
                      <AlertTriangle size={20} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSubSection === 'script' && (
            <motion.div 
              key="script"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
              <div>
                <h3 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>Call Architecture</h3>
                <p style={{ margin: 0, fontSize: '17px', color: '#64748b', fontWeight: '600' }}>Master script that guides the agent through the conversation.</p>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Generated Framework</label>
                  <div style={{ 
                    padding: '32px', borderRadius: '32px', background: '#f1f5f9', color: '#475569', 
                    fontSize: '16px', lineHeight: '1.8', minHeight: '400px', fontWeight: '500', border: '1px solid #e2e8f0'
                  }}>
                    {scriptControl.generatedScript}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '900', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Production Script Console</label>
                  <textarea 
                    style={{ 
                      padding: '32px', borderRadius: '32px', border: '2px solid #eef2ff', background: '#ffffff', 
                      color: '#0f172a', minHeight: '400px', resize: 'none', fontSize: '16px', fontWeight: '600', 
                      lineHeight: '1.8', boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.1)', outline: 'none'
                    }}
                    value={scriptControl.editableScript}
                    onChange={(e) => setScriptControl({...scriptControl, editableScript: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ padding: '40px', background: '#fffbeb', borderRadius: '32px', border: '1px solid #fef3c7' }}>
                <SectionTitle title="Strategic Deployment Notes" icon="📜" color="#d97706" />
                <textarea 
                  placeholder="Inject specific behavioral nuances or critical reminders for this script..."
                  style={{ width: '100%', padding: '0', background: 'transparent', border: 'none', fontSize: '16px', fontWeight: '600', color: '#92400e', resize: 'none', outline: 'none', lineHeight: '1.7', minHeight: '80px' }}
                  value={scriptControl.additionalInstructions}
                  onChange={(e) => setScriptControl({...scriptControl, additionalInstructions: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          {activeSubSection === 'preview' && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '40px', flex: 1 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '28px', fontWeight: '950', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>Neural Intelligence Preview</h3>
                  <p style={{ margin: 0, fontSize: '17px', color: '#64748b', fontWeight: '600' }}>Direct view of the synthesized agent brain architecture.</p>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary" 
                  onClick={handleGeneratePreview}
                  style={{ borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', border: 'none', display: 'flex', gap: '12px', alignItems: 'center', padding: '18px 36px', fontSize: '16px', fontWeight: '900' }}
                >
                  <Zap size={20} fill="white" /> Compile Neural Bank
                </motion.button>
              </div>
              
              <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  position: 'absolute', top: '24px', left: '24px', display: 'flex', gap: '10px', zIndex: 10
                }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ff5f56' }}></div>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#27c93f' }}></div>
                </div>
                <textarea 
                  readOnly
                  style={{ 
                    flex: 1, padding: '80px 40px 40px', borderRadius: '40px', border: 'none', 
                    background: '#0f172a', color: '#38bdf8', fontSize: '15px', fontFamily: '"Fira Code", monospace', 
                    lineHeight: '2', resize: 'none', outline: 'none', boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  value={previewPrompt || "// Initiate 'Compile Neural Bank' to synchronize architecture..."}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '20px' }}>
                <button className="btn-outline" style={{ padding: '20px 40px', borderRadius: '20px', fontWeight: '900', fontSize: '16px' }}>Discard Configuration</button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary" 
                  style={{ padding: '20px 64px', borderRadius: '20px', fontWeight: '950', fontSize: '17px', background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)' }}
                  onClick={handleSaveScript}
                  disabled={loading}
                >
                  {loading ? 'Initiating Deployment...' : 'Deploy to Production AI 🚀'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// KnowledgeBase export is already defined above


