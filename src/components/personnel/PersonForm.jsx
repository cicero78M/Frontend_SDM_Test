import { DependentSatkerPicker } from './DependentSatkerPicker';
import { DependentUnitPicker } from './DependentUnitPicker';

export function PersonForm({
  form,
  masters,
  jobOptions,
  hierarchicalUnit,
  unitOptions,
  error,
  loading,
  rankOptions,
  update,
  onSatkerChange,
  onUnitChange,
  onPolsekNameChange,
  onClose,
  onSubmit,
}) {
  const options = (items, key, label) => items.map(item => (
    <option key={item[key]} value={item[key]}>{item[label]}</option>
  ));

  return <form onSubmit={onSubmit} className="form-grid person-form-flat">
    <label>Nama Lengkap *<input required name="nama" value={form.nama} onChange={update} /></label>
    <label>NIK *<input required name="nik" value={form.nik} onChange={update} /></label>
    <label>Jenis Kelamin<select name="jenis_kelamin" value={form.jenis_kelamin} onChange={update}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></label>
    <label>Tempat Lahir<input name="tempat_lahir" value={form.tempat_lahir} onChange={update} /></label>
    <label>Tanggal Lahir *<input required type="date" name="tanggal_lahir" value={form.tanggal_lahir} onChange={update} /></label>
    <label>Jenis Personil<select name="jenis_personel" value={form.jenis_personel} onChange={update}><option value="POLRI">POLRI — NRP</option><option value="ASN">ASN — NIP</option><option value="PPPK">PPPK — NIP</option><option value="HONORER">HONORER — NIP</option><option value="LAINNYA">LAINNYA — NIP</option></select></label>
    <label>NRP/NIP *<input required name="nip" value={form.nip} onChange={update} /></label>
    <label>PANGKAT{form.jenis_personel === 'POLRI' ? <select required name="pangkat" value={form.pangkat} onChange={update}><option value="">Pilih pangkat POLRI</option>{rankOptions.map(rank => <option key={rank} value={rank}>{rank}</option>)}</select> : <input name="pangkat" value={form.pangkat} onChange={update} placeholder="Pangkat atau kualifikasi" />}</label>
    <label>Golongan (ASN)<select name="id_golongan" value={form.id_golongan} onChange={update}><option value="">Tidak menggunakan golongan ASN</option>{options(masters.golongan, 'id_golongan', 'nama_pangkat')}</select></label>
    <DependentSatkerPicker simple flat items={masters.satker} value={form.id_satker} onChange={onSatkerChange} />
    <DependentUnitPicker flat={!hierarchicalUnit} personnelFlat={hierarchicalUnit} items={unitOptions} value={form.id_unit} onChange={onUnitChange} />
    {unitOptions.some(item => String(item.id_unit) === String(form.id_unit) && String(item.kode_unit || '').toUpperCase() === 'POLSEK') && <label>Nama Polsek *<input required name="nama_polsek" value={form.nama_polsek || ''} onChange={onPolsekNameChange} placeholder="Masukkan nama Polsek" maxLength="100" /></label>}
    <label>Jabatan<select required name="id_jabatan" value={form.id_jabatan} onChange={update} disabled={!form.id_unit}><option value="">{form.id_unit ? 'Pilih jabatan sesuai unit kerja' : 'Pilih unit kerja terlebih dahulu'}</option>{options(jobOptions, 'id_jabatan', 'nama_jabatan')}</select></label>
    <label>Tanggal Masuk<input type="date" name="tanggal_masuk" value={form.tanggal_masuk} onChange={update} /></label>
    <label>Status<select name="status_pegawai" value={form.status_pegawai} onChange={update}><option value="AKTIF">AKTIF</option><option value="NONAKTIF">NONAKTIF</option><option value="PENSIUN">PENSIUN</option></select></label>
    <label>Batas Pensiun<input required type="number" min="1" max="100" name="batas_usia_pensiun" value={form.batas_usia_pensiun} onChange={update} /></label>
    {error && <div className="alert full">{error}</div>}
    <div className="actions full"><button type="button" onClick={onClose}>Batal</button><button className="primary" disabled={loading || !form.id_satker || !form.id_unit}>Simpan data</button></div>
  </form>;
}
