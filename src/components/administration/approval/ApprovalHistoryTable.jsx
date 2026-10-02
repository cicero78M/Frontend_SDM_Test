// Tabel audit keputusan approval yang sudah diproses.
import { ApprovalIdentityCell } from './ApprovalIdentityCell';

export function ApprovalHistoryTable({ items }) {
  return <div className="table-wrap"><table><thead><tr><th>Identitas</th><th>Username</th><th>Status</th><th>Role akhir</th><th>Aktor</th><th>Waktu</th><th>Catatan</th></tr></thead><tbody>
    {items.map(item => <tr key={item.id_registration}>
      <ApprovalIdentityCell item={item} />
      <td>{item.username}</td>
      <td><span className="badge">{item.status === 'approved' ? 'Disetujui' : 'Ditolak'}</span></td>
      <td>{item.approved_role || '-'}</td>
      <td>{item.reviewer_username || '-'}</td>
      <td>{item.reviewed_at ? new Date(item.reviewed_at).toLocaleString('id-ID') : '-'}</td>
      <td>{item.review_note || '-'}</td>
    </tr>)}
    {!items.length && <tr><td colSpan="7" className="empty">Belum ada riwayat persetujuan.</td></tr>}
  </tbody></table></div>;
}
