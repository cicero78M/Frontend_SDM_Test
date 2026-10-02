// Tabel user aktif dan tombol untuk membuka pengaturan role.
export function ApprovedUsersTable({ users, onPromote }) {
  return <div className="table-wrap"><table><thead><tr><th>Username</th><th>Role</th><th>Status</th><th>Dibuat</th><th>Aksi</th></tr></thead><tbody>
    {users.map(item => <tr key={item.id_user}>
      <td><strong>{item.username}</strong></td>
      <td><span className="badge">{item.role}</span></td>
      <td>Aktif</td>
      <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
      <td><button className="table-action" onClick={() => onPromote(item)}>Promote role</button></td>
    </tr>)}
    {!users.length && <tr><td colSpan="5" className="empty">Belum ada user disetujui.</td></tr>}
  </tbody></table></div>;
}
