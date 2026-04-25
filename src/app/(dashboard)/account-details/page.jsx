"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { showToast } from '@/lib/toast';

// ── Reusable input field ─────────────────────────────────
function Field({ label, id, type = 'text', value, onChange, error, placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      <label htmlFor={id} style={{
        fontSize: '11px',
        fontWeight: '600',
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          padding: '12px 14px',
          borderRadius: '8px',
          border: error ? '1px solid #ef4444' : 'none',
          fontSize: '14px',
          outline: 'none',
          background: 'var(--color-surface-high, #f3f4f6)',
          color: 'var(--color-on-surface, #111)',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {error && (
        <span style={{ fontSize: '12px', color: '#ef4444' }}>{error}</span>
      )}
    </div>
  );
}

export default function AccountDetails() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    instituteName: '',
    registrationId: '',
    officialEmail: '',
    phoneNumber: '',
    websiteUrl: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    contactPerson: '',
    contactRole: '',
    logo: null
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!formData.instituteName.trim()) e.instituteName = 'Institute Name is required';
    if (!formData.officialEmail) e.officialEmail = 'Official Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.officialEmail)) e.officialEmail = 'Enter a valid email';
    if (!formData.phoneNumber) e.phoneNumber = 'Phone Number is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) e.phoneNumber = 'Enter a valid phone number';
    if (!formData.contactPerson.trim()) e.contactPerson = 'Contact Person is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast('Please fix the errors in the form', 'error');
      return;
    }
    
    // Immediately redirect to main Dashboard upon successful completion
    showToast('Institute Identity saved successfully!', 'success');
    router.push('/dashboard');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '60px' }}>
      <h1 className="text-heading" style={{ marginBottom: '8px' }}>Account Details</h1>
      <p className="text-muted" style={{ marginBottom: '32px' }}>Set up your Institute Identity</p>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px' }}>
          Institute Identity
        </h2>

        {/* Logo Upload - Visual only mock */}
        <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--color-surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-on-surface-variant)', fontSize: '24px' }}>
            {formData.logo ? 'IMG' : '📸'}
          </div>
          <div>
            <label className="btn-outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
              Upload Logo
              <input type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => handleChange('logo', e.target.files[0])} />
            </label>
            <p className="text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>Recommended size: 256x256px. PNG, JPG or SVG.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <Field label="Institute Name" id="instituteName" value={formData.instituteName} onChange={e => handleChange('instituteName', e.target.value)} error={errors.instituteName} required={true} placeholder="e.g. Stanford University" />
          <Field label="Registration ID" id="registrationId" value={formData.registrationId} onChange={e => handleChange('registrationId', e.target.value)} placeholder="e.g. REG-12345" />
          <Field label="Official Email" id="officialEmail" type="email" value={formData.officialEmail} onChange={e => handleChange('officialEmail', e.target.value)} error={errors.officialEmail} required={true} placeholder="admin@institute.edu" />
          <Field label="Phone Number" id="phoneNumber" type="tel" value={formData.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} error={errors.phoneNumber} required={true} placeholder="+1 (555) 000-0000" />
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Website URL" id="websiteUrl" value={formData.websiteUrl} onChange={e => handleChange('websiteUrl', e.target.value)} placeholder="https://www.institute.edu" />
          </div>
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '32px', marginBottom: '24px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px' }}>
          Location
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Street Address" id="street" value={formData.street} onChange={e => handleChange('street', e.target.value)} placeholder="123 Education Lane" />
          </div>
          <Field label="City" id="city" value={formData.city} onChange={e => handleChange('city', e.target.value)} placeholder="City" />
          <Field label="State / Province" id="state" value={formData.state} onChange={e => handleChange('state', e.target.value)} placeholder="State" />
          <Field label="Zip / Postal Code" id="zip" value={formData.zip} onChange={e => handleChange('zip', e.target.value)} placeholder="12345" />
          <Field label="Country" id="country" value={formData.country} onChange={e => handleChange('country', e.target.value)} placeholder="Country" />
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '32px', marginBottom: '24px', borderBottom: '1px solid var(--color-surface-high)', paddingBottom: '12px' }}>
          Primary Contact
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
          <Field label="Contact Person" id="contactPerson" value={formData.contactPerson} onChange={e => handleChange('contactPerson', e.target.value)} error={errors.contactPerson} required={true} placeholder="Jane Doe" />
          <Field label="Contact Role" id="contactRole" value={formData.contactRole} onChange={e => handleChange('contactRole', e.target.value)} placeholder="e.g. Dean of Admissions" />
        </div>

        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
           <button type="submit" className="btn-primary">Save & Continue</button>
        </div>
      </form>
    </div>
  );
}



