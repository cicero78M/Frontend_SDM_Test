export function ScopeAssignmentPanel({ selected, satkers, scope, saving, toggle, save }) {
  return (
    <div className="panel">
      <h2>{selected ? `Satker untuk ${selected.username}` : 'Pilih user'}</h2>
      {selected && (
        <>
          <p className="muted">Centang satu atau beberapa Satker sesuai kewenangan user.</p>
          <div className="scope-checklist">
            {satkers.map(item => (
              <label key={item.id_satker}>
                <input type="checkbox" checked={scope.includes(Number(item.id_satker))} onChange={() => toggle(Number(item.id_satker))} />
                <span>{item.nama_satker}<small>{item.kode_satker} · {item.tipe_satker}</small></span>
              </label>
            ))}
          </div>
          <div className="actions"><button className="primary" disabled={saving} onClick={save}>{saving ? 'Menyimpan…' : 'Simpan scope'}</button></div>
        </>
      )}
    </div>
  );
}
