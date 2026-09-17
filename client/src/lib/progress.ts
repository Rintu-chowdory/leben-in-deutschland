// Lokaler Fortschrittsspeicher – funktioniert ohne Backend (localStorage).
// Wird für Checklisten, Quiz-Statistiken und Tool-Daten verwendet.

export interface QuizStat {
  attempts: number;
  bestScore: number;
  lastScore: number;
  lastPlayed: string | null;
}

const KEY = 'lid-progress-v1';

interface Store {
  checklists: Record<string, string[]>; // moduleId -> erledigte Item-IDs
  quiz: QuizStat;
  deadlines: Record<string, string>; // eventId -> Startdatum (ISO)
}

function read(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { checklists: {}, quiz: { attempts: 0, bestScore: 0, lastScore: 0, lastPlayed: null }, deadlines: {}, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { checklists: {}, quiz: { attempts: 0, bestScore: 0, lastScore: 0, lastPlayed: null }, deadlines: {} };
}

function write(s: Store) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

// ---------- Checklisten ----------

export function getChecked(moduleId: string): string[] {
  return read().checklists[moduleId] ?? [];
}

export function setChecked(moduleId: string, ids: string[]) {
  const s = read();
  s.checklists[moduleId] = ids;
  write(s);
  window.dispatchEvent(new CustomEvent('lid-progress-changed'));
}

export function moduleCompletion(moduleId: string, total: number): number {
  if (!total) return 0;
  const done = getChecked(moduleId).filter((id) => id.startsWith('doc:') || true).length;
  // Zähle nur Items, die zur Gesamtmenge gehören – hier genügt der Anteil der abgehakten Items.
  return Math.min(100, Math.round((getChecked(moduleId).length / total) * 100));
}

export function overallCompletion(totals: Record<string, number>): number {
  const ids = Object.keys(totals);
  if (!ids.length) return 0;
  const sum = ids.reduce((acc, id) => acc + moduleCompletion(id, totals[id]), 0);
  return Math.round(sum / ids.length);
}

// ---------- Quiz ----------

export function getQuizStat(): QuizStat {
  return read().quiz;
}

export function saveQuizResult(scorePct: number): QuizStat {
  const s = read();
  s.quiz = {
    attempts: s.quiz.attempts + 1,
    bestScore: Math.max(s.quiz.bestScore, Math.round(scorePct)),
    lastScore: Math.round(scorePct),
    lastPlayed: new Date().toISOString(),
  };
  write(s);
  window.dispatchEvent(new CustomEvent('lid-progress-changed'));
  return s.quiz;
}

// ---------- Fristen ----------

export function getDeadline(eventId: string): string | undefined {
  return read().deadlines[eventId];
}

export function setDeadline(eventId: string, isoDate: string) {
  const s = read();
  s.deadlines[eventId] = isoDate;
  write(s);
  window.dispatchEvent(new CustomEvent('lid-progress-changed'));
}

export function clearDeadline(eventId: string) {
  const s = read();
  delete s.deadlines[eventId];
  write(s);
  window.dispatchEvent(new CustomEvent('lid-progress-changed'));
}
