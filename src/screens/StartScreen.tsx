import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function StartScreen() {
  const navigation = useNavigation();
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchScore = async () => {
      const storedScore = await AsyncStorage.getItem('totalScore');
      if (storedScore) {
        setTotalScore(parseInt(storedScore, 10));
      }
    };
    fetchScore();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Don't Tap Red</Text>

      <Text style={styles.score}>Total Score: {totalScore}</Text>

      <TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('MainGame')}
>
  <Text style={styles.buttonText}>Play</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.button}
  onPress={() => navigation.navigate('ChallengeScreen')}
>
  <Text style={styles.buttonText}>30s Challenge</Text>
</TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  score: {
    color: '#facc15',
    fontSize: 20,
    marginBottom: 40,
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  button: {
  backgroundColor: '#334155', // koyu gri-mavi
  width: 220,
  height: 50,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
  marginTop: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
},
buttonText: {
  color: '#f1f5f9', // açık gri
  fontSize: 18,
  fontWeight: '600',
},

});
