// Orkestrasi pemilihan user dan pengaturan scope Satker.
import { ScopeAssignmentPanel } from './ScopeAssignmentPanel';
import { ScopeUserList } from './ScopeUserList';
import { useScopeOrganization } from './useScopeOrganization';

export function ScopeOrganizationPage() {
  const scopeData = useScopeOrganization();

  return (
    <section className="page-section">
      <div className="page-heading">
        <div><span className="eyebrow">ADMINISTRASI</span><h1>Scope Organisasi</h1><p className="muted">Tetapkan Satker yang boleh diakses setiap user operator.</p></div>
      </div>
      {scopeData.message && <div className="hint">{scopeData.message}</div>}
      {scopeData.error && <div className="alert">{scopeData.error}</div>}
      <div className="scope-layout">
        <ScopeUserList {...scopeData} />
        <ScopeAssignmentPanel {...scopeData} />
      </div>
    </section>
  );
}
