import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  FileEdit, 
  Save, 
  X,
  Users,
  ChevronDown,
  Plus,
  Trash2,
  ClipboardPaste,
  FileSpreadsheet,
  UserPlus,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDay } from '../types';

export type ClassLevel = 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Kelas 4' | 'Kelas 5' | 'Kelas 6';
export const ALL_CLASSES: ClassLevel[] = ['Kelas 1', 'Kelas 2', 'Kelas 3', 'Kelas 4', 'Kelas 5', 'Kelas 6'];

export interface StudentItem {
  id: string;
  no: number;
  name: string;
}

export type StudentsDataMap = Record<ClassLevel, StudentItem[]>;

interface DashboardViewProps {
  calendarData: Record<string, CalendarDay>;
  setCalendarData: React.Dispatch<React.SetStateAction<Record<string, CalendarDay>>>;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  schoolLogo?: string;
  setSchoolLogo?: (logo: string) => void;
  weeklyRestDays: number[];
  setWeeklyRestDays: (days: number[]) => void;
  academicYears: number[];
  setAcademicYears: (years: number[]) => void;
  principalName: string;
  setPrincipalName: (name: string) => void;
  principalNip: string;
  setPrincipalNip: (nip: string) => void;
  teacherName: string;
  setTeacherName: (name: string) => void;
  teacherNip: string;
  setTeacherNip: (nip: string) => void;
  signaturePlace: string;
  setSignaturePlace: (place: string) => void;
  signatureDate: string;
  setSignatureDate: (date: string) => void;
}

export default function DashboardView({
  calendarData,
  setCalendarData,
  selectedYear,
  setSelectedYear,
  schoolName,
  setSchoolName,
  schoolLogo = '',
  setSchoolLogo,
  weeklyRestDays,
  setWeeklyRestDays,
  academicYears,
  setAcademicYears,
  principalName,
  setPrincipalName,
  principalNip,
  setPrincipalNip,
  teacherName,
  setTeacherName,
  teacherNip,
  setTeacherNip,
  signaturePlace,
  setSignaturePlace,
  signatureDate,
  setSignatureDate
}: DashboardViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // School Data Form Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form draft states for School Identity
  const [draftSchoolName, setDraftSchoolName] = useState(schoolName);
  const [draftSchoolLogo, setDraftSchoolLogo] = useState(schoolLogo);
  const [draftSelectedYear, setDraftSelectedYear] = useState(selectedYear);
  const [draftPrincipalName, setDraftPrincipalName] = useState(principalName);
  const [draftPrincipalNip, setDraftPrincipalNip] = useState(principalNip);
  const [draftTeacherName, setDraftTeacherName] = useState(teacherName);
  const [draftTeacherNip, setDraftTeacherNip] = useState(teacherNip);
  const [draftSignaturePlace, setDraftSignaturePlace] = useState(signaturePlace);
  const [draftSignatureDate, setDraftSignatureDate] = useState(signatureDate);

  // Student Data state
  const [studentsData, setStudentsData] = useState<StudentsDataMap>(() => {
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

  useEffect(() => {
    localStorage.setItem('school_students_data', JSON.stringify(studentsData));
  }, [studentsData]);

  // Dropdown & Student Modal state
  const [isClassDropdownOpen, setIsClassDropdownOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentClass, setSelectedStudentClass] = useState<ClassLevel>('Kelas 1');
  const [draftStudentsList, setDraftStudentsList] = useState<StudentItem[]>([]);
  const [excelPasteText, setExcelPasteText] = useState('');
  const [showExcelPasteBox, setShowExcelPasteBox] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClassDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenForm = () => {
    setDraftSchoolName(schoolName);
    setDraftSchoolLogo(schoolLogo);
    setDraftSelectedYear(selectedYear);
    setDraftPrincipalName(principalName);
    setDraftPrincipalNip(principalNip);
    setDraftTeacherName(teacherName);
    setDraftTeacherNip(teacherNip);
    setDraftSignaturePlace(signaturePlace);
    setDraftSignatureDate(signatureDate);
    setIsFormOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('Ukuran file logo terlalu besar. Maksimal 3MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setDraftSchoolLogo(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    setSchoolName(draftSchoolName);
    if (setSchoolLogo) setSchoolLogo(draftSchoolLogo);
    setSelectedYear(draftSelectedYear);
    setPrincipalName(draftPrincipalName);
    setPrincipalNip(draftPrincipalNip);
    setTeacherName(draftTeacherName);
    setTeacherNip(draftTeacherNip);
    setSignaturePlace(draftSignaturePlace);
    setSignatureDate(draftSignatureDate);
    setIsFormOpen(false);
  };

  // Open student modal for a specific class
  const handleOpenStudentModal = (cls: ClassLevel) => {
    setSelectedStudentClass(cls);
    const existing = studentsData[cls] || [];
    // Clone list or provide a default empty row if empty
    setDraftStudentsList(existing.length > 0 ? existing.map(s => ({ ...s })) : [
      { id: 'std_' + Math.random().toString(36).substring(2, 9), no: 1, name: '' }
    ]);
    setExcelPasteText('');
    setShowExcelPasteBox(false);
    setIsClassDropdownOpen(false);
    setIsStudentModalOpen(true);
  };

  // Helper function to parse Excel paste input text
  const parseExcelTextToStudents = (text: string): StudentItem[] => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
    const parsed: StudentItem[] = [];

    lines.forEach((line, idx) => {
      let name = line;
      let customNo = idx + 1;

      if (line.includes('\t')) {
        const parts = line.split('\t').map(p => p.trim()).filter(p => p.length > 0);
        if (parts.length >= 2 && !isNaN(Number(parts[0]))) {
          customNo = Number(parts[0]);
          name = parts.slice(1).join(' ');
        } else if (parts.length >= 1) {
          name = parts[parts.length - 1];
        }
      } else {
        const match = line.match(/^(\d+)[\.\s,-]+(.+)/);
        if (match) {
          customNo = Number(match[1]);
          name = match[2].trim();
        }
      }

      if (name) {
        parsed.push({
          id: 'std_' + Math.random().toString(36).substring(2, 9),
          no: customNo || (idx + 1),
          name: name
        });
      }
    });

    return parsed;
  };

  // Apply pasted Excel data
  const handleApplyExcelPaste = () => {
    if (!excelPasteText.trim()) return;
    const parsed = parseExcelTextToStudents(excelPasteText);
    if (parsed.length > 0) {
      setDraftStudentsList(parsed);
      setExcelPasteText('');
      setShowExcelPasteBox(false);
    } else {
      alert('Tidak ada data siswa yang berhasil terbaca dari teks.');
    }
  };

  // Direct paste on individual name field handler
  const handleNameFieldPaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('Text');
    if (pastedData.includes('\n') || pastedData.includes('\t')) {
      e.preventDefault();
      const parsed = parseExcelTextToStudents(pastedData);
      if (parsed.length > 0) {
        const updated = [...draftStudentsList];
        // Replace or append
        updated.splice(index, 1, ...parsed);
        // Renumber sequentially
        updated.forEach((item, idx) => {
          item.no = idx + 1;
        });
        setDraftStudentsList(updated);
      }
    }
  };

  // Student table row operations
  const handleAddStudentRow = () => {
    const nextNo = draftStudentsList.length + 1;
    setDraftStudentsList([
      ...draftStudentsList,
      { id: 'std_' + Math.random().toString(36).substring(2, 9), no: nextNo, name: '' }
    ]);
  };

  const handleUpdateStudentField = (index: number, field: 'no' | 'name', value: any) => {
    const updated = [...draftStudentsList];
    if (field === 'no') {
      updated[index].no = Number(value) || index + 1;
    } else {
      updated[index].name = value;
    }
    setDraftStudentsList(updated);
  };

  const handleDeleteStudentRow = (index: number) => {
    const updated = draftStudentsList.filter((_, i) => i !== index);
    // Renumber
    updated.forEach((item, idx) => {
      item.no = idx + 1;
    });
    setDraftStudentsList(updated);
  };

  const handleSaveStudents = () => {
    // Filter out rows with blank names
    const cleaned = draftStudentsList.filter(s => s.name.trim().length > 0);
    // Renumber clean list
    cleaned.forEach((s, idx) => {
      s.no = idx + 1;
    });

    setStudentsData(prev => ({
      ...prev,
      [selectedStudentClass]: cleaned
    }));
    setIsStudentModalOpen(false);
  };

  // Backup & Restore Actions
  const handleExportData = () => {
    const dataStr = JSON.stringify({
      schoolName,
      schoolLogo,
      selectedYear,
      weeklyRestDays,
      academicYears,
      calendarData,
      studentsData,
      principalName,
      principalNip,
      teacherName,
      teacherNip,
      signaturePlace,
      signatureDate,
      exportDate: new Date().toISOString()
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const formattedSchoolName = schoolName.replace(/[^a-zA-Z0-9]/g, '_');
    const exportFileDefaultName = `Backup_Kalpen_${formattedSchoolName}_${selectedYear}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && parsed.calendarData) {
            if (parsed.schoolName) setSchoolName(parsed.schoolName);
            if (parsed.schoolLogo && setSchoolLogo) setSchoolLogo(parsed.schoolLogo);
            if (parsed.selectedYear) setSelectedYear(parsed.selectedYear);
            if (parsed.weeklyRestDays) setWeeklyRestDays(parsed.weeklyRestDays);
            if (parsed.academicYears) setAcademicYears(parsed.academicYears);
            if (parsed.principalName) setPrincipalName(parsed.principalName);
            if (parsed.principalNip) setPrincipalNip(parsed.principalNip);
            if (parsed.teacherName) setTeacherName(parsed.teacherName);
            if (parsed.teacherNip) setTeacherNip(parsed.teacherNip);
            if (parsed.signaturePlace) setSignaturePlace(parsed.signaturePlace);
            if (parsed.signatureDate) setSignatureDate(parsed.signatureDate);
            if (parsed.studentsData) setStudentsData(parsed.studentsData);
            setCalendarData(parsed.calendarData);
            alert('Sukses! Seluruh data konfigurasi kalender pendidikan dan data siswa berhasil diimpor.');
          } else {
            alert('Format berkas tidak valid atau data kalender kosong.');
          }
        } catch (error) {
          alert('Terjadi kesalahan saat membaca berkas JSON.');
        }
      };
    }
  };

  return (
    <div className="space-y-6" id="dashboard-view-container">
      {/* SECTION: MENU DATA (IDENTITAS & PARAMETER SEKOLAH) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6" id="menu-data-admin-panel">
        
        {/* HEADER ROW: Title & Backup/Restore buttons */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Konfigurasi Administratif Utama
            </span>
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mt-1.5">
              <FileText className="text-emerald-600 shrink-0" size={20} />
              Menu Data &amp; Identitas Sekolah
            </h3>
            <p className="text-xs text-slate-500">
              Kelola data identitas sekolah, penandatangan dokumen, serta cadangan konfigurasi.
            </p>
          </div>
          
          {/* Top Backup & Restore Buttons strictly preserved in top right */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer border border-slate-200/50"
              title="Unggah berkas cadangan kalender"
            >
              <Upload size={14} />
              Pulihkan Backup
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportData}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={handleExportData}
              className="flex-1 lg:flex-initial flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              title="Unduh seluruh konfigurasi kalender & data siswa"
            >
              <Download size={14} />
              Ekspor Backup
            </button>
          </div>
        </div>

        {/* LOWER ACTION ROW: Input Data & Input Siswa Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Input Data Button */}
          <button
            onClick={handleOpenForm}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileEdit size={16} />
            Input Data
          </button>

          {/* Input Siswa Button with Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsClassDropdownOpen(!isClassDropdownOpen)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
            >
              <Users size={16} />
              <span>Input Siswa</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isClassDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu for Kelas 1 - Kelas 6 */}
            <AnimatePresence>
              {isClassDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200/80 py-2 z-40"
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Kelas Siswa
                  </div>
                  {ALL_CLASSES.map((cls) => {
                    const count = studentsData[cls]?.length || 0;
                    return (
                      <button
                        key={cls}
                        onClick={() => handleOpenStudentModal(cls)}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span>{cls}</span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {count} Siswa
                        </span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* SUMMARY CARDS: Class Enrolled Quick Overview */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users size={14} className="text-indigo-600" />
            <span>Rangkuman Jumlah Siswa Per Kelas</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ALL_CLASSES.map((cls) => {
              const count = studentsData[cls]?.length || 0;
              return (
                <button
                  key={cls}
                  onClick={() => handleOpenStudentModal(cls)}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200/60 hover:border-indigo-200 rounded-xl text-left transition group cursor-pointer"
                >
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 block uppercase">
                    {cls}
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-lg font-black text-slate-800 group-hover:text-indigo-900">
                      {count}
                    </span>
                    <span className="text-[10px] text-slate-500 group-hover:text-indigo-700 font-medium">
                      Siswa
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* MODAL 1: FORM INPUT DATA & IDENTITAS SEKOLAH */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-4xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileEdit size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">
                      Form Input Data &amp; Identitas Sekolah
                    </h3>
                    <p className="text-xs text-slate-500">
                      Silakan isi data lembaga, kepala madrasah, guru pengampu, dan titi mangsa.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveForm} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Column 1: Identitas Lembaga */}
                  <div className="space-y-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Identitas Lembaga
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                          Nama Sekolah / Madrasah
                        </label>
                        <input
                          type="text"
                          value={draftSchoolName}
                          onChange={(e) => setDraftSchoolName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                          placeholder="Masukkan nama sekolah..."
                        />
                      </div>

                      {/* Logo Upload Field */}
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                          Logo Sekolah / Madrasah
                        </label>
                        <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                            {draftSchoolLogo ? (
                              <img src={draftSchoolLogo} alt="Logo Sekolah" className="w-full h-full object-contain p-0.5" />
                            ) : (
                              <Upload size={18} className="text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md text-[11px] font-bold cursor-pointer transition">
                              <Upload size={12} />
                              <span>{draftSchoolLogo ? 'Ganti Logo' : 'Upload Logo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                            {draftSchoolLogo && (
                              <button
                                type="button"
                                onClick={() => setDraftSchoolLogo('')}
                                className="block text-[10px] text-rose-600 hover:underline font-semibold"
                              >
                                Hapus Logo
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                          Tahun Pelajaran Aktif
                        </label>
                        <select
                          value={draftSelectedYear}
                          onChange={(e) => setDraftSelectedYear(parseInt(e.target.value, 10))}
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
                        >
                          {academicYears.map((yr) => (
                            <option key={yr} value={yr}>
                              Tahun Ajaran {yr} / {yr + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Kepala Madrasah / Sekolah */}
                  <div className="space-y-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Kepala Madrasah / Sekolah
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                          Nama Kepala Sekolah
                        </label>
                        <input
                          type="text"
                          value={draftPrincipalName}
                          onChange={(e) => setDraftPrincipalName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                          placeholder="Nama Kepala Sekolah beserta gelar..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                          NIP Kepala Sekolah
                        </label>
                        <input
                          type="text"
                          value={draftPrincipalNip}
                          onChange={(e) => setDraftPrincipalNip(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                          placeholder="NIP / Peg.ID Kepala..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Guru & Titi Mangsa */}
                  <div className="space-y-4 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Guru Pengampu &amp; Titi Mangsa
                    </h4>

                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                            Nama Guru
                          </label>
                          <input
                            type="text"
                            value={draftTeacherName}
                            onChange={(e) => setDraftTeacherName(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                            placeholder="Nama Guru..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                            NIP Guru
                          </label>
                          <input
                            type="text"
                            value={draftTeacherNip}
                            onChange={(e) => setDraftTeacherNip(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                            placeholder="NIP Guru..."
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                            Tempat TTD
                          </label>
                          <input
                            type="text"
                            value={draftSignaturePlace}
                            onChange={(e) => setDraftSignaturePlace(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                            placeholder="Contoh: Cibungur"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wide mb-1">
                            Tanggal TTD
                          </label>
                          <input
                            type="text"
                            value={draftSignatureDate}
                            onChange={(e) => setDraftSignatureDate(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg text-xs font-semibold px-2 py-2 text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                            placeholder="Contoh: 17 Juli 2026"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    <Save size={15} />
                    Simpan Data
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: FORM INPUT DATA SISWA (SUPPORT COPY / PASTE EXCEL) */}
      <AnimatePresence>
        {isStudentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 space-y-5 my-8 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-800">
                        Input Data Siswa
                      </h3>
                      {/* Class Quick Switcher Dropdown inside Modal */}
                      <select
                        value={selectedStudentClass}
                        onChange={(e) => handleOpenStudentModal(e.target.value as ClassLevel)}
                        className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
                      >
                        {ALL_CLASSES.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Isi daftar nama siswa untuk {selectedStudentClass}. Anda dapat mengetik manual atau menyalin langsung dari Excel.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsStudentModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Excel Import Toggle Banner */}
              <div className="shrink-0 space-y-2">
                <div className="flex items-center justify-between bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 text-xs">
                  <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                    <FileSpreadsheet size={16} className="text-indigo-600 shrink-0" />
                    <span>Mendukung Copy / Paste dari Excel</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExcelPasteBox(!showExcelPasteBox)}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 transition cursor-pointer"
                  >
                    <ClipboardPaste size={13} />
                    {showExcelPasteBox ? 'Tutup Kotak Paste' : 'Tempel Data Excel'}
                  </button>
                </div>

                {/* Collapsible Excel Textarea Box */}
                <AnimatePresence>
                  {showExcelPasteBox && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 p-3.5 rounded-xl border border-indigo-100 space-y-2.5 overflow-hidden"
                    >
                      <label className="block text-[11px] font-bold text-slate-600">
                        Copy kolom nama siswa di Excel, lalu Paste (Ctrl + V) di kotak di bawah ini:
                      </label>
                      <textarea
                        rows={4}
                        value={excelPasteText}
                        onChange={(e) => setExcelPasteText(e.target.value)}
                        placeholder={`Contoh format Excel:\n1. Ahmad Sopyan\n2. Aisha Nur Aulia\n\nAtau cukup salin kolom nama saja per baris.`}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-700 font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setExcelPasteText('')}
                          className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:bg-slate-200 font-semibold cursor-pointer"
                        >
                          Bersihkan
                        </button>
                        <button
                          type="button"
                          onClick={handleApplyExcelPaste}
                          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition cursor-pointer"
                        >
                          <Check size={14} />
                          Terapkan Ke Tabel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Student List Table Area */}
              <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-wider sticky top-0 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-2.5 px-4 w-16 text-center">No</th>
                      <th className="py-2.5 px-4">Nama Siswa</th>
                      <th className="py-2.5 px-4 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {draftStudentsList.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400 font-medium">
                          Belum ada data siswa. Klik <strong className="text-indigo-600">+ Tambah Baris</strong> atau tempel dari Excel.
                        </td>
                      </tr>
                    ) : (
                      draftStudentsList.map((student, index) => (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2 px-3 text-center font-bold text-slate-500">
                            <input
                              type="number"
                              value={student.no}
                              onChange={(e) => handleUpdateStudentField(index, 'no', e.target.value)}
                              className="w-12 text-center bg-transparent border border-transparent hover:border-slate-300 focus:border-indigo-500 rounded text-xs font-bold py-1 focus:bg-white focus:outline-none"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={student.name}
                              onChange={(e) => handleUpdateStudentField(index, 'name', e.target.value)}
                              onPaste={(e) => handleNameFieldPaste(index, e)}
                              placeholder="Ketik nama siswa atau paste dari Excel..."
                              className="w-full bg-white border border-slate-200 focus:border-indigo-500 rounded-lg text-xs font-medium px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                            />
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteStudentRow(index)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Hapus siswa ini"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddStudentRow}
                    className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
                  >
                    <Plus size={15} />
                    Tambah Baris Siswa
                  </button>
                  {draftStudentsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Kosongkan seluruh data siswa ${selectedStudentClass}?`)) {
                          setDraftStudentsList([]);
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1.5 cursor-pointer"
                    >
                      Kosongkan Data
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  Total Terdata: <span className="text-indigo-700 font-black">{draftStudentsList.filter(s => s.name.trim().length > 0).length}</span> Siswa
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSaveStudents}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Save size={15} />
                  Simpan Data Siswa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
