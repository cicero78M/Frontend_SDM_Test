// Modal perubahan role untuk user yang sudah disetujui.
import { useState } from 'react';
import { request } from '../../../api';
import { ApprovalRoleOptions } from '../approval-workflow/approvalRoles.jsx';

export function RolePromotionModal({ user, onClose, onSaved, onError }) {
  const [role, setRole] = useState(user.role);

  async function save(event) {
    event.preventDefault();
    try {
      await request(`/auth/users/${user.id_user}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
      onSaved();
    } catch (err) {
      onError(err);
    }
  }

  return <div className="drawer-backdrop"><section className="drawer compact-modal"><div className="drawer-head"><div><span className="eyebrow">AKSES USER</span><h2>Promote role</h2></div><button className="icon-btn" onClick={onClose}>×</button></div>
    <p className="muted">Ubah role untuk <strong>{user.username}</strong>.</p>
    <form onSubmit={save} className="form-grid"><label className="full">Role baru<select value={role} onChange={event => setRole(event.target.value)}><ApprovalRoleOptions /></select></label><div className="actions full"><button type="button" onClick={onClose}>Batal</button><button className="primary">Simpan role</button></div></form>
  </section></div>;
}
