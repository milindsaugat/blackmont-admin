import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['link'],
    ['clean'],
  ],
};

const formats = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'blockquote', 'link',
];

export default function WysiwygEditor({ value, onChange, placeholder = 'Write content here...' }) {
  return (
    <div className="wysiwyg-wrapper">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style>{`
        .wysiwyg-wrapper .ql-toolbar.ql-snow {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-radius: 10px 10px 0 0;
        }
        .wysiwyg-wrapper .ql-container.ql-snow {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          border-top: none;
          border-radius: 0 0 10px 10px;
          min-height: 180px;
          font-family: var(--font-body);
          font-size: 14px;
          color: #fff;
        }
        .wysiwyg-wrapper .ql-editor {
          color: #fff;
          min-height: 160px;
          line-height: 1.7;
        }
        .wysiwyg-wrapper .ql-editor.ql-blank::before {
          color: #555;
          font-style: italic;
        }
        .wysiwyg-wrapper .ql-snow .ql-stroke {
          stroke: #888;
        }
        .wysiwyg-wrapper .ql-snow .ql-fill {
          fill: #888;
        }
        .wysiwyg-wrapper .ql-snow .ql-picker-label {
          color: #888;
        }
        .wysiwyg-wrapper .ql-snow .ql-picker-options {
          background: #1a1a1a;
          border: 1px solid var(--border-default);
        }
        .wysiwyg-wrapper .ql-snow .ql-picker-item {
          color: #ccc;
        }
        .wysiwyg-wrapper .ql-snow .ql-picker-item:hover {
          color: #D4AF37;
        }
        .wysiwyg-wrapper .ql-snow button:hover .ql-stroke,
        .wysiwyg-wrapper .ql-snow .ql-picker-label:hover .ql-stroke {
          stroke: #D4AF37;
        }
        .wysiwyg-wrapper .ql-snow button:hover .ql-fill,
        .wysiwyg-wrapper .ql-snow .ql-picker-label:hover .ql-fill {
          fill: #D4AF37;
        }
        .wysiwyg-wrapper .ql-snow button.ql-active .ql-stroke {
          stroke: #D4AF37;
        }
        .wysiwyg-wrapper .ql-snow button.ql-active .ql-fill {
          fill: #D4AF37;
        }
        .wysiwyg-wrapper .ql-snow .ql-picker-label:hover {
          color: #D4AF37;
        }
        .wysiwyg-wrapper .ql-editor a {
          color: #D4AF37;
        }
        .wysiwyg-wrapper .ql-editor h2 {
          color: #fff;
          font-size: 1.4em;
        }
        .wysiwyg-wrapper .ql-editor h3 {
          color: #fff;
          font-size: 1.2em;
        }
        .wysiwyg-wrapper .ql-editor blockquote {
          border-left: 3px solid #D4AF37;
          padding-left: 16px;
          color: rgba(255,255,255,0.7);
        }
        .wysiwyg-wrapper .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
          border-color: var(--border-default);
          color: #D4AF37;
        }
        .wysiwyg-wrapper .ql-snow .ql-tooltip {
          background: #1a1a1a;
          border: 1px solid var(--border-default);
          color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        }
        .wysiwyg-wrapper .ql-snow .ql-tooltip input[type=text] {
          background: var(--bg-surface);
          border: 1px solid var(--border-default);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
