import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrainCircuit, 
  Sparkles, 
  Database, 
  Send, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Flame, 
  Compass, 
  ChevronRight,
  TrendingUp,
  RotateCw,
  Heart
} from "lucide-react";
import { Task, AiInsight, AiChatMessage, ProductivityLevelName } from "../types";

interface InsightSystemProps {
  tasks: Task[];
  productivityMode: ProductivityLevelName;
  setProductivityMode: (mode: ProductivityLevelName) => void;
}

export default function InsightSystem({ tasks, productivityMode, setProductivityMode }: InsightSystemProps) {
  const [insights, setInsights] = useState<AiInsight[]>([
    {
      id: "insight-default-1",
      title: "Pengelompokan Waktu Belajar SMA",
      category: "Deep Focus",
      impact: "Sangat Disarankan",
      description: "Daftar tugas Anda menunjukkan bab Matematika Statistika butuh fokus tinggi. Sebaiknya cicil bab ini dalam sesi fokus 45 menit tanpa HP agar cepat selesai.",
      recommendation: "Mulai Sesi Fokus 'Sesi Maksimal' selama 45 menit."
    },
    {
      id: "insight-default-2",
      title: "Penyelarasan Waktu Produktif",
      category: "Stable Flow",
      impact: "Saran Optimal",
      description: "Durasi belajar Anda hari ini sudah seimbang dan teratur. Pertahankan momentum menyicil tugas seperti ini agar tidak menumpuk.",
      recommendation: "Gunakan jeda istirahat 'Belajar Santai' di sesi berikutnya."
    },
    {
      id: "insight-default-3",
      title: "Peringatan Capek / Jenuh Belajar",
      category: "Burnout Risk",
      impact: "Penting",
      description: "Dengan beberapa draf PR sekolah mepet deadline dalam waktu dekat, tingkat kelelahan belajar Anda diproyeksikan akan melonjak.",
      recommendation: "Rehat 5 sampai 10 menit terlebih dahulu demi kesehatan pikiran."
    }
  ]);

  const [insightSummary, setInsightSummary] = useState("Kondisi belajar terkalibrasi secara optimal. Sistem AI menyarankan pengerjaan PR terdekat.");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const [chatHistory, setChatHistory] = useState<AiChatMessage[]>([
    {
      role: "model",
      content: "Halo Denzuko! Aku asisten belajarmu di Nexora CoreSync. Aku telah menganalisis sisa tugas sekolahmu hari ini. Mau mulai sesi belajar bersama?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Handle Synap Core analysis (Real server-side API call proxying Gemini)
  const triggerCoreAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tasks,
          focusMetrics: {
            productivityState: productivityMode,
            unfinishedCount: tasks.filter(t => t.status !== "done").length,
            timeCaptured: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error("Failed to calibrate insights Core");
      }

      const data = await response.json();
      if (data.insights && Array.isArray(data.insights)) {
        setInsights(data.insights);
      }
      if (data.summary) {
        setInsightSummary(data.summary);
      }
    } catch (e) {
      console.error(e);
      // Fallback on error is already handled by our solid mock data
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle Chat messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const userMessage: AiChatMessage = {
      role: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setChatHistory(prev => [...prev, userMessage]);
    const currentQuery = userQuery;
    setUserQuery("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Pass the latest messages for conversation history
          messages: [...chatHistory, userMessage].slice(-6).map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Chat connection failure");
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, {
        role: "model",
        content: data.reply || "Pesan diterima, Denzuko. Aku sedang memikirkan solusi terbaik untukmu.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch (error) {
      console.error(error);
      // Fallback response list in client case
      setTimeout(() => {
        setChatHistory(prev => [...prev, {
          role: "model",
          content: "Koneksi luring aktif. Aku menyarankan kamu membagi tugas besar menjadi sesi belajar 25 menit. Istirahat sejenak dlu ya biar ga pusing.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }]);
      }, 800);
    } finally {
      setIsTyping(false);
    }
  };

  const getImpactColor = (impact: string) => {
    const imp = impact.toLowerCase();
    if (imp.includes("high") || imp.includes("alert") || imp.includes("risk") || imp.includes("kritis") || imp.includes("tinggi")) return "text-rose-400 border-rose-500/20 bg-rose-500/5";
    if (imp.includes("warn") || imp.includes("sedang")) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-indigo-400 border-indigo-500/20 bg-indigo-500/5";
  };

  const levels: { name: ProductivityLevelName; desc: string; icon: any; color: string; border: string; bg: string }[] = [
    { name: "Deep Focus", desc: "Konsentrasi penuh aktif, semua suara bising luar diredam otomatis.", icon: Cpu, color: "text-teal-400", border: "border-teal-500/20", bg: "bg-teal-500/5" },
    { name: "Stable Flow", desc: "Keseimbangan konsentrasi stabil, cocok untuk mencicil materi tugas.", icon: Activity, color: "text-cyan-400", border: "border-cyan-500/20", bg: "bg-cyan-500/5" },
    { name: "Peak Session", desc: "Sedang belajar keras dengan pemahaman logika cepat.", icon: Sparkles, color: "text-purple-400", border: "border-purple-500/20", bg: "bg-purple-500/5" },
    { name: "Burnout Risk", desc: "Kamu sedang kelelahan. Waktunya istirahat minum air putih.", icon: Flame, color: "text-rose-500", border: "border-rose-500/20", bg: "bg-rose-500/5" },
  ];

  const levelsMap: Record<ProductivityLevelName, string> = {
    "Deep Focus": "Sesi Maksimal",
    "Stable Flow": "Belajar Santai",
    "Peak Session": "Belajar Keras",
    "Burnout Risk": "Butuh Istirahat"
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full select-none" id="nexora-insights-system">
      {/* 1. Left Section: Productivity Level Selector & AI holographic suggestions - 7 Columns */}
      <div className="xl:col-span-7 flex flex-col gap-6">
        {/* Core Calibration Panel */}
        <div className="p-5 bg-black/25 border border-white/5 rounded-2xl relative overflow-hidden flex flex-col gap-4">
          <div className="absolute right-4 top-4 opacity-10 animate-spin" style={{ animationDuration: "20s" }}>
            <Database className="w-16 h-16 text-teal-400" />
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">Metode Belajar Sekitarmu</h3>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-sans max-w-xl">
            Atur suasana belajarmu dengan mode penunjang fokus dan suara latar yang menenangkan. Pilih status belajarmu sekarang untuk melacak grafik aktivitas harian.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
            {levels.map((lvl) => {
              const Icon = lvl.icon;
              const isSelected = productivityMode === lvl.name;
              return (
                <button
                  key={lvl.name}
                  onClick={() => setProductivityMode(lvl.name)}
                  className={`p-4 rounded-xl text-left flex gap-3 transition-all cursor-pointer select-none border ${
                    isSelected 
                      ? `${lvl.color} bg-white/5 border-current shadow-[0_0_15px_rgba(20,184,166,0.1)]`
                      : "bg-neutral-900/40 border-white/5 hover:border-white/15 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-white/5 " + lvl.color : "bg-neutral-950 text-neutral-600"}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold uppercase tracking-wide">{levelsMap[lvl.name]}</span>
                    <span className="text-[10px] text-neutral-500 leading-normal font-mono">{lvl.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations Dashboard */}
        <div className="flex flex-col gap-4 p-5 bg-black/25 border border-white/5 rounded-2xl relative">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-300 font-bold">Saran & Rekomendasi Belajar AI</h3>
            </div>
            
            <button
              onClick={triggerCoreAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/15 text-teal-400 disabled:opacity-40 border border-teal-500/25 rounded-lg text-[10px] tracking-widest font-mono uppercase transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              {isAnalyzing ? "Menganalisis..." : "Kalibrasi Ulang AI"}
            </button>
          </div>

          <div className="p-3 bg-teal-500/5 text-teal-300 rounded-lg border border-teal-500/15 text-[11px] font-mono leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4.5 h-4.5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold uppercase tracking-wider text-teal-200">Rangkuman Solusi:</span> {insightSummary}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-1">
            <AnimatePresence mode="popLayout">
              {insights.map((ins, i) => (
                <motion.div
                  key={ins.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-neutral-900/40 border border-white/5 rounded-xl flex flex-col gap-2 hover:border-white/10 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white uppercase tracking-wide group-hover:text-teal-300 transition-colors">
                      {ins.title}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${getImpactColor(ins.impact)}`}>
                      {ins.impact} ({ins.category === "Deep Focus" ? "Sesi Maksimal" : ins.category === "Stable Flow" ? "Belajar Santai" : ins.category === "Peak Session" ? "Belajar Keras" : "Butuh Istirahat"})
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans select-text">
                    {ins.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-teal-400/80">
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="uppercase text-[9px] tracking-wider text-neutral-500">REKOMENDASI:</span>
                    <span className="text-teal-400 select-text">{ins.recommendation}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 2. Right Section: Central Copilot Chat interface - 5 Columns */}
      <div className="xl:col-span-5 flex flex-col h-[600px] border border-white/5 bg-black/30 backdrop-blur-md rounded-2xl relative overflow-hidden">
        {/* Chat Header */}
        <div className="p-4.5 border-b border-white/5 bg-neutral-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 relative">
              <BrainCircuit className="w-4 h-4 text-teal-400 animate-pulse" />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-neutral-950" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-100 font-mono">Nexora Core Sync</h4>
              <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mt-0.5">Asisten AI Gemini 3.5</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-400/80 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/25">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>TERENKRIPSI</span>
          </div>
        </div>

        {/* Message Logs */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 max-h-[460px]">
          {chatHistory.map((msg, i) => {
            const isModel = msg.role === "model";
            return (
              <div
                key={i}
                className={`flex flex-col gap-1.5 max-w-[85%] ${isModel ? "self-start" : "self-end items-end"}`}
              >
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-neutral-500 uppercase tracking-wide">
                  <span>{isModel ? "CoreSync AI" : "Denzuko"}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-2xl leading-relaxed text-xs uppercase font-mono tracking-wide select-text ${
                    isModel 
                      ? "bg-neutral-900/60 text-teal-300/90 border border-white/5 rounded-tl-sm font-light leading-normal"
                      : "bg-teal-500/10 text-white border border-teal-500/20 rounded-tr-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          
          {isTyping && (
            <div className="flex flex-col gap-1.5 max-w-[80%] self-start">
              <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-wide font-light">Inti AI sedang memproses...</span>
              <div className="p-3 bg-neutral-900/40 border border-white/5 rounded-2xl rounded-tl-sm text-teal-400">
                <div className="flex gap-1 items-center py-1 px-1.5">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-neutral-950/20 flex gap-2">
          <input
            type="text"
            placeholder="Tanyakan materi tugas, teknik belajar, atau topik PR SMA-mu di sini..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            disabled={isTyping}
            className="flex-1 bg-neutral-950 border border-white/5 rounded-xl px-3.5 text-xs text-white uppercase font-mono outline-none focus:border-teal-500/50 transition-all disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={isTyping || !userQuery.trim()}
            className="w-10 h-10 shrink-0 bg-gradient-to-tr from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none rounded-xl text-neutral-950 flex items-center justify-center transition-all cursor-pointer shadow-[0_0_12px_rgba(20,184,166,0.15)]"
          >
            <Send className="w-4 h-4 text-neutral-950" />
          </button>
        </form>
      </div>
    </div>
  );
}
export type { AiInsight, AiChatMessage };
