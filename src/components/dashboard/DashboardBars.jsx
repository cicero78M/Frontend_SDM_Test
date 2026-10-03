export function DashboardBars({ title, items, empty = 'Belum ada data.', total = 0 }) {
  const rows = (items || []).map(item => ({ ...item, value: Number(item.value) || 0 }));
  const max = Math.max(...rows.map(item => item.value), 1);

  return (
    <section className="panel dashboard-card">
      <div className="panel-head"><div><h2>{title}</h2></div></div>
      {!(items || []).length && <p className="empty">{empty}</p>}
      {rows.map(item => <div className="bar-row" key={item.label}>
        <div className="bar-label"><span title={item.label}>{item.label}</span><strong>{item.value}{total > 0 && <small>{Math.round(item.value / total * 100)}%</small>}</strong></div>
        <div className="bar-track" role="img" aria-label={`${item.label}: ${item.value}`}><span style={{ width: `${Math.max(item.value / max * 100, 2)}%` }} /></div>
      </div>)}
    </section>
  );
}
