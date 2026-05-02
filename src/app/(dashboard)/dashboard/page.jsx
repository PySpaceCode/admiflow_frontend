"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, PhoneCall, CalendarCheck, TrendingUp,
  Activity, PhoneOutgoing, Calendar as CalendarIcon, ChevronRight,
  BarChart2, RefreshCw
} from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [data, setData]       = useState(null);   // raw API payload
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview',  label: 'Overview'  },
    { id: 'metrics',   label: 'Metrics'   },
    { id: 'chart',     label: 'Performance'},
    { id: 'activity',  label: 'Activity'  },
    { id: 'bookings',  label: 'Bookings'  },
  ];

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/dashboard/stats');
      // Accept both { success, data: {...} } and flat {...}
      const payload = (res?.success && res?.data) ? res.data : res;
      setData(payload || {});
    } catch (err) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const iv = {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
  };
  const cv = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };

  /* ── Loading ─── */
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
        {[1,2,3,4].map(i => <div key={i} className="card skeleton" style={{ height: '100px' }} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card skeleton" style={{ height: '240px' }} />
        <div className="card skeleton" style={{ height: '240px' }} />
      </div>
      <div className="card skeleton" style={{ height: '180px' }} />
    </div>
  );

  /* ── Error ─── */
  if (error) {
    const isNetwork = error.toLowerCase().includes('cannot reach') || error.toLowerCase().includes('failed to fetch');
    return (
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="card" style={{ padding:'48px 32px', textAlign:'center',
          borderLeft: `4px solid ${isNetwork ? 'var(--color-warning)' : 'var(--color-danger)'}` }}>
        <div style={{ fontSize:'52px', marginBottom:'12px' }}>{isNetwork ? '⏳' : '⚠️'}</div>
        <h3 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'8px',
          color: isNetwork ? 'var(--color-warning)' : 'var(--color-danger)' }}>
          {isNetwork ? 'Backend is starting up…' : 'Error loading dashboard'}
        </h3>
        <p className="text-muted" style={{ maxWidth:'380px', margin:'0 auto 24px', lineHeight:1.6 }}>
          {isNetwork
            ? 'The server wakes up after inactivity (free plan). Click "Retry" in ~30 seconds.'
            : error}
        </p>
        <button className="btn-primary"
          style={{ display:'inline-flex', alignItems:'center', gap:'8px' }}
          disabled={retrying}
          onClick={() => { setRetrying(true); setTimeout(fetchData, 500); }}>
          <RefreshCw size={15} style={{ animation: retrying ? 'spin 1s linear infinite' : 'none' }} />
          {retrying ? 'Retrying…' : 'Retry'}
        </button>
      </motion.div>
    );
  }

  /* ── Resolved values with multi-key fallbacks ─── */
  const stats        = data?.stats ?? data ?? {};
  const activity     = Array.isArray(data?.activity)   ? data.activity   : [];
  const bookings     = Array.isArray(data?.bookings)   ? data.bookings   : [];
  const chartData    = Array.isArray(data?.chartData)  ? data.chartData
                     : Array.isArray(data?.chart_data) ? data.chart_data : [];

  const totalLeads   = stats?.total_leads     ?? stats?.totalLeads     ?? stats?.leads      ?? stats?.leads_count ?? 0;
  const callsMade    = stats?.calls_made      ?? stats?.callsMade      ?? stats?.calls      ?? stats?.calls_count ?? 0;
  const bookingCount = stats?.bookings        ?? stats?.bookings_count ?? stats?.total_bookings ?? stats?.totalBookings ?? 0;
  const cvRate       = stats?.conversion_rate ?? stats?.conversionRate ?? stats?.conversion ?? stats?.cv_rate ?? null;
  const cvDisplay    = cvRate == null ? '—'
    : typeof cvRate === 'number' ? `${cvRate.toFixed(1)}%` : cvRate;

  const EmptyRow = ({ icon: Icon, label }) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
      gap:'8px', padding:'28px', color:'var(--color-on-surface-variant)' }}>
      <Icon size={24} strokeWidth={1.5} />
      <p style={{ margin:0, fontSize:'13px' }}>{label}</p>
    </div>
  );

  return (
    <motion.div variants={cv} initial="hidden" animate="show">

      {/* Tab bar */}
      <motion.div variants={iv} style={{ display:'flex', gap:'4px', marginBottom:'24px',
        borderBottom:'1px solid var(--color-outline-variant)', paddingBottom:'14px',
        overflowX:'auto', alignItems:'center' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding:'7px 16px', border:'none', borderRadius:'24px', cursor:'pointer',
            whiteSpace:'nowrap', fontSize:'14px', fontWeight:'500', transition:'all .2s',
            background: activeTab===t.id ? 'var(--color-primary)' : 'transparent',
            color: activeTab===t.id ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
            boxShadow: activeTab===t.id ? '0 2px 8px rgba(79,70,229,.25)' : 'none',
          }}>{t.label}</button>
        ))}
        <button onClick={fetchData} style={{ marginLeft:'auto', padding:'7px 14px',
          border:'1px solid var(--color-outline-variant)', borderRadius:'24px',
          background:'transparent', cursor:'pointer', color:'var(--color-on-surface-variant)',
          display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:'500' }}>
          <RefreshCw size={13}/> Refresh
        </button>
      </motion.div>

      {/* Metric cards */}
      {(activeTab === 'overview' || activeTab === 'metrics') && (
        <motion.div variants={iv} style={{ display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))', gap:'16px', marginBottom:'20px' }}>
          <MetricCard title="Total Leads"       value={totalLeads}   icon={<Users size={22}/>}         color="indigo"/>
          <MetricCard title="Calls Made"         value={callsMade}    icon={<PhoneCall size={22}/>}     color="sky"   />
          <MetricCard title="Bookings"           value={bookingCount} icon={<CalendarCheck size={22}/>} color="emerald"/>
          <MetricCard title="Conversion Rate"    value={cvDisplay}    icon={<TrendingUp size={22}/>}    color="amber" />
        </motion.div>
      )}

      {/* Activity + Bookings */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',
        gap:'16px', marginBottom:'20px' }}>

        {(activeTab === 'overview' || activeTab === 'activity') && (
          <motion.div variants={iv} className="card interactive"
            style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ margin:0, fontSize:'15px', fontWeight:'600', display:'flex', alignItems:'center', gap:'7px' }}>
                <Activity size={16}/> Recent Activity
              </h3>
              <span className="text-muted" style={{ fontSize:'12px' }}>Last 24h</span>
            </div>
            {activity.length === 0
              ? <EmptyRow icon={Activity} label="No recent activity"/>
              : activity.slice(0,6).map((item, i) => {
                  const Icon = item.type==='call' ? PhoneOutgoing : CalendarCheck;
                  const bg   = item.type==='call' ? 'rgba(56,189,248,.1)' : item.type==='booking' ? 'rgba(52,211,153,.1)' : 'rgba(99,102,241,.1)';
                  const col  = item.type==='call' ? 'var(--color-tertiary)' : item.type==='booking' ? 'var(--color-success)' : 'var(--color-primary)';
                  const ts   = (() => { try { const d=new Date(item.time||item.created_at||0); return d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); } catch{return '';} })();
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                      <div style={{ width:'34px', height:'34px', borderRadius:'9px', background:bg,
                        color:col, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={16}/>
                      </div>
                      <div>
                        <div style={{ fontSize:'13px', fontWeight:'500' }}>
                          {item.action||item.description||item.message||'Activity'}
                        </div>
                        <div className="text-muted" style={{ fontSize:'11px', marginTop:'1px' }}>{ts}</div>
                      </div>
                    </div>
                  );
                })}
          </motion.div>
        )}

        {(activeTab === 'overview' || activeTab === 'bookings') && (
          <motion.div variants={iv} className="card interactive"
            style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <h3 style={{ margin:0, fontSize:'15px', fontWeight:'600', display:'flex', alignItems:'center', gap:'7px' }}>
                <CalendarIcon size={16}/> Upcoming Bookings
              </h3>
              <a href="/bookings" style={{ fontSize:'12px', color:'var(--color-primary)', textDecoration:'none' }}>
                View all <ChevronRight size={12} style={{ display:'inline' }}/>
              </a>
            </div>
            {bookings.length === 0
              ? <EmptyRow icon={CalendarIcon} label="No upcoming bookings"/>
              : bookings.slice(0,5).map((b,i) => {
                  const st  = (b.status||'pending').toLowerCase();
                  const col = st==='confirmed'?'success':st==='pending'?'warning':'danger';
                  return (
                    <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                      padding:'10px 12px', borderRadius:'10px',
                      background:'var(--color-surface-high)', border:'1px solid var(--color-outline-variant)' }}>
                      <div>
                        <div style={{ fontWeight:'600', fontSize:'13px' }}>
                          {b.lead_name||b.leadName||b.name||'Lead'}
                        </div>
                        <div className="text-muted" style={{ fontSize:'11px', marginTop:'2px' }}>
                          {b.course||''}{b.course?' · ':''}{b.datetime||b.scheduled_at||b.date||''}
                        </div>
                      </div>
                      <span className={`badge badge-${col}`}>{b.status||'Pending'}</span>
                    </div>
                  );
                })}
          </motion.div>
        )}
      </div>

      {/* Chart */}
      {(activeTab === 'overview' || activeTab === 'chart') && (
        <motion.div variants={iv} className="card interactive">
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
            <h3 style={{ margin:0, fontSize:'15px', fontWeight:'600', display:'flex', alignItems:'center', gap:'7px' }}>
              <BarChart2 size={16}/> Call Trends (Last 7 Days)
            </h3>
            <div style={{ display:'flex', gap:'14px' }}>
              {[['var(--color-primary)','Connected'],['var(--color-surface-highest)','Failed']].map(([c,l])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', color:'var(--color-on-surface-variant)' }}>
                  <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:c }}/> {l}
                </div>
              ))}
            </div>
          </div>
          {chartData.length === 0
            ? <div style={{ height:'140px', display:'flex', flexDirection:'column', alignItems:'center',
                justifyContent:'center', gap:'8px', color:'var(--color-on-surface-variant)' }}>
                <BarChart2 size={28} strokeWidth={1.5}/>
                <p style={{ margin:0, fontSize:'13px' }}>No call data yet — start calling to see trends</p>
              </div>
            : <div style={{ height:'160px', display:'flex', alignItems:'flex-end', gap:'10px',
                paddingBottom:'18px', borderBottom:'1px solid var(--color-outline-variant)' }}>
                {chartData.map((day,di) => {
                  const mx = Math.max(day.max||0, day.connected||0, day.failed||0, 1);
                  return (
                    <div key={di} style={{ flex:1, height:'100%', display:'flex', flexDirection:'column',
                      alignItems:'center', gap:'6px', justifyContent:'flex-end' }}>
                      <div style={{ display:'flex', gap:'3px', height:'100%', alignItems:'flex-end', width:'100%', justifyContent:'center' }}>
                        <motion.div initial={{height:0}} animate={{height:`${((day.connected||0)/mx)*100}%`}}
                          transition={{duration:.7,delay:di*.07,type:'spring'}}
                          style={{ width:'18px', background:'var(--color-primary)', borderRadius:'3px 3px 0 0', minHeight:'2px' }}/>
                        <motion.div initial={{height:0}} animate={{height:`${((day.failed||0)/mx)*100}%`}}
                          transition={{duration:.7,delay:di*.07+.12,type:'spring'}}
                          style={{ width:'18px', background:'var(--color-surface-highest)', borderRadius:'3px 3px 0 0', minHeight:'2px' }}/>
                      </div>
                      <div className="text-muted" style={{ fontSize:'10px', whiteSpace:'nowrap' }}>
                        {day.day||day.date||`D${di+1}`}
                      </div>
                    </div>
                  );
                })}
              </div>}
        </motion.div>
      )}

      {/* Quick links */}
      {activeTab === 'overview' && (
        <motion.div variants={iv} style={{ display:'flex', gap:'8px', marginTop:'8px', flexWrap:'wrap' }}>
          {[['📤','Upload Leads','/leads'],['🧠','Knowledge Base','/knowledge-base'],
            ['📅','Bookings','/bookings'],['💬','Conversations','/conversations']].map(([e,l,h])=>(
            <a key={h} href={h} style={{ display:'flex', alignItems:'center', gap:'7px',
              padding:'8px 14px', borderRadius:'24px', border:'1px solid var(--color-outline-variant)',
              background:'transparent', color:'var(--color-on-surface-variant)',
              textDecoration:'none', fontSize:'13px', fontWeight:'500', transition:'all .2s' }}
              onMouseOver={ev=>{ev.currentTarget.style.background='var(--color-primary-container)';ev.currentTarget.style.color='var(--color-on-primary)';ev.currentTarget.style.borderColor='var(--color-primary)';}}
              onMouseOut={ev=>{ev.currentTarget.style.background='transparent';ev.currentTarget.style.color='var(--color-on-surface-variant)';ev.currentTarget.style.borderColor='var(--color-outline-variant)';}}>
              <span>{e}</span> {l}
            </a>
          ))}
        </motion.div>
      )}

    </motion.div>
  );
}
