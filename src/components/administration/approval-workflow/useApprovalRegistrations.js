// Hook bersama untuk memuat daftar pending atau riwayat approval dengan pagination.
import { useEffect, useState } from 'react';
import { request } from '../../../api';

export function useApprovalRegistrations(endpoint) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [error, setError] = useState('');

  async function load(page = meta.page) {
    try {
      const result = await request(`/auth/registrations/${endpoint}?page=${page}&limit=10`);
      setItems(result.data || []);
      setMeta(result.meta || { page, limit: 10, total: 0 });
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { load(1); }, [endpoint]);

  return { items, meta, error, load, setError };
}
