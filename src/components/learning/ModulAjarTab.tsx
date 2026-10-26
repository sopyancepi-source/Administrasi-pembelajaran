import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Printer, 
  Sparkles, 
  Edit3, 
  Check, 
  Plus, 
  Trash2, 
  FileText, 
  Save, 
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  Award
} from 'lucide-react';
import { SubjectItem, SubjectCPData, ModulAjarDetail, TujuanPembelajaran } from '../../types/learning';

interface ModulAjarTabProps {
  subjects: SubjectItem[];
  selectedClassLevel: string;
  cpDataMap: Record<string, SubjectCPData>;
  onOpenCpModal: () => void;
  selectedYear?: number;
  schoolName: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
}

export default function ModulAjarTab({
  subjects,
  selectedClassLevel,
  cpDataMap,
  onOpenCpModal,
  selectedYear = 2026,
  schoolName,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate
}: ModulAjarTabProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || 'sub-4');
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const activeCpData = cpDataMap[selectedSubjectId];

  // Available TPs for this subject
  const tpList = useMemo(() => {
    return activeCpData?.tujuanPembelajaranList || [];
  }, [activeCpData]);

  const [selectedTpId, setSelectedTpId] = useState<string>('');

  React.useEffect(() => {
    if (tpList.length > 0) {
      setSelectedTpId(tpList[0].id);
    } else {
      setSelectedTpId('');
    }
  }, [selectedSubjectId, tpList]);

  const activeTp = tpList.find(t => t.id === selectedTpId) || tpList[0];

  // Saved Modul Ajar storage
  const [modulStore, setModulStore] = useState<Record<string, ModulAjarDetail>>(() => {
    const saved = localStorage.getItem('school_learning_modul_store');
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
    localStorage.setItem('school_learning_modul_store', JSON.stringify(modulStore));
  }, [modulStore]);

  // Current active Modul Ajar object state
  const currentModulKey = activeTp ? `${selectedSubjectId}-${activeTp.id}` : '';

  const defaultModul = useMemo((): ModulAjarDetail => {
    const subName = activeSubject?.name || 'Mata Pelajaran';
    const tpText = activeTp?.text || 'Memahami materi pembelajaran secara mendalam';
    const bab = activeTp?.babUnit || 'Bab 1';
    const alokasiJp = activeTp?.alokasiJp || 6;
    const pertemuanCount = Math.max(1, Math.ceil(alokasiJp / (activeSubject?.jpPerWeek || 3)));

    const pertemuanList = Array.from({ length: pertemuanCount }).map((_, i) => ({
      pertemuanKe: i + 1,
      alokasiMenit: (activeSubject?.jpPerWeek || 3) * 35,
      kegiatanPendahuluan: `1. Guru memberi salam, menyapa siswa, dan mengajak berdoa bersama.\n2. Guru memeriksa kehadiran dan kesiapan belajar peserta didik.\n3. Apersepsi: Guru mengaitkan materi sebelumnya dengan topik ${bab}.\n4. Guru menyampaikan tujuan pembelajaran dan aktivitas yang akan dilakukan.`,
      kegiatanInti: `1. Orientasi Masalah: Guru menayangkan media/benda konkret berkaitan dengan ${tpText}.\n2. Mengorganisasi Siswa: Peserta didik dibagi menjadi kelompok kecil beranggotakan 4-5 siswa.\n3. Penyelidikan Mandiri/Kelompok: Peserta didik mengerjakan LKPD dan berdiskusi mencari pemecahan masalah.\n4. Presentasi: Perwakilan kelompok mempresentasikan hasil diskusinya di depan kelas.\n5. Evaluasi & Penguatan: Guru memberikan konfirmasi, penguatan, dan meluruskan miskonsepsi.`,
      kegiatanPenutup: `1. Peserta didik bersama guru menyimpulkan inti pembelajaran hari ini.\n2. Refleksi: Peserta didik mengungkapkan kesan dan hal yang telah dipelajari.\n3. Guru memberikan tugas tindak lanjut / apresiasi atas keaktifan siswa.\n4. Menutup pembelajaran dengan doa bersama dan salam.`
    }));

    return {
      id: currentModulKey,
      subjectId: selectedSubjectId,
      subjectName: subName,
      classLevel: selectedClassLevel,
      fase: activeCpData?.fase || 'Fase A',
      semester: activeTp?.semester || 1,
      tpCode: activeTp?.code || 'TP 1.1',
      tpText: tpText,
      materiPokok: bab,
      alokasiJpTotal: alokasiJp,
      jumlahPertemuan: pertemuanCount,
      modelPembelajaran: 'Problem Based Learning (PBL)',
      metodePembelajaran: 'Diskusi Kelompok, Tanya Jawab, Penugasan LKPD, dan Eksplorasi Konkret',
      profilPancasila: ['Mandiri', 'Bernalar Kritis', 'Gotong Royong'],
      profilRahmatanLilAlamin: ["Berkeadaban (Ta'addub)", 'Keteladanan (Qudwah)'],
      targetPesertaDidik: 'Peserta Didik Reguler / Tipikal (28-32 Siswa)',
      saranaPrasarana: 'Buku Siswa & Guru Kemendikbudristek, LKPD, Benda konkret sekitar kelas, LCD Proyektor / Gambar Visual.',
      pemahamanBermakna: `Memahami dan menguasai ${bab} membantu peserta didik menyelesaikan masalah hitungan dan berpikir logis dalam kehidupan sehari-hari.`,
      pertanyaanPemantik: `Bagaimana cara kita mengetahui banyaknya benda tanpa harus menghitungnya satu per satu? Mengapa kita perlu mempelajari ${bab}?`,
      pertemuanList: pertemuanList,
      asesmenFormatifAwal: 'Tanya jawab lisan mengenai konsep awal materi dan observasi kesiapan belajar siswa.',
      asesmenFormatifProses: 'Observasi keaktifan diskusi kelompok, unjuk kerja penyelesaian LKPD, dan rubrik profil pelajar Pancasila.',
      asesmenSumatif: 'Tes tertulis pilihan ganda dan isian singkat di akhir lingkup materi / tes kinerja.',
      rubrikPenilaian: 'Kriteria Ketercapaian Tujuan Pembelajaran (KKTP): Sangat Mahir (90-100), Mahir (75-89), Berkembang (60-74), Perlu Bimbingan (<60).',
      lampiranLkpd: `LEMBAR KERJA PESERTA DIDIK (LKPD)\nTopik: ${bab}\nNama Kelompok / Siswa: ............\nKelas: ${selectedClassLevel}\n\nPetunjuk:\n1. Bacalah setiap instruksi dengan cermat bersama kelompokmu.\n2. Diskusikan dan tuliskan jawaban pada tempat yang telah disediakan.\n3. Laporkan hasil kerja kelompok kepada guru saat presentasi.`,
      lampiranMateri: `RINGKASAN MATERI:\n${bab} membahas tentang ${tpText}. Konsep dasar dipelajari dengan menggunakan benda konkret dan model visual agar peserta didik memahami makna secara mendalam.`
    };
  }, [currentModulKey, selectedSubjectId, activeSubject, activeTp, activeCpData, selectedClassLevel]);

  const activeModul: ModulAjarDetail = modulStore[currentModulKey] || defaultModul;

  // Local editing handlers
  const handleUpdateModul = <K extends keyof ModulAjarDetail>(key: K, value: ModulAjarDetail[K]) => {
    const updated = {
      ...activeModul,
      [key]: value
    };
    setModulStore(prev => ({ ...prev, [currentModulKey]: updated }));
  };

  const handleUpdatePertemuan = (index: number, field: string, val: string | number) => {
    const list = [...activeModul.pertemuanList];
    list[index] = {
      ...list[index],
      [field]: val
    };
    handleUpdateModul('pertemuanList', list);
  };

  const handleGenerateDraft = () => {
    setModulStore(prev => ({ ...prev, [currentModulKey]: defaultModul }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
        
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-bold text-slate-700">Mapel:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>

          {/* TP Selector */}
          <label className="text-xs font-bold text-slate-700 ml-2">Pilih TP / Materi:</label>
          <select
            value={selectedTpId}
            onChange={(e) => setSelectedTpId(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 max-w-xs truncate focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {tpList.length === 0 ? (
              <option value="">-- Belum ada TP --</option>
            ) : (
              tpList.map(tp => (
                <option key={tp.id} value={tp.id}>
                  [{tp.code}] {tp.babUnit} - Sem {tp.semester} ({tp.alokasiJp} JP)
                </option>
              ))
            )}
          </select>

          <button
            onClick={onOpenCpModal}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <BookOpen size={13} />
            <span>Bank CP/TP</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateDraft}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Bangun draf Modul Ajar otomatis lengkap dengan sintaks PBL/Discovery"
          >
            <Sparkles size={14} />
            <span>Generate Draf Modul</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Modul Ajar</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE MODUL AJAR DOCUMENT */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* KOP / DOCUMENT HEADER */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-200">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-slate-900">
            MODUL AJAR / RENCANA PELAKSANAAN PEMBELAJARAN (RPP)
          </h2>
          <h3 className="text-sm font-extrabold uppercase text-emerald-800">
            KURIKULUM MERDEKA • TAHUN AJARAN {selectedYear}/{selectedYear + 1}
          </h3>
          <p className="text-xs font-bold text-slate-600">
            {schoolName || 'SD NEGERI 1 CIPEUNDEUY'} • {selectedClassLevel.toUpperCase()}
          </p>
        </div>

        {/* BAGIAN I: INFORMASI UMUM */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-white bg-slate-900 px-3 py-1.5 rounded-lg">
            I. INFORMASI UMUM
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Nama Penyusun:</span>
                <span className="font-bold text-slate-900">{teacherName || 'Cepi Sopyan, S.Pd.'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Satuan Pendidikan:</span>
                <span className="font-bold text-slate-900">{schoolName}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Mata Pelajaran:</span>
                <span className="font-bold text-slate-900">{activeSubject?.name} ({activeSubject?.code})</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Fase / Kelas / Smt:</span>
                <span className="font-bold text-slate-900">{activeModul.fase} / {selectedClassLevel} / Semester {activeModul.semester}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Alokasi Waktu:</span>
                <span className="font-bold text-emerald-700">{activeModul.alokasiJpTotal} JP ({activeModul.jumlahPertemuan} Pertemuan)</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Model Pembelajaran:</span>
                <input
                  type="text"
                  value={activeModul.modelPembelajaran}
                  onChange={(e) => handleUpdateModul('modelPembelajaran', e.target.value)}
                  className="font-bold text-slate-900 bg-white px-2 py-0.5 border border-slate-300 rounded flex-1"
                />
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Target Peserta Didik:</span>
                <input
                  type="text"
                  value={activeModul.targetPesertaDidik}
                  onChange={(e) => handleUpdateModul('targetPesertaDidik', e.target.value)}
                  className="font-medium text-slate-800 bg-white px-2 py-0.5 border border-slate-300 rounded flex-1"
                />
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Profil Pelajar:</span>
                <span className="font-bold text-slate-800">{activeModul.profilPancasila.join(', ')}</span>
              </div>
            </div>
          </div>

          <div className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700">Sarana & Prasarana:</span>
            <textarea
              value={activeModul.saranaPrasarana}
              onChange={(e) => handleUpdateModul('saranaPrasarana', e.target.value)}
              className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed"
              rows={2}
            />
          </div>
        </div>

        {/* BAGIAN II: KOMPONEN INTI */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-white bg-slate-900 px-3 py-1.5 rounded-lg">
            II. KOMPONEN INTI
          </h4>

          {/* TP & Materi */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-800">A. Tujuan Pembelajaran (TP):</span>
              <textarea
                value={activeModul.tpText}
                onChange={(e) => handleUpdateModul('tpText', e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900 leading-relaxed"
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800">B. Pemahaman Bermakna:</span>
              <textarea
                value={activeModul.pemahamanBermakna}
                onChange={(e) => handleUpdateModul('pemahamanBermakna', e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                rows={2}
              />
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800">C. Pertanyaan Pemantik:</span>
              <textarea
                value={activeModul.pertanyaanPemantik}
                onChange={(e) => handleUpdateModul('pertanyaanPemantik', e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                rows={2}
              />
            </div>
          </div>

          {/* D. KEGIATAN PEMBELAJARAN (PER PERTEMUAN) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800">D. Urutan Kegiatan Pembelajaran:</span>
              <span className="text-[11px] text-slate-500 font-semibold">Total {activeModul.pertemuanList.length} Pertemuan</span>
            </div>

            {activeModul.pertemuanList.map((pt, pIdx) => (
              <div key={pIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-black text-slate-900 uppercase">
                    Pertemuan Ke-{pt.pertemuanKe} ({pt.alokasiMenit} Menit)
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="font-bold text-emerald-800 block mb-0.5">1. Kegiatan Pendahuluan (10 Menit):</span>
                    <textarea
                      value={pt.kegiatanPendahuluan}
                      onChange={(e) => handleUpdatePertemuan(pIdx, 'kegiatanPendahuluan', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                      rows={3}
                    />
                  </div>

                  <div>
                    <span className="font-bold text-emerald-800 block mb-0.5">2. Kegiatan Inti (50 Menit):</span>
                    <textarea
                      value={pt.kegiatanInti}
                      onChange={(e) => handleUpdatePertemuan(pIdx, 'kegiatanInti', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                      rows={5}
                    />
                  </div>

                  <div>
                    <span className="font-bold text-emerald-800 block mb-0.5">3. Kegiatan Penutup (10 Menit):</span>
                    <textarea
                      value={pt.kegiatanPenutup}
                      onChange={(e) => handleUpdatePertemuan(pIdx, 'kegiatanPenutup', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* E. ASESMEN PEMBELAJARAN */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-800 block">E. Asesmen / Penilaian Pembelajaran:</span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">1. Asesmen Formatif Awal:</span>
                <textarea
                  value={activeModul.asesmenFormatifAwal}
                  onChange={(e) => handleUpdateModul('asesmenFormatifAwal', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                  rows={3}
                />
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">2. Asesmen Formatif Proses:</span>
                <textarea
                  value={activeModul.asesmenFormatifProses}
                  onChange={(e) => handleUpdateModul('asesmenFormatifProses', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                  rows={3}
                />
              </div>

              <div>
                <span className="font-semibold text-slate-700 block mb-1">3. Asesmen Sumatif Lingkup:</span>
                <textarea
                  value={activeModul.asesmenSumatif}
                  onChange={(e) => handleUpdateModul('asesmenSumatif', e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                  rows={3}
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="font-semibold text-slate-700 block mb-1">Rubrik & Kriteria Ketercapaian Tujuan Pembelajaran (KKTP):</span>
              <textarea
                value={activeModul.rubrikPenilaian}
                onChange={(e) => handleUpdateModul('rubrikPenilaian', e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded text-xs"
                rows={2}
              />
            </div>
          </div>

          {/* F. LAMPIRAN LKPD */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">III. LAMPIRAN: LEMBAR KERJA PESERTA DIDIK (LKPD)</span>
            <textarea
              value={activeModul.lampiranLkpd}
              onChange={(e) => handleUpdateModul('lampiranLkpd', e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-300 rounded font-mono text-xs leading-relaxed"
              rows={5}
            />
          </div>
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
