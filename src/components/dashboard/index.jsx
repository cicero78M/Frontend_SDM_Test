import React, { useEffect, useState } from 'react';
import { request } from '../../api';

// Grafik batang generik yang dipakai oleh seluruh kelompok analitik.
export function DashboardBars({ title, items, empty = 'Belum ada data.' }) {
  const max = Math.max(...(items || []).map(item => Number(item.value) || 0), 1);
  return <section className="panel dashboard-card">
    <div className="panel-head"><div><h2>{title}</h2></div></div>
    {!(items || []).length && <p className="empty">{empty}</p>}
    {(items || []).map(item => <div className="bar-row" key={item.label}>
      <div className="bar-label"><span>{item.label}</span><strong>{item.value}</strong></div>
      <div className="bar-track"><span style={{ width: `${Math.max((Number(item.value) || 0) / max * 100, 2)}%` }} /></div>
    </div>)}
  </section>;
}

// Dashboard mengambil agregasi dari backend sehingga angka mengikuti scope user.
export function PersonnelDashboardPage({ user }) {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    request('/dashboard/overview')
      .then(result => setOverview(result.data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <section className="alert">{error}</section>;
  if (!overview) return <section className="panel"><p className="muted">Memuat visualisasi data personel…</p></section>;

  const total = overview.total_personel || 0;
  const pernahDiklat = overview.diklat?.pernah || 0;
  const pernahMutasi = overview.mutasi?.pernah || 0;
  // Nilai rasio dipertahankan desimal untuk CSS; teks statistik dibulatkan.
  const percent = value => total ? value / total * 100 : 0;

  return <section className="page-section dashboard-page">
    <div className="page-heading"><div><span className="eyebrow">ANALISIS DATA PERSONEL</span><h1>Visualisasi Data Personel</h1><p className="muted">Ringkasan data dalam scope {user.role}, dihitung langsung dari database.</p></div></div>
    <section className="stats">
      <div><span>Total personel</span><strong>{total}</strong><small>Dalam scope akses</small></div>
      <div><span>Pernah diklat</span><strong>{pernahDiklat}</strong><small>{Math.round(percent(pernahDiklat))}% dari personel</small></div>
      <div><span>Riwayat mutasi</span><strong>{pernahMutasi}</strong><small>{Math.round(percent(pernahMutasi))}% dari personel</small></div>
      <div><span>Mendekati pensiun</span><strong>{overview.pensiun?.mendekati || 0}</strong><small>Dalam 5 tahun</small></div>
    </section>
    <div className="dashboard-grid">
      <DashboardBars title="Status personel" items={overview.status} />
      <DashboardBars title="Golongan / pangkat POLRI" items={overview.golongan_polri} empty="Belum ada data golongan/pangkat POLRI." />
      <DashboardBars title="Golongan / pangkat ASN" items={overview.golongan_asn} empty="Belum ada data golongan/pangkat ASN." />
      <DashboardBars title="Kelompok jabatan / nivelering" items={overview.kelompok_jabatan} empty="Belum ada histori jabatan aktif dengan nivelering." />
      <DashboardBars title="Jenjang pendidikan" items={overview.pendidikan} />
      <DashboardBars title="Kelompok usia" items={overview.kelompok_usia} />
      <DashboardBars title="Lama dinas" items={overview.lama_dinas} />
      <section className="panel dashboard-card pension-card"><div className="panel-head"><div><h2>Proyeksi pensiun</h2><p className="muted">Berdasarkan tanggal lahir dan batas usia pensiun.</p></div></div><div className="pension-metrics"><div><strong>{overview.pensiun?.sudah || 0}</strong><span>Sudah melewati batas</span></div><div><strong>{overview.pensiun?.mendekati || 0}</strong><span>Mendekati ≤ 5 tahun</span></div><div><strong>{total - (overview.pensiun?.sudah || 0) - (overview.pensiun?.mendekati || 0)}</strong><span>Lebih dari 5 tahun</span></div></div></section>
    </div>
    <section className="dashboard-grid dashboard-grid-bottom">
      <DonutCard title="Personel pernah diklat" description="Gabungan data diklat legacy dan domain." ratio={percent(pernahDiklat)} doneLabel={`Pernah: ${pernahDiklat}`} pendingLabel={`Belum: ${overview.diklat?.belum || 0}`} multipleLabel={`Lebih dari 1 kali: ${overview.diklat?.lebih_dari_satu || 0}`} />
      <DonutCard title="Personel dengan riwayat mutasi" description="Berdasarkan tabel riwayat mutasi." ratio={percent(pernahMutasi)} variant="mutation" doneLabel={`Pernah: ${pernahMutasi}`} pendingLabel={`Belum: ${overview.mutasi?.belum || 0}`} multipleLabel={`Lebih dari 1 kali: ${overview.mutasi?.lebih_dari_satu || 0}`} />
    </section>
    {/* Kualitas data ditempatkan terakhir sesuai alur baca dashboard. */}
    <section className="dashboard-grid dashboard-grid-quality">
      <DashboardBars title="Kelengkapan data personel" items={overview.kualitas_data} empty="Tidak ada kekurangan data terdeteksi." />
      <DashboardBars title="Status validasi staging" items={overview.validasi_staging} empty="Tidak ada data staging dalam scope." />
    </section>
  </section>;
}

function DonutCard({ title, description, ratio, variant = '', doneLabel, pendingLabel, multipleLabel }) {
  return <section className="panel dashboard-card donut-card">
    <div className="panel-head"><div><h2>{title}</h2><p className="muted">{description}</p></div></div>
    <div className={`donut ${variant}`} style={{ '--ratio': `${ratio}%` }}><strong>{Math.round(ratio)}%</strong></div>
    <div className="legend"><span><i className={`done ${variant ? 'mutation-dot' : ''}`} /> {doneLabel}</span><span><i /> {pendingLabel}</span><span><i className="multiple-dot" /> {multipleLabel}</span></div>
  </section>;
}
