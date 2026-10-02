// Tabel pendaftaran pending beserta kontrol role dan keputusan approval.
import { ApprovalIdentityCell } from './ApprovalIdentityCell';
import { ApprovalRoleOptions } from './approvalRoles.jsx';

export function ApprovalTable({ items, roles, scopes, satkers, scopeSearch, deciding, onRoleChange, onScopeChange, onDecision }) {
  const normalizedSearch = String(scopeSearch || '').trim().toLocaleLowerCase();
  const matchingSatkers = satkers.filter(satker => !normalizedSearch || String(satker.label || satker.nama_satker || '').toLocaleLowerCase().includes(normalizedSearch));
  const scopeData = item => {
    const selectedValues = (scopes[item.id_registration] || (item.id_satker ? [String(item.id_satker)] : [])).map(String);
    const selectedSatkers = satkers.filter(satker => selectedValues.includes(String(satker.id_satker)));
    const options = [...new Map([...selectedSatkers, ...matchingSatkers].map(satker => [satker.id_satker, satker])).values()];
    return { selectedValues, options };
  };

  return <>
    <div className="table-wrap approval-table-wrap"><table><thead><tr><th>Identitas</th><th>Username</th><th>Role awal</th><th>Tetapkan role</th><th>Scope organisasi</th><th>Aksi</th></tr></thead><tbody>
    {items.map(item => {
      const { selectedValues, options } = scopeData(item);
      return <tr key={item.id_registration}>
      <ApprovalIdentityCell item={item} />
      <td>{item.username}</td>
      <td><span className="badge">{item.requested_role}</span></td>
      <td><select value={roles[item.id_registration] || 'operator_satker'} onChange={event => onRoleChange(item.id_registration, event.target.value)}><ApprovalRoleOptions /></select></td>
      <td><select multiple size="4" value={selectedValues} onChange={event => onScopeChange(item.id_registration, Array.from(event.target.selectedOptions, option => Number(option.value)))} aria-label={`Scope organisasi ${item.username}`}>{options.map(satker => <option key={satker.id_satker} value={satker.id_satker}>{satker.label}</option>)}</select><small className="scope-grant-note">Grant otomatis: {item.satker_asal || 'Satker registrasi'}</small>{!matchingSatkers.length && <small className="muted">Scope tidak ditemukan.</small>}</td>
      <td className="actions-cell"><button disabled={deciding[item.id_registration]} onClick={() => onDecision(item, 'reject')}>{deciding[item.id_registration] ? 'Memproses…' : 'Tolak'}</button><button className="primary" disabled={deciding[item.id_registration]} onClick={() => onDecision(item, 'approve')}>{deciding[item.id_registration] ? 'Memproses…' : 'Setujui'}</button></td>
    </tr>;
    })}
    {!items.length && <tr><td colSpan="6" className="empty">Tidak ada pendaftaran yang menunggu approval.</td></tr>}
    </tbody></table></div>
    <div className="approval-cards">
      {items.map(item => <ApprovalUserCard key={item.id_registration} item={item} roles={roles} scopeData={scopeData(item)} deciding={deciding} onRoleChange={onRoleChange} onScopeChange={onScopeChange} onDecision={onDecision} />)}
      {!items.length && <div className="empty approval-empty-card">Tidak ada pendaftaran yang menunggu approval.</div>}
    </div>
  </>;
}

function ApprovalUserCard({ item, roles, scopeData, deciding, onRoleChange, onScopeChange, onDecision }) {
  const { selectedValues, options } = scopeData;
  return <article className="approval-user-card">
    <div className="approval-card-head">
      <div className="approval-card-avatar" aria-hidden="true">{String(item.nama || item.username || '?').trim().charAt(0).toUpperCase()}</div>
      <div className="approval-card-identity"><h2>{item.nama || '-'}</h2><p>{item.jenis_personel || '-'} · {item.pangkat || '-'}</p></div>
      <span className="badge">Menunggu</span>
    </div>
    <dl className="approval-card-details">
      <div><dt>Username</dt><dd>{item.username || '-'}</dd></div>
      <div><dt>NIP / NRP</dt><dd>{item.nip || '-'}</dd></div>
      <div><dt>Role awal</dt><dd>{item.requested_role || '-'}</dd></div>
      <div className="approval-card-detail-wide"><dt>Email</dt><dd>{item.email || '-'}</dd></div>
      <div className="approval-card-detail-wide"><dt>Satker registrasi</dt><dd>{item.satker_asal || '-'}</dd></div>
    </dl>
    <div className="approval-card-controls">
      <label><span>Tetapkan role</span><select value={roles[item.id_registration] || 'operator_satker'} onChange={event => onRoleChange(item.id_registration, event.target.value)}><ApprovalRoleOptions /></select></label>
      <label><span>Scope organisasi</span><select multiple size="4" value={selectedValues} onChange={event => onScopeChange(item.id_registration, Array.from(event.target.selectedOptions, option => Number(option.value)))} aria-label={`Scope organisasi ${item.username}`}>{options.map(satker => <option key={satker.id_satker} value={satker.id_satker}>{satker.label}</option>)}</select><small className="scope-grant-note">Grant otomatis: {item.satker_asal || 'Satker registrasi'}</small>{!options.length && <small className="muted">Scope tidak ditemukan.</small>}</label>
    </div>
    <div className="approval-card-actions"><button disabled={deciding[item.id_registration]} onClick={() => onDecision(item, 'reject')}>{deciding[item.id_registration] ? 'Memproses…' : 'Tolak'}</button><button className="primary" disabled={deciding[item.id_registration]} onClick={() => onDecision(item, 'approve')}>{deciding[item.id_registration] ? 'Memproses…' : 'Setujui'}</button></div>
  </article>;
}
