import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Share server-side Gemini AI Initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Chat Endpoint for Curriculum Assistant
app.post("/api/chat", async (req, res) => {
  try {
    const { message, context, history } = req.body;

    if (!message) {
      res.status(400).json({ error: "Pesan tidak boleh kosong." });
      return;
    }

    // Set up a strong, highly specialized system instruction
    const systemInstruction = `Anda adalah Asisten Administrasi Kurikulum & Pembelajaran AI (Wakil Kepala Sekolah Bidang Kurikulum) sekolah di Indonesia.
Tugas Anda adalah membantu guru menyusun administrasi pembelajaran, menganalisis hari efektif belajar (HEB), menyusun alokasi waktu RPP/Modul Ajar, menjadwalkan ujian, dan memberikan ide kegiatan non-akademik (seperti class meeting).

Berikut adalah data Kalender Pendidikan guru saat ini yang diatur lewat aplikasi:
- Tahun Pelajaran/Akademik: ${context?.academicYear || '2026/2027'}
- Hari Efektif Belajar (HEB): ${context?.hebCount || 0} hari
- Hari Efektif Kegiatan (HEK): ${context?.hekCount || 0} hari
- Jumlah Hari Libur Nasional: ${context?.lnCount || 0} hari
- Jumlah Hari Libur Sekolah: ${context?.lsCount || 0} hari
- Rincian Kegiatan Sekolah Terjadwal:
${context?.activitiesList ? context.activitiesList.map((a: string) => `  * ${a}`).join('\n') : '  * Belum ada kegiatan terplot'}

Panduan Menjawab:
1. Jawablah dalam bahasa Indonesia yang ramah, profesional, solutif, dan mudah dipahami oleh guru.
2. Gunakan visual formatting (markdown list, tabel jika diperlukan, heading tebal) agar mudah dibaca oleh guru yang sibuk.
3. Selalu hubungkan jawaban Anda dengan statistik kalender pendidikan guru di atas untuk memberikan rekomendasi nyata (contoh: "Dengan sisa ${context?.hebCount || 0} hari efektif...").
4. Berikan saran alokasi pertemuan atau distribusi bab pembelajaran secara taktis dan terstruktur.`;

    // Construct simple context prompt combined with history
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === 'assistant' ? 'model' : h.role,
      parts: [{ text: h.content }]
    }));

    // Append current user message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Terjadi kesalahan internal pada server AI." });
  }
});

// Setup Vite Dev Server / Static Asset delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
