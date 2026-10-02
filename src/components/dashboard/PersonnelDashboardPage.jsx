import { DashboardBars } from './DashboardBars';
import { DashboardDonuts } from './DashboardDonuts';
import { DashboardStats } from './DashboardStats';
import { PensionCard } from './PensionCard';
import { useDashboardOverview } from './useDashboardOverview';

export function PersonnelDashboardPage({ user }) {
  const { overview, error } = useDashboardOverview();

  if (error) return <section className="alert">{error}</section>;
  if (!overview) return <section className="panel"><p className="muted">Memuat visualisasi data personel…</p></section>;

  const total = overview.total_personel || 0;
  const pernahDiklat = overview.diklat?.pernah || 0;
  const pernahMutasi = overview.mutasi?.pernah || 0;
  const percent = value => total ? value / total * 100 : 0;

  return (
    <section className="page-section dashboard-page">
      <div className="page-heading"><div><span className="eyebrow">ANALISIS DATA PERSONEL</span><h1>Visualisasi Data Personel</h1><p className="muted">Ringkasan data dalam scope {user.role}, dihitung langsung dari database.</p></div></div>
      <DashboardStats total={total} pernahDiklat={pernahDiklat} pernahMutasi={pernahMutasi} pensiun={overview.pensiun} percent={percent} />
      <div className="dashboard-grid">
        <DashboardBars title="Status personel" items={overview.status} />
        <DashboardBars title="Golongan / pangkat POLRI" items={overview.golongan_polri} empty="Belum ada data golongan/pangkat POLRI." />
        <DashboardBars title="Golongan / pangkat ASN" items={overview.golongan_asn} empty="Belum ada data golongan/pangkat ASN." />
        <DashboardBars title="Kelompok jabatan / nivelering" items={overview.kelompok_jabatan} empty="Belum ada histori jabatan aktif dengan nivelering." />
        <DashboardBars title="Jenjang pendidikan" items={overview.pendidikan} />
        <DashboardBars title="Kelompok usia" items={overview.kelompok_usia} />
        <DashboardBars title="Lama dinas" items={overview.lama_dinas} />
        <PensionCard total={total} pension={overview.pensiun} />
      </div>
      <DashboardDonuts overview={overview} percent={percent} pernahDiklat={pernahDiklat} pernahMutasi={pernahMutasi} />
      <section className="dashboard-grid dashboard-grid-quality">
        <DashboardBars title="Kelengkapan data personel" items={overview.kualitas_data} empty="Tidak ada kekurangan data terdeteksi." />
        <DashboardBars title="Status validasi staging" items={overview.validasi_staging} empty="Tidak ada data staging dalam scope." />
      </section>
    </section>
  );
}
