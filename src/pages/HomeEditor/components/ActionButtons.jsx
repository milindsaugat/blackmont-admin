import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function AddButton({ onClick, label = "Add Item" }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: 'rgba(255, 215, 0, 0.1)',
        color: '#FFD700',
        border: '1px dashed #FFD700',
        borderRadius: '8px',
        padding: '12px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s ease',
        width: '100%',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
      }}
    >
      <Plus size={16} /> {label}
    </button>
  );
}

export function DeleteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        color: '#ff4444',
        border: '1px solid #333',
        borderRadius: '6px',
        padding: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      title="Delete item"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
        e.currentTarget.style.borderColor = '#ff4444';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.borderColor = '#333';
      }}
    >
      <Trash2 size={16} />
    </button>
  );
}
