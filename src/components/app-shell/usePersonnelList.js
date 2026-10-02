import { useEffect, useState } from 'react';
import { request } from '../../api';

export function usePersonnelList(user, page) {
  const [people, setPeople] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');

  async function load(pageNumber = 1, limit = 10) {
    try {
      const result = await request(`/personel?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(search)}`);
      setPeople(result.data || []);
      setMeta(result.meta || { page: pageNumber, limit, total: 0 });
    } catch {}
  }

  useEffect(() => {
    if (user && page === 'people') load(1);
  }, [user, search, page]);

  return { people, meta, search, setSearch, load };
}
