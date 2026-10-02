export function AppSidebar({ user, page, sidebarOpen, onNavigate, onLogout, onPassword, onOpen, onClose }) {
  const canManageScope = ['admin', 'admin_ssdm'].includes(user.role);

  return <>
    <button className="menu-toggle" onClick={onOpen} aria-label="Buka menu">☰</button>
    {sidebarOpen && <button className="sidebar-scrim" onClick={onClose} aria-label="Tutup menu" />}
    <aside><div className="brand"><span className="brand-mark">M</span><div><strong>MERIT SYSTEM</strong><small>PERSONEL POLRI</small></div><button className="sidebar-close" onClick={onClose} aria-label="Tutup menu">×</button></div><nav>
      <a className={page === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>◈ Visualisasi Data</a>
      <a className={page === 'people' ? 'active' : ''} onClick={() => onNavigate('people')}>♙ Data Personel</a>
      {canManageScope && <a className={page === 'scopes' ? 'active' : ''} onClick={() => onNavigate('scopes')}>⌖ Scope Organisasi</a>}
      <a onClick={onPassword}>⚙ Ganti password</a>
    </nav><div className="user-box"><strong>{user.username}</strong><small>{user.role}</small><button onClick={onLogout}>Keluar</button></div></aside>
  </>;
}
