import { useState } from 'react';
import { request } from '../../api';

const initialForm = { username: '', email: '', nama: '', pangkat: '', nip: '', satker_asal: '', password: '', confirm_password: '', new_password: '', token: '', registration_id: '', otp: '' };
const titles = { login: 'Masuk ke aplikasi', register: 'Ajukan pendaftaran', verify: 'Validasi email', forgot: 'Lupa password', reset: 'Password baru' };

export function useAuthFlow(onLogin) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  function update(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    try {
      if (mode === 'login') {
        const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ username: form.username, password: form.password }) });
        localStorage.setItem('sdm_token', result.token);
        onLogin(result.user);
      }
      if (mode === 'register') await register();
      if (mode === 'verify') await verifyEmail();
      if (mode === 'forgot') await requestResetToken();
      if (mode === 'reset') await resetPassword();
    } catch (err) {
      setError(err.message);
    }
  }

  async function register() {
    if (form.password !== form.confirm_password) {
      setError('Password dan ketik ulang password harus sama.');
      return;
    }
    const result = await request('/auth/register', { method: 'POST', body: JSON.stringify({ username: form.username, email: form.email, nama: form.nama, pangkat: form.pangkat, nip: form.nip, satker_asal: form.satker_asal, password: form.password }) });
    setForm(current => ({ ...current, registration_id: result.id_registration, otp: '' }));
    setNotice(result.message || 'OTP validasi email telah dikirim.');
    setMode('verify');
  }

  async function verifyEmail() {
    const result = await request('/auth/register/verify-email', { method: 'POST', body: JSON.stringify({ registration_id: Number(form.registration_id), otp: form.otp }) });
    setNotice(result.message || 'Email berhasil divalidasi.');
    setMode('login');
  }

  async function resendOtp() {
    setError('');
    try {
      const result = await request('/auth/register/resend-otp', { method: 'POST', body: JSON.stringify({ registration_id: Number(form.registration_id) }) });
      setNotice(result.message);
    } catch (err) {
      setError(err.message);
    }
  }

  async function requestResetToken() {
    const result = await request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ username: form.username }) });
    setNotice(result.message);
    if (result.reset_token) {
      setForm(current => ({ ...current, token: result.reset_token }));
      setMode('reset');
    }
  }

  async function resetPassword() {
    await request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: form.token, new_password: form.new_password }) });
    setNotice('Password berhasil direset. Silakan login.');
    setMode('login');
  }

  return { mode, form, title: titles[mode], showPassword, showConfirmPassword, error, notice, update, submit, resendOtp, changeMode, setShowPassword, setShowConfirmPassword };
}
