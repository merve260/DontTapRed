
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const colors = ['red', 'green', 'blue', 'yellow'];

export default function GameScreen() {
  const [currentColor, setCurrentColor] = useState('green');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [intervalSpeed, setIntervalSpeed] = useState(1000);
  const [badge, setBadge] = useState('');
  const navigation = useNavigation();


  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (elapsedTime >= 90) setIntervalSpeed(300);
    else if (elapsedTime >= 60) setIntervalSpeed(500);
    else if (elapsedTime >= 30) setIntervalSpeed(700);
  }, [elapsedTime]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentColor(randomColor);
    }, intervalSpeed);
    return () => clearInterval(interval);
  }, [intervalSpeed, gameOver]);

  const handleTap = async () => {
    if (currentColor === 'red') {
      setGameOver(true);
      const oldScore = parseInt(await AsyncStorage.getItem('totalScore') || '0', 10);
      await AsyncStorage.setItem('totalScore', (oldScore + score).toString());

      if (score >= 80) setBadge('👑 Reflex Master');
      else if (score >= 50) setBadge('🔥 Speed Demon');
      else if (score >= 30) setBadge('⚡ Tap Ninja');
      else if (score >= 10) setBadge('🎯 Quick Starter');
      else setBadge('🐣 Warm-Up');
    } else {
      setScore(s => s + 1);
    }
  };

  const restartGame = () => {
    setScore(0);
    setElapsedTime(0);
    setIntervalSpeed(1000);
    setGameOver(false);
    setCurrentColor('green');
    setBadge('');
  };

  return (
  <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
    {gameOver ? (
  <View style={{ alignItems: 'center' }}>
    <Text style={styles.gameOverText}>Game Over</Text>
    {badge !== '' && <Text style={styles.badge}>{badge}</Text>}
    <Text style={styles.score}>Score: {score}</Text>

    <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
      <Text style={styles.restartText}>Play Again</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Start')}>
      <Text style={styles.menuButtonText}>Startseite</Text>
    </TouchableOpacity>
  </View>
) : (

      <>
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity
          onPress={handleTap}
          style={[styles.button, { backgroundColor: currentColor }]}
        >
          <Text style={{ opacity: 0 }}>Tap</Text>
        </TouchableOpacity>
      </>
    )}
  </LinearGradient>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  button: {
    width: 200,
    height: 200,
    borderRadius: 20,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  gameOverText: {
    fontSize: 36,
    color: '#ff4d4d',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: '#ffffff22',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  restartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    fontSize: 24,
    color: '#ffd700',
    marginTop: 10,
    textAlign: 'center',
  },
  menuButton: {
  marginTop: 15,
  backgroundColor: '#334155',
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 10,
},
menuButtonText: {
  color: '#f1f5f9',
  fontSize: 16,
  fontWeight: '600',
},

});
