import { SubjectCPData, SubjectItem } from '../types/learning';

export const DEFAULT_SUBJECTS: SubjectItem[] = [
  { id: 'sub-1', name: 'PAI & BP', code: 'PAI', jpPerWeek: 3, color: '#16a34a' },
  { id: 'sub-2', name: 'Pendidikan Pancasila', code: 'PPKN', jpPerWeek: 4, color: '#dc2626' },
  { id: 'sub-3', name: 'Bahasa Indonesia', code: 'BIND', jpPerWeek: 6, color: '#0284c7' },
  { id: 'sub-4', name: 'Matematika', code: 'MTK', jpPerWeek: 5, color: '#d97706' },
  { id: 'sub-5', name: 'IPAS', code: 'IPAS', jpPerWeek: 5, color: '#059669' },
  { id: 'sub-6', name: 'PJOK', code: 'PJOK', jpPerWeek: 3, color: '#0891b2' },
  { id: 'sub-7', name: 'Seni Rupa / Budaya', code: 'SENI', jpPerWeek: 3, color: '#9333ea' },
  { id: 'sub-8', name: 'Bahasa Inggris', code: 'BING', jpPerWeek: 2, color: '#4f46e5' },
  { id: 'sub-9', name: 'Mulok (Bahasa Daerah)', code: 'MULOK', jpPerWeek: 2, color: '#ca8a04' },
  { id: 'sub-10', name: 'P5 (Projek Pancasila)', code: 'P5', jpPerWeek: 2, color: '#e11d48' },
];

export const DEFAULT_SUBJECTS_MI: SubjectItem[] = [
  { id: 'sub-mi-1', name: "Al-Qur'an Hadits", code: 'QURAN', jpPerWeek: 2, color: '#16a34a' },
  { id: 'sub-mi-2', name: 'Akidah Akhlak', code: 'AKIDAH', jpPerWeek: 2, color: '#059669' },
  { id: 'sub-mi-3', name: 'Fiqih', code: 'FIQIH', jpPerWeek: 2, color: '#0d9488' },
  { id: 'sub-mi-4', name: 'Sejarah Kebudayaan Islam (SKI)', code: 'SKI', jpPerWeek: 2, color: '#0891b2' },
  { id: 'sub-mi-5', name: 'Bahasa Arab', code: 'B.ARAB', jpPerWeek: 2, color: '#0284c7' },
  { id: 'sub-mi-6', name: 'Pendidikan Pancasila', code: 'PPKN', jpPerWeek: 4, color: '#dc2626' },
  { id: 'sub-mi-7', name: 'Bahasa Indonesia', code: 'BIND', jpPerWeek: 6, color: '#2563eb' },
  { id: 'sub-mi-8', name: 'Matematika', code: 'MTK', jpPerWeek: 5, color: '#d97706' },
  { id: 'sub-mi-9', name: 'IPAS', code: 'IPAS', jpPerWeek: 5, color: '#ca8a04' },
  { id: 'sub-mi-10', name: 'PJOK', code: 'PJOK', jpPerWeek: 3, color: '#9333ea' },
  { id: 'sub-mi-11', name: 'Seni Budaya', code: 'SENI', jpPerWeek: 3, color: '#e11d48' },
  { id: 'sub-mi-12', name: 'Bahasa Inggris', code: 'BING', jpPerWeek: 2, color: '#4f46e5' },
];

// Default CP & TP template bank (100% editable by teacher)
export const INITIAL_CP_TP_MAP: Record<string, SubjectCPData> = {
  'sub-4': {
    subjectId: 'sub-4',
    subjectName: 'Matematika',
    classLevel: 'Kelas 1',
    fase: 'Fase A',
    elemen: 'Bilangan, Geometri, Pengukuran, Analisis Data',
    capaianPembelajaran: 'Peserta didik mampu memahami bilangan cacah sampai 100, melakukan operasi penjumlahan dan pengurangan sampai 20, mengenal dan mendeskripsikan ciri bangun datar dan bangun ruang sederhana, serta membandingkan panjang dan berat benda secara langsung.',
    tujuanPembelajaranList: [
      // Semester 1
      {
        id: 'tp-mtk-1',
        code: 'TP 1.1',
        babUnit: 'Bab 1: Bilangan sampai 10',
        text: 'Membilang, membaca, dan menuliskan lambang bilangan cacah 1 sampai dengan 10 secara konkret.',
        semester: 1,
        alokasiJp: 15,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-2',
        code: 'TP 1.2',
        babUnit: 'Bab 1: Bilangan sampai 10',
        text: 'Membandingkan dan mengurutkan benda berdasarkan banyaknya menggunakan istilah lebih banyak, lebih sedikit, atau sama banyak.',
        semester: 1,
        alokasiJp: 15,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-3',
        code: 'TP 1.3',
        babUnit: 'Bab 2: Penjumlahan sampai 10',
        text: 'Menjelaskan dan melakukan operasi penjumlahan bilangan cacah sampai 10 menggunakan benda konkret dan gambar.',
        semester: 1,
        alokasiJp: 18,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-4',
        code: 'TP 1.4',
        babUnit: 'Bab 3: Pengurangan sampai 10',
        text: 'Menjelaskan dan melakukan pengurangan bilangan cacah sampai 10 dan menyelesaikan masalah kontekstual sehari-hari.',
        semester: 1,
        alokasiJp: 18,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-5',
        code: 'TP 1.5',
        babUnit: 'Bab 4: Bentuk-Bentuk Bangun',
        text: 'Mengenal dan mengelompokkan berbagai bangun datar (segitiga, segiempat, lingkaran) dan bangun ruang sederhana.',
        semester: 1,
        alokasiJp: 14,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-6',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Evaluasi penguasaan materi Bab 1 dan Bab 2 (STS Ganjil).',
        semester: 1,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-mtk-7',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Evaluasi ketercapaian seluruh TP Semester Ganjil (SAS Ganjil).',
        semester: 1,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
      // Semester 2
      {
        id: 'tp-mtk-8',
        code: 'TP 2.1',
        babUnit: 'Bab 5: Bilangan sampai 20',
        text: 'Membilang, membaca, menuliskan, serta memahami nilai tempat puluhan dan satuan bilangan 11 sampai 20.',
        semester: 2,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-9',
        code: 'TP 2.2',
        babUnit: 'Bab 6: Penjumlahan & Pengurangan sampai 20',
        text: 'Menghitung penjumlahan dan pengurangan melibatkan bilangan sampai 20 dengan strategi menghitung maju dan mundur.',
        semester: 2,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-10',
        code: 'TP 2.3',
        babUnit: 'Bab 7: Pengukuran Panjang & Waktu',
        text: 'Membandingkan panjang benda dengan satuan tidak baku dan membaca waktu jam bulat (jam analog).',
        semester: 2,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-11',
        code: 'TP 2.4',
        babUnit: 'Bab 8: Diagram Gambar (Piktogram)',
        text: 'Mengumpulkan data sederhana di lingkungan kelas dan menyajikannya dalam bentuk piktogram atau tabel gambar.',
        semester: 2,
        alokasiJp: 15,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-mtk-12',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Evaluasi penguasaan materi Bab 5 dan Bab 6 (STS Genap).',
        semester: 2,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-mtk-13',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2 (Kenaikan Kelas)',
        text: 'Evaluasi ketercapaian seluruh TP Semester Genap (SAS Genap / SAT).',
        semester: 2,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
    ]
  },
  'sub-3': {
    subjectId: 'sub-3',
    subjectName: 'Bahasa Indonesia',
    classLevel: 'Kelas 1',
    fase: 'Fase A',
    elemen: 'Menyimak, Membaca dan Memirsa, Berbicara dan Mempresentasikan, Menulis',
    capaianPembelajaran: 'Peserta didik memiliki kemampuan berbahasa untuk berkomunikasi dan bernalar, sesuai dengan tujuan, konteks sosial, dan akademis. Peserta didik mampu memahami pesan lisan dan informasi dari media audio, teks aural (teks yang dibacakan dan/atau didengar), teks visual, dan teks audiovisual.',
    tujuanPembelajaranList: [
      {
        id: 'tp-bind-1',
        code: 'TP 1.1',
        babUnit: 'Bab 1: Bunyi Apa?',
        text: 'Mengenal bunyi dan panca indra, merangkai huruf alfabet "b" dan "c" dengan vokal menjadi suku kata dan kata bermakna.',
        semester: 1,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-2',
        code: 'TP 1.2',
        babUnit: 'Bab 2: Ayo Bermain!',
        text: 'Menyimak instruksi sederhana saat bermain, mengenal huruf "h" dan "c", serta menuliskan nama sendiri dengan benar.',
        semester: 1,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-3',
        code: 'TP 1.3',
        babUnit: 'Bab 3: Awas Kuman!',
        text: 'Menyampaikan gagasan tentang menjaga kebersihan diri, mengenal huruf "k", dan membaca kata-kata yang sering ditemui.',
        semester: 1,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-4',
        code: 'TP 1.4',
        babUnit: 'Bab 4: Aku Bisa!',
        text: 'Menceritakan gambar peristiwa dengan kalimat sederhana, mengenal huruf "l", dan merangkai kata benda di sekitar.',
        semester: 1,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-5',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Evaluasi literasi Bab 1 & 2 (STS Ganjil).',
        semester: 1,
        alokasiJp: 6,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-bind-6',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Evaluasi akhir capaian literasi semester 1.',
        semester: 1,
        alokasiJp: 6,
        keterangan: 'Asesmen'
      },
      // Semester 2
      {
        id: 'tp-bind-7',
        code: 'TP 2.1',
        babUnit: 'Bab 5: Teman Baru',
        text: 'Mengenal tanda titik dan huruf kapital pada awal kalimat serta mengenal huruf "m" dan "t".',
        semester: 2,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-8',
        code: 'TP 2.2',
        babUnit: 'Bab 6: Berbeda Itu Tak Apa',
        text: 'Membaca nyaring teks pendek dengan intonasi wajar dan menghargai keragaman teman di sekolah.',
        semester: 2,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-9',
        code: 'TP 2.3',
        babUnit: 'Bab 7: Aku Ingin',
        text: 'Membedakan kebutuhan dan keinginan dalam kehidupan sehari-hari serta membuat kalimat permintaan tolong/maaf.',
        semester: 2,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-10',
        code: 'TP 2.4',
        babUnit: 'Bab 8: Di Sekitar Rumah',
        text: 'Membaca denah sederhana tempat tinggal dan menyampaikan petunjuk arah sederhana secara lisan.',
        semester: 2,
        alokasiJp: 24,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-bind-11',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Evaluasi literasi Bab 5 & 6 (STS Genap).',
        semester: 2,
        alokasiJp: 6,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-bind-12',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2',
        text: 'Evaluasi akhir capaian literasi semester 2.',
        semester: 2,
        alokasiJp: 6,
        keterangan: 'Asesmen'
      },
    ]
  },
  'sub-2': {
    subjectId: 'sub-2',
    subjectName: 'Pendidikan Pancasila',
    classLevel: 'Kelas 1',
    fase: 'Fase A',
    elemen: 'Pancasila, Undang-Undang Dasar 1945, Bhinneka Tunggal Ika, NKRI',
    capaianPembelajaran: 'Peserta didik mampu mengenal dan menceritakan simbol dan sila-sila Pancasila dalam lambang negara Garuda Pancasila; mengidentifikasi dan mematuhi aturan di rumah dan di sekolah; mengenal keberagaman identitas diri dan teman; serta mengenal lingkungan tempat tinggal dan sekolah sebagai bagian dari NKRI.',
    tujuanPembelajaranList: [
      {
        id: 'tp-ppkn-1',
        code: 'TP 1.1',
        babUnit: 'Bab 1: Aku Cinta Pancasila',
        text: 'Mengenal simbol dan bunyi sila-sila Pancasila serta menerapkan nilai ketuhanan dan kasih sayang sesama teman.',
        semester: 1,
        alokasiJp: 16,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ppkn-2',
        code: 'TP 1.2',
        babUnit: 'Bab 2: Aku Anak yang Patuh Aturan',
        text: 'Mengidentifikasi dan mempraktikkan aturan sederhana dalam kehidupan sehari-hari di rumah dan di kelas.',
        semester: 1,
        alokasiJp: 16,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ppkn-3',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Evaluasi pemahaman nilai Pancasila dan aturan sekolah (STS Ganjil).',
        semester: 1,
        alokasiJp: 4,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-ppkn-4',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Evaluasi akhir capaian Pendidikan Pancasila semester ganjil.',
        semester: 1,
        alokasiJp: 4,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-ppkn-5',
        code: 'TP 2.1',
        babUnit: 'Bab 3: Kita Berbeda tetapi Tetap Satu',
        text: 'Mengenal keberagaman identitas diri, fisik, dan hobi teman-teman di lingkungan sekolah dengan sikap saling menghargai.',
        semester: 2,
        alokasiJp: 16,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ppkn-6',
        code: 'TP 2.2',
        babUnit: 'Bab 4: Aku Cinta Lingkungan Sekitarku',
        text: 'Mengenal bagian-bagian lingkungan rumah dan sekolah serta menjaga kebersihan lingkungan sebagai wujud cinta tanah air.',
        semester: 2,
        alokasiJp: 16,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ppkn-7',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Evaluasi pemahaman keberagaman dan identitas (STS Genap).',
        semester: 2,
        alokasiJp: 4,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-ppkn-8',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2',
        text: 'Evaluasi akhir capaian Pendidikan Pancasila semester genap.',
        semester: 2,
        alokasiJp: 4,
        keterangan: 'Asesmen'
      },
    ]
  },
  'sub-1': {
    subjectId: 'sub-1',
    subjectName: 'PAI & BP',
    classLevel: 'Kelas 1',
    fase: 'Fase A',
    elemen: "Al-Qur'an Hadits, Akidah, Akhlak, Fiqih, Sejarah Peradaban Islam",
    capaianPembelajaran: "Peserta didik mampu melafalkan huruf hijaiyyah berharakat dan surat Al-Fatihah; mengenal rukun iman terutama iman kepada Allah dan Rasul; membiasakan kalimat thoyyibah dan adab berdoa; mempraktikkan bersuci (thaharah) dan rukun Islam; serta meneladani kisah Nabi Muhammad SAW.",
    tujuanPembelajaranList: [
      {
        id: 'tp-pai-1',
        code: 'TP 1.1',
        babUnit: "Bab 1: Aku Cinta Al-Qur'an",
        text: "Mengenal dan melafalkan huruf hijaiyyah berharakat fathah, kasrah, dan dhammah serta melafalkan Q.S. Al-Fatihah dengan lancar.",
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pai-2',
        code: 'TP 1.2',
        babUnit: 'Bab 2: Mengenal Rukun Iman',
        text: 'Mengenal rukun iman dan meyakini bahwa Allah SWT Maha Pencipta segala alam semesta.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pai-3',
        code: 'TP 1.3',
        babUnit: 'Bab 3: Aku Suka Membaca Basmalah',
        text: 'Membiasakan membaca Basmalah dan Hamdalah sebelum dan sesudah beraktivitas sehari-hari.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pai-4',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Evaluasi materi Bab 1 & 2 PAI (STS Ganjil).',
        semester: 1,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-pai-5',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Evaluasi akhir capaian PAI semester ganjil.',
        semester: 1,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-pai-6',
        code: 'TP 2.1',
        babUnit: 'Bab 4: Mengenal Rukun Islam & Syahadatain',
        text: 'Menyebutkan rukun Islam dan melafalkan dua kalimat syahadat beserta artinya.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pai-7',
        code: 'TP 2.2',
        babUnit: 'Bab 5: Bersih Itu Sehat (Thaharah)',
        text: 'Mempraktikkan tata cara bersuci (wudhu dan istinja) dengan tertib dan benar.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pai-8',
        code: 'TP 2.3',
        babUnit: 'Bab 6: Kisah Teladan Nabi Muhammad SAW',
        text: 'Menceritakan kembali kisah masa kecil Nabi Muhammad SAW dan meneladani sifat jujur beliau.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pai-9',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Evaluasi materi Bab 4 & 5 PAI (STS Genap).',
        semester: 2,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-pai-10',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2',
        text: 'Evaluasi akhir capaian PAI semester genap.',
        semester: 2,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
    ]
  },
  'sub-5': {
    subjectId: 'sub-5',
    subjectName: 'IPAS',
    classLevel: 'Kelas 4',
    fase: 'Fase B',
    elemen: 'Pemahaman IPAS (Sains & Sosial) dan Keterampilan Proses',
    capaianPembelajaran: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada manusia dan tumbuhan; menerapkan konsep wujud zat dan perubahannya; memanfaatkan energi kinetik dan potensial; serta mendeskripsikan keragaman sosial budaya dan kearifan lokal di daerah tempat tinggalnya.',
    tujuanPembelajaranList: [
      {
        id: 'tp-ipas-1',
        code: 'TP 1.1',
        babUnit: 'Bab 1: Tumbuhan, Sumber Kehidupan di Bumi',
        text: 'Mengidentifikasi bagian-bagian tubuh tumbuhan (akar, batang, daun, bunga) dan memahami proses fotosintesis.',
        semester: 1,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ipas-2',
        code: 'TP 1.2',
        babUnit: 'Bab 2: Wujud Zat dan Perubahannya',
        text: 'Mengenal karakteristik wujud zat (padat, cair, gas) dan mendemonstrasikan proses perubahan wujud benda.',
        semester: 1,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ipas-3',
        code: 'TP 1.3',
        babUnit: 'Bab 3: Gaya di Sekitar Kita',
        text: 'Mengidentifikasi ragam gaya (otot, gesek, magnet, gravitasi) dan pengaruhnya terhadap gerak benda.',
        semester: 1,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ipas-4',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Evaluasi IPAS Bab 1 & 2 (STS Ganjil).',
        semester: 1,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-ipas-5',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Evaluasi akhir capaian IPAS semester ganjil.',
        semester: 1,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-ipas-6',
        code: 'TP 2.1',
        babUnit: 'Bab 4: Mengubah Bentuk Energi',
        text: 'Mengidentifikasi ragam transformasi energi dalam kehidupan sehari-hari (listrik, panas, gerak, bunyi).',
        semester: 2,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ipas-7',
        code: 'TP 2.2',
        babUnit: 'Bab 5: Cerita Tentang Daerahku',
        text: 'Menceritakan sejarah perkembangan daerah tempat tinggal serta tokoh lokal yang berperan penting.',
        semester: 2,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ipas-8',
        code: 'TP 2.3',
        babUnit: 'Bab 6: Indonesiaku Kaya Budaya',
        text: 'Mendeskripsikan keragaman suku, bahasa daerah, pakaian adat, dan tradisi nusantara.',
        semester: 2,
        alokasiJp: 20,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-ipas-9',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Evaluasi IPAS Bab 4 & 5 (STS Genap).',
        semester: 2,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-ipas-10',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2',
        text: 'Evaluasi akhir capaian IPAS semester genap.',
        semester: 2,
        alokasiJp: 5,
        keterangan: 'Asesmen'
      },
    ]
  },
  'sub-6': {
    subjectId: 'sub-6',
    subjectName: 'PJOK',
    classLevel: 'Kelas 1',
    fase: 'Fase A',
    elemen: 'Keterampilan Gerak, Pengetahuan Gerak, Pemanfaatan Gerak, Pengembangan Karakter',
    capaianPembelajaran: 'Peserta didik mempraktikkan keterampilan pola gerak dasar lokomotor, non-lokomotor, dan manipulatif dalam berbagai permainan sederhana; memahami pentingnya kebersihan diri dan istirahat; serta menunjukkan perilaku sportif dan mandiri.',
    tujuanPembelajaranList: [
      {
        id: 'tp-pjok-1',
        code: 'TP 1.1',
        babUnit: 'Bab 1: Gerak Dasar Lokomotor',
        text: 'Mempraktikkan variasi gerak dasar berjalan, berlari, dan melompat ke berbagai arah.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pjok-2',
        code: 'TP 1.2',
        babUnit: 'Bab 2: Gerak Dasar Non-Lokomotor',
        text: 'Mempraktikkan gerak memutar, mengayun, meliuk, dan menekuk tubuh dengan seimbang.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pjok-3',
        code: 'TP 1.3',
        babUnit: 'Bab 3: Gerak Dasar Manipulatif',
        text: 'Mempraktikkan gerak melempar dan menangkap bola kecil serta menendang bola sederhana.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pjok-4',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Tes praktik gerak lokomotor dan non-lokomotor (STS Ganjil).',
        semester: 1,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-pjok-5',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Tes unjuk kerja gerak manipulatif (SAS Ganjil).',
        semester: 1,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-pjok-6',
        code: 'TP 2.1',
        babUnit: 'Bab 4: Senam Lantai Sederhana',
        text: 'Mempraktikkan pola gerak bertumpu, bergantung, keseimbangan, dan berguling di atas matras.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pjok-7',
        code: 'TP 2.2',
        babUnit: 'Bab 5: Gerak Berirama (Senam Ceria)',
        text: 'Mempraktikkan langkah kaki dan ayunan lengan mengikuti irama musik berketukan lambat dan sedang.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pjok-8',
        code: 'TP 2.3',
        babUnit: 'Bab 6: Pola Hidup Bersih & Sehat',
        text: 'Mengenal bagian-bagian tubuh, cara menjaga kebersihan kuku/rambut/pakaian, serta pentingnya tidur cukup.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-pjok-9',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Tes gerak senam irama (STS Genap).',
        semester: 2,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-pjok-10',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2',
        text: 'Evaluasi kebugaran dan tes pola hidup sehat (SAS Genap).',
        semester: 2,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
    ]
  },
  'sub-7': {
    subjectId: 'sub-7',
    subjectName: 'Seni Rupa / Budaya',
    classLevel: 'Kelas 1',
    fase: 'Fase A',
    elemen: 'Mengalami, Menciptakan, Merefleksikan, Berpikir dan Bekerja Artistik, Berdampak',
    capaianPembelajaran: 'Peserta didik mampu mengamati, mengenal, dan mengeksplorasi unsur rupa (garis, bentuk, warna primer) di lingkungan sekitarnya; membuat karya gambar dan kolase sederhana; serta mengekspresikan imajinasi secara percaya diri.',
    tujuanPembelajaranList: [
      {
        id: 'tp-seni-1',
        code: 'TP 1.1',
        babUnit: 'Bab 1: Mengenal Garis & Bentuk',
        text: 'Mengenal aneka garis (lurus, lengkung, zig-zag) dan menggambar objek di sekitar kelas dengan variasi garis.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-seni-2',
        code: 'TP 1.2',
        babUnit: 'Bab 2: Warna-Warni di Sekitarku',
        text: 'Mengenal warna primer (merah, kuning, biru) dan mencampur warna untuk menghasilkan warna baru.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-seni-3',
        code: 'TP 1.3',
        babUnit: 'Bab 3: Kolase dari Bahan Alam',
        text: 'Membuat karya kolase menggunakan daun kering, biji-bijian, dan kertas warna-warni.',
        semester: 1,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-seni-4',
        code: 'STS-1',
        babUnit: 'Sumatif Tengah Semester 1',
        text: 'Pameran karya gambar garis dan warna (STS Ganjil).',
        semester: 1,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-seni-5',
        code: 'SAS-1',
        babUnit: 'Sumatif Akhir Semester 1',
        text: 'Penilaian portofolio kolase semester 1.',
        semester: 1,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-seni-6',
        code: 'TP 2.1',
        babUnit: 'Bab 4: Bentuk Tiga Dimensi Sederhana',
        text: 'Membuat karya bentuk benda 3 dimensi menggunakan plastisin atau tanah liat buatan.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-seni-7',
        code: 'TP 2.2',
        babUnit: 'Bab 5: Seni Melipat Kertas (Origami)',
        text: 'Melipat kertas menjadi aneka bentuk hewan dan benda sederhana dengan rapi.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-seni-8',
        code: 'TP 2.3',
        babUnit: 'Bab 6: Menghias Topeng Kertas',
        text: 'Menggambar dan menghias pola wajah pada topeng kertas untuk pertunjukan sederhana.',
        semester: 2,
        alokasiJp: 12,
        keterangan: 'Materi Pokok'
      },
      {
        id: 'tp-seni-9',
        code: 'STS-2',
        babUnit: 'Sumatif Tengah Semester 2',
        text: 'Penilaian karya plastisin dan origami (STS Genap).',
        semester: 2,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
      {
        id: 'tp-seni-10',
        code: 'SAS-2',
        babUnit: 'Sumatif Akhir Semester 2',
        text: 'Gelar karya seni akhir tahun (SAS Genap).',
        semester: 2,
        alokasiJp: 3,
        keterangan: 'Asesmen'
      },
    ]
  }
};
