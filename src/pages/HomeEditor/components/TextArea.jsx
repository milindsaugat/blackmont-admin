import React from 'react';

export default function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      {label && <label style={{ color: '#ccc', fontSize: '14px', fontWeight: 500 }}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={{
          background: '#1a1a1a',
          border: '1px solid #333',
          color: '#fff',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none',
          resize: 'vertical',
          fontFamily: 'inherit',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#FFD700';
          e.target.style.boxShadow = '0 0 0 2px rgba(255, 215, 0, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#333';
          e.target.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
