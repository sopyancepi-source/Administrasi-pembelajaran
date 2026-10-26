import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  HelpCircle,
  FileText,
  Wand2,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sliders
} from 'lucide-react';
import { SubjectItem, SubjectCPData, TujuanPembelajaran } from '../../types/learning';
import { INITIAL_CP_TP_MAP } from '../../data/learningDefaults';

interface CPTPManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectItem[];
  selectedClassLevel: string;
  cpDataMap: Record<string, SubjectCPData>;
  onSaveCpData: (subjectId: string, data: SubjectCPData) => void;
}

export default function CPTPManagerModal({
  isOpen,
  onClose,
  subjects,
  selectedClassLevel,
  cpDataMap,
  onSaveCpData
}: CPTPManagerModalProps) {
  const [activeSubjectId, setActiveSubjectId] = useState<string>(subjects[0]?.id || 'sub-1');
  const [fase, setFase] = useState<string>('Fase A');
  const [elemen, setElemen] = useState<string>('');
  const [cpText, setCpText] = useState<string>('');
  const [tpList, setTpList] = useState<TujuanPembelajaran[]>([]);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generateMsg, setGenerateMsg] = useState<string | null>(null);

  // Editing single TP state
  const [editingTpId, setEditingTpId] = useState<string | null>(null);
  const [editTpCode, setEditTpCode] = useState('');
  const [editTpBab, setEditTpBab] = useState('');
  const [editTpText, setEditTpText] = useState('');
  const [editTpSemester, setEditTpSemester] = useState<1 | 2>(1);
  const [editTpJp, setEditTpJp] = useState<number>(12);
  const [editTpKeterangan, setEditTpKeterangan] = useState('');

  // New TP input row
  const [newTpBab, setNewTpBab] = useState('');
  const [newTpText, setNewTpText] = useState('');
  const [newTpSemester, setNewTpSemester] = useState<1 | 2>(1);
  const [newTpJp, setNewTpJp] = useState<number>(12);

  // Load active subject CP data when activeSubjectId changes
  React.useEffect(() => {
    const existing = cpDataMap[activeSubjectId];
    const activeSub = subjects.find(s => s.id === activeSubjectId);
    
    // Auto determine default fase by class level
    const defaultFase = selectedClassLevel.includes('1') || selectedClassLevel.includes('2') 
      ? 'Fase A' 
      : selectedClassLevel.includes('3') || selectedClassLevel.includes('4') 
      ? 'Fase B' 
      : 'Fase C';

    if (existing && (existing.capaianPembelajaran || existing.tujuanPembelajaranList?.length)) {
      setFase(existing.fase || defaultFase);
      setElemen(existing.elemen || '');
      setCpText(existing.capaianPembelajaran || '');
      setTpList(existing.tujuanPembelajaranList || []);
    } else {
      // Check if we have standard template in INITIAL_CP_TP_MAP
      const defaultTemplate = INITIAL_CP_TP_MAP[activeSubjectId];
      if (defaultTemplate) {
        setFase(defaultTemplate.fase || defaultFase);
        setElemen(defaultTemplate.elemen || '');
        setCpText(defaultTemplate.capaianPembelajaran || '');
        setTpList(defaultTemplate.tujuanPembelajaranList || []);
      } else {
        setFase(defaultFase);
        setElemen('');
        setCpText('');
        setTpList([]);
      }
    }
  }, [activeSubjectId, cpDataMap, selectedClassLevel, subjects]);

  if (!isOpen) return null;

  const activeSub = subjects.find(s => s.id === activeSubjectId) || subjects[0];

  const handleSaveAll = () => {
    if (!activeSub) return;
    const updatedData: SubjectCPData = {
      subjectId: activeSub.id,
      subjectName: activeSub.name,
      classLevel: selectedClassLevel,
      fase: fase,
      elemen: elemen,
      capaianPembelajaran: cpText,
      tujuanPembelajaranList: tpList
    };
    onSaveCpData(activeSub.id, updatedData);
  };

  // Automated CP to TP Generator (Server AI + Heuristic Fallback)
  const handleAutoGenerateFromCP = async () => {
    if (!cpText.trim()) {
      alert('Silakan masukkan atau tempel (paste) naskah Capaian Pembelajaran (CP) terlebih dahulu, atau klik tombol "Gunakan Draf CP Resmi" di atas.');
      return;
    }

    setIsGenerating(true);
    setGenerateMsg('Sedang menganalisis CP & memecah menjadi Bab, TP, Semester 1 & 2...');

    try {
      // 1. Call server-side Gemini API
      const response = await fetch('/api/generate-tp-from-cp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: activeSub.name,
          fase: fase,
          classLevel: selectedClassLevel,
          cpText: cpText,
          jpPerWeek: activeSub.jpPerWeek || 4
        })
      });

      if (response.ok) {
        const json = await response.json();
        const resultData = json.data;

        let generatedItems: any[] = [];
        if (Array.isArray(resultData)) {
          generatedItems = resultData;
        } else if (resultData && Array.isArray(resultData.tujuanPembelajaranList)) {
          generatedItems = resultData.tujuanPembelajaranList;
        } else if (resultData && Array.isArray(resultData.tujuanPembelajaran)) {
          generatedItems = resultData.tujuanPembelajaran;
        } else if (resultData && Array.isArray(resultData.tpList)) {
          generatedItems = resultData.tpList;
        }

        if (generatedItems.length > 0) {
          const formatted: TujuanPembelajaran[] = generatedItems.map((item: any, idx: number) => {
            const sem = Number(item.semester) === 2 ? 2 : 1;
            return {
              id: 'tp-ai-' + Date.now() + '-' + idx,
              code: item.code || (sem === 1 ? `TP 1.${idx + 1}` : `TP 2.${idx + 1}`),
              babUnit: item.babUnit || item.bab || item.unit || `Bab ${idx + 1}`,
              text: item.text || item.tujuanPembelajaran || item.deskripsi || '',
              semester: sem,
              alokasiJp: Math.max(2, Number(item.alokasiJp || item.jp) || 12),
              keterangan: item.keterangan || 'Materi Pokok'
            };
          });

          // Ensure STS and SAS assessments are attached if not already present
          const hasSts1 = formatted.some(f => f.code.includes('STS-1') || f.babUnit.toLowerCase().includes('tengah semester 1'));
          const hasSas1 = formatted.some(f => f.code.includes('SAS-1') || f.babUnit.toLowerCase().includes('akhir semester 1'));
          const hasSts2 = formatted.some(f => f.code.includes('STS-2') || f.babUnit.toLowerCase().includes('tengah semester 2'));
          const hasSas2 = formatted.some(f => f.code.includes('SAS-2') || f.babUnit.toLowerCase().includes('akhir semester 2'));

          const assessmentJp = Math.max(2, Math.round((activeSub.jpPerWeek || 4) * 0.8));

          const finalTpList = [...formatted];
          if (!hasSts1) {
            finalTpList.push({
              id: 'tp-sts1-' + Date.now(),
              code: 'STS-1',
              babUnit: 'Sumatif Tengah Semester 1',
              text: 'Evaluasi penguasaan materi tengah semester ganjil (STS 1).',
              semester: 1,
              alokasiJp: assessmentJp,
              keterangan: 'Asesmen'
            });
          }
          if (!hasSas1) {
            finalTpList.push({
              id: 'tp-sas1-' + Date.now(),
              code: 'SAS-1',
              babUnit: 'Sumatif Akhir Semester 1',
              text: 'Evaluasi ketercapaian seluruh tujuan pembelajaran semester ganjil (SAS 1).',
              semester: 1,
              alokasiJp: assessmentJp,
              keterangan: 'Asesmen'
            });
          }
          if (!hasSts2) {
            finalTpList.push({
              id: 'tp-sts2-' + Date.now(),
              code: 'STS-2',
              babUnit: 'Sumatif Tengah Semester 2',
              text: 'Evaluasi penguasaan materi tengah semester genap (STS 2).',
              semester: 2,
              alokasiJp: assessmentJp,
              keterangan: 'Asesmen'
            });
          }
          if (!hasSas2) {
            finalTpList.push({
              id: 'tp-sas2-' + Date.now(),
              code: 'SAS-2',
              babUnit: 'Sumatif Akhir Semester 2 (Kenaikan Kelas)',
              text: 'Evaluasi ketercapaian seluruh tujuan pembelajaran semester genap (SAS 2 / SAT).',
              semester: 2,
              alokasiJp: assessmentJp,
              keterangan: 'Asesmen'
            });
          }

          setTpList(finalTpList);
          onSaveCpData(activeSub.id, {
            subjectId: activeSub.id,
            subjectName: activeSub.name,
            classLevel: selectedClassLevel,
            fase: fase,
            elemen: elemen,
            capaianPembelajaran: cpText,
            tujuanPembelajaranList: finalTpList
          });

          setGenerateMsg(`🎉 Sukses! Berhasil memecah CP menjadi ${finalTpList.length} butir TP & Asesmen untuk ${activeSub.name}.`);
          setTimeout(() => setGenerateMsg(null), 4000);
          setIsGenerating(false);
          return;
        }
      }
    } catch (apiErr) {
      console.warn("AI generation network error, falling back to smart pedagogical heuristic parser:", apiErr);
    }

    // 2. High Quality Pedagogical Heuristic Fallback Parser
    try {
      const sentences = cpText
        .split(/[.;\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 8);

      const clauses: string[] = [];
      sentences.forEach(s => {
        const subParts = s.split(/,\s*(?:dan|serta|serta mampu|dan mampu)\s*|,\s+/i);
        subParts.forEach(p => {
          const clean = p.trim().replace(/^peserta didik mampu\s*/i, '').replace(/^peserta didik\s*/i, '');
          if (clean.length > 5) {
            clauses.push(clean);
          }
        });
      });

      const effectiveClauses = clauses.length >= 4 ? clauses : [
        `Memahami dan menguasai konsep dasar ${activeSub.name}`,
        `Mengidentifikasi dan menerapkan keterampilan ${activeSub.name} dalam kehidupan sehari-hari`,
        `Menganalisis masalah dan mengeksplorasi ide solutif pada materi ${activeSub.name}`,
        `Mendemonstrasikan dan mempraktikkan hasil pemahaman secara mandiri dan kolaboratif`,
        `Mengevaluasi hasil karya dan merefleksikan nilai-nilai Profil Pelajar Pancasila`
      ];

      const half = Math.ceil(effectiveClauses.length / 2);
      const sem1Clauses = effectiveClauses.slice(0, half);
      const sem2Clauses = effectiveClauses.slice(half);

      const jpPerWeek = activeSub.jpPerWeek || 4;
      const avgJp = Math.max(6, Math.round((jpPerWeek * 16) / (effectiveClauses.length / 2 || 1)));

      const fallbackList: TujuanPembelajaran[] = [];

      sem1Clauses.forEach((c, idx) => {
        fallbackList.push({
          id: 'tp-auto-1-' + idx + '-' + Date.now(),
          code: `TP 1.${idx + 1}`,
          babUnit: `Bab ${idx + 1}: ${c.slice(0, 30)}${c.length > 30 ? '...' : ''}`,
          text: `Peserta didik mampu ${c.charAt(0).toLowerCase() + c.slice(1)}.`,
          semester: 1,
          alokasiJp: avgJp,
          keterangan: 'Materi Pokok'
        });
      });

      fallbackList.push({
        id: 'tp-sts1-' + Date.now(),
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Evaluasi penguasaan materi tengah semester ganjil (STS 1).',
        semester: 1,
        alokasiJp: Math.max(2, jpPerWeek),
        keterangan: 'Asesmen'
      });
      fallbackList.push({
        id: 'tp-sas1-' + Date.now(),
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Evaluasi ketercapaian seluruh tujuan pembelajaran semester ganjil (SAS 1).',
        semester: 1,
        alokasiJp: Math.max(2, jpPerWeek),
        keterangan: 'Asesmen'
      });

      sem2Clauses.forEach((c, idx) => {
        fallbackList.push({
          id: 'tp-auto-2-' + idx + '-' + Date.now(),
          code: `TP 2.${idx + 1}`,
          babUnit: `Bab ${sem1Clauses.length + idx + 1}: ${c.slice(0, 30)}${c.length > 30 ? '...' : ''}`,
          text: `Peserta didik mampu ${c.charAt(0).toLowerCase() + c.slice(1)}.`,
          semester: 2,
          alokasiJp: avgJp,
          keterangan: 'Materi Pokok'
        });
      });

      fallbackList.push({
        id: 'tp-sts2-' + Date.now(),
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Evaluasi penguasaan materi tengah semester genap (STS 2).',
        semester: 2,
        alokasiJp: Math.max(2, jpPerWeek),
        keterangan: 'Asesmen'
      });
      fallbackList.push({
        id: 'tp-sas2-' + Date.now(),
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2 (Kenaikan Kelas)',
        text: 'Evaluasi ketercapaian seluruh tujuan pembelajaran semester genap (SAS 2 / SAT).',
        semester: 2,
        alokasiJp: Math.max(2, jpPerWeek),
        keterangan: 'Asesmen'
      });

      setTpList(fallbackList);
      onSaveCpData(activeSub.id, {
        subjectId: activeSub.id,
        subjectName: activeSub.name,
        classLevel: selectedClassLevel,
        fase: fase,
        elemen: elemen,
        capaianPembelajaran: cpText,
        tujuanPembelajaranList: fallbackList
      });

      setGenerateMsg(`🎉 Sukses! Berhasil memecah CP secara cerdas menjadi ${fallbackList.length} butir TP untuk ${activeSub.name}.`);
      setTimeout(() => setGenerateMsg(null), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  // Load official Kurikulum Merdeka template for current subject
  const handleLoadOfficialPreset = () => {
    const template = INITIAL_CP_TP_MAP[activeSubjectId];
    if (template) {
      setFase(template.fase || fase);
      setElemen(template.elemen || '');
      setCpText(template.capaianPembelajaran || '');
      setTpList(template.tujuanPembelajaranList || []);

      onSaveCpData(activeSub.id, {
        subjectId: activeSub.id,
        subjectName: activeSub.name,
        classLevel: selectedClassLevel,
        fase: template.fase || fase,
        elemen: template.elemen || '',
        capaianPembelajaran: template.capaianPembelajaran,
        tujuanPembelajaranList: template.tujuanPembelajaranList
      });

      setGenerateMsg(`✅ Template Resmi Kurikulum Merdeka untuk ${activeSub.name} berhasil dimuat lengkap!`);
      setTimeout(() => setGenerateMsg(null), 3000);
    } else {
      // Fallback CP if not specifically templated
      const defaultText = `Peserta didik mampu memahami konsep dasar, menganalisis materi kontekstual, dan mempraktikkan keterampilan ${activeSub.name} secara kreatif dan mandiri sesuai karakteristik ${selectedClassLevel}.`;
      setCpText(defaultText);
      setGenerateMsg(`✅ Teks draf CP untuk ${activeSub.name} telah dimasukkan. Klik "✨ Pecah CP Jadi TP Otomatis" untuk merinci Bab & TP.`);
      setTimeout(() => setGenerateMsg(null), 4000);
    }
  };

  const handleAddTp = () => {
    if (!newTpText.trim()) {
      alert('Teks Tujuan Pembelajaran (TP) tidak boleh kosong!');
      return;
    }

    const currentCount = tpList.filter(t => t.semester === newTpSemester).length;
    const newCode = `TP ${newTpSemester}.${currentCount + 1}`;

    const newTpItem: TujuanPembelajaran = {
      id: 'tp-' + Date.now(),
      code: newCode,
      babUnit: newTpBab.trim() || `Bab ${currentCount + 1}`,
      text: newTpText.trim(),
      semester: newTpSemester,
      alokasiJp: Number(newTpJp) || 12,
      keterangan: 'Materi Pokok'
    };

    const updated = [...tpList, newTpItem];
    setTpList(updated);
    setNewTpText('');
    setNewTpBab('');

    // Auto save immediately
    if (activeSub) {
      onSaveCpData(activeSub.id, {
        subjectId: activeSub.id,
        subjectName: activeSub.name,
        classLevel: selectedClassLevel,
        fase: fase,
        elemen: elemen,
        capaianPembelajaran: cpText,
        tujuanPembelajaranList: updated
      });
    }
  };

  const handleStartEditTp = (item: TujuanPembelajaran) => {
    setEditingTpId(item.id);
    setEditTpCode(item.code);
    setEditTpBab(item.babUnit);
    setEditTpText(item.text);
    setEditTpSemester(item.semester);
    setEditTpJp(item.alokasiJp);
    setEditTpKeterangan(item.keterangan || '');
  };

  const handleSaveEditTp = (id: string) => {
    const updated = tpList.map(item => item.id === id ? {
      ...item,
      code: editTpCode.trim() || item.code,
      babUnit: editTpBab.trim() || item.babUnit,
      text: editTpText.trim() || item.text,
      semester: editTpSemester,
      alokasiJp: Math.max(1, Number(editTpJp) || 1),
      keterangan: editTpKeterangan.trim() || 'Materi Pokok'
    } : item);

    setTpList(updated);
    setEditingTpId(null);

    if (activeSub) {
      onSaveCpData(activeSub.id, {
        subjectId: activeSub.id,
        subjectName: activeSub.name,
        classLevel: selectedClassLevel,
        fase: fase,
        elemen: elemen,
        capaianPembelajaran: cpText,
        tujuanPembelajaranList: updated
      });
    }
  };

  const handleDeleteTp = (id: string) => {
    const updated = tpList.filter(item => item.id !== id);
    setTpList(updated);
    if (activeSub) {
      onSaveCpData(activeSub.id, {
        subjectId: activeSub.id,
        subjectName: activeSub.name,
        classLevel: selectedClassLevel,
        fase: fase,
        elemen: elemen,
        capaianPembelajaran: cpText,
        tujuanPembelajaranList: updated
      });
    }
  };

  // Total JP stats
  const totalJpSem1 = tpList.filter(t => t.semester === 1).reduce((acc, t) => acc + (t.alokasiJp || 0), 0);
  const totalJpSem2 = tpList.filter(t => t.semester === 2).reduce((acc, t) => acc + (t.alokasiJp || 0), 0);
  const totalJpYear = totalJpSem1 + totalJpSem2;

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto screen-only">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black tracking-tight">Wadah Otomatisasi CP & TP (Langkah 3)</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <Wand2 size={10} />
                  <span>100% Otomatis dari CP</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Cukup ketik/paste teks CP di bawah, klik tombol otomatis, maka Bab, TP, Semester, dan Alokasi JP akan tersusun instan!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              handleSaveAll();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          
          {/* SUBJECT SELECTOR TABS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Pilih Mata Pelajaran:</span>
              <span className="text-[11px] text-slate-500 font-normal">Tingkat: <strong>{selectedClassLevel}</strong></span>
            </label>
            <div className="flex flex-wrap gap-1.5 bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs">
              {subjects.map(sub => {
                const isSelected = sub.id === activeSubjectId;
                const hasData = !!cpDataMap[sub.id]?.tujuanPembelajaranList?.length;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      handleSaveAll();
                      setActiveSubjectId(sub.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                    <span>{sub.name}</span>
                    {hasData && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" title="Data TP Lengkap" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PROMINENT SMART AUTOMATION CARD */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-500/30 shadow-md space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/40">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-black tracking-wide text-emerald-300 uppercase">
                    Pusat Otomatisasi Penurunan CP ke TP ({activeSub?.name})
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Bapak/Ibu cukup paste teks CP di bawah, lalu klik tombol hijau di kanan untuk membuat rincian TP secara instan.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadOfficialPreset}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-1.5 cursor-pointer shadow-xs"
                  title="Muat teks CP resmi Kurikulum Merdeka Kemendikbudristek"
                >
                  <BookOpen size={13} className="text-emerald-300" />
                  <span>Draf CP Resmi</span>
                </button>

                <button
                  onClick={handleAutoGenerateFromCP}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-slate-950" />
                      <span>Sedang Memproses...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 size={14} />
                      <span>✨ Pecah CP Jadi TP Otomatis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {generateMsg && (
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/50 rounded-xl text-xs text-emerald-200 font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>{generateMsg}</span>
              </div>
            )}
          </div>

          {/* CP (CAPAIAN PEMBELAJARAN) INPUT BOX */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Naskah Capaian Pembelajaran (CP) - {activeSub?.name}
                </h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-500 font-medium">Fase:</span>
                  <input
                    type="text"
                    value={fase}
                    onChange={(e) => setFase(e.target.value)}
                    className="w-20 px-2 py-0.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 bg-white"
                    placeholder="Fase A"
                  />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-500 font-medium">Elemen:</span>
                  <input
                    type="text"
                    value={elemen}
                    onChange={(e) => setElemen(e.target.value)}
                    className="w-48 px-2 py-0.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 bg-white"
                    placeholder="e.g. Bilangan, Geometri"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <textarea
                value={cpText}
                onChange={(e) => setCpText(e.target.value)}
                placeholder={`Tempel (Paste) atau ketikkan naskah Capaian Pembelajaran (CP) untuk mapel ${activeSub?.name} di sini...\nContoh: "Peserta didik mampu memahami bilangan cacah sampai 100, menyelesaikan operasi penjumlahan dan pengurangan sederhana, mengenal bangun datar..."`}
                className="w-full h-24 p-3 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50/60 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed transition-all font-sans"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <HelpCircle size={13} className="text-slate-400 shrink-0" />
                  <span>Teks CP ini akan otomatis dipecah menjadi butir TP, Bab, dan Alokasi JP saat Anda mengklik tombol di atas.</span>
                </span>
                <span className="font-mono text-slate-400">{cpText.length} karakter</span>
              </div>
            </div>
          </div>

          {/* TUJUAN PEMBELAJARAN (TP) / LINGKUP MATERI LIST */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers size={16} className="text-emerald-600" />
                  Daftar Tujuan Pembelajaran (TP) Hasil Penurunan CP ({tpList.length} Butir)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Secara otomatis mengisi Program Tahunan (Prota), Program Semester (Promes), dan Modul Ajar.
                </p>
              </div>

              {/* Quick Summary Pill */}
              <div className="flex items-center gap-2 text-xs font-mono font-bold">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                  Sem 1: {totalJpSem1} JP
                </span>
                <span className="px-2.5 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg">
                  Sem 2: {totalJpSem2} JP
                </span>
                <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg">
                  Total 1 Thn: {totalJpYear} JP
                </span>
              </div>
            </div>

            {/* TP Table List */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5 w-14 text-center">Sem</th>
                    <th className="p-2.5 w-16 text-center">Kode</th>
                    <th className="p-2.5 w-40">Bab / Unit</th>
                    <th className="p-2.5">Tujuan Pembelajaran (KKO + Konten)</th>
                    <th className="p-2.5 w-20 text-center">Alokasi</th>
                    <th className="p-2.5 w-20 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tpList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400 space-y-2">
                        <Wand2 size={28} className="mx-auto text-emerald-500 animate-pulse" />
                        <p className="font-bold text-slate-700 text-sm">Belum ada TP yang diturunkan untuk {activeSub?.name}.</p>
                        <p className="text-xs text-slate-500 max-w-md mx-auto">
                          Ketik atau tempel teks CP Anda di kotak atas, lalu klik tombol <strong className="text-emerald-700">&quot;✨ Pecah CP Jadi TP Otomatis&quot;</strong> di atas untuk membuat daftar ini dalam hitungan detik!
                        </p>
                      </td>
                    </tr>
                  ) : (
                    tpList.map((tp) => {
                      const isEditing = editingTpId === tp.id;

                      if (isEditing) {
                        return (
                          <tr key={tp.id} className="bg-emerald-50/70 border-2 border-emerald-400">
                            <td className="p-2 text-center">
                              <select
                                value={editTpSemester}
                                onChange={(e) => setEditTpSemester(Number(e.target.value) as 1 | 2)}
                                className="w-full px-1 py-1 bg-white border border-slate-300 rounded font-bold text-center"
                              >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                              </select>
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={editTpCode}
                                onChange={(e) => setEditTpCode(e.target.value)}
                                className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded font-mono font-bold text-center"
                              />
                            </td>
                            <td className="p-2">
                              <input
                                type="text"
                                value={editTpBab}
                                onChange={(e) => setEditTpBab(e.target.value)}
                                className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-semibold"
                              />
                            </td>
                            <td className="p-2">
                              <textarea
                                value={editTpText}
                                onChange={(e) => setEditTpText(e.target.value)}
                                className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                                rows={2}
                              />
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <input
                                  type="number"
                                  min={1}
                                  max={100}
                                  value={editTpJp}
                                  onChange={(e) => setEditTpJp(Number(e.target.value))}
                                  className="w-12 px-1 py-1 bg-white border border-slate-300 rounded font-bold text-center"
                                />
                                <span className="text-[10px] text-slate-500 font-bold">JP</span>
                              </div>
                            </td>
                            <td className="p-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleSaveEditTp(tp.id)}
                                  className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs cursor-pointer"
                                  title="Simpan"
                                >
                                  <Check size={13} />
                                </button>
                                <button
                                  onClick={() => setEditingTpId(null)}
                                  className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors cursor-pointer"
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
                        <tr key={tp.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-2.5 text-center font-bold">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              tp.semester === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-teal-100 text-teal-900 border border-teal-300'
                            }`}>
                              Sem {tp.semester}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-slate-700">
                            {tp.code}
                          </td>
                          <td className="p-2.5 font-bold text-slate-800">
                            {tp.babUnit}
                          </td>
                          <td className="p-2.5 text-slate-700 leading-relaxed">
                            {tp.text}
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-emerald-700">
                            {tp.alokasiJp} JP
                          </td>
                          <td className="p-2.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleStartEditTp(tp)}
                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit TP"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteTp(tp.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus TP"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Form Tambah TP Manual (Opsional) */}
            <div className="p-3.5 bg-slate-100/80 rounded-xl border border-slate-200 space-y-2.5">
              <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Plus size={14} className="text-emerald-600" />
                <span>Tambah Butir TP Tambahan Secara Manual (Opsional):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                <div className="sm:col-span-2">
                  <select
                    value={newTpSemester}
                    onChange={(e) => setNewTpSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Bab / Unit (Contoh: Bab 1)"
                    value={newTpBab}
                    onChange={(e) => setNewTpBab(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    placeholder="Tujuan Pembelajaran (KKO + Materi)"
                    value={newTpText}
                    onChange={(e) => setNewTpText(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                  />
                </div>
                <div className="sm:col-span-1 flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={newTpJp}
                    onChange={(e) => setNewTpJp(Number(e.target.value))}
                    className="w-full px-1 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                    placeholder="JP"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    onClick={handleAddTp}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>+ Tambah TP</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-semibold">
            *Semua data TP tersimpan otomatis dan langsung mengalir ke Prota, Promes, & Modul Ajar.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                handleSaveAll();
                onClose();
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Check size={15} />
              <span>Selesai & Simpan Data</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
