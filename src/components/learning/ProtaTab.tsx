import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Printer, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { SubjectItem, SubjectCPData, TujuanPembelajaran, ProtaRow } from '../../types/learning';

interface ProtaTabProps {
  subjects: SubjectItem[];
  selectedClassLevel: string;
  cpDataMap: Record<string, SubjectCPData>;
  onOpenCpModal: () => void;
  onNavigateToPromes: (subjectId: string, semester: 1 | 2) => void;
  selectedYear?: number;
  schoolName: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
}

export default function ProtaTab({
  subjects,
  selectedClassLevel,
  cpDataMap,
  onOpenCpModal,
  onNavigateToPromes,
  selectedYear = 2026,
  schoolName,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate
}: ProtaTabProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-4');

  // Local storage for custom Prota items override
  const [protaStore, setProtaStore] = useState<Record<string, ProtaRow[]>>(() => {
    const saved = localStorage.getItem('school_learning_prota_store');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  React.useEffect(() => {
    localStorage.setItem('school_learning_prota_store', JSON.stringify(protaStore));
  }, [protaStore]);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const activeCpData = cpDataMap[selectedSubjectId];

  // Derive Prota rows from CP-TP or custom protaStore
  const protaRows: ProtaRow[] = useMemo(() => {
    if (protaStore[selectedSubjectId]?.length) {
      return protaStore[selectedSubjectId];
    }
    // Fallback generate from TP list
    if (activeCpData?.tujuanPembelajaranList?.length) {
      return activeCpData.tujuanPembelajaranList.map((tp, idx) => ({
        id: tp.id || `prota-${idx}`,
        semester: tp.semester,
        noUrut: `${idx + 1}`,
        babUnit: tp.babUnit,
        materiPokok: tp.babUnit,
        tujuanPembelajaran: tp.text,
        alokasiJp: tp.alokasiJp,
        keterangan: tp.keterangan || (tp.code.includes('STS') || tp.code.includes('SAS') ? 'Asesmen' : 'Materi Pokok'),
        tpId: tp.id
      }));
    }
    return [];
  }, [selectedSubjectId, protaStore, activeCpData]);

  // Row editing states
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editSem, setEditSem] = useState<1 | 2>(1);
  const [editNo, setEditNo] = useState('');
  const [editBab, setEditBab] = useState('');
  const [editTpText, setEditTpText] = useState('');
  const [editJp, setEditJp] = useState<number>(10);
  const [editKet, setEditKet] = useState('');

  // Add new row states
  const [isAddingRow, setIsAddingRow] = useState<boolean>(false);
  const [newSem, setNewSem] = useState<1 | 2>(1);
  const [newBab, setNewBab] = useState('');
  const [newTpText, setNewTpText] = useState('');
  const [newJp, setNewJp] = useState<number>(10);
  const [newKet, setNewKet] = useState('Materi Pokok');

  // Academic Calendar standard: ~18 weeks Sem 1, ~17 weeks Sem 2
  const targetJpSem1 = (activeSubject?.jpPerWeek || 4) * 18;
  const targetJpSem2 = (activeSubject?.jpPerWeek || 4) * 17;
  const targetJpYear = targetJpSem1 + targetJpSem2;

  const currentJpSem1 = protaRows.filter(r => r.semester === 1).reduce((acc, r) => acc + (r.alokasiJp || 0), 0);
  const currentJpSem2 = protaRows.filter(r => r.semester === 2).reduce((acc, r) => acc + (r.alokasiJp || 0), 0);
  const currentJpYear = currentJpSem1 + currentJpSem2;

  const handleStartEdit = (row: ProtaRow) => {
    setEditingRowId(row.id);
    setEditSem(row.semester);
    setEditNo(row.noUrut);
    setEditBab(row.babUnit);
    setEditTpText(row.tujuanPembelajaran);
    setEditJp(row.alokasiJp);
    setEditKet(row.keterangan || '');
  };

  const handleSaveEdit = (id: string) => {
    const updated = protaRows.map(r => r.id === id ? {
      ...r,
      semester: editSem,
      noUrut: editNo.trim() || r.noUrut,
      babUnit: editBab.trim() || r.babUnit,
      tujuanPembelajaran: editTpText.trim() || r.tujuanPembelajaran,
      alokasiJp: Math.max(1, Number(editJp) || 1),
      keterangan: editKet.trim() || 'Materi Pokok'
    } : r);

    setProtaStore(prev => ({ ...prev, [selectedSubjectId]: updated }));
    setEditingRowId(null);
  };

  const handleDeleteRow = (id: string) => {
    const updated = protaRows.filter(r => r.id !== id);
    setProtaStore(prev => ({ ...prev, [selectedSubjectId]: updated }));
  };

  const handleSaveNewRow = () => {
    if (!newTpText.trim()) {
      alert('Tujuan pembelajaran / materi tidak boleh kosong!');
      return;
    }
    const newRow: ProtaRow = {
      id: 'prota-' + Date.now(),
      semester: newSem,
      noUrut: `${protaRows.length + 1}`,
      babUnit: newBab.trim() || `Bab ${protaRows.length + 1}`,
      materiPokok: newBab.trim() || `Bab ${protaRows.length + 1}`,
      tujuanPembelajaran: newTpText.trim(),
      alokasiJp: Math.max(1, Number(newJp) || 1),
      keterangan: newKet.trim() || 'Materi Pokok'
    };

    const updated = [...protaRows, newRow];
    setProtaStore(prev => ({ ...prev, [selectedSubjectId]: updated }));
    setIsAddingRow(false);
    setNewTpText('');
    setNewBab('');
  };

  const handleSyncFromCpTp = () => {
    if (!activeCpData?.tujuanPembelajaranList?.length) {
      alert('Belum ada data TP pada bank CP untuk mata pelajaran ini. Silakan klik tombol "Input / Edit CP & TP" terlebih dahulu.');
      return;
    }
    const generated: ProtaRow[] = activeCpData.tujuanPembelajaranList.map((tp, idx) => ({
      id: tp.id || `prota-${idx}`,
      semester: tp.semester,
      noUrut: `${idx + 1}`,
      babUnit: tp.babUnit,
      materiPokok: tp.babUnit,
      tujuanPembelajaran: tp.text,
      alokasiJp: tp.alokasiJp,
      keterangan: tp.keterangan || (tp.code.includes('STS') || tp.code.includes('SAS') ? 'Asesmen' : 'Materi Pokok'),
      tpId: tp.id
    }));

    setProtaStore(prev => ({ ...prev, [selectedSubjectId]: generated }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* SMART STEP 3 AUTOMATION GUIDE BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-md space-y-2.5 screen-only">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40 shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-slate-950 uppercase tracking-wider">
                  Langkah 3 Otomatis
                </span>
                <h3 className="text-sm font-black text-white">
                  Penurunan Capaian Pembelajaran (CP) ke Program Tahunan (Prota)
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Bapak/Ibu cukup masukkan/tempel naskah CP mata pelajaran <strong className="text-emerald-300">{activeSubject?.name}</strong>. Sistem AI akan otomatis memecahnya menjadi <strong>Bab Materi Pokok, butir TP (KKO + Konten), pembagian Semester 1 & 2, serta Alokasi JP</strong> secara pas!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCpModal}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Sparkles size={15} />
              <span>✨ Masukkan CP & Otomatiskan Prota/TP</span>
            </button>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
        
        {/* Subject Select */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-700">Mapel:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code}) - {s.jpPerWeek} JP/mgg
              </option>
            ))}
          </select>

          <button
            onClick={onOpenCpModal}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Kelola CP & TP Fleksibel</span>
          </button>

          <button
            onClick={handleSyncFromCpTp}
            className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Muat ulang susunan materi dari Capaian Pembelajaran"
          >
            <RotateCcw size={13} />
            <span>Reset / Muat dari CP</span>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingRow(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Tambah Baris Prota</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Prota</span>
          </button>
        </div>
      </div>

      {/* VALIDATION & SUMMARY BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 screen-only">
        {/* Sem 1 Card */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Semester Ganjil (S1)</span>
            <div className="text-sm font-black text-slate-900">
              {currentJpSem1} / {targetJpSem1} JP
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            currentJpSem1 === targetJpSem1 
              ? 'bg-emerald-100 text-emerald-800' 
              : currentJpSem1 < targetJpSem1 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-rose-100 text-rose-800'
          }`}>
            {currentJpSem1 === targetJpSem1 ? '✓ Pas Alokasi' : currentJpSem1 < targetJpSem1 ? `Kurang ${targetJpSem1 - currentJpSem1} JP` : `Lebih +${currentJpSem1 - targetJpSem1} JP`}
          </span>
        </div>

        {/* Sem 2 Card */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Semester Genap (S2)</span>
            <div className="text-sm font-black text-slate-900">
              {currentJpSem2} / {targetJpSem2} JP
            </div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            currentJpSem2 === targetJpSem2 
              ? 'bg-emerald-100 text-emerald-800' 
              : currentJpSem2 < targetJpSem2 
              ? 'bg-amber-100 text-amber-800' 
              : 'bg-rose-100 text-rose-800'
          }`}>
            {currentJpSem2 === targetJpSem2 ? '✓ Pas Alokasi' : currentJpSem2 < targetJpSem2 ? `Kurang ${targetJpSem2 - currentJpSem2} JP` : `Lebih +${currentJpSem2 - targetJpSem2} JP`}
          </span>
        </div>

        {/* Total Year Card */}
        <div className="bg-slate-900 text-white p-3.5 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total 1 Tahun Ajaran</span>
            <div className="text-sm font-black text-emerald-400">
              {currentJpYear} / {targetJpYear} JP
            </div>
          </div>
          <button
            onClick={() => onNavigateToPromes(selectedSubjectId, 1)}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Buka Promes</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* FORM TAMBAH BARIS PROTA (POPOVER / INLINE) */}
      {isAddingRow && (
        <div className="bg-emerald-50/80 p-4 rounded-2xl border-2 border-emerald-400 space-y-3 screen-only animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase text-emerald-950 flex items-center gap-2">
              <Plus size={16} />
              <span>Tambah Baris Tujuan Pembelajaran / Asesmen pada Prota</span>
            </h4>
            <button 
              onClick={() => setIsAddingRow(false)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Semester:</label>
              <select
                value={newSem}
                onChange={(e) => setNewSem(Number(e.target.value) as 1 | 2)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
              >
                <option value={1}>Semester 1 (Ganjil)</option>
                <option value={2}>Semester 2 (Genap)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Bab / Lingkup Materi:</label>
              <input
                type="text"
                placeholder="Contoh: Bab 1: Mengenal Bilangan"
                value={newBab}
                onChange={(e) => setNewBab(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Tujuan Pembelajaran (TP):</label>
              <input
                type="text"
                placeholder="Tuliskan rumusan TP (KKO + Konten)..."
                value={newTpText}
                onChange={(e) => setNewTpText(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="sm:col-span-1">
              <label className="text-[10px] font-bold text-slate-600 block mb-1">JP:</label>
              <input
                type="number"
                min={1}
                max={100}
                value={newJp}
                onChange={(e) => setNewJp(Number(e.target.value))}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-center"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-600 block mb-1">Keterangan:</label>
              <select
                value={newKet}
                onChange={(e) => setNewKet(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs"
              >
                <option value="Materi Pokok">Materi Pokok</option>
                <option value="Asesmen STS">Asesmen STS</option>
                <option value="Asesmen SAS">Asesmen SAS</option>
                <option value="Cadangan / Remedial">Cadangan / Remedial</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => setIsAddingRow(false)}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSaveNewRow}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Check size={14} />
              <span>Simpan ke Prota</span>
            </button>
          </div>
        </div>
      )}

      {/* PRINTABLE PROTA MATRIX */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* KOP / DOCUMENT HEADER */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-200">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-slate-900">
            PROGRAM TAHUNAN (PROTA)
          </h2>
          <h3 className="text-sm font-extrabold uppercase text-emerald-800">
            MATA PELAJARAN: {activeSubject?.name.toUpperCase()} • TAHUN AJARAN {selectedYear}/{selectedYear + 1}
          </h3>
          <p className="text-xs font-bold text-slate-600">
            {schoolName || 'SD NEGERI 1 CIPEUNDEUY'} • {selectedClassLevel.toUpperCase()}
          </p>
        </div>

        {/* IDENTITAS MAPEL & CP SUMMARY */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div>
              <span className="text-slate-500 font-medium">Mata Pelajaran:</span>
              <div className="font-bold text-slate-900">{activeSubject?.name} ({activeSubject?.code})</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Satuan Pendidikan:</span>
              <div className="font-bold text-slate-900">{schoolName}</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Fase / Kelas:</span>
              <div className="font-bold text-slate-900">{activeCpData?.fase || 'Fase A'} / {selectedClassLevel}</div>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Alokasi Waktu:</span>
              <div className="font-bold text-emerald-700">{activeSubject?.jpPerWeek} Jam Pelajaran / Minggu</div>
            </div>
          </div>

          {activeCpData?.capaianPembelajaran && (
            <div className="pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-800">Capaian Pembelajaran (CP):</span>
              <p className="text-slate-700 italic mt-0.5 leading-relaxed bg-white p-2 rounded-lg border border-slate-200">
                "{activeCpData.capaianPembelajaran}"
              </p>
            </div>
          )}
        </div>

        {/* PROTA TABLE */}
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th className="p-2.5 w-16 text-center border border-slate-800">SMT</th>
                <th className="p-2.5 w-12 text-center border border-slate-800">No</th>
                <th className="p-2.5 w-44 border border-slate-800">Bab / Lingkup Materi</th>
                <th className="p-2.5 border border-slate-800">Tujuan Pembelajaran (TP)</th>
                <th className="p-2.5 w-24 text-center border border-slate-800">Alokasi Waktu</th>
                <th className="p-2.5 w-28 text-center border border-slate-800">Keterangan</th>
                <th className="p-2.5 w-20 text-center border border-slate-800 screen-only">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {protaRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 space-y-2">
                    <Calendar size={28} className="mx-auto text-slate-300" />
                    <p className="font-bold text-slate-600">Belum ada baris Program Tahunan (Prota) untuk mapel ini.</p>
                    <p className="text-[11px]">
                      Klik tombol <strong>"Kelola CP & TP Fleksibel"</strong> atau <strong>"+ Tambah Baris Prota"</strong> di atas.
                    </p>
                  </td>
                </tr>
              ) : (
                protaRows.map((row, idx) => {
                  const isEditing = editingRowId === row.id;

                  if (isEditing) {
                    return (
                      <tr key={row.id} className="bg-emerald-50/80 border-2 border-emerald-400">
                        <td className="p-2 text-center border border-slate-300">
                          <select
                            value={editSem}
                            onChange={(e) => setEditSem(Number(e.target.value) as 1 | 2)}
                            className="p-1 bg-white border border-slate-300 rounded font-bold text-center"
                          >
                            <option value={1}>1 (Ganjil)</option>
                            <option value={2}>2 (Genap)</option>
                          </select>
                        </td>
                        <td className="p-2 text-center border border-slate-300">
                          <input
                            type="text"
                            value={editNo}
                            onChange={(e) => setEditNo(e.target.value)}
                            className="w-10 p-1 bg-white border border-slate-300 rounded font-bold text-center"
                          />
                        </td>
                        <td className="p-2 border border-slate-300">
                          <input
                            type="text"
                            value={editBab}
                            onChange={(e) => setEditBab(e.target.value)}
                            className="w-full p-1 bg-white border border-slate-300 rounded font-semibold"
                          />
                        </td>
                        <td className="p-2 border border-slate-300">
                          <textarea
                            value={editTpText}
                            onChange={(e) => setEditTpText(e.target.value)}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                            rows={2}
                          />
                        </td>
                        <td className="p-2 text-center border border-slate-300">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={editJp}
                              onChange={(e) => setEditJp(Number(e.target.value))}
                              className="w-12 p-1 bg-white border border-slate-300 rounded font-bold text-center"
                            />
                            <span className="text-[10px] font-bold text-slate-500">JP</span>
                          </div>
                        </td>
                        <td className="p-2 border border-slate-300">
                          <input
                            type="text"
                            value={editKet}
                            onChange={(e) => setEditKet(e.target.value)}
                            className="w-full p-1 bg-white border border-slate-300 rounded text-xs"
                          />
                        </td>
                        <td className="p-2 text-center border border-slate-300 screen-only">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSaveEdit(row.id)}
                              className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 cursor-pointer"
                              title="Simpan"
                            >
                              <Check size={13} />
                            </button>
                            <button
                              onClick={() => setEditingRowId(null)}
                              className="p-1 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 cursor-pointer"
                              title="Batal"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2.5 text-center font-bold text-slate-700 border border-slate-300">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          row.semester === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-teal-100 text-teal-900 border border-teal-300'
                        }`}>
                          {row.semester === 1 ? '1 (Ganjil)' : '2 (Genap)'}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-slate-600 border border-slate-300">
                        {row.noUrut || idx + 1}
                      </td>
                      <td className="p-2.5 font-bold text-slate-900 border border-slate-300">
                        {row.babUnit}
                      </td>
                      <td className="p-2.5 text-slate-800 leading-relaxed border border-slate-300">
                        {row.tujuanPembelajaran}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-800 border border-slate-300 bg-emerald-50/40">
                        {row.alokasiJp} JP
                      </td>
                      <td className="p-2.5 text-center text-slate-600 border border-slate-300">
                        <span className="text-[11px] font-semibold">{row.keterangan || 'Materi Pokok'}</span>
                      </td>
                      <td className="p-2.5 text-center border border-slate-300 screen-only">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStartEdit(row)}
                            className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="Edit baris"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="Hapus baris"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}

              {/* SUMMARY ROW SEMESTER 1 */}
              <tr className="bg-amber-50/70 font-extrabold text-amber-950 border-t-2 border-slate-300">
                <td colSpan={4} className="p-2 text-right uppercase tracking-wider border border-slate-300">
                  Jumlah Alokasi Waktu Semester 1 (Ganjil)
                </td>
                <td className="p-2 text-center font-mono font-black text-amber-900 border border-slate-300 bg-amber-100">
                  {currentJpSem1} JP
                </td>
                <td colSpan={2} className="p-2 text-xs italic text-amber-800 border border-slate-300">
                  Target Alokasi: {targetJpSem1} JP
                </td>
              </tr>

              {/* SUMMARY ROW SEMESTER 2 */}
              <tr className="bg-teal-50/70 font-extrabold text-teal-950">
                <td colSpan={4} className="p-2 text-right uppercase tracking-wider border border-slate-300">
                  Jumlah Alokasi Waktu Semester 2 (Genap)
                </td>
                <td className="p-2 text-center font-mono font-black text-teal-900 border border-slate-300 bg-teal-100">
                  {currentJpSem2} JP
                </td>
                <td colSpan={2} className="p-2 text-xs italic text-teal-800 border border-slate-300">
                  Target Alokasi: {targetJpSem2} JP
                </td>
              </tr>

              {/* TOTAL ROW 1 TAHUN */}
              <tr className="bg-slate-900 text-white font-extrabold">
                <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider border border-slate-800">
                  Total Alokasi Waktu 1 Tahun Ajaran
                </td>
                <td className="p-2.5 text-center font-mono font-black text-emerald-400 border border-slate-800 bg-slate-950">
                  {currentJpYear} JP
                </td>
                <td colSpan={2} className="p-2.5 text-xs text-slate-300 border border-slate-800">
                  Target Alokasi: {targetJpYear} JP
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SIGNATURE SECTION (FOR PRINTING) */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-start text-xs text-slate-800 font-semibold w-full px-4 text-center print:px-0">
          <div className="text-center min-w-[220px]">
            <div>Mengetahui,</div>
            <div>Kepala {schoolName || 'SD Negeri 1 Cipeundeuy'}</div>
            <div className="h-16"></div>
            <div className="font-bold underline uppercase">{principalName || 'CEPI SOPYAN, S.Pd.'}</div>
            <div>NIP. {principalNip || '19850101 201001 1 001'}</div>
          </div>

          <div className="text-center min-w-[220px]">
            <div>{signaturePlace || 'Cibungur'}, {signatureDate || '17 Juli 2026'}</div>
            <div>Guru Kelas / Guru Mapel</div>
            <div className="h-16"></div>
            <div className="font-bold underline uppercase">{teacherName || 'CEPI SOPYAN, S.Pd.'}</div>
            <div>NIP. {teacherNip || '-'}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
