export function PasswordChangeForm({ form, message, error, updateField, save, onClose }) {
  return (
    <form onSubmit={save} className="form-grid">
      <label className="full">
        Password saat ini
        <input required type="password" value={form.current_password} onChange={event => updateField('current_password', event.target.value)} />
      </label>
      <label className="full">
        Password baru
        <input required minLength="8" type="password" value={form.new_password} onChange={event => updateField('new_password', event.target.value)} />
      </label>
      {error && <div className="alert full">{error}</div>}
      {message && <div className="hint full">{message}</div>}
      <div className="actions full">
        <button type="button" onClick={onClose}>Tutup</button>
        <button className="primary">Simpan password</button>
      </div>
    </form>
  );
}
