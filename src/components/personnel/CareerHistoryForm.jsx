import { useEffect, useState } from 'react';
import { dateInputValue, request } from '../../api';
import { DependentSatkerPicker } from './DependentSatkerPicker';

export function CareerHistoryForm({ personId, record, masters, onClose, onSaved }) {
  const [form, setForm] = useState({ id_jabatan: record?.id_jabatan || '', id_satker: record?.id_satker || '', id_fungsi: record?.id_fungsi || '', id_level_jabatan: record?.id_level_jabatan || '', id_status_jabatan: record?.id_status_jabatan || '', tanggal_mulai: dateInputValue(record?.tanggal_mulai), tanggal_selesai: dateInputValue(record?.tanggal_selesai), keterangan: record?.keterangan || '' });
  const [error, setError] = useState('');
  const [fungsiOptions, setFungsiOptions] = useState(masters.fungsi || []);

  useEffect(() => {
    if (!form.id_satker) { setFungsiOptions([]); return; }
    request(`/master/satker/${form.id_satker}/fungsi`).then(result => setFungsiOptions(result.data || [])).catch(() => setFungsiOptions([]));
  }, [form.id_satker]);

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const options = (items, valueKey, labelKey) => items.map(item => <option key={item[valueKey]} value={item[valueKey]}>{item[labelKey]}</option>);

  async function save(event) {
    event.preventDefault();
    setError('');
    try {
      const payload = { ...form, id_jabatan: Number(form.id_jabatan), id_satker: Number(form.id_satker), id_fungsi: form.id_fungsi ? Number(form.id_fungsi) : null, id_level_jabatan: form.id_level_jabatan ? Number(form.id_level_jabatan) : null, id_status_jabatan: Number(form.id_status_jabatan), tanggal_selesai: form.tanggal_selesai || null };
      const path = record ? `/personel/${personId}/riwayat-jabatan/${record.id_riwayat_jabatan}` : `/personel/${personId}/riwayat-jabatan`;
      await request(path, { method: record ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError(err.message); }
  }

  return <div className="drawer-backdrop"><section className="drawer compact-modal"><div className="drawer-head"><div><span className="eyebrow">RIWAYAT KARIER</span><h2>{record ? 'Edit riwayat jabatan' : 'Tambah riwayat jabatan'}</h2></div><button className="icon-btn" onClick={onClose}>×</button></div><form onSubmit={save} className="form-grid">
    <label>Jabatan<select required name="id_jabatan" value={form.id_jabatan} onChange={update}><option value="">Pilih jabatan</option>{options(masters.jabatan, 'id_jabatan', 'nama_jabatan')}</select></label>
    <DependentSatkerPicker items={masters.satker || []} value={form.id_satker} onChange={id => setForm(current => ({ ...current, id_satker: id }))} />
    <label>Fungsi<select name="id_fungsi" value={form.id_fungsi} onChange={update}><option value="">Belum ditentukan</option>{options(fungsiOptions, 'id_fungsi', 'nama_fungsi')}</select></label>
    <label>Level jabatan<select name="id_level_jabatan" value={form.id_level_jabatan} onChange={update}><option value="">Belum ditentukan</option>{options(masters.level, 'id_level_jabatan', 'nama_level')}</select></label>
    <label>Status jabatan<select required name="id_status_jabatan" value={form.id_status_jabatan} onChange={update}><option value="">Pilih status</option>{options(masters.status, 'id_status_jabatan', 'nama_status')}</select></label>
    <label>Tanggal mulai<input required type="date" name="tanggal_mulai" value={form.tanggal_mulai} onChange={update} /></label>
    <label>Tanggal selesai<input type="date" name="tanggal_selesai" value={form.tanggal_selesai} onChange={update} /></label>
    <label className="full">Keterangan<textarea name="keterangan" maxLength="2000" value={form.keterangan} onChange={update} rows="3" /></label>
    {error && <div className="alert full">{error}</div>}<div className="actions full"><button type="button" onClick={onClose}>Batal</button><button className="primary">Simpan riwayat</button></div>
  </form></section></div>;
}
