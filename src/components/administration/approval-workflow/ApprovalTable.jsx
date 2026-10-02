// Tabel pendaftaran pending beserta kontrol role dan keputusan approval.
import { ApprovalIdentityCell } from './ApprovalIdentityCell';
import { ApprovalRoleOptions } from './approvalRoles.jsx';

export function ApprovalTable({ items, roles, onRoleChange, onDecision }) {
  return <div className="table-wrap"><table><thead><tr><th>Identitas</th><th>Username</th><th>Role awal</th><th>Tetapkan role</th><th>Aksi</th></tr></thead><tbody>
    {items.map(item => <tr key={item.id_registration}>
      <ApprovalIdentityCell item={item} />
      <td>{item.username}</td>
      <td><span className="badge">{item.requested_role}</span></td>
      <td><select value={roles[item.id_registration] || 'viewer'} onChange={event => onRoleChange(item.id_registration, event.target.value)}><ApprovalRoleOptions /></select></td>
      <td className="actions-cell"><button onClick={() => onDecision(item, 'reject')}>Tolak</button><button className="primary" onClick={() => onDecision(item, 'approve')}>Setujui</button></td>
    </tr>)}
    {!items.length && <tr><td colSpan="5" className="empty">Tidak ada pendaftaran yang menunggu approval.</td></tr>}
  </tbody></table></div>;
}
