import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Users, 
  ChevronDown, 
  Printer, 
  Download, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Edit3,
  Save,
  RotateCcw
} from 'lucide-react';
import { CalendarDay, DayType } from '../types';
import { ClassLevel, ALL_CLASSES, StudentItem, StudentsDataMap } from './DashboardView';

interface AttendanceViewProps {
  calendarData: Record<string, CalendarDay>;
  selectedYear: number;
  schoolName: string;
  weeklyRestDays: number[];
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
}

interface MonthOption {
  index: number; // 0 to 11 (0=Jan, 6=Jul)
  year: number;
  name: string;
  label: string;
}

// Attendance values for individual student cells: 'S' (Sakit), 'I' (Izin), 'A' (Alpa), 'H' (Hadir) or '' (empty)
type AttendanceMap = Record<string, Record<string, string>>; // key: `${class}_${year}_${month}` -> { `${studentId}_${day}`: 'S'|'I'|'A'|'H' }

export default function AttendanceView({
  calendarData,
  selectedYear,
  schoolName,
  weeklyRestDays,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate
}: AttendanceViewProps) {
  // 1. Generate Academic Months list (July of selectedYear to June of selectedYear + 1)
  const monthOptions: MonthOption[] = useMemo(() => {
    const list: MonthOption[] = [
      { index: 6, year: selectedYear, name: 'Juli', label: `Juli ${selectedYear}` },
      { index: 7, year: selectedYear, name: 'Agustus', label: `Agustus ${selectedYear}` },
      { index: 8, year: selectedYear, name: 'September', label: `September ${selectedYear}` },
      { index: 9, year: selectedYear, name: 'Oktober', label: `Oktober ${selectedYear}` },
      { index: 10, year: selectedYear, name: 'November', label: `November ${selectedYear}` },
      { index: 11, year: selectedYear, name: 'Desember', label: `Desember ${selectedYear}` },
      { index: 0, year: selectedYear + 1, name: 'Januari', label: `Januari ${selectedYear + 1}` },
      { index: 1, year: selectedYear + 1, name: 'Februari', label: `Februari ${selectedYear + 1}` },
      { index: 2, year: selectedYear + 1, name: 'Maret', label: `Maret ${selectedYear + 1}` },
      { index: 3, year: selectedYear + 1, name: 'April', label: `April ${selectedYear + 1}` },
      { index: 4, year: selectedYear + 1, name: 'Mei', label: `Mei ${selectedYear + 1}` },
      { index: 5, year: selectedYear + 1, name: 'Juni', label: `Juni ${selectedYear + 1}` }
    ];
    return list;
  }, [selectedYear]);

  // Selected Month & Class state
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0); // Default to July
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('Kelas 1');

  // Paper Settings State
  const [pageSize, setPageSize] = useState<'A4' | 'F4' | 'Letter' | 'Legal'>('A4');
  const [paperOrientation, setPaperOrientation] = useState<'landscape' | 'portrait'>('landscape');
  const [paperMargin, setPaperMargin] = useState<'5mm' | '10mm' | '15mm'>('10mm');

  // Load students data from localStorage
  const [studentsDataMap, setStudentsDataMap] = useState<StudentsDataMap>(() => {
    const saved = localStorage.getItem('school_students_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse students data', e);
      }
    }
    return {
      'Kelas 1': [
        { id: '1-1', no: 1, name: 'Ahmad Sopyan' },
        { id: '1-2', no: 2, name: 'Aisha Nur Aulia' },
        { id: '1-3', no: 3, name: 'Budi Santoso' },
      ],
      'Kelas 2': [],
      'Kelas 3': [],
      'Kelas 4': [],
      'Kelas 5': [],
      'Kelas 6': [],
    };
  });

  // Re-sync students data if updated in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('school_students_data');
      if (saved) {
        try {
          setStudentsDataMap(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Attendance Records state (Digital entry)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceMap>(() => {
    const saved = localStorage.getItem('school_attendance_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {};
  });

  useEffect(() => {
    localStorage.setItem('school_attendance_records', JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Current active month object
  const currentMonth = monthOptions[selectedMonthIndex] || monthOptions[0];

  // Number of days in selected month
  const daysInMonth = useMemo(() => {
    return new Date(currentMonth.year, currentMonth.index + 1, 0).getDate();
  }, [currentMonth]);

  // Array of day numbers: [1, 2, ..., daysInMonth]
  const daysList = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  // Helper to get Kalpen info for a specific day
  const getDayKalpenInfo = (day: number) => {
    const dateStr = `${currentMonth.year}-${String(currentMonth.index + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(currentMonth.year, currentMonth.index, day);
    const dayOfWeek = dateObj.getDay();

    if (calendarData[dateStr]) {
      return {
        dateStr,
        type: calendarData[dateStr].type,
        activityName: calendarData[dateStr].activityName || ''
      };
    }

    const isRest = weeklyRestDays.includes(dayOfWeek);
    return {
      dateStr,
      type: (isRest ? 'WEEKEND' : 'HEB') as DayType,
      activityName: isRest ? 'Libur Akhir Pekan' : ''
    };
  };

  // List of students for selected class (with padding to at least 15 rows for clean print layout)
  const activeStudents = useMemo(() => {
    const rawList = studentsDataMap[selectedClass] || [];
    const minRows = 15;
    const padded: { id: string; no: number; name: string; isBlank?: boolean }[] = rawList.map(s => ({
      id: s.id,
      no: s.no,
      name: s.name,
      isBlank: false
    }));

    if (padded.length < minRows) {
      for (let i = padded.length + 1; i <= minRows; i++) {
        padded.push({
          id: `blank_${i}`,
          no: i,
          name: '',
          isBlank: true
        });
      }
    }
    return padded;
  }, [studentsDataMap, selectedClass]);

  // Attendance key for current month + class
  const activeAttendanceKey = `${selectedClass}_${currentMonth.year}_${currentMonth.index}`;
  const currentMonthAttendance = attendanceRecords[activeAttendanceKey] || {};

  // Cell change handler (for digital entry: S, I, A, H or empty)
  const handleCellChange = (studentId: string, day: number, value: string) => {
    const cellKey = `${studentId}_${day}`;
    const upper = value.toUpperCase().trim();
    const valid = ['S', 'I', 'A', 'H', ''].includes(upper) ? upper : '';

    setAttendanceRecords(prev => ({
      ...prev,
      [activeAttendanceKey]: {
        ...(prev[activeAttendanceKey] || {}),
        [cellKey]: valid
      }
    }));
  };

  // Calculate student totals for S, I, A
  const getStudentTotals = (studentId: string) => {
    let sCount = 0;
    let iCount = 0;
    let aCount = 0;

    daysList.forEach(day => {
      const cellVal = currentMonthAttendance[`${studentId}_${day}`] || '';
      if (cellVal === 'S') sCount++;
      if (cellVal === 'I') iCount++;
      if (cellVal === 'A') aCount++;
    });

    return { sCount, iCount, aCount };
  };

  // Calculate overall class summary for the month
  const classSummary = useMemo(() => {
    let totalS = 0;
    let totalI = 0;
    let totalA = 0;
    const filledStudents = activeStudents.filter(s => !s.isBlank && s.name.trim().length > 0);
    const studentCount = filledStudents.length || 1;

    // Count effective learning days (HEB + HEK)
    let effectiveDays = 0;
    daysList.forEach(day => {
      const info = getDayKalpenInfo(day);
      if (info.type === 'HEB' || info.type === 'HEK') {
        effectiveDays++;
      }
    });

    filledStudents.forEach(st => {
      daysList.forEach(day => {
        const cellVal = currentMonthAttendance[`${st.id}_${day}`] || '';
        if (cellVal === 'S') totalS++;
        if (cellVal === 'I') totalI++;
        if (cellVal === 'A') totalA++;
      });
    });

    const totalPossiblePresences = studentCount * (effectiveDays || 1);
    const sakitPct = ((totalS / totalPossiblePresences) * 100).toFixed(1);
    const izinPct = ((totalI / totalPossiblePresences) * 100).toFixed(1);
    const alpaPct = ((totalA / totalPossiblePresences) * 100).toFixed(1);

    return {
      totalS,
      totalI,
      totalA,
      sakitPct,
      izinPct,
      alpaPct,
      effectiveDays,
      studentCount
    };
  }, [activeStudents, daysList, currentMonthAttendance, currentMonth, calendarData, weeklyRestDays]);

  // Extract KETERANGAN (events & holidays from Kalpen for this month)
  const monthKeteranganList = useMemo(() => {
    const list: { days: string; title: string; type: DayType }[] = [];
    let currentEvent: { startDay: number; endDay: number; title: string; type: DayType } | null = null;

    daysList.forEach(day => {
      const info = getDayKalpenInfo(day);
      const isSpecial = info.type === 'LIBUR_NASIONAL' || info.type === 'LIBUR_SEKOLAH' || info.type === 'HEK' || info.activityName.length > 0;

      if (isSpecial && info.activityName) {
        if (currentEvent && currentEvent.title === info.activityName && currentEvent.type === info.type) {
          currentEvent.endDay = day;
        } else {
          if (currentEvent) {
            list.push({
              days: currentEvent.startDay === currentEvent.endDay ? `Tanggal ${currentEvent.startDay}` : `Tanggal ${currentEvent.startDay} - ${currentEvent.endDay}`,
              title: currentEvent.title,
              type: currentEvent.type
            });
          }
          currentEvent = {
            startDay: day,
            endDay: day,
            title: info.activityName,
            type: info.type
          };
        }
      } else {
        if (currentEvent) {
          list.push({
            days: currentEvent.startDay === currentEvent.endDay ? `Tanggal ${currentEvent.startDay}` : `Tanggal ${currentEvent.startDay} - ${currentEvent.endDay}`,
            title: currentEvent.title,
            type: currentEvent.type
          });
          currentEvent = null;
        }
      }
    });

    if (currentEvent) {
      list.push({
        days: currentEvent.startDay === currentEvent.endDay ? `Tanggal ${currentEvent.startDay}` : `Tanggal ${currentEvent.startDay} - ${currentEvent.endDay}`,
        title: currentEvent.title,
        type: currentEvent.type
      });
    }

    return list;
  }, [daysList, currentMonth, calendarData, weeklyRestDays]);

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  // Helper for background color classes based on day type
  const getDayHeaderBgClass = (type: DayType) => {
    switch (type) {
      case 'LIBUR_NASIONAL':
        return 'bg-red-600 text-white border-red-700 print-bg-red';
      case 'LIBUR_SEKOLAH':
        return 'bg-rose-500 text-white border-rose-600 print-bg-rose';
      case 'WEEKEND':
        return 'bg-red-200 text-red-950 border-red-300 print-bg-weekend';
      case 'HEK':
        return 'bg-amber-300 text-slate-900 border-amber-400 print-bg-amber';
      case 'HEB':
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getCellBgClass = (type: DayType) => {
    switch (type) {
      case 'LIBUR_NASIONAL':
        return 'bg-red-200 text-red-950 font-bold border-red-300 print-bg-red-light';
      case 'LIBUR_SEKOLAH':
        return 'bg-rose-100 text-rose-950 font-bold border-rose-300 print-bg-rose-light';
      case 'WEEKEND':
        return 'bg-red-100/90 text-red-950 font-bold border-red-200 print-bg-weekend';
      case 'HEK':
        return 'bg-amber-100 text-slate-900 font-bold border-amber-200 print-bg-amber';
      case 'HEB':
      default:
        return 'bg-white text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6" id="attendance-page-root">
      {/* PRINT STYLING injected into DOM */}
      <style>{`
        @media print {
          /* Hide non-printable UI components */
          #sidebar-navigation,
          header,
          .no-print,
          button {
            display: none !important;
          }

          body {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 10px !important;
          }

          #attendance-page-root {
            padding: 0 !important;
            margin: 0 !important;
          }

          #printable-attendance-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
          }

          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }

          th, td {
            border: 1px solid #000 !important;
            padding: 2px 3px !important;
          }

          .print-bg-red {
            background-color: #ef4444 !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-bg-red-light {
            background-color: #fca5a5 !important;
            color: #7f1d1d !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-bg-rose {
            background-color: #f43f5e !important;
            color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-bg-rose-light {
            background-color: #fecdd3 !important;
            color: #881337 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-bg-weekend {
            background-color: #fecdd3 !important;
            color: #881337 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .print-bg-amber {
            background-color: #fde047 !important;
            color: #0f172a !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: ${pageSize === 'F4' ? '215mm 330mm' : pageSize} ${paperOrientation};
            margin: ${paperMargin};
          }
        }
      `}</style>

      {/* TOP CONTROLS BAR (NO PRINT) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 no-print">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="bg-indigo-500/10 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Rekap Presensi Siswa
            </span>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-1.5">
              <Calendar className="text-indigo-600 shrink-0" size={20} />
              Menu Absensi
            </h3>
            <p className="text-xs text-slate-500">
              Format daftar hadir siswa sesuai kalender pendidikan aktif, lengkap dengan tanggal libur &amp; keterangan.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full lg:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Printer size={16} />
              Cetak Format Absen
            </button>
          </div>
        </div>

        {/* DROPDOWN SELECTORS ROW */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
          {/* 1. Pilih Bulan */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide">
              Pilih Bulan:
            </label>
            <div className="relative">
              <select
                value={selectedMonthIndex}
                onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs appearance-none"
              >
                {monthOptions.map((m, idx) => (
                  <option key={m.label} value={idx}>
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 2. Pilih Kelas */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide">
              Pilih Kelas:
            </label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as ClassLevel)}
                className="bg-white border border-slate-300 text-xs font-bold text-indigo-700 px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs appearance-none"
              >
                {ALL_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 3. Ukuran Kertas */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide">
              Ukuran Kertas:
            </label>
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs appearance-none"
              >
                <option value="A4">A4 (210 × 297 mm)</option>
                <option value="F4">F4 / Folio (215 × 330 mm)</option>
                <option value="Letter">Letter (216 × 279 mm)</option>
                <option value="Legal">Legal (216 × 356 mm)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 4. Orientasi Kertas */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide">
              Orientasi:
            </label>
            <div className="relative">
              <select
                value={paperOrientation}
                onChange={(e) => setPaperOrientation(e.target.value as any)}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs appearance-none"
              >
                <option value="landscape">Lanskap (Mendatar)</option>
                <option value="portrait">Potret (Tegak)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 5. Margin Kertas */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide">
              Margin:
            </label>
            <div className="relative">
              <select
                value={paperMargin}
                onChange={(e) => setPaperMargin(e.target.value as any)}
                className="bg-white border border-slate-300 text-xs font-bold text-slate-800 px-3.5 py-2 pr-8 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs appearance-none"
              >
                <option value="5mm">Sempit (5 mm)</option>
                <option value="10mm">Normal (10 mm)</option>
                <option value="15mm">Longgar (15 mm)</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Color Legend Quick Reference */}
          <div className="ml-auto flex items-center gap-3 text-[11px] font-semibold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 font-bold uppercase text-[9px]">Indikator Kalpen:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span>Libur</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>HEK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300" />
              <span>HEB</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRINTABLE ATTENDANCE SHEET SHEET CONTAINER */}
      <div 
        id="printable-attendance-sheet"
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md space-y-5 text-slate-900 font-sans"
      >
        {/* HEADER TITLE & METADATA (MATCHING THE IMAGE FORMAT EXACTLY) */}
        <div className="space-y-3">
          <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
            ABSENSI
          </h2>

          <div className="grid grid-cols-2 text-xs font-bold text-slate-800 gap-y-1">
            <div className="space-y-1">
              <div>BULAN : <span className="font-extrabold">{currentMonth.name.toUpperCase()} {currentMonth.year}</span></div>
              <div>KELAS : <span className="font-extrabold">{selectedClass.toUpperCase()}</span></div>
            </div>
            <div className="space-y-1 text-right">
              <div>TAHUN PELAJARAN : <span className="font-extrabold">{selectedYear} / {selectedYear + 1}</span></div>
              <div>SEKOLAH : <span className="font-extrabold">{schoolName ? schoolName.toUpperCase() : '-'}</span></div>
            </div>
          </div>
        </div>

        {/* MAIN FORMATTED ATTENDANCE TABLE */}
        <div className="overflow-x-auto border border-slate-800 rounded-xs">
          <table className="w-full text-center border-collapse text-xs select-none">
            <thead>
              <tr className="bg-slate-100 font-bold border-b border-slate-800">
                <th className="border border-slate-800 px-2 py-2 w-8" rowSpan={2}>
                  NO
                </th>
                <th className="border border-slate-800 px-3 py-2 text-left min-w-[160px]" rowSpan={2}>
                  NAMA
                </th>
                <th className="border border-slate-800 px-2 py-2 w-20" rowSpan={2}>
                  no induk
                </th>

                {/* DATES HEADERS 1 TO daysInMonth */}
                {daysList.map((day) => {
                  const info = getDayKalpenInfo(day);
                  const bgClass = getDayHeaderBgClass(info.type);
                  return (
                    <th
                      key={day}
                      className={`border border-slate-800 px-1 py-1 w-7 text-center font-bold text-[11px] ${bgClass}`}
                      rowSpan={2}
                      title={`${day} ${currentMonth.name}: ${info.activityName || info.type}`}
                    >
                      {day}
                    </th>
                  );
                })}

                {/* JUMLAH GROUP HEADER */}
                <th className="border border-slate-800 px-2 py-1 bg-slate-100" colSpan={3}>
                  Jumlah
                </th>
              </tr>

              <tr className="bg-slate-100 font-bold border-b border-slate-800 text-[11px]">
                <th className="border border-slate-800 px-1.5 py-1 w-7 bg-amber-50">S</th>
                <th className="border border-slate-800 px-1.5 py-1 w-7 bg-blue-50">I</th>
                <th className="border border-slate-800 px-1.5 py-1 w-7 bg-red-50">A</th>
              </tr>
            </thead>

            <tbody>
              {activeStudents.map((student, idx) => {
                const totals = getStudentTotals(student.id);
                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* NO */}
                    <td className="border border-slate-800 py-1.5 text-center font-semibold text-slate-700">
                      {student.no}
                    </td>

                    {/* NAMA */}
                    <td className="border border-slate-800 px-2 py-1.5 text-left font-medium text-slate-900 truncate max-w-[200px]">
                      {student.name}
                    </td>

                    {/* NO INDUK */}
                    <td className="border border-slate-800 px-1 py-1.5 text-center font-mono text-[11px] text-slate-500">
                      {student.isBlank ? '' : ''}
                    </td>

                    {/* DATE CELLS */}
                    {daysList.map((day) => {
                      const info = getDayKalpenInfo(day);
                      const isMergedHoliday = info.type === 'LIBUR_NASIONAL' || info.type === 'LIBUR_SEKOLAH';

                      if (isMergedHoliday) {
                        // Spanned vertical holiday column on row 0
                        if (idx === 0) {
                          const holidayTitle = (info.activityName || (info.type === 'LIBUR_NASIONAL' ? 'LIBUR NASIONAL' : 'LIBUR SEKOLAH')).toUpperCase();
                          const isNational = info.type === 'LIBUR_NASIONAL';

                          return (
                            <td
                              key={day}
                              rowSpan={activeStudents.length}
                              className={`border border-slate-800 p-0 align-middle text-center select-none ${
                                isNational ? 'bg-red-600 text-white print-bg-red' : 'bg-rose-500 text-white print-bg-rose'
                              }`}
                              title={`${day} ${currentMonth.name}: ${holidayTitle}`}
                            >
                              <div className="flex flex-col items-center justify-center h-full min-h-[300px] w-full py-2 font-black text-[10px] text-white leading-none uppercase tracking-widest">
                                {holidayTitle.split('').map((char, cIdx) => (
                                  char === ' ' ? (
                                    <span key={cIdx} className="block h-2" />
                                  ) : (
                                    <span key={cIdx} className="block leading-none my-[1px]">
                                      {char}
                                    </span>
                                  )
                                ))}
                              </div>
                            </td>
                          );
                        }
                        // Skip cell for subsequent rows as rowSpan from row 0 covers them
                        return null;
                      }

                      // Standard cell for HEB, HEK, WEEKEND
                      const bgClass = getCellBgClass(info.type);
                      const cellKey = `${student.id}_${day}`;
                      const cellVal = currentMonthAttendance[cellKey] || '';
                      const isWeekend = info.type === 'WEEKEND';

                      return (
                        <td
                          key={day}
                          className={`border border-slate-800 py-1 text-center font-bold text-xs p-0 ${bgClass}`}
                        >
                          {student.isBlank || isWeekend ? (
                            <span className="inline-block w-full h-full text-center opacity-60">
                              {isWeekend ? '' : ''}
                            </span>
                          ) : (
                            <input
                              type="text"
                              maxLength={1}
                              value={cellVal}
                              onChange={(e) => handleCellChange(student.id, day, e.target.value)}
                              className="w-full text-center bg-transparent focus:bg-white focus:outline-none font-extrabold uppercase text-slate-900 cursor-pointer"
                              placeholder=""
                            />
                          )}
                        </td>
                      );
                    })}

                    {/* RECAP S, I, A PER STUDENT */}
                    <td className="border border-slate-800 py-1.5 text-center font-bold text-amber-900 bg-amber-50/40">
                      {student.isBlank || totals.sCount === 0 ? '' : totals.sCount}
                    </td>
                    <td className="border border-slate-800 py-1.5 text-center font-bold text-blue-900 bg-blue-50/40">
                      {student.isBlank || totals.iCount === 0 ? '' : totals.iCount}
                    </td>
                    <td className="border border-slate-800 py-1.5 text-center font-bold text-red-900 bg-red-50/40">
                      {student.isBlank || totals.aCount === 0 ? '' : totals.aCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* KETERANGAN SECTION (EXTRACTED FROM KALENDER PENDIDIKAN) */}
        <div className="pt-2 space-y-4">
          <div className="border-t border-slate-200 pt-3">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-2">
              KETERANGAN :
            </h4>

            <div className="bg-slate-50/80 p-3 rounded-lg border border-slate-200 text-xs space-y-1.5">
              {monthKeteranganList.length === 0 ? (
                <div className="text-slate-500 italic">
                  - Tidak ada agenda libur nasional atau kegiatan khusus pada bulan ini (Hari Efektif Belajar Biasa).
                </div>
              ) : (
                monthKeteranganList.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-slate-700 min-w-[130px]">
                      {item.days} :
                    </span>
                    <span className={`font-semibold ${item.type === 'LIBUR_NASIONAL' || item.type === 'LIBUR_SEKOLAH' ? 'text-red-700' : 'text-slate-800'}`}>
                      {item.title} {item.type === 'LIBUR_NASIONAL' ? '(Libur Nasional)' : item.type === 'LIBUR_SEKOLAH' ? '(Libur Sekolah)' : ''}
                    </span>
                  </div>
                ))
              )}

              {/* Default Weekly Rest Note */}
              <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60 text-slate-600">
                <span className="font-bold min-w-[130px]">Setiap Hari Minggu :</span>
                <span>Libur Akhir Pekan</span>
              </div>
            </div>
          </div>

          {/* BOTTOM PERCENTAGE STATS & SIGNATURES (MATCHING THE IMAGE) */}
          <div className="grid grid-cols-3 items-end pt-4 text-xs">
            {/* LEFT SIGNATURE: KEPALA MADRASAH / SEKOLAH */}
            <div className="space-y-1 text-left">
              <div>Mengetahui;</div>
              <div className="font-bold">Kepala Madrasah / Sekolah</div>
              <div className="h-16" /> {/* Signature whitespace */}
              <div className="font-black text-slate-900 border-b border-slate-900 inline-block min-w-[140px]">
                {principalName || '...........................................'}
              </div>
              <div className="text-[11px] font-semibold text-slate-700">
                NIP. {principalNip || '...................................'}
              </div>
            </div>

            {/* CENTER STATS PERCENTAGE (MATCHING IMAGE FORMAT) */}
            <div className="space-y-1 text-center font-semibold text-slate-800">
              <div className="grid grid-cols-2 gap-x-2 text-left max-w-[160px] mx-auto">
                <span>Sakit :</span>
                <span className="font-mono text-right">{classSummary.sakitPct}%</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 text-left max-w-[160px] mx-auto">
                <span>Izin :</span>
                <span className="font-mono text-right">{classSummary.izinPct}%</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 text-left max-w-[160px] mx-auto">
                <span>Alpa :</span>
                <span className="font-mono text-right">{classSummary.alpaPct}%</span>
              </div>
            </div>

            {/* RIGHT SIGNATURE: GURU KELAS */}
            <div className="space-y-1 text-right">
              <div>
                {signaturePlace || 'Cipeundeuy'}, {signatureDate || '.......................'}
              </div>
              <div className="font-bold">Guru Kelas</div>
              <div className="h-16" /> {/* Signature whitespace */}
              <div className="font-black text-slate-900 border-b border-slate-900 inline-block min-w-[140px]">
                {teacherName || '...........................................'}
              </div>
              <div className="text-[11px] font-semibold text-slate-700">
                NIP. {teacherNip || '...................................'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
