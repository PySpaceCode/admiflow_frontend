"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function MetricCard({ title, value, icon, color }) {
  // Map to new Calm Intelligence CSS tokens
  const colorMap = {
    indigo: 'var(--color-primary)',
    sky: 'var(--color-tertiary)',
    emerald: 'var(--color-success)',
    amber: 'var(--color-warning)'
  };
  
  const bgMap = {
    indigo: 'rgba(79, 70, 229, 0.1)',
    sky: 'rgba(14, 165, 233, 0.1)',
    emerald: 'rgba(16, 185, 129, 0.1)',
    amber: 'rgba(245, 158, 11, 0.1)'
  };
  
  const accentColor = colorMap[color] || 'var(--color-on-surface)';
  const bgColor = bgMap[color] || 'var(--color-surface-high)';

  return (
    <div className="card interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div className="text-xs" style={{ color: 'var(--color-on-surface-variant)', fontWeight: '600' }}>
          {title}
        </div>
        {icon && (
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bgColor, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
      </div>
      <div className="data-text" style={{ color: 'var(--color-on-surface)' }}>
        {value}
      </div>
    </div>
  );
}


