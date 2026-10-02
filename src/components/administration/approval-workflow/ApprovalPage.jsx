// Orkestrasi halaman approval: data hook, aksi keputusan, tabel, dan pagination.
import React, { useEffect, useState } from 'react';
import { hierarchicalSatkerOptions, request } from '../../../api';
import { PagePagination } from '../PagePagination';
import { ApprovalTable } from './ApprovalTable';
import { useApprovalRegistrations } from './useApprovalRegistrations';

export function ApprovalPage() {
  const { items, meta, error, load, setError } = useApprovalRegistrations('pending');
  const [roles, setRoles] = useState({});
  const [satkers, setSatkers] = useState([]);
  const [scopes, setScopes] = useState({});
  const [scopeSearch, setScopeSearch] = useState('');
  const [deciding, setDeciding] = useState({});

  useEffect(() => {
    request('/master/satker/tree').then(result => setSatkers(hierarchicalSatkerOptions(result.data || []))).catch(err => setError(err.message));
  }, []);

  function changeRole(id, role) {
    setRoles(current => ({ ...current, [id]: role }));
  }

  function changeScope(id, values) {
    const item = items.find(candidate => candidate.id_registration === id);
    const registrationSatker = item?.id_satker ? Number(item.id_satker) : null;
    setScopes(current => ({ ...current, [id]: [...new Set([...(registrationSatker ? [registrationSatker] : []), ...values])] }));
  }

  async function decide(item, decision) {
    if (deciding[item.id_registration]) return;
    setDeciding(current => ({ ...current, [item.id_registration]: true }));
    try {
      await request(`/auth/registrations/${item.id_registration}`, {
        method: 'PATCH',
        body: JSON.stringify({ decision, approved_role: roles[item.id_registration] || 'operator_satker', scope_satker: scopes[item.id_registration] || (item.id_satker ? [Number(item.id_satker)] : []) }),
      });
      await load(meta.page);
    } catch (err) {
      setError(err.message);
      await load(meta.page);
    } finally {
      setDeciding(current => ({ ...current, [item.id_registration]: false }));
    }
  }

  return <section className="page-section"><div className="page-heading"><div><span className="eyebrow">ADMINISTRASI</span><h1>Permintaan Akses</h1><p className="muted">Tinjau identitas pendaftar dan tetapkan role akses.</p></div></div>
    {error && <div className="alert">{error}</div>}
    <div className="panel"><div className="approval-toolbar"><div><span className="eyebrow">PILIHAN SCOPE</span><p className="muted">Cari nama atau kode organisasi untuk mempersempit pilihan scope.</p></div><label className="search-field approval-scope-search"><span className="sr-only">Cari scope organisasi</span><span aria-hidden="true">⌕</span><input className="search" value={scopeSearch} onChange={event => setScopeSearch(event.target.value)} placeholder="Cari scope organisasi..." /></label></div><ApprovalTable items={items} roles={roles} scopes={scopes} satkers={satkers} scopeSearch={scopeSearch} deciding={deciding} onRoleChange={changeRole} onScopeChange={changeScope} onDecision={decide} /><PagePagination meta={meta} onChange={load} /></div>
  </section>;
}
