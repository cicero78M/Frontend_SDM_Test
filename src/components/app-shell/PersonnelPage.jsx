import { PagePagination } from '../administration';

export function PersonnelPage({ user, canEdit, people, meta, search, onSearch, onLoad, filters, onFilterChange, onApplyFilters, onResetFilters, onProfile, onEdit }) {
  return <section className="page-section personnel-page">
    <div className="page-heading personnel-heading"><div><span className="eyebrow">DOMAIN PERSONEL</span><h1>Data Personel</h1><p className="muted">Data personel, struktur Satker, dan perjalanan karier.</p></div>{canEdit && <button className="primary personnel-add" onClick={() => onEdit({})}><span aria-hidden="true">+</span> Input personel</button>}</div>
    <section className="stats personnel-stats"><div><span>Total personel</span><strong>{meta.total}</strong><small>Dalam scope akun</small></div><div><span>Data halaman ini</span><strong>{people.length}</strong><small>Gunakan Profil untuk melihat riwayat</small></div><div><span>Akses Anda</span><strong className="capitalize">{user.role}</strong><small>{canEdit ? 'Dapat mengelola data' : 'Mode baca saja'}</small></div></section>
    <section className="panel personnel-panel"><div className="panel-head personnel-panel-head"><div><span className="eyebrow">DATA TERDAFTAR</span><h2>Daftar personel</h2><p className="muted">{meta.total ? `Menampilkan ${people.length} personel pada halaman ini.` : 'Belum ada data personel pada scope ini.'}</p></div><label className="search-field"><span className="sr-only">Cari personel</span><span aria-hidden="true">⌕</span><input className="search" placeholder="Cari nama atau NRP/NIP..." value={search} onChange={event => onSearch(event.target.value)} /></label></div><PersonnelFilters filters={filters} onChange={onFilterChange} onApply={onApplyFilters} onReset={onResetFilters} /><PersonnelTable people={people} canEdit={canEdit} onProfile={onProfile} onEdit={onEdit} /><PagePagination meta={meta} onChange={onLoad} /></section>
  </section>;
}

function PersonnelFilters({ filters, onChange, onApply, onReset }) {
  const change = event => onChange(event.target.name, event.target.value);
  return <div className="personnel-filters"><div className="personnel-filters-title"><div><strong>Filter data personel</strong><span>Pilih kriteria untuk mempersempit daftar.</span></div><button type="button" className="filter-reset" onClick={onReset}>Reset filter</button></div><div className="personnel-filter-grid">
    <label>Status personel<select name="status" value={filters.status} onChange={change}><option value="">Semua status</option><option value="AKTIF">Aktif</option><option value="NONAKTIF">Nonaktif</option><option value="PENSIUN">Pensiun</option></select></label>
    <label>Tingkat pendidikan<select name="education" value={filters.education} onChange={change}><option value="">Semua tingkat</option><option value="SD">Minimal SD</option><option value="SMP">Minimal SMP</option><option value="SMA">Minimal SMA</option><option value="D3">Minimal D3</option><option value="D4">Minimal D4 / S1</option><option value="S2">Minimal S2</option><option value="S3">Minimal S3</option></select></label>
    <label>Riwayat diklat<select name="training" value={filters.training} onChange={change}><option value="">Semua data</option><option value="yes">Pernah diklat</option><option value="no">Belum pernah diklat</option></select></label>
    <label>Riwayat mutasi<select name="mutation" value={filters.mutation} onChange={change}><option value="">Semua data</option><option value="yes">Pernah mutasi</option><option value="no">Belum pernah mutasi</option></select></label>
    <fieldset><legend>Lama dinas (tahun)</legend><div className="filter-range"><input name="service_min" type="number" min="0" max="100" placeholder="Min" aria-label="Lama dinas minimum" value={filters.service_min} onChange={change} /><span>—</span><input name="service_max" type="number" min="0" max="100" placeholder="Maks" aria-label="Lama dinas maksimum" value={filters.service_max} onChange={change} /></div></fieldset>
  </div><div className="personnel-filter-actions"><span>Filter diterapkan setelah tombol ditekan.</span><button type="button" className="primary" onClick={onApply}>Terapkan filter</button></div></div>;
}

function PersonnelTable({ people, canEdit, onProfile, onEdit }) {
  return <>
    <div className="table-wrap personnel-table-wrap"><table><thead><tr><th>Personel</th><th>NRP/NIP</th><th>Satker</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{people.map(person => <tr key={person.id_pegawai}><td><strong>{person.nama}</strong><small>{person.nama_pangkat || '-'}</small></td><td>{person.nip}</td><td>{person.nama_satker || 'Belum dipetakan'}</td><td><span className="badge">{person.status_pegawai}</span></td><td className="actions-cell"><button onClick={() => onProfile(person)}>Profil</button>{canEdit && <button className="primary" onClick={() => onEdit(person)}>Edit data</button>}</td></tr>)}{!people.length && <tr><td colSpan="5" className="empty">Belum ada data personel pada scope ini.</td></tr>}</tbody></table></div>
    <div className="personnel-cards" aria-label="Daftar personel dalam bentuk kartu">{people.map(person => <PersonnelCard key={person.id_pegawai} person={person} canEdit={canEdit} onProfile={onProfile} onEdit={onEdit} />)}{!people.length && <div className="empty">Belum ada data personel pada scope ini.</div>}</div>
  </>;
}

function PersonnelCard({ person, canEdit, onProfile, onEdit }) {
  return <article className="personnel-card"><div className="personnel-card-top"><div className="personnel-avatar" aria-hidden="true">{String(person.nama || '?').trim().charAt(0).toUpperCase()}</div><div className="personnel-card-identity"><h3>{person.nama || '-'}</h3><p>{person.nama_pangkat || 'Pangkat belum diisi'}</p></div><span className="badge">{person.status_pegawai || '-'}</span></div><dl className="personnel-card-details"><div><dt>NRP / NIP</dt><dd>{person.nip || '-'}</dd></div><div><dt>Satker</dt><dd>{person.nama_satker || 'Belum dipetakan'}</dd></div></dl><div className="personnel-card-actions"><button onClick={() => onProfile(person)}>Lihat profil</button>{canEdit && <button className="primary" onClick={() => onEdit(person)}>Edit data</button>}</div></article>;
}
