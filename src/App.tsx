import React, { useState, useMemo } from 'react';
import { LayoutDashboard, Calendar, UserCheck, BookOpen, GraduationCap, Menu, X, HelpCircle, Edit3, Check } from 'lucide-react';
import { CalendarDay } from './types';
import { INDONESIAN_HOLIDAYS_2026, INDONESIAN_HOLIDAYS_2027, INDONESIAN_HOLIDAYS_2028 } from './data/holidays';

import DashboardView from './components/DashboardView';
import CalendarView from './components/CalendarView';
import AttendanceView from './components/AttendanceView';

// Generate default academic calendar state to make the application immediately alive
function generateInitialCalendar(startYear: number): Record<string, CalendarDay> {
  const data: Record<string, CalendarDay> = {};

  // 1. Pre-populate all Saturdays & Sundays as WEEKEND for startYear, startYear+1, and startYear+2
  const years = [startYear, startYear + 1, startYear + 2];
  years.forEach(yr => {
    for (let month = 0; month < 12; month++) {
      const days = new Date(yr, month + 1, 0).getDate();
      for (let day = 1; day <= days; day++) {
        const date = new Date(yr, month, day);
        const dayOfWeek = date.getDay();
        const dateStr = `${yr}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
          data[dateStr] = { dateString: dateStr, type: 'WEEKEND' };
        } else {
          data[dateStr] = { dateString: dateStr, type: 'HEB' }; // Default to Effective Learning Day
        }
      }
    }
  });

  // 2. Pre-populate preset Indonesian national holidays
  const allHolidays = [...INDONESIAN_HOLIDAYS_2026, ...INDONESIAN_HOLIDAYS_2027, ...INDONESIAN_HOLIDAYS_2028];
  allHolidays.forEach(holiday => {
    data[holiday.date] = {
      dateString: holiday.date,
      type: 'LIBUR_NASIONAL',
      activityName: holiday.name
    };
  });

  // 3. Pre-populate a few key school activities as default indicators
  // July 13-15 2026: MPLS
  ['13', '14', '15'].forEach(d => {
    const ds = `${startYear}-07-${d}`;
    data[ds] = { dateString: ds, type: 'HEK', activityName: 'Masa Pengenalan Lingkungan Sekolah (MPLS)' };
  });

  // August 17 2026: Kemerdekaan RI (National Holiday check)
  data[`${startYear}-08-17`] = { dateString: `${startYear}-08-17`, type: 'LIBUR_NASIONAL', activityName: 'Hari Kemerdekaan RI' };

  // December 7-11 2026: PAS Ganjil
  ['07', '08', '09', '10', '11'].forEach(d => {
    const ds = `${startYear}-12-${d}`;
    data[ds] = { dateString: ds, type: 'HEK', activityName: 'Penilaian Akhir Semester (PAS) Ganjil' };
  });

  // December 14-17 2026: Class Meeting
  ['14', '15', '16', '17'].forEach(d => {
    const ds = `${startYear}-12-${d}`;
    data[ds] = { dateString: ds, type: 'HEK', activityName: 'Class Meeting' };
  });

  // December 18 2026: Rapor S1
  data[`${startYear}-12-18`] = { dateString: `${startYear}-12-18`, type: 'HEK', activityName: 'Pembagian Rapor Semester I' };

  // December 21-31 2026: Libur Akhir Semester I
  for (let d = 21; d <= 31; d++) {
    const ds = `${startYear}-12-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(startYear, 11, d);
    if (dateObj.getDay() !== 0 && dateObj.getDay() !== 6 && data[ds]?.type !== 'LIBUR_NASIONAL') {
      data[ds] = { dateString: ds, type: 'LIBUR_SEKOLAH', activityName: 'Libur Akhir Semester I' };
    }
  }

  return data;
}

export default function App() {
  const [selectedYear, setSelectedYear] = React.useState<number>(() => {
    const saved = localStorage.getItem('school_calendar_selected_year');
    return saved ? parseInt(saved, 10) : 2026;
  });

  const [academicYears, setAcademicYears] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('school_calendar_academic_years');
    return saved ? JSON.parse(saved) : [2025, 2026, 2027, 2028, 2029, 2030];
  });

  const [weeklyRestDays, setWeeklyRestDays] = React.useState<number[]>(() => {
    const saved = localStorage.getItem('school_calendar_weekly_rest_days');
    return saved ? JSON.parse(saved) : [0, 6]; // Sunday (0) & Saturday (6) as default
  });

  const [schoolName, setSchoolName] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_school_name');
    return saved || 'MI Cibungur I';
  });

  const [principalName, setPrincipalName] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_principal_name');
    return saved || 'H. Ahmad Sopyan, S.Pd.I.';
  });

  const [principalNip, setPrincipalNip] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_principal_nip');
    return saved || '197408122005011003';
  });

  const [teacherName, setTeacherName] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_teacher_name');
    return saved || 'Cepi Sopyan, S.Pd.';
  });

  const [teacherNip, setTeacherNip] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_teacher_nip');
    return saved || '199005142023211002';
  });

  const [signaturePlace, setSignaturePlace] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_signature_place');
    return saved || 'Cibungur';
  });

  const [signatureDate, setSignatureDate] = React.useState<string>(() => {
    const saved = localStorage.getItem('school_calendar_signature_date');
    return saved || '17 Juli 2026';
  });

  const [isEditingSchool, setIsEditingSchool] = React.useState<boolean>(false);
  const [tempSchoolName, setTempSchoolName] = React.useState<string>('');
  
  // State for academic calendar data indexed by "YYYY-MM-DD"
  const [calendarData, setCalendarData] = React.useState<Record<string, CalendarDay>>(() => {
    const saved = localStorage.getItem('school_calendar_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse calendar data', e);
      }
    }
    return generateInitialCalendar(2026);
  });

  React.useEffect(() => {
    localStorage.setItem('school_calendar_data', JSON.stringify(calendarData));
  }, [calendarData]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_selected_year', String(selectedYear));
  }, [selectedYear]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_academic_years', JSON.stringify(academicYears));
  }, [academicYears]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_weekly_rest_days', JSON.stringify(weeklyRestDays));
  }, [weeklyRestDays]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_school_name', schoolName);
  }, [schoolName]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_principal_name', principalName);
  }, [principalName]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_principal_nip', principalNip);
  }, [principalNip]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_teacher_name', teacherName);
  }, [teacherName]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_teacher_nip', teacherNip);
  }, [teacherNip]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_signature_place', signaturePlace);
  }, [signaturePlace]);

  React.useEffect(() => {
    localStorage.setItem('school_calendar_signature_date', signatureDate);
  }, [signatureDate]);

  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'calendar' | 'absen'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);

  // Quick statistics for the main Sidebar branding
  const totalHEB = useMemo(() => {
    return (Object.values(calendarData) as CalendarDay[]).filter(d => d.type === 'HEB').length;
  }, [calendarData]);

  const menuItems = [
    { id: 'dashboard', label: 'Menu Data', icon: LayoutDashboard, desc: 'Identitas & parameter sekolah' },
    { id: 'calendar', label: 'Kalender Pendidikan', icon: Calendar, desc: 'Atur hari efektif & libur' },
    { id: 'absen', label: 'Absen', icon: UserCheck, desc: 'Rekap & presensi siswa' },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800" id="main-app-container">
      
      {/* Sidebar Navigation (Left Panel) */}
      <aside 
        className={`bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 z-30 shrink-0 flex flex-col justify-between screen-only
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          fixed md:relative h-screen top-0 left-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        id="app-sidebar-rail"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & School Branding */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-md">
                <GraduationCap className="text-slate-900" size={22} />
              </div>
              {isSidebarOpen && (
                <div className="space-y-0.5">
                  <h1 className="text-sm font-black tracking-tight leading-none bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Sistem Administrasi
                  </h1>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Kurikulum Sekolah</span>
                </div>
              )}
            </div>

            {/* Mobile close sidebar button */}
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="md:hidden p-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Realtime Indicator Panel */}
          {isSidebarOpen && (
            <div className="mx-4 my-5 p-4 bg-slate-800/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Rangkuman Aktif</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs text-slate-300 font-medium block">Total HEB</span>
                  <span className="text-xl font-black text-slate-100">{totalHEB} Hari</span>
                </div>
                <div className="text-right text-[10px] text-emerald-400 font-semibold leading-normal">
                  Sangat Ideal
                </div>
              </div>
            </div>
          )}

          {/* Nav List */}
          <nav className="flex-1 px-3 space-y-1.5 py-4">
            {menuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    // On small screen, auto close sidebar when item is clicked
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-left cursor-pointer
                    ${isActive 
                      ? 'bg-emerald-600 text-white font-semibold shadow-md' 
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'}`}
                >
                  <IconComp size={18} className="shrink-0" />
                  {isSidebarOpen && (
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold block">{item.label}</span>
                      <span className={`text-[10px] block font-medium ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {item.desc}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Brand Credit */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center font-medium leading-relaxed">
            @2026 adm pendidikan, Cepi Sopyan DEV
          </div>
        )}
      </aside>

      {/* Main Panel Frame (Right Panel) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-100 py-3.5 px-6 shrink-0 flex items-center justify-between screen-only">
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition cursor-pointer"
            >
              <Menu size={18} />
            </button>

            <div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Administrasi Pendidikan</span>
              {isEditingSchool ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <BookOpen size={16} className="text-emerald-600 shrink-0" />
                  <input
                    type="text"
                    value={tempSchoolName}
                    onChange={(e) => setTempSchoolName(e.target.value)}
                    className="text-sm font-bold text-slate-700 border border-slate-200 focus:outline-none focus:border-emerald-500 py-0.5 px-1.5 bg-slate-50 rounded"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      if (tempSchoolName.trim()) {
                        setSchoolName(tempSchoolName.trim());
                      }
                      setIsEditingSchool(false);
                    }}
                    className="p-1 hover:bg-emerald-50 text-emerald-600 rounded cursor-pointer"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => setIsEditingSchool(false)}
                    className="p-1 hover:bg-slate-100 text-slate-400 rounded cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mt-0.5 group">
                  <BookOpen size={16} className="text-emerald-600" />
                  <span>{schoolName}</span>
                  <button
                    onClick={() => {
                      setTempSchoolName(schoolName);
                      setIsEditingSchool(true);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 md:opacity-0 group-hover:opacity-100 transition focus:opacity-100 cursor-pointer"
                    title="Ubah nama sekolah"
                  >
                    <Edit3 size={12} />
                  </button>
                </h2>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-200">
              <HelpCircle size={14} />
              Bantuan Administrasi
            </span>
          </div>
        </header>

        {/* Scrollable Active Workspace Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView 
              calendarData={calendarData} 
              setCalendarData={setCalendarData}
              selectedYear={selectedYear} 
              setSelectedYear={setSelectedYear}
              schoolName={schoolName}
              setSchoolName={setSchoolName}
              weeklyRestDays={weeklyRestDays}
              setWeeklyRestDays={setWeeklyRestDays}
              academicYears={academicYears}
              setAcademicYears={setAcademicYears}
              principalName={principalName}
              setPrincipalName={setPrincipalName}
              principalNip={principalNip}
              setPrincipalNip={setPrincipalNip}
              teacherName={teacherName}
              setTeacherName={setTeacherName}
              teacherNip={teacherNip}
              setTeacherNip={setTeacherNip}
              signaturePlace={signaturePlace}
              setSignaturePlace={setSignaturePlace}
              signatureDate={signatureDate}
              setSignatureDate={setSignatureDate}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView 
              calendarData={calendarData} 
              setCalendarData={setCalendarData}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              academicYears={academicYears}
              setAcademicYears={setAcademicYears}
              weeklyRestDays={weeklyRestDays}
              setWeeklyRestDays={setWeeklyRestDays}
              schoolName={schoolName}
              principalName={principalName}
              principalNip={principalNip}
              teacherName={teacherName}
              teacherNip={teacherNip}
              signaturePlace={signaturePlace}
              signatureDate={signatureDate}
            />
          )}

          {activeTab === 'absen' && (
            <AttendanceView 
              calendarData={calendarData}
              selectedYear={selectedYear}
              schoolName={schoolName}
              weeklyRestDays={weeklyRestDays}
              principalName={principalName}
              principalNip={principalNip}
              teacherName={teacherName}
              teacherNip={teacherNip}
              signaturePlace={signaturePlace}
              signatureDate={signatureDate}
            />
          )}
        </main>
      </div>
    </div>
  );
}
