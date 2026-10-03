import { useState } from 'react';
import { request } from '../../api';

const initialEducation = { jenjang: 'S1', institusi: '', jurusan: '', tahun_lulus: '', nomor_ijazah: '' };
const initialTraining = { nama_diklat: '', jenis_diklat: '', penyelenggara: '', tanggal_mulai: '', tanggal_selesai: '', jam_pelajaran: '', nilai: '', nomor_sertifikat: '' };

export function EducationTrainingSection({ personId, profile, canEdit, onChanged }) {
  const [tab, setTab] = useState('pendidikan');
  const [inputMode, setInputMode] = useState(null);
  const [error, setError] = useState('');
  const [education, setEducation] = useState(initialEducation);
  const [training, setTraining] = useState(initialTraining);
  const update = setter => event => setter(current => ({ ...current, [event.target.name]: event.target.value }));
  const startInput = mode => { setTab(mode); setInputMode(mode); setError(''); };
  const date = value => value ? new Date(value).toLocaleDateString('id-ID') : '-';

  async function saveEducation(event) {
    event.preventDefault(); setError('');
    try {
      await request(`/personel/${personId}/pendidikan`, { method: 'POST', body: JSON.stringify({ ...education, tahun_lulus: education.tahun_lulus ? Number(education.tahun_lulus) : null, jurusan: education.jurusan || null, nomor_ijazah: education.nomor_ijazah || null }) });
      setEducation(initialEducation); setInputMode(null); onChanged();
    } catch (err) { setError(err.message); }
  }

  async function saveTraining(event) {
    event.preventDefault(); setError('');
    try {
      await request(`/personel/${personId}/diklat`, { method: 'POST', body: JSON.stringify({ ...training, tanggal_mulai: training.tanggal_mulai || null, tanggal_selesai: training.tanggal_selesai || null, jam_pelajaran: training.jam_pelajaran ? Number(training.jam_pelajaran) : null, nilai: training.nilai ? Number(training.nilai) : null, jenis_diklat: training.jenis_diklat || null, penyelenggara: training.penyelenggara || null, nomor_sertifikat: training.nomor_sertifikat || null }) });
      setTraining(initialTraining); setInputMode(null); onChanged();
    } catch (err) { setError(err.message); }
  }

  async function remove(path, id, label) {
    if (!window.confirm(`Hapus ${label} ini?`)) return;
    try { await request(`/personel/${personId}/${path}/${id}`, { method: 'DELETE' }); onChanged(); } catch (err) { setError(err.message); }
  }

  return <section className="panel profile-qualifications"><div className="qualification-head"><div><h3>Pendidikan dan Diklat</h3><p className="muted">Kelola kualifikasi personel melalui dua alur input terpisah.</p></div><div className="qualification-actions">{canEdit && <><button className={tab === 'pendidikan' ? 'primary' : ''} onClick={() => startInput('pendidikan')}>+ Input pendidikan</button><button className={tab === 'diklat' ? 'primary' : ''} onClick={() => startInput('diklat')}>+ Input diklat</button></>}</div></div>{error && <div className="alert">{error}</div>}{tab === 'pendidikan' ? <EducationTab profile={profile} canEdit={canEdit} inputMode={inputMode} startInput={startInput} education={education} update={update(setEducation)} save={saveEducation} close={() => setInputMode(null)} remove={remove} /> : <TrainingTab profile={profile} canEdit={canEdit} inputMode={inputMode} startInput={startInput} training={training} update={update(setTraining)} save={saveTraining} close={() => setInputMode(null)} remove={remove} date={date} />}</section>;
}

function EducationTab({ profile, canEdit, inputMode, startInput, education, update, save, close, remove }) {
  return <div><div className="section-label"><strong>Daftar pendidikan ({profile.pendidikan?.length || 0})</strong>{canEdit && <button className="table-action" onClick={() => startInput('pendidikan')}>{inputMode === 'pendidikan' ? 'Tutup form' : '+ Tambah'}</button>}</div><div className="qualification-list">{!(profile.pendidikan || []).length && <p className="empty">Belum ada data pendidikan.</p>}{(profile.pendidikan || []).map(item => <article className="qualification-item" key={`${item.sumber_data || 'domain'}-${item.id_pendidikan}`}><div><strong>{item.jenjang} · {item.institusi}</strong><small>{item.jurusan || 'Jurusan tidak dicatat'} · Lulus {item.tahun_lulus || '-'}</small></div>{canEdit && item.dapat_diedit !== false && <button onClick={() => remove('pendidikan', item.id_pendidikan, 'data pendidikan')}>Hapus</button>}</article>)}</div>{canEdit && inputMode === 'pendidikan' && <form className="form-grid qualification-form" onSubmit={save}><label>Jenjang<select name="jenjang" value={education.jenjang} onChange={update}>{['SD','SMP','SMA','D1','D2','D3','D4','S1','S2','S3'].map(value => <option key={value}>{value}</option>)}</select></label><label>Institusi<input required name="institusi" value={education.institusi} onChange={update} /></label><label>Jurusan<input name="jurusan" value={education.jurusan} onChange={update} /></label><label>Tahun lulus<input type="number" min="1900" max="2100" name="tahun_lulus" value={education.tahun_lulus} onChange={update} /></label><label>No. ijazah<input name="nomor_ijazah" value={education.nomor_ijazah} onChange={update} /></label><div className="actions full"><button type="button" onClick={close}>Batal</button><button className="primary">Simpan pendidikan</button></div></form>}</div>;
}

function TrainingTab({ profile, canEdit, inputMode, startInput, training, update, save, close, remove, date }) {
  return <div><div className="section-label"><strong>Daftar diklat ({profile.diklat?.length || 0})</strong>{canEdit && <button className="table-action" onClick={() => startInput('diklat')}>{inputMode === 'diklat' ? 'Tutup form' : '+ Tambah'}</button>}</div><div className="qualification-list">{!(profile.diklat || []).length && <p className="empty">Belum ada data diklat.</p>}{(profile.diklat || []).map(item => <article className="qualification-item" key={`${item.sumber_data || 'domain'}-${item.id_diklat}`}><div><strong>{item.nama_diklat}</strong><small>{item.jenis_diklat || 'Diklat'} · {item.penyelenggara || 'Penyelenggara tidak dicatat'}</small><small>{date(item.tanggal_mulai)} — {date(item.tanggal_selesai)} · {item.jam_pelajaran || 0} JP · Nilai {item.nilai ?? '-'}</small></div>{canEdit && item.dapat_diedit !== false && <button onClick={() => remove('diklat', item.id_diklat, 'data diklat')}>Hapus</button>}</article>)}</div>{canEdit && inputMode === 'diklat' && <form className="form-grid qualification-form" onSubmit={save}><label>Nama diklat<input required name="nama_diklat" value={training.nama_diklat} onChange={update} /></label><label>Jenis diklat<input name="jenis_diklat" value={training.jenis_diklat} onChange={update} /></label><label>Penyelenggara<input name="penyelenggara" value={training.penyelenggara} onChange={update} /></label><label>Tanggal mulai<input type="date" name="tanggal_mulai" value={training.tanggal_mulai} onChange={update} /></label><label>Tanggal selesai<input type="date" name="tanggal_selesai" value={training.tanggal_selesai} onChange={update} /></label><label>Jam pelajaran<input type="number" min="0" name="jam_pelajaran" value={training.jam_pelajaran} onChange={update} /></label><label>Nilai<input type="number" min="0" max="100" step="0.01" name="nilai" value={training.nilai} onChange={update} /></label><label>No. sertifikat<input name="nomor_sertifikat" value={training.nomor_sertifikat} onChange={update} /></label><div className="actions full"><button type="button" onClick={close}>Batal</button><button className="primary">Simpan diklat</button></div></form>}</div>;
}
