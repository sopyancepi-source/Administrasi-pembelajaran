import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Trash2, Cpu, HelpCircle } from 'lucide-react';
import { CalendarDay, ChatMessage } from '../types';

interface AIChatViewProps {
  calendarData: Record<string, CalendarDay>;
  selectedYear: number;
}

const MONTHS_INDONESIAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function AIChatView({ calendarData, selectedYear }: AIChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Selamat datang! Saya adalah Asisten Kurikulum AI Anda. 

Saya telah memuat data kalender akademik **Tahun Pelajaran ${selectedYear}/${selectedYear + 1}** yang Anda atur. Anda dapat bertanya kepada saya seperti:
- *"Analisis jumlah hari efektif belajar (HEB) saya apakah sudah ideal?"*
- *"Bantu distribusikan alokasi waktu materi ajar Matematika jika saya punya 20 bab dengan sisa hari efektif kalender."*
- *"Buat rekomendasi pelaksanaan UTS/UAS di bulan Desember/Maret agar tidak bentrok dengan libur nasional."*
- *"Berikan ide kegiatan menarik untuk class meeting di akhir semester."*

Apa yang ingin Anda konsultasikan hari ini?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Aggregate stats to send as system context
  const calendarSummaryContext = useMemo(() => {
    const list = Object.values(calendarData);
    const hebCount = list.filter(d => d.type === 'HEB').length;
    const hekCount = list.filter(d => d.type === 'HEK').length;
    const lnCount = list.filter(d => d.type === 'LIBUR_NASIONAL').length;
    const lsCount = list.filter(d => d.type === 'LIBUR_SEKOLAH').length;
    
    // Registered activities
    const activities = list
      .filter(d => d.type === 'HEK' && d.activityName)
      .map(d => `${d.dateString}: ${d.activityName}`)
      .slice(0, 15); // limit to avoid token bloat

    return {
      selectedYear,
      academicYear: `${selectedYear}/${selectedYear + 1}`,
      hebCount,
      hekCount,
      lnCount,
      lsCount,
      activitiesList: activities
    };
  }, [calendarData, selectedYear]);

  // Quick suggestion prompts
  const suggestions = [
    "Analisis efisiensi hari belajar",
    "Saran distribusi bab pembelajaran RPP",
    "Rekomendasi jadwal ujian & PTS",
    "Ide agenda class meeting kreatif"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: calendarSummaryContext,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error('Gagal berkomunikasi dengan asisten kurikulum AI.');
      }

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Mohon maaf, saya mengalami kesulitan merumuskan jawaban. Silakan coba sesaat lagi.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: 'assistant',
        content: `Error: Gagal memproses permintaan Anda karena masalah koneksi server. Pastikan API Key di panel secrets telah terkonfigurasi secara tepat.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm('Apakah Anda yakin ingin mengosongkan riwayat diskusi asisten kurikulum ini?')) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Riwayat obrolan telah dibersihkan. Data kalender akademik **Tahun Pelajaran ${selectedYear}/${selectedYear + 1}** tetap tersinkronisasi. Silakan ajukan pertanyaan baru Anda seputar administrasi pembelajaran!`,
          timestamp: new Date()
        }
      ]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs h-[calc(100vh-140px)] flex flex-col overflow-hidden" id="ai-chat-view-container">
      {/* AI Chat Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
            <Cpu size={18} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide block">Asisten Kurikulum AI</span>
            <span className="text-[10px] text-slate-400 block leading-normal">Menganalisis kalender Anda secara real-time</span>
          </div>
        </div>

        <button
          onClick={clearChat}
          title="Bersihkan Percakapan"
          className="p-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-slate-500 transition cursor-pointer"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-(--breakpoint-md) ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${isUser ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-emerald-700'}`}>
                {isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${isUser ? 'bg-slate-800 border-slate-800 text-white rounded-tr-none' : 'bg-white border-slate-100 text-slate-700 rounded-tl-none shadow-xs'}`}>
                <div className="whitespace-pre-line prose max-w-none">{msg.content}</div>
                <span className={`block text-[9px] mt-2 text-right ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-700 flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={14} />
            </div>
            <div className="p-4 bg-white border border-slate-100 rounded-2xl rounded-tl-none shadow-xs text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
              <span>Memproses analisis kurikulum...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && (
        <div className="p-4 bg-white border-t border-slate-100/50">
          <span className="text-[10px] font-bold text-slate-400 block uppercase mb-2 flex items-center gap-1.5">
            <HelpCircle size={12} />
            Pertanyaan Pintasan
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(sug)}
                className="text-[11px] font-medium bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 text-slate-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Submit form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pertanyaan administrasi kurikulum di sini..."
          disabled={isLoading}
          className="flex-1 text-xs p-3 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl focus:outline-none disabled:bg-slate-50 text-slate-800 placeholder-slate-400"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white rounded-xl shadow-xs transition flex items-center justify-center cursor-pointer"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
