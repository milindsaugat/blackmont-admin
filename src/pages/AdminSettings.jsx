import { useState, useRef, useCallback, useEffect } from 'react';
import { Save, Loader2, Eye, EyeOff, Mail, Lock, Send, ShieldCheck, Eye as VisibilityIcon, EyeOff as HiddenIcon, ToggleRight, ToggleLeft } from 'lucide-react';
import { adminSettingsService } from "../services/adminSettingsService";
import { siteVisibilityService } from "../services/siteVisibilityService";

/* ── Toggle Switch (defined OUTSIDE component to prevent re-mount) ── */
const Toggle = ({ label, checked, onChange, description }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(212,175,55,0.02)', border: '1px solid #1a1a1a', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
    onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.04)'}
    onMouseLeave={e => e.currentTarget.style.background = 'rgba(212,175,55,0.02)'}
  >
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>{label}</div>
      {description && <div style={{ fontSize: '11px', color: '#555', marginTop: '3px' }}>{description}</div>}
    </div>
    <button onClick={onChange} style={{ background: 'none', border: 'none', color: checked ? '#D4AF37' : '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
      {checked ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
    </button>
  </div>
);

/* ── Reusable section card (defined OUTSIDE component to prevent re-mount) ── */
const Section = ({ icon: Icon, title, desc, children }) => (
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
    </div>
    <div style={{ padding: '36px 32px' }}>{children}</div>
  </div>
);

/* ── Input with icon (defined OUTSIDE component to prevent re-mount) ── */
const Field = ({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) => (
  <div>
    <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#444', display: 'flex' }}>
        {Icon && <Icon size={16} />}
      </div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{
          width: '100%', height: '52px', paddingLeft: Icon ? '48px' : '16px', paddingRight: '16px',
          background: '#070707', border: '1px solid #1a1a1a', borderRadius: '14px',
          color: '#eee', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)',
          transition: 'border-color 0.3s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
        onBlur={e => e.target.style.borderColor = '#1a1a1a'}
      />
    </div>
  </div>
);

/* ── Password field (defined OUTSIDE component to prevent re-mount) ── */
const PwField = ({ label, k, value, onChange, showPw, togglePw }) => (
  <div>
    <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input type={showPw ? 'text' : 'password'} value={value} onChange={onChange} placeholder={label}
        style={{
          width: '100%', height: '52px', padding: '0 48px 0 20px',
          background: '#070707', border: '1px solid #1a1a1a', borderRadius: '14px',
          color: '#eee', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)',
          transition: 'border-color 0.3s',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
        onBlur={e => e.target.style.borderColor = '#1a1a1a'}
      />
      <button type="button" onClick={() => togglePw(k)}
        style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
        onMouseLeave={e => e.currentTarget.style.color = '#444'}
      >
        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  </div>
);

const DEFAULT_VISIBILITY = {
  pages: {
    home: true,
    about: true,
    services: true,
    insights: true,
    investorRelations: true,
    careers: true,
    contact: true,
    faq: true,
    terms: true,
    privacy: true,
    clientLogin: true,
  },
  homeSections: {
    hero: true,
    metalRates: true,
    aboutPreview: true,
    blackmontAdvantage: true,
    whoWeServe: true,
    whyBlackmont: true,
    servicesPreview: true,
    marketPreview: true,
    insightsPreview: true,
    contactCta: true,
  },
  investorSections: {
    overview: true,
    reports: true,
    stockInformation: true,
    eventsPresentations: true,
    corporateGovernance: true,
  },
};

const normalizeVisibilitySettings = (settings = {}) => {
  const homeSections = settings.homeSections || {};
  const blackmontAdvantage =
    homeSections.blackmontAdvantage ?? homeSections.whyBlackmont ?? true;

  return {
    pages: { ...DEFAULT_VISIBILITY.pages, ...(settings.pages || {}) },
    homeSections: {
      ...DEFAULT_VISIBILITY.homeSections,
      ...homeSections,
      blackmontAdvantage,
      whyBlackmont: blackmontAdvantage,
      whoWeServe: homeSections.whoWeServe ?? true,
    },
    investorSections: {
      ...DEFAULT_VISIBILITY.investorSections,
      ...(settings.investorSections || {}),
    },
  };
};

export default function AdminSettings({ addToast }) {
  const [emails, setEmails] = useState({ current: '', newEmail: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPw, setShowPw] = useState({});
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const otpRefs = useRef([]);

  // Visibility settings state
  const [visibility, setVisibility] = useState({
    pages: {},
    homeSections: {},
    investorSections: {},
  });
  const [visibilityLoading, setVisibilityLoading] = useState(true);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState({
    showClientLogin: true,
    showContactButton: true,
  });
  const [dashboardSettingsLoading, setDashboardSettingsLoading] = useState(true);
  const [dashboardSettingsSaving, setDashboardSettingsSaving] = useState(false);

  useEffect(() => {
  if (!otpSent || otpTimer <= 0) return;

  const interval = setInterval(() => {
    setOtpTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Load dashboard button settings
  useEffect(() => {
    const loadDashboardSettings = async () => {
      try {
        setDashboardSettingsLoading(true);
        const res = await adminSettingsService.getDashboardSettings();
        if (res.data) {
          setDashboardSettings({
            showClientLogin: res.data.showClientLogin ?? true,
            showContactButton: res.data.showContactButton ?? true,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard settings:", error);
        addToast?.("Failed to load dashboard settings", "error");
      } finally {
        setDashboardSettingsLoading(false);
      }
    };

    loadDashboardSettings();
  }, []);

  // Load visibility settings
  useEffect(() => {
    const loadVisibility = async () => {
      try {
        setVisibilityLoading(true);
        const res = await siteVisibilityService.getVisibilitySettings();
        if (res.data) {
          setVisibility(normalizeVisibilitySettings(res.data));
        }
      } catch (error) {
        console.error("Failed to load visibility settings:", error);
        addToast?.("Failed to load visibility settings", "error");
      } finally {
        setVisibilityLoading(false);
      }
    };

    loadVisibility();
  }, []);

const formatTimer = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

const toggleVisibility = (section, item) => {
  setVisibility(prev => ({
    ...prev,
    [section]: {
      ...prev[section],
      [item]: !(prev[section]?.[item] ?? true),
    },
  }));
};

const saveVisibility = async () => {
  try {
    setVisibilitySaving(true);
    const res = await siteVisibilityService.updateVisibilitySettings(
      normalizeVisibilitySettings(visibility)
    );
    if (res.data) {
      setVisibility(normalizeVisibilitySettings(res.data));
    }
    addToast?.(res.message || "Visibility settings updated successfully", "success");
  } catch (error) {
    addToast?.(error.message || "Failed to update visibility settings", "error");
  } finally {
    setVisibilitySaving(false);
  }
};

const toggleDashboardSetting = (key) => {
  setDashboardSettings((prev) => ({
    ...prev,
    [key]: !(prev[key] ?? true),
  }));
};

const saveDashboardSettings = async () => {
  try {
    setDashboardSettingsSaving(true);
    const res = await adminSettingsService.updateDashboardSettings(dashboardSettings);

    if (res.data) {
      setDashboardSettings({
        showClientLogin: res.data.showClientLogin ?? true,
        showContactButton: res.data.showContactButton ?? true,
      });
    }

    addToast?.(res.message || "Dashboard settings updated successfully", "success");
  } catch (error) {
    addToast?.(error.message || "Failed to update dashboard settings", "error");
  } finally {
    setDashboardSettingsSaving(false);
  }
};

 const handleSendOTP = async () => {
  if (!emails.current || !emails.newEmail) {
    addToast?.("Please fill both email fields to receive an OTP", "error");
    return;
  }

  try {
    setSavingEmail(true);

    const response = await adminSettingsService.sendEmailOtp({
      currentEmail: emails.current,
      newEmail: emails.newEmail,
    });

    setOtpSent(true);
    setOtpTimer(300);
    setOtp(["", "", "", "", "", ""]);
    addToast?.(response.message || "OTP sent successfully", "success");

    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  } catch (error) {
    addToast?.(error.message || "Failed to send OTP", "error");
  } finally {
    setSavingEmail(false);
  }
};

  const handleOtpChange = useCallback((index, value) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtp(prev => {
      const newOtp = [...prev];
      newOtp[index] = digit;
      return newOtp;
    });
    // Auto-focus next box
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleOtpPaste = useCallback((e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const focusIdx = Math.min(pasted.length, 5);
      otpRefs.current[focusIdx]?.focus();
    }
  }, []);

 const handleVerifyOTP = async () => {
  const code = otp.join("");

  if (code.length !== 6) {
    addToast?.("Please enter complete OTP", "error");
    return;
  }

  try {
    setVerifying(true);

    const res = await adminSettingsService.verifyEmailOtp({
      currentEmail: emails.current,
      newEmail: emails.newEmail,
      otp: code,
    });

    addToast?.(res.message, "success");

    setOtpSent(false);
    setEmails({ current: "", newEmail: "" });
    setOtp(["", "", "", "", "", ""]);
  } catch (err) {
    addToast?.(err.message, "error");
  } finally {
    setVerifying(false);
  }
};

  const handleUpdatePassword = async () => {
  if (!passwords.current || !passwords.newPass || !passwords.confirm) {
    addToast?.("Please fill all password fields", "error");
    return;
  }

  if (passwords.newPass !== passwords.confirm) {
    addToast?.("Passwords do not match", "error");
    return;
  }

  try {
    setSavingPass(true);

    // ⚠️ IMPORTANT: get email from token OR ask user to enter email
    const email = JSON.parse(atob(localStorage.getItem("adminToken").split('.')[1])).email;

    const res = await adminSettingsService.updatePassword({
      email,
      currentPassword: passwords.current,
      newPassword: passwords.newPass,
      confirmPassword: passwords.confirm,
    });

    addToast?.(res.message, "success");

    setPasswords({ current: "", newPass: "", confirm: "" });
  } catch (err) {
    addToast?.(err.message, "error");
  } finally {
    setSavingPass(false);
  }
};

  const togglePw = (key) => setShowPw(p => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ padding: '32px', maxWidth: '960px', margin: '0 auto', paddingBottom: '80px' }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: '8px', letterSpacing: '0.02em' }}>
          Dashboard <span style={{ color: '#D4AF37', fontWeight: 500 }}>Credentials</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#666' }}>Securely update your administrator email and login password.</p>
      </div>

      <Section icon={Lock} title="Update Access Credentials" desc="Modify your login email and password securely.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
          
          {/* Part 1: Email Update */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '12px', color: '#D4AF37', fontWeight: 600, borderBottom: '1px solid #1a1a1a', paddingBottom: '14px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              1. Email Address
            </h3>
            <Field icon={Mail} label="Old Email" value={emails.current} onChange={e => setEmails(prev => ({ ...prev, current: e.target.value }))} placeholder="admin@blackmont.com" />
            <Field icon={Mail} label="New Email" value={emails.newEmail} onChange={e => setEmails(prev => ({ ...prev, newEmail: e.target.value }))} placeholder="new@blackmont.com" />
            
           <button
  onClick={handleSendOTP}
  disabled={savingEmail || (otpSent && otpTimer > 0)}
  className="gold-btn"
  style={{
    marginTop: '10px',
    padding: '14px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    borderRadius: '12px',
    width: '100%',
    justifyContent: 'center',
    opacity: savingEmail || (otpSent && otpTimer > 0) ? 0.6 : 1,
    cursor: savingEmail || (otpSent && otpTimer > 0) ? 'not-allowed' : 'pointer',
  }}
>
  {savingEmail ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
  {savingEmail ? 'SENDING...' : otpSent && otpTimer > 0 ? `RESEND IN ${formatTimer(otpTimer)}` : otpSent ? 'RESEND OTP' : 'SEND OTP'}
</button>

            {/* ── 6-Digit OTP Input ── */}
            {otpSent && (
              <div style={{
                marginTop: '4px', padding: '24px', background: '#070707',
                border: '1px solid #1a1a1a', borderRadius: '16px',
                animation: 'fadeIn 0.3s ease-out',
              }}>
                <label style={{
                  display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em',
                  fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center',
                }}>
                  Enter 6-Digit OTP
                </label>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      style={{
                        width: '48px', height: '56px', textAlign: 'center',
                        fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-display)',
                        color: digit ? '#D4AF37' : '#555',
                        background: digit ? 'rgba(212,175,55,0.04)' : '#0a0a0a',
                        border: `2px solid ${digit ? 'rgba(212,175,55,0.3)' : '#1a1a1a'}`,
                        borderRadius: '12px', outline: 'none',
                        transition: 'all 0.2s ease',
                        caretColor: '#D4AF37',
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = 'rgba(212,175,55,0.5)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(212,175,55,0.08)';
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = digit ? 'rgba(212,175,55,0.3)' : '#1a1a1a';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ))}
                </div>
                <button onClick={handleVerifyOTP} disabled={verifying} className="gold-btn"
                  style={{
                    padding: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em',
                    borderRadius: '12px', width: '100%', justifyContent: 'center',
                  }}>
                  {verifying ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {verifying ? 'VERIFYING...' : 'VERIFY OTP'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '11px', color: '#444', marginTop: '14px' }}>
                {otpTimer > 0 ? (
  <>
    OTP valid for <span style={{ color: '#D4AF37' }}>{formatTimer(otpTimer)}</span>
  </>
) : (
  <>
    OTP expired. Click{" "}
    <span style={{ color: '#D4AF37', cursor: 'pointer' }} onClick={handleSendOTP}>
      Resend OTP
    </span>
  </>
)}
                </p>
              </div>
            )}
          </div>

          {/* Part 2: Password Update */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '12px', color: '#D4AF37', fontWeight: 600, borderBottom: '1px solid #1a1a1a', paddingBottom: '14px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              2. Security Password
            </h3>
            <PwField label="Current Password" k="current" value={passwords.current} onChange={e => setPasswords(prev => ({ ...prev, current: e.target.value }))} showPw={showPw.current} togglePw={togglePw} />
            <PwField label="New Password" k="new" value={passwords.newPass} onChange={e => setPasswords(prev => ({ ...prev, newPass: e.target.value }))} showPw={showPw.new} togglePw={togglePw} />
            <PwField label="Confirm New Password" k="confirm" value={passwords.confirm} onChange={e => setPasswords(prev => ({ ...prev, confirm: e.target.value }))} showPw={showPw.confirm} togglePw={togglePw} />
            
            <button onClick={handleUpdatePassword} disabled={savingPass} className="gold-btn"
              style={{ marginTop: '10px', padding: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', borderRadius: '12px', width: '100%', justifyContent: 'center' }}>
              {savingPass ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {savingPass ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </div>

        </div>
      </Section>

      <div style={{ height: '28px' }} />

      {/* Header Button Controls Section */}
      <Section icon={VisibilityIcon} title="Header Button Controls" desc="Control the Client Login and Contact buttons in the website navbar.">
        {dashboardSettingsLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: '#666' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p>Loading dashboard settings...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Toggle
                label="Show Client Login Button"
                checked={dashboardSettings.showClientLogin ?? true}
                onChange={() => toggleDashboardSetting('showClientLogin')}
                description="Show or hide the Client Login button in the client website navbar."
              />
              <Toggle
                label="Show Contact Button"
                checked={dashboardSettings.showContactButton ?? true}
                onChange={() => toggleDashboardSetting('showContactButton')}
                description="Show or hide the Contact button in the client website navbar."
              />
            </div>

            <button onClick={saveDashboardSettings} disabled={dashboardSettingsSaving} className="gold-btn"
              style={{ marginTop: '10px', padding: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', borderRadius: '12px', width: '100%', justifyContent: 'center' }}>
              {dashboardSettingsSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {dashboardSettingsSaving ? 'SAVING...' : 'SAVE HEADER BUTTON SETTINGS'}
            </button>
          </div>
        )}
      </Section>

      <div style={{ height: '28px' }} />

      {/* Website Visibility Controls Section */}
      <Section icon={VisibilityIcon} title="Website Visibility Controls" desc="Control which pages and sections are visible on the client website.">
        {visibilityLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#666' }}>
            <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p>Loading visibility settings...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            
            {/* Pages Section */}
            <div>
              <h3 style={{ fontSize: '13px', color: '#D4AF37', fontWeight: 600, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #1a1a1a', paddingBottom: '12px' }}>
                Pages
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Toggle label="Home" checked={visibility.pages?.home ?? true} onChange={() => toggleVisibility('pages', 'home')} />
                <Toggle label="About Us" checked={visibility.pages?.about ?? true} onChange={() => toggleVisibility('pages', 'about')} />
                <Toggle label="Services" checked={visibility.pages?.services ?? true} onChange={() => toggleVisibility('pages', 'services')} />
                <Toggle label="Insights" checked={visibility.pages?.insights ?? true} onChange={() => toggleVisibility('pages', 'insights')} />
                <Toggle label="Investor Relations" checked={visibility.pages?.investorRelations ?? true} onChange={() => toggleVisibility('pages', 'investorRelations')} />
                <Toggle label="Careers" checked={visibility.pages?.careers ?? true} onChange={() => toggleVisibility('pages', 'careers')} />
                <Toggle label="Contact" checked={visibility.pages?.contact ?? true} onChange={() => toggleVisibility('pages', 'contact')} />
                <Toggle label="FAQ" checked={visibility.pages?.faq ?? true} onChange={() => toggleVisibility('pages', 'faq')} />
                <Toggle label="Terms & Conditions" checked={visibility.pages?.terms ?? true} onChange={() => toggleVisibility('pages', 'terms')} />
                <Toggle label="Privacy Policy" checked={visibility.pages?.privacy ?? true} onChange={() => toggleVisibility('pages', 'privacy')} />
                <Toggle label="Client Login" checked={visibility.pages?.clientLogin ?? true} onChange={() => toggleVisibility('pages', 'clientLogin')} />
              </div>
            </div>

            {/* Home Sections */}
            <div>
              <h3 style={{ fontSize: '13px', color: '#D4AF37', fontWeight: 600, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #1a1a1a', paddingBottom: '12px' }}>
                Home Page Sections
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Toggle label="Hero Section" checked={visibility.homeSections?.hero ?? true} onChange={() => toggleVisibility('homeSections', 'hero')} />
                <Toggle label="Metal Rates Marquee" checked={visibility.homeSections?.metalRates ?? true} onChange={() => toggleVisibility('homeSections', 'metalRates')} />
                <Toggle label="About Preview" checked={visibility.homeSections?.aboutPreview ?? true} onChange={() => toggleVisibility('homeSections', 'aboutPreview')} />
                <Toggle label="Blackmont Advantage" checked={visibility.homeSections?.blackmontAdvantage ?? visibility.homeSections?.whyBlackmont ?? true} onChange={() => toggleVisibility('homeSections', 'blackmontAdvantage')} />
                <Toggle label="Who We Serve" checked={visibility.homeSections?.whoWeServe ?? true} onChange={() => toggleVisibility('homeSections', 'whoWeServe')} />
                <Toggle label="Services Preview" checked={visibility.homeSections?.servicesPreview ?? true} onChange={() => toggleVisibility('homeSections', 'servicesPreview')} />
                <Toggle label="Market Preview" checked={visibility.homeSections?.marketPreview ?? true} onChange={() => toggleVisibility('homeSections', 'marketPreview')} />
                <Toggle label="Insights Preview" checked={visibility.homeSections?.insightsPreview ?? true} onChange={() => toggleVisibility('homeSections', 'insightsPreview')} />
                <Toggle label="Contact CTA" checked={visibility.homeSections?.contactCta ?? true} onChange={() => toggleVisibility('homeSections', 'contactCta')} />
              </div>
            </div>

            {/* Investor Relations Sections */}
            <div>
              <h3 style={{ fontSize: '13px', color: '#D4AF37', fontWeight: 600, marginBottom: '18px', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #1a1a1a', paddingBottom: '12px' }}>
                Investor Relations Sections
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Toggle label="Overview" checked={visibility.investorSections?.overview ?? true} onChange={() => toggleVisibility('investorSections', 'overview')} />
                <Toggle label="Reports" checked={visibility.investorSections?.reports ?? true} onChange={() => toggleVisibility('investorSections', 'reports')} />
                <Toggle label="Stock Information" checked={visibility.investorSections?.stockInformation ?? true} onChange={() => toggleVisibility('investorSections', 'stockInformation')} />
                <Toggle label="Events & Presentations" checked={visibility.investorSections?.eventsPresentations ?? true} onChange={() => toggleVisibility('investorSections', 'eventsPresentations')} />
                <Toggle label="Corporate Governance" checked={visibility.investorSections?.corporateGovernance ?? true} onChange={() => toggleVisibility('investorSections', 'corporateGovernance')} />
              </div>
            </div>

            {/* Save Button */}
            <button onClick={saveVisibility} disabled={visibilitySaving} className="gold-btn"
              style={{ marginTop: '16px', padding: '14px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', borderRadius: '12px', width: '100%', justifyContent: 'center' }}>
              {visibilitySaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {visibilitySaving ? 'SAVING...' : 'SAVE VISIBILITY SETTINGS'}
            </button>
          </div>
        )}
      </Section>
    </div>
  );
}
