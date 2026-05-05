import React, { useState } from 'react';
import { GripVertical, Trash2, Plus, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import ImageUpload from '../../../components/ImageUpload';
import WysiwygEditor from '../../../components/WysiwygEditor';







const headerFields = [
  { key: 'sectionEyebrowLabel', label: 'Section eyebrow label', type: 'text' },
  { key: 'sectionHeading', label: 'Section heading', type: 'text' },
  { key: 'sectionDescription', label: 'Section description paragraph', type: 'textarea' },
  { key: 'disclaimerText', label: 'Disclaimer text', type: 'text' },
];

export default function NewsroomEditor({ data, onChange }) {


  // Articles State
  const articles = data.articles || [];

  const update = (updates) => onChange({ ...data, ...updates });

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

  const handleCardDragStart = (e, index) => {
    setDraggedCardIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleCardDragOver = (index) => {
    if (draggedCardIdx === null || draggedCardIdx === index) return;
    const newItems = [...articles];
    const draggedItem = newItems[draggedCardIdx];
    newItems.splice(draggedCardIdx, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedCardIdx(index);
    update({ articles: newItems });
  };

  const handleCardDragEnd = (e) => {
    setDraggedCardIdx(null);
    e.target.style.opacity = '1';
  };

  const addArticle = () => {
    const newCard = {
      id: `new-${Date.now()}`,
      title: '',
      categoryPrefix: 'COMMENTARY',
      excerpt: '',
      date: '',
      slug: '',
      readMoreLink: '',
      isPublished: true,
      thumbnail: '',
    };
    update({ articles: [newCard, ...articles] });
    setExpandedCard(newCard.id);
  };

  const removeArticle = (index) => {
    if (window.confirm("Deleting this news article will remove it permanently. Continue?")) {
      const newItems = articles.filter((_, i) => i !== index);
      update({ articles: newItems });
    }
  };

  const updateArticle = (index, field, val) => {
    const newItems = [...articles];
    newItems[index] = { ...newItems[index], [field]: val };
    update({ articles: newItems });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      


      {/* PART 2: ARTICLES SECTION HEADER */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>PART 1: ARTICLES SECTION HEADER</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={headerFields} data={data} onChange={(v) => update(v)} />
        </div>
      </div>

      {/* PART 3: NEWSROOM ARTICLES CRUD */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>PART 2: NEWSROOM ARTICLES</h4>
          <div style={{ background: 'rgba(212,175,55,0.1)', padding: '6px 12px', borderRadius: 20, border: '1px solid var(--gold-30)' }}>
            <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>Newsroom Articles ({articles.length})</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-root)', padding: '24px', borderRadius: 12, border: '1px solid var(--border-default)' }}>
          
          <button 
            onClick={addArticle}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: 'var(--gold)', borderRadius: 8, color: '#000', cursor: 'pointer', marginBottom: 24, fontWeight: 600, border: 'none' }}
          >
            <Plus size={16} />
            Add New Article
          </button>

          {articles.length === 0 && (
            <div style={{ color: 'var(--text-muted)', fontSize: 14, fontStyle: 'italic' }}>
              No articles added yet.
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {articles.map((article, index) => {
              const cardId = article.id || article._id;
              const isExpanded = expandedCard === cardId;
              const badgeNum = (index + 1).toString().padStart(2, '0');
              const displayCategory = article.categoryPrefix || `COMMENTARY ${badgeNum}`;
              
              return (
                <div 
                  key={cardId}
                  draggable
                  onDragStart={(e) => handleCardDragStart(e, index)}
                  onDragOver={(e) => { e.preventDefault(); handleCardDragOver(index); }}
                  onDragEnd={handleCardDragEnd}
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, overflow: 'hidden' }}
                >
                  {/* Accordion Header */}
                  <div 
                    onClick={() => setExpandedCard(isExpanded ? null : cardId)}
                    style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', background: isExpanded ? 'rgba(212,175,55,0.02)' : 'transparent' }}
                  >
                    <GripVertical size={18} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                    
                    {/* Thumbnail Summary */}
                    <div style={{ width: 40, height: 40, borderRadius: 4, background: 'var(--bg-inset)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-default)' }}>
                      {article.thumbnail ? (
                        <img src={article.thumbnail} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ImageIcon size={16} color="var(--text-muted)" style={{ margin: '11px' }} />
                      )}
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: article.title ? '#fff' : '#666' }}>
                          {article.title || 'Untitled Article'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ color: 'var(--gold)' }}>{displayCategory}</span>
                        <span>•</span>
                        <span>{article.date || 'No Date'}</span>
                        {!article.isPublished && <span style={{ color: '#ff5555', border: '1px solid #ff5555', padding: '0 6px', borderRadius: 4, fontSize: 10 }}>DRAFT</span>}
                      </div>
                    </div>

                    {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
                  </div>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid var(--border-default)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
                        
                        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                          <div style={{ width: 180, flexShrink: 0 }}>
                            <ImageUpload value={article.thumbnail} onChange={v => updateArticle(index, 'thumbnail', v)} label="Thumbnail Image" />
                          </div>
                          
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                              <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Title</label>
                              <input type="text" value={article.title || ''} onChange={e => updateArticle(index, 'title', e.target.value)} style={{...iStyle, fontWeight: 500}} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="Article title" />
                            </div>
                            
                            <div style={{ display: 'flex', gap: 16 }}>
                              <div style={{ flex: 1 }}>
                                <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Category Prefix</label>
                                <input type="text" value={article.categoryPrefix || ''} onChange={e => updateArticle(index, 'categoryPrefix', e.target.value.toUpperCase())} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. COMMENTARY" />
                              </div>
                              <div style={{ flex: 1 }}>
                                <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Date</label>
                                <input type="date" value={article.date || ''} onChange={e => updateArticle(index, 'date', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Excerpt / Description</label>
                          <WysiwygEditor value={article.excerpt || ''} onChange={val => updateArticle(index, 'excerpt', val)} placeholder="Write article content here..." />
                        </div>

                        <div>
                          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Read More Link / Slug</label>
                          <input type="text" value={article.slug || ''} onChange={e => updateArticle(index, 'slug', e.target.value)} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="/newsroom/article-name" />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-root)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                          
                          <div style={{ display: 'flex', gap: 32 }}>
                            {/* Published Toggle */}
                            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={(e) => { e.preventDefault(); updateArticle(index, 'isPublished', !article.isPublished); }}>
                              <div style={{ width: 40, height: 20, borderRadius: 12, background: article.isPublished ? '#4caf50' : 'var(--bg-inset)', border: `1px solid ${article.isPublished ? '#4caf50' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: article.isPublished ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: article.isPublished ? 22 : 2, transition: 'all 200ms' }} />
                              </div>
                              <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>Published</span>
                            </label>
                          </div>

                          <button 
                            onClick={() => removeArticle(index)}
                            title="Delete Article"
                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: 13 }}
                          >
                            <Trash2 size={14} /> Delete Article
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
