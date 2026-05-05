import React, { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';

const headerFields = [
  { key: 'eyebrow', label: 'Eyebrow label', type: 'text' },
  { key: 'heading', label: 'Main heading', type: 'text' },
];

const ctaFields = [
  { key: 'exploreBtnLabel', label: 'Button label', type: 'text' },
  { key: 'exploreBtnHref', label: 'Button link', type: 'text' },
  { key: 'showCta', label: 'Show Button', type: 'boolean' },
];

const iconOptions = [
  { value: 'Trading', label: 'Trading (Arrows)' },
  { value: 'Custody', label: 'Custody (Shield)' },
  { value: 'Utilisation', label: 'Utilisation (Flame)' },
  { value: 'Advisory', label: 'Advisory (Target)' },
];

const DraggableServicesList = ({ items = [], onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragOver = (index) => {
    if (draggedIdx === null || draggedIdx === index) return;
    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    onChange(newItems);
  };

  const handleDragEnd = (e) => {
    setDraggedIdx(null);
    e.target.style.opacity = '1';
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    if (items.length <= 2) {
      alert("Minimum 2 cards are required.");
      return;
    }
    if (window.confirm("Deleting this service card will remove it from the live site. Continue?")) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  const handleAdd = () => {
    if (items.length >= 10) return;
    onChange([...items, { tag: '', icon: 'Trading', title: '', description: '', detail: '', id: Date.now() }]);
    setExpandedIdx(items.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 className="typo-label" style={{ margin: '0', color: 'var(--gold)' }}>2. Service Cards</h4>
      {items.length >= 10 && (
        <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-20)', padding: '12px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 13, marginBottom: 8 }}>
          Maximum of 10 service cards reached.
        </div>
      )}
      {items.map((item, index) => {
        const isExpanded = expandedIdx === index;
        const numberBadge = String(index + 1).padStart(2, '0');
        return (
          <div
            key={item.id || index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
            onDragEnd={handleDragEnd}
            style={{
              background: 'var(--bg-root)', border: '1px solid var(--border-default)',
              borderRadius: 12, overflow: 'hidden', transition: 'border-color 200ms'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
          >
            <div 
              onClick={() => setExpandedIdx(isExpanded ? null : index)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}
            >
              <div style={{ cursor: 'grab' }}>
                <GripVertical size={18} color="var(--text-muted)" />
              </div>
              <div style={{ background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: 'var(--gold)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                {numberBadge}
              </div>
              <div style={{ width: 100 }}>
                <span style={{ fontSize: 11, background: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 4, color: 'var(--text-muted)', border: '1px solid var(--border-default)' }}>
                  {item.tag || 'NO TAG'}
                </span>
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ margin: 0, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || 'Untitled Card'}</h4>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                style={{ background: 'transparent', border: '1px solid var(--gold-30)', color: 'var(--gold)', padding: '6px 12px', cursor: 'pointer', borderRadius: 6, fontSize: 12, fontWeight: 500 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                Save
              </button>

              <button 
                onClick={(e) => handleRemove(e, index)}
                style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', opacity: isExpanded ? 1 : 0.4, borderRadius: 8 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,85,85,0.1)'; e.currentTarget.style.opacity = 1; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = isExpanded ? 1 : 0.4; }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {isExpanded && (
              <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ borderTop: '1px solid var(--border-default)', margin: '0 -20px 16px -20px' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Category Badge Text</span>
                    </label>
                    <input 
                      type="text" 
                      value={item.tag || ''} 
                      onChange={(e) => updateItem(index, 'tag', e.target.value)} 
                      style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Badge Icon</span>
                    </label>
                    <select
                      value={item.icon || 'Trading'}
                      onChange={(e) => updateItem(index, 'icon', e.target.value)}
                      style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                    >
                      {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Card Title</span>
                  </label>
                  <input 
                    type="text" 
                    value={item.title || ''} 
                    onChange={(e) => updateItem(index, 'title', e.target.value)} 
                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Description Paragraph</span>
                  </label>
                  <textarea 
                    value={item.description || ''} 
                    onChange={(e) => updateItem(index, 'description', e.target.value)} 
                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, minHeight: 80, resize: 'vertical', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Bottom Tag Line</span>
                  </label>
                  <input 
                    type="text" 
                    value={item.detail || ''} 
                    onChange={(e) => updateItem(index, 'detail', e.target.value)} 
                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                  />
                </div>

              </div>
            )}
          </div>
        );
      })}

      <button 
        onClick={handleAdd}
        disabled={items.length >= 10}
        style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: items.length >= 10 ? 'not-allowed' : 'pointer', marginTop: 8, opacity: items.length >= 10 ? 0.5 : 1 }}
      >
        <Plus size={16} />
        {items.length >= 10 ? 'Maximum 10 Cards Reached' : 'Add New Card'}
      </button>
      
      {items.length <= 2 && <p style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>Minimum 2 cards are required.</p>}
    </div>
  );
};

export default function ServicesEditor({ data, onChange }) {
  const header = data.header || { eyebrow: '', heading: '' };
  const cta = data.cta || { exploreBtnLabel: 'Explore Services', exploreBtnHref: '/services', showCta: true };
  const servicesList = data.servicesList?.length ? data.servicesList : [
    { tag: 'TRADING', icon: 'Trading', title: 'Physical Gold Trading', description: 'Direct access to global bullion markets with institutional-grade pricing and execution.', detail: 'STRUCTURED SOURCING, VERIFIABLE SUPPLY CHAIN.', id: 1 },
    { tag: 'CUSTODY', icon: 'Custody', title: 'Secure Vaulting', description: 'Allocated, segregated storage in high-security, non-bank vaults.', detail: 'FULLY INSURED, INDEPENDENTLY AUDITED.', id: 2 },
    { tag: 'UTILISATION', icon: 'Utilisation', title: 'Asset Utilisation', description: 'Strategic deployment of physical gold holdings to generate yield or provide collateral.', detail: 'LIQUIDITY MANAGEMENT, CAPITAL EFFICIENCY.', id: 3 },
    { tag: 'ADVISORY', icon: 'Advisory', title: 'Strategic Advisory', description: 'Bespoke consultation on portfolio integration, market timing, and regulatory compliance.', detail: 'EXPERT GUIDANCE, TAILORED SOLUTIONS.', id: 4 },
  ];

  const updateSection = (key, val) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Section Header</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={header} onChange={(v) => updateSection('header', v)} />
        </div>
      </div>

      <DraggableServicesList items={servicesList} onChange={(v) => updateSection('servicesList', v)} />
      
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>3. CTA Button</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={ctaFields} data={cta} onChange={(v) => updateSection('cta', v)} />
        </div>
      </div>
    </div>
  );
}
