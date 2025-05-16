import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StartScreen from '../screens/StartScreen';
import GameScreen from '../screens/GameScreen';
import ChallengeGame from '../screens/ChallengeScreen';

export type RootStackParamList = {
  Start: undefined;
  MainGame: undefined;
  Challenge30: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="MainGame" component={GameScreen} />
        <Stack.Screen name="Challenge30" component={ChallengeGame} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
