import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Plus, UploadCloud, Video, Image as ImageIcon, Layers, Save, Check, Loader2 } from 'lucide-react';
import ImageUpload from '../../../components/ImageUpload';

/* ── Draggable slider (max 10 slides) ── */
const DraggableSlider = ({ items = [], onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragOver = (index) => {
    if (draggedIdx === null || draggedIdx === index) return;
    const newItems = [...items];
    const draggedItem = newItems[draggedIdx];
    newItems.splice(draggedIdx, 1);
    newItems.splice(index, 0, draggedItem);
    setDraggedIdx(index);
    onChange(newItems);
  };

  const handleDragEnd = (e) => {
    setDraggedIdx(null);
    e.target.style.opacity = '1';
  };

  const handleRemove = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, val) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], src: val };
    onChange(newItems);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.length >= 10 && (
        <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid var(--gold-20)', padding: '12px 16px', borderRadius: 8, color: 'var(--gold)', fontSize: 13 }}>
          Maximum of 10 slider images reached.
        </div>
      )}
      {items.map((item, index) => (
        <div
          key={item.id || index}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => { e.preventDefault(); handleDragOver(index); }}
          onDragEnd={handleDragEnd}
          style={{
            background: 'var(--bg-root)', border: '1px solid var(--border-default)',
            borderRadius: 12, padding: 16, display: 'flex', gap: 16, cursor: 'grab',
            alignItems: 'center'
          }}
        >
          <GripVertical size={20} color="var(--text-muted)" />
          <div style={{ width: 160, flexShrink: 0 }}>
            <ImageUpload value={item.src} onChange={(v) => updateItem(index, v)} label={`Slide ${index + 1}`} />
          </div>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => handleRemove(index)}
            style={{ background: 'transparent', border: 'none', color: '#ff5555', padding: 8, cursor: 'pointer', borderRadius: 8 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,85,85,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}

      <button
        onClick={() => onChange([...items, { src: '', id: Date.now() }])}
        disabled={items.length >= 10}
        style={{ display: 'flex', alignItems: 'center', justifySelf: 'flex-start', width: 'fit-content', gap: 8, padding: '12px 20px', background: 'rgba(212,175,55,0.05)', border: '1px dashed var(--gold-30)', borderRadius: 8, color: 'var(--gold)', cursor: items.length >= 10 ? 'not-allowed' : 'pointer', opacity: items.length >= 10 ? 0.5 : 1 }}
      >
        <Plus size={16} />
        Add New Slide
      </button>
    </div>
  );
};

/* ── Video upload (local + link, 15s limit) ── */
const VideoUpload = ({ videoUrl, videoFile, videoSource, onChange }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError('');
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(url);
      if (video.duration > 15) {
        setError('Video exceeds the 15-second limit. Please upload a shorter video.');
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange({ videoSource: 'upload', videoFile: reader.result, videoUrl });
        };
        reader.readAsDataURL(file);
      }
    };
    video.src = url;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={() => onChange({ videoSource: 'upload', videoFile, videoUrl })}
          style={{ flex: 1, padding: '12px', borderRadius: 8, background: videoSource === 'upload' ? 'var(--gold)' : 'var(--bg-surface)', color: videoSource === 'upload' ? '#000' : '#fff', border: `1px solid ${videoSource === 'upload' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', fontWeight: 500 }}
        >
          Local Upload
        </button>
        <button
          onClick={() => onChange({ videoSource: 'link', videoFile, videoUrl })}
          style={{ flex: 1, padding: '12px', borderRadius: 8, background: videoSource === 'link' ? 'var(--gold)' : 'var(--bg-surface)', color: videoSource === 'link' ? '#000' : '#fff', border: `1px solid ${videoSource === 'link' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', fontWeight: 500 }}
        >
          External Link
        </button>
      </div>

      {videoSource === 'upload' ? (
        <div style={{ border: '1px dashed var(--gold-30)', padding: 32, borderRadius: 12, textAlign: 'center', background: 'rgba(212,175,55,0.02)' }}>
          <UploadCloud size={32} color="var(--gold)" style={{ margin: '0 auto 12px auto' }} />
          <h4 className="typo-h1" style={{ fontSize: 16, marginBottom: 8 }}>Upload Video</h4>
          <p className="typo-small" style={{ marginBottom: 16 }}>Maximum length: 15 seconds. Recommended format: MP4.</p>
          <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} className="gold-btn">Select Video File</button>

          {error && <p style={{ color: '#ff5555', fontSize: 13, marginTop: 16 }}>{error}</p>}

          {videoFile && !error && (
            <div style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p className="typo-small" style={{ color: 'var(--gold)', margin: 0 }}>Current Uploaded Video:</p>
                <button
                  onClick={() => onChange({ videoSource: 'upload', videoFile: '', videoUrl })}
                  style={{ background: 'transparent', border: 'none', color: '#ff5555', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                >
                  <Trash2 size={14} /> Remove Video
                </button>
              </div>
              <video src={videoFile} controls style={{ width: '100%', maxWidth: 400, borderRadius: 8, border: '1px solid var(--border-default)' }} />
            </div>
          )}
        </div>
      ) : (
        <div>
          <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>Video URL (e.g., MP4 link)</label>
          <input
            type="text"
            value={videoUrl || ''}
            onChange={(e) => onChange({ videoSource: 'link', videoUrl: e.target.value, videoFile })}
            placeholder="https://example.com/video.mp4"
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

/* ── Input field helper ── */
const InputField = ({ label, value, onChange, type = 'text', placeholder }) => {
  const iStyle = {
    width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
    borderRadius: 10, padding: '12px 16px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
    transition: 'border-color 200ms, box-shadow 200ms',
  };
  const focus = e => { e.target.style.borderColor = 'rgba(212,175,55,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)'; };
  const blur = e => { e.target.style.borderColor = 'var(--border-default)'; e.target.style.boxShadow = 'none'; };

  return (
    <div>
      <label className="typo-label" style={{ display: 'block', marginBottom: 8 }}>{label}</label>
      {type === 'textarea' ? (
        <textarea value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{ ...iStyle, minHeight: 120, lineHeight: 1.6, resize: 'vertical' }}
          onFocus={focus} onBlur={blur} />
      ) : (
        <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={iStyle} onFocus={focus} onBlur={blur} />
      )}
    </div>
  );
};

/* ── Range slider ── */
const RangeSlider = ({ value, onChange, min = 0, max = 100, label }) => (
  <div>
    <label className="typo-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <span>{label}</span>
      <span style={{ color: 'var(--gold)' }}>{value}%</span>
    </label>
    <input
      type="range" min={min} max={max} value={value}
      onChange={e => onChange(Number(e.target.value))}
      style={{ width: '100%', accentColor: '#D4AF37', cursor: 'pointer' }}
    />
  </div>
);

/* ═══════════════════════════════════════
   MAIN EDITOR
   ═══════════════════════════════════════ */
export default function AboutHeroEditor({ data, onChange }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hero = {
    eyebrow: data?.eyebrow ?? 'ABOUT BLACKMONT',
    heading: data?.heading ?? 'A Modern Precious Metals Enterprise',
    description: data?.description ?? 'Blackmont Capital stands as a beacon in the global bullion market, offering professional stewardship, secure custody, and strategic utilisation of physical gold assets.',
    bgType: data?.bgType ?? 'image',
    bgImage: data?.bgImage ?? '',
    bgSlider: data?.bgSlider ?? [],
    bgVideoUrl: data?.bgVideoUrl ?? '',
    bgVideoFile: data?.bgVideoFile ?? '',
    bgVideoSource: data?.bgVideoSource ?? 'upload',
    overlayOpacity: data?.overlayOpacity ?? 70,
    heroHeight: data?.heroHeight ?? 'standard',
  };

  const update = (updates) => {
    onChange({ ...data, ...hero, ...updates });
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── 1. Background Media ── */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Background Media</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>

          {/* Type selector */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => update({ bgType: 'image' })}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: hero.bgType === 'image' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: hero.bgType === 'image' ? 'var(--gold)' : '#888', border: `1px solid ${hero.bgType === 'image' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}
            >
              <ImageIcon size={18} /> Static Image
            </button>
            <button
              onClick={() => update({ bgType: 'slider' })}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: hero.bgType === 'slider' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: hero.bgType === 'slider' ? 'var(--gold)' : '#888', border: `1px solid ${hero.bgType === 'slider' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}
            >
              <Layers size={18} /> Image Slider
            </button>
            <button
              onClick={() => update({ bgType: 'video' })}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: hero.bgType === 'video' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: hero.bgType === 'video' ? 'var(--gold)' : '#888', border: `1px solid ${hero.bgType === 'video' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}
            >
              <Video size={18} /> Video
            </button>
          </div>

          {hero.bgType === 'image' && (
            <div style={{ maxWidth: 300 }}>
              <ImageUpload value={hero.bgImage} onChange={(v) => update({ bgImage: v })} label="Background Image" />
            </div>
          )}

          {hero.bgType === 'slider' && (
            <DraggableSlider items={hero.bgSlider} onChange={(v) => update({ bgSlider: v })} />
          )}

          {hero.bgType === 'video' && (
            <VideoUpload
              videoUrl={hero.bgVideoUrl}
              videoFile={hero.bgVideoFile}
              videoSource={hero.bgVideoSource}
              onChange={(v) => update({ bgVideoUrl: v.videoUrl, bgVideoFile: v.videoFile, bgVideoSource: v.videoSource })}
            />
          )}

          {/* Overlay opacity (for image/slider) */}
          {(hero.bgType === 'image' && hero.bgImage) || hero.bgType === 'slider' ? (
            <div style={{ marginTop: 20 }}>
              <RangeSlider label="Background overlay opacity" value={hero.overlayOpacity} onChange={v => update({ overlayOpacity: v })} />
            </div>
          ) : null}
        </div>
      </div>

      {/* ── 2. Text Content ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h4 className="typo-label" style={{ margin: 0, color: 'var(--gold)' }}>2. Text Content</h4>
          <button
            onClick={handleSave} disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: saved ? 'rgba(34,197,94,0.1)' : 'transparent',
              border: `1px solid ${saved ? 'rgba(34,197,94,0.3)' : 'var(--gold-30)'}`,
              color: saved ? '#22c55e' : 'var(--gold)',
              padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 200ms'
            }}
            onMouseEnter={e => { if (!saving && !saved) e.currentTarget.style.background = 'rgba(212,175,55,0.1)'; }}
            onMouseLeave={e => { if (!saving && !saved) e.currentTarget.style.background = 'transparent'; }}
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : <Save size={13} />}
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save'}
          </button>
        </div>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
          <InputField label="Eyebrow label" value={hero.eyebrow} onChange={v => update({ eyebrow: v })} placeholder="e.g. ABOUT BLACKMONT" />
          <InputField label="Main heading" value={hero.heading} onChange={v => update({ heading: v })} placeholder="e.g. A Modern Precious Metals Enterprise" />
          <InputField label="Description paragraph" value={hero.description} onChange={v => update({ description: v })} type="textarea" placeholder="Blackmont Capital stands as a beacon..." />
        </div>
      </div>

      {/* ── 3. Layout ── */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>3. Hero Layout</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)', maxWidth: 800 }}>
          <label className="typo-label" style={{ display: 'block', marginBottom: 8 }}>Hero height</label>
          <select
            value={hero.heroHeight}
            onChange={e => update({ heroHeight: e.target.value })}
            style={{
              width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              borderRadius: 10, padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none',
              fontFamily: 'var(--font-body)'
            }}
          >
            <option value="compact">Compact</option>
            <option value="standard">Standard (default)</option>
            <option value="tall">Tall</option>
          </select>
        </div>
      </div>
    </div>
  );
}
