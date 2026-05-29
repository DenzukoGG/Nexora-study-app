export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "progress" | "done";
export type TaskCategory = "Matematika" | "Sains & IPA" | "Bahasa & IPS" | "Umum/Seni/Lainnya";

export interface Task {
  id: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  deadlineRelative: string;
  deadlineDate: string;
  cognitiveLoad: number; // 0-100 indicating intensity
}

export type ProductivityLevelName = "Deep Focus" | "Stable Flow" | "Peak Session" | "Burnout Risk";

export interface FocusSession {
  modeName: ProductivityLevelName;
  durationMinutes: number;
  timeRemaining: number; // in seconds
  isActive: boolean;
  pulseSpeed: number; // animation helper
}

export interface AiInsight {
  id: string;
  title: string;
  category: ProductivityLevelName;
  impact: string;
  description: string;
  recommendation: string;
}

export interface AiChatMessage {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface ProductivityMetric {
  dayName: string; // e.g. "MON"
  focusHours: number;
  completedTasksCount: number;
  cognitiveLoadAverage: number;
}

export interface SystemNotification {
  id: string;
  type: "warning" | "success" | "hologram" | "normal";
  message: string;
  timestamp: string;
  read: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  subject?: string; // e.g. "Matematika", "Kimia" etc to match mapel
  color?: string; // hex or tailwind class for sticky notes
}

