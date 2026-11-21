import { ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

export const colors = {
  bg: '#0d1117',
  bgCenter: '#1a202c',
  card: 'rgba(31, 41, 55, 0.85)',
  cardBorder: '#374151',
  inset: 'rgba(17, 24, 39, 0.7)',
  text: '#ffffff',
  muted: '#9ca3af',
  yellow: '#facc15',
  blue: '#60a5fa',
  green: '#22c55e',
  red: '#ef4444',
  purple: '#9333ea',
  gray: '#4b5563',
};

export function Stars({ count = 90 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        key: i,
        left: `${Math.random() * 100}%` as const,
        top: `${Math.random() * 100}%` as const,
        size: 0.8 + Math.random() * 2.2,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    [count],
  );
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s) => (
        <View
          key={s.key}
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: '#fff',
            opacity: s.opacity,
          }}
        />
      ))}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  color?: string;
  sublabel?: string;
  selected?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, color = '#2563eb', sublabel, selected, disabled, small, style }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        small && styles.buttonSmall,
        { backgroundColor: color, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
        selected && styles.buttonSelected,
        pressed && { transform: [{ scale: 0.97 }] },
        style,
      ]}
    >
      <Text style={[styles.buttonText, small && styles.buttonTextSmall]}>{label}</Text>
      {sublabel ? <Text style={styles.buttonSub}>{sublabel}</Text> : null}
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonSmall: { paddingVertical: 9, paddingHorizontal: 14, minHeight: 40, borderRadius: 12 },
  buttonSelected: { borderWidth: 3, borderColor: '#fff' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  buttonTextSmall: { fontSize: 15 },
  buttonSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  h1: { color: colors.text, fontSize: 30, fontWeight: '800', textAlign: 'center' },
  h2: { color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' },
  label: { color: colors.muted, fontSize: 15, textAlign: 'center' },
});
