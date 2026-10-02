// Orkestrasi halaman audit riwayat approval.
import React from 'react';
import { PagePagination } from '../PagePagination';
import { ApprovalHistoryTable } from './ApprovalHistoryTable';
import { useApprovalRegistrations } from './useApprovalRegistrations';

export function ApprovalHistoryPage() {
  const { items, meta, error, load } = useApprovalRegistrations('history');

  return <section className="page-section"><div className="page-heading"><div><span className="eyebrow">AUDIT AKSES</span><h1>Riwayat Persetujuan</h1><p className="muted">Rekam jejak identitas, keputusan approval, dan aktor yang memprosesnya.</p></div></div>
    {error && <div className="alert">{error}</div>}
    <div className="panel"><ApprovalHistoryTable items={items} /><PagePagination meta={meta} onChange={load} /></div>
  </section>;
}
