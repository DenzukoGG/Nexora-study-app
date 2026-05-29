import { motion } from "motion/react";
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
  Notebook
} from "lucide-react";
import { ProductivityLevelName, Task } from "../types";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  productivityMode: ProductivityLevelName;
  tasks: Task[];
  onTriggerBoot: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  productivityMode,
  tasks,
  onTriggerBoot,
  isOpen = false,
  onClose = () => {}
}: SidebarProps) {
  
  const navItems = [
    { id: "dashboard", label: "Dasbor", icon: Grid, desc: "Daftar Tugas & PR" },
    { id: "analytics", label: "Analitik", icon: BarChart3, desc: "Grafik Waktu Fokus" },
    { id: "assistant", label: "AI Kopilot", icon: BrainCircuit, desc: "Solusi & Tanya Jawab" },
    { id: "focus", label: "Kokpit Fokus", icon: Target, desc: "Timer Belajar Bebas Distraksi" },
    { id: "notes", label: "Catatan PR", icon: Notebook, desc: "Catatan & Rumus Belajar" },
  ];

  // Sidebar Footer System details
  const uncompletedCount = tasks.filter(t => t.status !== "done").length;

  const modeColors: Record<ProductivityLevelName, { bg: string, text: string, border: string, pulse: string, display: string }> = {
    "Deep Focus": {
      bg: "bg-teal-500/10",
      text: "text-teal-400",
      border: "border-teal-500/20",
      pulse: "bg-teal-400",
      display: "Sesi Maksimal"
    },
    "Stable Flow": {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
      pulse: "bg-cyan-400",
      display: "Belajar Santai"
    },
    "Peak Session": {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      pulse: "bg-purple-400",
      display: "Belajar Keras"
    },
    "Burnout Risk": {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/20",
      pulse: "bg-rose-400",
      display: "Butuh Istirahat / Rehat"
    }
  };

  const activeColorSet = modeColors[productivityMode] || modeColors["Stable Flow"];

  return (
    <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 border-r border-white/5 bg-[#090909ee] backdrop-blur-2xl lg:bg-black/40 lg:backdrop-blur-xl flex flex-col p-6 text-white h-screen justify-between select-none shrink-0 transition-transform duration-300 lg:translate-x-0 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
    }`} id="nexora-sidebar">
      {/* Absolute futuristic decoration: holographic accent divider */}
      <div className="absolute right-0 top-1/4 h-24 w-[1px] bg-gradient-to-b from-transparent via-teal-500/40 to-transparent" />
      <div className="absolute right-0 top-2/4 h-16 w-[1px] bg-gradient-to-b from-transparent via-purple-500/30 to-transparent" />

      {/* Brand area */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-3 font-mono">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-teal-400 to-purple-500 opacity-90 p-[1.5px] relative">
              <div className="w-full h-full bg-neutral-950 rounded-[7px] flex items-center justify-center">
                <Radio className="w-4 h-4 text-teal-400 animate-pulse" />
              </div>
              {/* Core active shadow */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-teal-400 to-purple-500 rounded-lg blur-sm opacity-30 -z-10" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-bold tracking-[0.3em] text-white text-base">
                  NEXORA
                </span>
                <span className="text-[8px] bg-teal-500/10 text-teal-400 border border-teal-500/25 rounded px-1 uppercase tracking-widest leading-none font-mono py-0.5">
                  OS
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 font-mono">
                Ruang Belajar Digital
              </p>
            </div>
          </div>

          {/* Close button on mobile overlay */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer border border-white/10 flex items-center justify-center"
            title="Tutup Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Neural Sync Level Indicator */}
        <div className={`p-4 rounded-xl border ${activeColorSet.border} ${activeColorSet.bg} backdrop-blur-md relative overflow-hidden transition-all duration-300`}>
          <div className="absolute right-2 -bottom-4 opacity-10">
            <Layers className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">
              Fokus Konsentrasi
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-teal-400">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Belajar Aktif
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeColorSet.pulse} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeColorSet.pulse}`} />
            </span>
            <span className={`text-sm font-semibold tracking-wide uppercase ${activeColorSet.text}`}>
              {activeColorSet.display}
            </span>
          </div>
          <div className="mt-2 text-[10px] text-neutral-400/80 leading-normal lowercase font-mono">
            {productivityMode === "Deep Focus" && "fokus penuh aktif. semua suara bising luar diredam otomatis."}
            {productivityMode === "Stable Flow" && "keseimbangan konsentrasi stabil. cocok untuk cicil materi."}
            {productivityMode === "Peak Session" && "sedang belajar keras dengan produktivitas tinggi."}
            {productivityMode === "Burnout Risk" && "kamu sedang terlalu lelah. yuk istirahat minum air putih."}
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex flex-col gap-2 mt-4">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono pl-3 mb-2">
            Navigasi Menu
          </span>
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    onClose();
                  }}
                  className={`group w-full text-left items-center flex justify-between p-3.5 rounded-xl cursor-pointer select-none transition-all duration-300 relative ${
                    isActive
                      ? "bg-gradient-to-r from-teal-500/10 to-purple-500/5 text-white border-l-2 border-teal-400 shadow-[inset_1px_0_10px_rgba(20,184,166,0.05)]"
                      : "hover:bg-white/5 text-neutral-400 hover:text-neutral-200 border-l-2 border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3.5 relative">
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                      isActive ? "text-teal-400" : "text-neutral-500 group-hover:text-neutral-300"
                    }`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold tracking-wide capitalize">
                        {item.label}
                      </span>
                      <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-mono mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </div>
                  
                  {item.id === "dashboard" && uncompletedCount > 0 && (
                    <span className="text-[9px] bg-teal-500/10 text-teal-300 border border-teal-500/30 px-1.5 py-0.5 rounded-full font-mono">
                      {uncompletedCount} AKTIF
                    </span>
                  )}

                  {isActive && (
                    <motion.div
                      layoutId="active-glow"
                      className="absolute inset-0 bg-teal-500/5 border border-teal-500/20 -z-10 rounded-xl pointer-events-none"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/5 pt-6 font-mono text-[10px] text-neutral-500">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SISTEM: STABIL
          </span>
          <span className="hover:text-teal-400 transition-colors uppercase cursor-pointer" onClick={onTriggerBoot}>
            [MUAT ULANG]
          </span>
        </div>
        <div className="flex justify-between uppercase">
          <span>USER ID</span>
          <span className="text-neutral-400 truncate w-32 text-right">DENZUKO_STUDENT</span>
        </div>
        <div className="text-[9px] text-neutral-600 text-center uppercase tracking-widest font-light mt-1">
          NEXORA STUDY GRAPH // 2026
        </div>
      </div>
    </div>
  );
}
