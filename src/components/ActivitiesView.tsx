import React, { useMemo, useState } from 'react';
import { Sparkles, Calendar, Trash2, Edit2, AlertCircle, Plus, CheckCircle, X, Check } from 'lucide-react';
import { CalendarDay, DayType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ActivitiesViewProps {
  calendarData: Record<string, CalendarDay>;
  setCalendarData: React.Dispatch<React.SetStateAction<Record<string, CalendarDay>>>;
  selectedYear: number;
}

const MONTHS_INDONESIAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

interface SchoolPreset {
  title: string;
  durationDays: number;
  type: DayType;
  defaultMonthOffset: number; // relative to start of academic year (July)
}

const PRESETS: SchoolPreset[] = [
  { title: 'Masa Pengenalan Lingkungan Sekolah (MPLS)', durationDays: 3, type: 'HEK', defaultMonthOffset: 0 }, // July
  { title: 'Asesmen Nasional (ANBK)', durationDays: 4, type: 'HEK', defaultMonthOffset: 2 }, // September
  { title: 'Penilaian Tengah Semester (PTS) Ganjil', durationDays: 5, type: 'HEK', defaultMonthOffset: 2 }, // September
  { title: 'Penilaian Akhir Semester (PAS) Ganjil', durationDays: 6, type: 'HEK', defaultMonthOffset: 5 }, // December
  { title: 'Class Meeting & Pengolahan Nilai', durationDays: 4, type: 'HEK', defaultMonthOffset: 5 }, // December
  { title: 'Pembagian Rapor Semester I', durationDays: 1, type: 'HEK', defaultMonthOffset: 5 }, // December
  { title: 'Penilaian Tengah Semester (PTS) Genap', durationDays: 5, type: 'HEK', defaultMonthOffset: 8 }, // March
  { title: 'Ujian Sekolah (US)', durationDays: 6, type: 'HEK', defaultMonthOffset: 9 }, // April
  { title: 'Asesmen Akhir Tahun (AAT) / PAT', durationDays: 6, type: 'HEK', defaultMonthOffset: 11 }, // June
  { title: 'Class Meeting & Pembagian Rapor Semester II', durationDays: 5, type: 'HEK', defaultMonthOffset: 11 }, // June
];

export default function ActivitiesView({
  calendarData,
  setCalendarData,
  selectedYear
}: ActivitiesViewProps) {
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [tempDate, setTempDate] = useState('');
  const [deleteTargetDate, setDeleteTargetDate] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Bulk deletion states
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isDeleteAllConfirm, setIsDeleteAllConfirm] = useState(false);
  const [isBulkDeleteConfirm, setIsBulkDeleteConfirm] = useState(false);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Extract all activity days (HEK) chronologically for the selected academic year
  const activeHEKDays = useMemo(() => {
    const startAcademicDate = `${selectedYear}-07-01`;
    const endAcademicDate = `${selectedYear + 1}-06-30`;

    return Object.values(calendarData)
      .filter(day => {
        return day.type === 'HEK' && 
          day.dateString >= startAcademicDate && 
          day.dateString <= endAcademicDate;
      })
      .sort((a, b) => a.dateString.localeCompare(b.dateString));
  }, [calendarData, selectedYear]);

  // Handle single-item updates
  const handleUpdateActivity = (originalDate: string, newDate: string, title: string) => {
    if (!newDate) {
      triggerToast('Tanggal tidak boleh kosong!', 'error');
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
          type: 'HEK',
          activityName: title
        };
      } else {
        // Same date, just update the title
        updated[originalDate] = {
          ...updated[originalDate],
          activityName: title
        };
      }
      return updated;
    });
    setEditingDate(null);
    triggerToast('Kegiatan berhasil diperbarui!');
  };

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
    setSelectedDates(prev => prev.filter(d => d !== dateStr));
    triggerToast('Kegiatan berhasil dibatalkan dan kembali menjadi Hari Efektif Belajar biasa.', 'info');
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
      activeHEKDays.forEach(day => {
        const dayOfWeek = new Date(day.dateString).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        updated[day.dateString] = {
          dateString: day.dateString,
          type: isWeekend ? 'WEEKEND' : 'HEB'
        };
      });
      return updated;
    });
    setIsDeleteAllConfirm(false);
    setSelectedDates([]);
    triggerToast('Seluruh kegiatan akademik berhasil dikosongkan.', 'info');
  };

  const handleToggleSelectAll = () => {
    if (selectedDates.length === activeHEKDays.length) {
      setSelectedDates([]);
    } else {
      setSelectedDates(activeHEKDays.map(d => d.dateString));
    }
  };

  const handleToggleSelectDate = (dateStr: string) => {
    setSelectedDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  // Preset Applier: Auto schedules presets to avoid redundant clicks
  const applyPreset = (preset: SchoolPreset) => {
    // Resolve targeted month
    const acMonthOrder = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
    const targetMonthIndex = acMonthOrder[preset.defaultMonthOffset];
    const targetYear = targetMonthIndex >= 6 ? selectedYear : selectedYear + 1;
    
    // Find consecutive business days (not weekends, not holidays) in that month to apply
    let addedCount = 0;
    const updated = { ...calendarData };

    for (let day = 1; day <= 31 && addedCount < preset.durationDays; day++) {
      const date = new Date(targetYear, targetMonthIndex, day);
      if (date.getMonth() !== targetMonthIndex) break; // Exceeded end of month

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const dateStr = `${targetYear}-${String(targetMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Ensure we don't overwrite national holidays or weekends
      if (!isWeekend && (!updated[dateStr] || updated[dateStr].type !== 'LIBUR_NASIONAL')) {
        updated[dateStr] = {
          dateString: dateStr,
          type: preset.type,
          activityName: preset.title
        };
        addedCount++;
      }
    }

    setCalendarData(updated);
    triggerToast(`Berhasil menerapkan preset "${preset.title}" selama ${preset.durationDays} hari kerja efektif!`, 'success');
  };

  const formattedDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6" id="activities-view-container">
      {/* Introduction Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Calendar className="text-amber-500" size={24} />
          Pengelolaan Program Kegiatan Sekolah (HEK)
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Daftar seluruh Hari Efektif Kegiatan (HEK) yang sudah Anda plot di kalender pendidikan. Anda dapat mengedit nama kegiatan di sini atau menggunakan template kurikulum siap pakai.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Presets List Column */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="text-amber-500" size={18} />
            <h3 className="font-bold text-slate-800 text-sm">Preset Kegiatan Akademik</h3>
          </div>
          <p className="text-xs text-slate-400 leading-normal">
            Gunakan preset kurikulum di bawah ini untuk menambahkan kegiatan pembelajaran utama secara cepat ke dalam bulan-bulan yang relevan.
          </p>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {PRESETS.map((preset, idx) => {
              const acMonthOrder = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5];
              const monthName = MONTHS_INDONESIAN[acMonthOrder[preset.defaultMonthOffset]];
              return (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block leading-tight">{preset.title}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Estimasi: {monthName} ({preset.durationDays} hari)</span>
                  </div>
                  <button
                    onClick={() => applyPreset(preset)}
                    className="shrink-0 flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Plus size={12} />
                    Pasang
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Registered Activities List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Jadwal Agenda Kegiatan Terdaftar</h3>
            <span className="text-xs bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full">
              {activeHEKDays.length} Hari Terplot
            </span>
          </div>

          {activeHEKDays.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 gap-3 text-xs">
              <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDates.length === activeHEKDays.length && activeHEKDays.length > 0}
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

          {activeHEKDays.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {activeHEKDays.map((day, idx) => {
                const isEditing = editingDate === day.dateString;
                const isChecked = selectedDates.includes(day.dateString);
                return (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl flex items-start sm:items-center gap-3 transition">
                    {!isEditing && (
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleSelectDate(day.dateString)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4 mt-1 sm:mt-0 shrink-0"
                      />
                    )}
                    <div className="flex-1 space-y-1 min-w-0">
                      <span className="text-[10px] font-bold text-emerald-600 tracking-wide uppercase block">
                        {formattedDate(day.dateString)}
                      </span>
                      
                      {isEditing ? (
                        <div className="flex flex-col gap-2 mt-1 w-full max-w-md bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
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
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Nama Rencana / Kegiatan:</label>
                              <input
                                type="text"
                                value={tempTitle}
                                onChange={(e) => setTempTitle(e.target.value)}
                                className="text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full bg-slate-50 text-slate-800 font-semibold"
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              onClick={() => handleUpdateActivity(day.dateString, tempDate, tempTitle)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <Check size={12} />
                              Simpan
                            </button>
                            <button
                              onClick={() => setEditingDate(null)}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <X size={12} />
                              Batal
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm font-semibold text-slate-800 block truncate">
                          {day.activityName || 'Kegiatan Tanpa Judul'}
                        </span>
                      )}
                    </div>
 
                    {!isEditing && (
                      <div className="flex items-center gap-1.5 shrink-0 self-center">
                        <button
                          onClick={() => {
                            setEditingDate(day.dateString);
                            setTempTitle(day.activityName || '');
                            setTempDate(day.dateString);
                          }}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                          title="Edit Nama Kegiatan"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleRemoveActivity(day.dateString)}
                          className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-rose-50 text-rose-600 transition cursor-pointer"
                          title="Hapus Kegiatan"
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
            <div className="text-center py-16 px-4 text-slate-400 space-y-3">
              <AlertCircle size={44} className="mx-auto opacity-35 text-slate-400" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-600">Belum ada hari kegiatan (HEK) yang ditambahkan.</p>
                <p className="text-xs leading-normal max-w-sm mx-auto">Silakan plot hari kegiatan baru lewat menu Kalender, atau gunakan pintasan preset di panel sebelah kiri untuk menjadwalkan program kerja secara otomatis.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold bg-slate-900 text-white border-slate-800"
          >
            <CheckCircle className="text-emerald-400 w-4 h-4 shrink-0" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modals */}
      <AnimatePresence>
        {/* Delete Single Activity Confirmation */}
        {deleteTargetDate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTargetDate(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
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
                <h3 className="font-bold text-slate-800 text-sm">Batalkan Kegiatan?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus kegiatan pada <span className="font-bold text-slate-700">{formattedDate(deleteTargetDate)}</span> dan mengembalikannya ke Hari Efektif Belajar biasa?
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBulkDeleteConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
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
                  Apakah Anda yakin ingin menghapus <span className="font-bold text-rose-600">{selectedDates.length} kegiatan</span> yang dipilih dan mengembalikannya ke Hari Efektif Belajar biasa?
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteAllConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
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
                <h3 className="font-bold text-slate-800 text-sm">Hapus Seluruh Kegiatan?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tindakan ini akan menghapus <span className="font-bold text-rose-600">seluruh ({activeHEKDays.length}) kegiatan</span> pada tahun ajaran ini dan mengembalikannya menjadi Hari Efektif Belajar reguler. Tindakan ini tidak dapat dibatalkan.
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
  );
}
