// Tampilan identitas ringkas yang dipakai tabel approval dan audit.
export function ApprovalIdentityCell({ item }) {
  return <td><strong>{item.nama || '-'}</strong><small>{item.pangkat || '-'} · {item.nip || '-'}</small><small>{item.satker_asal || '-'}</small></td>;
}
