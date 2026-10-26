import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Printer, 
  Sparkles, 
  RotateCcw, 
  Check, 
  X, 
  BookOpen, 
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { SubjectItem, SubjectCPData, PromesRow, PromesMonthConfig } from '../../types/learning';

interface PromesTabProps {
  subjects: SubjectItem[];
  selectedClassLevel: string;
  cpDataMap: Record<string, SubjectCPData>;
  onOpenCpModal: () => void;
  selectedYear?: number;
  initialSubjectId?: string;
  initialSemester?: 1 | 2;
  schoolName: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
}

export default function PromesTab({
  subjects,
  selectedClassLevel,
  cpDataMap,
  onOpenCpModal,
  selectedYear = 2026,
  initialSubjectId,
  initialSemester = 1,
  schoolName,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate
}: PromesTabProps) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId || subjects[0]?.id || 'sub-4');
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(initialSemester);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const activeCpData = cpDataMap[selectedSubjectId];

  // Month configurations for Semester 1 (Juli - Desember)
  const semester1Months: PromesMonthConfig[] = [
    {
      monthName: 'Juli',
      monthIndex: 6,
      year: selectedYear,
      weeksCount: 5,
      weekStatus: ['LIBUR_SEKOLAH', 'LIBUR_SEKOLAH', 'MPLS', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'Agustus',
      monthIndex: 7,
      year: selectedYear,
      weeksCount: 4,
      weekStatus: ['EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'September',
      monthIndex: 8,
      year: selectedYear,
      weeksCount: 4,
      weekStatus: ['EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'STS']
    },
    {
      monthName: 'Oktober',
      monthIndex: 9,
      year: selectedYear,
      weeksCount: 5,
      weekStatus: ['EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'November',
      monthIndex: 10,
      year: selectedYear,
      weeksCount: 4,
      weekStatus: ['EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'Desember',
      monthIndex: 11,
      year: selectedYear,
      weeksCount: 5,
      weekStatus: ['SAS', 'NON_EFEKTIF', 'LIBUR_SEKOLAH', 'LIBUR_SEKOLAH', 'LIBUR_SEKOLAH']
    }
  ];

  // Month configurations for Semester 2 (Januari - Juni)
  const semester2Months: PromesMonthConfig[] = [
    {
      monthName: 'Januari',
      monthIndex: 0,
      year: selectedYear + 1,
      weeksCount: 5,
      weekStatus: ['LIBUR_SEKOLAH', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'Februari',
      monthIndex: 1,
      year: selectedYear + 1,
      weeksCount: 4,
      weekStatus: ['EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'Maret',
      monthIndex: 2,
      year: selectedYear + 1,
      weeksCount: 4,
      weekStatus: ['NON_EFEKTIF', 'EFEKTIF', 'STS', 'EFEKTIF']
    },
    {
      monthName: 'April',
      monthIndex: 3,
      year: selectedYear + 1,
      weeksCount: 4,
      weekStatus: ['LIBUR_SEKOLAH', 'LIBUR_SEKOLAH', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'Mei',
      monthIndex: 4,
      year: selectedYear + 1,
      weeksCount: 5,
      weekStatus: ['EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF', 'EFEKTIF']
    },
    {
      monthName: 'Juni',
      monthIndex: 5,
      year: selectedYear + 1,
      weeksCount: 4,
      weekStatus: ['SAS', 'NON_EFEKTIF', 'LIBUR_SEKOLAH', 'LIBUR_SEKOLAH']
    }
  ];

  const currentMonths = selectedSemester === 1 ? semester1Months : semester2Months;

  // Promes matrix store saved in localStorage
  const [promesStore, setPromesStore] = useState<Record<string, PromesRow[]>>(() => {
    const saved = localStorage.getItem('school_learning_promes_store');
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
    localStorage.setItem('school_learning_promes_store', JSON.stringify(promesStore));
  }, [promesStore]);

  const storeKey = `${selectedSubjectId}-sem-${selectedSemester}`;

  // Get current rows or generate default
  const rows: PromesRow[] = useMemo(() => {
    if (promesStore[storeKey]?.length) {
      return promesStore[storeKey];
    }
    // Generate initial from CP TP
    const tpFiltered = (activeCpData?.tujuanPembelajaranList || []).filter(t => t.semester === selectedSemester);
    if (tpFiltered.length) {
      return tpFiltered.map((tp, idx) => ({
        id: tp.id || `promes-${idx}`,
        semester: selectedSemester,
        noUrut: `${idx + 1}`,
        babUnit: tp.babUnit,
        tujuanPembelajaran: tp.text,
        alokasiJp: tp.alokasiJp,
        weeklyDistribution: {},
        keterangan: tp.keterangan
      }));
    }
    return [];
  }, [storeKey, promesStore, activeCpData, selectedSemester]);

  // Automated auto-plot distribution algorithm
  const handleAutoDistribute = () => {
    if (rows.length === 0) {
      alert('Tidak ada materi / TP untuk semester ini. Silakan input TP terlebih dahulu!');
      return;
    }

    const jpPerWeek = activeSubject?.jpPerWeek || 4;
    
    // Flatten all effective weeks across the 6 months in chronological order
    const availableWeeks: { monthKey: string; monthIndex: number; weekIndex: number; monthName: string; weekStatus: string }[] = [];
    currentMonths.forEach((m, mIdx) => {
      for (let w = 0; w < m.weeksCount; w++) {
        const status = m.weekStatus[w];
        if (status === 'EFEKTIF' || status === 'STS' || status === 'SAS') {
          availableWeeks.push({
            monthKey: `${m.monthIndex}-${w}`,
            monthIndex: m.monthIndex,
            weekIndex: w,
            monthName: m.monthName,
            weekStatus: status
          });
        }
      }
    });

    let currentWeekIdx = 0;
    const updatedRows = rows.map((row) => {
      const newDist: Record<string, number> = {};
      let remainingJp = row.alokasiJp;

      // If it's STS or SAS assessment
      if (row.babUnit.toLowerCase().includes('sts') || row.tujuanPembelajaran.toLowerCase().includes('sts')) {
        // Look for STS week
        const stsWeek = availableWeeks.find(aw => aw.weekStatus === 'STS');
        if (stsWeek) {
          newDist[stsWeek.monthKey] = row.alokasiJp;
          return { ...row, weeklyDistribution: newDist };
        }
      }

      if (row.babUnit.toLowerCase().includes('sas') || row.tujuanPembelajaran.toLowerCase().includes('sas')) {
        // Look for SAS week
        const sasWeek = availableWeeks.find(aw => aw.weekStatus === 'SAS');
        if (sasWeek) {
          newDist[sasWeek.monthKey] = row.alokasiJp;
          return { ...row, weeklyDistribution: newDist };
        }
      }

      // Distribute standard learning JP week by week
      while (remainingJp > 0 && currentWeekIdx < availableWeeks.length) {
        const week = availableWeeks[currentWeekIdx];
        if (week.weekStatus !== 'EFEKTIF') {
          currentWeekIdx++;
          continue;
        }

        const assignJp = Math.min(remainingJp, jpPerWeek);
        newDist[week.monthKey] = assignJp;
        remainingJp -= assignJp;

        if (assignJp >= jpPerWeek || remainingJp === 0) {
          currentWeekIdx++;
        }
      }

      return {
        ...row,
        weeklyDistribution: newDist
      };
    });

    setPromesStore(prev => ({ ...prev, [storeKey]: updatedRows }));
  };

  const handleCellChange = (rowId: string, cellKey: string, val: string) => {
    const num = parseInt(val, 10);
    const updated = rows.map(r => {
      if (r.id === rowId) {
        const dist = { ...r.weeklyDistribution };
        if (isNaN(num) || num <= 0) {
          delete dist[cellKey];
        } else {
          dist[cellKey] = num;
        }
        return { ...r, weeklyDistribution: dist };
      }
      return r;
    });

    setPromesStore(prev => ({ ...prev, [storeKey]: updated }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Stats
  const targetTotalJp = (activeSubject?.jpPerWeek || 4) * (selectedSemester === 1 ? 18 : 17);
  const totalRowJp = rows.reduce((acc, r) => acc + (r.alokasiJp || 0), 0);
  
  // Total distributed
  const totalDistributedJp = rows.reduce((acc, r) => {
    const rowSum = Object.values(r.weeklyDistribution || {}).reduce((s, v) => s + (v || 0), 0);
    return acc + rowSum;
  }, 0);

  return (
    <div className="space-y-6">
      
      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
        
        {/* Controls */}
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

          {/* Semester Selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setSelectedSemester(1)}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                selectedSemester === 1
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semester 1 (Ganjil)
            </button>
            <button
              onClick={() => setSelectedSemester(2)}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                selectedSemester === 2
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semester 2 (Genap)
            </button>
          </div>

          <button
            onClick={handleAutoDistribute}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Sebarkan JP materi secara berurutan ke minggu-minggu efektif secara otomatis"
          >
            <Sparkles size={14} />
            <span>Plot Otomatis Mingguan</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCpModal}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <BookOpen size={14} />
            <span>Edit CP/TP</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Promes</span>
          </button>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs screen-only font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-bold">Mata Pelajaran: <strong className="text-slate-900">{activeSubject?.name}</strong> ({activeSubject?.jpPerWeek} JP/Minggu)</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-bold">Target Alokasi: <strong className="text-emerald-700">{targetTotalJp} JP</strong></span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-bold">Total Terdistribusi: <strong className="text-slate-900">{totalDistributedJp} JP</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            totalDistributedJp === totalRowJp ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
          }`}>
            {totalDistributedJp === totalRowJp ? '✓ Seluruh JP Terdistribusi' : `Belum Terplot ${totalRowJp - totalDistributedJp} JP`}
          </span>
        </div>
      </div>

      {/* PRINTABLE PROMES MATRIX TABLE */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* KOP / DOCUMENT HEADER */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-200">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-slate-900">
            PROGRAM SEMESTER (PROMES) {selectedSemester === 1 ? 'GANJIL' : 'GENAP'}
          </h2>
          <h3 className="text-sm font-extrabold uppercase text-emerald-800">
            MATA PELAJARAN: {activeSubject?.name.toUpperCase()} • TAHUN AJARAN {selectedYear}/{selectedYear + 1}
          </h3>
          <p className="text-xs font-bold text-slate-600">
            {schoolName || 'SD NEGERI 1 CIPEUNDEUY'} • {selectedClassLevel.toUpperCase()}
          </p>
        </div>

        {/* PROMES MATRIX TABLE */}
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
              <tr>
                <th rowSpan={2} className="p-2 w-10 text-center border border-slate-800">No</th>
                <th rowSpan={2} className="p-2 w-32 border border-slate-800">Bab / Unit</th>
                <th rowSpan={2} className="p-2 min-w-[200px] border border-slate-800">Tujuan Pembelajaran (TP)</th>
                <th rowSpan={2} className="p-2 w-14 text-center border border-slate-800">Alokasi JP</th>
                
                {/* Month Headers */}
                {currentMonths.map(m => (
                  <th 
                    key={m.monthName} 
                    colSpan={m.weeksCount} 
                    className="p-1.5 text-center border border-slate-800 bg-slate-800"
                  >
                    {m.monthName}
                  </th>
                ))}
                
                <th rowSpan={2} className="p-2 w-20 text-center border border-slate-800">Ket</th>
              </tr>
              <tr>
                {/* Week 1..5 Subheaders */}
                {currentMonths.map(m => {
                  return Array.from({ length: m.weeksCount }).map((_, wIdx) => {
                    const status = m.weekStatus[wIdx];
                    const isNonEffective = status !== 'EFEKTIF';
                    return (
                      <th
                        key={`${m.monthName}-w-${wIdx}`}
                        className={`p-1 text-center border border-slate-700 font-mono text-[9px] w-6 ${
                          isNonEffective ? 'bg-slate-700 text-amber-300' : 'bg-slate-900 text-slate-200'
                        }`}
                        title={status}
                      >
                        {wIdx + 1}
                      </th>
                    );
                  });
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={30} className="p-8 text-center text-slate-400 space-y-2">
                    <Layers size={28} className="mx-auto text-slate-300" />
                    <p className="font-bold text-slate-600">Belum ada data Tujuan Pembelajaran untuk Semester {selectedSemester}.</p>
                    <p className="text-[11px]">
                      Klik tombol <strong>"Edit CP/TP"</strong> untuk memasukkan materi dan TP.
                    </p>
                  </td>
                </tr>
              ) : (
                rows.map((row, idx) => {
                  const rowSum = Object.values(row.weeklyDistribution || {}).reduce((s, v) => s + (v || 0), 0);
                  const isMatch = rowSum === row.alokasiJp;

                  return (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 text-center font-mono font-bold text-slate-600 border border-slate-300">
                        {row.noUrut || idx + 1}
                      </td>
                      <td className="p-2 font-bold text-slate-900 border border-slate-300">
                        {row.babUnit}
                      </td>
                      <td className="p-2 text-slate-800 leading-relaxed border border-slate-300">
                        {row.tujuanPembelajaran}
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-emerald-800 border border-slate-300 bg-emerald-50/30">
                        {row.alokasiJp}
                      </td>

                      {/* Weekly cells */}
                      {currentMonths.map(m => {
                        return Array.from({ length: m.weeksCount }).map((_, wIdx) => {
                          const status = m.weekStatus[wIdx];
                          const cellKey = `${m.monthIndex}-${wIdx}`;
                          const cellVal = row.weeklyDistribution?.[cellKey];

                          if (status === 'MPLS') {
                            return (
                              <td key={cellKey} className="p-0.5 text-center border border-slate-300 bg-amber-100 text-amber-900 font-extrabold text-[9px]">
                                MPLS
                              </td>
                            );
                          }
                          if (status === 'STS') {
                            return (
                              <td key={cellKey} className="p-0.5 text-center border border-slate-300 bg-teal-100 text-teal-900 font-extrabold text-[9px]">
                                {cellVal ? (
                                  <input
                                    type="text"
                                    value={cellVal}
                                    onChange={(e) => handleCellChange(row.id, cellKey, e.target.value)}
                                    className="w-full text-center font-bold text-teal-950 bg-transparent"
                                  />
                                ) : 'STS'}
                              </td>
                            );
                          }
                          if (status === 'SAS') {
                            return (
                              <td key={cellKey} className="p-0.5 text-center border border-slate-300 bg-rose-100 text-rose-900 font-extrabold text-[9px]">
                                {cellVal ? (
                                  <input
                                    type="text"
                                    value={cellVal}
                                    onChange={(e) => handleCellChange(row.id, cellKey, e.target.value)}
                                    className="w-full text-center font-bold text-rose-950 bg-transparent"
                                  />
                                ) : 'SAS'}
                              </td>
                            );
                          }
                          if (status === 'LIBUR_SEKOLAH' || status === 'NON_EFEKTIF') {
                            return (
                              <td key={cellKey} className="p-0.5 text-center border border-slate-300 bg-slate-200/70 text-slate-400 font-bold text-[9px]">
                                LBR
                              </td>
                            );
                          }

                          return (
                            <td 
                              key={cellKey} 
                              className={`p-0.5 text-center border border-slate-300 transition-colors ${
                                cellVal ? 'bg-emerald-100/90 text-emerald-950 font-black' : 'hover:bg-slate-100'
                              }`}
                            >
                              <input
                                type="text"
                                value={cellVal || ''}
                                onChange={(e) => handleCellChange(row.id, cellKey, e.target.value)}
                                className="w-full text-center font-mono font-bold text-xs bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500 rounded py-0.5"
                                placeholder="-"
                              />
                            </td>
                          );
                        });
                      })}

                      <td className="p-2 text-center text-slate-600 border border-slate-300 text-[11px]">
                        {row.keterangan || 'Materi'}
                      </td>
                    </tr>
                  );
                })
              )}

              {/* TOTAL ROW */}
              <tr className="bg-slate-100 font-extrabold text-slate-900">
                <td colSpan={3} className="p-2 text-right uppercase tracking-wider border border-slate-300">
                  Jumlah Alokasi Waktu (JP)
                </td>
                <td className="p-2 text-center font-mono font-black text-emerald-900 border border-slate-300 bg-emerald-100">
                  {totalRowJp}
                </td>
                
                {/* Per-week column totals */}
                {currentMonths.map(m => {
                  return Array.from({ length: m.weeksCount }).map((_, wIdx) => {
                    const status = m.weekStatus[wIdx];
                    const cellKey = `${m.monthIndex}-${wIdx}`;
                    const weekSum = rows.reduce((sum, r) => sum + (r.weeklyDistribution?.[cellKey] || 0), 0);

                    return (
                      <td key={`total-${cellKey}`} className="p-1 text-center font-mono font-bold text-slate-800 border border-slate-300 bg-slate-50 text-[10px]">
                        {weekSum > 0 ? weekSum : ''}
                      </td>
                    );
                  });
                })}

                <td className="p-2 text-center text-xs text-slate-600 border border-slate-300">
                  ✓
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
