import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, UploadCloud, Image as ImageIcon, Video, Layers, AlertTriangle, Loader2 } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import ImageUpload from '../../../components/ImageUpload';





export default function IRStockInfoEditor({ data, onChange, onDeleteLeftCard, onDeleteInfoItem, savingStockId }) {
  const leftCards = data.leftCards || [];
  const stockInfoItems = data.stockInfoItems || []; // Changed from rightPanel fixed block to CRUD list
  const update = (u) => onChange({ ...data, ...u });

  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [expandedStock, setExpandedStock] = useState(null);
  const [draggedStockIdx, setDraggedStockIdx] = useState(null);



  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  /* ── Left Cards Handlers ── */
  const addCard = () => {
    if (leftCards.length >= 6) return;
    const nc = { id: Date.now(), badgePrefixText: 'CARD', cardTitle: '', cardDescription: '' };
    update({ leftCards: [...leftCards, nc] });
    setExpandedCard(nc.id);
  };
  const removeCard = (index) => {
    if (leftCards.length <= 2) { alert('Minimum 2 cards required.'); return; }
    if (window.confirm('Delete this card permanently?')) {
      const card = leftCards[index];
      if (onDeleteLeftCard) {
        onDeleteLeftCard(card._id || card.id, index);
      } else {
        update({ leftCards: leftCards.filter((_, i) => i !== index) });
      }
    }
  };
  const updateCard = (index, field, val) => {
    const n = [...leftCards]; n[index] = { ...n[index], [field]: val }; update({ leftCards: n });
  };
  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleDragOver = (i) => { if (draggedIdx === null || draggedIdx === i) return; const n = [...leftCards]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d); setDraggedIdx(i); update({ leftCards: n }); };
  const handleDragEnd = (e) => { setDraggedIdx(null); e.target.style.opacity = '1'; };

  /* ── Stock Grid Handlers ── */
  const addStock = () => {
    const ns = { id: Date.now(), label: '', value: '' };
    update({ stockInfoItems: [...stockInfoItems, ns] });
    setExpandedStock(ns.id);
  };
  const removeStock = (index) => {
    if (window.confirm('Delete this stock info item?')) {
      const item = stockInfoItems[index];
      if (onDeleteInfoItem) {
        onDeleteInfoItem(item._id || item.id, index);
      } else {
        update({ stockInfoItems: stockInfoItems.filter((_, i) => i !== index) });
      }
    }
  };
  const updateStock = (index, field, val) => {
    const n = [...stockInfoItems]; n[index] = { ...n[index], [field]: val }; update({ stockInfoItems: n });
  };
  const handleStockDragStart = (e, i) => { setDraggedStockIdx(i); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); };
  const handleStockDragOver = (i) => { if (draggedStockIdx === null || draggedStockIdx === i) return; const n = [...stockInfoItems]; const d = n[draggedStockIdx]; n.splice(draggedStockIdx, 1); n.splice(i, 0, d); setDraggedStockIdx(i); update({ stockInfoItems: n }); };
  const handleStockDragEnd = (e) => { setDraggedStockIdx(null); e.target.style.opacity = '1'; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>



      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

        {/* PART 2: LEFT CARDS */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 1: LEFT CARDS</h4>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{leftCards.length}/6 cards</span>
          </div>

          <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {leftCards.map((card, index) => {
                const cardKey = card._id || card.id;
                const isExpanded = expandedCard === cardKey;
                const badgeNumber = (index + 1).toString().padStart(2, '0');
                return (
                  <div key={cardKey} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleDragOver(index); }} onDragEnd={handleDragEnd}
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>

                    <div onClick={() => setExpandedCard(isExpanded ? null : cardKey)}
                      style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}>
                      <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                      <div style={{ fontSize: 10, letterSpacing: '0.1em', color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{card.badgePrefixText || 'CARD'} {badgeNumber}</div>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: card.cardTitle ? '#fff' : '#666' }}>{card.cardTitle || 'Untitled Card'}</span>
                      {savingStockId === cardKey && <Loader2 size={14} className="animate-spin" color="var(--gold)" />}
                      {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                          <div>
                            <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Badge Prefix Text</label>
                            <input type="text" value={card.badgePrefixText || ''} onChange={e => updateCard(index, 'badgePrefixText', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="CARD" />
                          </div>
                          <div>
                            <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Card Title</label>
                            <input type="text" value={card.cardTitle || ''} onChange={e => updateCard(index, 'cardTitle', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                          </div>
                          <div>
                            <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Card Description</label>
                            <textarea value={card.cardDescription || ''} onChange={e => updateCard(index, 'cardDescription', e.target.value)} style={{ ...iStyle, minHeight: 80, resize: 'vertical' }} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                          </div>
                          <button onClick={() => removeCard(index)} style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 12 }}>
                            <Trash2 size={14} /> Delete Card
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={addCard} disabled={leftCards.length >= 6}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: leftCards.length >= 6 ? 'not-allowed' : 'pointer', opacity: leftCards.length >= 6 ? 0.5 : 1, marginTop: 16, width: '100%', justifyContent: 'center' }}>
              <Plus size={16} /> Add New Card
            </button>
          </div>
        </div>

        {/* PART 3: STOCK INFORMATION GRID */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 2: STOCK INFO GRID</h4>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stockInfoItems.length} items (2-col grid)</span>
          </div>

          <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stockInfoItems.map((stock, index) => {
                const stockKey = stock._id || stock.id;
                const isExpanded = expandedStock === stockKey;
                return (
                  <div key={stockKey} draggable onDragStart={e => handleStockDragStart(e, index)} onDragOver={e => { e.preventDefault(); handleStockDragOver(index); }} onDragEnd={handleStockDragEnd}
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}>

                    <div onClick={() => setExpandedStock(isExpanded ? null : stockKey)}
                      style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}>
                      <GripVertical size={16} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, color: stock.label ? '#fff' : '#666', fontWeight: 600 }}>{stock.label || 'New Item'}</span>
                        {stock.value && <span style={{ fontSize: 13, color: 'var(--gold)' }}>— {stock.value}</span>}
                      </div>
                      {savingStockId === stockKey && <Loader2 size={14} className="animate-spin" color="var(--gold)" />}
                      {isExpanded ? <ChevronUp size={16} color="#888" /> : <ChevronDown size={16} color="#888" />}
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--border-default)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                          <div>
                            <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Label</label>
                            <input type="text" value={stock.label || ''} onChange={e => updateStock(index, 'label', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Stock Symbol" />
                          </div>
                          <div>
                            <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Value</label>
                            <input type="text" value={stock.value || ''} onChange={e => updateStock(index, 'value', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. BMONT" />
                          </div>
                        </div>
                        <button onClick={() => removeStock(index)} style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 11 }}>
                          <Trash2 size={13} /> Remove Item
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={addStock}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: 'pointer', marginTop: 16, width: '100%', justifyContent: 'center', fontSize: 13 }}>
              <Plus size={14} /> Add Info Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
