import React from 'react';

// Preset Educational Vector SVGs for Mathematics & Madrasah Subjects
export const EDUCATIONAL_GRAPHICS: Record<string, { title: string; category: 'matematika' | 'agama' | 'umum'; description?: string; svg: string }> = {
  // 1. MATEMATIKA: Pecahan Lingkaran 3/4
  'math_fraction_3_4': {
    title: 'Pecahan Lingkaran (3/4 Berarsir)',
    category: 'matematika',
    svg: `<svg viewBox="0 0 200 200" width="160" height="160" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="85" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
      <!-- Sektor 1 (0 to 90 deg) -->
      <path d="M 100 100 L 100 15 A 85 85 0 0 1 185 100 Z" fill="#0284c7" stroke="#334155" stroke-width="2"/>
      <!-- Sektor 2 (90 to 180 deg) -->
      <path d="M 100 100 L 185 100 A 85 85 0 0 1 100 185 Z" fill="#0284c7" stroke="#334155" stroke-width="2"/>
      <!-- Sektor 3 (180 to 270 deg) -->
      <path d="M 100 100 L 100 185 A 85 85 0 0 1 15 100 Z" fill="#0284c7" stroke="#334155" stroke-width="2"/>
      <!-- Sektor 4 (270 to 360 deg: putih) -->
      <path d="M 100 100 L 15 100 A 85 85 0 0 1 100 15 Z" fill="#ffffff" stroke="#334155" stroke-width="2"/>
      <line x1="100" y1="15" x2="100" y2="185" stroke="#1e293b" stroke-width="2.5"/>
      <line x1="15" y1="100" x2="185" y2="100" stroke="#1e293b" stroke-width="2.5"/>
      <circle cx="100" cy="100" r="5" fill="#0f172a"/>
      <text x="140" y="65" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">Arsir</text>
      <text x="140" y="145" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">Arsir</text>
      <text x="50" y="145" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ffffff">Arsir</text>
      <text x="45" y="65" font-family="sans-serif" font-size="12" fill="#64748b">Putih</text>
    </svg>`
  },

  // 2. MATEMATIKA: Pecahan Persegi Panjang 2/5
  'math_fraction_2_5': {
    title: 'Pecahan Batang (2/5 Berarsir)',
    category: 'matematika',
    svg: `<svg viewBox="0 0 250 80" width="220" height="70" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="15" width="230" height="50" fill="#ffffff" stroke="#1e293b" stroke-width="2.5" rx="4"/>
      <!-- 5 Kolom: lebar 46 per kolom -->
      <rect x="10" y="15" width="46" height="50" fill="#10b981" stroke="#1e293b" stroke-width="1.5"/>
      <rect x="56" y="15" width="46" height="50" fill="#10b981" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="148" y1="15" x2="148" y2="65" stroke="#1e293b" stroke-width="2"/>
      <line x1="194" y1="15" x2="194" y2="65" stroke="#1e293b" stroke-width="2"/>
      <text x="33" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">1</text>
      <text x="79" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">2</text>
      <text x="125" y="45" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">3</text>
      <text x="171" y="45" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">4</text>
      <text x="217" y="45" font-family="sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">5</text>
    </svg>`
  },

  // 3. MATEMATIKA: Segitiga Siku-siku dengan Sisi & Sudut
  'math_triangle_right': {
    title: 'Segitiga Siku-Siku (Alas 12 cm, Tinggi 9 cm)',
    category: 'matematika',
    svg: `<svg viewBox="0 0 220 180" width="180" height="150" xmlns="http://www.w3.org/2000/svg">
      <!-- Triangle A(30,140), B(190,140), C(30,25) -->
      <polygon points="30,140 190,140 30,25" fill="#f0fdf4" stroke="#15803d" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Siku-siku marker di A(30,140) -->
      <polyline points="30,122 48,122 48,140" fill="none" stroke="#15803d" stroke-width="2"/>
      <!-- Label Titik Sudut -->
      <text x="18" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">A</text>
      <text x="195" y="155" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">B</text>
      <text x="18" y="22" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">C</text>
      <!-- Label Ukuran Sisi -->
      <text x="110" y="160" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d" text-anchor="middle">12 cm</text>
      <text x="15" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#15803d" text-anchor="end">9 cm</text>
      <text x="125" y="75" font-family="sans-serif" font-size="12" font-style="italic" fill="#64748b" text-anchor="middle">c = ?</text>
    </svg>`
  },

  // 4. MATEMATIKA: Persegi Panjang 15 cm x 8 cm
  'math_rectangle': {
    title: 'Persegi Panjang (Panjang 15 cm, Lebar 8 cm)',
    category: 'matematika',
    svg: `<svg viewBox="0 0 240 140" width="200" height="120" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="180" height="90" fill="#eff6ff" stroke="#2563eb" stroke-width="2.5" rx="3"/>
      <!-- Labels Vertices -->
      <text x="12" y="22" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">P</text>
      <text x="210" y="22" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">Q</text>
      <text x="210" y="125" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">R</text>
      <text x="12" y="125" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">S</text>
      <!-- Length labels -->
      <text x="115" y="18" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb" text-anchor="middle">p = 15 cm</text>
      <text x="115" y="132" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb" text-anchor="middle">15 cm</text>
      <text x="18" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb" text-anchor="end">8 cm</text>
      <text x="212" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">l = 8 cm</text>
    </svg>`
  },

  // 5. MATEMATIKA: Balok 3D Isometric (p=10, l=6, t=4)
  'math_cuboid_3d': {
    title: 'Bangun Ruang Balok (p=10 cm, l=6 cm, t=4 cm)',
    category: 'matematika',
    svg: `<svg viewBox="0 0 240 160" width="200" height="135" xmlns="http://www.w3.org/2000/svg">
      <!-- Depan: x=30, y=70, w=120, h=60 -->
      <rect x="30" y="70" width="120" height="60" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/>
      <!-- Belakang / Atas isometric projection -->
      <polygon points="30,70 70,30 190,30 150,70" fill="#e2e8f0" stroke="#0f172a" stroke-width="2"/>
      <polygon points="150,70 190,30 190,90 150,130" fill="#cbd5e1" stroke="#0f172a" stroke-width="2"/>
      <!-- Hidden dashed lines -->
      <line x1="30" y1="130" x2="70" y2="90" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
      <line x1="70" y1="90" x2="190" y2="90" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
      <line x1="70" y1="90" x2="70" y2="30" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
      <!-- Dimension labels -->
      <text x="90" y="147" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">panjang = 10 cm</text>
      <text x="20" y="105" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="end">t = 4 cm</text>
      <text x="180" y="118" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">l = 6 cm</text>
    </svg>`
  },

  // 6. MATEMATIKA: Diagram Batang Penjualan Buku Koperasi
  'math_bar_chart': {
    title: 'Diagram Batang Numerasi Penjualan Buku Koperasi',
    category: 'matematika',
    svg: `<svg viewBox="0 0 280 180" width="240" height="155" xmlns="http://www.w3.org/2000/svg">
      <!-- Grid Lines -->
      <line x1="45" y1="20" x2="45" y2="140" stroke="#334155" stroke-width="2"/>
      <line x1="45" y1="140" x2="270" y2="140" stroke="#334155" stroke-width="2"/>
      <!-- Horizontal ticks -->
      <line x1="40" y1="140" x2="270" y2="140" stroke="#e2e8f0" stroke-width="1"/>
      <line x1="40" y1="110" x2="270" y2="110" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2"/>
      <line x1="40" y1="80" x2="270" y2="80" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2"/>
      <line x1="40" y1="50" x2="270" y2="50" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2"/>
      <line x1="40" y1="20" x2="270" y2="20" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="2 2"/>
      <!-- Y Labels -->
      <text x="35" y="144" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">0</text>
      <text x="35" y="114" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">10</text>
      <text x="35" y="84" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">20</text>
      <text x="35" y="54" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">30</text>
      <text x="35" y="24" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">40</text>
      <!-- Bars: Sen(25)=65, Sel(35)=35, Rab(30)=50, Kam(40)=20, Jum(20)=80 -->
      <rect x="60" y="65" width="28" height="75" fill="#3b82f6" rx="2"/>
      <text x="74" y="60" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e40af" text-anchor="middle">25</text>
      <rect x="102" y="35" width="28" height="105" fill="#10b981" rx="2"/>
      <text x="116" y="30" font-family="sans-serif" font-size="10" font-weight="bold" fill="#065f46" text-anchor="middle">35</text>
      <rect x="144" y="50" width="28" height="90" fill="#f59e0b" rx="2"/>
      <text x="158" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="#b45309" text-anchor="middle">30</text>
      <rect x="186" y="20" width="28" height="120" fill="#8b5cf6" rx="2"/>
      <text x="200" y="15" font-family="sans-serif" font-size="10" font-weight="bold" fill="#5b21b6" text-anchor="middle">40</text>
      <rect x="228" y="80" width="28" height="60" fill="#ec4899" rx="2"/>
      <text x="242" y="75" font-family="sans-serif" font-size="10" font-weight="bold" fill="#9d174d" text-anchor="middle">20</text>
      <!-- X Labels -->
      <text x="74" y="155" font-family="sans-serif" font-size="10" fill="#334155" text-anchor="middle">Sen</text>
      <text x="116" y="155" font-family="sans-serif" font-size="10" fill="#334155" text-anchor="middle">Sel</text>
      <text x="158" y="155" font-family="sans-serif" font-size="10" fill="#334155" text-anchor="middle">Rab</text>
      <text x="200" y="155" font-family="sans-serif" font-size="10" fill="#334155" text-anchor="middle">Kam</text>
      <text x="242" y="155" font-family="sans-serif" font-size="10" fill="#334155" text-anchor="middle">Jum</text>
      <text x="158" y="172" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Hari Penjualan</text>
    </svg>`
  },

  // 7. MATEMATIKA: Jam Analog 07.15 (Pengukuran Waktu & Sudut)
  'math_clock_0715': {
    title: 'Jam Analog (Pukul 07.15 / Sudut Jarum Jam)',
    category: 'matematika',
    svg: `<svg viewBox="0 0 180 180" width="150" height="150" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="75" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
      <circle cx="90" cy="90" r="70" fill="none" stroke="#e2e8f0" stroke-width="1.5"/>
      <!-- Numbers 12, 3, 6, 9 -->
      <text x="90" y="32" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">12</text>
      <text x="152" y="95" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">3</text>
      <text x="90" y="155" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">6</text>
      <text x="28" y="95" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a" text-anchor="middle">9</text>
      <!-- Secondary numbers -->
      <text x="122" y="44" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">1</text>
      <text x="145" y="67" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">2</text>
      <text x="145" y="123" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">4</text>
      <text x="122" y="146" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">5</text>
      <text x="58" y="146" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">7</text>
      <text x="35" y="123" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">8</text>
      <text x="35" y="67" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">10</text>
      <text x="58" y="44" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">11</text>
      <!-- Jarum Menit ke angka 3 (90 deg) -->
      <line x1="90" y1="90" x2="148" y2="90" stroke="#0284c7" stroke-width="3" stroke-linecap="round"/>
      <!-- Jarum Jam ke antara 7 dan 8 (sekitar 217.5 deg) -->
      <line x1="90" y1="90" x2="55" y2="118" stroke="#dc2626" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="90" cy="90" r="5" fill="#0f172a"/>
    </svg>`
  },

  // 8. AGAMA: Rukun & Urutan Wudhu
  'agama_wudhu_steps': {
    title: 'Urutan Rukun Wudhu Tertib',
    category: 'agama',
    svg: `<svg viewBox="0 0 280 100" width="260" height="90" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="270" height="90" fill="#f0fdf4" stroke="#16a34a" stroke-width="2" rx="8"/>
      <!-- Step 1 Niat/Muka -->
      <circle cx="38" cy="40" r="22" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="38" y="46" font-family="sans-serif" font-size="16" font-weight="black" fill="#15803d" text-anchor="middle">1</text>
      <text x="38" y="75" font-family="sans-serif" font-size="10" font-weight="bold" fill="#14532d" text-anchor="middle">Membasuh Muka</text>
      <path d="M 68 40 L 80 40" stroke="#16a34a" stroke-width="2.5" marker-end="url(#arrow)"/>
      <!-- Step 2 Tangan -->
      <circle cx="106" cy="40" r="22" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="106" y="46" font-family="sans-serif" font-size="16" font-weight="black" fill="#15803d" text-anchor="middle">2</text>
      <text x="106" y="75" font-family="sans-serif" font-size="10" font-weight="bold" fill="#14532d" text-anchor="middle">Kedua Tangan</text>
      <path d="M 136 40 L 148 40" stroke="#16a34a" stroke-width="2.5"/>
      <!-- Step 3 Kepala -->
      <circle cx="174" cy="40" r="22" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="174" y="46" font-family="sans-serif" font-size="16" font-weight="black" fill="#15803d" text-anchor="middle">3</text>
      <text x="174" y="75" font-family="sans-serif" font-size="10" font-weight="bold" fill="#14532d" text-anchor="middle">Sebagian Kepala</text>
      <path d="M 204 40 L 216 40" stroke="#16a34a" stroke-width="2.5"/>
      <!-- Step 4 Kaki -->
      <circle cx="242" cy="40" r="22" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
      <text x="242" y="46" font-family="sans-serif" font-size="16" font-weight="black" fill="#15803d" text-anchor="middle">4</text>
      <text x="242" y="75" font-family="sans-serif" font-size="10" font-weight="bold" fill="#14532d" text-anchor="middle">Kedua Kaki</text>
    </svg>`
  },

  // 9. AGAMA: Timbangan Amal (Mizan / Keadilan & Kejujuran)
  'agama_mizan_scale': {
    title: 'Timbangan Mizan (Amal Baik & Kejujuran)',
    category: 'agama',
    svg: `<svg viewBox="0 0 200 160" width="170" height="135" xmlns="http://www.w3.org/2000/svg">
      <!-- Base & Tiang -->
      <rect x="75" y="140" width="50" height="12" fill="#b45309" rx="3"/>
      <line x1="100" y1="25" x2="100" y2="140" stroke="#78350f" stroke-width="4"/>
      <!-- Palang Utama Bergerak Miring Sedikit (Amal Kebaikan Lebih Berat) -->
      <line x1="30" y1="45" x2="170" y2="35" stroke="#92400e" stroke-width="3.5"/>
      <circle cx="100" cy="40" r="5" fill="#f59e0b"/>
      <!-- Piring Kiri (Berat ke Bawah: Kebaikan) -->
      <line x1="40" y1="45" x2="25" y2="85" stroke="#78350f" stroke-width="1.5"/>
      <line x1="40" y1="45" x2="55" y2="85" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="40" cy="85" rx="20" ry="7" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
      <text x="40" y="105" font-family="sans-serif" font-size="9" font-weight="bold" fill="#15803d" text-anchor="middle">Pahala (+)</text>
      <!-- Piring Kanan (Naik ke Atas) -->
      <line x1="160" y1="36" x2="145" y2="76" stroke="#78350f" stroke-width="1.5"/>
      <line x1="160" y1="36" x2="175" y2="76" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="160" cy="76" rx="20" ry="7" fill="#fde68a" stroke="#78350f" stroke-width="1.5"/>
      <text x="160" y="96" font-family="sans-serif" font-size="9" fill="#991b1b" text-anchor="middle">Keburukan</text>
    </svg>`
  },

  // 10. AGAMA: Ka'bah & Arah Kiblat
  'agama_kiblat_kaaba': {
    title: 'Ka\'bah & Arah Kiblat Shalat',
    category: 'agama',
    svg: `<svg viewBox="0 0 180 160" width="150" height="135" xmlns="http://www.w3.org/2000/svg">
      <!-- Ground base -->
      <ellipse cx="90" cy="140" rx="70" ry="15" fill="#fef08a" opacity="0.6"/>
      <!-- Kaaba Cube -->
      <!-- Front side -->
      <polygon points="50,60 100,75 100,130 50,115" fill="#18181b" stroke="#09090b" stroke-width="1.5"/>
      <!-- Top Kiswah Golden Band Front -->
      <polygon points="50,75 100,90 100,98 50,83" fill="#eab308"/>
      <!-- Right side -->
      <polygon points="100,75 140,55 140,110 100,130" fill="#27272a" stroke="#09090b" stroke-width="1.5"/>
      <!-- Top Kiswah Golden Band Right -->
      <polygon points="100,90 140,70 140,78 100,98" fill="#ca8a04"/>
      <!-- Roof -->
      <polygon points="50,60 90,40 140,55 100,75" fill="#3f3f46"/>
      <!-- Door -->
      <rect x="65" y="88" width="12" height="24" fill="#ca8a04" rx="1"/>
      <!-- Arrow Kiblat Indicator -->
      <path d="M 90 20 L 90 35 M 85 25 L 90 20 L 95 25" stroke="#15803d" stroke-width="2.5" fill="none"/>
      <text x="90" y="14" font-family="sans-serif" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">KIBLAT</text>
    </svg>`
  }
};

// Ready-to-Use Arabic Snippets Library (Full Harakat, Authentic Quranic/Hadith/Islamic Phrasing & Translations)
export interface ArabicSnippet {
  id: string;
  category: 'qurdis' | 'fiqih' | 'akidah' | 'arab' | 'ski';
  title: string;
  arabicText: string;
  translation: string;
  surahOrSource?: string;
}

export const ARABIC_SNIPPETS_LIBRARY: ArabicSnippet[] = [
  // AL-QUR'AN & HADITS
  {
    id: 'qur_almaun_1_3',
    category: 'qurdis',
    title: 'Surat Al-Ma\'un Ayat 1-3 (Anak Yatim)',
    arabicText: 'أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ ۝ فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ ۝ وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ',
    translation: 'Tahukah kamu (orang) yang mendustakan agama? Maka itulah orang yang menghardik anak yatim, dan tidak mendorong memberi makan orang miskin.',
    surahOrSource: 'QS. Al-Ma\'un [107]: 1-3'
  },
  {
    id: 'qur_attin_1_4',
    category: 'qurdis',
    title: 'Surat At-Tin Ayat 1-4 (Penciptaan Manusia)',
    arabicText: 'وَالتِّينِ وَالزَّيْتُونِ ۝ وَطُورِ سِينِينَ ۝ وَهَٰذَا الْبَلَدِ الْأَمِينِ ۝ لَقَدْ خَلَقْنَا الْإِنسَانَ فِي أَحْسَنِ تَقْوِيمٍ',
    translation: 'Demi (buah) Tin dan (buah) Zaitun, demi gunung Sinai, dan demi negeri (Mekah) yang aman ini. Sungguh, Kami telah menciptakan manusia dalam bentuk yang sebaik-baiknya.',
    surahOrSource: 'QS. At-Tin [95]: 1-4'
  },
  {
    id: 'hadits_ilmu',
    category: 'qurdis',
    title: 'Hadits Kewajiban Menuntut Ilmu',
    arabicText: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَىٰ كُلِّ مُسْلِمٍ',
    translation: 'Menuntut ilmu itu adalah kewajiban bagi setiap muslim.',
    surahOrSource: 'HR. Ibnu Majah'
  },
  {
    id: 'hadits_yatim',
    category: 'qurdis',
    title: 'Hadits Menyayangi Anak Yatim',
    arabicText: 'أَنَا وَكَافِلُ الْيَتِيمِ فِي الْجَنَّةِ هَكَذَا',
    translation: 'Aku dan orang yang mengasuh/menyayangi anak yatim di surga bagaikan dua jari ini (saling berdampingan).',
    surahOrSource: 'HR. Bukhari'
  },
  {
    id: 'hadits_kebersihan',
    category: 'qurdis',
    title: 'Hadits Kebersihan Sebagian dari Iman',
    arabicText: 'النَّظَافَةُ مِنَ الْإِيمَانِ',
    translation: 'Kebersihan itu adalah sebagian dari iman.',
    surahOrSource: 'HR. Tirmidzi'
  },

  // FIQIH & IBADAH
  {
    id: 'fiq_niat_wudhu',
    category: 'fiqih',
    title: 'Niat Berwudhu (Thaharah)',
    arabicText: 'نَوَيْتُ الْوُضُوءَ لِرَفْعِ الْحَدَثِ الْأَصْغَرِ فَرْضًا لِلَّهِ تَعَالَى',
    translation: 'Saya niat berwudhu untuk menghilangkan hadats kecil, fardhu karena Allah Ta\'ala.',
    surahOrSource: 'Ketentuan Bersuci (Fikih Ibadah)'
  },
  {
    id: 'fiq_bacaan_ruku',
    category: 'fiqih',
    title: 'Bacaan Ruku\' dalam Shalat',
    arabicText: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya (dibaca 3 kali).',
    surahOrSource: 'Rukun Bacaan Shalat'
  },
  {
    id: 'fiq_bacaan_sujud',
    category: 'fiqih',
    title: 'Bacaan Sujud dalam Shalat',
    arabicText: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ وَبِحَمْدِهِ',
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya (dibaca 3 kali).',
    surahOrSource: 'Rukun Bacaan Shalat'
  },
  {
    id: 'fiq_niat_zakat',
    category: 'fiqih',
    title: 'Niat Zakat Fitrah',
    arabicText: 'نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِي فَرْضًا لِلَّهِ تَعَالَى',
    translation: 'Aku berniat mengeluarkan zakat fitrah untuk diriku sendiri, fardhu karena Allah Ta\'ala.',
    surahOrSource: 'Ketentuan Zakat Fitrah'
  },

  // AKIDAH AKHLAK
  {
    id: 'akidah_tarji',
    category: 'akidah',
    title: 'Kalimat Thayyibah Tarji\' (Istirja\')',
    arabicText: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    translation: 'Sesungguhnya kami milik Allah dan kepada-Nyalah kami kembali.',
    surahOrSource: 'QS. Al-Baqarah [2]: 156'
  },
  {
    id: 'akidah_hauqalah',
    category: 'akidah',
    title: 'Kalimat Thayyibah Hauqalah',
    arabicText: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    translation: 'Tiada daya dan tiada kekuatan melainkan dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung.',
    surahOrSource: 'Dzikir Kalimat Thayyibah'
  },
  {
    id: 'akidah_asmaul_husna_4',
    category: 'akidah',
    title: 'Lafaz Asmaul Husna (Al-Malik, Al-Quddus, As-Salam, Al-Mu\'min)',
    arabicText: 'الْمَلِكُ ۝ الْقُدُّوسُ ۝ السَّلَامُ ۝ الْمُؤْمِنُ',
    translation: 'Yang Maha Merajai, Yang Maha Suci, Yang Maha Memberi Keselamatan, Yang Maha Mengaruniakan Keamanan.',
    surahOrSource: 'Asmaul Husna (QS. Al-Hasyr: 23)'
  },

  // BAHASA ARAB
  {
    id: 'arab_hiwar_taaruf',
    category: 'arab',
    title: 'Percakapan Perkenalan (At-Ta\'aruf)',
    arabicText: 'عَلِيٌّ : السَّلَامُ عَلَيْكُمْ\nحَسَنٌ : وَعَلَيْكُمُ السَّلَامُ\nعَلِيٌّ : مَا اسْمُكَ يَا أَخِي؟\nحَسَنٌ : اسْمِي حَسَنٌ، وَمَا اسْمُكَ أَنْتَ؟\nعَلِيٌّ : اسْمِي عَلِيٌّ، كَيْفَ حَالُكَ؟\nحَسَنٌ : بِخَيْرٍ وَالْحَمْدُ لِلَّهِ',
    translation: 'Ali: Assalamu\'alaikum | Hasan: Wa\'alaikumussalam | Ali: Siapa namamu saudaraku? | Hasan: Namaku Hasan, dan siapa namamu? | Ali: Namaku Ali, bagaimana kabarmu? | Hasan: Baik, alhamdulillah.',
    surahOrSource: 'Hiwar Bahasa Arab Fase B'
  },
  {
    id: 'arab_mufrodat_sekolah',
    category: 'arab',
    title: 'Kosakata Peralatan Madrasah (Fil Madrasah)',
    arabicText: 'كِتَابٌ (Buku) • قَلَمٌ (Pena) • مِسْطَرَةٌ (Penggaris) • مَحْفَظَةٌ (Tas) • سَبُّورَةٌ (Papan Tulis)',
    translation: 'Kitabun (Buku) - Qalamun (Pena) - Mistharatun (Penggaris) - Mahfazhatun (Tas) - Sabburatun (Papan Tulis)',
    surahOrSource: 'Mufrodat Tematik Kelas 4'
  },

  // SEJARAH KEBUDAYAAN ISLAM (SKI)
  {
    id: 'ski_rasulullah',
    category: 'ski',
    title: 'Gelar Rasulullah ﷺ dan Khulafaur Rasyidin',
    arabicText: 'مُحَمَّدٌ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ • أَبُو بَكْرٍ الصِّدِّيقُ رَضِيَ اللَّهُ عَنْهُ',
    translation: 'Muhammad Utusan Allah (Semoga Allah melimpahkan shalawat dan salam kepadanya) - Abu Bakar Ash-Shiddiq (Semoga Allah meridhoinya).',
    surahOrSource: 'Kisah Sahabat & Khulafaur Rasyidin'
  }
];

// Helper to render math expressions with stacked fractions nicely in HTML/React
export function renderMathFormattedText(text: string): React.ReactNode {
  if (!text) return text;
  
  // Replace fractions like 3/4 or 1/2 with stacked CSS fraction
  const parts = text.split(/(\d+\/\d+)/g);
  if (parts.length === 1) return text;

  return (
    <>
      {parts.map((part, idx) => {
        if (/^\d+\/\d+$/.test(part)) {
          const [num, den] = part.split('/');
          return (
            <span key={idx} className="inline-flex flex-col text-center align-middle mx-1 font-semibold" style={{ verticalAlign: 'middle', fontSize: '0.9em', lineHeight: 1 }}>
              <span className="border-b border-current px-1 text-[0.85em] leading-tight pb-0.5">{num}</span>
              <span className="px-1 text-[0.85em] leading-tight pt-0.5">{den}</span>
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

// Convert Math text to clean HTML string for Word Export with native Word table/sup fractions
export function formatMathForWordExport(text: string): string {
  if (!text) return '';
  
  // Replace fractions 3/4 with inline table fraction for Microsoft Word
  return text.replace(/(\d+)\/(\d+)/g, (_match, num, den) => {
    return `<span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 2pt; font-size: 85%;">` +
      `<span style="display: block; border-bottom: 1pt solid #000; padding: 0 2pt;">${num}</span>` +
      `<span style="display: block; padding: 0 2pt;">${den}</span>` +
      `</span>`;
  })
  .replace(/\^2/g, '<sup>2</sup>')
  .replace(/\^3/g, '<sup>3</sup>')
  .replace(/cm2/g, 'cm<sup>2</sup>')
  .replace(/cm3/g, 'cm<sup>3</sup>')
  .replace(/m2/g, 'm<sup>2</sup>')
  .replace(/m3/g, 'm<sup>3</sup>');
}

interface StimulusGraphicProps {
  graphicKey?: string;
  imageUrl?: string;
  caption?: string;
  className?: string;
  maxHeight?: string;
}

// Visual Stimulus Renderer Component: Renders real SVG or real loaded image, NEVER raw URL text!
export default function StimulusGraphicRenderer({
  graphicKey,
  imageUrl,
  caption,
  className = "my-2 text-center",
  maxHeight = "160px"
}: StimulusGraphicProps) {
  // If SVG preset matches
  if (graphicKey && EDUCATIONAL_GRAPHICS[graphicKey]) {
    const item = EDUCATIONAL_GRAPHICS[graphicKey];
    return (
      <div className={`my-2 text-center inline-block max-w-full ${className}`}>
        <div 
          className="flex justify-center items-center overflow-hidden"
          style={{ maxHeight }}
          dangerouslySetInnerHTML={{ __html: item.svg }} 
        />
        {caption && (
          <p className="text-[10px] text-slate-500 font-semibold mt-1 italic text-center">
            {caption}
          </p>
        )}
      </div>
    );
  }

  // If raw inline SVG markup was provided directly in graphicKey
  if (graphicKey && graphicKey.trim().startsWith('<svg')) {
    return (
      <div className={`my-2 text-center inline-block max-w-full ${className}`}>
        <div 
          className="flex justify-center items-center overflow-hidden"
          style={{ maxHeight }}
          dangerouslySetInnerHTML={{ __html: graphicKey }} 
        />
        {caption && (
          <p className="text-[10px] text-slate-500 font-semibold mt-1 italic text-center">
            {caption}
          </p>
        )}
      </div>
    );
  }

  // If Image URL or Base64 data provided
  if (imageUrl && imageUrl.trim()) {
    return (
      <div className={`my-2 text-center inline-block max-w-full ${className}`}>
        <img 
          src={imageUrl} 
          alt={caption || "Ilustrasi Stimulus Soal"} 
          className="object-contain mx-auto"
          style={{ maxHeight, maxWidth: '100%' }}
          onError={(e) => {
            // Graceful fallback if external image URL is blocked/broken: render educational placeholder SVG
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              const fallbackNotice = document.createElement('div');
              fallbackNotice.className = "p-2 text-amber-800 text-xs font-semibold text-center";
              fallbackNotice.innerHTML = `🖼️ [Ilustrasi Stimulus: ${caption || 'Gambar Penunjang Soal'}]`;
              target.parentElement.appendChild(fallbackNotice);
            }
          }}
        />
        {caption && (
          <p className="text-[10px] text-slate-500 font-semibold mt-1 italic text-center">
            {caption}
          </p>
        )}
      </div>
    );
  }

  // Default fallback if stimulus was set to image but neither key nor url given
  return null;
}
