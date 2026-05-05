import { useState, useEffect } from 'react';
import { Save, Loader2, Share2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { getAdminFooter, updateFooterSocialLinks } from '../services/footerService';

/* Inline SVG social icons */
const SocialIcon = ({ type, size = 16 }) => {
  const icons = {
    linkedin: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    twitter: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
      </svg>
    ),
    instagram: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
      </svg>
    ),
    facebook: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    youtube: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

/* ── Reusable section card (defined OUTSIDE component to prevent re-mount) ── */
const Section = ({ icon: Icon, title, desc, children, onSave, isSaving, loading }) => (
  <div style={{
    background: '#0a0a0a', border: '1px solid #161616', borderRadius: '22px',
    overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
  }}>
    <div style={{
      padding: '22px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      borderBottom: '1px solid #161616', background: '#080808',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          width: '42px', height: '42px', borderRadius: '14px', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.1)',
        }}>
          <Icon size={18} color="#D4AF37" />
        </div>
        <div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '0.03em' }}>{title}</h2>
          <p style={{ fontSize: '11px', color: '#444', marginTop: '2px' }}>{desc}</p>
        </div>
      </div>
      {onSave && (
        <button onClick={onSave} disabled={isSaving || loading} className="gold-btn"
          style={{ padding: '9px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', borderRadius: '10px', opacity: isSaving || loading ? 0.6 : 1 }}>
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'SAVING...' : 'SAVE'}
        </button>
      )}
    </div>
    <div style={{ padding: '28px 32px' }}>{children}</div>
  </div>
);

/* ── Input with icon (defined OUTSIDE component to prevent re-mount) ── */
const Field = ({ icon: Icon, socialIcon, label, value, onChange, placeholder, type = 'text', disabled }) => (
  <div>
    <label style={{ display: 'block', fontSize: '9px', color: '#444', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333', display: 'flex' }}>
        {socialIcon ? <SocialIcon type={socialIcon} size={15} /> : (Icon && <Icon size={15} />)}
      </div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        style={{
          width: '100%', height: '48px', paddingLeft: socialIcon || Icon ? '46px' : '16px', paddingRight: '16px',
          background: '#070707', border: '1px solid #1a1a1a', borderRadius: '12px',
          color: '#ccc', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-body)',
          transition: 'border-color 0.3s', opacity: disabled ? 0.5 : 1,
        }}
        onFocus={e => !disabled && (e.target.style.borderColor = 'rgba(212,175,55,0.3)')}
        onBlur={e => e.target.style.borderColor = '#1a1a1a'}
      />
    </div>
  </div>
);

export default function AdminFooterSettings({ addToast }) {
  const [settings, setSettings] = useState({
    linkedinUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    youtubeUrl: '',
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch footer data on mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setLoading(true);
        const data = await getAdminFooter();
        
        if (data.footer && data.footer.socialLinks) {
          const { socialLinks } = data.footer;
          setSettings({
            linkedinUrl: socialLinks.linkedin || '',
            twitterUrl: socialLinks.twitter || '',
            instagramUrl: socialLinks.instagram || '',
            facebookUrl: socialLinks.facebook || '',
            youtubeUrl: socialLinks.youtube || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch footer settings:', error);
        addToast?.('Failed to load footer settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, [addToast]);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Map frontend format to backend format
      const payload = {
        socialLinks: {
          linkedin: settings.linkedinUrl,
          twitter: settings.twitterUrl,
          instagram: settings.instagramUrl,
          facebook: settings.facebookUrl,
          youtube: settings.youtubeUrl,
        }
      };

      await updateFooterSocialLinks(payload);
      addToast?.('Footer Settings saved successfully', 'success');
    } catch (error) {
      console.error('Error saving footer settings:', error);
      addToast?.(error.message || 'Failed to save footer settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: '820px', margin: '0 auto', paddingBottom: '80px', textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto', color: '#D4AF37' }} />
        <p style={{ color: '#555', marginTop: '16px' }}>Loading footer settings...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '820px', margin: '0 auto', paddingBottom: '80px' }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: '6px', letterSpacing: '0.02em' }}>
          Footer <span style={{ color: '#D4AF37', fontWeight: 500 }}>Settings</span>
        </h1>
        <p style={{ fontSize: '13px', color: '#555' }}>Configure website footer links and social media accounts.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Social Links */}
        <Section icon={Share2} title="Social Media Links" desc="URLs for footer social media icons" onSave={handleSave} isSaving={saving} loading={loading}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <Field socialIcon="linkedin" label="LinkedIn" value={settings.linkedinUrl} onChange={e => setSettings(prev => ({ ...prev, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/..." disabled={loading} />
            <Field socialIcon="twitter" label="X (Twitter)" value={settings.twitterUrl} onChange={e => setSettings(prev => ({ ...prev, twitterUrl: e.target.value }))} placeholder="https://x.com/..." disabled={loading} />
            <Field socialIcon="instagram" label="Instagram" value={settings.instagramUrl} onChange={e => setSettings(prev => ({ ...prev, instagramUrl: e.target.value }))} placeholder="https://instagram.com/..." disabled={loading} />
            <Field socialIcon="facebook" label="Facebook" value={settings.facebookUrl} onChange={e => setSettings(prev => ({ ...prev, facebookUrl: e.target.value }))} placeholder="https://facebook.com/..." disabled={loading} />
            <Field socialIcon="youtube" label="YouTube" value={settings.youtubeUrl} onChange={e => setSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))} placeholder="https://youtube.com/..." disabled={loading} />
          </div>
        </Section>
      </div>
    </div>
  );
}