import React, { useState } from 'react';
import { request } from '../../api';

// Halaman autentikasi menangani empat alur: masuk, registrasi, lupa password,
// dan reset password menggunakan token dari backend.
export function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', nama: '', pangkat: '', nip: '', satker_asal: '', password: '', confirm_password: '', current_password: '', new_password: '', token: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(event) {
    event.preventDefault(); setError(''); setNotice('');
    try {
      if (mode === 'login') {
        const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ username: form.username, password: form.password }) });
        localStorage.setItem('sdm_token', result.token); onLogin(result.user);
      }
      if (mode === 'register') {
        if (form.password !== form.confirm_password) { setError('Password dan ketik ulang password harus sama.'); return; }
        await request('/auth/register', { method: 'POST', body: JSON.stringify({ username: form.username, nama: form.nama, pangkat: form.pangkat, nip: form.nip, satker_asal: form.satker_asal, password: form.password }) });
        setNotice('Registrasi berhasil diajukan sebagai Viewer dan menunggu approval admin.'); setMode('login');
      }
      if (mode === 'forgot') {
        const result = await request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ username: form.username }) });
        setNotice(result.message); if (result.reset_token) { setForm({ ...form, token: result.reset_token }); setMode('reset'); }
      }
      if (mode === 'reset') {
        await request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: form.token, new_password: form.new_password }) });
        setNotice('Password berhasil direset. Silakan login.'); setMode('login');
      }
    } catch (err) { setError(err.message); }
  }

  const title = { login: 'Masuk ke aplikasi', register: 'Ajukan pendaftaran', forgot: 'Lupa password', reset: 'Password baru' }[mode];
  return <main className="login"><section className="login-card"><span className="eyebrow">AS SDM KAPOLRI</span><h1>Merit System Personel</h1><p className="muted">Kelola data personel dan perjalanan karier secara terintegrasi.</p><form onSubmit={submit}>
    {(mode !== 'reset') && <><label>Username<input required name="username" value={form.username} onChange={update} /></label>{mode === 'register' && <><label>Nama lengkap<input required name="nama" value={form.nama} onChange={update} /></label><label>Pangkat<input required name="pangkat" value={form.pangkat} onChange={update} /></label><label>NRP/NIP<input required name="nip" value={form.nip} onChange={update} /></label><label>Satker asal<input required name="satker_asal" value={form.satker_asal} onChange={update} /></label></>}</>}
    {mode === 'login' || mode === 'register' ? <><label>Password<div className="password-wrap"><input required minLength="8" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={update} /><button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>{mode === 'register' && <label>Ketik ulang password<div className="password-wrap"><input required minLength="8" type={showConfirmPassword ? 'text' : 'password'} name="confirm_password" value={form.confirm_password} onChange={update} /><button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>}</> : null}
    {mode === 'reset' && <><label>Token reset<input required name="token" value={form.token} onChange={update} /></label><label>Password baru<input required minLength="8" type="password" name="new_password" value={form.new_password} onChange={update} /></label></>}
    {error && <div className="alert">{error}</div>}{notice && <div className="hint">{notice}</div>}<button className="primary">{title}</button>
  </form><div className="auth-links">{mode === 'login' && <><button onClick={() => { setMode('register'); setError(''); }}>Daftar akun</button><button onClick={() => { setMode('forgot'); setError(''); }}>Lupa password?</button></>}{mode !== 'login' && <button onClick={() => { setMode('login'); setError(''); }}>Kembali ke login</button>}</div></section></main>;
}
