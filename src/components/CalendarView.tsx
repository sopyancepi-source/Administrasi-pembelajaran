import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  RefreshCw, 
  Info, 
  Check, 
  Trash2, 
  CalendarRange, 
  Clock, 
  AlertCircle, 
  Plus, 
  Layers, 
  Grid, 
  TableProperties, 
  Sparkles, 
  HelpCircle,
  FileSpreadsheet,
  Edit2,
  X,
  Printer,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDay, DayType, NationalHoliday } from '../types';
import { getNationalHolidays } from '../data/holidays';

interface CalendarViewProps {
  calendarData: Record<string, CalendarDay>;
  setCalendarData: React.Dispatch<React.SetStateAction<Record<string, CalendarDay>>>;
  selectedYear: number; // Start year of Academic Year (e.g. 2026 for 2026/2027)
  setSelectedYear: (year: number) => void;
  academicYears: number[];
  setAcademicYears: React.Dispatch<React.SetStateAction<number[]>>;
  weeklyRestDays: number[];
  setWeeklyRestDays: React.Dispatch<React.SetStateAction<number[]>>;
  schoolName: string;
  schoolLogo?: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
}

const MONTHS_INDONESIAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAYS_INDONESIAN = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const WEEKDAYS_SHORT = ['Ah', 'Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb'];

// Academic Year starts in July (index 6) and ends in June (index 5)
const ACADEMIC_MONTH_ORDER = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];

export default function CalendarView({
  calendarData,
  setCalendarData,
  selectedYear,
  setSelectedYear,
  academicYears,
  setAcademicYears,
  weeklyRestDays,
  setWeeklyRestDays,
  schoolName,
  schoolLogo,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate
}: CalendarViewProps) {
  // Active Sub-Menu Tab
  // 1: Pengaturan Kegiatan Manual
  // 2: Kalender Tahunan Lengkap (Juli - Juni)
  // 3: Analisis Minggu & Hari Efektif (Matriks)
  // 4: Distribusi Detail Bulanan (HEB, HEK, Libur)
  const [activeSubTab, setActiveSubTab] = useState<1 | 2 | 3 | 4>(1);

  // Form states for manual activities (Menu 1)
  const [entryType, setEntryType] = useState<'single' | 'range'>('single');
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityTitle, setActivityTitle] = useState('');
  const [dayType, setDayType] = useState<DayType>('HEK');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success'>('idle');

  // States for custom modals & toast notifications
  const [deleteTargetDate, setDeleteTargetDate] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // New editing & bulk selection states for manual activities list
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempType, setTempType] = useState<DayType>('HEK');
  const [tempDate, setTempDate] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isDeleteAllConfirm, setIsDeleteAllConfirm] = useState(false);
  const [isBulkDeleteConfirm, setIsBulkDeleteConfirm] = useState(false);

  // Flexible academic year & weekly rest days controls
  const [showAddYearForm, setShowAddYearForm] = useState(false);
  const [newYearInput, setNewYearInput] = useState('');

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Effect to automatically initialize selected academic year if needed
  React.useEffect(() => {
    const startStr = `${selectedYear}-07-01`;
    const endStr = `${selectedYear + 1}-06-30`;
    const hasExisting = Object.keys(calendarData).some(d => d >= startStr && d <= endStr);
    
    if (!hasExisting) {
      setCalendarData(prev => {
        // Double check in functional update to prevent race conditions
        const hasExistingInner = Object.keys(prev).some(d => d >= startStr && d <= endStr);
        if (hasExistingInner) return prev;

        const updated = { ...prev };
        const years = [selectedYear, selectedYear + 1];
        years.forEach(yr => {
          for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(yr, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
              const dateStr = `${yr}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const dayOfWeek = new Date(yr, m, d).getDay();
              const isRest = weeklyRestDays.includes(dayOfWeek);
              updated[dateStr] = {
                dateString: dateStr,
                type: isRest ? 'WEEKEND' : 'HEB'
              };
            }
          }
        });
        
        // Populate holidays
        const holidays = getNationalHolidays(selectedYear).concat(getNationalHolidays(selectedYear + 1));
        holidays.forEach(h => {
          if (!updated[h.date] || updated[h.date].type === 'HEB' || updated[h.date].type === 'WEEKEND') {
            updated[h.date] = {
              dateString: h.date,
              type: 'LIBUR_NASIONAL',
              activityName: h.name
            };
          }
        });
        return updated;
      });
    }
  }, [selectedYear, weeklyRestDays, setCalendarData]);

  // Method to add custom starting year
  const handleAddNewYear = () => {
    const yr = parseInt(newYearInput, 10);
    if (isNaN(yr) || yr < 2000 || yr > 2100) {
      triggerToast('Masukkan tahun yang valid (2000 - 2100)!', 'error');
      return;
    }
    if (academicYears.includes(yr)) {
      triggerToast(`Tahun Ajaran ${yr}/${yr + 1} sudah terdaftar!`, 'info');
      setSelectedYear(yr);
      setShowAddYearForm(false);
      setNewYearInput('');
      return;
    }
    
    const updatedYears = [...academicYears, yr].sort((a, b) => a - b);
    setAcademicYears(updatedYears);
    setSelectedYear(yr);
    
    setShowAddYearForm(false);
    setNewYearInput('');
    triggerToast(`Tahun Ajaran baru ${yr}/${yr + 1} berhasil ditambahkan & diaktifkan!`, 'success');
  };

  // Method to apply weekend day changes to entire academic year
  const handleApplyRestDays = (newRestDays: number[]) => {
    setWeeklyRestDays(newRestDays);
    
    setCalendarData(prev => {
      const updated = { ...prev };
      const startAcademicDate = `${selectedYear}-07-01`;
      const endAcademicDate = `${selectedYear + 1}-06-30`;
      
      const start = new Date(startAcademicDate);
      const end = new Date(endAcademicDate);
      const curr = new Date(start);
      
      while (curr <= end) {
        const dateStr = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
        const dayOfWeek = curr.getDay();
        const isRest = newRestDays.includes(dayOfWeek);
        
        if (isRest) {
          if (!updated[dateStr]) {
            updated[dateStr] = { dateString: dateStr, type: 'WEEKEND' };
          } else if (updated[dateStr].type === 'HEB') {
            updated[dateStr] = { ...updated[dateStr], type: 'WEEKEND' };
          }
        } else {
          if (!updated[dateStr]) {
            updated[dateStr] = { dateString: dateStr, type: 'HEB' };
          } else if (updated[dateStr].type === 'WEEKEND') {
            updated[dateStr] = { ...updated[dateStr], type: 'HEB' };
          }
        }
        curr.setDate(curr.getDate() + 1);
      }
      return updated;
    });
    
    triggerToast('Pengaturan hari libur mingguan berhasil diterapkan ke seluruh kalender!', 'success');
  };

  const handleUpdateActivity = (originalDate: string, newDate: string, title: string, type: DayType) => {
    if (!newDate) {
      triggerToast('Tanggal kegiatan tidak boleh kosong!', 'error');
      return;
    }
    setCalendarData(prev => {
      const updated = { ...prev };
      
      if (originalDate !== newDate) {
        // 1. Reset original date to default
        const oldDayOfWeek = new Date(originalDate).getDay();
        const oldIsWeekend = oldDayOfWeek === 0 || oldDayOfWeek === 6;
        updated[originalDate] = {
          dateString: originalDate,
          type: oldIsWeekend ? 'WEEKEND' : 'HEB'
        };
        
        // 2. Assign activity to new date
        updated[newDate] = {
          dateString: newDate,
          type: type,
          activityName: title
        };
      } else {
        // Same date, just update existing details
        updated[originalDate] = {
          ...updated[originalDate],
          activityName: title,
          type: type
        };
      }
      return updated;
    });
    setEditingDate(null);
    triggerToast('Kegiatan berhasil diperbarui!', 'success');
  };

  const executeBulkRemoveActivities = () => {
    setCalendarData(prev => {
      const updated = { ...prev };
      selectedDates.forEach(dateStr => {
        const dayOfWeek = new Date(dateStr).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        updated[dateStr] = {
          dateString: dateStr,
          type: isWeekend ? 'WEEKEND' : 'HEB'
        };
      });
      return updated;
    });
    setIsBulkDeleteConfirm(false);
    triggerToast(`Berhasil menghapus ${selectedDates.length} kegiatan terpilih.`, 'info');
    setSelectedDates([]);
  };

  const executeRemoveAllActivities = () => {
    setCalendarData(prev => {
      const updated = { ...prev };
      manualEventsList.forEach(evt => {
        const dayOfWeek = new Date(evt.dateString).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        updated[evt.dateString] = {
          dateString: evt.dateString,
          type: isWeekend ? 'WEEKEND' : 'HEB'
        };
      });
      return updated;
    });
    setIsDeleteAllConfirm(false);
    setSelectedDates([]);
    triggerToast('Seluruh kegiatan manual berhasil dikosongkan.', 'info');
  };

  const handleToggleSelectAll = () => {
    if (selectedDates.length === manualEventsList.length) {
      setSelectedDates([]);
    } else {
      setSelectedDates(manualEventsList.map(evt => evt.dateString));
    }
  };

  const handleToggleSelectDate = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  // Helper to parse date
  const formatDateString = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Get days sequence within a date range
  const getDatesInRange = (start: string, end: string) => {
    const dates: string[] = [];
    const curr = new Date(start);
    const last = new Date(end);
    while (curr <= last) {
      dates.push(formatDateString(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // Manual event insertion (Menu 1)
  const handleAddManualActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim()) {
      triggerToast('Nama kegiatan harus diisi.', 'error');
      return;
    }

    if (entryType === 'single') {
      if (!singleDate) {
        triggerToast('Tanggal harus dipilih.', 'error');
        return;
      }
      setCalendarData(prev => ({
        ...prev,
        [singleDate]: {
          dateString: singleDate,
          type: dayType,
          activityName: activityTitle
        }
      }));
      triggerToast(`Kegiatan "${activityTitle}" berhasil ditambahkan pada tanggal ${singleDate}!`, 'success');
    } else {
      if (!startDate || !endDate) {
        triggerToast('Pilih tanggal awal dan akhir.', 'error');
        return;
      }
      if (startDate > endDate) {
        triggerToast('Tanggal akhir tidak boleh mendahului tanggal awal.', 'error');
        return;
      }
      const range = getDatesInRange(startDate, endDate);
      setCalendarData(prev => {
        const updated = { ...prev };
        range.forEach(dateStr => {
          const dayOfWeek = new Date(dateStr).getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          // If it is an automatic national holiday, do not overwrite unless requested, or keep it.
          if (updated[dateStr]?.type === 'LIBUR_NASIONAL' && dayType !== 'HEB') {
            // Keep national holiday
            return;
          }
          updated[dateStr] = {
            dateString: dateStr,
            type: dayType,
            activityName: activityTitle
          };
        });
        return updated;
      });
      triggerToast(`Kegiatan "${activityTitle}" berhasil ditambahkan untuk rentang ${startDate} s/d ${endDate}!`, 'success');
    }

    // Reset Form
    setActivityTitle('');
    setSingleDate('');
    setStartDate('');
    setEndDate('');
  };

  // Sync Holidays Action
  const handleSyncHolidays = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      const currentHolidays = getNationalHolidays(selectedYear).concat(getNationalHolidays(selectedYear + 1));
      setCalendarData(prev => {
        const updated = { ...prev };
        currentHolidays.forEach(holiday => {
          updated[holiday.date] = {
            dateString: holiday.date,
            type: 'LIBUR_NASIONAL',
            activityName: holiday.name
          };
        });
        return updated;
      });
      setSyncStatus('success');
      triggerToast('Sinkronisasi hari libur nasional berhasil!', 'success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }, 1200);
  };

  // Delete/Restore manual activity
  const handleRemoveActivity = (dateStr: string) => {
    setDeleteTargetDate(dateStr);
  };

  const executeRemoveActivity = (dateStr: string) => {
    setCalendarData(prev => {
      const updated = { ...prev };
      const dayOfWeek = new Date(dateStr).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      updated[dateStr] = {
        dateString: dateStr,
        type: isWeekend ? 'WEEKEND' : 'HEB'
      };
      return updated;
    });
    setDeleteTargetDate(null);
    triggerToast('Kegiatan berhasil dihapus.', 'info');
  };

  // Get detailed day info safely
  const getDayInfo = (dateStr: string): CalendarDay => {
    if (calendarData[dateStr]) {
      return calendarData[dateStr];
    }
    const dayOfWeek = new Date(dateStr).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    return {
      dateString: dateStr,
      type: isWeekend ? 'WEEKEND' : 'HEB'
    };
  };

  // Calculate detailed month stats and weeks for Tab 3 (Analisis Matriks)
  const calculatedMonthMatrix = useMemo(() => {
    return ACADEMIC_MONTH_ORDER.map(monthIdx => {
      const year = monthIdx >= 6 ? selectedYear : selectedYear + 1;
      const totalDays = new Date(year, monthIdx + 1, 0).getDate();
      
      const daysList: { dayNum: number; dateStr: string; info: CalendarDay; dayNameShort: string; dayOfWeek: number }[] = [];
      let hebCount = 0;
      let hekCount = 0;
      let liburNasionalCount = 0;
      let liburSekolahCount = 0;
      let weekendCount = 0;

      // Day of week tallies for HEB
      const hebDayTally = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }; // Mon (1) to Sat (6)

      for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, monthIdx, day).getDay();
        const info = getDayInfo(dateStr);

        daysList.push({
          dayNum: day,
          dateStr,
          info,
          dayNameShort: WEEKDAYS_SHORT[dayOfWeek],
          dayOfWeek
        });

        if (info.type === 'HEB') {
          hebCount++;
          if (dayOfWeek >= 1 && dayOfWeek <= 6) {
            hebDayTally[dayOfWeek as 1 | 2 | 3 | 4 | 5 | 6]++;
          }
        }
        else if (info.type === 'HEK') hekCount++;
        else if (info.type === 'LIBUR_NASIONAL') liburNasionalCount++;
        else if (info.type === 'LIBUR_SEKOLAH') liburSekolahCount++;
        else if (info.type === 'WEEKEND') weekendCount++;
      }

      // Group days into weeks to count Effective Weeks
      // Standard rule: A week is effective if there are at least 3 HEB days in it.
      let effectiveWeeksCount = 0;
      let activityWeeksCount = 0;
      
      let currentWeekHEB = 0;
      let currentWeekHEK = 0;

      for (let i = 0; i < daysList.length; i++) {
        const item = daysList[i];
        if (item.info.type === 'HEB') currentWeekHEB++;
        if (item.info.type === 'HEK') currentWeekHEK++;

        // If it's Sunday or last day of month, evaluate the week and reset counters
        if (item.dayOfWeek === 0 || i === daysList.length - 1) {
          if (currentWeekHEB >= 3) {
            effectiveWeeksCount++;
          } else if (currentWeekHEK >= 3 || (currentWeekHEB + currentWeekHEK >= 3 && currentWeekHEK > currentWeekHEB)) {
            activityWeeksCount++;
          }
          currentWeekHEB = 0;
          currentWeekHEK = 0;
        }
      }

      return {
        monthIndex: monthIdx,
        monthName: MONTHS_INDONESIAN[monthIdx],
        year,
        totalDays,
        daysList,
        hebCount,
        hekCount,
        liburNasionalCount,
        liburSekolahCount,
        weekendCount,
        effectiveWeeksCount,
        activityWeeksCount,
        hebDayTally
      };
    });
  }, [calendarData, selectedYear]);

  // Semester aggregations for Menu 3
  const semesterBreakdown = useMemo(() => {
    // Semester Gasal (Jul - Dec, indices 0-5 in ACADEMIC_MONTH_ORDER)
    const gasalMonths = calculatedMonthMatrix.slice(0, 6);
    // Semester Genap (Jan - Jun, indices 6-11 in ACADEMIC_MONTH_ORDER)
    const genapMonths = calculatedMonthMatrix.slice(6, 12);

    const sumSemester = (monthsList: typeof gasalMonths) => {
      const heb = monthsList.reduce((acc, m) => acc + m.hebCount, 0);
      const hek = monthsList.reduce((acc, m) => acc + m.hekCount, 0);
      const weeks = monthsList.reduce((acc, m) => acc + m.effectiveWeeksCount, 0);
      
      const dayDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      monthsList.forEach(m => {
        Object.keys(dayDistribution).forEach(k => {
          const key = parseInt(k) as 1 | 2 | 3 | 4 | 5 | 6;
          dayDistribution[key] += m.hebDayTally[key];
        });
      });

      return { heb, hek, weeks, dayDistribution };
    };

    const gasalSum = sumSemester(gasalMonths);
    const genapSum = sumSemester(genapMonths);

    return {
      gasal: gasalSum,
      genap: genapSum,
      totalHEB: gasalSum.heb + genapSum.heb,
      totalHEK: gasalSum.hek + genapSum.hek,
      totalWeeks: gasalSum.weeks + genapSum.weeks
    };
  }, [calculatedMonthMatrix]);

  // List of all manual/custom programmed events
  const manualEventsList = useMemo(() => {
    const startAcademicDate = `${selectedYear}-07-01`;
    const endAcademicDate = `${selectedYear + 1}-06-30`;

    return Object.values(calendarData)
      .filter(day => {
        return day.type !== 'WEEKEND' && 
          day.activityName && 
          day.dateString >= startAcademicDate && 
          day.dateString <= endAcademicDate;
      })
      .sort((a, b) => a.dateString.localeCompare(b.dateString));
  }, [calendarData, selectedYear]);

  // Category Configuration styles
  const categoryConfigs: Record<DayType, { label: string; bg: string; text: string; border: string; desc: string; colorCode: string }> = {
    HEB: {
      label: 'Hari Efektif Belajar (HEB)',
      bg: 'bg-emerald-50 hover:bg-emerald-100',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      desc: 'Proses belajar mengajar tatap muka reguler di kelas.',
      colorCode: '#10b981' // emerald
    },
    HEK: {
      label: 'Hari Efektif Kegiatan (HEK)',
      bg: 'bg-amber-50 hover:bg-amber-100',
      text: 'text-amber-700',
      border: 'border-amber-200',
      desc: 'Kegiatan sekolah seperti ujian, MPLS, class meeting, pembagian rapor.',
      colorCode: '#f59e0b' // amber
    },
    LIBUR_NASIONAL: {
      label: 'Libur Nasional',
      bg: 'bg-rose-50 hover:bg-rose-100',
      text: 'text-rose-700',
      border: 'border-rose-200',
      desc: 'Hari libur resmi yang ditetapkan oleh pemerintah RI.',
      colorCode: '#f43f5e' // rose
    },
    LIBUR_SEKOLAH: {
      label: 'Libur Khusus Sekolah',
      bg: 'bg-sky-50 hover:bg-sky-100',
      text: 'text-sky-700',
      border: 'border-sky-200',
      desc: 'Libur semester sekolah, jeda tengah semester, atau cuti bersama internal.',
      colorCode: '#0ea5e9' // sky
    },
    WEEKEND: {
      label: 'Libur Akhir Pekan',
      bg: 'bg-slate-100 hover:bg-slate-200',
      text: 'text-slate-600',
      border: 'border-slate-300',
      desc: 'Hari Sabtu & Minggu (non-efektif rutin).',
      colorCode: '#94a3b8' // slate
    }
  };

  return (
    <>
      <div className="space-y-6 screen-only" id="calendar-view-container">
      {/* Brand & Sync Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-emerald-600" size={24} />
            Kalender Pendidikan & Analisis Hari Efektif
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Program kerja kurikulum otomatis. Input rencana sekolah, singkronkan libur nasional pemerintah, dan unduh laporan efektivitas belajar.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wide">Tahun Ajaran:</span>
            
            {showAddYearForm ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="2000"
                  max="2100"
                  placeholder="Mulai (Contoh: 2029)"
                  value={newYearInput}
                  onChange={(e) => setNewYearInput(e.target.value)}
                  className="w-24 text-xs p-1 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold bg-white text-slate-800"
                />
                <button
                  onClick={handleAddNewYear}
                  className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition cursor-pointer"
                  title="Simpan"
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => setShowAddYearForm(false)}
                  className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-md transition cursor-pointer"
                  title="Batal"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  className="text-xs font-bold p-1 bg-white border border-slate-200 rounded-md text-emerald-700 focus:outline-none cursor-pointer"
                >
                  {academicYears.map(yr => (
                    <option key={yr} value={yr}>
                      {yr}/{yr + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowAddYearForm(true)}
                  className="p-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md text-emerald-600 transition flex items-center justify-center cursor-pointer font-bold"
                  title="Tambah Tahun Ajaran Baru"
                >
                  <Plus size={12} />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={handleSyncHolidays}
            disabled={syncStatus === 'syncing'}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
            {syncStatus === 'syncing' ? 'Sinkronisasi...' : 'Sinkron Libur Nasional'}
          </button>
        </div>
      </div>

      {/* Main Sub-Menu Navigation */}
      <div className="border-b border-slate-200 flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-slate-100">
        <button
          onClick={() => setActiveSubTab(1)}
          className={`flex-1 min-w-[150px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs font-bold transition cursor-pointer
            ${activeSubTab === 1 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <CalendarRange size={16} />
          <span>1. Pengaturan Kegiatan Manual</span>
        </button>

        <button
          onClick={() => setActiveSubTab(2)}
          className={`flex-1 min-w-[150px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs font-bold transition cursor-pointer
            ${activeSubTab === 2 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <Grid size={16} />
          <span>2. Kalender Tahunan Lengkap</span>
        </button>

        <button
          onClick={() => setActiveSubTab(3)}
          className={`flex-1 min-w-[150px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs font-bold transition cursor-pointer
            ${activeSubTab === 3 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <TableProperties size={16} />
          <span>3. Matriks Minggu Efektif (Excel)</span>
        </button>

        <button
          onClick={() => setActiveSubTab(4)}
          className={`flex-1 min-w-[150px] flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg text-xs font-bold transition cursor-pointer
            ${activeSubTab === 4 
              ? 'bg-slate-900 text-white shadow-xs' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
        >
          <FileText size={16} />
          <span>4. Distribusi Detail Bulanan</span>
        </button>
      </div>

      {/* Active Tab Content Rendering */}
      <AnimatePresence mode="wait">
        {/* SUB-TAB 1: FORM PENGATURAN MANUAL & TANGGAL */}
        {activeSubTab === 1 && (
          <motion.div
            key="tab-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Column Stack: Form & Weekly Rest Days Configuration */}
            <div className="space-y-6">
              {/* Form Scheduler Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Plus className="text-emerald-600" size={18} />
                    Plot Kegiatan & Libur Baru
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Sistem otomatis mempertahankan Hari Libur Nasional pemerintah sebagai prioritas.</p>
                </div>

                <form onSubmit={handleAddManualActivity} className="space-y-4">
                  {/* Entry Mode Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Metode Pengisian:</label>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setEntryType('single')}
                        className={`py-1.5 text-xs font-semibold rounded-md transition ${entryType === 'single' ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500'}`}
                      >
                        Tanggal Tunggal
                      </button>
                      <button
                        type="button"
                        onClick={() => setEntryType('range')}
                        className={`py-1.5 text-xs font-semibold rounded-md transition ${entryType === 'range' ? 'bg-white text-slate-800 shadow-xs border border-slate-200' : 'text-slate-500'}`}
                      >
                        Rentang Tanggal
                      </button>
                    </div>
                  </div>

                  {/* Date Inputs */}
                  {entryType === 'single' ? (
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-400 uppercase block">Pilih Tanggal:</label>
                      <input
                        type="date"
                        value={singleDate}
                        onChange={(e) => setSingleDate(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase block">Tanggal Mulai:</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase block">Tanggal Selesai:</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Day Category */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">Kategori Hari:</label>
                    <div className="space-y-1.5">
                      {[
                        { key: 'HEK', label: 'Hari Efektif Kegiatan (HEK)', desc: 'Ujian, MPLS, Upacara', dot: 'bg-amber-500' },
                        { key: 'LIBUR_SEKOLAH', label: 'Libur Khusus Sekolah (LKS)', desc: 'Libur semester, jeda kelas', dot: 'bg-sky-500' },
                        { key: 'HEB', label: 'Hari Efektif Belajar (HEB)', desc: 'Tatap muka / Belajar normal', dot: 'bg-emerald-500' },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setDayType(item.key as DayType)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition cursor-pointer
                            ${dayType === item.key ? 'bg-slate-50 border-slate-900 font-bold' : 'bg-white border-slate-200'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                            <div>
                              <span className="block text-slate-700 font-semibold">{item.label}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{item.desc}</span>
                            </div>
                          </div>
                          {dayType === item.key && <Check size={14} className="text-slate-800 shrink-0" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Event Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase block">Nama Kegiatan / Keterangan:</label>
                    <input
                      type="text"
                      value={activityTitle}
                      onChange={(e) => setActivityTitle(e.target.value)}
                      placeholder="Contoh: MPLS, PAT, Libur Jeda Ganjil"
                      className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:ring-1 focus:ring-emerald-500 focus:outline-none text-slate-800 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-3 rounded-lg shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus size={14} />
                    Simpan Agenda Rencana
                  </button>
                </form>
              </div>

              {/* Weekly Rest Days Configuration Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4" id="weekly-rest-days-config">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Clock className="text-emerald-600" size={18} />
                    Libur Mingguan Rutin
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Atur hari libur akhir pekan rutin (Sistem 5 Hari atau 6 Hari Kerja sekolah).
                  </p>
                </div>

                {/* Quick Presets */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Preset Hari Sekolah:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyRestDays([0, 6])}
                      className={`py-2 px-2.5 text-xs font-semibold rounded-lg border text-center transition cursor-pointer flex flex-col justify-center items-center gap-1
                        ${weeklyRestDays.includes(0) && weeklyRestDays.includes(6) && weeklyRestDays.length === 2
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="block leading-none">5 Hari Sekolah</span>
                      <span className="text-[9px] font-normal text-slate-400 leading-none">Sabtu & Ahad Libur</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyRestDays([0])}
                      className={`py-2 px-2.5 text-xs font-semibold rounded-lg border text-center transition cursor-pointer flex flex-col justify-center items-center gap-1
                        ${weeklyRestDays.includes(0) && !weeklyRestDays.includes(6) && weeklyRestDays.length === 1
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      <span className="block leading-none">6 Hari Sekolah</span>
                      <span className="text-[9px] font-normal text-slate-400 leading-none">Hanya Ahad Libur</span>
                    </button>
                  </div>
                </div>

                {/* Advanced Custom Day Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Hari Libur Mingguan:</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {WEEKDAYS_INDONESIAN.map((dayName, idx) => {
                      const isChecked = weeklyRestDays.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            let updatedRestDays: number[];
                            if (isChecked) {
                              updatedRestDays = weeklyRestDays.filter(d => d !== idx);
                            } else {
                              updatedRestDays = [...weeklyRestDays, idx].sort();
                            }
                            handleApplyRestDays(updatedRestDays);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold text-center border transition cursor-pointer
                            ${isChecked 
                              ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {dayName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* List Registered custom Events */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Daftar Rencana Kegiatan Manual Anda</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Daftar seluruh hari kegiatan yang Anda input secara khusus.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-amber-50 text-amber-700 font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                    {manualEventsList.length} Hari Kustom
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3 py-2 rounded-lg shadow-xs transition cursor-pointer"
                    title="Cetak Daftar Rencana Kegiatan ke PDF"
                  >
                    <Printer size={12} />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>

              {manualEventsList.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 gap-3 text-xs">
                  <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDates.length === manualEventsList.length && manualEventsList.length > 0}
                      onChange={handleToggleSelectAll}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
                    />
                    <span>Pilih Semua ({selectedDates.length} terpilih)</span>
                  </label>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {selectedDates.length > 0 && (
                      <button
                        onClick={() => setIsBulkDeleteConfirm(true)}
                        className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-lg border border-rose-100 transition cursor-pointer text-xs"
                      >
                        <Trash2 size={12} />
                        Hapus Terpilih ({selectedDates.length})
                      </button>
                    )}
                    <button
                      onClick={() => setIsDeleteAllConfirm(true)}
                      className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg transition cursor-pointer text-xs shadow-xs"
                    >
                      <Trash2 size={12} />
                      Hapus Semua
                    </button>
                  </div>
                </div>
              )}

              {manualEventsList.length > 0 ? (
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {manualEventsList.map((evt, idx) => {
                    const isHoliday = evt.type === 'LIBUR_NASIONAL';
                    const isSchoolLibur = evt.type === 'LIBUR_SEKOLAH';
                    const isEditing = editingDate === evt.dateString;
                    const isChecked = selectedDates.includes(evt.dateString);
                    
                    return (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start sm:items-center gap-3 transition">
                        {!isEditing && (
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectDate(evt.dateString)}
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4 mt-1 sm:mt-0 shrink-0"
                          />
                        )}
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold text-slate-500">
                              {new Date(evt.dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0
                              ${isHoliday ? 'bg-rose-100 text-rose-700' : isSchoolLibur ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'}`}>
                              {evt.type === 'HEK' ? 'HEK' : evt.type === 'LIBUR_NASIONAL' ? 'Libur Nasional' : evt.type === 'LIBUR_SEKOLAH' ? 'Libur Sekolah' : 'HEB'}
                            </span>
                          </div>
 
                          {isEditing ? (
                            <div className="space-y-2 mt-2 w-full max-w-md bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Kegiatan:</label>
                                  <input
                                    type="date"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                    className="text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full bg-slate-50 text-slate-800 font-semibold"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Kategori Hari:</label>
                                  <select
                                    value={tempType}
                                    onChange={(e) => setTempType(e.target.value as DayType)}
                                    className="text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full bg-slate-50 text-slate-700 font-semibold"
                                  >
                                    <option value="HEB">Hari Efektif Belajar (HEB)</option>
                                    <option value="HEK">Hari Efektif Kegiatan (HEK)</option>
                                    <option value="LIBUR_NASIONAL">Libur Nasional</option>
                                    <option value="LIBUR_SEKOLAH">Libur Khusus Sekolah</option>
                                    <option value="WEEKEND">Libur Akhir Pekan (WEEKEND)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nama Rencana / Kegiatan:</label>
                                <input
                                  type="text"
                                  value={tempTitle}
                                  onChange={(e) => setTempTitle(e.target.value)}
                                  className="text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full bg-slate-50 text-slate-800 font-semibold"
                                />
                              </div>
                              <div className="flex items-center justify-end gap-1.5 pt-1.5">
                                <button
                                  onClick={() => handleUpdateActivity(evt.dateString, tempDate, tempTitle, tempType)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                                >
                                  <Check size={11} />
                                  Simpan
                                </button>
                                <button
                                  onClick={() => setEditingDate(null)}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                                >
                                  <X size={11} />
                                  Batal
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-800 block truncate">
                              {evt.activityName}
                            </span>
                          )}
                        </div>
 
                        {!isEditing && (
                          <div className="flex items-center gap-1 shrink-0 self-center">
                            <button
                              onClick={() => {
                                setEditingDate(evt.dateString);
                                setTempTitle(evt.activityName || '');
                                setTempType(evt.type);
                                setTempDate(evt.dateString);
                              }}
                              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition cursor-pointer"
                              title="Edit Kegiatan"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => handleRemoveActivity(evt.dateString)}
                              className="p-1.5 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-400 hover:border-rose-200 transition cursor-pointer"
                              title="Hapus / Kembalikan ke HEB"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-slate-400 space-y-3">
                  <Clock size={40} className="mx-auto opacity-30 text-slate-400 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-600">Belum ada kegiatan manual yang terdaftar.</p>
                    <p className="text-[11px] leading-relaxed max-w-sm mx-auto">Silakan gunakan form di sebelah kiri untuk memplot rentang tanggal kegiatan (seperti ujian akhir) atau libur khusus sekolah.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 2: FULL YEAR ACADEMIC CALENDAR (JULI - JUNI) */}
        {activeSubTab === 2 && (
          <motion.div
            key="tab-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Quick overview of color indices */}
            <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-xs font-bold text-slate-500">Legend Warna Kalender:</span>
                <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> HEB</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> HEK</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Libur Nasional</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Libur Sekolah</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Weekend</span>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-xs transition cursor-pointer"
                title="Cetak Poster Kalender Akademik 12 Bulan ke PDF"
              >
                <Printer size={14} />
                <span>Cetak / Ekspor PDF (A4)</span>
              </button>
            </div>

            {/* 12 Months Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {ACADEMIC_MONTH_ORDER.map((monthIdx) => {
                const year = monthIdx >= 6 ? selectedYear : selectedYear + 1;
                const totalDays = new Date(year, monthIdx + 1, 0).getDate();
                const firstDayWeekday = new Date(year, monthIdx, 1).getDay();

                const gridCells: { dateString: string | null; dayNum: number | null }[] = [];
                for (let i = 0; i < firstDayWeekday; i++) {
                  gridCells.push({ dateString: null, dayNum: null });
                }
                for (let d = 1; d <= totalDays; d++) {
                  gridCells.push({
                    dateString: `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
                    dayNum: d
                  });
                }

                // Month Stats
                let HEB = 0, HEK = 0, Libur = 0;
                gridCells.forEach(c => {
                  if (c.dateString) {
                    const info = getDayInfo(c.dateString);
                    if (info.type === 'HEB') HEB++;
                    else if (info.type === 'HEK') HEK++;
                    else if (info.type === 'LIBUR_NASIONAL' || info.type === 'LIBUR_SEKOLAH') Libur++;
                  }
                });

                return (
                  <div key={monthIdx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wide">
                        {MONTHS_INDONESIAN[monthIdx]} {year}
                      </span>
                      <span className="text-[9px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
                        {monthIdx >= 6 ? 'S1 Ganjil' : 'S2 Genap'}
                      </span>
                    </div>

                    {/* Simple weekdays header */}
                    <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-slate-400">
                      <div>Mg</div>
                      <div>Sn</div>
                      <div>Sl</div>
                      <div>Rb</div>
                      <div>Km</div>
                      <div>Jm</div>
                      <div>Sb</div>
                    </div>

                    {/* Small grid of days */}
                    <div className="grid grid-cols-7 gap-1">
                      {gridCells.map((cell, idx) => {
                        if (!cell.dateString || !cell.dayNum) {
                          return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/20" />;
                        }

                        const dayInfo = getDayInfo(cell.dateString);
                        let bgClass = '';
                        if (dayInfo.type === 'HEB') bgClass = 'bg-emerald-500 text-white font-medium';
                        else if (dayInfo.type === 'HEK') bgClass = 'bg-amber-500 text-slate-900 font-bold';
                        else if (dayInfo.type === 'LIBUR_NASIONAL') bgClass = 'bg-rose-500 text-white font-bold';
                        else if (dayInfo.type === 'LIBUR_SEKOLAH') bgClass = 'bg-sky-500 text-white font-semibold';
                        else bgClass = 'bg-slate-100 text-slate-400';

                        return (
                          <div
                            key={cell.dateString}
                            title={dayInfo.activityName ? `${cell.dayNum}: ${dayInfo.activityName}` : `${cell.dayNum} - ${dayInfo.type}`}
                            className={`aspect-square flex items-center justify-center text-[9px] rounded-md transition hover:scale-105 cursor-help ${bgClass}`}
                          >
                            {cell.dayNum}
                          </div>
                        );
                      })}
                    </div>

                    {/* Stats footer for each month */}
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase pt-1 border-t border-slate-50">
                      <span>HEB: <span className="text-emerald-600">{HEB}</span></span>
                      <span>HEK: <span className="text-amber-600">{HEK}</span></span>
                      <span>Libur: <span className="text-rose-500">{Libur}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 3: DIGITAL MATRIX ANALYSIS - INDONESIAN EDUCATION SPREADSHEET */}
        {activeSubTab === 3 && (
          <motion.div
            key="tab-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header description of spreadsheet formatting */}
            <div className="bg-amber-50/55 p-4 rounded-xl border border-amber-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs leading-relaxed text-amber-800">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-900 text-sm">Format Matrix Analisis Terintegrasi</p>
                  <p className="mt-0.5">Rincian analisis minggu efektif belajar dihitung otomatis dari penanggalan kalender pendidikan. Seluruh sel menunjukkan kode hari beserta status warnanya.</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-3 py-1.5 rounded-lg whitespace-nowrap">
                  Sesuai Format Rencana KBM
                </span>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-lg shadow-xs transition cursor-pointer"
                  title="Cetak Laporan ke PDF Ukuran A4"
                >
                  <Printer size={14} />
                  <span>Cetak / Ekspor PDF (A4)</span>
                </button>
              </div>
            </div>

            {/* Matrix spreadsheet wrapper */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[1200px]" id="academic-matrix-spreadsheet">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] font-bold text-center border-b border-slate-800">
                      <th className="p-2 border-r border-slate-800 text-left min-w-[120px]" rowSpan={2}>BULAN / TAHUN</th>
                      <th className="p-1 border-b border-r border-slate-800" colSpan={31}>TANGGAL</th>
                      <th className="p-1.5 border-r border-slate-800 text-[10px] uppercase leading-tight min-w-[70px]" rowSpan={2}>JML MGG BELAJAR EFEKTIF</th>
                      <th className="p-1.5 border-r border-slate-800 text-[10px] uppercase leading-tight min-w-[70px]" rowSpan={2}>JML HARI BELAJAR EFEKTIF</th>
                      <th className="p-1 border-r border-slate-800" colSpan={6}>DISTRIBUSI HARI BELAJAR EFEKTIF</th>
                      <th className="p-1 border-r border-slate-800 text-[10px] uppercase leading-tight" rowSpan={2}>HARI KAL.</th>
                      <th className="p-1 border-r border-slate-800" colSpan={3}>JML HARI LIBUR</th>
                      <th className="p-1 border-r border-slate-800 text-[10px] uppercase leading-tight min-w-[70px]" rowSpan={2}>MINGGU EFEKTIF KEGIATAN</th>
                      <th className="p-1 text-[10px] uppercase leading-tight min-w-[70px]" rowSpan={2}>JML HARI EFEKTIF KEGIATAN</th>
                    </tr>
                    <tr className="bg-slate-800 text-slate-200 text-[10px] font-bold text-center border-b border-slate-700">
                      {/* Dates 1 to 31 */}
                      {Array.from({ length: 31 }).map((_, i) => (
                        <th key={i} className="p-1 border-r border-slate-700 w-[24px]">{i + 1}</th>
                      ))}
                      {/* Days Distribution */}
                      <th className="p-1 border-r border-slate-700 w-[28px]">Sen</th>
                      <th className="p-1 border-r border-slate-700 w-[28px]">Sel</th>
                      <th className="p-1 border-r border-slate-700 w-[28px]">Rab</th>
                      <th className="p-1 border-r border-slate-700 w-[28px]">Kam</th>
                      <th className="p-1 border-r border-slate-700 w-[28px]">Jum</th>
                      <th className="p-1 border-r border-slate-700 w-[28px]">Sab</th>
                      {/* Holidays */}
                      <th className="p-1 border-r border-slate-700 w-[30px]">Ahad</th>
                      <th className="p-1 border-r border-slate-700 w-[45px]">Nasional/Sekolah</th>
                      <th className="p-1 border-r border-slate-700 w-[30px]">Jml</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-100 text-center text-[10px]">
                    {calculatedMonthMatrix.map((row, rIdx) => {
                      return (
                        <tr key={rIdx} className="hover:bg-slate-50/60 font-semibold text-slate-700">
                          {/* Month Name */}
                          <td className="p-2 text-left border-r border-slate-200 font-extrabold text-slate-800 uppercase bg-slate-50">
                            {row.monthName} <span className="text-[9px] font-normal text-slate-400 block">{row.year}</span>
                          </td>

                          {/* 1 to 31 strip with short day abbreviations (colored) */}
                          {Array.from({ length: 31 }).map((_, dIdx) => {
                            const dayNum = dIdx + 1;
                            const dayItem = row.daysList.find(d => d.dayNum === dayNum);
                            
                            if (!dayItem) {
                              return <td key={dIdx} className="p-1 border-r border-slate-100 bg-slate-900 text-slate-900">#</td>;
                            }

                            const type = dayItem.info.type;
                            let cellBg = '';
                            let textClass = 'text-slate-800';

                            if (type === 'HEB') {
                              cellBg = 'bg-emerald-500 text-white';
                            } else if (type === 'HEK') {
                              cellBg = 'bg-amber-400 text-slate-900 font-black';
                            } else if (type === 'LIBUR_NASIONAL') {
                              cellBg = 'bg-rose-500 text-white font-black';
                            } else if (type === 'LIBUR_SEKOLAH') {
                              cellBg = 'bg-sky-400 text-white';
                            } else if (type === 'WEEKEND') {
                              cellBg = 'bg-slate-100 text-slate-400';
                            }

                            return (
                              <td
                                key={dIdx}
                                className={`p-1 border-r border-slate-100 font-bold transition hover:scale-105 cursor-help ${cellBg} ${textClass}`}
                                title={dayItem.info.activityName ? `${dayNum} ${row.monthName}: ${dayItem.info.activityName}` : undefined}
                              >
                                {dayItem.dayNameShort.toLowerCase()}
                              </td>
                            );
                          })}

                          {/* Effective Weeks Count */}
                          <td className="p-2 border-r border-slate-200 font-black text-slate-800 bg-emerald-50/10">
                            {row.effectiveWeeksCount} MG
                          </td>

                          {/* Effective Days Count */}
                          <td className="p-2 border-r border-slate-200 font-black text-emerald-700 bg-emerald-50/20">
                            {row.hebCount} Hr
                          </td>

                          {/* Daily distribution counters */}
                          <td className="p-1 border-r border-slate-150 text-slate-600">{row.hebDayTally[1]}</td>
                          <td className="p-1 border-r border-slate-150 text-slate-600">{row.hebDayTally[2]}</td>
                          <td className="p-1 border-r border-slate-150 text-slate-600">{row.hebDayTally[3]}</td>
                          <td className="p-1 border-r border-slate-150 text-slate-600">{row.hebDayTally[4]}</td>
                          <td className="p-1 border-r border-slate-150 text-slate-600">{row.hebDayTally[5]}</td>
                          <td className="p-1 border-r border-slate-200 text-slate-600">{row.hebDayTally[6]}</td>

                          {/* Calendar Days total */}
                          <td className="p-2 border-r border-slate-200 text-slate-500">{row.totalDays}</td>

                          {/* Libur tallies */}
                          <td className="p-1 border-r border-slate-150 text-slate-500">{row.weekendCount}</td>
                          <td className="p-1 border-r border-slate-150 text-rose-600">{row.liburNasionalCount + row.liburSekolahCount}</td>
                          <td className="p-1 border-r border-slate-200 font-bold text-slate-700 bg-rose-50/10">
                            {row.weekendCount + row.liburNasionalCount + row.liburSekolahCount}
                          </td>

                          {/* Activity Weeks & Activity Days */}
                          <td className="p-2 border-r border-slate-200 font-black text-slate-800 bg-amber-50/10">
                            {row.activityWeeksCount} MG
                          </td>
                          <td className="p-2 font-black text-amber-700 bg-amber-50/20">
                            {row.hekCount} Hr
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Summary: Rencana Jumlah Hari & Minggu Pembelajaran Efektif (matching Excel) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-2">
                <FileSpreadsheet className="text-emerald-600" size={16} />
                Rencana Jumlah Hari dan Minggu Pembelajaran Efektif (TP {selectedYear}/{selectedYear + 1})
              </h3>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Gasal & Genap Table */}
                <div className="xl:col-span-2 border border-slate-100 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                        <th className="p-3.5">SEMESTER</th>
                        <th className="p-3.5">PERIODE BULAN</th>
                        <th className="p-3.5 text-center">HARI KBM EFEKTIF</th>
                        <th className="p-3.5 text-center">MINGGU EFEKTIF</th>
                        <th className="p-3.5 text-center">HARI KEGIATAN (HEK)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                      <tr>
                        <td className="p-3.5 font-bold text-slate-800">GASAL (I)</td>
                        <td className="p-3.5 text-slate-500">Juli s/d Desember {selectedYear}</td>
                        <td className="p-3.5 text-center text-emerald-700 bg-emerald-50/10 font-bold">{semesterBreakdown.gasal.heb} Hari</td>
                        <td className="p-3.5 text-center font-bold">{semesterBreakdown.gasal.weeks} Minggu</td>
                        <td className="p-3.5 text-center text-amber-700 bg-amber-50/10 font-bold">{semesterBreakdown.gasal.hek} Hari</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-bold text-slate-800">GENAP (II)</td>
                        <td className="p-3.5 text-slate-500">Januari s/d Juni {selectedYear + 1}</td>
                        <td className="p-3.5 text-center text-emerald-700 bg-emerald-50/10 font-bold">{semesterBreakdown.genap.heb} Hari</td>
                        <td className="p-3.5 text-center font-bold">{semesterBreakdown.genap.weeks} Minggu</td>
                        <td className="p-3.5 text-center text-amber-700 bg-amber-50/10 font-bold">{semesterBreakdown.genap.hek} Hari</td>
                      </tr>
                      <tr className="bg-slate-900 text-white font-extrabold text-sm border-t-2 border-slate-800">
                        <td className="p-4" colSpan={2}>JUMLAH AKHIR TAHUN PELAJARAN</td>
                        <td className="p-4 text-center text-emerald-400">{semesterBreakdown.totalHEB} Hari</td>
                        <td className="p-4 text-center">{semesterBreakdown.totalWeeks} Minggu</td>
                        <td className="p-4 text-center text-amber-400">{semesterBreakdown.totalHEK} Hari</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Day Allocation distribution breakdown */}
                <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wide block">Tally Distribusi Hari Belajar Efektif</span>
                    <span className="text-xs text-slate-500 block mt-0.5">Membantu guru menyusun porsi pertemuan RPP / Rencana Modul Ajar</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-semibold">Senin Efektif</span>
                      <span className="font-bold text-slate-800">
                        {semesterBreakdown.gasal.dayDistribution[1] + semesterBreakdown.genap.dayDistribution[1]} Hari
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-semibold">Selasa Efektif</span>
                      <span className="font-bold text-slate-800">
                        {semesterBreakdown.gasal.dayDistribution[2] + semesterBreakdown.genap.dayDistribution[2]} Hari
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-semibold">Rabu Efektif</span>
                      <span className="font-bold text-slate-800">
                        {semesterBreakdown.gasal.dayDistribution[3] + semesterBreakdown.genap.dayDistribution[3]} Hari
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-semibold">Kamis Efektif</span>
                      <span className="font-bold text-slate-800">
                        {semesterBreakdown.gasal.dayDistribution[4] + semesterBreakdown.genap.dayDistribution[4]} Hari
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-600 font-semibold">Jumat Efektif</span>
                      <span className="font-bold text-slate-800">
                        {semesterBreakdown.gasal.dayDistribution[5] + semesterBreakdown.genap.dayDistribution[5]} Hari
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-600 font-semibold">Sabtu Efektif</span>
                      <span className="font-bold text-slate-800">
                        {semesterBreakdown.gasal.dayDistribution[6] + semesterBreakdown.genap.dayDistribution[6]} Hari
                      </span>
                    </div>
                  </div>

                  <div className="bg-emerald-600 text-white rounded-lg p-2 text-[10px] text-center font-bold">
                    Penyusunan RPP Otomatis Terdukung
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* SUB-TAB 4: DISTRIBUSI DETAIL BULANAN (HEB, HEK, LIBUR) */}
        {activeSubTab === 4 && (
          <motion.div
            key="tab-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header & Controls bar */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <FileText size={18} className="text-emerald-600" />
                  Distribusi Detail Bulanan (HEB, HEK, Libur)
                </h3>
                <p className="text-xs text-slate-500 mt-1">Data rincian jumlah hari efektif per bulan secara lengkap pada Tahun Pelajaran {selectedYear}/{selectedYear + 1}.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Printer size={15} />
                  Cetak / PDF
                </button>
              </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                      <th className="p-4">Bulan</th>
                      <th className="p-4">Tahun</th>
                      <th className="p-4">Total Kalender</th>
                      <th className="p-4 text-emerald-700">Efektif Belajar (HEB)</th>
                      <th className="p-4 text-amber-700">Kegiatan (HEK)</th>
                      <th className="p-4 text-rose-700">Libur Nasional</th>
                      <th className="p-4 text-sky-700">Libur Sekolah</th>
                      <th className="p-4">Akhir Pekan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700">
                    {calculatedMonthMatrix.map((stat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-4 font-bold text-slate-800">{stat.monthName}</td>
                        <td className="p-4 text-slate-500">{stat.year}</td>
                        <td className="p-4 font-semibold text-slate-500">{stat.totalDays} Hari</td>
                        <td className="p-4 font-bold text-emerald-600 bg-emerald-50/10">{stat.hebCount} Hari</td>
                        <td className="p-4 font-bold text-amber-600 bg-amber-50/10">{stat.hekCount} Hari</td>
                        <td className="p-4 font-bold text-rose-600 bg-rose-50/10">{stat.liburNasionalCount} Hari</td>
                        <td className="p-4 font-bold text-sky-600 bg-sky-50/10">{stat.liburSekolahCount} Hari</td>
                        <td className="p-4 text-slate-500">{stat.weekendCount} Hari</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold bg-slate-900 text-white border-slate-800"
          >
            <Check className="text-emerald-400 w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modals */}
      <AnimatePresence>
        {/* Delete Single Activity Confirmation */}
        {deleteTargetDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetDate(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-slate-100 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Hapus Kegiatan?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus kegiatan pada <span className="font-bold text-slate-700">
                    {(() => {
                      try {
                        return new Date(deleteTargetDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      } catch {
                        return deleteTargetDate;
                      }
                    })()}
                  </span> dan mengembalikannya ke hari biasa reguler?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setDeleteTargetDate(null)}
                  className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={() => executeRemoveActivity(deleteTargetDate)}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete Selected (Bulk) Confirmation */}
        {isBulkDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-slate-100 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Hapus Kegiatan Terpilih?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <span className="font-bold text-rose-600">{selectedDates.length} kegiatan kustom</span> yang dipilih dan mengembalikannya ke Hari Efektif Belajar biasa?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setIsBulkDeleteConfirm(false)}
                  className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={executeBulkRemoveActivities}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Ya, Hapus Terpilih
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Delete All Confirmation */}
        {isDeleteAllConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteAllConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border border-slate-100 space-y-4 text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600 ring-4 ring-rose-50">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Hapus Seluruh Kegiatan Manual?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tindakan ini akan menghapus <span className="font-bold text-rose-600">seluruh ({manualEventsList.length}) kegiatan manual</span> kustom Anda pada tahun ajaran ini. Libur nasional dan weekend bawaan akan tetap dipertahankan. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setIsDeleteAllConfirm(false)}
                  className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={executeRemoveAllActivities}
                  className="py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Ya, Hapus Semua
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>

      {/* ========================================== */}
      {/* PRINT-ONLY SECURE PRECISE A4 SHEET TEMPLATE */}
      {/* ========================================== */}
      
      {/* 1. PRINT TEMPLATE FOR SUB-TAB 1: DAFTAR KEGIATAN MANUAL */}
      {activeSubTab === 1 && (
        <div className="print-only w-full bg-white text-black p-2 font-sans" id="academic-activities-print-area">
          {/* Document Header (Kop Dokumen Resmi) */}
          <div className="text-center space-y-1 mb-3 border-b-2 border-double border-black pb-2">
            <h1 className="text-xs font-black tracking-wider uppercase leading-none text-slate-900">
              DAFTAR PROGRAM &amp; RENCANA KEGIATAN KHUSUS SEKOLAH
            </h1>
            <h2 className="text-sm font-black uppercase leading-tight text-slate-900">
              {schoolName.toUpperCase()}
            </h2>
            <p className="text-[9px] font-bold text-slate-700 tracking-wide leading-none">
              Tahun Pelajaran: {selectedYear}/{selectedYear + 1} | Lampiran Kalender Pendidikan Resmi
            </p>
          </div>

          {/* Table of Manual Activities */}
          {manualEventsList.length > 0 ? (
            <div className="border border-black overflow-hidden mb-3">
              <table className="w-full text-left text-[8px] border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-black font-black border-b border-black text-center uppercase">
                    <th className="p-1 border-r border-black w-[40px] text-center">NO</th>
                    <th className="p-1 border-r border-black w-[150px] text-left">HARI &amp; TANGGAL</th>
                    <th className="p-1 border-r border-black text-left">NAMA KEGIATAN / ACARA</th>
                    <th className="p-1 border-r border-black w-[120px] text-center">KATEGORI HARI</th>
                    <th className="p-1 w-[120px] text-center">KETERANGAN</th>
                  </tr>
                </thead>
                <tbody>
                  {manualEventsList.map((evt, idx) => {
                    return (
                      <tr key={idx} className="border-b border-black font-medium">
                        <td className="p-1 text-center border-r border-black">{idx + 1}</td>
                        <td className="p-1 border-r border-black text-left">
                          {new Date(evt.dateString).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="p-1 border-r border-black text-left font-bold">{evt.activityName}</td>
                        <td className="p-1 border-r border-black text-center font-bold">
                          {evt.type === 'HEK' ? 'HEK (Efektif Kegiatan)' : evt.type === 'LIBUR_NASIONAL' ? 'Libur Nasional' : evt.type === 'LIBUR_SEKOLAH' ? 'Libur Sekolah' : 'HEB (Efektif Belajar)'}
                        </td>
                        <td className="p-1 text-center text-[7.5px] text-slate-600">
                          {evt.type === 'LIBUR_NASIONAL' ? 'Hari Libur Resmi RI' : 'Sesuai Agenda Kurikulum'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 mb-3">
              Tidak ada kegiatan manual khusus sekolah yang terdaftar pada tahun ajaran ini.
            </div>
          )}

          {/* Formal signature block */}
          <div className="border border-black p-2 bg-slate-50/10 rounded page-break-avoid mt-4">
            <div className="grid grid-cols-2 gap-2 text-[7.5px] font-bold text-center">
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <span className="block">Mengetahui,</span>
                  <span className="block uppercase text-[7px]">Kepala Sekolah / Madrasah</span>
                </div>
                <div className="space-y-0.5 mt-16">
                  <span className="font-black underline block leading-none">{principalName || '..........................................'}</span>
                  <span className="text-slate-500 text-[6.5px] block leading-none">NIP. {principalNip || '.....................................'}</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <span className="block font-normal text-[7px] text-slate-600">{signaturePlace || 'Cibungur'}, {signatureDate || '....................'}</span>
                  <span className="block uppercase text-[7px]">Guru Pengampu</span>
                </div>
                <div className="space-y-0.5 mt-16">
                  <span className="font-black underline block leading-none">{teacherName || '..........................................'}</span>
                  <span className="text-slate-500 text-[6.5px] block leading-none">NIP. {teacherNip || '.....................................'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRINT TEMPLATE FOR SUB-TAB 2: KALENDER TAHUNAN LENGKAP */}
      {activeSubTab === 2 && (
        <div className="print-only w-full bg-white text-black p-2 font-sans" id="academic-calendar-print-area">
          {/* Document Header (Kop Dokumen Resmi) */}
          <div className="text-center space-y-1 mb-3 border-b-2 border-double border-black pb-2">
            <h1 className="text-xs font-black tracking-wider uppercase leading-none text-slate-900">
              KALENDER AKADEMIK TAHUNAN JALUR UTAMA
            </h1>
            <h2 className="text-sm font-black uppercase leading-tight text-slate-900">
              {schoolName.toUpperCase()}
            </h2>
            <p className="text-[9px] font-bold text-slate-700 tracking-wide leading-none">
              Tahun Pelajaran: {selectedYear}/{selectedYear + 1} | Distribusi Alokasi Hari Belajar &amp; Libur Lengkap
            </p>
          </div>

          {/* Grid of 12 Months (4 columns x 3 rows) */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {ACADEMIC_MONTH_ORDER.map((monthIdx) => {
              const year = monthIdx >= 6 ? selectedYear : selectedYear + 1;
              const totalDays = new Date(year, monthIdx + 1, 0).getDate();
              const firstDayWeekday = new Date(year, monthIdx, 1).getDay();

              const gridCells: { dateString: string | null; dayNum: number | null }[] = [];
              for (let i = 0; i < firstDayWeekday; i++) {
                gridCells.push({ dateString: null, dayNum: null });
              }
              for (let d = 1; d <= totalDays; d++) {
                gridCells.push({
                  dateString: `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
                  dayNum: d
                });
              }

              // Count totals for print stats footer
              let HEB = 0, HEK = 0, Libur = 0;
              gridCells.forEach(c => {
                if (c.dateString) {
                  const info = getDayInfo(c.dateString);
                  if (info.type === 'HEB') HEB++;
                  else if (info.type === 'HEK') HEK++;
                  else if (info.type === 'LIBUR_NASIONAL' || info.type === 'LIBUR_SEKOLAH') Libur++;
                }
              });

              return (
                <div key={monthIdx} className="border border-black p-1.5 bg-white space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-black pb-0.5 mb-1">
                      <span className="text-[7.5px] font-black uppercase tracking-wide">
                        {MONTHS_INDONESIAN[monthIdx]} {year}
                      </span>
                      <span className="text-[6px] font-bold uppercase">
                        {monthIdx >= 6 ? 'Gasal' : 'Genap'}
                      </span>
                    </div>

                    {/* Weekdays row */}
                    <div className="grid grid-cols-7 gap-0.5 text-center text-[6px] font-bold text-slate-500 mb-0.5">
                      <div>Mg</div>
                      <div>Sn</div>
                      <div>Sl</div>
                      <div>Rb</div>
                      <div>Km</div>
                      <div>Jm</div>
                      <div>Sb</div>
                    </div>

                    {/* Small grid of days */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {gridCells.map((cell, idx) => {
                        if (!cell.dateString || !cell.dayNum) {
                          return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/20" />;
                        }

                        const dayInfo = getDayInfo(cell.dateString);
                        let bgClass = '';
                        let textClass = 'text-black';
                        
                        if (dayInfo.type === 'HEB') {
                          bgClass = 'bg-emerald-500 text-white font-bold';
                        } else if (dayInfo.type === 'HEK') {
                          bgClass = 'bg-amber-400 text-black font-extrabold';
                        } else if (dayInfo.type === 'LIBUR_NASIONAL') {
                          bgClass = 'bg-rose-500 text-white font-bold';
                        } else if (dayInfo.type === 'LIBUR_SEKOLAH') {
                          bgClass = 'bg-sky-400 text-white font-bold';
                        } else {
                          bgClass = 'bg-slate-100 text-slate-400 font-medium';
                        }

                        return (
                          <div
                            key={cell.dateString}
                            className={`aspect-square flex items-center justify-center text-[6.5px] rounded-xs ${bgClass} ${textClass}`}
                          >
                            {cell.dayNum}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Monthly totals footer */}
                  <div className="flex justify-between items-center text-[6px] font-bold text-slate-500 border-t border-slate-300 pt-0.5">
                    <span>HEB:{HEB}</span>
                    <span>HEK:{HEK}</span>
                    <span>Lbr:{Libur}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Index & Summary */}
          <div className="grid grid-cols-12 gap-2 mt-2 page-break-avoid">
            {/* Color Legend */}
            <div className="col-span-4 border border-black p-1 bg-slate-50 flex items-center justify-around text-[6.5px] font-bold">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> HEB</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> HEK</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full" /> Libur Nas</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-sky-400 rounded-full" /> Libur Sek</span>
            </div>

            {/* Recapitulation total counts */}
            <div className="col-span-4 border border-black p-1 bg-slate-50 flex items-center justify-around text-[7px] font-black text-slate-900">
              <span>TOTAL HEB: {semesterBreakdown.totalHEB} Hari</span>
              <span>TOTAL HEK: {semesterBreakdown.totalHEK} Hari</span>
              <span>TOTAL MINGGU: {semesterBreakdown.totalWeeks} Mgg</span>
            </div>

            {/* Formal signature block */}
            <div className="col-span-4 border border-black p-1.5 text-[6.5px] font-bold text-center flex flex-col justify-between min-h-[90px]">
              <div className="flex justify-between text-[5.5px] text-slate-500 font-normal border-b border-dashed border-slate-200 pb-0.5 mb-1">
                <span>Mengetahui,</span>
                <span>{signaturePlace || 'Cibungur'}, {signatureDate || '....................'}</span>
              </div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <div className="flex flex-col justify-between">
                  <span className="block text-slate-700 uppercase text-[5.5px]">Kepala Madrasah</span>
                  <div className="mt-10">
                    <span className="font-extrabold underline block leading-none">{principalName || '........................'}</span>
                    <span className="text-slate-500 text-[5px] block leading-none mt-0.5">NIP. {principalNip || '.....................'}</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <span className="block text-slate-700 uppercase text-[5.5px]">Guru Pengampu</span>
                  <div className="mt-10">
                    <span className="font-extrabold underline block leading-none">{teacherName || '........................'}</span>
                    <span className="text-slate-500 text-[5px] block leading-none mt-0.5">NIP. {teacherNip || '.....................'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRINT TEMPLATE FOR SUB-TAB 3: EXCEL-STYLE ANALYSIS MATRIX */}
      {activeSubTab === 3 && (
        <div className="print-only w-full bg-white text-black p-2 font-sans" id="academic-matrix-print-area">
          {/* Document Header (Kop Dokumen Resmi) */}
          <div className="text-center space-y-1 mb-3 border-b-2 border-double border-black pb-2">
            <h1 className="text-xs font-black tracking-wider uppercase leading-none text-slate-900">
              ANALISIS MINGGU EFEKTIF &amp; MATRIKS HARI BELAJAR EFEKTIF
            </h1>
            <h2 className="text-sm font-black uppercase leading-tight text-slate-900">
              {schoolName.toUpperCase()}
            </h2>
            <p className="text-[9px] font-bold text-slate-700 tracking-wide leading-none">
              Tahun Pelajaran: {selectedYear}/{selectedYear + 1} | Format Rencana KBM Resmi Kurikulum
            </p>
          </div>

          {/* Matrix Spreadsheet Table */}
          <div className="border border-black overflow-hidden mb-3">
            <table className="w-full text-center text-[7.5px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-black font-black text-[7.5px] border-b border-black">
                  <th className="p-1 border border-black text-left" rowSpan={2}>BULAN / TAHUN</th>
                  <th className="p-0.5 border border-black" colSpan={31}>TANGGAL</th>
                  <th className="p-0.5 border border-black text-[6.5px] uppercase leading-tight" rowSpan={2}>JML MGG EFEKTIF</th>
                  <th className="p-0.5 border border-black text-[6.5px] uppercase leading-tight" rowSpan={2}>JML HARI EFEKTIF</th>
                  <th className="p-0.5 border border-black text-[6.5px]" colSpan={6}>DISTRIBUSI HARI BELAJAR EFEKTIF</th>
                  <th className="p-0.5 border border-black text-[6.5px] uppercase leading-tight" rowSpan={2}>HARI KAL.</th>
                  <th className="p-0.5 border border-black text-[6.5px]" colSpan={3}>JML HARI LIBUR</th>
                  <th className="p-0.5 border border-black text-[6.5px] uppercase leading-tight" rowSpan={2}>MINGGU EFEKTIF KEG.</th>
                  <th className="p-0.5 border border-black text-[6.5px] uppercase leading-tight text-right pr-0.5" rowSpan={2}>HARI EFEKTIF KEG.</th>
                </tr>
                <tr className="bg-slate-50 text-black font-bold text-[6.5px] border-b border-black">
                  {/* Dates 1 to 31 */}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <th key={i} className="p-0.5 border border-black w-[15px]">{i + 1}</th>
                  ))}
                  {/* Days Distribution */}
                  <th className="p-0.5 border border-black w-[16px]">Sen</th>
                  <th className="p-0.5 border border-black w-[16px]">Sel</th>
                  <th className="p-0.5 border border-black w-[16px]">Rab</th>
                  <th className="p-0.5 border border-black w-[16px]">Kam</th>
                  <th className="p-0.5 border border-black w-[16px]">Jum</th>
                  <th className="p-0.5 border border-black w-[16px]">Sab</th>
                  {/* Holidays */}
                  <th className="p-0.5 border border-black w-[16px]">Ahd</th>
                  <th className="p-0.5 border border-black w-[35px]">Nas/Sek</th>
                  <th className="p-0.5 border border-black w-[16px]">Jml</th>
                </tr>
              </thead>
              <tbody>
                {calculatedMonthMatrix.map((row, rIdx) => {
                  return (
                    <tr key={rIdx} className="font-semibold text-black border-b border-black">
                      {/* Month Name */}
                      <td className="p-1 text-left border border-black font-black uppercase text-[7.5px] bg-slate-50">
                        {row.monthName} {row.year}
                      </td>

                      {/* 1 to 31 strip */}
                      {Array.from({ length: 31 }).map((_, dIdx) => {
                        const dayNum = dIdx + 1;
                        const dayItem = row.daysList.find(d => d.dayNum === dayNum);
                        
                        if (!dayItem) {
                          return <td key={dIdx} className="p-0.5 border border-black bg-slate-900 text-slate-900 text-[6px]">#</td>;
                        }

                        const type = dayItem.info.type;
                        let cellBg = '';
                        let textClass = 'text-black';

                        if (type === 'HEB') {
                          cellBg = 'bg-emerald-500 text-white';
                        } else if (type === 'HEK') {
                          cellBg = 'bg-amber-400 text-black font-extrabold';
                        } else if (type === 'LIBUR_NASIONAL') {
                          cellBg = 'bg-rose-500 text-white font-extrabold';
                        } else if (type === 'LIBUR_SEKOLAH') {
                          cellBg = 'bg-sky-400 text-white';
                        } else if (type === 'WEEKEND') {
                          cellBg = 'bg-slate-100 text-slate-400';
                        }

                        return (
                          <td
                            key={dIdx}
                            className={`p-0.5 border border-black text-[6.5px] font-bold ${cellBg} ${textClass}`}
                          >
                            {dayItem.dayNameShort.toLowerCase()}
                          </td>
                        );
                      })}

                      {/* Effective Weeks Count */}
                      <td className="p-0.5 border border-black font-black bg-emerald-50">
                        {row.effectiveWeeksCount}
                      </td>

                      {/* Effective Days Count */}
                      <td className="p-0.5 border border-black font-black text-emerald-800 bg-emerald-50">
                        {row.hebCount}
                      </td>

                      {/* Daily distribution counters */}
                      <td className="p-0.5 border border-black text-slate-800">{row.hebDayTally[1]}</td>
                      <td className="p-0.5 border border-black text-slate-800">{row.hebDayTally[2]}</td>
                      <td className="p-0.5 border border-black text-slate-800">{row.hebDayTally[3]}</td>
                      <td className="p-0.5 border border-black text-slate-800">{row.hebDayTally[4]}</td>
                      <td className="p-0.5 border border-black text-slate-800">{row.hebDayTally[5]}</td>
                      <td className="p-0.5 border border-black text-slate-800">{row.hebDayTally[6]}</td>

                      {/* Calendar Days total */}
                      <td className="p-0.5 border border-black text-slate-500">{row.totalDays}</td>

                      {/* Libur tallies */}
                      <td className="p-0.5 border border-black text-slate-500">{row.weekendCount}</td>
                      <td className="p-0.5 border border-black text-rose-700">{row.liburNasionalCount + row.liburSekolahCount}</td>
                      <td className="p-0.5 border border-black font-bold text-slate-800 bg-rose-50">
                        {row.weekendCount + row.liburNasionalCount + row.liburSekolahCount}
                      </td>

                      {/* Activity Weeks & Activity Days */}
                      <td className="p-0.5 border border-black font-black bg-amber-50">
                        {row.activityWeeksCount}
                      </td>
                      <td className="p-0.5 border border-black font-black text-amber-800 bg-amber-50 text-right pr-0.5">
                        {row.hekCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Breakdown Recapitulation & Weekday Allocation Grid */}
          <div className="grid grid-cols-12 gap-3 page-break-avoid">
            {/* Semester breakdown Table */}
            <div className="col-span-5 border border-black p-2 bg-slate-50/10 rounded">
              <span className="text-[8px] font-black uppercase text-slate-900 block mb-1">
                REKAPITULASI MINGGU &amp; HARI EFEKTIF BELAJAR
              </span>
              <table className="w-full text-left text-[7.5px] border-collapse border border-black text-center">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-black text-slate-900 text-center">
                    <th className="p-1 border border-black">SEMESTER</th>
                    <th className="p-1 border border-black">PERIODE BULAN</th>
                    <th className="p-1 border border-black">KBM EFEKTIF</th>
                    <th className="p-1 border border-black">MGG EFEKTIF</th>
                    <th className="p-1 border border-black">KEGIATAN (HEK)</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-slate-800">
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold text-slate-900 border border-black">GASAL (I)</td>
                    <td className="p-1 border border-black text-slate-600">Juli - Des {selectedYear}</td>
                    <td className="p-1 border border-black text-emerald-800 font-extrabold">{semesterBreakdown.gasal.heb} Hari</td>
                    <td className="p-1 border border-black font-extrabold">{semesterBreakdown.gasal.weeks} Mgg</td>
                    <td className="p-1 border border-black text-amber-800 font-extrabold">{semesterBreakdown.gasal.hek} Hari</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold text-slate-900 border border-black">GENAP (II)</td>
                    <td className="p-1 border border-black text-slate-600">Jan - Jun {selectedYear + 1}</td>
                    <td className="p-1 border border-black text-emerald-800 font-extrabold">{semesterBreakdown.genap.heb} Hari</td>
                    <td className="p-1 border border-black font-extrabold">{semesterBreakdown.genap.weeks} Mgg</td>
                    <td className="p-1 border border-black text-amber-800 font-extrabold">{semesterBreakdown.genap.hek} Hari</td>
                  </tr>
                  <tr className="bg-slate-100 font-black text-slate-950 text-[8px] border-t border-black">
                    <td className="p-1 border border-black" colSpan={2}>JUMLAH AKHIR TP</td>
                    <td className="p-1 border border-black text-emerald-900">{semesterBreakdown.totalHEB} Hari</td>
                    <td className="p-1 border border-black">{semesterBreakdown.totalWeeks} Minggu</td>
                    <td className="p-1 border border-black text-amber-900">{semesterBreakdown.totalHEK} Hari</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Weekday distribution tally */}
            <div className="col-span-3 border border-black p-2 bg-slate-50/10 rounded flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-black uppercase text-slate-900 block mb-1">
                  TALLY DISTRIBUSI HARI BELAJAR
                </span>
                <div className="grid grid-cols-3 gap-1 text-center font-bold text-[7px] text-slate-900">
                  <div className="border border-black p-0.5 bg-slate-50">
                    <span className="block text-slate-500">SENIN</span>
                    <span className="font-extrabold">{semesterBreakdown.gasal.dayDistribution[1] + semesterBreakdown.genap.dayDistribution[1]} Hr</span>
                  </div>
                  <div className="border border-black p-0.5 bg-slate-50">
                    <span className="block text-slate-500">SELASA</span>
                    <span className="font-extrabold">{semesterBreakdown.gasal.dayDistribution[2] + semesterBreakdown.genap.dayDistribution[2]} Hr</span>
                  </div>
                  <div className="border border-black p-0.5 bg-slate-50">
                    <span className="block text-slate-500">RABU</span>
                    <span className="font-extrabold">{semesterBreakdown.gasal.dayDistribution[3] + semesterBreakdown.genap.dayDistribution[3]} Hr</span>
                  </div>
                  <div className="border border-black p-0.5 bg-slate-50">
                    <span className="block text-slate-500">KAMIS</span>
                    <span className="font-extrabold">{semesterBreakdown.gasal.dayDistribution[4] + semesterBreakdown.genap.dayDistribution[4]} Hr</span>
                  </div>
                  <div className="border border-black p-0.5 bg-slate-50">
                    <span className="block text-slate-500">JUMAT</span>
                    <span className="font-extrabold">{semesterBreakdown.gasal.dayDistribution[5] + semesterBreakdown.genap.dayDistribution[5]} Hr</span>
                  </div>
                  <div className="border border-black p-0.5 bg-slate-50">
                    <span className="block text-slate-500">SABTU</span>
                    <span className="font-extrabold">{semesterBreakdown.gasal.dayDistribution[6] + semesterBreakdown.genap.dayDistribution[6]} Hr</span>
                  </div>
                </div>
              </div>
              <p className="text-[6.5px] leading-none text-slate-500 font-bold mt-1.5">
                * Dasar alokasi RPP / Modul Ajar kurikulum guru.
              </p>
            </div>

            {/* Formal signature block */}
            <div className="col-span-4 border border-black p-2 bg-slate-50/10 rounded">
              <div className="grid grid-cols-2 gap-2 text-[7.5px] font-bold text-center h-full">
                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <span className="block">Mengetahui,</span>
                    <span className="block uppercase text-[7px]">Kepala Sekolah / Madrasah</span>
                  </div>
                  <div className="space-y-0.5 mt-16">
                    <span className="font-black underline block leading-none">{principalName || '..........................................'}</span>
                    <span className="text-slate-500 text-[6.5px] block leading-none">NIP. {principalNip || '.....................................'}</span>
                  </div>
                </div>
                
                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <span className="block font-normal text-[7px] text-slate-600">{signaturePlace || 'Cibungur'}, {signatureDate || '....................'}</span>
                    <span className="block uppercase text-[7px]">Guru Pengampu</span>
                  </div>
                  <div className="space-y-0.5 mt-16">
                    <span className="font-black underline block leading-none">{teacherName || '..........................................'}</span>
                    <span className="text-slate-500 text-[6.5px] block leading-none">NIP. {teacherNip || '.....................................'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRINT TEMPLATE FOR SUB-TAB 4: DISTRIBUSI DETAIL BULANAN */}
      {activeSubTab === 4 && (
        <div className="print-only w-full bg-white text-black p-2 font-sans" id="academic-distribution-print-area">
          {/* Document Header (Kop Dokumen Resmi) */}
          <div className="text-center space-y-1 mb-3 border-b-2 border-double border-black pb-2">
            <h1 className="text-xs font-black tracking-wider uppercase leading-none text-slate-900">
              RINCIAN DISTRIBUSI DETAIL BULANAN (HEB, HEK, LIBUR)
            </h1>
            <h2 className="text-sm font-black uppercase leading-tight text-slate-900">
              {schoolName.toUpperCase()}
            </h2>
            <p className="text-[9px] font-bold text-slate-700 tracking-wide leading-none">
              Tahun Pelajaran: {selectedYear}/{selectedYear + 1} | Lampiran Kalender Pendidikan
            </p>
          </div>

          <div className="border border-black overflow-hidden mb-3">
            <table className="w-full text-left text-[8px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-black font-black border-b border-black uppercase text-center">
                  <th className="p-1.5 border-r border-black text-left">BULAN</th>
                  <th className="p-1.5 border-r border-black w-[50px]">TAHUN</th>
                  <th className="p-1.5 border-r border-black w-[80px]">TOTAL HARI</th>
                  <th className="p-1.5 border-r border-black w-[90px]">EFEKTIF BELAJAR (HEB)</th>
                  <th className="p-1.5 border-r border-black w-[90px]">KEGIATAN (HEK)</th>
                  <th className="p-1.5 border-r border-black w-[80px]">LIBUR NASIONAL</th>
                  <th className="p-1.5 border-r border-black w-[80px]">LIBUR SEKOLAH</th>
                  <th className="p-1.5 w-[80px]">AKHIR PEKAN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black text-black">
                {calculatedMonthMatrix.map((stat, idx) => (
                  <tr key={idx} className="border-b border-black">
                    <td className="p-1.5 font-bold border-r border-black">{stat.monthName}</td>
                    <td className="p-1.5 text-center border-r border-black">{stat.year}</td>
                    <td className="p-1.5 text-center border-r border-black font-semibold">{stat.totalDays} Hari</td>
                    <td className="p-1.5 text-center border-r border-black font-bold">{stat.hebCount} Hari</td>
                    <td className="p-1.5 text-center border-r border-black font-bold">{stat.hekCount} Hari</td>
                    <td className="p-1.5 text-center border-r border-black font-bold">{stat.liburNasionalCount} Hari</td>
                    <td className="p-1.5 text-center border-r border-black font-bold">{stat.liburSekolahCount} Hari</td>
                    <td className="p-1.5 text-center">{stat.weekendCount} Hari</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formal signature block */}
          <div className="border border-black p-2 bg-slate-50/10 rounded page-break-avoid mt-4">
            <div className="grid grid-cols-2 gap-2 text-[7.5px] font-bold text-center">
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <span className="block">Mengetahui,</span>
                  <span className="block uppercase text-[7px]">Kepala Sekolah / Madrasah</span>
                </div>
                <div className="space-y-0.5 mt-16">
                  <span className="font-black underline block leading-none">{principalName || '..........................................'}</span>
                  <span className="text-slate-500 text-[6.5px] block leading-none">NIP. {principalNip || '.....................................'}</span>
                </div>
              </div>
              
              <div className="flex flex-col justify-between py-0.5">
                <div>
                  <span className="block font-normal text-[7px] text-slate-600">{signaturePlace || 'Cibungur'}, {signatureDate || '....................'}</span>
                  <span className="block uppercase text-[7px]">Guru Pengampu</span>
                </div>
                <div className="space-y-0.5 mt-16">
                  <span className="font-black underline block leading-none">{teacherName || '..........................................'}</span>
                  <span className="text-slate-500 text-[6.5px] block leading-none">NIP. {teacherNip || '.....................................'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
