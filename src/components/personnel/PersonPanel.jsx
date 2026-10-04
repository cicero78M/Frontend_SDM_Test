import { useEffect, useState } from 'react';
import { dateInputValue, request } from '../../api';
import { PersonForm } from './PersonForm';

const pangkatPolri = ['JENDERAL POLISI', 'KOMISARIS JENDERAL POLISI', 'INSPEKTUR JENDERAL POLISI', 'BRIGADIR JENDERAL POLISI', 'KOMISARIS BESAR POLISI', 'AJUN KOMISARIS BESAR POLISI', 'KOMISARIS POLISI', 'AJUN KOMISARIS POLISI', 'INSPEKTUR POLISI SATU', 'INSPEKTUR POLISI DUA', 'AJUN INSPEKTUR POLISI SATU', 'AJUN INSPEKTUR POLISI DUA', 'BRIGADIR POLISI KEPALA', 'BRIGADIR POLISI', 'BRIGADIR POLISI SATU', 'BRIGADIR POLISI DUA', 'AJUN BRIGADIR POLISI KEPALA', 'AJUN BRIGADIR POLISI', 'BHAYANGKARA KEPALA', 'BHAYANGKARA SATU', 'BHAYANGKARA DUA'];

export function PersonPanel({ person, onClose, onSaved }) {
  const savedJenisPersonel = String(person.jenis_personel || '').trim().toUpperCase();
  const inferredJenisPersonel = savedJenisPersonel || (String(person.jenis_identitas || '').toUpperCase() === 'NIP' || String(person.nip || '').replace(/\s/g, '').length === 18 ? 'ASN' : 'POLRI');
  const [form, setForm] = useState({ nip: person.nip || '', jenis_personel: inferredJenisPersonel, nik: person.nik || '', nama: person.nama || '', jenis_kelamin: person.jenis_kelamin || 'L', tempat_lahir: person.tempat_lahir || '', tanggal_lahir: dateInputValue(person.tanggal_lahir), tanggal_masuk: dateInputValue(person.tanggal_masuk), id_unit: person.id_unit || '', id_jabatan: person.id_jabatan || '', id_golongan: person.id_golongan || '', pangkat: person.pangkat || (inferredJenisPersonel === 'POLRI' ? person.nama_pangkat || '' : ''), nama_polsek: person.nama_polsek || '', id_satker: person.id_satker || '', status_pegawai: person.status_pegawai || 'AKTIF', batas_usia_pensiun: person.batas_usia_pensiun || 58 });
  const [masters, setMasters] = useState({ jabatan: [], golongan: [], satker: [] });
  const [jobOptions, setJobOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    if (!form.id_unit) { setJobOptions([]); return; }
    request(`/master/jabatan?satker_id=${Number(form.id_satker)}&unit_id=${Number(form.id_unit)}`).then(result => setJobOptions(result.data || [])).catch(err => { setJobOptions([]); setError(err.message); });
  }, [form.id_satker, form.id_unit]);

  const update = event => setForm(current => {
    const { name, value } = event.target;
    if (name === 'jenis_personel') {
      return { ...current, jenis_personel: value, pangkat: '', id_golongan: '' };
    }
    return { ...current, [name]: value };
  });
  const rankOptions = form.pangkat && form.jenis_personel === 'POLRI' && !pangkatPolri.includes(form.pangkat) ? [form.pangkat, ...pangkatPolri] : pangkatPolri;
  const selectedSatker = masters.satker.find(item => String(item.id_satker) === String(form.id_satker));
  const parentSatker = selectedSatker && masters.satker.find(item => String(item.id_satker) === String(selectedSatker.id_satker_induk));
  // Semua child langsung Polda memakai tree Unit Kerja. Dengan demikian
  // Direktorat/Bidang/RO mengikuti pola yang sama sampai unit terkecil.
  const hierarchicalUnit = String(parentSatker?.tipe_satker || '').toUpperCase() === 'POLDA'
    || String(selectedSatker?.tipe_satker || '').toUpperCase() === 'DIREKTORAT';

  async function save(event) {
    event.preventDefault();
    if (saving) return;
    setError('');
    setSaving(true);
    try {
      const payload = { ...form, jenis_identitas: form.jenis_personel === 'POLRI' ? 'NRP' : 'NIP', id_unit: Number(form.id_unit), id_jabatan: Number(form.id_jabatan), id_golongan: form.id_golongan ? Number(form.id_golongan) : null, id_satker: Number(form.id_satker), batas_usia_pensiun: Number(form.batas_usia_pensiun), tanggal_masuk: form.tanggal_masuk || null, nama_polsek: form.nama_polsek?.trim() || null, pangkat: form.pangkat || null };
      const path = person.id_pegawai ? `/personel/${person.id_pegawai}` : '/personel';
      await request(path, { method: person.id_pegawai ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  return <div className="drawer-backdrop"><section className="drawer"><div className="drawer-head"><div><span className="eyebrow">{person.id_pegawai ? 'EDIT DATA' : 'DATA BARU'}</span><h2>{person.id_pegawai ? person.nama : 'Tambah personel'}</h2></div><button className="icon-btn" onClick={onClose} disabled={saving}>×</button></div><PersonForm form={form} masters={masters} jobOptions={jobOptions} hierarchicalUnit={hierarchicalUnit} unitOptions={unitOptions} error={error} loading={loading || saving} rankOptions={rankOptions} update={update} onSatkerChange={id => setForm(current => ({ ...current, id_satker: id, id_unit: '', id_jabatan: '', nama_polsek: '' }))} onUnitChange={id => setForm(current => ({ ...current, id_unit: id, id_jabatan: '', nama_polsek: unitOptions.find(item => String(item.id_unit) === String(id) && String(item.kode_unit || '').toUpperCase() === 'POLSEK') ? current.nama_polsek : '' }))} onPolsekNameChange={update} onClose={onClose} onSubmit={save} /></section></div>;
}
