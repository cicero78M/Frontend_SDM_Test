// Entry point administrasi akses: re-export fitur agar pemanggil tetap sederhana.
import React, { useState } from 'react';
import { AccessManagementPage } from './AccessManagementPage';

export { PagePagination } from './PagePagination';
export { PasswordPanel } from './password-management/PasswordPanel';

export function ScopeManagementPage() { const role = (() => { try { return JSON.parse(atob(localStorage.getItem('sdm_token')?.split('.')[1] || '')).role; } catch { return ''; } })(); const [page, setPage] = useState(role === 'admin' ? 'approval' : 'scopes'); return <AccessManagementPage page={page} onPage={setPage} />; }
