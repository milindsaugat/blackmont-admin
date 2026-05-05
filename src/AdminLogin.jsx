import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(0);
  const [resetLoading, setResetLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!isForgotMode || !otpSent || otpVerified || otpTimer <= 0) return undefined;

    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isForgotMode, otpSent, otpVerified, otpTimer]);

  const formatTimer = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getApiMessage = async (response) => {
    const body = await response.json().catch(() => ({}));
    return body.message || body.error || 'Something went wrong. Please try again.';
  };

  const resetForgotState = () => {
    setIsForgotMode(false);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp(['', '', '', '', '', '']);
    setOtpTimer(0);
    setNewPassword('');
    setConfirmPassword('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const enterForgotMode = () => {
    setError('');
    setSuccess('');
    setIsForgotMode(true);
    setOtpSent(false);
    setOtpVerified(false);
    setOtp(['', '', '', '', '', '']);
    setOtpTimer(0);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid credentials. Please verify and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/forgot-password/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        setError(await getApiMessage(response));
        return;
      }

      setOtpSent(true);
      setOtpVerified(false);
      setOtp(['', '', '', '', '', '']);
      setOtpTimer(300);
      setSuccess('OTP sent successfully. Check your email.');
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch {
      setError('Unable to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setVerifyLoading(true);

    try {
      const joinedOtp = otp.join('');
      const response = await fetch(`${API_BASE_URL}/api/admin/forgot-password/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: joinedOtp }),
      });

      if (!response.ok) {
        setError(await getApiMessage(response));
        return;
      }

      setOtpVerified(true);
      setOtpTimer(0);
      setSuccess('OTP verified. Set your new password.');
    } catch {
      setError('Unable to verify OTP. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/forgot-password/reset-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp: otp.join(''),
          newPassword,
          confirmPassword,
        }),
      });

      if (!response.ok) {
        setError(await getApiMessage(response));
        return;
      }

      setPassword('');
      setSuccess('Password reset successfully. Returning to sign in...');
      setTimeout(() => {
        resetForgotState();
        setSuccess('');
      }, 1800);
    } catch {
      setError('Unable to reset password. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const nextOtp = ['', '', '', '', '', ''];
    pasted.split('').forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    otpRefs.current[Math.min(pasted.length, 6) - 1]?.focus();
  };

  const messageBlock = (type, text) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 18px', marginBottom: '24px',
      background: type === 'success' ? 'rgba(34,197,94,0.05)' : 'rgba(255,70,70,0.04)',
      border: type === 'success' ? '1px solid rgba(34,197,94,0.16)' : '1px solid rgba(255,70,70,0.12)',
      borderRadius: '14px',
    }}>
      <div style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: type === 'success' ? '#22c55e' : '#ff4646',
        flexShrink: 0,
      }} />
      <span style={{
        fontSize: '12px',
        color: type === 'success' ? '#86efac' : '#ff6b6b',
        fontWeight: 500,
      }}>{text}</span>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
      background: '#030303',
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0,
      }}>
        <div style={{
          position: 'absolute', top: '15%', left: '20%', width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(80px)',
          animation: 'pulse 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%', width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.03) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animation: 'pulse 10s ease-in-out infinite reverse',
        }} />
        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.015,
          backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-card { animation: fadeUp 0.6s ease-out; }
        .mode-panel { animation: fadeUp 0.28s ease-out; }
        .login-input { 
          width: 100%; height: 56px; background: #080808; border: 1px solid #1a1a1a; 
          border-radius: 14px; color: #fff; font-size: 14px; padding: 0 20px;
          font-family: var(--font-body); outline: none; transition: all 0.3s ease;
        }
        .login-input:focus { border-color: rgba(212,175,55,0.4); box-shadow: 0 0 0 3px rgba(212,175,55,0.06); }
        .login-input::placeholder { color: #333; }
        .login-btn {
          width: 100%; height: 56px; border: none; border-radius: 14px; cursor: pointer;
          font-size: 13px; font-weight: 700; letter-spacing: 0.2em; color: #000;
          background: linear-gradient(135deg, #D4AF37 0%, #B8962E 50%, #D4AF37 100%);
          background-size: 200% 200%; transition: all 0.4s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 4px 20px rgba(212,175,55,0.2);
        }
        .login-btn:hover:not(:disabled) { background-position: 100% 100%; box-shadow: 0 8px 30px rgba(212,175,55,0.3); transform: translateY(-1px); }
        .login-btn:disabled { opacity: 0.7; cursor: wait; }
        .ghost-btn {
          width: 100%; height: 48px; border-radius: 14px; cursor: pointer;
          border: 1px solid rgba(212,175,55,0.16); color: #D4AF37;
          background: rgba(212,175,55,0.03); font-size: 11px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; transition: all 0.25s ease;
        }
        .ghost-btn:hover:not(:disabled) { border-color: rgba(212,175,55,0.36); background: rgba(212,175,55,0.08); }
        .ghost-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .otp-input {
          width: 48px; height: 54px; background: #080808; border: 1px solid #1a1a1a;
          border-radius: 14px; color: #fff; font-size: 20px; text-align: center;
          font-weight: 700; outline: none; transition: all 0.3s ease;
        }
        .otp-input:focus { border-color: rgba(212,175,55,0.5); box-shadow: 0 0 0 3px rgba(212,175,55,0.08); }
      `}</style>

      <div className="login-card" style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 10 }}>
        {/* Logo & Brand */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '88px', height: '88px', margin: '0 auto 24px',
            borderRadius: '24px', overflow: 'hidden',
            background: 'rgba(212,175,55,0.03)',
            border: '1px solid rgba(212,175,55,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 60px rgba(212,175,55,0.06)',
          }}>
            <img src="/favicon.png" alt="Blackmont" style={{ width: '62px', height: '62px', objectFit: 'contain' }} />
          </div>
          <h1 style={{
            fontSize: '30px', color: '#fff', fontWeight: 300, letterSpacing: '0.25em',
            fontFamily: 'var(--font-display)', marginBottom: '8px',
          }}>
            BLACK<span style={{ color: '#D4AF37', fontWeight: 500 }}>MONT</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.3))' }} />
            <span style={{ fontSize: '9px', color: '#444', letterSpacing: '0.5em', fontWeight: 700, textTransform: 'uppercase' }}>
              Admin Portal
            </span>
            <div style={{ height: '1px', width: '40px', background: 'linear-gradient(90deg, rgba(212,175,55,0.3), transparent)' }} />
          </div>
        </div>

        {/* Login Card */}
        <div style={{
          padding: '44px 40px',
          background: 'linear-gradient(180deg, rgba(12,12,12,0.95) 0%, rgba(8,8,8,0.98) 100%)',
          border: '1px solid #1a1a1a',
          borderRadius: '28px',
          backdropFilter: 'blur(40px)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)',
        }}>
          {!isForgotMode ? (
            <div className="mode-panel">
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="login-input" placeholder="admin@blackmont.com" required
                  />
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input" style={{ paddingRight: '52px' }}
                      placeholder="************" required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: '#444', cursor: 'pointer',
                        transition: 'color 0.2s', padding: '4px',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                      onMouseLeave={e => e.currentTarget.style.color = '#444'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                  <button
                    type="button"
                    onClick={enterForgotMode}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#D4AF37',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      padding: '4px',
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                {error && messageBlock('error', error)}
                {success && messageBlock('success', success)}

                <button type="submit" disabled={loading} className="login-btn">
                  {loading ? (
                    <>
                      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>SIGNING IN...</span>
                    </>
                  ) : (
                    <>
                      <span>SIGN IN</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Credentials */}
              <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '1px solid #151515' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, #1a1a1a)' }} />
                  <span style={{ fontSize: '8px', color: '#333', letterSpacing: '0.3em', fontWeight: 800, textTransform: 'uppercase' }}>Demo Access</span>
                  <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, #1a1a1a, transparent)' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ padding: '14px 16px', background: '#070707', border: '1px solid #141414', borderRadius: '14px' }}>
                    <div style={{ fontSize: '8px', color: '#333', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Email</div>
                    <div style={{ fontSize: '11px', color: '#666', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>admin@blackmont.com</div>
                  </div>
                  <div style={{ padding: '14px 16px', background: '#070707', border: '1px solid #141414', borderRadius: '14px' }}>
                    <div style={{ fontSize: '8px', color: '#333', letterSpacing: '0.2em', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>Password</div>
                    <div style={{ fontSize: '11px', color: '#666', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>blackmont2026</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mode-panel">
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: 400,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}>
                  Reset Access
                </h2>
                <p style={{ color: '#555', fontSize: '12px', lineHeight: 1.7 }}>
                  Enter your admin email to receive a secure verification code.
                </p>
              </div>

              {!otpSent && (
                <form onSubmit={handleSendOtp}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input"
                      placeholder="admin@blackmont.com"
                      required
                    />
                  </div>

                  {error && messageBlock('error', error)}
                  {success && messageBlock('success', success)}

                  <button type="submit" disabled={loading} className="login-btn">
                    {loading ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <span>SEND OTP</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {otpSent && !otpVerified && (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px', marginLeft: '4px' }}>
                      Verification Code
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { otpRefs.current[index] = el; }}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          onPaste={handleOtpPaste}
                          className="otp-input"
                          inputMode="numeric"
                          maxLength={1}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || otpTimer > 0}
                      className="ghost-btn"
                    >
                      {loading ? 'SENDING...' : otpTimer > 0 ? `RESEND OTP IN ${formatTimer(otpTimer)}` : 'RESEND OTP'}
                    </button>
                  </div>

                  {error && messageBlock('error', error)}
                  {success && messageBlock('success', success)}

                  <button type="submit" disabled={verifyLoading || otp.join('').length !== 6} className="login-btn">
                    {verifyLoading ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>VERIFYING...</span>
                      </>
                    ) : (
                      <>
                        <span>VERIFY OTP</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {otpVerified && (
                <form onSubmit={handleResetPassword}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="login-input"
                        style={{ paddingRight: '52px' }}
                        placeholder="************"
                        required
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                        style={{
                          position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#444', cursor: 'pointer',
                          transition: 'color 0.2s', padding: '4px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                        onMouseLeave={e => e.currentTarget.style.color = '#444'}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.25em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="login-input"
                        style={{ paddingRight: '52px' }}
                        placeholder="************"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#444', cursor: 'pointer',
                          transition: 'color 0.2s', padding: '4px',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#D4AF37'}
                        onMouseLeave={e => e.currentTarget.style.color = '#444'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && messageBlock('error', error)}
                  {success && messageBlock('success', success)}

                  <button type="submit" disabled={resetLoading} className="login-btn">
                    {resetLoading ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        <span>RESETTING...</span>
                      </>
                    ) : (
                      <>
                        <span>RESET PASSWORD</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={resetForgotState}
                style={{
                  width: '100%',
                  marginTop: '20px',
                  background: 'none',
                  border: 'none',
                  color: '#555',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 800,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p style={{
          textAlign: 'center', fontSize: '9px', color: '#222', letterSpacing: '0.35em',
          fontWeight: 700, textTransform: 'uppercase', marginTop: '40px',
        }}>
          (c) 2026 Blackmont Capital - Secured Infrastructure
        </p>
      </div>
    </div>
  );
}
