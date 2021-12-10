import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
// import AsyncStorage from '@rearct-native-async-storage/async-storage';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './StackNavigator';

export default function App() {
  return (
    <NavigationContainer>
      {/* HOC- Higher Order Components */}
      <AuthProvider>
        {/* Passes down the cool auth stuff to the children */}
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
