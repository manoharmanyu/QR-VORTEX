import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { HistoryProvider } from './src/context/HistoryContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <HistoryProvider>
        <AppNavigator />
      </HistoryProvider>
    </SafeAreaProvider>
  );
}
