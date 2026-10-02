import { useEffect, useState } from 'react';
import { request } from '../../api';

const resetToken = new URLSearchParams(window.location.search).get('reset_token') || '';
const initialForm = { username: '', identifier: '', email: '', nama: '', jenis_personel: 'POLRI', pangkat: '', id_golongan: '', nip: '', id_satker: '', password: '', confirm_password: '', new_password: '', token: resetToken, registration_id: '', otp: '' };
const titles = { login: 'Masuk ke aplikasi', register: 'Ajukan pendaftaran', verify: 'Validasi email', forgot: 'Lupa password', reset: 'Password baru' };

export function useAuthFlow(onLogin) {
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login');
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [satkers, setSatkers] = useState([]);
  const [pangkatPolri, setPangkatPolri] = useState([]);
  const [golongan, setGolongan] = useState([]);

  useEffect(() => {
    Promise.all(['/public/satker/tree', '/public/pangkat-polri', '/public/golongan'].map(path => request(path)))
      .then(([satkerResult, pangkatResult, golonganResult]) => {
        setSatkers(satkerResult.data || []);
        setPangkatPolri(pangkatResult.data || []);
        setGolongan(golonganResult.data || []);
      }).catch(err => setError(err.message));
  }, []);

  function update(event) {
    if (event.target.name === 'jenis_personel') {
      setForm(current => ({ ...current, jenis_personel: event.target.value, pangkat: '', id_golongan: '', nip: '' }));
      return;
    }
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  function changeSatker(value) {
    setForm(current => ({ ...current, id_satker: value }));
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
    const result = await request('/auth/register', { method: 'POST', body: JSON.stringify({ username: form.username, email: form.email, nama: form.nama, jenis_personel: form.jenis_personel, pangkat: form.jenis_personel === 'POLRI' ? form.pangkat : null, id_golongan: form.jenis_personel === 'ASN' ? Number(form.id_golongan) : null, nip: form.nip, id_satker: Number(form.id_satker), password: form.password }) });
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
    const result = await request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ identifier: form.identifier }) });
    setNotice(result.message);
  }

  async function resetPassword() {
    if (form.new_password !== form.confirm_password) {
      setError('Password baru dan masukan ulang password harus sama.');
      return;
    }
    await request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token: form.token, new_password: form.new_password, confirm_password: form.confirm_password }) });
    window.history.replaceState({}, document.title, window.location.pathname);
    setNotice('Password berhasil direset. Silakan login.');
    setMode('login');
  }

  return { mode, form, satkers, pangkatPolri, golongan, title: titles[mode], showPassword, showConfirmPassword, error, notice, update, changeSatker, submit, resendOtp, changeMode, setShowPassword, setShowConfirmPassword };
}
