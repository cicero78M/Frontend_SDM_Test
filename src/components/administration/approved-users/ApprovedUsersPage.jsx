// Orkestrasi daftar user aktif, pagination, dan perubahan role.
import { useState } from 'react';
import { PagePagination } from '../PagePagination';
import { ApprovedUsersTable } from './ApprovedUsersTable';
import { RolePromotionModal } from './RolePromotionModal';
import { useApprovedUsers } from './useApprovedUsers';

export function ApprovedUsersPage() {
  const { users, meta, error, load, setError } = useApprovedUsers();
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');

  function openPromotion(user) {
    setMessage('');
    setSelected(user);
  }

  function closePromotion() {
    setSelected(null);
  }

  function handleSaved() {
    closePromotion();
    setMessage('Role user berhasil diperbarui.');
    load(meta.page, meta.limit);
  }

  return <section className="page-section"><div className="page-heading"><div><span className="eyebrow">ADMINISTRASI</span><h1>User Disetujui</h1><p className="muted">Daftar user aktif yang telah melewati proses persetujuan.</p></div></div>
    {message && <div className="hint">{message}</div>}
    {error && <div className="alert">{error}</div>}
    <div className="panel"><ApprovedUsersTable users={users} onPromote={openPromotion} /><PagePagination meta={meta} onChange={load} /></div>
    {selected && <RolePromotionModal user={selected} onClose={closePromotion} onSaved={handleSaved} onError={setError} />}
  </section>;
}
