import { PasswordField } from './PasswordField';
import { DependentSatkerPicker } from '../personnel/DependentSatkerPicker';
import { GolonganSelect } from '../personnel/GolonganSelect';

export function AuthForm({ mode, form, satkers, pangkatPolri, golongan, title, showPassword, showConfirmPassword, error, notice, update, changeSatker, submit, resendOtp, changeMode, setShowPassword, setShowConfirmPassword }) {
  const isCredentialsMode = mode === 'login' || mode === 'register';

  return (
    <>
      <form onSubmit={submit} className={mode === 'register' ? 'registration-form' : ''}>
        {mode !== 'reset' && mode !== 'verify' && <UsernameFields mode={mode} form={form} satkers={satkers} pangkatPolri={pangkatPolri} golongan={golongan} update={update} changeSatker={changeSatker} />}
        {isCredentialsMode && <CredentialFields mode={mode} form={form} update={update} showPassword={showPassword} showConfirmPassword={showConfirmPassword} setShowPassword={setShowPassword} setShowConfirmPassword={setShowConfirmPassword} />}
        {mode === 'verify' && <OtpFields form={form} update={update} />}
        {mode === 'reset' && <ResetFields form={form} update={update} />}
        {error && <div className="alert">{error}</div>}
        {notice && <div className="hint">{notice}</div>}
        <button className="primary">{title}</button>
      </form>
      <div className="auth-links">
        {mode === 'login' && <><button type="button" onClick={() => changeMode('register')}>Daftar akun</button><button type="button" onClick={() => changeMode('forgot')}>Lupa password?</button></>}
        {mode === 'verify' && <button type="button" onClick={resendOtp}>Kirim ulang OTP</button>}
        {mode !== 'login' && <button type="button" onClick={() => changeMode('login')}>Kembali ke login</button>}
      </div>
    </>
  );
}

function UsernameFields({ mode, form, satkers, pangkatPolri, golongan, update, changeSatker }) {
  if (mode === 'forgot') return <label>Username atau email<input required name="identifier" value={form.identifier} onChange={update} autoComplete="username" /></label>;
  return <><label>Username<input required name="username" value={form.username} onChange={update} /></label>{mode === 'register' && <><label>Email validasi<input required type="email" name="email" value={form.email} onChange={update} /></label><label>Jenis user<select required name="jenis_personel" value={form.jenis_personel} onChange={update}><option value="POLRI">POLRI — NRP & pangkat</option><option value="ASN">ASN — NIP & golongan</option></select></label><label>Nama lengkap<input required name="nama" value={form.nama} onChange={update} /></label>{form.jenis_personel === 'POLRI' ? <><label>Pangkat<select required name="pangkat" value={form.pangkat} onChange={update}><option value="">Pilih pangkat POLRI...</option>{pangkatPolri.map(rank => <option key={rank} value={rank}>{rank}</option>)}</select></label><label>NRP<input required name="nip" inputMode="numeric" pattern="[0-9]{8}" maxLength="8" placeholder="8 digit" value={form.nip} onChange={update} /></label></> : <><label>Golongan<GolonganSelect items={golongan} value={form.id_golongan} onChange={update} required /></label><label>NIP<input required name="nip" inputMode="numeric" pattern="[0-9]{18}" maxLength="18" placeholder="18 digit" value={form.nip} onChange={update} /></label></>}<DependentSatkerPicker simple items={satkers} value={form.id_satker} onChange={changeSatker} /></>}</>;
}

function CredentialFields({ mode, form, update, showPassword, showConfirmPassword, setShowPassword, setShowConfirmPassword }) {
  return <><PasswordField label="Password" name="password" value={form.password} visible={showPassword} onChange={update} onToggle={() => setShowPassword(current => !current)} />{mode === 'register' && <PasswordField label="Ketik ulang password" name="confirm_password" value={form.confirm_password} visible={showConfirmPassword} onChange={update} onToggle={() => setShowConfirmPassword(current => !current)} />}</>;
}

function ResetFields({ form, update }) {
  return <><label>Token reset<input required name="token" value={form.token} onChange={update} /></label><label>Password baru<input required minLength="8" type="password" name="new_password" value={form.new_password} onChange={update} /></label><label>Masukkan ulang password<input required minLength="8" type="password" name="confirm_password" value={form.confirm_password} onChange={update} /></label></>;
}

function OtpFields({ form, update }) {
  return <><p className="muted">Masukkan 6 digit OTP yang dikirim ke {form.email}.</p><label>OTP email<input required inputMode="numeric" pattern="[0-9]{6}" maxLength="6" name="otp" value={form.otp} onChange={update} /></label></>;
}
