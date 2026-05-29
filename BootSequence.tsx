import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, ShieldCheck } from "lucide-react";

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [stage, setStage] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "Memuat modul inti Nexora Workspace...",
    "Mensinkronisasi basis pengetahuan kognitif...",
    "Menghubungkan asisten kecerdasan buatan...",
    "Mengkalibrasi visual antarmuka kaca...",
    "Sistem siap. Mempersiapkan ruang kerja Anda..."
  ];

  // Robust unified single-timer logic
  useEffect(() => {
    let currentProgress = 0;
    let timerId: NodeJS.Timeout;

    // Initialize with first log
    setLogs([bootLogs[0]]);

    timerId = setInterval(() => {
      // Increment progress by a clean random value
      currentProgress += Math.floor(Math.random() * 8) + 6;
      
      if (currentProgress >= 100) {
        currentProgress = 100;
        setProgress(100);
        clearInterval(timerId);

        // Transition to stage 1 (Welcome display)
        setTimeout(() => {
          setStage(1);
        }, 500);
      } else {
        setProgress(currentProgress);
        
        // Show logs based on progress threshold
        const expectedCount = Math.max(
          1,
          Math.min(
            bootLogs.length,
            Math.ceil((currentProgress / 100) * bootLogs.length)
          )
        );
        
        setLogs(bootLogs.slice(0, expectedCount));
      }
    }, 120);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // Handle stage 1 exit to main application view
  useEffect(() => {
    if (stage === 1) {
      const exitTimeout = setTimeout(() => {
        onComplete();
      }, 1000);
      return () => clearTimeout(exitTimeout);
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center text-white z-50 font-sans select-none overflow-hidden" id="nexora-boot">
      {/* Ambient glassmorphic glowing backgrounds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[30%] left-[25%] w-[45%] h-[45%] bg-cyan-500/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-[25%] right-[25%] w-[45%] h-[45%] bg-purple-600/5 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "12s" }} />
      </div>

      <AnimatePresence mode="wait">
        {stage === 0 ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-sm px-6 flex flex-col items-center text-center relative z-10"
          >
            {/* Elegant glowing icon container */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              className="w-11 h-11 bg-white/[0.03] border border-white/10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.03)] mb-5"
            >
              <Compass className="w-5 h-5 text-cyan-400" />
            </motion.div>

            <h1 className="text-xl font-medium tracking-[0.3em] text-white uppercase mb-1 font-sans">
              NEXORA
            </h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] font-mono mb-8">
              RUANG KERJA KOGNITIF PINTAR
            </p>

            {/* Premium minimal diagnostic logs list */}
            <div className="w-full min-h-[140px] bg-white/[0.01] border border-white/5 rounded-xl p-5 mb-8 flex flex-col justify-center gap-3 text-[11px] font-mono text-white/50 tracking-wide text-left backdrop-blur-lg">
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                  <span>{log}</span>
                </motion.div>
              ))}
              {logs.length < bootLogs.length && (
                <div className="flex gap-1 items-center mt-1 pl-4">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1 h-1 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
            </div>

            {/* Micro progress indicator */}
            <div className="w-full flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-[9px] text-white/40 tracking-wider font-mono uppercase">
                <span>Memuat Ekosistem</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 overflow-hidden rounded relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tim Pengembang Kelompok */}
            <div className="mt-8 pt-5 border-t border-white/5 w-full text-center">
              <span className="text-[8px] font-mono tracking-[0.25em] text-cyan-400/80 uppercase block mb-3.5">
                © KELOMPOK PENGEMBANG SYSTEM
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono text-neutral-400 bg-white/[0.01] border border-white/5 rounded-xl p-3">
                <span className="text-left text-neutral-300 hover:text-cyan-300 transition-colors">M. Alfathan Adzanka</span>
                <span className="text-right text-neutral-300 hover:text-cyan-300 transition-colors">Rashif P. Nurjanto</span>
                <span className="text-left text-neutral-300 hover:text-cyan-300 transition-colors">Richy Dwi Ramadhan</span>
                <span className="text-right text-neutral-300 hover:text-cyan-300 transition-colors">Ridho Wijaya Putra</span>
                <span className="text-left text-neutral-300 hover:text-cyan-300 transition-colors">Sam Pandega</span>
                <span className="text-right text-neutral-300 hover:text-cyan-300 transition-colors">Syaiful R. Iswantara</span>
              </div>
            </div>

            {/* Direct Skip button */}
            <button
              onClick={onComplete}
              className="mt-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white/40 hover:text-white/70 text-[9px] tracking-widest font-mono uppercase transition-all cursor-pointer"
            >
              Lewati Loading
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="text-center flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400/10 to-purple-500/10 border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.1)] flex items-center justify-center mb-5"
            >
              <ShieldCheck className="w-5 h-5 text-cyan-300" />
            </motion.div>
            
            <h2 className="text-xl font-light text-white tracking-wide font-sans">
              Selamat Datang, <span className="text-cyan-400 font-normal">Denzuko</span>
            </h2>
            <p className="text-[10px] text-neutral-400 font-mono tracking-[0.2em] uppercase mt-2 max-w-xs mb-8">
              Mempersiapkan Ruang Kerja Kognitif Anda...
            </p>

            {/* Tim Pengembang Kelompok on Welcome */}
            <div className="pt-5 border-t border-white/5 w-full text-center">
              <span className="text-[8px] font-mono tracking-[0.25em] text-cyan-400/80 uppercase block mb-3.5">
                Kreator Nexora OS Kelompok
              </span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono text-neutral-400 bg-white/[0.01] border border-white/5 rounded-xl p-3">
                <span className="text-left text-neutral-300">M. Alfathan Adzanka</span>
                <span className="text-right text-neutral-300">Rashif P. Nurjanto</span>
                <span className="text-left text-neutral-300">Richy Dwi Ramadhan</span>
                <span className="text-right text-neutral-300">Ridho Wijaya Putra</span>
                <span className="text-left text-neutral-300">Sam Pandega</span>
                <span className="text-right text-neutral-300">Syaiful R. Iswantara</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
