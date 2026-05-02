"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, PhoneCall, CalendarCheck, TrendingUp, 
  Activity, PhoneOutgoing, Calendar as CalendarIcon, Cpu, ChevronRight 
} from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';

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
      // Mock data
      const statsData = { total_leads: 142, calls_made: 89, bookings: 12, conversion_rate: '8.4%' };
      const activityData = [
        { icon: PhoneOutgoing, action: 'Outbound call to John Doe completed', time: '10 mins ago', type: 'call' },
        { icon: CalendarCheck, action: 'Booking confirmed for Jane Smith', time: '2 hours ago', type: 'booking' },
        { icon: Cpu, action: 'AI Agent "Admissions Pro" updated', time: '5 hours ago', type: 'system' }
      ];
      const bookingsData = [
        { lead_name: 'Alice Johnson', course: 'Software Engineering', datetime: 'Tomorrow, 10:00 AM', status: 'Confirmed' },
        { lead_name: 'Bob Martin', course: 'Data Science', datetime: 'Tomorrow, 2:30 PM', status: 'Pending' }
      ];
      const chartRes = [
        { day: 'Mon', max: 20, connected: 15, failed: 5 },
        { day: 'Tue', max: 25, connected: 18, failed: 7 },
        { day: 'Wed', max: 30, connected: 22, failed: 8 },
        { day: 'Thu', max: 20, connected: 16, failed: 4 },
        { day: 'Fri', max: 35, connected: 30, failed: 5 },
        { day: 'Sat', max: 40, connected: 35, failed: 5 },
        { day: 'Sun', max: 45, connected: 42, failed: 3 }
      ];

      setStats(statsData);
      setActivity(activityData);
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
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="card skeleton" style={{ height: '120px' }}></div>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card skeleton" style={{ height: '300px' }}></div>
          <div className="card skeleton" style={{ height: '300px' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card interactive" style={{ borderLeft: '4px solid var(--color-danger)' }}>
        <h3 style={{ color: 'var(--color-danger)', marginBottom: '8px' }}>Error loading dashboard</h3>
        <p className="text-muted">{error}</p>
        <button className="btn-outline" style={{ marginTop: '16px' }} onClick={fetchData}>Retry Connection</button>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid var(--color-outline-variant)', paddingBottom: '16px', overflowX: 'auto' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
              borderRadius: '24px',
              fontWeight: activeTab === tab.id ? '500' : '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: activeTab === tab.id ? '0 2px 4px rgba(79,70,229,0.2)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Top row */}
      {(activeTab === 'overview' || activeTab === 'metrics') && (
        <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '24px' }}>
          <MetricCard title="Total Leads" value={stats?.total_leads} icon={<Users size={24} />} color="indigo" />
          <MetricCard title="Calls Made" value={stats?.calls_made} icon={<PhoneCall size={24} />} color="sky" />
          <MetricCard title="Bookings Confirmed" value={stats?.bookings} icon={<CalendarCheck size={24} />} color="emerald" />
          <MetricCard title="Conversion Rate" value={stats?.conversion_rate} icon={<TrendingUp size={24} />} color="amber" />
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Activity Feed */}
        {(activeTab === 'overview' || activeTab === 'activity') && (
          <motion.div variants={itemVariants} className="card interactive" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={20} className="text-muted" /> Recent Activity
              </h3>
              <button className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center' }}>View all <ChevronRight size={16} /></button>
            </div>
            
            {activity.length === 0 ? (
              <p className="text-muted">No recent activity.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activity.map((item, idx) => {
                  const Icon = item.icon;
                  const iconBg = item.type === 'call' ? 'rgba(56, 189, 248, 0.1)' : item.type === 'booking' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(99, 102, 241, 0.1)';
                  const iconColor = item.type === 'call' ? 'var(--color-tertiary)' : item.type === 'booking' ? 'var(--color-success)' : 'var(--color-primary)';
                  
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{item.action}</div>
                        <div className="text-muted" style={{ fontSize: '13px', marginTop: '2px' }}>{item.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Bookings Panel */}
        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <motion.div variants={itemVariants} className="card interactive" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarIcon size={20} className="text-muted" /> Upcoming Bookings
              </h3>
              <button className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center' }}>Schedule <ChevronRight size={16} /></button>
            </div>

            {bookings.length === 0 ? (
              <p className="text-muted">No upcoming bookings.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map((b, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--color-surface-base)', borderRadius: '12px', border: '1px solid var(--color-outline-variant)' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '15px' }}>{b.lead_name}</div>
                      <div className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>{b.course} • {b.datetime}</div>
                    </div>
                    <span className={`badge badge-${b.status === 'Confirmed' ? 'success' : b.status === 'Pending' ? 'warning' : 'danger'}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom section — Chart Placeholder */}
      {(activeTab === 'overview' || activeTab === 'chart') && (
        <motion.div variants={itemVariants} className="card interactive">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <h3 className="text-lg">Call Success Trends (Last 7 Days)</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }}></div> Connected</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-highest)' }}></div> Failed</div>
            </div>
          </div>
          
          <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid var(--color-outline-variant)' }}>
            {chartData.length === 0 ? (
              <p className="text-muted" style={{ alignSelf: 'center', margin: '0 auto' }}>Not enough data to display chart.</p>
            ) : (
              chartData.map((day, dIdx) => (
                <div key={dIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', height: '100%', flex: 1, justifyContent: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '6px', height: '100%', alignItems: 'flex-end', width: '100%', justifyContent: 'center' }}>
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(day.connected / day.max) * 100}%` }} 
                      transition={{ duration: 0.8, delay: dIdx * 0.1, type: 'spring' }}
                      style={{ width: '28px', background: 'var(--color-primary)', borderRadius: '6px 6px 0 0', maxWidth: '32px' }} 
                      title={`Connected: ${day.connected}`}
                    />
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${(day.failed / day.max) * 100}%` }} 
                      transition={{ duration: 0.8, delay: dIdx * 0.1 + 0.2, type: 'spring' }}
                      style={{ width: '28px', background: 'var(--color-surface-highest)', borderRadius: '6px 6px 0 0', maxWidth: '32px' }} 
                      title={`Failed: ${day.failed}`}
                    />
                  </div>
                  <div className="text-xs text-muted">{day.day}</div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}


