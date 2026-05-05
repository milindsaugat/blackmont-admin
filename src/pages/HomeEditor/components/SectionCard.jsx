import React from 'react';

export default function SectionCard({ title, children }) {
  return (
    <div style={{
      background: '#111',
      border: '1px solid #222',
      borderRadius: '10px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {title && (
        <h3 style={{
          margin: 0,
          color: '#FFD700',
          fontSize: '18px',
          fontWeight: 600,
          borderBottom: '1px solid #222',
          paddingBottom: '16px'
        }}>
          {title}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {children}
      </div>
    </div>
  );
}
