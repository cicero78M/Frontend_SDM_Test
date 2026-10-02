import { useEffect, useState } from 'react';

export function DependentSatkerPicker({ items, value, onChange, simple = false, flat = false }) {
  const mabes = items.find(item => !item.id_satker_induk && String(item.nama_satker).toUpperCase() === 'MABES POLRI') || items.find(item => !item.id_satker_induk);
  const [tingkat, setTingkat] = useState('');
  const [path, setPath] = useState([]);
  const childrenOf = parentId => items.filter(item => String(item.id_satker_induk) === String(parentId)).sort((a, b) => String(a.nama_satker).localeCompare(String(b.nama_satker)));

  useEffect(() => {
    if (!items.length) return;
    if (!value) { setPath([]); if (!tingkat) setTingkat('MABES'); return; }
    const chain = [];
    let target = items.find(item => String(item.id_satker) === String(value));
    while (target) { chain.unshift(String(target.id_satker)); target = items.find(item => String(item.id_satker) === String(target.id_satker_induk)); }
    const selected = items.find(item => String(item.id_satker) === String(value));
    const parent = items.find(item => String(item.id_satker) === String(selected?.id_satker_induk));
    // `simple` hanya mengubah presentasi picker. Path tetap harus memuat
    // seluruh tree agar Satker child Polda tidak terpotong menjadi Polda saja.
    const selectedLevel = selected?.tipe_satker === 'POLDA' || parent?.tipe_satker === 'POLDA' ? 'POLDA' : 'MABES';
    const rootIndex = selectedLevel === 'POLDA'
      ? chain.findIndex(id => items.find(item => String(item.id_satker) === id)?.tipe_satker === 'POLDA')
      : (mabes ? chain.findIndex(id => String(id) === String(mabes.id_satker)) + 1 : 0);
    setPath(chain.slice(Math.max(rootIndex, 0)));
    setTingkat(selectedLevel);
  }, [items, value]);

  const indukChoices = tingkat === 'MABES' ? (mabes ? childrenOf(mabes.id_satker).filter(item => item.tipe_satker !== 'POLDA') : []) : tingkat === 'POLDA' ? items.filter(item => item.tipe_satker === 'POLDA').sort((a, b) => String(a.nama_satker).localeCompare(String(b.nama_satker))) : [];
  function selectTingkat(event) { setTingkat(event.target.value); setPath([]); onChange(''); }
  function selectLevel(depth, next) { const nextPath = path.slice(0, depth); if (next) nextPath.push(next); setPath(nextPath); onChange(next && !childrenOf(next).length ? next : ''); }
  const levels = [{ label: 'Satker Induk', choices: indukChoices, value: path[0] || '' }];
  let parent = path[0]; let depth = 1;
  while (parent) { const choices = childrenOf(parent); if (!choices.length) break; levels.push({ label: depth === 1 ? 'Satker' : depth === 2 ? 'Sub-Satker' : `Sub-Satker Tingkat ${depth}`, choices, value: path[depth] || '' }); parent = path[depth]; depth += 1; }

  return <div className={`satker-picker full${simple ? ' satker-picker-simple' : ''}${flat ? ' picker-flat' : ''}`}>{!simple && <div className="satker-picker-title"><strong>Pilihan Satker</strong><span>Kolom berikutnya muncul hanya jika parent memiliki child.</span></div>}<label>Tingkat<select value={tingkat} onChange={selectTingkat} required><option value="">Pilih Tingkat</option><option value="MABES">MABES POLRI</option><option value="POLDA">POLDA</option></select></label>{levels.map((level, index) => <label key={level.label}>{level.label}<select value={level.value} onChange={event => selectLevel(index, event.target.value)} required disabled={!tingkat || (index > 0 && !path[index - 1])}><option value="">Pilih {level.label.toLowerCase()}</option>{level.choices.map(item => <option key={item.id_satker} value={item.id_satker}>{item.nama_satker}</option>)}</select></label>)}{!simple && <small className="satker-picker-note">Pilihan berhenti pada Satker terakhir yang tidak memiliki child.</small>}</div>;
}
