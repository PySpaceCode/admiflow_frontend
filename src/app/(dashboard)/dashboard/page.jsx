"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, PhoneCall, CalendarCheck, TrendingUp, 
  Activity, PhoneOutgoing, Calendar as CalendarIcon, ChevronRight,
  BarChart2, RefreshCw, Zap, WifiOff, Clock
} from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import { api } from '@/lib/api';

const COLD_START_TIMEOUT = 60; // seconds to wait for Render to wake up

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Cold-start retry state
  const [isWakingUp, setIsWakingUp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const retryTimerRef = useRef(null);
  const countdownRef = useRef(null);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'metrics',  label: 'Metrics' },
    { id: 'chart',    label: 'Performance' },
    { id: 'activity', label: 'Activity' },
    { id: 'bookings', label: 'Bookings' }
  ];

  const clearTimers = () => {
    if (retryTimerRef.current)  clearTimeout(retryTimerRef.current);
    if (countdownRef.current)   clearInterval(countdownRef.current);
  };

  const startColdStartRetry = () => {
    clearTimers();
    setIsWakingUp(true);
    setCountdown(COLD_START_TIMEOUT);

    // Countdown ticker
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);

    // Auto-retry after COLD_START_TIMEOUT seconds
    retryTimerRef.current = setTimeout(() => {
      setIsWakingUp(false);
      fetchData();
    }, COLD_START_TIMEOUT * 1000);
  };

  const fetchData = async () => {
    clearTimers();
    setIsWakingUp(false);
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/dashboard/stats');

      // Handle both wrapped { success, data } and flat responses
      let payload = response;
      if (response && response.success !== undefined) {
        if (!response.success) throw new Error(response.message || 'Failed to load stats');
        payload = response.data ?? response;
      }

      const statsData    = payload?.stats      ?? payload ?? null;
      const activityData = Array.isArray(payload?.activity)   ? payload.activity   : [];
      const bookingsData = Array.isArray(payload?.bookings)   ? payload.bookings   : [];
      const chartRes     = Array.isArray(payload?.chartData)  ? payload.chartData
                         : Array.isArray(payload?.chart_data) ? payload.chart_data : [];

      setStats(statsData);
      setActivity(activityData.map(item => ({
        ...item,
        icon: item.type === 'call' ? PhoneOutgoing : CalendarCheck,
        timeFormatted: (() => {
          const d = new Date(item.time || item.created_at || Date.now());
          const isToday = d.toDateString() === new Date().toDateString();
          return isToday
            ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : `${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · ${d.toLocaleDateString()}`;
        })()
      })));
      setBookings(bookingsData);
      setChartData(chartRes);
    } catch (err) {
      const msg = err.message || '';
      const isNetworkError = msg.toLowerCase().includes('cannot reach') || msg.toLowerCase().includes('failed to fetch');
      setError(msg);
      if (isNetworkError) startColdStartRetry();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    return () => clearTimers();
  }, []);

  /* ── Framer variants ─────────────────────────────────────── */
  const containerVariants = {
    hidden: { opacity: 0 },
    show:   { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
  };

  /* ── Loading skeleton ──────────────────────────────────────── */
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card skeleton" style={{ height: '110px', borderRadius: '16px' }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card skeleton" style={{ height: '260px', borderRadius: '16px' }} />
          <div className="card skeleton" style={{ height: '260px', borderRadius: '16px' }} />
        </div>
        <div className="card skeleton" style={{ height: '200px', borderRadius: '16px' }} />
      </div>
    );
  }

  /* ── Error / Cold-start state ─────────────────────────────── */
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ padding: '48px 32px', textAlign: 'center', borderLeft: isWakingUp ? '4px solid var(--color-warning)' : '4px solid var(--color-danger)' }}
      >
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>
          {isWakingUp ? '⏳' : '⚠️'}
        </div>

        {isWakingUp ? (
          <>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-on-surface)' }}>
              Backend Waking Up…
            </h3>
            <p className="text-muted" style={{ marginBottom: '24px', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              The server is on a free plan and spins down after inactivity. It will be ready in about{' '}
              <strong style={{ color: 'var(--color-warning)' }}>{countdown}s</strong>. Retrying automatically…
            </p>

            {/* Progress bar */}
            <div style={{
              width: '100%', maxWidth: '320px', margin: '0 auto 28px',
              height: '6px', borderRadius: '3px', background: 'var(--color-outline-variant)', overflow: 'hidden'
            }}>
              <motion.div
                animate={{ width: `${((COLD_START_TIMEOUT - countdown) / COLD_START_TIMEOUT) * 100}%` }}
                transition={{ duration: 1, ease: 'linear' }}
                style={{ height: '100%', background: 'var(--color-warning)', borderRadius: '3px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={fetchData}
              >
                <RefreshCw size={15} /> Try Now
              </button>
              <button
                className="btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                onClick={() => { clearTimers(); setIsWakingUp(false); setError(null); }}
              >
                Dismiss
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-danger)' }}>
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
              <RefreshCw size={15} /> Retry
            </button>
          </>
        )}
      </motion.div>
    );
  }

  /* ── Resolved stats ─────────────────────────────────────── */
  const totalLeads     = stats?.total_leads     ?? stats?.totalLeads     ?? 0;
  const callsMade      = stats?.calls_made      ?? stats?.callsMade      ?? 0;
  const bookingsCount  = stats?.bookings        ?? stats?.bookings_count ?? stats?.bookingsCount ?? 0;
  const conversionRate = stats?.conversion_rate ?? stats?.conversionRate ?? '—';

  /* ── Empty-state helper ─────────────────────────────────── */
  const EmptyState = ({ icon: Icon, label }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '10px', padding: '32px 20px', color: 'var(--color-on-surface-variant)'
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '14px',
        background: 'var(--color-surface-high)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>{label}</p>
    </div>
  );

  /* ── Main render ────────────────────────────────────────── */
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">

      {/* Tab bar */}
      <motion.div variants={itemVariants} style={{
        display: 'flex', gap: '4px', marginBottom: '28px',
        borderBottom: '1px solid var(--color-outline-variant)',
        paddingBottom: '16px', overflowX: 'auto', alignItems: 'center'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 18px', border: 'none', borderRadius: '24px',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              fontWeight: '500', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s ease', fontSize: '14px',
              boxShadow: activeTab === tab.id ? '0 2px 8px rgba(79,70,229,0.25)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={fetchData}
          title="Refresh"
          style={{
            marginLeft: 'auto', padding: '8px 14px', border: '1px solid var(--color-outline-variant)',
            borderRadius: '24px', background: 'transparent', cursor: 'pointer',
            color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap'
          }}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </motion.div>

      {/* Metric cards */}
      {(activeTab === 'overview' || activeTab === 'metrics') && (
        <motion.div variants={itemVariants} style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px', marginBottom: '24px'
        }}>
          <MetricCard title="Total Leads"       value={totalLeads}    icon={<Users size={22}/>}         color="indigo" />
          <MetricCard title="Calls Made"         value={callsMade}     icon={<PhoneCall size={22}/>}     color="sky"    />
          <MetricCard title="Bookings"           value={bookingsCount} icon={<CalendarCheck size={22}/>} color="emerald"/>
          <MetricCard
            title="Conversion Rate"
            value={typeof conversionRate === 'number' ? `${conversionRate}%` : conversionRate}
            icon={<TrendingUp size={22}/>}
            color="amber"
          />
        </motion.div>
      )}

      {/* Activity + Bookings row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px', marginBottom: '24px'
      }}>

        {(activeTab === 'overview' || activeTab === 'activity') && (
          <motion.div variants={itemVariants} className="card interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <Activity size={17} className="text-muted" /> Recent Activity
              </h3>
              <button className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                View all <ChevronRight size={14} />
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
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={17} />
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

        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <motion.div variants={itemVariants} className="card interactive" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                <CalendarIcon size={17} className="text-muted" /> Upcoming Bookings
              </h3>
              <button className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                Schedule <ChevronRight size={14} />
              </button>
            </div>
            {bookings.length === 0 ? (
              <EmptyState icon={CalendarIcon} label="No upcoming bookings" />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {bookings.slice(0, 5).map((b, idx) => {
                  const statusColor = (b.status || '').toLowerCase() === 'confirmed' ? 'success'
                    : (b.status || '').toLowerCase() === 'pending' ? 'warning' : 'danger';
                  return (
                    <div key={idx} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '12px 14px', borderRadius: '12px',
                      background: 'var(--color-surface-base, var(--color-surface-high))',
                      border: '1px solid var(--color-outline-variant)'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>
                          {b.lead_name || b.leadName || b.name || 'Lead'}
                        </div>
                        <div className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>
                          {b.course || ''}{b.course && ' · '}
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

      {/* Performance chart */}
      {(activeTab === 'overview' || activeTab === 'chart') && (
        <motion.div variants={itemVariants} className="card interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <BarChart2 size={17} className="text-muted" /> Call Success Trends (Last 7 Days)
            </h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} /> Connected
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-highest)' }} /> Failed
              </div>
            </div>
          </div>

          {chartData.length === 0 ? (
            <div style={{ height: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--color-on-surface-variant)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--color-surface-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={24} strokeWidth={1.5} />
              </div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>No call data yet</p>
              <p className="text-muted" style={{ margin: 0, fontSize: '12px' }}>Data appears once calls are initiated</p>
            </div>
          ) : (
            <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid var(--color-outline-variant)' }}>
              {chartData.map((day, dIdx) => {
                const maxVal = day.max || Math.max(day.connected || 0, day.failed || 0, 1);
                return (
                  <div key={dIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', flex: 1, justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '4px', height: '100%', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(((day.connected || 0) / maxVal) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: dIdx * 0.08, type: 'spring' }}
                        style={{ width: '22px', background: 'var(--color-primary)', borderRadius: '4px 4px 0 0', minHeight: '2px' }}
                        title={`Connected: ${day.connected}`}
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(((day.failed || 0) / maxVal) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: dIdx * 0.08 + 0.15, type: 'spring' }}
                        style={{ width: '22px', background: 'var(--color-surface-highest)', borderRadius: '4px 4px 0 0', minHeight: '2px' }}
                        title={`Failed: ${day.failed}`}
                      />
                    </div>
                    <div className="text-xs text-muted" style={{ whiteSpace: 'nowrap', fontSize: '11px' }}>
                      {day.day || day.date || `D${dIdx + 1}`}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* Quick actions */}
      {activeTab === 'overview' && (
        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '10px', marginTop: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'Upload Leads',    href: '/leads',         emoji: '📤' },
            { label: 'Knowledge Base',  href: '/knowledge-base', emoji: '🧠' },
            { label: 'View Bookings',   href: '/bookings',       emoji: '📅' },
            { label: 'Conversations',   href: '/conversations',  emoji: '💬' },
          ].map(action => (
            <a
              key={action.href}
              href={action.href}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '9px 16px', borderRadius: '24px',
                border: '1px solid var(--color-outline-variant)',
                background: 'transparent',
                color: 'var(--color-on-surface-variant)',
                textDecoration: 'none', fontSize: '13px', fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = 'var(--color-primary-container)';
                e.currentTarget.style.color = 'var(--color-on-primary)';
                e.currentTarget.style.borderColor = 'var(--color-primary)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'transparent';
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
