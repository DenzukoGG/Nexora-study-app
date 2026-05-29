import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Clock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sliders, 
  ListTodo, 
  Flame, 
  Compass,
  AlertCircle,
  X
} from "lucide-react";
import { Task, TaskPriority, TaskCategory, TaskStatus } from "../types";

interface TaskSystemProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TaskSystem({ tasks, setTasks }: TaskSystemProps) {
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "all">("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>("Matematika");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [newLoad, setNewLoad] = useState(40);
  const [newDeadlineText, setNewDeadlineText] = useState("Sisa 3 jam");

  // Move a task's status
  const moveTask = (id: string, direction: "next" | "prev" | "done") => {
    setTasks(prev => prev.map(task => {
      if (task.id !== id) return task;
      
      let nextStatus: TaskStatus = task.status;
      if (direction === "next") {
        if (task.status === "todo") nextStatus = "progress";
        else if (task.status === "progress") nextStatus = "done";
      } else if (direction === "prev") {
        if (task.status === "progress") nextStatus = "todo";
        else if (task.status === "done") nextStatus = "progress";
      } else if (direction === "done") {
        nextStatus = "done";
      }
      
      return { ...task, status: nextStatus };
    }));
  };

  const createTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      priority: newPriority,
      status: "todo",
      category: newCategory,
      deadlineRelative: newDeadlineText,
      deadlineDate: new Date(Date.now() + 4 * 3600000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cognitiveLoad: newLoad
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTitle("");
    setNewLoad(40);
    setNewDeadlineText("Batas besok pagi");
    setShowAddTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const categories: (TaskCategory | "all")[] = ["all", "Matematika", "Sains & IPA", "Bahasa & IPS", "Umum/Seni/Lainnya"];

  const filteredTasks = tasks.filter(task => {
    if (filterCategory === "all") return true;
    return task.category === filterCategory;
  });

  const todoTasks = filteredTasks.filter(t => t.status === "todo");
  const progressTasks = filteredTasks.filter(t => t.status === "progress");
  const doneTasks = filteredTasks.filter(t => t.status === "done");

  const getPriorityStyle = (p: TaskPriority) => {
    if (p === "high") return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    if (p === "medium") return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-teal-500/10 text-teal-400 border-teal-500/30";
  };

  const getLoadBadgeLevel = (load: number) => {
    if (load > 75) return { color: "text-rose-400 border-rose-500/20 bg-rose-500/5", name: "Berat" };
    if (load > 40) return { color: "text-amber-400 border-amber-500/20 bg-amber-500/5", name: "Sedang" };
    return { color: "text-teal-400 border-teal-500/20 bg-teal-500/5", name: "Ringan" };
  };

  return (
    <div className="flex flex-col gap-6 w-full select-none" id="nexora-task-system">
      {/* Tab filter header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-teal-500/20 bg-teal-500/5 rounded-lg text-teal-400">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-white uppercase tracking-wider">Daftar Tugas Sekolah</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">Papan Pemantau Tugas Belajar & PR</p>
          </div>
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-widest uppercase transition-all border ${
                filterCategory === cat
                  ? "bg-teal-500/10 text-teal-300 border-teal-500/40 shadow-[0_0_12px_rgba(20,184,166,0.15)]"
                  : "bg-white/5 text-neutral-400 hover:text-neutral-200 border-transparent hover:bg-white/10"
              }`}
            >
              {cat === "all" ? "[SEMUA MAPEL]" : cat.toUpperCase()}
            </button>
          ))}
          
          <button
            onClick={() => setShowAddTask(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-neutral-950 text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(20,184,166,0.25)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-neutral-950" />
            TAMBAH TUGAS
          </button>
        </div>
      </div>

      {/* Grid status columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Backlog / To Do */}
        <div className="flex flex-col gap-4 rounded-2xl bg-black/25 border border-white/5 p-4.5 relative overflow-hidden" id="column-todo">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 font-mono">
                Tugas Baru (Belum Dikerjakan)
              </h3>
            </div>
            <span className="text-[10px] bg-white/5 font-mono text-neutral-500 px-2 py-0.5 rounded border border-white/5">
              {todoTasks.length} TUGAS
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {todoTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-600 font-mono text-xs uppercase gap-2 border border-dashed border-white/5 rounded-xl h-full">
                  <Compass className="w-5 h-5 opacity-40 animate-spin text-neutral-500" style={{ animationDuration: "12s" }} />
                  <span>Tidak ada tugas baru</span>
                </div>
              ) : (
                todoTasks.map(task => renderTaskCard(task))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="flex flex-col gap-4 rounded-2xl bg-black/25 border border-white/5 p-4.5 relative overflow-hidden" id="column-progress">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 font-mono">
                Sedang Dikerjakan
              </h3>
            </div>
            <span className="text-[10px] bg-white/5 font-mono text-neutral-500 px-2 py-0.5 rounded border border-white/5">
              {progressTasks.length} AKTIF
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {progressTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-600 font-mono text-xs uppercase gap-2 border border-dashed border-white/5 rounded-xl h-full">
                  <Flame className="w-5 h-5 opacity-30 text-neutral-500" />
                  <span>Belum ada yang dikerjakan</span>
                  <span className="text-[9px] text-neutral-700">Pindahkan tugas di sini untuk mulai fokus</span>
                </div>
              ) : (
                progressTasks.map(task => renderTaskCard(task))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Column 3: Completed */}
        <div className="flex flex-col gap-4 rounded-2xl bg-black/25 border border-white/5 p-4.5 relative overflow-hidden" id="column-completed">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-300 font-mono">
                Selesai
              </h3>
            </div>
            <span className="text-[10px] bg-white/5 font-mono text-neutral-500 px-2 py-0.5 rounded border border-white/5">
              {doneTasks.length} BERHASIL
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {doneTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-600 font-mono text-xs uppercase gap-2 border border-dashed border-white/5 rounded-xl h-full">
                  <CheckCircle2 className="w-5 h-5 opacity-20 text-neutral-500" />
                  <span>Belum ada tugas selesai</span>
                </div>
              ) : (
                doneTasks.map(task => renderTaskCard(task))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add Task Modal overlay */}
      <AnimatePresence>
        {showAddTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl p-6 text-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-teal-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white font-mono">Formulir Tambah Tugas Belajar</h3>
                </div>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={createTask} className="flex flex-col gap-4 text-xs font-mono">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Nama Tugas Sekolah</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Latihan Soal Bab 3 Statistika dsb..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 focus:border-teal-500/50 p-3 rounded-lg text-white font-sans text-xs outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Mata Pelajaran (Mapel)</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                      className="w-full bg-neutral-950 border border-white/5 p-3 rounded-lg text-white outline-none focus:border-teal-500/50 transition-all cursor-pointer"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="Sains & IPA">Sains & IPA</option>
                      <option value="Bahasa & IPS">Bahasa & IPS</option>
                      <option value="Umum/Seni/Lainnya">Umum / Seni / Lainnya</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Tingkat Prioritas</label>
                    <div className="flex gap-1 bg-neutral-950 border border-white/5 p-1 rounded-lg">
                      {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPriority(p)}
                          className={`flex-1 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest cursor-pointer transition-all ${
                            newPriority === p
                              ? p === "high"
                                ? "bg-rose-500 text-neutral-950"
                                : p === "medium"
                                ? "bg-amber-500 text-neutral-950"
                                : "bg-teal-500 text-neutral-950"
                              : "text-neutral-500 hover:text-neutral-300"
                          }`}
                        >
                          {p === "high" ? "Kritis" : p === "medium" ? "Sedang" : "Ringan"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] text-neutral-400 uppercase tracking-wider">
                    <span>Tenggat Pengumpulan</span>
                    <span className="text-teal-400">Waktu Tersisa</span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="misalnya: 'Sisa 2 jam' atau 'Besok pagi'"
                    value={newDeadlineText}
                    onChange={(e) => setNewDeadlineText(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 focus:border-teal-500/50 p-3 rounded-lg text-white outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2 bg-neutral-950 border border-white/5 p-3.5 rounded-lg">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider">
                    <span className="text-neutral-400">Tingkat Kesulitan Tugas</span>
                    <span className="text-teal-400">Beban {newLoad}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={newLoad}
                    onChange={(e) => setNewLoad(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[8px] text-neutral-600 uppercase font-mono">
                    <span>Sangat Mudah (Ringan)</span>
                    <span>Sedang Ke Atas</span>
                    <span>Sangat Sulit (Butuh Fokus Tinggi)</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="flex-1 py-3 bg-white/5 border border-white/5 text-neutral-300 hover:text-white capitalize font-semibold rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-teal-400 text-neutral-950 font-bold uppercase tracking-widest rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.35)] hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    Tambahkan Tugas
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

  // Render Card Subordinate Helper
  function renderTaskCard(task: Task) {
    const loadInfo = getLoadBadgeLevel(task.cognitiveLoad);
    const inTodo = task.status === "todo";
    const inProgress = task.status === "progress";
    const inDone = task.status === "done";

    return (
      <motion.div
        key={task.id}
        layout
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.25, type: "spring", stiffness: 350, damping: 25 }}
        className="group p-4 bg-neutral-900/60 border border-white/5 hover:border-white/10 rounded-xl relative overflow-hidden backdrop-blur-md hover:bg-neutral-900/80 transition-all duration-300 flex flex-col gap-3 shadow-md"
        id={task.id}
      >
        {/* Border glow decoration */}
        <div className="absolute top-0 left-0 w-[2px] h-full bg-teal-400/25 opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Categories, Priority and Close badges */}
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">
            {task.category}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded border uppercase font-medium leading-none ${getPriorityStyle(task.priority)}`}>
              {task.priority === "high" ? "kritis" : task.priority === "medium" ? "sedang" : "ringan"}
            </span>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/10 text-neutral-500 hover:text-rose-400 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Title content */}
        <h4 className={`text-xs font-sans tracking-wide text-white leading-normal uppercase group-hover:text-teal-300 transition-colors ${inDone ? "line-through text-neutral-500 group-hover:text-neutral-500" : ""}`}>
          {task.title}
        </h4>

        {/* Cognitive load gauge indicators */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2.5 mt-1">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-neutral-400">{task.deadlineRelative}</span>
          </div>

          <div className={`flex items-center gap-1 text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${loadInfo.color}`}>
            <Flame className="w-3 h-3 text-current" />
            <span>{loadInfo.name} ({task.cognitiveLoad}%)</span>
          </div>
        </div>

        {/* Controls movement */}
        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
          <div>
            {!inTodo ? (
              <button
                onClick={() => moveTask(task.id, "prev")}
                className="p-1 px-1.5 hover:bg-white/5 text-neutral-400 hover:text-neutral-200 rounded border border-white/5 text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3 h-3 text-neutral-500" />
                Kembali
              </button>
            ) : <div />}
          </div>

          <div>
            {!inDone ? (
              <button
                onClick={() => moveTask(task.id, inTodo ? "next" : "done")}
                className="p-1 px-2.5 bg-teal-500/5 hover:bg-teal-500/10 text-teal-400 border border-teal-500/25 rounded text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all font-semibold"
              >
                <span>{inTodo ? "Mulai Kerja" : "Selesaikan"}</span>
                <ArrowRight className="w-3 h-3 text-teal-400 animate-pulse" />
              </button>
            ) : (
              <span className="text-[9px] text-teal-500/60 font-mono uppercase tracking-widest flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-teal-400/80" />
                Tugas Selesai! 🎉
              </span>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
}
export type { TaskCategory, TaskPriority, TaskStatus, Task };
