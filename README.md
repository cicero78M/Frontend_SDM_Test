# Frontend SDM Test — Merit System Personel Polri

Prototype frontend terpisah untuk aplikasi pengelolaan data personel dan perjalanan karier. Aplikasi mengonsumsi REST API dari repository [`Backend_SDM_Test`](https://github.com/cicero78M/Backend_SDM_Test).

## Tech stack

- React dan Vite
- Fetch API dengan Bearer JWT
- CSS responsive tanpa secret di browser

## Menjalankan

```bash
cp .env.example .env
npm install
npm run dev
```

Atur `VITE_API_BASE_URL` sesuai alamat backend. Frontend saat ini menyediakan login, dashboard daftar personel berbasis scope, pencarian, form tambah/edit personel POLRI/ASN, profil dan timeline riwayat jabatan, pemilih pangkat POLRI, serta menu admin Scope Organisasi. API tetap menjadi sumber keputusan permission; menu frontend hanya membantu pengalaman pengguna.

Build production:

```bash
npm run build
```

Menu administrasi user/approval dan uji end-to-end tiga persona masih dalam tahap penyelesaian roadmap.

## Struktur

- `src/main.jsx` — API client, login, dashboard, tabel, dan form personel.
- `src/styles.css` — layout dashboard, visualisasi, drawer, form, dan responsive UI.
- `.env.example` — alamat REST API publik/non-secret.

## Halaman dan fitur terbaru

### Visualisasi Data

Halaman awal setelah login. Agregasi diambil dari backend dan dibatasi sesuai
scope user, meliputi:

- total/status personel;
- jenjang pendidikan;
- personel pernah diklat dan yang belum;
- personel dengan riwayat mutasi dan yang belum;
- lama dinas (`<5`, `5–9`, `10–19`, `20+` tahun);
- kelompok jabatan/nivelering berdasarkan histori jabatan aktif;
- kelompok usia yang tidak tumpang tindih: `18–25`, `26–35`, `36–45`, `46–58`
  tahun, serta kategori di luar rentang bila ada;
- proyeksi pensiun: sudah melewati batas, mendekati pensiun dalam 5 tahun,
  dan lebih dari 5 tahun.

### Data Personel

Daftar personel mendukung pagination, pencarian, tambah/update, pemilihan
Satker bertingkat, dan unit kerja sampai unit terkecil. Form hanya meminta
**Jenis personel**: POLRI otomatis menggunakan NRP, sedangkan ASN, PPPK,
HONORER, dan LAINNYA otomatis menggunakan NIP. Pilihan `Jenis identitas`
tidak lagi tersedia secara manual.

### Profil Personel

Profil memakai satu drawer dengan tiga tab agar workflow tidak bertumpuk:

1. **Ringkasan** — identitas, Satker, jabatan saat ini, status, dan jumlah
   histori/kualifikasi.
2. **Riwayat Jabatan** — timeline kronologis serta tambah/edit/hapus histori.
3. **Pendidikan & Diklat** — tombol input terpisah `+ Input pendidikan` dan
   `+ Input diklat`; form hanya terbuka setelah dipilih.

### Administrasi dan navigasi

- Scope Organisasi untuk Admin SSDM/Admin.
- Login, registrasi, lupa/reset password, dan ganti password.
- Sidebar desktop permanen; sidebar mobile memiliki tombol buka, tombol tutup,
  overlay, dan auto-close setelah menu dipilih.

## Endpoint utama yang digunakan

- `GET /api/v1/personel`
- `GET /api/v1/personel/:id/profile`
- CRUD `/api/v1/personel/:id/riwayat-jabatan`
- CRUD `/api/v1/personel/:id/pendidikan`
- CRUD `/api/v1/personel/:id/diklat`
- `GET /api/v1/dashboard/overview`
- master Satker, unit kerja, jabatan, fungsi, level, dan status jabatan

Build production:

```bash
npm run build
```

Build terakhir lulus setelah dashboard visualisasi, workflow kualifikasi,
aturan NRP/NIP otomatis, dan navigasi mobile diperbarui.
