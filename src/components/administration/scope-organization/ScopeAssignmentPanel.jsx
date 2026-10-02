export function ScopeAssignmentPanel({ selected, satkers, scope, saving, setScope, save }) {
  return (
    <div className="panel">
      <h2>{selected ? `Satker untuk ${selected.username}` : 'Pilih user'}</h2>
      {selected && (
        <>
          <p className="muted">Pilih satu atau beberapa scope organisasi. Gunakan Ctrl/Cmd untuk memilih lebih dari satu.</p>
          <label>Scope Satker<select multiple size="10" value={scope.map(String)} onChange={event => setScope(Array.from(event.target.selectedOptions, option => Number(option.value)))}>{satkers.map(item => <option key={item.id_satker} value={item.id_satker}>{item.label}</option>)}</select></label>
          <div className="actions"><button className="primary" disabled={saving} onClick={save}>{saving ? 'Menyimpan…' : 'Simpan scope'}</button></div>
        </>
      )}
    </div>
  );
}
