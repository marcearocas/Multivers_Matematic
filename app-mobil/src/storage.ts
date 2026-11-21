import AsyncStorage from '@react-native-async-storage/async-storage';
import { accuracy, GameResult, Level, Mode } from './game';

const SCORES_KEY = 'multiversScores';
const LAST_PLAYER_KEY = 'multiversLastPlayer';
const MAX_STORED = 200;

export type ScoreEntry = {
  id: number;
  playerName: string;
  level: Level;
  mode: Mode;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  date: string;
};

export async function getScores(): Promise<ScoreEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(SCORES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveScore(result: GameResult): Promise<void> {
  const scores = await getScores();
  scores.push({
    id: Date.now(),
    playerName: result.playerName,
    level: result.level,
    mode: result.mode,
    score: result.score,
    correctAnswers: result.correct,
    totalAnswers: result.total,
    accuracy: accuracy(result.correct, result.total),
    date: new Date().toLocaleDateString('ca-ES'),
  });
  // Conserva només les millors puntuacions per no créixer sense límit.
  scores.sort((x, y) => y.score - x.score);
  try {
    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(scores.slice(0, MAX_STORED)));
  } catch {
    // Si no es pot desar, el joc continua igualment.
  }
}

export async function getLastPlayer(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(LAST_PLAYER_KEY)) ?? '';
  } catch {
    return '';
  }
}

export async function setLastPlayer(name: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_PLAYER_KEY, name);
  } catch {}
}
