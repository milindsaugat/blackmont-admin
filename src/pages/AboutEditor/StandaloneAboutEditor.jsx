import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Save, Loader2, Check, Clock } from 'lucide-react';

import AboutPrinciplesEditor from './sections/AboutPrinciplesEditor';
import MissionVisionEditor from './sections/MissionVisionEditor';
import LeadershipEditor from './sections/LeadershipEditor';
import { storage } from '../../utils/storage';
import {
  getAdminAboutBlackmont,
  getAdminLeadership,
  getAdminMissionVision,
  updateAboutBlackmont,
  updateLeadership,
  updateMissionVision,
} from '../../services/aboutService';

const aboutSections = [

  { key: 'principles', label: 'About Blackmont' },
  { key: 'missionVision', label: 'Mission & Vision' },
  { key: 'leadership', label: 'Leadership' },
];

export default function StandaloneAboutEditor() {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [aboutBlackmontDirty, setAboutBlackmontDirty] = useState(false);
  const [missionVisionDirty, setMissionVisionDirty] = useState(false);
  const [leadershipDirty, setLeadershipDirty] = useState(false);
  const [error, setError] = useState(null);

  const mapApiToPrinciples = (aboutBlackmont) => ({
    introText: aboutBlackmont?.introText || '',
    sections: [...(aboutBlackmont?.contentSections || [])]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((section, index) => ({
        _id: section._id,
        id: section._id || index + 1,
        sectionNumber: section.sectionNumber || String(index + 1).padStart(2, '0'),
        title: section.title || '',
        paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs : [],
        order: section.order || index + 1,
        published: section.published !== false,
      })),
    boxedStatement: aboutBlackmont?.footerStatement || '',
  });

  const mapPrinciplesToApi = (principles = {}) => ({
    introText: principles.introText || '',
    contentSections: (principles.sections || []).map((section, index) => ({
      _id: section._id,
      sectionNumber: section.sectionNumber || String(index + 1).padStart(2, '0'),
      title: section.title || '',
      paragraphs: Array.isArray(section.paragraphs) ? section.paragraphs : [],
      order: index + 1,
      published: section.published !== false,
    })),
    footerStatement: principles.boxedStatement || '',
  });

  const normalizeMissionVision = (missionVision = {}) => ({
    mission: {
      badgeLabel: missionVision.mission?.badgeLabel || 'MISSION',
      title: missionVision.mission?.title || 'Mission',
      description: missionVision.mission?.description || '',
    },
    vision: {
      badgeLabel: missionVision.vision?.badgeLabel || 'VISION',
      title: missionVision.vision?.title || 'Vision',
      description: missionVision.vision?.description || '',
    },
    commitmentBox: {
      title: missionVision.commitmentBox?.title || '',
      items: Array.isArray(missionVision.commitmentBox?.items)
        ? missionVision.commitmentBox.items
        : [],
      footerParagraph: missionVision.commitmentBox?.footerParagraph || '',
    },
  });

  const normalizeLeadership = (leadership = {}) => ({
    hero: {
      pageTitle: leadership.hero?.pageTitle || 'Leadership',
      heroSubtitle: leadership.hero?.heroSubtitle || '',
    },
    introCard: {
      paragraph: leadership.introCard?.paragraph || '',
    },
    expertiseSection: {
      heading: leadership.expertiseSection?.heading || '',
      bulletPoints: Array.isArray(leadership.expertiseSection?.bulletPoints)
        ? leadership.expertiseSection.bulletPoints
        : [],
    },
    strategySection: {
      operationalStrategyParagraph:
        leadership.strategySection?.operationalStrategyParagraph || '',
      unifiedPhilosophyLabel:
        leadership.strategySection?.unifiedPhilosophyLabel || 'UNIFIED PHILOSOPHY',
      unifiedPhilosophyParagraph:
        leadership.strategySection?.unifiedPhilosophyParagraph || '',
    },
    concludingStatement: {
      text: leadership.concludingStatement?.text || '',
    },
  });

  useEffect(() => {
    let ignore = false;

    const loadAboutData = async () => {
      const existing = storage.getPageContent('about_cms');
      const defaultData = {};
      aboutSections.forEach(sec => { defaultData[sec.key] = {}; });

      try {
        const [aboutBlackmont, missionVision, leadership] = await Promise.all([
          getAdminAboutBlackmont(),
          getAdminMissionVision(),
          getAdminLeadership(),
        ]);
        if (ignore) return;

        console.log("Admin Mission Vision Data:", missionVision);
        console.log("Admin Leadership Data:", leadership);

        setData({
          ...defaultData,
          ...(existing || {}),
          principles: mapApiToPrinciples(aboutBlackmont),
          missionVision: normalizeMissionVision(missionVision),
          leadership: normalizeLeadership(leadership),
        });
      } catch (error) {
        console.error('Failed to load About page API data:', error);
        if (ignore) return;

        setError(error.message || 'Failed to load About page content');
        setData(existing || defaultData);
      }
    };

    loadAboutData();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const idx = aboutSections.findIndex(s => s.key === tabParam);
      if (idx !== -1) setTab(idx);
    }
  }, [location.search]);

  const onChange = useCallback((sectionKey, sectionData) => {
    setData(prev => ({ ...prev, [sectionKey]: sectionData }));
    setDirty(true);
    if (sectionKey === 'principles') {
      setAboutBlackmontDirty(true);
    } else if (sectionKey === 'missionVision') {
      setMissionVisionDirty(true);
    } else if (sectionKey === 'leadership') {
      setLeadershipDirty(true);
    }
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      let savedAboutBlackmont = null;
      let savedMissionVision = null;
      let savedLeadership = null;

      if (aboutBlackmontDirty) {
        const aboutBlackmontPayload = mapPrinciplesToApi(data.principles);
        {
          const data = await updateAboutBlackmont(aboutBlackmontPayload);
          savedAboutBlackmont = data;
          console.log("Saved About Blackmont:", data);
        }
      }

      if (missionVisionDirty) {
        const missionVisionData = await updateMissionVision(
          normalizeMissionVision(data.missionVision)
        );
        savedMissionVision = missionVisionData;
        console.log("Saved Mission Vision:", missionVisionData);
      }

      if (leadershipDirty) {
        const leadershipPayload = normalizeLeadership(data.leadership);
        const leadershipData = await updateLeadership(leadershipPayload);
        savedLeadership = leadershipData;
        console.log("Saved Leadership:", leadershipData);
      }

      const currentStorage = storage.getPageContent('about_cms') || {};
      const newStorage = {
        ...currentStorage,
        ...data,
        ...(savedAboutBlackmont
          ? { principles: mapApiToPrinciples(savedAboutBlackmont) }
          : {}),
        ...(savedMissionVision
          ? { missionVision: normalizeMissionVision(savedMissionVision) }
          : {}),
        ...(savedLeadership
          ? { leadership: normalizeLeadership(savedLeadership) }
          : {}),
      };
      delete newStorage.missionVision;
      delete newStorage.leadership;
      storage.setPageContent('about_cms', newStorage);
      setData({
        ...newStorage,
        ...(savedMissionVision
          ? { missionVision: normalizeMissionVision(savedMissionVision) }
          : { missionVision: data.missionVision }),
        ...(savedLeadership
          ? { leadership: normalizeLeadership(savedLeadership) }
          : { leadership: data.leadership }),
      });
      setSaved(true);
      setDirty(false);
      setAboutBlackmontDirty(false);
      setMissionVisionDirty(false);
      setLeadershipDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save About page:', error);
      setError(error.message || 'Failed to save About page changes');
      alert(error.message || 'Failed to save About page changes');
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 2500);
    }
  };



  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  const safeTab = tab < aboutSections.length ? tab : 0;
  const cur = aboutSections[safeTab];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>

      {/* ── Header ── */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>About Page CMS</span>
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
            href="http://localhost:5173/about"
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
        {aboutSections.map((t, i) => (
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
        <p className="typo-small">Edit {cur.label} section content for the About Page</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />

        {error && (
          <div style={{ padding: '12px 16px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 8, color: '#ff5555', marginBottom: 20, fontSize: 13 }}>
            {error}
          </div>
        )}

        {cur.key === 'principles' ? (
          <AboutPrinciplesEditor
            data={data[cur.key] || {}}
            onChange={(newData) => onChange(cur.key, newData)}
          />
        ) : cur.key === 'missionVision' ? (
          <MissionVisionEditor
            data={data[cur.key] || {}}
            onChange={(newData) => onChange(cur.key, newData)}
          />
        ) : cur.key === 'leadership' ? (
          <LeadershipEditor
            data={data[cur.key] || {}}
            onChange={(newData) => onChange(cur.key, newData)}
          />
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
          <button onClick={save} disabled={saving} className="gold-btn">
            {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
            {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
}
