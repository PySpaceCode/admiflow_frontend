"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';
import { api } from '@/lib/api';
import { useEffect } from 'react';

// ── OTP Verify Button ───────────────────────────────────────
function OtpButton({ id, sent, loading, onSend, onVerify }) {
  const [otp, setOtp] = useState('');

  if (!sent) {
    return (
      <button
        id={id}
        className="btn-outline"
        style={{ whiteSpace: 'nowrap', padding: '10px 18px', fontSize: '13px' }}
        onClick={onSend}
        disabled={loading}
        type="button"
      >
        {loading ? 'Sending…' : 'Send OTP'}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        className="input-field"
        placeholder="Enter OTP"
        maxLength={6}
        value={otp}
        onChange={e => setOtp(e.target.value)}
        style={{ width: '120px' }}
      />
      <button
        className="btn-primary"
        style={{ padding: '10px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
        onClick={() => onVerify(otp)}
        type="button"
      >
        Verify
      </button>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function Onboarding() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // Core fields
  const [form, setForm] = useState({
    fullName: '',
    instituteName: '',
    instituteType: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    twitter: '',
  });

  // Pre-fill from stored user if available
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setForm(prev => ({
      ...prev,
      fullName: storedUser.full_name || '',
      email: storedUser.email || prev.email,
    }));
  }, []);

  // OTP states
  const [emailOtp, setEmailOtp] = useState({ sent: false, loading: false, verified: false });
  const [phoneOtp, setPhoneOtp] = useState({ sent: false, loading: false, verified: false });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  // Simulate sending OTP
  function handleSendOtp(type) {
    if (type === 'email') {
      setEmailOtp(s => ({ ...s, loading: true }));
      setTimeout(() => {
        setEmailOtp(s => ({ ...s, loading: false, sent: true }));
        showToast('OTP sent to your email address', 'info');
      }, 1200);
    } else {
      setPhoneOtp(s => ({ ...s, loading: true }));
      setTimeout(() => {
        setPhoneOtp(s => ({ ...s, loading: false, sent: true }));
        showToast('OTP sent to your phone number', 'info');
      }, 1200);
    }
  }

  // Simulate verifying OTP (any 6-digit code works)
  function handleVerifyOtp(type, code) {
    if (code.length < 4) {
      showToast('Please enter a valid OTP', 'error');
      return;
    }
    if (type === 'email') {
      setEmailOtp(s => ({ ...s, verified: true }));
      showToast('Email verified ✓', 'success');
    } else {
      setPhoneOtp(s => ({ ...s, verified: true }));
      showToast('Phone verified ✓', 'success');
    }
  }

  // Save handler
  async function handleSave(e) {
    e.preventDefault();
    if (!form.instituteName.trim()) {
      showToast('Institute name is required', 'error');
      return;
    }
    if (!form.fullName.trim()) {
      showToast('Full name is required', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        email: form.email,
        instituteName: form.instituteName,
        instituteType: form.instituteType || null,
        cityAddress: form.city || null,
        websiteUrl: form.website || null,
        phone: form.phone || null,
        emailVerification: emailOtp.verified ? "verified" : null,
        phoneVerification: phoneOtp.verified ? "verified" : null,
        socialMediaLinks: {
          fb: form.facebook || null,
          ig: form.instagram || null,
          linkedin: form.linkedin || null,
          x: form.twitter || null
        }
      };

      const response = await api.post('/api/onboarding/setup', payload);
      
      if (response.success) {
        showToast('Onboarding setup completes', 'success');
        // Update local user data if changed
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ 
          ...storedUser, 
          full_name: form.fullName,
          onboarding_completed: true 
        }));
        
        setTimeout(() => router.push('/knowledge-base'), 1500);
      } else {
        showToast(response.message || 'Failed to save onboarding details', 'error');
      }
    } catch (error) {
      showToast(error.message || 'An error occurred during onboarding', 'error');
    } finally {
      setSaving(false);
    }
  }

  const instituteTypes = [
    'Engineering College',
    'Medical College',
    'Arts & Science College',
    'MBA / Management Institute',
    'Coaching Centre',
    'School (K-12)',
    'Polytechnic / Vocational',
    'University',
    'Other',
  ];

  // ── Badge helper ─────────────
  const VerifiedBadge = () => (
    <span
      className="badge badge-success"
      style={{ fontSize: '12px', padding: '3px 10px' }}
    >
      ✓ Verified
    </span>
  );

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 className="text-heading" style={{ marginBottom: '6px' }}>Account Details</h1>
        <p className="text-muted" style={{ fontSize: '15px' }}>
          Set up your institute profile. This information powers the AI agent's context and communication.
        </p>
      </div>

      <form onSubmit={handleSave} noValidate>

        {/* ── Section 1: Institute Info ──────────────────── */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🏫 Institute Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Full Name */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                className="input-field"
                placeholder="e.g. John Doe"
                value={form.fullName}
                onChange={set('fullName')}
                required
              />
            </div>

            {/* Institute Name */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="instituteName">Institute Name *</label>
              <input
                id="instituteName"
                className="input-field"
                placeholder="e.g. Aakash Institute"
                value={form.instituteName}
                onChange={set('instituteName')}
                required
              />
            </div>

            {/* Institute Type */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="instituteType">Institute Type *</label>
              <div style={{ position: 'relative' }}>
                <select
                  id="instituteType"
                  className="input-field"
                  value={form.instituteType}
                  onChange={set('instituteType')}
                  style={{ 
                    cursor: 'pointer', 
                    appearance: 'none',
                    paddingRight: '40px' 
                  }}
                  required
                >
                  <option value="" disabled>Select type…</option>
                  {instituteTypes.map(t => (
                    <option key={t} value={t} style={{ background: 'var(--color-surface-lowest)', color: 'var(--color-on-surface)' }}>
                      {t}
                    </option>
                  ))}
                </select>
                <div style={{ 
                  position: 'absolute', 
                  right: '15px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  pointerEvents: 'none',
                  color: 'var(--color-on-surface-variant)',
                  fontSize: '12px'
                }}>
                  ▼
                </div>
              </div>
            </div>

            {/* City / Region */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="city">City / Region</label>
              <input
                id="city"
                className="input-field"
                placeholder="e.g. Mumbai, Maharashtra"
                value={form.city}
                onChange={set('city')}
              />
            </div>

            {/* Website */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="website">Website URL</label>
              <input
                id="website"
                type="url"
                className="input-field"
                placeholder="https://your-institute.com"
                value={form.website}
                onChange={set('website')}
              />
            </div>
          </div>
        </div>

        {/* ── Section 2: Verified Contact ────────────────── */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            📬 Verified Contact
          </h2>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
              {emailOtp.verified && <span style={{ marginLeft: '8px' }}><VerifiedBadge /></span>}
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="admin@institute.com"
                value={form.email}
                onChange={set('email')}
                style={{ flex: 1 }}
                disabled={emailOtp.verified}
              />
              {!emailOtp.verified && (
                <OtpButton
                  id="email-otp-btn"
                  sent={emailOtp.sent}
                  loading={emailOtp.loading}
                  onSend={() => handleSendOtp('email')}
                  onVerify={(code) => handleVerifyOtp('email', code)}
                />
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="phone">
              Phone Number
              {phoneOtp.verified && <span style={{ marginLeft: '8px' }}><VerifiedBadge /></span>}
            </label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <input
                id="phone"
                type="tel"
                className="input-field"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={set('phone')}
                style={{ flex: 1 }}
                disabled={phoneOtp.verified}
              />
              {!phoneOtp.verified && (
                <OtpButton
                  id="phone-otp-btn"
                  sent={phoneOtp.sent}
                  loading={phoneOtp.loading}
                  onSend={() => handleSendOtp('phone')}
                  onVerify={(code) => handleVerifyOtp('phone', code)}
                />
              )}
            </div>
          </div>
        </div>

        {/* ── Section 3: Social Links ────────────────────── */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '17px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🔗 Social Links
            <span className="badge badge-neutral" style={{ fontSize: '11px' }}>Optional</span>
          </h2>
          <p className="text-muted" style={{ fontSize: '13px', marginBottom: '24px' }}>
            Help the AI agent direct leads to your social presence.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="linkedin">LinkedIn</label>
              <input
                id="linkedin"
                type="url"
                className="input-field"
                placeholder="https://linkedin.com/company/…"
                value={form.linkedin}
                onChange={set('linkedin')}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="instagram">Instagram</label>
              <input
                id="instagram"
                type="url"
                className="input-field"
                placeholder="https://instagram.com/…"
                value={form.instagram}
                onChange={set('instagram')}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="facebook">Facebook</label>
              <input
                id="facebook"
                type="url"
                className="input-field"
                placeholder="https://facebook.com/…"
                value={form.facebook}
                onChange={set('facebook')}
              />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" htmlFor="twitter">X / Twitter</label>
              <input
                id="twitter"
                type="url"
                className="input-field"
                placeholder="https://x.com/…"
                value={form.twitter}
                onChange={set('twitter')}
              />
            </div>
          </div>
        </div>

        {/* ── Save CTA ───────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
          <button
            id="save-account-details"
            type="submit"
            className="btn-primary"
            style={{ padding: '14px 32px', fontSize: '15px' }}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save account details →'}
          </button>
        </div>

      </form>
    </div>
  );
}


