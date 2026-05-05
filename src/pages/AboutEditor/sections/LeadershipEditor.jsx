import React from 'react';
import { Trash2, Plus } from 'lucide-react';

/* ── Input field helper ── */
const InputField = ({ label, value, onChange, type = 'text', placeholder, rows = 4 }) => {
  const iStyle = {
    width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ marginBottom: 20 }}>
      <label className="typo-label" style={{ display: 'block', marginBottom: 8 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...iStyle, minHeight: rows * 24, lineHeight: 1.7, resize: 'vertical' }}
          onFocus={focus} onBlur={blur} />
      ) : (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={iStyle} onFocus={focus} onBlur={blur} />
      )}
    </div>
  );
};

/* ── Section divider ── */
const SectionDivider = ({ number, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingTop: 8 }}>
    <div style={{
      background: 'var(--gold-10)', border: '1px solid var(--gold-20)',
      color: 'var(--gold)', padding: '4px 10px', borderRadius: 6,
      fontSize: 12, fontWeight: 600, flexShrink: 0
    }}>
      {number}
    </div>
    <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>{title}</h4>
    <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
  </div>
);

/* ═══════════════════════════════════════════════
   LEADERSHIP EDITOR — matches the Leadership page structure
   ═══════════════════════════════════════════════ */
export default function LeadershipEditor({ data = {}, onChange }) {
  const leadership = {
    hero: {
      pageTitle: 'Leadership',
      heroSubtitle: '',
      ...(data.hero || {}),
    },
    introCard: {
      paragraph: '',
      ...(data.introCard || {}),
    },
    expertiseSection: {
      heading: '',
      bulletPoints: [
        'Deep operational expertise across upstream and downstream segments of the bullion industry',
        'Longstanding relationships with miners, refiners, traders, vaulting providers, and institutional counterparties',
        'Proven experience managing market cycles, volatility, and liquidity conditions across different economic environments'
      ],
      ...(data.expertiseSection || {}),
    },
    strategySection: {
      operationalStrategyParagraph: '',
      unifiedPhilosophyLabel: 'UNIFIED PHILOSOPHY',
      unifiedPhilosophyParagraph: '',
      ...(data.strategySection || {}),
    },
    concludingStatement: {
      text: '',
      ...(data.concludingStatement || {}),
    },
  };

  const updateSection = (section, key, val) => {
    if (!onChange) return;

    onChange({
      ...leadership,
      [section]: {
        ...leadership[section],
        [key]: val,
      },
    });
  };

  // Expertise bullet items
  const expertiseItems = Array.isArray(leadership.expertiseSection.bulletPoints)
    ? leadership.expertiseSection.bulletPoints
    : [];

  const updateExpertise = (index, val) => {
    const newItems = [...expertiseItems];
    newItems[index] = val;
    updateSection('expertiseSection', 'bulletPoints', newItems);
  };

  const addExpertise = () => {
    updateSection('expertiseSection', 'bulletPoints', [...expertiseItems, '']);
  };

  const removeExpertise = (index) => {
    updateSection(
      'expertiseSection',
      'bulletPoints',
      expertiseItems.filter((_, i) => i !== index)
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 900 }}>

      {/* ── 01 Hero Section ── */}
      <SectionDivider number="01" title="Hero Section" />
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <InputField
          label="Page Title"
          value={leadership.hero.pageTitle}
          onChange={v => updateSection('hero', 'pageTitle', v)}
          placeholder="e.g. Leadership"
        />
        <InputField
          label="Hero Subtitle"
          value={leadership.hero.heroSubtitle}
          onChange={v => updateSection('hero', 'heroSubtitle', v)}
          type="textarea"
          placeholder="Blackmont Capital is led by a group of seasoned entrepreneurs..."
          rows={3}
        />
      </div>

      {/* ── 02 Introduction Card ── */}
      <SectionDivider number="02" title="Introduction Card" />
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <InputField
          label="Introduction Paragraph"
          value={leadership.introCard.paragraph}
          onChange={v => updateSection('introCard', 'paragraph', v)}
          type="textarea"
          placeholder="This breadth of exposure provides the firm with a holistic, ground-up understanding..."
          rows={5}
        />
      </div>

      {/* ── 03 Team Expertise ── */}
      <SectionDivider number="03" title="Team Expertise Cards" />
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <InputField
          label="Section Heading"
          value={leadership.expertiseSection.heading}
          onChange={v => updateSection('expertiseSection', 'heading', v)}
          placeholder="e.g. The team brings together:"
        />

        <label className="typo-label" style={{ display: 'block', marginBottom: 12 }}>Expertise Bullet Points</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {expertiseItems.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 700, marginTop: 14, flexShrink: 0 }}>
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <textarea
                value={item}
                onChange={e => updateExpertise(index, e.target.value)}
                style={{
                  flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
                  borderRadius: 8, padding: 12, color: '#fff', fontSize: 13, minHeight: 56,
                  resize: 'vertical', fontFamily: 'var(--font-body)', outline: 'none',
                  transition: 'border-color 200ms'
                }}
                placeholder="Enter expertise point..."
                onFocus={e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border-default)'; }}
              />
              <button
                onClick={() => removeExpertise(index)}
                style={{ background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', padding: 8, marginTop: 6 }}
                title="Remove"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          <button
            onClick={addExpertise}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
              background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)',
              borderRadius: 8, color: 'var(--gold)', cursor: 'pointer', fontSize: 13, marginTop: 4
            }}
          >
            <Plus size={14} /> Add Bullet Point
          </button>
        </div>
      </div>

      {/* ── 04 Strategy & Philosophy ── */}
      <SectionDivider number="04" title="Strategy & Philosophy" />
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <InputField
          label="Operational Strategy Paragraph (Left Card)"
          value={leadership.strategySection.operationalStrategyParagraph}
          onChange={v => updateSection('strategySection', 'operationalStrategyParagraph', v)}
          type="textarea"
          placeholder="Having operated across multiple layers of the industry..."
          rows={5}
        />
        <InputField
          label="Unified Philosophy Label"
          value={leadership.strategySection.unifiedPhilosophyLabel}
          onChange={v => updateSection('strategySection', 'unifiedPhilosophyLabel', v)}
          placeholder="UNIFIED PHILOSOPHY"
        />
        <InputField
          label="Unified Philosophy Paragraph (Right Card)"
          value={leadership.strategySection.unifiedPhilosophyParagraph}
          onChange={v => updateSection('strategySection', 'unifiedPhilosophyParagraph', v)}
          type="textarea"
          placeholder="Beyond technical expertise, the group shares a unified philosophy..."
          rows={5}
        />
      </div>

      {/* ── 05 Concluding Statement ── */}
      <SectionDivider number="05" title="Concluding Statement" />
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)' }}>
        <InputField
          label="Conclusion Text (Bottom Highlight Card)"
          value={leadership.concludingStatement.text}
          onChange={v => updateSection('concludingStatement', 'text', v)}
          type="textarea"
          placeholder="Collectively, this leadership foundation positions Blackmont Capital..."
          rows={4}
        />
      </div>

    </div>
  );
}
