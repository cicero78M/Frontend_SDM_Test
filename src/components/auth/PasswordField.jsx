export function PasswordField({ label, name, value, visible, onChange, onToggle, minLength = 8 }) {
  return (
    <label>
      {label}
      <div className="password-wrap">
        <input required minLength={minLength} type={visible ? 'text' : 'password'} name={name} value={value} onChange={onChange} />
        <button type="button" className="password-toggle" onClick={onToggle}>{visible ? 'Sembunyikan' : 'Lihat'}</button>
      </div>
    </label>
  );
}
