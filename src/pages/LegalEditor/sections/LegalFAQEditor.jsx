import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';

export default function LegalFAQEditor({ data, onChange, saving }) {
  const update = (u) => onChange({ ...data, ...u });
  const faqItems = data.faqs || [];
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);

 const headerFields = [
  { key: 'eyebrowLabel', label: 'Eyebrow Label', type: 'text' },
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'subtitle', label: 'Subtitle', type: 'textarea' },
  { key: 'isActive', label: 'Published', type: 'boolean' },
];

  const iStyle = {
    width: '100%',
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 10,
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  const addFaq = () => {
    const newItem = { id: Date.now(), question: '', answer: '' };
    update({ faqs: [newItem, ...faqItems] });
    setExpandedIdx(newItem.id);
  };

  const removeFaq = (index) => {
    if (window.confirm('Delete FAQ?')) {
      update({ faqs: faqItems.filter((_, idx) => idx !== index) });
    }
  };

  const updateFaq = (index, field, value) => {
    const nextItems = [...faqItems];
    nextItems[index] = { ...nextItems[index], [field]: value };
    update({ faqs: nextItems });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 1: SECTION HEADER</h4>
        </div>
        <SectionForm fields={headerFields} data={data} onChange={v => update(v)} />
      </section>

      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 2: FAQ ACCORDION ITEMS</h4>
        </div>

        <button onClick={addFaq} className="gold-btn" style={{ marginBottom: 24 }}>
          <Plus size={16} /> Add New FAQ
        </button>

        {faqItems.length === 0 ? (
          <div style={{ border: '1px dashed var(--border-default)', borderRadius: 12, padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
            No FAQ items yet. Add the first question to begin.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqItems.map((item, index) => {
              const itemKey = item.id || `${item.question}-${index}`;
              const isExpanded = expandedIdx === itemKey;

              return (
                <div
                  key={itemKey}
                  draggable
                  onDragStart={e => { setDraggedIdx(index); e.dataTransfer.effectAllowed = 'move'; }}
                  onDragOver={e => {
                    e.preventDefault();
                    if (draggedIdx === null || draggedIdx === index) return;
                    const nextItems = [...faqItems];
                    const dragged = nextItems[draggedIdx];
                    nextItems.splice(draggedIdx, 1);
                    nextItems.splice(index, 0, dragged);
                    setDraggedIdx(index);
                    update({ faqs: nextItems });
                  }}
                  onDragEnd={() => setDraggedIdx(null)}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}
                >
                  <div onClick={() => setExpandedIdx(isExpanded ? null : itemKey)} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                    <GripVertical size={18} color="var(--text-muted)" />
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: item.question ? '#fff' : '#666' }}>{item.question || 'New FAQ Question'}</span>
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-default)', marginTop: 4 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
                        <div>
                          <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Question</label>
                          <input type="text" value={item.question || ''} onChange={e => updateFaq(index, 'question', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} />
                        </div>
                        <div>
                          <label className="typo-label" style={{ marginBottom: 6, display: 'block', fontSize: 11 }}>Answer</label>
                          <textarea value={item.answer || ''} onChange={e => updateFaq(index, 'answer', e.target.value)} style={{ ...iStyle, minHeight: 120 }} onFocus={focus} onBlur={blur} />
                        </div>
                        <button onClick={() => removeFaq(index)} style={{ alignSelf: 'flex-start', color: '#ff5555', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Trash2 size={14} /> Delete FAQ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!saving && data.updatedAt && (
          <p className="typo-caption" style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={12} /> Last updated from backend
          </p>
        )}
      </section>
    </div>
  );
}
