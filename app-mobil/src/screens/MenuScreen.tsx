import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, colors, styles as ui } from '../components/ui';
import { Level, LEVELS, Mode, MODES } from '../game';

type Props = {
  playerName: string;
  onStart: (level: Level, mode: Mode) => void;
  onChangePlayer: () => void;
  onLeaderboard: () => void;
};

export function MenuScreen({ playerName, onStart, onChangePlayer, onLeaderboard }: Props) {
  const [level, setLevel] = useState<Level | null>(null);

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <Text style={ui.h1}>Hola, {playerName}!</Text>

      <Card style={{ marginTop: 24 }}>
        <Text style={ui.h2}>1. Nivell de dificultat</Text>
        <View style={s.col}>
          {(Object.keys(LEVELS) as Level[]).map((key) => (
            <Button
              key={key}
              label={LEVELS[key].label}
              sublabel={`Taules del ${LEVELS[key].range}`}
              color={LEVELS[key].color}
              selected={level === key}
              onPress={() => setLevel(key)}
            />
          ))}
        </View>

        <Text style={[ui.h2, { marginTop: 26 }]}>2. Mode de joc</Text>
        {!level ? <Text style={[ui.label, { marginTop: 6 }]}>Tria primer un nivell</Text> : null}
        <View style={s.col}>
          {(Object.keys(MODES) as Mode[]).map((key) => (
            <Button
              key={key}
              label={MODES[key].label}
              sublabel={MODES[key].detail}
              color={MODES[key].color}
              disabled={!level}
              onPress={() => level && onStart(level, key)}
            />
          ))}
        </View>
      </Card>

      <View style={s.row}>
        <Button label="Canviar Jugador" color={colors.gray} small onPress={onChangePlayer} style={{ flex: 1 }} />
        <Button label="Veure Rànquing" color={colors.purple} small onPress={onLeaderboard} style={{ flex: 1 }} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  wrap: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  col: { gap: 12, marginTop: 14 },
  row: { flexDirection: 'row', gap: 12, marginTop: 20 },
});
