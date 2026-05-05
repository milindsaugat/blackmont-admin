import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Users, Shield, UserCheck, UserX } from 'lucide-react';
import { clientService } from '../services/clientService';
import Modal from '../components/Modal';

const statusToBackend = (displayStatus) => {
  if (displayStatus === 'ACTIVE ACCESS') return 'active';
  if (displayStatus === 'SUSPENDED') return 'suspended';
  return displayStatus;
};

const statusFromBackend = (backendStatus) => {
  if (backendStatus === 'active') return 'ACTIVE ACCESS';
  if (backendStatus === 'suspended') return 'SUSPENDED';
  return backendStatus;
};

export default function AdminClients({ addToast }) {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', status: 'ACTIVE ACCESS', notes: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch clients on page load
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientService.getClients();
      setClients(data);
    } catch (error) {
      addToast?.(`Failed to load clients: ${error.message}`, 'error');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = clients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  const activeCount = clients.filter(c => c.status === 'active').length;
  const suspendedCount = clients.filter(c => c.status === 'suspended').length;

  const openAdd = () => {
    setEditingClient(null);
    setForm({ name: '', email: '', password: '', status: 'ACTIVE ACCESS', notes: '' });
    setShowPw(false);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingClient(c);
    setForm({
      name: c.name,
      email: c.email,
      password: '', // Don't show password in edit
      status: statusFromBackend(c.status),
      notes: c.notes || '',
    });
    setShowPw(false);
    setModalOpen(true);
  };

  const handleSave = async () => {
    // Validation
    if (!form.name || !form.email) {
      addToast?.('Name and email are required', 'error');
      return;
    }

    if (!editingClient && !form.password) {
      addToast?.('Password is required for new clients', 'error');
      return;
    }

    try {
      setIsSaving(true);

      if (editingClient) {
        // Edit mode - only send fields that were changed
        const payload = {
          name: form.name,
          email: form.email,
          status: statusToBackend(form.status),
          notes: form.notes,
        };

        // Only include password if user entered something new
        if (form.password && form.password.trim().length > 0) {
          payload.password = form.password;
        }

        await clientService.updateClient(editingClient._id, payload);
        addToast?.(`${form.name} updated successfully`, 'success');
      } else {
        // Create mode - send all required fields
        const payload = {
          name: form.name,
          email: form.email,
          password: form.password,
          status: statusToBackend(form.status),
          notes: form.notes,
        };

        await clientService.createClient(payload);
        addToast?.(`${form.name} created successfully`, 'success');
      }

      // Refresh list
      await fetchClients();
      setModalOpen(false);
    } catch (error) {
      addToast?.(`Error: ${error.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Revoke access for "${c.name}"? This action cannot be undone.`)) return;

    try {
      await clientService.deleteClient(c._id);
      addToast?.(`${c.name} access revoked`, 'success');
      // Refresh list
      await fetchClients();
    } catch (error) {
      addToast?.(`Error: ${error.message}`, 'error');
    }
  };

  const initials = (n) => n.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const statCards = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: '#D4AF37' },
    { label: 'Active Access', value: activeCount, icon: UserCheck, color: '#22c55e' },
    { label: 'Suspended', value: suspendedCount, icon: UserX, color: '#666' },
  ];

  // Show loading state
  if (loading) {
    return (
      <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ padding: '60px 0', color: '#555' }}>
          <div style={{ fontSize: '14px' }}>Loading clients...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }} className="animate-fade-in">
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: '6px', letterSpacing: '0.02em' }}>
            Client <span style={{ color: '#D4AF37', fontWeight: 500 }}>Portal</span>
          </h1>
          <p style={{ fontSize: '13px', color: '#555' }}>Manage login credentials, portfolio visibility, and client access permissions.</p>
        </div>
        <button onClick={openAdd} className="gold-btn" style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', borderRadius: '14px' }}>
          <Plus size={16} /> NEW CLIENT
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            padding: '20px 24px', background: '#0a0a0a', border: '1px solid #161616',
            borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '14px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: `${s.color}08`, border: `1px solid ${s.color}20`,
            }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize: '24px', color: '#fff', fontWeight: 600, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#333' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: '100%', height: '46px', paddingLeft: '46px', paddingRight: '16px',
              background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '14px',
              color: '#fff', fontSize: '13px', outline: 'none', fontFamily: 'var(--font-body)',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.3)'}
            onBlur={e => e.target.style.borderColor = '#1a1a1a'}
          />
        </div>
        <div style={{ fontSize: '11px', color: '#444', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>
          {filtered.length} RESULT{filtered.length !== 1 ? 'S' : ''}
        </div>
      </div>

      {/* Client Table */}
      <div style={{
        background: '#0a0a0a', border: '1px solid #161616', borderRadius: '20px',
        overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#070707', borderBottom: '1px solid #1a1a1a' }}>
              {['Client', 'Email', 'Status', 'Last Activity', 'Actions'].map((h, i) => (
                <th key={i} style={{
                  textAlign: 'left', padding: '16px 24px', fontSize: '9px',
                  letterSpacing: '0.2em', color: '#444', fontWeight: 800, textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '60px 0', color: '#333', fontSize: '14px', fontStyle: 'italic' }}>
                  No matching clients found.
                </td>
              </tr>
            ) : filtered.map(cl => (
              <tr key={cl._id}
                style={{ borderBottom: '1px solid #131313', transition: 'background 0.2s', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,175,55,0.015)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '14px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700,
                      background: cl.status === 'active' ? 'rgba(212,175,55,0.06)' : '#111',
                      border: `1px solid ${cl.status === 'active' ? 'rgba(212,175,55,0.15)' : '#1e1e1e'}`,
                      color: cl.status === 'active' ? '#D4AF37' : '#444',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {initials(cl.name)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff', fontFamily: 'var(--font-display)' }}>{cl.name}</div>
                      <div style={{ fontSize: '10px', color: '#444', fontFamily: 'var(--font-mono)', marginTop: '3px', letterSpacing: '0.05em' }}>
                        #{cl._id.toString().slice(-6)}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '13px', color: '#777' }}>{cl.email}</td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 12px', borderRadius: '8px', fontSize: '9px',
                    fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                    background: cl.status === 'active' ? 'rgba(34,197,94,0.06)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${cl.status === 'active' ? 'rgba(34,197,94,0.15)' : '#1e1e1e'}`,
                    color: cl.status === 'active' ? '#22c55e' : '#555',
                  }}>
                    <div style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: cl.status === 'active' ? '#22c55e' : '#444',
                    }} />
                    {statusFromBackend(cl.status)}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '11px', color: '#555', fontFamily: 'var(--font-mono)' }}>
                  {cl.lastLogin ? new Date(cl.lastLogin).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={e => { e.stopPropagation(); openEdit(cl); }}
                      title="Edit Account"
                      style={{
                        width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#555', background: '#0d0d0d', border: '1px solid #1a1a1a',
                        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.2)'; e.currentTarget.style.background = 'rgba(212,175,55,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#0d0d0d'; }}
                    >
                      <Edit size={14} />
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDelete(cl); }}
                      title="Revoke Access"
                      style={{
                        width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#555', background: '#0d0d0d', border: '1px solid #1a1a1a',
                        borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#ff5555'; e.currentTarget.style.borderColor = 'rgba(255,85,85,0.2)'; e.currentTarget.style.background = 'rgba(255,85,85,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#0d0d0d'; }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingClient ? 'EDIT CLIENT ACCOUNT' : 'PROVISION NEW CLIENT'} maxWidth="520px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '8px 0' }}>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>Full Legal Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Enter client's full name"
              style={{ width: '100%', height: '48px', background: '#080808', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', fontSize: '14px', padding: '0 16px', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>Primary Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="client@example.com"
              style={{ width: '100%', height: '48px', background: '#080808', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', fontSize: '14px', padding: '0 16px', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>Portal Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder={editingClient ? 'Leave blank to keep current password' : 'Secure password'}
                style={{ width: '100%', height: '48px', background: '#080808', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', fontSize: '14px', padding: '0 48px 0 16px', outline: 'none', fontFamily: 'var(--font-body)' }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>Account Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ width: '100%', height: '48px', background: '#080808', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', fontSize: '13px', padding: '0 16px', outline: 'none', fontFamily: 'var(--font-body)', appearance: 'none' }}>
              <option value="ACTIVE ACCESS">ACTIVE ACCESS</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '10px', color: '#555', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px', marginLeft: '4px' }}>
              Internal Notes <span style={{ color: '#333', fontWeight: 400, letterSpacing: '0.1em' }}>(Optional)</span>
            </label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
              placeholder="Private notes about this client's portfolio..."
              style={{ width: '100%', minHeight: '100px', background: '#080808', border: '1px solid #1a1a1a', borderRadius: '12px', color: '#fff', fontSize: '13px', padding: '14px 16px', outline: 'none', fontFamily: 'var(--font-body)', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #1a1a1a' }}>
            <button onClick={() => setModalOpen(false)} className="ghost-btn" style={{ flex: 1, justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em' }}>CANCEL</button>
            <button onClick={handleSave} disabled={isSaving} className="gold-btn" style={{ flex: 1, justifyContent: 'center', padding: '14px', borderRadius: '12px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', opacity: isSaving ? 0.6 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }}>{isSaving ? 'SAVING...' : (editingClient ? 'UPDATE' : 'PROVISION')}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
