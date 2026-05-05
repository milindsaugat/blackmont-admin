import React from 'react';
import SectionForm from '../../../components/SectionForm';

const ctaFields = [
  { key: 'eyebrow', label: 'Eyebrow label', type: 'text' },
  { key: 'heading', label: 'Heading', type: 'text' },
  { key: 'description', label: 'Description paragraph', type: 'textarea' },
  { key: 'btnLabel', label: 'CTA button label', type: 'text' },
  { key: 'btnLink', label: 'CTA button link', type: 'text' },
];

const btnStyles = ['Gold Fill', 'White Outline', 'Dark Outline'];

export default function CareersFutureCTAEditor({ data, onChange }) {
  const update = (u) => onChange({ ...data, ...u });

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <SectionForm fields={ctaFields} data={data} onChange={v => update(v)} />


        {/* Toggles */}
        <div style={{ display: 'flex', gap: 32, background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
          {/* Open in new tab */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); update({ openNewTab: !data.openNewTab }); }}>
            <div style={{ width: 40, height: 20, borderRadius: 12, background: data.openNewTab ? 'var(--gold)' : 'var(--bg-inset)', border: `1px solid ${data.openNewTab ? 'var(--gold-20)' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: data.openNewTab ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: data.openNewTab ? 22 : 2, transition: 'all 200ms' }} />
            </div>
            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>Open in new tab</span>
          </label>

          {/* Show/Hide section */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); update({ visible: data.visible === false ? true : data.visible === undefined ? false : !data.visible }); }}>
            <div style={{ width: 40, height: 20, borderRadius: 12, background: (data.visible !== false) ? '#4caf50' : 'var(--bg-inset)', border: `1px solid ${(data.visible !== false) ? '#4caf50' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: (data.visible !== false) ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: (data.visible !== false) ? 22 : 2, transition: 'all 200ms' }} />
            </div>
            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>Show CTA section on frontend</span>
          </label>
        </div>

        {/* Preview */}
        <div>
          <label className="typo-label" style={{ marginBottom: 12, display: 'block' }}>PREVIEW</label>
          <div style={{ background: '#111', borderRadius: 16, padding: '40px 32px', textAlign: 'center', border: '1px solid var(--border-default)', opacity: (data.visible !== false) ? 1 : 0.4, transition: 'opacity 300ms' }}>
            {data.eyebrow && <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.7)', marginBottom: 8 }}>{data.eyebrow}</p>}
            <h3 style={{ fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{data.heading || 'Heading preview'}</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto 20px', lineHeight: 1.6 }}>{data.description || 'Description preview...'}</p>
            <span style={{
              display: 'inline-block', padding: '10px 24px', borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em',
              ...(data.btnStyle === 'White Outline' ? { background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff' }
                : data.btnStyle === 'Dark Outline' ? { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#999' }
                : { background: 'var(--gold)', color: '#000', border: '1px solid var(--gold)' })
            }}>{data.btnLabel || 'CONTACT BLACKMONT'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
