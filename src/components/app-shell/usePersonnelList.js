import { useEffect, useState } from 'react';
import { request } from '../../api';

export const initialPersonnelFilters = {
  status: '',
  education: '',
  position: '',
  training: '',
  mutation: '',
  service_min: '',
  service_max: ''
};

export function usePersonnelList(user, page) {
  const [people, setPeople] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [statusError, setStatusError] = useState('');
  const [listError, setListError] = useState('');
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0 });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(initialPersonnelFilters);

  async function load(pageNumber = 1, limit = meta.limit || 10, activeFilters = filters) {
    try {
      setListError('');
      const params = new URLSearchParams({ page: pageNumber, limit, search });
      Object.entries(activeFilters).forEach(([key, value]) => { if (value !== '') params.set(key, value); });
      const result = await request(`/personel?${params.toString()}`);
      setPeople(result.data || []);
      setMeta(result.meta || { page: pageNumber, limit, total: 0 });
    } catch (error) {
      setPeople([]);
      setMeta(current => ({ ...current, page: pageNumber, total: 0 }));
      setListError(error.message || 'Data personel tidak dapat dimuat.');
    }
  }

  function updateFilter(name, value) {
    setFilters(current => ({ ...current, [name]: value }));
  }

  function resetFilters() {
    setFilters(initialPersonnelFilters);
  }

  useEffect(() => {
    if (!user) return;
    setStatusError('');
    request('/master/status-personel')
      .then(result => setStatusOptions((result.data || []).map(item => item.status)))
      .catch(error => {
        setStatusOptions([]);
        setStatusError(error.message || 'Filter status personel tidak dapat dimuat.');
      });
  }, [user]);

  useEffect(() => {
    if (user && page === 'people') load(1, meta.limit || 10, filters);
  }, [user, search, page, JSON.stringify(filters)]);

  return { people, meta, search, setSearch, load, filters, updateFilter, resetFilters, statusOptions, listError, statusError };
}
