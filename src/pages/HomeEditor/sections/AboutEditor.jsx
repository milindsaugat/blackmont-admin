import React, { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload';

/* ─────────────────────────────────────────────────────────
   Image Slider List
   Backend fields: { _id?, imageUrl, altText }
───────────────────────────────────────────────────────── */
const DraggableSliderList = ({ items = [], onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);

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

  const handleRemove = (index) => {
    if (items.length <= 1) {
      alert('Minimum 1 slide is required.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this slide?')) {
      onChange(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>1. Image Slider</h4>

      {items.map((item, index) => (
        <div
          key={item._id || item.__localId || index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
          onDragEnd={handleDragEnd}
          style={{
            background: 'var(--bg-root)', border: '1px solid var(--border-default)',
            borderRadius: 12, padding: 20, display: 'flex', gap: 20, cursor: 'grab',
            transition: 'border-color 200ms',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-default)'}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GripVertical size={20} color="var(--text-muted)" />
          </div>

          <div style={{ flex: 1, display: 'flex', gap: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
            <div style={{ width: 200, flexShrink: 0 }}>
              <ImageUpload
                value={item.imageUrl}
                onChange={(v) => updateItem(index, 'imageUrl', v)}
                label={`Slide ${index + 1} Image`}
              />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Alt Text</label>
              <input
                type="text"
                value={item.altText || ''}
                onChange={(e) => updateItem(index, 'altText', e.target.value)}
                placeholder="Describe the image..."
                style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
              />
              {item._id && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                  Existing slide — will be removed on save if deleted.
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              onClick={() => handleRemove(index)}
              style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', borderRadius: 8 }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,85,85,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={() => onChange([...items, { imageUrl: '', altText: '', __localId: Date.now() }])}
        style={{ display: 'flex', alignItems: 'center', justifySelf: 'flex-start', width: 'fit-content', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: 'pointer', marginTop: 8 }}
      >
        <Plus size={16} />
        Add New Slide
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Feature Cards List
   Backend fields: { _id?, title, description }
───────────────────────────────────────────────────────── */
const DraggableCardsList = ({ items = [], onChange }) => {
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
      alert('Minimum 2 cards are required.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this card?')) {
      onChange(items.filter((_, i) => i !== index));
      if (expandedIdx === index) setExpandedIdx(null);
    }
  };

  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [key]: value };
    onChange(newItems);
  };

  const handleAdd = () => {
    onChange([...items, { title: '', description: '', __localId: Date.now() }]);
    setExpandedIdx(items.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 className="typo-label" style={{ margin: '24px 0 0 0', color: 'var(--gold)' }}>2. Feature Cards Grid</h4>

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
              borderRadius: 12, overflow: 'hidden', transition: 'border-color 200ms',
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
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ margin: 0, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title || 'Untitled Card'}
                </h4>
                {!isExpanded && (
                  <p style={{ margin: '4px 0 0 0', fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description || 'No description'}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => handleRemove(e, index)}
                style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', opacity: isExpanded ? 1 : 0.4, borderRadius: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,85,85,0.1)'; e.currentTarget.style.opacity = 1; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = isExpanded ? 1 : 0.4; }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {isExpanded && (
              <div style={{ padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ borderTop: '1px solid var(--border-default)', margin: '0 -20px 16px -20px' }} />

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Card Title</span>
                  </label>
                  <input
                    type="text"
                    value={item.title || ''}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    <span>Card Description</span>
                  </label>
                  <textarea
                    value={item.description || ''}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, minHeight: 80, resize: 'vertical', outline: 'none' }}
                    onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
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
        Add New Card
      </button>

      {items.length <= 2 && (
        <p style={{ fontSize: 12, color: 'var(--gold)', marginTop: 8 }}>Minimum 2 cards are required.</p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Main AboutEditor
   Props:
     data    – { title, description, images: [...], cards: [...] }
     onChange – (newData) => void
───────────────────────────────────────────────────────── */
export default function AboutEditor({ data, onChange }) {
  const images = data.images?.length ? data.images : [];
  const cards  = data.cards?.length  ? data.cards  : [
    { title: 'Asset Integrity',       description: 'Maintaining the authenticity, traceability, and proper documentation of physical bullion assets through rigorous verification processes.', __localId: 1 },
    { title: 'Client Ownership',      description: 'Ensuring that clients retain clear ownership and recognition of their underlying gold holdings at all times.',                           __localId: 2 },
    { title: 'Professional Governance', description: 'Operating through disciplined procedures, transparent structures, and responsible asset stewardship practices.',                     __localId: 3 },
    { title: 'Strategic Utilisation', description: 'Supporting clients in managing physical gold in a manner that enhances its practical role within broader asset holdings.',             __localId: 4 },
  ];

  const update = (key, val) => onChange({ ...data, [key]: val });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Text fields ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>Section Text</h4>

        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Section Title</label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => update('title', e.target.value)}
            placeholder="About Blackmont"
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, display: 'block' }}>Section Description</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => update('description', e.target.value)}
            placeholder="A modern precious metals enterprise..."
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, minHeight: 90, resize: 'vertical', outline: 'none' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(212,175,55,0.5)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-default)'}
          />
        </div>
      </div>

      <DraggableSliderList items={images} onChange={(v) => update('images', v)} />
      <DraggableCardsList  items={cards}  onChange={(v) => update('cards',  v)} />
    </div>
  );
}
