// Konfigurasi dan utilitas komunikasi frontend dengan API backend.
export const API = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Mengubah tanggal dari respons API menjadi format input HTML date.
export const dateInputValue = value => value ? String(value).slice(0, 10) : '';

// Menyusun Satker berdasarkan hubungan parent-child untuk pilihan bertingkat.
export function hierarchicalSatkerOptions(items) {
  const byParent = new Map();
  items.forEach(item => {
    if (!item.id_satker_induk) return;
    const key = item.id_satker_induk;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(item);
  });
  const result = [];
  const visit = (parentId, depth) => {
    (byParent.get(parentId) || [])
      .sort((a, b) => String(a.nama_satker).localeCompare(String(b.nama_satker)))
      .forEach(item => {
        const parent = items.find(candidate => candidate.id_satker === item.id_satker_induk);
        const parentName = parent?.nama_satker || 'MABES POLRI';
        const label = `${'— '.repeat(depth)}${item.nama_satker} (${item.tipe_satker}) · Induk: ${parentName}`;
        result.push({ ...item, nama_satker: label, label });
        visit(item.id_satker, depth + 1);
      });
  };
  items.filter(item => !item.id_satker_induk).forEach(root => visit(root.id_satker, 0));
  return result;
}

// Menampilkan hanya unit kerja paling kecil sebagai pilihan personel.
export function hierarchicalUnitOptions(items) {
  const byParent = new Map();
  items.forEach(item => {
    const key = item.id_unit_induk || 0;
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(item);
  });
  const result = [];
  const visit = (parentId, depth) => {
    (byParent.get(parentId) || [])
      .sort((a, b) => String(a.nama_unit).localeCompare(String(b.nama_unit)))
      .forEach(item => {
        const leaf = !(byParent.get(item.id_unit) || []).length;
        if (leaf) result.push({ ...item, nama_unit: `${'— '.repeat(depth)}${item.nama_unit} · Unit terkecil` });
        visit(item.id_unit, depth + 1);
      });
  };
  visit(0, 0);
  return result;
}

// Menambahkan token login dan meneruskan error API ke komponen pemanggil.
export async function request(path, options = {}) {
  const token = localStorage.getItem('sdm_token');
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'Request gagal.');
  return body;
}
