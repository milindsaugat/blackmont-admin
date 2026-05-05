import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, UploadCloud, FileText, RefreshCw, Loader2 } from 'lucide-react';





export default function IREventsEditor({ data, onChange, onDeleteEvent, onTogglePublished, savingEventId }) {
  const eventCards = data.eventCards || [];
  const update = (u) => onChange({ ...data, ...u });
  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const fileRefs = useRef({});


  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const addEvent = () => {
    const nc = {
      id: Date.now(),
      categoryTag: 'INVESTOR EVENT',
      eventTitle: '',
      date: '',
      buttonLabel: 'View Presentation',
      description: '',
      fileSource: 'externalUrl',
      uploadedFileUrl: '',
      externalUrl: '',
      status: 'outlined',
      isPublished: true,
      order: eventCards.length + 1,
    };
    update({ eventCards: [nc, ...eventCards] });
    setExpandedCard(nc.id);
  };
  const removeEvent = (index) => {
    if (!window.confirm('Delete event?')) return;

    const event = eventCards[index];
    if (onDeleteEvent) {
      onDeleteEvent(event._id || event.id, index);
      return;
    }

    update({ eventCards: eventCards.filter((_, i) => i !== index) });
  };
  const updateCard = (index, field, val) => { const n = [...eventCards]; n[index] = { ...n[index], [field]: val }; update({ eventCards: n }); };

  const updateFileSource = (index, fileSource) => {
    const n = [...eventCards];
    n[index] = {
      ...n[index],
      fileSource,
      ...(fileSource === 'externalUrl'
        ? { eventFile: null, fileName: '', fileSize: '', uploadedFileUrl: '', removeFile: true }
        : { externalUrl: '' }),
    };
    update({ eventCards: n });

    if (fileSource === 'externalUrl' && fileRefs.current[index]) {
      fileRefs.current[index].value = '';
    }
  };

  const handleFileUpload = (index, e) => {
    const file = e.target.files[0]; if (!file) return;
    const n = [...eventCards];
    n[index] = {
      ...n[index],
      fileSource: 'uploadFile',
      eventFile: file,
      externalUrl: '',
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + ' KB',
    };
    update({ eventCards: n });
  };

  const togglePublished = (index) => {
    const event = eventCards[index];
    const nextPublished = event.isPublished === false;
    if (onTogglePublished) {
      onTogglePublished(event._id || event.id, index, nextPublished);
      return;
    }
    updateCard(index, 'isPublished', nextPublished);
  };

  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleDragOver = (i) => { if (draggedIdx === null || draggedIdx === i) return; const n = [...eventCards]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d); setDraggedIdx(i); update({ eventCards: n }); };
  const handleDragEnd = (e) => { setDraggedIdx(null); e.target.style.opacity = '1'; };
  const publishedCount = eventCards.filter(event => event.isPublished !== false).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>


      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 1: INVESTOR EVENT CARDS</h4>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--gold-30)' }}>
            <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{publishedCount} Published Event{publishedCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <button onClick={addEvent} className="gold-btn" style={{ marginBottom: 24 }}><Plus size={16} /> Add New Event</button>
          {eventCards.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>No events added yet.</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {eventCards.map((card, index) => {
              const eventKey = card._id || card.id;
              const isEx = expandedCard === eventKey;
              const fileName = card.fileName || (card.uploadedFileUrl ? card.uploadedFileUrl.split('/').pop() : '');
              return (
                <div key={eventKey} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleDragOver(index); }} onDragEnd={handleDragEnd}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>
                  <div onClick={() => setExpandedCard(isEx ? null : eventKey)} style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isEx ? 'rgba(212,175,55,0.02)' : 'transparent' }}>
                    {savingEventId === eventKey ? <Loader2 size={18} color="var(--gold)" className="animate-spin" /> : <GripVertical size={18} color="var(--text-muted)" />}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {card.categoryTag && <span style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', padding: '2px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{card.categoryTag}</span>}
                        <span style={{ fontSize: 14, fontWeight: 500, color: card.eventTitle ? '#fff' : '#666' }}>{card.eventTitle || 'Untitled Event'}</span>
                        {card.isPublished === false && <span style={{ color: '#ff5555', border: '1px solid #ff5555', padding: '0 6px', borderRadius: 4, fontSize: 10 }}>DRAFT</span>}
                      </div>
                      {card.date && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{card.date}</span>}
                    </div>
                    {isEx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  {isEx && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)', marginTop: 20 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
                        <input type="text" value={card.categoryTag || ''} onChange={e => updateCard(index, 'categoryTag', e.target.value)} style={iStyle} placeholder="Category Tag" onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                        <input type="text" value={card.eventTitle || ''} onChange={e => updateCard(index, 'eventTitle', e.target.value)} style={iStyle} placeholder="Event Title" onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                        <input type="text" value={card.date || ''} onChange={e => updateCard(index, 'date', e.target.value)} style={iStyle} placeholder="March 2026" onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                        <input type="text" value={card.buttonLabel || ''} onChange={e => updateCard(index, 'buttonLabel', e.target.value)} style={iStyle} placeholder="Button Label" onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                      </div>
                      <textarea value={card.description || ''} onChange={e => updateCard(index, 'description', e.target.value)} style={{ ...iStyle, minHeight: 100, marginTop: 16 }} placeholder="Description" onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />

                      <div style={{ background: 'var(--bg-root)', padding: 16, borderRadius: 8, marginTop: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {[{ k: 'uploadFile', l: 'Upload File' }, { k: 'externalUrl', l: 'External URL' }].map(opt => (
                            <button key={opt.k} onClick={() => updateFileSource(index, opt.k)} style={{ flex: 1, padding: 8, borderRadius: 6, fontSize: 12, background: (card.fileSource || 'externalUrl') === opt.k ? 'var(--gold)' : 'var(--bg-surface)', color: (card.fileSource || 'externalUrl') === opt.k ? '#000' : '#888', border: '1px solid var(--border-default)', cursor: 'pointer' }}>{opt.l}</button>
                          ))}
                        </div>
                        {card.fileSource === 'uploadFile' ? (
                          <div>
                            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" ref={el => fileRefs.current[index] = el} onChange={e => handleFileUpload(index, e)} style={{ display: 'none' }} />
                            {fileName ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                                <FileText size={18} color="var(--gold)" />
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 13, color: '#fff' }}>{fileName}</p>
                                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{card.fileSize || 'Uploaded file'}</p>
                                </div>
                                <button onClick={() => fileRefs.current[index]?.click()} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', borderRadius: 4, color: 'var(--gold)', cursor: 'pointer', fontSize: 10 }}><RefreshCw size={10} /> Replace</button>
                                <button onClick={() => { const n = [...eventCards]; n[index] = { ...n[index], eventFile: null, fileName: '', fileSize: '', uploadedFileUrl: '', removeFile: true }; update({ eventCards: n }); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 4, color: '#ff5555', cursor: 'pointer', fontSize: 10 }}><Trash2 size={10} /> Remove</button>
                              </div>
                            ) : (
                              <div style={{ border: '1px dashed var(--gold-30)', padding: 20, borderRadius: 8, textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
                                <UploadCloud size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
                                <p className="typo-small" style={{ marginBottom: 10 }}>PDF, DOC, XLS, or presentation files</p>
                                <button onClick={() => fileRefs.current[index]?.click()} className="gold-btn" style={{ fontSize: 11, padding: '6px 14px' }}>Select File</button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <input type="text" value={card.externalUrl || ''} onChange={e => updateCard(index, 'externalUrl', e.target.value)} style={iStyle} placeholder="https://example.com/presentation.pdf" onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                        )}
                        <select value={card.status || 'outlined'} onChange={e => updateCard(index, 'status', e.target.value)} style={iStyle}>
                          <option value="outlined">Outlined</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
                        <button onClick={() => removeEvent(index)} style={{ color: '#ff5555', border: 'none', background: 'transparent', cursor: 'pointer' }}><Trash2 size={16} /> Delete</button>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={e => { e.preventDefault(); togglePublished(index); }}>
                          <div style={{ width: 40, height: 20, borderRadius: 10, background: card.isPublished !== false ? '#4caf50' : '#444', position: 'relative' }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: card.isPublished !== false ? 23 : 3, transition: '0.2s' }} />
                          </div>
                          <span style={{ fontSize: 12 }}>{card.isPublished !== false ? 'Published' : 'Draft'}</span>
                        </label>
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
