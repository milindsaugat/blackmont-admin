import React, { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';

const headerFields = [
  { key: 'eyebrowLabel', label: 'Eyebrow label', type: 'text' },
  { key: 'mainHeading', label: 'Main heading', type: 'text' },
  { key: 'subHeading', label: 'Subheading / body paragraph', type: 'textarea' },
];

const DraggableFeatureList = ({ items = [], onChange }) => {
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
    // Update order after drag
    const updatedItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
    onChange(updatedItems);
  };

  const handleDragEnd = (e) => {
    setDraggedIdx(null);
    e.target.style.opacity = '1';
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    if (items.length <= 2) {
      alert("You must have at least 2 feature columns.");
      return;
    }
    if (window.confirm("Removing this feature column will update the live section layout. Are you sure?")) {
      const newItems = items.filter((_, i) => i !== index);
      // Update order after remove
      const updatedItems = newItems.map((item, i) => ({ ...item, order: i + 1 }));
      onChange(updatedItems);
      if (expandedIdx === index) setExpandedIdx(null);
    }
  };

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  const handleAdd = () => {
    const newItem = { title: '', description: '', __localId: Date.now() };
    onChange([...items, newItem]);
    setExpandedIdx(items.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 className="typo-label" style={{ margin: '0', color: 'var(--gold)' }}>2. Feature Columns</h4>
      {items.length <= 2 && items.length > 0 && (
        <div style={{ background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-20)', padding: '12px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 13, marginBottom: 8 }}>
          You must have at least 2 feature columns.
        </div>
      )}
      {items.map((item, index) => {
        const isExpanded = expandedIdx === index;
        const numberBadge = String(index + 1).padStart(2, '0');
        return (
          <div
            key={item._id || item.__localId || index}
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
                {item.number || numberBadge}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ margin: 0, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title || 'Untitled Card'}</h4>
              </div>
              
              <button 
                onClick={(e) => { e.stopPropagation(); setExpandedIdx(isExpanded ? null : index); }}
                style={{ background: 'transparent', border: '1px solid var(--gold-30)', color: 'var(--gold)', padding: '6px 12px', cursor: 'pointer', borderRadius: 6, fontSize: 12, fontWeight: 500 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {isExpanded ? 'Close' : 'Edit'}
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
                
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 80 }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                      <span>Number</span>
                    </label>
                    <input 
                      type="text" 
                      value={item.number || ''} 
                      onChange={(e) => updateItem(index, 'number', e.target.value)} 
                      placeholder="01"
                      style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
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
                </div>
                
                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Card Description</span>
                  </label>
                  <textarea 
                    value={item.description || ''} 
                    onChange={(e) => updateItem(index, 'description', e.target.value)} 
                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, minHeight: 80, resize: 'vertical', outline: 'none' }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button 
        onClick={handleAdd}
        style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: 'pointer', marginTop: 8, opacity: 1 }}
      >
        <Plus size={16} />
        Add New Column
      </button>
    </div>
  );
};

export default function WhyBlackmontEditor({ data, onChange }) {
  const defaultFeatures = [
    { title: 'Absolute Ownership Clarity', description: 'Direct ownership models with verifiable audit trails, zero-compromise documentation, and unencumbered title.', number: '01', order: 1, __localId: 1 },
    { title: 'Independent Governance', description: 'Separation of sourcing, storage, and auditing roles ensuring systemic checks and balances.', number: '02', order: 2, __localId: 2 },
    { title: 'Global Liquidity', description: 'Access to deep liquidity pools and execution across major bullion hubs globally.', number: '03', order: 3, __localId: 3 },
  ];
  const featureColumns = data.featureColumns?.length ? data.featureColumns : defaultFeatures;

  const updateHeader = (newData) => {
    onChange({ ...data, ...newData });
  };

  const updateSection = (key, val) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Section Header</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={data} onChange={updateHeader} />
        </div>
      </div>

      <DraggableFeatureList items={featureColumns} onChange={(v) => updateSection('featureColumns', v)} />
    </div>
  );
}
