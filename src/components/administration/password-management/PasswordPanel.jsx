// Orkestrasi drawer perubahan password.
import { PasswordChangeForm } from './PasswordChangeForm';
import { usePasswordChange } from './usePasswordChange';

export function PasswordPanel({ onClose }) {
  const passwordChange = usePasswordChange();

  return (
    <div className="drawer-backdrop">
      <section className="drawer">
        <div className="drawer-head">
          <div><span className="eyebrow">KEAMANAN</span><h2>Ganti password</h2></div>
          <button className="icon-btn" onClick={onClose}>×</button>
        </div>
        <PasswordChangeForm {...passwordChange} onClose={onClose} />
      </section>
    </div>
  );
}
