import { useEffect, useState } from 'react';
import { hierarchicalSatkerOptions, request } from '../../../api';

export function useScopeOrganization() {
  const [users, setUsers] = useState([]);
  const [satkers, setSatkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [scope, setScope] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all(['/auth/users/approved?page=1&limit=100', '/master/satker/tree?scoped=true'].map(path => request(path)))
      .then(([usersResult, satkerResult]) => {
        setUsers(usersResult.data || []);
        setSatkers(hierarchicalSatkerOptions(satkerResult.data || []));
      })
      .catch(err => setError(err.message));
  }, []);

  async function choose(item) {
    setSelected(item);
    setMessage('');
    setError('');
    try {
      const result = await request(`/auth/users/${item.id_user}/scopes`);
      setScope((result.data || []).map(row => Number(row.id_satker)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function save() {
    if (!selected) return;
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await request(`/auth/users/${selected.id_user}/scopes`, { method: 'PUT', body: JSON.stringify({ id_satker: scope }) });
      setMessage(`Scope ${selected.username} berhasil diperbarui.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return { users, satkers, selected, scope, message, error, saving, choose, setScope, save };
}
