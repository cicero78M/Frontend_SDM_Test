import { useEffect, useState } from 'react';
import { dateInputValue, request } from '../../api';
import { DependentSatkerPicker } from './DependentSatkerPicker';
import { DependentUnitPicker } from './DependentUnitPicker';

const pangkatPolri = ['JENDERAL POLISI', 'KOMISARIS JENDERAL POLISI', 'INSPEKTUR JENDERAL POLISI', 'BRIGADIR JENDERAL POLISI', 'KOMISARIS BESAR POLISI', 'AJUN KOMISARIS BESAR POLISI', 'KOMISARIS POLISI', 'AJUN KOMISARIS POLISI', 'INSPEKTUR POLISI SATU', 'INSPEKTUR POLISI DUA', 'AJUN INSPEKTUR POLISI SATU', 'AJUN INSPEKTUR POLISI DUA', 'BRIGADIR POLISI KEPALA', 'BRIGADIR POLISI', 'BRIGADIR POLISI SATU', 'BRIGADIR POLISI DUA', 'AJUN BRIGADIR POLISI KEPALA', 'AJUN BRIGADIR POLISI', 'BHAYANGKARA KEPALA', 'BHAYANGKARA SATU', 'BHAYANGKARA DUA'];

export function PersonPanel({ person, onClose, onSaved }) {
  const savedJenisPersonel = String(person.jenis_personel || '').trim().toUpperCase();
  const inferredJenisPersonel = savedJenisPersonel || (String(person.jenis_identitas || '').toUpperCase() === 'NIP' || String(person.nip || '').replace(/\s/g, '').length === 18 ? 'ASN' : 'POLRI');
  const [form, setForm] = useState({ nip: person.nip || '', jenis_personel: inferredJenisPersonel, nik: person.nik || '', nama: person.nama || '', jenis_kelamin: person.jenis_kelamin || 'L', tempat_lahir: person.tempat_lahir || '', tanggal_lahir: dateInputValue(person.tanggal_lahir), tanggal_masuk: dateInputValue(person.tanggal_masuk), id_unit: person.id_unit || '', id_jabatan: person.id_jabatan || '', id_golongan: person.id_golongan || '', pangkat: person.pangkat || (inferredJenisPersonel === 'POLRI' ? person.nama_pangkat || '' : ''), id_satker: person.id_satker || '', status_pegawai: person.status_pegawai || 'AKTIF', batas_usia_pensiun: person.batas_usia_pensiun || 58 });
  const [masters, setMasters] = useState({ jabatan: [], golongan: [], satker: [] });
  const [unitOptions, setUnitOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all(['/master/jabatan', '/master/golongan', '/master/satker'].map(path => request(path)))
      .then(([jabatan, golongan, satker]) => setMasters({ jabatan: jabatan.data || [], golongan: golongan.data || [], satker: satker.data || [] }))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!form.id_satker) { setUnitOptions([]); return; }
    request(`/master/satker/${form.id_satker}/unit-kerja`).then(result => setUnitOptions(result.data || [])).catch(err => { setUnitOptions([]); setError(err.message); });
  }, [form.id_satker]);

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const options = (items, key, label) => items.map(item => <option key={item[key]} value={item[key]}>{item[label]}</option>);
  const rankOptions = form.pangkat && form.jenis_personel === 'POLRI' && !pangkatPolri.includes(form.pangkat) ? [form.pangkat, ...pangkatPolri] : pangkatPolri;

  async function save(event) {
    event.preventDefault(); setError('');
    try {
      const payload = { ...form, jenis_identitas: form.jenis_personel === 'POLRI' ? 'NRP' : 'NIP', id_unit: Number(form.id_unit), id_jabatan: Number(form.id_jabatan), id_golongan: form.id_golongan ? Number(form.id_golongan) : null, id_satker: Number(form.id_satker), batas_usia_pensiun: Number(form.batas_usia_pensiun), tanggal_masuk: form.tanggal_masuk || null, pangkat: form.pangkat || null };
      const path = person.id_pegawai ? `/personel/${person.id_pegawai}` : '/personel';
      await request(path, { method: person.id_pegawai ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError(err.message); }
  }

  return <div className="drawer-backdrop"><section className="drawer"><div className="drawer-head"><div><span className="eyebrow">{person.id_pegawai ? 'EDIT DATA' : 'DATA BARU'}</span><h2>{person.id_pegawai ? person.nama : 'Tambah personel'}</h2></div><button className="icon-btn" onClick={onClose}>×</button></div><form onSubmit={save} className="form-grid">
    <label>Jenis Personil<select name="jenis_personel" value={form.jenis_personel} onChange={update}><option value="POLRI">POLRI — NRP</option><option value="ASN">ASN — NIP</option><option value="PPPK">PPPK — NIP</option><option value="HONORER">HONORER — NIP</option><option value="LAINNYA">LAINNYA — NIP</option></select></label>
    <label>Nama Lengkap *<input required name="nama" value={form.nama} onChange={update} /></label>
    <label>NIK *<input required name="nik" value={form.nik} onChange={update} /></label>
    <label>Tempat Lahir<input name="tempat_lahir" value={form.tempat_lahir} onChange={update} /></label>
    <label>Tanggal Lahir *<input required type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={update} /></label>
    <label>NRP/NIP *<input required name="nip" value={form.nip} onChange={update} /></label>
    <label>PANGKAT{form.jenis_personel === 'POLRI' ? <select required name="pangkat" value={form.pangkat} onChange={update}><option value="">Pilih pangkat POLRI</option>{rankOptions.map(rank => <option key={rank} value={rank}>{rank}</option>)}</select> : <input name="pangkat" value={form.pangkat} onChange={update} placeholder="Pangkat atau kualifikasi" />}</label>
    <label>Golongan (ASN)<select name="id_golongan" value={form.id_golongan} onChange={update}><option value="">Tidak menggunakan golongan ASN</option>{options(masters.golongan, 'id_golongan', 'nama_pangkat')}</select></label>
    <label>Jabatan<select required name="id_jabatan" value={form.id_jabatan} onChange={update}><option value="">Pilih jabatan</option>{options(masters.jabatan, 'id_jabatan', 'nama_jabatan')}</select></label>
    <DependentSatkerPicker items={masters.satker} value={form.id_satker} onChange={id => setForm(current => ({ ...current, id_satker: id, id_unit: '' }))} />
    <DependentUnitPicker items={unitOptions} value={form.id_unit} onChange={id => setForm(current => ({ ...current, id_unit: id }))} />
    <label>Tanggal Masuk<input type="date" name="tanggal_masuk" value={form.tanggal_masuk} onChange={update} /></label>
    <label>Status<select name="status_pegawai" value={form.status_pegawai} onChange={update}><option value="AKTIF">AKTIF</option><option value="NONAKTIF">NONAKTIF</option><option value="PENSIUN">PENSIUN</option></select></label>
    <label>Batas Pensiun<input required type="number" min="1" max="100" name="batas_usia_pensiun" value={form.batas_usia_pensiun} onChange={update} /></label>
    <label>Jenis Kelamin<select name="jenis_kelamin" value={form.jenis_kelamin} onChange={update}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></label>
    <label className="derived-identity">Identitas otomatis<strong>{form.jenis_personel === 'POLRI' ? 'NRP' : 'NIP'}</strong><small>Ditentukan dari jenis personel.</small></label>
    {error && <div className="alert full">{error}</div>}<div className="actions full"><button type="button" onClick={onClose}>Batal</button><button className="primary" disabled={loading || !form.id_satker || !form.id_unit}>Simpan data</button></div>
  </form></section></div>;
}
