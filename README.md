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

Atur `VITE_API_BASE_URL` sesuai alamat backend. Frontend saat ini menyediakan login, dashboard daftar personel berbasis scope, pencarian, form tambah/edit personel POLRI/ASN, profil dan timeline riwayat jabatan, pemilih pangkat POLRI, serta Administrasi Akses untuk admin pertama. API tetap menjadi sumber keputusan permission; menu frontend hanya membantu pengalaman pengguna.

Build production:

```bash
npm run build
```

## Struktur

- `src/main.jsx` — entry point aplikasi dan orkestrasi halaman utama.
- `src/api.js` — API client, utilitas hierarki Satker/unit, dan format tanggal.
- `src/components/auth/` — login, registrasi, reset/ganti password, dan alur sesi.
- `src/components/app-shell/` — layout, sidebar, daftar personel, dan responsive shell.
- `src/components/personnel/` — form personel, profil karier, riwayat jabatan, pendidikan/diklat, dan picker organisasi.
- `src/components/administration/` — user, approval, permission, scope, dan password administration.
- `src/components/dashboard/` — ringkasan dan visualisasi analitik.
- `src/styles/index.css` — entrypoint stylesheet aplikasi.
- `src/styles/base.css` — baseline layout, visualisasi, drawer, form, dan responsive UI; pemecahan fitur dilakukan bertahap agar cascade tetap stabil.
- `.env.example` — alamat REST API publik/non-secret.

## Halaman dan fitur terbaru

### Visualisasi Data

Halaman awal setelah login. Agregasi diambil dari backend dan dibatasi sesuai
scope user, meliputi:

- total/status personel;
- distribusi golongan/pangkat dari master personel, dipisahkan menjadi chart POLRI dan chart ASN;
- kualitas data personel: kelengkapan field dan status validasi data staging;
- jenjang pendidikan;
- personel pernah diklat, yang belum, dan personel dengan lebih dari satu riwayat diklat;
- personel dengan riwayat mutasi, yang belum, dan personel dengan lebih dari satu riwayat mutasi;
- lama dinas (`<5`, `5–9`, `10–19`, `20+` tahun);
- kelompok jabatan/nivelering berdasarkan histori jabatan aktif;
- kelompok usia yang tidak tumpang tindih: `18–25`, `26–35`, `36–45`, `46–58`
  tahun, serta kategori di luar rentang bila ada;
- proyeksi pensiun: sudah melewati batas, mendekati pensiun dalam 5 tahun,
  dan lebih dari 5 tahun.

Urutan dashboard disusun dari ringkasan umum menuju detail: ringkasan utama,
demografi, pangkat/jabatan, pendidikan dan masa dinas, proyeksi pensiun,
diklat/mutasi, lalu kualitas dan kesiapan data.

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

- Administrasi Akses untuk admin pertama, terdiri dari Data User, Riwayat Persetujuan, Permintaan Akses, dan Scope Organisasi.
- Halaman Permintaan Akses menampilkan registrasi pending dan menyediakan aksi Setujui/Tolak serta penetapan role.
- Approval registrasi hanya dapat diproses oleh role `admin` pertama; Admin SSDM tetap mengelola scope dan user aktif sesuai kewenangannya.
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
- `GET/PATCH /api/v1/auth/registrations/pending` dan `/api/v1/auth/registrations/:id`
- `GET /api/v1/auth/registrations/history`
- `GET /api/v1/auth/users/approved`
- master Satker, unit kerja, jabatan, fungsi, level, dan status jabatan

Build production:

```bash
npm run build
```

Build terakhir lulus setelah dashboard visualisasi, workflow kualifikasi,
aturan NRP/NIP otomatis, dan navigasi mobile diperbarui.
