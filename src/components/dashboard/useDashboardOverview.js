import { useEffect, useState } from 'react';
import { request } from '../../api';

export function useDashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    setError('');
    request('/dashboard/overview')
      .then(result => setOverview(result.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  return { overview, error, loading, reload: load };
}
