import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, colors, styles as ui } from '../components/ui';

type Props = {
  initialName: string;
  onEnter: (name: string) => void;
  onLeaderboard: () => void;
};

export function LoginScreen({ initialName, onEnter, onLeaderboard }: Props) {
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>Multivers Matemàtic</Text>
        <Text style={ui.label}>Domina les multiplicacions i conquereix el cosmos!</Text>
      </View>

      <Card>
        <Text style={ui.h2}>Benvingut al Multivers!</Text>
        <Text style={[ui.label, { marginTop: 12 }]}>Introdueix el teu nom per començar:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="El teu nom"
          placeholderTextColor={colors.muted}
          maxLength={20}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={() => trimmed && onEnter(trimmed)}
          style={s.input}
          accessibilityLabel="Nom del jugador"
        />
        <Button label="Entrar al Joc" onPress={() => onEnter(trimmed)} disabled={!trimmed} />
        <Button label="Veure Rànquing" color={colors.purple} small onPress={onLeaderboard} style={{ marginTop: 14 }} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { marginBottom: 28, gap: 8 },
  title: { color: '#a78bfa', fontSize: 36, fontWeight: '900', textAlign: 'center' },
  input: {
    marginVertical: 18,
    fontSize: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderColor: colors.cardBorder,
    borderWidth: 1,
    color: '#fff',
    textAlign: 'center',
  },
});
