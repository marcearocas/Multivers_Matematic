import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, colors, styles as ui } from '../components/ui';
import { Level, LEVELS, MODES } from '../game';
import { getScores, ScoreEntry } from '../storage';

type Filter = 'all' | Level;

const FILTERS: { key: Filter; label: string; color: string }[] = [
  { key: 'all', label: 'Tots', color: colors.purple },
  ...(Object.keys(LEVELS) as Level[]).map((k) => ({ key: k, label: LEVELS[k].label, color: LEVELS[k].color })),
];

export function LeaderboardScreen({ onBack }: { onBack: () => void }) {
  const [scores, setScores] = useState<ScoreEntry[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    getScores().then(setScores);
  }, []);

  const rows = useMemo(
    () =>
      (scores ?? [])
        .filter((x) => filter === 'all' || x.level === filter)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20),
    [scores, filter],
  );

  return (
    <View style={s.wrap}>
      <Text style={ui.h1}>🏆 Rànquing 🏆</Text>

      <View style={s.filters}>
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            label={f.label}
            color={f.color}
            small
            selected={filter === f.key}
            onPress={() => setFilter(f.key)}
            style={{ flex: 1, paddingHorizontal: 4 }}
          />
        ))}
      </View>

      <FlatList
        style={s.list}
        contentContainerStyle={{ gap: 8, padding: 10 }}
        data={rows}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={[ui.label, { padding: 20 }]}>{scores === null ? 'Carregant puntuacions...' : 'No hi ha puntuacions encara.'}</Text>
        }
        renderItem={({ item, index }) => (
          <View style={s.row}>
            <Text style={s.pos}>{index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.name} numberOfLines={1}>
                {item.playerName}
              </Text>
              <Text style={s.meta}>
                {LEVELS[item.level]?.label} · {MODES[item.mode]?.label}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.score}>{item.score}</Text>
              <Text style={s.meta}>
                {item.accuracy}% · {item.date}
              </Text>
            </View>
          </View>
        )}
      />

      <Button label="Tornar Enrere" color={colors.gray} onPress={onBack} style={{ marginTop: 14 }} />
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, padding: 20 },
  filters: { flexDirection: 'row', gap: 8, marginTop: 18, marginBottom: 14 },
  list: { flex: 1, backgroundColor: colors.inset, borderRadius: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(31,41,55,0.8)',
    padding: 12,
    borderRadius: 12,
  },
  pos: { color: colors.yellow, fontSize: 20, fontWeight: '800', width: 36, textAlign: 'center' },
  name: { color: '#fff', fontSize: 17, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 13 },
  score: { color: colors.yellow, fontSize: 22, fontWeight: '800' },
});
