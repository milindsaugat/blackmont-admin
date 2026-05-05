import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, AlertTriangle, UploadCloud, FileText, RefreshCw, Loader2 } from 'lucide-react';

export default function IRFrameworkCardsEditor({ data, onChange, onAddCard, onDeleteCard, savingCardId }) {
  const cards = data.cards || [];
  const update = (u) => onChange({ ...data, ...u });
  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const fileRefs = useRef({});

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const getCardId = card => card._id || card.id;
  const getDownloadType = card => card.downloadButtonType || 'noButton';
  const getFileName = card => card.cardFile?.name || (card.uploadedFileUrl ? (card.uploadedFileUrl.startsWith('data:') ? 'Selected file' : card.uploadedFileUrl.split('/').pop()) : '');
  const getShowDivider = card => card.showTopGoldDividerLine !== undefined ? card.showTopGoldDividerLine : true;
  const resetFileInput = index => {
    if (fileRefs.current[index]) fileRefs.current[index].value = '';
  };

  const addCard = async () => {
    if (cards.length >= 6) return;
    const newCard = {
      id: Date.now(),
      cardTitle: '',
      cardDescription: '',
      showTopGoldDividerLine: true,
      downloadButtonType: 'noButton',
      uploadedFileUrl: '',
      externalUrl: '',
      order: cards.length + 1,
    };
    update({ cards: [...cards, newCard] });
    setExpandedCard(getCardId(newCard));

    // Call API if callback provided
    if (onAddCard) {
      try {
        await onAddCard(newCard);
      } catch (error) {
        console.error('Failed to add card:', error);
      }
    }
  };

  const removeCard = async (index) => {
    const card = cards[index];
    if (cards.length <= 2) { alert('Minimum 2 cards required.'); return; }
    if (window.confirm('Delete this card permanently?')) {
      // Call API if callback provided and card has _id
      if (onDeleteCard && card._id) {
        try {
          await onDeleteCard(card._id, index);
        } catch (error) {
          console.error('Failed to delete card:', error);
        }
      } else {
        // Optimistic update for new cards
        update({ cards: cards.filter((_, i) => i !== index) });
      }
    }
  };

  const updateCard = (index, field, val) => {
    const n = [...cards]; n[index] = { ...n[index], [field]: val }; update({ cards: n });
  };

  const updateDownloadType = (index, downloadButtonType) => {
    const n = [...cards];
    const resetFields = downloadButtonType === 'noButton'
      ? { uploadedFileUrl: '', externalUrl: '', cardFile: undefined }
      : downloadButtonType === 'externalUrl'
        ? { uploadedFileUrl: '', cardFile: undefined }
        : { externalUrl: '' };

    n[index] = { ...n[index], downloadButtonType, ...resetFields };
    update({ cards: n });

    if (downloadButtonType !== 'uploadFile') {
      resetFileInput(index);
    }
  };

  const handleFileUpload = async (index, e) => {
    const file = e.target.files[0]; if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const n = [...cards];
      n[index] = {
        ...n[index],
        downloadButtonType: 'uploadFile',
        uploadedFileUrl: reader.result,
        externalUrl: '',
        cardFile: file,
      };
      update({ cards: n });
    };
    reader.readAsDataURL(file);
  };

  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleDragOver = (i) => { if (draggedIdx === null || draggedIdx === i) return; const n = [...cards]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d); setDraggedIdx(i); update({ cards: n }); };
  const handleDragEnd = (e) => { setDraggedIdx(null); e.target.style.opacity = '1'; };

  // Grid layout description
  const gridLabel = cards.length <= 1 ? '1 column' : cards.length === 2 ? 'Centered 2-col' : cards.length === 3 ? '3-col row' : cards.length === 4 ? '2x2 grid' : cards.length === 5 ? '3+2 grid' : '2x3 grid';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cards.length}/6 cards - Layout: {gridLabel}</span>
      </div>

      {/* Warnings */}
      {cards.length < 2 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,170,0,0.08)', border: '1px solid rgba(255,170,0,0.3)', padding: '10px 16px', borderRadius: 8, color: '#ffaa00', fontSize: 13 }}>
          <AlertTriangle size={16} /> Minimum 2 cards required. Add {2 - cards.length} more.
        </div>
      )}
      {cards.length >= 6 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.08)', border: '1px solid var(--gold-30)', padding: '10px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 13 }}>
          <AlertTriangle size={16} /> Maximum of 6 cards reached.
        </div>
      )}

      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>

        {cards.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic', marginBottom: 16 }}>No cards added yet. Add at least 2.</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((card, index) => {
            const cardId = getCardId(card);
            const cardTitle = card.cardTitle || '';
            const cardDescription = card.cardDescription || '';
            const downloadButtonType = getDownloadType(card);
            const fileName = getFileName(card);
            const isExpanded = expandedCard === cardId;
            const showDivider = getShowDivider(card);
            return (
              <div key={cardId} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleDragOver(index); }} onDragEnd={handleDragEnd}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>

                <div onClick={() => setExpandedCard(isExpanded ? null : cardId)}
                  style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent', opacity: savingCardId === cardId ? 0.6 : 1, pointerEvents: savingCardId === cardId ? 'none' : 'auto' }}>
                  {savingCardId === cardId ? (
                    <Loader2 size={18} color="var(--gold)" className="animate-spin" />
                  ) : (
                    <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                  )}
                  {showDivider && <div style={{ width: 20, height: 3, background: 'var(--gold)', borderRadius: 2, flexShrink: 0 }} />}
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: cardTitle ? '#fff' : '#666' }}>{cardTitle || 'Untitled Card'}</span>
                  {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                </div>

                {isExpanded && (
                  <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                      <div>
                        <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Card Title</label>
                        <input type="text" value={cardTitle} onChange={e => updateCard(index, 'cardTitle', e.target.value)} style={{ ...iStyle, fontWeight: 500 }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Global Custody Framework" />
                      </div>
                      <div>
                        <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Card Description</label>
                        <textarea value={cardDescription} onChange={e => updateCard(index, 'cardDescription', e.target.value)} style={{ ...iStyle, minHeight: 100, resize: 'vertical' }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Card content description..." />
                      </div>

                      {/* Download Button */}
                      <div style={{ background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                        <label className="typo-label" style={{ marginBottom: 12, display: 'block' }}>Download Button</label>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                          {[{ k: 'noButton', l: 'No Button' }, { k: 'uploadFile', l: 'Upload File' }, { k: 'externalUrl', l: 'External URL' }].map(opt => (
                            <button key={opt.k} onClick={() => updateDownloadType(index, opt.k)}
                              style={{ flex: 1, padding: '8px 12px', borderRadius: 6, fontSize: 12, fontWeight: 500, background: downloadButtonType === opt.k ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: downloadButtonType === opt.k ? 'var(--gold)' : '#888', border: `1px solid ${downloadButtonType === opt.k ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}>
                              {opt.l}
                            </button>
                          ))}
                        </div>

                        {downloadButtonType === 'uploadFile' && (
                          <div>
                            {fileName ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                                <FileText size={18} color="var(--gold)" />
                                <div style={{ flex: 1 }}>
                                  <p style={{ fontSize: 13, color: '#fff' }}>{fileName}</p>
                                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Uploaded file</p>
                                </div>
                                <button onClick={() => { if (fileRefs.current[index]) fileRefs.current[index].click(); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', borderRadius: 4, color: 'var(--gold)', cursor: 'pointer', fontSize: 10 }}><RefreshCw size={10} /> Replace</button>
                                <button onClick={() => { const n = [...cards]; n[index] = { ...n[index], downloadButtonType: 'noButton', uploadedFileUrl: '', externalUrl: '', cardFile: undefined }; resetFileInput(index); update({ cards: n }); }} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 4, color: '#ff5555', cursor: 'pointer', fontSize: 10 }}><Trash2 size={10} /> Remove</button>
                              </div>
                            ) : (
                              <div style={{ border: '1px dashed var(--gold-30)', padding: 20, borderRadius: 8, textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
                                <UploadCloud size={24} color="var(--gold)" style={{ margin: '0 auto 8px' }} />
                                <p className="typo-small" style={{ marginBottom: 10 }}>PDF, DOC, or other files</p>
                                <button onClick={() => { if (fileRefs.current[index]) fileRefs.current[index].click(); }} className="gold-btn" style={{ fontSize: 11, padding: '6px 14px' }}>Select File</button>
                              </div>
                            )}
                            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" ref={el => fileRefs.current[index] = el} onChange={e => handleFileUpload(index, e)} style={{ display: 'none' }} />
                          </div>
                        )}

                        {downloadButtonType === 'externalUrl' && (
                          <div>
                            <input type="text" value={card.externalUrl || ''} onChange={e => updateCard(index, 'externalUrl', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="https://example.com/document.pdf" />
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); updateCard(index, 'showTopGoldDividerLine', !showDivider); }}>
                          <div style={{ width: 40, height: 20, borderRadius: 12, background: showDivider ? 'var(--gold)' : 'var(--bg-inset)', border: `1px solid ${showDivider ? 'var(--gold-20)' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
                            <div style={{ width: 14, height: 14, borderRadius: '50%', background: showDivider ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: showDivider ? 22 : 2, transition: 'all 200ms' }} />
                          </div>
                          <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>Show top gold divider line</span>
                        </label>
                        <button onClick={() => removeCard(index)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 13 }}>
                          <Trash2 size={14} /> Delete Card
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={addCard} disabled={cards.length >= 6}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: cards.length >= 6 ? 'not-allowed' : 'pointer', opacity: cards.length >= 6 ? 0.5 : 1, marginTop: 16 }}>
          <Plus size={16} /> Add New Card
        </button>
      </div>
    </div>
  );
}
