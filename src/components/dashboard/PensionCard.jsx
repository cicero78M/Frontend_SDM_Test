export function PensionCard({ total, pension }) {
  const sudah = pension?.sudah || 0;
  const mendekati = pension?.mendekati || 0;

  return (
    <section className="panel dashboard-card pension-card">
      <div className="panel-head"><div><h2>Proyeksi pensiun</h2><p className="muted">Berdasarkan tanggal lahir dan batas usia pensiun.</p></div></div>
      <div className="pension-metrics">
        <div><strong>{sudah}</strong><span>Sudah melewati batas</span></div>
        <div><strong>{mendekati}</strong><span>Mendekati ≤ 5 tahun</span></div>
        <div><strong>{total - sudah - mendekati}</strong><span>Lebih dari 5 tahun</span></div>
      </div>
    </section>
  );
}
