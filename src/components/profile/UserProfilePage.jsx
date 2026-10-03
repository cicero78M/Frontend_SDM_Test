import { useEffect, useState } from 'react';
import { request } from '../../api';

const roleLabels = {
  admin: 'Administrator',
  admin_ssdm: 'Administrator SSDM',
  editor: 'Editor',
  viewer: 'Viewer',
  operator_polda: 'Operator Polda',
  operator_satker: 'Operator Satker',
  operator_polres: 'Operator Polres'
};

function Field({ label, value }) {
  return <div className="profile-field"><dt>{label}</dt><dd>{value || '-'}</dd></div>;
}

export function UserProfilePage({ user, onPassword }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    request('/auth/me/profile')
      .then(result => { if (mounted) setProfile(result.profile); })
      .catch(err => { if (mounted) setError(err.message); });
    return () => { mounted = false; };
  }, []);

  const data = profile || user || {};
  const initials = String(data.nama || data.username || '?').trim().charAt(0).toUpperCase();

  return <>
    <header>
      <div><span className="eyebrow">AKUN SAYA</span><h1>Profil user</h1><p className="muted">Informasi akun dan identitas pengguna aplikasi.</p></div><button className="primary" onClick={onPassword}>Ganti password</button>
    </header>
    <section className="profile-layout">
      <article className="panel profile-hero">
        <div className="profile-avatar" aria-hidden="true">{initials}</div>
        <div><h2>{data.nama || data.username || 'User'}</h2><p className="muted">@{data.username || '-'}</p><span className="badge profile-role">{roleLabels[data.role] || data.role || '-'}</span></div>
      </article>
      <article className="panel profile-details">
        <div className="panel-head"><div><span className="eyebrow">DETAIL AKUN</span><h2>Informasi profil</h2></div></div>
        {error && <div className="alert">{error}</div>}
        <dl className="profile-grid">
          <Field label="Nama lengkap" value={data.nama} />
          <Field label="Username" value={data.username} />
          <Field label="Email" value={data.email} />
          <Field label="Jenis personel" value={data.jenis_personel} />
          <Field label="NRP / NIP" value={data.nip} />
          <Field label="Pangkat / golongan" value={data.pangkat} />
          <Field label="Satker" value={data.nama_satker || data.satker_asal} />
          <Field label="Kode satker" value={data.kode_satker} />
        </dl>
      </article>
    </section>
  </>;
}
