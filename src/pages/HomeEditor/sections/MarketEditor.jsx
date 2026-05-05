import React, { useState } from 'react';
import { GripVertical, Trash2, Plus, Pencil, Check } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import MarketChartEditor from './MarketChartEditor';

const headerFields = [
  { key: 'eyebrowLabel', label: 'Eyebrow label', type: 'text' },
  { key: 'mainHeading', label: 'Main heading', type: 'text' },
  { key: 'description', label: 'Description paragraph', type: 'textarea' },
];

const DraggablePillsList = ({ items = [], onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editLabel, setEditLabel] = useState('');

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

  const handleRemove = (e, index) => {
    e.stopPropagation();
    if (items.length <= 1) {
      alert("Minimum 1 tag is required.");
      return;
    }
    if (window.confirm("Remove this tag?")) {
      onChange(items.filter((_, i) => i !== index));
      if (editingIdx === index) setEditingIdx(null);
    }
  };

  const handleAdd = () => {
    if (items.length >= 6) return;
    const newItems = [...items, { label: 'NEW TAG', __localId: Date.now() }];
    onChange(newItems);
    setEditingIdx(newItems.length - 1);
    setEditLabel('NEW TAG');
  };

  const saveEdit = (index) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], label: editLabel };
    onChange(newItems);
    setEditingIdx(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 className="typo-label" style={{ margin: '0', color: 'var(--gold)' }}>2. Topic Pill Tags Row</h4>
      {items.length >= 6 && (
        <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-20)', padding: '12px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 13, marginBottom: 8 }}>
          Maximum of 6 tags reached.
        </div>
      )}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        {items.map((item, index) => {
          const isEditing = editingIdx === index;
          return (
            <div
              key={item.__localId || index}
              draggable={!isEditing}
              onDragStart={(e) => !isEditing && handleDragStart(e, index)}
              onDragOver={(e) => { e.preventDefault(); !isEditing && handleDragOver(index); }}
              onDragEnd={(e) => { setDraggedIdx(null); e.target.style.opacity = '1'; }}
              style={{
                background: 'var(--bg-root)', border: '1px solid var(--border-default)',
                borderRadius: 24, padding: isEditing ? '12px 16px' : '6px 12px', display: 'flex', flexDirection: 'column', gap: 8,
                transition: 'border-color 200ms', minWidth: isEditing ? 240 : 'auto', cursor: isEditing ? 'default' : 'grab'
              }}
              onMouseEnter={(e) => !isEditing && (e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)')}
              onMouseLeave={(e) => !isEditing && (e.currentTarget.style.borderColor = 'var(--border-default)')}
            >
              {!isEditing ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.label}</span>
                  <button onClick={() => { setEditingIdx(index); setEditLabel(item.label); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 2 }}>
                    <Pencil size={12} />
                  </button>
                  <button onClick={(e) => handleRemove(e, index)} style={{ background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', padding: 2, marginLeft: -4 }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input 
                      type="text" 
                      value={editLabel} 
                      onChange={e => setEditLabel(e.target.value)} 
                      placeholder="Tag Label"
                      style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '6px 10px', color: '#fff', fontSize: 12, outline: 'none' }}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(index)}
                    />
                    <button onClick={() => saveEdit(index)} style={{ background: 'var(--gold-20)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: 6, borderRadius: 6, cursor: 'pointer' }}>
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        <button 
          onClick={handleAdd}
          disabled={items.length >= 6}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 16px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 24, color: 'var(--gold)', cursor: items.length >= 6 ? 'not-allowed' : 'pointer', opacity: items.length >= 6 ? 0.5 : 1, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em' }}
        >
          <Plus size={14} /> Add Tag
        </button>
      </div>
      
      {items.length <= 1 && <p style={{ fontSize: 12, color: 'var(--gold)', margin: 0 }}>Minimum 1 tag is required.</p>}
    </div>
  );
};

export default function MarketEditor({ data, onChange }) {
  const updateSection = (key, val) => {
    onChange({ ...data, [key]: val });
  };
  
  const updateHeader = (newData) => {
    onChange({ ...data, ...newData });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Section Header</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={data} onChange={updateHeader} />
        </div>
      </div>

      <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <DraggablePillsList items={data.tags || []} onChange={(v) => updateSection('tags', v)} />
      </div>

      <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 16, paddingTop: 32 }}>
        <MarketChartEditor data={data} onChange={updateHeader} />
      </div>
    </div>
  );
}
