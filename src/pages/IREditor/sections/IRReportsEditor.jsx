import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, UploadCloud, FileText, RefreshCw, Image as ImageIcon, Video, Layers, Loader2 } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import ImageUpload from '../../../components/ImageUpload';





export default function IRReportsEditor({ data, onChange, onDeleteReport, savingReportId }) {
  const reports = data.reports || [];
  const update = (u) => onChange({ ...data, ...u });
  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);



  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const addReport = () => {
    const nr = { id: Date.now(), categoryTag: '', reportTitle: '', date: '', fileSource: 'externalUrl', externalUrl: '', reportFile: null, fileName: '', fileSize: '', downloadButtonLabel: 'Download PDF', isPublished: true };
    update({ reports: [nr, ...reports] });
    setExpandedCard(nr.id);
  };

  const removeReport = (index) => {
    if (window.confirm('Delete this report permanently?')) {
      const report = reports[index];
      if (onDeleteReport) {
        onDeleteReport(report._id || report.id, index);
      } else {
        update({ reports: reports.filter((_, i) => i !== index) });
      }
    }
  };

  const updateReport = (index, field, val) => {
    const n = [...reports]; n[index] = { ...n[index], [field]: val }; update({ reports: n });
  };

  const fileRefs = useRef({});
  const handleFileUpload = (index, e) => {
    const file = e.target.files[0]; if (!file) return;
    const n = [...reports];
    n[index] = { ...n[index], fileSource: 'uploadFile', reportFile: file, fileName: file.name, fileSize: (file.size / 1024).toFixed(1) + ' KB' };
    update({ reports: n });
  };

  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleDragOver = (i) => { if (draggedIdx === null || draggedIdx === i) return; const n = [...reports]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d); setDraggedIdx(i); update({ reports: n }); };
  const handleDragEnd = (e) => { setDraggedIdx(null); e.target.style.opacity = '1'; };

  const publishedCount = reports.filter(r => r.isPublished).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>



      {/* PART 2: REPORTS LIST */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 1: REPORTS LIST</h4>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--gold-30)' }}>
            <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{publishedCount} Published Report{publishedCount !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <button onClick={addReport} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--gold)', borderRadius: 8, color: '#000', cursor: 'pointer', marginBottom: 24, fontWeight: 600, border: 'none' }}>
            <Plus size={16} /> Add New Report
          </button>

          {reports.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>No reports added yet.</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.map((report, index) => {
              const reportKey = report._id || report.id;
              const isExpanded = expandedCard === reportKey;
              return (
                <div key={reportKey} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleDragOver(index); }} onDragEnd={handleDragEnd}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>

                  <div onClick={() => setExpandedCard(isExpanded ? null : (report.id || report._id))}
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}>
                    <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {report.categoryTag && <span style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{report.categoryTag}</span>}
                        <span style={{ fontSize: 14, fontWeight: 500, color: report.reportTitle ? '#fff' : '#666' }}>{report.reportTitle || 'Untitled Report'}</span>
                        {!report.isPublished && <span style={{ color: '#ff5555', border: '1px solid #ff5555', padding: '0 6px', borderRadius: 4, fontSize: 10 }}>DRAFT</span>}
                        {savingReportId === reportKey && <Loader2 size={12} className="animate-spin" color="var(--gold)" />}
                      </div>
                      {report.date && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(report.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>}
                    </div>
                    {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>

                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Category Tag</label>
                            <input type="text" value={report.categoryTag || ''} onChange={e => updateReport(index, 'categoryTag', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. QUARTERLY" />
                          </div>
                          <div style={{ flex: 2 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Report Title</label>
                            <input type="text" value={report.reportTitle || ''} onChange={e => updateReport(index, 'reportTitle', e.target.value)} style={{ ...iStyle, fontWeight: 500 }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Quarterly Capital Perspective" />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Date</label>
                            <input type="date" value={report.date || ''} onChange={e => updateReport(index, 'date', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Download Button Label</label>
                            <input type="text" value={report.downloadButtonLabel || ''} onChange={e => updateReport(index, 'downloadButtonLabel', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Download PDF" />
                          </div>
                        </div>

                        {/* File Toggle */}
                        <div style={{ background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                          <label className="typo-label" style={{ marginBottom: 12, display: 'block' }}>File Source</label>
                          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                            {[{ k: 'uploadFile', l: 'Upload File' }, { k: 'externalUrl', l: 'External URL' }].map(opt => (
                              <button key={opt.k} onClick={() => updateReport(index, 'fileSource', opt.k)}
                                style={{ flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: (report.fileSource || 'externalUrl') === opt.k ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: (report.fileSource || 'externalUrl') === opt.k ? 'var(--gold)' : '#888', border: `1px solid ${(report.fileSource || 'externalUrl') === opt.k ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer' }}>
                                {opt.l}
                              </button>
                            ))}
                          </div>

                          {report.fileSource === 'uploadFile' && (
                            <div>
                              {report.fileName ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                                  <FileText size={18} color="var(--gold)" />
                                  <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, color: '#fff' }}>{report.fileName || (report.uploadedFileUrl ? report.uploadedFileUrl.split('/').pop() : 'File uploaded')}</p>
                                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{report.fileSize}</p>
                                  </div>
                                  <button onClick={() => { if (fileRefs.current[index]) fileRefs.current[index].click(); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', borderRadius: 4, color: 'var(--gold)', cursor: 'pointer', fontSize: 10 }}><RefreshCw size={10} /> Replace</button>
                                  <button onClick={() => { const n = [...reports]; n[index] = { ...n[index], reportFile: null, fileName: '', fileSize: '', uploadedFileUrl: '', removeFile: true }; update({ reports: n }); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 4, color: '#ff5555', cursor: 'pointer', fontSize: 10 }}><Trash2 size={10} /> Remove</button>
                                </div>
                              ) : (
                                <div style={{ border: '1px dashed var(--gold-30)', padding: 20, borderRadius: 8, textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
                                  <UploadCloud size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
                                  <p className="typo-small" style={{ marginBottom: 10 }}>PDF or document files</p>
                                  <button onClick={() => { if (fileRefs.current[index]) fileRefs.current[index].click(); }} className="gold-btn" style={{ fontSize: 11, padding: '6px 14px' }}>Select File</button>
                                </div>
                              )}
                              <input type="file" accept=".pdf,.doc,.docx" ref={el => fileRefs.current[index] = el} onChange={e => handleFileUpload(index, e)} style={{ display: 'none' }} />
                            </div>
                          )}

                          {(report.fileSource === 'externalUrl' || !report.fileSource) && (
                            <input type="text" value={report.externalUrl || ''} onChange={e => updateReport(index, 'externalUrl', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="https://example.com/report.pdf" />
                          )}
                        </div>

                        {/* Bottom bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); updateReport(index, 'isPublished', !report.isPublished); }}>
                            <div style={{ width: 40, height: 20, borderRadius: 12, background: report.isPublished ? '#4caf50' : 'var(--bg-inset)', border: `1px solid ${report.isPublished ? '#4caf50' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: report.isPublished ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: report.isPublished ? 22 : 2, transition: 'all 200ms' }} />
                            </div>
                            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{report.isPublished ? 'Published' : 'Draft'}</span>
                          </label>
                          <button onClick={() => removeReport(index)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 13 }}>
                            <Trash2 size={14} /> Delete Report
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
