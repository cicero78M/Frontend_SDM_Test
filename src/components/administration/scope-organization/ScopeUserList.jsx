export function ScopeUserList({ users, selected, choose }) {
  return (
    <div className="panel">
      <h2>Daftar user</h2>
      <div className="scope-user-list">
        {users.map(item => (
          <button key={item.id_user} className={selected?.id_user === item.id_user ? 'selected' : ''} onClick={() => choose(item)}>
            <strong>{item.username}</strong><small>{item.role}</small>
          </button>
        ))}
        {!users.length && <p className="muted">Belum ada user aktif.</p>}
      </div>
    </div>
  );
}
