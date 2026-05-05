import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle, Check, Clock, ExternalLink, Loader2, Save } from 'lucide-react';
import LegalFAQEditor from './sections/LegalFAQEditor';
import LegalTermsEditor from './sections/LegalTermsEditor';
import LegalPrivacyEditor from './sections/LegalPrivacyEditor';
import {
  getAdminLegalByType,
  updateAdminLegal,
} from '../../services/legalService';

const legalTabs = [
  { key: 'faq', label: 'FAQ', path: '/faq' },
  { key: 'terms', label: 'Terms & Conditions', path: '/terms' },
  { key: 'privacy', label: 'Privacy Policy', path: '/privacy' },
];

const defaults = {
  faq: {
    eyebrowLabel: 'Client Information',
    title: 'Frequently Asked Questions',
    subtitle: 'Clear answers for prospective clients',
    faqs: [],
    isActive: true,
  },
  terms: {
    eyebrowLabel: 'Legal',
    title: 'Terms & Conditions',
    subtitle: 'Legal terms for using Blackmont services',
    content: '',
    isActive: true,
  },
  privacy: {
    eyebrowLabel: 'Legal',
    title: 'Privacy Policy',
    subtitle: 'How Blackmont protects client information',
    content: '',
    isActive: true,
  },
};

const cleanLegalPayload = (type, value) => {
  const base = {
    eyebrowLabel: value.eyebrowLabel ?? defaults[type].eyebrowLabel,
    title: value.title ?? defaults[type].title,
    subtitle: value.subtitle ?? defaults[type].subtitle,
    isActive: value.isActive !== false,
  };

  if (type === 'faq') {
    return {
      ...base,
      faqs: (value.faqs || []).map(item => ({
        question: item.question || '',
        answer: item.answer || '',
      })),
    };
  }

  return {
    ...base,
    content: value.content ?? '',
  };
};

export default function StandaloneLegalEditor({ addToast }) {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const [data, setData] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [savingType, setSavingType] = useState(null);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const idx = legalTabs.findIndex(s => s.key === tabParam);
      if (idx !== -1) setTab(idx);
    }
  }, [location.search]);

  useEffect(() => {
    let isMounted = true;

    const loadLegalContent = async () => {
      setLoading(true);
      setMessage('');

      const nextData = { ...defaults };
      let loadError = '';

      await Promise.all(legalTabs.map(async ({ key }) => {
        try {
          const doc = await getAdminLegalByType(key);
          nextData[key] = { ...defaults[key], ...doc };
        } catch (error) {
          if (error.status !== 404) {
            loadError = error.message || 'Unable to load legal content.';
          }
        }
      }));

      if (!isMounted) return;

      setData(nextData);
      if (loadError) {
        setMessageType('error');
        setMessage(loadError);
      }
      setDirty(false);
      setLoading(false);
    };

    loadLegalContent();

    return () => {
      isMounted = false;
    };
  }, []);

  const onChange = useCallback((tabKey, tabData) => {
    setData(prev => ({ ...prev, [tabKey]: tabData }));
    setDirty(true);
    setSaved(false);
  }, []);

  const saveType = async (type) => {
    setSavingType(type);
    setMessage('');

    try {
      const payload = cleanLegalPayload(type, data[type] || defaults[type]);
      const savedDoc = await updateAdminLegal(type, payload);

      setData(prev => ({ ...prev, [type]: { ...defaults[type], ...savedDoc } }));
      setSaved(true);
      setDirty(false);
      setLastSaved(new Date());
      setMessageType('success');
      setMessage(`${legalTabs.find(item => item.key === type)?.label || 'Legal section'} saved successfully.`);
      addToast?.(`${legalTabs.find(item => item.key === type)?.label || 'Legal section'} saved successfully`);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error(`Failed to save ${type} legal content:`, error);
      setSaved(false);
      setMessageType('error');
      setMessage(error.message || 'Unable to save legal content.');
      addToast?.(error.message || 'Unable to save legal content', 'error');
    } finally {
      setSavingType(null);
    }
  };

  const ago = () => {
    if (!lastSaved) return null;
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return seconds < 60 ? 'Just now' : `${Math.floor(seconds / 60)}m ago`;
  };

  const safeTab = tab < legalTabs.length ? tab : 0;
  const cur = legalTabs[safeTab];
  const isSavingCurrent = savingType === cur.key;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>Legal Management</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>{cur.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={12} />Saved: {ago()}</span>}
          <a href={`http://localhost:5173${cur.path}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontWeight: 500, border: '1px solid var(--gold-20)' }}>
            <ExternalLink size={12} /> VIEW LIVE PAGE
          </a>
        </div>
      </div>

      <div style={{ height: 46, background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flexShrink: 0 }}>
        {legalTabs.map((t, i) => (
          <button key={t.key} onClick={() => setTab(i)}
            style={{ height: 46, padding: '0 16px', fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: tab === i ? 500 : 400, color: tab === i ? '#D4AF37' : '#666', background: tab === i ? 'rgba(212,175,55,0.04)' : 'transparent', border: 'none', borderBottom: `2px solid ${tab === i ? '#D4AF37' : 'transparent'}`, borderRadius: tab === i ? '6px 6px 0 0' : 0, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 150ms' }}>
            {t.label}
            {dirty && tab === i && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>{cur.label} Editor</h2>
        <p className="typo-small">Manage {cur.label.toLowerCase()} content from the Blackmont backend.</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />

        {message && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '12px 14px', borderRadius: 12, border: `1px solid ${messageType === 'error' ? 'rgba(255,85,85,0.18)' : 'rgba(212,175,55,0.18)'}`, background: messageType === 'error' ? 'rgba(255,85,85,0.06)' : 'rgba(212,175,55,0.06)', color: messageType === 'error' ? '#ff7777' : 'var(--gold)', fontSize: 13 }}>
            {messageType === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            {message}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
            <Loader2 size={18} className="animate-spin" /> Loading legal content...
          </div>
        ) : (
          <>
            {cur.key === 'faq' && <LegalFAQEditor data={data.faq} onChange={d => onChange('faq', d)} onSave={() => saveType('faq')} saving={isSavingCurrent} />}
            {cur.key === 'terms' && <LegalTermsEditor data={data.terms} onChange={d => onChange('terms', d)} onSave={() => saveType('terms')} saving={isSavingCurrent} title="Terms & Conditions" />}
            {cur.key === 'privacy' && <LegalPrivacyEditor data={data.privacy} onChange={d => onChange('privacy', d)} onSave={() => saveType('privacy')} saving={isSavingCurrent} />}
          </>
        )}
      </div>

      <div style={{ position: 'sticky', bottom: 0, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-default)', padding: '14px 24px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {dirty && <span className="animate-fade-in typo-caption" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />Unsaved changes</span>}
          <button onClick={() => saveType(cur.key)} disabled={loading || Boolean(savingType)} className="gold-btn">
            {isSavingCurrent ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {isSavingCurrent ? 'SAVING...' : saved ? 'SAVED!' : `SAVE ${cur.label.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  );
}
