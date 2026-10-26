export interface SubjectItem {
  id: string;
  name: string;
  code: string;
  jpPerWeek: number;
  color: string;
  teacherName?: string;
}

export type DayOfWeek = 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';

export interface TimeSlot {
  period: number;
  periodLabel: string;
  startTime: string;
  seninTime?: string;
  isBreak?: boolean;
  isMorningActivity?: boolean;
  breakLabel?: string;
}

export type ScheduleGrid = Record<string, string>; // `${day}-${period}` -> subjectId or special code

export interface TujuanPembelajaran {
  id: string;
  code: string; // e.g. "TP 1.1", "TP 1.2"
  babUnit: string; // e.g. "Bab 1: Mengenal Bilangan Cacah"
  text: string; // Teks Tujuan Pembelajaran (KKO + Konten)
  semester: 1 | 2;
  alokasiJp: number;
  keterangan?: string;
}

export interface SubjectCPData {
  subjectId: string;
  subjectName: string;
  classLevel: string; // e.g. "Kelas 1", "Kelas 4"
  fase: string; // e.g. "Fase A", "Fase B", "Fase C"
  elemen: string; // e.g. "Bilangan, Aljabar, Pengukuran"
  capaianPembelajaran: string; // Teks CP Lengkap yang diinput/copas guru
  tujuanPembelajaranList: TujuanPembelajaran[];
}

export interface ProtaRow {
  id: string;
  semester: 1 | 2;
  noUrut: string;
  babUnit: string;
  materiPokok: string;
  tujuanPembelajaran: string;
  alokasiJp: number;
  keterangan?: string;
  tpId?: string;
}

export interface PromesMonthConfig {
  monthName: string;
  monthIndex: number; // 0..11
  year: number;
  weeksCount: number; // usually 4 or 5
  weekStatus: ('EFEKTIF' | 'MPLS' | 'STS' | 'SAS' | 'LIBUR_SEKOLAH' | 'LIBUR_NASIONAL' | 'NON_EFEKTIF')[];
}

export interface PromesRow {
  id: string;
  semester: 1 | 2;
  noUrut: string;
  babUnit: string;
  tujuanPembelajaran: string;
  alokasiJp: number;
  // key: `${monthIndex}-${weekIndex}` -> JP allocated in that week (e.g. 3, 2, 4)
  weeklyDistribution: Record<string, number>;
  keterangan?: string;
}

export interface ModulAjarDetail {
  id: string;
  subjectId: string;
  subjectName: string;
  classLevel: string;
  fase: string;
  semester: 1 | 2;
  tpCode: string;
  tpText: string;
  materiPokok: string;
  alokasiJpTotal: number;
  jumlahPertemuan: number;
  modelPembelajaran: string; // Discovery Learning, Problem Based Learning, Project Based Learning, Inkuiri
  metodePembelajaran: string; // Diskusi, Tanya Jawab, Penugasan, Praktik, Ceramah Interaktif
  profilPancasila: string[]; // Beriman & Bertakwa, Mandiri, Bernalar Kritis, Gotong Royong, Kreatif, Berkebinekaan Global
  profilRahmatanLilAlamin?: string[]; // Berkeadaban (Ta'addub), Keteladanan (Qudwah), Kewarganegaraan (Muwatanah), dll
  targetPesertaDidik: string; // Reguler / Tipikal
  saranaPrasarana: string; // Buku siswa, LCD proyektor, benda konkret, LKPD
  pemahamanBermakna: string;
  pertanyaanPemantik: string;
  pertemuanList: {
    pertemuanKe: number;
    alokasiMenit: number;
    kegiatanPendahuluan: string;
    kegiatanInti: string;
    kegiatanPenutup: string;
  }[];
  asesmenFormatifAwal: string;
  asesmenFormatifProses: string;
  asesmenSumatif: string;
  rubrikPenilaian: string;
  lampiranLkpd: string;
  lampiranMateri: string;
}

export interface SemesterAlokasiSummary {
  semester: 1 | 2;
  label: string;
  totalMingguKalender: number;
  mingguTidakEfektif: number;
  mingguEfektif: number;
  rincianTidakEfektif: { keterangan: string; jumlahMinggu: number }[];
}

export type QuestionType = 'pg' | 'pg_kompleks' | 'isian' | 'esai';
export type StimulusType = 'none' | 'cerita' | 'tabel' | 'gambar' | 'gabungan';
export type CognitiveLevel = 'L1' | 'L2' | 'L3'; // L1: Mengingat/Memahami (C1-C2), L2: Aplikasi (C3), L3: Penalaran/HOTS (C4-C6)

export interface ExamTPItem {
  id: string;
  code: string; // e.g. "TP 1.1", "TP 1.2"
  text: string;
  materiPokok?: string;
}

export interface ExamCPItem {
  id: string;
  code: string; // e.g. "CP 1", "CP 2"
  elemen: string; // e.g. "Akidah", "Akhlak Terpuji", "Bilangan"
  capaianPembelajaran: string;
  materiPokok: string;
  tpList: ExamTPItem[];
}

export interface QuestionItem {
  id: string;
  number: number;
  type: QuestionType; // 'pg' | 'pg_kompleks' | 'isian' | 'esai'
  subType?: 'tunggal' | 'grup' | 'mcma' | 'kategori';
  groupId?: string;
  groupHeaderNotice?: string; // e.g. "Bacalah cerita fabel berikut untuk menjawab soal nomor 1 sampai 4!"
  isGroupFirst?: boolean;
  complexStatements?: string[]; // Daftar pernyataan/poin (1, 2, 3, 4, ...) untuk PG Kompleks MCMA
  stimulusType: StimulusType;
  stimulusTitle?: string;
  stimulusText?: string;
  stimulusTable?: string;
  stimulusSvg?: string; // Inline SVG markup or preset key for ready-to-print math & madrasah graphics
  stimulusImageUrl?: string; // Base64 data URL or asset URL for image/diagram
  arabicText?: string; // Authentic pre-vocalized Arabic text with full harakat for Fiqih, Akidah, Qurdis, Arab, SKI
  arabicTranslation?: string; // Indonesian translation for the Arabic text
  mathFormula?: string; // Formatted math notation or formula
  questionText: string;
  options?: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: string;
  score: number;
  cognitiveLevel: CognitiveLevel;
  indikatorSoal: string;
  materiPokok: string;
  capaianPembelajaran: string;
  cpId?: string;
  cpCode?: string;
  tpId?: string;
  tpCode?: string;
  tujuanPembelajaran?: string;
  ipk?: string; // Indikator Pencapaian Kompetensi (IPK)
  classLevel?: string; // Tingkat Kelas (e.g. "Kelas 4" atau "IV")
  rubrikPenilaian?: string;
  // Kurikulum Berbasis Cinta (KBC Kemenag - KMA 1503 / Kepdirjen Pendis 6077 Tahun 2025)
  kbcPillar?: 'Cinta Allah' | 'Cinta Rasul' | 'Cinta Diri Sendiri' | 'Cinta Sesama' | 'Cinta Lingkungan' | string;
  kbcDescription?: string; // Penjelasan nilai kasih sayang/karakter KBC yang terkandung dalam soal
}

export interface ExamConfig {
  judulAsesmen: string;
  mataPelajaran: string;
  tingkatKelas: string;
  fase: string;
  semester: 1 | 2;
  alokasiWaktu: string;
  tahunPelajaran: string;
  enableKbcPillars?: boolean; // Integrasi otomatis 5 Pilar Kurikulum Berbasis Cinta Kemenag
  elemen?: string;
  capaianPembelajaran?: string;
  materiPokok?: string;
  cpList: ExamCPItem[]; // Multiple CPs with their respective TPs
  // Kuota & Penskoran
  jumlahPg: number;
  bobotPg: number;
  opsiPgCount: 3 | 4;
  jumlahPgKompleks: number;
  bobotPgKompleks: number;
  jumlahIsian: number;
  bobotIsian: number;
  jumlahEsai: number;
  bobotEsai: number;
  // Stimulus & Kaidah Grup
  ensureAllStimulus?: boolean; // Pastikan 100% semua soal mengandung stimulus kontekstual
  modeStimulus: 'tunggal' | 'grup'; // 'tunggal' = 1 stimulus 1 soal; 'grup' = 1 stimulus beberapa soal terkait
  grupQuestionCount?: number; // Jumlah butir per grup (contoh: 4 soal untuk 1 cerita)
  stimulusType: StimulusType;
  stimulusTitle: string;
  stimulusText: string;
  stimulusTable: string;
  stimulusImageUrl: string;
  stimulusSvg?: string; // Preset SVG graphic
  arabicText?: string;
  arabicTranslation?: string;
  // Kop Naskah Soal & Identitas Resmi (Menyesuaikan inputan dinamis)
  namaYayasan?: string;
  namaMadrasah?: string;
  hariTanggal?: string;
  waktuPelaksanaan?: string;
  customClassLabel?: string;
  kopLogoUrl?: string;
}

export type ExamFontFamily = 'Times New Roman' | 'Arial' | 'Calibri' | 'Bookman Old Style' | 'Cambria' | 'Georgia';
export type ExamPaperSize = 'F4' | 'A4' | 'Legal' | 'Letter';
export type ExamMarginPreset = 'narrow' | 'normal' | 'standard_word' | 'custom';
export type ExamQuestionSpacing = 'compact' | 'normal' | 'spacious';

export interface ExamPaperLayout {
  fontFamily: ExamFontFamily;
  fontSizePt: number;
  lineHeight: number;
  paperSize: ExamPaperSize;
  marginPreset: ExamMarginPreset;
  marginTopCm: number;
  marginBottomCm: number;
  marginLeftCm: number;
  marginRightCm: number;
  columnsCount: 1 | 2;
  showAnswerDottedLines: boolean;
  questionSpacing: ExamQuestionSpacing;
}


