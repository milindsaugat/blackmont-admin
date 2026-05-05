import React, { useState, useRef } from 'react';
import { Trash2, Plus, UploadCloud, Video, Image as ImageIcon, Layers, GripVertical } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import ImageUpload from '../../../components/ImageUpload';

const DraggableSlider = ({ items = [], onChange }) => {
  const [di, setDi] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map((item, index) => (
        <div key={item.id || index} draggable
          onDragStart={e => { setDi(index); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { e.target.style.opacity = '0.5'; }, 0); }}
          onDragOver={e => { e.preventDefault(); if (di === null || di === index) return; const n = [...items]; const d = n[di]; n.splice(di, 1); n.splice(index, 0, d); setDi(index); onChange(n); }}
          onDragEnd={e => { setDi(null); e.target.style.opacity = '1'; }}
          style={{ background: 'var(--bg-root)', border: '1px solid var(--border-default)', borderRadius: 12, padding: 16, display: 'flex', gap: 16, cursor: 'grab', alignItems: 'center' }}>
          <GripVertical size={20} color="var(--text-muted)" />
          <div style={{ width: 160, flexShrink: 0 }}><ImageUpload value={item.src} onChange={v => { const n = [...items]; n[index] = { ...n[index], src: v }; onChange(n); }} label={`Slide ${index + 1}`} /></div>
          <div style={{ flex: 1 }} />
          <button onClick={() => onChange(items.filter((_, i) => i !== index))} style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', borderRadius: 8 }}><Trash2 size={18} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, { src: '', id: Date.now() }])} disabled={items.length >= 10}
        style={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: items.length >= 10 ? 'not-allowed' : 'pointer', opacity: items.length >= 10 ? 0.5 : 1 }}>
        <Plus size={16} /> Add New Slide
      </button>
    </div>
  );
};

const VideoUpload = ({ videoUrl, videoFile, videoSource, onChange }) => {
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return; setError('');
    const url = URL.createObjectURL(file);
    const vid = document.createElement('video'); vid.preload = 'metadata';
    vid.onloadedmetadata = () => { window.URL.revokeObjectURL(url); if (vid.duration > 15) { setError('Video exceeds 15s limit.'); } else { const r = new FileReader(); r.onloadend = () => onChange({ videoSource: 'upload', videoFile: r.result, videoUrl }); r.readAsDataURL(file); } };
    vid.src = url;
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {['upload', 'link'].map(s => (
          <button key={s} onClick={() => onChange({ videoSource: s, videoFile, videoUrl })}
            style={{ flex: 1, padding: 12, borderRadius: 8, background: videoSource === s ? 'var(--gold)' : 'var(--bg-surface)', color: videoSource === s ? '#000' : '#fff', border: `1px solid ${videoSource === s ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', fontWeight: 500 }}>
            {s === 'upload' ? 'Local Upload' : 'External Link'}
          </button>
        ))}
      </div>
      {videoSource === 'upload' ? (
        <div style={{ border: '1px dashed var(--gold-30)', padding: 32, borderRadius: 12, textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
          <UploadCloud size={32} color="var(--gold)" style={{ margin: '0 auto 12px' }} />
          <h4 className="typo-h1" style={{ fontSize: 16, marginBottom: 8 }}>Upload Video</h4>
          <p className="typo-small" style={{ marginBottom: 16 }}>Max 15 seconds · MP4 recommended</p>
          <input type="file" accept="video/*" ref={fileRef} onChange={handleFile} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} className="gold-btn">Select Video File</button>
          {error && <p style={{ color: '#ff5555', fontSize: 13, marginTop: 16 }}>{error}</p>}
          {videoFile && !error && (
            <div style={{ marginTop: 24 }}>
              <video src={videoFile} controls style={{ width: '100%', maxWidth: 400, borderRadius: 8, border: '1px solid var(--border-default)' }} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <label className="typo-label" style={{ marginBottom: 8, display: 'block' }}>Video URL</label>
          <input type="text" value={videoUrl || ''} onChange={e => onChange({ videoSource: 'link', videoUrl: e.target.value, videoFile })} placeholder="https://example.com/video.mp4"
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }} />
        </div>
      )}
    </div>
  );
};

const heroFields = [
  { key: 'eyebrow', label: 'Eyebrow label text', type: 'text' },
  { key: 'title', label: 'Main heading', type: 'text' },
  { key: 'description', label: 'Description paragraph', type: 'textarea' },
];

export default function CareersHeroEditor({ data, onChange }) {
  const bgType = data.bgType || 'image';
  const update = (u) => onChange({ ...data, ...u });
  const iStyle = { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', transition: 'border-color 200ms, box-shadow 200ms' };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };
  const hover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-strong)'; };
  const unhover = e => { if (document.activeElement !== e.target) e.target.style.borderColor = 'var(--border-default)'; };

  return (
    <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[{ k: 'image', icon: <ImageIcon size={18} />, l: 'Static Image' }, { k: 'slider', icon: <Layers size={18} />, l: 'Image Slider' }, { k: 'video', icon: <Video size={18} />, l: 'Video' }].map(m => (
          <button key={m.k} onClick={() => update({ bgType: m.k })}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 8, background: bgType === m.k ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: bgType === m.k ? 'var(--gold)' : '#888', border: `1px solid ${bgType === m.k ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}>
            {m.icon} {m.l}
          </button>
        ))}
      </div>
      {bgType === 'image' && <div style={{ maxWidth: 300 }}><ImageUpload value={data.bgImage || ''} onChange={v => update({ bgImage: v })} label="Background Image" /></div>}
      {bgType === 'slider' && <DraggableSlider items={data.bgSlider || []} onChange={v => update({ bgSlider: v })} />}
      {bgType === 'video' && <VideoUpload videoUrl={data.bgVideoUrl || ''} videoFile={data.bgVideoFile || ''} videoSource={data.bgVideoSource || 'upload'} onChange={v => update({ bgVideoUrl: v.videoUrl, bgVideoFile: v.videoFile, bgVideoSource: v.videoSource })} />}
      <div style={{ width: '100%', height: 1, background: 'var(--border-default)' }} />
      <SectionForm fields={heroFields} data={data} onChange={v => update(v)} />
    </div>
  );
}
