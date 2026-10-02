import { PagePagination } from '../administration';

export function PersonnelPage({ user, canEdit, people, meta, search, onSearch, onLoad, onProfile, onEdit }) {
  return <>
    <header><div><span className="eyebrow">DOMAIN PERSONEL</span><h1>Data Personel</h1><p className="muted">Data personel, struktur Satker, dan perjalanan karier.</p></div>{canEdit && <button className="primary" onClick={() => onEdit({})}>+ Input personel</button>}</header>
    <section className="stats"><div><span>Total personel</span><strong>{meta.total}</strong><small>Dalam scope akun</small></div><div><span>Data halaman ini</span><strong>{people.length}</strong><small>Gunakan Profil untuk melihat riwayat</small></div><div><span>Akses Anda</span><strong className="capitalize">{user.role}</strong><small>{canEdit ? 'Dapat mengelola data' : 'Mode baca saja'}</small></div></section>
    <section className="panel"><div className="panel-head"><div><h2>Daftar personel</h2><p className="muted">Pilih Profil untuk membuka identitas dan timeline karier.</p></div><input className="search" placeholder="⌕  Cari personel..." value={search} onChange={event => onSearch(event.target.value)} /></div><PersonnelTable people={people} canEdit={canEdit} onProfile={onProfile} onEdit={onEdit} /><PagePagination meta={meta} onChange={onLoad} /></section>
  </>;
}

function PersonnelTable({ people, canEdit, onProfile, onEdit }) {
  return <div className="table-wrap"><table><thead><tr><th>Personel</th><th>NRP/NIP</th><th>Satker</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{people.map(person => <tr key={person.id_pegawai}><td><strong>{person.nama}</strong><small>{person.nama_pangkat || '-'}</small></td><td>{person.nip}</td><td>{person.nama_satker || 'Belum dipetakan'}</td><td><span className="badge">{person.status_pegawai}</span></td><td className="actions-cell"><button onClick={() => onProfile(person)}>Profil</button>{canEdit && <button className="primary" onClick={() => onEdit(person)}>Edit data</button>}</td></tr>)}{!people.length && <tr><td colSpan="5" className="empty">Belum ada data personel pada scope ini.</td></tr>}</tbody></table></div>;
}
