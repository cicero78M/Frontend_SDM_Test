// Tampilan identitas ringkas yang dipakai tabel approval dan audit.
export function ApprovalIdentityCell({ item }) {
  return <td><strong>{item.nama || '-'}</strong><small>{item.jenis_personel || '-'} · {item.pangkat || '-'} · {item.nip || '-'}</small><small>{item.email || '-'}</small><small>{item.satker_asal || '-'}</small></td>;
}
