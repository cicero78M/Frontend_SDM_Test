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

Atur `VITE_API_BASE_URL` sesuai alamat backend. Frontend menyediakan login, dashboard daftar personel, pencarian, form tambah/edit, status akses, dan penanganan error dasar. Riwayat jabatan akan diaktifkan setelah endpoint histori pada backend selesai dimigrasikan sesuai [rencana pengembangan](https://github.com/cicero78M/Backend_SDM_Test/blob/main/docs/RENCANA_PENGEMBANGAN.md).

## Struktur

- `src/main.jsx` — API client, login, dashboard, tabel, dan form personel.
- `src/styles.css` — layout dashboard dan responsive UI.
- `.env.example` — alamat REST API publik/non-secret.
