import React, { useState, useEffect } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, Save, Check, Loader2 } from 'lucide-react';
import { investorOverviewService } from '../../../services/investorOverviewService';

export default function IRGovernanceEditor({ data, onChange }) {
  const [govData, setGovData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPart, setSavingPart] = useState(null);
  const [expandedPillar, setExpandedPillar] = useState(null);
  const [draggedPillar, setDraggedPillar] = useState(null);

  const fetchGovData = async () => {
    try {
      const res = await investorOverviewService.getAdminCorporateGovernance();
      setGovData(res);
    } catch (e) {
      console.error("Failed to fetch corporate governance:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGovData();
  }, []);

  const updateGov = (updated) => {
    setGovData(updated);
    if (onChange) onChange(updated);
  };

  const updateField = (f, v) => {
    setGovData(prev => {
      const updated = { ...prev, [f]: v };
      if (onChange) onChange(updated);
      return updated;
    });
  };

  const updateHeader = updateField;
  const updateStrip = updateField;
  const updateProtect = updateField;

  const handleSavePart = async (partKey, payload) => {
    setSavingPart(partKey);
    try {
      await investorOverviewService.updateCorporateGovernance(payload);
      setSavingPart(partKey + '_done');
      await fetchGovData();
      setTimeout(() => setSavingPart(null), 2000);
    } catch (e) {
      console.error("Save failed:", e);
      setSavingPart(null);
    }
  };

  const saveHeaderAndCore = () => {
    handleSavePart('header', {
      eyebrow: govData.eyebrow,
      mainTitle: govData.mainTitle,
      headerDescription: govData.headerDescription,
      corePrincipleStatement: govData.corePrincipleStatement
    });
  };

  const saveStrip = () => {
    handleSavePart('strip', {
      stripTitle: govData.stripTitle,
      bullets: govData.bullets,
      stripFooterText: govData.stripFooterText
    });
  };

  const saveProtect = () => {
    handleSavePart('protect', {
      sectionTitle: govData.sectionTitle,
      paragraph1: govData.paragraph1,
      paragraph2: govData.paragraph2
    });
  };

  const addPillar = async () => {
    setSavingPart('pillars_add');
    try {
      await investorOverviewService.addGovernancePillar({
        title: "New Pillar",
        description: "",
        order: (govData.pillars?.length || 0) + 1,
        isActive: true,
        number: ((govData.pillars?.length || 0) + 1).toString().padStart(2, '0')
      });
      await fetchGovData();
    } catch (e) {
      console.error("Failed to add pillar:", e);
    } finally {
      setSavingPart(null);
    }
  };

  const updatePillar = (i, f, v) => {
    const n = [...(govData.pillars || [])];
    n[i] = { ...n[i], [f]: v };
    updateGov({ ...govData, pillars: n });
  };

  const savePillar = async (pillarId, i) => {
    setSavingPart('pillar_' + pillarId);
    try {
      const p = govData.pillars[i];
      await investorOverviewService.updateGovernancePillar(pillarId, {
        title: p.title,
        description: p.description,
        order: p.order,
        isActive: p.isActive,
        number: p.number
      });
      setSavingPart('pillar_' + pillarId + '_done');
      await fetchGovData();
      setTimeout(() => setSavingPart(null), 2000);
    } catch (e) {
      console.error("Failed to update pillar:", e);
      setSavingPart(null);
    }
  };

  const removePillar = async (pillarId) => {
    if (!window.confirm('Delete pillar?')) return;
    setSavingPart('pillar_' + pillarId);
    try {
      await investorOverviewService.deleteGovernancePillar(pillarId);
      await fetchGovData();
    } catch (e) {
      console.error("Failed to delete pillar:", e);
    } finally {
      setSavingPart(null);
    }
  };

  const SaveButton = ({ partKey, label = "Save Section", onClick }) => (
    <button onClick={onClick} disabled={savingPart === partKey} className="gold-btn" style={{ padding: '8px 16px', fontSize: 12 }}>
      {savingPart === partKey ? <Loader2 size={14} className="animate-spin" /> : savingPart === partKey + '_done' ? <Check size={14} /> : <Save size={14} />}
      {savingPart === partKey ? 'Saving...' : savingPart === partKey + '_done' ? 'Saved' : label}
    </button>
  );

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  if (loading) return <div style={{ color: 'var(--gold)' }}><Loader2 className="animate-spin" /> Loading...</div>;
  if (!govData) return <div style={{ color: '#ff5555' }}>Failed to load data.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* PART 1: HEADER & CORE PRINCIPLE */}
      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 1: HEADER & CORE PRINCIPLE</h4>
          <SaveButton partKey="header" onClick={saveHeaderAndCore} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            <div>
              <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Eyebrow</label>
              <input type="text" value={govData.eyebrow || ''} onChange={e => updateHeader('eyebrow', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Main Title</label>
              <input type="text" value={govData.mainTitle || ''} onChange={e => updateHeader('mainTitle', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} />
            </div>
          </div>
          <div>
            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Header Description</label>
            <textarea value={govData.headerDescription || ''} onChange={e => updateHeader('headerDescription', e.target.value)} style={{ ...iStyle, minHeight: 80 }} onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ padding: 20, background: 'rgba(212,175,55,0.05)', borderRadius: 12, border: '1px dashed var(--gold-30)' }}>
            <label className="typo-label" style={{ marginBottom: 8, display: 'block', color: 'var(--gold)' }}>Core Principle Statement</label>
            <input type="text" value={govData.corePrincipleStatement || ''} onChange={e => updateHeader('corePrincipleStatement', e.target.value)} style={{ ...iStyle, fontWeight: 600, textAlign: 'center' }} onFocus={focus} onBlur={blur} />
          </div>
        </div>
      </section>

      {/* PART 2: GOVERNANCE PILLARS */}
      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 2: GOVERNANCE PILLARS</h4>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Governance Pillars ({(govData.pillars || []).length}/8)</span>
          <button onClick={addPillar} disabled={(govData.pillars || []).length >= 8 || savingPart === 'pillars_add'} className="ghost-btn" style={{ padding: '6px 12px', fontSize: 12 }}>
            {savingPart === 'pillars_add' ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Add Pillar
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(govData.pillars || []).map((c, i) => {
            const isEx = expandedPillar === c._id;
            return (
              <div key={c._id} draggable onDragStart={e => { setDraggedPillar(i); e.dataTransfer.effectAllowed = 'move'; }} onDragOver={e => { e.preventDefault(); if (draggedPillar === null || draggedPillar === i) return; const n = [...govData.pillars]; const d = n[draggedPillar]; n.splice(draggedPillar, 1); n.splice(i, 0, d); setDraggedPillar(i); updateGov({ ...govData, pillars: n }); }} onDragEnd={() => setDraggedPillar(null)}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
                <div onClick={() => setExpandedPillar(isEx ? null : c._id)} style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <GripVertical size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: 10, color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{c.number || (i + 1).toString().padStart(2, '0')}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: c.title ? '#fff' : '#666' }}>{c.title || 'New Pillar'}</span>
                  {!c.isActive && <span style={{ fontSize: 10, color: '#ff5555', border: '1px solid #ff5555', padding: '2px 4px', borderRadius: 4 }}>Inactive</span>}
                  {isEx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {isEx && (
                  <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-default)', marginTop: 4 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <input type="text" value={c.number || ''} onChange={e => updatePillar(i, 'number', e.target.value)} style={{ ...iStyle, width: '80px' }} placeholder="No." onFocus={focus} onBlur={blur} />
                        <input type="text" value={c.title || ''} onChange={e => updatePillar(i, 'title', e.target.value)} style={{ ...iStyle, flex: 1 }} placeholder="Pillar Title" onFocus={focus} onBlur={blur} />
                      </div>
                      <textarea value={c.description || ''} onChange={e => updatePillar(i, 'description', e.target.value)} style={{ ...iStyle, minHeight: 80 }} placeholder="Pillar Description" onFocus={focus} onBlur={blur} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => updatePillar(i, 'isActive', !c.isActive)}>
                          <div style={{ width: 40, height: 20, borderRadius: 10, background: c.isActive ? '#4caf50' : '#444', position: 'relative' }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: c.isActive ? 23 : 3, transition: '0.2s' }} />
                          </div>
                          <span style={{ fontSize: 12 }}>{c.isActive ? 'Active' : 'Hidden'}</span>
                        </label>
                        <div style={{ display: 'flex', gap: 12 }}>
                          <button onClick={() => removePillar(c._id)} style={{ color: '#ff5555', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                            {savingPart === 'pillar_' + c._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
                          </button>
                          <SaveButton partKey={'pillar_' + c._id} label="Save Pillar" onClick={() => savePillar(c._id, i)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* PART 3: FEATURE STRIP */}
      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 3: FEATURE STRIP</h4>
          <SaveButton partKey="strip" onClick={saveStrip} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Strip Title</label>
            <input type="text" value={govData.stripTitle || ''} onChange={e => updateStrip('stripTitle', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label className="typo-label" style={{ marginBottom: 12, display: 'block' }}>Strip Bullets (Max 4)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <input key={idx} type="text" value={govData.bullets?.[idx] || ''} onChange={e => { const n = [...(govData.bullets || [])]; n[idx] = e.target.value; updateStrip('bullets', n); }} style={iStyle} placeholder={`Bullet ${idx + 1}`} onFocus={focus} onBlur={blur} />
              ))}
            </div>
          </div>
          <div>
            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Strip Footer Text</label>
            <input type="text" value={govData.stripFooterText || ''} onChange={e => updateStrip('stripFooterText', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} />
          </div>
        </div>
      </section>

      {/* PART 4: HOW WE PROTECT */}
      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 4: HOW WE PROTECT WHAT MATTERS</h4>
          <SaveButton partKey="protect" onClick={saveProtect} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Section Title</label>
            <input type="text" value={govData.sectionTitle || ''} onChange={e => updateProtect('sectionTitle', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Paragraph 1</label>
              <textarea value={govData.paragraph1 || ''} onChange={e => updateProtect('paragraph1', e.target.value)} style={{ ...iStyle, minHeight: 120 }} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Paragraph 2</label>
              <textarea value={govData.paragraph2 || ''} onChange={e => updateProtect('paragraph2', e.target.value)} style={{ ...iStyle, minHeight: 120 }} onFocus={focus} onBlur={blur} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
