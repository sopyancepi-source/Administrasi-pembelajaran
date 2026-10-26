import React, { useState, useMemo, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  Printer, 
  RotateCcw, 
  Check, 
  FileText, 
  Layers, 
  AlertCircle,
  AlertTriangle,
  Edit2,
  Save,
  Download,
  Info,
  ChevronRight,
  Settings,
  X,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  ListPlus
} from 'lucide-react';
import { CalendarDay } from '../types';
import { SubjectItem, SubjectCPData, DayOfWeek, TimeSlot, ScheduleGrid } from '../types/learning';
import { INITIAL_CP_TP_MAP } from '../data/learningDefaults';
import CPTPManagerModal from './learning/CPTPManagerModal';
import AlokasiWaktuTab from './learning/AlokasiWaktuTab';
import ProtaTab from './learning/ProtaTab';
import PromesTab from './learning/PromesTab';
import ModulAjarTab from './learning/ModulAjarTab';
import GenerateSoalTab from './learning/GenerateSoalTab';

interface PerangkatPembelajaranProps {
  schoolName: string;
  schoolLogo?: string;
  teacherName: string;
  teacherNip: string;
  principalName: string;
  principalNip: string;
  signaturePlace: string;
  signatureDate: string;
  calendarData?: Record<string, CalendarDay>;
  selectedYear?: number;
  weeklyRestDays?: number[];
  initialSubTab?: 'jadwal' | 'prota' | 'promes' | 'modul' | 'alokasi' | 'generate-soal';
  onSubTabChange?: (tab: 'jadwal' | 'prota' | 'promes' | 'modul' | 'alokasi' | 'generate-soal') => void;
}

const DEFAULT_COLOR_PALETTE = [
  '#0284c7', // Sky blue
  '#16a34a', // Emerald green
  '#d97706', // Amber
  '#9333ea', // Purple
  '#dc2626', // Red
  '#0891b2', // Cyan
  '#4f46e5', // Indigo
  '#ca8a04', // Yellow
  '#e11d48', // Rose
  '#059669', // Teal
];

const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 'sub-1', name: 'PAI', code: 'PAI', jpPerWeek: 3, color: '#16a34a' },
  { id: 'sub-2', name: 'Pendidikan Pancasila', code: 'PPKN', jpPerWeek: 4, color: '#dc2626' },
  { id: 'sub-3', name: 'Bahasa Indonesia', code: 'BIND', jpPerWeek: 6, color: '#0284c7' },
  { id: 'sub-4', name: 'Matematika', code: 'MTK', jpPerWeek: 5, color: '#d97706' },
  { id: 'sub-5', name: 'IPAS', code: 'IPAS', jpPerWeek: 5, color: '#059669' },
  { id: 'sub-6', name: 'PJOK', code: 'PJOK', jpPerWeek: 3, color: '#0891b2' },
  { id: 'sub-7', name: 'Seni Budaya', code: 'SENI', jpPerWeek: 3, color: '#9333ea' },
  { id: 'sub-8', name: 'Bahasa Inggris', code: 'BING', jpPerWeek: 2, color: '#4f46e5' },
  { id: 'sub-9', name: 'Mulok (B. Sunda)', code: 'MULOK', jpPerWeek: 2, color: '#ca8a04' },
  { id: 'sub-10', name: 'P5', code: 'P5', jpPerWeek: 2, color: '#e11d48' },
];

const DEFAULT_SUBJECTS_MI: SubjectItem[] = [
  { id: 'sub-mi-1', name: "Al-Qur'an Hadits", code: 'QURAN', jpPerWeek: 2, color: '#16a34a' },
  { id: 'sub-mi-2', name: 'Akidah Akhlak', code: 'AKIDAH', jpPerWeek: 2, color: '#059669' },
  { id: 'sub-mi-3', name: 'Fiqih', code: 'FIQIH', jpPerWeek: 2, color: '#0d9488' },
  { id: 'sub-mi-4', name: 'SKI', code: 'SKI', jpPerWeek: 2, color: '#0891b2' },
  { id: 'sub-mi-5', name: 'Bahasa Arab', code: 'B.ARAB', jpPerWeek: 2, color: '#0284c7' },
  { id: 'sub-mi-6', name: 'Pendidikan Pancasila', code: 'PPKN', jpPerWeek: 4, color: '#dc2626' },
  { id: 'sub-mi-7', name: 'Bahasa Indonesia', code: 'BIND', jpPerWeek: 6, color: '#2563eb' },
  { id: 'sub-mi-8', name: 'Matematika', code: 'MTK', jpPerWeek: 5, color: '#d97706' },
  { id: 'sub-mi-9', name: 'IPAS', code: 'IPAS', jpPerWeek: 5, color: '#ca8a04' },
  { id: 'sub-mi-10', name: 'PJOK', code: 'PJOK', jpPerWeek: 3, color: '#9333ea' },
  { id: 'sub-mi-11', name: 'Seni Budaya', code: 'SENI', jpPerWeek: 3, color: '#e11d48' },
  { id: 'sub-mi-12', name: 'Bahasa Inggris', code: 'BING', jpPerWeek: 2, color: '#4f46e5' },
];

const DEFAULT_TIME_SLOTS_5_DAYS: TimeSlot[] = [
  { 
    period: 0, 
    periodLabel: 'Pagi', 
    startTime: '07.00 - 07.15', 
    seninTime: '07.00 - 07.30', 
    isMorningActivity: true, 
    breakLabel: 'Pembiasaan Pagi (15 Mnt) / Upacara (30 Mnt)' 
  },
  { period: 1, periodLabel: '1', startTime: '07.15 - 07.50', seninTime: '07.30 - 08.05' },
  { period: 2, periodLabel: '2', startTime: '07.50 - 08.25', seninTime: '08.05 - 08.40' },
  { period: 3, periodLabel: '3', startTime: '08.25 - 09.00', seninTime: '08.40 - 09.15' },
  { period: 4, periodLabel: '4', startTime: '09.00 - 09.35', seninTime: '09.15 - 09.50' },
  { 
    period: 99, 
    periodLabel: 'IS1', 
    startTime: '09.35 - 10.05', 
    seninTime: '09.50 - 10.20', 
    isBreak: true, 
    breakLabel: 'ISTIRAHAT KE-1' 
  },
  { period: 5, periodLabel: '5', startTime: '10.05 - 10.40', seninTime: '10.20 - 10.55' },
  { period: 6, periodLabel: '6', startTime: '10.40 - 11.15', seninTime: '10.55 - 11.30' },
  { period: 7, periodLabel: '7', startTime: '11.15 - 11.50', seninTime: '11.30 - 12.05' },
  { 
    period: 98, 
    periodLabel: 'IS2', 
    startTime: '11.50 - 12.30', 
    seninTime: '12.05 - 12.45',
    isBreak: true, 
    breakLabel: 'ISTIRAHAT KE-2' 
  },
  { period: 8, periodLabel: '8', startTime: '12.30 - 13.05', seninTime: '12.45 - 13.20' },
];

// Helper to format time slot strings into range format (HH.MM - HH.MM)
const formatTimeRangeSlots = (slots: TimeSlot[]): TimeSlot[] => {
  return slots.map((slot, index) => {
    let cleanBreakLabel = slot.breakLabel;
    if (cleanBreakLabel) {
      cleanBreakLabel = cleanBreakLabel.replace(/\s*\(\d{2}[.:]\d{2}.*?\)/gi, '');
    }

    let rawTime = slot.startTime ? slot.startTime.trim() : '';
    if (!rawTime) return { ...slot, breakLabel: cleanBreakLabel };

    // If already has range '-'
    if (rawTime.includes('-')) {
      const formattedRange = rawTime
        .split('-')
        .map(t => t.trim().replace(':', '.'))
        .join(' - ');
      return { ...slot, startTime: formattedRange, breakLabel: cleanBreakLabel };
    }

    // Single time e.g. "07:15" or "07.15"
    const curStart = rawTime.replace(':', '.');
    let nextStart = '';

    if (index < slots.length - 1) {
      const nextSlotRaw = slots[index + 1].startTime || '';
      nextStart = nextSlotRaw.split('-')[0].trim().replace(':', '.');
    }

    if (nextStart && nextStart !== curStart) {
      return { ...slot, startTime: `${curStart} - ${nextStart}`, breakLabel: cleanBreakLabel };
    } else {
      // Fallback for last item or single item
      const parts = curStart.split('.');
      if (parts.length === 2) {
        let h = parseInt(parts[0], 10);
        let m = parseInt(parts[1], 10) + 35;
        if (!isNaN(h) && !isNaN(m)) {
          if (m >= 60) {
            h += Math.floor(m / 60);
            m = m % 60;
          }
          const endStr = `${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}`;
          return { ...slot, startTime: `${curStart} - ${endStr}`, breakLabel: cleanBreakLabel };
        }
      }
      return { ...slot, startTime: curStart, breakLabel: cleanBreakLabel };
    }
  });
};

export default function PerangkatPembelajaranView({
  schoolName,
  schoolLogo,
  teacherName,
  teacherNip,
  principalName,
  principalNip,
  signaturePlace,
  signatureDate,
  calendarData,
  selectedYear = 2026,
  weeklyRestDays = [0, 6],
  initialSubTab = 'jadwal',
  onSubTabChange,
}: PerangkatPembelajaranProps) {
  // Sub-menu tabs
  const [subTab, setSubTab] = useState<'jadwal' | 'prota' | 'promes' | 'modul' | 'alokasi' | 'generate-soal'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab && initialSubTab !== subTab) {
      setSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSubTabChange = (tab: 'jadwal' | 'prota' | 'promes' | 'modul' | 'alokasi' | 'generate-soal') => {
    setSubTab(tab);
    onSubTabChange?.(tab);
  };

  // Selected Class
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>('Kelas 1');

  // CP & TP Bank State (100% editable by user)
  const [cpDataMap, setCpDataMap] = useState<Record<string, SubjectCPData>>(() => {
    const saved = localStorage.getItem('school_learning_cp_tp_map');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CP_TP_MAP;
  });

  useEffect(() => {
    localStorage.setItem('school_learning_cp_tp_map', JSON.stringify(cpDataMap));
  }, [cpDataMap]);

  const [isCpModalOpen, setIsCpModalOpen] = useState<boolean>(false);

  // Navigation payload for Promes tab
  const [promesNav, setPromesNav] = useState<{ subjectId: string; semester: 1 | 2 } | null>(null);

  const handleSaveCpData = (subjectId: string, data: SubjectCPData) => {
    setCpDataMap(prev => ({
      ...prev,
      [subjectId]: data
    }));
  };

  const handleNavigateToPromes = (subjectId: string, semester: 1 | 2) => {
    setPromesNav({ subjectId, semester });
    handleSubTabChange('promes');
  };

  // Schedule Config
  const [schoolDays, setSchoolDays] = useState<number>(5); // 5 or 6 days
  const [subjects, setSubjects] = useState<SubjectItem[]>(() => {
    const saved = localStorage.getItem('school_schedule_subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    const saved = localStorage.getItem('school_schedule_time_slots');
    if (saved) {
      try {
        const parsed: TimeSlot[] = JSON.parse(saved);
        return formatTimeRangeSlots(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_TIME_SLOTS_5_DAYS;
  });

  const [scheduleGrid, setScheduleGrid] = useState<ScheduleGrid>(() => {
    const saved = localStorage.getItem('school_schedule_grid');
    return saved ? JSON.parse(saved) : {};
  });

  const [mondayUpacara, setMondayUpacara] = useState<boolean>(true);

  // Modal pop-up state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'mapel' | 'waktu'>('mapel');

  // New subject state
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubJp, setNewSubJp] = useState(2);
  const [newSubColor, setNewSubColor] = useState('#0284c7');

  // Editing subject inline state
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editSubName, setEditSubName] = useState('');
  const [editSubCode, setEditSubCode] = useState('');
  const [editSubJp, setEditSubJp] = useState(2);
  const [editSubColor, setEditSubColor] = useState('#0284c7');

  const handleStartEditSubject = (sub: SubjectItem) => {
    setEditingSubjectId(sub.id);
    setEditSubName(sub.name);
    setEditSubCode(sub.code);
    setEditSubJp(sub.jpPerWeek);
    setEditSubColor(sub.color || '#0284c7');
  };

  const handleSaveEditSubject = (id: string) => {
    if (!editSubName.trim()) return;
    setSubjects(prev => prev.map(s => s.id === id ? {
      ...s,
      name: editSubName.trim(),
      code: editSubCode.trim() || editSubName.slice(0, 4).toUpperCase(),
      jpPerWeek: Math.max(1, Number(editSubJp) || 1),
      color: editSubColor
    } : s));
    setEditingSubjectId(null);
  };

  const handleCancelEditSubject = () => {
    setEditingSubjectId(null);
  };

  // Auto-save to local storage
  useEffect(() => {
    localStorage.setItem('school_schedule_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    const formatted = formatTimeRangeSlots(timeSlots);
    const isDifferent = formatted.some((slot, idx) => slot.startTime !== timeSlots[idx]?.startTime);
    if (isDifferent) {
      setTimeSlots(formatted);
    } else {
      localStorage.setItem('school_schedule_time_slots', JSON.stringify(timeSlots));
    }
  }, [timeSlots]);

  useEffect(() => {
    localStorage.setItem('school_schedule_grid', JSON.stringify(scheduleGrid));
  }, [scheduleGrid]);

  // Days list
  const activeDays = useMemo<DayOfWeek[]>(() => {
    return schoolDays === 5 
      ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
      : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  }, [schoolDays]);

  // Total JP allocated across subjects
  const totalTargetJP = useMemo(() => {
    return subjects.reduce((sum, s) => sum + s.jpPerWeek, 0);
  }, [subjects]);

  // Total available learning slots in the current grid
  const availableSlotsCount = useMemo(() => {
    const teachingSlotsCount = timeSlots.filter(
      s => !s.isBreak && !s.isMorningActivity
    ).length;
    return activeDays.length * teachingSlotsCount;
  }, [activeDays, timeSlots]);

  // Count how many JP each subject occupies in the current schedule grid
  const subjectUsage = useMemo(() => {
    const counts: Record<string, number> = {};
    (Object.values(scheduleGrid) as string[]).forEach((val: string) => {
      if (val && !['UPACARA', 'PEMBIASAAN', 'ISTIRAHAT', 'PULANG', 'EMPTY'].includes(val)) {
        const sub = subjects.find(s => s.id === val || s.name === val || s.code === val);
        const subId = sub ? sub.id : val;
        counts[subId] = (counts[subId] || 0) + 1;
      }
    });
    return counts;
  }, [scheduleGrid, subjects]);

  // List of subjects exceeding their target jpPerWeek limit
  const overallocatedSubjects = useMemo(() => {
    return subjects.filter(s => {
      const count = subjectUsage[s.id] || 0;
      return count > s.jpPerWeek;
    });
  }, [subjects, subjectUsage]);

  // List of subjects below their target jpPerWeek limit
  const underallocatedSubjects = useMemo(() => {
    return subjects.filter(s => {
      const count = subjectUsage[s.id] || 0;
      return count < s.jpPerWeek;
    });
  }, [subjects, subjectUsage]);

  // Time slot handlers
  const handleUpdateTimeSlot = (periodId: number, field: keyof TimeSlot, value: any) => {
    setTimeSlots(prev => prev.map(slot => {
      if (slot.period === periodId) {
        return { ...slot, [field]: value };
      }
      return slot;
    }));
  };

  const handleAddTimeSlot = (type: 'kbm' | 'break' | 'morning' = 'kbm') => {
    const newPeriodId = Date.now();
    const kbmCount = timeSlots.filter(s => !s.isBreak && !s.isMorningActivity).length;
    
    let newSlot: TimeSlot;
    if (type === 'break') {
      newSlot = {
        period: newPeriodId,
        periodLabel: 'IS',
        startTime: '10:00 - 10:30',
        isBreak: true,
        breakLabel: 'ISTIRAHAT BARU (10:00 - 10:30)',
      };
    } else if (type === 'morning') {
      newSlot = {
        period: newPeriodId,
        periodLabel: 'Pagi',
        startTime: '07:00 - 07:15',
        isMorningActivity: true,
        breakLabel: 'Pembiasaan Pagi',
      };
    } else {
      newSlot = {
        period: newPeriodId,
        periodLabel: `${kbmCount + 1}`,
        startTime: '13:05 - 13:40',
        isBreak: false,
      };
    }

    setTimeSlots(prev => [...prev, newSlot]);
  };

  const handleRemoveTimeSlot = (periodId: number) => {
    if (timeSlots.length <= 1) {
      alert('Minimal harus ada 1 baris waktu!');
      return;
    }
    setTimeSlots(prev => prev.filter(s => s.period !== periodId));
    
    // Clean schedule grid
    const updated = { ...scheduleGrid };
    Object.keys(updated).forEach(key => {
      if (key.endsWith(`-${periodId}`)) {
        delete updated[key];
      }
    });
    setScheduleGrid(updated);
  };

  const handleMoveTimeSlot = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === timeSlots.length - 1) return;
    
    const newSlots = [...timeSlots];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSlots[index];
    newSlots[index] = newSlots[targetIndex];
    newSlots[targetIndex] = temp;
    setTimeSlots(newSlots);
  };

  const handleResetTimeSlots = () => {
    if (window.confirm('Reset seluruh struktur baris jam & waktu ke default SD?')) {
      setTimeSlots(DEFAULT_TIME_SLOTS_5_DAYS);
    }
  };

  // Add subject
  const handleAddSubject = () => {
    if (!newSubName.trim()) return;
    const newSub: SubjectItem = {
      id: 'sub-' + Date.now(),
      name: newSubName.trim(),
      code: newSubCode.trim() || newSubName.slice(0, 4).toUpperCase(),
      jpPerWeek: Number(newSubJp) || 1,
      color: newSubColor,
    };
    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setNewSubCode('');
    setNewSubJp(2);
  };

  // Remove subject
  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    // Clear from grid
    const updated = { ...scheduleGrid };
    Object.keys(updated).forEach(key => {
      if (updated[key] === id) {
        delete updated[key];
      }
    });
    setScheduleGrid(updated);
  };

  // Helper to detect religious/keagamaan priority subjects and rank them
  const getPriorityInfo = (name: string, code: string) => {
    const text = `${name} ${code}`.toLowerCase();
    if (text.includes('quran') || text.includes('qur\'an') || text.includes('hadits') || text.includes('hadis')) {
      return { isPriority: true, rank: 1 };
    }
    if (text.includes('akidah') || text.includes('aqidah') || text.includes('akhlak')) {
      return { isPriority: true, rank: 2 };
    }
    if (text.includes('fiqih') || text.includes('fikih')) {
      return { isPriority: true, rank: 3 };
    }
    if (text.includes('ski') || text.includes('kebudayaan islam')) {
      return { isPriority: true, rank: 4 };
    }
    if (text.includes('arab')) {
      return { isPriority: true, rank: 5 };
    }
    if (text.includes('pai') || text.includes('agama') || text.includes('keagamaan')) {
      return { isPriority: true, rank: 6 };
    }
    return { isPriority: false, rank: 99 };
  };

  // Reset to default
  const handleResetDefaults = (preset: 'sd' | 'mi' = 'sd') => {
    const label = preset === 'mi' ? 'MI / SD Islam (Lengkap Akidah, Al-Qur\'an H, Fiqih, SKI, B. Arab)' : 'SD Umum';
    if (window.confirm(`Reset daftar mata pelajaran dan jadwal ke pengaturan awal ${label}?`)) {
      setSubjects(preset === 'mi' ? DEFAULT_SUBJECTS_MI : DEFAULT_SUBJECTS);
      setScheduleGrid({});
    }
  };

  // Helper to determine if a time slot is a teaching (KBM) slot for a given day
  const isKbmSlot = (slot: TimeSlot, day: string) => {
    if (slot.isMorningActivity) return false;
    if (slot.isBreak) {
      if (day === 'Jumat' && (slot.period === 99 || slot.periodLabel === 'IS1' || slot.periodLabel === 'IS')) {
        return true; // Friday break time is used for KBM (jam pelajaran)!
      }
      return false;
    }
    return true;
  };

  // AUTOMATIC SCHEDULE GENERATOR ALGORITHM WITH STRICT JP ALLOCATION & ISLAMIC SUBJECT PRIORITIZATION
  const handleGenerateSchedule = () => {
    // 1. Calculate total target JP from subject list
    const totalTargetJP = subjects.reduce((acc, s) => acc + (s.jpPerWeek || 0), 0);

    // 2. Count current available KBM slots across active days
    let currentSlots = [...timeSlots];
    let availableCount = 0;
    activeDays.forEach(day => {
      currentSlots.forEach(slot => {
        if (isKbmSlot(slot, day)) {
          availableCount++;
        }
      });
    });

    // If available slots are fewer than totalTargetJP, automatically add extra KBM time slots!
    if (availableCount < totalTargetJP) {
      const deficit = totalTargetJP - availableCount;
      const extraRowsNeeded = Math.ceil(deficit / activeDays.length);
      
      const maxKbmPeriod = Math.max(
        ...currentSlots.filter(s => !s.isBreak && !s.isMorningActivity).map(s => s.period),
        0
      );

      const newSlots: TimeSlot[] = [...currentSlots];
      for (let i = 1; i <= extraRowsNeeded; i++) {
        const periodNum = maxKbmPeriod + i;
        const startH = 13 + Math.floor((i - 1) * 35 / 60);
        const startM = ((i - 1) * 35) % 60;
        const endH = 13 + Math.floor((i * 35) / 60);
        const endM = (i * 35) % 60;
        const pad = (n: number) => n.toString().padStart(2, '0');
        const timeStr = `${pad(startH)}:${pad(startM)} - ${pad(endH)}:${pad(endM)}`;

        newSlots.push({
          period: periodNum,
          periodLabel: `${periodNum}`,
          startTime: timeStr,
          seninTime: timeStr,
        });
      }

      currentSlots = newSlots;
      setTimeSlots(newSlots);
    }

    const newGrid: ScheduleGrid = {};

    // 3. Mark Fixed Slots (Upacara, Pembiasaan, Istirahat)
    activeDays.forEach(day => {
      currentSlots.forEach(slot => {
        const key = `${day}-${slot.period}`;
        if (slot.isBreak) {
          if (day !== 'Jumat') {
            newGrid[key] = 'ISTIRAHAT';
          }
        } else if (slot.isMorningActivity) {
          if (day === 'Senin') {
            newGrid[key] = 'UPACARA';
          } else {
            newGrid[key] = 'PEMBIASAAN';
          }
        }
      });
    });

    // 4. Build Subject Block Chunks strictly derived from jpPerWeek
    interface SubjectBlock {
      subjectId: string;
      size: number;
      isPriority: boolean;
      rank: number;
    }

    const blocks: SubjectBlock[] = [];

    // Shuffle active subjects slightly to randomize day assignments on each generate
    const shuffledSubjects = [...subjects].filter(s => (s.jpPerWeek || 0) > 0).sort(() => Math.random() - 0.5);

    shuffledSubjects.forEach(s => {
      const priorityInfo = getPriorityInfo(s.name, s.code);
      let rem = s.jpPerWeek || 0;

      // Break into blocks of 2 JP (and 1 JP for remainders)
      while (rem > 0) {
        let blockSize = 2;
        if (rem === 1) {
          blockSize = 1;
        } else if (rem === 3) {
          // If 3 JP total (like PJOK), create a 2 JP block first, then 1 JP block
          blockSize = 2;
        }
        blocks.push({
          subjectId: s.id,
          size: blockSize,
          isPriority: priorityInfo.isPriority,
          rank: priorityInfo.rank,
        });
        rem -= blockSize;
      }
    });

    // Sort blocks: Priority (Islamic) first, then larger blocks (size 2) before size 1
    blocks.sort((a, b) => {
      if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
      if (a.isPriority && b.isPriority && a.rank !== b.rank) return a.rank - b.rank;
      return b.size - a.size;
    });

    // Track how many JP of each subject is assigned per day
    const daySubjectCounts: Record<string, Record<string, number>> = {};
    activeDays.forEach(day => {
      daySubjectCounts[day] = {};
    });

    // Helper: Find available KBM slots for a given day
    const getAvailableKbmSlotsForDay = (day: DayOfWeek) => {
      return currentSlots.filter(s => {
        const key = `${day}-${s.period}`;
        return isKbmSlot(s, day) && !newGrid[key];
      });
    };

    // Helper to shuffle array
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    // 5. Place each block into the schedule grid
    blocks.forEach(block => {
      let placed = false;

      // Strategy A: Try placing in a day with 'block.size' CONSECUTIVE empty KBM slots
      // and where daySubjectCounts[day][block.subjectId] == 0 (to spread across days)
      const candidateDays: DayOfWeek[] = shuffle([...activeDays]);

      for (const day of candidateDays) {
        const dayCount = (daySubjectCounts[day] && daySubjectCounts[day][block.subjectId]) || 0;
        const subObj = subjects.find(s => s.id === block.subjectId);
        const maxPerDay = (subObj && subObj.jpPerWeek >= 5) ? 3 : 2;

        if (dayCount + block.size > maxPerDay) continue;

        const availableSlots = getAvailableKbmSlotsForDay(day);
        if (availableSlots.length < block.size) continue;

        // Check for consecutive slots
        for (let i = 0; i <= availableSlots.length - block.size; i++) {
          let isConsecutive = true;
          for (let j = 0; j < block.size - 1; j++) {
            const idx1 = currentSlots.findIndex(s => s.period === availableSlots[i + j].period);
            const idx2 = currentSlots.findIndex(s => s.period === availableSlots[i + j + 1].period);
            if (idx2 !== idx1 + 1) {
              isConsecutive = false;
              break;
            }
          }

          if (isConsecutive || block.size === 1) {
            // Place block here!
            for (let j = 0; j < block.size; j++) {
              const slot = availableSlots[i + j];
              const key = `${day}-${slot.period}`;
              newGrid[key] = block.subjectId;
            }
            if (!daySubjectCounts[day]) daySubjectCounts[day] = {};
            daySubjectCounts[day][block.subjectId] = dayCount + block.size;
            placed = true;
            break;
          }
        }

        if (placed) break;
      }

      // Strategy B: Fallback - Place in any day with enough empty slots (even if not strictly consecutive)
      if (!placed) {
        for (const day of candidateDays) {
          const availableSlots = getAvailableKbmSlotsForDay(day);
          if (availableSlots.length >= block.size) {
            for (let j = 0; j < block.size; j++) {
              const slot = availableSlots[j];
              const key = `${day}-${slot.period}`;
              newGrid[key] = block.subjectId;
            }
            if (!daySubjectCounts[day]) daySubjectCounts[day] = {};
            daySubjectCounts[day][block.subjectId] = (daySubjectCounts[day][block.subjectId] || 0) + block.size;
            placed = true;
            break;
          }
        }
      }

      // Strategy C: Absolute Fallback - Place slot by slot in ANY available KBM slot across activeDays
      if (!placed) {
        let remainingToPlace = block.size;
        for (const day of activeDays) {
          const availableSlots = getAvailableKbmSlotsForDay(day);
          for (const slot of availableSlots) {
            if (remainingToPlace <= 0) break;
            const key = `${day}-${slot.period}`;
            newGrid[key] = block.subjectId;
            daySubjectCounts[day][block.subjectId] = (daySubjectCounts[day][block.subjectId] || 0) + 1;
            remainingToPlace--;
          }
          if (remainingToPlace <= 0) {
            placed = true;
            break;
          }
        }
      }
    });

    setScheduleGrid(newGrid);
  };

  // Change single cell manually with validation and warning alert
  const handleCellChange = (day: DayOfWeek, period: number, val: string) => {
    const key = `${day}-${period}`;
    const previousVal = scheduleGrid[key];

    const selectedSub = subjects.find(s => s.id === val || s.name === val || s.code === val);
    const targetVal = selectedSub ? selectedSub.id : val;

    if (targetVal && targetVal !== 'EMPTY' && !['UPACARA', 'PEMBIASAAN', 'ISTIRAHAT', 'PULANG'].includes(targetVal)) {
      if (selectedSub) {
        const currentUsage = subjectUsage[selectedSub.id] || 0;
        const countAfter = (previousVal === selectedSub.id || previousVal === selectedSub.name || previousVal === selectedSub.code) ? currentUsage : currentUsage + 1;

        if (countAfter > selectedSub.jpPerWeek) {
          const excess = countAfter - selectedSub.jpPerWeek;
          alert(
            `⚠️ PERINGATAN ALOKASI MELEBIHI ATURAN!\n\n` +
            `Mata pelajaran "${selectedSub.name} (${selectedSub.code})" hanya memiliki jatah alokasi ${selectedSub.jpPerWeek} JP/minggu.\n` +
            `Saat ini sudah terpasang ${currentUsage} JP di jadwal.\n\n` +
            `Memilih ini akan membuat total alokasi terpasang = ${countAfter} JP (melebihi ${excess} JP).\n` +
            `Sel jadwal bersangkutan akan ditandai dengan WARNA MERAH!`
          );
        }
      }
    }

    const updated = { ...scheduleGrid };
    if (!targetVal || targetVal === 'EMPTY') {
      delete updated[key];
    } else {
      updated[key] = targetVal;
    }
    setScheduleGrid(updated);
  };

  // Print handle
  const handlePrint = () => {
    window.print();
  };

  // Dedicated View for Generate Soal (tanpa jadwal pelajaran, analisis waktu, prota, promes, dll.)
  if (subTab === 'generate-soal') {
    return (
      <div className="space-y-6 pb-12">
        <GenerateSoalTab
          subjects={subjects}
          selectedClassLevel={selectedClassLevel}
          setSelectedClassLevel={setSelectedClassLevel}
          cpDataMap={cpDataMap}
          onOpenCpModal={() => setIsCpModalOpen(true)}
          schoolName={schoolName}
          schoolLogo={schoolLogo}
          principalName={principalName}
          principalNip={principalNip}
          teacherName={teacherName}
          teacherNip={teacherNip}
          signaturePlace={signaturePlace}
          signatureDate={signatureDate}
          selectedYear={selectedYear}
          onBackToPerangkat={() => handleSubTabChange('jadwal')}
        />

        {/* CP & TP MANAGER MODAL (100% FLEXIBLE INPUT) */}
        <CPTPManagerModal
          isOpen={isCpModalOpen}
          onClose={() => setIsCpModalOpen(false)}
          subjects={subjects}
          selectedClassLevel={selectedClassLevel}
          cpDataMap={cpDataMap}
          onSaveCpData={handleSaveCpData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 screen-only">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Perangkat Pembelajaran
            </span>
            <span className="text-xs font-semibold text-slate-400">• Administrasi Guru</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrasi & Perangkat Guru
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            Kelola jadwal pelajaran mingguan, program tahunan, program semester, modul ajar, dan analisis alokasi waktu secara otomatis dan rapi.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer size={15} />
            <span>Cetak Jadwal</span>
          </button>
        </div>
      </div>

      {/* SUB MENU TABS */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-1 border border-slate-200/80 screen-only">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => handleSubTabChange('jadwal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'jadwal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Clock size={15} />
            <span>Jadwal Pelajaran</span>
          </button>

          <button
            onClick={() => handleSubTabChange('alokasi')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'alokasi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <FileText size={15} />
            <span>Analisis Alokasi Waktu</span>
          </button>

          <button
            onClick={() => handleSubTabChange('prota')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'prota'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Calendar size={15} />
            <span>Program Tahunan (Prota)</span>
          </button>

          <button
            onClick={() => handleSubTabChange('promes')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'promes'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Layers size={15} />
            <span>Program Semester (Promes)</span>
          </button>

          <button
            onClick={() => handleSubTabChange('modul')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'modul'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <BookOpen size={15} />
            <span>Modul Ajar / RPP</span>
          </button>

          <button
            onClick={() => handleSubTabChange('generate-soal')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              subTab === 'generate-soal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Sparkles size={15} />
            <span>Generate Soal</span>
          </button>
        </div>

        {/* Dedicated CP/TP Manager Trigger Button */}
        <div className="pl-2">
          <button
            onClick={() => setIsCpModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
            title="Buka wadah input Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) yang bebas diedit manual"
          >
            <BookOpen size={14} />
            <span>Wadah Input CP & TP (Fleksibel)</span>
          </button>
        </div>
      </div>

      {/* SUB TAB 1: JADWAL PELAJARAN (CORE FEATURE) */}
      {subTab === 'jadwal' && (
        <div className="space-y-6">
          {/* TOOLBAR FOR QUICK ACTIONS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
                <span>Tingkat Kelas:</span>
                <select
                  value={selectedClassLevel}
                  onChange={(e) => setSelectedClassLevel(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-0.5 text-xs font-extrabold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="Kelas 1">Kelas 1</option>
                  <option value="Kelas 2">Kelas 2</option>
                  <option value="Kelas 3">Kelas 3</option>
                  <option value="Kelas 4">Kelas 4</option>
                  <option value="Kelas 5">Kelas 5</option>
                  <option value="Kelas 6">Kelas 6</option>
                </select>
              </div>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
                • {subjects.length} Mapel | {totalTargetJP} JP Total
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Settings size={15} />
                <span>Atur Mapel & Jam (Pop-Up)</span>
              </button>

              <button
                onClick={handleGenerateSchedule}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Sparkles size={15} />
                <span>Generate Otomatis</span>
              </button>
            </div>
          </div>

          {/* POPUP MODAL DIALOG FOR SETTINGS */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto screen-only">
              <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
                
                {/* Modal Header */}
                <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
                      <SlidersHorizontal size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider">Pengaturan Mapel & Jadwal Pelajaran</h3>
                      <p className="text-[11px] text-slate-400">Atur alokasi jam pelajaran dan sistem hari sekolah</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
                  
                  {/* Modal Tab Switcher */}
                  <div className="flex border border-slate-200 p-1 bg-white rounded-xl shadow-xs">
                    <button
                      onClick={() => setModalTab('mapel')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        modalTab === 'mapel' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BookOpen size={15} className={modalTab === 'mapel' ? 'text-emerald-400' : 'text-emerald-600'} />
                      <span>1. Mata Pelajaran & Alokasi JP ({subjects.length})</span>
                    </button>
                    <button
                      onClick={() => setModalTab('waktu')}
                      className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        modalTab === 'waktu' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Clock size={15} className={modalTab === 'waktu' ? 'text-emerald-400' : 'text-emerald-600'} />
                      <span>2. Struktur Baris Jam Pelajaran & Waktu ({timeSlots.length} Baris)</span>
                    </button>
                  </div>

                  {modalTab === 'mapel' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* LEFT: SUBJECT MANAGER (MATA PELAJARAN) */}
                      <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <BookOpen size={15} className="text-emerald-600" />
                              Daftar Mata Pelajaran & Alokasi JP
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleResetDefaults('sd')}
                              className="text-[10px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
                              title="Reset ke struktur mapel SD Umum"
                            >
                              <RotateCcw size={11} />
                              <span>Default SD</span>
                            </button>
                            <span className="text-slate-300">•</span>
                            <button
                              onClick={() => handleResetDefaults('mi')}
                              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg"
                              title="Reset ke struktur mapel MI / SD Islam (Akidah, Al-Qur'an H, Fiqih, SKI, B. Arab)"
                            >
                              <Sparkles size={11} />
                              <span>Preset MI / SD Islam</span>
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar of allocated JP */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold">
                            <span className="text-slate-700">Total Alokasi JP/Minggu:</span>
                            <span className={`font-mono text-xs ${totalTargetJP === availableSlotsCount ? 'text-emerald-600 font-black' : 'text-amber-600'}`}>
                              {totalTargetJP} JP <span className="text-slate-400 font-normal">/ {availableSlotsCount} slot</span>
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                            <div 
                              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                              style={{ width: `${Math.min(100, (totalTargetJP / (availableSlotsCount || 1)) * 100)}%` }}
                            />
                          </div>

                          {/* Subject Status Summary Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-bold">
                            {underallocatedSubjects.length > 0 && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-300 rounded-md flex items-center gap-1">
                                <span>⚠️ {underallocatedSubjects.length} Mapel Kurang JP</span>
                              </span>
                            )}
                            {overallocatedSubjects.length > 0 && (
                              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-md flex items-center gap-1">
                                <span>❌ {overallocatedSubjects.length} Mapel Over JP</span>
                              </span>
                            )}
                            {underallocatedSubjects.length === 0 && overallocatedSubjects.length === 0 && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md flex items-center gap-1">
                                <span>✅ Semua Mapel Lengkap & Sesuai Target</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subject Table List */}
                        <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                          {subjects.map((sub) => {
                            const usage = subjectUsage[sub.id] || 0;
                            const isExcess = usage > sub.jpPerWeek;
                            const isUnder = usage < sub.jpPerWeek;
                            const isExact = usage === sub.jpPerWeek;
                            const isEditing = editingSubjectId === sub.id;

                            if (isEditing) {
                              return (
                                <div 
                                  key={sub.id} 
                                  className="p-2 rounded-xl border border-emerald-400 bg-emerald-50/70 space-y-2 text-xs shadow-xs"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
                                    <div className="sm:col-span-5 flex items-center gap-1.5">
                                      <input 
                                        type="color" 
                                        value={editSubColor} 
                                        onChange={(e) => setEditSubColor(e.target.value)}
                                        className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0 bg-transparent shrink-0"
                                        title="Warna Label Mapel"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Nama Mapel"
                                        value={editSubName}
                                        onChange={(e) => setEditSubName(e.target.value)}
                                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="sm:col-span-2">
                                      <input
                                        type="text"
                                        placeholder="Kode"
                                        value={editSubCode}
                                        onChange={(e) => setEditSubCode(e.target.value)}
                                        className="w-full px-1.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-center text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="sm:col-span-2 flex items-center gap-1">
                                      <input
                                        type="number"
                                        min={1}
                                        max={15}
                                        value={editSubJp}
                                        onChange={(e) => setEditSubJp(Number(e.target.value))}
                                        className="w-full px-1 py-1 bg-white border border-slate-300 rounded-lg text-xs text-center font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                      />
                                      <span className="text-[10px] text-slate-500 font-bold shrink-0">JP</span>
                                    </div>
                                    <div className="sm:col-span-3 flex items-center gap-1 justify-end">
                                      <button
                                        onClick={() => handleSaveEditSubject(sub.id)}
                                        className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                                        title="Simpan Perubahan"
                                      >
                                        <Check size={13} />
                                      </button>
                                      <button
                                        onClick={handleCancelEditSubject}
                                        className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                                        title="Batal"
                                      >
                                        <X size={13} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div 
                                key={sub.id} 
                                className={`relative group flex items-center justify-between p-2.5 rounded-xl border transition-all text-xs ${
                                  isExcess 
                                    ? 'bg-rose-100/90 border-2 border-rose-400 shadow-2xs' 
                                    : isUnder 
                                      ? 'bg-rose-100/90 border-2 border-rose-500 shadow-2xs' 
                                      : 'bg-emerald-50/30 border-emerald-200/80 hover:bg-white'
                                }`}
                                title={
                                  isUnder 
                                    ? `PEMBERITAHUAN: Mapel ${sub.name} kurang ${sub.jpPerWeek - usage} JP dari alokasi yang diatur!` 
                                    : isExcess 
                                      ? `PEMBERITAHUAN: Mapel ${sub.name} kelebihan ${usage - sub.jpPerWeek} JP!` 
                                      : `Mapel ${sub.name}: Alokasi lengkap (${usage}/${sub.jpPerWeek} JP)`
                                }
                              >
                                {/* Pop-up Notification on Pointer Hover/Touch */}
                                {(isUnder || isExcess) && (
                                  <div className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-rose-900 text-white text-[11px] rounded-xl shadow-xl z-50 border border-rose-400 text-center font-sans space-y-1">
                                    <div className="font-extrabold text-rose-200 flex items-center justify-center gap-1 uppercase tracking-wider text-[10px]">
                                      <span>⚠️ PEMBERITAHUAN JAM MAPEL</span>
                                    </div>
                                    <div className="font-bold text-white leading-tight">
                                      {sub.name} ({sub.code})
                                    </div>
                                    <div className="text-[10px] text-rose-100 bg-rose-950/80 px-2 py-1 rounded-md border border-rose-700/60 font-mono">
                                      {isUnder ? (
                                        <>Alokasi kurang <span className="font-black text-rose-300">{sub.jpPerWeek - usage} JP</span>! Baru terpasang {usage} dari target {sub.jpPerWeek} JP.</>
                                      ) : (
                                        <>Alokasi kelebihan <span className="font-black text-rose-300">{usage - sub.jpPerWeek} JP</span>! Terpasang {usage} dari target {sub.jpPerWeek} JP.</>
                                      )}
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-rose-900" />
                                  </div>
                                )}

                                <div className="flex items-center gap-2.5">
                                  <span className="w-2.5 h-6 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                                  <div>
                                    <div className="font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                                      <span>{sub.name}</span>
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-slate-200/80 text-slate-700">
                                        {sub.code}
                                      </span>
                                    </div>
                                    <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                                      Terpasang di jadwal: {' '}
                                      <span className={isExcess ? 'text-rose-700 font-extrabold' : isUnder ? 'text-rose-700 font-extrabold' : 'text-emerald-700 font-bold'}>
                                        {usage} JP
                                      </span>
                                      <span className="text-slate-400"> / target {sub.jpPerWeek} JP</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200" title="Ubah target JP per minggu">
                                    <input
                                      type="number"
                                      min={1}
                                      max={15}
                                      value={sub.jpPerWeek}
                                      onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        setSubjects(subjects.map(s => s.id === sub.id ? { ...s, jpPerWeek: val } : s));
                                      }}
                                      className="w-8 text-center font-bold text-slate-800 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400 font-semibold">JP</span>
                                  </div>

                                  <button
                                    onClick={() => handleStartEditSubject(sub)}
                                    className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                                    title="Edit Mata Pelajaran"
                                  >
                                    <Edit2 size={13} />
                                  </button>

                                  <button
                                    onClick={() => handleRemoveSubject(sub.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Hapus Mata Pelajaran"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Add New Subject Form */}
                        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-5">
                            <input
                              type="text"
                              placeholder="Nama Mapel Baru"
                              value={newSubName}
                              onChange={(e) => setNewSubName(e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="text"
                              placeholder="Kode"
                              value={newSubCode}
                              onChange={(e) => setNewSubCode(e.target.value)}
                              className="w-full px-1.5 py-1.5 border border-slate-200 rounded-xl text-xs font-mono text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={newSubJp}
                              onChange={(e) => setNewSubJp(Number(e.target.value))}
                              className="w-full px-1.5 py-1.5 border border-slate-200 rounded-xl text-xs text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <button
                              onClick={handleAddSubject}
                              className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                            >
                              <Plus size={13} />
                              <span>Tambah</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT: GENERATOR & TIME CONFIG */}
                      <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                          <div className="border-b border-slate-100 pb-2">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                              <Clock size={15} className="text-emerald-600" />
                              Sistem Jam & Kelas
                            </h3>
                          </div>

                          {/* Class Level Selector */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Tingkat Kelas:</label>
                            <select
                              value={selectedClassLevel}
                              onChange={(e) => setSelectedClassLevel(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                            >
                              <option value="Kelas 1">Kelas 1</option>
                              <option value="Kelas 2">Kelas 2</option>
                              <option value="Kelas 3">Kelas 3</option>
                              <option value="Kelas 4">Kelas 4</option>
                              <option value="Kelas 5">Kelas 5</option>
                              <option value="Kelas 6">Kelas 6</option>
                            </select>
                          </div>

                          {/* Day option */}
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Hari Sekolah / Minggu:</label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => setSchoolDays(5)}
                                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                                  schoolDays === 5
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                5 Hari (Senin-Jumat)
                              </button>
                              <button
                                onClick={() => setSchoolDays(6)}
                                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                                  schoolDays === 6
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                6 Hari (Senin-Sabtu)
                              </button>
                            </div>
                          </div>

                          {/* Special slots toggles */}
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-700">
                              <input
                                type="checkbox"
                                checked={mondayUpacara}
                                onChange={(e) => setMondayUpacara(e.target.checked)}
                                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                              />
                              <span>Kunci Jam 1 Hari Senin untuk Upacara</span>
                            </label>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-[11px] text-amber-800 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <Info size={13} />
                            <span>Penyusunan Otomatis</span>
                          </div>
                          <p className="text-slate-600">
                            Klik tombol &quot;Generate & Simpan&quot; di bawah untuk membuat susunan jam pelajaran secara acak & seimbang.
                          </p>
                        </div>
                      </div>

                    </div>
                  ) : (
                    /* TAB 2: TIME SLOTS MANAGER */
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Clock size={16} className="text-emerald-600" />
                            Kelola Baris Jam & Rentang Waktu
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Tambah, edit label jam, ubah waktu, atau atur ulang urutan baris jadwal
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => handleAddTimeSlot('kbm')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>+ Jam KBM</span>
                          </button>

                          <button
                            onClick={() => handleAddTimeSlot('break')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>+ Istirahat</span>
                          </button>

                          <button
                            onClick={() => handleAddTimeSlot('morning')}
                            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <Plus size={14} />
                            <span>+ Kegiatan Pagi</span>
                          </button>

                          <button
                            onClick={handleResetTimeSlots}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title="Reset ke Default SD"
                          >
                            <RotateCcw size={13} />
                            <span>Reset Default</span>
                          </button>
                        </div>
                      </div>

                      {/* TIME SLOTS TABLE */}
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-xs text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                            <tr>
                              <th className="p-2.5 w-12 text-center">Urutan</th>
                              <th className="p-2.5 w-20 text-center">Label Jam</th>
                              <th className="p-2.5 w-36">Rentang Waktu</th>
                              <th className="p-2.5 w-32">Jenis Baris</th>
                              <th className="p-2.5">Keterangan Khusus</th>
                              <th className="p-2.5 w-16 text-center">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {timeSlots.map((slot, index) => (
                              <tr key={slot.period} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-2 text-center">
                                  <div className="flex items-center justify-center gap-0.5">
                                    <button
                                      onClick={() => handleMoveTimeSlot(index, 'up')}
                                      disabled={index === 0}
                                      className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                                      title="Naikkan"
                                    >
                                      <ArrowUp size={12} />
                                    </button>
                                    <button
                                      onClick={() => handleMoveTimeSlot(index, 'down')}
                                      disabled={index === timeSlots.length - 1}
                                      className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                                      title="Turunkan"
                                    >
                                      <ArrowDown size={12} />
                                    </button>
                                  </div>
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={slot.periodLabel}
                                    onChange={(e) => handleUpdateTimeSlot(slot.period, 'periodLabel', e.target.value)}
                                    className="w-full px-2 py-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="e.g. 1, IS"
                                  />
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={slot.startTime}
                                    onChange={(e) => handleUpdateTimeSlot(slot.period, 'startTime', e.target.value)}
                                    className="w-full px-2 py-1 font-mono text-[11px] text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="07:15 - 07:50"
                                  />
                                </td>

                                <td className="p-2">
                                  <select
                                    value={slot.isBreak ? 'break' : slot.isMorningActivity ? 'morning' : 'kbm'}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === 'break') {
                                        handleUpdateTimeSlot(slot.period, 'isBreak', true);
                                        handleUpdateTimeSlot(slot.period, 'isMorningActivity', false);
                                      } else if (val === 'morning') {
                                        handleUpdateTimeSlot(slot.period, 'isBreak', false);
                                        handleUpdateTimeSlot(slot.period, 'isMorningActivity', true);
                                      } else {
                                        handleUpdateTimeSlot(slot.period, 'isBreak', false);
                                        handleUpdateTimeSlot(slot.period, 'isMorningActivity', false);
                                      }
                                    }}
                                    className="w-full px-2 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                                  >
                                    <option value="kbm">Jam KBM</option>
                                    <option value="break">Istirahat</option>
                                    <option value="morning">Kegiatan Pagi</option>
                                  </select>
                                </td>

                                <td className="p-2">
                                  <input
                                    type="text"
                                    value={slot.breakLabel || ''}
                                    onChange={(e) => handleUpdateTimeSlot(slot.period, 'breakLabel', e.target.value)}
                                    disabled={!slot.isBreak && !slot.isMorningActivity}
                                    className="w-full px-2 py-1 text-xs text-slate-700 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                                    placeholder={slot.isBreak ? 'ISTIRAHAT' : slot.isMorningActivity ? 'PEMBIASAAN' : '-'}
                                  />
                                </td>

                                <td className="p-2 text-center">
                                  <button
                                    onClick={() => handleRemoveTimeSlot(slot.period)}
                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus Baris Ini"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-semibold">
                    *Semua perubahan tersimpan otomatis di perangkat Anda
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        handleGenerateSchedule();
                        setIsModalOpen(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles size={15} />
                      <span>Generate & Simpan</span>
                    </button>

                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Check size={15} />
                      <span>Simpan & Tutup</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PRINTABLE SCHEDULE MATRIX (TABLE VIEW) */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            
            {/* Kop / Header for Printable Format */}
            <div className="text-center space-y-1.5 pb-4 border-b border-slate-200">
              <h2 className="text-lg md:text-xl font-black uppercase tracking-wider text-slate-900">
                JADWAL PELAJARAN {selectedClassLevel.toUpperCase()}
              </h2>
              <p className="text-xs font-bold text-slate-700">
                {schoolName || 'SD NEGERI 1 CIPEUNDEUY'} • TAHUN AJARAN 2026/2027
              </p>
            </div>

            {/* Warning Alert Banner for Overallocated Subjects */}
            {overallocatedSubjects.length > 0 && (
              <div className="bg-rose-50 border-2 border-rose-500 p-4 rounded-2xl shadow-xs space-y-2 screen-only">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-rose-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs md:text-sm text-rose-900 uppercase tracking-wider flex items-center gap-2">
                        <span>PERINGATAN: ALOKASI JADWAL MELEBIHI ATURAN KURIKULUM</span>
                        <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full">
                          {overallocatedSubjects.length} Mapel Over JP
                        </span>
                      </h4>
                    </div>
                    <p className="text-xs text-rose-700 font-medium leading-relaxed">
                      Beberapa mata pelajaran terpasang di jadwal melebihi jatah JP/minggu yang ditentukan. Kolom sel jadwal bersangkutan telah ditandai khusus dengan <strong className="text-rose-900 bg-rose-200 px-1 rounded font-bold">WARNA MERAH</strong>.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {overallocatedSubjects.map(s => {
                        const count = subjectUsage[s.id] || 0;
                        return (
                          <div key={s.id} className="bg-white border border-rose-300 text-rose-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                            <span>{s.name} ({s.code}):</span>
                            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-black">
                              {count} / {s.jpPerWeek} JP
                            </span>
                            <span className="text-[10px] text-rose-600 font-extrabold">(Melebihi +{count - s.jpPerWeek} JP)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Alert Banner for Underallocated Subjects */}
            {underallocatedSubjects.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl shadow-xs space-y-2 screen-only">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                    <AlertTriangle size={20} />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-xs md:text-sm text-amber-900 uppercase tracking-wider flex items-center gap-2">
                        <span>INFORMASI: ALOKASI MAPEL BELUM CUKUP ATURAN KURIKULUM</span>
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-full">
                          {underallocatedSubjects.length} Mapel Kurang JP
                        </span>
                      </h4>
                    </div>
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      Beberapa mata pelajaran di bawah belum mencapai jatah JP/minggu yang diatur pada menu <strong className="text-amber-950 font-bold bg-amber-200/80 px-1 rounded">Atur Mapel & Jam</strong>. Tambahkan jam pelajaran tersebut ke sel yang masih kosong.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      {underallocatedSubjects.map(s => {
                        const count = subjectUsage[s.id] || 0;
                        const diff = s.jpPerWeek - count;
                        return (
                          <div key={s.id} className="bg-white border border-amber-300 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            <span>{s.name} ({s.code}):</span>
                            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">
                              {count} / {s.jpPerWeek} JP
                            </span>
                            <span className="text-[10px] text-amber-700 font-extrabold">(Kurang -{diff} JP)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-center border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-black uppercase text-[11px] tracking-wider">
                    <th className="border border-slate-800 py-2.5 px-2 w-14">Jam Ke</th>
                    <th className="border border-slate-800 py-2.5 px-1.5 w-28 min-w-[110px]">Waktu</th>
                    {activeDays.map(day => (
                      <th key={day} className="border border-slate-800 py-2.5 px-2 min-w-[120px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => {
                    if (slot.isBreak) {
                      return (
                        <tr key={`slot-${slot.period}`} className="bg-amber-100/80 text-amber-900 font-extrabold border-b border-slate-300 group">
                          <td className="border border-slate-300 py-2 px-1 font-mono text-[11px] bg-amber-200/50">
                            <input
                              type="text"
                              value={slot.periodLabel}
                              onChange={(e) => handleUpdateTimeSlot(slot.period, 'periodLabel', e.target.value)}
                              className="w-full text-center bg-transparent focus:bg-white font-mono font-bold text-amber-900 border-b border-transparent focus:border-amber-500 rounded py-0.5 focus:outline-none"
                            />
                          </td>
                          <td className="border border-slate-300 py-2 px-1 font-mono text-[11px] bg-amber-200/50 min-w-[110px]">
                            <div className="flex items-center justify-between gap-0.5">
                              <input
                                type="text"
                                value={slot.startTime}
                                onChange={(e) => handleUpdateTimeSlot(slot.period, 'startTime', e.target.value)}
                                className="w-full text-center bg-transparent focus:bg-white font-mono font-bold text-[11px] text-amber-900 border-b border-transparent focus:border-amber-500 rounded py-0.5 focus:outline-none"
                              />
                              <button
                                onClick={() => handleRemoveTimeSlot(slot.period)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 rounded transition-opacity screen-only shrink-0 cursor-pointer"
                                title="Hapus baris istirahat ini"
                              >
                                <Trash2 size={11} />
                              </button>
                            </div>
                          </td>
                          {activeDays.map(day => {
                            if (day === 'Jumat') {
                              const key = `Jumat-${slot.period}`;
                              const cellVal = scheduleGrid[key];
                              const matchedSub = subjects.find(s => s.id === cellVal || s.name === cellVal || s.code === cellVal);
                              const currentCount = matchedSub ? (subjectUsage[matchedSub.id] || 0) : 0;
                              const isUnderallocated = matchedSub && currentCount < matchedSub.jpPerWeek;
                              const isOverallocated = matchedSub && currentCount > matchedSub.jpPerWeek;
                              const isProblematic = isUnderallocated || isOverallocated;
                              const selectVal = matchedSub ? matchedSub.id : (cellVal || 'EMPTY');

                              return (
                                <td 
                                  key={key} 
                                  className={`border p-1 relative group transition-all ${
                                    isProblematic 
                                      ? 'border-2 border-rose-500 bg-rose-100/90 shadow-xs hover:z-30' 
                                      : 'border-slate-300'
                                  }`}
                                  title={
                                    matchedSub 
                                      ? isUnderallocated 
                                        ? `PEMBERITAHUAN: Mapel "${matchedSub.name}" kurang ${matchedSub.jpPerWeek - currentCount} JP (terpasang ${currentCount}/${matchedSub.jpPerWeek} JP)` 
                                        : isOverallocated 
                                          ? `PEMBERITAHUAN: Mapel "${matchedSub.name}" kelebihan ${currentCount - matchedSub.jpPerWeek} JP (terpasang ${currentCount}/${matchedSub.jpPerWeek} JP)` 
                                          : `Mapel "${matchedSub.name}": Terpasang ${currentCount}/${matchedSub.jpPerWeek} JP`
                                      : undefined
                                  }
                                >
                                  {/* Floating Pointer Hover Pop-up Notification */}
                                  {isProblematic && matchedSub && (
                                    <div className="absolute opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-1 w-56 p-2 bg-rose-900 text-white text-[11px] rounded-xl shadow-xl z-50 border border-rose-400 text-center font-sans space-y-1">
                                      <div className="font-extrabold text-rose-200 flex items-center justify-center gap-1 uppercase tracking-wider text-[10px]">
                                        <span>⚠️ PEMBERITAHUAN ALOKASI MAPEL</span>
                                      </div>
                                      <div className="font-bold text-white leading-tight">
                                        {matchedSub.name} ({matchedSub.code})
                                      </div>
                                      <div className="text-[10px] text-rose-100 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/60 font-mono">
                                        {isUnderallocated ? (
                                          <>Alokasi kurang <span className="font-black text-rose-300">{matchedSub.jpPerWeek - currentCount} JP</span> (Terpasang {currentCount}/{matchedSub.jpPerWeek} JP)</>
                                        ) : (
                                          <>Alokasi kelebihan <span className="font-black text-rose-300">{currentCount - matchedSub.jpPerWeek} JP</span> (Terpasang {currentCount}/{matchedSub.jpPerWeek} JP)</>
                                        )}
                                      </div>
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-rose-900" />
                                    </div>
                                  )}

                                  <select
                                    value={selectVal}
                                    onChange={(e) => handleCellChange('Jumat', slot.period, e.target.value)}
                                    className={`w-full h-full py-1.5 px-1 text-center font-bold text-xs bg-transparent focus:outline-none cursor-pointer appearance-none rounded ${
                                      isProblematic ? 'text-rose-950 font-black' : ''
                                    }`}
                                    style={{
                                      backgroundColor: isProblematic ? '#ffe4e6' : matchedSub ? matchedSub.color + '20' : (cellVal === 'PULANG' ? '#f1f5f9' : undefined),
                                      color: isProblematic ? '#881337' : matchedSub ? matchedSub.color : (cellVal === 'PULANG' ? '#64748b' : '#64748b'),
                                    }}
                                  >
                                    <option value="EMPTY" className="text-slate-400 bg-white">-- Kosong --</option>
                                    <option value="UPACARA" className="text-rose-600 font-bold bg-white">Upacara Bendera</option>
                                    <option value="PEMBIASAAN" className="text-teal-600 font-bold bg-white">Pembiasaan Pagi</option>
                                    <option value="ISTIRAHAT" className="text-amber-600 font-bold bg-white">Istirahat</option>
                                    <option value="PULANG" className="text-slate-500 font-bold bg-white">Pulang (10:35)</option>
                                    {subjects.map(s => (
                                      <option key={s.id} value={s.id} className="bg-white text-slate-800 font-medium">
                                        {s.name}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                              );
                            }

                            return (
                              <td key={`break-${day}-${slot.period}`} className="border border-slate-300 py-2 px-1 bg-amber-100/90 text-amber-900 text-[11px] uppercase font-extrabold">
                                {slot.breakLabel || 'ISTIRAHAT'}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    }

                    return (
                      <tr key={`slot-${slot.period}`} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="border border-slate-300 py-2 px-1 font-mono font-bold text-slate-700 bg-slate-50">
                          <input
                            type="text"
                            value={slot.periodLabel}
                            onChange={(e) => handleUpdateTimeSlot(slot.period, 'periodLabel', e.target.value)}
                            className="w-full text-center bg-transparent focus:bg-white font-mono font-bold text-slate-800 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 rounded py-0.5 text-xs focus:outline-none"
                          />
                        </td>
                        <td className="border border-slate-300 py-2 px-1 font-mono text-[11px] text-slate-700 bg-slate-50 min-w-[110px]">
                          <div className="flex items-center justify-between gap-0.5">
                            <input
                              type="text"
                              value={slot.startTime}
                              onChange={(e) => handleUpdateTimeSlot(slot.period, 'startTime', e.target.value)}
                              className="w-full text-center bg-transparent focus:bg-white font-mono font-bold text-[11px] text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-emerald-500 rounded py-0.5 focus:outline-none"
                            />
                            <button
                              onClick={() => handleRemoveTimeSlot(slot.period)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-600 rounded transition-opacity screen-only shrink-0 cursor-pointer"
                              title="Hapus baris ini"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </td>
                        
                        {activeDays.map(day => {
                          const key = `${day}-${slot.period}`;
                          const cellVal = scheduleGrid[key];

                          // Morning Activity slot special rendering
                          if (slot.isMorningActivity) {
                            if (day === 'Senin' || cellVal === 'UPACARA') {
                              return (
                                <td key={key} className="border border-slate-300 py-2.5 px-1 bg-rose-100 text-rose-900 font-extrabold text-[11px] text-center">
                                  <div className="font-extrabold uppercase">UPACARA BENDERA</div>
                                </td>
                              );
                            }
                            return (
                              <td key={key} className="border border-slate-300 py-2.5 px-1 bg-teal-50 text-teal-900 font-bold text-[11px] text-center">
                                <div className="font-extrabold uppercase text-teal-800">PEMBIASAAN PAGI</div>
                              </td>
                            );
                          }

                          const matchedSub = subjects.find(s => s.id === cellVal || s.name === cellVal || s.code === cellVal);
                          const currentCount = matchedSub ? (subjectUsage[matchedSub.id] || 0) : 0;
                          const isUnderallocated = matchedSub && currentCount < matchedSub.jpPerWeek;
                          const isOverallocated = matchedSub && currentCount > matchedSub.jpPerWeek;
                          const isProblematic = isUnderallocated || isOverallocated;
                          const selectVal = matchedSub ? matchedSub.id : (cellVal || 'EMPTY');

                          const getCellBg = () => {
                            if (isProblematic) return '#ffe4e6';
                            if (matchedSub) return matchedSub.color + '20';
                            if (cellVal === 'PULANG') return '#f1f5f9';
                            if (cellVal === 'UPACARA') return '#ffe4e6';
                            if (cellVal === 'PEMBIASAAN') return '#ccfbf1';
                            if (cellVal === 'ISTIRAHAT') return '#fef3c7';
                            return undefined;
                          };

                          const getCellColor = () => {
                            if (isProblematic) return '#881337';
                            if (matchedSub) return matchedSub.color;
                            if (cellVal === 'PULANG') return '#64748b';
                            if (cellVal === 'UPACARA') return '#e11d48';
                            if (cellVal === 'PEMBIASAAN') return '#0d9488';
                            if (cellVal === 'ISTIRAHAT') return '#d97706';
                            return '#64748b';
                          };

                          return (
                            <td 
                              key={key} 
                              className={`border p-1 relative group transition-all ${
                                isProblematic 
                                  ? 'border-2 border-rose-500 bg-rose-100/90 shadow-xs hover:z-30' 
                                  : 'border-slate-300'
                              }`}
                              title={
                                matchedSub 
                                  ? isUnderallocated 
                                    ? `PEMBERITAHUAN: Mapel "${matchedSub.name}" kurang ${matchedSub.jpPerWeek - currentCount} JP (terpasang ${currentCount}/${matchedSub.jpPerWeek} JP)` 
                                    : isOverallocated 
                                      ? `PEMBERITAHUAN: Mapel "${matchedSub.name}" kelebihan ${currentCount - matchedSub.jpPerWeek} JP (terpasang ${currentCount}/${matchedSub.jpPerWeek} JP)` 
                                      : `Mapel "${matchedSub.name}": Terpasang ${currentCount}/${matchedSub.jpPerWeek} JP`
                                  : undefined
                              }
                            >
                              {/* Floating Pointer Hover Pop-up Notification */}
                              {isProblematic && matchedSub && (
                                <div className="absolute opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-1 w-56 p-2 bg-rose-900 text-white text-[11px] rounded-xl shadow-xl z-50 border border-rose-400 text-center font-sans space-y-1">
                                  <div className="font-extrabold text-rose-200 flex items-center justify-center gap-1 uppercase tracking-wider text-[10px]">
                                    <span>⚠️ PEMBERITAHUAN ALOKASI MAPEL</span>
                                  </div>
                                  <div className="font-bold text-white leading-tight">
                                    {matchedSub.name} ({matchedSub.code})
                                  </div>
                                  <div className="text-[10px] text-rose-100 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-700/60 font-mono">
                                    {isUnderallocated ? (
                                      <>Alokasi kurang <span className="font-black text-rose-300">{matchedSub.jpPerWeek - currentCount} JP</span> (Terpasang {currentCount}/{matchedSub.jpPerWeek} JP)</>
                                    ) : (
                                      <>Alokasi kelebihan <span className="font-black text-rose-300">{currentCount - matchedSub.jpPerWeek} JP</span> (Terpasang {currentCount}/{matchedSub.jpPerWeek} JP)</>
                                    )}
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-rose-900" />
                                </div>
                              )}

                              {/* Interactive Cell Selector */}
                              <select
                                value={selectVal}
                                onChange={(e) => handleCellChange(day, slot.period, e.target.value)}
                                className={`w-full h-full py-1.5 px-1 text-center font-bold text-xs bg-transparent focus:outline-none cursor-pointer appearance-none rounded ${
                                  isProblematic ? 'text-rose-950 font-black' : ''
                                }`}
                                style={{
                                  backgroundColor: getCellBg(),
                                  color: getCellColor(),
                                }}
                              >
                                <option value="EMPTY" className="text-slate-400 bg-white">-- Kosong --</option>
                                <option value="UPACARA" className="text-rose-600 font-bold bg-white">Upacara Bendera</option>
                                <option value="PEMBIASAAN" className="text-teal-600 font-bold bg-white">Pembiasaan Pagi</option>
                                <option value="ISTIRAHAT" className="text-amber-600 font-bold bg-white">Istirahat</option>
                                <option value="PULANG" className="text-slate-500 font-bold bg-white">Pulang (10:35)</option>
                                {subjects.map(s => (
                                  <option key={s.id} value={s.id} className="bg-white text-slate-800 font-medium">
                                    {s.name}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* MANUAL ROW MANAGEMENT TOOLBAR (BOTTOM OF TABLE) */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 screen-only print:hidden bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ListPlus size={16} className="text-emerald-600" />
                <span>Tambah / Kelola Baris Manual:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleAddTimeSlot('kbm')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus size={13} />
                  <span>+ Baris Jam KBM</span>
                </button>
                <button
                  onClick={() => handleAddTimeSlot('break')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus size={13} />
                  <span>+ Baris Istirahat</span>
                </button>
                <button
                  onClick={() => handleAddTimeSlot('morning')}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus size={13} />
                  <span>+ Kegiatan Pagi</span>
                </button>
                <button
                  onClick={() => {
                    setModalTab('waktu');
                    setIsModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Settings size={13} />
                  <span>Atur Detail Pop-Up</span>
                </button>
              </div>
            </div>

            {/* SUBJECT COLOR LEGEND */}
            <div className="pt-4 border-t border-slate-200 screen-only print:hidden">
              <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Keterangan Kode & Alokasi Mata Pelajaran:</span>
                <span className="text-[11px] text-slate-500 font-normal normal-case">*Tanda merah = terpasang melebihi jatah JP/minggu</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {subjects.map(sub => {
                  const count = subjectUsage[sub.id] || 0;
                  const isExcess = count > sub.jpPerWeek;
                  const isExact = count === sub.jpPerWeek;
                  return (
                    <div 
                      key={sub.id} 
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
                        isExcess 
                          ? 'bg-rose-50 border-rose-300 text-rose-900 font-extrabold shadow-2xs' 
                          : isExact 
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-800' 
                          : 'bg-slate-50 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sub.color }} />
                        <span className="font-mono font-bold text-slate-900">{sub.code}:</span>
                        <span className="truncate">{sub.name}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-lg shrink-0 font-mono ${
                        isExcess 
                          ? 'bg-rose-600 text-white font-black' 
                          : isExact 
                          ? 'bg-emerald-600 text-white font-bold' 
                          : 'bg-slate-200 text-slate-700 font-bold'
                      }`}>
                        {count}/{sub.jpPerWeek} JP
                      </span>
                    </div>
                  );
                })}
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
                <div>{signaturePlace || 'Cipeundeuy'}, {signatureDate || '30 Juni 2026'}</div>
                <div>Guru Kelas</div>
                <div className="h-16"></div>
                <div className="font-bold underline uppercase">{teacherName || 'CEPI SOPYAN, S.Pd.'}</div>
                <div>NIP. {teacherNip || '-'}</div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB TAB 2: PROGRAM TAHUNAN (PROTA) */}
      {subTab === 'prota' && (
        <ProtaTab
          subjects={subjects}
          selectedClassLevel={selectedClassLevel}
          cpDataMap={cpDataMap}
          onOpenCpModal={() => setIsCpModalOpen(true)}
          onNavigateToPromes={handleNavigateToPromes}
          selectedYear={selectedYear}
          schoolName={schoolName}
          principalName={principalName}
          principalNip={principalNip}
          teacherName={teacherName}
          teacherNip={teacherNip}
          signaturePlace={signaturePlace}
          signatureDate={signatureDate}
        />
      )}

      {/* SUB TAB 3: PROGRAM SEMESTER (PROMES) */}
      {subTab === 'promes' && (
        <PromesTab
          subjects={subjects}
          selectedClassLevel={selectedClassLevel}
          cpDataMap={cpDataMap}
          onOpenCpModal={() => setIsCpModalOpen(true)}
          selectedYear={selectedYear}
          initialSubjectId={promesNav?.subjectId}
          initialSemester={promesNav?.semester}
          schoolName={schoolName}
          principalName={principalName}
          principalNip={principalNip}
          teacherName={teacherName}
          teacherNip={teacherNip}
          signaturePlace={signaturePlace}
          signatureDate={signatureDate}
        />
      )}

      {/* SUB TAB 4: MODUL AJAR / RPP */}
      {subTab === 'modul' && (
        <ModulAjarTab
          subjects={subjects}
          selectedClassLevel={selectedClassLevel}
          cpDataMap={cpDataMap}
          onOpenCpModal={() => setIsCpModalOpen(true)}
          selectedYear={selectedYear}
          schoolName={schoolName}
          principalName={principalName}
          principalNip={principalNip}
          teacherName={teacherName}
          teacherNip={teacherNip}
          signaturePlace={signaturePlace}
          signatureDate={signatureDate}
        />
      )}

      {/* SUB TAB 5: ANALISIS ALOKASI WAKTU */}
      {subTab === 'alokasi' && (
        <AlokasiWaktuTab
          subjects={subjects}
          selectedClassLevel={selectedClassLevel}
          calendarData={calendarData}
          selectedYear={selectedYear}
          schoolName={schoolName}
          principalName={principalName}
          principalNip={principalNip}
          teacherName={teacherName}
          teacherNip={teacherNip}
          signaturePlace={signaturePlace}
          signatureDate={signatureDate}
        />
      )}

      {/* CP & TP MANAGER MODAL (100% FLEXIBLE INPUT) */}
      <CPTPManagerModal
        isOpen={isCpModalOpen}
        onClose={() => setIsCpModalOpen(false)}
        subjects={subjects}
        selectedClassLevel={selectedClassLevel}
        cpDataMap={cpDataMap}
        onSaveCpData={handleSaveCpData}
      />
    </div>
  );
}
