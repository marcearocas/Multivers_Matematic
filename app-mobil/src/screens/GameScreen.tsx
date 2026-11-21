import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Button, colors } from '../components/ui';
import {
  GameResult,
  generateProblem,
  Level,
  LEVELS,
  Mode,
  POINTS_PER_CORRECT,
  Problem,
  SURVIVAL_LIVES,
  TIME_BONUS,
  TIME_LIMIT,
} from '../game';

type Props = {
  playerName: string;
  level: Level;
  mode: Mode;
  onFinish: (result: GameResult) => void;
  onQuit: () => void;
};

type Feedback = { kind: 'ok' | 'bad'; text: string } | null;

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'];

export function GameScreen({ playerName, level, mode, onFinish, onQuit }: Props) {
  const [problem, setProblem] = useState<Problem>(() => generateProblem(level));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [lives, setLives] = useState(SURVIVAL_LIVES);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [locked, setLocked] = useState(false);

  const pulse = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const finished = useRef(false);
  const stats = useRef({ score: 0, correct: 0, total: 0 });
  stats.current = { score, correct, total };

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onFinish({ playerName, level, mode, ...stats.current });
  }, [onFinish, playerName, level, mode]);

  // Temporitzador del mode contrarellotge.
  useEffect(() => {
    if (mode !== 'time') return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [mode]);

  useEffect(() => {
    if (mode === 'time' && timeLeft <= 0) finish();
  }, [mode, timeLeft, finish]);

  useEffect(() => {
    if (mode === 'survival' && lives <= 0) {
      const id = setTimeout(finish, 1200);
      return () => clearTimeout(id);
    }
  }, [mode, lives, finish]);

  const next = useCallback(() => {
    setProblem((p) => generateProblem(level, p));
    setInput('');
    setLocked(false);
  }, [level]);

  const submit = () => {
    if (locked || input === '') return;
    const value = parseInt(input, 10);
    setTotal((t) => t + 1);
    setLocked(true);

    if (value === problem.answer) {
      setScore((x) => x + POINTS_PER_CORRECT);
      setCorrect((c) => c + 1);
      if (mode === 'time') setTimeLeft((t) => t + TIME_BONUS);
      setFeedback({ kind: 'ok', text: mode === 'time' ? `Correcte! +${TIME_BONUS} s` : 'Correcte!' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 160, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 160, useNativeDriver: true }),
      ]).start();
      setTimeout(next, 450);
    } else {
      setFeedback({ kind: 'bad', text: `Incorrecte! ${problem.a} × ${problem.b} = ${problem.answer}` });
      if (mode === 'survival') setLives((l) => l - 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      Animated.sequence(
        [10, -10, 8, -8, 0].map((toValue) => Animated.timing(shake, { toValue, duration: 60, useNativeDriver: true })),
      ).start();
      setTimeout(next, 1300);
    }
  };

  const press = (key: string) => {
    if (locked) return;
    if (key === 'OK') return submit();
    Haptics.selectionAsync().catch(() => {});
    if (key === '⌫') return setInput((v) => v.slice(0, -1));
    setInput((v) => (v.length >= 3 ? v : (v + key).replace(/^0+(?=\d)/, '')));
  };

  const skip = () => {
    if (locked) return;
    setFeedback(null);
    next();
  };

  const lowTime = mode === 'time' && timeLeft <= 10;

  return (
    <View style={s.wrap}>
      <View style={s.top}>
        <View>
          <Text style={s.statLabel}>Punts</Text>
          <Text style={[s.stat, { color: colors.yellow }]}>{score}</Text>
        </View>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Text style={s.player}>
            {playerName} · {LEVELS[level].label}
          </Text>
          <Button label="Torna a l'Inici" color={colors.gray} small onPress={onQuit} />
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.statLabel}>{mode === 'time' ? 'Temps' : 'Vides'}</Text>
          {mode === 'time' ? (
            <Text style={[s.stat, { color: lowTime ? colors.red : colors.blue }]}>{timeLeft}</Text>
          ) : (
            <Text style={s.hearts} accessibilityLabel={`${lives} vides`}>
              {'❤️'.repeat(Math.max(0, lives))}
              {'🖤'.repeat(SURVIVAL_LIVES - Math.max(0, lives))}
            </Text>
          )}
        </View>
      </View>

      <Animated.View style={[s.problem, { transform: [{ scale: pulse }, { translateX: shake }] }]}>
        <Text style={s.problemText} adjustsFontSizeToFit numberOfLines={1}>
          {problem.a} × {problem.b} = <Text style={{ color: input ? '#fff' : colors.muted }}>{input || '?'}</Text>
        </Text>
      </Animated.View>

      <Text
        style={[s.feedback, { color: feedback?.kind === 'ok' ? colors.green : colors.red }]}
        accessibilityLiveRegion="polite"
      >
        {feedback?.text ?? ' '}
      </Text>

      <View style={s.pad}>
        {KEYS.map((key) => (
          <Pressable
            key={key}
            onPress={() => press(key)}
            accessibilityRole="button"
            accessibilityLabel={key === '⌫' ? 'Esborra' : key === 'OK' ? 'Comprova' : key}
            style={({ pressed }) => [
              s.key,
              key === 'OK' && { backgroundColor: colors.green },
              key === '⌫' && { backgroundColor: colors.gray },
              pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
            ]}
          >
            <Text style={s.keyText}>{key}</Text>
          </Pressable>
        ))}
      </View>

      <Button label="Salta" color={colors.gray} small onPress={skip} style={{ alignSelf: 'center', marginTop: 12, minWidth: 140 }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 16, justifyContent: 'space-between' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  statLabel: { color: colors.muted, fontSize: 15, fontWeight: '600' },
  stat: { fontSize: 34, fontWeight: '800' },
  hearts: { fontSize: 24, marginTop: 6 },
  player: { color: colors.muted, fontSize: 13 },
  problem: {
    backgroundColor: colors.inset,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  problemText: { color: '#fff', fontSize: 52, fontWeight: '800', textAlign: 'center' },
  feedback: { textAlign: 'center', fontSize: 18, fontWeight: '700', marginVertical: 12, minHeight: 24 },
  pad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  key: {
    width: '31.5%',
    aspectRatio: 1.9,
    borderRadius: 14,
    backgroundColor: '#1f2937',
    borderColor: colors.cardBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { color: '#fff', fontSize: 26, fontWeight: '700' },
});
