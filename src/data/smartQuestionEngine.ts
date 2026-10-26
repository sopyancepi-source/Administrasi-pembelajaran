import { QuestionItem, ExamCPItem, ExamTPItem, CognitiveLevel, QuestionType } from '../types/learning';
import { EDUCATIONAL_GRAPHICS } from '../components/learning/StimulusGraphicRenderer';
import { ARABIC_SNIPPETS_LIBRARY } from '../components/learning/StimulusGraphicRenderer';
import { detectKbcPillar, KbcPillarType } from './kbcHelpers';

export interface GraphicBinding {
  title: string;
  materiPokok: string;
  questionText: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  cognitiveLevel: CognitiveLevel;
  indikatorSoal: string;
  ipk: string;
  rubrikPenilaian: string;
  complexStatements?: string[];
  kbcPillar?: KbcPillarType | string;
  kbcDescription?: string;
}

// 1. EXACT HIGH-FIDELITY BINDINGS FOR ALL SVG GRAPHICS
export const SVG_GRAPHIC_BINDINGS: Record<string, GraphicBinding> = {
  // Matematika: Segitiga Siku-siku (Alas 12 cm, Tinggi 9 cm)
  'math_triangle_right': {
    title: 'Perhatikan gambar segitiga siku-siku ABC berikut!',
    materiPokok: 'Geometri & Luas Bangun Datar',
    questionText: 'Pada gambar segitiga siku-siku ABC di atas, panjang sisi alas AB = 12 cm dan tinggi AC = 9 cm. Luas segitiga ABC tersebut adalah ...',
    options: [
      { label: 'A', text: '54 cm²' },
      { label: 'B', text: '108 cm²' },
      { label: 'C', text: '21 cm²' },
      { label: 'D', text: '42 cm²' }
    ],
    correctAnswer: 'A',
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan gambar segitiga siku-siku berukuran alas 12 cm dan tinggi 9 cm, peserta didik dapat menghitung luas bangun tersebut dengan benar.',
    ipk: 'Menghitung luas daerah segitiga siku-siku menggunakan rumus L = (alas × tinggi) : 2.',
    rubrikPenilaian: 'L = (12 × 9) / 2 = 108 / 2 = 54 cm². Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDescription: 'Mengasah ketelitian dan kecintaan berpikir logis dalam geometri'
  },

  // Matematika: Pecahan Lingkaran 3/4
  'math_fraction_3_4': {
    title: 'Perhatikan gambar pecahan lingkaran berikut!',
    materiPokok: 'Pecahan Biasa',
    questionText: 'Sebuah kue tart dipotong menjadi 4 bagian yang sama besar. Sebanyak 3 bagian kue telah dimakan seperti tampak pada bagian berarsir di atas. Nilai pecahan dari bagian kue yang telah dimakan adalah ...',
    options: [
      { label: 'A', text: '1/4 bagian' },
      { label: 'B', text: '2/4 bagian' },
      { label: 'C', text: '3/4 bagian' },
      { label: 'D', text: '4/4 bagian' }
    ],
    correctAnswer: 'C',
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan gambar lingkaran terbagi 4 dengan 3 bagian berarsir, peserta didik dapat menentukan nilai pecahan biasa secara tepat.',
    ipk: 'Mengidentifikasi nilai pecahan biasa dari model visual luas daerah konkret.',
    rubrikPenilaian: 'Nilai bagian berarsir adalah 3 dari 4 bagian (3/4). Pilihan C bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDescription: 'Berbagi rezeki makanan secara adil kepada sesama teman'
  },

  // Matematika: Pecahan Batang 2/5
  'math_fraction_2_5': {
    title: 'Perhatikan gambar balok pecahan persegi panjang berikut!',
    materiPokok: 'Pecahan Senilai',
    questionText: 'Sebuah pita kayu sepanjang 1 meter dibagi menjadi 5 bagian yang sama panjang. Sebanyak 2 bagian diwarnai hijau (berarsir). Bagian pita yang berwarna hijau senilai dengan pecahan ...',
    options: [
      { label: 'A', text: '1/5' },
      { label: 'B', text: '2/5' },
      { label: 'C', text: '3/5' },
      { label: 'D', text: '5/2' }
    ],
    correctAnswer: 'B',
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan model konkret batang 5 kotak dengan 2 kotak berarsir, peserta didik menentukan nilai pecahannya.',
    ipk: 'Menyajikan representasi pecahan biasa menggunakan model batang panjang.',
    rubrikPenilaian: '2 bagian dari 5 bagian yang sama = 2/5. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDescription: 'Menemukan keindahan keteraturan bilangan pecahan'
  },

  // Matematika: Persegi Panjang 15 cm x 8 cm
  'math_rectangle': {
    title: 'Perhatikan gambar bangun persegi panjang PQRS berikut!',
    materiPokok: 'Keliling & Luas Bangun Datar',
    questionText: 'Pak Guru mengukur sebidang papan tulis berukuran panjang 15 cm dan lebar 8 cm seperti pada gambar di atas. Keliling dari papan tulis tersebut adalah ...',
    options: [
      { label: 'A', text: '23 cm' },
      { label: 'B', text: '46 cm' },
      { label: 'C', text: '120 cm' },
      { label: 'D', text: '60 cm' }
    ],
    correctAnswer: 'B',
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan gambar persegi panjang p=15 cm dan l=8 cm, peserta didik dapat menghitung keliling bangun tersebut.',
    ipk: 'Menghitung keliling persegi panjang dengan rumus K = 2 × (p + l).',
    rubrikPenilaian: 'K = 2 × (15 + 8) = 2 × 23 = 46 cm. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDescription: 'Menghargai ketepatan pengukuran dalam kehidupan sehari-hari'
  },

  // Matematika: Balok 3D Isometric (p=10, l=6, t=4)
  'math_cuboid_3d': {
    title: 'Perhatikan gambar bangun ruang balok 3D berikut!',
    materiPokok: 'Bangun Ruang Balok',
    questionText: 'Sebuah kotak wadah kapur tulis di kelas berbentuk balok dengan panjang 10 cm, lebar 6 cm, dan tinggi 4 cm seperti pada gambar. Volume balok tersebut adalah ...',
    options: [
      { label: 'A', text: '240 cm³' },
      { label: 'B', text: '120 cm³' },
      { label: 'C', text: '80 cm³' },
      { label: 'D', text: '480 cm³' }
    ],
    correctAnswer: 'A',
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan gambar balok berdimensi p=10 cm, l=6 cm, dan t=4 cm, peserta didik dapat menghitung volume balok.',
    ipk: 'Menghitung volume bangun ruang balok dengan rumus V = p × l × t.',
    rubrikPenilaian: 'V = 10 × 6 × 4 = 240 cm³. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDescription: 'Memahami ruang dan dimensi ciptaan Tuhan'
  },

  // Matematika: Diagram Batang Penjualan Buku Koperasi
  'math_bar_chart': {
    title: 'Perhatikan diagram batang penjualan buku koperasi siswa berikut!',
    materiPokok: 'Penyajian & Analisis Data Numerasi',
    questionText: 'Berdasarkan diagram batang di atas, selisih penjualan buku tulis paling banyak (hari Kamis: 40) dan paling sedikit (hari Jumat: 20) di koperasi madrasah adalah ...',
    options: [
      { label: 'A', text: '15 buku' },
      { label: 'B', text: '20 buku' },
      { label: 'C', text: '25 buku' },
      { label: 'D', text: '30 buku' }
    ],
    correctAnswer: 'B',
    cognitiveLevel: 'L3',
    indikatorSoal: 'Disajikan diagram batang data penjualan, peserta didik dapat menganalisis dan menghitung selisih nilai tertinggi dan terendah.',
    ipk: 'Menginterpretasikan data dalam bentuk diagram batang dan menghitung selisihnya.',
    rubrikPenilaian: 'Selisih = 40 (Kamis) - 20 (Jumat) = 20 buku. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDescription: 'Menumbuhkan kejujuran dan kerja sama dalam berniaga koperasi siswa'
  },

  // Matematika: Jam Analog 07.15 (Pengukuran Waktu & Sudut)
  'math_clock_0715': {
    title: 'Perhatikan jam analog dinding berikut!',
    materiPokok: 'Pengukuran Sudut & Waktu',
    questionText: 'Ahmad tiba di madrasah pada waktu yang ditunjukkan oleh jam dinding di atas. Waktu kedatangan Ahmad dan jenis sudut terkecil yang dibentuk kedua jarum jam tersebut adalah ...',
    options: [
      { label: 'A', text: 'Pukul 07.15 dan membentuk sudut lancip' },
      { label: 'B', text: 'Pukul 07.15 dan membentuk sudut tumpul' },
      { label: 'C', text: 'Pukul 03.35 dan membentuk sudut siku-siku' },
      { label: 'D', text: 'Pukul 08.15 dan membentuk sudut lurus' }
    ],
    correctAnswer: 'B',
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan gambar jam analog menunjukkan pukul 07.15, peserta didik dapat menentukan waktu dan mengidentifikasi jenis sudut yang terbentuk.',
    ipk: 'Mengidentifikasi jenis sudut tumpul pada jarum jam analog waktu tertentu.',
    rubrikPenilaian: 'Pukul 07.15 jarum jam dan menit membentuk sudut lebih dari 90° (sudut tumpul). Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_disiplin',
    kbcDescription: 'Menghargai waktu dan membiasakan datang ke madrasah tepat waktu'
  },

  // Agama: Urutan Rukun Wudhu
  'agama_wudhu_steps': {
    title: 'Perhatikan urutan rukun wudhu berikut!',
    materiPokok: 'Tata Cara Bersuci (Wudhu)',
    questionText: 'Berdasarkan bagan alur urutan rukun wudhu di atas, anggota badan yang wajib dibasuh setelah membasuh kedua tangan sampai siku adalah ...',
    options: [
      { label: 'A', text: 'Membasuh kedua telapak kaki hingga mata kaki' },
      { label: 'B', text: 'Mengusap sebagian rambut atau kepala' },
      { label: 'C', text: 'Berkumur-kumur dan membersihkan hidung' },
      { label: 'D', text: 'Membasuh kedua daun telinga' }
    ],
    correctAnswer: 'B',
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan bagan urutan rukun wudhu, peserta didik dapat menentukan urutan membasuh anggota wudhu secara tertib.',
    ipk: 'Mengidentifikasi rukun wudhu secara runtut dan tertib.',
    rubrikPenilaian: 'Setelah membasuh kedua tangan sampai siku, rukun berikutnya adalah mengusap sebagian kepala. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDescription: 'Menjaga kesucian lahir dan batin sebagai wujud cinta kepada Allah SWT'
  },

  // Agama: Timbangan Mizan
  'agama_mizan_scale': {
    title: 'Perhatikan ilustrasi timbangan mizan amal berikut!',
    materiPokok: 'Iman Kepada Hari Akhir (Mizan)',
    questionText: 'Berdasarkan gambar timbangan mizan di atas, seseorang yang timbangan amal kebaikannya lebih berat daripada keburukannya akan mendapatkan balasan ...',
    options: [
      { label: 'A', text: 'Kehidupan yang penuh keridhaan di dalam surga' },
      { label: 'B', text: 'Siksa kubur yang teramat pedih' },
      { label: 'C', text: 'Dihapus seluruh pahala kebaikannya' },
      { label: 'D', text: 'Ditempatkan di dasar neraka Hawiyah' }
    ],
    correctAnswer: 'A',
    cognitiveLevel: 'L2',
    indikatorSoal: 'Disajikan gambar timbangan mizan, peserta didik dapat menjelaskan balasan bagi orang yang berat timbangan kebaikannya.',
    ipk: 'Menjelaskan fungsi timbangan amal (Mizan) pada yaumul hisab.',
    rubrikPenilaian: 'Amal kebaikan lebih berat mengantarkan ke surga (QS. Al-Qari\'ah: 6-7). Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDescription: 'Senantiasa beramal sholeh dengan ikhlas mengharap ridha Allah'
  },

  // Agama: Ka'bah & Arah Kiblat
  'agama_kiblat_kaaba': {
    title: 'Perhatikan arah kiblat ke Ka\'bah berikut!',
    materiPokok: 'Ketentuan Shalat Fardhu',
    questionText: 'Menghadap ke arah Ka\'bah (Kiblat) di Masjidil Haram bagi seorang muslim yang melaksanakan shalat fardhu berkedudukan sebagai ...',
    options: [
      { label: 'A', text: 'Syarat sah shalat' },
      { label: 'B', text: 'Sunnah muakkad' },
      { label: 'C', text: 'Rukun fi\'li shalat' },
      { label: 'D', text: 'Pembatal shalat' }
    ],
    correctAnswer: 'A',
    cognitiveLevel: 'L1',
    indikatorSoal: 'Disajikan gambar Ka\'bah dan arah kiblat, peserta didik dapat menentukan hukum menghadap kiblat dalam shalat.',
    ipk: 'Mengidentifikasi syarat sah shalat fardhu yaitu menghadap kiblat.',
    rubrikPenilaian: 'Menghadap kiblat adalah syarat sah shalat. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDescription: 'Menyatukan hati dan raga menghadap kiblat yang sama'
  }
};

// 2. AUTHENTIC QUESTION TEMPLATES POOL FOR SUBJECTS (NO DUMMY PLACEHOLDERS)
export interface TopicQuestionData {
  materiKeywords: string[];
  stem: string;
  options: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correct: 'A' | 'B' | 'C' | 'D';
  cognitiveLevel: CognitiveLevel;
  indikator: string;
  ipk: string;
  rubrik: string;
  kbcPillar: KbcPillarType | string;
  kbcDesc: string;
  stimulusType?: 'none' | 'cerita' | 'gambar' | 'tabel' | 'gabungan';
  stimulusTitle?: string;
  stimulusText?: string;
  stimulusTable?: string;
  stimulusSvg?: string;
  arabicText?: string;
  arabicTranslation?: string;
  isianQuestion?: string;
  isianAnswer?: string;
  esaiQuestion?: string;
  esaiAnswer?: string;
  complexStatements?: string[];
  complexOptions?: { label: 'A' | 'B' | 'C' | 'D'; text: string }[];
}

const AUTHENTIC_MATH_POOL: TopicQuestionData[] = [
  // 0A. Rasio Satuan & Bernalar Proporsional (Konteks Koperasi & Masalah Sehari-hari)
  {
    materiKeywords: ['rasio', 'proporsi', 'satuan', 'perbandingan', 'harga satuan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan informasi pembelian paket alat tulis di Koperasi Madrasah berikut!',
    stimulusText: 'Koperasi madrasah menjual 1 paket berisi 4 buah buku tulis dengan total harga Rp16.000,00. Hasan ingin membeli 7 buah buku tulis yang sama untuk perlengkapan belajarnya.',
    stem: 'Berdasarkan informasi di atas, rasio harga satuan untuk 1 buah buku tulis dan total uang yang harus dibayarkan Hasan untuk 7 buah buku adalah ...',
    options: [
      { label: 'A', text: 'Rp4.000,00 per buku dan total harga Rp28.000,00' },
      { label: 'B', text: 'Rp4.000,00 per buku dan total harga Rp24.000,00' },
      { label: 'C', text: 'Rp3.500,00 per buku dan total harga Rp24.500,00' },
      { label: 'D', text: 'Rp5.000,00 per buku dan total harga Rp35.000,00' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan masalah kontekstual pembelian barang dalam paket, peserta didik dapat menentukan rasio harga satuan dan menghitung proporsi harga barang.',
    ipk: 'Bernalar secara proporsional untuk menyelesaikan masalah sehari-hari dengan rasio satuan.',
    rubrik: 'Harga 1 buku = Rp16.000 : 4 = Rp4.000,00 (rasio satuan). Harga 7 buku = 7 × Rp4.000 = Rp28.000,00. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Mengembangkan penalaran proporsional yang cermat dalam transaksi ekonomi sehari-hari',
    isianQuestion: 'Jika 3 liter jus buah dapat disajikan untuk 12 gelas dengan porsi yang sama, maka rasio satuan untuk 1 liter jus adalah ... gelas.',
    isianAnswer: '4',
    esaiQuestion: 'Sebuah mobil travel madrasah membutuhkan 5 liter bensin untuk menempuh jarak 60 km.\na. Tentukan rasio satuan konsumsi bensin (jarak per 1 liter bensin)!\nb. Berapa liter bensin yang dibutuhkan mobil tersebut untuk menempuh perjalanan sejauh 180 km?',
    esaiAnswer: 'a. Rasio satuan = 60 km : 5 liter = 12 km per liter bensin.\nb. Bensin untuk 180 km = 180 : 12 = 15 liter bensin.',
    complexStatements: [
      '1. Rasio harga satuan untuk 1 buku tulis adalah Rp4.000,00.',
      '2. Harga untuk 2 buku tulis di koperasi adalah Rp8.000,00.',
      '3. Uang yang harus dibayarkan Hasan untuk 7 buku adalah Rp28.000,00.',
      '4. Semakin banyak buku yang dibeli, harga satuan per buku semakin mahal.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 0B. Pola Bilangan Membesar & Mengecil (Perkalian dan Pembagian)
  {
    materiKeywords: ['pola bilangan', 'pola', 'membesar', 'mengecil', 'nilai yang belum diketahui', 'kalimat matematika'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan susunan bilangan pada barisan pola berikut!',
    stimulusText: 'Siti menyusun deretan kartu bilangan yang mengikuti aturan pola bilangan tertentu: 3, 6, 12, 24, [ ... ], 96. Setiap bilangan diperoleh dengan mengalikan bilangan sebelumnya dengan bilangan yang sama.',
    stem: 'Nilai bilangan yang belum diketahui pada kotak kosong yang tepat untuk melengkapi pola bilangan membesar di atas adalah ...',
    options: [
      { label: 'A', text: '36' },
      { label: 'B', text: '48' },
      { label: 'C', text: '54' },
      { label: 'D', text: '72' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan barisan bilangan berpola perkalian yang rumpang, peserta didik dapat menemukan nilai yang belum diketahui untuk melengkapi pola membesar.',
    ipk: 'Mengidentifikasi, meniru, dan mengembangkan pola bilangan membesar yang melibatkan perkalian.',
    rubrik: 'Aturan pola: dikalikan 2 (3×2=6, 6×2=12, 12×2=24, 24×2=48, 48×2=96). Nilai kotak kosong = 48. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Mengasah kepekaan nalar melihat keteraturan dan keindahan pola bilangan',
    isianQuestion: 'Diberikan pola bilangan mengecil yang melibatkan pembagian: 160, 80, 40, [ ... ], 10. Bilangan yang belum diketahui pada pola tersebut adalah ...',
    isianAnswer: '20',
    esaiQuestion: 'Tentukan nilai n yang belum diketahui dalam kalimat matematika berikut:\na. 450 + n = 1.000\nb. (8 × n) : 4 = 16\nTuliskan langkah pengerjaan lengkapnya!',
    esaiAnswer: 'a. 450 + n = 1.000 => n = 1.000 - 450 = 550.\nb. (8 × n) : 4 = 16 => 8 × n = 16 × 4 = 64 => n = 64 : 8 = 8.',
    complexStatements: [
      '1. Aturan pola bilangan tersebut adalah setiap suku dikalikan 2.',
      '2. Bilangan setelah 24 adalah 48.',
      '3. Pola bilangan tersebut termasuk pola bilangan membesar.',
      '4. Selisih antara suku-suku pada barisan tersebut selalu bernilai sama.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 1. Nilai Tempat & Lambang Bilangan (Konteks Donasi Madrasah)
  {
    materiKeywords: ['bilangan', 'cacah', 'nilai tempat', 'ribuan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan data infaq pembangunan perpustakaan madrasah berikut!',
    stimulusText: 'Panitia penggalangan dana madrasah mencatat total sumbangan pada pekan pertama sebesar Rp48.725,00 dari para dermawan dan wali murid.',
    stem: 'Pada bilangan 48.725, angka 8 menempati nilai tempat ... dan mempunyai nilai sebesar ...',
    options: [
      { label: 'A', text: 'Ratusan dan nilainya 800' },
      { label: 'B', text: 'Ribuan dan nilainya 8.000' },
      { label: 'C', text: 'Puluhan ribu dan nilainya 80.000' },
      { label: 'D', text: 'Puluhan dan nilainya 80' }
    ],
    correct: 'B',
    cognitiveLevel: 'L1',
    indikator: 'Disajikan bilangan cacah lima angka, peserta didik dapat menentukan nilai tempat dan nilai angka ribuan.',
    ipk: 'Menentukan nilai tempat angka ribuan pada bilangan cacah hingga 50.000.',
    rubrik: 'Angka 8 berada pada posisi ribuan bernilai 8.000. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Ketelitian memahami hierarki nilai tempat bilangan',
    isianQuestion: 'Pada lambang bilangan 36.450, angka yang menempati nilai tempat ribuan adalah angka ...',
    isianAnswer: '6',
    esaiQuestion: 'Sebuah koperasi madrasah memiliki saldo kas sebesar Rp35.800,00.\na. Tuliskan nama bilangan dari jumlah uang tersebut dalam huruf!\nb. Tentukan nilai tempat dari masing-masing angka penyusun bilangan tersebut!',
    esaiAnswer: 'a. Tiga puluh lima ribu delapan ratus rupiah.\nb. 3 = puluh ribuan (30.000), 5 = ribuan (5.000), 8 = ratusan (800), 0 = puluhan (0), 0 = satuan (0).',
    complexStatements: [
      '1. Angka 4 pada bilangan 48.725 menempati nilai tempat puluh ribuan.',
      '2. Angka 8 pada bilangan 48.725 bernilai 8.000.',
      '3. Angka 7 menempati nilai tempat puluhan.',
      '4. Angka 5 menempati nilai tempat satuan.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (4) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (3) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (3) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 2. Membandingkan Bilangan Cacah (Stimulus Tabel Penduduk/Siswa)
  {
    materiKeywords: ['bilangan', 'cacah', 'membandingkan', 'mengurutkan'],
    stimulusType: 'tabel',
    stimulusTitle: 'Perhatikan tabel jumlah peserta didik MI di 4 kecamatan berikut!',
    stimulusTable: 'Kecamatan | Jumlah Siswa MI\nKecamatan Melati | 12.450 siswa\nKecamatan Mawar | 12.820 siswa\nKecamatan Cempaka | 11.970 siswa\nKecamatan Kenanga | 13.150 siswa',
    stem: 'Berdasarkan tabel di atas, urutan kecamatan dari jumlah peserta didik MI yang paling banyak ke paling sedikit adalah ...',
    options: [
      { label: 'A', text: 'Kenanga, Mawar, Melati, Cempaka' },
      { label: 'B', text: 'Cempaka, Melati, Mawar, Kenanga' },
      { label: 'C', text: 'Kenanga, Melati, Mawar, Cempaka' },
      { label: 'D', text: 'Mawar, Kenanga, Melati, Cempaka' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan tabel data bilangan cacah lima angka, peserta didik dapat mengurutkan bilangan dari nilai terbesar ke terkecil.',
    ipk: 'Mengurutkan bilangan cacah sampai puluhan ribu berdasarkan nilai tempat.',
    rubrik: '13.150 (Kenanga) > 12.820 (Mawar) > 12.450 (Melati) > 11.970 (Cempaka). Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Menganalisis dan menyusun data numerasi secara cermat dan teratur',
    isianQuestion: 'Bilangan 27.500 jika dibandingkan dengan bilangan 27.050 memiliki nilai yang lebih ...',
    isianAnswer: 'besar',
    esaiQuestion: 'Diberikan empat bilangan berikut: 15.620, 15.260, 15.602, dan 15.062.\nUrutkan bilangan-bilangan tersebut mulai dari yang terkecil hingga terbesar!',
    esaiAnswer: 'Urutan dari yang terkecil: 15.062, 15.260, 15.602, 15.620.',
    complexStatements: [
      '1. Kecamatan Kenanga memiliki jumlah peserta didik paling banyak.',
      '2. Jumlah siswa di Kecamatan Cempaka lebih sedikit daripada Kecamatan Melati.',
      '3. Selisih siswa Kecamatan Kenanga dan Cempaka adalah 1.180 siswa.',
      '4. Kecamatan Mawar memiliki siswa lebih sedikit daripada Melati.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 3. Operasi Hitung Campuran Belanja Koperasi (Stimulus Tabel Harga)
  {
    materiKeywords: ['operasi hitung', 'campuran', 'penjumlahan', 'perkalian'],
    stimulusType: 'tabel',
    stimulusTitle: 'Perhatikan daftar harga perlengkapan alat tulis di Koperasi Madrasah berikut!',
    stimulusTable: 'Nama Barang | Harga Satuan\nBuku Tulis Isi 38 | Rp4.000,00\nPensil 2B | Rp2.500,00\nPenghapus Karet | Rp1.500,00\nPenggaris 30 cm | Rp3.000,00',
    stem: 'Fatimah membeli 3 buku tulis dan 2 pensil di koperasi madrasah. Jika Fatimah membayar dengan selembar uang Rp20.000,00, maka uang kembalian yang diterima Fatimah adalah ...',
    options: [
      { label: 'A', text: 'Rp3.000,00' },
      { label: 'B', text: 'Rp4.000,00' },
      { label: 'C', text: 'Rp5.000,00' },
      { label: 'D', text: 'Rp6.000,00' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan tabel daftar harga barang, peserta didik dapat menghitung operasi campuran perkalian, penjumlahan, dan pengurangan uang kembalian.',
    ipk: 'Menyelesaikan masalah kontekstual transaksi jual beli menggunakan operasi hitung campuran.',
    rubrik: 'Belanja = (3 × 4.000) + (2 × 2.500) = 12.000 + 5.000 = 17.000. Kembalian = 20.000 - 17.000 = Rp3.000,00. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Kejujuran dan ketelitian dalam transaksi ekonomi di madrasah',
    isianQuestion: 'Hasil perhitungan dari 150 + 25 × 4 adalah ...',
    isianAnswer: '250',
    esaiQuestion: 'Dalam kegiatan bakti sosial, kelas 4 mengumpulkan 20 paket sembako. Setiap paket berisi 5 kg beras dan 2 liter minyak. Berapakah total kilogram beras dan liter minyak yang terkumpul?',
    esaiAnswer: 'Total beras = 20 × 5 = 100 kg beras.\nTotal minyak = 20 × 2 = 40 liter minyak.',
    complexStatements: [
      '1. Total harga 3 buku tulis adalah Rp12.000,00.',
      '2. Total harga 2 pensil adalah Rp5.000,00.',
      '3. Uang kembalian yang diterima adalah Rp3.000,00.',
      '4. Total seluruh harga belanjaan Fatimah adalah Rp18.000,00.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 4. Pembagian & Perkalian Hasil Panen Kebun Madrasah
  {
    materiKeywords: ['perkalian', 'pembagian', 'cacah', 'operasi'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan narasi kegiatan panen kebun hidroponik madrasah berikut!',
    stimulusText: 'Siswa kelompok tani cilik madrasah memanen 240 ikat sawi hijau dari instalasi hidroponik. Seluruh sawi tersebut dikemas ke dalam 12 keranjang dengan jumlah yang sama banyak.',
    stem: 'Jika setiap keranjang berisi sawi dijual dengan harga Rp35.000,00 per keranjang, maka total uang yang diperoleh madrasah dari penjualan seluruh sawi adalah ...',
    options: [
      { label: 'A', text: 'Rp350.000,00' },
      { label: 'B', text: 'Rp420.000,00' },
      { label: 'C', text: 'Rp480.000,00' },
      { label: 'D', text: 'Rp520.000,00' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan cerita tentang hasil panen yang dikemas dalam wadah, peserta didik dapat menyelesaikan operasi pembagian dan perkalian kontekstual.',
    ipk: 'Menyelesaikan soal cerita gabungan pembagian dan perkalian bilangan cacah.',
    rubrik: 'Ada 12 keranjang. Total uang = 12 × Rp35.000,00 = Rp420.000,00. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_lingkungan',
    kbcDesc: 'Menyayangi alam dan memanfaatkan lahan madrasah untuk penghijauan produktif',
    isianQuestion: 'Sebanyak 180 buah jeruk dimasukkan ke dalam 9 kantong plastik sama rata. Setiap kantong berisi ... buah jeruk.',
    isianAnswer: '20',
    esaiQuestion: 'Pak Hasan memiliki 4 kandang ayam. Setiap kandang menghasilkan 45 butir telur setiap hari. Telur-telur tersebut dikemas ke dalam kotak berisi 10 butir telur.\na. Berapa butir telur yang dihasilkan seluruh kandang dalam satu hari?\nb. Berapa kotak telur yang dapat dikemas setiap hari?',
    esaiAnswer: 'a. Total telur per hari = 4 × 45 = 180 butir telur.\nb. Jumlah kotak = 180 : 10 = 18 kotak telur.',
    complexStatements: [
      '1. Setiap keranjang berisi 20 ikat sawi (240 : 12 = 20).',
      '2. Total pendapatan dari 12 keranjang adalah Rp420.000,00.',
      '3. Harga satu keranjang adalah Rp35.000,00.',
      '4. Total sawi yang dipanen kurang dari 200 ikat.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 5. FPB & Pembagian Paket Sembako Yatim Piatu
  {
    materiKeywords: ['fpb', 'kpk', 'faktor', 'kelipatan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kegiatan santunan anak yatim di Madrasah Ibtidaiyah berikut!',
    stimulusText: 'Dalam rangka peringatan Tahun Baru Islam 1 Muharram, panitia madrasah menyiapkan 36 buku tulis dan 48 pensil untuk disumbangkan. Setiap paket santunan berisi buku tulis dan pensil dalam jumlah sama banyak tanpa ada yang tersisa.',
    stem: 'Jumlah anak yatim terbanyak yang dapat menerima paket bantuan alat tulis tersebut adalah ...',
    options: [
      { label: 'A', text: '6 anak' },
      { label: 'B', text: '8 anak' },
      { label: 'C', text: '12 anak' },
      { label: 'D', text: '24 anak' }
    ],
    correct: 'C',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan masalah kontekstual pembagian barang ke anak yatim, peserta didik dapat menentukan FPB dari dua bilangan.',
    ipk: 'Menyelesaikan masalah kontekstual pembagian sama banyak menggunakan konsep FPB.',
    rubrik: 'FPB dari 36 dan 48 adalah 12. Pilihan C bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Peduli dan berbagi dengan adil kepada sesama anak yatim di lingkungan sekitar',
    isianQuestion: 'Faktor Persekutuan Terbesar (FPB) dari bilangan 24 dan 36 adalah ...',
    isianAnswer: '12',
    esaiQuestion: 'Lampu merah menyala setiap 6 detik sekali, sedangkan lampu hijau menyala setiap 8 detik sekali. Jika kedua lampu menyala bersamaan pada pukul 08.00, pada detik ke berapa kedua lampu tersebut akan menyala bersamaan kembali?',
    esaiAnswer: 'KPK dari 6 dan 8:\nKelipatan 6: 6, 12, 18, 24, 30...\nKelipatan 8: 8, 16, 24, 32...\nKPK = 24. Kedua lampu menyala bersamaan kembali pada detik ke-24 (pukul 08.00 lebih 24 detik).',
    complexStatements: [
      '1. FPB dari 36 dan 48 adalah 12.',
      '2. Setiap anak akan menerima 3 buku tulis dan 4 pensil.',
      '3. KPK dari 36 dan 48 adalah 144.',
      '4. Jumlah pensil yang diterima setiap anak lebih sedikit daripada jumlah buku.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 6. KPK Jadwal Latihan Ekstrakurikuler Madrasah
  {
    materiKeywords: ['kpk', 'jadwal', 'kelipatan', 'persekutuan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan jadwal kegiatan ekstrakurikuler madrasah berikut!',
    stimulusText: 'Regu Hadrah madrasah berlatih rutin setiap 4 hari sekali, sedangkan regu Pramuka berlatih setiap 6 hari sekali di aula madrasah. Pada hari Senin tanggal 2 Mei, kedua regu berlatih bersamaan untuk pertama kalinya.',
    stem: 'Kedua regu ekstrakurikuler tersebut akan berlatih bersamaan kembali untuk kedua kalinya setelah ... hari kemudian.',
    options: [
      { label: 'A', text: '8 hari' },
      { label: 'B', text: '10 hari' },
      { label: 'C', text: '12 hari' },
      { label: 'D', text: '24 hari' }
    ],
    correct: 'C',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan cerita tentang dua kegiatan rutin dengan periode berbeda, peserta didik dapat menentukan waktu pertemuan bersama menggunakan KPK.',
    ipk: 'Menyelesaikan masalah kontekstual penjadwalan berulang menggunakan konsep KPK.',
    rubrik: 'KPK dari 4 dan 6 adalah 12. Pilihan C bernilai skor maksimal.',
    kbcPillar: 'cinta_disiplin',
    kbcDesc: 'Menjaga komitmen jadwal dan kedisiplinan berlatih untuk meraih prestasi',
    isianQuestion: 'Kelipatan Persekutuan Terkecil (KPK) dari bilangan 6 dan 9 adalah ...',
    isianAnswer: '18',
    esaiQuestion: 'Ali mengunjungi perpustakaan madrasah setiap 3 hari sekali, sedangkan Budi setiap 5 hari sekali. Jika mereka bertemu di perpustakaan pada hari Selasa, pada hari apa dan berapa hari lagikah mereka akan bertemu kembali?',
    esaiAnswer: 'KPK dari 3 dan 5 adalah 15. Mereka akan bertemu kembali 15 hari lagi. Selasa + 15 hari (2 minggu + 1 hari) = hari Rabu.',
    complexStatements: [
      '1. Kelipatan bilangan 4 adalah 4, 8, 12, 16, 20, 24...',
      '2. Kelipatan bilangan 6 adalah 6, 12, 18, 24, 30...',
      '3. KPK dari 4 dan 6 adalah 12.',
      '4. Kedua regu akan bertemu kembali setelah 24 hari saja.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 7. Pecahan Pengurangan Bahan Makanan Jumat Berkah
  {
    materiKeywords: ['pecahan', 'senilai', 'penjumlahan pecahan', 'pengurangan pecahan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan narasi kegiatan Jumat Berkah di kantin madrasah berikut!',
    stimulusText: 'Ibu kantin menyiapkan 3/4 kg tepung terigu untuk membuat kue bolu santunan Jumat Berkah. Sebanyak 1/2 kg telah digunakan untuk adonan pertama.',
    stem: 'Sisa tepung terigu yang masih dimiliki ibu kantin madrasah adalah ...',
    options: [
      { label: 'A', text: '1/4 kg' },
      { label: 'B', text: '2/4 kg' },
      { label: 'C', text: '1/2 kg' },
      { label: 'D', text: '2/6 kg' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan soal cerita pengurangan pecahan beda penyebut, peserta didik dapat menentukan sisa bahan dengan tepat.',
    ipk: 'Menyelesaikan pengurangan pecahan dengan menyamakan penyebut.',
    rubrik: '3/4 - 1/2 = 3/4 - 2/4 = 1/4 kg. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Sedekah makanan jumat berkah dengan hati penuh kasih sayang',
    isianQuestion: 'Bentuk paling sederhana dari pecahan 12/16 adalah ...',
    isianAnswer: '3/4',
    esaiQuestion: 'Pak Ahmad memiliki sebidang tanah wakaf. Sebanyak 2/5 bagian tanah dibangun musholla, 1/3 bagian dijadikan kebun sayur madrasah, dan sisanya dijadikan lapangan olahraga.\na. Berapakah bagian tanah yang digunakan untuk musholla dan kebun sayur?\nb. Berapakah bagian tanah yang tersisa untuk lapangan olahraga?',
    esaiAnswer: 'a. 2/5 + 1/3 = 6/15 + 5/15 = 11/15 bagian.\nb. Sisa = 1 - 11/15 = 4/15 bagian untuk lapangan olahraga.',
    complexStatements: [
      '1. Pecahan 1/2 senilai dengan 2/4.',
      '2. Selisih 3/4 dan 1/2 adalah 1/4.',
      '3. Pecahan 3/4 lebih besar daripada 1/2.',
      '4. Pecahan 1/4 lebih besar daripada 1/2.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 8. Visual Pecahan Lingkaran (Diagram Svg math_fraction_3_4)
  {
    materiKeywords: ['pecahan', 'biasa', 'lingkaran', 'arsir'],
    stimulusType: 'gambar',
    stimulusSvg: 'math_fraction_3_4',
    stimulusTitle: 'Perhatikan gambar pembagian kue tart berbentuk lingkaran berikut!',
    stem: 'Sebuah kue tart dipotong menjadi 4 bagian yang sama besar. Sebanyak 3 bagian kue telah dimakan seperti tampak pada bagian berarsir. Nilai pecahan dari bagian kue yang telah dimakan adalah ...',
    options: [
      { label: 'A', text: '1/4 bagian' },
      { label: 'B', text: '2/4 bagian' },
      { label: 'C', text: '3/4 bagian' },
      { label: 'D', text: '4/4 bagian' }
    ],
    correct: 'C',
    cognitiveLevel: 'L1',
    indikator: 'Disajikan gambar lingkaran berarsir 3/4, peserta didik dapat menentukan nilai pecahan biasa secara tepat.',
    ipk: 'Mengidentifikasi nilai pecahan biasa dari model visual luas daerah konkret.',
    rubrik: 'Bagian berarsir adalah 3 dari 4 bagian = 3/4. Pilihan C bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Berbagi rezeki makanan secara adil kepada sesama teman',
    isianQuestion: 'Pada pecahan 3/4, angka 3 dinamakan pembilang sedangkan angka 4 dinamakan ...',
    isianAnswer: 'penyebut',
    esaiQuestion: 'Gambarkan dan jelaskan sebuah lingkaran yang dibagi menjadi 6 bagian yang sama besar, lalu arsirlah 4 bagian di antaranya untuk menunjukkan pecahan 4/6!',
    esaiAnswer: 'Lingkaran dibagi menjadi 6 juring sama besar. Empat juring diwarnai/diarsir mewakili pecahan 4/6 atau senilai dengan 2/3.',
    complexStatements: [
      '1. Gambar menunjukkan 3 bagian berarsir dari 4 bagian keseluruhan.',
      '2. Nilai pecahan daerah berarsir adalah 3/4.',
      '3. Bagian yang tidak berarsir bernilai 1/4.',
      '4. Daerah berarsir bernilai lebih kecil daripada daerah tidak berarsir.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 9. Geometri Luas Segitiga Siku-siku (Diagram Svg math_triangle_right)
  {
    materiKeywords: ['geometri', 'bangun datar', 'segitiga', 'luas', 'alas', 'tinggi'],
    stimulusType: 'gambar',
    stimulusSvg: 'math_triangle_right',
    stimulusTitle: 'Perhatikan gambar taman madrasah berbentuk segitiga siku-siku ABC berikut!',
    stem: 'Pada gambar segitiga siku-siku ABC di atas, panjang sisi alas AB = 12 m dan tinggi AC = 9 m. Luas taman madrasah tersebut adalah ...',
    options: [
      { label: 'A', text: '54 m²' },
      { label: 'B', text: '108 m²' },
      { label: 'C', text: '21 m²' },
      { label: 'D', text: '42 m²' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan gambar segitiga siku-siku berukuran alas 12 m dan tinggi 9 m, peserta didik dapat menghitung luas daerah segitiga.',
    ipk: 'Menghitung luas daerah segitiga siku-siku menggunakan rumus L = (alas × tinggi) : 2.',
    rubrik: 'L = (12 × 9) / 2 = 108 / 2 = 54 m². Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_lingkungan',
    kbcDesc: 'Menjaga kebersihan dan keindahan taman hijau madrasah',
    isianQuestion: 'Rumus untuk menghitung luas bangun segitiga adalah (alas × tinggi) dibagi ...',
    isianAnswer: '2',
    esaiQuestion: 'Sebuah taman bunga madrasah berbentuk segitiga dengan panjang alas 16 meter dan tinggi 10 meter. Hitunglah luas seluruh taman bunga tersebut!',
    esaiAnswer: 'Luas segitiga = (alas × tinggi) : 2 = (16 × 10) : 2 = 160 : 2 = 80 m².',
    complexStatements: [
      '1. Luas segitiga dihitung dengan rumus 1/2 × alas × tinggi.',
      '2. Segitiga dengan alas 12 m dan tinggi 9 m memiliki luas 54 m².',
      '3. Perkalian alas dan tinggi segitiga tersebut menghasilkan 108.',
      '4. Luas segitiga tersebut adalah 108 m².'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 10. Geometri Keliling Persegi Panjang (Diagram Svg math_rectangle)
  {
    materiKeywords: ['geometri', 'keliling', 'persegi panjang', 'bangun datar'],
    stimulusType: 'gambar',
    stimulusSvg: 'math_rectangle',
    stimulusTitle: 'Perhatikan gambar papan tulis kelas berukuran panjang 15 cm dan lebar 8 cm berikut!',
    stem: 'Pak Guru mengukur sebidang papan tulis berukuran panjang 15 cm dan lebar 8 cm seperti pada gambar di atas. Keliling dari papan tulis tersebut adalah ...',
    options: [
      { label: 'A', text: '23 cm' },
      { label: 'B', text: '46 cm' },
      { label: 'C', text: '120 cm' },
      { label: 'D', text: '60 cm' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan gambar bangun persegi panjang p=15 cm dan l=8 cm, peserta didik dapat menghitung keliling bangun datar tersebut.',
    ipk: 'Menghitung keliling persegi panjang dengan rumus K = 2 × (p + l).',
    rubrik: 'K = 2 × (15 + 8) = 2 × 23 = 46 cm. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Menghargai ketepatan pengukuran dalam kehidupan sehari-hari',
    isianQuestion: 'Rumus untuk menghitung keliling persegi panjang adalah 2 × (... + ...).',
    isianAnswer: 'panjang + lebar',
    esaiQuestion: 'Sebuah lapangan serbaguna madrasah berukuran panjang 15 meter dan lebar 8 meter.\na. Hitunglah keliling lapangan tersebut!\nb. Hitunglah luas lapangan tersebut!',
    esaiAnswer: 'a. Keliling = 2 × (p + l) = 2 × (15 + 8) = 2 × 23 = 46 meter.\nb. Luas = p × l = 15 × 8 = 120 m².',
    complexStatements: [
      '1. Panjang persegi panjang adalah 15 cm dan lebarnya 8 cm.',
      '2. Jumlah panjang dan lebar persegi panjang adalah 23 cm.',
      '3. Keliling persegi panjang adalah 46 cm.',
      '4. Luas persegi panjang adalah 46 cm².'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 11. Pengukuran Waktu & Sudut Jam Analog (Diagram Svg math_clock_0715)
  {
    materiKeywords: ['pengukuran', 'sudut', 'waktu', 'jam'],
    stimulusType: 'gambar',
    stimulusSvg: 'math_clock_0715',
    stimulusTitle: 'Perhatikan jam analog dinding ruang kelas madrasah berikut!',
    stem: 'Ahmad tiba di madrasah pada waktu yang ditunjukkan oleh jam dinding di atas. Waktu kedatangan Ahmad dan jenis sudut terkecil yang dibentuk kedua jarum jam tersebut adalah ...',
    options: [
      { label: 'A', text: 'Pukul 07.15 dan membentuk sudut lancip' },
      { label: 'B', text: 'Pukul 07.15 dan membentuk sudut tumpul' },
      { label: 'C', text: 'Pukul 03.35 dan membentuk sudut siku-siku' },
      { label: 'D', text: 'Pukul 08.15 dan membentuk sudut lurus' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan gambar jam analog menunjukkan pukul 07.15, peserta didik dapat menentukan waktu dan mengidentifikasi jenis sudut yang terbentuk.',
    ipk: 'Mengidentifikasi jenis sudut tumpul pada jarum jam analog waktu tertentu.',
    rubrik: 'Pukul 07.15 jarum jam dan menit membentuk sudut lebih dari 90° (sudut tumpul). Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_disiplin',
    kbcDesc: 'Menghargai waktu dan membiasakan datang ke madrasah tepat waktu',
    isianQuestion: 'Sudut yang besarnya tepat 90 derajat dinamakan sudut ...',
    isianAnswer: 'siku-siku',
    esaiQuestion: 'Sebutkan 3 (tiga) jenis sudut berdasarkan besar derajatnya serta berikan contoh besar sudut masing-masing!',
    esaiAnswer: '1. Sudut Lancip: besarnya antara 0° dan kurang dari 90° (misal 45°).\n2. Sudut Siku-siku: besarnya tepat 90°.\n3. Sudut Tumpul: besarnya antara lebih dari 90° dan kurang dari 180° (misal 120°).',
    complexStatements: [
      '1. Jam analog menunjukkan waktu pukul 07.15.',
      '2. Sudut terkecil antara jarum jam dan menit lebih besar dari 90 derajat.',
      '3. Jenis sudut yang dibentuk adalah sudut tumpul.',
      '4. Sudut yang dibentuk tepat sebesar 90 derajat (siku-siku).'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 12. Penyajian & Analisis Data Diagram Batang (Diagram Svg math_bar_chart)
  {
    materiKeywords: ['diagram', 'data', 'batang', 'analisis', 'penjualan'],
    stimulusType: 'gambar',
    stimulusSvg: 'math_bar_chart',
    stimulusTitle: 'Perhatikan diagram batang penjualan buku koperasi siswa madrasah berikut!',
    stem: 'Berdasarkan diagram batang di atas, selisih penjualan buku tulis paling banyak (hari Kamis: 40) dan paling sedikit (hari Jumat: 20) di koperasi madrasah adalah ...',
    options: [
      { label: 'A', text: '15 buku' },
      { label: 'B', text: '20 buku' },
      { label: 'C', text: '25 buku' },
      { label: 'D', text: '30 buku' }
    ],
    correct: 'B',
    cognitiveLevel: 'L3',
    indikator: 'Disajikan diagram batang data penjualan, peserta didik dapat menganalisis dan menghitung selisih nilai tertinggi dan terendah.',
    ipk: 'Menginterpretasikan data dalam bentuk diagram batang dan menghitung selisihnya.',
    rubrik: 'Selisih = 40 (Kamis) - 20 (Jumat) = 20 buku. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Menumbuhkan kejujuran dan kerja sama dalam berniaga koperasi siswa',
    isianQuestion: 'Pada diagram batang di atas, hari dengan penjualan buku tulis terbanyak adalah hari ...',
    isianAnswer: 'Kamis',
    esaiQuestion: 'Berdasarkan diagram batang penjualan buku koperasi madrasah di atas:\na. Tentukan jumlah penjualan buku pada hari Senin dan Selasa!\nb. Berapakah rata-rata penjualan buku selama 5 hari tersebut jika total buku terjual adalah 150 buku?',
    esaiAnswer: 'a. Hari Senin = 30 buku, Hari Selasa = 25 buku. Jumlah = 55 buku.\nb. Rata-rata = 150 : 5 = 30 buku per hari.',
    complexStatements: [
      '1. Penjualan buku terbanyak terjadi pada hari Kamis (40 buku).',
      '2. Penjualan buku paling sedikit terjadi pada hari Jumat (20 buku).',
      '3. Selisih penjualan hari Kamis dan Jumat adalah 20 buku.',
      '4. Hari Senin dan Jumat memiliki jumlah penjualan buku yang sama.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 13. Bangun Ruang Balok 3D (Diagram Svg math_cuboid_3d)
  {
    materiKeywords: ['bangun ruang', 'balok', 'volume', 'rusuk', 'geometri'],
    stimulusType: 'gambar',
    stimulusSvg: 'math_cuboid_3d',
    stimulusTitle: 'Perhatikan gambar wadah kapur tulis berbentuk balok 3D berikut!',
    stem: 'Sebuah kotak wadah kapur tulis di kelas berbentuk balok dengan panjang 10 cm, lebar 6 cm, dan tinggi 4 cm seperti pada gambar. Volume balok tersebut adalah ...',
    options: [
      { label: 'A', text: '240 cm³' },
      { label: 'B', text: '120 cm³' },
      { label: 'C', text: '80 cm³' },
      { label: 'D', text: '480 cm³' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan gambar balok berdimensi p=10 cm, l=6 cm, dan t=4 cm, peserta didik dapat menghitung volume balok.',
    ipk: 'Menghitung volume bangun ruang balok dengan rumus V = p × l × t.',
    rubrik: 'V = 10 × 6 × 4 = 240 cm³. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Memahami ruang dan dimensi ciptaan Tuhan',
    isianQuestion: 'Banyaknya titik sudut pada sebuah bangun ruang balok adalah sebanyak ... buah.',
    isianAnswer: '8',
    esaiQuestion: 'Sebuah tempat penampungan air wudhu madrasah berbentuk balok memiliki ukuran panjang 120 cm, lebar 80 cm, dan kedalaman (tinggi) 50 cm. Berapakah volume air maksimal yang dapat ditampung dalam satuan liter? (1 liter = 1.000 cm³)',
    esaiAnswer: 'Volume = p × l × t = 120 × 80 × 50 = 480.000 cm³.\nDalam liter = 480.000 : 1.000 = 480 liter air.',
    complexStatements: [
      '1. Rumus volume balok adalah panjang × lebar × tinggi.',
      '2. Kotak dengan ukuran 10 × 6 × 4 memiliki volume 240 cm³.',
      '3. Luas permukaan alas balok adalah 60 cm².',
      '4. Balok memiliki 12 titik sudut dan 8 rusuk.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 14. Pola Bilangan / Barisan Kursi Aula Madrasah
  {
    materiKeywords: ['pola bilangan', 'barisan', 'deret', 'keteraturan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan susunan kursi di aula madrasah saat peringatan Maulid Nabi berikut!',
    stimulusText: 'Panitia menyusun kursi hadirin dalam barisan yang teratur: baris pertama berisi 14 kursi, baris kedua berisi 18 kursi, baris ketiga berisi 22 kursi, dan baris keempat berisi 26 kursi.',
    stem: 'Berdasarkan pola barisan keteraturan kursi di atas, banyaknya kursi yang berada pada baris ke-6 adalah ...',
    options: [
      { label: 'A', text: '30 kursi' },
      { label: 'B', text: '34 kursi' },
      { label: 'C', text: '38 kursi' },
      { label: 'D', text: '42 kursi' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan pola bilangan konfigurasi barisan kursi bertambah tetap, peserta didik dapat menentukan suku ke-6.',
    ipk: 'Mengidentifikasi dan melanjutkan pola bilangan bertambah tetap.',
    rubrik: 'Pola bertambah 4: Baris 1 = 14, Baris 2 = 18, Baris 3 = 22, Baris 4 = 26, Baris 5 = 30, Baris 6 = 34 kursi. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Menemukan keindahan keteraturan pola matematis dalam alam semesta',
    isianQuestion: 'Diberikan barisan bilangan 5, 11, 17, 23, ... Angka berikutnya pada barisan tersebut adalah ...',
    isianAnswer: '29',
    esaiQuestion: 'Faris mulai gemar menabung di celengan madrasah. Hari Senin ia menabung Rp2.000,00, hari Selasa Rp4.000,00, hari Rabu Rp6.000,00, dan seterusnya selalu bertambah Rp2.000,00 setiap hari.\na. Berapa rupiah yang ditabung Faris pada hari Sabtu?\nb. Berapa total uang tabungan Faris dari hari Senin sampai Sabtu?',
    esaiAnswer: 'a. Hari Sabtu (hari ke-6) = 6 × Rp2.000,00 = Rp12.000,00.\nb. Total tabungan = 2.000 + 4.000 + 6.000 + 8.000 + 10.000 + 12.000 = Rp42.000,00.',
    complexStatements: [
      '1. Setiap baris berikutnya selalu bertambah 4 kursi.',
      '2. Baris ke-5 berisi 30 kursi.',
      '3. Baris ke-6 berisi 34 kursi.',
      '4. Selisih kursi antara baris ke-1 dan ke-3 adalah 10 kursi.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 15. Satuan Pengukuran Berat Bahan Makanan (Stimulus Tabel Dapur Madrasah)
  {
    materiKeywords: ['pengukuran', 'berat', 'kilogram', 'gram', 'satuan'],
    stimulusType: 'tabel',
    stimulusTitle: 'Perhatikan tabel belanja bahan pembuatan bubur Asyura madrasah berikut!',
    stimulusTable: 'Bahan Makanan | Berat / Massa Belanjaan\nBeras Pulen | 3 kg\nKacang Hijau | 500 gram\nGula Pasir | 1,5 kg\nGaram Halus | 200 gram',
    stem: 'Berdasarkan tabel di atas, total berat bahan makanan beras pulen dan kacang hijau jika dinyatakan dalam satuan gram adalah ...',
    options: [
      { label: 'A', text: '3.200 gram' },
      { label: 'B', text: '3.500 gram' },
      { label: 'C', text: '4.500 gram' },
      { label: 'D', text: '5.000 gram' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan tabel belanja dengan satuan kg dan gram, peserta didik dapat mengonversi dan menjumlahkan berat benda ke satuan gram.',
    ipk: 'Mengonversi dan menyelesaikan perhitungan satuan massa (kg ke gram).',
    rubrik: '3 kg = 3.000 gram. Beras + Kacang hijau = 3.000 + 500 = 3.500 gram. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Menggunakan ketepatan standar pengukuran demi keadilan timbangan',
    isianQuestion: 'Berat 1 kilogram setara dengan ... gram.',
    isianAnswer: '1.000',
    esaiQuestion: 'Ibu membeli 2,5 kg telur ayam di pasar. Di perjalanan, sebanyak 500 gram telur pecah. Berapa kilogram telur ayam ibu yang masih utuh tersisa?',
    esaiAnswer: '2,5 kg = 2.500 gram. Sisa = 2.500 - 500 = 2.000 gram = 2 kg telur utuh.',
    complexStatements: [
      '1. Berat 1 kg setara dengan 1.000 gram.',
      '2. Beras pulen 3 kg sama dengan 3.000 gram.',
      '3. Total berat beras dan kacang hijau adalah 3.500 gram.',
      '4. Berat kacang hijau lebih besar daripada beras pulen.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 16. Rasio Satuan & Proporsi (Belanja Alat Tulis Koperasi Madrasah)
  {
    materiKeywords: ['rasio', 'proporsi', 'perbandingan', 'rasio satuan', 'aljabar', 'satuan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kegiatan belanja perlengkapan belajar di Koperasi Madrasah berikut!',
    stimulusText: 'Faris membeli 1 pak buku tulis berisi 5 buku dengan harga Rp20.000,00 di koperasi madrasah. Di hari yang sama, Aminah ingin membeli 8 buku tulis dengan jenis yang sama persis untuk kebutuhan belajarnya.',
    stem: 'Berdasarkan rasio satuan harga per buku di koperasi tersebut, jumlah uang yang harus dibayarkan Aminah untuk membeli 8 buku tulis adalah ...',
    options: [
      { label: 'A', text: 'Rp28.000,00' },
      { label: 'B', text: 'Rp32.000,00' },
      { label: 'C', text: 'Rp36.000,00' },
      { label: 'D', text: 'Rp40.000,00' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan narasi pembelian barang dengan harga per paket, peserta didik dapat menentukan rasio satuan dan menghitung nilai proporsi senilai.',
    ipk: 'Bernalar secara proporsional untuk menyelesaikan masalah sehari-hari dengan rasio satuan dan proporsi.',
    rubrik: 'Rasio satuan = Rp20.000,00 : 5 buku = Rp4.000,00 per buku. Harga 8 buku = 8 × Rp4.000,00 = Rp32.000,00. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Menggunakan perhitungan rasio satuan secara jujur dan adil dalam muamalah jual beli',
    isianQuestion: 'Harga 4 buah pensil di koperasi madrasah adalah Rp10.000,00. Rasio satuan harga untuk 1 buah pensil adalah ...',
    isianAnswer: 'Rp2.500,00',
    esaiQuestion: 'Sebuah kendaraan jemputan santri madrasah menempuh jarak 75 km dengan menghabiskan 5 liter bensin.\na. Tentukan rasio satuan konsumsi bensin (jarak yang ditempuh per 1 liter bensin)!\nb. Jika kendaraan tersebut harus mengantar santri pada kegiatan studi tur sejauh 180 km, berapa liter bensin yang dibutuhkan?',
    esaiAnswer: 'a. Rasio satuan = 75 km : 5 liter = 15 km/liter.\nb. Kebutuhan bensin untuk 180 km = 180 km : 15 km/liter = 12 liter bensin.',
    complexStatements: [
      '1. Rasio satuan harga satu buah buku tulis adalah Rp4.000,00.',
      '2. Harga 3 buah buku tulis adalah Rp12.000,00.',
      '3. Uang Rp32.000,00 cukup untuk membeli 8 buah buku tulis.',
      '4. Semakin banyak buku yang dibeli, harga satuan per buku semakin mahal.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },

  // 17. Kalimat Matematika & Nilai Belum Diketahui (Aljabar Dasar Fase C)
  {
    materiKeywords: ['kalimat matematika', 'nilai yang belum diketahui', 'aljabar', 'variabel', 'persamaan', 'cacah'],
    stimulusType: 'tabel',
    stimulusTitle: 'Perhatikan data pengumpulan paket sembako bakti sosial santri berikut!',
    stimulusTable: 'Kelompok Santri | Jumlah Anggota | Total Berat Beras\nKelompok Abu Bakar | 15 orang | 450 kg\nKelompok Umar | 12 orang | 360 kg\nKelompok Utsman | n orang | 600 kg',
    stem: 'Setiap santri membawa beras dengan berat yang sama (rasio satuan 30 kg per santri). Nilai n yang belum diketahui pada kalimat matematika n × 30 kg = 600 kg untuk Kelompok Utsman adalah ...',
    options: [
      { label: 'A', text: '18 orang' },
      { label: 'B', text: '20 orang' },
      { label: 'C', text: '22 orang' },
      { label: 'D', text: '25 orang' }
    ],
    correct: 'B',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan tabel data berproporsi tetap, peserta didik dapat menemukan nilai yang belum diketahui dalam kalimat matematika perkalian bilangan cacah.',
    ipk: 'Menemukan nilai yang belum diketahui dalam kalimat matematika perkalian bilangan cacah.',
    rubrik: 'Kalimat matematika: n × 30 = 600. Nilai n = 600 : 30 = 20. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Bekerja sama secara gotong royong dan proporsional dalam kegiatan bakti sosial',
    isianQuestion: 'Pada kalimat matematika 15 × ... = 450, bilangan yang tepat untuk mengisi titik-titik adalah ...',
    isianAnswer: '30',
    esaiQuestion: 'Pak Ustadz menyiapkan 240 buku juz amma untuk dibagikan sama banyak kepada p santri di kelas tahfidz. Setiap santri menerima tepat 8 buku juz amma.\na. Tuliskan bentuk kalimat matematika pembagian yang sesuai!\nb. Tentukan nilai p (banyaknya santri yang menerima buku)!',
    esaiAnswer: 'a. Kalimat matematika: 240 : p = 8 (atau 8 × p = 240).\nb. Nilai p = 240 : 8 = 30 orang santri.',
    complexStatements: [
      '1. Rasio satuan berat beras per santri pada kelompok Abu Bakar adalah 30 kg.',
      '2. Rasio satuan berat beras per santri pada kelompok Umar adalah 30 kg.',
      '3. Nilai n pada kelompok Utsman adalah 20 orang santri.',
      '4. Total santri kelompok Utsman lebih sedikit daripada kelompok Abu Bakar.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

const AUTHENTIC_FIQIH_POOL: TopicQuestionData[] = [
  {
    materiKeywords: ['wudhu', 'thaharah', 'bersuci', 'hadats'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan tata cara bersuci sebelum ibadah shalat berikut!',
    stimulusText: 'Sebelum melaksanakan ibadah shalat, setiap muslim diwajibkan bersuci dari hadats kecil dengan cara berwudhu secara tertib.',
    stem: 'Anggota badan yang wajib dibasuh setelah membasuh kedua tangan sampai siku secara tertib adalah ...',
    options: [
      { label: 'A', text: 'Membasuh kedua kaki hingga mata kaki' },
      { label: 'B', text: 'Mengusap sebagian rambut atau kepala' },
      { label: 'C', text: 'Berkumur-kumur dan membersihkan hidung' },
      { label: 'D', text: 'Membasuh kedua daun telinga' }
    ],
    correct: 'B',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat menentukan urutan rukun wudhu secara tertib.',
    ipk: 'Mengidentifikasi rukun wudhu secara runtut dan benar.',
    rubrik: 'Setelah membasuh kedua tangan sampai siku, rukun berikutnya adalah mengusap sebagian kepala. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDesc: 'Menjaga kesucian jasmani dan ruhani demi menghadap Allah SWT',
    isianQuestion: 'Berkumur-kumur dan membasuh daun telinga dalam berwudhu hukumnya adalah ...',
    isianAnswer: 'Sunnah',
    esaiQuestion: 'Jelaskan secara berurutan 6 (enam) rukun wudhu yang wajib dipenuhi agar wudhu menjadi sah!',
    esaiAnswer: '1. Niat bersamaan membasuh muka.\n2. Membasuh muka secara merata.\n3. Membasuh kedua tangan sampai siku.\n4. Mengusap sebagian kepala/rambut.\n5. Membasuh kedua telapak kaki sampai mata kaki.\n6. Tertib (berurutan).',
    complexStatements: [
      '1. Niat berwudhu dilakukan bersamaan saat membasuh muka.',
      '2. Membasuh tangan sampai siku merupakan rukun wudhu.',
      '3. Membasuh telinga merupakan sunnah wudhu.',
      '4. Makan dan minum membatalkan wudhu secara langsung.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['shalat', 'fardhu', 'berjamaah', 'imam'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan keutamaan shalat berjamaah berikut!',
    stimulusText: 'Rasulullah SAW sangat menganjurkan umat Islam untuk senantiasa mendirikan shalat fardhu secara berjamaah di masjid.',
    stem: 'Keutamaan melaksanakan shalat fardhu secara berjamaah di masjid dibandingkan dengan shalat munfarid (sendirian) adalah mendapatkan pahala sebanyak ...',
    options: [
      { label: 'A', text: '7 derajat' },
      { label: 'B', text: '17 derajat' },
      { label: 'C', text: '27 derajat' },
      { label: 'D', text: '70 derajat' }
    ],
    correct: 'C',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat menyebutkan keutamaan pahala shalat fardhu berjamaah.',
    ipk: 'Menjelaskan fadhilah dan hikmah pelaksanaan shalat berjamaah.',
    rubrik: 'Hadits shahih menyebutkan shalat berjamaah lebih utama 27 derajat. Pilihan C bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Membangun ukhuwah islamiyah dan persatuan dalam shalat berjamaah',
    isianQuestion: 'Orang yang memimpin shalat berjamaah dinamakan imam, sedangkan orang yang mengikutinya di belakang dinamakan ...',
    isianAnswer: 'Makmum',
    esaiQuestion: 'Sebutkan 3 (tiga) syarat sah menjadi seorang imam dalam shalat berjamaah!',
    esaiAnswer: '1. Beragama Islam dan berakal sehat (mumayyiz).\n2. Fasih dalam membaca ayat-ayat Al-Qur\'an.\n3. Mengetahui rukun dan syarat sah shalat.\n4. Berjenis kelamin laki-laki jika makmumnya ada laki-laki.',
    complexStatements: [
      '1. Shalat berjamaah melipatgandakan pahala hingga 27 derajat.',
      '2. Makmum wajib mengikuti setiap gerakan imam dan tidak mendahuluinya.',
      '3. Shaf shalat yang lurus dan rapat menyempurnakan shalat berjamaah.',
      '4. Makmum masbuq tidak perlu mengganti rakaat yang tertinggal.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['zakat', 'fitrah', 'infaq', 'sedekah'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan ketentuan zakat fitrah pada bulan Ramadhan!',
    stimulusText: 'Zakat fitrah merupakan kewajiban bagi setiap jiwa muslim yang mampu menjelang hari raya Idul Fitri untuk menyucikan jiwa dan membantu fakir miskin.',
    stem: 'Besaran zakat fitrah makanan pokok (beras) per jiwa yang wajib dikeluarkan menurut ketentuan syariat di Indonesia adalah ...',
    options: [
      { label: 'A', text: '1,5 kg atau 2 liter' },
      { label: 'B', text: '2,5 kg atau 3,5 liter' },
      { label: 'C', text: '5 kg atau 7 liter' },
      { label: 'D', text: '10 kg atau 12 liter' }
    ],
    correct: 'B',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat menentukan takaran zakat fitrah berupa makanan pokok (beras).',
    ipk: 'Mengidentifikasi ketentuan dan kadar zakat fitrah per jiwa.',
    rubrik: 'Kadar zakat fitrah di Indonesia adalah 2,5 kg atau 3,5 liter beras per jiwa. Pilihan B bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Berbagi rezeki dan menyucikan jiwa demi membahagiakan fakir miskin di hari raya',
    isianQuestion: 'Waktu yang paling utama (afdhal) untuk membayarkan zakat fitrah adalah sebelum pelaksanaan shalat ...',
    isianAnswer: 'Idul Fitri',
    esaiQuestion: 'Sebutkan 4 (empat) golongan (mustahik) yang berhak menerima zakat sebagaimana disebutkan dalam QS. At-Taubah ayat 60!',
    esaiAnswer: '1. Fakir (orang yang tidak berharta dan tidak berpenghasilan).\n2. Miskin (orang yang penghasilannya tidak mencukupi kebutuhan pokok).\n3. Amil (panitia pengelola zakat).\n4. Mualaf (orang yang baru memeluk Islam).\n5. Riqab, Gharimin, Fisabilillah, Ibnu Sabil.',
    complexStatements: [
      '1. Zakat fitrah berfungsi menyucikan jiwa orang yang berpuasa.',
      '2. Besaran zakat fitrah per jiwa adalah 2,5 kg atau 3,5 liter beras.',
      '3. Mustahik zakat di antaranya adalah fakir dan miskin.',
      '4. Zakat fitrah boleh dibayarkan setelah shalat Idul Adha.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

const AUTHENTIC_AKIDAH_POOL: TopicQuestionData[] = [
  {
    materiKeywords: ['asmaul husna', 'ar-rahman', 'ar-rahim', 'al-malik', 'sifat allah'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan makna Asmaul Husna Al-Malik berikut!',
    stimulusText: 'Allah Swt. memiliki Asmaul Husna Al-Malik yang artinya Maha Merajai seluruh alam semesta, langit, bumi, dan seisinya.',
    stem: 'Pengamalan sifat Al-Malik dalam kehidupan sehari-hari bagi seorang peserta didik adalah ...',
    options: [
      { label: 'A', text: 'Mampu menahan amarah dan mengendalikan hawa nafsu dari perbuatan buruk' },
      { label: 'B', text: 'Bersikap sombong karena memiliki banyak harta dan kepandaian' },
      { label: 'C', text: 'Memerintah teman-teman sekelas dengan sewenang-wenang' },
      { label: 'D', text: 'Menolak dinasehati oleh bapak dan ibu guru' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Peserta didik dapat menerapkan keteladanan dari Asmaul Husna Al-Malik dalam kehidupan sehari-hari.',
    ipk: 'Mengaitkan pengamalan Asmaul Husna Al-Malik dengan pengendalian diri.',
    rubrik: 'Meneladani Al-Malik berarti menjadi pemimpin atas dirinya sendiri dengan mengendalikan hawa nafsu. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDesc: 'Mengagungkan kekuasaan Allah dengan melatih pengendalian diri yang luhur',
    isianQuestion: 'Asmaul Husna Ar-Rahman memiliki arti bahwa Allah Maha ... kepada seluruh makhluk-Nya di dunia.',
    isianAnswer: 'Pengasih',
    esaiQuestion: 'Jelaskan perbedaan antara Asmaul Husna Ar-Rahman dan Ar-Rahim serta berikan contoh keteladanannya di lingkungan madrasah!',
    esaiAnswer: 'Ar-Rahman artinya Maha Pengasih kepada seluruh makhluk di dunia tanpa terkecuali, sedangkan Ar-Rahim artinya Maha Penyayang khusus kepada orang-orang beriman di akhirat. Contoh keteladanan: menyayangi sesama teman, menolong orang yang sedang kesulitan, dan merawat hewan peliharaan.',
    complexStatements: [
      '1. Asmaul Husna Al-Malik artinya Maha Merajai.',
      '2. Pengamalan Al-Malik melatih kita mengendalikan hawa nafsu dan emosi.',
      '3. Asmaul Husna Al-Quddus artinya Maha Suci dari segala kekurangan.',
      '4. Meneladani Asmaul Husna diwujudkan dengan bersikap angkuh kepada sesama.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['kalimat thayyibah', 'tarji', 'tahmid', 'tasbih', 'tahlil'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kebiasaan melafalkan kalimat thayyibah berikut!',
    stimulusText: 'Sebagai seorang muslim, kita diajarkan untuk senantiasa mengingat Allah dalam setiap keadaan dengan melafalkan kalimat thayyibah.',
    stem: 'Ketika mendengar kabar bahwa saudara atau tetangga tertimpa musibah kebakaran, seorang muslim dianjurkan mengucap kalimat thayyibah tarji\' (istirja\') yaitu ...',
    options: [
      { label: 'A', text: 'Inna lillahi wa inna ilaihi raji\'un' },
      { label: 'B', text: 'Subhanallah wa bihamdihi' },
      { label: 'C', text: 'La hawla wa la quwwata illa billah' },
      { label: 'D', text: 'Astaghfirullahal \'azhim' }
    ],
    correct: 'A',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat menentukan lafaz kalimat thayyibah yang tepat ketika tertimpa atau mendengar musibah.',
    ipk: 'Mengidentifikasi lafaz kalimat istirja\' dan waktu penggunaannya.',
    rubrik: 'Kalimat tarji\' adalah Inna lillahi wa inna ilaihi raji\'un. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDesc: 'Menyerahkan segala urusan hidup dan mati hanya kepada Allah Yang Maha Kuasa',
    isianQuestion: 'Kalimat thayyibah "Subhanallah" dinamakan bacaan tasbih yang memiliki arti Maha Suci ...',
    isianAnswer: 'Allah',
    esaiQuestion: 'Sebutkan 3 (tiga) hikmah membiasakan diri membaca kalimat thayyibah dalam kehidupan sehari-hari!',
    esaiAnswer: '1. Mendapatkan pahala dan ridha dari Allah SWT.\n2. Menjaga hati dan pikiran agar senantiasa mengingat Allah (dzikrullah).\n3. Terhindar dari perkataan kotor, sia-sia, dan perbuatan dosa.',
    complexStatements: [
      '1. Kalimat Tarji\' dibaca saat mendengar atau mengalami musibah.',
      '2. Kalimat Tahmid (Alhamdulillah) dibaca saat memperoleh kenikmatan.',
      '3. Kalimat Tasbih (Subhanallah) dibaca saat melihat keagungan ciptaan Allah.',
      '4. Kalimat thayyibah boleh diganti dengan keluhan kemarahan.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

// 4. AUTHENTIC BAHASA INDONESIA POOL
const AUTHENTIC_BIND_POOL: TopicQuestionData[] = [
  {
    materiKeywords: ['ide pokok', 'gagasan utama', 'paragraf', 'informasi teks', 'narasi'],
    stimulusType: 'cerita',
    stimulusTitle: 'Bacalah penggalan teks narasi berikut dengan saksama!',
    stimulusText: 'Hutan bakau di pesisir pantai memiliki peranan yang sangat penting bagi keseimbangan ekosistem laut. Akar-akar pohon bakau yang kokoh mampu menahan deburan ombak besar sehingga mencegah terjadinya abrasi pantai. Selain itu, kawasan hutan bakau juga menjadi tempat berkembang biak yang aman bagi berbagai jenis kepiting, udang, dan ikan kecil dari kejaran predator.',
    stem: 'Gagasan utama (ide pokok) yang termuat dalam paragraf bacaan di atas adalah ...',
    options: [
      { label: 'A', text: 'Peranan penting hutan bakau bagi ekosistem pantai dan biota laut' },
      { label: 'B', text: 'Cara udang dan kepiting mencari makan di sela-sela akar pohon' },
      { label: 'C', text: 'Bahaya ombak besar yang sering menerjang bibir pantai' },
      { label: 'D', text: 'Keadaan tanah pesisir pantai yang selalu tergenang air asin' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan teks bacaan narasi satu paragraf, peserta didik dapat menentukan gagasan utama (ide pokok) dengan tepat.',
    ipk: 'Mengidentifikasi ide pokok dalam teks informatif eksposisi.',
    rubrik: 'Ide pokok terdapat pada kalimat utama di awal paragraf (peranan penting hutan bakau). Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_alam',
    kbcDesc: 'Menjaga kelestarian lingkungan alam pesisir dan biota laut ciptaan Tuhan',
    isianQuestion: 'Gagasan yang mendasari dan menjadi pusat pengembangan suatu paragraf disebut gagasan ...',
    isianAnswer: 'utama / ide pokok',
    esaiQuestion: 'Jelaskan dua fungsi utama hutan bakau berdasarkan teks bacaan di atas!',
    esaiAnswer: '1. Menahan deburan ombak untuk mencegah abrasi pantai.\n2. Menjadi tempat berkembang biak dan perlindungan bagi udang, kepiting, dan ikan kecil.',
    complexStatements: [
      '1. Hutan bakau bermanfaat melindungi pantai dari ancaman abrasi ombak.',
      '2. Udang dan kepiting memanfaatkan akar pohon bakau sebagai tempat berlindung.',
      '3. Ide pokok paragraf terletak di kalimat pertama paragraf.',
      '4. Hutan bakau merusak habitat alami ikan-ikan di pesisir laut.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['teks deskripsi', 'menggambarkan', 'pengamatan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan teks deskripsi suasana madrasah berikut!',
    stimulusText: 'Gedung Madrasah Ibtidaiyah Cibungur I berdiri kokoh dengan cat dinding bernuansa hijau muda dan putih. Di halaman depan, terhampar taman asri yang dipenuhi bunga melati dan pohon ketapang yang rindang. Suasana pagi hari selalu terasa sejuk dan damai saat lantunan ayat suci Al-Qur\'an berkumandang dari ruang-ruang kelas.',
    stem: 'Objek yang digambarkan secara rinci dalam teks deskripsi di atas adalah ...',
    options: [
      { label: 'A', text: 'Lingkungan fisik dan suasana asri Madrasah Ibtidaiyah Cibungur I' },
      { label: 'B', text: 'Jadwal perlombaan antarkelas di hari peringatan madrasah' },
      { label: 'C', text: 'Cara merawat tanaman melati dan pohon ketapang' },
      { label: 'D', text: 'Kegiatan ekstrakurikuler kepramukaan madrasah' }
    ],
    correct: 'A',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat mengidentifikasi objek yang digambarkan dalam teks deskripsi.',
    ipk: 'Mengidentifikasi objek dan suasana yang digambarkan dalam teks deskripsi.',
    rubrik: 'Teks mendeskripsikan gedung, taman, dan suasana madrasah. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_madrasah',
    kbcDesc: 'Mencintai kebersihan dan keindahan lingkungan tempat menuntut ilmu',
    isianQuestion: 'Teks yang menggambarkan suatu objek atau tempat secara rinci sehingga pembaca seolah-olah melihatnya langsung dinamakan teks ...',
    isianAnswer: 'deskripsi',
    esaiQuestion: 'Tuliskan 3 ciri fisik Madrasah Ibtidaiyah Cibungur I yang disebutkan dalam teks deskripsi di atas!',
    esaiAnswer: '1. Gedung dicat berwarna hijau muda dan putih.\n2. Ada taman asri dengan bunga melati dan pohon ketapang rindang.\n3. Suasana sejuk dengan lantunan ayat Al-Qur\'an dari ruang kelas.',
    complexStatements: [
      '1. Teks menggambarkan lingkungan madrasah yang asri dan sejuk.',
      '2. Cat dinding gedung madrasah berwarna hijau muda dan putih.',
      '3. Pagi hari diwarnai dengan lantunan ayat suci Al-Qur\'an.',
      '4. Gedung madrasah berada di pinggir jalan tol yang bising.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['ejaan', 'tanda baca', 'huruf kapital', 'eyd', 'kaidah kebahasaan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kalimat percakapan berikut!',
    stimulusText: 'pada hari senin ahmad dan siti pergi ke kota bandung untuk mengikuti olimpiade madrasah.',
    stem: 'Penulisan huruf kapital yang tepat sesuai kaidah ejaan bahasa Indonesia untuk kalimat di atas adalah ...',
    options: [
      { label: 'A', text: 'Pada hari Senin, Ahmad dan Siti pergi ke kota Bandung untuk mengikuti olimpiade madrasah.' },
      { label: 'B', text: 'Pada Hari senin Ahmad dan siti pergi Ke Kota Bandung untuk mengikuti olimpiade madrasah.' },
      { label: 'C', text: 'pada hari Senin, ahmad dan Siti pergi ke Kota bandung untuk mengikuti olimpiade madrasah.' },
      { label: 'D', text: 'Pada hari senin, ahmad Dan siti Pergi ke kota bandung untuk mengikuti olimpiade madrasah.' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Peserta didik dapat memperbaiki penggunaan huruf kapital pada nama hari, nama orang, dan nama tempat.',
    ipk: 'Menerapkan penulisan huruf kapital yang tepat pada awal kalimat, nama hari, nama diri, dan nama kota.',
    rubrik: 'Huruf kapital dipakai di awal kalimat (Pada), nama hari (Senin), nama orang (Ahmad, Siti), nama kota (Bandung). Pilihan A tepat.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Mencintai ketepatan dan tata bahasa Indonesia yang santun dan baku',
    isianQuestion: 'Tanda baca yang digunakan untuk mengakhiri kalimat berita yang lengkap adalah tanda ...',
    isianAnswer: 'titik (.)',
    esaiQuestion: 'Perbaikilah penulisan ejaan dan huruf kapital pada kalimat berikut: "pak ridwan membeli buku sejarah di toko gramedia pada bulan agustus."',
    esaiAnswer: '"Pak Ridwan membeli buku sejarah di Toko Gramedia pada bulan Agustus."',
    complexStatements: [
      '1. Nama orang (Ahmad, Siti) wajib diawali huruf kapital.',
      '2. Nama hari (Senin) dan nama kota (Bandung) diawali huruf kapital.',
      '3. Awal kalimat wajib dimulai dengan huruf kapital.',
      '4. Kata "kota" di depan nama Bandung harus ditulis dengan huruf kapital KOTA.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

// 5. AUTHENTIC IPAS POOL
const AUTHENTIC_IPAS_POOL: TopicQuestionData[] = [
  {
    materiKeywords: ['fotosintesis', 'klorofil', 'tumbuhan', 'cahaya matahari'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan proses pembuatan makanan pada tumbuhan hijau berikut!',
    stimulusText: 'Tumbuhan hijau merupakan produsen dalam rantai makanan karena mampu memasak makanannya sendiri melalui proses fotosintesis dengan menyerap air dari tanah, gas karbon dioksida dari udara, dan energi cahaya matahari.',
    stem: 'Gas yang diserap dari udara oleh daun tumbuhan untuk fotosintesis dan gas yang dilepaskan ke udara sebagai hasilnya secara berturut-turut adalah ...',
    options: [
      { label: 'A', text: 'Karbon dioksida (CO₂) dan Oksigen (O₂)' },
      { label: 'B', text: 'Oksigen (O₂) dan Nitrogen (N₂)' },
      { label: 'C', text: 'Karbon monoksida (CO) dan Karbon dioksida (CO₂)' },
      { label: 'D', text: 'Oksigen (O₂) dan Karbon dioksida (CO₂)' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan teks proses fotosintesis, peserta didik dapat menentukan gas yang dibutuhkan dan gas yang dihasilkan.',
    ipk: 'Menganalisis bahan dan hasil fotosintesis pada tumbuhan hijau.',
    rubrik: 'Tumbuhan menyerap karbon dioksida dan melepaskan oksigen saat fotosintesis. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_alam',
    kbcDesc: 'Mensyukuri karunia oksigen yang dihasilkan tumbuhan hijau bagi kelangsungan hidup manusia',
    isianQuestion: 'Zat hijau daun pada tumbuhan yang berfungsi menangkap cahaya matahari untuk fotosintesis disebut ...',
    isianAnswer: 'klorofil',
    esaiQuestion: 'Uraikan 4 (empat) komponen penting yang dibutuhkan oleh tumbuhan hijau untuk melangsungkan proses fotosintesis!',
    esaiAnswer: '1. Cahaya matahari.\n2. Klorofil (zat hijau daun).\n3. Air (H₂O) diserap dari tanah melalui akar.\n4. Karbon dioksida (CO₂) diserap dari udara melalui stomata.',
    complexStatements: [
      '1. Fotosintesis menghasilkan oksigen yang dihirup oleh manusia dan hewan.',
      '2. Klorofil berfungsi menyerap energi dari sinar matahari.',
      '3. Glukosa/karbohidrat merupakan hasil makanan dari fotosintesis.',
      '4. Proses fotosintesis hanya dapat terjadi pada malam hari tanpa cahaya.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['rantai makanan', 'ekosistem', 'produsen', 'konsumen'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan peristiwa makan dan dimakan di sawah berikut!',
    stimulusText: 'Di sebuah petak sawah dekat madrasah, terdapat padi yang tumbuh subur, kawanan belalang yang memakan daun padi, burung pipit pemakan belalang, dan ular sawah yang memangsa burung pipit.',
    stem: 'Berdasarkan rantai makanan sawah di atas, peran padi dan ular sawah berturut-turut adalah sebagai ...',
    options: [
      { label: 'A', text: 'Produsen dan konsumen tingkat III' },
      { label: 'B', text: 'Konsumen I dan pengurai' },
      { label: 'C', text: 'Produsen dan pengurai' },
      { label: 'D', text: 'Konsumen II dan produsen' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan deskripsi rantai makanan sawah, peserta didik dapat mengidentifikasi peran masing-masing organisme.',
    ipk: 'Mengklasifikasikan tingkatan trofik rantai makanan (produsen, konsumen, pengurai).',
    rubrik: 'Padi = produsen, Belalang = konsumen I, Burung pipit = konsumen II, Ular = konsumen III. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_alam',
    kbcDesc: 'Menjaga keharmonisan dan keseimbangan rantai kehidupan makhluk hidup',
    isianQuestion: 'Organisme seperti jamur dan bakteri yang berfungsi menguraikan bangkai makhluk hidup disebut ...',
    isianAnswer: 'dekomposer / pengurai',
    esaiQuestion: 'Jika petani membasmi seluruh ular di sawah dengan racun, apakah yang akan terjadi pada populasi burung pipit dan padi? Jelaskan!',
    esaiAnswer: 'Populasi burung pipit akan meningkat drastis karena tidak ada pemangsa (ular), akibatnya burung pipit akan memakan semakin banyak belalang atau padi sehingga hasil panen padi petani menjadi menurun/rusak.',
    complexStatements: [
      '1. Padi berperan sebagai produsen karena menghasilkan makanan sendiri.',
      '2. Belalang berperan sebagai konsumen tingkat I (herbivora).',
      '3. Ular sawah berperan sebagai konsumen puncak pada rantai makanan tersebut.',
      '4. Pemusnahan ular sawah akan membuat tanaman padi semakin subur tanpa hama.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['perubahan wujud', 'wujud zat', 'mencair', 'menguap', 'mengembun', 'membeku'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan percobaan es teh manis di kantin madrasah berikut!',
    stimulusText: 'Faris memesan segelas es teh manis di kantin. Setelah diletakkan di atas meja selama 15 menit, bagian luar dinding gelas kaca menjadi basah dan tampak dipenuhi titik-titik tetesan air.',
    stem: 'Peristiwa munculnya titik-titik air pada dinding luar gelas kaca tersebut merupakan contoh perubahan wujud ...',
    options: [
      { label: 'A', text: 'Mengembun (gas menjadi cair karena pelepasan panas)' },
      { label: 'B', text: 'Mencair (padat menjadi cair)' },
      { label: 'C', text: 'Menguap (cair menjadi gas)' },
      { label: 'D', text: 'Menyublim (padat menjadi gas)' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Disajikan fenomena tetesan air pada dinding luar gelas es, peserta didik dapat mengidentifikasi proses mengembun.',
    ipk: 'Mengidentifikasi perubahan wujud zat mengembun dalam kehidupan sehari-hari.',
    rubrik: 'Uap air di udara luar yang bersentuhan dengan dinding gelas dingin mengembun menjadi tetesan air. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_ilmu',
    kbcDesc: 'Mengamati dengan kritis fenomena fisika di lingkungan sekitar',
    isianQuestion: 'Perubahan wujud benda dari padat menjadi cair akibat pemanasan disebut peristiwa ...',
    isianAnswer: 'mencair / melebur',
    esaiQuestion: 'Sebutkan 3 contoh peristiwa perubahan wujud zat yang dapat kamu temukan di rumah atau madrasah beserta jenis perubahannya!',
    esaiAnswer: '1. Es batu berubah menjadi air (mencair).\n2. Air yang dimasak mendidih mengeluarkan uap (menguap).\n3. Air yang dimasukkan ke freezer membeku menjadi es (membeku).',
    complexStatements: [
      '1. Titik air di luar gelas berasal dari uap air di udara sekitar yang mendingin.',
      '2. Proses perubahan uap air menjadi cairan disebut mengembun.',
      '3. Es di dalam gelas mengalami proses mencair seiring bertambahnya waktu.',
      '4. Air di dalam gelas menembus kaca padat sehingga keluar ke dinding gelas.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

// 6. AUTHENTIC PENDIDIKAN PANCASILA (PPKn) POOL
const AUTHENTIC_PANCASILA_POOL: TopicQuestionData[] = [
  {
    materiKeywords: ['sila pancasila', 'pancasila', 'nilai pancasila', 'pengamalan'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kegiatan pemilihan ketua kelas berikut!',
    stimulusText: 'Siswa kelas 4 berkumpul untuk memilih ketua kelas baru. Walaupun ada perbedaan pendapat mengenai calon yang diajukan, seluruh siswa berdiskusi dengan tenang, mendengarkan argumen teman, dan menerima keputusan akhir secara lapang dada.',
    stem: 'Sikap berdiskusi secara damai dan menghargai keputusan bersama tersebut merupakan wujud pengamalan Pancasila, khususnya sila ...',
    options: [
      { label: 'A', text: 'Keempat (Kerakyatan yang Dipimpin oleh Hikmat Kebijaksanaan dalam Permusyawaratan/Perwakilan)' },
      { label: 'B', text: 'Pertama (Ketuhanan Yang Maha Esa)' },
      { label: 'C', text: 'Kedua (Kemanusiaan yang Adil dan Beradab)' },
      { label: 'D', text: 'Ketiga (Persatuan Indonesia)' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Peserta didik dapat mengaitkan perilaku musyawarah kelas dengan pengamalan sila keempat Pancasila.',
    ipk: 'Menganalisis pengamalan sila keempat Pancasila dalam kegiatan musyawarah mufakat.',
    rubrik: 'Musyawarah mufakat merupakan inti sila ke-4 (Kerakyatan). Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_tanah_air',
    kbcDesc: 'Menjunjung tinggi musyawarah dan demokrasi berlandaskan Pancasila',
    isianQuestion: 'Simbol lambang sila kelima Pancasila (Keadilan Sosial bagi Seluruh Rakyat Indonesia) adalah ...',
    isianAnswer: 'Padi dan Kapas',
    esaiQuestion: 'Tuliskan 3 (tiga) contoh pengamalan sila pertama Pancasila di lingkungan madrasah!',
    esaiAnswer: '1. Berdoa sebelum dan sesudah belajar.\n2. Melaksanakan shalat dhuha dan shalat fardhu berjamaah di madrasah.\n3. Menghargai dan menghormati teman yang sedang beribadah.',
    complexStatements: [
      '1. Musyawarah mufakat merupakan cerminan pengamalan sila ke-4 Pancasila.',
      '2. Setiap peserta musyawarah berhak menyampaikan pendapat dengan sopan.',
      '3. Keputusan hasil musyawarah harus ditaati oleh seluruh anggota kelas.',
      '4. Anggota yang tidak setuju boleh melanggar kesepakatan bersama.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['hak dan kewajiban', 'kewajiban', 'hak'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kegiatan piket kebersihan kelas berikut!',
    stimulusText: 'Sebagai warga madrasah, siswa berhak menikmati ruang belajar yang bersih, sejuk, dan rapi agar dapat belajar dengan nyaman dan fokus.',
    stem: 'Agar hak mendapatkan ruang kelas yang bersih terpenuhi, maka kewajiban yang wajib dilaksanakan oleh setiap siswa adalah ...',
    options: [
      { label: 'A', text: 'Melaksanakan jadwal piket kebersihan kelas secara tertib dan membuang sampah pada tempatnya' },
      { label: 'B', text: 'Menyerahkan seluruh tugas kebersihan ruang kelas kepada penjaga madrasah' },
      { label: 'C', text: 'Menuntut guru membersihkan papan tulis setiap pergantian jam' },
      { label: 'D', text: 'Meninggalkan bungkus makanan di laci meja setelah jam istirahat' }
    ],
    correct: 'A',
    cognitiveLevel: 'L2',
    indikator: 'Peserta didik dapat menentukan kewajiban yang harus dipenuhi untuk memperoleh hak lingkungan belajar yang bersih.',
    ipk: 'Membedakan hak dan kewajiban siswa di lingkungan madrasah.',
    rubrik: 'Kewajiban melaksanakan piket dan menjaga kebersihan merupakan prasyarat memperoleh hak kelas bersih. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_disiplin',
    kbcDesc: 'Menjaga keseimbangan antara hak yang diterima dan kewajiban yang harus ditunaikan',
    isianQuestion: 'Sesuatu yang harus kita kerjakan atau laksanakan dengan penuh tanggung jawab dinamakan ...',
    isianAnswer: 'kewajiban',
    esaiQuestion: 'Jelaskan perbedaan antara hak dan kewajiban serta berikan masing-masing 2 contohnya bagi seorang siswa di madrasah!',
    esaiAnswer: 'Hak adalah segala sesuatu yang berhak diterima/dimiliki (contoh: mendapatkan ilmu dari guru, menggunakan fasilitas perpustakaan).\nKewajiban adalah segala sesuatu yang harus dilakukan dengan tanggung jawab (contoh: mematuhi tata tertib madrasah, mengerjakan tugas tepat waktu).',
    complexStatements: [
      '1. Hak dan kewajiban harus dilaksanakan secara seimbang.',
      '2. Mendapatkan bimbingan dan pengajaran guru merupakan hak siswa.',
      '3. Melaksanakan tata tertib madrasah merupakan kewajiban siswa.',
      '4. Siswa boleh menuntut haknya tanpa perlu menunaikan kewajiban.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

// 7. AUTHENTIC AL-QUR'AN HADIS POOL
const AUTHENTIC_QURDIS_POOL: TopicQuestionData[] = [
  {
    materiKeywords: ['surat', 'surah', 'al-maun', 'yatim', 'al-ma\'un'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan kandungan Surah Al-Ma\'un berikut!',
    stimulusText: 'Surah Al-Ma\'un menjelaskan tentang ciri-ciri orang yang mendustakan agama (mukadzdzibu biddin).',
    stem: 'Berdasarkan Surah Al-Ma\'un, di antara ciri orang yang mendustakan agama adalah orang yang ...',
    options: [
      { label: 'A', text: 'Menghardik anak yatim dan enggan menolong dengan barang yang berguna' },
      { label: 'B', text: 'Selalu berbuat jujur dan amanah dalam berdagang' },
      { label: 'C', text: 'Mengerjakan shalat tepat pada awal waktu' },
      { label: 'D', text: 'Menginfaqkan sebagian hartanya untuk fakir miskin' }
    ],
    correct: 'A',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat menyebutkan perilaku pendusta agama menurut Surah Al-Ma\'un.',
    ipk: 'Mengidentifikasi pesan pokok Surah Al-Ma\'un tentang kepedulian sosial.',
    rubrik: 'Ciri pendusta agama dalam Surah Al-Ma\'un adalah menghardik anak yatim dan enggan memberi makan orang miskin. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_sesama',
    kbcDesc: 'Menyayangi anak yatim dan gemar membantu fakir miskin dengan ikhlas',
    isianQuestion: 'Kata "Al-Ma\'un" memiliki arti barang-barang yang ...',
    isianAnswer: 'berguna / bermanfaat',
    esaiQuestion: 'Sebutkan 3 (tiga) ciri orang yang mendustakan agama sebagaimana tercantum dalam QS. Al-Ma\'un!',
    esaiAnswer: '1. Menghardik dan berlaku kasar kepada anak yatim.\n2. Tidak menganjurkan memberi makan orang miskin.\n3. Lalai dalam shalatnya dan berbuat riya\' (pamer).',
    complexStatements: [
      '1. Surah Al-Ma\'un mengecam orang yang menghardik anak yatim.',
      '2. Orang yang shalatnya lalai dan riya\' termasuk celaka dalam Surah Al-Ma\'un.',
      '3. Surah Al-Ma\'un mengajarkan kepedulian sosial kepada sesama.',
      '4. Memberi bantuan kepada fakir miskin adalah perbuatan yang dilarang dalam surah ini.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  },
  {
    materiKeywords: ['tajwid', 'nun mati', 'tanwin', 'idzhar', 'ikhfa', 'idgham', 'iqlab'],
    stimulusType: 'cerita',
    stimulusTitle: 'Perhatikan hukum bacaan tajwid berikut!',
    stimulusText: 'Hukum nun sukun (نْ) atau tanwin (ـًـٍـٌ) apabila bertemu huruf hijaiyah terbagi menjadi beberapa ketentuan bacaan.',
    stem: 'Apabila nun sukun atau tanwin bertemu dengan salah satu huruf halqi (ء, هـ, ع, غ, ح, خ), maka hukum bacaannya adalah ...',
    options: [
      { label: 'A', text: 'Idzhar Halqi (dibaca jelas tanpa mendengung)' },
      { label: 'B', text: 'Ikhfa Haqiqi (dibaca samar-samar)' },
      { label: 'C', text: 'Idgham Bighunnah (dibaca melebur dengan dengung)' },
      { label: 'D', text: 'Iqlab (dibaca mengganti bunyi nun menjadi mim)' }
    ],
    correct: 'A',
    cognitiveLevel: 'L1',
    indikator: 'Peserta didik dapat menentukan hukum bacaan Idzhar Halqi saat nun sukun/tanwin bertemu huruf halqi.',
    ipk: 'Mengidentifikasi hukum bacaan Idzhar Halqi dan cara melafalkannya.',
    rubrik: 'Nun sukun/tanwin bertemu huruf halqi adalah Idzhar Halqi, dibaca jelas. Pilihan A bernilai skor maksimal.',
    kbcPillar: 'cinta_allah',
    kbcDesc: 'Membaca Al-Qur\'an secara tartil dan fasih sesuai kaidah tajwid yang benar',
    isianQuestion: 'Hukum bacaan nun sukun bertemu huruf ba (ب) dinamakan bacaan ...',
    isianAnswer: 'Iqlab',
    esaiQuestion: 'Sebutkan 6 (enam) huruf Idzhar Halqi dan jelaskan bagaimana cara membacanya!',
    esaiAnswer: 'Enam huruf Idzhar Halqi adalah: Hamzah (ء), Ha (هـ), \'Ain (ع), Ghain (غ), Ha (ح), Kha (خ).\nCara membacanya: suara nun sukun atau tanwin dilafalkan secara jelas, tegas, dan tidak boleh mendengung.',
    complexStatements: [
      '1. Huruf Idzhar Halqi keluar dari tenggorokan (tenggorokan/halq).',
      '2. Cara membaca Idzhar Halqi adalah terang dan jelas tanpa ghunnah.',
      '3. Contoh bacaan Idzhar adalah "min khoirin" (مِنْ خَيْرٍ).',
      '4. Idzhar Halqi dibaca dengan mendengung selama 3 harakat.'
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  }
];

// Dynamic Universal Synthesizer: if any subject / CP / TP has a unique clause that doesn't match static items,
// this generates an authentic, pedagogically rigorous question aligned directly to that clause.
function synthesizeUniversalQuestionFromTP(
  subjectName: string,
  materiPokok: string,
  tpText?: string,
  index: number = 1
): TopicQuestionData {
  const normSubj = subjectName || 'Pembelajaran';
  const cleanMateri = (materiPokok && materiPokok !== 'Materi Pokok' && !materiPokok.startsWith('Materi Pokok / Bab'))
    ? materiPokok
    : (tpText ? tpText.slice(0, 40) : 'Materi Pembelajaran');
  const cleanTp = tpText || `Peserta didik mampu memahami dan menerapkan materi ${cleanMateri}.`;

  return {
    materiKeywords: [cleanMateri.toLowerCase()],
    stimulusType: (index % 3 === 0) ? 'tabel' : (index % 2 === 0 ? 'cerita' : 'cerita'),
    stimulusTitle: `Perhatikan konteks penerapan materi ${cleanMateri} berikut!`,
    stimulusText: `Dalam kegiatan belajar di madrasah, peserta didik diajak untuk mengamati, memahami, dan memecahkan permasalahan nyata yang berkaitan dengan ${cleanMateri}. Melalui pemahaman yang mendalam, peserta didik diharapkan mampu menerapkan ilmu yang dipelajari dalam kehidupan sehari-hari secara disiplin dan penuh tanggung jawab.`,
    stimulusTable: (index % 3 === 0) ? `No | Kegiatan / Aspek Pengamatan | Keterangan | Capaian\n1 | Pemahaman Teori & Konsep | ${cleanMateri} | Sangat Baik\n2 | Penerapan Praktis Sehari-hari | Tindakan Nyata di Madrasah | Tuntas\n3 | Analisis Masalah & Solusi | Evaluasi Kritis Mandiri | Terpenuhi` : undefined,
    stem: `Berdasarkan kompetensi pada materi "${cleanMateri}", tindakan atau pemahaman yang paling tepat dan selaras dengan tujuan pembelajaran adalah ...`,
    options: [
      { label: 'A', text: `Memahami konsep inti ${cleanMateri} dan mengaplikasikannya secara benar dalam situasi nyata` },
      { label: 'B', text: `Mengabaikan kaidah materi ${cleanMateri} saat menghadapi permasalahan kontekstual` },
      { label: 'C', text: `Menghafal rumus atau teori ${cleanMateri} tanpa memahami makna dan tujuannya` },
      { label: 'D', text: `Menyerahkan penyelesaian tugas materi ${cleanMateri} sepenuhnya kepada orang lain` }
    ],
    correct: 'A',
    cognitiveLevel: (index % 3 === 0) ? 'L3' : 'L2',
    indikator: `Disajikan konteks penerapan ${cleanMateri}, peserta didik dapat menganalisis dan menerapkan konsep ${cleanMateri} secara tepat.`,
    ipk: `Menerapkan konsep ${cleanMateri} sesuai indikator pencapaian kompetensi.`,
    rubrik: `Pilihan A bernilai skor maksimal karena mencerminkan pemahaman konseptual dan aplikasi nyata yang tepat.`,
    kbcPillar: 'cinta_ilmu',
    kbcDesc: `Menumbuhkan kecintaan menuntut ilmu dan mengamalkannya dalam kehidupan nyata`,
    isianQuestion: `Tujuan utama mempelajari materi ${cleanMateri} adalah agar kita mampu menerapkan konsep tersebut secara ... dan bertanggung jawab.`,
    isianAnswer: 'benar / tepat',
    esaiQuestion: `Uraikan secara jelas bagaimana caramu menerapkan materi "${cleanMateri}" dalam kegiatan sehari-hari di lingkungan madrasah atau rumah!`,
    esaiAnswer: `1. Memahami konsep dasar ${cleanMateri} dengan sungguh-sungguh.\n2. Menerapkannya dalam perilaku nyata, menjaga keteraturan, dan bekerja sama dengan teman.\n3. Mengevaluasi hasil yang diperoleh dan terus meningkatkan kualitas diri.`,
    complexStatements: [
      `1. Pemahaman mendalam tentang ${cleanMateri} membantu menyelesaikan masalah sehari-hari.`,
      `2. Pembelajaran ${cleanMateri} melatih sikap mandiri, teliti, dan bertanggung jawab.`,
      `3. Kaidah dalam ${cleanMateri} harus diterapkan secara konsisten dan benar.`,
      `4. Materi ${cleanMateri} tidak memiliki kaitan dengan kehidupan sosial di madrasah.`
    ],
    complexOptions: [
      { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
      { label: 'B', text: 'Pernyataan (1) dan (4) saja' },
      { label: 'C', text: 'Pernyataan (2) dan (4) saja' },
      { label: 'D', text: 'Semua pernyataan benar' }
    ]
  };
}

// Helper to vary questions dynamically with index so repeated numbers never appear
function varyQuestionWithIndex(
  base: TopicQuestionData,
  index: number,
  normSubj: string
): TopicQuestionData {
  if (!normSubj.includes('matematika') && !normSubj.includes('mtk')) {
    return base;
  }

  // If question is place-value ("Pada bilangan 48.725..."), vary dynamically across indexes!
  if (base.stem.includes('Pada bilangan 48.725')) {
    const variants = [
      {
        num: '48.725',
        digit: '8',
        place: 'Ribuan',
        val: '8.000',
        opts: [
          { label: 'A' as const, text: 'Ratusan dan nilainya 800' },
          { label: 'B' as const, text: 'Ribuan dan nilainya 8.000' },
          { label: 'C' as const, text: 'Puluhan ribu dan nilainya 80.000' },
          { label: 'D' as const, text: 'Puluhan dan nilainya 80' }
        ],
        correct: 'B' as const
      },
      {
        num: '65.340',
        digit: '5',
        place: 'Ribuan',
        val: '5.000',
        opts: [
          { label: 'A' as const, text: 'Puluh ribuan dan nilainya 50.000' },
          { label: 'B' as const, text: 'Ratusan dan nilainya 500' },
          { label: 'C' as const, text: 'Ribuan dan nilainya 5.000' },
          { label: 'D' as const, text: 'Satuan dan nilainya 5' }
        ],
        correct: 'C' as const
      },
      {
        num: '72.819',
        digit: '7',
        place: 'Puluh ribuan',
        val: '70.000',
        opts: [
          { label: 'A' as const, text: 'Puluh ribuan dan nilainya 70.000' },
          { label: 'B' as const, text: 'Ribuan dan nilainya 7.000' },
          { label: 'C' as const, text: 'Ratusan dan nilainya 700' },
          { label: 'D' as const, text: 'Puluhan dan nilainya 70' }
        ],
        correct: 'A' as const
      },
      {
        num: '53.682',
        digit: '6',
        place: 'Ratusan',
        val: '600',
        opts: [
          { label: 'A' as const, text: 'Ribuan dan nilainya 6.000' },
          { label: 'B' as const, text: 'Ratusan dan nilainya 600' },
          { label: 'C' as const, text: 'Puluh ribuan dan nilainya 60.000' },
          { label: 'D' as const, text: 'Puluhan dan nilainya 60' }
        ],
        correct: 'B' as const
      },
      {
        num: '91.450',
        digit: '4',
        place: 'Ratusan',
        val: '400',
        opts: [
          { label: 'A' as const, text: 'Puluh ribuan dan nilainya 40.000' },
          { label: 'B' as const, text: 'Ribuan dan nilainya 4.000' },
          { label: 'C' as const, text: 'Ratusan dan nilainya 400' },
          { label: 'D' as const, text: 'Puluhan dan nilainya 40' }
        ],
        correct: 'C' as const
      },
      {
        num: '38.924',
        digit: '8',
        place: 'Ribuan',
        val: '8.000',
        opts: [
          { label: 'A' as const, text: 'Puluh ribuan dan nilainya 80.000' },
          { label: 'B' as const, text: 'Ratusan dan nilainya 800' },
          { label: 'C' as const, text: 'Ribuan dan nilainya 8.000' },
          { label: 'D' as const, text: 'Satuan dan nilainya 8' }
        ],
        correct: 'C' as const
      }
    ];

    const v = variants[(index - 1) % variants.length];
    return {
      ...base,
      stimulusText: `Dalam rangka bakti sosial Ramadhan, tercatat infaq kas madrasah sebesar Rp${v.num},00.`,
      stem: `Pada bilangan ${v.num}, angka ${v.digit} menempati nilai tempat ... dan mempunyai nilai sebesar ...`,
      options: v.opts,
      correct: v.correct,
      rubrik: `Angka ${v.digit} pada posisi ${v.place} bernilai ${v.val}. Pilihan ${v.correct} bernilai skor maksimal.`
    };
  }

  return base;
}

// Universal Helper to find best authentic match for ANY subject (Semua Mapel)
// dynamically binding to the specific Tujuan Pembelajaran (TP) and Capaian Pembelajaran (CP)
export function getAuthenticQuestionTemplate(
  subjectName: string,
  materiPokok: string,
  index: number,
  tpText?: string,
  cpText?: string
): TopicQuestionData {
  const normSubj = (subjectName || '').toLowerCase();
  const normMateri = (materiPokok || '').toLowerCase();
  const normTp = (tpText || '').toLowerCase();
  const normCp = (cpText || '').toLowerCase();
  const searchCorpus = `${normMateri} ${normTp} ${normCp}`;

  let pool: TopicQuestionData[] = [];
  if (normSubj.includes('matematika') || normSubj.includes('mtk') || normSubj.includes('hitung') || normSubj.includes('numerasi')) {
    pool = AUTHENTIC_MATH_POOL;
  } else if (normSubj.includes('indonesia')) {
    pool = AUTHENTIC_BIND_POOL;
  } else if (normSubj.includes('ipas') || normSubj.includes('ipa') || normSubj.includes('ips') || normSubj.includes('sains')) {
    pool = AUTHENTIC_IPAS_POOL;
  } else if (normSubj.includes('pancasila') || normSubj.includes('ppkn') || normSubj.includes('pkn')) {
    pool = AUTHENTIC_PANCASILA_POOL;
  } else if (normSubj.includes('qur') || normSubj.includes('hadis') || normSubj.includes('hadits')) {
    pool = AUTHENTIC_QURDIS_POOL;
  } else if (normSubj.includes('fiqih') || normSubj.includes('fikih')) {
    pool = AUTHENTIC_FIQIH_POOL;
  } else if (normSubj.includes('akidah') || normSubj.includes('aqidah') || normSubj.includes('akhlak')) {
    pool = AUTHENTIC_AKIDAH_POOL;
  } else {
    // Combine all pools for comprehensive fallback
    pool = [
      ...AUTHENTIC_MATH_POOL,
      ...AUTHENTIC_BIND_POOL,
      ...AUTHENTIC_IPAS_POOL,
      ...AUTHENTIC_PANCASILA_POOL,
      ...AUTHENTIC_FIQIH_POOL,
      ...AUTHENTIC_AKIDAH_POOL,
      ...AUTHENTIC_QURDIS_POOL
    ];
  }

  // 1. Check for specific topic keyword matches across the corpus (Materi + TP text + CP text)
  // Highly prioritized: if TP mentions 'rasio', it matches the Rasio question! If 'proporsi', matches Proporsi!
  const matched = pool.filter(item => item.materiKeywords.some(kw => searchCorpus.includes(kw)));

  // If no predefined item matched the specific topic, synthesize an authentic question dynamically!
  if (matched.length === 0 && (normTp.length > 5 || (normMateri.length > 2 && !normMateri.startsWith('materi pokok')))) {
    return synthesizeUniversalQuestionFromTP(subjectName, materiPokok, tpText, index);
  }

  // 2. Select candidates with dynamic stimulus interleaving (Cerita -> Gambar -> Tabel -> ...)
  const candidates = matched.length > 0 ? matched : pool;
  const targetStimulusCycle = ['cerita', 'gambar', 'tabel'];
  const preferredType = targetStimulusCycle[(index - 1) % targetStimulusCycle.length];

  // Try to find candidate of preferred stimulus type first to alternate stimuli gracefully across exam paper
  const matchingStimulus = candidates.filter(item => item.stimulusType === preferredType);
  const poolToUse = matchingStimulus.length > 0 ? matchingStimulus : candidates;
  const picked = poolToUse[Math.floor((index - 1) / targetStimulusCycle.length) % poolToUse.length] || poolToUse[(index - 1) % poolToUse.length];

  // 3. Apply dynamic contextual variation based on index so consecutive questions are NEVER clones
  return varyQuestionWithIndex(picked, index, normSubj);
}

// 3. SEAMLESS GRAPHIC ENRICHER: Replaces dummy questions with mathematically/conceptually rigorous content
export function enrichQuestionWithGraphicBinding(
  question: QuestionItem,
  svgKey: string
): QuestionItem {
  const binding = SVG_GRAPHIC_BINDINGS[svgKey];
  if (!binding) return question;

  const currentOptionsCount = question.options?.length || 4;
  const slicedOptions = binding.options.slice(0, currentOptionsCount);

  // If correct answer is outside sliced options, clamp to 'A'
  const validCorrect = slicedOptions.some(o => o.label === binding.correctAnswer)
    ? binding.correctAnswer
    : 'A';

  return {
    ...question,
    stimulusType: 'gambar',
    stimulusSvg: svgKey,
    stimulusTitle: binding.title,
    stimulusTable: undefined,
    stimulusText: undefined,
    arabicText: undefined,
    arabicTranslation: undefined,
    questionText: binding.questionText,
    options: slicedOptions,
    correctAnswer: validCorrect,
    score: question.score || 4,
    cognitiveLevel: binding.cognitiveLevel,
    indikatorSoal: binding.indikatorSoal,
    ipk: binding.ipk,
    materiPokok: binding.materiPokok,
    rubrikPenilaian: binding.rubrikPenilaian,
    complexStatements: binding.complexStatements,
    kbcPillar: binding.kbcPillar || question.kbcPillar,
    kbcDescription: binding.kbcDescription || question.kbcDescription
  };
}
