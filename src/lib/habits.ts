export type Habit = {
  id: string;
  name: string;
  detail: string;
  completions: string[]; // ISO date strings (YYYY-MM-DD)
};

const STORAGE_KEY = "daily-rhythms.habits.v1";

export const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const getWeekDates = (ref = new Date()) => {
  const day = ref.getDay(); // 0=Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

export const computeStreak = (completions: string[]): number => {
  const set = new Set(completions);
  let streak = 0;
  const cursor = new Date();
  if (!set.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (set.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

export const loadHabits = (): Habit[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultHabits();
    return JSON.parse(raw) as Habit[];
  } catch {
    return defaultHabits();
  }
};

export const saveHabits = (habits: Habit[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

const defaultHabits = (): Habit[] => {
  const today = todayKey();
  return [
    {
      id: crypto.randomUUID(),
      name: "Méditation matinale",
      detail: "15 minutes • 7:00",
      completions: [],
    },
    {
      id: crypto.randomUUID(),
      name: "Session de travail profond",
      detail: "90 minutes • 9:30",
      completions: [today],
    },
    {
      id: crypto.randomUUID(),
      name: "Objectif d'hydratation",
      detail: "2,5 litres • Toute la journée",
      completions: [],
    },
  ];
};