import SectionForm from '../../../components/SectionForm';

export default function LegalTermsEditor({ data, onChange, title = 'Terms & Conditions' }) {
  const update = (u) => onChange({ ...data, ...u });
  const fields = [
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
    lineHeight: 1.65,
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>{title.toUpperCase()} HEADER</h4>
        </div>
        <SectionForm fields={fields} data={data} onChange={v => update(v)} />
      </section>

      <section style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 16, border: '1px solid var(--border-default)' }}>
        <div style={{ marginBottom: 24 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>{title.toUpperCase()} CONTENT</h4>
        </div>

        <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Full Content</label>
        <textarea
          value={data.content || ''}
          onChange={e => update({ content: e.target.value })}
          placeholder={`Enter ${title.toLowerCase()} content...`}
          style={{ ...iStyle, minHeight: 420 }}
          onFocus={focus}
          onBlur={blur}
        />
      </section>
    </div>
  );
}
