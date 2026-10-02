import { useState } from 'react';
import { AccessManagementPage } from './AccessManagementPage';

function currentRole() {
  try { return JSON.parse(atob(localStorage.getItem('sdm_token')?.split('.')[1] || '')).role; } catch { return ''; }
}

export function ScopeManagementPage() {
  const [page, setPage] = useState(currentRole() === 'admin' ? 'approval' : 'scopes');
  return <AccessManagementPage page={page} onPage={setPage} />;
}
