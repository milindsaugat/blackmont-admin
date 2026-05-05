import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ columns, data, onRowClick, currentPage = 1, totalPages = 1, onPageChange }) {
  return (
    <div>
      <div className="card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {columns.map(c => (
                <th key={c.key} className="typo-caption" style={{ textAlign: 'left', padding: '12px 20px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(8,8,8,0.5)', width: c.width }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: 48, color: '#444', fontSize: 13 }}>No records found</td></tr>
            ) : data.map((row, i) => (
              <tr
                key={row.id || i}
                onClick={() => onRowClick?.(row)}
                style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer', transition: 'background 150ms' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                {columns.map(c => (
                  <td key={c.key} style={{ padding: '12px 20px', fontSize: 13, color: '#888' }}>
                    {c.render ? c.render(row[c.key], row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, padding: '0 4px' }}>
          <span className="typo-caption">Page {currentPage} of {totalPages}</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => onPageChange?.(currentPage - 1)} disabled={currentPage <= 1} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid var(--border-default)', background: 'transparent', color: '#555', cursor: 'pointer', opacity: currentPage <= 1 ? 0.3 : 1 }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => onPageChange?.(p)} style={{
                width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontSize: 11, fontWeight: 500,
                background: p === currentPage ? 'var(--gold-10)' : 'transparent',
                color: p === currentPage ? '#D4AF37' : '#555',
                border: `1px solid ${p === currentPage ? 'var(--gold-20)' : 'var(--border-default)'}`,
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
              }}>{p}</button>
            ))}
            <button onClick={() => onPageChange?.(currentPage + 1)} disabled={currentPage >= totalPages} style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid var(--border-default)', background: 'transparent', color: '#555', cursor: 'pointer', opacity: currentPage >= totalPages ? 0.3 : 1 }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
