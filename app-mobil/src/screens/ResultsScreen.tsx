import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, colors, styles as ui } from '../components/ui';
import { accuracy, GameResult, LEVELS, MODES } from '../game';

type Props = {
  result: GameResult;
  onRestart: () => void;
  onLeaderboard: () => void;
  onHome: () => void;
};

export function ResultsScreen({ result, onRestart, onLeaderboard, onHome }: Props) {
  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={ui.h1}>Resultats Finals</Text>

      <Card style={{ marginTop: 20, gap: 4 }}>
        <Text style={s.line}>
          Jugador: <Text style={{ color: colors.blue, fontWeight: '700' }}>{result.playerName}</Text>
        </Text>
        <Text style={s.line}>
          {LEVELS[result.level].label} · {MODES[result.mode].label}
        </Text>

        <Text style={s.caption}>Puntuació total</Text>
        <Text style={[s.big, { color: colors.yellow }]}>{result.score}</Text>

        <View style={s.row}>
          <View style={s.cell}>
            <Text style={s.caption}>Correctes</Text>
            <Text style={[s.mid, { color: colors.green }]}>
              {result.correct}/{result.total}
            </Text>
          </View>
          <View style={s.cell}>
            <Text style={s.caption}>Precisió</Text>
            <Text style={[s.mid, { color: colors.blue }]}>{accuracy(result.correct, result.total)}%</Text>
          </View>
        </View>
      </Card>

      <View style={{ gap: 12, marginTop: 20 }}>
        <Button label="Torna a Jugar" onPress={onRestart} />
        <Button label="Veure Rànquing" color={colors.purple} onPress={onLeaderboard} />
        <Button label="Torna a l'Inici" color={colors.gray} onPress={onHome} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  line: { color: '#fff', fontSize: 17, textAlign: 'center' },
  caption: { color: colors.muted, fontSize: 16, textAlign: 'center', marginTop: 16 },
  big: { fontSize: 64, fontWeight: '900', textAlign: 'center' },
  mid: { fontSize: 32, fontWeight: '800', textAlign: 'center' },
  row: { flexDirection: 'row' },
  cell: { flex: 1 },
});
