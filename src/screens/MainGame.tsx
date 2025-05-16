import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const colors = ['red', 'green', 'blue', 'yellow'];

export default function MainGame() {
  const [currentColor, setCurrentColor] = useState('green');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [intervalSpeed, setIntervalSpeed] = useState(1000);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setCurrentColor(randomColor);
    }, intervalSpeed);
    return () => clearInterval(timer);
  }, [intervalSpeed, gameOver]);

  const updateTotalScore = async (scoreToAdd: number) => {
    const oldScore = parseInt(await AsyncStorage.getItem('totalScore') || '0');
    const newScore = oldScore + scoreToAdd;
    await AsyncStorage.setItem('totalScore', newScore.toString());
  };

  const handleTap = () => {
    if (currentColor === 'red') {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    } else {
      const newScore = score + 1;
      setScore(newScore);
      if (newScore % 10 === 0 && intervalSpeed > 300) {
        setIntervalSpeed((prev) => prev - 100);
      }
    }
  };

  const restartGame = () => {
    updateTotalScore(score);
    setScore(0);
    setIntervalSpeed(1000);
    setGameOver(false);
  };

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
      {gameOver ? (
        <>
          <Text style={styles.gameOver}>Game Over</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity style={styles.button} onPress={restartGame}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.score}>Score: {score}</Text>
          <TouchableOpacity
            onPress={handleTap}
            style={[styles.tapArea, { backgroundColor: currentColor }]}
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
    color: 'white',
    fontSize: 30,
    marginBottom: 20,
  },
  tapArea: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOver: {
    color: '#ff4d4d',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
