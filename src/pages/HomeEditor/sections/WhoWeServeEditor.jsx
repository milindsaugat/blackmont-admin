import { useState } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';

const headerFields = [
  { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
  { key: 'heading', label: 'Heading', type: 'text' },
  { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
];

const inputStyle = {
  width: '100%',
  background: 'var(--bg-surface)',
  border: '1px solid var(--border-default)',
  borderRadius: 8,
  padding: '10px 14px',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
};

const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    onClick={onChange}
    style={{
      width: 44,
      height: 24,
      borderRadius: 12,
      background: checked ? 'var(--gold)' : 'var(--bg-inset)',
      border: `1px solid ${checked ? 'var(--gold-20)' : 'var(--border-default)'}`,
      position: 'relative',
      cursor: 'pointer',
      transition: 'all 200ms',
    }}
  >
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: checked ? '#000' : 'var(--text-muted)',
        position: 'absolute',
        top: 2,
        left: checked ? 22 : 2,
        transition: 'all 200ms',
      }}
    />
  </button>
);

const WhoWeServeCards = ({ items = [], onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [expandedIdx, setExpandedIdx] = useState(null);

  const updateCards = (nextItems) => {
    onChange(nextItems.map((item, index) => ({
      ...item,
      sortOrder: Number(item.sortOrder) || index + 1,
    })));
  };

  const handleAdd = () => {
    const nextItem = {
      icon: 'users',
      title: '',
      description: '',
      sortOrder: items.length + 1,
      isActive: true,
      __localId: Date.now(),
    };

    onChange([...items, nextItem]);
    setExpandedIdx(items.length);
  };

  const handleRemove = (index) => {
    if (window.confirm('Delete this card?')) {
      updateCards(items.filter((_, itemIndex) => itemIndex !== index));
      if (expandedIdx === index) setExpandedIdx(null);
    }
  };

  const updateItem = (index, key, value) => {
    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], [key]: value };
    onChange(nextItems);
  };

  const handleDragStart = (event, index) => {
    setDraggedIdx(index);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;

    const nextItems = [...items];
    const [draggedItem] = nextItems.splice(draggedIdx, 1);
    nextItems.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    updateCards(nextItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h4 className="typo-label" style={{ margin: '0', color: 'var(--gold)' }}>2. Cards</h4>

      {items.map((item, index) => {
        const isExpanded = expandedIdx === index;
        const itemKey = item._id || item.__localId || index;

        return (
          <div
            key={itemKey}
            draggable
            onDragStart={(event) => handleDragStart(event, index)}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragEnd={() => setDraggedIdx(null)}
            style={{ background: 'var(--bg-root)', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}
          >
            <div
              onClick={() => setExpandedIdx(isExpanded ? null : index)}
              style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}
            >
              <GripVertical size={18} color="var(--text-muted)" />
              <span style={{ background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: 'var(--gold)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{ margin: 0, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title || 'Untitled Card'}
                </h4>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
                  Icon: {item.icon || 'users'} / {item.isActive !== false ? 'Active' : 'Inactive'}
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => { event.stopPropagation(); handleRemove(index); }}
                style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', borderRadius: 8 }}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {isExpanded && (
              <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ borderTop: '1px solid var(--border-default)', margin: '0 -20px 0' }} />

                <div className="grid-2col">
                  <div>
                    <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Icon Name</label>
                    <input value={item.icon || ''} onChange={(event) => updateItem(index, 'icon', event.target.value)} style={inputStyle} placeholder="users" />
                  </div>
                  <div>
                    <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Sort Order</label>
                    <input type="number" value={item.sortOrder || index + 1} onChange={(event) => updateItem(index, 'sortOrder', Number(event.target.value))} style={inputStyle} />
                  </div>
                </div>

                <div>
                  <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Title</label>
                  <input value={item.title || ''} onChange={(event) => updateItem(index, 'title', event.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Description</label>
                  <textarea value={item.description || ''} onChange={(event) => updateItem(index, 'description', event.target.value)} style={{ ...inputStyle, minHeight: 110, resize: 'vertical', lineHeight: 1.6 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Toggle checked={item.isActive !== false} onChange={() => updateItem(index, 'isActive', item.isActive === false)} />
                  <span style={{ color: 'var(--text-primary)', fontSize: 14 }}>{item.isActive !== false ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={handleAdd}
        style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: 'pointer', marginTop: 8 }}
      >
        <Plus size={16} />
        Add New Card
      </button>
    </div>
  );
};

export default function WhoWeServeEditor({ data, onChange }) {
  const updateHeader = (newData) => onChange({ ...data, ...newData });
  const updateCards = (cards) => onChange({ ...data, cards });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Section Header</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={data} onChange={updateHeader} />
        </div>
      </div>

      <WhoWeServeCards items={data.cards || []} onChange={updateCards} />
    </div>
  );
}
