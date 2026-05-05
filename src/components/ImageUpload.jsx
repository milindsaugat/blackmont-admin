import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export default function ImageUpload({ value, onChange, label }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '1px dashed var(--border-strong)',
          borderRadius: 10,
          padding: value ? 8 : 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: 'var(--bg-surface)',
          transition: 'all 200ms',
          position: 'relative',
          minHeight: 120
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {value ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <img
              src={
                value?.startsWith("/uploads")
                  ? `http://localhost:5001${value}`
                  : value
              }
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: 200,
                objectFit: "contain",
                borderRadius: 6,
              }}
            />
            <button
              onClick={handleRemove}
              style={{
                position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none',
                color: '#fff', borderRadius: '50%', width: 24, height: 24, display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
            <ImageIcon size={24} />
            <span style={{ fontSize: 13, fontFamily: 'var(--font-body)' }}>Click to upload {label ? label.toLowerCase() : 'image'}</span>
          </div>
        )}
      </div>
    </div>
  );
}