import { useEffect, useState } from 'react';
import { request } from '../../api';

export function useDashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    request('/dashboard/overview')
      .then(result => setOverview(result.data))
      .catch(err => setError(err.message));
  }, []);

  return { overview, error };
}
