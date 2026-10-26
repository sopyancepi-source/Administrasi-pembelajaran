// =========================================================================
// KURIKULUM BERBASIS CINTA (KBC) KEMENAG RI
// Dasar Kebijakan: KMA No. 1503 Tahun 2025 & Kepdirjen Pendis No. 6077 Tahun 2025
// =========================================================================

export type KbcPillarType = 
  | 'Cinta Allah' 
  | 'Cinta Rasul' 
  | 'Cinta Diri Sendiri' 
  | 'Cinta Sesama' 
  | 'Cinta Lingkungan';

export interface KbcPillarMeta {
  id: KbcPillarType;
  title: string;
  arabicConcept: string;
  tagColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  iconSymbol: string;
  coreValues: string[];
  description: string;
  pedagogicalImpactInExam: string;
}

export const KBC_PILLARS: Record<KbcPillarType, KbcPillarMeta> = {
  'Cinta Allah': {
    id: 'Cinta Allah',
    title: 'Cinta Allah SWT',
    arabicConcept: 'Hablum minallah / Hubbullah',
    tagColor: 'emerald',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    borderColor: 'border-emerald-300',
    iconSymbol: '🕌',
    coreValues: ['Keikhlasan Beribadah', 'Syukur', 'Mengenal Asmaul Husna', 'Tawakkal', 'Ikhlas Beramal'],
    description: 'Menjadikan ibadah dan kebaikan berakar dari rasa cinta dan rindu kepada Allah Swt., bukan sekadar beban kewajiban formal atau ketakutan.',
    pedagogicalImpactInExam: 'Soal menyajikan stimulus ibadah yang menghadirkan kekhusyukan, makna doa shalat, dan pengenalan kasih sayang Allah (Ar-Rahman).'
  },
  'Cinta Rasul': {
    id: 'Cinta Rasul',
    title: 'Cinta Rasulullah SAW',
    arabicConcept: 'Hubburrasul / Uswatun Hasanah',
    tagColor: 'violet',
    badgeBg: 'bg-violet-100',
    badgeText: 'text-violet-900',
    borderColor: 'border-violet-300',
    iconSymbol: '📖',
    coreValues: ['Meneladani Akhlak Nabi', 'Shiddiq & Amanah', 'Tabligh & Fathanah', 'Menghidupkan Sunnah'],
    description: 'Menumbuhkan kecintaan mendalam kepada Nabi Muhammad Saw. dengan meneladani akhlak mulia dan kasih sayang beliau kepada segenap umat.',
    pedagogicalImpactInExam: 'Soal menyajikan kisah teladan Rasulullah dan sahabat, hadits-hadits sahih berharakat, dan studi kasus meniru keluhuran pekerti Nabi.'
  },
  'Cinta Diri Sendiri': {
    id: 'Cinta Diri Sendiri',
    title: 'Cinta Diri Sendiri',
    arabicConcept: 'Hubbunnafs / Hifzhun Nafs',
    tagColor: 'sky',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    borderColor: 'border-sky-300',
    iconSymbol: '✨',
    coreValues: ['Integritas & Kejujuran', 'Menjaga Kesehatan Jasmani & Rohani', 'Makanan Halal Thayyib', 'Percaya Diri', 'Pantang Menyerah'],
    description: 'Menjaga kehormatan diri, kebersihan badan, kesehatan mental, menjauhi makanan haram/merusak tubuh, serta percaya diri menuntut ilmu.',
    pedagogicalImpactInExam: 'Soal mengevaluasi kejujuran mengerjakan tugas, menjaga kebersihan bersuci (thaharah), dan memilah konsumsi yang halal serta bergizi.'
  },
  'Cinta Sesama': {
    id: 'Cinta Sesama',
    title: 'Cinta Sesama & Keberagaman',
    arabicConcept: 'Hubbunnaas / Ukhuwah & Inklusif',
    tagColor: 'rose',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    borderColor: 'border-rose-300',
    iconSymbol: '🤝',
    coreValues: ['Empati & Welas Asih', 'Santun kepada Guru & Orang Tua', 'Peduli Yatim & Dhuafa', 'Anti Perundungan (Anti-Bullying)', 'Toleransi & Gotong Royong'],
    description: 'Menghormati hak sesama manusia tanpa membeda-bedakan, membela yang lemah (spirit Al-Ma\'un), santun bertutur kata, dan cinta damai.',
    pedagogicalImpactInExam: 'Soal studi kasus pemecahan masalah sosial, berbagi makanan, adab menegur saudara tanpa mempermalukan, dan kerja sama inklusif.'
  },
  'Cinta Lingkungan': {
    id: 'Cinta Lingkungan',
    title: 'Cinta Lingkungan & Semesta',
    arabicConcept: 'Hubbul Bi\'ah / Kesadaran Ekologis',
    tagColor: 'amber',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    borderColor: 'border-amber-300',
    iconSymbol: '🌱',
    coreValues: ['Hemat Air Saat Wudhu', 'Menyayangi Tumbuhan & Hewan', 'Kebersihan Madrasah', 'Peduli Sampah', 'Amanah Memakmurkan Bumi'],
    description: 'Menumbuhkan kesadaran ekologis bahwa merawat bumi dan tidak merusak alam adalah bagian mutlak dari keimanan seorang muslim.',
    pedagogicalImpactInExam: 'Soal matematika menghitung hasil panen/taman madrasah, IPAS pelestarian ekosistem, serta fiqih larangan membuang-buang air bersuci.'
  }
};

/**
 * Otomatis mendeteksi Pilar KBC yang relevan berdasarkan kata kunci pada soal, materi, atau stimulus.
 * Guru tidak perlu pusing mikir, sistem otomatis menganalisis dan memetakan.
 */
export function detectKbcPillar(
  questionText: string = '',
  materiPokok: string = '',
  stimulusText: string = '',
  subject: string = ''
): { pillar: KbcPillarType; description: string } {
  const combined = `${questionText} ${materiPokok} ${stimulusText} ${subject}`.toLowerCase();

  // 1. CINTA LINGKUNGAN & ALAM SEMESTA
  if (
    combined.includes('lingkungan') || combined.includes('alam') || combined.includes('tumbuhan') ||
    combined.includes('hewan') || combined.includes('kebun') || combined.includes('sawah') ||
    combined.includes('panen') || combined.includes('hemat air') || combined.includes('sampah') ||
    combined.includes('kebersihan') || combined.includes('ekosistem') || combined.includes('bumi') ||
    combined.includes('fotosintesis')
  ) {
    return {
      pillar: 'Cinta Lingkungan',
      description: 'Menumbuhkan kesadaran ekologis, merawat keindahan alam, dan tanggung jawab memakmurkan bumi sebagai khalifah.'
    };
  }

  // 2. CINTA SESAMA & INKLUSIF
  if (
    combined.includes('yatim') || combined.includes('miskin') || combined.includes('zakat') ||
    combined.includes('sedekah') || combined.includes('tetangga') || combined.includes('bertamu') ||
    combined.includes('teman') || combined.includes('menolong') || combined.includes('berbagi') ||
    combined.includes('keluarga') || combined.includes('orang tua') || combined.includes('guru') ||
    combined.includes('al-ma\'un') || combined.includes('al-maun') || combined.includes('toleransi') ||
    combined.includes('jamaah') || combined.includes('persaudaraan') || combined.includes('anshar') ||
    combined.includes('muhajirin') || combined.includes('kakek') || combined.includes('shaf')
  ) {
    return {
      pillar: 'Cinta Sesama',
      description: 'Menebar empati, welas asih kepada kaum dhuafa, menghormati orang lain, dan menguatkan kerukunan sosial.'
    };
  }

  // 3. CINTA RASUL
  if (
    combined.includes('rasul') || combined.includes('nabi') || combined.includes('hadits') ||
    combined.includes('hadis') || combined.includes('sunnah') || combined.includes('hijrah') ||
    combined.includes('sahabat') || combined.includes('abu bakar') || combined.includes('umar') ||
    combined.includes('piagam madinah') || combined.includes('uswatun hasanah')
  ) {
    return {
      pillar: 'Cinta Rasul',
      description: 'Meneladani keluhuran akhlak Nabi Muhammad Saw. dan mempraktikkan sunnah beliau dalam keseharian.'
    };
  }

  // 4. CINTA DIRI SENDIRI (INTEGRITAS & KESEHATAN)
  if (
    combined.includes('jujur') || combined.includes('amanah') || combined.includes('makanan halal') ||
    combined.includes('minuman') || combined.includes('thayyib') || combined.includes('haram') ||
    combined.includes('kesehatan') || combined.includes('menuntut ilmu') || combined.includes('belajar') ||
    combined.includes('fisik') || combined.includes('at-tin') || combined.includes('bentuk sebaik-baiknya')
  ) {
    return {
      pillar: 'Cinta Diri Sendiri',
      description: 'Menjaga kehormatan jiwa, integritas moral kejujuran, dan merawat kesehatan fisik dari konsumsi yang merusak.'
    };
  }

  // 5. CINTA ALLAH (DEFAULT UNTUK IBADAH & ASMAUL HUSNA)
  return {
    pillar: 'Cinta Allah',
    description: 'Menumbuhkan rasa rindu, ikhlas beribadah, dan mengenal keagungan Asmaul Husna Allah Swt.'
  };
}
