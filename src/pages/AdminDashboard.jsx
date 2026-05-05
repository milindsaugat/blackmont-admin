import { useState, useEffect } from 'react';
import { Inbox, Bell, Users, FileText, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pageStructure } from '../data/pageStructure';
import { getDashboardOverview } from '../services/dashboardService';

function SkeletonCard() {
  return <div className="skeleton skeleton-card" />;
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    totalInquiries: 0,
    unreadMessages: 0,
    activeClients: 0,
    managedPages: Object.keys(pageStructure).length,
    recentInquiries: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);

      try {
        const data = await getDashboardOverview();

        if (!cancelled) {
          setOverview({
            totalInquiries: data?.totalInquiries || 0,
            unreadMessages: data?.unreadMessages || 0,
            activeClients: data?.activeClients || 0,
            managedPages: data?.managedPages || Object.keys(pageStructure).length,
            recentInquiries: data?.recentInquiries || [],
          });
        }
      } catch (error) {
        console.error('Failed to load dashboard overview:', error);

        if (!cancelled) {
          setOverview({
            totalInquiries: 0,
            unreadMessages: 0,
            activeClients: 0,
            managedPages: Object.keys(pageStructure).length,
            recentInquiries: [],
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const unread = overview.unreadMessages;
  const pages = overview.managedPages;
  const activeCli = overview.activeClients;

  const timeAgo = (d) => {
    if (!d) return 'now';
    const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
    if (!Number.isFinite(m) || m < 0) return 'now';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
  };

  const stats = [
    { label: 'Total Inquiries', val: overview.totalInquiries, icon: Inbox, trend: '+12%', up: true, pct: 65 },
    { label: 'Unread Messages', val: unread, icon: Bell, trend: 'Review', up: null, pct: unread > 0 ? 40 : 0 },
    { label: 'Active Clients', val: activeCli, icon: Users, trend: '+3', up: true, pct: 80 },
    { label: 'Managed Pages', val: pages, icon: FileText, trend: 'Synced', up: true, pct: 100 },
  ];

  const recent = overview.recentInquiries || [];
  const ini = (n = '') => n.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="grid-stats">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
        <div className="grid-content">
          <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
          <div className="skeleton" style={{ height: 240, borderRadius: 16 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ═══ STATS ═══ */}
      <div className="grid-stats stagger">
        {stats.map((s, i) => (
          <div
            key={i}
            className="card"
            style={{ padding: 24, cursor: 'default', transition: 'border-color 300ms, box-shadow 300ms, transform 300ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(212,175,55,0.06)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e1e'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'var(--gold-10)', border: '1px solid var(--gold-20)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color="#D4AF37" />
              </div>
              {s.up !== null && <TrendingUp size={14} color={s.up ? '#D4AF37' : '#ff6b6b'} />}
            </div>

            <p className="typo-stat">{s.val}</p>
            <p className="typo-caption" style={{ marginTop: 6, marginBottom: 20, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>

            <div style={{ height: 2, background: '#1e1e1e', borderRadius: 99 }}>
              <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #D4AF37, #F0D060)', width: `${s.pct}%`, transition: 'width 800ms ease' }} />
            </div>
            <p style={{ fontSize: 11, marginTop: 8, color: s.up ? '#D4AF37' : s.up === false ? '#ff6b6b' : '#666', fontFamily: 'var(--font-mono)' }}>
              {s.up !== null && (s.up ? '↑ ' : '↓ ')}{s.trend}
            </p>
          </div>
        ))}
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="grid-content">

        {/* Inquiries */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <span className="typo-label">Recent Inquiries</span>
            <Link to="/inquiries" style={{ fontSize: 11, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-mono)' }}>
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center' }}>
              <Inbox size={32} color="#2a2a2a" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13, color: '#444' }}>No inquiries yet</p>
            </div>
          ) : (
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {recent.map(inq => (
                <div
                  key={inq._id || inq.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 150ms' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#D4AF37' }}>{ini(inq.name)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.name}</p>
                    <p style={{ fontSize: 12, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{inq.email}</p>
                    <p style={{ fontSize: 13, color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 4 }}>{inq.message}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0, paddingTop: 2 }}>
                    <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} />{timeAgo(inq.createdAt || inq.date)}
                    </span>
                    {inq.status === 'unread' && <span className="badge badge-gold">NEW</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}