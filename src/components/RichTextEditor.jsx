import React, { useRef, useEffect } from 'react';
import { Bold, Italic } from 'lucide-react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      let content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  const format = (command) => {
    document.execCommand(command, false, null);
    editorRef.current.focus();
    handleInput();
  };

  return (
    <div style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border-default)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '6px 12px', borderBottom: '1px solid var(--border-default)', display: 'flex', gap: 8, background: 'var(--bg-inset)' }}>
        <button type="button" onClick={() => format('bold')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-primary)' }}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => format('italic')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--text-primary)' }}>
          <Italic size={16} />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={{
          padding: '12px 16px',
          minHeight: 100,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          outline: 'none',
          whiteSpace: 'pre-wrap'
        }}
        data-placeholder={placeholder}
      />
    </div>
  );
}
