"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Rocket, LayoutDashboard, Users, PhoneCall, MessageSquare, 
  BookOpen, Calendar, Settings as SettingsIcon, Sun, Moon, 
  LogOut, Menu, Bell, Search, User as UserIcon, X,
  PanelLeftClose, PanelLeftOpen, MessageCircle
} from 'lucide-react';
import ToastContainer from '@/components/dashboard/ToastContainer';
import { showToast } from '@/lib/toast';

import './dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [instituteName, setInstituteName] = useState('Admission AI');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar with Ctrl + .
      if (e.ctrlKey && e.key === '.') {
        e.preventDefault();
        setIsCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Only toggle .dark on elements inside the dashboard layout
    // We handle the dark class scoping via CSS now
  }, [isDarkTheme]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    if (storedUser?.full_name) setInstituteName(storedUser.full_name);
  }, []);

  async function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showToast('Logged out successfully', 'success');
    router.push('/login'); // Assuming the auth route in Next.js is /login
  }

  const navGroups = [
    {
      title: 'Setup Flow',
      links: [{ to: '/onboarding', label: 'Onboarding', icon: Rocket }]
    },
    {
      title: 'Core',
      links: [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/leads', label: 'Leads', icon: Users },
        { to: '/calls', label: 'Calls', icon: PhoneCall },
        { to: '/conversations', label: 'Conversations', icon: MessageSquare },
        { to: '/whatsapp', label: 'WhatsApp', icon: MessageCircle },
      ]
    },
    {
      title: 'Management',
      links: [
        { to: '/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
        { to: '/bookings', label: 'Bookings', icon: Calendar },
      ]
    }
  ];

  const renderNav = (link: any) => {
    const Icon = link.icon;
    const isActive = pathname === link.to || pathname.startsWith(link.to + '/');
    
    return (
      <Link
        key={link.to}
        href={link.to}
        onClick={() => setIsMobileOpen(false)}
        title={isCollapsed ? link.label : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          transition: 'all 0.2s',
          marginBottom: '4px',
          textDecoration: 'none',
          ...(isActive 
            ? { 
                background: 'var(--color-primary-container)', 
                color: 'var(--color-on-primary)', 
                borderLeft: '4px solid var(--color-primary)',
                fontWeight: '600'
              }
            : { 
                color: 'var(--color-on-surface-variant)', 
                borderLeft: '4px solid transparent',
                fontWeight: '500'
              })
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '24px' }}>
          <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
        </div>
        <span className="nav-label" style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{link.label}</span>
      </Link>
    );
  };

  const currentPathName = pathname.split('/')[1] || 'dashboard';
  const pageTitle = currentPathName.charAt(0).toUpperCase() + currentPathName.slice(1).replace('-', ' ');

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : 'User';
  const initials = user?.full_name ? user.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <div className={`dashboard-layout ${isDarkTheme ? 'dark' : ''} app-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div
        className={`sidebar-overlay ${isMobileOpen ? 'open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`} style={{ overflow: 'hidden' }}>
        <div className="sidebar-header" style={{ padding: '0 16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="logo-container" style={{ fontWeight: '700', fontSize: '20px', color: 'var(--color-on-surface)', display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
            <div style={{ minWidth: '32px', height: '32px', borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <LayoutDashboard size={20} />
            </div>
            <span className="logo-text" style={{ whiteSpace: 'nowrap' }}>AdmitFlow</span>
          </div>
          
          <button 
            className="desktop-collapse-toggle"
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{ 
              display: isMobileOpen ? 'none' : 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              padding: '6px', 
              margin: 0, 
              border: '1px solid var(--color-outline-variant)', 
              background: 'transparent',
              borderRadius: '6px',
              color: 'var(--color-on-surface-variant)',
              cursor: 'pointer'
            }}
            title={isCollapsed ? "Open sidebar (Ctrl+.)" : "Close sidebar (Ctrl+.)"}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
          
          <button className="mobile-nav-toggle" style={{ display: isMobileOpen ? 'block' : 'none', padding: '4px', margin: 0, border: 'none', background: 'transparent' }} onClick={() => setIsMobileOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', padding: '0 12px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {navGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div className="nav-group-title" style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', padding: '0 16px 8px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                {group.title}
              </div>
              {group.links.map(renderNav)}
            </div>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--color-outline-variant)' }}>
          {renderNav({ to: '/settings', label: 'Settings', icon: SettingsIcon })}
          
          <button
            className="logout-btn"
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', 
              borderRadius: '12px', color: 'var(--color-danger)', fontWeight: '500', fontSize: '14px',
              transition: 'background 0.2s', marginTop: '8px', textDecoration: 'none',
              justifyContent: 'flex-start'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '24px' }}>
              <LogOut size={20} strokeWidth={1.5} />
            </div>
            <span className="nav-label" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>Logout</span>
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ 
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '0 32px', background: 'var(--color-surface-lowest)', 
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-outline-variant)', zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="mobile-nav-toggle" style={{ margin: 0, padding: '8px', border: 'none', background: 'transparent' }} onClick={() => setIsMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <div style={{ fontWeight: '500', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Pages <span style={{ color: 'var(--color-outline-variant)' }}>/</span> <span style={{ color: 'var(--color-on-surface)', fontWeight: '600' }}>{pageTitle}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'none' }} className="sm:flex">
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-on-surface-variant)' }} />
              <input type="text" placeholder="Search (Ctrl+K)" className="input-field" style={{ paddingLeft: '36px', width: '240px', borderRadius: '24px', padding: '8px 36px', height: '36px' }} />
            </div>

            <button onClick={() => setIsDarkTheme(!isDarkTheme)} style={{ color: 'var(--color-on-surface-variant)', padding: '8px', borderRadius: '50%', background: 'var(--color-surface-low)' }}>
              {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button style={{ color: 'var(--color-on-surface-variant)', padding: '8px', borderRadius: '50%', background: 'var(--color-surface-low)' }}>
              <Bell size={20} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                {initials}
              </button>

              {showProfile && (
                <div className="card" style={{ position: 'absolute', top: '48px', right: '0', minWidth: '200px', padding: '8px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontWeight: '600', padding: '8px 12px', borderBottom: '1px solid var(--color-outline-variant)', marginBottom: '4px' }}>
                    Hi {firstName}
                  </div>
                  <button onClick={() => { router.push('/account-details'); setShowProfile(false); }} style={{ padding: '8px 12px', textAlign: 'left', borderRadius: '8px', fontWeight: '500', color: 'var(--color-on-surface-variant)' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-surface-low)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    Account Details
                  </button>
                  <button onClick={handleLogout} style={{ padding: '8px 12px', textAlign: 'left', borderRadius: '8px', fontWeight: '500', color: 'var(--color-danger)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="main-content" style={{ padding: '32px', overflowY: 'auto' }}>
          <div style={{ flex: 1, maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
}
