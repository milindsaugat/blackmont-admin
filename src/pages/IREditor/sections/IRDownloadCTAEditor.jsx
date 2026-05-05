import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, RefreshCw } from 'lucide-react';

const btnStyles = ['Outlined', 'Gold Fill', 'Dark Fill'];

export default function IRDownloadCTAEditor({ data, onChange }) {
  const update = (u) => onChange({ ...data, ...u });
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  const linkType = data.linkType || 'url';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      update({ uploadedFile: reader.result, uploadedFileName: file.name, uploadedFileSize: (file.size / 1024).toFixed(1) + ' KB' });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ background: 'var(--bg-root)', padding: 24, borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Button Label */}
        <div>
          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Button Label</label>
          <input type="text" value={data.btnLabel || ''} onChange={e => update({ btnLabel: e.target.value })} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="e.g. Download Investor Overview" />
        </div>


        {/* Link Type Toggle */}
        <div>
          <label className="typo-label" style={{ marginBottom: 12, display: 'block' }}>Link Type</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => update({ linkType: 'upload' })}
              style={{ flex: 1, padding: 12, borderRadius: 8, background: linkType === 'upload' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: linkType === 'upload' ? 'var(--gold)' : '#888', border: `1px solid ${linkType === 'upload' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <UploadCloud size={16} /> Upload File
            </button>
            <button onClick={() => update({ linkType: 'url' })}
              style={{ flex: 1, padding: 12, borderRadius: 8, background: linkType === 'url' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: linkType === 'url' ? 'var(--gold)' : '#888', border: `1px solid ${linkType === 'url' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              External URL
            </button>
          </div>
        </div>

        {/* Upload File */}
        {linkType === 'upload' && (
          <div>
            {data.uploadedFileName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'var(--bg-surface)', borderRadius: 8, border: '1px solid var(--border-default)' }}>
                <FileText size={24} color="var(--gold)" />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: '#fff' }}>{data.uploadedFileName}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{data.uploadedFileSize}</p>
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-30)', borderRadius: 6, color: 'var(--gold)', cursor: 'pointer', fontSize: 11 }}>
                  <RefreshCw size={12} /> Replace
                </button>
                <button onClick={() => update({ uploadedFile: '', uploadedFileName: '', uploadedFileSize: '' })} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'rgba(255,85,85,0.1)', border: '1px solid rgba(255,85,85,0.3)', borderRadius: 6, color: '#ff5555', cursor: 'pointer', fontSize: 11 }}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            ) : (
              <div style={{ border: '1px dashed var(--gold-30)', padding: 32, borderRadius: 12, textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
                <UploadCloud size={32} color="var(--gold)" style={{ margin: '0 auto 12px' }} />
                <h4 className="typo-h1" style={{ fontSize: 16, marginBottom: 8 }}>Upload Document</h4>
                <p className="typo-small" style={{ marginBottom: 16 }}>PDF, DOC, or other document files</p>
                <button onClick={() => fileRef.current?.click()} className="gold-btn" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Select File'}
                </button>
              </div>
            )}
            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" ref={fileRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          </div>
        )}

        {/* External URL */}
        {linkType === 'url' && (
          <div>
            <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>External URL</label>
            <input type="text" value={data.externalUrl || ''} onChange={e => update({ externalUrl: e.target.value })} style={iStyle} onFocus={focus} onBlur={blur} onMouseEnter={hover} onMouseLeave={unhover} placeholder="https://example.com/investor-overview.pdf" />
          </div>
        )}

        {/* Toggles */}
        <div style={{ display: 'flex', gap: 32, background: 'var(--bg-surface)', padding: '16px 20px', borderRadius: 8, border: '1px solid var(--border-default)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); update({ openNewTab: data.openNewTab === false ? true : data.openNewTab === undefined ? false : !data.openNewTab }); }}>
            <div style={{ width: 40, height: 20, borderRadius: 12, background: (data.openNewTab !== false) ? 'var(--gold)' : 'var(--bg-inset)', border: `1px solid ${(data.openNewTab !== false) ? 'var(--gold-20)' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: (data.openNewTab !== false) ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: (data.openNewTab !== false) ? 22 : 2, transition: 'all 200ms' }} />
            </div>
            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>Open in new tab</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={e => { e.preventDefault(); update({ visible: data.visible === false ? true : data.visible === undefined ? false : !data.visible }); }}>
            <div style={{ width: 40, height: 20, borderRadius: 12, background: (data.visible !== false) ? '#4caf50' : 'var(--bg-inset)', border: `1px solid ${(data.visible !== false) ? '#4caf50' : 'var(--border-default)'}`, position: 'relative', transition: 'all 200ms' }}>
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: (data.visible !== false) ? '#000' : 'var(--text-muted)', position: 'absolute', top: 2, left: (data.visible !== false) ? 22 : 2, transition: 'all 200ms' }} />
            </div>
            <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>Show button on frontend</span>
          </label>
        </div>

        {/* Preview */}
        <div>
          <label className="typo-label" style={{ marginBottom: 12, display: 'block' }}>PREVIEW</label>
          <div style={{ padding: '32px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 12, border: '1px solid var(--border-default)', opacity: (data.visible !== false) ? 1 : 0.4, transition: 'opacity 300ms' }}>
            <span style={{
              display: 'inline-block', padding: '12px 28px', borderRadius: 8, fontSize: 13, fontWeight: 600, letterSpacing: '0.12em', cursor: 'default',
              ...(data.btnStyle === 'Gold Fill' ? { background: 'var(--gold)', color: '#000', border: '1px solid var(--gold)' }
                : data.btnStyle === 'Dark Fill' ? { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }
                : { background: 'transparent', color: 'var(--gold)', border: '1px solid var(--gold)' })
            }}>
              {data.btnLabel || 'Download Investor Overview'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
