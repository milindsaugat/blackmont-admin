import React from 'react';
import SectionCard from '../components/SectionCard';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';

export default function CTAEditor({ data, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '24px' }}>CTA Section</h2>
        <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Edit the Call to Action section.</p>
      </div>

      <SectionCard title="Call To Action">
        <InputField
          label="Heading"
          value={data.heading || ''}
          onChange={(val) => onChange({ ...data, heading: val })}
          placeholder="e.g. Ready to secure your legacy?"
        />
        <TextArea
          label="Description"
          value={data.description || ''}
          onChange={(val) => onChange({ ...data, description: val })}
          placeholder="e.g. Connect with our advisors today..."
        />
        <InputField
          label="Button Text"
          value={data.buttonText || ''}
          onChange={(val) => onChange({ ...data, buttonText: val })}
          placeholder="e.g. Contact Us"
        />
      </SectionCard>
    </div>
  );
}
