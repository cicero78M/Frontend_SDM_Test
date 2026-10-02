import { useEffect, useState } from 'react';
import { request } from '../../api';

export const initialPersonnelFilters = {
  status: '',
  education: '',
  training: '',
  mutation: '',
  service_min: '',
  service_max: ''
};

export function usePersonnelList(user, page) {
  const [people, setPeople] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialPersonnelFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialPersonnelFilters);

  async function load(pageNumber = 1, limit = meta.limit || 10, activeFilters = appliedFilters) {
    try {
      const params = new URLSearchParams({ page: pageNumber, limit, search });
      Object.entries(activeFilters).forEach(([key, value]) => { if (value !== '') params.set(key, value); });
      const result = await request(`/personel?${params.toString()}`);
      setPeople(result.data || []);
      setMeta(result.meta || { page: pageNumber, limit, total: 0 });
    } catch {}
  }

  function updateFilter(name, value) {
    setFilters(current => ({ ...current, [name]: value }));
  }

  function applyFilters() {
    setAppliedFilters({ ...filters });
  }

  function resetFilters() {
    setFilters(initialPersonnelFilters);
    setAppliedFilters(initialPersonnelFilters);
  }

  useEffect(() => {
    if (user && page === 'people') load(1, meta.limit || 10, appliedFilters);
  }, [user, search, page, JSON.stringify(appliedFilters)]);

  return { people, meta, search, setSearch, load, filters, updateFilter, applyFilters, resetFilters };
}
