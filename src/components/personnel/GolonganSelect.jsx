/**
 * Dropdown golongan bersama untuk registrasi dan CRUD personel.
 * Konvensi tampilan mengikuti halaman registrasi: kode golongan — nama pangkat.
 */
export function GolonganSelect({ items = [], value, onChange, required = false, placeholder = 'Pilih golongan ASN...' }) {
  return (
    <select required={required} name="id_golongan" value={value || ''} onChange={onChange}>
      <option value="">{placeholder}</option>
      {items.map(item => (
        <option key={item.id_golongan} value={item.id_golongan}>
          {item.kode_golongan} — {item.nama_pangkat}
        </option>
      ))}
    </select>
  );
}
