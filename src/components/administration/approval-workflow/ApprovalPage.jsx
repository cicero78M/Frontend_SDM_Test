// Orkestrasi halaman approval: data hook, aksi keputusan, tabel, dan pagination.
import React, { useState } from 'react';
import { request } from '../../../api';
import { PagePagination } from '../PagePagination';
import { ApprovalTable } from './ApprovalTable';
import { useApprovalRegistrations } from './useApprovalRegistrations';

export function ApprovalPage() {
  const { items, meta, error, load, setError } = useApprovalRegistrations('pending');
  const [roles, setRoles] = useState({});

  function changeRole(id, role) {
    setRoles(current => ({ ...current, [id]: role }));
  }

  async function decide(item, decision) {
    try {
      await request(`/auth/registrations/${item.id_registration}`, {
        method: 'PATCH',
        body: JSON.stringify({ decision, approved_role: roles[item.id_registration] || 'viewer' }),
      });
      load(meta.page);
    } catch (err) {
      setError(err.message);
    }
  }

  return <section className="page-section"><div className="page-heading"><div><span className="eyebrow">ADMINISTRASI</span><h1>Permintaan Akses</h1><p className="muted">Tinjau identitas pendaftar dan tetapkan role akses.</p></div></div>
    {error && <div className="alert">{error}</div>}
    <div className="panel"><ApprovalTable items={items} roles={roles} onRoleChange={changeRole} onDecision={decide} /><PagePagination meta={meta} onChange={load} /></div>
  </section>;
}
