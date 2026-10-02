export function DashboardStats({ total, pernahDiklat, pernahMutasi, pensiun, percent }) {
  return (
    <section className="stats">
      <div><span>Total personel</span><strong>{total}</strong><small>Dalam scope akses</small></div>
      <div><span>Pernah diklat</span><strong>{pernahDiklat}</strong><small>{Math.round(percent(pernahDiklat))}% dari personel</small></div>
      <div><span>Riwayat mutasi</span><strong>{pernahMutasi}</strong><small>{Math.round(percent(pernahMutasi))}% dari personel</small></div>
      <div><span>Mendekati pensiun</span><strong>{pensiun?.mendekati || 0}</strong><small>Dalam 5 tahun</small></div>
    </section>
  );
}
