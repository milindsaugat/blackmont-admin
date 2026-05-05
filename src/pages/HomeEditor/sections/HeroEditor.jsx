import React from 'react';
import SectionForm from '../../../components/SectionForm';

const textFields = [
  { key: 'eyebrow', label: 'Eyebrow label text', type: 'text' },
  { key: 'heading', label: 'Main heading', type: 'text' },
  { key: 'description', label: 'Subheading / description paragraph', type: 'richtext' },
  { key: 'isActive', label: 'Show Hero Section', type: 'boolean' },
];

const ctaFields = [
  { key: 'primaryButtonText', label: 'Primary CTA Label', type: 'text' },
  { key: 'primaryButtonLink', label: 'Primary CTA Link', type: 'text' },
  { key: 'secondaryButtonText', label: 'Secondary CTA Label', type: 'text' },
  { key: 'secondaryButtonLink', label: 'Secondary CTA Link', type: 'text' },
];

export default function HeroEditor({ data, onChange }) {
  const update = (updates) => onChange({ ...data, ...updates });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* TEXT CONTENT */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Text Content</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={textFields} data={data} onChange={(v) => update(v)} />
        </div>
      </div>

      {/* CTA BUTTONS */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>2. Call to Action (CTA) Buttons</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={ctaFields} data={data} onChange={(v) => update(v)} />
        </div>
      </div>
    </div>
  );
}
