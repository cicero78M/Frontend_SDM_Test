import { useEffect, useState } from 'react';

const unitLabels = { BIRO: 'Biro', BAGIAN: 'Bagian', SUBBAGIAN: 'Subbagian', SUBDIREKTORAT: 'Subdirektorat', DIREKTORAT: 'Direktorat', SEKSI: 'Seksi', SUBSEKSI: 'Subseksi', URUSAN: 'Urusan', BIDANG: 'Bidang', KORPS: 'Korps', PUSAT: 'Pusat', DEPO: 'Depo', SEKRETARIAT: 'Sekretariat', INSPEKTORAT: 'Inspektorat', DETASEMEN: 'Detasemen', PASUKAN: 'Pasukan', SATUAN: 'Satuan', UNIT: 'Unit', PEMBANTU: 'Unsur Pembantu Pimpinan', PENGAWAS: 'Unsur Pengawas', PELAYANAN: 'Unsur Pelayanan', PENDUKUNG: 'Unsur Pendukung', PELAKSANA: 'Unsur Pelaksana' };

export function DependentUnitPicker({ items, value, onChange }) {
  const childrenOf = parentId => items.filter(item => String(item.id_unit_induk || '') === String(parentId || '')).sort((a, b) => String(a.nama_unit).localeCompare(String(b.nama_unit)));
  const findPath = () => { const path = []; let current = items.find(item => String(item.id_unit) === String(value)); while (current) { path.unshift(String(current.id_unit)); current = items.find(item => String(item.id_unit) === String(current.id_unit_induk)); } return path; };
  const [path, setPath] = useState(findPath);
  useEffect(() => setPath(findPath()), [items, value]);
  const levelName = choices => { const types = new Set(choices.map(item => String(item.tipe_unit || '').toUpperCase())); const type = [...types].find(name => unitLabels[name]); return unitLabels[type] || (choices.length ? 'Unsur Organisasi' : 'Unit'); };
  const levels = []; let parentId = ''; let depth = 0;
  while (depth === 0 || path[depth - 1]) { const choices = childrenOf(parentId); if (!choices.length) break; levels.push({ depth, choices }); const selected = path[depth]; if (!selected || !childrenOf(selected).length) break; parentId = selected; depth += 1; }
  function selectLevel(levelDepth, next) { const nextPath = path.slice(0, levelDepth); if (next) nextPath.push(next); setPath(nextPath); onChange(next && !childrenOf(next).length ? next : ''); }

  return <div className="unit-hierarchy full"><div className="unit-hierarchy-head"><div><strong>Unit Kerja</strong><span>Pilih sesuai struktur organisasi sampai unit terkecil.</span></div><em>{levels.length} level aktif</em></div>{levels.map(level => { const name = levelName(level.choices); return <label key={level.depth}><span className="unit-level-label"><b>{level.depth + 1}</b>{name}</span><select required={level.depth === 0 || Boolean(path[level.depth - 1])} value={path[level.depth] || ''} onChange={event => selectLevel(level.depth, event.target.value)}><option value="">Pilih {name.toLowerCase()}</option>{level.choices.map(item => <option key={item.id_unit} value={item.id_unit}>{item.nama_unit}</option>)}</select></label>; })}</div>;
}
