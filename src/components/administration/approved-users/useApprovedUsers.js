// Hook data user aktif: fetch daftar dan pagination.
import { useEffect, useState } from 'react';
import { request } from '../../../api';

export function useApprovedUsers() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [error, setError] = useState('');

  async function load(page = meta.page, limit = meta.limit) {
    try {
      const result = await request(`/auth/users/approved?page=${page}&limit=${limit}`);
      setUsers(result.data || []);
      setMeta(result.meta || { page, limit, total: 0 });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(1, 10); }, []);

  return { users, meta, error, load, setError };
}
