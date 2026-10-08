import { AuthForm } from './AuthForm';
import { useAuthFlow } from './useAuthFlow';

export function Login({ onLogin }) {
  const auth = useAuthFlow(onLogin);

  return (
    <main className="login">
      <section className="login-card">
        <span className="eyebrow">AS SDM KAPOLRI</span>
        <h1>Merit System Personel</h1>
        <p className="muted">Kelola data personel dan perjalanan karier secara terintegrasi.</p>
        <AuthForm {...auth} />
        <a className="rag-link" href="/rag/" target="_blank" rel="noreferrer">
          <span className="rag-link-icon" aria-hidden="true">✦</span>
          <span><strong>Chat Bantuan SDM</strong><small>Tanyakan ketentuan dari dokumen resmi tanpa login</small></span>
          <span className="rag-link-arrow" aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
