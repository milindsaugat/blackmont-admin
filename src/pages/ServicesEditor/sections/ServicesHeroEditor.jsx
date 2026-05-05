import React, { useState, useRef } from 'react';
import { GripVertical, Trash2, Plus, UploadCloud, Video, Image as ImageIcon, Layers } from 'lucide-react';
import SectionForm from '../../../components/SectionForm';
import ImageUpload from '../../../components/ImageUpload';

const textFields = [
  { key: 'eyebrow', label: 'Eyebrow label text', type: 'text' },
  { key: 'title', label: 'Main heading', type: 'text' },
  { key: 'description', label: 'Subheading / description paragraph', type: 'textarea' },
];

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
            <ImageUpload 
              value={item.src} 
              onChange={(v) => updateItem(index, v)} 
              label={`Slide ${index + 1}`} 
            />
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

export default function ServicesHeroEditor({ data, onChange }) {
  const bgType = data.bgType || 'image'; // 'image', 'slider', 'video'
  const bgImage = data.bgImage || '';
  const bgSlider = data.bgSlider || [];
  const bgVideoUrl = data.bgVideoUrl || '';
  const bgVideoFile = data.bgVideoFile || '';
  const bgVideoSource = data.bgVideoSource || 'upload';

  const update = (updates) => onChange({ ...data, ...updates });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* BACKGROUND SELECTOR */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>1. Background Media</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => update({ bgType: 'image' })}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: bgType === 'image' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: bgType === 'image' ? 'var(--gold)' : '#888', border: `1px solid ${bgType === 'image' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}
            >
              <ImageIcon size={18} /> Static Image
            </button>
            <button
              onClick={() => update({ bgType: 'slider' })}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: bgType === 'slider' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: bgType === 'slider' ? 'var(--gold)' : '#888', border: `1px solid ${bgType === 'slider' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}
            >
              <Layers size={18} /> Image Slider
            </button>
            <button
              onClick={() => update({ bgType: 'video' })}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: bgType === 'video' ? 'rgba(212,175,55,0.1)' : 'var(--bg-surface)', color: bgType === 'video' ? 'var(--gold)' : '#888', border: `1px solid ${bgType === 'video' ? 'var(--gold)' : 'var(--border-default)'}`, cursor: 'pointer', transition: 'all 200ms' }}
            >
              <Video size={18} /> Video
            </button>
          </div>

          {bgType === 'image' && (
            <div style={{ maxWidth: 300 }}>
              <ImageUpload value={bgImage} onChange={(v) => update({ bgImage: v })} label="Background Image" />
            </div>
          )}

          {bgType === 'slider' && (
            <DraggableSlider items={bgSlider} onChange={(v) => update({ bgSlider: v })} />
          )}

          {bgType === 'video' && (
            <VideoUpload 
              videoUrl={bgVideoUrl} 
              videoFile={bgVideoFile} 
              videoSource={bgVideoSource} 
              onChange={(v) => update({ bgVideoUrl: v.videoUrl, bgVideoFile: v.videoFile, bgVideoSource: v.videoSource })} 
            />
          )}
        </div>
      </div>

      {/* TEXT CONTENT */}
      <div>
        <h4 className="typo-label" style={{ margin: '0 0 16px 0', color: 'var(--gold)' }}>2. Text Content</h4>
        <div style={{ background: 'var(--bg-root)', padding: 20, borderRadius: 12, border: '1px solid var(--border-default)' }}>
          <SectionForm fields={textFields} data={data} onChange={(v) => update(v)} />
        </div>
      </div>

    </div>
  );
}
