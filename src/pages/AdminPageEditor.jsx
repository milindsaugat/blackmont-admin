import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Save, Loader2, Check, FileEdit, Clock } from 'lucide-react';
import { pageStructure } from '../data/pageStructure';
import { storage } from '../utils/storage';
import SectionForm from '../components/SectionForm';
import StandaloneServicesEditor from './ServicesEditor/StandaloneServicesEditor';

export default function AdminPageEditor({ addToast }) {
  const { pageKey } = useParams();

  if (pageKey === 'services') {
    return <StandaloneServicesEditor addToast={addToast} />;
  }

  const config = pageStructure[pageKey];
  const [tab, setTab] = useState(0);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!config) return;
    const s = storage.getPageContent(pageKey);
    if (s) setData(s);
    else { const d = {}; config.tabs.forEach(t => { d[t.key] = {}; }); setData(d); }
    setTab(0); setDirty(false); setLastSaved(null);
  }, [pageKey]);

  const onChange = useCallback((tabKey, tabData) => {
    setData(p => ({ ...p, [tabKey]: tabData }));
    setDirty(true);
  }, []);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    storage.setPageContent(pageKey, data);
    setSaving(false); setSaved(true); setDirty(false); setLastSaved(new Date());
    setTimeout(() => setSaved(false), 2500);
    addToast?.(`${config.label} saved`);
  };



  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  if (!config) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 12 }}>
        <FileEdit size={36} color="#2a2a2a" />
        <p className="typo-body">Page not found: <span className="text-gold" style={{ fontFamily: 'var(--font-mono)' }}>{pageKey}</span></p>
      </div>
    );
  }

  const safeTab = tab < config.tabs.length ? tab : 0;
  const cur = config.tabs[safeTab];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>

      {/* ── Header ── */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>{config.label}</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>Content Editor</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && (
            <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} />Saved: {ago()}
            </span>
          )}
          <button onClick={save} disabled={saving} className="gold-btn">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE'}
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ height: 46, background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flexShrink: 0 }}>
        {config.tabs.map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(i)}
            style={{
              height: 46, padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: tab === i ? 500 : 400,
              color: tab === i ? '#D4AF37' : '#666',
              background: tab === i ? 'rgba(212,175,55,0.04)' : 'transparent',
              border: 'none', borderBottom: `2px solid ${tab === i ? '#D4AF37' : 'transparent'}`,
              borderRadius: tab === i ? '6px 6px 0 0' : 0,
              display: 'flex', alignItems: 'center', transition: 'all 150ms',
            }}
            onMouseEnter={e => { if (tab !== i) e.currentTarget.style.color = '#999'; }}
            onMouseLeave={e => { if (tab !== i) e.currentTarget.style.color = '#666'; }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>{cur.label}</h2>
        <p className="typo-small">Edit {cur.label.toLowerCase()} content for {config.label}</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />

        <SectionForm
          key={`${pageKey}-${cur.key}`}
          fields={cur.fields}
          data={data[cur.key] || {}}
          onChange={d => onChange(cur.key, d)}
        />
      </div>

      {/* ── Bottom ── */}
      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-default)', padding: '14px 24px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {dirty && (
            <span className="animate-fade-in typo-caption" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
              Unsaved changes
            </span>
          )}
          <button onClick={save} disabled={saving} className="gold-btn">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
