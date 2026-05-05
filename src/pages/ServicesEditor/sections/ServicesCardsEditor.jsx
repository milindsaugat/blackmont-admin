import React, { useState } from 'react';
import { GripVertical, Trash2, Plus, ChevronDown, ChevronUp, Globe, Briefcase, Shield, Zap, Lock, BarChart, Crosshair } from 'lucide-react';

const ICONS = [
  { value: 'Trading', label: 'Trading', icon: <Briefcase size={14} /> },
  { value: 'Custody', label: 'Custody', icon: <Shield size={14} /> },
  { value: 'Utilisation', label: 'Utilisation', icon: <Zap size={14} /> },
  { value: 'Advisory', label: 'Advisory', icon: <Globe size={14} /> },
  { value: 'Lock', label: 'Lock', icon: <Lock size={14} /> },
  { value: 'BarChart', label: 'BarChart', icon: <BarChart size={14} /> },
  { value: 'Crosshair', label: 'Crosshair', icon: <Crosshair size={14} /> },
];

export default function ServicesCardsEditor({ data, onChange, onDeleteCard }) {
  const cards = data.items || [];

  const [expandedCard, setExpandedCard] = useState(null);
  const [draggedCardIdx, setDraggedCardIdx] = useState(null);

  const iStyle = {
    width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const update = (newCards) => onChange({ ...data, items: newCards });

  const handleDragStart = (e, index) => {
    setDraggedCardIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragOver = (index) => {
    if (draggedCardIdx === null || draggedCardIdx === index) return;
    const newItems = [...cards];
    const draggedItem = newItems[draggedCardIdx];
    newItems.splice(draggedCardIdx, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedCardIdx(index);
    update(newItems);
  };

  const handleDragEnd = (e) => {
    setDraggedCardIdx(null);
    e.target.style.opacity = '1';
  };

  const addCard = () => {
    if (cards.length >= 10) return;
    const newCard = { id: Date.now(), icon: 'Trading', tag: 'NEW SERVICE', title: '', description: '', detail: '', isActive: true };
    update([...cards, newCard]);
    setExpandedCard(newCard.id);
  };

  const removeCard = async (index) => {
    const card = cards[index];
    if (window.confirm("Deleting this service card will remove it from the live Services page. Continue?")) {
      if (card?._id && onDeleteCard) {
        await onDeleteCard(card);
        return;
      }
      const newItems = cards.filter((_, i) => i !== index);
      update(newItems);
    }
  };

  const updateCard = (index, field, val) => {
    const newItems = [...cards];
    newItems[index] = { ...newItems[index], [field]: val };
    update(newItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div style={{ background: 'var(--bg-root)', padding: '24px', borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h3 className="typo-h1" style={{ fontSize: 18, margin: 0 }}>Service Cards</h3>
        </div>

        {cards.length < 2 && (
          <div style={{ background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', padding: '12px 16px', borderRadius: 8, color: '#ff5555', fontSize: 13, marginBottom: 16 }}>
            At least 2 service cards are required.
          </div>
        )}
        {cards.length >= 10 && (
          <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-20)', padding: '12px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 13, marginBottom: 16 }}>
            Maximum of 10 service cards allowed.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {cards.map((card, index) => {
            const cardId = card._id || card.id;
            const isExpanded = expandedCard === cardId;
            const badgeNum = (index + 1).toString().padStart(2, '0');
            
            return (
              <div 
                key={cardId}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
                onDragEnd={handleDragEnd}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}
              >
                {/* Accordion Header */}
                <div 
                  onClick={() => setExpandedCard(isExpanded ? null : cardId)}
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}
                >
                  <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                  <span style={{ fontSize: 13, color: '#444', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
                    {badgeNum}
                  </span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: card.title ? 'var(--gold)' : '#666' }}>
                    {card.title || 'Untitled Service'}
                  </span>
                  <span style={{ fontSize: 11, color: card.isActive === false ? '#777' : 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {card.isActive === false ? 'Hidden' : 'Live'}
                  </span>
                  {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                      
                      <div style={{ display: 'flex', gap: 16 }}>
                        <div style={{ width: 140 }}>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Badge Icon</label>
                          <select 
                            value={card.icon || 'Trading'} 
                            onChange={e => updateCard(index, 'icon', e.target.value)}
                            style={iStyle}
                            onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover}
                          >
                            {ICONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                          </select>
                        </div>
                        <div style={{ width: 140 }}>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Badge Label</label>
                          <input type="text" value={card.tag || ''} onChange={e => updateCard(index, 'tag', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. TRADING" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Service Title (Gold)</label>
                          <input type="text" value={card.title || ''} onChange={e => updateCard(index, 'title', e.target.value)} style={{...iStyle, fontWeight: 500}} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Physical Gold Trading" />
                        </div>
                      </div>

                      <div>
                        <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Description Paragraph</label>
                        <textarea value={card.description || ''} onChange={e => updateCard(index, 'description', e.target.value)} style={{...iStyle, minHeight: 120, lineHeight: 1.6, resize: 'vertical'}} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Detail the specific offering..." />
                      </div>

                      <div>
                        <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Bottom Tagline (Uppercase)</label>
                        <input type="text" value={card.detail || ''} onChange={e => updateCard(index, 'detail', e.target.value.toUpperCase())} style={{...iStyle, letterSpacing: '0.1em'}} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="STRUCTURED SOURCING, VERIFIABLE SUPPLY CHAIN..." />
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-secondary)', fontSize: 13 }}>
                        <input
                          type="checkbox"
                          checked={card.isActive !== false}
                          onChange={e => updateCard(index, 'isActive', e.target.checked)}
                        />
                        Show this card on the live Services page
                      </label>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                        <button 
                          onClick={() => removeCard(index)}
                          title="Delete Card"
                          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 13 }}
                        >
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

        <button 
          onClick={addCard}
          disabled={cards.length >= 10}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: cards.length >= 10 ? 'not-allowed' : 'pointer', marginTop: 24, opacity: cards.length >= 10 ? 0.5 : 1 }}
        >
          <Plus size={16} />
          Add New Card
        </button>
      </div>
    </div>
  );
}
