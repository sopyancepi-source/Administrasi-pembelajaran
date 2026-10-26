import { 
  ExamConfig, 
  QuestionItem, 
  ExamCPItem, 
  ExamTPItem,
  ExamPaperLayout,
  ExamPaperSize,
  ExamFontFamily,
  ExamMarginPreset,
  ExamQuestionSpacing
} from '../types/learning';

// Helper function to extract a clean sub-topic (materi pokok) from any clause across all subjects
function extractSubMateriFromClause(clause: string, fallbackMateri: string, elemen: string): string {
  const c = clause.toLowerCase();
  
  // Matematika
  if (c.includes('rasio satuan') || (c.includes('rasio') && c.includes('satuan'))) return 'Rasio Satuan';
  if (c.includes('proporsi') || c.includes('perbandingan senilai')) return 'Proporsi & Perbandingan';
  if (c.includes('pola bilangan')) return 'Pola Bilangan Membesar & Mengecil';
  if (c.includes('kalimat matematika') || c.includes('nilai yang belum diketahui')) return 'Kalimat Matematika & Operasi Bilangan';
  if (c.includes('bilangan cacah')) return 'Bilangan Cacah & Operasi Hitung';
  if (c.includes('pecahan')) return 'Pecahan Biasa & Senilai';
  if (c.includes('bangun datar') || c.includes('luas') || c.includes('keliling')) return 'Keliling & Luas Bangun Datar';
  if (c.includes('bangun ruang') || c.includes('balok') || c.includes('kubus') || c.includes('volume')) return 'Bangun Ruang & Volume';
  if (c.includes('diagram') || c.includes('piktogram') || c.includes('tabel') || c.includes('data')) return 'Penyajian & Analisis Data';
  if (c.includes('waktu') || c.includes('jam') || c.includes('sudut')) return 'Pengukuran Waktu & Sudut';

  // Bahasa Indonesia
  if (c.includes('ide pokok') || c.includes('gagasan utama') || c.includes('paragraf')) return 'Ide Pokok & Kalimat Utama';
  if (c.includes('teks narasi') || c.includes('cerita') || c.includes('dongeng')) return 'Teks Narasi Cerita';
  if (c.includes('teks deskripsi') || c.includes('menggambarkan')) return 'Teks Deskripsi';
  if (c.includes('teks prosedur') || c.includes('petunjuk')) return 'Teks Prosedur & Petunjuk';
  if (c.includes('puisi') || c.includes('pantun') || c.includes('sastra')) return 'Puisi Anak & Keindahan Kata';
  if (c.includes('huruf kapital') || c.includes('tanda baca') || c.includes('ejaan') || c.includes('eyd')) return 'Ejaan, Huruf Kapital & Tanda Baca';
  if (c.includes('imbuhan') || c.includes('awalan') || c.includes('akhiran')) return 'Kata Berimbuhan & Pembentukan Kata';
  if (c.includes('kalimat efektif') || c.includes('struktur kalimat')) return 'Kalimat Efektif & Struktur Bahasa';
  if (c.includes('kosakata') || c.includes('sinonim') || c.includes('antonim')) return 'Kosakata & Makna Kata';
  if (c.includes('wawancara') || c.includes('kalimat tanya')) return 'Wawancara & Kalimat Tanya';

  // IPAS
  if (c.includes('fotosintesis') || c.includes('klorofil')) return 'Fotosintesis Tumbuhan Hijau';
  if (c.includes('bagian tubuh tumbuhan') || c.includes('akar') || c.includes('daun')) return 'Bagian Tubuh Tumbuhan & Fungsinya';
  if (c.includes('pancaindra') || c.includes('indra') || c.includes('tubuh pada manusia')) return 'Pancaindra & Tubuh Manusia';
  if (c.includes('siklus hidup') || c.includes('metamorfosis')) return 'Siklus Hidup & Daur Hewan';
  if (c.includes('rantai makanan') || c.includes('jaring-jaring') || c.includes('ekosistem')) return 'Ekosistem & Rantai Makanan';
  if (c.includes('wujud zat') || c.includes('perubahan wujud') || c.includes('mencair') || c.includes('menguap')) return 'Perubahan Wujud Zat';
  if (c.includes('gaya') || c.includes('gerak benda') || c.includes('gesek') || c.includes('magnet')) return 'Pengaruh Gaya terhadap Gerak Benda';
  if (c.includes('energi') || c.includes('sumber energi') || c.includes('perubahan energi')) return 'Sumber & Transformasi Energi';
  if (c.includes('sumber daya alam') || c.includes('pelestarian') || c.includes('lingkungan')) return 'Pelestarian Sumber Daya Alam';
  if (c.includes('kearifan lokal') || c.includes('budaya daerah') || c.includes('tradisi')) return 'Kearifan Lokal & Budaya Daerah';
  if (c.includes('kenampakan alam') || c.includes('bentang alam') || c.includes('peta')) return 'Bentang Alam & Peta Wilayah';

  // Pendidikan Pancasila / PPKn
  if (c.includes('sila') || c.includes('pancasila')) return 'Nilai-Nilai Pengamalan Sila Pancasila';
  if (c.includes('garuda') || c.includes('bhinneka') || c.includes('lambang negara')) return 'Simbol Negara & Bhinneka Tunggal Ika';
  if (c.includes('hak') && c.includes('kewajiban')) return 'Hak dan Kewajiban Warga Madrasah';
  if (c.includes('aturan') || c.includes('norma') || c.includes('tata tertib')) return 'Norma & Aturan Bersama';
  if (c.includes('musyawarah') || c.includes('mufakat')) return 'Musyawarah untuk Mufakat';
  if (c.includes('gotong royong') || c.includes('kerjasama') || c.includes('tolong menolong')) return 'Gotong Royong & Kerjasama';
  if (c.includes('keberagaman') || c.includes('suku') || c.includes('agama') || c.includes('budaya')) return 'Keberagaman Suku & Budaya Indonesia';

  // Fiqih
  if (c.includes('jamak') || c.includes('qashar') || c.includes('musafir')) return 'Shalat Jamak & Qashar';
  if (c.includes('shalat fardhu') || c.includes('shalat') || c.includes('rukun shalat')) return 'Ketentuan Shalat Fardhu';
  if (c.includes('shalat berjamaah') || c.includes('makmum') || c.includes('imam')) return 'Shalat Berjamaah';
  if (c.includes('wudhu') || c.includes('tayammum') || c.includes('bersuci') || c.includes('thaharah') || c.includes('hadas') || c.includes('najis')) return 'Thaharah, Wudhu & Bersuci';
  if (c.includes('zakat') || c.includes('fitrah') || c.includes('infaq') || c.includes('sedekah')) return 'Zakat Fitrah & Sedekah';
  if (c.includes('puasa') || c.includes('ramadhan')) return 'Ketentuan Puasa Ramadhan';
  if (c.includes('makanan') || c.includes('minuman') || c.includes('halal') || c.includes('haram')) return 'Makanan & Minuman Halal';
  if (c.includes('khitan')) return 'Ketentuan Khitan';

  // Akidah Akhlak
  if (c.includes('asmaul husna') || c.includes('al-malik') || c.includes('al-quddus') || c.includes('as-salam')) return 'Asmaul Husna';
  if (c.includes('kalimat thoyyibah') || c.includes('kalimat thayyibah') || c.includes('tarji') || c.includes('tasbih') || c.includes('tahmid')) return 'Kalimat Thayyibah';
  if (c.includes('rukun iman') || c.includes('iman kepada')) return 'Rukun Iman';
  if (c.includes('jujur') || c.includes('amanah') || c.includes('akhlak terpuji')) return 'Akhlak Terpuji (Jujur & Amanah)';
  if (c.includes('adab bertetangga') || c.includes('adab berteman') || c.includes('adab belajar')) return 'Adab Pergaulan Islami';
  if (c.includes('kufur') || c.includes('munafik') || c.includes('akhlak tercela')) return 'Menghindari Akhlak Tercela';

  // Al-Qur'an Hadis
  if (c.includes('surat') || c.includes('surah') || c.includes('al-ma\'un') || c.includes('at-tin') || c.includes('an-nasr') || c.includes('al-kautsar')) return 'Kandungan Surah Pendek Pilihan';
  if (c.includes('tajwid') || c.includes('hukum bacaan') || c.includes('nun mati') || c.includes('tanwin') || c.includes('idzhar') || c.includes('ikhfa') || c.includes('idgham')) return 'Hukum Tajwid';
  if (c.includes('hadis') || c.includes('hadits')) return 'Kandungan Hadits Pilihan';

  // Sejarah Kebudayaan Islam (SKI)
  if (c.includes('arab jahiliyah') || c.includes('pra-islam')) return 'Kondisi Masyarakat Arab Pra-Islam';
  if (c.includes('kelahiran') || c.includes('kerasulan') || c.includes('dakwah nabi')) return 'Dakwah Nabi Muhammad Saw.';
  if (c.includes('hijrah') || c.includes('yatsrib') || c.includes('piagam madinah')) return 'Peristiwa Hijrah ke Madinah';
  if (c.includes('khulafaur rasyidin') || c.includes('abu bakar') || c.includes('umar') || c.includes('utsman') || c.includes('ali')) return 'Kepemimpinan Khulafaur Rasyidin';

  // Bahasa Arab
  if (c.includes('peralatan') || c.includes('madrasah') || c.includes('kelas')) return 'Al-Adawat Al-Madrasiyyah';
  if (c.includes('jam') || c.includes('waktu') || c.includes('sa\'ah')) return 'As-Sa\'ah (Waktu & Jam)';
  if (c.includes('keluarga') || c.includes('usrah')) return 'Al-Usrah (Keluarga)';
  if (c.includes('profesi') || c.includes('pekerjaan') || c.includes('mihnah')) return 'Al-Mihnah (Profesi)';

  // Fallback to provided materiPokok, elemen, or cleaned phrase
  const cleanFallback = fallbackMateri.trim();
  if (cleanFallback && cleanFallback !== 'Materi Pokok' && !cleanFallback.startsWith('Materi Pokok / Bab')) {
    return cleanFallback;
  }
  const cleanElemen = elemen.trim();
  if (cleanElemen && cleanElemen !== 'Elemen') {
    return cleanElemen;
  }

  // Extract up to 4 words from the beginning
  const words = clause.split(/\s+/).filter(w => w.length > 2);
  if (words.length > 0) {
    const candidate = words.slice(0, 4).join(' ');
    return candidate.charAt(0).toUpperCase() + candidate.slice(1);
  }

  return 'Materi Pokok Pembelajaran';
}

// Universal function to automatically decompose ANY Capaian Pembelajaran (CP) into Tujuan Pembelajaran (TP)
// across ALL subjects (Matematika, Bahasa Indonesia, IPAS, PPKn, Fiqih, Akidah Akhlak, Qurdis, SKI, Bahasa Arab, dll.)
// preserving every single clause/competency without dropping concepts like 'rasio', 'pola bilangan', etc.
export function generateAutoTPFromCP(
  cpText: string, 
  elemen: string = '', 
  materiPokok: string = '', 
  cpIndex: number = 1,
  subjectName: string = ''
): ExamTPItem[] {
  const prefix = `TP ${cpIndex}`;
  const rawText = (cpText || '').trim();

  // If text is empty, provide progressive default TPs
  if (!rawText) {
    const cleanMateri = materiPokok.trim() || elemen || 'Materi Pokok';
    return [
      {
        id: `tp-auto-${cpIndex}-1-${Date.now()}`,
        code: `${prefix}.1`,
        text: `Peserta didik mampu mengidentifikasi, menjelaskan arti, dan memahami konsep dasar ${cleanMateri} secara runtut dan benar.`,
        materiPokok: cleanMateri
      },
      {
        id: `tp-auto-${cpIndex}-2-${Date.now() + 1}`,
        code: `${prefix}.2`,
        text: `Peserta didik mampu menerapkan, mempraktikkan, dan memberikan contoh nyata pengamalan ${cleanMateri} dalam kehidupan sehari-hari di madrasah dan rumah.`,
        materiPokok: cleanMateri
      },
      {
        id: `tp-auto-${cpIndex}-3-${Date.now() + 2}`,
        code: `${prefix}.3`,
        text: `Peserta didik mampu menganalisis permasalahan kontekstual, membedakan perilaku yang tepat, serta merumuskan hikmah penting dari ${cleanMateri}.`,
        materiPokok: cleanMateri
      }
    ];
  }

  // 1. Clean header annotations like "CP :", "Capaian Pembelajaran:", etc.
  let cleaned = rawText
    .replace(/^(?:CP\s*:|Capaian\s+Pembelajaran\s*:|Elemen\s*:[^;.\n]+[;.\n]+)/i, '')
    .trim();

  // 2. Intelligent clause splitting
  // Kurikulum Merdeka CPs standardly separate discrete competencies using:
  // - Semicolons (;)
  // - Periods followed by active verbs / pronouns: . Murid dapat / . Peserta didik dapat / . Mereka dapat
  // - Semicolons or periods followed by line breaks
  // - Long sentences containing distinct clauses joined by ", serta ..." or "; bernalar ..."
  const rawSegments = cleaned
    .split(/;\s*|\.\s+(?=(?:Murid|Peserta\s+didik|Siswa|Pelajar|Mereka)\s+(?:dapat|mampu)|[A-Z0-9]|Men|Mem|Meng|Ber|Ter)|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 5);

  const extractedClauses: string[] = [];

  rawSegments.forEach(segment => {
    // If a segment contains sub-clauses with active operational verbs (e.g. "...; bernalar secara proporsional... serta menggunakan...")
    const subParts = segment.split(/,\s*(?:serta|dan)\s+(?:bernalar|menggunakan|menemukan|mengidentifikasi|meniru|mengembangkan|menganalisis|menjelaskan|menerapkan|mendeskripsikan|mengevaluasi|menyelesaikan)\s+/i);
    if (subParts.length > 1) {
      subParts.forEach((part, pIdx) => {
        let p = part.trim();
        if (pIdx > 0 && !/^(?:bernalar|menggunakan|menemukan|mengidentifikasi|meniru|mengembangkan|menganalisis|menjelaskan|menerapkan|mendeskripsikan|mengevaluasi|menyelesaikan)/i.test(p)) {
          // Re-attach the split verb if needed
          const matchedVerb = segment.match(/,\s*(?:serta|dan)\s+(bernalar|menggunakan|menemukan|mengidentifikasi|meniru|mengembangkan|menganalisis|menjelaskan|menerapkan|mendeskripsikan|mengevaluasi|menyelesaikan)/i);
          if (matchedVerb) {
            p = `${matchedVerb[1]} ${p}`;
          }
        }
        if (p.length > 8) extractedClauses.push(p);
      });
    } else {
      if (segment.length > 8) extractedClauses.push(segment);
    }
  });

  // 3. Build TPs for every extracted clause
  if (extractedClauses.length >= 2) {
    return extractedClauses.map((clause, idx) => {
      // Clean leading boilerplate verbs and subjects
      let cleanClause = clause
        .replace(/^(?:peserta\s+didik|murid|siswa|pelajar|mereka)\s+(?:dapat|mampu)\s+/i, '')
        .replace(/^(?:dapat|mampu)\s+/i, '')
        .trim();

      // Clean leading/trailing punctuation
      cleanClause = cleanClause.replace(/^[;,\.\-\s]+|[;,\.\-\s]+$/g, '');

      // Capitalize first letter
      const capitalizedText = cleanClause.charAt(0).toUpperCase() + cleanClause.slice(1);
      const subMateri = extractSubMateriFromClause(cleanClause, materiPokok, elemen);

      return {
        id: `tp-auto-${cpIndex}-${idx + 1}-${Date.now() + idx}`,
        code: `${prefix}.${idx + 1}`,
        text: capitalizedText.startsWith('Peserta didik') ? `${capitalizedText}.` : `Peserta didik mampu ${cleanClause.charAt(0).toLowerCase() + cleanClause.slice(1)}.`,
        materiPokok: subMateri
      };
    });
  }

  // 4. Fallback if CP is a single broad sentence: decompose into 3 Bloom/KKO cognitive levels (C1/C2, C3, C4/C5)
  const singleTopic = extractSubMateriFromClause(cleaned, materiPokok, elemen);
  return [
    {
      id: `tp-auto-${cpIndex}-1-${Date.now()}`,
      code: `${prefix}.1`,
      text: `Peserta didik mampu mengidentifikasi, menjelaskan konsep dasar, dan memahami materi ${singleTopic} dengan benar.`,
      materiPokok: singleTopic
    },
    {
      id: `tp-auto-${cpIndex}-2-${Date.now() + 1}`,
      code: `${prefix}.2`,
      text: `Peserta didik mampu menerapkan kaidah, prosedur, dan menyelesaikan permasalahan nyata terkait ${singleTopic} dalam kehidupan sehari-hari.`,
      materiPokok: singleTopic
    },
    {
      id: `tp-auto-${cpIndex}-3-${Date.now() + 2}`,
      code: `${prefix}.3`,
      text: `Peserta didik mampu menganalisis permasalahan kontekstual, mengevaluasi solusi, dan menyimpulkan hikmah penting dari ${singleTopic}.`,
      materiPokok: singleTopic
    }
  ];
}

// Helper function to convert class level to standard Roman with Indonesian words (e.g., "Kelas 6" -> "VI (Enam)")
export function formatClassToRomanLabel(classStr?: string): string {
  if (!classStr) return 'IV (Empat)';
  const num = parseInt(classStr.replace(/\D/g, ''), 10);
  switch (num) {
    case 1: return 'I (Satu)';
    case 2: return 'II (Dua)';
    case 3: return 'III (Tiga)';
    case 4: return 'IV (Empat)';
    case 5: return 'V (Lima)';
    case 6: return 'VI (Enam)';
    default: return classStr;
  }
}

// Preset Multi-CP Data for Akidah Akhlak
export const DEFAULT_CP_LIST_AKIDAH: ExamCPItem[] = [
  {
    id: 'cp-akidah-1',
    code: 'CP 1',
    elemen: 'Akidah (Asmaul Husna)',
    capaianPembelajaran: 'Peserta didik mampu memahami dan meyakini sifat-sifat Allah Swt. melalui pengenalan Asmaul Husna (Al-Malik, Al-Quddus, As-Salam), serta mampu mengaitkannya dalam kehidupan sehari-hari.',
    materiPokok: 'Mengenal Asmaul Husna (Al-Malik, Al-Quddus, As-Salam)',
    tpList: [
      {
        id: 'tp-1-1',
        code: 'TP 1.1',
        text: 'Menjelaskan arti dan makna dari Asmaul Husna Al-Malik, Al-Quddus, dan As-Salam.',
        materiPokok: 'Makna Asmaul Husna'
      },
      {
        id: 'tp-1-2',
        code: 'TP 1.2',
        text: 'Memberikan contoh sikap meneladani Asmaul Husna Al-Malik, Al-Quddus, dan As-Salam di lingkungan madrasah.',
        materiPokok: 'Pengamalan Asmaul Husna'
      }
    ]
  },
  {
    id: 'cp-akidah-2',
    code: 'CP 2',
    elemen: 'Akhlak Terpuji (Kalimat Thoyyibah & Kejujuran)',
    capaianPembelajaran: 'Peserta didik mampu membiasakan pengucapan kalimat thoyyibah (Tarji\', Subhanallah, Masya Allah) dan menerapkan akhlak terpuji jujur serta amanah dalam pergaulan sehari-hari.',
    materiPokok: 'Kalimat Thoyyibah & Sifat Jujur-Amanah',
    tpList: [
      {
        id: 'tp-2-1',
        code: 'TP 2.1',
        text: 'Mengidentifikasi situasi yang tepat untuk melafalkan kalimat thoyyibah Tarji\' dan Subhanallah.',
        materiPokok: 'Kalimat Thoyyibah'
      },
      {
        id: 'tp-2-2',
        code: 'TP 2.2',
        text: 'Menganalisis dampak positif dan hikmah dari perilaku jujur dan amanah dalam kehidupan bermasyarakat.',
        materiPokok: 'Kejujuran & Amanah'
      }
    ]
  },
  {
    id: 'cp-akidah-3',
    code: 'CP 3',
    elemen: 'Adab Islami (Adab Bertamu & Bertetangga)',
    capaianPembelajaran: 'Peserta didik mampu menerapkan adab bertamu dan menghormati tetangga sesuai dengan tuntunan syariat Islam serta menumbuhkan sikap toleransi.',
    materiPokok: 'Adab Bertamu & Menghormati Tetangga',
    tpList: [
      {
        id: 'tp-3-1',
        code: 'TP 3.1',
        text: 'Menjelaskan tata krama dan adab bertamu menurut ajaran Rasulullah Saw.',
        materiPokok: 'Adab Bertamu'
      },
      {
        id: 'tp-3-2',
        code: 'TP 3.2',
        text: 'Menentukan tindakan adab bertetangga yang berakhlak mulia dalam berbagai situasi sosial.',
        materiPokok: 'Adab Bertetangga'
      }
    ]
  }
];

// Preset Multi-CP Map for Popular Subjects
export const SUBJECT_MULTI_CP_PRESETS: Record<string, ExamCPItem[]> = {
  'Akidah Akhlak': DEFAULT_CP_LIST_AKIDAH,
  'Fiqih': [
    {
      id: 'cp-fiqih-1',
      code: 'CP 1',
      elemen: 'Fikih Ibadah (Shalat & Wudhu)',
      capaianPembelajaran: 'Peserta didik mampu memahami rukun, syarat sah, dan hal-hal yang membatalkan shalat fardhu dan wudhu serta mempraktikkannya dengan tertib.',
      materiPokok: 'Ketentuan Shalat Fardhu & Bersuci',
      tpList: [
        { id: 'tp-fiq-1', code: 'TP 1.1', text: 'Menyebutkan rukun dan syarat sah shalat fardhu.', materiPokok: 'Shalat Fardhu' },
        { id: 'tp-fiq-2', code: 'TP 1.2', text: 'Membedakan hal yang membatalkan wudhu dan shalat.', materiPokok: 'Tata Cara Bersuci' }
      ]
    },
    {
      id: 'cp-fiqih-2',
      code: 'CP 2',
      elemen: 'Fikih Muamalah (Makanan & Minuman Halal)',
      capaianPembelajaran: 'Peserta didik mampu mengidentifikasi ketentuan makanan dan minuman yang halal dan thayyib serta menghindari yang haram.',
      materiPokok: 'Makanan & Minuman Halal',
      tpList: [
        { id: 'tp-fiq-3', code: 'TP 2.1', text: 'Mengklasifikasikan jenis makanan halal dan haram menurut Al-Qur\'an.', materiPokok: 'Makanan Halal' },
        { id: 'tp-fiq-4', code: 'TP 2.2', text: 'Menganalisis manfaat mengonsumsi makanan halal bagi kesehatan jasmani dan rohani.', materiPokok: 'Hikmah Halal' }
      ]
    }
  ],
  'Bahasa Indonesia': [
    {
      id: 'cp-bind-1',
      code: 'CP 1',
      elemen: 'Membaca & Memirsa',
      capaianPembelajaran: 'Peserta didik mampu memahami pesan dan informasi tentang kehidupan sehari-hari, teks narasi, dan puisi anak dalam bentuk cetak atau elektronik.',
      materiPokok: 'Memahami Teks Cerita & Ide Pokok',
      tpList: [
        { id: 'tp-bi-1', code: 'TP 1.1', text: 'Menemukan informasi tersurat dan tersirat dalam teks narasi cerita.', materiPokok: 'Informasi Teks' },
        { id: 'tp-bi-2', code: 'TP 1.2', text: 'Menentukan ide pokok dan kalimat utama dalam setiap paragraf.', materiPokok: 'Ide Pokok' }
      ]
    },
    {
      id: 'cp-bind-2',
      code: 'CP 2',
      elemen: 'Menulis & Tata Bahasa',
      capaianPembelajaran: 'Peserta didik mampu menulis berbagai teks sederhana dengan menggunakan kosakata baru dan kaidah kebahasaan ejaan (EYD) yang benar.',
      materiPokok: 'Penggunaan Tanda Baca & Imbuhan',
      tpList: [
        { id: 'tp-bi-3', code: 'TP 2.1', text: 'Menerapkan penggunaan huruf kapital dan tanda baca secara tepat.', materiPokok: 'Kaidah Ejaan' },
        { id: 'tp-bi-4', code: 'TP 2.2', text: 'Menyusun kalimat efektif menggunakan kata berimbuhan me- dan di-.', materiPokok: 'Imbuhan Kata' }
      ]
    }
  ],
  'Matematika': [
    {
      id: 'cp-mtk-1',
      code: 'CP 1',
      elemen: 'Bilangan & Operasi Hitung',
      capaianPembelajaran: 'Peserta didik mampu menunjukkan pemahaman dan intuisi bilangan (number sense) pada bilangan cacah sampai 10.000, serta melakukan operasi penjumlahan dan pengurangan.',
      materiPokok: 'Bilangan Cacah & Operasi Hitung',
      tpList: [
        { id: 'tp-mtk-1', code: 'TP 1.1', text: 'Membaca, menulis, dan menentukan nilai tempat bilangan cacah sampai 10.000.', materiPokok: 'Nilai Tempat' },
        { id: 'tp-mtk-2', code: 'TP 1.2', text: 'Menyelesaikan operasi hitung penjumlahan dan pengurangan dalam soal cerita.', materiPokok: 'Operasi Penjumlahan & Pengurangan' }
      ]
    },
    {
      id: 'cp-mtk-2',
      code: 'CP 2',
      elemen: 'Aljabar & Rasio Proporsi (Fase C)',
      capaianPembelajaran: 'Menemukan nilai yang belum diketahui dalam kalimat matematika bilangan cacah sampai 1000, mengidentifikasi pola bilangan membesar dan mengecil, bernalar secara proporsional dengan rasio satuan, serta menyelesaikan masalah sehari-hari terkait proporsi.',
      materiPokok: 'Rasio Satuan & Proporsi',
      tpList: [
        { id: 'tp-mtk-alj-1', code: 'TP 2.1', text: 'Menemukan nilai yang belum diketahui dalam kalimat matematika bilangan cacah sampai 1000.', materiPokok: 'Kalimat Matematika' },
        { id: 'tp-mtk-alj-2', code: 'TP 2.2', text: 'Mengidentifikasi, meniru, dan mengembangkan pola bilangan membesar dan mengecil yang melibatkan perkalian dan pembagian.', materiPokok: 'Pola Bilangan' },
        { id: 'tp-mtk-alj-3', code: 'TP 2.3', text: 'Bernalar secara proporsional untuk menyelesaikan masalah kontekstual sehari-hari dengan rasio satuan (unit rate).', materiPokok: 'Rasio Satuan' },
        { id: 'tp-mtk-alj-4', code: 'TP 2.4', text: 'Menggunakan operasi perkalian dan pembagian dalam menyelesaikan masalah perbandingan senilai (proporsi).', materiPokok: 'Proporsi' }
      ]
    },
    {
      id: 'cp-mtk-3',
      code: 'CP 3',
      elemen: 'Pengukuran & Geometri',
      capaianPembelajaran: 'Peserta didik mampu mengukur panjang dan luas menggunakan satuan baku serta mendeskripsikan ciri berbagai bentuk bangun datar segiempat dan segitiga.',
      materiPokok: 'Keliling & Luas Bangun Datar',
      tpList: [
        { id: 'tp-mtk-3', code: 'TP 3.1', text: 'Menghitung keliling dan luas persegi dan persegi panjang.', materiPokok: 'Keliling & Luas' },
        { id: 'tp-mtk-4', code: 'TP 3.2', text: 'Mengidentifikasi sifat-sifat bangun datar segiempat dan segitiga.', materiPokok: 'Sifat Bangun Datar' }
      ]
    }
  ],
  'IPAS': [
    {
      id: 'cp-ipas-1',
      code: 'CP 1',
      elemen: 'Pemahaman IPAS (Sains Lingkungan)',
      capaianPembelajaran: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada hewan dan tumbuhan serta proses fotosintesis.',
      materiPokok: 'Bagian Tubuh Tumbuhan & Fotosintesis',
      tpList: [
        { id: 'tp-ipas-1', code: 'TP 1.1', text: 'Mengidentifikasi fungsi akar, batang, daun, dan bunga pada tumbuhan.', materiPokok: 'Bagian Tumbuhan' },
        { id: 'tp-ipas-2', code: 'TP 1.2', text: 'Menjelaskan proses fotosintesis dan zat-zat yang dibutuhkan tumbuhan.', materiPokok: 'Fotosintesis' }
      ]
    },
    {
      id: 'cp-ipas-2',
      code: 'CP 2',
      elemen: 'Pemahaman IPAS (Sosial Budaya)',
      capaianPembelajaran: 'Peserta didik mendeskripsikan keragaman kearifan lokal daerah tempat tinggal serta cara pelestariannya.',
      materiPokok: 'Kearifan Lokal & Budaya Daerah',
      tpList: [
        { id: 'tp-ipas-3', code: 'TP 2.1', text: 'Menyebutkan contoh tradisi kearifan lokal di wilayah Jawa Barat / lingkungan sekitar.', materiPokok: 'Tradisi Lokal' },
        { id: 'tp-ipas-4', code: 'TP 2.2', text: 'Menganalisis cara menjaga kelestarian warisan budaya daerah.', materiPokok: 'Pelestarian Budaya' }
      ]
    }
  ],
  'Al-Qur\'an Hadis': [
    {
      id: 'cp-qur-1',
      code: 'CP 1',
      elemen: 'Al-Qur\'an (Surat Pendek Pilihan)',
      capaianPembelajaran: 'Peserta didik mampu melafalkan, menghafal, dan memahami pesan pokok surat-surat pendek pilihan (QS. Al-Ma\'un dan At-Tin) dengan tartil.',
      materiPokok: 'QS. Al-Ma\'un & At-Tin',
      tpList: [
        { id: 'tp-qur-1', code: 'TP 1.1', text: 'Menjelaskan arti dan isi pokok QS. Al-Ma\'un tentang kepedulian terhadap anak yatim.', materiPokok: 'QS. Al-Ma\'un' },
        { id: 'tp-qur-2', code: 'TP 1.2', text: 'Menganalisis kemuliaan penciptaan manusia dalam QS. At-Tin.', materiPokok: 'QS. At-Tin' }
      ]
    },
    {
      id: 'cp-qur-2',
      code: 'CP 2',
      elemen: 'Hadits (Menuntut Ilmu & Kebersihan)',
      capaianPembelajaran: 'Peserta didik mampu menghafal dan mengamalkan pesan hadits tentang menuntut ilmu, menyayangi anak yatim, dan kebersihan.',
      materiPokok: 'Hadits Pilihan Nabi Saw.',
      tpList: [
        { id: 'tp-qur-3', code: 'TP 2.1', text: 'Menerapkan pesan hadits tentang kewajiban menuntut ilmu dan kebersihan madrasah.', materiPokok: 'Hadits Menuntut Ilmu' },
        { id: 'tp-qur-4', code: 'TP 2.2', text: 'Menunjukkan sikap menyayangi dan menyantuni anak yatim.', materiPokok: 'Hadits Menyayangi Anak Yatim' }
      ]
    }
  ],
  'Bahasa Arab': [
    {
      id: 'cp-arb-1',
      code: 'CP 1',
      elemen: 'Menyimak & Berbicara (Hiwar Perkenalan & Keluarga)',
      capaianPembelajaran: 'Peserta didik mampu merespons dialog sederhana (Hiwar) tentang perkenalan diri (At-Ta\'aruf) dan anggota keluarga dengan makhraj yang benar.',
      materiPokok: 'At-Ta\'aruf & Al-Usrah (Keluarga)',
      tpList: [
        { id: 'tp-arb-1', code: 'TP 1.1', text: 'Merespons hiwar sapaan dan menanyakan identitas nama dalam bahasa Arab.', materiPokok: 'At-Ta\'aruf' },
        { id: 'tp-arb-2', code: 'TP 1.2', text: 'Menyebutkan anggota keluarga menggunakan isim isyarah (hadza / hadzihi).', materiPokok: 'Al-Usrah' }
      ]
    },
    {
      id: 'cp-arb-2',
      code: 'CP 2',
      elemen: 'Membaca & Menulis (Peralatan Belajar di Madrasah)',
      capaianPembelajaran: 'Peserta didik mampu membaca dan menulis kosakata (mufrodat) tentang peralatan madrasah dan kata sifat sederhana.',
      materiPokok: 'Al-Adawatul Madrasah (Peralatan Madrasah)',
      tpList: [
        { id: 'tp-arb-3', code: 'TP 2.1', text: 'Membaca mufrodat peralatan madrasah dengan intonasi dan harakat tepat.', materiPokok: 'Peralatan Madrasah' },
        { id: 'tp-arb-4', code: 'TP 2.2', text: 'Menyusun frasa isim isyarah dan kata sifat berharakat lengkap.', materiPokok: 'Frasa Arab Sederhana' }
      ]
    }
  ],
  'Sejarah Kebudayaan Islam': [
    {
      id: 'cp-ski-1',
      code: 'CP 1',
      elemen: 'Periode Kenabian (Hijrah ke Madinah)',
      capaianPembelajaran: 'Peserta didik mampu memahami sebab-sebab dan peristiwa penting hijrah Nabi Muhammad Saw. ke Yatsrib/Madinah serta pembentukan Piagam Madinah.',
      materiPokok: 'Peristiwa Hijrah Nabi Muhammad Saw. ke Madinah',
      tpList: [
        { id: 'tp-ski-1', code: 'TP 1.1', text: 'Menceritakan latar belakang dan ketabahan kaum muslimin saat peristiwa hijrah.', materiPokok: 'Sebab Hijrah' },
        { id: 'tp-ski-2', code: 'TP 1.2', text: 'Menjelaskan keteladanan persaudaraan kaum Muhajirin dan kaum Anshar.', materiPokok: 'Muhajirin & Anshar' }
      ]
    },
    {
      id: 'cp-ski-2',
      code: 'CP 2',
      elemen: 'Khulafaur Rasyidin (Abu Bakar & Umar)',
      capaianPembelajaran: 'Peserta didik mampu meneladani kepemimpinan dan kedermawanan para sahabat Khulafaur Rasyidin.',
      materiPokok: 'Keteladanan Sahabat Khulafaur Rasyidin',
      tpList: [
        { id: 'tp-ski-3', code: 'TP 2.1', text: 'Meneladani sifat jujur dan setia Abu Bakar Ash-Shiddiq r.a.', materiPokok: 'Abu Bakar Ash-Shiddiq' },
        { id: 'tp-ski-4', code: 'TP 2.2', text: 'Menganalisis ketegasan dan keadilan Umar bin Khattab r.a.', materiPokok: 'Umar bin Khattab' }
      ]
    }
  ]
};

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  judulAsesmen: 'PENILAIAN AKHIR SEMESTER (PAS)',
  mataPelajaran: 'Akidah Akhlak',
  tingkatKelas: 'Kelas 4',
  fase: 'Fase B',
  semester: 1,
  alokasiWaktu: '07.30 – 09.00',
  tahunPelajaran: '2024-2025',
  namaYayasan: 'YAYASAN PERGURUAN MUSLIMIN (YPM)',
  namaMadrasah: 'MADRASAH IBTIDAIYAH CIBUNGUR I',
  hariTanggal: '',
  waktuPelaksanaan: '07.30 – 09.00',
  customClassLabel: '',
  cpList: DEFAULT_CP_LIST_AKIDAH,
  jumlahPg: 10,
  bobotPg: 3,
  opsiPgCount: 4,
  jumlahPgKompleks: 5,
  bobotPgKompleks: 4,
  jumlahIsian: 5,
  bobotIsian: 6,
  jumlahEsai: 2,
  bobotEsai: 10,
  ensureAllStimulus: true, // Pastikan 100% semua butir soal mengandung stimulus kontekstual
  enableKbcPillars: true, // Integrasi Otomatis 5 Pilar Kurikulum Berbasis Cinta (KBC Kemenag)
  modeStimulus: 'grup',
  grupQuestionCount: 4,
  stimulusType: 'cerita',
  stimulusTitle: 'Kisah Teladan Kejujuran & Pengamalan Asmaul Husna',
  stimulusText: 'Di sebuah desa di lereng pegunungan, Ahmad adalah seorang siswa madrasah yang selalu bangun pagi untuk shalat subuh berjamaah di masjid. Suatu hari saat berjalan menuju madrasah, ia melihat sebuah dompet cokelat terjatuh di pinggir jalan. Ketika dibuka, dompet itu berisi uang tabungan pedagang pasar dan kartu identitas seorang kakek tua penjual sayur.\n\nTeman Ahmad sempat membisikkan agar uang itu dibagi dua untuk membeli jajanan dan mainan. Namun, Ahmad teringat pelajaran Akidah Akhlak bahwa Allah Maha Melihat (Al-Bashir) dan Maha Suci dari segala kekurangan (Al-Quddus). Ahmad meyakini rezeki yang berkah hanya diperoleh dengan cara yang halal dan diridhai Allah Swt. Tanpa ragu, Ahmad mengembalikan dompet itu ke alamat sang kakek. Sang kakek sangat terharu dan mendoakan kebaikan serta keberkahan bagi Ahmad.',
  stimulusTable: 'No | Hari/Tanggal | Kegiatan Pembiasaan | Pelaksana | Nilai Karakter\n1 | Senin, 20 Okt | Mengembalikan dompet temuan | Ahmad (Kelas 4) | Kejujuran & Amanah\n2 | Rabu, 22 Okt | Menolong teman terjatuh | Fatimah (Kelas 4) | Peduli & Kasih Sayang\n3 | Jumat, 24 Okt | Berbagi bekal makanan | Ridwan (Kelas 4) | Dermawan & Ikhlas',
  stimulusImageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
};

// Preset sample questions for various subjects to jumpstart generation
export const SAMPLE_QUESTIONS_AKIDAH: QuestionItem[] = [
  {
    id: 'soal-1',
    number: 1,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan teks cerita Ahmad untuk menjawab soal nomor 1 sampai 3!',
    stimulusText: 'Ahmad menemukan dompet berisi uang di jalan menuju madrasah. Temannya menyarankan membaginya, namun Ahmad menolak karena meyakini Allah Maha Melihat (Al-Bashir) dan mengembalikannya ke pemiliknya.',
    questionText: 'Sifat terpuji yang ditunjukkan Ahmad saat menolak tawaran temannya untuk mengambil uang temuan adalah ...',
    options: [
      { label: 'A', text: 'Tawadhu dan hemat' },
      { label: 'B', text: 'Jujur dan amanah' },
      { label: 'C', text: 'Sabar dan tabah' },
      { label: 'D', text: 'Percaya diri dan berani' },
    ],
    correctAnswer: 'B',
    score: 4,
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan narasi cerita perilaku anak, peserta didik dapat mengidentifikasi perilaku terpuji amanah dan jujur.',
    ipk: 'Mengidentifikasi perilaku terpuji jujur dan amanah dalam kehidupan sehari-hari.',
    classLevel: 'Kelas 4',
    materiPokok: 'Akhlak Terpuji (Amanah & Jujur)',
    capaianPembelajaran: 'Peserta didik mampu membiasakan pengucapan kalimat thoyyibah dan menerapkan akhlak terpuji jujur serta amanah.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak positif dan hikmah dari perilaku jujur dan amanah.',
    rubrikPenilaian: 'Pilihan B bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-2',
    number: 2,
    type: 'pg',
    stimulusType: 'cerita',
    questionText: 'Keyakinan Ahmad bahwa perbuatannya selalu disaksikan oleh Allah Swt. merupakan wujud keimanan terhadap Asmaul Husna ...',
    options: [
      { label: 'A', text: 'Al-Bashir (Maha Melihat)' },
      { label: 'B', text: 'As-Salam (Maha Memberi Keselamatan)' },
      { label: 'C', text: 'Al-Malik (Maha Merajai)' },
      { label: 'D', text: 'Al-Khaliq (Maha Pencipta)' },
    ],
    correctAnswer: 'A',
    score: 4,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan kutipan pengamalan, peserta didik dapat mengaitkan pengamalan dengan arti Asmaul Husna yang tepat.',
    ipk: 'Menjelaskan makna Asmaul Husna Al-Bashir beserta contoh pengamalannya.',
    classLevel: 'Kelas 4',
    materiPokok: 'Asmaul Husna',
    capaianPembelajaran: 'Peserta didik mampu memahami dan meyakini sifat-sifat Allah Swt. melalui pengenalan Asmaul Husna.',
    cpId: 'cp-akidah-1',
    cpCode: 'CP 1',
    tpCode: 'TP 1.1',
    tujuanPembelajaran: 'Menjelaskan arti dan makna dari Asmaul Husna.',
    rubrikPenilaian: 'Pilihan A bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-3',
    number: 3,
    type: 'pg',
    stimulusType: 'cerita',
    questionText: 'Dampak positif yang dirasakan Ahmad setelah mengembalikan dompet kepada kakek penjual sayur adalah ...',
    options: [
      { label: 'A', text: 'Mendapat imbalan uang dalam jumlah yang sangat banyak' },
      { label: 'B', text: 'Menjadi terkenal dan dipuji di media sosial' },
      { label: 'C', text: 'Memperoleh doa kebaikan, ketenangan hati, dan keridhaan Allah Swt.' },
      { label: 'D', text: 'Dibebaskan dari kewajiban belajar di madrasah' },
    ],
    correctAnswer: 'C',
    score: 4,
    cognitiveLevel: 'L3',
    indikatorSoal: 'Peserta didik dapat menganalisis hikmah dan dampak positif dari pengamalan kejujuran.',
    ipk: 'Menganalisis hikmah dan manfaat perilaku jujur dalam pergaulan sosial.',
    classLevel: 'Kelas 4',
    materiPokok: 'Hikmah Perilaku Terpuji',
    capaianPembelajaran: 'Peserta didik mampu membiasakan pengucapan kalimat thoyyibah dan menerapkan akhlak terpuji.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak positif dan hikmah dari perilaku jujur.',
    rubrikPenilaian: 'Pilihan C bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-4',
    number: 4,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan lafaz kalimat thoyyibah berharakat berikut!',
    arabicText: 'سُبْحَانَ اللَّهِ ۝ مَا شَاءَ اللَّهُ',
    arabicTranslation: 'Maha Suci Allah (Tasbih) - Sungguh atas kehendak Allah (Masya Allah).',
    questionText: 'Ketika seorang muslim mendengar kabar gembira, melihat keindahan alam ciptaan Allah Swt., atau merasakan kekaguman, kalimat thoyyibah yang sebaiknya diucapkan adalah ...',
    options: [
      { label: 'A', text: 'Innalillahi wa inna ilaihi raji\'un' },
      { label: 'B', text: 'Subhanallah dan Masya Allah' },
      { label: 'C', text: 'Astaghfirullahal \'adzim' },
      { label: 'D', text: 'Na\'udzubillahi min dzalik' },
    ],
    correctAnswer: 'B',
    score: 4,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Peserta didik dapat menentukan kalimat thoyyibah yang sesuai dengan situasi yang dialami.',
    ipk: 'Mengidentifikasi situasi dan waktu pengucapan kalimat thoyyibah yang tepat.',
    classLevel: 'Kelas 4',
    materiPokok: 'Kalimat Thoyyibah',
    capaianPembelajaran: 'Peserta didik mampu membiasakan pengucapan kalimat thoyyibah.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.1',
    tujuanPembelajaran: 'Mengidentifikasi situasi yang tepat untuk melafalkan kalimat thoyyibah.',
    rubrikPenilaian: 'Pilihan B bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-5',
    number: 5,
    type: 'pg',
    stimulusType: 'tabel',
    stimulusTitle: 'Perhatikan tabel kegiatan pembiasaan akhlak berikut!',
    stimulusTable: 'No | Siswa | Perilaku yang Ditampilkan | Sifat Akhlak\n1 | Ridwan | Selalu berkata benar meski terasa berat | Jujur\n2 | Siti | Menjaga barang titipan teman dengan baik | Amanah\n3 | Hasan | Membantu membersihkan mushola tanpa pamrih | Ikhlas',
    questionText: 'Berdasarkan tabel di atas, pasangan yang tepat antara nama siswa, perilaku, dan nilai karakter adalah ...',
    options: [
      { label: 'A', text: 'Nomor 1 saja yang benar' },
      { label: 'B', text: 'Nomor 1, 2, dan 3 semuanya benar' },
      { label: 'C', text: 'Nomor 2 dan 3 saja yang benar' },
      { label: 'D', text: 'Semua pasangan salah' },
    ],
    correctAnswer: 'B',
    score: 4,
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan tabel pasangan perilaku dan nilai karakter, peserta didik dapat memvalidasi kebenaran seluruh pasangan.',
    ipk: 'Mengklasifikasikan pasangan perilaku dan nilai karakter akhlak terpuji.',
    classLevel: 'Kelas 4',
    materiPokok: 'Akhlak Terpuji',
    capaianPembelajaran: 'Peserta didik mengevaluasi ragam akhlak terpuji dalam kehidupan sosial.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak perilaku terpuji.',
    rubrikPenilaian: 'Pilihan B bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-6',
    number: 6,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan lafaz Asmaul Husna dalam tulisan Arab berikut!',
    arabicText: 'السَّلَامُ',
    arabicTranslation: 'As-Salam (Dzat Yang Maha Memberi Keselamatan dan Kesejahteraan).',
    questionText: 'Arti dan pemaknaan dari Asmaul Husna "As-Salam" yang tepat adalah bahwa Allah Swt. ...',
    options: [
      { label: 'A', text: 'Maha Merajai seluruh alam semesta' },
      { label: 'B', text: 'Maha Memberi Kesejahteraan, Kedamaian, dan Keselamatan' },
      { label: 'C', text: 'Maha Mengetahui segala sesuatu yang tersembunyi' },
      { label: 'D', text: 'Maha Pengampun segala dosa hamba-Nya' },
    ],
    correctAnswer: 'B',
    score: 4,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan lafaz Arab As-Salam, peserta didik dapat mengidentifikasi artinya.',
    ipk: 'Menyebutkan arti dan makna Asmaul Husna As-Salam.',
    classLevel: 'Kelas 4',
    materiPokok: 'Asmaul Husna (As-Salam)',
    capaianPembelajaran: 'Peserta didik memahami arti dan makna Asmaul Husna.',
    cpId: 'cp-akidah-1',
    cpCode: 'CP 1',
    tpCode: 'TP 1.1',
    tujuanPembelajaran: 'Menjelaskan arti dan makna dari Asmaul Husna.',
    rubrikPenilaian: 'Pilihan B bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-7',
    number: 7,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan hadits adab bertamu riwayat Abu Dawud berikut!',
    arabicText: 'إِذَا اسْتَأْذَنَ أَحَدُكُمْ ثَلَاثًا فَلَمْ يُؤْذَنْ لَهُ فَلْيَرْجِعْ',
    arabicTranslation: 'Jika salah seorang di antara kalian telah meminta izin (mengetuk/mengucap salam) sebanyak tiga kali lalu tidak diberi izin, maka hendaklah dia kembali pulang.',
    questionText: 'Berdasarkan hadits nabi di atas, tata krama bertamu yang benar menurut syariat Islam ketika bertamu ke rumah tetangga adalah ...',
    options: [
      { label: 'A', text: 'Mengetuk pintu keras-keras tanpa henti hingga pemilik rumah terbangun' },
      { label: 'B', text: 'Mengintip ke dalam celah jendela rumah tetangga' },
      { label: 'C', text: 'Mengucapkan salam dan mengetuk pintu maksimal 3 kali dengan sopan' },
      { label: 'D', text: 'Langsung membuka pintu dan masuk ke ruang keluarga' },
    ],
    correctAnswer: 'C',
    score: 4,
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan hadits adab bertamu, peserta didik dapat menentukan adab bertamu yang benar sesuai syariat.',
    ipk: 'Menjelaskan adab bertamu dan tata krama bertetangga menurut syariat Islam.',
    classLevel: 'Kelas 4',
    materiPokok: 'Adab Bertamu',
    capaianPembelajaran: 'Peserta didik mampu menerapkan adab bertamu dan menghormati tetangga.',
    cpId: 'cp-akidah-3',
    cpCode: 'CP 3',
    tpCode: 'TP 3.1',
    tujuanPembelajaran: 'Menjelaskan tata krama dan adab bertamu.',
    rubrikPenilaian: 'Pilihan C bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-8',
    number: 8,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan lafaz Asmaul Husna berharakat berikut!',
    arabicText: 'الْقُدُّوسُ',
    arabicTranslation: 'Al-Quddus (Dzat Yang Maha Suci dari Segala Cacat dan Cela).',
    questionText: 'Meyakini bahwa Allah Swt. bersih dari sifat lupa, tidur, letih, dan segala kekurangan merupakan wujud keimanan terhadap Asmaul Husna ...',
    options: [
      { label: 'A', text: 'Al-Quddus (Maha Suci)' },
      { label: 'B', text: 'Al-Ghaffar (Maha Pengampun)' },
      { label: 'C', text: 'Ar-Rahman (Maha Pengasih)' },
      { label: 'D', text: 'Al-Hakim (Maha Bijaksana)' },
    ],
    correctAnswer: 'A',
    score: 4,
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan lafaz Al-Quddus, peserta didik dapat mengidentifikasi sifat Maha Suci Allah.',
    ipk: 'Menjelaskan makna kesucian Allah Swt. melalui Asmaul Husna Al-Quddus.',
    classLevel: 'Kelas 4',
    materiPokok: 'Asmaul Husna (Al-Quddus)',
    capaianPembelajaran: 'Peserta didik memahami kesucian Allah Swt.',
    cpId: 'cp-akidah-1',
    cpCode: 'CP 1',
    tpCode: 'TP 1.1',
    tujuanPembelajaran: 'Menjelaskan arti dan makna dari Asmaul Husna.',
    rubrikPenilaian: 'Pilihan A bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-9',
    number: 9,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan narasi kerukunan bertetangga berikut!',
    stimulusText: 'Di sekitar lingkungan madrasah, masyarakat hidup rukun berdampingan. Pak RT selalu mengingatkan warga untuk saling tolong-menolong tanpa membeda-bedakan suku dan latar belakang keyakinan.',
    questionText: 'Contoh sikap menghormati tetangga yang berakhlak mulia sesuai narasi di atas adalah ...',
    options: [
      { label: 'A', text: 'Mengabaikan tetangga yang sedang tertimpa kesusahan' },
      { label: 'B', text: 'Tetap saling bertegur sapa dengan ramah dan menjaga ketenangan lingkungan' },
      { label: 'C', text: 'Memusuhi dan enggan berbagi rezeki dengan tetangga sekitar' },
      { label: 'D', text: 'Memaksakan kehendak pribadi kepada orang lain' },
    ],
    correctAnswer: 'B',
    score: 4,
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan narasi kerukunan, peserta didik dapat menunjukkan contoh toleransi bertetangga.',
    ipk: 'Menentukan tindakan toleransi dan adab bergaul dengan tetangga.',
    classLevel: 'Kelas 4',
    materiPokok: 'Toleransi & Akhlak Bertetangga',
    capaianPembelajaran: 'Peserta didik mampu menerapkan adab bertamu dan menghormati tetangga.',
    cpId: 'cp-akidah-3',
    cpCode: 'CP 3',
    tpCode: 'TP 3.2',
    tujuanPembelajaran: 'Menentukan tindakan adab bertetangga yang berakhlak mulia.',
    rubrikPenilaian: 'Pilihan B bernilai 4 poin, pilihan lain 0 poin.'
  },
  {
    id: 'soal-10',
    number: 10,
    type: 'pg',
    stimulusType: 'cerita',
    stimulusTitle: 'Simak percakapan singkat berikut!',
    stimulusText: 'Zaid berjanji kepada teman sekelasnya untuk belajar kelompok hari Sabtu pukul 08.00 pagi. Namun pada hari Sabtu pagi, Zaid bangun kesiangan dan lebih memilih bermain game di rumah tanpa memberi kabar.',
    questionText: 'Sikap Zaid dalam peristiwa di atas menunjukkan ciri perbuatan ...',
    options: [
      { label: 'A', text: 'Sidiq (jujur)' },
      { label: 'B', text: 'Ingkar janji (salah satu ciri munafik)' },
      { label: 'C', text: 'Istiqomah' },
      { label: 'D', text: 'Fathonah' },
    ],
    correctAnswer: 'B',
    score: 4,
    cognitiveLevel: 'L3',
    indikatorSoal: 'Disajikan studi kasus pengingkaran janji, peserta didik dapat mengevaluasi bahaya ingkar janji.',
    ipk: 'Mengevaluasi dampak negatif perbuatan ingkar janji.',
    classLevel: 'Kelas 4',
    materiPokok: 'Menepati Janji',
    capaianPembelajaran: 'Peserta didik mampu membiasakan pengucapan kalimat thoyyibah dan menerapkan akhlak terpuji.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak perilaku.',
    rubrikPenilaian: 'Pilihan B bernilai 4 poin, pilihan lain 0 poin.'
  },

  // ISIAN SINGKAT (DILENGKAPI STIMULUS LENGKAP)
  {
    id: 'soal-11',
    number: 11,
    type: 'isian',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kalimat tarji\' berharakat Arab berikut!',
    arabicText: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    arabicTranslation: 'Sesungguhnya kami adalah milik Allah dan kepada-Nyalah kami kembali.',
    questionText: 'Lafal kalimat thoyyibah di atas dinamakan kalimat Tarji\' (Istirja\') yang diucapkan seorang muslim saat mendengar kabar ...',
    correctAnswer: 'Musibah / Kematian / Duka cita',
    score: 6,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan lafal tarji berharakat, peserta didik dapat mengaitkan dengan situasi duka cita/musibah.',
    ipk: 'Mengidentifikasi situasi pengucapan kalimat thoyyibah Tarji\'.',
    classLevel: 'Kelas 4',
    materiPokok: 'Kalimat Thoyyibah',
    capaianPembelajaran: 'Peserta didik membiasakan pengucapan kalimat thoyyibah.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.1',
    tujuanPembelajaran: 'Mengidentifikasi situasi yang tepat untuk melafalkan kalimat thoyyibah.',
    rubrikPenilaian: 'Skor 6 untuk kata kunci musibah/kematian/duka.'
  },
  {
    id: 'soal-12',
    number: 12,
    type: 'isian',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kisah singkat sahabat nabi berikut!',
    stimulusText: 'Abu Ubaidah bin al-Jarrah dikenal oleh para sahabat sebagai orang yang sangat terpercaya dalam menjaga perbendaharaan dan titipan umat tanpa pernah berkhianat sedikit pun.',
    questionText: 'Karakter seseorang yang senantiasa menjaga kepercayaan dan menunaikan kewajiban tanpa curang dinamakan sifat ...',
    correctAnswer: 'Amanah / Terpercaya',
    score: 6,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan kisah teladan penjaga titipan, peserta didik dapat menyebutkan istilah karakter amanah.',
    ipk: 'Menyebutkan istilah karakter orang yang dapat dipercaya (amanah).',
    classLevel: 'Kelas 4',
    materiPokok: 'Sifat Amanah',
    capaianPembelajaran: 'Peserta didik membiasakan akhlak terpuji amanah.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak perilaku jujur dan amanah.',
    rubrikPenilaian: 'Skor 6 untuk jawaban Amanah / Terpercaya.'
  },
  {
    id: 'soal-13',
    number: 13,
    type: 'isian',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan potongan ayat QS. Thaha ayat 114 berikut!',
    arabicText: 'فَتَعَالَى اللَّهُ الْمَلِكُ الْحَقُّ',
    arabicTranslation: 'Maka Maha Tinggi Allah, Raja yang Sebenarnya.',
    questionText: 'Berdasarkan ayat Al-Qur\'an di atas, Asmaul Husna "Al-Malik" bermakna bahwa Allah Swt. adalah Dzat Yang Maha ...',
    correctAnswer: 'Merajai / Menguasai seluruh alam semesta',
    score: 6,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan ayat potongan QS. Thaha, peserta didik dapat mengartikan Asmaul Husna Al-Malik.',
    ipk: 'Menjelaskan arti dan kedudukan Asmaul Husna Al-Malik.',
    classLevel: 'Kelas 4',
    materiPokok: 'Asmaul Husna Al-Malik',
    capaianPembelajaran: 'Peserta didik memahami makna Asmaul Husna Al-Malik.',
    cpId: 'cp-akidah-1',
    cpCode: 'CP 1',
    tpCode: 'TP 1.1',
    tujuanPembelajaran: 'Menjelaskan arti dan makna dari Asmaul Husna.',
    rubrikPenilaian: 'Skor 6 untuk jawaban Merajai / Menguasai alam semesta.'
  },
  {
    id: 'soal-14',
    number: 14,
    type: 'isian',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan stimulus kasus berikut!',
    stimulusText: 'Fatimah meminjam buku paket temannya dan tidak sengaja menumpahkan air minum di atas buku tersebut. Menyadari kesalahannya, Fatimah langsung meminta maaf dan bersedia mengganti buku tersebut.',
    questionText: 'Sikap berani mengakui kesalahan dan meminta maaf yang dicontohkan Fatimah merupakan bukti sikap ...',
    correctAnswer: 'Bertanggung jawab / Jujur / Ksatria',
    score: 6,
    cognitiveLevel: 'L2',
    indikatorSoal: 'Peserta didik dapat mengidentifikasi sikap tanggung jawab berdasarkan narasi kasus.',
    ipk: 'Mengidentifikasi perwujudan sikap tanggung jawab dalam kehidupan sosial.',
    classLevel: 'Kelas 4',
    materiPokok: 'Tanggung Jawab',
    capaianPembelajaran: 'Peserta didik membiasakan sikap tanggung jawab.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak perilaku jujur dan tanggung jawab.',
    rubrikPenilaian: 'Skor 6 untuk kata kunci Tanggung Jawab / Berjiwa ksatria.'
  },
  {
    id: 'soal-15',
    number: 15,
    type: 'isian',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan hadits tuntunan bertamu berikut!',
    arabicText: 'التَّسْلِيمُ ثَلَاثٌ ، فَإِنْ أُذِنَ لَكَ وَإِلَّا فَارْجِعْ',
    arabicTranslation: 'Memberi salam itu tiga kali, jika diizinkan bagimu (masuklah) dan jika tidak maka pulanglah.',
    questionText: 'Batas maksimal mengetuk pintu dan mengucapkan salam saat bertamu ke rumah tetangga sesuai hadits nabi di atas adalah sebanyak ... kali.',
    correctAnswer: '3 (tiga)',
    score: 6,
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan hadits salam bertamu, peserta didik dapat menentukan batas jumlah ketukan dan salam saat bertamu.',
    ipk: 'Menentukan batas ketukan dan ucapan salam dalam adab bertamu.',
    classLevel: 'Kelas 4',
    materiPokok: 'Adab Bertamu',
    capaianPembelajaran: 'Peserta didik memahami sunnah adab bertamu.',
    cpId: 'cp-akidah-3',
    cpCode: 'CP 3',
    tpCode: 'TP 3.1',
    tujuanPembelajaran: 'Menjelaskan tata krama dan adab bertamu.',
    rubrikPenilaian: 'Skor 6 untuk angka 3 atau kata tiga.'
  },

  // ESAI / URAIAN
  {
    id: 'soal-16',
    number: 16,
    type: 'esai',
    stimulusType: 'cerita',
    stimulusTitle: 'Simak teks narasi berikut untuk menjawab soal esai!',
    stimulusText: 'Pak Sholeh adalah seorang pedagang buah di pasar dekat madrasah. Beliau selalu menimbang buah dagangannya dengan timbangan yang pas dan tidak pernah mengurangi timbangan demi keuntungan pribadi. Beliau yakin bahwa rezeki yang didapat dari kejujuran akan membawa berkah bagi keluarganya.',
    questionText: 'Jelaskan 3 (tiga) hikmah yang diperoleh seseorang yang selalu bersikap jujur dan amanah dalam kehidupan sehari-hari sebagaimana dicontohkan oleh Pak Sholeh!',
    correctAnswer: '1. Mendapatkan kepercayaan penuh dari orang lain/pelanggan.\n2. Hati menjadi tenteram dan damai karena tidak merasa bersalah.\n3. Mendapatkan pahala dan keridhaan dari Allah Swt. serta rezeki yang berkah.',
    score: 10,
    cognitiveLevel: 'L3',
    indikatorSoal: 'Peserta didik dapat menganalisis dan menguraikan minimal 3 hikmah perilaku jujur dan amanah.',
    ipk: 'Menguraikan 3 hikmah perilaku jujur dan amanah dalam kehidupan bermasyarakat.',
    classLevel: 'Kelas 4',
    materiPokok: 'Hikmah Kejujuran & Amanah',
    capaianPembelajaran: 'Peserta didik mampu menguraikan hikmah berperilaku terpuji dalam pergaulan masyarakat.',
    cpId: 'cp-akidah-2',
    cpCode: 'CP 2',
    tpCode: 'TP 2.2',
    tujuanPembelajaran: 'Menganalisis dampak positif dan hikmah dari perilaku jujur.',
    rubrikPenilaian: '- Menyebutkan 3 hikmah lengkap dan logis: skor 10.\n- Menyebutkan 2 hikmah: skor 7.\n- Menyebutkan 1 hikmah: skor 4.\n- Menjawab namun kurang tepat: skor 2.'
  },
  {
    id: 'soal-17',
    number: 17,
    type: 'esai',
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kaligrafi 3 Asmaul Husna berharakat berikut!',
    arabicText: 'الْمَلِكُ ۝ الْقُدُّوسُ ۝ السَّلَامُ',
    arabicTranslation: 'Al-Malik (Maha Merajai), Al-Quddus (Maha Suci), As-Salam (Maha Memberi Kesejahteraan).',
    questionText: 'Berdasarkan lafaz 3 Asmaul Husna di atas, tuliskan arti masing-masing Asmaul Husna tersebut dan berikan 1 (satu) contoh cara meneladaninya dalam lingkungan madrasah sehari-hari!',
    correctAnswer: '1. Al-Malik (Maha Merajai) -> Meneladani dengan memimpin kelas dengan bijak dan adil serta tidak sombong.\n2. Al-Quddus (Maha Suci) -> Meneladani dengan menjaga kebersihan pakaian, lisan dari perkataan kotor, dan ruang kelas.\n3. As-Salam (Maha Memberi Keselamatan) -> Meneladani dengan menebarkan salam dan mendamaikan teman yang bertengkar.',
    score: 10,
    cognitiveLevel: 'L3',
    indikatorSoal: 'Peserta didik dapat menguraikan 3 Asmaul Husna berharakat beserta artinya serta contoh teladannya di madrasah.',
    ipk: 'Menyebutkan 3 Asmaul Husna beserta arti dan contoh peneladanannya di sekolah.',
    classLevel: 'Kelas 4',
    materiPokok: 'Pengamalan Asmaul Husna',
    capaianPembelajaran: 'Peserta didik mampu meneladani Asmaul Husna dalam kehidupan madrasah.',
    cpId: 'cp-akidah-1',
    cpCode: 'CP 1',
    tpCode: 'TP 1.2',
    tujuanPembelajaran: 'Memberikan contoh sikap meneladani Asmaul Husna.',
    rubrikPenilaian: '- 3 Asmaul Husna + arti + contoh teladan lengkap: skor 10.\n- 2 Asmaul Husna lengkap: skor 7.\n- 1 Asmaul Husna lengkap: skor 4.'
  },
  {
    id: 'soal-18',
    number: 18,
    type: 'esai',
    stimulusType: 'tabel',
    stimulusTitle: 'Perhatikan tabel situasi sosial bertetangga berikut!',
    stimulusTable: 'Situasi | Peristiwa\nA | Tetangga sebelah rumah sedang sakit demam tinggi\nB | Tetangga sedang mengadakan acara hajatan dan membutuhkan bantuan kursi\nC | Anak tetangga menangis karena mainannya tersangkut di dahan pohon',
    questionText: 'Berdasarkan tabel di atas, uraikan tindakan adab Islami apa yang seharusnya kamu lakukan untuk masing-masing situasi A, B, dan C!',
    correctAnswer: 'Situasi A: Menjenguk tetangga yang sakit, mendoakan kesembuhannya, dan membawakan buah tangan jika mampu.\nSituasi B: Ikut membantu tetangga menyusun kursi dan menawarkan bantuan tenaga dengan ikhlas.\nSituasi C: Membantu menolong mengambilkan mainan anak tetangga dengan hati-hati dan menghiburnya.',
    score: 10,
    cognitiveLevel: 'L3',
    indikatorSoal: 'Peserta didik dapat merumuskan tindakan adab bertetangga berdasarkan tabel situasi yang disajikan.',
    ipk: 'Merumuskan tindakan adab bertetangga yang berakhlak mulia berdasarkan situasi.',
    classLevel: 'Kelas 4',
    materiPokok: 'Adab Bertetangga',
    capaianPembelajaran: 'Peserta didik mampu menyelesaikan masalah sosial lingkungan bertetangga sesuai ajaran Islam.',
    cpId: 'cp-akidah-3',
    cpCode: 'CP 3',
    tpCode: 'TP 3.2',
    tujuanPembelajaran: 'Menentukan tindakan adab bertetangga yang berakhlak mulia.',
    rubrikPenilaian: '- Menguraikan tindakan yang tepat untuk ketiga situasi: skor 10.\n- Menguraikan untuk dua situasi: skor 7.\n- Menguraikan untuk satu situasi: skor 4.'
  }
];

export const PAPER_DIMENSIONS: Record<ExamPaperSize, { widthCm: number; heightCm: number; widthMm: number; heightMm: number; name: string; desc: string }> = {
  F4: { widthCm: 21.5, heightCm: 33.0, widthMm: 215, heightMm: 330, name: 'F4 / Folio', desc: '21.5 × 33.0 cm (Standar Utama Sekolah & Madrasah Indonesia)' },
  A4: { widthCm: 21.0, heightCm: 29.7, widthMm: 210, heightMm: 297, name: 'A4', desc: '21.0 × 29.7 cm (Standar Internasional ISO)' },
  Legal: { widthCm: 21.6, heightCm: 35.6, widthMm: 216, heightMm: 356, name: 'Legal', desc: '21.6 × 35.6 cm' },
  Letter: { widthCm: 21.6, heightCm: 27.9, widthMm: 216, heightMm: 279, name: 'Letter / Kuarto', desc: '21.6 × 27.9 cm' },
};

export const FONT_FAMILY_OPTIONS: { value: ExamFontFamily; label: string; desc: string; generic: string }[] = [
  { value: 'Times New Roman', label: 'Times New Roman', desc: 'Standar Resmi Naskah Ujian Madrasah / Sekolah', generic: 'serif' },
  { value: 'Arial', label: 'Arial', desc: 'Sans-Serif Jelas, Bersih & Nyaman untuk Mata Siswa', generic: 'sans-serif' },
  { value: 'Calibri', label: 'Calibri', desc: 'Modern & Rapi untuk Lembar Asesmen', generic: 'sans-serif' },
  { value: 'Bookman Old Style', label: 'Bookman Old Style', desc: 'Klasik Elegan Berkarakter', generic: 'serif' },
  { value: 'Cambria', label: 'Cambria', desc: 'Serif Presisi untuk Dokumen Formal', generic: 'serif' },
  { value: 'Georgia', label: 'Georgia', desc: 'Serif Kokoh Jelas di Cetak Maupun Layar', generic: 'serif' },
];

export const FONT_SIZE_OPTIONS = [
  { value: 9.5, label: '9.5 pt', desc: 'Sangat Rapat (Hemat Kertas & Fotokopi)' },
  { value: 10, label: '10 pt', desc: 'Rapat (Efisien Halaman)' },
  { value: 10.5, label: '10.5 pt', desc: 'Kompak Standar' },
  { value: 11, label: '11 pt', desc: 'Standar Resmi Ujian Nasional/Madrasah' },
  { value: 12, label: '12 pt', desc: 'Sedang / Lega Nyaman Dibaca' },
  { value: 13, label: '13 pt', desc: 'Besar (Khusus Siswa Fase A / Kelas 1-2 SD/MI)' },
];

export const MARGIN_PRESETS: Record<ExamMarginPreset, { label: string; desc: string; top: number; bottom: number; left: number; right: number }> = {
  narrow: { label: 'Sempit / Hemat Kertas', desc: '1.5 cm keliling (Memaksimalkan muatan soal per halaman fotokopi)', top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 },
  normal: { label: 'Normal / Standar Ujian', desc: '2.0 cm keliling (Format rapi standar ujian sekolah)', top: 2.0, bottom: 2.0, left: 2.0, right: 2.0 },
  standard_word: { label: 'Standar Word', desc: 'Atas/Bawah 2.5 cm, Kiri 2.5 cm, Kanan 2.0 cm', top: 2.5, bottom: 2.5, left: 2.5, right: 2.0 },
  custom: { label: 'Kustom Manual', desc: 'Atur margin atas, bawah, kiri, kanan sesuai kebutuhan', top: 1.5, bottom: 1.5, left: 1.5, right: 1.5 },
};

export const DEFAULT_PAPER_LAYOUT: ExamPaperLayout = {
  fontFamily: 'Times New Roman',
  fontSizePt: 11,
  lineHeight: 1.3,
  paperSize: 'F4',
  marginPreset: 'narrow',
  marginTopCm: 1.5,
  marginBottomCm: 1.5,
  marginLeftCm: 1.5,
  marginRightCm: 1.5,
  columnsCount: 1,
  showAnswerDottedLines: true,
  questionSpacing: 'normal',
};
