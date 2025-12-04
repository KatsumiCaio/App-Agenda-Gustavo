import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AgendaProvider } from './src/contexts/AgendaContext';
import { Navigation } from './src/Navigation';
import { Colors } from './src/theme/colors';

export default function App() {
  return (
    <AgendaProvider>
      <Navigation />
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
    </AgendaProvider>
  );
}
