import React, { useMemo } from 'react';
import { 
  FileText, 
  Printer, 
  Info, 
  Calendar, 
  RotateCcw, 
  Clock, 
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { SubjectItem } from '../../types/learning';
import { CalendarDay } from '../../types';

interface AlokasiWaktuTabProps {
  subjects: SubjectItem[];
  selectedClassLevel: string;
  calendarData?: Record<string, CalendarDay>;
  selectedYear?: number;
  schoolName: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
}

export default function AlokasiWaktuTab({
  subjects,
  selectedClassLevel,
  calendarData,
  selectedYear = 2026,
  schoolName,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate
}: AlokasiWaktuTabProps) {
  // Semester 1 (Juli - Desember) months details
  const [s1Config, setS1Config] = React.useState({
    totalWeeks: 26, // Juli - Des (26 weeks)
    nonEffectiveMpls: 1, // MPLS (1 week)
    nonEffectiveSts: 1, // STS Ganjil (1 week)
    nonEffectiveSas: 1, // SAS / PAS Ganjil (1 week)
    nonEffectiveRapor: 1, // Pembagian Rapor (1 week)
    nonEffectiveLibur: 2, // Libur Akhir Semester Ganjil (2 weeks)
  });

  // Semester 2 (Januari - Juni) months details
  const [s2Config, setS2Config] = React.useState({
    totalWeeks: 26, // Jan - Jun (26 weeks)
    nonEffectiveAwal: 1, // Libur Awal Puasa / Hari Pertama (1 week)
    nonEffectiveSts: 1, // STS Genap (1 week)
    nonEffectiveSas: 1, // SAT / SAS Genap (1 week)
    nonEffectiveRapor: 1, // Pembagian Rapor (1 week)
    nonEffectiveLibur: 3, // Libur Akhir Tahun Ajaran (3 weeks)
  });

  // Calculated totals
  const s1NonEffectiveTotal = s1Config.nonEffectiveMpls + s1Config.nonEffectiveSts + s1Config.nonEffectiveSas + s1Config.nonEffectiveRapor + s1Config.nonEffectiveLibur;
  const s1EffectiveWeeks = Math.max(0, s1Config.totalWeeks - s1NonEffectiveTotal);

  const s2NonEffectiveTotal = s2Config.nonEffectiveAwal + s2Config.nonEffectiveSts + s2Config.nonEffectiveSas + s2Config.nonEffectiveRapor + s2Config.nonEffectiveLibur;
  const s2EffectiveWeeks = Math.max(0, s2Config.totalWeeks - s2NonEffectiveTotal);

  const totalEffectiveWeeksYear = s1EffectiveWeeks + s2EffectiveWeeks;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* TOOLBAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <FileText size={16} className="text-emerald-600" />
          <span>Analisis Jam & Rincian Minggu Efektif (RME / RBE) • {selectedClassLevel}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Analisis Alokasi Waktu</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE SHEET */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        
        {/* DOCUMENT HEADER */}
        <div className="text-center space-y-1 pb-4 border-b border-slate-200">
          <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-slate-900">
            ANALISIS ALOKASI WAKTU & RINCIAN PEKAN EFEKTIF
          </h2>
          <h3 className="text-sm font-extrabold uppercase text-emerald-800">
            TAHUN AJARAN {selectedYear}/{selectedYear + 1} • {selectedClassLevel.toUpperCase()}
          </h3>
          <p className="text-xs font-bold text-slate-600">
            {schoolName || 'SD NEGERI 1 CIPEUNDEUY'}
          </p>
        </div>

        {/* SECTION 1: PERHITUNGAN MINGGU EFEKTIF SEMESTER 1 & 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* SEMESTER 1 BOX */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                I. Semester Ganjil (Juli - Desember {selectedYear})
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                {s1EffectiveWeeks} Minggu Efektif
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700">1. Jumlah Pekan Keseluruhan:</span>
                <span className="font-mono font-bold text-slate-900">{s1Config.totalWeeks} Pekan</span>
              </div>
              <div className="space-y-1 pl-3 text-[11px] text-slate-600">
                <div className="font-bold text-slate-800">2. Rincian Pekan Tidak Efektif:</div>
                <div className="flex justify-between">
                  <span>• Masa Pengenalan Lingkungan Sekolah (MPLS):</span>
                  <span className="font-mono font-bold">{s1Config.nonEffectiveMpls} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Sumatif Tengah Semester (STS) Ganjil:</span>
                  <span className="font-mono font-bold">{s1Config.nonEffectiveSts} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Sumatif Akhir Semester (SAS) Ganjil:</span>
                  <span className="font-mono font-bold">{s1Config.nonEffectiveSas} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Pengolahan Nilai & Pembagian Rapor:</span>
                  <span className="font-mono font-bold">{s1Config.nonEffectiveRapor} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Libur Akhir Semester Ganjil:</span>
                  <span className="font-mono font-bold">{s1Config.nonEffectiveLibur} Pekan</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-rose-800">
                  <span>Jumlah Pekan Tidak Efektif:</span>
                  <span className="font-mono">{s1NonEffectiveTotal} Pekan</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg border border-emerald-200 font-bold text-emerald-900">
                <span>3. Jumlah Pekan Efektif (MEB S1):</span>
                <span className="font-mono text-sm">{s1EffectiveWeeks} Pekan</span>
              </div>
            </div>
          </div>

          {/* SEMESTER 2 BOX */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-teal-100 text-teal-900 border border-teal-300">
                II. Semester Genap (Januari - Juni {selectedYear + 1})
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                {s2EffectiveWeeks} Minggu Efektif
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="font-semibold text-slate-700">1. Jumlah Pekan Keseluruhan:</span>
                <span className="font-mono font-bold text-slate-900">{s2Config.totalWeeks} Pekan</span>
              </div>
              <div className="space-y-1 pl-3 text-[11px] text-slate-600">
                <div className="font-bold text-slate-800">2. Rincian Pekan Tidak Efektif:</div>
                <div className="flex justify-between">
                  <span>• Libur Awal Puasa / Hari Pertama:</span>
                  <span className="font-mono font-bold">{s2Config.nonEffectiveAwal} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Sumatif Tengah Semester (STS) Genap:</span>
                  <span className="font-mono font-bold">{s2Config.nonEffectiveSts} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Sumatif Akhir Tahun (SAT) / SAS Genap:</span>
                  <span className="font-mono font-bold">{s2Config.nonEffectiveSas} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Pengolahan Nilai & Pembagian Rapor:</span>
                  <span className="font-mono font-bold">{s2Config.nonEffectiveRapor} Pekan</span>
                </div>
                <div className="flex justify-between">
                  <span>• Libur Akhir Tahun Ajaran:</span>
                  <span className="font-mono font-bold">{s2Config.nonEffectiveLibur} Pekan</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-rose-800">
                  <span>Jumlah Pekan Tidak Efektif:</span>
                  <span className="font-mono">{s2NonEffectiveTotal} Pekan</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-2 bg-emerald-50 rounded-lg border border-emerald-200 font-bold text-emerald-900">
                <span>3. Jumlah Pekan Efektif (MEB S2):</span>
                <span className="font-mono text-sm">{s2EffectiveWeeks} Pekan</span>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 2: DISTRIBUSI ALOKASI JAM SEMUA MATA PELAJARAN */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600" />
              <span>III. Rekapitulasi Alokasi Jam Pelajaran (JP) Efektif Per Mata Pelajaran</span>
            </h4>
            <span className="text-xs font-semibold text-slate-500">
              Rumus: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold text-slate-800">JP Efektif = Pekan Efektif × JP/Minggu</code>
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded-xl">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-900 text-white font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 w-12 text-center border border-slate-800">No</th>
                  <th className="p-2.5 border border-slate-800">Mata Pelajaran</th>
                  <th className="p-2.5 w-16 text-center border border-slate-800">Kode</th>
                  <th className="p-2.5 w-24 text-center border border-slate-800">Alokasi JP / Minggu</th>
                  <th className="p-2.5 w-28 text-center border border-slate-800 bg-amber-900/40">
                    Total JP Sem 1 ({s1EffectiveWeeks} Pekan)
                  </th>
                  <th className="p-2.5 w-28 text-center border border-slate-800 bg-teal-900/40">
                    Total JP Sem 2 ({s2EffectiveWeeks} Pekan)
                  </th>
                  <th className="p-2.5 w-28 text-center border border-slate-800 bg-emerald-900/50">
                    Total JP 1 Tahun ({totalEffectiveWeeksYear} Pekan)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subjects.map((sub, idx) => {
                  const jpS1 = s1EffectiveWeeks * sub.jpPerWeek;
                  const jpS2 = s2EffectiveWeeks * sub.jpPerWeek;
                  const jpTotal = totalEffectiveWeeksYear * sub.jpPerWeek;

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 text-center font-bold text-slate-600 border border-slate-300">
                        {idx + 1}
                      </td>
                      <td className="p-2 font-bold text-slate-800 border border-slate-300">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                          <span>{sub.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-slate-700 border border-slate-300">
                        {sub.code}
                      </td>
                      <td className="p-2 text-center font-mono font-extrabold text-slate-800 border border-slate-300 bg-slate-50">
                        {sub.jpPerWeek} JP
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-amber-950 border border-slate-300 bg-amber-50/50">
                        {jpS1} JP
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-teal-950 border border-slate-300 bg-teal-50/50">
                        {jpS2} JP
                      </td>
                      <td className="p-2 text-center font-mono font-black text-emerald-950 border border-slate-300 bg-emerald-50/80">
                        {jpTotal} JP
                      </td>
                    </tr>
                  );
                })}

                {/* TOTAL ROW */}
                <tr className="bg-slate-100 font-extrabold text-slate-900">
                  <td colSpan={3} className="p-2.5 text-center uppercase tracking-wider border border-slate-300">
                    Jumlah Total Alokasi Jam Pelajaran
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-slate-900 border border-slate-300 bg-slate-200">
                    {subjects.reduce((sum, s) => sum + s.jpPerWeek, 0)} JP
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-amber-900 border border-slate-300 bg-amber-100/60">
                    {subjects.reduce((sum, s) => sum + (s.jpPerWeek * s1EffectiveWeeks), 0)} JP
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-teal-900 border border-slate-300 bg-teal-100/60">
                    {subjects.reduce((sum, s) => sum + (s.jpPerWeek * s2EffectiveWeeks), 0)} JP
                  </td>
                  <td className="p-2.5 text-center font-mono font-black text-emerald-900 border border-slate-300 bg-emerald-100">
                    {subjects.reduce((sum, s) => sum + (s.jpPerWeek * totalEffectiveWeeksYear), 0)} JP
                  </td>
                </tr>
              </tbody>
            </table>
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
            <div>Guru Kelas</div>
            <div className="h-16"></div>
            <div className="font-bold underline uppercase">{teacherName || 'CEPI SOPYAN, S.Pd.'}</div>
            <div>NIP. {teacherNip || '-'}</div>
          </div>
        </div>

      </div>
    </div>
  );
}
