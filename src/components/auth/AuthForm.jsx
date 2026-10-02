import { PasswordField } from './PasswordField';

export function AuthForm({ mode, form, title, showPassword, showConfirmPassword, error, notice, update, submit, changeMode, setShowPassword, setShowConfirmPassword }) {
  const isCredentialsMode = mode === 'login' || mode === 'register';

  return (
    <>
      <form onSubmit={submit}>
        {mode !== 'reset' && <UsernameFields mode={mode} form={form} update={update} />}
        {isCredentialsMode && <CredentialFields mode={mode} form={form} update={update} showPassword={showPassword} showConfirmPassword={showConfirmPassword} setShowPassword={setShowPassword} setShowConfirmPassword={setShowConfirmPassword} />}
        {mode === 'reset' && <ResetFields form={form} update={update} />}
        {error && <div className="alert">{error}</div>}
        {notice && <div className="hint">{notice}</div>}
        <button className="primary">{title}</button>
      </form>
      <div className="auth-links">
        {mode === 'login' && <><button onClick={() => changeMode('register')}>Daftar akun</button><button onClick={() => changeMode('forgot')}>Lupa password?</button></>}
        {mode !== 'login' && <button onClick={() => changeMode('login')}>Kembali ke login</button>}
      </div>
    </>
  );
}

function UsernameFields({ mode, form, update }) {
  return <><label>Username<input required name="username" value={form.username} onChange={update} /></label>{mode === 'register' && <><label>Nama lengkap<input required name="nama" value={form.nama} onChange={update} /></label><label>Pangkat<input required name="pangkat" value={form.pangkat} onChange={update} /></label><label>NRP/NIP<input required name="nip" value={form.nip} onChange={update} /></label><label>Satker asal<input required name="satker_asal" value={form.satker_asal} onChange={update} /></label></>}</>;
}

function CredentialFields({ mode, form, update, showPassword, showConfirmPassword, setShowPassword, setShowConfirmPassword }) {
  return <><PasswordField label="Password" name="password" value={form.password} visible={showPassword} onChange={update} onToggle={() => setShowPassword(current => !current)} />{mode === 'register' && <PasswordField label="Ketik ulang password" name="confirm_password" value={form.confirm_password} visible={showConfirmPassword} onChange={update} onToggle={() => setShowConfirmPassword(current => !current)} />}</>;
}

function ResetFields({ form, update }) {
  return <><label>Token reset<input required name="token" value={form.token} onChange={update} /></label><label>Password baru<input required minLength="8" type="password" name="new_password" value={form.new_password} onChange={update} /></label></>;
}
