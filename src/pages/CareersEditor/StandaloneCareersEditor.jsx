import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Save, Loader2, Check, Clock } from 'lucide-react';

import CareersJobsEditor from './sections/CareersJobsEditor';
import CareersProcessEditor from './sections/CareersProcessEditor';
import {
  getAdminCareers,
  updateCareerHeader,
  createCareerJob,
  updateCareerJob,
  deleteCareerJob,
  updateApplicationProcess,
  createApplicationStep,
  updateApplicationStep,
  deleteApplicationStep,
} from '../../services/careerService';

const careersTabs = [

  { key: 'positions', label: 'Open Positions' },
  { key: 'process', label: 'Application Process' },
];

const mapBackendToEditor = (doc = {}) => ({
  hero: {
    heroEyebrow: doc.header?.heroEyebrow || doc.heroEyebrow || 'CAREERS',
    heroTitle: doc.header?.heroTitle || doc.heroTitle || 'Careers at Blackmont',
    heroDescription: doc.header?.heroDescription || doc.heroDescription || '',
  },
  positions: {
    sectionEyebrow: doc.openPositions?.eyebrowLabel || 'CURRENT OPPORTUNITIES',
    sectionHeading: doc.openPositions?.heading || 'Open Positions',
    sectionDescription: doc.openPositions?.description || '',
    jobs: (doc.jobs || []).map((job) => ({
      _id: job._id,
      id: job._id,
      department: job.department || '',
      title: job.title || '',
      location: job.location || '',
      employmentType: job.employmentType || 'Full-time',
      description: job.shortDescription || '',
      shortDescription: job.shortDescription || '',
      fullDescription: job.fullDescription || '',
      applyLink: job.applyNowLink || job.applyLink || '',
      applyNowLink: job.applyNowLink || job.applyLink || '',
      applyLabel: job.buttonLabel || 'APPLY NOW',
      buttonLabel: job.buttonLabel || 'APPLY NOW',
      active: job.isActive !== false,
      isActive: job.isActive !== false,
      order: job.order || 0,
    })),
  },
  process: {
    sectionEyebrow:
      doc.applicationProcess?.sectionEyebrowLabel ||
      doc.applicationProcess?.eyebrowLabel ||
      'HOW IT WORKS',
    sectionHeading:
      doc.applicationProcess?.sectionHeading ||
      doc.applicationProcess?.heading ||
      'Application Process',
    steps: (doc.applicationProcess?.steps || []).map((step) => ({
      _id: step._id,
      id: step._id,
      number: step.number || '',
      title: step.title || '',
      description: step.description || '',
      active: step.isActive !== false,
      isActive: step.isActive !== false,
      order: step.order || 0,
    })),
  },
});

const isBlankJob = (job = {}) =>
  !job.department && !job.title && !job.description && !job.shortDescription && !job.fullDescription;

const isValidJob = (job = {}) =>
  Boolean(job.department?.trim() && job.title?.trim() && (job.description || job.shortDescription)?.trim());

const isBlankStep = (step = {}) =>
  !step.title && !step.description;

const isValidStep = (step = {}) =>
  Boolean(step.title?.trim() && step.description?.trim());

const toJobPayload = (job, index) => ({
  department: job.department || '',
  title: job.title || '',
  location: job.location || '',
  employmentType: job.employmentType || '',
  shortDescription: job.description || job.shortDescription || '',
  fullDescription: job.fullDescription || '',
  applyNowLink: job.applyNowLink || job.applyLink || '',
  buttonLabel: job.buttonLabel || job.applyLabel || 'APPLY NOW',
  isActive: job.active !== false && job.isActive !== false,
  order: index + 1,
});

const toStepPayload = (step, index) => ({
  number: step.number || String(index + 1).padStart(2, '0'),
  title: step.title || '',
  description: step.description || '',
  isActive: step.active !== false && step.isActive !== false,
  order: index + 1,
});

export default function StandaloneCareersEditor() {
  const [tab, setTab] = useState(0);
  const location = useLocation();
  const [data, setData] = useState({ hero: {}, positions: {}, process: {} });
  const [originalData, setOriginalData] = useState({ hero: {}, positions: {}, process: {} });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      const idx = careersTabs.findIndex(s => s.key === tabParam);
      if (idx !== -1) setTab(idx);
    }
  }, [location.search]);

  useEffect(() => {
    let cancelled = false;

    const loadCareers = async () => {
      setLoading(true);
      setErrorMsg('');

      try {
        const doc = await getAdminCareers();
        const mapped = mapBackendToEditor(doc);

        if (!cancelled) {
          setData(mapped);
          setOriginalData(mapped);
        }
      } catch (error) {
        console.error('Failed to load admin careers:', error);
        if (!cancelled) setErrorMsg(error.message || 'Failed to load Careers CMS.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCareers();

    return () => {
      cancelled = true;
    };
  }, []);

  const onChange = useCallback((tabKey, tabData) => {
    setData(prev => ({ ...prev, [tabKey]: tabData }));
    setDirty(true);
  }, []);

  const save = async () => {
    setSaving(true);
    setErrorMsg('');

    try {
      await updateCareerHeader({
        heroEyebrow: data.hero?.heroEyebrow || '',
        heroTitle: data.hero?.heroTitle || '',
        heroDescription: data.hero?.heroDescription || '',
        sectionEyebrow: data.positions?.sectionEyebrow || '',
        sectionHeading: data.positions?.sectionHeading || '',
        sectionDescription: data.positions?.sectionDescription || '',
      });

      const currentJobs = data.positions?.jobs || [];
      const originalJobs = originalData.positions?.jobs || [];
      const currentJobIds = new Set(currentJobs.filter((job) => job._id).map((job) => job._id));

      // Delete removed jobs in parallel
      const deletedJobIds = [];
      for (const originalJob of originalJobs) {
        if (originalJob._id && !currentJobIds.has(originalJob._id)) {
          deletedJobIds.push(originalJob._id);
        }
      }
      await Promise.all(deletedJobIds.map(id => deleteCareerJob(id)));

      // Save jobs in parallel
      const validJobs = currentJobs.map((job, index) => ({ job, index })).filter(({ job }) => {
        if (!job._id && isBlankJob(job)) return false;
        if (!isValidJob(job)) throw new Error('Each saved job must include department, title, and short description.');
        return true;
      });
      await Promise.all(validJobs.map(({ job, index }) => {
        const payload = toJobPayload(job, index);
        return job._id ? updateCareerJob(job._id, payload) : createCareerJob(payload);
      }));

      await updateApplicationProcess({
        sectionEyebrowLabel: data.process?.sectionEyebrow || '',
        sectionHeading: data.process?.sectionHeading || '',
      });

      const currentSteps = data.process?.steps || [];
      const originalSteps = originalData.process?.steps || [];
      const currentStepIds = new Set(currentSteps.filter((step) => step._id).map((step) => step._id));

      // Delete removed steps in parallel
      const deletedStepIds = [];
      for (const originalStep of originalSteps) {
        if (originalStep._id && !currentStepIds.has(originalStep._id)) {
          deletedStepIds.push(originalStep._id);
        }
      }
      await Promise.all(deletedStepIds.map(id => deleteApplicationStep(id)));

      // Save steps in parallel
      const validSteps = currentSteps.map((step, index) => ({ step, index })).filter(({ step }) => {
        if (!step._id && isBlankStep(step)) return false;
        if (!isValidStep(step)) throw new Error('Each saved process step must include title and description.');
        return true;
      });
      await Promise.all(validSteps.map(({ step, index }) => {
        const payload = toStepPayload(step, index);
        return step._id ? updateApplicationStep(step._id, payload) : createApplicationStep(payload);
      }));

      const freshDoc = await getAdminCareers();
      const mapped = mapBackendToEditor(freshDoc);
      setData(mapped);
      setOriginalData(mapped);
      setSaved(true);
      setDirty(false);
      setLastSaved(new Date());
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error('Failed to save admin careers:', error);
      setErrorMsg(error.message || 'Failed to save Careers CMS.');
    } finally {
      setSaving(false);
    }
  };



  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  const safeTab = tab < careersTabs.length ? tab : 0;
  const cur = careersTabs[safeTab];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>

      {/* ── Header ── */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>Careers CMS</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>Page Editor</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && (
            <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} />Saved: {ago()}
            </span>
          )}
          <a
            href="http://localhost:5173/careers"
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
        {careersTabs.map((t, i) => (
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
            {dirty && tab === i && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>
        <h2 className="typo-h1" style={{ marginBottom: 4 }}>{cur.label}</h2>
        <p className="typo-small">Edit {cur.label.toLowerCase()} content</p>
        <div style={{ width: 36, height: 1, background: 'var(--gold)', margin: '10px 0 24px' }} />


        {errorMsg && (
          <div style={{ marginBottom: 20, padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,85,85,0.18)', background: 'rgba(255,85,85,0.06)', color: '#ff7777', fontSize: 13 }}>
            {errorMsg}
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: 14 }}>
            <Loader2 size={18} className="animate-spin" />
            Loading Careers CMS...
          </div>
        )}

        {!loading && cur.key === 'positions' && (
          <CareersJobsEditor data={data.positions} onChange={(d) => onChange('positions', d)} />
        )}
        {!loading && cur.key === 'process' && (
          <CareersProcessEditor data={data.process} onChange={(d) => onChange('process', d)} />
        )}
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
            {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE ALL'}
          </button>
        </div>
      </div>
    </div>
  );
}