import React, { useState } from 'react';
import { GripVertical, Trash2, Plus } from 'lucide-react';

export default function AboutPrinciplesEditor({ data, onChange }) {
  const [expandedIdx, setExpandedIdx] = useState(null);
  const [draggedIdx, setDraggedIdx] = useState(null);


  const defaultSections = [
    {
      id: 1,
      title: "Blackmont Redefining the Role of Gold",
      paragraphs: [
        "Gold has traditionally been held as a passive store of value.",
        "Blackmont Capital advances this paradigm by enabling clients to manage and optimise their bullion holdings actively, transforming physical gold into a dynamic financial asset while preserving its fundamental role as a hedge and store of wealth."
      ]
    }
  ];

  const introText = data?.introText ?? "Based in Malaysia, the Firm empowers institutional and private clients worldwide with innovative strategies for deploying their gold, transforming inert assets into dynamic instruments for wealth preservation and growth. The Firm’s commitment to expertise, integrity, and client-centric solutions defines our approach.";
  const sections = data?.sections?.length ? data.sections : defaultSections;
  const boxedStatement = data?.boxedStatement ?? "Blackmont Capital represents a new standard in precious metals ownership, where security, transparency, and strategy converge. Beyond Bullion, we deliver certainty.";

  const updateData = (updates) => {
    onChange({ ...data, ...updates });
  };

  // ── Drag & Drop ──
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragOver = (index) => {
    if (draggedIdx === null || draggedIdx === index) return;
    const newSections = [...sections];
    const dragged = newSections[draggedIdx];
    newSections.splice(draggedIdx, 1);
    newSections.splice(index, 0, dragged);
    setDraggedIdx(index);
    updateData({ sections: newSections });
  };

  const handleDragEnd = (e) => {
    setDraggedIdx(null);
    e.target.style.opacity = '1';
  };

  // ── CRUD ──
  const updateSection = (index, key, val) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [key]: val };
    updateData({ sections: newSections });
  };

  const handleRemove = (e, index) => {
    e.stopPropagation();
    if (sections.length <= 1) {
      alert('At least 1 section is required.');
      return;
    }
    if (window.confirm('Deleting this section will remove it from the live About page. Continue?')) {
      updateData({ sections: sections.filter((_, i) => i !== index) });
      if (expandedIdx === index) setExpandedIdx(null);
    }
  };

  const handleAdd = () => {
    const newSection = { id: Date.now(), title: '', paragraphs: [''] };
    updateData({ sections: [...sections, newSection] });
    setExpandedIdx(sections.length);
  };

  // Paragraph management
  const updateParagraph = (secIdx, pIdx, value) => {
    const newSections = [...sections];
    const paras = [...(newSections[secIdx].paragraphs || [])];
    paras[pIdx] = value;
    newSections[secIdx].paragraphs = paras;
    updateData({ sections: newSections });
  };

  const addParagraph = (secIdx) => {
    const newSections = [...sections];
    const paras = [...(newSections[secIdx].paragraphs || []), ''];
    newSections[secIdx].paragraphs = paras;
    updateData({ sections: newSections });
  };

  const removeParagraph = (secIdx, pIdx) => {
    const newSections = [...sections];
    const paras = (newSections[secIdx].paragraphs || []).filter((_, i) => i !== pIdx);
    newSections[secIdx].paragraphs = paras;
    updateData({ sections: newSections });
  };



  const iStyle = {
    width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, outline: 'none',
    fontFamily: 'var(--font-body)', transition: 'border-color 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800 }}>

      {/* ── 1. Intro Block ── */}
      <div>
        <h3 className="typo-h3" style={{ color: 'var(--gold)', marginBottom: 16 }}>1. Intro Block</h3>
        <div style={{ background: 'var(--bg-root)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Introduction Text</label>
          <textarea
            value={introText}
            onChange={e => updateData({ introText: e.target.value })}
            style={{ ...iStyle, minHeight: 100, resize: 'vertical', lineHeight: 1.6 }}
            onFocus={focus} onBlur={blur}
            placeholder="Based in Malaysia, the Firm empowers..."
          />
        </div>
      </div>

      {/* ── 2. Content Sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-default)', paddingTop: 24 }}>
        <h3 className="typo-h3" style={{ color: 'var(--gold)' }}>2. Content Sections</h3>
        
        {/* Card list */}
        {sections.map((section, index) => {
          const isExpanded = expandedIdx === index;
          const num = String(index + 1).padStart(2, '0');
          return (
            <div
              key={section.id || index}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
              onDragEnd={handleDragEnd}
              style={{
                background: 'var(--bg-root)', border: '1px solid var(--border-default)',
                borderRadius: 12, overflow: 'hidden', transition: 'border-color 200ms'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
            >
              {/* Row header */}
              <div
                onClick={() => setExpandedIdx(isExpanded ? null : index)}
                style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}
              >
                <div style={{ cursor: 'grab' }}>
                  <GripVertical size={18} color="var(--text-muted)" />
                </div>
                <div style={{ background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: 'var(--gold)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                  SEC {num}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h4 style={{ margin: 0, fontSize: 15, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {section.title || 'Untitled Section'}
                  </h4>
                </div>



                <button
                  onClick={(e) => handleRemove(e, index)}
                  style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', opacity: isExpanded ? 1 : 0.4, borderRadius: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,85,85,0.1)'; e.currentTarget.style.opacity = 1; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = isExpanded ? 1 : 0.4; }}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Expanded fields */}
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ borderTop: '1px solid var(--border-default)', margin: '0 -20px 0 -20px' }} />

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Section Title</label>
                    <input
                      type="text" value={section.title || ''}
                      onChange={e => updateSection(index, 'title', e.target.value)}
                      style={iStyle} onFocus={focus} onBlur={blur}
                      placeholder="e.g. Institutional Approach..."
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Paragraphs</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {(section.paragraphs || []).map((p, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <div style={{ padding: '12px 0', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, width: 24, textAlign: 'center' }}>
                            {pIdx + 1}.
                          </div>
                          <textarea
                            value={p}
                            onChange={e => updateParagraph(index, pIdx, e.target.value)}
                            style={{ ...iStyle, minHeight: 80, resize: 'vertical', lineHeight: 1.6, flex: 1 }}
                            onFocus={focus} onBlur={blur}
                            placeholder="Paragraph content..."
                          />
                          <button
                            onClick={() => removeParagraph(index, pIdx)}
                            style={{ background: 'rgba(255,85,85,0.1)', color: '#ff5555', border: 'none', borderRadius: 8, padding: 10, cursor: 'pointer', marginTop: 4 }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addParagraph(index)}
                        style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 8, padding: '10px 16px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: 'pointer', marginTop: 4, marginLeft: 36 }}
                      >
                        <Plus size={14} /> Add Paragraph
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add button */}
        <button
          onClick={handleAdd}
          style={{
            display: 'flex', alignItems: 'center', width: 'fit-content', gap: 8,
            padding: '12px 20px', background: 'rgba(212,175,55,0.05)',
            border: '1px dashed var(--gold-30)', borderRadius: 8,
            color: 'var(--gold)', cursor: 'pointer', marginTop: 8
          }}
        >
          <Plus size={16} />
          Add New Section
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 24 }}>
        <h3 className="typo-h3" style={{ color: 'var(--gold)', marginBottom: 16 }}>3. Boxed Footer Statement</h3>
        <div style={{ background: 'var(--bg-root)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 20 }}>
          <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Highlight Statement</label>
          <textarea
            value={boxedStatement}
            onChange={e => updateData({ boxedStatement: e.target.value })}
            style={{ ...iStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.6 }}
            onFocus={focus} onBlur={blur}
            placeholder="Blackmont Capital represents a new standard..."
          />
        </div>
      </div>


    </div>
  );
}
