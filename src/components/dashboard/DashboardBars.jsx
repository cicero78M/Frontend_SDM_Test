export function DashboardBars({ title, items, empty = 'Belum ada data.' }) {
  const max = Math.max(...(items || []).map(item => Number(item.value) || 0), 1);

  return (
    <section className="panel dashboard-card">
      <div className="panel-head"><div><h2>{title}</h2></div></div>
      {!(items || []).length && <p className="empty">{empty}</p>}
      {(items || []).map(item => <div className="bar-row" key={item.label}>
        <div className="bar-label"><span>{item.label}</span><strong>{item.value}</strong></div>
        <div className="bar-track"><span style={{ width: `${Math.max((Number(item.value) || 0) / max * 100, 2)}%` }} /></div>
      </div>)}
    </section>
  );
}
