"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, PhoneCall, CalendarCheck, TrendingUp, 
  Activity, PhoneOutgoing, Calendar as CalendarIcon, ChevronRight,
  BarChart2, RefreshCw, Zap
} from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics', label: 'Metrics' },
    { id: 'chart', label: 'Performance' },
    { id: 'activity', label: 'Activity' },
    { id: 'bookings', label: 'Bookings' }
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dashboard/stats');
      
      // Handle both wrapped { success, data: { stats, activity, ... } }
      // and flat { stats, activity, ... } responses
      let payload = response;
      if (response && response.success !== undefined) {
        if (!response.success) {
          throw new Error(response.message || 'Failed to load dashboard stats');
        }
        payload = response.data || response;
      }

      // Safely extract each field with fallbacks
      const statsData   = payload?.stats      ?? payload ?? null;
      const activityData = Array.isArray(payload?.activity)  ? payload.activity  : [];
      const bookingsData = Array.isArray(payload?.bookings)  ? payload.bookings  : [];
      const chartRes     = Array.isArray(payload?.chartData) ? payload.chartData
                         : Array.isArray(payload?.chart_data) ? payload.chart_data : [];

      setStats(statsData);

      // Map activity items — add icon component + formatted time
      const mappedActivity = activityData.map(item => ({
        ...item,
        icon: item.type === 'call' ? PhoneOutgoing : CalendarCheck,
        timeFormatted: (() => {
          const d = new Date(item.time || item.created_at || Date.now());
          const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isToday = d.toDateString() === new Date().toDateString();
          return isToday ? timeStr : `${timeStr} · ${d.toLocaleDateString()}`;
        })()
      }));
      setActivity(mappedActivity);
      setBookings(bookingsData);
      setChartData(chartRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show:  { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } }
  };

  /* ── Loading skeleton ─────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card skeleton" style={{ height: '110px', borderRadius: '16px' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card skeleton" style={{ height: '280px', borderRadius: '16px' }} />
          <div className="card skeleton" style={{ height: '280px', borderRadius: '16px' }} />
        </div>
        <div className="card skeleton" style={{ height: '220px', borderRadius: '16px' }} />
      </div>
    );
  }

  /* ── Error state ──────────────────────────────────────── */
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ borderLeft: '4px solid var(--color-danger)', padding: '32px', textAlign: 'center' }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '8px', fontSize: '18px' }}>
          Error loading dashboard
        </h3>
        <p className="text-muted" style={{ marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
          {error}
        </p>
        <button
          className="btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          onClick={fetchData}
        >
          <RefreshCw size={16} /> Retry
        </button>
      </motion.div>
    );
  }

  /* ── Helpers ──────────────────────────────────────────── */
  // Resolve stats — backend may return flat keys or nested
  const totalLeads      = stats?.total_leads      ?? stats?.totalLeads      ?? 0;
  const callsMade       = stats?.calls_made       ?? stats?.callsMade       ?? 0;
  const bookingsCount   = stats?.bookings         ?? stats?.bookings_count  ?? stats?.bookingsCount  ?? 0;
  const conversionRate  = stats?.conversion_rate  ?? stats?.conversionRate  ?? '—';

  /* ── Empty-state helper ───────────────────────────────── */
  const EmptyState = ({ icon: Icon, label }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '12px', padding: '40px 20px', color: 'var(--color-on-surface-variant)'
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '16px',
        background: 'var(--color-surface-high)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{label}</p>
    </div>
  );

  /* ── Main render ──────────────────────────────────────── */
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">

      {/* ── Tab bar ── */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex', gap: '4px', marginBottom: '28px',
          borderBottom: '1px solid var(--color-outline-variant)',
          paddingBottom: '16px', overflowX: 'auto'
        }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', border: 'none', borderRadius: '24px',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(79,70,229,0.25)' : 'none',
              fontSize: '14px'
            }}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={fetchData}
          title="Refresh dashboard data"
          style={{
            marginLeft: 'auto', padding: '8px 12px', border: '1px solid var(--color-outline-variant)',
            borderRadius: '24px', background: 'transparent', cursor: 'pointer',
            color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: '500', transition: 'all 0.2s'
          }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </motion.div>

      {/* ── Metric cards ── */}
      {(activeTab === 'overview' || activeTab === 'metrics') && (
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px', marginBottom: '24px'
          }}
        >
          <MetricCard title="Total Leads"        value={totalLeads}     icon={<Users size={22}/>}        color="indigo"  />
          <MetricCard title="Calls Made"          value={callsMade}      icon={<PhoneCall size={22}/>}    color="sky"     />
          <MetricCard title="Bookings Confirmed"  value={bookingsCount}  icon={<CalendarCheck size={22}/>} color="emerald" />
          <MetricCard
            title="Conversion Rate"
            value={typeof conversionRate === 'number' ? `${conversionRate}%` : conversionRate}
            icon={<TrendingUp size={22}/>}
            color="amber"
          />
        </motion.div>
      )}

      {/* ── Activity + Bookings row ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '20px', marginBottom: '24px'
      }}>

        {/* Activity feed */}
        {(activeTab === 'overview' || activeTab === 'activity') && (
          <motion.div
            variants={itemVariants}
            className="card interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Activity size={18} className="text-muted" /> Recent Activity
              </h3>
              <button className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                View all <ChevronRight size={15} />
              </button>
            </div>

            {activity.length === 0 ? (
              <EmptyState icon={Activity} label="No recent activity yet" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {activity.slice(0, 6).map((item, idx) => {
                  const Icon = item.icon;
                  const iconBg    = item.type === 'call' ? 'rgba(56,189,248,0.1)' : item.type === 'booking' ? 'rgba(52,211,153,0.1)' : 'rgba(99,102,241,0.1)';
                  const iconColor = item.type === 'call' ? 'var(--color-tertiary)' : item.type === 'booking' ? 'var(--color-success)' : 'var(--color-primary)';
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: iconBg, color: iconColor,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>
                          {item.action || item.description || item.message || 'Activity'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>
                          {item.timeFormatted}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Upcoming Bookings */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <motion.div
            variants={itemVariants}
            className="card interactive"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <CalendarIcon size={18} className="text-muted" /> Upcoming Bookings
              </h3>
              <button className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                Schedule <ChevronRight size={15} />
              </button>
            </div>

            {bookings.length === 0 ? (
              <EmptyState icon={CalendarIcon} label="No upcoming bookings" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.slice(0, 5).map((b, idx) => {
                  const statusColor = b.status === 'Confirmed' || b.status === 'confirmed'
                    ? 'success' : b.status === 'Pending' || b.status === 'pending' ? 'warning' : 'danger';
                  return (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px',
                      background: 'var(--color-surface-lowest, var(--color-surface-base))',
                      borderRadius: '12px', border: '1px solid var(--color-outline-variant)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                          {b.lead_name || b.leadName || b.name || 'Lead'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>
                          {b.course || b.subject || ''}{(b.course || b.subject) && ' · '}
                          {b.datetime || b.scheduled_at || b.date || ''}
                        </div>
                      </div>
                      <span className={`badge badge-${statusColor}`}>
                        {b.status || 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* ── Performance chart ── */}
      {(activeTab === 'overview' || activeTab === 'chart') && (
        <motion.div variants={itemVariants} className="card interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <BarChart2 size={18} className="text-muted" /> Call Success Trends (Last 7 Days)
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} /> Connected
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-highest)' }} /> Failed
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div style={{
              height: '200px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '12px',
              color: 'var(--color-on-surface-variant)'
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px',
                background: 'var(--color-surface-high)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <BarChart2 size={28} strokeWidth={1.5} />
              </div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
                Not enough call data to display chart yet
              </p>
              <p className="text-muted" style={{ margin: 0, fontSize: '13px' }}>
                Data will appear once calls are initiated
              </p>
            </div>
          ) : (
            <div style={{
              height: '200px', display: 'flex', alignItems: 'flex-end',
              gap: '16px', paddingBottom: '20px',
              borderBottom: '1px solid var(--color-outline-variant)'
            }}>
              {chartData.map((day, dIdx) => {
                const maxVal = day.max || Math.max(day.connected || 0, day.failed || 0, 1);
                return (
                  <div key={dIdx} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '8px',
                    height: '100%', flex: 1, justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      display: 'flex', gap: '4px', height: '100%',
                      alignItems: 'flex-end', width: '100%', justifyContent: 'center'
                    }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(((day.connected || 0) / maxVal) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: dIdx * 0.08, type: 'spring' }}
                        style={{
                          width: '24px', background: 'var(--color-primary)',
                          borderRadius: '5px 5px 0 0', minHeight: '2px'
                        }}
                        title={`Connected: ${day.connected}`}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(((day.failed || 0) / maxVal) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: dIdx * 0.08 + 0.15, type: 'spring' }}
                        style={{
                          width: '24px', background: 'var(--color-surface-highest)',
                          borderRadius: '5px 5px 0 0', minHeight: '2px'
                        }}
                        title={`Failed: ${day.failed}`}
                      />
                    </div>
                    <div className="text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>
                      {day.day || day.date || `D${dIdx + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ── Quick actions (overview only) ── */}
      {activeTab === 'overview' && (
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex', gap: '12px', marginTop: '8px',
            flexWrap: 'wrap'
          }}
        >
          {[
            { label: 'Upload Leads', href: '/leads', emoji: '📤' },
            { label: 'Knowledge Base', href: '/knowledge-base', emoji: '🧠' },
            { label: 'View Bookings', href: '/bookings', emoji: '📅' },
            { label: 'Conversations', href: '/conversations', emoji: '💬' },
          ].map(action => (
            <a
              key={action.href}
              href={action.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '24px',
                border: '1px solid var(--color-outline-variant)',
                background: 'var(--color-surface-lowest, transparent)',
                color: 'var(--color-on-surface-variant)',
                textDecoration: 'none', fontSize: '13px', fontWeight: '500',
                transition: 'all 0.2s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--color-primary-container)';
                e.currentTarget.style.color = 'var(--color-on-primary)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'var(--color-surface-lowest, transparent)';
                e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                e.currentTarget.style.borderColor = 'var(--color-outline-variant)';
              }}
            >
              <span>{action.emoji}</span> {action.label}
            </a>
          ))}
        </motion.div>
      )}

    </motion.div>
  );
}
