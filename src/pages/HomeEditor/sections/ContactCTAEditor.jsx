import React, { useState } from 'react';
import { Save, Check, Loader2 } from 'lucide-react';

const SectionCard = ({ title, number, children }) => {
  return (
    <div style={{ background: 'var(--bg-root)', borderRadius: 12, border: '1px solid var(--border-default)', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-default)', background: 'rgba(212,175,55,0.02)' }}>
        <div style={{ background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: 'var(--gold)', padding: '4px 8px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
          {number}
        </div>
        <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>{title}</h4>
      </div>

      <div style={{ padding: 20 }}>
        {children}
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text', placeholder }) => {
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
  };

  return (
    <div>
      <label className="typo-label" style={{ display: 'block', marginBottom: 8 }}>
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ ...iStyle, minHeight: 100, lineHeight: 1.6, resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={iStyle}
        />
      )}
    </div>
  );
};

export default function ContactCTAEditor({ data, onChange }) {
  const update = (key, value) => {
    onChange({
      ...data,
      [key]: value,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SectionCard title="Card Content" number="01">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 860 }}>
          <InputField
            label="Eyebrow Label"
            value={data.eyebrowLabel}
            onChange={(v) => update('eyebrowLabel', v)}
            placeholder="PRIVATE ENGAGEMENT"
          />

          <InputField
            label="Main Heading"
            value={data.mainHeading}
            onChange={(v) => update('mainHeading', v)}
            placeholder="Speak With Blackmont Capital"
          />

          <InputField
            label="Description Paragraph"
            value={data.description}
            onChange={(v) => update('description', v)}
            type="textarea"
            placeholder="Connect with our team..."
          />
        </div>
      </SectionCard>

      <SectionCard title="CTA Button" number="02">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 860 }}>
          <InputField
            label="Button Label"
            value={data.buttonLabel}
            onChange={(v) => update('buttonLabel', v)}
            placeholder="CONTACT OUR TEAM"
          />

          <InputField
            label="Button Href / Link"
            value={data.buttonHref}
            onChange={(v) => update('buttonHref', v)}
            placeholder="/contact"
          />
        </div>
      </SectionCard>
    </div>
  );
}