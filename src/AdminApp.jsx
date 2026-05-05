import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';
import AdminLogin from './AdminLogin';
import AdminSidebar from './layout/AdminSidebar';
import AdminHeader from './layout/AdminHeader';
import AdminDashboard from './pages/AdminDashboard';
import AdminPageEditor from './pages/AdminPageEditor';
import AdminInquiries from './pages/AdminInquiries';
import AdminClients from './pages/AdminClients';
import AdminSettings from './pages/AdminSettings';
import ApiSettings from './pages/ApiSettings';
import AdminFooterSettings from './pages/AdminFooterSettings';
import StandaloneHomeEditor from './pages/HomeEditor/StandaloneHomeEditor';
import StandaloneAboutEditor from './pages/AboutEditor/StandaloneAboutEditor';
import StandaloneInsightsEditor from './pages/InsightsEditor/StandaloneInsightsEditor';
import StandaloneCareersEditor from './pages/CareersEditor/StandaloneCareersEditor';
import AdminApplications from './pages/CareersEditor/AdminApplications';
import StandaloneIREditor from './pages/IREditor/StandaloneIREditor';
import StandaloneLegalEditor from './pages/LegalEditor/StandaloneLegalEditor';
import StandaloneContactEditor from './pages/ContactEditor/StandaloneContactEditor';
import Toast from './components/Toast';

export default function AdminApp() {
  const { isAuthenticated, logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  /* Close mobile menu on route change */
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  /* Close mobile menu on resize to desktop */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (!isAuthenticated) return <AdminLogin />;

  const isPageEditor = location.pathname.startsWith('/pages/') || location.pathname === '/home-editor' || location.pathname === '/about-editor' || location.pathname === '/insights-editor' || location.pathname === '/careers-editor' || location.pathname === '/careers-applications' || location.pathname === '/ir-editor' || location.pathname === '/legal' || location.pathname === '/contact-editor';
  const sidebarWidth = sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-w)';

  return (
    <div className="min-h-screen main-bg">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="sidebar-overlay active" onClick={() => setMobileMenuOpen(false)} />
      )}

      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={logout}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <AdminHeader
        collapsed={sidebarCollapsed}
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        onLogout={logout}
      />

      <main
        style={{
          paddingTop: 'var(--header-h)',
          paddingLeft: sidebarWidth,
          minHeight: '100vh',
          transition: 'padding-left 300ms ease',
        }}
      >
        <div
          style={{
            padding: isPageEditor ? 0 : 'var(--sp-6)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/home-editor" element={<StandaloneHomeEditor addToast={addToast} />} />
            <Route path="/about-editor" element={<StandaloneAboutEditor />} />
            <Route path="/insights-editor" element={<StandaloneInsightsEditor />} />
            <Route path="/careers-editor" element={<StandaloneCareersEditor />} />
            <Route path="/careers-applications" element={<AdminApplications />} />
            <Route path="/ir-editor" element={<StandaloneIREditor />} />
            <Route path="/legal" element={<StandaloneLegalEditor addToast={addToast} />} />
            <Route path="/contact-editor" element={<StandaloneContactEditor />} />
            <Route path="/pages/:pageKey" element={<AdminPageEditor addToast={addToast} />} />
            <Route path="/inquiries" element={<AdminInquiries addToast={addToast} />} />
            <Route path="/clients" element={<AdminClients addToast={addToast} />} />
            <Route path="/settings" element={<AdminSettings addToast={addToast} />} />
            <Route path="/api-settings" element={<ApiSettings />} />
            <Route path="/footer-settings" element={<AdminFooterSettings addToast={addToast} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
