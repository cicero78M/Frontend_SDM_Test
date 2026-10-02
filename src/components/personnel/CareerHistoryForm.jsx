import { useEffect, useState } from 'react';
import { dateInputValue, request } from '../../api';
import { DependentSatkerPicker } from './DependentSatkerPicker';
import { DependentUnitPicker } from './DependentUnitPicker';

export function CareerHistoryForm({ personId, personSatkerId, operatorPolres = false, record, masters, onClose, onSaved }) {
  const fixedSatker = operatorPolres ? personSatkerId : '';
  const [form, setForm] = useState({ id_jabatan: record?.id_jabatan || '', id_satker: fixedSatker || record?.id_satker || '', id_unit: record?.id_unit || '', id_level_jabatan: record?.id_level_jabatan || '', id_status_jabatan: record?.id_status_jabatan || '', tanggal_mulai: dateInputValue(record?.tanggal_mulai), tanggal_selesai: dateInputValue(record?.tanggal_selesai), keterangan: record?.keterangan || '' });
  const [error, setError] = useState('');
  const [unitOptions, setUnitOptions] = useState([]);
  const [jobOptions, setJobOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!form.id_satker) { setUnitOptions([]); return; }
    request(`/master/satker/${form.id_satker}/unsur-pembantu-pimpinan`).then(result => setUnitOptions(result.data || [])).catch(err => { setUnitOptions([]); setError(err.message); });
  }, [form.id_satker]);

  useEffect(() => {
    if (operatorPolres && String(form.id_satker) !== String(personSatkerId)) setForm(current => ({ ...current, id_satker: personSatkerId || '', id_unit: '', id_jabatan: '' }));
  }, [operatorPolres, personSatkerId, form.id_satker]);

  useEffect(() => {
    if (!form.id_unit) { setJobOptions([]); return; }
    request(`/master/jabatan?satker_id=${Number(form.id_satker)}&unit_id=${Number(form.id_unit)}`).then(result => setJobOptions(result.data || [])).catch(err => { setJobOptions([]); setError(err.message); });
  }, [form.id_satker, form.id_unit]);

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const options = (items, valueKey, labelKey) => items.map(item => <option key={item[valueKey]} value={item[valueKey]}>{item[labelKey]}</option>);
  async function save(event) {
    event.preventDefault();
    setError('');
    if (form.tanggal_selesai && form.tanggal_selesai < form.tanggal_mulai) { setError('Tanggal selesai tidak boleh sebelum tanggal mulai.'); return; }
    setSaving(true);
    try {
      const payload = { ...form, id_jabatan: Number(form.id_jabatan), id_satker: Number(form.id_satker), id_unit: Number(form.id_unit), id_level_jabatan: form.id_level_jabatan ? Number(form.id_level_jabatan) : null, id_status_jabatan: Number(form.id_status_jabatan), tanggal_selesai: form.tanggal_selesai || null };
      const path = record ? `/personel/${personId}/riwayat-jabatan/${record.id_riwayat_jabatan}` : `/personel/${personId}/riwayat-jabatan`;
      await request(path, { method: record ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      onSaved();
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  }

  const changeSatker = id => setForm(current => ({ ...current, id_satker: id, id_unit: '', id_jabatan: '' }));
  const changeUnit = id => setForm(current => ({ ...current, id_unit: id, id_jabatan: '' }));
  const selectedSatker = masters.satker.find(item => String(item.id_satker) === String(form.id_satker));
  const parentSatker = selectedSatker && masters.satker.find(item => String(item.id_satker) === String(selectedSatker.id_satker_induk));
  const hierarchicalUnit = String(parentSatker?.tipe_satker || '').toUpperCase() === 'POLDA'
    || String(selectedSatker?.tipe_satker || '').toUpperCase() === 'DIREKTORAT';
  return <div className="drawer-backdrop"><section className="drawer compact-modal career-history-modal"><div className="drawer-head"><div><span className="eyebrow">RIWAYAT KARIER</span><h2>{record ? 'Edit riwayat jabatan' : 'Tambah riwayat jabatan'}</h2><p className="muted">Lengkapi penempatan jabatan sesuai Satker dan periode tugas.</p></div><button type="button" className="icon-btn" onClick={onClose}>×</button></div><form onSubmit={save} className="form-grid career-history-form">
    <div className="form-section-title full"><span>Penempatan jabatan</span><small>Jabatan otomatis dibatasi berdasarkan Satker yang dipilih.</small></div>
    {operatorPolres ? <label className="picker-flat-unit">Satker Personel<input value={masters.satker.find(item => String(item.id_satker) === String(personSatkerId))?.nama_satker || 'Satker personel'} readOnly /></label> : <DependentSatkerPicker simple flat items={masters.satker || []} value={form.id_satker} onChange={changeSatker} />}
    <DependentUnitPicker key={form.id_satker} flat={!hierarchicalUnit} personnelFlat={hierarchicalUnit} items={unitOptions} value={form.id_unit} onChange={changeUnit} title="Unsur Pembantu Pimpinan" />
    <label>Jabatan *<select required name="id_jabatan" value={form.id_jabatan} onChange={update} disabled={!form.id_unit}><option value="">{form.id_unit ? 'Pilih jabatan sesuai unit kerja' : 'Pilih unsur terlebih dahulu'}</option>{options(jobOptions, 'id_jabatan', 'nama_jabatan')}</select></label>
    <label>Level jabatan<select name="id_level_jabatan" value={form.id_level_jabatan} onChange={update}><option value="">Belum ditentukan</option>{options(masters.level, 'id_level_jabatan', 'nama_level')}</select></label>
    <label>Status jabatan *<select required name="id_status_jabatan" value={form.id_status_jabatan} onChange={update}><option value="">Pilih status</option>{options(masters.status, 'id_status_jabatan', 'nama_status')}</select></label>
    <div className="form-section-title full"><span>Periode penugasan</span><small>Tanggal selesai boleh dikosongkan untuk jabatan yang masih aktif.</small></div>
    <label>Tanggal mulai *<input required type="date" name="tanggal_mulai" value={form.tanggal_mulai} onChange={update} /></label>
    <label>Tanggal selesai<input type="date" name="tanggal_selesai" value={form.tanggal_selesai} onChange={update} min={form.tanggal_mulai || undefined} /></label>
    <label className="full">Keterangan<textarea name="keterangan" maxLength="2000" value={form.keterangan} onChange={update} rows="3" placeholder="Tambahkan catatan penugasan bila diperlukan" /></label>
    {error && <div className="alert full">{error}</div>}<div className="actions full"><button type="button" onClick={onClose}>Batal</button><button className="primary" disabled={saving || !form.id_satker || !form.id_unit || !form.id_jabatan}>{saving ? 'Menyimpan…' : 'Simpan riwayat'}</button></div>
  </form></section></div>;
}
