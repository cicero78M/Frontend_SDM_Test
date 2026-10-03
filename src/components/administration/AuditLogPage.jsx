import { useEffect, useState } from 'react';
import { request } from '../../api';
import { PagePagination } from './PagePagination';

const resources = [
  ['', 'Semua sumber'],
  ['personel', 'Data personel'],
  ['riwayat_jabatan', 'Riwayat jabatan'],
  ['riwayat_pendidikan_personel', 'Pendidikan'],
  ['riwayat_diklat_personel', 'Diklat'],
  ['riwayat_mutasi_personel', 'Mutasi'],
  ['merit_assessment', 'Penilaian merit'],
];

export function AuditLogPage() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 25, total: 0 });
  const [filters, setFilters] = useState({ search: '', action: '', resource: '', from: '', to: '' });
  const [applied, setApplied] = useState(filters);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(page = 1, limit = meta.limit, nextFilters = applied) {
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ page, limit });
    Object.entries(nextFilters).forEach(([key, value]) => { if (value) params.set(key, value); });
    try {
      const result = await request(`/audit-log?${params}`);
      setItems(result.data || []);
      setMeta(result.meta || { page, limit, total: 0 });
    } catch (err) {
      setError(err.message);
      setItems([]);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function update(event) {
    setFilters(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    setApplied(filters);
    load(1, meta.limit, filters);
  }

  function reset() {
    const empty = { search: '', action: '', resource: '', from: '', to: '' };
    setFilters(empty);
    setApplied(empty);
    load(1, meta.limit, empty);
  }

  return <section className="page-section">
    <div className="page-heading"><div><span className="eyebrow">AUDIT SISTEM</span><h1>Log Aktivitas</h1><p className="muted">Rekam jejak input, perubahan, dan penghapusan data sesuai otorisasi serta scope organisasi Anda.</p></div></div>
    <form className="audit-filters panel" onSubmit={submit}>
      <label>Pencarian<input name="search" value={filters.search} onChange={update} placeholder="User, nama, NRP/NIP..." /></label>
      <label>Aksi<select name="action" value={filters.action} onChange={update}><option value="">Semua aksi</option><option value="CREATE">Input</option><option value="UPDATE">Update</option><option value="DELETE">Hapus</option><option value="READ">Baca</option></select></label>
      <label>Sumber<select name="resource" value={filters.resource} onChange={update}>{resources.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label>Dari<input type="date" name="from" value={filters.from} onChange={update} /></label>
      <label>Sampai<input type="date" name="to" value={filters.to} onChange={update} /></label>
      <div className="audit-filter-actions"><button className="primary" type="submit">Terapkan</button><button type="button" onClick={reset}>Reset</button></div>
    </form>
    {error && <div className="alert">{error}</div>}
    <div className="panel table-wrap audit-table-wrap">
      {loading ? <p className="muted">Memuat log…</p> : items.length === 0 ? <p className="muted">Belum ada log yang dapat ditampilkan pada scope Anda.</p> : <table><thead><tr><th>Waktu</th><th>Aksi</th><th>Sumber</th><th>Aktor</th><th>Target personel</th><th>Detail</th></tr></thead><tbody>{items.map(item => <tr key={item.id_audit}><td>{new Date(item.created_at).toLocaleString('id-ID')}</td><td><span className={`audit-action audit-${item.action.toLowerCase()}`}>{item.action}</span></td><td>{item.resource}</td><td>{item.actor_username || '-'}</td><td>{item.target_nama ? <>{item.target_nama}<small className="muted audit-target-meta">{item.target_nrp || item.target_nip || '-'} · {item.target_satker || '-'}</small></> : '-'}</td><td><details><summary>Lihat</summary><pre>{JSON.stringify(item.metadata || {}, null, 2)}</pre></details></td></tr>)}</tbody></table>}
      <PagePagination meta={meta} onChange={(page, limit) => load(page, limit)} />
    </div>
  </section>;
}
