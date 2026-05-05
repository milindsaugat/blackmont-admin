import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Save, Loader2, Check, Clock } from 'lucide-react';
import {
  createServiceCard,
  deleteServiceCard,
  getAdminServiceCards,
  updateServiceCard,
} from '../../services/serviceCardService';

import ServicesCardsEditor from './sections/ServicesCardsEditor';

const servicesSections = [

  { key: 'cards', label: 'Service Cards' },
];

export default function StandaloneServicesEditor({ addToast }) {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const mapApiCardToEditor = useCallback((card, index) => ({
    _id: card._id,
    id: card._id || card.id || `service-card-${index}`,
    icon: card.badgeIcon || 'Trading',
    tag: card.badgeLabel || '',
    title: card.title || '',
    description: card.description || '',
    detail: card.bottomTagline || '',
    order: card.order ?? index + 1,
    isActive: card.isActive !== false,
  }), []);

  const mapEditorCardToApi = (card, index) => ({
    badgeIcon: card.icon || 'Trading',
    badgeLabel: card.tag || '',
    title: card.title || '',
    description: card.description || '',
    bottomTagline: card.detail || '',
    order: index + 1,
    isActive: card.isActive !== false,
  });

  const loadServiceCards = useCallback(async () => {
    setLoading(true);
    try {
      const cards = await getAdminServiceCards();
      const items = Array.isArray(cards)
        ? cards
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map(mapApiCardToEditor)
        : [];

      setData({ cards: { items } });
      setDirty(false);
      setLoadError('');
    } catch (error) {
      console.error('Failed to load service cards:', error);
      setLoadError(error.message || 'Failed to load service cards.');
      if (addToast) addToast('Unable to load service cards');
    } finally {
      setLoading(false);
    }
  }, [addToast, mapApiCardToEditor]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const idx = servicesSections.findIndex(s => s.key === tabParam);
      if (idx !== -1) setTab(idx);
    }
  }, [location.search]);

  useEffect(() => {
    loadServiceCards();
  }, [loadServiceCards]);

  const onChange = useCallback((sectionKey, sectionData) => {
    setData(prev => ({ ...prev, [sectionKey]: sectionData }));
    setDirty(true);
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const cards = data.cards?.items || [];
      await Promise.all(
        cards.map((card, index) => {
          const payload = mapEditorCardToApi(card, index);
          return card._id
            ? updateServiceCard(card._id, payload)
            : createServiceCard(payload);
        })
      );

      await loadServiceCards();
      setSaved(true);
      setDirty(false);
      setLastSaved(new Date());
      setTimeout(() => setSaved(false), 2500);
      if (addToast) addToast('Services Page saved');
    } catch (error) {
      console.error('Failed to save service cards:', error);
      if (addToast) addToast(error.message || 'Failed to save service cards');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = useCallback(async (card) => {
    if (!card?._id) return;

    setSaving(true);
    try {
      await deleteServiceCard(card._id);
      await loadServiceCards();
      if (addToast) addToast('Service card deleted');
    } catch (error) {
      console.error('Failed to delete service card:', error);
      if (addToast) addToast(error.message || 'Failed to delete service card');
      throw error;
    } finally {
      setSaving(false);
    }
  }, [addToast, loadServiceCards]);



  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  const safeTab = tab < servicesSections.length ? tab : 0;
  const cur = servicesSections[safeTab];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>

      {/* ── Header ── */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>Services Page CMS</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>Content Editor</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && (
            <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} />Saved: {ago()}
            </span>
          )}
          <a
            href="http://localhost:5173/services"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontWeight: 500, border: '1px solid var(--gold-20)' }}
          >
            <ExternalLink size={12} />
            VIEW LIVE PAGE
          </a>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ height: 46, background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', flexShrink: 0 }}>
        {servicesSections.map((t, i) => (
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
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 150ms',
            }}
            onMouseEnter={e => { if (tab !== i) e.currentTarget.style.color = '#999'; }}
            onMouseLeave={e => { if (tab !== i) e.currentTarget.style.color = '#666'; }}
          >
            {t.label}
            {dirty && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>{cur.label}</h2>
        <p className="typo-small">Edit {cur.label} section content for the Services Page</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />

        {cur.key === 'cards' ? (
          loading ? (
            <p className="typo-small">Loading service cards...</p>
          ) : (
            <>
              {loadError && (
                <div style={{ background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', padding: '12px 16px', borderRadius: 8, color: '#ff7777', fontSize: 13, marginBottom: 16 }}>
                  {loadError}
                </div>
              )}
              <ServicesCardsEditor
                data={data[cur.key] || {}}
                onChange={(newData) => onChange(cur.key, newData)}
                onDeleteCard={handleDeleteCard}
              />
            </>
          )
        ) : null}
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
          <button onClick={save} disabled={saving || loading} className="gold-btn">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
