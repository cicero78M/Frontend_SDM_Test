// Orkestrasi sesi, halaman utama, dan panel overlay aplikasi.
import { useState } from 'react';
import { Login } from '../auth';
import { PersonnelDashboardPage } from '../dashboard';
import { PasswordPanel, ScopeManagementPage } from '../administration';
import { CareerProfilePanel, PersonPanel } from '../personnel';
import { AppSidebar } from './AppSidebar';
import { PersonnelPage } from './PersonnelPage';
import { usePersonnelList } from './usePersonnelList';

export function AppResponsive() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [editor, setEditor] = useState(null);
  const [passwordPanel, setPasswordPanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { people, meta, search, setSearch, load, filters, updateFilter, applyFilters, resetFilters } = usePersonnelList(user, page);
  const canEdit = user && ['admin', 'admin_ssdm', 'editor', 'operator_polda', 'operator_satker', 'operator_polres'].includes(user.role);

  if (!user) return <Login onLogin={setUser} />;

  function logout() { localStorage.removeItem('sdm_token'); setUser(null); setSidebarOpen(false); }
  function go(next) { setPage(next); setSidebarOpen(false); }
  const adminPage = page === 'scopes' && ['admin', 'admin_ssdm'].includes(user.role);
  return <div className={`shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
    <AppSidebar user={user} page={page} sidebarOpen={sidebarOpen} onNavigate={go} onLogout={logout} onPassword={() => { setPasswordPanel(true); setSidebarOpen(false); }} onOpen={() => setSidebarOpen(true)} onClose={() => setSidebarOpen(false)} />
    <main className="content">
      {page === 'dashboard' ? <PersonnelDashboardPage user={user} /> : adminPage ? <ScopeManagementPage /> : <PersonnelPage user={user} canEdit={canEdit} people={people} meta={meta} search={search} onSearch={setSearch} onLoad={load} filters={filters} onFilterChange={updateFilter} onApplyFilters={applyFilters} onResetFilters={resetFilters} onProfile={setProfile} onEdit={setEditor} />}
      {passwordPanel && <PasswordPanel onClose={() => setPasswordPanel(false)} />}
      {profile && <CareerProfilePanel person={profile} userRole={user?.role} canEdit={canEdit} onClose={() => setProfile(null)} />}
      {editor && <PersonPanel person={editor} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); load(meta.page); }} />}
    </main>
  </div>;
}
