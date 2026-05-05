import React from 'react';
import SectionCard from '../components/SectionCard';
import InputField from '../components/InputField';
import TextArea from '../components/TextArea';
import { AddButton, DeleteButton } from '../components/ActionButtons';

export default function BlogEditor({ data, onChange }) {
  const posts = data.posts || [];

  const addPost = () => {
    onChange({
      ...data,
      posts: [...posts, { title: '', description: '' }]
    });
  };

  const updatePost = (index, field, value) => {
    const updated = [...posts];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, posts: updated });
  };

  const removePost = (index) => {
    const updated = posts.filter((_, i) => i !== index);
    onChange({ ...data, posts: updated });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '24px' }}>Blog / Insights Section</h2>
        <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Manage the featured blog posts or insights on the homepage.</p>
      </div>

      <SectionCard title="Blog Cards">
        {posts.map((post, index) => (
          <div key={index} style={{
            display: 'flex', gap: '16px', alignItems: 'flex-start',
            padding: '16px', background: '#1a1a1a', borderRadius: '8px', border: '1px solid #333'
          }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <InputField
                label="Post Title"
                value={post.title || ''}
                onChange={(val) => updatePost(index, 'title', val)}
                placeholder="e.g. Market Outlook 2026"
              />
              <TextArea
                label="Post Description"
                value={post.description || ''}
                onChange={(val) => updatePost(index, 'description', val)}
                placeholder="e.g. An analysis of upcoming market trends..."
                rows={2}
              />
            </div>
            <div style={{ paddingTop: '28px' }}>
              <DeleteButton onClick={() => removePost(index)} />
            </div>
          </div>
        ))}
        <AddButton onClick={addPost} label="Add Blog Post" />
      </SectionCard>
    </div>
  );
}
