import ArrayFieldEditor from './ArrayFieldEditor';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';

export default function SectionForm({ fields, data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });

  /* Pair consecutive text fields into 2-col rows; textarea/array/richtext/image/boolean → full width */
  const groups = [];
  let pending = null;
  for (const f of fields) {
    if (f.type === 'array' || f.type === 'textarea' || f.type === 'richtext' || f.type === 'image' || f.type === 'boolean') {
      if (pending) { groups.push([pending]); pending = null; }
      groups.push([f]);
    } else {
      if (pending) { groups.push([pending, f]); pending = null; }
      else pending = f;
    }
  }
  if (pending) groups.push([pending]);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
      {groups.map((g, gi) => {
        if (g[0].type === 'array') {
          return <ArrayFieldEditor key={g[0].key} label={g[0].label} items={data?.[g[0].key] || []} fields={g[0].fields} onChange={v => set(g[0].key, v)} />;
        }
        return (
          <div key={gi} className={g.length === 2 ? 'grid-2col' : undefined}>
            {g.map(f => {
              const strVal = data?.[f.key] || '';
              const charCount = typeof strVal === 'string' ? strVal.replace(/<[^>]*>?/gm, '').length : 0;
              return (
                <div key={f.key}>
                  <label className="typo-label" style={{ marginBottom: 8, display: 'block', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{f.label}</span>
                  </label>
                  {f.type === 'textarea' ? (
                    <textarea value={strVal} onChange={e => set(f.key, e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}...`}
                      style={{ ...iStyle, minHeight: 120, lineHeight: 1.6, resize: 'vertical' }}
                      onFocus={focus} onBlur={blur} />
                  ) : f.type === 'richtext' ? (
                    <RichTextEditor value={strVal} onChange={v => set(f.key, v)} placeholder={`Enter ${f.label.toLowerCase()}...`} />
                  ) : f.type === 'image' ? (
                    <ImageUpload value={strVal} onChange={v => set(f.key, v)} label={f.label} />
                  ) : f.type === 'boolean' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0' }} onClick={(e) => { e.preventDefault(); set(f.key, !data?.[f.key]); }}>
                      <div style={{
                        width: 44, height: 24, borderRadius: 12, background: data?.[f.key] ? 'var(--gold)' : 'var(--bg-inset)',
                        border: `1px solid ${data?.[f.key] ? 'var(--gold-20)' : 'var(--border-default)'}`,
                        position: 'relative', transition: 'all 200ms'
                      }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', background: data?.[f.key] ? '#000' : 'var(--text-muted)',
                          position: 'absolute', top: 2, left: data?.[f.key] ? 22 : 2, transition: 'all 200ms'
                        }} />
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14 }}>{data?.[f.key] ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  ) : (
                    <input type="text" value={strVal} onChange={e => set(f.key, e.target.value)} placeholder={`Enter ${f.label.toLowerCase()}...`}
                      style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
