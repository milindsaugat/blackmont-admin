import React, { useState } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';

const headerFields = [
  { key: 'sectionEyebrow', label: 'Section eyebrow label', type: 'text' },
  { key: 'sectionHeading', label: 'Section heading', type: 'text' },
];

export default function CareersProcessEditor({ data, onChange }) {
  const steps = data.steps || [];
  const update = (u) => onChange({ ...data, ...u });
  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const addStep = () => {
    if (steps.length >= 6) return;
    const newStep = { id: Date.now(), title: '', description: '' };
    update({ steps: [...steps, newStep] });
    setExpandedCard(newStep.id);
  };

  const removeStep = (index) => {
    if (window.confirm('Delete this step permanently?')) update({ steps: steps.filter((_, i) => i !== index) });
  };

  const updateStep = (index, field, val) => {
    const n = [...steps]; n[index] = { ...n[index], [field]: val }; update({ steps: n });
  };

  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleDragOver = (i) => { if (draggedIdx === null || draggedIdx === i) return; const n = [...steps]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d); setDraggedIdx(i); update({ steps: n }); };
  const handleDragEnd = (e) => { setDraggedIdx(null); e.target.style.opacity = '1'; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section Header */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>SECTION HEADER</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={data} onChange={v => update(v)} />
        </div>
      </div>

      {/* Steps CRUD */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PROCESS STEPS</h4>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{steps.length}/6 steps</span>
        </div>

        {/* Warnings */}
        {steps.length < 2 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,170,0,0.08)', border: '1px solid rgba(255,170,0,0.3)', padding: '10px 16px', borderRadius: 8, marginBottom: 16, color: '#ffaa00', fontSize: 13 }}>
            <AlertTriangle size={16} /> Minimum 2 steps required. Add {2 - steps.length} more.
          </div>
        )}
        {steps.length >= 6 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.08)', border: '1px solid var(--gold-30)', padding: '10px 16px', borderRadius: 8, marginBottom: 16, color: 'var(--gold)', fontSize: 13 }}>
            <AlertTriangle size={16} /> Maximum of 6 steps reached.
          </div>
        )}

        <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>

          {steps.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', marginBottom: 16 }}>No steps added yet. Add at least 2.</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {steps.map((step, index) => {
              const isExpanded = expandedCard === step.id;
              const stepNum = String(index + 1).padStart(2, '0');
              return (
                <div key={step._id || step.id} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleDragOver(index); }} onDragEnd={handleDragEnd}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>

                  <div onClick={() => setExpandedCard(isExpanded ? null : step.id)}
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}>
                    <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>{stepNum}</div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: step.title ? '#fff' : '#666' }}>{step.title || 'Untitled Step'}</span>
                    {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                        <div>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Step Title</label>
                          <input type="text" value={step.title || ''} onChange={e => updateStep(index, 'title', e.target.value)} style={{ ...iStyle, fontWeight: 500 }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Review Role" />
                        </div>
                        <div>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Step Description</label>
                          <textarea value={step.description || ''} onChange={e => updateStep(index, 'description', e.target.value)} style={{ ...iStyle, minHeight: 80, resize: 'vertical' }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Describe what happens in this step..." />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); updateStep(index, 'active', !step.active); }}>
                            <div style={{ width: 40, height: 20, borderRadius: 12, background: step.active !== false ? '#4caf50' : 'var(--bg-inset)', border: `1px solid ${step.active !== false ? '#4caf50' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: step.active !== false ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: step.active !== false ? 22 : 2, transition: 'all 200ms' }} />
                            </div>
                            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{step.active !== false ? 'Active' : 'Hidden'}</span>
                          </label>
                          <button onClick={() => removeStep(index)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 13 }}>
                            <Trash2 size={14} /> Delete Step
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button onClick={addStep} disabled={steps.length >= 6}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: steps.length >= 6 ? 'not-allowed' : 'pointer', opacity: steps.length >= 6 ? 0.5 : 1, marginTop: 16 }}>
            <Plus size={16} /> Add New Step
          </button>
        </div>
      </div>
    </div>
  );
}