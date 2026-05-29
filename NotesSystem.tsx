import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Search, 
  StickyNote, 
  BookOpen, 
  Tag, 
  Calendar,
  Layers,
  Sparkles,
  Award,
  AlertCircle
} from "lucide-react";
import { Note } from "../types";

export default function NotesSystem() {
  // Initial demo notes geared for Indonesian High Schoolers (SMA)
  const initialNotes: Note[] = [
    {
      id: "note-1",
      title: "Rumus Statistika - Median & Modus Data Berkelompok",
      content: "Median = Tb + p * (((n/2) - Fk) / f)\nTb = Tepi bawah kelas median\np = panjang kelas\nFk = Frekuensi kumulatif sebelum kelas median\nf = frekuensi kelas median.\n\nJangan ketukar antara modus (Mo) yang menggunakan selisih d1 dan d2!",
      createdAt: "28 Mei, 11:20",
      subject: "Matematika",
      color: "from-yellow-400/20 to-amber-500/15 text-amber-200 border-amber-500/30"
    },
    {
      id: "note-2",
      title: "Daftar Istilah Biologi - Perubahan Iklim",
      content: "1. Efek Rumah Kaca: Radiasi infra merah matahari terperangkap CO2, CH4, N2O di atmosfer.\n2. Protokol Kyoto: Kerja sama pengurangan emisi GRK (Gas Rumah Kaca).\n3. Deforestasi: Penebangan hutan skala besar yang bikin fotosintesis berkurang drastis.",
      createdAt: "27 Mei, 14:15",
      subject: "Sains & IPA",
      color: "from-green-400/20 to-emerald-500/15 text-emerald-200 border-emerald-500/30"
    },
    {
      id: "note-3",
      title: "Poin Esai Sosiologi: Interaksi Sosial",
      content: "Syarat terjadinya interaksi sosial menurut Soerjono Soekanto:\n- Kontak sosial (fisik maupun non-fisik/digital)\n- Komunikasi (pemberian arti pada perilaku orang lain)\n\nHarus diingat untuk draf proposal tugas akhir lusa!",
      createdAt: "26 Mei, 18:40",
      subject: "Bahasa & IPS",
      color: "from-purple-400/20 to-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30"
    }
  ];

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("nexora_notes");
    return saved ? JSON.parse(saved) : initialNotes;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  // New Note fields
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState("Matematika");
  const [selectedColor, setSelectedColor] = useState("amber"); // default orange/yellow

  useEffect(() => {
    localStorage.setItem("nexora_notes", JSON.stringify(notes));
  }, [notes]);

  const colorPresets: Record<string, { bg: string; dot: string; optionClass: string }> = {
    amber: { 
      bg: "from-yellow-400/20 to-amber-500/15 text-amber-200 border-amber-500/30", 
      dot: "bg-amber-400",
      optionClass: "bg-amber-500"
    },
    emerald: { 
      bg: "from-green-400/20 to-emerald-500/15 text-emerald-200 border-emerald-500/30", 
      dot: "bg-emerald-400",
      optionClass: "bg-emerald-500"
    },
    cyan: { 
      bg: "from-cyan-400/20 to-teal-500/15 text-cyan-200 border-cyan-500/30", 
      dot: "bg-cyan-400",
      optionClass: "bg-cyan-500"
    },
    fuchsia: { 
      bg: "from-purple-400/20 to-fuchsia-500/15 text-fuchsia-200 border-fuchsia-500/30", 
      dot: "bg-fuchsia-400",
      optionClass: "bg-fuchsia-500"
    },
    rose: { 
      bg: "from-rose-400/20 to-red-500/15 text-rose-200 border-rose-500/30", 
      dot: "bg-rose-400",
      optionClass: "bg-rose-500"
    }
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const now = new Date();
    const timeFormatted = now.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short"
    }) + ", " + now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit"
    });

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      createdAt: timeFormatted,
      subject: newSubject,
      color: colorPresets[selectedColor]?.bg || colorPresets.amber.bg
    };

    setNotes(prev => [newNote, ...prev]);
    
    // Reset Form
    setNewTitle("");
    setNewContent("");
    setSelectedColor("amber");
    setShowAddForm(false);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === "all" || note.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const subjects = ["all", "Matematika", "Sains & IPA", "Bahasa & IPS", "Umum/Seni/Lainnya"];

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-white/90">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 p-[1.5px] flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-sans font-semibold text-white uppercase tracking-wider">Catatan Belajar & Rumus PR</h2>
            <p className="text-xs text-neutral-500 uppercase tracking-widest font-mono">Simpan catatan, petunjuk pengerjaan tugas, dan materi ulangan</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 text-xs font-bold font-mono tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 text-neutral-950" />
          BUAT CATATAN BARU
        </button>
      </div>

      {/* Control filters - Search & Subject Filter buttons */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-xl">
        {/* Search */}
        <div className="relative w-full lg:w-96 font-mono text-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="h-4 w-4 text-neutral-500" />
          </span>
          <input
            type="text"
            placeholder="Cari isi catatan atau judul rumus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-white/5 focus:border-amber-500/50 p-2.5 pl-10 rounded-lg text-white font-sans outline-none transition-all placeholder:text-neutral-500"
          />
        </div>

        {/* Subjects Tab list */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto font-mono text-[10px]">
          <span className="text-neutral-500 uppercase tracking-wider mr-1 hidden sm:inline">Filter Mapel:</span>
          {subjects.map(subj => (
            <button
              key={subj}
              onClick={() => setFilterSubject(subj)}
              className={`px-3 py-1.5 rounded-lg border text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                filterSubject === subj 
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/35 shadow-[0_0_10px_rgba(245,158,11,0.08)]"
                  : "bg-white/5 text-neutral-400 hover:text-neutral-200 border-transparent hover:bg-white/10"
              }`}
            >
              {subj === "all" ? "[SEMUA]" : subj}
            </button>
          ))}
        </div>
      </div>

      {/* Note Form Modal Overlay */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-xl p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white font-mono">Tulis Catatan Pelajaran</h3>
                </div>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-1 rounded-md hover:bg-white/5 text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="flex flex-col gap-4 text-xs font-mono">
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Judul Catatan / Rumus</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Rumus Turunan Trigonometri, Bab 4 Perang Diponegoro..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 focus:border-amber-500/50 p-3 rounded-lg text-white font-sans text-xs outline-none transition-all placeholder:text-neutral-600"
                  />
                </div>

                {/* Grid: Subject & Color */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Kategori Mata Pelajaran</label>
                    <select
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full bg-neutral-950 border border-white/5 focus:border-amber-500/50 p-3 rounded-lg text-white outline-none transition-all"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="Sains & IPA">Sains & IPA</option>
                      <option value="Bahasa & IPS">Bahasa & IPS</option>
                      <option value="Umum/Seni/Lainnya">Umum / Seni / Lainnya</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Warna Tempel (Sticky note color)</label>
                    <div className="flex items-center gap-2.5 h-10 px-1">
                      {Object.keys(colorPresets).map((colName) => {
                        const col = colorPresets[colName];
                        const isSelected = selectedColor === colName;
                        return (
                          <button
                            key={colName}
                            type="button"
                            onClick={() => setSelectedColor(colName)}
                            className={`w-6 h-6 rounded-full ${col.optionClass} transition-transform relative ${
                              isSelected ? "scale-125 ring-2 ring-white" : "hover:scale-110"
                            }`}
                            title={colName}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Content text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider">Isi Catatan / Keterangan Lengkap</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Tulis ringkasan, rumus penting, tips belajar guru, contoh soal, atau tautan bacaan di sini..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 focus:border-amber-500/50 p-3 rounded-lg text-white font-sans text-xs outline-none transition-all placeholder:text-neutral-600 resize-none"
                  />
                </div>

                {/* Submits */}
                <div className="flex gap-3 justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold rounded-lg transition-all cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-neutral-950 font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer"
                  >
                    Simpan Catatan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid of Notes */}
      <AnimatePresence mode="popLayout">
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
          >
            <AlertCircle className="w-8 h-8 text-neutral-600 mb-3" />
            <p className="text-sm font-mono text-neutral-400 uppercase">Tidak menemukan catatan</p>
            <p className="text-[11px] text-neutral-500 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter mata pelajaran Anda</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterSubject("all");
              }}
              className="mt-4 px-3.5 py-1.5 rounded-lg border border-neutral-700 bg-neutral-950 text-[10px] text-neutral-300 hover:text-white hover:border-neutral-500 font-mono transition-all"
            >
              Setel Ulang Filter
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note) => {
              return (
                <motion.div
                  key={note.id}
                  id={`note-card-${note.id}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-gradient-to-br ${note.color || "from-yellow-400/20 to-amber-500/15 text-amber-200 border-amber-500/30"} border rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-[230px] shadow-lg group hover:brightness-110 transition-all`}
                >
                  <div className="flex flex-col gap-2 overflow-hidden h-[155px]">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm">
                        {note.subject}
                      </span>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="p-1 rounded bg-black/15 hover:bg-rose-500/20 hover:text-rose-400 border border-white/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer text-white/60"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xs font-semibold text-white tracking-wide leading-snug line-clamp-2">
                      {note.title}
                    </h3>

                    {/* Body */}
                    <p className="text-[10px] text-white/70 leading-relaxed font-sans whitespace-pre-wrap overflow-y-auto pr-0.5 line-clamp-4">
                      {note.content}
                    </p>
                  </div>

                  {/* Foot/Date */}
                  <div className="border-t border-white/5 pt-3 mt-auto flex items-center justify-between text-[9px] font-mono text-white/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-white/30" />
                      {note.createdAt}
                    </span>
                    <span className="text-[8px] bg-white/5 rounded px-1 text-white/30 uppercase tracking-widest">
                      PR KEEPER
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Decorative Tips */}
      <div className="bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/15 rounded-xl p-4 flex gap-3.5 items-center">
        <Award className="w-5 h-5 text-amber-400 shrink-0" />
        <p className="text-xs font-mono text-amber-200/80 leading-relaxed">
          <strong className="text-amber-400 underline">Tips Belajar:</strong> Catatan yang ringkas dan terfokus sangat memudahkan ingatan visual sebelum ujian dimulai. Manfaatkan "Timer Belajar Bebas Distraksi" setelah mencatat rumus penting ini.
        </p>
      </div>

    </div>
  );
}
