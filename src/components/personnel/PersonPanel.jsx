import { useEffect, useState } from 'react';
import { dateInputValue, request } from '../../api';
import { PersonForm } from './PersonForm';

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

  return <div className="drawer-backdrop"><section className="drawer"><div className="drawer-head"><div><span className="eyebrow">{person.id_pegawai ? 'EDIT DATA' : 'DATA BARU'}</span><h2>{person.id_pegawai ? person.nama : 'Tambah personel'}</h2></div><button className="icon-btn" onClick={onClose}>×</button></div><PersonForm form={form} masters={masters} unitOptions={unitOptions} error={error} loading={loading} rankOptions={rankOptions} update={update} onSatkerChange={id => setForm(current => ({ ...current, id_satker: id, id_unit: '' }))} onUnitChange={id => setForm(current => ({ ...current, id_unit: id }))} onClose={onClose} onSubmit={save} /></section></div>;
}
