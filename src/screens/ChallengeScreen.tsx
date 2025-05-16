import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const colors = ['red', 'green', 'blue', 'yellow'];

export default function ChallengeScreen() {
  const [currentColor, setCurrentColor] = useState('green');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (gameOver) return;

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 1) {
          clearInterval(countdown);
          setGameOver(true);
          updateTotalScore(score);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const colorInterval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentColor(randomColor);
    }, 600);
    return () => clearInterval(colorInterval);
  }, [gameOver]);

  const handleTap = () => {
    if (currentColor === 'red') {
      setGameOver(true);
    } else {
      setScore(prev => prev + 5);
    }
  };

  const updateTotalScore = async (scoreToAdd: number) => {
    const oldScore = parseInt(await AsyncStorage.getItem('totalScore') || '0', 10);
    const newScore = oldScore + scoreToAdd;
    await AsyncStorage.setItem('totalScore', newScore.toString());
  };

  const restart = () => {
    setScore(0);
    setTimer(30);
    setGameOver(false);
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
      <Text style={styles.timer}>⏱ {timer}s</Text>
      {gameOver ? (
        <>
          <Text style={styles.gameOver}>Finished!</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Start")}>
            <Text style={styles.buttonText}>Back to Menu</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.score}>+5 per tap</Text>
          <TouchableOpacity onPress={handleTap} style={[styles.tapBox, { backgroundColor: currentColor }]}>
            <Text style={{ opacity: 0 }}>tap</Text>
          </TouchableOpacity>
        </>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tapBox: {
    width: 200, height: 200,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  score: { fontSize: 24, color: '#fff', marginBottom: 30 },
  gameOver: { fontSize: 32, color: '#f87171', marginBottom: 20 },
  button: { backgroundColor: '#0ea5e9', padding: 12, marginTop: 20, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  timer: { fontSize: 28, color: '#facc15', position: 'absolute', top: 50 }
});
