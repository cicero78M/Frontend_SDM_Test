// Role yang dapat dipilih saat memproses pendaftaran akses.
export const APPROVAL_ROLES = [
  ['viewer', 'Viewer'],
  ['editor', 'Editor'],
  ['operator_satker', 'Operator Satker'],
  ['operator_polda', 'Operator Polda'],
  ['admin_ssdm', 'Admin SSDM'],
  ['admin', 'Admin'],
];

export function ApprovalRoleOptions() {
  return APPROVAL_ROLES.map(([value, label]) => <option key={value} value={value}>{label}</option>);
}
