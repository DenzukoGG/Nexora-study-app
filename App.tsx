import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Grid, 
  BarChart3, 
  BrainCircuit, 
  Target, 
  Settings, 
  Radio, 
  Clock, 
  X,
  Menu,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  ListTodo,
  Notebook
} from "lucide-react";
import { Task, ProductivityLevelName, FocusSession, SystemNotification, ProductivityMetric } from "./types";
import BootSequence from "./components/BootSequence";
import Sidebar from "./components/Sidebar";
import TaskSystem from "./components/TaskSystem";
import InsightSystem from "./components/InsightSystem";
import NotesSystem from "./components/NotesSystem";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [productivityMode, setProductivityMode] = useState<ProductivityLevelName>("Stable Flow");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Tasks initialized with simple high school homework items
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "t-1",
      title: "PR Soal Statistika & Ukuran Pemusatan Data",
      priority: "high",
      status: "todo",
      category: "Matematika",
      deadlineRelative: "Sisa 2 jam",
      deadlineDate: "13:00",
      cognitiveLoad: 75
    },
    {
      id: "t-2",
      title: "Makalah Analisis Dampak Perubahan Iklim Global",
      priority: "medium",
      status: "progress",
      category: "Sains & IPA",
      deadlineRelative: "Batas besok pagi",
      deadlineDate: "Besok",
      cognitiveLoad: 60
    },
    {
      id: "t-3",
      title: "Draf Proposal Makalah Penelitian Sosiologi",
      priority: "high",
      status: "todo",
      category: "Bahasa & IPS",
      deadlineRelative: "Sisa 3 hari",
      deadlineDate: "3 hari",
      cognitiveLoad: 80
    }
  ]);

  // Clock state
  const [timeText, setTimeText] = useState("12:00:00");
  const [dateText, setDateText] = useState("KAMIS, 28 MEI");

  // Timer Focus Cockpit states
  const [focusTime, setFocusTime] = useState(25 * 60); // 25 mins in seconds
  const [focusMaxTime, setFocusMaxTime] = useState(25 * 60);
  const [isFocusActive, setIsFocusActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientSound, setAmbientSound] = useState<"drone" | "rain" | "waves" | "none">("none");
  const [stats, setStats] = useState<ProductivityMetric[]>([
    { dayName: "SEN", focusHours: 4.5, completedTasksCount: 3, cognitiveLoadAverage: 55 },
    { dayName: "SEL", focusHours: 6.2, completedTasksCount: 5, cognitiveLoadAverage: 72 },
    { dayName: "RAB", focusHours: 3.8, completedTasksCount: 2, cognitiveLoadAverage: 45 },
    { dayName: "KAM", focusHours: 7.0, completedTasksCount: 6, cognitiveLoadAverage: 65 },
    { dayName: "JUM", focusHours: 5.1, completedTasksCount: 4, cognitiveLoadAverage: 60 },
    { dayName: "SAB", focusHours: 2.5, completedTasksCount: 1, cognitiveLoadAverage: 30 },
    { dayName: "MIN", focusHours: 4.8, completedTasksCount: 3, cognitiveLoadAverage: 48 },
  ]);

  // Notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: "n-1", type: "warning", message: "2 tenggatan beban tinggi tertunda di backlog.", timestamp: "11:30", read: false },
    { id: "n-2", type: "success", message: "Koneksi sinaptik Denzuko terkalibrasi sempurna.", timestamp: "11:00", read: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulated live telemetry state
  const [telemetry, setTelemetry] = useState({
    cpu: 14,
    mem: 4.2,
    net: 2.1
  });

  useEffect(() => {
    // Dynamic timer
    const clockInterval = setInterval(() => {
      const now = new Date();
      setTimeText(now.toLocaleTimeString([], { hour12: false }));
      setDateText(now.toLocaleDateString("id-ID", { weekday: "long", month: "short", day: "numeric" }).toUpperCase());
      
      // Randomly fluctuate telemetry a bit for futuristic effect
      setTelemetry(prev => ({
        cpu: Math.max(8, Math.min(65, prev.cpu + Math.floor(Math.random() * 7) - 3)),
        mem: Math.max(3.8, Math.min(7.9, Number((prev.mem + (Math.random() * 0.2 - 0.1)).toFixed(1)))),
        net: Math.max(1.1, Math.min(4.8, Number((prev.net + (Math.random() * 0.4 - 0.2)).toFixed(1))))
      }));
    }, 1000);

    return () => clearInterval(clockInterval);
  }, []);

  // Countdown timer for focus mode
  useEffect(() => {
    let focusInterval: NodeJS.Timeout;
    if (isFocusActive && focusTime > 0) {
      focusInterval = setInterval(() => {
        setFocusTime(prev => {
          if (prev <= 1) {
            setIsFocusActive(false);
            // Push completion notification
            setNotifications(p => [
              { id: `n-${Date.now()}`, type: "success", message: "Sesi Fokus Selesai. Ambil waktu istirahat sejenak.", timestamp: "Sekarang", read: false },
              ...p
            ]);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(focusInterval);
  }, [isFocusActive, focusTime]);

  const toggleFocusTimer = () => {
    setIsFocusActive(!isFocusActive);
  };

  const resetFocusTimer = (minutes: number = 25) => {
    setIsFocusActive(false);
    setFocusTime(minutes * 60);
    setFocusMaxTime(minutes * 60);
  };

  const formatTimerName = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  if (booting) {
    return <BootSequence onComplete={() => setBooting(false)} />;
  }

  // Calculate stats values
  const activeTasksCount = tasks.filter(t => t.status !== "done").length;
  const highPriorityTasksCount = tasks.filter(t => t.status !== "done" && t.priority === "high").length;

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-cyan-500/30 overflow-x-hidden relative flex flex-col" id="nexora-main-root">
      
      {/* 1. Ambient visual atmosphere system: moving particles & radial gradients matching the "Frosted Glass" design theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[50%] h-[50%] bg-cyan-700/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-purple-900/15 rounded-full blur-[160px] animate-pulse" style={{ animationDuration: "18s" }} />
        <div className="absolute top-[25%] right-[12%] w-[25%] h-[25%] bg-blue-500/5 rounded-full blur-[110px]" />
        
        {/* Fine grain overlay base64 */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-[0.16]" />
      </div>

      {/* 2. Top Navigation header (Glassmorphic) */}
      <nav className="sticky top-0 h-14 border-b border-white/10 backdrop-blur-xl bg-neutral-950/80 px-4 sm:px-6 flex items-center justify-between z-50 select-none">
        <div className="flex items-center gap-2 sm:gap-8">
          {/* Hamburger Menu button on mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center justify-center mr-1"
            title="Buka Menu Navigasi"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
          </button>

          <div className="flex items-center gap-2 px-1 py-0.5 cursor-pointer hover:opacity-90" onClick={() => { setActiveSection("dashboard"); setIsSidebarOpen(false); }}>
            <div className="w-5 h-5 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.35)] shrink-0">
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
            <span className="text-xs font-bold tracking-[0.25em] uppercase text-white font-mono ml-1">Nexora OS</span>
          </div>

          <div className="h-4 w-[1px] bg-white/10 hidden lg:block" />
          
          <div className="hidden lg:flex gap-6 text-[10px] font-medium uppercase tracking-widest font-mono">
            <button 
              onClick={() => setActiveSection("dashboard")}
              className={`transition-colors cursor-pointer outline-none ${activeSection === "dashboard" ? "text-cyan-400" : "text-white/40 hover:text-white"}`}
            >
              Dasbor Sistem
            </button>
            <button 
              onClick={() => setActiveSection("analytics")}
              className={`transition-colors cursor-pointer outline-none ${activeSection === "analytics" ? "text-cyan-400" : "text-white/40 hover:text-white"}`}
            >
              Matriks Intelijensi
            </button>
            <button 
              onClick={() => setActiveSection("assistant")}
              className={`transition-colors cursor-pointer outline-none ${activeSection === "assistant" ? "text-cyan-400" : "text-white/40 hover:text-white"}`}
            >
              AI Kopilot
            </button>
            <button 
              onClick={() => setActiveSection("focus")}
              className={`transition-colors cursor-pointer outline-none ${activeSection === "focus" ? "text-cyan-400" : "text-white/40 hover:text-white"}`}
            >
              Kokpit Fokus
            </button>
          </div>
        </div>

        <div className="flex items-center gap-5 font-mono text-[11px]">
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1 px-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/25 active:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10px]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>NOTIFIKASI ({notifications.length})</span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2.5 w-80 bg-neutral-900/95 border border-white/10 rounded-xl p-4.5 shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Catatan Taktis</span>
                    <button onClick={handleClearNotifications} className="text-[9px] uppercase hover:text-rose-400 cursor-pointer text-neutral-500">
                      Bersihkan
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-neutral-600 text-[10px] uppercase tracking-wider">
                        Semua saluran aman terkontrol
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div key={notif.id} className="p-2.5 rounded-lg bg-neutral-950/50 border border-white/5 text-[10px] leading-relaxed flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] uppercase tracking-wider ${notif.type === "warning" ? "text-amber-400" : "text-teal-400"}`}>
                              • {notif.type === "warning" ? "Peringatan" : "Sukses"}
                            </span>
                            <span className="text-neutral-500 text-[8px]">{notif.timestamp}</span>
                          </div>
                          <p className="text-neutral-300 capitalize">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <div className="text-white/50 text-[10px] tracking-widest uppercase">STABIL // SECURE_L1</div>
          </div>

          {/* User badge */}
          <div className="flex items-center gap-3 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest font-mono">Denzuko</span>
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-600 border border-white/20 flex items-center justify-center shadow-inner">
              <span className="text-[8px] text-white font-bold">DZ</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Main Workspace Area (Sidebar + Responsive dashboard) */}
      <div className="flex-1 flex flex-col lg:flex-row relative z-40">
        
        {/* Mobile sidebar backdrop overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden cursor-pointer"
            />
          )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          productivityMode={productivityMode}
          tasks={tasks}
          onTriggerBoot={() => setBooting(true)}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic Screen view container */}
        <main className="flex-grow p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto max-w-full">
          
          {/* Dashboard Header Banner with personalized welcome */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400 uppercase font-semibold">
                APLIKASI PENGINGAT TUGAS & FOKUS BELAJAR
              </span>
              <h1 className="text-4xl font-light text-white tracking-tight mt-1.5">
                Selamat Malam, <span className="font-medium text-cyan-400">Denzuko.</span>
              </h1>
              <p className="text-white/40 text-[11px] font-mono mt-1.5 tracking-wider uppercase flex items-center gap-2">
                <span>Kondisi Pikiran:</span>
                <span className="text-green-400 font-semibold">{productivityMode === "Burnout Risk" ? "SANGAT LELAH (BUTUH ISTIRAHAT)" : "OPTIMAL"}</span>
                <span>•</span>
                <span className="text-teal-300">{activeTasksCount} Tugas Belum Selesai</span>
                {highPriorityTasksCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-rose-400 animate-pulse font-semibold">{highPriorityTasksCount} TUGAS MEPEET DEADLINE!</span>
                  </>
                )}
              </p>
            </div>
            
            {/* Quick action controls */}
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveSection("focus")}
                className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer font-mono"
              >
                Buka Kokpit
              </button>
              <button 
                onClick={() => setActiveSection("assistant")}
                className="px-4 py-2 border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-colors cursor-pointer font-mono"
              >
                Konsultasi AI
              </button>
            </div>
          </div>

          <div className="flex-grow">
            <AnimatePresence mode="wait">
              {activeSection === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  {/* Dashboard Row 1: Deadlines and Target Metric */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Next Deadlines Cards inside Frosted Glass theme */}
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-cyan-400/60 uppercase">
                        Mepet Deadline
                      </div>
                      <h2 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 font-mono">
                        PR & TUGAS SEKOLAH SEGERA DIKUMPULKAN
                      </h2>

                      <div className="space-y-3.5">
                        {tasks.filter(t => t.status !== "done").map((t) => (
                          <div key={t.id} className="flex items-start gap-4 p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl transition-all group">
                            <div className={`w-8 h-8 rounded-lg ${t.priority === "high" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" : "bg-white/5 border-white/10 text-white/60"} border flex items-center justify-center shrink-0`}>
                              <span className="text-xs font-bold font-mono">{t.cognitiveLoad}%</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors uppercase font-sans tracking-wide">
                                {t.title}
                              </div>
                              <div className="text-[10px] text-white/40 mt-1 font-mono uppercase flex items-center gap-2">
                                <span>MAPEL: {t.category}</span>
                                <span>•</span>
                                <span className={t.priority === "high" ? "text-rose-400 font-bold animate-pulse" : ""}>BATAS: {t.deadlineRelative}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Flow State Target Panel */}
                    <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-50" />
                      
                      <div className="relative z-10 flex flex-col gap-4">
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest font-mono">
                          Aliran Telemetri Utama
                        </div>
                        <div>
                          <div className="text-2xl font-light text-white uppercase tracking-wide">
                            Matriks {productivityMode === "Deep Focus" ? "Fokus Mendalam" : productivityMode === "Stable Flow" ? "Aliran Stabil" : productivityMode === "Peak Session" ? "Sesi Puncak" : "Risiko Kelelahan"}
                          </div>
                          <p className="text-neutral-400 text-xs mt-1 lowercase font-mono">
                            bandwidth optimal yang disesuaikan dengan zona kognitif terpilih.
                          </p>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden p-[1px]">
                            <motion.div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" 
                              animate={{ width: productivityMode === "Deep Focus" ? "92%" : productivityMode === "Stable Flow" ? "76%" : productivityMode === "Peak Session" ? "98%" : "42%" }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-cyan-400">
                            {productivityMode === "Deep Focus" && "92%"}
                            {productivityMode === "Stable Flow" && "76%"}
                            {productivityMode === "Peak Session" && "98%"}
                            {productivityMode === "Burnout Risk" && "42%"}
                          </span>
                        </div>
                        
                        {/* Interactive mini widget metrics */}
                        <div className="grid grid-cols-2 gap-3 mt-1.5">
                          <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 font-mono">
                            <div className="text-[8px] text-white/40 uppercase tracking-wider">Detak Jantung</div>
                            <div className="text-sm text-white font-medium mt-0.5">
                              {productivityMode === "Deep Focus" ? "68 BPM" : "74 BPM"}
                            </div>
                          </div>
                          <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 font-mono">
                            <div className="text-[8px] text-white/40 uppercase tracking-wider">Durasi Fokus</div>
                            <div className="text-sm text-white font-medium mt-0.5">4j 12m</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Interactive Task board */}
                  <TaskSystem tasks={tasks} setTasks={setTasks} />

                  {/* Catatan Pelajaran & Rumus Terintegrasi */}
                  <div className="border-t border-white/5 pt-8 mt-4">
                    <NotesSystem />
                  </div>
                </motion.div>
              )}

              {activeSection === "analytics" && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6 animate-fade-in"
                >
                  <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[8px] font-bold uppercase tracking-widest rounded font-mono">
                        Matriks Kuantum
                      </span>
                    </div>

                    <h2 className="text-sm font-semibold text-white/80 uppercase tracking-widest mb-6 font-mono">
                      Matriks Kecerdasan Produktivitas
                    </h2>

                    {/* Highly stylized custom vector chart displaying daily data */}
                    <div className="h-[240px] flex items-end justify-between px-4 mt-8 relative">
                      {/* Grid background reference lines */}
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-white/[0.03] pointer-events-none" />
                      <div className="absolute inset-x-0 top-1/4 h-[1px] bg-white/[0.03] pointer-events-none" />
                      <div className="absolute inset-x-0 top-2/4 h-[1px] bg-white/[0.03] pointer-events-none" />
                      <div className="absolute inset-x-0 top-3/4 h-[1px] bg-white/[0.03] pointer-events-none" />

                      {stats.map((day, i) => {
                        const barHeight = `${(day.focusHours / 8) * 100}%`;
                        const isCurrentDay = day.dayName === "THU";
                        return (
                          <div key={day.dayName} className="flex flex-col items-center gap-3 w-16 group z-10">
                            <span className="text-[10px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 border border-teal-500/25 px-1.5 py-0.5 rounded -mt-6">
                              {day.focusHours}h
                            </span>
                            
                            <div className="w-8 sm:w-10 bg-neutral-950 rounded-lg relative overflow-hidden border border-white/5 h-[160px] flex items-end">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: barHeight }}
                                transition={{ delay: i * 0.08, duration: 0.6 }}
                                className={`w-full rounded-b-lg bg-gradient-to-t ${
                                  isCurrentDay 
                                    ? "from-cyan-500 to-purple-500 border-t-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                                    : "from-cyan-900/40 to-cyan-500/30 group-hover:to-cyan-400/40"
                                }`}
                              />
                            </div>
                            
                            <span className={`text-[10px] font-mono tracking-wider ${isCurrentDay ? "text-cyan-400 font-bold" : "text-white/40"}`}>
                              {day.dayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Achievements Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-6 relative overflow-hidden shadow-lg">
                      <div className="absolute -right-6 -bottom-6 opacity-5">
                        <Sparkles className="w-32 h-32 text-cyan-400" />
                      </div>
                      
                      <div className="w-14 h-14 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.25)] animate-spin" style={{ animationDuration: "12s" }}>
                        <span className="text-sm font-bold text-white font-mono animate-none">14</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                          Pencapaian Fokus Sinaptik
                        </h3>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter font-mono">
                          Streak mingguan: 5 hari / Top 3% Pengembang Inti Global
                        </p>
                        <div className="flex gap-1.5 mt-3">
                          <div className="w-5 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                          <div className="w-5 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                          <div className="w-5 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
                          <div className="w-5 h-1 bg-purple-500 rounded-full" />
                          <div className="w-5 h-1 bg-white/10 rounded-full" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-950/25 border border-purple-500/20 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden shadow-lg">
                      <div className="absolute right-4 top-4 text-purple-400/30 font-mono text-[9px] uppercase tracking-widest">
                        Peringatan Inti
                      </div>
                      <div className="text-[9px] font-bold text-purple-400 uppercase tracking-widest font-mono">
                        Saran Optimalisasi Saraf
                      </div>
                      <div className="text-xs text-stone-200 mt-2 font-mono leading-relaxed">
                        Sinkronisasi kafein disarankan dalam waktu 15 menit untuk persiapan tugas berat yang akan datang.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "assistant" && (
                <motion.div
                  key="assistant"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <InsightSystem 
                    tasks={tasks} 
                    productivityMode={productivityMode} 
                    setProductivityMode={setProductivityMode} 
                  />
                </motion.div>
              )}

              {activeSection === "focus" && (
                <motion.div
                  key="focus"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center justify-center p-2 lg:p-8 max-w-4xl mx-auto w-full font-mono relative"
                >
                  {/* Outer glowing focus ring */}
                  <div className="relative w-full bg-white/[0.02] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 flex flex-col items-center gap-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5" />
                    
                    <div className="w-full flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-200">
                          MODE FOKUS ISOLASI STASIUN KERJA SINAPTIK AKTIF
                        </h3>
                      </div>
                      <div className="flex gap-2 text-[10px]">
                        <button
                          onClick={() => resetFocusTimer(25)}
                          className="px-2.5 py-1 rounded bg-white/5 text-neutral-400 border border-white/5 hover:text-white hover:border-white/10"
                        >
                          25M
                        </button>
                        <button
                          onClick={() => resetFocusTimer(50)}
                          className="px-2.5 py-1 rounded bg-white/5 text-neutral-400 border border-white/5 hover:text-white hover:border-white/10"
                        >
                          50M
                        </button>
                        <button
                          onClick={() => resetFocusTimer(15)}
                          className="px-2.5 py-1 rounded bg-white/5 text-neutral-400 border border-white/5 hover:text-white hover:border-white/10"
                        >
                          15M (Sprint)
                        </button>
                      </div>
                    </div>

                    {/* Cinematic Radial Timer visualization */}
                    <div className="relative w-72 h-72 flex items-center justify-center my-6">
                      
                      {/* Gradient glow bg */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 blur-xl -z-10" />

                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        {/* Static track */}
                        <circle
                          cx="144"
                          cy="144"
                          r="128"
                          className="stroke-white/5 fill-none"
                          strokeWidth="2.5"
                        />
                        {/* Dynamic track */}
                        <motion.circle
                          cx="144"
                          cy="144"
                          r="128"
                          className="stroke-cyan-400 fill-none"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          animate={{ strokeDasharray: 2 * Math.PI * 128 }}
                          style={{
                            strokeDashoffset: (2 * Math.PI * 128) * (1 - (focusTime / focusMaxTime)),
                            filter: "drop-shadow(0px 0px 8px #2dd4bf)"
                          }}
                        />
                      </svg>

                      {/* Display Numbers */}
                      <div className="text-center flex flex-col items-center justify-center z-15 select-all">
                        <span className="text-5xl font-light text-white tracking-widest mb-1 select-all font-mono">
                          {formatTimerName(focusTime)}
                        </span>
                        <span className="text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
                          TARGET TEMPORAL SINAPSIS
                        </span>
                      </div>
                    </div>

                    {/* Cockpit Core controls */}
                    <div className="flex gap-4 relative z-10 w-full max-w-sm justify-center">
                      <button
                        onClick={toggleFocusTimer}
                        className={`flex-1 py-3 px-6 rounded-xl font-bold font-mono tracking-widest text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          isFocusActive
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                            : "bg-teal-400 text-neutral-950 hover:bg-cyan-400 hover:scale-[1.01] shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                        }`}
                      >
                        {isFocusActive ? (
                          <>
                            <Pause className="w-4 h-4 text-current" />
                            Jeda Isolasi
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current text-current" />
                            MULAI MODE ISOLASI
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => resetFocusTimer(focusMaxTime / 60)}
                        className="p-3 w-12 bg-white/5 border border-white/5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Integrated cognitive block generator: Soundscapes block */}
                    <div className="w-full mt-4 flex flex-col gap-3 font-mono text-[10px] uppercase border-t border-white/5 pt-6 text-center select-none relative z-10">
                      <span className="text-neutral-500 tracking-widest font-bold">
                        Stimulasi Gelombang Otak Akustik
                      </span>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-1">
                        {[
                          { id: "none", label: "Hening Sunyi" },
                          { id: "drone", label: "Berdengung Kosmik" },
                          { id: "rain", label: "Ketukan Alfa" },
                          { id: "waves", label: "Resonansi Kuantum" }
                        ].map((sound) => (
                          <button
                            key={sound.id}
                            onClick={() => setAmbientSound(sound.id as any)}
                            className={`p-2.5 rounded-lg border text-[9px] uppercase tracking-wider text-center cursor-pointer transition-all ${
                              ambientSound === sound.id
                                ? "bg-cyan-500/10 text-cyan-400 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.15)]"
                                : "bg-neutral-950 border-white/5 text-neutral-400 hover:text-neutral-200"
                            }`}
                          >
                            {sound.label}
                          </button>
                        ))}
                      </div>

                      {/* Display playing sound bar animation if timer is active and sound selected */}
                      {ambientSound !== "none" && isFocusActive && (
                        <div className="flex items-center justify-center gap-1 mt-3 animate-pulse">
                          <span className="text-teal-400 text-[8px]">MEMANCARKAN SANTAI: FREKUENSI SYNC {ambientSound.toUpperCase()}</span>
                          <div className="flex gap-0.5 ml-2">
                            <span className="w-0.5 h-3 bg-teal-400 rounded animate-[bounce_0.8s_infinite]" />
                            <span className="w-0.5 h-2 bg-teal-400 rounded animate-[bounce_0.8s_infinite_0.2s]" />
                            <span className="w-0.5 h-3 bg-teal-400 rounded animate-[bounce_0.8s_infinite_0.4s]" />
                            <span className="w-0.5 h-1 bg-teal-400 rounded" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-6"
                >
                  <NotesSystem />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* 4. Telemetry Glassmorphic Footer */}
      <footer className="h-10 border-t border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 select-none relative z-50 font-mono text-[9px] tracking-widest text-white/40">
        <div className="flex gap-6 items-center">
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" /> 
            <span>CPU_LOAD: {telemetry.cpu}%</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" /> 
            <span>MEM_POOL: {telemetry.mem}GB</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_#2dd4bf]" /> 
            <span>NET_UP: {telemetry.net}GBPS</span>
          </div>
        </div>
        
        <div className="hidden sm:block uppercase tracking-[0.25em] text-white/25">
          Project Nexora // Protocol V1.0.9-Stable
        </div>
      </footer>
    </div>
  );
}
