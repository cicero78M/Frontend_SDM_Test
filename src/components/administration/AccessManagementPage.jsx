// Navigasi antar fitur administrasi akses.
import React from 'react';
import { ApprovedUsersPage } from './approved-users/ApprovedUsersPage';
import { ApprovalHistoryPage } from './approval-workflow/ApprovalHistoryPage';
import { ApprovalPage } from './approval-workflow/ApprovalPage';
import { ScopeOrganizationPage } from './scope-organization/ScopeOrganizationPage';

export function AccessManagementPage({ page, onPage }) {
  return <section className="page-section">
    <AccessTabs page={page} onPage={onPage} />
    {page === 'users' && <ApprovedUsersPage />}
    {page === 'history' && <ApprovalHistoryPage />}
    {page === 'approval' && <ApprovalPage />}
    {page === 'scopes' && <ScopeOrganizationPage />}
  </section>;
}

function AccessTabs({ page, onPage }) {
  const tabs = [['users', 'Data User'], ['history', 'Riwayat Persetujuan'], ['approval', 'Permintaan Akses'], ['scopes', 'Scope Organisasi']];
  return <div className="subpage-nav">{tabs.map(([value, label]) => <button key={value} className={page === value ? 'active' : ''} onClick={() => onPage(value)}>{label}</button>)}</div>;
}
