export type DayType = 'HEB' | 'HEK' | 'LIBUR_NASIONAL' | 'LIBUR_SEKOLAH' | 'WEEKEND';

export interface CalendarDay {
  dateString: string; // YYYY-MM-DD
  type: DayType;
  activityName?: string;
}

export interface NationalHoliday {
  date: string; // YYYY-MM-DD
  name: string;
}

export interface ActivityEvent {
  id: string;
  date: string;
  title: string;
  description?: string;
}

export interface MonthSummary {
  monthIndex: number; // 0-11
  year: number;
  totalDays: number;
  hebCount: number; // Hari Efektif Belajar
  hekCount: number; // Hari Efektif Kegiatan
  liburNasionalCount: number;
  liburSekolahCount: number;
  weekendCount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
