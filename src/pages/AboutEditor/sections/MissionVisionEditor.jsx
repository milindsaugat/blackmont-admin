import React from 'react';
import { Trash2, Plus } from 'lucide-react';



/* ── Input helper ── */
const InputField = ({ label, value, onChange, type = 'text', placeholder }) => {
  const iStyle = {
    width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  return (
    <div>
      <label className="typo-label" style={{ display: 'block', marginBottom: 8 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...iStyle, minHeight: 120, lineHeight: 1.6, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
      ) : (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={iStyle} onFocus={focus} onBlur={blur} />
      )}
    </div>
  );
};

/* ── Range slider ── */
const RangeSlider = ({ value, onChange, label }) => (
  <div>
    <label className="typo-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span>{label}</span><span style={{ color: 'var(--gold)' }}>{value}%</span>
    </label>
    <input type="range" min={0} max={100} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }} />
  </div>
);

/* ── Section card wrapper ── */
const SectionCard = ({ title, number, children }) => (
  <div style={{ background: 'var(--bg-root)', borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-default)', background: 'rgba(212,175,55,0.02)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: 'var(--gold)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{number}</div>
        <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>{title}</h4>
      </div>
    </div>
    <div style={{ padding: 20 }}>{children}</div>
  </div>
);



/* ═══════════════════════════════════════
   MAIN EDITOR
   ═══════════════════════════════════════ */
export default function MissionVisionEditor({ data, onChange }) {


  const mission = data?.mission || {
    badgeLabel: 'MISSION',
    title: 'Mission',
    description: 'To safeguard and grow client wealth through a disciplined, physically-backed gold framework built on trust, accountability, and long-term value preservation.',
  };

  const vision = data?.vision || {
    badgeLabel: 'VISION',
    title: 'Vision',
    description: 'To be a trusted steward of precious metal wealth, setting the standard for transparency, security, and integrity in gold ownership and asset management across generations.',
  };

  const commitmentBox = data?.commitmentBox || {
    title: 'Blackmont Capital is committed to:',
    items: [
      "Ensuring secure custody and verifiable ownership of physical gold assets",
      "Upholding institutional-grade governance, compliance, and transparency in every transaction",
      "Providing stable, risk-conscious strategies that prioritise capital preservation over speculation",
      "Building enduring client relationships grounded in confidence, discretion, and reliability"
    ],
    footerParagraph: "Through a principled approach and unwavering focus on asset protection, Blackmont Capital serves as a reliable partner in preserving wealth across market cycles and generations."
  };

  const updateSection = (section, key, val) => {
    const current = { mission, vision, commitmentBox, ...data };
    onChange({ ...current, [section]: { ...current[section], [key]: val } });
  };

  const handleCommitmentItemChange = (index, value) => {
    const newItems = [...commitmentBox.items];
    newItems[index] = value;
    updateSection('commitmentBox', 'items', newItems);
  };

  const addCommitmentItem = () => {
    updateSection('commitmentBox', 'items', [...commitmentBox.items, '']);
  };

  const removeCommitmentItem = (index) => {
    const newItems = commitmentBox.items.filter((_, i) => i !== index);
    updateSection('commitmentBox', 'items', newItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>



      {/* ── PART 2: Mission & Vision Cards ── */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Mission & Vision Cards</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Mission Card */}
          <div style={{ background: 'var(--bg-root)', borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-default)', background: 'rgba(212,175,55,0.02)', display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4AF37' }} />
                <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>Mission Card</span>
              </div>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InputField label="Badge label" value={mission.badgeLabel} onChange={v => updateSection('mission', 'badgeLabel', v)} placeholder="e.g. MISSION" />
              <InputField label="Card title" value={mission.title} onChange={v => updateSection('mission', 'title', v)} placeholder="e.g. Mission" />
              <InputField label="Card description" value={mission.description} onChange={v => updateSection('mission', 'description', v)} type="textarea" placeholder="To safeguard and structure..." />
            </div>
          </div>

          {/* Vision Card */}
          <div style={{ background: 'var(--bg-root)', borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-default)', background: 'rgba(212,175,55,0.02)', display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D4AF37' }} />
                <span style={{ color: 'var(--gold)', fontSize: 13, fontWeight: 600 }}>Vision Card</span>
              </div>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <InputField label="Badge label" value={vision.badgeLabel} onChange={v => updateSection('vision', 'badgeLabel', v)} placeholder="e.g. VISION" />
              <InputField label="Card title" value={vision.title} onChange={v => updateSection('vision', 'title', v)} placeholder="e.g. Vision" />
              <InputField label="Card description" value={vision.description} onChange={v => updateSection('vision', 'description', v)} type="textarea" placeholder="To provide a trusted framework..." />
            </div>
          </div>

        </div>
      </div>

      {/* ── PART 3: Commitment Box ── */}
      <SectionCard title="Commitment Box" number="02">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
          <InputField label="Title" value={commitmentBox.title} onChange={v => updateSection('commitmentBox', 'title', v)} placeholder="Blackmont Capital is committed to:" />
          
          <div>
            <label className="typo-label" style={{ display: 'block', marginBottom: 12 }}>Commitment List Items</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {commitmentBox.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleCommitmentItemChange(index, e.target.value)}
                    placeholder="Enter commitment..."
                    style={{ flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none' }}
                  />
                  <button 
                    onClick={() => removeCommitmentItem(index)}
                    style={{ background: 'rgba(255,85,85,0.1)', color: '#ff5555', border: 'none', borderRadius: 8, padding: 10, cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button 
                onClick={addCommitmentItem}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.1)', color: 'var(--gold)', border: '1px dashed var(--gold-30)', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', width: 'fit-content' }}
              >
                <Plus size={14} /> Add Item
              </button>
            </div>
          </div>

          <InputField label="Footer Paragraph" value={commitmentBox.footerParagraph} onChange={v => updateSection('commitmentBox', 'footerParagraph', v)} type="textarea" placeholder="Through a principled approach..." />


        </div>
      </SectionCard>
    </div>
  );
}
