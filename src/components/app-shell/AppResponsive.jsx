// Orkestrasi sesi, halaman utama, dan panel overlay aplikasi.
import { useEffect, useState } from 'react';
import { request } from '../../api';
import { Login } from '../auth';
import { PersonnelDashboardPage } from '../dashboard';
import { AuditLogPage, PasswordPanel, ScopeManagementPage } from '../administration';
import { CareerProfilePanel, PersonPanel } from '../personnel';
import { AppSidebar } from './AppSidebar';
import { PersonnelPage } from './PersonnelPage';
import { usePersonnelList } from './usePersonnelList';
import { UserProfilePage } from '../profile';
import { RagAssistantPage } from '../rag';

export function AppResponsive() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [guestRag, setGuestRag] = useState(false);
  const [page, setPage] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [editor, setEditor] = useState(null);
  const [passwordPanel, setPasswordPanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { people, meta, search, setSearch, load, filters, updateFilter, resetFilters, statusOptions, listError, statusError } = usePersonnelList(user, page);
  const canEdit = user && ['admin', 'admin_ssdm', 'editor', 'operator_polda', 'operator_satker', 'operator_polres'].includes(user.role);

  // Pulihkan sesi dari token yang tersimpan agar refresh browser/reload frontend
  // tidak memaksa user login ulang. Backend tetap memvalidasi signature dan user aktif.
  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('sdm_token');
    if (!token) {
      setAuthReady(true);
      return () => { mounted = false; };
    }
    request('/auth/me')
      .then(result => { if (mounted) setUser(result.user); })
      .catch(() => {
        localStorage.removeItem('sdm_token');
        if (mounted) setUser(null);
      })
      .finally(() => { if (mounted) setAuthReady(true); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('sdm_token');
      setUser(null);
    };
    window.addEventListener('sdm:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('sdm:unauthorized', handleUnauthorized);
  }, []);

  if (!authReady) return <main className="content"><p className="muted">Memulihkan sesi…</p></main>;
  if (!user && guestRag) return <main className="content guest-rag-content"><button className="back-link" type="button" onClick={() => setGuestRag(false)}>← Kembali ke login</button><RagAssistantPage /></main>;
  if (!user) return <Login onLogin={setUser} onChat={() => setGuestRag(true)} />;

  function logout() { localStorage.removeItem('sdm_token'); setUser(null); setSidebarOpen(false); }
  function go(next) { setPage(next); setSidebarOpen(false); }
  function openPasswordPanel() { setPasswordPanel(true); setSidebarOpen(false); }
  const adminPage = page === 'scopes' && ['admin', 'admin_ssdm'].includes(user.role);
  return <div className={`shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
    <AppSidebar user={user} page={page} sidebarOpen={sidebarOpen} onNavigate={go} onLogout={logout} onOpen={() => setSidebarOpen(true)} onClose={() => setSidebarOpen(false)} />
    <main className="content">
      {page === 'dashboard' ? <PersonnelDashboardPage user={user} /> : page === 'rag' ? <RagAssistantPage /> : page === 'audit' ? <AuditLogPage /> : page === 'profile' ? <UserProfilePage user={user} onPassword={openPasswordPanel} /> : adminPage ? <ScopeManagementPage /> : <PersonnelPage user={user} canEdit={canEdit} people={people} meta={meta} search={search} onSearch={setSearch} onLoad={load} filters={filters} statusOptions={statusOptions} listError={listError} statusError={statusError} onFilterChange={updateFilter} onResetFilters={resetFilters} onProfile={setProfile} onEdit={setEditor} />}
      {passwordPanel && <PasswordPanel onClose={() => setPasswordPanel(false)} />}
      {profile && <CareerProfilePanel person={profile} userRole={user?.role} canEdit={canEdit} onClose={() => setProfile(null)} />}
      {editor && <PersonPanel person={editor} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); load(meta.page); }} />}
    </main>
  </div>;
}
