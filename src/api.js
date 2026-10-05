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
  items.filter(item => !item.id_satker_induk)
    .sort((a, b) => String(a.nama_satker).localeCompare(String(b.nama_satker)))
    .forEach(root => {
      result.push({ ...root, label: `${root.nama_satker} (${root.tipe_satker})` });
      visit(root.id_satker, 1);
    });
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

// Mengubah detail validasi API menjadi pesan yang dapat dipahami operator.
function apiErrorMessage(body, fallback = 'Request gagal.') {
  const details = Array.isArray(body?.details) ? body.details : [];
  if (!details.length) return body?.error || body?.message || fallback;
  const explanation = details
    .map(item => `${item.label || item.field || 'Data'}: ${item.message || 'tidak valid'}`)
    .join(' • ');
  return `${body?.error || 'Validasi gagal.'} ${explanation}`;
}

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'API_ERROR', details = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Menambahkan token login dan meneruskan error API ke komponen pemanggil.
export async function request(path, options = {}) {
  const token = localStorage.getItem('sdm_token');
  const { timeoutMs = 20000, signal, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const abortFromCaller = () => controller.abort();
  signal?.addEventListener('abort', abortFromCaller, { once: true });

  try {
    const response = await fetch(`${API}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(fetchOptions.headers || {})
      }
    });
    const rawBody = response.status === 204 ? '' : await response.text();
    let body = null;
    if (rawBody) {
      try {
        body = JSON.parse(rawBody);
      } catch {
        body = { message: 'Server mengembalikan respons yang tidak valid.' };
      }
    }
    if (response.status === 401 && token) window.dispatchEvent(new Event('sdm:unauthorized'));
    if (!response.ok) {
      throw new ApiError(apiErrorMessage(body, `Request gagal (${response.status}).`), {
        status: response.status,
        code: body?.code || `HTTP_${response.status}`,
        details: body?.details
      });
    }
    return body;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error.name === 'AbortError') {
      throw new ApiError(signal?.aborted ? 'Request dibatalkan.' : 'Request terlalu lama dan dihentikan.', { code: signal?.aborted ? 'ABORTED' : 'TIMEOUT' });
    }
    throw new ApiError('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.', { code: 'NETWORK_ERROR' });
  } finally {
    window.clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }
}
