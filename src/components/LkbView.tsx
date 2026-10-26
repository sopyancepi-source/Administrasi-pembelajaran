import React, { useState, useMemo, useEffect } from 'react';
import { 
  ClipboardList, 
  Calendar, 
  Sparkles, 
  Printer, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Check, 
  FileText, 
  Download, 
  Copy, 
  CheckCircle2, 
  ChevronRight, 
  Settings, 
  SlidersHorizontal,
  GraduationCap,
  Award,
  Layers,
  ArrowUp,
  ArrowDown,
  Info,
  CalendarCheck2,
  Flag,
  BookOpen,
  Eye,
  FileSpreadsheet,
  ChevronDown
} from 'lucide-react';
import { CalendarDay } from '../types';

export interface LkbItem {
  id: string;
  category: 'utama' | 'tambahan';
  uraian: string;
  volume: string;
  bukti: string;
}

interface LkbViewProps {
  schoolName: string;
  schoolLogo?: string;
  principalName: string;
  principalNip: string;
  teacherName: string;
  teacherNip: string;
  signaturePlace: string;
  signatureDate: string;
  selectedYear: number;
  calendarData: Record<string, CalendarDay>;
  weeklyRestDays: number[];
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Academic order: Semester 1 (Juli - Des), Semester 2 (Jan - Jun)
const ACADEMIC_MONTHS = [
  { name: 'Juli', monthIndex: 6, semester: 1 },
  { name: 'Agustus', monthIndex: 7, semester: 1 },
  { name: 'September', monthIndex: 8, semester: 1 },
  { name: 'Oktober', monthIndex: 9, semester: 1 },
  { name: 'November', monthIndex: 10, semester: 1 },
  { name: 'Desember', monthIndex: 11, semester: 1 },
  { name: 'Januari', monthIndex: 0, semester: 2 },
  { name: 'Februari', monthIndex: 1, semester: 2 },
  { name: 'Maret', monthIndex: 2, semester: 2 },
  { name: 'April', monthIndex: 3, semester: 2 },
  { name: 'Mei', monthIndex: 4, semester: 2 },
  { name: 'Juni', monthIndex: 5, semester: 2 },
];

export default function LkbView({
  schoolName,
  schoolLogo,
  principalName,
  principalNip,
  teacherName,
  teacherNip,
  signaturePlace,
  signatureDate,
  selectedYear,
  calendarData,
  weeklyRestDays,
}: LkbViewProps) {
  // Current selected month: default to Juli (start of academic year)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(6); // Default 6 = Juli
  const [teacherRole, setTeacherRole] = useState<string>('Guru Kelas MI');
  const [teacherGrade, setTeacherGrade] = useState<string>(() => {
    return localStorage.getItem('school_lkb_teacher_grade') || 'Kelas VI';
  });
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [activeSemesterTab, setActiveSemesterTab] = useState<1 | 2>(1);
  const [printOrientation, setPrintOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [batchPrintSemester, setBatchPrintSemester] = useState<boolean>(false);

  // Custom metadata overrides for this printout
  const [customUnitKerja, setCustomUnitKerja] = useState<string>(schoolName || 'MI Cibungur I');
  const [customJabatan, setCustomJabatan] = useState<string>('Guru Kelas MI');
  const [signatureRoleTitle, setSignatureRoleTitle] = useState<string>('Guru Kelas');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showWordMenu, setShowWordMenu] = useState<boolean>(false);

  // Edit item modal state
  const [editingItem, setEditingItem] = useState<LkbItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newItemCategory, setNewItemCategory] = useState<'utama' | 'tambahan'>('utama');
  const [newItemUraian, setNewItemUraian] = useState<string>('');
  const [newItemVolume, setNewItemVolume] = useState<string>('');
  const [newItemBukti, setNewItemBukti] = useState<string>('');

  // Save teacherGrade to localStorage
  useEffect(() => {
    localStorage.setItem('school_lkb_teacher_grade', teacherGrade);
  }, [teacherGrade]);

  // Check if current active grade is Grade 6
  const isGrade6 = useMemo(() => {
    return teacherGrade.toUpperCase().includes('VI') || teacherGrade.includes('6');
  }, [teacherGrade]);

  // Sync customUnitKerja if schoolName changes
  useEffect(() => {
    if (schoolName) {
      setCustomUnitKerja(schoolName);
    }
  }, [schoolName]);

  // Determine actual calendar year for the selected month in academic year:
  // e.g. Academic Year 2026/2027:
  // Months 6-11 (Juli-Desember) are year 2026
  // Months 0-5 (Januari-Juni) are year 2027
  const currentCalendarYear = useMemo(() => {
    return selectedMonthIndex >= 6 ? selectedYear : selectedYear + 1;
  }, [selectedMonthIndex, selectedYear]);

  // Sync activeSemesterTab when selectedMonthIndex changes
  useEffect(() => {
    if (selectedMonthIndex >= 6) {
      setActiveSemesterTab(1);
    } else {
      setActiveSemesterTab(2);
    }
  }, [selectedMonthIndex]);

  // Function to calculate calendar statistics for any given month & year
  const computeStatsForMonth = (mIdx: number, year: number) => {
    const totalDaysInMonth = new Date(year, mIdx + 1, 0).getDate();
    let hebCount = 0;
    let hekCount = 0;
    let liburCount = 0;
    let mondayCeremonyCount = 0;
    const mondayDates: string[] = [];
    const specialEvents: { date: string; title: string; type?: string }[] = [];

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const dateObj = new Date(year, mIdx, day);
      const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 1 is Monday, etc.
      const dateStr = `${year}-${String(mIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayData = calendarData[dateStr];
      const isRestDay = weeklyRestDays.includes(dayOfWeek);

      if (dayData) {
        if (dayData.type === 'HEB') {
          hebCount++;
        } else if (dayData.type === 'HEK') {
          hekCount++;
        } else if (dayData.type === 'LIBUR_NASIONAL' || dayData.type === 'LIBUR_SEKOLAH') {
          liburCount++;
        }

        if (dayData.activityName) {
          specialEvents.push({ date: dateStr, title: dayData.activityName, type: dayData.type });
        }
      } else {
        if (!isRestDay) {
          hebCount++;
        }
      }

      // Monday Upacara check: every Monday that is not a national/school holiday or weekend
      if (dayOfWeek === 1) {
        const isHoliday = dayData && (dayData.type === 'LIBUR_NASIONAL' || dayData.type === 'LIBUR_SEKOLAH');
        if (!isHoliday && !isRestDay) {
          mondayCeremonyCount++;
          mondayDates.push(`${day} ${MONTH_NAMES[mIdx]}`);
        }
      }
    }

    // Group special events by normalized activity name
    const groupedEvents: { title: string; count: number; dates: string[]; type?: string }[] = [];
    const eventMap = new Map<string, { title: string; count: number; dates: string[]; type?: string }>();
    specialEvents.forEach(evt => {
      const cleanTitle = evt.title.trim();
      if (!cleanTitle) return;
      if (!eventMap.has(cleanTitle)) {
        eventMap.set(cleanTitle, { title: cleanTitle, count: 0, dates: [], type: evt.type });
      }
      const item = eventMap.get(cleanTitle)!;
      item.count++;
      item.dates.push(evt.date);
    });
    eventMap.forEach(val => groupedEvents.push(val));

    // Calculate Pure Effective Teaching Days (KBM Murni)
    // Sesuai aturan:
    // 1. Yang dihitung KBM adalah selain libur dan kegiatan/ujian
    // 2. Setelah tes/ujian akhir dimulai, tidak ada lagi KBM
    // 3. Pelaksanaan ujian, asesmen, sumatif tidak dihitung sebagai KBM
    // 4. Bulan Juni: KBM = 0 Hari untuk semua tingkat kelas (periode PAT/ASAT, RDM, kelulusan, dan libur)
    // 5. Bulan Mei untuk Kelas VI: KBM tatap muka berhenti tepat saat Asesmen Madrasah dimulai (hanya hari aktif sebelum AM, yaitu 5 hari di Mei 2027)
    let pureKbmDays = 0;

    if (mIdx === 5) {
      // JUNI: KBM = 0 HARI (Semua jenjang kelas telah tuntas KBM, masuk masa PAT, RDM, Rapor & Libur)
      pureKbmDays = 0;
    } else {
      let cutoffDay = totalDaysInMonth + 1;

      if (isGrade6 && mIdx === 4) { // Mei untuk Kelas VI
        // Cari tanggal pertama Asesmen Madrasah (AM) dimulai di bulan Mei
        const amEvent = specialEvents.find(e => /asesmen madrasah|am |ujian madrasah/i.test(e.title));
        if (amEvent) {
          const amDay = parseInt(amEvent.date.split('-')[2], 10);
          cutoffDay = amDay; // Hari pada dan setelah AM bukan KBM
        } else {
          cutoffDay = 11; // Default 11 Mei
        }
      } else if (mIdx === 11) { // Desember (Akhir Semester Ganjil)
        const pasEvent = specialEvents.find(e => /pas|asas|akhir semester/i.test(e.title));
        if (pasEvent) {
          cutoffDay = parseInt(pasEvent.date.split('-')[2], 10);
        }
      }

      for (let day = 1; day <= totalDaysInMonth; day++) {
        // Setelah tes/ujian akhir dimulai, tidak ada lagi KBM tatap muka
        if (day >= cutoffDay) continue;

        const dateObj = new Date(year, mIdx, day);
        const dayOfWeek = dateObj.getDay();
        const dateStr = `${year}-${String(mIdx + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = calendarData[dateStr];
        const isRestDay = weeklyRestDays.includes(dayOfWeek);

        if (isRestDay) continue;

        const isHoliday = dayData && (dayData.type === 'LIBUR_NASIONAL' || dayData.type === 'LIBUR_SEKOLAH');
        if (isHoliday) continue;

        const isActivityOrExam = dayData && (dayData.type === 'HEK' || Boolean(dayData.activityName));
        if (isActivityOrExam) continue;

        pureKbmDays++;
      }
    }

    let grade6Note = '';
    if (isGrade6) {
      if (mIdx === 4) {
        grade6Note = `KBM Kelas VI di bulan Mei hanya ${pureKbmDays} hari (KBM tatap muka tuntas sebelum Asesmen Madrasah dimulai tanggal 11 Mei)`;
      } else if (mIdx === 5) {
        grade6Note = 'KBM Kelas VI di bulan Juni: 0 Hari (KBM Tuntas Pasca Ujian & Kelulusan)';
      }
    } else {
      if (mIdx === 5) {
        grade6Note = 'KBM di bulan Juni: 0 Hari (KBM Semester Genap Tuntas sebelum Ujian PAT / ASAT)';
      }
    }

    return {
      totalDays: totalDaysInMonth,
      hebCount,
      hekCount,
      effectiveTeachingDays: pureKbmDays,
      pureKbmDays,
      isKbmFinished: mIdx === 5 || (isGrade6 && mIdx === 4),
      grade6Note,
      mondayCeremonyCount: Math.max(1, mondayCeremonyCount),
      mondayDates,
      specialEvents,
      groupedEvents,
    };
  };

  // Stats for currently active month
  const monthStats = useMemo(() => {
    return computeStatsForMonth(selectedMonthIndex, currentCalendarYear);
  }, [selectedMonthIndex, currentCalendarYear, calendarData, weeklyRestDays, isGrade6]);

  // Generate automated activities for MI Cibungur I based on month, grade, & calendar data
  const generateDefaultActivitiesForMonth = (mIdx: number, stats: ReturnType<typeof computeStatsForMonth>): LkbItem[] => {
    const heb = stats.effectiveTeachingDays;
    const mondays = stats.mondayCeremonyCount;
    const targetClass = teacherGrade || 'Kelas VI';
    const isGr6 = isGrade6;

    // Helper to find events from Kalpen matching a pattern
    const findEvent = (regex: RegExp) => {
      return stats.groupedEvents.find(e => regex.test(e.title));
    };

    const items: LkbItem[] = [];

    // 1. Task 1: Perencanaan Pembelajaran
    if (mIdx === 5) { // Juni
      if (isGr6) {
        items.push({
          id: `tugas-1-${mIdx}`,
          category: 'utama',
          uraian: `Menyusun laporan ketuntasan kurikulum akhir jenjang, rekapitulasi ketercapaian kompetensi lulusan, dan evaluasi hasil belajar ${targetClass} MI Cibungur I`,
          volume: `1 Berkas Laporan`,
          bukti: 'Laporan Ketuntasan Belajar & Leger RDM'
        });
      } else {
        items.push({
          id: `tugas-1-${mIdx}`,
          category: 'utama',
          uraian: `Menyusun evaluasi ketuntasan pembelajaran semester genap, analisis ketercapaian Tujuan Pembelajaran (TP), dan laporan tindak lanjut persiapan tahun ajaran baru di ${targetClass}`,
          volume: `1 Berkas Dokumen`,
          bukti: 'Laporan Evaluasi Ketuntasan Belajar'
        });
      }
    } else if (isGr6 && mIdx === 4) { // Mei
      items.push({
        id: `tugas-1-${mIdx}`,
        category: 'utama',
        uraian: `Merencanakan dan menyusun program pemantapan materi esensial, bank soal Asesmen Madrasah (AM), kisi-kisi, dan rubrik asesmen kelulusan ${targetClass} MI Cibungur I`,
        volume: `1 Paket Dokumen`,
        bukti: 'Modul Pemantapan & Kisi-kisi AM'
      });
    } else {
      items.push({
        id: `tugas-1-${mIdx}`,
        category: 'utama',
        uraian: `Merencanakan pembelajaran: Menyusun Modul Ajar Kurikulum Merdeka, Alur Tujuan Pembelajaran (ATP), Bahan Ajar, LKPD, dan media pembelajaran ${targetClass} MI Cibungur I`,
        volume: `1 Dokumen`,
        bukti: 'Modul Ajar & Promes'
      });
    }

    // 2. Task 2: Pelaksanaan KBM Tatap Muka
    if (mIdx === 5) { // Juni - TIDAK ADA KBM UNTUK SEMUA TINGKAT KELAS
      if (isGr6) {
        items.push({
          id: `tugas-2-${mIdx}`,
          category: 'utama',
          uraian: `Melaksanakan penuntasan Kegiatan Belajar Mengajar (KBM) ${targetClass} yang telah selesai lebih awal sesuai Kalender Pendidikan, dilanjutkan dengan pendampingan peserta didik pasca ujian dan persiapan kelanjutan studi ke jenjang MTs/SMP`,
          volume: `0 Hari (KBM Tuntas Selesai Pasca Ujian)`,
          bukti: 'Buku Jurnal Guru & Rekap Ketuntasan Kurikulum'
        });
      } else {
        items.push({
          id: `tugas-2-${mIdx}`,
          category: 'utama',
          uraian: `Kegiatan Belajar Mengajar (KBM) tatap muka semester genap telah selesai dan tuntas dilaksanakan seluruhnya sebelum pelaksanaan Penilaian Akhir Tahun (PAT) / Sumatif Akhir Tahun (SAT)`,
          volume: `0 Hari (KBM Tuntas Selesai Pasca Ujian)`,
          bukti: 'Buku Jurnal Harian Guru & Rekap Ketuntasan Materi'
        });
      }
    } else if (isGr6 && mIdx === 4) { // Mei untuk Kelas VI
      items.push({
        id: `tugas-2-${mIdx}`,
        category: 'utama',
        uraian: `Melaksanakan penuntasan Kegiatan Belajar Mengajar (KBM) tatap muka dan pendalaman materi esensial menjelang pelaksanaan Asesmen Madrasah (AM) hingga batas akhir pembelajaran efektif`,
        volume: `${heb} Hari (KBM Selesai Menjelang AM)`,
        bukti: 'Agenda Harian Guru & Presensi Kelas VI'
      });
    } else {
      items.push({
        id: `tugas-2-${mIdx}`,
        category: 'utama',
        uraian: `Melaksanakan Kegiatan Belajar Mengajar (KBM) tatap muka secara aktif, interaktif, dan menyenangkan berbasis literasi & numerasi di ${targetClass} MI Cibungur I`,
        volume: `${heb} Hari`,
        bukti: 'Agenda Guru & Presensi Siswa'
      });
    }

    // 3. Task 3: Upacara Bendera Hari Senin
    items.push({
      id: `tugas-3-${mIdx}`,
      category: 'utama',
      uraian: `Mengikuti Upacara Bendera setiap hari Senin bersama dewan guru dan seluruh peserta didik MI Cibungur I sebagai wujud penanaman nilai nasionalisme dan disiplin`,
      volume: `${mondays} Kegiatan`,
      bukti: 'Daftar Hadir & Foto Kegiatan'
    });

    // 4. Task 4: Evaluasi Pembelajaran Harian / Formatif
    // Di bulan Juni (semua kelas) dan di bulan Mei (Kelas VI): tidak ada ulangan formatif harian karena masuk periode ujian akhir (PAT/AM)
    if (mIdx === 5 || (isGr6 && mIdx === 4)) {
      // Fokus dialihkan ke pelaksanaan ujian PAT / Asesmen Madrasah yang tercantum pada tugas spesifik
    } else {
      items.push({
        id: `tugas-4-${mIdx}`,
        category: 'utama',
        uraian: `Melaksanakan evaluasi dan asesmen pembelajaran (Asesmen Formatif / Sumatif Lingkup Materi) untuk mengukur ketercapaian Tujuan Pembelajaran (TP) peserta didik ${targetClass}`,
        volume: `${Math.min(4, Math.max(2, Math.floor(heb / 5)))} Kegiatan`,
        bukti: 'Instrumen Asesmen & Rubrik'
      });
    }

    // 5. Task 5: Pengolahan Nilai & RDM
    if (isGr6 && mIdx === 4) { // Mei
      items.push({
        id: `tugas-5-${mIdx}`,
        category: 'utama',
        uraian: `Mengolah dan mengintegrasikan akumulasi nilai Rapor (Semester 7 s.d. 12 / Kelas IV - VI) dengan Nilai Asesmen Madrasah guna penyusunan Nilai Akhir Ijazah dan Leger Kelulusan ${targetClass}`,
        volume: `1 Leger Kelulusan`,
        bukti: 'Buku Leger Nilai RDM & Rekap Portofolio'
      });
    } else if (isGr6 && mIdx === 5) { // Juni
      items.push({
        id: `tugas-5-${mIdx}`,
        category: 'utama',
        uraian: `Finalisasi penginputan data kelulusan, penerbitan Surat Keterangan Lulus (SKL), dan pengarsipan Buku Induk Lulusan ${targetClass} ke dalam sistem database madrasah`,
        volume: `1 Berkas Buku Induk`,
        bukti: 'Buku Induk Siswa & Berita Acara Kelulusan'
      });
    } else {
      items.push({
        id: `tugas-5-${mIdx}`,
        category: 'utama',
        uraian: `Memeriksa hasil tugas siswa, menganalisis hasil belajar, serta menginput capaian perkembangan peserta didik ke dalam Aplikasi Rapor Digital Madrasah (RDM)`,
        volume: `1 Berkas`,
        bukti: 'Buku Nilai & Rekap Nilai Siswa'
      });
    }

    // Keep track of events from Kalpen handled explicitly to avoid duplicate entries
    const handledEventTitles = new Set<string>();

    // Month-specific dynamic activities tailored to primary madrasah & exams from Kalpen
    switch (mIdx) {
      case 6: // Juli
        {
          const matsamaEvt = findEvent(/matsama|mpls/i);
          const volDays = matsamaEvt ? `${matsamaEvt.count} Hari` : '3 Hari';
          if (matsamaEvt) handledEventTitles.add(matsamaEvt.title);
          items.push({
            id: `tugas-spec-juli`,
            category: 'utama',
            uraian: `Mendampingi pelaksanaan Masa Ta'aruf Siswa Madrasah (MATSAMA) & Pengenalan Lingkungan Belajar bagi peserta didik baru MI Cibungur I`,
            volume: volDays,
            bukti: 'Jadwal MATSAMA & Dokumentasi'
          });
        }
        break;

      case 7: // Agustus
        {
          const hutEvt = findEvent(/kemerdekaan|hut/i);
          if (hutEvt) handledEventTitles.add(hutEvt.title);
          items.push({
            id: `tugas-spec-agustus`,
            category: 'utama',
            uraian: `Membimbing dan mendampingi peserta didik dalam memeriahkan Peringatan HUT Kemerdekaan RI (Upacara Bendera 17 Agustus & Lomba Kemerdekaan MI Cibungur I)`,
            volume: `1 Kegiatan`,
            bukti: 'Dokumentasi Foto & Berita Acara'
          });
        }
        break;

      case 8: // September
        {
          const stsEvt = findEvent(/sts|tengah semester|pts/i);
          const volDays = stsEvt ? `${stsEvt.count} Hari` : '1 Kegiatan';
          if (stsEvt) handledEventTitles.add(stsEvt.title);
          items.push({
            id: `tugas-spec-september`,
            category: 'utama',
            uraian: `Melaksanakan Asesmen Sumatif Tengah Semester (STS) Ganjil dan program remedial serta pengayaan bagi siswa yang membutuhkan intervensi khusus di ${targetClass}`,
            volume: volDays,
            bukti: 'Naskah Soal & Daftar Nilai STS'
          });
        }
        break;

      case 9: // Oktober
        {
          const santriEvt = findEvent(/santri|maulid/i);
          if (santriEvt) handledEventTitles.add(santriEvt.title);
          items.push({
            id: `tugas-spec-oktober`,
            category: 'utama',
            uraian: `Mengikuti Peringatan Hari Santri Nasional (22 Oktober) dan Peringatan Maulid Nabi Muhammad SAW bersama civitas akademika MI Cibungur I`,
            volume: `1 Kegiatan`,
            bukti: 'Foto Kegiatan & Agenda'
          });
        }
        break;

      case 10: // November
        items.push({
          id: `tugas-spec-november`,
          category: 'utama',
          uraian: isGr6 
            ? `Menyusun kisi-kisi dan naskah bank soal persiapan Asesmen Akhir Jenjang ${targetClass} serta materi pengayaan esensial`
            : `Menyusun kisi-kisi dan naskah Asesmen Sumatif Akhir Semester (ASAS) Ganjil tingkat Madrasah Ibtidaiyah sesuai Capaian Pembelajaran`,
          volume: `1 Paket Soal`,
          bukti: 'Kisi-kisi & Naskah Soal'
        });
        break;

      case 11: // Desember
        {
          const asasEvt = findEvent(/asas|pas|akhir semester/i);
          const volDays = asasEvt ? `${asasEvt.count} Hari` : '1 Laporan';
          if (asasEvt) handledEventTitles.add(asasEvt.title);
          items.push({
            id: `tugas-spec-desember`,
            category: 'utama',
            uraian: `Melaksanakan pengawasan ASAS/PAS Ganjil, finalisasi nilai Rapor Digital Madrasah (RDM), dan penyerahan Buku Laporan Hasil Belajar (Rapor) Semester I kepada orang tua wali murid`,
            volume: volDays,
            bukti: 'Leger RDM & Tanda Terima Rapor'
          });
        }
        break;

      case 0: // Januari
        items.push({
          id: `tugas-spec-januari`,
          category: 'utama',
          uraian: isGr6
            ? `Mengikuti Peringatan HAB Kemenag dan menyusun program bimbingan intensifikasi materi esensial persiapan Asesmen Madrasah (AM) ${targetClass}`
            : `Mengikuti Peringatan Hari Amal Bakti (HAB) Kementerian Agama dan menyusun perangkat pembelajaran Kurikulum Merdeka Semester Genap`,
          volume: `1 Kegiatan`,
          bukti: 'Foto Upacara HAB & Program Kerja'
        });
        break;

      case 1: // Februari
        items.push({
          id: `tugas-spec-februari`,
          category: 'utama',
          uraian: isGr6
            ? `Melaksanakan pembinaan pendalaman materi Asesmen Madrasah serta bimbingan tahfidz Juz Amma dan praktik ibadah bagi peserta didik ${targetClass}`
            : `Peringatan Isra Mi'raj Nabi Muhammad SAW serta pembinaan intensif tahsin dan hafalan surat pendek Juz Amma bagi siswa MI Cibungur I`,
          volume: `1 Kegiatan`,
          bukti: 'Buku Pantauan Tahfidz & Rekap Latihan'
        });
        break;

      case 2: // Maret
        {
          const toEvt = findEvent(/try out|to |simulasi/i);
          const toDays = toEvt ? `${toEvt.count} Hari` : '4 Hari';
          if (toEvt) handledEventTitles.add(toEvt.title);

          const praktikEvt = findEvent(/praktik/i);
          const praktikDays = praktikEvt ? `${praktikEvt.count} Hari` : '5 Hari';
          if (praktikEvt) handledEventTitles.add(praktikEvt.title);

          if (isGr6) {
            items.push({
              id: `tugas-spec-maret-to`,
              category: 'utama',
              uraian: `Melaksanakan dan mengawasi pelaksanaan Try Out (TO) Asesmen Madrasah / Asesmen Sumatif Akhir Jenjang (ASAJ) bagi peserta didik ${targetClass} MI Cibungur I`,
              volume: toDays,
              bukti: 'Naskah Soal, Berita Acara & Analisis Nilai TO'
            });

            items.push({
              id: `tugas-spec-maret-praktik`,
              category: 'utama',
              uraian: `Melaksanakan pengujian dan penilaian Ujian Praktik ${targetClass} (Praktik Ibadah Shalat, Wudhu, Baca Tulis Al-Qur'an/Tahfidz, SBdP, dan PJOK)`,
              volume: praktikDays,
              bukti: 'Rubrik Penilaian Praktik & Rekap Nilai Siswa'
            });
          }

          items.push({
            id: `tugas-spec-maret-ramadhan`,
            category: 'utama',
            uraian: `Melaksanakan kegiatan Amaliyah Ramadhan & Pesantren Kilat (Sanlat) serta bimbingan tadarus Al-Qur'an bagi seluruh peserta didik MI Cibungur I`,
            volume: `1 Kegiatan`,
            bukti: 'Jurnal Ramadhan & Dokumentasi Foto'
          });
        }
        break;

      case 3: // April
        {
          const praktikEvt = findEvent(/praktik/i);
          if (isGr6 && praktikEvt && !handledEventTitles.has(praktikEvt.title)) {
            handledEventTitles.add(praktikEvt.title);
            items.push({
              id: `tugas-spec-april-praktik`,
              category: 'utama',
              uraian: `Melaksanakan pengujian dan penilaian Ujian Praktik ${targetClass} (Praktik Shalat, Wudhu, BTQ, SBdP, dan PJOK)`,
              volume: `${praktikEvt.count} Hari`,
              bukti: 'Rubrik Penilaian Praktik & Lembar Nilai'
            });
          }

          const amEvt = findEvent(/asesmen madrasah|am |ujian madrasah/i);
          if (isGr6 && amEvt && !handledEventTitles.has(amEvt.title)) {
            handledEventTitles.add(amEvt.title);
            items.push({
              id: `tugas-spec-april-am`,
              category: 'utama',
              uraian: `Melaksanakan pengawasan ruang dan kepanitiaan Asesmen Madrasah (AM) Utama ${targetClass} MI Cibungur I`,
              volume: `${amEvt.count} Hari`,
              bukti: 'POS AM, Berita Acara & Daftar Hadir Pengawas'
            });
          }

          items.push({
            id: `tugas-spec-april-zakat`,
            category: 'utama',
            uraian: `Pengelolaan pengumpulan dan pendistribusian Zakat Fitrah siswa madrasah serta kegiatan Halal Bihalal Idul Fitri dewan guru dan siswa MI Cibungur I`,
            volume: `1 Berita Acara`,
            bukti: 'Laporan Zakat Fitrah & Foto Kegiatan'
          });
        }
        break;

      case 4: // Mei
        {
          const amEvt = findEvent(/asesmen madrasah|am |ujian madrasah/i);
          const amDays = amEvt ? `${amEvt.count} Hari` : '6 Hari';
          if (amEvt) handledEventTitles.add(amEvt.title);

          const plenoEvt = findEvent(/rapat pleno|kelulusan|pleno/i);
          if (plenoEvt) handledEventTitles.add(plenoEvt.title);

          if (isGr6) {
            items.push({
              id: `tugas-spec-mei-am`,
              category: 'utama',
              uraian: `Melaksanakan pengawasan ruang dan kepanitiaan Asesmen Madrasah (AM) Utama / Susulan ${targetClass} MI Cibungur I Tahun Ajaran ${selectedYear}/${selectedYear + 1}`,
              volume: amDays,
              bukti: 'POS AM, Berita Acara Pengawasan & Daftar Hadir Siswa'
            });

            items.push({
              id: `tugas-spec-mei-koreksi`,
              category: 'utama',
              uraian: `Memeriksa lembar jawaban, mengoreksi naskah Asesmen Madrasah, dan merekapitulasi perolehan nilai akhir seluruh mata pelajaran`,
              volume: `1 Berkas Nilai`,
              bukti: 'Lembar Koreksi & Rekap Nilai AM'
            });

            items.push({
              id: `tugas-spec-mei-rapat`,
              category: 'utama',
              uraian: `Mengikuti Rapat Pleno Dewan Guru penetapan Kriteria Kelulusan dan Hasil Kelulusan Peserta Didik ${targetClass} MI Cibungur I`,
              volume: `1 Kegiatan`,
              bukti: 'Daftar Hadir, Notula Rapat & SK Penetapan Kelulusan'
            });
          } else {
            items.push({
              id: `tugas-spec-mei-reguler`,
              category: 'utama',
              uraian: `Mempersiapkan kisi-kisi dan naskah Penilaian Akhir Tahun (PAT) / Sumatif Akhir Tahun (SAT) Genap serta pemantauan ketuntasan belajar siswa`,
              volume: `1 Paket Soal`,
              bukti: 'Kisi-kisi & Naskah Soal PAT'
            });
          }
        }
        break;

      case 5: // Juni
        {
          const sklEvt = findEvent(/pengumuman|skl/i);
          if (sklEvt) handledEventTitles.add(sklEvt.title);

          const ijazahEvt = findEvent(/ijazah|cap 3 jari|cap tiga jari/i);
          const ijazahDays = ijazahEvt ? `${ijazahEvt.count} Hari` : '1 Paket Dokumen';
          if (ijazahEvt) handledEventTitles.add(ijazahEvt.title);

          const wisudaEvt = findEvent(/pelepasan|wisuda|akhirussanah|perpisahan/i);
          if (wisudaEvt) handledEventTitles.add(wisudaEvt.title);

          const patEvt = findEvent(/pat|sat|penilaian akhir tahun|sumatif akhir tahun/i);
          const patDays = patEvt ? `${patEvt.count} Hari` : '6 Hari';
          if (patEvt) handledEventTitles.add(patEvt.title);

          if (isGr6) {
            items.push({
              id: `tugas-spec-juni-skl`,
              category: 'utama',
              uraian: `Melaksanakan pengumuman kelulusan resmi dan penerbitan serta penyerahan Surat Keterangan Lulus (SKL) sementara bagi peserta didik ${targetClass} MI Cibungur I`,
              volume: `1 Kegiatan`,
              bukti: 'SK Kelulusan, Tanda Terima SKL & Foto'
            });

            items.push({
              id: `tugas-spec-juni-ijazah`,
              category: 'utama',
              uraian: `Melaksanakan penulisan, verifikasi, dan validasi blangko Ijazah asli Madrasah Ibtidaiyah ${targetClass} sesuai Petunjuk Teknis (Juknis) Kemenag RI`,
              volume: ijazahDays,
              bukti: 'Buku Ekspedisi Ijazah, Salinan Ijazah & Berita Acara'
            });

            items.push({
              id: `tugas-spec-juni-capjari`,
              category: 'utama',
              uraian: `Melayani prosesi Cap Tiga Jari, penyerahan Ijazah asli, dan legalisir dokumen kelulusan alumni peserta didik ${targetClass}`,
              volume: `1 Berkas`,
              bukti: 'Daftar Hadir Cap Tiga Jari & Tanda Terima'
            });

            items.push({
              id: `tugas-spec-juni-pelepasan`,
              category: 'utama',
              uraian: `Mempersiapkan dan menyelenggarakan prosesi Pelepasan / Wisuda Kelulusan Siswa ${targetClass} (Haflah Akhirussanah) bersama komite dan orang tua siswa`,
              volume: `1 Kegiatan`,
              bukti: 'Susunan Acara, Notula & Dokumentasi Foto'
            });

            items.push({
              id: `tugas-spec-juni-pengawas-pat`,
              category: 'utama',
              uraian: `Bertugas sebagai Panitia dan Pengawas Ruang Penilaian Akhir Tahun (PAT) / Sumatif Akhir Tahun (SAT) bagi adik kelas (Kelas I s.d. V) MI Cibungur I`,
              volume: patDays,
              bukti: 'SK Kepanitiaan PAT & Berita Acara Pengawasan'
            });
          } else {
            items.push({
              id: `tugas-spec-juni-pat`,
              category: 'utama',
              uraian: `Melaksanakan Penilaian Akhir Tahun (PAT) / Sumatif Akhir Tahun (SAT) Genap di ${targetClass} MI Cibungur I`,
              volume: patDays,
              bukti: 'Naskah Soal, Berita Acara & Daftar Hadir PAT'
            });

            items.push({
              id: `tugas-spec-juni-rapor`,
              category: 'utama',
              uraian: `Mengolah nilai akhir semester genap ke dalam Rapor Digital Madrasah (RDM), rapat kenaikan kelas, dan pembagian Buku Rapor kepada orang tua siswa`,
              volume: `1 Laporan`,
              bukti: 'Buku Rapor & Tanda Terima Rapor'
            });
          }
        }
        break;
    }

    // Dynamic Injection: If any event from calendarData was NOT yet handled above, inject it!
    stats.groupedEvents.forEach(evt => {
      if (handledEventTitles.has(evt.title)) return;
      // Skip generic weekend or vacation titles
      if (/libur semester|libur akhir|mingguan/i.test(evt.title)) return;

      items.push({
        id: `kalpen-${evt.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${mIdx}`,
        category: 'utama',
        uraian: `Melaksanakan dan mendampingi kegiatan ${evt.title} MI Cibungur I sesuai Kalender Pendidikan Tahun Ajaran ${selectedYear}/${selectedYear + 1}`,
        volume: `${evt.count} Hari`,
        bukti: 'Dokumentasi Foto, Presensi & Berita Acara'
      });
    });

    // Default Tugas Tambahan for Madrasah Ibtidaiyah
    items.push(
      {
        id: `tugas-tambahan-1-${mIdx}`,
        category: 'tambahan',
        uraian: `Membimbing pembiasaan ibadah harian: Sholat Dhuha berjamaah, pembacaan Asmaul Husna, dan doa bersama sebelum memulai pembelajaran di madrasah`,
        volume: `${isGr6 && mIdx === 5 ? 'Pembiasaan Lulusan' : `${heb} Hari`}`,
        bukti: 'Jurnal Pembiasaan & Foto Kegiatan'
      },
      {
        id: `tugas-tambahan-2-${mIdx}`,
        category: 'tambahan',
        uraian: `Melaksanakan pembinaan kegiatan ekstrakurikuler Pramuka (Golongan Siaga / Penggalang) MI Cibungur I`,
        volume: `4 Kegiatan`,
        bukti: 'Buku Presensi & Foto Latihan'
      },
      {
        id: `tugas-tambahan-3-${mIdx}`,
        category: 'tambahan',
        uraian: `Melaksanakan tugas Piket Madrasah: menyambut siswa di gerbang (5S: Senyum, Salam, Sapa, Sopan, Santun) serta menjaga ketertiban lingkungan sekolah`,
        volume: `4 Kali`,
        bukti: 'Buku Jurnal Piket Madrasah'
      },
      {
        id: `tugas-tambahan-4-${mIdx}`,
        category: 'tambahan',
        uraian: `Mengikuti kegiatan Kelompok Kerja Guru Madrasah Ibtidaiyah (KKGMI) atau Rapat Koordinasi Dewan Guru MI Cibungur I`,
        volume: `1 Kegiatan`,
        bukti: 'Daftar Hadir & Notula Rapat'
      }
    );

    return items;
  };

  // State to hold custom activities per month and grade
  const [monthActivities, setMonthActivities] = useState<Record<number, LkbItem[]>>(() => {
    const saved = localStorage.getItem(`school_lkb_data_${selectedYear}_${teacherGrade.replace(/\s+/g, '_')}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load saved LKB data', e);
      }
    }
    return {};
  });

  // Switch activities cache when teacherGrade or selectedYear changes
  useEffect(() => {
    const saved = localStorage.getItem(`school_lkb_data_${selectedYear}_${teacherGrade.replace(/\s+/g, '_')}`);
    if (saved) {
      try {
        setMonthActivities(JSON.parse(saved));
      } catch (e) {
        setMonthActivities({});
      }
    } else {
      setMonthActivities({});
    }
  }, [selectedYear, teacherGrade]);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem(`school_lkb_data_${selectedYear}_${teacherGrade.replace(/\s+/g, '_')}`, JSON.stringify(monthActivities));
  }, [monthActivities, selectedYear, teacherGrade]);

  // Current items for the selected month
  const currentItems = useMemo(() => {
    if (monthActivities[selectedMonthIndex] && monthActivities[selectedMonthIndex].length > 0) {
      // Auto-heal stale cached June data if it contains non-zero KBM
      if (selectedMonthIndex === 5) {
        const juneKbm = monthActivities[5].find(item => item.id === 'tugas-2-5');
        if (juneKbm && !juneKbm.volume.includes('0 Hari')) {
          return generateDefaultActivitiesForMonth(5, monthStats);
        }
      }
      // Auto-heal stale cached May data for Grade 6 if it contains outdated KBM
      if (selectedMonthIndex === 4 && isGrade6) {
        const mayKbm = monthActivities[4].find(item => item.id === 'tugas-2-4');
        if (mayKbm && (mayKbm.volume.includes('10 Hari') || mayKbm.volume.includes('8 Hari') || mayKbm.volume.includes('20 Hari'))) {
          return generateDefaultActivitiesForMonth(4, monthStats);
        }
      }
      return monthActivities[selectedMonthIndex];
    }
    return generateDefaultActivitiesForMonth(selectedMonthIndex, monthStats);
  }, [monthActivities, selectedMonthIndex, monthStats, teacherGrade, isGrade6]);

  // Separate into Tugas Utama and Tugas Tambahan
  const tugasUtama = useMemo(() => {
    return currentItems.filter(item => item.category === 'utama');
  }, [currentItems]);

  const tugasTambahan = useMemo(() => {
    return currentItems.filter(item => item.category === 'tambahan');
  }, [currentItems]);

  // Handler to update an item
  const handleUpdateItem = (updated: LkbItem) => {
    const updatedList = currentItems.map(item => item.id === updated.id ? updated : item);
    setMonthActivities(prev => ({
      ...prev,
      [selectedMonthIndex]: updatedList
    }));
    setEditingItem(null);
  };

  // Handler to add new item
  const handleAddItem = () => {
    if (!newItemUraian.trim()) return;
    const newItem: LkbItem = {
      id: `custom-${Date.now()}`,
      category: newItemCategory,
      uraian: newItemUraian.trim(),
      volume: newItemVolume.trim() || '1 Kegiatan',
      bukti: newItemBukti.trim() || 'Foto & Dokumen'
    };

    setMonthActivities(prev => ({
      ...prev,
      [selectedMonthIndex]: [...currentItems, newItem]
    }));

    setNewItemUraian('');
    setNewItemVolume('');
    setNewItemBukti('');
    setIsAddingNew(false);
  };

  // Handler to delete an item
  const handleDeleteItem = (id: string) => {
    const updatedList = currentItems.filter(item => item.id !== id);
    setMonthActivities(prev => ({
      ...prev,
      [selectedMonthIndex]: updatedList
    }));
  };

  // Reset to auto-calculated default
  const handleResetToDefault = () => {
    const fresh = generateDefaultActivitiesForMonth(selectedMonthIndex, monthStats);
    setMonthActivities(prev => ({
      ...prev,
      [selectedMonthIndex]: fresh
    }));
  };

  // Dynamic signature date at the end of the selected month
  const getSignatureDateForMonth = (mIdx: number, year: number) => {
    const lastDay = new Date(year, mIdx + 1, 0).getDate();
    return `${lastDay} ${MONTH_NAMES[mIdx]} ${year}`;
  };

  const autoSignatureDate = useMemo(() => {
    return getSignatureDateForMonth(selectedMonthIndex, currentCalendarYear);
  }, [currentCalendarYear, selectedMonthIndex]);

  // Copy table as text
  const handleCopyText = () => {
    let text = `LAPORAN KINERJA BULANAN\n`;
    text += `Bulan: ${MONTH_NAMES[selectedMonthIndex]} ${currentCalendarYear}\n`;
    text += `Nama: ${teacherName}\n`;
    text += `NIP: ${teacherNip || '-'}\n`;
    text += `Jabatan: ${customJabatan} (${teacherGrade})\n`;
    text += `Unit Kerja: ${customUnitKerja}\n\n`;
    text += `TUGAS UTAMA / POKOK:\n`;
    tugasUtama.forEach((item, idx) => {
      text += `${idx + 1}. ${item.uraian} | Volume: ${item.volume} | Bukti: ${item.bukti}\n`;
    });
    text += `\nTUGAS TAMBAHAN:\n`;
    tugasTambahan.forEach((item, idx) => {
      text += `${tugasUtama.length + idx + 1}. ${item.uraian} | Volume: ${item.volume} | Bukti: ${item.bukti}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Export as CSV
  const handleExportCsv = () => {
    const rows = [
      ['No', 'Uraian Tugas/Kegiatan', 'Volume', 'Bukti Dokumen', 'Kategori'],
      ...tugasUtama.map((item, idx) => [idx + 1, `"${item.uraian.replace(/"/g, '""')}"`, `"${item.volume}"`, `"${item.bukti}"`, 'Tugas Utama']),
      ...tugasTambahan.map((item, idx) => [tugasUtama.length + idx + 1, `"${item.uraian.replace(/"/g, '""')}"`, `"${item.volume}"`, `"${item.bukti}"`, 'Tugas Tambahan'])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LKB_${teacherName.replace(/\s+/g, '_')}_${MONTH_NAMES[selectedMonthIndex]}_${currentCalendarYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to escape HTML characters
  const escapeHtml = (str: string) => {
    return (str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Helper to build a single month's Word document HTML
  const buildMonthWordHtml = (
    mIdx: number,
    mName: string,
    calYr: number,
    items: LkbItem[],
    sigDate: string
  ) => {
    const mUtama = items.filter(i => i.category === 'utama');
    const mTambahan = items.filter(i => i.category === 'tambahan');

    const utamaRows = mUtama.map((item, idx) => `
      <tr>
        <td style="border: 1pt solid #000000; padding: 5pt 5pt; text-align: center; vertical-align: top;">${idx + 1}.</td>
        <td style="border: 1pt solid #000000; padding: 5pt 6pt; vertical-align: top; text-align: left; line-height: 1.35;">${escapeHtml(item.uraian)}</td>
        <td style="border: 1pt solid #000000; padding: 5pt 5pt; text-align: center; vertical-align: top; white-space: nowrap; font-weight: bold;">${escapeHtml(item.volume)}</td>
        <td style="border: 1pt solid #000000; padding: 5pt 6pt; vertical-align: top; text-align: left; line-height: 1.35;">${escapeHtml(item.bukti)}</td>
      </tr>
    `).join('');

    const tambahanRows = mTambahan.map((item, idx) => `
      <tr>
        <td style="border: 1pt solid #000000; padding: 5pt 5pt; text-align: center; vertical-align: top;">${mUtama.length + idx + 1}.</td>
        <td style="border: 1pt solid #000000; padding: 5pt 6pt; vertical-align: top; text-align: left; line-height: 1.35;">${escapeHtml(item.uraian)}</td>
        <td style="border: 1pt solid #000000; padding: 5pt 5pt; text-align: center; vertical-align: top; white-space: nowrap; font-weight: bold;">${escapeHtml(item.volume)}</td>
        <td style="border: 1pt solid #000000; padding: 5pt 6pt; vertical-align: top; text-align: left; line-height: 1.35;">${escapeHtml(item.bukti)}</td>
      </tr>
    `).join('');

    return `
      <div class="lkb-month-page" style="margin-bottom: 24pt;">
        <!-- Header -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 14pt;">
          <tr>
            <td style="text-align: center; border: none; padding: 0;">
              <p style="font-family: 'Times New Roman', serif; font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 0 0 2pt 0;">LAPORAN KINERJA BULANAN</p>
              <p style="font-family: 'Times New Roman', serif; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin: 0;">BULAN ${escapeHtml(mName).toUpperCase()} ${calYr}</p>
            </td>
          </tr>
        </table>

        <!-- Identity Table -->
        <table style="width: 100%; max-width: 450pt; border-collapse: collapse; margin-bottom: 12pt; font-family: 'Times New Roman', serif; font-size: 11pt;">
          <tbody>
            <tr>
              <td style="width: 90pt; padding: 2pt 2pt; font-weight: bold; border: none;">Nama</td>
              <td style="width: 12pt; padding: 2pt 2pt; border: none;">:</td>
              <td style="padding: 2pt 2pt; font-weight: bold; text-transform: uppercase; border: none;">${escapeHtml(teacherName || 'Cepi Sopyan, S.Pd.')}</td>
            </tr>
            <tr>
              <td style="padding: 2pt 2pt; font-weight: bold; border: none;">NIP</td>
              <td style="padding: 2pt 2pt; border: none;">:</td>
              <td style="padding: 2pt 2pt; border: none;">${escapeHtml(teacherNip || '-')}</td>
            </tr>
            <tr>
              <td style="padding: 2pt 2pt; font-weight: bold; border: none;">Jabatan</td>
              <td style="padding: 2pt 2pt; border: none;">:</td>
              <td style="padding: 2pt 2pt; border: none;">${escapeHtml(customJabatan)} (${escapeHtml(teacherGrade)})</td>
            </tr>
            <tr>
              <td style="padding: 2pt 2pt; font-weight: bold; border: none;">Unit Kerja</td>
              <td style="padding: 2pt 2pt; border: none;">:</td>
              <td style="padding: 2pt 2pt; font-weight: bold; text-transform: uppercase; border: none;">${escapeHtml(customUnitKerja)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Main Tasks Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16pt; font-family: 'Times New Roman', serif; font-size: 10pt;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1pt solid #000000; padding: 6pt 4pt; width: 32pt; text-align: center; font-weight: bold;">NO.</th>
              <th style="border: 1pt solid #000000; padding: 6pt 6pt; text-align: left; font-weight: bold;">URAIAN TUGAS/KEGIATAN</th>
              <th style="border: 1pt solid #000000; padding: 6pt 4pt; width: 90pt; text-align: center; font-weight: bold;">VOLUME</th>
              <th style="border: 1pt solid #000000; padding: 6pt 6pt; width: 145pt; text-align: left; font-weight: bold;">BUKTI DOKUMEN</th>
            </tr>
          </thead>
          <tbody>
            ${utamaRows}
            <tr style="background-color: #f2f2f2;">
              <td colspan="4" style="border: 1pt solid #000000; padding: 5pt 6pt; font-weight: bold; text-transform: uppercase; font-size: 9.5pt;">TUGAS TAMBAHAN</td>
            </tr>
            ${tambahanRows}
          </tbody>
        </table>

        <!-- Dual Signatures Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 18pt; font-family: 'Times New Roman', serif; font-size: 10.5pt; page-break-inside: avoid;">
          <tbody>
            <tr>
              <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0 10pt;">
                <p style="margin: 0; padding: 0;">Mengetahui,</p>
                <p style="margin: 0; padding: 0; font-weight: bold;">Kepala Madrasah</p>
                <div style="height: 55pt; line-height: 55pt;">&nbsp;</div>
                <p style="margin: 0; padding: 0; font-weight: bold; text-decoration: underline; text-transform: uppercase;">${escapeHtml(principalName || 'H. Ahmad Sopyan, S.Pd.I.')}</p>
                <p style="margin: 2pt 0 0 0; padding: 0; font-size: 9.5pt;">NIP. ${escapeHtml(principalNip || '197408122005011003')}</p>
              </td>
              <td style="width: 50%; text-align: center; vertical-align: top; border: none; padding: 0 10pt;">
                <p style="margin: 0; padding: 0;">${escapeHtml(signaturePlace || 'Cibungur')}, ${escapeHtml(sigDate)}</p>
                <p style="margin: 0; padding: 0; font-weight: bold;">${escapeHtml(signatureRoleTitle)},</p>
                <div style="height: 55pt; line-height: 55pt;">&nbsp;</div>
                <p style="margin: 0; padding: 0; font-weight: bold; text-decoration: underline; text-transform: uppercase;">${escapeHtml(teacherName || 'Cepi Sopyan, S.Pd.')}</p>
                <p style="margin: 2pt 0 0 0; padding: 0; font-size: 9.5pt;">NIP. ${escapeHtml(teacherNip || '199005142023211002')}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };

  // Export as Microsoft Word (.doc)
  const handleExportWord = (mode: 'current' | 'semester' = 'current') => {
    let contentHtml = '';
    let filename = '';

    if (mode === 'current') {
      contentHtml = buildMonthWordHtml(
        selectedMonthIndex,
        MONTH_NAMES[selectedMonthIndex],
        currentCalendarYear,
        currentItems,
        autoSignatureDate
      );
      filename = `LKB_${(teacherName || 'Guru').replace(/\s+/g, '_')}_${MONTH_NAMES[selectedMonthIndex]}_${currentCalendarYear}.doc`;
    } else {
      const targetMonths = activeSemesterTab === 1 
        ? ACADEMIC_MONTHS.slice(0, 6) 
        : ACADEMIC_MONTHS.slice(6, 12);

      contentHtml = targetMonths.map((bm, idx) => {
        const calYr = bm.monthIndex >= 6 ? selectedYear : selectedYear + 1;
        const bStats = computeStatsForMonth(bm.monthIndex, calYr);
        const bItems = monthActivities[bm.monthIndex] && monthActivities[bm.monthIndex].length > 0
          ? monthActivities[bm.monthIndex]
          : generateDefaultActivitiesForMonth(bm.monthIndex, bStats);
        const bSigDate = getSignatureDateForMonth(bm.monthIndex, calYr);

        const html = buildMonthWordHtml(bm.monthIndex, bm.name, calYr, bItems, bSigDate);
        if (idx < targetMonths.length - 1) {
          return html + `<br clear="all" style="page-break-before:always; mso-break-type:section-break;" />`;
        }
        return html;
      }).join('\n');

      const semLabel = activeSemesterTab === 1 ? 'Semester_I_Ganjil' : 'Semester_II_Genap';
      filename = `LKB_${(teacherName || 'Guru').replace(/\s+/g, '_')}_${semLabel}_${selectedYear}-${selectedYear + 1}.doc`;
    }

    const wordTemplate = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Laporan Kinerja Bulanan</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page Section1 {
            size: 21.0cm 29.7cm;
            margin: 2.0cm 2.0cm 2.0cm 2.0cm;
            mso-header-margin: 36.0pt;
            mso-footer-margin: 36.0pt;
            mso-paper-source: 0;
          }
          div.Section1 {
            page: Section1;
          }
          body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            color: #000000;
          }
        </style>
      </head>
      <body>
        <div class="Section1">
          ${contentHtml}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordTemplate], {
      type: 'application/msword;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Trigger print
  const handlePrint = () => {
    window.print();
  };

  // List of months for batch printing
  const batchMonths = useMemo(() => {
    if (!batchPrintSemester) return [];
    return activeSemesterTab === 1 
      ? ACADEMIC_MONTHS.slice(0, 6) 
      : ACADEMIC_MONTHS.slice(6, 12);
  }, [batchPrintSemester, activeSemesterTab]);

  return (
    <div className="space-y-6">
      {/* Dynamic Print CSS to enforce Portrait or Landscape as chosen by user */}
      <style>{`
        @media print {
          @page {
            size: A4 ${printOrientation} !important;
            margin: 10mm 12mm 10mm 12mm !important;
          }
          .lkb-print-document {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 auto !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .lkb-page-break {
            page-break-after: always !important;
            break-after: page !important;
          }
        }
      `}</style>

      {/* Screen Only Control & Header Section */}
      <div className="screen-only space-y-5">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <ClipboardList size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  MI Cibungur I
                </span>
                <h1 className="text-xl font-black text-slate-800 tracking-tight">
                  LKB (Lembar Kerja Guru Bulanan)
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Laporan Kinerja Bulanan terintegrasi Kalender Pendidikan, perhitungan volume mengajar, dan upacara bendera hari Senin.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Orientation Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
              <button
                onClick={() => setPrintOrientation('portrait')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  printOrientation === 'portrait'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Cetak Tegak / Portrait (Standar Format PDF)"
              >
                Portrait
              </button>
              <button
                onClick={() => setPrintOrientation('landscape')}
                className={`px-2.5 py-1.5 rounded-lg transition-all ${
                  printOrientation === 'landscape'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
                title="Cetak Mendatar / Landscape"
              >
                Landscape
              </button>
            </div>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
              title="Atur Jabatan & Profil Pengajar"
            >
              <Settings size={14} className="text-slate-600" />
              <span>Pengaturan LKB</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
            >
              {copiedNotification ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-slate-600" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200"
            >
              <Download size={14} className="text-slate-600" />
              <span>Export CSV</span>
            </button>

            {/* Word .doc Export Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowWordMenu(!showWordMenu)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
                title="Download Dokumen Microsoft Word (.doc)"
              >
                <FileText size={14} className="text-blue-600" />
                <span>Download Word (.doc)</span>
                <ChevronDown size={13} className={`text-blue-600 transition-transform ${showWordMenu ? 'rotate-180' : ''}`} />
              </button>

              {showWordMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowWordMenu(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-30 py-1.5 text-xs">
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                      <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Opsi Dokumen Word (.doc)</p>
                      <p className="text-[10px] text-slate-400">Format resmi MI Cibungur I, siap edit & cetak</p>
                    </div>

                    <button
                      onClick={() => {
                        handleExportWord('current');
                        setShowWordMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700 flex items-center gap-1.5">
                          <FileText size={13} className="text-blue-600" />
                          <span>Bulan Aktif ({MONTH_NAMES[selectedMonthIndex]})</span>
                        </div>
                        <p className="text-[10px] text-slate-400">{MONTH_NAMES[selectedMonthIndex]} {currentCalendarYear}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">.doc</span>
                    </button>

                    <button
                      onClick={() => {
                        handleExportWord('semester');
                        setShowWordMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors flex items-center justify-between group border-t border-slate-100"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-800 group-hover:text-blue-700 flex items-center gap-1.5">
                          <Download size={13} className="text-emerald-600" />
                          <span>1 Semester ({activeSemesterTab === 1 ? 'Semester I Ganjil' : 'Semester II Genap'})</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Bundle 6 bulan otomatis page break</p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">6 Bulan</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer size={15} />
              <span>Cetak / PDF (A4)</span>
            </button>
          </div>
        </div>

        {/* Semester, Grade, & Month Navigation Ribbon */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
          {/* Top Bar: Semester Switcher, Grade Selector, & Batch Print */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar size={14} className="text-emerald-600" />
                Pilih Bulan Pelaporan
              </span>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveSemesterTab(1);
                    setSelectedMonthIndex(6); // Juli
                  }}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeSemesterTab === 1 
                      ? 'bg-white text-emerald-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semester I (Ganjil {selectedYear})
                </button>
                <button
                  onClick={() => {
                    setActiveSemesterTab(2);
                    setSelectedMonthIndex(0); // Januari
                  }}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeSemesterTab === 2 
                      ? 'bg-white text-emerald-800 shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semester II (Genap {selectedYear + 1})
                </button>
              </div>

              {/* Quick Grade Selector Pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-1.5">Kelas:</span>
                {['Kelas I', 'Kelas II', 'Kelas III', 'Kelas IV', 'Kelas V', 'Kelas VI'].map((gr) => {
                  const isGrActive = teacherGrade === gr;
                  const isSpecial = gr === 'Kelas VI';
                  return (
                    <button
                      key={gr}
                      onClick={() => setTeacherGrade(gr)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isGrActive
                          ? isSpecial
                            ? 'bg-gradient-to-r from-amber-500 to-emerald-600 text-white shadow-xs'
                            : 'bg-white text-emerald-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                      title={isSpecial ? 'Kelas VI: KBM Selesai Lebih Awal & Terintegrasi Ujian/Kelulusan' : `Pilih ${gr}`}
                    >
                      <span>{gr.replace('Kelas ', 'Kls ')}</span>
                      {isSpecial && <span className="text-[10px]">⭐</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={batchPrintSemester}
                  onChange={(e) => setBatchPrintSemester(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-semibold text-slate-700">Cetak Seluruh Semester Sekaligus (6 Bulan)</span>
              </label>

              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Tahun Ajaran: <strong className="text-slate-800 font-bold">{selectedYear}/{selectedYear + 1}</strong>
              </div>
            </div>
          </div>

          {/* Special Grade VI Alert Bar */}
          {isGrade6 && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  VI
                </span>
                <div>
                  <span className="font-bold text-amber-950">
                    Mode Kelas VI Aktif (Penyesuaian Akhir Jenjang):
                  </span>{' '}
                  KBM tatap muka Semester II selesai lebih awal. Volume mengajar Mei & Juni disesuaikan, serta otomatis mengintegrasikan agenda Ujian (Try Out, Ujian Praktik, Asesmen Madrasah, Olah Nilai Kelulusan, Penulisan Ijazah & Pelepasan Siswa) dari Kalender Pendidikan.
                </div>
              </div>
              <button
                onClick={handleResetToDefault}
                className="px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300 shrink-0"
              >
                Sinkronkan Ulang dari Kalpen
              </button>
            </div>
          )}

          {/* Month Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {(activeSemesterTab === 1 
              ? ACADEMIC_MONTHS.slice(0, 6) 
              : ACADEMIC_MONTHS.slice(6, 12)
            ).map((m) => {
              const isSelected = selectedMonthIndex === m.monthIndex;
              const calYear = m.monthIndex >= 6 ? selectedYear : selectedYear + 1;
              const previewStats = computeStatsForMonth(m.monthIndex, calYear);
              
              return (
                <button
                  key={m.name}
                  onClick={() => {
                    setSelectedMonthIndex(m.monthIndex);
                    if (batchPrintSemester) setBatchPrintSemester(false);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black tracking-tight">{m.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}>
                      {calYear}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1.5 font-medium flex items-center justify-between ${
                    isSelected ? 'text-emerald-100' : 'text-slate-500'
                  }`}>
                    <span>
                      {previewStats.effectiveTeachingDays === 0
                        ? `KBM: 0 hr (Tuntas)`
                        : isGrade6 && m.monthIndex === 4
                          ? `KBM: ${previewStats.effectiveTeachingDays} hr (Pra AM)`
                          : `KBM: ${previewStats.effectiveTeachingDays} hr`}
                    </span>
                    <span>Upacara: {previewStats.mondayCeremonyCount}x</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Analytics & Kalender Calculation Insight Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-slate-50 border border-emerald-200/70 rounded-2xl p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                  <CalendarCheck2 size={16} />
                </span>
                <h3 className="text-sm font-black text-slate-800">
                  Data Kalender Otomatis: Bulan {MONTH_NAMES[selectedMonthIndex]} {currentCalendarYear} ({teacherGrade})
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                {monthStats.effectiveTeachingDays === 0 ? (
                  <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 inline-block">
                    ⚠️ {monthStats.grade6Note || 'Bulan ini KBM tatap muka = 0 Hari (KBM semester genap telah tuntas). Hari efektif dialokasikan untuk pelaksanaan Ujian Akhir (PAT/ASAT), pengolahan RDM, kelulusan, pembagian rapor, dan libur tahun ajaran.'}
                  </span>
                ) : monthStats.grade6Note ? (
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                    ℹ️ {monthStats.grade6Note}. Volume Upacara Bendera Senin ({monthStats.mondayCeremonyCount}x).
                  </span>
                ) : (
                  <span>
                    Volume KBM tatap muka murni ({monthStats.effectiveTeachingDays} hari) dan Upacara Bendera Senin ({monthStats.mondayCeremonyCount}x) dihitung langsung dari Kalender Pendidikan {schoolName} (hanya hari aktif belajar, di luar libur dan kegiatan ujian).
                  </span>
                )}
              </p>

              {/* Show Detected Examination & School Events from Kalender */}
              {monthStats.groupedEvents.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 text-[11px]">
                  <span className="font-bold text-slate-600 flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-500" />
                    Agenda Kalpen Terdeteksi:
                  </span>
                  {monthStats.groupedEvents.map((ev, idx) => (
                    <span 
                      key={idx} 
                      className="bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 px-2 py-0.5 rounded-md font-semibold text-[10px]"
                    >
                      {ev.title} ({ev.count} hari)
                    </span>
                  ))}
                </div>
              )}

              {monthStats.mondayDates.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-600">Jadwal Upacara Senin:</span>
                  {monthStats.mondayDates.map((md, idx) => (
                    <span key={idx} className="bg-white/90 border border-emerald-200 px-2 py-0.5 rounded text-emerald-800 font-bold">
                      {md}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Monday Upacara counter */}
              <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2.5">
                <Flag size={18} className="text-red-500 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                    Upacara Senin
                  </div>
                  <div className="text-sm font-black text-slate-800 mt-0.5">
                    {monthStats.mondayCeremonyCount} Kegiatan
                  </div>
                </div>
              </div>

              {/* HEB / KBM Counter */}
              <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-xs flex items-center gap-2.5">
                <BookOpen size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                    {isGrade6 ? 'Volume KBM Kelas VI' : 'Volume KBM (HEB)'}
                  </div>
                  <div className="text-sm font-black text-emerald-700 mt-0.5">
                    {isGrade6 && selectedMonthIndex === 5 
                      ? 'KBM Tuntas' 
                      : `${monthStats.effectiveTeachingDays} Hari Efektif`}
                  </div>
                </div>
              </div>

              {/* Action: Add custom row & Reset */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs"
                >
                  <Plus size={14} />
                  <span>Tambah Kegiatan</span>
                </button>

                <button
                  onClick={handleResetToDefault}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  title="Hitung ulang otomatis dari kalender pendidikan"
                >
                  <RotateCcw size={13} className="text-slate-500" />
                  <span>Reset Otomatis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Single Document View (or Batch Multi-Month View if batchPrintSemester is enabled) */}
      {!batchPrintSemester ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-5xl mx-auto lkb-print-document font-serif text-black">
          {/* Document Header (Replicating Sample PDF) */}
          <div className="text-center space-y-1 mb-6 border-b border-black/20 pb-4">
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-black">
              LAPORAN KINERJA BULANAN
            </h1>
            <p className="text-sm font-semibold text-black uppercase">
              Bulan {MONTH_NAMES[selectedMonthIndex]} {currentCalendarYear}
            </p>
          </div>

          {/* Teacher Identity Block (Replicating Sample PDF) */}
          <div className="mb-6 text-sm font-sans">
            <table className="w-full max-w-xl text-xs sm:text-sm">
              <tbody>
                <tr>
                  <td className="w-28 py-0.5 font-semibold text-black">Nama</td>
                  <td className="w-4 py-0.5 text-black">:</td>
                  <td className="py-0.5 font-bold text-black uppercase">{teacherName || 'Cepi Sopyan, S.Pd.'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-black">NIP</td>
                  <td className="py-0.5 text-black">:</td>
                  <td className="py-0.5 text-black">{teacherNip || '-'}</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-black">Jabatan</td>
                  <td className="py-0.5 text-black">:</td>
                  <td className="py-0.5 text-black font-semibold">{customJabatan} ({teacherGrade})</td>
                </tr>
                <tr>
                  <td className="py-0.5 font-semibold text-black">Unit Kerja</td>
                  <td className="py-0.5 text-black">:</td>
                  <td className="py-0.5 text-black font-bold uppercase">{customUnitKerja}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Main Performance Table (Replicating Sample PDF Table Structure) */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm border-collapse border border-black text-black font-sans">
              <thead>
                <tr className="bg-slate-100 text-black border-b border-black font-bold text-center">
                  <th className="border border-black py-2 px-2 w-12 text-center">NO.</th>
                  <th className="border border-black py-2 px-3 text-left">URAIAN TUGAS/KEGIATAN</th>
                  <th className="border border-black py-2 px-2 w-28 sm:w-36 text-center">VOLUME</th>
                  <th className="border border-black py-2 px-3 w-40 sm:w-56 text-left">BUKTI DOKUMEN</th>
                  <th className="border border-black py-2 px-2 w-16 text-center screen-only">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {/* Tugas Pokok / Utama Section */}
                {tugasUtama.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="border border-black py-2 px-2 text-center font-medium align-top">
                      {index + 1}.
                    </td>
                    <td className="border border-black py-2 px-3 leading-relaxed align-top">
                      <span className="font-medium text-black">{item.uraian}</span>
                    </td>
                    <td className="border border-black py-2 px-2 text-center font-semibold align-top whitespace-nowrap">
                      {item.volume}
                    </td>
                    <td className="border border-black py-2 px-3 align-top leading-relaxed text-slate-800">
                      {item.bukti}
                    </td>
                    {/* Screen Only Quick Action Buttons */}
                    <td className="border border-black py-2 px-1 text-center align-middle screen-only">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                          title="Edit Item"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="Hapus Item"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Tugas Tambahan Header Row (Matching Sample PDF Divider) */}
                <tr className="bg-slate-100 font-bold border-y border-black">
                  <td colSpan={4} className="border border-black py-1.5 px-3 text-left font-bold uppercase tracking-wider text-xs">
                    Tugas Tambahan
                  </td>
                  <td className="border border-black screen-only"></td>
                </tr>

                {/* Tugas Tambahan Items */}
                {tugasTambahan.map((item, index) => {
                  const rowNumber = tugasUtama.length + index + 1;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="border border-black py-2 px-2 text-center font-medium align-top">
                        {rowNumber}.
                      </td>
                      <td className="border border-black py-2 px-3 leading-relaxed align-top">
                        <span className="font-medium text-black">{item.uraian}</span>
                      </td>
                      <td className="border border-black py-2 px-2 text-center font-semibold align-top whitespace-nowrap">
                        {item.volume}
                      </td>
                      <td className="border border-black py-2 px-3 align-top leading-relaxed text-slate-800">
                        {item.bukti}
                      </td>
                      {/* Screen Only Quick Action Buttons */}
                      <td className="border border-black py-2 px-1 text-center align-middle screen-only">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Edit Item"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Hapus Item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Dual Signatures Section (Replicating Sample PDF Exact Alignment) */}
          <div className="mt-12 text-sm font-sans page-break-avoid">
            <div className="flex justify-between items-start text-center">
              {/* Left Signature: Kepala Madrasah */}
              <div className="w-64 space-y-1">
                <p className="font-medium">Mengetahui,</p>
                <p className="font-bold">Kepala Madrasah</p>
                
                {/* Spacer for Physical Signature */}
                <div className="h-20 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 italic screen-only">(Tanda Tangan & Stempel)</span>
                </div>

                <div className="space-y-0.5">
                  <p className="font-bold underline text-black uppercase">
                    {principalName || 'H. Ahmad Sopyan, S.Pd.I.'}
                  </p>
                  <p className="text-xs text-black">
                    NIP. {principalNip || '197408122005011003'}
                  </p>
                </div>
              </div>

              {/* Right Signature: Guru Kelas */}
              <div className="w-64 space-y-1">
                <p className="font-medium">
                  {signaturePlace || 'Cibungur'}, {autoSignatureDate}
                </p>
                <p className="font-bold">{signatureRoleTitle},</p>

                {/* Spacer for Physical Signature */}
                <div className="h-20 flex items-center justify-center">
                  <span className="text-[10px] text-slate-300 italic screen-only">(Tanda Tangan)</span>
                </div>

                <div className="space-y-0.5">
                  <p className="font-bold underline text-black uppercase">
                    {teacherName || 'Cepi Sopyan, S.Pd.'}
                  </p>
                  <p className="text-xs text-black">
                    NIP. {teacherNip || '199005142023211002'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Batch Multi-Month Print View for Entire Semester */
        <div className="space-y-10">
          <div className="screen-only p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center justify-between">
            <span>Menampilkan 6 bulan sekaligus untuk Semester {activeSemesterTab === 1 ? 'I (Ganjil)' : 'II (Genap)'}. Setiap bulan akan otomatis terpisah halaman saat dicetak.</span>
            <button
              onClick={() => setBatchPrintSemester(false)}
              className="px-3 py-1 bg-white border border-emerald-300 rounded-lg text-emerald-900 font-bold hover:bg-emerald-100"
            >
              Kembali ke Tampilan 1 Bulan
            </button>
          </div>

          {batchMonths.map((bm, bIdx) => {
            const calYr = bm.monthIndex >= 6 ? selectedYear : selectedYear + 1;
            const bStats = computeStatsForMonth(bm.monthIndex, calYr);
            const bItems = monthActivities[bm.monthIndex] && monthActivities[bm.monthIndex].length > 0
              ? monthActivities[bm.monthIndex]
              : generateDefaultActivitiesForMonth(bm.monthIndex, bStats);
            const bUtama = bItems.filter(i => i.category === 'utama');
            const bTambahan = bItems.filter(i => i.category === 'tambahan');
            const bSigDate = getSignatureDateForMonth(bm.monthIndex, calYr);

            return (
              <div 
                key={bm.name} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-5xl mx-auto lkb-print-document font-serif text-black lkb-page-break"
              >
                <div className="text-center space-y-1 mb-6 border-b border-black/20 pb-4">
                  <h1 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-black">
                    LAPORAN KINERJA BULANAN
                  </h1>
                  <p className="text-sm font-semibold text-black uppercase">
                    Bulan {bm.name} {calYr}
                  </p>
                </div>

                <div className="mb-6 text-sm font-sans">
                  <table className="w-full max-w-xl text-xs sm:text-sm">
                    <tbody>
                      <tr>
                        <td className="w-28 py-0.5 font-semibold text-black">Nama</td>
                        <td className="w-4 py-0.5 text-black">:</td>
                        <td className="py-0.5 font-bold text-black uppercase">{teacherName || 'Cepi Sopyan, S.Pd.'}</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-semibold text-black">NIP</td>
                        <td className="py-0.5 text-black">:</td>
                        <td className="py-0.5 text-black">{teacherNip || '-'}</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-semibold text-black">Jabatan</td>
                        <td className="py-0.5 text-black">:</td>
                        <td className="py-0.5 text-black font-semibold">{customJabatan} ({teacherGrade})</td>
                      </tr>
                      <tr>
                        <td className="py-0.5 font-semibold text-black">Unit Kerja</td>
                        <td className="py-0.5 text-black">:</td>
                        <td className="py-0.5 text-black font-bold uppercase">{customUnitKerja}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm border-collapse border border-black text-black font-sans">
                    <thead>
                      <tr className="bg-slate-100 text-black border-b border-black font-bold text-center">
                        <th className="border border-black py-2 px-2 w-12 text-center">NO.</th>
                        <th className="border border-black py-2 px-3 text-left">URAIAN TUGAS/KEGIATAN</th>
                        <th className="border border-black py-2 px-2 w-28 sm:w-36 text-center">VOLUME</th>
                        <th className="border border-black py-2 px-3 w-40 sm:w-56 text-left">BUKTI DOKUMEN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bUtama.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-black py-2 px-2 text-center font-medium align-top">
                            {index + 1}.
                          </td>
                          <td className="border border-black py-2 px-3 leading-relaxed align-top">
                            <span className="font-medium text-black">{item.uraian}</span>
                          </td>
                          <td className="border border-black py-2 px-2 text-center font-semibold align-top whitespace-nowrap">
                            {item.volume}
                          </td>
                          <td className="border border-black py-2 px-3 align-top leading-relaxed text-slate-800">
                            {item.bukti}
                          </td>
                        </tr>
                      ))}

                      <tr className="bg-slate-100 font-bold border-y border-black">
                        <td colSpan={4} className="border border-black py-1.5 px-3 text-left font-bold uppercase tracking-wider text-xs">
                          Tugas Tambahan
                        </td>
                      </tr>

                      {bTambahan.map((item, index) => (
                        <tr key={item.id}>
                          <td className="border border-black py-2 px-2 text-center font-medium align-top">
                            {bUtama.length + index + 1}.
                          </td>
                          <td className="border border-black py-2 px-3 leading-relaxed align-top">
                            <span className="font-medium text-black">{item.uraian}</span>
                          </td>
                          <td className="border border-black py-2 px-2 text-center font-semibold align-top whitespace-nowrap">
                            {item.volume}
                          </td>
                          <td className="border border-black py-2 px-3 align-top leading-relaxed text-slate-800">
                            {item.bukti}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-12 text-sm font-sans page-break-avoid">
                  <div className="flex justify-between items-start text-center">
                    <div className="w-64 space-y-1">
                      <p className="font-medium">Mengetahui,</p>
                      <p className="font-bold">Kepala Madrasah</p>
                      <div className="h-20"></div>
                      <div className="space-y-0.5">
                        <p className="font-bold underline text-black uppercase">{principalName}</p>
                        <p className="text-xs text-black">NIP. {principalNip}</p>
                      </div>
                    </div>

                    <div className="w-64 space-y-1">
                      <p className="font-medium">{signaturePlace}, {bSigDate}</p>
                      <p className="font-bold">{signatureRoleTitle},</p>
                      <div className="h-20"></div>
                      <div className="space-y-0.5">
                        <p className="font-bold underline text-black uppercase">{teacherName}</p>
                        <p className="text-xs text-black">NIP. {teacherNip}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Screen Only Quick Add / Edit Modal */}
      {(isAddingNew || editingItem) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 screen-only">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800">
                {editingItem ? 'Edit Uraian Tugas LKB' : 'Tambah Kegiatan Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kategori Tugas</label>
                <select
                  value={editingItem ? editingItem.category : newItemCategory}
                  onChange={(e) => {
                    const cat = e.target.value as 'utama' | 'tambahan';
                    if (editingItem) setEditingItem({ ...editingItem, category: cat });
                    else setNewItemCategory(cat);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="utama">Tugas Pokok / Utama</option>
                  <option value="tambahan">Tugas Tambahan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Uraian Tugas / Kegiatan</label>
                <textarea
                  rows={3}
                  value={editingItem ? editingItem.uraian : newItemUraian}
                  onChange={(e) => {
                    if (editingItem) setEditingItem({ ...editingItem, uraian: e.target.value });
                    else setNewItemUraian(e.target.value);
                  }}
                  placeholder="Contoh: Mengikuti Upacara Bendera setiap hari Senin..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Volume</label>
                  <input
                    type="text"
                    value={editingItem ? editingItem.volume : newItemVolume}
                    onChange={(e) => {
                      if (editingItem) setEditingItem({ ...editingItem, volume: e.target.value });
                      else setNewItemVolume(e.target.value);
                    }}
                    placeholder="Contoh: 4 Kegiatan / 21 Hari"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bukti Dokumen</label>
                  <input
                    type="text"
                    value={editingItem ? editingItem.bukti : newItemBukti}
                    onChange={(e) => {
                      if (editingItem) setEditingItem({ ...editingItem, bukti: e.target.value });
                      else setNewItemBukti(e.target.value);
                    }}
                    placeholder="Contoh: Foto & Absensi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (editingItem) handleUpdateItem(editingItem);
                  else handleAddItem();
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Only Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 screen-only">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-emerald-600" />
                <h3 className="text-base font-black text-slate-800">
                  Pengaturan Identitas & Format LKB
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Unit Kerja (Nama Madrasah)</label>
                <input
                  type="text"
                  value={customUnitKerja}
                  onChange={(e) => setCustomUnitKerja(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Jabatan Guru</label>
                  <select
                    value={customJabatan}
                    onChange={(e) => setCustomJabatan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Guru Kelas MI">Guru Kelas MI</option>
                    <option value="Guru Mapel PAI">Guru Mapel PAI</option>
                    <option value="Guru Mapel Fikih">Guru Mapel Fikih</option>
                    <option value="Guru Mapel Al-Qur'an Hadis">Guru Mapel Al-Qur'an Hadis</option>
                    <option value="Guru Mapel Akidah Akhlak">Guru Mapel Akidah Akhlak</option>
                    <option value="Guru Mapel SKI">Guru Mapel SKI</option>
                    <option value="Guru Mapel Bahasa Arab">Guru Mapel Bahasa Arab</option>
                    <option value="Guru Mapel PJOK">Guru Mapel PJOK</option>
                    <option value="Guru Mapel Bahasa Inggris">Guru Mapel Bahasa Inggris</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tingkat Kelas</label>
                  <select
                    value={teacherGrade}
                    onChange={(e) => setTeacherGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Kelas I">Kelas I</option>
                    <option value="Kelas II">Kelas II</option>
                    <option value="Kelas III">Kelas III</option>
                    <option value="Kelas IV">Kelas IV</option>
                    <option value="Kelas V">Kelas V</option>
                    <option value="Kelas VI">Kelas VI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Label Tanda Tangan Guru (Titimangsa)
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={signatureRoleTitle}
                    onChange={(e) => setSignatureRoleTitle(e.target.value)}
                    placeholder="Contoh: Guru Kelas"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-medium text-xs"
                  />
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-slate-400 font-semibold">Pilihan cepat:</span>
                    {['Guru Kelas', `Guru Kelas ${teacherGrade.replace('Kelas ', '')}`, 'Guru Mata Pelajaran'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSignatureRoleTitle(preset)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-colors ${
                          signatureRoleTitle === preset 
                            ? 'bg-emerald-600 text-white' 
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-emerald-800 text-[11px] leading-relaxed">
                <span className="font-bold">Tips:</span> Nama Guru, NIP, Nama Kepala Madrasah, dan Tempat Tanda Tangan disinkronkan secara otomatis dari Menu Data Utama ({schoolName}).
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
