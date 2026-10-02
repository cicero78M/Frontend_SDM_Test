import { useEffect, useState } from 'react';
import { request } from '../../api';
import { CareerHistoryForm } from './CareerHistoryForm';
import { EducationTrainingSection } from './EducationTrainingSection';

export function CareerProfilePanel({ person, canEdit, onClose }) {
  const [profile, setProfile] = useState(null);
  const [masters, setMasters] = useState({ satker: [], fungsi: [], level: [], status: [], jabatan: [] });
  const [historyForm, setHistoryForm] = useState(null);
  const [tab, setTab] = useState('ringkasan');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [profileResult, ...masterResults] = await Promise.all(['/personel/' + person.id_pegawai + '/profile', '/master/satker', '/master/fungsi', '/master/level-jabatan', '/master/status-jabatan', '/master/jabatan'].map(path => request(path)));
      setProfile(profileResult.data);
      setMasters({ satker: masterResults[0].data || [], fungsi: masterResults[1].data || [], level: masterResults[2].data || [], status: masterResults[3].data || [], jabatan: masterResults[4].data || [] });
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [person.id_pegawai]);

  async function refreshProfile() {
    try { const result = await request('/personel/' + person.id_pegawai + '/profile'); setProfile(result.data); } catch (err) { setError(err.message); }
  }

  async function remove(record) {
    if (!window.confirm('Hapus riwayat jabatan ini?')) return;
    try { await request(`/personel/${person.id_pegawai}/riwayat-jabatan/${record.id_riwayat_jabatan}`, { method: 'DELETE' }); await refreshProfile(); } catch (err) { setError(err.message); }
  }

  const date = value => value ? new Date(value).toLocaleDateString('id-ID') : 'Sekarang';

  return <div className="drawer-backdrop"><section className="drawer profile-drawer"><div className="drawer-head"><div><span className="eyebrow">PROFIL PERSONEL</span><h2>{person.nama}</h2><p className="muted">{person.nip} · {person.nama_pangkat || '-'}</p></div><button className="icon-btn" onClick={onClose}>×</button></div>{error && <div className="alert">{error}</div>}{loading && <p className="muted">Memuat profil…</p>}{profile && <><ProfileSummary profile={profile} /><ProfileTabs tab={tab} setTab={setTab} profile={profile} />{tab === 'ringkasan' && <ProfileOverview profile={profile} />}{tab === 'karier' && <CareerTab profile={profile} canEdit={canEdit} date={date} onAdd={() => setHistoryForm({})} onEdit={setHistoryForm} onRemove={remove} />}{tab === 'kualifikasi' && <EducationTrainingSection personId={person.id_pegawai} profile={profile} canEdit={canEdit} onChanged={refreshProfile} />}</>}</section>{historyForm && <CareerHistoryForm personId={person.id_pegawai} record={historyForm.id_riwayat_jabatan ? historyForm : null} masters={masters} onClose={() => setHistoryForm(null)} onSaved={() => { setHistoryForm(null); refreshProfile(); }} />}</div>;
}

function ProfileSummary({ profile }) {
  return <section className="profile-summary"><div><span className="muted">Satker</span><strong>{profile.personel.nama_satker || 'Belum dipetakan'}</strong></div><div><span className="muted">Jabatan saat ini</span><strong>{profile.personel.nama_jabatan || '-'}</strong></div><div><span className="muted">Status personel</span><strong><span className="badge">{profile.personel.status_pegawai}</span></strong></div></section>;
}

function ProfileTabs({ tab, setTab, profile }) {
  return <div className="profile-tabs" role="tablist"><button className={tab === 'ringkasan' ? 'active' : ''} onClick={() => setTab('ringkasan')}>Ringkasan</button><button className={tab === 'karier' ? 'active' : ''} onClick={() => setTab('karier')}>Riwayat Jabatan ({profile.riwayat_jabatan?.length || 0})</button><button className={tab === 'kualifikasi' ? 'active' : ''} onClick={() => setTab('kualifikasi')}>Pendidikan & Diklat ({(profile.pendidikan?.length || 0) + (profile.diklat?.length || 0)})</button></div>;
}

function ProfileOverview({ profile }) {
  return <section className="profile-overview"><div><span className="muted">Identitas</span><strong>{profile.personel.jenis_identitas || '-'} · {profile.personel.nip}</strong></div><div><span className="muted">Jenis personel</span><strong>{profile.personel.jenis_personel || '-'}</strong></div><div><span className="muted">Riwayat tercatat</span><strong>{profile.riwayat_jabatan.length} jabatan · {profile.pendidikan.length} pendidikan · {profile.diklat.length} diklat</strong></div><p className="muted">Gunakan tab Riwayat Jabatan untuk perjalanan karier dan tab Pendidikan & Diklat untuk mengelola kualifikasi. Perubahan data dasar dilakukan melalui tombol Edit data di daftar personel.</p></section>;
}

function CareerTab({ profile, canEdit, date, onAdd, onEdit, onRemove }) {
  return <><div className="timeline-head"><div><h3>Timeline riwayat jabatan</h3><p className="muted">Urut dari awal masa penugasan.</p></div>{canEdit && <button className="primary" onClick={onAdd}>+ Tambah riwayat</button>}</div><div className="career-timeline">{!profile.riwayat_jabatan.length && <p className="empty">Belum ada riwayat jabatan.</p>}{profile.riwayat_jabatan.map(record => <article className="career-item" key={record.id_riwayat_jabatan}><div className="career-dot" /><div className="career-card"><div className="history-head"><div><strong>{record.nama_jabatan}</strong><small>{record.nama_satker || '-'} · {record.nama_fungsi || 'Fungsi belum diisi'}</small></div><span className="badge">{record.nama_status || '-'}</span></div><p className="muted">{date(record.tanggal_mulai)} — {date(record.tanggal_selesai)}{record.nama_level ? ` · ${record.nama_level}` : ''}</p>{record.keterangan && <p>{record.keterangan}</p>}{canEdit && <div className="actions"><button onClick={() => onEdit(record)}>Edit</button><button onClick={() => onRemove(record)}>Hapus</button></div>}</div></article>)}</div></>;
}
