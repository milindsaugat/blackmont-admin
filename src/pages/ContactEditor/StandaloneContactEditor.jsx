import { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Save, Loader2, Check, Clock, GripVertical, Plus, Trash2, ChevronDown, ChevronRight, Link2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { storage } from '../../utils/storage';


const STORAGE_KEY = 'contact_cms';

const defaultData = {
  contactDetails: {
    eyebrow: 'CONTACT DETAILS',
    heading: 'Reach Blackmont',
    rows: [
      { id: 1, label: 'PHONE NUMBER', value: '+60 3-2168 1234', clickable: true, href: 'tel:+60321681234' },
      { id: 2, label: 'EMAIL', value: ' info@blackmontcap.com', clickable: true, href: 'mailto: info@blackmontcap.com' },
      { id: 3, label: 'ADDRESS', value: 'Blackmont Capital Sdn Bhd B-09-03 , Jalan 19/1 3 Two Square, Petaling Jaya 46300 Selangor Malaysia', clickable: false, href: '' },
    ],
  },
  contactForm: {
    heading: 'Contact Us',
    description: 'Use this form to begin a confidential conversation with Blackmont.',
    nameLabel: 'FULL NAME',
    namePlaceholder: 'Enter your name',
    emailLabel: 'EMAIL ADDRESS',
    emailPlaceholder: 'Enter your email',
    messageLabel: 'MESSAGE',
    messagePlaceholder: 'Write your message',
    submitLabel: 'SUBMIT REQUEST',
    submitStyle: 'gold_fill',
    belowNoteText: 'Prefer direct communication? Reach us directly at',
    belowNoteEmail: ' info@blackmontcap.com',
    showBelowNote: true,
    recipientEmail: 'admin@blackmontcapital.com',
    successMessage: 'Thank you for reaching out. A member of our team will respond within 24 hours.',
  },
  contactLocationsHero: {
    bgType: 'image',
    eyebrow: 'CONTACTS & LOCATIONS',
    title: 'Global Access, Structured Engagement',
    description: '<p>Blackmont maintains a professional engagement model for clients seeking institutional precious metals stewardship and strategic dialogue.</p>',
  },
  contactLocationsCards: {
    cards: [
      { id: 1, prefix: 'ACCESS', title: 'Headquarters', content: 'Blackmont Capital Sdn Bhd B-09-03 , Jalan 19/1 3 Two Square, Petaling Jaya 46300 Selangor Malaysia', clickable: false, href: '' },
      { id: 2, prefix: 'ACCESS', title: 'Client Contact', content: ' info@blackmontcap.com', clickable: true, href: 'mailto: info@blackmontcap.com' },
      { id: 3, prefix: 'ACCESS', title: 'Engagement Access', content: 'By appointment only.', clickable: false, href: '' }
    ]
  }
};

/* ─── Section wrapper ─── */
const Section = ({ title, desc, children, onSave, saving, saved, dirty }) => (
  <div style={{ background: '#0a0a0a', border: '1px solid #161616', borderRadius: '20px', overflow: 'hidden' }}>
    <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #161616', background: '#080808' }}>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-display)' }}>{title}</h3>
        {desc && <p style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>{desc}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {dirty && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#D4AF37', display: 'inline-block' }} />}
        <button onClick={onSave} disabled={saving} className="gold-btn" style={{ padding: '8px 18px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', borderRadius: '10px' }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE'}
        </button>
      </div>
    </div>
    <div style={{ padding: '24px 28px' }}>{children}</div>
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = 'text', multiline = false }) => (
  <div style={{ marginBottom: '18px' }}>
    <label style={{ display: 'block', fontSize: '9px', color: '#444', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', marginLeft: '2px' }}>{label}</label>
    {multiline ? (
      <textarea value={value || ''} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', minHeight: '90px', background: '#070707', border: '1px solid #1a1a1a', borderRadius: '12px',
        color: '#ccc', fontSize: '13px', padding: '14px 16px', outline: 'none', fontFamily: 'var(--font-body)', resize: 'vertical',
        transition: 'border-color 0.3s',
      }} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.3)'} onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
    ) : (
      <input type={type} value={value || ''} onChange={onChange} placeholder={placeholder} style={{
        width: '100%', height: '44px', background: '#070707', border: '1px solid #1a1a1a', borderRadius: '12px',
        color: '#ccc', fontSize: '13px', padding: '0 16px', outline: 'none', fontFamily: 'var(--font-body)',
        transition: 'border-color 0.3s',
      }} onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.3)'} onBlur={e => e.target.style.borderColor = '#1a1a1a'} />
    )}
  </div>
);

export default function StandaloneContactEditor() {
  const [tab, setTab] = useState(0);
  const [data, setData] = useState(defaultData);
  const [saving, setSaving] = useState({});
  const [saved, setSaved] = useState({});
  const [dirty, setDirty] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [dragIdx, setDragIdx] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const existing = storage.getPageContent(STORAGE_KEY);
    if (existing) setData({ ...defaultData, ...existing });
  }, []);

  const tabs = [
    { key: 'contactDetails', label: 'Contact Details' },
    { key: 'contactForm', label: 'Contact Form' },
    { key: 'contactLocations', label: 'Contacts & Locations' },
  ];

  const updateBlock = (block, updates) => {
    setData(prev => ({ ...prev, [block]: { ...prev[block], ...updates } }));
    setDirty(prev => ({ ...prev, [block]: true }));
  };

  const saveBlock = async (block) => {
    setSaving(p => ({ ...p, [block]: true }));
    await new Promise(r => setTimeout(r, 300));
    const current = storage.getPageContent(STORAGE_KEY) || {};
    storage.setPageContent(STORAGE_KEY, { ...current, [block]: data[block] });
    setSaving(p => ({ ...p, [block]: false }));
    setSaved(p => ({ ...p, [block]: true }));
    setDirty(p => ({ ...p, [block]: false }));
    setLastSaved(new Date());
    setTimeout(() => setSaved(p => ({ ...p, [block]: false })), 2500);
  };

  const ago = () => {
    if (!lastSaved) return null;
    const s = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    return s < 60 ? 'Just now' : `${Math.floor(s / 60)}m ago`;
  };

  /* ─── CONTACT DETAILS (CRUD rows) ─── */
  const details = data.contactDetails;

  const addRow = () => {
    const newId = Date.now();
    const rows = [...(details.rows || []), { id: newId, label: '', value: '', clickable: false, href: '' }];
    updateBlock('contactDetails', { rows });
    setExpandedRows(p => ({ ...p, [newId]: true }));
  };

  const updateRow = (id, field, val) => {
    const rows = (details.rows || []).map(r => r.id === id ? { ...r, [field]: val } : r);
    updateBlock('contactDetails', { rows });
  };

  const deleteRow = (id) => {
    if (!window.confirm('Delete this contact info row?')) return;
    const rows = (details.rows || []).filter(r => r.id !== id);
    updateBlock('contactDetails', { rows });
  };

  const toggleRow = (id) => setExpandedRows(p => ({ ...p, [id]: !p[id] }));

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const rows = [...(details.rows || [])];
    const [moved] = rows.splice(dragIdx, 1);
    rows.splice(idx, 0, moved);
    updateBlock('contactDetails', { rows });
    setDragIdx(idx);
  };
  const handleDragEnd = () => setDragIdx(null);

  /* ─── CONTACT FORM ─── */
  const form = data.contactForm;
  const updateForm = (field, val) => updateBlock('contactForm', { [field]: val });

  /* ─── CONTACT LOCATIONS (Cards) ─── */
  const locCards = data.contactLocationsCards?.cards || [];

  const addCard = () => {
    if (locCards.length >= 6) return;
    const newId = Date.now();
    const cards = [...locCards, { id: newId, prefix: 'ACCESS', title: '', content: '', clickable: false, href: '' }];
    updateBlock('contactLocationsCards', { cards });
    setExpandedCards(p => ({ ...p, [newId]: true }));
  };

  const updateCard = (id, field, val) => {
    const cards = locCards.map(r => r.id === id ? { ...r, [field]: val } : r);
    updateBlock('contactLocationsCards', { cards });
  };

  const deleteCard = (id) => {
    if (locCards.length <= 2) return;
    if (!window.confirm('Delete this card?')) return;
    const cards = locCards.filter(r => r.id !== id);
    updateBlock('contactLocationsCards', { cards });
  };

  const toggleCard = (id) => setExpandedCards(p => ({ ...p, [id]: !p[id] }));

  const handleDragOverCard = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const cards = [...locCards];
    const [moved] = cards.splice(dragIdx, 1);
    cards.splice(idx, 0, moved);
    updateBlock('contactLocationsCards', { cards });
    setDragIdx(idx);
  };


  const curTab = tabs[tab];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - var(--header-h))' }}>

      {/* ── Header ── */}
      <div style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }} />
          <span className="typo-h1" style={{ fontSize: 18 }}>Contact Page CMS</span>
          <span style={{ color: '#333', margin: '0 2px' }}>/</span>
          <span className="typo-body" style={{ fontSize: 13 }}>{curTab.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {ago() && (
            <span className="typo-caption" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Clock size={12} />Saved: {ago()}
            </span>
          )}
          <a href={curTab.key === 'contactLocations' ? "http://localhost:5173/contactLocations" : "http://localhost:5173/contact"} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', borderRadius: 4, textDecoration: 'none', fontSize: 11, fontWeight: 500, border: '1px solid var(--gold-20)' }}>
            <ExternalLink size={12} /> VIEW LIVE PAGE
          </a>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ height: 46, background: 'var(--bg-inset)', borderBottom: '1px solid var(--border-default)', padding: '0 24px', display: 'flex', alignItems: 'flex-end', gap: 2, flexShrink: 0 }}>
        {tabs.map((t, i) => (
          <button key={t.key} onClick={() => setTab(i)} style={{
            height: 46, padding: '0 20px', fontSize: 13, cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontWeight: tab === i ? 500 : 400,
            color: tab === i ? '#D4AF37' : '#666',
            background: tab === i ? 'rgba(212,175,55,0.04)' : 'transparent',
            border: 'none', borderBottom: `2px solid ${tab === i ? '#D4AF37' : 'transparent'}`,
            borderRadius: tab === i ? '6px 6px 0 0' : 0,
            display: 'flex', alignItems: 'center', gap: 8, transition: 'all 150ms',
          }}>
            {t.label}
            {dirty[t.key] && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#D4AF37' }} />}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-root)', padding: '28px 24px 100px' }}>

        {curTab.key === 'contactDetails' && (
          <div style={{ maxWidth: '700px' }}>
            <Section title="Contact Information Panel" desc="Left-side contact details shown on the frontend" onSave={() => saveBlock('contactDetails')} saving={saving.contactDetails} saved={saved.contactDetails} dirty={dirty.contactDetails}>
              <Field label="Panel Eyebrow" value={details.eyebrow} onChange={e => updateBlock('contactDetails', { eyebrow: e.target.value })} placeholder="CONTACT DETAILS" />
              <Field label="Panel Heading" value={details.heading} onChange={e => updateBlock('contactDetails', { heading: e.target.value })} placeholder="Reach Blackmont" />

              <div style={{ marginTop: '24px', marginBottom: '12px' }}>
                <label style={{ fontSize: '9px', color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase' }}>CONTACT INFO ROWS</label>
              </div>

              {(details.rows || []).map((row, idx) => (
                <div key={row.id}
                  draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOver(e, idx)} onDragEnd={handleDragEnd}
                  style={{
                    background: '#080808', border: '1px solid #1a1a1a', borderRadius: '14px',
                    marginBottom: '10px', overflow: 'hidden',
                    opacity: dragIdx === idx ? 0.5 : 1, transition: 'opacity 0.2s',
                  }}>
                  <div onClick={() => toggleRow(row.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer',
                  }}>
                    <GripVertical size={14} style={{ color: '#333', cursor: 'grab', flexShrink: 0 }} />
                    {expandedRows[row.id] ? <ChevronDown size={14} color="#555" /> : <ChevronRight size={14} color="#555" />}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#ccc', flex: 1 }}>
                      {row.label || 'Untitled Row'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#444', fontFamily: 'var(--font-mono)' }}>
                      {row.value ? row.value.slice(0, 30) : '—'}
                    </span>
                  </div>

                  {expandedRows[row.id] && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid #141414' }}>
                      <div style={{ paddingTop: '16px' }}>
                        <Field label="Label" value={row.label} onChange={e => updateRow(row.id, 'label', e.target.value)} placeholder="PHONE NUMBER" />
                        <Field label="Value" value={row.value} onChange={e => updateRow(row.id, 'value', e.target.value)} placeholder=" info@blackmontcap.com" />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '10px 14px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #141414' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link2 size={13} color="#555" />
                            <span style={{ fontSize: '11px', color: '#888' }}>Make value clickable</span>
                          </div>
                          <button onClick={() => updateRow(row.id, 'clickable', !row.clickable)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: row.clickable ? '#D4AF37' : '#333' }}>
                            {row.clickable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                          </button>
                        </div>

                        {row.clickable && (
                          <Field label="Link (href)" value={row.href} onChange={e => updateRow(row.id, 'href', e.target.value)} placeholder="mailto:hello@... or tel:+60..." />
                        )}

                        <button onClick={() => deleteRow(row.id)} style={{
                          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#ff5555',
                          background: 'rgba(255,85,85,0.04)', border: '1px solid rgba(255,85,85,0.12)', borderRadius: '8px',
                          padding: '8px 14px', cursor: 'pointer', marginTop: '8px',
                        }}>
                          <Trash2 size={12} /> DELETE ROW
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button onClick={addRow} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
                padding: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
                color: '#D4AF37', background: 'rgba(212,175,55,0.03)', border: '1px dashed rgba(212,175,55,0.2)',
                borderRadius: '14px', cursor: 'pointer', marginTop: '6px',
              }}>
                <Plus size={14} /> ADD NEW ROW
              </button>
            </Section>
          </div>
        )}

        {curTab.key === 'contactForm' && (
          <div style={{ maxWidth: '700px' }}>
            <Section title="Contact Form Configuration" desc="Labels, placeholders, and submission settings" onSave={() => saveBlock('contactForm')} saving={saving.contactForm} saved={saved.contactForm} dirty={dirty.contactForm}>
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #141414' }}>
                <label style={{ display: 'block', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>FORM HEADER</label>
                <Field label="Form Heading" value={form.heading} onChange={e => updateForm('heading', e.target.value)} placeholder="Contact Us" />
                <Field label="Form Description" value={form.description} onChange={e => updateForm('description', e.target.value)} placeholder="Use this form..." multiline />
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #141414' }}>
                <label style={{ display: 'block', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>FORM FIELDS</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                  <Field label="Full Name — Label" value={form.nameLabel} onChange={e => updateForm('nameLabel', e.target.value)} placeholder="FULL NAME" />
                  <Field label="Full Name — Placeholder" value={form.namePlaceholder} onChange={e => updateForm('namePlaceholder', e.target.value)} placeholder="Enter your name" />
                  <Field label="Email — Label" value={form.emailLabel} onChange={e => updateForm('emailLabel', e.target.value)} placeholder="EMAIL ADDRESS" />
                  <Field label="Email — Placeholder" value={form.emailPlaceholder} onChange={e => updateForm('emailPlaceholder', e.target.value)} placeholder="Enter your email" />
                  <Field label="Message — Label" value={form.messageLabel} onChange={e => updateForm('messageLabel', e.target.value)} placeholder="MESSAGE" />
                  <Field label="Message — Placeholder" value={form.messagePlaceholder} onChange={e => updateForm('messagePlaceholder', e.target.value)} placeholder="Write your message" />
                </div>
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #141414' }}>
                <label style={{ display: 'block', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>SUBMIT BUTTON</label>
                <Field label="Button Label" value={form.submitLabel} onChange={e => updateForm('submitLabel', e.target.value)} placeholder="SUBMIT REQUEST" />
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '9px', color: '#444', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', marginLeft: '2px' }}>Button Style</label>
                  <select value={form.submitStyle || 'gold_fill'} onChange={e => updateForm('submitStyle', e.target.value)} style={{
                    width: '100%', height: '44px', background: '#070707', border: '1px solid #1a1a1a', borderRadius: '12px',
                    color: '#ccc', fontSize: '13px', padding: '0 16px', outline: 'none', fontFamily: 'var(--font-body)', appearance: 'none',
                  }}>
                    <option value="gold_fill">Gold Fill (Default)</option>
                    <option value="white_outline">White Outline</option>
                    <option value="dark_fill">Dark Fill</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #141414' }}>
                <label style={{ display: 'block', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>BELOW-FORM NOTE</label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', padding: '12px 14px', background: '#070707', borderRadius: '10px', border: '1px solid #141414' }}>
                  <span style={{ fontSize: '12px', color: '#888' }}>Show note below submit button</span>
                  <button onClick={() => updateForm('showBelowNote', !form.showBelowNote)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: form.showBelowNote ? '#D4AF37' : '#333' }}>
                    {form.showBelowNote ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>
                {form.showBelowNote && (
                  <>
                    <Field label="Note Text" value={form.belowNoteText} onChange={e => updateForm('belowNoteText', e.target.value)} placeholder="Prefer direct communication?" />
                    <Field label="Clickable Email Link" value={form.belowNoteEmail} onChange={e => updateForm('belowNoteEmail', e.target.value)} placeholder="info@blackmontcap.com" />
                  </>
                )}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '9px', color: '#D4AF37', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>SUBMISSION SETTINGS</label>
                <Field label="Recipient Email" value={form.recipientEmail} onChange={e => updateForm('recipientEmail', e.target.value)} placeholder="admin@blackmontcapital.com" type="email" />
                <Field label="Success Message" value={form.successMessage} onChange={e => updateForm('successMessage', e.target.value)} placeholder="Thank you for reaching out..." multiline />
              </div>
            </Section>
          </div>
        )}

        {curTab.key === 'contactLocations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>



            {/* ACCESS CARDS SECTION */}
            <Section title="Access Cards" desc="Manage the location and access information cards" onSave={() => saveBlock('contactLocationsCards')} saving={saving.contactLocationsCards} saved={saved.contactLocationsCards} dirty={dirty.contactLocationsCards}>
              <div style={{ marginBottom: '16px' }}>
                {locCards.length >= 6 && (
                  <div style={{ padding: '12px 16px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-20)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '12px', marginBottom: '16px' }}>
                    <AlertCircle size={14} /> Maximum of 6 cards reached.
                  </div>
                )}
                {locCards.length <= 2 && (
                  <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', color: '#aaa', fontSize: '12px', marginBottom: '16px' }}>
                    <AlertCircle size={14} /> Minimum 2 cards required for layout.
                  </div>
                )}
              </div>

              {locCards.map((card, idx) => (
                <div key={card.id}
                  draggable onDragStart={() => handleDragStart(idx)} onDragOver={e => handleDragOverCard(e, idx)} onDragEnd={handleDragEnd}
                  style={{
                    background: '#080808', border: '1px solid #1a1a1a', borderRadius: '14px',
                    marginBottom: '10px', overflow: 'hidden',
                    opacity: dragIdx === idx ? 0.5 : 1, transition: 'opacity 0.2s',
                  }}>
                  <div onClick={() => toggleCard(card.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer',
                  }}>
                    <GripVertical size={14} style={{ color: '#333', cursor: 'grab', flexShrink: 0 }} />
                    {expandedCards[card.id] ? <ChevronDown size={14} color="#555" /> : <ChevronRight size={14} color="#555" />}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span style={{ fontSize: '10px', color: '#D4AF37', background: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.1em' }}>
                        {card.prefix || 'ACCESS'} 0{idx + 1}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#ccc' }}>
                        {card.title || 'Untitled Card'}
                      </span>
                    </div>
                  </div>

                  {expandedCards[card.id] && (
                    <div style={{ padding: '0 16px 16px', borderTop: '1px solid #141414' }}>
                      <div style={{ paddingTop: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                          <Field label="Badge Prefix Text" value={card.prefix} onChange={e => updateCard(card.id, 'prefix', e.target.value)} placeholder="ACCESS" />
                          <Field label="Card Title" value={card.title} onChange={e => updateCard(card.id, 'title', e.target.value)} placeholder="Headquarters" />
                        </div>
                        <Field label="Card Content" value={card.content} onChange={e => updateCard(card.id, 'content', e.target.value)} placeholder="Blackmont Capital Sdn Bhd B-09-03 , Jalan 19/1 3 Two Square, Petaling Jaya 46300 Selangor Malaysia" multiline />

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '10px 14px', background: '#0a0a0a', borderRadius: '10px', border: '1px solid #141414' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Link2 size={13} color="#555" />
                            <span style={{ fontSize: '11px', color: '#888' }}>Make content clickable (Link)</span>
                          </div>
                          <button onClick={() => updateCard(card.id, 'clickable', !card.clickable)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: card.clickable ? '#D4AF37' : '#333' }}>
                            {card.clickable ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                          </button>
                        </div>

                        {card.clickable && (
                          <Field label="Link (href)" value={card.href} onChange={e => updateCard(card.id, 'href', e.target.value)} placeholder="mailto:, tel:, or URL" />
                        )}

                        <button onClick={() => deleteCard(card.id)} disabled={locCards.length <= 2} style={{
                          display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: locCards.length <= 2 ? '#666' : '#ff5555',
                          background: locCards.length <= 2 ? 'rgba(255,255,255,0.02)' : 'rgba(255,85,85,0.04)',
                          border: `1px solid ${locCards.length <= 2 ? '#333' : 'rgba(255,85,85,0.12)'}`,
                          borderRadius: '8px', padding: '8px 14px', cursor: locCards.length <= 2 ? 'not-allowed' : 'pointer', marginTop: '8px',
                        }}>
                          <Trash2 size={12} /> DELETE CARD
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button onClick={addCard} disabled={locCards.length >= 6} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%',
                padding: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
                color: locCards.length >= 6 ? '#666' : '#D4AF37',
                background: locCards.length >= 6 ? 'transparent' : 'rgba(212,175,55,0.03)',
                border: `1px dashed ${locCards.length >= 6 ? '#333' : 'rgba(212,175,55,0.2)'}`,
                borderRadius: '14px', cursor: locCards.length >= 6 ? 'not-allowed' : 'pointer', marginTop: '6px',
              }}>
                <Plus size={14} /> ADD NEW CARD
              </button>
            </Section>

          </div>
        )}

      </div>
    </div>
  );
}
