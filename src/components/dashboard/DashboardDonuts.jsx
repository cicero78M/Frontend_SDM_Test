function DonutCard({ title, description, ratio, variant = '', doneLabel, pendingLabel, multipleLabel }) {
  return (
    <section className="panel dashboard-card donut-card">
      <div className="panel-head"><div><h2>{title}</h2><p className="muted">{description}</p></div></div>
      <div className={`donut ${variant}`} style={{ '--ratio': `${ratio}%` }}><strong>{Math.round(ratio)}%</strong></div>
      <div className="legend"><span><i className={`done ${variant ? 'mutation-dot' : ''}`} /> {doneLabel}</span><span><i /> {pendingLabel}</span><span><i className="multiple-dot" /> {multipleLabel}</span></div>
    </section>
  );
}

export function DashboardDonuts({ overview, percent, pernahDiklat, pernahMutasi }) {
  return (
    <section className="dashboard-grid dashboard-grid-bottom">
      <DonutCard title="Personel pernah diklat" description="Gabungan data diklat legacy dan domain." ratio={percent(pernahDiklat)} doneLabel={`Pernah: ${pernahDiklat}`} pendingLabel={`Belum: ${overview.diklat?.belum || 0}`} multipleLabel={`Lebih dari 1 kali: ${overview.diklat?.lebih_dari_satu || 0}`} />
      <DonutCard title="Personel dengan riwayat mutasi" description="Berdasarkan tabel riwayat mutasi." ratio={percent(pernahMutasi)} variant="mutation" doneLabel={`Pernah: ${pernahMutasi}`} pendingLabel={`Belum: ${overview.mutasi?.belum || 0}`} multipleLabel={`Lebih dari 1 kali: ${overview.mutasi?.lebih_dari_satu || 0}`} />
    </section>
  );
}
