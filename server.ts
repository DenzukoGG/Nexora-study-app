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

// Initialize server-side Gemini client lazily
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// 1. API: AI Productivity Insights
app.post("/api/gemini/insights", async (req, res) => {
  try {
    const { tasks, focusMetrics } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Fallback pre-generated high-fidelity insights
      return res.json({
        insights: [
          {
            id: "insight-1",
            title: "Pengelompokan Waktu Belajar",
            category: "Deep Focus",
            impact: "Sangat Disarankan",
            description: "Daftar tugas Anda menunjukkan bab Matematika Statistika butuh fokus tinggi. Sebaiknya cicil bab ini dalam sesi fokus 45 menit tanpa HP agar cepat selesai.",
            recommendation: "Mulai Sesi Fokus 'Belajar Keras' selama 45 menit.",
          },
          {
            id: "insight-2",
            title: "Pencegahan Kebosanan Belajar",
            category: "Burnout Risk",
            impact: "Tips Belajar",
            description: "Tugas sains draf dampak perubahan iklim global membutuhkan analisis kritis. Istirahat sejenak setiap 25 menit agar pikiran tetap segar.",
            recommendation: "Gunakan sesi Belajar Santai dengan irama jeda rehat.",
          },
          {
            id: "insight-3",
            title: "Waktu Puncak Pemahaman",
            category: "Stable Flow",
            impact: "Optimalisasi",
            description: "Berdasarkan statistik, tingkat konsentrasi terbaik Anda adalah di pagi hari jam 08:00 - 11:00. Kerjakan tugas tersulit Anda di jam tersebut.",
            recommendation: "Jadwalkan pengerjaan PR sulit besok pagi.",
          },
        ],
        summary: "Analisis tugas selesai. Tetap semangat belajarnya, Denzuko! Semua PR terpantau dengan baik.",
      });
    }

    const taskText = JSON.stringify(tasks);
    const metricText = JSON.stringify(focusMetrics);

    const systemInstruction = `You are 'NEXORA CORESYNC', the central AI study advisor of Nexora Productivity App. You communicate directly with the user, 'Denzuko', a high school student in Indonesia.
Analyze the user's homework workload (tasks, priorities, and subjects) and focus metric history to deliver helpful, smart, highly practical, and motivating tips for study productivity.
CRITICAL: You must always respond in Indonesian (Bahasa Indonesia). Keep the language friendly, natural, simple, encouraging, and perfect for an Indonesian teenage student. Avoid overly dramatic or futuristic tech-larp sci-fi terminology.
You must return a valid JSON object matching the exact structure:
{
  "insights": [
    {
      "id": "string",
      "title": "string in Indonesian (simple, smart, encouraging concept, e.g., 'Fokus Bab Matematika', 'Sesi Baca Cepat')",
      "category": "string (MUST correspond strictly to one of: 'Deep Focus', 'Stable Flow', 'Peak Session', 'Burnout Risk')",
      "impact": "string in Indonesian (e.g., 'Sangat Penting', 'Rekomendasi', 'Tips Pintar', 'Butuh Istirahat')",
      "description": "string in Indonesian (compelling, friendly advice in 2 sentences tailored to high schoolers)",
      "recommendation": "string in Indonesian (direct, short action statement, e.g., 'Mulai belajar 25 menit')"
    }
  ],
  "summary": "string in Indonesian (a warm, encouraging status line, max 15 words, greeting Denzuko)"
}
Return only the raw JSON. No markdown wrappers.`;

    const prompt = `Current workload tasks queue: ${taskText}. Active FocusMetrics: ${metricText}. Analyze these vectors and deliver 3 bespoke holographic insights for our user Denzuko.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const outputText = response.text || "";
    try {
      const parsedData = JSON.parse(outputText.trim());
      return res.json(parsedData);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", outputText);
      throw parseError;
    }
  } catch (error: any) {
    console.error("AI Insights Endpoint Error:", error);
    res.status(500).json({ error: error.message || "Failed to parse holographic core insights." });
  }
});

// 2. API: AI Command Center / Copilot Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const ai = getAiClient();

    if (!ai) {
      // Fallback response list
      const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
      let replyContent = "Halo Denzuko! Aku asisten belajarmu di Nexora. Bagaimana rencana belajarmu hari ini? Ada tugas atau PR SMA yang ingin kita selesaikan?";
      
      if (lastMessage.includes("break") || lastMessage.includes("tired") || lastMessage.includes("burnout") || lastMessage.includes("lelah") || lastMessage.includes("istirahat") || lastMessage.includes("pusing")) {
        replyContent = "Sepertinya kamu mulai lelah. Aku sangat menyarankan kamu untuk mengambil istirahat sejenak ('Belajar Santai'). Mau diputar audio rintik hujan agar pikiran lebih tenang selama 5 menit?";
      } else if (lastMessage.includes("task") || lastMessage.includes("create") || lastMessage.includes("todo") || lastMessage.includes("tugas") || lastMessage.includes("kerja") || lastMessage.includes("pr")) {
        replyContent = "Siap, daftar tugas belajarmu sudah diperbarui di dashboard. Jangan lupa selesaikan satu-satu biar belajarmu terasa lebih ringan!";
      } else if (lastMessage.includes("focus") || lastMessage.includes("study") || lastMessage.includes("timer") || lastMessage.includes("fokus") || lastMessage.includes("belajar")) {
        replyContent = "Yuk, kita mulai sesi belajarnya! Kamu bisa pilih 'Sesi Maksimal' untuk konsentrasi penuh tanpa gangguan, atau 'Belajar Santai' jika ingin ada jeda istirahat berkala.";
      }
      
      return res.json({
        reply: replyContent,
        timestamp: new Date().toISOString()
      });
    }

    const conversationHistory = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are 'NEXORA CORESYNC', the helpful and friendly AI study companion of Nexora Productivity App. You chat directly with the user, 'Denzuko', an Indonesian high school student.
CRITICAL: You must always respond in Indonesian (Bahasa Indonesia) in a polite, friendly, warm, and highly supportive manner, like a smart high school peer or a helpful tutor.
Avoid robotic tech-larp, sci-fi jargon, or overly academic/dry grammar. Speak with clean, simple, and practical Indonesian.
Keep your responses brief (2-3 sentences max per response) to fit within sleek display panels. Encourage the student, answer their questions about study, schedules, mapel topics (like Matematika, Statistika, Biologi, Geografi, Perubahan Iklim), and school homework directly with simple examples. Always address the user as 'Denzuko'.`;

    // Initialize chat session
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
      }
    });

    // Provide the chat session with previous history and send the latest message
    // To feed the history, we set the messages on the model or we can pass them in the conversation wrapper
    // Since ai.chats.create does not take previous history array easily through standard params in the simplified example,
    // we can formulate it directly or make a generateContent call with the thread embedded.
    // Let's make an automated thread contents call which is simpler and extremely reliable:
    const contents = [
      { role: "user", parts: [{ text: "Initialize voice interface. Identify user." }] },
      { role: "model", parts: [{ text: "Nexora Core Sync loaded. Greetings, Denzuko. System matrix is synchronized. Awaiting input." }] }
    ];

    // Append history
    messages.forEach((m: any) => {
      contents.push({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }]
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
      }
    });

    res.json({
      reply: response.text,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("AI Chat Endpoint Error:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI core." });
  }
});

// Serve Frontend App
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Middleware via Vite
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Static Asset Server
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[NEXORA CORE] Operating system active in sandbox on port ${PORT}`);
  });
}

startServer();
