import React, { useState } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, MapPin, Image as ImageIcon } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import ImageUpload from '../../../components/ImageUpload';

const headerFields = [
  { key: 'sectionEyebrow', label: 'Section eyebrow label', type: 'text' },
  { key: 'sectionHeading', label: 'Section heading', type: 'text' },
  { key: 'sectionDescription', label: 'Section description', type: 'textarea' },
];

const employmentTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export default function CareersJobsEditor({ data, onChange }) {
  const jobs = data.jobs || [];
  const update = (u) => onChange({ ...data, ...u });
  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const addJob = () => {
    const newJob = { id: Date.now(), department: '', title: '', location: '', employmentType: 'Full-time', description: '', fullDescription: '', applyLink: '', applyLabel: 'APPLY NOW', active: true };
    update({ jobs: [newJob, ...jobs] });
    setExpandedCard(newJob.id);
  };

  const removeJob = (index) => {
    if (window.confirm('Delete this job permanently?')) update({ jobs: jobs.filter((_, i) => i !== index) });
  };

  const updateJob = (index, field, val) => {
    const n = [...jobs]; n[index] = { ...n[index], [field]: val }; update({ jobs: n });
  };

  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleDragOver = (i) => { if (draggedIdx === null || draggedIdx === i) return; const n = [...jobs]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d); setDraggedIdx(i); update({ jobs: n }); };
  const handleDragEnd = (e) => { setDraggedIdx(null); e.target.style.opacity = '1'; };

  const activeCount = jobs.filter(j => j.active).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Section Header */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>SECTION HEADER</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={data} onChange={v => update(v)} />
        </div>
      </div>

      {/* Job Cards CRUD */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>JOB CARDS</h4>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--gold-30)' }}>
            <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{activeCount} Active Position{activeCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <button onClick={addJob} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--gold)', borderRadius: 8, color: '#000', cursor: 'pointer', marginBottom: 24, fontWeight: 600, border: 'none' }}>
            <Plus size={16} /> Add New Job
          </button>

          {jobs.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>No positions added yet.</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {jobs.map((job, index) => {
              const isExpanded = expandedCard === job.id;
              return (
                <div key={job.id} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleDragOver(index); }} onDragEnd={handleDragEnd}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>

                  {/* Header Row */}
                  <div onClick={() => setExpandedCard(isExpanded ? null : job.id)}
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}>
                    <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: job.title ? '#fff' : '#666' }}>{job.title || 'Untitled Position'}</span>
                        {!job.active && <span style={{ color: '#ff5555', border: '1px solid #ff5555', padding: '0 6px', borderRadius: 4, fontSize: 10 }}>HIDDEN</span>}
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--gold)' }}>{job.department || 'NO DEPT'}</span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{job.location || 'No Location'}</span>
                        <span>•</span>
                        <span>{job.employmentType || 'Full-time'}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>

                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Department / Category</label>
                            <input type="text" value={job.department || ''} onChange={e => updateJob(index, 'department', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. CLIENT ADVISORY" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Job Title</label>
                            <input type="text" value={job.title || ''} onChange={e => updateJob(index, 'title', e.target.value)} style={{ ...iStyle, fontWeight: 500 }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Client Advisory Associate" />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Location</label>
                            <input type="text" value={job.location || ''} onChange={e => updateJob(index, 'location', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Blackmont Capital Sdn Bhd 
B-09-03 , Jalan 19/1 3 Two Square, Petaling Jaya 46300 Selangor Malaysia " />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Employment Type</label>
                            <select value={job.employmentType || 'Full-time'} onChange={e => updateJob(index, 'employmentType', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover}>
                              {employmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Short Description (card summary)</label>
                          <textarea value={job.description || ''} onChange={e => updateJob(index, 'description', e.target.value)} style={{ ...iStyle, minHeight: 80, resize: 'vertical' }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Brief role overview shown on the card..." />
                        </div>

                        <div>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Full Job Description (detail page)</label>
                          <textarea value={job.fullDescription || ''} onChange={e => updateJob(index, 'fullDescription', e.target.value)} style={{ ...iStyle, minHeight: 160, resize: 'vertical' }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Full role description with responsibilities, requirements..." />
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ flex: 2 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Apply Now Link</label>
                            <input type="text" value={job.applyLink || ''} onChange={e => updateJob(index, 'applyLink', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="/careers/apply?role=..." />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Button Label</label>
                            <input type="text" value={job.applyLabel || ''} onChange={e => updateJob(index, 'applyLabel', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="APPLY NOW" />
                          </div>
                        </div>

                        {/* Toggle bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); updateJob(index, 'active', !job.active); }}>
                            <div style={{ width: 40, height: 20, borderRadius: 12, background: job.active ? '#4caf50' : 'var(--bg-inset)', border: `1px solid ${job.active ? '#4caf50' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: job.active ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: job.active ? 22 : 2, transition: 'all 200ms' }} />
                            </div>
                            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{job.active ? 'Active' : 'Hidden'}</span>
                          </label>
                          <button onClick={() => removeJob(index)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 13 }}>
                            <Trash2 size={14} /> Delete Job
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
