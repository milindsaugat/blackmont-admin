import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Eye, Trash2, ArrowLeft, Download, X, Save, FileText, User, Mail, Phone, Briefcase, Clock, StickyNote } from 'lucide-react';

const STATUS_OPTIONS = ['New', 'Reviewed', 'Shortlisted', 'Rejected'];
const STATUS_COLORS = { New: '#3b82f6', Reviewed: '#f59e0b', Shortlisted: '#22c55e', Rejected: '#ef4444' };

const mockApplications = [
  { id: 1, name: 'Arjun Mehta', email: 'arjun@email.com', phone: '+60 12-345 6789', position: 'Client Advisory Associate', date: '2026-04-20T10:30:00', status: 'New', message: 'I am excited to apply for this role. With 5 years of experience in wealth management and a strong background in client relationship building, I believe I can contribute significantly to Blackmont\'s advisory team.', resumeType: 'pdf', resumeName: 'Arjun_Mehta_CV.pdf', notes: '' },
  { id: 2, name: 'Sarah Chen', email: 'sarah.chen@email.com', phone: '+60 11-234 5678', position: 'Research Analyst', date: '2026-04-19T14:15:00', status: 'Reviewed', message: 'I hold an MSc in Finance from LSE and have 3 years of equity research experience. I am particularly drawn to Blackmont\'s focus on precious metals and alternative assets.', resumeType: 'pdf', resumeName: 'Sarah_Chen_Resume.pdf', notes: 'Strong candidate. Schedule for interview.' },
  { id: 3, name: 'David Lim', email: 'david.lim@email.com', phone: '+60 19-876 5432', position: 'Client Advisory Associate', date: '2026-04-18T09:00:00', status: 'Shortlisted', message: 'With my CFA Level III candidacy and experience at Goldman Sachs, I am confident in my ability to deliver exceptional advisory services.', resumeType: 'image', resumeName: 'DavidLim_CV.jpg', notes: 'Final round scheduled for next week.' },
  { id: 4, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', position: 'Operations Specialist', date: '2026-04-17T16:45:00', status: 'New', message: 'I bring 4 years of custody operations experience from HSBC. I am passionate about operational excellence and risk management.', resumeType: 'pdf', resumeName: 'Priya_Sharma_Resume.pdf', notes: '' },
  { id: 5, name: 'James Wong', email: 'james.w@email.com', phone: '+60 16-543 2100', position: 'Research Analyst', date: '2026-04-15T11:20:00', status: 'Rejected', message: 'Recent graduate looking for an entry-level research position.', resumeType: 'other', resumeName: 'James_Wong_CV.docx', notes: 'Does not meet minimum experience requirements.' },
];

export default function AdminApplications() {
  const [apps, setApps] = useState([]);
  const [filterPosition, setFilterPosition] = useState('All Positions');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('bm_admin_applications');
    if (stored) { setApps(JSON.parse(stored)); }
    else { setApps(mockApplications); localStorage.setItem('bm_admin_applications', JSON.stringify(mockApplications)); }
  }, []);

  const persist = (newApps) => { setApps(newApps); localStorage.setItem('bm_admin_applications', JSON.stringify(newApps)); };

  const positions = [...new Set(apps.map(a => a.position))];

  const filtered = apps.filter(a => {
    if (filterPosition !== 'All Positions' && a.position !== filterPosition) return false;
    if (filterStatus !== 'All' && a.status !== filterStatus) return false;
    if (searchTerm && !a.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (id, status) => {
    persist(apps.map(a => a.id === id ? { ...a, status } : a));
    if (selectedApp?.id === id) setSelectedApp(prev => ({ ...prev, status }));
  };

  const updateNotes = (id, notes) => {
    persist(apps.map(a => a.id === id ? { ...a, notes } : a));
  };

  const deleteApp = (id) => {
    if (!window.confirm('Permanently delete this application and all associated files? This cannot be undone.')) return;
    persist(apps.filter(a => a.id !== id));
    setSelectedApp(null);
  };

  const newCount = apps.filter(a => a.status === 'New').length;

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  const formatDate = (d) => { const dt = new Date(d); return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); };
  const formatDateTime = (d) => { const dt = new Date(d); return dt.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); };

  // ── Detail View ──
  if (selectedApp) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>
        <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button onClick={() => setSelectedApp(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to List
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => deleteApp(selectedApp.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', color: '#ff5555', padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
            <Trash2 size={14} /> Delete Application
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 60px' }}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Applicant Info Card */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 className="typo-h1" style={{ fontSize: 22, marginBottom: 4 }}>{selectedApp.name}</h2>
                  <p className="typo-small">Applied for <span style={{ color: 'var(--gold)' }}>{selectedApp.position}</span></p>
                </div>
                <select value={selectedApp.status} onChange={e => updateStatus(selectedApp.id, e.target.value)}
                  style={{ padding: '6px 12px', borderRadius: 6, background: STATUS_COLORS[selectedApp.status] + '22', color: STATUS_COLORS[selectedApp.status], border: `1px solid ${STATUS_COLORS[selectedApp.status]}44`, fontSize: 12, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[{ icon: <Mail size={14} />, label: 'Email', value: selectedApp.email },
                  { icon: <Phone size={14} />, label: 'Phone', value: selectedApp.phone },
                  { icon: <Briefcase size={14} />, label: 'Position', value: selectedApp.position },
                  { icon: <Clock size={14} />, label: 'Applied', value: formatDateTime(selectedApp.date) }
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg-root)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                    <span style={{ color: 'var(--gold)' }}>{item.icon}</span>
                    <div>
                      <p style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{item.label}</p>
                      <p style={{ fontSize: 13, color: '#fff', marginTop: 2 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Letter */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', padding: 24 }}>
              <h3 className="typo-label" style={{ color: 'var(--gold)', marginBottom: 16 }}>COVER LETTER / MESSAGE</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', whiteSpace: 'pre-wrap' }}>{selectedApp.message || 'No message provided.'}</p>
            </div>

            {/* Resume */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', padding: 24 }}>
              <h3 className="typo-label" style={{ color: 'var(--gold)', marginBottom: 16 }}>RESUME / CV</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg-root)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                <FileText size={24} color="var(--gold)" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: '#fff' }}>{selectedApp.resumeName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{selectedApp.resumeType === 'pdf' ? 'PDF Document' : selectedApp.resumeType === 'image' ? 'Image File' : 'Document'}</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', borderRadius: 6, color: 'var(--gold)', cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                  <Download size={14} /> Download
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', padding: 24 }}>
              <h3 className="typo-label" style={{ color: 'var(--gold)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><StickyNote size={14} /> INTERNAL NOTES</h3>
              <textarea value={selectedApp.notes || ''} onChange={e => setSelectedApp(prev => ({ ...prev, notes: e.target.value }))}
                style={{ ...iStyle, minHeight: 100, resize: 'vertical' }} onFocus={focus} onBlur={blur} placeholder="Add private notes about this applicant..." />
              <button onClick={() => updateNotes(selectedApp.id, selectedApp.notes)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '8px 16px', background: 'var(--gold)', border: 'none', borderRadius: 6, color: '#000', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                <Save size={14} /> Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── List View ──
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
        <span className="typo-h1" style={{ fontSize: 18 }}>Careers CMS</span>
        <span style={{ color: '#333', margin: '0 2px' }}>/</span>
        <span className="typo-body" style={{ fontSize: 13 }}>Applications</span>
        {newCount > 0 && <span style={{ marginLeft: 8, background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{newCount} New</span>}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 24px' }}>
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 200px' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search by applicant name..."
              style={{ ...iStyle, paddingLeft: 40 }} onFocus={focus} onBlur={blur} />
          </div>
          <select value={filterPosition} onChange={e => setFilterPosition(e.target.value)} style={{ ...iStyle, width: 'auto', flex: '0 0 220px' }} onFocus={focus} onBlur={blur}>
            <option>All Positions</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...iStyle, width: 'auto', flex: '0 0 160px' }} onFocus={focus} onBlur={blur}>
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
          {/* Table Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 80px', padding: '12px 20px', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-inset)' }}>
            {['Applicant', 'Applied For', 'Date', 'Status', ''].map(h => (
              <span key={h} style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>{h}</span>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>No applications found matching your filters.</div>
          )}

          {filtered.map(app => (
            <div key={app.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 80px', padding: '14px 20px', borderBottom: '1px solid var(--border-default)', alignItems: 'center', transition: 'background 150ms' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#fff' }}>{app.name}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{app.email}</p>
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{app.position}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(app.date)}</span>
              <div>
                <select value={app.status} onChange={e => updateStatus(app.id, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: 4, background: STATUS_COLORS[app.status] + '22', color: STATUS_COLORS[app.status], border: `1px solid ${STATUS_COLORS[app.status]}44`, fontSize: 11, fontWeight: 600, cursor: 'pointer', outline: 'none' }}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={() => setSelectedApp(app)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', borderRadius: 6, color: 'var(--gold)', padding: '6px 12px', cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>
                <Eye size={12} /> View
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 16 }}>
          Showing {filtered.length} of {apps.length} applications
        </p>
      </div>
    </div>
  );
}
