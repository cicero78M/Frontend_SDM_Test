// Navigasi antar fitur administrasi akses.
import React from 'react';
import { ApprovedUsersPage } from './ApprovedUsersPage';
import { ApprovalHistoryPage } from './approval/ApprovalHistoryPage';
import { ApprovalPage } from './approval/ApprovalPage';
import { ScopeOrganizationPage } from './ScopeOrganizationPage';

export function AccessManagementPage({ page, onPage }) { return <section className="page-section"><div className="subpage-nav"><button className={page === 'users' ? 'active' : ''} onClick={() => onPage('users')}>Data User</button><button className={page === 'history' ? 'active' : ''} onClick={() => onPage('history')}>Riwayat Persetujuan</button><button className={page === 'approval' ? 'active' : ''} onClick={() => onPage('approval')}>Permintaan Akses</button><button className={page === 'scopes' ? 'active' : ''} onClick={() => onPage('scopes')}>Scope Organisasi</button></div>{page === 'users' && <ApprovedUsersPage />}{page === 'history' && <ApprovalHistoryPage />}{page === 'approval' && <ApprovalPage />}{page === 'scopes' && <ScopeOrganizationPage />}</section>; }
