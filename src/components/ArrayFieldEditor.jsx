import { Trash2, Plus, Grid3X3 } from 'lucide-react';

export default function ArrayFieldEditor({ label, items = [], fields, onChange }) {
  const simple = fields.length === 1 && fields[0].key === 'value';

  const edit = (i, k, v) => {
    const u = [...items];
    if (simple) u[i] = v; else u[i] = { ...u[i], [k]: v };
    onChange(u);
  };
  const add = () => onChange([...items, simple ? '' : Object.fromEntries(fields.map(f => [f.key, '']))]);
  const del = (i) => onChange(items.filter((_, j) => j !== i));

  /* Pair text fields for 2-col layout inside items */
  const groupFields = () => {
    const g = []; let p = null;
    for (const f of fields) {
      if (f.type === 'textarea') { if (p) { g.push([p]); p = null; } g.push([f]); }
      else { if (p) { g.push([p, f]); p = null; } else p = f; }
    }
    if (p) g.push([p]);
    return g;
  };
  const fg = simple ? null : groupFields();

  const iStyle = {
    width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    borderRadius: 10, padding: '12px 16px', color: '#fff',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-default)', borderRadius: 14, padding: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: items.length > 0 ? 14 : 0 }}>
        <span className="typo-label">{label}</span>
        <button onClick={add} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--gold-10)', border: '1px solid var(--gold-20)', color: '#D4AF37', fontSize: 12, padding: '6px 14px', borderRadius: 6, cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'background 200ms' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.18)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--gold-10)'; }}
        >
          <Plus size={13} />Add Item
        </button>
      </div>

      {/* Empty */}
      {items.length === 0 && (
        <div style={{ border: '1px dashed var(--gold-20)', borderRadius: 12, padding: '36px 20px', textAlign: 'center', background: 'rgba(212,175,55,0.02)', marginTop: 14 }}>
          <Grid3X3 size={28} color="#2a2a2a" style={{ margin: '0 auto 10px' }} />
          <p className="typo-body" style={{ marginBottom: 14 }}>No items added yet</p>
          <button onClick={add} className="ghost-btn" style={{ borderColor: 'var(--gold-20)', color: '#D4AF37' }}>
            <Plus size={13} />Add First Item
          </button>
        </div>
      )}

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{ background: '#131313', border: '1px solid var(--border-default)', borderRadius: 10, padding: 16, position: 'relative', transition: 'border-color 300ms' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(212,175,55,0.15)'; e.currentTarget.querySelector('.del').style.opacity = 1; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.querySelector('.del').style.opacity = 0; }}
          >
            <span className="typo-caption" style={{ position: 'absolute', top: 14, left: 16, fontSize: 10 }}>{String(i + 1).padStart(2, '0')}</span>
            <button className="del" onClick={() => del(i)} style={{ position: 'absolute', top: 10, right: 10, padding: 5, borderRadius: 6, border: 'none', background: 'transparent', color: '#444', cursor: 'pointer', opacity: 0, transition: 'all 200ms' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.background = 'rgba(255,85,85,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#444'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Trash2 size={14} />
            </button>

            <div style={{ paddingTop: 12, paddingLeft: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {simple ? (
                <input type="text" value={item || ''} onChange={e => edit(i, 'value', e.target.value)} placeholder={fields[0].label} style={iStyle} onFocus={focus} onBlur={blur} />
              ) : (
                fg.map((g, gi) => (
                  <div key={gi} className={g.length === 2 ? 'grid-2col' : undefined}>
                    {g.map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>{f.label}</label>
                        {f.type === 'textarea' ? (
                          <textarea value={item?.[f.key] || ''} onChange={e => edit(i, f.key, e.target.value)} placeholder={f.label} style={{ ...iStyle, minHeight: 80, lineHeight: 1.6, resize: 'vertical' }} onFocus={focus} onBlur={blur} />
                        ) : (
                          <input type="text" value={item?.[f.key] || ''} onChange={e => edit(i, f.key, e.target.value)} placeholder={f.label} style={iStyle} onFocus={focus} onBlur={blur} />
                        )}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
