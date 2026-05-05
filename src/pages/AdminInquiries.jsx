import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Trash2, Eye, CheckSquare, Square, Loader2, AlertCircle } from 'lucide-react';
import DataTable from '../components/DataTable';
import InquiryDrawer from '../components/InquiryDrawer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getAdminToken = () => localStorage.getItem('adminToken');

const parseApiResponse = async (response) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(body.message || 'Inquiry API request failed');
    error.status = response.status;
    throw error;
  }

  return body;
};

export default function AdminInquiries({ addToast }) {
  const [inquiries, setInquiries] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const perPage = 8;

  const adminRequest = useCallback(async (path, options = {}) => {
    const token = getAdminToken();

    if (!token) {
      const authError = new Error('Admin session token missing. Please sign in again.');
      authError.status = 401;
      throw authError;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    return parseApiResponse(response);
  }, []);

  const handleAuthFailure = useCallback((apiError) => {
    if (apiError.status === 401 || apiError.status === 403) {
      setError('Admin session expired or invalid. Please sign in again.');
      addToast?.('Admin session expired. Please sign in again.', 'error');
      return true;
    }

    return false;
  }, [addToast]);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const body = await adminRequest('/api/admin/inquiries');
      setInquiries(body.inquiries || []);
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || 'Failed to fetch inquiries.');
        addToast?.(apiError.message || 'Failed to fetch inquiries', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [addToast, adminRequest, handleAuthFailure]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const filtered = useMemo(() => {
    let result = [...inquiries];
    if (filter !== 'all') result = result.filter(i => i.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.email || '').toLowerCase().includes(q) ||
        (i.phone || '').toLowerCase().includes(q) ||
        (i.company || '').toLowerCase().includes(q) ||
        (i.message || '').toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [inquiries, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered
    .slice((currentPage - 1) * perPage, currentPage * perPage)
    .map((inquiry, index) => ({
      ...inquiry,
      id: inquiry._id,
      serial: (currentPage - 1) * perPage + index + 1,
    }));

  const updateInquiryStatus = async (id, status) => {
    setActionLoading(`${id}-${status}`);
    setError('');

    try {
      const body = await adminRequest(`/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      const updatedInquiry = body.inquiry;
      setInquiries(prev => prev.map(item => item._id === id ? updatedInquiry : item));
      if (selectedInquiry?._id === id) setSelectedInquiry(updatedInquiry);
      addToast?.(`Inquiry marked as ${status}`);
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || 'Failed to update inquiry status.');
        addToast?.(apiError.message || 'Failed to update inquiry status', 'error');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const deleteInquiry = async (id, options = {}) => {
    if (!options.skipConfirm && !window.confirm('Are you sure you want to delete this inquiry?')) return;
    setActionLoading(`${id}-delete`);
    setError('');

    try {
      await adminRequest(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
      setInquiries(prev => prev.filter(item => item._id !== id));
      if (selectedInquiry?._id === id) {
        setSelectedInquiry(null);
        setDrawerOpen(false);
      }
      addToast?.('Inquiry deleted successfully');
    } catch (apiError) {
      if (!handleAuthFailure(apiError)) {
        setError(apiError.message || 'Failed to delete inquiry.');
        addToast?.(apiError.message || 'Failed to delete inquiry', 'error');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const getInitials = (name = '') => name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'BM';

  const columns = [
    { key: 'serial', label: '#', width: '50px', render: (v) => <span style={{ fontFamily: 'var(--font-mono)', color: '#444', fontSize: '12px' }}>{v}</span> },
    {
      key: 'name', label: 'Name', width: '190px',
      render: (v, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <span className="text-[10px] font-medium text-[#D4AF37]">{getInitials(v)}</span>
          </div>
          <span className="text-[13px] text-white font-medium">{v}</span>
          {row.status === 'unread' && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
        </div>
      ),
    },
    { key: 'email', label: 'Email', width: '210px', render: (v) => <span className="text-[13px] text-[#888]">{v}</span> },
    { key: 'phone', label: 'Phone', width: '130px', render: (v) => <span className="text-[12px] text-[#777]">{v || '-'}</span> },
    { key: 'company', label: 'Company', width: '150px', render: (v) => <span className="text-[12px] text-[#777]">{v || '-'}</span> },
    {
      key: 'createdAt', label: 'Date', width: '130px',
      render: (v) => <span className="text-[12px] text-[#666]" style={{ fontFamily: 'var(--font-mono)' }}>{new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>,
    },
    {
      key: 'status', label: 'Status', width: '110px',
      render: (v) => {
        const map = {
          unread: { label: 'NEW', bg: 'rgba(212,175,55,0.15)', border: 'rgba(212,175,55,0.3)', color: '#D4AF37' },
          read: { label: 'READ', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', color: '#22c55e' },
        };
        const s = map[v] || map.unread;
        return (
          <span
            className="text-[9px] tracking-[0.15em] uppercase font-medium px-[7px] py-[3px]"
            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color, borderRadius: '4px', fontFamily: 'var(--font-mono)' }}
          >
            {s.label}
          </span>
        );
      },
    },
    {
      key: 'actions', label: 'Actions', width: '150px',
      render: (_, row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => updateInquiryStatus(row._id, row.status === 'read' ? 'unread' : 'read')}
            disabled={Boolean(actionLoading)}
            title={row.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}
            style={{ padding: '6px', borderRadius: '6px', background: 'rgba(212,175,55,0.05)', color: 'var(--gold)', border: '1px solid var(--gold-20)', cursor: 'pointer', opacity: actionLoading ? 0.6 : 1 }}
          >
            {row.status === 'read' ? <Square size={14} /> : <CheckSquare size={14} />}
          </button>
          <button
            onClick={() => deleteInquiry(row._id)}
            disabled={Boolean(actionLoading)}
            title="Delete"
            style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,85,85,0.05)', color: '#ff5555', border: '1px solid rgba(255,85,85,0.2)', cursor: 'pointer', opacity: actionLoading ? 0.6 : 1 }}
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => { setSelectedInquiry(row); setDrawerOpen(true); }}
            title="View Details"
            style={{ padding: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: '#888', border: '1px solid #2a2a2a', cursor: 'pointer' }}
          >
            <Eye size={14} />
          </button>
        </div>
      ),
    },
  ];

  const filters = [
    { key: 'all', label: 'All', count: inquiries.length },
    { key: 'unread', label: 'Unread', count: inquiries.filter(i => i.status === 'unread').length },
    { key: 'read', label: 'Read', count: inquiries.filter(i => i.status === 'read').length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5 p-1" style={{ background: '#111111', border: '1px solid #1E1E1E', borderRadius: '12px' }}>
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setCurrentPage(1); }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200"
              style={{
                borderRadius: '8px',
                background: filter === f.key ? 'rgba(212,175,55,0.1)' : 'transparent',
                color: filter === f.key ? '#D4AF37' : '#555',
                fontFamily: 'var(--font-body)',
              }}
            >
              {f.label}
              <span className="text-[10px]" style={{ color: filter === f.key ? 'rgba(212,175,55,0.5)' : '#333', fontFamily: 'var(--font-mono)' }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <button onClick={fetchInquiries} disabled={loading} className="ghost-btn" style={{ padding: '8px 14px', fontSize: 12 }}>
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          Refresh
        </button>
        <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search inquiries..."
            className="input-field pl-9 text-[13px]"
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="card flex items-center gap-3 p-8 text-sm text-[#777]">
          <Loader2 size={18} className="animate-spin text-[#D4AF37]" />
          Loading inquiries...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paged}
          onRowClick={(row) => { setSelectedInquiry(row); setDrawerOpen(true); }}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <InquiryDrawer
        inquiry={selectedInquiry}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onMarkRead={(id) => updateInquiryStatus(id, 'read')}
        onMarkUnread={(id) => updateInquiryStatus(id, 'unread')}
        onDelete={(id) => deleteInquiry(id, { skipConfirm: true })}
      />
    </div>
  );
}
