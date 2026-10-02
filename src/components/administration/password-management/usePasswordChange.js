import { useState } from 'react';
import { request } from '../../../api';

const initialForm = { current_password: '', new_password: '' };

export function usePasswordChange() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm(current => ({ ...current, [field]: value }));
    setError('');
    setMessage('');
  }

  async function save(event) {
    event.preventDefault();
    try {
      await request('/auth/me/password', { method: 'PUT', body: JSON.stringify(form) });
      setMessage('Password berhasil diperbarui.');
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    }
  }

  return { form, message, error, updateField, save };
}
