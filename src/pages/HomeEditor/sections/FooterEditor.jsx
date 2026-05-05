import React from 'react';
import SectionCard from '../components/SectionCard';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';
import { AddButton, DeleteButton } from '../components/ActionButtons';

export default function FooterEditor({ data, onChange }) {
  const links = data.links || [];

  const addLink = () => {
    onChange({
      ...data,
      links: [...links, { text: '', url: '' }]
    });
  };

  const updateLink = (index, field, value) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, links: updated });
  };

  const removeLink = (index) => {
    const updated = links.filter((_, i) => i !== index);
    onChange({ ...data, links: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '24px' }}>Footer Section</h2>
        <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Edit company details and footer links.</p>
      </div>

      <SectionCard title="Company Information">
        <TextArea
          label="Company Text"
          value={data.companyText || ''}
          onChange={(val) => onChange({ ...data, companyText: val })}
          placeholder="e.g. Blackmont Capital is a registered investment advisor..."
          rows={3}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
          <InputField
            label="Contact Email"
            value={data.contactEmail || ''}
            onChange={(val) => onChange({ ...data, contactEmail: val })}
            placeholder="e.g. contact@blackmont.com"
          />
          <InputField
            label="Contact Phone"
            value={data.contactPhone || ''}
            onChange={(val) => onChange({ ...data, contactPhone: val })}
            placeholder="e.g. +1 (555) 123-4567"
          />
        </div>
      </SectionCard>

      <SectionCard title="Footer Links">
        {links.map((link, index) => (
          <div key={index} style={{
            display: 'flex', gap: '16px', alignItems: 'center',
            padding: '16px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333'
          }}>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <InputField
                label="Link Text"
                value={link.text || ''}
                onChange={(val) => updateLink(index, 'text', val)}
                placeholder="e.g. Privacy Policy"
              />
              <InputField
                label="URL"
                value={link.url || ''}
                onChange={(val) => updateLink(index, 'url', val)}
                placeholder="e.g. /privacy"
              />
            </div>
            <div style={{ paddingTop: '28px' }}>
              <DeleteButton onClick={() => removeLink(index)} />
            </div>
          </div>
        ))}
        <AddButton onClick={addLink} label="Add Link" />
      </SectionCard>
    </div>
  );
}
