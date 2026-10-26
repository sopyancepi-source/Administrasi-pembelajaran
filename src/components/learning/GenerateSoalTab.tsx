import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  Printer, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Settings, 
  HelpCircle, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  FileSpreadsheet,
  Image as ImageIcon,
  AlignLeft,
  ListOrdered,
  Percent,
  RefreshCw,
  Copy,
  ChevronDown,
  Info,
  Wand2,
  FolderPlus,
  Target,
  X,
  ChevronRight,
  Sliders,
  Type,
  Columns,
  MoveHorizontal,
  SlidersHorizontal,
  LayoutGrid,
  CheckSquare,
  Heart,
  Shuffle,
  Table,
  Zap,
  Bot
} from 'lucide-react';
import { 
  KBC_PILLARS, 
  KbcPillarType, 
  detectKbcPillar 
} from '../../data/kbcHelpers';
import { 
  QuestionItem, 
  ExamConfig, 
  QuestionType, 
  StimulusType, 
  CognitiveLevel, 
  SubjectItem, 
  SubjectCPData,
  ExamCPItem,
  ExamTPItem,
  ExamPaperLayout,
  ExamPaperSize,
  ExamFontFamily,
  ExamMarginPreset,
  ExamQuestionSpacing
} from '../../types/learning';
import { 
  DEFAULT_EXAM_CONFIG, 
  SAMPLE_QUESTIONS_AKIDAH, 
  DEFAULT_CP_LIST_AKIDAH,
  SUBJECT_MULTI_CP_PRESETS,
  generateAutoTPFromCP,
  formatClassToRomanLabel,
  DEFAULT_PAPER_LAYOUT,
  PAPER_DIMENSIONS,
  FONT_FAMILY_OPTIONS,
  FONT_SIZE_OPTIONS,
  MARGIN_PRESETS
} from '../../data/soalDefaults';
import StimulusGraphicRenderer, { 
  EDUCATIONAL_GRAPHICS, 
  ARABIC_SNIPPETS_LIBRARY, 
  renderMathFormattedText, 
  formatMathForWordExport 
} from './StimulusGraphicRenderer';
import StimulusTableRenderer, { renderStimulusTableToWordHtml } from './StimulusTableRenderer';
import { 
  SAMPLE_QUESTIONS_MATEMATIKA, 
  SAMPLE_QUESTIONS_FIQIH, 
  SAMPLE_QUESTIONS_QURDIS, 
  SAMPLE_QUESTIONS_BAHASA_ARAB, 
  getSubjectSampleQuestions 
} from '../../data/soalSubjectBank';
import {
  getAuthenticQuestionTemplate,
  enrichQuestionWithGraphicBinding,
  SVG_GRAPHIC_BINDINGS
} from '../../data/smartQuestionEngine';
import {
  convertSvgToPngBase64,
  convertImageSrcToPngBase64,
  buildWordMhtmlDocument,
  WordEmbeddedImage
} from '../../utils/wordExportHelper';

// Authentic Madrasah / Educational Yayasan Logo (Green & Gold Shield Emblem)
function MadrasahEmblemSVG({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,4 94,22 82,86 50,98 18,86 6,22" fill="#15803d" stroke="#14532d" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="50,8 89,24 78,82 50,93 22,82 11,24" fill="#166534" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="28" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="24" fill="#047857" />
      <circle cx="50" cy="50" r="20" stroke="#fde68a" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M50 32 L52 38 L58 38 L53 42 L55 48 L50 44 L45 48 L47 42 L42 38 L48 38 Z" fill="#fbbf24" />
      <path d="M50 56 Q40 50 34 52 L34 60 Q40 58 50 63 Q60 58 66 60 L66 52 Q60 50 50 56 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
      <path d="M50 56 L50 63" stroke="#15803d" strokeWidth="1.5" />
      <circle cx="50" cy="48" r="2.5" fill="#fbbf24" />
      <path d="M26 78 Q50 72 74 78 L78 84 Q50 78 22 84 Z" fill="#ffffff" stroke="#f59e0b" strokeWidth="1" />
      <text x="50" y="82" textAnchor="middle" fill="#15803d" fontSize="5" fontWeight="900" letterSpacing="0.4">IKHLAS BERAMAL</text>
    </svg>
  );
}

interface GenerateSoalTabProps {
  subjects?: SubjectItem[];
  selectedClassLevel?: string;
  setSelectedClassLevel?: (cls: string) => void;
  cpDataMap?: Record<string, SubjectCPData>;
  onOpenCpModal?: () => void;
  schoolName?: string;
  schoolLogo?: string;
  principalName?: string;
  principalNip?: string;
  teacherName?: string;
  teacherNip?: string;
  signaturePlace?: string;
  signatureDate?: string;
  selectedYear?: number;
  onBackToPerangkat?: () => void;
}

export default function GenerateSoalTab({
  subjects = [],
  selectedClassLevel = 'Kelas 4',
  setSelectedClassLevel,
  cpDataMap = {},
  onOpenCpModal,
  schoolName = 'Madrasah Ibtidaiyah Cibungur I',
  schoolLogo,
  principalName = 'H. Ahmad Syahid, M.Pd.I',
  principalNip = '197503152005011004',
  teacherName = 'Cepi Sopyan, S.Pd.',
  teacherNip = '198806202023211008',
  signaturePlace = 'Cibungur',
  signatureDate,
  selectedYear = 2026,
  onBackToPerangkat
}: GenerateSoalTabProps) {
  // Active inner subtab
  const [activeView, setActiveView] = useState<'config' | 'questions' | 'kisikisi' | 'preview' | 'kunci'>('config');

  // Active modal popup for configuration domain ('identitas' | 'cp' | 'komposisi' | 'stimulus' | 'kaidah' | 'tataLetak' | null)
  const [activeModal, setActiveModal] = useState<'identitas' | 'cp' | 'komposisi' | 'stimulus' | 'kaidah' | 'tataLetak' | null>(null);

  // Exam Paper Layout & Typography Configuration State (Font, Ukuran Huruf, Ukuran Kertas, Margin, Kolom)
  const [paperLayout, setPaperLayout] = useState<ExamPaperLayout>(() => {
    const saved = localStorage.getItem('school_exam_paper_layout');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PAPER_LAYOUT, ...parsed };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PAPER_LAYOUT;
  });

  // Helper to update margin presets
  const handleApplyMarginPreset = (preset: ExamMarginPreset) => {
    const conf = MARGIN_PRESETS[preset];
    setPaperLayout(prev => ({
      ...prev,
      marginPreset: preset,
      marginTopCm: conf.top,
      marginBottomCm: conf.bottom,
      marginLeftCm: conf.left,
      marginRightCm: conf.right
    }));
  };

  // Exam Configuration State with Multi-CP
  const [config, setConfig] = useState<ExamConfig>(() => {
    const saved = localStorage.getItem('school_exam_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure cpList exists
        if (!parsed.cpList || !Array.isArray(parsed.cpList) || parsed.cpList.length === 0) {
          parsed.cpList = DEFAULT_CP_LIST_AKIDAH;
        }
        if (parsed.jumlahPgKompleks === undefined) parsed.jumlahPgKompleks = 5;
        if (parsed.bobotPgKompleks === undefined) parsed.bobotPgKompleks = 4;
        if (!parsed.modeStimulus) parsed.modeStimulus = 'grup';
        if (!parsed.grupQuestionCount) parsed.grupQuestionCount = 4;
        if (!parsed.namaYayasan) parsed.namaYayasan = 'YAYASAN PERGURUAN MUSLIMIN (YPM)';
        if (!parsed.namaMadrasah) parsed.namaMadrasah = schoolName || 'MADRASAH IBTIDAIYAH CIBUNGUR I';
        if (parsed.hariTanggal === undefined) parsed.hariTanggal = '';
        if (!parsed.waktuPelaksanaan) parsed.waktuPelaksanaan = parsed.alokasiWaktu || '07.30 – 09.00';
        if (parsed.customClassLabel === undefined) parsed.customClassLabel = '';
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      ...DEFAULT_EXAM_CONFIG,
      tingkatKelas: selectedClassLevel || 'Kelas 4',
      tahunPelajaran: `${selectedYear}/${selectedYear + 1}`,
      namaYayasan: 'YAYASAN PERGURUAN MUSLIMIN (YPM)',
      namaMadrasah: schoolName || 'MADRASAH IBTIDAIYAH CIBUNGUR I',
      hariTanggal: '',
      waktuPelaksanaan: '07.30 – 09.00',
      customClassLabel: '',
      cpList: DEFAULT_CP_LIST_AKIDAH
    };
  });

  // Question List State
  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    const saved = localStorage.getItem('school_exam_questions');
    if (saved) {
      try {
        const parsed: QuestionItem[] = JSON.parse(saved);
        const letters: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
        return parsed.map((item, idx) => {
          // Prevent stimulus collision: if question has a diagram/SVG, clear leftover table; if table, clear SVG
          const hasSvg = !!item.stimulusSvg || !!item.stimulusImageUrl || item.stimulusType === 'gambar';
          const hasTable = !!item.stimulusTable && item.stimulusType === 'tabel';

          // Repair question text if generic placeholder "Pertanyaan nomor X"
          let qText = String(item.questionText || '').trim();
          if (!qText || /^pertanyaan\s*(nomor\s*)?\d+$/i.test(qText)) {
            const materi = item.materiPokok || 'pembelajaran';
            if (item.type === 'pg') {
              qText = `Berdasarkan pemahaman materi ${materi}, jawaban yang paling tepat adalah ...`;
            } else if (item.type === 'pg_kompleks') {
              qText = `Perhatikan pernyataan terkait materi ${materi} berikut ini! Manakah pernyataan yang paling tepat?`;
            } else if (item.type === 'isian') {
              qText = `Konsep atau istilah penting dalam pembahasan materi ${materi} adalah ...`;
            } else {
              qText = `Jelaskan secara runtut konsep ${materi} dan berikan contoh penerapannya dalam kehidupan sehari-hari!`;
            }
          }

          // Normalize options so that each item has a guaranteed { label, text }
          let normalizedOptions = item.options;
          if (Array.isArray(normalizedOptions) && normalizedOptions.length > 0) {
            normalizedOptions = normalizedOptions.map((opt: any, optIdx: number) => {
              if (typeof opt === 'string') {
                return {
                  label: letters[optIdx] || 'A',
                  text: opt.replace(/^[A-Da-d][\.\)]\s*/, '').trim() || `Pilihan ${letters[optIdx] || 'A'}`
                };
              }
              const label = (opt?.label || letters[optIdx] || 'A') as 'A' | 'B' | 'C' | 'D';
              const rawText = opt?.text !== undefined && opt?.text !== null ? String(opt.text) : (typeof opt === 'object' ? JSON.stringify(opt) : '');
              const cleanText = rawText.replace(/^[A-Da-d][\.\)]\s*/, '').trim();
              return {
                label,
                text: cleanText || `Pilihan ${label}`
              };
            });
          }

          return {
            ...item,
            questionText: qText,
            options: normalizedOptions,
            stimulusTable: hasSvg && !hasTable ? undefined : item.stimulusTable,
            stimulusSvg: hasTable && !hasSvg ? undefined : item.stimulusSvg,
            classLevel: item.classLevel || 'Kelas 4',
            ipk: item.ipk || `Menguasai konsep dan kompetensi materi ${item.materiPokok || 'pembelajaran'}.`
          };
        });
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_QUESTIONS_AKIDAH;
  });

  // Filter for questions list
  const [typeFilter, setTypeFilter] = useState<'all' | 'pg' | 'pg_kompleks' | 'isian' | 'esai'>('all');

  // Inline editing question ID
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Target question for Arabic snippet or Graphic picker modal
  const [pickerTargetQuestionId, setPickerTargetQuestionId] = useState<string | null>(null);
  const [showArabicSnippetModal, setShowArabicSnippetModal] = useState<boolean>(false);
  const [showGraphicModal, setShowGraphicModal] = useState<boolean>(false);
  const [arabicSearchQuery, setArabicSearchQuery] = useState<string>('');
  const [graphicCategoryFilter, setGraphicCategoryFilter] = useState<'all' | 'matematika' | 'agama'>('all');
  const [isExportingWord, setIsExportingWord] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [aiProgressText, setAiProgressText] = useState<string>('');
  const [lastGenerationMode, setLastGenerationMode] = useState<'coding' | 'ai' | null>(() => {
    return (localStorage.getItem('school_exam_last_gen_mode') as 'coding' | 'ai') || null;
  });

  // Auto-save
  useEffect(() => {
    localStorage.setItem('school_exam_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('school_exam_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('school_exam_paper_layout', JSON.stringify(paperLayout));
  }, [paperLayout]);

  // Sync class level if parent changes
  useEffect(() => {
    if (selectedClassLevel && selectedClassLevel !== config.tingkatKelas) {
      const clsNum = parseInt(selectedClassLevel.replace(/\D/g, ''), 10) || 4;
      const fase = clsNum <= 2 ? 'Fase A' : clsNum <= 4 ? 'Fase B' : 'Fase C';
      setConfig(prev => ({ ...prev, tingkatKelas: selectedClassLevel, fase }));
    }
  }, [selectedClassLevel]);

  // Total Scores Calculation
  const totalScorePg = useMemo(() => config.jumlahPg * config.bobotPg, [config.jumlahPg, config.bobotPg]);
  const totalScorePgKompleks = useMemo(() => (config.jumlahPgKompleks || 0) * (config.bobotPgKompleks || 0), [config.jumlahPgKompleks, config.bobotPgKompleks]);
  const totalScoreIsian = useMemo(() => config.jumlahIsian * config.bobotIsian, [config.jumlahIsian, config.bobotIsian]);
  const totalScoreEsai = useMemo(() => config.jumlahEsai * config.bobotEsai, [config.jumlahEsai, config.bobotEsai]);
  const grandTotalScore = useMemo(() => totalScorePg + totalScorePgKompleks + totalScoreIsian + totalScoreEsai, [totalScorePg, totalScorePgKompleks, totalScoreIsian, totalScoreEsai]);
  const totalQuestionCount = useMemo(() => config.jumlahPg + (config.jumlahPgKompleks || 0) + config.jumlahIsian + config.jumlahEsai, [config.jumlahPg, config.jumlahPgKompleks, config.jumlahIsian, config.jumlahEsai]);

  // Total TPs count across all CPs
  const totalTpCount = useMemo(() => {
    return (config.cpList || []).reduce((sum, cp) => sum + (cp.tpList?.length || 0), 0);
  }, [config.cpList]);

  // Actual questions in list summary
  const actualPgCount = useMemo(() => questions.filter(q => q.type === 'pg').length, [questions]);
  const actualPgKompleksCount = useMemo(() => questions.filter(q => q.type === 'pg_kompleks').length, [questions]);
  const actualIsianCount = useMemo(() => questions.filter(q => q.type === 'isian').length, [questions]);
  const actualEsaiCount = useMemo(() => questions.filter(q => q.type === 'esai').length, [questions]);

  // Auto-adjust weights so total score equals exactly 100
  const handleAutoAdjustWeights = () => {
    const targetTotal = 100;
    const nPg = Math.max(0, config.jumlahPg);
    const nPgK = Math.max(0, config.jumlahPgKompleks || 0);
    const nIsian = Math.max(0, config.jumlahIsian);
    const nEsai = Math.max(0, config.jumlahEsai);

    let bPg = nPg > 0 ? Math.round(30 / nPg) || 1 : 0;
    let bPgK = nPgK > 0 ? Math.round(25 / nPgK) || 2 : 0;
    let bIsian = nIsian > 0 ? Math.round(25 / nIsian) || 3 : 0;
    let bEsai = nEsai > 0 ? Math.round(20 / nEsai) || 5 : 0;

    let total = (nPg * bPg) + (nPgK * bPgK) + (nIsian * bIsian) + (nEsai * bEsai);
    let diff = targetTotal - total;

    if (diff !== 0 && nEsai > 0) {
      bEsai += Math.floor(diff / nEsai);
      total = (nPg * bPg) + (nPgK * bPgK) + (nIsian * bIsian) + (nEsai * bEsai);
      diff = targetTotal - total;
      if (diff !== 0 && nPg > 0) {
        bPg += Math.floor(diff / nPg);
      }
    }

    setConfig(prev => ({
      ...prev,
      bobotPg: Math.max(1, bPg),
      bobotPgKompleks: Math.max(1, bPgK),
      bobotIsian: Math.max(1, bIsian),
      bobotEsai: Math.max(1, bEsai),
    }));
  };

  // MULTI-CP HANDLERS (User determines CP count flexibly)
  const handleSetCpCount = (targetCount: number) => {
    const count = Math.max(1, Math.min(10, targetCount));
    const currentList = config.cpList || [];
    if (count === currentList.length) return;

    if (count > currentList.length) {
      const toAdd = count - currentList.length;
      const newItems: ExamCPItem[] = [];
      for (let i = 0; i < toAdd; i++) {
        const nextIdx = currentList.length + i + 1;
        const newCp: ExamCPItem = {
          id: `cp-${Date.now()}-${i}`,
          code: `CP ${nextIdx}`,
          elemen: `Elemen Kompetensi ${nextIdx}`,
          capaianPembelajaran: `Peserta didik mampu memahami, menjelaskan, dan mengaplikasikan kompetensi lingkup materi ke-${nextIdx} sesuai kaidah pembelajaran.`,
          materiPokok: `Materi Pokok / Bab ${nextIdx}`,
          tpList: []
        };
        newCp.tpList = generateAutoTPFromCP(newCp.capaianPembelajaran, newCp.elemen, newCp.materiPokok, nextIdx, config.mataPelajaran);
        newItems.push(newCp);
      }
      setConfig(prev => ({
        ...prev,
        cpList: [...currentList, ...newItems]
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        cpList: currentList.slice(0, count)
      }));
    }
  };

  const handleAddCP = () => {
    const nextIdx = (config.cpList || []).length + 1;
    const newCp: ExamCPItem = {
      id: `cp-${Date.now()}`,
      code: `CP ${nextIdx}`,
      elemen: `Elemen ${nextIdx}`,
      capaianPembelajaran: `Peserta didik mampu memahami materi pokok pembelajaran ke-${nextIdx}...`,
      materiPokok: `Materi Pokok ${nextIdx}`,
      tpList: []
    };
    newCp.tpList = generateAutoTPFromCP(newCp.capaianPembelajaran, newCp.elemen, newCp.materiPokok, nextIdx, config.mataPelajaran);
    setConfig(prev => ({
      ...prev,
      cpList: [...(prev.cpList || []), newCp]
    }));
  };

  const handleRemoveCP = (cpId: string) => {
    if ((config.cpList || []).length <= 1) {
      alert('Minimal harus ada 1 Capaian Pembelajaran (CP) dalam naskah asesmen.');
      return;
    }
    setConfig(prev => {
      const filtered = prev.cpList.filter(c => c.id !== cpId);
      return {
        ...prev,
        cpList: filtered.map((c, i) => ({ ...c, code: `CP ${i + 1}` }))
      };
    });
  };

  const handleUpdateCPField = (cpId: string, field: keyof ExamCPItem, value: any) => {
    setConfig(prev => ({
      ...prev,
      cpList: prev.cpList.map(c => c.id === cpId ? { ...c, [field]: value } : c)
    }));
  };

  // AUTOMATIC TP GENERATION FOR A SPECIFIC CP (Tombol TP Otomatis)
  const handleGenerateAutoTPForCP = (cpId: string) => {
    const targetCP = config.cpList.find(c => c.id === cpId);
    if (!targetCP) return;

    const cpIdx = config.cpList.findIndex(c => c.id === cpId) + 1;
    const newTps = generateAutoTPFromCP(
      targetCP.capaianPembelajaran, 
      targetCP.elemen, 
      targetCP.materiPokok, 
      cpIdx,
      config.mataPelajaran
    );

    setConfig(prev => ({
      ...prev,
      cpList: prev.cpList.map(c => c.id === cpId ? { ...c, tpList: newTps } : c)
    }));
  };

  // AUTOMATIC TP GENERATION FOR ALL CPs AT ONCE
  const handleGenerateAllAutoTP = () => {
    setConfig(prev => ({
      ...prev,
      cpList: prev.cpList.map((cp, idx) => ({
        ...cp,
        tpList: generateAutoTPFromCP(cp.capaianPembelajaran, cp.elemen, cp.materiPokok, idx + 1, config.mataPelajaran)
      }))
    }));
    alert(`Berhasil merumuskan Tujuan Pembelajaran (TP) otomatis untuk seluruh ${config.cpList.length} CP!`);
  };

  // Add TP manually to a specific CP
  const handleAddManualTP = (cpId: string) => {
    const targetCP = config.cpList.find(c => c.id === cpId);
    if (!targetCP) return;

    const cpIdx = config.cpList.findIndex(c => c.id === cpId) + 1;
    const tpCount = (targetCP.tpList || []).length + 1;

    const newTp: ExamTPItem = {
      id: `tp-manual-${Date.now()}`,
      code: `TP ${cpIdx}.${tpCount}`,
      text: `Peserta didik mampu... (tuliskan rumusan TP baru)`,
      materiPokok: targetCP.materiPokok
    };

    setConfig(prev => ({
      ...prev,
      cpList: prev.cpList.map(c => c.id === cpId ? {
        ...c,
        tpList: [...(c.tpList || []), newTp]
      } : c)
    }));
  };

  // Remove TP from a CP
  const handleRemoveTP = (cpId: string, tpId: string) => {
    setConfig(prev => ({
      ...prev,
      cpList: prev.cpList.map(c => {
        if (c.id === cpId) {
          const filtered = (c.tpList || []).filter(t => t.id !== tpId);
          return { ...c, tpList: filtered };
        }
        return c;
      })
    }));
  };

  // Update single TP text
  const handleUpdateTPText = (cpId: string, tpId: string, text: string) => {
    setConfig(prev => ({
      ...prev,
      cpList: prev.cpList.map(c => {
        if (c.id === cpId) {
          return {
            ...c,
            tpList: (c.tpList || []).map(t => t.id === tpId ? { ...t, text } : t)
          };
        }
        return c;
      })
    }));
  };

  // Helper to resolve preset CP by subject name
  const findSubjectPreset = (name: string): ExamCPItem[] => {
    const norm = (name || '').toLowerCase().trim();
    if (norm.includes('akidah') || norm.includes('aqidah')) {
      return DEFAULT_CP_LIST_AKIDAH;
    }
    if (norm.includes('fiqih') || norm.includes('fikih')) {
      return SUBJECT_MULTI_CP_PRESETS['Fiqih'] || DEFAULT_CP_LIST_AKIDAH;
    }
    if (norm.includes('matematika') || norm.includes('mtk')) {
      return SUBJECT_MULTI_CP_PRESETS['Matematika'] || DEFAULT_CP_LIST_AKIDAH;
    }
    if (norm.includes('qur') || norm.includes('hadis') || norm.includes('hadits')) {
      return SUBJECT_MULTI_CP_PRESETS['Al-Qur\'an Hadis'] || DEFAULT_CP_LIST_AKIDAH;
    }
    if (norm.includes('arab')) {
      return SUBJECT_MULTI_CP_PRESETS['Bahasa Arab'] || DEFAULT_CP_LIST_AKIDAH;
    }
    if (norm.includes('indonesia')) {
      return SUBJECT_MULTI_CP_PRESETS['Bahasa Indonesia'] || DEFAULT_CP_LIST_AKIDAH;
    }
    if (norm.includes('ipas') || norm.includes('ipa') || norm.includes('ips') || norm.includes('sains')) {
      return SUBJECT_MULTI_CP_PRESETS['IPAS'] || DEFAULT_CP_LIST_AKIDAH;
    }
    return SUBJECT_MULTI_CP_PRESETS[name] || DEFAULT_CP_LIST_AKIDAH;
  };

  // Helper to resolve pre-built questions with finished SVGs and Arabic harakat
  const findSubjectQuestions = (name: string): QuestionItem[] | null => {
    const norm = (name || '').toLowerCase().trim();
    if (norm.includes('akidah') || norm.includes('aqidah')) {
      return SAMPLE_QUESTIONS_AKIDAH;
    }
    const sample = getSubjectSampleQuestions(name);
    if (sample && sample.length > 0) {
      return sample;
    }
    return null;
  };

  // 1-KLIK AUTO-PILOT (MODE TERIMA JADI - GURU TIDAK PERLU PUSING MIKIR)
  const handleOneClickAutoPilot = (targetSubject?: string) => {
    const subj = targetSubject || config.mataPelajaran || 'Fiqih';
    const presetCP = findSubjectPreset(subj);
    const presetQuestions = findSubjectQuestions(subj);

    const cpCount = presetCP.length;
    const materiJoined = presetCP.map(p => p.materiPokok).join(', ');

    if (presetQuestions && presetQuestions.length > 0) {
      const nPg = presetQuestions.filter(q => q.type === 'pg').length;
      const nPgK = presetQuestions.filter(q => q.type === 'pg_kompleks').length;
      const nIsian = presetQuestions.filter(q => q.type === 'isian').length;
      const nEsai = presetQuestions.filter(q => q.type === 'esai').length;

      setConfig(prev => ({
        ...prev,
        mataPelajaran: subj,
        cpList: presetCP,
        materiPokok: materiJoined,
        jumlahPg: nPg,
        jumlahPgKompleks: nPgK,
        jumlahIsian: nIsian,
        jumlahEsai: nEsai
      }));

      setQuestions(presetQuestions.map(q => {
        const detected = detectKbcPillar(q.questionText, q.materiPokok, q.stimulusText, subj);
        return {
          ...q,
          kbcPillar: q.kbcPillar || detected.pillar,
          kbcDescription: q.kbcDescription || detected.description
        };
      }));
    } else {
      // Dynamic generation for other subjects
      setConfig(prev => ({
        ...prev,
        mataPelajaran: subj,
        cpList: presetCP,
        materiPokok: materiJoined
      }));

      // Generate authentic question items using smartQuestionEngine
      const newItems: QuestionItem[] = [];
      let qNum = 1;

      // PG items
      for (let i = 1; i <= config.jumlahPg; i++) {
        const cp = presetCP[(i - 1) % cpCount];
        const tp = (cp.tpList && cp.tpList.length > 0) ? cp.tpList[(i - 1) % cp.tpList.length] : null;
        const template = getAuthenticQuestionTemplate(subj, cp.materiPokok, i);
        const optionsCount = config.opsiPgCount || 4;
        const slicedOptions = template.options.slice(0, optionsCount);
        const validCorrect = slicedOptions.some(o => o.label === template.correct) ? template.correct : 'A';

        let qItem: QuestionItem = {
          id: `soal-${Date.now()}-${qNum}`,
          number: qNum,
          type: 'pg',
          stimulusType: template.stimulusType || 'cerita',
          stimulusTitle: template.stimulusTitle,
          stimulusText: template.stimulusText,
          stimulusTable: template.stimulusTable,
          stimulusSvg: template.stimulusSvg,
          questionText: template.stem,
          options: slicedOptions,
          correctAnswer: validCorrect,
          score: config.bobotPg,
          cognitiveLevel: template.cognitiveLevel,
          indikatorSoal: template.indikator,
          ipk: template.ipk,
          classLevel: config.tingkatKelas,
          materiPokok: cp.materiPokok,
          capaianPembelajaran: cp.capaianPembelajaran,
          cpId: cp.id,
          cpCode: cp.code,
          tpCode: tp?.code || 'TP 1.1',
          tujuanPembelajaran: tp?.text || 'Memahami materi pokok secara runtut.',
          rubrikPenilaian: template.rubrik,
          kbcPillar: template.kbcPillar,
          kbcDescription: template.kbcDesc
        };

        if (template.stimulusSvg) {
          qItem = enrichQuestionWithGraphicBinding(qItem, template.stimulusSvg);
        }

        newItems.push(qItem);
        qNum++;
      }

      // PG Kompleks
      for (let i = 1; i <= (config.jumlahPgKompleks || 3); i++) {
        const cp = presetCP[(i - 1) % cpCount];
        const template = getAuthenticQuestionTemplate(subj, cp.materiPokok, i);
        const statements = template.complexStatements || [
          `1. Memahami kaidah utama materi ${cp.materiPokok} dengan baik dan benar.`,
          `2. Menunjukkan sikap disiplin yang selaras dengan nilai ${cp.elemen}.`,
          `3. Mengabaikan ketentuan yang berlaku pada pembahasan ${cp.materiPokok}.`,
          `4. Menolak bekerja sama dalam pelaksanaan kegiatan ${cp.elemen}.`
        ];
        const complexOpts = template.complexOptions || [
          { label: 'A' as const, text: 'Pernyataan (1), (2), dan (3) benar' },
          { label: 'B' as const, text: 'Pernyataan (1) dan (4) saja yang benar' },
          { label: 'C' as const, text: 'Pernyataan (2) dan (4) saja yang benar' },
          { label: 'D' as const, text: 'Semua pernyataan benar' }
        ];

        newItems.push({
          id: `soal-${Date.now()}-${qNum}`,
          number: qNum,
          type: 'pg_kompleks',
          stimulusType: template.stimulusType || 'cerita',
          stimulusTitle: template.stimulusTitle,
          stimulusText: template.stimulusText,
          stimulusTable: template.stimulusTable,
          stimulusSvg: template.stimulusSvg,
          questionText: `Perhatikan beberapa pernyataan di bawah ini terkait materi ${cp.materiPokok}!\nBerdasarkan daftar pernyataan di atas, manakah pernyataan yang BENAR dan TEPAT?`,
          complexStatements: statements,
          options: complexOpts,
          correctAnswer: 'A',
          score: config.bobotPgKompleks || 4,
          cognitiveLevel: 'L3',
          indikatorSoal: `Disajikan 4 pernyataan materi ${cp.materiPokok}, peserta didik dapat memvalidasi kombinasi pernyataan yang benar (PG Kompleks MCMA).`,
          ipk: template.ipk,
          classLevel: config.tingkatKelas,
          materiPokok: cp.materiPokok,
          capaianPembelajaran: cp.capaianPembelajaran,
          cpId: cp.id,
          cpCode: cp.code,
          rubrikPenilaian: `Pilihan kombinasi A bernilai ${config.bobotPgKompleks || 4} poin. Pilihan lain 0 poin.`,
          kbcPillar: template.kbcPillar,
          kbcDescription: template.kbcDesc
        });
        qNum++;
      }

      // Isian
      for (let i = 1; i <= config.jumlahIsian; i++) {
        const cp = presetCP[(i - 1) % cpCount];
        const template = getAuthenticQuestionTemplate(subj, cp.materiPokok, i);
        newItems.push({
          id: `soal-${Date.now()}-${qNum}`,
          number: qNum,
          type: 'isian',
          stimulusType: 'none',
          questionText: template.isianQuestion || `Pada pokok bahasan ${cp.materiPokok}, istilah penting atau konsep utama yang menjelaskan tentang ${cp.elemen} adalah ...`,
          correctAnswer: template.isianAnswer || `Kaidah ${cp.materiPokok}`,
          score: config.bobotIsian,
          cognitiveLevel: 'L2',
          indikatorSoal: `Peserta didik dapat melengkapi jawaban singkat materi ${cp.materiPokok}.`,
          ipk: template.ipk,
          classLevel: config.tingkatKelas,
          materiPokok: cp.materiPokok,
          capaianPembelajaran: cp.capaianPembelajaran,
          rubrikPenilaian: `Jawaban tepat bernilai ${config.bobotIsian} poin. Kurang tepat bernilai 0.`,
          kbcPillar: template.kbcPillar,
          kbcDescription: template.kbcDesc
        });
        qNum++;
      }

      // Esai
      for (let i = 1; i <= config.jumlahEsai; i++) {
        const cp = presetCP[(i - 1) % cpCount];
        const template = getAuthenticQuestionTemplate(subj, cp.materiPokok, i);
        newItems.push({
          id: `soal-${Date.now()}-${qNum}`,
          number: qNum,
          type: 'esai',
          stimulusType: 'none',
          questionText: template.esaiQuestion || `Jelaskan secara runtut konsep ${cp.materiPokok} dan berikan 2 (dua) contoh konkret penerapannya dalam kehidupan sehari-hari di madrasah!`,
          correctAnswer: template.esaiAnswer || `1. Uraian konsep dasar ${cp.materiPokok}.\n2. Dua contoh penerapan nyata di madrasah/rumah.\n3. Hikmah serta kesimpulan positif.`,
          score: config.bobotEsai,
          cognitiveLevel: 'L3',
          indikatorSoal: `Peserta didik dapat menganalisis dan menguraikan penerapan ${cp.materiPokok}.`,
          ipk: template.ipk,
          classLevel: config.tingkatKelas,
          materiPokok: cp.materiPokok,
          capaianPembelajaran: cp.capaianPembelajaran,
          rubrikPenilaian: `Menjawab lengkap dan sistematis bernilai ${config.bobotEsai} poin. Kurang lengkap bernilai ${Math.round(config.bobotEsai / 2)} poin.`,
          kbcPillar: template.kbcPillar,
          kbcDescription: template.kbcDesc
        });
        qNum++;
      }

      setQuestions(newItems);
    }

    // Auto close any modal
    setActiveModal(null);

    // Switch directly to student exam paper preview
    setActiveView('preview');
  };

  // Load Preset Multi-CP & TP from Subject Defaults or stored CP/TP bank
  const handleLoadSubjectPreset = (subjectName: string) => {
    handleOneClickAutoPilot(subjectName);
  };

  // Auto-enrich all questions so that 100% of questions contain contextual stimuli (narasi/tabel/gambar/ayat)
  const handleAutoEnrichAllStimuli = () => {
    let enrichedCount = 0;
    const isMath = config.mataPelajaran.toLowerCase().includes('matematika') || config.mataPelajaran.toLowerCase().includes('mtk');
    const isFiqih = config.mataPelajaran.toLowerCase().includes('fiqih') || config.mataPelajaran.toLowerCase().includes('fikih');
    const isQurdis = config.mataPelajaran.toLowerCase().includes('qur') || config.mataPelajaran.toLowerCase().includes('hadis') || config.mataPelajaran.toLowerCase().includes('hadits');
    const isArab = config.mataPelajaran.toLowerCase().includes('arab');

    const updated = questions.map((q, idx) => {
      // If question lacks stimulus
      if (q.stimulusType === 'none' || (!q.stimulusText && !q.stimulusSvg && !q.arabicText && !q.stimulusTable && !q.stimulusImageUrl)) {
        enrichedCount++;
        if (isMath) {
          const mathSvgs = ['math_fraction_3_4', 'math_triangle_right', 'math_rectangle', 'math_cuboid_3d', 'math_bar_chart', 'math_clock_0715'];
          const cycle = idx % 3;
          if (cycle === 1) {
            // Visual SVG Diagram
            const chosenSvg = mathSvgs[Math.floor(idx / 3) % mathSvgs.length];
            return enrichQuestionWithGraphicBinding(q, chosenSvg);
          } else if (cycle === 2) {
            // Numerical Data Table
            const tables = [
              {
                title: 'Data Nilai Ulangan Matematika Kelas V',
                table: 'Nilai | Banyak Siswa (Frekuensi)\n70 | 4 orang\n80 | 10 orang\n90 | 8 orang\n100 | 3 orang',
                qText: 'Berdasarkan tabel distribusi nilai di atas, banyak siswa yang memperoleh nilai di atas 80 adalah ...',
                options: [{ label: 'A', text: '4 orang' }, { label: 'B', text: '8 orang' }, { label: 'C', text: '11 orang' }, { label: 'D', text: '21 orang' }],
                correct: 'C' as const,
                ind: 'Disajikan tabel frekuensi nilai, siswa dapat menghitung banyak data dengan kriteria tertentu.'
              },
              {
                title: 'Daftar Harga dan Belanja Alat Tulis Koperasi Madrasah',
                table: 'Nama Barang | Harga Satuan | Jumlah Beli\nBuku Tulis | Rp4.000,00 | 5 buah\nPulpen | Rp2.500,00 | 4 buah\nPenghapus | Rp1.500,00 | 2 buah',
                qText: 'Berdasarkan tabel harga dan belanjaan di atas, jika Ahmad membayar dengan selembar uang Rp50.000,00, uang kembalian yang diterima Ahmad adalah ...',
                options: [{ label: 'A', text: 'Rp17.000,00' }, { label: 'B', text: 'Rp19.000,00' }, { label: 'C', text: 'Rp21.000,00' }, { label: 'D', text: 'Rp33.000,00' }],
                correct: 'A' as const,
                ind: 'Disajikan tabel belanjaan barang, siswa dapat menyelesaikan operasi hitung campuran uang.'
              },
              {
                title: 'Daftar Berat Bahan Sembako Bantuan Sosial',
                table: 'Nama Komoditas | Berat Satuan | Jumlah Paket\nBeras | 5 kg | 8 karung\nGula Pasir | 1 kg | 12 bungkus\nMinyak Goreng | 2 kg | 5 jeriken',
                qText: 'Berdasarkan tabel di atas, total berat seluruh paket sembako bantuan sosial adalah ...',
                options: [{ label: 'A', text: '52 kg' }, { label: 'B', text: '62 kg' }, { label: 'C', text: '72 kg' }, { label: 'D', text: '82 kg' }],
                correct: 'B' as const,
                ind: 'Disajikan tabel komoditas dan berat, siswa dapat menghitung total kuantitas massa.'
              }
            ];
            const chosenTab = tables[Math.floor(idx / 3) % tables.length];
            return {
              ...q,
              stimulusType: 'tabel' as StimulusType,
              stimulusTitle: chosenTab.title,
              stimulusTable: chosenTab.table,
              questionText: chosenTab.qText,
              options: chosenTab.options,
              correctAnswer: chosenTab.correct,
              indikatorSoal: chosenTab.ind
            };
          } else {
            // Contextual Story Stimulus
            const stories = [
              {
                title: 'Pembangunan Taman Toga Madrasah',
                text: 'Madrasah Ibtidaiyah merencanakan pembuatan taman tanaman obat keluarga (TOGA) berbentuk persegi panjang dengan panjang 15 meter dan lebar 8 meter. Di sekeliling taman akan dipasang pagar kawat pembatas.',
                qText: 'Panjang minimal kawat pembatas yang dibutuhkan untuk mengelilingi seluruh taman TOGA madrasah adalah ...',
                options: [{ label: 'A', text: '23 meter' }, { label: 'B', text: '46 meter' }, { label: 'C', text: '60 meter' }, { label: 'D', text: '120 meter' }],
                correct: 'B' as const,
                ind: 'Disajikan narasi luas lahan taman, siswa dapat menghitung keliling bangun persegi panjang.'
              },
              {
                title: 'Kegiatan Gemar Menabung di Madrasah',
                text: 'Faris mulai gemar menabung di celengan madrasah setiap hari. Pada hari Senin ia menabung Rp5.000,00, dan setiap hari berikutnya tabungannya bertambah Rp2.000,00 lebih banyak dari hari sebelumnya.',
                qText: 'Berdasarkan keteraturan pola tabungan di atas, jumlah uang yang ditabung Faris pada hari Jumat adalah ...',
                options: [{ label: 'A', text: 'Rp11.000,00' }, { label: 'B', text: 'Rp13.000,00' }, { label: 'C', text: 'Rp15.000,00' }, { label: 'D', text: 'Rp17.000,00' }],
                correct: 'B' as const,
                ind: 'Disajikan narasi tabungan berpola, siswa dapat menentukan besar tabungan pada hari ke-5.'
              },
              {
                title: 'Penyaluran Zakat Beras Idul Fitri',
                text: 'Panitia amil zakat madrasah mengumpulkan zakat fitrah berupa beras sebanyak 450 kg. Beras tersebut akan dikemas ke dalam kantong plastik yang masing-masing berisi 2,5 kg untuk dibagikan kepada mustahik.',
                qText: 'Banyak kantong beras zakat yang berhasil dikemas oleh panitia amil madrasah adalah ...',
                options: [{ label: 'A', text: '150 kantong' }, { label: 'B', text: '180 kantong' }, { label: 'C', text: '200 kantong' }, { label: 'D', text: '225 kantong' }],
                correct: 'B' as const,
                ind: 'Disajikan konteks pembagian zakat fitrah, siswa dapat menyelesaikan operasi pembagian bilangan desimal.'
              }
            ];
            const chosenStory = stories[Math.floor(idx / 3) % stories.length];
            return {
              ...q,
              stimulusType: 'cerita' as StimulusType,
              stimulusTitle: chosenStory.title,
              stimulusText: chosenStory.text,
              questionText: chosenStory.qText,
              options: chosenStory.options,
              correctAnswer: chosenStory.correct,
              indikatorSoal: chosenStory.ind
            };
          }
        } else if (isFiqih) {
          if (idx === 0) {
            return enrichQuestionWithGraphicBinding(q, 'agama_wudhu_steps');
          }
          const fiqihSnippets = ARABIC_SNIPPETS_LIBRARY.filter(s => s.category === 'fiqih');
          const chosen = fiqihSnippets[idx % fiqihSnippets.length] || fiqihSnippets[0];
          return {
            ...q,
            stimulusType: 'cerita' as StimulusType,
            stimulusTitle: `Dalil / Bacaan Shalat: ${chosen.title}`,
            arabicText: chosen.arabicText,
            arabicTranslation: chosen.translation,
            questionText: `Lafaz bacaan shalat berharakat di atas dibaca oleh seorang muslim ketika melakukan gerakan shalat yaitu ...`,
            options: [
              { label: 'A', text: 'I\'tidal (bangkit dari ruku\')' },
              { label: 'B', text: 'Ruku\' dengan thuma\'ninah' },
              { label: 'C', text: 'Sujud pertama dan kedua' },
              { label: 'D', text: 'Duduk di antara dua sujud' }
            ],
            correctAnswer: 'B' as const,
            indikatorSoal: `Disajikan bacaan shalat berharakat lengkap, peserta didik dapat menentukan gerakan shalat yang tepat.`,
            ipk: `Menghubungkan lafaz doa/bacaan shalat dengan gerakannya.`,
            rubrikPenilaian: `Pilihan B bernilai skor maksimal.`
          };
        } else if (isQurdis) {
          const qurSnippets = ARABIC_SNIPPETS_LIBRARY.filter(s => s.category === 'qurdis');
          const chosen = qurSnippets[idx % qurSnippets.length] || qurSnippets[0];
          return {
            ...q,
            stimulusType: 'cerita' as StimulusType,
            stimulusTitle: `Kutipan Ayat / Hadits: ${chosen.title}`,
            arabicText: chosen.arabicText,
            arabicTranslation: chosen.translation,
            questionText: `Berdasarkan ayat/hadits di atas, nilai akhlak terpuji dan pesan utama yang terkandung di dalamnya adalah ...`,
            options: [
              { label: 'A', text: 'Senantiasa menyayangi sesama, menuntut ilmu, dan berbuat kebajikan' },
              { label: 'B', text: 'Menghardik orang yang membutuhkan bantuan' },
              { label: 'C', text: 'Mengabaikan kebersihan lingkungan sekitar' },
              { label: 'D', text: 'Menyembunyikan ilmu pengetahuan' }
            ],
            correctAnswer: 'A' as const,
            indikatorSoal: `Disajikan ayat/hadits, peserta didik dapat menganalisis pesan moral dan nilai akhlak terpuji di dalamnya.`,
            rubrikPenilaian: `Pilihan A bernilai skor maksimal.`
          };
        } else if (isArab) {
          const arabSnippets = ARABIC_SNIPPETS_LIBRARY.filter(s => s.category === 'arab');
          const chosen = arabSnippets[idx % arabSnippets.length] || arabSnippets[0];
          return {
            ...q,
            stimulusType: 'cerita' as StimulusType,
            stimulusTitle: `Teks / Hiwar Bahasa Arab: ${chosen.title}`,
            arabicText: chosen.arabicText,
            arabicTranslation: chosen.translation
          };
        } else {
          // Akidah Akhlak / General
          if (idx === 0) {
            return enrichQuestionWithGraphicBinding(q, 'agama_mizan_scale');
          }
          const akidahSnippets = ARABIC_SNIPPETS_LIBRARY.filter(s => s.category === 'akidah');
          const chosen = akidahSnippets[idx % akidahSnippets.length] || akidahSnippets[0];
          return {
            ...q,
            stimulusType: 'cerita' as StimulusType,
            stimulusTitle: `Konteks Kalimat Thoyyibah & Asmaul Husna: ${chosen.title}`,
            arabicText: chosen.arabicText,
            arabicTranslation: chosen.translation,
            questionText: `Waktu atau kondisi yang paling tepat bagi seorang muslim untuk mengamalkan kalimat thayyibah di atas adalah ...`,
            options: [
              { label: 'A', text: 'Saat tertimpa musibah atau mendengar kabar duka' },
              { label: 'B', text: 'Saat merasa bangga dan ingin dipuji orang lain' },
              { label: 'C', text: 'Hanya saat diperintahkan oleh guru di kelas' },
              { label: 'D', text: 'Ketika memenangkan perlombaan' }
            ],
            correctAnswer: 'A' as const,
            indikatorSoal: `Disajikan kalimat thayyibah, peserta didik dapat menentukan waktu pengamalannya yang tepat.`,
            rubrikPenilaian: `Pilihan A bernilai skor maksimal.`
          };
        }
      }
      return q;
    });

    setQuestions(updated);
    alert(`Berhasil memperkaya ${enrichedCount} butir soal dengan stimulus kontekstual lengkap! Sekarang 100% butir soal memiliki stimulus kontekstual.`);
  };

  // MULTI-CP PROPORTIONAL QUESTION GENERATOR ALGORITHM WITH SOAL GRUP & PG KOMPLEKS
  const handleGenerateQuestions = () => {
    if (!config.cpList || config.cpList.length === 0) {
      alert('Harap tambahkan minimal 1 Capaian Pembelajaran (CP) terlebih dahulu.');
      return;
    }

    const newQuestions: QuestionItem[] = [];
    let currentNumber = 1;
    const cpCount = config.cpList.length;

    // A. CEK ATURAN JENIS SOAL: SOAL GRUP vs SOAL TUNGGAL
    const isGrupMode = config.modeStimulus === 'grup' && config.stimulusType !== 'none';
    const grupEnd = isGrupMode ? Math.min(config.grupQuestionCount || 4, Math.max(1, config.jumlahPg)) : 0;
    const grupNotice = isGrupMode ? `Bacalah teks/stimulus di bawah ini untuk menjawab butir soal nomor 1 sampai ${grupEnd}!` : undefined;

    // 1. GENERATE PILIHAN GANDA TUNGGAL (PG)
    const optionsCount = config.opsiPgCount || 4;
    const presetQuestions = findSubjectQuestions(config.mataPelajaran) || [];
    const presetPg = presetQuestions.filter(q => q.type === 'pg');
    const presetPgK = presetQuestions.filter(q => q.type === 'pg_kompleks');
    const presetIsian = presetQuestions.filter(q => q.type === 'isian');
    const presetEsai = presetQuestions.filter(q => q.type === 'esai');
    const isMath = config.mataPelajaran.toLowerCase().includes('matematika') || config.mataPelajaran.toLowerCase().includes('mtk');
    const mathSvgs = ['math_fraction_3_4', 'math_triangle_right', 'math_rectangle', 'math_cuboid_3d', 'math_bar_chart', 'math_clock_0715'];

    for (let i = 1; i <= config.jumlahPg; i++) {
      // Pick CP and TP round-robin to ensure 100% coverage of ALL sub-competencies in every CP
      const cpIndex = (i - 1) % cpCount;
      const targetCP = config.cpList[cpIndex];
      const tps = targetCP.tpList && targetCP.tpList.length > 0 ? targetCP.tpList : [];
      const tpIndex = tps.length > 0 ? (Math.floor((i - 1) / cpCount)) % tps.length : 0;
      const targetTP = tps[tpIndex];

      const isItemInGrup = isGrupMode && i <= grupEnd;
      const isFirstOfGrup = isItemInGrup && i === 1;

      // Generate authentic question using smartQuestionEngine bound directly to this specific TP
      const effectiveMateri = targetTP?.materiPokok || targetCP.materiPokok;
      const template = getAuthenticQuestionTemplate(
        config.mataPelajaran, 
        effectiveMateri, 
        i, 
        targetTP?.text, 
        targetCP.capaianPembelajaran
      );
      const slicedOptions = template.options.slice(0, optionsCount);
      const validCorrect = slicedOptions.some(o => o.label === template.correct) ? template.correct : 'A';

      let qText = template.stem;
      let indText = template.indikator;

      if (isItemInGrup) {
        if (i === 1) {
          qText = `Berdasarkan teks bacaan di atas, informasi pokok atau ide utama yang secara tersurat diceritakan adalah ...`;
          indText = `Disajikan teks cerita/stimulus ${effectiveMateri}, peserta didik dapat mengidentifikasi tokoh atau informasi tersurat (Level 1).`;
        } else if (i === 2) {
          qText = `Peristiwa atau tindakan utama yang dilakukan dalam bacaan tersebut dilandasi oleh alasan ...`;
          indText = `Disajikan teks cerita/stimulus ${effectiveMateri}, peserta didik dapat menganalisis sebab-akibat peristiwa (Level 2).`;
        } else if (i === 3) {
          qText = `Karakter atau pengamalan nilai terpuji yang dicontohkan dalam stimulus bacaan di atas adalah ...`;
          indText = `Disajikan teks cerita/stimulus ${effectiveMateri}, peserta didik dapat menerapkan nilai pengamalan karakter (Level 2).`;
        } else {
          qText = `Amanat atau pesan moral paling berharga yang dapat kita petik dari keseluruhan teks di atas adalah ...`;
          indText = `Disajikan teks cerita/stimulus ${effectiveMateri}, peserta didik dapat menyimpulkan pesan moral/amanat bacaan (Level 3 - HOTS).`;
        }
      }

      let qItem: QuestionItem = {
        id: `gen-pg-${i}-${Date.now()}`,
        number: currentNumber++,
        type: 'pg',
        subType: isItemInGrup ? 'grup' : 'tunggal',
        isGroupFirst: isFirstOfGrup,
        groupId: isItemInGrup ? 'group-stimulus-1' : undefined,
        groupHeaderNotice: isFirstOfGrup ? grupNotice : undefined,
        stimulusType: isFirstOfGrup ? config.stimulusType : (template.stimulusType || 'cerita'),
        stimulusTitle: isFirstOfGrup ? config.stimulusTitle : template.stimulusTitle,
        stimulusText: isFirstOfGrup && (config.stimulusType === 'cerita' || config.stimulusType === 'gabungan') ? config.stimulusText : template.stimulusText,
        stimulusTable: isFirstOfGrup && (config.stimulusType === 'tabel' || config.stimulusType === 'gabungan') ? config.stimulusTable : template.stimulusTable,
        stimulusSvg: isFirstOfGrup ? undefined : template.stimulusSvg,
        stimulusImageUrl: isFirstOfGrup && (config.stimulusType === 'gambar' || config.stimulusType === 'gabungan') ? config.stimulusImageUrl : undefined,
        questionText: qText,
        options: slicedOptions,
        correctAnswer: validCorrect,
        score: config.bobotPg,
        cognitiveLevel: template.cognitiveLevel,
        indikatorSoal: indText,
        ipk: template.ipk,
        classLevel: config.tingkatKelas,
        materiPokok: effectiveMateri,
        capaianPembelajaran: targetCP.capaianPembelajaran,
        cpId: targetCP.id,
        cpCode: targetCP.code,
        tpId: targetTP?.id,
        tpCode: targetTP?.code,
        tujuanPembelajaran: targetTP?.text,
        rubrikPenilaian: template.rubrik,
        kbcPillar: template.kbcPillar,
        kbcDescription: template.kbcDesc
      };

      // If user selected gambar stimulus or template genuinely has an SVG, bind graphic automatically
      if (!isItemInGrup && (config.stimulusType === 'gambar' || template.stimulusSvg)) {
        const chosenSvg = template.stimulusSvg || mathSvgs[(i - 1) % mathSvgs.length];
        qItem = enrichQuestionWithGraphicBinding(qItem, chosenSvg);
      }

      newQuestions.push(qItem);
    }

    // 2. GENERATE PILIHAN GANDA KOMPLEKS (MCMA - Multiple Choices Multiple Answers)
    const nPgK = config.jumlahPgKompleks || 0;
    for (let k = 1; k <= nPgK; k++) {
      const cpIndex = (k - 1) % cpCount;
      const targetCP = config.cpList[cpIndex];
      const tps = targetCP.tpList && targetCP.tpList.length > 0 ? targetCP.tpList : [];
      const tpIndex = tps.length > 0 ? (k - 1) % tps.length : 0;
      const targetTP = tps[tpIndex];
      const effectiveMateri = targetTP?.materiPokok || targetCP.materiPokok;
      const template = getAuthenticQuestionTemplate(
        config.mataPelajaran, 
        effectiveMateri, 
        k + 10,
        targetTP?.text,
        targetCP.capaianPembelajaran
      );

      const statements = template.complexStatements || [
        `1. Memahami kaidah utama materi ${effectiveMateri} dengan baik dan benar.`,
        `2. Menunjukkan sikap disiplin yang selaras dengan nilai ${targetCP.elemen}.`,
        `3. Mengabaikan ketentuan yang berlaku pada pembahasan ${effectiveMateri}.`,
        `4. Menolak bekerja sama dalam pelaksanaan kegiatan ${targetCP.elemen}.`
      ];

      const options = template.complexOptions || [
        { label: 'A' as const, text: 'Pernyataan (1), (2), dan (3) benar' },
        { label: 'B' as const, text: 'Pernyataan (1) dan (4) saja yang benar' },
        { label: 'C' as const, text: 'Pernyataan (2) dan (4) saja yang benar' },
        { label: 'D' as const, text: 'Semua pernyataan benar' }
      ];

      newQuestions.push({
        id: `gen-pgk-${k}-${Date.now()}`,
        number: currentNumber++,
        type: 'pg_kompleks',
        subType: 'mcma',
        complexStatements: statements,
        stimulusType: template.stimulusType || 'cerita',
        stimulusTitle: template.stimulusTitle,
        stimulusText: template.stimulusText,
        stimulusTable: template.stimulusTable,
        stimulusSvg: template.stimulusSvg,
        questionText: `Perhatikan beberapa pernyataan di bawah ini terkait materi ${effectiveMateri}!\nBerdasarkan daftar pernyataan di atas, manakah pernyataan yang BENAR dan TEPAT?`,
        options,
        correctAnswer: 'A',
        score: config.bobotPgKompleks || 4,
        cognitiveLevel: 'L2',
        indikatorSoal: `Disajikan 4 pernyataan materi ${effectiveMateri}, peserta didik dapat memilih kombinasi pernyataan yang benar (PG Kompleks MCMA).`,
        ipk: template.ipk,
        classLevel: config.tingkatKelas,
        materiPokok: effectiveMateri,
        capaianPembelajaran: targetCP.capaianPembelajaran,
        cpId: targetCP.id,
        cpCode: targetCP.code,
        tpId: targetTP?.id,
        tpCode: targetTP?.code,
        tujuanPembelajaran: targetTP?.text,
        rubrikPenilaian: `Pilihan kombinasi A bernilai ${config.bobotPgKompleks || 4} poin. Pilihan lain 0 poin.`,
        kbcPillar: template.kbcPillar,
        kbcDescription: template.kbcDesc
      });
    }

    // 3. GENERATE ISIAN SINGKAT
    for (let i = 1; i <= config.jumlahIsian; i++) {
      const cpIndex = (i - 1) % cpCount;
      const targetCP = config.cpList[cpIndex];
      const tps = targetCP.tpList && targetCP.tpList.length > 0 ? targetCP.tpList : [];
      const tpIndex = tps.length > 0 ? (i - 1) % tps.length : 0;
      const targetTP = tps[tpIndex];
      const effectiveMateri = targetTP?.materiPokok || targetCP.materiPokok;
      const template = getAuthenticQuestionTemplate(
        config.mataPelajaran, 
        effectiveMateri, 
        i + 20,
        targetTP?.text,
        targetCP.capaianPembelajaran
      );

      const cogLevel: CognitiveLevel = i % 2 === 0 ? 'L2' : 'L1';
      newQuestions.push({
        id: `gen-isian-${i}-${Date.now()}`,
        number: currentNumber++,
        type: 'isian',
        stimulusType: 'none',
        questionText: template.isianQuestion || `Pada pokok bahasan ${effectiveMateri}, istilah penting atau konsep utama yang menjelaskan tentang kompetensi ini adalah ...`,
        correctAnswer: template.isianAnswer || `Kaidah ${effectiveMateri}`,
        score: config.bobotIsian,
        cognitiveLevel: cogLevel,
        indikatorSoal: `Peserta didik dapat melengkapi jawaban singkat materi ${effectiveMateri}.`,
        ipk: template.ipk,
        classLevel: config.tingkatKelas,
        materiPokok: effectiveMateri,
        capaianPembelajaran: targetCP.capaianPembelajaran,
        cpId: targetCP.id,
        cpCode: targetCP.code,
        tpId: targetTP?.id,
        tpCode: targetTP?.code,
        tujuanPembelajaran: targetTP?.text,
        rubrikPenilaian: `Jawaban tepat: ${config.bobotIsian} poin. Kurang lengkap: ${Math.round(config.bobotIsian / 2)} poin. Salah: 0 poin.`,
        kbcPillar: template.kbcPillar,
        kbcDescription: template.kbcDesc
      });
    }

    // 4. GENERATE URAIAN / ESAI
    for (let i = 1; i <= config.jumlahEsai; i++) {
      const cpIndex = (i - 1) % cpCount;
      const targetCP = config.cpList[cpIndex];
      const tps = targetCP.tpList && targetCP.tpList.length > 0 ? targetCP.tpList : [];
      const tpIndex = tps.length > 0 ? (i - 1) % tps.length : 0;
      const targetTP = tps[tpIndex];
      const effectiveMateri = targetTP?.materiPokok || targetCP.materiPokok;
      const template = getAuthenticQuestionTemplate(
        config.mataPelajaran, 
        effectiveMateri, 
        i + 30,
        targetTP?.text,
        targetCP.capaianPembelajaran
      );

      newQuestions.push({
        id: `gen-esai-${i}-${Date.now()}`,
        number: currentNumber++,
        type: 'esai',
        stimulusType: i === 1 && config.stimulusType !== 'none' ? config.stimulusType : 'none',
        stimulusTitle: i === 1 && config.stimulusType !== 'none' ? config.stimulusTitle : undefined,
        stimulusText: i === 1 && (config.stimulusType === 'cerita' || config.stimulusType === 'gabungan') ? config.stimulusText : undefined,
        questionText: template.esaiQuestion || `Jelaskan secara runtut konsep ${effectiveMateri} dan berikan 2 (dua) contoh konkret penerapannya dalam kehidupan sehari-hari di madrasah!`,
        correctAnswer: template.esaiAnswer || `Penjelasan runtut tentang ${effectiveMateri} disertai 2 contoh konkret pengamalan nyata di madrasah.`,
        score: config.bobotEsai,
        cognitiveLevel: 'L3',
        indikatorSoal: `Peserta didik dapat menganalisis dan menguraikan penerapan ${effectiveMateri} (HOTS).`,
        ipk: template.ipk,
        classLevel: config.tingkatKelas,
        materiPokok: effectiveMateri,
        capaianPembelajaran: targetCP.capaianPembelajaran,
        cpId: targetCP.id,
        cpCode: targetCP.code,
        tpId: targetTP?.id,
        tpCode: targetTP?.code,
        tujuanPembelajaran: targetTP?.text,
        rubrikPenilaian: template.rubrik || `- Menjelaskan konsep dan contoh lengkap: skor ${config.bobotEsai}.\n- Menjelaskan konsep dan 1 contoh: skor ${Math.round(config.bobotEsai * 0.5)}.\n- Menjawab tidak relevan: skor 1.`,
        kbcPillar: template.kbcPillar,
        kbcDescription: template.kbcDesc
      });
    }

    setQuestions(newQuestions);
    setLastGenerationMode('coding');
    localStorage.setItem('school_exam_last_gen_mode', 'coding');
    setActiveView('questions');
    alert(`⚡ [Mode Coding Instan] Berhasil men-generate ${newQuestions.length} butir soal lengkap terdistribusi proporsional ke ${cpCount} Capaian Pembelajaran!`);
  };

  // Abort Controller reference for AI generation
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const handleCancelGenerateAI = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort('user_cancelled');
      setIsGeneratingAI(false);
      setAiProgressText('');
      abortControllerRef.current = null;
    }
  };

  // AI-POWERED QUESTION GENERATOR (WITH MULTI-MODEL FALLBACK & TIMEOUT SHIELD)
  const handleGenerateQuestionsAI = async () => {
    if (!config.cpList || config.cpList.length === 0) {
      alert('Harap tambahkan minimal 1 Capaian Pembelajaran (CP) terlebih dahulu.');
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsGeneratingAI(true);
    setAiProgressText('Gemini AI sedang menganalisis naskah CP & merumuskan paket soal...');

    // Safety timeout: max 45 seconds to prevent eternal loading
    const timeoutId = setTimeout(() => {
      controller.abort('timeout');
    }, 45000);

    try {
      const response = await fetch('/api/generate-questions-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          subjectName: config.mataPelajaran,
          fase: config.fase,
          classLevel: config.tingkatKelas,
          cpList: config.cpList,
          counts: {
            pg: config.jumlahPg,
            pgKompleks: config.jumlahPgKompleks,
            isian: config.jumlahIsian,
            esai: config.jumlahEsai
          },
          optionsCount: config.opsiPgCount,
          bobot: {
            pg: config.bobotPg,
            pgKompleks: config.bobotPgKompleks,
            isian: config.bobotIsian,
            esai: config.bobotEsai
          },
          stimulusTypePreference: config.stimulusType
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.questions) && result.questions.length > 0) {
        setQuestions(result.questions);
        setLastGenerationMode('ai');
        localStorage.setItem('school_exam_last_gen_mode', 'ai');
        setActiveView('questions');
        alert(`✨ [Mode AI Gemini] Berhasil! AI telah menyusun ${result.questions.length} butir soal lengkap yang disesuaikan secara utuh dengan materi CP!`);
      } else {
        throw new Error('Hasil respon AI tidak memuat butir soal.');
      }
    } catch (err: any) {
      console.error('AI Question Generation Error:', err);
      if (err.name === 'AbortError' || err === 'timeout') {
        alert('⏱️ Pembuatan soal via AI melebihi batas waktu (timeout) karena server AI Google sedang antre panjang.\n\nSaran: Gunakan tombol hijau "⚡ Generate via Coding (Instan)" yang bekerja super cepat dalam hitungan detik tanpa tergantung koneksi AI.');
      } else if (err === 'user_cancelled') {
        // User voluntarily cancelled, no need for scary alert
      } else {
        alert(`Gagal membuat soal via AI: ${err.message || 'Koneksi terputus'}.\n\nAnda dapat langsung menggunakan tombol "⚡ Generate via Coding (Instan)" sebagai alternatif yang selalu tersedia.`);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsGeneratingAI(false);
      setAiProgressText('');
      abortControllerRef.current = null;
    }
  };

  // Add a single custom question
  const handleAddQuestion = (type: QuestionType) => {
    const nextNum = questions.length + 1;
    const defaultScore = type === 'pg' ? config.bobotPg : type === 'pg_kompleks' ? (config.bobotPgKompleks || 4) : type === 'isian' ? config.bobotIsian : config.bobotEsai;
    const optionsCount = config.opsiPgCount || 4;
    const letters: ('A' | 'B' | 'C' | 'D')[] = optionsCount === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    const firstCP = config.cpList[0];
    const firstTP = firstCP?.tpList?.[0];

    const template = getAuthenticQuestionTemplate(config.mataPelajaran, firstCP?.materiPokok || '', nextNum);
    const slicedOptions = template.options.slice(0, optionsCount);
    const validCorrect = slicedOptions.some(o => o.label === template.correct) ? template.correct : 'A';

    const newQ: QuestionItem = {
      id: `manual-q-${Date.now()}`,
      number: nextNum,
      type,
      subType: type === 'pg_kompleks' ? 'mcma' : 'tunggal',
      stimulusType: 'none',
      questionText: type === 'pg'
        ? template.stem
        : type === 'pg_kompleks'
        ? `Perhatikan beberapa pernyataan di bawah ini terkait materi ${firstCP?.materiPokok || 'pembelajaran'}!\nBerdasarkan daftar pernyataan di atas, manakah pernyataan yang BENAR dan TEPAT?`
        : type === 'isian'
        ? (template.isianQuestion || `Pada pokok bahasan ${firstCP?.materiPokok || 'materi'}, konsep utama yang harus dipahami adalah ...`)
        : (template.esaiQuestion || `Jelaskan secara runtut konsep ${firstCP?.materiPokok || 'materi'} dan berikan contoh penerapannya dalam kehidupan sehari-hari!`),
      complexStatements: type === 'pg_kompleks' ? (template.complexStatements || [
        `1. Memahami kaidah utama materi ${firstCP?.materiPokok || 'pembelajaran'}.`,
        `2. Mengamalkan nilai materi secara konsisten.`,
        `3. Mengabaikan ketentuan yang berlaku.`,
        `4. Menolak bekerja sama dalam pelaksanaan kegiatan.`
      ]) : undefined,
      options: type === 'pg' 
        ? slicedOptions 
        : type === 'pg_kompleks'
        ? (template.complexOptions || [
            { label: 'A', text: 'Pernyataan (1), (2), dan (3) benar' },
            { label: 'B', text: 'Pernyataan (1) dan (4) saja yang benar' },
            { label: 'C', text: 'Pernyataan (2) dan (4) saja yang benar' },
            { label: 'D', text: 'Semua pernyataan benar' }
          ])
        : undefined,
      correctAnswer: type === 'pg' ? validCorrect : type === 'isian' ? (template.isianAnswer || 'Jawaban tepat') : 'A',
      score: defaultScore,
      cognitiveLevel: template.cognitiveLevel || 'L2',
      indikatorSoal: template.indikator || `Peserta didik dapat menyelesaikan soal materi ${firstCP?.materiPokok || 'pembelajaran'}`,
      ipk: template.ipk || `Menjelaskan konsep utama materi ${firstCP?.materiPokok || 'pembelajaran'}`,
      classLevel: config.tingkatKelas,
      materiPokok: firstCP?.materiPokok || 'Materi Pokok',
      capaianPembelajaran: firstCP?.capaianPembelajaran || '',
      cpId: firstCP?.id,
      cpCode: firstCP?.code,
      tpId: firstTP?.id,
      tpCode: firstTP?.code,
      tujuanPembelajaran: firstTP?.text,
      rubrikPenilaian: template.rubrik || (type === 'esai' ? 'Pedoman penskoran bertahap' : undefined),
      kbcPillar: template.kbcPillar,
      kbcDescription: template.kbcDesc
    };

    setQuestions(prev => [...prev, newQ]);
    setEditingQuestionId(newQ.id);
    setActiveView('questions');
  };

  // Delete question
  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Hapus butir soal ini?')) {
      setQuestions(prev => {
        const filtered = prev.filter(q => q.id !== id);
        return filtered.map((q, idx) => ({ ...q, number: idx + 1 }));
      });
    }
  };

  // Update single question field
  const handleUpdateQuestion = (id: string, field: keyof QuestionItem, value: any) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  // Link question to specific CP
  const handleLinkQuestionToCP = (questionId: string, cpId: string) => {
    const selectedCP = config.cpList.find(c => c.id === cpId);
    if (!selectedCP) return;
    const firstTP = selectedCP.tpList?.[0];

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          cpId: selectedCP.id,
          cpCode: selectedCP.code,
          capaianPembelajaran: selectedCP.capaianPembelajaran,
          materiPokok: selectedCP.materiPokok,
          tpId: firstTP?.id,
          tpCode: firstTP?.code,
          tujuanPembelajaran: firstTP?.text,
        };
      }
      return q;
    }));
  };

  // Link question to specific TP
  const handleLinkQuestionToTP = (questionId: string, tpId: string) => {
    const curQ = questions.find(q => q.id === questionId);
    if (!curQ) return;
    const curCP = config.cpList.find(c => c.id === curQ.cpId) || config.cpList[0];
    const targetTP = curCP?.tpList?.find(t => t.id === tpId);
    if (!targetTP) return;

    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          tpId: targetTP.id,
          tpCode: targetTP.code,
          tujuanPembelajaran: targetTP.text,
        };
      }
      return q;
    }));
  };

  // Sebar & Acak Variasi Stimulus (Gambar, Tabel, Cerita) secara Proporsional & Selang-Seling
  const handleInterleaveStimuli = () => {
    const pgQuestions = questions.filter(q => q.type === 'pg');
    const pgKQuestions = questions.filter(q => q.type === 'pg_kompleks');
    const isianQuestions = questions.filter(q => q.type === 'isian');
    const esaiQuestions = questions.filter(q => q.type === 'esai');

    const interleaveStimulusList = (list: QuestionItem[]) => {
      if (list.length <= 1) return list;

      const gambarList = list.filter(q => q.stimulusType === 'gambar' || !!q.stimulusSvg || !!q.stimulusImageUrl);
      const tabelList = list.filter(q => (q.stimulusType === 'tabel' || !!q.stimulusTable) && !gambarList.includes(q));
      const teksList = list.filter(q => !gambarList.includes(q) && !tabelList.includes(q));

      const interleaved: QuestionItem[] = [];
      let g = 0, t = 0, k = 0;

      while (g < gambarList.length || t < tabelList.length || k < teksList.length) {
        if (k < teksList.length) interleaved.push(teksList[k++]);
        if (g < gambarList.length) interleaved.push(gambarList[g++]);
        if (t < tabelList.length) interleaved.push(tabelList[t++]);
      }

      return interleaved;
    };

    const newPg = interleaveStimulusList(pgQuestions);
    const newPgK = interleaveStimulusList(pgKQuestions);
    const newIsian = interleaveStimulusList(isianQuestions);
    const newEsai = interleaveStimulusList(esaiQuestions);

    const reordered = [...newPg, ...newPgK, ...newIsian, ...newEsai].map((q, idx) => ({
      ...q,
      number: idx + 1
    }));

    setQuestions(reordered);
    alert('Berhasil menyebarkan variasi stimulus (gambar, tabel, dan cerita) secara proporsional dan selang-seling di seluruh naskah soal!');
  };

  // Print handle
  const handlePrint = () => {
    window.print();
  };

  // Download Exam Paper as Microsoft Word .doc file with fully embedded rasterized images (RFC 2557 MHTML)
  const handleDownloadWordExam = async () => {
    setIsExportingWord(true);
    try {
      const pgQuestions = questions.filter(q => q.type === 'pg');
      const pgKompleksQuestions = questions.filter(q => q.type === 'pg_kompleks');
      const isianQuestions = questions.filter(q => q.type === 'isian');
      const esaiQuestions = questions.filter(q => q.type === 'esai');

      const paperDim = PAPER_DIMENSIONS[paperLayout.paperSize] || PAPER_DIMENSIONS.F4;
      const qMarginBottom = paperLayout.questionSpacing === 'compact' ? '6pt' : paperLayout.questionSpacing === 'spacious' ? '16pt' : '11pt';
      const fontFam = paperLayout.fontFamily;
      const fontSz = paperLayout.fontSizePt;
      const fontSzSub = Math.max(8.5, fontSz - 0.5);

      const embeddedImages: WordEmbeddedImage[] = [];
      const questionImageMap: Record<string, { filename: string; width: number; height: number; alt: string }> = {};

      // 1. Pre-render header emblem / school logo to high-res PNG
      let headerLogoFilename = '';
      if (config.kopLogoUrl || schoolLogo) {
        const logoRes = await convertImageSrcToPngBase64(config.kopLogoUrl || schoolLogo || '');
        if (logoRes) {
          headerLogoFilename = 'logo_kop_sekolah.png';
          embeddedImages.push({
            filename: headerLogoFilename,
            contentType: 'image/png',
            base64: logoRes.base64,
            width: logoRes.width,
            height: logoRes.height,
            alt: 'Logo Madrasah'
          });
        }
      } else {
        const defaultLogoSvg = `<svg viewBox="0 0 100 100" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,4 94,22 82,86 50,98 18,86 6,22" fill="#15803d" stroke="#14532d" stroke-width="2"/>
          <polygon points="50,8 89,24 78,82 50,93 22,82 11,24" fill="#166534" stroke="#fbbf24" stroke-width="2"/>
          <circle cx="50" cy="50" r="28" fill="#ffffff" stroke="#f59e0b" stroke-width="1.5"/>
          <circle cx="50" cy="50" r="24" fill="#047857"/>
          <circle cx="50" cy="50" r="20" stroke="#fde68a" stroke-width="1" stroke-dasharray="2 3"/>
          <path d="M50 32 L52 38 L58 38 L53 42 L55 48 L50 44 L45 48 L47 42 L42 38 L48 38 Z" fill="#fbbf24"/>
          <path d="M50 56 Q40 50 34 52 L34 60 Q40 58 50 63 Q60 58 66 60 L66 52 Q60 50 50 56 Z" fill="#ffffff" stroke="#f59e0b" stroke-width="1"/>
          <path d="M50 56 L50 63" stroke="#15803d" stroke-width="1.5"/>
          <circle cx="50" cy="48" r="2.5" fill="#fbbf24"/>
          <path d="M26 78 Q50 72 74 78 L78 84 Q50 78 22 84 Z" fill="#ffffff" stroke="#f59e0b" stroke-width="1"/>
        </svg>`;
        const logoRes = await convertSvgToPngBase64(defaultLogoSvg, 80, 80);
        if (logoRes) {
          headerLogoFilename = 'logo_kop_sekolah.png';
          embeddedImages.push({
            filename: headerLogoFilename,
            contentType: 'image/png',
            base64: logoRes.base64,
            width: 70,
            height: 70,
            alt: 'Logo Madrasah'
          });
        }
      }

      // 2. Pre-render each question diagram / SVG stimulus into sharp PNG Base64
      for (const q of questions) {
        if (q.stimulusSvg) {
          const preset = EDUCATIONAL_GRAPHICS[q.stimulusSvg];
          const rawSvg = preset ? preset.svg : (q.stimulusSvg.trim().startsWith('<svg') ? q.stimulusSvg : null);
          if (rawSvg) {
            const pngRes = await convertSvgToPngBase64(rawSvg);
            if (pngRes) {
              const fname = `stimulus_q_${q.number || q.id.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
              embeddedImages.push({
                filename: fname,
                contentType: 'image/png',
                base64: pngRes.base64,
                width: pngRes.width,
                height: pngRes.height,
                alt: q.stimulusTitle || preset?.title || 'Gambar Diagram Stimulus'
              });
              questionImageMap[q.id] = {
                filename: fname,
                width: pngRes.width,
                height: pngRes.height,
                alt: q.stimulusTitle || preset?.title || 'Gambar Diagram Stimulus'
              };
            }
          }
        } else if (q.stimulusImageUrl) {
          const pngRes = await convertImageSrcToPngBase64(q.stimulusImageUrl);
          if (pngRes) {
            const fname = `stimulus_q_${q.number || q.id.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
            embeddedImages.push({
              filename: fname,
              contentType: 'image/png',
              base64: pngRes.base64,
              width: pngRes.width,
              height: pngRes.height,
              alt: q.stimulusTitle || 'Gambar Ilustrasi'
            });
            questionImageMap[q.id] = {
              filename: fname,
              width: pngRes.width,
              height: pngRes.height,
              alt: q.stimulusTitle || 'Gambar Ilustrasi'
            };
          }
        }
      }

      // 3. Helper to render stimulus blocks (text, rasterized image, or Arabic verses) in Microsoft Word (.doc)
      const renderWordStimulusBlock = (q: QuestionItem) => {
        let blockHtml = '';

        // Group Header Notice (Tanpa Kotak)
        if (q.isGroupFirst && q.groupHeaderNotice) {
          blockHtml += `
            <div style="margin: 5pt 0 7pt 0; font-size: ${fontSzSub}pt;">
              <p style="margin: 0 0 3pt 0; font-weight: bold; color: #000000;">📌 ${escapeHtml(q.groupHeaderNotice)}</p>
              ${q.stimulusTitle ? `<p style="margin: 0 0 3pt 0; font-weight: bold;">${escapeHtml(q.stimulusTitle)}</p>` : ''}
              ${q.stimulusText ? `<p style="margin: 0; line-height: 1.35; text-align: justify;">${escapeHtml(q.stimulusText).replace(/\n/g, '<br/>')}</p>` : ''}
              ${q.stimulusTable ? renderStimulusTableToWordHtml(q.stimulusTable, fontSzSub) : ''}
            </div>
          `;
        } else if (!q.groupId && (q.stimulusText || (q.stimulusTitle && !q.stimulusTable && !questionImageMap[q.id])) && q.stimulusType !== 'none') {
          blockHtml += `
            <div style="margin: 4pt 0 6pt 14pt; font-size: ${fontSzSub}pt;">
              ${q.stimulusTitle ? `<b>${escapeHtml(q.stimulusTitle)}</b><br/>` : ''}
              ${q.stimulusText ? `<span style="font-style: italic;">${escapeHtml(q.stimulusText).replace(/\n/g, '<br/>')}</span>` : ''}
            </div>
          `;
        }

        // Authentic Vocalized Arabic Typography (Tanpa Kotak)
        if (q.arabicText) {
          blockHtml += `
            <div style="margin: 5pt 0 7pt 14pt;">
              <p dir="rtl" style="margin: 0; text-align: right; font-family: 'Traditional Arabic', 'Amiri', 'Scheherazade New', serif; font-size: ${Math.round(fontSz * 1.35)}pt; line-height: 1.8; color: #000000; font-weight: bold;">
                ${escapeHtml(q.arabicText)}
              </p>
              ${q.arabicTranslation ? `
                <p style="margin: 2pt 0 0 0; font-size: 8.5pt; color: #334155; font-style: italic;">
                  Artinya: &ldquo;${escapeHtml(q.arabicTranslation)}&rdquo;
                </p>
              ` : ''}
            </div>
          `;
        }

        // Rendered Visual Graphic via Native Word Image Reference (Tanpa Kotak)
        if (questionImageMap[q.id]) {
          const imgInfo = questionImageMap[q.id];
          const displayWidth = Math.min(imgInfo.width, 240);
          const displayHeight = Math.round((imgInfo.height / imgInfo.width) * displayWidth);
          blockHtml += `
            <div style="text-align: center; margin: 6pt 0 6pt 14pt;">
              <img src="${imgInfo.filename}" width="${displayWidth}" height="${displayHeight}" alt="${escapeHtml(imgInfo.alt)}" style="max-height: 140pt; max-width: 85%; height: auto;" />
              <div style="font-size: 8.5pt; color: #475569; font-style: italic; margin-top: 2pt;">
                ${escapeHtml(q.stimulusTitle || imgInfo.alt || 'Gambar Diagram Stimulus')}
              </div>
            </div>
          `;
        }

        // Data Table Stimulus (Native Microsoft Word Table with clean borders) - only if no image diagram
        if (q.stimulusTable && !q.isGroupFirst && !questionImageMap[q.id]) {
          blockHtml += `
            <div style="margin: 4pt 0 6pt 14pt;">
              ${q.stimulusTitle ? `<p style="margin: 0 0 3pt 0; font-weight: bold; font-size: ${fontSzSub}pt; color: #000000;">${escapeHtml(q.stimulusTitle)}</p>` : ''}
              ${q.stimulusText ? `<p style="margin: 0 0 4pt 0; font-style: italic; font-size: ${fontSzSub}pt; color: #334155;">${escapeHtml(q.stimulusText)}</p>` : ''}
              ${renderStimulusTableToWordHtml(q.stimulusTable, fontSzSub)}
            </div>
          `;
        }

        return blockHtml;
      };

      const choiceQuestions = questions.filter(q => q.type === 'pg' || q.type === 'pg_kompleks');
      const allChoiceHtml = choiceQuestions.map(q => {
        if (q.type === 'pg_kompleks') {
          return `
            <div style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
              ${renderWordStimulusBlock(q)}
              <p style="margin: 0 0 3pt 0; font-weight: normal; line-height: ${paperLayout.lineHeight}; font-size: ${fontSz}pt;">
                <b>${q.number}.</b> ${formatMathForWordExport(escapeHtml(q.questionText)).replace(/\n/g, '<br/>')}
              </p>
              ${q.complexStatements && q.complexStatements.length > 0 ? `
                <div style="margin: 3pt 0 5pt 14pt; font-size: ${fontSzSub}pt;">
                  <div style="font-weight: bold; margin-bottom: 2pt;">Perhatikan pernyataan-pernyataan berikut:</div>
                  ${q.complexStatements.map((st, idx) => `<div style="margin: 1.5pt 0;">(${idx + 1}) ${typeof st === 'string' ? escapeHtml(st) : escapeHtml(st.text)}</div>`).join('')}
                  <div style="font-weight: bold; margin-top: 2pt;">Pernyataan yang tepat ditunjukkan oleh nomor ....</div>
                </div>
              ` : ''}
              <table style="width: 100%; border: none; margin-left: 14pt; margin-top: 3pt; font-size: ${fontSz}pt;">
                ${(q.options || []).map(opt => `
                  <tr>
                    <td style="width: 22pt; vertical-align: top; border: none; padding: 1.5pt 0;"><b>${opt.label}.</b></td>
                    <td style="vertical-align: top; border: none; padding: 1.5pt 0;">${formatMathForWordExport(escapeHtml(opt.text))}</td>
                  </tr>
                `).join('')}
              </table>
            </div>
          `;
        }
        return `
          <div style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
            ${renderWordStimulusBlock(q)}
            <p style="margin: 0 0 3pt 0; font-weight: normal; line-height: ${paperLayout.lineHeight}; font-size: ${fontSz}pt;">
              <b>${q.number}.</b> ${formatMathForWordExport(escapeHtml(q.questionText))}
            </p>
            <table style="width: 100%; border: none; margin-left: 14pt; margin-top: 3pt; font-size: ${fontSz}pt;">
              ${(q.options || []).map(opt => `
                <tr>
                  <td style="width: 22pt; vertical-align: top; border: none; padding: 1.5pt 0;"><b>${opt.label}.</b></td>
                  <td style="vertical-align: top; border: none; padding: 1.5pt 0;">${formatMathForWordExport(escapeHtml(opt.text))}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        `;
      }).join('');

      const isianHtml = isianQuestions.map(q => `
        <div style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
          ${renderWordStimulusBlock(q)}
          <p style="margin: 0; font-weight: normal; line-height: ${paperLayout.lineHeight}; font-size: ${fontSz}pt;">
            <b>${q.number}.</b> ${formatMathForWordExport(escapeHtml(q.questionText))}
          </p>
          ${paperLayout.showAnswerDottedLines ? `
            <p style="margin: 4pt 0 0 14pt; color: #555; border-bottom: 1pt dotted #888; width: 60%;">&nbsp;</p>
          ` : ''}
        </div>
      `).join('');

      const esaiHtml = esaiQuestions.map(q => `
        <div style="margin-bottom: ${qMarginBottom}; page-break-inside: avoid;">
          ${renderWordStimulusBlock(q)}
          <p style="margin: 0; font-weight: normal; line-height: ${paperLayout.lineHeight}; font-size: ${fontSz}pt;">
            <b>${q.number}.</b> ${formatMathForWordExport(escapeHtml(q.questionText)).replace(/\n/g, '<br/>')}
          </p>
          ${paperLayout.showAnswerDottedLines ? `
            <div style="margin: 6pt 0 0 14pt; height: 35pt; border-bottom: 1pt dotted #888; width: 95%;"></div>
            <div style="margin: 0 0 0 14pt; height: 26pt; border-bottom: 1pt dotted #888; width: 95%;"></div>
          ` : ''}
        </div>
      `).join('');

      const fullHtml = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns:v='urn:schemas-microsoft-com:vml' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset='utf-8'>
          <title>Naskah Soal - ${escapeHtml(config.mataPelajaran)}</title>
          <style>
            @page { 
              size: ${paperDim.widthCm}cm ${paperDim.heightCm}cm; 
              margin: ${paperLayout.marginTopCm}cm ${paperLayout.marginRightCm}cm ${paperLayout.marginBottomCm}cm ${paperLayout.marginLeftCm}cm; 
              mso-page-orientation: portrait;
            }
            body { 
              font-family: '${fontFam}', serif; 
              font-size: ${fontSz}pt; 
              color: #000; 
              line-height: ${paperLayout.lineHeight}; 
            }
            .header-table { width: 100%; border-collapse: collapse; border-bottom: 2pt solid #000; margin-bottom: 10pt; }
            .header-table td { border: none; padding: 2pt 4pt; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1.5pt solid #000; }
            .info-table td { border: 1pt solid #000; padding: 3pt 5pt; font-size: ${fontSzSub}pt; }
            .section-title { font-weight: bold; font-size: ${fontSz + 0.5}pt; margin: 12pt 0 6pt 0; text-transform: uppercase; background: #e2e8f0; padding: 3pt 6pt; border: 1pt solid #94a3b8; }
            ${paperLayout.columnsCount === 2 ? `
            .questions-columns-flow {
              column-count: 2;
              -webkit-column-count: 2;
              column-gap: 18pt;
              mso-column-count: 2;
            }
            ` : ''}
          </style>
        </head>
        <body>
          <!-- Header Madrasah / Sekolah Sesuai Format Resmi dengan Logo & Garis Ganda -->
          <table class="header-table" style="width: 100%; border-collapse: collapse; border-bottom: 3pt double #000; margin-bottom: 12pt; padding-bottom: 5pt;">
            <tr>
              <td style="width: 60pt; text-align: center; vertical-align: middle; border: none; padding-right: 8pt;">
                <div style="width: 50pt; height: 50pt; margin: 0 auto; text-align: center;">
                  ${headerLogoFilename ? `
                    <img src="${headerLogoFilename}" width="55" height="55" alt="Logo Madrasah" style="width: 45pt; height: 45pt; object-fit: contain;" />
                  ` : ''}
                </div>
              </td>
              <td style="text-align: center; vertical-align: middle; border: none;">
                <p style="font-size: 13pt; margin: 0; font-weight: bold; text-transform: uppercase;">${escapeHtml(config.namaYayasan || 'YAYASAN PERGURUAN MUSLIMIN (YPM)')}</p>
                <p style="font-size: 14pt; margin: 2pt 0; font-weight: bold; text-transform: uppercase;">${escapeHtml(config.namaMadrasah || schoolName || 'MADRASAH IBTIDAIYAH .....')}</p>
                <p style="font-size: 12pt; margin: 0; font-weight: bold; text-transform: uppercase;">${escapeHtml(config.judulAsesmen)} TAHUN PELAJARAN ${escapeHtml(config.tahunPelajaran)}</p>
              </td>
            </tr>
          </table>

          <!-- Tabel Identitas Soal & Nilai (6 Kolom Sesuai Format Gambar) -->
          <table class="info-table" style="width: 100%; border-collapse: collapse; margin-bottom: 12pt; border: 1.5pt solid #000;">
            <tr>
              <td style="width: 22%; border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold;">Mata Pelajaran</td>
              <td style="width: 3%; border: 1pt solid #000; padding: 3pt 2pt; text-align: center; font-weight: bold;">:</td>
              <td style="width: 45%; border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold; text-transform: uppercase;">${escapeHtml(config.mataPelajaran)}</td>
              <td style="width: 10%; border: 1pt solid #000; padding: 3pt 3pt; text-align: center; font-weight: bold;">Nilai</td>
              <td style="width: 10%; border: 1pt solid #000; padding: 3pt 3pt; text-align: center; font-weight: bold;">Paraf Guru</td>
              <td style="width: 10%; border: 1pt solid #000; padding: 3pt 3pt; text-align: center; font-weight: bold;">Paraf Ortu</td>
            </tr>
            <tr>
              <td style="border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold;">Hari, Tanggal</td>
              <td style="border: 1pt solid #000; padding: 3pt 2pt; text-align: center; font-weight: bold;">:</td>
              <td style="border: 1pt solid #000; padding: 3pt 5pt;">${escapeHtml(config.hariTanggal || '')}</td>
              <td rowspan="4" style="border: 1pt solid #000; padding: 3pt; text-align: center; vertical-align: middle;">&nbsp;</td>
              <td rowspan="4" style="border: 1pt solid #000; padding: 3pt; text-align: center; vertical-align: middle;">&nbsp;</td>
              <td rowspan="4" style="border: 1pt solid #000; padding: 3pt; text-align: center; vertical-align: middle;">&nbsp;</td>
            </tr>
            <tr>
              <td style="border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold;">Waktu</td>
              <td style="border: 1pt solid #000; padding: 3pt 2pt; text-align: center; font-weight: bold;">:</td>
              <td style="border: 1pt solid #000; padding: 3pt 5pt;">${escapeHtml(config.waktuPelaksanaan || config.alokasiWaktu || '07.30 – 09.00')}</td>
            </tr>
            <tr>
              <td style="border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold;">Nama</td>
              <td style="border: 1pt solid #000; padding: 3pt 2pt; text-align: center; font-weight: bold;">:</td>
              <td style="border: 1pt solid #000; padding: 3pt 5pt;">........................................................................</td>
            </tr>
            <tr>
              <td style="border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold;">Kelas</td>
              <td style="border: 1pt solid #000; padding: 3pt 2pt; text-align: center; font-weight: bold;">:</td>
              <td style="border: 1pt solid #000; padding: 3pt 5pt; font-weight: bold;">${escapeHtml(config.customClassLabel || formatClassToRomanLabel(config.tingkatKelas))}</td>
            </tr>
          </table>

          <!-- Instruksi Pengerjaan Sesuai Format (PG dan PG Kompleks Bercampur di Bagian I) -->
          <p style="font-weight: bold; font-size: ${fontSz}pt; margin: 10pt 0 8pt 0;">
            I. Berilah tanda silang ( X ) Pada huruf ${config.opsiPgCount === 3 ? 'a, b, atau c' : 'a, b, c atau d'} dengan jawaban yang paling benar!
          </p>

          ${paperLayout.columnsCount === 2 ? '<div class="questions-columns-flow">' : ''}

          ${choiceQuestions.length > 0 ? `
            ${allChoiceHtml}
          ` : ''}

          ${isianQuestions.length > 0 ? `
            <div class="section-title">II. ISIAN SINGKAT (Isilah titik-titik di bawah ini dengan jawaban yang tepat!)</div>
            ${isianHtml}
          ` : ''}

          ${esaiQuestions.length > 0 ? `
            <div class="section-title">${isianQuestions.length > 0 ? 'III' : 'II'}. URAIAN / ESAI (Jawablah pertanyaan-pertanyaan berikut dengan jelas dan benar!)</div>
            ${esaiHtml}
          ` : ''}

          ${paperLayout.columnsCount === 2 ? '</div>' : ''}
        </body>
        </html>
      `;

      // Build RFC 2557 MHTML single-file package (.doc) with all images embedded
      const mhtmlDoc = buildWordMhtmlDocument({
        html: fullHtml,
        images: embeddedImages
      });

      const blob = new Blob(['\ufeff' + mhtmlDoc], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Naskah_Soal_${config.mataPelajaran.replace(/\s+/g, '_')}_${config.tingkatKelas.replace(/\s+/g, '_')}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal mengekspor naskah ke Word:', err);
      alert('Terjadi kesalahan saat memproses gambar stimulus untuk dokumen Word.');
    } finally {
      setIsExportingWord(false);
    }
  };

  // Download Kisi-Kisi Matrix as Word .doc file (with TP, Kelas, Materi, IPK, Indikator Soal, Level, Bentuk, No, Kunci, Skor)
  const handleDownloadWordKisiKisi = () => {
    const tableRows = questions.map((q, idx) => `
      <tr>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top;">${idx + 1}</td>
        <td style="border: 1pt solid #000; padding: 4pt; vertical-align: top; font-size: 9pt;">
          ${escapeHtml(q.tpCode ? `<b>${q.tpCode}:</b> ` : '')}${escapeHtml(q.tujuanPembelajaran || q.capaianPembelajaran || '-')}
        </td>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top; font-size: 9pt;">${escapeHtml(q.classLevel || config.tingkatKelas)}</td>
        <td style="border: 1pt solid #000; padding: 4pt; vertical-align: top; font-size: 9pt;">${escapeHtml(q.materiPokok)}</td>
        <td style="border: 1pt solid #000; padding: 4pt; vertical-align: top; font-size: 9pt;">${escapeHtml(q.ipk || `Menguasai materi ${q.materiPokok}`)}</td>
        <td style="border: 1pt solid #000; padding: 4pt; vertical-align: top; font-size: 9pt;">${escapeHtml(q.indikatorSoal || '-')}</td>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top; font-size: 9pt; font-weight: bold;">${escapeHtml(q.cognitiveLevel)}</td>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top; font-size: 9pt;">
          ${q.type === 'pg_kompleks' ? 'PG Kompleks' : q.type === 'pg' ? (q.subType === 'grup' ? 'PG (Grup)' : 'Pilihan Ganda') : q.type === 'isian' ? 'Isian Singkat' : 'Uraian / Esai'}
        </td>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top; font-weight: bold;">${q.number}</td>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top; font-size: 9pt; font-weight: bold;">${escapeHtml(q.correctAnswer)}</td>
        <td style="border: 1pt solid #000; padding: 4pt; text-align: center; vertical-align: top; font-weight: bold;">${q.score}</td>
      </tr>
    `).join('');

    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Kisi-Kisi Soal - ${escapeHtml(config.mataPelajaran)}</title>
        <style>
          @page { size: 29.7cm 21.0cm; margin: 1.5cm; } /* Landscape */
          body { font-family: 'Times New Roman', serif; font-size: 10pt; color: #000; }
          table { width: 100%; border-collapse: collapse; }
          th { border: 1pt solid #000; padding: 5pt; background-color: #f2f2f2; font-weight: bold; text-align: center; font-size: 9pt; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 14pt;">
          <h2 style="margin: 0; font-size: 13pt; text-transform: uppercase;">KISI-KISI PENULISAN SOAL ASESMEN / EVALUASI</h2>
          <h3 style="margin: 2pt 0; font-size: 11pt; text-transform: uppercase;">${escapeHtml(schoolName)}</h3>
          <p style="margin: 0; font-size: 10pt;">Mata Pelajaran: <b>${escapeHtml(config.mataPelajaran)}</b> | Kelas/Fase: <b>${escapeHtml(config.tingkatKelas)} / ${escapeHtml(config.fase)}</b> | Semester: <b>${config.semester === 1 ? 'Ganjil' : 'Genap'}</b> | TP: <b>${escapeHtml(config.tahunPelajaran)}</b></p>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 24pt;">No</th>
              <th style="width: 140pt;">Tujuan Pembelajaran</th>
              <th style="width: 48pt;">Kelas</th>
              <th style="width: 85pt;">Materi</th>
              <th style="width: 130pt;">Indikator Pencapaian Kompetensi (IPK)</th>
              <th style="width: 130pt;">Indikator Soal</th>
              <th style="width: 45pt;">Level Kognitif</th>
              <th style="width: 60pt;">Bentuk Soal</th>
              <th style="width: 32pt;">Nomor Soal</th>
              <th style="width: 45pt;">Kunci Jawaban</th>
              <th style="width: 32pt;">Skor</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <!-- Titik Mangsa & Tanda Tangan -->
        <table style="width: 100%; margin-top: 25pt; border: none;">
          <tr>
            <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
              <p style="margin: 0;">Mengetahui,</p>
              <p style="margin: 0; font-weight: bold;">Kepala ${escapeHtml(schoolName)}</p>
              <div style="height: 50pt;"></div>
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">${escapeHtml(principalName)}</p>
              <p style="margin: 0; font-size: 9pt;">NIP. ${escapeHtml(principalNip || '-')}</p>
            </td>
            <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
              <p style="margin: 0;">${escapeHtml(signaturePlace)}, ${escapeHtml(signatureDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }))}</p>
              <p style="margin: 0; font-weight: bold;">Guru Kelas</p>
              <div style="height: 50pt;"></div>
              <p style="margin: 0; font-weight: bold; text-decoration: underline;">${escapeHtml(teacherName)}</p>
              <p style="margin: 0; font-size: 9pt;">NIP. ${escapeHtml(teacherNip || '-')}</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kisi_Kisi_Soal_${config.mataPelajaran.replace(/\s+/g, '_')}_${config.tingkatKelas.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (text?: string) => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const filteredQuestions = useMemo(() => {
    if (typeFilter === 'all') return questions;
    return questions.filter(q => q.type === typeFilter);
  }, [questions, typeFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* TOP HEADER DEDICATED FOR GENERATE SOAL */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 screen-only">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Generator & Bank Soal Multi-CP
            </span>
            <span className="text-xs font-semibold text-slate-400">• Kurikulum Merdeka</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
              {config.tingkatKelas} ({config.fase})
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              {config.mataPelajaran}
            </span>
            <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
              {(config.cpList || []).length} CP Terpasang ({totalTpCount} TP)
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles className="text-emerald-600 shrink-0" size={24} />
            <span>Pembuatan Soal Multi-CP & TP Otomatis</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Mendukung pembuatan naskah ujian dengan banyak Capaian Pembelajaran (Multi-CP) & Tujuan Pembelajaran (TP) terintegrasi secara proporsional.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onBackToPerangkat && (
            <button
              onClick={onBackToPerangkat}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              title="Kembali ke Perangkat & Jadwal Pelajaran"
            >
              <ArrowLeft size={14} />
              <span>Kembali</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Naskah</span>
          </button>

          <button
            onClick={handleDownloadWordExam}
            disabled={isExportingWord}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Download Naskah Soal dalam format Microsoft Word (.doc) lengkap dengan gambar & diagram"
          >
            {isExportingWord ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Memproses Gambar...</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Unduh Word (.doc)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* INNER VIEW TABS */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap items-center justify-between gap-1 border border-slate-200/80 screen-only">
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setActiveView('config')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'config'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <Settings size={15} />
            <span>Wadah Multi-CP, TP & Komposisi</span>
          </button>

          <button
            onClick={() => setActiveView('questions')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'questions'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <ListOrdered size={15} />
            <span>Daftar Butir Soal ({questions.length})</span>
          </button>

          <button
            onClick={() => setActiveView('kisikisi')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'kisikisi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>Matriks Kisi-Kisi Soal</span>
          </button>

          <button
            onClick={() => setActiveView('preview')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'preview'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <FileText size={15} />
            <span>Naskah Ujian Siswa</span>
          </button>

          <button
            onClick={() => setActiveView('kunci')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeView === 'kunci'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>Kunci & Penskoran</span>
          </button>
        </div>

        {/* Quick summary score indicator & Kaidah Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('kaidah')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Klik untuk melihat 3 Hal Penting Kaidah Penulisan Soal Terstandar"
          >
            <BookOpen size={14} />
            <span>📘 3 Kaidah Soal</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-200 text-xs font-bold">
            <span className="text-slate-400">Total Skor:</span>
            <span className={`px-2 py-0.5 rounded-md font-black ${
              grandTotalScore === 100 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-amber-100 text-amber-800'
            }`}>
              {grandTotalScore} / 100 Poin
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: WADAH MULTI-CP & KONFIGURASI SOAL (SISTEM KARTU INDUK & POP-UP) */}
      {/* ========================================================================= */}
      {activeView === 'config' && (
        <div className="space-y-6">
          {/* HEADER PENJELASAN RINGKAS */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/90 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Sliders size={18} className="text-emerald-600" />
                <span>Pengaturan & Wadah Asesmen Sesuai Kaidah Standar</span>
              </h3>
              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                Tersusun atas 4 pilar pengaturan: Identitas, Wadah Multi-CP/TP, Komposisi Bentuk Soal (PG, PG-Kompleks MCMA, Isian, Esai), dan Stimulus (Soal Tunggal / Soal Grup). Klik kartu di bawah untuk membuka pop-up isian terfokus.
              </p>
            </div>

            {/* Quick badges summary */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                {config.mataPelajaran} • {config.tingkatKelas}
              </span>
              <span className="px-3 py-1 bg-purple-100 border border-purple-200 rounded-xl text-xs font-black text-purple-800">
                {(config.cpList || []).length} CP Terpilih
              </span>
              <span className="px-3 py-1 bg-teal-100 border border-teal-200 rounded-xl text-xs font-black text-teal-800">
                Mode: {config.modeStimulus === 'grup' ? 'Soal Grup (Literasi)' : 'Soal Tunggal'}
              </span>
              <span className="px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-black text-emerald-800">
                {totalQuestionCount} Butir ({grandTotalScore} Poin)
              </span>
            </div>
          </div>

          {/* BANNER REVOLUSIONER: 1-KLIK AUTO-PILOT / TERIMA JADI (GURU MALAS MIKIR) */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 p-5 rounded-2xl text-white shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/20 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-amber-200">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-tight flex items-center gap-2">
                    <span>⚡ Mode Otomatis 1-Klik: &ldquo;Terima Jadi&rdquo; (Auto-Pilot)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-300 text-amber-950">
                      Rekomendasi
                    </span>
                  </h4>
                  <p className="text-[11px] text-amber-100 font-medium">
                    Malas pusing mikir rumusan CP, menurunkan TP, gambar diagram, atau teks Arab? Klik 1 tombol di bawah ini:
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-100 self-start sm:self-auto bg-black/20 px-2.5 py-1 rounded-lg">
                100% Berstimulus & Siap Cetak
              </span>
            </div>

            {/* Tombol Pilihan Mata Pelajaran Cepat (1-Klik Jadi) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              <button
                type="button"
                onClick={() => handleOneClickAutoPilot('Fiqih')}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="Fiqih: Otomatis CP Shalat & Wudhu, Diagram Rukun Wudhu, Dalil Berharakat & Kisi-Kisi"
              >
                <span className="text-base mb-1">🕌</span>
                <span className="truncate w-full text-center">Fiqih</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Shalat & Wudhu</span>
              </button>

              <button
                type="button"
                onClick={() => handleOneClickAutoPilot('Akidah Akhlak')}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="Akidah Akhlak: Otomatis 3 CP Asmaul Husna, Kalimat Thayyibah & Adab"
              >
                <span className="text-base mb-1">🌟</span>
                <span className="truncate w-full text-center">Akidah Akhlak</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Asmaul Husna</span>
              </button>

              <button
                type="button"
                onClick={() => handleOneClickAutoPilot('Matematika')}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="Matematika: Otomatis CP Geometri & Bilangan, Diagram SVG Lingkaran/Balok/Segitiga No Editing"
              >
                <span className="text-base mb-1">📐</span>
                <span className="truncate w-full text-center">Matematika</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Diagram SVG Jadi</span>
              </button>

              <button
                type="button"
                onClick={() => handleOneClickAutoPilot("Al-Qur'an Hadis")}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="Qur'an Hadits: Otomatis Surat Al-Ma'un, At-Tin & Hadits Berharakat Asli"
              >
                <span className="text-base mb-1">📖</span>
                <span className="truncate w-full text-center">Qur&apos;an Hadits</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Ayat Berharakat</span>
              </button>

              <button
                type="button"
                onClick={() => handleOneClickAutoPilot('Bahasa Arab')}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="Bahasa Arab: Otomatis Hiwar & Kosakata Keluarga Berharakat Siap Pakai"
              >
                <span className="text-base mb-1">🗣️</span>
                <span className="truncate w-full text-center">Bahasa Arab</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Hiwar & Usrah</span>
              </button>

              <button
                type="button"
                onClick={() => handleOneClickAutoPilot('Bahasa Indonesia')}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="Bahasa Indonesia: Otomatis Teks Cerita Narasi & Ejaan"
              >
                <span className="text-base mb-1">🇮🇩</span>
                <span className="truncate w-full text-center">Bhs Indonesia</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Narasi Cerita</span>
              </button>

              <button
                type="button"
                onClick={() => handleOneClickAutoPilot('IPAS')}
                className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white text-white hover:text-emerald-900 border border-white/20 rounded-xl font-bold text-xs transition-all shadow-2xs hover:scale-[1.03] active:scale-[0.97] cursor-pointer group"
                title="IPAS: Otomatis Fotosintesis & Kearifan Lokal"
              >
                <span className="text-base mb-1">🔬</span>
                <span className="truncate w-full text-center">IPAS</span>
                <span className="text-[9px] opacity-80 group-hover:text-emerald-700 font-normal">Sains & Alam</span>
              </button>
            </div>
          </div>

          {/* GRID 5 KARTU INDUK PENGATURAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* KARTU INDUK 1: IDENTITAS ASESMEN & MAPEL */}
            <div 
              onClick={() => setActiveModal('identitas')}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black group-hover:bg-emerald-600 group-hover:text-white transition">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition">
                        1. Identitas Asesmen & Mapel
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        Mata pelajaran, kelas/fase, semester, waktu
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition">
                    Edit
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Mata Pelajaran</span>
                    <span className="font-black text-slate-800 truncate block mt-0.5">{config.mataPelajaran}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Kelas & Fase</span>
                    <span className="font-black text-slate-800 truncate block mt-0.5">{config.tingkatKelas} ({config.fase})</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Semester & TP</span>
                    <span className="font-black text-slate-800 truncate block mt-0.5">
                      {config.semester === 1 ? 'Ganjil' : 'Genap'} • {config.tahunPelajaran}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Jenis & Alokasi Waktu</span>
                    <span className="font-black text-slate-800 truncate block mt-0.5">
                      {config.judulAsesmen.split(' ')[0]} • {config.alokasiWaktu}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5">
                  <Sliders size={14} />
                  <span>Buka Isian Identitas Asesmen</span>
                </span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* KARTU INDUK 2: WADAH MULTI-CP & TUJUAN PEMBELAJARAN (TP) */}
            <div 
              onClick={() => setActiveModal('cp')}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black group-hover:bg-purple-600 group-hover:text-white transition">
                      <Target size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-purple-700 transition">
                        2. Wadah Multi-CP & Rumusan TP
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        Daftar CP fleksibel & perumusan TP otomatis
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                      {(config.cpList || []).length} CP
                    </span>
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      {totalTpCount} TP
                    </span>
                  </div>
                </div>

                {/* Preview CP Chips */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-hidden">
                    {(config.cpList || []).map((c, idx) => (
                      <span 
                        key={c.id || idx} 
                        className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg truncate max-w-full"
                        title={`${c.code}: ${c.elemen} - ${c.materiPokok}`}
                      >
                        <span className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] font-black shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{c.materiPokok || c.elemen}</span>
                        <span className="text-[10px] text-purple-600 font-extrabold shrink-0">
                          ({c.tpList?.length || 0} TP)
                        </span>
                      </span>
                    ))}
                  </div>

                  <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-purple-900 font-medium flex items-center gap-2">
                    <Wand2 size={13} className="text-purple-600 shrink-0" />
                    <span>Fleksibel: Atur jumlah CP bebas (1-10 CP) & rumuskan TP otomatis 1-klik!</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5">
                  <Target size={14} />
                  <span>Buka & Atur CP / Rumuskan TP</span>
                </span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* KARTU INDUK 3: KOMPOSISI BENTUK & BOBOT SOAL */}
            <div 
              onClick={() => setActiveModal('komposisi')}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition">
                      <Percent size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-blue-700 transition">
                        3. Komposisi Bentuk & Bobot Soal
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        PG Tunggal, PG Kompleks (MCMA), Isian, & Esai
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border ${
                    grandTotalScore === 100 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {grandTotalScore} / 100 Poin
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
                  <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200/80">
                    <span className="text-[10px] text-emerald-700 font-black block uppercase truncate">PG Tunggal</span>
                    <span className="text-sm font-black text-emerald-950 block mt-0.5">{config.jumlahPg} Soal</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">{totalScorePg} Poin</span>
                  </div>

                  <div className="bg-teal-50/60 p-2 rounded-xl border border-teal-200/80">
                    <span className="text-[10px] text-teal-700 font-black block uppercase truncate">PG Kompleks</span>
                    <span className="text-sm font-black text-teal-950 block mt-0.5">{config.jumlahPgKompleks || 0} Soal</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">{totalScorePgKompleks} Poin</span>
                  </div>

                  <div className="bg-sky-50/60 p-2 rounded-xl border border-sky-200/80">
                    <span className="text-[10px] text-sky-700 font-black block uppercase truncate">Isian</span>
                    <span className="text-sm font-black text-sky-950 block mt-0.5">{config.jumlahIsian} Soal</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">{totalScoreIsian} Poin</span>
                  </div>

                  <div className="bg-purple-50/60 p-2 rounded-xl border border-purple-200/80">
                    <span className="text-[10px] text-purple-700 font-black block uppercase truncate">Esai</span>
                    <span className="text-sm font-black text-purple-950 block mt-0.5">{config.jumlahEsai} Soal</span>
                    <span className="text-[10px] text-slate-500 font-semibold block">{totalScoreEsai} Poin</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 rounded-xl text-[11px] text-slate-600 font-medium flex items-center justify-between">
                  <span>Total Seluruh: <b>{totalQuestionCount} Butir Soal</b></span>
                  <span className="text-slate-400">Opsi PG: {config.opsiPgCount} Pilihan</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5">
                  <Percent size={14} />
                  <span>Buka & Atur 4 Bentuk Soal / Bobot</span>
                </span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* KARTU INDUK 4: JENIS & WADAH STIMULUS SOAL */}
            <div 
              onClick={() => setActiveModal('stimulus')}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black group-hover:bg-amber-600 group-hover:text-white transition">
                      <AlignLeft size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-700 transition">
                        4. Jenis & Wadah Stimulus Soal
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        Kaidah Soal Tunggal & Soal Grup (Literasi)
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {config.stimulusType === 'none' ? 'Tanpa Stimulus' : config.stimulusType === 'cerita' ? 'Teks Cerita' : config.stimulusType === 'tabel' ? 'Tabel Data' : config.stimulusType === 'gambar' ? 'Gambar' : 'Gabungan'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Mode Soal:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {config.modeStimulus === 'grup' 
                        ? `Soal Grup (1 Stimulus → ${config.grupQuestionCount || 4} Butir)` 
                        : 'Soal Tunggal (1 Stimulus → 1 Butir)'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Jenis Stimulus:</span>
                    <span className="font-bold text-slate-700">
                      {config.stimulusType === 'none' && 'Pertanyaan Langsung'}
                      {config.stimulusType === 'cerita' && 'Teks Narasi / Fabel / Kontekstual'}
                      {config.stimulusType === 'tabel' && 'Tabel Data / Rekap Angka'}
                      {config.stimulusType === 'gambar' && 'Gambar Ilustrasi / Diagram'}
                      {config.stimulusType === 'gabungan' && 'Kombinasi Teks Narasi + Data'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Judul Stimulus:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[200px]">
                      {config.stimulusTitle || '-'}
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-amber-50/70 border border-amber-100 rounded-xl text-[11px] text-amber-900 font-medium">
                  {config.modeStimulus === 'grup' 
                    ? '💡 Soal Grup: Teks/stimulus ditampilkan sekali di butir pembuka, butir selanjutnya mengacu tanpa mengulang teks.'
                    : '💡 Soal Tunggal: Setiap butir memiliki konteks atau stimulus independen tersendiri.'}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5">
                  <AlignLeft size={14} />
                  <span>Buka Mode Stimulus & Teks</span>
                </span>
                <ChevronRight size={16} />
              </div>
            </div>

            {/* KARTU INDUK 5: TATA LETAK HURUF & UKURAN KERTAS NASKAH */}
            <div 
              onClick={() => setActiveModal('tataLetak')}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between md:col-span-2 lg:col-span-1"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black group-hover:bg-indigo-600 group-hover:text-white transition">
                      <SlidersHorizontal size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 group-hover:text-indigo-700 transition">
                        5. Format Huruf, Kertas & Kolom
                      </h4>
                      <span className="text-[11px] text-slate-400 block">
                        Font, Ukuran pt, Kertas (F4/A4), Margin & Kolom
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                    {PAPER_DIMENSIONS[paperLayout.paperSize].name}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Jenis Huruf:</span>
                    <span className="font-bold text-slate-800" style={{ fontFamily: paperLayout.fontFamily }}>
                      {paperLayout.fontFamily}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Ukuran Font:</span>
                    <span className="font-bold text-slate-700">
                      {paperLayout.fontSizePt} pt (Spasi: {paperLayout.lineHeight})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Ukuran Kertas:</span>
                    <span className="font-bold text-emerald-800">
                      {PAPER_DIMENSIONS[paperLayout.paperSize].name} ({PAPER_DIMENSIONS[paperLayout.paperSize].widthCm} × {PAPER_DIMENSIONS[paperLayout.paperSize].heightCm} cm)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Alur Kolom:</span>
                    <span className="font-bold text-amber-800">
                      {paperLayout.columnsCount === 1 ? '1 Kolom Standar' : '⚡ 2 Kolom (Model Koran - Hemat Kertas)'}
                    </span>
                  </div>
                </div>

                <div className="p-2 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 font-medium flex items-center gap-2">
                  <SlidersHorizontal size={13} className="text-indigo-600 shrink-0" />
                  <span>Dinamis: Hasil cetak & Word (.doc) otomatis mengikuti format ini.</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-bold text-indigo-700 group-hover:translate-x-0.5 transition-transform">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal size={14} />
                  <span>Buka & Atur Format Naskah</span>
                </span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>

          {/* MAIN ACTION: PILIH METODE GENERATE SOAL (DUAL MODE: CODING INSTAN VS AI GEMINI) */}
          <div className="bg-slate-900 p-6 sm:p-7 rounded-3xl text-white shadow-xl border border-slate-700/80 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold mb-2">
                  <Sparkles size={13} className="text-emerald-400" />
                  <span>Siap Membuat Paket Naskah Soal?</span>
                </div>
                <h4 className="text-lg font-black text-white">
                  Pilih Metode Pembuatan Soal ({totalQuestionCount} Butir Soal)
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Soal akan didistribusikan ke <b>{(config.cpList || []).length} Capaian Pembelajaran</b> lengkap dengan kisi-kisi, kunci jawaban, dan rubrik.
                </p>
              </div>

              {lastGenerationMode && (
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] text-slate-300 self-start md:self-auto">
                  Draf aktif dibuat via: <b className={lastGenerationMode === 'ai' ? 'text-violet-400' : 'text-emerald-400'}>{lastGenerationMode === 'ai' ? '✨ Gemini AI' : '⚡ Coding Instan'}</b>
                </div>
              )}
            </div>

            {/* DUAL OPTIONS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OPSI 1: MODE CODING INSTAN */}
              <div className="bg-slate-800/90 hover:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-sm text-emerald-300">
                      <Zap size={16} className="text-emerald-400" />
                      <span>Mode Coding Instan</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                      ⚡ &lt; 1 Detik / Offline
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Menggunakan algoritma program deterministik & bank template baku. Bekerja super cepat, 100% konsisten, dan dapat digunakan tanpa internet/kuota.
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span>Rasio satuan, pola bilangan, FPB/KPK & geometri siap pakai</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-emerald-400 shrink-0" />
                      <span>Distribusi bobot & nomor soal terjamin rapi</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleGenerateQuestions}
                  disabled={isGeneratingAI}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Zap size={14} />
                  <span>⚡ Generate via Coding (Instan)</span>
                </button>
              </div>

              {/* OPSI 2: MODE AI GEMINI */}
              <div className="bg-gradient-to-br from-indigo-950/70 via-slate-800/90 to-purple-950/60 hover:to-purple-950/80 p-4 sm:p-5 rounded-2xl border border-indigo-700/60 hover:border-violet-500/60 transition-all flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-sm text-violet-300">
                      <Sparkles size={16} className="text-violet-400" />
                      <span>Mode AI Gemini</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-800/50">
                      ✨ Cerdas & Penuh Konteks
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    AI membaca naskah CP secara menyeluruh dari awal hingga akhir, merumuskan butir-butir soal segar, penalaran HOTS, dan stimulus unik sesuai materi.
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-violet-400 shrink-0" />
                      <span>Menjangkau seluruh sub-materi (rasio, proporsi, dll.)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check size={12} className="text-violet-400 shrink-0" />
                      <span>Stimulus narasi kontekstual baru dan orisinal</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleGenerateQuestionsAI}
                  disabled={isGeneratingAI}
                  className="w-full py-3 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-white" />
                      <span>AI Sedang Merumuskan Soal...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-amber-300" />
                      <span>✨ Generate via AI Gemini</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {isGeneratingAI && (
              <div className="p-3.5 bg-violet-950/70 border border-violet-700/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-violet-200">
                <div className="flex items-center gap-2.5">
                  <RefreshCw size={15} className="animate-spin text-violet-300 shrink-0" />
                  <span>{aiProgressText || 'Gemini AI sedang menyusun naskah soal lengkap...'}</span>
                </div>
                <button
                  onClick={handleCancelGenerateAI}
                  className="px-3 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                >
                  ✕ Batalkan Proses AI
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL POP-UP PENGATURAN TERFOKUS */}
      {/* ========================================================================= */}
      {activeModal !== null && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-xs ${
                  activeModal === 'identitas' ? 'bg-emerald-600' :
                  activeModal === 'cp' ? 'bg-purple-600' :
                  activeModal === 'komposisi' ? 'bg-blue-600' : 
                  activeModal === 'stimulus' ? 'bg-amber-600' : 
                  activeModal === 'tataLetak' ? 'bg-indigo-600' : 'bg-gradient-to-tr from-amber-500 to-amber-600'
                }`}>
                  {activeModal === 'identitas' && <BookOpen size={20} />}
                  {activeModal === 'cp' && <Target size={20} />}
                  {activeModal === 'komposisi' && <Percent size={20} />}
                  {activeModal === 'stimulus' && <AlignLeft size={20} />}
                  {activeModal === 'kaidah' && <BookOpen size={20} />}
                  {activeModal === 'tataLetak' && <SlidersHorizontal size={20} />}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    {activeModal === 'identitas' && 'Pengaturan 1: Identitas Asesmen & Mata Pelajaran'}
                    {activeModal === 'cp' && 'Pengaturan 2: Wadah Multi-CP & Tujuan Pembelajaran (TP)'}
                    {activeModal === 'komposisi' && 'Pengaturan 3: Komposisi 4 Bentuk Soal & Penskoran'}
                    {activeModal === 'stimulus' && 'Pengaturan 4: Mode Stimulus (Soal Tunggal / Soal Grup)'}
                    {activeModal === 'kaidah' && '📘 3 Hal Penting Kaidah Penulisan Soal Terstandar'}
                    {activeModal === 'tataLetak' && 'Pengaturan Huruf, Ukuran Kertas & Tata Letak Naskah'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeModal === 'identitas' && 'Sesuaikan nama mata pelajaran, jenjang kelas, semester, dan waktu pengerjaan.'}
                    {activeModal === 'cp' && 'Tentukan jumlah CP yang diujikan secara fleksibel dan rumuskan TP otomatis dengan 1 klik.'}
                    {activeModal === 'komposisi' && 'Atur komposisi PG Tunggal, PG Kompleks (MCMA), Isian, Esai dengan target pas 100 poin.'}
                    {activeModal === 'stimulus' && 'Atur jenis soal (Soal Tunggal / Soal Grup) dan wadah stimulus narasi cerita, tabel, atau gambar.'}
                    {activeModal === 'kaidah' && 'Pedoman wajib penulis soal: Jenis Soal, Kaidah Penulisan (Substansi, Konstruksi, Bahasa), dan Bentuk Soal.'}
                    {activeModal === 'tataLetak' && 'Atur jenis huruf, ukuran font, ukuran kertas (F4/A4), margin halaman, spasi, dan layout 1/2 kolom.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer"
                title="Tutup Jendela"
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* CONTENT 1: IDENTITAS */}
              {activeModal === 'identitas' && (
                <div className="space-y-5">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-emerald-900">
                      Pilih Cepat dari Preset Kurikulum Madrasah:
                    </span>
                    <select
                      value={config.mataPelajaran}
                      onChange={(e) => handleLoadSubjectPreset(e.target.value)}
                      className="bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs font-black text-emerald-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Akidah Akhlak">Akidah Akhlak (3 CP)</option>
                      <option value="Fiqih">Fiqih (2 CP)</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia (2 CP)</option>
                      <option value="Matematika">Matematika (2 CP)</option>
                      <option value="IPAS">IPAS (2 CP)</option>
                      <option value="Al-Qur'an Hadits">Al-Qur'an Hadits</option>
                      <option value="Bahasa Arab">Bahasa Arab</option>
                      <option value="Pendidikan Pancasila">Pendidikan Pancasila</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Mata Pelajaran</label>
                      <input
                        type="text"
                        value={config.mataPelajaran}
                        onChange={(e) => setConfig({ ...config, mataPelajaran: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Tingkat Kelas & Fase</label>
                      <select
                        value={config.tingkatKelas}
                        onChange={(e) => {
                          const cls = e.target.value;
                          const num = parseInt(cls.replace(/\D/g, ''), 10) || 4;
                          const f = num <= 2 ? 'Fase A' : num <= 4 ? 'Fase B' : 'Fase C';
                          setConfig({ ...config, tingkatKelas: cls, fase: f });
                          if (setSelectedClassLevel) setSelectedClassLevel(cls);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Kelas 1">Kelas 1 (Fase A)</option>
                        <option value="Kelas 2">Kelas 2 (Fase A)</option>
                        <option value="Kelas 3">Kelas 3 (Fase B)</option>
                        <option value="Kelas 4">Kelas 4 (Fase B)</option>
                        <option value="Kelas 5">Kelas 5 (Fase C)</option>
                        <option value="Kelas 6">Kelas 6 (Fase C)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Semester & Tahun Pelajaran</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={config.semester}
                          onChange={(e) => setConfig({ ...config, semester: Number(e.target.value) as 1 | 2 })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value={1}>Ganjil (1)</option>
                          <option value={2}>Genap (2)</option>
                        </select>
                        <input
                          type="text"
                          value={config.tahunPelajaran}
                          onChange={(e) => setConfig({ ...config, tahunPelajaran: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="2026/2027"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Jenis Asesmen & Alokasi Waktu</label>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={config.judulAsesmen}
                          onChange={(e) => setConfig({ ...config, judulAsesmen: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="PENILAIAN AKHIR SEMESTER (PAS)">PENILAIAN AKHIR SEMESTER (PAS)</option>
                          <option value="SUMATIF AKHIR SEMESTER (SAS)">SUMATIF AKHIR SEMESTER (SAS)</option>
                          <option value="SUMATIF TENGAH SEMESTER (STS)">SUMATIF TENGAH SEMESTER (STS)</option>
                          <option value="PENILAIAN AKHIR TAHUN (PAT / ASAT)">PENILAIAN AKHIR TAHUN (PAT / ASAT)</option>
                          <option value="ASESMEN SUMATIF LINGKUP MATERI">Formatif / Lingkup Materi</option>
                          <option value="ASESMEN MADRASAH (AM)">ASESMEN MADRASAH (AM)</option>
                        </select>
                        <input
                          type="text"
                          value={config.alokasiWaktu}
                          onChange={(e) => setConfig({ ...config, alokasiWaktu: e.target.value, waktuPelaksanaan: e.target.value })}
                          className="bg-slate-50 border border-slate-200 rounded-xl px-2 py-2.5 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="07.30 – 09.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* KOP NASKAH SOAL & IDENTITAS RESMI (DINAMIS SESUAI ATURAN KOP RESMI) */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                        📋 Pengaturan KOP Naskah Soal & Identitas Siswa
                      </span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded-full">
                        Dinamis Sesuai Inputan
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Nama Yayasan / Instansi Pembina (Baris 1)
                        </label>
                        <input
                          type="text"
                          value={config.namaYayasan || ''}
                          onChange={(e) => setConfig({ ...config, namaYayasan: e.target.value })}
                          placeholder="YAYASAN PERGURUAN MUSLIMIN (YPM)"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Contoh: YAYASAN PERGURUAN MUSLIMIN (YPM) atau KEMENTERIAN AGAMA
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Nama Madrasah / Sekolah (Baris 2)
                        </label>
                        <input
                          type="text"
                          value={config.namaMadrasah || ''}
                          onChange={(e) => setConfig({ ...config, namaMadrasah: e.target.value })}
                          placeholder="MADRASAH IBTIDAIYAH ....."
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Nama resmi madrasah/sekolah yang tercetak di naskah soal.
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Hari, Tanggal Pelaksanaan
                        </label>
                        <input
                          type="text"
                          value={config.hariTanggal || ''}
                          onChange={(e) => setConfig({ ...config, hariTanggal: e.target.value })}
                          placeholder="Contoh: Senin, 02 Desember 2024 (bisa dikosongkan)"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Bila dikosongkan, pada lembar ujian akan tetap rapi sesuai format.
                        </p>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-bold mb-1">
                          Waktu Ujian di Tabel
                        </label>
                        <input
                          type="text"
                          value={config.waktuPelaksanaan || config.alokasiWaktu || ''}
                          onChange={(e) => setConfig({ ...config, waktuPelaksanaan: e.target.value, alokasiWaktu: e.target.value })}
                          placeholder="Contoh: 07.30 – 09.00"
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Jam pengerjaan ujian yang tertera di tabel identitas.
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-slate-700 font-bold mb-1">
                          Format Teks Kelas pada Tabel
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={config.customClassLabel || formatClassToRomanLabel(config.tingkatKelas)}
                            onChange={(e) => setConfig({ ...config, customClassLabel: e.target.value })}
                            placeholder="Contoh: VI (Enam) atau IV (Empat)"
                            className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <button
                            type="button"
                            onClick={() => setConfig({ ...config, customClassLabel: formatClassToRomanLabel(config.tingkatKelas) })}
                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-[11px] shrink-0 cursor-pointer"
                            title="Reset otomatis sesuai tingkat kelas"
                          >
                            Auto: {formatClassToRomanLabel(config.tingkatKelas)}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Menyesuaikan dengan pilihan kelas (misal Kelas 6 menjadi <b>VI (Enam)</b>, Kelas 4 menjadi <b>IV (Empat)</b>).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT 2: WADAH MULTI-CP & TP (FLEXIBLE USER DETERMINED CP COUNT) */}
              {activeModal === 'cp' && (
                <div className="space-y-6">
                  {/* BANNER PRAKTIS: GURU TIDAK PERLU PUSING MIKIR */}
                  <div className="bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                          💡 Mode Terima Jadi
                        </span>
                        <h4 className="text-xs font-black text-slate-800">
                          Rumusan CP & TP Ini Sudah Terisi Otomatis Sesuai Standar Kurikulum!
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Bapak/Ibu <b>tidak perlu repot mengetik atau memikirkan</b> rumusannya. Sudah langsung kami sinkronkan dengan kurikulum resmi Kemenag/Kemendikbud.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOneClickAutoPilot(config.mataPelajaran)}
                      className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-black shrink-0 shadow-sm flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition"
                    >
                      <Sparkles size={14} className="text-amber-300" />
                      <span>⚡ Pakai Otomatis & Lihat Naskah Jadi</span>
                    </button>
                  </div>

                  {/* PANEL KONTROL JUMLAH CP FLEKSIBEL */}
                  <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-slate-50 border border-purple-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-950">
                          Tentukan Jumlah CP yang Diujikan
                        </span>
                        <span className="text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold">
                          Fleksibel
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Pilih langsung jumlah Capaian Pembelajaran (CP) yang Anda butuhkan (1 s/d 10 CP).
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Preset tombol cepat */}
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((num) => {
                          const isActive = (config.cpList || []).length === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleSetCpCount(num)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400'
                                  : 'bg-white hover:bg-purple-100 text-slate-700 border border-purple-200'
                              }`}
                              title={`Atur tepat ${num} Capaian Pembelajaran`}
                            >
                              {num} CP
                            </button>
                          );
                        })}
                      </div>

                      {/* Stepper counter +/- */}
                      <div className="flex items-center bg-white rounded-xl border border-purple-300 shadow-2xs overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleSetCpCount((config.cpList || []).length - 1)}
                          disabled={(config.cpList || []).length <= 1}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-purple-100 text-slate-700 font-black text-sm disabled:opacity-40 transition cursor-pointer"
                          title="Kurangi 1 CP"
                        >
                          -
                        </button>
                        <div className="px-3 py-1 text-center min-w-[50px]">
                          <span className="text-xs font-black text-purple-900 block leading-tight">
                            {(config.cpList || []).length}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">
                            CP
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSetCpCount((config.cpList || []).length + 1)}
                          disabled={(config.cpList || []).length >= 10}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-purple-100 text-slate-700 font-black text-sm disabled:opacity-40 transition cursor-pointer"
                          title="Tambah 1 CP"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BAR: TP OTOMATIS & TAMBAH CP */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <span className="text-xs font-black text-slate-700">
                      Daftar {(config.cpList || []).length} Capaian Pembelajaran & Rincian TP:
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleGenerateAllAutoTP}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
                        title="Rumuskan Tujuan Pembelajaran (TP) otomatis untuk seluruh CP sekaligus"
                      >
                        <Wand2 size={13} className="text-amber-300" />
                        <span>⚡ Rumuskan Semua TP Otomatis</span>
                      </button>

                      <button
                        onClick={handleAddCP}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        <Plus size={13} />
                        <span>+ Tambah CP Manual</span>
                      </button>
                    </div>
                  </div>

                  {/* DAFTAR KARTU CP */}
                  <div className="space-y-4">
                    {(config.cpList || []).map((cp, cpIdx) => (
                      <div 
                        key={cp.id}
                        className="bg-slate-50/90 rounded-2xl border border-slate-200 p-4 space-y-4 hover:border-purple-300 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                              {cp.code}
                            </span>
                            <div>
                              <span className="text-xs font-black text-slate-800 block">
                                Capaian Pembelajaran #{cpIdx + 1}
                              </span>
                              <span className="text-[10px] text-slate-500 font-semibold block">
                                {(cp.tpList || []).length} Tujuan Pembelajaran (TP) Terdaftar
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* TOMBOL TP OTOMATIS PER CP */}
                            <button
                              onClick={() => handleGenerateAutoTPForCP(cp.id)}
                              className="flex items-center gap-1 px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-bold transition cursor-pointer"
                              title="Rumuskan Tujuan Pembelajaran (TP) otomatis dari teks CP ini"
                            >
                              <Wand2 size={13} className="text-amber-600" />
                              <span>⚡ TP Otomatis</span>
                            </button>

                            <button
                              onClick={() => handleAddManualTP(cp.id)}
                              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                            >
                              <Plus size={13} />
                              <span>TP Manual</span>
                            </button>

                            {(config.cpList || []).length > 1 && (
                              <button
                                onClick={() => handleRemoveCP(cp.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                title="Hapus CP ini"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* INPUT CP */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-700 font-bold mb-1">
                              Elemen / Domain CP #{cpIdx + 1}
                            </label>
                            <input
                              type="text"
                              value={cp.elemen}
                              onChange={(e) => handleUpdateCPField(cp.id, 'elemen', e.target.value)}
                              placeholder="Contoh: Akidah / Geometri"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>

                          <div>
                            <label className="block text-slate-700 font-bold mb-1">
                              Materi Pokok / Bab Terkait
                            </label>
                            <input
                              type="text"
                              value={cp.materiPokok}
                              onChange={(e) => handleUpdateCPField(cp.id, 'materiPokok', e.target.value)}
                              placeholder="Contoh: Asmaul Husna"
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700">
                              Rumusan Teks Capaian Pembelajaran (CP)
                            </label>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-bold">
                              ✓ Terisi Otomatis (Standar Kurikulum)
                            </span>
                          </div>
                          <textarea
                            rows={2}
                            value={cp.capaianPembelajaran}
                            onChange={(e) => handleUpdateCPField(cp.id, 'capaianPembelajaran', e.target.value)}
                            placeholder="Tuliskan rumusan Capaian Pembelajaran..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-medium leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <p className="text-[10px] text-slate-500 mt-1">
                            💡 <b>Bagi yang tidak ingin repot mikir:</b> Biarkan teks ini apa adanya. Sudah sesuai kurikulum dan otomatis diturunkan menjadi butir soal & kisi-kisi.
                          </p>
                        </div>

                        {/* LIST TP */}
                        <div className="bg-white p-3 rounded-xl border border-slate-200/90 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-purple-600" />
                              <span>Rincian Tujuan Pembelajaran (TP) ({cp.tpList?.length || 0}):</span>
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Otomatis dipetakan ke kisi-kisi soal
                            </span>
                          </div>

                          {(!cp.tpList || cp.tpList.length === 0) ? (
                            <div className="p-2.5 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400">
                              Belum ada TP. Klik tombol <b>⚡ TP Otomatis</b> untuk merumuskannya secara instan!
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              {cp.tpList.map((tp, tpIdx) => (
                                <div key={tp.id} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs">
                                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-black text-[10px] shrink-0">
                                    {tp.code || `TP ${cpIdx + 1}.${tpIdx + 1}`}
                                  </span>
                                  <input
                                    type="text"
                                    value={tp.text}
                                    onChange={(e) => handleUpdateTPText(cp.id, tp.id, e.target.value)}
                                    className="flex-1 bg-transparent border-none text-xs text-slate-800 font-medium focus:outline-none focus:bg-white focus:px-2 rounded"
                                  />
                                  <button
                                    onClick={() => handleRemoveTP(cp.id, tp.id)}
                                    className="p-1 text-slate-300 hover:text-red-500 rounded cursor-pointer"
                                    title="Hapus TP ini"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTENT 3: KOMPOSISI 4 BENTUK & JUMLAH SOAL */}
              {activeModal === 'komposisi' && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                    <div>
                      <span className="text-xs font-black text-blue-900 block">
                        Optimasi Penskoran 4 Bentuk Soal:
                      </span>
                      <span className="text-[11px] text-blue-700">
                        Sesuai kaidah: PG Tunggal, PG Kompleks (MCMA), Isian Singkat, dan Uraian/Esai. Klik tombol untuk pas 100 Poin.
                      </span>
                    </div>

                    <button
                      onClick={handleAutoAdjustWeights}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs"
                    >
                      <RefreshCw size={13} />
                      <span>⚡ Otomatiskan ke 100 Poin</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* PG TUNGGAL */}
                    <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-black uppercase bg-emerald-600 text-white truncate">
                          1. PG Tunggal
                        </span>
                        <span className="text-xs font-black text-emerald-900">
                          {totalScorePg} Poin
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Jumlah Butir</label>
                          <input
                            type="number"
                            min={0}
                            max={50}
                            value={config.jumlahPg}
                            onChange={(e) => setConfig({ ...config, jumlahPg: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                            className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 font-black text-emerald-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Bobot / Butir</label>
                          <input
                            type="number"
                            min={1}
                            max={20}
                            value={config.bobotPg}
                            onChange={(e) => setConfig({ ...config, bobotPg: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 font-black text-emerald-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Format Opsi</label>
                          <select
                            value={config.opsiPgCount}
                            onChange={(e) => setConfig({ ...config, opsiPgCount: Number(e.target.value) as 3 | 4 })}
                            className="w-full bg-white border border-emerald-300 rounded-xl px-2 py-1.5 font-bold text-slate-800 focus:outline-none text-[11px]"
                          >
                            <option value={3}>3 Opsi (A, B, C) - Kelas 1-3</option>
                            <option value={4}>4 Opsi (A, B, C, D) - Kelas 4-6</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* PG KOMPLEKS (MCMA) */}
                    <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-black uppercase bg-teal-600 text-white truncate">
                          2. PG Kompleks (MCMA)
                        </span>
                        <span className="text-xs font-black text-teal-900">
                          {totalScorePgKompleks} Poin
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Jumlah Butir</label>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={config.jumlahPgKompleks || 0}
                            onChange={(e) => setConfig({ ...config, jumlahPgKompleks: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                            className="w-full bg-white border border-teal-300 rounded-xl px-3 py-1.5 font-black text-teal-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Bobot / Butir</label>
                          <input
                            type="number"
                            min={1}
                            max={25}
                            value={config.bobotPgKompleks || 4}
                            onChange={(e) => setConfig({ ...config, bobotPgKompleks: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className="w-full bg-white border border-teal-300 rounded-xl px-3 py-1.5 font-black text-teal-900 focus:outline-none"
                          />
                        </div>

                        <div className="p-2 bg-white/90 rounded-xl text-[10px] text-teal-800 leading-snug border border-teal-100">
                          Format MCMA: Butir pernyataan 1, 2, 3, 4 dengan kombinasi jawaban A, B, C, D.
                        </div>
                      </div>
                    </div>

                    {/* ISIAN SINGKAT */}
                    <div className="bg-sky-50/60 border border-sky-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-black uppercase bg-sky-600 text-white truncate">
                          3. Isian Singkat
                        </span>
                        <span className="text-xs font-black text-sky-900">
                          {totalScoreIsian} Poin
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Jumlah Butir</label>
                          <input
                            type="number"
                            min={0}
                            max={30}
                            value={config.jumlahIsian}
                            onChange={(e) => setConfig({ ...config, jumlahIsian: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-1.5 font-black text-sky-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Bobot / Butir</label>
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={config.bobotIsian}
                            onChange={(e) => setConfig({ ...config, bobotIsian: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className="w-full bg-white border border-sky-300 rounded-xl px-3 py-1.5 font-black text-sky-900 focus:outline-none"
                          />
                        </div>

                        <div className="p-2 bg-white/90 rounded-xl text-[10px] text-slate-500 leading-snug border border-sky-100">
                          Jawaban singkat kata kunci atau istilah tepat.
                        </div>
                      </div>
                    </div>

                    {/* ESAI / URAIAN */}
                    <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg text-[11px] font-black uppercase bg-purple-600 text-white truncate">
                          4. Uraian / Esai
                        </span>
                        <span className="text-xs font-black text-purple-900">
                          {totalScoreEsai} Poin
                        </span>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Jumlah Butir</label>
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={config.jumlahEsai}
                            onChange={(e) => setConfig({ ...config, jumlahEsai: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-1.5 font-black text-purple-900 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Bobot / Butir</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={config.bobotEsai}
                            onChange={(e) => setConfig({ ...config, bobotEsai: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                            className="w-full bg-white border border-purple-300 rounded-xl px-3 py-1.5 font-black text-purple-900 focus:outline-none"
                          />
                        </div>

                        <div className="p-2 bg-white/90 rounded-xl text-[10px] text-slate-500 leading-snug border border-purple-100">
                          Pertanyaan bernalar tinggi (HOTS & elaborasi).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS REKAP SKOR */}
                  <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                    grandTotalScore === 100 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider block">
                        Status Akumulasi Nilai:
                      </span>
                      <p className="text-xs opacity-90 mt-0.5">
                        {grandTotalScore === 100 
                          ? 'Sempurna! Total nilai tepat 100 Poin.' 
                          : `Total nilai saat ini ${grandTotalScore} Poin (Belum 100). Silakan sesuaikan atau klik tombol otomatis.`}
                      </p>
                    </div>
                    <span className="text-2xl font-black">{grandTotalScore} / 100</span>
                  </div>
                </div>
              )}

              {/* CONTENT 4: STIMULUS (SOAL TUNGGAL VS SOAL GRUP) */}
              {activeModal === 'stimulus' && (
                <div className="space-y-5">
                  {/* PILIHAN MODE STIMULUS */}
                  <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 space-y-3">
                    <span className="text-xs font-black text-amber-950 block">
                      1. Pilih Mode Penerapan Stimulus (Kaidah Soal):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div 
                        onClick={() => setConfig({ ...config, modeStimulus: 'grup' })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                          config.modeStimulus === 'grup' 
                            ? 'bg-white border-amber-600 shadow-xs ring-2 ring-amber-500/20' 
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="modeStimulus" 
                          checked={config.modeStimulus === 'grup'} 
                          onChange={() => setConfig({ ...config, modeStimulus: 'grup' })}
                          className="mt-0.5 text-amber-600"
                        />
                        <div className="space-y-1">
                          <span className="font-black text-slate-800 block text-xs">
                            II. Soal Grup (1 Stimulus → Beberapa Soal Terkait)
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Standar ujian bahasa & literasi. 1 teks fabel/cerita/tabel diletakkan di butir pembuka untuk menjawab beberapa butir soal (misal no 1–4). Hemat halaman & fokus literasi.
                          </p>
                        </div>
                      </div>

                      <div 
                        onClick={() => setConfig({ ...config, modeStimulus: 'tunggal' })}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                          config.modeStimulus === 'tunggal' 
                            ? 'bg-white border-amber-600 shadow-xs ring-2 ring-amber-500/20' 
                            : 'bg-white/60 border-slate-200 hover:bg-white'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="modeStimulus" 
                          checked={config.modeStimulus === 'tunggal'} 
                          onChange={() => setConfig({ ...config, modeStimulus: 'tunggal' })}
                          className="mt-0.5 text-amber-600"
                        />
                        <div className="space-y-1">
                          <span className="font-black text-slate-800 block text-xs">
                            I. Soal Tunggal (1 Stimulus → 1 Butir Soal)
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            Setiap butir soal memiliki stimulus atau pertanyaan independen tersendiri yang tidak terkait langsung dengan butir lainnya.
                          </p>
                        </div>
                      </div>
                    </div>

                    {config.modeStimulus === 'grup' && (
                      <div className="pt-2 flex items-center gap-3 text-xs">
                        <label className="font-bold text-slate-700">Jumlah Soal per Grup Stimulus:</label>
                        <input
                          type="number"
                          min={2}
                          max={6}
                          value={config.grupQuestionCount || 4}
                          onChange={(e) => setConfig({ ...config, grupQuestionCount: Math.max(2, parseInt(e.target.value, 10) || 4) })}
                          className="w-20 bg-white border border-amber-300 rounded-lg px-2.5 py-1 font-black text-amber-900 focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-500">(Contoh: 1 teks untuk nomor 1 s.d. 4)</span>
                      </div>
                    )}
                  </div>

                  {/* JENIS MEDIA STIMULUS */}
                  <div className="space-y-2">
                    <span className="text-xs font-black text-slate-700 block">
                      2. Pilih Unsur Media Stimulus:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { id: 'cerita', label: 'Teks Cerita / Narasi', icon: AlignLeft, desc: 'Fabel, kisah moral, artikel' },
                        { id: 'tabel', label: 'Tabel Data', icon: FileSpreadsheet, desc: 'Rekap kegiatan, angka' },
                        { id: 'gambar', label: 'Gambar / Diagram', icon: ImageIcon, desc: 'Ilustrasi, bagan alur' },
                        { id: 'gabungan', label: 'Gabungan', icon: Layers, desc: 'Cerita + Tabel Data' },
                        { id: 'none', label: 'Tanpa Stimulus', icon: HelpCircle, desc: 'Konsep langsung' },
                      ].map((item) => {
                        const IconC = item.icon;
                        const isSelected = config.stimulusType === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setConfig({ ...config, stimulusType: item.id as StimulusType })}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 ${
                              isSelected
                                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <IconC size={18} className={isSelected ? 'text-white' : 'text-amber-600'} />
                              {isSelected && <Check size={14} className="text-white" />}
                            </div>
                            <div>
                              <span className="text-xs font-black block leading-tight">{item.label}</span>
                              <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                                {item.desc}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* JAMINAN 100% SELURUH SOAL BERSTIMULUS */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-black text-emerald-950 block">
                            Jaminan Seluruh Soal Berstimulus (AKM & Kurikulum Merdeka)
                          </span>
                          <span className="text-[11px] text-emerald-800">
                            Memastikan tidak ada butir soal kosong tanpa konteks bacaan, gambar vektor, tabel, atau lafadz dalil.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoEnrichAllStimuli}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
                      >
                        <Sparkles size={13} />
                        <span>Sematkan ke Semua Soal</span>
                      </button>
                    </div>
                  </div>

                  {config.stimulusType !== 'none' && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs mt-3">
                      <div>
                        <label className="block text-slate-700 font-bold mb-1">Judul / Pengantar Stimulus</label>
                        <input
                          type="text"
                          value={config.stimulusTitle}
                          onChange={(e) => setConfig({ ...config, stimulusTitle: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-800 focus:outline-none"
                        />
                      </div>
                      {(config.stimulusType === 'cerita' || config.stimulusType === 'gabungan') && (
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Isi Teks Cerita / Narasi</label>
                          <textarea
                            rows={4}
                            value={config.stimulusText}
                            onChange={(e) => setConfig({ ...config, stimulusText: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-medium leading-relaxed focus:outline-none"
                          />
                        </div>
                      )}
                      {(config.stimulusType === 'tabel' || config.stimulusType === 'gabungan') && (
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">Data Tabel (Format Kolom | Kolom)</label>
                          <textarea
                            rows={3}
                            value={config.stimulusTable}
                            onChange={(e) => setConfig({ ...config, stimulusTable: e.target.value })}
                            placeholder="Nama Barang | Harga Satuan&#10;Buku Tulis | Rp4.000,00"
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-800 font-mono text-[11px] focus:outline-none"
                          />
                          {config.stimulusTable && (
                            <div className="mt-2">
                              <span className="text-[11px] font-bold text-slate-600 mb-1 block">Pratinjau Tabel Rapi:</span>
                              <StimulusTableRenderer tableText={config.stimulusTable} compact={true} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CONTENT 5: KAIDAH PENULISAN SOAL TERSTANDAR */}
              {activeModal === 'kaidah' && (
                <div className="space-y-6 text-xs text-slate-800 leading-relaxed">
                  {/* BANNER UTAMA */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4 rounded-2xl text-white space-y-1">
                    <h4 className="text-base font-black flex items-center gap-2">
                      <BookOpen size={20} className="text-amber-200" />
                      <span>TIGA HAL PENTING WAJIB DIKUASAI PENULIS SOAL</span>
                    </h4>
                    <p className="text-xs text-amber-100">
                      Standar resmi penulisan asesmen: 1. Jenis Soal • 2. Kaidah Penulisan Soal Terstandar • 3. Bentuk Soal
                    </p>
                  </div>

                  {/* PILLAR 1: JENIS SOAL */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 font-black text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">1</span>
                      <span>JENIS SOAL (STIMULUS)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 font-black text-[11px] uppercase">
                          I. Soal Tunggal
                        </span>
                        <p className="text-slate-600">
                          <b>1 Stimulus → 1 Butir Soal.</b> Setiap butir soal berdiri sendiri dan langsung menanyakan pokok bahasan.
                        </p>
                        <div className="p-2 bg-slate-50 rounded-lg text-[11px] italic text-slate-500 border border-slate-100">
                          Contoh: Sebuah puisi pendek hanya memiliki 1 pertanyaan mengenai judul yang tepat.
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-black text-[11px] uppercase">
                          II. Soal Grup (Literasi / Bahasa)
                        </span>
                        <p className="text-slate-600">
                          <b>1 Stimulus → Beberapa Butir Soal Terkait.</b> Biasa ditemukan dalam mata pelajaran bahasa, fabel moral, atau bacaan literasi (misal: 1 cerita fabel untuk butir no 1 s.d. 4).
                        </p>
                        <div className="p-2 bg-slate-50 rounded-lg text-[11px] italic text-slate-500 border border-slate-100">
                          Keunggulan: Menghemat halaman cetak, menguji pemahaman membaca mendalam (tokoh, watak, amanat, konflik).
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PILLAR 2: KAIDAH PENULISAN SOAL TERSTANDAR */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 font-black text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">2</span>
                      <span>KAIDAH PENULISAN SOAL TES TERSTANDAR</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* A. Substansi Materi */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-indigo-900 block border-b pb-1">
                          A. Substansi Materi
                        </span>
                        <ul className="space-y-1 text-slate-600 text-[11px] list-disc pl-4">
                          <li>Sesuai indikator kisi-kisi dan CP/TP</li>
                          <li>Materi logis, ilmiah, & mutakhir</li>
                          <li>Tidak menimbulkan multitafsir</li>
                          <li>Bebas unsur SARA dan politik praktis</li>
                          <li>Tidak mempromosikan merek dagang tertentu</li>
                          <li>Bebas dari kekerasan dan pornografi</li>
                        </ul>
                      </div>

                      {/* B. Konstruksi */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-teal-900 block border-b pb-1">
                          B. Konstruksi Soal
                        </span>
                        <ul className="space-y-1 text-slate-600 text-[11px] list-disc pl-4">
                          <li>Pokok soal (stem) dirumuskan tegas dan jelas</li>
                          <li>Relevan secara substansi dengan materi pokok</li>
                          <li>Jawaban tidak bergantung pada soal nomor sebelumnya</li>
                          <li>Tidak memberikan petunjuk kunci pada butir soal lain</li>
                          <li>Gambar, tabel, diagram jelas & fungsional</li>
                          <li>Menghindari pernyataan bernada negatif ganda</li>
                        </ul>
                      </div>

                      {/* C. Bahasa */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-amber-900 block border-b pb-1">
                          C. Kaidah Bahasa
                        </span>
                        <ul className="space-y-1 text-slate-600 text-[11px] list-disc pl-4">
                          <li>Menggunakan Bahasa Indonesia baku (EYD / PUEBI)</li>
                          <li>Kalimat lugas, efektif, dan komunikatif bagi siswa</li>
                          <li>Tidak menggunakan bahasa daerah/setempat yang tabu</li>
                          <li>Pilihan jawaban homogen dan logis</li>
                          <li>Panjang kalimat opsi jawaban relatif seimbang</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* PILLAR 3: BENTUK SOAL */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200 font-black text-slate-900 text-sm">
                      <span className="w-6 h-6 rounded-lg bg-amber-600 text-white flex items-center justify-center text-xs">3</span>
                      <span>BENTUK SOAL (KLASIFIKASI & KAIDAH KHUSUS)</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-emerald-800 block">
                          1. Pilihan Ganda Tunggal (Satu Pilihan Jawaban Benar)
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          <b>Kaidah:</b> Opsi homogen dan logis, hanya ada 1 jawaban benar mutlak, panjang opsi relatif seimbang, angka/urutan kronologis berurutan, opsi A/B/C/D tidak saling bertentangan.
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-teal-800 block">
                          2. Pilihan Ganda Kompleks MCMA (Multiple Choices Multiple Answers)
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          <b>Kaidah:</b> Disajikan daftar pernyataan (1, 2, 3, 4). Opsi jawaban berupa kombinasi benar (misal: A. 1 dan 2, B. 2 dan 4). Pilihan yang benar lebih dari satu namun tidak semua benar.
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-sky-800 block">
                          3. Isian Singkat
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          <b>Kaidah:</b> Soal menguji konsep inti, nama, istilah ilmiah, rumus, atau fakta spesifik yang memerlukan jawaban singkat dan pasti tanpa interpretasi ganda.
                        </p>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                        <span className="font-black text-xs text-purple-800 block">
                          4. Uraian / Esai (Penalaran Mendalam / HOTS)
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          <b>Kaidah:</b> Menguji kemampuan menganalisis, mengevaluasi, atau mencipta solusi. Dilengkapi rubrik penskoran terperinci per langkah jawaban.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTENT 6: PENGATURAN JENIS HURUF, UKURAN HURUF, UKURAN KERTAS & TATA LETAK */}
              {activeModal === 'tataLetak' && (
                <div className="space-y-6 text-xs text-slate-800">
                  {/* BANNER RINGKASAN */}
                  <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-4 rounded-2xl text-white flex flex-wrap items-center justify-between gap-3 shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal size={18} className="text-amber-300" />
                        <h4 className="text-sm font-black uppercase tracking-wide">
                          Tata Letak & Tipografi Naskah Ujian
                        </h4>
                      </div>
                      <p className="text-xs text-indigo-100">
                        Perubahan otomatis diterapkan secara langsung ke <b>Pratinjau Layar</b>, hasil <b>Cetak Browser</b>, dan ekspor <b>Microsoft Word (.doc)</b>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-white border border-white/25">
                        Kertas: {PAPER_DIMENSIONS[paperLayout.paperSize].name}
                      </span>
                      <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-white border border-white/25">
                        Font: {paperLayout.fontFamily} {paperLayout.fontSizePt}pt
                      </span>
                    </div>
                  </div>

                  {/* 1. JENIS HURUF (FONT FAMILY) */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                        <Type size={15} className="text-indigo-600" />
                        <span>1. Jenis Huruf (Font Family)</span>
                      </span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        Terpilih: {paperLayout.fontFamily}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {FONT_FAMILY_OPTIONS.map((font) => {
                        const isSelected = paperLayout.fontFamily === font.value;
                        return (
                          <div
                            key={font.value}
                            onClick={() => setPaperLayout(prev => ({ ...prev, fontFamily: font.value }))}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-2 ring-indigo-200'
                                : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs text-slate-900" style={{ fontFamily: font.value }}>
                                  {font.label}
                                </span>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                  font.generic === 'serif' ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                                }`}>
                                  {font.generic}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {font.desc}
                              </p>
                            </div>

                            <div 
                              className="mt-2 pt-2 border-t border-slate-100 text-slate-800 text-xs truncate"
                              style={{ fontFamily: font.value }}
                            >
                              Aa Bb Gg 123 (Contoh Pratinjau Teks)
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. UKURAN HURUF & SPASI BARIS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* UKURAN HURUF (FONT SIZE) */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                          <Sliders size={15} className="text-blue-600" />
                          <span>2. Ukuran Huruf (Font Size)</span>
                        </span>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                          {paperLayout.fontSizePt} pt
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {FONT_SIZE_OPTIONS.map((sz) => {
                          const isSelected = paperLayout.fontSizePt === sz.value;
                          return (
                            <button
                              key={sz.value}
                              type="button"
                              onClick={() => setPaperLayout(prev => ({ ...prev, fontSizePt: sz.value }))}
                              className={`p-2.5 rounded-xl text-center border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-300 font-black'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50 font-bold'
                              }`}
                            >
                              <span className="block text-sm">{sz.label}</span>
                              <span className={`block text-[9px] mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                {sz.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                        <Info size={13} className="text-blue-500 shrink-0" />
                        <span>Rekomendasi: <b>11 pt</b> untuk ujian resmi standar, <b>10 pt / 9.5 pt</b> untuk hemat lembar fotokopi.</span>
                      </div>
                    </div>

                    {/* SPASI BARIS & JARAK ANTAR SOAL */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                          <MoveHorizontal size={15} className="text-teal-600" />
                          <span>3. Spasi & Kerapatan Soal</span>
                        </span>
                        <span className="text-xs font-black text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                          Spasi: {paperLayout.lineHeight}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                            Spasi Baris (Line Height):
                          </label>
                          <div className="grid grid-cols-4 gap-1.5">
                            {[
                              { val: 1.15, label: '1.15', desc: 'Rapat' },
                              { val: 1.25, label: '1.25', desc: 'Efisien' },
                              { val: 1.30, label: '1.30', desc: 'Standar' },
                              { val: 1.50, label: '1.50', desc: 'Lega' },
                            ].map((sp) => (
                              <button
                                key={sp.val}
                                type="button"
                                onClick={() => setPaperLayout(prev => ({ ...prev, lineHeight: sp.val }))}
                                className={`py-1.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                                  paperLayout.lineHeight === sp.val
                                    ? 'bg-teal-600 text-white border-teal-600 font-black shadow-xs ring-2 ring-teal-200'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                                }`}
                              >
                                <span className="block text-xs font-black">{sp.label}</span>
                                <span className={`block text-[9px] ${paperLayout.lineHeight === sp.val ? 'text-teal-100' : 'text-slate-400'}`}>
                                  {sp.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                            Jarak Margin Antar Butir Soal:
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { val: 'compact', label: 'Rapat (6pt)', desc: 'Hemat ruang' },
                              { val: 'normal', label: 'Normal (11pt)', desc: 'Standar ujian' },
                              { val: 'spacious', label: 'Longgar (16pt)', desc: 'Ekstra lega' },
                            ].map((gap) => (
                              <button
                                key={gap.val}
                                type="button"
                                onClick={() => setPaperLayout(prev => ({ ...prev, questionSpacing: gap.val as any }))}
                                className={`py-1.5 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                                  paperLayout.questionSpacing === gap.val
                                    ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                                }`}
                              >
                                <span className="block text-xs font-bold">{gap.label}</span>
                                <span className={`block text-[9px] ${paperLayout.questionSpacing === gap.val ? 'text-slate-300' : 'text-slate-400'}`}>
                                  {gap.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. UKURAN KERTAS (PAPER SIZE) */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                        <FileText size={15} className="text-emerald-600" />
                        <span>4. Ukuran Kertas (Paper Size)</span>
                      </span>
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {PAPER_DIMENSIONS[paperLayout.paperSize].name} ({PAPER_DIMENSIONS[paperLayout.paperSize].widthCm} × {PAPER_DIMENSIONS[paperLayout.paperSize].heightCm} cm)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {(Object.keys(PAPER_DIMENSIONS) as ExamPaperSize[]).map((pKey) => {
                        const pDim = PAPER_DIMENSIONS[pKey];
                        const isSelected = paperLayout.paperSize === pKey;
                        const isF4 = pKey === 'F4';

                        return (
                          <div
                            key={pKey}
                            onClick={() => setPaperLayout(prev => ({ ...prev, paperSize: pKey }))}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-300'
                                : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                            }`}
                          >
                            {isF4 && (
                              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                                Standar Sekolah
                              </div>
                            )}

                            <div className="space-y-1">
                              <span className="font-black text-sm text-slate-900 block">
                                {pDim.name}
                              </span>
                              <span className="text-[11px] font-bold text-emerald-800 block">
                                {pDim.widthCm} × {pDim.heightCm} cm
                              </span>
                              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                                {pDim.desc}
                              </p>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-[10px] font-bold">
                              <span className={isSelected ? 'text-emerald-700' : 'text-slate-400'}>
                                {isSelected ? '✓ Sedang Digunakan' : 'Klik untuk Pilih'}
                              </span>
                              <div className="w-5 h-7 border border-slate-400 rounded-xs flex items-center justify-center text-[8px] text-slate-400">
                                {pKey}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. MARGIN HALAMAN & TATA LETAK KOLOM */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* MARGIN HALAMAN */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                          <SlidersHorizontal size={15} className="text-purple-600" />
                          <span>5. Margin Kertas (Batas Tepi)</span>
                        </span>
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                          {MARGIN_PRESETS[paperLayout.marginPreset]?.label || 'Kustom'}
                        </span>
                      </div>

                      {/* Preset Margin Buttons */}
                      <div className="grid grid-cols-3 gap-2">
                        {(['narrow', 'normal', 'standard_word'] as ExamMarginPreset[]).map((pr) => {
                          const conf = MARGIN_PRESETS[pr];
                          const isSel = paperLayout.marginPreset === pr;
                          return (
                            <button
                              key={pr}
                              type="button"
                              onClick={() => handleApplyMarginPreset(pr)}
                              className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                                isSel
                                  ? 'bg-purple-600 text-white border-purple-600 font-black shadow-xs ring-2 ring-purple-200'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                              }`}
                            >
                              <span className="block text-xs font-bold leading-tight">{conf.label.split(' / ')[0]}</span>
                              <span className={`block text-[9px] mt-0.5 ${isSel ? 'text-purple-100' : 'text-slate-400'}`}>
                                {conf.top} cm
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom inputs */}
                      <div className="pt-2 border-t border-slate-200">
                        <span className="block text-[11px] font-bold text-slate-700 mb-2">
                          Sesuaikan Nilai Margin Manual (cm):
                        </span>
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">Atas</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0.5"
                              max="5"
                              value={paperLayout.marginTopCm}
                              onChange={(e) => setPaperLayout(prev => ({
                                ...prev,
                                marginPreset: 'custom',
                                marginTopCm: parseFloat(e.target.value) || 1.5
                              }))}
                              className="w-full text-center bg-white border border-slate-300 rounded-lg py-1 font-bold text-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">Bawah</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0.5"
                              max="5"
                              value={paperLayout.marginBottomCm}
                              onChange={(e) => setPaperLayout(prev => ({
                                ...prev,
                                marginPreset: 'custom',
                                marginBottomCm: parseFloat(e.target.value) || 1.5
                              }))}
                              className="w-full text-center bg-white border border-slate-300 rounded-lg py-1 font-bold text-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">Kiri</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0.5"
                              max="5"
                              value={paperLayout.marginLeftCm}
                              onChange={(e) => setPaperLayout(prev => ({
                                ...prev,
                                marginPreset: 'custom',
                                marginLeftCm: parseFloat(e.target.value) || 1.5
                              }))}
                              className="w-full text-center bg-white border border-slate-300 rounded-lg py-1 font-bold text-slate-800"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 font-bold block mb-1">Kanan</span>
                            <input
                              type="number"
                              step="0.1"
                              min="0.5"
                              max="5"
                              value={paperLayout.marginRightCm}
                              onChange={(e) => setPaperLayout(prev => ({
                                ...prev,
                                marginPreset: 'custom',
                                marginRightCm: parseFloat(e.target.value) || 1.5
                              }))}
                              className="w-full text-center bg-white border border-slate-300 rounded-lg py-1 font-bold text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FORMAT KOLOM & TITIK-TITIK JAWABAN */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="text-xs font-black uppercase text-slate-900 flex items-center gap-2">
                          <Columns size={15} className="text-amber-600" />
                          <span>6. Tata Letak Kolom & Opsi Lembar</span>
                        </span>
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200">
                          {paperLayout.columnsCount === 1 ? '1 Kolom' : '2 Kolom (Hemat)'}
                        </span>
                      </div>

                      {/* 1 Kolom vs 2 Kolom */}
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-bold text-slate-700">
                          Format Kolom Alur Butir Soal:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaperLayout(prev => ({ ...prev, columnsCount: 1 }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paperLayout.columnsCount === 1
                                ? 'bg-amber-500 text-white border-amber-600 font-black shadow-xs ring-2 ring-amber-300'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <span className="block text-xs font-black">1 Kolom (Standar)</span>
                            <span className={`block text-[10px] mt-0.5 ${paperLayout.columnsCount === 1 ? 'text-amber-100' : 'text-slate-400'}`}>
                              Butir soal mengalir ke bawah full lebar halaman
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaperLayout(prev => ({ ...prev, columnsCount: 2 }))}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              paperLayout.columnsCount === 2
                                ? 'bg-amber-600 text-white border-amber-600 font-black shadow-xs ring-2 ring-amber-300'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <span className="block text-xs font-black">⚡ 2 Kolom (Model Koran)</span>
                            <span className={`block text-[10px] mt-0.5 ${paperLayout.columnsCount === 2 ? 'text-amber-100' : 'text-slate-400'}`}>
                              Hemat kertas hingga 40%, sangat cocok untuk PG!
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Checkbox Titik-Titik Jawaban */}
                      <div className="pt-2 border-t border-slate-200">
                        <label className="flex items-start gap-2.5 cursor-pointer bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300">
                          <input
                            type="checkbox"
                            checked={paperLayout.showAnswerDottedLines}
                            onChange={(e) => setPaperLayout(prev => ({ ...prev, showAnswerDottedLines: e.target.checked }))}
                            className="mt-0.5 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                          />
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-800 block">
                              Sediakan Garis Titik-Titik Jawaban pada Soal Isian & Uraian
                            </span>
                            <span className="text-[10px] text-slate-500 block leading-snug">
                              Nonaktifkan opsi ini bila siswa menggunakan Lembar Jawaban Komputer (LJK) atau lembar folio bergaris terpisah untuk menghemat ruang kertas.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* TOMBOL RESET KE FORMAT STANDAR RESMI */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-100/80 rounded-2xl border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Info size={15} className="text-slate-500" />
                      <span>Format default madrasah: <b>F4 (Folio), Times New Roman 11pt, Margin Sempit 1.5 cm, 1 Kolom</b>.</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPaperLayout(DEFAULT_PAPER_LAYOUT)}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-bold transition shadow-2xs cursor-pointer"
                    >
                      Reset ke Standar Madrasah
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* MODAL FOOTER */}
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/80">
              <span className="text-xs text-slate-400 font-medium">
                Pengaturan otomatis tersimpan secara lokal.
              </span>

              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs"
              >
                Selesai & Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: DAFTAR BUTIR SOAL */}
      {/* ========================================================================= */}
      {activeView === 'questions' && (
        <div className="space-y-6">
          {/* BANNER PENJAMIN MUTU STIMULUS, GAMBAR VEKTOR & LAFADZ ARAB */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md space-y-3 screen-only">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-black text-[10px] tracking-wider uppercase border border-emerald-400/30">
                    Kurikulum Merdeka & AKM Standar
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-400/20 text-rose-300 font-bold text-[10px] border border-rose-400/30 flex items-center gap-1">
                    <Heart size={11} className="fill-rose-400 text-rose-400" />
                    <span>Kurikulum Berbasis Cinta (KBC Kemenag) Aktif Otomatis</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/30">
                    100% Berstimulus & Gambar Jadi
                  </span>
                </div>
                <h3 className="text-base font-black tracking-tight text-white flex items-center gap-2">
                  <span>Penjamin Mutu Stimulus, Gambar Vektor & Teks Arab Siap Pakai</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Seluruh butir soal dirancang siap cetak: rumus matematika rapi tanpa edit lanjutan, gambar/diagram berupa vektor SVG asli (bukan link URL mentah), dan lafadz Arab dengan harakat lengkap serta terjemahan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAutoEnrichAllStimuli}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs transition shadow-sm cursor-pointer"
                  title="Lengkapi seluruh soal yang belum memiliki stimulus secara otomatis"
                >
                  <Sparkles size={14} />
                  <span>Sematkan Stimulus ke Seluruh Soal</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLoadSubjectPreset(config.mataPelajaran)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition border border-white/20 cursor-pointer"
                  title="Muat paket butir soal lengkap siap cetak untuk mata pelajaran ini"
                >
                  <RefreshCw size={13} />
                  <span>Muat Paket Soal Jadi ({config.mataPelajaran})</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/10 text-xs">
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Gambar & Diagram Asli</span>
                  <span className="text-[11px] text-slate-300">Vektor SVG tajam, tercetak langsung di web & dokumen Word tanpa link rusak.</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Matematika & Geometri Siap Pakai</span>
                  <span className="text-[11px] text-slate-300">Pecahan bertumpuk, bangun datar & ruang, diagram batang, sudut & jam siap cetak.</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Lafadz Arab Berharakat Lengkap</span>
                  <span className="text-[11px] text-slate-300">Fiqih, Akidah, Qurdis, SKI & B. Arab dengan tipografi RTL dan terjemahan Indonesia.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Bentuk:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'all', label: `Semua (${questions.length})` },
                  { id: 'pg', label: `PG Tunggal (${actualPgCount})` },
                  { id: 'pg_kompleks', label: `PG Kompleks (${actualPgKompleksCount})` },
                  { id: 'isian', label: `Isian (${actualIsianCount})` },
                  { id: 'esai', label: `Esai (${actualEsaiCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTypeFilter(f.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      typeFilter === f.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleInterleaveStimuli}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-black transition cursor-pointer shadow-2xs"
                title="Sebar & acak variasi stimulus (gambar, tabel, cerita) selang-seling agar tidak berurutan berjejer"
              >
                <Shuffle size={13} className="text-indigo-600" />
                <span>Sebar Stimulus</span>
              </button>
              <button
                onClick={() => handleAddQuestion('pg')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus size={14} />
                <span>+ PG</span>
              </button>
              <button
                onClick={() => handleAddQuestion('pg_kompleks')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus size={14} />
                <span>+ PG-K</span>
              </button>
              <button
                onClick={() => handleAddQuestion('isian')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Isian</span>
              </button>
              <button
                onClick={() => handleAddQuestion('esai')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <Plus size={14} />
                <span>+ Esai</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isEditing = editingQuestionId === q.id;
              const parentCP = config.cpList.find(c => c.id === q.cpId) || config.cpList[0];
              const hasStimulus = q.stimulusType !== 'none' || !!q.stimulusSvg || !!q.arabicText || !!q.stimulusImageUrl || !!q.stimulusText;

              return (
                <div 
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 transition hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {q.number}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        q.type === 'pg' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : q.type === 'pg_kompleks'
                          ? 'bg-teal-100 text-teal-800'
                          : q.type === 'isian' 
                          ? 'bg-sky-100 text-sky-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {q.type === 'pg' ? 'PG Tunggal' : q.type === 'pg_kompleks' ? 'PG Kompleks (MCMA)' : q.type === 'isian' ? 'Isian Singkat' : 'Uraian / Esai'}
                      </span>
                      
                      {/* INDIKATOR SOAL GRUP */}
                      {q.groupId && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">
                          Grup Stimulus
                        </span>
                      )}

                      {/* INDIKATOR INDUK CP & TP */}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">
                        {q.cpCode || parentCP?.code || 'CP 1'} {q.tpCode ? `• ${q.tpCode}` : ''}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        Level: {q.cognitiveLevel}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                        Bobot: {q.score} Poin
                      </span>
                      
                      {/* INDIKATOR PILAR KBC (KURIKULUM BERBASIS CINTA KEMENAG) */}
                      {(() => {
                        const pInfo = q.kbcPillar 
                          ? { pillar: q.kbcPillar as KbcPillarType, description: q.kbcDescription || '' } 
                          : detectKbcPillar(q.questionText, q.materiPokok, q.stimulusText, config.mataPelajaran);
                        const pMeta = KBC_PILLARS[pInfo.pillar] || KBC_PILLARS['Cinta Allah'];
                        return (
                          <span 
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black border flex items-center gap-1 ${pMeta.badgeBg} ${pMeta.badgeText} ${pMeta.borderColor}`}
                            title={`KBC Kemenag: ${pMeta.title} (${pMeta.arabicConcept}) - ${pInfo.description || pMeta.description}`}
                          >
                            <span>{pMeta.iconSymbol}</span>
                            <span>KBC: {pMeta.title}</span>
                          </span>
                        );
                      })()}
                      
                      {q.arabicText && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                          Lafadz Arab
                        </span>
                      )}
                      {(q.stimulusSvg || q.stimulusImageUrl) && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                          Gambar / Diagram
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                          isEditing ? 'bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Edit3 size={13} />
                        <span>{isEditing ? 'Selesai' : 'Edit'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="Hapus butir soal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* STIMULUS PREVIEW (TANPA KOTAK) */}
                  {hasStimulus && (
                    <div className="py-2.5 text-xs text-slate-800 space-y-2 border-b border-slate-100">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <AlignLeft size={14} className="text-slate-500" />
                          <span>{q.stimulusTitle || 'Stimulus Butir Soal:'}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {q.stimulusType || 'cerita'}
                        </span>
                      </div>

                      {/* ARABIC TEXT CALLOUT (TANPA KOTAK) */}
                      {q.arabicText && (
                        <div className="my-1.5 space-y-1">
                          <p 
                            dir="rtl" 
                            className="text-right text-slate-900 font-serif font-bold text-lg leading-loose"
                            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                          >
                            {q.arabicText}
                          </p>
                          {q.arabicTranslation && (
                            <p className="text-[11px] text-slate-600 italic font-sans">
                              Artinya: &ldquo;{q.arabicTranslation}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {/* RENDERED VISUAL GRAPHIC / SVG DIAGRAM (TANPA KOTAK) */}
                      {(q.stimulusSvg || q.stimulusImageUrl) && (
                        <div className="my-2 flex justify-center">
                          <StimulusGraphicRenderer 
                            graphicKey={q.stimulusSvg} 
                            imageUrl={q.stimulusImageUrl} 
                            caption={q.stimulusTitle}
                            maxHeight="160px"
                          />
                        </div>
                      )}

                      {q.stimulusText && (
                        <p className="italic text-slate-700 leading-relaxed whitespace-pre-line">
                          {q.stimulusText}
                        </p>
                      )}

                      {q.stimulusTable && (
                        <StimulusTableRenderer 
                          tableText={q.stimulusTable} 
                        />
                      )}
                    </div>
                  )}

                  {/* PERTANYAAN & OPSI */}
                  {isEditing ? (
                    <div className="space-y-4">
                      {/* Dropdown Pemetaan CP & TP */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Induk Capaian Pembelajaran (CP)
                          </label>
                          <select
                            value={q.cpId || parentCP?.id}
                            onChange={(e) => handleLinkQuestionToCP(q.id, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-bold text-slate-800 text-xs"
                          >
                            {(config.cpList || []).map(c => (
                              <option key={c.id} value={c.id}>
                                {c.code}: {c.elemen} - {c.materiPokok}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-bold mb-1">
                            Tujuan Pembelajaran (TP)
                          </label>
                          <select
                            value={q.tpId || ''}
                            onChange={(e) => handleLinkQuestionToTP(q.id, e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-bold text-slate-800 text-xs"
                          >
                            {(parentCP?.tpList || []).map(t => (
                              <option key={t.id} value={t.id}>
                                {t.code}: {t.text.slice(0, 50)}...
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* TOOLBAR NOTASI CEPAT MATEMATIKA */}
                      <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                            ⚡ Notasi Cepat Matematika & Simbol (Klik untuk Sisipkan):
                          </span>
                          <span className="text-[10px] text-slate-400">Pecahan & Notasi Otomatis Siap Cetak</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {[
                            { label: '½', val: ' 1/2 ' },
                            { label: '⅓', val: ' 1/3 ' },
                            { label: '¼', val: ' 1/4 ' },
                            { label: '¾', val: ' 3/4 ' },
                            { label: '⅖', val: ' 2/5 ' },
                            { label: 'x²', val: 'x²' },
                            { label: 'cm²', val: 'cm²' },
                            { label: 'cm³', val: 'cm³' },
                            { label: 'm²', val: 'm²' },
                            { label: '√', val: '√' },
                            { label: '°', val: '°' },
                            { label: '∠', val: '∠' },
                            { label: 'π', val: 'π' },
                            { label: '×', val: ' × ' },
                            { label: '÷', val: ' ÷ ' },
                            { label: '±', val: ' ± ' },
                            { label: '≤', val: ' ≤ ' },
                            { label: '≥', val: ' ≥ ' },
                          ].map(sym => (
                            <button
                              key={sym.label}
                              type="button"
                              onClick={() => handleUpdateQuestion(q.id, 'questionText', (q.questionText || '') + sym.val)}
                              className="px-2 py-0.5 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-800 rounded-lg text-xs font-bold border border-slate-300 transition shadow-2xs cursor-pointer"
                              title={`Sisipkan simbol ${sym.label}`}
                            >
                              {sym.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* STIMULUS ATTACHMENT QUICK BUTTONS */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setPickerTargetQuestionId(q.id);
                            setShowArabicSnippetModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <BookOpen size={14} />
                          <span>{q.arabicText ? '✓ Ganti Lafadz Arab' : '+ Sisipkan Teks / Lafadz Arab'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPickerTargetQuestionId(q.id);
                            setShowGraphicModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          <ImageIcon size={14} />
                          <span>{(q.stimulusSvg || q.stimulusImageUrl) ? '✓ Ganti Gambar / Diagram' : '+ Sisipkan Diagram / Gambar Vektor'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (!q.stimulusTable) {
                              handleUpdateQuestion(q.id, 'stimulusTable', 'Kolom 1 | Kolom 2\nData A | Nilai 1\nData B | Nilai 2');
                              handleUpdateQuestion(q.id, 'stimulusType', 'tabel');
                            }
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 ${q.stimulusTable ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'} border rounded-xl text-xs font-bold transition cursor-pointer`}
                        >
                          <Table size={14} />
                          <span>{q.stimulusTable ? '✓ Data Tabel Terpasang' : '+ Sisipkan Data Tabel'}</span>
                        </button>
                      </div>

                      {/* ARABIC TEXT & TRANSLATION INPUTS */}
                      {q.arabicText && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-900">Lafadz Arab Berharakat:</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateQuestion(q.id, 'arabicText', '');
                                handleUpdateQuestion(q.id, 'arabicTranslation', '');
                              }}
                              className="text-[10px] text-red-600 hover:underline cursor-pointer"
                            >
                              Hapus Teks Arab
                            </button>
                          </div>
                          <textarea
                            dir="rtl"
                            rows={2}
                            value={q.arabicText}
                            onChange={(e) => handleUpdateQuestion(q.id, 'arabicText', e.target.value)}
                            placeholder="Tuliskan lafadz arab..."
                            className="w-full bg-white border border-emerald-300 rounded-xl p-2.5 text-base font-serif font-bold text-slate-900 text-right leading-loose focus:outline-none"
                            style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                          />
                          <div>
                            <span className="block text-[11px] font-bold text-emerald-900 mb-1">Terjemahan Indonesia:</span>
                            <input
                              type="text"
                              value={q.arabicTranslation || ''}
                              onChange={(e) => handleUpdateQuestion(q.id, 'arabicTranslation', e.target.value)}
                              placeholder="Arti atau terjemahan lafadz..."
                              className="w-full bg-white border border-emerald-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* DIAGRAM / GRAPHIC PREVIEW & CAPTION INPUT */}
                      {(q.stimulusSvg || q.stimulusImageUrl) && (
                        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-blue-900">Diagram / Gambar Stimulus:</span>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateQuestion(q.id, 'stimulusSvg', '');
                                handleUpdateQuestion(q.id, 'stimulusImageUrl', '');
                              }}
                              className="text-[10px] text-red-600 hover:underline cursor-pointer"
                            >
                              Hapus Gambar
                            </button>
                          </div>
                          <div className="flex justify-center bg-white p-2 rounded-xl border border-blue-200">
                            <StimulusGraphicRenderer 
                              graphicKey={q.stimulusSvg} 
                              imageUrl={q.stimulusImageUrl} 
                              caption={q.stimulusTitle}
                              maxHeight="130px"
                            />
                          </div>
                          <div>
                            <span className="block text-[11px] font-bold text-blue-900 mb-1">Keterangan / Judul Gambar:</span>
                            <input
                              type="text"
                              value={q.stimulusTitle || ''}
                              onChange={(e) => handleUpdateQuestion(q.id, 'stimulusTitle', e.target.value)}
                              placeholder="Contoh: Perhatikan gambar segitiga siku-siku berikut!"
                              className="w-full bg-white border border-blue-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* DATA TABEL INPUT & LIVE PREVIEW */}
                      {Boolean(q.stimulusTable) && (
                        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-900 flex items-center gap-1.5">
                              <Table size={14} />
                              Data Tabel Stimulus (Format Kolom | Kolom):
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                handleUpdateQuestion(q.id, 'stimulusTable', '');
                              }}
                              className="text-[10px] text-red-600 hover:underline cursor-pointer"
                            >
                              Hapus Tabel
                            </button>
                          </div>
                          <textarea
                            rows={4}
                            value={q.stimulusTable}
                            onChange={(e) => handleUpdateQuestion(q.id, 'stimulusTable', e.target.value)}
                            placeholder="Nama Barang | Harga Satuan&#10;Buku Tulis | Rp4.000,00&#10;Pensil 2B | Rp2.500,00"
                            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 font-mono text-xs text-slate-900 focus:outline-none"
                          />
                          <div>
                            <span className="block text-[11px] font-bold text-slate-700 mb-1">Pratinjau Tampilan Tabel Rapi:</span>
                            <StimulusTableRenderer tableText={q.stimulusTable} />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Teks Pertanyaan</label>
                        <textarea
                          rows={2}
                          value={q.questionText}
                          onChange={(e) => handleUpdateQuestion(q.id, 'questionText', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Level Kognitif</label>
                          <select
                            value={q.cognitiveLevel}
                            onChange={(e) => handleUpdateQuestion(q.id, 'cognitiveLevel', e.target.value as CognitiveLevel)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none"
                          >
                            <option value="L1">L1 - Mengingat & Memahami (C1-C2)</option>
                            <option value="L2">L2 - Menerapkan / Aplikasi (C3)</option>
                            <option value="L3">L3 - Menganalisis / HOTS (C4-C6)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Kelas</label>
                          <input
                            type="text"
                            value={q.classLevel || config.tingkatKelas}
                            onChange={(e) => handleUpdateQuestion(q.id, 'classLevel', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Bobot Poin</label>
                          <input
                            type="number"
                            min={1}
                            max={50}
                            value={q.score}
                            onChange={(e) => handleUpdateQuestion(q.id, 'score', parseInt(e.target.value, 10) || 1)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Materi</label>
                          <input
                            type="text"
                            value={q.materiPokok}
                            onChange={(e) => handleUpdateQuestion(q.id, 'materiPokok', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs font-bold text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* EDITING COMPLEX STATEMENTS FOR PG KOMPLEKS */}
                      {q.type === 'pg_kompleks' && q.complexStatements && (
                        <div className="space-y-2 pt-1 p-3 bg-teal-50/50 rounded-xl border border-teal-200">
                          <label className="block text-[11px] font-bold text-teal-900">
                            Daftar Pernyataan (1 s.d. 4):
                          </label>
                          {q.complexStatements.map((st, stIdx) => (
                            <div key={st.id} className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                                {st.id}
                              </span>
                              <input
                                type="text"
                                value={st.text}
                                onChange={(e) => {
                                  const updatedStatements = [...q.complexStatements!];
                                  updatedStatements[stIdx] = { ...st, text: e.target.value };
                                  handleUpdateQuestion(q.id, 'complexStatements', updatedStatements);
                                }}
                                className="flex-1 bg-white border border-teal-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* EDITING OPTIONS FOR PG & PG KOMPLEKS */}
                      {(q.type === 'pg' || q.type === 'pg_kompleks') && q.options && (
                        <div className="space-y-2 pt-1">
                          <label className="block text-[11px] font-bold text-slate-700">
                            Pilihan Jawaban / Kombinasi (Klik huruf untuk menentukan Kunci):
                          </label>
                          {q.options.map((opt, optIdx) => (
                            <div key={opt.label} className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateQuestion(q.id, 'correctAnswer', opt.label)}
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 cursor-pointer ${
                                  q.correctAnswer === opt.label 
                                    ? 'bg-emerald-600 text-white shadow-xs' 
                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                }`}
                              >
                                {opt.label}
                              </button>
                              <input
                                type="text"
                                value={opt.text}
                                onChange={(e) => {
                                  const updatedOptions = [...q.options!];
                                  updatedOptions[optIdx] = { ...opt, text: e.target.value };
                                  handleUpdateQuestion(q.id, 'options', updatedOptions);
                                }}
                                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type !== 'pg' && q.type !== 'pg_kompleks' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Kunci Jawaban Benar</label>
                          <textarea
                            rows={2}
                            value={q.correctAnswer}
                            onChange={(e) => handleUpdateQuestion(q.id, 'correctAnswer', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-medium focus:outline-none"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Indikator Pencapaian Kompetensi (IPK)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Menyebutkan arti dan makna..."
                            value={q.ipk || ''}
                            onChange={(e) => handleUpdateQuestion(q.id, 'ipk', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Indikator Soal (Untuk Matriks Kisi-Kisi)
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Disajikan teks cerita, peserta didik dapat..."
                            value={q.indikatorSoal}
                            onChange={(e) => handleUpdateQuestion(q.id, 'indikatorSoal', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                            <Heart size={12} className="text-rose-500 fill-rose-500" />
                            <span>Pilar Kurikulum Berbasis Cinta (KBC Kemenag)</span>
                          </label>
                          <select
                            value={q.kbcPillar || detectKbcPillar(q.questionText, q.materiPokok, q.stimulusText, config.mataPelajaran).pillar}
                            onChange={(e) => handleUpdateQuestion(q.id, 'kbcPillar', e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold focus:outline-none"
                          >
                            <option value="Cinta Allah">🕌 Cinta Allah SWT (Hablum minallah)</option>
                            <option value="Cinta Rasul">📖 Cinta Rasulullah SAW (Hubburrasul)</option>
                            <option value="Cinta Diri Sendiri">✨ Cinta Diri Sendiri (Hubbunnafs & Integritas)</option>
                            <option value="Cinta Sesama">🤝 Cinta Sesama Manusia (Hubbunnaas & Inklusif)</option>
                            <option value="Cinta Lingkungan">🌱 Cinta Lingkungan & Semesta (Hubbul Bi'ah)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* NOTICE BANNER FOR SOAL GRUP */}
                      {q.groupHeaderNotice && (
                        <div className="mb-2 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
                          <AlignLeft size={14} className="text-amber-600 shrink-0" />
                          <span>{q.groupHeaderNotice}</span>
                        </div>
                      )}

                      <div className="text-xs font-semibold text-slate-800 leading-relaxed">
                        {renderMathFormattedText(q.questionText)}
                      </div>

                      {/* COMPLEX STATEMENTS VIEW (PG-K) */}
                      {q.type === 'pg_kompleks' && q.complexStatements && (
                        <div className="my-2.5 p-3 bg-teal-50/70 rounded-xl border border-teal-200 space-y-1.5 text-xs">
                          <span className="text-[10px] font-black text-teal-900 uppercase tracking-wider block">
                            Daftar Pernyataan:
                          </span>
                          <div className="space-y-1 pl-1">
                            {q.complexStatements.map(st => (
                              <div key={st.id} className="flex items-start gap-2 text-slate-800">
                                <span className="font-black text-teal-800 w-4 shrink-0">{st.id}.</span>
                                <span className="font-medium">{renderMathFormattedText(st.text)}</span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] font-bold text-teal-950 pt-1 border-t border-teal-200/60 mt-2">
                            Dari pernyataan di atas, pilihan jawaban yang paling tepat adalah ....
                          </p>
                        </div>
                      )}

                      {(q.type === 'pg' || q.type === 'pg_kompleks') && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-2">
                          {q.options.map((opt) => (
                            <div 
                              key={opt.label}
                              className={`flex items-start gap-2 p-2 rounded-xl text-xs font-medium border ${
                                q.correctAnswer === opt.label 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' 
                                : 'bg-slate-50 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center font-black text-[11px] shrink-0 ${
                                q.correctAnswer === opt.label ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {opt.label}
                              </span>
                              <span className="leading-snug">{renderMathFormattedText(opt.text)}</span>
                              {q.correctAnswer === opt.label && (
                                <span className="ml-auto text-[10px] font-extrabold text-emerald-700 shrink-0">
                                  (Kunci)
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {q.type !== 'pg' && q.type !== 'pg_kompleks' && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Kunci Jawaban / Pedoman:
                          </span>
                          <p className="font-bold text-slate-800 whitespace-pre-line">
                            {q.correctAnswer || '(Belum diisi)'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: MATRIKS KISI-KISI SOAL (WITH MULTI-CP & TP COLUMNS) */}
      {/* ========================================================================= */}
      {activeView === 'kisikisi' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
            <div>
              <h3 className="text-sm font-black text-slate-800">
                Matriks Kisi-Kisi Penulisan Soal Kurikulum Merdeka (Multi-CP)
              </h3>
              <p className="text-xs text-slate-500">
                Menampilkan Capaian Pembelajaran (CP) dan Tujuan Pembelajaran (TP) yang dipetakan secara akurat ke setiap butir soal.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Printer size={13} />
                <span>Cetak Kisi-Kisi</span>
              </button>
              <button
                onClick={handleDownloadWordKisiKisi}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Download size={13} />
                <span>Unduh Word (.doc)</span>
              </button>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto print:p-0 print:border-none print:shadow-none">
            <div className="text-center mb-6">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                KISI-KISI PENULISAN SOAL ASESMEN SUMATIF / FORMATIF
              </h3>
              <h4 className="text-sm font-bold text-slate-700 uppercase">
                {schoolName}
              </h4>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Mata Pelajaran: <b>{config.mataPelajaran}</b> | Kelas/Fase: <b>{config.tingkatKelas} / {config.fase}</b> | Semester: <b>{config.semester === 1 ? 'Ganjil' : 'Genap'}</b> | TP: <b>{config.tahunPelajaran}</b>
              </p>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-extrabold text-center">
                  <th className="border border-slate-300 p-2 w-10">No</th>
                  <th className="border border-slate-300 p-2 text-left min-w-[170px]">Tujuan Pembelajaran</th>
                  <th className="border border-slate-300 p-2 w-16">Kelas</th>
                  <th className="border border-slate-300 p-2 text-left min-w-[110px]">Materi</th>
                  <th className="border border-slate-300 p-2 text-left min-w-[160px]">Indikator Pencapaian Kompetensi (IPK)</th>
                  <th className="border border-slate-300 p-2 text-left min-w-[160px]">Indikator Soal</th>
                  <th className="border border-slate-300 p-2 w-14">Level Kognitif</th>
                  <th className="border border-slate-300 p-2 w-20">Bentuk Soal</th>
                  <th className="border border-slate-300 p-2 w-12">Nomor Soal</th>
                  <th className="border border-slate-300 p-2 w-16">Kunci Jawaban</th>
                  <th className="border border-slate-300 p-2 w-12">Skor</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, idx) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 text-slate-700 leading-relaxed text-[11px]">
                      {q.tpCode && <span className="font-bold text-purple-800 block">{q.tpCode}</span>}
                      {q.tujuanPembelajaran || q.capaianPembelajaran || '-'}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-slate-700 text-[11px]">
                      {q.classLevel || config.tingkatKelas}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-800 font-semibold text-[11px]">
                      {q.materiPokok}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-700 leading-relaxed text-[11px]">
                      <span className="font-medium text-emerald-900 bg-emerald-50 px-1 py-0.5 rounded">
                        {q.ipk || `Menguasai materi ${q.materiPokok}`}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-700 leading-relaxed text-[11px]">
                      <div>{q.indikatorSoal || '-'}</div>
                      {(() => {
                        const pInfo = q.kbcPillar 
                          ? { pillar: q.kbcPillar as KbcPillarType, description: q.kbcDescription || '' } 
                          : detectKbcPillar(q.questionText, q.materiPokok, q.stimulusText, config.mataPelajaran);
                        const pMeta = KBC_PILLARS[pInfo.pillar] || KBC_PILLARS['Cinta Allah'];
                        return (
                          <div className="mt-1">
                            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded border ${pMeta.badgeBg} ${pMeta.badgeText} ${pMeta.borderColor}`}>
                              <span>{pMeta.iconSymbol}</span>
                              <span>Pilar KBC: {pMeta.title}</span>
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-extrabold text-[11px]">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-black">
                        {q.cognitiveLevel}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded ${
                        q.type === 'pg' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : q.type === 'pg_kompleks'
                          ? 'bg-teal-100 text-teal-800'
                          : q.type === 'isian'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {q.type === 'pg_kompleks' ? 'PG Kompleks' : q.type === 'pg' ? (q.subType === 'grup' ? 'PG (Grup)' : 'Pilihan Ganda') : q.type === 'isian' ? 'Isian Singkat' : 'Uraian / Esai'}
                      </span>
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-black">
                      {q.number}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700 text-[11px]">
                      {q.correctAnswer}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-black">
                      {q.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TITIK MANGSA & TANDA TANGAN */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-xs text-slate-800">
              <div className="text-center space-y-1">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala {schoolName}</p>
                <div className="h-16"></div>
                <p className="font-black underline text-sm">{principalName}</p>
                <p className="text-[11px] text-slate-500">NIP. {principalNip || '-'}</p>
              </div>

              <div className="text-center space-y-1">
                <p>{signaturePlace}, {signatureDate || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold">Guru Kelas</p>
                <div className="h-16"></div>
                <p className="font-black underline text-sm">{teacherName}</p>
                <p className="text-[11px] text-slate-500">NIP. {teacherNip || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: PREVIEW NASKAH UJIAN SISWA */}
      {/* ========================================================================= */}
      {activeView === 'preview' && (
        <div className="space-y-6">
          {/* Dynamic Print CSS for paper dimensions, margins, and column layout */}
          <style>{`
            @media print {
              @page {
                size: ${PAPER_DIMENSIONS[paperLayout.paperSize].widthMm}mm ${PAPER_DIMENSIONS[paperLayout.paperSize].heightMm}mm portrait !important;
                margin: ${paperLayout.marginTopCm}cm ${paperLayout.marginRightCm}cm ${paperLayout.marginBottomCm}cm ${paperLayout.marginLeftCm}cm !important;
              }
              .exam-paper-sheet {
                font-family: '${paperLayout.fontFamily}', ${paperLayout.fontFamily === 'Arial' || paperLayout.fontFamily === 'Calibri' ? 'sans-serif' : 'serif'} !important;
                font-size: ${paperLayout.fontSizePt}pt !important;
                line-height: ${paperLayout.lineHeight} !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
                box-shadow: none !important;
                border: none !important;
              }
              .exam-questions-flow {
                column-count: ${paperLayout.columnsCount} !important;
                column-gap: 24px !important;
              }
              .exam-col-span-all {
                column-span: all !important;
              }
              .break-inside-avoid {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
            }
          `}</style>

          {/* PREVIEW TOP ACTION BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-800">
                  Naskah Lembar Soal Ujian Siswa
                </h3>
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full uppercase">
                  {PAPER_DIMENSIONS[paperLayout.paperSize].name} • {paperLayout.fontFamily} {paperLayout.fontSizePt}pt
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Format lembar ujian resmi madrasah/sekolah lengkap dengan KOP dan tabel identitas siswa.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveModal('tataLetak')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                title="Atur jenis huruf, ukuran font, ukuran kertas (F4/A4), margin, kolom, dll."
              >
                <SlidersHorizontal size={14} className="text-indigo-600" />
                <span>Atur Huruf & Kertas</span>
              </button>
              <button
                onClick={() => setActiveModal('identitas')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                title="Sesuaikan nama yayasan, madrasah, waktu, kelas, dsb."
              >
                <Sliders size={14} />
                <span>Ubah KOP</span>
              </button>
              <button
                type="button"
                onClick={handleInterleaveStimuli}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                title="Acak & sebar variasi stimulus (gambar, tabel, cerita) secara proporsional dan selang-seling"
              >
                <Shuffle size={14} className="text-teal-600" />
                <span>Sebar Stimulus</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Printer size={14} />
                <span>Cetak Lembar Soal</span>
              </button>
              <button
                onClick={handleDownloadWordExam}
                disabled={isExportingWord}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                title="Unduh Naskah Soal dalam format Microsoft Word (.doc) dengan diagram lengkap"
              >
                {isExportingWord ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Memproses Gambar...</span>
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    <span>Unduh Word (.doc)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QUICK-RIBBON TOOLBAR (INSTANT CONTROLS FOR FONT, SIZE, PAPER, MARGIN, COLUMN) */}
          <div className="bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-2.5 text-xs screen-only">
            <div className="flex flex-wrap items-center gap-2">
              {/* Jenis Huruf Quick Select */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <Type size={13} className="text-indigo-600 shrink-0" />
                <span className="font-bold text-slate-500 text-[11px]">Font:</span>
                <select
                  value={paperLayout.fontFamily}
                  onChange={(e) => setPaperLayout(prev => ({ ...prev, fontFamily: e.target.value as any }))}
                  className="font-bold text-slate-800 bg-transparent border-none text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {FONT_FAMILY_OPTIONS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Ukuran Huruf Quick Select */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <Sliders size={13} className="text-blue-600 shrink-0" />
                <span className="font-bold text-slate-500 text-[11px]">Ukuran:</span>
                <select
                  value={paperLayout.fontSizePt}
                  onChange={(e) => setPaperLayout(prev => ({ ...prev, fontSizePt: parseFloat(e.target.value) }))}
                  className="font-bold text-slate-800 bg-transparent border-none text-xs focus:outline-none cursor-pointer pr-1"
                >
                  {FONT_SIZE_OPTIONS.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              {/* Ukuran Kertas Quick Select */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <FileText size={13} className="text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-500 text-[11px]">Kertas:</span>
                <select
                  value={paperLayout.paperSize}
                  onChange={(e) => setPaperLayout(prev => ({ ...prev, paperSize: e.target.value as any }))}
                  className="font-black text-emerald-800 bg-transparent border-none text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="F4">F4 / Folio (21.5 × 33 cm)</option>
                  <option value="A4">A4 (21.0 × 29.7 cm)</option>
                  <option value="Legal">Legal (21.6 × 35.6 cm)</option>
                  <option value="Letter">Letter / Kuarto</option>
                </select>
              </div>

              {/* Margin Preset Quick Select */}
              <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-500 text-[11px]">Margin:</span>
                <select
                  value={paperLayout.marginPreset}
                  onChange={(e) => handleApplyMarginPreset(e.target.value as any)}
                  className="font-bold text-slate-800 bg-transparent border-none text-xs focus:outline-none cursor-pointer pr-1"
                >
                  <option value="narrow">Sempit (1.5 cm - Hemat)</option>
                  <option value="normal">Normal (2.0 cm)</option>
                  <option value="standard_word">Standar Word (2.5 cm)</option>
                  <option value="custom">Kustom ({paperLayout.marginTopCm} cm)</option>
                </select>
              </div>

              {/* Kolom Soal Toggle */}
              <div className="flex items-center bg-white p-0.5 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setPaperLayout(prev => ({ ...prev, columnsCount: 1 }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    paperLayout.columnsCount === 1 ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="1 Kolom penuh berurutan"
                >
                  1 Kolom
                </button>
                <button
                  type="button"
                  onClick={() => setPaperLayout(prev => ({ ...prev, columnsCount: 2 }))}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    paperLayout.columnsCount === 2 ? 'bg-amber-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="2 Kolom - Model Koran / Hemat lembar fotokopi!"
                >
                  <Columns size={12} />
                  <span>2 Kolom (Hemat)</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal('tataLetak')}
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 hover:underline cursor-pointer ml-auto"
            >
              <SlidersHorizontal size={13} />
              <span>Detail Format & Reset</span>
            </button>
          </div>

          {/* REALISTIC EXAM PAPER SHEET PREVIEW */}
          <div 
            className="bg-white rounded-2xl border border-slate-300 shadow-sm mx-auto print:p-0 print:border-none print:shadow-none text-slate-900 exam-paper-sheet transition-all"
            style={{
              fontFamily: paperLayout.fontFamily,
              fontSize: `${paperLayout.fontSizePt}pt`,
              lineHeight: paperLayout.lineHeight,
              paddingTop: `${paperLayout.marginTopCm}cm`,
              paddingBottom: `${paperLayout.marginBottomCm}cm`,
              paddingLeft: `${paperLayout.marginLeftCm}cm`,
              paddingRight: `${paperLayout.marginRightCm}cm`,
              maxWidth: paperLayout.columnsCount === 2 ? '950px' : paperLayout.paperSize === 'F4' ? '880px' : '840px'
            }}
          >
            {/* PAPER SPECS BADGE (SCREEN-ONLY) */}
            <div className="text-[10px] text-slate-400 font-sans mb-3 pb-1.5 border-b border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-2 screen-only print:hidden">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  📄 Kertas: <b>{PAPER_DIMENSIONS[paperLayout.paperSize].name}</b> ({PAPER_DIMENSIONS[paperLayout.paperSize].widthCm} × {PAPER_DIMENSIONS[paperLayout.paperSize].heightCm} cm)
                </span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  🔤 Font: <b>{paperLayout.fontFamily} {paperLayout.fontSizePt}pt</b> (Spasi: {paperLayout.lineHeight})
                </span>
                <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  📐 Margin: <b>{paperLayout.marginTopCm}cm</b>
                </span>
                <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  🏛 Alur: <b>{paperLayout.columnsCount === 1 ? '1 Kolom' : '2 Kolom (Model Koran)'}</b>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('tataLetak')}
                className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
              >
                Sesuaikan ⚙️
              </button>
            </div>

            {/* KOP RESMI DENGAN LOGO & DOUBLE LINE */}
            <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  {config.kopLogoUrl || schoolLogo ? (
                    <img 
                      src={config.kopLogoUrl || schoolLogo} 
                      alt="Logo Sekolah" 
                      className="w-full h-full object-contain" 
                    />
                  ) : (
                    <MadrasahEmblemSVG className="w-full h-full drop-shadow-xs" />
                  )}
                </div>
                <div className="flex-1 text-center pr-16 sm:pr-20">
                  <h2 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-900 font-sans">
                    {config.namaYayasan || 'YAYASAN PERGURUAN MUSLIMIN (YPM)'}
                  </h2>
                  <h3 className="text-sm sm:text-base md:text-lg font-black uppercase tracking-tight text-slate-900 my-0.5 font-sans">
                    {config.namaMadrasah || schoolName || 'MADRASAH IBTIDAIYAH .....'}
                  </h3>
                  <p className="text-xs sm:text-sm font-black uppercase text-slate-900 font-sans">
                    {config.judulAsesmen} TAHUN PELAJARAN {config.tahunPelajaran}
                  </p>
                </div>
              </div>
            </div>

            {/* TABEL IDENTITAS SISWA DENGAN NILAI, PARAF GURU, PARAF ORTU */}
            <div className="overflow-x-auto mb-5">
              <table className="w-full border-collapse border-2 border-slate-900 text-xs font-sans text-slate-900">
                <tbody>
                  <tr>
                    <td className="border border-slate-900 px-3 py-1.5 font-bold w-28 sm:w-36 bg-slate-50/40">Mata Pelajaran</td>
                    <td className="border border-slate-900 px-1 py-1.5 text-center font-bold w-4">:</td>
                    <td className="border border-slate-900 px-3 py-1.5 font-black uppercase tracking-wide">{config.mataPelajaran}</td>
                    <td className="border border-slate-900 px-2 py-1.5 text-center font-black w-14 sm:w-16 bg-slate-50">Nilai</td>
                    <td className="border border-slate-900 px-2 py-1.5 text-center font-black w-20 sm:w-24 bg-slate-50">Paraf Guru</td>
                    <td className="border border-slate-900 px-2 py-1.5 text-center font-black w-20 sm:w-24 bg-slate-50">Paraf Ortu</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 px-3 py-1.5 font-bold bg-slate-50/40">Hari, Tanggal</td>
                    <td className="border border-slate-900 px-1 py-1.5 text-center font-bold">:</td>
                    <td className="border border-slate-900 px-3 py-1.5 text-slate-700">
                      {config.hariTanggal || ''}
                    </td>
                    <td rowSpan={4} className="border border-slate-900 text-center align-middle font-black text-xl text-slate-800">
                      {/* Kolom Nilai Kosong untuk Guru */}
                    </td>
                    <td rowSpan={4} className="border border-slate-900 text-center align-middle">
                      {/* Kolom Paraf Guru */}
                    </td>
                    <td rowSpan={4} className="border border-slate-900 text-center align-middle">
                      {/* Kolom Paraf Ortu */}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 px-3 py-1.5 font-bold bg-slate-50/40">Waktu</td>
                    <td className="border border-slate-900 px-1 py-1.5 text-center font-bold">:</td>
                    <td className="border border-slate-900 px-3 py-1.5 font-semibold text-slate-800">
                      {config.waktuPelaksanaan || config.alokasiWaktu || '07.30 – 09.00'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 px-3 py-1.5 font-bold bg-slate-50/40">Nama</td>
                    <td className="border border-slate-900 px-1 py-1.5 text-center font-bold">:</td>
                    <td className="border border-slate-900 px-3 py-1.5 text-slate-400 font-mono tracking-wider">
                      ....................................................................
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-900 px-3 py-1.5 font-bold bg-slate-50/40">Kelas</td>
                    <td className="border border-slate-900 px-1 py-1.5 text-center font-bold">:</td>
                    <td className="border border-slate-900 px-3 py-1.5 font-black text-slate-900">
                      {config.customClassLabel || formatClassToRomanLabel(config.tingkatKelas)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* INSTRUKSI PENGERJAAN SOAL */}
            <div className="font-bold text-xs sm:text-sm text-slate-900 mt-4 mb-4 font-sans leading-relaxed">
              I. Berilah tanda silang ( X ) Pada huruf {config.opsiPgCount === 3 ? 'a, b, atau c' : 'a, b, c atau d'} dengan jawaban yang paling benar!
            </div>

            {/* QUESTIONS FLOW CONTAINER (SUPPORTING 1-COLUMN OR 2-COLUMN CORAN FORMAT) */}
            <div className={paperLayout.columnsCount === 2 ? 'exam-questions-flow sm:columns-2 gap-6' : 'exam-questions-flow'}>
              {/* DAFTAR BUTIR SOAL BAGIAN I: PILIHAN GANDA (PG TUNGGAL & PG KOMPLEKS BERCAMPUR SESUAI INSTRUKSI) */}
              {questions.some(q => q.type === 'pg' || q.type === 'pg_kompleks') && (
                <div className={`mb-6 ${paperLayout.questionSpacing === 'compact' ? 'space-y-2.5' : paperLayout.questionSpacing === 'spacious' ? 'space-y-5' : 'space-y-3.5'}`}>
                  {questions.filter(q => q.type === 'pg' || q.type === 'pg_kompleks').map((q) => {
                    const showStimulus = (!q.groupId && q.stimulusType !== 'none') || (q.groupId && q.isGroupFirst);

                    return (
                      <div key={q.id} className="space-y-1.5 break-inside-avoid">
                        {/* STIMULUS SOAL (TANPA KOTAK) */}
                        {showStimulus && (
                          <div className="space-y-1 my-2 text-xs font-sans text-slate-900">
                            {q.groupHeaderNotice && (
                              <p className="font-bold text-slate-900">
                                📌 {q.groupHeaderNotice}
                              </p>
                            )}
                            {q.stimulusTitle && <p className="font-bold text-slate-900">{q.stimulusTitle}</p>}
                            {q.stimulusText && (!q.stimulusSvg && !q.stimulusImageUrl) && (
                              <p className="italic leading-relaxed whitespace-pre-line text-slate-800">{q.stimulusText}</p>
                            )}
                            {q.stimulusTable && (!q.stimulusSvg && !q.stimulusImageUrl) && (
                              <StimulusTableRenderer 
                                tableText={q.stimulusTable} 
                                isExamPaper={true}
                              />
                            )}
                          </div>
                        )}

                        {/* ARABIC TYPOGRAPHY (TANPA KOTAK) */}
                        {q.arabicText && (
                          <div className="my-2 space-y-1 break-inside-avoid">
                            <p 
                              dir="rtl" 
                              className="text-right text-slate-950 font-serif font-bold leading-loose"
                              style={{ 
                                fontSize: `${Math.round(paperLayout.fontSizePt * 1.35)}pt`, 
                                fontFamily: "'Amiri', 'Traditional Arabic', 'Scheherazade New', serif" 
                              }}
                            >
                              {q.arabicText}
                            </p>
                            {q.arabicTranslation && (
                              <p className="text-[10px] text-slate-600 italic font-sans">
                                Artinya: &ldquo;{q.arabicTranslation}&rdquo;
                              </p>
                            )}
                          </div>
                        )}

                        {/* RENDERED VISUAL GRAPHIC / SVG DIAGRAM (CLEAN & TANPA KOTAK) */}
                        {(q.stimulusSvg || q.stimulusImageUrl) && (
                          <div className="my-2.5 flex justify-center break-inside-avoid">
                            <StimulusGraphicRenderer 
                              graphicKey={q.stimulusSvg} 
                              imageUrl={q.stimulusImageUrl} 
                              caption={undefined}
                              maxHeight="145px"
                            />
                          </div>
                        )}

                        <p className="leading-relaxed" style={{ fontSize: `${paperLayout.fontSizePt}pt` }}>
                          <span className="font-bold">{q.number}.</span> {renderMathFormattedText(q.questionText)}
                        </p>

                        {/* PERNYATAAN MCMA UNTUK PG KOMPLEKS (TERCAMPUR LANGSUNG TANPA KOTAK) */}
                        {q.type === 'pg_kompleks' && q.complexStatements && (
                          <div className="ml-4 space-y-1 text-xs font-sans text-slate-900 my-1.5">
                            <span className="font-bold text-slate-800 block text-[11px]">
                              Perhatikan pernyataan-pernyataan berikut:
                            </span>
                            {q.complexStatements.map((st: any, idx: number) => (
                              <div key={st.id || idx} className="flex items-start gap-2">
                                <span className="font-bold w-4 shrink-0">({st.id || `${idx + 1}`})</span>
                                <span>{typeof st === 'string' ? renderMathFormattedText(st) : renderMathFormattedText(st.text)}</span>
                              </div>
                            ))}
                            <p className="text-[11px] font-bold text-slate-800 pt-0.5 mt-0.5">
                              Pernyataan yang tepat ditunjukkan oleh nomor ....
                            </p>
                          </div>
                        )}

                        {q.options && Array.isArray(q.options) && (
                          <div className={`grid grid-cols-1 ${paperLayout.columnsCount === 2 ? 'gap-1' : 'sm:grid-cols-2 gap-1.5'} ml-4 font-sans`} style={{ fontSize: `${paperLayout.fontSizePt}pt` }}>
                            {q.options.map((opt: any, optIdx: number) => {
                              const label = (typeof opt === 'object' && opt?.label) ? opt.label : ['A', 'B', 'C', 'D'][optIdx] || 'A';
                              const rawText = (typeof opt === 'object' && opt?.text !== undefined) ? opt.text : (typeof opt === 'string' ? opt : '');
                              const cleanText = String(rawText).replace(/^[A-Da-d][\.\)]\s*/, '').trim();
                              return (
                                <div key={label + optIdx} className="flex items-start gap-2">
                                  <span className="font-bold">{label}.</span>
                                  <span>{renderMathFormattedText(cleanText || `Pilihan ${label}`)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BAGIAN II: ISIAN SINGKAT */}
              {questions.some(q => q.type === 'isian') && (
                <div className="mb-6">
                  <div 
                    className="exam-col-span-all font-bold text-xs sm:text-sm text-slate-900 mt-5 mb-3 font-sans border-b border-slate-200 pb-1"
                    style={{ columnSpan: 'all' as any }}
                  >
                    II. ISIAN SINGKAT (Isilah titik-titik di bawah ini dengan jawaban yang tepat dan ringkas!)
                  </div>

                  <div className={paperLayout.questionSpacing === 'compact' ? 'space-y-2.5' : paperLayout.questionSpacing === 'spacious' ? 'space-y-5' : 'space-y-3.5'}>
                    {questions.filter(q => q.type === 'isian').map((q) => {
                      const showStimulus = (!q.groupId && q.stimulusType !== 'none') || (q.groupId && q.isGroupFirst);

                      return (
                        <div key={q.id} className="space-y-1 break-inside-avoid">
                          {/* STIMULUS (TANPA KOTAK) */}
                          {showStimulus && (
                            <div className="space-y-1 my-1.5 text-xs font-sans text-slate-900">
                              {q.stimulusTitle && <p className="font-bold text-slate-900">{q.stimulusTitle}</p>}
                              {q.stimulusText && <p className="italic leading-relaxed text-slate-800">{q.stimulusText}</p>}
                              {q.stimulusTable && (!q.stimulusSvg && !q.stimulusImageUrl) && <StimulusTableRenderer tableText={q.stimulusTable} isExamPaper={true} compact={true} />}
                            </div>
                          )}

                          {/* ARABIC TYPOGRAPHY (TANPA KOTAK) */}
                          {q.arabicText && (
                            <div className="my-1.5 space-y-1 break-inside-avoid">
                              <p 
                                dir="rtl" 
                                className="text-right text-slate-950 font-serif font-bold leading-loose"
                                style={{ 
                                   fontSize: `${Math.round(paperLayout.fontSizePt * 1.35)}pt`, 
                                  fontFamily: "'Amiri', 'Traditional Arabic', serif" 
                                }}
                              >
                                {q.arabicText}
                              </p>
                              {q.arabicTranslation && (
                                <p className="text-[10px] text-slate-600 italic font-sans">
                                  Artinya: &ldquo;{q.arabicTranslation}&rdquo;
                                </p>
                              )}
                            </div>
                          )}

                          {/* RENDERED VISUAL GRAPHIC / SVG DIAGRAM */}
                          {(q.stimulusSvg || q.stimulusImageUrl) && (
                            <div className="my-2 flex justify-center break-inside-avoid">
                              <StimulusGraphicRenderer 
                                graphicKey={q.stimulusSvg} 
                                imageUrl={q.stimulusImageUrl} 
                                caption={undefined}
                                maxHeight="140px"
                              />
                            </div>
                          )}

                          <p className="leading-relaxed" style={{ fontSize: `${paperLayout.fontSizePt}pt` }}>
                            <span className="font-bold">{q.number}.</span> {renderMathFormattedText(q.questionText)}
                          </p>
                          {paperLayout.showAnswerDottedLines ? (
                            <div className="ml-4 border-b border-dotted border-slate-400 w-3/4 h-5"></div>
                          ) : (
                            <div className="ml-4 text-[11px] text-slate-400 italic">[Jawaban ditulis pada lembar jawaban]</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* BAGIAN III: URAIAN / ESAI */}
              {questions.some(q => q.type === 'esai') && (
                <div className="mb-6">
                  <div 
                    className="exam-col-span-all font-bold text-xs sm:text-sm text-slate-900 mt-5 mb-3 font-sans border-b border-slate-200 pb-1"
                    style={{ columnSpan: 'all' as any }}
                  >
                    {questions.some(q => q.type === 'isian') ? 'III' : 'II'}. URAIAN / ESAI (Jawablah pertanyaan-pertanyaan berikut dengan jelas dan lengkap!)
                  </div>

                  <div className={paperLayout.questionSpacing === 'compact' ? 'space-y-3' : paperLayout.questionSpacing === 'spacious' ? 'space-y-6' : 'space-y-4'}>
                    {questions.filter(q => q.type === 'esai').map((q) => {
                      const showStimulus = (!q.groupId && q.stimulusType !== 'none') || (q.groupId && q.isGroupFirst);

                      return (
                        <div key={q.id} className="space-y-1.5 break-inside-avoid">
                          {/* STIMULUS (TANPA KOTAK) */}
                          {showStimulus && (
                            <div className="space-y-1 my-1.5 text-xs font-sans text-slate-900">
                              {q.stimulusTitle && <p className="font-bold text-slate-900">{q.stimulusTitle}</p>}
                              {q.stimulusText && <p className="italic leading-relaxed text-slate-800">{q.stimulusText}</p>}
                              {q.stimulusTable && (!q.stimulusSvg && !q.stimulusImageUrl) && <StimulusTableRenderer tableText={q.stimulusTable} isExamPaper={true} compact={true} />}
                            </div>
                          )}

                          {/* ARABIC TYPOGRAPHY (TANPA KOTAK) */}
                          {q.arabicText && (
                            <div className="my-1.5 space-y-1 break-inside-avoid">
                              <p 
                                dir="rtl" 
                                className="text-right text-slate-950 font-serif font-bold leading-loose"
                                style={{ 
                                  fontSize: `${Math.round(paperLayout.fontSizePt * 1.35)}pt`, 
                                  fontFamily: "'Amiri', 'Traditional Arabic', serif" 
                                }}
                              >
                                {q.arabicText}
                              </p>
                              {q.arabicTranslation && (
                                <p className="text-[10px] text-slate-600 italic font-sans">
                                  Artinya: &ldquo;{q.arabicTranslation}&rdquo;
                                </p>
                              )}
                            </div>
                          )}

                          {/* RENDERED VISUAL GRAPHIC / SVG DIAGRAM */}
                          {(q.stimulusSvg || q.stimulusImageUrl) && (
                            <div className="my-2 flex justify-center break-inside-avoid">
                              <StimulusGraphicRenderer 
                                graphicKey={q.stimulusSvg} 
                                imageUrl={q.stimulusImageUrl} 
                                caption={undefined}
                                maxHeight="150px"
                              />
                            </div>
                          )}

                          <p className="leading-relaxed" style={{ fontSize: `${paperLayout.fontSizePt}pt` }}>
                            <span className="font-bold">{q.number}.</span> {renderMathFormattedText(q.questionText)}
                          </p>
                          {paperLayout.showAnswerDottedLines ? (
                            <div className="ml-4 space-y-2">
                              <div className="border-b border-dotted border-slate-400 h-6"></div>
                              <div className="border-b border-dotted border-slate-400 h-6"></div>
                              <div className="border-b border-dotted border-slate-400 h-6"></div>
                            </div>
                          ) : (
                            <div className="ml-4 text-[11px] text-slate-400 italic">[Jawaban diuraikan pada lembar terpisah]</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* VIEW 5: KUNCI & PEDOMAN PENSKORAN */}
      {/* ========================================================================= */}
      {activeView === 'kunci' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 screen-only">
            <div>
              <h3 className="text-sm font-black text-slate-800">
                Kunci Jawaban & Rubrik Pedoman Penskoran
              </h3>
              <p className="text-xs text-slate-500">
                Panduan koreksi guru untuk penilaian objektif siswa.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer size={13} />
              <span>Cetak Kunci</span>
            </button>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
              <span className="font-black block mb-1">Rumus Perhitungan Nilai Akhir:</span>
              <p>Nilai Akhir (NA) = (Total Skor yang Diperoleh / Total Skor Maksimal <b>{grandTotalScore}</b>) × 100</p>
            </div>

            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-extrabold text-center">
                  <th className="border border-slate-300 p-2.5 w-14">No</th>
                  <th className="border border-slate-300 p-2.5 w-20">Induk CP</th>
                  <th className="border border-slate-300 p-2.5 w-20">Bentuk</th>
                  <th className="border border-slate-300 p-2.5 text-left">Kunci Jawaban / Jawaban Ideal</th>
                  <th className="border border-slate-300 p-2.5 w-16">Skor</th>
                  <th className="border border-slate-300 p-2.5 text-left min-w-[200px]">Rubrik & Kriteria Penskoran</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50">
                    <td className="border border-slate-300 p-2 text-center font-black">{q.number}</td>
                    <td className="border border-slate-300 p-2 text-center font-bold text-[10px] text-purple-800">
                      {q.cpCode || 'CP 1'}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-bold uppercase text-[10px]">
                      {q.type}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-800 font-bold whitespace-pre-line">
                      {q.correctAnswer}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-black text-emerald-800">
                      {q.score}
                    </td>
                    <td className="border border-slate-300 p-2 text-slate-600 text-[11px] leading-relaxed whitespace-pre-line">
                      {q.rubrikPenilaian || (q.type === 'pg' ? `Benar = ${q.score}, Salah = 0` : '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: BANK TEKS & LAFADZ ARAB BERHARAKAT LENGKAP (SIAP PAKAI) */}
      {/* ========================================================================= */}
      {showArabicSnippetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-200">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Bank Lafadz & Teks Arab Berharakat Lengkap
                  </h3>
                  <p className="text-xs text-emerald-200">
                    {pickerTargetQuestionId 
                      ? `Menyematkan ke Butir Soal No. ${questions.find(q => q.id === pickerTargetQuestionId)?.number || ''}`
                      : 'Pilih lafadz dalil atau teks percakapan siap pakai (no editing lanjutan)'}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowArabicSnippetModal(false);
                  setPickerTargetQuestionId(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* SEARCH & FILTER CONTROLS */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
              <input
                type="text"
                value={arabicSearchQuery}
                onChange={(e) => setArabicSearchQuery(e.target.value)}
                placeholder="Cari lafadz (contoh: wudhu, mizan, ilmu, al-ma'un, at-tin, shalat, ta'aruf)..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* SNIPPETS LIST */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {ARABIC_SNIPPETS_LIBRARY
                .filter(s => {
                  if (!arabicSearchQuery) return true;
                  const q = arabicSearchQuery.toLowerCase();
                  return s.title.toLowerCase().includes(q) ||
                         s.translation.toLowerCase().includes(q) ||
                         s.category.toLowerCase().includes(q) ||
                         s.arabicText.includes(arabicSearchQuery);
                })
                .map((snippet) => (
                  <div 
                    key={snippet.id} 
                    className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {snippet.category.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-black text-slate-800">
                          {snippet.title}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const targetId = pickerTargetQuestionId || questions[0]?.id;
                          if (targetId) {
                            setQuestions(prev => prev.map(q => q.id === targetId ? {
                              ...q,
                              arabicText: snippet.arabicText,
                              arabicTranslation: snippet.translation,
                              stimulusTitle: snippet.title,
                              stimulusType: q.stimulusType === 'none' ? 'cerita' : q.stimulusType
                            } : q));
                          }
                          setShowArabicSnippetModal(false);
                          setPickerTargetQuestionId(null);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <Check size={13} />
                        <span>Sematkan ke Soal</span>
                      </button>
                    </div>

                    <p 
                      dir="rtl" 
                      className="text-right text-emerald-950 font-serif font-bold text-lg leading-loose pt-1"
                      style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}
                    >
                      {snippet.arabicText}
                    </p>

                    <p className="text-[11px] text-slate-600 italic font-sans border-t border-slate-100 pt-1.5">
                      Artinya: &ldquo;{snippet.translation}&rdquo;
                    </p>
                  </div>
                ))}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Tip: Teks Arab di atas sudah berharakat lengkap (fathah, kasrah, dhammah, sukun, tasydid).</span>
              <button
                type="button"
                onClick={() => {
                  setShowArabicSnippetModal(false);
                  setPickerTargetQuestionId(null);
                }}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BANK DIAGRAM VEKTOR & GAMBAR EDUKASI (BUKAN LINK URL) */}
      {/* ========================================================================= */}
      {showGraphicModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-200">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    Bank Diagram Vektor & Gambar Edukasi Asli
                  </h3>
                  <p className="text-xs text-blue-200">
                    Gambar jadi berupa vektor SVG tajam (bukan link URL teks), langsung tercetak di web & ekspor Word.
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  setShowGraphicModal(false);
                  setPickerTargetQuestionId(null);
                }}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* FILTER & UPLOAD CONTROLS */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'all', label: 'Semua Diagram' },
                  { id: 'matematika', label: '📐 Matematika & Geometri' },
                  { id: 'agama', label: '🕌 Ibadah & Madrasah' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setGraphicCategoryFilter(cat.id as any)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                      graphicCategoryFilter === cat.id 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* UPLOAD CUSTOM LOCAL IMAGE FILE AS EMBEDDED DATA URL */}
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-400 text-slate-800 rounded-xl font-bold cursor-pointer transition shadow-2xs">
                <Plus size={14} className="text-blue-600" />
                <span>Upload Foto / Gambar Lokal</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        const targetId = pickerTargetQuestionId || questions[0]?.id;
                        if (targetId) {
                          setQuestions(prev => prev.map(q => q.id === targetId ? {
                            ...q,
                            stimulusImageUrl: dataUrl,
                            stimulusSvg: undefined,
                            stimulusType: 'gambar',
                            stimulusTitle: q.stimulusTitle || `Gambar Soal No. ${q.number}`
                          } : q));
                        }
                        setShowGraphicModal(false);
                        setPickerTargetQuestionId(null);
                      };
                      reader.readAsDataURL(file);
                    }
                  }} 
                />
              </label>
            </div>

            {/* GRAPHICS GRID */}
            <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
              {Object.entries(EDUCATIONAL_GRAPHICS)
                .filter(([_, g]) => graphicCategoryFilter === 'all' || g.category === graphicCategoryFilter)
                .map(([gKey, g]) => (
                  <div 
                    key={gKey} 
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-sm transition-all space-y-3 bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                          g.category === 'matematika' ? 'bg-blue-100 text-blue-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {g.category}
                        </span>
                        <h4 className="text-xs font-black text-slate-800 truncate max-w-[170px]">
                          {g.title}
                        </h4>
                      </div>

                      <div className="my-2 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center min-h-[140px]">
                        <StimulusGraphicRenderer graphicKey={gKey} caption={g.title} maxHeight="120px" />
                      </div>

                      <p className="text-[11px] text-slate-600 leading-snug">
                        {g.description || g.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const targetId = pickerTargetQuestionId || questions[0]?.id;
                        if (targetId) {
                          setQuestions(prev => prev.map(q => q.id === targetId ? {
                            ...q,
                            stimulusSvg: gKey,
                            stimulusImageUrl: undefined,
                            stimulusType: 'gambar',
                            stimulusTitle: g.title
                          } : q));
                        }
                        setShowGraphicModal(false);
                        setPickerTargetQuestionId(null);
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <Check size={13} />
                      <span>Sematkan Diagram Ini</span>
                    </button>
                  </div>
                ))}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span>Diagram di atas berupa vektor SVG mandiri, dijamin tidak buram dan tidak memicu broken link.</span>
              <button
                type="button"
                onClick={() => {
                  setShowGraphicModal(false);
                  setPickerTargetQuestionId(null);
                }}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
