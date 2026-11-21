import { useCallback, useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors, Stars } from './src/components/ui';
import { GameResult, Level, Mode } from './src/game';
import { GameScreen } from './src/screens/GameScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { getLastPlayer, saveScore, setLastPlayer } from './src/storage';

type Screen = 'login' | 'menu' | 'game' | 'results' | 'leaderboard';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState<Screen>('login');
  const [returnTo, setReturnTo] = useState<Screen>('login');
  const [player, setPlayer] = useState('');
  const [config, setConfig] = useState<{ level: Level; mode: Mode } | null>(null);
  const [gameId, setGameId] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);

  useEffect(() => {
    getLastPlayer().then((name) => {
      setPlayer(name);
      setReady(true);
    });
  }, []);

  const openLeaderboard = (from: Screen) => {
    setReturnTo(from);
    setScreen('leaderboard');
  };

  const startGame = (level: Level, mode: Mode) => {
    setConfig({ level, mode });
    setGameId((n) => n + 1);
    setScreen('game');
  };

  const finishGame = useCallback(async (r: GameResult) => {
    setResult(r);
    setScreen('results');
    await saveScore(r);
  }, []);

  // Botó enrere d'Android: torna a la pantalla anterior en lloc de tancar l'app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'leaderboard') setScreen(returnTo);
      else if (screen === 'game' || screen === 'results') setScreen('menu');
      else if (screen === 'menu') setScreen('login');
      else return false;
      return true;
    });
    return () => sub.remove();
  }, [screen, returnTo]);

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <Stars />
        <SafeAreaView style={styles.safe}>
          {!ready ? null : screen === 'login' ? (
            <LoginScreen
              initialName={player}
              onEnter={(name) => {
                setPlayer(name);
                setLastPlayer(name);
                setScreen('menu');
              }}
              onLeaderboard={() => openLeaderboard('login')}
            />
          ) : screen === 'menu' ? (
            <MenuScreen
              playerName={player}
              onStart={startGame}
              onChangePlayer={() => setScreen('login')}
              onLeaderboard={() => openLeaderboard('menu')}
            />
          ) : screen === 'game' && config ? (
            <GameScreen
              key={gameId}
              playerName={player}
              level={config.level}
              mode={config.mode}
              onFinish={finishGame}
              onQuit={() => setScreen('menu')}
            />
          ) : screen === 'results' && result ? (
            <ResultsScreen
              result={result}
              onRestart={() => startGame(result.level, result.mode)}
              onLeaderboard={() => openLeaderboard('results')}
              onHome={() => setScreen('menu')}
            />
          ) : screen === 'leaderboard' ? (
            <LeaderboardScreen onBack={() => setScreen(returnTo)} />
          ) : null}
        </SafeAreaView>
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  safe: { flex: 1 },
});
