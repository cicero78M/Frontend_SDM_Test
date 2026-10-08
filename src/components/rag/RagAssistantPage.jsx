import { useEffect, useRef, useState } from 'react';

const RAG_API = '/rag/api';
const suggestions = ['Apa persyaratan administrasi SBP?', 'Apa isi 13 komponen penilaian?', 'Bagaimana tahapan seleksi SBP?'];

function renderAnswer(answer) {
  return String(answer || '').split('\n').map((line, index) => {
    const key = `${index}-${line}`;
    if (/^###\s+/.test(line)) return <h3 key={key}>{line.replace(/^###\s+/, '')}</h3>;
    if (/^##\s+/.test(line)) return <h4 key={key}>{line.replace(/^##\s+/, '')}</h4>;
    if (!line.trim()) return <br key={key} />;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return <p key={key}>{parts.map((part, partIndex) => part.startsWith('**') && part.endsWith('**') ? <strong key={partIndex}>{part.slice(2, -2)}</strong> : part)}</p>;
  });
}

export function RagAssistantPage() {
  const [question, setQuestion] = useState('');
  const [conversations, setConversations] = useState([]);
  const [status, setStatus] = useState('Memeriksa knowledge base…');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    Promise.all([fetch(`${RAG_API}/health`), fetch(`${RAG_API}/stats`)]).then(async ([healthResponse, statsResponse]) => {
      if (!healthResponse.ok || !statsResponse.ok) throw new Error('Backend RAG tidak tersedia.');
      const health = await healthResponse.json();
      const stats = await statsResponse.json();
      setStatus(`${health.chunks || 0} bagian · ${stats.documents || 0} dokumen · ${stats.embeddingProvider || 'retrieval aktif'}`);
    }).catch(() => setStatus('Knowledge base tidak tersedia'));
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [conversations, loading]);

  async function ask(event, proposedQuestion = question) {
    event?.preventDefault();
    const value = proposedQuestion.trim();
    if (!value || loading) return;
    setQuestion(''); setError(''); setLoading(true);
    try {
      const response = await fetch(`${RAG_API}/chat`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: value, topK: 5 }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Pertanyaan gagal diproses.');
      setConversations(items => [...items, { question: value, answer: data.answer || 'Informasi tidak ditemukan.', sources: data.sources || [] }]);
    } catch (requestError) { setError(requestError.message); setQuestion(value); }
    finally { setLoading(false); }
  }

  function handleKeyDown(event) { if (event.key === 'Enter' && !event.shiftKey) ask(event); }

  return <section className="page-section rag-page">
    <div className="page-heading"><div><span className="eyebrow">KNOWLEDGE BASE SBP TA 2027</span><h1>Asisten RAG</h1><p className="muted">Ajukan pertanyaan tentang persyaratan, masa dinas, tahapan seleksi, dan penilaian untuk Pendidikan Sekolah Bintara Polisi (SBP) dari Tamtama ke Bintara TA 2027. Jawaban bersumber dari dokumen resmi yang terindeks dan dilengkapi sitasi.</p></div></div>
    <div className="rag-status"><span className="rag-status-dot" />{status}</div>
    {conversations.length === 0 && <div className="rag-welcome panel"><strong>F.A.Q — Pertanyaan yang Sering Diajukan</strong><span>Pilih topik berikut untuk memulai, atau tulis pertanyaan Anda sendiri sesuai kebutuhan.</span><div className="rag-suggestions">{suggestions.map(item => <button key={item} type="button" onClick={() => ask(null, item)}>{item}</button>)}</div></div>}
    {conversations.length > 0 && <><div className="rag-conversation-toolbar"><strong>Percakapan</strong><span>{conversations.length} pertanyaan</span><button className="rag-clear" type="button" onClick={() => { setConversations([]); setError(''); }}>Bersihkan</button></div><div className="rag-conversation" aria-live="polite">{conversations.map((item, index) => <div className="rag-turn" key={`${item.question}-${index}`}><div className="rag-question"><span>Anda</span><p>{item.question}</p></div><section className="panel rag-answer"><div className="panel-head"><h2>Jawaban</h2><span className="rag-badge">Berbasis sumber</span></div><div className="rag-answer-body">{renderAnswer(item.answer)}</div>{item.sources.length > 0 && <div className="rag-sources"><strong>Sumber</strong>{item.sources.map(source => <span className="source" key={`${source.source}-${source.chunk}`}>{source.source} · bagian {source.chunk}{source.page ? ` · halaman ${source.page}` : ''}</span>)}</div>}</section></div>)}<div ref={endRef} /></div></>}
    {loading && <div className="rag-thinking" role="status"><span className="rag-spinner" />Sedang mencari sumber yang relevan…</div>}
    {error && <div className="panel rag-error" role="alert">{error}</div>}
    <form className="panel rag-form" onSubmit={ask}><label htmlFor="rag-question">Pertanyaan</label><textarea id="rag-question" value={question} onChange={event => setQuestion(event.target.value)} onKeyDown={handleKeyDown} placeholder="Contoh: Apa persyaratan administrasi SBP?" rows="3" disabled={loading} /><div className="rag-actions"><small className="muted">Enter untuk mengirim · Shift+Enter untuk baris baru</small><button className="primary" type="submit" disabled={loading || !question.trim()}>{loading ? 'Mencari…' : 'Tanyakan'}</button></div></form>
  </section>;
}
