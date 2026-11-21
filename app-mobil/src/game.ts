export type Level = 'easy' | 'medium' | 'hard';
export type Mode = 'time' | 'survival';

export const LEVELS: Record<Level, { label: string; range: string; min: number; max: number; color: string }> = {
  easy: { label: 'Fàcil', range: '2-5', min: 2, max: 5, color: '#16a34a' },
  medium: { label: 'Mig', range: '6-9', min: 6, max: 9, color: '#ca8a04' },
  hard: { label: 'Difícil', range: '2-9', min: 2, max: 9, color: '#dc2626' },
};

export const MODES: Record<Mode, { label: string; detail: string; color: string }> = {
  time: { label: 'Contrarellotge', detail: '60 s · +3 s per encert', color: '#2563eb' },
  survival: { label: 'Supervivència', detail: 'Sense temps · 3 vides', color: '#9333ea' },
};

export const TIME_LIMIT = 60;
export const TIME_BONUS = 3;
export const SURVIVAL_LIVES = 3;
export const POINTS_PER_CORRECT = 10;

export type Problem = { a: number; b: number; answer: number };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateProblem(level: Level, previous?: Problem): Problem {
  const { min, max } = LEVELS[level];
  let a: number;
  let b: number;
  // Evita repetir exactament la mateixa operació dues vegades seguides.
  do {
    a = randInt(min, max);
    b = randInt(min, max);
  } while (previous && previous.a === a && previous.b === b);
  return { a, b, answer: a * b };
}

export type GameResult = {
  playerName: string;
  level: Level;
  mode: Mode;
  score: number;
  correct: number;
  total: number;
};

export function accuracy(correct: number, total: number) {
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}
